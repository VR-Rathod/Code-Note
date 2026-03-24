tags:: concept, geometry, intersection, algorithm
title:: PathTracer Learning - Concept - Ray-Triangle Intersection

- # Concept: Ray-Triangle Intersection
	- Parent: [[PathTracer Learning - Phase 2 - CPU Ray Tracing]]
- ---
- ## Möller–Trumbore Algorithm
	- The standard algorithm — used in virtually all ray tracers
	- Fast, numerically stable, returns barycentric coordinates
	- Paper: "Fast, Minimum Storage Ray/Triangle Intersection" (1997)
- ---
- ## Derivation
	- A point on a triangle: `P = (1-u-v)*v0 + u*v1 + v*v2`
		- `u, v ≥ 0` and `u + v ≤ 1` for points inside the triangle
		- `u, v` are barycentric coordinates
	- Ray equation: `P = origin + t * direction`
	- Set equal: `origin + t*dir = (1-u-v)*v0 + u*v1 + v*v2`
	- Rearrange: `[-dir, v1-v0, v2-v0] * [t, u, v]^T = origin - v0`
	- Solve with Cramer's rule
- ---
- ## Implementation
	- ```glsl
	  bool rayTriangle(Ray ray, vec3 v0, vec3 v1, vec3 v2,
	                   out float t, out float u, out float v) {
	      vec3 edge1 = v1 - v0;
	      vec3 edge2 = v2 - v0;
	      vec3 h = cross(ray.direction, edge2);
	      float det = dot(edge1, h);
	      
	      // det ≈ 0 means ray is parallel to triangle
	      if (abs(det) < 1e-8) return false;
	      
	      float invDet = 1.0 / det;
	      vec3 s = ray.origin - v0;
	      u = dot(s, h) * invDet;
	      if (u < 0.0 || u > 1.0) return false;
	      
	      vec3 q = cross(s, edge1);
	      v = dot(ray.direction, q) * invDet;
	      if (v < 0.0 || u + v > 1.0) return false;
	      
	      t = dot(edge2, q) * invDet;
	      return t > 1e-4;  // t_min to avoid self-intersection
	  }
	  ```
- ---
- ## Back-Face Culling
	- `det < 0` means ray hits the back face of the triangle
	- For opaque geometry: `if (det < 1e-8) return false;` (cull back faces)
	- For double-sided materials: use `abs(det)`
	- In Vulkan: `VK_GEOMETRY_INSTANCE_TRIANGLE_FACING_CULL_DISABLE_BIT_KHR` disables culling
- ---
- ## Barycentric Coordinates
	- `(1-u-v, u, v)` — weights for vertices `v0, v1, v2`
	- Interpolate any vertex attribute: `attr = (1-u-v)*a0 + u*a1 + v*a2`
	- Normal interpolation: `N = normalize((1-u-v)*n0 + u*n1 + v*n2)`
	- UV interpolation: `uv = (1-u-v)*uv0 + u*uv1 + v*uv2`
	- In Vulkan closest-hit shader: `hitAttributeEXT vec2 baryCoords;`
		- `baryCoords.x = u`, `baryCoords.y = v`
		- `w = 1 - u - v`
- ---
- ## Watertight Intersection
	- Standard Möller–Trumbore can miss edges/vertices due to floating point
	- Watertight algorithm (Woop et al. 2013) — no gaps at shared edges
	- Important for production renderers — prevents light leaking through cracks
	- Technique: transform ray to a coordinate system where it points along +Z
- ---
- ## Related
	- [[PathTracer Learning - Concept - Ray Definition]]
	- [[PathTracer Learning - Concept - BVH Traversal]]
