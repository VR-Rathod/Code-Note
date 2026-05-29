---
seoTitle: GitHub Actions Reference – Workflows, Runners, and Security Guide
description: "In-depth GitHub Actions developer guide covering workflow YAML files, triggers, runner environments, matrix grids, composite actions, and security best practices."
keywords: "GitHub Actions, workflows, runner, composite actions, reusable workflows, CI/CD, secrets, environment variables, GitHub marketplace, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: GitHub Actions
---

- # History
	- **How**:
		- **GitHub Actions** was announced at GitHub Universe in late **2018** as a flexible system for repository events automation.
		- Originally, Actions relied on a visual drag-and-drop workflow designer that generated HCL (HashiCorp Configuration Language) configuration files.
		- In **2019**, GitHub overhauled the platform, replacing HCL with a standardized **YAML syntax** and expanding the platform to support complete CI/CD build runners (Windows, Linux, macOS).
		- Key innovations:
			- **Marketplace Integration**: Developers can publish reusable steps to a public search registry, allowing others to reference them directly (e.g. `actions/checkout@v3`).
			- **Event-Driven Execution**: Builds can trigger on any repository event (push, issue creation, releases, repository dispatch, pull requests).
	-
	- **Who**:
		- Developed, hosted, and maintained by **GitHub Inc.** (acquired by **Microsoft** in 2018).
	-
	- **Why**:
		- Created to integrate continuous integration, automation scripts, and continuous deployment directly into the code hosting repository itself, removing the need to manage third-party build hooks.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Native Repository Integration** — No external tool account creation or webhooks configuration needed. Access control is managed through GitHub organization permissions.
		- **Vast Marketplace** — Choose from thousands of pre-written integration steps (Orbs-like) for cloud deployments, language initializations, linting, and messaging.
		- **Robust Event Triggers** — Trigger pipelines on branch pushes, issue comments, release creation, wiki edits, or manual input forms.
		- **Generous Free Tier** — Free execution time for public repositories, with moderate monthly running quotas for private accounts.
		- **Self-Hosted Runners** — Spin up private background agents on local physical hardware or VM instances for free.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Security Risk from Marketplace Actions** — Referencing community-provided actions introduces supply chain risks if repositories are hijacked.
		- **Debugging Complexity** — Testing workflows requires committing code and viewing runs on the website, as local testing options (like the `act` tool) are incomplete.
		- **Environment Scopes Logging** — Logs can become verbose and secrets masking filters can sometimes block non-secret text.
	-
	- ## Learning Guidelines
	  collapsed:: true
		- **Pipeline Hierarchy** — A **Workflow** is defined in a single `.github/workflows/*.yml` file, containing **Jobs** (running on individual runner environments in parallel), containing **Steps** (individual shell tasks or compiled Actions running sequentially).
		- **Token Privileges** — By default, jobs receive an automatic authentication secret `${{ secrets.GITHUB_TOKEN }}`. Always declare explicit permissions blocks to restrict read/write access to this token.
-
- # Core Conceptual Model
	- ## Event-Driven Pipeline Architecture
	  collapsed:: true
		- Understanding the orchestration flow of GitHub Actions:
		- ```text
		  [ Repository Event (e.g., Pull Request) ]
		                     │
		          [ Workflow File: main.yml ]
		                     │
		         ┌───────────┴───────────┐
		    [ Job 1: Lint ]         [ Job 2: Test ]  <-- Parallel Execution
		    (Runs on Ubuntu)        (Runs on macOS)
		         │                       │
		      Step 1: Checkout        Step 1: Checkout
		      Step 2: Run ESLint      Step 2: Run PyTest
		  ```
		- **Event**: The trigger activity (e.g., git push, PR merge, issue comment) that initiates the workflow.
		- **Jobs**: Isolated build environments. Multiple jobs in a workflow execute in parallel by default, but dependencies can be configured using `needs`.
		- **Steps**: Sequential tasks inside a job. A step can execute shell commands or reference a pre-compiled Action (JavaScript/Docker container).
-
- # YAML Workflow Anatomy
	- ## Annotated Configuration
	  collapsed:: true
		- Below is a complete, production-ready pipeline template explaining syntax hooks:
		- ```yaml
		  # .github/workflows/integrate.yml
		  name: Continuous Integration Workflow
		  
		  # Define triggers: Push to main OR manually via UI
		  on:
		    push:
		      branches:
		        - main
		    workflow_dispatch:
		      inputs:
		        debug_mode:
		          description: 'Enable verbose logging'
		          required: true
		          default: 'false'
		          type: boolean
		  
		  # Set default settings for all run shell steps
		  defaults:
		    run:
		      shell: bash
		  
		  jobs:
		    build-and-test:
		      name: Compile & Test Suite
		      runs-on: ubuntu-latest
		      
		      # Limit GITHUB_TOKEN scope for security
		      permissions:
		        contents: read
		        packages: write
		        
		      steps:
		        # Step 1: Checkout code using marketplace action
		        - name: Retrieve Repository Code
		          uses: actions/checkout@v3
		          
		        # Step 2: Setup runtime environment
		        - name: Setup Node.js Runtime
		          uses: actions/setup-node@v3
		          with:
		            node-version: '18'
		            cache: 'npm' # Automatically caches node_modules
		            
		        # Step 3: Conditional execution step
		        - name: Install dependencies
		          run: npm ci
		          
		        # Step 4: Run scripts using multi-line syntax
		        - name: Execute Tests
		          run: |
		            npm run lint
		            npm test
		          env:
		            CI: true
		            
		        # Step 5: Read manual dispatch inputs using expressions
		        - name: Conditional Debug Output
		          if: ${{ github.event.inputs.debug_mode == 'true' }}
		          run: echo "Verbose debug logs enabled. Running diagnostics..."
		  ```
-
- # Contexts & Conditional Expressions
	- ## Accessing Pipeline Metadata
	  collapsed:: true
		- Expressions evaluate properties dynamically during run phases. They are enclosed inside `${{ ... }}` syntax.
		- **Common Contexts**:
			- `github`: Metadata about the workflow execution (e.g. `github.sha`, `github.actor`).
			- `env`: Contains custom environment variables.
			- `secrets`: Access secure encrypted vault variables (e.g. `${{ secrets.SLACK_WEBHOOK_URL }}`).
			- `matrix`: Access parameters values in matrix builds.
		- **Syntax Evaluation Example**:
		- ```yaml
		  jobs:
		    deploy:
		      runs-on: ubuntu-latest
		      # Run job only if push was made by actor 'admin-user' on branch 'main'
		      if: ${{ github.ref == 'refs/heads/main' && github.actor == 'admin-user' }}
		      steps:
		        - name: Deploy API
		          run: ./deploy.sh
		          env:
		            API_TOKEN: ${{ secrets.DEPLOY_SECRET_TOKEN }}
		  ```
-
- # Custom Actions: Composite Actions
	- ## Packaging Reusable Build Steps
	  collapsed:: true
		- Composite actions let you package multiple shell/setup commands into a single, clean marketplace action file.
		- **action.yml** (Action definition placed in `.github/actions/setup-python-custom/action.yml`):
		- ```yaml
		  # action.yml
		  name: 'Custom Python Setup'
		  description: 'Installs Python, restores caches, and sets up dependencies'
		  inputs:
		    python-version:
		      description: 'Version of python to install'
		      required: false
		      default: '3.9'
		  outputs:
		    cache-hit:
		      description: 'True if cache was successfully restored'
		      value: ${{ steps.cache.outputs.cache-hit }}
		      
		  runs:
		    using: 'composite'
		    steps:
		      - name: Setup Python Runtime
		        uses: actions/setup-python@v4
		        with:
		          python-version: ${{ inputs.python-version }}
		          
		      - name: Cache dependencies
		        id: cache
		        uses: actions/cache@v3
		        with:
		          path: ~/.cache/pip
		          key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
		          
		      - name: Install requirements
		        shell: bash # Composite actions MUST declare explicit shell type
		        run: pip install -r requirements.txt
		  ```
		- **Using the Composite Action inside a Workflow**:
		- ```yaml
		  steps:
		    - uses: actions/checkout@v3
		    
		    # Call local custom composite action
		    - name: Run Custom Setup Steps
		      uses: ./.github/actions/setup-python-custom
		      with:
		        python-version: '3.10'
		  ```
-
- # Teaching Note: Security & Performance
	- ## Command Injection Vulnerability
	  collapsed:: true
		- Never reference dynamic GitHub contexts (like `github.event.issue.title` or `github.head_ref`) directly inside shell scripts. Malicious users can name PR branches with bash injection code (e.g. `test; rm -rf /`).
		- **Vulnerable Code**:
		- ```yaml
		  # DANGER: Will evaluate title directly inside bash!
		  - name: Print Title
		    run: echo "PR Title is: ${{ github.event.pull_request.title }}"
		  ```
		- **Secure Alternative**: Pass metadata through environment variables. Bash safely treats env inputs as string literals.
		- ```yaml
		  - name: Print Title Safely
		    run: echo "PR Title is: $TITLE"
		    env:
		      TITLE: ${{ github.event.pull_request.title }}
		  ```
	-
	- ## Reusable Workflows vs. Composite Actions
	  collapsed:: true
		- Developers often mix up when to use each configuration pattern:
			- **Composite Actions**: Packaged script steps. Excellent for reusing sequence commands inside a single repository or sharing on the Marketplace. They cannot declare their own independent `jobs` or reference custom runner containers.
			- **Reusable Workflows**: Complete workflow files called from other workflows. They can declare multiple parallel `jobs`, target different execution pools, and accept secrets directly as parameters.
-
- # More Learn
	- Explore valuable resources for GitHub Actions:
		-
		- [GitHub Actions Documentation](https://docs.github.com/en/actions)
		- [GitHub Actions Marketplace Directory](https://github.com/marketplace?type=actions)
		- [Contexts and Expression Syntax Reference](https://docs.github.com/en/actions/learn-github-actions/contexts)
		- [Security Guide: Hardening GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
