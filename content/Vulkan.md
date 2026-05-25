---
date: 2026-04-13T17:36:08+05:30
lastmod: 2026-04-17T17:08:18+05:30

seoTitle: Vulkan API Complete Guide – Zero to Ray Tracing
description: "The most complete Vulkan reference note. Covers every concept from Instance creation to Ray Tracing — with full C++ code, diagrams, and explanations for every stage."
keywords: "vulkan api, vulkan tutorial, vulkan c++, vkbuffer, vkimage, vkpipeline, descriptor sets, push constants, synchronization, compute shaders, bindless, ray tracing, vma, vr-rathod"
---

tags:: index, graphics-programming, advanced-graphics, c++
title:: Vulkan

- # Vulkan — The Complete Masterclass
  collapsed:: true
	- > [!info] How to Read This Page
	  > This note teaches Vulkan **in the exact order you build it** — each section depends on the last.
	  > Every concept includes an explanation of WHY it exists, HOW it works, and full C++ code.
	  > No shortcuts. No "just trust me". Everything is explained.
	  >
	  > **A Vulkan application has exactly these layers, built in this order:**
	  >
	  > ```
	  > Instance → Physical Device → Logical Device → Surface → Swapchain
	  >   → Image Views → Render Pass → Pipeline → Framebuffers
	  >   → Command Buffers → Synchronization → Main Loop → [Advanced Topics]
	  > ```
	- ## Why Learn Vulkan?
	  collapsed:: true
		- | Feature | OpenGL (Old) | Vulkan (Modern) |
		  |---|---|---|
		  | Driver Overhead | Enormous | Near Zero |
		  | Thread Safety | Unsafe | Fully Multi-threaded |
		  | Error Checking | Automatic (hidden) | You control it via Validation Layers |
		  | Memory | Driver manages it | You manage it explicitly |
		  | Pipeline State | Global state machine | Immutable baked Pipeline Objects |
		  | Multi GPU | Impossible | Built-in |
		  | Performance Predictability | Unpredictable | Frame-perfect deterministic |
	- ## The Vulkan Execution Model
	  collapsed:: true
		- ```mermaid
		  graph TD
		      CPU["🖥️ CPU (Your C++ App)"]
		      CB["VkCommandBuffer\nRecord commands into this"]
		      Q["VkQueue\nSubmit command buffers here"]
		      GPU["🎮 GPU\nExecutes everything asynchronously"]
		      Fence["VkFence\nCPU waits on this to know GPU is done"]
		      CPU -->|"vkBeginCommandBuffer()"| CB
		      CB -->|"vkEndCommandBuffer()"| Q
		      Q -->|"vkQueueSubmit()"| GPU
		      GPU -->|"signals when done"| Fence
		      Fence -->|"vkWaitForFences()"| CPU
		  ```
- # 1 — Prerequisites and Setup
  collapsed:: true
	- ## What You Must Know Before Starting
	  collapsed:: true
		- ```
		  ✔ C++ (classes, RAII, smart pointers, move semantics)
		  ✔ Basic linear algebra (vectors, matrices, dot product)
		  ✔ What a shader is (vertex transforms positions, fragment colors pixels)
		  ✔ What a frame buffer is (a block of pixels rendered to before display)
		  ```
	- ## Libraries You Need
	  collapsed:: true
		- | Library | Purpose | Install |
		  |---|---|---|
		  | **Vulkan SDK** | The core API headers + validation layers | lunarg.com/vulkan-sdk |
		  | **GLFW** | Cross-platform window + surface creation | glfw.org or vcpkg |
		  | **GLM** | Math library matching GLSL types (`vec3`, `mat4`) | vcpkg |
		  | **VMA** | Vulkan Memory Allocator — automatic GPU memory | GitHub: GPUOpen-LibrariesAndSDKs |
		  | **stb_image.h** | Load PNG/JPG into CPU memory | single header, stb repo |
		  | **tinyobjloader** | Load .OBJ meshes | single header |
	- ## Project Setup (CMakeLists.txt)
	  collapsed:: true
		- ```cmake
		  cmake_minimum_required(VERSION 3.20)
		  project(VulkanEngine)
		  
		  set(CMAKE_CXX_STANDARD 20)
		  
		  find_package(Vulkan REQUIRED)
		  find_package(glfw3 REQUIRED)
		  find_package(glm CONFIG REQUIRED)
		  
		  add_executable(VulkanEngine main.cpp)
		  
		  target_link_libraries(VulkanEngine
		      Vulkan::Vulkan
		      glfw
		      glm::glm
		  )
		  ```
- # 2 — VkInstance (Connecting to Vulkan)
  collapsed:: true
	- ## What Is a VkInstance?
	  collapsed:: true
		- The `VkInstance` is the very first thing you create. It is the bridge between your application and the Vulkan library. Think of it as "telling Vulkan: I exist, these are my requirements, and these are the layers I want for debugging."
		- > [!warning] The instance must be the FIRST thing created and the LAST thing destroyed. Everything else depends on it.
	- ## Vulkan Extensions
	  collapsed:: true
		- Extensions are **optional features** added on top of core Vulkan. Common ones:
		- | Extension | Why you need it |
		  |---|---|
		  | `VK_KHR_surface` | Required to show output on a window |
		  | `VK_KHR_win32_surface` | Windows-specific surface support |
		  | `VK_EXT_debug_utils` | Enables human-readable debug messages |
		  | `VK_KHR_ray_tracing_pipeline` | Hardware ray tracing |
		  | `VK_KHR_swapchain` | Required to create a swapchain (present to screen) |
	- ## Validation Layers — Your Best Friend
	  collapsed:: true
		- By default, Vulkan does **zero error checking** for performance. Validation Layers are a separate debug middleware that intercept every API call and check for mistakes:
		- ```
		  VK_LAYER_KHRONOS_validation catches:
		    ✔ Using a destroyed object
		    ✔ Forgetting to synchronize resources before use
		    ✔ Passing invalid parameters
		    ✔ Image layout transitions done in wrong order
		    ✔ Memory leaks
		  ```
		- > [!tip] ALWAYS enable validation layers during development. Disable them ONLY in release builds.
	- ## Creating the Instance
	  collapsed:: true
		- ```cpp
		  #define GLFW_INCLUDE_VULKAN
		  #include <GLFW/glfw3.h>
		  #include <vector>
		  #include <stdexcept>
		  
		  // The debug validation layers we want (debug only)
		  const std::vector<const char*> validationLayers = {
		      "VK_LAYER_KHRONOS_validation"
		  };
		  
		  void createInstance(VkInstance& instance) {
		      // -- Step 1: Describe your application --
		      VkApplicationInfo appInfo{};
		      appInfo.sType              = VK_STRUCTURE_TYPE_APPLICATION_INFO;
		      appInfo.pApplicationName   = "My Vulkan Game";
		      appInfo.applicationVersion = VK_MAKE_VERSION(1, 0, 0);
		      appInfo.pEngineName        = "My Engine";
		      appInfo.engineVersion      = VK_MAKE_VERSION(1, 0, 0);
		      appInfo.apiVersion         = VK_API_VERSION_1_3; // Use Vulkan 1.3
		  
		      // -- Step 2: Get required extensions from GLFW --
		      uint32_t glfwExtensionCount = 0;
		      const char** glfwExtensions = glfwGetRequiredInstanceExtensions(&glfwExtensionCount);
		  
		      std::vector<const char*> extensions(glfwExtensions, glfwExtensions + glfwExtensionCount);
		      extensions.push_back(VK_EXT_DEBUG_UTILS_EXTENSION_NAME); // For debug messages
		  
		      // -- Step 3: Fill in the creation info --
		      VkInstanceCreateInfo createInfo{};
		      createInfo.sType                   = VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO;
		      createInfo.pApplicationInfo        = &appInfo;
		      createInfo.enabledExtensionCount   = (uint32_t)extensions.size();
		      createInfo.ppEnabledExtensionNames = extensions.data();
		  
		  #ifdef _DEBUG
		      createInfo.enabledLayerCount   = (uint32_t)validationLayers.size();
		      createInfo.ppEnabledLayerNames = validationLayers.data();
		  #else
		      createInfo.enabledLayerCount = 0;
		  #endif
		  
		      // -- Step 4: Create it! --
		      if (vkCreateInstance(&createInfo, nullptr, &instance) != VK_SUCCESS) {
		          throw std::runtime_error("Failed to create Vulkan instance!");
		      }
		  }
		  ```
- # 3 — Physical Device (Picking a GPU)
  collapsed:: true
	- ## What Is a Physical Device?
	  collapsed:: true
		- `VkPhysicalDevice` represents a real GPU in the machine (NVIDIA RTX 4090, AMD RX 7900, Intel Arc, etc.). You do NOT create it — you enumerate (list) what's available and pick the best.
		- > [!note] You can have multiple physical devices and run work on all of them simultaneously. Most games only use one.
	- ## Querying GPU Properties
	  collapsed:: true
		- ```cpp
		  uint32_t deviceCount = 0;
		  vkEnumeratePhysicalDevices(instance, &deviceCount, nullptr);
		  
		  if (deviceCount == 0) {
		      throw std::runtime_error("No GPUs with Vulkan support found!");
		  }
		  
		  std::vector<VkPhysicalDevice> devices(deviceCount);
		  vkEnumeratePhysicalDevices(instance, &deviceCount, devices.data());
		  
		  for (const auto& device : devices) {
		      VkPhysicalDeviceProperties props;
		      vkGetPhysicalDeviceProperties(device, &props);
		  
		      VkPhysicalDeviceFeatures features;
		      vkGetPhysicalDeviceFeatures(device, &features);
		  
		      // Pick a Discrete GPU (dedicated GPU, not integrated chip)
		      if (props.deviceType == VK_PHYSICAL_DEVICE_TYPE_DISCRETE_GPU && features.geometryShader) {
		          physicalDevice = device;
		      }
		  }
		  ```
	- ## Rating GPUs (Best Practice)
	  collapsed:: true
		- ```cpp
		  // Instead of just picking ANY GPU, score them and pick the best
		  int rateDevice(VkPhysicalDevice device) {
		      VkPhysicalDeviceProperties props;
		      vkGetPhysicalDeviceProperties(device, &props);
		  
		      int score = 0;
		  
		      // Dedicated GPUs score much higher
		      if (props.deviceType == VK_PHYSICAL_DEVICE_TYPE_DISCRETE_GPU)
		          score += 1000;
		  
		      // More VRAM = better
		      VkPhysicalDeviceMemoryProperties memProps;
		      vkGetPhysicalDeviceMemoryProperties(device, &memProps);
		      for (uint32_t i = 0; i < memProps.memoryHeapCount; i++) {
		          if (memProps.memoryHeaps[i].flags & VK_MEMORY_HEAP_DEVICE_LOCAL_BIT)
		              score += (int)(memProps.memoryHeaps[i].size / (1024 * 1024)); // MB counts
		      }
		  
		      // Max texture size bonus
		      score += props.limits.maxImageDimension2D / 1000;
		  
		      return score;
		  }
		  ```
- # 4 — Queue Families
  collapsed:: true
	- ## Understanding GPU Queues
	  collapsed:: true
		- GPUs don't have one single "do everything" interface. They expose **Queue Families** — specialized hardware paths for different types of work.
		- | Queue Type | What it can do | Hardware Example |
		  |---|---|---|
		  | **Graphics** | Draw, Compute, Transfer | NVIDIA's Universal queue |
		  | **Compute** | Compute  only — async compute | AMD's Async Compute Engine |
		  | **Transfer** | Fast memory copies | DMA unit |
		  | **Present** | Present frames to a window surface | Usually the same as Graphics |
		- > [!tip] In most cases you find ONE queue family index that supports `Graphics + Compute + Transfer + Present` and use it for everything. Async Compute requires deliberately using a *separate* Compute queue family index.
	- ## Finding Queue Family Indices
	  collapsed:: true
		- ```cpp
		  struct QueueFamilyIndices {
		      std::optional<uint32_t> graphicsFamily;
		      std::optional<uint32_t> presentFamily;
		  
		      bool isComplete() const {
		          return graphicsFamily.has_value() && presentFamily.has_value();
		      }
		  };
		  
		  QueueFamilyIndices findQueueFamilies(VkPhysicalDevice device, VkSurfaceKHR surface) {
		      QueueFamilyIndices indices;
		  
		      uint32_t queueFamilyCount = 0;
		      vkGetPhysicalDeviceQueueFamilyProperties(device, &queueFamilyCount, nullptr);
		  
		      std::vector<VkQueueFamilyProperties> queueFamilies(queueFamilyCount);
		      vkGetPhysicalDeviceQueueFamilyProperties(device, &queueFamilyCount, queueFamilies.data());
		  
		      for (uint32_t i = 0; i < queueFamilies.size(); i++) {
		          // Check if this family can do graphics
		          if (queueFamilies[i].queueFlags & VK_QUEUE_GRAPHICS_BIT)
		              indices.graphicsFamily = i;
		  
		          // Check if this family can present (show) to our window surface
		          VkBool32 presentSupport = false;
		          vkGetPhysicalDeviceSurfaceSupportKHR(device, i, surface, &presentSupport);
		          if (presentSupport)
		              indices.presentFamily = i;
		  
		          if (indices.isComplete()) break;
		      }
		  
		      return indices;
		  }
		  ```
- # 5 — Logical Device (VkDevice)
  collapsed:: true
	- ## What Is a Logical Device?
	  collapsed:: true
		- The `VkDevice` is your application's handle to the GPU. Everything you create after this (buffers, pipelines, images) belongs to this logical device.
		- Physical Device = The physical hardware that exists in your computer.
		- Logical Device = *Your application's view* of that hardware. You can create multiple logical devices from one physical device (e.g., for different "tenants" in a cloud GPU server).
	- ## Creating the Logical Device
	  collapsed:: true
		- ```cpp
		  void createLogicalDevice(VkPhysicalDevice physicalDevice, QueueFamilyIndices indices,
		                           VkDevice& device, VkQueue& graphicsQueue) {
		  
		      float queuePriority = 1.0f; // 1.0 = highest priority (range: 0.0 to 1.0)
		  
		      VkDeviceQueueCreateInfo queueCreateInfo{};
		      queueCreateInfo.sType            = VK_STRUCTURE_TYPE_DEVICE_QUEUE_CREATE_INFO;
		      queueCreateInfo.queueFamilyIndex = indices.graphicsFamily.value();
		      queueCreateInfo.queueCount       = 1;
		      queueCreateInfo.pQueuePriorities = &queuePriority;
		  
		      // Request specific GPU features (must be supported by physical device)
		      VkPhysicalDeviceFeatures deviceFeatures{};
		      deviceFeatures.samplerAnisotropy = VK_TRUE; // For texture filtering
		      deviceFeatures.fillModeNonSolid  = VK_TRUE; // For wireframe rendering
		  
		      // Device extensions we need (swapchain lets us display to a window)
		      const std::vector<const char*> deviceExtensions = {
		          VK_KHR_SWAPCHAIN_EXTENSION_NAME
		      };
		  
		      VkDeviceCreateInfo createInfo{};
		      createInfo.sType                   = VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO;
		      createInfo.pQueueCreateInfos        = &queueCreateInfo;
		      createInfo.queueCreateInfoCount     = 1;
		      createInfo.pEnabledFeatures         = &deviceFeatures;
		      createInfo.enabledExtensionCount    = (uint32_t)deviceExtensions.size();
		      createInfo.ppEnabledExtensionNames  = deviceExtensions.data();
		  
		      if (vkCreateDevice(physicalDevice, &createInfo, nullptr, &device) != VK_SUCCESS) {
		          throw std::runtime_error("Failed to create logical device!");
		      }
		  
		      // Retrieve the handle for the queue we just created
		      vkGetDeviceQueue(device, indices.graphicsFamily.value(), 0, &graphicsQueue);
		  }
		  ```
- # 6 — Window Surface (VkSurfaceKHR)
  collapsed:: true
	- ## Why a Surface?
	  collapsed:: true
		- Vulkan is platform-agnostic. It knows nothing about Windows, Linux, or macOS windows. A `VkSurfaceKHR` is the **bridge** between Vulkan and your windowing system (Win32, X11, Wayland, Cocoa).
		- GLFW abstracts this for us in one call:
		- ```cpp
		  VkSurfaceKHR surface;
		  
		  // GLFW handles the platform-specific surface creation for you
		  if (glfwCreateWindowSurface(instance, window, nullptr, &surface) != VK_SUCCESS) {
		      throw std::runtime_error("Failed to create window surface!");
		  }
		  ```
		- If you were NOT using GLFW on Windows, you'd use:
		- ```cpp
		  VkWin32SurfaceCreateInfoKHR createInfo{};
		  createInfo.sType     = VK_STRUCTURE_TYPE_WIN32_SURFACE_CREATE_INFO_KHR;
		  createInfo.hwnd      = GetActiveWindow();
		  createInfo.hinstance = GetModuleHandle(nullptr);
		  vkCreateWin32SurfaceKHR(instance, &createInfo, nullptr, &surface);
		  ```
- # 7 — Swapchain (VkSwapchainKHR)
  collapsed:: true
	- ## What Is a Swapchain?
	  collapsed:: true
		- The swapchain is an array of images waiting to be rendered to and then displayed on the monitor. The GPU renders into one image while the others are being shown or waiting.
		- ```mermaid
		  graph LR
		      subgraph Swapchain
		          I0["Image 0\n🟢 On Screen Right Now"]
		          I1["Image 1\n🟡 Waiting (V-Sync)"]
		          I2["Image 2\n🔵 GPU Rendering Here"]
		      end
		      I2 -->|"becomes ready"| I1
		      I1 -->|"V-Sync swaps"| I0
		  ```
	- ## Presentation Modes
	  collapsed:: true
		- | Mode | Behavior | Tearing? | Latency |
		  |---|---|---|---|
		  | `IMMEDIATE` | GPU presents as fast as possible | Yes | Lowest |
		  | `FIFO` | Standard V-Sync — wait for monitor refresh | No | Moderate |
		  | `FIFO_RELAXED` | V-Sync but skips if late | Sometimes | Moderate |
		  | `MAILBOX` | Triple buffering — replaces unshown frames | No | Best of both |
	- ## Swapchain Configuration
	  collapsed:: true
		- When creating the swapchain, you must choose a surface **format** (color depth) and **extent** (resolution).
		- ```cpp
		  // Query what the surface/GPU supports
		  VkSurfaceCapabilitiesKHR caps;
		  vkGetPhysicalDeviceSurfaceCapabilitiesKHR(physicalDevice, surface, &caps);
		  
		  VkSwapchainCreateInfoKHR createInfo{};
		  createInfo.sType            = VK_STRUCTURE_TYPE_SWAPCHAIN_CREATE_INFO_KHR;
		  createInfo.surface          = surface;
		  createInfo.minImageCount    = 3; // Triple buffering
		  createInfo.imageFormat      = VK_FORMAT_B8G8R8A8_SRGB;    // 8-bit BGRA in sRGB color space
		  createInfo.imageColorSpace  = VK_COLOR_SPACE_SRGB_NONLINEAR_KHR;
		  createInfo.imageExtent      = { windowWidth, windowHeight };
		  createInfo.imageArrayLayers = 1;                // 2 for stereoscopic 3D (VR)
		  createInfo.imageUsage       = VK_IMAGE_USAGE_COLOR_ATTACHMENT_BIT; // We render to it
		  createInfo.preTransform     = caps.currentTransform; // Usually IDENTITY
		  createInfo.compositeAlpha   = VK_COMPOSITE_ALPHA_OPAQUE_BIT_KHR; // No window transparency
		  createInfo.presentMode      = VK_PRESENT_MODE_MAILBOX_KHR;
		  createInfo.clipped          = VK_TRUE; // Don't render pixels hidden behind other windows
		  createInfo.oldSwapchain     = VK_NULL_HANDLE;
		  
		  VkSwapchainKHR swapChain;
		  vkCreateSwapchainKHR(device, &createInfo, nullptr, &swapChain);
		  
		  // Retreive the actual VkImage handles
		  uint32_t imageCount;
		  vkGetSwapchainImagesKHR(device, swapChain, &imageCount, nullptr);
		  std::vector<VkImage> swapChainImages(imageCount);
		  vkGetSwapchainImagesKHR(device, swapChain, &imageCount, swapChainImages.data());
		  ```
- # 8 — Image Views (VkImageView)
  collapsed:: true
	- ## What Is an Image View?
	  collapsed:: true
		- A `VkImage` is raw GPU memory — a block of VRAM. An `VkImageView` is a **lens** that tells Vulkan how to interpret that memory:
		- *"Is this 2D texture? A cube map? Use only mip-levels 2-5? Look at the red channel only?"*
		- You cannot use a `VkImage` directly. You always go through a `VkImageView`.
		- ```cpp
		  // Create one VkImageView for each VkImage in the swapchain
		  std::vector<VkImageView> swapChainImageViews(swapChainImages.size());
		  
		  for (size_t i = 0; i < swapChainImages.size(); i++) {
		      VkImageViewCreateInfo createInfo{};
		      createInfo.sType    = VK_STRUCTURE_TYPE_IMAGE_VIEW_CREATE_INFO;
		      createInfo.image    = swapChainImages[i];
		      createInfo.viewType = VK_IMAGE_VIEW_TYPE_2D;  // Interpret as a 2D texture
		      createInfo.format   = VK_FORMAT_B8G8R8A8_SRGB; // Same as swapchain format
		  
		      // How to map RGBA channels (here: R->R, G->G, B->B, A->A, no swizzling)
		      createInfo.components.r = VK_COMPONENT_SWIZZLE_IDENTITY;
		      createInfo.components.g = VK_COMPONENT_SWIZZLE_IDENTITY;
		      createInfo.components.b = VK_COMPONENT_SWIZZLE_IDENTITY;
		      createInfo.components.a = VK_COMPONENT_SWIZZLE_IDENTITY;
		  
		      // Which parts of the image to access (mip levels, array layers)
		      createInfo.subresourceRange.aspectMask     = VK_IMAGE_ASPECT_COLOR_BIT;
		      createInfo.subresourceRange.baseMipLevel   = 0;
		      createInfo.subresourceRange.levelCount     = 1;
		      createInfo.subresourceRange.baseArrayLayer = 0;
		      createInfo.subresourceRange.layerCount     = 1;
		  
		      vkCreateImageView(device, &createInfo, nullptr, &swapChainImageViews[i]);
		  }
		  ```
- # 9 — Render Passes (VkRenderPass)
  collapsed:: true
	- ## Why Does a Render Pass Exist?
	  collapsed:: true
		- A Render Pass tells Vulkan EVERYTHING about the rendering before it happens. This allows the GPU driver to pre-plan memory layout and tiling optimizations (especially on mobile).
		- A Render Pass defines:
		- ```
		  ✔ WHAT attachments exist (color buffer, depth buffer)
		  ✔ WHAT FORMAT those attachments are (RGBA8, D32_SFLOAT)
		  ✔ HOW to load them at the start (Clear? Load previous? Don't care?)
		  ✔ HOW to store them at the end (Save to memory? Discard?)
		  ✔ WHAT layout the attachment is in at the start and end
		  ```
	- ## Creating a Render Pass
	  collapsed:: true
		- ```cpp
		  // ------ Color Attachment (the final rendered image) ------
		  VkAttachmentDescription colorAttachment{};
		  colorAttachment.format         = VK_FORMAT_B8G8R8A8_SRGB; // Must match swapchain format
		  colorAttachment.samples        = VK_SAMPLE_COUNT_1_BIT;    // No MSAA for now
		  colorAttachment.loadOp         = VK_ATTACHMENT_LOAD_OP_CLEAR;  // Clear to black before drawing
		  colorAttachment.storeOp        = VK_ATTACHMENT_STORE_OP_STORE; // Save result (we need to show it)
		  colorAttachment.stencilLoadOp  = VK_ATTACHMENT_LOAD_OP_DONT_CARE;
		  colorAttachment.stencilStoreOp = VK_ATTACHMENT_STORE_OP_DONT_CARE;
		  colorAttachment.initialLayout  = VK_IMAGE_LAYOUT_UNDEFINED;         // We don't care about previous content
		  colorAttachment.finalLayout    = VK_IMAGE_LAYOUT_PRESENT_SRC_KHR;   // Ready to display on screen
		  
		  // ------ Depth Attachment (for Z-buffer depth testing) ------
		  VkAttachmentDescription depthAttachment{};
		  depthAttachment.format         = VK_FORMAT_D32_SFLOAT; // 32-bit float depth
		  depthAttachment.samples        = VK_SAMPLE_COUNT_1_BIT;
		  depthAttachment.loadOp         = VK_ATTACHMENT_LOAD_OP_CLEAR;
		  depthAttachment.storeOp        = VK_ATTACHMENT_STORE_OP_DONT_CARE; // Don't save depth after rendering
		  depthAttachment.stencilLoadOp  = VK_ATTACHMENT_LOAD_OP_DONT_CARE;
		  depthAttachment.stencilStoreOp = VK_ATTACHMENT_STORE_OP_DONT_CARE;
		  depthAttachment.initialLayout  = VK_IMAGE_LAYOUT_UNDEFINED;
		  depthAttachment.finalLayout    = VK_IMAGE_LAYOUT_DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
		  
		  // ------ Subpass reference ------
		  VkAttachmentReference colorRef{};
		  colorRef.attachment = 0; // Index 0 = colorAttachment
		  colorRef.layout     = VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL;
		  
		  VkAttachmentReference depthRef{};
		  depthRef.attachment = 1; // Index 1 = depthAttachment
		  depthRef.layout     = VK_IMAGE_LAYOUT_DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
		  
		  VkSubpassDescription subpass{};
		  subpass.pipelineBindPoint       = VK_PIPELINE_BIND_POINT_GRAPHICS;
		  subpass.colorAttachmentCount    = 1;
		  subpass.pColorAttachments       = &colorRef;
		  subpass.pDepthStencilAttachment = &depthRef;
		  
		  // ------ Subpass dependency (ensures layout transitions are done correctly) ------
		  VkSubpassDependency dependency{};
		  dependency.srcSubpass    = VK_SUBPASS_EXTERNAL; // Before the render pass
		  dependency.dstSubpass    = 0;
		  dependency.srcStageMask  = VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT | VK_PIPELINE_STAGE_EARLY_FRAGMENT_TESTS_BIT;
		  dependency.srcAccessMask = 0;
		  dependency.dstStageMask  = VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT | VK_PIPELINE_STAGE_EARLY_FRAGMENT_TESTS_BIT;
		  dependency.dstAccessMask = VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT | VK_ACCESS_DEPTH_STENCIL_ATTACHMENT_WRITE_BIT;
		  
		  // ------ Assemble the Render Pass ------
		  std::array<VkAttachmentDescription, 2> attachments = {colorAttachment, depthAttachment};
		  
		  VkRenderPassCreateInfo renderPassInfo{};
		  renderPassInfo.sType           = VK_STRUCTURE_TYPE_RENDER_PASS_CREATE_INFO;
		  renderPassInfo.attachmentCount = (uint32_t)attachments.size();
		  renderPassInfo.pAttachments    = attachments.data();
		  renderPassInfo.subpassCount    = 1;
		  renderPassInfo.pSubpasses      = &subpass;
		  renderPassInfo.dependencyCount = 1;
		  renderPassInfo.pDependencies   = &dependency;
		  
		  VkRenderPass renderPass;
		  vkCreateRenderPass(device, &renderPassInfo, nullptr, &renderPass);
		  ```
- # 10 — Shaders and SPIR-V
  collapsed:: true
	- ## The Vulkan Shader Pipeline
	  collapsed:: true
		- Vulkan does NOT accept GLSL or HLSL source code directly. It only accepts **SPIR-V** — a compiled binary intermediate format. You compile GLSL → SPIR-V using the `glslc` compiler (included in the Vulkan SDK).
		- ```bash
		  # Compile vertex shader
		  glslc shader.vert -o vert.spv
		  
		  # Compile fragment shader
		  glslc shader.frag -o frag.spv
		  
		  # Compile HLSL to SPIR-V for Vulkan
		  dxc -spirv -T vs_6_6 -E VSMain shader.hlsl -Fo vert.spv
		  ```
	- ## Writing a Vertex Shader (GLSL)
	  collapsed:: true
		- ```glsl
		  // shader.vert
		  #version 450
		  
		  // Vertex input attributes (from VkVertexInputAttributeDescription)
		  layout(location = 0) in vec3 inPosition;
		  layout(location = 1) in vec3 inColor;
		  layout(location = 2) in vec2 inTexCoord;
		  
		  // Outputs to the fragment shader
		  layout(location = 0) out vec3 fragColor;
		  layout(location = 1) out vec2 fragTexCoord;
		  
		  // Uniform Buffer Object — shared data from CPU (e.g., matrices)
		  layout(binding = 0) uniform UniformBufferObject {
		      mat4 model;      // Transform: local space → world space
		      mat4 view;       // Transform: world space → camera space
		      mat4 proj;       // Transform: camera space → clip space
		  } ubo;
		  
		  void main() {
		      // gl_Position is the built-in clip-space output
		      gl_Position = ubo.proj * ubo.view * ubo.model * vec4(inPosition, 1.0);
		      fragColor    = inColor;
		      fragTexCoord = inTexCoord;
		  }
		  ```
	- ## Writing a Fragment Shader (GLSL)
	  collapsed:: true
		- ```glsl
		  // shader.frag
		  #version 450
		  
		  // Received from vertex shader
		  layout(location = 0) in vec3 fragColor;
		  layout(location = 1) in vec2 fragTexCoord;
		  
		  // Texture and sampler (from descriptor set)
		  layout(binding = 1) uniform sampler2D texSampler;
		  
		  // Output: the final pixel color
		  layout(location = 0) out vec4 outColor;
		  
		  void main() {
		      // Sample the texture at the UV coordinate, multiply with vertex color
		      outColor = texture(texSampler, fragTexCoord) * vec4(fragColor, 1.0);
		  }
		  ```
	- ## Loading SPIR-V and Creating Shader Modules
	  collapsed:: true
		- ```cpp
		  // Helper: read binary SPIR-V file
		  std::vector<char> readFile(const std::string& filename) {
		      std::ifstream file(filename, std::ios::ate | std::ios::binary);
		      if (!file.is_open()) throw std::runtime_error("Failed to open file!");
		  
		      size_t fileSize = (size_t)file.tellg();
		      std::vector<char> buffer(fileSize);
		      file.seekg(0);
		      file.read(buffer.data(), fileSize);
		      return buffer;
		  }
		  
		  // Create shader module from SPIR-V bytecode
		  VkShaderModule createShaderModule(VkDevice device, const std::vector<char>& code) {
		      VkShaderModuleCreateInfo createInfo{};
		      createInfo.sType    = VK_STRUCTURE_TYPE_SHADER_MODULE_CREATE_INFO;
		      createInfo.codeSize = code.size();
		      createInfo.pCode    = reinterpret_cast<const uint32_t*>(code.data());
		  
		      VkShaderModule shaderModule;
		      vkCreateShaderModule(device, &createInfo, nullptr, &shaderModule);
		      return shaderModule;
		  }
		  
		  // Usage
		  auto vertCode = readFile("vert.spv");
		  auto fragCode = readFile("frag.spv");
		  
		  VkShaderModule vertShaderModule = createShaderModule(device, vertCode);
		  VkShaderModule fragShaderModule = createShaderModule(device, fragCode);
		  ```
- # 11 — The Graphics Pipeline (VkPipeline)
  collapsed:: true
	- ## The Complete Pipeline Diagram
	  collapsed:: true
		- ```mermaid
		  graph TD
		      VA["Vertex Assembly\nCollect vertices from buffer by indices"]
		      VS["Vertex Shader\nRuns once per vertex. Computes position."]
		      TS["Tessellation (optional)\nSubdivide geometry for smoother curves"]
		      GS["Geometry Shader (optional)\nGenerate/destroy primitives"]
		      Clip["Clipping\nDiscard primitives fully outside frustum"]
		      Rast["Rasterization\nConvert triangles into fragments(pixels)"]
		      FS["Fragment Shader\nRuns once per pixel. Computes color."]
		      Depth["Depth / Stencil Test\nDiscard pixels behind other geometry"]
		      Blend["Color Blending\nAlpha blend over background"]
		      FB["Framebuffer\nFinal rendered image"]
		  
		      VA --> VS --> TS --> GS --> Clip --> Rast --> FS --> Depth --> Blend --> FB
		  ```
		- > [!important] Stages marked BOLD are **programmable via shaders**. Everything else is **fixed-function** but configurable.
	- ## Building the Graphics Pipeline Step by Step
	  collapsed:: true
		- ```cpp
		  void createGraphicsPipeline() {
		  
		      // === 1: SHADER STAGES ===
		      VkPipelineShaderStageCreateInfo vertStageInfo{};
		      vertStageInfo.sType  = VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO;
		      vertStageInfo.stage  = VK_SHADER_STAGE_VERTEX_BIT;
		      vertStageInfo.module = vertShaderModule;
		      vertStageInfo.pName  = "main"; // Entry point function in the shader
		  
		      VkPipelineShaderStageCreateInfo fragStageInfo{};
		      fragStageInfo.sType  = VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO;
		      fragStageInfo.stage  = VK_SHADER_STAGE_FRAGMENT_BIT;
		      fragStageInfo.module = fragShaderModule;
		      fragStageInfo.pName  = "main";
		  
		      VkPipelineShaderStageCreateInfo shaderStages[] = {vertStageInfo, fragStageInfo};
		  
		      // === 2: VERTEX INPUT (shape of one vertex in memory) ===
		      // Tell Vulkan: "Each vertex is this struct, with these attributes"
		      VkVertexInputBindingDescription bindingDesc{};
		      bindingDesc.binding   = 0;
		      bindingDesc.stride    = sizeof(Vertex); // e.g., {vec3 pos, vec3 color, vec2 uv} = 32 bytes
		      bindingDesc.inputRate = VK_VERTEX_INPUT_RATE_VERTEX; // Advance per-vertex (not per-instance)
		  
		      std::array<VkVertexInputAttributeDescription, 3> attrDescs{};
		      attrDescs[0] = {0, 0, VK_FORMAT_R32G32B32_SFLOAT, offsetof(Vertex, pos)};      // position
		      attrDescs[1] = {1, 0, VK_FORMAT_R32G32B32_SFLOAT, offsetof(Vertex, color)};    // color
		      attrDescs[2] = {2, 0, VK_FORMAT_R32G32_SFLOAT,    offsetof(Vertex, texCoord)}; // UV
		  
		      VkPipelineVertexInputStateCreateInfo vertexInputInfo{};
		      vertexInputInfo.sType = VK_STRUCTURE_TYPE_PIPELINE_VERTEX_INPUT_STATE_CREATE_INFO;
		      vertexInputInfo.vertexBindingDescriptionCount   = 1;
		      vertexInputInfo.pVertexBindingDescriptions      = &bindingDesc;
		      vertexInputInfo.vertexAttributeDescriptionCount = (uint32_t)attrDescs.size();
		      vertexInputInfo.pVertexAttributeDescriptions    = attrDescs.data();
		  
		      // === 3: INPUT ASSEMBLY (how vertices form primitives) ===
		      VkPipelineInputAssemblyStateCreateInfo inputAssembly{};
		      inputAssembly.sType                  = VK_STRUCTURE_TYPE_PIPELINE_INPUT_ASSEMBLY_STATE_CREATE_INFO;
		      inputAssembly.topology               = VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST; // Every 3 verts = 1 triangle
		      inputAssembly.primitiveRestartEnable = VK_FALSE;
		  
		      // === 4: VIEWPORT and SCISSOR ===
		      VkViewport viewport{};
		      viewport.x        = 0.0f;
		      viewport.y        = 0.0f;
		      viewport.width    = (float)swapChainExtent.width;
		      viewport.height   = (float)swapChainExtent.height;
		      viewport.minDepth = 0.0f; // Near plane
		      viewport.maxDepth = 1.0f; // Far plane
		  
		      VkRect2D scissor{};
		      scissor.offset = {0, 0};
		      scissor.extent = swapChainExtent; // Only render inside this rectangle
		  
		      VkPipelineViewportStateCreateInfo viewportState{};
		      viewportState.sType         = VK_STRUCTURE_TYPE_PIPELINE_VIEWPORT_STATE_CREATE_INFO;
		      viewportState.viewportCount = 1;
		      viewportState.pViewports    = &viewport;
		      viewportState.scissorCount  = 1;
		      viewportState.pScissors     = &scissor;
		  
		      // === 5: RASTERIZATION ===
		      VkPipelineRasterizationStateCreateInfo rasterizer{};
		      rasterizer.sType                   = VK_STRUCTURE_TYPE_PIPELINE_RASTERIZATION_STATE_CREATE_INFO;
		      rasterizer.depthClampEnable        = VK_FALSE;       // Don't clamp beyond near/far planes
		      rasterizer.rasterizerDiscardEnable = VK_FALSE;       // VK_TRUE would disable all output!
		      rasterizer.polygonMode             = VK_POLYGON_MODE_FILL;   // Fill triangles solid (or LINE for wireframe)
		      rasterizer.lineWidth               = 1.0f;
		      rasterizer.cullMode                = VK_CULL_MODE_BACK_BIT;          // Discard back faces
		      rasterizer.frontFace               = VK_FRONT_FACE_COUNTER_CLOCKWISE; // CCW = front face (GLM standard)
		      rasterizer.depthBiasEnable         = VK_FALSE; // No shadow map bias for now
		  
		      // === 6: MULTISAMPLING (MSAA Anti-Aliasing) ===
		      VkPipelineMultisampleStateCreateInfo multisampling{};
		      multisampling.sType                = VK_STRUCTURE_TYPE_PIPELINE_MULTISAMPLE_STATE_CREATE_INFO;
		      multisampling.sampleShadingEnable  = VK_FALSE;
		      multisampling.rasterizationSamples = VK_SAMPLE_COUNT_1_BIT; // No MSAA = 1 sample per pixel
		  
		      // === 7: DEPTH and STENCIL TEST ===
		      VkPipelineDepthStencilStateCreateInfo depthStencil{};
		      depthStencil.sType                 = VK_STRUCTURE_TYPE_PIPELINE_DEPTH_STENCIL_STATE_CREATE_INFO;
		      depthStencil.depthTestEnable       = VK_TRUE;  // Compare new pixel depth against depth buffer
		      depthStencil.depthWriteEnable      = VK_TRUE;  // Write the new depth value if test passes
		      depthStencil.depthCompareOp        = VK_COMPARE_OP_LESS; // Pass if new depth < stored depth (closer)
		      depthStencil.depthBoundsTestEnable = VK_FALSE; // No min/max depth bounds
		      depthStencil.stencilTestEnable     = VK_FALSE; // No stencil buffer
		  
		      // === 8: COLOR BLENDING (alpha transparency) ===
		      VkPipelineColorBlendAttachmentState colorBlendAttachment{};
		      colorBlendAttachment.colorWriteMask = VK_COLOR_COMPONENT_R_BIT | VK_COLOR_COMPONENT_G_BIT
		                                          | VK_COLOR_COMPONENT_B_BIT | VK_COLOR_COMPONENT_A_BIT;
		      colorBlendAttachment.blendEnable    = VK_FALSE; // No alpha blending (overwrite pixels)
		      // For transparent objects:
		      // colorBlendAttachment.blendEnable         = VK_TRUE;
		      // colorBlendAttachment.srcColorBlendFactor = VK_BLEND_FACTOR_SRC_ALPHA;
		      // colorBlendAttachment.dstColorBlendFactor = VK_BLEND_FACTOR_ONE_MINUS_SRC_ALPHA;
		      // colorBlendAttachment.colorBlendOp        = VK_BLEND_OP_ADD;
		  
		      VkPipelineColorBlendStateCreateInfo colorBlending{};
		      colorBlending.sType           = VK_STRUCTURE_TYPE_PIPELINE_COLOR_BLEND_STATE_CREATE_INFO;
		      colorBlending.logicOpEnable   = VK_FALSE;
		      colorBlending.attachmentCount = 1;
		      colorBlending.pAttachments    = &colorBlendAttachment;
		  
		      // === 9: PIPELINE LAYOUT (descriptor sets and push constants) ===
		      VkPipelineLayoutCreateInfo pipelineLayoutInfo{};
		      pipelineLayoutInfo.sType                  = VK_STRUCTURE_TYPE_PIPELINE_LAYOUT_CREATE_INFO;
		      pipelineLayoutInfo.setLayoutCount         = 1;
		      pipelineLayoutInfo.pSetLayouts            = &descriptorSetLayout;
		      pipelineLayoutInfo.pushConstantRangeCount = 0; // No push constants yet
		  
		      vkCreatePipelineLayout(device, &pipelineLayoutInfo, nullptr, &pipelineLayout);
		  
		      // === 10: CREATE THE PIPELINE! ===
		      VkGraphicsPipelineCreateInfo pipelineInfo{};
		      pipelineInfo.sType               = VK_STRUCTURE_TYPE_GRAPHICS_PIPELINE_CREATE_INFO;
		      pipelineInfo.stageCount          = 2;
		      pipelineInfo.pStages             = shaderStages;
		      pipelineInfo.pVertexInputState   = &vertexInputInfo;
		      pipelineInfo.pInputAssemblyState = &inputAssembly;
		      pipelineInfo.pViewportState      = &viewportState;
		      pipelineInfo.pRasterizationState = &rasterizer;
		      pipelineInfo.pMultisampleState   = &multisampling;
		      pipelineInfo.pDepthStencilState  = &depthStencil;
		      pipelineInfo.pColorBlendState    = &colorBlending;
		      pipelineInfo.layout              = pipelineLayout;
		      pipelineInfo.renderPass          = renderPass;
		      pipelineInfo.subpass             = 0;
		      pipelineInfo.basePipelineHandle  = VK_NULL_HANDLE; // No derivative pipelines
		  
		      vkCreateGraphicsPipelines(device, VK_NULL_HANDLE, 1, &pipelineInfo, nullptr, &graphicsPipeline);
		  
		      // Shader modules are no longer needed after pipeline compilation
		      vkDestroyShaderModule(device, vertShaderModule, nullptr);
		      vkDestroyShaderModule(device, fragShaderModule, nullptr);
		  }
		  ```
- # 12 — Framebuffers (VkFramebuffer)
  collapsed:: true
	- ## What Is a Framebuffer?
	  collapsed:: true
		- A `VkFramebuffer` is the **collection of ImageViews** used as render targets for a specific Render Pass. It connects the Render Pass (which describes attachment formats) to actual `VkImageView` objects (which hold actual pixel data).
		- You need one framebuffer per swapchain image:
		- ```cpp
		  swapChainFramebuffers.resize(swapChainImageViews.size());
		  
		  for (size_t i = 0; i < swapChainImageViews.size(); i++) {
		      // The framebuffer binds the color AND depth attachments
		      std::array<VkImageView, 2> attachments = {
		          swapChainImageViews[i],  // Attachment 0: color
		          depthImageView           // Attachment 1: depth
		      };
		  
		      VkFramebufferCreateInfo framebufferInfo{};
		      framebufferInfo.sType           = VK_STRUCTURE_TYPE_FRAMEBUFFER_CREATE_INFO;
		      framebufferInfo.renderPass      = renderPass;
		      framebufferInfo.attachmentCount = (uint32_t)attachments.size();
		      framebufferInfo.pAttachments    = attachments.data();
		      framebufferInfo.width           = swapChainExtent.width;
		      framebufferInfo.height          = swapChainExtent.height;
		      framebufferInfo.layers          = 1;
		  
		      vkCreateFramebuffer(device, &framebufferInfo, nullptr, &swapChainFramebuffers[i]);
		  }
		  ```
- # 13 — Memory Management and Buffers
  collapsed:: true
	- ## Explicit GPU Memory (Staging Buffers)
	  collapsed:: true
		- In Vulkan, uploading a mesh to the GPU is a 4-step dance:
		- ```mermaid
		  graph LR
		      CPU["CPU RAM\nstd::vector vertices"]  
		      SB["Staging Buffer\nHOST_VISIBLE memory\n(CPU can write here)"]
		      VB["Vertex Buffer\nDEVICE_LOCAL memory\n(GPU reads here fast)"]
		  
		      CPU -->|memcpy| SB
		      SB -->|vkCmdCopyBuffer| VB
		  ```
		- Why not write to DEVICE_LOCAL directly? — The CPU **cannot** write to pure VRAM. It must go through a CPU-accessible Staging Buffer first.
	- ## Creating a Vertex Buffer (Without VMA)
	  collapsed:: true
		- ```cpp
		  // Helper function to find correct memory type on the GPU
		  uint32_t findMemoryType(VkPhysicalDevice physDev, uint32_t typeFilter, VkMemoryPropertyFlags properties) {
		      VkPhysicalDeviceMemoryProperties memProperties;
		      vkGetPhysicalDeviceMemoryProperties(physDev, &memProperties);
		  
		      for (uint32_t i = 0; i < memProperties.memoryTypeCount; i++) {
		          bool typeMatch = (typeFilter & (1 << i));
		          bool propMatch = (memProperties.memoryTypes[i].propertyFlags & properties) == properties;
		          if (typeMatch && propMatch) return i;
		      }
		      throw std::runtime_error("Failed to find suitable memory type!");
		  }
		  
		  // Creates any buffer of given size, usage, and memory property
		  void createBuffer(VkDevice device, VkPhysicalDevice physDev,
		                    VkDeviceSize size, VkBufferUsageFlags usage, VkMemoryPropertyFlags properties,
		                    VkBuffer& buffer, VkDeviceMemory& bufferMemory) {
		  
		      VkBufferCreateInfo bufferInfo{};
		      bufferInfo.sType       = VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO;
		      bufferInfo.size        = size;
		      bufferInfo.usage       = usage;
		      bufferInfo.sharingMode = VK_SHARING_MODE_EXCLUSIVE; // Only one queue accesses it
		  
		      vkCreateBuffer(device, &bufferInfo, nullptr, &buffer);
		  
		      // Find out how much memory this buffer needs
		      VkMemoryRequirements memRequirements;
		      vkGetBufferMemoryRequirements(device, buffer, &memRequirements);
		  
		      VkMemoryAllocateInfo allocInfo{};
		      allocInfo.sType           = VK_STRUCTURE_TYPE_MEMORY_ALLOCATE_INFO;
		      allocInfo.allocationSize  = memRequirements.size;
		      allocInfo.memoryTypeIndex = findMemoryType(physDev, memRequirements.memoryTypeBits, properties);
		  
		      vkAllocateMemory(device, &allocInfo, nullptr, &bufferMemory);
		      vkBindBufferMemory(device, buffer, bufferMemory, 0); // Bind memory block to buffer
		  }
		  
		  // Upload vertex data using staging buffer
		  void createVertexBuffer(std::vector<Vertex>& vertices, VkBuffer& vertexBuffer, VkDeviceMemory& vertexBufferMemory) {
		      VkDeviceSize bufferSize = sizeof(vertices[0]) * vertices.size();
		  
		      // 1. Create staging buffer (CPU-accessible)
		      VkBuffer stagingBuffer;
		      VkDeviceMemory stagingBufferMemory;
		      createBuffer(device, physicalDevice, bufferSize,
		                   VK_BUFFER_USAGE_TRANSFER_SRC_BIT,
		                   VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT | VK_MEMORY_PROPERTY_HOST_COHERENT_BIT,
		                   stagingBuffer, stagingBufferMemory);
		  
		      // 2. Copy vertex data to staging buffer
		      void* data;
		      vkMapMemory(device, stagingBufferMemory, 0, bufferSize, 0, &data);
		      memcpy(data, vertices.data(), (size_t)bufferSize);
		      vkUnmapMemory(device, stagingBufferMemory);
		  
		      // 3. Create final vertex buffer (GPU-only, fast VRAM)
		      createBuffer(device, physicalDevice, bufferSize,
		                   VK_BUFFER_USAGE_TRANSFER_DST_BIT | VK_BUFFER_USAGE_VERTEX_BUFFER_BIT,
		                   VK_MEMORY_PROPERTY_DEVICE_LOCAL_BIT,
		                   vertexBuffer, vertexBufferMemory);
		  
		      // 4. Copy staging → final buffer (GPU copy operation)
		      copyBuffer(stagingBuffer, vertexBuffer, bufferSize);
		  
		      // 5. Clean up staging buffer
		      vkDestroyBuffer(device, stagingBuffer, nullptr);
		      vkFreeMemory(device, stagingBufferMemory, nullptr);
		  }
		  ```
	- ## VMA — Vulkan Memory Allocator (The Professional Way)
	  collapsed:: true
		- > [!tip] Use VMA in Every Real Project
		  > Raw `vkAllocateMemory` is limited — GPUs have a hard cap of 4096 total allocations (spec minimum).
		  > VMA allocates large blocks internally and sub-allocates from them. It's the standard in every real engine.
		- ```cpp
		  // Setup VMA once during initialization
		  VmaAllocatorCreateInfo allocatorInfo{};
		  allocatorInfo.instance       = instance;
		  allocatorInfo.physicalDevice = physicalDevice;
		  allocatorInfo.device         = device;
		  allocatorInfo.vulkanApiVersion = VK_API_VERSION_1_3;
		  
		  VmaAllocator allocator;
		  vmaCreateAllocator(&allocatorInfo, &allocator);
		  
		  // Create a vertex buffer WITH VMA (much simpler!)
		  VkBufferCreateInfo bufferInfo{ VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO };
		  bufferInfo.size  = sizeof(Vertex) * vertexCount;
		  bufferInfo.usage = VK_BUFFER_USAGE_VERTEX_BUFFER_BIT | VK_BUFFER_USAGE_TRANSFER_DST_BIT;
		  
		  VmaAllocationCreateInfo vmaInfo{};
		  vmaInfo.usage = VMA_MEMORY_USAGE_AUTO;
		  vmaInfo.flags = VMA_ALLOCATION_CREATE_DEDICATED_MEMORY_BIT; // Best for large meshes
		  
		  VkBuffer vertexBuffer;
		  VmaAllocation allocation;
		  vmaCreateBuffer(allocator, &bufferInfo, &vmaInfo, &vertexBuffer, &allocation, nullptr);
		  
		  // For CPU-writable uniform buffers:
		  VmaAllocationCreateInfo cpuInfo{};
		  cpuInfo.usage = VMA_MEMORY_USAGE_AUTO;
		  cpuInfo.flags = VMA_ALLOCATION_CREATE_HOST_ACCESS_SEQUENTIAL_WRITE_BIT
		                | VMA_ALLOCATION_CREATE_MAPPED_BIT; // Keeps it persistently mapped
		  ```
- # 14 — Textures and Images (VkImage)
  collapsed:: true
	- ## The Texture Upload Journey
	  collapsed:: true
		- ```mermaid
		  graph TD
		      PNG["PNG file on disk"]
		      CPU["stb_image loads pixels into CPU RAM"]
		      Stage["Staging Buffer\n(HOST_VISIBLE VkBuffer)"]
		      Transition1["Pipeline Barrier\nUNDEFINED → TRANSFER_DST\n(prepare image to receive GPU copy)"]
		      Copy["vkCmdCopyBufferToImage\n(GPU copies staging → VkImage)"]
		      Transition2["Pipeline Barrier\nTRANSFER_DST → SHADER_READ_ONLY\n(prepare image for shader sampling)"]
		      Sample["Shader samples the texture!"]
		  
		      PNG --> CPU --> Stage --> Transition1 --> Copy --> Transition2 --> Sample
		  ```
	- ## Creating a Texture Image
	  collapsed:: true
		- ```cpp
		  // Load image from disk with stb_image
		  int texWidth, texHeight, texChannels;
		  unsigned char* pixels = stbi_load("texture.png", &texWidth, &texHeight, &texChannels, STBI_rgb_alpha);
		  VkDeviceSize imageSize = texWidth * texHeight * 4; // 4 bytes per pixel (RGBA)
		  
		  // Create staging buffer and upload pixels
		  VkBuffer stagingBuffer;
		  VkDeviceMemory stagingMemory;
		  createBuffer(device, physDev, imageSize,
		               VK_BUFFER_USAGE_TRANSFER_SRC_BIT,
		               VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT | VK_MEMORY_PROPERTY_HOST_COHERENT_BIT,
		               stagingBuffer, stagingMemory);
		  
		  void* data;
		  vkMapMemory(device, stagingMemory, 0, imageSize, 0, &data);
		  memcpy(data, pixels, (size_t)imageSize);
		  vkUnmapMemory(device, stagingMemory);
		  stbi_image_free(pixels); // Free CPU memory
		  
		  // Create the VkImage
		  VkImageCreateInfo imageInfo{};
		  imageInfo.sType         = VK_STRUCTURE_TYPE_IMAGE_CREATE_INFO;
		  imageInfo.imageType     = VK_IMAGE_TYPE_2D;
		  imageInfo.extent.width  = (uint32_t)texWidth;
		  imageInfo.extent.height = (uint32_t)texHeight;
		  imageInfo.extent.depth  = 1;
		  imageInfo.mipLevels     = 1;     // Will generate mipmaps later
		  imageInfo.arrayLayers   = 1;
		  imageInfo.format        = VK_FORMAT_R8G8B8A8_SRGB;
		  imageInfo.tiling        = VK_IMAGE_TILING_OPTIMAL; // GPU chooses best layout
		  imageInfo.initialLayout = VK_IMAGE_LAYOUT_UNDEFINED;
		  imageInfo.usage         = VK_IMAGE_USAGE_TRANSFER_DST_BIT | VK_IMAGE_USAGE_SAMPLED_BIT;
		  imageInfo.samples       = VK_SAMPLE_COUNT_1_BIT;
		  imageInfo.sharingMode   = VK_SHARING_MODE_EXCLUSIVE;
		  
		  VkImage textureImage;
		  vkCreateImage(device, &imageInfo, nullptr, &textureImage);
		  ```
	- ## Image Samplers (VkSampler)
	  collapsed:: true
		- A `VkSampler` defines HOW the GPU reads pixels from a texture — what happens at the edges, how to filter between pixels.
		- ```cpp
		  VkSamplerCreateInfo samplerInfo{};
		  samplerInfo.sType            = VK_STRUCTURE_TYPE_SAMPLER_CREATE_INFO;
		  
		  // Bilinear filtering — smooth interpolation between texels
		  samplerInfo.magFilter        = VK_FILTER_LINEAR; // Zoomed in
		  samplerInfo.minFilter        = VK_FILTER_LINEAR; // Zoomed out
		  
		  // What happens when UV goes outside [0,1] range
		  samplerInfo.addressModeU     = VK_SAMPLER_ADDRESS_MODE_REPEAT; // Tile the texture
		  samplerInfo.addressModeV     = VK_SAMPLER_ADDRESS_MODE_REPEAT;
		  samplerInfo.addressModeW     = VK_SAMPLER_ADDRESS_MODE_REPEAT;
		  
		  // Anisotropic filtering — sharp textures at extreme angles (performance cost)
		  samplerInfo.anisotropyEnable = VK_TRUE;
		  samplerInfo.maxAnisotropy    = physicalDeviceProperties.limits.maxSamplerAnisotropy; // Max quality
		  
		  // Mipmapping
		  samplerInfo.mipmapMode       = VK_SAMPLER_MIPMAP_MODE_LINEAR;
		  samplerInfo.minLod           = 0.0f;
		  samplerInfo.maxLod           = VK_LOD_CLAMP_NONE; // Use all available mip levels
		  
		  VkSampler textureSampler;
		  vkCreateSampler(device, &samplerInfo, nullptr, &textureSampler);
		  ```
- # 15 — Uniform Buffers and Descriptor Sets
  collapsed:: true
	- ## How Shaders Receive Data From CPU
	  collapsed:: true
		- ```mermaid
		  graph TD
		      CPU["C++ App\n{model, view, proj matrices}"]
		      UBO["Uniform Buffer\n(VkBuffer in HOST_VISIBLE memory)"]
		      DSL["Descriptor Set Layout\n'The schema: binding 0 = UBO, binding 1 = Texture'"]
		      Pool["Descriptor Pool\n'Memory budget for N descriptor sets'"]
		      DS["Descriptor Set\n'Actual binding: UBO=myBuffer, Texture=myImage'"]
		      Shader["GLSL shader\nlayout(binding=0) uniform UBO"]
		  
		      CPU -->|memcpy each frame| UBO
		      UBO --> DS
		      DSL --> DS
		      Pool --> DS
		      DS -->|bound via vkCmdBindDescriptorSets| Shader
		  ```
	- ## Creating a Descriptor Set Layout
	  collapsed:: true
		- ```cpp
		  // Step 1: Define THE SCHEMA — what types of data exist at which bindings
		  std::array<VkDescriptorSetLayoutBinding, 2> bindings{};
		  
		  // Binding 0: Uniform Buffer Object (MVP matrices)
		  bindings[0].binding            = 0;
		  bindings[0].descriptorType     = VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER;
		  bindings[0].descriptorCount    = 1;
		  bindings[0].stageFlags         = VK_SHADER_STAGE_VERTEX_BIT; // Only the vertex shader reads this
		  bindings[0].pImmutableSamplers = nullptr;
		  
		  // Binding 1: Combined Image Sampler (texture)
		  bindings[1].binding            = 1;
		  bindings[1].descriptorType     = VK_DESCRIPTOR_TYPE_COMBINED_IMAGE_SAMPLER;
		  bindings[1].descriptorCount    = 1;
		  bindings[1].stageFlags         = VK_SHADER_STAGE_FRAGMENT_BIT; // Fragment shader samples this
		  bindings[1].pImmutableSamplers = nullptr;
		  
		  VkDescriptorSetLayoutCreateInfo layoutInfo{};
		  layoutInfo.sType        = VK_STRUCTURE_TYPE_DESCRIPTOR_SET_LAYOUT_CREATE_INFO;
		  layoutInfo.bindingCount = (uint32_t)bindings.size();
		  layoutInfo.pBindings    = bindings.data();
		  
		  VkDescriptorSetLayout descriptorSetLayout;
		  vkCreateDescriptorSetLayout(device, &layoutInfo, nullptr, &descriptorSetLayout);
		  ```
	- ## Creating a Descriptor Pool and Sets
	  collapsed:: true
		- ```cpp
		  // Step 2: Create the Pool (budget: N UBOs + N Samplers)
		  std::array<VkDescriptorPoolSize, 2> poolSizes{};
		  poolSizes[0] = { VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER,         MAX_FRAMES_IN_FLIGHT };
		  poolSizes[1] = { VK_DESCRIPTOR_TYPE_COMBINED_IMAGE_SAMPLER, MAX_FRAMES_IN_FLIGHT };
		  
		  VkDescriptorPoolCreateInfo poolInfo{};
		  poolInfo.sType         = VK_STRUCTURE_TYPE_DESCRIPTOR_POOL_CREATE_INFO;
		  poolInfo.poolSizeCount = (uint32_t)poolSizes.size();
		  poolInfo.pPoolSizes    = poolSizes.data();
		  poolInfo.maxSets       = MAX_FRAMES_IN_FLIGHT; // One set per in-flight frame
		  
		  VkDescriptorPool descriptorPool;
		  vkCreateDescriptorPool(device, &poolInfo, nullptr, &descriptorPool);
		  
		  // Step 3: Allocate the Descriptor Sets
		  std::vector<VkDescriptorSetLayout> layouts(MAX_FRAMES_IN_FLIGHT, descriptorSetLayout);
		  
		  VkDescriptorSetAllocateInfo allocInfo{};
		  allocInfo.sType              = VK_STRUCTURE_TYPE_DESCRIPTOR_SET_ALLOCATE_INFO;
		  allocInfo.descriptorPool     = descriptorPool;
		  allocInfo.descriptorSetCount = MAX_FRAMES_IN_FLIGHT;
		  allocInfo.pSetLayouts        = layouts.data();
		  
		  std::vector<VkDescriptorSet> descriptorSets(MAX_FRAMES_IN_FLIGHT);
		  vkAllocateDescriptorSets(device, &allocInfo, descriptorSets.data());
		  
		  // Step 4: Write actual resource pointers into each descriptor set
		  for (size_t i = 0; i < MAX_FRAMES_IN_FLIGHT; i++) {
		      VkDescriptorBufferInfo bufferInfo{ uniformBuffers[i], 0, sizeof(UniformBufferObject) };
		      VkDescriptorImageInfo  imageInfo { textureSampler, textureImageView, VK_IMAGE_LAYOUT_SHADER_READ_ONLY_OPTIMAL };
		  
		      std::array<VkWriteDescriptorSet, 2> writes{};
		      writes[0] = { VK_STRUCTURE_TYPE_WRITE_DESCRIPTOR_SET, nullptr, descriptorSets[i], 0, 0, 1, VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER,          nullptr,     &bufferInfo, nullptr };
		      writes[1] = { VK_STRUCTURE_TYPE_WRITE_DESCRIPTOR_SET, nullptr, descriptorSets[i], 1, 0, 1, VK_DESCRIPTOR_TYPE_COMBINED_IMAGE_SAMPLER, &imageInfo,   nullptr,     nullptr };
		  
		      vkUpdateDescriptorSets(device, (uint32_t)writes.size(), writes.data(), 0, nullptr);
		  }
		  ```
- # 16 — Command Buffers
  collapsed:: true
	- ## Command Pools and Buffers
	  collapsed:: true
		- `VkCommandPool` manages the memory that command buffers allocate from.
		- `VkCommandBuffer` is the actual object you record draw calls into.
		- ```cpp
		  // Create command pool for the graphics queue family
		  VkCommandPoolCreateInfo poolInfo{};
		  poolInfo.sType            = VK_STRUCTURE_TYPE_COMMAND_POOL_CREATE_INFO;
		  poolInfo.flags            = VK_COMMAND_POOL_CREATE_RESET_COMMAND_BUFFER_BIT; // Allow individual reset
		  poolInfo.queueFamilyIndex = graphicsQueueFamilyIndex;
		  
		  VkCommandPool commandPool;
		  vkCreateCommandPool(device, &poolInfo, nullptr, &commandPool);
		  
		  // Allocate command buffers (one per frame in flight)
		  std::vector<VkCommandBuffer> commandBuffers(MAX_FRAMES_IN_FLIGHT);
		  
		  VkCommandBufferAllocateInfo allocInfo{};
		  allocInfo.sType              = VK_STRUCTURE_TYPE_COMMAND_BUFFER_ALLOCATE_INFO;
		  allocInfo.commandPool        = commandPool;
		  allocInfo.level              = VK_COMMAND_BUFFER_LEVEL_PRIMARY; // PRIMARY = directly submitted to queue
		  allocInfo.commandBufferCount = (uint32_t)commandBuffers.size();
		  
		  vkAllocateCommandBuffers(device, &allocInfo, commandBuffers.data());
		  ```
	- ## Recording a Complete Frame
	  collapsed:: true
		- ```cpp
		  void recordCommandBuffer(VkCommandBuffer commandBuffer, uint32_t imageIndex) {
		      // ---- BEGIN RECORDING ----
		      VkCommandBufferBeginInfo beginInfo{};
		      beginInfo.sType = VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO;
		      vkBeginCommandBuffer(commandBuffer, &beginInfo);
		  
		      // ---- BEGIN RENDER PASS ----
		      std::array<VkClearValue, 2> clearValues{};
		      clearValues[0].color        = {{0.0f, 0.0f, 0.0f, 1.0f}}; // Black background
		      clearValues[1].depthStencil = {1.0f, 0};                   // Far depth (1.0 = clear to max)
		  
		      VkRenderPassBeginInfo renderPassInfo{};
		      renderPassInfo.sType             = VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO;
		      renderPassInfo.renderPass        = renderPass;
		      renderPassInfo.framebuffer       = swapChainFramebuffers[imageIndex];
		      renderPassInfo.renderArea.offset = {0, 0};
		      renderPassInfo.renderArea.extent = swapChainExtent;
		      renderPassInfo.clearValueCount   = (uint32_t)clearValues.size();
		      renderPassInfo.pClearValues      = clearValues.data();
		  
		      vkCmdBeginRenderPass(commandBuffer, &renderPassInfo, VK_SUBPASS_CONTENTS_INLINE);
		  
		      // ---- BIND PIPELINE ----
		      vkCmdBindPipeline(commandBuffer, VK_PIPELINE_BIND_POINT_GRAPHICS, graphicsPipeline);
		  
		      // ---- SET DYNAMIC STATES ----
		      VkViewport viewport{ 0.0f, 0.0f, (float)swapChainExtent.width, (float)swapChainExtent.height, 0.0f, 1.0f };
		      vkCmdSetViewport(commandBuffer, 0, 1, &viewport);
		  
		      VkRect2D scissor{ {0, 0}, swapChainExtent };
		      vkCmdSetScissor(commandBuffer, 0, 1, &scissor);
		  
		      // ---- BIND VERTEX and INDEX BUFFERS ----
		      VkBuffer vertexBuffers[] = {vertexBuffer};
		      VkDeviceSize offsets[]   = {0};
		      vkCmdBindVertexBuffers(commandBuffer, 0, 1, vertexBuffers, offsets);
		      vkCmdBindIndexBuffer(commandBuffer, indexBuffer, 0, VK_INDEX_TYPE_UINT32);
		  
		      // ---- BIND DESCRIPTOR SETS (UBO + texture) ----
		      vkCmdBindDescriptorSets(commandBuffer, VK_PIPELINE_BIND_POINT_GRAPHICS,
		                              pipelineLayout, 0, 1, &descriptorSets[currentFrame], 0, nullptr);
		  
		      // ---- DRAW CALL ----
		      // (indexCount, instanceCount, firstIndex, vertexOffset, firstInstance)
		      vkCmdDrawIndexed(commandBuffer, (uint32_t)indices.size(), 1, 0, 0, 0);
		  
		      // ---- END RENDER PASS and COMMAND BUFFER ----
		      vkCmdEndRenderPass(commandBuffer);
		      vkEndCommandBuffer(commandBuffer);
		  }
		  ```
- # 17 — Synchronization (The Most Critical Topic)
  collapsed:: true
	- ## Why Synchronization Is Hard
	  collapsed:: true
		- The CPU and GPU run **completely independently**. Once you submit a command buffer, the GPU starts working immediately and your CPU code keeps running. Without synchronization, you could:
		- ```
		  ❌ Start rendering frame 2 while the GPU is still presenting frame 1
		  ❌ Write new uniform buffer data while GPU is still reading the old data
		  ❌ Sample a texture that is still being written by a compute shader
		  ❌ Free a buffer that the GPU is still accessing
		  ```
	- ## Three Synchronization Primitives
	  collapsed:: true
		- | Primitive | CPU or GPU? | Purpose |
		  |---|---|---|
		  | **VkFence** | GPU → CPU | CPU blocks until GPU finishes a submission |
		  | **VkSemaphore** | GPU → GPU | One GPU queue waits for another GPU queue |
		  | **Pipeline Barrier** (`vkCmdPipelineBarrier`) | GPU internal | Memory and execution ordering within command buffer |
	- ## Fences, Semaphores in the Main Loop
	  collapsed:: true
		- ```cpp
		  // Per-frame synchronization objects
		  const int MAX_FRAMES_IN_FLIGHT = 2; // CPU can be 1 frame ahead of GPU max
		  
		  std::vector<VkSemaphore> imageAvailableSemaphores(MAX_FRAMES_IN_FLIGHT);
		  std::vector<VkSemaphore> renderFinishedSemaphores(MAX_FRAMES_IN_FLIGHT);
		  std::vector<VkFence>     inFlightFences(MAX_FRAMES_IN_FLIGHT);
		  
		  VkSemaphoreCreateInfo semaphoreInfo{ VK_STRUCTURE_TYPE_SEMAPHORE_CREATE_INFO };
		  VkFenceCreateInfo     fenceInfo    { VK_STRUCTURE_TYPE_FENCE_CREATE_INFO };
		  fenceInfo.flags = VK_FENCE_CREATE_SIGNALED_BIT; // Start signaled (so first frame doesn't hang)
		  
		  for (int i = 0; i < MAX_FRAMES_IN_FLIGHT; i++) {
		      vkCreateSemaphore(device, &semaphoreInfo, nullptr, &imageAvailableSemaphores[i]);
		      vkCreateSemaphore(device, &semaphoreInfo, nullptr, &renderFinishedSemaphores[i]);
		      vkCreateFence(device,     &fenceInfo,     nullptr, &inFlightFences[i]);
		  }
		  ```
	- ## Pipeline Barriers and Image Layout Transitions
	  collapsed:: true
		- Every `VkImage` has a **layout** that determines how the GPU hardware accesses its memory.
		- | Layout | What it means |
		  |---|---|
		  | `VK_IMAGE_LAYOUT_UNDEFINED` | Don't care about contents (initial state) |
		  | `VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL` | Being actively drawn to as a render target |
		  | `VK_IMAGE_LAYOUT_SHADER_READ_ONLY_OPTIMAL` | Being sampled in a shader |
		  | `VK_IMAGE_LAYOUT_TRANSFER_SRC_OPTIMAL` | Source for a GPU copy operation |
		  | `VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL` | Destination for a GPU copy operation |
		  | `VK_IMAGE_LAYOUT_PRESENT_SRC_KHR` | Ready to be shown on the display |
		  | `VK_IMAGE_LAYOUT_DEPTH_STENCIL_ATTACHMENT_OPTIMAL` | Depth buffer being used for Z-testing |
		- ```cpp
		  // Transition an image from one layout to another using a pipeline barrier
		  void transitionImageLayout(VkImage image,
		                             VkImageLayout oldLayout, VkImageLayout newLayout) {
		  
		      VkCommandBuffer cmd = beginSingleTimeCommands(); // Helper: begin a one-off command buffer
		  
		      VkImageMemoryBarrier barrier{};
		      barrier.sType                           = VK_STRUCTURE_TYPE_IMAGE_MEMORY_BARRIER;
		      barrier.oldLayout                       = oldLayout;
		      barrier.newLayout                       = newLayout;
		      barrier.srcQueueFamilyIndex             = VK_QUEUE_FAMILY_IGNORED; // No queue transfer
		      barrier.dstQueueFamilyIndex             = VK_QUEUE_FAMILY_IGNORED;
		      barrier.image                           = image;
		      barrier.subresourceRange.aspectMask     = VK_IMAGE_ASPECT_COLOR_BIT;
		      barrier.subresourceRange.baseMipLevel   = 0;
		      barrier.subresourceRange.levelCount     = 1;
		      barrier.subresourceRange.baseArrayLayer = 0;
		      barrier.subresourceRange.layerCount     = 1;
		  
		      VkPipelineStageFlags srcStage, dstStage;
		  
		      if (oldLayout == VK_IMAGE_LAYOUT_UNDEFINED && newLayout == VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL) {
		          barrier.srcAccessMask = 0;                           // Nothing to wait for
		          barrier.dstAccessMask = VK_ACCESS_TRANSFER_WRITE_BIT; // Transfer must wait until here
		          srcStage = VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT;
		          dstStage = VK_PIPELINE_STAGE_TRANSFER_BIT;
		      } else if (oldLayout == VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL && newLayout == VK_IMAGE_LAYOUT_SHADER_READ_ONLY_OPTIMAL) {
		          barrier.srcAccessMask = VK_ACCESS_TRANSFER_WRITE_BIT;  // The transfer write must finish
		          barrier.dstAccessMask = VK_ACCESS_SHADER_READ_BIT;     // Before the shader can read it
		          srcStage = VK_PIPELINE_STAGE_TRANSFER_BIT;
		          dstStage = VK_PIPELINE_STAGE_FRAGMENT_SHADER_BIT;
		      }
		  
		      vkCmdPipelineBarrier(cmd, srcStage, dstStage, 0, 0, nullptr, 0, nullptr, 1, &barrier);
		  
		      endSingleTimeCommands(cmd);
		  }
		  ```
- # 18 — The Main Render Loop
  collapsed:: true
	- ## The Complete Frame Loop
	  collapsed:: true
		- ```cpp
		  uint32_t currentFrame = 0;
		  
		  void drawFrame() {
		      // === STEP 1: Wait for the GPU to finish the PREVIOUS frame N-MAX ===
		      vkWaitForFences(device, 1, &inFlightFences[currentFrame], VK_TRUE, UINT64_MAX);
		  
		      // === STEP 2: Acquire the next available swapchain image ===
		      uint32_t imageIndex;
		      VkResult result = vkAcquireNextImageKHR(
		          device, swapChain, UINT64_MAX,
		          imageAvailableSemaphores[currentFrame], // Signal this when image is available
		          VK_NULL_HANDLE,
		          &imageIndex
		      );
		  
		      // Handle window resize
		      if (result == VK_ERROR_OUT_OF_DATE_KHR) { recreateSwapChain(); return; }
		  
		      // Reset fence only once we know we will submit work
		      vkResetFences(device, 1, &inFlightFences[currentFrame]);
		  
		      // === STEP 3: Update uniform buffer data for this frame ===
		      updateUniformBuffer(currentFrame);
		  
		      // === STEP 4: Record all draw calls ===
		      vkResetCommandBuffer(commandBuffers[currentFrame], 0);
		      recordCommandBuffer(commandBuffers[currentFrame], imageIndex);
		  
		      // === STEP 5: Submit to the GPU queue ===
		      VkSemaphore          waitSemaphores[]   = { imageAvailableSemaphores[currentFrame] };
		      VkPipelineStageFlags waitStages[]       = { VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT };
		      VkSemaphore          signalSemaphores[] = { renderFinishedSemaphores[currentFrame] };
		  
		      VkSubmitInfo submitInfo{};
		      submitInfo.sType                = VK_STRUCTURE_TYPE_SUBMIT_INFO;
		      submitInfo.waitSemaphoreCount   = 1;
		      submitInfo.pWaitSemaphores      = waitSemaphores;   // Wait: image must be available
		      submitInfo.pWaitDstStageMask    = waitStages;
		      submitInfo.commandBufferCount   = 1;
		      submitInfo.pCommandBuffers      = &commandBuffers[currentFrame];
		      submitInfo.signalSemaphoreCount = 1;
		      submitInfo.pSignalSemaphores    = signalSemaphores; // Signal: rendering is done
		  
		      vkQueueSubmit(graphicsQueue, 1, &submitInfo, inFlightFences[currentFrame]);
		  
		      // === STEP 6: Present the rendered frame to the screen ===
		      VkPresentInfoKHR presentInfo{};
		      presentInfo.sType              = VK_STRUCTURE_TYPE_PRESENT_INFO_KHR;
		      presentInfo.waitSemaphoreCount = 1;
		      presentInfo.pWaitSemaphores    = signalSemaphores; // Wait: render must be done
		      presentInfo.swapchainCount     = 1;
		      presentInfo.pSwapchains        = &swapChain;
		      presentInfo.pImageIndices      = &imageIndex;
		  
		      vkQueuePresentKHR(presentQueue, &presentInfo);
		  
		      currentFrame = (currentFrame + 1) % MAX_FRAMES_IN_FLIGHT;
		  }
		  ```
- # 19 — Push Constants
  collapsed:: true
	- ## What Are Push Constants?
	  collapsed:: true
		- Push constants let you inject a small block of data (up to 128 bytes; usually two `mat4`) directly into the GPU command stream — **no buffer, no descriptor, zero overhead**.
		- Perfect for: model matrix per-object, material ID, time value, a few flags.
		- ```cpp
		  // In the pipeline layout, declare push constant range
		  VkPushConstantRange pushConstantRange{};
		  pushConstantRange.stageFlags = VK_SHADER_STAGE_VERTEX_BIT;
		  pushConstantRange.offset     = 0;
		  pushConstantRange.size       = sizeof(glm::mat4); // 64 bytes
		  
		  pipelineLayoutInfo.pushConstantRangeCount = 1;
		  pipelineLayoutInfo.pPushConstantRanges    = &pushConstantRange;
		  
		  // Per-draw: push the model matrix for this specific object
		  glm::mat4 modelMatrix = transform.getMatrix();
		  vkCmdPushConstants(commandBuffer, pipelineLayout,
		                     VK_SHADER_STAGE_VERTEX_BIT, 0, sizeof(glm::mat4), &modelMatrix);
		  vkCmdDrawIndexed(commandBuffer, indexCount, 1, 0, 0, 0);
		  ```
		- ```glsl
		  // In the vertex shader, receive push constants
		  layout(push_constant) uniform PushConstants {
		      mat4 model;
		  } pc;
		  
		  void main() {
		      gl_Position = ubo.proj * ubo.view * pc.model * vec4(inPosition, 1.0);
		  }
		  ```
- # 20 — Compute Shaders
  collapsed:: true
	- ## What Is a Compute Shader?
	  collapsed:: true
		- A Compute Shader runs on the GPU's shader cores but has **no connection to the rendering pipeline**. There are no vertices, no triangles, no pixels. Just raw parallel computation organized into a grid of threads.
		- **Uses:** Particle simulation, physics, culling, post-processing (blur, bloom), neural networks.
		- ```mermaid
		  graph TD
		      Dispatch["vkCmdDispatch(groupX, groupY, groupZ)\nLaunches a 3D grid of workgroups"]
		      WG["Workgroup (e.g., 16x16=256 threads)\nAll in this workgroup share fast on-chip memory"]
		      T["Individual Threads\ngl_GlobalInvocationID gives each thread its unique ID"]
		      SB["Storage Buffer (VkBuffer)\nRead AND Write from shader — huge arrays of data"]
		  
		      Dispatch --> WG --> T --> SB
		  ```
	- ## Writing a Compute Shader (GLSL)
	  collapsed:: true
		- ```glsl
		  // particle_update.comp
		  #version 450
		  
		  // 256 threads per workgroup (16x16 = 256 for 2D, or 256x1 for 1D particle array)
		  layout(local_size_x = 256, local_size_y = 1, local_size_z = 1) in;
		  
		  struct Particle {
		      vec2 position;
		      vec2 velocity;
		      vec4 color;
		  };
		  
		  // Input particles (read-only)
		  layout(std140, set = 0, binding = 0) readonly buffer ParticleSSBOIn {
		      Particle particlesIn[];
		  };
		  
		  // Output particles (write result here)
		  layout(std140, set = 0, binding = 1) buffer ParticleSSBOOut {
		      Particle particlesOut[];
		  };
		  
		  // Time delta from CPU
		  layout(push_constant) uniform PushConstants { float deltaTime; } pc;
		  
		  void main() {
		      uint index = gl_GlobalInvocationID.x; // Which particle is this thread handling?
		  
		      Particle p = particlesIn[index];
		  
		      // Update position by velocity
		      p.position += p.velocity * pc.deltaTime;
		  
		      // Bounce off edges
		      if (abs(p.position.x) >= 1.0) p.velocity.x = -p.velocity.x;
		      if (abs(p.position.y) >= 1.0) p.velocity.y = -p.velocity.y;
		  
		      particlesOut[index] = p;
		  }
		  ```
	- ## Dispatching Compute from C++
	  collapsed:: true
		- ```cpp
		  // Bind compute pipeline
		  vkCmdBindPipeline(commandBuffer, VK_PIPELINE_BIND_POINT_COMPUTE, computePipeline);
		  
		  // Bind the storage buffers as descriptor sets
		  vkCmdBindDescriptorSets(commandBuffer, VK_PIPELINE_BIND_POINT_COMPUTE,
		                          computePipelineLayout, 0, 1, &computeDescriptorSet, 0, nullptr);
		  
		  // Push the time delta
		  float deltaTime = 0.016f;
		  vkCmdPushConstants(commandBuffer, computePipelineLayout,
		                     VK_SHADER_STAGE_COMPUTE_BIT, 0, sizeof(float), &deltaTime);
		  
		  // Dispatch! 
		  // We have PARTICLE_COUNT particles, each thread handles 1.
		  // With local_size_x=256, we need (PARTICLE_COUNT / 256) workgroups.
		  vkCmdDispatch(commandBuffer, PARTICLE_COUNT / 256, 1, 1);
		  
		  // ⚠️ IMPORTANT: Add a barrier before reading the result in render!
		  VkBufferMemoryBarrier computeToRenderBarrier{};
		  computeToRenderBarrier.sType         = VK_STRUCTURE_TYPE_BUFFER_MEMORY_BARRIER;
		  computeToRenderBarrier.srcAccessMask = VK_ACCESS_SHADER_WRITE_BIT;
		  computeToRenderBarrier.dstAccessMask = VK_ACCESS_VERTEX_ATTRIBUTE_READ_BIT;
		  computeToRenderBarrier.buffer        = particleSSBO;
		  computeToRenderBarrier.size          = VK_WHOLE_SIZE;
		  
		  vkCmdPipelineBarrier(commandBuffer,
		                       VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT,
		                       VK_PIPELINE_STAGE_VERTEX_INPUT_BIT,
		                       0, 0, nullptr, 1, &computeToRenderBarrier, 0, nullptr);
		  ```
- # 21 — Dynamic Rendering (Vulkan 1.3)
  collapsed:: true
	- ## Why Dynamic Rendering?
	  collapsed:: true
		- Creating `VkRenderPass` objects and `VkFramebuffer` objects is verbose and rigid. In Vulkan 1.3, **Dynamic Rendering** was promoted to core, allowing you to begin rendering directly from a command buffer — no pre-built render pass objects needed.
		- > [!tip] All modern Vulkan engines (vkguide.dev style) use Dynamic Rendering. Prefer this for new projects.
		- ```cpp
		  // Enable during device creation
		  VkPhysicalDeviceDynamicRenderingFeatures dynamicRenderingFeature{};
		  dynamicRenderingFeature.sType = VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_DYNAMIC_RENDERING_FEATURES;
		  dynamicRenderingFeature.dynamicRendering = VK_TRUE;
		  
		  // Attach to device create info chain
		  deviceCreateInfo.pNext = &dynamicRenderingFeature;
		  
		  // ---- Per-frame: Begin rendering without a render pass! ----
		  // First: barrier the swapchain image to COLOR_ATTACHMENT_OPTIMAL
		  VkRenderingAttachmentInfo colorAttachment{};
		  colorAttachment.sType       = VK_STRUCTURE_TYPE_RENDERING_ATTACHMENT_INFO;
		  colorAttachment.imageView   = swapChainImageViews[imageIndex];
		  colorAttachment.imageLayout = VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL;
		  colorAttachment.loadOp      = VK_ATTACHMENT_LOAD_OP_CLEAR;
		  colorAttachment.storeOp     = VK_ATTACHMENT_STORE_OP_STORE;
		  colorAttachment.clearValue  = { {0.0f, 0.0f, 0.0f, 1.0f} };
		  
		  VkRenderingInfo renderingInfo{};
		  renderingInfo.sType                = VK_STRUCTURE_TYPE_RENDERING_INFO;
		  renderingInfo.renderArea.offset    = {0, 0};
		  renderingInfo.renderArea.extent    = swapChainExtent;
		  renderingInfo.layerCount           = 1;
		  renderingInfo.colorAttachmentCount = 1;
		  renderingInfo.pColorAttachments    = &colorAttachment;
		  renderingInfo.pDepthAttachment     = &depthAttachment;
		  
		  vkCmdBeginRendering(commandBuffer, &renderingInfo);
		  // ... draw calls ...
		  vkCmdEndRendering(commandBuffer);
		  ```
- # 22 — Bindless Rendering (Advanced)
  collapsed:: true
	- ## The Problem With Normal Descriptors
	  collapsed:: true
		- In the standard workflow, every time you draw a mesh with a different texture, you must:
		- `vkCmdBindDescriptorSets(...)` — This is a CPU call. Done thousands of times per frame, it becomes a bottleneck.
		- **Bindless** eliminates this by uploading ALL textures into one gigantic descriptor array. The shader picks which texture to use via a Push Constant `material_index`.
	- ## Setting Up Bindless
	  collapsed:: true
		- ```cpp
		  // Requires VK_EXT_descriptor_indexing (promoted to Vulkan 1.2 core)
		  VkPhysicalDeviceDescriptorIndexingFeatures indexingFeatures{};
		  indexingFeatures.sType = VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_DESCRIPTOR_INDEXING_FEATURES;
		  indexingFeatures.runtimeDescriptorArray                     = VK_TRUE;
		  indexingFeatures.descriptorBindingPartiallyBound            = VK_TRUE;
		  indexingFeatures.descriptorBindingUpdateUnusedWhilePending  = VK_TRUE;
		  indexingFeatures.shaderSampledImageArrayNonUniformIndexing  = VK_TRUE;
		  
		  // Create a MASSIVE descriptor set — 10,000 texture slots
		  VkDescriptorSetLayoutBinding bindlessBinding{};
		  bindlessBinding.binding            = 0;
		  bindlessBinding.descriptorType     = VK_DESCRIPTOR_TYPE_COMBINED_IMAGE_SAMPLER;
		  bindlessBinding.descriptorCount    = 10000; // Ten thousand textures!
		  bindlessBinding.stageFlags         = VK_SHADER_STAGE_ALL;
		  
		  VkDescriptorBindingFlags bindingFlags = VK_DESCRIPTOR_BINDING_PARTIALLY_BOUND_BIT
		                                        | VK_DESCRIPTOR_BINDING_UPDATE_AFTER_BIND_BIT;
		  ```
		- ```glsl
		  // In the GLSL shader
		  #extension GL_EXT_nonuniform_qualifier : enable
		  
		  layout(set = 0, binding = 0) uniform sampler2D allTextures[]; // Unbounded array
		  
		  layout(push_constant) uniform PC { uint textureIndex; } pc;
		  
		  void main() {
		      // Access any texture by index — zero bind calls needed!
		      vec4 color = texture(allTextures[nonuniformEXT(pc.textureIndex)], fragUV);
		      outColor = color;
		  }
		  ```
- # 23 — Hardware Ray Tracing
  collapsed:: true
	- > [!note] Deep dive: See [[PathTracer Learning]] for a full path tracer implementation.
	- ## Acceleration Structures
	  collapsed:: true
		- | Structure | Contains | Analogy |
		  |---|---|---|
		  | **BLAS** (Bottom-Level)  | Triangle geometry of one mesh | "The tree model itself" |
		  | **TLAS** (Top-Level) | Instances of BLASes with transforms | "10,000 copies of the tree placed in the world" |
		- The GPU hardware traverses the TLAS to find ray intersections in O(log N) using BVH (Bounding Volume Hierarchy).
	- ## Enabling Ray Tracing Extensions
	  collapsed:: true
		- ```cpp
		  const std::vector<const char*> rtExtensions = {
		      VK_KHR_ACCELERATION_STRUCTURE_EXTENSION_NAME, // BVH building
		      VK_KHR_RAY_TRACING_PIPELINE_EXTENSION_NAME,   // .rgen/.rchit/.rmiss shaders
		      VK_KHR_DEFERRED_HOST_OPERATIONS_EXTENSION_NAME, // Required dependency
		      VK_KHR_BUFFER_DEVICE_ADDRESS_EXTENSION_NAME,    // Required: GPU buffer pointers
		  };
		  
		  // + enable features
		  VkPhysicalDeviceAccelerationStructureFeaturesKHR accelFeatures{};
		  accelFeatures.accelerationStructure = VK_TRUE;
		  
		  VkPhysicalDeviceRayTracingPipelineFeaturesKHR rtFeatures{};
		  rtFeatures.rayTracingPipeline = VK_TRUE;
		  ```
	- ## Ray Tracing Shaders
	  collapsed:: true
		- | Shader Stage | File ext | Purpose |
		  |---|---|---|
		  | **Ray Generation** | `.rgen` | Entry point. One thread per pixel. Spawns rays. |
		  | **Closest Hit** | `.rchit` | Called when ray hits nearest geometry. Do lighting here. |
		  | **Any Hit** | `.rahit` | Called for every hit — use for alpha testing. Can reject hits. |
		  | **Miss** | `.rmiss` | Called when ray hits nothing. Sample skybox here. |
		  | **Intersection** | `.rint` | Custom geometry (spheres, procedural). |
		- ```glsl
		  // simple.rgen — Ray Generation shader
		  #version 460
		  #extension GL_EXT_ray_tracing : enable
		  
		  layout(binding = 0, set = 0)            uniform accelerationStructureEXT TLAS;
		  layout(binding = 1, set = 0, rgba8) uniform image2D outputImage;
		  layout(binding = 2, set = 0)            uniform Camera { mat4 invView; mat4 invProj; } cam;
		  
		  layout(location = 0) rayPayloadEXT vec3 hitValue; // Data passed to/from hit/miss shaders
		  
		  void main() {
		      ivec2 pixel = ivec2(gl_LaunchIDEXT.xy);
		      ivec2 size  = ivec2(gl_LaunchSizeEXT.xy);
		  
		      // Compute ray origin and direction from camera matrices
		      vec2 uv  = (vec2(pixel) + 0.5) / vec2(size);
		      vec2 ndc = uv * 2.0 - 1.0;
		  
		      vec4 origin    = cam.invView * vec4(0, 0, 0, 1);
		      vec4 target    = cam.invProj * vec4(ndc.x, ndc.y, 1, 1);
		      vec4 direction = cam.invView * vec4(normalize(target.xyz), 0);
		  
		      // ---- Fire the ray! ----
		      traceRayEXT(TLAS,
		                  gl_RayFlagsOpaqueEXT,
		                  0xFF,           // Cull mask (all geometry)
		                  0,              // SBT offset for hit group
		                  0,              // SBT stride
		                  0,              // Miss shader index
		                  origin.xyz,     // Ray origin
		                  0.001,          // Min distance
		                  direction.xyz,  // Ray direction
		                  10000.0,        // Max distance (far plane)
		                  0               // Payload location
		      );
		  
		      imageStore(outputImage, pixel, vec4(hitValue, 1.0));
		  }
		  ```
		- ```glsl
		  // simple.rchit — Closest Hit shader
		  #version 460
		  #extension GL_EXT_ray_tracing : enable
		  
		  layout(location = 0) rayPayloadInEXT vec3 hitValue;
		  hitAttributeEXT vec2 barycentrics; // Barycentric coords of the intersection
		  
		  void main() {
		      // Simple diffuse lighting: encode hit normal as color
		      hitValue = vec3(barycentrics.x, barycentrics.y, 1.0 - barycentrics.x - barycentrics.y);
		  }
		  ```
- # 24 — Performance Best Practices
  collapsed:: true
	- ## CPU-Side Optimizations
	  collapsed:: true
		- | Practice | Why |
		  |---|---|
		  | **Multi-thread command recording** | Record different objects on different CPU threads using secondary command buffers |
		  | **Use MAX_FRAMES_IN_FLIGHT = 2 or 3** | Overlap CPU work and GPU work to hide pipeline stalls |
		  | **Batch draw calls** | Group meshes with same material together to reduce state changes |
		  | **Push Constants over UBOs** | Faster for per-object data (no buffer, direct register write) |
		  | **Sort by pipeline first** | `vkCmdBindPipeline` is expensive — minimize swaps |
	- ## GPU-Side Optimizations
	  collapsed:: true
		- | Practice | Why |
		  |---|---|
		  | **Use `VK_MEMORY_PROPERTY_DEVICE_LOCAL_BIT` for static geometry** | GPU-local VRAM is 10x faster than shared/host memory |
		  | **Generate mipmaps for textures** | Far-away textures sample smaller mip levels — prevents texture aliasing and improves cache hits |
		  | **Avoid reading back from GPU** | `vkMapMemory` on DEVICE_LOCAL memory is extremely slow. Keep data on GPU. |
		  | **Use pipeline cache (`VkPipelineCache`)** | Saves compiled pipelines to disk, dramatically reduces startup time |
		  | **Use Indirect Draw** (`vkCmdDrawIndirect`) | GPU auto-generates draw calls from compute — eliminates CPU-side frustum culling overhead |
	- ## Debugging Tools
	  collapsed:: true
		- | Tool | What it does |
		  |---|---|
		  | **RenderDoc** | Frame capture and visualization of every draw call, pipeline state, and resource |
		  | **NVIDIA Nsight Graphics** | GPU performance counters, shader profiler, occupancy analysis |
		  | **AMD Radeon GPU Profiler (RGP)** | Timeline view of GPU work, cache hit rates |
		  | **Validation Layers** | Real-time API misuse detection |
		  | **VK_EXT_debug_utils** | Tag your resources (buffers, queues) with human-readable names visible in RenderDoc |
		- ```cpp
		  // Name your resources for debugging in RenderDoc
		  VkDebugUtilsObjectNameInfoEXT nameInfo{};
		  nameInfo.sType        = VK_STRUCTURE_TYPE_DEBUG_UTILS_OBJECT_NAME_INFO_EXT;
		  nameInfo.objectType   = VK_OBJECT_TYPE_IMAGE;
		  nameInfo.objectHandle = (uint64_t)gbufferAlbedo;
		  nameInfo.pObjectName  = "GBuffer_Albedo_Texture"; // Appears in RenderDoc!
		  vkSetDebugUtilsObjectNameEXT(device, &nameInfo);
		  ```
- # 25 — Full Object Reference Cheatsheet
  collapsed:: true
	- ## Every Vulkan Object and What It Does
	  collapsed:: true
		- | Vulkan Object | Category | What It Is |
		  |---|---|---|
		  | `VkInstance` | Bootstrap | Connection between app and Vulkan library |
		  | `VkPhysicalDevice` | Hardware | A GPU in the machine — enumerate and pick |
		  | `VkDevice` | Logic | App's logical connection to a specific GPU |
		  | `VkQueue` | Execution | Submit command buffers here. Different families for graphics/compute/transfer. |
		  | `VkSurfaceKHR` | Platform | Bridge between Vulkan and the OS window system |
		  | `VkSwapchainKHR` | Presentation | Ring of images rendered to and shown on monitor |
		  | `VkImage` | Memory | Raw block of VRAM containing pixel data |
		  | `VkImageView` | Memory | Describes how to interpret a VkImage (2D, cube map, mip range) |
		  | `VkSampler` | Textures | Defines filtering and wrapping when shader reads a texture |
		  | `VkBuffer` | Memory | Raw block of VRAM for vertex, index, uniform, storage data |
		  | `VkDeviceMemory` | Memory | A raw allocation of GPU memory. Bound to VkBuffer or VkImage. |
		  | `VkShaderModule` | Pipeline | Compiled SPIR-V bytecode of one shader stage |
		  | `VkRenderPass` | Pipeline | Blueprint: what attachments to expect, how to load/store them |
		  | `VkFramebuffer` | Pipeline | Connects a RenderPass to actual ImageViews |
		  | `VkPipelineLayout` | Pipeline | Schema of descriptors and push constants |
		  | `VkPipeline` | Pipeline | Immutable baked state: shaders + vertex layout + depth/blend config |
		  | `VkDescriptorSetLayout` | Descriptors | Schema: what types of resources are at which bindings |
		  | `VkDescriptorPool` | Descriptors | Memory budget for allocating descriptor sets |
		  | `VkDescriptorSet` | Descriptors | Actual binding of specific buffers/textures |
		  | `VkCommandPool` | Commands | Memory allocator for command buffers |
		  | `VkCommandBuffer` | Commands | Record draw/dispatch/barrier commands here |
		  | `VkFence` | Sync | GPU signals → CPU checks (vkWaitForFences) |
		  | `VkSemaphore` | Sync | GPU signals → GPU waits (queue to queue) |
		  | `VkEvent` | Sync | Fine-grained mid-command buffer synchronization |
		  | `VkAccelerationStructureKHR` | Ray Tracing | BVH over geometry (BLAS) or scene (TLAS) |
- # More Learn — Free Resources
	- [vulkan-tutorial.com](https://vulkan-tutorial.com/) - Start here. The most comprehensive beginner tutorial.
	- [vkguide.dev](https://vkguide.dev/) - Modern Vulkan: Dynamic Rendering, Bindless, VMA, GPU-driven.
	- [Vulkan Samples (Khronos)](https://github.com/KhronosGroup/Vulkan-Samples) - Official reference samples.
	- [Sascha Willems Examples](https://github.com/SaschaWillems/Vulkan) - 100+ open-source single-file examples.
	- [VMA Library](https://github.com/GPUOpen-LibrariesAndSDKs/VulkanMemoryAllocator) - AMD's memory allocator.
	- [RenderDoc](https://renderdoc.org/) - Free, essential GPU debugger.
	- [Vulkan 1.3 Spec](https://registry.khronos.org/vulkan/specs/latest/html/vkspec.html) - The official word on every behavior.