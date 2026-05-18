---
seoTitle: Paperclip AI – Human Control Plane for AI Agent Teams
description: "Comprehensive notes on Paperclip — the open-source, self-hosted platform for managing AI agent teams with org charts, budgets, governance, heartbeats, and full auditability."
keywords: "paperclip ai, ai agent orchestration, human control plane, ai labor, autonomous company, ai org chart, ai governance, ai budget control, paperclipai, open source ai agents, self-hosted ai, ai team management, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Paperclip – Human Control Plane for AI Labor
enableToc: true
---

> [!info] About This Page
> **Paperclip** is an open-source, self-hosted platform that lets you run AI agents like employees inside a structured company — with org charts, goals, budgets, governance, and full auditability.
> GitHub: [paperclipai/paperclip](https://github.com/paperclipai/paperclip) · Website: [paperclip.ing](https://paperclip.ing) · Docs: [docs.paperclip.ing](https://docs.paperclip.ing)

---

- # What Is Paperclip?
  collapsed:: true
	- Paperclip is a **human control plane** — an operating system for running a company staffed entirely by AI agents.
	- It is NOT a chatbot, NOT an agent framework, and NOT a workflow builder.
	-
	- ## The Core Mental Model
	  collapsed:: true
		- > [!tip] Key Insight
		  > The shift: **"I am prompting an AI"** → **"I am managing a team"**
		  > You are the board of directors. Agents are your employees.
		- ```
		  You (Board of Directors)
		    └── CEO Agent (strategy, hiring)
		          ├── CTO Agent (technical oversight)
		          │     ├── Engineer Agent (coding)
		          │     └── QA Agent (testing)
		          ├── Marketing Agent (content, social)
		          └── Finance Agent (reporting, budgets)
		  ```
	-
	- ## What Paperclip Is NOT
	  collapsed:: true
		- | NOT | Why |
		  |-----|-----|
		  | Not a chatbot | Agents have jobs, not chat windows |
		  | Not an agent framework | Doesn't tell you how to BUILD agents — tells you how to RUN a company of them |
		  | Not a workflow builder | No drag-and-drop pipelines — models companies with org charts and governance |
		  | Not a prompt manager | Agents bring their own prompts, models, and runtimes |
		  | Not a single-agent tool | Built for teams, hierarchies, companies |
	-
	- ## Five Pillars of Paperclip
	  collapsed:: true
		- | Pillar | Description |
		  |--------|-------------|
		  | **Org Chart** | Hierarchies, roles, reporting lines — agents have a boss, title, job description |
		  | **Goal Alignment** | Every task traces back to the company mission — agents know WHY |
		  | **Heartbeats** | Agents wake on schedule, check work, delegate up/down the org chart |
		  | **Cost Control** | Monthly budget per agent — hits limit, auto-pauses. No runaway spend |
		  | **Governance** | You approve hires, review strategy, override anything. Full control always |
-
- # Core Architecture
  collapsed:: true
	- ## System Architecture
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Board["👤 Board of Directors (You)"]
		      Gov["🏛️ Governance Layer\nApprove hires · Review strategy · Override any decision"]
		      CEO["🤖 CEO Agent\nStrategy · Delegation · Oversight"]
		      CTO["🤖 CTO Agent"]
		      Mkt["🤖 Marketing Agent"]
		      Eng["🤖 Engineer Agent"]
		      QA["🤖 QA Agent"]
		      Tickets["🎫 Ticket System\nEvery task, every trace, every log"]
		      Budget["💰 Budget Enforcement\nPer-agent monthly limits"]
		      Board --> Gov --> CEO
		      CEO --> CTO --> Eng
		      CTO --> QA
		      CEO --> Mkt
		      CEO --> Tickets
		      CEO --> Budget
		  ```
	-
	- ## Execution Flow
	  collapsed:: true
		- ```mermaid
		  sequenceDiagram
		      participant B as 👤 Board (You)
		      participant CEO as 🤖 CEO Agent
		      participant Eng as 🤖 Engineer Agent
		      participant T as 🎫 Ticket System
		      B->>CEO: Define goal + mission
		      CEO->>B: Propose strategy + team hires
		      B->>CEO: Approve strategy
		      CEO->>T: Create tasks from strategy
		      T->>Eng: Assign ticket
		      Note over Eng: Heartbeat fires → Eng wakes
		      Eng->>T: Work on ticket (tool calls logged)
		      Eng->>CEO: Report completion / escalate
		      CEO->>B: Summary report
		      B->>CEO: Adjust, override, or approve next phase
		  ```
-
- # Key Features Deep Dive
  collapsed:: true
	- ## Heartbeat System
	  collapsed:: true
		- > [!info] What is a Heartbeat?
		  > A heartbeat is a scheduled wake-up signal sent to an agent.
		  > On each heartbeat the agent: checks ticket queue → picks up work → executes tasks → delegates if needed → reports back.
		- ```
		  Heartbeat triggers:
		    • Scheduled interval  (e.g., every hour)
		    • Ticket assignment   (someone assigns you a task)
		    • @-mention           (another agent or human mentions you)
		    • Cross-team request  (best-agent routing)
		  ```
	-
	- ## Goal Ancestry (Context Chain)
	  collapsed:: true
		- ```mermaid
		  graph LR
		      Mission["🎯 Company Mission\n'Build #1 AI note app to $1M MRR'"]
		      Goal["📌 Goal\n'Launch v1 in 3 months'"]
		      Project["📁 Project\n'Build auth system'"]
		      Task["🎫 Ticket\n'Implement OAuth login'"]
		      Mission --> Goal --> Project --> Task
		  ```
		- > [!tip] Why This Matters
		  > When an agent receives a ticket, it sees the **full ancestry** — not just "Implement OAuth login" but the whole chain back to the company mission.
		  > This is goal-aware execution — agents always know the **WHY**, not just the **WHAT**.
	-
	- ## Budget & Cost Control
	  collapsed:: true
		- | Event | What Happens |
		  |-------|-------------|
		  | Agent at 80% budget | Soft warning emitted |
		  | Agent at 100% budget | Auto-paused — no new tasks accepted |
		  | Board override | Resume at any time |
		- ```
		  Cost tracking granularity:
		    • Per agent       → which agent is expensive
		    • Per task        → which tasks burn tokens
		    • Per project     → which projects over budget
		    • Per goal        → strategic cost vs value
		  
		  Enforcement is ATOMIC:
		    → Task checkout + budget check = single atomic operation
		    → No double-work, no race conditions, no runaway spend
		  ```
	-
	- ## Governance Model
	  collapsed:: true
		- ```mermaid
		  graph TD
		      You["👤 You — The Board"]
		      G1["Approve Hires\nAgents can't hire without your OK"]
		      G2["Review Strategy\nCEO can't execute without your review"]
		      G3["Override Anything\nPause · Reassign · Terminate · Adjust budget"]
		      G4["Config Revisioning\nBad changes can be rolled back"]
		      You --> G1
		      You --> G2
		      You --> G3
		      You --> G4
		  ```
		- > [!warning] Key Principle
		  > **Autonomy is a privilege you grant, not a default.**
		  > Agents work for you — not the other way around.
	-
	- ## Ticket & Audit System
	  collapsed:: true
		- | Component | Description |
		  |-----------|-------------|
		  | Structured tickets | Every task has a clear owner, status, thread, and history |
		  | Full trace | Every tool call, API request, and decision point is logged |
		  | Immutable audit log | Append-only — no edits, no deletions, full accountability |
		  | Tool-call tracing | See exactly which external APIs, files, commands an agent touched |
		- > [!info] Nothing Happens in the Dark
		  > Every instruction, every response, every tool call and decision is recorded.
-
- # Bring Your Own Agent (BYOA)
  collapsed:: true
	- > [!tip] Key Strength
	  > Paperclip is completely **agent-agnostic**.
	  > If your agent can receive a heartbeat signal — it's hired.
	-
	- ## Supported Agent Types
	  collapsed:: true
		- | Agent Type | How It Connects |
		  |-----------|----------------|
		  | Claude Code | Direct adapter integration |
		  | OpenClaw | Full integration |
		  | Cursor / Codex | Adapter-based integration |
		  | Python script | Any script that can receive HTTP heartbeat |
		  | Shell command | Wrap in a heartbeat receiver |
		  | HTTP webhook | If it accepts POST, it's an agent |
		  | Custom LLM | Any provider — OpenAI, Anthropic, Gemini, local |
	-
	- ## SKILLS.md — Runtime Context Injection
	  collapsed:: true
		- > [!note] What is SKILLS.md?
		  > A file that agents read at runtime to discover Paperclip workflows and project context — **no retraining needed** when workflows change.
		- ```
		  Agents use SKILLS.md to:
		    1. Understand what Paperclip tools are available
		    2. Learn project-specific conventions
		    3. Find where relevant context lives (codebase, docs, APIs)
		    4. Know how to delegate and escalate
		  ```
	-
	- ## Agent Adapter Pattern
	  collapsed:: true
		- ```mermaid
		  graph LR
		      Paperclip["🖇️ Paperclip Core\nOrg chart · Budget · Governance"]
		      Adapter["🔌 Adapter Layer\nTranslates heartbeat to agent-native format"]
		      Agent["🤖 Your Agent\nClaude · GPT · Gemini · Script · Webhook"]
		      Paperclip -->|"Heartbeat signal"| Adapter
		      Adapter -->|"Agent-native call"| Agent
		      Agent -->|"Results + logs"| Adapter
		      Adapter -->|"Structured response"| Paperclip
		  ```
-
- # Setup & Deployment
  collapsed:: true
	- ## Quick Start — One Command
	  collapsed:: true
		- ```bash
		  # From zero to autonomous company in one command
		  npx paperclip
		  
		  # Interactive setup guides you through:
		  #  1. Database configuration (embedded Postgres or external)
		  #  2. Auth setup
		  #  3. Creating your first company
		  #  4. Hiring your first agent
		  
		  # No Paperclip account required — fully self-hosted
		  # MIT licensed — own every line of code
		  ```
	-
	- ## Deployment Options
	  collapsed:: true
		- | Mode | Description | Best For |
		  |------|-------------|----------|
		  | Local (embedded Postgres) | Single Node.js process, auto-manages DB | Development, solo use |
		  | Local (external Postgres) | Point at your own Postgres instance | More control, persistence |
		  | Remote/Cloud | Full cloud deploy | Production, teams |
		  | Self-hosted server | Docker or any VPS | Enterprise, privacy-sensitive |
	-
	- ## First Company Setup Flow
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Start["npx paperclip"]
		      DB["Configure Database"]
		      Auth["Setup Auth"]
		      Company["Create Company — Name + Mission"]
		      CEO["Hire CEO Agent — Choose LLM provider"]
		      Strategy["CEO proposes strategy → You review + approve"]
		      Team["CEO hires team → You approve each hire"]
		      Budget["Set budgets per agent"]
		      Go["Hit Go → Monitor dashboard"]
		      Start --> DB --> Auth --> Company --> CEO --> Strategy --> Team --> Budget --> Go
		  ```
-
- # Pre-Built Company Templates
  collapsed:: true
	- > [!info] Download a Business
	  > Import pre-built org structures, agent configs, and skills into your Paperclip instance in seconds.
	-
	- | Template | What It Does |
	  |----------|--------------|
	  | **Content Business** | SEO, blogs, social media on autopilot |
	  | **Finance Firm** | Analysis, risk assessment, compliance |
	  | **eCommerce Store** | Listings, support, inventory, ad optimization |
	  | **YouTube Channel** | Scripts, edits, thumbnails, scheduling |
	  | **Software Dev Team** | PM, engineers, QA, DevOps — full dev pipeline |
	  | **Sales Agency** | Prospecting, outreach, follow-up, closing |
-
- # Problem → Solution
  collapsed:: true
	- | Before Paperclip | After Paperclip |
	  |------------------|----------------|
	  | 20 Claude tabs open, can't track which does what | Tasks are ticket-based, threaded, sessions persist across reboots |
	  | Manually gather context to remind your bot what you're doing | Context flows from task → project → goal automatically |
	  | Folders of agent configs, reinventing task management each time | Org charts, ticketing, delegation, governance out of the box |
	  | Runaway loops waste hundreds of dollars | Token budgets surface + throttle agents when they hit limit |
	  | Recurring jobs require manual kickoff each time | Heartbeats handle scheduled work, management supervises |
	  | Have idea → fire up Claude → babysit it | Add task → agent works until done → you review |
-
- # Technical Internals — Why It's Special
  collapsed:: true
	- | Feature | Technical Detail |
	  |---------|-----------------|
	  | **Atomic Execution** | Task checkout + budget enforcement = single atomic DB transaction. No double-work |
	  | **Persistent Agent State** | Agents resume exact task context across heartbeats — not restart from scratch |
	  | **Runtime Skill Injection** | Agents learn Paperclip workflows at runtime — zero retraining |
	  | **Governance with Rollback** | Approval gates enforced, config changes versioned, rollback available |
	  | **Goal-Aware Execution** | Tasks carry full goal ancestry — agents see the WHY, not just a title |
	  | **Portable Templates** | Export/import orgs + agents + skills with secret scrubbing |
	  | **True Multi-Company Isolation** | Every entity is company-scoped — one deployment, many companies |
-
- # More Learn
	- ## Links & Resources
		- [Paperclip Official Site](https://paperclip.ing)
		- [GitHub — paperclipai/paperclip](https://github.com/paperclipai/paperclip)
		- [Paperclip Documentation](https://docs.paperclip.ing)
		- [Paperclip Blog](https://paperclip.ing/blog)
		- [Discord Community](https://discord.gg/m4HZY7xNG3)
		- [llms.txt — Paperclip AI context file](https://paperclip.ing/llms.txt)