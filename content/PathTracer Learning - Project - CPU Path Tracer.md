---
seoTitle: CPU Path Tracer Project – Implementation Notes and Architecture
description: "CPU path tracer project covering scene representation, BVH, materials, camera, Monte Carlo sampling, and progressive rendering implementation details."
keywords: "CPU path tracer, path tracing, ray tracing, BVH, materials, camera, Monte Carlo, progressive rendering, C++ path tracer, project notes, GPU rendering"
---

tags:: project, cpu, path-tracing, implementation
title:: PathTracer Learning - Project - CPU Path Tracer

- # Project: CPU Path Tracer
	- Parent: [[PathTracer Learning]]
	- Phase: [[PathTracer Learning - Phase 2 - CPU Ray Tracing]]
- ---
- ## Goal
	- Render a Cornell box scene with global illumination
	- Implement all core path tracing concepts before moving to GPU
- ---
- ## Milestones
	- Milestone 1: Ray-sphere intersection + simple shading
		- Cast rays through pixels
		- Intersect with spheres (simpler than triangles)
		- Shade with surface normal (no lighting yet)
		- Output PPM image
	- Milestone 2: Ray-triangle intersection + BVH
		- Implement Möller–Trumbore
		- Build BVH with SAH
		- Load OBJ file (Cornell box)
	- Milestone 3: Lambertian path tracing
		- Cosine-weighted hemisphere sampling
		- Recursive path tracing (fixed depth)
		- Accumulate samples over multiple frames
	- Milestone 4: Russian roulette + NEE
		- Add Russian roulette termination
		- Add next event estimation for area lights
		- MIS weighting
	- Milestone 5: GGX specular
		- Implement GGX BRDF
		- GGX importance sampling
		- Mix diffuse and specular based on metallic/roughness
- ---
- ## Reference Scenes
	- Cornell box — classic test scene
		- Two colored walls (red left, green right)
		- White floor, ceiling, back wall
		- Two boxes (one tall, one short)
		- Area light on ceiling
	- Veach MIS test scene — tests MIS correctness
		- Multiple lights of different sizes
		- Glossy floor with varying roughness
- ---
- ## Output
	- PPM or PNG image
	- Resolution: 512×512 for development, 1920×1080 for final
	- Samples: 64 spp for quick preview, 4096 spp for reference
- ---
- ## Code Structure
	- ```
	  src/
	    math/     - Vec3, Ray, Transform
	    geometry/ - Triangle, AABB, BVH
	    material/ - Lambertian, GGX, BRDF interface
	    scene/    - Scene, Camera, Light
	    renderer/ - PathTracer, Accumulator
	    main.cpp  - Entry point, image output
	  ```