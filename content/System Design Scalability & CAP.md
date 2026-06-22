---
seoTitle: Scalability & CAP Theorem – System Design Learning Guide
description: "Learn scalability and CAP theorem with plain English explanations, real-world analogies, and practical examples. Covers vertical vs horizontal scaling, CAP theorem, PACELC, SLA, consistent hashing, and back-of-envelope estimation."
keywords: "scalability tutorial, CAP theorem explained, horizontal scaling, vertical scaling, SLA SLO SLI, consistent hashing explained, system design beginner, distributed systems basics, VR-Rathod, Code-Note"
displayTitle: System Design - Scalability & CAP
title: System Design Scalability & CAP
treeTitle: System Design - Scalability & CAP
---

> [!info] About This Page
> **Topic:** Scalability fundamentals — the foundation of every large system.
> Parent: [[System Design]]. Next: [[System Design Caching]] → [[System Design Databases]].

- # What is Scalability? (Start Here)
  collapsed:: true
	- ## The Simple Idea
	  collapsed:: true
		- Imagine you open a tea stall. One customer — easy, you handle it alone.
		  Then 100 customers arrive. You need help. **That's scaling.**
		-
		- In software:
		  **Scalability = the ability of a system to handle MORE work by adding resources**
		-
		- Two ways to scale:
		  > **Scale Up (Vertical)** → Buy a bigger, faster machine
		  > **Scale Out (Horizontal)** → Add more machines and split the work
	-
	- ## Vertical Scaling (Scale Up)
	  collapsed:: true
		- > [!tip] Analogy
		  > You replace your small cooking stove with a giant industrial stove.
		  > One person, more capacity — but there's a limit to how big a stove can get.
		-
		- **What it means:** Upgrade your server — more CPU cores, more RAM, faster SSD.
		-
		- ```
		  Before: 1 server × 4 CPU, 8 GB RAM
		  After:  1 server × 64 CPU, 512 GB RAM
		  
		  Common for: Databases (PostgreSQL, MySQL) in early/mid stage
		  ```
		- **Pros:** Simple — no code changes needed. Just upgrade hardware.
		- **Cons:**
			- Hardware has a ceiling (you can't infinitely upgrade)
			- Single Point of Failure — if that one machine crashes, everything dies
			- Very expensive at the top end
	-
	- ## Horizontal Scaling (Scale Out)
	  collapsed:: true
		- > [!tip] Analogy
		  > Instead of one giant stove, you open 10 stalls and hire 10 cooks.
		  > Each handles a portion of customers. Add more stalls as needed.
		-
		- **What it means:** Run multiple copies of your app across many servers. A **load balancer** splits traffic between them.
		-
		- ```
		  Before:                    After:
		  1 × [App Server]           [Load Balancer]
		                              ├── App Server 1
		                              ├── App Server 2
		                              └── App Server 3
		  ```
		- **Pros:**
			- Virtually unlimited capacity — add servers on demand
			- No single point of failure — if one server dies, others continue
			- Cost-efficient (use cheap commodity hardware)
		- **Cons:**
			- Your app must be **stateless** (no local session storage)
			- Needs a load balancer
			- Distributed data management is complex
		- > [!important] Key Rule
		  > **Always design for horizontal scaling.** Vertical has a ceiling. Horizontal doesn't.
		  > This means: never store session state on the server itself — use Redis or a database.
- # Latency vs Throughput
  collapsed:: true
	- ## Simple Explanation
	  collapsed:: true
		- > [!tip] Analogy — Road vs Highway
		  > **Latency** = how long it takes ONE car to travel from A to B (speed of the road)
		  > **Throughput** = how many cars can travel per hour (capacity of the highway)
		  > A narrow road can be fast for a single car (low latency) but handle few cars (low throughput).
		  > A 10-lane highway moves thousands of cars/hour (high throughput) but each car might be slower due to merging traffic.
		-
		- | Concept | Definition | Goal | Example |
		  |---------|-----------|------|--------|
		  | **Latency** | Time for ONE request to complete | As low as possible | 200ms per API call |
		  | **Throughput** | Requests handled per second (QPS) | As high as possible | 5,000 req/sec |
		-
		- They often **trade off** — batching 1000 items together improves throughput but increases individual latency.
	-
	- ## Numbers to Know
	  collapsed:: true
		- Think of these as reference points — not exact numbers, but the **order of magnitude** matters:
		-
		- | Operation | Approx Time | Real Feeling |
		  |----------|------------|-------------|
		  | Reading from CPU cache | 1 ns | Instant |
		  | Reading from RAM | 100 ns | Still instant |
		  | Reading from SSD | 150,000 ns = 0.15ms | Very fast |
		  | Reading from HDD | 10,000,000 ns = 10ms | Noticeably slow |
		  | Network request (same datacenter) | 0.5 ms | Fast |
		  | Network request (cross-continent) | 150 ms | User will notice |
		-
		- > [!important] Rule of Thumb
		  > Memory is **1,000×** faster than SSD. SSD is **100×** faster than HDD.
		  > Every network hop adds latency — minimize them in your critical path.
- # CAP Theorem (The Most Famous Trade-off)
  collapsed:: true
	- ## What Problem Does CAP Solve?
	  collapsed:: true
		- Once you have multiple servers (distributed system), a fundamental problem arises:
		  **What happens when the network between servers breaks?**
		- This is called a **network partition** — servers can't talk to each other temporarily.
		- CAP theorem says: when a partition happens, you must choose between **Consistency** or **Availability**.
	-
	- ## The Three Properties
	  collapsed:: true
		- **Consistency (C)**
		  Every read returns the **most recent write** — all nodes show the same data.
		  *(Consistency ordering is often managed by logical clocks, see [[System Design Logical Clocks]])*
		  > Think: You update your profile picture. Every server in the world sees the new picture instantly.
		-
		- **Availability (A)**
		  Every request gets **a response** — even if it might not be the latest data.
		  > Think: You always get an answer, even if it's slightly outdated.
		-
		- **Partition Tolerance (P)**
		  The system **keeps working even if the network between servers breaks**.
		  > Think: Half the servers in the US lose connection to Europe — do both halves keep working?
		-
		- > [!warning] The Key Insight
		  > In any real distributed system, **network partitions WILL happen** (cables break, packets drop).
		  > So **P is not optional** — you must tolerate partitions.
		  > The real choice is: **CP (sacrifice some availability) OR AP (sacrifice some consistency)**.
	-
	- ## CP vs AP — Practical Examples
	  collapsed:: true
		- | System Type | What it Sacrifices | Real Behaviour | Examples |
		  |------------|-----------------|----------------|---------|
		  | **CP Systems** | Availability | Returns an ERROR rather than stale data | HBase, Zookeeper, etcd |
		  | **AP Systems** | Consistency | Returns STALE DATA but never errors | Cassandra, DynamoDB, CouchDB |
		  | Single-node DB | Neither (no partitions) | Full ACID | PostgreSQL, MySQL (one server) |
		-
		- **When to choose CP:**
		  Bank transactions, financial ledgers, inventory counts — **wrong data = wrong money**, unacceptable.
		-
		- **When to choose AP:**
		  Social media likes, product recommendations, shopping cart — **slightly stale data is fine**,
		  but the app must stay available.
	-
	- ## PACELC — What CAP Misses
	  collapsed:: true
		- CAP only describes behaviour during a partition. But what about **normal operation** (no partition)?
		  Even then, you face a trade-off: **Latency vs Consistency**.
		-
		- ```
		  PACELC says:
		    If Partition happens:    choose Availability  OR  Consistency
		    Else (normal operation): choose Low Latency   OR  Consistency
		  
		  Example:
		    DynamoDB → During partition: prefers Availability
		               During normal:   prefers Low Latency
		    HBase    → During partition: prefers Consistency
		               During normal:   prefers Consistency (accepts higher latency)
		  ```
- # Availability — The "Nines"
  collapsed:: true
	- ## Why It Matters
	  collapsed:: true
		- When a company says "we have 99.9% uptime" — what does that actually mean?
		  More than it sounds — the difference between 99% and 99.99% is enormous.
		-
		- | SLA | Downtime / Year | Downtime / Month | What it means |
		  |-----|----------------|-----------------|--------------|
		  | 99% ("two nines") | 3.65 **days** | 7.2 hours | Noticeable to users |
		  | 99.9% ("three nines") | 8.76 **hours** | 43.8 min | Acceptable for most apps |
		  | 99.99% ("four nines") | 52.6 **minutes** | 4.38 min | Enterprise-grade |
		  | 99.999% ("five nines") | 5.26 **minutes** | 26 sec | Telecom / critical systems |
		-
		- > [!important] Compound Availability
		  > If your app depends on 3 services each with 99.9% availability:
		  > **Combined = 99.9% × 99.9% × 99.9% = 99.7%**
		  > Every dependency in your critical path degrades total availability.
		  > This is why you need circuit breakers, retries, and fallbacks.
	-
	- ## SLI / SLO / SLA — The Three Layers
	  collapsed:: true
		- These are often confused. Here's the simplest explanation:
		-
		- ```
		  SLI (Service Level Indicator) — What you MEASURE
		      "Our API had 99.94% uptime this month"
		      Other SLIs: error rate, response time p99, throughput
		  
		  SLO (Service Level Objective) — What you AIM FOR (internal)
		      "We target < 1% error rate and < 200ms p99 latency"
		      Internal engineering target
		  
		  SLA (Service Level Agreement) — What you PROMISE (external + legal)
		      "We guarantee 99.9% uptime or we give you credits"
		      Customer-facing contract with consequences
		  
		  Error Budget = 100% - SLO target
		      99.9% SLO → 0.1% error budget = 8.76 hours per year
		      This budget is "spent" on incidents, planned maintenance, risky deployments
		      When budget runs out → no more risky changes until next period
		  ```
		- > [!tip] Why Error Budgets Are Powerful
		  > Error budgets make reliability a shared conversation between engineering and product.
		  > If you're spending budget, you slow down risky feature releases.
		  > If you have plenty of budget left, you can move fast.
- # Consistent Hashing (How Distributed Caches Scale)
  collapsed:: true
	- > [!info] Full Guide
	  > See [[System Design Consistent Hashing]] for in-depth coverage, mathematical rebalancing, and Python/JS code.
	- ## The Problem First
	  collapsed:: true
		- Imagine you have 3 Redis servers and you want to distribute keys across them.
		  Simple approach: `server = hash(key) % 3`
		-
		- ```
		  key "user:123" → hash → 456789 → 456789 % 3 = 0 → Server 0
		  key "user:456" → hash → 789012 → 789012 % 3 = 1 → Server 1
		  ```
		-
		- **The problem:** You add a 4th server. Now `% 3` becomes `% 4`.
		  **Almost ALL keys map to different servers** — a massive cache invalidation storm!
		  Every key misses cache and hits your database. Your DB collapses. 💀
	-
	- ## The Solution — Consistent Hashing
	  collapsed:: true
		- > [!tip] Analogy — A Clock Face
		  > Imagine a clock face (a ring from 0 to 2^32).
		  > Place your servers at various points on the ring.
		  > For each key, hash it to a point on the ring.
		  > The key belongs to the **nearest server clockwise**.
		-
		- ```
		  Ring (simplified):
		    0 -------- Server A (pos 100) -------- Server B (pos 200) -------- Server C (pos 300) ---- 360
		  
		  Key at position 150 → nearest clockwise server → Server B
		  Key at position 50  → nearest clockwise server → Server A
		  Key at position 250 → nearest clockwise server → Server C
		  ```
		-
		- **Adding a new server (Server D at position 175):**
		  Only keys between 150–175 move from Server B to Server D.
		  Everything else stays put. Only **~1/N keys remapped** instead of all keys!
		-
		- **Virtual Nodes:** Each physical server gets multiple positions on the ring.
		  This ensures even distribution even with few servers.
		  Used by: **Cassandra, DynamoDB, Amazon ElastiCache**.
- # Back-of-Envelope Estimation
  collapsed:: true
	- ## Why Engineers Do This
	  collapsed:: true
		- Before designing a system, you need to know: **How big will this actually be?**
		  A system for 1,000 users vs 100 million users requires completely different architecture.
		  Back-of-envelope = rough math to get the right **order of magnitude** in 5 minutes.
	-
	- ## The Formula (Memorise This)
	  collapsed:: true
		- ```
		  Step 1: DAU (Daily Active Users)
		      DAU = MAU × daily_active_percentage
		      e.g., 300M MAU × 50% = 150M DAU
		  
		  Step 2: QPS (Queries Per Second)
		      QPS = DAU × actions_per_day ÷ 86,400  (seconds in a day)
		      Peak QPS = QPS × 2   (traffic spikes during peak hours)
		  
		  Step 3: Storage per day
		      Storage = writes_per_second × record_size_bytes
		      Scale to: per day → per year → over 5 years
		  
		  Step 4: Bandwidth
		      Bandwidth = QPS × avg_response_size_bytes
		  ```
	-
	- ## Worked Example — Design Twitter
	  collapsed:: true
		- ```
		  Given:
		    300M monthly active users
		    50% use daily → 150M DAU
		    Average user reads 100 tweets/day, posts 2 tweets/day
		  
		  Write QPS:
		    150M users × 2 posts / 86,400 sec = 3,472 writes/sec
		    Peak: ~7,000 writes/sec
		  
		  Read QPS:
		    150M users × 100 reads / 86,400 sec = 173,611 reads/sec
		    Peak: ~350,000 reads/sec
		    → Read-heavy! Need caching + read replicas.
		  
		  Storage per year:
		    3,472 writes/sec × 86,400 sec × 365 days = 109.6 billion tweets/year
		    Each tweet: 280 chars (~280 bytes) + metadata (~500 bytes) = ~780 bytes
		    109.6B × 780 bytes = ~85 TB of tweet text per year
		    Plus media (photos, videos) = 10–100× more
		  
		  Conclusion:
		    → Write service needs 7K QPS capacity
		    → Read service needs 350K QPS → must use caching + CDN
		    → Storage: ~85TB+/year → needs distributed object storage (S3-style)
		    → Read:Write ratio = 50:1 → optimise hard for reads
		  ```
		- > [!tip] Common Size Reference
		  > ASCII char = 1 byte · Integer = 4 bytes · UUID = 16 bytes
		  > Tweet text = ~280 bytes · Profile photo = ~200 KB · HD photo = ~3 MB · 1 min video = ~50 MB
- # Useful Links & Resources
	- [[System Design]] — Main hub page
	- [[System Design Caching]] — Next: learn how to reduce DB load by 90% with caching
	- [[System Design Databases]] — Deep dive: SQL vs NoSQL, sharding, replication
	- [System Design Primer](https://github.com/donnemartin/system-design-primer) — Free comprehensive guide
	- [ByteByteGo](https://blog.bytebytego.com) — Visual explanations of system design concepts
	- [Designing Data-Intensive Applications](https://dataintensive.net) — The best book on this topic