---
seoTitle: Anti-Aliasing in Path Tracing – MSAA, TAA, and DLSS Guide
description: "Anti-aliasing reduces jagged edges in rendered images. Covers MSAA, SSAA, TAA, DLSS, FXAA, jitter sampling, and temporal accumulation in path tracers."
keywords: "anti-aliasing, MSAA, TAA, DLSS, FXAA, path tracing, ray tracing, temporal accumulation, jitter sampling, GPU rendering, image quality, Vulkan"
---

tags:: concept, anti-aliasing, taa, sampling, image-quality
title:: PathTracer Learning - Concept - Anti-Aliasing

- # Concept: Anti-Aliasing
	- Parent: [[PathTracer Learning - Phase 2 - CPU Ray Tracing]]
- ---
- ## What Is Aliasing?
	- Aliasing: high-frequency signal sampled at too low a rate → artifacts
	- In rendering: sharp edges appear as "jaggies" (staircase pattern)
	- Nyquist theorem: must sample at 2× the highest frequency to avoid aliasing
	- Solution: anti-aliasing — reduce high frequencies before sampling
- ---
- ## Supersampling (SSAA)
	- Render at higher resolution, downsample to final resolution
	- 4× SSAA: render at 2× width and height, average 4 pixels → 1
	- Pros: simple, correct
	- Cons: 4× more rays — too expensive for real-time
- ---
- ## Jittered Sampling (Stochastic AA)
	- Instead of one ray per pixel center, jitter the ray within the pixel
	- `ray_uv = (pixel + vec2(random(), random())) / resolution`
	- With N samples per pixel: each sample uses a different jitter
	- Converts aliasing into noise — noise is less objectionable than jaggies
	- This is what path tracing does naturally (each sample is a different ray)
- ---
- ## Stratified Sampling
	- Divide pixel into N×N strata, sample one per stratum
	- Better distribution than pure random — avoids clustering
	- For 4 samples: 2×2 grid, one sample per cell
	- ```glsl
	  // 4-sample stratified
	  for (int sy = 0; sy < 2; sy++) {
	      for (int sx = 0; sx < 2; sx++) {
	          vec2 jitter = (vec2(sx, sy) + vec2(random(), random())) / 2.0;
	          vec2 uv = (pixel + jitter) / resolution;
	          // trace ray at uv
	      }
	  }
	  ```
- ---
- ## Temporal Anti-Aliasing (TAA)
	- Accumulate jittered samples over multiple frames
	- Each frame: use a different sub-pixel jitter pattern (Halton sequence)
	- Blend with previous frame: `output = lerp(prev, current, blend_factor)`
	- Effectively: N frames × 1 spp = N spp anti-aliasing
	- Jitter patterns: Halton(2,3) sequence — good low-discrepancy distribution
		- ```glsl
		  // Halton sequence for frame N
		  float halton(int i, int base) {
		      float f = 1.0, r = 0.0;
		      while (i > 0) { f /= base; r += f * (i % base); i /= base; }
		      return r;
		  }
		  vec2 jitter = vec2(halton(frame, 2), halton(frame, 3));
		  ```
	- Requires motion vector reprojection (same as temporal accumulation)
	- Ghosting: same issue as temporal accumulation — need rejection
- ---
- ## MSAA (Multisample Anti-Aliasing)
	- Hardware rasterization feature — not directly applicable to ray tracing
	- Samples geometry coverage at multiple sub-pixel positions
	- Shades each pixel once but uses coverage information
	- Not useful for path tracing (we already trace multiple rays per pixel)
- ---
- ## DLSS / FSR (AI/Spatial Upscaling)
	- Render at lower resolution, upscale with AI or spatial algorithms
	- DLSS (NVIDIA): AI-based, uses temporal data — very high quality
	- FSR (AMD): spatial algorithm, no temporal data — lower quality but universal
	- Both provide anti-aliasing as a side effect of upscaling
	- See [[PathTracer Learning - DLSS and Denoising]]
- ---
- ## Pixel Reconstruction Filter
	- How to combine multiple samples within a pixel
	- Box filter: simple average — blurry
	- Tent filter: linear falloff — slightly better
	- Gaussian filter: smooth falloff — good balance
	- Mitchell-Netravali: negative lobes — sharper but can ring
	- For path tracing: Gaussian or Mitchell-Netravali are common choices
	- Filter radius: typically 1-2 pixels
- ---
- ## Related
	- [[PathTracer Learning - Concept - Camera Model]]
	- [[PathTracer Learning - Concept - Temporal Accumulation]]
	- [[PathTracer Learning - DLSS and Denoising]]
