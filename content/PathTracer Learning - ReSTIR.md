tags:: restir, importance-sampling, direct-lighting, advanced
title:: PathTracer Learning - ReSTIR

- # ReSTIR — Reservoir-based Spatiotemporal Importance Resampling
	- Bitterli et al. 2020 — one of the most impactful real-time rendering papers.
	- Enables high-quality direct lighting with thousands of lights at real-time rates.
	- Parent: [[PathTracer Learning]]
- ---
- ## The Problem ReSTIR Solves
	- Direct lighting with many lights
		- Naive: sample one random light per pixel → high variance with many lights
		- Better: sample proportional to light contribution → need to evaluate all lights
		- ReSTIR: efficiently find good light samples by resampling candidates
	- Key insight
		- Resampled Importance Sampling (RIS): generate M candidates, select 1 proportional to target PDF
		- Reservoir: compact data structure to maintain RIS state
		- Temporal reuse: reuse reservoir from previous frame (free extra samples)
		- Spatial reuse: share reservoirs with neighbors (more free samples)
- ---
- ## Resampled Importance Sampling (RIS)
	- Goal: sample from target distribution `p̂(x)` when direct sampling is hard
	- Algorithm
		- Generate M candidates `{x_1, ..., x_M}` from source distribution `q(x)`
		- Select one candidate with probability proportional to `w_i = p̂(x_i) / q(x_i)`
		- The selected sample approximates sampling from `p̂`
	- Weight formula
		- `W = (1/M) * Σ w_i` — sum of weights
		- Unbiased contribution weight: `W_selected = W / p̂(x_selected)`
	- In practice for direct lighting
		- `q(x)` = uniform over all lights (easy to sample)
		- `p̂(x)` = `L_e(x) * G(x) * V(x)` — emission × geometry × visibility
		- Visibility `V(x)` is expensive — defer to final evaluation
- ---
- ## The Reservoir Data Structure
	- Compact structure per pixel
		- ```
		  struct Reservoir {
		      LightSample y;      // current selected sample
		      float w_sum;        // sum of weights seen so far
		      int M;              // number of candidates processed
		      float W;            // unbiased contribution weight
		  };
		  ```
	- Streaming update (one candidate at a time)
		- ```
		  void update(Reservoir r, LightSample x, float w):
		      r.w_sum += w
		      r.M += 1
		      if random() < w / r.w_sum:
		          r.y = x   // replace selected sample
		  ```
	- Merging two reservoirs
		- ```
		  Reservoir merge(Reservoir a, Reservoir b):
		      combined = new Reservoir()
		      update(combined, a.y, p̂(a.y) * a.W * a.M)
		      update(combined, b.y, p̂(b.y) * b.W * b.M)
		      combined.M = a.M + b.M
		      combined.W = combined.w_sum / (p̂(combined.y) * combined.M)
		      return combined
		  ```
- ---
- ## ReSTIR DI Algorithm (per frame)
	- Pass 1: Initial candidates
		- For each pixel: sample M=32 light candidates from `q` (uniform)
		- Store in reservoir
	- Pass 2: Temporal reuse
		- Reproject previous frame's reservoir to current pixel
		- Merge current reservoir with reprojected reservoir
		- Cap M to prevent unbounded growth (M_max = 20 typically)
	- Pass 3: Spatial reuse
		- For each pixel: sample K=5 neighboring pixels
		- Merge their reservoirs into current pixel's reservoir
		- Apply MIS weights to avoid bias from different pixel domains
	- Pass 4: Shading
		- Evaluate visibility for final selected sample (one shadow ray)
		- Compute shading: `L = f_r * L_e * G * V * W`
- ---
- ## Bias in ReSTIR
	- Naive spatial reuse is biased
		- Neighbor's reservoir was selected for neighbor's domain, not current pixel
		- Using it directly introduces bias (incorrect PDF)
	- Correction methods
		- MIS-based resampling (Talbot 2005) — correct but expensive
		- Pairwise MIS (Bitterli 2022) — efficient and unbiased
		- 1/M heuristic — biased but fast, often acceptable
- ---
- ## ReSTIR GI (Global Illumination)
	- Extends ReSTIR to indirect lighting
	- Each reservoir stores a full path segment (not just a light)
	- Temporal and spatial reuse of path segments
	- Much more complex bias correction needed
	- Paper: "ReSTIR GI: Path Resampling for Real-Time Path Tracing" (Ouyang et al. 2021)
- ---
- ## Implementation Notes
	- Two reservoir buffers needed (ping-pong for temporal)
	- Spatial reuse needs neighbor reservoirs from same frame (not current pass)
	- Use a separate spatial pass reading from temporal output
	- Visibility reuse: cache shadow ray results to avoid redundant traces
- ---
- ## Related
	- [[PathTracer Learning - Concept - Importance Sampling]]
	- [[PathTracer Learning - Concept - Next Event Estimation]]
	- [[PathTracer Learning - Phase 5 - Advanced Topics]]
