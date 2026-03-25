---
seoTitle: Solid Angle in Path Tracing – Steradian and Hemisphere Sampling
description: "Solid angle measures the angular extent of a surface as seen from a point. Covers steradians, hemisphere integration, projected solid angle, and light sampling."
keywords: "solid angle, steradian, path tracing, ray tracing, hemisphere sampling, projected solid angle, light sampling, radiometry, GPU rendering, Vulkan, Monte Carlo"
---

tags:: concept, math, geometry, radiometry
title:: PathTracer Learning - Concept - Solid Angle

- # Concept: Solid Angle
	- Parent: [[PathTracer Learning - Phase 1 - Math for Graphics]]
- ---
- ## Definition
	- A solid angle measures "how much of the sphere" a region subtends
	- Analogous to 2D angle (radians) but for 3D directions
	- Unit: steradians (sr)
	- Full sphere: `4π` sr
	- Hemisphere: `2π` sr
	- A small patch on the unit sphere: `dω = sin(θ) dθ dφ`
- ---
- ## Derivation of dω
	- Parameterize the unit sphere with spherical coordinates `(θ, φ)`
		- `θ` — polar angle from +Z axis, range `[0, π]`
		- `φ` — azimuthal angle around Z axis, range `[0, 2π]`
	- A small patch at `(θ, φ)` with size `(dθ, dφ)`:
		- Width along φ: `sin(θ) dφ` (circle at latitude θ has radius `sin(θ)`)
		- Height along θ: `dθ`
		- Area: `dω = sin(θ) dθ dφ`
	- Verify: `∫₀^π ∫₀^{2π} sin(θ) dθ dφ = 2π * [-cos(θ)]₀^π = 2π * 2 = 4π` ✓
- ---
- ## Projected Solid Angle
	- `dω⊥ = cos(θ) dω = cos(θ) sin(θ) dθ dφ`
	- This is the solid angle projected onto the surface plane
	- Appears in the rendering equation as `(N · ω_i) dω_i`
	- Hemisphere integral of projected solid angle: `∫_Ω cos(θ) dω = π`
		- This is why Lambertian BRDF has `1/π` — to normalize over the hemisphere
- ---
- ## Solid Angle of a Sphere
	- A sphere of radius `r` at distance `d` subtends solid angle:
		- `Ω = 2π * (1 - cos(θ_max))` where `sin(θ_max) = r/d`
		- For small angles: `Ω ≈ π * r² / d²` (area / distance²)
	- Used for: sampling area lights, computing light PDFs
- ---
- ## Converting Between Area and Solid Angle
	- A surface patch of area `dA` at distance `r`, angle `θ` to the ray:
		- `dω = cos(θ) * dA / r²`
	- This conversion appears in NEE when computing the PDF of sampling a light
		- `p(ω) = p(A) * r² / cos(θ_light)`
		- `p(A) = 1 / area_of_light` (uniform sampling)
- ---
- ## Hemisphere Sampling PDFs
	- Uniform hemisphere: `p(ω) = 1 / (2π)`
		- Verify: `∫_Ω (1/2π) dω = (1/2π) * 2π = 1` ✓
	- Cosine-weighted hemisphere: `p(ω) = cos(θ) / π`
		- Verify: `∫_Ω (cos(θ)/π) dω = (1/π) * π = 1` ✓
	- GGX NDF sampling: `p(h) = D(h) * cos(θ_h)`
		- Verify: `∫_Ω D(h) cos(θ_h) dω = 1` (by definition of NDF)
- ---
- ## Related
	- [[PathTracer Learning - Concept - Radiometry]]
	- [[PathTracer Learning - Concept - Monte Carlo Integration]]
	- [[PathTracer Learning - Concept - Importance Sampling]]
