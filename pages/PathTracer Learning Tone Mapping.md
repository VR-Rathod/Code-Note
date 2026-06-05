---
seoTitle: Tone Mapping in Path Tracing – HDR to LDR Conversion Guide
description: "Tone mapping converts HDR radiance values to displayable LDR images. Covers Reinhard, ACES, Filmic, exposure control, gamma correction, and Vulkan."
keywords: "tone mapping, HDR, LDR, path tracing, ray tracing, Reinhard, ACES, Filmic, exposure, gamma correction, GPU rendering, Vulkan"
treeTitle: Game Development - Path Tracing - Tone Mapping
---

tags:: concept, post-processing, hdr, display, color
title:: PathTracer Learning Tone Mapping

- # Concept: Tone Mapping
	- Parent: [[PathTracer Learning Phase 5 Advanced Topics]]
- ---
- ## Why Tone Mapping?
	- Path tracing computes HDR radiance values (can be 0 to thousands of nits)
	- Displays can only show LDR values in [0, 1] (or [0, 1000 nits for HDR displays)
	- Tone mapping compresses the HDR range to the display range
	- Also applies a "filmic" look — mimics how film responds to light
- ---
- ## Exposure
	- First step: scale radiance by exposure
	- `exposed = radiance * exposure`
	- `exposure = 2^EV` where EV is exposure value (stops)
	- Auto-exposure: compute average luminance of the scene, adjust exposure
		- `avg_lum = exp(average(log(luminance(pixel) + 0.001)))`
		- `exposure = key_value / avg_lum` where `key_value ≈ 0.18` (18% gray)
- ---
- ## Reinhard Tone Mapping
	- Simple, classic operator
	- `L_out = L_in / (1 + L_in)`
	- Extended Reinhard (preserves white point):
		- `L_out = L_in * (1 + L_in / L_white²) / (1 + L_in)`
		- `L_white` — luminance that maps to pure white
	- Pros: simple, never clips
	- Cons: desaturates highlights, not filmic
- ---
- ## ACES Filmic Tone Mapping
	- Academy Color Encoding System — industry standard for film
	- Approximation by Krzysztof Narkowicz (widely used in games):
		- ```glsl
		  vec3 ACESFilm(vec3 x) {
		      float a = 2.51;
		      float b = 0.03;
		      float c = 2.43;
		      float d = 0.59;
		      float e = 0.14;
		      return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
		  }
		  ```
	- Better approximation by Stephen Hill (more accurate to full ACES):
		- Applies an input transform (RRT) and output transform (ODT)
		- Requires color space conversion to ACEScg first
	- Pros: filmic look, good highlight rolloff, industry standard
	- Cons: slightly desaturates, not physically accurate
- ---
- ## AgX Tone Mapping
	- Troy Sobotka 2022 — used in Blender since 3.x
	- Designed to handle highly saturated colors without hue shifts
	- Better than ACES for path-traced content (less "orange and teal" look)
	- ```glsl
	  // AgX (simplified)
	  vec3 agx(vec3 val) {
	      const mat3 agx_mat = mat3(
	          0.842479062253094,  0.0423282422610123, 0.0423756549057051,
	          0.0784335999999992, 0.878468636469772,  0.0784336,
	          0.0792237451477643, 0.0791661274605434, 0.879142973793104
	      );
	      val = agx_mat * val;
	      val = clamp(val, 1e-10, 1.0);
	      val = log2(val);
	      // ... sigmoid curve ...
	      return val;
	  }
	  ```
- ---
- ## Gamma Correction
	- After tone mapping: apply gamma correction for display
	- sRGB gamma: approximately `pow(x, 1/2.2)` but with a linear segment near 0
	- Exact sRGB transfer function:
		- ```glsl
		  vec3 linearToSRGB(vec3 x) {
		      return mix(
		          12.92 * x,
		          1.055 * pow(x, vec3(1.0/2.4)) - 0.055,
		          step(0.0031308, x)
		      );
		  }
		  ```
	- Always work in linear space, convert to sRGB only at final output
	- Common mistake: applying gamma twice (once in tone mapper, once in display)
- ---
- ## Color Space Pipeline
	- Correct pipeline for path tracing:
		- 1. Compute radiance in linear scene-referred space (ACEScg or sRGB linear)
		- 2. Apply exposure
		- 3. Apply tone mapping operator
		- 4. Apply gamma correction (linear → sRGB)
		- 5. Output to display
	- Textures: load as sRGB (gamma-encoded), convert to linear before use
		- In Vulkan: use `VK_FORMAT_R8G8B8A8_SRGB` — GPU auto-converts on sample
- ---
- ## Luminance
	- Perceptual luminance from RGB: `lum = dot(rgb, vec3(0.2126, 0.7152, 0.0722))`
	- These weights are the Rec. 709 luminance coefficients
	- Used for: auto-exposure, tone mapping, denoiser guidance
- ---
- ## Related
	- [[PathTracer Learning Environment Map]]
	- [[PathTracer Learning Phase 5 Advanced Topics]]