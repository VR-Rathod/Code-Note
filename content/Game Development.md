---
date: 2026-03-24T10:39:55+05:30
lastmod: 2026-04-17T17:08:18+05:30

seoTitle: Game Development Reference – Concepts, Engines, and Design Guide
description: "Game development overview covering game loops, physics, rendering, AI, audio, input handling, popular engines (Unity, Unreal, Godot), and career paths."
keywords: "game development, game loop, physics engine, rendering, game AI, audio, input handling, Unity, Unreal Engine, Godot, game design, indie game, game dev notes, game dev guide, game programming, game development reference, VR-Rathod, Code-Note, code note vr, vr book"
---

- # History
  collapsed:: true
	- **How**: Game development evolved from simple 2D arcade games (1970s) to complex 3D real-time simulations powered by GPUs, physics engines, and networked multiplayer.
	- **Who**: Pioneered by companies like Atari, id Software (Doom, Quake), Epic Games (Unreal), and Valve — whose engines became the foundation of modern game dev.
	- **Why**: To create interactive real-time experiences — combining graphics, physics, audio, AI, and networking into a cohesive system.
-
- # Introduction
  collapsed:: true
	- Game development is the discipline of building interactive real-time software. It spans multiple domains: rendering, physics, audio, AI, networking, and tooling. Understanding the core concepts applies to any engine — Unity, Unreal, Godot, or custom.
	-
	- ## Core Domains
	  collapsed:: true
		- **Rendering** — Drawing pixels: rasterization, ray tracing, shaders, lighting.
		- **Physics** — Simulating the physical world: collision, rigid bodies, constraints.
		- **Input** — Handling keyboard, mouse, gamepad, touch.
		- **Audio** — Spatial sound, mixing, DSP effects.
		- **AI** — Pathfinding, state machines, behavior trees.
		- **Networking** — Multiplayer, synchronization, lag compensation.
		- **Tools** — Editors, asset pipelines, build systems.
-
- # Game Design & Theory
  collapsed:: true
	- ## Core Principles
	  collapsed:: true
		- **Core Loop**: The primary repeating sequence of actions a player takes (e.g., jump -> collect -> reach goal).
		- **Player Agency**: The degree to which a player feels their choices matter.
		- **Level Design**: Constructing spaces to guide flow and pacing using lighting, geometry, and placement of enemies/items.
		- **Mechanics Design**: The underlying rules governing entity interactions and physical world state.
		- **Balancing**: Meticulously adjusting variables (health, drop rates) ensuring fair challenge without dominant strategies.
		- **Monetization & Economy**: Managing premium/freemium models and balancing hard (paid)/soft (earned) currency to avoid hyperinflation.
-
- # Game-Specific Systems
  collapsed:: true
	- ## Gameplay Architecture
	  collapsed:: true
		- **Inventory Systems**: Data serialization, grid/slot management, capacity limits, and UI synchronization.
		- **Quest Systems**: State machines for objective progression, branching paths, and tracking prerequisites.
		- **Dialogue Systems**: Managing conversation trees, local variables, voice-over timing, and emitting game events.
		- **Save/Load Systems**: Deep serialization of world and entity state (JSON/binary) to disk and rigorous corruption recovery.
		- **Achievement Systems**: Validating gameplay milestones and invoking platform APIs (Steamworks, Xbox Live, PSN).
-
- # The Game Loop
	- ## Core Concept
	  collapsed:: true
		- The game loop is the heartbeat of every game — it runs continuously, processing input, updating state, and rendering frames.
		- ```
		  while (game_running):
		      process_input()
		      update(delta_time)
		      render()
		  ```
	-
	- ## Fixed vs Variable Timestep
	  collapsed:: true
		- ```
		  Variable timestep (render loop):
		    - Runs as fast as possible
		    - delta = time since last frame
		    - Used for rendering, animations, camera
		    - Problem: physics becomes unstable at high/low FPS
		  
		  Fixed timestep (physics loop):
		    - Runs at fixed rate (e.g., 60Hz)
		    - delta is always constant (1/60 = 0.01666s)
		    - Used for physics, collision, deterministic simulation
		    - Accumulator pattern handles leftover time
		  ```
		- ```cpp
		  // Accumulator pattern (fixed timestep)
		  double accumulator = 0.0;
		  const double fixed_dt = 1.0 / 60.0;
		  
		  while (running) {
		      double frame_time = get_elapsed_time();
		      accumulator += frame_time;
		  
		      while (accumulator >= fixed_dt) {
		          physics_update(fixed_dt);
		          accumulator -= fixed_dt;
		      }
		  
		      double alpha = accumulator / fixed_dt;  // interpolation factor
		      render(alpha);
		  }
		  ```
	-
	- ## Frame Rate & VSync
	  collapsed:: true
		- ```
		  VSync ON  — GPU waits for monitor refresh. No tearing, adds latency.
		  VSync OFF — GPU renders as fast as possible. Tearing possible.
		  Triple Buffering — Reduces VSync latency while preventing tearing.
		  Adaptive Sync (G-Sync/FreeSync) — Monitor matches GPU frame rate.
		  
		  Target FPS:
		    30 FPS — Minimum acceptable for most games
		    60 FPS — Standard smooth gameplay
		    120+ FPS — Competitive gaming, VR (90/120Hz required)
		  ```
-
- # Entity Component System (ECS)
  collapsed:: true
	- ## Concept
	  collapsed:: true
		- ECS is a data-oriented architecture that separates **data** (components) from **behavior** (systems).
		- ```
		  Entity    — Just an ID (integer). No data, no behavior.
		  Component — Pure data struct attached to an entity.
		  System    — Logic that operates on entities with specific components.
		  
		  Example:
		    Entity 1: [Position, Velocity, Sprite]   → rendered, moves
		    Entity 2: [Position, Health, AI]          → has health, has AI
		    Entity 3: [Position, Collider, RigidBody] → physics object
		  ```
	-
	- ## Why ECS?
	  collapsed:: true
		- ```
		  OOP (inheritance-based):
		    GameObject → Character → Player
		                           → Enemy
		    Problem: deep hierarchies, fragile base class, hard to mix behaviors
		  
		  ECS (composition-based):
		    Player = Entity + [Position, Velocity, Health, Input, Sprite]
		    Enemy  = Entity + [Position, Velocity, Health, AI, Sprite]
		    Bullet = Entity + [Position, Velocity, Damage, Collider]
		    
		    Benefits:
		    - Cache-friendly: components stored in contiguous arrays (SoA)
		    - Easy to add/remove behaviors at runtime
		    - Systems are pure functions — easy to test and parallelize
		  ```
	-
	- ## ECS in Practice
	  collapsed:: true
		- ```cpp
		  // Minimal ECS example (conceptual)
		  struct Position { float x, y; };
		  struct Velocity { float dx, dy; };
		  struct Health   { int current, max; };
		  
		  // Movement system — operates on all entities with Position + Velocity
		  void movement_system(float dt, 
		                        std::vector<Position>& positions,
		                        std::vector<Velocity>& velocities) {
		      for (size_t i = 0; i < positions.size(); i++) {
		          positions[i].x += velocities[i].dx * dt;
		          positions[i].y += velocities[i].dy * dt;
		      }
		  }
		  ```
		- Engines using ECS: **Bevy** (pure ECS), **Unity DOTS**, **Flecs** (C++ ECS library).
-
- # Rendering Pipeline
  collapsed:: true
	- ## Rasterization Pipeline (Traditional GPU)
	  collapsed:: true
		- ```
		  CPU Side:
		    1. Scene graph traversal — determine visible objects
		    2. Frustum culling — discard objects outside camera view
		    3. Draw call submission — send geometry + material to GPU
		  
		  GPU Pipeline:
		    1. Vertex Shader    — transform vertices (model → clip space)
		    2. Primitive Assembly — assemble triangles
		    3. Rasterization    — convert triangles to fragments (pixels)
		    4. Fragment Shader  — compute pixel color (lighting, textures)
		    5. Depth Test       — discard hidden fragments (z-buffer)
		    6. Blending         — alpha transparency compositing
		    7. Framebuffer      — final image output
		  ```
	-
	- ## Coordinate Spaces
	  collapsed:: true
		- ```
		  Model Space    — local to the object (origin at object center)
		  World Space    — global scene coordinates
		  View Space     — relative to camera (camera at origin)
		  Clip Space     — after projection (NDC: -1 to 1)
		  Screen Space   — final pixel coordinates
		  
		  Transforms:
		    Model Matrix  → World Space
		    View Matrix   → View Space
		    Projection Matrix → Clip Space
		  
		  MVP = Projection * View * Model
		  ```
	-
	- ## Rendering Techniques
	  collapsed:: true
		- ```
		  Forward Rendering:
		    - Each object rendered once per light
		    - Simple, good for few lights
		    - Cost: O(objects × lights)
		  
		  Deferred Rendering:
		    - Geometry pass: store position, normal, albedo in G-Buffer
		    - Lighting pass: apply all lights using G-Buffer
		    - Cost: O(objects + lights) — decoupled
		    - Downside: no transparency, high memory bandwidth
		  
		  Forward+  (Tiled/Clustered Forward):
		    - Divide screen into tiles, assign lights per tile
		    - Best of both worlds — used in Godot 4 Forward+
		  ```
	-
	- ## Ray Tracing vs Rasterization
		- ```
		  Rasterization:
		    - Projects geometry onto screen
		    - Approximates lighting (shadow maps, reflection probes, SSAO)
		    - Very fast — runs at 60-120+ FPS
		    - Used in all real-time games
		  
		  Ray Tracing:
		    - Simulates actual light paths
		    - Physically accurate reflections, shadows, GI
		    - Expensive — requires RT hardware (NVIDIA RTX, AMD RDNA2+)
		    - Hybrid RT: rasterize base, ray trace shadows/reflections only
		  
		  Path Tracing:
		    - Full Monte Carlo light simulation
		    - Used in offline rendering (movies, archviz)
		    - Real-time path tracing emerging (NVIDIA RTXDI, ReSTIR)
		  ```
		- See [[PathTracer Learning]] for full path tracing deep dive.
-
- # Lighting & Shading
  collapsed:: true
	- ## Light Types
	  collapsed:: true
		- ```
		  Directional Light — Infinite distance, parallel rays (sun/moon). No position, only direction.
		  Point Light       — Emits in all directions from a point. Has range/falloff.
		  Spot Light        — Cone-shaped emission. Has angle, range, falloff.
		  Area Light        — Emits from a surface. Soft shadows, realistic.
		  Ambient Light     — Uniform light from all directions. Approximates indirect light.
		  ```
	-
	- ## Lighting Models
	  collapsed:: true
		- ```
		  Phong / Blinn-Phong (classic):
		    Color = Ambient + Diffuse + Specular
		    Diffuse  = max(dot(N, L), 0) * light_color * albedo
		    Specular = pow(max(dot(R, V), 0), shininess) * spec_color
		  
		  PBR (Physically Based Rendering) — modern standard:
		    - Albedo    — base color (no lighting baked in)
		    - Metallic  — 0 = dielectric, 1 = metal
		    - Roughness — 0 = mirror, 1 = fully diffuse
		    - Normal    — surface detail without geometry
		    - AO        — ambient occlusion (crevice darkening)
		    - Emission  — self-illumination
		  ```
	-
	- ## Shadows
	  collapsed:: true
		- ```
		  Shadow Maps:
		    1. Render scene from light's POV → depth map
		    2. During main render: compare fragment depth to shadow map
		    3. If fragment is farther → in shadow
		    Problems: aliasing (shadow acne), resolution limits
		  
		  PCF (Percentage Closer Filtering) — soft shadow edges
		  PCSS (Percentage Closer Soft Shadows) — variable penumbra
		  CSM (Cascaded Shadow Maps) — multiple maps for different distances
		  Ray Traced Shadows — accurate, expensive
		  ```
	-
	- ## Global Illumination (GI)
	  collapsed:: true
		- ```
		  Lightmaps     — Pre-baked GI. Zero runtime cost. Static only.
		  Light Probes  — Baked spherical harmonics at points. Dynamic objects.
		  SSAO          — Screen-space ambient occlusion. Cheap, limited.
		  SSGI          — Screen-space GI. Better but still limited to screen.
		  VoxelGI       — Voxelized scene GI. Semi-dynamic.
		  SDFGI         — Signed distance field GI. Large open worlds (Godot 4).
		  Lumen (UE5)   — Fully dynamic GI using ray tracing + SDF.
		  ReSTIR GI     — Real-time path traced GI with reservoir sampling.
		  ```
-
- # Physics Engine
  collapsed:: true
	- ## Core Concepts
	  collapsed:: true
		- ```
		  Rigid Body    — Solid object with mass, velocity, angular velocity.
		  Static Body   — Immovable collider (walls, floors).
		  Kinematic Body — Moved by code, not physics (player, platforms).
		  Soft Body     — Deformable mesh (cloth, jelly).
		  Trigger/Sensor — Detects overlap, no physical response.
		  ```
	-
	- ## Collision Detection
	  collapsed:: true
		- ```
		  Broad Phase (fast, approximate):
		    - AABB (Axis-Aligned Bounding Box) overlap test
		    - BVH (Bounding Volume Hierarchy) — tree of AABBs
		    - Spatial hashing — divide space into grid cells
		  
		  Narrow Phase (exact):
		    - SAT (Separating Axis Theorem) — convex shapes
		    - GJK (Gilbert-Johnson-Keerthi) — convex shapes
		    - EPA (Expanding Polytope Algorithm) — penetration depth
		    - Mesh vs Mesh — expensive, use convex hulls
		  
		  Continuous Collision Detection (CCD):
		    - Prevents fast objects from tunneling through thin walls
		    - Sweep test: check entire path, not just endpoints
		  ```
	-
	- ## Physics Integration
	  collapsed:: true
		- ```
		  Euler Integration (simple, unstable at large dt):
		    velocity += acceleration * dt
		    position += velocity * dt
		  
		  Verlet Integration (more stable):
		    position_new = 2*position - position_old + acceleration * dt²
		  
		  RK4 (Runge-Kutta 4th order, most accurate):
		    Used for precise simulations (orbital mechanics, fluid)
		  
		  Semi-implicit Euler (used in most game engines):
		    velocity += acceleration * dt
		    position += velocity * dt   ← uses NEW velocity
		    Good balance of stability and simplicity
		  ```
	-
	- ## Constraints & Joints
	  collapsed:: true
		- ```
		  Distance Joint  — Keeps two bodies at fixed distance (rope)
		  Hinge Joint     — Rotation around one axis (door, wheel)
		  Slider Joint    — Linear movement along one axis (piston)
		  Ball Joint      — Free rotation in all directions (shoulder)
		  Spring Joint    — Elastic connection with damping
		  ```
-
- # Game AI
  collapsed:: true
	- ## Finite State Machine (FSM)
	  collapsed:: true
		- ```
		  States: Idle → Patrol → Chase → Attack → Dead
		  Transitions triggered by conditions (player spotted, health low, etc.)
		  
		  Simple, predictable, easy to debug.
		  Problem: state explosion with complex behaviors.
		  ```
		- ```cpp
		  enum class AIState { Idle, Patrol, Chase, Attack, Dead };
		  
		  void update(float dt) {
		      switch (state) {
		          case AIState::Idle:
		              if (can_see_player()) state = AIState::Chase;
		              break;
		          case AIState::Chase:
		              move_toward(player_pos, dt);
		              if (in_attack_range()) state = AIState::Attack;
		              if (!can_see_player()) state = AIState::Patrol;
		              break;
		          case AIState::Attack:
		              attack();
		              if (!in_attack_range()) state = AIState::Chase;
		              break;
		      }
		  }
		  ```
	-
	- ## Behavior Trees
	  collapsed:: true
		- ```
		  Hierarchical tree of tasks. More scalable than FSM.
		  
		  Node types:
		    Selector  (?) — tries children left to right, succeeds on first success
		    Sequence  (→) — runs children in order, fails on first failure
		    Decorator     — modifies child behavior (repeat, invert, timeout)
		    Leaf          — actual action (move, attack, play animation)
		  
		  Example:
		    Selector
		    ├── Sequence (attack)
		    │   ├── IsPlayerInRange
		    │   └── AttackPlayer
		    └── Sequence (patrol)
		        ├── HasPatrolPoint
		        └── MoveToPatrolPoint
		  ```
	-
	- ## Pathfinding
	  collapsed:: true
		- ```
		  A* Algorithm:
		    - Finds shortest path on a graph/grid
		    - f(n) = g(n) + h(n)
		      g = cost from start to n
		      h = heuristic estimate from n to goal
		    - Heuristics: Manhattan (grid), Euclidean (any angle)
		  
		  NavMesh (Navigation Mesh):
		    - Walkable surface represented as polygon mesh
		    - A* runs on NavMesh graph
		    - Used in all modern engines (Godot NavigationAgent3D, Unity NavMesh)
		  
		  Steering Behaviors:
		    - Seek, Flee, Arrive, Wander, Separation, Cohesion, Alignment
		    - Combine for flocking (boids algorithm)
		  ```
	-
	- ## Perception Systems
	  collapsed:: true
		- ```
		  Line of Sight:
		    - Raycast from enemy to player
		    - Check angle within FOV cone
		    - Check distance
		  
		  Hearing:
		    - Sound events broadcast to nearby AI
		    - AI investigates last known position
		  
		  Memory:
		    - Last known player position
		    - Time since last seen
		    - Threat level
		  ```
-
- # Game Math
  collapsed:: true
	- ## Vectors
	  collapsed:: true
		- ```
		  Vector2(x, y) / Vector3(x, y, z)
		  
		  Operations:
		    Add/Sub     — translation, relative position
		    Scale       — v * scalar
		    Magnitude   — sqrt(x² + y² + z²)
		    Normalize   — v / |v|  (unit vector, length = 1)
		    Dot Product — a·b = |a||b|cos(θ)  → angle between vectors, projection
		    Cross Product — a×b = perpendicular vector (3D only) → surface normals
		    Lerp        — linear interpolation: a + (b-a)*t
		  
		  Common uses:
		    Direction   = normalize(target - origin)
		    Distance    = (target - origin).length()
		    Facing check = dot(forward, to_target) > 0  → in front
		  ```
	-
	- ## Matrices
	  collapsed:: true
		- ```
		  4×4 Matrix — represents transform (translation + rotation + scale)
		  
		  Model Matrix  = Scale * Rotation * Translation
		  MVP           = Projection * View * Model
		  
		  Operations:
		    Matrix * Vector  — transform a point
		    Matrix * Matrix  — combine transforms
		    Inverse          — undo a transform (camera view matrix)
		    Transpose        — rows ↔ columns (normal matrix)
		  ```
	-
	- ## Quaternions
	  collapsed:: true
		- ```
		  Quaternion q = (w, x, y, z)
		  
		  Why not Euler angles?
		    - Gimbal lock: lose one degree of freedom when axes align
		    - Order-dependent: XYZ ≠ ZYX
		  
		  Why Quaternions?
		    - No gimbal lock
		    - Smooth interpolation (SLERP)
		    - Compact (4 floats vs 9 for matrix)
		  
		  SLERP (Spherical Linear Interpolation):
		    q = slerp(q1, q2, t)  — smooth rotation between two orientations
		  ```
	-
	- ## Common Math Functions
	  collapsed:: true
		- ```
		  lerp(a, b, t)       — linear interpolation
		  smoothstep(a, b, t) — smooth S-curve interpolation
		  clamp(v, min, max)  — constrain value to range
		  remap(v, a,b, c,d)  — map value from [a,b] to [c,d]
		  sign(v)             — -1, 0, or 1
		  abs(v)              — absolute value
		  floor/ceil/round    — rounding
		  mod(a, b)           — modulo (wrap-around)
		  pow(base, exp)      — exponentiation
		  sqrt(v)             — square root
		  sin/cos/tan         — trigonometry (radians)
		  atan2(y, x)         — angle from origin to point
		  ```
-
- # Shaders
  collapsed:: true
	- ## What is a Shader?
	  collapsed:: true
		- ```
		  A shader is a program that runs on the GPU for every vertex or pixel.
		  
		  Vertex Shader   — runs per vertex. Transforms 3D position to screen space.
		  Fragment Shader — runs per pixel. Computes final color.
		  Compute Shader  — general GPU computation (not tied to rendering pipeline).
		  Geometry Shader — runs per primitive (triangle). Can generate new geometry.
		  ```
	-
	- ## GLSL Basics
	  collapsed:: true
		- ```glsl
		  // Vertex Shader
		  #version 450
		  
		  layout(location = 0) in vec3 in_position;
		  layout(location = 1) in vec2 in_uv;
		  
		  layout(location = 0) out vec2 frag_uv;
		  
		  layout(push_constant) uniform PushConstants {
		      mat4 mvp;
		  } pc;
		  
		  void main() {
		      gl_Position = pc.mvp * vec4(in_position, 1.0);
		      frag_uv = in_uv;
		  }
		  
		  // Fragment Shader
		  #version 450
		  
		  layout(location = 0) in vec2 frag_uv;
		  layout(location = 0) out vec4 out_color;
		  
		  layout(binding = 0) uniform sampler2D albedo_texture;
		  
		  void main() {
		      out_color = texture(albedo_texture, frag_uv);
		  }
		  ```
	-
	- ## Shader Effects
	  collapsed:: true
		- ```
		  Common shader techniques:
		    Texture mapping    — sample texture at UV coordinates
		    Normal mapping     — fake surface detail using normal texture
		    Parallax mapping   — depth illusion from height map
		    Cel shading        — cartoon-style quantized lighting
		    Outline shader     — expand normals, render back faces
		    Dissolve effect    — threshold noise texture for dissolve
		    Water shader       — animated normals + reflection + refraction
		    Heat distortion    — UV distortion using noise
		    Hologram           — scanlines + rim light + transparency
		  ```
-
- # Multiplayer & Networking
	- collapsed:: true
	  > [!info] Dedicated Page Available
	  > This is an overview only. For the full deep-dive see [[Multiplayer Networking]] which covers:
	  > Client-Server, P2P, Lockstep, Rollback (GGPO), lag compensation, entity interpolation, dead reckoning, tick rate, clock sync, delta compression, NAT traversal, matchmaking (ELO/TrueSkill), anti-cheat, relay servers, and production infrastructure — with full C++/GDScript code examples.
	-
	- ## Quick Reference
	  collapsed:: true
		- ```
		  Architectures:
		    Client-Server (Authoritative) — Server owns game state. Standard for FPS/MMO.
		    Peer-to-Peer (P2P)           — Lower latency, harder to secure. Fighting games.
		    Lockstep                      — Only inputs sent. Requires determinism. RTS.
		    Rollback Netcode (GGPO)       — P2P with speculative simulation. Fighting games.
		  
		  Transport:
		    TCP  — Reliable, ordered. Use for: login, chat, events.
		    UDP  — Low latency. Use for: game state, positions.
		    RUDP — Reliable UDP (ENet, GameNetworkingSockets). Best of both.
		  
		  Lag Compensation:
		    Client-Side Prediction   — Apply input immediately, reconcile on server correction.
		    Entity Interpolation     — Render others 100ms in the past (smooth + accurate).
		    Dead Reckoning           — Predict position from last known velocity.
		    Lag Compensation Raycast — Server rewinds time to validate hitscan shots.
		  ```
-
- # Audio in Games
  collapsed:: true
	- ## Audio Concepts
	  collapsed:: true
		- ```
		  Sample Rate  — Samples per second (44100 Hz, 48000 Hz standard)
		  Bit Depth    — Bits per sample (16-bit, 24-bit)
		  Channels     — Mono (1), Stereo (2), 5.1 Surround (6)
		  
		  File formats:
		    WAV  — Uncompressed, high quality, large files. Use for SFX.
		    OGG  — Compressed, good quality, small files. Use for music.
		    MP3  — Compressed, widely supported. Avoid for looping (gap at end).
		  ```
	-
	- ## Spatial Audio (3D Sound)
	  collapsed:: true
		- ```
		  Attenuation  — Volume decreases with distance (linear, inverse square)
		  Panning      — Left/right balance based on source position
		  Doppler      — Pitch shift based on relative velocity
		  Occlusion    — Muffled sound through walls (low-pass filter)
		  Reverb Zones — Different reverb for indoor/outdoor/cave
		  HRTF         — Head-Related Transfer Function for VR headphone 3D audio
		  ```
	-
	- ## Audio Middleware
	  collapsed:: true
		- ```
		  FMOD   — Industry standard. Used in thousands of games.
		           Supports adaptive music, complex mixing, DSP effects.
		  
		  Wwise  — Audiokinetic Wwise. Used in AAA games.
		           Node-based audio design, real-time mixing.
		  
		  Both integrate with Unity, Unreal, Godot via plugins.
		  ```
-
- # Asset Pipeline
  collapsed:: true
	- ## 3D Asset Workflow
	  collapsed:: true
		- ```
		  1. Modeling     — Create mesh in Blender/Maya/ZBrush
		  2. UV Unwrap    — Map 3D surface to 2D texture space
		  3. Texturing    — Paint/generate PBR textures (Substance Painter)
		  4. Rigging      — Create skeleton (bones) for animation
		  5. Animation    — Keyframe or motion capture animation
		  6. Export       — FBX, GLTF, OBJ → import into engine
		  7. LOD          — Create lower-poly versions for distance
		  8. Collision     — Create simplified collision mesh
		  ```
	-
	- ## Texture Formats & Compression
	  collapsed:: true
		- ```
		  PNG   — Lossless, supports alpha. Large files.
		  JPEG  — Lossy, no alpha. Small files. Avoid for game textures.
		  WebP  — Modern, good compression + alpha.
		  
		  GPU Compressed (use these in-engine):
		    DXT/BC (Desktop)  — BC1 (no alpha), BC3 (alpha), BC5 (normals), BC7 (high quality)
		    ASTC (Mobile)     — Flexible block sizes, best quality/size ratio
		    ETC2 (Android)    — OpenGL ES standard
		  
		  Texture sizes: always power of 2 (256, 512, 1024, 2048, 4096)
		  Mipmaps: pre-generated lower-res versions for distant objects
		  ```
	-
	- ## File Formats
	  collapsed:: true
		- ```
		  3D Models:
		    FBX    — Autodesk format. Widely supported. Proprietary.
		    GLTF   — Open standard. JSON + binary. Modern choice.
		    OBJ    — Simple, no animation. Good for static meshes.
		    COLLADA — XML-based. Older standard.
		  
		  Audio:
		    WAV, OGG, MP3, FLAC
		  
		  Fonts:
		    TTF, OTF, WOFF
		  ```
-
- # Game Design Patterns
  collapsed:: true
	- ## Common Patterns
	  collapsed:: true
		- ```
		  Game Loop         — Central update/render cycle (see above)
		  
		  Component         — Attach behaviors to entities (ECS, Unity components)
		  
		  Observer/Event    — Decouple systems via events/signals
		                      (Godot signals, Unity events, C++ callbacks)
		  
		  Object Pool       — Reuse objects instead of create/destroy
		                      (bullets, particles, enemies)
		  
		  State Machine     — Manage entity states (AI, player, UI)
		  
		  Command           — Encapsulate input as objects (undo/redo, replay)
		  
		  Singleton/Service — Global access to managers (AudioManager, GameManager)
		  
		  Flyweight         — Share data between many similar objects
		                      (tile types, bullet types share one data object)
		  
		  Spatial Partition — Divide space for fast queries
		                      (Grid, Quadtree, Octree, BVH)
		  
		  Dirty Flag        — Only recalculate when data changes
		                      (transform hierarchy, shadow maps)
		  ```
	-
	- ## Object Pooling Example
	  collapsed:: true
		- ```cpp
		  class BulletPool {
		      std::vector<Bullet*> pool;
		  public:
		      Bullet* acquire() {
		          if (!pool.empty()) {
		              auto b = pool.back();
		              pool.pop_back();
		              b->reset();
		              return b;
		          }
		          return new Bullet();
		      }
		  
		      void release(Bullet* b) {
		          b->deactivate();
		          pool.push_back(b);
		      }
		  };
		  ```
-
- # Performance & Optimization
  collapsed:: true
	- ## CPU Optimization
	  collapsed:: true
		- ```
		  Profiling first — never optimize blind. Use engine profiler.
		  
		  Common bottlenecks:
		    - Too many draw calls (batch geometry)
		    - Expensive AI updates (update less frequently, use LOD AI)
		    - Physics with too many bodies (sleep inactive bodies)
		    - Garbage collection (C#/GDScript — avoid allocations in hot loops)
		    - Cache misses (ECS data-oriented layout helps)
		  
		  Techniques:
		    - Spatial partitioning for collision/query (BVH, grid)
		    - Job system / multithreading for parallel work
		    - SIMD for math-heavy code (vector operations)
		    - Object pooling (avoid alloc/free per frame)
		  ```
	-
	- ## GPU Optimization
	  collapsed:: true
		- ```
		  Draw Calls:
		    - Each draw call has CPU overhead
		    - Batch: combine meshes with same material
		    - Instancing: render many identical objects in one call
		    - GPU-driven rendering: GPU decides what to draw
		  
		  Overdraw:
		    - Pixels rendered multiple times (transparent objects)
		    - Sort transparent objects back-to-front
		    - Use depth prepass to reject occluded fragments early
		  
		  Texture Bandwidth:
		    - Use compressed textures (BC/ASTC)
		    - Use mipmaps (reduces texture cache misses)
		    - Texture atlases (fewer texture binds)
		  
		  Shader Complexity:
		    - Avoid branching in shaders (use step/mix instead)
		    - Precompute values in vertex shader when possible
		    - Use lower precision (mediump) on mobile
		  ```
	-
	- ## Level of Detail (LOD)
	  collapsed:: true
		- ```
		  Mesh LOD:
		    LOD0 — Full detail (close)
		    LOD1 — 50% polygons (medium)
		    LOD2 — 25% polygons (far)
		    LOD3 — Billboard/impostor (very far)
		  
		  AI LOD:
		    Close  — Full behavior tree, pathfinding
		    Medium — Simplified state machine
		    Far    — Frozen / sleeping
		  
		  Shadow LOD:
		    Close  — High-res shadow map
		    Far    — No shadow or baked only
		  ```
-
- # Advanced Rendering Topics
  collapsed:: true
	- ## Post-Processing Effects
	  collapsed:: true
		- ```
		  Tone Mapping     — Map HDR values to LDR display range
		                     (Reinhard, ACES Filmic, Uncharted 2)
		  Bloom            — Glow around bright areas (threshold + blur)
		  Depth of Field   — Blur based on distance from focus plane
		  Motion Blur      — Blur in direction of movement
		  SSAO             — Screen-space ambient occlusion (crevice darkening)
		  SSR              — Screen-space reflections
		  Chromatic Aberration — RGB channel offset (lens distortion)
		  Vignette         — Darken screen edges
		  Color Grading    — LUT (Look-Up Table) color correction
		  Anti-Aliasing    — Smooth jagged edges (MSAA, TAA, FXAA, DLAA)
		  ```
	-
	- ## Anti-Aliasing Techniques
	  collapsed:: true
		- ```
		  MSAA (Multisample AA)  — Supersample at triangle edges. High quality, expensive.
		  FXAA (Fast Approx AA) — Post-process blur. Fast, blurry.
		  TAA  (Temporal AA)    — Accumulate samples over frames. Sharp, ghosting issues.
		  SMAA (Subpixel Morph) — Edge detection + blending. Good quality/cost.
		  DLAA (Deep Learning AA) — NVIDIA AI-based. Best quality.
		  DLSS / FSR / XeSS     — AI upscaling: render at lower res, upscale to target.
		  ```
	-
	- ## Upscaling & Reconstruction
	  collapsed:: true
		- ```
		  DLSS (NVIDIA)  — Deep Learning Super Sampling. Render at 50-75%, upscale to 4K.
		  FSR  (AMD)     — FidelityFX Super Resolution. Open source, works on any GPU.
		  XeSS (Intel)   — Xe Super Sampling. AI-based, open source.
		  TSR  (Unreal)  — Temporal Super Resolution. Built into UE5.
		  
		  Quality modes: Ultra Quality → Quality → Balanced → Performance → Ultra Performance
		  ```
	-
	- ## Procedural Generation
	  collapsed:: true
		- ```
		  Noise Functions:
		    Perlin Noise   — Smooth gradient noise. Terrain, clouds.
		    Simplex Noise  — Improved Perlin. Fewer artifacts.
		    Worley Noise   — Cell/Voronoi noise. Stone, water, cells.
		    FBM            — Fractal Brownian Motion: layered octaves of noise.
		  
		  Techniques:
		    Heightmap terrain  — 2D noise → 3D terrain mesh
		    Marching Cubes     — Isosurface extraction (caves, voxel terrain)
		    Wave Function Collapse — Tile-based procedural level generation
		    L-Systems          — Procedural plants and trees
		    Dungeon generation — BSP trees, cellular automata, room placement
		  ```
-
- # Mobile Game Development
  collapsed:: true
	- ## Platform Constraints
	  collapsed:: true
		- ```
		  Touch Controls       — Virtual joysticks, swipe, pinch gestures requiring responsive, clear UI.
		  Mobile Optimization  — Heavy draw call batching, low-poly models, strict texture compression (ASTC).
		  Battery/Thermals     — Thermal throttling mandates strict frame pacing (e.g. locking to 30fps).
		  Platform APIs        — Deep integration with iOS Game Center, Google Play Games, ad networks.
		  Monetization         — Banner ads, Interstitials, Rewarded Video, and compliant In-App Purchases.
		  ```
-
- # VR & AR Development
  collapsed:: true
	- ## Immersive Realities
	  collapsed:: true
		- ```
		  VR SDKs              — OpenXR (multi-vendor standard), SteamVR. Render stereo eyes at 90Hz+.
		  Interaction Design   — 1:1 spatial hand tracking, teleportation logic preventing motion sickness.
		  AR Frameworks        — ARKit (iOS) / ARCore (Android). Plane detection, point clouds, light estimation.
		  ```
-
- # Console Development
  collapsed:: true
	- ## Specialized Hardware
	  collapsed:: true
		- ```
		  SDK Access           — Strict NDA-protected access to proprietary Sony (PS5), MS (GDK), Nintendo SDKs.
		  Certification        — TRC (PlayStation), TCR (Xbox), Lotcheck (Nintendo) are mandatory QA approvals.
		  Optimization         — Targeting fixed hardware profiles allows exact precision memory mapping.
		  ```
-
- # Game Testing & QA
  collapsed:: true
	- ## Testing Methodologies
	  collapsed:: true
		- ```
		  Playtesting          — A/B testing and remote telemetry observing player friction and UI confusion.
		  Bug Tracking         — Reporting through Jira. Includes repro steps, logs, and memory dumps.
		  Automated Testing    — CI/CD pipelines deploying headless clients to stress-test multiplayer servers.
		  Performance Profiling— Deep frame analysis using Unreal Insights, Unity Profiler, RenderDoc.
		  ```
-
- # Game Engines Overview
  collapsed:: true
	- ## Engine Comparison
	  collapsed:: true
		- ```
		  Engine        Language    Best For                    License
		  Godot 4       GDScript/C# 2D/3D indie, open source   MIT (free)
		  Unity         C#          2D/3D, mobile, XR           Free tier + paid
		  Unreal 5      C++/BP      AAA 3D, film, archviz       Free + 5% royalty
		  CryEngine     C++         AAA 3D, High fidelity env   Royalty
		  Lumberyard    C++         AWS Integrated AAA (O3DE)   Open Source
		  GameMaker     GML         Detailed 2D logic setups    Paid
		  RPG Maker     JS/Ruby     JRPG rapid development      Paid
		  Bevy          Rust        ECS-based, systems games     MIT (free)
		  Pygame        Python      2D, learning, prototypes     LGPL (free)
		  ```
	-
	- ## When to Use What
	  collapsed:: true
		- ```
		  Learning game dev?        → Godot (free, simple, great docs)
		  2D mobile game?           → Godot or Unity
		  3D indie game?            → Godot 4 or Unity
		  AAA / photorealistic 3D?  → Unreal Engine 5
		  Rust systems programmer?  → Bevy
		  Python prototype?         → Pygame
		  Custom engine?            → C++ + SDL2/SFML + OpenGL/Vulkan
		  ```
-
- # Libs, Tools & Resources
	- ## Graphics APIs
		- [Vulkan](https://www.vulkan.org/) — Low-level GPU API. Maximum control and performance.
		- [OpenGL](https://www.opengl.org/) — Classic cross-platform GPU API. Good for learning.
		- [DirectX 12](https://learn.microsoft.com/en-us/windows/win32/direct3d12/direct3d-12-graphics) — Windows/Xbox GPU API.
		- [Metal](https://developer.apple.com/metal/) — Apple GPU API (macOS/iOS).
		- [WebGPU](https://www.w3.org/TR/webgpu/) — Modern GPU API for the web.
	-
	- ## Math Libraries
		- [GLM](https://github.com/g-truc/glm) — OpenGL Mathematics. Vectors, matrices, quaternions for C++.
		- [Eigen](https://eigen.tuxfamily.org/) — Linear algebra for C++.
	-
	- ## Physics Libraries
		- [Bullet Physics](https://github.com/bulletphysics/bullet3) — Open source 3D physics (used in Blender, Godot 3).
		- [PhysX (NVIDIA)](https://github.com/NVIDIA-Omniverse/PhysX) — Used in Unity, Unreal.
		- [Box2D](https://box2d.org/) — 2D physics. Used in many indie games.
		- [Jolt Physics](https://github.com/jrouwe/JoltPhysics) — Modern C++ physics (used in Godot 4).
	-
	- ## Learning Resources
		- [Game Programming Patterns](https://gameprogrammingpatterns.com/) — Free book on game design patterns.
		- [Real-Time Rendering](https://www.realtimerendering.com/) — The definitive rendering textbook.
		- [LearnOpenGL](https://learnopengl.com/) — OpenGL + graphics fundamentals.
		- [Vulkan Tutorial](https://vulkan-tutorial.com/) — Step-by-step Vulkan guide.
		- [The Cherno (YouTube)](https://www.youtube.com/@TheCherno) — Game engine from scratch in C++.
	-
-