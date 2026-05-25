---
seoTitle: Nintendo Switch SDK Development – Complete Switch Developer Guide
description: "Complete Nintendo Switch development guide covering Switch hardware, docked/handheld modes, NVN API, Joy-Con input, memory budget, performance optimization, and battery management."
keywords: "Nintendo Switch SDK, Switch development, NVN API, Joy-Con, handheld mode, docked mode, Switch optimization, Switch memory, NintendoSDK, console development, VR-Rathod"
displayTitle: Console Development - Nintendo Switch
---

> [!info] About This Page
> Covers **Nintendo Switch, Switch Lite, Switch OLED, and Switch 2** development.
> Main page: [[Console Development]]. See also: [[Console Development - PlayStation]], [[Console Development - Xbox]], [[Console Development - Certification]].

> [!warning] NDA Notice
> Nintendo's SDK is among the most strictly NDA-protected. This page covers **publicly documented** hardware specs, general architecture concepts, open-source community findings (libnx), and public GDC/NDC talks.

- # Nintendo Switch Hardware
  collapsed:: true
	- ## Switch Architecture
	  collapsed:: true
		- ```
		  Nintendo Switch Custom SoC: NVIDIA Tegra X1 (modified)
		  
		  CPU:
		    4 × ARM Cortex-A57 @ 1.02 GHz (handheld)
		    4 × ARM Cortex-A57 @ 1.785 GHz (docked)
		    4 × ARM Cortex-A53 (low-power cores, OS/background use)
		    Note: Switch uses "big.LITTLE" but game runs only on A57 cores
		  
		  GPU:
		    NVIDIA Maxwell architecture
		    256 CUDA cores
		    Handheld: 307.2 MHz = ~157 GFLOPS
		    Docked:   768 MHz  = ~393 GFLOPS
		    Compare: PS5 = 10,300 GFLOPS (26× more powerful)
		  
		  Memory:
		    4 GB LPDDR4X
		    OS reserves ~800 MB–1 GB
		    Available to game: ~3 GB
		    CRITICAL: CPU and GPU share this same 4 GB pool
		    No dedicated VRAM — unified memory architecture
		  
		  Storage:
		    Internal: 32 GB (OG), 64 GB (OLED) — game install targets
		    microSD: up to 2 TB supported
		    Transfer speed: microSD is slow — load-time impact!
		    Game card (cartridge): read-only, game media
		  
		  Battery:
		    Switch OG/Lite: ~4.5–9 hours (game-dependent)
		    Switch OLED: ~4.5–9 hours
		    Charging via USB-C (18W)
		    Heavy games drain faster — optimize for battery life
		  ```
	-
	- ## Switch Lite vs Switch OLED vs Switch 2
	  collapsed:: true
		- | Feature | Switch Lite | Switch OLED | Switch 2 |
		  |---------|-------------|-------------|---------|
		  | Docked Mode | ❌ (handheld only) | ✅ | ✅ |
		  | CPU | Same Tegra X1 | Same Tegra X1 | ARM Cortex-A78 (×?) |
		  | GPU | Maxwell (lower clocks) | Maxwell | NVIDIA Ampere |
		  | RAM | 4 GB | 4 GB | 12 GB |
		  | Screen | 5.5" LCD | 7" OLED | 8" LCD |
		  | Joy-Con | Integrated | Detachable | New Joy-Con 2 |
		  | Target | Handheld only | Handheld + TV | Handheld + TV |
		- > [!tip] Switch 2 (2025)
		  > Nintendo Switch 2 launched in 2025 with dramatically improved hardware. DLSS upscaling is a key feature — games can render at lower resolution and upscale to 1080p/4K. Backward compatible with Switch 1 cards.
	-
	- ## Docked vs Handheld Mode
	  collapsed:: true
		- | Setting | Handheld | Docked |
		  |---------|----------|--------|
		  | CPU | 1.02 GHz | 1.785 GHz |
		  | GPU | 307 MHz | 768 MHz |
		  | GPU Perf | ~157 GFLOPS | ~393 GFLOPS |
		  | Target Res | 720p (1280×720) | 1080p (1920×1080) |
		  | Battery | Yes — must consider | No limit |
		  | Target FPS | 30 FPS minimum | 30 or 60 FPS |
		- ```
		  Mode detection and adaptation:
		    AppletQuerySystemSharedMemoryHandle() — system info
		    AppletGetOperationMode() — returns Handheld or Console (docked)
		    Register for mode change callback — fires when player docks/undocks
		  
		  What to change on mode switch:
		    Resolution    — dynamic resolution budget up/down
		    Shadow quality — higher shadows when docked
		    Draw distance — increase in docked mode
		    Texture LOD   — bias toward higher quality docked
		    Anti-aliasing — SMAA/TAA in docked, simpler in handheld
		    Frame target  — 30 FPS always, or 60 FPS in docked only
		  ```
-
- # Switch Graphics API (NVN)
  collapsed:: true
	- ## What is NVN?
	  collapsed:: true
		- ```
		  NVN = NVIDIA Native API for Switch
		  
		  NVN is NVIDIA's proprietary low-level GPU API for Switch.
		  Similar to Vulkan in design philosophy but Switch-specific.
		  
		  NVN levels:
		    NVN (low-level) — explicit GPU control, maximum performance
		    
		  Alternatively, engines can use:
		    OpenGL ES 3.2 — available on Switch, simpler but slower
		    Vulkan         — available via NVN Vulkan driver
		  
		  Key NVN concepts:
		    NvnDevice        — GPU device
		    NvnQueue         — submission queue (graphics, compute, copy)
		    NvnCommandBuffer — recorded GPU commands
		    NvnBuffer        — GPU memory buffer
		    NvnTexture       — texture resource
		    NvnProgram       — compiled shader program
		    NvnSync          — GPU/CPU synchronization primitive
		  ```
		- ```c++
		  // NVN conceptual setup (structure, not actual SDK — NDA)
		  
		  // 1. Initialize device
		  NvnDevice device;
		  NvnDeviceBuilder deviceBuilder;
		  nvnDeviceBuilderSetDefaults(&deviceBuilder);
		  nvnDeviceInitialize(&device, &deviceBuilder);
		  
		  // 2. Create queue
		  NvnQueue queue;
		  NvnQueueBuilder queueBuilder;
		  nvnQueueBuilderSetDefaults(&queueBuilder);
		  nvnQueueInitialize(&queue, &device, &queueBuilder);
		  
		  // 3. Create command buffer
		  NvnCommandBuffer cmdBuf;
		  nvnCommandBufferInitialize(&cmdBuf, &device);
		  
		  // 4. Record commands
		  nvnCommandBufferBeginRecording(&cmdBuf);
		      nvnCommandBufferBindVertexBuffer(&cmdBuf, 0, vboAddr, stride);
		      nvnCommandBufferDrawArrays(&cmdBuf, NvnDrawPrimitive_Triangles,
		                                 0, vertexCount);
		  nvnCommandBufferEndRecording(&cmdBuf);
		  
		  // 5. Submit
		  NvnCommandHandle handle = nvnCommandBufferGetCommandHandle(&cmdBuf);
		  nvnQueueSubmitCommands(&queue, 1, &handle);
		  nvnQueueFlush(&queue);
		  ```
	-
	- ## Switch Shaders (GLSL)
	  collapsed:: true
		- ```glsl
		  // Switch supports GLSL (OpenGL-style shaders via NVN)
		  // Compiled offline to SPIR-V → then to Maxwell ISA
		  
		  // Vertex Shader
		  #version 450
		  
		  layout(location = 0) in vec3 in_position;
		  layout(location = 1) in vec2 in_texCoord;
		  layout(location = 2) in vec3 in_normal;
		  
		  layout(location = 0) out vec2 frag_texCoord;
		  layout(location = 1) out vec3 frag_normal;
		  
		  layout(binding = 0) uniform Transform {
		      mat4 mvp;
		      mat4 normalMatrix;
		  } ubo;
		  
		  void main() {
		      gl_Position   = ubo.mvp * vec4(in_position, 1.0);
		      frag_texCoord = in_texCoord;
		      frag_normal   = mat3(ubo.normalMatrix) * in_normal;
		  }
		  
		  // Fragment Shader
		  #version 450
		  
		  layout(location = 0) in vec2 frag_texCoord;
		  layout(location = 1) in vec3 frag_normal;
		  layout(location = 0) out vec4 out_color;
		  
		  layout(binding = 1) uniform sampler2D albedoMap;
		  
		  void main() {
		      vec3 color   = texture(albedoMap, frag_texCoord).rgb;
		      vec3 light   = normalize(vec3(0.5, 1.0, 0.5));
		      float diff   = max(dot(normalize(frag_normal), light), 0.15);
		      out_color    = vec4(color * diff, 1.0);
		  }
		  ```
	-
	- ## Switch Tiled Rendering
	  collapsed:: true
		- ```
		  Maxwell GPU uses Tiled Rendering:
		    Screen divided into 16×16 pixel tiles
		    Each tile rendered entirely in on-chip SRAM (L2 cache)
		    Reduces DRAM bandwidth dramatically
		  
		  Implications for developers:
		    Avoid mid-pass render target reads (breaks tile cache)
		    Use LOAD_OP_DONT_CARE when clearing (saves bandwidth)
		    Use STORE_OP_DONT_CARE when RT not needed after pass
		    Minimize render target count (less cache pressure)
		  
		  Optimal rendering order:
		    1. Depth prepass (fill depth buffer, no color)
		    2. Opaque geometry (full PBR — depth tested)
		    3. Post processing (read depth, output color)
		    4. Transparent geometry (back to front, no depth write)
		    5. UI (no depth test)
		  ```
-
- # Memory Management on Switch
  collapsed:: true
	- ## Memory Budget
	  collapsed:: true
		- ```
		  Total RAM: 4 GB LPDDR4X
		  OS + System: ~800 MB - 1 GB
		  Available to game: ~3 GB - 3.2 GB
		  
		  Example budget for a 3D game:
		    Textures (streaming)     800 MB   (25%)
		    Geometry buffers         256 MB   (8%)
		    Render targets           128 MB   (4%)
		    Audio buffers            128 MB   (4%)
		    Game simulation data     512 MB   (16%)
		    Code + stack             256 MB   (8%)
		    Misc + safety margin     256 MB   (8%)
		    OS reserved            1,000 MB   (31%)
		    TOTAL                  3,336 MB   ≈ 3.2 GB
		  
		  Switch texture limits (practical):
		    Max texture resolution: 2048×2048 (avoid 4096 entirely)
		    Use ASTC 4x4 compression — 75% size reduction
		    Mipmap everything — saves cache pressure
		    Texture atlas where possible — fewer binds
		  ```
		- > [!warning] 4096 Textures on Switch
		  > A single 4096×4096 RGBA uncompressed texture = 64 MB.
		  > With ASTC 6x6 compression = 8 MB.
		  > Even one uncompressed 4K texture can blow your entire texture budget.
		  > **Always use ASTC compression on Switch.**
	-
	- ## Texture Compression: ASTC
	  collapsed:: true
		- | ASTC Block Size | Bits/pixel | Compression Ratio | Use Case |
		  |-----------------|------------|-------------------|----------|
		  | 4×4 | 8.0 | 4:1 | Normal maps, detailed textures |
		  | 6×6 | 3.56 | 9:1 | Diffuse maps, general textures |
		  | 8×8 | 2.0 | 16:1 | Distant terrain, low-detail |
		  | 12×12 | 0.89 | 36:1 | Skyboxes, very low detail |
		- ```
		  ASTC on Switch (Maxwell supports it natively):
		    Decompress in hardware — zero CPU cost
		    Use 4x4 for: normal maps, alpha-heavy textures
		    Use 6x6 for: albedo, roughness, metallic
		    Use 8x8 for: lightmaps, sky, terrain blend maps
		    
		  Compression tools:
		    ARM ASTC Encoder (astcenc) — reference encoder
		    NVIDIA Texture Tools — fast GPU-accelerated encoder
		    Compressonator (AMD) — batch compress whole project
		    
		  Command line:
		    astcenc -cl input.png output.astc 6x6 -medium
		  ```
	-
	- ## Memory Allocation Strategy
	  collapsed:: true
		- ```c++
		  // Switch memory management — use custom allocators
		  // Nintendo SDK provides heap management tools
		  
		  // Conceptual memory pool setup
		  class SwitchMemoryManager {
		  public:
		      static constexpr size_t TEXTURE_POOL_SIZE = 800 * 1024 * 1024; // 800 MB
		      static constexpr size_t AUDIO_POOL_SIZE   =  64 * 1024 * 1024; //  64 MB
		      static constexpr size_t GAME_POOL_SIZE    = 512 * 1024 * 1024; // 512 MB
		      
		      void Init() {
		          // Allocate large pools upfront — never malloc in game loop
		          m_texturePool = new LinearAllocator(TEXTURE_POOL_SIZE);
		          m_audioPool   = new PoolAllocator(AUDIO_POOL_SIZE, 64);
		          m_gamePool    = new StackAllocator(GAME_POOL_SIZE);
		      }
		      
		      void* AllocTexture(size_t size) {
		          return m_texturePool->Alloc(size, 256); // 256-byte alignment for GPU
		      }
		  };
		  
		  // NEVER do this in a game loop on Switch:
		  // void Update() { auto* obj = new MyObject(); } // heap fragmentation!
		  
		  // DO this instead:
		  // void Update() { auto* obj = gamePool.Alloc<MyObject>(); }
		  ```
-
- # Joy-Con Input
  collapsed:: true
	- ## Input System
	  collapsed:: true
		- ```
		  Switch input configurations:
		  
		  1. Dual Joy-Con (standard):
		     Left + Right Joy-Con together in a grip or separate
		     Full button set, HD Rumble, motion controls
		  
		  2. Single Joy-Con (horizontal):
		     One Joy-Con used sideways — local multiplayer (2 players, 2 Joy-Cons)
		     Limited buttons: 2 face buttons, SL/SR bumpers, one stick
		  
		  3. Pro Controller:
		     Full controller (like Xbox/PlayStation)
		     Best for complex games
		  
		  4. Handheld:
		     Buttons built into console body
		     No gyroscope while docked (held in hands is gyro source)
		  
		  Button layout:
		    A / B / X / Y — face buttons (NOTE: A = right, B = bottom — opposite Xbox!)
		    + / -          — + (start/options), - (select)
		    ZL / ZR        — triggers
		    L / R          — shoulder buttons
		    Left stick     — clickable
		    Right stick    — clickable
		    Directional pad — left Joy-Con only
		  ```
		- > [!important] Button Layout Difference
		  > Switch A/B are swapped vs Xbox A/B.
		  > Nintendo: A = right, B = bottom (confirm/cancel vary by region)
		  > Japan convention: A = confirm, B = cancel
		  > Western convention: B = confirm, A = cancel (same as Xbox muscle memory)
		  > Show correct platform icons — never show Xbox A/B on Switch screens!
	-
	- ## HD Rumble
	  collapsed:: true
		- ```
		  HD Rumble (Switch):
		    Linear Resonant Actuators (LRA) — one in each Joy-Con
		    Precise frequency and amplitude control
		    Famous demo: simulating ice cubes sliding in an empty glass
		    
		  Parameters:
		    Low-frequency amplitude  — 0.0–1.0 (left LRA — "thud")
		    High-frequency amplitude — 0.0–1.0 (right LRA — "buzz/crunch")
		    Low-frequency hz         — 41–626 Hz
		    High-frequency hz        — 82–1253 Hz
		  
		  Examples:
		    Sword hit on stone wall:
		      Low amp: 0.8, Low hz: 160 Hz (impact thud)
		      High amp: 0.3, High hz: 600 Hz (metal scrape)
		    
		    Rain drops:
		      Low amp: 0.1, Low hz: 80 Hz (constant soft rumble)
		      High amp: 0.4, High hz: 800 Hz (intermittent taps)
		    
		    Heartbeat (horror game):
		      Pulse: Low amp: 0.9 → 0 over 100ms, Low hz: 80 Hz
		      Repeat every 800ms (75 BPM)
		  ```
		- ```c++
		  // HD Rumble conceptual API (Switch NX SDK structure)
		  
		  HidVibrationValue vibration;
		  vibration.amplitudeLow  = 0.8f;  // strong low-frequency (impact)
		  vibration.frequencyLow  = 160.0f;
		  vibration.amplitudeHigh = 0.3f;  // subtle high-frequency (texture)
		  vibration.frequencyHigh = 600.0f;
		  
		  // Send to both Joy-Cons
		  HidVibrationDeviceHandle leftHandle, rightHandle;
		  hidGetVibrationDeviceHandles(
		      &leftHandle, &rightHandle, HidNpadId_No1,
		      HidNpadStyleSet_NpadFullKey);
		  
		  hidSendVibrationValue(&leftHandle,  &vibration);
		  hidSendVibrationValue(&rightHandle, &vibration);
		  
		  // Stop vibration after 100ms (use timer or coroutine)
		  // ...
		  vibration.amplitudeLow  = 0.0f;
		  vibration.amplitudeHigh = 0.0f;
		  hidSendVibrationValue(&leftHandle, &vibration);
		  ```
	-
	- ## Motion Controls (Gyroscope)
	  collapsed:: true
		- ```c++
		  // Switch gyroscope input — conceptual
		  
		  HidSixAxisSensorHandle sensorHandle;
		  hidGetSixAxisSensorHandles(
		      &sensorHandle, 1, HidNpadId_No1,
		      HidNpadStyleSet_NpadJoyDual);
		  hidStartSixAxisSensor(sensorHandle);
		  
		  // Per frame: read gyro + accelerometer
		  HidSixAxisSensorState sensorState;
		  hidGetSixAxisSensorStates(sensorHandle, &sensorState, 1);
		  
		  // Angular velocity (gyroscope) — radians per second
		  float pitchRate = sensorState.angularVelocity.x; // look up/down
		  float yawRate   = sensorState.angularVelocity.y; // turn left/right
		  float rollRate  = sensorState.angularVelocity.z; // tilt
		  
		  // Apply gyro to camera (gyro aim):
		  cameraYaw   += yawRate   * dt * gyroSensitivity;
		  cameraPitch += pitchRate * dt * gyroSensitivity;
		  cameraPitch  = clamp(cameraPitch, -89.0f, 89.0f);
		  
		  // Acceleration (linear motion)
		  float accelX = sensorState.acceleration.x;
		  float accelY = sensorState.acceleration.y;
		  float accelZ = sensorState.acceleration.z;
		  
		  // Note: gravity always present (~9.8 m/s² downward)
		  // Subtract gravity for pure motion detection
		  ```
-
- # Performance Optimization for Switch
  collapsed:: true
	- ## GPU Optimization
	  collapsed:: true
		- ```
		  Switch GPU (Maxwell) optimization priorities:
		  
		  1. Reduce draw calls (highest impact):
		     Maxwell has higher draw call overhead than modern GPUs
		     Target: < 1000 draw calls per frame for 60 FPS
		     Batching: combine meshes with same material
		     Instancing: identical objects in one call
		  
		  2. Reduce overdraw:
		     Render opaque objects front-to-back
		     Depth prepass to reject occluded pixels early
		     Transparent objects sort back-to-front (unavoidable overdraw)
		  
		  3. Shader complexity:
		     Maxwell is shader-limited at high resolution
		     Avoid texture lookups per pixel when possible
		     Precompute lighting where possible (lightmaps)
		     Use mediump precision where full precision not needed
		  
		  4. Resolution scaling:
		     Dynamic resolution is your best friend
		     720p handheld target, scale up to 1080p docked
		     Use FXAA or SMAA (cheap anti-aliasing for Switch)
		     Switch 2: use DLSS for free quality improvement
		  ```
	-
	- ## CPU Optimization
	  collapsed:: true
		- ```
		  Switch CPU (Cortex-A57) optimization:
		  
		  Core usage:
		    Core 0: Game thread (main logic, AI, animation)
		    Core 1: Render thread (build command lists)
		    Core 2: Audio thread
		    Core 3: IO / streaming thread
		  
		  Cortex-A57 characteristics:
		    In-order execution (simpler than modern x86)
		    Cache misses are very expensive (worse than PS4/Xbox)
		    SIMD via ARM NEON instructions
		    No out-of-order speculation — structure loops carefully
		  
		  Key optimizations:
		    - Use SoA (Structure of Arrays) — critical for cache efficiency
		    - Avoid pointer chasing (linked lists are slow)
		    - Sort entities by type to maximize cache usage
		    - Avoid branching inside hot loops
		    - NEON SIMD for math-heavy code (vector ops, physics)
		  ```
		- ```c++
		  // NEON SIMD — vector math on Switch ARM
		  #include <arm_neon.h>
		  
		  // Process 4 floats at once using NEON
		  void AddVectors4x(float* a, float* b, float* result, int count) {
		      int i = 0;
		      
		      // Process 4 floats per iteration using NEON
		      for (; i + 4 <= count; i += 4) {
		          float32x4_t va = vld1q_f32(a + i);       // load 4 floats from a
		          float32x4_t vb = vld1q_f32(b + i);       // load 4 floats from b
		          float32x4_t vr = vaddq_f32(va, vb);      // add 4 pairs in parallel
		          vst1q_f32(result + i, vr);                // store 4 results
		      }
		      
		      // Handle remaining elements
		      for (; i < count; i++)
		          result[i] = a[i] + b[i];
		  }
		  ```
	-
	- ## Battery Optimization
	  collapsed:: true
		- ```
		  Battery life is a certification concern AND a user experience issue:
		  
		  Power draw factors:
		    GPU workload — biggest drain
		    CPU workload — significant drain
		    Screen brightness — OLED model can be optimized per pixel
		    WiFi — drains if transmitting constantly
		    Audio — minor
		  
		  Developer guidelines:
		    Don't run GPU at 100% constantly — use dynamic resolution
		    Sleep idle threads — don't spin-wait
		    Reduce update rate for far objects (LOD for AI too)
		    Batch network requests — don't send every frame
		    Use Nintendo's power management API to check thermal state
		    
		  Frame limiter for battery mode:
		    If player enables "Airplane mode" (handheld offline):
		      Consider capping at 30 FPS to extend battery
		      Notify player if game drops resolution for battery
		  ```
-
- # Switch Development in Unity & Unreal
  collapsed:: true
	- ## Unity on Switch
	  collapsed:: true
		- ```
		  Unity Switch requirements:
		    Unity 2021.3+ with Nintendo Switch Build Support
		    NintendoSDK (requires Nintendo developer account + NDA)
		    Visual Studio 2022 or compatible
		  
		  Unity Switch-specific features:
		    HD Rumble API   — Unity.Switch.Rumble
		    NpadState       — Joy-Con input (all configurations)
		    Gyro input      — Unity.Switch.GyroInput
		    Docked mode     — UnityEngine.Switch.SystemInfo.isHandheldMode
		    amiibo NFC      — Unity.Switch.Nfc
		  
		  Performance tips in Unity for Switch:
		    Use URP (Universal Render Pipeline) — lighter than HDRP
		    HDRP is too heavy for Switch — avoid
		    Enable GPU Instancing on shared materials
		    Bake all possible lighting (Enlighten/Progressive)
		    Keep material count low — each unique material = one draw call
		    Use LOD Group components aggressively
		  
		  Build output: .nsp or .xci package
		  Deploy: via DevMenu on SDEV/EDEV kit
		  ```
	-
	- ## Unreal Engine on Switch
	  collapsed:: true
		- ```
		  UE5 on Switch — challenging but achievable:
		  
		  Features to AVOID on Switch:
		    Nanite — too memory-intensive and needs RT hardware
		    Lumen — requires ray tracing, not on Maxwell GPU
		    High-res shadows — cascade shadow maps at low resolution only
		  
		  Features that WORK on Switch:
		    Traditional forward/deferred rendering
		    Lightmass baked GI — prebake everything
		    Niagara particles — but limit particle count
		    Chaos physics — limit active bodies
		    UMG UI — works fine
		  
		  UE Switch optimizations:
		    r.MobileContentScaleFactor=1.0 (720p in handheld)
		    r.MobileContentScaleFactor=1.5 (1080p in docked)
		    sg.ShadowQuality=1 (low shadows on Switch)
		    r.Shadow.MaxResolution=512
		    r.MobileHDR=0 (use LDR on Switch — saves bandwidth)
		  
		  Build: Cook for Nintendo Switch target
		  Output: .nsp via Nintendo SDK packaging tools
		  ```