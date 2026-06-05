---
seoTitle: Jenkins Reference – Pipelines, DSL, and Administration Guide
description: "Comprehensive Jenkins reference covering Declarative vs Scripted pipelines, Jenkinsfile syntax, plugins, agent nodes, distributed builds, security, and administration."
keywords: "Jenkins, Jenkinsfile, CI/CD, Devops, declarative pipeline, scripted pipeline, shared libraries, Jenkins agents, build automation, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Jenkins
treeTitle: DevOps - Jenkins
---

- # History
	- **How**:
		- **Jenkins** started as the **Hudson** project, created by **Kohsuke Kawaguchi** in **2004** while working at Sun Microsystems.
		- Kohsuke wanted a way to know if his code would break the build before committing it.
		- After Oracle acquired Sun Microsystems in 2010, disputes arose over Hudson's governance and infrastructure control.
		- In **2011**, the community and developers voted overwhelmingly to rename the project to **Jenkins** and move the codebase to GitHub, while Oracle briefly continued to maintain Hudson.
		- With the release of **Jenkins 2.0** in **2016**, "Pipeline-as-Code" became the default standard, replacing manual UI jobs with version-controlled `Jenkinsfile` configurations.
	-
	- **Who**:
		- Created by **Kohsuke Kawaguchi** and maintained by the Jenkins project community under the CD Foundation (Continuous Delivery Foundation).
	-
	- **Why**:
		- Created as a highly extensible automation server to automate compile, test, and deployment operations, serving as the central engine for Continuous Integration (CI) and Continuous Delivery (CD).
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Huge Plugin Ecosystem** — Over 1,800 plugins supporting almost every build tool, version control platform, and cloud provider.
		- **Self-Hosted Control** — Full authority over hardware resources, storage configurations, database connections, and secure network firewalls.
		- **Pipeline-as-Code (DSL)** — Groovy-based Domain Specific Languages (DSL) allow version-controlled, complex, and conditional build flows.
		- **Distributed Architecture** — Easy Master-Agent (Controller-Agent) scaling to distribute tasks to virtual machines or container clusters.
		- **No Vendor Lock-In** — Open-source core means no license fees or forced cloud subscription pricing plans.
	-
	- ## Disadvantages
	  collapsed:: true
		- **High Maintenance Overhead** — Security patching, plugin updates, backup storage, and instance server updates must be handled manually by DevOps teams.
		- **Configuration Hell** — Plugin conflicts and mismatched API dependencies frequently break build servers ("plugin fatigue").
		- **Heavy Resource Footprint** — The Java Virtual Machine (JVM) backend consumes significant RAM even during idle hours.
		- **Steep Learning Curve** — Setting up secure agents, custom SSL certificates, and writing complex Groovy shared libraries requires advanced expertise.
	-
	- ## Remember Points
	  collapsed:: true
		- **Workspace Persistence** — Workspace files remain on the executor node after a run. Ensure cleanup steps run to avoid filling disk space.
		- **Plugin Security** — Jenkins plugins are notorious targets for security vulnerabilities. Keep them patched and limit access strictly.
		- **Script Security sandbox** — Scripted pipelines or dynamic Groovy scripts must be approved by administrators to execute outside sandbox limits.
-
- # Controller-Agent Architecture
	- ## Distributed Execution Model
	  collapsed:: true
		- Jenkins splits work between a coordinating node and worker machines:
		- **Jenkins Controller (formerly Master)**:
			- Serves the user interface and configuration dashboard.
			- Handles job scheduling, coordinates build tasks, monitors resource health, and stores configurations.
		- **Jenkins Agents (formerly Slaves)**:
			- Small Java client applications (`agent.jar`) executing commands sent by the controller.
			- Can run on bare metal, VMs, or spin up dynamically inside Docker/Kubernetes container pods.
			- Connected via SSH (Controller-to-Agent) or JNLP protocols (Agent-to-Controller).
-
- # Declarative Pipeline Syntax
	- ## Core Syntax Architecture
	  collapsed:: true
		- Declarative pipelines offer a strict, structured layout that is easier to write and read than Scripted Groovy pipelines.
		- ```groovy
		  // Jenkinsfile (Declarative)
		  pipeline {
		      agent any // Run on any available agent node
		      
		      options {
		          timeout(time: 1, unit: 'HOURS') // Cancel if execution hangs
		          timestamps() // Print console line execution timestamps
		          disableConcurrentBuilds() // Prevent concurrent runs of same job
		      }
		      
		      environment {
		          APP_ENV = 'production'
		          DB_SECRET = credentials('db-password-credential-id') // Safe credential binding
		      }
		      
		      parameters {
		          string(name: 'DEPLOY_BRANCH', defaultValue: 'main', description: 'Target branch')
		          booleanParam(name: 'RUN_TESTS', defaultValue: true, description: 'Verify test suite')
		      }
		      
		      stages {
		          stage('Preparation') {
		              steps {
		                  echo "Checking out code from branch: ${params.DEPLOY_BRANCH}"
		                  checkout scm
		              }
		          }
		          
		          stage('Build & Test') {
		              when {
		                  expression { return params.RUN_TESTS }
		              }
		              steps {
		                  echo "Building in Environment: ${env.APP_ENV}"
		                  // Execution commands inside shell execution blocks
		                  sh 'npm install'
		                  sh 'npm test'
		              }
		          }
		          
		          stage('Parallel Deploy') {
		              parallel {
		                  stage('Deploy Asia') {
		                      steps {
		                          sh 'echo "Deploying to Asia clusters..."'
		                      }
		                  }
		                  stage('Deploy Europe') {
		                      steps {
		                          sh 'echo "Deploying to Europe clusters..."'
		                      }
		                  }
		              }
		          }
		      }
		      
		      post {
		          always {
		              echo "Cleaning up workspace workspace files..."
		              cleanWs()
		          }
		          success {
		              echo "Pipeline completed successfully!"
		          }
		          failure {
		              // Execute Slack/Email notification helper actions
		              echo "Pipeline failed! Sending notification alerts..."
		          }
		      }
		  }
		  ```
-
- # Scripted Pipeline Syntax
	- ## Imperative Groovy Code Execution
	  collapsed:: true
		- Scripted pipelines execute as pure Groovy scripts. They offer high flexibility but require manual exception handling and lack built-in structural safety validation checks.
		- ```groovy
		  // Jenkinsfile (Scripted)
		  node('linux-agent') { // Allocates an executor on nodes matching label 'linux-agent'
		      try {
		          stage('Checkout') {
		              checkout scm
		          }
		          
		          stage('Conditional Build') {
		              def files = sh(script: 'ls -la', returnStdout: true).trim()
		              echo "Workspace listing:\n${files}"
		              
		              if (files.contains('package.json')) {
		                  sh 'npm install'
		                  sh 'npm run build'
		              } else {
		                  error "Missing package.json in workspace repository."
		              }
		          }
		      } catch (err) {
		          currentBuild.result = 'FAILURE'
		          echo "Execution failed with error: ${err.message}"
		          throw err
		      } finally {
		          stage('Cleanup') {
		              cleanWs()
		          }
		      }
		  }
		  ```
-
- # Docker integration in Pipelines
	- ## Containerized Builds
	  collapsed:: true
		- Execute stages inside isolated Docker containers without installing tools directly on the host agent hardware.
		- ```groovy
		  pipeline {
		      agent {
		          docker {
		              image 'node:18-alpine'
		              args '-v /tmp:/data --entrypoint=' // Map volumes and override entries
		          }
		      }
		      
		      stages {
		          stage('Verify Environment') {
		              steps {
		                  // Executes inside the node:18-alpine container environment
		                  sh 'node --version'
		                  sh 'npm --version'
		              }
		          }
		      }
		  }
		  ```
-
- # Jenkins Shared Libraries
	- ## Reusable Groovy Helper modules
	  collapsed:: true
		- Shared Libraries allow standardizing build steps across hundreds of different repositories to eliminate code duplication.
		- **Directory Structure**:
		- ```text
		  shared-library-repo/
		  ├── src/                     # Standard Object-Oriented Groovy classes
		  │   └── org/company/Helper.groovy
		  ├── vars/                    # Global custom steps (accessible as functions)
		  │   ├── buildApp.groovy
		  │   └── notifySlack.groovy
		  └── resources/               # Static assets (JSON templates, SQL templates)
		  ```
		- **vars/buildApp.groovy** (Custom Step Definition):
		- ```groovy
		  // vars/buildApp.groovy
		  def call(Map config = [:]) {
		      def appName = config.name ?: 'Unlabeled App'
		      
		      echo "Running shared custom build steps for ${appName}"
		      sh "npm install"
		      sh "npm run build"
		  }
		  ```
		- **Using the library in a Jenkinsfile**:
		- ```groovy
		  @Library('my-shared-library') _ // Import library (must be configured in Jenkins settings)
		  
		  pipeline {
		      agent any
		      stages {
		          stage('Build') {
		              steps {
		                  // Call vars script custom step directly like a native function
		                  buildApp(name: 'Customer Service API')
		              }
		          }
		      }
		  }
		  ```
-
- # Administration & SCM Triggers
	- ## Automated Job Triggers
	  collapsed:: true
		- Build scheduling can be triggered via webhook APIs or cron expressions inside the pipeline block:
		- ```groovy
		  pipeline {
		      agent any
		      
		      triggers {
		          // Trigger build every 3 hours on weekdays
		          cron('0 */3 * * 1-5')
		          
		          // Poll SCM source control for changes every 15 minutes
		          pollSCM('*/15 * * * *')
		          
		          // Triggers build automatically when dependencies complete
		          upstream(upstreamProjects: 'parent-job-name', threshold: hudson.model.Result.SUCCESS)
		      }
		      
		      stages {
		          stage('Execute') {
		              steps {
		                  echo "Running automated schedule build"
		              }
		          }
		      }
		  }
		  ```
-
- # More Learn
	- Explore valuable resources for Jenkins CI/CD:
		-
		- [Jenkins Official Documentation](https://www.jenkins.io/doc/)
		- [Jenkins Pipeline Syntax Reference](https://www.jenkins.io/doc/book/pipeline/syntax/)
		- [Jenkins Shared Libraries Guide](https://www.jenkins.io/doc/book/pipeline/shared-libraries/)
		- [CD Foundation (Jenkins Parent Ecosystem)](https://cd.foundation/)