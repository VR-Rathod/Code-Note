---
seoTitle: System Design Complete Guide – Scalability, Architecture & Interview Prep
description: "Comprehensive system design reference covering scalability, load balancing, caching, databases, microservices, CAP theorem, design patterns, and real-world case studies for software engineers and interview preparation."
keywords: "system design, scalability, load balancing, caching, microservices, CAP theorem, distributed systems, database design, API design, high availability, fault tolerance, system design interview, architecture patterns, VR-Rathod, Code-Note, code note vr, vr book"
---

- # Introduction to System Design
  collapsed:: true
	- ## Beginner to Advanced Roadmap
	  collapsed:: true
		- ```
		  BEGINNER (Start Here):
		    1. What is System Design? HLD vs LLD
		    2. Client-Server Architecture
		    3. HTTP, DNS, CDN basics
		    4. Databases: SQL vs NoSQL
		    5. Caching fundamentals (Redis)
		    6. Load Balancing basics
		  
		  INTERMEDIATE:
		    7. CAP Theorem, PACELC
		    8. Database Replication & Sharding
		    9. Message Queues (Kafka, RabbitMQ)
		    10. Microservices vs Monolith
		    11. API Design (REST, gRPC, GraphQL)
		    12. Rate Limiting algorithms
		    13. Authentication (JWT, OAuth 2.0)
		    14. Consistent Hashing
		  
		  ADVANCED:
		    15. Distributed Patterns (Circuit Breaker, Saga, Outbox)
		    16. Event Sourcing & CQRS
		    17. Distributed Locking & Leader Election
		    18. Search Systems (Elasticsearch)
		    19. Stream Processing (Kafka Streams, Flink)
		    20. Chaos Engineering & Disaster Recovery
		    21. Real-world case studies (URL shortener, Chat, YouTube)
		    22. Back-of-envelope estimation
		  ```
	-
	- ## What is System Design?
	  collapsed:: true
		- System design is the process of defining the **architecture**, **components**, **modules**, **interfaces**, and **data flow** of a system to satisfy specified requirements.
		- It bridges the gap between **requirements** and **implementation** — answering *how* a system will work, not just *what* it will do.
		- Two main types:
			- **High-Level Design (HLD)** — Overall architecture, major components, data flow, technology choices.
			- **Low-Level Design (LLD)** — Class diagrams, DB schemas, API contracts, detailed logic.
	-
	- ## Why System Design Matters
		- A poorly designed system can fail under load, become unmaintainable, or cost 10x more to fix later.
		- Good design ensures **scalability**, **reliability**, **maintainability**, and **cost efficiency**.
		- Critical for senior engineering roles and system design interviews at FAANG/top companies.
	-
	- ## System Design Interview Approach
		- ```
		  Step 1 → Clarify requirements (functional + non-functional)
		  Step 2 → Estimate scale (users, QPS, storage, bandwidth)
		  Step 3 → Define API contracts
		  Step 4 → Draw high-level architecture
		  Step 5 → Deep dive into critical components
		  Step 6 → Identify bottlenecks and trade-offs
		  Step 7 → Discuss failure scenarios and recovery
		  ```
-
- # Scalability
  collapsed:: true
	- ## What is Scalability?
	  collapsed:: true
		- The ability of a system to handle **growing amounts of work** by adding resources.
		- Two main strategies:
			- **Vertical Scaling (Scale Up)** — Add more CPU/RAM to existing machine.
			- **Horizontal Scaling (Scale Out)** — Add more machines to distribute load.
		- ```
		  Vertical Scaling:
		    [Server 4 CPU] → [Server 16 CPU]
		    Pros: Simple, no code changes
		    Cons: Hardware limits, single point of failure, expensive
		  
		  Horizontal Scaling:
		    [Server] → [Server] [Server] [Server]
		    Pros: Virtually unlimited, fault tolerant
		    Cons: Complexity, need load balancer, distributed state
		  ```
	-
	- ## Latency vs Throughput
	  collapsed:: true
		- **Latency** — Time to complete a single request (ms). Lower is better.
		- **Throughput** — Number of requests handled per second (RPS/QPS). Higher is better.
		- They often trade off — optimizing for one can hurt the other.
		- ```
		  Example:
		  Latency:    200ms per request
		  Throughput: 5000 requests/second
		  
		  Amdahl's Law: Speedup is limited by the sequential portion of a task.
		  If 20% of work is sequential → max speedup = 1 / 0.20 = 5x (no matter how many cores)
		  ```
	-
	- ## Availability vs Consistency (CAP Theorem)
	  collapsed:: true
		- **CAP Theorem**: A distributed system can only guarantee **2 of 3**:
			- **C**onsistency — Every read gets the most recent write.
			- **A**vailability — Every request gets a response (not necessarily latest data).
			- **P**artition Tolerance — System works even if network partitions occur.
		- In practice, **P is always required** (networks fail), so you choose between **CP** or **AP**.
		- ```
		  CP Systems (Consistency + Partition Tolerance):
		    → HBase, Zookeeper, MongoDB (default config)
		    → Returns error if can't guarantee consistency
		  
		  AP Systems (Availability + Partition Tolerance):
		    → Cassandra, CouchDB, DynamoDB
		    → Returns possibly stale data but always responds
		  
		  CA Systems (Consistency + Availability):
		    → Only possible in single-node (no partition tolerance)
		    → Traditional RDBMS on single server
		  ```
	-
	- ## PACELC Theorem (Extension of CAP)
	  collapsed:: true
		- Even when there's **no partition**, you still trade off **latency vs consistency**.
		- ```
		  PACELC:
		    If Partition → choose between Availability or Consistency
		    Else (no partition) → choose between Latency or Consistency
		  
		  Examples:
		    DynamoDB → PA/EL (available during partition, low latency else)
		    HBase    → PC/EC (consistent always, higher latency)
		  ```
	-
	- ## SLA, SLO, SLI
	  collapsed:: true
		- **SLI** (Service Level Indicator) — Actual measured metric (e.g., 99.5% uptime).
		- **SLO** (Service Level Objective) — Internal target (e.g., 99.9% uptime).
		- **SLA** (Service Level Agreement) — Contract with users/customers (e.g., 99.9% or refund).
		- ```
		  Availability Nines:
		  99%     → 3.65 days downtime/year
		  99.9%   → 8.76 hours downtime/year
		  99.99%  → 52.6 minutes downtime/year
		  99.999% → 5.26 minutes downtime/year
		  ```
-
- # Load Balancing
  collapsed:: true
	- ## What is a Load Balancer?
		- A load balancer distributes incoming network traffic across multiple servers to ensure **no single server is overwhelmed**.
		- Acts as a **reverse proxy** — clients talk to the LB, not directly to servers.
		- ```
		  Client → [Load Balancer] → Server 1
		                          → Server 2
		                          → Server 3
		  ```
	-
	- ## Load Balancing Algorithms
		- **Round Robin** — Requests distributed sequentially to each server in turn.
		- **Weighted Round Robin** — Servers with higher capacity get more requests.
		- **Least Connections** — Route to server with fewest active connections.
		- **IP Hash** — Same client IP always routes to same server (session stickiness).
		- **Random** — Pick a random server.
		- **Least Response Time** — Route to server with lowest latency + fewest connections.
		- ```
		  Round Robin:
		    Request 1 → Server A
		    Request 2 → Server B
		    Request 3 → Server C
		    Request 4 → Server A (cycle repeats)
		  
		  Least Connections:
		    Server A: 10 active connections
		    Server B: 3 active connections  ← next request goes here
		    Server C: 7 active connections
		  ```
	-
	- ## Layer 4 vs Layer 7 Load Balancing
		- **L4 (Transport Layer)** — Routes based on IP/TCP without inspecting content. Fast, simple.
		- **L7 (Application Layer)** — Routes based on HTTP headers, URL, cookies. Smarter, more flexible.
		- ```
		  L4 Example:
		    Route all TCP traffic on port 443 to backend pool
		  
		  L7 Example:
		    /api/*    → API servers
		    /static/* → CDN / static servers
		    /admin/*  → Admin servers
		  ```
	-
	- ## Health Checks
		- Load balancers continuously ping servers to check if they're alive.
		- **Active health check** — LB sends periodic requests (e.g., GET /health).
		- **Passive health check** — LB monitors real traffic for failures.
		- If a server fails health check → removed from pool automatically.
	-
	- ## Single Point of Failure in LB
		- The LB itself can become a SPOF.
		- Solution: **Active-Passive** or **Active-Active** LB pairs with DNS failover or floating IPs.
		- ```
		  Active-Passive:
		    Primary LB handles traffic
		    Secondary LB takes over if primary fails (heartbeat monitoring)
		  
		  Active-Active:
		    Both LBs handle traffic simultaneously
		    DNS round-robin or anycast routing
		  ```
	-
	- ## Popular Load Balancers
		- **Nginx** — High-performance HTTP/TCP load balancer and reverse proxy.
		- **HAProxy** — Reliable, high-performance TCP/HTTP load balancer.
		- **AWS ALB/NLB** — Managed cloud load balancers (Application/Network layer).
		- **Cloudflare** — Global anycast load balancing with DDoS protection.
-
- # Caching
  collapsed:: true
	- ## What is Caching?
		- Caching stores frequently accessed data in **fast storage** (memory) to reduce latency and database load.
		- Cache hit → data found in cache (fast). Cache miss → fetch from DB, store in cache (slow first time).
		- ```
		  Without Cache:
		    Request → DB query (100ms) → Response
		  
		  With Cache:
		    Request → Cache hit (1ms) → Response
		    Request → Cache miss → DB (100ms) → Store in cache → Response
		  ```
	-
	- ## Cache Placement Strategies
		- **Client-side cache** — Browser cache, local storage.
		- **CDN cache** — Static assets cached at edge nodes globally.
		- **Server-side cache** — Application-level cache (Redis, Memcached).
		- **Database cache** — Query result cache inside the DB engine.
		- ```
		  Cache Hierarchy (fastest to slowest):
		    L1 CPU Cache   → ~1ns
		    L2 CPU Cache   → ~4ns
		    L3 CPU Cache   → ~10ns
		    RAM            → ~100ns
		    SSD            → ~100μs
		    HDD            → ~10ms
		    Network (LAN)  → ~1ms
		    Network (WAN)  → ~100ms
		  ```
	-
	- ## Cache Eviction Policies
		- **LRU (Least Recently Used)** — Evict the item not accessed for the longest time. Most common.
		- **LFU (Least Frequently Used)** — Evict the item accessed least often.
		- **FIFO (First In First Out)** — Evict the oldest inserted item.
		- **TTL (Time To Live)** — Items expire after a set duration regardless of access.
		- **Random Replacement** — Evict a random item.
		- ```
		  LRU Example (cache size = 3):
		    Access: A B C D
		    After A: [A]
		    After B: [A, B]
		    After C: [A, B, C]
		    Access D: evict A (least recently used) → [B, C, D]
		  ```
	-
	- ## Cache Write Strategies
		- **Write-Through** — Write to cache AND DB simultaneously. Consistent but slower writes.
		- **Write-Back (Write-Behind)** — Write to cache first, sync to DB asynchronously. Fast writes, risk of data loss.
		- **Write-Around** — Write directly to DB, bypass cache. Good for write-heavy, rarely-read data.
		- ```
		  Write-Through:
		    Write → Cache + DB (synchronous)
		    Pros: Always consistent
		    Cons: Write latency = DB latency
		  
		  Write-Back:
		    Write → Cache → (async) → DB
		    Pros: Very fast writes
		    Cons: Data loss if cache crashes before sync
		  
		  Write-Around:
		    Write → DB (skip cache)
		    Pros: Cache not polluted with write-once data
		    Cons: Next read is a cache miss
		  ```
	-
	- ## Cache Invalidation
		- The hardest problem in caching: keeping cache in sync with source of truth.
		- **TTL-based** — Cache expires after N seconds. Simple but may serve stale data.
		- **Event-driven** — DB change triggers cache invalidation (e.g., via message queue).
		- **Cache-aside (Lazy Loading)** — App checks cache first; on miss, loads from DB and populates cache.
		- ```
		  Cache-Aside Pattern:
		    1. App checks cache for key
		    2. Cache miss → query DB
		    3. Store result in cache with TTL
		    4. Return result
		  
		  On update:
		    1. Update DB
		    2. Delete/invalidate cache key
		    3. Next read will repopulate cache
		  ```
	-
	- ## Cache Stampede (Thundering Herd)
		- When a popular cache key expires, thousands of requests simultaneously hit the DB.
		- Solutions:
			- **Mutex/Lock** — Only one request fetches from DB; others wait.
			- **Probabilistic Early Expiration** — Refresh cache slightly before TTL expires.
			- **Background refresh** — Async job refreshes cache before expiry.
	-
	- ## Redis vs Memcached
		- ```
		  Feature          Redis                    Memcached
		  Data Types       Strings, Lists, Sets,    Strings only
		                   Hashes, Sorted Sets,
		                   Streams, Bitmaps
		  Persistence      Yes (RDB + AOF)          No
		  Replication      Yes (master-replica)     No
		  Clustering       Yes (Redis Cluster)      Yes (client-side)
		  Pub/Sub          Yes                      No
		  Lua Scripting    Yes                      No
		  Use Case         Sessions, queues,        Simple key-value
		                   leaderboards, cache      cache, high throughput
		  ```
-
- # Databases at Scale
  collapsed:: true
	- ## SQL vs NoSQL
		- ```
		  SQL (Relational):
		    Structure:   Tables with rows and columns, fixed schema
		    ACID:        Full ACID transactions
		    Scaling:     Vertical (primarily), horizontal is complex
		    Query:       SQL — powerful joins, aggregations
		    Use When:    Complex relationships, financial data, reporting
		    Examples:    PostgreSQL, MySQL, Oracle, SQL Server
		  
		  NoSQL:
		    Structure:   Document, Key-Value, Column-family, Graph
		    ACID:        Eventual consistency (mostly), some support ACID
		    Scaling:     Horizontal (built-in sharding)
		    Query:       Limited joins, optimized for specific access patterns
		    Use When:    High write throughput, flexible schema, massive scale
		    Examples:    MongoDB, Cassandra, DynamoDB, Redis, Neo4j
		  ```
	-
	- ## Database Replication
		- Copying data from one DB (primary) to one or more DBs (replicas).
		- **Primary-Replica (Master-Slave)** — Writes go to primary, reads from replicas.
		- **Primary-Primary (Multi-Master)** — Both nodes accept writes, sync with each other.
		- ```
		  Primary-Replica:
		    Write → [Primary DB] → replicates → [Replica 1]
		                                      → [Replica 2]
		    Read  → [Replica 1] or [Replica 2]
		  
		  Benefits:
		    - Read scalability (distribute reads)
		    - Failover (promote replica if primary fails)
		    - Backups without impacting primary
		  
		  Replication Lag:
		    - Async replication → replicas may be slightly behind
		    - Sync replication → consistent but slower writes
		  ```
	-
	- ## Database Sharding
		- Splitting a large database into smaller pieces (**shards**) across multiple servers.
		- Each shard holds a subset of the data.
		- ```
		  Sharding Strategies:
		  
		  1. Range-Based Sharding:
		     User IDs 1-1M    → Shard 1
		     User IDs 1M-2M   → Shard 2
		     Pros: Simple, range queries easy
		     Cons: Hot spots if data not evenly distributed
		  
		  2. Hash-Based Sharding:
		     shard = hash(user_id) % num_shards
		     Pros: Even distribution
		     Cons: Range queries hard, resharding is painful
		  
		  3. Directory-Based Sharding:
		     Lookup table maps keys to shards
		     Pros: Flexible
		     Cons: Lookup table is a bottleneck/SPOF
		  
		  4. Geographic Sharding:
		     US users → US shard
		     EU users → EU shard
		     Pros: Low latency, data residency compliance
		  ```
	-
	- ## Database Indexing
		- An index is a data structure that speeds up data retrieval at the cost of extra storage and slower writes.
		- ```
		  Types of Indexes:
		  
		  B-Tree Index (default in most RDBMS):
		    → Good for range queries, equality, ORDER BY
		    → Used in: PostgreSQL, MySQL
		  
		  Hash Index:
		    → O(1) exact match lookups
		    → Bad for range queries
		  
		  Composite Index:
		    CREATE INDEX idx ON users(last_name, first_name);
		    → Efficient for queries filtering on both columns
		    → Left-prefix rule: (last_name) alone works, (first_name) alone doesn't
		  
		  Covering Index:
		    → Index contains all columns needed by query
		    → No need to access the actual table rows
		  
		  Full-Text Index:
		    → For text search (LIKE '%keyword%' is slow)
		    → Used in: Elasticsearch, PostgreSQL tsvector
		  
		  Partial Index:
		    CREATE INDEX idx ON orders(user_id) WHERE status = 'active';
		    → Index only a subset of rows
		  ```
	-
	- ## ACID Properties
		- **Atomicity** — Transaction is all-or-nothing. If any step fails, entire transaction rolls back.
		- **Consistency** — DB moves from one valid state to another. Constraints always satisfied.
		- **Isolation** — Concurrent transactions don't interfere with each other.
		- **Durability** — Committed transactions survive crashes (written to disk).
		- ```
		  Isolation Levels (weakest to strongest):
		    READ UNCOMMITTED → can read dirty (uncommitted) data
		    READ COMMITTED   → only reads committed data (default in many DBs)
		    REPEATABLE READ  → same query returns same result within transaction
		    SERIALIZABLE     → transactions execute as if sequential (slowest, safest)
		  
		  Anomalies:
		    Dirty Read       → reading uncommitted data
		    Non-Repeatable   → same row returns different value in same transaction
		    Phantom Read     → new rows appear in repeated range query
		  ```
	-
	- ## Database Connection Pooling
		- Creating DB connections is expensive (~100ms). Connection pools reuse existing connections.
		- ```
		  Without Pool:
		    Request → Open connection → Query → Close connection (slow)
		  
		  With Pool:
		    App starts → Create 10 connections → Pool
		    Request → Borrow connection → Query → Return to pool (fast)
		  
		  Popular: PgBouncer (PostgreSQL), HikariCP (Java), SQLAlchemy pool (Python)
		  
		  Key settings:
		    min_connections: 5
		    max_connections: 100
		    connection_timeout: 30s
		    idle_timeout: 600s
		  ```
	-
	- ## Read/Write Splitting
		- Route **write** queries to primary, **read** queries to replicas.
		- Dramatically improves read throughput for read-heavy workloads.
		- ```
		  Application Layer:
		    if query.is_write():
		        use primary_db
		    else:
		        use replica_db  # round-robin across replicas
		  ```
-
- # Networking & Communication
  collapsed:: true
	- ## HTTP vs HTTPS vs HTTP/2 vs HTTP/3
		- ```
		  HTTP/1.1:
		    → Text-based, one request per connection (keep-alive helps)
		    → Head-of-line blocking
		  
		  HTTP/2:
		    → Binary protocol, multiplexing (multiple requests over one connection)
		    → Header compression (HPACK)
		    → Server push
		    → Still TCP-based (TCP HOL blocking)
		  
		  HTTP/3:
		    → Built on QUIC (UDP-based)
		    → Eliminates TCP head-of-line blocking
		    → Faster connection setup (0-RTT)
		    → Better for mobile/lossy networks
		  
		  HTTPS:
		    → HTTP + TLS encryption
		    → Prevents eavesdropping and MITM attacks
		    → TLS 1.3 is current standard
		  ```
	-
	- ## REST vs GraphQL vs gRPC
		- ```
		  REST:
		    Protocol:   HTTP/1.1 or HTTP/2
		    Format:     JSON/XML
		    Pros:       Simple, widely understood, cacheable
		    Cons:       Over-fetching, under-fetching, multiple round trips
		    Use When:   Public APIs, CRUD operations
		  
		  GraphQL:
		    Protocol:   HTTP
		    Format:     JSON
		    Pros:       Fetch exactly what you need, single endpoint, strongly typed
		    Cons:       Complex caching, N+1 query problem, learning curve
		    Use When:   Mobile apps, complex data requirements, BFF pattern
		  
		  gRPC:
		    Protocol:   HTTP/2
		    Format:     Protocol Buffers (binary)
		    Pros:       Very fast, strongly typed, streaming support, code generation
		    Cons:       Not human-readable, browser support limited
		    Use When:   Internal microservice communication, low-latency systems
		  ```
	-
	- ## WebSockets vs Long Polling vs SSE
		- ```
		  Short Polling:
		    Client → Request every N seconds → Server
		    Pros: Simple
		    Cons: Wasteful, high latency
		  
		  Long Polling:
		    Client → Request → Server holds until data available → Response
		    Client immediately sends next request
		    Pros: Near real-time, works everywhere
		    Cons: Server holds connections, overhead per message
		  
		  WebSockets:
		    Client ↔ Server (persistent bidirectional connection)
		    Pros: True real-time, low overhead after handshake
		    Cons: Stateful (harder to scale), not cacheable
		    Use When: Chat, gaming, live collaboration, trading
		  
		  SSE (Server-Sent Events):
		    Server → Client (one-way persistent stream)
		    Pros: Simple, auto-reconnect, works over HTTP
		    Cons: One-directional only
		    Use When: Live feeds, notifications, dashboards
		  ```
	-
	- ## DNS (Domain Name System)
		- Translates human-readable domain names to IP addresses.
		- ```
		  DNS Resolution Flow:
		    Browser → DNS Cache → OS Cache → Recursive Resolver
		    → Root Nameserver → TLD Nameserver (.com)
		    → Authoritative Nameserver → IP Address
		  
		  DNS Record Types:
		    A      → domain → IPv4 address
		    AAAA   → domain → IPv6 address
		    CNAME  → alias → another domain
		    MX     → mail server for domain
		    TXT    → arbitrary text (SPF, DKIM, verification)
		    NS     → nameservers for domain
		    TTL    → how long to cache the record
		  
		  DNS for Load Balancing:
		    → Multiple A records for same domain (round-robin DNS)
		    → GeoDNS: return different IPs based on client location
		  ```
	-
	- ## CDN (Content Delivery Network)
		- A globally distributed network of servers that caches content close to users.
		- ```
		  Without CDN:
		    User in India → Server in US (200ms latency)
		  
		  With CDN:
		    User in India → CDN Edge in Mumbai (10ms latency)
		  
		  CDN Caches:
		    → Static assets: images, CSS, JS, videos
		    → Dynamic content: some CDNs support edge computing
		  
		  CDN Providers:
		    Cloudflare, AWS CloudFront, Akamai, Fastly, Azure CDN
		  
		  Cache-Control Headers:
		    Cache-Control: public, max-age=86400   → cache for 1 day
		    Cache-Control: no-cache                → always revalidate
		    Cache-Control: no-store                → never cache
		  ```
-
- # Message Queues & Event-Driven Architecture
  collapsed:: true
	- ## What is a Message Queue?
		- A message queue is an **asynchronous communication** mechanism where producers send messages and consumers process them independently.
		- Decouples services — producer doesn't wait for consumer to finish.
		- ```
		  Synchronous (tight coupling):
		    Service A → calls Service B → waits → continues
		    Problem: If B is slow/down, A is blocked
		  
		  Asynchronous (loose coupling):
		    Service A → puts message in Queue → continues immediately
		    Service B → reads from Queue → processes at its own pace
		  ```
	-
	- ## Message Queue Patterns
		- **Point-to-Point (Queue)** — One producer, one consumer per message.
		- **Publish-Subscribe (Topic)** — One producer, multiple consumers all receive the message.
		- **Fan-out** — One message broadcast to multiple queues.
		- **Dead Letter Queue (DLQ)** — Failed messages go here for inspection/retry.
		- ```
		  Pub/Sub Example:
		    Order Service → publishes "order.created" event
		    ├── Email Service subscribes → sends confirmation email
		    ├── Inventory Service subscribes → reserves stock
		    └── Analytics Service subscribes → logs event
		  ```
	-
	- ## Kafka vs RabbitMQ vs SQS
		- ```
		  Apache Kafka:
		    Type:        Distributed log / event streaming
		    Retention:   Messages stored on disk (configurable, days/weeks)
		    Ordering:    Guaranteed within a partition
		    Throughput:  Millions of messages/second
		    Use When:    Event sourcing, stream processing, audit logs, high throughput
		    Consumers:   Pull-based, consumer groups, replay from any offset
		  
		  RabbitMQ:
		    Type:        Traditional message broker (AMQP)
		    Retention:   Messages deleted after consumption
		    Ordering:    Per-queue ordering
		    Throughput:  Tens of thousands/second
		    Use When:    Task queues, RPC, complex routing, low latency
		    Consumers:   Push-based
		  
		  AWS SQS:
		    Type:        Managed cloud queue
		    Retention:   Up to 14 days
		    Ordering:    FIFO queues available
		    Throughput:  Unlimited (managed)
		    Use When:    AWS ecosystem, serverless, simple decoupling
		  ```
	-
	- ## Event-Driven Architecture
		- System components communicate by **producing and consuming events**.
		- ```
		  Event Sourcing:
		    → Store state as a sequence of events, not current state
		    → Replay events to reconstruct state at any point in time
		    → Audit trail built-in
		  
		  CQRS (Command Query Responsibility Segregation):
		    → Separate models for reads (Query) and writes (Command)
		    → Write model: optimized for consistency
		    → Read model: optimized for query performance (denormalized)
		  
		  Saga Pattern:
		    → Manage distributed transactions across microservices
		    → Choreography: each service publishes events, others react
		    → Orchestration: central coordinator tells services what to do
		  ```
	-
	- ## Backpressure
		- When a consumer can't keep up with producer rate, the queue grows unboundedly.
		- Solutions:
			- **Rate limiting** — Limit producer speed.
			- **Consumer scaling** — Add more consumer instances.
			- **Drop messages** — Discard low-priority messages under load.
			- **Circuit breaker** — Stop sending if downstream is overwhelmed.
-
- # Microservices Architecture
  collapsed:: true
	- ## Monolith vs Microservices
		- ```
		  Monolith:
		    → Single deployable unit, all modules in one codebase
		    Pros: Simple to develop, test, deploy initially
		    Cons: Hard to scale specific parts, slow deploys, tech lock-in,
		          one bug can crash everything
		  
		  Microservices:
		    → Each service is independent, deployed separately
		    Pros: Independent scaling, independent deploys, tech diversity,
		          fault isolation, small focused teams
		    Cons: Network overhead, distributed system complexity,
		          data consistency challenges, operational overhead
		  ```
	-
	- ## Service Communication
		- **Synchronous** — REST, gRPC. Caller waits for response.
		- **Asynchronous** — Message queues (Kafka, RabbitMQ). Fire and forget.
		- ```
		  When to use Sync:
		    → User-facing requests needing immediate response
		    → Simple request-response flows
		  
		  When to use Async:
		    → Background processing (email, notifications)
		    → Long-running tasks
		    → Decoupling services that don't need immediate response
		  ```
	-
	- ## Service Discovery
		- How do services find each other in a dynamic environment where IPs change?
		- **Client-side discovery** — Client queries service registry, picks instance, calls directly.
		- **Server-side discovery** — Client calls load balancer/router, which queries registry.
		- ```
		  Service Registry:
		    → Consul, Eureka, etcd, Zookeeper
		    → Services register on startup, deregister on shutdown
		    → Health checks remove unhealthy instances
		  
		  DNS-based Discovery:
		    → Kubernetes uses DNS: service-name.namespace.svc.cluster.local
		  ```
	-
	- ## API Gateway
		- Single entry point for all client requests to microservices.
		- ```
		  Client → [API Gateway] → Auth Service
		                        → User Service
		                        → Order Service
		                        → Product Service
		  
		  API Gateway Responsibilities:
		    → Authentication & Authorization
		    → Rate limiting & throttling
		    → Request routing
		    → SSL termination
		    → Request/response transformation
		    → Logging & monitoring
		    → Caching
		  
		  Popular: Kong, AWS API Gateway, Nginx, Traefik, Envoy
		  ```
	-
	- ## Circuit Breaker Pattern
		- Prevents cascading failures when a downstream service is failing.
		- ```
		  States:
		    CLOSED   → Normal operation, requests pass through
		    OPEN     → Service is failing, requests fail fast (no actual call)
		    HALF-OPEN → Test if service recovered (allow limited requests)
		  
		  Flow:
		    Requests fail N times → Circuit OPENS
		    After timeout → Circuit goes HALF-OPEN
		    If test request succeeds → Circuit CLOSES
		    If test request fails → Circuit stays OPEN
		  
		  Libraries: Hystrix (Java), Resilience4j, Polly (.NET)
		  ```
	-
	- ## Strangler Fig Pattern
		- Gradually migrate a monolith to microservices without a big-bang rewrite.
		- ```
		  Step 1: New features built as microservices
		  Step 2: Existing features gradually extracted to services
		  Step 3: Monolith shrinks until fully replaced
		  
		  Traffic routing via API Gateway or proxy:
		    /new-feature → Microservice
		    /old-feature → Monolith (until migrated)
		  ```
	-
	- ## Distributed Tracing
		- Track a request as it flows through multiple microservices.
		- Each request gets a **trace ID**, each service hop gets a **span ID**.
		- ```
		  Request → Service A (span 1)
		              → Service B (span 2)
		                  → DB query (span 3)
		              → Service C (span 4)
		  
		  Tools: Jaeger, Zipkin, AWS X-Ray, Datadog APM, OpenTelemetry
		  ```
-
- # Storage Systems
  collapsed:: true
	- ## Block Storage vs Object Storage vs File Storage
		- ```
		  Block Storage:
		    → Raw storage volumes, OS sees as disk
		    → Low latency, high IOPS
		    → Use: Databases, VMs, boot volumes
		    → Examples: AWS EBS, Azure Disk
		  
		  File Storage (NAS):
		    → Hierarchical file system, shared across servers
		    → Use: Shared files, home directories, CMS
		    → Examples: AWS EFS, Azure Files, NFS
		  
		  Object Storage:
		    → Flat namespace, store any file as object with metadata
		    → Infinitely scalable, cheap, accessed via HTTP API
		    → Use: Images, videos, backups, static assets, data lakes
		    → Examples: AWS S3, Google Cloud Storage, Azure Blob
		  ```
	-
	- ## Data Replication Strategies
		- **Synchronous Replication** — Write confirmed only after all replicas acknowledge. Strong consistency, higher latency.
		- **Asynchronous Replication** — Write confirmed after primary writes. Replicas catch up later. Lower latency, risk of data loss.
		- **Semi-Synchronous** — Wait for at least one replica to confirm. Balance of both.
	-
	- ## Blob Storage Design (e.g., S3)
		- ```
		  Upload Flow:
		    Client → API Server → Generate unique key (UUID/hash)
		    → Upload to Object Store (S3)
		    → Store metadata (key, size, owner, timestamp) in DB
		  
		  Download Flow:
		    Client → API Server → Lookup metadata in DB
		    → Generate pre-signed URL (time-limited direct access)
		    → Client downloads directly from S3 (bypasses app server)
		  
		  Chunked Upload (large files):
		    → Split file into chunks (5MB each)
		    → Upload chunks in parallel
		    → Server reassembles (S3 Multipart Upload)
		  ```
	-
	- ## Data Partitioning Strategies
		- **Horizontal Partitioning (Sharding)** — Split rows across multiple tables/DBs.
		- **Vertical Partitioning** — Split columns — keep hot columns in fast storage, cold columns in cheap storage.
		- **Functional Partitioning** — Split by feature/domain (users DB, orders DB, products DB).
	-
	- ## Consistent Hashing
		- Used in distributed caches and databases to minimize data movement when nodes are added/removed.
		- ```
		  Problem with simple hash:
		    hash(key) % N_servers
		    If N changes (add/remove server) → almost all keys remap → cache invalidation storm
		  
		  Consistent Hashing:
		    → Place servers and keys on a virtual ring (0 to 2^32)
		    → Key maps to nearest server clockwise on ring
		    → Adding/removing a server only affects keys between it and its predecessor
		  
		  Virtual Nodes:
		    → Each physical server has multiple virtual nodes on the ring
		    → Better load distribution
		    → Used in: Cassandra, DynamoDB, Memcached
		  ```
-
- # Rate Limiting & Throttling
  collapsed:: true
	- ## What is Rate Limiting?
		- Controls how many requests a client can make in a given time window.
		- Protects against abuse, DDoS, and ensures fair usage.
	-
	- ## Rate Limiting Algorithms
		- **Token Bucket** — Bucket holds N tokens. Each request consumes 1 token. Tokens refill at fixed rate. Allows bursts.
		- **Leaky Bucket** — Requests enter a queue (bucket), processed at fixed rate. Smooths out bursts.
		- **Fixed Window Counter** — Count requests per fixed time window (e.g., 100 req/minute). Simple but edge-case at window boundary.
		- **Sliding Window Log** — Track timestamps of each request. Accurate but memory-heavy.
		- **Sliding Window Counter** — Hybrid of fixed window + sliding. Accurate and memory-efficient.
		- ```
		  Token Bucket Example:
		    Bucket capacity: 10 tokens
		    Refill rate: 2 tokens/second
		    Request cost: 1 token
		  
		    t=0: 10 tokens, 5 requests → 5 tokens left
		    t=1: 7 tokens (refilled 2), 3 requests → 4 tokens left
		    t=2: 6 tokens, 10 requests → only 6 allowed, 4 rejected
		  
		  Fixed Window Problem:
		    Window: 0-60s, limit: 100 req
		    User sends 100 req at t=59s → allowed
		    User sends 100 req at t=61s → allowed
		    Effectively 200 req in 2 seconds!
		  ```
	-
	- ## Distributed Rate Limiting
		- Single server rate limiting is easy. Distributed is hard.
		- ```
		  Approach 1: Centralized store (Redis)
		    → All app servers check/update counter in Redis
		    → Atomic INCR + EXPIRE commands
		    → Consistent but Redis is a bottleneck
		  
		  Approach 2: Local + Sync
		    → Each server tracks locally
		    → Periodically sync with central store
		    → Slightly inaccurate but scalable
		  
		  Redis Rate Limit (Lua script for atomicity):
		    local count = redis.call('INCR', key)
		    if count == 1 then redis.call('EXPIRE', key, window) end
		    if count > limit then return 0 end
		    return 1
		  ```
	-
	- ## Rate Limit Response
		- Return `429 Too Many Requests` with headers:
		- ```
		  HTTP/1.1 429 Too Many Requests
		  X-RateLimit-Limit: 100
		  X-RateLimit-Remaining: 0
		  X-RateLimit-Reset: 1711440000
		  Retry-After: 60
		  ```
-
- # Security in System Design
  collapsed:: true
	- ## Authentication vs Authorization
		- **Authentication (AuthN)** — Who are you? Verify identity.
		- **Authorization (AuthZ)** — What can you do? Verify permissions.
		- ```
		  Authentication Methods:
		    → Username + Password (hashed with bcrypt/argon2)
		    → OAuth 2.0 (third-party login: Google, GitHub)
		    → JWT (JSON Web Tokens)
		    → API Keys
		    → MFA (Multi-Factor Authentication)
		    → SSO (Single Sign-On)
		  
		  Authorization Models:
		    → RBAC (Role-Based): user has role, role has permissions
		    → ABAC (Attribute-Based): permissions based on attributes
		    → ACL (Access Control List): per-resource permission list
		  ```
	-
	- ## JWT (JSON Web Token)
		- ```
		  Structure: header.payload.signature
		    Header:    {"alg": "HS256", "typ": "JWT"}
		    Payload:   {"sub": "user123", "role": "admin", "exp": 1711440000}
		    Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)
		  
		  Flow:
		    1. User logs in → Server creates JWT → Returns to client
		    2. Client stores JWT (localStorage or httpOnly cookie)
		    3. Client sends JWT in Authorization header: Bearer <token>
		    4. Server verifies signature → extracts claims → authorizes
		  
		  Pros: Stateless, scalable (no server-side session store)
		  Cons: Cannot invalidate before expiry (use short TTL + refresh tokens)
		  ```
	-
	- ## OAuth 2.0 Flow
		- ```
		  Authorization Code Flow (most secure, for web apps):
		    1. User clicks "Login with Google"
		    2. App redirects to Google with client_id, redirect_uri, scope
		    3. User authenticates with Google
		    4. Google redirects back with authorization code
		    5. App exchanges code for access_token + refresh_token (server-side)
		    6. App uses access_token to call Google APIs
		  
		  PKCE (Proof Key for Code Exchange):
		    → Extension for mobile/SPA apps
		    → Prevents authorization code interception attacks
		  ```
	-
	- ## HTTPS & TLS
		- ```
		  TLS Handshake (simplified):
		    1. Client → Server: ClientHello (supported cipher suites, TLS version)
		    2. Server → Client: ServerHello + Certificate
		    3. Client verifies certificate against CA
		    4. Key exchange (ECDHE) → shared session key
		    5. Encrypted communication begins
		  
		  Certificate Pinning:
		    → App hardcodes expected certificate/public key
		    → Prevents MITM even with compromised CA
		  ```
	-
	- ## Common Security Vulnerabilities
		- ```
		  SQL Injection:
		    Attack:  SELECT * FROM users WHERE id = '1 OR 1=1'
		    Fix:     Use parameterized queries / prepared statements
		  
		  XSS (Cross-Site Scripting):
		    Attack:  Inject <script>steal_cookies()</script> into page
		    Fix:     Sanitize/escape output, Content-Security-Policy header
		  
		  CSRF (Cross-Site Request Forgery):
		    Attack:  Malicious site triggers authenticated request to your API
		    Fix:     CSRF tokens, SameSite cookie attribute
		  
		  IDOR (Insecure Direct Object Reference):
		    Attack:  GET /api/orders/123 → change to /api/orders/124 (another user's order)
		    Fix:     Always verify ownership/authorization server-side
		  
		  DDoS:
		    Attack:  Flood server with traffic
		    Fix:     Rate limiting, CDN, WAF, anycast routing
		  ```
-
- # Design Patterns for Distributed Systems
  collapsed:: true
	- ## Retry Pattern
		- Automatically retry failed requests with exponential backoff.
		- ```
		  Exponential Backoff with Jitter:
		    Attempt 1: wait 1s
		    Attempt 2: wait 2s
		    Attempt 3: wait 4s
		    Attempt 4: wait 8s + random jitter (0-1s)
		    Max retries: 5
		  
		  Jitter prevents thundering herd (all clients retrying at same time)
		  
		  Idempotency:
		    → Retried requests must be safe to repeat
		    → Use idempotency keys for POST requests
		    → GET, PUT, DELETE are naturally idempotent
		  ```
	-
	- ## Bulkhead Pattern
		- Isolate failures to prevent them from cascading across the system.
		- ```
		  Thread Pool Bulkhead:
		    Service A: 20 threads
		    Service B: 20 threads
		    Service C: 20 threads
		  
		    If Service A is slow and exhausts its 20 threads,
		    Services B and C are unaffected (separate pools)
		  
		  Semaphore Bulkhead:
		    Limit concurrent calls to a dependency
		  ```
	-
	- ## Sidecar Pattern
		- Deploy a helper container alongside the main service container.
		- ```
		  Main Container: App logic
		  Sidecar Container: Logging, monitoring, service mesh proxy (Envoy)
		  
		  Used in: Kubernetes pods, Istio service mesh
		  Benefits: Separation of concerns, language-agnostic infrastructure
		  ```
	-
	- ## Outbox Pattern
		- Guarantee that a DB write and a message publish happen atomically.
		- ```
		  Problem:
		    1. Write to DB ✓
		    2. Publish to Kafka ✗ (crash) → message lost!
		  
		  Outbox Solution:
		    1. Write to DB + write to outbox table (same transaction) ✓
		    2. Background worker reads outbox → publishes to Kafka
		    3. Mark outbox record as published
		  
		  Guarantees at-least-once delivery (make consumers idempotent)
		  ```
	-
	- ## Two-Phase Commit (2PC)
		- Distributed transaction protocol to ensure all-or-nothing across multiple services.
		- ```
		  Phase 1 (Prepare):
		    Coordinator → asks all participants: "Can you commit?"
		    Participants → lock resources, respond Yes/No
		  
		  Phase 2 (Commit/Abort):
		    If all Yes → Coordinator sends Commit
		    If any No  → Coordinator sends Abort
		  
		  Problems:
		    → Blocking protocol (coordinator crash = all participants stuck)
		    → Not suitable for high-throughput systems
		    → Use Saga pattern instead for microservices
		  ```
	-
	- ## Leader Election
		- In a cluster, one node acts as leader for coordination tasks.
		- ```
		  Algorithms:
		    → Raft consensus algorithm (used in etcd, CockroachDB)
		    → Zookeeper ephemeral nodes (first to create wins)
		    → Bully algorithm
		  
		  Use Cases:
		    → Primary DB selection
		    → Distributed cron job (only leader runs the job)
		    → Kafka partition leader
		  ```
-
- # Back-of-the-Envelope Estimation
  collapsed:: true
	- ## Key Numbers Every Engineer Should Know
		- ```
		  Latency Numbers (approximate):
		    L1 cache reference:          0.5 ns
		    L2 cache reference:          7 ns
		    Mutex lock/unlock:           25 ns
		    Main memory reference:       100 ns
		    Compress 1KB (Snappy):       3,000 ns = 3 μs
		    Send 1KB over 1Gbps network: 10,000 ns = 10 μs
		    Read 4KB from SSD:           150,000 ns = 150 μs
		    Read 1MB sequentially (RAM): 250,000 ns = 250 μs
		    Round trip within datacenter: 500,000 ns = 0.5 ms
		    Read 1MB sequentially (SSD): 1,000,000 ns = 1 ms
		    Disk seek:                   10,000,000 ns = 10 ms
		    Read 1MB sequentially (HDD): 20,000,000 ns = 20 ms
		    Send packet CA→Netherlands→CA: 150,000,000 ns = 150 ms
		  ```
	-
	- ## Storage Estimation
		- ```
		  Units:
		    1 KB = 10^3 bytes
		    1 MB = 10^6 bytes
		    1 GB = 10^9 bytes
		    1 TB = 10^12 bytes
		    1 PB = 10^15 bytes
		  
		  Common sizes:
		    ASCII char:    1 byte
		    Unicode char:  2-4 bytes
		    Integer:       4 bytes
		    Long/Double:   8 bytes
		    UUID:          16 bytes
		    Tweet text:    ~280 bytes
		    Profile photo: ~200 KB
		    HD photo:      ~3 MB
		    1 min video:   ~50 MB (compressed)
		  ```
	-
	- ## QPS Estimation Example (Twitter-like)
		- ```
		  Assumptions:
		    300 million monthly active users (MAU)
		    50% use daily → 150M DAU
		    Each user reads 100 tweets/day
		    Each user posts 2 tweets/day
		  
		  Read QPS:
		    150M users × 100 tweets / 86,400 sec = ~174,000 QPS
		    Peak (2x): ~350,000 QPS
		  
		  Write QPS:
		    150M users × 2 tweets / 86,400 sec = ~3,500 QPS
		    Peak (2x): ~7,000 QPS
		  
		  Storage (tweets):
		    3,500 writes/sec × 86,400 sec × 365 days
		    = ~110 billion tweets/year
		    Each tweet: 280 bytes text + 500 bytes metadata = ~780 bytes
		    110B × 780 bytes = ~86 TB/year
		  ```
-
- # Real-World System Design Case Studies
  collapsed:: true
	- ## Design a URL Shortener (like bit.ly)
	  collapsed:: true
		- ### Requirements
			- **Functional**: Given a long URL, return a short URL. Redirect short URL to original.
			- **Non-Functional**: 100M URLs/day, low latency reads, high availability.
		- ### Estimation
			- ```
			  Write: 100M URLs/day = ~1,160 writes/sec
			  Read:  10:1 read/write ratio = ~11,600 reads/sec
			  Storage: 100M × 365 × 5 years × 500 bytes = ~91 TB
			  ```
		- ### Short URL Generation
			- ```
			  Option 1: MD5/SHA256 hash of long URL → take first 7 chars
			    Pros: Deterministic (same URL = same short code)
			    Cons: Hash collisions possible
			  
			  Option 2: Base62 encoding of auto-increment ID
			    Characters: [a-z A-Z 0-9] = 62 chars
			    7 chars = 62^7 = ~3.5 trillion unique URLs
			    ID 12345 → base62 → "dnh"
			  
			  Option 3: Distributed ID generator (Snowflake)
			    → Unique IDs across multiple servers
			  ```
		- ### Architecture
			- ```
			  Client → [API Gateway] → [URL Service]
			                              ↓ write
			                          [DB: id | short_code | long_url | created_at]
			                              ↓ read
			  Client → [CDN/Cache] → [Redirect Service] → [Redis Cache]
			                                                    ↓ miss
			                                               [DB Read Replica]
			  ```
		- ### Redirect Flow
			- ```
			  GET /abc123
			  1. Check Redis cache for "abc123"
			  2. Cache hit → return 301/302 redirect to long URL
			  3. Cache miss → query DB → cache result → redirect
			  
			  301 (Permanent): Browser caches redirect → less server load
			  302 (Temporary): Every request hits server → better analytics
			  ```
	-
	- ## Design a Chat System (like WhatsApp)
	  collapsed:: true
		- ### Requirements
			- **Functional**: 1-on-1 messaging, group chat, online/offline status, message history.
			- **Non-Functional**: Low latency (<100ms), high availability, 50M DAU.
		- ### Key Design Decisions
			- ```
			  Message Delivery Protocol:
			    → WebSocket for real-time bidirectional communication
			    → Long polling as fallback
			  
			  Message Storage:
			    → NoSQL (Cassandra/HBase) for high write throughput
			    → Partition key: conversation_id
			    → Sort key: timestamp (for ordered retrieval)
			  
			  Message ID:
			    → Snowflake ID (time-ordered, unique across servers)
			    → Ensures messages display in correct order
			  ```
		- ### Architecture
			- ```
			  Client A ←WebSocket→ [Chat Server 1]
			  Client B ←WebSocket→ [Chat Server 2]
			  
			  Chat Server 1 → [Message Queue (Kafka)]
			                → [Presence Service]
			                → [Push Notification Service]
			  
			  Message Queue → [Message Storage Service] → [Cassandra]
			  
			  Presence Service → [Redis] (user_id: last_seen_timestamp)
			  
			  Service Discovery:
			    → [ZooKeeper] tracks which chat server each user is connected to
			    → Server 1 needs to send to user on Server 2 → lookup ZooKeeper → route via internal API
			  ```
		- ### Message Sync
			- ```
			  Each message has a cursor (last_message_id per conversation)
			  On reconnect: client sends cursor → server returns all messages after cursor
			  ```
	-
	- ## Design a Video Streaming Service (like YouTube)
	  collapsed:: true
		- ### Requirements
			- **Functional**: Upload video, stream video, search, recommendations.
			- **Non-Functional**: 5M DAU, 500 hours of video uploaded/minute, global users.
		- ### Video Upload Pipeline
			- ```
			  Client → [Upload Service] → [Raw Video Storage (S3)]
			                           → [Message Queue]
			                                   ↓
			                           [Transcoding Workers]
			                           (convert to multiple resolutions: 360p, 720p, 1080p, 4K)
			                           (convert to multiple formats: MP4, WebM, HLS)
			                                   ↓
			                           [Processed Video Storage (S3)]
			                                   ↓
			                           [CDN Distribution]
			                                   ↓
			                           [Update DB: video metadata, status=ready]
			  ```
		- ### Video Streaming
			- ```
			  Adaptive Bitrate Streaming (ABR):
			    → Video split into small segments (2-10 seconds each)
			    → Player monitors bandwidth → switches quality dynamically
			    → HLS (HTTP Live Streaming) or DASH protocol
			  
			  CDN Strategy:
			    → Popular videos cached at edge nodes globally
			    → Long-tail videos served from origin
			    → Pre-warm CDN for viral/scheduled content
			  ```
		- ### Search & Recommendations
			- ```
			  Search:
			    → Elasticsearch for full-text search on title, description, tags
			    → Autocomplete via Trie or Elasticsearch suggest
			  
			  Recommendations:
			    → Collaborative filtering (users with similar history)
			    → Content-based filtering (similar video metadata)
			    → ML models trained on watch history, likes, shares
			    → Pre-compute recommendations offline, serve from cache
			  ```
	-
	- ## Design a Notification System
	  collapsed:: true
		- ### Types of Notifications
			- Push (mobile), Email, SMS, In-app.
		- ### Architecture
			- ```
			  Event Sources → [Notification Service] → [Message Queue]
			  (Order placed,                                ↓
			   Comment added,                    [Worker Pool]
			   Friend request)                   ├── Push Worker → FCM/APNs
			                                     ├── Email Worker → SendGrid/SES
			                                     └── SMS Worker → Twilio
			  
			  User Preferences:
			    → Store per-user notification settings in DB
			    → Check preferences before sending
			    → Respect quiet hours, opt-outs
			  
			  Deduplication:
			    → Use idempotency key (event_id) to prevent duplicate sends
			    → Store sent notifications in Redis with TTL
			  ```
	-
	- ## Design a Rate Limiter Service
	  collapsed:: true
		- ### Architecture
			- ```
			  Client → [API Gateway] → checks [Rate Limiter Service]
			                                        ↓
			                                   [Redis Cluster]
			                                   (sliding window counters)
			                                        ↓
			                           Allow → forward to backend
			                           Deny  → 429 Too Many Requests
			  
			  Rules Storage:
			    → Rate limit rules in DB (per API key, per endpoint, per user tier)
			    → Cache rules in memory (refresh every 60s)
			  
			  Multi-tier limits:
			    → Per second: 10 req/s (burst protection)
			    → Per minute: 100 req/min
			    → Per day: 10,000 req/day
			  ```
-
- # Monitoring, Observability & Reliability
  collapsed:: true
	- ## The Three Pillars of Observability
		- **Metrics** — Numerical measurements over time (CPU, memory, QPS, error rate).
		- **Logs** — Timestamped records of events (structured JSON logs preferred).
		- **Traces** — End-to-end request flow across services.
		- ```
		  Metrics Example (Prometheus format):
		    http_requests_total{method="GET", status="200"} 1234
		    http_request_duration_seconds{quantile="0.99"} 0.45
		  
		  Log Example (structured JSON):
		    {"timestamp": "2026-03-26T10:00:00Z", "level": "ERROR",
		     "service": "order-service", "trace_id": "abc123",
		     "message": "Payment failed", "user_id": "u456"}
		  
		  Trace Example:
		    Trace ID: abc123
		    ├── Span: API Gateway (2ms)
		    ├── Span: Order Service (45ms)
		    │   ├── Span: DB Query (30ms)
		    │   └── Span: Cache Read (1ms)
		    └── Span: Payment Service (200ms)
		  ```
	-
	- ## Key Metrics to Monitor
		- ```
		  RED Method (for services):
		    Rate     → requests per second
		    Errors   → error rate (%)
		    Duration → latency (p50, p95, p99)
		  
		  USE Method (for resources):
		    Utilization → % time resource is busy
		    Saturation  → queue length / wait time
		    Errors       → error count
		  
		  Golden Signals (Google SRE):
		    Latency, Traffic, Errors, Saturation
		  ```
	-
	- ## Alerting Best Practices
		- Alert on **symptoms** (user-facing impact), not causes.
		- Use **multi-window burn rate** alerts to catch both fast and slow burns.
		- ```
		  Bad alert:  CPU > 80% for 5 minutes (not user-facing)
		  Good alert: Error rate > 1% for 5 minutes (user-facing)
		  Good alert: p99 latency > 2s for 10 minutes
		  
		  Alert Severity:
		    P1 (Critical): Page on-call immediately (service down)
		    P2 (High):     Page on-call (degraded service)
		    P3 (Medium):   Ticket, fix next business day
		    P4 (Low):      Informational, no action needed
		  ```
	-
	- ## Chaos Engineering
		- Intentionally inject failures to test system resilience.
		- ```
		  Principles:
		    1. Define steady state (normal behavior metrics)
		    2. Hypothesize steady state continues during failure
		    3. Introduce failure (kill a server, add latency, drop packets)
		    4. Observe if steady state is maintained
		    5. Fix weaknesses found
		  
		  Tools: Chaos Monkey (Netflix), Gremlin, Chaos Mesh (Kubernetes)
		  
		  Failure Types to Test:
		    → Kill random instances
		    → Introduce network latency (100ms, 1s)
		    → Simulate AZ/region failure
		    → Fill disk space
		    → Exhaust CPU/memory
		  ```
	-
	- ## Disaster Recovery
		- ```
		  RTO (Recovery Time Objective):
		    → Maximum acceptable downtime after a disaster
		    → "We must be back online within 4 hours"
		  
		  RPO (Recovery Point Objective):
		    → Maximum acceptable data loss
		    → "We can lose at most 1 hour of data"
		  
		  Strategies (cheapest to most expensive):
		    Backup & Restore:  RTO hours, RPO hours
		    Pilot Light:       RTO 10s of minutes, RPO minutes
		    Warm Standby:      RTO minutes, RPO seconds
		    Multi-Site Active: RTO near-zero, RPO near-zero
		  ```
-
- # API Design Best Practices
  collapsed:: true
	- ## RESTful API Design
		- ```
		  Resource Naming (nouns, not verbs):
		    ✓ GET    /users          → list users
		    ✓ GET    /users/123      → get user 123
		    ✓ POST   /users          → create user
		    ✓ PUT    /users/123      → replace user 123
		    ✓ PATCH  /users/123      → partial update user 123
		    ✓ DELETE /users/123      → delete user 123
		  
		    ✗ GET /getUser
		    ✗ POST /createUser
		    ✗ GET /users/123/delete
		  
		  Nested Resources:
		    GET  /users/123/orders       → orders for user 123
		    GET  /users/123/orders/456   → specific order
		  
		  HTTP Status Codes:
		    200 OK              → success
		    201 Created         → resource created (POST)
		    204 No Content      → success, no body (DELETE)
		    400 Bad Request     → invalid input
		    401 Unauthorized    → not authenticated
		    403 Forbidden       → authenticated but not authorized
		    404 Not Found       → resource doesn't exist
		    409 Conflict        → duplicate resource
		    422 Unprocessable   → validation error
		    429 Too Many Req    → rate limited
		    500 Internal Error  → server error
		  ```
	-
	- ## API Versioning
		- ```
		  URL Versioning (most common):
		    /api/v1/users
		    /api/v2/users
		  
		  Header Versioning:
		    Accept: application/vnd.myapi.v2+json
		  
		  Query Parameter:
		    /api/users?version=2
		  
		  Best Practice:
		    → Support at least 2 versions simultaneously
		    → Deprecate old versions with sunset headers
		    → Sunset: Sat, 01 Jan 2027 00:00:00 GMT
		  ```
	-
	- ## Pagination
		- ```
		  Offset Pagination:
		    GET /users?page=3&limit=20
		    SQL: SELECT * FROM users LIMIT 20 OFFSET 40
		    Pros: Simple, jump to any page
		    Cons: Slow for large offsets, inconsistent if data changes
		  
		  Cursor Pagination (recommended for large datasets):
		    GET /users?cursor=eyJ1c2VyX2lkIjoxMDB9&limit=20
		    cursor = base64({"user_id": 100})
		    SQL: SELECT * FROM users WHERE id > 100 LIMIT 20
		    Pros: Consistent, fast regardless of position
		    Cons: Can't jump to arbitrary page
		  
		  Response format:
		    {
		      "data": [...],
		      "pagination": {
		        "next_cursor": "eyJ1c2VyX2lkIjoxMjB9",
		        "has_more": true,
		        "total": 10000
		      }
		    }
		  ```
	-
	- ## Idempotency
		- ```
		  Idempotent methods: GET, PUT, DELETE, HEAD
		  Non-idempotent: POST (creates new resource each time)
		  
		  Making POST idempotent with Idempotency-Key:
		    POST /payments
		    Idempotency-Key: a8098c1a-f86e-11da-bd1a-00112444be1e
		  
		  Server behavior:
		    1. Check if key exists in DB
		    2. If yes → return cached response (don't process again)
		    3. If no  → process request, store response with key
		    4. Key expires after 24 hours
		  ```
-
- # Proxy & Reverse Proxy
  collapsed:: true
	- ## Forward Proxy vs Reverse Proxy
		- ```
		  Forward Proxy (client-side):
		    Client → [Forward Proxy] → Internet
		    → Client's IP is hidden from the server
		    → Use: VPNs, corporate firewalls, content filtering, anonymity
		  
		  Reverse Proxy (server-side):
		    Client → [Reverse Proxy] → Backend Servers
		    → Server's internal IPs are hidden from the client
		    → Use: Load balancing, SSL termination, caching, DDoS protection
		  
		  Key Difference:
		    Forward proxy: protects/represents the CLIENT
		    Reverse proxy: protects/represents the SERVER
		  ```
	-
	- ## What a Reverse Proxy Does
		- **SSL Termination** — Handles HTTPS, forwards plain HTTP internally (saves CPU on app servers).
		- **Compression** — Gzip/Brotli compress responses before sending to client.
		- **Caching** — Cache static responses, reduce backend load.
		- **Request Routing** — Route to different backends based on URL, headers, cookies.
		- **DDoS Protection** — Absorb and filter malicious traffic before it hits app servers.
		- ```
		  Nginx as Reverse Proxy:
		    server {
		        listen 443 ssl;
		        location /api/ {
		            proxy_pass http://api_servers;
		        }
		        location /static/ {
		            proxy_pass http://cdn_servers;
		        }
		    }
		  ```
	-
	- ## Service Mesh
		- A dedicated infrastructure layer for service-to-service communication in microservices.
		- Each service gets a **sidecar proxy** (Envoy) that handles all network traffic.
		- ```
		  Without Service Mesh:
		    Service A → manually handles retries, auth, tracing, TLS → Service B
		  
		  With Service Mesh (Istio/Linkerd):
		    Service A → [Envoy Sidecar] → [Envoy Sidecar] → Service B
		    Sidecar handles: mTLS, retries, circuit breaking, tracing, metrics
		  
		  Benefits:
		    → Zero-trust security (mTLS between all services)
		    → Observability without code changes
		    → Traffic management (canary, A/B testing)
		    → Language-agnostic
		  ```
-
- # Search Systems
  collapsed:: true
	- ## Full-Text Search Architecture
		- ```
		  Why not just SQL LIKE '%keyword%'?
		    → Full table scan → O(n) → extremely slow at scale
		    → No relevance ranking
		    → No typo tolerance
		  
		  Inverted Index (how search engines work):
		    Document 1: "the quick brown fox"
		    Document 2: "the lazy brown dog"
		  
		    Inverted Index:
		      "the"   → [Doc1, Doc2]
		      "quick" → [Doc1]
		      "brown" → [Doc1, Doc2]
		      "fox"   → [Doc1]
		      "lazy"  → [Doc2]
		      "dog"   → [Doc2]
		  
		    Query "brown fox" → intersect [Doc1,Doc2] ∩ [Doc1] → Doc1
		  ```
	-
	- ## Elasticsearch
		- Distributed search and analytics engine built on Apache Lucene.
		- ```
		  Core Concepts:
		    Index     → like a database table
		    Document  → like a row (stored as JSON)
		    Shard     → index split into shards for distribution
		    Replica   → copy of shard for fault tolerance
		  
		  Cluster Architecture:
		    [Master Node] → manages cluster state, index creation
		    [Data Nodes]  → store shards, execute queries
		    [Coord Node]  → routes requests, merges results
		  
		  Write Flow:
		    Client → Coord Node → Primary Shard → Replica Shards
		  
		  Read Flow:
		    Client → Coord Node → round-robin across primary/replica shards
		    → merge + rank results → return top N
		  
		  Key Features:
		    → Full-text search with relevance scoring (TF-IDF, BM25)
		    → Fuzzy matching (typo tolerance)
		    → Autocomplete (edge n-gram tokenizer)
		    → Aggregations (analytics, faceted search)
		    → Near real-time (1 second refresh interval)
		  ```
	-
	- ## Search System Design
		- ```
		  Indexing Pipeline:
		    DB Change → [CDC (Change Data Capture)] → [Kafka]
		    → [Indexing Service] → [Elasticsearch]
		  
		  CDC Tools: Debezium (reads DB transaction log)
		  
		  Search Query Flow:
		    User types → [Autocomplete Service] → [Trie / Elasticsearch suggest]
		    User submits → [Search Service] → [Elasticsearch]
		    → [Ranking Service] (personalization, ML re-ranking)
		    → Results
		  
		  Relevance Tuning:
		    → Boost recent content
		    → Boost by user engagement (clicks, likes)
		    → Personalize by user history
		  ```
-
- # Distributed Locking & Coordination
  collapsed:: true
	- ## Why Distributed Locking?
		- In a distributed system, multiple servers may try to modify the same resource simultaneously.
		- A distributed lock ensures only one process executes a critical section at a time.
		- ```
		  Problem without lock:
		    Server A reads inventory: 1 item left
		    Server B reads inventory: 1 item left
		    Server A decrements → 0 items
		    Server B decrements → -1 items (oversold!)
		  
		  With distributed lock:
		    Server A acquires lock → reads → decrements → releases
		    Server B waits → acquires lock → reads 0 → rejects order
		  ```
	-
	- ## Redis Distributed Lock (Redlock)
		- ```
		  Simple Redis Lock:
		    SET lock_key unique_value NX PX 30000
		    NX = only set if not exists
		    PX 30000 = expire in 30 seconds (auto-release if crash)
		  
		  Release (Lua script for atomicity):
		    if redis.call("GET", key) == value then
		        return redis.call("DEL", key)
		    else
		        return 0
		    end
		  
		  Redlock (multi-node):
		    → Acquire lock on N/2+1 Redis nodes
		    → If majority acquired within timeout → lock held
		    → Prevents single Redis node SPOF
		  ```
	-
	- ## Zookeeper for Coordination
		- ```
		  Zookeeper provides:
		    → Distributed locks (ephemeral nodes)
		    → Leader election
		    → Service registry
		    → Configuration management
		  
		  Ephemeral Node Lock:
		    1. Client creates /locks/my-lock (ephemeral sequential node)
		    2. Client lists all nodes under /locks/
		    3. If client's node has lowest sequence → it holds the lock
		    4. Otherwise → watch the node with next lower sequence
		    5. When watched node deleted → client re-checks
		  
		  Used by: Kafka (broker coordination), HBase, Hadoop
		  ```
	-
	- ## Fencing Tokens
		- Prevent a "zombie" process (thought it had the lock but it expired) from corrupting data.
		- ```
		  Flow:
		    1. Client acquires lock → receives fencing token (monotonically increasing number)
		    2. Client sends request to storage with token: token=33
		    3. Storage rejects any request with token < current max seen
		    4. If zombie client sends with old token=31 → rejected
		  ```
-
- # Data Pipelines & Stream Processing
  collapsed:: true
	- ## Batch vs Stream Processing
		- ```
		  Batch Processing:
		    → Process large volumes of data at scheduled intervals
		    → High latency (hours), high throughput
		    → Use: Daily reports, ETL, ML training
		    → Tools: Apache Spark, Hadoop MapReduce, AWS Glue
		  
		  Stream Processing:
		    → Process data continuously as it arrives
		    → Low latency (milliseconds to seconds)
		    → Use: Real-time analytics, fraud detection, live dashboards
		    → Tools: Apache Kafka Streams, Apache Flink, Apache Storm
		  ```
	-
	- ## Lambda Architecture
		- Combines batch and stream processing for both accuracy and low latency.
		- ```
		  Layers:
		    Batch Layer:   Process all historical data → accurate but slow
		    Speed Layer:   Process recent data in real-time → fast but approximate
		    Serving Layer: Merge batch + speed results → serve queries
		  
		  Problem: Maintaining two codebases (batch + stream)
		  Solution: Kappa Architecture (stream-only, replay for batch)
		  ```
	-
	- ## Kafka Streams & Flink
		- ```
		  Kafka Streams:
		    → Library (not a cluster), runs inside your app
		    → Reads from Kafka topics, processes, writes back to Kafka
		    → Stateful operations: joins, aggregations, windowing
		    → Exactly-once semantics
		  
		  Apache Flink:
		    → Distributed stream processing cluster
		    → True streaming (not micro-batch like Spark Streaming)
		    → Event time processing (handle late-arriving events)
		    → Stateful computations with checkpointing
		    → Use: Complex event processing, real-time ML inference
		  
		  Windowing:
		    Tumbling Window: fixed non-overlapping (0-60s, 60-120s)
		    Sliding Window:  overlapping (last 60s, updated every 10s)
		    Session Window:  gap-based (group events within N seconds of each other)
		  ```
	-
	- ## ETL vs ELT
		- ```
		  ETL (Extract → Transform → Load):
		    → Transform data before loading into warehouse
		    → Traditional approach, good for structured data
		    → Tools: Informatica, Talend, AWS Glue
		  
		  ELT (Extract → Load → Transform):
		    → Load raw data first, transform inside warehouse
		    → Modern approach, leverages warehouse compute power
		    → Tools: dbt (data build tool) + Snowflake/BigQuery/Redshift
		  
		  Data Lake vs Data Warehouse:
		    Data Lake:      Raw data in any format (S3, HDFS)
		    Data Warehouse: Structured, processed, query-optimized (Snowflake, BigQuery)
		    Data Lakehouse:  Combines both (Delta Lake, Apache Iceberg)
		  ```
-
- # More Learn
	- Explore the following links for valuable resources, communities, and tools to enhance your system design skills:
	-
	- ## Github & Webs
		- [System Design Primer – Most comprehensive free resource](https://github.com/donnemartin/system-design-primer)
		- [System Design E-Book by Karan Pratap Singh](https://github.com/karanpratapsingh/system-design)
		- [Awesome Scalability – Patterns of large-scale systems](https://github.com/binhnguyennus/awesome-scalability)
		- [System Design Interview Preparation](https://github.com/checkcheckzz/system-design-interview)
		- [Domain-Driven Hexagon – Clean architecture patterns](https://github.com/Sairyss/domain-driven-hexagon)
		- [Design Patterns for Humans – Simplest explanations](https://github.com/kamranahmedse/design-patterns-for-humans)
		- [Awesome Design Patterns – Multiple languages](https://github.com/DovAmir/awesome-design-patterns)
		- [ByteByteGo Newsletter – System design explained visually](https://blog.bytebytego.com/)
		- [High Scalability Blog – Real-world architecture case studies](http://highscalability.com/)
		- [Martin Fowler's Architecture Articles](https://martinfowler.com/architecture/)
		- [AWS Architecture Center](https://aws.amazon.com/architecture/)
		- [Google SRE Book – Free online](https://sre.google/sre-book/table-of-contents/)
	-
	- ## Master Playlists YouTube 📺 Free
		- [System Design by Gaurav Sen 🏗️](https://youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX)
		- [System Design Interview by Tech Dummies 🎯](https://www.youtube.com/@TechDummiesNarendraL)
		- [DSA and Algo with Videos 🌿🧠🌿](https://youtube.com/playlist?list=PLPMIlPa0MRx5c_1s2e4VDQkORCO56W21B&si=9dXvGjjV_dbV_l0o)