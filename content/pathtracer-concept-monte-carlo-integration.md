---
seoTitle: Monte Carlo Integration in Path Tracing – Rendering Math Guide
description: "Monte Carlo integration estimates integrals by random sampling, foundational to path tracing. Covers estimator, variance, convergence, importance sampling, and."
keywords: "Monte Carlo integration, path tracing, ray tracing, random sampling, estimator, variance, convergence, importance sampling, Russian roulette, GPU rendering, Vulkan"
---

tags:: concept, math, probability, monte-carlo
title:: PathTracer Learning - Concept - Monte Carlo Integration

- # Concept: Monte Carlo Integration
	- Parent: [[PathTracer Learning - Phase 1 - Math for Graphics]]
- ---
- ## The Problem
	- We need to evaluate: `I = ∫_Ω f(x) dx`
	- For the rendering equation: `f(x) = f_r(ω_i, ω_o) * L_i(ω_i) * cos(θ_i)`
	- This integral has no closed-form solution in general
	- Monte Carlo: estimate the integral by random sampling
- ---
- ## Monte Carlo Estimator
	- Draw N random samples `x_1, ..., x_N` from distribution `p(x)`
	- Estimator: `Î = (1/N) * Σ f(x_i) / p(x_i)`
	- This is an unbiased estimator: `E[Î] = I`
	- Proof: `E[f(x)/p(x)] = ∫ (f(x)/p(x)) * p(x) dx = ∫ f(x) dx = I`
- ---
- ## Variance and Convergence
	- Variance of estimator: `Var[Î] = Var[f(x)/p(x)] / N`
	- Standard deviation (noise): `σ = σ_f / √N`
	- Convergence rate: `O(1/√N)` — dimension-independent
	- To halve noise: need 4× more samples
	- Compare to quadrature (trapezoidal rule): `O(1/N^(2/d))` — degrades in high dimensions
	- For d > 2: Monte Carlo beats quadrature — this is why it's used for rendering
- ---
- ## Uniform Hemisphere Sampling
	- Sample direction uniformly over hemisphere
	- PDF: `p(ω) = 1 / (2π)` (constant over hemisphere)
	- Sampling: `θ = arccos(1 - ξ_1)`, `φ = 2π * ξ_2` where `ξ_1, ξ_2 ~ Uniform(0,1)`
	- Cartesian: `x = sin(θ)cos(φ)`, `y = sin(θ)sin(φ)`, `z = cos(θ)`
	- Estimator for rendering equation:
		- `L_o ≈ (2π/N) * Σ f_r(ω_i) * L_i(ω_i) * cos(θ_i)`
- ---
- ## Cosine-Weighted Hemisphere Sampling
	- Sample proportional to `cos(θ)` — matches the `cos(θ)` factor in rendering equation
	- PDF: `p(ω) = cos(θ) / π`
	- Sampling (Malley's method): sample disk uniformly, project to hemisphere
		- `r = √ξ_1`, `φ = 2π * ξ_2`
		- `x = r * cos(φ)`, `y = r * sin(φ)`, `z = √(1 - r²)`
	- Estimator for Lambertian surface:
		- `L_o ≈ (1/N) * Σ (albedo/π) * L_i(ω_i) * cos(θ_i) / (cos(θ_i)/π)`
		- `= (1/N) * Σ albedo * L_i(ω_i)` — the `cos` and `π` cancel!
	- This is why cosine-weighted sampling is preferred for diffuse surfaces
- ---
- ## Variance Reduction
	- [[PathTracer Learning - Concept - Importance Sampling]] — sample where integrand is large
	- Control variates — subtract a known function with same integral
	- Stratified sampling — divide domain into strata, sample each
	- Quasi-Monte Carlo — use low-discrepancy sequences instead of random
		- Halton sequence, Sobol sequence
		- Converges at `O(1/N)` instead of `O(1/√N)` for smooth integrands
- ---
- ## Practical Notes
	- Always divide by PDF: `contribution = f(x) / p(x)`
	- If `p(x) = 0` where `f(x) ≠ 0`: undefined — ensure support of `p` covers support of `f`
	- Fireflies: rare samples with very high `f(x)/p(x)` — clamp or use better sampling
