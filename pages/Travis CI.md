---
seoTitle: Travis CI Reference – YAML Configuration and Multi-Language Build Guide
description: "In-depth Travis CI reference guide covering .travis.yml, multi-language matrices, build lifecycle hooks, caching, environment keys, and deploy triggers."
keywords: "Travis CI, .travis.yml, CI/CD, build lifecycle, matrix builds, deployment, caching, env variables, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Travis CI
treeTitle: DevOps - Travis CI
---

- # History
	- **How**:
		- **Travis CI** was founded in **2011** by **Sven Fuchs**, **Fritz Thielemann**, and **Konstantin Haase** as a hosted CI/CD service for open-source GitHub repositories.
		- In the early 2010s, it became the default continuous integration service for the global open-source community. If a project had a green "build: passing" badge, it was likely built on Travis.
		- Key milestones:
			- Promoted the use of **`.travis.yml`** to describe builds directly in codebase repositories.
			- Developed a robust build matrix system, allowing projects to be tested against dozens of language compiler versions simultaneously.
			- In **2019**, Travis CI was acquired by **Idera Inc.** (parent company of assembly services).
			- In **2020**, Travis CI moved away from its legacy free open-source platform (`travis-ci.org`) to a consolidated commercial billing platform (`travis-ci.com`), limiting free credits for open-source runs.
	-
	- **Who**:
		- Founded by **Sven Fuchs**, **Fritz Thielemann**, and **Konstantin Haase**. Now managed under **Idera, Inc.**
	-
	- **Why**:
		- Created to make automated open-source testing seamless and transparent, allowing developers to ensure pull request stability across various environments without hosting server instances.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Matrix Builds Grid** — Simple declarative configurations to run test grids across multiple languages, OS versions, and compiler versions.
		- **Easy GitHub Integration** — Native GitHub OAuth integration; hooks onto pull requests and commits out of the box.
		- **Declarative Deployment Blocks** — Built-in support to deploy packages straight to cloud hosting services (AWS, Heroku, NPM, GitHub Releases) without custom scripting.
		- **Clean Virtual Machines** — Every build executes in a fresh, isolated virtual machine environment (VM isolation is more secure than container sharing).
	-
	- ## Disadvantages
	  collapsed:: true
		- **Commercial Licensing Shift** — No longer offers unlimited free execution times for public open-source repositories, driving many communities to GitHub Actions.
		- **Slower Boot Times** — Spin-up times for virtual machines can be slower than container-based executors (like GitLab CI or CircleCI).
		- **Opaque Local Execution** — Replicating the exact Travis build environment locally is difficult; debugging errors requires pushing commits to trigger runs.
	-
	- ## Remember Points
	  collapsed:: true
		- **File Location** — Must be named `.travis.yml` and placed at the root level of the git repository.
		- **Build Status Matrix** — By default, the entire pipeline is marked as failed if any single cell in a matrix build fails.
-
- # YAML Configuration Anatomy
	- ## .travis.yml Basic Schema
	  collapsed:: true
		- ```yaml
		  # Specify primary runtime language environment
		  language: node_js
		  node_js:
		    - "18"
		    
		  # Set base operating system
		  os: linux
		  dist: jammy # Ubuntu 22.04 LTS
		  
		  # Global environment variables
		  env:
		    global:
		      - DEPLOY_DIR="/var/www"
		      
		  # Basic execution phases
		  install:
		    - npm install
		    
		  script:
		    - npm run lint
		    - npm run test:unit
		  ```
-
- # Build Lifecycle Hooks
	- ## Stage Lifecycle Order
	  collapsed:: true
		- Travis executing engines run scripts in a strictly sequenced cycle of hook stages:
		- **Lifecycle Sequence**:
		  1. `before_install`: Execute steps before installing dependencies (e.g. system key registrations).
		  2. `install`: Install project dependencies (default commands vary by language).
		  3. `before_script`: Set up databases or start background services.
		  4. `script`: Run primary test suites.
		  5. `after_success` or `after_failure`: Trigger notifications or cleanups based on script results.
		  6. `before_deploy`: Tasks needed before packaging or publishing.
		  7. `deploy`: Push artifacts to hosting providers.
		  8. `after_deploy`: Final post-deployment verification.
		  9. `after_script`: Clean up workspaces and close connections.
		- **Detailed Pipeline Example**:
		- ```yaml
		  language: python
		  python:
		    - "3.9"
		    
		  before_install:
		    - sudo apt-get update
		    - sudo apt-get install -y libpq-dev
		    
		  install:
		    - pip install -r requirements.txt
		    - pip install pytest
		    
		  before_script:
		    - psql -c 'create database test_db;' -U postgres
		    
		  script:
		    - pytest tests/
		    
		  after_failure:
		    - echo "Build failed. Inspecting database logs..."
		    - cat /var/log/postgresql/postgresql-*.log
		  ```
-
- # Build Matrix Configurations
	- ## Multi-Version and Multi-OS Tests
	  collapsed:: true
		- Define parallel execution across variations of languages, OS targets, and customized environments:
		- ```yaml
		  language: go
		  
		  # Grid definition
		  go:
		    - "1.19.x"
		    - "1.20.x"
		  os:
		    - linux
		    - osx
		    
		  # Custom matrix configurations and excludes
		  jobs:
		    include:
		      # Add a specific lint job outside the general go/os grid
		      - stage: lint
		        go: "1.20.x"
		        os: linux
		        script: golangci-lint run
		    exclude:
		      # Exclude macOS tests on legacy go version
		      - go: "1.19.x"
		        os: osx
		        
		  # Global matrix settings
		  matrix:
		    fast_finish: true # Mark build complete as soon as essential cells finish
		    allow_failures:
		      - go: "1.20.x"
		        os: osx # Allow this experimental grid cell to fail without failing the entire build
		  ```
-
- # Cache Management
	- ## Dependency Optimization
	  collapsed:: true
		- Speed up build times by instructing Travis to preserve directories (like compiler libraries or package folders) across executions:
		- ```yaml
		  language: ruby
		  rvm:
		    - 3.1
		    
		  # Cache standard ruby package managers
		  cache:
		    bundler: true
		    directories:
		      - $HOME/.nvm
		      - $HOME/.cargo
		  ```
-
- # Deployment Integrations
	- ## Built-in Deploy Providers
	  collapsed:: true
		- Travis offers out-of-the-box integrations to deploy builds to external providers:
		- ```yaml
		  language: node_js
		  node_js:
		    - "16"
		    
		  script:
		    - npm run build
		    
		  deploy:
		    provider: s3
		    access_key_id: $AWS_ACCESS_KEY_ID # Uses encrypted credentials in settings
		    secret_access_key: $AWS_SECRET_ACCESS_KEY
		    bucket: "my-travis-build-bucket"
		    local_dir: dist
		    skip_cleanup: true # Prevent Travis from deleting dist build files before deploying
		    on:
		      branch: main
		      tags: true # Deploy only if git tag is pushed
		  ```
-
- # More Learn
	- Explore valuable resources for Travis CI:
		-
		- [Travis CI User Documentation](https://docs.travis-ci.com/)
		- [Travis CI Build Lifecycle Guide](https://docs.travis-ci.com/user/job-lifecycle/)
		- [Travis CI Deployment Integration Options](https://docs.travis-ci.com/user/deployment/)
		- [Travis CI Matrix Customization Guides](https://docs.travis-ci.com/user/customizing-the-build/)