---
seoTitle: Normal Mapping in Path Tracing – Tangent Space and TBN Guide
description: "Normal mapping adds surface detail without extra geometry. Covers tangent space, TBN matrix, normal map sampling, and implementation in path tracing shaders."
keywords: "normal mapping, tangent space, TBN matrix, path tracing, ray tracing, surface detail, normal map, GPU rendering, Vulkan, GLSL, physically-based rendering, shading"
---

tags:: concept, shading, normal-map, tangent-space, materials
title:: PathTracer Learning - Concept - Normal Mapping

- # Concept: Normal Mapping
	- Parent: [[PathTracer Learning - Phase 2 - CPU Ray Tracing]]
- ---
- ## What Is Normal Mapping?
	- Technique to add surface detail without adding geometry
	- A texture stores per-pixel surface normals (in tangent space)
	- The shading normal is perturbed based on the texture
	- Result: the surface appears to have bumps and grooves at no geometry cost
- ---
- ## Tangent Space
	- A local coordinate system defined per surface point
	- Axes: `T` (tangent), `B` (bitangent), `N` (normal)
	- `N` — geometric surface normal
	- `T` — tangent direction, aligned with UV `u` axis
	- `B` — bitangent, aligned with UV `v` axis, `B = cross(N, T)`
	- Normal map stores normals in this local space
		- Flat surface: `(0, 0, 1)` in tangent space → encoded as `(0.5, 0.5, 1.0)` in texture
		- Bump pointing right: `(1, 0, 0)` → encoded as `(1.0, 0.5, 0.5)`
- ---
- ## TBN Matrix
	- Transforms from tangent space to world space
	- `TBN = mat3(T, B, N)` — columns are the tangent space axes in world space
	- `world_normal = normalize(TBN * tangent_space_normal)`
	- Computing T and B from mesh data
		- Stored per-vertex in the mesh (precomputed from UVs)
		- Or computed in shader from UV derivatives: `dFdx(uv)`, `dFdy(uv)`
	- Mikktspace (Mikkelsen 2008)
		- Standard algorithm for computing tangents
		- Used by Blender, Godot, Unreal, Unity
		- Ensures consistent tangents across different tools
- ---
- ## Normal Map Encoding
	- Tangent-space normal maps: blue-ish (most normals point up = (0,0,1))
	- Decode: `N = normalize(texture(normalMap, uv).rgb * 2.0 - 1.0)`
	- BC5 compression: stores only RG channels (Z reconstructed as `sqrt(1 - R² - G²)`)
	- OpenGL vs DirectX convention: Y axis is flipped
		- OpenGL: `+Y` = up in tangent space
		- DirectX: `-Y` = up in tangent space
		- Fix: `N.y = -N.y` when loading DirectX normal maps in OpenGL
- ---
- ## In a Path Tracer
	- Use the perturbed normal for BRDF evaluation and sampling
	- ```glsl
	  // In closest-hit shader
	  vec3 geo_normal = normalize(interpolate_normal(bary));  // geometric normal
	  vec3 tangent    = normalize(interpolate_tangent(bary));
	  vec3 bitangent  = cross(geo_normal, tangent) * tangent_sign;
	  mat3 TBN        = mat3(tangent, bitangent, geo_normal);
	  
	  vec3 map_normal = texture(normalMap, uv).rgb * 2.0 - 1.0;
	  vec3 shading_normal = normalize(TBN * map_normal);
	  
	  // Use shading_normal for BRDF, not geo_normal
	  ```
	- Important: use geometric normal for ray offset (avoid self-intersection)
	- Use shading normal for BRDF evaluation
- ---
- ## Bump Mapping vs Normal Mapping vs Displacement
	- Bump mapping: height texture → compute normal from height gradient
		- `N = normalize(N + dh/du * T + dh/dv * B)`
	- Normal mapping: directly store normals in texture (more control)
	- Displacement mapping: actually move vertices based on height texture
		- Requires tessellation or ray marching
		- True geometric detail — correct silhouettes and self-shadowing
- ---
- ## Geometric vs Shading Normal Consistency
	- Problem: shading normal can point away from the ray direction
		- Happens at silhouette edges where normal interpolation creates inconsistencies
		- `dot(ray_dir, shading_normal) > 0` — ray hits "back" of shading normal
	- Fix: flip shading normal if inconsistent with geometric normal
		- ```glsl
		  if (dot(shading_normal, -ray_dir) < 0.0) {
		      shading_normal = reflect(shading_normal, geo_normal);
		  }
		  ```
	- Or: use geometric normal for ray offset, shading normal for BRDF only
- ---
- ## Related
	- [[PathTracer Learning - Concept - Cross Product]]
	- [[PathTracer Learning - Concept - BRDF]]
	- [[PathTracer Learning - Phase 1 - Math for Graphics]]
