---
seoTitle: GPU Ray Tracing with Vulkan – VK_KHR_ray_tracing Implementation
description: "GPU ray tracing using Vulkan ray tracing extensions. Covers VK_KHR_ray_tracing_pipeline, shader binding table, BLAS/TLAS, ray generation shaders, and hit."
keywords: "GPU ray tracing, Vulkan, VK_KHR_ray_tracing, shader binding table, BLAS, TLAS, ray generation shader, hit shader, path tracing, GPU rendering, RTX, Vulkan extension"
treeTitle: Game Development - Path Tracing - Phase 3 GPU and Vulkan
---

tags:: phase, vulkan, gpu, ray-tracing, glsl
title:: PathTracer Learning Phase 3 GPU and Vulkan

- # Phase 3 — GPU and Vulkan Ray Tracing
	- Moving from CPU to GPU. Vulkan's ray tracing extension (`VK_KHR_ray_tracing_pipeline`) exposes hardware RT units (NVIDIA RTX, AMD RDNA2+).
	- Parent: [[PathTracer Learning]]
- ---
- ## 3.1 Vulkan Ray Tracing Overview
	- [[PathTracer Learning Vulkan RT Pipeline]]
		- Full pipeline breakdown: ray gen, intersection, any-hit, closest-hit, miss shaders
		- Shader Binding Table (SBT) construction and indexing
	- [[PathTracer Learning BLAS and TLAS]]
		- How geometry is organized for hardware traversal
	- Key extensions required
		- `VK_KHR_ray_tracing_pipeline` — the RT pipeline itself
		- `VK_KHR_acceleration_structure` — BLAS/TLAS management
		- `VK_KHR_ray_query` — inline ray queries from any shader stage
		- `VK_KHR_buffer_device_address` — GPU pointers (required for SBT)
		- `VK_KHR_deferred_host_operations` — async BLAS builds
		- `VK_EXT_descriptor_indexing` — bindless textures/buffers
- ---
- ## 3.2 Acceleration Structures in Vulkan
	- [[PathTracer Learning BLAS and TLAS]]
	- BLAS (Bottom-Level Acceleration Structure)
		- Contains actual geometry: triangles or AABBs
		- Built once per mesh (or rebuilt for skinned meshes)
		- `VkAccelerationStructureGeometryKHR` — describes the geometry
		- `VkAccelerationStructureBuildGeometryInfoKHR` — build parameters
		- Build flags: `PREFER_FAST_TRACE` vs `PREFER_FAST_BUILD` vs `ALLOW_UPDATE`
		- Compaction: reduces memory by 50-70% after build
	- TLAS (Top-Level Acceleration Structure)
		- Contains instances of BLASes with transform matrices
		- Rebuilt every frame (instances move, appear, disappear)
		- `VkAccelerationStructureInstanceKHR`:
			- ```
			  struct VkAccelerationStructureInstanceKHR {
			      VkTransformMatrixKHR transform;        // 3x4 row-major matrix
			      uint32_t instanceCustomIndex : 24;     // gl_InstanceCustomIndexEXT in shader
			      uint32_t mask : 8;                     // visibility mask
			      uint32_t instanceShaderBindingTableRecordOffset : 24;
			      uint32_t flags : 8;
			      uint64_t accelerationStructureReference; // BLAS device address
			  };
			  ```
	- [[PathTracer Learning Device Address Bit]]
		- `VK_BUFFER_USAGE_SHADER_DEVICE_ADDRESS_BIT` — required for SBT and AS input buffers
		- `vkGetBufferDeviceAddress()` returns a `VkDeviceAddress` (uint64)
		- This is a raw GPU pointer — enables pointer arithmetic in shaders
- ---
- ## 3.3 Shader Binding Table (SBT)
	- See [[PathTracer Learning Vulkan RT Pipeline]] for full details
	- The SBT maps ray types to shader programs
	- Layout: `[RayGen | Miss shaders | Hit groups | Callable shaders]`
	- Each entry is a shader handle (32 bytes) + optional inline data
	- Alignment requirements
		- `shaderGroupHandleSize` — typically 32 bytes
		- `shaderGroupBaseAlignment` — typically 64 bytes
		- Each region must be aligned to `shaderGroupBaseAlignment`
	- Indexing formula
		- `hitGroupIndex = instanceSBTOffset + geometryIndex * sbtStride + rayContributionToHitGroupIndex`
- ---
- ## 3.4 Ray Tracing Shaders (GLSL)
	- See [[PathTracer Learning Vulkan RT Pipeline]] for complete shader examples
	- Ray generation shader (`.rgen`)
		- Entry point for each pixel
		- Calls `traceRayEXT()` to launch rays
		- For path tracing: implement the full bounce loop here (not recursively)
	- Closest-hit shader (`.rchit`)
		- Called for the nearest confirmed hit
		- Fetch vertex data via buffer device address (`GL_EXT_buffer_reference`)
		- Evaluate BRDF, trace shadow rays
	- Miss shader (`.rmiss`)
		- Called when ray hits nothing
		- Sample environment map
	- Any-hit shader (`.rahit`)
		- Called for every potential hit — use for alpha testing
		- `ignoreIntersectionEXT()` to reject transparent pixels
- ---
- ## 3.5 Bindless Resources
	- Path tracers need access to many textures and buffers (one per mesh/material)
	- Bindless: bind a large array of descriptors, index at runtime
	- `VK_EXT_descriptor_indexing` — enables unbounded descriptor arrays
	- ```glsl
	  #extension GL_EXT_nonuniform_qualifier : require
	  layout(set=1, binding=0) uniform sampler2D textures[];
	  
	  // In closest-hit shader:
	  vec4 albedo = texture(textures[nonuniformEXT(materialIndex)], uv);
	  ```
	- `nonuniformEXT` — required when index varies per invocation (non-uniform)
	- Alternative: push constants or inline data in SBT entries
- ---
- ## 3.6 Iterative Path Tracing on GPU
	- Recursive approach: hit shader calls `traceRayEXT` → limited by `maxPipelineRayRecursionDepth`
	- Iterative approach (preferred): loop in ray generation shader
		- ```glsl
		  // In rgen shader — full path tracing loop
		  vec3 throughput = vec3(1.0);
		  vec3 radiance   = vec3(0.0);
		  Ray  ray        = generateCameraRay(pixel);
		  
		  for (int bounce = 0; bounce < MAX_BOUNCES; bounce++) {
		      traceRayEXT(tlas, ..., ray.origin, 0.001, ray.direction, 1e4, 0);
		      // payload contains: hit info, new ray direction, BRDF weight, direct light
		      
		      radiance   += throughput * payload.emission;
		      radiance   += throughput * payload.directLight;
		      throughput *= payload.brdfWeight;
		      
		      if (payload.missed) { radiance += throughput * payload.envLight; break; }
		      if (all(lessThan(throughput, vec3(0.001)))) break;  // early termination
		      
		      ray = Ray(payload.nextOrigin, payload.nextDirection);
		  }
		  ```
	- Payload carries all data needed between bounces
- ---
- ## 3.7 Async Compute
	- [[PathTracer Learning Async Compute]]
		- Run compute work in parallel with graphics on separate queue
		- BLAS builds can overlap with rendering
		- Denoising passes can overlap with next frame's ray tracing
- ---
- ## 3.8 Ray Query (Inline RT)
	- Alternative to RT pipeline: query rays from any shader stage
	- `VK_KHR_ray_query` — no SBT, no separate shader stages
	- ```glsl
	  #extension GL_EXT_ray_query : require
	  
	  // In a compute shader:
	  rayQueryEXT rq;
	  rayQueryInitializeEXT(rq, tlas, gl_RayFlagsOpaqueEXT, 0xFF,
	                        origin, 0.001, direction, 1e4);
	  while (rayQueryProceedEXT(rq)) {}  // traverse
	  
	  if (rayQueryGetIntersectionTypeEXT(rq, true) == gl_RayQueryCommittedIntersectionTriangleEXT) {
	      float t = rayQueryGetIntersectionTEXT(rq, true);
	      // hit!
	  }
	  ```
	- Useful for: shadow rays in compute shaders, AO, simple occlusion queries
	- Less flexible than RT pipeline but simpler to integrate
- ---
- ## Phase 3 Checklist
	- TODO Create BLAS from triangle mesh
	- TODO Create TLAS with instances
	- TODO Build and upload SBT
	- TODO Write ray generation shader
	- TODO Write closest-hit shader with BRDF evaluation
	- TODO Write miss shader for sky/environment
	- TODO Trace a primary ray and display result
	- TODO Add shadow rays for direct lighting (NEE)
	- TODO Implement iterative path tracing loop in rgen shader
	- TODO Set up bindless texture array for materials
	- TODO Implement BLAS compaction
- ---
- ## Project
	- [[PathTracer Learning Project Vulkan RT]]
- ---
- ## Navigation
	- Previous: [[PathTracer Learning Phase 2 CPU Ray Tracing]]
	- Next: [[PathTracer Learning Phase 4 Godot Internals]]