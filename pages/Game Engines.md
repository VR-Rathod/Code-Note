---
seoTitle: Game Engines – Complete Guide to CryEngine, GameMaker, Construct, RPG Maker & O3DE
description: "Comprehensive guide to game engines including CryEngine, O3DE (Lumberyard), GameMaker Studio 2, Construct 4, and RPG Maker — with features, scripting, and when to use each."
keywords: "game engines, CryEngine, O3DE, Lumberyard, GameMaker Studio, Construct, RPG Maker, game engine comparison, indie game engines, VR-Rathod, Code-Note"
displayTitle: Game Engines
---

> [!info] About This Page
> This page covers **specialized game engines** — CryEngine, O3DE, GameMaker Studio 2, Construct, and RPG Maker.
> For the big three see [[Godot]], [[Unity]], [[Unreal Engine]].
> For engine-agnostic concepts see [[Game Development]].

- # Engine Comparison at a Glance
  collapsed:: true
	- | Engine | Best For | Language | Price | Open Source |
	  |--------|----------|----------|-------|-------------|
	  | [[Godot]] | Indie 2D/3D | GDScript / C# | Free | ✅ Yes |
	  | [[Unity]] | Mobile, VR, Indie 3D | C# | Free tier | ❌ No |
	  | [[Unreal Engine]] | AAA 3D, Film, VFX | C++ / Blueprints | 5% royalty | Partial |
	  | CryEngine | AAA FPS, Open World | C++, Lua, Schematyc | Free + royalty | Partial |
	  | O3DE | AAA 3D, Simulation | C++, Script Canvas | Free | ✅ Yes |
	  | GameMaker Studio 2 | 2D Indie Games | GML / Visual | $9.99/mo | ❌ No |
	  | Construct 4 | No-code 2D, Browser | Event Sheets / JS | Free tier | ❌ No |
	  | RPG Maker | 2D RPGs | Ruby / JavaScript | ~$80 one-time | ❌ No |
- # CryEngine
  collapsed:: true
	- > [!info] What is CryEngine?
	  > CryEngine is developed by **Crytek** (Frankfurt, Germany). Known for Far Cry (2004) and Crysis (2007) — legendary for graphics benchmarking.
	  > Used in: **Hunt: Showdown**, Kingdom Come: Deliverance, Robinson: The Journey (VR).
	  > Free to use — 5% royalty only when you ship and earn >$5,000/quarter.
	-
	- ## History
	  collapsed:: true
		- ```
		  2004 — Far Cry ships on CryEngine 1 (revolutionary outdoor rendering)
		  2007 — Crysis ships on CryEngine 2 (still a benchmark today)
		  2011 — CryEngine 3, Crysis 2 (console + PC)
		  2013 — CryEngine 3 SDK released free to developers
		  2016 — CryEngine V, pay-what-you-want model
		  2019 — Hunt: Showdown enters early access
		  2022 — CryEngine 5.7 with ray tracing support
		  ```
	-
	- ## Key Features
	  collapsed:: true
		- | Feature | Description |
		  |---------|-------------|
		  | SVOGI | Sparse Voxel Octree Global Illumination — real-time GI |
		  | Terrain System | 4km² terrain with procedural vegetation |
		  | Physically Based Rendering | Full PBR material pipeline |
		  | Sandbox Editor | Integrated level editor with real-time preview |
		  | Schematyc | Visual scripting system (node-based) |
		  | Particle System | GPU-driven particle effects |
		  | VR Support | OpenVR, Oculus, PSVR support |
		  | AI System | MNM (Multilayer Navigation Mesh), behavior trees |
		  | Audio | FMOD / Wwise integration |
	-
	- ## Scripting in CryEngine
	  collapsed:: true
		- ```
		  Languages available:
		    C++       — Core engine, full access, best performance
		    Lua       — Legacy scripting, still used for game logic
		    Schematyc — Visual node-based scripting (like Blueprints)
		  
		  C++ Entity example:
		    class CMyEntity : public IEntityComponent {
		        void Initialize() override { /* setup */ }
		        void ProcessEvent(const SEntityEvent& e) override { /* events */ }
		    };
		  ```
		- ```lua
		  -- Lua scripting example
		  function OnInit(self, table)
		      self.health = 100
		  end
		  
		  function OnDamage(self, damage)
		      self.health = self.health - damage
		      if self.health <= 0 then
		          self:Die()
		      end
		  end
		  ```
	-
	- ## When to Use CryEngine
	  collapsed:: true
		- ```
		  ✅ AAA-quality FPS or open-world games
		  ✅ Games requiring top-tier outdoor environments
		  ✅ VR experiences needing high fidelity
		  ✅ Teams with C++ experience
		  
		  ❌ Avoid for 2D games
		  ❌ Avoid for mobile (not optimized)
		  ❌ Steep learning curve vs Godot/Unity
		  ❌ Smaller community than Unreal/Unity
		  ```
- # O3DE (Open 3D Engine)
  collapsed:: true
	- > [!info] What is O3DE?
	  > O3DE (Open 3D Engine) is an **open-source, Apache 2.0 licensed** engine backed by the **Linux Foundation** and Amazon (AWS).
	  > It is the evolution of **Amazon Lumberyard** (which was itself a fork of CryEngine 3).
	  > Used by: Amazon Games, Niantic, Hadean.
	-
	- ## Lumberyard → O3DE History
	  collapsed:: true
		- ```
		  2015 — Amazon acquires Lumberyard code from Crytek (CryEngine 3 fork)
		  2016 — Amazon Lumberyard announced (free, required AWS for multiplayer)
		  2021 — Amazon donates engine to Linux Foundation → becomes O3DE
		  2021 — O3DE 21.11 first public release (open source, Apache 2.0)
		  2022 — O3DE 22.x — improved rendering, gem system
		  2023 — O3DE 23.x — PhysX 5, multiplayer improvements
		  ```
	-
	- ## Key Features
	  collapsed:: true
		- | Feature | Description |
		  |---------|-------------|
		  | Atom Renderer | PBR renderer with Vulkan, DirectX 12, Metal |
		  | Gem System | Modular plugin architecture |
		  | Script Canvas | Visual scripting (node-based) |
		  | PhysX 5 | NVIDIA PhysX physics simulation |
		  | Multiplayer Gem | Built-in networking framework |
		  | White Box Tool | In-editor rapid prototyping |
		  | Terrain | Multi-layer terrain with macro/micro materials |
		  | Open Source | Apache 2.0 — no royalties, full source |
	-
	- ## Gem System (Modules)
	  collapsed:: true
		- ```
		  O3DE uses a modular "Gem" system — every feature is a plugin
		  
		  Core Gems:
		    PhysX         — Physics simulation
		    Multiplayer   — Networking and replication
		    Atom          — Rendering pipeline
		    White Box     — Rapid geometry prototyping
		    Script Canvas — Visual scripting
		    LyShine       — UI system
		    Audio         — Wwise integration
		  
		  Custom Gems:
		    Create your own gem with C++ and register it in project.json
		  ```
		- ```c++
		  // O3DE Component example (C++)
		  class MyComponent
		      : public AZ::Component
		      , public AZ::TickBus::Handler
		  {
		  public:
		      AZ_COMPONENT(MyComponent, "{GUID-HERE}");
		  
		      void Activate() override {
		          AZ::TickBus::Handler::BusConnect();
		      }
		  
		      void Deactivate() override {
		          AZ::TickBus::Handler::BusDisconnect();
		      }
		  
		      void OnTick(float dt, AZ::ScriptTimePoint) override {
		          // runs every frame
		      }
		  };
		  ```
	-
	- ## When to Use O3DE
	  collapsed:: true
		- ```
		  ✅ AAA 3D games, simulations, digital twins
		  ✅ Need full source access (Apache 2.0, no royalties)
		  ✅ Cloud/AWS integration projects
		  ✅ Experienced C++ teams
		  
		  ❌ Not for beginners (complex C++ architecture)
		  ❌ Small community vs Unreal/Unity
		  ❌ Less marketplace content
		  ```
- # GameMaker Studio 2
  collapsed:: true
	- > [!info] What is GameMaker Studio 2?
	  > GameMaker Studio 2 (GMS2) by **YoYo Games** is the industry-leading **2D game engine**.
	  > Used by: **Undertale, Hotline Miami, Hyper Light Drifter, Katana ZERO, Chicory**.
	  > Massive success story for indie 2D games. GML is beginner-friendly but powerful.
	-
	- ## Key Features
	  collapsed:: true
		- | Feature | Description |
		  |---------|-------------|
		  | GML | GameMaker Language — easy syntax, C-like |
		  | Visual Scripting | Drag-and-drop for beginners |
		  | 2D Physics | Box2D integration |
		  | Sprite Editor | Built-in pixel art and animation tools |
		  | Room Editor | Scene/level editor with layers |
		  | Shader Support | GLSL ES shaders for effects |
		  | Export Targets | Windows, macOS, Linux, HTML5, iOS, Android, GX.games |
		  | Marketplace | Community assets and extensions |
	-
	- ## GML Scripting
	  collapsed:: true
		- ```gml
		  // Player movement — GML example
		  // In Step Event of Player object:
		  
		  var spd = 4;
		  var hsp = (keyboard_check(vk_right) - keyboard_check(vk_left)) * spd;
		  var vsp = (keyboard_check(vk_down)  - keyboard_check(vk_up))   * spd;
		  
		  // Move and stop at walls
		  if (place_meeting(x + hsp, y, obj_wall)) hsp = 0;
		  if (place_meeting(x, y + vsp, obj_wall)) vsp = 0;
		  
		  x += hsp;
		  y += vsp;
		  
		  // Animation
		  if (hsp != 0 || vsp != 0) {
		      sprite_index = spr_player_walk;
		      image_speed = 0.2;
		  } else {
		      sprite_index = spr_player_idle;
		      image_speed = 0;
		  }
		  ```
		- ```gml
		  // Shooting — create bullet instance
		  // In Step Event, on fire key:
		  if (keyboard_check_pressed(ord("Z"))) {
		      var b = instance_create_layer(x, y, "Bullets", obj_bullet);
		      b.direction = point_direction(x, y, mouse_x, mouse_y);
		      b.speed = 10;
		      audio_play_sound(snd_shoot, 1, false);
		  }
		  ```
	-
	- ## Object Events System
	  collapsed:: true
		- ```
		  GameMaker uses an Event-driven architecture:
		  
		  Create Event    — runs once when object is created (like Start())
		  Step Event      — runs every frame (like Update())
		  Draw Event      — handles all rendering
		  Collision Event — triggered on overlap with another object
		  Destroy Event   — runs when object is destroyed
		  Alarm Event     — timer-based callbacks (Alarm[0] to Alarm[11])
		  Key Press Event — specific key input
		  
		  Example Alarm usage:
		    // In Create Event:
		    alarm[0] = 60; // fire after 60 steps (1 second at 60fps)
		    
		    // In Alarm[0] Event:
		    instance_create_layer(x, y, "Enemies", obj_enemy_spawn);
		    alarm[0] = 120; // reset timer
		  ```
	-
	- ## Rooms & Layers
	  collapsed:: true
		- ```
		  Rooms = Scenes/Levels in GameMaker
		  
		  Layer types:
		    Background — tiling background images
		    Tilemap    — grid-based tile placement
		    Instance   — placed object instances
		    Asset      — sprites without object logic
		    Effect     — built-in particle effects
		  
		  Room transitions:
		    room_goto(rm_level2);           // switch room
		    room_goto_next();               // next room in list
		    room_transition_enable(true);   // enable transition
		  ```
	-
	- ## Pricing
	  collapsed:: true
		- | Plan | Price | Exports |
		  |------|-------|---------|
		  | Free | Free | GX.games only |
		  | Indie | $9.99/mo | Desktop + Mobile + Web |
		  | Enterprise | $79/mo | All platforms |
- # Construct 4
  collapsed:: true
	- > [!info] What is Construct 4?
	  > Construct 4 by **Scirra** is a **browser-based, no-code/low-code 2D game engine**.
	  > Games run natively in the browser (HTML5/WebGL). Export to Windows, Android, iOS.
	  > Used by: Teachers, educators, hobbyists, rapid prototypers.
	  > Famous games made with Construct: **Airscape, Iconoclasts (early prototype)**.
	-
	- ## Key Features
	  collapsed:: true
		- | Feature | Description |
		  |---------|-------------|
		  | Event Sheets | Visual logic — no code required |
		  | Behaviors | Pre-built components (Platform, Bullet, Physics) |
		  | JavaScript | Optional full JS scripting |
		  | Browser-based | No download — runs in Chrome/Firefox |
		  | HTML5 Export | Games run in browser natively |
		  | Physics | Box2D physics engine |
		  | Multiplayer | WebRTC peer-to-peer built-in |
		  | Animation Editor | Sprite and animation tools built-in |
	-
	- ## Event Sheet System
	  collapsed:: true
		- ```
		  Construct uses Conditions → Actions logic:
		  
		  [Condition]              → [Action]
		  Player overlaps Enemy   → Subtract 10 from Health
		  Keyboard A is pressed   → Player: Set X velocity to -200
		  Health <= 0             → Go to layout "GameOver"
		  
		  This compiles to JavaScript under the hood.
		  
		  Example event:
		  ┌─────────────────────────────────────────┐
		  │ + Platform behavior: On floor            │
		  │ + Keyboard: Space is just pressed        │
		  ├─────────────────────────────────────────┤
		  │ → Player: Platform: Set vector Y to -600 │
		  │ → Audio: Play Jump sound                 │
		  └─────────────────────────────────────────┘
		  ```
	-
	- ## JavaScript in Construct
	  collapsed:: true
		- ```javascript
		  // Construct 4 JavaScript scripting
		  // In a Script file or inline script event:
		  
		  runOnStartup(async runtime => {
		      runtime.addEventListener("beforeprojectstart", () => onBeforeProjectStart(runtime));
		  });
		  
		  async function onBeforeProjectStart(runtime) {
		      // Runs before the first layout starts
		      console.log("Game starting!");
		  }
		  
		  // Access instances
		  function onPlayerJump(runtime) {
		      const player = runtime.objects.Player.getFirstInstance();
		      if (player) {
		          player.behaviors.Platform.vectorY = -600;
		      }
		  }
		  ```
	-
	- ## When to Use Construct
	  collapsed:: true
		- ```
		  ✅ Teaching game development to beginners
		  ✅ Rapid 2D prototyping
		  ✅ Browser-based games (HTML5)
		  ✅ No programming experience required
		  
		  ❌ Not for 3D games
		  ❌ Not for complex AAA projects
		  ❌ Limited compared to GameMaker for advanced devs
		  ```
- # RPG Maker
  collapsed:: true
	- > [!info] What is RPG Maker?
	  > RPG Maker by **Kadokawa/Gotcha Gotcha Games** is a series of engines for creating **2D top-down RPGs** with minimal programming.
	  > Latest version: **RPG Maker MZ** (2020).
	  > Famous games: **To the Moon, Yume Nikki, OneShot, Omori, OFF, Ib**.
	-
	- ## RPG Maker Versions
	  collapsed:: true
		- | Version | Year | Language | Notes |
		  |---------|------|----------|-------|
		  | RPG Maker 95 | 1997 | — | First public version |
		  | RPG Maker 2000 | 2000 | — | Huge community classic |
		  | RPG Maker XP | 2004 | Ruby (RGSS) | First Ruby scripting |
		  | RPG Maker VX Ace | 2012 | Ruby (RGSS3) | Popular, huge plugin library |
		  | RPG Maker MV | 2015 | JavaScript | Multi-platform, HTML5 |
		  | RPG Maker MZ | 2020 | JavaScript | Current version, improved MV |
	-
	- ## Key Features
	  collapsed:: true
		- | Feature | Description |
		  |---------|-------------|
		  | Database | Characters, skills, items, enemies, maps — all visual |
		  | Event System | Map events drive story and gameplay |
		  | Battle System | Front-view or side-view turn-based combat |
		  | Tilesets | Grid-based map building with included art |
		  | Plugin System | JavaScript plugins (MV/MZ) for custom features |
		  | Audio | BGM, BGS, SE, ME — integrated audio management |
		  | Built-in Assets | Hundreds of free sprites, tiles, music included |
	-
	- ## Event System
	  collapsed:: true
		- ```
		  RPG Maker uses a Map Event system for all game logic:
		  
		  Event Commands include:
		    Show Text          — dialogue boxes
		    Show Choices       — branching dialogue
		    Control Variables  — game math and tracking
		    Control Switches   — on/off flags for game state
		    Transfer Player    — move to another map/location
		    Battle Processing  — trigger a battle
		    Play BGM           — change background music
		    Change Gold        — economy management
		    Change Items       — add/remove from inventory
		    Conditional Branch — if/else logic
		  
		  Trigger types:
		    Action Button — player presses confirm key
		    Player Touch  — fires when player walks on event
		    Event Touch   — fires when event walks into player
		    Autorun       — runs automatically, blocks input
		    Parallel       — runs every frame, non-blocking
		  ```
	-
	- ## JavaScript Plugin (MZ)
	  collapsed:: true
		- ```javascript
		  /*:
		   * @plugindesc Custom Plugin Example
		   * @author YourName
		   *
		   * @param PlayerSpeed
		   * @type number
		   * @default 4
		   * @desc Player walk speed
		   */
		  
		  (() => {
		      const params = PluginManager.parameters("MyPlugin");
		      const playerSpeed = Number(params["PlayerSpeed"]) || 4;
		  
		      // Override player movement speed
		      const _Game_Player_realMoveSpeed = Game_Player.prototype.realMoveSpeed;
		      Game_Player.prototype.realMoveSpeed = function() {
		          return playerSpeed;
		      };
		  })();
		  ```
	-
	- ## When to Use RPG Maker
	  collapsed:: true
		- ```
		  ✅ Making 2D top-down RPGs quickly
		  ✅ Story-driven games with dialogue trees
		  ✅ No-code approach to game creation
		  ✅ Pixel art RPG aesthetic
		  
		  ❌ Limited to 2D top-down style
		  ❌ Default look is very recognizable (generic)
		  ❌ Performance issues with large maps/plugins
		  ❌ Not for action, platformer, or 3D games
		  ```
- # Engine Selection Guide
  collapsed:: true
	- > [!tip] How to Pick Your Engine
	  > Don't learn multiple engines at once. Pick one, master it, ship a game.
	-
	- ## Decision Flowchart
	  collapsed:: true
		- ```mermaid
		  flowchart TD
		      Start([What kind of game?]) --> Q1{2D or 3D?}
		      Q1 -->|2D| Q2{Skill level?}
		      Q1 -->|3D| Q3{Scale?}
		  
		      Q2 -->|Beginner / No code| Construct[Construct 4]
		      Q2 -->|Want to make an RPG| RPG[RPG Maker MZ]
		      Q2 -->|Intermediate dev| GM[GameMaker Studio 2]
		      Q2 -->|Code-only 2D / Lua code-focused| LOVE[LÖVE Framework]
		      Q2 -->|Advanced, open source| Godot2[Godot Engine]
		  
		      Q3 -->|Indie / Small team| Godot3[Godot Engine]
		      Q3 -->|Mid-size, mobile, VR| Unity[Unity]
		      Q3 -->|AAA, cinematic quality| Unreal[Unreal Engine]
		      Q3 -->|AAA open source, AWS| O3DE[O3DE]
		      Q3 -->|AAA FPS, top fidelity| Cry[CryEngine]
		  ```
	-
	- ## Feature Matrix
	  collapsed:: true
		- | Feature | CryEngine | O3DE | GameMaker | Construct | RPG Maker |
		  |---------|-----------|------|-----------|-----------|-----------|
		  | 2D Support | ❌ | ❌ | ✅✅ | ✅✅ | ✅✅ |
		  | 3D Support | ✅✅ | ✅✅ | ❌ | ❌ | ❌ |
		  | Visual Scripting | Schematyc | Script Canvas | ✅ | ✅✅ | ✅✅ |
		  | Free | ✅* | ✅ | Free tier | Free tier | ❌ ($80) |
		  | Open Source | Partial | ✅ | ❌ | ❌ | ❌ |
		  | Mobile Export | ❌ | ❌ | ✅ | ✅ | ✅ |
		  | Browser Export | ❌ | ❌ | ✅ | ✅✅ | ✅ |
		  | Beginner Friendly | ❌ | ❌ | ✅ | ✅✅ | ✅✅ |
		  | Community Size | Small | Small | Large | Medium | Large |
		  
		  *CryEngine: free until $5,000 revenue/quarter then 5% royalty
- # Learning Resources
  collapsed:: true
	- ## CryEngine
	  collapsed:: true
		- [CryEngine Documentation](https://docs.cryengine.com)
		- [CryEngine GitHub](https://github.com/CRYTEK/CRYENGINE)
		- [CryEngine Marketplace](https://www.cryengine.com/marketplace)
	-
	- ## O3DE
	  collapsed:: true
		- [O3DE Official Site](https://www.o3de.org)
		- [O3DE GitHub](https://github.com/o3de/o3de)
		- [O3DE Documentation](https://docs.o3de.org)
		- [O3DE Discord Community](https://discord.gg/o3de)
	-
	- ## GameMaker Studio 2
	  collapsed:: true
		- [GameMaker Manual](https://manual.gamemaker.io)
		- [GameMaker Marketplace](https://marketplace.gamemaker.io)
		- [Shaun Spalding YouTube](https://www.youtube.com/@ShaunJS) — Best GMS2 tutorials
		- [GMLscripts.com](https://www.gmlscripts.com) — Community GML snippets
	-
	- ## Construct 4
	  collapsed:: true
		- [Construct.net](https://www.construct.net)
		- [Construct Manual](https://www.construct.net/en/make-games/manuals/construct-3)
		- [Scirra Arcade](https://www.construct.net/en/free-online-games) — Play community games
	-
	- ## RPG Maker
	  collapsed:: true
		- [RPG Maker Web](https://www.rpgmakerweb.com)
		- [RPG Maker Forums](https://forums.rpgmakerweb.com)
		- [Yanfly Plugins](https://yanfly.moe) — Essential MV/MZ plugins
		- [itch.io RPG Maker Games](https://itch.io/games/tag-rpg-maker) — Inspiration