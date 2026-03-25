---
seoTitle: BVH Construction – Building Bounding Volume Hierarchies Guide
description: "BVH construction organizes scene geometry for fast ray intersection. Covers SAH, median split, LBVH, HLBVH, GPU BVH construction, and quality vs build time."
keywords: "BVH construction, bounding volume hierarchy, SAH, surface area heuristic, LBVH, ray tracing, path tracing, GPU rendering, Vulkan, acceleration structure, BVH"
---

tags:: concept, bvh, acceleration-structure, algorithm
title:: PathTracer Learning - Concept - BVH Construction

- # Concept: BVH Construction
	- Parent: [[PathTracer Learning - Phase 2 - CPU Ray Tracing]]
- ---
- ## What is a BVH?
	- Bounding Volume Hierarchy — a tree of bounding volumes
	- Each node contains an AABB that bounds all geometry in its subtree
	- Leaf nodes contain actual primitives (triangles)
	- Internal nodes have exactly 2 children (binary tree)
	- Purpose: reduce ray-scene intersection from O(N) to O(log N)
- ---
- ## Naive Construction (Midpoint Split)
	- Algorithm
		- 1. Compute AABB of all primitives in current node
		- 2. Find the longest axis (x, y, or z)
		- 3. Sort primitives by centroid along that axis
		- 4. Split at midpoint
		- 5. Recurse on left and right halves
		- 6. Stop when ≤ N_leaf primitives (e.g., N_leaf = 4)
	- Simple but suboptimal — can create unbalanced trees
	- Degenerate case: all centroids on a plane → one child has all primitives
- ---
- ## SAH (Surface Area Heuristic)
	- The standard for high-quality BVH construction
	- Cost model
		- `C(node) = C_traversal + (SA_left/SA_parent) * N_left * C_intersect + (SA_right/SA_parent) * N_right * C_intersect`
		- `C_traversal` — cost of testing a node's AABB (~1)
		- `C_intersect` — cost of testing a primitive (~2-4 for triangles)
		- `SA_left/SA_parent` — probability that a random ray hits the left child given it hits the parent
	- Algorithm
		- For each axis (x, y, z):
			- Sort primitives by centroid
			- Try all N-1 split positions
			- Compute SAH cost for each split
		- Choose the axis and split position with minimum cost
		- If best split cost > cost of making a leaf: make a leaf
	- Binned SAH (faster approximation)
		- Instead of trying all N-1 splits, divide axis into K bins (e.g., K=32)
		- Assign each primitive to a bin based on centroid
		- Try K-1 split positions between bins
		- O(N) per level instead of O(N log N)
		- Quality is nearly identical to full SAH for K ≥ 16
- ---
- ## BVH Build Strategies
	- Top-down (most common)
		- Start with all primitives, recursively split
		- Good quality, O(N log N) with SAH
	- Bottom-up (LBVH, HLBVH)
		- Sort primitives by Morton code (space-filling curve)
		- Build tree bottom-up from sorted order
		- Very fast (GPU-friendly), slightly lower quality
		- Used for real-time BLAS builds in Vulkan
		- Morton code: interleave bits of (x, y, z) coordinates
			- ```cpp
			  uint32_t expandBits(uint32_t v) {
			      v = (v * 0x00010001u) & 0xFF0000FFu;
			      v = (v * 0x00000101u) & 0x0F00F00Fu;
			      v = (v * 0x00000011u) & 0xC30C30C3u;
			      v = (v * 0x00000005u) & 0x49249249u;
			      return v;
			  }
			  uint32_t morton3D(float x, float y, float z) {
			      return (expandBits((uint32_t)(x*1024)) << 2) |
			             (expandBits((uint32_t)(y*1024)) << 1) |
			              expandBits((uint32_t)(z*1024));
			  }
			  ```
	- Locally Ordered Clustering (PLOC)
		- Better quality than LBVH, still GPU-friendly
		- Used in some production renderers
- ---
- ## BVH Refitting
	- For animated scenes: update AABBs without rebuilding the tree structure
	- Bottom-up: update leaf AABBs from new vertex positions, propagate up
	- Fast but BVH quality degrades as objects move far from original positions
	- Use for small deformations (cloth, skinned meshes with small motion)
	- Full rebuild needed for large topology changes
- ---
- ## BVH Quality Metrics
	- SAH cost — lower is better
	- Average traversal steps per ray — measure empirically
	- Tree depth — affects stack size for traversal
	- Leaf size — 1-8 primitives per leaf is typical
- ---
- ## Implementation Notes
	- Store BVH as flat array (not pointer-based tree)
		- Better cache performance
		- `node[i].left_child = 2*i+1`, `node[i].right_child = 2*i+2` (for complete binary tree)
		- Or store explicit child indices
	- Compact node layout
		- ```
		  struct BVHNode {
		      vec3 aabb_min;    // 12 bytes
		      int  left_child;  //  4 bytes (or primitive offset for leaf)
		      vec3 aabb_max;    // 12 bytes
		      int  prim_count;  //  4 bytes (0 = internal node, >0 = leaf)
		  };  // 32 bytes total — fits in one cache line
		  ```
	- Primitive reordering
		- After BVH build: reorder primitives to match BVH leaf order
		- Improves cache coherence during traversal
		- Triangles accessed together are stored together in memory
- ---
- ## Wide BVH (BVH4, BVH8)
	- Instead of binary tree: 4 or 8 children per node
	- Better SIMD utilization — test 4/8 AABBs simultaneously
	- Used in Embree (Intel's CPU ray tracing library)
	- Slightly more complex traversal but significantly faster on modern CPUs
- ---
- ## Related
	- [[PathTracer Learning - Concept - AABB]]
	- [[PathTracer Learning - Concept - BVH Traversal]]
	- [[PathTracer Learning - BLAS and TLAS]]
