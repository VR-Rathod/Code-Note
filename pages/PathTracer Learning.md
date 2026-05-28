---
seoTitle: Path Tracing Learning Roadmap – From Basics to GPU Implementation
description: "Structured learning path for path tracing from ray-sphere intersection to full GPU Vulkan implementation."
keywords: "pathtracer learning, path tracing, ray tracing, learning roadmap, GPU rendering, Vulkan, BVH, Monte Carlo, physically-based rendering, graphics programming, learning path, tutorial"
---

tags:: index, pathtracer, graphics-programming
title:: PathTracer Learning

- # PathTracer Learning — Master Index
	- A deep-dive learning graph for building a GPU path tracer in [[Godot]] , based on the NVPathtracer contributor discussions and modern rendering research.
	- This graph covers everything from foundational math to Vulkan ray tracing pipelines and Godot engine internals.
- ---
- ## Learning Phases
  collapsed:: true
	- [[PathTracer Learning Phase 1 Math for Graphics]]
		- Vectors, matrices, coordinate systems, radiometry, probability theory
	- [[PathTracer Learning Phase 2 CPU Ray Tracing]]
		- Build a software ray tracer first — understand the algorithm before GPU
	- [[PathTracer Learning Phase 3 GPU and Vulkan]]
		- Vulkan ray tracing pipeline, shader binding tables, acceleration structures
	- [[PathTracer Learning Phase 4 Godot Internals]]
		- RenderingDevice, RenderSceneBuffers, how Godot's renderer is structured
	- [[PathTracer Learning Phase 5 Advanced Topics]]
		- ReSTIR, DLSS, denoising, production-quality rendering
- ---
- ## Key Algorithm Pages
  collapsed:: true
	- [[PathTracer Learning Path Tracing Algorithm]]
		- The core rendering equation and how path tracing solves it
	- [[PathTracer Learning BLAS and TLAS]]
		- Bottom-level and top-level acceleration structures for RT
	- [[PathTracer Learning Vulkan RT Pipeline]]
		- VK_KHR_ray_tracing_pipeline — stages, SBT, ray generation
	- [[PathTracer Learning DLSS and Denoising]]
		- Temporal accumulation, DLSS 3.5 Ray Reconstruction
	- [[PathTracer Learning ReSTIR]]
		- Reservoir-based spatiotemporal importance resampling
- ---
- ## Math & Radiometry Concepts
  collapsed:: true
	- [[PathTracer Learning Dot Product]]
	- [[PathTracer Learning Cross Product]]
	- [[PathTracer Learning Solid Angle]]
	- [[PathTracer Learning Radiometry]]
	- [[PathTracer Learning Monte Carlo Integration]]
	- [[PathTracer Learning Importance Sampling]]
	- [[PathTracer Learning MIS]]
- ---
- ## Geometry & Intersection Concepts
  collapsed:: true
	- [[PathTracer Learning Ray Definition]]
	- [[PathTracer Learning Ray Triangle Intersection]]
	- [[PathTracer Learning AABB]]
	- [[PathTracer Learning BVH Construction]]
	- [[Pathtracer Concept BVH Traversal]]
	- [[PathTracer Learning Camera Model]]
- ---
- ## Shading & Material Concepts
  collapsed:: true
	- [[PathTracer Learning BRDF]]
	- [[PathTracer Learning Microfacet Theory]]
	- [[PathTracer Learning Fresnel Effect]]
	- [[PathTracer Learning Normal Mapping]]
	- [[PathTracer Learning Environment Map]]
- ---
- ## Path Tracing Concepts
  collapsed:: true
	- [[PathTracer Learning Russian Roulette]]
	- [[PathTracer Learning Next Event Estimation]]
	- [[PathTracer Learning Temporal Accumulation]]
	- [[PathTracer Learning Concept Temporal Rejection]]
	- [[PathTracer Learning Tone Mapping]]
	- [[PathTracer Learning Anti-Aliasing]]
- ---
- ## Vulkan Concepts
  collapsed:: true
	- [[PathTracer Learning Async Compute]]
	- [[PathTracer Learning Device Address Bit]]
- ---
- ## Reference
  collapsed:: true
	- [[PathTracer Learning Books and Tutorials]]
	- [[PathTracer Learning Chat Analysis]]
		- Notes from the actual Godot NVPathtracer contributor chat
- ---
- ## Projects
  collapsed:: true
	- [[PathTracer Learning Project Math Library]]
	- [[PathTracer Learning Project CPU Path Tracer]]
	- [[PathTracer Learning Project Vulkan RT]]
-