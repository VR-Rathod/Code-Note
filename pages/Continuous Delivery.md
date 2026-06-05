---
seoTitle: Continuous Delivery (CD) – Pipelines, Strategies & Deployment Patterns
description: "Comprehensive guide to Continuous Delivery (CD) covering CD vs Continuous Deployment, progressive deployment models (canary, blue-green), GitOps, rollback strategies, and pipeline configuration."
keywords: "continuous delivery, CD, deployment strategies, canary deployment, blue-green deployment, GitOps, ArgoCD, Terraform, Ansible, rollbacks, pipeline configuration, DevOps"
displayTitle: Continuous Delivery
enableToc: true
treeTitle: DevOps - Continuous Delivery
---

- # Introduction to Continuous Delivery (CD)
	- **Continuous Delivery (CD)** is a software engineering approach in which teams produce software in short cycles, ensuring that the software can be reliably released at any time.
	- It extends Continuous Integration (CI) by automatically deploying all code changes to a testing, staging, or production environment after the build stage.
	-
	- ## Continuous Delivery vs. Continuous Deployment
		- ```
		  [ Continuous Integration (CI) ]
		  Code -> Build -> Test
		           ↓
		  [ Continuous Delivery (CD) ]
		  Staging Deploy -> Manual Approval Gate -> Production Deploy (Reliable & Repeatable)
		           ↓
		  [ Continuous Deployment ]
		  Staging Deploy -> Automated Verification -> Production Deploy (Fully Automated)
		  ```
		- | Concept | Action Gate | Risk Level | Target |
		  |---------|-------------|------------|--------|
		  | **Continuous Delivery** | Manual trigger to deploy to production | Medium | Enterprise systems, regulated industries |
		  | **Continuous Deployment** | Automated trigger based on testing pass | High | High-velocity SaaS, startup systems |
- # Progressive Deployment Strategies
	- Standardizing how code is deployed in production minimizes downtime and limits blast radius in case of failures.
	-
	- ## 1. Rolling Update (Incremental)
		- Replaces instances of the old version with the new version gradually. E.g., updating 1 of 5 servers at a time.
		- **Pros**: Zero downtime, easy to set up.
		- **Cons**: High duration; for a period, both versions run concurrently, requiring backwards-compatible APIs.
	- ## 2. Blue-Green Deployment (Red-Black)
		- Two identical production environments exist: "Blue" (active) and "Green" (idle). The new version is deployed to Green, tested, and traffic router switches to Green.
		- **Pros**: Instant swap, zero downtime, instant rollbacks (switch router back to Blue).
		- **Cons**: Doubles infrastructure costs, data sync challenges between databases during switch.
	- ## 3. Canary Deployment
		- Deploys the new version to a tiny subset of production servers (e.g., 2% of traffic). If no errors occur, traffic is gradually increased.
		- **Pros**: Minimal blast radius, tests code with real production traffic.
		- **Cons**: Complex routing setup, slow rollout times.
- # GitOps & Infrastructure as Code (IaC)
	- CD for modern cloud systems leverages IaC and GitOps to maintain consistent state.
	-
	- ## Infrastructure as Code (IaC)
		- Managing and provisioning infrastructure through machine-readable definition files (e.g., **Terraform**, **Ansible**, **CloudFormation**) rather than manual configuration.
		- Ensures that staging and production environments are identical replicas, eliminating environment drift.
	- ## GitOps (Git as Source of Truth)
		- A paradigm for Kubernetes and cloud-native applications where Git repositories hold declarative descriptions of infrastructure.
		- **Pull-based CD** (e.g., **ArgoCD**, **Flux**): Agents inside the cluster constantly compare the Git repo state with the running cluster state. If they differ, the agent pulls changes and updates the cluster to match Git (Self-healing).
- # CD Configuration Examples
	- ## GitHub Actions Deployment Pipeline
		- ```yaml title=".github/workflows/cd.yml"
		  name: Continuous Delivery
		  
		  on:
		    workflow_run:
		      workflows: ["Continuous Integration"]
		      types: [completed]
		      branches: [main]
		  
		  jobs:
		    deploy-staging:
		      if: ${{ github.event.workflow_run.conclusion == 'success' }}
		      runs-on: ubuntu-latest
		      steps:
		      - name: Deploy to Staging Environment
		        run: |
		          echo "Deploying build artifact to staging server..."
		          # Command to push image or copy files:
		          # ssh deploy@staging-server "docker-compose pull && docker-compose up -d"
		          
		    deploy-production:
		      needs: deploy-staging
		      runs-on: ubuntu-latest
		      environment:
		        name: production
		        url: https://myapp.com
		      steps:
		      - name: Deploy to Production (Manual Approval Gate Required)
		        run: |
		          echo "Deploying verified build to production cluster..."
		          # E.g., updating helm chart or trigger webhook:
		          # helm upgrade --install my-app ./charts/my-app
		  ```
	-
	- ## ArgoCD GitOps Application Setup
		- ```yaml title="argocd/application.yml"
		  apiVersion: argoproj.io/v1alpha1
		  kind: Application
		  metadata:
		    name: production-app
		    namespace: argocd
		  spec:
		    project: default
		    source:
		      repoURL: 'https://github.com/my-org/my-infra-repo.git'
		      targetRevision: HEAD
		      path: k8s/production
		    destination:
		      server: 'https://kubernetes.default.svc'
		      namespace: default
		    syncPolicy:
		      automated:
		        prune: true
		        selfHeal: true
		  ```
- # Rollback Strategies
	- When a deployment fails, recovery speed is critical.
	-
	- ## 1. Redeploy (Forward Rollback)
		- Fix the bug on a developer machine, push to main, build, and deploy.
		- **Use Case**: Non-critical bug, simple fix.
	- ## 2. Rollback to Prior Version
		- Redeploy the previous verified build artifact immediately.
		- **Use Case**: Critical bug, high-risk failure.
	- ## 3. Traffic Route Reversal
		- For Blue-Green or Canary, immediately switch traffic router/DNS back to the old version.
		- **Use Case**: Fast recovery, requires no new container build.
- # Related Notes
	- [[Continuous Integration]] — CI pipelines, linting, and automated testing
	- [[DevOps]] — Overall cloud platforms, IaC tools, and logging
	- [[Kubernetes]] — Native container orchestration, pods, and deployments
	- [[System Design]] — Designing high-availability and fault-tolerant architectures