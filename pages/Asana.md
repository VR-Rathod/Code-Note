---
seoTitle: Asana Reference – Tasks, Portfolios, Workflow Builder, and API Guide
description: "In-depth educational reference for Asana covering tasks, projects, portfolios, custom fields, rules builder, and REST API resource modeling."
keywords: "Asana, task management, projects, portfolios, workflow builder, Asana API, project tracking, custom fields, automation rules, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Asana
---

- # History
	- **How**:
		- **Asana** was founded in **2008** by **Dustin Moskovitz** (co-founder of Facebook) and **Justin Rosenstein** (an ex-Google and ex-Facebook engineer).
		- While at Facebook, they spent significant time coordinating tasks via email and spreadsheets, which they described as "work about work."
		- They created an internal tool called *Tasks* to improve coordination.
		- Realizing the broader commercial potential, they left Facebook to launch Asana in **2011** as a commercial collaboration platform.
		- Key innovations:
			- **Multi-view Boards**: Introduced lists, Kanban boards, timelines (Gantt charts), and calendars dynamically displaying the exact same dataset.
			- **Workflow Builder**: Added a visual rules engine to automate task routing.
			- **Universal Reporting**: Added Portfolios and Goals to connect execution metrics straight to strategic company targets.
	-
	- **Who**:
		- Founded by **Dustin Moskovitz** and **Justin Rosenstein**. moskovitz remains CEO.
	-
	- **Why**:
		- Created to eliminate "work about work" (navigating emails, tracking status sheets, attending status alignment meetings) by organizing tasks into transparent, action-oriented pipelines.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Flexible Project Views** — Toggle between List, Board, Timeline, and Calendar views instantly without changing task structures.
		- **Multi-homing Tasks** — Add a single task to multiple projects simultaneously. Changes appear instantly in all locations without creating duplicate entries.
		- **Goal and Portfolio Tracking** — Group related projects into Portfolios to monitor health, status changes, and team workloads from a high-level view.
		- **No-code Rules Engine** — A visual workflow builder allows automating task handoffs, field updates, and integrations.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Costly Subscription Plan** — Basic features are free, but essential workflow rules, portfolios, custom fields, and timeline views require paid tiers that scale quickly.
		- **Overwhelming UI for Simple Teams** — The extensive feature set (goals, milestones, forms, rules) can feel complex for small teams needing simple task tracking.
		- **Rigid Subtask Hierarchies** — Subtasks do not inherit parent project properties (like custom fields) natively, which can make sorting and calendar views difficult.
	-
	- ## Learning Guidelines
	  collapsed:: true
		- **Data Architecture** — **Workspace/Organization** (company container) -> **Portfolios** (projects folder) -> **Projects** (groups tasks) -> **Tasks** (individual action items) -> **Subtasks** (detailed breakdown).
		- **Master Multi-homing** — Instead of copying task descriptions, use Asana's native shortcut (`Tab + P`) to add the same task to multiple projects.
-
- # Multi-Homing & Custom Fields
	- ## Core Conceptual Model
	  collapsed:: true
		- Understanding Multi-Homing and Custom Fields:
		- ```text
		  [ Single Task Object: "Design Database Schema" ]
		           │
		           ├── Project A: "Backend Refactoring" (Custom Field: Complexity = High)
		           │
		           └── Project B: "Sprint 4 Backlog" (Custom Field: Sprint = 4)
		  ```
		- Unlike folders in a filesystem where a file can only exist in one directory, an Asana task exists as a single database record that can be linked to multiple projects simultaneously.
		- **Custom Fields**: Metadata fields (single-select dropdowns, text, numbers) defined at the project level. They are used to categorize tasks, filter views, and drive automation rules.
-
- # Asana Workflow Builder & Rules
	- ## Automated Triage Actions
	  collapsed:: true
		- Asana allows building visual "Trigger -> Action" workflow rules:
		- **Common Triggers**:
			- Task added to project.
			- Custom field changed (e.g., `Priority` set to `High`).
			- Task approval status updated.
		- **Common Actions**:
			- Move task to a specific section (e.g. move to "Blocked").
			- Assign task to a user.
			- Set task due date.
		- **Automation Rule Configuration Example (YAML-like representation)**:
		- ```yaml
		  # Rule: Auto-route bug reports based on department selection
		  Trigger:
		    event: Task Custom Field Changed
		    field: "Department Selector"
		    value: "iOS Development"
		  Action:
		    - type: Assign Task
		      assignee: "ios-team-lead@company.com"
		    - type: Move Section
		      targetSection: "Triage Queue"
		    - type: Set Due Date
		      relativeOffset: "+2 days"
		  ```
-
- # Asana REST API
	- ## Querying Tasks and Handling Pagination
	  collapsed:: true
		- Access Asana programmatically using Personal Access Tokens (PAT) or OAuth.
		- **1. Create a Task (cURL request)**:
		- ```bash
		  curl --request POST \
		    --url 'https://app.asana.com/api/1.0/tasks' \
		    --header 'Authorization: Bearer MY_PERSONAL_ACCESS_TOKEN' \
		    --header 'Content-Type: application/json' \
		    --data '{
		      "data": {
		        "name": "Configure SSL Certificate on Staging Server",
		        "notes": "Verify TLS 1.3 is configured correctly.",
		        "projects": [
		          "1204829381928312"
		        ],
		        "assignee": "928381920",
		        "due_on": "2026-06-01"
		      }
		    }'
		  ```
		- **2. Query Projects with Pagination (cURL request)**:
		- ```bash
		  # Limit results to 20 per request using pagination parameters
		  curl --request GET \
		    --url 'https://app.asana.com/api/1.0/projects?limit=20&workspace=123456789' \
		    --header 'Authorization: Bearer MY_PERSONAL_ACCESS_TOKEN' \
		    --header 'Accept: application/json'
		  ```
		- **Handling Pagination Response**:
			- Asana returns a `next_page` block containing an offset token:
			- ```json
			  {
			    "data": [ ... ],
			    "next_page": {
			      "offset": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
			      "path": "/projects?limit=20&offset=eyJ0eX...",
			      "uri": "https://app.asana.com/api/1.0/projects?limit=20&offset=eyJ0eX..."
			    }
			  }
			  ```
			- To fetch the next page of results, make a GET request to the provided `uri`.
-
- # Teaching Note: Portfolio-based OKR Design
	- ## Linking Strategy to Execution
	  collapsed:: true
		- Enterprise teams use Portfolios to track Key Results (OKRs) programmatically:
			- **Projects**: Execution containers where work happens day-to-day.
			- **Portfolios**: High-level views that pull status fields and progress percentages from connected Projects.
			- **Goals**: Company-wide metric targets. You can connect a Portfolio's progress (e.g. 80% tasks completed) directly to a Goal target (e.g. Launch new API backend) to calculate progress automatically.
	-
	- ## Task Dependencies
	  collapsed:: true
		- Set task relationships by marking one task as "dependent on" another.
		- If Task B depends on Task A, Asana blocks progress notification of Task B until Task A is marked complete.
-
- # More Learn
	- Explore valuable resources for Asana:
		-
		- [Asana Help Center Guides](https://help.asana.com/)
		- [Asana Developer REST API Reference Portal](https://developers.asana.com/reference/)
		- [Asana Custom Fields Configuration Guide](https://help.asana.com/hc/en-us/articles/14112101377819-Custom-fields)
		- [Asana Rules and Automations Builder Guide](https://help.asana.com/hc/en-us/articles/14109403063579-Rules)
