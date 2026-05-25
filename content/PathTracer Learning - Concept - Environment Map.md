---
date: 2026-04-03T15:14:37+05:30
lastmod: 2026-04-03T15:14:37+05:30

seoTitle: Environment Maps in Path Tracing – IBL and HDRI Lighting Guide
description: "Environment maps provide image-based lighting in path tracers. Covers HDRI loading, equirectangular projection, importance sampling, and IBL in Vulkan ray."
keywords: "environment map, IBL, HDRI, image-based lighting, path tracing, ray tracing, equirectangular, importance sampling, GPU rendering, Vulkan, physically-based rendering"
---

tags:: concept, lighting, ibl, environment-map, hdr
title:: PathTracer Learning - Concept - Environment Map

- # Concept: Environment Map (IBL)
	- Parent: [[PathTracer Learning - Phase 2 - CPU Ray Tracing]]
- ---
- ## What Is an Environment Map?
	- A texture that represents the radiance arriving from all directions in the scene
	- Typically an HDR (high dynamic range) image — captures real-world lighting
	- Used as the "sky" and distant lighting in a path tracer
	- When a ray misses all geometry: sample the environment map
- ---
- ## Formats
	- Equirectangular (lat-long)
		- Maps the sphere to a 2:1 rectangle
		- `u = (atan2(dir.z, dir.x) / (2π)) + 0.5`
		- `v = acos(dir.y) / π`
		- Simple but has pole distortion (oversampled at poles)
	- Cubemap
		- 6 square faces (±X, ±Y, ±Z)
		- No pole distortion, hardware-accelerated sampling
		- Harder to importance sample
	- Octahedral
		- Maps sphere to a square via octahedral projection
		- No distortion, easy to importance sample
		- Used in some modern engines
- ---
- ## Sampling the Environment Map
	- Naive: sample random direction, look up environment map
		- PDF: `p(ω) = 1 / (4π)` (uniform sphere)
		- High variance — most directions contribute little
	- Importance sampling: sample proportional to luminance
		- Build a 2D CDF from the luminance of each texel
		- Sample row (θ) then column (φ) using inverse CDF
		- PDF: `p(ω) = L(ω) / ∫L(ω)dω` — proportional to luminance
		- Dramatically reduces variance for scenes with bright sun/sky
	- Building the 2D CDF
		- ```cpp
		  // Compute luminance for each texel
		  for (int y = 0; y < height; y++) {
		      float sin_theta = sin(π * (y + 0.5) / height);  // solid angle weight
		      for (int x = 0; x < width; x++) {
		          float lum = luminance(hdr[y * width + x]) * sin_theta;
		          pdf_2d[y][x] = lum;
		      }
		  }
		  // Build marginal CDF (over rows) and conditional CDFs (per row)
		  ```
- ---
- ## IBL (Image-Based Lighting) in PBR
	- Split-sum approximation (Karis 2013, used in Unreal Engine)
		- Precompute two terms separately:
		- `L_IBL = ∫ f_r(ω_i, ω_o) L_i(ω_i) cos(θ_i) dω_i`
		- `≈ (∫ L_i(ω_i) D(ω_i, roughness) dω_i) * (∫ f_r(ω_i, ω_o) cos(θ_i) dω_i)`
		- Term 1: pre-filtered environment map (one mip per roughness level)
		- Term 2: BRDF integration LUT (precomputed 2D texture)
	- Pre-filtered environment map
		- Convolve environment map with GGX NDF at each roughness level
		- Store in mip chain: mip 0 = sharp (roughness=0), mip N = blurry (roughness=1)
		- Sample: `textureLod(envMap, reflect(-V, N), roughness * MAX_MIP)`
	- BRDF integration LUT
		- 2D texture indexed by `(NdotV, roughness)`
		- Stores `(scale, bias)` for Schlick Fresnel: `F_approx = F0 * scale + bias`
		- Precomputed once, reused for all materials
	- This is an approximation — path tracing with environment map sampling is exact
- ---
- ## In a Path Tracer
	- Miss shader: sample environment map at ray direction
		- ```glsl
		  layout(location=0) rayPayloadInEXT vec3 payload;
		  void main() {
		      vec2 uv = directionToEquirectangular(gl_WorldRayDirectionEXT);
		      payload = texture(envMap, uv).rgb;
		  }
		  ```
	- NEE with environment map: sample a direction from the env map CDF
		- Compute PDF in solid angle: `p(ω) = luminance(L(ω)) / total_luminance * (W*H) / (2π²*sin(θ))`
		- Trace shadow ray in that direction
		- Apply MIS weight: `w = p_env² / (p_env² + p_brdf²)`
- ---
- ## HDR File Formats
	- `.hdr` (Radiance RGBE format) — most common, 8-bit mantissa + 8-bit exponent
	- `.exr` (OpenEXR) — 16-bit or 32-bit float, lossless, industry standard
	- `.dds` with BC6H compression — GPU-compressed HDR, used in games
	- Loading in C++: `stb_image.h` for .hdr, `tinyexr` for .exr
- ---
- ## Related
	- [[PathTracer Learning - Concept - Importance Sampling]]
	- [[PathTracer Learning - Concept - MIS]]
	- [[PathTracer Learning - Concept - Tone Mapping]]