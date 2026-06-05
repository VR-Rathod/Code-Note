---
seoTitle: Temporal Accumulation in Path Tracing – Denoising and TAA Guide
description: "Temporal accumulation blends frames over time to reduce noise in path tracing. Covers history buffer, blend factor, ghosting artifacts, and TAA implementation."
keywords: "temporal accumulation, path tracing, ray tracing, TAA, temporal anti-aliasing, denoising, history buffer, blend factor, ghosting, GPU rendering, Vulkan, noise reduction"
treeTitle: Game Development - Path Tracing - Temporal Accumulation
---

tags:: concept, temporal, denoising, accumulation
title:: PathTracer Learning Temporal Accumulation

- # Concept: Temporal Accumulation
	- Parent: [[PathTracer Learning Phase 5 Advanced Topics]]
- ---
- ## Core Idea
	- Reuse samples from previous frames to increase effective sample count
	- Frame N has 1 spp, but after 64 frames: 64 effective spp
	- Free quality improvement — no extra ray tracing cost
- ---
- ## Basic Algorithm
	- Exponential moving average (EMA)
		- `accumulated[t] = lerp(accumulated[t-1], current[t], α)`
		- `α = 1/N` where N = number of accumulated frames
		- `α = 1.0` → no accumulation (current frame only)
		- `α = 0.1` → blend 10% new, 90% old (slow to respond to changes)
	- Running average (exact)
		- `accumulated[t] = (accumulated[t-1] * (N-1) + current[t]) / N`
		- Exact average of all N frames
		- Problem: N grows unboundedly — old frames from different scene state
- ---
- ## Motion Vector Reprojection
	- Camera and objects move between frames
	- Must find where current pixel was in the previous frame
	- Motion vector: `mv = current_uv - previous_uv`
	- Reprojection: `prev_uv = current_uv - motion_vector`
	- Sample previous accumulation buffer at `prev_uv`
	- Bilinear interpolation for sub-pixel accuracy
	- Computing motion vectors
		- For static objects: only camera motion
			- `prev_clip = prev_view_proj * world_pos`
			- `mv = (current_ndc - prev_ndc) / 2` (in UV space)
		- For dynamic objects: object transform also changes
			- Store previous frame's transform per object
			- `prev_world_pos = prev_transform * local_pos`
- ---
- ## Ghosting
	- When reprojection is wrong: old samples from wrong location persist
	- Causes: disocclusion, fast motion, lighting changes
	- Appears as: blurry trails, smearing, incorrect colors
	- Solution: [[PathTracer Learning Concept Temporal Rejection]]
- ---
- ## Blend Factor Tuning
	- High blend factor (α = 0.5): responsive but noisy
	- Low blend factor (α = 0.05): smooth but slow to update, ghosting
	- Adaptive blend factor: increase α when rejection detects stale samples
	- Typical: `α = 0.1` for stable regions, `α = 1.0` for rejected pixels
- ---
- ## Variance Estimation
	- Track variance of accumulated samples for denoiser guidance
	- Online variance: `var = E[x²] - E[x]²`
	- Accumulate both `sum` and `sum_sq` over time
	- `mean = sum / N`, `variance = sum_sq/N - mean²`
	- Used by SVGF to guide spatial filtering strength
- ---
- ## Related
	- [[PathTracer Learning Concept Temporal Rejection]]
	- [[PathTracer Learning DLSS and Denoising]]