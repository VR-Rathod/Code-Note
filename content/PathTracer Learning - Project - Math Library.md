---
date: 2026-04-03T15:14:37+05:30
lastmod: 2026-04-03T15:14:37+05:30

seoTitle: Path Tracer Math Library – Vector, Matrix, and Ray Math Reference
description: "Math library for path tracing covering Vec3, Mat4, Ray, Transform, quaternion operations, and SIMD optimization for high-performance rendering."
keywords: "path tracer math library, Vec3, Mat4, Ray, Transform, quaternion, SIMD, path tracing, ray tracing, GPU rendering, Vulkan, linear algebra"
---

tags:: project, math, implementation
title:: PathTracer Learning - Project - Math Library

- # Project: Math Library
	- Parent: [[PathTracer Learning]]
	- Phase: [[PathTracer Learning - Phase 1 - Math for Graphics]]
- ---
- ## Goal
	- Build a minimal math library for the CPU path tracer
	- Understand the math by implementing it, not just using GLM
- ---
- ## Components to Implement
	- Vec3
		- `+`, `-`, `*`, `/` operators (component-wise and scalar)
		- `dot(a, b)` — dot product
		- `cross(a, b)` — cross product
		- `length(v)` — Euclidean length
		- `normalize(v)` — unit vector
		- `reflect(v, n)` — reflection
		- `refract(v, n, eta)` — refraction (Snell's law)
		- `lerp(a, b, t)` — linear interpolation
	- Ray
		- `origin`, `direction` fields
		- `at(t)` — point along ray
	- Transform (4×4 matrix)
		- `translate`, `rotate`, `scale` constructors
		- Matrix multiply
		- `transform_point(p)` — apply to point (w=1)
		- `transform_direction(d)` — apply to direction (w=0)
		- `inverse()` — for normal transform
- ---
- ## Test Cases
	- `dot(vec3(1,0,0), vec3(0,1,0)) == 0` (perpendicular)
	- `dot(vec3(1,0,0), vec3(1,0,0)) == 1` (parallel unit vectors)
	- `length(normalize(v)) == 1` for any non-zero v
	- `cross(vec3(1,0,0), vec3(0,1,0)) == vec3(0,0,1)` (right-hand rule)
	- `reflect(vec3(1,-1,0), vec3(0,1,0)) == vec3(1,1,0)` (mirror in XZ plane)
- ---
- ## Notes
	- Use `float` not `double` — GPU uses float, keep consistent
	- SIMD optimization later — get correctness first
	- Consider using GLM for the actual path tracer once concepts are understood