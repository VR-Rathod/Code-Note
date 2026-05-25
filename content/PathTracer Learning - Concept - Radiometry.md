---
date: 2026-04-03T15:14:37+05:30
lastmod: 2026-04-03T15:14:37+05:30

seoTitle: Radiometry in Path Tracing – Radiance, Irradiance, and Flux Guide
description: "Radiometry provides the physical basis for light measurement in rendering. Covers radiance, irradiance, flux, solid angle, BRDF, and the rendering equation."
keywords: "radiometry, radiance, irradiance, flux, solid angle, rendering equation, path tracing, ray tracing, physically-based rendering, GPU rendering, Vulkan, light measurement"
---

tags:: concept, math, radiometry, physics
title:: PathTracer Learning - Concept - Radiometry

- # Concept: Radiometry
	- Parent: [[PathTracer Learning - Phase 1 - Math for Graphics]]
- ---
- ## Why Radiometry Matters
	- Path tracing computes physically correct light transport
	- Without understanding radiometric units, you'll get factor-of-π errors and wrong energy conservation
	- Every quantity in the rendering equation has a specific unit — know them
- ---
- ## Radiometric Quantities
	- Radiant energy `Q` — total energy of light (joules, J)
	- Radiant flux `Φ` — power, energy per unit time (watts, W)
		- A 100W light bulb emits 100W of radiant flux (most as heat, ~5% as visible light)
	- Irradiance `E` — flux arriving per unit area (W/m²)
		- `E = dΦ / dA`
		- Depends on angle of incidence: `E = L * cos(θ)` for a single beam
		- This is what a solar panel measures
	- Radiance `L` — flux per unit area per unit solid angle (W/m²/sr)
		- `L = d²Φ / (dA * dω * cos(θ))`
		- The `cos(θ)` accounts for projected area
		- Radiance is what cameras measure — it's the "brightness" of a ray
		- Key property: radiance is constant along a ray in vacuum (no participating media)
- ---
- ## Radiance is What Path Tracing Computes
	- Each ray in a path tracer returns a radiance value `L`
	- The rendering equation computes outgoing radiance `L_o`
	- The camera integrates radiance over the pixel area and lens aperture
	- Pixel value = `∫∫ L(ray(x,y)) * W(x,y) dx dy` where `W` is the pixel filter
- ---
- ## Relationship Between Quantities
	- Irradiance from radiance: `E(x) = ∫_Ω L(x, ω) cos(θ) dω`
		- Integrate radiance over the hemisphere, weighted by cosine
		- This is the integral in the rendering equation
	- Radiance from irradiance: `L = dE / (dω * cos(θ))`
	- For a Lambertian emitter: `L_e = M / π` where `M` is exitance (W/m²)
		- Exitance `M` = total power emitted per unit area
		- The `1/π` comes from integrating over the hemisphere
- ---
- ## Spectral Quantities
	- All quantities above have spectral versions (per wavelength)
	- Spectral radiance: `L_λ(λ)` in W/m²/sr/nm
	- RGB rendering: approximate by sampling at 3 wavelengths (R≈700nm, G≈546nm, B≈436nm)
	- Spectral rendering: sample many wavelengths, reconstruct color at end
- ---
- ## Common Mistakes
	- Confusing radiance and irradiance
		- Radiance: per solid angle (directional)
		- Irradiance: integrated over hemisphere (omnidirectional)
	- Missing the `cos(θ)` factor
		- `E = L * cos(θ)` — a surface tilted away from a light receives less irradiance
		- This is Lambert's cosine law — it's a geometric fact, not a material property
	- Wrong units for emissive materials
		- If you want a light to emit `X` watts total: `L_e = X / (area * π)` for Lambertian emitter
		- If you set `L_e = X` directly: the total emitted power scales with area
- ---
- ## Related
	- [[PathTracer Learning - Concept - Solid Angle]]
	- [[PathTracer Learning - Path Tracing Algorithm]]
	- [[PathTracer Learning - Concept - BRDF]]