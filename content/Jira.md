---
seoTitle: Jira Reference – Workflows, JQL, Agile Boards, and API Guide
description: "In-depth educational reference for Jira covering issue types, workflows, JQL (Jira Query Language) syntax, automation rules, and REST API queries."
keywords: "Jira, Atlassian, JQL, Jira Query Language, Workflows, Jira API, Agile, Scrum, Kanban, automation, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Jira
---

- # History
	- **How**:
		- **Jira** was launched by **Atlassian** in **2002** as a bug and issue tracking tool for software developers.
		- The name "Jira" is derived from **"Gojira"** (the Japanese name for Godzilla), referencing their early bug-tracking competitor, Bugzilla.
		- Key milestones:
			- **Jira Agile (GreenHopper)**: Acquired and integrated in **2009** to support Scrum and Kanban boards.
			- **Jira Service Desk (2013)**: Extended Jira to IT service management (ITSM) queues.
			- **Jira Cloud Redesign (2018)**: Shifted focus from complex on-premises server instances to hosted cloud solutions with simplified "Next-Gen" (team-managed) projects.
	-
	- **Who**:
		- Developed, licensed, and hosted commercially by **Atlassian Corporation**.
	-
	- **Why**:
		- Created to provide software engineering and product teams with a highly customizable project management tool that tracks tasks, bug reports, and features through complex operational workflows.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Extreme Customizability** — Define custom issue types, unique workflows, custom fields, and layout screens for different teams.
		- **Powerful Querying (JQL)** — Search across thousands of issues using a dedicated, SQL-like query language (Jira Query Language).
		- **Strong Agile Frameworks** — Native dashboards for sprint planning, velocity tracking, cumulative flow diagrams, and burndown charts.
		- **Vast Marketplace Integrations** — Connect directly to SCM tools (GitHub/Bitbucket), test suites (Xray/Zephyr), and documentation platforms (Confluence).
	-
	- ## Disadvantages
	  collapsed:: true
		- **Complexity Bloat** — Advanced settings, schemes inheritance (permission schemes, workflow schemes), and field configurations require dedicated administrators.
		- **Sluggish Web UI** — Heavy backend database queries and extensive UI scripts can make load times slow.
		- **Cost Scaling** — Per-user licensing costs can grow rapidly for large enterprise teams.
	-
	- ## Learning Guidelines
	  collapsed:: true
		- **Jira Data Architecture** — **Project** (groups issues) -> **Issues** (individual tasks/bugs) -> **Status** (current column) -> **Workflows** (valid transition paths between columns).
		- **Avoid Workflow Sprawl** — Always keep workflows as simple as possible. Designing complex, rigid workflows with dozens of transitions can frustrate development teams.
-
- # Jira Query Language (JQL)
	- ## SQL-like Query Syntax
	  collapsed:: true
		- JQL allows developers to query issues using fields, operators, and functions:
		- **JQL Syntax Operators**:
			- `=`, `!=`, `>`, `<`, `>=`, `<=`: Standard comparison operators.
			- `IN`, `NOT IN`: Match against arrays (e.g. `status IN ("In Progress", "In Review")`).
			- `~` (Contains), `!~` (Does not contain): Match text using wildcards (e.g. `summary ~ "auth"`).
			- `IS EMPTY`, `IS NOT EMPTY`: Check for null/unassigned fields.
			- `WAS`, `CHANGED`: History operators tracking past states (e.g. `assignee WAS currentUser()`).
		- **JQL Search Queries Examples**:
		- ```text
		  # Query 1: Find unassigned, high-priority bugs in the current active sprint
		  project = "Ecom API" AND issuetype = Bug AND priority IN (High, Highest) AND assignee IS EMPTY AND sprint in openSprints()
		  
		  # Query 2: Find issues resolved in the last 7 days by a specific team member
		  resolved >= -7d AND resolver = "john.doe@company.com" ORDER BY resolved DESC
		  
		  # Query 3: Find tickets that transitioned from 'In Progress' to 'In Review' in the current week
		  status CHANGED FROM "In Progress" TO "In Review" DURING (startOfWeek(), endOfWeek())
		  
		  # Query 4: Search for tickets containing 'database' in the title or description
		  summary ~ "database" OR description ~ "database"
		  ```
-
- # Jira Automation Rules
	- ## Trigger-Condition-Action Flows
	  collapsed:: true
		- Team members can define codeless rules to automate ticket assignments, status updates, and webhooks.
		- **Rule Structure**:
			- **Trigger**: Defines the event (e.g., `Issue Transitioned`, `Comment Added`).
			- **Condition**: Filters the issues (e.g., `JQL Condition`, `User Condition`).
			- **Action**: Performs the operation (e.g., `Transition Issue`, `Send Webhook`).
		- **Automation Rule Configuration Example (YAML-like logic representation)**:
		- ```yaml
		  # Rule: Auto-close parent issue when all subtasks are resolved
		  Trigger:
		    event: Issue transition
		    from: Any Status
		    to: "Done"
		  Condition:
		    type: Issue type check
		    check: Is Sub-task
		  Branch:
		    type: For Parent Issue
		    Conditions:
		      - type: JQL validation
		        jql: "subtasks.status = Done" # Verify all subtasks are finished
		    Action:
		      type: Transition issue
		      targetStatus: "Done"
		      comment: "Automatically closing parent issue as all subtasks are completed."
		  ```
-
- # Jira REST API v3 Integration
	- ## Querying and Mutating Issues
	  collapsed:: true
		- Integrate custom applications with Jira Cloud using basic auth (email + API token).
		- **1. Get Issue Details (cURL request)**:
		- ```bash
		  curl --request GET \
		    --url 'https://company.atlassian.net/rest/api/3/issue/PROJ-123' \
		    --user 'my-email@company.com:MY_JIRA_API_TOKEN' \
		    --header 'Accept: application/json'
		  ```
		- **2. Create New Issue (cURL payload)**:
		- ```bash
		  curl --request POST \
		    --url 'https://company.atlassian.net/rest/api/3/issue' \
		    --user 'my-email@company.com:MY_JIRA_API_TOKEN' \
		    --header 'Accept: application/json' \
		    --header 'Content-Type: application/json' \
		    --data '{
		      "fields": {
		        "project": {
		          "key": "API"
		        },
		        "summary": "Implement JWT Auth Refresh Token endpoint",
		        "description": {
		          "type": "doc",
		          "version": 1,
		          "content": [
		            {
		              "type": "paragraph",
		              "content": [
		                {
		                  "type": "text",
		                  "text": "Add a POST /auth/refresh route to issue new access tokens."
		                }
		              ]
		            }
		          ]
		        },
		        "issuetype": {
		          "name": "Task"
		        },
		        "priority": {
		          "name": "Medium"
		        }
		      }
		    }'
		  ```
-
- # Teaching Note: Workflow Constraints & Best Practices
	- ## Validators, Conditions, and Post-functions
	  collapsed:: true
		- Advanced workflows enforce compliance gates during status transitions:
			- **Conditions**: Check user permissions before showing a transition button. E.g., only QA members can see the "Pass QA" button.
			- **Validators**: Check fields *after* clicking a transition button but *before* committing the change. E.g., require a "Resolution Description" field to be filled out before moving a ticket to "Done".
			- **Post-functions**: Operations performed automatically *after* a transition is saved. E.g., set the "Resolution Date" and clear the "Assignee" field.
	-
	- ## Avoid Workflow Complexity
	  collapsed:: true
		- Enterprise projects frequently end up with "spiderweb workflows" where any status can transition to any other status. This makes metric reports (like lead time) highly inaccurate. Enforce structured, linear lifecycles.
-
- # More Learn
	- Explore valuable resources for Jira:
		-
		- [Atlassian Jira Product Documentation](https://support.atlassian.com/jira-software/)
		- [Jira Query Language (JQL) Reference Guide](https://support.atlassian.com/jira-service-management-cloud/docs/use-advanced-search-with-jira-query-language-jql/)
		- [Jira Cloud REST API v3 Developer Portal](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/)
		- [Atlassian University Learning Courses](https://university.atlassian.com/)
