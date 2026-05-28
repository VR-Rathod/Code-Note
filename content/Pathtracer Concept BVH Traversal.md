---
seoTitle: BVH Traversal – Ray-BVH Intersection and Traversal Algorithms
description: "BVH traversal finds ray-scene intersections efficiently. Covers stackless traversal, MBVH, persistent threads, wavefront path tracing, and GPU traversal."
keywords: "BVH traversal, bounding volume hierarchy, ray tracing, path tracing, stackless traversal, MBVH, GPU traversal, Vulkan, ray-BVH intersection, GPU rendering, acceleration"
---

tags:: concept, bvh, traversal, algorithm
title:: Pathtracer Concept BVH Traversal

- # Concept: BVH Traversal
	- Parent: [[PathTracer Learning Phase 2 CPU Ray Tracing]]
- ---
- ## Basic Traversal Algorithm
	- Recursive version (conceptual)
		- ```
		  float traverse(Ray ray, BVHNode node):
		      if not intersect(ray, node.aabb): return infinity
		      if node.is_leaf:
		          return intersect_primitives(ray, node.primitives)
		      t_left  = traverse(ray, node.left)
		      t_right = traverse(ray, node.right)
		      return min(t_left, t_right)
		  ```
	- Iterative version (GPU-friendly — no recursion)
		- Use an explicit stack (array of node indices)
		- ```glsl
		  float traverseBVH(Ray ray) {
		      int stack[64];
		      int stackPtr = 0;
		      stack[stackPtr++] = 0;  // root node
		      float tMin = infinity;
		      
		      while (stackPtr > 0) {
		          int nodeIdx = stack[--stackPtr];
		          BVHNode node = bvhNodes[nodeIdx];
		          
		          float t;
		          if (!intersectAABB(ray, node.aabb_min, node.aabb_max, t)) continue;
		          if (t > tMin) continue;  // already found closer hit
		          
		          if (node.prim_count > 0) {  // leaf
		              for (int i = 0; i < node.prim_count; i++) {
		                  float tHit = intersectTriangle(ray, node.prim_offset + i);
		                  tMin = min(tMin, tHit);
		              }
		          } else {  // internal
		              stack[stackPtr++] = node.left_child;
		              stack[stackPtr++] = node.left_child + 1;  // right child
		          }
		      }
		      return tMin;
		  }
		  ```
- ---
- ## Ordered Traversal (Optimization)
	- Visit the closer child first
	- If closer child has a hit, the farther child may be skipped entirely
	- How to determine closer child
		- Compare AABB intersection distances: `t_left` vs `t_right`
		- Push farther child first (so closer child is on top of stack)
	- Significant speedup for primary rays (coherent rays)
	- Less benefit for secondary rays (incoherent)
- ---
- ## Shadow Ray Optimization
	- Shadow rays only need to know IF there's a hit, not WHICH hit
	- Use `gl_RayFlagsTerminateOnFirstHitEXT` in Vulkan
	- In software BVH: return immediately on first primitive hit
	- Avoids traversing the entire BVH for occlusion queries
- ---
- ## Stack Overflow
	- BVH depth can exceed stack size for degenerate trees
	- Typical max depth: 30-40 for well-built BVH
	- Stack size of 64 is usually sufficient
	- Degenerate case: all primitives in a line → depth = N (use SAH to avoid)
- ---
- ## GPU Traversal Considerations
	- Warp divergence
		- Different threads in a warp may take different BVH paths
		- Reduces GPU utilization (some threads idle while others traverse)
		- Hardware RT (Vulkan) handles this internally — major advantage
	- Memory access patterns
		- BVH nodes should be in a contiguous buffer (good cache behavior)
		- Leaf primitives should be sorted to match BVH order
	- Persistent threads
		- Keep threads alive across multiple rays (avoid kernel launch overhead)
		- Used in production GPU path tracers
- ---
- ## Related
	- [[PathTracer Learning BVH Construction]]
	- [[PathTracer Learning AABB]]
	- [[PathTracer Learning BLAS and TLAS]]