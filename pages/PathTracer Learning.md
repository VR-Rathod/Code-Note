---
seoTitle: Path Tracing Learning Roadmap – From Basics to GPU Implementation
description: "A complete, structured learning path for building a GPU path tracer from scratch. Covers foundational math, CPU ray tracing, Vulkan ray tracing, Godot engine internals, and advanced techniques including ReSTIR and DLSS."
keywords: "path tracing tutorial, path tracer from scratch, Vulkan ray tracing, BVH, Monte Carlo rendering, physically-based rendering, GPU path tracer, GLSL, ray tracing learning roadmap, ReSTIR, DLSS, denoising, Godot path tracer"
treeTitle: Game Development - Path Tracing
---

tags:: index, pathtracer, graphics-programming
title:: PathTracer Learning

- # PathTracer Learning
	- A structured learning path for building a complete GPU path tracer — from foundational mathematics through Vulkan ray tracing and production-quality rendering.
	- This series is based on research into modern rendering techniques, GPU path tracing APIs, and Godot engine internals.
	- **Prerequisite:** It is recommended to work through [[Graphics Programming From Scratch]] before starting this series, as it covers PBR, the rendering equation, and GPU fundamentals from the ground up.
- ---
- ## Learning Phases
  collapsed:: true
	- Follow these phases in order. Each phase builds directly on the last.
	- [[PathTracer Learning Phase 1 Math for Graphics]]
		- Vectors, dot and cross products, coordinate systems, radiometry, probability theory, and the rendering equation
	- [[PathTracer Learning Phase 2 CPU Ray Tracing]]
		- Build a complete software ray tracer in C++ first — understand the algorithm before moving to GPU
		- See also: [[PathTracer Learning Ray Tracing in One Weekend]]
	- [[PathTracer Learning Phase 3 GPU and Vulkan]]
		- Vulkan ray tracing extension, shader binding tables, BLAS and TLAS acceleration structures
	- [[PathTracer Learning Phase 4 Godot Internals]]
		- RenderingDevice API, RenderSceneBuffers, how Godot's renderer is structured
	- [[PathTracer Learning Phase 5 Advanced Topics]]
		- ReSTIR, DLSS, denoising, temporal accumulation, and production-quality rendering
- ---
- ## Core Algorithms
  collapsed:: true
	- [[PathTracer Learning Path Tracing Algorithm]]
		- The complete path tracing algorithm — how Monte Carlo integration solves the rendering equation
	- [[PathTracer Learning BLAS and TLAS]]
		- Acceleration structures — how rays find geometry efficiently at GPU speeds
	- [[PathTracer Learning Vulkan RT Pipeline]]
		- VK_KHR_ray_tracing_pipeline — ray generation, closest-hit, miss, and any-hit shaders
	- [[PathTracer Learning DLSS and Denoising]]
		- Temporal accumulation, DLSS 3.5 Ray Reconstruction, and denoising strategies
	- [[PathTracer Learning ReSTIR]]
		- Reservoir-based spatiotemporal importance resampling for real-time path tracing
- ---
- ## Math and Radiometry
  collapsed:: true
	- [[PathTracer Learning Dot Product]]
	- [[PathTracer Learning Cross Product]]
	- [[PathTracer Learning Solid Angle]]
	- [[PathTracer Learning Radiometry]]
	- [[PathTracer Learning Render Equation]]
	- [[PathTracer Learning Monte Carlo Integration]]
	- [[PathTracer Learning Importance Sampling]]
	- [[PathTracer Learning MIS]]
- ---
- ## Geometry and Intersection
  collapsed:: true
	- [[PathTracer Learning Ray Definition]]
	- [[PathTracer Learning Ray Triangle Intersection]]
	- [[PathTracer Learning AABB]]
	- [[PathTracer Learning BVH Construction]]
	- [[Pathtracer Concept BVH Traversal]]
	- [[PathTracer Learning Camera Model]]
- ---
- ## Shading and Materials
  collapsed:: true
	- [[PathTracer Learning Physically Based Rendering]]
	- [[PathTracer Learning BRDF]]
	- [[PathTracer Learning Microfacet Theory]]
	- [[PathTracer Learning Fresnel Effect]]
	- [[PathTracer Learning Normal Mapping]]
	- [[PathTracer Learning Environment Map]]
- ---
- ## Path Tracing Techniques
  collapsed:: true
	- [[PathTracer Learning Russian Roulette]]
	- [[PathTracer Learning Next Event Estimation]]
	- [[PathTracer Learning Temporal Accumulation]]
	- [[PathTracer Learning Concept Temporal Rejection]]
	- [[PathTracer Learning Tone Mapping]]
	- [[PathTracer Learning Anti-Aliasing]]
- ---
- ## Vulkan Internals
  collapsed:: true
	- [[PathTracer Learning Async Compute]]
	- [[PathTracer Learning Device Address Bit]]
- ---
- ## Reference
  collapsed:: true
	- [[PathTracer Learning Books and Tutorials]]
		- Ray Tracing in One Weekend, PBRT, Ray Tracing Gems, key papers
	- [[PathTracer Learning Chat Analysis]]
		- Notes from Godot NVPathtracer contributor discussions
- ---
- ## Projects
  collapsed:: true
	- [[PathTracer Learning Project Math Library]]
	- [[PathTracer Learning Project CPU Path Tracer]]
	- [[PathTracer Learning Project Vulkan RT]]