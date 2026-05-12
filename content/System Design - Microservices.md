---
seoTitle: Microservices & Distributed Patterns – System Design Guide
description: "Complete microservices reference: API gateway, service discovery, circuit breaker, saga pattern, CQRS, event sourcing, outbox pattern, distributed tracing, and service mesh for system design interviews."
keywords: "microservices, API gateway, circuit breaker, saga pattern, CQRS, event sourcing, outbox pattern, service discovery, distributed tracing, Kafka, message queue, system design, VR-Rathod, Code-Note"
displayTitle: System Design - Microservices
---

> [!info] About This Page
> Covers **microservices architecture and distributed system patterns** — service communication, resilience, and data consistency.
> Parent: [[System Design]]. See also: [[System Design - APIs & Networking]], [[System Design - Databases]].

> [!warning] Don't Start with Microservices
> Monolith first, then extract services as pain points emerge. Premature microservices = distributed monolith with all the complexity and none of the benefits.

- # Monolith vs Microservices
  collapsed:: true
	- ## Decision Framework
	  collapsed:: true
		- ```mermaid
		  flowchart TD
		      Start[New Project?] --> Small{Team < 10\ndevs?}
		      Small -->|Yes| Monolith[Start with Monolith ✅]
		      Small -->|No| Scale{Scaling\npain points?}
		      Scale -->|No| Monolith
		      Scale -->|Yes| Extract[Extract Services\nStrangler Fig Pattern]
		      Extract --> MS[Microservices 🏗]
		  ```
	-
	- ## Trade-offs Table
	  collapsed:: true
		- | Aspect | Monolith | Microservices |
		  |--------|---------|--------------|
		  | Initial complexity | Low | High |
		  | Deploy | One artifact | N independent deployments |
		  | Scale | Entire app together | Individual services |
		  | Fault isolation | None — one bug crashes all | Failures contained per service |
		  | Tech stack | Uniform | Polyglot (each service chooses) |
		  | Testing | Simple | Complex (integration, contract) |
		  | Team model | Feature teams | Service ownership teams |
		  | Data | Shared DB (simple) | DB per service (complex) |

- # Service Communication
  collapsed:: true
	- ## Sync vs Async
	  collapsed:: true
		- | Mode | How | When | Examples |
		  |------|-----|------|---------|
		  | **Synchronous** | Caller waits for response | User-facing, immediate result needed | REST, gRPC |
		  | **Asynchronous** | Fire and forget via queue | Background jobs, no immediate result needed | Kafka, RabbitMQ, SQS |
	-
	- ## Message Queue Patterns
	  collapsed:: true
		- ```
		  Point-to-Point (Queue):
		    Producer → [Queue] → Single Consumer
		    Message deleted after consumed
		    Use: Task queues, job processing

		  Publish-Subscribe (Topic):
		    Producer → [Topic] → Consumer A
		                      → Consumer B
		                      → Consumer C
		    All subscribers receive every message
		    Use: Event notifications, fan-out

		  Example — Order Service:
		    Order created → publishes "order.created"
		    ├── Email Service       → sends confirmation
		    ├── Inventory Service   → reserves stock
		    └── Analytics Service   → logs event
		  ```
	-
	- ## Message Queue Comparison
	  collapsed:: true
		- | Feature | Kafka | RabbitMQ | AWS SQS |
		  |---------|-------|---------|--------|
		  | Type | Distributed log | AMQP broker | Managed cloud |
		  | Retention | Days/weeks (replay!) | Deleted on consume | Up to 14 days |
		  | Throughput | Millions/sec | Tens of thousands/sec | Unlimited |
		  | Replay | ✅ Any offset | ❌ | ❌ |
		  | Best for | Event streaming, CQRS, audit | Task queues, RPC | AWS serverless |

- # API Gateway
  collapsed:: true
	- ## Responsibilities
	  collapsed:: true
		- ```mermaid
		  flowchart LR
		      Client --> GW[API Gateway]
		      GW -->|Auth ✓| Auth[Auth Service]
		      GW -->|Route| US[User Service]
		      GW -->|Route| OS[Order Service]
		      GW -->|Route| PS[Product Service]
		      GW -->|Rate limit| RL[Rate Limiter]
		  ```
		- ```
		  API Gateway handles:
		    ✅ Authentication & Authorization
		    ✅ Rate limiting & throttling
		    ✅ Request routing & load balancing
		    ✅ SSL termination
		    ✅ Request/response transformation
		    ✅ Logging, metrics, distributed tracing
		    ✅ Caching (sometimes)
		    ✅ Circuit breaking

		  Popular: Kong, AWS API Gateway, Nginx, Traefik, Envoy
		  ```

- # Service Discovery
  collapsed:: true
	- ## Client-Side vs Server-Side
	  collapsed:: true
		- ```
		  Client-Side Discovery:
		    Client → Service Registry → Gets list of instances
		    Client picks one (round-robin/random) → Calls directly
		    Pro: No extra hop. Con: Discovery logic in every client.
		    Tool: Netflix Eureka

		  Server-Side Discovery:
		    Client → Load Balancer → LB queries registry → Routes request
		    Pro: Clients stay simple. Con: Extra hop via LB.
		    Tool: AWS ALB + ECS service discovery, Kubernetes Service

		  Service Registry:
		    Consul, Eureka, etcd, Zookeeper
		    Services register on startup, deregister on shutdown
		    Health checks remove unhealthy instances automatically
		  ```

- # Resilience Patterns
  collapsed:: true
	- ## Circuit Breaker
	  collapsed:: true
		- ```mermaid
		  stateDiagram-v2
		      [*] --> CLOSED : Normal
		      CLOSED --> OPEN : N failures in window
		      OPEN --> HALF_OPEN : Timeout expires
		      HALF_OPEN --> CLOSED : Test request ✅
		      HALF_OPEN --> OPEN : Test request ❌
		  ```
		- ```
		  CLOSED:    Requests pass through normally
		  OPEN:      Requests fail fast — no call to failing service
		  HALF-OPEN: Allow one test request to check recovery

		  Benefits:
		    ✅ Prevents cascading failures
		    ✅ Gives failing service time to recover
		    ✅ Fast failure (no waiting for timeout)

		  Libraries: Resilience4j (Java), Polly (.NET), Hystrix (deprecated)
		  ```
	-
	- ## Retry with Exponential Backoff
	  collapsed:: true
		- ```python
		  import time, random

		  def call_with_retry(fn, max_retries=5):
		      for attempt in range(max_retries):
		          try:
		              return fn()
		          except TransientError as e:
		              if attempt == max_retries - 1:
		                  raise
		              wait = (2 ** attempt) + random.uniform(0, 1)  # jitter
		              time.sleep(wait)
		      # Waits: 1s, 2s, 4s, 8s, 16s (+ jitter each time)
		  ```
		- > [!important] Always use Jitter
		  > Without jitter, all clients retry at exactly the same time → thundering herd.
		  > Jitter spreads retries across a time window.
	-
	- ## Bulkhead Pattern
	  collapsed:: true
		- ```
		  Isolate thread pools per downstream service.
		  If Service A is slow and exhausts its pool, Service B/C are unaffected.

		  Thread Pool Bulkhead:
		    Service A calls: pool of 20 threads
		    Service B calls: pool of 20 threads
		    Service C calls: pool of 20 threads

		  Semaphore Bulkhead:
		    Limit concurrent calls to N (simpler, same thread)

		  Key insight: Don't let one slow dependency exhaust shared resources.
		  ```

- # Distributed Data Patterns
  collapsed:: true
	- ## Saga Pattern (Distributed Transactions)
	  collapsed:: true
		- ```
		  Problem: Distributed transactions across services (2PC is too slow)

		  Saga = sequence of local transactions with compensating transactions on failure

		  Choreography-based Saga:
		    Order Service → creates order → publishes "order.created"
		    Payment Service → charges card → publishes "payment.done"
		    Inventory Service → reserves stock → publishes "stock.reserved"
		    Shipping Service → schedules delivery
		    On failure → each service publishes compensation event
		    (e.g., "payment.refund" if inventory fails)

		  Orchestration-based Saga:
		    Central Saga Orchestrator tells each service what to do
		    Orchestrator tracks state and handles compensation
		    Pro: Easier to follow. Con: Orchestrator is a bottleneck.
		  ```
	-
	- ## CQRS (Command Query Responsibility Segregation)
	  collapsed:: true
		- ```
		  Separate read model from write model.

		  Write side (Command):
		    Optimised for consistency
		    Normalised data, ACID transactions
		    Slower queries OK

		  Read side (Query):
		    Optimised for performance
		    Denormalised, pre-aggregated views
		    Multiple read models for different use cases

		  Sync via: Event sourcing, CDC (Change Data Capture), Kafka

		  Example:
		    Write: UPDATE orders table (normalised)
		    Read:  Pre-computed "user's order history" view in Redis / Elasticsearch
		  ```
	-
	- ## Outbox Pattern
	  collapsed:: true
		- ```
		  Problem:
		    1. Write to DB ✅
		    2. Publish to Kafka ❌ (crash) → message lost!

		  Outbox Solution:
		    1. Write to DB + write to outbox_events table (same transaction ✅)
		    2. Background worker reads outbox → publishes to Kafka
		    3. Mark outbox record as published

		  Guarantees: At-least-once delivery
		  Requirement: Make consumers idempotent (safe to process twice)

		  Tools: Debezium (CDC) can watch the outbox table automatically
		  ```
	-
	- ## Event Sourcing
	  collapsed:: true
		- ```
		  Instead of storing current state → store sequence of events

		  Traditional: users table { id, name, balance = 500 }

		  Event Sourcing:
		    Event 1: AccountOpened { id: 1, initial: 1000 }
		    Event 2: MoneyWithdrawn { id: 1, amount: 200 }
		    Event 3: MoneyDeposited { id: 1, amount: -300 }
		    Current balance: 1000 - 200 + (-300) = 500

		  Benefits:
		    ✅ Full audit trail built-in
		    ✅ Replay events to rebuild any past state
		    ✅ Natural fit for CQRS

		  Drawbacks:
		    ❌ Querying current state requires replaying events (use snapshots)
		    ❌ Schema evolution of events is hard
		  ```

- # Distributed Tracing
  collapsed:: true
	- ## How It Works
	  collapsed:: true
		- ```
		  Every request gets a unique trace_id
		  Each service hop creates a span with span_id + parent span_id

		  Request → API Gateway (trace: abc, span: 1)
		              → User Service   (trace: abc, span: 2, parent: 1)
		              → DB query       (trace: abc, span: 3, parent: 2)
		              → Order Service  (trace: abc, span: 4, parent: 1)

		  Trace aggregator collects all spans → builds flame chart
		  → Instantly see which service is the bottleneck

		  Tools: Jaeger, Zipkin, AWS X-Ray, Datadog APM, OpenTelemetry
		  Standard: OpenTelemetry (vendor-neutral)
		  ```

- # Useful Links & Resources
	- [[System Design]] — Hub page
	- [[System Design - APIs & Networking]] — REST, gRPC, WebSockets, rate limiting
	- [Microservices.io](https://microservices.io) — Pattern catalog by Chris Richardson
	- [Resilience4j](https://resilience4j.readme.io) — Circuit breaker library
	- [Debezium](https://debezium.io) — CDC for outbox pattern
	- [OpenTelemetry](https://opentelemetry.io) — Distributed tracing standard
