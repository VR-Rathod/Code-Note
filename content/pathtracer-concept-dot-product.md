---
seoTitle: Dot Product in 3D Graphics – Vector Math for Shading and Rays
description: "The dot product measures vector alignment, essential for lighting and ray tracing. Covers cosine angle, diffuse shading, specular highlights, and GLSL/HLSL."
keywords: "dot product, vector math, 3D graphics, ray tracing, path tracing, diffuse shading, specular highlights, GLSL, HLSL, GPU rendering, Vulkan, linear algebra"
---

tags:: concept, math, vectors, linear-algebra
title:: PathTracer Learning - Concept - Dot Product

- # Concept: Dot Product
	- Parent: [[PathTracer Learning - Phase 1 - Math for Graphics]]
- ---
- ## Definition
	- `a · b = a.x*b.x + a.y*b.y + a.z*b.z`
	- Geometric interpretation: `a · b = |a| * |b| * cos(θ)`
	- When both vectors are unit length: `a · b = cos(θ)`
	- Result is a scalar (single number), not a vector
- ---
- ## Key Properties
	- Commutative: `a · b = b · a`
	- Distributive: `a · (b + c) = a·b + a·c`
	- `a · a = |a|²` — dot product with itself = squared length
	- `dot(a, b) > 0` → angle < 90° (same general direction)
	- `dot(a, b) = 0` → angle = 90° (perpendicular)
	- `dot(a, b) < 0` → angle > 90° (opposite general direction)
- ---
- ## Uses in Path Tracing
	- Lambert's cosine law
		- `irradiance = L_i * dot(N, L)` where N=normal, L=light direction
		- `dot(N, L)` gives the cosine of the angle of incidence
		- Clamp to 0: `max(0, dot(N, L))` — light from behind contributes nothing
	- Checking ray direction vs surface normal
		- `dot(ray.dir, N) < 0` → ray hits front face
		- `dot(ray.dir, N) > 0` → ray hits back face
		- Used to flip normals for double-sided materials
	- Reflection formula derivation
		- Project `v` onto `n`: `proj = dot(v, n) * n`
		- Reflection: `reflect(v, n) = v - 2 * dot(v, n) * n`
	- BRDF evaluation
		- `NdotL = max(0, dot(N, L))` — diffuse factor
		- `NdotV = max(0, dot(N, V))` — view factor
		- `NdotH = max(0, dot(N, H))` — half-vector factor (specular)
		- `VdotH = max(0, dot(V, H))` — Fresnel factor
- ---
- ## GLSL
	- `float d = dot(vec3 a, vec3 b);`
	- Works for vec2, vec3, vec4
	- Hardware-accelerated — single instruction on GPU
- ---
- ## Common Mistakes
	- Forgetting to normalize before using as cosine
		- `dot(a, b)` is NOT `cos(θ)` unless both are unit vectors
		- Always normalize direction vectors: `normalize(v)`
	- Not clamping to 0
		- `dot(N, L)` can be negative (light behind surface)
		- Use `max(0.0, dot(N, L))` in lighting calculations
