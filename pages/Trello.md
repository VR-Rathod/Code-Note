---
seoTitle: Trello Reference – Boards, Cards, Power-Ups, and Butler Automation Guide
description: "Educational guide to Trello covering board architectures, card systems, Power-Ups, Butler rules, and Trello REST API triggers."
keywords: "Trello, Kanban, boards, cards, Butler automation, Power-Ups, Trello API, webhooks, project management, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Trello
---

- # History
	- **How**:
		- **Trello** was originally developed by **Fog Creek Software** (founded by Joel Spolsky) in **2011** as an internal prototype project.
		- First unveiled at TechCrunch Disrupt in **2011**, it gained popularity for its highly visual, real-time card-based board interface.
		- In **2014**, it spun off as an independent company.
		- In **2017**, Trello was acquired by **Atlassian** for **$425 million**, adding a lightweight, consumer-friendly project management tool to Atlassian's enterprise catalog.
		- Over time, Trello introduced **Butler** (native automation) and **Power-Ups** (plugins) to transition the tool from a simple checklist board to an automated database platform.
	-
	- **Who**:
		- Created by **Joel Spolsky** and the Fog Creek Software team. Owned and maintained by **Atlassian**.
	-
	- **Why**:
		- Created to simplify task management by digitizing physical whiteboard Kanban sticky notes, making project tracking collaborative and intuitive for both technical and non-technical teams.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Extreme Visual Simplicity** — The card-based drag-and-drop layout mimics physical task boards, requiring near-zero training for new team members.
		- **Real-Time Updates** — Changes made by members appear instantly on the board without manual page refreshes.
		- **Natural Language Automation (Butler)** — Automate tasks using simple, English-like rules instead of complex code.
		- **Flexible Power-Ups** — Extend boards with calendars, custom fields, slack channels, and Git integration cards.
		- **Extensive Mobile Apps** — Offline-capable mobile applications keep tasks synchronized on the go.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Scalability Limits** — Boards containing hundreds of cards quickly become cluttered and difficult to manage.
		- **No Native Agile Charts** — Lacks built-in agile reports (velocity, burndown charts) without installing third-party Power-Ups.
		- **Weak Field Constraints** — Hard to enforce strict workflow transition rules (e.g. preventing a card from moving to "Done" unless a link is attached).
	-
	- ## Learning Guidelines
	  collapsed:: true
		- **Board Hierarchy** — **Workspace** (groups projects) -> **Board** (individual project dashboard) -> **List** (workflow stages/status columns) -> **Card** (individual task containing checklists, attachments, and due dates).
		- **Butler Natural Scripting** — Think of Butler as an "If-This-Then-That" engine. You write commands as normal English sentences, and Trello parses them into active automation triggers.
-
- # Butler Automation
	- ## Natural Language Scripting Engine
	  collapsed:: true
		- Butler automates Trello boards using rules, buttons, and calendar triggers defined in plain English.
		- **1. Rules Triggers**:
			- Trigger: *When a card is moved into list "Done"*
			- Action: *Mark the due date as complete, remove all members from the card, and post comment "Task finished!"*
		- **2. Card Buttons**:
			- Button Name: *Release to Prod*
			- Action: *Add the "Production" label, move the card to the top of list "Released", and set due date to "now"*
		- **3. Calendar Rules**:
			- Trigger: *Every Friday at 5:00 PM*
			- Action: *Find all cards in list "To Do" with past due dates, assign them to @manager, and set label "Urgent"*
		- **Example Butler Configuration**:
		- ```text
		  # Natural language rule defined in Butler editor
		  when a checklist item is marked as complete in a card
		  if all checklist items are complete in the card
		  move the card to list "In Review"
		  and set due date in 3 days
		  ```
-
- # Trello REST API
	- ## Querying Boards and Creating Cards
	  collapsed:: true
		- Developers can integrate with Trello using their API key and OAuth token credentials.
		- **1. Create a New Card (cURL request)**:
		- ```bash
		  curl --request POST \
		    --url 'https://api.trello.com/1/cards' \
		    --header 'Content-Type: application/json' \
		    --data '{
		      "key": "MY_TRELLO_DEVELOPER_KEY",
		      "token": "MY_TRELLO_USER_TOKEN",
		      "name": "Write API Documentation",
		      "desc": "Detail all endpoints and query parameters.",
		      "idList": "647382d19fba8271a82b9381",
		      "keepFromSource": "all"
		    }'
		  ```
		- **2. Fetch all Lists on a Board (cURL request)**:
		- ```bash
		  curl --request GET \
		    --url 'https://api.trello.com/1/boards/BOARD_ID_VALUE/lists?key=MY_KEY&token=MY_TOKEN' \
		    --header 'Accept: application/json'
		  ```
		- **3. Create Webhook for Board updates (cURL payload)**:
		- ```bash
		  curl --request POST \
		    --url 'https://api.trello.com/1/webhooks' \
		    --header 'Content-Type: application/json' \
		    --data '{
		      "key": "MY_TRELLO_DEVELOPER_KEY",
		      "token": "MY_TRELLO_USER_TOKEN",
		      "description": "Monitor Card moves",
		      "callbackURL": "https://api.company.com/trello-webhook-endpoint",
		      "idModel": "BOARD_ID_VALUE"
		    }'
		  ```
-
- # Teaching Note: Designing Boards for Teams
	- ## Work-In-Progress (WIP) Limits
	  collapsed:: true
		- Trello boards can easily clutter if there are no column limit controls. 
		- **Enforcing WIP Limits**:
			- Install the **"WIP Limits"** Power-Up or set list-level card limits manually.
			- E.g., if list "In Development" has a limit of 3, the column background turns red if a 4th card is dragged in.
			- This forces the team to help resolve stuck tasks before taking on new ones.
	-
	- ## Labeling Conventions
	  collapsed:: true
		- Avoid naming labels with colors only (e.g. "Red label", "Blue label"). Always assign clear text labels to colors (e.g., Red = `Blocker`, Yellow = `Needs Feedback`, Green = `Ready for Review`).
-
- # More Learn
	- Explore valuable resources for Trello:
		-
		- [Trello Help Documentation](https://help.trello.com/)
		- [Trello REST API Developer Reference Portal](https://developer.atlassian.com/cloud/trello/rest/)
		- [Butler Automation Commands Guide](https://help.trello.com/category/1155-butler-automation)
		- [Trello Power-Up Directory Platform](https://trello.com/power-ups)
