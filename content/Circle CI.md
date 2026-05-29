---
seoTitle: CircleCI Reference – Config.yml, Workflows, Orbs, and Executors Guide
description: "In-depth CircleCI reference guide covering config.yml structure, jobs, workflows, docker executors, reusable parameters, caching, and custom Orbs."
keywords: "CircleCI, config.yml, workflows, orbs, CI/CD, executors, pipelines, caching, parameters, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Circle CI
---

- # History
	- **How**:
		- **CircleCI** was founded in **2011** by **Paul Biggar** and **Allen Rohner** to offer a managed, cloud-hosted CI/CD tool that was easier to set up than self-hosted Jenkins.
		- Originally integrated only with GitHub, it automatically scanned repository pushes and ran tests in clean sandboxed virtual machines.
		- Key revisions:
			- **CircleCI 1.0**: Relied on custom JSON/YAML parsing that guessed build commands.
			- **CircleCI 2.0 (2017)**: Introduced a completely revised config parser using a strict, explicit YAML configuration schema (`.circleci/config.yml`) with Docker container runs.
			- **CircleCI 2.1 (2018)**: Added features for configuration reuse: Orbs (reusable config packages), commands, parameters, and executor templates.
	-
	- **Who**:
		- Created by **Paul Biggar** and **Allen Rohner**, developed and hosted as a commercial platform by **Circle Internet Services**.
	-
	- **Why**:
		- To provide developers with a fast, zero-administration, container-native cloud build service that scales horizontally automatically without requiring server maintenance.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Zero Server Configuration** — Standard SaaS offering removes VM provisioning, hosting, security updates, and software licensing.
		- **Orbs Ecosystem** — Reusable, parameterized packaging framework to integrate cloud providers (AWS, GCP, Azure, Slack) in single code blocks.
		- **Fast Parallel Execution** — Build runner containers spin up rapidly with advanced parallel caching features to reduce execution times.
		- **SSH Debugging** — Developers can pause failing jobs and spin up an SSH terminal inside the build container to debug issues interactively.
		- **Multi-OS Support** — Native running targets on macOS (for iOS builds), Linux containers, Windows VMs, and ARM architectures.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Resource Pricing Model** — Uses a credit consumption model where CPU/memory sizes and execution times translate to running costs that can spike during heavy build cycles.
		- **Limited Self-Hosting** — While an "Enterprise Server" option exists, CircleCI is primarily designed for and used in cloud SaaS environments.
		- **Complex Local Testing** — The CircleCI local CLI tool can validate YAML structures, but executing jobs locally cannot completely match cloud environments.
	-
	- ## Remember Points
	  collapsed:: true
		- **Config File Location** — The configuration must be stored in the root directory inside a hidden folder: `.circleci/config.yml`.
		- **Workspaces vs. Caches** — Use *Workspaces* to pass compiled output files between jobs in the same workflow. Use *Caches* to store third-party libraries (like node_modules) across separate workflows.
-
- # YAML Configuration Architecture
	- ## Core Configuration blocks (Version 2.1)
	  collapsed:: true
		- ```yaml
		  version: 2.1
		  
		  # 1. Executors declare runtime environment templates
		  executors:
		    node-docker:
		      docker:
		        - image: cimg/node:18.16.0
		      working_directory: ~/my-project
		      
		  # 2. Reusable Commands (custom macros)
		  commands:
		    setup-app:
		      description: "Install dependencies and clear lock files"
		      steps:
		        - checkout
		        - restore_cache:
		            keys:
		              - npm-deps-{{ checksum "package-lock.json" }}
		        - run: npm install
		        - save_cache:
		            key: npm-deps-{{ checksum "package-lock.json" }}
		            paths:
		              - node_modules
		              
		  # 3. Jobs execute individual series of steps inside an executor
		  jobs:
		    build-and-test:
		      executor: node-docker
		      steps:
		        - setup-app
		        - run:
		            name: Run Linting Checks
		            command: npm run lint
		        - run:
		            name: Execute Unit Tests
		            command: npm run test
		        - persist_to_workspace:
		            root: ~/my-project
		            paths:
		              - dist
		              
		    deploy:
		      executor: node-docker
		      steps:
		        - attach_workspace:
		            at: ~/my-project
		        - run:
		            name: Push Build to Hosting Platform
		            command: echo "Uploading files from workspace dist/ directory..."
		            
		  # 4. Workflows coordinate orchestration and execution logic of jobs
		  workflows:
		    build_and_deploy_flow:
		      jobs:
		        - build-and-test
		        - deploy:
		            requires:
		              - build-and-test
		            filters:
		              branches:
		                only: main
		  ```
-
- # Workflows and Orchestration
	- ## Execution Gates, Approvals, and Filters
	  collapsed:: true
		- Workflows manage job sequencing, conditional execution, manual approval stages, and target filters:
		- ```yaml
		  version: 2.1
		  
		  jobs:
		    test-code:
		      docker:
		        - image: cimg/python:3.9
		      steps:
		        - checkout
		        - run: pytest
		        
		    hold-gate:
		      docker:
		        - image: cimg/base:stable
		      steps:
		        - run: echo "Preparing manual deployment authorization..."
		        
		    deploy-prod:
		      docker:
		        - image: cimg/aws:2023.05
		      steps:
		        - run: aws s3 sync . s3://production-bucket
		        
		  workflows:
		    delivery_workflow:
		      jobs:
		        - test-code
		        # Interactive manual check: execution pauses until clicked in Dashboard UI
		        - approve-deploy:
		            type: approval
		            requires:
		              - test-code
		        - deploy-prod:
		            requires:
		              - approve-deploy
		            filters:
		              # Apply tag filters (by default, tags are ignored in Workflows!)
		              tags:
		                only: /^v.*/
		              branches:
		                ignore: /.*/
		  ```
-
- # Caching & Workspace Persistence
	- ## Storage Scopes and Optimization
	  collapsed:: true
		- *Caches* are global across all pipelines and branches (keyed strings). *Workspaces* are unique to a single workflow instance to pass states.
		- ```yaml
		  version: 2.1
		  
		  jobs:
		    compiler_job:
		      docker:
		        - image: cimg/rust:1.70
		      steps:
		        - checkout
		        # 1. Restore caches to speed up compile times
		        - restore_cache:
		            keys:
		              - rust-cargo-{{ checksum "Cargo.lock" }}
		              - rust-cargo-
		        - run: cargo build --release
		        # 2. Save cargo registry files back to cache
		        - save_cache:
		            key: rust-cargo-{{ checksum "Cargo.lock" }}
		            paths:
		              - "~/.cargo/registry"
		              - "target"
		        # 3. Persist compiled binaries to workspace for downstream stages
		        - persist_to_workspace:
		            root: .
		            paths:
		              - target/release/app-binary
		  ```
-
- # CircleCI Orbs Integration
	- ## Reusable Configuration Packages
	  collapsed:: true
		- Orbs are shared configuration packages. Import them at the top of the file to use pre-packaged jobs and steps.
		- ```yaml
		  version: 2.1
		  
		  # Import Orbs from registry
		  orbs:
		    node: circleci/node@5.1.0
		    aws-s3: circleci/aws-s3@3.1.1
		    
		  workflows:
		    orb_workflow:
		      jobs:
		        # Use pre-defined job structure directly from node Orb
		        - node/test:
		            version: "18.16.0"
		            run-tests: true
		            pkg-manager: npm
		  ```
-
- # Matrix Parameterized Builds
	- ## Multi-version Running Grids
	  collapsed:: true
		- Run a job multiple times with different combinations of parameters:
		- ```yaml
		  version: 2.1
		  
		  jobs:
		    test-node-version:
		      parameters:
		        version:
		          type: string
		        os:
		          type: string
		      docker:
		        - image: cimg/<< parameters.os >>:<< parameters.version >>
		      steps:
		        - checkout
		        - run: node --version
		        
		  workflows:
		    matrix_workflow:
		      jobs:
		        - test-node-version:
		            matrix:
		              parameters:
		                version: ["16.20.0", "18.16.0", "20.2.0"]
		                os: ["node"]
		  ```
-
- # More Learn
	- Explore valuable resources for CircleCI:
		-
		- [CircleCI Developer Portal](https://circleci.com/docs/)
		- [CircleCI Configuration Reference Index](https://circleci.com/docs/configuration-reference/)
		- [CircleCI Orbs Registry Directory](https://circleci.com/developer/orbs)
		- [CircleCI CLI Installer and Commands Guide](https://circleci.com/docs/local-cli/)
