---
seoTitle: Console Certification Complete Guide – TRC, TCR & LOT Checks
description: "Comprehensive console certification reference covering PlayStation TRC, Xbox TCR, Nintendo LOT checks, submission process, common failure points, automated checklist, and patch cert workflow."
keywords: "console certification, TRC PlayStation, TCR Xbox, LOT checks Nintendo, game certification, cert submission, certification checklist, console QA, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Console Certification – Complete Development Guide
enableToc: true
comments: true
---

> [!danger] Certification Reality Check
> Every game, patch, and DLC in [[Console Development]] **must** pass certification before it can appear on a console store.
> A **failed cert submission** means weeks of delay + re-submission fees.
> Knowing the rules before shipping saves enormous time and money.

- # History
	- ## How
		- Began in the 1980s with the "Nintendo Seal of Quality" to prevent the market crash caused by untested, low-quality games (like Atari's E.T.).
		- Evolved into rigid technical standards to protect console hardware, user privacy, and ensure system stability.
	- ## Who
		- **Sony PlayStation** — TRC (Technical Requirements Checklist)
		- **Microsoft Xbox** — TCR (Technical Certification Requirements)
		- **Nintendo** — LOT Checks (named after manufacturing batches)
	- ## Why
		- Ensure games do not crash consoles or brick hardware.
		- Guarantee consistent user experience (UX) on the platform.
		- Verify platform features (Achievements, Cloud Saves, Multiplayer) are implemented correctly.
		- Prevent piracy and unauthorized network access.
		- Protect consumer data and privacy.

- # Core Concepts & Terminology
  collapsed:: true
	- ## The Certification Triad
	  
	  ```mermaid
	  graph LR
	     Cert["🎮 Certification"]
	     TRC["PlayStation TRC\nFocus: App Lifecycle\nUser Management\nTrophies"]
	     TCR["Xbox TCR\nFocus: Quick Resume\nXbox Live\nAccessibility"]
	     LOT["Nintendo LOT\nFocus: Sleep Mode\nJoy-Con States\nThermal Limits"]
	     Cert --> TRC
	     Cert --> TCR
	     Cert --> LOT
	  ```
	- ## Key Terminology
		- | Term | Definition |
		  |------|-----------|
		  | Submission Build | The final, compiled game sent to the platform holder |
		  | Vetting / Cert | The process of testing by the platform holder's QA team |
		  | Waiver | Requesting permission to bypass a specific rule for valid reasons |
		  | Day-One Patch | An update released simultaneously with the game to fix last-minute bugs |
		  | Soak Test | Running the game idle for 8-12+ hours to detect memory leaks |
		  | IQA | Internal Quality Assurance (your own team testing against cert rules) |
	- ## Submission Timeline Architecture
	  
	  ```mermaid
	  graph TD
	      Dev["Development Complete\n(Content Complete)"] --> IQA["Internal QA Testing\n(Run TCR/TRC/LOT Checklist)"]
	      IQA --> Fix{"Issues Found?"}
	      Fix -->|Yes| FixBugs["Fix All Issues"]
	      FixBugs --> IQA
	      Fix -->|No| Build["Create Submission Build"]
	      Build --> Upload["Upload to Partner Portal"]
	      Upload --> PlatformQA["Platform Holder QA Testing"]
	      PlatformQA --> Result{"Pass?"}
	      Result -->|Pass| Approved["Game Approved! 🎉"]
	      Result -->|Fail| Report["Failure Report Issued"]
	      Report --> FixBugs2["Fix Listed Issues"]
	      FixBugs2 --> Build
	  ```
	- ## Certification Timeline
		- | Platform | Typical Review Time | Re-submission Fee | Notes |
		  |----------|--------------------|--------------------|-------|
		  | PlayStation | 2–4 weeks | Yes (varies by partner tier) | Slower for first submissions |
		  | Xbox | 1–2 weeks | Yes | Faster turnaround generally |
		  | Nintendo | 2–3 weeks | Yes | Very strict, thorough testing |
		- > [!warning] Plan Cert Into Your Schedule
		  > A single failed cert round = 2–6 weeks of delay.
		  > Always plan for **at least 2 cert rounds** in your release schedule.
		  > Major release windows (Christmas, summer sales) have longer queues.

- # PlayStation TRC (Technical Requirements Checklist)
  collapsed:: true
	- ## TRC Fundamentals
		- **TRC** = Technical Requirements Checklist (see [[Console Development - PlayStation]])
		- PlayStation TRCs are divided into categories:
		  - **Required** (MUST pass — automatic fail if violated)
		  - **Recommended** (SHOULD implement — not a fail, but noted)
		- TRC documents are provided via the PlayStation Partners portal. Updated periodically — always use the current version!
		- **Major TRC Categories:**
		  - Application Lifecycle — start, suspend, resume, shutdown
		  - User Management — multiple users on one console
		  - Save Data — save system behavior
		  - Trophy System — trophy implementation
		  - Online Features — PSN integration requirements
		  - Network Access — internet usage policies
		  - UI & UX — button mapping, icons, accessibility
		  - Content Rating — PEGI/ESRB rating display
		  - Localization — language support requirements
		  - Audio — DualSense audio routing
		  - Performance — no indefinite hangs
	- ## Critical TRC Requirements (Highest Failure Rates)
		- | Requirement | Category | Description | Defense / Fix |
		  |-------------|----------|-------------|---------------|
		  | TRC-R4001 | App Lifecycle | Game must start within 15 seconds of launch icon press | Minimize startup work, show loading screen immediately |
		  | TRC-R4002 | App Lifecycle | Game must respond to suspend event within 5 seconds | Flush IO, pause audio, disconnect network in suspend handler. Never block suspend handler. |
		  | TRC-R4003 | App Lifecycle | Game must handle unexpected shutdown gracefully | Auto-save every 15 minutes minimum, never corrupt save on crash |
		  | TRC-R4004 | User Management| Game must handle profile switch (user switch mid-game) | Save current user progress, prompt to save before switch |
		  | TRC-S1001 | Save Data | Never write to save during scene loads (IO bottleneck) | Perform IO asynchronously or at safe checkpoints |
		  | TRC-S1002 | Save Data | Must warn player before a non-reversible action (delete save) | Add confirmation dialogs for destructive actions |
		  | TRC-S1003 | Save Data | Save data must survive console shutdown mid-write | Use temp file + atomic rename (atomic write pattern) |
		  | TRC-T1001 | Trophies | Every PS4/PS5 game MUST have at least one trophy set | Basic trophy set implementation |
		  | TRC-T1002 | Trophies | Trophies must not be unlockable by in-game purchase | Decouple all trophy triggers from microtransactions |
		  | TRC-T1003 | Trophies | Trophy artwork must meet resolution requirements (256×256) | Ensure all assets match SDK guidelines |
		  | TRC-T1004 | Trophies | Trophy descriptions must be accurate | No "TBD" or placeholder text in submission |
	- ## Common TRC Failures
		- | Failure | Root Cause | Fix |
		  |---------|-----------|-----|
		  | Game freezes on suspend | Not handling suspend event | Implement PLM (Process Lifecycle Management) callbacks |
		  | Wrong button icons shown | PS button mapping swapped | Use platform SDK button icons |
		  | Trophy unlocks on purchase | Paid unlock linked to trophy | Decouple trophy from IAP |
		  | Save data lost on crash | Non-atomic save writes | Use temp file + atomic rename |
		  | Game won't start in 15s | Heavy loading at startup | Defer loading to post-launch |
		  | Missing age rating | No PEGI/ESRB rating display | Add rating screen at startup |
		  | Network access without warning | Silent background downloads | Show network permission prompt |
		  | User switch crash | No multi-user handling | Test with user switch mid-game |
		  | Missing language | Required locale not shipped | Add all required EU languages |
	- ## Atomic Save Pattern (TRC-S1003)
	  > [!tip] Defense Principle: Fail Secure
	  > Never overwrite a save file directly. If power is lost mid-write, the save is destroyed.
	  
	  ```cpp
	  // C++ Atomic Save Concept
	  bool SaveGameSafe(const SaveData& data, const char* savePath) {
	      // 1. Write to temporary file
	      std::string tempPath = std::string(savePath) + ".tmp";
	      FILE* tempFile = fopen(tempPath.c_str(), "wb");
	      if (!tempFile) return false;
	      
	      // 2. Write data + checksum
	      uint32_t checksum = CalculateCRC32(&data, sizeof(data));
	      fwrite(&data, sizeof(data), 1, tempFile);
	      fwrite(&checksum, sizeof(checksum), 1, tempFile);
	      
	      // 3. Flush to ensure OS writes to disk
	      fflush(tempFile);
	      fclose(tempFile);
	      
	      // 4. Atomic rename — if power lost here, old save intact
	      //    If power lost before here, temp file is corrupted (not real save)
	      rename(tempPath.c_str(), savePath);
	      
	      return true;
	  }
	  
	  bool LoadGameSafe(SaveData& data, const char* savePath) {
	      FILE* file = fopen(savePath, "rb");
	      if (!file) return false;
	      
	      SaveData loadedData;
	      uint32_t storedChecksum, calcChecksum;
	      
	      fread(&loadedData, sizeof(loadedData), 1, file);
	      fread(&storedChecksum, sizeof(storedChecksum), 1, file);
	      fclose(file);
	      
	      // Verify integrity
	      calcChecksum = CalculateCRC32(&loadedData, sizeof(loadedData));
	      if (calcChecksum != storedChecksum) {
	          // Corrupted — try backup save
	          return LoadBackupSave(data);
	      }
	      
	      data = loadedData;
	      return true;
	  }
	  ```

- # Xbox TCR (Technical Certification Requirements)
  collapsed:: true
	- ## TCR Fundamentals
		- **TCR** = Technical Certification Requirements
		- Xbox TCR documents are provided via Partner Center (see [[Console Development - Xbox]]). ID@Xbox members get full TCR documentation.
		- **TCR Categories:**
		  - Fundamentals — startup, crash recovery, input
		  - Xbox Live — achievements, presence, cloud saves
		  - Game Hub — store listing, screenshots, trailers
		  - Accessibility — required accessibility features
		  - Multiplayer — online session requirements
		  - Content — age ratings, content policies
		  - Performance — hang detection, memory
		  - Packaging — binary format requirements
		  - Update — title update requirements
		  - Quick Resume — suspend/resume behavior
	- ## Critical TCR Requirements
		- | Requirement | Category | Description | Defense / Fix |
		  |-------------|----------|-------------|---------------|
		  | TCR-F001 | Fundamentals | Game must start in under 2 minutes from logo to gameplay | Optimize startup loading, add progress indicator |
		  | TCR-F002 | Fundamentals | Game must never hang (infinite loop with no output) | Watchdog timer — force-restart if no progress in 60s |
		  | TCR-F003 | Fundamentals | Game must handle all 4 users on one console | Test every feature with 4 different user accounts |
		  | TCR-XBL001 | Xbox Live | Achievements must unlock during normal gameplay only | No dev-console commands to force-unlock achievements |
		  | TCR-XBL002| Xbox Live | Cloud saves must sync before save access | Wait for XGameSave sync before reading/writing saves |
		  | TCR-XBL003| Xbox Live | Presence string must reflect current activity | Update presence string on game state change |
		  | TCR-QR001 | Quick Resume | Game must resume from Quick Resume in under 15 seconds | Handle OS resume signal efficiently |
		  | TCR-QR002 | Quick Resume | After Quick Resume, all gameplay must function correctly | Reconnect audio, network, validate game state on resume |
		  | TCR-ACC001 | Accessibility | Game must support button remapping (or use system remapping) | Implement UI or inherit OS settings |
		  | TCR-ACC002 | Accessibility | Game must support Narrator (screen reader) in menus | Add proper UI focus management and accessible labels |
	- ## Common TCR Failures
		- | Failure | Root Cause | Fix |
		  |---------|-----------|-----|
		  | Hang on startup | Deadlock waiting for Xbox Live | Add timeout fallback |
		  | Quick Resume broken | Network state not restored | Reconnect on resume |
		  | Achievement unlockable via cheat | Dev test code left in | Remove all bypass code |
		  | Save corruption on user switch | Wrong user handle | Re-init save provider on switch |
		  | UI not accessible | No focus/narrator support | Add automation IDs to UI |
		  | Presence not updated | Static presence string | Hook into game state changes |
		  | Multi-user crash | Untested with 4 users | Test all user combinations |
		  | Game doesn't use Smart Delivery | Same binary for all | Configure GDK chunking |
	- ## Quick Resume Flow
	  
	  ```mermaid
	  sequenceDiagram
	      participant OS as Xbox OS
	      participant G as Game
	      OS->>G: Suspend Event
	      Note over G: Pause Audio, Drop Network, Flush Save
	      G->>OS: Suspend Complete
	      Note over OS: Game state saved to NVMe
	      OS->>G: Resume Event
	      Note over G: Reconnect Network, Restore Audio
	      G->>OS: Ready
	  ```

- # Nintendo LOT Checks
  collapsed:: true
	- ## LOT Checks Fundamentals
		- **LOT Check** = [[Console Development - Nintendo Switch]] certification process. Named "LOT" from Japanese manufacturing term (lot = batch).
		- Nintendo is the strictest of the three platforms. LOT checks are extremely thorough — expect 50–150+ test cases.
		- **LOT Check Categories:**
		  - Basic Operation — start, stop, error handling
		  - Sleep Mode — lid closed, wake behavior
		  - Joy-Con handling — attach/detach during play
		  - Network — online features, offline fallback
		  - Save Data — corruption resistance
		  - Controller types — all supported controllers
		  - Handheld/Docked — mode switching
		  - amiibo — if supported
		  - Local Wireless — if supported
		  - Nintendo Switch Online — if using NSO multiplayer
		  - Content Policies — age ratings, violent content rules
		  - Language support — required languages per region
	- ## Critical LOT Rules
		- | Requirement | Category | Description | Defense / Fix |
		  |-------------|----------|-------------|---------------|
		  | LOT-001 | Sleep Mode | Game must handle sleep (lid closed) within 2 seconds | Pause game, stop audio, suspend network on sleep signal |
		  | LOT-002 | Sleep Mode | Game must resume from sleep correctly | Resume audio, refresh network connections, sync time |
		  | LOT-003 | Sleep Mode | Save data must not corrupt on sleep during save | Never save during sleep transition (atomic writes) |
		  | LOT-010 | Joy-Con | Joy-Con detach during gameplay must not crash | Handle NpadId disconnect event gracefully, pause or show prompt |
		  | LOT-011 | Joy-Con | All gameplay must be playable with one Joy-Con (horizontal) | In single Joy-Con mode, remap to SL/SR/stick only (OR explicitly declare game requires dual Joy-Con) |
		  | LOT-012 | Controller | Pro Controller must work if game supports it | Test all controller types — NpadStyleSet must be correct |
		  | LOT-020 | Performance | Handheld mode must maintain minimum 30 FPS | Dynamic resolution, reduce quality in handheld. Fail: If game dips to <20 FPS regularly in handheld |
		  | LOT-021 | Performance | Docked mode must not exceed thermal limits | Nintendo monitors GPU temperature — don't run at 100% GPU 100% of time |
		  | LOT-022 | Performance | Battery drain must not exceed specified rate | Monitor GPU/CPU utilization — use Nintendo's power profiler |
	- ## Common LOT Failures
		- | Failure | Root Cause | Fix |
		  |---------|-----------|-----|
		  | Crash on Joy-Con detach | NpadId not handled | Handle disconnect event |
		  | Sleep corrupts save | IO during sleep transition | Block saves during transition |
		  | <30 FPS in handheld | No performance scaling | Add dynamic resolution |
		  | Can't play with single Joy-Con | No horizontal mode support | Add or explicitly exclude |
		  | Network crash offline | No offline fallback | Test all features offline |
		  | No Japanese language | Missing required locale | Add JP text + Nintendo fonts |
		  | amiibo crash (if using) | NFC not tested all models | Test all amiibo series |
		  | Overheat (thermal) | GPU at 100% non-stop | Cap GPU usage, add thermal monitoring |
	- ## Sleep Mode Handling
	  > [!warning] Top Failure Point
	  > Sleep mode failures are the #1 reason for LOT check rejection.
	  
	  ```cpp
	  // Nintendo Switch sleep mode handling (conceptual)
	  
	  // Register for system event callbacks
	  AppletHookCookie hookCookie;
	  appletHook(&hookCookie, AppletHookCallback, nullptr);
	  
	  void AppletHookCallback(AppletHookType type, void* param) {
	      switch (type) {
	      case AppletHookType_OnExitRequest:
	          // Player pressed home button — exit cleanly
	          g_gameRunning = false;
	          SaveGameState();        // save progress
	          AudioEngine::Shutdown();
	          NetworkManager::Disconnect();
	          break;
	          
	      case AppletHookType_OnFocusState:
	          // Focus changed (sleep, overlay, etc.)
	          AppletFocusState focusState = appletGetFocusState();
	          
	          if (focusState == AppletFocusState_InFocus) {
	              // Resumed — restore everything
	              AudioEngine::Resume();
	              NetworkManager::ReconnectAsync();
	              SyncGameTime();
	          } else {
	              // Lost focus — pause game
	              AudioEngine::Suspend();
	              g_gamePaused = true;
	          }
	          break;
	          
	      case AppletHookType_OnOperationMode:
	          // Docked/handheld mode changed
	          AppletOperationMode mode = appletGetOperationMode();
	          bool isDocked = (mode == AppletOperationMode_Console);
	          RenderSettings::AdjustForMode(isDocked);
	          break;
	      }
	  }
	  ```

- # Pre-Certification Checklist
  collapsed:: true
	- ## Universal Requirements (All Platforms)
		- ```
		  [ ] Game launches successfully from cold start
		  [ ] Game launches successfully from sleep/suspend resume
		  [ ] Game handles unexpected shutdown without save corruption
		  [ ] Save data writes are atomic (temp file + rename)
		  [ ] Backup save exists and loads on primary corruption
		  [ ] All supported controller types tested
		  [ ] Correct platform button icons shown (not generic / wrong platform)
		  [ ] Age rating displayed at startup (ESRB/PEGI/CERO)
		  [ ] Game handles multiple user accounts
		  [ ] Online features degrade gracefully when offline
		  [ ] No debug/dev-only code paths in submission build
		  [ ] All required languages shipped (check per-region requirements)
		  [ ] All placeholder text removed ("TODO", "TBD", "PLACEHOLDER")
		  [ ] Game does not access filesystem paths it doesn't own
		  [ ] No infinite loops / hangs tested (10 hour soak test)
		  [ ] Memory usage within approved budget
		  [ ] Frame rate meets minimum target (30 FPS minimum, sustained)
		  ```
	- ## PlayStation-Specific Checklist
		- ```
		  [ ] Trophy set implemented correctly (at least 1 set, Platinum if 2+ Gold)
		  [ ] Trophy artwork at correct resolution (256×256 PNG)
		  [ ] DualSense haptics implemented (required for PS5 certification)
		  [ ] Adaptive triggers implemented or explicitly disabled
		  [ ] Activity Cards configured (PS5 recommended)
		  [ ] Game Help hints configured (PS5 recommended)
		  [ ] Suspend event handled within 5 seconds
		  [ ] PSN presence string updated correctly
		  [ ] Save data uses PSN save APIs (not raw filesystem)
		  [ ] Cross-save implemented if supporting PS4 → PS5 upgrade
		  [ ] PS4 → PS5 upgrade path tested (if supporting both)
		  ```
	- ## Xbox-Specific Checklist
		- ```
		  [ ] Achievements implemented (1,000 Gamerscore base)
		  [ ] Achievement artwork at correct resolution (1920×1080 min)
		  [ ] Cloud saves implemented via Xbox Game Save API
		  [ ] Quick Resume implemented (game resumes cleanly from suspended state)
		  [ ] Presence string updates with game state
		  [ ] Smart Delivery configured if shipping Xbox One + Series versions
		  [ ] Button remapping supported (or system remapping enabled)
		  [ ] Narrator/accessibility mode tested in all menus
		  [ ] 4-user local testing (all features work with 4 different accounts)
		  [ ] PLM events handled (suspend, resume, constrained)
		  [ ] Network timeout tested (graceful offline handling)
		  [ ] MicrosoftGame.config correct (TitleId, StoreId, version)
		  ```
	- ## Nintendo Switch-Specific Checklist
		- ```
		  [ ] Sleep mode tested (lid close + wake-up)
		  [ ] Joy-Con detach tested mid-gameplay (no crash)
		  [ ] All controller types tested: dual Joy-Con, single Joy-Con, Pro Controller
		  [ ] Handheld mode performance: sustained 30 FPS
		  [ ] Docked mode resolution: 1080p output
		  [ ] Mode switch (dock/undock) tested during gameplay
		  [ ] HD Rumble implemented (required for Joy-Con games)
		  [ ] Home button press handled (game pauses gracefully)
		  [ ] Offline mode tested (all features without internet)
		  [ ] Japanese fonts included if shipping in Japan
		  [ ] Battery drain within Nintendo guidelines (6 hour minimum target)
		  [ ] Thermal stress test (1 hour continuous play, check for throttling)
		  [ ] microSD card tested (slower load times — no hang)
		  [ ] System applets tested: camera, news, shop overlays don't crash game
		  ```

- # Security & Hardening for Cert
  collapsed:: true
	- ## Build Hardening
	  > [!danger] Never Submit Dev Builds
	  > Debug features left in submission builds will result in an immediate certification failure.
		- **1. Remove all dev shortcuts:**
		  - No "press F1 to unlock all levels"
		  - No invincibility debug modes
		  - No achievement force-unlock commands
		  - No "skip to level" console commands
		- **2. Remove all placeholder content:**
		  - No "TODO" strings in any text
		  - No missing translation strings (should fallback to English, not crash)
		  - No broken asset references (missing textures show as error in cert)
		- **3. Run the build in certification mode:**
		  - PlayStation: use devkit in "Testkit" mode (simulates retail behavior)
		  - Xbox: enable "Retail Sandbox" mode
		  - Switch: use EDEV in production mode
	- ## Robust Testing Strategies
		- | Strategy | Description |
		  |----------|-------------|
		  | Soak Testing | Leave game running for 8–12 hours straight (memory leak detection) and in menus overnight |
		  | Stress Testing | Rapid controller connect/disconnect for 30 minutes, spam UI buttons |
		  | Edge Cases | Full storage (no space for save) — show error, don't crash. Network disconnect mid-session |
	- ## Submission Checklist Final
		- ```
		  Final submission checklist:
		  
		  Build:
		  [ ] Build compiled in Release/Final mode (not Debug)
		  [ ] Correct version number in manifest
		  [ ] Platform SDK version matches required minimum
		  
		  Store Listing:
		  [ ] Game title correct
		  [ ] Description accurate and in all required languages
		  [ ] Screenshots meet resolution requirements
		  [ ] Trailer uploaded (if required)
		  [ ] Age rating certificate uploaded (ESRB/PEGI/CERO submission done)
		  [ ] Content descriptor flags set correctly (violence, language, etc.)
		  [ ] Price and release date set
		  
		  Technical:
		  [ ] All platform TRC/TCR/LOT items verified
		  [ ] Soak test passed (8+ hours)
		  [ ] Crash-free on all target hardware
		  [ ] Performance targets met on all hardware
		  
		  Submit:
		  [ ] Upload to partner portal
		  [ ] Fill out submission questionnaire
		  [ ] Specify submission type (initial / patch / DLC)
		  [ ] Note any waiver requests (if any requirements inapplicable)
		  [ ] Confirm contact info for cert team questions
		  ```

- # Patch Certification
  collapsed:: true
	- ## Title Updates
		- Every patch requires certification — same process as initial submission.
		- **Patch certification is typically faster:**
		  - Platform has your game in their system already
		  - Only changed features need full testing (regression testing)
		  - Emergency patches (game-breaking bugs) can request expedited review
		- **Patch strategies:**
		  - Plan patch submissions 3–4 weeks before desired live date
		  - Batch small fixes — don't submit weekly (each submission takes time)
		  - Test patches on the same hardware as original cert
	- ## Hotfixes & Day-One Patches
		- **Day-one patch:**
		  - Very common — final cert changes fixed post-submission
		  - Submit day-one patch immediately after initial cert passes
		  - Platform approves simultaneously when possible
		- **Hotfix (emergency):**
		  - Contact partner manager — explain severity (crash/data loss)
		  - Platform holders have expedited process for game-breaking issues
		  - Submit fix ASAP — document the bug and fix clearly

- # Key Takeaways
	- Always build with certification in mind from day one (especially save architecture and UI accessibility).
	- Implement atomic saves and graceful sleep/suspend handling immediately; retrofit is difficult.
	- Perform internal 8-12 hour soak tests before submitting any build.
	- A failed certification can cost a month of time; test thoroughly against platform documentation.

- # More Learn
	- ## Github & Webs
		- [Xbox Developer Docs (Public Overview)](https://developer.microsoft.com/en-us/games/xbox/)
		- [PlayStation Partners](https://partners.playstation.net/)
		- [Nintendo Developer Portal](https://developer.nintendo.com/)
		- [Game Certification Best Practices](https://github.com/topics/game-development)