---
seoTitle: Game Audio – Complete Sound Design & Implementation Guide
description: "Comprehensive game audio reference covering audio fundamentals, FMOD, Wwise, adaptive music, 3D spatial audio, DSP effects, audio optimization, and engine integration from beginner to super advanced."
keywords: "game audio, FMOD, Wwise, adaptive music, spatial audio, 3D audio, DSP effects, audio middleware, game sound design, audio implementation, audio optimization, HRTF, audio engine, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Game Audio
---

> [!info] About This Page
> This page covers **game audio engineering** — from audio fundamentals to professional middleware like FMOD and Wwise.
> For engine-specific audio nodes see [[Godot]], [[Unity]], [[Unreal Engine]].
> For audio assets and free sounds see [[Free Assets]].
> For game design context see [[Game Design]].

- # History
  collapsed:: true
	- **How**: Game audio evolved from single-channel beeps (Pong, 1972) to full orchestral scores, spatial 3D audio, and adaptive music systems that react to gameplay in real time.
	- **Who**: Pioneers include Koji Kondo (Mario, Zelda), Nobuo Uematsu (Final Fantasy), and audio middleware companies like Firelight Technologies (FMOD) and Audiokinetic (Wwise).
	- **Why**: Audio is 50% of the player experience. Poor audio breaks immersion instantly. Great audio makes players feel emotions they can't explain — tension, joy, dread, triumph.
	-
	- ## Timeline
	  collapsed:: true
		- ```mermaid
		  timeline
		      title Game Audio Evolution
		      1972 : Pong
		           : Single beep sounds
		           : No music
		      1985 : NES Era
		           : Chiptune music
		           : 4-channel synthesis
		      1990s : CD-ROM Era
		           : Recorded audio
		           : Full orchestral scores
		      2000s : Middleware Era
		           : FMOD and Wwise emerge
		           : Adaptive music begins
		      2010s : Spatial Audio
		           : Dolby Atmos in games
		           : HRTF for headphones
		      2020s : Procedural and AI Audio
		           : Real-time synthesis
		           : AI-generated adaptive music
		  ```
-
- # Introduction
  collapsed:: true
	- Game audio is the discipline of creating, implementing, and optimizing all sound in a game — music, sound effects, voice acting, ambient sound, and UI audio.
	- Unlike film audio (linear, fixed), game audio must be **interactive** and **adaptive** — responding to player actions, game state, and environment in real time.
	-
	- ## Game Audio Knowledge Map
	  collapsed:: true
		- ```mermaid
		  mindmap
		    root((Game Audio))
		      Fundamentals
		        Digital Audio
		        Signal Flow
		        File Formats
		        Compression
		      Sound Design
		        SFX Creation
		        Foley
		        Voice Acting
		        Procedural Audio
		      Music
		        Adaptive Music
		        Vertical Remixing
		        Horizontal Resequencing
		        Stingers
		      Spatial Audio
		        3D Positioning
		        HRTF
		        Occlusion
		        Reverb Zones
		      Middleware
		        FMOD Studio
		        Wwise
		        Engine Native
		      Implementation
		        Audio Buses
		        Mixing
		        DSP Effects
		        Optimization
		  ```
	-
	- ## Audio vs Music vs Sound Design
	  collapsed:: true
		- | Role | Responsibility |
		  |------|---------------|
		  | Sound Designer | Creates SFX — weapons, footsteps, UI, ambient, foley |
		  | Composer | Writes and produces music — score, themes, adaptive systems |
		  | Audio Programmer | Implements audio in engine — middleware integration, DSP, optimization |
		  | Voice Director | Directs voice acting sessions, manages dialogue |
		  | Audio Lead | Oversees all audio, sets technical standards |
	-
	- ## Why Audio Matters
	  collapsed:: true
		- > [!tip] The 50% Rule
		  > Audio contributes approximately **50% of the player's emotional experience**.
		  > Mute any great game and it immediately feels hollow.
		  > Add great audio to a mediocre game and it feels significantly better.
		- | Audio Element | Player Emotion It Creates |
		  |--------------|--------------------------|
		  | Tense music + silence | Dread, anticipation |
		  | Satisfying hit sounds | Power, impact |
		  | Ambient environment | Immersion, presence |
		  | UI feedback sounds | Confidence, clarity |
		  | Adaptive music swell | Excitement, triumph |
		  | Silence at the right moment | Shock, weight |

- # Audio Fundamentals
  collapsed:: true
	- ## Digital Audio Basics
	  collapsed:: true
		- ```mermaid
		  graph LR
		      Sound["🔊 Sound Wave\nAnalog pressure wave"] -->|"ADC\nAnalog to Digital"| Digital["💾 Digital Audio\nSamples over time"]
		      Digital -->|"DAC\nDigital to Analog"| Speaker["🔈 Speaker\nBack to analog"]
		  ```
		- | Concept | Description | Common Values |
		  |---------|-------------|---------------|
		  | Sample Rate | Samples per second | 44,100 Hz (CD), 48,000 Hz (game/film standard) |
		  | Bit Depth | Bits per sample — dynamic range | 16-bit (CD), 24-bit (production) |
		  | Channels | Number of audio streams | Mono (1), Stereo (2), 5.1 (6), 7.1 (8) |
		  | Bitrate | Data per second (compressed) | 128–320 kbps (MP3), lossless (WAV/FLAC) |
		  | Latency | Delay from trigger to sound | < 10ms ideal for games |
		- > [!tip] Game Standard
		  > Use **48,000 Hz / 24-bit** for production. Export SFX as WAV, music as OGG.
		  > Never use MP3 for looping audio — it has a gap at the loop point.
	-
	- ## Audio File Formats
	  collapsed:: true
		- | Format | Type | Quality | Size | Use Case |
		  |--------|------|---------|------|---------|
		  | WAV | Uncompressed | Lossless | Large | SFX, source files, short clips |
		  | AIFF | Uncompressed | Lossless | Large | Apple equivalent of WAV |
		  | OGG Vorbis | Compressed | Near-lossless | Small | Music, long ambient loops |
		  | MP3 | Compressed | Lossy | Small | Avoid — gap at loop point |
		  | FLAC | Compressed | Lossless | Medium | Archival, high-quality music |
		  | OPUS | Compressed | Excellent | Very small | Voice, streaming, web games |
		  | XMA | Compressed | Good | Small | Xbox platform audio |
		  | ADPCM | Compressed | Good | Small | Mobile, low-memory platforms |
		- > [!warning] MP3 Loop Gap
		  > MP3 encoding adds silence at the start and end of files.
		  > This causes an audible gap when looping. Always use OGG or WAV for looping audio.
	-
	- ## Signal Flow
	  collapsed:: true
		- ```mermaid
		  graph LR
		      Source["🎵 Audio Source\nSound file / synthesis"]
		      Effects["🎛️ DSP Effects\nEQ, reverb, compression"]
		      Bus["🚌 Audio Bus\nGroup channel"]
		      Master["🔊 Master Bus\nFinal mix"]
		      Output["🎧 Output\nSpeakers / headphones"]
		      Source --> Effects --> Bus --> Master --> Output
		      subgraph Buses["Bus Hierarchy"]
		          SFX["SFX Bus"]
		          Music["Music Bus"]
		          Voice["Voice Bus"]
		          Ambient["Ambient Bus"]
		          SFX --> Master
		          Music --> Master
		          Voice --> Master
		          Ambient --> Master
		      end
		  ```
	-
	- ## Decibels (dB) Reference
	  collapsed:: true
		- | dB Level | Perception | Use Case |
		  |----------|-----------|---------|
		  | 0 dB | Maximum (clipping threshold) | Never exceed in final mix |
		  | -6 dB | Half amplitude | Headroom for peaks |
		  | -12 dB | Comfortable listening level | Music in gameplay |
		  | -18 dB | Background level | Ambient sounds |
		  | -24 dB | Quiet background | Distant sounds |
		  | -∞ dB | Silence | Muted |
		- > [!tip] Mixing Rule
		  > Leave **-6 dB headroom** on the master bus. Never clip.
		  > Music should sit around **-12 to -18 dB** so SFX can punch through.

- # FMOD Studio
  collapsed:: true
	- > [!info] What is FMOD?
	  > FMOD Studio is the industry-standard audio middleware used in thousands of games.
	  > It separates audio design from code — designers work in FMOD Studio, programmers use the FMOD API.
	  > Used by: Hollow Knight, Celeste, Hades, Minecraft, Fortnite, Cyberpunk 2077.
	  > Free for projects under $200K revenue. [fmod.com](https://www.fmod.com/)
	-
	- ## FMOD Architecture
	  collapsed:: true
		- ```mermaid
		  graph TD
		      subgraph Studio["🎛️ FMOD Studio (Designer Tool)"]
		          Events["Events\nSound containers with logic"]
		          Banks["Banks\nPackaged audio files"]
		          Params["Parameters\nGameplay variables"]
		          Mixer["Mixer\nBuses, effects, routing"]
		      end
		      subgraph API["💻 FMOD API (Programmer)"]
		          System["FMOD::Studio::System\nInitialize FMOD"]
		          EventInst["EventInstance\nPlay an event"]
		          SetParam["setParameterByName\nDrive adaptive audio"]
		      end
		      Banks -->|"Load at runtime"| System
		      Events --> EventInst
		      Params --> SetParam
		  ```
	-
	- ## FMOD Core Concepts
	  collapsed:: true
		- | Concept | Description |
		  |---------|-------------|
		  | Event | A sound container — can hold multiple audio tracks, logic, and parameters |
		  | Bank | A compiled package of events and audio assets loaded at runtime |
		  | Parameter | A float value set by game code that drives audio behavior |
		  | Snapshot | A mixer state — apply reverb, ducking, or EQ changes globally |
		  | Bus | A routing channel — group sounds for volume control and effects |
		  | VCA | Volume Control Automation — control volume of a group without routing |
		  | Timeline | Linear playback within an event — like a DAW timeline |
		  | Transition | Logic for switching between audio states based on parameters |
	-
	- ## FMOD C++ Integration
	  collapsed:: true
		- ```cpp
		  #include "fmod_studio.hpp"
		  #include "fmod.hpp"

		  FMOD::Studio::System* studioSystem = nullptr;

		  // Initialize FMOD Studio
		  void AudioManager::Init() {
		      FMOD::Studio::System::create(&studioSystem);
		      studioSystem->initialize(
		          512,                              // max channels
		          FMOD_STUDIO_INIT_NORMAL,          // studio flags
		          FMOD_INIT_NORMAL,                 // core flags
		          nullptr                           // extra driver data
		      );

		      // Load master bank (always load this first)
		      FMOD::Studio::Bank* masterBank = nullptr;
		      studioSystem->loadBankFile("Master.bank",
		          FMOD_STUDIO_LOAD_BANK_NORMAL, &masterBank);

		      // Load strings bank (for event path lookup)
		      FMOD::Studio::Bank* stringsBank = nullptr;
		      studioSystem->loadBankFile("Master.strings.bank",
		          FMOD_STUDIO_LOAD_BANK_NORMAL, &stringsBank);
		  }

		  // Play a one-shot sound event
		  void AudioManager::PlayOneShot(const char* eventPath) {
		      FMOD::Studio::EventDescription* eventDesc = nullptr;
		      studioSystem->getEvent(eventPath, &eventDesc);

		      FMOD::Studio::EventInstance* instance = nullptr;
		      eventDesc->createInstance(&instance);

		      instance->start();
		      instance->release(); // auto-release when done
		  }

		  // Play a persistent event (music, ambient)
		  FMOD::Studio::EventInstance* AudioManager::PlayPersistent(const char* eventPath) {
		      FMOD::Studio::EventDescription* eventDesc = nullptr;
		      studioSystem->getEvent(eventPath, &eventDesc);

		      FMOD::Studio::EventInstance* instance = nullptr;
		      eventDesc->createInstance(&instance);
		      instance->start();
		      return instance; // caller manages lifetime
		  }

		  // Set a parameter to drive adaptive audio
		  void AudioManager::SetParameter(FMOD::Studio::EventInstance* instance,
		                                   const char* name, float value) {
		      instance->setParameterByName(name, value);
		  }

		  // Update — call every frame
		  void AudioManager::Update() {
		      studioSystem->update();
		  }

		  // Cleanup
		  void AudioManager::Shutdown() {
		      studioSystem->unloadAll();
		      studioSystem->release();
		  }
		  ```
	-
	- ## FMOD GDScript (Godot)
	  collapsed:: true
		- ```gdscript
		  # Using FMOD GDNative plugin for Godot
		  # https://github.com/alessandrofama/fmod-for-godot

		  extends Node

		  var music_instance: FMODStudioEventInstance

		  func _ready() -> void:
		      # Load banks
		      FMODStudio.load_bank("res://audio/Master.bank",
		          FMODStudio.LOAD_BANK_NORMAL)
		      FMODStudio.load_bank("res://audio/Master.strings.bank",
		          FMODStudio.LOAD_BANK_NORMAL)

		      # Start persistent music event
		      music_instance = FMODStudio.create_event_instance(
		          "event:/Music/MainTheme")
		      music_instance.start()

		  func play_sfx(event_path: String) -> void:
		      FMODStudio.play_one_shot(event_path)

		  func set_music_intensity(value: float) -> void:
		      # Drive adaptive music with gameplay parameter
		      music_instance.set_parameter_by_name("Intensity", value)

		  func _process(_delta: float) -> void:
		      FMODStudio.update()
		  ```
	-
	- ## FMOD C# (Unity)
	  collapsed:: true
		- ```csharp
		  using FMODUnity;
		  using FMOD.Studio;

		  public class AudioManager : MonoBehaviour
		  {
		      [SerializeField] EventReference musicEvent;
		      [SerializeField] EventReference footstepEvent;

		      private EventInstance musicInstance;

		      void Start() {
		          // Start persistent music
		          musicInstance = RuntimeManager.CreateInstance(musicEvent);
		          musicInstance.start();
		      }

		      public void PlayFootstep(string surface) {
		          // One-shot with parameter
		          EventInstance sfx = RuntimeManager.CreateInstance(footstepEvent);
		          sfx.setParameterByName("Surface", surface == "grass" ? 0f : 1f);
		          sfx.start();
		          sfx.release(); // auto-release
		      }

		      public void SetCombatIntensity(float intensity) {
		          // Drive adaptive music (0 = calm, 1 = intense combat)
		          musicInstance.setParameterByName("CombatIntensity", intensity);
		      }

		      void OnDestroy() {
		          musicInstance.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
		          musicInstance.release();
		      }
		  }
		  ```

- # Wwise (Audiokinetic)
  collapsed:: true
	- > [!info] What is Wwise?
	  > Wwise is the other industry-standard audio middleware — used heavily in AAA games.
	  > More powerful than FMOD for complex audio systems, but steeper learning curve.
	  > Used by: God of War, Assassin's Creed, The Witcher 3, Horizon Zero Dawn, Baldur's Gate 3.
	  > Free for projects under $150K revenue. [audiokinetic.com](https://www.audiokinetic.com/)
	-
	- ## FMOD vs Wwise Comparison
	  collapsed:: true
		- | Feature | FMOD Studio | Wwise |
		  |---------|------------|-------|
		  | Learning curve | Medium | High |
		  | UI complexity | Simpler | More complex |
		  | Adaptive music | Good | Excellent |
		  | Interactive music | Good | Industry-leading |
		  | Profiling tools | Good | Excellent |
		  | Spatial audio | Good | Excellent |
		  | Platform support | All major | All major |
		  | Free tier | Under $200K revenue | Under $150K revenue |
		  | Best for | Indie to mid-size | Mid-size to AAA |
		  | Used by | Hollow Knight, Celeste | God of War, Witcher 3 |
	-
	- ## Wwise Core Concepts
	  collapsed:: true
		- | Concept | Description |
		  |---------|-------------|
		  | Sound Object | Basic audio container — holds audio files |
		  | Actor-Mixer | Hierarchy for organizing and routing sounds |
		  | Event | Triggered action — Play, Stop, Pause, Set Switch |
		  | Switch | State-based audio selection (e.g., surface type) |
		  | State | Global game state that affects audio (e.g., InCombat, Exploring) |
		  | RTPC | Real-Time Parameter Control — float value driving audio |
		  | Blend Container | Blend between sounds based on RTPC value |
		  | Music Segment | A section of interactive music |
		  | Music Playlist | Sequence or random selection of music segments |
		  | Music Switch | Transition between music states |
		  | Bus | Routing channel with effects |
		  | Aux Bus | Send effects bus (reverb, delay) |
	-
	- ## Wwise C++ Integration
	  collapsed:: true
		- ```cpp
		  #include <AK/SoundEngine/Common/AkSoundEngine.h>
		  #include <AK/SoundEngine/Common/AkMemoryMgr.h>
		  #include <AK/MusicEngine/Common/AkMusicEngine.h>

		  // Initialize Wwise
		  void AudioManager::Init() {
		      // Memory manager
		      AkMemSettings memSettings;
		      AK::MemoryMgr::GetDefaultSettings(memSettings);
		      AK::MemoryMgr::Init(&memSettings);

		      // Sound engine
		      AkInitSettings initSettings;
		      AkPlatformInitSettings platformSettings;
		      AK::SoundEngine::GetDefaultInitSettings(initSettings);
		      AK::SoundEngine::GetDefaultPlatformInitSettings(platformSettings);
		      AK::SoundEngine::Init(&initSettings, &platformSettings);

		      // Music engine
		      AkMusicSettings musicSettings;
		      AK::MusicEngine::GetDefaultInitSettings(musicSettings);
		      AK::MusicEngine::Init(&musicSettings);

		      // Load init bank (always required)
		      AK::SoundEngine::LoadBank(AKTEXT("Init.bnk"), AK_DEFAULT_POOL_ID);
		  }

		  // Register a game object (every sound source needs one)
		  void AudioManager::RegisterObject(AkGameObjectID id, const char* name) {
		      AK::SoundEngine::RegisterGameObj(id, name);
		  }

		  // Post an event (play a sound)
		  void AudioManager::PostEvent(const char* eventName, AkGameObjectID objectID) {
		      AK::SoundEngine::PostEvent(eventName, objectID);
		  }

		  // Set RTPC value (drive adaptive audio)
		  void AudioManager::SetRTPC(const char* rtpcName, float value,
		                              AkGameObjectID objectID = AK_INVALID_GAME_OBJECT) {
		      AK::SoundEngine::SetRTPCValue(rtpcName, value, objectID);
		  }

		  // Set Switch (e.g., surface type for footsteps)
		  void AudioManager::SetSwitch(const char* switchGroup, const char* switchState,
		                                AkGameObjectID objectID) {
		      AK::SoundEngine::SetSwitch(switchGroup, switchState, objectID);
		  }

		  // Set State (global game state)
		  void AudioManager::SetState(const char* stateGroup, const char* state) {
		      AK::SoundEngine::SetState(stateGroup, state);
		  }

		  // Update 3D position
		  void AudioManager::SetPosition(AkGameObjectID id, float x, float y, float z) {
		      AkSoundPosition pos;
		      pos.SetPosition(x, y, z);
		      pos.SetOrientation(0, 0, 1, 0, 1, 0); // forward, up
		      AK::SoundEngine::SetPosition(id, pos);
		  }

		  // Update — call every frame
		  void AudioManager::Update() {
		      AK::SoundEngine::RenderAudio();
		  }
		  ```

- # Adaptive Music Systems
  collapsed:: true
	- > [!info] What is Adaptive Music?
	  > Adaptive music changes dynamically based on gameplay state — tension, exploration, combat, victory.
	  > Unlike film music (linear), game music must loop, transition, and react in real time.
	-
	- ## Adaptive Music Techniques
	  collapsed:: true
		- ```mermaid
		  graph TD
		      subgraph Horizontal["🔄 Horizontal Resequencing"]
		          H1["Segment A\nExploration"] -->|"Enemy spotted"| H2["Segment B\nTension"]
		          H2 -->|"Combat starts"| H3["Segment C\nCombat"]
		          H3 -->|"Enemy dead"| H4["Segment D\nVictory sting"]
		          H4 -->|"Return to normal"| H1
		      end
		      subgraph Vertical["🎚️ Vertical Remixing"]
		          V1["Base Layer\nAlways playing"]
		          V2["Percussion Layer\nFades in during combat"]
		          V3["Melody Layer\nFades in at full intensity"]
		          V4["Choir Layer\nBoss fight only"]
		          V1 --- V2 --- V3 --- V4
		      end
		      subgraph Stingers["⚡ Stingers"]
		          S1["Short musical phrase\nplayed on top of current music"]
		          S2["Enemy spotted sting"]
		          S3["Pickup collected sting"]
		          S4["Level complete fanfare"]
		      end
		  ```
		- | Technique | Description | Best For |
		  |-----------|-------------|---------|
		  | Horizontal Resequencing | Switch between pre-composed segments | Clear state changes (combat/explore) |
		  | Vertical Remixing | Layer tracks in/out based on intensity | Gradual tension building |
		  | Stingers | Short musical phrases on top of base music | Punctuating events |
		  | Generative Music | Procedurally generated based on parameters | Infinite variation, ambient |
		  | Tempo Sync | Music tempo matches gameplay speed | Racing games, rhythm games |
	-
	- ## Implementing Adaptive Music in FMOD
	  collapsed:: true
		- ```
		  FMOD Studio Setup:
		  1. Create a Multi Instrument or Transition Timeline event
		  2. Add music segments as audio tracks
		  3. Create a "CombatIntensity" parameter (0.0 = calm, 1.0 = intense)
		  4. Add transition markers between segments
		  5. Set transition conditions based on parameter value
		  6. Add volume automation curves per layer
		  ```
		- ```cpp
		  // In game code — update music based on gameplay state
		  void GameAudio::UpdateMusicState(float combatIntensity,
		                                    bool bossActive,
		                                    float playerHealth) {
		      // Drive intensity parameter (0 = calm, 1 = full combat)
		      musicInstance.setParameterByName("CombatIntensity", combatIntensity);

		      // Switch to boss music state
		      if (bossActive) {
		          musicInstance.setParameterByName("BossActive", 1.0f);
		      }

		      // Low health — add tension layer
		      float tension = 1.0f - (playerHealth / maxHealth);
		      musicInstance.setParameterByName("PlayerTension", tension);
		  }
		  ```
	-
	- ## Music Transition Types
	  collapsed:: true
		- | Transition Type | Description | Use Case |
		  |----------------|-------------|---------|
		  | Immediate | Switch instantly | Sudden shock moments |
		  | Beat sync | Switch on next beat | Smooth musical transitions |
		  | Bar sync | Switch on next bar | Natural musical phrasing |
		  | Phrase sync | Switch on next phrase (4/8 bars) | Seamless music changes |
		  | Fade crossfade | Fade out old, fade in new | Gradual state changes |
		  | Stinger bridge | Play a connecting phrase then switch | Cinematic transitions |

- # 3D Spatial Audio
  collapsed:: true
	- > [!info] What is Spatial Audio?
	  > Spatial audio makes sounds appear to come from specific positions in 3D space.
	  > Essential for immersion — players can hear where enemies are, where danger is coming from.
	-
	- ## Spatial Audio Pipeline
	  collapsed:: true
		- ```mermaid
		  graph LR
		      Source["🔊 Sound Source\n3D position in world"]
		      Atten["📉 Attenuation\nVolume by distance"]
		      Pan["↔️ Panning\nLeft/right by angle"]
		      Doppler["🚗 Doppler\nPitch by velocity"]
		      Occlude["🧱 Occlusion\nMuffled through walls"]
		      Reverb["🏛️ Reverb\nRoom acoustics"]
		      HRTF["🎧 HRTF\nHead-related transfer\nfor headphones"]
		      Output["🎧 Output"]
		      Source --> Atten --> Pan --> Doppler --> Occlude --> Reverb --> HRTF --> Output
		  ```
	-
	- ## Attenuation Models
	  collapsed:: true
		- | Model | Formula | Behavior | Use Case |
		  |-------|---------|---------|---------|
		  | Linear | `volume = 1 - (dist / maxDist)` | Gradual fade | Simple games |
		  | Inverse | `volume = minDist / dist` | Realistic falloff | Most 3D games |
		  | Inverse Square | `volume = minDist² / dist²` | Physically accurate | Simulation |
		  | Custom curve | Designer-defined | Full control | AAA games |
		- ```cpp
		  // FMOD — set 3D attributes on an event instance
		  FMOD_3D_ATTRIBUTES attributes = {};
		  attributes.position = { x, y, z };        // world position
		  attributes.velocity = { vx, vy, vz };     // for Doppler effect
		  attributes.forward  = { 0, 0, 1 };        // facing direction
		  attributes.up       = { 0, 1, 0 };        // up vector

		  eventInstance->set3DAttributes(&attributes);

		  // Set listener position (usually the camera/player)
		  FMOD_3D_ATTRIBUTES listenerAttribs = {};
		  listenerAttribs.position = { camX, camY, camZ };
		  listenerAttribs.forward  = { camFwdX, camFwdY, camFwdZ };
		  listenerAttribs.up       = { 0, 1, 0 };

		  studioSystem->setListenerAttributes(0, &listenerAttribs);
		  ```
	-
	- ## HRTF (Head-Related Transfer Function)
	  collapsed:: true
		- > [!info] What is HRTF?
		  > HRTF simulates how sound waves interact with your head and ears to create 3D perception through headphones.
		  > Without HRTF, headphone audio sounds like it's inside your head. With HRTF, it sounds like it's in the room.
		- | HRTF Solution | Platform | Quality | Cost |
		  |--------------|----------|---------|------|
		  | Steam Audio | All | Excellent | Free |
		  | Resonance Audio (Google) | All | Very good | Free |
		  | FMOD Spatializer | All | Good | Included |
		  | Wwise Spatial Audio | All | Excellent | Included |
		  | Sony 360 Reality Audio | PlayStation | Excellent | Platform SDK |
		  | Dolby Atmos | All | Excellent | License required |
	-
	- ## Occlusion & Obstruction
	  collapsed:: true
		- ```mermaid
		  graph TD
		      subgraph Occlusion["🧱 Occlusion — Sound through solid wall"]
		          O1["Sound source"] -->|"Wall blocks direct path"| O2["Low-pass filter applied\nMuffled, bass-heavy sound"]
		      end
		      subgraph Obstruction["🪨 Obstruction — Partial blocking"]
		          OB1["Sound source"] -->|"Partial obstacle"| OB2["Reduced volume\nSome high frequencies lost"]
		      end
		      subgraph Reverb["🏛️ Reverb Zones"]
		          R1["Cave"] -->|"Long reverb tail"| R2["Echoey, deep sound"]
		          R3["Open field"] -->|"No reverb"| R4["Dry, direct sound"]
		          R5["Cathedral"] -->|"Very long reverb"| R6["Massive, ethereal sound"]
		      end
		  ```
		- ```cpp
		  // Steam Audio occlusion (Godot / Unity plugin)
		  // Raycast from listener to source — if blocked, apply occlusion
		  float occlusionFactor = 0.0f;
		  if (Physics.Linecast(listenerPos, sourcePos, out hit)) {
		      occlusionFactor = 1.0f; // fully occluded
		  }
		  // Apply low-pass filter based on occlusion
		  audioSource.SetOcclusionFactor(occlusionFactor);
		  ```

- # DSP Effects
  collapsed:: true
	- > [!info] What is DSP?
	  > DSP (Digital Signal Processing) — mathematical operations applied to audio signals in real time.
	  > Every effect you hear in games (reverb, echo, distortion) is a DSP algorithm.
	-
	- ## Essential DSP Effects
	  collapsed:: true
		- | Effect | What It Does | Game Use Case |
		  |--------|-------------|--------------|
		  | EQ (Equalizer) | Boost/cut specific frequencies | Muffled underwater sound, radio effect |
		  | Low-Pass Filter | Remove high frequencies | Occlusion, underwater, muffled |
		  | High-Pass Filter | Remove low frequencies | Thin, distant sounds |
		  | Reverb | Simulate room acoustics | Caves, cathedrals, open spaces |
		  | Delay/Echo | Repeat sound with time offset | Canyons, large spaces |
		  | Compression | Reduce dynamic range | Consistent volume, punch |
		  | Limiter | Hard ceiling on volume | Prevent clipping |
		  | Distortion | Harmonic saturation | Radio, damaged equipment |
		  | Chorus | Slight pitch/time variations | Thicken sounds, underwater |
		  | Flanger | Comb filtering effect | Sci-fi, metallic sounds |
		  | Pitch Shift | Change pitch without time | Slow-motion, speed effects |
		  | Convolution Reverb | Real room impulse responses | Photorealistic acoustics |
	-
	- ## Reverb Design by Environment
	  collapsed:: true
		- | Environment | Pre-delay | Decay Time | Diffusion | Character |
		  |-------------|-----------|-----------|-----------|-----------|
		  | Small room | 5–10ms | 0.3–0.5s | High | Tight, intimate |
		  | Large hall | 20–40ms | 1.5–3s | Medium | Grand, spacious |
		  | Cathedral | 40–80ms | 4–8s | Low | Massive, ethereal |
		  | Cave | 10–30ms | 1–3s | Low | Dark, echoey |
		  | Open field | 0–5ms | 0.1–0.3s | High | Dry, natural |
		  | Underwater | 0ms | 0.5–1s | Very high | Muffled, swirling |
		  | Metal room | 5ms | 0.2–0.4s | Low | Bright, ringy |
	-
	- ## DSP in FMOD (GDScript)
	  collapsed:: true
		- ```gdscript
		  # Apply DSP effects to FMOD buses in Godot
		  # FMOD Studio handles most DSP in the designer tool
		  # But you can also apply effects via snapshots

		  func enter_cave() -> void:
		      # Activate cave reverb snapshot
		      FMODStudio.set_parameter_by_name("Environment", 1.0)  # 0=outside, 1=cave

		  func go_underwater() -> void:
		      # Activate underwater snapshot (low-pass + chorus)
		      FMODStudio.set_parameter_by_name("Underwater", 1.0)

		  func take_damage() -> void:
		      # Activate low-health snapshot (muffled, heartbeat)
		      FMODStudio.set_parameter_by_name("PlayerHealth",
		          float(current_health) / float(max_health))
		  ```
	-
	- ## DSP in Godot (Native)
	  collapsed:: true
		- ```gdscript
		  # Godot native audio effects on buses
		  # Project → Project Settings → Audio → Add buses

		  extends Node

		  func _ready() -> void:
		      # Get the SFX bus index
		      var sfx_bus = AudioServer.get_bus_index("SFX")

		      # Add a reverb effect to the SFX bus
		      var reverb = AudioEffectReverb.new()
		      reverb.room_size = 0.8
		      reverb.damping = 0.5
		      reverb.wet = 0.3
		      AudioServer.add_bus_effect(sfx_bus, reverb)

		      # Add a low-pass filter (for occlusion)
		      var lowpass = AudioEffectLowPassFilter.new()
		      lowpass.cutoff_hz = 800.0  # muffled
		      AudioServer.add_bus_effect(sfx_bus, lowpass)

		  func set_underwater(active: bool) -> void:
		      var sfx_bus = AudioServer.get_bus_index("SFX")
		      # Enable/disable the low-pass filter effect
		      AudioServer.set_bus_effect_enabled(sfx_bus, 1, active)
		  ```

- # Engine Native Audio
  collapsed:: true
	- ## Godot Audio System
	  collapsed:: true
		- ```mermaid
		  graph TD
		      subgraph Nodes["Audio Nodes"]
		          ASP["AudioStreamPlayer\nNon-positional\nMusic, UI sounds"]
		          ASP2["AudioStreamPlayer2D\nPositional 2D audio"]
		          ASP3["AudioStreamPlayer3D\nPositional 3D audio"]
		      end
		      subgraph Buses["Audio Bus Layout"]
		          Master["Master Bus"]
		          Music["Music Bus"]
		          SFX["SFX Bus"]
		          Voice["Voice Bus"]
		          Ambient["Ambient Bus"]
		          Music --> Master
		          SFX --> Master
		          Voice --> Master
		          Ambient --> Master
		      end
		  ```
		- ```gdscript
		  extends Node

		  @onready var music_player = $AudioStreamPlayer
		  @onready var sfx_player   = $SFXPlayer

		  func _ready() -> void:
		      # Load and play music
		      music_player.stream = preload("res://audio/music/main_theme.ogg")
		      music_player.bus = "Music"
		      music_player.volume_db = -6.0
		      music_player.play()

		  func play_sfx(stream: AudioStream, pitch_variation: float = 0.1) -> void:
		      sfx_player.stream = stream
		      sfx_player.bus = "SFX"
		      # Random pitch variation prevents repetitive sounds
		      sfx_player.pitch_scale = randf_range(1.0 - pitch_variation,
		                                            1.0 + pitch_variation)
		      sfx_player.play()

		  func set_music_volume(db: float) -> void:
		      AudioServer.set_bus_volume_db(
		          AudioServer.get_bus_index("Music"), db)

		  func mute_sfx(muted: bool) -> void:
		      AudioServer.set_bus_mute(
		          AudioServer.get_bus_index("SFX"), muted)
		  ```
	-
	- ## Unity Audio System
	  collapsed:: true
		- ```csharp
		  using UnityEngine;
		  using UnityEngine.Audio;

		  public class AudioManager : MonoBehaviour
		  {
		      [SerializeField] AudioMixer masterMixer;
		      [SerializeField] AudioSource musicSource;
		      [SerializeField] AudioSource sfxSource;

		      // Play music with crossfade
		      public void PlayMusic(AudioClip clip, float fadeTime = 1f) {
		          StartCoroutine(CrossfadeMusic(clip, fadeTime));
		      }

		      IEnumerator CrossfadeMusic(AudioClip newClip, float duration) {
		          float startVol = musicSource.volume;
		          // Fade out
		          for (float t = 0; t < duration; t += Time.deltaTime) {
		              musicSource.volume = Mathf.Lerp(startVol, 0, t / duration);
		              yield return null;
		          }
		          musicSource.clip = newClip;
		          musicSource.Play();
		          // Fade in
		          for (float t = 0; t < duration; t += Time.deltaTime) {
		              musicSource.volume = Mathf.Lerp(0, startVol, t / duration);
		              yield return null;
		          }
		      }

		      // Play SFX at position (pooled)
		      public void PlaySFX(AudioClip clip, Vector3 position,
		                           float volume = 1f, float pitchVariation = 0.1f) {
		          AudioSource.PlayClipAtPoint(clip, position, volume);
		      }

		      // Control mixer groups via exposed parameters
		      public void SetMusicVolume(float normalizedVolume) {
		          // Convert 0-1 to dB (-80 to 0)
		          float db = normalizedVolume > 0.001f
		              ? Mathf.Log10(normalizedVolume) * 20f
		              : -80f;
		          masterMixer.SetFloat("MusicVolume", db);
		      }
		  }
		  ```
	-
	- ## Unreal Engine Audio
	  collapsed:: true
		- ```cpp
		  // Unreal Engine 5 — MetaSound and audio components
		  #include "Components/AudioComponent.h"
		  #include "Kismet/GameplayStatics.h"
		  #include "Sound/SoundBase.h"

		  // Play sound at location (fire and forget)
		  UGameplayStatics::PlaySoundAtLocation(
		      this, FootstepSound, GetActorLocation(),
		      FRotator::ZeroRotator,
		      1.0f,   // volume multiplier
		      FMath::RandRange(0.9f, 1.1f)  // pitch variation
		  );

		  // Spawn persistent audio component (music, ambient)
		  UAudioComponent* MusicComp = UGameplayStatics::SpawnSound2D(
		      this, MusicAsset);
		  MusicComp->SetVolumeMultiplier(0.8f);

		  // Fade out music
		  MusicComp->FadeOut(2.0f, 0.0f); // 2 second fade to 0 volume

		  // Set audio parameter (for MetaSound)
		  MusicComp->SetFloatParameter(FName("CombatIntensity"), 0.8f);
		  ```

- # Audio Optimization
  collapsed:: true
	- ## Performance Bottlenecks
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Bottleneck["Audio Performance Issue?"]
		      CPU["CPU Bound\nToo many voices\nExpensive DSP"]
		      Memory["Memory Bound\nToo many loaded banks\nUncompressed audio"]
		      Streaming["Streaming Issues\nDisk I/O bottleneck\nHDD latency"]
		      Bottleneck --> CPU
		      Bottleneck --> Memory
		      Bottleneck --> Streaming
		      CPU -->|Fix| CPUFix["Voice limiting\nDSP optimization\nVoice stealing"]
		      Memory -->|Fix| MemFix["Compress audio\nStream large files\nUnload unused banks"]
		      Streaming -->|Fix| StreamFix["SSD storage\nPreload critical audio\nBuffer size tuning"]
		  ```
	-
	- ## Voice Management
	  collapsed:: true
		- > [!info] What is Voice Limiting?
		  > A "voice" = one actively playing sound. GPUs have thousands of shader cores but CPUs can only mix ~100–500 voices efficiently.
		  > Voice stealing = when max voices reached, the least important voice is stopped to make room.
		- | Strategy | Description |
		  |----------|-------------|
		  | Voice limit | Set max simultaneous voices (e.g., 64 SFX, 4 music) |
		  | Voice stealing | Stop lowest priority voice when limit reached |
		  | Distance culling | Don't play sounds beyond max audible distance |
		  | Priority system | High priority (player, boss) never stolen |
		  | Virtualization | Distant sounds tracked but not mixed — resume when close |
		- ```cpp
		  // FMOD — set max voices per event
		  // In FMOD Studio: Event → Max Instances → set limit
		  // In code: check if event is already playing
		  FMOD::Studio::EventDescription* desc;
		  studioSystem->getEvent("event:/SFX/Footstep", &desc);

		  int instanceCount;
		  desc->getInstanceCount(&instanceCount);

		  if (instanceCount < 4) { // max 4 simultaneous footsteps
		      // Create and play new instance
		  }
		  ```
	-
	- ## Compression Settings
	  collapsed:: true
		- | Audio Type | Recommended Format | Sample Rate | Channels | Notes |
		  |-----------|-------------------|-------------|----------|-------|
		  | Music | OGG (Vorbis Q6-8) | 44,100 Hz | Stereo | Stream from disk |
		  | Long ambient | OGG (Vorbis Q4-6) | 44,100 Hz | Stereo | Stream from disk |
		  | Short SFX | ADPCM or PCM | 44,100 Hz | Mono | Load into memory |
		  | Voice acting | OGG (Vorbis Q5-7) | 44,100 Hz | Mono | Stream from disk |
		  | UI sounds | PCM (uncompressed) | 44,100 Hz | Mono | Load into memory |
		  | Footsteps | ADPCM | 22,050 Hz | Mono | Load into memory |
	-
	- ## Audio Optimization Checklist
	  collapsed:: true
		- > [!tip] Optimization Checklist
		  > - ✅ Use mono for non-spatial SFX (saves 50% memory vs stereo)
		  > - ✅ Compress music and long ambients (OGG, not WAV)
		  > - ✅ Stream large files from disk, load small SFX into memory
		  > - ✅ Set voice limits per event type
		  > - ✅ Use distance culling — don't play sounds beyond hearing range
		  > - ✅ Reduce sample rate for non-critical sounds (22,050 Hz for footsteps)
		  > - ✅ Pool AudioSource components — don't create/destroy per sound
		  > - ✅ Unload audio banks when leaving a level
		  > - ✅ Profile with FMOD Profiler or Wwise Profiler before shipping

- # Sound Design Techniques
  collapsed:: true
	- ## Layering & Variation
	  collapsed:: true
		- > [!tip] The Golden Rule of SFX
		  > Never play the exact same sound twice in a row. Players notice repetition immediately.
		  > Always add pitch variation, volume variation, or use a pool of variations.
		- | Technique | How | Example |
		  |-----------|-----|---------|
		  | Pitch variation | ±5–15% random pitch | Footsteps, gunshots |
		  | Volume variation | ±2–6 dB random | Ambient sounds |
		  | Sample pool | 3–8 variations, random pick | Footsteps, impacts |
		  | Layering | Combine 2–4 sounds | Explosion = boom + debris + rumble |
		  | Randomization | Random start position in file | Ambient loops |
	-
	- ## Procedural Audio
	  collapsed:: true
		- > [!info] Procedural Audio
		  > Instead of pre-recorded samples, procedural audio generates sound mathematically in real time.
		  > Advantages: infinite variation, no memory cost, reacts to physics parameters.
		- | Use Case | Approach |
		  |---------|---------|
		  | Engine sounds | Synthesize based on RPM parameter |
		  | Wind | Filtered noise based on speed |
		  | Rain | Granular synthesis based on intensity |
		  | Footsteps | Synthesize based on surface material + weight |
		  | Destruction | Physical simulation drives audio parameters |
		- ```gdscript
		  # Simple procedural engine sound in Godot
		  extends AudioStreamPlayer

		  @export var min_pitch: float = 0.5
		  @export var max_pitch: float = 2.0

		  func update_engine_sound(rpm_normalized: float) -> void:
		      # rpm_normalized: 0.0 = idle, 1.0 = redline
		      pitch_scale = lerp(min_pitch, max_pitch, rpm_normalized)
		      volume_db   = lerp(-12.0, 0.0, rpm_normalized)
		  ```
	-
	- ## Foley & SFX Categories
	  collapsed:: true
		- | Category | Examples | Design Notes |
		  |----------|---------|-------------|
		  | Footsteps | Walk, run, jump, land | Surface-dependent, pitch variation |
		  | Weapons | Fire, reload, impact, shell casing | Layer: mechanical + impact + tail |
		  | UI | Button click, hover, confirm, error | Short, punchy, distinct |
		  | Ambient | Wind, rain, crowd, forest | Loop seamlessly, layer multiple |
		  | Character | Breathing, grunts, voice | Emotional state-dependent |
		  | Environment | Doors, switches, machinery | Mechanical feel, weight |
		  | Magic/Sci-fi | Spells, lasers, portals | Designed, not realistic |
- # Logseq Graph Connections
  collapsed:: true
	- tags:: game-audio, fmod, wwise, audio-middleware, spatial-audio, adaptive-music, dsp, sound-design
	- Related pages:
		- [[Game Development]] — audio concepts overview (spatial audio, audio middleware basics)
		- [[Game Design]] — how audio serves game design goals (emotion, feedback, immersion)
		- [[Godot]] — Godot AudioStreamPlayer, buses, and audio effects
		- [[Unity]] — Unity AudioSource, AudioMixer, and FMOD/Wwise integration
		- [[Unreal Engine]] — Unreal MetaSound, Sound Cues, and Wwise integration
		- [[Advanced Graphics]] — rendering pipeline that audio must sync with
		- [[Free Assets]] — free audio assets, SFX packs, and music resources
- # More Learn
	- ## Official Documentation
		- [FMOD Documentation](https://www.fmod.com/docs/) — Complete FMOD Studio and API reference.
		- [FMOD Learning Resources](https://www.fmod.com/learn) — Official tutorials, videos, and examples.
		- [Wwise Documentation](https://www.audiokinetic.com/library/edge/) — Complete Wwise reference.
		- [Wwise Certification (Free)](https://www.audiokinetic.com/courses/wwise101/) — Free official Wwise 101 course.
		- [Steam Audio Docs](https://valvesoftware.github.io/steam-audio/) — Free spatial audio SDK by Valve.
		- [Resonance Audio (Google)](https://resonance-audio.github.io/resonance-audio/) — Free HRTF spatial audio SDK.
	-
	- ## Free Learning Resources
		- [Game Audio GDC Talks](https://gdcvault.com/free/gdc-14?keyword=audio) — Free GDC audio talks from industry professionals.
		- [Designing Sound](https://designingsound.org/) — Sound design articles, interviews, and tutorials.
		- [A Sound Effect](https://www.asoundeffect.com/learning/) — Free sound design tutorials and articles.
		- [Game Audio Podcast](https://www.gameaudiopodcast.com/) — Industry interviews and discussions.
	-
	- ## Free Audio Assets
		- [Freesound.org](https://freesound.org/) — Huge library of free CC-licensed sound effects.
		- [OpenGameArt Audio](https://opengameart.org/art-search-advanced?keys=&field_art_type_tid%5B%5D=12) — Free game audio under open licenses.
		- [Kenney Audio](https://kenney.nl/assets?q=audio) — Free CC0 audio packs for games.
		- [Free Music Archive](https://freemusicarchive.org/) — Free music under Creative Commons.
		- [ccMixter](https://ccmixter.org/) — Free Creative Commons music for games.