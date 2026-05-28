---
seoTitle: Ray Definition in Path Tracing – Parametric Form Guide
description: "Rays are the fundamental primitive in ray tracing. Covers ray parametric form, origin, direction normalization, ray-object intersection, and ray generation in."
keywords: "ray definition, ray tracing, path tracing, ray origin, ray direction, parametric form, ray-object intersection, ray generation, GPU rendering, Vulkan, GLSL"
---

tags:: concept, ray-tracing, geometry
title:: PathTracer Learning Ray Definition

- # Concept: Ray Definition
	- Parent: [[PathTracer Learning Phase 2 CPU Ray Tracing]]
- ---
- ## Mathematical Definition
	- `P(t) = origin + t * direction`
	- `origin` — 3D point where the ray starts
	- `direction` — 3D unit vector (should be normalized)
	- `t` — parameter: distance along the ray
	- `t > 0` → point is in front of origin
	- `t < 0` → point is behind origin (usually invalid)
- ---
- ## Ray Interval [t_min, t_max]
	- Not all values of `t` are valid
	- `t_min > 0` — avoids self-intersection (shadow acne)
		- Typical value: `0.001` or `1e-4`
		- Too small → shadow acne (ray hits its own surface)
		- Too large → misses nearby geometry (light leaking)
	- `t_max` — maximum ray distance
		- For primary rays: `infinity` (or very large number like `1e10`)
		- For shadow rays: `distance_to_light - epsilon`
		- Prevents shadow rays from hitting geometry behind the light
- ---
- ## Ray Types in a Path Tracer
	- Primary ray (camera ray)
		- Origin: camera position
		- Direction: through pixel (with optional jitter for anti-aliasing)
		- `t_min = 0.001`, `t_max = infinity`
	- Secondary ray (bounce ray)
		- Origin: hit point + offset along normal (to avoid self-intersection)
		- Direction: sampled from BRDF
		- `t_min = 0.001`, `t_max = infinity`
	- Shadow ray (visibility test)
		- Origin: hit point + offset
		- Direction: toward light sample
		- `t_min = 0.001`, `t_max = distance_to_light * 0.999`
		- Only need to know if occluded — use `gl_RayFlagsTerminateOnFirstHitEXT`
- ---
- ## Self-Intersection Problem
	- When a ray bounces off a surface, the new ray origin is ON the surface
	- Floating point imprecision → ray may intersect the same surface again
	- Solutions
		- Offset origin along normal: `origin = hit_point + N * 0.001`
		- Use `t_min = 0.001` (reject very close hits)
		- Offset in ray direction: `origin = hit_point + ray_dir * 0.001` (for refraction)
	- For refraction (ray going INTO surface)
		- Offset in the OPPOSITE normal direction: `origin = hit_point - N * 0.001`
- ---
- ## GLSL Representation
	- ```glsl
	  struct Ray {
	      vec3 origin;
	      vec3 direction;  // should be normalized
	  };
	  
	  vec3 rayAt(Ray r, float t) {
	      return r.origin + t * r.direction;
	  }
	  ```