---
seoTitle: DLSS and Denoising in Path Tracing – AI Upscaling and Noise Guide
description: "DLSS and denoising reduce noise and improve performance in path tracers. Covers DLSS 3, OIDN, NRD, temporal denoising, and integration with Vulkan ray tracing."
keywords: "DLSS, denoising, path tracing, ray tracing, OIDN, NRD, AI upscaling, temporal denoising, GPU rendering, Vulkan, noise reduction, NVIDIA"
---

tags:: denoising, dlss, temporal, nvidia, production
title:: PathTracer Learning - DLSS and Denoising

- # DLSS and Denoising
	- How to get clean images from 1 sample per pixel.
	- Parent: [[PathTracer Learning]]
- ---
- ## Why Denoising is Essential
	- Real-time path tracing budget: ~1-4 spp at 1080p/60fps
	- 1 spp = extremely noisy — unusable without denoising
	- Denoising reconstructs a clean image by exploiting:
		- Temporal coherence (frames are similar to previous frames)
		- Spatial coherence (neighboring pixels are often similar)
		- G-buffer data (normals, albedo, depth help guide filtering)
- ---
- ## Temporal Accumulation
	- [[PathTracer Learning - Concept - Temporal Accumulation]]
	- Basic idea: blend current frame with previous accumulated result
		- `accumulated = lerp(prev_accumulated, current, blend_factor)`
		- `blend_factor = 1/N` where N = number of accumulated frames
		- After N frames: effective sample count = N spp
	- Motion vector reprojection
		- Previous frame's pixel may have moved due to camera/object motion
		- Motion vectors map current pixel → previous pixel location
		- `prev_uv = current_uv - motion_vector`
		- Sample `prev_accumulated` at `prev_uv` (bilinear interpolation)
	- [[PathTracer Learning - Concept - Temporal Rejection]]
		- Must detect and reject stale samples (disocclusion, fast motion)
		- Otherwise: ghosting artifacts
- ---
- ## DLSS (Deep Learning Super Sampling)
	- NVIDIA's AI-based upscaling + denoising
	- DLSS 2.x — super resolution only
		- Renders at lower resolution (e.g., 1080p → 4K)
		- Temporal accumulation with AI upscaling
	- DLSS 3 — frame generation
		- Generates intermediate frames using optical flow
		- Doubles apparent frame rate
	- DLSS 3.5 — Ray Reconstruction
		- Specifically designed for path-traced content
		- Replaces traditional denoiser entirely
		- Trained on path-traced data — understands RT noise patterns
		- Input: noisy RT output + G-buffer (normals, albedo, depth, motion)
		- Output: clean, upscaled image
	- DLSS integration (NVIDIA Streamline SDK)
		- `sl::dlss_g::setOptions()` — configure DLSS mode
		- `sl::dlss_g::evaluate()` — run DLSS on a frame
		- Requires: `sl.interposer.dll`, `nvngx_dlss.dll`
- ---
- ## Intel OIDN (Open Image Denoise)
	- Open source, CPU and GPU denoiser
	- Trained on offline rendering data
	- Input: color + optional albedo + optional normal (all noisy)
	- Output: denoised color
	- Integration
		- ```cpp
		  oidn::DeviceRef device = oidn::newDevice();
		  device.commit();
		  oidn::FilterRef filter = device.newFilter("RT");
		  filter.setImage("color", colorPtr, oidn::Format::Float3, width, height);
		  filter.setImage("albedo", albedoPtr, oidn::Format::Float3, width, height);
		  filter.setImage("normal", normalPtr, oidn::Format::Float3, width, height);
		  filter.setImage("output", outputPtr, oidn::Format::Float3, width, height);
		  filter.set("hdr", true);
		  filter.commit();
		  filter.execute();
		  ```
	- GPU version (OIDN 2.0+): runs on Vulkan compute, much faster
- ---
- ## Spatiotemporal Variance-Guided Filtering (SVGF)
	- Academic denoiser, widely used as baseline
	- Steps
		- 1. Temporal accumulation with variance estimation
		- 2. À-trous wavelet filter (5 iterations, each doubles filter radius)
		- 3. Guided by luminance variance — filter more where variance is high
	- Variance estimation
		- Track mean and mean² over time
		- `variance = mean² - mean²` (Welford's online algorithm)
	- À-trous filter
		- Sparse kernel — samples at `2^i` offsets per iteration
		- Achieves large filter radius with few samples
		- Edge-stopping functions: depth, normal, luminance
- ---
- ## Demodulation
	- Separate albedo from lighting before denoising
	- `noisy_lighting = noisy_color / albedo` (demodulate)
	- Denoise `noisy_lighting` (smoother signal, easier to denoise)
	- `denoised_color = denoised_lighting * albedo` (remodulate)
	- Why: albedo has high-frequency detail (textures) that denoiser would blur
- ---
- ## Related
	- [[PathTracer Learning - Concept - Temporal Accumulation]]
	- [[PathTracer Learning - Concept - Temporal Rejection]]
	- [[PathTracer Learning - ReSTIR]]
	- [[PathTracer Learning - Phase 5 - Advanced Topics]]
