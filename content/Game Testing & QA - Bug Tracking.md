---
seoTitle: Bug Tracking for Games – Game Testing & QA Guide
description: "Complete game bug tracking reference: severity tiers, game-specific bug types, bug lifecycle, triage workflows, Jira/Hansoft/Hacknplan setup, bug report templates, and softlock/exploit reporting."
keywords: "game bug tracking, bug report, game QA, softlock, bug severity, bug lifecycle, Jira game dev, Hansoft, Hacknplan, game testing workflow, VR-Rathod, Code-Note"
displayTitle: Game Testing & QA - Bug Tracking
---

> [!info] About This Page
> This page covers **game bug tracking** — how to classify, report, triage, and resolve bugs in a game development pipeline.
> Parent: [[Game Testing & QA]]. See also: [[Game Testing & QA - Playtesting]], [[Game Testing & QA - Performance Profiling]].

> [!important] Good Bug Reports Save Days
> A poorly written bug report can waste hours of developer time. A well-written report with clear repro steps, platform info, and a video/screenshot can be fixed in minutes.

- # Game Bug Severity Tiers
  collapsed:: true
	- ## Severity Classification
	  collapsed:: true
		- | Tier | Name | Definition | Action |
		  |------|------|-----------|--------|
		  | S1 | **Blocker** | Crash, softlock, data loss, cert failure | Block release. Fix immediately. |
		  | S2 | **Critical** | Major feature broken, no workaround | Must fix before ship |
		  | S3 | **Major** | Feature partially broken, workaround exists | Fix before ship if possible |
		  | S4 | **Minor** | Minor visual, audio glitch, edge case | Fix in next patch |
		  | S5 | **Cosmetic** | Typo, UI alignment, minor text issue | Fix when time allows |
	-
	- ## S1 Blocker Examples
	  collapsed:: true
		- ```
		  ✗ Game crashes to desktop when entering Level 3
		  ✗ Player softlocked after skipping cutscene (cannot move, no way out)
		  ✗ Save file corrupted after returning to main menu
		  ✗ Security exploit: duplicate any item using specific UI timing
		  ✗ Platform cert requirement failed: no system notification for invites
		  ```
	-
	- ## S2 Critical Examples
	  collapsed:: true
		- ```
		  ✗ Boss AI breaks after being stunned twice — stops attacking
		  ✗ Quest cannot be completed — NPC dialogue doesn't trigger
		  ✗ Enemy spawner loops infinitely — unrecoverable lag after 5 min
		  ✗ Major visual corruption: missing terrain mesh in open world
		  ```
	-
	- ## S3/S4/S5 Examples
	  collapsed:: true
		- ```
		  S3 — Moderate:
		    ✗ Character clips through low wall (workaround: avoid corner)
		    ✗ Audio desync during cutscene but game continues normally
		    ✗ Performance spike at specific spot (not consistent stutter)
		  
		  S4 — Minor:
		    ✗ Hair clips through shoulder pad in specific animation
		    ✗ Background NPC animation loops incorrectly
		    ✗ Button prompt flashes wrong icon for one frame on load
		  
		  S5 — Cosmetic:
		    ✗ Typo in lore book page 7
		    ✗ Menu button 2px off alignment
		    ✗ Minor inconsistency in font weight on settings screen
		  ```

- # Game-Specific Bug Types
  collapsed:: true
	- ## Core Game Bugs
	  collapsed:: true
		- ```
		  Softlock         — Player stuck with no escape. Must restart.
		  Hardlock         — Full freeze. Requires force quit / reboot.
		  Progression Bug  — Cannot advance story/quest due to broken trigger.
		  Collision Bug    — Falls through world, walks through walls.
		  Save Bug         — Progress lost, save corrupted, data mismatch.
		  Exploit          — Player bypasses intended limits (dupe glitch, OOB).
		  ```
	-
	- ## Visual Bugs
	  collapsed:: true
		- ```
		  T-Pose           — Skeleton defaults to rest pose (animation bug)
		  Z-Fighting       — Two surfaces at same depth, flickering
		  Texture Pop-In   — Texture loads visibly late during play
		  LOD Pop          — Model detail changes abruptly at wrong distance
		  Shadow Artifact  — Shadow flicker, banding, or disappearing
		  Clipping         — Characters/objects passing through each other
		  ```
	-
	- ## AI & Physics Bugs
	  collapsed:: true
		- ```
		  Pathfinding Bug  — Enemy stuck on geometry, walking into walls
		  Aggro Bug        — Enemy attacks wrong target / ignores player
		  Physics Explosion — Objects flying out at extreme velocity
		  Ragdoll Break    — Character ragdoll glitches through floor
		  Joint Instability — Physics joint oscillates wildly (Jitter bug)
		  ```
	-
	- ## Audio Bugs
	  collapsed:: true
		- ```
		  Missing SFX      — Sound effect never plays
		  Looping Audio    — Sound loops when it should stop (after death etc.)
		  Audio Desync     — Cutscene audio out of sync with video
		  Wrong SFX        — Wrong sound plays for wrong action
		  Volume Issue     — Sound too loud, too quiet, or missing entirely
		  ```
	-
	- ## Network / Multiplayer Bugs
	  collapsed:: true
		- ```
		  Desync           — Players see different game states
		  Rubber-banding   — Player teleports back due to lag correction
		  Connection Drop  — Unexpected disconnection during session
		  Ghost Player     — Disconnected player appears stuck in world
		  Rollback Error   — State rollback causes visible duplication
		  ```
	-
	- ## Platform / Cert Bugs
	  collapsed:: true
		- ```
		  TRC (Xbox) / TCR (PlayStation) / LOT (Nintendo) failures:
		  
		  Common cert failures:
		    ✗ Game doesn't respond to system notifications (trophy/achievement)
		    ✗ Missing rating logo on start screen
		    ✗ Wrong button icon displayed (platform-specific confirm button)
		    ✗ Game doesn't handle account changes gracefully
		    ✗ Unsafe content in wrong rating tier
		    ✗ Game ignores parental controls
		    ✗ Crashing during suspend/resume (console sleep mode)
		  ```

- # Bug Lifecycle
  collapsed:: true
	- ## Standard States
	  collapsed:: true
		- ```mermaid
		  flowchart LR
		      A[New] --> B[Assigned]
		      B --> C[In Progress]
		      C --> D[Fixed]
		      D --> E[Retest]
		      E -->|Pass| F[Closed]
		      E -->|Fail| G[Reopen]
		      G --> B
		      B -->|Not a bug| H[Rejected]
		      B -->|Future patch| I[Deferred]
		  ```
	-
	- ## State Descriptions
	  collapsed:: true
		- ```
		  New        — Bug submitted, not yet reviewed
		  Assigned   — Assigned to developer
		  In Progress — Developer actively working on fix
		  Fixed      — Developer marked as fixed, awaiting QA retest
		  Retest     — QA verifying the fix on the fixed build
		  Closed     — Fix verified. Bug resolved.
		  Reopen     — Fix did not work, or fix caused regression
		  Rejected   — Not a bug (by design, duplicate, cannot reproduce)
		  Deferred   — Valid bug, intentionally moved to future patch
		  ```

- # Bug Report Template
  collapsed:: true
	- ## Full Bug Report Template
	  collapsed:: true
		- ```
		  TITLE: [Short, clear one-line summary of the bug]
		  
		  Bug ID:        BUG-[XXX]
		  Reporter:      [Name]
		  Date:          [YYYY-MM-DD]
		  Build:         [Version / Commit hash]
		  Platform:      [PC / PS5 / Xbox / Switch / iOS / Android]
		  Severity:      [S1 / S2 / S3 / S4 / S5]
		  Priority:      [P1 / P2 / P3 / P4]
		  Status:        New
		  Assignee:      [Developer name or TBD]
		  
		  Environment:
		    OS:          [Windows 11 / PS5 firmware 9.0 / etc.]
		    GPU:         [RTX 4080 / etc. (PC only)]
		    RAM:         [16 GB (PC only)]
		    Resolution:  [1920×1080 / 4K]
		    Game Mode:   [Single / Multiplayer / Co-op]
		  
		  Steps to Reproduce:
		    1. [Exact step]
		    2. [Exact step]
		    3. [Exact step]
		  
		  Expected Result:
		    [What should happen]
		  
		  Actual Result:
		    [What actually happens]
		  
		  Reproducibility:  Always / Intermittent (X/10) / Rare (X/10)
		  
		  Attachments:
		    □ Screenshot / Video clip (MANDATORY for visual bugs)
		    □ Save file (for save-related bugs)
		    □ Crash log / output_log.txt
		    □ Network log (for multiplayer bugs)
		  
		  Notes:
		    [Any additional context, workaround, related bugs]
		  ```
	-
	- ## Good vs Bad Bug Reports
	  collapsed:: true
		- ```
		  ❌ BAD:
		  Title: "Game crashes"
		  Steps: Played the game and it crashed.
		  
		  ✅ GOOD:
		  Title: "Game crashes to desktop entering Level 3 after collecting Key Item"
		  Platform: PC (Windows 11, RTX 3080, 16GB RAM), Build 0.9.4.1
		  Steps:
		    1. Start new game, choose Hard difficulty
		    2. Complete Level 2 and collect the "Rusted Key" item
		    3. Enter Level 3 through the main door
		    4. Game crashes immediately on zone load
		  Expected: Level 3 loads normally
		  Actual: Crash to desktop. Error: NullReferenceException in EnemySpawner.cs:147
		  Reproducibility: Always (5/5 attempts)
		  Attachments: crash_log_20250512.txt, gameplay_clip.mp4
		  ```

- # Bug Triage Workflow
  collapsed:: true
	- ## Triage Process
	  collapsed:: true
		- ```
		  Daily triage meeting (15–30 min):
		  
		  1. Review all "New" bugs from past 24 hours
		  2. Validate each bug:
		     □ Is it reproducible?
		     □ Is it actually a bug (not by design)?
		     □ Is it a duplicate?
		  3. Set severity and priority
		  4. Assign to responsible developer
		  5. Escalate any S1 blockers immediately
		  
		  Triage roles:
		    QA Lead     — Validates bugs, sets severity
		    Producer    — Sets priority based on milestone
		    Dev Lead    — Assigns to correct developer
		  ```
	-
	- ## Priority vs Severity
	  collapsed:: true
		- ```
		  Severity = Technical impact (how bad is the problem?)
		    S1: Game-breaking
		    S2: Major feature broken
		    S3: Moderate impact
		    S4: Minor
		    S5: Cosmetic
		  
		  Priority = Business urgency (how soon must it be fixed?)
		    P1: Fix today (blocks QA / milestone / cert)
		    P2: Fix this sprint
		    P3: Fix next sprint
		    P4: Fix when time allows
		  
		  Common mismatches (and they're intentional!):
		  
		  High Severity + Low Priority:
		    Game crashes if you run 7 hours straight with no save
		    → Real issue, but very low impact on most players
		  
		  Low Severity + High Priority:
		    Publisher's name is misspelled on title screen
		    → Minor bug but must fix before any public showing
		  ```

- # Bug Tracking Tools
  collapsed:: true
	- ## Comparison
	  collapsed:: true
		- | Tool | Best For | Game-Specific? | Cost |
		  |------|---------|---------------|------|
		  | **Jira** | All studio sizes, Agile sprints | Configurable | Paid (free ≤10 users) |
		  | **Hansoft** | AAA studios. Fast, powerful | Game workflows | Paid (per seat) |
		  | **Hacknplan** | Indie devs. Game-centric design | Yes | Free + Pro |
		  | **Trello** | Small indie, Kanban style | Limited | Free + Paid |
		  | **GitHub Issues** | Open-source, small teams | No | Free |
		  | **Mantis BT** | Open-source bug tracker | No | Free |
		  | **DevTrack** | Mid-to-large studios | Yes | Paid |
	-
	- ## Jira Game Setup Tips
	  collapsed:: true
		- ```
		  Custom fields to add:
		    Platform         (checkbox: PC, PS5, Xbox, Switch, iOS, Android)
		    Build Version    (text)
		    Reproducibility  (select: Always / Intermittent / Rare)
		    Game Area        (select: Combat / UI / Audio / AI / Online / etc.)
		    Cert Blocker     (checkbox: Yes / No)
		  
		  Custom workflow states:
		    New → Triaged → In Dev → Fixed → In QA Retest → Closed
		    (add: Deferred, Rejected, Won't Fix)
		  
		  Useful boards:
		    S1 blockers board   — Only S1 bugs. Always visible.
		    Cert bugs board     — All certification requirement bugs
		    Per-area boards     — Separate boards for Audio, AI, etc.
		  ```
	-
	- ## Hacknplan Setup (Indie)
	  collapsed:: true
		- ```
		  Hacknplan is designed for game dev:
		    - Tasks organized by game discipline (Art, Code, Audio, QA)
		    - Milestone tracking built in
		    - Bug reporting with screenshots
		    - Simple enough for solo dev, scalable for small teams
		  
		  Free tier is sufficient for indie teams up to ~5 people.
		  ```

- # Regression Testing
  collapsed:: true
	- ## What is Regression?
	  collapsed:: true
		- ```
		  After each fix, verify:
		    1. The bug is actually fixed
		    2. The fix didn't break anything else (regression)
		  
		  Every bug fix is a potential regression risk.
		  
		  "Fixing a crash in EnemySpawner.cs might break a
		   different enemy behaviour that relied on that code path."
		  ```
	-
	- ## Regression Checklist Per Fix
	  collapsed:: true
		- ```
		  □ Reproduce the original bug → Confirm it's gone
		  □ Test the areas adjacent to the fix (nearby code, systems)
		  □ Run related automated tests (if they exist)
		  □ Test on all target platforms (if platform-specific)
		  □ Check memory/performance didn't regress
		  □ If UI change: test on multiple resolutions/aspect ratios
		  ```

- # Useful Links & Resources
	- [Jira](https://www.atlassian.com/software/jira) — Industry standard bug tracker
	- [Hansoft](https://www.perforce.com/products/hansoft) — AAA-grade project management
	- [Hacknplan](https://hacknplan.com) — Game-specific bug/task tracker (indie)
	- [Trello](https://trello.com) — Simple Kanban for small teams
	- [IGDA QA SIG](https://igda.org/sigs/qa/) — Game QA community
	- [PlayStation TRC Checklist overview](https://partners.playstation.net) — Cert requirements (partner login)
	- [Xbox TCR overview](https://developer.microsoft.com/en-us/games/xbox/partner) — Xbox cert requirements
