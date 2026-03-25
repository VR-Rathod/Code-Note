---
seoTitle: Vulkan Ray Tracing Pipeline – Setup, Shaders, and SBT Guide
description: "Vulkan ray tracing pipeline setup covering ray generation, miss, closest-hit, any-hit shaders, shader binding table layout, and pipeline creation."
keywords: "Vulkan ray tracing pipeline, ray generation shader, miss shader, closest-hit shader, any-hit shader, shader binding table, SBT, path tracing, GPU rendering, Vulkan"
---

tags:: vulkan, ray-tracing, pipeline, sbt, shaders
title:: PathTracer Learning - Vulkan RT Pipeline

- # Vulkan RT Pipeline
	- VK_KHR_ray_tracing_pipeline — the full pipeline breakdown.
	- Parent: [[PathTracer Learning]]
- ---
- ## Pipeline Overview
	- Unlike rasterization (vertex → fragment), RT pipeline has 5 shader stages
	- Ray generation → [intersection → any-hit] → closest-hit / miss
	- Hardware traverses the TLAS/BLAS, calling shaders at each stage
	- Shader Binding Table (SBT) maps ray types to shader programs
- ---
- ## Shader Stages
	- Ray Generation (`.rgen`)
		- Entry point — one invocation per pixel (or per ray)
		- Calls `traceRayEXT()` to launch rays
		- Reads result from payload, writes to output image
	- Intersection (`.rint`)
		- Custom intersection test for non-triangle geometry (AABBs, spheres, curves)
		- Not needed for triangle geometry — hardware handles it
		- Calls `reportIntersectionEXT(t, hitKind)` to report a hit
	- Any-Hit (`.rahit`)
		- Called for every potential hit (not just closest)
		- Used for: alpha testing, transparency, counting hits
		- Can call `ignoreIntersectionEXT()` to reject a hit
		- Can call `terminateRayEXT()` to stop traversal
	- Closest-Hit (`.rchit`)
		- Called once for the closest confirmed hit
		- Main shading happens here: BRDF evaluation, shadow rays, etc.
		- Access to `gl_HitTEXT`, `gl_PrimitiveID`, `gl_InstanceCustomIndexEXT`
	- Miss (`.rmiss`)
		- Called when ray hits nothing
		- Returns sky/environment color
		- Can have multiple miss shaders (one per ray type)
- ---
- ## Shader Binding Table (SBT)
	- Maps ray types to shader programs
	- Layout: `[RayGen | Miss shaders | Hit groups | Callable shaders]`
	- Each entry is a shader handle (32 bytes) + optional inline data
	- Alignment requirements
		- `shaderGroupHandleSize` — typically 32 bytes
		- `shaderGroupBaseAlignment` — typically 64 bytes
		- `shaderGroupHandleAlignment` — typically 32 bytes
		- Each region must be aligned to `shaderGroupBaseAlignment`
	- SBT regions
		- Ray generation: exactly 1 shader
		- Miss: one per ray type (e.g., primary rays, shadow rays)
		- Hit groups: one per (geometry type × ray type) combination
		- Each hit group = `{closest-hit, any-hit, intersection}` shaders
	- Indexing formula
		- `hitGroupIndex = instanceSBTOffset + geometryIndex * sbtStride + rayContributionToHitGroupIndex`
		- `instanceSBTOffset` = `VkAccelerationStructureInstanceKHR.instanceShaderBindingTableRecordOffset`
	- Building the SBT
		- ```cpp
		  // Get shader handles
		  std::vector<uint8_t> handles(groupCount * handleSize);
		  vkGetRayTracingShaderGroupHandlesKHR(device, pipeline, 0, groupCount, handles.size(), handles.data());
		  
		  // Upload to GPU buffer with correct alignment
		  // Each entry: [handle (32 bytes)] [inline data (optional)]
		  // Padded to shaderGroupBaseAlignment (64 bytes)
		  ```
- ---
- ## Ray Generation Shader
	- ```glsl
	  #version 460
	  #extension GL_EXT_ray_tracing : require
	  
	  layout(set=0, binding=0) uniform accelerationStructureEXT tlas;
	  layout(set=0, binding=1, rgba32f) uniform image2D outputImage;
	  layout(set=0, binding=2) uniform CameraData { mat4 viewInv; mat4 projInv; } cam;
	  
	  layout(location=0) rayPayloadEXT vec3 payload;
	  
	  void main() {
	      vec2 pixel = vec2(gl_LaunchIDEXT.xy) + vec2(0.5);  // pixel center
	      vec2 uv    = pixel / vec2(gl_LaunchSizeEXT.xy) * 2.0 - 1.0;
	      
	      vec4 origin    = cam.viewInv * vec4(0, 0, 0, 1);
	      vec4 target    = cam.projInv * vec4(uv.x, uv.y, 1, 1);
	      vec4 direction = cam.viewInv * vec4(normalize(target.xyz / target.w), 0);
	      
	      traceRayEXT(
	          tlas,
	          gl_RayFlagsOpaqueEXT,  // ray flags
	          0xFF,                   // cull mask
	          0,                      // sbtRecordOffset (hit group index)
	          1,                      // sbtRecordStride
	          0,                      // miss index
	          origin.xyz, 0.001,      // origin, tMin
	          direction.xyz, 1e4,     // direction, tMax
	          0                       // payload location
	      );
	      
	      imageStore(outputImage, ivec2(gl_LaunchIDEXT.xy), vec4(payload, 1.0));
	  }
	  ```
- ---
- ## Closest-Hit Shader
	- ```glsl
	  #version 460
	  #extension GL_EXT_ray_tracing : require
	  #extension GL_EXT_nonuniform_qualifier : require
	  #extension GL_EXT_buffer_reference : require
	  #extension GL_EXT_scalar_block_layout : require
	  
	  layout(location=0) rayPayloadInEXT vec3 payload;
	  layout(location=1) rayPayloadEXT   bool isShadowed;
	  hitAttributeEXT vec2 baryCoords;
	  
	  layout(set=0, binding=0) uniform accelerationStructureEXT tlas;
	  
	  // Per-instance data (indexed by gl_InstanceCustomIndexEXT)
	  layout(set=0, binding=3, scalar) buffer InstanceData {
	      InstanceInfo instances[];
	  };
	  
	  void main() {
	      // Reconstruct hit point
	      vec3 bary = vec3(1.0 - baryCoords.x - baryCoords.y, baryCoords.x, baryCoords.y);
	      InstanceInfo inst = instances[gl_InstanceCustomIndexEXT];
	      
	      // Fetch vertex data via buffer device address
	      VertexBuffer vb = VertexBuffer(inst.vertexAddress);
	      uint i0 = IndexBuffer(inst.indexAddress).indices[gl_PrimitiveID * 3 + 0];
	      uint i1 = IndexBuffer(inst.indexAddress).indices[gl_PrimitiveID * 3 + 1];
	      uint i2 = IndexBuffer(inst.indexAddress).indices[gl_PrimitiveID * 3 + 2];
	      
	      vec3 N = normalize(bary.x * vb.vertices[i0].normal
	                       + bary.y * vb.vertices[i1].normal
	                       + bary.z * vb.vertices[i2].normal);
	      N = normalize(mat3(gl_ObjectToWorldEXT) * N);  // transform to world space
	      
	      // Evaluate BRDF, trace shadow rays, etc.
	      payload = shade(N, inst.material, gl_WorldRayDirectionEXT);
	  }
	  ```
- ---
- ## Miss Shader
	- ```glsl
	  layout(location=0) rayPayloadInEXT vec3 payload;
	  layout(set=0, binding=4) uniform sampler2D envMap;
	  
	  void main() {
	      vec3 dir = gl_WorldRayDirectionEXT;
	      vec2 uv  = vec2(atan(dir.z, dir.x) / (2.0 * PI) + 0.5,
	                      acos(dir.y) / PI);
	      payload = texture(envMap, uv).rgb;
	  }
	  ```
- ---
- ## Shadow Ray Pattern
	- Use a separate payload location for shadow rays
	- ```glsl
	  // In closest-hit shader, for NEE:
	  layout(location=1) rayPayloadEXT bool isShadowed;
	  
	  isShadowed = true;  // assume shadowed
	  traceRayEXT(
	      tlas,
	      gl_RayFlagsTerminateOnFirstHitEXT |
	      gl_RayFlagsSkipClosestHitShaderEXT,
	      0xFF, 1, 1, 1,  // different miss index for shadow miss shader
	      hitPoint + N * 0.001, 0.001,
	      lightDir, lightDist * 0.999,
	      1  // payload location 1
	  );
	  if (!isShadowed) {
	      // add direct lighting contribution
	  }
	  ```
	- Shadow miss shader: `layout(location=1) rayPayloadInEXT bool isShadowed; void main() { isShadowed = false; }`
- ---
- ## Pipeline Creation
	- ```cpp
	  // Shader stages
	  std::vector<VkPipelineShaderStageCreateInfo> stages = {
	      { .stage = VK_SHADER_STAGE_RAYGEN_BIT_KHR,       .module = rgenModule },
	      { .stage = VK_SHADER_STAGE_MISS_BIT_KHR,         .module = rmissModule },
	      { .stage = VK_SHADER_STAGE_CLOSEST_HIT_BIT_KHR,  .module = rchitModule },
	  };
	  
	  // Shader groups
	  std::vector<VkRayTracingShaderGroupCreateInfoKHR> groups = {
	      { .type = VK_RAY_TRACING_SHADER_GROUP_TYPE_GENERAL_KHR,
	        .generalShader = 0 },  // rgen
	      { .type = VK_RAY_TRACING_SHADER_GROUP_TYPE_GENERAL_KHR,
	        .generalShader = 1 },  // miss
	      { .type = VK_RAY_TRACING_SHADER_GROUP_TYPE_TRIANGLES_HIT_GROUP_KHR,
	        .closestHitShader = 2 },  // hit group
	  };
	  
	  VkRayTracingPipelineCreateInfoKHR pipelineInfo{};
	  pipelineInfo.stageCount = stages.size();
	  pipelineInfo.pStages    = stages.data();
	  pipelineInfo.groupCount = groups.size();
	  pipelineInfo.pGroups    = groups.data();
	  pipelineInfo.maxPipelineRayRecursionDepth = 2;  // primary + shadow
	  vkCreateRayTracingPipelinesKHR(device, {}, {}, 1, &pipelineInfo, nullptr, &pipeline);
	  ```
- ---
- ## Ray Recursion Depth
	- `maxPipelineRayRecursionDepth` — max nested `traceRayEXT` calls
	- Depth 1: primary rays only (no shadow rays from hit shader)
	- Depth 2: primary + shadow rays (most common)
	- Higher depth: expensive — prefer iterative approach with payload
	- For path tracing: use iterative loop in rgen shader, not recursive hit shaders
- ---
- ## Related
	- [[PathTracer Learning - BLAS and TLAS]]
	- [[PathTracer Learning - Concept - Device Address Bit]]
	- [[PathTracer Learning - Phase 3 - GPU and Vulkan]]
