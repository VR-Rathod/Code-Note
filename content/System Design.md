---
seoTitle: System Design – Complete Guide to Scalable Architecture, Distributed Systems & Interview Prep
description: "Master system design with this comprehensive guide: scalability, load balancing, caching, database sharding, microservices, CAP theorem, message queues, rate limiting, API design, real-world case studies, and back-of-envelope estimation for software engineers and FAANG interview preparation."
keywords: "system design, scalability, load balancing, caching, microservices, CAP theorem, distributed systems, database sharding, API design, high availability, fault tolerance, system design interview, Kafka, Redis, CDN, consistent hashing, rate limiting, URL shortener, chat system, VR-Rathod, Code-Note, code note vr"
displayTitle: System Design
---

> [!info] What is System Design?
> System design is the process of defining **architecture, components, interfaces, and data flow** to satisfy specified requirements at scale.
> It answers *how* a system will work — not just *what* it will do.
> Sub-pages: [[System Design - Scalability & CAP]], [[System Design - Databases]], [[System Design - Caching]], [[System Design - Microservices]], [[System Design - APIs & Networking]], [[System Design - Case Studies]], [[System Design - CRDT]], [[System Design - Consensus (Raft & Paxos)]], [[System Design - Logical Clocks]], [[System Design - LSM & B+ Trees]], [[System Design - Gossip Protocol]], [[System Design - Distributed Transactions]], [[System Design - Vector Databases]], [[System Design - Consistent Hashing]].

> [!tip] Interview Approach — 7 Steps
> **①** Clarify requirements → **②** Estimate scale (QPS, storage) → **③** Define APIs → **④** Draw HLD → **⑤** Deep dive components → **⑥** Identify bottlenecks & trade-offs → **⑦** Discuss failure & recovery

-
- # 🗺 Learning Roadmap
  collapsed:: true
	- ## Beginner → Advanced Path
	  collapsed:: true
		- ```mermaid
		  flowchart LR
		      A["🟢 Beginner"] --> B["Client-Server\nHTTP · DNS · CDN"]
		      B --> C["SQL vs NoSQL\nIndexing · ACID"]
		      C --> D["Caching\nRedis · LRU · TTL"]
		      D --> E["🟡 Intermediate"]
		      E --> F["CAP Theorem\nReplication · Sharding"]
		      F --> G["Message Queues\nKafka · RabbitMQ"]
		      G --> H["Microservices\nAPI Gateway · Service Mesh"]
		      H --> I["🔴 Advanced"]
		      I --> J["Event Sourcing\nCQRS · Saga"]
		      J --> K["Distributed Locks\nLeader Election · Raft"]
		      K --> L["Case Studies\nYouTube · Chat · Twitter"]
		  ```
	-
	- ## Topic Map
	  collapsed:: true
		- | Topic | Difficulty | Key Concepts |
		  |-------|-----------|-------------|
		  | [[System Design - Scalability & CAP]] | 🟢 Beginner | Vertical/Horizontal scaling, CAP, PACELC, SLA/SLO |
		  | [[System Design - Caching]] | 🟢 Beginner | Redis, LRU, TTL, Write-through, Cache stampede |
		  | [[System Design - Databases]] | 🟡 Intermediate | Replication, Sharding, Indexing, Connection pooling |
		  | [[System Design - APIs & Networking]] | 🟡 Intermediate | REST, gRPC, GraphQL, WebSockets, DNS, CDN, Rate limiting |
		  | [[System Design - Consistent Hashing]] | 🟡 Intermediate | Hash ring, VNodes, Rebalancing, Dynamic scaling |
		  | [[System Design - LSM & B+ Trees]] | 🟡 Intermediate | MemTable, SSTables, Compaction, B+ Trees indexing |
		  | [[System Design - Microservices]] | 🔴 Advanced | Service mesh, Circuit breaker, Saga, CQRS, Outbox |
		  | [[System Design - Case Studies]] | 🔴 Advanced | URL shortener, Chat, YouTube, Twitter feed, Uber |
		  | [[System Design - CRDT]] | 🔴 Advanced | CvRDT, CmRDT, Join-Semilattice, LWW-Element-Set, Collaborative systems |
		  | [[System Design - Consensus (Raft & Paxos)]] | 🔴 Advanced | Leader election, Log replication, Safety, Raft, Paxos |
		  | [[System Design - Logical Clocks]] | 🔴 Advanced | Lamport timestamps, Vector clocks, Causal order |
		  | [[System Design - Gossip Protocol]] | 🔴 Advanced | Gossip propagation, SWIM membership, Failure detection |
		  | [[System Design - Distributed Transactions]] | 🔴 Advanced | 2PC, 3PC, Saga pattern, Compensating transactions |
		  | [[System Design - Vector Databases]] | 🔴 Advanced | Embeddings, Cosine similarity, ANN, HNSW, IVF-PQ |
-
- # ⚡ Core Concepts Quick Reference
  collapsed:: true
	- ## Scalability Cheat Sheet
	  collapsed:: true
		- | Strategy | What | Use When |
		  |---------|------|---------|
		  | Vertical Scale | Bigger machine (more CPU/RAM) | Simple, small-scale. Quick fix. |
		  | Horizontal Scale | More machines + load balancer | Production at scale. Always prefer. |
		  | Read Replicas | Copies of DB for read traffic | Read-heavy workloads (10:1 ratio) |
		  | Sharding | Split DB rows across servers | Write-heavy or >TB data scale |
		  | Caching | In-memory data (Redis) | Frequently read, rarely changed data |
		  | CDN | Edge-cached static content | Static assets, global user base |
		  | Message Queue | Async decoupling (Kafka) | Background jobs, event-driven flows |
	-
	- ## CAP Theorem at a Glance
	  collapsed:: true
		- > [!important] CAP — Pick 2 of 3 (but P is always required)
		  > In practice you choose **CP** (consistency) or **AP** (availability).
		- | System | Type | Behaviour |
		  |-------|------|----------|
		  | PostgreSQL (single node) | CA | Full ACID — no partition tolerance |
		  | MongoDB, HBase, Zookeeper | CP | Returns error rather than stale data |
		  | Cassandra, DynamoDB, CouchDB | AP | Always responds — may be stale |
	-
	- ## Availability Numbers
	  collapsed:: true
		- | SLA | Downtime / year | Downtime / month |
		  |-----|----------------|-----------------|
		  | 99% | 3.65 days | 7.2 hours |
		  | 99.9% | 8.76 hours | 43.8 min |
		  | 99.99% | 52.6 minutes | 4.38 min |
		  | 99.999% | 5.26 minutes | 26 sec |
	-
	- ## Latency Numbers (Know These!)
	  collapsed:: true
		- ```
		  L1 cache reference          0.5 ns
		  L2 cache reference            7 ns
		  Main memory reference       100 ns
		  SSD random read             150 μs
		  Read 1MB from RAM           250 μs
		  Round trip in same datacenter 0.5 ms
		  Read 1MB from SSD             1 ms
		  Disk seek                    10 ms
		  Packet CA → Netherlands     150 ms
		  ```
		- > [!tip] Rules of thumb
		  > Memory is 1000× faster than SSD. SSD is 100× faster than HDD.
		  > Cross-datacenter latency ≈ 150–300 ms. Design accordingly.
-
- # 🏗 Architecture Patterns
  collapsed:: true
	- ## Request Flow — Typical Web System
	  collapsed:: true
		- ```mermaid
		  flowchart TD
		      U[👤 User] --> DNS[DNS Resolution]
		      DNS --> CDN[CDN — Static Assets]
		      DNS --> LB[Load Balancer]
		      LB --> API1[App Server 1]
		      LB --> API2[App Server 2]
		      API1 --> Cache[Redis Cache]
		      API2 --> Cache
		      Cache -->|miss| DB_R[Read Replica]
		      API1 -->|writes| DB_P[Primary DB]
		      DB_P -->|replicate| DB_R
		      API1 --> MQ[Message Queue]
		      MQ --> Worker[Background Worker]
		      Worker --> DB_P
		  ```
	-
	- ## Monolith vs Microservices
	  collapsed:: true
		- | Aspect | Monolith | Microservices |
		  |--------|---------|--------------|
		  | Deploy | Single unit | Independent per service |
		  | Scale | Scale entire app | Scale individual services |
		  | Fault isolation | One bug can crash all | Failures isolated |
		  | Complexity | Low initially | High (distributed systems) |
		  | Team size | Small teams | Large, independent teams |
		  | Start with | ✅ Always | ❌ Don't start here |
		  | Migrate via | — | Strangler Fig pattern |
	-
	- ## Load Balancing Algorithms
	  collapsed:: true
		- | Algorithm | How | Best For |
		  |----------|-----|---------|
		  | Round Robin | Rotate sequentially | Equal-capacity servers |
		  | Weighted Round Robin | More requests to stronger servers | Mixed-capacity fleet |
		  | Least Connections | Route to least busy | Long-lived connections |
		  | IP Hash | Same client → same server | Session stickiness |
		  | Least Response Time | Route to fastest responding | Latency-sensitive APIs |
-
- # 🗄 Data Layer Patterns
  collapsed:: true
	- ## Caching Strategies
	  collapsed:: true
		- | Strategy | Write Flow | Pros | Cons |
		  |---------|-----------|------|------|
		  | Cache-Aside | App reads cache → miss → load DB → populate | Simple, flexible | Cold start, stale risk |
		  | Write-Through | Write cache + DB together | Always fresh | Slow writes |
		  | Write-Back | Write cache → async sync to DB | Fast writes | Data loss risk on crash |
		  | Read-Through | Cache handles DB fetch on miss | Transparent | Library needed |
	-
	- ## Database Sharding Strategies
	  collapsed:: true
		- | Method | Key | Pros | Cons |
		  |--------|-----|------|------|
		  | Range | user_id 1–1M → Shard 1 | Simple, range queries easy | Hot spots |
		  | Hash | hash(id) % N | Even distribution | Range queries hard, resharding painful |
		  | Directory | Lookup table → shard | Most flexible | Lookup table = SPOF |
		  | Geographic | US → US shard | Low latency, GDPR | Uneven regions |
	-
	- ## Redis vs Memcached
	  collapsed:: true
		- | Feature | Redis | Memcached |
		  |---------|-------|----------|
		  | Data types | Strings, Lists, Sets, Hashes, Sorted Sets, Streams | Strings only |
		  | Persistence | Yes (RDB + AOF) | No |
		  | Pub/Sub | Yes | No |
		  | Clustering | Redis Cluster (built-in) | Client-side only |
		  | Lua scripting | Yes | No |
		  | Best for | Sessions, queues, leaderboards, rate limiting | Simple high-throughput key-value cache |
-
- # 🔌 API & Communication
  collapsed:: true
	- ## REST vs GraphQL vs gRPC
	  collapsed:: true
		- | Aspect | REST | GraphQL | gRPC |
		  |--------|------|---------|------|
		  | Protocol | HTTP/1.1–2 | HTTP | HTTP/2 |
		  | Format | JSON | JSON | Protocol Buffers (binary) |
		  | Type safety | No | Yes (schema) | Yes (protobuf) |
		  | Caching | Easy (HTTP cache) | Complex | No native |
		  | Streaming | No | Subscriptions | Full bidirectional |
		  | Browser support | ✅ | ✅ | ❌ (limited) |
		  | Use for | Public APIs, CRUD | Mobile / BFF | Internal microservices |
	-
	- ## Real-Time Communication
	  collapsed:: true
		- | Method | Direction | When to Use |
		  |--------|----------|------------|
		  | Short Polling | Client → Server (repeated) | Simple, infrequent updates |
		  | Long Polling | Client waits, server holds | Near real-time, simple fallback |
		  | WebSockets | Bidirectional persistent | Chat, gaming, live collaboration |
		  | SSE | Server → Client only | Dashboards, feeds, notifications |
	-
	- ## Rate Limiting Algorithms
	  collapsed:: true
		- | Algorithm | How | Allows Burst? | Accuracy |
		  |----------|-----|--------------|---------|
		  | Token Bucket | Tokens refill at fixed rate | ✅ Yes | High |
		  | Leaky Bucket | Fixed output rate | ❌ Smoothed | High |
		  | Fixed Window | Count per time window | ✅ at edges | Low (boundary bug) |
		  | Sliding Window Log | Track timestamps | ✅ | Very High |
		  | Sliding Window Counter | Weighted window | Partial | High |
-
- # 🧩 Distributed System Patterns
  collapsed:: true
	- ## Key Patterns Quick Reference
	  collapsed:: true
		- | Pattern | Problem Solved | Key Tool |
		  |---------|--------------|---------|
		  | Circuit Breaker | Cascading failures | Resilience4j, Hystrix |
		  | Bulkhead | Thread pool isolation | Separate pools per service |
		  | Retry + Backoff | Transient failures | Exponential backoff + jitter |
		  | Saga | Distributed transactions | Choreography or Orchestration |
		  | Outbox | Atomic DB write + event publish | Transactional outbox table |
		  | CQRS | Read/write model separation | Separate read/write stores |
		  | Event Sourcing | Audit trail + state replay | Kafka / EventStore |
		  | Sidecar | Infrastructure separation | Envoy, Istio |
		  | Strangler Fig | Monolith → microservices migration | API Gateway routing |
	-
	- ## Circuit Breaker States
	  collapsed:: true
		- ```mermaid
		  stateDiagram-v2
		      [*] --> CLOSED
		      CLOSED --> OPEN : N failures threshold
		      OPEN --> HALF_OPEN : Timeout expires
		      HALF_OPEN --> CLOSED : Test request succeeds
		      HALF_OPEN --> OPEN : Test request fails
		  ```
	-
	- ## Message Queue Comparison
	  collapsed:: true
		- | Feature | Apache Kafka | RabbitMQ | AWS SQS |
		  |---------|------------|---------|--------|
		  | Type | Distributed log | AMQP broker | Managed cloud queue |
		  | Retention | Configurable (days/weeks) | Deleted on consume | Up to 14 days |
		  | Throughput | Millions/sec | Tens of thousands/sec | Unlimited (managed) |
		  | Ordering | Per partition | Per queue | FIFO queues available |
		  | Replay | ✅ Yes (any offset) | ❌ No | ❌ No |
		  | Best for | Event streaming, audit logs, CQRS | Task queues, RPC, complex routing | AWS ecosystem, serverless |
-
- # 📐 Back-of-Envelope Estimation
  collapsed:: true
	- ## Storage Size Reference
	  collapsed:: true
		- | Item | Size |
		  |------|------|
		  | ASCII character | 1 byte |
		  | Integer | 4 bytes |
		  | Long / Double | 8 bytes |
		  | UUID | 16 bytes |
		  | Tweet (text) | ~280 bytes |
		  | Profile photo | ~200 KB |
		  | HD photo | ~3 MB |
		  | 1 min HD video | ~50 MB |
	-
	- ## QPS Estimation — Twitter Scale
		- ```
		  Inputs:
		    300M MAU, 50% DAU = 150M daily active users
		    100 reads/day, 2 writes/day per user
		  
		  Read QPS:  150M × 100 / 86,400 ≈ 174,000 QPS   (peak 2×: 350K)
		  Write QPS: 150M × 2   / 86,400 ≈   3,500 QPS   (peak 2×: 7K)
		  
		  Storage / year:
		    3,500 writes/sec × 86,400 × 365 = 110B tweets
		    110B × 780 bytes ≈ 86 TB/year
		  ```
-
- # 🔐 Security Quick Reference
  collapsed:: true
	- ## Auth Patterns
	  collapsed:: true
		- | Pattern | How | Use When |
		  |---------|-----|---------|
		  | Session + Cookie | Server stores session ID | Traditional web apps |
		  | JWT | Stateless signed token | SPAs, mobile, microservices |
		  | OAuth 2.0 | Delegate auth to provider | "Login with Google/GitHub" |
		  | API Key | Static key in header | Server-to-server, developer APIs |
		  | mTLS | Mutual certificate auth | Microservice-to-microservice |
	-
	- ## Common Vulnerabilities & Fixes
	  collapsed:: true
		- | Attack | Fix |
		  |--------|-----|
		  | SQL Injection | Parameterised queries / ORM |
		  | XSS | Sanitise output, Content-Security-Policy |
		  | CSRF | CSRF tokens, SameSite cookies |
		  | IDOR | Always verify ownership server-side |
		  | DDoS | Rate limiting + CDN + WAF |
		  | Broken Auth | MFA, short JWT TTL + refresh tokens |
-
- # 🏆 Case Studies
	- See [[System Design - Case Studies]] for full deep-dives.
	-
	- ## At a Glance
		- | System | Core Challenge | Key Solutions |
		  |--------|--------------|--------------|
		  | URL Shortener | Unique ID generation, high-read cache | Base62 encoding, Redis, 301/302 redirect |
		  | Chat (WhatsApp) | Real-time delivery, message ordering | WebSockets, Kafka, Cassandra for history |
		  | YouTube | Video upload, transcoding, global delivery | Object storage (S3), CDN, async transcoding |
		  | Twitter Feed | Fan-out on write vs fan-out on read | Hybrid fanout, Redis sorted sets for timeline |
		  | Uber | Real-time location, geo matching | Geohash / S2, WebSockets, eventual consistency |
		  | Rate Limiter | Distributed counters, accuracy | Redis + Lua script, sliding window counter |
- # 📚 Useful Links & Resources
	- ## Books
		- [Designing Data-Intensive Applications – Kleppmann](https://dataintensive.net) — The bible of distributed systems
		- [System Design Interview Vol 1 & 2 – Alex Xu](https://bytebytego.com) — Interview-focused case studies
		- [Building Microservices – Sam Newman](https://samnewman.io/books/building_microservices/) — Microservices patterns
	-
	- ## Online Resources
		- [ByteByteGo Newsletter](https://blog.bytebytego.com) — Visual system design explanations
		- [High Scalability](http://highscalability.com) — Real architecture case studies
		- [System Design Primer (GitHub)](https://github.com/donnemartin/system-design-primer) — Free open-source guide
		- [Grokking System Design](https://www.designgurus.io/course/grokking-the-system-design-interview) — Interview prep course
		- [AWS Architecture Center](https://aws.amazon.com/architecture/) — Reference architectures