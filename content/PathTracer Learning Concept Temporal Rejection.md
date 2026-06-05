---
seoTitle: Temporal Rejection in Path Tracing – Disocclusion and Motion Guide
description: "Temporal rejection discards invalid history samples in temporal rendering. Covers disocclusion detection, motion vectors, depth comparison, and ReSTIR."
keywords: "temporal rejection, path tracing, ray tracing, disocclusion, motion vectors, depth comparison, ReSTIR, temporal accumulation, GPU rendering, Vulkan, denoising"
treeTitle: Game Development - Path Tracing - Concept Temporal Rejection
---

tags:: concept, temporal, denoising, rejection
title:: PathTracer Learning Concept Temporal Rejection

- # Concept: Temporal Rejection
	- Parent: [[PathTracer Learning Phase 5 Advanced Topics]]
- ---
- ## Why Rejection is Needed
	- Temporal accumulation assumes previous frame's sample is valid for current pixel
	- This assumption breaks when:
		- Disocclusion: object moves to reveal previously hidden surface
		- Fast motion: reprojection lands outside the frame or on wrong surface
		- Lighting changes: sudden light on/off
		- Material changes: texture swap, animation
	- Without rejection: ghosting artifacts (stale samples persist)
- ---
- ## Depth-Based Rejection
	- Compare depth of reprojected pixel vs expected depth
	- `prev_depth = sample(prev_depth_buffer, prev_uv)`
	- `expected_depth = reproject(current_depth, camera_motion)`
	- If `|prev_depth - expected_depth| > threshold`: reject
	- Threshold: typically `0.1 * current_depth` (relative threshold)
	- Catches disocclusion and large depth discontinuities
- ---
- ## Normal-Based Rejection
	- Compare surface normals between frames
	- `prev_normal = sample(prev_normal_buffer, prev_uv)`
	- If `dot(current_normal, prev_normal) < threshold`: reject
	- Threshold: typically `cos(25°) ≈ 0.9`
	- Catches surfaces that rotated significantly (e.g., spinning objects)
- ---
- ## Color-Based Rejection (Variance Clipping)
	- Clamp previous sample to neighborhood color range
	- Compute mean `μ` and variance `σ²` of current pixel's 3×3 neighborhood
	- Clip previous sample to `[μ - k*σ, μ + k*σ]` (AABB in color space)
	- `k = 1.0` is typical
	- Doesn't fully reject — blends toward valid range
	- Used in TAA (Temporal Anti-Aliasing) — very effective for ghosting
- ---
- ## Velocity-Based Rejection
	- Large motion vectors indicate fast-moving objects
	- If `length(motion_vector) > threshold`: increase blend factor (more current frame)
	- Doesn't fully reject but reduces ghosting for fast motion
- ---
- ## Disocclusion Detection
	- Most challenging case — no previous sample exists for newly visible pixels
	- Detection: reprojected UV is outside [0,1] range → definitely disoccluded
	- Depth test catches most in-frame disocclusions
	- For remaining cases: use stencil buffer or object ID comparison
- ---
- ## Rejection Response
	- Full rejection: `α = 1.0` — use only current frame (very noisy)
	- Partial rejection: increase `α` smoothly based on confidence
	- Confidence map: per-pixel value in [0,1] indicating temporal reliability
	- `α = lerp(α_min, 1.0, 1.0 - confidence)`
- ---
- ## Related
	- [[PathTracer Learning Temporal Accumulation]]
	- [[PathTracer Learning DLSS and Denoising]]