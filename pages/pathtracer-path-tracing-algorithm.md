---
seoTitle: Path Tracing Algorithm – Monte Carlo Light Transport Explained
description: "Path tracing simulates light transport by tracing random ray paths. Covers the rendering equation, Monte Carlo estimator, direct and indirect illumination, and."
keywords: "path tracing algorithm, Monte Carlo, light transport, rendering equation, direct illumination, indirect illumination, ray tracing, GPU rendering, Vulkan, convergence"
---

tags:: algorithm, path-tracing, rendering-equation, core
title:: PathTracer Learning - Path Tracing Algorithm

- # Path Tracing Algorithm
	- The complete algorithm from first principles to implementation.
	- Parent: [[PathTracer Learning]]
- ---
- ## The Rendering Equation
	- `L_o(x, ω_o) = L_e(x, ω_o) + ∫_Ω f_r(x, ω_i, ω_o) L_i(x, ω_i) (N · ω_i) dω_i`
	- This is an integral equation — `L_i` depends on `L_o` at other points
	- Path tracing solves it by Monte Carlo integration
		- Sample a random direction `ω_i` from the hemisphere
		- Trace a ray in that direction to find `L_i`
		- Recursively evaluate the rendering equation at the hit point
		- Average many such estimates to converge to the true integral
- ---
- ## Path Tracing vs Ray Tracing vs Whitted RT
	- Whitted ray tracing (1980)
		- Only traces specular reflections and refractions
		- Direct illumination only (shadow rays to lights)
		- Fast but physically incorrect for diffuse interreflection
	- Distributed ray tracing (Cook 1984)
		- Stochastic sampling for soft shadows, glossy reflections, DOF
		- Still limited — no full global illumination
	- Path tracing (Kajiya 1986)
		- Traces complete light paths from camera to light
		- Handles all light transport: diffuse, specular, caustics, subsurface
		- Unbiased — converges to ground truth with enough samples
- ---
- ## The Algorithm Step by Step
	- Step 1: Generate camera ray
		- For pixel `(i, j)`, compute ray direction through the pixel center (or jittered for AA)
		- `ray.origin = camera.position`
		- `ray.direction = normalize(pixel_world_pos - camera.position)`
		- See [[PathTracer Learning - Concept - Camera Model]]
	- Step 2: Find closest intersection
		- Traverse BVH to find nearest triangle hit
		- If no hit → return sky/environment radiance (sample env map)
		- If hit emissive surface → return emission (with MIS weight if applicable)
	- Step 3: Russian roulette (path termination)
		- Compute survival probability `q = max(throughput.r, throughput.g, throughput.b)`
		- Clamp: `q = clamp(q, 0.05, 0.95)`
		- If `random() > q` → return 0 (path terminated)
		- Otherwise divide contribution by `q` to maintain unbiasedness
	- Step 4: Sample new direction
		- Sample `ω_i` from the BRDF's importance sampling distribution
		- Compute the PDF `p(ω_i)` for the sampled direction
		- Transform from tangent space to world space using TBN matrix
	- Step 5: Evaluate BRDF
		- `f_r = brdf.eval(ω_o, ω_i, N, material)`
		- Compute `cos(θ) = max(0, dot(N, ω_i))`
	- Step 6: NEE — Direct lighting
		- [[PathTracer Learning - Concept - Next Event Estimation]]
		- Sample a point on a light source
		- Trace shadow ray — if unoccluded, add direct contribution
		- Apply MIS weight: `w_nee = p_light² / (p_light² + p_brdf²)`
	- Step 7: Recurse
		- `L_i = trace(new_ray, depth + 1)`
		- `contribution = f_r * L_i * cos(θ) / (p(ω_i) * q)`
		- Apply MIS weight for BRDF sample: `w_brdf = p_brdf² / (p_brdf² + p_light²)`
- ---
- ## Throughput Tracking
	- Instead of recursion, track a running "throughput" multiplier
	- More efficient — avoids deep call stacks
	- ```glsl
	  vec3 throughput = vec3(1.0);
	  vec3 radiance   = vec3(0.0);
	  
	  for (int bounce = 0; bounce < MAX_BOUNCES; bounce++) {
	      HitInfo hit = trace(ray);
	      
	      if (!hit.valid) {
	          radiance += throughput * sampleEnvMap(ray.direction);
	          break;
	      }
	      
	      // Emissive contribution (with MIS weight)
	      if (hit.material.emissive) {
	          float w = (bounce == 0) ? 1.0 : misWeight(p_brdf, p_light_at_hit);
	          radiance += throughput * w * hit.material.emission;
	          break;
	      }
	      
	      // NEE
	      radiance += throughput * computeDirectLighting(hit);
	      
	      // Russian roulette
	      float q = max3(throughput);
	      if (random() > q) break;
	      throughput /= q;
	      
	      // Sample new direction
	      vec3 new_dir = sampleBRDF(hit, ray.direction);
	      float pdf    = brdfPDF(hit, ray.direction, new_dir);
	      vec3 brdf    = evalBRDF(hit, ray.direction, new_dir);
	      float cosTheta = max(0.0, dot(hit.normal, new_dir));
	      
	      throughput *= brdf * cosTheta / pdf;
	      ray = Ray(hit.point + hit.normal * 0.001, new_dir);
	  }
	  ```
- ---
- ## Variance and Convergence
	- Each pixel estimate has variance `σ²`
	- After `N` samples: variance = `σ²/N`, std dev = `σ/√N`
	- To halve noise: need 4× more samples
	- Variance reduction techniques
		- Importance sampling — reduce `σ²` by sampling proportional to integrand
		- Next event estimation — directly sample lights (huge variance reduction)
		- MIS — combine multiple strategies optimally
		- [[PathTracer Learning - ReSTIR]] — reuse samples across pixels and frames
		- Path guiding — learn the light distribution
- ---
- ## Bias vs Variance
	- Unbiased estimator: expected value = true value (no systematic error)
	- Biased estimator: expected value ≠ true value (systematic error)
	- Path tracing is unbiased (with Russian roulette)
	- Clamping radiance introduces bias (but reduces fireflies)
	- Denoising introduces bias (but dramatically reduces variance)
	- In practice: biased but low-variance is often preferred for real-time
- ---
- ## Fireflies
	- Extremely bright pixels from rare high-energy paths
	- Cause: `f(x) / p(x)` is very large for some samples
	- Mitigation strategies
		- Clamp radiance: `L = min(L, max_radiance)` — introduces bias
		- Better importance sampling: reduce variance at the source
		- MIS: prevents double-counting which amplifies fireflies
		- Firefly rejection: discard samples that deviate too far from neighbors
- ---
- ## Related Concepts
	- [[PathTracer Learning - Concept - Monte Carlo Integration]]
	- [[PathTracer Learning - Concept - Importance Sampling]]
	- [[PathTracer Learning - Concept - MIS]]
	- [[PathTracer Learning - Concept - Russian Roulette]]
	- [[PathTracer Learning - Concept - Next Event Estimation]]
	- [[PathTracer Learning - Concept - BRDF]]
	- [[PathTracer Learning - Concept - Camera Model]]
