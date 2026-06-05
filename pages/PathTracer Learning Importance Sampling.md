---
seoTitle: Importance Sampling in Path Tracing – Variance Reduction Guide
description: "Importance sampling reduces variance in Monte Carlo rendering by sampling proportional to the integrand."
keywords: "importance sampling, path tracing, ray tracing, Monte Carlo, variance reduction, cosine-weighted sampling, BRDF sampling, MIS, GPU rendering, Vulkan, rendering"
treeTitle: Game Development - Path Tracing - Importance Sampling
---

tags:: concept, math, probability, variance-reduction
title:: PathTracer Learning Importance Sampling

- # Concept: Importance Sampling
	- Parent: [[PathTracer Learning Phase 1 Math for Graphics]]
- ---
- ## Core Idea
	- Sample more where the integrand is large → lower variance
	- Optimal PDF: `p*(x) = |f(x)| / ∫|f(x)|dx` — proportional to integrand
	- With optimal PDF: variance = 0 (but requires knowing the integral — circular)
	- In practice: approximate `p(x) ≈ f(x)` using known distributions
- ---
- ## Why It Works
	- Estimator: `Î = (1/N) * Σ f(x_i) / p(x_i)`
	- If `p(x) ∝ f(x)`, then `f(x)/p(x) ≈ constant` → variance ≈ 0
	- If `p(x)` is uniform, `f(x)/p(x)` varies a lot → high variance
	- Key: the ratio `f(x)/p(x)` should be as flat as possible
- ---
- ## BRDF Importance Sampling
	- For Lambertian BRDF: `f_r = albedo/π`, `cos(θ)` factor
		- Sample proportional to `cos(θ)` → cosine-weighted hemisphere sampling
		- PDF: `p(ω) = cos(θ)/π`
		- Weight: `f_r * cos(θ) / p(ω) = (albedo/π) * cos(θ) / (cos(θ)/π) = albedo`
	- For GGX specular BRDF
		- Sample the half-vector `h` from GGX NDF
		- `p(h) = D(h) * dot(N, h)` — proportional to NDF
		- Convert to incident direction: `ω_i = reflect(-ω_o, h)`
		- PDF for `ω_i`: `p(ω_i) = p(h) / (4 * dot(ω_o, h))`
		- GGX sampling: `θ_h = arctan(α * √(ξ_1 / (1 - ξ_1)))`, `φ_h = 2π * ξ_2`
- ---
- ## Light Source Importance Sampling
	- Sample a point on a light source directly
	- PDF: `p(x) = 1 / area_of_light` (uniform over light surface)
	- Convert to solid angle PDF: `p(ω) = p(x) * r² / cos(θ_light)`
		- `r` = distance to light, `θ_light` = angle at light surface
	- This is Next Event Estimation (NEE) — see [[PathTracer Learning Next Event Estimation]]
- ---
- ## Multiple Importance Sampling (MIS)
	- Combine multiple sampling strategies optimally
	- Problem: BRDF sampling is good for specular, light sampling is good for diffuse
	- MIS combines both without double-counting
	- Balance heuristic: `w_i(x) = p_i(x) / Σ_j p_j(x)`
	- Power heuristic (β=2): `w_i(x) = p_i(x)² / Σ_j p_j(x)²` — usually better
	- MIS estimator: `Î = Σ_i (1/N_i) * Σ_j w_i(x_ij) * f(x_ij) / p_i(x_ij)`
- ---
- ## Environment Map Sampling
	- Sample directions proportional to environment map luminance
	- Build 2D CDF from luminance values
	- Sample row (θ) then column (φ) using inverse CDF
	- PDF: `p(ω) = L(ω) / ∫L(ω)dω` — proportional to luminance
	- Dramatically reduces variance for scenes lit by HDR environment maps
- ---
- ## Related
	- [[PathTracer Learning Monte Carlo Integration]]
	- [[PathTracer Learning BRDF]]
	- [[PathTracer Learning Next Event Estimation]]