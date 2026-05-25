---
date: 2026-04-10T09:50:41+05:30
lastmod: 2026-05-18T10:12:55+05:30

seoTitle: Advanced Graphics Programming – Vulkan, DirectX 12, Metal, WebGPU, HLSL Guide
description: "Comprehensive advanced graphics programming reference covering Vulkan, DirectX 12, Metal, WebGPU, HLSL, GLSL, compute shaders, render graphs, GPU architecture, and modern rendering techniques."
keywords: "advanced graphics programming, Vulkan, DirectX 12, Metal, WebGPU, HLSL, GLSL, compute shaders, render graph, GPU architecture, rasterization, ray tracing, graphics pipeline, shader programming, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Advanced Graphics Programming
---

> [!info] About This Page
> This page covers **low-level graphics programming** — GPU architecture, modern graphics APIs, shader languages, and advanced rendering techniques.
> For engine-level rendering see [[Game Development]]. For path tracing deep-dive see [[PathTracer Learning]].
> For engine-specific shaders see [[Godot]], [[Unity]], [[Unreal Engine]].

- # History
  collapsed:: true
	- **How**: Graphics APIs evolved from fixed-function pipelines (OpenGL 1.x, DirectX 7) to fully programmable shaders (DX9/OpenGL 2), then to explicit low-overhead APIs (Vulkan, DX12, Metal) giving developers direct GPU control.
	- **Who**: Key contributors — Microsoft (DirectX), Khronos Group (OpenGL, Vulkan, WebGL, WebGPU), Apple (Metal), AMD/NVIDIA (GPU hardware).
	- **Why**: Games and simulations demand maximum GPU performance. High-level APIs had too much driver overhead. Explicit APIs let developers control memory, synchronization, and command submission directly.
	-
	- ## API Evolution Timeline
	  collapsed:: true
		- ```mermaid
		  timeline
		      title Graphics API Evolution
		      1992 : OpenGL 1.0
		           : Fixed-function pipeline
		           : No shaders
		      1995 : DirectX 1.0
		           : Windows-only
		           : Microsoft enters graphics
		      2002 : DirectX 9 / OpenGL 2.0
		           : Programmable shaders begin
		           : HLSL and GLSL introduced
		      2006 : DirectX 10 / OpenGL 3.0
		           : Geometry shaders
		           : Unified shader model
		      2009 : OpenGL ES 2.0
		           : Mobile graphics programming
		           : WebGL follows
		      2013 : Metal (Apple)
		           : Low-overhead API for iOS/macOS
		           : First modern explicit API
		      2015 : DirectX 12 / Vulkan
		           : Explicit GPU control
		           : Multi-threading, no driver magic
		      2021 : WebGPU
		           : Modern GPU API for browsers
		           : Replaces WebGL
		      2023 : Vulkan 1.3 / DX12 Ultimate
		           : Mesh shaders, ray tracing standard
		           : Work graphs introduced
		  ```
-
- # Introduction
  collapsed:: true
	- > [!tip] Which API Should You Learn?
	  > - **[[Vulkan]]** — cross-platform (Windows, Linux, Android, macOS via MoltenVK). Best for games and engines.
	  > - **[[DirectX]] 12** — Windows + Xbox only. Best for Windows game development.
	  > - **[[Metal]]** — Apple only (iOS, macOS). Required for Apple platform games.
	  > - **[[WebGPU]]** — browsers + native. Best for web games and cross-platform tools.
	  > - **OpenGL** — legacy. Still works everywhere but avoid for new projects.
	-
	- ## API Comparison
	  collapsed:: true
		- | API | Platform | Overhead | Learning Curve | Best For |
		  |-----|----------|----------|----------------|---------|
		  | Vulkan | Cross-platform | Minimal | Very High | Games, engines, cross-platform |
		  | DirectX 12 | Windows / Xbox | Minimal | Very High | Windows games, Xbox |
		  | Metal | Apple only | Minimal | High | iOS / macOS games |
		  | WebGPU | Browser + native | Low | Medium | Web games, tools |
		  | OpenGL | Cross-platform | High | Low | Learning, legacy |
		  | OpenGL ES | Mobile | Medium | Low | Mobile (legacy) |
		  | WebGL | Browser | High | Low | Web (legacy) |
	-
	- ## Graphics Programming Knowledge Map
	  collapsed:: true
		- ```mermaid
		  mindmap
		    root((Advanced Graphics))
		      GPU Architecture
		        Hardware Pipeline
		        Memory Model
		        Execution Model
		        Synchronization
		      Graphics APIs
		        Vulkan
		        DirectX 12
		        Metal
		        WebGPU
		      Shader Languages
		        GLSL
		        HLSL
		        MSL
		        WGSL
		        SPIR-V
		      Rendering Techniques
		        Rasterization
		        Ray Tracing
		        Compute
		        Mesh Shaders
		      Advanced Topics
		        Render Graphs
		        Bindless Resources
		        GPU Driven Rendering
		        Multi-threading
		  ```
-
- # GPU Architecture
  collapsed:: true
	- > [!info] Why This Matters
	  > Understanding GPU hardware is essential for writing efficient shaders and using modern APIs correctly.
	  > Every optimization decision flows from understanding how the GPU actually works.
	-
	- ## GPU vs CPU Architecture
	  collapsed:: true
		- ```mermaid
		  graph TD
		      subgraph CPU["🖥️ CPU — Few Powerful Cores"]
		          C1["Core 1\nComplex logic\nBranch prediction\nOut-of-order exec"]
		          C2["Core 2"]
		          C3["Core 3"]
		          C4["Core 4 ... 32"]
		          Cache["Large Cache\nL1/L2/L3"]
		          C1 --- Cache
		      end
		      subgraph GPU["🎮 GPU — Thousands of Simple Cores"]
		          SM1["SM / CU\n128 shader cores"]
		          SM2["SM / CU\n128 shader cores"]
		          SM3["SM / CU\n128 shader cores"]
		          SMN["... thousands more"]
		          VRAM["VRAM\nHigh bandwidth\n~1TB/s"]
		          SM1 --- VRAM
		      end
		      CPU -->|"Submits draw calls\nand commands"| GPU
		  ```
		- | Feature | CPU | GPU |
		  |---------|-----|-----|
		  | Core count | 4–64 | 1,000–18,000+ |
		  | Core complexity | Very high (OOO, branch pred) | Simple (in-order) |
		  | Memory bandwidth | ~100 GB/s | ~1 TB/s |
		  | Best at | Sequential logic, branching | Parallel math, throughput |
		  | Latency | Low | High (hidden by parallelism) |
	-
	- ## GPU Execution Model
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Thread["Thread\nSingle shader invocation\n(one pixel, one vertex)"]
		      Warp["Warp / Wavefront\n32 threads (NVIDIA)\n64 threads (AMD)\nExecute in lockstep"]
		      Block["Thread Block / Workgroup\nMultiple warps\nShared memory access"]
		      Grid["Grid / Dispatch\nAll blocks for one draw/dispatch"]
		      Thread --> Warp --> Block --> Grid
		  ```
		- > [!warning] Warp Divergence
		  > All threads in a warp execute the **same instruction**.
		  > If threads take different `if/else` branches → both paths execute, inactive threads masked off.
		  > This is called **warp divergence** — it halves throughput. Avoid branching in shaders.
	-
	- ## GPU Memory Hierarchy
	  collapsed:: true
		- | Memory Type | Location | Speed | Size | Scope |
		  |-------------|----------|-------|------|-------|
		  | Registers | On-chip | Fastest | ~256KB per SM | Per thread |
		  | Shared Memory / LDS | On-chip | Very fast | 32–128KB per SM | Per workgroup |
		  | L1 Cache | On-chip | Fast | 32–128KB per SM | Per SM |
		  | L2 Cache | On-chip | Medium | 4–80MB | Whole GPU |
		  | VRAM (GDDR6/HBM) | Off-chip | ~1 TB/s | 8–80GB | Whole GPU |
		  | System RAM | Off-chip | ~100 GB/s | GBs | CPU+GPU shared |
		- > [!tip] Optimization Rule
		  > Keep hot data in shared memory / LDS. Minimize VRAM reads.
		  > Coalesced memory access (threads read adjacent addresses) = full bandwidth utilization.
	-
	- ## Synchronization Primitives
	  collapsed:: true
		- | Primitive | Scope | Use Case |
		  |-----------|-------|---------|
		  | Barrier (execution) | Workgroup | Wait for all threads before proceeding |
		  | Memory barrier | Workgroup / global | Ensure writes are visible |
		  | Semaphore | Queue level | Signal between GPU queues |
		  | Fence | CPU-GPU | CPU waits for GPU work to finish |
		  | Pipeline barrier (Vulkan) | Command buffer | Transition resource states |
		  | Event | Command buffer | Fine-grained sync within a queue |
-
- # [[Vulkan]]
  collapsed:: true
	- > [!info] What is Vulkan?
	  > Vulkan is a low-overhead, cross-platform graphics and compute API by the Khronos Group (2016).
	  > It gives developers **explicit control** over GPU memory, synchronization, and command submission.
	  > Used by: Doom Eternal, Red Dead Redemption 2, Godot 4, Android games, Linux gaming (via DXVK).
	-
	- ## Vulkan Architecture Overview
	  collapsed:: true
		- ```mermaid
		  graph TD
		      App["Your Application"]
		      Instance["VkInstance\nVulkan context"]
		      PhysDev["VkPhysicalDevice\nGPU hardware info"]
		      LogDev["VkDevice\nLogical device\nQueues + features"]
		      subgraph Memory["Memory Management"]
		          Alloc["VkDeviceMemory\nAllocate GPU memory"]
		          Buffer["VkBuffer\nVertex, index, uniform data"]
		          Image["VkImage\nTextures, render targets"]
		      end
		      subgraph Commands["Command Recording"]
		          Pool["VkCommandPool"]
		          CmdBuf["VkCommandBuffer\nRecord draw calls"]
		      end
		      subgraph Rendering["Render Pipeline"]
		          RenderPass["VkRenderPass\nAttachments, subpasses"]
		          Pipeline["VkPipeline\nShaders + state"]
		          Framebuf["VkFramebuffer\nRender targets"]
		      end
		      Swapchain["VkSwapchainKHR\nPresent to screen"]
		      Queue["VkQueue\nSubmit commands to GPU"]
		  
		      App --> Instance --> PhysDev --> LogDev
		      LogDev --> Memory
		      LogDev --> Commands
		      LogDev --> Rendering
		      LogDev --> Swapchain
		      CmdBuf --> Queue --> Swapchain
		  ```
	-
	- ## Vulkan Initialization
	  collapsed:: true
		- ```cpp
		  // 1. Create Instance
		  VkApplicationInfo appInfo{};
		  appInfo.sType = VK_STRUCTURE_TYPE_APPLICATION_INFO;
		  appInfo.pApplicationName = "My Game";
		  appInfo.applicationVersion = VK_MAKE_VERSION(1, 0, 0);
		  appInfo.apiVersion = VK_API_VERSION_1_3;
		  
		  VkInstanceCreateInfo createInfo{};
		  createInfo.sType = VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO;
		  createInfo.pApplicationInfo = &appInfo;
		  
		  // Enable validation layers (debug only)
		  const char* validationLayers[] = {"VK_LAYER_KHRONOS_validation"};
		  createInfo.enabledLayerCount = 1;
		  createInfo.ppEnabledLayerNames = validationLayers;
		  
		  VkInstance instance;
		  vkCreateInstance(&createInfo, nullptr, &instance);
		  
		  // 2. Pick Physical Device (GPU)
		  uint32_t deviceCount = 0;
		  vkEnumeratePhysicalDevices(instance, &deviceCount, nullptr);
		  std::vector<VkPhysicalDevice> devices(deviceCount);
		  vkEnumeratePhysicalDevices(instance, &deviceCount, devices.data());
		  
		  VkPhysicalDevice physicalDevice = devices[0]; // pick best GPU
		  
		  // 3. Create Logical Device + Queue
		  float queuePriority = 1.0f;
		  VkDeviceQueueCreateInfo queueInfo{};
		  queueInfo.sType = VK_STRUCTURE_TYPE_DEVICE_QUEUE_CREATE_INFO;
		  queueInfo.queueFamilyIndex = graphicsQueueFamily;
		  queueInfo.queueCount = 1;
		  queueInfo.pQueuePriorities = &queuePriority;
		  
		  VkDeviceCreateInfo deviceInfo{};
		  deviceInfo.sType = VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO;
		  deviceInfo.queueCreateInfoCount = 1;
		  deviceInfo.pQueueCreateInfos = &queueInfo;
		  
		  VkDevice device;
		  vkCreateDevice(physicalDevice, &deviceInfo, nullptr, &device);
		  
		  VkQueue graphicsQueue;
		  vkGetDeviceQueue(device, graphicsQueueFamily, 0, &graphicsQueue);
		  ```
	-
	- ## Vulkan Memory Management
	  collapsed:: true
		- ```cpp
		  // Allocate GPU memory manually (unlike OpenGL which does it for you)
		  VkMemoryAllocateInfo allocInfo{};
		  allocInfo.sType = VK_STRUCTURE_TYPE_MEMORY_ALLOCATE_INFO;
		  allocInfo.allocationSize = memRequirements.size;
		  allocInfo.memoryTypeIndex = findMemoryType(
		      memRequirements.memoryTypeBits,
		      VK_MEMORY_PROPERTY_DEVICE_LOCAL_BIT  // GPU-only memory (fastest)
		      // VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT | VK_MEMORY_PROPERTY_HOST_COHERENT_BIT
		      // ^ CPU-accessible memory (for staging buffers)
		  );
		  
		  VkDeviceMemory bufferMemory;
		  vkAllocateMemory(device, &allocInfo, nullptr, &bufferMemory);
		  vkBindBufferMemory(device, buffer, bufferMemory, 0);
		  ```
		- > [!tip] Use VMA (Vulkan Memory Allocator)
		  > Manual memory management is complex. Use [AMD's VMA library](https://github.com/GPUOpen-LibrariesAndSDKs/VulkanMemoryAllocator) in real projects.
		  > It handles memory types, suballocation, and defragmentation automatically.
		- | Memory Type | Flag | Use Case |
		  |-------------|------|---------|
		  | Device Local | `DEVICE_LOCAL` | GPU-only buffers, textures (fastest) |
		  | Host Visible + Coherent | `HOST_VISIBLE + HOST_COHERENT` | Staging buffers, uniform data |
		  | Host Visible + Cached | `HOST_VISIBLE + HOST_CACHED` | Readback from GPU to CPU |
	-
	- ## Vulkan Pipeline
	  collapsed:: true
		- ```mermaid
		  graph LR
		      VS["Vertex Shader\nTransform vertices"] --> PA["Primitive Assembly\nAssemble triangles"]
		      PA --> TCS["Tessellation Control\n(optional)"]
		      TCS --> TES["Tessellation Eval\n(optional)"]
		      TES --> GS["Geometry Shader\n(optional)"]
		      GS --> Rast["Rasterization\nTriangles → Fragments"]
		      Rast --> FS["Fragment Shader\nCompute pixel color"]
		      FS --> Blend["Color Blending\nAlpha compositing"]
		      Blend --> FB["Framebuffer\nFinal image"]
		  ```
		- ```cpp
		  // Create graphics pipeline (simplified)
		  VkGraphicsPipelineCreateInfo pipelineInfo{};
		  pipelineInfo.sType = VK_STRUCTURE_TYPE_GRAPHICS_PIPELINE_CREATE_INFO;
		  
		  // Shader stages
		  VkPipelineShaderStageCreateInfo shaderStages[] = {vertStage, fragStage};
		  pipelineInfo.stageCount = 2;
		  pipelineInfo.pStages = shaderStages;
		  
		  // Vertex input
		  pipelineInfo.pVertexInputState = &vertexInputInfo;
		  pipelineInfo.pInputAssemblyState = &inputAssembly;
		  
		  // Rasterization
		  VkPipelineRasterizationStateCreateInfo rasterizer{};
		  rasterizer.polygonMode = VK_POLYGON_MODE_FILL;
		  rasterizer.cullMode = VK_CULL_MODE_BACK_BIT;
		  rasterizer.frontFace = VK_FRONT_FACE_COUNTER_CLOCKWISE;
		  pipelineInfo.pRasterizationState = &rasterizer;
		  
		  // Depth testing
		  VkPipelineDepthStencilStateCreateInfo depthStencil{};
		  depthStencil.depthTestEnable = VK_TRUE;
		  depthStencil.depthWriteEnable = VK_TRUE;
		  depthStencil.depthCompareOp = VK_COMPARE_OP_LESS;
		  pipelineInfo.pDepthStencilState = &depthStencil;
		  
		  VkPipeline graphicsPipeline;
		  vkCreateGraphicsPipelines(device, VK_NULL_HANDLE, 1, &pipelineInfo, nullptr, &graphicsPipeline);
		  ```
	-
	- ## Vulkan Render Pass & Synchronization
	  collapsed:: true
		- ```cpp
		  // Pipeline barrier — transition image layout
		  VkImageMemoryBarrier barrier{};
		  barrier.sType = VK_STRUCTURE_TYPE_IMAGE_MEMORY_BARRIER;
		  barrier.oldLayout = VK_IMAGE_LAYOUT_UNDEFINED;
		  barrier.newLayout = VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL;
		  barrier.srcAccessMask = 0;
		  barrier.dstAccessMask = VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT;
		  
		  vkCmdPipelineBarrier(
		      commandBuffer,
		      VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT,        // src stage
		      VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT, // dst stage
		      0, 0, nullptr, 0, nullptr,
		      1, &barrier
		  );
		  ```
		- | Image Layout | Use Case |
		  |-------------|---------|
		  | `UNDEFINED` | Initial state, don't care about contents |
		  | `COLOR_ATTACHMENT_OPTIMAL` | Writing to render target |
		  | `SHADER_READ_ONLY_OPTIMAL` | Sampling in shader |
		  | `TRANSFER_SRC_OPTIMAL` | Copy source |
		  | `TRANSFER_DST_OPTIMAL` | Copy destination |
		  | `PRESENT_SRC_KHR` | Ready to present to screen |
	-
	- ## Vulkan Ray Tracing
	  collapsed:: true
		- > [!info] Vulkan RT Extension
		  > `VK_KHR_ray_tracing_pipeline` — hardware-accelerated ray tracing on NVIDIA RTX, AMD RDNA2+, Intel Arc.
		  > See [[PathTracer Learning]] for the full deep-dive implementation.
		- ```mermaid
		  graph TD
		      BLAS["BLAS\nBottom-Level Acceleration Structure\nGeometry triangles/AABBs"]
		      TLAS["TLAS\nTop-Level Acceleration Structure\nInstances of BLASes with transforms"]
		      RGen["Ray Generation Shader\nSpawns rays from camera"]
		      RInt["Intersection Shader\nCustom geometry intersection"]
		      RAny["Any-Hit Shader\nTransparency, alpha test"]
		      RClose["Closest-Hit Shader\nShading at hit point"]
		      RMiss["Miss Shader\nBackground / sky when no hit"]
		      BLAS --> TLAS
		      TLAS --> RGen
		      RGen --> RInt
		      RGen --> RAny
		      RGen --> RClose
		      RGen --> RMiss
		  ```
-
- # [[DirectX]] 12
  collapsed:: true
	- > [!info] What is DirectX 12?
	  > DirectX 12 (D3D12) is Microsoft's low-level graphics API for Windows 10/11 and Xbox.
	  > Like Vulkan, it gives explicit control over GPU resources, memory, and synchronization.
	  > Used by: most AAA Windows games, Xbox exclusives, Halo Infinite, Forza, Microsoft Flight Simulator.
	-
	- ## DX12 vs Vulkan Terminology
	  collapsed:: true
		- | Concept | Vulkan | DirectX 12 |
		  |---------|--------|-----------|
		  | Device | `VkDevice` | `ID3D12Device` |
		  | Command buffer | `VkCommandBuffer` | `ID3D12GraphicsCommandList` |
		  | Command pool | `VkCommandPool` | `ID3D12CommandAllocator` |
		  | Queue | `VkQueue` | `ID3D12CommandQueue` |
		  | Render pass | `VkRenderPass` | Render targets (no formal pass) |
		  | Pipeline | `VkPipeline` | `ID3D12PipelineState` |
		  | Descriptor set | `VkDescriptorSet` | Descriptor heap |
		  | Buffer | `VkBuffer` | `ID3D12Resource` |
		  | Image | `VkImage` | `ID3D12Resource` |
		  | Swapchain | `VkSwapchainKHR` | `IDXGISwapChain4` |
		  | Semaphore/Fence | `VkSemaphore/VkFence` | `ID3D12Fence` |
		  | Memory heap | `VkDeviceMemory` | `D3D12_HEAP_TYPE` |
	-
	- ## DX12 Initialization
	  collapsed:: true
		- ```cpp
		  #include <d3d12.h>
		  #include <dxgi1_6.h>
		  
		  // 1. Enable debug layer (debug builds only)
		  ID3D12Debug* debugController;
		  D3D12GetDebugInterface(IID_PPV_ARGS(&debugController));
		  debugController->EnableDebugLayer();
		  
		  // 2. Create DXGI Factory + enumerate adapters
		  IDXGIFactory7* factory;
		  CreateDXGIFactory2(DXGI_CREATE_FACTORY_DEBUG, IID_PPV_ARGS(&factory));
		  
		  IDXGIAdapter4* adapter;
		  factory->EnumAdapterByGpuPreference(0,
		      DXGI_GPU_PREFERENCE_HIGH_PERFORMANCE, IID_PPV_ARGS(&adapter));
		  
		  // 3. Create D3D12 Device
		  ID3D12Device8* device;
		  D3D12CreateDevice(adapter, D3D_FEATURE_LEVEL_12_1, IID_PPV_ARGS(&device));
		  
		  // 4. Create Command Queue
		  D3D12_COMMAND_QUEUE_DESC queueDesc{};
		  queueDesc.Type = D3D12_COMMAND_LIST_TYPE_DIRECT;
		  queueDesc.Priority = D3D12_COMMAND_QUEUE_PRIORITY_NORMAL;
		  
		  ID3D12CommandQueue* commandQueue;
		  device->CreateCommandQueue(&queueDesc, IID_PPV_ARGS(&commandQueue));
		  
		  // 5. Create Swapchain
		  DXGI_SWAP_CHAIN_DESC1 swapchainDesc{};
		  swapchainDesc.Width = 1920;
		  swapchainDesc.Height = 1080;
		  swapchainDesc.Format = DXGI_FORMAT_R8G8B8A8_UNORM;
		  swapchainDesc.BufferCount = 3;  // triple buffering
		  swapchainDesc.SwapEffect = DXGI_SWAP_EFFECT_FLIP_DISCARD;
		  
		  IDXGISwapChain4* swapchain;
		  factory->CreateSwapChainForHwnd(commandQueue, hwnd,
		      &swapchainDesc, nullptr, nullptr,
		      reinterpret_cast<IDXGISwapChain1**>(&swapchain));
		  ```
	-
	- ## DX12 Resource Barriers
	  collapsed:: true
		- ```cpp
		  // Transition render target from present → render target state
		  D3D12_RESOURCE_BARRIER barrier{};
		  barrier.Type = D3D12_RESOURCE_BARRIER_TYPE_TRANSITION;
		  barrier.Transition.pResource = renderTarget;
		  barrier.Transition.StateBefore = D3D12_RESOURCE_STATE_PRESENT;
		  barrier.Transition.StateAfter  = D3D12_RESOURCE_STATE_RENDER_TARGET;
		  barrier.Transition.Subresource = D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES;
		  
		  commandList->ResourceBarrier(1, &barrier);
		  
		  // ... draw calls ...
		  
		  // Transition back to present
		  barrier.Transition.StateBefore = D3D12_RESOURCE_STATE_RENDER_TARGET;
		  barrier.Transition.StateAfter  = D3D12_RESOURCE_STATE_PRESENT;
		  commandList->ResourceBarrier(1, &barrier);
		  ```
		- | Resource State | Usage |
		  |---------------|-------|
		  | `PRESENT` | Ready to display on screen |
		  | `RENDER_TARGET` | Writing color output |
		  | `DEPTH_WRITE` | Writing depth buffer |
		  | `PIXEL_SHADER_RESOURCE` | Reading in pixel shader |
		  | `NON_PIXEL_SHADER_RESOURCE` | Reading in compute/vertex shader |
		  | `COPY_SOURCE` | Source of a copy operation |
		  | `COPY_DEST` | Destination of a copy operation |
		  | `UNORDERED_ACCESS` | Read/write in compute shader |
	-
	- ## DX12 Descriptor Heaps
	  collapsed:: true
		- > [!info] Descriptor Heaps
		  > In DX12, all resource bindings go through **descriptor heaps** — contiguous arrays of descriptors (views into resources).
		  > This replaces the implicit binding model of DX11/OpenGL.
		- | Heap Type | Contains | Shader Visible |
		  |-----------|---------|----------------|
		  | `CBV_SRV_UAV` | Constant buffers, textures, UAVs | Yes |
		  | `SAMPLER` | Texture samplers | Yes |
		  | `RTV` | Render target views | No |
		  | `DSV` | Depth stencil views | No |
		- ```cpp
		  // Create CBV/SRV/UAV descriptor heap
		  D3D12_DESCRIPTOR_HEAP_DESC heapDesc{};
		  heapDesc.Type = D3D12_DESCRIPTOR_HEAP_TYPE_CBV_SRV_UAV;
		  heapDesc.NumDescriptors = 1000;
		  heapDesc.Flags = D3D12_DESCRIPTOR_HEAP_FLAG_SHADER_VISIBLE;
		  
		  ID3D12DescriptorHeap* srvHeap;
		  device->CreateDescriptorHeap(&heapDesc, IID_PPV_ARGS(&srvHeap));
		  
		  // Create SRV for a texture
		  D3D12_SHADER_RESOURCE_VIEW_DESC srvDesc{};
		  srvDesc.Format = DXGI_FORMAT_R8G8B8A8_UNORM;
		  srvDesc.ViewDimension = D3D12_SRV_DIMENSION_TEXTURE2D;
		  srvDesc.Shader4ComponentMapping = D3D12_DEFAULT_SHADER_4_COMPONENT_MAPPING;
		  srvDesc.Texture2D.MipLevels = 1;
		  
		  device->CreateShaderResourceView(texture, &srvDesc,
		      srvHeap->GetCPUDescriptorHandleForHeapStart());
		  ```
-
- # [[Metal]] (Apple)
  collapsed:: true
	- > [!info] What is Metal?
	  > Metal is Apple's low-level graphics and compute API for iOS, macOS, and tvOS (2014).
	  > It was the **first modern explicit API** — predating Vulkan and DX12.
	  > Required for any serious game or graphics app on Apple platforms.
	-
	- ## Metal Architecture
	  collapsed:: true
		- ```mermaid
		  graph TD
		      App["Swift / Objective-C / C++ App"]
		      Device["MTLDevice\nGPU abstraction"]
		      CmdQueue["MTLCommandQueue\nSubmit work to GPU"]
		      CmdBuf["MTLCommandBuffer\nRecord commands"]
		      subgraph Encoders["Command Encoders"]
		          Render["MTLRenderCommandEncoder\nDraw calls"]
		          Compute["MTLComputeCommandEncoder\nCompute dispatches"]
		          Blit["MTLBlitCommandEncoder\nCopy operations"]
		      end
		      Library["MTLLibrary\nCompiled shaders (.metallib)"]
		      Pipeline["MTLRenderPipelineState\nShaders + render state"]
		  
		      App --> Device --> CmdQueue --> CmdBuf
		      CmdBuf --> Encoders
		      Library --> Pipeline
		      Pipeline --> Render
		  ```
	-
	- ## Metal Initialization (Swift)
	  collapsed:: true
		- ```swift
		  import Metal
		  import MetalKit
		  
		  // Get GPU device
		  guard let device = MTLCreateSystemDefaultDevice() else {
		      fatalError("Metal not supported")
		  }
		  
		  // Create command queue
		  let commandQueue = device.makeCommandQueue()!
		  
		  // Load shader library
		  let library = device.makeDefaultLibrary()!
		  let vertexFunction   = library.makeFunction(name: "vertex_main")!
		  let fragmentFunction = library.makeFunction(name: "fragment_main")!
		  
		  // Create render pipeline
		  let pipelineDescriptor = MTLRenderPipelineDescriptor()
		  pipelineDescriptor.vertexFunction   = vertexFunction
		  pipelineDescriptor.fragmentFunction = fragmentFunction
		  pipelineDescriptor.colorAttachments[0].pixelFormat = .bgra8Unorm
		  
		  let pipelineState = try! device.makeRenderPipelineState(descriptor: pipelineDescriptor)
		  
		  // Per frame — create command buffer and encode draw calls
		  let commandBuffer = commandQueue.makeCommandBuffer()!
		  let renderEncoder = commandBuffer.makeRenderCommandEncoder(descriptor: renderPassDescriptor)!
		  
		  renderEncoder.setRenderPipelineState(pipelineState)
		  renderEncoder.setVertexBuffer(vertexBuffer, offset: 0, index: 0)
		  renderEncoder.drawPrimitives(type: .triangle, vertexStart: 0, vertexCount: 3)
		  renderEncoder.endEncoding()
		  
		  commandBuffer.present(drawable)
		  commandBuffer.commit()
		  ```
	-
	- ## Metal Shading Language (MSL)
	  collapsed:: true
		- ```metal
		  #include <metal_stdlib>
		  using namespace metal;
		  
		  // Vertex input structure
		  struct VertexIn {
		      float3 position [[attribute(0)]];
		      float2 texCoord [[attribute(1)]];
		      float3 normal   [[attribute(2)]];
		  };
		  
		  // Vertex output / fragment input
		  struct VertexOut {
		      float4 position [[position]];
		      float2 texCoord;
		      float3 worldNormal;
		  };
		  
		  // Uniform buffer
		  struct Uniforms {
		      float4x4 modelMatrix;
		      float4x4 viewProjectionMatrix;
		      float3   lightDirection;
		  };
		  
		  // Vertex shader
		  vertex VertexOut vertex_main(
		      VertexIn in [[stage_in]],
		      constant Uniforms& uniforms [[buffer(1)]])
		  {
		      VertexOut out;
		      float4 worldPos = uniforms.modelMatrix * float4(in.position, 1.0);
		      out.position  = uniforms.viewProjectionMatrix * worldPos;
		      out.texCoord  = in.texCoord;
		      out.worldNormal = (uniforms.modelMatrix * float4(in.normal, 0.0)).xyz;
		      return out;
		  }
		  
		  // Fragment shader
		  fragment float4 fragment_main(
		      VertexOut in [[stage_in]],
		      texture2d<float> albedoTexture [[texture(0)]],
		      sampler texSampler [[sampler(0)]],
		      constant Uniforms& uniforms [[buffer(1)]])
		  {
		      float4 color = albedoTexture.sample(texSampler, in.texCoord);
		      float  ndotl = max(dot(normalize(in.worldNormal), -uniforms.lightDirection), 0.0);
		      return float4(color.rgb * ndotl, color.a);
		  }
		  ```
-
- # [[WebGPU]]
  collapsed:: true
	- > [!info] What is WebGPU?
	  > WebGPU is the modern GPU API for browsers and native apps (W3C standard, 2023).
	  > It replaces WebGL with a design inspired by Vulkan/DX12/Metal.
	  > Supported in Chrome, Firefox, Safari. Also available natively via `wgpu` (Rust) and `dawn` (C++).
	-
	- ## WebGPU vs WebGL
	  collapsed:: true
		- | Feature | WebGL | WebGPU |
		  |---------|-------|--------|
		  | Based on | OpenGL ES 2.0/3.0 | Vulkan / DX12 / Metal |
		  | Compute shaders | No (WebGL 2 limited) | Yes — full compute |
		  | Multi-threading | No | Yes (workers) |
		  | Explicit memory | No | Yes |
		  | Shader language | GLSL | WGSL |
		  | Performance | Medium | High |
		  | Status | Legacy | Modern standard |
	-
	- ## WebGPU Initialization (JavaScript)
	  collapsed:: true
		- ```javascript
		  // Check support
		  if (!navigator.gpu) throw new Error("WebGPU not supported");
		  
		  // Get adapter (GPU) and device
		  const adapter = await navigator.gpu.requestAdapter({
		      powerPreference: "high-performance"
		  });
		  const device = await adapter.requestDevice();
		  
		  // Get canvas context
		  const canvas  = document.querySelector("canvas");
		  const context = canvas.getContext("webgpu");
		  const format  = navigator.gpu.getPreferredCanvasFormat();
		  
		  context.configure({ device, format });
		  
		  // Create shader module (WGSL)
		  const shaderModule = device.createShaderModule({ code: `
		      @vertex
		      fn vs_main(@builtin(vertex_index) vi: u32) -> @builtin(position) vec4f {
		          var pos = array<vec2f, 3>(
		              vec2f( 0.0,  0.5),
		              vec2f(-0.5, -0.5),
		              vec2f( 0.5, -0.5)
		          );
		          return vec4f(pos[vi], 0.0, 1.0);
		      }
		  
		      @fragment
		      fn fs_main() -> @location(0) vec4f {
		          return vec4f(1.0, 0.4, 0.1, 1.0); // orange
		      }
		  `});
		  
		  // Create render pipeline
		  const pipeline = device.createRenderPipeline({
		      layout: "auto",
		      vertex:   { module: shaderModule, entryPoint: "vs_main" },
		      fragment: { module: shaderModule, entryPoint: "fs_main",
		                  targets: [{ format }] },
		      primitive: { topology: "triangle-list" }
		  });
		  
		  // Render frame
		  const encoder     = device.createCommandEncoder();
		  const renderPass  = encoder.beginRenderPass({
		      colorAttachments: [{
		          view: context.getCurrentTexture().createView(),
		          clearValue: { r: 0, g: 0, b: 0, a: 1 },
		          loadOp: "clear", storeOp: "store"
		      }]
		  });
		  renderPass.setPipeline(pipeline);
		  renderPass.draw(3);
		  renderPass.end();
		  device.queue.submit([encoder.finish()]);
		  ```
	-
	- ## WGSL (WebGPU Shading Language)
	  collapsed:: true
		- ```wgsl
		  // Uniform buffer binding
		  struct Uniforms {
		      modelMatrix : mat4x4<f32>,
		      viewProjMatrix : mat4x4<f32>,
		  }
		  @group(0) @binding(0) var<uniform> uniforms : Uniforms;
		  
		  // Texture and sampler
		  @group(0) @binding(1) var myTexture : texture_2d<f32>;
		  @group(0) @binding(2) var mySampler : sampler;
		  
		  // Vertex shader
		  struct VertexOutput {
		      @builtin(position) position : vec4<f32>,
		      @location(0) uv : vec2<f32>,
		  }
		  
		  @vertex
		  fn vs_main(
		      @location(0) position : vec3<f32>,
		      @location(1) uv : vec2<f32>
		  ) -> VertexOutput {
		      var out : VertexOutput;
		      out.position = uniforms.viewProjMatrix * uniforms.modelMatrix * vec4<f32>(position, 1.0);
		      out.uv = uv;
		      return out;
		  }
		  
		  // Fragment shader
		  @fragment
		  fn fs_main(in : VertexOutput) -> @location(0) vec4<f32> {
		      return textureSample(myTexture, mySampler, in.uv);
		  }
		  ```
-
- # [[Shader Programming]]: HLSL (High-Level Shading Language)
  collapsed:: true
	- > [!info] What is HLSL?
	  > HLSL is Microsoft's shader language for DirectX. Used in DX9 through DX12.
	  > Also compiles to SPIR-V via DXC (DirectX Shader Compiler) for Vulkan.
	  > Used by: all DirectX games, Xbox, many cross-platform engines.
	-
	- ## HLSL Basics
	  collapsed:: true
		- ```hlsl
		  // Constant buffer (uniform data from CPU)
		  cbuffer PerFrameConstants : register(b0)
		  {
		      float4x4 g_ModelMatrix;
		      float4x4 g_ViewProjMatrix;
		      float3   g_LightDir;
		      float    g_Time;
		  };
		  
		  // Texture and sampler
		  Texture2D    g_AlbedoTexture : register(t0);
		  SamplerState g_LinearSampler : register(s0);
		  
		  // Vertex shader input
		  struct VSInput
		  {
		      float3 Position : POSITION;
		      float3 Normal   : NORMAL;
		      float2 TexCoord : TEXCOORD0;
		  };
		  
		  // Vertex shader output / pixel shader input
		  struct PSInput
		  {
		      float4 Position    : SV_POSITION;
		      float3 WorldNormal : NORMAL;
		      float2 TexCoord    : TEXCOORD0;
		  };
		  
		  // Vertex shader
		  PSInput VSMain(VSInput input)
		  {
		      PSInput output;
		      float4 worldPos = mul(g_ModelMatrix, float4(input.Position, 1.0));
		      output.Position    = mul(g_ViewProjMatrix, worldPos);
		      output.WorldNormal = mul((float3x3)g_ModelMatrix, input.Normal);
		      output.TexCoord    = input.TexCoord;
		      return output;
		  }
		  
		  // Pixel shader
		  float4 PSMain(PSInput input) : SV_TARGET
		  {
		      float4 albedo = g_AlbedoTexture.Sample(g_LinearSampler, input.TexCoord);
		      float3 normal = normalize(input.WorldNormal);
		      float  ndotl  = saturate(dot(normal, -g_LightDir));
		      return float4(albedo.rgb * ndotl, albedo.a);
		  }
		  ```
	-
	- ## HLSL Data Types
	  collapsed:: true
		- | Type | Description | Example |
		  |------|-------------|---------|
		  | `float` | 32-bit float | `float x = 1.0;` |
		  | `float2/3/4` | Vector | `float3 pos = float3(1,2,3);` |
		  | `float4x4` | 4x4 matrix | `float4x4 mvp;` |
		  | `int/uint` | Integer | `int count = 5;` |
		  | `bool` | Boolean | `bool isLit = true;` |
		  | `half` | 16-bit float (mobile perf) | `half2 uv;` |
		  | `Texture2D` | 2D texture resource | `Texture2D albedo;` |
		  | `TextureCube` | Cubemap texture | `TextureCube envMap;` |
		  | `SamplerState` | Texture sampler | `SamplerState s;` |
		  | `RWTexture2D` | Read/write texture (compute) | `RWTexture2D<float4> output;` |
		  | `StructuredBuffer` | Array of structs | `StructuredBuffer<Particle> particles;` |
	-
	- ## HLSL Compute Shader
	  collapsed:: true
		- ```hlsl
		  // Compute shader — runs on GPU without rasterization
		  // Used for: post-processing, physics simulation, particle systems, AI
		  
		  RWTexture2D<float4> g_OutputTexture : register(u0);
		  Texture2D<float4>   g_InputTexture  : register(t0);
		  
		  // Thread group size: 8x8 = 64 threads per group
		  [numthreads(8, 8, 1)]
		  void CSMain(
		      uint3 dispatchID  : SV_DispatchThreadID,   // global thread ID
		      uint3 groupID     : SV_GroupID,             // which group
		      uint3 localID     : SV_GroupThreadID,       // thread within group
		      uint  groupIndex  : SV_GroupIndex           // flat index within group
		  )
		  {
		      uint2 pixel = dispatchID.xy;
		  
		      // Get texture dimensions
		      uint width, height;
		      g_InputTexture.GetDimensions(width, height);
		  
		      if (pixel.x >= width || pixel.y >= height) return;
		  
		      // Simple blur — sample 3x3 neighborhood
		      float4 color = float4(0, 0, 0, 0);
		      for (int dy = -1; dy <= 1; dy++)
		      for (int dx = -1; dx <= 1; dx++)
		      {
		          int2 samplePos = clamp(int2(pixel) + int2(dx, dy),
		                                int2(0,0), int2(width-1, height-1));
		          color += g_InputTexture[samplePos];
		      }
		      g_OutputTexture[pixel] = color / 9.0;
		  }
		  ```
	-
	- ## HLSL Semantic Reference
	  collapsed:: true
		- | Semantic | Stage | Description |
		  |----------|-------|-------------|
		  | `SV_POSITION` | VS out / PS in | Clip-space position |
		  | `SV_TARGET` | PS out | Render target output |
		  | `SV_DEPTH` | PS out | Depth output |
		  | `SV_VertexID` | VS in | Vertex index |
		  | `SV_InstanceID` | VS in | Instance index |
		  | `SV_DispatchThreadID` | CS in | Global compute thread ID |
		  | `SV_GroupID` | CS in | Thread group ID |
		  | `SV_GroupThreadID` | CS in | Thread ID within group |
		  | `SV_GroupIndex` | CS in | Flat index within group |
		  | `POSITION` | VS in | Vertex position |
		  | `NORMAL` | VS in | Vertex normal |
		  | `TEXCOORD0-7` | VS in/out | Texture coordinates |
		  | `COLOR0-1` | VS in/out | Vertex color |
-
- # GLSL Advanced
  collapsed:: true
	- > [!info] GLSL in Modern Pipelines
	  > GLSL (OpenGL Shading Language) is used in OpenGL, Vulkan (via SPIR-V compilation), and WebGL.
	  > In Vulkan, GLSL is compiled to **SPIR-V** bytecode using `glslc` or `glslangValidator`.
	-
	- ## GLSL Advanced Features
	  collapsed:: true
		- ```glsl
		  #version 460 core
		  
		  // Push constants (Vulkan — fast small data, no buffer needed)
		  layout(push_constant) uniform PushConstants {
		      mat4 mvp;
		      vec4 color;
		      float time;
		  } pc;
		  
		  // Descriptor set bindings
		  layout(set = 0, binding = 0) uniform sampler2D albedoMap;
		  layout(set = 0, binding = 1) uniform sampler2D normalMap;
		  layout(set = 0, binding = 2) uniform sampler2D roughnessMap;
		  
		  // Subpass input (Vulkan deferred rendering)
		  layout(input_attachment_index = 0, set = 1, binding = 0)
		      uniform subpassInput gBufferAlbedo;
		  
		  // Shader storage buffer (read/write from shader)
		  layout(set = 0, binding = 3) buffer ParticleBuffer {
		      vec4 positions[];
		      vec4 velocities[];
		  } particles;
		  ```
	-
	- ## GLSL Compute Shader
	  collapsed:: true
		- ```glsl
		  #version 460
		  
		  layout(local_size_x = 64, local_size_y = 1, local_size_z = 1) in;
		  
		  // Shared memory — fast on-chip memory shared within workgroup
		  shared vec4 sharedData[64];
		  
		  layout(set = 0, binding = 0) buffer InputBuffer  { vec4 input_data[]; };
		  layout(set = 0, binding = 1) buffer OutputBuffer { vec4 output_data[]; };
		  
		  void main() {
		      uint gid = gl_GlobalInvocationID.x;  // global thread index
		      uint lid = gl_LocalInvocationID.x;   // local thread index
		  
		      // Load into shared memory
		      sharedData[lid] = input_data[gid];
		  
		      // Synchronize — all threads must reach this before continuing
		      barrier();
		      memoryBarrierShared();
		  
		      // Process using shared memory (e.g., parallel reduction)
		      for (uint stride = 32; stride > 0; stride >>= 1) {
		          if (lid < stride) {
		              sharedData[lid] += sharedData[lid + stride];
		          }
		          barrier();
		      }
		  
		      if (lid == 0) {
		          output_data[gl_WorkGroupID.x] = sharedData[0];
		      }
		  }
		  ```
	-
	- ## SPIR-V Pipeline
	  collapsed:: true
		- ```mermaid
		  graph LR
		      GLSL["GLSL source\n(.vert .frag .comp)"]
		      HLSL2["HLSL source\n(.hlsl)"]
		      MSL2["MSL source\n(.metal)"]
		      SPIRV["SPIR-V bytecode\n(.spv)"]
		      Vulkan2["Vulkan\nVkShaderModule"]
		      GLSL -->|"glslc / glslangValidator"| SPIRV
		      HLSL2 -->|"dxc -spirv"| SPIRV
		      SPIRV --> Vulkan2
		      MSL2 -->|"xcrun metal"| MetalLib["Metal Library\n(.metallib)"]
		  ```
		- ```bash
		  # Compile GLSL to SPIR-V
		  glslc shader.vert -o vert.spv
		  glslc shader.frag -o frag.spv
		  glslc shader.comp -o comp.spv
		  
		  # Compile HLSL to SPIR-V (for Vulkan)
		  dxc -spirv -T vs_6_6 -E VSMain shader.hlsl -Fo vert.spv
		  dxc -spirv -T ps_6_6 -E PSMain shader.hlsl -Fo frag.spv
		  dxc -spirv -T cs_6_6 -E CSMain shader.hlsl -Fo comp.spv
		  ```
-
- # Advanced Rendering Techniques
  collapsed:: true
	- ## Render Graph
	  collapsed:: true
		- > [!info] What is a Render Graph?
		  > A render graph (frame graph) is a high-level description of all rendering passes and their resource dependencies.
		  > The system automatically handles resource barriers, memory aliasing, and pass ordering.
		  > Used by: Unreal Engine (RDG), Godot 4 (RenderingDevice), Frostbite, id Tech 7.
		- ```mermaid
		  graph TD
		      GBuf["G-Buffer Pass\nWrite: Albedo, Normal, Depth"]
		      Shadow["Shadow Map Pass\nWrite: ShadowMap"]
		      SSAO["SSAO Pass\nRead: Depth, Normal\nWrite: AO texture"]
		      Lighting["Deferred Lighting Pass\nRead: GBuffer, ShadowMap, AO\nWrite: HDR color"]
		      Bloom["Bloom Pass\nRead: HDR color\nWrite: Bloom texture"]
		      Tonemap["Tonemap Pass\nRead: HDR color, Bloom\nWrite: LDR backbuffer"]
		      Present["Present\nDisplay backbuffer"]
		  
		      GBuf --> SSAO
		      GBuf --> Lighting
		      Shadow --> Lighting
		      SSAO --> Lighting
		      Lighting --> Bloom
		      Lighting --> Tonemap
		      Bloom --> Tonemap
		      Tonemap --> Present
		  ```
	-
	- ## Deferred Rendering
	  collapsed:: true
		- ```mermaid
		  graph LR
		      subgraph GPass["Geometry Pass"]
		          Geo["Scene geometry"] --> GB1["Albedo buffer"]
		          Geo --> GB2["Normal buffer"]
		          Geo --> GB3["Depth buffer"]
		          Geo --> GB4["Roughness/Metallic buffer"]
		      end
		      subgraph LPass["Lighting Pass"]
		          GB1 --> Light["Lighting calculation\nfor ALL lights at once"]
		          GB2 --> Light
		          GB3 --> Light
		          GB4 --> Light
		          Light --> HDR["HDR color buffer"]
		      end
		  ```
		- | Technique | Cost | Lights | Transparency | Use Case |
		  |-----------|------|--------|-------------|---------|
		  | Forward | O(objects × lights) | Few | Yes | Simple scenes, mobile |
		  | Deferred | O(objects + lights) | Many | No | Complex scenes, many lights |
		  | Forward+ (Tiled) | O(objects + tiles×lights) | Many | Yes | Best of both worlds |
		  | Clustered Forward | O(objects + clusters×lights) | Very many | Yes | Modern AAA standard |
	-
	- ## Bindless Resources
	  collapsed:: true
		- > [!info] Bindless Rendering
		  > Traditional: bind each texture/buffer individually before each draw call (expensive).
		  > Bindless: put ALL resources in one giant descriptor heap, index them in the shader.
		  > Eliminates per-draw binding overhead. Required for GPU-driven rendering.
		- ```hlsl
		  // Bindless textures — DX12 / Vulkan
		  // All textures in one heap, indexed by uint
		  Texture2D g_Textures[] : register(t0, space0);
		  SamplerState g_Sampler : register(s0);
		  
		  struct DrawData {
		      uint albedoIndex;
		      uint normalIndex;
		      uint roughnessIndex;
		      uint materialFlags;
		  };
		  
		  StructuredBuffer<DrawData> g_DrawData : register(t0, space1);
		  
		  float4 PSMain(PSInput input) : SV_TARGET {
		      DrawData data = g_DrawData[input.drawID];
		  
		      // Index into bindless texture array
		      float4 albedo    = g_Textures[data.albedoIndex].Sample(g_Sampler, input.uv);
		      float3 normal    = g_Textures[data.normalIndex].Sample(g_Sampler, input.uv).xyz;
		      float  roughness = g_Textures[data.roughnessIndex].Sample(g_Sampler, input.uv).r;
		  
		      return albedo; // simplified
		  }
		  ```
	-
	- ## GPU-Driven Rendering
	  collapsed:: true
		- ```mermaid
		  graph TD
		      subgraph CPU["CPU (minimal work)"]
		          Upload["Upload scene data\nto GPU once"]
		          Dispatch["Dispatch compute shader"]
		      end
		      subgraph GPU["GPU (does everything)"]
		          Cull["Compute: Frustum + Occlusion Culling\nDetermines which objects are visible"]
		          IndirectArgs["Write indirect draw arguments\nto GPU buffer"]
		          Draw["ExecuteIndirect / DrawIndirect\nGPU issues its own draw calls"]
		      end
		      Upload --> Dispatch --> Cull --> IndirectArgs --> Draw
		  ```
		- > [!tip] Why GPU-Driven?
		  > Traditional: CPU loops through objects, issues draw calls one by one (CPU bottleneck).
		  > GPU-driven: GPU culls and draws everything itself. CPU just dispatches one compute + one indirect draw.
		  > Used by: Nanite (UE5), Frostbite, id Tech 7, modern AAA engines.
	-
	- ## Mesh Shaders
	  collapsed:: true
		- > [!info] Mesh Shaders (DX12 Ultimate / Vulkan 1.3+)
		  > Mesh shaders replace the traditional vertex + geometry shader pipeline with a more flexible compute-like model.
		  > Enables: procedural geometry, LOD in shader, culling in shader, custom primitive topologies.
		- ```mermaid
		  graph LR
		      subgraph Old["Old Pipeline"]
		          IA["Input Assembler"] --> VS["Vertex Shader"] --> GS["Geometry Shader"] --> Rast1["Rasterizer"]
		      end
		      subgraph New["Mesh Shader Pipeline"]
		          TS["Task Shader\n(Amplification)\nCulling, LOD selection"] --> MS["Mesh Shader\nGenerate vertices + primitives"] --> Rast2["Rasterizer"]
		      end
		  ```
		- | Feature | Vertex Shader | Mesh Shader |
		  |---------|--------------|-------------|
		  | Input | Fixed vertex buffer | Flexible — any data |
		  | Output | One vertex | Up to 256 vertices + 512 primitives |
		  | Culling | CPU or geometry shader | Task shader on GPU |
		  | LOD | CPU-side | Task shader on GPU |
		  | Procedural geo | Geometry shader (slow) | Native, fast |
-
- # PBR — Physically Based Rendering
  collapsed:: true
	- > [!info] PBR Standard
	  > PBR is the modern standard for realistic material rendering. Used in all major engines and games since ~2013.
	  > Based on physics of light interaction with surfaces.
	-
	- ## PBR Material Model
	  collapsed:: true
		- | Parameter | Range | Description |
		  |-----------|-------|-------------|
		  | Albedo | 0–1 RGB | Base color, no lighting baked in |
		  | Metallic | 0–1 | 0 = dielectric (plastic/wood), 1 = metal |
		  | Roughness | 0–1 | 0 = mirror smooth, 1 = fully diffuse |
		  | Normal | XYZ | Surface detail without geometry |
		  | AO | 0–1 | Ambient occlusion — crevice darkening |
		  | Emission | RGB | Self-illumination, ignores lighting |
		  | Height/Displacement | 0–1 | Surface displacement |
	-
	- ## Cook-Torrance BRDF
	  collapsed:: true
		- ```glsl
		  // Cook-Torrance specular BRDF — industry standard PBR
		  // f(l,v) = D(h) * F(v,h) * G(l,v,h) / (4 * dot(n,l) * dot(n,v))
		  
		  // D — Normal Distribution Function (GGX/Trowbridge-Reitz)
		  float DistributionGGX(vec3 N, vec3 H, float roughness) {
		      float a  = roughness * roughness;
		      float a2 = a * a;
		      float NdotH  = max(dot(N, H), 0.0);
		      float NdotH2 = NdotH * NdotH;
		      float denom = (NdotH2 * (a2 - 1.0) + 1.0);
		      return a2 / (PI * denom * denom);
		  }
		  
		  // F — Fresnel-Schlick approximation
		  vec3 FresnelSchlick(float cosTheta, vec3 F0) {
		      return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
		  }
		  
		  // G — Geometry function (Smith's method)
		  float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
		      float NdotV = max(dot(N, V), 0.0);
		      float NdotL = max(dot(N, L), 0.0);
		      float ggx1  = GeometrySchlickGGX(NdotV, roughness);
		      float ggx2  = GeometrySchlickGGX(NdotL, roughness);
		      return ggx1 * ggx2;
		  }
		  
		  // Full PBR lighting calculation
		  vec3 PBR_Lighting(vec3 albedo, float metallic, float roughness,
		                    vec3 N, vec3 V, vec3 L, vec3 lightColor) {
		      vec3 H  = normalize(V + L);
		      vec3 F0 = mix(vec3(0.04), albedo, metallic); // base reflectivity
		  
		      float D = DistributionGGX(N, H, roughness);
		      vec3  F = FresnelSchlick(max(dot(H, V), 0.0), F0);
		      float G = GeometrySmith(N, V, L, roughness);
		  
		      vec3  specular = (D * F * G) / (4.0 * max(dot(N,V),0.0) * max(dot(N,L),0.0) + 0.0001);
		      vec3  kD = (vec3(1.0) - F) * (1.0 - metallic);
		      vec3  diffuse = kD * albedo / PI;
		  
		      float NdotL = max(dot(N, L), 0.0);
		      return (diffuse + specular) * lightColor * NdotL;
		  }
		  ```
-
- # Performance & Optimization
  collapsed:: true
	- ## GPU Profiling Tools
	  collapsed:: true
		- | Tool | Platform | What It Shows |
		  |------|----------|--------------|
		  | RenderDoc | All | Frame capture, draw call inspection, shader debugging |
		  | NVIDIA Nsight | NVIDIA | GPU timeline, shader occupancy, memory bandwidth |
		  | AMD Radeon GPU Profiler | AMD | GPU timeline, shader analysis |
		  | Intel GPA | Intel | Frame analysis, GPU metrics |
		  | Xcode GPU Frame Capture | Apple | Metal frame debugging |
		  | PIX | Windows/Xbox | DX12 frame capture and analysis |
		  | Chrome DevTools | Browser | WebGPU timing |
	-
	- ## Common GPU Bottlenecks
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Bottleneck["GPU Bottleneck?"]
		      CPU["CPU Bound\nDraw call submission\ntoo slow"]
		      Vertex["Vertex Bound\nToo many vertices\ncomplex vertex shader"]
		      Fragment["Fragment Bound\nToo many pixels\ncomplex pixel shader"]
		      Memory["Memory Bound\nTexture bandwidth\nbuffer reads"]
		      Bottleneck --> CPU
		      Bottleneck --> Vertex
		      Bottleneck --> Fragment
		      Bottleneck --> Memory
		      CPU -->|Fix| CPUFix["Instancing\nIndirect drawing\nBatching"]
		      Vertex -->|Fix| VFix["LOD\nMesh simplification\nVertex shader optimization"]
		      Fragment -->|Fix| FFix["Early-Z\nDepth prepass\nShader simplification"]
		      Memory -->|Fix| MFix["Texture compression\nMipmaps\nCoalesced access"]
		  ```
	-
	- ## Shader Optimization Rules
	  collapsed:: true
		- | Rule | Why | How |
		  |------|-----|-----|
		  | Avoid branching | Warp divergence halves throughput | Use `step()`, `mix()`, `select()` instead |
		  | Use half precision on mobile | 2x throughput on mobile GPUs | `half` / `mediump` types |
		  | Minimize texture samples | Each sample = memory bandwidth | Cache samples, use fewer textures |
		  | Precompute in vertex shader | Runs fewer times than fragment | Move invariant math to VS |
		  | Use MAD instructions | Single cycle multiply-add | `a * b + c` compiles to MAD |
		  | Avoid dynamic indexing | Breaks compiler optimization | Use constant indices when possible |
		  | Pack data tightly | Better cache utilization | Use `vec4` not 4 separate `float` |
- collapsed:: true
- # More Learn
  collapsed:: true
	- ## Official Documentation
		- [Vulkan Specification](https://registry.khronos.org/vulkan/specs/1.3/html/) — Official Vulkan spec. Comprehensive reference.
		- [Vulkan Tutorial](https://vulkan-tutorial.com/) — Best free Vulkan tutorial. Covers full pipeline from scratch.
		- [DirectX 12 Docs — Microsoft](https://learn.microsoft.com/en-us/windows/win32/direct3d12/direct3d-12-graphics) — Official DX12 documentation.
		- [Metal Documentation — Apple](https://developer.apple.com/documentation/metal) — Official Metal docs with Swift/Obj-C examples.
		- [WebGPU Spec — W3C](https://www.w3.org/TR/webgpu/) — Official WebGPU specification.
		- [WebGPU Fundamentals](https://webgpufundamentals.org/) — Best free WebGPU learning resource.
		- [HLSL Reference — Microsoft](https://learn.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-reference) — Complete HLSL language reference.
	-
	- ## Books
		- [Real-Time Rendering 4th Ed](https://www.realtimerendering.com/) — The definitive graphics programming book. Free chapter summaries online.
		- [Physically Based Rendering — PBRT](https://pbrt.org/) — Free online. The bible of physically based rendering.
		- [GPU Gems Series — NVIDIA](https://developer.nvidia.com/gpugems/gpugems/foreword) — Free online. Advanced GPU techniques.
		- [Vulkan Guide](https://vkguide.dev/) — Free. Practical Vulkan from scratch with modern patterns.
	-
	- ## Tools & Libraries
		- [RenderDoc](https://renderdoc.org/) — Free GPU frame debugger. Works with Vulkan, DX11/12, OpenGL, Metal.
		- [VulkanMemoryAllocator — AMD](https://github.com/GPUOpen-LibrariesAndSDKs/VulkanMemoryAllocator) — Free. Simplifies Vulkan memory management.
		- [SPIRV-Cross](https://github.com/KhronosGroup/SPIRV-Cross) — Free. Cross-compile SPIR-V to GLSL/HLSL/MSL.
		- [wgpu — Rust](https://wgpu.rs/) — Free. WebGPU implementation in Rust. Works natively + in browser.
		- [bgfx](https://github.com/bkaradzic/bgfx) — Free. Cross-platform rendering library abstracting Vulkan/DX12/Metal/WebGPU.