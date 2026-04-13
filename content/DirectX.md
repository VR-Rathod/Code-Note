---
seoTitle: DirectX 12 (D3D12) Complete Guide – Zero to Ray Tracing
description: "The most complete DirectX 12 reference note. Covers every concept from Device creation to DXR Ray Tracing — with full C++ code, HLSL shaders, and explanations for everything."
keywords: "directx 12, d3d12, hlsl, descriptor heap, root signature, pso, dxr, mesh shaders, d3d12 tutorial, windows graphics, vr-rathod, c++ directx"
---

tags:: index, graphics-programming, advanced-graphics, c++, windows
title:: DirectX

- # DirectX 12 — The Complete Masterclass
  collapsed:: true
	- > [!info] How to Read This Page
	  > DirectX 12 (D3D12) is Microsoft's explicit, low-level graphics API for Windows 10/11 and Xbox.
	  > Like Vulkan, it strips away all driver "magic" and requires you to manage memory, synchronization, and pipeline states yourself.
	  >
	  > **D3D12 is built in this order:**
	  > ```
	  > Debug Layer → DXGI Factory → Adapter → Device → Command Queue
	  >   → Swapchain → Descriptor Heaps → Command Lists → Root Signature
	  >   → Pipeline State Object (PSO) → Render Loop → [Advanced Topics]
	  > ```

	- ## DirectX 12 vs Vulkan Side-by-Side
	  collapsed:: true
		-
		  | Concept | Vulkan | DirectX 12 |
		  |---|---|---|
		  | GPU representation | `VkDevice` | `ID3D12Device` |
		  | Command recording | `VkCommandBuffer` | `ID3D12GraphicsCommandList` |
		  | Command memory | `VkCommandPool` | `ID3D12CommandAllocator` |
		  | Submission queue | `VkQueue` | `ID3D12CommandQueue` |
		  | Render targets | `VkRenderPass` + `VkFramebuffer` | `OMSetRenderTargets()` (no formal pass) |
		  | Shader bindings schema | `VkDescriptorSetLayout` | `ID3D12RootSignature` |
		  | Shader bindings data | `VkDescriptorSet` | Descriptor Heap + GPU handles |
		  | Baked pipeline object | `VkPipeline` | `ID3D12PipelineState` |
		  | CPU–GPU sync | `VkFence` | `ID3D12Fence` |
		  | GPU–GPU sync | `VkSemaphore` | `ID3D12Fence` (on separate queue) |
		  | Resource state | Image Layout Transition | Resource Barrier |
		  | Memory allocation | `vkAllocateMemory` | Heap Types (Default, Upload, Readback) |
		  | Window system | `VkSurfaceKHR` | `IDXGISwapChain` |
		  | Shader language | GLSL → SPIR-V | HLSL → DXBC / DXIL |
		  | Ray Tracing | `VK_KHR_ray_tracing_pipeline` | DirectX Raytracing (DXR) |

- # 1 — Setup and COM Pointers
  collapsed:: true
	- ## Windows COM Interface
	  collapsed:: true
		- DirectX uses **COM (Component Object Model)** interfaces. Every D3D12 object is a COM interface (`ID3D12Something`). You must use `Microsoft::WRL::ComPtr<T>` instead of raw pointers — it auto-releases when it goes out of scope (like `shared_ptr` for COM objects).
		- ```cpp
		  #include <d3d12.h>
		  #include <dxgi1_6.h>
		  #include <d3dcompiler.h>
		  #include <wrl/client.h>      // ComPtr<>
		  #include <DirectXMath.h>     // XMMATRIX, XMFLOAT3, etc.
		  
		  using namespace Microsoft::WRL;
		  using namespace DirectX;
		  
		  // Link libraries (in Visual Studio project settings or CMake)
		  // d3d12.lib  dxgi.lib  d3dcompiler.lib  dxguid.lib
		  
		  // ComPtr usage - auto-releases COM object when destroyed
		  ComPtr<ID3D12Device> device;
		  // device.Get()       → raw pointer (for API calls)
		  // device.GetAddressOf() → &device (for creation functions)
		  // device.Reset()     → explicit release
		  ```

	- ## Enabling the Debug Layer
	  collapsed:: true
		- The D3D12 Debug Layer validates every API call and catches mistakes. Always enable it in debug builds.
		- ```cpp
		  #if defined(_DEBUG)
		  ComPtr<ID3D12Debug1> debugController;
		  if (SUCCEEDED(D3D12GetDebugInterface(IID_PPV_ARGS(&debugController)))) {
		      debugController->EnableDebugLayer();
		      debugController->SetEnableGPUBasedValidation(TRUE); // GPU-side validation too
		      debugController->SetEnableSynchronizedCommandQueueValidation(TRUE);
		  }
		  
		  // Also enable DXGI debug messages
		  ComPtr<IDXGIInfoQueue> dxgiInfoQueue;
		  DXGIGetDebugInterface1(0, IID_PPV_ARGS(&dxgiInfoQueue));
		  dxgiInfoQueue->SetBreakOnSeverity(DXGI_DEBUG_ALL, DXGI_INFO_QUEUE_MESSAGE_SEVERITY_ERROR, true);
		  #endif
		  ```
		- > [!warning] Enable **before** creating any other D3D12 object. The debug layer must be active at creation time to instrument objects.

- # 2 — DXGI Factory and Adapter (Finding a GPU)
  collapsed:: true
	- ## DXGI — The Hardware Bridge
	  collapsed:: true
		- DXGI (DirectX Graphics Infrastructure) is the layer between DirectX and the GPU hardware. It handles adapter enumeration, swapchain creation, and display management. DXGI is separate from D3D12 — it works across DX11, DX12, and even Vulkan (on Windows via DXVK).
		- ```cpp
		  // Create DXGI Factory (required for everything DXGI)
		  UINT dxgiFactoryFlags = 0;
		  #if defined(_DEBUG)
		  dxgiFactoryFlags |= DXGI_CREATE_FACTORY_DEBUG;
		  #endif
		  
		  ComPtr<IDXGIFactory6> factory;
		  CreateDXGIFactory2(dxgiFactoryFlags, IID_PPV_ARGS(&factory));
		  
		  // Enumerate adapters by performance preference (discrete GPU first)
		  ComPtr<IDXGIAdapter4> adapter;
		  for (UINT adapterIndex = 0;
		       SUCCEEDED(factory->EnumAdapterByGpuPreference(
		           adapterIndex,
		           DXGI_GPU_PREFERENCE_HIGH_PERFORMANCE,
		           IID_PPV_ARGS(&adapter)));
		       ++adapterIndex)
		  {
		      DXGI_ADAPTER_DESC3 desc;
		      adapter->GetDesc3(&desc);
		  
		      // Skip the software rasterizer (WARP)
		      if (desc.Flags & DXGI_ADAPTER_FLAG3_SOFTWARE) continue;
		  
		      // Check if it supports D3D12
		      if (SUCCEEDED(D3D12CreateDevice(adapter.Get(), D3D_FEATURE_LEVEL_12_0,
		                                      _uuidof(ID3D12Device), nullptr))) {
		          break; // Found our GPU
		      }
		  }
		  ```

- # 3 — Creating the D3D12 Device
  collapsed:: true
	- ## Feature Levels
	  collapsed:: true
		-
		  | Feature Level | GPU Requirement | Features |
		  |---|---|---|
		  | `D3D_FEATURE_LEVEL_11_0` | Very old GPUs | SM 5.0, basic compute |
		  | `D3D_FEATURE_LEVEL_12_0` | Modern discrete GPUs | Tier 1 resource binding, VP, DXR optional |
		  | `D3D_FEATURE_LEVEL_12_1` | NVIDIA Maxwell+ / AMD GCN+ | Tier 2 resource binding |
		  | `D3D_FEATURE_LEVEL_12_2` | NVIDIA Ampere+ / AMD RDNA2+ | DXR Tier 1.1, Mesh Shaders, VRS |

	- ## Creating the Device
	  collapsed:: true
		- ```cpp
		  ComPtr<ID3D12Device8> device;
		  HRESULT hr = D3D12CreateDevice(
		      adapter.Get(),                 // Specific adapter to use
		      D3D_FEATURE_LEVEL_12_0,        // Minimum feature level
		      IID_PPV_ARGS(&device)
		  );
		  
		  if (FAILED(hr)) throw std::runtime_error("Failed to create D3D12 device!");
		  
		  // Configure debug breaks (in debug mode)
		  #if defined(_DEBUG)
		  ComPtr<ID3D12InfoQueue> infoQueue;
		  device->QueryInterface(IID_PPV_ARGS(&infoQueue));
		  infoQueue->SetBreakOnSeverity(D3D12_MESSAGE_SEVERITY_CORRUPTION, TRUE);
		  infoQueue->SetBreakOnSeverity(D3D12_MESSAGE_SEVERITY_ERROR, TRUE);
		  #endif
		  
		  // ---- Check what optional features are available ----
		  D3D12_FEATURE_DATA_D3D12_OPTIONS5 options5{};
		  device->CheckFeatureSupport(D3D12_FEATURE_D3D12_OPTIONS5, &options5, sizeof(options5));
		  bool hasRayTracing = (options5.RaytracingTier >= D3D12_RAYTRACING_TIER_1_0);
		  
		  D3D12_FEATURE_DATA_SHADER_MODEL shaderModel{ D3D_SHADER_MODEL_6_6 };
		  device->CheckFeatureSupport(D3D12_FEATURE_SHADER_MODEL, &shaderModel, sizeof(shaderModel));
		  ```

- # 4 — Command Queue, Allocator, and List
  collapsed:: true
	- ## The Three-Part Command System
	  collapsed:: true
		- ```mermaid
		  graph TD
		      CA["ID3D12CommandAllocator\nAllocates raw memory for command storage\nOne per frame-in-flight per thread"]
		      CL["ID3D12GraphicsCommandList\nYou record commands here (draw, barrier, copy)\nReused every frame (reset before recording)"]
		      CQ["ID3D12CommandQueue\nYou submit closed command lists here\nGPU executes from here asynchronously"]
		  
		      CA -->|"commandList->Reset(allocator)"| CL
		      CL -->|"commandList->Close()"| CQ
		      CQ -->|"commandQueue->ExecuteCommandLists()"| GPU["GPU: executes async"]
		  ```

	- ## Creating Each Component
	  collapsed:: true
		- ```cpp
		  // ---- Create the Command QUEUE ----
		  D3D12_COMMAND_QUEUE_DESC queueDesc{};
		  queueDesc.Type     = D3D12_COMMAND_LIST_TYPE_DIRECT; // Graphics + Compute + Copy
		  queueDesc.Priority = D3D12_COMMAND_QUEUE_PRIORITY_NORMAL;
		  queueDesc.Flags    = D3D12_COMMAND_QUEUE_FLAG_NONE;
		  queueDesc.NodeMask = 0; // Single-GPU: always 0
		  
		  ComPtr<ID3D12CommandQueue> commandQueue;
		  device->CreateCommandQueue(&queueDesc, IID_PPV_ARGS(&commandQueue));
		  
		  // ---- Create Command ALLOCATORS (one per frame-in-flight) ----
		  const UINT numFrames = 2;
		  ComPtr<ID3D12CommandAllocator> commandAllocators[numFrames];
		  for (UINT i = 0; i < numFrames; i++) {
		      device->CreateCommandAllocator(D3D12_COMMAND_LIST_TYPE_DIRECT,
		                                     IID_PPV_ARGS(&commandAllocators[i]));
		  }
		  
		  // ---- Create the Command LIST ----
		  ComPtr<ID3D12GraphicsCommandList6> commandList;
		  device->CreateCommandList(0,
		                            D3D12_COMMAND_LIST_TYPE_DIRECT,
		                            commandAllocators[0].Get(),
		                            nullptr,             // No initial PSO
		                            IID_PPV_ARGS(&commandList));
		  
		  commandList->Close(); // Must be closed before reset
		  ```
		- > [!tip] Create one `CommandAllocator` per frame-in-flight AND per thread. A command allocator cannot be reset while the GPU is still reading from it. The command list itself is cheap and can be shared across frames after resetting.

- # 5 — Swapchain
  collapsed:: true
	- ## Creating the Swapchain
	  collapsed:: true
		- ```cpp
		  DXGI_SWAP_CHAIN_DESC1 swapChainDesc{};
		  swapChainDesc.Width              = windowWidth;
		  swapChainDesc.Height             = windowHeight;
		  swapChainDesc.Format             = DXGI_FORMAT_R8G8B8A8_UNORM; // 8-bit LDR
		  // swapChainDesc.Format          = DXGI_FORMAT_R16G16B16A16_FLOAT; // 16-bit HDR
		  swapChainDesc.Stereo             = FALSE;
		  swapChainDesc.SampleDesc.Count   = 1;                       // No MSAA on swapchain
		  swapChainDesc.SampleDesc.Quality = 0;
		  swapChainDesc.BufferUsage        = DXGI_USAGE_RENDER_TARGET_OUTPUT;
		  swapChainDesc.BufferCount        = numFrames;               // Double or triple buffer
		  swapChainDesc.Scaling            = DXGI_SCALING_NONE;
		  swapChainDesc.SwapEffect         = DXGI_SWAP_EFFECT_FLIP_DISCARD; // Modern flip model
		  swapChainDesc.AlphaMode          = DXGI_ALPHA_MODE_UNSPECIFIED;
		  swapChainDesc.Flags              = DXGI_SWAP_CHAIN_FLAG_ALLOW_MODE_SWITCH
		                                   | DXGI_SWAP_CHAIN_FLAG_ALLOW_TEARING; // For VRR/G-Sync
		  
		  ComPtr<IDXGISwapChain1> swapChain1;
		  factory->CreateSwapChainForHwnd(
		      commandQueue.Get(), // Swapchain associates with a command queue
		      hwnd,
		      &swapChainDesc,
		      nullptr,            // Fullscreen desc (null = windowed)
		      nullptr,            // Output monitor restriction
		      &swapChain1
		  );
		  
		  ComPtr<IDXGISwapChain4> swapChain;
		  swapChain1.As(&swapChain); // Upgrade to IDXGISwapChain4
		  
		  UINT currentFrameIndex = swapChain->GetCurrentBackBufferIndex();
		  ```

- # 6 — Descriptor Heaps
  collapsed:: true
	- ## What Are Descriptor Heaps?
	  collapsed:: true
		- In D3D11, you bound textures like this: `context->PSSetShaderResources(0, 1, &myTexture)`.
		- In D3D12, everything goes through **Descriptor Heaps** — large arrays of "handles" (views) into resources living in GPU memory.
		- ```mermaid
		  graph TD
		      Resource["ID3D12Resource\nActual GPU memory (texture, buffer)"]
		      View["View (SRV/CBV/UAV/RTV/DSV)\nDescribes how the shader sees the resource"]
		      Heap["Descriptor Heap\nArray of views stored contiguously in GPU memory"]
		      Shader["HLSL Shader\nReads from register t0, b0, u0, etc."]
		  
		      Resource --> View --> Heap --> Shader
		  ```

	- ## The Four Heap Types
	  collapsed:: true
		-
		  | Heap Type | Holds | GPU Visible? | Usage |
		  |---|---|---|---|
		  | `CBV_SRV_UAV` | Constant Buffer Views, Shader Resource Views, Unordered Access Views | YES | All shader-readable data and textures |
		  | `SAMPLER` | Texture sampling configurations | YES | How textures are filtered |
		  | `RTV` | Render Target Views | NO | Back buffer / G-Buffer color targets |
		  | `DSV` | Depth Stencil Views | NO | Depth and stencil buffers |

	- ## Creating Descriptor Heaps
	  collapsed:: true
		- ```cpp
		  // ---- RTV Heap (Render Target Views for the swapchain back buffers) ----
		  D3D12_DESCRIPTOR_HEAP_DESC rtvHeapDesc{};
		  rtvHeapDesc.NumDescriptors = numFrames; // One RTV per back buffer
		  rtvHeapDesc.Type           = D3D12_DESCRIPTOR_HEAP_TYPE_RTV;
		  rtvHeapDesc.Flags          = D3D12_DESCRIPTOR_HEAP_FLAG_NONE; // NOT shader visible
		  
		  ComPtr<ID3D12DescriptorHeap> rtvHeap;
		  device->CreateDescriptorHeap(&rtvHeapDesc, IID_PPV_ARGS(&rtvHeap));
		  
		  // The INCREMENT SIZE varies by GPU vendor — always query it, never hardcode!
		  UINT rtvDescSize = device->GetDescriptorHandleIncrementSize(D3D12_DESCRIPTOR_HEAP_TYPE_RTV);
		  UINT srvDescSize = device->GetDescriptorHandleIncrementSize(D3D12_DESCRIPTOR_HEAP_TYPE_CBV_SRV_UAV);
		  
		  // ---- Create one RTV per swapchain image ----
		  D3D12_CPU_DESCRIPTOR_HANDLE rtvHandle = rtvHeap->GetCPUDescriptorHandleForHeapStart();
		  
		  ComPtr<ID3D12Resource> renderTargets[numFrames];
		  for (UINT i = 0; i < numFrames; i++) {
		      swapChain->GetBuffer(i, IID_PPV_ARGS(&renderTargets[i]));
		      device->CreateRenderTargetView(renderTargets[i].Get(), nullptr, rtvHandle);
		      rtvHandle.ptr += rtvDescSize; // Advance to the next slot in the heap
		  }
		  
		  // ---- DSV Heap (Depth Buffer) ----
		  D3D12_DESCRIPTOR_HEAP_DESC dsvHeapDesc{};
		  dsvHeapDesc.NumDescriptors = 1;
		  dsvHeapDesc.Type           = D3D12_DESCRIPTOR_HEAP_TYPE_DSV;
		  dsvHeapDesc.Flags          = D3D12_DESCRIPTOR_HEAP_FLAG_NONE;
		  
		  ComPtr<ID3D12DescriptorHeap> dsvHeap;
		  device->CreateDescriptorHeap(&dsvHeapDesc, IID_PPV_ARGS(&dsvHeap));
		  
		  // ---- SRV/CBV/UAV Heap (Textures + Uniforms) ----
		  D3D12_DESCRIPTOR_HEAP_DESC srvHeapDesc{};
		  srvHeapDesc.NumDescriptors = 1000; // Room for many resources
		  srvHeapDesc.Type           = D3D12_DESCRIPTOR_HEAP_TYPE_CBV_SRV_UAV;
		  srvHeapDesc.Flags          = D3D12_DESCRIPTOR_HEAP_FLAG_SHADER_VISIBLE; // GPU can read this
		  
		  ComPtr<ID3D12DescriptorHeap> srvHeap;
		  device->CreateDescriptorHeap(&srvHeapDesc, IID_PPV_ARGS(&srvHeap));
		  ```

- # 7 — Resources and Memory (Heaps)
  collapsed:: true
	- ## D3D12 Memory Heap Types
	  collapsed:: true
		-
		  | Heap Type | CPU Access | GPU Access | Use Case |
		  |---|---|---|---|
		  | `HEAP_TYPE_DEFAULT` | None | Fast read/write | Textures, vertex buffers, render targets (VRAM) |
		  | `HEAP_TYPE_UPLOAD` | CPU write | GPU read | Staging buffer, per-frame uniform data |
		  | `HEAP_TYPE_READBACK` | CPU read | GPU write | GPU → CPU readback (screenshots, compute results) |
		  | `HEAP_TYPE_CUSTOM` | Configurable | Configurable | Advanced: unified memory (laptop discrete) |

	- ## Creating a Buffer Resource
	  collapsed:: true
		- D3D12 uses `CreateCommittedResource` (simple, one allocation = one heap) or `CreatePlacedResource` (manual heap management, advanced).
		- ```cpp
		  auto createBuffer = [&device](UINT64 size, D3D12_HEAP_TYPE heapType,
		                                D3D12_RESOURCE_STATES initialState) -> ComPtr<ID3D12Resource> {
		      D3D12_HEAP_PROPERTIES heapProps{};
		      heapProps.Type = heapType;
		  
		      D3D12_RESOURCE_DESC bufDesc{};
		      bufDesc.Dimension        = D3D12_RESOURCE_DIMENSION_BUFFER;
		      bufDesc.Width            = size;
		      bufDesc.Height           = 1;
		      bufDesc.DepthOrArraySize = 1;
		      bufDesc.MipLevels        = 1;
		      bufDesc.Format           = DXGI_FORMAT_UNKNOWN;
		      bufDesc.SampleDesc       = { 1, 0 };
		      bufDesc.Layout           = D3D12_TEXTURE_LAYOUT_ROW_MAJOR;
		      bufDesc.Flags            = D3D12_RESOURCE_FLAG_NONE;
		  
		      ComPtr<ID3D12Resource> buffer;
		      device->CreateCommittedResource(
		          &heapProps, D3D12_HEAP_FLAG_NONE,
		          &bufDesc, initialState,
		          nullptr, IID_PPV_ARGS(&buffer)
		      );
		      return buffer;
		  };
		  
		  // Upload vertex data to GPU
		  auto uploadBuffer = createBuffer(vertexData.size(),
		                                   D3D12_HEAP_TYPE_UPLOAD,
		                                   D3D12_RESOURCE_STATE_GENERIC_READ);
		  
		  auto vertexBuffer = createBuffer(vertexData.size(),
		                                   D3D12_HEAP_TYPE_DEFAULT,
		                                   D3D12_RESOURCE_STATE_COPY_DEST);
		  
		  // Map the upload buffer and copy vertices
		  void* mappedData;
		  uploadBuffer->Map(0, nullptr, &mappedData);
		  memcpy(mappedData, vertexData.data(), vertexData.size());
		  uploadBuffer->Unmap(0, nullptr);
		  
		  // Issue GPU copy command
		  commandList->CopyResource(vertexBuffer.Get(), uploadBuffer.Get());
		  ```

	- ## Resource Barriers — The Most Important Concept
	  collapsed:: true
		- Resource barriers are D3D12's way of telling the GPU: **"The resource's usage is changing."**
		- Without a barrier, the GPU doesn't know to flush its caches or wait for dependent passes to finish.
		-
		  | Resource State | How it's Used |
		  |---|---|
		  | `D3D12_RESOURCE_STATE_PRESENT` | On screen — about to be displayed |
		  | `D3D12_RESOURCE_STATE_RENDER_TARGET` | Being drawn to (color output) |
		  | `D3D12_RESOURCE_STATE_DEPTH_WRITE` | Depth buffer is being written |
		  | `D3D12_RESOURCE_STATE_DEPTH_READ` | Depth buffer read-only (e.g., in shadow map sampling) |
		  | `D3D12_RESOURCE_STATE_PIXEL_SHADER_RESOURCE` | Being sampled in pixel shader |
		  | `D3D12_RESOURCE_STATE_NON_PIXEL_SHADER_RESOURCE` | Read in vertex / compute shader |
		  | `D3D12_RESOURCE_STATE_UNORDERED_ACCESS` | Read + write in compute shader (UAV) |
		  | `D3D12_RESOURCE_STATE_COPY_SOURCE` | Source for a GPU copy |
		  | `D3D12_RESOURCE_STATE_COPY_DEST` | Destination for a GPU copy |
		  | `D3D12_RESOURCE_STATE_GENERIC_READ` | Any read-only access (upload heaps only) |
		- ```cpp
		  // Helper: create a transition barrier
		  D3D12_RESOURCE_BARRIER TransitionBarrier(ID3D12Resource* resource,
		                                            D3D12_RESOURCE_STATES before,
		                                            D3D12_RESOURCE_STATES after) {
		      D3D12_RESOURCE_BARRIER barrier{};
		      barrier.Type                   = D3D12_RESOURCE_BARRIER_TYPE_TRANSITION;
		      barrier.Flags                  = D3D12_RESOURCE_BARRIER_FLAG_NONE;
		      barrier.Transition.pResource   = resource;
		      barrier.Transition.StateBefore = before;
		      barrier.Transition.StateAfter  = after;
		      barrier.Transition.Subresource = D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES;
		      return barrier;
		  }
		  
		  // Example: transition back buffer from Present to Render Target at start of frame
		  auto barrier = TransitionBarrier(renderTargets[frameIndex].Get(),
		                                   D3D12_RESOURCE_STATE_PRESENT,
		                                   D3D12_RESOURCE_STATE_RENDER_TARGET);
		  commandList->ResourceBarrier(1, &barrier);
		  
		  // ... drawing ...
		  
		  // Transition back from Render Target to Present at end of frame
		  auto barrierBack = TransitionBarrier(renderTargets[frameIndex].Get(),
		                                       D3D12_RESOURCE_STATE_RENDER_TARGET,
		                                       D3D12_RESOURCE_STATE_PRESENT);
		  commandList->ResourceBarrier(1, &barrierBack);
		  ```

- # 8 — Root Signatures
  collapsed:: true
	- ## What Is a Root Signature?
	  collapsed:: true
		- The Root Signature is the **contract** between your C++ code and your HLSL shaders. It defines exactly what types of data are available to the shaders and how they access it. Think of it as the function signature of your shader's "API".
		- Every `SetGraphicsRoot*(...)` call you make maps to an entry defined here.
		- ```mermaid
		  graph TD
		      RS["Root Signature\n(The Contract / Function Signature)"]
		      RC["Root Constants\n≤ 12 DWORDs, fastest — directly in registers\nUse for: object index, time, flags"]
		      RD["Root Descriptors\nCBV/SRV/UAV address directly in root\nNo indirection, fast — use for per-draw data"]
		      DT["Descriptor Tables\nPointer to a range in a descriptor heap\nSlower but allows huge arrays of textures"]
		  
		      RS --> RC
		      RS --> RD
		      RS --> DT
		  ```

	- ## Creating a Root Signature
	  collapsed:: true
		- ```cpp
		  // Example: 1 CBV (camera matrices) + 1 descriptor table (texture)
		  
		  // Slot 0: Root Descriptor (CBV at register b0)
		  D3D12_ROOT_PARAMETER1 rootParams[2]{};
		  rootParams[0].ParameterType             = D3D12_ROOT_PARAMETER_TYPE_CBV;
		  rootParams[0].Descriptor.ShaderRegister = 0; // b0 in HLSL
		  rootParams[0].Descriptor.RegisterSpace  = 0;
		  rootParams[0].ShaderVisibility           = D3D12_SHADER_VISIBILITY_VERTEX;
		  
		  // Slot 1: Descriptor Table (1 SRV at register t0)
		  D3D12_DESCRIPTOR_RANGE1 srvRange{};
		  srvRange.RangeType                         = D3D12_DESCRIPTOR_RANGE_TYPE_SRV;
		  srvRange.NumDescriptors                    = 1;
		  srvRange.BaseShaderRegister                = 0; // t0
		  srvRange.RegisterSpace                     = 0;
		  srvRange.OffsetInDescriptorsFromTableStart = D3D12_DESCRIPTOR_RANGE_OFFSET_APPEND;
		  
		  rootParams[1].ParameterType                       = D3D12_ROOT_PARAMETER_TYPE_DESCRIPTOR_TABLE;
		  rootParams[1].DescriptorTable.NumDescriptorRanges = 1;
		  rootParams[1].DescriptorTable.pDescriptorRanges   = &srvRange;
		  rootParams[1].ShaderVisibility                     = D3D12_SHADER_VISIBILITY_PIXEL;
		  
		  // Static Sampler (doesn't use a heap — defined directly in root signature)
		  D3D12_STATIC_SAMPLER_DESC sampler{};
		  sampler.Filter           = D3D12_FILTER_MIN_MAG_MIP_LINEAR; // Trilinear
		  sampler.AddressU         = D3D12_TEXTURE_ADDRESS_MODE_WRAP;
		  sampler.AddressV         = D3D12_TEXTURE_ADDRESS_MODE_WRAP;
		  sampler.AddressW         = D3D12_TEXTURE_ADDRESS_MODE_WRAP;
		  sampler.MipLODBias       = 0;
		  sampler.MaxAnisotropy    = 16;
		  sampler.ComparisonFunc   = D3D12_COMPARISON_FUNC_NEVER;
		  sampler.BorderColor      = D3D12_STATIC_BORDER_COLOR_TRANSPARENT_BLACK;
		  sampler.MinLOD           = 0.0f;
		  sampler.MaxLOD           = D3D12_FLOAT32_MAX;
		  sampler.ShaderRegister   = 0; // s0 in HLSL
		  sampler.RegisterSpace    = 0;
		  sampler.ShaderVisibility = D3D12_SHADER_VISIBILITY_PIXEL;
		  
		  D3D12_VERSIONED_ROOT_SIGNATURE_DESC rootSigDesc{};
		  rootSigDesc.Version                    = D3D_ROOT_SIGNATURE_VERSION_1_1;
		  rootSigDesc.Desc_1_1.NumParameters     = 2;
		  rootSigDesc.Desc_1_1.pParameters       = rootParams;
		  rootSigDesc.Desc_1_1.NumStaticSamplers = 1;
		  rootSigDesc.Desc_1_1.pStaticSamplers   = &sampler;
		  rootSigDesc.Desc_1_1.Flags             = D3D12_ROOT_SIGNATURE_FLAG_ALLOW_INPUT_ASSEMBLER_INPUT_LAYOUT;
		  
		  ComPtr<ID3DBlob> serializedRootSig, errorBlob;
		  D3D12SerializeVersionedRootSignature(&rootSigDesc, &serializedRootSig, &errorBlob);
		  
		  ComPtr<ID3D12RootSignature> rootSignature;
		  device->CreateRootSignature(0,
		                              serializedRootSig->GetBufferPointer(),
		                              serializedRootSig->GetBufferSize(),
		                              IID_PPV_ARGS(&rootSignature));
		  ```

- # 9 — HLSL Shaders
  collapsed:: true
	- ## Writing a Vertex Shader
	  collapsed:: true
		- ```hlsl
		  // vertex_shader.hlsl
		  
		  // Constant buffer at register b0 (matches Root Signature slot 0)
		  cbuffer PerFrameConstants : register(b0)
		  {
		      float4x4 g_Model;
		      float4x4 g_View;
		      float4x4 g_Proj;
		      float3   g_CameraPos;
		      float    g_Time;
		  };
		  
		  // Vertex input layout (matches D3D12_INPUT_ELEMENT_DESC array in PSO)
		  struct VSInput
		  {
		      float3 Position : POSITION;
		      float3 Normal   : NORMAL;
		      float2 TexCoord : TEXCOORD0;
		      float3 Tangent  : TANGENT;
		  };
		  
		  // Output interpolated to pixel shader
		  struct VSOutput
		  {
		      float4 Position  : SV_POSITION;   // SV_ = System Value semantic (built-in)
		      float3 WorldPos  : WORLDPOS;
		      float3 Normal    : NORMAL;
		      float2 TexCoord  : TEXCOORD0;
		  };
		  
		  VSOutput VSMain(VSInput input)
		  {
		      VSOutput output;
		  
		      float4 worldPos    = mul(g_Model, float4(input.Position, 1.0f));
		      output.WorldPos    = worldPos.xyz;
		      output.Position    = mul(g_Proj, mul(g_View, worldPos));
		      output.Normal      = mul((float3x3)g_Model, input.Normal);
		      output.TexCoord    = input.TexCoord;
		  
		      return output;
		  }
		  ```

	- ## Writing a Pixel Shader
	  collapsed:: true
		- ```hlsl
		  // pixel_shader.hlsl
		  
		  // Texture + sampler at t0 / s0 (matches Root Signature descriptor table)
		  Texture2D    g_AlbedoTex   : register(t0);
		  Texture2D    g_NormalTex   : register(t1);
		  Texture2D    g_RoughMetTex : register(t2);
		  SamplerState g_LinearSampler : register(s0);
		  
		  // Receives interpolated data from vertex shader
		  struct PSInput
		  {
		      float4 Position  : SV_POSITION;
		      float3 WorldPos  : WORLDPOS;
		      float3 Normal    : NORMAL;
		      float2 TexCoord  : TEXCOORD0;
		  };
		  
		  // SV_TARGET = output to render target 0
		  float4 PSMain(PSInput input) : SV_TARGET
		  {
		      float4 albedo  = g_AlbedoTex.Sample(g_LinearSampler, input.TexCoord);
		      float3 normal  = normalize(input.Normal);
		  
		      // Simple Lambert diffuse
		      float3 lightDir = normalize(float3(1, 1, -1));
		      float  ndotl    = saturate(dot(normal, lightDir));
		  
		      float3 result = albedo.rgb * ndotl + albedo.rgb * 0.1f; // diffuse + ambient
		      return float4(result, albedo.a);
		  }
		  ```

	- ## Compiling HLSL at Runtime
	  collapsed:: true
		- ```cpp
		  // Old way: use d3dcompiler.lib (still works, ships with Windows SDK)
		  ComPtr<ID3DBlob> vertexShader, pixelShader, error;
		  
		  UINT compileFlags = D3DCOMPILE_DEBUG | D3DCOMPILE_SKIP_OPTIMIZATION; // Debug only
		  
		  D3DCompileFromFile(
		      L"vertex_shader.hlsl",
		      nullptr,                     // Macros
		      nullptr,                     // Include handler
		      "VSMain",                    // Entry point
		      "vs_6_0",                    // Target profile (Shader Model 6.0)
		      compileFlags, 0,
		      &vertexShader, &error
		  );
		  
		  if (error) OutputDebugStringA((char*)error->GetBufferPointer());
		  
		  // Modern way: use DXC compiler (required for SM 6.x features)
		  // IDxcCompiler3 from dxcompiler.dll
		  // Supports: WaveIntrinsics, Bindless, Raytracing, Mesh Shaders, SPIR-V output
		  ```

- # 10 — Pipeline State Object (PSO)
  collapsed:: true
	- ## The Immutable Pipeline
	  collapsed:: true
		- Like Vulkan's `VkPipeline`, the DX12 `ID3D12PipelineState` bakes shader code + all render states into one immutable blob. This means no per-draw state changes — the driver can pre-compile everything.
		- > [!tip] Common practice: create ALL your PSOs during loading, cache them in a map, and just call `SetPipelineState()` to switch. Creating PSOs at runtime causes hitches.
		- ```cpp
		  // Input Layout: matches POSITION/NORMAL/TEXCOORD0 semantics in vertex shader
		  D3D12_INPUT_ELEMENT_DESC inputLayout[] = {
		      { "POSITION", 0, DXGI_FORMAT_R32G32B32_FLOAT, 0,  0,  D3D12_INPUT_CLASSIFICATION_PER_VERTEX_DATA, 0 },
		      { "NORMAL",   0, DXGI_FORMAT_R32G32B32_FLOAT, 0,  12, D3D12_INPUT_CLASSIFICATION_PER_VERTEX_DATA, 0 },
		      { "TEXCOORD", 0, DXGI_FORMAT_R32G32_FLOAT,    0,  24, D3D12_INPUT_CLASSIFICATION_PER_VERTEX_DATA, 0 },
		      { "TANGENT",  0, DXGI_FORMAT_R32G32B32_FLOAT, 0,  32, D3D12_INPUT_CLASSIFICATION_PER_VERTEX_DATA, 0 },
		  };
		  
		  D3D12_GRAPHICS_PIPELINE_STATE_DESC psoDesc{};
		  psoDesc.InputLayout           = { inputLayout, _countof(inputLayout) };
		  psoDesc.pRootSignature        = rootSignature.Get();
		  psoDesc.VS                    = { vertexShader->GetBufferPointer(), vertexShader->GetBufferSize() };
		  psoDesc.PS                    = { pixelShader->GetBufferPointer(),  pixelShader->GetBufferSize()  };
		  
		  // Rasterizer State
		  psoDesc.RasterizerState.FillMode              = D3D12_FILL_MODE_SOLID;
		  psoDesc.RasterizerState.CullMode              = D3D12_CULL_MODE_BACK;
		  psoDesc.RasterizerState.FrontCounterClockwise = FALSE;
		  psoDesc.RasterizerState.DepthBias             = D3D12_DEFAULT_DEPTH_BIAS;
		  psoDesc.RasterizerState.DepthBiasClamp        = D3D12_DEFAULT_DEPTH_BIAS_CLAMP;
		  psoDesc.RasterizerState.SlopeScaledDepthBias  = D3D12_DEFAULT_SLOPE_SCALED_DEPTH_BIAS;
		  psoDesc.RasterizerState.DepthClipEnable       = TRUE;
		  psoDesc.RasterizerState.MultisampleEnable      = FALSE;
		  psoDesc.RasterizerState.AntialiasedLineEnable  = FALSE;
		  
		  // Blend State (opaque — no transparency)
		  psoDesc.BlendState.RenderTarget[0].BlendEnable           = FALSE;
		  psoDesc.BlendState.RenderTarget[0].LogicOpEnable         = FALSE;
		  psoDesc.BlendState.RenderTarget[0].RenderTargetWriteMask = D3D12_COLOR_WRITE_ENABLE_ALL;
		  
		  // Depth Stencil
		  psoDesc.DepthStencilState.DepthEnable    = TRUE;
		  psoDesc.DepthStencilState.DepthWriteMask = D3D12_DEPTH_WRITE_MASK_ALL;
		  psoDesc.DepthStencilState.DepthFunc      = D3D12_COMPARISON_FUNC_LESS;
		  psoDesc.DepthStencilState.StencilEnable  = FALSE;
		  
		  // Topology and formats
		  psoDesc.PrimitiveTopologyType = D3D12_PRIMITIVE_TOPOLOGY_TYPE_TRIANGLE;
		  psoDesc.NumRenderTargets      = 1;
		  psoDesc.RTVFormats[0]         = DXGI_FORMAT_R8G8B8A8_UNORM;
		  psoDesc.DSVFormat             = DXGI_FORMAT_D32_FLOAT;
		  psoDesc.SampleMask            = UINT_MAX;
		  psoDesc.SampleDesc            = { 1, 0 };
		  
		  ComPtr<ID3D12PipelineState> pso;
		  device->CreateGraphicsPipelineState(&psoDesc, IID_PPV_ARGS(&pso));
		  ```

- # 11 — Drawing and the Render Loop
  collapsed:: true
	- ## Synchronization with Fences
	  collapsed:: true
		- ```cpp
		  ComPtr<ID3D12Fence> fence;
		  device->CreateFence(0, D3D12_FENCE_FLAG_NONE, IID_PPV_ARGS(&fence));
		  UINT64 fenceValues[numFrames] = {0};
		  HANDLE fenceEvent = CreateEvent(nullptr, FALSE, FALSE, nullptr);
		  
		  // Call at the END of each frame — signals and waits for the right frame
		  void WaitForFrame(UINT frameIndex) {
		      UINT64 currentFenceValue = fenceValues[frameIndex];
		      commandQueue->Signal(fence.Get(), currentFenceValue);
		  
		      // If the GPU hasn't finished this frame yet, wait
		      if (fence->GetCompletedValue() < currentFenceValue) {
		          fence->SetEventOnCompletion(currentFenceValue, fenceEvent);
		          WaitForSingleObject(fenceEvent, INFINITE);
		      }
		  
		      fenceValues[frameIndex]++;
		  }
		  ```

	- ## The Complete D3D12 Frame
	  collapsed:: true
		- ```cpp
		  void drawFrame() {
		      UINT frameIndex = swapChain->GetCurrentBackBufferIndex();
		  
		      // === 1: Wait for GPU to free this frame's command allocator ===
		      WaitForFrame(frameIndex);
		  
		      // === 2: Reset command allocator + command list ===
		      commandAllocators[frameIndex]->Reset();
		      commandList->Reset(commandAllocators[frameIndex].Get(), pso.Get());
		  
		      // === 3: Update constant buffer (upload heap, mapped persistently) ===
		      memcpy(cbMappedData[frameIndex], &perFrameData, sizeof(PerFrameConstants));
		  
		      // === 4: Transition back buffer: Present → Render Target ===
		      auto barrierToRT = TransitionBarrier(renderTargets[frameIndex].Get(),
		                                           D3D12_RESOURCE_STATE_PRESENT,
		                                           D3D12_RESOURCE_STATE_RENDER_TARGET);
		      commandList->ResourceBarrier(1, &barrierToRT);
		  
		      // === 5: Set render target and clear ===
		      D3D12_CPU_DESCRIPTOR_HANDLE rtv = rtvHeap->GetCPUDescriptorHandleForHeapStart();
		      rtv.ptr += (SIZE_T)frameIndex * rtvDescSize;
		  
		      D3D12_CPU_DESCRIPTOR_HANDLE dsv = dsvHeap->GetCPUDescriptorHandleForHeapStart();
		  
		      commandList->OMSetRenderTargets(1, &rtv, FALSE, &dsv);
		  
		      const float clearColor[] = { 0.05f, 0.05f, 0.1f, 1.0f };
		      commandList->ClearRenderTargetView(rtv, clearColor, 0, nullptr);
		      commandList->ClearDepthStencilView(dsv, D3D12_CLEAR_FLAG_DEPTH, 1.0f, 0, 0, nullptr);
		  
		      // === 6: Set viewport and scissor ===
		      D3D12_VIEWPORT viewport{ 0, 0, (float)width, (float)height, 0.0f, 1.0f };
		      D3D12_RECT     scissor { 0, 0, (LONG)width, (LONG)height };
		      commandList->RSSetViewports(1, &viewport);
		      commandList->RSSetScissorRects(1, &scissor);
		  
		      // === 7: Set root signature and pipeline ===
		      commandList->SetGraphicsRootSignature(rootSignature.Get());
		      commandList->SetPipelineState(pso.Get());
		  
		      // === 8: Bind descriptor heaps ===
		      ID3D12DescriptorHeap* heaps[] = { srvHeap.Get() };
		      commandList->SetDescriptorHeaps(1, heaps);
		  
		      // === 9: Bind resources ===
		      // Root param 0: CBV (constant buffer)
		      commandList->SetGraphicsRootConstantBufferView(0, constantBuffers[frameIndex]->GetGPUVirtualAddress());
		  
		      // Root param 1: Descriptor table (SRV handle from the heap)
		      D3D12_GPU_DESCRIPTOR_HANDLE srvGpuHandle = srvHeap->GetGPUDescriptorHandleForHeapStart();
		      commandList->SetGraphicsRootDescriptorTable(1, srvGpuHandle);
		  
		      // === 10: Draw ===
		      commandList->IASetPrimitiveTopology(D3D_PRIMITIVE_TOPOLOGY_TRIANGLELIST);
		      commandList->IASetVertexBuffers(0, 1, &vertexBufferView);
		      commandList->IASetIndexBuffer(&indexBufferView);
		      commandList->DrawIndexedInstanced(indexCount, 1, 0, 0, 0);
		  
		      // === 11: Transition back buffer: Render Target → Present ===
		      auto barrierToPresent = TransitionBarrier(renderTargets[frameIndex].Get(),
		                                                D3D12_RESOURCE_STATE_RENDER_TARGET,
		                                                D3D12_RESOURCE_STATE_PRESENT);
		      commandList->ResourceBarrier(1, &barrierToPresent);
		  
		      // === 12: Close and execute ===
		      commandList->Close();
		      ID3D12CommandList* lists[] = { commandList.Get() };
		      commandQueue->ExecuteCommandLists(1, lists);
		  
		      // === 13: Present frame ===
		      swapChain->Present(1, 0); // 1 = V-Sync, 0 = flags
		  }
		  ```

- # 12 — HLSL Compute Shaders
  collapsed:: true
	- ## Compute Shader Basics
	  collapsed:: true
		- ```hlsl
		  // compute_particles.hlsl
		  
		  struct Particle {
		      float3 position;
		      float  lifetime;
		      float3 velocity;
		      float  size;
		  };
		  
		  // RWStructuredBuffer = read + write from shader (UAV binding)
		  RWStructuredBuffer<Particle> g_Particles : register(u0);
		  
		  // Push constants equivalent (Root Constants)
		  cbuffer SimConstants : register(b0) {
		      float  g_DeltaTime;
		      float3 g_Gravity;
		      uint   g_ParticleCount;
		  }
		  
		  // numthreads defines the 3D thread group size
		  // Total threads per dispatch = numthreads * DispatchX * DispatchY * DispatchZ
		  [numthreads(64, 1, 1)]
		  void CSMain(uint3 dispatchID : SV_DispatchThreadID) {
		      uint index = dispatchID.x;
		      if (index >= g_ParticleCount) return;
		  
		      Particle p = g_Particles[index];
		  
		      // Euler integration
		      p.velocity  += g_Gravity * g_DeltaTime;
		      p.position  += p.velocity * g_DeltaTime;
		      p.lifetime  -= g_DeltaTime;
		  
		      if (p.lifetime <= 0.0f) {
		          // Respawn at origin with upward velocity
		          p.position = float3(0, 0, 0);
		          p.velocity = float3(0, 5.0f, 0);
		          p.lifetime = 2.0f;
		      }
		  
		      g_Particles[index] = p;
		  }
		  ```
		- ```cpp
		  // C++ side: dispatch compute
		  commandList->SetComputeRootSignature(computeRootSignature.Get());
		  commandList->SetPipelineState(computePso.Get());
		  commandList->SetDescriptorHeaps(1, heaps);
		  commandList->SetComputeRootDescriptorTable(0, uavGpuHandle);
		  commandList->SetComputeRoot32BitConstants(1, 4, &simConstants, 0);
		  commandList->Dispatch((particleCount + 63) / 64, 1, 1); // Ceiling division
		  ```

- # 13 — DirectX Raytracing (DXR)
  collapsed:: true
	- ## DXR Overview
	  collapsed:: true
		- DXR integrates ray tracing directly into the D3D12 API. It uses the existing command list / queue system but adds new state objects, acceleration structures, and shader types.
		- ```mermaid
		  graph TD
		      Mesh["ID3D12Resource\n(vertex + index buffers)"]
		      BLAS["BottomLevelAS\nOne per unique mesh\nvkBuildAccelerationStructure BLAS"]
		      Instance["Instance Desc\n{transform, BLAS address, hitGroup}"]
		      TLAS["TopLevelAS\nAll instances in the scene\n(rebuilt each frame if objects move)"]
		  
		      RGen["Ray Generation Shader (.rgen)\nOne thread per pixel. Calls TraceRay()."]
		      RHit["Closest Hit Shader (.rchit)\nCalled when ray hits nearest surface. Do shading."]
		      RMiss["Miss Shader (.rmiss)\nCalled when ray misses all geometry. Sky color."]
		      SBT["Shader Binding Table\nMaps geometry instance → hit group shader"]
		  
		      Mesh --> BLAS --> Instance --> TLAS
		      TLAS --> RGen
		      SBT --> RHit
		      SBT --> RMiss
		      RGen -->|"TraceRay()"| RHit & RMiss
		  ```

	- ## HLSL Ray Generation Shader
	  collapsed:: true
		- ```hlsl
		  // raygen.hlsl
		  #define HLSL
		  #include "RaytracingHlslCompat.h"
		  
		  RaytracingAccelerationStructure g_Scene  : register(t0); // TLAS
		  RWTexture2D<float4>             g_Output : register(u0); // Output image
		  
		  struct RayPayload {
		      float4 color;
		      uint   recursionDepth;
		  };
		  
		  [shader("raygeneration")]
		  void RayGen() {
		      uint2 pixel = DispatchRaysIndex().xy;
		      uint2 dims  = DispatchRaysDimensions().xy;
		  
		      // Build ray from camera
		      float2 uv  = (float2(pixel) + 0.5f) / float2(dims);
		      float2 ndc = uv * 2.0f - 1.0f;
		  
		      float3 origin    = g_CameraPos;
		      float3 direction = normalize(g_CameraRight * ndc.x + g_CameraUp * ndc.y + g_CameraForward);
		  
		      RayDesc ray;
		      ray.Origin    = origin;
		      ray.Direction = direction;
		      ray.TMin      = 0.001f;
		      ray.TMax      = 10000.0f;
		  
		      RayPayload payload = { float4(0,0,0,0), 0 };
		  
		      TraceRay(g_Scene,
		               RAY_FLAG_NONE,
		               0xFF,          // Instance mask
		               0,             // Hit group index
		               1,             // Multiplier for geometry contribution
		               0,             // Miss shader index
		               ray,
		               payload);
		  
		      g_Output[pixel] = payload.color;
		  }
		  
		  [shader("miss")]
		  void Miss(inout RayPayload payload) {
		      // Sky gradient
		      float t = 0.5f * (WorldRayDirection().y + 1.0f);
		      payload.color = lerp(float4(1, 1, 1, 1), float4(0.3f, 0.5f, 1, 1), t);
		  }
		  
		  [shader("closesthit")]
		  void ClosestHit(inout RayPayload payload, in BuiltInTriangleIntersectionAttributes attr) {
		      // Interpolate hit normal using barycentric coordinates
		      float3 bary   = float3(1 - attr.barycentrics.x - attr.barycentrics.y,
		                             attr.barycentrics.x, attr.barycentrics.y);
		      float3 normal = /* fetch from vertex buffer */ float3(0, 1, 0);
		  
		      // Simple diffuse
		      float ndotl = saturate(dot(normal, normalize(float3(1, 1, -1))));
		      payload.color = float4(ndotl, ndotl, ndotl, 1);
		  }
		  ```

- # 14 — Mesh Shaders
  collapsed:: true
	- ## What Are Mesh Shaders?
	  collapsed:: true
		- Mesh Shaders replace the entire Vertex → Tessellation → Geometry pipeline with a compute-like two-stage process. They were designed to solve GPU vertex processing inefficiencies.
		-
		  | Stage | Role | Analogy |
		  |---|---|---|
		  | **Amplification Shader (AS)** | Runs first. For each meshlet, decides: render or cull? If render, spawns Mesh Shader threads. | The manager who checks: "which chunks are visible?" |
		  | **Mesh Shader (MS)** | Processes one meshlet. Outputs vertices and primitives. | The worker who actually converts a chunk to triangles. |
		- **Meshlet:** A cluster of ~64-128 triangles from a mesh. Meshlets have pre-computed normals and cones for fast culling.
		- ```hlsl
		  // mesh_shader.hlsl
		  
		  struct MeshletOut {
		      float4 position : SV_POSITION;
		      float3 normal   : NORMAL;
		      float2 uv       : TEXCOORD0;
		  };
		  
		  // Meshlet data uploaded by CPU
		  StructuredBuffer<Meshlet>    g_Meshlets    : register(t0);
		  StructuredBuffer<float4>     g_Positions   : register(t1);
		  StructuredBuffer<uint>       g_Indices     : register(t2);
		  
		  // Each mesh shader thread group processes ONE meshlet
		  [NumThreads(128, 1, 1)]
		  [OutputTopology("triangle")]
		  void MSMain(
		      uint groupThreadID  : SV_GroupThreadID,
		      uint groupID        : SV_GroupID,
		      in  payload MeshletPayload payload,
		      out vertices MeshletOut    outVerts[128],
		      out indices  uint3         outPrims[256])
		  {
		      Meshlet m = g_Meshlets[groupID];
		  
		      SetMeshOutputCounts(m.VertCount, m.PrimCount);
		  
		      if (groupThreadID < m.VertCount) {
		          uint vi = m.VertOffset + groupThreadID;
		          outVerts[groupThreadID].position = mul(g_MVP, g_Positions[vi]);
		          // ... fill other attributes
		      }
		      if (groupThreadID < m.PrimCount) {
		          uint pi = m.PrimOffset + groupThreadID;
		          outPrims[groupThreadID] = uint3(g_Indices[pi*3], g_Indices[pi*3+1], g_Indices[pi*3+2]);
		      }
		  }
		  ```

- # 15 — Performance and Debugging
  collapsed:: true
	- ## Performance Best Practices
	  collapsed:: true
		-
		  | Practice | Why it Matters |
		  |---|---|
		  | **Cache PSOs to disk** (`ID3D12PipelineLibrary`) | Loading a game with 10,000 PSOs? Cache to disk so compile only happens once. |
		  | **Use Root Constants for hot data** | Zero CPU overhead — 12 DWORDs written directly into the command stream. |
		  | **Bucket resources by update frequency** | Frequent: per-draw → Push Constants. Per-frame: → Root Descriptor. Rare: → Descriptor Table |
		  | **Multi-thread command recording** | Frame 1 → thread 1 records geometry. Thread 2 records shadows. Merge before submit. |
		  | **Indirect Draw** (`ExecuteIndirect`) | GPU fills the draw arguments. Zero CPU-side draw call loop needed. |
		  | **Use the enhanced barriers API (D3D12 Agility SDK)** | `D3D12_BARRIER` (new) has less overhead and more precision than `ResourceBarrier()` |

	- ## Debugging Tools
	  collapsed:: true
		-
		  | Tool | What it Does |
		  |---|---|
		  | **PIX for Windows** | Microsoft's official D3D12 frame debugger. Shows every resource, barrier, and shader in real time. |
		  | **RenderDoc** | Cross-platform frame capture. Works on D3D12 too. |
		  | **NVIDIA Nsight** | GPU perf counters, shader occupancy, memory bandwidth |
		  | **D3D12 Debug Layer** | API misuse detection. Always enable in development! |
		  | **GPU-Based Validation (GBV)** | Detects GPU-timeline errors like OOB reads — much slower but catches hard bugs |

- # 16 — Complete Object Reference
  collapsed:: true
	- ## Every D3D12 Object Explained
	  collapsed:: true
		-
		  | D3D12 Object | Category | What It Does |
		  |---|---|---|
		  | `ID3D12Device` | Core | The logical GPU. Create all other objects from here. |
		  | `IDXGIAdapter4` | DXGI | Physical GPU representation. Enumerated via factory. |
		  | `IDXGIFactory6` | DXGI | Factory for adapters and swapchains. |
		  | `IDXGISwapChain4` | Presentation | Array of back buffers to flip to the monitor. |
		  | `ID3D12CommandQueue` | Execution | Submit command lists. One per queue type (Graphics, Compute, Copy). |
		  | `ID3D12CommandAllocator` | Execution | Raw memory backing a command list. One per thread per frame. |
		  | `ID3D12GraphicsCommandList6` | Execution | Record draw/copy/barrier commands here. |
		  | `ID3D12Resource` | Memory | A buffer OR texture — same type! Distinguished by description. |
		  | `ID3D12DescriptorHeap` | Binding | Array of descriptors (SRV/CBV/UAV/RTV/DSV). |
		  | `ID3D12RootSignature` | Binding | Schema: what data types live at which root parameter slots. |
		  | `ID3D12PipelineState` | Pipeline | Immutable: shaders + depth + blend + rasterizer + input layout. |
		  | `ID3D12Fence` | Sync | Signal from GPU → waited on by CPU or another queue. |
		  | `ID3D12StateObject` | Ray Tracing | Ray tracing pipeline object (replaces PSO for RT). |
		  | `ID3D12StateObjectProperties` | Ray Tracing | Query shader identifiers from a state object. |

- # 🔗 Related Pages
	- [[Advanced Graphics]] — GPU architecture and API comparisons.
	- [[Vulkan]] — Vulkan equivalent for every DX12 concept.
	- [[Shader Programming]] — Deep dive into HLSL, semantics, and advanced shader techniques.
	- [[Unreal Engine]] — UE5 uses DX12 as its primary Windows renderer (Nanite uses Mesh Shaders).
	- [[C++]] — COM patterns, RAII, and smart pointers needed for clean DX12 code.

- # More Learn — Free Resources
	- [Microsoft DX12 Programming Guide](https://learn.microsoft.com/en-us/windows/win32/direct3d12/directx-12-programming-guide) - Official reference.
	- [Frank Luna's "3D Game Programming with DX12"](https://d3dcoder.net/) - The essential beginner book.
	- [DirectX-Graphics-Samples (GitHub)](https://github.com/microsoft/DirectX-Graphics-Samples) - Microsoft's D3D12 sample programs.
	- [PIX for Windows (Free)](https://devblogs.microsoft.com/pix/) - Frame capture and GPU profiler.
	- [DXR Tutorial](https://developer.nvidia.com/rtx/raytracing/dxr/dx12-raytracing-tutorial-part-1) - NVIDIA's official DXR walkthrough.
	- [D3D12 Mesh Shader Samples](https://github.com/microsoft/DirectX-Graphics-Samples/tree/master/Samples/Desktop/D3D12MeshShaders) - Mesh shader example project.
