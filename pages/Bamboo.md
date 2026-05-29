---
seoTitle: Bamboo Reference – Specs, Plan Branches, and Deployments Guide
description: "Educational Atlassian Bamboo CI/CD reference covering plans, stages, jobs, tasks, Bamboo Specs (Java/YAML configuration-as-code), plan branches, and deployment projects."
keywords: "Bamboo, Atlassian, Bamboo Specs, CI/CD, devops, Jira integration, build plans, build agent, plan branches, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Bamboo
---

- # History
	- **How**:
		- **Bamboo** was released by **Atlassian** in **2007** as a commercial continuous integration server to complement their popular tracking tool, Jira.
		- Originally developed as an on-premises Java server, it offered a visual build plan designer.
		- Key milestones:
			- **Atlassian Stack Coupling**: Built out-of-the-box integrations linking Jira issue tickets directly to commits, build statuses, and deployment releases.
			- **Deployment Projects (2013)**: Separated build tasks (compiling code) from deployment tasks (moving artifacts to environments) into distinct UI systems.
			- **Bamboo Specs (2017)**: Introduced configuration-as-code using Java or YAML representations to define build configurations programmatically.
	-
	- **Who**:
		- Developed, licensed, and maintained commercially by **Atlassian Corporation**.
	-
	- **Why**:
		- Created to provide enterprise software engineering teams using the Atlassian product suite with a centralized build and release system that traces the entire lifecycle of code from Jira tasks to production deployments.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Native Atlassian Integration** — Automatic linkage between Jira tickets, Bitbucket pull requests, and Bamboo build results. Commits containing Jira keys automatically show build statuses inside Jira.
		- **Build vs. Deployment Separation** — Enforces a strict separation of concerns where build plans focus on compilation, and deployment projects manage environment releases.
		- **Automatic Plan Branching** — Automatically detects new branches in Git repositories, clones the main build plan, and runs tests for the branch without manual configuration.
		- **Agent Elastic Scaling** — Elastic agents spin up in AWS EC2 dynamically to handle heavy build queues and shut down when idle.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Commercial Licensing Overhead** — Only available under proprietary licenses. Free options are highly limited compared to open-source servers.
		- **On-Premises Infrastructure Maintenance** — Unlike cloud-native SaaS platforms, hosting, backing up, database connection maintenance, and upgrades are manual operations.
		- **Rigid Configuration Model** — The strict separation between build plans and deployments makes it harder to define quick, single-file scripts compared to YAML-only environments like GitHub Actions.
	-
	- ## Learning Guidelines
	  collapsed:: true
		- **Execution Hierarchy** — **Project** (groups related plans) -> **Plan** (defines VCS roots, triggers, and stages) -> **Stage** (parallel execution blocks) -> **Job** (runs sequentially on a single build agent) -> **Task** (individual build step operations).
		- **Build Artifact Hand-off** — Build plans *must* declare explicit "artifacts" to save compile outputs. These saved files are then referenced by name in deployment projects.
-
- # Bamboo Specs: Configuration-as-Code
	- ## YAML Specs syntax
	  collapsed:: true
		- Bamboo Specs let you define pipelines programmatically using Java or YAML files.
		- **bamboo.yaml** (YAML Specs configuration):
		- ```yaml
		  # Define Bamboo Specs schema version
		  version: 2
		  
		  # Define the plan project and keys
		  plan:
		    project-key: PROJ
		    key: BUILD
		    name: Web Application Build Plan
		    
		  # Configure version control root
		  repositories:
		    - my-git-repo:
		        type: git
		        url: 'https://bitbucket.org/company/my-project.git'
		        branch: main
		        authentication:
		          ssh-private-key: 'Bitbucket-Service-Key'
		  
		  # Define SCM triggers
		  triggers:
		    - repository-polling:
		        frequency: 180 # Poll SCM every 3 minutes
		  
		  # Define build stages and jobs
		  stages:
		    - Compilation Stage:
		        manual: false
		        jobs:
		          - Build and Test Job:
		              key: JOB1
		              tasks:
		                # Task 1: Check out source code
		                - checkout:
		                    repository: my-git-repo
		                    force-clean-build: true
		                # Task 2: Compile project
		                - script:
		                    name: Install Dependencies and Build
		                    interpreter: SHELL
		                    scripts:
		                      - npm install
		                      - npm run build
		                # Task 3: Execute tests
		                - script:
		                    name: Run Unit Tests
		                    interpreter: SHELL
		                    scripts:
		                      - npm run test
		              # Declare artifact outputs to make them available for deployments
		              artifacts:
		                - name: Build Artifact Package
		                  location: dist
		                  pattern: '**/*'
		                  shared: true # Shared artifacts can be downloaded by deployment jobs
		  ```
-
- # Deployment Projects vs. Build Plans
	- ## Architectural Separation
	  collapsed:: true
		- A key design feature of Bamboo is the architectural split between builds and deployments:
			- **Build Plans**:
				- Triggered by git commits, pull requests, or schedules.
				- Focus on testing, compiling, and packaging code.
				- Run in parallel across standard build agents.
				- Produce **Shared Artifacts** (e.g., zip, jar, tar.gz) and store them in Bamboo's central registry.
			- **Deployment Projects**:
				- Focus on releasing build artifacts to specific **Environments** (e.g. Staging, Production).
				- Enforce environment-specific configurations (e.g. API keys, database connection strings).
				- Enforce **Release Versioning** (e.g., automatically name releases as `release-1.2.${bamboo.buildNumber}`).
				- Define **Deployment Triggers** (e.g., deploy to staging automatically when build succeeds, deploy to production only after manual manager approval).
-
- # Plan Branching & PR Gatekeeper
	- ## Automated Branch Workflows
	  collapsed:: true
		- Bamboo handles branches dynamically, avoiding the need to duplicate build plans manually.
		- **Automatic Plan Branching**:
			- When a developer pushes a branch (e.g. `feature/login`), Bamboo detects it via SCM polling or webhooks.
			- It automatically creates a lightweight clone of the main build plan linked to the new branch.
			- It can be configured to delete these branch plans automatically after a period of inactivity (e.g., 7 days after the branch is merged).
		- **Branch Merging Gatekeeper (Integration)**:
			- **Gatekeeper Model**: Bamboo checks out the main branch, merges the feature branch into it locally on the build agent, runs the test suite, and only pushes the merge commit back to Bitbucket if all tests pass.
			- **PR Trigger**: Integrates with Bitbucket Server to trigger plan executions automatically when a PR is created or updated, blocking merge approvals if build statuses are red.
-
- # Teaching Note: Key Concepts & Gotchas
	- ## Agent Workspace Cleanup
	  collapsed:: true
		- When running builds on dedicated physical agents, checkout workspaces persist. If consecutive builds run on different branches, files can leak. Always force checkout tasks to run with clean rules:
		- ```yaml
		  tasks:
		    - checkout:
		        repository: my-git-repo
		        force-clean-build: true # Removes untracked files and cleans directory
		  ```
	-
	- ## Jira Integration Tracing
	  collapsed:: true
		- To leverage automatic tracing, developers must include Jira issue keys (e.g., `PROJ-123`) in their git commit messages:
			- Commit: `git commit -m "PROJ-123: Add login authentication API"`
			- When pushed, Bitbucket links this commit to Jira, and when Bamboo builds it, the Jira dashboard will automatically display build passes/failures and deployment environments.
-
- # More Learn
	- Explore valuable resources for Atlassian Bamboo:
		-
		- [Bamboo Documentation Portal](https://confluence.atlassian.com/bamboo)
		- [Bamboo Specs YAML Reference Index](https://confluence.atlassian.com/bamboo/bamboo-specs-reference-894747209.html)
		- [Jira Software CI/CD Integration Guides](https://confluence.atlassian.com/bamboo/integrating-bamboo-with-jira-software-289277024.html)
		- [Atlassian Developers Developer Platform](https://developer.atlassian.com/)
