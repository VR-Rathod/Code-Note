---
seoTitle: BLAS and TLAS in Ray Tracing – Acceleration Structure Guide
description: "BLAS and TLAS are two-level acceleration structures for ray tracing. Covers bottom-level and top-level AS construction, instancing, BVH, and Vulkan ray tracing."
keywords: "BLAS, TLAS, acceleration structure, ray tracing, BVH, Vulkan ray tracing, bottom-level AS, top-level AS, instancing, path tracing, GPU rendering, RTX"
---

tags:: vulkan, acceleration-structure, bvh, blas, tlas
title:: PathTracer Learning - BLAS and TLAS

- # BLAS and TLAS — Acceleration Structures
	- Hardware-accelerated BVH for Vulkan ray tracing.
	- Parent: [[PathTracer Learning]]
- ---
- ## Conceptual Overview
	- Two-level hierarchy
		- BLAS (Bottom-Level AS): geometry BVH — triangles or AABBs
		- TLAS (Top-Level AS): instance BVH — references to BLASes with transforms
	- Why two levels?
		- Allows instancing: one BLAS, many TLAS instances (e.g., 1000 trees from 1 mesh)
		- TLAS can be rebuilt cheaply (just transforms) while BLASes stay static
		- Hardware traversal handles both levels transparently
	- Analogy to software BVH
		- BLAS ≈ per-mesh BVH (built offline or at load time)
		- TLAS ≈ scene BVH (rebuilt every frame)
- ---
- ## BLAS Construction
	- Input: vertex buffer + index buffer (triangle list)
	- `VkAccelerationStructureGeometryKHR`
		- ```
		  geometry.geometryType = VK_GEOMETRY_TYPE_TRIANGLES_KHR;
		  geometry.geometry.triangles.vertexFormat = VK_FORMAT_R32G32B32_SFLOAT;
		  geometry.geometry.triangles.vertexData.deviceAddress = vertexBufferAddress;
		  geometry.geometry.triangles.vertexStride = sizeof(Vertex);
		  geometry.geometry.triangles.maxVertex = vertexCount - 1;
		  geometry.geometry.triangles.indexType = VK_INDEX_TYPE_UINT32;
		  geometry.geometry.triangles.indexData.deviceAddress = indexBufferAddress;
		  ```
	- Build flags
		- `VK_BUILD_ACCELERATION_STRUCTURE_PREFER_FAST_TRACE_BIT_KHR` — optimize for traversal (static geometry)
		- `VK_BUILD_ACCELERATION_STRUCTURE_PREFER_FAST_BUILD_BIT_KHR` — optimize for build speed (dynamic geometry)
		- `VK_BUILD_ACCELERATION_STRUCTURE_ALLOW_UPDATE_BIT_KHR` — allow incremental updates (skinned meshes)
		- `VK_BUILD_ACCELERATION_STRUCTURE_ALLOW_COMPACTION_BIT_KHR` — compact after build (saves memory)
	- Memory requirements
		- Query with `vkGetAccelerationStructureBuildSizesKHR`
		- Returns: `accelerationStructureSize`, `buildScratchSize`, `updateScratchSize`
		- Scratch buffer is temporary — can be reused after build completes
	- Compaction (important for memory)
		- Build with `ALLOW_COMPACTION` flag
		- Query compacted size with `VK_QUERY_TYPE_ACCELERATION_STRUCTURE_COMPACTED_SIZE_KHR`
		- Copy to smaller buffer with `vkCmdCopyAccelerationStructureKHR`
		- Typical compaction ratio: 50-70% size reduction
- ---
- ## TLAS Construction
	- Input: array of `VkAccelerationStructureInstanceKHR`
	- Instance struct fields
		- `transform` — 3×4 row-major affine transform matrix
		- `instanceCustomIndex` — 24-bit value accessible as `gl_InstanceCustomIndexEXT` in shaders
		- `mask` — 8-bit visibility mask (AND with ray mask in `traceRayEXT`)
		- `instanceShaderBindingTableRecordOffset` — SBT hit group offset for this instance
		- `flags` — `VK_GEOMETRY_INSTANCE_TRIANGLE_FACING_CULL_DISABLE_BIT_KHR` etc.
		- `accelerationStructureReference` — device address of the BLAS
	- TLAS is rebuilt every frame
		- Upload new instance buffer with updated transforms
		- `vkCmdBuildAccelerationStructuresKHR` with `VK_BUILD_ACCELERATION_STRUCTURE_MODE_BUILD_KHR`
		- Or use `MODE_UPDATE_KHR` for incremental update (faster but lower quality BVH)
- ---
- ## Memory Layout and Device Addresses
	- [[PathTracer Learning - Concept - Device Address Bit]]
	- All AS input buffers need `VK_BUFFER_USAGE_SHADER_DEVICE_ADDRESS_BIT`
	- AS buffer needs `VK_BUFFER_USAGE_ACCELERATION_STRUCTURE_STORAGE_BIT_KHR`
	- Scratch buffer needs `VK_BUFFER_USAGE_STORAGE_BIT | VK_BUFFER_USAGE_SHADER_DEVICE_ADDRESS_BIT`
- ---
- ## Traversal in Shaders
	- `traceRayEXT(tlas, rayFlags, cullMask, sbtOffset, sbtStride, missIndex, origin, tMin, dir, tMax, payloadLocation)`
	- Ray flags
		- `gl_RayFlagsOpaqueEXT` — skip any-hit shaders (faster)
		- `gl_RayFlagsTerminateOnFirstHitEXT` — stop at first hit (shadow rays)
		- `gl_RayFlagsSkipClosestHitShaderEXT` — don't call closest-hit (occlusion only)
	- Built-in variables in hit shaders
		- `gl_HitTEXT` — distance to hit
		- `gl_PrimitiveID` — triangle index within the BLAS geometry
		- `gl_InstanceID` — instance index in the TLAS
		- `gl_InstanceCustomIndexEXT` — custom index from instance struct
		- `gl_WorldRayOriginEXT`, `gl_WorldRayDirectionEXT` — ray in world space
		- `gl_ObjectRayOriginEXT`, `gl_ObjectRayDirectionEXT` — ray in object space
		- `gl_ObjectToWorldEXT`, `gl_WorldToObjectEXT` — transform matrices
