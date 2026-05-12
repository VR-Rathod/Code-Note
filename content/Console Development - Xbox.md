---
seoTitle: Xbox SDK Development – Xbox Series X/S & GDK Developer Guide
description: "Complete Xbox development guide covering Xbox GDK, DirectX 12 on Xbox, Xbox extensions, GameCore, Xbox Live services, achievements, PIX profiler, and Xbox Developer Mode."
keywords: "Xbox SDK, Xbox GDK, Xbox Series X development, Xbox Series S, DirectX 12 Xbox, GameCore, Xbox Live, achievements, PIX profiler, Xbox Developer Mode, console development, VR-Rathod"
displayTitle: Console Development - Xbox
---

> [!info] About This Page
> Covers **Xbox One, Xbox Series X/S** console development using the **Xbox Game Development Kit (GDK)**.
> Main page: [[Console Development]]. See also: [[Console Development - PlayStation]], [[Console Development - Nintendo Switch]], [[Console Development - Certification]].

> [!tip] Most Accessible Console Platform
> Xbox is the **most open** console platform. The GDK is partially public on GitHub, Developer Mode works on retail consoles, and ID@Xbox accepts indie developers actively.

- # Xbox Hardware Architecture
  collapsed:: true
	- ## Xbox Series X Deep Dive
	  collapsed:: true
		- ```
		  Xbox Series X Custom Silicon (AMD "Arden"):
		  
		  CPU:
		    8 × AMD Zen 2 cores @ 3.8 GHz (3.6 GHz with SMT enabled)
		    SMT (Hyper-Threading) enabled — 16 logical threads
		    L3 cache: 32 MB
		    Note: When SMT enabled, clock drops to 3.6 GHz
		  
		  GPU:
		    52 Compute Units @ 1.825 GHz
		    12 TFLOPS FP32 (most powerful console GPU, gen 9)
		    RDNA 2 architecture
		    Hardware Ray Tracing
		    Mesh Shaders
		    Variable Rate Shading (VRS Tier 2)
		    DirectML (machine learning inference acceleration)
		  
		  Memory:
		    16 GB GDDR6 (split pools)
		    10 GB @ 560 GB/s (fast — GPU resources)
		     6 GB @ 336 GB/s (standard — CPU data)
		    ~13.5 GB available to developers
		  
		  Storage (Velocity Architecture):
		    Custom NVMe SSD: 2.4 GB/s raw
		    ~4.8 GB/s with hardware BCPack decompression
		    DirectStorage API — assets load directly to GPU
		  
		  Xbox Series S (lower spec):
		    CPU: 8 × Zen 2 @ 3.6 GHz (same as X with SMT)
		    GPU: 20 CUs @ 1.565 GHz = 4 TFLOPS
		    RAM: 10 GB GDDR6 (8 GB fast + 2 GB standard)
		    Storage: 1.8 GB/s
		    Target: 1440p/60 FPS (not 4K)
		  ```
	-
	- ## Series X vs Series S vs One
	  collapsed:: true
		- | Feature | Xbox One | Xbox Series S | Xbox Series X |
		  |---------|----------|---------------|---------------|
		  | CPU | 8-core Jaguar 1.75 GHz | 8-core Zen 2 3.6 GHz | 8-core Zen 2 3.8 GHz |
		  | GPU | 1.4 TFLOPS GCN | 4 TFLOPS RDNA 2 | 12 TFLOPS RDNA 2 |
		  | RAM | 8 GB DDR3 | 10 GB GDDR6 | 16 GB GDDR6 |
		  | Target Res | 1080p | 1440p | 4K |
		  | Target FPS | 30/60 | 60/120 | 60/120 |
		  | SSD | HDD | 2.4 GB/s | 2.4 GB/s |
		  | Ray Tracing | None | Hardware | Hardware |
		  | Smart Delivery | N/A | ✅ | ✅ |
-
- # Xbox GDK
  collapsed:: true
	- ## What is the GDK?
	  collapsed:: true
		- ```
		  GDK = Game Development Kit
		  
		  Xbox GDK is Microsoft's unified SDK for:
		    Xbox Series X/S
		    Xbox One (backward compat layer)
		    PC (Windows 10/11 — same codebase!)
		  
		  The GDK replaced the old XDK (Xbox Development Kit) with a
		  unified approach — one codebase, multiple targets.
		  
		  GDK components:
		    GameCore       — Core runtime for Xbox (replaces ERA runtime)
		    GDK Tools      — Visual Studio extensions, packaging tools
		    Xbox Live SDK  — Achievements, multiplayer, save sync
		    DirectX 12     — Graphics API (same as PC DX12!)
		    XAPO / XAudio2 — Audio processing
		    Xbox Gaming Services — Store integration
		  
		  Public GDK (on GitHub):
		    github.com/microsoft/GDK — partial public SDK
		    Includes: Xbox Live API headers, samples, documentation
		    Excludes: Dev kit communication layer, cert tools (NDA)
		  ```
	-
	- ## GDK vs XDK
	  collapsed:: true
		- | Feature | Old XDK (Xbox One) | New GDK (Series X/S + One) |
		  |---------|-------------------|--------------------------|
		  | Platform | Xbox One only | Xbox One + Series + PC |
		  | Runtime | ERA (Exclusive Resource Access) | GameCore |
		  | Graphics | DX11.X | DX12 + Xbox extensions |
		  | Certification | XBCERT | XBCERT (updated) |
		  | Availability | Private only | Partially public (GitHub) |
	-
	- ## Setting Up Xbox Development
	  collapsed:: true
		- ```
		  Option A — Developer Mode (Free, no approval needed):
		    1. Get a retail Xbox Series X/S or Xbox One
		    2. Go to Microsoft Store → search "Xbox Dev Mode"
		    3. Download Xbox Developer Mode Activation app
		    4. Follow prompts — device enters Dev Mode
		    5. Install Windows Device Portal → deploy UWP apps
		    6. Great for: prototyping, early testing, learning
		    Note: Dev Mode apps cannot access full Xbox Live, no cert tools
		  
		  Option B — ID@Xbox Program (Full access):
		    1. Apply at developer.microsoft.com/games
		    2. Submit game concept, team info, studio details
		    3. Microsoft reviews (usually faster than PlayStation)
		    4. Approved → access full GDK, dev kit ordering
		    5. Dev kits: Xbox Series X DevKit or Xbox One ERA Kit
		  
		  Development Environment:
		    OS: Windows 10/11
		    IDE: Visual Studio 2022 (required for GDK integration)
		    GDK: Install via GDK installer (sets up VS extensions)
		    Xbox Manager: Connect PC to dev kit over LAN
		  ```
-
- # DirectX 12 on Xbox
  collapsed:: true
	- ## DX12 + Xbox Extensions
	  collapsed:: true
		- ```
		  Xbox uses standard DirectX 12 with console-specific extensions:
		  
		  Standard DX12 features (same as PC):
		    Command lists + queues
		    Resource heaps
		    Pipeline State Objects (PSOs)
		    Root signatures
		    Descriptor heaps
		  
		  Xbox-specific extensions:
		    SetHardwareProtectedResourceState — memory protection
		    ExecuteIndirect extensions       — GPU-driven rendering
		    Constrained Allocators            — fast memory pools
		    Xbox Shader Compiler (XSC)        — platform-optimized shaders
		    BCPack decompression              — hardware texture decompression
		    Async compute extensions          — fine-grained queue control
		    Memory type hints                 — fast/slow pool allocation
		  ```
		- ```cpp
		  // DirectX 12 Xbox — command list example
		  #include <d3d12_x.h>  // Xbox DX12 header (extends d3d12.h)
		  
		  // Create device (Xbox uses D3D12XboxCreateDevice)
		  ID3D12Device* device = nullptr;
		  D3D12XBOX_CREATE_DEVICE_PARAMETERS params = {};
		  params.Version = D3D12_SDK_VERSION;
		  params.GraphicsSwitchingMode = D3D12XBOX_MODE_PROCESS;
		  params.ProcessDebugFlags = D3D12_PROCESS_DEBUG_FLAG_NONE;
		  
		  D3D12XboxCreateDevice(nullptr, &params, 
		                        IID_PPV_ARGS(&device));
		  
		  // Create command allocator + list (same as PC DX12)
		  ID3D12CommandAllocator*    cmdAlloc = nullptr;
		  ID3D12GraphicsCommandList* cmdList  = nullptr;
		  
		  device->CreateCommandAllocator(
		      D3D12_COMMAND_LIST_TYPE_DIRECT, IID_PPV_ARGS(&cmdAlloc));
		  device->CreateCommandList(
		      0, D3D12_COMMAND_LIST_TYPE_DIRECT, 
		      cmdAlloc, nullptr, IID_PPV_ARGS(&cmdList));
		  
		  // Xbox fast memory allocation
		  D3D12XBOX_RESOURCE_DESC xboxDesc = {};
		  xboxDesc.MemoryType = D3D12XBOX_MEMORY_TYPE_TITLE; // fast pool
		  // ... create resource in fast GPU-only pool
		  ```
	-
	- ## Xbox Memory Management
	  collapsed:: true
		- ```cpp
		  // Xbox memory pools
		  // Series X: 10 GB fast (GPU) + 6 GB standard
		  
		  // Fast memory (GPU resources only — 560 GB/s):
		  D3D12_HEAP_PROPERTIES fastHeap = {};
		  fastHeap.Type = D3D12_HEAP_TYPE_CUSTOM;
		  fastHeap.CPUPageProperty = D3D12_CPU_PAGE_PROPERTY_NOT_AVAILABLE;
		  fastHeap.MemoryPoolPreference = D3D12_MEMORY_POOL_L1; // GPU-local
		  
		  // Standard memory (CPU+GPU shared — 336 GB/s):
		  D3D12_HEAP_PROPERTIES standardHeap = {};
		  standardHeap.Type = D3D12_HEAP_TYPE_CUSTOM;
		  standardHeap.CPUPageProperty = D3D12_CPU_PAGE_PROPERTY_WRITE_COMBINE;
		  standardHeap.MemoryPoolPreference = D3D12_MEMORY_POOL_L0; // system
		  
		  // Budget guidelines:
		  //   Render targets, textures, meshes → fast pool
		  //   Game data, audio, upload heaps  → standard pool
		  //   GPU read-often resources         → fast pool always
		  ```
	-
	- ## Mesh Shaders on Xbox
	  collapsed:: true
		- ```hlsl
		  // Xbox supports Mesh Shaders (amplification + mesh pipeline)
		  // Replaces geometry shader pipeline for complex scenes
		  
		  // Amplification Shader — per-meshlet culling
		  [numthreads(32, 1, 1)]
		  void ASMain(
		      uint gtid : SV_GroupThreadID,
		      uint gid  : SV_GroupID)
		  {
		      // Check if meshlet is visible
		      bool visible = IsInFrustum(gid * 32 + gtid);
		      
		      // Xbox intrinsic — efficiently compact visible meshlets
		      uint mask = WaveActiveBallot(visible).x;
		      uint count = countbits(mask);
		      
		      // Dispatch only visible mesh shader groups
		      DispatchMesh(count, 1, 1, payload);
		  }
		  
		  // Mesh Shader — process one meshlet
		  [outputtopology("triangle")]
		  [numthreads(128, 1, 1)]
		  void MSMain(
		      uint gid : SV_GroupID,
		      uint gtid : SV_GroupThreadID,
		      in payload MeshPayload payload,
		      out vertices VertexOut verts[128],
		      out indices uint3 tris[256])
		  {
		      SetMeshOutputCounts(vertCount, triCount);
		      
		      if (gtid < vertCount)
		          verts[gtid].pos = TransformVert(gtid, payload.meshletIndex);
		      
		      if (gtid < triCount)
		          tris[gtid] = GetTriangleIndices(gtid, payload.meshletIndex);
		  }
		  ```
	-
	- ## DirectStorage on Xbox
	  collapsed:: true
		- ```cpp
		  // DirectStorage — load assets directly from NVMe to GPU
		  // Bypasses CPU entirely for texture/mesh loading
		  
		  #include <dstorage.h>
		  
		  IDStorageFactory* factory = nullptr;
		  DStorageGetFactory(IID_PPV_ARGS(&factory));
		  
		  // Create queue for GPU-direct loading
		  DSTORAGE_QUEUE_DESC queueDesc = {};
		  queueDesc.SourceType = DSTORAGE_REQUEST_SOURCE_FILE;
		  queueDesc.Destination = DSTORAGE_REQUEST_DESTINATION_MEMORY;
		  queueDesc.Capacity    = DSTORAGE_MAX_QUEUE_CAPACITY;
		  queueDesc.Device      = device;
		  
		  IDStorageQueue* queue = nullptr;
		  factory->CreateQueue(&queueDesc, IID_PPV_ARGS(&queue));
		  
		  // Open a file for DirectStorage
		  IDStorageFile* file = nullptr;
		  factory->OpenFile(L"textures\\terrain.pak", IID_PPV_ARGS(&file));
		  
		  // Queue read request — goes direct to GPU buffer
		  DSTORAGE_REQUEST request = {};
		  request.Options.SourceType      = DSTORAGE_REQUEST_SOURCE_FILE;
		  request.Options.DestinationType = DSTORAGE_REQUEST_DESTINATION_MEMORY;
		  request.Options.CompressionFormat = DSTORAGE_COMPRESSION_FORMAT_GDEFLATE;
		  request.Source.File.Source = file;
		  request.Source.File.Offset = fileOffset;
		  request.Source.File.Size   = compressedSize;
		  request.Destination.Memory.Buffer = gpuDestBuffer;
		  request.Destination.Memory.Size   = uncompressedSize;
		  request.UncompressedSize           = uncompressedSize;
		  
		  queue->EnqueueRequest(&request);
		  
		  // Signal fence when all queued loads complete
		  queue->EnqueueSignal(fence, fenceValue);
		  queue->Submit();
		  ```
-
- # Xbox Live Services
  collapsed:: true
	- ## Achievements
	  collapsed:: true
		- ```
		  Xbox Achievements system:
		    Gamerscore — points earned from achievements (cosmetic)
		    Each game gets 1,000 Gamerscore base (DLC can add more)
		    Achievement count: 10–40 typically
		    
		  Achievement requirements:
		    Must be meaningful — can't be "Start the game" for 10G
		    Challenges must be possible for all players
		    No missable achievements (or must warn players)
		    Achievements persist — cannot be removed after shipping
		  
		  Achievement types (Xbox, no official types but common patterns):
		    Progression — complete chapter 1, 2, 3...
		    Collectible — find all secrets
		    Challenge   — complete on highest difficulty
		    Mastery     — max out character
		    Humor       — find Easter egg, fail spectacularly
		  ```
		- ```cpp
		  // Xbox Achievements via Xbox Live GDK
		  #include <XGameSave.h>
		  #include <XAchievements.h>
		  
		  // Initialize Xbox Live
		  XUserHandle userHandle = nullptr;
		  XUserAddAsync(XUserAddOptions::AddDefaultUserSilently,
		                &asyncBlock, nullptr);
		  // ... wait for async completion ...
		  XUserAdd(XUserAddOptions::AddDefaultUserSilently, &userHandle);
		  
		  // Unlock achievement
		  XAchievementsUpdateAchievementAsync(
		      userHandle,
		      titleId,               // Your game's title ID
		      "achievement_001",     // Achievement ID from Partner Center
		      true,                  // isUnlocking = true
		      100,                   // percentComplete (100 = unlocked)
		      &asyncBlock);
		  
		  // For progressive achievements (e.g., "Kill 50 enemies"):
		  XAchievementsUpdateAchievementAsync(
		      userHandle, titleId,
		      "achievement_kill50",
		      false,    // not fully unlocked yet
		      60,       // 60% complete (30/50 enemies killed)
		      &asyncBlock);
		  ```
	-
	- ## Cloud Saves (Xbox Game Save)
	  collapsed:: true
		- ```cpp
		  // Xbox Game Save — cloud-synced save system
		  #include <XGameSave.h>
		  
		  XGameSaveProviderHandle saveProvider = nullptr;
		  
		  // Initialize save provider (syncs with cloud)
		  XGameSaveInitializeProviderAsync(
		      userHandle, "GameSaveContainer", false, &asyncBlock);
		  // ... wait for completion ...
		  XGameSaveInitializeProvider(
		      userHandle, "GameSaveContainer", false, &saveProvider);
		  
		  // Create a save container
		  XGameSaveContainerHandle container = nullptr;
		  XGameSaveCreateContainer(saveProvider, "SaveSlot1", &container);
		  
		  // Write save data
		  XGameSaveUpdateHandle update = nullptr;
		  XGameSaveCreateUpdate(container, "SaveSlot1", &update);
		  
		  SaveData data = GetCurrentGameState();
		  XGameSaveSubmitBlobWrite(update, "GameState", 
		                           &data, sizeof(SaveData));
		  XGameSaveSubmitUpdateAsync(update, &asyncBlock);
		  
		  // Read save data
		  uint8_t buffer[sizeof(SaveData)];
		  size_t bytesRead;
		  XGameSaveReadBlobData(container, "GameState", 
		                        &bytesRead, sizeof(buffer), buffer);
		  ```
	-
	- ## Xbox Multiplayer
	  collapsed:: true
		- ```
		  Xbox Live Multiplayer services:
		  
		  Matchmaking:
		    SmartMatch — skill-based matchmaking (ELO-style)
		    Session Directory (MPSD) — session creation and discovery
		    Xbox Party system — group of friends in party
		  
		  Networking:
		    Xbox Game Chat 2 — voice chat with moderation
		    PlayFab Multiplayer Servers — managed dedicated servers
		    Azure PlayFab — backend services (leaderboards, analytics)
		  
		  Social:
		    Friend system
		    Activity feed
		    Game clips + screenshots
		    Xbox app integration
		  
		  Cross-play:
		    Xbox + PC via Xbox Play Anywhere
		    Cross-network play (Xbox + PlayStation/Switch with approval)
		  ```
-
- # Quick Resume
  collapsed:: true
	- ## Implementation Requirements
	  collapsed:: true
		- ```
		  Quick Resume:
		    Console suspends your game's RAM snapshot when player switches games
		    When player returns, RAM restored — game continues from exact state
		  
		  Your game must handle:
		  
		  1. PLM (Process Lifecycle Management) events:
		     Suspending  — save any non-RAM state (network connections, streams)
		     Resuming    — restore network connections, re-sync game state
		     Constrained — entering background (reduce CPU/GPU usage)
		  
		  2. Network reconnection:
		     Game could be suspended for hours/days
		     Online session will have expired — rejoin gracefully
		     Show "Reconnecting..." UI, not crash
		  
		  3. State consistency:
		     Real-time clocks — update timestamps after resume
		     Anti-cheat — verify integrity after resume
		     Daily rewards — check server for any missed rewards
		  ```
		- ```cpp
		  // PLM event handling — GameCore
		  #include <XGameRuntimeFeature.h>
		  #include <XSuspend.h>
		  
		  // Register for PLM events
		  XTaskQueueRegistrationToken token;
		  XGameSaveFilesGetFolderWithUiAsync(
		      userHandle, &asyncBlock);
		  
		  // Handle suspend
		  RegisterAppStateChangeNotification(
		      [](BOOL suspended, void* context) {
		          if (suspended) {
		              // Suspending — save network state, flush IO
		              g_networkManager->Disconnect();
		              g_audioEngine->Suspend();
		              FlushPendingWrites();
		          } else {
		              // Resuming from Quick Resume
		              g_audioEngine->Resume();
		              g_networkManager->ReconnectAsync();
		              SyncTimeWithServer();
		          }
		      }, nullptr, &token);
		  ```
-
- # PIX Profiler
  collapsed:: true
	- ## PIX for Xbox
	  collapsed:: true
		- ```
		  PIX (Performance Investigator for Xbox) is Microsoft's GPU profiler.
		  Also available for PC DX12 development.
		  
		  PIX capture types:
		    GPU Capture  — Frame-by-frame GPU timeline, resource inspection
		    Timing Capture — CPU/GPU timing, thread analysis, event tracing
		    File IO Capture — Disk read/write timeline (for streaming analysis)
		  
		  PIX GPU Capture workflow:
		    1. Launch game on Xbox dev kit or PC
		    2. PIX Desktop: attach to process
		    3. Press capture button (or set programmatic trigger)
		    4. PIX records one complete frame
		    5. Open capture: see every GPU command in timeline
		    6. Click any draw call: see shader, resources, timing
		    7. Identify: overdraw, unused resources, expensive shaders
		  
		  PIX markers (add to your code for organized captures):
		  ```
		- ```cpp
		  // PIX markers — group draw calls in PIX timeline
		  #include <pix3.h>
		  
		  // Begin a named region (shows as colored bar in PIX)
		  PIXBeginEvent(cmdList, PIX_COLOR(255, 0, 0), "Shadow Pass");
		  
		      // All draw calls in shadow pass here
		      RenderShadowMap(cmdList, lights);
		  
		  PIXEndEvent(cmdList);
		  
		  // Instant marker (single point in timeline)
		  PIXSetMarker(cmdList, PIX_COLOR(0, 255, 0), "Lighting Pass Start");
		  
		  // CPU-side markers (for CPU timeline in timing capture)
		  PIXBeginEvent(PIX_COLOR(0, 0, 255), "Physics Update");
		      UpdatePhysicsWorld(dt);
		  PIXEndEvent();
		  ```
-
- # Smart Delivery & Xbox Packages
  collapsed:: true
	- ## Smart Delivery
	  collapsed:: true
		- ```
		  Smart Delivery = one purchase, right version per console:
		  
		  Xbox One version — lower res textures, fewer features
		  Xbox Series X version — 4K textures, ray tracing
		  
		  Same purchase — Microsoft Store delivers correct version.
		  
		  Implementation in GDK:
		    Assets tagged by device family in MicrosoftGame.config
		    Installer downloads only assets for player's console
		    Saves download bandwidth (don't download 4K assets on Series S)
		  
		  MicrosoftGame.config:
		  <ShellVisuals>
		      <DefaultDisplayName>My Game</DefaultDisplayName>
		      <DeviceFamily>XboxOne</DeviceFamily>
		      <DeviceFamily>XboxSeries</DeviceFamily>
		  </ShellVisuals>
		  
		  Content packages:
		    Base package   — common content (game code, audio, UI)
		    Platform chunk — console-specific (4K textures for Series X)
		    DLC chunks     — additional content (same system)
		  ```
	-
	- ## Package Structure
	  collapsed:: true
		- ```
		  Xbox package format: .xvc (Xbox Virtual Container)
		  
		  Project layout:
		    /game/                — compiled game binary
		    /assets/base/         — common assets (all platforms)
		    /assets/xbone/        — Xbox One specific assets
		    /assets/scarlett/     — Xbox Series specific assets
		    /loose/               — developer test files (stripped in release)
		    MicrosoftGame.config  — manifest (package metadata)
		  
		  MicrosoftGame.config key fields:
		    TitleId        — unique numeric ID for your game
		    StoreId        — Partner Center store ID
		    Version        — "1.0.0.0"
		    RequiresXboxLive — online required?
		    ShellVisuals   — icons, store images
		    ExecutableList — which .exe to launch
		  ```
-
- # Xbox Development in Unity & Unreal
  collapsed:: true
	- ## Unity on Xbox
	  collapsed:: true
		- ```
		  Unity Xbox requirements:
		    Unity 2021.3+ with Xbox build module
		    Xbox GDK installed
		    ID@Xbox account (for full access)
		    Visual Studio 2022
		  
		  Xbox-specific Unity features:
		    Xbox Live plugin — achievements, cloud saves, presence
		    GameCore integration — PLM events, suspend/resume
		    Xbox controller — Unity Input System handles Xbox controller natively
		    DirectX 12 backend — Xbox uses DX12 render path
		  
		  Build output:
		    .msixvc package or loose file layout
		    Deploy via Xbox Manager or Xbox Device Portal
		  ```
	-
	- ## Unreal Engine on Xbox
	  collapsed:: true
		- ```
		  UE5 Xbox support:
		    Target: Xbox GDK
		    Graphics: DX12 RHI (same as PC, Xbox extensions enabled)
		    Nanite: works on Xbox Series X/S (not Xbox One)
		    Lumen: requires ray tracing (Xbox Series only)
		    Chaos: multi-threaded physics on all 8 Zen 2 cores
		  
		  Xbox-specific UE5 features:
		    Online Subsystem GDK — Xbox Live integration
		    Xbox One Platform — backward compat builds
		    XboxCommon — shared Xbox platform code
		    DirectStorage UE5 plugin — fast asset loading
		  
		  Packaging:
		    Cook content for Xbox
		    Package generates .xvc via GDK packaging tools
		    Deploy to dev kit via UnrealFrontend or command line
		  ```