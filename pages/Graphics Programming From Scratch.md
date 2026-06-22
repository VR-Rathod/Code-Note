---
seoTitle: Graphics Programming From Scratch – Learn PBR, Ray Marching, and Vulkan
description: "A structured, beginner-friendly series for learning modern graphics programming. Start with Physically Based Rendering, understand the Render Equation, practice with Ray Marching on Shadertoy, then learn Vulkan and GPU architecture."
keywords: "graphics programming beginner, learn PBR, physically based rendering tutorial, render equation explained, ray marching tutorial, Vulkan beginner, GPU architecture, GLSL shader tutorial, learn graphics programming from scratch"
treeTitle: Game Development - Graphics Programming From Scratch
---

tags:: index, graphics-programming, pbr, render-equation, ray-marching, vulkan
title:: Graphics Programming From Scratch

- # Graphics Programming From Scratch
	- A self-contained series for learning how modern real-time and offline rendering actually works — from the ground up, with full explanations and working code at every step.
	- **Who is this for?** Developers who want to understand how game engines render scenes, how shaders are written, and how modern graphics APIs work — starting from zero.
- ---
- ## Where to Start
	- Follow the four topics below in order. Each one builds on the previous.
	- **Topic 1 → Topic 2 → Topic 3 → Topic 4**
	- If you already know one topic, skip it and continue from where you are.
- ---
- ## Topic 1 — Physically Based Rendering (PBR)
  collapsed:: true
	- [[GPFS PBR]]
	- **What you will learn:** How modern game engines shade surfaces to look physically realistic.
	- PBR is the standard shading model used by Godot, Unreal Engine, Unity, and Blender. Understanding it explains why materials look the way they do and how to author correct textures.
	- **Topics covered:**
		- Why old Phong shading breaks down and what PBR fixes
		- Energy conservation — the most important rule in rendering
		- The three PBR parameters: Albedo, Roughness, Metallic
		- The Cook-Torrance BRDF — the math behind specular highlights
		- Fresnel effect — why all surfaces become mirrors at grazing angles
		- A complete PBR fragment shader in GLSL with every line explained
	- **Recommended for:** Anyone who works with materials in a game engine or wants to write custom shaders.
- ---
- ## Topic 2 — The Render Equation
  collapsed:: true
	- [[GPFS Render Equation]]
	- **What you will learn:** The mathematical formula that every renderer — game engine, path tracer, offline renderer — is solving.
	- Written by James Kajiya in 1986, the rendering equation is the foundation of all physically-based rendering. Once you understand it, path tracing, PBR, and global illumination all make sense.
	- **Topics covered:**
		- What the rendering equation computes and why it matters
		- Every term explained in plain language: outgoing radiance, emission, the BRDF, incoming radiance, and Lambert's cosine law
		- Why the equation is recursive — and why that makes it hard to solve
		- How path tracing uses Monte Carlo integration to solve it
		- Russian Roulette — how path tracers terminate rays without introducing bias
		- The full algorithm written as GLSL code
	- **Recommended for:** Anyone who wants to understand WHY PBR and path tracing work, not just how to use them.
- ---
- ## Topic 3 — Ray Marching
  collapsed:: true
	- [[GPFS Ray Marching]]
	- **What you will learn:** How to render 3D scenes using Signed Distance Functions (SDFs) — entirely in a browser, with no GPU pipeline setup required.
	- Ray marching is the most accessible entry point into writing real-time 3D graphics from scratch. You can run and experiment with every example on [Shadertoy](https://www.shadertoy.com) immediately.
	- **Topics covered:**
		- What a Signed Distance Function is and how it describes geometry mathematically
		- The sphere tracing algorithm — how to safely step along a ray without overshooting
		- SDF primitives: sphere, box, torus, capsule, plane, cylinder
		- Boolean operations: union, subtraction, intersection, and smooth blending
		- Computing surface normals from the SDF gradient
		- Diffuse lighting, soft shadows, and ambient occlusion — all from scratch
		- Camera control, animation with time, and materials
		- Advanced: fractals including the Mandelbulb and Menger Sponge
	- **Recommended for:** Anyone who wants to write shaders today without setting up a full rendering pipeline.
- ---
- ## Topic 4 — Vulkan and GPU Architecture
  collapsed:: true
	- [[GPFS Vulkan GPU Architecture]]
	- **What you will learn:** How the GPU hardware works, and how Vulkan gives you direct control over it.
	- Vulkan is the modern cross-platform graphics API used by game engines like Godot 4 and game titles like Doom Eternal. Understanding the GPU and Vulkan is essential for anyone building a custom renderer.
	- **Topics covered:**
		- Why GPUs have thousands of simple cores instead of a few fast ones
		- Warps and lockstep execution — how thousands of shader threads run simultaneously
		- GPU memory hierarchy: registers, shared memory, L2 cache, VRAM
		- Warp divergence — the hidden performance cost of branching in shaders
		- Vulkan from zero: Instance → Physical Device → Logical Device → Command Buffer → Draw
		- Memory allocation, buffer creation, and the Vulkan Memory Allocator (VMA)
		- Synchronization: fences, semaphores, and pipeline barriers
		- Compute shaders — running arbitrary parallel code on the GPU
	- **Recommended for:** Anyone building a renderer, writing engine-level graphics code, or learning Vulkan for the first time.
- ---
- ## What You Can Do After This Series
	- Write a physically correct PBR shader in GLSL from scratch
	- Explain every term in the rendering equation from memory
	- Build a ray-marched 3D scene on Shadertoy with lighting, shadows, and ambient occlusion
	- Understand how the GPU executes shaders at the hardware level
	- Set up a Vulkan application and understand every step involved
	- Read and understand code and papers from the [[PathTracer Learning]] series
- ---
- ## Next Step — Path Tracing
	- After completing this series, the natural progression is [[PathTracer Learning]] — a deep dive into building a full GPU path tracer using Vulkan ray tracing, BVH acceleration structures, and advanced techniques like ReSTIR and denoising.
- ---
- ## Related Reference Pages
	- [[Advanced Graphics]] — Vulkan, DirectX 12, Metal, and WebGPU full API reference
	- [[Shader Programming]] — GLSL, HLSL, and MSL language reference
	- [[Vulkan]] — Complete Vulkan API reference
	- [[Game Development]] — Engine-level rendering, game loops, and graphics fundamentals