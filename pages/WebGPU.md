---
seoTitle: WebGPU Complete Guide – Modern GPU APIs for the Web
description: "The definitive WebGPU reference. Covers GPUDevice, pipelines, WGSL shaders, compute, storage buffers, and native desktop usage via Dawn and wgpu from beginner to expert."
keywords: "webgpu, wgsl, webgpu tutorial, gpudevice, compute shader web, webgpu vs webgl, dawn, wgpu, vr-rathod"
displayTitle: WebGPU — Complete Masterclass
---

tags:: index, graphics-programming, advanced-graphics, web-development, javascript
title:: WebGPU

- # WebGPU — The Complete Masterclass
  collapsed:: true
	- > [!info] What is WebGPU?
	  > WebGPU is the **next-generation web graphics API**, defined by the W3C and supported in Chrome, Firefox, and Safari. It exposes GPU hardware with a design inspired by Vulkan, Metal, and DirectX 12 — but from web code (JavaScript, TypeScript, or Rust/C++ via Dawn/wgpu).
	  >
	  > WebGPU is NOT just a "graphics" API. Its compute capabilities make it equally powerful for machine learning, physics simulation, and image processing.
	  >
	  > **Build order:**
	  > ```
	  > Adapter → Device → Queue → Buffers/Textures
	  >   → Shader Module (WGSL) → Pipeline → Bind Groups
	  >   → Command Encoder → Render/Compute Pass → Submit
	  > ```

	- ## WebGPU vs WebGL
	  collapsed:: true
		-
		  | Feature | WebGL 2 (OpenGL ES) | WebGPU (Vulkan/DX12/Metal) |
		  |---|---|---|
		  | Mental model | Global state machine | Explicit objects, no global state |
		  | Threading | Single-threaded | Workers + OffscreenCanvas |
		  | Compute shaders | None | Full compute pipeline |
		  | Explicit memory | No | Yes (mapped buffers) |
		  | Shader language | GLSL ES | WGSL (strongly typed) |
		  | Performance ceiling | Medium | Very High |
		  | Debugging | Limited | Error messages + validation + labels |
		  | Multi-draw indirect | No | Yes |
		  | Timestamp queries | No | Yes |
		  | Status | Legacy (works, no new features) | Active, rapidly expanding spec |

- # 1 — Initialization (Adapter → Device)
  collapsed:: true
	- ## The Initialization Chain
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Nav["navigator.gpu\nEntry point — the Vulkan Instance equivalent"]
		      Adapter["GPUAdapter\nRepresents a physical GPU (or software rasterizer)\nRequested with powerPreference"]
		      Device["GPUDevice\nYour logical connection to the GPU\nAll objects are created from here"]
		      Queue["GPUQueue\nSubmit command buffers here\nAlways exists as device.queue"]
		  
		      Nav -->|"requestAdapter()"| Adapter
		      Adapter -->|"requestDevice()"| Device
		      Device -->|"device.queue"| Queue
		  ```

	- ## Initialization Code
	  collapsed:: true
		- ```javascript
		  async function initWebGPU() {
		      // 1. Check browser support
		      if (!navigator.gpu) {
		          throw new Error("WebGPU is not supported in this browser.");
		      }
		  
		      // 2. Request an Adapter (Physical GPU)
		      const adapter = await navigator.gpu.requestAdapter({
		          powerPreference: "high-performance", // "low-power" for integrated GPU
		      });
		  
		      if (!adapter) throw new Error("No suitable GPU adapter found.");
		  
		      // 3. Inspect adapter capabilities
		      const adapterInfo = await adapter.requestAdapterInfo();
		      console.log("GPU Vendor:", adapterInfo.vendor);
		      console.log("GPU Architecture:", adapterInfo.architecture);
		      console.log("Max Texture Dimension:", adapter.limits.maxTextureDimension2D);
		      console.log("Max Buffer Size:", adapter.limits.maxBufferSize / (1024*1024), "MB");
		  
		      // 4. Request a Device (Logical GPU Connection)
		      const device = await adapter.requestDevice({
		          label: "My WebGPU Device",
		          requiredLimits: {
		              maxBufferSize:           512 * 1024 * 1024, // Request up to 512 MB buffers
		              maxStorageBufferBindingSize: 512 * 1024 * 1024,
		          },
		          requiredFeatures: [
		              // "texture-compression-bc",   // BC compressed textures (Desktop)
		              // "texture-compression-astc",  // ASTC compressed textures (Mobile)
		              // "rg11b10ufloat-renderable",  // HDR render targets
		              // "timestamp-query",           // GPU timing
		          ]
		      });
		  
		      // 5. Handle device loss (GPU reset, driver update, etc.)
		      device.lost.then((info) => {
		          console.error("WebGPU device was lost:", info.message);
		          if (info.reason !== "destroyed") {
		              initWebGPU(); // Attempt to reinitialize
		          }
		      });
		  
		      return { adapter, device };
		  }
		  ```

- # 2 — Canvas Configuration
  collapsed:: true
	- ## Connecting WebGPU to a Canvas
	  collapsed:: true
		- ```javascript
		  const canvas  = document.querySelector("canvas");
		  const context = canvas.getContext("webgpu");
		  
		  // Choose the best format for the screen (usually 'bgra8unorm' on desktop)
		  const preferredFormat = navigator.gpu.getPreferredCanvasFormat();
		  
		  context.configure({
		      device:    device,
		      format:    preferredFormat,          // Pixel format
		      alphaMode: "opaque",                 // No window transparency
		      usage:     GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
		  });
		  
		  // Each frame: get the texture to render into (equivalent of swapchain image acquire)
		  const currentTexture = context.getCurrentTexture();
		  const currentView    = currentTexture.createView();
		  ```

- # 3 — WGSL Shader Language
  collapsed:: true
	- ## WGSL — WebGPU Shading Language
	  collapsed:: true
		- WGSL is statically typed, Rust-like, and cross-compiles to SPIR-V (Linux), HLSL (Windows), and MSL (Mac) internally by the browser.
		-
		  | WGSL Type | Equivalent in GLSL | Description |
		  |---|---|---|
		  | `f32` | `float` | 32-bit float |
		  | `i32` | `int` | 32-bit signed int |
		  | `u32` | `uint` | 32-bit unsigned int |
		  | `vec2<f32>` | `vec2` | 2-component float vector |
		  | `vec3<f32>` | `vec3` | 3-component float vector |
		  | `vec4<f32>` | `vec4` | 4-component float vector |
		  | `mat4x4<f32>` | `mat4` | 4x4 float matrix |
		  | `array<f32, N>` | `float arr[N]` | Fixed-size array |
		  | `array<Vertex>` | SSBO array | Dynamic-size array (in storage buffer) |
		  | `bool` | `bool` | Boolean |

	- ## The Triangle Shader (WGSL)
	  collapsed:: true
		- ```wgsl
		  // Uniforms (Struct + binding)
		  struct Uniforms {
		      modelMatrix      : mat4x4<f32>,
		      viewProjMatrix   : mat4x4<f32>,
		      cameraPosition   : vec3<f32>,
		      time             : f32,
		  };
		  
		  @group(0) @binding(0) var<uniform> uniforms : Uniforms;
		  @group(0) @binding(1) var albedoTexture : texture_2d<f32>;
		  @group(0) @binding(2) var texSampler    : sampler;
		  
		  // Vertex → Fragment struct
		  struct VertexOutput {
		      @builtin(position) position : vec4<f32>,  // Required: clip-space position
		      @location(0) worldPos  : vec3<f32>,
		      @location(1) normal    : vec3<f32>,
		      @location(2) uv        : vec2<f32>,
		  };
		  
		  // Vertex shader — @vertex marks entry point
		  @vertex
		  fn vs_main(
		      @location(0) position : vec3<f32>,  // From vertex buffer attribute 0
		      @location(1) normal   : vec3<f32>,  // From vertex buffer attribute 1
		      @location(2) uv       : vec2<f32>,  // From vertex buffer attribute 2
		  ) -> VertexOutput {
		      var out : VertexOutput;
		  
		      let worldPos    = uniforms.modelMatrix * vec4<f32>(position, 1.0);
		      out.position    = uniforms.viewProjMatrix * worldPos;
		      out.worldPos    = worldPos.xyz;
		      out.normal      = (uniforms.modelMatrix * vec4<f32>(normal, 0.0)).xyz;
		      out.uv          = uv;
		  
		      return out;
		  }
		  
		  // Fragment shader — @fragment marks entry point
		  @fragment
		  fn fs_main(in : VertexOutput) -> @location(0) vec4<f32> {
		      let albedo  = textureSample(albedoTexture, texSampler, in.uv);
		      let normal  = normalize(in.normal);
		      let lightDir = normalize(vec3<f32>(1.0, 2.0, -1.0));
		  
		      let ndotl = max(dot(normal, lightDir), 0.0);
		      let result = albedo.rgb * (ndotl + 0.1);
		  
		      return vec4<f32>(result, albedo.a);
		  }
		  ```

	- ## Compute Shader (WGSL)
	  collapsed:: true
		- ```wgsl
		  // WGSL Compute Shader — particle simulation
		  
		  struct Particle {
		      position : vec2<f32>,
		      velocity : vec2<f32>,
		      color    : vec4<f32>,
		      lifetime : f32,
		      _pad     : vec3<f32>, // 16-byte alignment padding
		  };
		  
		  // Storage buffers
		  @group(0) @binding(0) var<storage, read>       particlesIn  : array<Particle>;
		  @group(0) @binding(1) var<storage, read_write> particlesOut : array<Particle>;
		  
		  // Uniform for time delta
		  @group(0) @binding(2) var<uniform> deltaTime : f32;
		  
		  // @compute marks this as a compute shader
		  // @workgroup_size(x, y, z) — 64 threads per workgroup
		  @compute @workgroup_size(64, 1, 1)
		  fn cs_main(
		      @builtin(global_invocation_id) globalID : vec3<u32>   // Thread position in grid
		  ) {
		      let index = globalID.x;
		      let total = arrayLength(&particlesIn);
		  
		      if (index >= total) { return; } // Guard: don't run on extra threads
		  
		      var p = particlesIn[index];
		  
		      // Integrate velocity → position
		      p.velocity  += vec2<f32>(0.0, -9.8) * deltaTime;
		      p.position  += p.velocity * deltaTime;
		      p.lifetime  -= deltaTime;
		  
		      // Respawn when lifetime expires
		      if (p.lifetime <= 0.0) {
		          p.position = vec2<f32>(0.0);
		          p.velocity = vec2<f32>(0.0, 5.0);
		          p.lifetime = 2.0;
		      }
		  
		      particlesOut[index] = p;
		  }
		  ```

- # 4 — Buffers
  collapsed:: true
	- ## Buffer Types and Usages
	  collapsed:: true
		-
		  | GPUBufferUsage flag | Purpose |
		  |---|---|
		  | `VERTEX` | Vertex attribute data |
		  | `INDEX` | Triangle index data |
		  | `UNIFORM` | Small, per-frame constant data read in shaders |
		  | `STORAGE` | Large read/write GPU arrays (compute) |
		  | `COPY_SRC` | Can be copied FROM (staging source) |
		  | `COPY_DST` | Can be copied TO (staging destination, GPU target) |
		  | `MAP_READ` | CPU can map this after GPU writes to read results back |
		  | `MAP_WRITE` | CPU can map this to write data in, then copy to GPU |
		  | `INDIRECT` | Used as argument buffer for indirect draw/dispatch |

	- ## Creating Buffers
	  collapsed:: true
		- ```javascript
		  // ---- Create a Vertex Buffer ----
		  const vertices = new Float32Array([
		  //   x,     y,     z,     nx,   ny,   nz,    u,    v
		      -0.5, -0.5,  0.0,   0.0,  0.0,  1.0,  0.0,  0.0,
		       0.5, -0.5,  0.0,   0.0,  0.0,  1.0,  1.0,  0.0,
		       0.0,  0.5,  0.0,   0.0,  0.0,  1.0,  0.5,  1.0,
		  ]);
		  
		  const vertexBuffer = device.createBuffer({
		      label:              "Vertex Buffer",
		      size:               vertices.byteLength,
		      usage:              GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
		      mappedAtCreation:   false,
		  });
		  
		  // Upload data via device.queue.writeBuffer (the easy way)
		  device.queue.writeBuffer(vertexBuffer, 0, vertices);
		  
		  // ---- Create a Uniform Buffer (mapped persistently) ----
		  const uniformBuffer = device.createBuffer({
		      label: "Per-Frame Uniforms",
		      size:  256,    // Always multiple of 256 for uniforms
		      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		  });
		  
		  // Update every frame
		  function updateUniforms(modelMatrix, viewProjMatrix) {
		      const data = new Float32Array([
		          ...modelMatrix,     // 16 floats
		          ...viewProjMatrix,  // 16 floats
		      ]);
		      device.queue.writeBuffer(uniformBuffer, 0, data);
		  }
		  
		  // ---- Create a Storage Buffer for Compute ----
		  const PARTICLE_COUNT = 100000;
		  const PARTICLE_STRIDE = 32; // bytes per particle
		  
		  const particleBufferA = device.createBuffer({
		      label: "Particle Buffer A",
		      size:  PARTICLE_COUNT * PARTICLE_STRIDE,
		      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
		  });
		  const particleBufferB = device.createBuffer({
		      label: "Particle Buffer B",
		      size:  PARTICLE_COUNT * PARTICLE_STRIDE,
		      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX, // Render from compute output!
		  });
		  ```

	- ## Reading Data Back from GPU (Readback)
	  collapsed:: true
		- ```javascript
		  // Create a buffer the CPU can read from
		  const readbackBuffer = device.createBuffer({
		      size:  computeResultSize,
		      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
		  });
		  
		  // After dispatch — copy compute output to readback buffer
		  const encoder = device.createCommandEncoder();
		  encoder.copyBufferToBuffer(computeOutputBuffer, 0, readbackBuffer, 0, computeResultSize);
		  device.queue.submit([encoder.finish()]);
		  
		  // Map the buffer for CPU reading (async — waits for GPU to finish)
		  await readbackBuffer.mapAsync(GPUMapMode.READ);
		  const data = new Float32Array(readbackBuffer.getMappedRange());
		  console.log("GPU Result:", data[0], data[1], data[2]);
		  readbackBuffer.unmap(); // Unmap before GPU can use it again
		  ```

- # 5 — Textures
  collapsed:: true
	- ## Creating and Uploading Textures
	  collapsed:: true
		- ```javascript
		  // Create a texture
		  const texture = device.createTexture({
		      label:     "Albedo Texture",
		      size:      [1024, 1024, 1],   // width, height, depthOrArrayLayers
		      format:    "rgba8unorm-srgb",  // 8-bit sRGB
		      usage:     GPUTextureUsage.TEXTURE_BINDING   // Read in shader
		                | GPUTextureUsage.COPY_DST          // Can receive uploads
		                | GPUTextureUsage.RENDER_ATTACHMENT, // Can be render target
		      mipLevelCount: Math.floor(Math.log2(1024)) + 1,
		  });
		  
		  // Upload image data
		  async function loadImageToTexture(device, url) {
		      const response = await fetch(url);
		      const blob     = await response.blob();
		      const image    = await createImageBitmap(blob, { colorSpaceConversion: "none" });
		  
		      const texture = device.createTexture({
		          size:   [image.width, image.height, 1],
		          format: "rgba8unorm-srgb",
		          usage:  GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
		      });
		  
		      // The easiest way — browser handles decoding
		      device.queue.copyExternalImageToTexture(
		          { source: image },
		          { texture: texture },
		          [image.width, image.height]
		      );
		  
		      return texture;
		  }
		  
		  // Create sampler
		  const sampler = device.createSampler({
		      label:         "Linear Wrap Sampler",
		      magFilter:     "linear",   // Zoomed in
		      minFilter:     "linear",   // Zoomed out
		      mipmapFilter:  "linear",   // Between mip levels
		      addressModeU:  "repeat",   // Tile horizontally
		      addressModeV:  "repeat",   // Tile vertically
		      maxAnisotropy: 16,         // Quality anisotropic filtering
		  });
		  ```

- # 6 — Bind Groups
  collapsed:: true
	- ## What Are Bind Groups?
	  collapsed:: true
		- In WebGPU, you do not bind resources one by one. You group them into a **GPUBindGroup** — a snapshot of exactly which buffers, textures, and samplers are bound at specific slots.
		- ```mermaid
		  graph TD
		      BGL["GPUBindGroupLayout\n'Schema': Binding 0 = Uniform Buffer\nBinding 1 = Texture2D\nBinding 2 = Sampler"]
		      BG["GPUBindGroup\n'Instance': Binding 0 = myUniformBuffer\nBinding 1 = playerTexture\nBinding 2 = linearSampler"]
		      Pipeline["GPURenderPipeline / GPUComputePipeline\nCreated with the same layout"]
		  
		      BGL --> BG
		      BGL --> Pipeline
		      BG -->|"setBindGroup(0, myBG)"| Pass["Render/Compute Pass"]
		  ```

	- ## Creating BindGroupLayoutS and BindGroups
	  collapsed:: true
		- ```javascript
		  // Step 1: Define the layout (the schema)
		  const bindGroupLayout = device.createBindGroupLayout({
		      label: "Main Bind Group Layout",
		      entries: [
		          // Binding 0: Uniform buffer, visible to vertex AND fragment shaders
		          {
		              binding:    0,
		              visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
		              buffer: {
		                  type:           "uniform",
		                  minBindingSize: 256,
		              }
		          },
		          // Binding 1: Texture (read-only in shader)
		          {
		              binding:    1,
		              visibility: GPUShaderStage.FRAGMENT,
		              texture: {
		                  sampleType:    "float",
		                  viewDimension: "2d",
		                  multisampled:  false,
		              }
		          },
		          // Binding 2: Sampler
		          {
		              binding:    2,
		              visibility: GPUShaderStage.FRAGMENT,
		              sampler: {
		                  type: "filtering",
		              }
		          },
		      ]
		  });
		  
		  // Step 2: Create the bind group (actual data)
		  const bindGroup = device.createBindGroup({
		      label:  "Main Bind Group",
		      layout: bindGroupLayout,
		      entries: [
		          { binding: 0, resource: { buffer: uniformBuffer } },
		          { binding: 1, resource: texture.createView() },
		          { binding: 2, resource: sampler },
		      ]
		  });
		  ```

- # 7 — Render Pipelines
  collapsed:: true
	- ## Creating the Render Pipeline
	  collapsed:: true
		- ```javascript
		  const shaderModule = device.createShaderModule({
		      label: "Main Shader",
		      code:  WGSL_SHADER_CODE, // The WGSL string with vs_main and fs_main
		  });
		  
		  const pipeline = device.createRenderPipeline({
		      label:  "Main Render Pipeline",
		      layout: device.createPipelineLayout({
		          bindGroupLayouts: [bindGroupLayout]
		      }),
		  
		      vertex: {
		          module:     shaderModule,
		          entryPoint: "vs_main",
		          buffers: [{
		              arrayStride: 8 * 4, // 8 floats × 4 bytes = 32 bytes per vertex
		              stepMode:    "vertex",
		              attributes: [
		                  { shaderLocation: 0, offset: 0,  format: "float32x3" }, // position
		                  { shaderLocation: 1, offset: 12, format: "float32x3" }, // normal
		                  { shaderLocation: 2, offset: 24, format: "float32x2" }, // uv
		              ]
		          }]
		      },
		  
		      fragment: {
		          module:     shaderModule,
		          entryPoint: "fs_main",
		          targets: [{
		              format: navigator.gpu.getPreferredCanvasFormat(),
		              // Alpha blending:
		              // blend: {
		              //     color: { srcFactor: "src-alpha", dstFactor: "one-minus-src-alpha", operation: "add" },
		              //     alpha: { srcFactor: "one",       dstFactor: "zero",                operation: "add" },
		              // }
		          }]
		      },
		  
		      primitive: {
		          topology:         "triangle-list",
		          cullMode:         "back",
		          frontFace:        "ccw",
		          stripIndexFormat: undefined,
		      },
		  
		      depthStencil: {
		          format:              "depth24plus",
		          depthWriteEnabled:   true,
		          depthCompare:        "less",
		      },
		  });
		  ```

- # 8 — The Complete Render Loop
  collapsed:: true
	- ## Drawing Every Frame
	  collapsed:: true
		- ```javascript
		  function drawFrame(timestamp) {
		      // Update uniform buffer with new matrices
		      updateUniforms(computeModelMatrix(timestamp), viewProjMatrix);
		  
		      // ==== Create command encoder ====
		      const encoder = device.createCommandEncoder({ label: "Frame Encoder" });
		  
		      // ==== Render Pass ====
		      const renderPass = encoder.beginRenderPass({
		          label: "Main Render Pass",
		          colorAttachments: [{
		              view:       context.getCurrentTexture().createView(), // Render to screen
		              clearValue: { r: 0.05, g: 0.05, b: 0.1, a: 1.0 },   // Background color
		              loadOp:     "clear",                                   // Clear before drawing
		              storeOp:    "store",                                   // Save to screen
		          }],
		          depthStencilAttachment: {
		              view:              depthTexture.createView(),
		              depthClearValue:   1.0,  // Far plane
		              depthLoadOp:       "clear",
		              depthStoreOp:      "discard",  // Discard depth after render
		          }
		      });
		  
		      // ==== Set up pipeline and resources ====
		      renderPass.setPipeline(pipeline);
		      renderPass.setBindGroup(0, bindGroup);            // Uniforms + texture + sampler
		      renderPass.setVertexBuffer(0, vertexBuffer);      // Vertex data at slot 0
		      renderPass.setIndexBuffer(indexBuffer, "uint32"); // Uint32 index buffer
		  
		      // ==== Draw ====
		      renderPass.drawIndexed(indexCount, 1, 0, 0, 0);
		      // (indexCount, instanceCount, firstIndex, baseVertex, firstInstance)
		  
		      renderPass.end();
		  
		      // ==== Submit ====
		      device.queue.submit([encoder.finish()]);
		  
		      // Register next frame
		      requestAnimationFrame(drawFrame);
		  }
		  
		  requestAnimationFrame(drawFrame);
		  ```

- # 9 — Compute Pipelines
  collapsed:: true
	- ## Creating and Dispatching Compute
	  collapsed:: true
		- ```javascript
		  // Create compute pipeline
		  const computePipeline = device.createComputePipeline({
		      label:  "Particle Compute Pipeline",
		      layout: device.createPipelineLayout({
		          bindGroupLayouts: [computeBindGroupLayout]
		      }),
		      compute: {
		          module:     shaderModule,
		          entryPoint: "cs_main",
		      }
		  });
		  
		  // ---- Per frame: dispatch compute, then render ----
		  const encoder = device.createCommandEncoder();
		  
		  // COMPUTE PASS (simulate particles)
		  const computePass = encoder.beginComputePass({ label: "Particle Update" });
		  computePass.setPipeline(computePipeline);
		  computePass.setBindGroup(0, computeBindGroupEven); // Ping-pong buffers
		  
		  const WORKGROUP_SIZE = 64;
		  const dispatchCount  = Math.ceil(PARTICLE_COUNT / WORKGROUP_SIZE);
		  computePass.dispatchWorkgroups(dispatchCount, 1, 1);
		  computePass.end();
		  
		  // RENDER PASS (draw updated particles)
		  const renderPass = encoder.beginRenderPass({ /* ... */ });
		  renderPass.setPipeline(renderPipeline);
		  renderPass.setVertexBuffer(0, particleBufferB); // Use compute output as vertex data!
		  renderPass.draw(PARTICLE_COUNT);
		  renderPass.end();
		  
		  device.queue.submit([encoder.finish()]);
		  
		  // Swap buffers for next frame (ping-pong)
		  [computeBindGroupEven, computeBindGroupOdd] = [computeBindGroupOdd, computeBindGroupEven];
		  ```

- # 10 — Timestamps and Performance
  collapsed:: true
	- ## Measuring GPU Time
	  collapsed:: true
		- ```javascript
		  // Timestamp queries require requesting the feature at device creation
		  const device = await adapter.requestDevice({
		      requiredFeatures: ["timestamp-query"]
		  });
		  
		  // Create query set
		  const querySet = device.createQuerySet({
		      type:  "timestamp",
		      count: 4, // 4 timestamps: startCompute, endCompute, startRender, endRender
		  });
		  
		  const resolveBuffer = device.createBuffer({
		      size:  4 * 8, // 4 timestamps × 8 bytes (uint64)
		      usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
		  });
		  
		  const readbackBuffer = device.createBuffer({
		      size:  4 * 8,
		      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
		  });
		  
		  const encoder = device.createCommandEncoder();
		  
		  const computePass = encoder.beginComputePass({
		      timestampWrites: {
		          querySet:                    querySet,
		          beginningOfPassWriteIndex:   0,  // Write timestamp 0 at start
		          endOfPassWriteIndex:         1,  // Write timestamp 1 at end
		      }
		  });
		  // ... compute dispatch ...
		  computePass.end();
		  
		  encoder.resolveQuerySet(querySet, 0, 4, resolveBuffer, 0);
		  encoder.copyBufferToBuffer(resolveBuffer, 0, readbackBuffer, 0, 4 * 8);
		  
		  device.queue.submit([encoder.finish()]);
		  
		  await readbackBuffer.mapAsync(GPUMapMode.READ);
		  const timestamps = new BigUint64Array(readbackBuffer.getMappedRange());
		  
		  const computeTimeNs = Number(timestamps[1] - timestamps[0]);
		  console.log(`Compute pass: ${computeTimeNs / 1_000_000} ms`);
		  readbackBuffer.unmap();
		  ```

- # 11 — WebGPU Native (Dawn and wgpu)
  collapsed:: true
	- ## Beyond the Browser
	  collapsed:: true
		- WebGPU isn't only for browsers. You can use the exact same API in desktop native apps:
		-
		  | Implementation | Language | Platform | Owned By |
		  |---|---|---|---|
		  | **Dawn** | C++ | Windows, macOS, Linux, Android, iOS | Google (powers Chrome) |
		  | **wgpu** | Rust | Windows, macOS, Linux, Android, iOS, Web | Mozilla / wgpu contributors |
		  | **wgpu-native** | C FFI | Same as wgpu | wgpu project |
		  | **WebGPU in Node.js** | JavaScript | Windows, macOS, Linux | Community |

	- ## Using wgpu in Rust
	  collapsed:: true
		- ```rust
		  // Cargo.toml
		  // [dependencies]
		  // wgpu = "22"
		  // winit = "0.30"
		  // pollster = "0.3"   // For blocking async
		  
		  use wgpu::*;
		  
		  async fn init_wgpu(window: &winit::window::Window) -> (Device, Queue, Surface) {
		      let instance = Instance::new(InstanceDescriptor {
		          backends: Backends::all(), // Vulkan on Linux, DX12 on Windows, Metal on Mac
		          ..Default::default()
		      });
		  
		      let surface = instance.create_surface(window).unwrap();
		  
		      let adapter = instance.request_adapter(&RequestAdapterOptions {
		          power_preference:       PowerPreference::HighPerformance,
		          compatible_surface:     Some(&surface),
		          force_fallback_adapter: false,
		      }).await.unwrap();
		  
		      let (device, queue) = adapter.request_device(
		          &DeviceDescriptor {
		              label:              Some("Main Device"),
		              required_features:  Features::empty(),
		              required_limits:    Limits::default(),
		          },
		          None,
		      ).await.unwrap();
		  
		      (device, queue, surface)
		  }
		  // The rest of the API matches JavaScript WebGPU 1:1!
		  // device.create_buffer(), device.create_render_pipeline(), etc.
		  ```

- # 12 — Complete Object Reference
  collapsed:: true
	- ## Every WebGPU Object Explained
	  collapsed:: true
		-
		  | WebGPU Object | Category | What It Does |
		  |---|---|---|
		  | `GPUAdapter` | Bootstrap | Represents a physical GPU. Query capabilities here. |
		  | `GPUDevice` | Core | Logical GPU connection. Create everything from here. |
		  | `GPUQueue` | Execution | Submit command buffers and write buffer data. |
		  | `GPUBuffer` | Memory | A block of GPU memory (vertex, index, uniform, storage). |
		  | `GPUTexture` | Memory | GPU image (2D, 3D, cube map, array). |
		  | `GPUTextureView` | Memory | How to interpret a texture (mip level, layer). |
		  | `GPUSampler` | Textures | Filtering and UV wrapping configuration. |
		  | `GPUShaderModule` | Shaders | Compiled WGSL code. |
		  | `GPUBindGroupLayout` | Binding | Schema of which resources go at which bindings. |
		  | `GPUBindGroup` | Binding | Actual resource bindings matching a layout. |
		  | `GPUPipelineLayout` | Binding | Organizes multiple bind group layouts for a pipeline. |
		  | `GPURenderPipeline` | Pipeline | Immutable: vertex + fragment shaders + render state. |
		  | `GPUComputePipeline` | Pipeline | Immutable: compute kernel. |
		  | `GPUCommandEncoder` | Commands | Records render passes and compute passes. |
		  | `GPURenderPassEncoder` | Commands | Records draw calls within a render pass. |
		  | `GPUComputePassEncoder` | Commands | Records compute dispatches. |
		  | `GPURenderBundleEncoder` | Perf | Pre-record draw calls for reuse across frames. |
		  | `GPUQuerySet` | Profiling | Occlusion queries and timestamp queries. |

- # 🔗 Related Pages
	- [[Advanced Graphics]] — GPU Architecture and cross-API concepts.
	- [[Shader Programming]] — General shader concepts that apply to WGSL.
	- [[Vulkan]] — Compare WebGPU's architecture with Vulkan's explicit model.
	- [[Web Development]] — WebGPU lives inside the web ecosystem.

- # More Learn — Free Resources
	- [WebGPU Fundamentals](https://webgpufundamentals.org/) - The MOST in-depth beginner tutorial for WebGPU.
	- [WebGPU Samples (Official)](https://webgpu.github.io/webgpu-samples/) - Dozens of working code examples.
	- [A Tour of WGSL](https://google.github.io/tour-of-wgsl/) - Interactive WGSL language tour by Google.
	- [raw-webgpu.dev](https://raw-webgpu.dev/) - Low level WebGPU without any framework.
	- [wgpu (Rust)](https://wgpu.rs/) - Native Rust implementation of WebGPU.
	- [WebGPU Spec](https://www.w3.org/TR/webgpu/) - The W3C specification.
