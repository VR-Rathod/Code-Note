---
seoTitle: Multiple Importance Sampling (MIS) – Path Tracing Technique Guide
description: "MIS combines multiple sampling strategies to reduce variance in path tracing. Covers balance heuristic, power heuristic, direct light sampling, and BRDF."
keywords: "MIS, multiple importance sampling, path tracing, ray tracing, balance heuristic, power heuristic, direct light sampling, BRDF sampling, GPU rendering, Vulkan, variance"
title: PathTracer Learning MIS
---

tags:: concept, math, probability, mis, variance-reduction
title:: PathTracer Learning Concept MIS
title: PathTracer Learning MIS

- # Concept: Multiple Importance Sampling (MIS)
	- Parent: [[PathTracer Learning Phase 1 Math for Graphics]]
- ---
- ## The Problem
	- No single sampling strategy is optimal for all situations
	- BRDF sampling: great for specular surfaces, terrible for small lights
	- Light sampling (NEE): great for diffuse surfaces, terrible for specular
	- Naively combining both: double-counts contributions → biased result
	- MIS: combine multiple strategies optimally without bias
- ---
- ## The Core Idea
	- Veach & Guibas 1995 — one of the most important papers in rendering
	- Each sample gets a weight based on how likely each strategy was to produce it
	- Strategies that are "better suited" to a sample get higher weight
	- Result: low variance everywhere, no double-counting
- ---
- ## MIS Estimator
	- Have `n` sampling strategies with PDFs `p_1, ..., p_n`
	- Take `n_i` samples from strategy `i`
	- MIS estimator: `Î = Σ_i (1/n_i) * Σ_j w_i(x_ij) * f(x_ij) / p_i(x_ij)`
	- `w_i(x)` — MIS weight for strategy `i` at sample `x`
	- Must satisfy: `Σ_i w_i(x) = 1` for all `x` where `f(x) ≠ 0`
- ---
- ## Balance Heuristic
	- `w_i(x) = (n_i * p_i(x)) / Σ_j (n_j * p_j(x))`
	- Provably optimal in a certain sense (Veach 1997)
	- Simple to implement
	- For equal sample counts (`n_i = 1`): `w_i(x) = p_i(x) / Σ_j p_j(x)`
- ---
- ## Power Heuristic (β=2)
	- `w_i(x) = (n_i * p_i(x))^β / Σ_j (n_j * p_j(x))^β`
	- With `β = 2`: `w_i(x) = p_i(x)² / Σ_j p_j(x)²` (for equal sample counts)
	- Usually better than balance heuristic in practice
	- Reduces variance by suppressing contributions from poorly-suited strategies
	- Veach showed β=2 is a good practical choice
- ---
- ## MIS for NEE + BRDF Sampling
	- The most common use case in path tracing
	- Strategy 1: sample light source (NEE)
		- PDF: `p_light(ω)` — probability of sampling direction ω via light sampling
	- Strategy 2: sample BRDF
		- PDF: `p_brdf(ω)` — probability of sampling direction ω via BRDF sampling
	- MIS weights (power heuristic, β=2):
		- `w_light = p_light² / (p_light² + p_brdf²)`
		- `w_brdf  = p_brdf²  / (p_light² + p_brdf²)`
	- Combined estimator:
		- ```glsl
		  // NEE sample
		  vec3 L_nee = f_r * L_e * G * V / p_light;
		  float w_nee = pow2(p_light) / (pow2(p_light) + pow2(p_brdf_at_light_dir));
		  
		  // BRDF sample
		  vec3 L_brdf = f_r * L_incoming * cos_theta / p_brdf;
		  float w_brdf = pow2(p_brdf) / (pow2(p_brdf) + pow2(p_light_at_brdf_dir));
		  
		  vec3 L_total = w_nee * L_nee + w_brdf * L_brdf;
		  ```
- ---
- ## When MIS Helps Most
	- Specular surfaces near area lights
		- BRDF sampling: good (samples specular lobe)
		- Light sampling: bad (light is large, but BRDF is narrow)
		- MIS: correctly weights BRDF samples higher
	- Diffuse surfaces near small lights
		- BRDF sampling: bad (random hemisphere, rarely hits small light)
		- Light sampling: good (directly samples the light)
		- MIS: correctly weights light samples higher
	- Environment map lighting
		- BRDF sampling: good for specular
		- Environment map sampling: good for bright regions
		- MIS: combines both optimally
- ---
- ## MIS for Multiple Light Sources
	- With N lights: sample one light, weight by `p_light_i / Σ_j p_light_j`
	- Or: sample all lights and apply MIS weights
	- [[PathTracer Learning ReSTIR]] — handles many lights efficiently with MIS
- ---
- ## Practical Notes
	- Always evaluate `p_brdf` at the NEE direction and `p_light` at the BRDF direction
	- If `p_light = 0` for a BRDF sample (e.g., light is a point): `w_brdf = 1`
	- If `p_brdf = 0` for a NEE sample (e.g., delta BRDF): `w_nee = 1`
	- Handle degenerate cases: avoid division by zero
- ---
- ## Related
	- [[PathTracer Learning Importance Sampling]]
	- [[PathTracer Learning Next Event Estimation]]
	- [[PathTracer Learning BRDF]]