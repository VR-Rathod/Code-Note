---
seoTitle: Cross Product in 3D Graphics – Vector Math for Ray Tracing Guide
description: "The cross product computes perpendicular vectors essential for 3D graphics. Covers geometric interpretation, normal computation, tangent space, and GLSL/HLSL."
keywords: "cross product, vector math, 3D graphics, ray tracing, path tracing, normal computation, tangent space, GLSL, HLSL, GPU rendering, Vulkan, linear algebra"
---

tags:: concept, math, vectors, linear-algebra
title:: PathTracer Learning Cross Product

- # Concept: Cross Product
	- Parent: [[PathTracer Learning Phase 1 Math for Graphics]]
- ---
- ## Definition
	- `a × b = (a.y*b.z - a.z*b.y, a.z*b.x - a.x*b.z, a.x*b.y - a.y*b.x)`
	- Result is a vector perpendicular to both `a` and `b`
	- Magnitude: `|a × b| = |a| * |b| * sin(θ)`
	- Direction: right-hand rule (curl fingers from a to b, thumb points in result direction)
- ---
- ## Key Properties
	- Anti-commutative: `a × b = -(b × a)` — ORDER MATTERS
	- `a × a = (0, 0, 0)` — cross product with itself is zero
	- `|a × b|` = area of parallelogram formed by a and b
	- If `a × b = 0`, vectors are parallel (or one is zero)
- ---
- ## Uses in Path Tracing
	- Building orthonormal basis (TBN matrix)
		- Given normal `N`, need tangent `T` and bitangent `B`
		- `T = normalize(cross(N, up))` where `up = (0,1,0)` (or (1,0,0) if N is near up)
		- `B = cross(N, T)` — already unit length if N and T are unit
		- Used to transform sampled directions from tangent space to world space
	- Triangle normal computation
		- Given vertices `v0, v1, v2`:
		- `edge1 = v1 - v0`
		- `edge2 = v2 - v0`
		- `N = normalize(cross(edge1, edge2))`
		- Winding order determines which side is "front"
	- Möller–Trumbore intersection
		- `h = cross(ray.dir, edge2)`
		- `det = dot(edge1, h)` — used to detect parallel ray
		- `q = cross(s, edge1)` — used to compute barycentric v
- ---
- ## GLSL
	- `vec3 c = cross(vec3 a, vec3 b);`
	- Only defined for vec3 (not vec2 or vec4)
- ---
- ## Degenerate Cases
	- If `N` is nearly parallel to `up = (0,1,0)`:
		- `cross(N, up)` → near-zero vector → unstable normalization
		- Solution: choose `up = (1,0,0)` when `|dot(N, (0,1,0))| > 0.9`
		- Or use Frisvad/Duff method (see [[PathTracer Learning Phase 1 Math for Graphics]])