---
seoTitle: Blender Complete Guide – 3D Modeling, Animation, Rendering & VFX
description: "Comprehensive Blender reference covering interface, modeling, sculpting, rigging, animation, shading, Cycles/EEVEE rendering, geometry nodes, compositing, and Python scripting."
keywords: "Blender, 3D modeling, animation, sculpting, rigging, shading, Cycles, EEVEE, geometry nodes, rendering, compositing, Python scripting, Blender 4, open source 3D, VFX, VR-Rathod, Code-Note, code note vr, vr book"
---

- # History
	- **How**: Blender started as an in-house 3D tool at **NeoGeo**, a Dutch animation studio, in **1994**.
	- **Who**: **Ton Roosendaal** — founder of NeoGeo and the Blender Foundation. He open-sourced Blender in **2002** after a successful crowdfunding campaign.
	- **Why**: To give artists a free, open-source, professional-grade 3D creation suite — no licensing fees, no vendor lock-in.
	- **Key Milestones**:
		- 1994 — Internal NeoGeo tool
		- 2002 — Open-sourced under GPL
		- 2.80 (2019) — Complete UI overhaul, EEVEE real-time renderer introduced
		- 2.90–3.x — Geometry Nodes, Cycles X, Asset Library
		- 4.x (2023+) — Light Linking, improved EEVEE Next, better GPU rendering
-
- # Introduction
	- **Blender** is a free, open-source **3D creation suite** supporting the full pipeline: modeling, rigging, animation, simulation, rendering, compositing, motion tracking, and video editing.
	- Available on Windows, macOS, and Linux.
	- Used in indie films, game asset creation, architectural visualization, product design, VFX, and motion graphics.
	-
	- ## Advantages
		- Completely free and open-source (GPL license).
		- Full pipeline in one app — no need for separate tools.
		- Two powerful renderers: **Cycles** (path-traced, photorealistic) and **EEVEE** (real-time, fast).
		- Active community, massive add-on ecosystem.
		- Python API for scripting and automation.
		- Regular major releases with cutting-edge features.
	-
	- ## Disadvantages
		- Steep learning curve — non-standard UI conventions.
		- Heavy on RAM and GPU for complex scenes.
		- Some industry pipelines prefer Maya/Houdini for specific tasks.
		- This Note even there Documentation can lag behind rapid development.
- # Installation & System Requirements
	- ## Download
		- Official site: https://www.blender.org/download/
		- Available as installer or portable `.zip` (Windows), `.dmg` (macOS), `.tar.xz` (Linux).
		- Also on Steam (auto-updates).
	-
	- ## Minimum Requirements
		- ```
		  Component       Minimum                     Recommended
		  OS              Windows 8.1 / macOS 10.13   Windows 10+ / macOS 12+
		  CPU             64-bit, 4 cores             8+ cores
		  RAM             8 GB                        16–32 GB
		  GPU             2 GB VRAM, OpenGL 4.3        8+ GB VRAM (NVIDIA RTX / AMD RX)
		  Storage         500 MB (app)                SSD recommended
		  ```
	-
	- ## GPU Rendering Support
		- **NVIDIA**: CUDA (older) or OptiX (RTX cards — much faster with ray tracing)
		- **AMD**: HIP (RX 5000+)
		- **Intel**: oneAPI (Arc GPUs)
		- **Apple Silicon**: Metal backend
		- Enable in: Edit → Preferences → System → Cycles Render Devices
- # Interface & Navigation
	- ## Main Areas
		- ```
		  Area                    Purpose
		  3D Viewport             Main workspace — view and edit your scene
		  Properties Panel        Object/material/render settings (right side)
		  Outliner                Scene hierarchy — all objects listed (top right)
		  Timeline                Keyframe and animation playback
		  Shader Editor           Node-based material creation
		  Geometry Nodes Editor   Procedural geometry via nodes
		  UV Editor               UV unwrapping for textures
		  Image Editor            View/edit textures and render output
		  Compositor              Post-processing node graph
		  Scripting               Python console and text editor
		  ```
	-
	- ## Viewport Navigation
		- ```
		  Action                      Shortcut
		  Rotate view                 Middle Mouse Button (MMB) drag
		  Pan view                    Shift + MMB drag
		  Zoom                        Scroll wheel / Ctrl + MMB drag
		  Focus on selected           Numpad . (period)
		  Front view                  Numpad 1
		  Side view (right)           Numpad 3
		  Top view                    Numpad 7
		  Camera view                 Numpad 0
		  Toggle perspective/ortho    Numpad 5
		  Fly/Walk mode               Shift + ` (backtick)
		  ```
	-
	- ## Editor Customization
		- Split any area: drag the corner of an editor.
		- Change editor type: click the icon in the top-left of any area.
		- Save custom layout: File → Defaults → Save Startup File.
	-
	- ## Workspaces (top tabs)
		- Layout, Modeling, Sculpting, UV Editing, Texture Paint, Shading, Animation, Rendering, Compositing, Scripting.
		- Each workspace has a pre-configured set of editors.
- # Object Mode — Basics
  collapsed:: true
	- ## Modes Overview
		- ```
		  Mode                    Purpose
		  Object Mode             Move, scale, rotate whole objects
		  Edit Mode               Edit vertices, edges, faces of a mesh
		  Sculpt Mode             Sculpt with brushes (like digital clay)
		  Vertex/Weight Paint     Paint vertex colors or bone weights
		  Texture Paint           Paint directly on 3D surface
		  Pose Mode               Animate armature bones
		  ```
		- Switch modes: **Tab** key (toggles Object ↔ Edit), or the mode dropdown top-left.
	-
	- ## Essential Object Shortcuts
		- ```
		  Action                  Shortcut
		  Add object              Shift + A
		  Delete object           X or Delete
		  Duplicate               Shift + D
		  Duplicate linked        Alt + D
		  Grab / Move             G
		  Rotate                  R
		  Scale                   S
		  Constrain to axis       G/R/S then X, Y, or Z
		  Constrain to plane      G/R/S then Shift + X/Y/Z
		  Type exact value        G → X → type 2 (moves 2 units on X)
		  Apply transforms        Ctrl + A
		  Set origin              Right-click → Set Origin
		  Hide object             H
		  Unhide all              Alt + H
		  Join objects            Ctrl + J
		  Separate mesh           P (in Edit Mode)
		  ```
	-
	- ## Object Properties
		- Location, Rotation, Scale in the **N panel** (press N in viewport).
		- Apply scale before modeling/rigging: Ctrl + A → Scale.
		- **Origin point** — the pivot of an object. Set via Right-click → Set Origin.
- # Mesh Modeling
  collapsed:: true
	- ## Edit Mode Basics
		- Enter Edit Mode: **Tab**
		- Select vertices (1), edges (2), faces (3) — number keys on keyboard.
		- ```
		  Action                  Shortcut
		  Select all / deselect   A
		  Box select              B
		  Circle select           C
		  Lasso select            Ctrl + Right-click drag
		  Invert selection        Ctrl + I
		  Loop select             Alt + click edge
		  Select linked           L (hover) or Ctrl + L
		  Extrude                 E
		  Inset faces             I
		  Loop cut                Ctrl + R
		  Bevel                   Ctrl + B (edges), Ctrl + Shift + B (vertices)
		  Knife tool              K
		  Merge vertices          M
		  Fill face               F
		  Subdivide               Right-click → Subdivide
		  Dissolve                Ctrl + X
		  Bridge edge loops       Select 2 loops → Edge → Bridge Edge Loops
		  ```
	-
	- ## Proportional Editing
		- Press **O** to toggle. Affects nearby vertices with a falloff.
		- Scroll wheel changes the influence radius.
		- Useful for organic shaping without sculpt mode.
	-
	- ## Modifiers
		- Non-destructive operations applied on top of base mesh.
		- Add via Properties → Wrench icon → Add Modifier.
		- ```
		  Modifier              Use
		  Subdivision Surface   Smooth/subdivide mesh (Catmull-Clark)
		  Mirror                Symmetrical modeling (X/Y/Z axis)
		  Solidify              Add thickness to thin surfaces
		  Bevel                 Round edges automatically
		  Array                 Repeat object in a pattern
		  Boolean               Add/subtract/intersect mesh shapes
		  Shrinkwrap            Snap mesh to surface of another object
		  Armature              Deform mesh with bones
		  Displace              Displace vertices using a texture
		  Decimate              Reduce polygon count
		  Remesh                Rebuild topology (Voxel or Quad)
		  Weld                  Merge nearby vertices
		  Skin                  Generate mesh from edges (for quick characters)
		  ```
	-
	- ## Topology Best Practices
		- Aim for **quad-dominant** topology (4-sided faces) for clean deformation.
		- Avoid **n-gons** (5+ sided faces) in areas that will deform.
		- Use **edge loops** to define form and support subdivision.
		- **Poles** (vertices with 3 or 5+ edges) should be placed in low-deformation areas.
- # Sculpting
  collapsed:: true
	- ## Overview
		- Sculpt Mode treats the mesh like digital clay — push, pull, smooth, crease.
		- Best with a **graphics tablet** (Wacom, XP-Pen) for pressure sensitivity.
		- Use **Dyntopo** (Dynamic Topology) for automatic mesh subdivision while sculpting.
		- Use **Multires modifier** for non-destructive multi-resolution sculpting.
	-
	- ## Essential Brushes
		- ```
		  Brush           Shortcut    Effect
		  Draw            X           Push surface outward
		  Draw Sharp      -           Sharp crease/ridge
		  Clay            C           Build up clay-like volume
		  Clay Strips     -           Layered clay strips
		  Inflate         I           Inflate/deflate surface
		  Grab            G           Move vertices freely
		  Snake Hook      K           Pull out spikes/tentacles
		  Smooth          Shift       Smooth surface (hold Shift with any brush)
		  Flatten         Shift+T     Flatten to average plane
		  Crease          Shift+C     Create sharp creases
		  Pinch           P           Pull edges together
		  Mask            M           Mask areas from sculpting
		  ```
	-
	- ## Sculpting Workflow Tips
		- Start with a **base mesh** (sphere, cube, or imported reference).
		- Block out large forms first with **Grab** and **Clay**.
		- Add detail progressively — don't jump to fine detail too early.
		- Use **Symmetry** (X axis) for characters: Sculpt → Symmetry.
		- **Remesh** (Ctrl + R in sculpt mode) to get clean uniform topology.
		- Use **Face Sets** to isolate and work on specific regions.
- # UV Unwrapping & Texturing
  collapsed:: true
	- ## What is UV Unwrapping?
		- UV mapping = flattening a 3D mesh into 2D space so textures can be applied correctly.
		- U and V are the 2D axes (like X and Y but for texture space).
	-
	- ## Unwrapping Workflow
		- In Edit Mode, mark seams: select edges → Edge → Mark Seam.
		- Select all (A) → UV → Unwrap (or Smart UV Project for quick results).
		- Open UV Editor to see and adjust the UV layout.
		- ```
		  Unwrap Method         Best For
		  Unwrap                Manual seam-based, best quality
		  Smart UV Project      Quick, automated, good for hard-surface
		  Cube/Cylinder/Sphere  Simple primitive shapes
		  Project from View     Flat surfaces, decals
		  ```
	-
	- ## Texture Painting
		- Switch to **Texture Paint** workspace.
		- Create a new image texture in the Image Editor.
		- Paint directly on the 3D surface.
		- Save the image: Image → Save As (it's separate from the .blend file).
	-
	- ## PBR Texturing (Physically Based Rendering)
		- Standard texture maps used in PBR workflow:
		- ```
		  Map               Purpose
		  Albedo/Base Color  Surface color (no lighting info)
		  Roughness          How rough/smooth the surface is (0=mirror, 1=matte)
		  Metallic           Whether surface is metal (0 or 1 mostly)
		  Normal Map         Fake surface detail without extra geometry
		  Height/Displacement Real surface displacement
		  Ambient Occlusion  Baked shadow in crevices
		  Emission           Self-illuminating areas
		  ```
		- Use **Substance Painter**, **Quixel Mixer**, or **ArmorPaint** for advanced PBR texturing.
- # Shading & Materials
  collapsed:: true
	- ## Shader Editor
		- Node-based material system. Every material is a node graph.
		- Open: Shading workspace or Shift + F3.
		- Add nodes: Shift + A.
	-
	- ## Principled BSDF — The Main Shader
		- A physically-based shader that covers most real-world materials.
		- ```
		  Input               Effect
		  Base Color          Surface color / albedo texture
		  Metallic            0 = dielectric, 1 = metal
		  Roughness           0 = mirror-smooth, 1 = fully diffuse
		  IOR                 Index of refraction (glass = 1.45, water = 1.33)
		  Alpha               Transparency (0 = invisible, 1 = opaque)
		  Normal              Normal map input
		  Emission Color      Glow/self-illumination color
		  Emission Strength   Intensity of emission
		  Subsurface Weight   Skin/wax light scattering
		  Coat Weight         Clear coat layer (car paint, varnish)
		  Sheen Weight        Fabric/velvet micro-fiber effect
		  ```
	-
	- ## Common Material Setups
		- ```
		  Material        Key Settings
		  Glass           Transmission = 1, Roughness = 0, IOR = 1.45
		  Metal           Metallic = 1, Roughness = 0.1–0.4
		  Skin            Subsurface Weight = 0.1–0.3, warm Base Color
		  Emission/Glow   Emission Color + Strength > 1
		  Plastic         Metallic = 0, Roughness = 0.3–0.6
		  ```
	-
	- ## Texture Nodes
		- ```
		  Node                    Use
		  Image Texture           Load external image (PNG, JPG, EXR)
		  Noise Texture           Procedural noise (clouds, bumps)
		  Voronoi Texture         Cell/crystal patterns
		  Wave Texture            Stripes, wood grain, water
		  Musgrave Texture        Fractal terrain-like noise
		  Gradient Texture        Linear/radial gradient
		  Texture Coordinate      UV, Object, World, Camera space
		  Mapping                 Offset, rotate, scale texture
		  ```
	-
	- ## Node Groups
		- Select nodes → Ctrl + G to group them into a reusable node group.
		- Expose inputs/outputs for easy reuse across materials.
- # Lighting
  collapsed:: true
	- ## Light Types
		- ```
		  Light Type      Behavior
		  Point           Radiates in all directions from a point (bulb)
		  Sun             Parallel rays, infinite distance (outdoor daylight)
		  Spot            Cone-shaped beam (flashlight, stage light)
		  Area            Rectangular/disk soft light (studio softbox)
		  ```
	-
	- ## HDRI Lighting (Image-Based Lighting)
		- Use a high-dynamic-range panoramic image as the world environment.
		- Provides realistic ambient light and reflections.
		- Setup: World Properties → Surface → Background → Environment Texture → load .hdr/.exr file.
		- Free HDRIs: https://polyhaven.com/hdris
	-
	- ## Three-Point Lighting Setup
		- ```
		  Light           Position                    Purpose
		  Key Light       45° front-side, above        Main illumination
		  Fill Light      Opposite side, softer        Reduce harsh shadows
		  Rim/Back Light  Behind subject               Separate from background
		  ```
	-
	- ## Light Properties
		- **Power** — intensity in Watts (Point/Spot/Area) or Lux (Sun).
		- **Color** — tint the light.
		- **Radius/Size** — larger = softer shadows (Area light).
		- **Shadow** — enable/disable per light.
		- **Light Linking** (Blender 4+) — control which objects a light affects.
- # Rendering — Cycles vs EEVEE
  collapsed:: true
	- ## Cycles (Path Tracer)
		- Physically accurate ray/path tracing renderer.
		- Simulates real light bounces — caustics, subsurface scattering, volumetrics.
		- Slower but photorealistic.
		- GPU rendering (OptiX/HIP/Metal) dramatically speeds it up.
		- ```
		  Key Settings (Render Properties):
		  - Samples: 128–4096 (higher = less noise, slower)
		  - Denoising: ON (Intel OpenImageDenoise or OptiX Denoiser)
		  - Light Paths: Max Bounces (Total, Diffuse, Glossy, Transmission)
		  - Caustics: Enable for glass/water light patterns
		  - Volume Step Rate: Controls volumetric quality
		  ```
	-
	- ## EEVEE (Real-Time Rasterizer)
		- Real-time OpenGL-based renderer — fast, game-engine quality.
		- Not physically accurate but very fast for previews and stylized renders.
		- EEVEE Next (Blender 4.2+) — major rewrite, much closer to Cycles quality.
		- ```
		  Key Settings:
		  - Samples: 16–64 (much lower than Cycles)
		  - Ambient Occlusion: ON for contact shadows
		  - Bloom: Glow effect for bright areas
		  - Screen Space Reflections: Reflections from screen data
		  - Shadows: Cube Size (higher = sharper shadows)
		  - Volumetrics: Fog, smoke, atmosphere
		  ```
	-
	- ## Cycles vs EEVEE Comparison
		- ```
		  Feature               Cycles              EEVEE
		  Speed                 Slow (minutes)      Fast (seconds/real-time)
		  Accuracy              Physically correct  Approximated
		  Global Illumination   True GI             Baked/approximated
		  Caustics              Yes                 No (EEVEE Next: partial)
		  Subsurface Scatter    Yes                 Yes (approximated)
		  Volumetrics           Full                Limited
		  Best For              Film, arch-viz      Games, motion graphics, previews
		  ```
	-
	- ## Render Output Settings
		- Resolution: Render Properties → Format → Resolution X/Y.
		- Frame Rate: Output Properties → Frame Rate.
		- Output Path: Output Properties → Output → set folder path.
		- File Format: PNG (single frame), FFmpeg Video (animation), OpenEXR (compositing).
		- Render image: F12. Render animation: Ctrl + F12.
- # Rigging & Armatures
  collapsed:: true
	- ## What is Rigging?
		- Rigging = creating a skeleton (armature) to deform and animate a mesh.
		- The mesh is **skinned** to the armature — bones control vertex movement.
	-
	- ## Creating an Armature
		- Shift + A → Armature → Single Bone.
		- In Edit Mode: E to extrude new bones, Ctrl + R to roll.
		- Name bones clearly (e.g., `spine`, `arm.L`, `arm.R`).
		- Use **X-Axis Mirror** for symmetrical rigs.
	-
	- ## Parenting Mesh to Armature
		- Select mesh first, then Shift-click armature → Ctrl + P → With Automatic Weights.
		- Blender auto-assigns vertex weights based on proximity.
		- Fix bad weights in **Weight Paint** mode.
	-
	- ## Bone Constraints
		- ```
		  Constraint              Use
		  Inverse Kinematics (IK) Automatic chain solving (arms, legs)
		  Copy Rotation           Bone copies another bone's rotation
		  Copy Location           Bone follows another bone's position
		  Track To                Bone always points at a target
		  Stretch To              Bone stretches toward a target
		  Limit Rotation          Clamp rotation to a range
		  Child Of                Parent to another object/bone
		  ```
	-
	- ## IK vs FK
		- **FK (Forward Kinematics)**: Rotate each bone manually down the chain. Good for arcs.
		- **IK (Inverse Kinematics)**: Move the end effector, chain solves automatically. Good for feet/hands on surfaces.
		- Professional rigs use **IK/FK switching** for flexibility.
	-
	- ## Shape Keys (Blend Shapes)
		- Morph targets for facial animation and corrective shapes.
		- Object Data Properties → Shape Keys → + to add.
		- **Basis** = rest shape. Add new keys and sculpt/edit them.
		- Animate the Value (0–1) to blend between shapes.
		- Used for: lip sync, blink, smile, corrective shapes on joints.
- # Animation
  collapsed:: true
	- ## Keyframe Basics
		- Select a property → hover over it → press **I** to insert a keyframe.
		- Or press **I** in the viewport to keyframe Location/Rotation/Scale.
		- Keyframes appear as yellow diamonds in the **Timeline**.
		- ```
		  Action                  Shortcut
		  Insert keyframe         I
		  Delete keyframe         Alt + I
		  Jump to next keyframe   Right arrow
		  Jump to prev keyframe   Left arrow
		  Play/Pause              Space
		  ```
	-
	- ## Graph Editor
		- Shows animation curves (F-Curves) — control interpolation between keyframes.
		- Open: Shift + F6 or Animation workspace.
		- **Bezier handles** — drag to control easing (ease in/out).
		- **Extrapolation**: what happens before/after keyframe range (Constant, Linear, Cyclic).
		- Common modifiers: Cycles (loop), Noise (random jitter), Stepped (frame-by-frame).
	-
	- ## NLA Editor (Non-Linear Animation)
		- Stack and blend multiple animation actions.
		- Convert action to NLA strip: push down in Action Editor.
		- Blend strips, set influence, repeat, or offset timing.
		- Great for combining walk cycles, idle animations, etc.
	-
	- ## Drivers
		- Link one property to another using expressions or variables.
		- Right-click any property → Add Driver.
		- Example: link bone rotation to shape key value for automatic corrective shapes.
		- ```python
		  # Driver expression example:
		  # var = bone rotation in radians
		  # expression: var / 1.5708  (normalize 0–90° to 0–1)
		  ```
	-
	- ## Animation Principles (12 Principles)
		- ```
		  Principle               Description
		  Squash & Stretch        Exaggerate deformation for weight/flexibility
		  Anticipation            Small opposite motion before main action
		  Staging                 Clear composition to direct viewer's eye
		  Straight Ahead/Pose     Two animation approaches
		  Follow Through          Parts continue moving after main action stops
		  Slow In / Slow Out      Ease in and out of keyframes
		  Arcs                    Natural motion follows arc paths
		  Secondary Action        Supporting motion adds realism
		  Timing                  Number of frames = speed/weight
		  Exaggeration            Push poses beyond reality for appeal
		  Solid Drawing           3D form and weight in poses
		  Appeal                  Charisma and clarity in character design
		  ```