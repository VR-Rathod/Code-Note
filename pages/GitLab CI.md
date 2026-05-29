---
seoTitle: GitLab CI/CD Reference – Pipelines, Runners, and YAML Configuration Guide
description: "Comprehensive GitLab CI/CD reference covering .gitlab-ci.yml syntax, runners, stages, variables, cache, artifacts, rules, dynamic child pipelines, and environments."
keywords: "GitLab CI, GitLab CI/CD, .gitlab-ci.yml, runner, CI/CD pipeline, devops, cache vs artifacts, dynamic pipelines, rules, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: GitLab CI
---

- # History
	- **How**:
		- **GitLab CI** was originally created as a standalone open-source companion project to GitLab, developed by **Dmitriy Zaporozhets** and **Kamil Trzciński** in **2012**.
		- In **2015** (GitLab 8.0), GitLab CI was integrated directly into the core GitLab product, meaning developers no longer needed to maintain a separate CI server.
		- Key innovations:
			- Introduced **GitLab Runner** written in Go, allowing developers to execute builds in lightweight containerized environments.
			- Promoted the use of **`.gitlab-ci.yml`** placed in the root directory to define pipeline pipelines-as-code.
			- Native support for Container Registries, Auto DevOps, and Kubernetes clusters.
	-
	- **Who**:
		- Created by **Dmitriy Zaporozhets**, **Kamil Trzciński**, and the **GitLab Inc.** team.
	-
	- **Why**:
		- Designed to provide a single, unified application interface for the entire software development lifecycle (devops toolchain), eliminating the coordination friction of using separate VCS (like GitHub) and CI servers (like Jenkins).
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Single Interface Integration** — Code hosting, merge request reviews, issue tracking, CI pipelines, container registries, and deployments are housed in the same UI.
		- **Lightweight Runner Executables** — The Go-based GitLab Runner is simple to install on VMs, Raspberry Pis, or Kubernetes nodes.
		- **First-Class Container Support** — Built-in support to run jobs inside custom Docker images, compile containers, and push them to the integrated registry.
		- **Directed Acyclic Graph (DAG)** — Jobs can bypass standard stage sequencing using the `needs` tag, allowing fast-running steps to execute immediately.
		- **SaaS or Self-Hosted** — Run pipelines using free SaaS runtime hours or connect private runners to handle heavy compute tasks for free.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Monolithic UI Loading** — The single interface can become sluggish when navigating large configurations, pipelines, and logs.
		- **Proprietary YAML Extensions** — GitLab-specific syntax keywords (like `rules`, `extends`, `trigger`) are unique to the platform and non-portable.
		- **Configuration Bloat** — Large enterprise projects frequently end up with thousand-line `.gitlab-ci.yml` files that are hard to debug locally.
	-
	- ## Remember Points
	  collapsed:: true
		- **Default Stage Sequencing** — Jobs in the same `stage` run in parallel. The next stage only starts if all jobs in the current stage succeed.
		- **Pre-execution Container Checks** — Every job in GitLab CI runs in its own shell or isolated container. Any state changes (like temporary files) are lost between jobs unless declared as cache or artifacts.
-
- # Runners & Executors
	- ## Execution Environments
	  collapsed:: true
		- **GitLab Runner** is the agent application that executes pipeline jobs.
		- **Executors** define the technical environment where the script is executed:
			- **Shell Executor**: Runs scripts directly on the host machine shell (bash/powershell). Fast but lacks isolation; build tools must be installed on the host.
			- **Docker Executor**: Downloads specified container images and executes scripts in isolated containers. Clean state for every job run.
			- **Kubernetes Executor**: Spins up dynamic pods in a Kubernetes cluster for each job, scaling automatically based on pipeline loads.
-
- # YAML Pipeline Architecture
	- ## .gitlab-ci.yml Basic Structure
	  collapsed:: true
		- ```yaml
		  # Define pipeline execution phases in order
		  stages:
		    - prepare
		    - build
		    - test
		    - deploy
		    
		  # Global configuration parameters
		  default:
		    image: node:18-alpine
		    before_script:
		      - echo "Starting job execution steps..."
		      
		  # Define environment variables
		  variables:
		    GLOBAL_VAR: "SharedConfigValue"
		    
		  # Job 1: Build Application
		  build_job:
		    stage: build
		    script:
		      - npm install
		      - npm run build
		    artifacts:
		      paths:
		        - dist/
		      expire_in: 1 week
		      
		  # Job 2: Run Unit Tests
		  test_job:
		    stage: test
		    script:
		      - npm install
		      - npm run test:unit
		    variables:
		      LOCAL_VAR: "JobSpecificOverride"
		  ```
-
- # Directed Acyclic Graph & Rules
	- ## DAG (needs) and Conditional Execution (rules)
	  collapsed:: true
		- ```yaml
		  stages:
		    - build
		    - test
		    - deploy
		    
		  build_backend:
		    stage: build
		    script:
		      - echo "Building backend app..."
		      
		  build_frontend:
		    stage: build
		    script:
		      - echo "Building frontend app..."
		      
		  # 'needs' bypasses the build stage boundary: test_frontend runs immediately
		  # as soon as build_frontend completes, without waiting for build_backend.
		  test_frontend:
		    stage: test
		    script:
		      - echo "Testing frontend..."
		    needs:
		      - build_frontend
		      
		  # 'rules' evaluates conditions dynamically (replacing legacy only/except tags)
		  deploy_staging:
		    stage: deploy
		    script:
		      - echo "Deploying to staging environment..."
		    rules:
		      # Execute only if push is on the main branch
		      - if: '$CI_COMMIT_BRANCH == "main"'
		        when: on_success
		      # Allow manual trigger on staging branches
		      - if: '$CI_COMMIT_BRANCH =~ /^stage-/'
		        when: manual
		      # Do not execute in other scenarios
		      - when: never
		  ```
-
- # Cache vs. Artifacts
	- ## Context Sharing Management
	  collapsed:: true
		- **Cache**: Designed to speed up builds by reusing dependencies (like npm modules or composer libraries). Not guaranteed to be present and should not contain build results.
		- **Artifacts**: Designed to store outputs (like bin files or zip bundles) that are passed to downstream jobs or made available for download in the UI.
		- ```yaml
		  stages:
		    - build
		    - test
		    
		  job_with_both:
		    stage: build
		    script:
		      - npm install
		      - npm run compile
		    # Cache npm modules folder across pipeline runs (uses branch key)
		    cache:
		      key: ${CI_COMMIT_REF_SLUG}
		      paths:
		        - node_modules/
		    # Save compile output directories for testing jobs
		    artifacts:
		      name: "build-output-${CI_COMMIT_SHA}"
		      paths:
		        - build/
		      expire_in: 2 days
		  ```
-
- # Reusable Templates & Child Pipelines
	- ## DRY Patterns and Includes
	  collapsed:: true
		- Avoid code duplication using YAML anchors `&`, job extensions `extends`, and files configuration inclusion.
		- ```yaml
		  # 1. Base template structure
		  .test_template:
		    stage: test
		    image: python:3.9
		    before_script:
		      - pip install -r requirements.txt
		    rules:
		      - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
		      
		  # 2. Extend base template in concrete jobs
		  unit_tests:
		    extends: .test_template
		    script:
		      - pytest tests/unit/
		      
		  integration_tests:
		    extends: .test_template
		    script:
		      - pytest tests/integration/
		      
		  # 3. Include external templates (from other repos or default templates)
		  include:
		    - template: Security/SAST.gitlab-ci.yml # Built-in Static Application Security Testing
		    - project: 'my-org/shared-ci-templates'
		      file: '/templates/docker-build.yml'
		      
		  # 4. Triggering a Child Pipeline (runs a sub-pipeline yaml)
		  trigger_frontend_pipeline:
		    stage: build
		    trigger:
		      include: frontend/.gitlab-ci.yml
		      strategy: depend # Parent pipeline succeeds only if child succeeds
		  ```
-
- # Deployments & Environments
	- ## Multi-Stage Gates and Rollbacks
	  collapsed:: true
		- Manage production endpoints, deployments tracking, and automatic manual rollback options in the GitLab UI:
		- ```yaml
		  deploy_production:
		    stage: deploy
		    script:
		      - echo "Deploying build artifacts to production servers..."
		      - ./deploy.sh
		    environment:
		      name: production
		      url: https://my-app.company.com
		      on_stop: stop_production_environment # Specify teardown script job
		    rules:
		      - if: '$CI_COMMIT_BRANCH == "main"'
		        when: manual # Requires explicit user approval click in GitLab dashboard
		        
		  stop_production_environment:
		    stage: deploy
		    script:
		      - echo "Tearing down production resources..."
		    environment:
		      name: production
		      action: stop
		    rules:
		      - if: '$CI_COMMIT_BRANCH == "main"'
		        when: manual
		  ```
-
- # More Learn
	- Explore valuable resources for GitLab CI/CD:
		-
		- [GitLab CI/CD Official Documentation](https://docs.gitlab.com/ee/ci/)
		- [GitLab CI/CD Keyword Reference Index](https://docs.gitlab.com/ee/ci/yaml/)
		- [GitLab Runner Configuration Options](https://docs.gitlab.com/runner/)
		- [GitLab CI Shared Templates Gallery](https://gitlab.com/gitlab-org/gitlab/-/tree/master/lib/gitlab/ci/templates)
