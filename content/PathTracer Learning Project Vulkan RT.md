---
seoTitle: Vulkan Ray Tracing Project – GPU Path Tracer Implementation Notes
description: "Vulkan ray tracing project notes covering pipeline setup, acceleration structures, shader binding table, descriptor sets, and full GPU path tracer."
keywords: "Vulkan ray tracing, GPU path tracer, pipeline setup, acceleration structures, shader binding table, descriptor sets, path tracing, ray tracing, GPU rendering, RTX"
treeTitle: Game Development - Path Tracing - Project Vulkan RT
---

tags:: project, vulkan, gpu, ray-tracing, implementation
title:: PathTracer Learning Project Vulkan RT

- # Project: Vulkan RT Path Tracer
	- Parent: [[PathTracer Learning]]
	- Phase: [[PathTracer Learning Phase 3 GPU and Vulkan]]
- ---
- ## Goal
	- Port the CPU path tracer to Vulkan ray tracing
	- Integrate with Godot's rendering pipeline
- ---
- ## Prerequisites
	- [[PathTracer Learning Project CPU Path Tracer]] complete
	- Vulkan SDK installed
	- GPU with RT support (NVIDIA RTX or AMD RDNA2+)
- ---
- ## Milestones
	- Milestone 1: Vulkan setup + triangle in RT
		- Initialize Vulkan with RT extensions
		- Create BLAS from a single triangle
		- Create TLAS with one instance
		- Write minimal rgen + rchit + rmiss shaders
		- Display result in a window
	- Milestone 2: Full scene + BVH
		- Load OBJ, create BLAS per mesh
		- Create TLAS with all instances
		- Pass vertex/index data to closest-hit shader via device address
		- Reconstruct hit position and normal in shader
	- Milestone 3: Path tracing on GPU
		- Implement iterative path tracing in rgen shader
		- Cosine-weighted sampling in GLSL
		- Temporal accumulation (ping-pong buffers)
		- Display accumulated result
	- Milestone 4: Full PBR + NEE
		- GGX BRDF in GLSL
		- Shadow rays for direct lighting
		- MIS weighting
	- Milestone 5: Godot integration
		- Hook into Godot's `_render_scene()`
		- Use Godot's `RenderingDevice` for all Vulkan calls
		- Extract mesh data from Godot's scene graph
		- See [[PathTracer Learning Phase 4 Godot Internals]]
- ---
- ## Key Technical Challenges
	- Vertex data access in closest-hit shader
		- Use `GL_EXT_buffer_reference` to access vertex buffer by device address
		- Store per-instance buffer addresses in a storage buffer
		- Index by `gl_InstanceCustomIndexEXT`
	- Material data
		- Pack PBR parameters into a compact struct
		- Store in per-instance data buffer
		- Sample textures using `gl_InstanceCustomIndexEXT` as texture array index
	- Random number generation
		- PCG hash or Xorshift for per-pixel, per-sample RNG
		- Seed with `gl_LaunchIDEXT.xy` and frame counter
		- ```glsl
		  uint pcg(uint v) {
		      uint state = v * 747796405u + 2891336453u;
		      uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
		      return (word >> 22u) ^ word;
		  }
		  float rand(inout uint seed) {
		      seed = pcg(seed);
		      return float(seed) / float(0xFFFFFFFFu);
		  }
		  ```
- ---
- ## Performance Targets
	- 1080p @ 60fps with 1 spp + denoising
	- BLAS build: < 1ms per frame for dynamic objects
	- TLAS rebuild: < 0.5ms per frame