---
seoTitle: Fresnel Effect in Path Tracing – Reflectance and Schlick Guide
description: "The Fresnel effect describes how reflectance varies with viewing angle. Covers Schlick approximation, conductor and dielectric Fresnel, and PBR material models."
keywords: "Fresnel effect, Schlick approximation, path tracing, ray tracing, reflectance, dielectric, conductor, physically-based rendering, PBR, GPU rendering, Vulkan, BRDF"
---

tags:: concept, brdf, materials, fresnel, optics
title:: PathTracer Learning Fresnel Effect

- # Concept: Fresnel Effect
	- Parent: [[PathTracer Learning Phase 2 CPU Ray Tracing]]
- ---
- ## What Is the Fresnel Effect?
	- At any interface between two media, light is partially reflected and partially transmitted
	- The ratio depends on the angle of incidence
	- At grazing angles (θ → 90°): almost all light is reflected
	- At normal incidence (θ = 0°): only a small fraction is reflected
	- This is why water looks like a mirror when viewed at a shallow angle
- ---
- ## Exact Fresnel Equations (Schlick's Approximation)
	- Full Fresnel equations (from Maxwell's equations) are expensive
	- Schlick (1994) approximation — used in virtually all real-time renderers
	- `F(θ) = F0 + (1 - F0) * (1 - cos(θ))^5`
	- `cos(θ) = dot(V, H)` — angle between view direction and half-vector
	- `F0` — reflectance at normal incidence (0° angle)
- ---
- ## F0 Values
	- Dielectrics (non-metals: plastic, glass, skin, wood)
		- `F0 ≈ 0.04` (4%) for most dielectrics
		- Range: 0.02 (water) to 0.08 (gemstones)
		- Formula from IOR: `F0 = ((n - 1) / (n + 1))²`
		- Glass (n=1.5): `F0 = ((1.5-1)/(1.5+1))² = 0.04`
	- Metals (conductors: gold, silver, copper, iron)
		- `F0` = base color of the metal (RGB values)
		- Gold: `F0 ≈ (1.0, 0.71, 0.29)`
		- Silver: `F0 ≈ (0.95, 0.93, 0.88)`
		- Copper: `F0 ≈ (0.95, 0.64, 0.54)`
		- Metals absorb transmitted light — no diffuse component
- ---
- ## Metallic Workflow (PBR)
	- `metallic` parameter in [0, 1]
	- `F0 = lerp(vec3(0.04), baseColor, metallic)`
	- `diffuse_color = baseColor * (1 - metallic)` — metals have no diffuse
	- This is the Disney/Unreal/Godot PBR convention
	- Why: real materials are either dielectric (F0=0.04) or metal (F0=baseColor)
	- Values between 0 and 1 are for blending (e.g., dirty metal, oxidized surface)
- ---
- ## Energy Conservation with Fresnel
	- Fresnel tells us how much light is reflected vs transmitted
	- For opaque surfaces: `transmitted = 1 - F(θ)` → absorbed or diffusely scattered
	- Specular contribution: `F(θ) * f_specular`
	- Diffuse contribution: `(1 - F(θ)) * f_diffuse`
	- This ensures total reflectance ≤ 1
	- In code:
		- ```glsl
		  vec3 F = schlick(F0, dot(V, H));
		  vec3 kS = F;                    // specular fraction
		  vec3 kD = (1.0 - kS) * (1.0 - metallic);  // diffuse fraction (metals have no diffuse)
		  vec3 brdf = kD * diffuse + kS * specular;
		  ```
- ---
- ## Exact Fresnel (for Reference)
	- For dielectrics (real IOR):
		- `rs = (n1*cos(θi) - n2*cos(θt)) / (n1*cos(θi) + n2*cos(θt))`
		- `rp = (n2*cos(θi) - n1*cos(θt)) / (n2*cos(θi) + n1*cos(θt))`
		- `F = (rs² + rp²) / 2`
		- `cos(θt)` from Snell's law: `cos(θt) = sqrt(1 - (n1/n2)² * (1 - cos²(θi)))`
	- For conductors (complex IOR `n + ik`):
		- More complex formula involving absorption coefficient `k`
		- Schlick with measured `F0` is a good approximation
- ---
- ## Total Internal Reflection
	- When light travels from dense to less dense medium (e.g., glass to air)
	- At angles beyond the critical angle: all light is reflected, none transmitted
	- Critical angle: `θ_c = arcsin(n2/n1)` where `n1 > n2`
	- In GLSL refract: returns `vec3(0)` when TIR occurs
	- Check: `1 - eta² * (1 - NdotI²) < 0` → TIR
- ---
- ## Related
	- [[PathTracer Learning BRDF]]
	- [[PathTracer Learning Microfacet Theory]]
	- [[PathTracer Learning Phase 2 CPU Ray Tracing]]