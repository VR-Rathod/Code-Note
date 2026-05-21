- ---
  seoTitle: Apple Metal API Complete Guide – Zero to Ray Tracing
  description: "The definitive Metal API reference. Covers MTLDevice, MSL shaders, Argument Buffers, Apple Silicon memory, Metal Performance Shaders, and Metal Ray Tracing from beginner to advanced."
  keywords: "apple metal, metal api, msl, metal shading language, argument buffers, metal ray tracing, ios game, macos graphics, swift metal, objective-c metal, apple silicon, vr-rathod"
  displayTitle: Metal
- ---
  
  tags:: index, graphics-programming, advanced-graphics, swift, macos, ios
  title:: Metal
- # Apple Metal — The Roadmap
  collapsed:: true
	- > [!info] What is Metal?
	  > Metal is Apple's explicit, low-overhead graphics and compute API for all Apple platforms: macOS, iOS, iPadOS, tvOS, and visionOS. It was introduced in 2014 — before Vulkan or DX12 — making it the first truly "modern" explicit GPU API.
	  >
	  > Metal is REQUIRED for any serious graphics application on Apple platforms. OpenGL is deprecated on macOS (since 10.14 Mojave) and removed from iOS.
	  >
	  > **Build order:**
	  > ```
	  > MTLDevice → MTLCommandQueue → MTLLibrary (shaders)
	  >   → MTLRenderPipelineState → MTLBuffer / MTLTexture
	  >   → MTLCommandBuffer → Render/Compute Encoders → [Advanced Topics]
	  > ```
	- ## Metal vs Vulkan vs D3D12
		- | Concept | Vulkan | DirectX 12 | Metal |
		  |---|---|---|---|
		  | GPU handle | `VkDevice` | `ID3D12Device` | `MTLDevice` |
		  | Submission queue | `VkQueue` | `ID3D12CommandQueue` | `MTLCommandQueue` |
		  | Commands recorded here | `VkCommandBuffer` | `ID3D12GraphicsCommandList` | `MTLCommandBuffer` + Encoder |
		  | Shader bindings schema | `VkDescriptorSetLayout` | Root Signature | `MTLArgumentEncoder` / implicit |
		  | Baked pipeline | `VkPipeline` | `ID3D12PipelineState` | `MTLRenderPipelineState` |
		  | CPU-GPU sync | `VkFence` | `ID3D12Fence` | `MTLFence` / `MTLEvent` |
		  | Memory | Explicit `vkAllocateMemory` | Explicit Heap Types | Mostly automatic (Storage Modes) |
		  | Shader language | GLSL → SPIR-V | HLSL → DXIL | MSL (C++14 based) |
		  | Cross-platform | Yes | Windows/Xbox only | Apple only |
		  | Difficulty | Very High | Very High | High (but friendlier) |
	-
	- ## Apple Silicon Unified Memory Architecture
		- This is the biggest difference between Metal and Vulkan/DX12. On Apple Silicon (M1, M2, M3, M4):
		- ```mermaid
		  graph TD
		      DGB["Discrete GPU (NVIDIA/AMD)\nCPU RAM and GPU VRAM are SEPARATE\nYou must copy data across PCIe bus"]
		      UMA["Apple Silicon Unified Memory\nCPU and GPU SHARE THE SAME physical memory\nNo copy needed — just change permissions"]
		  
		      DGB -.->|"memcpy via PCIe (slow)"| DGB
		      UMA -->|"Zero copy! Same RAM"| UMA
		  ```
		- Unified Memory means textures and buffers created with `Shared` mode are instantly accessible by both CPU and GPU — no staging buffers needed on Apple Silicon for most use cases!
-
- # MTLDevice (The GPU)
  collapsed:: true
	- ## Getting the Device
		- ```swift
		  // Swift: Get the default system GPU
		  import Metal
		  import MetalKit
		  
		  guard let device = MTLCreateSystemDefaultDevice() else {
		      fatalError("Metal not supported on this device!")
		  }
		  
		  // Query GPU capabilities
		  print("GPU: \(device.name)")
		  print("Is Apple Silicon: \(device.hasUnifiedMemory)")
		  print("Max threads per threadgroup: \(device.maxThreadsPerThreadgroup)")
		  print("Supports ray tracing: \(device.supportsRaytracing)")
		  print("Max shader buffer size: \(device.maxBufferLength / (1024*1024)) MB")
		  print("Supports mesh shaders: \(device.supportsMeshShaders)")
		  ```
		- ```objc
		  // Objective-C:
		  id<MTLDevice> device = MTLCreateSystemDefaultDevice();
		  ```
		- ```cpp
		  // C++: Using Metal-cpp (Apple's official C++ wrapper)
		  #include <Metal/Metal.hpp>
		  MTL::Device* device = MTL::CreateSystemDefaultDevice();
		  ```
	- ## Enumerating All GPUs (macOS)
	  collapsed:: true
		- ```swift
		  // On macOS, a machine may have multiple GPUs (integrated + discrete)
		  let allDevices = MTLCopyAllDevices()
		  
		  for device in allDevices {
		      print("Device: \(device.name)")
		      print("  - Is Low Power (Integrated): \(device.isLowPower)")
		      print("  - Is Headless: \(device.isHeadless)")
		      print("  - Is Removable: \(device.isRemovable)")
		      print("  - Recommended Max Working Set: \(device.recommendedMaxWorkingSetSize / (1024*1024)) MB")
		  }
		  ```
-
- # MTLCommandQueue and the Command System
	- ## The Metal Command Flow
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Q["MTLCommandQueue\nSubmission queue for the GPU\nCreate once, keep alive forever"]
		      CB["MTLCommandBuffer\nCreated from queue each frame\nHolds a sequence of encoded commands"]
		      subgraph Encoders["Encoders (pick one per scope)"]
		          RE["MTLRenderCommandEncoder\nEncode draw calls, set pipeline, bind buffers"]
		          CE["MTLComputeCommandEncoder\nEncode compute dispatches"]
		          BE["MTLBlitCommandEncoder\nEncode memory copies"]
		          AE["MTLAccelerationStructureCommandEncoder\nBuild BVH for ray tracing"]
		      end
		  
		      Q -->|"makeCommandBuffer()"| CB
		      CB --> Encoders
		      CB -->|"commit()"| GPU["🎮 GPU executes"]
		  ```
	- ## Creating and Using the Command Queue
	  collapsed:: true
		- ```swift
		  // Create the queue — one queue per "stream of work"
		  guard let commandQueue = device.makeCommandQueue() else {
		      fatalError("Could not create command queue")
		  }
		  
		  // Optional: label for debugging in Xcode GPU Debugger
		  commandQueue.label = "Main Render Queue"
		  
		  // ---- Per Frame ----
		  guard let commandBuffer = commandQueue.makeCommandBuffer() else { return }
		  commandBuffer.label = "Frame \(frameNumber) Command Buffer"
		  
		  // Add completion handler (callback when GPU finishes)
		  commandBuffer.addCompletedHandler { [weak self] buffer in
		      if buffer.status == .error {
		          print("GPU Error: \(String(describing: buffer.error))")
		      }
		      self?.frameFinished() // Unblock CPU for next frame
		  }
		  ```
-
- # Metal Shading Language (MSL)
  collapsed:: true
	- ## MSL is C++14
	  collapsed:: true
		- Unlike GLSL or HLSL, MSL is properly based on **C++14** extended with GPU-specific keywords. This means:
		- ```
		  ✔ Real C++ structs, templates, functions, namespaces
		  ✔ Pointers in shaders (unique to Metal!)
		  ✔ References (const T& params)
		  ✔ Single header shared between CPU and GPU code
		  ✔ No need to re-declare structs — one definition for both
		  ```
	- ## Shared CPU/GPU Header Pattern
	  collapsed:: true
		- ```cpp
		  // SharedTypes.h — included in both C++ and .metal files!
		  struct VertexData {
		      simd_float3 position;
		      simd_float3 normal;
		      simd_float2 texCoord;
		  };
		  
		  struct PerFrameUniforms {
		      simd_float4x4 modelMatrix;
		      simd_float4x4 viewProjectionMatrix;
		      simd_float3   cameraPosition;
		      float         time;
		  };
		  ```
	- ## Vertex Shader (MSL)
	  collapsed:: true
		- ```metal
		  // Shaders.metal
		  #include <metal_stdlib>
		  #include "SharedTypes.h"   // Shared with CPU!
		  using namespace metal;
		  
		  // Vertex shader output → fragment shader input
		  struct RasterizerData {
		      float4 position  [[position]]; // [[position]] = built-in clip-space position
		      float3 worldPos;
		      float3 normal;
		      float2 texCoord;
		  };
		  
		  // Metal attributes explain how data is bound:
		  //  [[stage_in]]   = vertex data from vertex buffer (assembled by Metal)
		  //  [[buffer(N)]]  = bound via setVertexBuffer(_, offset:, index:)
		  //  [[texture(N)]] = bound via setVertexTexture(_, index:)
		  
		  vertex RasterizerData vertexShader(
		      const device VertexData* vertices [[buffer(0)]],       // Vertex buffer
		      constant PerFrameUniforms& uniforms [[buffer(1)]],     // Uniform buffer
		      uint vertexID [[vertex_id]])                           // Built-in: which vertex
		  {
		      VertexData v = vertices[vertexID];
		  
		      float4 worldPos = uniforms.modelMatrix * float4(v.position, 1.0);
		  
		      RasterizerData out;
		      out.position  = uniforms.viewProjectionMatrix * worldPos;
		      out.worldPos  = worldPos.xyz;
		      out.normal    = (uniforms.modelMatrix * float4(v.normal, 0.0)).xyz;
		      out.texCoord  = v.texCoord;
		      return out;
		  }
		  ```
	- ## Fragment Shader (MSL)
	  collapsed:: true
		- ```metal
		  fragment float4 fragmentShader(
		      RasterizerData in           [[stage_in]],
		      constant PerFrameUniforms&  uniforms     [[buffer(1)]],
		      texture2d<float>            albedoTex    [[texture(0)]],
		      texture2d<float>            normalTex    [[texture(1)]],
		      sampler                     texSampler   [[sampler(0)]])
		  {
		      float4 albedo = albedoTex.sample(texSampler, in.texCoord);
		  
		      // Normal from normal map (TBN space)
		      float3 normal = normalize(in.normal);
		  
		      // Lambert diffuse + Blinn-Phong specular
		      float3 lightDir  = normalize(float3(1, 2, -1));
		      float3 viewDir   = normalize(uniforms.cameraPosition - in.worldPos);
		      float3 halfDir   = normalize(lightDir + viewDir);
		  
		      float  diffuse   = max(dot(normal, lightDir), 0.0f);
		      float  specular  = pow(max(dot(normal, halfDir), 0.0f), 32.0f);
		  
		      float3 result = albedo.rgb * (diffuse + 0.1f) + float3(0.3f) * specular;
		      return float4(result, albedo.a);
		  }
		  ```
	- ## Compute Shader (MSL)
	  collapsed:: true
		- ```metal
		  // Compute kernel — no vertex/fragment pipeline
		  struct Particle {
		      float2 position;
		      float2 velocity;
		      float  lifetime;
		  };
		  
		  // [[thread_position_in_grid]] = global thread ID (like gl_GlobalInvocationID)
		  kernel void updateParticles(
		      device   Particle* particles [[buffer(0)]],
		      constant float&    deltaTime [[buffer(1)]],
		      uint     threadID            [[thread_position_in_grid]])
		  {
		      Particle p = particles[threadID];
		  
		      p.velocity.y -= 9.8f * deltaTime; // Gravity
		      p.position   += p.velocity * deltaTime;
		      p.lifetime   -= deltaTime;
		  
		      if (p.lifetime <= 0.0f) {
		          p.position = float2(0, 0);
		          p.velocity = float2(0, 5.0f);
		          p.lifetime = 2.0f;
		      }
		  
		      particles[threadID] = p;
		  }
		  ```
-
- # MTLLibrary and Compiling Shaders
  collapsed:: true
	- ## Shader Compilation
	  collapsed:: true
		- ```swift
		  // Method 1: Load from the default library (pre-compiled at build time)
		  // Xcode automatically compiles .metal files into the .metallib bundle resource
		  guard let library = device.makeDefaultLibrary() else {
		      fatalError("Could not load Metal library")
		  }
		  
		  // Method 2: Compile at runtime from source string
		  let shaderSource = """
		  #include <metal_stdlib>
		  using namespace metal;
		  
		  kernel void myCompute(device float* data [[buffer(0)]], uint id [[thread_position_in_grid]]) {
		      data[id] *= 2.0f;
		  }
		  """
		  let runtimeLib = try! device.makeLibrary(source: shaderSource, options: nil)
		  
		  // Method 3: Load a pre-compiled .metallib file
		  let libURL = Bundle.main.url(forResource: "default", withExtension: "metallib")!
		  let fileLib = try! device.makeLibrary(URL: libURL)
		  
		  // Get function handles from library
		  guard let vertexFunction   = library.makeFunction(name: "vertexShader"),
		        let fragmentFunction = library.makeFunction(name: "fragmentShader"),
		        let kernelFunction   = library.makeFunction(name: "updateParticles") else {
		      fatalError("Could not find shader functions")
		  }
		  ```
-
- # Buffers and Memory
  collapsed:: true
	- ## Metal Storage Modes
	  collapsed:: true
		- Metal's memory model is simpler than Vulkan because Apple Silicon has unified memory. You choose a Storage Mode per buffer/texture.
		- | Storage Mode | CPU | GPU | When to Use |
		  |---|---|---|---|
		  | `.shared` | Read/Write | Read/Write | Per-frame uniform data, small dynamic buffers |
		  | `.private` | No access | Read/Write (fast) | Static meshes, textures, render targets |
		  | `.managed` | Read/Write (manual sync required) | Read/Write | macOS only with dedicated GPU |
		  | `.memoryless` | No | Tile memory only | Depth buffer used only within one render pass |
	- ## Creating Buffers
	  collapsed:: true
		- ```swift
		  // Shared buffer (both CPU and GPU can access)
		  // Perfect for uniforms that change every frame
		  let uniformBuffer = device.makeBuffer(length: MemoryLayout<PerFrameUniforms>.size,
		                                        options: .storageModeShared)!
		  uniformBuffer.label = "Per-Frame Uniforms"
		  
		  // Access buffer as typed pointer from CPU
		  let uniformPtr = uniformBuffer.contents().bindMemory(to: PerFrameUniforms.self, capacity: 1)
		  uniformPtr.pointee.modelMatrix = matrix_identity_float4x4
		  uniformPtr.pointee.time        = Float(currentTime)
		  // No flush needed for .shared mode!
		  
		  // Private buffer (GPU-only, fastest for static geometry)
		  let vertices: [VertexData] = loadMeshVertices()
		  let vertexBuffer = device.makeBuffer(bytes: vertices,
		                                       length: MemoryLayout<VertexData>.stride * vertices.count,
		                                       options: .storageModePrivate)!
		  vertexBuffer.label = "Mesh Vertex Buffer"
		  
		  // Triple buffering: 3 uniform buffers, rotate each frame
		  let maxFramesInFlight = 3
		  var uniformBuffers = (0..<maxFramesInFlight).map { i -> MTLBuffer in
		      let buf = device.makeBuffer(length: MemoryLayout<PerFrameUniforms>.size,
		                                  options: .storageModeShared)!
		      buf.label = "Uniform Buffer \(i)"
		      return buf
		  }
		  ```
-
- # Textures
  collapsed:: true
	- ## Creating a 2D Texture
	  collapsed:: true
		- ```swift
		  // Describe the texture
		  let texDescriptor = MTLTextureDescriptor.texture2DDescriptor(
		      pixelFormat: .rgba8Unorm_srgb, // 8-bit sRGB color
		      width:       1024,
		      height:      1024,
		      mipmapped:   true              // Generate mips for distance filtering
		  )
		  texDescriptor.usage        = [.shaderRead]
		  texDescriptor.storageMode  = .private           // GPU-only (fast!)
		  texDescriptor.textureType  = .type2D
		  texDescriptor.mipmapLevelCount = Int(log2(Double(max(1024, 1024)))) + 1
		  
		  guard let texture = device.makeTexture(descriptor: texDescriptor) else { return }
		  texture.label = "Albedo Texture"
		  
		  // Upload data to private texture via a blit command
		  // (Private GPU memory requires a blit encoder copy from CPU-visible staging)
		  let region = MTLRegionMake2D(0, 0, 1024, 1024)
		  let stagingBuffer = device.makeBuffer(bytes: pixelData,
		                                         length: 1024 * 1024 * 4,
		                                         options: .storageModeShared)!
		  
		  let blitCommandBuffer = commandQueue.makeCommandBuffer()!
		  let blitEncoder       = blitCommandBuffer.makeBlitCommandEncoder()!
		  blitEncoder.copy(from: stagingBuffer, sourceOffset: 0,
		                   sourceBytesPerRow: 1024 * 4, sourceBytesPerImage: 1024 * 1024 * 4,
		                   sourceSize: MTLSizeMake(1024, 1024, 1),
		                   to: texture, destinationSlice: 0, destinationLevel: 0,
		                   destinationOrigin: MTLOriginMake(0, 0, 0))
		  blitEncoder.generateMipmaps(for: texture)
		  blitEncoder.endEncoding()
		  blitCommandBuffer.commit()
		  ```
	- ## Using MTKTextureLoader (The Easy Way)
	  collapsed:: true
		- ```swift
		  import MetalKit
		  
		  // Load a PNG/JPG directly — MTKTextureLoader handles everything
		  let textureLoader = MTKTextureLoader(device: device)
		  
		  let textureOptions: [MTKTextureLoader.Option: Any] = [
		      .textureUsage:           MTLTextureUsage.shaderRead.rawValue,
		      .textureStorageMode:     MTLStorageMode.private.rawValue,
		      .generateMipmaps:        true,
		      .SRGB:                   true
		  ]
		  
		  let texture = try! textureLoader.newTexture(name: "player_texture",
		                                              scaleFactor: 1.0,
		                                              bundle: .main,
		                                              options: textureOptions)
		  ```
-
- # Render Pipeline State
  collapsed:: true
	- ## Build the Immutable Pipeline
	  collapsed:: true
		- ```swift
		  // Describe the pipeline
		  let pipelineDescriptor = MTLRenderPipelineDescriptor()
		  pipelineDescriptor.label               = "Main Render Pipeline"
		  pipelineDescriptor.vertexFunction      = vertexFunction
		  pipelineDescriptor.fragmentFunction    = fragmentFunction
		  
		  // Render target format (must match the MTKView or render pass descriptor)
		  pipelineDescriptor.colorAttachments[0].pixelFormat = .bgra8Unorm_srgb
		  
		  // Enable alpha blending for transparency
		  pipelineDescriptor.colorAttachments[0].isBlendingEnabled             = true
		  pipelineDescriptor.colorAttachments[0].sourceRGBBlendFactor          = .sourceAlpha
		  pipelineDescriptor.colorAttachments[0].destinationRGBBlendFactor     = .oneMinusSourceAlpha
		  pipelineDescriptor.colorAttachments[0].rgbBlendOperation             = .add
		  pipelineDescriptor.colorAttachments[0].sourceAlphaBlendFactor        = .sourceAlpha
		  pipelineDescriptor.colorAttachments[0].destinationAlphaBlendFactor   = .oneMinusSourceAlpha
		  
		  // Depth buffer format
		  pipelineDescriptor.depthAttachmentPixelFormat = .depth32Float
		  
		  // Describe vertex layout (alternative to [[vertex_id]] approach)
		  let vertexDescriptor = MTLVertexDescriptor()
		  vertexDescriptor.attributes[0].format      = .float3   // position
		  vertexDescriptor.attributes[0].offset      = 0
		  vertexDescriptor.attributes[0].bufferIndex = 0
		  vertexDescriptor.attributes[1].format      = .float3   // normal
		  vertexDescriptor.attributes[1].offset      = 12
		  vertexDescriptor.attributes[1].bufferIndex = 0
		  vertexDescriptor.attributes[2].format      = .float2   // texCoord
		  vertexDescriptor.attributes[2].offset      = 24
		  vertexDescriptor.attributes[2].bufferIndex = 0
		  vertexDescriptor.layouts[0].stride         = MemoryLayout<VertexData>.stride
		  
		  pipelineDescriptor.vertexDescriptor = vertexDescriptor
		  
		  // Compile the pipeline (this is expensive — do it at load time!)
		  let renderPipeline = try! device.makeRenderPipelineState(descriptor: pipelineDescriptor)
		  
		  // Depth state (separate from pipeline in Metal)
		  let depthDescriptor = MTLDepthStencilDescriptor()
		  depthDescriptor.depthCompareFunction = .less
		  depthDescriptor.isDepthWriteEnabled  = true
		  let depthState = device.makeDepthStencilState(descriptor: depthDescriptor)!
		  ```
-
- # The Complete Render Frame
  collapsed:: true
	- ## IntegratIng with MTKView
	  collapsed:: true
		- ```swift
		  // MTKViewDelegate — Metal's equivalent of a "game loop" callback
		  class Renderer: NSObject, MTKViewDelegate {
		      
		      let device: MTLDevice
		      let commandQueue: MTLCommandQueue
		      let renderPipeline: MTLRenderPipelineState
		      let depthState: MTLDepthStencilState
		      
		      // Triple buffering semaphore: max 3 frames in flight
		      let frameSemaphore = DispatchSemaphore(value: 3)
		      var currentBufferIndex = 0
		      
		      func draw(in view: MTKView) {
		          // Block CPU if GPU is 3 frames behind
		          frameSemaphore.wait()
		          
		          guard let commandBuffer = commandQueue.makeCommandBuffer() else { return }
		          commandBuffer.label = "Main Command Buffer"
		          
		          // Signal semaphore when GPU finishes this frame
		          commandBuffer.addCompletedHandler { [weak self] _ in
		              self?.frameSemaphore.signal()
		          }
		          
		          // Update the current frame's uniform buffer (CPU writes, GPU reads)
		          updateUniforms(frameIndex: currentBufferIndex)
		          
		          // Get the render pass descriptor from MTKView (clears screen, sets render target)
		          guard let renderPassDescriptor = view.currentRenderPassDescriptor else { return }
		          renderPassDescriptor.colorAttachments[0].clearColor  = MTLClearColor(red: 0.05, green: 0.05, blue: 0.1, alpha: 1.0)
		          renderPassDescriptor.colorAttachments[0].loadAction  = .clear
		          renderPassDescriptor.colorAttachments[0].storeAction = .store
		          
		          guard let renderEncoder = commandBuffer.makeRenderCommandEncoder(descriptor: renderPassDescriptor) else { return }
		          renderEncoder.label = "Main Render Encoder"
		          
		          // === Bind everything ===
		          renderEncoder.setRenderPipelineState(renderPipeline)
		          renderEncoder.setDepthStencilState(depthState)
		          renderEncoder.setCullMode(.back)
		          renderEncoder.setFrontFacing(.counterClockwise)
		  
		          // Buffer bindings match [[buffer(N)]] in .metal shader
		          renderEncoder.setVertexBuffer(vertexBuffer,                    offset: 0, index: 0)
		          renderEncoder.setVertexBuffer(uniformBuffers[currentBufferIndex], offset: 0, index: 1)
		          renderEncoder.setFragmentBuffer(uniformBuffers[currentBufferIndex], offset: 0, index: 1)
		          
		          // Texture bindings match [[texture(N)]] in .metal shader
		          renderEncoder.setFragmentTexture(albedoTexture, index: 0)
		          renderEncoder.setFragmentTexture(normalTexture,  index: 1)
		          
		          // Sampler binding matches [[sampler(N)]] in .metal shader
		          renderEncoder.setFragmentSamplerState(linearSampler, index: 0)
		          
		          // === Draw ===
		          renderEncoder.drawIndexedPrimitives(
		              type:              .triangle,
		              indexCount:        indexCount,
		              indexType:         .uint32,
		              indexBuffer:       indexBuffer,
		              indexBufferOffset: 0
		          )
		          
		          renderEncoder.endEncoding()
		          
		          // Present to screen
		          commandBuffer.present(view.currentDrawable!)
		          commandBuffer.commit()
		          
		          currentBufferIndex = (currentBufferIndex + 1) % 3
		      }
		      
		      func mtkView(_ view: MTKView, drawableSizeWillChange size: CGSize) {
		          // Handle window resize
		      }
		  }
		  ```
-
- # Synchronization
  collapsed:: true
	- ## Semaphores, Events, and Fences
		- | Primitive | Scope | Use Case |
		  |---|---|---|
		  | **`DispatchSemaphore`** | CPU–GPU | Block CPU from getting more than N frames ahead of GPU |
		  | **`MTLFence`** | Within command buffer | Order work within one encoder (e.g., compute before render) |
		  | **`MTLEvent`** | Between command buffers on same queue | One command buffer signals, the next waits |
		  | **`MTLSharedEvent`** | Cross-queue or CPU–GPU | Synchronize across different GPU streams or with CPU |
		-
		- ```swift
		  // Example: MTLEvent to sync compute output → render input
		  let syncEvent = device.makeEvent()!
		  var signalValue: UInt64 = 0
		  
		  // Command buffer 1: Compute Pass
		  let computeBuffer = commandQueue.makeCommandBuffer()!
		  let computeEncoder = computeBuffer.makeComputeCommandEncoder()!
		  computeEncoder.setComputePipelineState(computePipeline)
		  computeEncoder.setBuffer(particleBuffer, offset: 0, index: 0)
		  computeEncoder.dispatchThreads(MTLSizeMake(particleCount, 1, 1),
		                                  threadsPerThreadgroup: MTLSizeMake(64, 1, 1))
		  computeEncoder.endEncoding()
		  
		  signalValue += 1
		  computeBuffer.encodeSignalEvent(syncEvent, value: signalValue) // Signal when done
		  computeBuffer.commit()
		  
		  // Command buffer 2: Render Pass — wait for compute to be done
		  let renderBuffer = commandQueue.makeCommandBuffer()!
		  renderBuffer.encodeWaitForEvent(syncEvent, value: signalValue) // Wait here
		  let renderEncoder = renderBuffer.makeRenderCommandEncoder(descriptor: rpd)!
		  // ... render particles ...
		  ```
-
- # Argument Buffers (Bindless Textures)
  collapsed:: true
	- ## The Problem With Per-Draw Binding
	  collapsed:: true
		- Normal `setFragmentTexture(_, index:)` calls have overhead. For a scene with 10,000 objects using 5,000 unique textures, calling `setFragmentTexture` for each object is a CPU bottleneck.
		- **Argument Buffers** solve this: package many resources (textures, samplers, buffers) into a single buffer. The shader picks which resource it needs using an index.
	- ## Creating an Argument Buffer
	  collapsed:: true
		- ```swift
		  // An Argument Buffer is described by a shader struct with resource bindings
		  // First, create an argument encoder from a shader function's argument
		  
		  // In the .metal shader:
		  // struct MaterialData {
		  //     texture2d<float> albedo    [[id(0)]];
		  //     texture2d<float> normalMap [[id(1)]];
		  //     float4           baseColor [[id(2)]];
		  // };
		  // fragment float4 fragShader(..., device MaterialData* materials [[buffer(3)]], uint materialID...)
		  
		  // The argument encoder knows the size and layout of MaterialData
		  let materialEncoder = fragmentFunction.makeArgumentEncoder(bufferIndex: 3)
		  
		  // Allocate an argument buffer to hold N materials
		  let materialCount = 500
		  let abLength = materialEncoder.encodedLength * materialCount
		  let argumentBuffer = device.makeBuffer(length: abLength, options: .storageModeShared)!
		  
		  // Fill each material slot
		  for i in 0..<materialCount {
		      materialEncoder.setArgumentBuffer(argumentBuffer, startOffset: 0, arrayElement: i)
		      materialEncoder.setTexture(allTextures[i * 2],     index: 0) // albedo
		      materialEncoder.setTexture(allTextures[i * 2 + 1], index: 1) // normal
		  }
		  
		  // At render time — ONE bind call instead of thousands!
		  renderEncoder.setFragmentBuffer(argumentBuffer, offset: 0, index: 3)
		  
		  // CRITICAL: Declare resource usage so Metal knows which textures are accessed
		  renderEncoder.useResources(allTextures, usage: .read, stages: .fragment)
		  ```
-
- # Compute Pipelines
  collapsed:: true
	- ## MTLComputePipelineState
	  collapsed:: true
		- ```swift
		  // Create compute pipeline
		  let computePipeline = try! device.makeComputePipelineState(function: kernelFunction)
		  
		  // Optimal thread group size: ask the pipeline
		  let maxTotalThreads   = computePipeline.maxTotalThreadsPerThreadgroup
		  let threadExecWidth   = computePipeline.threadExecutionWidth // Warp/SIMD width
		  
		  let optimalGroupSize  = MTLSizeMake(threadExecWidth, 1, 1)
		  let gridSize          = MTLSizeMake(particleCount, 1, 1)
		  
		  let computeEncoder = commandBuffer.makeComputeCommandEncoder()!
		  computeEncoder.label = "Particle Update"
		  computeEncoder.setComputePipelineState(computePipeline)
		  computeEncoder.setBuffer(particleBuffer, offset: 0, index: 0)
		  
		  var dt: Float = 0.016
		  computeEncoder.setBytes(&dt, length: MemoryLayout<Float>.size, index: 1)
		  
		  // dispatchThreads: Metal calculates workgroups automatically (Metal 2+)
		  computeEncoder.dispatchThreads(gridSize, threadsPerThreadgroup: optimalGroupSize)
		  computeEncoder.endEncoding()
		  ```
-
- # Metal Performance Shaders (MPS)
  collapsed:: true
	- ## What is MPS?
	  collapsed:: true
		- Metal Performance Shaders is Apple's library of highly-optimized GPU algorithms. Instead of writing your own, you call pre-built, Apple-tuned kernels for common operations.
		- ```swift
		  import MetalPerformanceShaders
		  
		  // ---- Image Blur (Gaussian 5x5) ----
		  let blur = MPSImageGaussianBlur(device: device, sigma: 5.0)
		  blur.encode(commandBuffer: commandBuffer,
		              sourceTexture: inputTexture,
		              destinationTexture: outputTexture)
		  
		  // ---- Matrix Multiply (GEMM) ----
		  // C = A × B
		  let matMul = MPSMatrixMultiplication(device: device,
		                                       transposeLeft: false, transposeRight: false,
		                                       resultRows:    M, resultColumns: N, interiorColumns: K,
		                                       alpha: 1.0, beta: 0.0)
		  matMul.encode(commandBuffer:   commandBuffer,
		                leftMatrix:      matrixA,
		                rightMatrix:     matrixB,
		                resultMatrix:    matrixC)
		  
		  // ---- Convolutional Neural Network (on-device inference!) ----
		  // MPS provides the full neural network stack:
		  // MPSNNGraph, MPSCNNConvolution, MPSCNNBatchNormalization, etc.
		  ```
-
- # Metal Ray Tracing
  collapsed:: true
	- ## Metal RT Overview
	  collapsed:: true
		- Metal Ray Tracing (Metal 2.3+, available on all Apple Silicon and AMD Navi GPUs) is uniquely flexible: you can use it from **compute shaders** without needing a dedicated "ray tracing pipeline". You just call `intersect()` from any kernel.
		- | Feature | Vulkan RT | DXR | Metal RT |
		  |---|---|---|---|
		  | Requires separate RT pipeline | Yes | Yes | **No** — works in compute shaders |
		  | Acceleration Structure Build | Complex C++/GLSL | Complex C++/HLSL | Swift + kernel |
		  | Shader binding table | Required | Required | **Not needed** |
		  | Custom intersection shapes | Intersection shader | Intersection shader | Custom intersection function |
	- ## Building an Acceleration Structure
	  collapsed:: true
		- ```swift
		  import MetalPerformanceShadersGraph // or just Metal
		  
		  // --- Create BLAS (per-mesh acceleration structure) ---
		  let geometryDesc = MTLAccelerationStructureTriangleGeometryDescriptor()
		  geometryDesc.vertexBuffer       = vertexBuffer
		  geometryDesc.vertexBufferOffset = 0
		  geometryDesc.vertexStride       = MemoryLayout<VertexData>.stride
		  geometryDesc.indexBuffer        = indexBuffer
		  geometryDesc.indexType          = .uint32
		  geometryDesc.triangleCount      = triangleCount
		  
		  let blasDescriptor = MTLPrimitiveAccelerationStructureDescriptor()
		  blasDescriptor.geometryDescriptors = [geometryDesc]
		  
		  // Query size requirements
		  let blasSizes = device.accelerationStructureSizes(descriptor: blasDescriptor)
		  
		  // Allocate acceleration structure
		  let blas = device.makeAccelerationStructure(size: blasSizes.accelerationStructureSize)!
		  let blasScratch = device.makeBuffer(length: blasSizes.buildScratchBufferSize,
		                                       options: .storageModePrivate)!
		  
		  // Build the BLAS on GPU
		  let accelCommandBuffer = commandQueue.makeCommandBuffer()!
		  let accelEncoder = accelCommandBuffer.makeAccelerationStructureCommandEncoder()!
		  accelEncoder.build(accelerationStructure: blas,
		                     descriptor: blasDescriptor,
		                     scratchBuffer: blasScratch, scratchBufferOffset: 0)
		  accelEncoder.endEncoding()
		  accelCommandBuffer.commit()
		  ```
	- ## Ray Tracing in a Compute Shader (MSL)
	  collapsed:: true
		- ```metal
		  // raytracer.metal
		  #include <metal_stdlib>
		  #include <metal_raytracing>
		  using namespace metal;
		  using namespace metal::raytracing;
		  
		  kernel void raytrace(
		      // The acceleration structure (TLAS)
		      instance_acceleration_structure   scene     [[buffer(0)]],
		      // Output image
		      texture2d<float, access::write>   output    [[buffer(1)]],
		      uint2                             pixelCoord [[thread_position_in_grid]])
		  {
		      // Create a ray from the camera
		      ray r;
		      r.origin        = float3(0, 0, -5);
		      r.direction     = normalize(float3(float2(pixelCoord) / 512.0f - 0.5f, 1));
		      r.min_distance  = 0.001f;
		      r.max_distance  = INFINITY;
		  
		      // Create the intersector — Metal handles BVH traversal internally
		      intersector<triangle_data> rtIntersector;
		      rtIntersector.force_opacity(opacity::opaque);
		  
		      // Trace the ray!
		      auto intersection = rtIntersector.intersect(r, scene);
		  
		      float4 color;
		      if (intersection.type == intersection_type::none) {
		          // Ray missed — sky color
		          float t = 0.5f * (r.direction.y + 1.0f);
		          color   = mix(float4(1,1,1,1), float4(0.3f, 0.5f, 1, 1), t);
		      } else {
		          // Ray hit — shade using barycentrics
		          float2 bary   = intersection.triangle_barycentric_coord;
		          float3 normal = float3(bary.x, bary.y, 1 - bary.x - bary.y);
		          color = float4(normal * 0.5f + 0.5f, 1.0f);
		      }
		  
		      output.write(color, pixelCoord);
		  }
		  ```
-
- # Metal Debugging Tools
  collapsed:: true
	- ## Xcode GPU Debugger
	  collapsed:: true
		- ```swift
		  // 1. Add labels everywhere (they appear in GPU Frame Capture!)
		  commandBuffer.label    = "Frame \(frameIndex)"
		  renderEncoder.label    = "Shadow Map Pass"
		  vertexBuffer.label     = "Mesh VBO"
		  albedoTexture.label    = "Player Albedo 1024"
		  
		  // 2. Use debug groups in encoders
		  renderEncoder.pushDebugGroup("Skybox")
		  renderEncoder.drawPrimitives(type: .triangle, vertexStart: 0, vertexCount: 36)
		  renderEncoder.popDebugGroup()
		  
		  renderEncoder.pushDebugGroup("Terrain Meshes")
		  for mesh in terrainMeshes {
		      renderEncoder.drawIndexedPrimitives(...)
		  }
		  renderEncoder.popDebugGroup()
		  ```
		- | Tool | How to Access | What it Shows |
		  |---|---|---|
		  | **Xcode GPU Frame Capture** | Debug → Capture GPU Frame | Every command, resource, shader, dependency |
		  | **Metal System Trace** | Instruments → Metal System Trace | CPU/GPU timeline, bottlenecks, stalls |
		  | **Shader Profiler** | Inside GPU Frame Capture | Per-line shader cost breakdown |
		  | **Memory Graph** | Debug → Memory Graph | All allocated GPU resources, their sizes |
-
- # Complete Object Reference
  collapsed:: true
	- ## Every Metal Object Explained
	  collapsed:: true
		- | Metal Object | Category | What It Does |
		  |---|---|---|
		  | `MTLDevice` | Core | Represents the GPU. The origin of all objects. |
		  | `MTLCommandQueue` | Execution | Ordered submission channel for command buffers. |
		  | `MTLCommandBuffer` | Execution | Holds encoded work for one frame / one pass. |
		  | `MTLRenderCommandEncoder` | Execution | Records draw calls, pipeline binds, buffer binds. |
		  | `MTLComputeCommandEncoder` | Execution | Records compute kernel dispatches. |
		  | `MTLBlitCommandEncoder` | Execution | Records memory copies from/to buffers and textures. |
		  | `MTLAccelerationStructureCommandEncoder` | RT | Builds BVH for ray tracing. |
		  | `MTLLibrary` | Shaders | Compiled .metal shader code bundle. |
		  | `MTLFunction` | Shaders | Handle to one shader function from a library. |
		  | `MTLRenderPipelineState` | Pipeline | Immutable: vertex + fragment shaders + blend/format config. |
		  | `MTLComputePipelineState` | Pipeline | Immutable: compute kernel config. |
		  | `MTLDepthStencilState` | Pipeline | Depth compare function + write mask. |
		  | `MTLBuffer` | Memory | Chunk of GPU/shared memory (vertex, index, uniform, SSBO). |
		  | `MTLTexture` | Memory | Image stored in GPU memory (2D, 3D, Cube, Array). |
		  | `MTLSamplerState` | Textures | Filtering type, address mode, anisotropy. |
		  | `MTLFence` | Sync | Intra-encoder synchronization (compute → render). |
		  | `MTLEvent` | Sync | Inter-command-buffer synchronization on same queue. |
		  | `MTLSharedEvent` | Sync | Cross-queue or CPU–GPU sync. |
		  | `MTLAccelerationStructure` | Ray Tracing | BVH over geometry (BLAS) or scene (TLAS). |
		  | `MTLArgumentEncoder` | Bindless | Encodes multiple resources into an Argument Buffer. |
-
- # More Learn — Free Resources
	- [Apple Metal Documentation](https://developer.apple.com/documentation/metal) - The official, comprehensive reference.
	- [Metal by Example](https://metalbyexample.com/) - Classic in-depth tutorials.
	- [WWDC Metal Sessions](https://developer.apple.com/videos/graphics-games/) - Apple engineers explain Metal internals every year.
	- [Metal Sample Code (Apple GitHub)](https://github.com/apple/sample-code) - Working code examples.
	- [Metal-cpp](https://developer.apple.com/metal/cpp/) - Apple's official C++ Metal wrapper.
	- [MPS Neural Network Docs](https://developer.apple.com/documentation/metalperformanceshaders) - On-device ML inference with Metal.