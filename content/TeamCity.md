---
seoTitle: TeamCity Reference – Configuration, Build Chains, and Kotlin DSL Guide
description: "In-depth TeamCity developer reference covering build configurations, VCS roots, build chains (DAG dependencies), agent scaling, and Kotlin DSL pipelines-as-code."
keywords: "TeamCity, JetBrains, Kotlin DSL, build chains, VCS root, build configuration, CI/CD, DevOps, build agent, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: TeamCity
---

- # History
	- **How**:
		- **TeamCity** was launched by **JetBrains** in **2006** as a commercial build management and continuous integration server.
		- Originally developed as a Java web application, it gained popularity for its deep integration with IDEs (like IntelliJ IDEA) and rich visual pipeline status dashboards.
		- Key milestones:
			- **First-Class Java/.NET Support**: Excelled at handling enterprise compilers and testing frameworks early on.
			- **Build Chains (DAGs)**: Introduced visual, robust build pipeline dependency trees before many other tools.
			- **Configuration-as-Code (Kotlin DSL)**: Introduced in **TeamCity 2018**, allowing teams to define pipeline configurations using JetBrains' own language, **Kotlin**, rather than XML or YAML.
	-
	- **Who**:
		- Developed, licensed, and maintained commercially by **JetBrains s.r.o.**
	-
	- **Why**:
		- Created to provide professional software development teams with an intelligent, out-of-the-box CI/CD server that analyzes test histories, detects flaky builds, manages agent pools, and offers unified configurations.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Kotlin DSL** — Define pipelines using a fully compiled, statically typed language. Catch syntax errors in your IDE before pushing configuration changes to git.
		- **Advanced Test Analytics** — Automatically detects flaky tests, tracks execution speed histories, runs test suites in parallel, and assigns failures to specific developers.
		- **VCS Root Sharing** — Define a Version Control System root once and reuse it across hundreds of independent build configurations.
		- **Snapshot Dependencies** — Locks the exact git commit hash across all connected pipeline stages, ensuring build consistency across multi-stage jobs.
		- **Pre-tested Commits (Remote Run)** — Run builds on agents directly from your IDE before committing changes to the remote repository.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Commercial Licensing Costs** — While a free professional version exists (limited to 100 build configurations and 3 agents), enterprise usage scales in cost.
		- **Heavy Resource Footprint** — The Java server backend requires significant RAM and CPU hosting compared to lightweight SaaS integrations.
		- **Steep Learning Curve for Kotlin DSL** — Configuring builds via Kotlin requires familiarity with Kotlin programming paradigms compared to simple YAML files.
	-
	- ## Learning Guidelines
	  collapsed:: true
		- **Build Chains Concept** — Unlike step-by-step scripts, TeamCity splits pipelines into modular **Build Configurations** linked together via Snapshot and Artifact dependencies.
		- **Agent Requirements** — Ensure your configurations specify execution requirements (e.g. `exists.sdk.version = 17`) to prevent builds from failing due to missing agent compilers.
-
- # Build Chains: Snapshot vs. Artifact Dependencies
	- ## Dependency DAG Mechanics
	  collapsed:: true
		- TeamCity builds pipelines using **Build Chains** (Directed Acyclic Graphs). These rely on two dependency models:
			- **Snapshot Dependency**: Forces jobs to compile from the exact same revision of source code. If Job B depends on Job A, they will both build from the exact same git commit hash, even if a new commit is pushed while Job A is running.
			- **Artifact Dependency**: Downloads compiled file outputs from a preceding job.
		- **Dependency Flow**:
		- ```text
		  [ VCS Commit (Hash: abcd123) ]
		                │
		         [ Job A: Build ]  ──(Produces: app.war)──┐
		                │ (Snapshot)                      │ (Artifact)
		                ▼                                 ▼
		         [ Job B: Deploy ] <──────────────────────┘
		         (Deploys app.war, guaranteed Hash: abcd123)
		  ```
-
- # Kotlin DSL Configuration
	- ## configuration-as-code settings.kts
	  collapsed:: true
		- TeamCity configurations are stored in the `.teamcity/settings.kts` file. Below is an educational, production-ready template:
		- ```kotlin
		  import jetbrains.buildServer.configs.kotlin.*
		  import jetbrains.buildServer.configs.kotlin.buildSteps.script
		  import jetbrains.buildServer.configs.kotlin.triggers.vcs
		  
		  // Initialize project definition
		  project {
		      // Register build configurations
		      buildType(CompileAndTest)
		      buildType(DeployToStaging)
		      
		      // Define execution sequence using build chains
		      buildChain {
		          compileAndTest -> deployToStaging
		      }
		  }
		  
		  // 1. First Build Configuration: Compile and Test code
		  object CompileAndTest : BuildType({
		      name = "1. Compile & Test"
		      description = "Compiles code and runs test suites"
		  
		      // Define VCS repository settings
		      vcs {
		          root(DslContext.settingsRoot) // Auto-detects the repository root
		      }
		  
		      steps {
		          // Step 1: Run Shell task
		          script {
		              name = "Install Dependencies"
		              scriptContent = "npm ci"
		          }
		          // Step 2: Run Tests
		          script {
		              name = "Run Unit Tests"
		              scriptContent = "npm run test"
		          }
		      }
		  
		      // Declare output files to make them available for deployment
		      artifactRules = "dist/** => dist.zip"
		  
		      // Trigger configuration: run automatically on git commits
		      triggers {
		          vcs {
		              // Triggers build on any commit to repository
		          }
		      }
		  })
		  
		  // 2. Second Build Configuration: Deploy artifacts
		  object DeployToStaging : BuildType({
		      name = "2. Deploy to Staging"
		      description = "Deploys compiled artifacts to hosting servers"
		  
		      steps {
		          script {
		              name = "Deploy Build"
		              scriptContent = "./deploy.sh dist.zip"
		          }
		      }
		  
		      dependencies {
		          // Establish Snapshot dependency (enforces code consistency)
		          dependency(CompileAndTest) {
		              snapshot {
		                  onDependencyFailure = FailureAction.FAIL_TO_START
		              }
		              // Establish Artifact dependency (downloads output files)
		              artifacts {
		                  cleanRules = true
		                  artifactRules = "dist.zip => ."
		              }
		          }
		      }
		  })
		  ```
-
- # Build Agents & Requirements
	- ## Executor Filtering
	  collapsed:: true
		- TeamCity agents pull builds dynamically. To prevent a build from running on an incompatible agent, define **Agent Requirements**:
		- ```kotlin
		  object CompileAndTest : BuildType({
		      name = "Compile & Test"
		      // ... (VCS and Steps definitions)
		  
		      // Enforce build agent criteria
		      requirements {
		          // Agent must run Linux
		          equals("teamcity.agent.jvm.os.name", "Linux")
		          // Agent must have Node.js 18 installed
		          exists("node.js.18")
		          // Agent must have Docker installed
		          equals("docker.server.version", "20.10.12")
		      }
		  })
		  ```
-
- # Teaching Note: Key Concepts & Gotchas
	- ## Why use Kotlin DSL over YAML?
	  collapsed:: true
		- Standard YAML configurations are simple string dictionaries. Kotlin DSL, however, is a compiled language program.
		- If you make a typo in a YAML tag, the pipeline fails only when triggered on the server.
		- With Kotlin DSL, you can open `.teamcity/` in IntelliJ IDEA, write your scripts, and get auto-completion, refactoring tools, and compile-time validation before committing code.
	-
	- ## Remote Run Feature
	  collapsed:: true
		- One of TeamCity's unique advantages. Developers can install the TeamCity IDE plugin, choose "Remote Run", and select files they are editing locally.
		- TeamCity sends these files to a build agent and runs a test pipeline *without* committing the changes to git.
		- If the build passes, the IDE can automatically commit and push the changes to git.
	-
	- ## Flaky Test Quarantining
	  collapsed:: true
		- TeamCity monitors test histories automatically. If a test passes and fails on the same commit in different builds, it marks the test as **flaky**.
		- Administrators can quarantine flaky tests so they don't block release deployments while developers investigate the root cause.
-
- # More Learn
	- Explore valuable resources for TeamCity:
		-
		- [TeamCity Official Documentation](https://www.jetbrains.com/help/teamcity/)
		- [TeamCity Kotlin DSL Reference Index](https://www.jetbrains.com/help/teamcity/kotlin-dsl.html)
		- [JetBrains Guide: TeamCity with Kotlin DSL](https://www.jetbrains.com/help/teamcity/teamcity-kotlin-dsl-library-reference.html)
		- [TeamCity Cloud Hosting Portal](https://www.jetbrains.com/teamcity/cloud/)
