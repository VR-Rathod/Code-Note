---
seoTitle: Shader Programming Guide – HLSL, GLSL, WGSL, MSL
description: "A complete learning roadmap for Shader Programming. Covers Vertex/Fragment shaders, Compute Shaders, math, lighting models, and the differences between HLSL, GLSL, and MSL."
keywords: "shader programming, hlsl, glsl, wgsl, msl, graphics programming, compute shaders, fragment shader, game development, rendering, vr-rathod"
displayTitle: Shader Programming Guide
---

tags:: index, graphics-programming, advanced-graphics
title:: Shader Programming

- # Shader Programming
  
  > [!info] What is a Shader?
  > A shader is a small program that runs entirely on the GPU. Instead of executing sequentially like CPU code, a shader executes **in parallel** across thousands of GPU cores. Shaders calculate the position of 3D vertices, the color of pixels, or perform massive parallel math operations.
  
  ---
- ## 🟢 Beginner Level (The Fundamentals)
- **The Shader Pipeline:**
  1.  **Vertex Shader:** Runs once per vertex. Outputs the screen-space position (`gl_Position` / `SV_Position`).
  2.  **Fragment (Pixel) Shader:** Runs once per pixel. Outputs the final color of that pixel.
- **Shader Languages:**
	- **HLSL:** High-Level Shader Language (DirectX, widely used in Unreal/Unity).
	- **GLSL:** OpenGL Shading Language (OpenGL, Vulkan).
	- **MSL:** Metal Shading Language (Apple, based on C++).
	- **WGSL:** WebGPU Shading Language (WebGPU).
- ### Vector & Matrix Math
  Shaders are built on linear algebra. You must master:
  | Concept | Usage |
  |---|---|
  | **Dot Product** `dot(A, B)` | Lighting intensity. If Normal and Light Direction point the same way, dot = 1.0 (bright). Opposite = -1.0 (dark). |
  | **Cross Product** `cross(A, B)` | Finding a vector perpendicular to two others (calculating normals). |
  | **Transformations** `M * V` | Multiplying a Vertex (`V`) by a Model-View-Projection Matrix (`M`) moves it from 3D space to the 2D screen. |
  
  ---
- ## 🟡 Intermediate Level (Lighting & Texturing)
- ### Physically Based Rendering (PBR)
  Modern shaders do not use simple "Phong" lighting. They use PBR to accurately simulate how light behaves.
  *   **Albedo:** The base color without lighting.
  *   **Normal Map:** Baking high-poly details into a texture to fake light scattering.
  *   **Roughness / Metallic:** Dictates how light scatters (specular lobe).
- ### UV Coordinates and Samplers
  *   **UVs:** A 2D coordinate system (0.0 to 1.0) defining how to wrap a 2D texture onto a 3D model.
  *   **Samplers:** An object that defines *how* a texture is read (e.g., nearest-neighbor for pixel art, linear blending for smooth gradients, anisotropic filtering for sharp angles).
  
  ---
- ## 🟠 Advanced Level (Compute & Post-Processing)
- ### Compute Shaders
  *   A Compute Shader operates independently of the graphics pipeline. It has no vertices or pixels.
  *   It operates on a grid of "Threads" and "Workgroups".
  *   **Uses:** Particle physics, fluid simulation, culling unseen objects before rendering, or processing geometry.
- ### Post-Processing (Screen-Space Shaders)
  Effects applied after the 3D scene is rendered.
  *   **Bloom:** Extract bright pixels, blur them heavily, add back to original image.
  *   **SSAO (Screen Space Ambient Occlusion):** Use the depth buffer to calculate where crevices are and darken them.
  *   **Tone Mapping:** Converting HDR values (colors brighter than 1.0) down to LDR (0.0 - 1.0) so monitors can display them without ugly clipping.
  
  ---
- ## 🔴 Super Advanced Level (Ray Tracing & Wave Intrinsics)
- ### Hardware Ray Tracing Shaders
  Used in DXR and Vulkan RT:
  *   **Ray Generation:** The origin point. Spawns rays into the scene.
  *   **Closest Hit:** Triggered when the ray hits the nearest geometry. Calculates lighting here.
  *   **Miss:** Triggered if the ray flies off into the skybox.
- ### Wave Intrinsics (Subgroup Operations)
  Advanced GPU programming technique.
  Instead of threads reading/writing to memory (which is slow), threads within the same "Warp" or "Wavefront" (usually 32 or 64 threads executing locally) can share data directly through registers using commands like `WaveActiveSum()` or `subgroupAdd()`. This is massively faster for reductions and prefix-sums.
  
  ---
- # More Learn
- [The Book of Shaders](https://thebookofshaders.com/) - The ultimate guide to Fragment shaders and math.
- [Inigo Quilez Articles](https://iquilezles.org/) - God-tier math, SDFs, and procedural generation in GLSL.
- [Shadertoy](https://www.shadertoy.com/) - Write and run shaders directly in your browser.
- [Microsoft HLSL Guide](https://learn.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl) - Official HLSL reference.