---
seoTitle: Infrastructure as Code (IaC) – Complete Guide to Terraform, Ansible, Pulumi & Cloud Automation
description: "Complete Infrastructure as Code reference covering Terraform, Ansible, Pulumi, CloudFormation, state management, modules, workspaces, CI/CD integration, GitOps, secret handling, and IaC best practices. Beginner to advanced."
keywords: "infrastructure as code, IaC, Terraform, Ansible, Pulumi, CloudFormation, Bicep, configuration management, cloud automation, GitOps, state management, Terraform modules, Ansible roles, DevOps, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Infrastructure as Code (IaC)
enableToc: true
---

> [!info] About This Page
> Infrastructure as Code is the practice of managing and provisioning infrastructure through **machine-readable definition files** instead of manual processes or interactive tools.
> It is the foundation of modern [[DevOps]] — without IaC, consistent, repeatable, scalable infrastructure is impossible.
> This page covers both **provisioning** (creating infrastructure) and **configuration management** (configuring what's on it), with deep dives into Terraform and [[Ansible]].

- # History & Why IaC Exists
  collapsed:: true
	- ## The Problem IaC Solved
		- Before IaC, servers were **hand-crafted**. A sysadmin would SSH into a server, install packages, edit config files, tweak settings — and write little to nothing down. Over months these servers accumulated undocumented changes, hotfixes, and workarounds. Every server became unique, fragile, and impossible to reproduce.
		- This was called the **Snowflake Server** problem — like snowflakes, every server was unique. Rebuilding one after a crash meant hours or days of archaeology: what packages, what versions, what settings? Scaling meant manually duplicating that process on new machines.
		- **Configuration drift** made it worse: servers that started identical gradually diverged as different people applied different patches, rotated different configs, and made different emergency fixes. "It works in staging but not production" was often caused by drift between environments.
		- The answer was to treat infrastructure the same way software teams treat code — write it down, version it, review it, test it, and automate it. The term "Infrastructure as Code" was popularized by Kief Morris in his 2016 book of the same name, but the practice predates it with tools like CFEngine (1993), Puppet (2005), and Chef (2009).
		- [[Ansible]] (2012), Terraform (2014), and Pulumi (2017) refined the approach further — simpler, more declarative, more cloud-native. Today IaC is table stakes for any serious engineering team.
	-
	- ## The IaC Timeline
		- ```mermaid
		  timeline
		      title Infrastructure as Code Evolution
		      1993 : CFEngine — first config management tool
		      2005 : Puppet — declarative Ruby DSL for server config
		      2009 : Chef — procedural Ruby cookbooks
		           : AWS CloudFormation — cloud IaC begins
		      2012 : Ansible — agentless YAML, SSH-based
		           : SaltStack — event-driven, minion-master model
		      2014 : Terraform — multi-cloud HCL, state-based
		      2016 : "Infrastructure as Code" book — Kief Morris
		      2017 : Pulumi — IaC with real programming languages
		      2019 : Terraform Cloud — managed state + remote runs
		      2022 : OpenTofu — open-source Terraform fork (community)
		      2024 : AI-assisted IaC — Copilot generating Terraform/Ansible
		  ```
-
- # Introduction
  collapsed:: true
	- IaC is not just about automation — it's about **applying software engineering discipline to infrastructure**. That means version control, code review, testing, CI/CD, and documentation — for your servers, networks, and cloud resources just as much as your application code.
	-
	- ## IaC Knowledge Map
	  collapsed:: true
		- ```mermaid
		  mindmap
		    root((IaC))
		      Provisioning Tools
		        Terraform
		        Pulumi
		        CloudFormation
		        Azure Bicep / ARM
		        CDK
		      Configuration Management
		        Ansible
		        SaltStack
		        Puppet
		        Chef
		      Concepts
		        Declarative vs Imperative
		        Idempotency
		        State Management
		        Immutable Infrastructure
		        Drift Detection
		      Patterns
		        Modules & Reuse
		        Environments
		        Workspaces
		        Remote State
		        Secrets Management
		      Integration
		        CI/CD Pipelines
		        GitOps
		        Policy as Code
		        Testing IaC
		  ```
	-
	- ## Declarative vs Imperative Explained
		- This is the most important concept in IaC. Every tool falls into one of these two models:
		- **Declarative** — you describe the **desired end state**. The tool figures out how to get there. You say "I want 3 EC2 instances of type t3.medium." The tool compares current state to desired state and makes the diff happen. This is what Terraform, CloudFormation, Ansible (mostly), and Kubernetes manifests use.
		- **Imperative** — you describe the **steps to take**. You say "Run apt install nginx. Then copy this config. Then restart the service." Chef and classic shell scripts are imperative.
		- ```
		  Declarative (Terraform):             Imperative (Shell Script):
		  ─────────────────────────            ────────────────────────────
		  resource "aws_instance" "web" {      # create instance
		    ami           = "ami-abc123"        aws ec2 run-instances \
		    instance_type = "t3.medium"           --image-id ami-abc123 \
		    count         = 3                     --instance-type t3.medium \
		  }                                       --count 3
		                                       # check if it worked
		  # Run terraform apply again:         # wait for running state
		  # → Does nothing if 3 already exist  # get instance IDs
		  # → Creates/destroys to match count  # tag each one
		                                       # etc...
		  ```
		- Declarative is superior for infrastructure because it is **idempotent** — running it again when the state already matches is a no-op. Imperative scripts often break if run twice ("package already installed" errors, duplicate entries, etc.).
	-
	- ## Idempotency — The Core Guarantee
		- An operation is idempotent if running it **once produces the same result as running it 10 times**. IaC tools guarantee this: if your infrastructure already matches your config, applying it again changes nothing.
		- This property is what makes IaC safe to run in CI/CD pipelines automatically — you don't need to track whether something was already done.
		- > [!tip] Idempotency Test
		  > Run your IaC twice in a row. The second run should report zero changes. If it does — it's idempotent. If it tries to create or modify things again — it's not, and you have a bug.
	-
	- ## Immutable Infrastructure
		- Traditional approach: **mutable** — servers are patched and updated in place. Drift accumulates. "I just quickly fixed that one server" becomes the root cause of tomorrow's incident.
		- Modern approach: **immutable** — servers are never changed after deployment. To update, you build a new image (AMI or Docker image), roll out new instances, and terminate the old ones. No drift. No "what changed on that server?"
		- This is why containers ([[DevOps]] — Containers section) pair so naturally with IaC — containers are immutable by design.
		- | Mutable Infra | Immutable Infra |
		  |--------------|----------------|
		  | SSH in and patch | Build new image, roll out |
		  | Drift accumulates | Always starts clean |
		  | Hard to reproduce | Fully reproducible |
		  | "Works on server 3 but not server 4" | All servers identical |
		  | Chef/Puppet manage ongoing state | Terraform + Packer/Docker |
-
- # Terraform — Deep Reference
  collapsed:: true
	- ## How Terraform Works
		- Terraform is the most widely used cloud provisioning tool. It speaks to cloud provider APIs (AWS, GCP, Azure, Kubernetes, GitHub, Datadog, and 3000+ others via **providers**) to create, update, and destroy resources.
		- The workflow is: write HCL config → `terraform plan` (see what changes) → `terraform apply` (make it happen). Terraform keeps a **state file** that maps your HCL resources to real-world objects. This state is the source of truth for what Terraform manages.
		- Terraform integrates with [[DevOps]] CI/CD pipelines, [[Ansible]] for post-provisioning config, and [[ArgoCD]] for GitOps delivery flows.
		- ```mermaid
		  graph LR
		      HCL["HCL Config Files\n*.tf"]
		      Plan["terraform plan\nDiff: desired vs actual"]
		      State["State File\nterraform.tfstate\nactual ↔ resource mapping"]
		      Apply["terraform apply\nCalls provider APIs"]
		      Cloud["☁️ Cloud APIs\nAWS · GCP · Azure · K8s"]
		      HCL --> Plan
		      State --> Plan
		      Plan --> Apply --> Cloud
		      Cloud --> State
		  ```
	-
	- ## Core Workflow Commands
		- ```bash title="Terraform CLI — complete reference"
		  # ── Initialization ────────────────────────────────────────────────
		  terraform init                    # download providers + modules, init backend
		  terraform init -upgrade           # upgrade providers to latest allowed version
		  terraform init -reconfigure       # force backend reconfiguration
		  
		  # ── Formatting & Validation ────────────────────────────────────────
		  terraform fmt                     # auto-format all .tf files (run in CI)
		  terraform fmt -check              # fail if files need formatting (CI lint step)
		  terraform validate                # check syntax + provider schema
		  
		  # ── Planning ──────────────────────────────────────────────────────
		  terraform plan                    # show what will change
		  terraform plan -out=tfplan        # save plan to file (use in CI)
		  terraform plan -var="env=prod"    # pass variable inline
		  terraform plan -var-file=prod.tfvars   # load variables from file
		  terraform plan -target=aws_instance.web  # plan only one resource
		  
		  # ── Applying ──────────────────────────────────────────────────────
		  terraform apply                   # apply changes (prompts for approval)
		  terraform apply tfplan            # apply saved plan (no prompt — CI safe)
		  terraform apply -auto-approve     # skip prompt (CI/CD only)
		  terraform apply -target=aws_instance.web  # apply only one resource
		  
		  # ── State Management ──────────────────────────────────────────────
		  terraform state list              # list all managed resources
		  terraform state show aws_instance.web    # inspect a specific resource
		  terraform state rm aws_instance.old      # stop managing a resource (don't delete)
		  terraform state mv aws_instance.old aws_instance.new  # rename in state
		  terraform import aws_s3_bucket.my bucket-name  # import existing resource
		  
		  # ── Workspaces (environments) ─────────────────────────────────────
		  terraform workspace list
		  terraform workspace new staging
		  terraform workspace select production
		  terraform workspace show
		  
		  # ── Destroy ───────────────────────────────────────────────────────
		  terraform destroy                 # destroy all managed resources
		  terraform destroy -target=aws_instance.web   # destroy one resource
		  
		  # ── Outputs ───────────────────────────────────────────────────────
		  terraform output                  # print all outputs
		  terraform output instance_ip      # print specific output
		  terraform output -json            # JSON format (for scripts)
		  ```
	-
	- ## HCL Language — Complete Reference
		- ```hcl title="terraform_full_reference.tf — all key HCL patterns"
		  # ══ Terraform block ═══════════════════════════════════════════════
		  terraform {
		    required_version = ">= 1.6.0"
		  
		    required_providers {
		      aws = {
		        source  = "hashicorp/aws"
		        version = "~> 5.0"        # allow 5.x, not 6.x
		      }
		      random = {
		        source  = "hashicorp/random"
		        version = "~> 3.0"
		      }
		    }
		  
		    # Remote state — always use for teams
		    backend "s3" {
		      bucket         = "company-terraform-state"
		      key            = "prod/myapp/terraform.tfstate"
		      region         = "us-east-1"
		      dynamodb_table = "terraform-locks"   # prevents concurrent applies
		      encrypt        = true                # encrypt state at rest
		    }
		  }
		  
		  # ══ Provider ══════════════════════════════════════════════════════
		  provider "aws" {
		    region = var.aws_region
		  
		    # Tags applied to all resources automatically
		    default_tags {
		      tags = {
		        Project     = var.project_name
		        Environment = var.environment
		        ManagedBy   = "terraform"
		        Owner       = "platform-team"
		      }
		    }
		  }
		  
		  # ══ Variables ═════════════════════════════════════════════════════
		  variable "environment" {
		    type        = string
		    description = "Deployment environment (dev/staging/prod)"
		    validation {
		      condition     = contains(["dev", "staging", "prod"], var.environment)
		      error_message = "Environment must be dev, staging, or prod."
		    }
		  }
		  
		  variable "instance_type" {
		    type    = string
		    default = "t3.medium"
		  }
		  
		  variable "allowed_cidr_blocks" {
		    type    = list(string)
		    default = ["10.0.0.0/8"]
		  }
		  
		  variable "tags" {
		    type    = map(string)
		    default = {}
		  }
		  
		  # ══ Locals — computed values ═══════════════════════════════════════
		  locals {
		    name_prefix     = "${var.project_name}-${var.environment}"
		    is_production   = var.environment == "prod"
		    common_tags     = merge(var.tags, {
		      CreatedAt = timestamp()
		    })
		    azs = slice(data.aws_availability_zones.available.names, 0, 3)
		  }
		  
		  # ══ Data Sources — read existing resources ═════════════════════════
		  data "aws_availability_zones" "available" {
		    state = "available"
		  }
		  
		  data "aws_ami" "ubuntu" {
		    most_recent = true
		    owners      = ["099720109477"]  # Canonical
		    filter {
		      name   = "name"
		      values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
		    }
		  }
		  
		  # ══ Resources ═════════════════════════════════════════════════════
		  # VPC
		  resource "aws_vpc" "main" {
		    cidr_block           = "10.0.0.0/16"
		    enable_dns_hostnames = true
		    tags                 = { Name = "${local.name_prefix}-vpc" }
		  }
		  
		  # Multiple subnets with count
		  resource "aws_subnet" "public" {
		    count             = 3
		    vpc_id            = aws_vpc.main.id
		    cidr_block        = cidrsubnet("10.0.0.0/16", 8, count.index)
		    availability_zone = local.azs[count.index]
		    tags              = { Name = "${local.name_prefix}-public-${count.index}" }
		  }
		  
		  # Conditional resource — only create in prod
		  resource "aws_cloudwatch_metric_alarm" "high_cpu" {
		    count               = local.is_production ? 1 : 0
		    alarm_name          = "${local.name_prefix}-high-cpu"
		    comparison_operator = "GreaterThanThreshold"
		    threshold           = 80
		    evaluation_periods  = 2
		    metric_name         = "CPUUtilization"
		    namespace           = "AWS/EC2"
		    period              = 120
		    statistic           = "Average"
		  }
		  
		  # Dynamic blocks — generate repeated nested blocks
		  resource "aws_security_group" "web" {
		    name   = "${local.name_prefix}-web-sg"
		    vpc_id = aws_vpc.main.id
		  
		    dynamic "ingress" {
		      for_each = [80, 443, 8080]
		      content {
		        from_port   = ingress.value
		        to_port     = ingress.value
		        protocol    = "tcp"
		        cidr_blocks = ["0.0.0.0/0"]
		      }
		    }
		  }
		  
		  # ══ Outputs ═══════════════════════════════════════════════════════
		  output "vpc_id"       { value = aws_vpc.main.id }
		  output "subnet_ids"   { value = aws_subnet.public[*].id }
		  output "ami_id"       {
		    value     = data.aws_ami.ubuntu.id
		    sensitive = false
		  }
		  ```
	-
	- ## Modules — Reusable Infrastructure Components
		- Modules are the **functions of Terraform** — encapsulate a pattern once, reuse it everywhere. A module is just a directory of `.tf` files with defined inputs (variables) and outputs.
		- ```
		  project/
		  ├── main.tf              ← root module
		  ├── variables.tf
		  ├── outputs.tf
		  └── modules/
		      ├── vpc/             ← VPC module
		      │   ├── main.tf
		      │   ├── variables.tf
		      │   └── outputs.tf
		      ├── eks/             ← Kubernetes cluster module
		      │   └── main.tf
		      └── rds/             ← Database module
		          └── main.tf
		  ```
		- ```hcl title="Using modules in root main.tf"
		  # Reuse the VPC module
		  module "vpc" {
		    source      = "./modules/vpc"    # local module
		    environment = var.environment
		    cidr_block  = "10.0.0.0/16"
		  }
		  
		  # Use a public registry module (Terraform Registry)
		  module "eks" {
		    source  = "terraform-aws-modules/eks/aws"
		    version = "~> 20.0"
		  
		    cluster_name    = "${local.name_prefix}-cluster"
		    cluster_version = "1.29"
		    vpc_id          = module.vpc.vpc_id
		    subnet_ids      = module.vpc.private_subnet_ids
		  }
		  ```
	-
	- ## State Management — The Most Critical Concept
		- The state file is what makes Terraform work — it maps your `.tf` resources to real cloud objects. Without it, Terraform has no idea what it created last time. Mismanaging state is the most common source of serious Terraform problems.
		- > [!warning] Never Do These With State
		  > Never commit `terraform.tfstate` to Git — it contains sensitive values (passwords, keys).
		  > Never edit the state file manually — use `terraform state` commands.
		  > Never run `terraform apply` from two places simultaneously without a state lock — race conditions corrupt state.
		- ```hcl title="backend.tf — remote state with locking"
		  terraform {
		    backend "s3" {
		      bucket         = "company-terraform-state"
		      key            = "${var.environment}/myapp/terraform.tfstate"
		      region         = "us-east-1"
		      dynamodb_table = "terraform-state-lock"  # prevents concurrent applies
		      encrypt        = true
		    }
		  }
		  
		  # ── Create the state bucket + lock table (bootstrap) ─────────────
		  # Run this once manually before using the S3 backend:
		  # aws s3api create-bucket --bucket company-terraform-state --region us-east-1
		  # aws dynamodb create-table \
		  #   --table-name terraform-state-lock \
		  #   --attribute-definitions AttributeName=LockID,AttributeType=S \
		  #   --key-schema AttributeName=LockID,KeyType=HASH \
		  #   --billing-mode PAY_PER_REQUEST
		  ```
	-
	- ## Terraform in CI/CD Pipelines
		- Running Terraform in [[DevOps]] pipelines requires care: plan output should be reviewed on PRs, apply should only run on merge to main, and credentials should come from short-lived OIDC tokens (not long-lived secret keys).
		- ```yaml title=".github/workflows/terraform.yml — production pipeline"
		  name: Terraform CI/CD
		  
		  on:
		    push:
		      branches: [main]
		      paths: ["terraform/**"]
		    pull_request:
		      paths: ["terraform/**"]
		  
		  permissions:
		    id-token: write     # for OIDC auth to AWS
		    contents: read
		    pull-requests: write
		  
		  jobs:
		    terraform:
		      runs-on: ubuntu-latest
		      defaults:
		        run:
		          working-directory: terraform/
		  
		      steps:
		        - uses: actions/checkout@v4
		  
		        # Authenticate to AWS using OIDC — no long-lived credentials
		        - uses: aws-actions/configure-aws-credentials@v4
		          with:
		            role-to-assume: arn:aws:iam::123456789:role/TerraformGitHubActions
		            aws-region: us-east-1
		  
		        - uses: hashicorp/setup-terraform@v3
		          with:
		            terraform_version: "1.7.0"
		  
		        - run: terraform init
		        - run: terraform fmt -check
		        - run: terraform validate
		  
		        - name: Terraform plan
		          id: plan
		          run: terraform plan -no-color -out=tfplan
		          continue-on-error: true    # don't fail — post result to PR
		  
		        # Post plan output as PR comment
		        - uses: actions/github-script@v7
		          if: github.event_name == 'pull_request'
		          with:
		            script: |
		              const output = `#### Terraform Plan 📋\n\`\`\`\n${{ steps.plan.outputs.stdout }}\n\`\`\``;
		              github.rest.issues.createComment({
		                issue_number: context.issue.number,
		                owner: context.repo.owner,
		                repo: context.repo.repo,
		                body: output
		              });
		  
		        # Apply only on push to main
		        - name: Terraform apply
		          if: github.event_name == 'push' && github.ref == 'refs/heads/main'
		          run: terraform apply -auto-approve tfplan
		  ```
-
- # Ansible — Configuration Management Deep Reference
  collapsed:: true
	- ## How Ansible Works
		- [[Ansible]] is agentless — it connects to remote servers via SSH (or WinRM for Windows), runs tasks, and disconnects. Nothing to install on the target server beyond Python and SSH. This makes it easy to adopt incrementally: pick any fleet of servers and start managing them.
		- Ansible's execution model: **inventory** (which servers) → **playbook** (what to do) → **tasks** (individual steps) → **modules** (built-in operations: apt, copy, service, template, etc.). The result is pushed from a control node; there's no daemon running on managed hosts.
		- Combined with Terraform in the typical stack: Terraform provisions infrastructure, Ansible configures it. Terraform creates the EC2 instances; Ansible installs nginx, deploys the app, and configures systemd. This two-tool pattern is described in [[DevOps]] and [[Automation]].
	-
	- ## Inventory — Defining Your Fleet
		- ```ini title="inventory/production.ini — static inventory"
		  # Groups of servers
		  [webservers]
		  web1.company.com  ansible_user=ubuntu
		  web2.company.com  ansible_user=ubuntu
		  192.168.1.10      ansible_port=2222  ansible_user=admin
		  
		  [dbservers]
		  db1.company.com   ansible_user=postgres
		  db2.company.com
		  
		  [loadbalancers]
		  lb1.company.com
		  
		  # Group of groups
		  [production:children]
		  webservers
		  dbservers
		  loadbalancers
		  
		  # Variables for the whole group
		  [webservers:vars]
		  nginx_port=80
		  app_version=2.1.4
		  ```
		- ```yaml title="inventory/production.yml — dynamic inventory (AWS)"
		  # ansible-inventory -i aws_ec2.yml --list  → queries AWS API live
		  plugin: aws_ec2
		  regions:
		    - us-east-1
		    - eu-west-1
		  filters:
		    tag:Environment: production
		    instance-state-name: running
		  keyed_groups:
		    - prefix: tag
		      key: tags.Role         # auto-creates groups: tag_Role_web, tag_Role_db
		  hostnames:
		    - ip-address
		  ```
	-
	- ## Playbooks — Complete Patterns
		- ```yaml title="site.yml — production full-stack playbook"
		  ---
		  # ── Play 1: Common setup on all servers ──────────────────────────
		  - name: Common configuration
		    hosts: all
		    become: true
		    gather_facts: true    # collect OS, IP, memory info (facts)
		  
		    tasks:
		      - name: Set timezone to UTC
		        community.general.timezone:
		          name: UTC
		  
		      - name: Install common packages
		        package:
		          name:
		            - curl
		            - vim
		            - htop
		            - unzip
		            - fail2ban
		          state: present
		  
		      - name: Disable root SSH login
		        lineinfile:
		          path:   /etc/ssh/sshd_config
		          regexp: '^PermitRootLogin'
		          line:   'PermitRootLogin no'
		          state:  present
		        notify: restart sshd
		  
		      - name: Set up NTP time sync
		        service:
		          name:    systemd-timesyncd
		          state:   started
		          enabled: true
		  
		    handlers:
		      - name: restart sshd
		        service:
		          name:  sshd
		          state: reloaded
		  
		  # ── Play 2: Web server setup ──────────────────────────────────────
		  - name: Configure web servers
		    hosts: webservers
		    become: true
		  
		    vars:
		      app_dir:  /opt/myapp
		      app_user: deploy
		      app_port: 8000
		  
		    pre_tasks:
		      - name: Ensure app user exists
		        user:
		          name:   "{{ app_user }}"
		          system: true
		          shell:  /sbin/nologin
		  
		    tasks:
		      - name: Install nginx
		        apt:
		          name:         nginx
		          state:        present
		          update_cache: true
		  
		      - name: Write nginx config from template
		        template:
		          src:  templates/nginx.conf.j2
		          dest: /etc/nginx/sites-available/myapp
		          mode: "0644"
		        notify: reload nginx
		  
		      - name: Enable site
		        file:
		          src:   /etc/nginx/sites-available/myapp
		          dest:  /etc/nginx/sites-enabled/myapp
		          state: link
		        notify: reload nginx
		  
		      - name: Deploy application (rolling update)
		        block:
		          - name: Pull latest Docker image
		            community.docker.docker_image:
		              name:   "ghcr.io/company/myapp:{{ app_version }}"
		              source: pull
		  
		          - name: Restart container
		            community.docker.docker_container:
		              name:          myapp
		              image:         "ghcr.io/company/myapp:{{ app_version }}"
		              state:         started
		              restart:       true
		              ports:
		                - "{{ app_port }}:8000"
		        rescue:
		          - name: Rollback on failure
		            community.docker.docker_container:
		              name:    myapp
		              image:   "ghcr.io/company/myapp:{{ previous_version }}"
		              state:   started
		              restart: true
		  
		    handlers:
		      - name: reload nginx
		        service:
		          name:  nginx
		          state: reloaded
		  
		  # ── Play 3: Database servers ──────────────────────────────────────
		  - name: Configure database servers
		    hosts: dbservers
		    become: true
		    roles:
		      - role: geerlingguy.postgresql
		        vars:
		          postgresql_version:  16
		          postgresql_databases:
		            - name: myapp_prod
		          postgresql_users:
		            - name:     myapp
		              password: "{{ vault_db_password }}"   # from ansible-vault
		  ```
	-
	- ## Roles — Reusable Ansible Components
		- Roles are Ansible's equivalent of Terraform modules — a structured way to package tasks, templates, variables, and handlers into a reusable unit. A role for "nginx setup" can be dropped into any playbook.
		- ```
		  roles/
		  └── nginx/
		      ├── tasks/
		      │   └── main.yml        ← task list
		      ├── handlers/
		      │   └── main.yml        ← handlers (e.g., reload nginx)
		      ├── templates/
		      │   └── nginx.conf.j2   ← Jinja2 templates
		      ├── files/
		      │   └── ssl_params.conf ← static files
		      ├── vars/
		      │   └── main.yml        ← role variables (high precedence)
		      ├── defaults/
		      │   └── main.yml        ← default values (lowest precedence)
		      └── meta/
		          └── main.yml        ← role dependencies
		  ```
		- ```bash title="Ansible utility commands"
		  # Install roles from Ansible Galaxy (community marketplace)
		  ansible-galaxy install geerlingguy.nginx
		  ansible-galaxy install -r requirements.yml
		  
		  # Dry-run (check mode) — shows what would change, doesn't change anything
		  ansible-playbook site.yml --check --diff
		  
		  # Run with verbose output for debugging
		  ansible-playbook site.yml -vvv
		  
		  # Limit to specific hosts or groups
		  ansible-playbook site.yml --limit web1.company.com
		  ansible-playbook site.yml --limit webservers
		  
		  # Run only tasks with specific tags
		  ansible-playbook site.yml --tags deploy,nginx
		  
		  # Ansible Vault — encrypt sensitive variables
		  ansible-vault create secrets.yml
		  ansible-vault edit secrets.yml
		  ansible-vault encrypt_string 'db_password_here' --name 'vault_db_password'
		  
		  # Ad-hoc — quick operations without a playbook
		  ansible all -m ping
		  ansible webservers -m shell -a "df -h"
		  ansible webservers -m service -a "name=nginx state=restarted" --become
		  ```
-
- # Other IaC Tools
  collapsed:: true
	- ## Pulumi — IaC with Real Programming Languages
		- Pulumi lets you write infrastructure using **Python, TypeScript, Go, Java, or C#** instead of a domain-specific language like HCL. For teams already fluent in these languages, it removes the HCL learning curve and enables real abstractions, loops, conditions, and testing frameworks.
		- The tradeoff: more power means more complexity. A 5-line HCL resource can become 20 lines of TypeScript. And your IaC is now subject to the same bugs, lint failures, and testing requirements as your application code — which is both a feature and a burden.
		- ```python title="__main__.py — Pulumi Python example"
		  import pulumi
		  import pulumi_aws as aws
		  
		  # Variables
		  config = pulumi.Config()
		  env    = config.require("environment")
		  
		  # VPC
		  vpc = aws.ec2.Vpc("main",
		      cidr_block           = "10.0.0.0/16",
		      enable_dns_hostnames = True,
		      tags = {"Name": f"{env}-vpc", "ManagedBy": "pulumi"}
		  )
		  
		  # Multiple subnets using a loop (try doing this cleanly in HCL)
		  subnets = []
		  for i, az in enumerate(["us-east-1a", "us-east-1b", "us-east-1c"]):
		      subnet = aws.ec2.Subnet(f"public-{i}",
		          vpc_id            = vpc.id,
		          cidr_block        = f"10.0.{i}.0/24",
		          availability_zone = az,
		      )
		      subnets.append(subnet)
		  
		  # Export outputs
		  pulumi.export("vpc_id",    vpc.id)
		  pulumi.export("subnet_ids", [s.id for s in subnets])
		  ```
	-
	- ## CloudFormation & CDK
		- **AWS CloudFormation** is AWS's native IaC service — JSON or YAML templates that describe AWS resources. No external tooling needed; runs directly in AWS. The downside: verbose syntax, slow feedback, AWS-only.
		- **AWS CDK (Cloud Development Kit)** generates CloudFormation from TypeScript, Python, or Java code. Better developer experience than raw CloudFormation, still AWS-only. The CDK approach is similar to Pulumi but outputs CloudFormation under the hood.
		- For multi-cloud or cloud-agnostic needs, Terraform or Pulumi are better choices. For teams fully committed to AWS, CDK offers the best developer experience.
	-
	- ## SaltStack — Event-Driven Configuration
		- [[SaltStack]] is more than configuration management — it's an event-driven automation platform. Salt minions (agents on managed nodes) subscribe to a Salt master. When infrastructure changes (a new server boots, a file changes, a service crashes), Salt can react automatically.
		- Where [[Ansible]] is pull-and-push (you trigger it), SaltStack is reactive (it can trigger itself). This makes it powerful for large fleets where waiting for human-triggered runs is too slow.
-
- # IaC Best Practices
  collapsed:: true
	- ## The Golden Rules
		- **Everything in Git** — no Terraform runs from a developer's laptop in production, no ad-hoc Ansible runs that aren't tracked. All changes go through Git, reviewed, and applied by CI/CD. This is the intersection of IaC and [[DevOps]] GitOps principles.
		- **Remote state with locking** — never use local state files for shared infrastructure. S3 + DynamoDB (AWS), GCS (GCP), or Terraform Cloud. Always.
		- **Separate state per environment** — dev, staging, and production should have completely separate state files and ideally separate cloud accounts. A Terraform bug in dev should not be able to touch production state.
		- **Never commit secrets** — use [[Ansible]] Vault, SOPS, or pull from HashiCorp Vault / AWS Secrets Manager at apply time. See the [[Continuous Monitoring & Logging]] page for audit logging of secret access.
		- **Pin versions** — pin provider versions (`~> 5.0`), module versions, and Terraform CLI versions. Unpinned dependencies break randomly when providers release breaking changes.
	-
	- ## Testing IaC
		- IaC can and should be tested — catching a Terraform misconfiguration before it reaches production is far cheaper than an outage.
		- | Test Type | Tool | What It Tests |
		  |-----------|------|--------------|
		  | **Lint / Format** | `terraform fmt -check`, `tflint` | Syntax, style, provider rules |
		  | **Validate** | `terraform validate` | Schema correctness |
		  | **Static Analysis** | Checkov, tfsec, Trivy | Security misconfigs, CIS benchmarks |
		  | **Unit Test** | Terratest (Go), pytest-terraform | Logic in modules |
		  | **Integration Test** | Terratest, Kitchen-Terraform | Actually provision + verify + destroy |
		- ```bash title="tfsec + Checkov — static security scanning"
		  # tfsec: security scanner for Terraform
		  tfsec .
		  tfsec . --format json | jq '.results[] | select(.severity == "HIGH")'
		  
		  # Checkov: multi-framework IaC security scanner
		  checkov -d .                          # scan Terraform directory
		  checkov -f playbook.yml --framework ansible  # scan Ansible
		  checkov -d k8s-manifests/ --framework kubernetes
		  
		  # Both integrate into GitHub Actions for PR blocking
		  ```
	-
	- ## Policy as Code — Guardrails
		- As IaC scales across many teams, you need **automated guardrails** — rules that prevent dangerous configurations from ever being applied. "Production must have deletion_protection=true on databases. No public S3 buckets. All EC2s must have tags." Policy as Code enforces these automatically.
		- **Sentinel** (Terraform Cloud/Enterprise) — policies written in Sentinel DSL that run during `terraform plan`, before `apply`.
		- **OPA (Open Policy Agent)** — general-purpose policy engine using Rego language. Works with Terraform plan JSON output, Kubernetes admission, and more.
		- **Checkov** — also doubles as policy enforcement, not just scanning.
-
- # More Learn
	- ## Books & Docs
		- [Terraform Documentation — HashiCorp](https://developer.hashicorp.com/terraform/docs) — official, best reference
		- [Ansible Documentation](https://docs.ansible.com/) — official reference
		- [Infrastructure as Code — Kief Morris (O'Reilly)](https://infrastructure-as-code.com/) — the definitive book
		- [Terraform: Up & Running — Yevgeniy Brikman](https://www.terraformupandrunning.com/) — practical Terraform patterns
		- [The Pulumi Book](https://www.pulumi.com/docs/)
	-
	- ## YouTube
		- [Terraform Full Course — FreeCodeCamp](https://www.youtube.com/results?search_query=terraform+full+course+freecodecamp)
		- [Ansible Full Course — TechWorld with Nana](https://www.youtube.com/results?search_query=ansible+full+course+techworld+nana)
		- [Pulumi Getting Started](https://www.youtube.com/results?search_query=pulumi+getting+started+python)
	-
	- ## Explore Further
	  collapsed:: true
		- IaC touches almost every other engineering discipline — you provision the infrastructure, then everything else runs on top of it.
		-
		- **The pipeline that runs your IaC** — [[DevOps]] is where Terraform plans and Ansible playbooks get automated: triggered on every pull request, reviewed via plan output comments, and applied on merge to main. The GitOps section of [[DevOps]] shows how teams move from `terraform apply` on laptops to fully automated, auditable pipelines.
		-
		- **Ansible in full depth** — this page covers Ansible patterns, but [[Ansible]] has a dedicated page with the complete reference: all core modules, variable precedence, Jinja2 templating, tags, dynamic inventory, Ansible Tower/AWX, and real-world role examples.
		-
		- **Event-driven configuration at scale** — [[SaltStack]] takes a different approach from Ansible's push model: minion agents subscribe to a Salt master and react to events — a new server boots, a file changes, a service crashes. For large fleets where waiting for human-triggered runs is too slow, SaltStack is the right tool.
		-
		- **Scripting that lives inside your IaC** — [[Automation]] covers the Makefile patterns, bash templates, and Python scripts that wrap Terraform and Ansible in a developer-friendly interface. The `user_data` scripts in your EC2 instances and the bootstrap scripts in your Ansible roles are the [[Shell Script]] patterns from that page in practice.
		-
		- **The OS layer your IaC configures** — [[Linux Advanced]] is what Ansible is actually doing under the hood: managing systemd units, configuring kernel parameters with `sysctl`, hardening SSH, and setting up AppArmor profiles. Understanding Linux internals makes you dramatically better at writing Ansible tasks.
		-
		- **What you're monitoring after provisioning** — [[Continuous Monitoring & Logging]] covers Prometheus, Grafana, ELK, and OpenTelemetry — the observability stack that watches the infrastructure you provisioned with IaC. Good IaC includes provisioning the monitoring stack itself.
		-
		- **The services running on your infrastructure** — [[Microservices Architecture]] explains the distributed application architecture that Kubernetes (provisioned by your Terraform code) is designed to run. Understanding microservices makes IaC design decisions — network topology, service accounts, secret management — make much more sense.
		-
		- **Why you're building this infrastructure** — [[System Design]] is the architectural layer above IaC: the decisions about databases, caches, load balancers, and regions that your Terraform modules implement. [[System Design Scalability & CAP]] explains the horizontal scaling theory that IaC automates.
		-
		- **Security controls your IaC must enforce** — [[Cybersecurity Architecture]] covers Zero Trust network design, IAM least-privilege, and compliance frameworks (SOC 2, PCI DSS, CIS benchmarks). Everything in that page eventually gets implemented as Terraform resources, security group rules, and IAM policies.
		-
		- **The CI tools that run your IaC pipelines** — [[GitHub Actions]] has the native OIDC integration with AWS/GCP/Azure that makes credential-less Terraform runs possible. [[GitLab CI]] offers the same with GitLab's CI/CD environments for multi-stage plan/apply workflows.