---
seoTitle: Adobe After Effects Reference – Motion Graphics and VFX Guide
description: "After Effects reference covering compositions, keyframes, expressions, effects, masks, 3D layers, rendering, and motion graphics for video production."
keywords: "Adobe After Effects, motion graphics, VFX, compositions, keyframes, expressions, effects, masks, 3D layers, rendering, video production, animation"
---

- # History
	- **Created by**: Dave Simons and Daniel Wilk at the Company of Science and Art (CoSA).
	- **First release**: 1993 (CoSA After Effects 1.0, Mac only).
	- **Acquired by**: Adobe Systems in 1994.
	- **Why**: Provide a compositing and motion graphics tool for desktop computers — previously only possible on expensive workstations.
-
- # Introduction
	- **Adobe After Effects** is the industry-standard tool for **motion graphics**, **visual effects (VFX)**, and **compositing**.
	- Works on a **layer-based timeline** — each element (video, image, shape, text) is a layer.
	- Tightly integrated with Adobe Premiere Pro, Photoshop, Illustrator, and Media Encoder.
	-
	- ## Advantages
		- Industry standard — used in film, TV, web, and advertising.
		- Massive plugin ecosystem (Video Copilot, AEJuice, Motion Bro, etc.).
		- Powerful expression engine (JavaScript-based) for procedural animation.
		- Deep integration with Adobe Creative Cloud.
		- 3D compositing with Cinema 4D integration (Cineware).
	-
	- ## Disadvantages
		- Subscription-based (Adobe CC) — ongoing cost.
		- Very resource-intensive — needs a powerful CPU/GPU and RAM.
		- Steep learning curve for beginners.
		- Not real-time — requires RAM preview or rendering to play back smoothly.
-
- # Core Concepts
  collapsed:: true
	- ## Composition (Comp)
	  collapsed:: true
		- The main workspace — like a canvas with a timeline.
		- Has its own resolution, frame rate, and duration.
		- Comps can be nested inside other comps (pre-composing).
		- ```
		  Composition Settings:
		  - Width / Height (e.g., 1920x1080)
		  - Frame Rate (e.g., 24, 30, 60 fps)
		  - Duration
		  - Background Color
		  ```
	-
	- ## Layers
	  collapsed:: true
		- Everything in a comp is a layer — stacked from top to bottom.
		- ```
		  Layer Types:
		  - Footage (video/image)
		  - Solid (colored rectangle)
		  - Shape Layer (vector shapes)
		  - Text Layer
		  - Null Object (invisible, used for parenting/control)
		  - Adjustment Layer (applies effects to all layers below)
		  - Camera
		  - Light
		  - Pre-comp (nested composition)
		  ```
	-
	- ## Keyframes & Animation
	  collapsed:: true
		- Keyframes mark property values at specific points in time.
		- After Effects interpolates between keyframes automatically.
		- ```
		  Common Animated Properties (shortcut to reveal):
		  P — Position
		  S — Scale
		  R — Rotation
		  T — Opacity
		  A — Anchor Point
		  U — All keyframed properties
		  ```
	-
	- ## Easing (Graph Editor)
	  collapsed:: true
		- Control the speed curve between keyframes.
		- **Easy Ease** (F9) — smooth in and out.
		- **Graph Editor** — fine-tune velocity curves manually.
		- Bezier handles control acceleration/deceleration.
	-
	- ## Parenting
	  collapsed:: true
		- Link a layer's transform to a parent layer.
		- Child layer inherits parent's position, rotation, scale.
		- **Null Objects** are commonly used as invisible parent controllers.
		- ```
		  Layer A (parent: Null)
		  Layer B (parent: Null)
		  → Move Null → both A and B move together
		  ```
-
- # Effects & Presets
  collapsed:: true
	- ## Common Built-in Effects
	  collapsed:: true
		- ```
		  Category        Effect                  Use
		  Blur            Gaussian Blur           Soft blur
		  Blur            Camera Lens Blur        Depth-of-field look
		  Color           Curves                  Color grading
		  Color           Hue/Saturation          Color shift
		  Color           Lumetri Color           Advanced color grading
		  Distort         Warp Stabilizer         Stabilize shaky footage
		  Generate        Gradient Ramp           Background gradients
		  Stylize         Glow                    Light bloom effect
		  Transition      Linear Wipe             Simple wipe transition
		  Noise           Fractal Noise           Textures, smoke, clouds
		  ```
	-
	- ## Masks & Track Mattes
	  collapsed:: true
		- **Masks**: Draw shapes on a layer to reveal/hide parts of it.
		- **Track Matte**: Use one layer's alpha or luminance to mask another.
		- ```
		  Track Matte Types:
		  - Alpha Matte       — use layer above's alpha channel
		  - Alpha Inverted    — inverse of alpha
		  - Luma Matte        — use layer above's brightness
		  - Luma Inverted     — inverse of luma
		  ```
-
- # Expressions
  collapsed:: true
	- ## What Are Expressions
	  collapsed:: true
		- JavaScript-based scripting applied to individual layer properties.
		- Automate animation without manual keyframes.
		- Alt+click the stopwatch icon on any property to add an expression.
	-
	- ## Common Expressions
	  collapsed:: true
		- ```javascript
		  // Wiggle — random jitter
		  wiggle(2, 30)
		  // wiggle(frequency, amplitude) — 2 times/sec, 30px range
		  
		  // Loop animation
		  loopOut("cycle")
		  loopOut("pingpong")
		  
		  // Link one property to another
		  thisComp.layer("Control").transform.opacity
		  
		  // Time-based rotation
		  [0, 0, time * 90]  // rotates 90°/sec
		  
		  // Value at specific time
		  thisLayer.transform.position.valueAtTime(time - 0.1)
		  // creates a "ghost trail" effect
		  ```
-
- # 3D in After Effects
  collapsed:: true
	- Enable 3D on a layer by clicking the **cube icon** in the timeline.
	- Add **Camera** and **Light** layers for 3D scene control.
	- ```
	  Camera Types:
	  - One-Node Camera   — fixed orientation
	  - Two-Node Camera   — always points at a target point of interest
	  
	  Light Types:
	  - Ambient    — global fill light, no shadows
	  - Directional — parallel rays (like sunlight)
	  - Point      — radiates in all directions
	  - Spot       — cone-shaped beam
	  ```
-
- # Rendering & Export
  collapsed:: true
	- ## Render Queue (built-in)
	  collapsed:: true
		- Add comp to Render Queue: Ctrl+M (Win) / Cmd+M (Mac).
		- Choose Output Module (codec, format) and Output To (file path).
		- Best for lossless renders (PNG sequence, ProRes, etc.).
	-
	- ## Adobe Media Encoder (AME)
	  collapsed:: true
		- Queue exports from After Effects to AME for background rendering.
		- Supports H.264, H.265, ProRes, GIF, and more.
		- Allows continuing work in AE while rendering in background.
-
- # Shortcuts (Essential)
  collapsed:: true
	- ```
	  Action                        Win                  Mac
	  RAM Preview                   Space / Numpad 0     Space / Numpad 0
	  New Composition               Ctrl + N             Cmd + N
	  New Solid                     Ctrl + Y             Cmd + Y
	  Duplicate Layer               Ctrl + D             Cmd + D
	  Pre-compose                   Ctrl + Shift + C     Cmd + Shift + C
	  Toggle Graph Editor           Shift + F3           Shift + F3
	  Easy Ease                     F9                   F9
	  Add Expression                Alt + click ⏱        Opt + click ⏱
	  Render Queue                  Ctrl + M             Cmd + M
	  Split Layer                   Ctrl + Shift + D     Cmd + Shift + D
	  Trim to Work Area             Ctrl + Shift + X     Cmd + Shift + X
	  Solo Layer                    S (in timeline)      S (in timeline)
	  ```
-
- # Useful Links
	- Official Docs: https://helpx.adobe.com/after-effects/user-guide.html
	- AE Scripting API: https://ae-scripting.docsforadobe.dev/
	- Plugins: https://aescripts.com
	- Tutorials: https://helpx.adobe.com/after-effects/tutorials.html
	- Community: https://community.adobe.com/t5/after-effects/ct-p/ct-after-effects