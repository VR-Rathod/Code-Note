---
seoTitle: DevOps Complete Guide – CI/CD, IaC, Containers, Observability & SRE
description: "Complete DevOps reference covering culture, CI/CD pipelines, Infrastructure as Code, Docker, Kubernetes, GitOps, monitoring, logging, distributed tracing, DevSecOps, SRE, incident management, and platform engineering. Beginner to advanced."
keywords: "DevOps, CI/CD, infrastructure as code, Docker, Kubernetes, Terraform, Ansible, GitOps, ArgoCD, Jenkins, GitHub Actions, Prometheus, Grafana, DevSecOps, SRE, monitoring, observability, platform engineering, site reliability, automation, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: DevOps – Complete Engineering Guide
enableToc: true
treeTitle: DevOps
---

> [!info] About This Page
> DevOps is the practice of unifying software **Dev**elopment and IT **Op**eration**s** to shorten delivery cycles, improve reliability, and eliminate toil through automation.
> This page covers the full DevOps lifecycle from code commit to production incident recovery.
> Prerequisites: [[Linux Advanced]] for OS internals, [[Shell Script]] for automation glue, [[System Design]] for architecture context.

- # History
  collapsed:: true
	- ## How DevOps Was Born
		- In the early 2000s, **development** and **operations** were completely separate teams. Devs wrote code and threw it "over the wall" to Ops to deploy. Ops blamed Dev for broken releases. Dev blamed Ops for slow deployments. Both were right — the process was broken.
		- The formal term **DevOps** was coined around **2008–2009** at the Agile Conference by Patrick Debois and Andrew Clay Shafer, who talked about "Agile Infrastructure." The first **DevOpsDays** conference was held in Ghent, Belgium in 2009.
		- **Flickr's famous 2009 talk** "10+ Deploys Per Day: Dev and Ops Cooperation at Flickr" by John Allspaw and Paul Hammond showed the world that shipping fast and being reliable were NOT opposites — they enabled each other.
		- The **Lean Manufacturing** movement (Toyota Production System) heavily influenced DevOps — eliminating waste, continuous improvement (Kaizen), and just-in-time delivery translated directly to software.
	-
	- ## Who Built It
		- **Patrick Debois** — coined DevOps, organized first DevOpsDays.
		- **Gene Kim** — wrote *The Phoenix Project* (2013), the novel that explained DevOps to a generation of engineers. Also *The DevOps Handbook* and *Accelerate*.
		- **Jez Humble & Dave Farley** — wrote *Continuous Delivery* (2010), the foundational book for CI/CD pipelines.
		- **Nicole Forsgren** — lead researcher behind DORA metrics, co-author of *Accelerate* — the first scientific study proving DevOps practices improve software delivery performance.
		- **Google SRE team** — popularized Site Reliability Engineering as the "DevOps implementation" at hyperscale. Their SRE books are free online.
	-
	- ## Timeline
		- ```mermaid
		  timeline
		      title DevOps Evolution
		      2009 : First DevOpsDays — Ghent, Belgium
		           : "10 Deploys Per Day" — Flickr talk
		      2010 : Continuous Delivery book — Humble & Farley
		           : Chef and Puppet gain popularity
		      2011 : Amazon EC2, S3 normalize cloud infrastructure
		           : Vagrant released — dev/prod parity
		      2013 : Docker released — container revolution begins
		           : The Phoenix Project book published
		      2014 : Kubernetes announced by Google
		           : Terraform 0.1 released
		           : Ansible 1.0 gains traction
		      2015 : Kubernetes 1.0 — donated to CNCF
		           : DORA research program begins
		      2016 : GitLab CI becomes mainstream
		           : Prometheus joins CNCF
		      2017 : GitHub Actions announced
		           : ArgoCD released
		      2018 : DevSecOps becomes mainstream
		           : Accelerate book — DORA metrics proven
		      2020 : GitOps movement formalizes
		           : Platform Engineering emerges
		      2022 : AI-assisted DevOps — Copilot in pipelines
		      2024 : Platform Engineering + AI Ops standard practice
		  ```
	-
	- ## Why DevOps Matters
		- Before DevOps: deployments were **monthly events** with full weekend downtime, war rooms, rollback plans, and post-mortems that blamed people.
		- After DevOps: Elite organizations deploy **multiple times per day** with automated pipelines, feature flags, canary releases, and automatic rollbacks — no war rooms, no weekend sacrifices.
		- The 2023 DORA report shows elite performers deploy **182× more frequently** and have **2,604× faster recovery from incidents** than low performers.
- # Introduction
	- DevOps is a **culture, set of practices, and toolchain** that eliminates the wall between the people who build software and the people who run it.
	- The core insight is simple but powerful: **the people who write the code should also care about whether it runs in production**. When developers own reliability, they build more reliable software. When operations teams understand code, they build better infrastructure.
	-
	- ## DevOps Knowledge Map
	  collapsed:: true
		- ```mermaid
		  mindmap
		    root((DevOps))
		      Culture & Practices
		        Collaboration
		        Shift Left
		        Blameless Culture
		        DORA Metrics
		      CI/CD
		        Continuous Integration
		        Continuous Delivery
		        Deployment Strategies
		        GitHub Actions
		        Jenkins / GitLab CI
		      Infrastructure as Code
		        Terraform
		        Ansible
		        SaltStack
		        Pulumi
		      Containers
		        Docker
		        Docker Compose
		        Kubernetes
		        Helm
		      GitOps
		        ArgoCD
		        Flux CD
		        Pull-Based Deployment
		      Observability
		        Metrics Prometheus
		        Logs ELK/Loki
		        Traces OpenTelemetry
		        Alerting Grafana
		      Security DevSecOps
		        SAST/DAST
		        Secret Management
		        Image Scanning
		        Policy as Code
		      SRE
		        SLIs SLOs SLAs
		        Error Budgets
		        Incident Management
		        Toil Reduction
		      Platform Engineering
		        Internal Dev Platforms
		        Golden Paths
		        Backstage
		  ```
	-
	- ## The DevOps Lifecycle — Infinity Loop
		- ```mermaid
		  graph LR
		      PLAN["📋 PLAN\nJira · Trello\nSprint planning\nUser stories"]
		      CODE["💻 CODE\nGit · GitHub\nCode review\nPair programming"]
		      BUILD["🔨 BUILD\nCompile · Lint\nDocker image\nUnit tests"]
		      TEST["🧪 TEST\nIntegration tests\nSecurity scan\nPerformance test"]
		      RELEASE["📦 RELEASE\nArtifact registry\nVersioning\nChangelog"]
		      DEPLOY["🚀 DEPLOY\nKubernetes\nArgoCD GitOps\nBlue-green"]
		      OPERATE["⚙️ OPERATE\nIncident response\nOn-call rotation\nCapacity planning"]
		      MONITOR["📊 MONITOR\nPrometheus · Grafana\nAlerts · Logs\nDistributed traces"]
		      PLAN --> CODE --> BUILD --> TEST --> RELEASE --> DEPLOY --> OPERATE --> MONITOR --> PLAN
		  ```
		- Each arrow is automated. The loop runs **continuously**, not in months-long release cycles.
	-
	- ## Core Principles Explained
		- | Principle | What It Means in Practice |
		  |-----------|--------------------------|
		  | **Collaboration** | Dev and Ops share on-call, share dashboards, share post-mortems. No blame, no walls. |
		  | **Automation** | If you do it more than twice, automate it. Manual steps = human error. |
		  | **Continuous Improvement** | Every incident is a learning opportunity. Every process can be made faster. |
		  | **Fast Feedback** | Know in minutes, not months, if your change worked. Short feedback loops → better decisions. |
		  | **Infrastructure as Code** | Servers are cattle, not pets. Everything is versioned, reproducible, disposable. |
		  | **Shift Left** | Move security, testing, and quality checks earlier in the pipeline — cheaper and faster to fix. |
		  | **Fail Forward** | Build systems that tolerate failure and recover automatically, not systems that never fail. |
	-
	- ## DevOps vs SRE vs Platform Engineering
		- These three roles overlap and people often confuse them. Here's the honest difference:
		- | Role | Analogy | Core Focus | Key Responsibility |
		  |------|---------|-----------|-------------------|
		  | **DevOps Engineer** | The builder | Pipelines + Automation | Build CI/CD, IaC, automate toil, bridge teams |
		  | **SRE** | The guardian | Reliability + SLOs | Error budgets, incident response, toil elimination |
		  | **Platform Engineer** | The enabler | Developer Experience | Self-service infra, golden paths, internal platforms |
		- In a small company, one person does all three. At Google, they are distinct disciplines with thousands of engineers each.
- # CI/CD — Continuous Integration & Delivery
  collapsed:: true
	- ## What is CI/CD — The Real Explanation
		- **Continuous Integration (CI)** means every developer merges their code into a shared branch **at least once per day**, and every merge automatically triggers a build, lint check, and test suite. The goal is to catch integration problems immediately — not weeks later when a big release happens.
		- Before CI: developers worked in long-lived branches for weeks, then merged everything at once. The result was called **"integration hell"** — conflicts everywhere, tests failing for mysterious reasons, nobody sure what broke what.
		- **Continuous Delivery (CD)** extends CI by ensuring that every successful build is **automatically deployable** to any environment — staging, pre-prod, or production. You choose when to deploy; the system ensures it's always ready.
		- **Continuous Deployment** (sometimes confused with Delivery) goes one step further — every successful pipeline run **automatically deploys to production** with no human approval gate.
		- See [[Continuous Integration]] and [[Continuous Delivery]] for dedicated notes on each.
	-
	- ## CI/CD Pipeline Architecture
		- ```mermaid
		  graph LR
		      COMMIT["👤 Developer\ngit push"]
		      TRIGGER["⚡ Trigger\nWebhook → CI server"]
		      LINT["🔍 Lint & Format\nPylint · ESLint · Black\nFail fast on style"]
		      BUILD["🔨 Build\nCompile + package\nDocker image build"]
		      UNIT["🧪 Unit Tests\nFast · Isolated\nNo external deps"]
		      SCAN["🔒 Security Scan\nSAST · Secret detection\nDependency audit"]
		      INTEG["🔗 Integration Tests\nReal DB · Real APIs\nTest contracts"]
		      ARTIFACT["📦 Artifact Push\nDocker registry\nHelm chart repo"]
		      STAGING["🔬 Staging Deploy\nSmoke tests\nApproval gate"]
		      PROD["🚀 Production\nBlue-green / Canary\nAutomatic rollback"]
		      COMMIT --> TRIGGER --> LINT --> BUILD --> UNIT --> SCAN --> INTEG --> ARTIFACT --> STAGING --> PROD
		  ```
		- The key rule: **fail fast**. If linting fails, don't bother building. If unit tests fail, don't bother running security scans. Every minute of CI time costs money and developer patience.
	-
	- ## Deployment Strategies — Choosing the Right One
		- How you release to production determines your risk, rollback speed, and downtime. Each strategy is a tradeoff:
		- | Strategy | How It Works | Downtime | Rollback | Risk | Use When |
		  |----------|-------------|---------|---------|------|---------|
		  | **Recreate** | Stop v1, start v2 | Yes | Slow (redeploy) | High | Dev/test only |
		  | **Rolling** | Replace pods one by one | None | Medium (rollout undo) | Medium | Standard apps |
		  | **Blue-Green** | Two identical envs, swap traffic | None | Instant (swap back) | Low | Critical services |
		  | **Canary** | Route 5% traffic to new version, watch metrics | None | Instant | Very Low | High-risk changes |
		  | **A/B Testing** | Route by user segment (geography, plan tier) | None | Instant | Low | Feature experiments |
		  | **Feature Flags** | Deploy dark, toggle per user/region in runtime | None | Instant | Minimal | Any change |
		- **Feature flags** (LaunchDarkly, Flagsmith, Unleash) are the most powerful pattern — they decouple **deployment** from **release**. You ship code to 100% of servers but only enable it for 1% of users. No pipeline changes needed to roll back — just toggle a flag.
	-
	- ## CI/CD Tools
		- [[GitHub Actions]] — workflow-as-code built directly into GitHub. Uses YAML trigger definitions, reusable actions from the marketplace, and matrix builds for parallel jobs. Best for projects hosted on GitHub.
		- [[GitLab CI]] — deep integration with GitLab repos. YAML-based pipeline DSL with shared runners, environments, auto-DevOps, and built-in container registry. Strong choice for self-hosted enterprise.
		- [[Jenkins]] — the original CI server (2004). Groovy-based Jenkinsfile, 1800+ plugins, runs anywhere. Powerful but operationally heavy — you manage the server. Best when you need maximum flexibility.
		- [[Circle CI]] — cloud-native, fast, Docker-first. Orb reuse system for shared config. Strong caching and parallelism.
		- [[Travis CI]] — simple, hosted, great for open-source. Less popular after 2021 pricing changes.
		- [[Bamboo]] — Atlassian's CI tool. Tight [[Jira]] integration, build plans with stages, branching.
		- [[TeamCity]] — JetBrains CI. Kotlin DSL for pipelines, smart build chains, excellent for JVM projects.
		- [[ArgoCD]] — not a traditional CI tool — it's a **GitOps CD controller** for [[Kubernetes]]. Git is the source of truth; ArgoCD continuously reconciles the cluster to match it. More on this in the GitOps section.
	-
	- ## GitHub Actions Deep Reference
		- ```yaml title=".github/workflows/full-pipeline.yml"
		  name: Full CI/CD Pipeline
		  
		  on:
		    push:
		      branches: [main, develop]
		    pull_request:
		      branches: [main]
		    workflow_dispatch:           # manual trigger button in GitHub UI
		  
		  env:
		    REGISTRY: ghcr.io
		    IMAGE_NAME: ${{ github.repository }}
		  
		  jobs:
		    # ── Job 1: Lint + Test ────────────────────────────────────────
		    test:
		      runs-on: ubuntu-latest
		      strategy:
		        matrix:
		          python-version: ["3.11", "3.12"]  # test on multiple versions
		      steps:
		        - uses: actions/checkout@v4
		  
		        - name: Set up Python ${{ matrix.python-version }}
		          uses: actions/setup-python@v5
		          with:
		            python-version: ${{ matrix.python-version }}
		            cache: "pip"          # cache pip installs between runs
		  
		        - name: Install dependencies
		          run: pip install -r requirements.txt -r requirements-dev.txt
		  
		        - name: Lint (ruff)
		          run: ruff check .
		  
		        - name: Type check (mypy)
		          run: mypy src/
		  
		        - name: Run tests + coverage
		          run: pytest --cov=src --cov-report=xml --cov-fail-under=80
		  
		        - name: Upload coverage to Codecov
		          uses: codecov/codecov-action@v4
		          with:
		            files: coverage.xml
		  
		    # ── Job 2: Security Scan ──────────────────────────────────────
		    security:
		      runs-on: ubuntu-latest
		      needs: test
		      steps:
		        - uses: actions/checkout@v4
		  
		        - name: Scan for secrets (truffleHog)
		          uses: trufflesecurity/trufflehog@main
		          with:
		            path: ./
		            base: ${{ github.event.repository.default_branch }}
		  
		        - name: Dependency audit (pip-audit)
		          run: |
		            pip install pip-audit
		            pip-audit -r requirements.txt
		  
		    # ── Job 3: Build + Push Docker image ─────────────────────────
		    build:
		      runs-on: ubuntu-latest
		      needs: [test, security]
		      permissions:
		        contents: read
		        packages: write
		      outputs:
		        image-tag: ${{ steps.meta.outputs.tags }}
		      steps:
		        - uses: actions/checkout@v4
		  
		        - name: Docker metadata (tags + labels)
		          id: meta
		          uses: docker/metadata-action@v5
		          with:
		            images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
		            tags: |
		              type=sha,prefix=sha-
		              type=ref,event=branch
		              type=semver,pattern={{version}}
		  
		        - name: Log in to GHCR
		          uses: docker/login-action@v3
		          with:
		            registry: ${{ env.REGISTRY }}
		            username: ${{ github.actor }}
		            password: ${{ secrets.GITHUB_TOKEN }}
		  
		        - name: Build and push
		          uses: docker/build-push-action@v6
		          with:
		            context: .
		            push: ${{ github.event_name != 'pull_request' }}
		            tags: ${{ steps.meta.outputs.tags }}
		            labels: ${{ steps.meta.outputs.labels }}
		            cache-from: type=gha    # GitHub Actions cache for Docker layers
		            cache-to:   type=gha,mode=max
		  
		        - name: Scan image (Trivy)
		          uses: aquasecurity/trivy-action@master
		          with:
		            image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:sha-${{ github.sha }}
		            severity: HIGH,CRITICAL
		            exit-code: 1            # fail pipeline if critical vulns found
		  
		    # ── Job 4: Deploy to staging ──────────────────────────────────
		    deploy-staging:
		      runs-on: ubuntu-latest
		      needs: build
		      environment:
		        name: staging
		        url: https://staging.myapp.com
		      steps:
		        - name: Deploy via kubectl
		          run: |
		            kubectl set image deployment/myapp \
		              myapp=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:sha-${{ github.sha }} \
		              -n staging
		            kubectl rollout status deployment/myapp -n staging --timeout=5m
		  
		    # ── Job 5: Deploy to production (manual approval gate) ────────
		    deploy-production:
		      runs-on: ubuntu-latest
		      needs: deploy-staging
		      environment:
		        name: production          # requires manual approval in GitHub UI
		      steps:
		        - name: Canary deploy (10% traffic)
		          run: |
		            kubectl apply -f k8s/canary-deployment.yaml
		            kubectl rollout status deployment/myapp-canary -n production --timeout=5m
		  ```
- # Version Control & Git Workflows
  collapsed:: true
	- ## Why Git Workflow Matters
		- Git is the foundation of every DevOps pipeline. Your branching strategy determines how fast you can ship and how many merge conflicts you fight. No perfect strategy exists — pick the one that matches your team size and release cadence.
	-
	- ## Branching Strategies Compared
		- | Strategy | Branches | Best For | Risk |
		  |----------|---------|---------|------|
		  | **Trunk-Based Development** | Single `main`, short-lived feature branches (<1 day) | High-frequency deployment, feature flags | Low merge conflicts, needs strong CI |
		  | **Git Flow** | `main` + `develop` + `feature/*` + `release/*` + `hotfix/*` | Scheduled releases, versioned products | Complex, many long-lived branches |
		  | **GitHub Flow** | `main` + feature branches | Web apps with continuous deployment | Simple, no staging branch |
		  | **GitLab Flow** | `main` + `production` + `staging` environment branches | Multiple environments | Medium complexity |
		- > [!tip] Industry Trend
		  > Modern high-performing teams (Google, Meta, Netflix) use **Trunk-Based Development** with feature flags. Git Flow is still common in firmware, libraries, and enterprise software with versioned releases.
	-
	- ## Semantic Versioning (SemVer)
		- ```
		  MAJOR.MINOR.PATCH  →  2.14.3
		  │      │      └── Bug fixes — no API changes
		  │      └── New features — backward compatible
		  └── Breaking changes — not backward compatible
		  
		  Pre-release tags:
		    2.14.3-alpha.1   → early unstable
		    2.14.3-beta.2    → feature complete, buggy
		    2.14.3-rc.1      → release candidate, near stable
		  
		  Conventional Commits (auto-generates changelog):
		    feat: add user authentication      → bumps MINOR
		    fix: correct null pointer crash    → bumps PATCH
		    feat!: redesign API endpoints      → bumps MAJOR (! = breaking)
		    chore: update dependencies         → no version bump
		  ```
- # Infrastructure as Code (IaC)
  collapsed:: true
	- ## What is IaC — The Real Explanation
		- Before IaC, servers were configured manually — a sysadmin would SSH in, install packages, edit config files, and write nothing down. This created **snowflake servers**: each one slightly different, impossible to reproduce, fragile to touch. "Works on my server" was a real problem.
		- IaC treats infrastructure — servers, networks, load balancers, databases, DNS records — as **source code**. You write a file describing what you want, commit it to Git, and a tool makes reality match the file. The result is:
			- **Reproducibility** — spin up identical environments in minutes
			- **Auditability** — Git history shows who changed what and why
			- **Automation** — no manual steps, no forgotten config, no snowflakes
			- **Disaster Recovery** — losing a server means running `terraform apply`, not a day of manual work
		- There are two main layers of IaC: **Provisioning** (create the servers) and **Configuration Management** (configure what's on them).
	-
	- ## IaC Tools Comparison
		- | Tool | Layer | Language | Approach | Best For |
		  |------|-------|---------|---------|---------|
		  | **Terraform** | Provisioning | HCL | Declarative | Multi-cloud infra (AWS/GCP/Azure) |
		  | **Pulumi** | Provisioning | Python/TS/Go | Declarative (real code) | Devs who hate HCL |
		  | **CloudFormation** | Provisioning | JSON/YAML | Declarative | AWS-only teams |
		  | **CDK** | Provisioning | Python/TS/Java | Imperative → CloudFormation | AWS with OOP |
		  | **[[Ansible]]** | Configuration | YAML | Procedural | Server setup, app deployment |
		  | **[[SaltStack]]** | Configuration + Orchestration | YAML/Python | Event-driven | Large-scale, reactive infra |
		  | **Puppet** | Configuration | Puppet DSL | Declarative | Enterprise legacy infra |
		  | **Chef** | Configuration | Ruby DSL | Procedural | Ruby shops, complex cookbooks |
	-
	- ## Terraform — Deep Reference
		- Terraform is the industry standard for cloud provisioning. It works by talking to cloud provider APIs (AWS, GCP, Azure, etc.) to create, update, and destroy resources.
		- The key concept is **state** — Terraform keeps a `.tfstate` file that maps your config to real cloud resources. Always store state remotely (S3 + DynamoDB, Terraform Cloud) and never commit it to Git (it contains secrets).
		- ```bash title="Terraform core workflow"
		  terraform init          # download providers + initialize backend
		  terraform fmt           # auto-format all .tf files (run in CI)
		  terraform validate      # check syntax + provider schema
		  terraform plan          # show exactly what will change — ALWAYS read this
		  terraform apply         # apply changes (asks for approval)
		  terraform apply -auto-approve   # skip approval (CI/CD only)
		  terraform destroy       # tear down all managed resources
		  terraform state list    # show all tracked resources
		  terraform state show aws_instance.web   # inspect a specific resource
		  terraform output        # print output values
		  terraform import aws_s3_bucket.my_bucket my-existing-bucket  # import existing resource
		  ```
		- ```hcl title="main.tf — production-ready AWS setup"
		  terraform {
		    required_version = ">= 1.6.0"
		    required_providers {
		      aws = {
		        source  = "hashicorp/aws"
		        version = "~> 5.0"    # pin major version, allow minor updates
		      }
		    }
		    # Remote state — critical for teams
		    backend "s3" {
		      bucket         = "my-company-tfstate"
		      key            = "prod/myapp/terraform.tfstate"
		      region         = "us-east-1"
		      dynamodb_table = "terraform-locks"  # prevents concurrent applies
		      encrypt        = true
		    }
		  }
		  
		  provider "aws" {
		    region = var.aws_region
		    default_tags {
		      tags = {
		        Project     = "myapp"
		        Environment = var.environment
		        ManagedBy   = "terraform"
		      }
		    }
		  }
		  
		  # Variables — parameterize everything
		  variable "environment"  { type = string }
		  variable "aws_region"   { type = string  default = "us-east-1" }
		  variable "instance_type"{ type = string  default = "t3.medium" }
		  
		  # VPC — isolated network
		  resource "aws_vpc" "main" {
		    cidr_block           = "10.0.0.0/16"
		    enable_dns_hostnames = true
		    enable_dns_support   = true
		    tags = { Name = "${var.environment}-vpc" }
		  }
		  
		  # Subnets — public for web, private for app/db
		  resource "aws_subnet" "public" {
		    count             = 2
		    vpc_id            = aws_vpc.main.id
		    cidr_block        = "10.0.${count.index}.0/24"
		    availability_zone = data.aws_availability_zones.available.names[count.index]
		    map_public_ip_on_launch = true
		    tags = { Name = "${var.environment}-public-${count.index}" }
		  }
		  
		  # EC2 instance
		  resource "aws_instance" "web" {
		    ami                    = data.aws_ami.ubuntu.id
		    instance_type          = var.instance_type
		    subnet_id              = aws_subnet.public[0].id
		    vpc_security_group_ids = [aws_security_group.web.id]
		    iam_instance_profile   = aws_iam_instance_profile.web.name
		  
		    user_data = base64encode(templatefile("scripts/user_data.sh", {
		      environment = var.environment
		    }))
		  
		    tags = { Name = "${var.environment}-web" }
		  }
		  
		  # Outputs — use in other modules or CI scripts
		  output "instance_ip"  { value = aws_instance.web.public_ip }
		  output "vpc_id"       { value = aws_vpc.main.id }
		  ```
		- ```hcl title="modules/ — reusable Terraform modules"
		  # modules/web_server/main.tf
		  # Usage: module "web" { source = "./modules/web_server"  instance_type = "t3.large" }
		  variable "instance_type" { type = string }
		  variable "subnet_id"     { type = string }
		  
		  resource "aws_instance" "this" {
		    ami           = data.aws_ami.ubuntu.id
		    instance_type = var.instance_type
		    subnet_id     = var.subnet_id
		  }
		  
		  output "instance_id" { value = aws_instance.this.id }
		  ```
	-
	- ## Ansible — Deep Reference
		- Ansible is agentless — it connects via SSH and runs tasks on remote servers. Nothing to install on the target. Configuration is YAML **playbooks**. See [[Ansible]] for the full reference page.
		- Ansible is best for: configuring servers after Terraform creates them, rolling deployments, ad-hoc operations across a fleet.
		- ```yaml title="playbook.yml — production-ready web server setup"
		  ---
		  - name: Configure and deploy web application
		    hosts: webservers
		    become: true        # use sudo
		  
		    vars:
		      app_user:    deploy
		      app_dir:     /opt/myapp
		      nginx_port:  80
		      app_port:    8000
		  
		    pre_tasks:
		      - name: Update apt cache
		        apt:
		          update_cache: true
		          cache_valid_time: 3600   # only update if older than 1 hour
		  
		    tasks:
		      # ── System setup ───────────────────────────
		      - name: Create app user
		        user:
		          name:   "{{ app_user }}"
		          system: true
		          shell:  /bin/false
		  
		      - name: Install system packages
		        apt:
		          name:
		            - nginx
		            - python3
		            - python3-pip
		            - git
		          state: present
		  
		      # ── App deployment ──────────────────────────
		      - name: Clone application
		        git:
		          repo:    https://github.com/company/myapp.git
		          dest:    "{{ app_dir }}"
		          version: "{{ app_version | default('main') }}"
		          force:   true
		  
		      - name: Install Python dependencies
		        pip:
		          requirements: "{{ app_dir }}/requirements.txt"
		          virtualenv:   "{{ app_dir }}/.venv"
		  
		      # ── Service configuration ───────────────────
		      - name: Write nginx config from template
		        template:
		          src:  templates/nginx.conf.j2
		          dest: /etc/nginx/sites-available/myapp
		          mode: "0644"
		        notify: reload nginx          # triggers handler
		  
		      - name: Enable nginx site
		        file:
		          src:   /etc/nginx/sites-available/myapp
		          dest:  /etc/nginx/sites-enabled/myapp
		          state: link
		        notify: reload nginx
		  
		      - name: Start and enable services
		        service:
		          name:    "{{ item }}"
		          state:   started
		          enabled: true
		        loop:
		          - nginx
		          - myapp
		  
		    handlers:
		      - name: reload nginx
		        service:
		          name:  nginx
		          state: reloaded
		  
		  # ── Separate play for database servers ──────────
		  - name: Configure database
		    hosts: dbservers
		    become: true
		    roles:
		      - role: postgresql
		        vars:
		          postgresql_version: 16
		          postgresql_databases:
		            - name: myapp_production
		          postgresql_users:
		            - name: myapp
		              password: "{{ vault_db_password }}"   # encrypted with ansible-vault
		  ```
		- ```bash title="Ansible CLI essential commands"
		  # Inventory check
		  ansible-inventory -i inventory.ini --list    # show all hosts as JSON
		  ansible-inventory -i inventory.ini --graph   # show host tree
		  
		  # Connectivity test
		  ansible all -m ping -i inventory.ini
		  
		  # Ad-hoc commands — quick operations without a playbook
		  ansible webservers -m shell -a "systemctl status nginx" -i inventory.ini
		  ansible all -m apt -a "name=curl state=present" -b -i inventory.ini
		  
		  # Run playbook
		  ansible-playbook playbook.yml -i inventory.ini
		  ansible-playbook playbook.yml -i inventory.ini --check      # dry-run
		  ansible-playbook playbook.yml -i inventory.ini --diff       # show file diffs
		  ansible-playbook playbook.yml -i inventory.ini --tags deploy # only deploy tasks
		  ansible-playbook playbook.yml -i inventory.ini --limit web1  # only one host
		  
		  # Vault — encrypt secrets
		  ansible-vault encrypt secrets.yml
		  ansible-vault decrypt secrets.yml
		  ansible-vault edit secrets.yml
		  ansible-playbook playbook.yml --ask-vault-pass
		  ansible-playbook playbook.yml --vault-password-file ~/.vault_pass
		  ```
- # Containers & Orchestration
  collapsed:: true
	- ## What is a Container — The Real Explanation
		- A container is **not a virtual machine**. A VM emulates entire hardware — CPU, RAM, disk, network card — with its own kernel. It's heavy (GBs of RAM, minutes to boot).
		- A container is just an **isolated process** on the host OS, using Linux kernel features to fake isolation:
			- **Namespaces** — process sees its own PID list, network stack, filesystem mount points (covered deeply in [[Linux Advanced]])
			- **cgroups** — limits how much CPU, RAM, and disk I/O the process can use
			- **OverlayFS** — layered filesystem so containers share base image layers (saves disk space)
		- The result: containers start in milliseconds, use MBs of RAM overhead, and thousands can run on one machine. The tradeoff is they share the host kernel — a kernel exploit affects all containers.
	-
	- ## Docker Deep Reference
		- Docker packages your app + its dependencies into a portable image that runs identically on any machine with Docker installed. "Works on my machine" finally ends.
		- ```bash title="Docker essential commands"
		  # ── Images ─────────────────────────────────────────────────────
		  docker build -t myapp:1.0 .             # build from Dockerfile in current dir
		  docker build -t myapp:1.0 -f prod.Dockerfile .  # specify Dockerfile
		  docker images                            # list local images
		  docker pull ubuntu:22.04                 # download image from registry
		  docker push registry.company.com/myapp:1.0
		  docker image inspect myapp:1.0          # full image metadata
		  docker image prune -a                   # remove all unused images
		  
		  # ── Containers ─────────────────────────────────────────────────
		  docker run -d -p 8080:80 --name web myapp:1.0
		  #          │  │          │           └── image
		  #          │  │          └── name the container
		  #          │  └── host_port:container_port
		  #          └── detached (background)
		  docker run --rm -it myapp:1.0 bash      # interactive, auto-delete on exit
		  docker ps -a                             # all containers (running + stopped)
		  docker stop web                          # graceful stop (SIGTERM)
		  docker kill web                          # immediate stop (SIGKILL)
		  docker rm web                            # delete stopped container
		  docker logs -f --tail=100 web            # tail logs
		  docker exec -it web bash                 # shell inside running container
		  docker stats                             # live CPU/memory usage
		  
		  # ── Volumes & Networks ─────────────────────────────────────────
		  docker volume create mydata
		  docker run -v mydata:/app/data myapp:1.0  # named volume (persistent)
		  docker run -v $(pwd)/data:/app/data myapp:1.0  # bind mount (host path)
		  docker network create mynet
		  docker run --network mynet myapp:1.0      # join network
		  docker network inspect mynet              # see connected containers
		  
		  # ── Cleanup ────────────────────────────────────────────────────
		  docker system prune -af --volumes         # nuclear option — clean everything
		  ```
		- ```dockerfile title="Dockerfile — production multi-stage build (Python)"
		  # ══ Stage 1: Build dependencies ══════════════════════════
		  FROM python:3.12-slim AS builder
		  
		  # Install system build deps (won't be in final image)
		  RUN apt-get update && apt-get install -y --no-install-recommends \
		      build-essential \
		      libpq-dev \
		    && rm -rf /var/lib/apt/lists/*
		  
		  WORKDIR /build
		  COPY requirements.txt .
		  
		  # Install to /usr/local — copied to final image
		  RUN pip install --prefix=/install --no-cache-dir -r requirements.txt
		  
		  # ══ Stage 2: Lean production image ═══════════════════════
		  FROM python:3.12-slim
		  
		  # Runtime deps only
		  RUN apt-get update && apt-get install -y --no-install-recommends \
		      libpq5 \
		    && rm -rf /var/lib/apt/lists/*
		  
		  # Copy installed packages from builder
		  COPY --from=builder /install /usr/local
		  
		  # Non-root user — security best practice
		  RUN useradd -m -u 1000 appuser
		  WORKDIR /app
		  COPY --chown=appuser:appuser . .
		  USER appuser
		  
		  # Health check — Docker and Kubernetes use this
		  HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
		    CMD curl -f http://localhost:8000/health || exit 1
		  
		  EXPOSE 8000
		  CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
		  ```
		- ```dockerfile title=".dockerignore — keep images lean"
		  .git
		  .env
		  .venv
		  __pycache__
		  *.pyc
		  *.pyo
		  node_modules
		  dist
		  build
		  .pytest_cache
		  *.log
		  docker-compose*.yml
		  README.md
		  ```
	-
	- ## Docker Compose — Multi-Service Local Dev
		- Docker Compose runs a multi-container app with a single `docker-compose up`. Perfect for local development — one command starts your app + database + cache + message queue.
		- ```yaml title="docker-compose.yml — full app stack"
		  version: "3.9"
		  
		  services:
		    # ── Web application ────────────────────────────────────
		    web:
		      build:
		        context: .
		        target: builder    # use builder stage for hot-reload
		      ports:
		        - "8000:8000"
		      environment:
		        DATABASE_URL:  postgresql://postgres:secret@db:5432/myapp
		        REDIS_URL:     redis://redis:6379/0
		        SECRET_KEY:    ${SECRET_KEY}        # from .env file
		        DEBUG:         "true"
		      volumes:
		        - .:/app                            # mount source for live reload
		      depends_on:
		        db:
		          condition: service_healthy        # wait for healthy db
		        redis:
		          condition: service_started
		      command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
		      restart: unless-stopped
		  
		    # ── PostgreSQL database ────────────────────────────────
		    db:
		      image: postgres:16-alpine
		      environment:
		        POSTGRES_DB:       myapp
		        POSTGRES_USER:     postgres
		        POSTGRES_PASSWORD: secret
		      volumes:
		        - db-data:/var/lib/postgresql/data  # persist data
		        - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql  # initial schema
		      healthcheck:
		        test: ["CMD-SHELL", "pg_isready -U postgres -d myapp"]
		        interval: 10s
		        timeout:  5s
		        retries:  5
		      ports:
		        - "5432:5432"   # expose for local DB tools (DBeaver, pgAdmin)
		  
		    # ── Redis cache ────────────────────────────────────────
		    redis:
		      image: redis:7-alpine
		      command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
		      ports:
		        - "6379:6379"
		  
		    # ── Background worker ──────────────────────────────────
		    worker:
		      build: .
		      command: celery -A myapp.celery worker --loglevel=info
		      environment:
		        DATABASE_URL: postgresql://postgres:secret@db:5432/myapp
		        REDIS_URL:    redis://redis:6379/0
		      depends_on: [db, redis]
		      restart: unless-stopped
		  
		    # ── Nginx reverse proxy ────────────────────────────────
		    nginx:
		      image: nginx:alpine
		      ports:
		        - "80:80"
		        - "443:443"
		      volumes:
		        - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
		        - ./nginx/certs:/etc/nginx/certs:ro
		      depends_on: [web]
		  
		  volumes:
		    db-data:
		  ```
		- ```bash title="Docker Compose commands"
		  docker compose up -d              # start all services in background
		  docker compose up --build         # rebuild images then start
		  docker compose ps                 # status of all services
		  docker compose logs -f web        # follow logs for web service
		  docker compose exec web bash      # shell into running container
		  docker compose run --rm web pytest  # one-off command (runs+deletes)
		  docker compose down               # stop and remove containers
		  docker compose down -v            # also delete volumes (clean slate)
		  docker compose scale worker=3     # run 3 worker containers
		  ```
	-
	- ## Kubernetes — Deep Reference
		- Kubernetes (K8s) is a **container orchestration platform** — it automates deploying, scaling, networking, health checking, and self-healing of containerized applications across a cluster of machines.
		- The mental model: you describe **desired state** ("I want 3 replicas of this container, always running"), and Kubernetes continuously makes reality match that description. It restarts crashed pods, reschedules pods from failed nodes, scales based on traffic, and manages rolling updates.
		- ```mermaid
		  graph TD
		      subgraph "Kubernetes Cluster"
		          subgraph "Control Plane"
		              API["API Server\nAll requests go here"]
		              ETCD["etcd\nDistributed key-value\nCluster state database"]
		              SCHED["Scheduler\nAssigns pods to nodes"]
		              CM["Controller Manager\nReconciliation loops"]
		          end
		          subgraph "Worker Node 1"
		              KL1["kubelet\nManages pods on this node"]
		              KP1["kube-proxy\nNetwork rules (iptables/eBPF)"]
		              P1["Pod\n[container + container]"]
		              P2["Pod\n[container]"]
		          end
		          subgraph "Worker Node 2"
		              KL2["kubelet"]
		              P3["Pod\n[container]"]
		          end
		          API <--> ETCD
		          API --> SCHED
		          API --> CM
		          API --> KL1
		          API --> KL2
		      end
		  ```
		- ```yaml title="deployment.yaml — production Deployment manifest"
		  apiVersion: apps/v1
		  kind: Deployment
		  metadata:
		    name: myapp
		    namespace: production
		    labels:
		      app: myapp
		  spec:
		    replicas: 3                      # desired pod count
		    selector:
		      matchLabels:
		        app: myapp
		    strategy:
		      type: RollingUpdate
		      rollingUpdate:
		        maxSurge:       1            # max pods above replicas during update
		        maxUnavailable: 0            # zero-downtime: never kill before new is ready
		    template:
		      metadata:
		        labels:
		          app: myapp
		      spec:
		        containers:
		          - name: myapp
		            image: ghcr.io/company/myapp:sha-abc123
		            ports:
		              - containerPort: 8000
		  
		            # Resource limits — always set these
		            resources:
		              requests:              # guaranteed allocation
		                cpu:    "100m"       # 0.1 CPU core
		                memory: "128Mi"
		              limits:               # hard ceiling
		                cpu:    "500m"
		                memory: "512Mi"
		  
		            # Probes — Kubernetes uses these to manage traffic
		            livenessProbe:           # restart if this fails
		              httpGet:
		                path: /health
		                port: 8000
		              initialDelaySeconds: 15
		              periodSeconds:        10
		            readinessProbe:          # only send traffic if this passes
		              httpGet:
		                path: /ready
		                port: 8000
		              initialDelaySeconds: 5
		              periodSeconds:        5
		  
		            # Environment from ConfigMap + Secret
		            envFrom:
		              - configMapRef:
		                  name: myapp-config
		              - secretRef:
		                  name: myapp-secrets
		  
		        # Don't schedule two replicas on same node
		        topologySpreadConstraints:
		          - maxSkew: 1
		            topologyKey: kubernetes.io/hostname
		            whenUnsatisfiable: DoNotSchedule
		            labelSelector:
		              matchLabels:
		                app: myapp
		  ---
		  apiVersion: v1
		  kind: Service
		  metadata:
		    name: myapp
		    namespace: production
		  spec:
		    selector:
		      app: myapp
		    ports:
		      - port: 80
		        targetPort: 8000
		    type: ClusterIP
		  ---
		  apiVersion: autoscaling/v2
		  kind: HorizontalPodAutoscaler
		  metadata:
		    name: myapp-hpa
		    namespace: production
		  spec:
		    scaleTargetRef:
		      apiVersion: apps/v1
		      kind: Deployment
		      name: myapp
		    minReplicas: 3
		    maxReplicas: 20
		    metrics:
		      - type: Resource
		        resource:
		          name: cpu
		          target:
		            type:               AverageUtilization
		            averageUtilization: 70    # scale up if CPU > 70%
		  ```
		- ```bash title="kubectl essential commands"
		  # ── Cluster info ────────────────────────────────────────────
		  kubectl cluster-info
		  kubectl get nodes -o wide           # all nodes with IPs
		  kubectl top nodes                   # CPU/memory per node
		  
		  # ── Namespaces ──────────────────────────────────────────────
		  kubectl get namespaces
		  kubectl create namespace staging
		  kubectl config set-context --current --namespace=production  # set default ns
		  
		  # ── Workloads ───────────────────────────────────────────────
		  kubectl get pods -n production -o wide   # pods with node placement
		  kubectl get pods -A                      # all namespaces
		  kubectl describe pod myapp-abc123 -n production  # full pod details
		  kubectl logs -f myapp-abc123 -c myapp    # follow logs, specific container
		  kubectl logs -l app=myapp --tail=100     # logs from all pods with label
		  kubectl exec -it myapp-abc123 -- bash    # shell into pod
		  
		  # ── Deployments ─────────────────────────────────────────────
		  kubectl apply -f deployment.yaml          # apply manifest
		  kubectl rollout status deployment/myapp   # watch rollout progress
		  kubectl rollout history deployment/myapp  # revision history
		  kubectl rollout undo deployment/myapp     # rollback to previous revision
		  kubectl set image deployment/myapp myapp=myapp:new-tag  # update image
		  kubectl scale deployment/myapp --replicas=5
		  
		  # ── Debugging ──────────────────────────────────────────────
		  kubectl get events -n production --sort-by='.lastTimestamp'
		  kubectl port-forward svc/myapp 8080:80   # local access to service
		  kubectl run debug --rm -it --image=busybox -- sh  # temporary debug pod
		  kubectl top pods -n production            # resource usage
		  ```
	-
	- ## GitOps with ArgoCD
		- GitOps is the practice of using **Git as the single source of truth** for your infrastructure and application configuration. Instead of running `kubectl apply` from a CI pipeline (push-based), a controller running **inside the cluster** continuously pulls config from Git and reconciles the cluster state.
		- Why GitOps is better than push-based:
			- No cluster credentials in your CI server (reduced attack surface)
			- Every deployment is recorded in Git history with author, timestamp, and message
			- Drift detection — if someone runs `kubectl edit` manually, ArgoCD detects and corrects it
			- Rollback = `git revert` — no special tooling needed
		- [[ArgoCD]] is the most widely adopted GitOps controller. See [[ArgoCD]] for the full reference including Application CRD, sync policies, App-of-Apps pattern, and secret management strategies.
- # Monitoring, Logging & Observability
  collapsed:: true
	- ## Observability vs Monitoring — The Difference
		- **Monitoring** is watching known metrics for threshold breaches. "Alert when CPU > 90%." You know what to look for.
		- **Observability** is the ability to ask **arbitrary questions** about a system's internal state from its external outputs — without deploying new code. "Why are 0.3% of requests to /checkout failing for users in Singapore?"
		- The difference matters when you're debugging a production incident you've never seen before. Monitoring tells you something is wrong. Observability helps you understand why.
		- The **Three Pillars** are complementary — you need all three to fully understand a system:
		- ```mermaid
		  graph TD
		      M["📊 METRICS\nNumerical measurements over time\nCPU · Memory · Request rate\nError rate · Latency percentiles\nTools: Prometheus + Grafana"]
		      L["📋 LOGS\nTimestamped event records\nApplication errors · Access logs\nAudit trails · Debug output\nTools: Loki · ELK · Fluentd"]
		      T["🔍 TRACES\nRequest journey across services\nWhere time was spent\nWhich service caused slowness\nTools: Jaeger · Tempo · Zipkin"]
		      M -->|"Know something is wrong"| Incident
		      L -->|"Find what happened"| Incident
		      T -->|"Find where it happened"| Incident
		      Incident["🚨 Incident Resolution"]
		  ```
	-
	- ## Prometheus + Grafana — Deep Reference
		- **Prometheus** is a pull-based time-series metrics database. It scrapes `/metrics` endpoints on a schedule and stores numeric measurements with labels. The query language is **PromQL**.
		- **Grafana** connects to Prometheus (and dozens of other data sources) to build dashboards, set alert rules, and visualize system health.
		- ```yaml title="prometheus.yml — full scrape configuration"
		  global:
		    scrape_interval:     15s   # how often to scrape each target
		    evaluation_interval: 15s   # how often to evaluate alert rules
		    external_labels:
		      cluster: production
		      region:  us-east-1
		  
		  # Alert manager — where to send firing alerts
		  alerting:
		    alertmanagers:
		      - static_configs:
		          - targets: ["alertmanager:9093"]
		  
		  # Load alert rules from files
		  rule_files:
		    - "alerts/application.yml"
		    - "alerts/infrastructure.yml"
		  
		  scrape_configs:
		    # ── Kubernetes pods ──────────────────────────────────────
		    - job_name: kubernetes-pods
		      kubernetes_sd_configs:
		        - role: pod
		      relabel_configs:
		        # Only scrape pods with annotation prometheus.io/scrape: "true"
		        - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
		          action: keep
		          regex: "true"
		        # Use custom port if annotation set
		        - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_port]
		          action: replace
		          target_label: __address__
		          regex: (.+)
		          replacement: $1
		  
		    # ── Node exporter (OS metrics per machine) ───────────────
		    - job_name: node-exporter
		      static_configs:
		        - targets: ["node-exporter:9100"]
		  
		    # ── Kubernetes API server ────────────────────────────────
		    - job_name: kubernetes-apiservers
		      kubernetes_sd_configs:
		        - role: endpoints
		      scheme: https
		      tls_config:
		        ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
		      bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
		  ```
		- ```yaml title="alerts/application.yml — production alert rules"
		  groups:
		    - name: application
		      rules:
		        # High error rate — fires if > 5% of requests fail for 5 minutes
		        - alert: HighErrorRate
		          expr: |
		            sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
		            /
		            sum(rate(http_requests_total[5m])) by (service)
		            > 0.05
		          for: 5m
		          labels:
		            severity: critical
		          annotations:
		            summary: "{{ $labels.service }} error rate {{ $value | humanizePercentage }}"
		            runbook: "https://wiki.company.com/runbooks/high-error-rate"
		  
		        # High latency — p99 > 2 seconds
		        - alert: HighLatency
		          expr: |
		            histogram_quantile(0.99, 
		              sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)
		            ) > 2
		          for: 5m
		          labels:
		            severity: warning
		          annotations:
		            summary: "{{ $labels.service }} p99 latency {{ $value | humanizeDuration }}"
		  
		        # Pod crash-looping
		        - alert: PodCrashLooping
		          expr: |
		            rate(kube_pod_container_status_restarts_total[15m]) * 60 * 15 > 0
		          for: 5m
		          labels:
		            severity: warning
		          annotations:
		            summary: "Pod {{ $labels.namespace }}/{{ $labels.pod }} is crash-looping"
		  
		        # Memory usage > 90%
		        - alert: HighMemoryUsage
		          expr: |
		            (container_memory_usage_bytes / container_spec_memory_limit_bytes) > 0.9
		          for: 5m
		          labels:
		            severity: warning
		  ```
		- ```
		  PromQL cheat sheet:
		  ─────────────────────────────────────────────────────────────
		  # Rate of requests per second over 5-minute window
		  rate(http_requests_total[5m])
		  
		  # Filter by label
		  rate(http_requests_total{status="200", service="api"}[5m])
		  
		  # Sum across all instances, group by service
		  sum(rate(http_requests_total[5m])) by (service)
		  
		  # p95 latency from histogram
		  histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
		  
		  # Memory used as % of limit
		  container_memory_usage_bytes / container_spec_memory_limit_bytes * 100
		  
		  # Increase over last hour (for counters)
		  increase(errors_total[1h])
		  
		  # 5-minute moving average of CPU
		  avg_over_time(cpu_usage_percent[5m])
		  ```
	-
	- ## SLIs, SLOs, SLAs, and Error Budgets
		- This framework, pioneered by Google SRE, makes reliability a **data-driven engineering conversation** instead of a political argument between Dev ("ship faster") and Ops ("don't break things").
		- **SLI** (Service Level Indicator) — a carefully defined measurement of a service's behavior. Not just "is it up?" but precise: "What percentage of requests complete successfully in under 500ms?"
		- **SLO** (Service Level Objective) — your target for the SLI. "99.9% of requests succeed in under 500ms over a rolling 28-day window."
		- **Error Budget** — the allowed failure budget. If your SLO is 99.9%, you have **0.1% = ~43 minutes/month** you're allowed to be unreliable. This is **budget you spend**, not a punishment.
		- **SLA** (Service Level Agreement) — the contractual commitment to customers. Usually more lenient than your SLO (e.g., SLO = 99.9%, SLA = 99.5%). If you breach SLA, you pay credits.
		- ```
		  Error Budget Math:
		  ─────────────────────────────────────────────────────────────
		  SLO: 99.9% availability over 30 days
		  Error Budget = 100% - 99.9% = 0.1%
		  
		  30 days = 30 × 24 × 60 = 43,200 minutes
		  Allowed downtime = 43,200 × 0.001 = 43.2 minutes/month
		  
		  If your last deploy caused 1 hour of degradation:
		  → You've consumed 139% of your monthly error budget
		  → Feature work pauses, team focuses on reliability
		  
		  If your budget is untouched after 3 weeks:
		  → You're being too conservative
		  → Ship faster, take more risk, the budget exists for a reason
		  ```
	-
	- ## Centralized Logging — ELK Stack
		- Raw logs from hundreds of containers are useless unless you can search, filter, and correlate them. The **ELK Stack** (Elasticsearch + Logstash + Kibana) or the modern **PLG Stack** (Promtail + Loki + Grafana) centralizes all logs.
		- ```yaml title="Fluentd — collect and forward container logs"
		  # /etc/fluentd/fluent.conf
		  
		  # ── Source: tail container log files ──────────────────────
		  <source>
		    @type tail
		    path /var/log/containers/*.log
		    pos_file /var/log/fluentd-containers.pos
		    tag kubernetes.*
		    read_from_head true
		    <parse>
		      @type json
		      time_format %Y-%m-%dT%H:%M:%S.%NZ
		    </parse>
		  </source>
		  
		  # ── Filter: add Kubernetes metadata (pod name, namespace, labels)
		  <filter kubernetes.**>
		    @type kubernetes_metadata
		  </filter>
		  
		  # ── Filter: exclude noisy health check logs ────────────────
		  <filter kubernetes.**>
		    @type grep
		    <exclude>
		      key log
		      pattern /GET \/health/
		    </exclude>
		  </filter>
		  
		  # ── Output: send to Elasticsearch ──────────────────────────
		  <match kubernetes.**>
		    @type elasticsearch
		    host elasticsearch.monitoring.svc.cluster.local
		    port 9200
		    logstash_format true
		    logstash_prefix k8s-logs
		    include_tag_key true
		    type_name _doc
		    <buffer>
		      flush_interval 5s
		      retry_max_interval 30s
		      retry_forever false
		    </buffer>
		  </match>
		  ```
	-
	- ## Distributed Tracing — OpenTelemetry
		- In a microservices architecture, a single user request may touch 10+ services. When it's slow, which service caused it? Distributed tracing answers this by **propagating a trace ID** through every service call.
		- **OpenTelemetry** (OTel) is the vendor-neutral standard for traces, metrics, and logs. You instrument your code once and send to Jaeger, Tempo, Datadog, or any backend.
		- ```python title="OpenTelemetry — instrument a Python FastAPI service"
		  from opentelemetry import trace
		  from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
		  from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
		  from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
		  from opentelemetry.instrumentation.requests import RequestsInstrumentor
		  from opentelemetry.sdk.trace import TracerProvider
		  from opentelemetry.sdk.trace.export import BatchSpanProcessor
		  from opentelemetry.sdk.resources import SERVICE_NAME, Resource
		  
		  # Configure tracer — do this at startup
		  resource = Resource(attributes={SERVICE_NAME: "payment-service"})
		  provider = TracerProvider(resource=resource)
		  provider.add_span_processor(
		      BatchSpanProcessor(OTLPSpanExporter(endpoint="http://otel-collector:4317"))
		  )
		  trace.set_tracer_provider(provider)
		  
		  # Auto-instrument FastAPI, SQLAlchemy, and outbound HTTP
		  FastAPIInstrumentor.instrument_app(app)
		  SQLAlchemyInstrumentor().instrument(engine=engine)
		  RequestsInstrumentor().instrument()
		  
		  # Manual span for custom operations
		  tracer = trace.get_tracer(__name__)
		  
		  async def process_payment(order_id: str, amount: float):
		      with tracer.start_as_current_span("process_payment") as span:
		          span.set_attribute("order.id", order_id)
		          span.set_attribute("payment.amount", amount)
		  
		          try:
		              result = await charge_card(amount)
		              span.set_attribute("payment.status", "success")
		              return result
		          except PaymentError as e:
		              span.set_status(trace.Status(trace.StatusCode.ERROR, str(e)))
		              span.record_exception(e)
		              raise
		  ```
- # DevSecOps — Security in the Pipeline
  collapsed:: true
	- ## What is DevSecOps
		- DevSecOps means security is a **shared responsibility** baked into every pipeline stage — not a separate team that reviews code once a quarter. The mantra is **"shift left"**: catch vulnerabilities as early as possible, when they're cheapest to fix.
		- A vulnerability found in code review costs $80 to fix. The same vulnerability found in production costs $7,600 (NIST study). The math makes the case.
		- See [[Cybersecurity]] for security fundamentals and [[Cybersecurity Architecture]] for enterprise security design patterns.
	-
	- ## Security Stages in the Pipeline
		- ```mermaid
		  graph LR
		      IDE["💻 IDE\nSemgrep plugin\nSecret detection\nlinting security rules"]
		      PR["📝 Pull Request\nSAST scan\nDependency audit\nSecret scan (truffleHog)"]
		      BUILD["🔨 Build\nDependency CVE check\nLicense compliance\nSBOM generation"]
		      IMAGE["📦 Container Image\nTrivy image scan\nDistroless base\nNon-root user"]
		      DEPLOY["🚀 Deploy\nOPA/Gatekeeper policies\nNetworkPolicy enforcement\nRBAC validation"]
		      RUNTIME["⚙️ Runtime\nFalco anomaly detection\neBPF syscall monitoring\nAudit logs"]
		      IDE --> PR --> BUILD --> IMAGE --> DEPLOY --> RUNTIME
		  ```
		- | Stage | Tool | What It Catches |
		  |-------|------|----------------|
		  | Code | Semgrep, Bandit | SQL injection, hardcoded secrets, insecure patterns |
		  | PR | truffleHog, detect-secrets | API keys, passwords, tokens in code |
		  | Dependencies | Trivy, Snyk, pip-audit | Known CVEs in packages (log4j style) |
		  | Image | Trivy, Grype, Clair | OS package vulnerabilities in Docker images |
		  | Deploy | OPA Gatekeeper, Kyverno | K8s misconfigs (privileged pods, no limits) |
		  | Runtime | Falco, [[eBPF]], Tetragon | Unexpected process execution, network calls, file writes |
	-
	- ## Secret Management — Never Commit Secrets
		- The #1 DevSecOps rule: **never commit secrets to Git**. API keys, database passwords, certificates, tokens — none of it belongs in source code. Even in a private repo. Even "temporarily."
		- A secret committed to Git is **permanent** — even after deletion, it exists in git history, forks, CI logs, and developer laptops.
		- ```bash title="Trivy — universal security scanner"
		  # Scan a container image for OS + app vulnerabilities
		  trivy image python:3.12-slim
		  trivy image --severity HIGH,CRITICAL myapp:latest
		  
		  # Scan source code / filesystem
		  trivy fs .
		  trivy fs --scanners vuln,secret,misconfig .
		  
		  # Scan Kubernetes cluster
		  trivy k8s --report summary cluster
		  
		  # Scan Terraform / Helm IaC
		  trivy config ./terraform/
		  trivy config ./helm-charts/
		  
		  # CI output — fail pipeline on critical vulnerabilities
		  trivy image --exit-code 1 --severity CRITICAL myapp:latest
		  
		  # Generate SBOM (Software Bill of Materials)
		  trivy image --format cyclonedx --output sbom.json myapp:latest
		  ```
		- | Secret Management Tool | Where Secrets Live | Best For |
		  |----------------------|-------------------|---------|
		  | **HashiCorp Vault** | Vault cluster, dynamic secrets | Enterprise — dynamic DB creds, PKI |
		  | **AWS Secrets Manager** | AWS, auto-rotation | AWS-native applications |
		  | **External Secrets Operator** | Any backend → K8s Secrets | Kubernetes + external vault |
		  | **Sealed Secrets** | Git (encrypted) | [[ArgoCD]] GitOps — safe to commit |
		  | **SOPS** | Git (encrypted with KMS) | IaC secrets, Helm values |
		  | **Doppler / Infisical** | SaaS platform | Teams wanting simple UX |
- # SRE — Site Reliability Engineering
  collapsed:: true
	- ## What is SRE
		- SRE is Google's answer to the question: "How do you scale operations when you can't linearly scale the ops team?" Ben Treynor Sloss invented it around 2003 — hire software engineers and give them operational responsibility. The result: they automate everything instead of doing it manually.
		- The key difference between SRE and traditional Ops: SRE teams have a **toil budget** (maximum 50% of time on manual work) and an **error budget** (allowed unreliability). Both are enforced.
		- The Google SRE books are free online — they're among the most influential engineering documents ever written.
	-
	- ## Incident Management
		- When production breaks, a structured response process reduces MTTR (Mean Time to Restore) and prevents chaos.
		- ```mermaid
		  graph TD
		      DETECT["🚨 DETECT\nAlert fires\nCustomer report\nSynthetic monitor fails"]
		      TRIAGE["🔍 TRIAGE\nHow bad is it?\nWhat's affected?\nWho owns it?"]
		      DECLARE["📢 DECLARE\nCreate incident channel\nAssign Incident Commander\nNotify stakeholders"]
		      MITIGATE["🛠️ MITIGATE\nRestore service FIRST\nRollback / Feature flag off\nScale up / Reroute traffic"]
		      INVESTIGATE["🔬 INVESTIGATE\nFind root cause\nWhile service is stable"]
		      RESOLVE["✅ RESOLVE\nClose incident\nPost-mortem scheduled"]
		      POSTMORTEM["📝 POST-MORTEM\nBlameless analysis\nTimeline\nAction items"]
		      DETECT --> TRIAGE --> DECLARE --> MITIGATE --> INVESTIGATE --> RESOLVE --> POSTMORTEM
		  ```
		- The golden rule: **mitigate first, investigate second**. A rolled-back deploy that ends an incident in 10 minutes beats 2 hours of debugging with users down.
		- **Blameless post-mortems** are essential. When engineers fear blame, they hide information, don't take risks, and incidents recur. Blameless means: the system failed, not the person. Find the systemic issue.
	-
	- ## Toil — What It Is and Why to Eliminate It
		- **Toil** is manual, repetitive, automatable operational work that scales linearly with service growth. Restarting crashed pods manually, provisioning accounts by hand, running SQL migrations via SSH.
		- Toil is not "bad work" — it's work that should eventually not exist. SRE caps toil at 50% of team time. The rest goes to engineering work that permanently reduces future toil.
		- ```
		  Toil Test — Ask these questions:
		  ─────────────────────────────────────────────────────────
		  Manual?         → Is it triggered by a human every time?
		  Repetitive?     → Do you do it more than once?
		  Automatable?    → Could a machine do this exactly?
		  No lasting value? → Does it leave the system better? Or just running?
		  Scales with load? → Does it grow as your service grows?
		  
		  If yes to most → it's toil → automate it, eliminate it
		  ```
	-
	- ## DORA Metrics — Measuring DevOps Performance
		- DORA (DevOps Research and Assessment) identified four metrics that distinguish elite engineering teams from low performers. Nicole Forsgren's research (published in *Accelerate*, 2018) proved these metrics predict organizational performance.
		- | Metric | Elite | High | Medium | Low |
		  |--------|-------|------|--------|-----|
		  | **Deployment Frequency** | Multiple/day | Weekly | Monthly | Every 6 months |
		  | **Lead Time for Changes** | < 1 hour | 1 day – 1 week | 1 week – 1 month | 1 – 6 months |
		  | **MTTR** (restore time) | < 1 hour | < 1 day | 1 – 7 days | 1 – 6 months |
		  | **Change Failure Rate** | 0 – 15% | 0 – 15% | 16 – 30% | 46 – 60% |
		- These metrics are **leading indicators** — improving them predicts better business outcomes (profitability, market share, customer satisfaction).
- # Platform Engineering
  collapsed:: true
	- ## What is Platform Engineering
		- Platform Engineering is the next evolution after DevOps. Instead of every team building their own CI/CD pipelines, Terraform modules, and observability setup, a dedicated **Platform Engineering team** builds an **Internal Developer Platform (IDP)** — a self-service layer that gives developers everything they need to deploy, monitor, and operate their services without deep infrastructure knowledge.
		- The analogy: DevOps is teaching every developer to cook. Platform Engineering is building a restaurant kitchen where developers just place orders.
	-
	- ## Golden Paths
		- A **Golden Path** is the recommended, supported, opinionated way to do something — deploy an app, set up monitoring, manage secrets. It's called "golden" because it's paved and maintained, not because it's the only way.
		- ```
		  Without Golden Path (every team reinvents):
		  Team A: Jenkins + custom Bash + manual Terraform
		  Team B: GitHub Actions + Helm + manual kubectl
		  Team C: CircleCI + Docker Compose + SSH deployment
		  Result: 3 ways to deploy, 3 incident runbooks, 3 security reviews
		  
		  With Golden Path:
		  Every team: GitHub Actions template → standard Helm chart → ArgoCD
		  Result: 1 deployment system, 1 runbook, 1 security review → 10× faster onboarding
		  ```
	-
	- ## DORA Metrics for Platform Teams
		- Platform teams measure success differently — their "users" are internal developers:
		- | Metric | What It Measures |
		  |--------|----------------|
		  | **Onboarding time** | How long to first deployment for a new service |
		  | **Golden Path adoption** | % of teams using standard platform |
		  | **Developer NPS** | How satisfied devs are with the platform |
		  | **Time to production** | Idea → running in prod for a new feature |
		  | **Incident MTTR** | How fast platform issues are resolved |
- # Cloud & IaC Ecosystem
  collapsed:: true
	- | Cloud | Native CI/CD | IaC Tool | Container Registry | K8s Service | Serverless |
	  |-------|-------------|---------|-------------------|------------|-----------|
	  | **AWS** | CodePipeline / CodeBuild | CloudFormation / CDK | ECR | EKS | Lambda |
	  | **GCP** | Cloud Build | Deployment Manager / Config Connector | Artifact Registry | GKE | Cloud Run |
	  | **Azure** | [[Azure DevOps]] Pipelines | ARM / Bicep / Terraform | ACR | AKS | Azure Functions |
	  | **DigitalOcean** | App Platform | Terraform | DOCR | DOKS | Functions |
	-
	- ## Workflow Orchestration
		- [[kestra]] is the open-source, declarative workflow orchestration platform for data, infra, and AI pipelines. YAML-first, 1400+ plugins, GitOps-native. Covers the orchestration gap between simple CI/CD (run on code push) and complex multi-step workflows (ETL, infra automation, AI pipelines).
		- Use it for: running [[Ansible]] playbooks on a schedule, triggering Terraform plans from events, data ingestion pipelines, and AI model retraining workflows.
		- → Full reference including triggers, parallel tasks, error handling, retries: [[kestra]]
	-
	- ## Project Management Tools
		- [[Jira]] — issue tracking, sprint planning, and roadmapping used widely in DevOps teams. Deep integrations with [[GitHub Actions]], [[Jenkins]], and [[GitLab CI]] for build status, deployment tracking, and incident tickets.
		- [[Trello]] — simple Kanban boards, great for small teams or personal task tracking.
		- [[Asana]] — structured project management with timelines, dependencies, and workload views.
- # More Learn
	- ## Books — Essential Reading
		- [The Phoenix Project — Gene Kim](https://www.amazon.com/Phoenix-Project-DevOps-Helping-Business/dp/1942788290) — The novel that explains DevOps through a fictional IT disaster. Read this first.
		- [The DevOps Handbook — Kim, Humble, Willis, Debois](https://www.amazon.com/DevOps-Handbook-World-Class-Reliability-Organizations/dp/1950508404) — Practical patterns and case studies.
		- [Accelerate — Nicole Forsgren](https://www.amazon.com/Accelerate-Software-Performing-Technology-Organizations/dp/1942788339) — Science behind DORA metrics.
		- [Google SRE Book (free)](https://sre.google/sre-book/table-of-contents/) — How Google runs production at scale.
		- [Continuous Delivery — Humble & Farley](https://www.amazon.com/Continuous-Delivery-Deployment-Automation-Addison-Wesley/dp/0321601912) — The CI/CD bible.
	-
	- ## Github & Webs
		- [DevOps Roadmap](https://github.com/milanm/DevOps-Roadmap) — Visual learning path for DevOps engineers.
		- [CNCF Landscape](https://landscape.cncf.io) — Every cloud-native tool categorized and mapped.
		- [The Twelve-Factor App](https://12factor.net) — Methodology for building cloud-native applications.
		- [Kubernetes Documentation](https://kubernetes.io/docs/) — Official K8s reference.
		- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
		- [Prometheus Documentation](https://prometheus.io/docs/)
		- [Google SRE Workbook (free)](https://sre.google/workbook/table-of-contents/) — Practical implementation of SRE.
	-
	- ## Explore Further
		- DevOps does not exist in isolation — it is the connective tissue between almost every other engineering discipline. Here is where to go next based on what you want to deepen.
		-
		- **The OS layer underneath everything** — every container, every cron job, and every CI runner sits on Linux. [[Linux Advanced]] covers kernel internals, namespaces, cgroups (the building blocks of containers), performance tuning with `perf`, and security hardening with SELinux and AppArmor. If you want to understand *why* `kubectl exec` works the way it does, start there.
		-
		- **The glue that holds pipelines together** — most CI steps are [[Shell Script]] under the hood. Bash scripting, text processing with `awk`/`sed`, job control, and process management are skills that pay off in every pipeline you write.
		-
		- **Configuring what Terraform creates** — once [[Infrastructure as Code IaC]] provisions your servers, [[Ansible]] configures them: installing packages, deploying apps, managing systemd services, and rotating secrets with Ansible Vault. [[SaltStack]] takes a more reactive approach — event-driven config that responds to infrastructure changes automatically.
		-
		- **GitOps in depth** — [[ArgoCD]] is how mature teams implement continuous delivery for Kubernetes. Git becomes the source of truth; every merge to main automatically reconciles the cluster. Covers Application CRDs, the App-of-Apps pattern, and handling secrets safely in GitOps workflows.
		-
		- **Your CI/CD toolbox** — [[GitHub Actions]] is the modern default for GitHub-hosted projects (reusable workflows, matrix builds, OIDC auth). [[GitLab CI]] is its equal for GitLab shops with stronger built-in environments. [[Jenkins]] is the veteran — more complex to operate but unmatched in plugin depth and flexibility. [[Circle CI]], [[Travis CI]], [[Bamboo]], and [[TeamCity]] each serve specific team needs covered in their own pages.
		-
		- **Security in every pipeline stage** — [[Cybersecurity]] covers the threat models and defense principles that motivate every DevSecOps check. [[Cybersecurity Architecture]] goes deeper into Zero Trust network design, IAM, and SIEM/SOAR — the enterprise security layer that DevOps pipelines must integrate with.
		-
		- **Kernel-level observability** — [[eBPF]] is how Falco, Cilium, and Tetragon hook into the kernel to detect runtime threats and network anomalies without any application changes. It is increasingly the standard for production security and observability in Kubernetes environments.
		-
		- **The CI/CD concepts themselves** — [[Continuous Integration]] and [[Continuous Delivery]] each have dedicated pages explaining the principles, practices, and tradeoffs in depth — not just the tools.
		-
		- **When your pipelines need to orchestrate complex multi-step workflows** — [[Automation]] covers scripting patterns, task scheduling, and [[kestra]] which handles ETL pipelines, infrastructure automation jobs, and AI workflows that outgrow simple CI/CD.
		-
		- **The architecture DevOps serves** — [[System Design]] is the bigger picture: how to design the systems these pipelines deploy. [[System Design - Microservices]] shows the architecture that makes independent deployment so critical. [[System Design - Scalability & CAP]] explains why horizontal scaling (which IaC automates) exists.
		-
		- **Keeping your team in sync** — [[Jira]] tracks sprint work and incident tickets, integrates with every CI tool listed above, and is where action items from post-mortems land. [[Trello]] and [[Asana]] serve lighter planning needs. [[Azure DevOps]] is Microsoft's all-in-one: Boards, Repos, Pipelines, Artifacts, and Test Plans under one roof.
	- ## Master Playlists YouTube
		- [DevOps Roadmap — TechWorld with Nana](https://www.youtube.com/results?search_query=devops+full+course+techworld+nana)
		- [Docker Full Course](https://www.youtube.com/results?search_query=docker+full+course+techworld+nana)
		- [Kubernetes Full Course](https://www.youtube.com/results?search_query=kubernetes+full+course+techworld+nana)
		- [Terraform Full Course](https://www.youtube.com/results?search_query=terraform+full+course+beginners)
		- [GitHub Actions CI/CD](https://www.youtube.com/results?search_query=github+actions+cicd+full+course)
		- [ArgoCD GitOps Tutorial](https://www.youtube.com/results?search_query=argocd+gitops+kubernetes+tutorial)
		- [Prometheus + Grafana Monitoring](https://www.youtube.com/results?search_query=prometheus+grafana+kubernetes+monitoring+full+course)
		- [SRE — Google Site Reliability Engineering](https://www.youtube.com/results?search_query=site+reliability+engineering+google+sre+full)
		- [DevSecOps Full Pipeline](https://www.youtube.com/results?search_query=devsecops+pipeline+full+course)