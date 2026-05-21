---
seoTitle: Game Testing & QA – Playtesting, Bug Tracking, Performance Profiling & Automated Testing Guide
description: "Complete game testing and QA reference covering playtesting methodologies, bug tracking workflows, performance profiling tools, and automated testing frameworks for game developers across all platforms."
keywords: "game testing, game QA, playtesting, bug tracking, performance profiling, automated testing for games, game quality assurance, game development testing, Unity testing, Unreal Engine testing, VR-Rathod, Code-Note"
displayTitle: Game Testing & QA
---

> [!info] About This Page
> This page covers **game-specific testing and quality assurance** — from playtesting sessions to shipping a polished, bug-free game.
> Sub-pages: [[Game Testing & QA - Playtesting]], [[Game Testing & QA - Bug Tracking]], [[Game Testing & QA - Performance Profiling]], [[Game Testing & QA - Automated Testing]].
> For general software testing see [[QA and Testing]].
> For console-specific profiling tools see [[Console Development]].

> [!important] Why Game QA is Different
> Game testing is fundamentally different from software testing. Games must be **fun**, **fair**, **stable**, and **performant** simultaneously — and "fun" is not a unit-testable metric. A hybrid of manual playtesting, automated regression, and platform-specific profiling is always required.

- # Game QA vs Software QA
  collapsed:: true
	- ## Key Differences
	  collapsed:: true
		- | Aspect | Software QA | Game QA |
		  |--------|------------|---------|
		  | Primary Goal | Correctness, reliability | Fun + correctness + performance |
		  | Test Cases | Deterministic, repeatable | Often non-deterministic (AI, physics) |
		  | "Pass" Criteria | Spec compliance | Player experience + spec |
		  | Tooling | Standard CI/CD | Custom engine profilers + CI |
		  | Testing Types | Unit, integration, E2E | Playtesting, profiling, soak, compliance |
		  | Automation Rate | High (70–90%) | Lower (30–50%) — manual play essential |
		  | Platform Targets | Web, server, mobile | PC, console, mobile, VR/AR |
		  | Certification | Rarely required | Mandatory on console (TRC/TCR/LOT) |
		  | Bug Severity | Crash, data loss | Crash, freeze, softlock, exploits, feels bad |
	-
	- ## Game QA Pillars
	  collapsed:: true
		- ```
		  Functionality  — Does it work as designed?
		    Features, menus, save/load, input, multiplayer
		  
		  Stability      — Does it crash or freeze?
		    Memory leaks, null refs, edge-case crashes, infinite loops
		  
		  Performance    — Does it run smoothly?
		    Frame rate, load times, GPU/CPU spikes, memory budget
		  
		  Balance        — Is it fair and fun?
		    Difficulty curves, economy balance, level design fairness
		  
		  Compliance     — Does it meet platform requirements?
		    TRC (Xbox), TRC PS (PlayStation), LOT (Nintendo), PEGI/ESRB ratings
		  ```
	-
	- ## Game Testing Pipeline
	  collapsed:: true
		- ```mermaid
		  flowchart TD
		      A[New Build / Feature] --> B[Smoke Test]
		      B --> C{Pass?}
		      C -->|No| D[Dev Fixes]
		      D --> A
		      C -->|Yes| E[Functional QA]
		      E --> F[Playtesting Session]
		      F --> G[Performance Profiling]
		      G --> H[Regression Suite]
		      H --> I{Release Candidate?}
		      I -->|No| J[Fix & Iterate]
		      J --> A
		      I -->|Yes| K[Platform Cert Submission]
		      K --> L{Pass Cert?}
		      L -->|No| M[Fix Cert Issues]
		      M --> K
		      L -->|Yes| N[Ship!]
		  ```
- # Sub-Pages
  collapsed:: true
	- [[Game Testing & QA - Playtesting]] — Structured playtesting sessions, feedback frameworks, focus groups, internal vs external testing, alpha/beta strategies.
	-
	- [[Game Testing & QA - Bug Tracking]] — Game-specific bug classification, severity tiers, softlock/exploit reporting, bug lifecycle in Jira/Trello/Hansoft, triage workflow.
	-
	- [[Game Testing & QA - Performance Profiling]] — GPU/CPU frame analysis, memory profiling, frame pacing, platform-specific profilers (PIX, Razor, NSight), optimization loop.
	-
	- [[Game Testing & QA - Automated Testing]] — Unit testing game logic, simulation testing, CI/CD for games, Unity Test Framework, Unreal Automation, headless testing, screenshot regression.
- # Game Bug Classification
  collapsed:: true
	- ## Severity Tiers (Game-Specific)
	  collapsed:: true
		- ```
		  S1 — Blocker / Critical:
		    Game crashes to desktop / console dashboard
		    Softlock (player permanently stuck, no way out)
		    Data corruption (save file destroyed)
		    Security exploit (cheat, RCE in online games)
		    Fails platform certification requirement
		    → Must fix before any release
		  
		  S2 — Major:
		    Feature completely broken (quest can't complete, enemy AI broken)
		    Consistent reproducible freeze (not crash)
		    Progression blocker (player can't advance main story)
		    Severe visual corruption (missing geometry, black screen)
		    → Must fix before gold/ship
		  
		  S3 — Moderate:
		    Feature partially broken (workaround exists)
		    Significant visual artifact
		    Audio desync or missing in key moment
		    Performance spike causing visible stutter in key area
		    → Fix before ship if possible, else document
		  
		  S4 — Minor:
		    Clipping (character clips through wall slightly)
		    Minor text/localization error
		    Minor visual pop-in
		    Non-critical audio glitch
		    → Fix in patch
		  
		  S5 — Cosmetic:
		    Typo, spacing, minor UI alignment
		    → Nice to fix, lowest priority
		  ```
	-
	- ## Game-Specific Bug Types
	  collapsed:: true
		- ```
		  Softlock         — Player stuck with no escape. Requires restart.
		  Hardlock         — Full freeze. Requires force quit.
		  Progression Bug  — Can't advance due to broken quest/trigger.
		  Collision Bug    — Player falls through world, walks through walls.
		  AI Bug           — Enemy behaves incorrectly (pathfinding, aggro).
		  Physics Bug      — Objects fly, ragdolls broken, joints explode.
		  Animation Bug    — T-pose, animation missing, blending broken.
		  Audio Bug        — SFX missing, wrong, looping endlessly, desync.
		  UI Bug           — HUD wrong values, menu broken, save not showing.
		  Save Bug         — Save corrupted, progress lost, data mismatch.
		  Network Bug      — Desync, rubber-banding, packet loss handling.
		  Exploit          — Player can skip content, get infinite resources.
		  Balance Bug      — Enemy too easy/hard, weapon overpowered.
		  Localization Bug — Wrong language text, overflow, missing strings.
		  Cert Bug         — Fails TRC/TCR/LOT requirement (console releases).
		  ```
- # Testing by Game Phase
  collapsed:: true
	- ## Pre-Alpha
	  collapsed:: true
		- ```
		  Focus: Core mechanics validation
		  
		  Tests:
		    ✅ Does the core loop work? (move, shoot, collect, progress)
		    ✅ Does the engine build without errors?
		    ✅ Are basic controls responsive?
		    ✅ First-pass playtesting: is the core fun?
		  
		  Testers: Internal devs only
		  ```
	-
	- ## Alpha
	  collapsed:: true
		- ```
		  Focus: Feature completeness + major stability
		  
		  Tests:
		    ✅ All features implemented and testable
		    ✅ Crash-free main paths
		    ✅ Save/Load works end-to-end
		    ✅ Internal playtesting: all areas of the game
		    ✅ First performance pass (no massive spikes)
		  
		  Testers: Internal QA team + select external testers
		  ```
	-
	- ## Beta
	  collapsed:: true
		- ```
		  Focus: Stability + balance + performance + polish
		  
		  Tests:
		    ✅ Extended playtesting (external players)
		    ✅ Load/soak testing (online games)
		    ✅ Performance profiling on target hardware
		    ✅ Localization QA
		    ✅ Accessibility testing
		    ✅ Regression suite clean
		  
		  Testers: Larger external beta group, influencers (closed/open beta)
		  ```
	-
	- ## Gold / Release Candidate
	  collapsed:: true
		- ```
		  Focus: Zero S1/S2 bugs. Cert-ready.
		  
		  Tests:
		    ✅ Full regression suite passed
		    ✅ Certification pre-check (TRC/TCR/LOT)
		    ✅ Day-one patch validation
		    ✅ Online stress test (for multiplayer games)
		    ✅ Final performance benchmarks on target hardware
		  
		  Note: Gold means master disc/package is ready to ship.
		  After submission to cert, no changes until cert result.
		  ```
- # Performance Targets
  collapsed:: true
	- ## Common Targets by Platform
	  collapsed:: true
		- | Platform | Min FPS | Target FPS | Resolution | Frame Budget |
		  |----------|---------|-----------|------------|--------------|
		  | PC (Low-end) | 30 | 60+ | 1080p | ~33ms / ~16ms |
		  | PC (High-end) | 60 | 120+ | 1440p–4K | ~8ms |
		  | PS5 | 30 | 60 | 4K (dynamic) | ~33ms / ~16ms |
		  | Xbox Series X | 30 | 60 | 4K (dynamic) | ~33ms / ~16ms |
		  | Nintendo Switch | 30 | 60 | 720p–1080p | ~33ms / ~16ms |
		  | Mobile (Android) | 30 | 60 | 1080p | ~33ms / ~16ms |
		  | Mobile (iOS) | 60 | 60 | Native | ~16ms |
		  | VR (PC) | 72 | 90–120 | Per-eye | ~11ms / ~8ms |
		  | VR (Standalone) | 72 | 90 | Per-eye | ~11ms |
	-
	- ## Frame Budget Breakdown
	  collapsed:: true
		- ```
		  60 FPS budget = 16.67ms per frame
		  
		  Typical breakdown (Action/RPG game):
		    CPU game logic         ~2ms
		    CPU culling + sorting  ~1ms
		    Draw call submission   ~2ms
		    GPU geometry           ~4ms
		    GPU lighting + shadow  ~4ms
		    GPU post-processing    ~2ms
		    Vsync + buffer swap    ~1ms
		    Headroom               ~0.67ms
		  
		  Rule of thumb: If any single pass > 5ms on target hardware → optimize it.
		  ```
- # Tools Overview
  collapsed:: true
	- ## Profiling Tools
	  collapsed:: true
		- | Tool | Platform | Type | Free? |
		  |------|---------|------|-------|
		  | Unity Profiler | PC/Console/Mobile | CPU/GPU/Memory | Yes (with Unity) |
		  | Unreal Insights | PC/Console/Mobile | CPU/GPU/Network | Yes (with UE) |
		  | PIX for Windows | Xbox/PC | GPU Frame Capture | Yes |
		  | Razor (Sony) | PlayStation | GPU/CPU/Memory | NDA (partner) |
		  | NSight Graphics | PC (NVIDIA) | GPU Frame Capture | Yes |
		  | RenderDoc | PC/Android | GPU Frame Capture | Yes, Open Source |
		  | Xcode Instruments | iOS/macOS | CPU/GPU/Memory | Yes (with Xcode) |
		  | Android GPU Inspector | Android | GPU Frame | Yes |
		  | Intel GPA | PC/Android | GPU Frame | Yes |
	-
	- ## Bug Tracking Tools
	  collapsed:: true
		- | Tool | Best For | Cost |
		  |------|---------|------|
		  | Jira | All studio sizes. Agile workflows. | Paid (free tier ≤10 users) |
		  | Hansoft | AAA game studios. Fast, powerful. | Paid |
		  | Hacknplan | Indie game dev. Game-centric. | Free + Paid |
		  | Trello | Small indie teams. Kanban board. | Free + Paid |
		  | GitHub Issues | Open source / small teams. | Free |
		  | Mantis BT | Open source bug tracker. | Free |
		  | DevTrack | Mid-to-large studios. | Paid |
	-
	- ## Automation Tools
	  collapsed:: true
		- | Tool | Engine | Language | Type |
		  |------|--------|---------|------|
		  | Unity Test Framework | Unity | C# | Unit + Integration |
		  | Unreal Automation Tool | Unreal | C++ / Blueprint | Functional + Perf |
		  | Godot GUT | Godot | GDScript | Unit |
		  | GameDriver | Unity/Unreal | C# / Python | UI + E2E |
		  | AltTester | Unity | C# | UI Automation |
		  | Playwright/Puppeteer | Web games | JavaScript | E2E browser |
		  | Robot Framework | Any | Python | E2E + acceptance |
- # Useful Links & Resources
	- ## Official Documentation
		- [Unity Test Framework](https://docs.unity3d.com/Packages/com.unity.test-framework@latest) — Unity's built-in testing suite
		- [Unreal Automation System](https://dev.epicgames.com/documentation/en-us/unreal-engine/automation-system-overview) — UE automation documentation
		- [Xbox PIX](https://devblogs.microsoft.com/pix/) — Xbox GPU profiler
		- [RenderDoc](https://renderdoc.org) — Open-source GPU frame capture
		- [Hacknplan](https://hacknplan.com) — Game-dev focused bug tracker
	-
	- ## Learning Resources
		- [GDC Vault – QA & Testing talks](https://gdcvault.com/search.php#&category=free&firstfocus=&keyword=QA) — Free QA talks from GDC
		- [IGDA QA SIG](https://igda.org/sigs/qa/) — International Game Developers Association QA group
		- [How AAA Studios do QA – GDC 2019](https://www.gdcvault.com/play/1025776) — Real-world pipeline insight
		- [Game Testing by Tim Fields](https://www.routledge.com/Game-Testing-All-In-One/Fields/p/book/9781683923718) — Comprehensive game testing book