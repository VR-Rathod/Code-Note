---
seoTitle: PBR From Scratch – Physically Based Rendering Complete Beginner to Advanced Guide
description: "Learn Physically Based Rendering (PBR) completely from scratch. Covers light physics, energy conservation, Fresnel, microfacet theory, Cook-Torrance BRDF, metal-rough workflow, and a full GLSL PBR shader with every line explained."
keywords: "PBR from scratch, physically based rendering, Cook-Torrance, GGX, microfacet, Fresnel, energy conservation, metal rough workflow, albedo, roughness, metallic, GLSL shader, beginner graphics programming"
treeTitle: Game Development - Graphics Programming From Scratch - PBR
---

tags:: graphics, pbr, shading, beginner-to-advanced, glsl, materials
title:: GPFS PBR

- # PBR — Physically Based Rendering
	- Learn how modern games make materials look real — from the physics of light to a complete GLSL shader.
	- **Prerequisites:** Basic understanding of vectors (dot product), basic GLSL syntax
	- Parent: [[Graphics Programming From Scratch]]
- ---
- ## 🟢 Chapter 1 — What Is PBR and Why Does It Matter?
  collapsed:: true
	- ### Before PBR: The Old Way (Phong / Blinn-Phong)
		- Before ~2012, games used **Phong shading** — a simple empirical model
		- It looked okay but had fundamental problems:
			- Artists had to re-tweak materials for every lighting environment
			- Bright light = washed out specular highlights that broke energy conservation
			- Metals and plastics had no physically meaningful distinction
			- A material in day lighting looked completely different at night — wrong!
		- ```glsl
		  // OLD: Blinn-Phong (simple but physically wrong)
		  float diff = max(dot(N, L), 0.0);
		  vec3 H = normalize(L + V);
		  float spec = pow(max(dot(N, H), 0.0), shininess); // energy not conserved!
		  vec3 color = albedo * diff + specularColor * spec; // no Fresnel, no energy rules
		  ```
	- ### The PBR Promise
		- A material defined once looks correct under ANY lighting — sunlight, candles, HDRI studio
		- Artists only need to answer physically meaningful questions:
			- Is this surface shiny or rough? → **roughness**
			- Is this a metal or not? → **metallic**
			- What colour is the surface? → **albedo**
		- Under the hood, the renderer does the correct physics automatically
	- ### Real Engines Using PBR
		- | Engine | Since | PBR Model |
		  |---|---|---|
		  | Unreal Engine 4 | 2013 | Disney Principled BRDF |
		  | Unity (Standard Shader) | 2014 | Cook-Torrance GGX |
		  | Godot 4 | 2023 | Cook-Torrance GGX |
		  | Blender Cycles | 2011 | Custom PBR |
		  | Substance Painter | 2014 | Metal-Rough PBR |
- ---
- ## 🟡 Chapter 2 — The Physics of Light (Beginner)
  collapsed:: true
	- ### Light is Energy
		- A light source emits **photons** — particles of energy
		- When photons hit a surface, three things can happen:
			- **Reflected** — bounce off (specular reflection)
			- **Absorbed** — converted to heat
			- **Transmitted** — pass through (glass, skin subsurface)
		- The **total** of reflected + absorbed + transmitted = 100% of incoming light
		- This is **energy conservation** — the most important rule in PBR
	- ### What the Eye/Camera Sees
		- Your eye only receives light that bounces FROM a surface TOWARD it
		- Two kinds of bounced light:
			- **Specular** — bounced at a precise angle (mirror-like, comes from a specific direction)
			- **Diffuse** — bounced randomly in all directions (matte, scatters everywhere)
		- ```
		  Total reflected = Specular + Diffuse
		  Total absorbed  = 1 - Total reflected
		  
		  Energy Conservation: Specular + Diffuse ≤ 1.0
		  ```
	- ### Why Metals and Plastics Are Different
		- **Dielectrics (plastics, wood, stone, skin)**
			- Light partially reflects at the surface (specular)
			- Transmitted light scatters inside the material, re-emerges as diffuse
			- F0 (base reflectance) ≈ 2–5%
			- Both diffuse AND specular components exist
		- **Metals (iron, gold, copper, aluminum)**
			- Free electrons immediately absorb and re-emit transmitted light
			- Almost NO diffuse component — all energy goes into specular
			- F0 (base reflectance) = 50–100% (metals are highly reflective)
			- Specular is tinted by the metal's color (e.g. gold's yellow specular)
	- ### The Grazing Angle Rule (Fresnel)
		- Look at a flat pond from above → see through it (mostly)
		- Look at it from the side (grazing angle) → perfectly reflective mirror
		- This happens on EVERY surface, metal or not — it's physics
		- A black rubber floor looks like a mirror at grazing angles
		- This is the **Fresnel effect** — critical to PBR looking real
- ---
- ## 🟡 Chapter 3 — The Three Laws of PBR
  collapsed:: true
	- These are the physical rules every PBR shader must obey.
	- ### Law 1: Energy Conservation
		- A surface cannot reflect more light than it receives
		- `reflected_energy ≤ incident_energy`
		- Mathematically: `∫_Ω f_r(ω_i, ω_o) cos(θ_i) dω_i ≤ 1.0`
		- Old Phong violates this — the specular `pow(...)` term can output values > 1
		- GGX Cook-Torrance is derived to always satisfy this
	- ### Law 2: Helmholtz Reciprocity
		- You can swap the light and view directions and get the same result
		- `f_r(ω_i, ω_o) = f_r(ω_o, ω_i)`
		- Physical meaning: if you put a light where your eye is and your eye where the light is, the brightness is the same
		- Required for bidirectional rendering algorithms (photon mapping, BDPT)
		- Important for consistency in path tracing
	- ### Law 3: Microfacet Theory
		- No surface is perfectly flat at a microscopic level
		- Every surface is covered in **microscopic mirror facets**
		- Each facet is a perfect mirror — but they all point in slightly different directions
		- The **roughness** parameter describes how spread out those directions are
		- Smooth surface (`roughness = 0`) → all facets aligned → sharp reflection
		- Rough surface (`roughness = 1`) → facets random → blurry reflection
		- ```
		  Smooth surface:           Rough surface:
		       ↑ ↑ ↑ ↑ ↑               ↗ ↑ ↗ ↙ ↑
		       | | | | |               | | | | |
		  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬       ▬▬▬/▬▬\▬/▬▬\▬▬▬
		  All facets aligned →     Random orientation →
		  Sharp specular            Blurry specular
		  ```
- ---
- ## 🟠 Chapter 4 — The Metal-Rough Workflow
  collapsed:: true
	- This is the standard in all modern game engines and 3D tools.
	- ### The 3 Core PBR Parameters
		- #### Albedo (Base Color)
			- The color of the surface in pure, neutral white lighting
			- For **dielectrics** (plastic, wood): the visible color of the material
			- For **metals**: the tint of the specular reflection
			- Important: albedo should NOT contain:
				- Baked ambient occlusion — your PBR renderer adds this dynamically
				- Directional shadows — no baked lighting
				- Highlights or reflections
			- ```
			  Good albedo: pure flat orange color
			  Bad albedo:  orange with darker edges (fake AO baked in)
			  ```
		- #### Metallic (0.0 → 1.0)
			- `0.0` = dielectric (plastic, wood, stone, skin)
			- `1.0` = metal (iron, copper, gold, aluminum)
			- In the physical world surfaces are ONE or the OTHER
			- Edge cases: `0.5` for corroded/painted metal, worn surfaces
			- How it changes the BRDF:
				- `metallic = 0`: diffuse exists, F0 = 0.04 (4%)
				- `metallic = 1`: no diffuse, F0 = albedo color (50–100%)
				- Blend: `F0 = lerp(vec3(0.04), albedo, metallic)`
		- #### Roughness (0.0 → 1.0)
			- `0.0` = perfect mirror (like liquid mercury)
			- `1.0` = fully rough matte surface
			- Controls the spread of microfacet normals
			- Maps to GGX `α` via: `α = roughness²` (perceptual linearization)
			- Why squared? Humans perceive the visual smoothness as roughly the square root of the physical roughness
	- ### Optional PBR Parameters
		- **Normal Map** — pixel-level surface detail without extra geometry
			- Stored as RGB = (X, Y, Z) normal direction in tangent space
			- Blue-ish maps (blue = pointing straight up in tangent space) are correct
		- **Ambient Occlusion (AO)** — pre-baked shadow in crevices
			- Scales indirect lighting only (not direct)
		- **Emissive** — makes the surface glow (applied on top, not part of BRDF)
		- **Height/Displacement** — shifts vertices for real geometry parallax
- ---
- ## 🔴 Chapter 5 — The Cook-Torrance BRDF (Math)
  collapsed:: true
	- The **BRDF** (Bidirectional Reflectance Distribution Function) is the mathematical model of how a surface scatters light.
	- See [[GPFS Render Equation]] for where f_r fits in the full rendering equation.
	- ### The Full Formula
		- ```
		  f_r(ω_i, ω_o) = [D(h) · G(ω_i, ω_o) · F(ω_o, h)] / [4 · (N·ω_i) · (N·ω_o)]
		  ```
		- Every term explained below 👇
	- ### Term 1: D — Normal Distribution Function (NDF)
		- Answers: **How many microfacets are aligned to reflect light from ω_i toward ω_o?**
		- `h = normalize(ω_i + ω_o)` — the **half-vector** (between incoming and outgoing)
		- Microfacets that reflect light from `ω_i` toward `ω_o` must have normal = `h`
		- The NDF gives the statistical density of microfacets with normal `h`
		- **GGX (Trowbridge-Reitz) NDF** — the industry standard:
		- ```
		  D_GGX(h) = α² / [π · ((N·h)²·(α²-1) + 1)²]
		  ```
		- `α = roughness²`
		- `N·h` = cosine of angle between surface normal and half-vector
		- When `roughness = 0`: `α = 0` → NDF becomes a delta function (perfect mirror)
		- When `roughness = 1`: `α = 1` → NDF is broad and flat (diffuse-like specular)
		- Why GGX and not Phong NDF? GGX has a longer tail — looks much better for rough metals
	- ### Term 2: G — Geometry Shadowing/Masking
		- Answers: **Are microfacets blocked from seeing the light or camera?**
		- Two cases of geometry attenuation:
			- **Shadowing** — incoming light ray is blocked before reaching a microfacet
			- **Masking** — outgoing reflected ray is blocked before reaching the eye
		- Smith approximation: treat them independently and multiply
		- ```
		  G(ω_i, ω_o) = G_SchlickGGX(N·ω_i) · G_SchlickGGX(N·ω_o)
		  
		  G_SchlickGGX(NdotX) = NdotX / [NdotX · (1-k) + k]
		  
		  k = α/2    (for direct lighting)
		  k = (α+1)² / 8    (for image-based lighting)
		  ```
		- At grazing angles, `NdotX → 0`, so `G → 0` — correct! Grazing light is mostly blocked
		- This prevents the BRDF from blowing up at grazing angles
	- ### Term 3: F — Fresnel (Schlick Approximation)
		- Answers: **How much light is reflected vs transmitted as a function of angle?**
		- Real Fresnel is complex (involves complex refractive indices)
		- Schlick 1994 approximation — fast and accurate:
		- ```
		  F(θ) = F0 + (1 - F0) · (1 - cos θ)^5
		  
		  cos θ = dot(ω_o, h)    (view · half-vector angle)
		  ```
		- `F0` = reflectance at 0° (perpendicular view):
			- Dielectric: `F0 = 0.04` (4%) — most plastics, skin, stone
			- Metal: `F0 = albedo` (50–100%, colored by the metal)
			- Blend: `F0 = lerp(vec3(0.04), albedo, metallic)`
		- At `θ = 0°` (looking straight on): `F = F0`
		- At `θ = 90°` (grazing): `F = 1.0` (full reflection — ALL surfaces become mirrors!)
	- ### The Denominator: 4 · (N·ωᵢ) · (N·ωₒ)
		- The `4` comes from the Jacobian of the half-vector transform
		- `N·ωᵢ` and `N·ωₒ` are cosines — they account for projected area
		- Without this denominator, the BRDF would not integrate to ≤ 1
	- ### The Diffuse Term
		- Remember: energy that's NOT reflected as specular can become diffuse
		- Diffuse energy = what's left after Fresnel reflection
		- Metals have no diffuse (they absorb transmitted light immediately)
		- ```
		  k_specular = F  (Fresnel gives the specular fraction)
		  k_diffuse  = (1 - F) · (1 - metallic)
		  
		  f_diffuse = k_diffuse · (albedo / π)
		  ```
		- The `1/π` in Lambertian diffuse ensures energy conservation over the hemisphere
		- Full BRDF: `f_total = f_diffuse + f_specular`
- ---
- ## 🔴 Chapter 6 — Complete PBR Shader (GLSL)
  collapsed:: true
	- A complete, commented PBR fragment shader you can use as a reference.
	- This implements direct lighting — one directional light, no IBL.
	- ```glsl
	  // ===================================================
	  // PBR Fragment Shader — Cook-Torrance GGX
	  // Implements: Lambertian diffuse + Cook-Torrance specular
	  // ===================================================
	  
	  const float PI = 3.14159265359;
	  
	  // --- Inputs ---
	  in vec3 v_WorldPos;    // World-space fragment position
	  in vec3 v_Normal;      // World-space surface normal
	  in vec2 v_UV;          // Texture coordinates
	  
	  // --- Uniforms ---
	  uniform vec3  u_CameraPos;      // Camera world position
	  uniform vec3  u_LightPos;       // Light world position
	  uniform vec3  u_LightColor;     // Light color (HDR, can be > 1)
	  uniform float u_LightIntensity; // Light power
	  
	  // --- Material Parameters ---
	  uniform vec3  u_Albedo;     // Base color (linear space!)
	  uniform float u_Metallic;   // 0 = dielectric, 1 = metal
	  uniform float u_Roughness;  // 0 = mirror, 1 = fully rough
	  uniform float u_AO;         // Ambient occlusion (0 = occluded, 1 = open)
	  
	  out vec4 fragColor;
	  
	  // ─────────────────────────────────────
	  // D — GGX Normal Distribution Function
	  // ─────────────────────────────────────
	  float D_GGX(float NdotH, float roughness) {
	      float alpha  = roughness * roughness;  // perceptual roughness → linear
	      float alpha2 = alpha * alpha;
	      float denom  = (NdotH * NdotH * (alpha2 - 1.0) + 1.0);
	      return alpha2 / (PI * denom * denom);
	      // When roughness → 0: denom → 1 → D becomes a spike (mirror)
	      // When roughness → 1: D becomes flat (all directions equally probable)
	  }
	  
	  // ─────────────────────────────────────
	  // G — Smith GGX Geometry Function
	  // ─────────────────────────────────────
	  float G_SchlickGGX(float NdotV, float roughness) {
	      float k = roughness / 2.0;  // direct lighting remapping
	      return NdotV / (NdotV * (1.0 - k) + k);
	      // When NdotV → 0 (grazing): G → 0 (fully masked/shadowed)
	      // When NdotV = 1 (perpendicular): G = 1 (no masking)
	  }
	  
	  float G_Smith(float NdotV, float NdotL, float roughness) {
	      return G_SchlickGGX(NdotV, roughness) * G_SchlickGGX(NdotL, roughness);
	  }
	  
	  // ─────────────────────────────────────
	  // F — Schlick Fresnel Approximation
	  // ─────────────────────────────────────
	  vec3 F_Schlick(float VdotH, vec3 F0) {
	      return F0 + (1.0 - F0) * pow(1.0 - VdotH, 5.0);
	      // At VdotH = 1 (perpendicular): F = F0
	      // At VdotH = 0 (grazing):       F = 1.0 (full reflection)
	  }
	  
	  void main() {
	      // Normalize all direction vectors
	      vec3 N = normalize(v_Normal);
	      vec3 V = normalize(u_CameraPos - v_WorldPos);  // view direction
	      vec3 L = normalize(u_LightPos  - v_WorldPos);  // light direction
	      vec3 H = normalize(V + L);                     // half-vector
	  
	      // Dot products — clamp to [0,1] to avoid negative values
	      float NdotL = max(dot(N, L), 0.0);  // Lambert cosine term
	      float NdotV = max(dot(N, V), 0.0);
	      float NdotH = max(dot(N, H), 0.0);
	      float VdotH = max(dot(V, H), 0.0);
	  
	      // ─── F0: Base Reflectance ───────────────────────────────────
	      // Dielectrics: F0 = 0.04 (4% reflectance at normal incidence)
	      // Metals: F0 = albedo (colored reflectance, 50-100%)
	      vec3 F0 = mix(vec3(0.04), u_Albedo, u_Metallic);
	  
	      // ─── Cook-Torrance Specular BRDF ────────────────────────────
	      float D = D_GGX(NdotH, u_Roughness);
	      float G = G_Smith(NdotV, NdotL, u_Roughness);
	      vec3  F = F_Schlick(VdotH, F0);
	  
	      // Combine: [D * G * F] / [4 * NdotV * NdotL]
	      vec3 specular = (D * G * F) / max(4.0 * NdotV * NdotL, 0.001);
	      // max() prevents division by zero at grazing angles
	  
	      // ─── Lambertian Diffuse ─────────────────────────────────────
	      // k_diffuse = (1 - F) * (1 - metallic)
	      // Metals have no diffuse; non-reflected energy becomes diffuse
	      vec3 kd = (1.0 - F) * (1.0 - u_Metallic);
	      vec3 diffuse = kd * u_Albedo / PI;
	  
	      // ─── Combine: Direct Lighting ───────────────────────────────
	      // f_total * L_i * cos(θ) = the rendering equation for 1 light
	      float lightDist    = length(u_LightPos - v_WorldPos);
	      float attenuation  = 1.0 / (lightDist * lightDist);  // inverse square falloff
	      vec3  radiance     = u_LightColor * u_LightIntensity * attenuation;
	  
	      vec3 Lo = (diffuse + specular) * radiance * NdotL;
	  
	      // ─── Ambient (Simple Approximation) ─────────────────────────
	      // Real ambient = IBL (image-based lighting) — simplified here
	      vec3 ambient = vec3(0.03) * u_Albedo * u_AO;
	  
	      // ─── Tone Mapping + Gamma Correction ────────────────────────
	      // Path tracers work in linear HDR — must map to [0,1] sRGB for display
	      vec3 color = ambient + Lo;
	      color = color / (color + vec3(1.0));  // Reinhard tone mapping
	      color = pow(color, vec3(1.0 / 2.2));  // Linear → sRGB gamma correction
	  
	      fragColor = vec4(color, 1.0);
	  }
	  ```
- ---
- ## 🔴 Chapter 7 — Image-Based Lighting (IBL)
  collapsed:: true
	- Direct lighting (one point/directional light) is not enough — real scenes have lighting from all directions (sky, environment, bounced light).
	- **IBL** pre-computes the integral over an HDRI environment map.
	- ### The Split-Sum Approximation (Epic Games, Brian Karis 2013)
		- The full rendering equation integral over the hemisphere is too slow for real-time
		- Epic approximates it by splitting it into two separate pre-computed integrals:
		- ```
		  L_o(p, ω_o) ≈ [∫_Ω L_i(ω_i) dω_i]  ×  [∫_Ω f_r(ω_i, ω_o) cos(θ_i) dω_i]
		                    ↑                              ↑
		              Pre-filtered env map           BRDF integration LUT
		  ```
		- **Left integral** — Environment radiance, pre-convolved by roughness
			- Pre-filter the HDR env map at N mip levels (mip 0 = sharp mirror, mip N = fully rough)
			- At runtime: sample the pre-filtered map at the reflection direction + roughness mip
		- **Right integral** — BRDF integration, function of roughness and NdotV only
			- Pre-compute offline as a 2D LUT (roughness × NdotV → vec2)
			- Stores `scale` and `bias` for F0: `result = F0 * scale + bias`
	- ### IBL in GLSL (Simplified)
		- ```glsl
		  // IBL — split sum approximation
		  vec3 R = reflect(-V, N);  // reflection vector
		  
		  // 1. Diffuse IBL — sample pre-convolved irradiance map
		  vec3 irradiance = texture(u_IrradianceMap, N).rgb;
		  vec3 diffuse_IBL = irradiance * u_Albedo;
		  
		  // 2. Specular IBL
		  // a) Sample pre-filtered env map at reflection direction + roughness mip
		  float mipLevel     = u_Roughness * float(MAX_REFLECTION_LOD);
		  vec3 prefilteredColor = textureLod(u_PrefilterMap, R, mipLevel).rgb;
		  
		  // b) Sample BRDF LUT (scale + bias for F0)
		  vec2 brdfLUT = texture(u_BRDFLUT, vec2(NdotV, u_Roughness)).rg;
		  
		  // c) Combine
		  vec3 F_IBL = F_SchlickRoughness(NdotV, F0, u_Roughness);
		  vec3 specular_IBL = prefilteredColor * (F_IBL * brdfLUT.x + brdfLUT.y);
		  
		  // Combine diffuse + specular IBL
		  vec3 kd_IBL = (1.0 - F_IBL) * (1.0 - u_Metallic);
		  vec3 ambient_IBL = kd_IBL * diffuse_IBL + specular_IBL;
		  ambient_IBL *= u_AO;
		  ```
- ---
- ## 🔴 Chapter 8 — Disney Principled BRDF
  collapsed:: true
	- A more complete model used in film/VFX — exposes 12 physically meaningful parameters
	- Developed by Brent Burley at Disney Animation (2012)
	- ### Parameters
		- | Parameter | Range | Effect |
		  |---|---|---|
		  | `baseColor` | RGB | Albedo |
		  | `metallic` | 0–1 | Metal vs dielectric |
		  | `roughness` | 0–1 | Microsurface roughness |
		  | `specular` | 0–1 | Specular intensity for dielectrics |
		  | `specularTint` | 0–1 | Tint specular toward baseColor |
		  | `anisotropic` | 0–1 | Directional vs isotropic specular |
		  | `sheen` | 0–1 | Retroreflective sheen (fabric) |
		  | `sheenTint` | 0–1 | Tint sheen color |
		  | `clearcoat` | 0–1 | Second specular layer (car paint) |
		  | `clearcoatGloss` | 0–1 | Clearcoat roughness |
		  | `subsurface` | 0–1 | Subsurface scattering approximation |
		  | `transmission` | 0–1 | Glass-like transmission |
	- ### Diffuse Model
		- Modified Lambertian with retroreflection at grazing angles:
		- ```
		  f_diffuse = (baseColor/π) · (1 + (F_D90-1)(1-NdotL)^5) · (1 + (F_D90-1)(1-NdotV)^5)
		  F_D90 = 0.5 + 2 · roughness · VdotH²
		  ```
		- At grazing angles: `F_D90 > 1` → slightly brighter than Lambertian (retroreflection)
		- This matches measured data from real materials better than pure Lambertian
- ---
- ## 📊 Chapter 9 — Common PBR Mistakes & Fixes
  collapsed:: true
	- | Mistake | Symptom | Fix |
	  |---|---|---|
	  | Albedo has baked lighting | Looks flat under new lighting | Remove AO/shadows from albedo texture |
	  | Roughness not squared | Roughness feels exponential, not linear | Use `α = roughness²` in GGX |
	  | F0 = 0 for dielectrics | No Fresnel at grazing angles | Use `F0 = 0.04` for plastics |
	  | Metallic = 0.5 | Mid-range metallic looks wrong | Metallic is binary — use 0 or 1 except for edge cases |
	  | Albedo in sRGB space | Colors too bright, gamma double-applied | Convert albedo texture to linear before PBR math |
	  | Missing gamma correction at output | Final render looks washed out | Apply `pow(color, 1/2.2)` at output |
	  | Direct + IBL double-counting | Too bright at edges | Apply IBL with (1-F)*kd factor |
	  | Normal map in wrong space | Normals look inverted | Apply TBN matrix: `N_world = TBN * N_tangent` |
- ---
- ## ✅ Chapter 10 — Checklist
  collapsed:: true
	- ### Beginner
		- TODO Can explain the difference between diffuse and specular reflection
		- TODO Know what albedo, metallic, and roughness mean
		- TODO Understand why metals have no diffuse component
		- TODO Know what F0 is and typical values for metals vs dielectrics
	- ### Intermediate
		- TODO Understand the Cook-Torrance BRDF formula — what each term does
		- TODO Can explain what the GGX NDF does and why roughness is squared
		- TODO Understand the Smith G term — what masking/shadowing means
		- TODO Can explain Fresnel effect using the Schlick approximation
	- ### Advanced
		- TODO Can implement a complete PBR shader in GLSL from scratch
		- TODO Understand the split-sum IBL approximation
		- TODO Can explain the difference between Phong, Cook-Torrance, and Disney BRDFs
		- TODO Understand energy conservation violation and how GGX fixes it
- ---
- ## 📚 Resources
  collapsed:: true
	- **LearnOpenGL PBR series** — https://learnopengl.com/PBR/Theory
		- Best written beginner guide with code
	- **Burley 2012 — Physically-Based Shading at Disney** — the original paper
	- **Brian Karis 2013 — Real Shading in Unreal Engine 4** — implementation details
	- **Naty Hoffman — Physics and Math of Shading** (SIGGRAPH course)
	- **PBRT Book** — https://pbr-book.org/ — Chapter 9 for BRDF theory
- ---
- ## 🔗 Related
	- [[GPFS Render Equation]] — Where f_r fits in the full rendering equation
	- [[GPFS Ray Marching]] — Practice lighting with SDFs on Shadertoy
	- [[GPFS Vulkan GPU Architecture]] — How PBR shaders run on the GPU
	- [[PathTracer Learning BRDF]] — Advanced BRDF for path tracing
	- [[PathTracer Learning Microfacet Theory]] — GGX deep dive
	- [[PathTracer Learning Fresnel Effect]] — Fresnel deep dive
	- [[Graphics Programming From Scratch]]