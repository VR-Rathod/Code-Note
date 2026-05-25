---
date: 2026-05-18T10:12:55+05:30
lastmod: 2026-05-18T10:12:55+05:30

seoTitle: Kestra – Open Source Declarative Workflow Orchestration Platform
description: "Comprehensive notes on Kestra — the open-source, event-driven, language-agnostic workflow orchestration platform for data pipelines, infrastructure automation, and AI workflows."
keywords: "kestra, workflow orchestration, declarative orchestration, YAML workflows, data pipeline, event-driven workflow, open source orchestration, kestra.io, ETL orchestration, infrastructure automation, AI workflow, kestra vs airflow, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Kestra – One Platform to Run & Control All Your Workflows
enableToc: true
---

> [!info] About This Page
> **Kestra** is the open-source, declarative, event-driven orchestration platform for data, AI, and infrastructure workflows.
> GitHub: [kestra-io/kestra](https://github.com/kestra-io/kestra) · Website: [kestra.io](https://kestra.io) · Docs: [kestra.io/docs](https://kestra.io/docs)
> 1400+ plugins · SOC 2 Certified · Built for enterprise scale

---

- # What Is Kestra?
  collapsed:: true
	- Kestra is a **universal workflow orchestration engine** — write workflows in YAML, run tasks in any language, trigger by events, schedule by cron, and observe everything from one place.
	-
	- ## Core Philosophy
	  collapsed:: true
		- > [!tip] Kestra's Design Principle
		  > **Fewer tools to maintain. Fewer scripts to debug. Fewer dependencies between teams.**
		  > One place to see what's running across your company.
		- | Philosophy | What It Means |
		  |------------|--------------|
		  | Declarative | Write WHAT you want (YAML), not HOW to do it |
		  | Language-agnostic | Python, Bash, Node.js, Go, or containers — no lock-in |
		  | Event-driven | Cron, webhooks, messages, API triggers — all in one engine |
		  | API-first | Everything controllable via REST API |
		  | GitOps-native | CI/CD pipelines for workflow deployment |
	-
	- ## Three Core Use Cases
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Kestra["⚡ Kestra Platform"]
		      D["📊 Data Workflows\nIngestion · dbt · Airbyte · Spark\n10x faster pipeline delivery\n90% fewer manual backfills"]
		      I["🔧 Infrastructure Automation\nTerraform · Ansible · CI/CD\n6x faster infra delivery\n90% lower legacy tooling cost"]
		      A["🤖 AI Workflows\nAgents · RAG · Eval · Retraining\n50x less pipeline maintenance\n3x faster AI delivery cycles"]
		      Kestra --> D
		      Kestra --> I
		      Kestra --> A
		  ```
-
- # Core Concepts
  collapsed:: true
	- ## Workflow = Flow in Kestra
	  collapsed:: true
		- A **flow** is the fundamental unit in Kestra — a YAML file defining tasks, triggers, and their relationships.
		- ```yaml
		  id: my-first-workflow
		  namespace: company.team
		  description: "Basic ETL pipeline example"
		  
		  # Triggers — when to run this flow
		  triggers:
		    - id: daily-schedule
		      type: io.kestra.plugin.core.trigger.Schedule
		      cron: "0 9 * * *"    # Every day at 9am
		  
		  # Tasks — what to do
		  tasks:
		    - id: extract-data
		      type: io.kestra.plugin.scripts.python.Script
		      script: |
		        import requests
		        data = requests.get("https://api.example.com/data").json()
		        print(data)
		  
		    - id: transform-data
		      type: io.kestra.plugin.scripts.python.Script
		      script: |
		        # Transform logic here
		        print("Transforming...")
		  
		    - id: load-data
		      type: io.kestra.plugin.jdbc.postgresql.Query
		      sql: "INSERT INTO table SELECT * FROM staging"
		  ```
	-
	- ## Key Concepts Table
	  collapsed:: true
		- | Concept | Description |
		  |---------|-------------|
		  | **Flow** | A workflow definition — YAML file with tasks and triggers |
		  | **Task** | A single unit of work (run script, call API, query DB) |
		  | **Trigger** | What starts a flow — schedule, webhook, event, message queue |
		  | **Namespace** | Logical grouping for flows — like folders (e.g., `company.team`) |
		  | **Execution** | A single run of a flow — has a unique ID and full trace |
		  | **Plugin** | Integrations — 1400+ available (AWS, GCP, dbt, Airbyte, Slack, etc.) |
		  | **Blueprint** | Pre-built flow templates for common use cases |
		  | **Tenant** | Isolated environment for multi-tenancy (Enterprise) |
	-
	- ## Task Execution Model
	  collapsed:: true
		- ```mermaid
		  graph LR
		      Trigger["⚡ Trigger\nSchedule / Event / Webhook / API"]
		      Executor["🧠 Executor\nTask scheduling + coordination"]
		      Worker["⚙️ Worker\nActual task execution\n(isolated, scalable)"]
		      Storage["📦 Internal Storage\nPass outputs between tasks"]
		      Logs["📋 Execution Logs\nFull trace per task"]
		      Trigger -->|"Start execution"| Executor
		      Executor -->|"Dispatch task"| Worker
		      Worker -->|"Output data"| Storage
		      Worker -->|"Logs"| Logs
		      Storage -->|"Inputs for next task"| Worker
		  ```
-
- # Triggers — How Flows Start
  collapsed:: true
	- ## Trigger Types
	  collapsed:: true
		- | Trigger Type | YAML Type | Use Case |
		  |-------------|-----------|----------|
		  | Schedule (Cron) | `core.trigger.Schedule` | Run daily ETL at 2am |
		  | Webhook | `core.trigger.Webhook` | GitHub push triggers CI flow |
		  | Message Queue | `kafka.trigger.Consume` | Process Kafka messages |
		  | Flow completion | `core.trigger.Flow` | Chain flows together |
		  | File detection | `fs.trigger.Listen` | New file in S3 triggers pipeline |
		  | API call | REST API | Manual or external system trigger |
	-
	- ## Schedule Examples
	  collapsed:: true
		- ```yaml
		  triggers:
		    # Every day at midnight
		    - id: daily
		      type: io.kestra.plugin.core.trigger.Schedule
		      cron: "0 0 * * *"
		  
		    # Every 15 minutes
		    - id: frequent
		      type: io.kestra.plugin.core.trigger.Schedule
		      cron: "*/15 * * * *"
		  
		    # First Monday of each month
		    - id: monthly
		      type: io.kestra.plugin.core.trigger.Schedule
		      cron: "0 9 * * 1#1"
		  
		    # Webhook — POST to trigger
		    - id: webhook
		      type: io.kestra.plugin.core.trigger.Webhook
		      key: "secret-key-here"
		  ```
-
- # Task Types & Patterns
  collapsed:: true
	- ## Running Code in Any Language
	  collapsed:: true
		- ```yaml
		  tasks:
		    # Python script
		    - id: python-task
		      type: io.kestra.plugin.scripts.python.Script
		      script: |
		        import pandas as pd
		        df = pd.read_csv("data.csv")
		        print(df.head())
		  
		    # Bash / Shell
		    - id: bash-task
		      type: io.kestra.plugin.scripts.shell.Script
		      script: |
		        echo "Hello from Bash"
		        curl -X POST https://api.example.com/webhook
		  
		    # Node.js
		    - id: node-task
		      type: io.kestra.plugin.scripts.node.Script
		      script: |
		        const axios = require('axios');
		        const data = await axios.get('https://api.example.com');
		        console.log(data.data);
		  
		    # Docker container
		    - id: docker-task
		      type: io.kestra.plugin.scripts.runner.docker.Docker
		      containerImage: "python:3.11"
		      commands:
		        - python -c "print('Running in Docker')"
		  ```
	-
	- ## Parallel Execution
	  collapsed:: true
		- ```yaml
		  tasks:
		    # Run multiple tasks in parallel
		    - id: parallel-ingest
		      type: io.kestra.plugin.core.flow.Parallel
		      tasks:
		        - id: ingest-source-a
		          type: io.kestra.plugin.scripts.python.Script
		          script: |
		            print("Ingesting from source A")
		  
		        - id: ingest-source-b
		          type: io.kestra.plugin.scripts.python.Script
		          script: |
		            print("Ingesting from source B")
		  
		        - id: ingest-source-c
		          type: io.kestra.plugin.scripts.python.Script
		          script: |
		            print("Ingesting from source C")
		  
		    # All 3 run at the same time, next task waits for all to finish
		    - id: merge-results
		      type: io.kestra.plugin.scripts.python.Script
		      script: |
		        print("All sources ingested, merging...")
		  ```
	-
	- ## Sequential Flow with Error Handling
	  collapsed:: true
		- ```yaml
		  tasks:
		    - id: risky-task
		      type: io.kestra.plugin.scripts.python.Script
		      script: |
		        # This might fail
		        raise Exception("Simulated failure")
		  
		  errors:
		    # On failure — create a Jira ticket
		    - id: alert-on-failure
		      type: io.kestra.plugin.jira.issues.Create
		      domain: "yourcompany.atlassian.net"
		      username: "{{ secret('JIRA_USER') }}"
		      apiToken: "{{ secret('JIRA_TOKEN') }}"
		      projectKey: "OPS"
		      summary: "Workflow {{ flow.id }} failed"
		      description: "Execution {{ execution.id }} failed at task {{ task.id }}"
		  ```
	-
	- ## Conditional Execution
	  collapsed:: true
		- ```yaml
		  tasks:
		    - id: check-data-quality
		      type: io.kestra.plugin.scripts.python.Script
		      script: |
		        row_count = 1000
		        print(row_count)
		  
		    - id: branch-on-quality
		      type: io.kestra.plugin.core.flow.If
		      condition: "{{ outputs['check-data-quality'].vars.row_count > 500 }}"
		      then:
		        - id: proceed-to-load
		          type: io.kestra.plugin.scripts.python.Script
		          script: print("Data quality OK — proceeding")
		      else:
		        - id: alert-bad-data
		          type: io.kestra.plugin.slack.IncomingWebhook
		          url: "{{ secret('SLACK_WEBHOOK') }}"
		          payload: |
		            { "text": "Data quality failed — row count too low" }
		  ```
-
- # Plugin Ecosystem
  collapsed:: true
	- > [!info] 1400+ Plugins
	  > Kestra has one of the largest plugin ecosystems of any workflow orchestration tool.
	  > [Browse all plugins at kestra.io/plugins](https://kestra.io/plugins)
	-
	- ## Plugin Categories
	  collapsed:: true
		- | Category | Key Plugins |
		  |----------|------------|
		  | **Cloud — AWS** | S3 · Redshift · Lambda · Glue · Athena · ECR · ECS · EventBridge · Batch |
		  | **Cloud — GCP** | BigQuery · Dataflow · Cloud Storage · Pub/Sub · Dataproc |
		  | **Cloud — Azure** | Blob Storage · Data Factory · Event Hub · Synapse |
		  | **Data** | dbt · Airbyte · Spark · Flink · DuckDB · Polars · Pandas |
		  | **Databases** | PostgreSQL · MySQL · MongoDB · Redis · Elasticsearch · Snowflake |
		  | **Messaging** | Kafka · RabbitMQ · NATS · AWS SQS · Azure Service Bus · Pulsar |
		  | **Dev Tools** | GitHub · GitLab · Jira · Slack · PagerDuty · Zendesk |
		  | **Infra** | Terraform · Ansible · Kubernetes · Docker · Helm |
		  | **AI / ML** | OpenAI · LangChain · Pinecone · Vertex AI · Hugging Face |
		  | **Scripts** | Python · Bash · Node.js · Go · R · Julia |
	-
	- ## Plugin Usage Example — dbt + Airbyte + Postgres
	  collapsed:: true
		- ```yaml
		  id: full-etl-pipeline
		  namespace: data.production
		  
		  tasks:
		    # Step 1 — Sync data from source using Airbyte
		    - id: airbyte-sync
		      type: io.kestra.plugin.airbyte.connections.Sync
		      connectionId: "your-airbyte-connection-id"
		      url: "http://airbyte:8006"
		  
		    # Step 2 — Run dbt transformations
		    - id: dbt-run
		      type: io.kestra.plugin.dbt.cli.DbtCLI
		      commands:
		        - dbt run --project-dir dbt_project
		        - dbt test --project-dir dbt_project
		  
		    # Step 3 — Verify row counts in Postgres
		    - id: verify-load
		      type: io.kestra.plugin.jdbc.postgresql.Query
		      url: "{{ secret('POSTGRES_URL') }}"
		      sql: "SELECT COUNT(*) as row_count FROM public.transformed_data"
		  
		    # Step 4 — Alert Slack on completion
		    - id: notify-success
		      type: io.kestra.plugin.slack.IncomingWebhook
		      url: "{{ secret('SLACK_WEBHOOK') }}"
		      payload: |
		        { "text": "ETL pipeline completed: {{ outputs['verify-load'].rows[0]['row_count'] }} rows loaded" }
		  ```
-
- # Governance & Reliability
  collapsed:: true
	- ## Reliability Features
	  collapsed:: true
		- | Feature | How to Use |
		  |---------|-----------|
		  | **Retries** | `retry: maxAttempts: 3` per task — automatic retry on failure |
		  | **Timeouts** | `timeout: PT30M` — kill task after 30 min |
		  | **SLAs** | Alert if flow takes longer than expected |
		  | **Concurrent limits** | Control max parallel executions per flow |
		  | **Backfill** | Re-run past failed executions with original data |
		- ```yaml
		  tasks:
		    - id: reliable-task
		      type: io.kestra.plugin.scripts.python.Script
		      retry:
		        type: constant
		        maxAttempts: 3
		        interval: PT30S    # Wait 30s between retries
		      timeout: PT10M       # Fail task if it runs > 10 minutes
		      script: |
		        # Your resilient task code here
		        print("Running with retry + timeout protection")
		  ```
	-
	- ## Enterprise Governance Features
	  collapsed:: true
		- ```mermaid
		  graph TD
		      SSO["🔐 SSO Integration\nOkta · Azure AD · LDAP"]
		      RBAC["👥 RBAC\nRole-based access control\nNamespace-level permissions"]
		      Audit["📋 Audit Logs\nAll user actions logged\nImmutable history"]
		      MT["🏢 Multi-Tenancy\nIsolated environments per team\nSeparate quotas + namespaces"]
		      IW["🔒 Isolated Workers\nDedicated task runners\nAir-gapped environments"]
		      SSO --> RBAC --> Audit
		      MT --> IW
		  ```
	-
	- ## Security Best Practices
	  collapsed:: true
		- > [!warning] Never Hardcode Secrets
		  > Always use Kestra's Secrets system — never put credentials in YAML files.
		- ```yaml
		  # WRONG — never do this
		  tasks:
		    - id: bad-example
		      type: io.kestra.plugin.jdbc.postgresql.Query
		      url: "postgresql://user:PASSWORD123@host:5432/db"
		  
		  # CORRECT — use secrets
		  tasks:
		    - id: good-example
		      type: io.kestra.plugin.jdbc.postgresql.Query
		      url: "{{ secret('POSTGRES_URL') }}"
		  
		  # Secrets stored in:
		  #  → Kestra's built-in secrets store
		  #  → AWS Secrets Manager
		  #  → Azure Key Vault
		  #  → HashiCorp Vault
		  #  → GCP Secret Manager
		  ```
-
- # Deployment Options
  collapsed:: true
	- ## Editions Comparison
	  collapsed:: true
		- | Edition | Deployment | Key Features | Price |
		  |---------|-----------|--------------|-------|
		  | **Open Source** | Self-hosted (Docker / K8s) | Full core platform, all 1400+ plugins | Free forever |
		  | **Enterprise** | Self-hosted / Hybrid / Air-gapped | SSO, RBAC, audit logs, multi-tenancy, isolated workers, SLA support | Contact sales |
		  | **Cloud** | Fully managed by Kestra | Fastest time to value, production-ready, auto-scaling | Request access |
	-
	- ## Docker Compose Quick Start
	  collapsed:: true
		- ```yaml
		  # docker-compose.yml — Kestra + Postgres
		  version: "3"
		  services:
		    postgres:
		      image: postgres:15
		      environment:
		        POSTGRES_DB: kestra
		        POSTGRES_USER: kestra
		        POSTGRES_PASSWORD: k3str4
		      volumes:
		        - postgres-data:/var/lib/postgresql/data
		  
		    kestra:
		      image: kestra/kestra:latest
		      pull_policy: always
		      entrypoint: /bin/bash
		      command: -c 'kestra server standalone'
		      environment:
		        KESTRA_CONFIGURATION: |
		          datasources:
		            postgres:
		              url: jdbc:postgresql://postgres:5432/kestra
		              username: kestra
		              password: k3str4
		      ports:
		        - "8080:8080"    # Kestra UI
		        - "8081:8081"    # Kestra API
		      depends_on:
		        - postgres
		  
		  volumes:
		    postgres-data:
		  ```
		- ```bash
		  # Start Kestra
		  docker-compose up -d
		  
		  # Access UI at http://localhost:8080
		  # Access API at http://localhost:8081
		  ```
	-
	- ## Kubernetes Deployment
	  collapsed:: true
		- ```bash
		  # Add Kestra Helm chart
		  helm repo add kestra https://helm.kestra.io
		  helm repo update
		  
		  # Install with custom values
		  helm install kestra kestra/kestra \
		    --set configuration.kestra.datasources.postgres.url=jdbc:postgresql://postgres:5432/kestra \
		    --set configuration.kestra.datasources.postgres.username=kestra \
		    --set configuration.kestra.datasources.postgres.password=your-password
		  
		  # Scale workers independently from the executor
		  kubectl scale deployment kestra-worker --replicas=5
		  ```
-
- # CI/CD & GitOps
  collapsed:: true
	- ## Git-Driven Workflow Deployment
	  collapsed:: true
		- > [!tip] Treat Workflows as Code
		  > Store all Kestra flow YAML files in Git. Use CI/CD to deploy them automatically.
		- ```yaml
		  # .github/workflows/deploy-kestra.yml
		  name: Deploy Kestra Flows
		  
		  on:
		    push:
		      branches: [main]
		  
		  jobs:
		    deploy:
		      runs-on: ubuntu-latest
		      steps:
		        - uses: actions/checkout@v3
		  
		        - name: Deploy flows to Kestra
		          uses: kestra-io/deploy-action@master
		          with:
		            resource: flow
		            directory: ./flows
		            namespace: company.production
		            server: ${{ secrets.KESTRA_HOSTNAME }}
		            user: ${{ secrets.KESTRA_USER }}
		            password: ${{ secrets.KESTRA_PASSWORD }}
		  ```
	-
	- ## API-First Control
	  collapsed:: true
		- ```bash
		  # Trigger a flow execution via API
		  curl -X POST \
		    http://localhost:8081/api/v1/executions/company.team/my-workflow \
		    -H "Content-Type: application/json" \
		    -d '{"key": "value"}'
		  
		  # List all executions
		  curl http://localhost:8081/api/v1/executions?namespace=company.team
		  
		  # Get execution details
		  curl http://localhost:8081/api/v1/executions/{executionId}
		  
		  # Pause a running execution
		  curl -X POST \
		    http://localhost:8081/api/v1/executions/{executionId}/pause
		  ```
-
- # Kestra vs Alternatives
  collapsed:: true
	- ## Kestra vs Apache Airflow
	  collapsed:: true
		- | Dimension | Kestra | Apache Airflow |
		  |-----------|--------|----------------|
		  | Workflow language | YAML (declarative) | Python (imperative) |
		  | Learning curve | Low — any YAML editor works | High — Python + Airflow concepts |
		  | Code/UI | Both — YAML + full UI in sync | Code-first, limited UI |
		  | Language support | Any (Python, Bash, Node.js, Go, containers) | Python-centric |
		  | Event-driven | Native | Requires plugins/workarounds |
		  | Plugin ecosystem | 1400+ built-in | 3rd party providers, inconsistent |
		  | Scaling workers | Independent horizontal scaling | Complex worker scaling |
		  | Multi-tenancy | Built-in (Enterprise) | External solutions needed |
		  | Self-hosted | Yes — Docker or K8s | Yes — more complex setup |
	-
	- ## Kestra vs n8n
	  collapsed:: true
		- | Dimension | Kestra | n8n |
		  |-----------|--------|-----|
		  | Primary user | Data/Platform engineers | Non-technical users |
		  | Workflow definition | YAML (code) | Visual drag-and-drop |
		  | Scale | Enterprise, millions of executions | Mid-scale automation |
		  | Data pipelines | First-class (ETL, dbt, Spark) | Limited |
		  | Infrastructure automation | First-class (Terraform, Ansible) | Limited |
		  | Observability | Deep execution tracing, SLAs | Basic logs |
-
- # Real-World Use Case Patterns
  collapsed:: true
	- ## Pattern 1 — Daily ETL Pipeline
	  collapsed:: true
		- ```mermaid
		  graph LR
		      T["⏰ Cron Trigger\n2:00 AM daily"]
		      E["📥 Extract\nAPI → raw S3 bucket"]
		      Tr["🔄 Transform\nPython/Polars → clean data"]
		      L["📤 Load\nPostgres / Snowflake / BigQuery"]
		      V["✅ Validate\nRow counts · null checks"]
		      N["🔔 Notify\nSlack success / failure"]
		      T --> E --> Tr --> L --> V --> N
		  ```
	-
	- ## Pattern 2 — Event-Driven Incident Response
	  collapsed:: true
		- ```mermaid
		  graph LR
		      Alert["🚨 PagerDuty Alert\nor monitoring webhook"]
		      Assess["🔍 Assess Impact\nQuery metrics · check dashboards"]
		      Decision["🤔 Decision\nSeverity level?"]
		      Auto["🤖 Auto-remediate\nRestart service · scale up"]
		      Escalate["📢 Escalate to Human\nCreate Jira · Page on-call"]
		      Alert --> Assess --> Decision
		      Decision -->|"Low severity"| Auto
		      Decision -->|"High severity"| Escalate
		  ```
	-
	- ## Pattern 3 — AI Pipeline (RAG System)
	  collapsed:: true
		- ```yaml
		  id: rag-pipeline
		  namespace: ai.production
		  
		  tasks:
		    # Step 1 — Scrape new documents
		    - id: fetch-documents
		      type: io.kestra.plugin.scripts.python.Script
		      script: |
		        # Fetch new docs from knowledge base
		        docs = fetch_new_documents()
		  
		    # Step 2 — Chunk + Embed (parallel)
		    - id: embed-parallel
		      type: io.kestra.plugin.core.flow.EachParallel
		      value: "{{ outputs['fetch-documents'].vars.doc_ids }}"
		      tasks:
		        - id: embed-doc
		          type: io.kestra.plugin.scripts.python.Script
		          script: |
		            from openai import OpenAI
		            client = OpenAI()
		            embedding = client.embeddings.create(...)
		  
		    # Step 3 — Store in vector DB
		    - id: store-embeddings
		      type: io.kestra.plugin.scripts.python.Script
		      script: |
		        # Store in Pinecone / Qdrant / pgvector
		        store_embeddings(embeddings)
		  
		    # Step 4 — Evaluate retrieval quality
		    - id: evaluate-rag
		      type: io.kestra.plugin.scripts.python.Script
		      script: |
		        # Run RAGAS evaluation metrics
		        score = evaluate_retrieval()
		        print(f"RAG score: {score}")
		  ```
-
- # More Learn
  collapsed:: true
	- ## Github & Webs
	  collapsed:: true
		- [Kestra Official Site](https://kestra.io)
		- [GitHub — kestra-io/kestra](https://github.com/kestra-io/kestra)
		- [Kestra Documentation](https://kestra.io/docs)
		- [Plugin Directory — 1400+ plugins](https://kestra.io/plugins)
		- [Blueprints — Pre-built workflow templates](https://kestra.io/blueprints)
		- [Kestra Blog](https://kestra.io/blogs)
		- [Kestra Academy — Free courses](https://academy.kestra.io)
		- [Kestra vs Airflow Comparison](https://kestra.io/vs/airflow)
		- [Kestra Slack Community](https://kestra.io/slack)
		- [Kestra API Reference](https://kestra.io/docs/api-reference)
	-
	- ## Master Playlists YouTube
		- [Kestra Getting Started – Official](https://www.youtube.com/results?search_query=kestra+io+getting+started)
		- [Kestra Tutorial Videos](https://kestra.io/tutorial-videos)
		- [Workflow Orchestration Explained](https://www.youtube.com/results?search_query=workflow+orchestration+kestra+explained)