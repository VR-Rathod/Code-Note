---
seoTitle: Ray Marching – SDF Rendering Complete Reference Guide
description: "Ray marching is a rendering technique using Signed Distance Functions (SDFs). Covers sphere tracing, SDF primitives, operations, ambient occlusion, and Shadertoy examples."
keywords: "ray marching, sphere tracing, SDF, signed distance function, Shadertoy, GLSL, rendering, distance fields, ambient occlusion, soft shadows, Inigo Quilez, GPU rendering"
treeTitle: Game Development - Path Tracing - Ray Marching
---

tags:: concept, ray-marching, sdf, glsl, shadertoy
title:: PathTracer Learning Ray Marching

- # Ray Marching
	- Ray marching is an alternative to traditional ray tracing where geometry is defined by **Signed Distance Functions (SDFs)** instead of triangles.
	- Much easier to get started with than Vulkan ray tracing — you can try it on [Shadertoy](https://www.shadertoy.com) in minutes.
	- Parent: [[PathTracer Learning]]
- ---
- ## Ray Marching vs Ray Tracing
	- | Property | Ray Tracing (triangles) | Ray Marching (SDFs) |
	  |---|---|---|
	  | Geometry | Triangle meshes | Mathematical functions |
	  | Intersection | Exact (Möller-Trumbore) | Approximate (step by step) |
	  | Speed | Fast (with BVH) | Slower (many steps) |
	  | Flexibility | Any mesh | Any mathematically definable shape |
	  | Procedural | ❌ Hard | ✅ Trivial |
	  | Deformations | ❌ Expensive | ✅ Free (just modify the SDF) |
	  | Getting started | ❌ Complex (BVH, pipeline) | ✅ ~50 lines of GLSL |
- ---
- ## Signed Distance Functions (SDFs)
	- An SDF `f(p)` returns the **signed distance** from a point `p` to the nearest surface
		- `f(p) > 0` — point is outside the surface
		- `f(p) = 0` — point is exactly on the surface
		- `f(p) < 0` — point is inside the surface
	- The sign tells you which side you're on
	- The magnitude tells you the minimum distance to the surface
	- This is what allows ray marching — you can safely step forward by `f(p)` without overshooting
- ---
- ## The Sphere Tracing Algorithm
	- ```glsl
	  float sphereTrace(vec3 ro, vec3 rd) {
	      float t = 0.0;   // distance traveled along the ray
	      for (int i = 0; i < 100; i++) {
	          vec3 p = ro + rd * t;       // current position
	          float d = sceneSDF(p);      // distance to nearest surface
	          if (d < 0.001) return t;    // HIT — close enough to surface
	          if (t > 100.0) break;       // MISS — too far
	          t += d;                     // safe to step forward by d
	      }
	      return -1.0; // no hit
	  }
	  ```
	- `ro` — ray origin (camera position)
	- `rd` — ray direction (unit vector)
	- `sceneSDF(p)` — returns minimum distance to any object in the scene
	- Key insight: because `d` is the true minimum distance, stepping by `d` guarantees we won't overshoot any surface
	- This is called **sphere tracing** — Keinert et al. 2014
- ---
- ## Basic SDF Primitives
	- All SDFs are functions `f(p) -> float` where `p` is a 3D point
	- ### Sphere
		- ```glsl
		  float sdSphere(vec3 p, float r) {
		      return length(p) - r;
		  }
		  ```
		- Sphere centered at origin with radius `r`
	- ### Box
		- ```glsl
		  float sdBox(vec3 p, vec3 b) {
		      vec3 q = abs(p) - b;
		      return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
		  }
		  ```
		- Axis-aligned box with half-extents `b`
		- The formula handles interior/exterior correctly
	- ### Torus
		- ```glsl
		  float sdTorus(vec3 p, vec2 t) {
		      vec2 q = vec2(length(p.xz) - t.x, p.y);
		      return length(q) - t.y;
		  }
		  ```
		- `t.x` — major radius (ring center), `t.y` — minor radius (tube)
	- ### Plane
		- ```glsl
		  float sdPlane(vec3 p, vec3 n, float h) {
		      return dot(p, n) + h;  // n must be unit vector
		  }
		  ```
	- ### Capsule
		- ```glsl
		  float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
		      vec3 pa = p - a, ba = b - a;
		      float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
		      return length(pa - ba * h) - r;
		  }
		  ```
		- Line segment from `a` to `b` with radius `r`
- ---
- ## SDF Operations
	- The real power of SDFs — combine primitives with simple math
	- ### Boolean Operations
		- ```glsl
		  // UNION — closest surface wins
		  float opUnion(float d1, float d2) { return min(d1, d2); }
		  
		  // SUBTRACTION — carve d2 from d1
		  float opSubtraction(float d1, float d2) { return max(d1, -d2); }
		  
		  // INTERSECTION — keep only overlap
		  float opIntersection(float d1, float d2) { return max(d1, d2); }
		  ```
	- ### Smooth Blending (Smooth Union)
		- ```glsl
		  float opSmoothUnion(float d1, float d2, float k) {
		      float h = max(k - abs(d1 - d2), 0.0) / k;
		      return min(d1, d2) - h * h * k * (1.0 / 4.0);
		  }
		  ```
		- `k` — blend radius (how far shapes merge into each other)
		- Creates organic blob-like merging between shapes
		- Inigo Quilez smooth min formula
	- ### Transformations
		- ```glsl
		  // Translation: subtract the offset from p
		  float sdSphereAt(vec3 p, vec3 pos, float r) {
		      return sdSphere(p - pos, r);
		  }
		  
		  // Rotation: multiply p by inverse rotation matrix
		  float sdRotated(vec3 p, mat3 R, ...) {
		      return sdShape(R * p, ...);
		  }
		  
		  // Scale: divide p and the result by scale factor
		  float sdScaled(vec3 p, float s) {
		      return sdShape(p / s) * s;
		  }
		  ```
	- ### Infinite Repetition
		- ```glsl
		  // Repeat space every period c
		  vec3 opRepeat(vec3 p, vec3 c) {
		      return mod(p + 0.5 * c, c) - 0.5 * c;
		  }
		  float sdRepeatedSpheres(vec3 p) {
		      return sdSphere(opRepeat(p, vec3(3.0)), 0.5);
		  }
		  ```
		- Infinite grid of shapes at zero cost — just a mod operation
- ---
- ## Computing the Normal
	- For lighting, we need the surface normal at the hit point
	- Numerical gradient of the SDF gives the normal:
	- ```glsl
	  vec3 calcNormal(vec3 p) {
	      const float eps = 0.001;
	      const vec2 h = vec2(eps, 0.0);
	      return normalize(vec3(
	          sceneSDF(p + h.xyy) - sceneSDF(p - h.xyy),
	          sceneSDF(p + h.yxy) - sceneSDF(p - h.yxy),
	          sceneSDF(p + h.yyx) - sceneSDF(p - h.yyx)
	      ));
	  }
	  ```
	- This is the central difference method — approximates the gradient `∇f`
	- The SDF gradient at a surface point is exactly the outward normal
- ---
- ## Lighting a Ray-Marched Scene
	- Once you have a hit point and normal, lighting works just like rasterization
	- ```glsl
	  vec3 render(vec3 ro, vec3 rd) {
	      float t = sphereTrace(ro, rd);
	      if (t < 0.0) return vec3(0.5, 0.7, 1.0); // sky color
	  
	      vec3 p = ro + rd * t;
	      vec3 N = calcNormal(p);
	      vec3 L = normalize(vec3(1.0, 2.0, 1.0)); // directional light
	  
	      // Diffuse
	      float diff = max(dot(N, L), 0.0);
	  
	      // Shadow — march toward light
	      float shadow = softShadow(p + N * 0.01, L, 0.01, 10.0, 16.0);
	  
	      // Ambient occlusion
	      float ao = calcAO(p, N);
	  
	      vec3 albedo = vec3(0.8, 0.3, 0.1);
	      return albedo * (diff * shadow + 0.1 * ao);
	  }
	  ```
- ---
- ## Soft Shadows
	- Ray march toward the light, track how close the ray gets to occluders
	- ```glsl
	  float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
	      float res = 1.0;
	      for (float t = mint; t < maxt; ) {
	          float h = sceneSDF(ro + rd * t);
	          if (h < 0.001) return 0.0; // fully occluded
	          res = min(res, k * h / t);  // softer as ray grazes surface
	          t += h;
	      }
	      return res;
	  }
	  ```
	- `k` — penumbra sharpness (larger = sharper shadows)
	- Classic Inigo Quilez technique — no area light needed
- ---
- ## Ambient Occlusion
	- March short steps along the normal, check how occluded the point is
	- ```glsl
	  float calcAO(vec3 pos, vec3 nor) {
	      float occ = 0.0;
	      float sca = 1.0;
	      for (int i = 0; i < 5; i++) {
	          float h = 0.01 + 0.12 * float(i) / 4.0;
	          float d = sceneSDF(pos + h * nor);
	          occ += (h - d) * sca;
	          sca *= 0.95;
	      }
	      return clamp(1.0 - 3.0 * occ, 0.0, 1.0);
	  }
	  ```
	- Free in ray marching — no rays to trace, just a few SDF evaluations
- ---
- ## A Complete Minimal Ray Marcher (Shadertoy)
	- Paste this into [shadertoy.com](https://www.shadertoy.com) — New Shader:
	- ```glsl
	  // Scene SDF — a sphere and a plane
	  float sceneSDF(vec3 p) {
	      float sphere = length(p - vec3(0,0.5,0)) - 0.5;
	      float plane  = p.y + 0.0;
	      return min(sphere, plane);
	  }
	  
	  // Sphere tracing
	  float trace(vec3 ro, vec3 rd) {
	      float t = 0.0;
	      for (int i = 0; i < 128; i++) {
	          float d = sceneSDF(ro + rd * t);
	          if (d < 0.001) return t;
	          if (t > 50.0) break;
	          t += d;
	      }
	      return -1.0;
	  }
	  
	  // Normal via SDF gradient
	  vec3 getNormal(vec3 p) {
	      vec2 e = vec2(0.001, 0.0);
	      return normalize(vec3(
	          sceneSDF(p+e.xyy) - sceneSDF(p-e.xyy),
	          sceneSDF(p+e.yxy) - sceneSDF(p-e.yxy),
	          sceneSDF(p+e.yyx) - sceneSDF(p-e.yyx)
	      ));
	  }
	  
	  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	      vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
	  
	      vec3 ro = vec3(0.0, 1.0, 3.0);        // camera position
	      vec3 rd = normalize(vec3(uv, -1.5));   // ray direction
	  
	      vec3 col = vec3(0.5, 0.7, 1.0);        // sky color default
	  
	      float t = trace(ro, rd);
	      if (t > 0.0) {
	          vec3 p = ro + rd * t;
	          vec3 N = getNormal(p);
	          vec3 L = normalize(vec3(1, 2, 1));
	          float diff = max(dot(N, L), 0.0);
	          col = vec3(0.8, 0.4, 0.1) * (diff + 0.1);
	      }
	  
	      fragColor = vec4(col, 1.0);
	  }
	  ```
- ---
- ## Ray Marching vs Ray Tracing — When to Use Which
	- ### Use Ray Marching when:
		- You want procedural geometry (fractals, terrain, fluid sims)
		- Learning and prototyping — Shadertoy is instant
		- Infinite/tileable scenes with repetition
		- Deformable/animated geometry (just modify the SDF)
		- Implicit surfaces (metaballs, CSG)
	- ### Use Ray Tracing (triangles + BVH) when:
		- You have actual 3D mesh assets (from Blender, Maya, etc.)
		- Need maximum performance for complex scenes
		- Building a game engine renderer
		- Working with the Vulkan RT or DXR pipeline
		- See [[PathTracer Learning Phase 2 CPU Ray Tracing]] and [[PathTracer Learning Phase 3 GPU and Vulkan]]
- ---
- ## Learning Resources
	- ### Shadertoy Examples (study these first!)
		- Inigo Quilez: "Raymarching Primitives" — https://shadertoy.com/view/Xds3zN
		- "Raymarching — Signed Distance Functions" — https://shadertoy.com/view/XllGW4
		- Search "ray march" on shadertoy.com for hundreds of examples
	- ### Best Written Guides
		- Inigo Quilez's SDF articles — https://iquilezles.org/articles/distfunctions/
			- The definitive SDF primitive reference — bookmark this
		- "Ray Marching Distance Fields" — Jamie Wong
		- "Modeling with Distance Functions" — Inigo Quilez
	- ### Video Tutorials
		- "Ray Marching for Dummies!" — The Art of Code (YouTube)
		- "Shader Coding: Ray Marching" — Sebastian Lague (YouTube)
		- "Making a Ray Marcher" — kishimisu (YouTube)
		- Inigo Quilez live coding streams (YouTube/Twitch)
- ---
- ## Checklist
	- TODO Understand what an SDF returns and what the sign means
	- TODO Can implement sphere, box, and plane SDFs from scratch
	- TODO Can implement smooth union with blending
	- TODO Understand why stepping by `d` is safe (won't overshoot)
	- TODO Can compute normals via SDF gradient
	- TODO Can add basic diffuse + shadow to a ray-marched scene
	- TODO Have run at least one scene in Shadertoy
- ---
- ## Related
	- [[PathTracer Learning Ray Definition]]
	- [[PathTracer Learning Ray Triangle Intersection]]
	- [[PathTracer Learning Physically Based Rendering]]
	- [[PathTracer Learning BRDF]]
	- [[PathTracer Learning Render Equation]]
	- [[PathTracer Learning Phase 2 CPU Ray Tracing]]