---
seoTitle: Russian Roulette in Path Tracing – Path Termination Technique
description: "Russian roulette terminates low-contribution paths probabilistically without bias. Covers survival probability, throughput compensation, and."
keywords: "Russian roulette, path tracing, ray tracing, path termination, survival probability, throughput, unbiased rendering, GPU rendering, Vulkan, Monte Carlo, variance"
---

tags:: concept, path-tracing, variance-reduction, termination
title:: PathTracer Learning Russian Roulette

- # Concept: Russian Roulette
	- Parent: [[PathTracer Learning Phase 2 CPU Ray Tracing]]
- ---
- ## The Problem
	- Path tracing is recursive — paths can bounce infinitely
	- Truncating at fixed depth introduces bias (misses long light paths)
	- Need an unbiased way to terminate paths
- ---
- ## How Russian Roulette Works
	- At each bounce, randomly decide to continue or terminate
	- Survival probability: `q` (typically based on path throughput)
	- If `random() < q`: continue, divide contribution by `q`
	- If `random() >= q`: terminate, return 0
	- This is unbiased because: `E[contribution] = q * (true_contribution / q) + (1-q) * 0 = true_contribution`
- ---
- ## Choosing the Survival Probability
	- Common choice: `q = max(throughput.r, throughput.g, throughput.b)`
		- Throughput = product of BRDF weights along the path
		- As path gets darker, more likely to terminate
		- Prevents wasting computation on paths that contribute little
	- Clamp: `q = clamp(q, 0.05, 0.95)`
		- Minimum 5%: prevents infinite loops (q=0 would never terminate)
		- Maximum 95%: prevents very bright paths from being over-weighted
	- Alternative: `q = luminance(throughput)` — single value, perceptually weighted
- ---
- ## Implementation
	- ```glsl
	  vec3 throughput = vec3(1.0);
	  
	  for (int bounce = 0; bounce < MAX_BOUNCES; bounce++) {
	      // ... trace ray, evaluate BRDF ...
	      throughput *= brdf_weight;
	      
	      // Russian roulette
	      float q = max(throughput.r, max(throughput.g, throughput.b));
	      q = clamp(q, 0.05, 0.95);
	      if (random() > q) break;  // terminate
	      throughput /= q;           // compensate for survival probability
	  }
	  ```
- ---
- ## Effect on Variance
	- Russian roulette does NOT reduce variance — it can increase it
	- Paths that survive get boosted by `1/q` → higher individual contribution
	- But: eliminates wasted computation on low-contribution paths
	- Net effect: same expected value, potentially higher variance, but faster convergence per unit time
- ---
- ## Splitting (Opposite of Russian Roulette)
	- When throughput is HIGH: spawn multiple child rays
	- Reduces variance for bright paths at the cost of more computation
	- Rarely used in real-time (too expensive)
	- Used in offline rendering for caustics and other difficult paths
- ---
- ## Related
	- [[PathTracer Learning Path Tracing Algorithm]]
	- [[PathTracer Learning Monte Carlo Integration]]