---
seoTitle: Azure DevOps Pipelines Reference – YAML, Agents, and Release Guide
description: "Educational Azure DevOps Pipelines reference covering YAML syntax, agents, multi-stage deployments, variables, task groups, environments, and approvals."
keywords: "Azure DevOps, Azure Pipelines, YAML pipeline, CI/CD, DevOps, azure-pipelines.yml, self-hosted agents, service connections, environments, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Azure DevOps
---

- # History
	- **How**:
		- **Azure DevOps** evolved from Microsoft's long-standing enterprise collaboration products.
		- Originally launched as **Team Foundation Server (TFS)** in **2005** as an on-premises application lifecycle management platform.
		- In **2012**, Microsoft introduced a cloud-hosted version known as **Visual Studio Online**, later renamed **Visual Studio Team Services (VSTS)** in **2015**.
		- In **2018**, Microsoft rebranded VSTS as **Azure DevOps**, breaking the monolithic service into five modular components: Boards, Repos, Pipelines, Test Plans, and Artifacts.
		- The pipeline engine underwent a major shift, moving from legacy visual drag-and-drop web designers to version-controlled **YAML pipelines**.
	-
	- **Who**:
		- Developed, hosted, and maintained commercially by **Microsoft Corporation**.
	-
	- **Why**:
		- Created to provide enterprises with a secure, highly scalable, and unified DevOps platform that integrates natively with the Microsoft Azure cloud ecosystem, Active Directory, and modern Git repos.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Deep Azure Cloud Integration** — Seamless authentication with Azure resources using Service Connections (Service Principals) without storing credentials in source code.
		- **Enterprise Security & Compliance** — Integrates with Azure Active Directory (Microsoft Entra ID) to enforce strict Role-Based Access Control (RBAC).
		- **Hybrid Agent Execution** — Run tasks on Microsoft-hosted cloud agents or register private self-hosted virtual machines inside closed enterprise networks.
		- **Rich Visual Deployments** — Environments offer tracking dashboards, deployment histories, and manual gates directly in the UI.
		- **Task Marketplace** — Access thousands of pre-configured build steps provided by Microsoft and third parties.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Platform Complexity** — Setting up security policies, service connections, agent pools, and permission inheritance can be overwhelming for smaller teams.
		- **YAML Verbosity** — The YAML schema requires verbose definitions for stages, jobs, and steps, which can lead to layout errors.
		- **Microsoft-Centric Ecosystem** — While it supports cross-platform builds, the tooling is optimized for and deeply integrated with Windows, .NET, and Azure environments.
	-
	- ## Learning Guidelines
	  collapsed:: true
		- **Architecture Hierarchy** — Always remember the flow: **Pipeline** -> **Stages** (logical major phases) -> **Jobs** (executed on a single agent node) -> **Steps** (individual tasks/scripts).
		- **Environment Scopes** — Always configure production-level pipelines to deploy to named "Environments" to enforce manual approvals and compliance logging.
-
- # Structural Pipeline Design
	- ## Concept Overview
	  collapsed:: true
		- Understanding how the pipeline is designed:
		- ```text
		  [ Pipeline: azure-pipelines.yml ]
		          │
		          ├── Stage 1: Build (Runs on Agent Pool A)
		          │      └── Job 1: Compile & Test
		          │             ├── Step 1.1: NodeTool install
		          │             └── Step 1.2: npm run test
		          │
		          └── Stage 2: Deploy (Runs on Agent Pool B)
		                 └── Job 2: Release to Staging
		                        ├── Step 2.1: Download Artifacts
		                        └── Step 2.2: Azure Web App Deploy
		  ```
		- **Stages**: Divide your pipeline into major phases (e.g., Build, Test, Deploy). Stages run sequentially by default, but can run in parallel if specified.
		- **Jobs**: Units of work assigned to a single runner machine in the pool. Jobs run in parallel within a stage unless dependencies are declared.
		- **Steps/Tasks**: Chronological operations run inside the job's workspace (e.g., executing a bash script, copying files).
-
- # YAML Pipeline Configuration
	- ## annotated azure-pipelines.yml
	  collapsed:: true
		- Below is a complete, production-ready pipeline template explaining syntax hooks:
		- ```yaml
		  # Trigger builds on main branch and specific path edits
		  trigger:
		    branches:
		      include:
		        - main
		    paths:
		      exclude:
		        - README.md
		  
		  # Define the agent execution pool (Microsoft-hosted Ubuntu runner)
		  pool:
		    vmImage: 'ubuntu-latest'
		  
		  # Configure variables globally
		  variables:
		    buildConfiguration: 'Release'
		    webAppName: 'my-production-webapp'
		  
		  stages:
		  - stage: Build
		    displayName: 'Build and Package Stage'
		    jobs:
		    - job: BuildJob
		      displayName: 'Compile Application Code'
		      steps:
		      # Task 1: Initialize runtime version
		      - task: NodeTool@0
		        inputs:
		          versionSource: 'spec'
		          versionSpec: '18.x'
		        displayName: 'Install Node.js'
		  
		      # Task 2: Run build scripts using shell tasks
		      - script: |
		          npm install
		          npm run build
		        displayName: 'Install dependencies and build project'
		  
		      # Task 3: Package build output files for deployment stage
		      - task: CopyFiles@2
		        inputs:
		          SourceFolder: '$(System.DefaultWorkingDirectory)/dist'
		          Contents: '**'
		          TargetFolder: '$(Build.ArtifactStagingDirectory)'
		        displayName: 'Copy compiled static files'
		  
		      # Task 4: Publish artifact to container registry storage
		      - task: PublishBuildArtifacts@1
		        inputs:
		          PathtoPublish: '$(Build.ArtifactStagingDirectory)'
		          ArtifactName: 'drop'
		          publishLocation: 'Container'
		        displayName: 'Publish Build Artifacts'
		  
		  - stage: Deploy
		    displayName: 'Deploy Stage'
		    dependsOn: Build # Run only if Build stage succeeds
		    condition: succeeded()
		    jobs:
		    # A deployment job targets named Environments to enforce manual gates
		    - deployment: DeployWebApp
		      displayName: 'Deploy Web App to Azure'
		      environment: 'production'
		      strategy:
		        runOnce:
		          deploy:
		            steps:
		            # Automatically downloads the 'drop' artifact
		            - task: DownloadBuildArtifacts@0
		              inputs:
		                buildType: 'current'
		                downloadType: 'single'
		                artifactName: 'drop'
		                downloadPath: '$(System.ArtifactsDirectory)'
		              displayName: 'Download drop folder'
		  
		            # Task: Deploy code to Azure Web App Service
		            - task: AzureWebApp@1
		              inputs:
		                azureSubscription: 'Azure-Service-Connection-Name'
		                appType: 'webAppLinux'
		                appName: '$(webAppName)'
		                package: '$(System.ArtifactsDirectory)/drop'
		              displayName: 'Deploy to Azure App Service'
		  ```
-
- # Variables, Parameters, & Key Vaults
	- ## Safe Configurations
	  collapsed:: true
		- Azure DevOps supports variables (can be overridden at runtime), parameters (strictly type-checked at compile-time), and variable groups:
		- **Runtime Parameters** (preventing user input errors):
		- ```yaml
		  parameters:
		  - name: environmentName
		    type: string
		    default: staging
		    values:
		      - staging
		      - production
		  - name: runIntegrationTests
		    type: boolean
		    default: false
		  
		  trigger: none # Disable automatic branch triggers
		  
		  pool:
		    vmImage: 'ubuntu-latest'
		  
		  jobs:
		  - job: Execute
		    steps:
		    - script: echo "Target Environment is ${{ parameters.environmentName }}"
		    - ${{ if eq(parameters.runIntegrationTests, true) }}:
		      - script: npm run test:integration
		        displayName: 'Executing Integration Suite'
		  ```
		- **Connecting Azure Key Vault**:
			- 1. Create a **Variable Group** in Azure DevOps Library.
			- 2. Toggle "Link secrets from an Azure key vault as variables".
			- 3. Select your Service Connection and Vault name.
			- 4. Import Key Vault variables in YAML:
			- ```yaml
			  variables:
			    # Import variables defined in group 'keyvault-secrets'
			    - group: keyvault-secrets
			  
			  steps:
			  # Secrets from group are accessible as variables; they are masked in logs automatically
			  - script: echo "Database password is $(db-secret-password)" 
			  ```
-
- # Reusable Templates (DRY)
	- ## Code Refactoring Configurations
	  collapsed:: true
		- Keep pipeline files clean by splitting long steps into standalone template files.
		- **templates/build-steps.yml** (Reusable Step Template):
		- ```yaml
		  # templates/build-steps.yml
		  parameters:
		    - name: nodeVersion
		      type: string
		      default: '18.x'
		  
		  steps:
		  - task: NodeTool@0
		    inputs:
		      versionSpec: ${{ parameters.nodeVersion }}
		  - script: npm ci
		  - script: npm run build
		  ```
		- **azure-pipelines.yml** (Main Pipeline referencing template):
		- ```yaml
		  trigger:
		    - main
		  
		  jobs:
		  - job: BuildAndCompile
		    pool:
		      vmImage: 'ubuntu-latest'
		    steps:
		    # Reference step template file and pass parameters
		    - template: templates/build-steps.yml
		      parameters:
		        nodeVersion: '20.x'
		  ```
-
- # Teaching Note: Key Concepts & Gotchas
	- ## Variable Syntaxes
	  collapsed:: true
		- Developers frequently mix up the three variable formats:
			- **`${{ variables.myVar }}` (Template Expression)**: Evaluated at compile-time before the pipeline starts running. Perfect for conditional block inclusion (`${{ if eq(parameters.env, 'prod') }}`).
			- **`$(myVar)` (Macro Syntax)**: Evaluated at job runtime. Standard format for step arguments and input fields. Cannot be used inside conditional YAML expressions.
			- **`$[variables.myVar]` (Runtime Expression)**: Evaluated at runtime dynamically (e.g. processing outputs from preceding jobs).
	-
	- ## Workspace Isolation
	  collapsed:: true
		- If using self-hosted agents, files from previous builds persist in `$(Build.SourcesDirectory)` unless cleared. Always add a checkout clean task:
		- ```yaml
		  steps:
		  - checkout: self
		    clean: true # Deletes untracked files before checkout
		  ```
	-
	- ## Log Masking Limitations
	  collapsed:: true
		- While Azure DevOps masks variable secrets matching Key Vault targets with `***`, writing secrets to files or outputting them via base64 encoding can bypass filters. Never echo raw secrets in build logs.
-
- # More Learn
	- Explore valuable resources for Azure DevOps:
		-
		- [Azure Pipelines Documentation](https://learn.microsoft.com/en-us/azure/devops/pipelines/)
		- [YAML Schema Reference Guide](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema/)
		- [Azure DevOps Library & Key Vault Settings](https://learn.microsoft.com/en-us/azure/devops/pipelines/library/variable-groups)
		- [Azure DevOps Marketplace](https://marketplace.visualstudio.com/azuredevops)
