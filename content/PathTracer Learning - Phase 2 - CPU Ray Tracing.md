---
seoTitle: CPU Ray Tracing – Building a Software Ray Tracer from Scratch
description: "CPU ray tracing implementation covering ray-sphere intersection, shading, reflections, BVH, and building a complete software ray tracer in C++ or Python."
keywords: "CPU ray tracing, software ray tracer, ray-sphere intersection, shading, reflections, BVH, C++ ray tracer, path tracing, ray tracing, Monte Carlo, rendering"
---

tags:: phase, cpu, ray-tracing, bvh, brdf
title:: PathTracer Learning - Phase 2 - CPU Ray Tracing

- # Phase 2 — CPU Ray Tracing
	- Build a software path tracer before touching Vulkan. Understanding the algorithm on CPU makes the GPU version much clearer.
	- Reference: "Ray Tracing in One Weekend" series by Peter Shirley
	- Parent: [[PathTracer Learning]]
- ---
- ## 2.1 Camera and Ray Generation
	- [[PathTracer Learning - Concept - Camera Model]]
		- Pinhole camera: rays through pixel centers
		- Thin lens: depth of field via aperture sampling
		- Anti-aliasing: jitter ray within pixel footprint
	- Generating a camera ray
		- ```c++
		  Ray generateRay(Camera cam, float u, float v) {
		      // u, v in [0,1] — pixel UV with jitter for AA
		      vec3 horizontal = cam.right * cam.viewport_width;
		      vec3 vertical   = cam.up    * cam.viewport_height;
		      vec3 lower_left = cam.origin - horizontal/2 - vertical/2 - cam.forward * cam.focal_length;
		      vec3 target = lower_left + u * horizontal + v * vertical;
		      return Ray(cam.origin, normalize(target - cam.origin));
		  }
		  ```
- ---
- ## 2.2 Ray Definition and Scene Intersection
	- [[PathTracer Learning - Concept - Ray Definition]]
		- A ray is a parametric line: `P(t) = origin + t * direction`
		- `t > 0` means in front of the origin
		- `t_min` and `t_max` define the valid interval (avoids self-intersection)
	- [[PathTracer Learning - Concept - Ray-Triangle Intersection]]
		- Möller–Trumbore algorithm — the standard for real-time and offline rendering
		- Returns `t`, `u`, `v` barycentric coordinates
		- Used to interpolate normals, UVs, and other vertex attributes
	- [[PathTracer Learning - Concept - AABB]]
		- Axis-Aligned Bounding Box — the building block of BVH
		- Slab method intersection: test 3 pairs of parallel planes
		- `t_enter = max(t_x_min, t_y_min, t_z_min)`, `t_exit = min(t_x_max, t_y_max, t_z_max)`
		- Hit if `t_enter <= t_exit && t_exit > 0`
- ---
- ## 2.3 Acceleration Structures
	- [[PathTracer Learning - Concept - BVH Construction]]
		- Bounding Volume Hierarchy — tree of AABBs
		- Naive O(N) per ray → BVH O(log N) per ray
		- SAH (Surface Area Heuristic) for optimal splits
		- Binned SAH: O(N) per level, K=32 bins
	- [[Pathtracer Concept BVH Traversal]]
		- Recursive descent: test AABB, if hit recurse into children
		- Leaf nodes contain actual triangles
		- Ordered traversal: visit closer child first for early exit
		- Iterative traversal with explicit stack (GPU-friendly)
- ---
- ## 2.4 Radiometry and Shading
	- [[PathTracer Learning - Concept - Radiometry]]
		- Radiance `L` is what path tracing computes per ray
		- Irradiance `E = ∫ L cos(θ) dω` — what arrives at a surface
	- [[PathTracer Learning - Concept - Normal Mapping]]
		- Perturb shading normal using a texture
		- TBN matrix transforms tangent-space normal to world space
- ---
- ## 2.5 Materials and BRDF
	- [[PathTracer Learning - Concept - BRDF]]
		- Bidirectional Reflectance Distribution Function
		- `f_r(ω_i, ω_o)` — ratio of reflected radiance to incident irradiance
		- Must be energy-conserving: `∫ f_r cos(θ) dω ≤ 1`
		- Must be reciprocal: `f_r(ω_i, ω_o) = f_r(ω_o, ω_i)`
	- [[PathTracer Learning - Concept - Microfacet Theory]]
		- GGX NDF, Smith G term — the theory behind rough specular surfaces
		- Why `α = roughness²` (perceptual remapping)
	- [[PathTracer Learning - Concept - Fresnel Effect]]
		- Schlick approximation: `F(θ) = F0 + (1-F0)(1-cosθ)^5`
		- Metals vs dielectrics: `F0` interpretation
		- Why everything is more reflective at grazing angles
	- Lambertian (diffuse) BRDF
		- `f_r = albedo / π`
		- Scatters light equally in all directions
		- Combined with cosine-weighted sampling: `f_r * cos(θ) / p(ω) = albedo`
		- The `π` and `cos(θ)` cancel perfectly — very clean implementation
	- GGX Microfacet BRDF
		- `f_r = D(h) * G(ω_i, ω_o) * F(ω_o, h) / (4 * dot(N, ω_i) * dot(N, ω_o))`
		- `D` — Normal Distribution Function (GGX/Trowbridge-Reitz)
		- `G` — Geometric shadowing/masking (Smith)
		- `F` — Fresnel term (Schlick approximation)
		- GGX NDF: `D(h) = α² / (π * (dot(N,h)² * (α²-1) + 1)²)`
	- Disney Principled BRDF
		- Artist-friendly: `baseColor, metallic, roughness, specular, anisotropic, sheen, clearcoat, transmission`
		- Combines diffuse + specular + clearcoat + sheen layers
		- Used in Godot's PBR material system
- ---
- ## 2.6 Path Tracing Core Loop
	- [[PathTracer Learning - Path Tracing Algorithm]]
		- The full algorithm with all components
	- [[PathTracer Learning - Concept - Monte Carlo Integration]]
	- [[PathTracer Learning - Concept - Importance Sampling]]
	- [[PathTracer Learning - Concept - MIS]]
		- Combine BRDF sampling and NEE without double-counting
	- [[PathTracer Learning - Concept - Next Event Estimation]]
		- Direct light sampling — connect each path vertex to a light source
		- Dramatically reduces variance for scenes with small light sources
	- [[PathTracer Learning - Concept - Russian Roulette]]
		- Probabilistic path termination
		- Unbiased way to handle infinite recursion
	- The path tracing loop (pseudocode)
		- ```
		  color trace(ray r, scene s):
		      hit = intersect(r, s)
		      if no hit: return sky_color(r.direction)
		      if hit.material.is_emissive: return hit.material.emission
		      
		      // Russian roulette
		      survival_prob = max(hit.albedo)
		      if random() > survival_prob: return vec3(0)
		      
		      // Sample new direction (BRDF importance sampling)
		      new_dir = sample_brdf(hit.normal, -r.direction, hit.material)
		      pdf = brdf_pdf(hit.normal, -r.direction, new_dir, hit.material)
		      
		      // Evaluate BRDF
		      brdf = hit.material.eval(-r.direction, new_dir, hit.normal)
		      
		      // NEE: direct lighting
		      L_direct = sample_lights(hit, s)
		      
		      // Recursive trace
		      incoming = trace(ray(hit.point + hit.normal * 0.001, new_dir), s)
		      L_indirect = (brdf * incoming * dot(hit.normal, new_dir)) / (pdf * survival_prob)
		      
		      return L_direct + L_indirect
		  ```
- ---
- ## 2.7 Image Output and Tone Mapping
	- [[PathTracer Learning - Concept - Tone Mapping]]
		- HDR radiance values → LDR display values
		- Reinhard, ACES filmic, exposure control
	- [[PathTracer Learning - Concept - Anti-Aliasing]]
		- Jittered sampling within pixel footprint
		- Temporal anti-aliasing (TAA) for real-time
	- [[PathTracer Learning - Concept - Environment Map]]
		- HDR environment maps for image-based lighting (IBL)
		- Importance sampling the environment map
- ---
- ## 2.8 Accumulation and Convergence
	- [[PathTracer Learning - Concept - Temporal Accumulation]]
		- Average N samples over time: `color = (prev * (N-1) + new) / N`
		- Converges to ground truth as N → ∞
	- Fireflies
		- Extremely bright pixels from rare high-energy paths
		- Caused by low-probability paths with high contribution
		- Mitigation: clamp radiance, use MIS, better importance sampling
	- Convergence rate
		- Monte Carlo converges at `O(1/√N)` — need 4x samples to halve noise
		- Importance sampling reduces variance without changing convergence rate
		- Denoising (DLSS, OIDN) compensates for slow convergence
- ---
- ## Project
	- [[PathTracer Learning - Project - CPU Path Tracer]]
- ---
- ## Phase 2 Checklist
	- [ ] Implement ray-AABB intersection
	- [ ] Implement Möller–Trumbore ray-triangle intersection
	- [ ] Build a BVH with SAH splitting
	- [ ] Implement Lambertian BRDF with cosine-weighted sampling
	- [ ] Implement GGX microfacet BRDF with importance sampling
	- [ ] Implement Fresnel (Schlick) and metallic workflow
	- [ ] Implement Russian roulette path termination
	- [ ] Implement next event estimation (direct light sampling)
	- [ ] Implement MIS for NEE + BRDF
	- [ ] Implement HDR environment map with importance sampling
	- [ ] Implement tone mapping (ACES or Reinhard)
	- [ ] Render a Cornell box scene
- ---
- ## Navigation
	- Previous: [[PathTracer Learning - Phase 1 - Math for Graphics]]
	- Next: [[PathTracer Learning - Phase 3 - GPU and Vulkan]]