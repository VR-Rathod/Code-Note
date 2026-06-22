---
seoTitle: The Render Equation From Scratch – Complete Beginner to Advanced Guide
description: "Learn the rendering equation (Kajiya 1986) from absolute scratch. Every term explained with intuition, diagrams, code, and how path tracing solves it with Monte Carlo integration."
keywords: "render equation, rendering equation, Kajiya 1986, BRDF, radiance, irradiance, Monte Carlo, path tracing, hemisphere integral, cos theta, light transport, beginner graphics"
treeTitle: Game Development - Graphics Programming From Scratch - Render Equation
---

tags:: graphics, render-equation, radiometry, math, beginner-to-advanced
title:: GPFS Render Equation

- # The Render Equation — From Scratch
	- **The single most important equation in all of computer graphics.**
	- Understand this and you understand WHY path tracing, PBR, and all modern rendering works.
	- **Prerequisites:** Basic algebra, basic understanding of what a ray is
	- Parent: [[Graphics Programming From Scratch]]
- ---
- ## 🟢 Chapter 1 — The Problem We're Solving
  collapsed:: true
	- ### The Question Every Renderer Answers
		- For every pixel on screen, a renderer must answer:
		- > **"How much light arrives at the camera through this pixel?"**
		- To answer this, for each pixel we cast a ray through it into the scene
		- The ray hits a surface — now the question becomes:
		- > **"How much light leaves this surface point toward the camera?"**
		- This is what the rendering equation computes
	- ### Intuition First — A Simple Scene
		- Imagine a red ball lit by a single lamp
		- Light from the lamp hits the ball
		- The ball scatters some of that light toward your eye
		- Your eye (camera) receives that scattered light → you see the ball
		- The rendering equation formalizes this chain
	- ### The Challenge: Indirect Light
		- Direct light: lamp → ball → eye. Simple.
		- But what about: lamp → floor → ball → eye? (indirect/bounced light)
		- And: lamp → ceiling → wall → ball → eye? (2-bounce indirect)
		- And so on infinitely...
		- This is **global illumination** — the rendering equation handles all of it
- ---
- ## 🟢 Chapter 2 — Building Blocks: Units of Light
  collapsed:: true
	- Before writing the equation we need to know what we're measuring.
	- ### Radiometry — The Science of Measuring Light
		- Graphics uses **radiometry** — measuring light as physical energy, not human perception
		- | Quantity | Symbol | Unit | What it measures |
		  |---|---|---|---|
		  | Radiant Energy | Q | Joule (J) | Total energy in light |
		  | Radiant Flux | Φ | Watt (W) | Power (energy per second) |
		  | Irradiance | E | W/m² | Power arriving per unit area |
		  | Radiance | L | W/m²/sr | Power per area per solid angle |
	- ### Solid Angle — What is `dω`?
		- A **solid angle** measures a cone of directions in 3D space
		- Units: steradians (sr)
		- Full sphere = 4π sr
		- Upper hemisphere = 2π sr
		- Think of it like 2D angle (radians) extended into 3D
		- ```
		  2D: arc length / radius = angle in radians
		  3D: surface area on unit sphere / 1² = solid angle in steradians
		  ```
		- `dω` in the rendering equation = infinitely small cone of incoming directions
	- ### Radiance — The Key Quantity
		- **Radiance** `L` is what cameras measure and what path tracing computes
		- It's power per unit area per unit solid angle: `L = d²Φ / (dA · dω · cos θ)`
		- Key property: **radiance is constant along a ray** in a vacuum
		- This means: the brightness of a point as seen from far away is the same as close up
		- This is why we can assign a single `L` value to each ray in a path tracer
- ---
- ## 🟡 Chapter 3 — The Equation, Introduced Gently
  collapsed:: true
	- ### James Kajiya, 1986
		- At SIGGRAPH 1986, James T. Kajiya published "The Rendering Equation"
		- It unified all previous rendering techniques under a single framework
		- Path tracing, radiosity, photon mapping, bidirectional methods — all solving the same equation
	- ### The Equation
		- ```
		  L_o(x, ω_o) = L_e(x, ω_o) + ∫_Ω f_r(x, ω_i, ω_o) · L_i(x, ω_i) · (N · ω_i) · dω_i
		  ```
		- In plain English:
		- > **"The light leaving a surface toward the camera equals its own emission PLUS the integral over all incoming directions of: how the surface scatters that incoming light toward the camera."**
	- ### First Reading — Don't Panic
		- The integral `∫_Ω ... dω_i` just means: add up contributions from every direction in the hemisphere
		- Think of it as: for every possible direction light could come from, add its contribution
		- In practice we can't sum all infinite directions → Monte Carlo samples a few random ones
- ---
- ## 🟡 Chapter 4 — Every Term Explained
  collapsed:: true
	- ### `L_o(x, ω_o)` — Outgoing Radiance (WHAT WE COMPUTE)
		- `L_o` = outgoing radiance
		- `x` = the point on the surface we're shading
		- `ω_o` = the outgoing direction (toward the camera or previous bounce)
		- This is the **answer** — the color+brightness of the surface at `x` as seen from `ω_o`
		- In a path tracer, this is what each ray ultimately returns
		- Visualization:
		- ```
		       Camera
		         ↑  ω_o (outgoing direction)
		         |
		    ─────x─────  ← surface point we're computing
		  ```
	- ### `L_e(x, ω_o)` — Emitted Radiance
		- `L_e` = light emitted directly from the surface (if it's a light source)
		- For most surfaces: `L_e = 0` (they don't glow)
		- For an area light:
			- Lambertian emitter: `L_e = Power / (Area × π)`
			- The `1/π` ensures total emitted flux = Power
		- Can be directional: some lights emit more in some directions
		- In code:
		- ```glsl
		  vec3 L_emitted = material.isEmissive ? material.emission : vec3(0.0);
		  ```
	- ### `∫_Ω ... dω_i` — The Hemisphere Integral
		- `Ω` = the hemisphere of directions above the surface at `x`
		- We integrate over ALL directions that could bring light to `x`
		- ```
		             ω_i (incoming direction)
		              ↗ ↑ ↗
		             /  |  \
		        ─────────────  surface
		             Hemisphere Ω
		        (half a sphere above the surface)
		  ```
		- Why only the upper hemisphere?
			- Light from below the surface would have to pass through the geometry — usually blocked
			- Transparent materials (glass) need the full sphere (BSDF, not BRDF)
		- In practice, we can't solve this integral analytically → **Monte Carlo**
			- Sample a random direction `ω_i` from the hemisphere
			- Evaluate the integrand at that direction
			- Divide by the probability of sampling that direction (PDF)
			- Average over many samples → converges to the true integral
	- ### `f_r(x, ω_i, ω_o)` — The BRDF
		- The **BRDF** (Bidirectional Reflectance Distribution Function)
		- Answers: **"Given incoming light from `ω_i`, how much goes toward `ω_o`?"**
		- Units: `1/sr` (per steradian)
		- For a perfect mirror: `f_r` is a delta function (all light goes in one direction)
		- For a matte surface (Lambertian): `f_r = albedo / π` (equal in all directions)
		- For a metal: `f_r = Cook-Torrance GGX` (see [[GPFS PBR]])
		- The BRDF encodes the entire material appearance — it's the material model
		- ```
		           ω_o (outgoing)
		            ↑ 
		     ω_i    |   ω_i       Mirror: only this direction matters
		       ↘    |   ↙         Diffuse: all directions matter equally
		        ──────────────    surface
		  ```
	- ### `L_i(x, ω_i)` — Incoming Radiance (THE RECURSIVE PART)
		- `L_i(x, ω_i)` = radiance arriving at `x` from direction `ω_i`
		- This is NOT a known value — it's the rendering equation output from another point
		- **The key insight:** `L_i(x, ω_i) = L_o(x', -ω_i)` where `x'` is the first surface hit by a ray from `x` in direction `ω_i`
		- ```
		                L_o(x', -ω_i)  ← computed recursively
		               ↓
		       x' ─────────  another surface
		         ↗ ω_i
		        /
		  ─────x────  current surface
		  
		  L_i at x = L_o at x' = another rendering equation evaluation
		  ```
		- This recursive dependency is why the rendering equation is hard — it references itself
	- ### `(N · ω_i)` — Lambert's Cosine Law
		- `N` = surface normal at `x` (unit vector pointing away from surface)
		- `ω_i` = incoming light direction (unit vector)
		- `N · ω_i = cos(θ)` where `θ` is the angle between them
		- **Physical meaning:** a surface tilted at an angle receives less light per unit area
		- ```
		  θ = 0°: Light head-on → cos(0) = 1.0 → full intensity
		  θ = 60°: 60° tilt    → cos(60) = 0.5 → half intensity
		  θ = 90°: Grazing     → cos(90) = 0.0 → zero intensity
		  
		  Same light power, but spread over more surface area:
		           ↓ ↓ ↓              ↓ ↓ ↓
		  ─────────────────     ────/──/──/────
		  Full intensity         Reduced per unit area
		  ```
		- This is NOT a material property — it's pure geometry
		- In code: `float cosTheta = max(dot(N, omega_i), 0.0);`
		- The `max(...)` clips to 0 — light from below the surface contributes nothing
- ---
- ## 🟠 Chapter 5 — Why It's Recursive and How We Solve It
  collapsed:: true
	- ### The Infinite Recursion Problem
		- To compute `L_o(x, ω_o)` we need `L_i(x, ω_i)` for all directions
		- `L_i(x, ω_i) = L_o(x', -ω_i)` — which requires solving the equation AGAIN at `x'`
		- That requires `L_o` at yet more points, which require more, infinitely
		- A Cornell Box (simple scene) technically has infinite light bounces
	- ### Approaches to Solving It
		- | Method | Idea | Pros | Cons |
		  |---|---|---|---|
		  | Path Tracing | Monte Carlo + random paths | Unbiased, general | Noisy without many samples |
		  | Radiosity | Finite elements, diffuse only | No noise | Only diffuse surfaces |
		  | Photon Mapping | Trace photons from lights + gather | Good caustics | Memory, biased |
		  | Whitted RT | Only specular + direct | Fast, classic | Misses diffuse interreflection |
		  | Rasterization | Approximate: shadow maps + IBL | Real-time | Not a true solution |
	- ### How Path Tracing Solves It
		- **Step 1:** Choose a random direction `ω_i` from the hemisphere
		- **Step 2:** Trace a ray in that direction — find `x'`
		- **Step 3:** Recursively evaluate `L_o(x', -ω_i)` — this is `L_i(x, ω_i)`
		- **Step 4:** Compute: `f_r · L_i · cos(θ) / p(ω_i)` — one sample of the integral
		- **Step 5:** Stop after `N` bounces (or use Russian Roulette — see below)
		- **Step 6:** Repeat many times per pixel and average → converges to true integral
		- ### Monte Carlo Estimator
		- ```
		  The true integral:    ∫_Ω f_r · L_i · cos(θ) dω_i
		  
		  MC estimator (N=1):   f_r(ω_i) · L_i(ω_i) · cos(θ) / p(ω_i)
		  
		  Where ω_i is sampled from probability distribution p(ω_i)
		  Expected value = true integral (unbiased!)
		  ```
		- ### Why Divide by `p(ω_i)`?
			- We sample directions non-uniformly (more samples where integrand is larger)
			- To get an unbiased estimate, divide by the probability of that sample
			- Uniform hemisphere: `p(ω) = 1/(2π)` → divide by `1/(2π)` = multiply by `2π`
			- Cosine-weighted: `p(ω) = cos(θ)/π` → divides out the `cos(θ)` term
		- ### Convergence Rate
			- After `N` samples: error ≈ `σ/√N` where `σ` = variance
			- To halve the noise → need 4× more samples
			- To cut noise by 10× → need 100× more samples
			- This is why variance reduction (importance sampling, NEE, MIS) is critical
- ---
- ## 🟠 Chapter 6 — Path Termination: Russian Roulette
  collapsed:: true
	- ### The Problem with Fixed Depth
		- If we stop after 5 bounces, we miss light paths longer than 5
		- This introduces **bias** — the estimate is systematically wrong (too dark)
	- ### Russian Roulette — Unbiased Termination
		- At each bounce, randomly decide to continue or stop
		- If continuing: probability `q`, divide contribution by `q` (removes bias)
		- If stopping: return 0
		- Expected value is unchanged! The path terminates eventually but the estimator stays correct
		- ```glsl
		  float q = max(throughput.r, throughput.g, throughput.b);
		  q = clamp(q, 0.05, 0.95);  // don't terminate too early or never
		  
		  if (random() > q) {
		      break;  // terminate this path
		  }
		  throughput /= q;  // compensate: divide by survival probability
		  ```
		- Paths with low throughput (dark, absorbed a lot) are more likely to terminate
		- Paths with high throughput (bright, reflective) continue longer
		- This is physically correct — bright paths carry more information
- ---
- ## 🔴 Chapter 7 — The Equation in Code (Full Path Tracer)
  collapsed:: true
	- This is the rendering equation expressed as a recursive path tracer in GLSL pseudocode:
	- ```glsl
	  // The rendering equation as code
	  // L_o(x, ω_o) = L_e(x, ω_o) + ∫ f_r * L_i * cos(θ) dω_i
	  
	  vec3 pathTrace(Ray ray, int depth, int maxDepth) {
	      // Find the first surface hit
	      HitInfo hit = intersectScene(ray);
	  
	      // --- Miss: return environment/sky radiance ---
	      if (!hit.valid) {
	          return sampleEnvironmentMap(ray.direction);  // L_i from sky
	      }
	  
	      // --- L_e: Emission ---
	      // If we hit a light source, it emits radiance directly
	      if (hit.material.isEmissive) {
	          return hit.material.emission;  // L_e term
	      }
	  
	      // --- Termination ---
	      if (depth >= maxDepth) return vec3(0.0);  // fixed depth (biased)
	      // OR use Russian Roulette for unbiased termination
	  
	      // --- Sample ω_i: choose a random incoming direction ---
	      // (this is one sample of the integral ∫_Ω ... dω_i)
	      vec3 omega_i;
	      float pdf;
	      sampleHemisphere(hit.normal, omega_i, pdf);
	      // omega_i: sampled direction (in world space)
	      // pdf: probability density of this sample (p(ω_i))
	  
	      // --- Evaluate BRDF: f_r(x, ω_i, ω_o) ---
	      vec3 f_r = evalBRDF(hit.material, -ray.direction, omega_i, hit.normal);
	  
	      // --- cos(θ): Lambert's cosine term ---
	      float cosTheta = max(dot(hit.normal, omega_i), 0.0);
	  
	      // --- Recurse: find L_i(x, ω_i) = L_o(x', -ω_i) ---
	      Ray nextRay;
	      nextRay.origin    = hit.point + hit.normal * 0.0001;  // offset to avoid self-intersection
	      nextRay.direction = omega_i;
	  
	      vec3 L_i = pathTrace(nextRay, depth + 1, maxDepth);  // RECURSIVE CALL
	      // This IS the rendering equation's recursive L_i term
	  
	      // --- Monte Carlo Estimator ---
	      // Integral ≈ f_r * L_i * cos(θ) / p(ω_i)
	      vec3 L_indirect = f_r * L_i * cosTheta / max(pdf, 0.0001);
	  
	      // --- Final: L_o = L_e + integral ---
	      return hit.material.emission + L_indirect;
	      //         ↑ L_e term          ↑ integral term
	  }
	  ```
	- ### The Iterative Version (GPU-Friendly)
		- Recursion is expensive on GPU — use a loop with a throughput accumulator:
		- ```glsl
		  vec3 pathTraceIterative(Ray ray) {
		      vec3 radiance   = vec3(0.0);  // accumulated L_o
		      vec3 throughput = vec3(1.0);  // product of f_r * cos(θ) / pdf across bounces
		  
		      for (int bounce = 0; bounce < MAX_BOUNCES; bounce++) {
		          HitInfo hit = intersectScene(ray);
		  
		          if (!hit.valid) {
		              radiance += throughput * sampleEnvironmentMap(ray.direction);
		              break;
		          }
		  
		          // L_e — emission (if we hit a light)
		          radiance += throughput * hit.material.emission;
		          if (hit.material.isEmissive) break;
		  
		          // Russian Roulette
		          float q = max3(throughput);
		          if (random() > clamp(q, 0.05, 0.95)) break;
		          throughput /= q;
		  
		          // Sample new direction
		          vec3 omega_i; float pdf;
		          sampleBRDF(hit, -ray.direction, omega_i, pdf);
		  
		          // Update throughput: multiply by f_r * cos(θ) / pdf
		          vec3  f_r      = evalBRDF(hit.material, -ray.direction, omega_i, hit.normal);
		          float cosTheta = max(dot(hit.normal, omega_i), 0.0);
		          throughput    *= f_r * cosTheta / pdf;
		  
		          // Advance ray
		          ray.origin    = hit.point + hit.normal * 0.0001;
		          ray.direction = omega_i;
		      }
		      return radiance;
		  }
		  ```
- ---
- ## 🔴 Chapter 8 — Extended Forms
  collapsed:: true
	- ### The Light Transport Equation (Participating Media)
		- The standard rendering equation only handles surfaces
		- For fog, smoke, clouds, skin — we need the **Light Transport Equation (LTE)**:
		- ```
		  L(x→y) = L_e(x→y) + ∫ f_s(x, ω_i, ω_o) · L(x'→x) · G(x,x') · V(x,x') dA
		  
		  G(x,x') = cos(θ_x) · cos(θ_y) / |x-y|²    geometry term
		  V(x,x') = 1 if x and x' can see each other, 0 if blocked    visibility
		  ```
		- `f_s` = **phase function** (like a BRDF but for volume scattering)
			- Henyey-Greenstein phase function: most common approximation
		- Used for: clouds, smoke, fog, subsurface scattering
	- ### Spectral Rendering
		- The rendering equation operates on **spectral radiance** `L_λ(x, ω, λ)` in W/m²/sr/nm
		- RGB rendering: approximate by 3 wavelength samples (Red ≈ 700nm, Green ≈ 546nm, Blue ≈ 436nm)
		- Full spectral rendering: sample a wavelength per ray → more accurate colors, dispersion, fluorescence
	- ### The Four-Dimensional Integral
		- For a complete view, `L_o` is a 4D function: position (2D on surface) × direction (2D on hemisphere)
		- Rendering = solving this function for the 2D pixel grid visible to the camera
		- Each pixel integrates over a cone of directions (pixel filter) and a lens aperture (DOF)
- ---
- ## 🔴 Chapter 9 — Variance Reduction (Advanced)
  collapsed:: true
	- Naive Monte Carlo is slow — variance requires thousands of samples per pixel.
	- These techniques reduce variance dramatically.
	- ### Importance Sampling
		- Sample `ω_i` proportional to the integrand (`f_r · L_i · cos(θ)`)
		- If we sample where the integrand is large → variance → 0
		- Cosine-weighted sampling (common):
			- `p(ω) = cos(θ)/π` → `cos(θ)` terms cancel → estimator = `f_r · L_i`
		- BRDF importance sampling:
			- Sample proportional to `f_r` → variance reduced to only from `L_i` variation
		- See [[PathTracer Learning Importance Sampling]]
	- ### Next Event Estimation (NEE / Direct Illumination)
		- Instead of randomly hoping a ray hits a light, **explicitly** sample a point on a light
		- Trace a shadow ray → if unoccluded, add direct contribution
		- Dramatically reduces variance for scenes with small area lights
		- See [[PathTracer Learning Next Event Estimation]]
	- ### Multiple Importance Sampling (MIS)
		- Combine multiple sampling strategies (BRDF + light) with optimal weights
		- Power heuristic: `w_i = p_i^2 / Σ p_j^2`
		- Best of both: BRDF sampling (good for specular) + NEE (good for diffuse)
		- See [[PathTracer Learning MIS]]
	- ### ReSTIR (Real-Time Path Tracing)
		- Reservoir-based spatiotemporal importance resampling (NVIDIA 2020)
		- Reuse samples from neighboring pixels and previous frames
		- Makes real-time path tracing viable (1 spp → looks like 1000 spp)
		- See [[PathTracer Learning ReSTIR]]
- ---
- ## ✅ Chapter 10 — Checklist
  collapsed:: true
	- ### Beginner
		- TODO Can state the rendering equation from memory
		- TODO Can explain what L_o, L_e, f_r, L_i, and cos(θ) mean in plain English
		- TODO Understand why we integrate over the hemisphere (not full sphere)
		- TODO Know the difference between radiance (L) and irradiance (E)
	- ### Intermediate
		- TODO Understand why L_i makes the equation recursive
		- TODO Can explain Monte Carlo integration in 1–2 sentences
		- TODO Understand why we divide by the PDF p(ω_i)
		- TODO Know what Russian Roulette does and why it doesn't introduce bias
	- ### Advanced
		- TODO Can implement the rendering equation as a recursive GLSL function
		- TODO Understand the iterative throughput approach and why it's faster on GPU
		- TODO Can explain cosine-weighted vs BRDF importance sampling
		- TODO Understand how NEE reduces variance for small lights
		- TODO Can derive the Monte Carlo estimator from the definition of expected value
- ---
- ## 🔗 Related
	- [[GPFS PBR]] — The BRDF (f_r) term in full detail
	- [[GPFS Ray Marching]] — Practice implementing lighting in a simpler context first
	- [[GPFS Vulkan GPU Architecture]] — How path tracers run on real hardware
	- [[PathTracer Learning Path Tracing Algorithm]] — Full algorithm with all optimizations
	- [[PathTracer Learning Monte Carlo Integration]] — Monte Carlo deep dive
	- [[PathTracer Learning Radiometry]] — Radiometry deep dive
	- [[Graphics Programming From Scratch]]