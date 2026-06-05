---
seoTitle: Game Design – Complete Theory & Practice Guide Beginner to Super Advanced
description: "Comprehensive game design reference covering MDA framework, game loops, player psychology, level design, mechanics, balancing, economy, narrative, UI/UX, monetization, genre patterns, and advanced systemic design."
keywords: "game design, game design theory, MDA framework, game mechanics, level design, player psychology, game economy, narrative design, game balancing, game loops, game UI UX, monetization, indie game design, AAA game design, game design patterns, systemic design, emergent gameplay, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Game Design
treeTitle: Game Development - Design
---

> [!info] About This Page
> This page covers **game design theory and practice** — from foundational concepts to advanced AAA and indie techniques.
> For technical implementation see [[Game Development]]. For engine scripting see [[Godot]], [[Unity]] (including its advanced rendering, networking, performance patterns, and DOTS details), [[Unreal Engine]].

- # History
  collapsed:: true
	- **How**: Game design as a discipline emerged from tabletop games (chess, Go) and arcade machines (1970s). As games grew complex, designers separated from programmers — formalizing design as its own craft.
	- **Who**: Pioneers include Shigeru Miyamoto (Mario, Zelda), Sid Meier (Civilization), Will Wright (SimCity, The Sims), and academics like Marc LeBlanc, Robin Hunicke, and Richard Bartle.
	- **Why**: To create intentional, meaningful interactive experiences — not just functional software. Good design is the difference between a game people play once and one they play for 1,000 hours.
	-
	- ## Timeline
	  collapsed:: true
		- ```mermaid
		  timeline
		      title Game Design Evolution
		      1970s : Arcade Era
		            : Pong, Space Invaders
		            : Pure mechanics, no story
		      1980s : Home Consoles
		            : Mario, Zelda, Metroid
		            : Levels, progression, narrative emerge
		      1990s : PC Golden Age
		            : Doom, Warcraft, Myst, Final Fantasy
		            : Genre diversification, 3D begins
		      2000s : Online Multiplayer
		            : WoW, Halo, Counter-Strike
		            : Social and economy design
		      2010s : Mobile and Indie Explosion
		            : Angry Birds, Minecraft, Dark Souls
		            : Free-to-play monetization dominates
		      2020s : Live Service and AI Era
		            : GaaS, UGC, AI-assisted design
		            : Accessibility-first, player-driven economies
		  ```
-
- # Introduction
	- Game design is the art and science of creating rules, systems, and experiences that make games fun, engaging, and meaningful. It sits at the intersection of psychology, systems thinking, storytelling, and UX design.
	-
	- ## Game Design Knowledge Map
	  collapsed:: true
		- ```mermaid
		  mindmap
		    root((Game Design))
		      Theory
		        MDA Framework
		        Game Loops
		        Flow State
		        Fun Theory
		      Systems
		        Mechanics
		        Economy
		        Progression
		        Balancing
		      Experience
		        Player Psychology
		        Difficulty
		        Onboarding
		        Game Feel
		      Content
		        Level Design
		        World Building
		        Encounter Design
		        Puzzle Design
		      Narrative
		        Story Structure
		        Dialogue
		        Branching
		        Environmental
		      Production
		        GDD
		        Prototyping
		        Playtesting
		        Iteration
		  ```
	-
	- ## Types of Game Designers
	  collapsed:: true
		- | Role | Responsibility |
		  |------|---------------|
		  | Systems Designer | Rules, mechanics, economy, progression |
		  | Level Designer | Spaces, encounters, puzzles, flow |
		  | Narrative Designer | Story, dialogue, world-building, branching |
		  | UX Designer | Menus, HUD, accessibility, onboarding |
		  | Combat Designer | Weapons, enemies, abilities, feel |
		  | Economy Designer | Resources, currencies, monetization |
		  | Technical Designer | Scripting, tools, bridges design + code |
	-
	- ## Common Beginner Mistakes
		- > [!warning] Avoid These
		  > Building before designing (no GDD, no prototype)
		  > Copying mechanics without understanding WHY they work
		  > Designing for yourself, not your target player
		  > Ignoring playtesting until it's too late
		  > Feature creep — adding more instead of polishing what exists
		  > Skipping the "why is this fun?" question
		  > No feedback loops — player actions have no visible consequence
		  > Flat difficulty — no curve, no escalation
-
- # MDA Framework
	- > [!tip] Core Principle
	  > MDA (Mechanics, Dynamics, Aesthetics) — the most widely used formal framework for analyzing and designing games. Created by Robin Hunicke, Marc LeBlanc, Robert Zubek (2004).
	-
	- ## MDA Flow
	  collapsed:: true
		- ```mermaid
		  graph LR
		      DB["🎮 Designer builds"]
		      M["⚙️ MECHANICS \n Rules & Systems \n Code & Logic"]
		      D["🌀 DYNAMICS \n Emergent Behavior \n Patterns in Play"]
		      A["✨ AESTHETICS \n Fun & Emotion \n Player Experience"]
		      DB --> M
		      M -->|produces| D
		      D -->|creates| A
		      PE["👤 Player experiences"]
		      A2["✨ Feel something"]
		      D2["🌀 Interact with systems"]
		      M2["⚙️ Learn the rules"]
		      PE --> A2
		      A2 -->|leads to| D2
		      D2 -->|reveals| M2
		  ```
	-
	- ## The 8 Aesthetics
		- | Index | Aesthetic | Feel | Example Games |
		  |---|-----------|------|---------------|
		  | 1 | Sensation | Sensory pleasure | Rez, Thumper, Tetris Effect |
		  | 2 | Fantasy | Immersion / world | Skyrim, Zelda, Elden Ring |
		  | 3 | Narrative | Story / drama | The Last of Us, Disco Elysium |
		  | 4 | Challenge | Skill / mastery | Dark Souls, Celeste, CS:GO |
		  | 5 | Fellowship | Social / coop | Among Us, WoW, It Takes Two |
		  | 6 | Discovery | Exploration | Minecraft, No Man's Sky, BotW |
		  | 7 | Expression | Creativity / self | The Sims, Dreams, Minecraft |
		  | 8 | Submission | Relaxation / idle | Stardew Valley, Candy Crush |
		- > [!tip] Design Rule
		  > Most successful games target **2-3 aesthetics intentionally**.
		  > Dark Souls → Challenge + Fantasy + Discovery
		  > Animal Crossing → Submission + Expression + Fellowship
		  > Fortnite → Challenge + Fellowship + Expression
	-
	- ## MDA in Practice
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Q1["What should players FEEL?"]
		      Q2["What behaviors produce that feeling?"]
		      Q3["What rules create those behaviors?"]
		      Q1 -->|Step 1 Define Aesthetics| Q2
		      Q2 -->|Step 2 Design Dynamics| Q3
		      Q3 -->|Step 3 Write Mechanics| DONE["✅ Game Design"]
		      EX["Example: Stealth Game"]
		      A["Aesthetic: Tension + Challenge"]
		      B["Dynamics: cat-and-mouse, near-misses, planning"]
		      C["Mechanics: FOV cones, noise radius, alert states, patrol routes"]
		      EX --> A --> B --> C
		  ```
-
- # Game Loops
  collapsed:: true
	- ## Three Loop Hierarchy
	  collapsed:: true
		- ```mermaid
		  graph TD
		      SL["🌐 SOCIAL LOOP\nweeks to months"]
		      S1["Guilds · Leaderboards · Seasons · Live Events"]
		      ML["📈 META LOOP\nhours to days"]
		      M1["Progression · Unlocks · Story · Base Building"]
		      CL["⚡ CORE LOOP\nseconds to minutes"]
		      C1["ACTION"] --> C2["RESULT"]
		      C2 --> C3["REWARD"]
		      C3 --> C4["UPGRADE"]
		      C4 --> C1
		      SL --> S1
		      SL --> ML
		      ML --> M1
		      ML --> CL
		      CL --> C1
		  ```
	-
	- ## Core Loop Examples
	  collapsed:: true
		- | Game | Core Loop |
		  |------|-----------|
		  | Clash of Clans | Attack → Win → Gold → Build → Attack |
		  | Diablo | Kill → Loot → Equip → Kill stronger |
		  | Candy Crush | Match → Clear → Stars → Next level |
		  | Fortnite | Land → Loot → Fight → Win/Die → Queue |
		  | Minecraft | Explore → Mine → Craft → Build → Explore |
		  | Dark Souls | Explore → Die → Learn → Try again → Win |
		  | Stardew Valley | Farm → Sell → Upgrade → Farm better |
	-
	- ## Feedback Loops
	  collapsed:: true
		- ```mermaid
		  graph LR
		      subgraph Positive["🔺 POSITIVE FEEDBACK LOOP"]
		          P1["Win"] --> P2["Get Stronger"]
		          P2 --> P3["Win Easier"]
		          P3 --> P1
		      end
		      subgraph Negative["🔻 NEGATIVE FEEDBACK LOOP"]
		          N1["Lose"] --> N2["Get Catch-up Help"]
		          N2 --> N3["Recover"]
		          N3 --> N1
		      end
		      Positive -->|"Risk: Snowballing\nFix: catch-up mechanics"| Balance["⚖️ Balanced Game"]
		      Negative -->|"Risk: Feels unfair\nFix: subtle rubber-banding"| Balance
		  ```
		- | Loop Type | Risk | Fix | Example |
		  |-----------|------|-----|---------|
		  | Positive (amplifying) | Snowballing — early leader always wins | Catch-up mechanics | Mario Kart blue shell |
		  | Negative (balancing) | Feels unfair to skilled players | Subtle rubber-banding | Left 4 Dead AI Director |
-
- # Player Psychology
  collapsed:: true
	- ## Flow State
	  collapsed:: true
		- > [!info] Flow Theory
		  > Flow (Mihaly Csikszentmihalyi) — the mental state of complete immersion and enjoyment. The **primary goal** of game design.
		  > Flow = Skill level **matches** challenge level. As skill grows → challenge must grow too.
		- ```mermaid
		  graph LR
		      Boredom["😴 BOREDOM\nSkill > Challenge\nToo easy"] -->|increase challenge| Flow
		      Flow["🎯 FLOW STATE\nSkill ≈ Challenge\nPerfect engagement"]
		      Anxiety["😰 ANXIETY\nChallenge > Skill\nToo hard"] -->|reduce challenge or\nbuild player skill| Flow
		      Flow -->|player skill grows| Boredom
		  ```
	-
	- ## Intrinsic vs Extrinsic Motivation
	  collapsed:: true
		- | Type | Examples | Effect |
		  |------|----------|--------|
		  | Intrinsic — Mastery | Getting better at a skill | Long-term engagement |
		  | Intrinsic — Autonomy | Making meaningful choices | Player ownership |
		  | Intrinsic — Purpose | Feeling actions matter | Emotional investment |
		  | Intrinsic — Curiosity | Wanting to discover what's next | Exploration drive |
		  | Extrinsic — XP/Levels | Visible progress numbers | Short-term motivation |
		  | Extrinsic — Loot | Random rewards | Variable ratio dopamine |
		  | Extrinsic — Achievements | Completion badges | Completionist drive |
		  | Extrinsic — Leaderboards | Social comparison | Competitive drive |
		- > [!warning] Overjustification Effect
		  > Extrinsic rewards can **kill intrinsic motivation** if overused.
		  > When everything has a reward attached, the activity starts to feel like work.
		  > Best games combine both: "I want to master this boss" + "I also get rare loot when I beat it."
	-
	- ## Bartle's Player Types
	  collapsed:: true
		- ```mermaid
		  graph TD
		      subgraph World["Acting on World"]
		          ACH["🏆 ACHIEVERS\nWin, collect, complete\nWoW raiders, completionists"]
		          EXP["🗺️ EXPLORERS\nDiscover, map, understand\nMinecraft, open world fans"]
		      end
		      subgraph Players["Acting on Players"]
		          KIL["⚔️ KILLERS\nDominate, compete, grief\nPvP, competitive games"]
		          SOC["💬 SOCIALIZERS\nChat, cooperate, roleplay\nMMOs, party games"]
		      end
		  ```
		- | Player Type | Motivation | Design For Them |
		  |-------------|-----------|-----------------|
		  | Achievers | Win, collect, complete | Achievements, leaderboards, 100% completion |
		  | Explorers | Discover, understand | Hidden areas, lore, procedural worlds |
		  | Socializers | Connect, cooperate | Guilds, chat, co-op, trading |
		  | Killers | Dominate, compete | PvP modes, ranked ladders, griefing tools |
		- > [!tip] Design Tip
		  > MMOs must serve all 4 types. Single-player games can focus on 1-2.
		  > Know your primary player type before designing systems.
	-
	- ## Dopamine & Reward Schedules
	  collapsed:: true
		- | Schedule | Pattern | Addictiveness | Example |
		  |----------|---------|---------------|---------|
		  | Variable Ratio | Reward after unpredictable N actions | ⭐⭐⭐⭐⭐ Highest | Loot boxes, random drops |
		  | Fixed Ratio | Reward after every N actions | ⭐⭐⭐ Medium | Kill 10 enemies = reward |
		  | Fixed Interval | Reward after fixed time | ⭐⭐⭐ Medium | Daily login bonus |
		  | Variable Interval | Reward after unpredictable time | ⭐⭐⭐⭐ High | Rare world events |
		- > [!warning] Ethical Note
		  > Variable ratio is the most powerful but also the most exploitative.
		  > Use responsibly — especially in games targeting younger players.
		  > Loot boxes using variable ratio on minors are banned in several countries.
	-
	- ## SECI Player Engagement Model
	  collapsed:: true
		- ```mermaid
		  graph LR
		      S["S — Skill Acquisition\nLearning controls and rules\nTutorial phase"] --> E
		      E["E — Exploration\nDiscovering world and systems\nEarly game"] --> C
		      C["C — Challenge\nTesting mastered skills\nMid game"] --> I
		      I["I — Investment\nCaring about outcome\nLate game / story"] -->|Retention loop| C
		      S -->|"Drop-off: tutorial too hard"| X1["❌ Player Leaves"]
		      E -->|"Drop-off: world feels empty"| X2["❌ Player Leaves"]
		      C -->|"Drop-off: difficulty spike"| X3["❌ Player Leaves"]
		      I -->|"Drop-off: story boring"| X4["❌ Player Leaves"]
		  ```
-
- # Game Mechanics Design
  collapsed:: true
	- ## Mechanics Hierarchy
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Core["⚡ Core Mechanics\nPrimary action — Shoot, Jump, Build, Match"]
		      Secondary["🔧 Secondary Mechanics\nSupporting actions — Dodge, Reload, Craft"]
		      Meta["📈 Meta Mechanics\nProgression rules — Level up, Unlock, Prestige"]
		      Social["👥 Social Mechanics\nMultiplayer rules — Trade, Vote, Cooperate"]
		      Core --> Secondary --> Meta --> Social
		  ```
		- | Category | Description | Examples |
		  |----------|-------------|---------|
		  | Core | Primary player action | Shoot, Jump, Build, Match |
		  | Secondary | Supporting actions | Dodge, Reload, Craft, Block |
		  | Meta | Progression rules | Level up, Unlock, Prestige, Season pass |
		  | Social | Multiplayer rules | Trade, Vote, Cooperate, Compete |
		- > [!note] Technical Implementation
		  > For multiplayer/social mechanics, see RPC and state syncing patterns in [[Unity]] #Remote Procedure Calls (RPCs) and [[Unity]] #NetworkVariable & Syncing.
	-
	- ## Good Mechanic Checklist
	  collapsed:: true
		- > [!tip] Mechanic Quality Test
		  > - ✅ Easy to learn, hard to master
		  > - ✅ Has clear cause and effect
		  > - ✅ Interacts meaningfully with other mechanics
		  > - ✅ Creates interesting decisions
		  > - ✅ Feels good to execute (game feel / juice)
		  > - ✅ Has depth — many ways to use it, many situations to apply it
	-
	- ## Mechanics Interaction — Breath of the Wild
	  collapsed:: true
		- ```mermaid
		  graph LR
		      Fire["🔥 Fire"] --> Wood["Burns Wood"]
		      Fire --> Ice["Melts Ice"]
		      Fire --> Wind["Spreads in Wind"]
		      Wood --> Updraft["Creates Updraft"]
		      Updraft --> Glider["Paraglider Lifts"]
		      Ice --> Path["Reveals Hidden Path"]
		      Wind --> WindMatters["Wind mechanic\nbecomes more important"]
		  ```
		- > [!info] Emergent Design
		  > Each mechanic makes **other mechanics more interesting**.
		  > Test: Can players combine mechanics in ways you didn't plan?
		  > If yes → emergent design ✅. If no → isolated mechanics ❌.
	-
	- ## Decision Quality Framework
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Decision["Player faces a Decision"]
		      Q["Is there a clearly correct answer?"]
		      Bad["❌ Bad Design\nFake choice — redesign needed"]
		      Good["✅ Good Design\nReal trade-off — player must think"]
		      Q -->|Yes| Bad
		      Q -->|No| Good
		      Good --> Dilemma["⚖️ Dilemma\nBoth choices have real cost"]
		      Good --> Tradeoff["🔄 Trade-off\nGain something, lose something"]
		      Good --> Irreversible["💀 Irreversible\nPermanent consequences, high stakes"]
		  ```
		- | Decision Type | Quality | Example |
		  |---------------|---------|---------|
		  | Obvious — one choice clearly better | ❌ Bad | Strength +5 vs Strength +3 |
		  | Dilemma — both choices have real cost | ✅ Good | Save the city or save your friend |
		  | Trade-off — gain something, lose something | ✅ Great | Strength +5 vs Speed +5 |
		  | Irreversible — permanent consequences | ✅ High stakes | Permadeath, faction choice |
-
- # Difficulty Design
  collapsed:: true
	- ## Difficulty Curve
	  collapsed:: true
		- ```mermaid
		  graph LR
		      Start["🟢 Start\nEasy intro"] --> Z1["Zone 1\nGradual rise"]
		      Z1 --> B1["⚔️ Boss 1\nDifficulty spike"]
		      B1 --> R1["😮‍💨 Relief\nNew mechanic taught safely"]
		      R1 --> Z2["Zone 2\nHarder than Zone 1"]
		      Z2 --> B2["⚔️ Boss 2\nBigger spike"]
		      B2 --> R2["😮‍💨 Relief"]
		      R2 --> Z3["Zone 3\nAll mechanics combined"]
		      Z3 --> B3["⚔️ Final Boss\nPeak challenge"]
		  ```
		- > [!tip] Pacing Rule
		  > Pattern : **gradual rise → spike (boss) → relief → rise again**
		  > Each "relief" valley after a boss teaches new mechanics safely.
		  > Never stack 3 hard sections without a breathing room moment.
	-
	- ## Difficulty Techniques
	  collapsed:: true
		- | Technique | How It Works | Use Case |
		  |-----------|-------------|---------|
		  | Enemy HP scaling | More health = longer fights | Endgame zones |
		  | Enemy damage scaling | Higher damage = less margin for error | Hard mode |
		  | Enemy count | More enemies = more chaos | Horde sections |
		  | Enemy AI | Smarter behavior, better reactions | Elite enemies |
		  | Resource scarcity | Less ammo/health = more tension | Horror games |
		  | Time pressure | Countdown timers, faster enemies | Escape sequences |
		  | Information hiding | Fog of war, hidden mechanics | Strategy games |
		  | Complexity increase | More mechanics active simultaneously | Late game |
		  | Punishment severity | Permadeath, lose progress on death | Roguelikes |
	-
	- ## Tutorial Design Flow
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Intro["Player starts game"]
		      Skip["⏭️ Skip option for veterans"]
		      Safe["Safe environment\nLow stakes, no punishment"]
		      Teach["Introduce ONE mechanic\nvia environment cues\nnot text walls"]
		      Test["Test the mechanic\nslightly harder version"]
		      Fail["Fail → retry\nNo harsh punishment"]
		      Combine["Combine with previous mechanic"]
		      Next["Next mechanic"]
		      Intro --> Skip
		      Intro --> Safe --> Teach --> Test
		      Test -->|Pass| Combine --> Next
		      Test -->|Fail| Fail --> Teach
		  ```
		- | Game | Tutorial Approach | Why It Works |
		  |------|------------------|-------------|
		  | Portal | Walk through portal with no explanation | Discovery by doing |
		  | Celeste | Each screen is a micro-tutorial | Mechanic introduced then tested |
		  | Dark Souls | Tutorial boss that teaches rolling | Failure teaches the core mechanic |
		  | Breath of the Wild | Great Plateau teaches all 4 runes | Isolated safe sandbox |
	-
	- ## Accessibility Options
	  collapsed:: true
		- | Option | Benefit | Who It Helps |
		  |--------|---------|-------------|
		  | Enemy damage multiplier (0.5x–2x) | Adjust challenge | Casual and hardcore players |
		  | Player health multiplier | Forgiveness control | New players |
		  | Game speed (0.5x–1.5x) | Reaction time adjustment | Motor-impaired players |
		  | Auto-aim assist toggle | Reduces aiming precision needed | Controller players, accessibility |
		  | Colorblind modes | Deuteranopia, Protanopia, Tritanopia | ~8% of male players |
		  | Subtitle size and contrast | Readability | Hearing-impaired, older players |
		  | Input remapping | Custom controls | All players |
		  | One-handed mode | Full game with one hand | Motor-impaired players |
		- > [!info] Gold Standard
		  > **The Last of Us Part II** — 60+ accessibility options covering motor, visual, and audio needs.
		  > Accessibility is not a feature — it's a design responsibility.
-
- # Level Design
  collapsed:: true
	- ## Core Principles
	  collapsed:: true
		- | Principle | Description |
		  |-----------|-------------|
		  | Readability | Player always knows where to go |
		  | Flow | Movement through space feels natural |
		  | Pacing | Tension and relief alternate |
		  | Teaching | Level teaches its own mechanics |
		  | Reward | Exploration is worth it |
		  | Replayability | Multiple paths or approaches |
	-
	- ## Linear Level Flow
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Start["🚪 Start"] --> Intro["Intro Mechanic\nsafe, no enemies"]
		      Intro --> C1["Challenge 1\nmechanic tested"]
		      C1 --> Secret["🌟 Optional Secret\nreward exploration"]
		      C1 --> C2["Challenge 2\nharder version"]
		      Secret --> C2
		      C2 --> Check["💾 Checkpoint"]
		      Check --> C3["Challenge 3\ncombine mechanics"]
		      C3 --> Boss["⚔️ Boss / Climax\nall mechanics tested"]
		      Boss --> Reward["🏆 Reward + Exit"]
		  ```
	-
	- ## Open World Structure
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Hub["🏠 Hub / Start"] --> POI1["📍 POI 1"]
		      Hub --> POI2["📍 POI 2"]
		      Hub --> POI3["📍 POI 3"]
		      POI1 --> Hidden["🗝️ Hidden Area\nreward exploration"]
		      POI2 --> POI4["📍 POI 4\nunlocked by POI 2"]
		      POI3 --> POI5["📍 POI 5\nunlocked by POI 3"]
		      POI4 --> Final["🏁 Final Area\nrequires 2+ POIs"]
		      POI5 --> Final
		      Hidden --> Final
		  ```
	-
	- ## Visual Language Table
	  collapsed:: true
		- | Visual Cue | Player Reads It As |
		  |------------|-------------------|
		  | Bright light / warm glow | Go here / safe zone |
		  | Open doorway | Path forward |
		  | Ledge with coins / collectibles | Jump here |
		  | Red barrel | Explosive / danger |
		  | Glowing object | Interactable / collectible |
		  | Narrow corridor | Tension / ambush ahead |
		  | Wide open space | Boss arena / safe rest |
		  | Broken floor / cracked ground | Don't step here |
		  | Arrows on ground | Direction to go |
		  | Warm colors (orange/red) | Danger, fire, heat |
		  | Cool colors (blue/green) | Safe, water, calm |
		  | High ground | Advantage, reward |
		- > [!warning] Consistency Rule
		  > Once you establish a visual language, **NEVER break it**.
		  > If red = danger, red must ALWAYS mean danger. Breaking this destroys player trust.
	-
	- ## Encounter Design Variables
	  collapsed:: true
		- | Variable | Options | Effect |
		  |----------|---------|--------|
		  | Enemy count | 1 / 5 / 20 | Complexity and chaos |
		  | Enemy types | Melee + ranged + tank + healer | Forces different tactics |
		  | Arena shape | Open field / corridor / multi-level | Changes movement options |
		  | Cover placement | Symmetric / asymmetric / sparse | Affects strategy |
		  | Entry points | 1 / 2 / 3+ | Flanking options |
		  | Escape routes | Yes / No | Tension level |
		  | Reinforcements | None / waves / triggered | Escalation |
		  | Time pressure | None / timer / hostage | Urgency |
	-
	- ## Puzzle Design Ladder
	  collapsed:: true
		- ```mermaid
		  graph TD
		      B["🟢 Beginner\nOne mechanic, one step\nSolution obvious"]
		      M["🟡 Medium\nTwo mechanics, two steps\nRequires combining"]
		      H["🟠 Hard\nThree mechanics\nNon-obvious combination"]
		      E["🔴 Expert\nSubvert expectations\nUse mechanic differently"]
		      B --> M --> H --> E
		  ```
		- | Good Puzzle | Bad Puzzle |
		  |-------------|-----------|
		  | Solution uses known mechanics | Requires knowledge not in the puzzle |
		  | All info visible in the puzzle | Hidden information required |
		  | "Aha moment" — obvious in hindsight | Arbitrary or illogical solution |
		  | Multiple solutions allowed | Only one rigid solution |
		  | Failure teaches | Full reset on failure |
-
- # Game Economy & Balancing
  collapsed:: true
	- ## Economy Flow
	  collapsed:: true
		- ```mermaid
		  graph LR
		      subgraph Sources["💰 Sources"]
		          S1["Kill enemies"]
		          S2["Complete quests"]
		          S3["Mining / Farming"]
		          S4["Trading"]
		      end
		      subgraph Storage["🏦 Storage"]
		          ST["Inventory · Wallet · Bank"]
		      end
		      subgraph Sinks["🕳️ Sinks"]
		          SK1["Buy items"]
		          SK2["Crafting"]
		          SK3["Upgrading"]
		          SK4["Death penalty"]
		      end
		      Sources --> Storage --> Sinks
		      Sinks -->|"Sources ≈ Sinks"| Balanced["⚖️ Healthy Economy"]
		      Sources -->|"Sources >> Sinks"| Inflation["📈 Inflation\nCurrency worthless"]
		      Sinks -->|"Sinks >> Sources"| Deflation["📉 Deflation\nPlayers go broke"]
		  ```
	-
	- ## Balancing Methods
	  collapsed:: true
		- ```mermaid
		  graph TD
		      subgraph RPS["⚔️ Transitive Balance — Rock Paper Scissors"]
		          A["Unit A"] -->|beats| B["Unit B"]
		          B -->|beats| C["Unit C"]
		          C -->|beats| A
		      end
		      subgraph Sit["🎯 Intransitive Balance — Situational"]
		          X["Option X\nbest in situation 1"]
		          Y["Option Y\nbest in situation 2"]
		          Z["Option Z\nbest in situation 3"]
		      end
		  ```
		- | Method | Description | Used In |
		  |--------|-------------|---------|
		  | Transitive (RPS) | A beats B, B beats C, C beats A | Fighting games, MOBAs, RTS |
		  | Intransitive (Situational) | Each option best in specific context | Weapon loadouts, builds |
		  | Soft cap | Diminishing returns after threshold | Stat scaling in RPGs |
		  | Hard cap | Absolute maximum value | Level 100, max gear score |
	-
	- ## Loot Rarity System
	  collapsed:: true
		- | Rarity | Color | Drop Rate | Description |
		  |--------|-------|-----------|-------------|
		  | Common | ⬜ Grey/White | 60–70% | Basic, always useful |
		  | Uncommon | 🟩 Green | 20–25% | Slight upgrade |
		  | Rare | 🟦 Blue | 8–10% | Meaningful upgrade |
		  | Epic | 🟪 Purple | 2–3% | Significant power spike |
		  | Legendary | 🟧 Orange/Gold | 0.1–1% | Game-changing, unique effect |
		- > [!tip] Pity System (Modern Standard)
		  > After N attempts without legendary → **guarantee one**.
		  > Prevents extreme bad luck, maintains fairness.
		  > Used in: Genshin Impact, Diablo 4, Path of Exile, Honkai Star Rail.
	-
	- ## Progression Curve Types
	  collapsed:: true
		- | Curve | XP Pattern | Feel | Best For |
		  |-------|-----------|------|---------|
		  | Linear | 100 per level | Predictable, boring | Simple mobile games |
		  | Exponential | 100, 200, 400, 800... | Slows down, feels grindy | MMOs with long tails |
		  | Polynomial | 100, 150, 210, 280... | Sweet spot, feels fair | Most RPGs |
		  | Flat then spike | Equal until boss gates | Sudden walls | Soulslike games |
-
- # Math & Probability in Game Design
  collapsed:: true
	- > [!tip] The Designer's Tool
	  > Math is the engine of systems design. It determines how fast a player progresses, how fair a combat system feels, and how economies scale without collapsing.
	-
	- ## Probability & Player Perception
		- Humans are notoriously bad at intuitive probability. A 90% hit chance that misses three times in a row feels "broken" to players.
		- | Concept | Description | Solution | Example |
		  |---------|-------------|----------|---------|
		  | **True RNG** | Each event is independent ($P(A) = C$) | Can lead to extreme streaks | Tabletop dice rolls |
		  | **Pseudo-Random Distribution (PRD)** | Probability increases with each failure | Guarantees consistency, reduces streaks | Critical strikes in Dota 2 |
		  | **Pity System** | Guaranteed success after $N$ failures | Prevents worst-case bad luck | Gacha drop rates (Genshin Impact) |
		- > [!info] Pseudo-Random Formula
		  > In PRD, the probability of an event happening on the $N$-th trial is:
		  > $P(N) = C \times N$
		  > If it triggers, the counter resets. This makes high-streak misses virtually impossible while maintaining the targeted average rate.
	-
	- ## Expected Value (EV) in Combat Balance
		- Expected Value is the average outcome of a random variable over many trials.
		- $$\text{EV} = \sum (x_i \times p_i)$$
		- For a basic attack:
		  $$\text{Expected Damage} = \text{Base Damage} \times (1 - \text{Crit Chance}) + (\text{Base Damage} \times \text{Crit Multiplier}) \times \text{Crit Chance}$$
		  If Base Damage = 100, Crit Chance = 20%, Crit Multiplier = 2.0x:
		  $$\text{EV} = 100 \times 0.8 + 200 \times 0.2 = 80 + 40 = 120\text{ average damage}$$
		- Use EV to compare different weapon or build choices (e.g., fast/weak weapons vs slow/strong weapons) to ensure they are mathematically balanced.
	-
	- ## Progression & Scaling Curves
		- How values (XP, HP, Gold costs) scale over time.
		- | Curve Type | Formula | Growth Rate | Best For |
		  |------------|---------|-------------|----------|
		  | **Linear** | $Y = mX + c$ | Constant | Simple stat progression |
		  | **Polynomial** | $Y = aX^b + c$ | Accelerating | RPG levels, stat growth |
		  | **Exponential** | $Y = ab^X$ | Explosive | Idle/Incremental games, hyper-inflation |
		  | **Logarithmic** | $Y = a\ln(X) + b$ | Decelerating | Diminishing returns (soft caps) |
		- > [!warning] Scaling Dangers
		  > Exponential scaling ($ab^X$) runs out of hand extremely fast. If your base cost is 10 and increases by 15% per level ($1.15^X$), by level 100 the cost is $11,743,134$! Only use this if you have matching exponential income sources (like in Clicker Heroes).
-
- # Narrative Design
  collapsed:: true
	- ## Story vs Narrative Design
	  collapsed:: true
		- | Concept | Definition |
		  |---------|-----------|
		  | Story | What happens — plot, characters, events |
		  | Narrative Design | How the story is **delivered through gameplay** |
		- | Delivery Method | Description | Example |
		  |----------------|-------------|---------|
		  | Cutscenes | Cinematic, high production, breaks gameplay | Final Fantasy, Metal Gear |
		  | Environmental | Story told through the world itself | Dark Souls, Bioshock |
		  | Dialogue | NPC conversations, player choices | Mass Effect, Disco Elysium |
		  | Codex / Lore | Optional text for deep-divers | Dragon Age, Halo |
		  | Emergent | Player creates their own story through play | Minecraft, Dwarf Fortress |
		  | Ludonarrative | Mechanics reinforce the story theme | Celeste, Papers Please |
	-
	- ## Ludonarrative Harmony vs Dissonance
	  collapsed:: true
		- ```mermaid
		  graph TD
		      subgraph Harmony["✅ Ludonarrative Harmony"]
		          H1["Spec Ops: The Line\nYou commit atrocities\nGame makes you feel bad"]
		          H2["Papers Please\nBureaucratic mechanics\nmirror oppressive theme"]
		          H3["Celeste\nClimbing mechanic\nmirrors overcoming anxiety"]
		      end
		      subgraph Dissonance["❌ Ludonarrative Dissonance"]
		          D1["Uncharted\nNathan Drake is a good guy\nbut kills 800 people"]
		          D2["Far Cry 3\nJason is traumatized by violence\nbut you enjoy it"]
		      end
		  ```
		- > [!tip] Design Goal
		  > Make mechanics **FEEL like the story**, not just illustrate it.
	-
	- ## Branching Narrative Structures
	  collapsed:: true
		- ```mermaid
		  graph TD
		      subgraph Linear["Linear — No branches"]
		          LA["A"] --> LB["B"] --> LC["C"] --> LD["End"]
		      end
		      subgraph Converging["Converging — Illusion of choice"]
		          CA["A"] --> CB1["B1"]
		          CA --> CB2["B2"]
		          CA --> CB3["B3"]
		          CB1 --> CC["C"]
		          CB2 --> CC
		          CB3 --> CC
		          CC --> CD["End"]
		      end
		      subgraph True["True Branching — Multiple endings"]
		          TA["A"] --> TB1["B1"] --> TC1["End 1"]
		          TA --> TB2["B2"] --> TC2["End 2"]
		          TA --> TB3["B3"] --> TC3["End 3"]
		      end
		  ```
		- | Structure | Cost | Player Feel | Example |
		  |-----------|------|-------------|---------|
		  | Linear | Low | Cinematic, guided | The Last of Us |
		  | Converging | Medium | Illusion of choice | Mass Effect |
		  | True Branching | Very High | Real agency | Disco Elysium |
		  | Modular (open world) | High | Freedom + reactivity | Skyrim, Fallout |
	-
	- ## Environmental Storytelling
	  collapsed:: true
		- > [!tip] Show, Don't Tell
		  > "The city was destroyed" (telling) vs
		  > Player walks through ruins, finds a family photo in rubble (showing)
		- | Technique | Example |
		  |-----------|---------|
		  | Prop placement | Child's toy next to a grave tells a story |
		  | Destruction | Burned village shows what happened before |
		  | Notes / journals | Optional lore for curious players |
		  | NPC behavior | Civilians fleeing = danger ahead |
		  | Architecture | Rich district vs slum tells social story |
		  | Weather / lighting | Dark and stormy = danger, bright = safe |
-
- # Game Feel (Juice)
  collapsed:: true
	- > [!info] What is Game Feel?
	  > Game feel = the tactile, moment-to-moment sensation of playing.
	  > Also called **"juice"** — the layer of polish that makes actions feel satisfying even before you understand the rules.
	-
	- ## Components of Game Feel
	  collapsed:: true
		- | Component | Description | Example |
		  |-----------|-------------|---------|
		  | Input response | How fast does the game react to input? | < 16ms ideal |
		  | Animation | Does movement look and feel weighty? | Squash and stretch |
		  | Camera | Does it enhance or fight the action? | Screen shake on hit |
		  | Audio feedback | Does every action have a sound? | Satisfying click/crunch |
		  | Visual feedback | Particles, screen shake, hit flash | Doom glory kills |
		  | Haptics | Controller rumble at the right moment | PS5 DualSense |
	-
	- ## Juice Techniques
	  collapsed:: true
		- | Technique | How It Works | Used In |
		  |-----------|-------------|---------|
		  | Screen shake | Small shake on hit, large on explosion | Almost every action game |
		  | Hit stop (freeze frames) | Pause 2–5 frames on heavy hit | Street Fighter, Doom, Hollow Knight |
		  | Particle effects | Coins explode, enemies burst, footstep dust | Mario, Celeste |
		  | Sound layering | Base hit + crunch + reverb combined | Doom, Hades |
		  | Pitch variation | Same sound at slightly different pitch each time | Prevents audio fatigue |
		  | Coyote time | Jump still works 100–150ms after walking off ledge | Almost every platformer |
		  | Input buffering | Accept input 100–200ms before it can execute | Celeste, Hollow Knight |
		- > [!tip] Coyote Time & Input Buffering
		  > These two techniques alone make a platformer feel **dramatically better**.
		  > Without them, players constantly say "I pressed jump!" — with them, controls feel responsive and fair.
		- > [!note] Technical Implementation
		  > In Unity, implementing juice like squash-and-stretch, screen shake, and visual feedback is commonly achieved via tweening libraries like [[DOTween]] and particle setups like [[Unity]]'s Core Concepts — GameObjects & Components (under the `ParticleSystem` component) without allocating garbage memory (see [[Unity]]'s Garbage Collection (GC) Optimization).
	-
	- ## Camera Design
	  collapsed:: true
		- | Camera Type | Description | Best For |
		  |-------------|-------------|---------|
		  | Fixed | Cinematic, designer-controlled | Resident Evil classic, horror |
		  | Follow | Tracks player with smooth lerp | Most 2D games |
		  | Orbit | Player controls rotation | 3D action games |
		  | First Person | Maximum immersion, no character visible | FPS, horror |
		  | Isometric | Top-down angle | Strategy, RPG, Diablo |
		  | Over-shoulder | Third person close | TPS, Resident Evil 4 |
		- | Camera Technique | Effect |
		  |-----------------|--------|
		  | Lead space | Camera looks ahead of player movement direction |
		  | Trauma system | Accumulate trauma value, shake based on it |
		  | Zoom on action | Zoom in for precision, zoom out for overview |
		  | Rule of thirds | Player at 1/3 of screen, not center |
		- > [!note] Technical Tooling
		  > In Unity, advanced camera techniques like lead space, camera shake, and smart dampening are implemented out of the box using [[Cinemachine]] (see [[Unity]]'s Library & Frameworks).
-
- # UI/UX Design for Games
  collapsed:: true
	- ## HUD Design Principles
	  collapsed:: true
		- > [!tip] HUD Rules
		  > 1. Show only what the player needs **RIGHT NOW**
		  > 2. Critical info (health, ammo) → most visible position
		  > 3. Secondary info → corners, smaller
		  > 4. Diegetic UI > non-diegetic UI (immersion)
		  > 5. Never block the action with UI elements
		- ```
		  ┌──────────────────────────────────────────────────────────┐
		  │  [Minimap]                              [Objective]      │
		  │                                                          │
		  │                                                          │
		  │                       [Crosshair]                        │
		  │                                                          │
		  │                                                          │
		  │  [Health ████░░]                    [Ammo: 30/90]        │
		  │  [Armor  ███░░░]                    [Grenade: 2]         │
		  └──────────────────────────────────────────────────────────┘
		  ```
	-
	- ## Diegetic vs Non-Diegetic UI
	  collapsed:: true
		- | UI Type | Description | Immersion | Readability | Example |
		  |---------|-------------|-----------|-------------|---------|
		  | Non-diegetic | Floating on screen, outside game world | Low | High | Health bar overlay |
		  | Diegetic | Exists inside the game world | High | Medium | Dead Space spine health |
		  | Meta | Player knows, character doesn't | Medium | High | Pause menu, inventory |
		  | Spatial | In world space, not screen space | Medium | Medium | Floating damage numbers |
		- | Game | Diegetic UI Example |
		  |------|---------------------|
		  | Dead Space | Health bar on Isaac's spine |
		  | Alien Isolation | Motion tracker is a physical device |
		  | Metroid Prime | HUD is inside Samus's helmet visor |
		  | Resident Evil Village | Inventory is a physical briefcase |
	-
	- ## Settings Categories (Standard)
	  collapsed:: true
		- | Category | Options |
		  |----------|---------|
		  | Gameplay | Difficulty, assists, HUD options, camera sensitivity |
		  | Graphics | Resolution, quality preset, FOV, brightness, VSync |
		  | Audio | Master, music, SFX, voice, subtitles, audio language |
		  | Controls | Sensitivity, invert Y, button remapping, vibration |
		  | Accessibility | Colorblind mode, text size, motor assists, one-handed |
-
- # Monetization Design
  collapsed:: true
	- ## Monetization Models
	  collapsed:: true
		- | Model | Revenue Source | Player Perception | Example |
		  |-------|---------------|-------------------|---------|
		  | Premium (B2P) | One-time purchase | Most respected | Elden Ring, Celeste, BG3 |
		  | Subscription | Monthly fee | Accepted for value | WoW, Xbox Game Pass |
		  | Free-to-Play | In-app purchases | Varies widely | Fortnite, Genshin Impact |
		  | Freemium | F2P + premium features | Mixed | Clash of Clans |
		  | GaaS | Seasons + DLC + cosmetics | Accepted if fair | Destiny 2, Warframe |
		  | Ad-supported | Ad revenue | Tolerated on mobile | Casual mobile games |
		  | Early Access | Pre-release sales | Risky but accepted | Hades, Valheim |
	-
	- ## Ethical vs Predatory Monetization
	  collapsed:: true
		- ```mermaid
		  graph TD
		      subgraph Ethical["✅ Ethical Monetization"]
		          E1["Cosmetics only\nno gameplay advantage"]
		          E2["Battle pass with\nearnable currency"]
		          E3["Clear pricing\nno confusing conversion"]
		          E4["Pity systems\non gacha/loot boxes"]
		          E5["No pay-to-win\nin competitive modes"]
		      end
		      subgraph Predatory["❌ Predatory Monetization"]
		          P1["Loot boxes targeting minors"]
		          P2["Artificial energy/stamina\nto force spending"]
		          P3["Confusing currency\n1000 gems = $9.99 = ?"]
		          P4["Pay-to-win in PvP"]
		          P5["Manipulative countdown\ntimers on purchases"]
		      end
		  ```
		- > [!warning] Industry Trend (2024+)
		  > Players increasingly reject predatory monetization.
		  > Games with ethical models (Hades, Baldur's Gate 3) outperform predatory ones in long-term reputation and sales.
		  > Loot boxes targeting minors are **banned** in Belgium, Netherlands, and several other countries.
	-
	- ## Battle Pass Design
	  collapsed:: true
		- | Element | Good Design | Bad Design |
		  |---------|-------------|-----------|
		  | Duration | 60–90 days (one season) | Too short (FOMO) or too long (fatigue) |
		  | Free track | Basic rewards earnable by all | Worthless filler only |
		  | Paid track | Premium cosmetics ~$10/season | Gameplay advantages |
		  | Currency | Earnable premium currency to offset cost | Pure money sink |
		  | Completion | Achievable for casual players | Requires daily play |
		  | Content expiry | Stays accessible after season | Gone forever (FOMO) |
-
- # Genre-Specific Design Patterns
  collapsed:: true
	- ## FPS (First-Person Shooter)
	  collapsed:: true
		- | Design Element | Considerations |
		  |---------------|---------------|
		  | Core loop | Move → Aim → Shoot → Kill → Advance |
		  | TTK (Time-to-Kill) | Short (<0.5s) = punishing skill-based / Long (>3s) = tactical |
		  | Movement feel | Must be responsive, zero input lag |
		  | Weapon variety | Each weapon has a clear role and range |
		  | Map design | Sightlines, choke points, flanking routes |
		  | Audio | Footsteps, reload, ambient all critical for awareness |
		- > [!tip] Map Design Formula (Competitive FPS)
		  > 2 bomb sites (A and B) + Mid area connecting both + Multiple routes to each site + Choke points that reward grenades/utility
		  > CS:GO Dust2 is the gold standard.
	-
	- ## RPG (Role-Playing Game)
	  collapsed:: true
		- | Design Element | Considerations |
		  |---------------|---------------|
		  | Core loop | Explore → Fight → Level up → Get gear → Explore harder |
		  | Character builds | Multiple viable builds, not one optimal path |
		  | Quest types | Main (narrative) + Side (world-building) + Radiant (procedural) |
		  | Dialogue | Choices with consequences, NPC memory |
		  | Economy | Loot, crafting, trading, vendor balance |
	-
	- ## Platformer
	  collapsed:: true
		- | Design Element | Considerations |
		  |---------------|---------------|
		  | Core loop | Move → Jump → Navigate → Reach goal |
		  | Movement feel | Coyote time, jump buffering, variable jump height, air control |
		  | Level structure | Introduce → Test → Combine mechanics |
		  | Death recovery | < 5 seconds to retry |
		  | Secrets | Reward exploration, not required for completion |
	-
	- ## Strategy (RTS/TBS)
	  collapsed:: true
		- | Design Element | Considerations |
		  |---------------|---------------|
		  | Core loop | Gather → Build → Research → Attack → Expand |
		  | Balance | Rock-paper-scissors unit counters |
		  | Information | Fog of war creates asymmetry |
		  | Comeback | Losing player gets slight advantage |
		  | Map | Choke points, multiple resource nodes, high ground |
	-
	- ## Roguelike / Roguelite
	  collapsed:: true
		- | Feature | Roguelike | Roguelite |
		  |---------|-----------|-----------|
		  | Permadeath | Yes | Yes |
		  | Procedural generation | Yes | Yes |
		  | Meta-progression | No | Yes |
		  | Example | NetHack, Caves of Qud | Hades, Dead Cells, Slay the Spire |
		- | Design Element | Considerations |
		  |---------------|---------------|
		  | Run length | 20–60 minutes per run |
		  | Build synergies | Discovered mid-run, reward experimentation |
		  | Randomness | Seed-based — random but fair |
		  | Death | Teaches, not just punishes |
		  | Meta progression | Permanent unlocks, narrative advances between runs |
-
- # Prototyping & Production
  collapsed:: true
	- ## Prototype-First Mindset
	  collapsed:: true
		- > [!tip] Core Rule
		  > "Make the game before you make the game."
		  > Build in hours, not weeks. Use placeholder art. Throw it away if it doesn't work.
		- | Prototype Type | Speed | Cost | Best For |
		  |---------------|-------|------|---------|
		  | Paper prototype | Hours | Free | Testing rules, economy, turn structure |
		  | Digital prototype | Days | Low | Testing core mechanic feel |
		  | Vertical slice | Weeks | Medium | Pitching to publishers, team alignment |
	-
	- ## Playtesting Rules
	  collapsed:: true
		- > [!warning] Playtesting Rules
		  > 1. Watch, don't help — if player is stuck, note it, don't explain
		  > 2. Ask "what were you trying to do?" not "why did you do that?"
		  > 3. Record sessions (with permission)
		  > 4. Look for confusion, frustration, boredom
		  > 5. Note where players stop playing (drop-off points)
		- | Question | What It Reveals |
		  |----------|----------------|
		  | Where did players get stuck? | Tutorial / UX failures |
		  | What did players try that didn't work? | Missing affordances |
		  | What did players enjoy most? | Core strengths to amplify |
		  | What did players ignore? | Wasted content |
		  | Did players understand the core mechanic? | Onboarding quality |
		  | Did players want to keep playing? | Core loop quality |
	-
	- ## One-Page GDD Template
	  collapsed:: true
		- ```
		  Game title:
		  Genre:
		  Core verb (what player does):
		  Core loop (3 steps):
		  Target aesthetic (from MDA):
		  Win condition:
		  Lose condition:
		  Unique selling point:
		  Target platform:
		  Target audience:
		  ```
-
- # Advanced Design Systems
  collapsed:: true
	- ## Emergent Gameplay
	  collapsed:: true
		- > [!info] Definition
		  > Emergent gameplay = complex player behavior arising from simple rules.
		  > The designer didn't plan it — the system produced it.
		- | Game | Emergent Behavior |
		  |------|------------------|
		  | Minecraft | Players build computers using redstone |
		  | Dwarf Fortress | Players create epic stories from simulation |
		  | Breath of the Wild | Players use physics + fire + wind creatively |
		  | GTA Online | Players create their own missions and economies |
		- > [!tip] How to Design for Emergence
		  > 1. Make systems interact with each other (not isolated)
		  > 2. Give players tools, not just content
		  > 3. Simulate, don't script
		  > 4. Leave gaps for player creativity
		  > 5. Don't over-constrain — let players break things
	-
	- ## Systemic Design
	  collapsed:: true
		- ```mermaid
		  graph LR
		      Physics["⚙️ Physics"] --> Fire["🔥 Fire"]
		      Fire --> Smoke["💨 Smoke"]
		      Smoke --> AIVision["👁️ AI Vision Blocked"]
		      Fire --> Spread["Spreads to objects"]
		      Physics --> Destruction["Destruction of cover"]
		      AIVision --> Investigate["Enemy investigates"]
		      Destruction --> Tactics["New tactical options"]
		  ```
		- > [!info] Systemic Games
		  > Deus Ex, Dishonored, Prey, Hitman, Breath of the Wild
		  > Player action cascades through interconnected systems → emergent solutions
		- > [!tip] Decoupling Systemic Interactions
		  > For building decoupled, scriptable systemic events that allow objects to respond to triggers without hard references, see [[Unity]]'s ScriptableObject-based Variables & Events.
	-
	- ## Procedural Generation Design
	  collapsed:: true
		- | Type | Algorithm | Example |
		  |------|-----------|---------|
		  | Terrain | Perlin/Simplex noise → heightmaps | Minecraft, No Man's Sky |
		  | Dungeons | BSP trees, room placement | Binding of Isaac, Spelunky |
		  | Loot | Stat ranges + affixes | Diablo, Path of Exile |
		  | Quests | Template + variable fill | Skyrim radiant quests |
		  | NPCs | Trait combinations | Dwarf Fortress, RimWorld |
		  | Music | Procedural audio | No Man's Sky |
		- > [!tip] Procedural Design Rules
		  > 1. Seed-based — same seed = same result (reproducible)
		  > 2. Constrained randomness — random within designer-set bounds
		  > 3. Guarantee fun — ensure minimum quality floor
		  > 4. Curated + procedural — hand-craft key moments, proc-gen the rest
		- > [!tip] Technical Implementation (Performance)
		  > For high-performance voxel, terrain, or dungeon generation (e.g. generating millions of tiles/entities), you can offload calculations to multithreaded systems like the C# Job System and Burst Compiler. See [[Unity]]'s Data-Oriented Technology Stack (DOTS).
	-
	- ## Live Service Design (GaaS)
	  collapsed:: true
		- | Cadence | Content | Purpose |
		  |---------|---------|---------|
		  | Weekly | Challenges, events, small updates | Daily/weekly engagement |
		  | Monthly | Balance patches, new cosmetics | Freshness |
		  | Seasonal (3 months) | New battle pass, major content | Long-term retention |
		  | Annual | Expansion, major feature | Re-engagement |
		- | Retention Mechanic | How It Works |
		  |-------------------|-------------|
		  | Daily login bonus | Reason to open game every day |
		  | Weekly challenges | Reason to play multiple sessions/week |
		  | Season pass | Reason to play for 3 months |
		  | FOMO events | Limited time content (use carefully) |
		  | Social features | Friends, guilds, clans |
	-
	- ## AI-Assisted Game Design (2024+)
	  collapsed:: true
		- | Tool | Use Case |
		  |------|---------|
		  | ChatGPT / Claude | Brainstorm mechanics, write dialogue, generate quest ideas |
		  | Midjourney / DALL-E | Concept art, mood boards, UI mockups |
		  | Inworld AI / Convai | Procedural NPC dialogue |
		  | Unity ML-Agents | Train AI to find exploits and imbalances |
		  | Meshy AI / Luma AI | 3D model generation from text/image |
		  | ElevenLabs | AI voice acting for NPCs |
		  | Suno / Udio | AI music generation for prototypes |
		- > [!warning] Important
		  > AI assists designers — it doesn't replace design thinking.
		  > The "why is this fun?" question still requires human judgment.
-
- # Design Patterns Reference
  collapsed:: true
	- ## Essential Patterns
	  collapsed:: true
		- | Pattern | What It Does | Example |
		  |---------|-------------|---------|
		  | Core Loop | Repeatable action cycle | Any game |
		  | Feedback Loop | Action → visible result | Leveling up |
		  | Progression Gate | Lock content behind skill | Boss gate |
		  | Catch-up Mechanic | Help losing player | Mario Kart blue shell |
		  | Pity System | Guarantee after N tries | Gacha games |
		  | Soft Cap | Diminishing returns | Stat scaling |
		  | Hard Cap | Absolute maximum | Level 100 |
		  | Prestige | Reset for bonus | CoD prestige |
		  | Seasonal Reset | Wipe + fresh start | Diablo seasons |
		  | Onboarding Funnel | Guided first experience | Any game |
		  | Tutorial Island | Safe learning zone | WoW, RuneScape |
		  | Breadcrumb Trail | Visual path to goal | Coins, light |
		  | Gating by Time | Content unlocks over time | Mobile games |
		  | Gating by Skill | Content unlocks by mastery | Soulslike |
		  | Gating by Story | Content unlocks by progress | RPGs |
		  | Emergent Narrative | Story from systems | Minecraft |
		  | Procedural Difficulty | Adapts to player skill | Left 4 Dead |
		  | Social Proof | Show others' progress | Leaderboard |
		  | Loss Aversion | Fear of losing progress | Permadeath |
	-
	- ## Anti-Patterns (Avoid)
	  collapsed:: true
		- | Anti-Pattern | Why It's Bad |
		  |-------------|-------------|
		  | Padding | Artificial length — fetch quests, grinding |
		  | Fake choices | Decisions with no real consequence |
		  | Invisible walls | Arbitrary movement restrictions |
		  | Escort missions | Protect dumb AI — frustrating |
		  | Unskippable cutscenes after death | Punishes failure twice |
		  | Mandatory grind | Progress locked behind repetition |
		  | Backtracking | Forced revisit with no new content |
		  | Difficulty spike | Sudden jump with no warning |
		  | Pixel hunting | Tiny interactive objects with no visual cue |
		  | Adventure game logic | Illogical puzzle solutions |
		  | Softlock | Player stuck with no way out |
-
- # Which Technology Supports
  collapsed:: true
	- Related Engine :
		- [[Game Development]] — technical implementation of design concepts
		- [[Game AI]] — AI systems: FSM, Behavior Trees, GOAP, Utility AI, pathfinding
		- [[Game Physics]] — rigid body dynamics, collision detection, soft bodies
		- [[Godot]] — implement designs in Godot engine
		- [[Unity]] — implement designs in Unity engine
		- [[Unreal Engine]] — implement designs in Unreal Engine
		- [[GDScript]] — scripting for Godot game systems
		- [[CSharp for Unity]] — scripting for Unity game systems
		- [[Cpp for Unreal]] — scripting for Unreal game systems
		- [[PathTracer Learning]] — advanced graphics and rendering
		- [[DSA Algo & System Design]] — algorithms used in game AI and systems
		- [[Binary Space Partitioning]] — spatial data structure for game rendering
		- [[Free Assets]] — free art, audio, and assets for prototyping
		- [[Blender]] — 3D asset creation for game worlds
		- [[Software]] — full list of game engines and tools
-
- # More Learn
	- ## Books (Essential Free Reading)
		- [The Art of Game Design — Jesse Schell](https://archive.org/details/artofgamedesignb0000sche) — Free digital borrowing on Internet Archive. Over 100 lenses to view your game's mechanics.
		- [A Theory of Fun for Game Design — Raph Koster](https://archive.org/details/theoryoffunforga0000kost_2edi) — Free digital borrowing on Internet Archive. Cognitive science behind why games are fun.
		- [Game Programming Patterns — Robert Nystrom](https://gameprogrammingpatterns.com/) — Fully free to read online. Design patterns specifically optimized for games.
		- [Level Up! The Guide to Great Video Game Design — Scott Rogers](https://openlibrary.org/search?q=level+up+scott+rogers) — Search and borrow for free on Open Library. Practical concept-to-completion guide.
		- [Rules of Play: Game Design Fundamentals — Katie Salen & Eric Zimmerman](https://openlibrary.org/search?q=rules+of+play+katie+salen+eric+zimmerman) — Search and borrow for free on Open Library. Foundational academic design theory.
	-
	- ## Free Online Resources
		- [GDC Vault Free](https://gdcvault.com/free) — Hundreds of free Game Developers Conference talks from industry professionals.
		- [Game Design Concepts — Ian Schreiber](https://gamedesignconcepts.wordpress.com/) — Free 20-lesson game design course.
		- [Mark Brown — Game Maker's Toolkit](https://www.youtube.com/@GMTK) — Deep dives into game design. Essential watching.
		- [Extra Credits — Game Design](https://www.youtube.com/@ExtraCredits) — Game design theory made accessible.
		- [Design Doc YouTube](https://www.youtube.com/@DesignDoc) — Game design analysis and theory.
	-
	- ## Design Tools
		- [Machinations](https://machinations.io/) — Visual tool for designing and simulating game economies.
		- [Twine](https://twinery.org/) — Free tool for prototyping narrative/branching story games.
		- [GDevelop](https://gdevelop.io/) — Free, no-code game engine for rapid prototyping.
		- [Excalidraw](https://excalidraw.com/) — Free whiteboard for sketching level layouts and system diagrams.
		- [Bitsy](https://bitsy.org/) — Tiny game maker for small narrative games. Great for prototyping.