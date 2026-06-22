---
seoTitle: Microservices Architecture – Complete Guide from Monolith to Distributed Systems
description: "Comprehensive microservices reference covering monolith vs microservices, domain-driven design, service communication, API gateway, circuit breaker, saga pattern, CQRS, event sourcing, service mesh, containerization, deployment, and real-world patterns."
keywords: "microservices, microservices architecture, domain-driven design, API gateway, circuit breaker, saga pattern, CQRS, event sourcing, service mesh, Kubernetes, Docker, event-driven architecture, distributed systems, service discovery, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Microservices Architecture
treeTitle: System Design - Microservices
enableToc: true
---

> [!info] About This Page
> Microservices Architecture is a style of building applications as a collection of **small, independently deployable services**, each owning its data, communicating over well-defined APIs, and focused on a single business capability.
> This page covers the full journey — when to use microservices, how to design them, how they communicate, how to handle failures, and how to deploy and observe them.
> Related deep-dives: [[System Design Microservices]], [[DevOps]] for deployment pipelines, [[Continuous Monitoring & Logging]] for observability, [[Infrastructure as Code IaC]] for provisioning the infrastructure that runs them.

- # History & Why Microservices
  collapsed:: true
	- ## The Problem with Monoliths at Scale
		- A monolith is an application where all components — UI, business logic, data access — are deployed together as a single unit. This is the **right starting point** for almost every application. Monoliths are simpler to develop, test, deploy, and reason about when the team and domain are small.
		- But monoliths have failure modes at scale:
			- **Deployment coupling** — changing one module requires deploying the entire application. A bug in the checkout flow can block a fix to the user profile page.
			- **Scaling coupling** — if the search feature needs 10× more CPU, you have to scale the entire monolith, including the checkout, auth, and email modules that are perfectly fine at their current scale.
			- **Technology coupling** — the whole application uses the same language, framework, and database. If a new team wants to use a better tool for their problem (Go for a high-throughput service, PostgreSQL for a relational domain), they can't.
			- **Team coupling** — as the team grows, dozens of engineers all changing the same codebase creates merge conflicts, coordination overhead, and the classic "who owns this code?" problem.
		- Microservices solve these problems by making each business capability **independently deployable, scalable, and ownable**. The tradeoff: you move complexity from the application into the infrastructure and the network.
	-
	- ## The History
		- The term "microservices" was popularized around **2011–2012** by a group of architects (James Lewis, Martin Fowler, and others) who were independently converging on similar patterns at different companies — Netflix, Amazon, Google, Twitter — as they hit the limits of large monolithic systems.
		- **Amazon's two-pizza teams** (2002, Jeff Bezos's mandate) pre-date the term but embody the principle: a team that can be fed by two pizzas should own a service end-to-end — from code to production. This forced Amazon to decompose their monolith into services, eventually becoming AWS.
		- **Netflix's microservices migration** (2008–2012) is the most famous case study. After a database corruption event nearly destroyed the company, they rebuilt their entire streaming platform as hundreds of microservices. This also led them to create Hystrix (circuit breaker), Eureka (service discovery), Ribbon (client-side load balancing), and Zuul (API gateway) — most of which are now standard patterns across the industry.
		- [[System Design Microservices]] covers the distributed systems patterns that underpin this architecture. [[DevOps]] covers the CI/CD pipelines that make independent deployment practical.
- # Introduction
	- Microservices is not a technology — it's an **organizational and architectural pattern**. The technology (containers, Kubernetes, service meshes) enables it, but the core idea is about **aligning software boundaries with business capabilities and team ownership**.
	-
	- ## Microservices Knowledge Map
	  collapsed:: true
		- ```mermaid
		  mindmap
		    root((Microservices))
		      Design Principles
		        Single Responsibility
		        Domain-Driven Design
		        Bounded Context
		        Database Per Service
		        Loose Coupling
		        High Cohesion
		      Communication
		        REST APIs
		        gRPC
		        Message Queues
		        Event Streaming Kafka
		        GraphQL Federation
		      Resilience Patterns
		        Circuit Breaker
		        Retry + Backoff
		        Bulkhead
		        Timeout
		        Fallback
		      Data Patterns
		        Saga Pattern
		        CQRS
		        Event Sourcing
		        Outbox Pattern
		        API Composition
		      Infrastructure
		        Docker Containers
		        Kubernetes
		        Service Mesh Istio
		        API Gateway
		        Service Discovery
		      Observability
		        Distributed Tracing
		        Centralized Logging
		        Service Metrics
		        Health Checks
		  ```
	-
	- ## When to Use Microservices
		- > [!warning] Don't Start with Microservices
		  > Monolith first. Always. Extract services only when you have clear pain points — not because microservices sound modern.
		  > A poorly designed microservices architecture is called a **distributed monolith**: all the complexity of distributed systems, none of the independence benefits.
		- ```mermaid
		  flowchart TD
		      Start["New project?"]
		      SmallTeam{"Team < 10 engineers?"}
		      ClearBoundaries{"Clear domain\nboundaries?"}
		      ScalePain{"Scaling pain?\nDeployment friction?"}
		      Monolith["✅ Start with Monolith\nSimple, fast, easy to change"]
		      ModularMonolith["✅ Modular Monolith\nInternal modules, single deploy"]
		      Extract["Extract Services\nStrangler Fig Pattern"]
		      Microservices["🏗️ Microservices"]
		      Start --> SmallTeam
		      SmallTeam -->|Yes| Monolith
		      SmallTeam -->|No| ClearBoundaries
		      ClearBoundaries -->|No| ModularMonolith
		      ClearBoundaries -->|Yes| ScalePain
		      ScalePain -->|No| ModularMonolith
		      ScalePain -->|Yes| Extract --> Microservices
		  ```
- # Domain-Driven Design (DDD)
  collapsed:: true
	- ## Why DDD is the Foundation
		- The hardest part of microservices is not the technology — it's **where to draw the service boundaries**. Draw them wrong and you create tight coupling between services (they have to call each other constantly, transactions span multiple services, one going down breaks others). Draw them right and you get true independence.
		- Domain-Driven Design (DDD), popularized by Eric Evans in his 2003 book *Domain-Driven Design*, gives us the vocabulary and tools to find the right boundaries. The central concept is the **Bounded Context** — a logical boundary within which a particular domain model applies and is consistent.
	-
	- ## Bounded Contexts in Practice
		- Different parts of your business use the same words to mean different things. "Customer" in the billing context means an entity with a payment method. "Customer" in the shipping context means an entity with a delivery address. "Customer" in the support context means an entity with a ticket history. These are three different models, and they should live in three different services.
		- ```
		  E-Commerce Domain — Bounded Contexts:
		  ─────────────────────────────────────────────────────────────────
		  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐
		  │  CATALOG CTX    │  │   ORDER CTX      │  │  SHIPPING CTX       │
		  │  Product:       │  │  Order:          │  │  Shipment:          │
		  │  - name         │  │  - id            │  │  - tracking_number  │
		  │  - description  │  │  - items[]       │  │  - carrier          │
		  │  - price        │  │  - total         │  │  - estimated_date   │
		  │  - inventory    │  │  - status        │  │  - address          │
		  │  - images       │  │  - customer_id   │  │  - order_id         │
		  └─────────────────┘  └─────────────────┘  └─────────────────────┘
		  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐
		  │  PAYMENT CTX    │  │  IDENTITY CTX    │  │  NOTIFICATION CTX   │
		  │  Customer:      │  │  User:           │  │  Recipient:         │
		  │  - payment_info │  │  - email         │  │  - email            │
		  │  - billing_addr │  │  - password_hash │  │  - preferences      │
		  │  - stripe_id    │  │  - roles         │  │  - templates[]      │
		  └─────────────────┘  └─────────────────┘  └─────────────────────┘
		  
		  Each context has its OWN database, its OWN definition of "Customer",
		  and communicates with others via events or APIs — not shared tables.
		  ```
	-
	- ## Strangler Fig Pattern — Migrating from Monolith
		- The safest way to migrate a monolith to microservices is the **Strangler Fig Pattern** (Martin Fowler, 2004) — named after the strangler fig tree, which grows around an existing tree and gradually replaces it.
		- ```
		  Migration steps:
		  ─────────────────────────────────────────────────────────────────
		  1. Add API Gateway / Facade in front of monolith
		     All traffic still goes through monolith initially
		  
		  2. Extract ONE high-value service (usually the one with scaling pain)
		     → Payment service extracted to its own codebase + database
		     → API Gateway routes /payment/* to new service, rest to monolith
		     → Run in parallel, validate behavior matches
		  
		  3. Repeat for next service — never touch what's working
		     → User service, catalog service, order service...
		  
		  4. Monolith shrinks as more is extracted
		     Eventually: no monolith left, or it becomes a thin shell
		  
		  Key rules:
		  - Never big-bang rewrite (high risk, months of no features)
		  - Extract one bounded context at a time
		  - Keep new service behavior identical to monolith for a period
		  - Use feature flags to route traffic gradually
		  ```
- # Service Communication
  collapsed:: true
	- ## Synchronous vs Asynchronous Communication
		- The most fundamental design decision in microservices is whether services communicate **synchronously** (caller waits for response) or **asynchronously** (fire and forget, response via event).
		- Both have their place. Understanding when to use each prevents the most common microservices mistake: using synchronous REST for everything and creating chains of dependencies that fail together.
		- | Mode | When the Caller | Best For | Risk |
		  |------|----------------|---------|------|
		  | **Synchronous (REST/gRPC)** | Waits for response | Queries, user-facing reads, simple actions | Cascading failures if downstream is slow/down |
		  | **Asynchronous (Events/Queue)** | Fires and moves on | Background work, notifications, multi-step workflows | Eventual consistency, harder debugging |
		- ```mermaid
		  graph LR
		      subgraph Sync["Synchronous — direct call"]
		          Client1["Client"]
		          Order1["Order Service"]
		          Payment1["Payment Service"]
		          Client1 -->|"POST /orders (waits)"| Order1
		          Order1 -->|"POST /payments (waits)"| Payment1
		          Payment1 -->|"result"| Order1
		          Order1 -->|"result"| Client1
		      end
		      subgraph Async["Asynchronous — event-driven"]
		          Client2["Client"]
		          Order2["Order Service"]
		          Queue["Message Queue\nKafka / RabbitMQ"]
		          Payment2["Payment Service"]
		          Email2["Email Service"]
		          Client2 -->|"POST /orders (returns 202)"| Order2
		          Order2 -->|"OrderCreated event"| Queue
		          Queue -->|"consume"| Payment2
		          Queue -->|"consume"| Email2
		      end
		  ```
	-
	- ## REST API Design Between Services
		- Internal service-to-service REST APIs follow slightly different rules than public APIs — they can use richer error codes, assume machine consumers, and use internal auth (service tokens / mTLS).
		- ```python title="service_client.py — resilient service-to-service HTTP client"
		  import httpx
		  import tenacity
		  import logging
		  from opentelemetry.propagate import inject   # propagate trace context
		  
		  log = logging.getLogger(__name__)
		  
		  class InventoryServiceClient:
		      """Typed client for the Inventory Service with built-in resilience."""
		  
		      def __init__(self, base_url: str, service_token: str):
		          # httpx with connection pooling + timeouts
		          self._client = httpx.AsyncClient(
		              base_url    = base_url,
		              timeout     = httpx.Timeout(connect=2.0, read=5.0, write=2.0, pool=2.0),
		              headers     = {
		                  "Authorization": f"Bearer {service_token}",
		                  "Content-Type":  "application/json",
		                  "X-Service-Name": "order-service",
		              },
		              limits = httpx.Limits(max_connections=100, max_keepalive_connections=20),
		          )
		  
		      @tenacity.retry(
		          stop    = tenacity.stop_after_attempt(3),
		          wait    = tenacity.wait_exponential(multiplier=0.5, min=0.5, max=5),
		          retry   = tenacity.retry_if_exception_type(httpx.TransientError),
		          reraise = True,
		      )
		      async def check_stock(self, sku: str, quantity: int) -> dict:
		          """Check if SKU is in stock. Retries on transient errors."""
		          headers = {}
		          inject(headers)   # propagate OpenTelemetry trace context
		  
		          response = await self._client.get(
		              f"/inventory/{sku}",
		              params  = {"quantity": quantity},
		              headers = headers,
		          )
		          response.raise_for_status()
		          return response.json()
		  
		      async def reserve_stock(self, sku: str, quantity: int, order_id: str) -> bool:
		          """Reserve stock for an order. Idempotent via order_id."""
		          response = await self._client.post(
		              f"/inventory/{sku}/reserve",
		              json = {"quantity": quantity, "order_id": order_id},
		          )
		          if response.status_code == 409:
		              return False     # insufficient stock
		          response.raise_for_status()
		          return True
		  
		      async def close(self):
		          await self._client.aclose()
		  ```
	-
	- ## gRPC — High-Performance Service Communication
		- gRPC (Google Remote Procedure Call) is the standard for **high-throughput, low-latency internal service communication**. It uses HTTP/2 (multiplexed streams, binary framing) and Protocol Buffers (compact binary serialization) — typically 5–10× more efficient than JSON over HTTP/1.1.
		- Use gRPC for: high-frequency internal calls between services, streaming data (server-push events, bidirectional streams), and polyglot services (gRPC has clients in every major language from the same `.proto` file).
		- ```protobuf title="inventory.proto — service definition"
		  syntax = "proto3";
		  package inventory.v1;
		  
		  service InventoryService {
		    rpc CheckStock    (CheckStockRequest)   returns (CheckStockResponse);
		    rpc ReserveStock  (ReserveStockRequest) returns (ReserveStockResponse);
		    rpc ReleaseStock  (ReleaseStockRequest) returns (ReleaseStockResponse);
		    // Server-streaming: push stock updates as they happen
		    rpc WatchStock    (WatchStockRequest)   returns (stream StockUpdate);
		  }
		  
		  message CheckStockRequest {
		    string sku      = 1;
		    int32  quantity = 2;
		  }
		  
		  message CheckStockResponse {
		    bool   available      = 1;
		    int32  quantity_left  = 2;
		    string warehouse_id   = 3;
		  }
		  
		  message ReserveStockRequest {
		    string sku       = 1;
		    int32  quantity  = 2;
		    string order_id  = 3;    // idempotency key
		  }
		  
		  message ReserveStockResponse {
		    bool   success      = 1;
		    string reservation_id = 2;
		    string error_message  = 3;
		  }
		  ```
	-
	- ## Event-Driven Communication with Kafka
		- For asynchronous communication between services, Apache Kafka is the industry standard for high-throughput, durable event streaming. Services publish events to topics; other services subscribe and react. This enables true decoupling — the publisher doesn't know or care who is consuming its events.
		- The key benefit over direct HTTP: if the email service is down for 10 minutes, Kafka holds the `OrderCreated` events and delivers them when the service comes back up. No events lost, no cascading failure.
		- ```python title="event_producer.py — publish events to Kafka"
		  from confluent_kafka import Producer
		  from dataclasses import dataclass, asdict
		  import json
		  import uuid
		  from datetime import datetime, timezone
		  
		  @dataclass
		  class OrderCreatedEvent:
		      """Domain event — published when a new order is placed."""
		      event_id:    str
		      event_type:  str
		      occurred_at: str
		      order_id:    str
		      customer_id: str
		      items:       list[dict]
		      total_amount: float
		      currency:    str = "USD"
		  
		      @staticmethod
		      def create(order) -> "OrderCreatedEvent":
		          return OrderCreatedEvent(
		              event_id    = str(uuid.uuid4()),
		              event_type  = "order.created",
		              occurred_at = datetime.now(timezone.utc).isoformat(),
		              order_id    = order.id,
		              customer_id = order.customer_id,
		              items       = [{"sku": i.sku, "qty": i.quantity} for i in order.items],
		              total_amount = order.total,
		          )
		  
		  class EventPublisher:
		      def __init__(self, bootstrap_servers: str):
		          self._producer = Producer({
		              "bootstrap.servers":     bootstrap_servers,
		              "acks":                  "all",         # wait for all replicas
		              "enable.idempotence":    True,          # exactly-once delivery
		              "compression.type":      "snappy",
		              "max.in.flight.requests.per.connection": 5,
		          })
		  
		      def publish(self, topic: str, event, key: str = None):
		          """Publish an event. key = partition key (e.g. customer_id for ordering)."""
		          payload = json.dumps(asdict(event)).encode()
		          self._producer.produce(
		              topic    = topic,
		              key      = (key or event.event_id).encode(),
		              value    = payload,
		              on_delivery = self._on_delivery,
		          )
		          self._producer.poll(0)   # trigger callbacks
		  
		      def flush(self):
		          self._producer.flush(timeout=10)
		  
		      @staticmethod
		      def _on_delivery(err, msg):
		          if err:
		              log.error(f"Kafka delivery failed: {err}")
		          else:
		              log.debug(f"Event delivered: topic={msg.topic()} partition={msg.partition()}")
		  ```
		- ```python title="event_consumer.py — consume and process events"
		  from confluent_kafka import Consumer, KafkaError
		  import json, logging
		  
		  log = logging.getLogger(__name__)
		  
		  class OrderEventConsumer:
		      def __init__(self, bootstrap_servers: str, group_id: str):
		          self._consumer = Consumer({
		              "bootstrap.servers":  bootstrap_servers,
		              "group.id":           group_id,
		              "auto.offset.reset":  "earliest",
		              "enable.auto.commit": False,       # manual commit for at-least-once
		              "max.poll.interval.ms": 300_000,
		          })
		          self._consumer.subscribe(["orders.created", "orders.cancelled"])
		  
		      def run(self):
		          log.info("Starting event consumer...")
		          while True:
		              msg = self._consumer.poll(timeout=1.0)
		              if msg is None:
		                  continue
		              if msg.error():
		                  if msg.error().code() == KafkaError._PARTITION_EOF:
		                      continue
		                  log.error(f"Consumer error: {msg.error()}")
		                  continue
		  
		              try:
		                  event = json.loads(msg.value())
		                  self._handle(event)
		                  self._consumer.commit(msg)    # only commit after successful processing
		              except Exception as e:
		                  log.error(f"Failed processing event: {e}", exc_info=True)
		                  # Don't commit — message will be redelivered
		                  # Send to dead-letter topic after N failures
		  
		      def _handle(self, event: dict):
		          match event.get("event_type"):
		              case "order.created":
		                  self._on_order_created(event)
		              case "order.cancelled":
		                  self._on_order_cancelled(event)
		              case _:
		                  log.warning(f"Unknown event type: {event.get('event_type')}")
		  
		      def _on_order_created(self, event: dict):
		          # Send confirmation email
		          log.info(f"Sending confirmation email for order {event['order_id']}")
		          # ... email logic ...
		  ```
- # Resilience Patterns
  collapsed:: true
	- ## Why Services Fail — and How to Contain It
		- In a distributed system, failure is not an exception — it is the norm. Networks partition, services get overloaded, deployments introduce bugs, third-party APIs have outages. The question is not "will something fail?" but "when something fails, how do we contain the blast radius?"
		- Without resilience patterns, a single slow or failing downstream service causes a **cascading failure**: threads pile up waiting for the slow response, connection pools exhaust, the upstream service starts failing too, and the failure propagates until the entire system is down. Netflix's Hystrix (and its successor Resilience4j) exist precisely because they saw this cascade pattern destroy their early microservices architecture.
	-
	- ## Circuit Breaker Pattern
		- The circuit breaker is the most important resilience pattern in microservices. It wraps calls to a downstream service with a state machine that **opens** (stops making calls) when the downstream is failing, giving it time to recover, then **half-opens** to test recovery.
		- ```python title="circuit_breaker.py — circuit breaker implementation"
		  import time
		  import threading
		  from enum import Enum
		  from dataclasses import dataclass, field
		  from typing import Callable, Any
		  
		  class State(Enum):
		      CLOSED    = "closed"       # normal — calls pass through
		      OPEN      = "open"         # failing — calls blocked, return fallback
		      HALF_OPEN = "half_open"    # testing — one probe call allowed
		  
		  @dataclass
		  class CircuitBreakerConfig:
		      failure_threshold:    int   = 5     # failures before opening
		      recovery_timeout:     float = 30.0  # seconds before trying half-open
		      half_open_max_calls:  int   = 3     # probe calls in half-open
		      success_threshold:    int   = 2     # successes to close from half-open
		  
		  class CircuitBreaker:
		      """Thread-safe circuit breaker for service calls."""
		  
		      def __init__(self, name: str, config: CircuitBreakerConfig = None):
		          self.name              = name
		          self.config            = config or CircuitBreakerConfig()
		          self._state            = State.CLOSED
		          self._failure_count    = 0
		          self._success_count    = 0
		          self._last_failure_at  = 0.0
		          self._lock             = threading.Lock()
		  
		      @property
		      def state(self) -> State:
		          with self._lock:
		              if self._state == State.OPEN:
		                  if time.time() - self._last_failure_at > self.config.recovery_timeout:
		                      self._state = State.HALF_OPEN
		                      self._success_count = 0
		              return self._state
		  
		      def call(self, func: Callable, *args, fallback=None, **kwargs) -> Any:
		          """Execute func through circuit breaker. Returns fallback if open."""
		          if self.state == State.OPEN:
		              if fallback is not None:
		                  return fallback() if callable(fallback) else fallback
		              raise CircuitOpenError(f"Circuit {self.name} is OPEN")
		  
		          try:
		              result = func(*args, **kwargs)
		              self._on_success()
		              return result
		          except Exception as e:
		              self._on_failure()
		              raise
		  
		      def _on_success(self):
		          with self._lock:
		              self._failure_count = 0
		              if self._state == State.HALF_OPEN:
		                  self._success_count += 1
		                  if self._success_count >= self.config.success_threshold:
		                      self._state = State.CLOSED
		  
		      def _on_failure(self):
		          with self._lock:
		              self._failure_count    += 1
		              self._last_failure_at   = time.time()
		              if self._failure_count >= self.config.failure_threshold:
		                  self._state = State.OPEN
		  ```
	-
	- ## Retry with Exponential Backoff + Jitter
		- Retrying immediately after a failure often makes things worse — if 100 services all retry at the same time, you create a **retry storm** that overwhelms the recovering service. The solution is exponential backoff (wait longer between each retry) plus jitter (add randomness to spread retries in time).
		- ```python title="retry_pattern.py — retry with backoff and jitter"
		  import time
		  import random
		  import logging
		  from functools import wraps
		  from typing import Type
		  
		  log = logging.getLogger(__name__)
		  
		  def retry_with_backoff(
		      max_attempts:    int   = 3,
		      base_delay:      float = 0.5,    # seconds
		      max_delay:       float = 30.0,
		      backoff_factor:  float = 2.0,
		      jitter:          bool  = True,    # add randomness
		      retryable_errors: tuple = (Exception,),
		  ):
		      """Decorator: retry on exception with exponential backoff."""
		      def decorator(func):
		          @wraps(func)
		          def wrapper(*args, **kwargs):
		              for attempt in range(1, max_attempts + 1):
		                  try:
		                      return func(*args, **kwargs)
		                  except retryable_errors as e:
		                      if attempt == max_attempts:
		                          log.error(f"{func.__name__} failed after {max_attempts} attempts")
		                          raise
		                      delay = min(base_delay * (backoff_factor ** (attempt - 1)), max_delay)
		                      if jitter:
		                          delay *= (0.5 + random.random())  # ±50% jitter
		                      log.warning(f"{func.__name__} attempt {attempt} failed: {e}. Retry in {delay:.1f}s")
		                      time.sleep(delay)
		          return wrapper
		      return decorator
		  
		  # Usage:
		  # @retry_with_backoff(max_attempts=3, base_delay=1.0, retryable_errors=(httpx.TransientError,))
		  # async def call_payment_service(order_id: str): ...
		  ```
	-
	- ## Bulkhead Pattern
		- Named after the watertight compartments of a ship — if one compartment floods, the others stay dry. In microservices: isolate resource pools per dependency so one slow service can't exhaust all threads/connections and bring down the entire application.
		- ```python title="bulkhead_pattern.py — thread pool isolation"
		  import concurrent.futures
		  import threading
		  
		  class BulkheadExecutor:
		      """Isolate calls to each service in a separate thread pool."""
		  
		      def __init__(self):
		          # Each service gets its own pool — exhausting one doesn't affect others
		          self._pools = {
		              "payment-service":   concurrent.futures.ThreadPoolExecutor(max_workers=10),
		              "inventory-service": concurrent.futures.ThreadPoolExecutor(max_workers=20),
		              "email-service":     concurrent.futures.ThreadPoolExecutor(max_workers=5),
		          }
		          self._semaphores = {
		              name: threading.Semaphore(pool._max_workers)
		              for name, pool in self._pools.items()
		          }
		  
		      def submit(self, service_name: str, func, *args, **kwargs):
		          pool = self._pools.get(service_name)
		          sem  = self._semaphores.get(service_name)
		          if pool is None:
		              raise ValueError(f"Unknown service: {service_name}")
		  
		          if not sem.acquire(blocking=False):
		              raise BulkheadFullError(f"Bulkhead full for {service_name}")
		  
		          try:
		              future = pool.submit(func, *args, **kwargs)
		              future.add_done_callback(lambda _: sem.release())
		              return future
		          except Exception:
		              sem.release()
		              raise
		  ```
- # Data Management Patterns
  collapsed:: true
	- ## Database Per Service — The Hard Rule
		- The most important data rule in microservices: **each service owns its database, and no other service can access it directly**. No shared tables. No read-only access to another service's database. If Service A needs data owned by Service B, it calls Service B's API.
		- This seems strict, but it enables true independence: Service B can change its schema, switch database engines, or restructure its data model without breaking Service A, because Service A doesn't know how Service B stores data — only what Service B's API returns.
		- ```
		  Wrong: shared database                   Right: database per service
		  ─────────────────────────               ─────────────────────────────────────
		  ┌──────────────────────┐               ┌──────────┐  ┌──────────┐  ┌──────────┐
		  │    Shared DB         │               │ Order DB │  │ User DB  │  │ Pay DB   │
		  │  orders table        │               │(Postgres)│  │(MongoDB) │  │(MySQL)   │
		  │  users table         │               └────┬─────┘  └────┬─────┘  └────┬─────┘
		  │  payments table      │                    │              │              │
		  │  inventory table     │               ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐
		  └──────────────────────┘               │ Order    │  │ User     │  │Payment   │
		         │    │    │                     │ Service  │  │ Service  │  │Service   │
		  ┌──────┘ ┌──┘ ┌──┘                     └──────────┘  └──────────┘  └──────────┘
		  │Order   │User│Pay
		  │Service │Svc │Svc
		  ```
	-
	- ## Saga Pattern — Distributed Transactions
		- In a monolith, a database transaction wraps multiple operations in an ACID guarantee. In microservices, a user action often spans multiple services and databases — placing an order requires reserving inventory, charging the customer, and creating a shipment. You can't use a single database transaction across service boundaries.
		- The **Saga pattern** breaks a distributed transaction into a sequence of local transactions, each publishing an event that triggers the next step. If any step fails, compensating transactions undo the previous steps.
		- ```mermaid
		  sequenceDiagram
		      participant Client
		      participant OrderSvc as Order Service
		      participant InventorySvc as Inventory Service
		      participant PaymentSvc as Payment Service
		      participant ShipSvc as Shipping Service
		  
		      Client->>OrderSvc: Place Order
		      OrderSvc->>OrderSvc: Create order (PENDING)
		      OrderSvc-->>InventorySvc: OrderCreated event
		  
		      InventorySvc->>InventorySvc: Reserve stock
		      InventorySvc-->>PaymentSvc: StockReserved event
		  
		      PaymentSvc->>PaymentSvc: Charge customer
		      PaymentSvc-->>ShipSvc: PaymentCompleted event
		  
		      ShipSvc->>ShipSvc: Create shipment
		      ShipSvc-->>OrderSvc: ShipmentCreated event
		      OrderSvc->>OrderSvc: Update order (CONFIRMED)
		      OrderSvc-->>Client: Order confirmed
		  
		      Note over PaymentSvc,ShipSvc: If Payment FAILS:
		      PaymentSvc-->>InventorySvc: PaymentFailed event
		      InventorySvc->>InventorySvc: Release reserved stock (compensate)
		      InventorySvc-->>OrderSvc: StockReleased event
		      OrderSvc->>OrderSvc: Update order (FAILED)
		  ```
	-
	- ## CQRS — Command Query Responsibility Segregation
		- CQRS separates **write operations** (commands — "place an order") from **read operations** (queries — "get my order history"). The write model is optimized for consistency and business rules; the read model is optimized for query patterns and performance.
		- This is especially powerful in microservices where read patterns and write patterns have very different requirements. The order service writes to a normalized PostgreSQL database (strong consistency). The order history dashboard reads from an Elasticsearch index (full-text search, complex aggregations). Both are updated from the same events.
		- ```python title="cqrs_pattern.py — command and query separation"
		  from dataclasses import dataclass
		  from abc import ABC, abstractmethod
		  
		  # ── Commands (write side) ──────────────────────────────────────────
		  @dataclass
		  class PlaceOrderCommand:
		      customer_id: str
		      items:       list[dict]
		      currency:    str = "USD"
		  
		  @dataclass
		  class CancelOrderCommand:
		      order_id:   str
		      reason:     str
		      cancelled_by: str
		  
		  class OrderCommandHandler:
		      """Handles write operations — enforces business rules, writes to DB."""
		  
		      def __init__(self, order_repo, event_publisher):
		          self.repo      = order_repo
		          self.publisher = event_publisher
		  
		      def handle_place_order(self, cmd: PlaceOrderCommand) -> str:
		          # Business rule validation
		          if not cmd.items:
		              raise ValueError("Order must have at least one item")
		  
		          # Create order (write to normalized DB)
		          order = Order(customer_id=cmd.customer_id, items=cmd.items)
		          self.repo.save(order)
		  
		          # Publish event (read models will be updated asynchronously)
		          self.publisher.publish("orders", OrderCreatedEvent.create(order))
		  
		          return order.id
		  
		  # ── Queries (read side) ────────────────────────────────────────────
		  @dataclass
		  class OrderSummary:
		      """Denormalized read model — optimized for display."""
		      order_id:      str
		      status:        str
		      total_display: str    # "$99.99" pre-formatted
		      item_count:    int
		      created_at:    str   # "2 hours ago" pre-formatted
		  
		  class OrderQueryHandler:
		      """Handles read operations — reads from denormalized read store."""
		  
		      def __init__(self, read_store):    # Elasticsearch, Redis, read replica
		          self.store = read_store
		  
		      def get_order_history(self, customer_id: str, page: int = 1) -> list[OrderSummary]:
		          """Fast read from pre-computed read model."""
		          return self.store.search(
		              query    = {"customer_id": customer_id},
		              sort     = [{"created_at": "desc"}],
		              from_    = (page - 1) * 20,
		              size     = 20,
		          )
		  ```
	-
	- ## Outbox Pattern — Reliable Event Publishing
		- A subtle but critical problem: your service writes to its database and then publishes an event to Kafka. What if the service crashes after the database write but before the Kafka publish? The order exists in the database but no downstream services know about it — silent data inconsistency.
		- The **Outbox Pattern** solves this by writing the event to an `outbox` table in the **same database transaction** as the business data. A separate process reads the outbox and publishes to Kafka, then marks events as published. Database transaction guarantees both writes happen atomically.
		- ```sql title="outbox_table.sql — outbox pattern schema"
		  -- Outbox table in the same DB as business data
		  CREATE TABLE outbox_events (
		      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		      aggregate_type  VARCHAR(100) NOT NULL,   -- 'Order'
		      aggregate_id    VARCHAR(100) NOT NULL,   -- order_id
		      event_type      VARCHAR(100) NOT NULL,   -- 'order.created'
		      payload         JSONB        NOT NULL,   -- event data
		      created_at      TIMESTAMPTZ  DEFAULT NOW(),
		      published_at    TIMESTAMPTZ,             -- NULL = not yet published
		      published       BOOLEAN      DEFAULT FALSE
		  );
		  
		  CREATE INDEX idx_outbox_unpublished ON outbox_events (created_at)
		      WHERE published = FALSE;
		  ```
		- ```python title="outbox_publisher.py — polling outbox and publishing"
		  import asyncio, json, logging
		  from datetime import datetime, timezone
		  
		  log = logging.getLogger(__name__)
		  
		  class OutboxPublisher:
		      """Polls outbox table and publishes pending events to Kafka."""
		  
		      def __init__(self, db_pool, kafka_producer, poll_interval: float = 1.0):
		          self.db       = db_pool
		          self.kafka    = kafka_producer
		          self.interval = poll_interval
		  
		      async def run(self):
		          log.info("Outbox publisher started")
		          while True:
		              try:
		                  await self._publish_pending()
		              except Exception as e:
		                  log.error(f"Outbox error: {e}", exc_info=True)
		              await asyncio.sleep(self.interval)
		  
		      async def _publish_pending(self):
		          async with self.db.transaction():
		              # Fetch with row-level lock to prevent duplicate processing
		              events = await self.db.fetch("""
		                  SELECT id, aggregate_type, aggregate_id, event_type, payload
		                  FROM outbox_events
		                  WHERE published = FALSE
		                  ORDER BY created_at
		                  LIMIT 100
		                  FOR UPDATE SKIP LOCKED
		              """)
		  
		              for event in events:
		                  topic = f"{event['aggregate_type'].lower()}s"
		                  await self.kafka.publish(
		                      topic = topic,
		                      key   = event['aggregate_id'],
		                      value = event['payload'],
		                  )
		                  await self.db.execute("""
		                      UPDATE outbox_events
		                      SET published = TRUE, published_at = $1
		                      WHERE id = $2
		                  """, datetime.now(timezone.utc), event['id'])
		  ```
- # API Gateway & Service Discovery
  collapsed:: true
	- ## API Gateway — The Front Door
		- An API gateway is the **single entry point** for all external traffic into your microservices cluster. Clients call one address; the gateway routes, authenticates, rate-limits, and load-balances requests to the appropriate internal services.
		- ```mermaid
		  graph LR
		      Mobile["📱 Mobile App"]
		      Web["🌐 Web Browser"]
		      Partner["🤝 Partner API"]
		      GW["API Gateway\nKong · AWS API GW · Traefik · Nginx\n────────────────\nAuth · Rate Limiting\nLoad Balancing · SSL\nRequest Routing · Logging"]
		      US["User Service\n:3001"]
		      PS["Product Service\n:3002"]
		      OS["Order Service\n:3003"]
		      PAY["Payment Service\n:3004"]
		      Mobile --> GW
		      Web    --> GW
		      Partner--> GW
		      GW --> US
		      GW --> PS
		      GW --> OS
		      GW --> PAY
		  ```
		- The gateway handles cross-cutting concerns **once**, so individual services don't have to: JWT validation, rate limiting, CORS, request/response logging, TLS termination, request ID injection, and blue-green traffic splitting.
	-
	- ## Service Discovery
		- Services in Kubernetes get stable DNS names via Kubernetes Services — `http://payment-service.production.svc.cluster.local` always routes to healthy payment pods regardless of which nodes they're running on. This is **server-side discovery** built into [[DevOps]] Kubernetes infrastructure.
		- Outside Kubernetes, or in non-containerized environments, service discovery is handled by Consul, Eureka, or etcd — services register themselves at startup, health checks keep registrations current, and clients query the registry for healthy instance addresses.
- # Service Mesh
  collapsed:: true
	- ## What is a Service Mesh
		- A service mesh adds a **sidecar proxy** (typically Envoy) next to every service pod. All traffic in and out of the pod goes through the sidecar, which handles mTLS, load balancing, circuit breaking, retries, observability (traces, metrics), and traffic management — without any changes to application code.
		- The most widely used service meshes are **Istio** (Envoy-based, feature-rich, complex) and **Linkerd** (lighter, simpler, faster). They are the correct place to implement service-to-service security and observability in large microservices deployments.
		- ```yaml title="istio_virtual_service.yaml — traffic management example"
		  # Canary release: 90% traffic to v1, 10% to v2
		  apiVersion: networking.istio.io/v1beta1
		  kind: VirtualService
		  metadata:
		    name: payment-service
		  spec:
		    hosts:
		      - payment-service
		    http:
		      - route:
		          - destination:
		              host:   payment-service
		              subset: v1
		              weight: 90
		          - destination:
		              host:   payment-service
		              subset: v2
		              weight: 10
		  ---
		  # Circuit breaker via DestinationRule
		  apiVersion: networking.istio.io/v1beta1
		  kind: DestinationRule
		  metadata:
		    name: payment-service
		  spec:
		    host: payment-service
		    trafficPolicy:
		      connectionPool:
		        tcp:
		          maxConnections: 100
		        http:
		          http2MaxRequests:       1000
		          pendingRequests:        100
		      outlierDetection:
		        consecutive5xxErrors: 5
		        interval:             10s
		        baseEjectionTime:     30s   # eject unhealthy pods for 30s
		    subsets:
		      - name: v1
		        labels:
		          version: v1
		      - name: v2
		        labels:
		          version: v2
		  ```
- # Observability in Microservices
  collapsed:: true
	- ## Why Standard Observability Is Not Enough
		- Standard application monitoring (is the server up? is CPU < 80%?) is insufficient for microservices. When a user reports "checkout is broken," you need to know which of 15 services in the checkout path is failing, what changed recently, and how it correlates with other incidents.
		- The minimum observability stack for microservices:
			- **Distributed tracing** — OpenTelemetry → Jaeger/Tempo. Trace every request across all services. Without this, debugging latency or errors in a call chain is guesswork. See [[Continuous Monitoring & Logging]] for the full implementation guide.
			- **Centralized logging** — structured JSON logs from all services → Loki or ELK. Correlated by `trace_id` so you can jump from a trace span to the associated log lines. Covered deeply in [[Continuous Monitoring & Logging]].
			- **Service-level metrics** — each service exposes a `/metrics` endpoint with request rate, error rate, and latency (the RED method: Rate, Errors, Duration). Prometheus + Grafana visualizes these.
			- **Health checks** — `/health` (liveness) and `/ready` (readiness) endpoints so Kubernetes knows when to restart a pod vs. when to stop sending traffic to it.
		- ```python title="health_checks.py — liveness and readiness endpoints"
		  from fastapi import FastAPI, status
		  from datetime import datetime, timezone
		  
		  app = FastAPI()
		  
		  @app.get("/health")    # liveness — is the process alive?
		  async def liveness():
		      """Returns 200 if the application process is running.
		      Kubernetes restarts the pod if this returns non-2xx."""
		      return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}
		  
		  @app.get("/ready")     # readiness — is the service ready for traffic?
		  async def readiness():
		      """Returns 200 only if all dependencies are available.
		      Kubernetes stops routing traffic if this returns non-2xx."""
		      checks = {}
		      overall_ok = True
		  
		      # Check database
		      try:
		          await db.execute("SELECT 1")
		          checks["database"] = "ok"
		      except Exception as e:
		          checks["database"] = f"error: {e}"
		          overall_ok = False
		  
		      # Check Redis
		      try:
		          await redis.ping()
		          checks["redis"] = "ok"
		      except Exception as e:
		          checks["redis"] = f"error: {e}"
		          overall_ok = False
		  
		      return (
		          {"status": "ok",       "checks": checks} if overall_ok
		          else
		          {"status": "degraded", "checks": checks}
		      ), (status.HTTP_200_OK if overall_ok else status.HTTP_503_SERVICE_UNAVAILABLE)
		  ```
- # Deployment Patterns
  collapsed:: true
	- ## Independent Deployability — The Core Promise
		- The whole point of microservices is that services can be **deployed independently**. If deploying Service A requires coordinating with Service B, you've lost the main benefit. Independent deployability requires:
			- **Backward-compatible API changes** — never remove fields, only add. Version your API when breaking changes are unavoidable.
			- **Consumer-driven contract testing** — before deploying a service, verify it still satisfies the contracts of all its consumers. Pact is the standard tool for this.
			- **Feature flags** — decouple deployment from release (covered in [[DevOps]] — Deployment Strategies).
			- **Database migrations that are backward compatible** — never rename or delete columns in a single step. Expand-Contract pattern: add new column → migrate data → update code → remove old column (separate deploys).
	-
	- ## Docker + Kubernetes for Microservices
		- Each microservice is packaged as a [[DevOps]] Docker image with its own Dockerfile, pushed to a container registry, and deployed to Kubernetes with its own Deployment, Service, ConfigMap, and HorizontalPodAutoscaler.
		- See [[DevOps]] — Containers section for the full Docker and Kubernetes reference including Deployment manifests, kubectl commands, and HPA configuration.
		- [[Infrastructure as Code IaC]] covers how to provision the Kubernetes clusters themselves using Terraform (EKS, GKE, AKS).
		- [[Continuous Monitoring & Logging]] covers how to observe all these services once they're running.
- # More Learn
	- ## Books
		- [Building Microservices — Sam Newman (O'Reilly)](https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/) — the definitive textbook, now in 2nd edition
		- [Microservices Patterns — Chris Richardson](https://microservices.io/book) — patterns catalog with code examples
		- [Domain-Driven Design — Eric Evans](https://www.domainlanguage.com/ddd/) — bounded contexts, the foundation of service decomposition
		- [Release It! — Michael Nygard](https://pragprog.com/titles/mnee2/release-it-second-edition/) — stability patterns (circuit breakers, bulkheads, timeouts)
	-
	- ## Websites
		- [microservices.io — Chris Richardson](https://microservices.io/) — the canonical microservices patterns catalog
		- [Martin Fowler on Microservices](https://martinfowler.com/articles/microservices.html) — the original 2014 article
		- [CNCF Landscape](https://landscape.cncf.io/) — all cloud-native tools including service meshes, observability, messaging
	-
	- ## YouTube
		- [Microservices Full Course — TechWorld with Nana](https://www.youtube.com/results?search_query=microservices+full+course+techworld+nana)
		- [Saga Pattern Explained](https://www.youtube.com/results?search_query=saga+pattern+microservices+tutorial)
		- [Event-Driven Architecture — Kafka](https://www.youtube.com/results?search_query=event+driven+architecture+kafka+microservices)
		- [Domain-Driven Design Tutorial](https://www.youtube.com/results?search_query=domain+driven+design+tutorial+bounded+context)
	-
	- ## Explore Further
		- Microservices architecture is the intersection of system design, DevOps, and distributed systems. Every page below is something you'll need in practice.
		-
		- **The patterns catalogue** — [[System Design Microservices]] is the companion page from a pure system design angle: API gateway design choices, service mesh tradeoffs, CQRS and event sourcing patterns, and the outbox problem — all framed for system design interviews and architectural decision-making.
		-
		- **The broader architecture context** — [[System Design]] covers scalability, caching, database choices, message queues, and rate limiting — all the decisions that happen at the microservice level and aggregate into your overall system. [[System Design APIs & Networking]] dives into REST vs gRPC vs GraphQL vs WebSockets and when each makes sense for inter-service communication. [[System Design Scalability & CAP]] explains the consistency tradeoffs that the saga pattern and eventual consistency in this page are responding to.
		-
		- **Deploying and operating your services** — [[DevOps]] covers Docker, Kubernetes, GitOps with ArgoCD, and the CI/CD pipelines that make independent deployment practical. The microservices promise of "deploy any service at any time" only holds if you have a solid [[DevOps]] pipeline behind it. [[Continuous Integration]] and [[Continuous Delivery]] each have dedicated pages on the per-service pipeline patterns that enable this.
		-
		- **Provisioning the cluster your services run on** — [[Infrastructure as Code IaC]] covers Terraform and Ansible — how the Kubernetes cluster itself, the VPCs, load balancers, and managed databases your services connect to get created and maintained as code.
		-
		- **Seeing what your services are doing** — [[Continuous Monitoring & Logging]] is the essential companion to this page. The distributed tracing with OpenTelemetry, centralized JSON logging with trace ID correlation, and per-service RED metrics (Rate, Errors, Duration) are the observability layer that makes microservices debuggable. Without it, a 15-service request chain that fails is nearly impossible to diagnose.
		-
		- **Orchestrating multi-service workflows** — [[Automation]] covers the scripting patterns for bootstrapping and testing services. [[kestra]] handles the workflows that span multiple services: data ingestion pipelines, multi-step business processes, and event-driven automation that would otherwise become spaghetti choreography between services.
		-
		- **Securing inter-service communication** — [[Cybersecurity Architecture]] covers Zero Trust principles, mutual TLS (mTLS) between services (which the service mesh section of this page implements), and the RBAC and IAM patterns for Kubernetes service accounts. Every microservice boundary is a potential attack surface.
		-
		- **The low-level networking layer** — [[Socket]] covers the TCP/UDP socket programming that underlies every HTTP and gRPC call between your services. Understanding socket options, connection pooling, and keep-alive settings explains the performance behavior you'll see in high-throughput service-to-service calls.
		-
		- **The algorithms inside your infrastructure** — [[DSA Algo & System Design]] covers consistent hashing (used in distributed caches and databases behind your services), graph algorithms (service dependency resolution, topological sort in deployment order), and the data structures that power service discovery and load balancing under the hood.