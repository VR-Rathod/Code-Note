---
seoTitle: Math for Graphics – Vectors, Matrices, and Transforms Reference
description: "Essential mathematics for 3D graphics and path tracing. Covers vectors, dot/cross products, matrices, transforms, quaternions, and coordinate systems."
keywords: "math for graphics, vectors, matrices, transforms, quaternions, coordinate systems, dot product, cross product, path tracing, ray tracing, GPU rendering, linear algebra"
---

tags:: phase, math, vectors, linear-algebra, probability, radiometry
title:: PathTracer Learning - Phase 1 - Math for Graphics

- # Phase 1 — Math for Graphics
	- Everything a path tracer needs from mathematics. This is not a survey — go deep on each concept until you can derive it from scratch.
	- Parent: [[PathTracer Learning]]
- ---
- ## 1.1 Vector Algebra
	- [[PathTracer Learning - Concept - Dot Product]]
		- Measures alignment between two vectors
		- Used everywhere: lighting, reflection, cosine-weighted sampling
		- `dot(a, b) = |a||b|cos(θ)` — when both are unit vectors, this is just `cos(θ)`
		- Key insight: `dot(N, L) > 0` means light is on the same side as the normal
	- [[PathTracer Learning - Concept - Cross Product]]
		- Produces a vector perpendicular to both inputs
		- Used to build orthonormal bases (tangent, bitangent, normal = TBN matrix)
		- `cross(a, b) = |a||b|sin(θ) * n̂`
		- Order matters: `cross(a, b) = -cross(b, a)`
	- Normalization
		- `normalize(v) = v / length(v)`
		- Always normalize direction vectors before using in dot/cross products
		- Unnormalized normals are a common source of subtle shading bugs
	- Vector reflection formula
		- `reflect(v, n) = v - 2 * dot(v, n) * n`
		- Assumes `n` is unit length
		- Used in specular BRDF evaluation
	- Vector refraction (Snell's law)
		- `n1 * sin(θ1) = n2 * sin(θ2)`
		- GLSL: `refract(v, n, eta)` where `eta = n1/n2`
		- Total internal reflection when `1 - eta² * (1 - dot(n,v)²) < 0`
- ---
- ## 1.2 Coordinate Systems and Transforms
	- World space vs local space vs tangent space
		- World space: global scene coordinates
		- Local space: relative to an object's origin
		- Tangent space: aligned to a surface normal (used for normal maps, BRDF sampling)
	- Building an orthonormal basis from a normal
		- Given `N`, construct `T` (tangent) and `B` (bitangent) such that `{T, B, N}` are mutually perpendicular unit vectors
		- Frisvad / Duff et al. method (numerically stable):
			- ```glsl
			  void buildONB(vec3 N, out vec3 T, out vec3 B) {
			      float s = sign(N.z);
			      float a = -1.0 / (s + N.z);
			      float b = N.x * N.y * a;
			      T = vec3(1.0 + s * N.x * N.x * a, s * b, -s * N.x);
			      B = vec3(b, s + N.y * N.y * a, -N.y);
			  }
			  ```
		- Used to transform sampled directions from tangent space to world space
	- Homogeneous coordinates
		- 4D representation: `(x, y, z, w)` where `w=1` for points, `w=0` for directions
		- Allows translation to be expressed as matrix multiplication
		- `w=0` vectors are unaffected by translation — correct for normals and ray directions
	- Normal transform rule
		- Normals do NOT transform with the model matrix `M`
		- They transform with the inverse-transpose: `N_world = transpose(inverse(M)) * N_local`
		- If `M` is orthogonal (rotation only), then `inverse(M) = transpose(M)` so it simplifies to just `M`
		- See [[PathTracer Learning - Concept - Normal Mapping]] for tangent-space details
- ---
- ## 1.3 Radiometry — The Language of Light
	- [[PathTracer Learning - Concept - Radiometry]]
		- Radiant flux, irradiance, radiance — the quantities path tracing computes
		- Understanding units prevents factor-of-π errors
	- [[PathTracer Learning - Concept - Solid Angle]]
		- The 2D angle measure on a sphere — `dω = sin(θ) dθ dφ`
		- Full sphere = `4π` sr, hemisphere = `2π` sr
		- Essential for understanding PDFs and the rendering equation
	- Key radiometric quantities
		- Radiant flux `Φ` — total power (watts)
		- Irradiance `E` — power per unit area arriving at a surface (`W/m²`)
		- Radiance `L` — power per unit area per unit solid angle (`W/m²/sr`)
		- Radiance is what cameras measure and what path tracing computes
- ---
- ## 1.4 Probability and Statistics for Rendering
	- [[PathTracer Learning - Concept - Monte Carlo Integration]]
		- Estimating integrals by random sampling
		- The rendering equation is an integral — Monte Carlo is how we solve it
	- [[PathTracer Learning - Concept - Importance Sampling]]
		- Sample more where the integrand is large
		- Reduces variance dramatically for glossy BRDFs
	- [[PathTracer Learning - Concept - MIS]]
		- Multiple Importance Sampling — combine BRDF and light sampling optimally
		- Power heuristic, balance heuristic
	- Probability Density Function (PDF)
		- `p(x)` — probability of sampling value `x`
		- Must integrate to 1 over the domain: `∫ p(x) dx = 1`
		- For uniform hemisphere sampling: `p(ω) = 1 / (2π)`
		- For cosine-weighted hemisphere: `p(ω) = cos(θ) / π`
	- Expected value and variance
		- `E[f(x)] = ∫ f(x) p(x) dx`
		- Monte Carlo estimator: `(1/N) Σ f(xᵢ) / p(xᵢ)` converges to `E[f]`
		- Variance decreases as `O(1/N)` — doubling samples halves variance, not error
	- Quasi-Monte Carlo
		- Low-discrepancy sequences (Halton, Sobol) instead of pseudo-random
		- Converges at `O(1/N)` for smooth integrands vs `O(1/√N)` for random
		- Blue noise sampling — perceptually better distribution of samples
- ---
- ## 1.5 The Rendering Equation
	- Kajiya 1986 — the foundation of physically-based rendering
	- `L_o(x, ω_o) = L_e(x, ω_o) + ∫_Ω f_r(x, ω_i, ω_o) L_i(x, ω_i) (N · ω_i) dω_i`
		- `L_o` — outgoing radiance (what we want to compute)
		- `L_e` — emitted radiance (light sources)
		- `f_r` — BRDF (how the surface scatters light)
		- `L_i` — incoming radiance (recursive — this is why it's hard)
		- `(N · ω_i)` — Lambert's cosine law
		- `∫_Ω` — integral over the hemisphere of incoming directions
	- Why it's recursive
		- `L_i(x, ω_i)` is the outgoing radiance from whatever surface the ray hits
		- That surface also has its own rendering equation
		- Path tracing solves this by tracing paths of finite length and using Russian roulette to terminate
	- Light transport equation (LTE)
		- More general form: accounts for participating media (fog, smoke)
		- `L(x→y) = L_e(x→y) + ∫ f_s(x, ω_i, ω_o) L(x'→x) G(x, x') V(x, x') dA`
		- `G(x, x')` — geometry term (cosines and distance)
		- `V(x, x')` — visibility (0 or 1)
- ---
- ## 1.6 Camera Model
	- [[PathTracer Learning - Concept - Camera Model]]
		- Pinhole camera, thin lens model, depth of field
		- How to generate primary rays from pixel coordinates
- ---
- ## Phase 1 Checklist
	- TODO Can derive dot product formula from first principles
	- TODO Can build an orthonormal basis from a normal vector
	- TODO Understand why normals use inverse-transpose transform
	- TODO Can explain Monte Carlo integration and why it works
	- TODO Can write the rendering equation from memory and explain each term
	- TODO Understand the difference between uniform and cosine-weighted hemisphere sampling
	- TODO Can explain radiance vs irradiance and why the distinction matters
	- TODO Understand solid angle and how `dω = sin(θ) dθ dφ` is derived
	- TODO Can explain MIS power heuristic and when to use it
- ---
- ## Next
	- [[PathTracer Learning - Phase 2 - CPU Ray Tracing]]