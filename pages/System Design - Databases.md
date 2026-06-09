---
seoTitle: Database Design at Scale – System Design Guide
description: "Complete database system design reference: SQL vs NoSQL, replication, sharding strategies, indexing, ACID transactions, connection pooling, read/write splitting, and choosing the right database."
keywords: "database design, SQL vs NoSQL, database replication, sharding, indexing, ACID, connection pooling, PostgreSQL, Cassandra, DynamoDB, read replica, system design, VR-Rathod, Code-Note"
displayTitle: System Design - Databases
---

> [!info] About This Page
> Covers **database design at scale** — choosing DBs, replication, sharding, indexing, and ACID.
> Parent: [[System Design]]. See also: [[System Design - Caching]], [[System Design - Scalability & CAP]].

- # SQL vs NoSQL
  collapsed:: true
	- ## Comparison
	  collapsed:: true
		- | Aspect | SQL (Relational) | NoSQL |
		  |--------|-----------------|-------|
		  | Structure | Tables, fixed schema | Document, KV, Column, Graph |
		  | ACID | Full ACID transactions | Eventual consistency (mostly) |
		  | Scaling | Vertical (primarily) | Horizontal (built-in) |
		  | Joins | Rich multi-table joins | Limited or none |
		  | Query | SQL — flexible, powerful | Optimised per access pattern |
		  | Use when | Complex relationships, financial | High write throughput, flexible schema |
		  | Examples | PostgreSQL, MySQL, SQL Server | MongoDB, Cassandra, DynamoDB, Redis |
	-
	- ## NoSQL Types
	  collapsed:: true
		- | Type | Structure | Best For | Examples |
		  |------|----------|---------|---------|
		  | Key-Value | key → value | Sessions, caching, simple lookups | Redis, DynamoDB |
		  | Document | JSON/BSON documents | Flexible schema, CMS, user profiles | MongoDB, CouchDB |
		  | Column-family | Columns grouped by family | Time-series, analytics, wide rows | Cassandra, HBase |
		  | Graph | Nodes + edges | Social networks, recommendations | Neo4j, Amazon Neptune |
		  | Time-Series | Timestamped data points | Metrics, IoT, monitoring | InfluxDB, TimescaleDB |
	-
	- ## How to Choose
	  collapsed:: true
		- ```
		  Use SQL when:
		    ✅ Data has complex relationships (joins needed)
		    ✅ Strong consistency is required (financial, e-commerce)
		    ✅ Schema is stable and well-defined
		    ✅ Reporting / analytics queries needed
		  
		  Use NoSQL when:
		    ✅ Need horizontal scale with massive write throughput
		    ✅ Data is unstructured or schema evolves frequently
		    ✅ Low-latency key-value lookups (caching, sessions)
		    ✅ Time-series or event streams
		  
		  Don't choose NoSQL just because it's "modern".
		  PostgreSQL handles billions of rows with proper indexing + sharding.
		  ```
- # Database Replication
  collapsed:: true
	- ## Primary-Replica (Master-Slave)
	  collapsed:: true
		- ```mermaid
		  flowchart LR
		      App --> LB[Write → Primary]
		      App --> LB2[Read → Replica]
		      Primary["Primary DB\n(Writes)"] -->|replicate| R1["Replica 1\n(Reads)"]
		      Primary -->|replicate| R2["Replica 2\n(Reads)"]
		  ```
		- ```
		  Benefits:
		    ✅ Read scalability — distribute reads across replicas
		    ✅ Failover — promote replica if primary fails (consensus needed, see [[System Design - Consensus (Raft & Paxos)]])
		    ✅ Backups — take snapshots from replica (no impact to primary)
		  
		  Replication lag:
		    Async replication → replicas may be seconds behind
		    Sync replication  → consistent but slower writes
		    Semi-sync         → wait for ≥1 replica (balance)
		  ```
	-
	- ## Primary-Primary (Multi-Master)
	  collapsed:: true
		- ```
		  Both nodes accept reads AND writes.
		  Sync via bidirectional replication (often via Gossip, see [[System Design - Gossip Protocol]]).
		  
		  Pros: High write availability, geographic distribution
		  Cons: Conflict resolution complexity (last-write-wins? custom?)
		  
		  *See [[System Design - CRDT]] for in-depth details on conflict-free data structures used to resolve multi-master write conflicts.*
		  
		  Use when: Multiple datacenters, each needing local writes
		  ```
- # Database Sharding
  collapsed:: true
	- ## Sharding Strategies
	  collapsed:: true
		- | Strategy | Key | Hot Spots? | Range Queries? | Resharding? |
		  |---------|-----|-----------|--------------|------------|
		  | Range | user_id ranges | Yes (popular ranges) | ✅ Easy | Hard |
		  | Hash | hash(id) % N | No | ❌ Hard | Very Hard |
		  | Directory | Lookup table | No | Depends | Easy |
		  | Geographic | Region/country | Maybe | Depends | Medium |
	-
	- ## Consistent Hashing for Shards
	  collapsed:: true
		- ```
		  Problem: hash(key) % N breaks when N changes
		  
		  Solution: Consistent hashing ring
		    → Add server: only remap 1/N keys
		    → Remove server: only 1/N keys move to neighbours
		    → Used in: Cassandra, DynamoDB, Redis Cluster
		  
		  See [[System Design - Consistent Hashing]] for full explanation.
		  ```
	-
	- ## Sharding Challenges
	  collapsed:: true
		- ```
		  Cross-shard joins:     Application-level join (expensive)
		  Cross-shard transactions: 2PC or Saga pattern (see [[System Design - Distributed Transactions]])
		  Resharding:           Move data while serving traffic (blue-green)
		  Hot shards:           Consistent hashing + virtual nodes (see [[System Design - Consistent Hashing]])
		  ID generation:        Snowflake ID / UUID (no auto-increment)
		  ```
- # Database Indexing
  collapsed:: true
	- ## Index Types
	  collapsed:: true
		- | Index Type | How | Best For | Avoid When |
		  |-----------|-----|---------|-----------|
		  | B-Tree (default) | Balanced tree | Range queries, ORDER BY, equality | High-cardinality equality only |
		  | Hash | Hash table | Exact match O(1) | Range queries |
		  | Composite | Multiple columns together | Multi-column WHERE clauses | Wrong column order |
		  | Covering | Index includes all queried columns | Avoid table lookup entirely | Write-heavy tables |
		  | Full-Text | Inverted index | LIKE '%keyword%' search | Structured data |
		  | Partial | Index subset of rows | status = 'active' queries | Rarely filtered columns |
		  
		  *See [[System Design - LSM & B+ Trees]] for in-depth comparisons between read-optimized B+ Trees and write-optimized LSM Trees.*
	-
	- ## Index Best Practices
	  collapsed:: true
		- ```
		  DO:
		    ✅ Index columns in WHERE, JOIN ON, ORDER BY
		    ✅ Use composite index — most selective column first
		    ✅ Use covering index for hot read paths
		    ✅ EXPLAIN / EXPLAIN ANALYZE to verify index is used
		  
		  DON'T:
		    ❌ Index every column — writes become slow
		    ❌ Index low-cardinality columns (gender: M/F) — not selective
		    ❌ Ignore index bloat — VACUUM / ANALYZE periodically
		    ❌ Left-prefix rule violation: INDEX(a,b,c) → WHERE b=? doesn't use index
		  
		  Composite index left-prefix rule:
		    INDEX (last_name, first_name, age)
		    ✅ WHERE last_name = ?
		    ✅ WHERE last_name = ? AND first_name = ?
		    ❌ WHERE first_name = ?          -- skips left column
		    ❌ WHERE age = ?                 -- skips left two columns
		  ```
- # ACID Transactions
  collapsed:: true
	- ## Properties
	  collapsed:: true
		- | Property | Meaning | Example |
		  |---------|---------|--------|
		  | **A**tomicity | All-or-nothing. Partial failure = full rollback. | Bank transfer: debit + credit both succeed or neither. |
		  | **C**onsistency | DB moves valid state → valid state. Constraints hold. | Balance can't go negative if constraint exists. |
		  | **I**solation | Concurrent transactions don't interfere. | Two users booking last seat — only one wins. |
		  | **D**urability | Committed data survives crashes. | Power outage after commit — data still there. |
	-
	- ## Isolation Levels
	  collapsed:: true
		- | Level | Dirty Read | Non-Repeatable | Phantom Read | Performance |
		  |-------|-----------|---------------|------------|------------|
		  | READ UNCOMMITTED | ✅ Possible | ✅ | ✅ | Fastest |
		  | READ COMMITTED | ❌ No | ✅ Possible | ✅ | Fast |
		  | REPEATABLE READ | ❌ | ❌ No | ✅ Possible | Medium |
		  | SERIALIZABLE | ❌ | ❌ | ❌ No | Slowest |
		- > [!tip] Default levels
		  > PostgreSQL & Oracle default: **READ COMMITTED**.
		  > MySQL InnoDB default: **REPEATABLE READ**.
		  > Use SERIALIZABLE only for financial/critical consistency.
- # Connection Pooling
  collapsed:: true
	- ## Why Pooling?
	  collapsed:: true
		- ```
		  Opening a DB connection = ~50–100ms overhead
		  
		  Without pool:
		    Request → Open connection → Query → Close → ~100ms wasted
		  
		  With pool:
		    App starts → Pre-open 10–100 connections
		    Request → Borrow connection → Query → Return to pool
		    → Near 0ms overhead
		  
		  Popular poolers:
		    PgBouncer        — PostgreSQL connection pooler
		    HikariCP (Java)  — Fastest JVM pool
		    SQLAlchemy pool  — Python
		    pgpool-II        — Load balancing + pooling for PostgreSQL
		  ```
	-
	- ## Key Pool Settings
	  collapsed:: true
		- ```
		  min_connections:    5   (always-open minimum)
		  max_connections:  100   (upper limit — don't exceed DB's max_connections)
		  connection_timeout: 30s  (how long to wait for available connection)
		  idle_timeout:      600s  (close idle connections after this)
		  max_lifetime:     1800s  (recycle connections to prevent stale state)
		  ```
- # Read/Write Splitting
  collapsed:: true
	- ## Pattern
	  collapsed:: true
		- ```python
		  # Application-level routing example
		  def get_db_connection(query_type: str):
		      if query_type == "write":
		          return connect(PRIMARY_DB_HOST)
		      else:
		          return connect(REPLICA_DB_HOST)  # round-robin if multiple replicas
		  
		  # ORM-level (SQLAlchemy)
		  engine = create_engine(...)
		  read_engine = create_engine(REPLICA_URL)
		  
		  with read_engine.connect() as conn:
		      result = conn.execute(select(User))  # goes to replica
		  ```
	-
	- ## Trade-offs
	  collapsed:: true
		- ```
		  Replication lag risk:
		    Write → primary → replicate → replica (takes ms to seconds)
		    If user reads immediately after writing → may see stale data
		  
		  Mitigation:
		    Read-your-own-writes: route reads to primary for 1s after write
		    Sticky sessions: same user always reads from same replica
		    Sync replication: higher latency but no lag
		  ```
- # Useful Links & Resources
	- [[System Design]] — Hub page
	- [[System Design - Caching]] — Redis patterns, eviction policies
	- [Designing Data-Intensive Applications](https://dataintensive.net) — Kleppmann — Best book on databases at scale
	- [Use The Index, Luke](https://use-the-index-luke.com) — Free indexing guide
	- [PostgreSQL Docs](https://www.postgresql.org/docs/) — Best RDBMS documentation
	- [Cassandra Architecture](https://cassandra.apache.org/doc/latest/cassandra/architecture/) — NoSQL at scale