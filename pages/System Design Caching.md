---
seoTitle: Caching Explained – Redis, LRU, Cache Patterns & Stampede Prevention | System Design
description: "Learn caching from scratch with plain English explanations and real-world analogies: cache-aside pattern, write-through, LRU eviction, Redis vs Memcached, cache stampede, and CDN caching. Perfect for system design interviews."
keywords: "caching tutorial, Redis explained, LRU eviction explained, cache stampede, write-through cache, cache-aside pattern, TTL explained, system design caching, distributed cache, VR-Rathod, Code-Note"
displayTitle: System Design - Caching
title: System Design Caching
treeTitle: System Design - Caching
---

> [!info] About This Page
> **Topic:** Caching — the single most effective way to make a slow system fast.
> Parent: [[System Design]]. Prev: [[System Design Scalability & CAP]]. Next: [[System Design Databases]].

- # What is Caching and Why Does It Matter?
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- > [!tip] Real-World Analogy
		  > You're a chef. Every time someone orders "Pasta Carbonara", you could:
		  > **Option A:** Run to the market, buy ingredients, cook from scratch (5 minutes)
		  > **Option B:** Keep a batch pre-cooked in the kitchen (30 seconds)
		  > Caching = Option B. You pre-store the result so the next request is instant.
		-
		- In software: **caching stores the result of an expensive operation in fast memory**,
		  so the next identical request gets the answer immediately without re-computing.
		-
		- | Without Cache | With Cache |
		  |-------------|-----------|
		  | Request → Database query (100ms) → Response | Request → Redis lookup (1ms) → Response |
		  | Every request hits the DB | Only cache misses hit the DB |
		  | DB gets overwhelmed at scale | DB serves 10% of the traffic |
		-
		- > [!important] The Impact
		  > A cache hit is ~**100× faster** than a database query.
		  > Twitter's timeline: 350,000 reads/sec. Without cache, their DB would need to handle all of that. With Redis, the DB sees only a fraction.
	-
	- ## Cache Hit vs Cache Miss
	  collapsed:: true
		- **Cache Hit** — The data you need IS in the cache. Fast response. ✅
		  **Cache Miss** — The data is NOT in cache. Must query the database. Slow first time. ❌
		-
		- ```
		  Cache Hit Rate = hits / (hits + misses) × 100%
		  
		  A 90% hit rate = only 10% of requests hit the database
		  A 95% hit rate = 5× less DB load than 90%
		  
		  Target: 80–95% hit rate for a well-tuned cache
		  A low hit rate means your cache keys are wrong or TTL is too short
		  ```
- # Cache Placement — Where Does the Cache Live?
  collapsed:: true
	- ## Layers of Caching
	  collapsed:: true
		- Caching isn't just one thing — there are multiple layers, each serving a different purpose:
		-
		- | Layer | Location | What's Cached | Speed | Example |
		  |-------|---------|--------------|-------|---------|
		  | **Browser cache** | User's browser | HTML, CSS, JS, images | Instant (no network) | `Cache-Control: max-age=86400` |
		  | **CDN (Edge cache)** | Servers near the user | Static files, images, video | ~10–50ms (vs 200ms from origin) | Cloudflare, CloudFront |
		  | **App-level cache** | Your app server's memory | Computed results | ~0.1ms | Python dict, Node.js Map |
		  | **Distributed cache** | Dedicated cache server | DB query results, sessions | ~1–5ms | Redis, Memcached |
		  | **Database cache** | Inside the database | Query results, indexes | Varies | PostgreSQL shared_buffers |
		-
		- > [!tip] Think in Layers
		  > The closer the cache is to the user, the faster. Serve from browser cache first,
		  > then CDN, then Redis, then DB. Each layer only sees traffic the previous one couldn't handle.
- # How to Write Data to Cache — Write Strategies
  collapsed:: true
	- ## Cache-Aside (Lazy Loading) — Most Common
	  collapsed:: true
		- > [!tip] Analogy
		  > You only note down a phone number in your phonebook AFTER you've looked it up once.
		  > Next time you need it, you check your phonebook first.
		-
		- **How it works:**
		  1. App checks cache → **hit?** Return data immediately ✅
		  2. App checks cache → **miss?** Query the database
		  3. Store database result in cache (with a TTL expiry)
		  4. Return data to user
		  5. **On data update:** Delete (invalidate) the cache key
		-
		- ```python
		  def get_user(user_id):
		      # 1. Check cache first
		      data = redis.get(f"user:{user_id}")
		      if data:
		          return json.loads(data)          # Cache HIT ✅
		  
		      # 2. Cache miss — go to database
		      user = db.query("SELECT * FROM users WHERE id=?", user_id)
		  
		      # 3. Store in cache for 1 hour
		      redis.setex(f"user:{user_id}", 3600, json.dumps(user))
		      return user
		  
		  def update_user(user_id, new_data):
		      db.query("UPDATE users SET ... WHERE id=?", user_id)
		      redis.delete(f"user:{user_id}")     # Invalidate stale cache
		  ```
		- **Pros:** Simple, only caches what's actually needed. Cold start on first use.
		- **Cons:** First request after cache miss is slow. Stale data risk if invalidation is missed.
	-
	- ## Write-Through — Always Fresh
	  collapsed:: true
		- > [!tip] Analogy
		  > Every time you update your notes, you update BOTH your notebook AND the whiteboard.
		  > The whiteboard is always up to date.
		-
		- **How it works:** Every write goes to **cache AND database simultaneously**.
		  Cache is always in sync with the database.
		-
		- ```
		  Write request arrives:
		    1. Write to Cache   ✅
		    2. Write to Database ✅  (both in same operation)
		    3. Next read → cache hit ✅
		  
		  No stale data possible.
		  Cost: Every write is as slow as a DB write (no speed benefit for writes).
		  ```
		- **Best for:** Data that is read frequently right after being written (e.g., user profile updates).
	-
	- ## Write-Back (Write-Behind) — Fast Writes
	  collapsed:: true
		- > [!tip] Analogy
		  > You quickly jot notes on a sticky note (fast), and later transfer them to your notebook (async).
		-
		- **How it works:** Write to cache immediately. **Sync to database asynchronously** (later, in background).
		-
		- ```
		  Write request arrives:
		    1. Write to Cache ✅ (responds immediately — very fast)
		    2. Background worker → writes to database later
		  
		  Risk: If cache crashes before background sync → DATA LOST! ⚠️
		  ```
		- **Best for:** High write throughput where occasional data loss is acceptable (analytics counters, likes).
		  **Never for:** Financial transactions, orders, anything that cannot afford data loss.
	-
	- ## Which Strategy to Use?
	  collapsed:: true
		- | Situation | Strategy |
		  |-----------|---------|
		  | General purpose (most cases) | **Cache-Aside** |
		  | Must always serve fresh data | **Write-Through** |
		  | Very high write throughput, loss tolerable | **Write-Back** |
		  | Write-once, rarely-read data (logs) | **Write-Around** (skip cache on write) |
- # Cache Eviction — What Happens When Cache is Full?
  collapsed:: true
	- ## The Problem
	  collapsed:: true
		- Memory is expensive and limited. Your cache can't store everything forever.
		  When cache fills up, it must **evict** (delete) some entries to make room.
		  The question is: **which entries to remove?**
	-
	- ## LRU — Least Recently Used (The Default)
	  collapsed:: true
		- > [!tip] Analogy
		  > Your desk has space for 5 books. When a 6th arrives, you put away the book you haven't touched in the longest time.
		-
		- **Rule:** Remove the item that was **least recently accessed**.
		  The assumption: if you haven't needed something in a while, you probably won't need it soon.
		-
		- ```
		  Cache capacity: 3 items
		  
		  Step 1: Access A → Cache: [A]
		  Step 2: Access B → Cache: [A, B]
		  Step 3: Access C → Cache: [A, B, C]  ← full
		  Step 4: Access D → Must evict! A was least recently used → [B, C, D]
		  Step 5: Access B → B is now most recent → [C, D, B]
		  Step 6: Access E → Must evict! C is LRU → [D, B, E]
		  ```
		- **Good for:** General-purpose caching. Most common choice (Redis default).
	-
	- ## LFU — Least Frequently Used
	  collapsed:: true
		- > [!tip] Analogy
		  > Clear the book you've opened fewest times — not the one you haven't touched recently.
		-
		- **Rule:** Remove the item **accessed the fewest number of times** overall.
		- **Good for:** When some data is always popular (hot items) and should stay cached.
		- **Downside:** A newly added hot item might get evicted before it accumulates access counts.
	-
	- ## TTL — Time To Live (The Simplest)
	  collapsed:: true
		- **Rule:** Every cache entry has an expiry time. After that time, it's automatically deleted.
		- ```
		  redis.setex("user:123", 3600, data)  # Expires in 1 hour
		  
		  No need to manually invalidate — it self-destructs.
		  Risk: May serve stale data for up to TTL duration before expiry.
		  ```
		- **Good for:** Data that changes infrequently (product catalog, config, exchange rates).
		- > [!tip] Set TTL on EVERYTHING in a cache.
		  > Cached data without TTL grows forever until the cache fills up and starts evicting randomly.
- # Cache Invalidation — The Hard Problem
  collapsed:: true
	- ## Why It's Hard
	  collapsed:: true
		- > [!warning] Famous Quote
		  > *"There are only two hard things in Computer Science: cache invalidation and naming things."*
		  > — Phil Karlton
		-
		- The problem: your **database is the truth**, but your **cache has a copy**.
		  When the database changes, the cache copy is now **stale (wrong)**.
		  How do you keep them in sync?
	-
	- ## Common Approaches
	  collapsed:: true
		- **TTL-Based (Simplest):** Set a short expiry. Accept that data may be stale for up to TTL duration.
		  Works for: Product prices, weather, exchange rates. Not for: Bank balances.
		-
		- **Delete on Write (Most Common):** When data changes in DB → immediately delete the cache key.
		  Next read will be a cache miss → fresh data loaded from DB → re-cached.
		  Simple and safe. One request after each update will be slow (cold miss).
		-
		- **Event-Driven:** DB change triggers an event → cache consumer deletes the key.
		  More complex but works well at scale with Kafka/CDC.
	-
	- ## Cache Key Design
	  collapsed:: true
		- Good key design makes invalidation easy:
		- ```
		  Format:  {service}:{entity}:{id}:{variant}
		  
		  Examples:
		    user:profile:12345
		    product:detail:abc-789:en-US
		    feed:timeline:user:67890:page:1
		  
		  Why this matters:
		    You can delete ALL product cache with:  SCAN MATCH "product:*"
		    You can delete ONE user's cache with:   DEL "user:profile:12345"
		  ```
- # Cache Stampede — When Your Cache Saves You... Until It Doesn't
  collapsed:: true
	- ## The Danger Scenario
	  collapsed:: true
		- ```
		  Scenario:
		    Popular cache key "top_products" has TTL = 60 seconds.
		    At t=60s, it expires.
		    At that exact moment, 10,000 users request the page.
		    All 10,000 get a cache miss simultaneously.
		    All 10,000 query the database at the same time.
		    Database crashes under the load. 💀
		    This is called a "Cache Stampede" or "Thundering Herd".
		  ```
	-
	- ## How to Prevent It
	  collapsed:: true
		- **1. Add TTL Jitter (Easiest fix):**
		  Instead of `TTL = 3600`, use `TTL = 3600 + random(0, 300)`.
		  Keys expire at slightly different times → stampede spreads out.
		-
		- **2. Mutex / Distributed Lock:**
		  First cache-miss request grabs a lock → fetches from DB → populates cache.
		  All other requests WAIT for the lock → then read from cache (no DB hit).
		  ```python
		  lock_key = f"lock:top_products"
		  if redis.set(lock_key, 1, nx=True, ex=5):  # nx=True: only set if not exists
		      data = db.query("SELECT * FROM products ORDER BY sales DESC LIMIT 10")
		      redis.setex("top_products", 3600, json.dumps(data))
		      redis.delete(lock_key)
		  else:
		      time.sleep(0.1)  # brief wait, then retry cache
		      data = redis.get("top_products")
		  ```
		-
		- **3. Stale-While-Revalidate:**
		  Serve the stale cache immediately (fast response to user) while refreshing in background.
		  `Cache-Control: stale-while-revalidate=60` — browser / CDN handle this automatically for HTTP.
- # Redis — The Industry Standard Cache
  collapsed:: true
	- ## Why Redis, Not Just a Dictionary in Memory?
	  collapsed:: true
		- An in-memory dictionary in your app is fast — but it's **local to ONE server**.
		  If you have 10 app servers, each has its own cache → inconsistent, wasteful.
		  **Redis is a shared cache** — all your app servers connect to it.
		- Also, Redis data **survives app restarts** (persistence options), unlike in-process memory.
	-
	- ## Redis vs Memcached — When to Use Which
	  collapsed:: true
		- | Question | If Yes → Use |
		  |---------|-------------|
		  | Do you need data types beyond strings? (lists, sorted sets) | **Redis** |
		  | Do you need persistence (survive reboots)? | **Redis** |
		  | Do you need pub/sub messaging? | **Redis** |
		  | Do you need rate limiting, leaderboards, job queues? | **Redis** |
		  | Do you ONLY need simple key→value with max throughput? | **Memcached** |
		- > [!tip] In 2024+, just use Redis. Memcached's only advantage (slightly lower memory overhead) is rarely the deciding factor.
	-
	- ## Useful Redis Commands
	  collapsed:: true
		- ```bash
		  # Store with TTL
		  SET user:123 '{"name":"Alice"}' EX 3600
		  
		  # Get
		  GET user:123
		  
		  # Delete (invalidate)
		  DEL user:123
		  
		  # Increment counter (atomic — for rate limiting, view counts)
		  INCR page:views:home
		  
		  # Sorted set (leaderboard)
		  ZADD leaderboard 9500 "player:alice"
		  ZADD leaderboard 8200 "player:bob"
		  ZREVRANGE leaderboard 0 9 WITHSCORES  # Top 10
		  
		  # Check TTL remaining
		  TTL user:123  # returns seconds remaining
		  
		  # Set only if not exists (mutex lock)
		  SET lock:job:456 1 NX EX 30
		  ```
- # CDN — Caching at the Edge (Global Scale)
  collapsed:: true
	- ## What is a CDN?
	  collapsed:: true
		- > [!tip] Analogy
		  > Netflix stores popular movies in warehouses near every city.
		  > You don't stream from Netflix's HQ in California — you stream from a warehouse in your city.
		  > A CDN is that warehouse network for your website's files.
		-
		- **CDN = globally distributed servers that cache your static content close to users.**
		-
		- ```
		  Without CDN:
		    User in India → Server in US Virginia → 200ms latency → poor experience
		  
		  With CDN:
		    User in India → CDN edge in Mumbai → 10ms latency → fast experience
		    Edge served cached copy of your CSS/JS/images/video
		  ```
	-
	- ## HTTP Cache Headers (Control CDN + Browser Caching)
	  collapsed:: true
		- ```
		  Cache-Control: public, max-age=86400
		    → Cache in both browser AND CDN for 1 day (86400 seconds)
		    → Use for: static files (images, JS, CSS) that don't change
		  
		  Cache-Control: private, max-age=3600
		    → Cache in browser only (CDN skips it) for 1 hour
		    → Use for: user-specific pages, dashboards
		  
		  Cache-Control: no-cache
		    → Always check with server before using cached copy
		    → Server may respond 304 Not Modified (fast) if unchanged
		  
		  Cache-Control: no-store
		    → Never cache anywhere (sensitive data: banking, medical records)
		  
		  Cache-Control: stale-while-revalidate=60
		    → Serve stale immediately, refresh in background
		    → Use for: pages that change but where slight staleness is OK
		  ```
		- > [!tip] For versioned static files (main.abc123.js), use `max-age=31536000` (1 year).
		  > Changing the file changes the filename → busts the cache automatically. No TTL issues.
- # Useful Links & Resources
	- [[System Design]] — Main hub page
	- [[System Design Scalability & CAP]] — Previous: scaling fundamentals
	- [[System Design Databases]] — Next: where data lives long-term
	- [Redis documentation](https://redis.io/docs/) — Official, excellent docs
	- [Redis University](https://university.redis.com) — Free Redis courses
	- [Cloudflare Cache docs](https://developers.cloudflare.com/cache/) — CDN caching in practice
	- [Designing Data-Intensive Applications](https://dataintensive.net) — Best book for deeper understanding