---
seoTitle: Physically Based Rendering (PBR) – Complete Concept Reference
description: "Physically based rendering models how light truly behaves in the real world. Covers energy conservation, BRDFs, the metal-rough workflow, and PBR in game engines."
keywords: "physically based rendering, PBR, BRDF, energy conservation, metal-rough, Disney PBR, Cook-Torrance, GGX, albedo, metallic, roughness, path tracing, real-time rendering"
treeTitle: Game Development - Path Tracing - Physically Based Rendering
---

tags:: concept, pbr, shading, materials, physically-based
title:: PathTracer Learning Physically Based Rendering

- # Physically Based Rendering (PBR)
	- PBR is a collection of techniques that model light-surface interactions based on physics instead of artistic hacks.
	- Parent: [[PathTracer Learning]]
- ---
- ## What Does "Physically Based" Actually Mean?
	- A rendering model is "physically based" when it obeys physical laws
		- **Energy conservation** — a surface cannot reflect more light than it receives
		- **Helmholtz reciprocity** — swapping the light and view directions gives the same result
		- **Microsurface model** — surfaces are modeled as a field of tiny perfect mirrors (microfacets)
		- **Fresnel equations** — reflectance depends on the angle of incidence
	- PBR does NOT mean photorealistic — it means the math is physically correct
	- Even stylized games use PBR because it looks consistent under any lighting
- ---
- ## The Three Pillars of PBR
	- ### 1. Energy Conservation
		- Total reflected light ≤ total received light
		- `∫_Ω f_r(ω_i, ω_o) cos(θ_i) dω_i ≤ 1`
		- Violated by old Blinn-Phong — specular highlight could be brighter than white
		- Enforced in GGX/Cook-Torrance via the `G` (geometry/shadowing) and `D` (NDF) terms
	- ### 2. Microsurface Theory
		- No real surface is perfectly flat — it's covered in microscopic bumps
		- Smooth surface → microfacets mostly aligned → sharp specular highlight
		- Rough surface → microfacets random → wide blurry specular
		- The roughness parameter controls the statistical distribution of microfacet normals
		- See [[PathTracer Learning Microfacet Theory]]
	- ### 3. Fresnel Effect
		- At grazing angles, ALL surfaces become mirror-like
		- Even black rubber reflects like a mirror when viewed from the side
		- `F(θ) = F0 + (1 - F0)(1 - cos θ)^5` — Schlick approximation
		- `F0` — base reflectivity at 0° (perpendicular view)
			- Dielectrics (plastic, skin, wood): F0 ≈ 0.04 (4%)
			- Metals (iron, gold): F0 ≈ 0.5–1.0 (50–100%)
		- See [[PathTracer Learning Fresnel Effect]]
- ---
- ## The Metal-Rough Workflow (Industry Standard)
	- Used by: Unreal Engine, Unity, Godot, Blender Cycles, Substance
	- ### Parameters
		- `Albedo` (Base Color)
			- For dielectrics: the surface color (diffuse color)
			- For metals: the tint of the specular reflection (no diffuse)
			- Should NOT include lighting or ambient occlusion
		- `Metallic` (0.0 → 1.0)
			- 0 = dielectric (plastic, wood, stone)
			- 1 = metal (iron, gold, copper)
			- In nature, surfaces are either metal or not — avoid in-between values except for worn/dirty metal
		- `Roughness` (0.0 → 1.0)
			- 0 = perfect mirror
			- 1 = fully diffuse-looking specular
			- Controls microfacet distribution spread (maps to `α` in GGX: `α = roughness²`)
		- `Normal Map` (optional)
			- Perturbs the geometric normal at pixel level
			- See [[PathTracer Learning Normal Mapping]]
		- `Ambient Occlusion` (optional)
			- Pre-baked shadow in crevices for indirect lighting approximation
	- ### How Metallic Affects the Math
		- Dielectric: `diffuse = albedo * (1 - F)`, `specular = F * GGX`
		- Metal: `diffuse = 0`, `F0 = albedo`, `specular = F0 * GGX`
		- Metals absorb all transmitted light → no diffuse component
		- Blend between the two: `lerp(dielectric_brdf, metal_brdf, metallic)`
- ---
- ## The Cook-Torrance BRDF
	- The standard PBR BRDF for specular reflection
	- `f_r(ω_i, ω_o) = D(h) * G(ω_i, ω_o) * F(ω_o, h) / (4 * (N·ω_i) * (N·ω_o))`
	- `h = normalize(ω_i + ω_o)` — the half-vector between light and view
	- ### D — Normal Distribution Function (NDF)
		- Describes how microfacet normals are statistically distributed
		- GGX (Trowbridge-Reitz) NDF — most common in games
		- `D_GGX(h) = α² / (π * ((N·h)²(α²-1)+1)²)`
		- `α = roughness²` — perceptual roughness remapping (makes the slider feel linear)
		- Phong NDF is older and less accurate — avoid
	- ### G — Geometric Shadowing/Masking
		- Microfacets can shadow (block incoming light) or mask (block outgoing light)
		- Smith approximation: separates into two terms
		- `G(ω_i, ω_o) = G_SchlickGGX(ω_i) * G_SchlickGGX(ω_o)`
		- `G_SchlickGGX(ω) = (N·ω) / ((N·ω)(1-k) + k)` where `k = α/2`
	- ### F — Fresnel (Schlick Approximation)
		- `F(ω_o, h) = F0 + (1 - F0)(1 - (ω_o·h))^5`
	- ### The 4 in the Denominator
		- Accounts for the Jacobian of the half-vector transform
		- Without it, the BRDF would not conserve energy
- ---
- ## Full PBR Shading Model (GLSL)
	- ```glsl
	  vec3 PBR_Direct(vec3 N, vec3 V, vec3 L, vec3 albedo, float metallic, float roughness) {
	      vec3 H = normalize(V + L);
	      float alpha = roughness * roughness;
	      float alpha2 = alpha * alpha;
	  
	      // NdotX terms
	      float NdotL = max(dot(N, L), 0.0);
	      float NdotV = max(dot(N, V), 0.0);
	      float NdotH = max(dot(N, H), 0.0);
	      float VdotH = max(dot(V, H), 0.0);
	  
	      // D — GGX NDF
	      float denom = NdotH * NdotH * (alpha2 - 1.0) + 1.0;
	      float D = alpha2 / (PI * denom * denom);
	  
	      // G — Smith GGX
	      float k = alpha / 2.0;
	      float G_V = NdotV / (NdotV * (1.0 - k) + k);
	      float G_L = NdotL / (NdotL * (1.0 - k) + k);
	      float G = G_V * G_L;
	  
	      // F — Schlick Fresnel
	      vec3 F0 = mix(vec3(0.04), albedo, metallic);
	      vec3 F = F0 + (1.0 - F0) * pow(1.0 - VdotH, 5.0);
	  
	      // Cook-Torrance specular
	      vec3 specular = (D * G * F) / max(4.0 * NdotV * NdotL, 0.001);
	  
	      // Diffuse — Lambertian, scaled by energy not reflected
	      vec3 kd = (1.0 - F) * (1.0 - metallic);
	      vec3 diffuse = kd * albedo / PI;
	  
	      return (diffuse + specular) * NdotL;
	  }
	  ```
- ---
- ## PBR vs Old Phong — Why PBR is Better
	- | Property | Blinn-Phong | PBR (Cook-Torrance) |
	  |---|---|---|
	  | Energy Conservation | ❌ No | ✅ Yes |
	  | Fresnel at Grazing | ❌ No | ✅ Yes |
	  | Physically Correct | ❌ No | ✅ Yes |
	  | Consistent in All Lighting | ❌ No | ✅ Yes |
	  | Metallic Materials | ❌ Faked | ✅ Correct |
	  | Artist Intuition | ✅ Easy | ✅ After learning |
- ---
- ## PBR in Game Engines
	- ### Godot
		- `StandardMaterial3D` — uses metal-rough PBR workflow
		- Diffuse: Burley (Disney) or Lambertian
		- Specular: GGX with Smith masking
		- `albedo_color`, `metallic`, `roughness`, `normal_map` properties
		- [[Godot]] custom shaders: use `spatial` shader type
	- ### Unreal Engine
		- The reference implementation of Disney Principled BRDF in games
		- All 12 Disney parameters exposed in Material editor
		- [[Unreal Engine]]
	- ### Unity
		- Standard Shader: uses metal-rough or specular-gloss workflow
		- HDRP: full PBR with screen-space GI
- ---
- ## Image-Based Lighting (IBL)
	- Real-time PBR needs a way to compute the irradiance integral without ray tracing
	- Solution: pre-compute the lighting from an HDRI environment map
	- Split Sum Approximation (Epic Games, Brian Karis)
		- `L_o ≈ (∫ L_i(ω_i) dω_i) * (∫ f_r(ω_i, ω_o) cos(θ) dω_i)`
		- Left term: Diffuse irradiance map (pre-convolved at each normal direction)
		- Right term: Specular pre-filtered map + BRDF LUT (lookup table)
	- Diffuse IBL
		- Convolve the env map with a cosine-weighted filter for each normal direction
		- Store as a low-res cubemap (irradiance map)
	- Specular IBL
		- Pre-filter env map at multiple roughness levels (mip chain)
		- Use BRDF LUT to look up the integral for any roughness + NdotV pair
- ---
- ## Common PBR Mistakes
	- Albedo texture contains baked lighting or shadows → remove those, PBR adds lighting dynamically
	- Metallic value of 0.5 on a non-metal → materials are metal or not, no grey area (except worn edges)
	- Forgetting `roughness²` in GGX → perceived roughness is not linear, squaring linearizes it
	- No Fresnel at grazing angles → all surfaces look flat and plastic
	- Setting F0 to vec3(0.0) for dielectrics → should be ~0.04 for most plastics
	- Normal map in wrong space → apply TBN matrix to transform from tangent to world space
- ---
- ## Checklist
	- TODO Understand why energy conservation is violated by Blinn-Phong
	- TODO Can derive the Cook-Torrance BRDF numerator and denominator
	- TODO Understand why metals have no diffuse component
	- TODO Can explain what F0 is and how it differs between metals and dielectrics
	- TODO Understand the split-sum IBL approximation
	- TODO Can implement a basic PBR shader in GLSL from scratch
- ---
- ## Related
	- [[PathTracer Learning BRDF]]
	- [[PathTracer Learning Microfacet Theory]]
	- [[PathTracer Learning Fresnel Effect]]
	- [[PathTracer Learning Render Equation]]
	- [[PathTracer Learning Normal Mapping]]
	- [[PathTracer Learning Phase 2 CPU Ray Tracing]]