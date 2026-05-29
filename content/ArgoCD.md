---
seoTitle: Argo CD Reference – Declarative GitOps, Sync Policies, and Applications Guide
description: "In-depth educational Argo CD reference covering GitOps principles, Application CRD schema, sync policies, reconciliation loops, app-of-apps pattern, and CLI commands."
keywords: "Argo CD, ArgoCD, GitOps, Kubernetes, K8s, GitOps controller, Application CRD, SyncPolicy, App-of-Apps, reconciliation, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Argo CD
---

- # History
	- **How**:
		- **Argo CD** was created in **2018** as an open-source project by **Intuit** to manage declarative Kubernetes deployments.
		- Intuit was migrating its infrastructure to Kubernetes and needed a declarative system to ensure cluster states matched git configurations automatically.
		- Argo CD was accepted into the **CNCF** (Cloud Native Computing Foundation) in **2020** as a sandbox project.
		- In **2022**, it graduated to a top-level CNCF project, cementing its position as the industry-standard pull-based GitOps controller for Kubernetes cluster administration.
	-
	- **Who**:
		- Originally created by **Intuit**, maintained under the **CNCF** along with enterprise contributors.
	-
	- **Why**:
		- Created to solve the reliability problems of push-based deployments (like running `kubectl apply` from Jenkins scripts) by implementing a pull-based controller that continuously synchronizes and reconciles target cluster states with git repositories.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Declarative Single Source of Truth** — Git contains the complete configuration of the desired cluster state. History audits, rollbacks, and recovery are managed through standard Git operations.
		- **Continuous State Reconciliation** — Detects configuration drifts in real-time (when users modify cluster resources manually) and reconciles state automatically.
		- **Multi-Cluster Orchestration** — A single Argo CD instance can manage and deploy configurations to multiple external Kubernetes clusters.
		- **Kubernetes-Native Design** — Deployed as custom resources (CRDs) inside the cluster, integrating with native Kubernetes RBAC, namespaces, and security.
		- **Visual Dashboard UI** — Provides visual dependency maps of active pods, services, and sync logs.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Kubernetes Specific** — Only deploys resources inside Kubernetes. Deploying to bare metal VMs, legacy server instances, or non-containerized cloud services is not supported.
		- **Complex Secret Handling** — Committing credentials to git violates security policies. Developers must integrate external tooling (like Vault or Sealed Secrets) to manage secret variables.
		- **Friction with Dynamic Resources** — Resources that auto-generate values at runtime (e.g., HorizontalPodAutoscaler replicas or cert-manager annotations) can trigger false "OutOfSync" warnings.
	-
	- ## Learning Guidelines
	  collapsed:: true
		- **Desired State vs. Actual State** — Git contains the *Desired State*. The active Kubernetes cluster contains the *Actual State*. Argo CD's job is to run a continuous reconciliation loop to sync the two.
		- **Sync Policy Configs** — Setting `prune: true` ensures that when you delete a manifest file in git, the corresponding resource in the cluster is deleted. Setting `selfHeal: true` overrides manual manual edits made to live resources in the cluster.
-
- # Core GitOps Principles
	- ## The Pull-Based Model
	  collapsed:: true
		- GitOps shifts deployments from push commands to pull orchestration:
		- **Git as Source of Truth**: The entire infrastructure, networking, and application configuration are described declaratively in Git repositories.
		- **Pull-Based Reconciliation**: Instead of external build servers pushing changes using administrative access keys, a controller running *inside* the cluster pulls configurations from Git.
		- **Drift Healing**: If a developer manually modifies a service's ports using `kubectl edit service`, the controller detects the deviation from Git and applies the Git configuration to heal the drift.
-
- # Application Custom Resource Definition (CRD)
	- ## Application YAML Schema
	  collapsed:: true
		- Argo CD configurations are defined using standard Kubernetes YAML files targeting the `Application` CRD.
		- **application.yaml** (Argo CD Application definition):
		- ```yaml
		  # application.yaml
		  apiVersion: argoproj.io/v1alpha1
		  kind: Application
		  metadata:
		    name: guestbook-app
		    namespace: argocd # Must be deployed in namespace where Argo CD runs
		    finalizers:
		      # Deletes all child resources in cluster when application is deleted from Git
		      - resources-finalizer.argocd.argoproj.io
		  spec:
		    project: default # Access control project group
		    
		    # 1. Source: Location of desired state configuration in Git
		    source:
		      repoURL: 'https://github.com/argoproj/argocd-example-apps.git'
		      targetRevision: HEAD # Target git branch, tag, or commit hash
		      path: guestbook # Directory path containing YAML manifests, Helm charts, or Kustomize files
		      
		    # 2. Destination: Target Kubernetes cluster and namespace
		    destination:
		      server: 'https://kubernetes.default.svc' # Local cluster API endpoint
		      namespace: default # Target namespace for resources deployment
		      
		    # 3. SyncPolicy: Define how Argo CD reconciles drift
		    syncPolicy:
		      automated:
		        prune: true # Delete live resources if deleted from Git
		        selfHeal: true # Automatically heal manual edits in live cluster
		      syncOptions:
		        - CreateNamespace=true # Create target namespace if it doesn't exist
		        - ApplyOutOfSyncOnly=true # Only sync resources that have drifted
		  ```
-
- # Reconciliation & Drift States
	- ## Reconciling Desired vs. Live States
	  collapsed:: true
		- The reconciliation controller operates on a continuous sync loop:
			- **Reconciliation Loop**:
				- Checks for commits in Git every **3 minutes** (can be configured via Webhook triggers for instant updates).
				- Compiles manifests in Git (renders templates like Helm or Kustomize).
				- Pulls the active configuration state from the Kubernetes API.
				- Compares configurations using diff logic.
			- **Sync Status States**:
				- **Synced**: The live cluster configuration matches the desired state in Git.
				- **OutOfSync**: The live cluster has drifted from the configuration in Git.
			- **Health Status States**:
				- **Healthy**: Resources are running normally (e.g. Pods are running, Services have endpoints).
				- **Progressing**: Resources are updating (e.g. new pods are rolling out).
				- **Degraded**: Resources are failing (e.g. pod crash loops).
-
- # Advanced GitOps Patterns
	- ## App-of-Apps and ApplicationSets
	  collapsed:: true
		- Manage multiple applications cleanly using hierarchical design patterns:
		- **App-of-Apps Pattern**:
			- A root Argo CD Application targets a directory in Git containing other `Application` manifest files.
			- This allows bootstrapping an entire development cluster with one command.
		- **ApplicationSets (Templated Generation)**:
			- Automates the creation of multiple applications across different clusters and namespaces using templates and generator plugins (e.g. scanning a directory structure or GitHub organizations list).
		- **applicationset.yaml** (Dynamic Cluster Generator):
		- ```yaml
		  apiVersion: argoproj.io/v1alpha1
		  kind: ApplicationSet
		  metadata:
		    name: microservices-appset
		    namespace: argocd
		  spec:
		    generators:
		      # Generate configurations dynamically for clusters configured in settings
		      - clusters: {} 
		    template:
		      metadata:
		        name: '{{name}}-app'
		      spec:
		        project: default
		        source:
		          repoURL: 'https://github.com/company/microservices-monorepo.git'
		          targetRevision: main
		          path: 'apps/{{name}}'
		        destination:
		          server: '{{server}}'
		          namespace: default
		        syncPolicy:
		          automated:
		            prune: true
		  ```
-
- # Argo CD CLI commands
	- ## Operations Workflow commands
	  collapsed:: true
		- Deploy, inspect, and trigger manual synchronization steps using the terminal CLI:
		- ```bash
		  # Log in to remote Argo CD instance
		  argocd login argocd.company.com --username admin --password secret-pass
		  
		  # List all configured applications and their status
		  argocd app list
		  
		  # Retrieve details of a specific application
		  argocd app get guestbook-app
		  
		  # Manually trigger reconciliation and synchronization
		  argocd app sync guestbook-app
		  
		  # Roll back application manually to a specific git commit hash
		  argocd app rollback guestbook-app --revision abcd123
		  
		  # Register an external Kubernetes cluster for deployments
		  argocd cluster add my-prod-context-name
		  ```
-
- # Teaching Note: GitOps Secret Management
	- ## Secure Credentials Patterns
	  collapsed:: true
		- Committing raw, plain-text Secrets to Git repositories compromises system security. Never do this.
		- **GitOps Secrets Management Solutions**:
			- **Sealed Secrets (Bitnami)**:
				- Encrypt your secret variables locally using a public key: `kubeseal < secret.yaml > sealedsecret.yaml`.
				- You can safely commit `sealedsecret.yaml` to Git.
				- A controller running inside the target cluster holds the private key and decrypts the sealed secret to convert it into a standard Kubernetes Secret.
			- **External Secrets Operator (ESO) / Argo Vault Plugin**:
				- Store secrets in external vaults (HashiCorp Vault, AWS Secrets Manager, Google Secret Manager).
				- Commit a reference manifest (e.g. `ExternalSecret`) to Git.
				- The operator pulls secrets from the vault at runtime and injects them as Kubernetes Secrets inside the cluster, keeping passwords out of source repositories.
-
- # More Learn
	- Explore valuable resources for Argo CD:
		-
		- [Argo CD Official Documentation](https://argo-cd.readthedocs.io/)
		- [Argo Project GitHub Repository](https://github.com/argoproj/argo-cd)
		- [CNCF GitOps WG (Standards and definitions)](https://gitops-working-group.gitbook.io/)
		- [Argo Autopilot (Opinionated GitOps structures)](https://argoproj.github.io/argo-autopilot/)
