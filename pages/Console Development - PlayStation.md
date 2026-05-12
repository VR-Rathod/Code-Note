---
seoTitle: PlayStation SDK Development – PS4/PS5 Developer Guide
description: "Complete PlayStation development guide covering PS5/PS4 architecture, GNM/GNMX graphics API, memory pools, DualSense haptics, Razor profiling, Trophy system, and PS5 SSD streaming."
keywords: "PlayStation SDK, PS5 development, PS4 development, GNM, GNMX, Razor profiler, DualSense haptics, adaptive triggers, Trophy system, console development, VR-Rathod"
displayTitle: Console Development - PlayStation
---

> [!info] About This Page
> Covers **PlayStation 4 and PlayStation 5** console development.
> Main page: [[Console Development]]. See also: [[Console Development - Xbox]], [[Console Development - Nintendo Switch]], [[Console Development - Certification]].

> [!warning] NDA Notice
> Official PlayStation SDK details are under NDA. This page covers **publicly documented** features, architecture concepts, and general best practices from GDC talks, official PS5 hardware documentation, and open resources.

- # PlayStation Architecture
  collapsed:: true
	- ## PS5 Hardware Deep Dive
	  collapsed:: true
		- ```
		  PS5 Custom Silicon (AMD "Oberon"):
		  
		  CPU:
		    8 × AMD Zen 2 cores @ 3.5 GHz (variable, 2.23 GHz min)
		    SMT (Hyper-Threading) enabled — 16 logical threads
		    L3 cache: 32 MB
		  
		  GPU:
		    36 Compute Units @ 2.23 GHz
		    10.3 TFLOPS FP32 performance
		    RDNA 2 architecture
		    Hardware Ray Tracing (BVH traversal in hardware)
		    Mesh Shaders
		    Variable Rate Shading (VRS)
		    Sampler Feedback
		  
		  Memory:
		    16 GB GDDR6 @ 448 GB/s
		    ~14 GB available to developers (OS uses ~2 GB)
		    Unified memory — CPU and GPU share the same pool
		    No separate VRAM — unified architecture
		  
		  Storage:
		    Custom NVMe SSD: 5.5 GB/s raw read speed
		    ~8–9 GB/s with built-in Kraken decompression
		    Hardware decompression coprocessor (runs in parallel with CPU/GPU)
		  
		  Audio:
		    Tempest 3D Audio Engine (custom audio DSP)
		    3D positional audio without CPU cost
		    HRTF-based spatial audio for headphones and TV
		  ```
	-
	- ## PS5 vs PS4 Key Differences
	  collapsed:: true
		- | Feature | PS4 | PS4 Pro | PS5 |
		  |---------|-----|---------|-----|
		  | CPU | 8-core Jaguar 1.6 GHz | 8-core Jaguar 2.1 GHz | 8-core Zen 2 3.5 GHz |
		  | GPU | 1.84 TFLOPS GCN | 4.2 TFLOPS GCN | 10.3 TFLOPS RDNA 2 |
		  | RAM | 8 GB GDDR5 | 8 GB GDDR5 | 16 GB GDDR6 |
		  | SSD Speed | HDD ~100 MB/s | HDD ~100 MB/s | 5,500 MB/s |
		  | Ray Tracing | None | None | Hardware RT |
		  | DualShock | DualShock 4 | DualShock 4 | DualSense |
	-
	- ## PS5 Memory Architecture
	  collapsed:: true
		- ```
		  PS5 Unified Memory Pools:
		  
		  GPU Main Pool (~10 GB recommended for GPU assets):
		    Textures, render targets, meshes, shaders
		    High-bandwidth — 448 GB/s access
		    Allocated via GNM memory allocator
		  
		  CPU/GPU Shared Pool (~4 GB):
		    Game logic data, audio, streaming buffers
		    Accessible by both CPU and GPU
		    Lower bandwidth than pure GPU pool
		  
		  Flexible Memory:
		    PS5 allows dynamic reallocation between pools
		    Useful for streaming — free CPU data once GPU loaded
		  
		  Memory Budget Breakdown (example 3D game):
		    Textures (streaming)     3,500 MB
		    Render targets           1,200 MB
		    Geometry buffers           800 MB
		    Audio streaming            256 MB
		    Game simulation data     1,000 MB
		    Constant buffers           128 MB
		    OS / drivers             2,048 MB
		    TOTAL                  ~ 8,932 MB (safe under 14 GB)
		  ```
-
- # PlayStation Graphics API
  collapsed:: true
	- ## GNM / GNMX Overview
		- ```
		  PlayStation uses a proprietary graphics API:
		  
		  GNM  — Low-level GPU API (explicit, like Vulkan)
		    Direct GPU command buffer writing
		    No driver overhead
		    Maximum performance
		    Steep learning curve
		  
		  GNMX — Higher-level wrapper over GNM
		    Handles common patterns automatically
		    Closer to DirectX 12 / Vulkan in feel
		    Used by most PS5 titles
		  
		  Gnm::ShaderBinary  — Compiled shader object
		  Gnm::Buffer        — GPU buffer resource
		  Gnm::Texture       — Texture resource
		  Gnm::RenderTarget  — Framebuffer output
		  Gnm::DrawCommandBuffer — GPU command list
		  ```
		- ```cpp
		  // Conceptual GNMX pipeline setup (structure, not actual SDK)
		  
		  // 1. Create command buffer
		  sce::Gnmx::GfxContext gfxContext;
		  gfxContext.init(commandBuffer, commandBufferSize);
		  
		  // 2. Set pipeline state
		  gfxContext.setActiveShaderStages(
		      sce::Gnm::kActiveShaderStagesVsPs);
		  
		  // 3. Bind vertex shader
		  sce::Gnmx::ShaderInfo vsInfo;
		  vsInfo.init(&myVertexShader, sizeof(myVertexShader));
		  gfxContext.setVsShader(vsInfo.m_shader, vsInfo.m_offsetInDwords);
		  
		  // 4. Set vertex buffer
		  sce::Gnm::Buffer vertexBuffer;
		  vertexBuffer.initAsVertexBuffer(
		      vertexData, sce::Gnm::kDataFormatR32G32B32Float, stride, count);
		  gfxContext.setVertexBuffers(
		      sce::Gnm::kShaderStageVs, 0, 1, &vertexBuffer);
		  
		  // 5. Draw
		  gfxContext.drawIndex(indexCount, indexData);
		  
		  // 6. Submit to GPU
		  sce::Gnm::submitCommandBuffers(1, &gfxContext.m_dcb.m_beginptr, ...);
		  ```
	-
	- ## PSSL — PlayStation Shading Language
	  collapsed:: true
		- ```hlsl
		  // PSSL is HLSL-compatible — DirectX shader devs feel at home
		  
		  // Vertex Shader
		  struct VS_INPUT {
		      float4 position : POSITION;
		      float3 normal   : NORMAL;
		      float2 texCoord : TEXCOORD0;
		  };
		  
		  struct VS_OUTPUT {
		      float4 position : S_POSITION;
		      float3 normal   : TEXCOORD0;
		      float2 texCoord : TEXCOORD1;
		  };
		  
		  cbuffer Transform : register(b0) {
		      float4x4 worldViewProj;
		      float4x4 world;
		  };
		  
		  VS_OUTPUT main(VS_INPUT input) {
		      VS_OUTPUT output;
		      output.position = mul(worldViewProj, input.position);
		      output.normal   = mul((float3x3)world, input.normal);
		      output.texCoord = input.texCoord;
		      return output;
		  }
		  
		  // Fragment (Pixel) Shader
		  Texture2D albedoTex : register(t0);
		  SamplerState linearSampler : register(s0);
		  
		  float4 main(VS_OUTPUT input) : S_TARGET_OUTPUT {
		      float3 color = albedoTex.Sample(linearSampler, input.texCoord).rgb;
		      // Simple diffuse lighting
		      float3 lightDir = normalize(float3(0.5, 1.0, 0.5));
		      float  diff     = max(dot(normalize(input.normal), lightDir), 0.0);
		      return float4(color * diff, 1.0);
		  }
		  ```
	-
	- ## PS5 Mesh Shaders
	  collapsed:: true
		- ```hlsl
		  // Mesh Shaders replace Vertex + Geometry pipeline
		  // Better for complex geometry (vegetation, LODs, culling)
		  
		  // Task Shader (Amplification) — runs per meshlet group
		  [numthreads(32, 1, 1)]
		  void taskMain(
		      uint3 dispatchID : SV_DispatchThreadID,
		      out TaskOutput taskOutput)
		  {
		      // Frustum cull meshlets before mesh shader runs
		      bool visible = IsVisible(dispatchID.x);
		      taskOutput.dispatchGrid = visible ? 1 : 0;
		  }
		  
		  // Mesh Shader — replaces vertex shader
		  [outputtopology("triangle")]
		  [numthreads(64, 1, 1)]
		  void meshMain(
		      uint3 threadID : SV_DispatchThreadID,
		      out vertices MeshVertex verts[64],
		      out indices  uint3      tris[126])
		  {
		      // Process one meshlet (64 verts, 126 triangles max)
		      verts[threadID.x].position = TransformVertex(threadID.x);
		      if (threadID.x < 126)
		          tris[threadID.x] = GetTriangle(threadID.x);
		  }
		  ```
	-
	- ## PS5 Ray Tracing
	  collapsed:: true
		- ```
		  PS5 Hardware Ray Tracing:
		    BVH traversal accelerated in hardware (RDNA 2 RT units)
		    Ray Box intersection — hardware
		    Ray Triangle intersection — hardware
		    Shading — programmable (PSSL shader)
		  
		  Common RT uses on PS5:
		    Reflections    — replace screen-space reflections (SSR)
		    Shadows        — soft shadows from area lights
		    Ambient Occlusion — replace SSAO
		    Global Illumination — supplement baked lighting
		  
		  Performance targets:
		    Reflection rays:  1 ray per pixel @ 1080p upscaled to 4K
		    Shadow rays:      0.25 rays per pixel (quarter-res, denoised)
		    Full path trace:  Not viable in real-time on current gen
		  
		  PS5 RT API flow (concept):
		    1. Build BVH from scene geometry (BLAS per mesh, TLAS per scene)
		    2. Set RT pipeline (ray gen, closest hit, miss, any hit shaders)
		    3. Bind acceleration structure
		    4. DispatchRays(width, height, depth)
		    5. Denoise output (temporal accumulation, SVGF)
		  ```
-
- # PS5 SSD & Streaming
  collapsed:: true
	- ## I/O Architecture
	  collapsed:: true
		- ```
		  PS5 Custom I/O Stack:
		  
		  Physical SSD → Crypto Engine → Kraken Decompressor → RAM
		                                       ↓
		                               Decompressed directly to GPU
		                               (no CPU involved in I/O path!)
		  
		  Key numbers:
		    Raw read:         5.5 GB/s
		    Compressed read:  ~8-9 GB/s (2:1 ratio typical game data)
		    Decompressor:     Hardware coprocessor, 0 CPU cost
		  
		  Practical impact:
		    A 100 MB level chunk loads in ~18ms at raw speed
		    No loading screens between areas if designed for streaming
		    Texture streaming at full 4K quality without pre-baked workarounds
		  ```
		- ```cpp
		  // PS5 File I/O — conceptual async file read pattern
		  
		  // 1. Open file
		  SceNpFile* fileHandle = nullptr;
		  sceNpFsOpen("/hostapp/levels/level01.pak", 
		              SCE_NP_FS_O_RDONLY, &fileHandle);
		  
		  // 2. Async read directly to GPU memory
		  SceNpFsReadRequest request;
		  request.buf    = gpuMemoryPtr;  // Direct to GPU — no CPU copy!
		  request.nbytes = fileSize;
		  request.offset = 0;
		  
		  SceNpFsIoRequest ioReq;
		  sceNpFsReadAsync(fileHandle, &request, &ioReq);
		  
		  // 3. Do other work while loading...
		  
		  // 4. Wait for completion
		  SceNpFsIoResult result;
		  sceNpFsWaitIoRequest(&ioReq, &result);
		  
		  // 5. Asset is now in GPU memory — draw it
		  ```
	-
	- ## Streaming Strategy
	  collapsed:: true
		- ```
		  Asset streaming best practices for PS5:
		  
		  1. Virtual Geometry (Nanite-style):
		     Stream geometry at multiple LODs
		     PS5 SSD speed makes this practical
		     Eliminate pop-in by loading at travel speed
		  
		  2. Virtual Textures:
		     Only load visible texture tiles
		     PS5 Sampler Feedback identifies needed tiles
		     Reduces texture memory from 10 GB to 2–3 GB
		  
		  3. Audio Streaming:
		     Never load full music tracks — stream from SSD
		     ~5-10 MB/s for high-quality stereo audio
		     Tiny fraction of SSD bandwidth
		  
		  4. Level Streaming:
		     Async load next level chunks as player approaches boundaries
		     Target: load chunk in < 30ms (invisible to player)
		     PS5 SSD makes this realistic without LOD degradation
		  ```
-
- # DualSense Controller
  collapsed:: true
	- ## Haptic Feedback System
	  collapsed:: true
		- ```
		  DualSense uses voice-coil actuators (not standard rumble motors):
		  
		  Standard Rumble (PS4 DualShock 4):
		    Two vibration motors — rough on/off vibration
		    Low frequency (whole controller shakes)
		  
		  DualSense HD Rumble:
		    Two high-precision voice coil actuators
		    Frequency range: 5 Hz to 300 Hz
		    Create texture sensations, not just rumble
		    Left and right actuators controlled independently
		  
		  Haptic examples:
		    Walking on grass: soft, random low-frequency pulses
		    Walking on gravel: irregular high-frequency crunch pattern
		    Rain on surface: rapid, dense high-frequency patter
		    Heartbeat: rhythmic thump at actual heart rate BPM
		    UI hover: single sharp tap (like clicking a physical button)
		  ```
		- ```cpp
		  // DualSense haptics — conceptual C++ usage
		  
		  // Simple haptic impulse
		  ScePadVibrationParam vibration;
		  vibration.largeMotor = 180;  // 0-255 intensity
		  vibration.smallMotor = 100;  // 0-255 intensity
		  scePadSetVibration(padHandle, &vibration);
		  
		  // Audio-based haptics (advanced — trigger from audio waveform)
		  ScePadAudioOutParam audioHaptic;
		  audioHaptic.hapticIntensity = 255;
		  audioHaptic.outputBuffer    = hapticWaveformData;
		  audioHaptic.size            = waveformSize;
		  scePadSetAudioOut(padHandle, &audioHaptic);
		  
		  // Stop vibration
		  ScePadVibrationParam stopVibration = {0, 0};
		  scePadSetVibration(padHandle, &stopVibration);
		  ```
	-
	- ## Adaptive Triggers
	  collapsed:: true
		- ```
		  Trigger modes:
		  
		  Off:
		    No resistance — trigger moves freely
		  
		  Feedback:
		    Vibrate at a specific trigger position
		    Parameters: start position, strength
		  
		  Weapon (Rigid):
		    Resist from start position until threshold, then release
		    Simulates: bow draw, spring compression, gun trigger
		    Parameters: start position, end position (snap point)
		  
		  Vibration:
		    Continuous vibration at specified frequency
		    Simulates: engine vibration, electrical buzz
		  
		  Multiple Positions:
		    Set resistance at multiple points along trigger travel
		    Complex feedback for simulating textured surfaces
		  ```
		- ```cpp
		  // Adaptive trigger — bow draw example (conceptual)
		  
		  ScePadTriggerEffectParam triggerParam;
		  memset(&triggerParam, 0, sizeof(triggerParam));
		  
		  // Right trigger = pull bow
		  triggerParam.triggerMask = SCE_PAD_TRIGGER_EFFECT_TRIGGER_MASK_R2;
		  triggerParam.command[SCE_PAD_TRIGGER_EFFECT_PARAM_INDEX_FOR_R2]
		      .mode = SCE_PAD_TRIGGER_EFFECT_MODE_WEAPON;
		  triggerParam.command[SCE_PAD_TRIGGER_EFFECT_PARAM_INDEX_FOR_R2]
		      .commandData.weaponParam.startPosition = 10; // 0-9
		  triggerParam.command[SCE_PAD_TRIGGER_EFFECT_PARAM_INDEX_FOR_R2]
		      .commandData.weaponParam.endPosition   = 80; // 0-9
		  triggerParam.command[SCE_PAD_TRIGGER_EFFECT_PARAM_INDEX_FOR_R2]
		      .commandData.weaponParam.strength[0]   = 5;  // 0-8
		  
		  scePadSetTriggerEffect(padHandle, &triggerParam);
		  ```
-
- # Trophy System
  collapsed:: true
	- ## Trophy Types & Structure
	  collapsed:: true
		- | Trophy | Icon | Points (PSN) | Notes |
		  |--------|------|-------------|-------|
		  | Bronze | 🥉 | 15 | Most common |
		  | Silver | 🥈 | 30 | Mid-tier challenges |
		  | Gold | 🥇 | 90 | Major milestones |
		  | Platinum | 🏆 | 180 | Earn all other trophies |
		- ```
		  Trophy set requirements:
		    Every PS4/PS5 game MUST have at least one trophy set
		    Must include one Platinum trophy (if 2+ gold trophies)
		    Maximum 100 trophies per set (base game)
		    DLC can add additional trophy sets
		    Total value determines game's PSN Level contribution
		  
		  Good trophy design:
		    Story trophies: awarded for completing major story beats
		    Exploration: find all collectibles, discover all areas
		    Challenge: complete game on hardest difficulty
		    Mastery: max out a character, craft all items
		    Humor: find the developer Easter egg, die 100 times
		    
		  Poor trophy design (avoid):
		    Online-only trophies (online servers may go offline)
		    Missable trophies with no workaround
		    Grind trophies requiring 100+ hours of repetitive play
		  ```
	-
	- ## Trophy Implementation
	  collapsed:: true
		- ```cpp
		  // Trophy unlock — conceptual flow
		  
		  // 1. Initialize trophy system at game start
		  SceNpTrophyContext trophyContext;
		  SceNpTrophyHandle  trophyHandle;
		  
		  sceNpTrophyCreateContext(
		      &trophyContext, userId, serviceLabel, 0);
		  sceNpTrophyCreateHandle(&trophyHandle);
		  
		  // 2. Register trophies (reads TROPHY.TRP file)
		  sceNpTrophyRegisterContext(
		      trophyContext, trophyHandle, 0);
		  
		  // 3. Unlock trophy when condition met
		  void UnlockTrophy(int trophyId) {
		      SceNpTrophyId id = trophyId;
		      SceNpTrophyId platinumId;
		      
		      // Returns platinum ID if this unlock earns the platinum
		      SceInt32 result = sceNpTrophyUnlockTrophy(
		          trophyContext, trophyHandle, id, &platinumId);
		      
		      if (result == SCE_OK) {
		          if (platinumId != SCE_NP_TROPHY_INVALID_TROPHY_ID) {
		              // Player also earned platinum!
		              ShowPlatinumNotification();
		          }
		      }
		  }
		  
		  // Call when player finishes first level:
		  UnlockTrophy(TROPHY_FIRST_LEVEL_COMPLETE);
		  ```
-
- # Razor Profiler
  collapsed:: true
	- ## What is Razor?
	  collapsed:: true
		- ```
		  Razor is PlayStation's official GPU profiler for PS4/PS5.
		  
		  Key features:
		    GPU Timeline — see every draw call on a frame timeline
		    Hardware Counters — GPU utilization %, cache hit rates
		    Memory Tracker — see all GPU allocations live
		    Shader Inspector — see compiled shader stats (ALU ops, registers)
		    Snapshot mode — capture single frames for deep analysis
		  
		  Workflow:
		    1. Run game on dev kit with Razor target process
		    2. Connect PC Razor client to dev kit over network
		    3. Press capture button — freezes one frame
		    4. Analyze draw call order, shader costs, memory
		    5. Identify bottleneck (vertex bound? pixel bound? bandwidth?)
		  
		  Common findings:
		    Too many small draw calls → batch or use instancing
		    Shader ALU bound → simplify shader math
		    Texture bandwidth bound → use compressed formats, mipmaps
		    Depth buffer overdraw → add depth prepass
		  ```
	-
	- ## GPU Bottleneck Identification
	  collapsed:: true
		- ```
		  How to identify what's limiting your frame:
		  
		  Vertex Bound:
		    Symptom: Reducing polygon count improves FPS dramatically
		    Fix: LOD system, mesh simplification, instancing
		  
		  Pixel / Fragment Bound:
		    Symptom: Reducing resolution significantly improves FPS
		    Fix: Simplify pixel shaders, reduce overdraw, use depth prepass
		  
		  Bandwidth Bound:
		    Symptom: Reducing texture resolution helps more than shader math
		    Fix: Texture compression (BC7/ASTC), mipmaps, texture atlases
		  
		  Compute Bound:
		    Symptom: Removing complex post-processing helps
		    Fix: Move to async compute, simplify effects, use approximations
		  
		  PS5 Tiled Architecture:
		    GPU processes image in tiles — data fits in on-chip memory
		    Avoid clearing render targets with clear color mid-pass
		    Use STORE_ACTION_NONE when RT not needed after pass
		  ```
-
- # PS5 Development in Unity & Unreal
  collapsed:: true
	- ## Unity on PS5
	  collapsed:: true
		- ```
		  Unity PS5 requirements:
		    Unity 2021.3+ with PS5 build support package
		    PlayStation Partner account + SDK
		    PS5 GDK development environment
		  
		  PS5-specific Unity features:
		    Adaptive Trigger API    — Haptics.SetTriggerEffect()
		    DualSense Haptics API  — Haptics.Play()
		    Tempest 3D Audio       — AudioListener.spatializePostEffects
		    PS5 Trophy Service     — PS5Trophy.UnlockTrophy()
		    Activity Cards         — in-game help cards in PS5 UI
		    Game Help system       — hint videos shown from PS5 home menu
		  
		  Unity PS5 Build:
		    Build target: PS5 (appears after SDK installation)
		    Output: .pkg file (PlayStation package)
		    Install to dev kit via Neighbourhood tool or USB
		  ```
	-
	- ## Unreal Engine on PS5
	  collapsed:: true
		- ```
		  Unreal Engine 5 on PS5:
		    Nanite — virtual geometry, works excellently with PS5 SSD
		    Lumen — dynamic GI, runs at 30 FPS on PS5, 60 FPS in perf mode
		    Chaos Physics — multi-threaded, uses all 8 Zen 2 cores
		    MetaSounds — audio system, leverages Tempest 3D audio
		  
		  PS5-specific UE5 features:
		    DualSense plugin — adaptive triggers, haptics
		    PS5 Activity plugin — Activity Cards support
		    Console-specific rendering paths — auto-configures for PS5 GPU
		    Platform SDH — Sony development hardware integration
		  
		  UE5 PS5 Build:
		    Target platform: PS5
		    Uses GNM/GNMX via UE5 RHI (Rendering Hardware Interface)
		    Packaging creates .pkg via PlayStation SDK tools
		  ```