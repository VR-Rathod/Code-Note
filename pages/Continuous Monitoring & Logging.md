---
seoTitle: Continuous Monitoring & Logging – Complete Guide to Observability, Metrics, Logs & Traces
description: "Complete reference for continuous monitoring and logging covering Prometheus, Grafana, ELK Stack, Loki, OpenTelemetry, distributed tracing, alerting, SLOs, incident response, log management, and production observability patterns."
keywords: "continuous monitoring, logging, observability, Prometheus, Grafana, ELK Stack, Loki, OpenTelemetry, distributed tracing, Jaeger, alerting, SLO, SLI, error budget, log aggregation, metrics, APM, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Continuous Monitoring & Logging
enableToc: true
---

> [!info] About This Page
> Continuous monitoring and logging is the practice of **continuously observing** your running systems to detect problems, understand behavior, and drive improvements — not just after an incident, but constantly.
> It is the feedback loop that closes the [[DevOps]] infinity loop: without monitoring, you are flying blind in production.
> This page covers all three pillars of observability: **metrics** (Prometheus/Grafana), **logs** (ELK/Loki), and **traces** (OpenTelemetry/Jaeger), plus alerting, SLOs, and incident workflows.

- # History & Why It Matters
  collapsed:: true
	- ## How Monitoring Evolved
		- In the early days of computing, monitoring meant a sysadmin periodically running `top` and `df -h` on a server and hoping nothing was on fire. The first automated monitoring tools — Nagios (1999), Zabbix (2001) — checked "is this service up?" with simple ping and port checks.
		- As systems grew more complex, simple up/down checks weren't enough. You needed to know **why** something was slow, **which** of your 200 microservices was the bottleneck, and **what changed** 10 minutes before the incident started.
		- Prometheus (2012, open-sourced 2015) changed metrics collection with its pull-based scraping model and powerful query language (PromQL). Grafana (2014) made visualization beautiful and accessible. The ELK Stack (Elasticsearch + Logstash + Kibana) made centralized log search practical.
		- The **three pillars of observability** — metrics, logs, and traces — became formalized by Peter Bourgon and the broader distributed systems community around 2016–2018. OpenTelemetry (2019) unified instrumentation across all three pillars into one vendor-neutral standard.
		- Today, observability is not optional. The companies that recover from incidents in minutes (vs. hours) are the ones that invested in deep observability.
	-
	- ## Monitoring vs Observability
		- These terms are often used interchangeably but mean different things:
		- **Monitoring** is reactive — you define thresholds on known metrics and alert when they're breached. "Alert when CPU > 90%." You can only ask questions you thought to ask in advance.
		- **Observability** is proactive — the ability to ask **arbitrary questions** about a system's internal state from external outputs, without deploying new code. "Why are 0.3% of requests from users in São Paulo slow on Tuesday evenings?" You can answer questions you didn't anticipate.
		- Monitoring is a subset of observability. A fully observable system is also well-monitored, but a monitored system is not necessarily observable.
- # Introduction
	- Continuous monitoring means your systems are **always** being measured — not just when something breaks. Logs are always being collected. Metrics are always being scraped. Traces are always being captured. And alerts are always watching thresholds.
	- The goal is to make **invisible things visible** — latency percentiles, error rates, queue depths, memory pressure, garbage collection pauses — before they become user-facing problems.
	-
	- ## The Three Pillars of Observability
		- ```mermaid
		  graph TD
		      M["📊 METRICS\nNumerical time-series measurements\nWhat is the system doing right now?\nPrometheus · Grafana · Datadog\nCPU · Memory · Request rate\nError rate · p99 latency"]
		      L["📋 LOGS\nTimestamped event records\nWhat happened and when?\nELK Stack · Loki · Fluentd\nApplication errors · Access logs\nAudit trails · Debug events"]
		      T["🔍 TRACES\nRequest journey across services\nWhere did the time go?\nOpenTelemetry · Jaeger · Tempo\nSpan per service call\nLatency breakdown · Error location"]
		      M -->|"Something is wrong"| Alert["🚨 Detect Problem"]
		      L -->|"What changed?"| Alert
		      T -->|"Where is the bottleneck?"| Alert
		      Alert --> Resolve["✅ Resolve Incident"]
		  ```
		- | Pillar | Question It Answers | Best Tools | When To Use |
		  |--------|--------------------|-----------|----|
		  | **Metrics** | Is the system healthy? How fast? How many errors? | Prometheus, Grafana, Datadog | Dashboards, SLOs, alerting |
		  | **Logs** | What exactly happened? What was the error message? | ELK Stack, Loki, Fluentd, CloudWatch | Debugging, audit, compliance |
		  | **Traces** | Which service was slow? What called what? | OpenTelemetry, Jaeger, Tempo, Zipkin | Microservice debugging, latency analysis |
		- A single incident typically requires all three: metrics tell you **something is wrong**, logs tell you **what happened**, and traces tell you **where in the system** it happened. This is why all three matter — especially in [[Microservices Architecture]] where a single request touches 10+ services.
- # Metrics — Prometheus & Grafana
  collapsed:: true
	- ## How Prometheus Works
		- Prometheus uses a **pull model** — it scrapes `/metrics` HTTP endpoints on your services every 15 seconds (configurable). Services expose their metrics in a simple text format; Prometheus collects and stores them as time-series data.
		- This is the opposite of push-based systems (StatsD, Graphite) where services push metrics to a collector. Pull means Prometheus controls the collection rate, can detect when a scrape target disappears, and doesn't require services to know where the metrics backend is.
		- Every metric in Prometheus is identified by a **name** and a set of **labels** (key-value pairs). Labels are what make PromQL so powerful — you can slice metrics by service, region, version, status code, or any dimension you care about.
		- ```
		  Metric format (exposition format):
		  ─────────────────────────────────────────────────────────────
		  # HELP http_requests_total The total number of HTTP requests
		  # TYPE http_requests_total counter
		  http_requests_total{method="GET",  status="200", service="api"} 47823
		  http_requests_total{method="POST", status="200", service="api"} 12041
		  http_requests_total{method="GET",  status="500", service="api"} 127
		  http_requests_total{method="GET",  status="404", service="api"} 891
		  
		  # HELP http_request_duration_seconds HTTP request duration
		  # TYPE http_request_duration_seconds histogram
		  http_request_duration_seconds_bucket{le="0.1"}  42000
		  http_request_duration_seconds_bucket{le="0.5"}  47000
		  http_request_duration_seconds_bucket{le="1.0"}  47750
		  http_request_duration_seconds_bucket{le="+Inf"} 47823
		  http_request_duration_seconds_sum               9823.4
		  http_request_duration_seconds_count             47823
		  ```
	-
	- ## Metric Types
		- | Type | Description | Use Case | Example |
		  |------|-------------|---------|---------|
		  | **Counter** | Only increases (or resets to 0 on restart) | Request counts, errors, bytes sent | `http_requests_total` |
		  | **Gauge** | Can go up or down | Current value measurements | `memory_bytes_used`, `active_connections` |
		  | **Histogram** | Samples + configurable buckets | Latency distributions, request sizes | `http_request_duration_seconds` |
		  | **Summary** | Percentiles computed at client | Pre-calculated quantiles | `rpc_duration_p99` |
		- > [!tip] Histogram vs Summary
		  > Use **Histogram** almost always — buckets are configurable, percentiles can be calculated server-side with PromQL, and multiple histograms can be aggregated. Summary percentiles are pre-computed client-side and cannot be aggregated across instances.
	-
	- ## Instrumenting Your Application
		- ```python title="metrics.py — Prometheus instrumentation in Python (FastAPI)"
		  from prometheus_client import Counter, Histogram, Gauge, start_http_server
		  from prometheus_fastapi_instrumentator import Instrumentator
		  import time
		  
		  # ── Define metrics ─────────────────────────────────────────────────
		  REQUEST_COUNT = Counter(
		      "http_requests_total",
		      "Total HTTP requests",
		      labelnames=["method", "endpoint", "status_code"]
		  )
		  
		  REQUEST_LATENCY = Histogram(
		      "http_request_duration_seconds",
		      "HTTP request duration in seconds",
		      labelnames=["method", "endpoint"],
		      buckets=[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0]
		  )
		  
		  ACTIVE_REQUESTS = Gauge(
		      "http_requests_active",
		      "Currently active HTTP requests"
		  )
		  
		  DB_QUERY_DURATION = Histogram(
		      "db_query_duration_seconds",
		      "Database query duration",
		      labelnames=["operation", "table"],
		      buckets=[0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1.0]
		  )
		  
		  CACHE_OPERATIONS = Counter(
		      "cache_operations_total",
		      "Cache hit/miss counters",
		      labelnames=["operation", "result"]   # operation=get/set, result=hit/miss
		  )
		  
		  # ── FastAPI middleware (auto-instrument all routes) ─────────────────
		  from fastapi import FastAPI, Request
		  import time
		  
		  app = FastAPI()
		  Instrumentator().instrument(app).expose(app)   # adds /metrics endpoint
		  
		  @app.middleware("http")
		  async def metrics_middleware(request: Request, call_next):
		      start = time.time()
		      ACTIVE_REQUESTS.inc()
		      try:
		          response = await call_next(request)
		          REQUEST_COUNT.labels(
		              method=request.method,
		              endpoint=request.url.path,
		              status_code=response.status_code
		          ).inc()
		          return response
		      finally:
		          REQUEST_LATENCY.labels(
		              method=request.method,
		              endpoint=request.url.path
		          ).observe(time.time() - start)
		          ACTIVE_REQUESTS.dec()
		  
		  # ── Context manager for timing any operation ───────────────────────
		  class timer:
		      def __init__(self, histogram: Histogram, **labels):
		          self.histogram = histogram
		          self.labels    = labels
		          self.start     = None
		  
		      def __enter__(self):
		          self.start = time.time()
		          return self
		  
		      def __exit__(self, *args):
		          self.histogram.labels(**self.labels).observe(time.time() - self.start)
		  
		  # Usage:
		  # with timer(DB_QUERY_DURATION, operation="SELECT", table="users"):
		  #     result = db.query("SELECT * FROM users WHERE id = %s", [user_id])
		  ```
	-
	- ## PromQL — Query Language Deep Reference
		- PromQL is what makes Prometheus powerful. It lets you slice, aggregate, calculate rates, and compute percentiles across millions of time-series data points.
		- ```
		  PromQL Reference:
		  ─────────────────────────────────────────────────────────────────────
		  # ── Selectors ──────────────────────────────────────────────────────
		  http_requests_total                          # all time series for this metric
		  http_requests_total{status="200"}            # filter by label
		  http_requests_total{status=~"2.."}           # regex match (2xx status codes)
		  http_requests_total{status!="200"}           # not equal
		  http_requests_total{status!~"2.."}           # not regex match
		  
		  # ── Range vectors (for rate/increase) ───────────────────────────────
		  http_requests_total[5m]         # last 5 minutes of samples
		  http_requests_total[1h]         # last 1 hour
		  
		  # ── Functions ──────────────────────────────────────────────────────
		  rate(http_requests_total[5m])            # per-second rate over 5 min
		  irate(http_requests_total[5m])           # instantaneous rate (last 2 samples)
		  increase(http_requests_total[1h])        # absolute increase over 1 hour
		  delta(memory_bytes_used[10m])            # change in gauge over 10 min
		  
		  # ── Aggregation ──────────────────────────────────────────────────
		  sum(rate(http_requests_total[5m]))                      # total req/s across all instances
		  sum(rate(http_requests_total[5m])) by (service)         # per service
		  sum(rate(http_requests_total[5m])) without (instance)   # drop instance label
		  avg(memory_bytes_used) by (node)                        # average per node
		  max(cpu_usage_percent)                                   # highest CPU
		  count(up == 1) by (job)                                  # count healthy targets
		  
		  # ── Error rate ────────────────────────────────────────────────────
		  sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
		  /
		  sum(rate(http_requests_total[5m])) by (service)
		  # → fraction of requests that are 5xx errors
		  
		  # ── Latency percentiles from histogram ────────────────────────────
		  histogram_quantile(0.50, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
		  histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
		  histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
		  
		  # ── Multi-target — compare services side by side ──────────────────
		  histogram_quantile(0.99,
		    sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)
		  )
		  ```
	-
	- ## Alerting Rules — Production Examples
		- ```yaml title="alerts/application.yml — comprehensive alert rules"
		  groups:
		    - name: application.rules
		      interval: 30s      # evaluate every 30s (overrides global)
		      rules:
		        # ── High error rate ─────────────────────────────────────────
		        - alert: HighErrorRate
		          expr: |
		            (
		              sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
		              /
		              sum(rate(http_requests_total[5m])) by (service)
		            ) > 0.05
		          for: 5m      # must be true for 5 consecutive minutes before firing
		          labels:
		            severity: critical
		            team:     backend
		          annotations:
		            summary:     "{{ $labels.service }}: error rate {{ $value | humanizePercentage }}"
		            description: "Service {{ $labels.service }} error rate exceeds 5% for 5m."
		            runbook_url: "https://wiki.company.com/runbooks/high-error-rate"
		            dashboard:   "https://grafana.company.com/d/app-overview?var-service={{ $labels.service }}"
		  
		        # ── High latency ──────────────────────────────────────────
		        - alert: HighP99Latency
		          expr: |
		            histogram_quantile(0.99,
		              sum(rate(http_request_duration_seconds_bucket[10m])) by (le, service)
		            ) > 2.0
		          for: 5m
		          labels:
		            severity: warning
		          annotations:
		            summary: "{{ $labels.service }}: p99 latency {{ $value | humanizeDuration }}"
		  
		        # ── Pod crash-looping ─────────────────────────────────────
		        - alert: PodCrashLooping
		          expr: |
		            rate(kube_pod_container_status_restarts_total[15m]) * 60 * 15 > 0
		          for: 5m
		          labels:
		            severity: warning
		          annotations:
		            summary: "Pod {{ $labels.namespace }}/{{ $labels.pod }} crash-looping"
		  
		        # ── SLO burn rate (multi-window, multi-burn-rate) ──────────
		        # Fast burn: consuming error budget 14× faster than sustainable
		        - alert: SLOBurnRateFast
		          expr: |
		            (
		              sum(rate(http_requests_total{status=~"5.."}[1h])) by (service)
		              /
		              sum(rate(http_requests_total[1h])) by (service)
		            ) > 14 * 0.001      # 14× the allowed hourly burn rate (SLO=99.9%)
		          for: 2m
		          labels:
		            severity: critical
		            window:   1h
		          annotations:
		            summary: "{{ $labels.service }}: SLO fast burn — 1h window"
		  
		        # Slow burn: consuming budget over days at 3× sustainable
		        - alert: SLOBurnRateSlow
		          expr: |
		            (
		              sum(rate(http_requests_total{status=~"5.."}[6h])) by (service)
		              /
		              sum(rate(http_requests_total[6h])) by (service)
		            ) > 3 * 0.001
		          for: 15m
		          labels:
		            severity: warning
		            window:   6h
		  ```
	-
	- ## Grafana Dashboards
		- Grafana connects to Prometheus (and 60+ other data sources) and turns PromQL queries into visualizations. The key insight: a dashboard is only as good as your metrics instrumentation. Garbage in, garbage out.
		- ```json title="grafana_dashboard_snippet.json — key panel patterns"
		  {
		    "title": "Service Overview",
		    "panels": [
		      {
		        "title": "Request Rate (req/s)",
		        "type": "timeseries",
		        "targets": [{
		          "expr": "sum(rate(http_requests_total{service=\"$service\"}[5m])) by (status)"
		        }]
		      },
		      {
		        "title": "Error Rate (%)",
		        "type": "stat",
		        "thresholds": {
		          "steps": [
		            {"value": 0,    "color": "green"},
		            {"value": 0.01, "color": "yellow"},
		            {"value": 0.05, "color": "red"}
		          ]
		        },
		        "targets": [{
		          "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m]))"
		        }]
		      },
		      {
		        "title": "Latency Percentiles",
		        "type": "timeseries",
		        "targets": [
		          {"expr": "histogram_quantile(0.50, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))", "legendFormat": "p50"},
		          {"expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))", "legendFormat": "p95"},
		          {"expr": "histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))", "legendFormat": "p99"}
		        ]
		      }
		    ]
		  }
		  ```
- # SLIs, SLOs & Error Budgets
  collapsed:: true
	- ## The SRE Framework for Reliability
		- This framework, developed by Google's SRE team (see [[DevOps]] — SRE section), transforms reliability from a vague aspiration ("the site should be fast and reliable") into a **quantitative engineering contract** with clear consequences.
		- **SLI (Service Level Indicator)** — a precise numerical measurement of a service behavior. Not "the site is up" but "the fraction of HTTP requests that return 2xx within 500ms, measured over a rolling 28-day window." SLIs must be measurable, meaningful to users, and something your monitoring actually captures.
		- **SLO (Service Level Objective)** — your target for an SLI. "99.9% of requests succeed within 500ms." This is your internal commitment to reliability. It's higher than your SLA to give yourself a safety margin.
		- **Error Budget** — the allowed failure space. If SLO is 99.9%, your error budget is 0.1% = ~43 minutes of downtime per month. This budget is **yours to spend** on risky deployments, experiments, and chaos engineering — not a punishment for failures.
		- **SLA (Service Level Agreement)** — your contractual commitment to customers. Always more lenient than your SLO. Breaching it triggers financial penalties or service credits.
		- ```
		  Error Budget Math:
		  ─────────────────────────────────────────────────────────────
		  SLO: 99.9% availability, 28-day rolling window
		  
		  Total minutes in 28 days = 28 × 24 × 60 = 40,320 minutes
		  Allowed failure = 40,320 × 0.001 = 40.32 minutes/month
		  
		  Your last deploy caused 2 hours degradation:
		  → Consumed 297% of monthly budget in one event
		  → Engineering freeze: no new deploys until next month
		  → Focus exclusively on reliability
		  
		  Budget untouched after 3 weeks:
		  → You're being too conservative (over-engineering reliability)
		  → Increase deploy frequency, try that risky migration
		  → The budget exists to spend, not hoard
		  ```
	-
	- ## Choosing Good SLIs
		- Not everything makes a good SLI. Good SLIs are:
		- | Characteristic | Explanation |
		  |---------------|-------------|
		  | **User-visible** | Measures what the user experiences, not internal metrics |
		  | **Measurable now** | You can collect it today without major instrumentation work |
		  | **Actionable** | When it degrades, it points to something you can fix |
		  | **Not trivially achievable** | "99.9999999%" SLOs that are always met tell you nothing |
		- ```
		  Good SLIs:                              Poor SLIs:
		  ─────────────────────────────────────   ────────────────────────────────────
		  Request success rate (2xx/total)        Server uptime (ping responds)
		  p99 latency < 500ms                     Average latency (hides long tail)
		  Checkout error rate < 0.1%              CPU usage (internal, not user-visible)
		  Search results returned in < 1s         "System is healthy" (not quantifiable)
		  Payment processing success rate         Log lines per second (not user-facing)
		  ```
- # Logging — Centralized Log Management
  collapsed:: true
	- ## Why Centralized Logging
		- When your application runs on one server, tailing `/var/log/app.log` works fine. When it runs on 50 pods across 3 Kubernetes clusters in 2 regions, you need a centralized system where you can search all logs from one place.
		- More importantly, **correlation**: during an incident, you want to search "all logs from the last 30 minutes that contain this error, correlated with which pod it came from, what version was deployed, and whether it correlates with a deployment event." That's only possible with centralized, structured logs.
		- The standard advice: **always log as JSON in production**. Structured logs are machine-parseable, can be indexed by any field, and enable complex queries. Human-readable unstructured logs are great for development, useless for production at scale.
	-
	- ## Structured Logging
		- ```python title="structured_logging.py — production logging setup"
		  import logging
		  import json
		  import sys
		  import traceback
		  from datetime import datetime, timezone
		  
		  class JSONFormatter(logging.Formatter):
		      """Log as JSON for machine parsing by ELK/Loki."""
		  
		      def format(self, record: logging.LogRecord) -> str:
		          log_data = {
		              "timestamp":  datetime.now(timezone.utc).isoformat(),
		              "level":      record.levelname,
		              "logger":     record.name,
		              "message":    record.getMessage(),
		              "module":     record.module,
		              "function":   record.funcName,
		              "line":       record.lineno,
		              # Add trace context if available (from OpenTelemetry)
		              "trace_id":   getattr(record, "trace_id", None),
		              "span_id":    getattr(record, "span_id", None),
		              # Service metadata
		              "service":    "payment-service",
		              "version":    "2.3.1",
		              "environment": "production",
		          }
		          # Include extra fields passed via extra={} in log calls
		          for key, value in record.__dict__.items():
		              if key.startswith("ctx_"):
		                  log_data[key[4:]] = value
		  
		          if record.exc_info:
		              log_data["exception"] = {
		                  "type":    record.exc_info[0].__name__,
		                  "message": str(record.exc_info[1]),
		                  "trace":   traceback.format_exception(*record.exc_info),
		              }
		  
		          return json.dumps(log_data, default=str)
		  
		  # ── Setup ──────────────────────────────────────────────────────────
		  def setup_logging(level: str = "INFO") -> logging.Logger:
		      handler = logging.StreamHandler(sys.stdout)
		      handler.setFormatter(JSONFormatter())
		      root_logger = logging.getLogger()
		      root_logger.setLevel(level)
		      root_logger.handlers = [handler]
		      return root_logger
		  
		  log = setup_logging()
		  
		  # ── Usage ──────────────────────────────────────────────────────────
		  # Simple message
		  log.info("User logged in", extra={"ctx_user_id": "usr_123", "ctx_method": "oauth2"})
		  
		  # With error context
		  try:
		      result = process_payment(amount=99.99, user_id="usr_123")
		  except PaymentError as e:
		      log.error("Payment failed",
		                extra={"ctx_user_id": "usr_123", "ctx_amount": 99.99, "ctx_error_code": e.code},
		                exc_info=True)
		  
		  # Output (one line, pretty-printed here):
		  # {
		  #   "timestamp": "2024-01-15T14:23:01.234Z",
		  #   "level": "ERROR",
		  #   "message": "Payment failed",
		  #   "user_id": "usr_123",
		  #   "amount": 99.99,
		  #   "error_code": "INSUFFICIENT_FUNDS",
		  #   "exception": {"type": "PaymentError", "message": "..."}
		  # }
		  ```
	-
	- ## ELK Stack — Elasticsearch + Logstash + Kibana
		- The ELK Stack is the most widely deployed centralized logging solution. **Logstash** (or Fluentd/Fluent Bit) collects and parses logs. **Elasticsearch** indexes and stores them for fast full-text search. **Kibana** provides the UI for searching, dashboards, and alerts.
		- ```yaml title="filebeat.yml — lightweight log shipper"
		  filebeat.inputs:
		    - type: container
		      paths:
		        - /var/log/containers/*.log
		      processors:
		        - add_kubernetes_metadata:   # adds pod name, namespace, labels
		            host: ${NODE_NAME}
		            matchers:
		              - logs_path:
		                  logs_path: /var/log/containers/
		  
		  output.logstash:
		    hosts: ["logstash:5044"]
		  
		  # Or directly to Elasticsearch (simpler for small setups)
		  # output.elasticsearch:
		  #   hosts: ["elasticsearch:9200"]
		  #   index: "k8s-logs-%{+yyyy.MM.dd}"
		  ```
		- ```ruby title="logstash.conf — parse and enrich logs"
		  input {
		    beats { port => 5044 }
		  }
		  
		  filter {
		    # Parse JSON logs
		    if [message] =~ /^\{/ {
		      json {
		        source => "message"
		        target => "parsed"
		      }
		      mutate {
		        rename => {
		          "[parsed][level]"     => "log_level"
		          "[parsed][message]"  => "log_message"
		          "[parsed][trace_id]" => "trace_id"
		        }
		      }
		    }
		  
		    # Add GeoIP for IP addresses
		    if [client_ip] {
		      geoip {
		        source => "client_ip"
		        target => "geoip"
		      }
		    }
		  
		    # Drop noisy health check logs
		    if [request_path] == "/health" or [request_path] == "/metrics" {
		      drop {}
		    }
		  
		    # Enrich with deployment version from Kubernetes labels
		    mutate {
		      add_field => {
		        "[@metadata][index]" => "app-logs-%{+YYYY.MM.dd}"
		      }
		    }
		  }
		  
		  output {
		    elasticsearch {
		      hosts     => ["elasticsearch:9200"]
		      index     => "%{[@metadata][index]}"
		      action    => "index"
		    }
		  }
		  ```
	-
	- ## Loki — Grafana's Log Aggregation System
		- Loki is Prometheus for logs — it uses the same label-based querying model (LogQL mirrors PromQL), integrates natively with Grafana, and is significantly cheaper to operate than Elasticsearch because it only indexes labels, not the full log content.
		- The tradeoff: full-text search across log content is slower in Loki than Elasticsearch. For most use cases (filtering by service, pod, namespace, then reading specific log lines), Loki is the better modern choice. Elasticsearch excels when you need full-text search across billions of log messages.
		- ```yaml title="promtail.yml — Loki log collector for Kubernetes"
		  server:
		    http_listen_port: 9080
		  
		  clients:
		    - url: http://loki:3100/loki/api/v1/push
		  
		  scrape_configs:
		    - job_name: kubernetes-pods
		      kubernetes_sd_configs:
		        - role: pod
		      pipeline_stages:
		        - docker: {}    # parse Docker JSON log format
		        - json:         # extract fields from JSON logs
		            expressions:
		              level:    level
		              trace_id: trace_id
		        - labels:       # promote fields to Loki labels (indexed)
		            level:
		            trace_id:
		        - output:       # set the log line content
		            source: message
		  ```
		- ```
		  LogQL cheat sheet (Loki query language):
		  ─────────────────────────────────────────────────────────────
		  # Stream selector — always required
		  {namespace="production", app="payment-service"}
		  
		  # Filter by content
		  {app="api"} |= "error"                  # line contains "error"
		  {app="api"} != "health"                  # line does NOT contain "health"
		  {app="api"} |~ "status=5.."              # regex match
		  
		  # Parse and filter structured fields
		  {app="api"} | json | level="error"
		  {app="api"} | json | status_code >= 500
		  
		  # Metrics from logs (log-based metrics)
		  count_over_time({app="api"} |= "error" [5m])   # error count per 5m
		  rate({app="api"} [5m])                          # log lines per second
		  
		  # Error rate from logs
		  sum(rate({app="api"} | json | level="error" [5m])) by (service)
		  /
		  sum(rate({app="api"} [5m])) by (service)
		  ```
- # Distributed Tracing
  collapsed:: true
	- ## Why Traces Are Essential in Microservices
		- In a [[Microservices Architecture]], a single user request might touch 10+ services: API gateway → auth service → user service → product service → inventory service → pricing service → cart service → order service → payment service → notification service. If the checkout takes 8 seconds instead of 0.5 seconds, which service is the bottleneck?
		- Metrics tell you the overall latency is high. Logs tell you each service processed a request. But **traces** tell you the entire request journey — every service call, every database query, every external API call — with precise timing for each span. You can see that the payment service's Stripe API call is taking 7.2 seconds, while everything else is fast.
	-
	- ## OpenTelemetry — The Standard
		- OpenTelemetry (OTel) is the CNCF standard for observability instrumentation. Write it once, send to any backend (Jaeger, Tempo, Datadog, Honeycomb, Zipkin). It covers traces, metrics, and logs under one SDK.
		- ```python title="tracing.py — OpenTelemetry setup for Python"
		  from opentelemetry import trace
		  from opentelemetry.sdk.trace import TracerProvider
		  from opentelemetry.sdk.trace.export import BatchSpanProcessor
		  from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
		  from opentelemetry.sdk.resources import SERVICE_NAME, SERVICE_VERSION, Resource
		  from opentelemetry.instrumentation.fastapi    import FastAPIInstrumentor
		  from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
		  from opentelemetry.instrumentation.redis      import RedisInstrumentor
		  from opentelemetry.instrumentation.requests   import RequestsInstrumentor
		  
		  # ── Initialize tracer ──────────────────────────────────────────────
		  resource = Resource(attributes={
		      SERVICE_NAME:    "payment-service",
		      SERVICE_VERSION: "2.3.1",
		      "deployment.environment": "production",
		  })
		  
		  provider = TracerProvider(resource=resource)
		  provider.add_span_processor(
		      BatchSpanProcessor(
		          OTLPSpanExporter(endpoint="http://otel-collector:4317"),
		          max_export_batch_size=512,
		          export_timeout_millis=30_000,
		      )
		  )
		  trace.set_tracer_provider(provider)
		  
		  # Auto-instrument libraries (zero code changes needed in handlers)
		  FastAPIInstrumentor.instrument_app(app)
		  SQLAlchemyInstrumentor().instrument(engine=db_engine)
		  RedisInstrumentor().instrument()
		  RequestsInstrumentor().instrument()    # outbound HTTP
		  
		  # ── Manual spans for custom operations ────────────────────────────
		  tracer = trace.get_tracer(__name__)
		  
		  async def process_payment(order_id: str, amount: float, user_id: str):
		      # Creates a span named "process_payment"
		      with tracer.start_as_current_span("process_payment") as span:
		          # Add structured attributes — searchable in trace UI
		          span.set_attribute("order.id",        order_id)
		          span.set_attribute("payment.amount",  amount)
		          span.set_attribute("user.id",         user_id)
		          span.set_attribute("payment.currency", "USD")
		  
		          # Nested span — fraud check
		          with tracer.start_as_current_span("fraud_check") as fraud_span:
		              fraud_result = await check_fraud(order_id)
		              fraud_span.set_attribute("fraud.score", fraud_result.score)
		              fraud_span.set_attribute("fraud.approved", fraud_result.approved)
		  
		          if not fraud_result.approved:
		              span.set_status(trace.Status(trace.StatusCode.ERROR, "Fraud detected"))
		              span.set_attribute("payment.status", "rejected")
		              raise FraudError("Payment rejected by fraud detection")
		  
		          # Payment processing span
		          with tracer.start_as_current_span("stripe_charge") as stripe_span:
		              try:
		                  charge = await stripe.charge(amount, order_id)
		                  stripe_span.set_attribute("stripe.charge_id", charge.id)
		                  span.set_attribute("payment.status", "success")
		                  return charge
		              except stripe.StripeError as e:
		                  stripe_span.set_status(trace.Status(trace.StatusCode.ERROR, str(e)))
		                  stripe_span.record_exception(e)
		                  raise
		  ```
		- ```yaml title="otel-collector.yaml — OpenTelemetry Collector config"
		  receivers:
		    otlp:
		      protocols:
		        grpc: { endpoint: "0.0.0.0:4317" }
		        http: { endpoint: "0.0.0.0:4318" }
		  
		  processors:
		    batch:
		      timeout:           1s
		      send_batch_size:   1024
		    memory_limiter:
		      limit_mib: 512
		  
		    # Add environment attribute to all spans
		    resource:
		      attributes:
		        - key:    deployment.environment
		          value:  production
		          action: upsert
		  
		  exporters:
		    # Jaeger — trace storage + UI
		    jaeger:
		      endpoint: "jaeger:14250"
		      tls:
		        insecure: true
		  
		    # Prometheus — expose metrics from traces
		    prometheus:
		      endpoint: "0.0.0.0:8889"
		  
		    # Logging — debug pipeline
		    logging:
		      verbosity: normal
		  
		  service:
		    pipelines:
		      traces:
		        receivers:  [otlp]
		        processors: [memory_limiter, batch, resource]
		        exporters:  [jaeger, logging]
		      metrics:
		        receivers:  [otlp]
		        processors: [memory_limiter, batch]
		        exporters:  [prometheus]
		  ```
- # Alerting & On-Call
  collapsed:: true
	- ## Alert Design Principles
		- Bad alerting is worse than no alerting. An alert that fires 50 times a day for non-issues trains engineers to ignore it — until the day it fires for a real problem and nobody responds. This is called **alert fatigue**.
		- Every alert should have a clear answer to these questions:
		- | Question | If No Answer → |
		  |----------|---------------|
		  | Is this user-impacting? | Don't alert, just record |
		  | Is this actionable right now? | Don't page, add to a dashboard |
		  | Does someone know what to do? | Add a runbook URL to the annotation |
		  | Can it wait until morning? | Route to ticket, not pager |
		- ```
		  Alert severity guide:
		  ─────────────────────────────────────────────────────────────
		  CRITICAL (page immediately, wake up on-call)
		  → Users are impacted right now
		  → Error budget burning fast
		  → Data loss risk
		  Examples: payment failures, site down, auth broken
		  
		  WARNING (page during business hours, or Slack)
		  → Will become critical if not addressed in hours
		  → Performance degradation that users might notice
		  Examples: high latency not yet at SLO breach, disk filling up
		  
		  INFO (dashboard, ticket)
		  → Interesting but not urgent
		  → Good to know, no immediate action needed
		  Examples: deployment completed, traffic spike (normal)
		  ```
	-
	- ## Alertmanager — Route & Deduplicate Alerts
		- ```yaml title="alertmanager.yml — production routing config"
		  global:
		    resolve_timeout: 5m
		    slack_api_url: "https://hooks.slack.com/services/..."
		  
		  # Inhibition — suppress warning if critical is already firing
		  inhibit_rules:
		    - source_match:
		        severity: critical
		      target_match:
		        severity: warning
		      equal: [service]    # only inhibit same service
		  
		  # Silence: mute during maintenance window
		  # (create via Alertmanager UI or API)
		  
		  route:
		    receiver: slack-general     # default receiver
		    group_by: [alertname, service]
		    group_wait:      30s        # wait before sending first notification in group
		    group_interval:  5m         # wait before sending new notifications for same group
		    repeat_interval: 4h         # re-alert if still firing after 4h
		  
		    routes:
		      # Critical → PagerDuty (wakes people up)
		      - match:
		          severity: critical
		        receiver: pagerduty
		        continue: true          # also send to Slack
		  
		      # Payment service → dedicated channel
		      - match:
		          service: payment-service
		        receiver: slack-payments
		  
		      # Database alerts → DBA team
		      - match_re:
		          alertname: "^DB.*"
		        receiver: slack-dba
		  
		  receivers:
		    - name: pagerduty
		      pagerduty_configs:
		        - routing_key: "{{ env \"PAGERDUTY_KEY\" }}"
		          severity: "{{ .CommonLabels.severity }}"
		          description: "{{ .CommonAnnotations.summary }}"
		          links:
		            - href: "{{ .CommonAnnotations.runbook_url }}"
		              text: Runbook
		            - href: "{{ .CommonAnnotations.dashboard }}"
		              text: Dashboard
		  
		    - name: slack-general
		      slack_configs:
		        - channel: "#alerts"
		          text: |
		            *{{ .Status | toUpper }}* {{ .CommonLabels.alertname }}
		            {{ .CommonAnnotations.summary }}
		          send_resolved: true
		  
		    - name: slack-payments
		      slack_configs:
		        - channel: "#payments-alerts"
		          send_resolved: true
		  ```
- # Incident Management
  collapsed:: true
	- ## Incident Response Workflow
		- A structured incident response process reduces the chaos when things go wrong and significantly shortens MTTR (Mean Time to Restore). See [[DevOps]] — SRE section for the full context on why this matters and how DORA metrics measure it.
		- ```mermaid
		  graph TD
		      DETECT["🚨 DETECT\nAlert fires · Customer reports\nSynthetic monitor fails"]
		      TRIAGE["🔍 TRIAGE (< 5 min)\nSeverity? Scope?\nAffected users/services?"]
		      DECLARE["📢 DECLARE\nCreate #incident-YYMMDDn Slack channel\nAssign Incident Commander (IC)\nNotify stakeholders via status page"]
		      MITIGATE["🛠️ MITIGATE FIRST\nRollback · Feature flag off\nScale up · Reroute traffic\nDO NOT investigate while users are down"]
		      INVESTIGATE["🔬 INVESTIGATE\nOnce service restored:\nLogs · Traces · Metrics\nTimeline reconstruction"]
		      RESOLVE["✅ RESOLVE\nConfirm recovery\nClose status page incident\nSchedule post-mortem"]
		      POSTMORTEM["📝 BLAMELESS POST-MORTEM\nTimeline · Contributing factors\nAction items · Owner + deadline"]
		      DETECT --> TRIAGE --> DECLARE --> MITIGATE --> INVESTIGATE --> RESOLVE --> POSTMORTEM
		  ```
		- The golden rule: **mitigate first, investigate second**. A 10-minute rollback that ends the incident beats 2 hours of perfect root cause analysis while users are still down.
	-
	- ## Blameless Post-Mortems
		- A blameless post-mortem analyzes a system failure without attributing blame to individuals. The premise: **people don't cause incidents, systems do**. If an engineer made a mistake, the real question is "why did our system allow that mistake to have this impact?" — not "why did that engineer do that?"
		- When engineers fear blame, they hide information, avoid taking responsibility, stop taking risks, and incidents recur. Blameless culture enables honest analysis that actually prevents recurrence.
		- ```
		  Post-Mortem Template:
		  ─────────────────────────────────────────────────────────────
		  Title: [Service] [Incident Type] — [Date]
		  Severity: SEV1 / SEV2 / SEV3
		  Duration: X hours Y minutes
		  Impact: ~N users affected, $X revenue impact
		  
		  SUMMARY (2-3 sentences):
		  What happened, what was the impact, how was it resolved.
		  
		  TIMELINE (exact times, UTC):
		  14:03 — Alert fires: HighErrorRate on payment-service
		  14:05 — IC assigned, incident channel created
		  14:08 — Engineers identify deployment at 13:55 as likely cause
		  14:12 — Rollback initiated via ArgoCD
		  14:15 — Error rate returns to baseline
		  14:20 — Incident resolved, post-mortem scheduled
		  
		  ROOT CAUSE:
		  A database migration in deploy v2.3.1 added a non-nullable column
		  without a default value, causing all INSERT operations to fail.
		  
		  CONTRIBUTING FACTORS:
		  1. Migration was not tested with production data volume
		  2. No automated migration dry-run in CI pipeline
		  3. Rollback process took 7 min due to manual ArgoCD steps
		  
		  ACTION ITEMS:
		  1. Add migration dry-run step to CI pipeline       [Alice, 2024-02-01]
		  2. Automate rollback trigger for deployment errors [Bob,   2024-02-15]
		  3. Add DB migration test to staging pipeline       [Carol, 2024-02-01]
		  ```
- # More Learn
	- ## Books & Docs
		- [Google SRE Book (free)](https://sre.google/sre-book/table-of-contents/) — chapters on monitoring, alerting, and on-call are essential
		- [Prometheus Documentation](https://prometheus.io/docs/) — official reference
		- [Grafana Documentation](https://grafana.com/docs/) — dashboards, alerting, Loki
		- [OpenTelemetry Documentation](https://opentelemetry.io/docs/) — instrumentation reference
		- [Practical Monitoring — Mike Julian (O'Reilly)](https://www.oreilly.com/library/view/practical-monitoring/9781491957349/) — monitoring philosophy and patterns
		- [The Art of Monitoring — James Turnbull](https://artofmonitoring.com/) — comprehensive monitoring guide
	-
	- ## YouTube
		- [Prometheus + Grafana Full Course](https://www.youtube.com/results?search_query=prometheus+grafana+full+course+kubernetes)
		- [OpenTelemetry Tutorial](https://www.youtube.com/results?search_query=opentelemetry+tracing+tutorial+python)
		- [ELK Stack Full Course](https://www.youtube.com/results?search_query=elk+stack+full+course+elasticsearch+kibana)
		- [Loki + Grafana Tutorial](https://www.youtube.com/results?search_query=loki+grafana+logging+kubernetes+tutorial)
		- [SRE Practices — Google](https://www.youtube.com/results?search_query=google+sre+monitoring+alerting+practices)
	-
	- ## Explore Further
		- Observability connects every layer of the stack — from the kernel to the application to the business metric. Every page below feeds into what you measure and how you respond.
		-
		- **The complete engineering context** — [[DevOps]] is the lifecycle that monitoring closes the loop on. The SRE section there covers error budgets, toil reduction, and incident management processes that this page's alerting and post-mortem content plugs directly into.
		-
		- **Where distributed tracing becomes essential** — [[Microservices Architecture]] is where a single user request can touch 15 services. Without the OpenTelemetry traces covered in this page, debugging latency in that environment is guesswork. The circuit breaker and saga patterns in that page also expose metrics that you'll want to alert on.
		-
		- **The infrastructure being monitored** — [[Infrastructure as Code IaC]] provisions the Prometheus servers, ELK clusters, and Grafana instances that your monitoring stack runs on. Good IaC includes the entire observability stack as code, not just the application infrastructure.
		-
		- **Architecture-level observability decisions** — [[System Design]] covers the four-nines availability targets, CAP theorem tradeoffs, and caching strategies that SLIs and SLOs are designed to measure. [[System Design Scalability & CAP]] explains why your error budget math looks the way it does. [[System Design Microservices]] covers circuit breakers and health checks — the patterns that make your service-level metrics meaningful.
		-
		- **Automating your monitoring operations** — [[Automation]] covers how to script alert response, auto-generate runbooks, and build self-healing systems. [[kestra]] handles the multi-step workflows triggered by alerts: auto-scaling, rolling restarts, incident ticket creation, and Slack notifications — all in YAML with full retry and error handling.
		-
		- **The kernel metrics layer** — [[Linux Advanced]] exposes the system-level metrics that sit below your application: CPU scheduler statistics, memory pressure and OOM events, disk I/O wait, and network stack counters. Understanding `/proc/meminfo` and `sar` output makes Grafana dashboards significantly more insightful.
		-
		- **Kernel-level observability without code changes** — [[eBPF]] is how tools like Falco, Tetragon, and Cilium hook directly into the Linux kernel to capture syscalls, network flows, and file access patterns. It is the zero-instrumentation observability layer that [[Continuous Monitoring & Logging]] tools increasingly build on top of.
		-
		- **Security observability** — [[Cybersecurity]] covers SIEM, audit logs, and threat detection — the security-specific observability layer that sits alongside application monitoring. Audit logs from auditd and cloud provider CloudTrail/Stackdriver integrate into the same ELK or Grafana stack covered here.
		-
		- **Pipeline visibility** — [[Continuous Integration]] and [[Continuous Delivery]] pipelines generate their own metrics and logs: build duration trends, test failure rates, deployment frequency. These feed naturally into the same Grafana dashboards and alert rules — closing the DORA metrics loop.