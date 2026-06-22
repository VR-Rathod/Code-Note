---
seoTitle: Vulkan and GPU Architecture From Scratch – Complete Beginner to Advanced Guide
description: "Learn Vulkan and GPU hardware architecture completely from scratch. Covers GPU vs CPU, warps, memory hierarchy, Vulkan instance/device/pipeline/draw, synchronization, and compute shaders — beginner to advanced."
keywords: "Vulkan from scratch, GPU architecture, CPU vs GPU, warps wavefronts, VRAM, Vulkan instance, VkDevice, VkPipeline, render pass, synchronization, compute shader, beginner Vulkan tutorial"
treeTitle: Game Development - Graphics Programming From Scratch - Vulkan GPU Architecture
---

tags:: graphics, vulkan, gpu-architecture, beginner-to-advanced, hardware
title:: GPFS Vulkan GPU Architecture

- # Vulkan & GPU Architecture — From Scratch
	- Understand how the GPU hardware actually works and how Vulkan gives you direct control over it.
	- **Prerequisites:** Basic C++ knowledge, understanding of pointers and structs
	- Parent: [[Graphics Programming From Scratch]]
- ---
- ## 🟢 Chapter 1 — What is a GPU and Why Does It Exist?
  collapsed:: true
	- ### The Rendering Problem
		- A 1080p screen has 1,920 × 1,080 = **2,073,600 pixels**
		- At 60 FPS, we must compute ~**124 million pixels per second**
		- Each pixel needs lighting, texture sampling, shadow calculation...
		- A CPU with 8 cores handling this serially would need **15 million pixels per core per second**
		- That's impossible. We need a completely different kind of processor.
	- ### The GPU Solution: Massive Parallelism
		- Instead of a few powerful cores, a GPU has **thousands of simple cores**
		- Each core is slower and simpler than a CPU core — but there are SO MANY of them
		- All cores run the SAME program (your shader) on different data (different pixels)
		- This pattern is called **SIMD** — Single Instruction, Multiple Data
		- ```
		  CPU: 8 cores × fast = handles 8 things well
		  GPU: 10,000 cores × slower = handles 10,000 things at once
		  
		  For rendering: we always need to do the SAME thing to MANY pixels
		  → GPU wins overwhelmingly
		  ```
	- ### CPU vs GPU — Side by Side
		- ```
		  CPU Core (1 of 8–32):              GPU Core (1 of thousands):
		  ┌─────────────────────┐            ┌───────────┐
		  │ Large L1/L2/L3 Cache│            │ Tiny cache│
		  │ Branch Predictor    │            │ Simple ALU│
		  │ Out-of-Order Exec   │            │ No branch │
		  │ Multiple GHz        │            │ prediction│
		  │ Complex logic unit  │            └───────────┘
		  └─────────────────────┘
		  
		  Memory: 100 GB/s bandwidth         Memory: ~1 TB/s bandwidth (GDDR6X)
		  ```
		- | Feature | CPU | GPU |
		  |---|---|---|
		  | Core count | 4–64 | 1,000–18,000+ |
		  | Clock speed | 3–5 GHz | 1–2 GHz |
		  | Memory bandwidth | ~100 GB/s | ~1 TB/s (GDDR6X) |
		  | Best at | Sequential code, branches, logic | Parallel math, throughput |
		  | Latency | Low | High (hidden by parallelism) |
		  | Context switching | Cheap | Expensive (warps help) |
- ---
- ## 🟢 Chapter 2 — How the GPU Executes Your Shader
  collapsed:: true
	- ### Threads, Warps, and Workgroups
		- When you run a shader, the GPU doesn't run one instance at a time
		- It runs **thousands of instances simultaneously**, organized into a hierarchy:
		- ```
		  Thread          → Single shader invocation (one pixel, one vertex)
		      ↓
		  Warp / Wavefront → Group of threads that execute IN LOCKSTEP
		                     NVIDIA: 32 threads per warp
		                     AMD:    64 threads per wavefront
		      ↓
		  Thread Block / Workgroup → Multiple warps sharing memory
		      ↓
		  Grid / Dispatch → All workgroups for one shader invocation
		  ```
		- A fragment shader for a 1080p frame launches **2 million threads** simultaneously
		- Each thread independently computes one pixel
	- ### The Warp — The Fundamental Execution Unit
		- The GPU scheduler assigns **one instruction** to an entire warp at once
		- All 32 threads in the warp execute the SAME instruction on DIFFERENT data
		- This is what enables massive throughput — one instruction decode → 32 results
	- ### Warp Divergence — The Hidden Performance Killer
		- What happens if threads in the same warp take different `if/else` paths?
		- ```glsl
		  if (someCondition) {
		      // Path A: 16 threads want to go here
		      result = expensiveCalcA();
		  } else {
		      // Path B: other 16 threads want to go here
		      result = expensiveCalcB();
		  }
		  ```
		- **Both paths execute!** Threads not on the active path are **masked off** (results discarded)
		- The warp takes `time(A) + time(B)` instead of `max(time(A), time(B))`
		- This is called **warp divergence** — it can halve or worse your throughput
		- > [!warning] Performance Rule
		  > Avoid `if/else` in shaders when possible. Use `mix()`, `step()`, `clamp()` instead.
		  > These select values without branching.
		  > `float v = condition ? a : b;` → still branches!
		  > `float v = mix(b, a, step(0.5, condition));` → no branch
	- ### Latency Hiding
		- Memory access (reading from VRAM) has high latency: ~500–1000 clock cycles
		- CPUs use large caches + out-of-order execution to hide this
		- GPUs use **warp switching**: while one warp is waiting for memory, run another warp
		- This is why GPUs need MANY warps in flight — to always have something ready to run
		- This is also why register usage matters: more registers = fewer warps can be in flight
- ---
- ## 🟢 Chapter 3 — GPU Memory Hierarchy
  collapsed:: true
	- Understanding memory is critical for writing efficient shaders.
	- ### Memory Types (Fastest → Slowest)
		- ```
		  Registers        → Per thread, fastest, ~256KB per SM
		     ↓ ~10× slower
		  Shared Memory    → Per workgroup, very fast, 32–128KB per SM
		     ↓ ~5× slower
		  L1 Cache         → Per SM, automatic, 32–128KB
		     ↓ ~5× slower
		  L2 Cache         → Whole GPU, 4–80MB
		     ↓ ~10× slower
		  VRAM (GDDR6)     → Off-chip, ~1TB/s bandwidth, GBs
		     ↓ ~10× slower
		  System RAM       → CPU side, ~100GB/s, accessed via PCIe
		  ```
	- | Memory | Location | Speed | Size | Scope |
	  |---|---|---|---|---|
	  | Registers | On-chip | Fastest | ~256KB per SM | Per thread |
	  | Shared / LDS | On-chip | Very fast | 32–128KB per SM | Per workgroup |
	  | L1 Cache | On-chip | Fast | 32–128KB per SM | Per SM |
	  | L2 Cache | On-chip | Medium | 4–80MB | Whole GPU |
	  | VRAM (GDDR6) | Off-chip | 1 TB/s | 8–80GB | Whole GPU |
	  | System RAM | Off-chip | 100 GB/s | GBs | Via PCIe |
	- ### Coalesced Memory Access
		- When threads in a warp read from adjacent memory addresses → **coalesced**
		- The GPU fetches ONE large chunk of memory → full bandwidth utilization
		- When threads read random addresses → **uncoalesced** → many separate small fetches → terrible performance
		- ```glsl
		  // GOOD: Thread i reads index i → adjacent → coalesced
		  float value = buffer[gl_GlobalInvocationID.x];
		  
		  // BAD: Threads read random positions → uncoalesced
		  float value = buffer[hash(gl_GlobalInvocationID.x)];
		  ```
	- ### Shared Memory (LDS — Local Data Store)
		- A fast scratchpad shared by all threads in a workgroup
		- Access is 5–10× faster than VRAM
		- Key optimization: load from VRAM once to shared mem → use many times
		- ```glsl
		  // Compute shader using shared memory for matrix multiply
		  shared float tile[16][16];  // 16×16 tile in shared memory
		  
		  // Each thread loads one element from global memory to shared
		  tile[localY][localX] = globalMatrix[globalY * width + globalX];
		  barrier();  // wait for ALL threads in workgroup to finish loading
		  
		  // Now all threads can use the tile very fast
		  for (int k = 0; k < 16; k++) {
		      result += tile[localY][k] * otherTile[k][localX];
		  }
		  ```
- ---
- ## 🟡 Chapter 4 — What is Vulkan? Why is it Hard?
  collapsed:: true
	- ### The Old Way: OpenGL
		- OpenGL (1992) has a simple API — load a shader, bind a texture, draw
		- The GPU driver does A LOT of work behind the scenes:
			- Compiles shaders at draw time
			- Manages memory allocation
			- Infers synchronization (when can GPU start drawing?)
			- Validates your calls → slow
		- The driver overhead became a bottleneck — 10-20% of CPU time just in driver code
	- ### The New Way: Vulkan (2016)
		- Vulkan removes driver magic — YOU do everything explicitly:
			- Pre-compile shaders to SPIR-V
			- Allocate GPU memory manually
			- Specify synchronization explicitly (barriers, semaphores)
			- No validation overhead in release builds
		- **More code, but full control and predictable performance**
		- ```
		  OpenGL "draw a triangle":  ~10 lines
		  Vulkan "draw a triangle":  ~800 lines
		  
		  But: Vulkan is faster, more predictable, and scales to multi-threaded rendering
		  ```
	- ### When to Use Vulkan
		- You're building a game engine or custom renderer
		- You need maximum GPU performance
		- You need cross-platform (Windows, Linux, Android, macOS via MoltenVK)
		- You're learning GPU architecture (Vulkan teaches you exactly how the GPU works)
		- **NOT for:** a quick graphics demo (use WebGPU or SDL), a first graphics project (use OpenGL)
	- ### Vulkan Alternatives
		- | API | Platform | Learning Curve | Use When |
		  |---|---|---|---|
		  | OpenGL | Cross-platform | Low | Legacy, learning |
		  | Vulkan | Cross-platform | Very High | Games, engines |
		  | DirectX 12 | Windows/Xbox | Very High | Windows/Xbox games |
		  | Metal | Apple only | High | iOS/macOS |
		  | WebGPU | Browser+native | Medium | Web, tools |
- ---
- ## 🟡 Chapter 5 — Vulkan Architecture Overview
  collapsed:: true
	- ### The Vulkan Object Hierarchy
		- ```mermaid
		  graph TD
		      App["Your Application"]
		      Instance["VkInstance\nConnection to Vulkan runtime"]
		      PhysDev["VkPhysicalDevice\nGPU hardware — read capabilities"]
		      LogDev["VkDevice\nLogical device — do actual work"]
		      Queue["VkQueue\nSubmit command buffers to GPU"]
		      CmdPool["VkCommandPool\nAllocate command buffers"]
		      CmdBuf["VkCommandBuffer\nRecord draw/compute commands"]
		      SwapChain["VkSwapchainKHR\nPresent frames to screen"]
		      RenderPass["VkRenderPass\nDefine framebuffer attachments"]
		      Pipeline["VkPipeline\nShaders + all fixed-function state"]
		      Buffer["VkBuffer\nVertex, index, uniform data"]
		      Image["VkImage\nTextures, render targets"]
		      Memory["VkDeviceMemory\nGPU memory allocation"]
		  
		      App --> Instance --> PhysDev --> LogDev
		      LogDev --> Queue
		      LogDev --> CmdPool --> CmdBuf
		      LogDev --> SwapChain
		      LogDev --> RenderPass --> Pipeline
		      LogDev --> Buffer --> Memory
		      LogDev --> Image --> Memory
		      CmdBuf --> Queue
		  ```
	- ### Key Concept: Everything is Explicit
		- No hidden state like OpenGL's `glBind...` functions
		- Objects are created once (expensive), used many times (cheap)
		- Lifetime and dependencies are clear and explicit
- ---
- ## 🟠 Chapter 6 — Vulkan from Zero: Step by Step
  collapsed:: true
	- ### Step 1: Instance — Connect to Vulkan
		- ```cpp
		  // Tell Vulkan about your application
		  VkApplicationInfo appInfo{};
		  appInfo.sType              = VK_STRUCTURE_TYPE_APPLICATION_INFO;
		  appInfo.pApplicationName   = "My Game";
		  appInfo.applicationVersion = VK_MAKE_VERSION(1, 0, 0);
		  appInfo.apiVersion         = VK_API_VERSION_1_3;  // Vulkan 1.3
		  
		  VkInstanceCreateInfo instanceInfo{};
		  instanceInfo.sType            = VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO;
		  instanceInfo.pApplicationInfo = &appInfo;
		  
		  // Enable validation layers (ONLY in debug builds!)
		  // Validation layers catch your mistakes and print helpful errors
		  const char* validationLayers[] = {"VK_LAYER_KHRONOS_validation"};
		  instanceInfo.enabledLayerCount   = 1;
		  instanceInfo.ppEnabledLayerNames = validationLayers;
		  
		  // Enable extensions needed for windowed rendering
		  const char* extensions[] = {"VK_KHR_surface", "VK_KHR_win32_surface"};
		  instanceInfo.enabledExtensionCount   = 2;
		  instanceInfo.ppEnabledExtensionNames = extensions;
		  
		  VkInstance instance;
		  VkResult result = vkCreateInstance(&instanceInfo, nullptr, &instance);
		  // ALWAYS check result == VK_SUCCESS in real code!
		  ```
	- ### Step 2: Physical Device — Pick the GPU
		- ```cpp
		  // Enumerate all available GPUs
		  uint32_t deviceCount = 0;
		  vkEnumeratePhysicalDevices(instance, &deviceCount, nullptr);
		  
		  std::vector<VkPhysicalDevice> devices(deviceCount);
		  vkEnumeratePhysicalDevices(instance, &deviceCount, devices.data());
		  
		  // Check each GPU's properties and features
		  for (auto& device : devices) {
		      VkPhysicalDeviceProperties props;
		      vkGetPhysicalDeviceProperties(device, &props);
		      
		      // props.deviceType: DISCRETE_GPU, INTEGRATED_GPU, CPU...
		      // props.limits: maxTextureSize, maxUniformBufferRange, etc.
		      // props.deviceName: "NVIDIA RTX 4090"
		      
		      VkPhysicalDeviceFeatures features;
		      vkGetPhysicalDeviceFeatures(device, &features);
		      // features.geometryShader, features.samplerAnisotropy, etc.
		  }
		  
		  VkPhysicalDevice physicalDevice = devices[0];  // pick best GPU
		  ```
	- ### Step 3: Logical Device and Queues
		- ```cpp
		  // Find queue families — groups of queues with specific capabilities
		  // Graphics queue: can render
		  // Compute queue: can run compute shaders
		  // Transfer queue: can copy data
		  // Present queue: can present to a window
		  
		  uint32_t queueFamilyCount = 0;
		  vkGetPhysicalDeviceQueueFamilyProperties(physicalDevice, &queueFamilyCount, nullptr);
		  std::vector<VkQueueFamilyProperties> queueFamilies(queueFamilyCount);
		  vkGetPhysicalDeviceQueueFamilyProperties(physicalDevice, &queueFamilyCount, queueFamilies.data());
		  
		  // Find a queue family that supports graphics
		  uint32_t graphicsFamily = -1;
		  for (uint32_t i = 0; i < queueFamilies.size(); i++) {
		      if (queueFamilies[i].queueFlags & VK_QUEUE_GRAPHICS_BIT) {
		          graphicsFamily = i; break;
		      }
		  }
		  
		  // Create a logical device with one graphics queue
		  float priority = 1.0f;
		  VkDeviceQueueCreateInfo queueInfo{};
		  queueInfo.sType            = VK_STRUCTURE_TYPE_DEVICE_QUEUE_CREATE_INFO;
		  queueInfo.queueFamilyIndex = graphicsFamily;
		  queueInfo.queueCount       = 1;
		  queueInfo.pQueuePriorities = &priority;
		  
		  VkDeviceCreateInfo deviceInfo{};
		  deviceInfo.sType                = VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO;
		  deviceInfo.queueCreateInfoCount = 1;
		  deviceInfo.pQueueCreateInfos    = &queueInfo;
		  
		  VkDevice device;
		  vkCreateDevice(physicalDevice, &deviceInfo, nullptr, &device);
		  
		  VkQueue graphicsQueue;
		  vkGetDeviceQueue(device, graphicsFamily, 0, &graphicsQueue);
		  ```
	- ### Step 4: Memory and Buffers
		- ```cpp
		  // Create a vertex buffer
		  VkBufferCreateInfo bufferInfo{};
		  bufferInfo.sType       = VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO;
		  bufferInfo.size        = sizeof(Vertex) * vertexCount;
		  bufferInfo.usage       = VK_BUFFER_USAGE_VERTEX_BUFFER_BIT;
		  bufferInfo.sharingMode = VK_SHARING_MODE_EXCLUSIVE;
		  
		  VkBuffer vertexBuffer;
		  vkCreateBuffer(device, &bufferInfo, nullptr, &vertexBuffer);
		  
		  // Find out how much GPU memory it needs
		  VkMemoryRequirements memReqs;
		  vkGetBufferMemoryRequirements(device, vertexBuffer, &memReqs);
		  
		  // Allocate GPU memory
		  // (In real projects: use VMA — Vulkan Memory Allocator — for this)
		  VkMemoryAllocateInfo allocInfo{};
		  allocInfo.sType           = VK_STRUCTURE_TYPE_MEMORY_ALLOCATE_INFO;
		  allocInfo.allocationSize  = memReqs.size;
		  allocInfo.memoryTypeIndex = findMemoryType(
		      memReqs.memoryTypeBits,
		      VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT |  // CPU can write
		      VK_MEMORY_PROPERTY_HOST_COHERENT_BIT   // writes are visible to GPU
		  );
		  
		  VkDeviceMemory bufferMemory;
		  vkAllocateMemory(device, &allocInfo, nullptr, &bufferMemory);
		  vkBindBufferMemory(device, vertexBuffer, bufferMemory, 0);
		  
		  // Copy vertex data from CPU to GPU
		  void* data;
		  vkMapMemory(device, bufferMemory, 0, bufferInfo.size, 0, &data);
		  memcpy(data, vertices.data(), bufferInfo.size);
		  vkUnmapMemory(device, bufferMemory);
		  ```
		- > [!tip] Use VMA in Real Projects
		  > `vkAllocateMemory` must be called minimally (GPU drivers have limits ~4096 allocations)
		  > Use the [Vulkan Memory Allocator](https://github.com/GPUOpen-LibrariesAndSDKs/VulkanMemoryAllocator) library
		  > It handles suballocation, memory type selection, and defragmentation automatically
	- ### Step 5: Shaders and Pipeline
		- ```cpp
		  // Shaders must be compiled to SPIR-V bytecode
		  // glslc vertex.vert -o vertex.spv
		  // glslc fragment.frag -o fragment.spv
		  
		  // Load compiled SPIR-V
		  auto vertCode = readFile("vertex.spv");
		  auto fragCode = readFile("fragment.spv");
		  
		  VkShaderModuleCreateInfo vertInfo{};
		  vertInfo.sType    = VK_STRUCTURE_TYPE_SHADER_MODULE_CREATE_INFO;
		  vertInfo.codeSize = vertCode.size();
		  vertInfo.pCode    = reinterpret_cast<const uint32_t*>(vertCode.data());
		  
		  VkShaderModule vertModule, fragModule;
		  vkCreateShaderModule(device, &vertInfo, nullptr, &vertModule);
		  // (similar for fragment shader)
		  
		  // Shader stages in the pipeline
		  VkPipelineShaderStageCreateInfo vertStage{};
		  vertStage.sType  = VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO;
		  vertStage.stage  = VK_SHADER_STAGE_VERTEX_BIT;
		  vertStage.module = vertModule;
		  vertStage.pName  = "main";  // entry point function name
		  
		  // (similar for fragStage with VK_SHADER_STAGE_FRAGMENT_BIT)
		  
		  VkPipelineShaderStageCreateInfo shaderStages[] = {vertStage, fragStage};
		  ```
	- ### Step 6: Recording Command Buffers
		- ```cpp
		  // Command buffers record your draw calls
		  // They are submitted to the GPU queue for execution
		  
		  VkCommandBufferBeginInfo beginInfo{};
		  beginInfo.sType = VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO;
		  
		  vkBeginCommandBuffer(commandBuffer, &beginInfo);
		  
		      // Start a render pass (begins rendering to framebuffer)
		      VkRenderPassBeginInfo renderPassInfo{};
		      renderPassInfo.sType       = VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO;
		      renderPassInfo.renderPass  = renderPass;
		      renderPassInfo.framebuffer = framebuffer;
		      VkClearValue clearColor = {{{0.0f, 0.0f, 0.0f, 1.0f}}};
		      renderPassInfo.clearValueCount = 1;
		      renderPassInfo.pClearValues    = &clearColor;
		      
		      vkCmdBeginRenderPass(commandBuffer, &renderPassInfo, VK_SUBPASS_CONTENTS_INLINE);
		      
		          vkCmdBindPipeline(commandBuffer, VK_PIPELINE_BIND_POINT_GRAPHICS, pipeline);
		          VkBuffer vertexBuffers[] = {vertexBuffer};
		          VkDeviceSize offsets[] = {0};
		          vkCmdBindVertexBuffers(commandBuffer, 0, 1, vertexBuffers, offsets);
		          vkCmdBindIndexBuffer(commandBuffer, indexBuffer, 0, VK_INDEX_TYPE_UINT32);
		          vkCmdDrawIndexed(commandBuffer, indexCount, 1, 0, 0, 0);
		          // indexCount: number of indices
		          // 1: number of instances
		          // 0, 0, 0: offsets
		      
		      vkCmdEndRenderPass(commandBuffer);
		  
		  vkEndCommandBuffer(commandBuffer);
		  
		  // Submit to GPU queue
		  VkSubmitInfo submitInfo{};
		  submitInfo.sType              = VK_STRUCTURE_TYPE_SUBMIT_INFO;
		  submitInfo.commandBufferCount = 1;
		  submitInfo.pCommandBuffers    = &commandBuffer;
		  
		  vkQueueSubmit(graphicsQueue, 1, &submitInfo, VK_NULL_HANDLE);
		  vkQueueWaitIdle(graphicsQueue);  // wait for GPU to finish
		  ```
- ---
- ## 🔴 Chapter 7 — Synchronization
  collapsed:: true
	- Synchronization is the hardest part of Vulkan. Understanding it requires understanding GPU parallelism.
	- ### Why Synchronization is Necessary
		- GPU operations are ASYNC — submitting commands doesn't mean they execute immediately
		- Without synchronization: you might read a texture before it's been written
		- Vulkan gives you tools to express: **"Operation B must happen after Operation A"**
	- ### Synchronization Primitives
		- | Primitive | Scope | Use For |
		  |---|---|---|
		  | VkFence | CPU-GPU | CPU waits for GPU work to finish |
		  | VkSemaphore | Queue-Queue | Signal between GPU queues |
		  | Pipeline Barrier | Command buffer | Memory/execution dependencies in one queue |
		  | VkEvent | Command buffer | Fine-grained within one queue |
	- ### Pipeline Barriers — Image Layout Transitions
		- Images must be in the correct layout for each use
		- ```cpp
		  // Transition image from UNDEFINED to COLOR_ATTACHMENT_OPTIMAL
		  VkImageMemoryBarrier barrier{};
		  barrier.sType               = VK_STRUCTURE_TYPE_IMAGE_MEMORY_BARRIER;
		  barrier.oldLayout           = VK_IMAGE_LAYOUT_UNDEFINED;
		  barrier.newLayout           = VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL;
		  barrier.srcAccessMask       = 0;
		  barrier.dstAccessMask       = VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT;
		  barrier.image               = image;
		  barrier.subresourceRange    = {VK_IMAGE_ASPECT_COLOR_BIT, 0, 1, 0, 1};
		  
		  vkCmdPipelineBarrier(
		      commandBuffer,
		      VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT,            // src: any stage
		      VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT, // dst: must wait until here
		      0, 0, nullptr, 0, nullptr,
		      1, &barrier
		  );
		  ```
		- | Image Layout | Used For |
		  |---|---|
		  | `UNDEFINED` | Don't care about contents |
		  | `COLOR_ATTACHMENT_OPTIMAL` | Writing to render target |
		  | `SHADER_READ_ONLY_OPTIMAL` | Sampling in shader |
		  | `TRANSFER_SRC_OPTIMAL` | Source of copy |
		  | `TRANSFER_DST_OPTIMAL` | Destination of copy |
		  | `PRESENT_SRC_KHR` | Ready to show on screen |
	- ### Fences — CPU Waiting for GPU
		- ```cpp
		  VkFenceCreateInfo fenceInfo{};
		  fenceInfo.sType = VK_STRUCTURE_TYPE_FENCE_CREATE_INFO;
		  VkFence fence;
		  vkCreateFence(device, &fenceInfo, nullptr, &fence);
		  
		  // Submit work with fence signal
		  VkSubmitInfo submitInfo{...};
		  vkQueueSubmit(queue, 1, &submitInfo, fence);  // fence signals when done
		  
		  // CPU waits here until GPU is done
		  vkWaitForFences(device, 1, &fence, VK_TRUE, UINT64_MAX);
		  vkResetFences(device, 1, &fence);  // reset for next frame
		  ```
	- ### Semaphores — GPU Waiting for GPU
		- ```cpp
		  VkSemaphore imageAvailable;   // signals: swapchain image is ready
		  VkSemaphore renderFinished;   // signals: rendering is complete
		  
		  // Acquire next swapchain image (signals imageAvailable)
		  vkAcquireNextImageKHR(device, swapChain, UINT64_MAX,
		      imageAvailable, VK_NULL_HANDLE, &imageIndex);
		  
		  // Submit rendering (waits on imageAvailable, signals renderFinished)
		  VkSubmitInfo submitInfo{};
		  submitInfo.waitSemaphoreCount   = 1;
		  submitInfo.pWaitSemaphores      = &imageAvailable;
		  submitInfo.signalSemaphoreCount = 1;
		  submitInfo.pSignalSemaphores    = &renderFinished;
		  vkQueueSubmit(graphicsQueue, 1, &submitInfo, fence);
		  
		  // Present (waits on renderFinished)
		  VkPresentInfoKHR presentInfo{};
		  presentInfo.waitSemaphoreCount = 1;
		  presentInfo.pWaitSemaphores    = &renderFinished;
		  vkQueuePresentKHR(presentQueue, &presentInfo);
		  ```
- ---
- ## 🔴 Chapter 8 — Compute Shaders
  collapsed:: true
	- Compute shaders let you run arbitrary parallel code on the GPU — not just rendering.
	- Used for: physics simulation, particle systems, image processing, AI inference, path tracing
	- ### A Compute Shader in GLSL
		- ```glsl
		  #version 450
		  
		  // Workgroup size: each workgroup has 16×16 = 256 threads
		  layout(local_size_x = 16, local_size_y = 16) in;
		  
		  // Storage image: we write pixels to this
		  layout(binding = 0, rgba8) uniform writeonly image2D outputImage;
		  
		  // Storage buffer: read-write data array
		  layout(binding = 1) buffer DataBuffer {
		      float data[];
		  };
		  
		  void main() {
		      // What pixel is this thread responsible for?
		      ivec2 coord = ivec2(gl_GlobalInvocationID.xy);
		      ivec2 size  = imageSize(outputImage);
		      
		      if (coord.x >= size.x || coord.y >= size.y) return;  // bounds check
		      
		      // UV in [0, 1]
		      vec2 uv = vec2(coord) / vec2(size);
		      
		      // Compute something (mandelbrot as example)
		      vec2 c = (uv - 0.5) * 3.0;
		      vec2 z = vec2(0.0);
		      int iter = 0;
		      for (int i = 0; i < 100; i++) {
		          if (dot(z, z) > 4.0) break;
		          z = vec2(z.x*z.x - z.y*z.y + c.x, 2.0*z.x*z.y + c.y);
		          iter++;
		      }
		      
		      float t = float(iter) / 100.0;
		      vec4 color = vec4(t, t*t, t*t*t, 1.0);
		      
		      // Write result to output image
		      imageStore(outputImage, coord, color);
		  }
		  ```
	- ### Dispatching a Compute Shader from C++
		- ```cpp
		  // Create compute pipeline (simpler than graphics pipeline — no render pass!)
		  VkComputePipelineCreateInfo computeInfo{};
		  computeInfo.sType  = VK_STRUCTURE_TYPE_COMPUTE_PIPELINE_CREATE_INFO;
		  computeInfo.stage  = computeShaderStage;  // the compiled compute shader
		  computeInfo.layout = pipelineLayout;
		  
		  VkPipeline computePipeline;
		  vkCreateComputePipelines(device, VK_NULL_HANDLE, 1, &computeInfo, nullptr, &computePipeline);
		  
		  // Dispatch: run the compute shader
		  vkCmdBindPipeline(cmdBuf, VK_PIPELINE_BIND_POINT_COMPUTE, computePipeline);
		  vkCmdBindDescriptorSets(cmdBuf, VK_PIPELINE_BIND_POINT_COMPUTE, ...);
		  
		  // Dispatch 1920/16 × 1080/16 workgroups (to cover the full image)
		  vkCmdDispatch(cmdBuf,
		      (1920 + 15) / 16,   // x: ceil(width / workgroup_x)
		      (1080 + 15) / 16,   // y: ceil(height / workgroup_y)
		      1                   // z: 1 for 2D dispatch
		  );
		  ```
- ---
- ## 🔴 Chapter 9 — GPU-Driven Rendering (Advanced)
  collapsed:: true
	- Traditional rendering: CPU decides what to draw → submits draw calls → GPU executes
	- GPU-driven rendering: GPU itself decides what to draw → much faster
	- ### Multi-Draw Indirect
		- ```cpp
		  struct VkDrawIndexedIndirectCommand {
		      uint32_t indexCount;    // triangles to draw
		      uint32_t instanceCount;
		      uint32_t firstIndex;
		      int32_t  vertexOffset;
		      uint32_t firstInstance;
		  };
		  
		  // Upload all possible draw calls to a GPU buffer
		  vkCmdDrawIndexedIndirect(
		      cmdBuf,
		      indirectBuffer,  // buffer of draw commands on GPU
		      0,               // offset
		      drawCount,       // how many draw calls
		      sizeof(VkDrawIndexedIndirectCommand)  // stride
		  );
		  // GPU reads draw commands from VRAM — no CPU roundtrip!
		  ```
	- ### Mesh Shaders (Vulkan 1.3 + NV extension)
		- Replace vertex + geometry shaders with programmable mesh pipeline
		- Generate geometry on the GPU (LOD, culling, procedural meshes)
		- Amplification shader (task shader): decide how many meshlets to spawn
		- Mesh shader: generate final vertices for rasterization
- ---
- ## ✅ Chapter 10 — Checklist
  collapsed:: true
	- ### Beginner
		- TODO Understand why GPUs have thousands of simple cores instead of a few fast ones
		- TODO Can explain what a warp is and what lockstep execution means
		- TODO Know why warp divergence hurts performance
		- TODO Understand the GPU memory hierarchy (registers → shared → L2 → VRAM)
	- ### Intermediate
		- TODO Know what a VkInstance, VkPhysicalDevice, and VkDevice each represent
		- TODO Understand why Vulkan requires you to pre-allocate memory manually
		- TODO Can explain why shaders must be compiled to SPIR-V
		- TODO Understand the difference between VkFence and VkSemaphore
	- ### Advanced
		- TODO Can write a Vulkan hello triangle from scratch (all setup steps)
		- TODO Understand pipeline barriers and image layout transitions
		- TODO Can write a compute shader and dispatch it from C++
		- TODO Know what GPU-driven rendering means and why it's faster
		- TODO Understand coalesced vs uncoalesced memory access
- ---
- ## 📚 Resources
  collapsed:: true
	- **Vulkan Tutorial** — https://vulkan-tutorial.com/
		- The go-to beginner guide — hello triangle from scratch
	- **Brendan Galea (YouTube)** — Vulkan Game Engine Tutorial
		- Practical series building a Vulkan engine from zero
	- **vkGuide** — https://vkguide.dev/
		- Modern Vulkan (dynamic rendering, VMA) guide
	- **Vulkan Spec** — https://registry.khronos.org/vulkan/specs/
		- The official reference — dense but authoritative
	- **NVIDIA Turing Architecture Whitepaper** — GPU hardware details
	- **AMD RDNA Architecture Whitepaper** — GPU hardware details (AMD perspective)
- ---
- ## 🔗 Related
	- [[GPFS PBR]] — What your fragment shader computes
	- [[GPFS Render Equation]] — The mathematical foundation of shading
	- [[GPFS Ray Marching]] — Practice shaders before tackling Vulkan
	- [[Vulkan]] — Full Vulkan API reference
	- [[PathTracer Learning Phase 3 GPU and Vulkan]] — Vulkan ray tracing extension
	- [[PathTracer Learning Vulkan RT Pipeline]] — Ray tracing pipeline details
	- [[Advanced Graphics]] — DirectX 12, Metal, WebGPU references
	- [[Graphics Programming From Scratch]]