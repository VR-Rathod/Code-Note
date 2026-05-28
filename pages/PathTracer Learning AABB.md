---
seoTitle: AABB in Ray Tracing – Axis-Aligned Bounding Box Explained
description: "Axis-aligned bounding boxes (AABB) are fundamental for BVH construction in ray tracing. Covers slab method intersection, surface area heuristic, and GPU."
keywords: "AABB, axis-aligned bounding box, ray tracing, BVH, slab method, ray-AABB intersection, surface area heuristic, path tracing, GPU rendering, Vulkan, acceleration structure"
title: PathTracer Learning AABB
---

tags:: concept, bvh, acceleration-structure, geometry
title:: PathTracer Learning - Concept - AABB
title: PathTracer Learning AABB

- # Concept: AABB (Axis-Aligned Bounding Box)
	- Parent: [[PathTracer Learning Phase 2 CPU Ray Tracing]]
- ---
- ## Definition
	- A box whose faces are aligned with the coordinate axes
	- Defined by two points: `min = (x_min, y_min, z_min)` and `max = (x_max, y_max, z_max)`
	- Every point `P` inside satisfies: `min.x ≤ P.x ≤ max.x` (and same for y, z)
	- "Axis-aligned" means no rotation — simplifies intersection math enormously
- ---
- ## Ray-AABB Intersection (Slab Method)
	- Treat the AABB as the intersection of 3 pairs of parallel planes (slabs)
	- For each axis, compute entry and exit `t` values
		- `t_x_min = (min.x - ray.origin.x) / ray.direction.x`
		- `t_x_max = (max.x - ray.origin.x) / ray.direction.x`
		- If `ray.direction.x < 0`, swap min and max
	- Combine all 3 axes
		- `t_enter = max(t_x_min, t_y_min, t_z_min)` — ray enters the box
		- `t_exit  = min(t_x_max, t_y_max, t_z_max)` — ray exits the box
	- Hit condition: `t_enter <= t_exit && t_exit > t_min`
	- Implementation
		- ```glsl
		  bool intersectAABB(Ray ray, vec3 boxMin, vec3 boxMax, out float tNear) {
		      vec3 invDir = 1.0 / ray.direction;
		      vec3 t0 = (boxMin - ray.origin) * invDir;
		      vec3 t1 = (boxMax - ray.origin) * invDir;
		      vec3 tMin = min(t0, t1);
		      vec3 tMax = max(t0, t1);
		      float tEnter = max(max(tMin.x, tMin.y), tMin.z);
		      float tExit  = min(min(tMax.x, tMax.y), tMax.z);
		      tNear = tEnter;
		      return tEnter <= tExit && tExit > 0.0;
		  }
		  ```
	- Note: `invDir = 1.0 / ray.direction` precomputed for efficiency
	- Handle `direction = 0` case: `invDir = ±infinity`, which works correctly with IEEE 754
- ---
- ## AABB Construction
	- From a set of points: `min = componentwise_min(all_points)`, `max = componentwise_max(all_points)`
	- From a triangle: `min = min(v0, v1, v2)`, `max = max(v0, v1, v2)`
	- Merging two AABBs: `merged.min = min(a.min, b.min)`, `merged.max = max(a.max, b.max)`
- ---
- ## Surface Area
	- `SA = 2 * (dx*dy + dy*dz + dz*dx)` where `dx = max.x - min.x` etc.
	- Used in SAH (Surface Area Heuristic) for BVH construction
	- Intuition: larger surface area → more likely to be hit by a random ray
- ---
- ## Why AABB and Not OBB?
	- OBB (Oriented Bounding Box) fits tighter but intersection is much more expensive
	- AABB intersection: ~6 divisions, ~6 comparisons
	- OBB intersection: requires transforming ray to box space (matrix multiply)
	- BVH with AABBs is fast enough in practice — hardware RT uses AABBs
- ---
- ## Related
	- [[PathTracer Learning BVH Construction]]
	- [[Pathtracer Concept BVH Traversal]]