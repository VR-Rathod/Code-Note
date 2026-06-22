---
seoTitle: System Design Case Studies – URL Shortener, Chat, YouTube, Twitter Feed, Uber
description: "Real-world system design case studies for interviews: URL shortener, chat system, YouTube, Twitter news feed, Uber ride-sharing, and rate limiter. Full architecture walkthroughs with estimations and component design."
keywords: "system design case studies, URL shortener design, chat system design, YouTube design, Twitter feed design, Uber system design, rate limiter design, system design interview, FAANG, VR-Rathod, Code-Note"
displayTitle: System Design - Case Studies
title: System Design Case Studies
treeTitle: System Design - Case Studies
---

> [!info] About This Page
> Real-world **system design case studies** for interviews and learning. Each study follows: Requirements → Estimation → API → Architecture → Deep Dive.
> Parent: [[System Design]]. Prerequisite: [[System Design Scalability & CAP]], [[System Design Caching]], [[System Design Databases]].

> [!tip] Interview Framework
> **①** Clarify (5 min) → **②** Estimate (5 min) → **③** API (5 min) → **④** HLD (10 min) → **⑤** Deep dive (15 min) → **⑥** Trade-offs (5 min)

- # 🔗 URL Shortener (bit.ly)
  collapsed:: true
	- ## Requirements & Estimation
	  collapsed:: true
		- ```
		  Functional:
		    ✅ Given a long URL → return a unique short URL
		    ✅ Redirect short URL → original long URL
		    ✅ Optional: custom alias, expiry, analytics
		  
		  Non-Functional:
		    100M URLs created/day
		    10:1 read:write ratio → 1B redirects/day
		    Low latency reads (< 10ms)
		    High availability (99.99%)
		    URLs don't change once created
		  
		  Estimation:
		    Write QPS: 100M / 86,400 ≈ 1,160 writes/sec
		    Read  QPS: 1B   / 86,400 ≈ 11,600 reads/sec  (peak ~25K)
		    Storage (5 years): 100M × 365 × 5 × 500 bytes ≈ 91 TB
		  ```
	-
	- ## Short URL Generation
	  collapsed:: true
		- ```
		  Option 1: MD5/SHA256 hash → take first 7 chars
		    Pros: Deterministic (same URL = same code)
		    Cons: Hash collisions, need to check DB on every generate
		  
		  Option 2: Auto-increment ID → Base62 encode
		    Characters: [a-z A-Z 0-9] = 62 chars
		    7 chars = 62^7 ≈ 3.5 trillion unique codes
		    ID 1234567 → Base62 → "5keQ2"
		    Pros: Simple, no collision
		    Cons: Sequential IDs are predictable
		  
		  Option 3: Distributed Snowflake ID → Base62
		    64-bit: timestamp(41) + datacenter(5) + machine(5) + seq(12)
		    Unique across distributed servers
		    Pros: No DB round trip, no collision, non-sequential
		  ```
	-
	- ## Architecture
	  collapsed:: true
		- ```mermaid
		  flowchart TD
		      C[Client] --> LB[Load Balancer]
		      LB --> WS[Write Service\ncreate short URL]
		      LB --> RS[Read Service\nredirect]
		      WS --> DB[(PostgreSQL\nshort→long mapping)]
		      RS --> Cache[(Redis Cache\nshort→long)]
		      Cache -->|miss| DB_R[(Read Replica)]
		      WS --> IDGen[ID Generator\nSnowflake]
		  ```
		- ```
		  Write flow (create short URL):
		    1. Validate long URL
		    2. Generate unique short code (Snowflake → Base62)
		    3. Store: { short_code, long_url, user_id, created_at, expires_at }
		    4. Return short URL
		  
		  Read flow (redirect):
		    1. Parse short code from URL
		    2. Check Redis cache → cache hit → 301/302 redirect
		    3. Cache miss → query DB replica → cache result (TTL=24h) → redirect
		  
		  301 Permanent: Browser caches → reduces server load
		  302 Temporary: Every hit goes to server → better analytics tracking
		  ```
-
- # 💬 Chat System (WhatsApp / Slack)
  collapsed:: true
	- ## Requirements & Estimation
	  collapsed:: true
		- ```
		  Functional:
		    ✅ 1-on-1 messaging
		    ✅ Group chat (up to 500 members)
		    ✅ Online/offline status + last seen
		    ✅ Message history
		    ✅ Read receipts (delivered / read)
		    ✅ Media sharing (images, video)
		  
		  Non-Functional:
		    500M DAU. Each user sends 40 messages/day.
		    Messages must be delivered in < 100ms
		    No message loss. At-least-once delivery.
		  
		  Estimation:
		    Write QPS: 500M × 40 / 86,400 ≈ 231,000 QPS
		    Storage:   231K msgs/sec × 100 bytes = 23 MB/sec = ~2 TB/day
		    History:   5 years × 2 TB/day = ~3.6 PB
		  ```
	-
	- ## Architecture
	  collapsed:: true
		- ```mermaid
		  flowchart TD
		      UserA[User A] <-->|WebSocket| CS1[Chat Server 1]
		      UserB[User B] <-->|WebSocket| CS2[Chat Server 2]
		      CS1 --> MQ[Message Queue\nKafka]
		      MQ --> CS2
		      CS1 --> MsgDB[(Cassandra\nMessage History)]
		      CS2 --> MsgDB
		      CS1 --> Presence[(Redis\nOnline Status)]
		      CS2 --> Presence
		      CS1 --> Push[Push Notification\nAPNS / FCM]
		  ```
		- ```
		  Message delivery flow:
		    1. User A sends message (WebSocket to Chat Server 1)
		    2. Server generates message_id (Snowflake)
		    3. Store message in Cassandra (partition by conversation_id)
		    4. Publish to Kafka topic (conversation_id)
		    5. Chat Server 2 (User B's server) consumes from Kafka
		    6. If B is online → deliver via WebSocket
		                 If B is offline → send Push Notification (APNs/FCM)
		  
		  Why Cassandra for messages?
		    → Write-heavy (231K writes/sec)
		    → Time-series access pattern (recent messages most read)
		    → Partitions by conversation_id + sorts by timestamp
		    → Linear horizontal scaling
		  ```
	-
	- ## Online Presence
	  collapsed:: true
		- ```
		  Redis key: presence:{user_id}
		  Value:     { online: true, last_seen: timestamp }
		  TTL:       30 seconds
		  
		  Client sends heartbeat every 10s → refreshes TTL
		  If TTL expires → user marked offline
		  
		  Fan-out presence updates:
		    User goes online → notify all contacts
		    Contact list can be 1000s of users → fan-out via Kafka
		    Subscribe to friends' presence events
		  ```
-
- # 📺 Video Streaming (YouTube)
  collapsed:: true
	- ## Requirements & Estimation
	  collapsed:: true
		- ```
		  Functional:
		    ✅ Upload video (up to 60 min)
		    ✅ Transcode to multiple resolutions (360p, 720p, 1080p, 4K)
		    ✅ Stream video globally with low latency
		    ✅ Search, recommendations, comments
		  
		  Scale:
		    5M videos uploaded/day
		    1B video views/day
		    Read:Write = 200:1 (very read-heavy)
		  
		  Storage:
		    5M × 5 min avg × 300 MB/min = ~7.5 PB/day (raw)
		    After transcoding to 4 resolutions: ~30 PB/day
		  ```
	-
	- ## Architecture
	  collapsed:: true
		- ```mermaid
		  flowchart LR
		      Upload[User\nUploads] --> API[Upload API]
		      API --> S3[Object Storage\nS3 Raw Video]
		      S3 -->|trigger| TQ[Transcoding Queue\nSQS / Kafka]
		      TQ --> TW[Transcoding Workers]
		      TW --> S3T[S3 Transcoded\n360p / 720p / 1080p]
		      S3T --> CDN[CDN\nCloudFront]
		      CDN --> Player[Video Player\nHLS / DASH]
		      API --> MetaDB[(PostgreSQL\nVideo Metadata)]
		  ```
		- ```
		  Upload flow:
		    1. Client uploads video to Upload Service
		    2. Store raw video in S3 (object storage)
		    3. Publish "video.uploaded" event to Kafka
		    4. Transcoding workers pick up → transcode to all resolutions
		    5. Store transcoded versions in S3 (different prefix)
		    6. Update video metadata DB: status → "ready", CDN URLs
		    7. Notify user (email/push)
		  
		  Streaming (HLS — HTTP Live Streaming):
		    → Video split into 10-second .ts segments
		    → .m3u8 manifest lists all segments
		    → Client downloads manifest → fetches segments progressively
		    → Adaptive bitrate: switch quality based on network speed
		  ```
-
- # 🐦 Twitter News Feed
  collapsed:: true
	- ## The Fan-Out Problem
	  collapsed:: true
		- ```
		  Fan-Out on Write (Push model):
		    When @celebrity tweets → write to all 50M followers' feeds
		    Pros: Read feed is O(1)
		    Cons: 50M writes per tweet! Huge write amplification
		    Bad for: Users with millions of followers
		  
		  Fan-Out on Read (Pull model):
		    When user opens feed → fetch tweets from all followed accounts
		    Pros: No write amplification
		    Cons: Complex, slow for reading (JOIN across many accounts)
		    Bad for: Users following thousands of accounts
		  
		  Hybrid (Twitter's actual approach):
		    Regular users  → Fan-out on write (pre-computed feed in Redis)
		    Celebrities (>1M followers) → Fan-out on read at request time
		    Mixed feed: merge pre-built feed + celebrity tweets on read
		  ```
	-
	- ## Architecture
	  collapsed:: true
		- ```
		  Tweet creation:
		    1. User posts tweet → stored in Tweet DB (Cassandra)
		    2. Published to "tweet.created" Kafka topic
		    3. Fan-out service reads Kafka
		       → For each follower → push tweet_id to their Redis sorted set
		       → Score = timestamp (chronological feed)
		    4. Celebrity tweets skipped from fan-out (too many followers)
		  
		  Feed read:
		    1. User requests feed
		    2. Read Redis sorted set (pre-built feed) → get top N tweet_ids
		    3. Fetch celebrity follows → get their recent tweet_ids directly
		    4. Merge + sort → fetch tweet content by IDs (Redis or Cassandra)
		    5. Return paginated feed
		  
		  Redis structure:
		    ZADD feed:{user_id} {timestamp} {tweet_id}
		    ZREVRANGE feed:{user_id} 0 50  → latest 50 tweet_ids
		  ```
-
- # 🚗 Ride-Sharing (Uber)
  collapsed:: true
	- ## Core Challenges
	  collapsed:: true
		- ```
		  1. Real-time location tracking (driver updates every 4 seconds)
		  2. Geo-spatial matching (find nearest available driver)
		  3. Surge pricing (demand > supply in an area)
		  4. Trip state machine (request → match → pickup → trip → complete)
		  5. Consistent assignment (no two passengers get same driver)
		  ```
	-
	- ## Location & Matching Architecture
	  collapsed:: true
		- ```
		  Driver location updates:
		    Driver app → WebSocket/gRPC → Location Service (every 4s)
		    Location Service → Redis Geo Index
		    Redis: GEOADD drivers {lng} {lat} {driver_id}
		  
		  Passenger requests ride:
		    1. Passenger sends pickup location
		    2. Matching Service: GEORADIUS drivers {lng} {lat} 5km
		       → Returns nearby drivers sorted by distance
		    3. Filter: available drivers only
		    4. Offer trip to best candidate (ETA + rating)
		    5. Driver accepts → atomic lock to prevent double-assignment
		                 (Redis SET driver:{id}:status "matched" NX EX 30)
		    6. If decline → offer to next candidate
		  
		  Geohash for geo-partitioning:
		    Split map into cells (geohash level 6 = ~1.2km × 0.6km)
		    All drivers in same geohash stored together
		    Nearby search = current cell + adjacent cells
		  ```
-
- # 🛡 Rate Limiter Design
  collapsed:: true
	- ## Requirements
	  collapsed:: true
		- ```
		  Functional:
		    ✅ Limit requests per client (IP or user ID)
		    ✅ Return 429 Too Many Requests when exceeded
		    ✅ Different limits per endpoint
		    ✅ Distributed (works across multiple app servers)
		  
		  Non-Functional:
		    Low latency (< 5ms overhead)
		    High availability (limiter failure should NOT block traffic)
		    Accurate enough (sliding window preferred)
		  ```
	-
	- ## Design
	  collapsed:: true
		- ```mermaid
		  flowchart LR
		      Client --> MW[Rate Limit\nMiddleware]
		      MW --> Redis[(Redis\nSliding Window Counters)]
		      Redis -->|allowed| App[App Server]
		      Redis -->|blocked| Err[429 Response]
		  ```
		- ```
		  Implementation:
		    Algorithm: Sliding Window Counter (balance of accuracy + memory)
		    Storage:   Redis (shared across all app servers)
		    Key:       ratelimit:{user_id}:{endpoint}:{window_start}
		    Atomic:    Lua script (INCR + EXPIRE in one atomic operation)
		  
		  Rules engine:
		    /api/search  → 100 requests/minute per user
		    /api/upload  → 10 requests/minute per user
		    /auth/login  → 5 requests/minute per IP (brute-force prevention)
		  
		  Failure mode:
		    If Redis is down → fail open (allow traffic) to maintain availability
		    Log warning + alert on-call
		  ```
-
- # 📚 Useful Links & Resources
	- [System Design Primer](https://github.com/donnemartin/system-design-primer) — Free case studies
	- [ByteByteGo](https://blog.bytebytego.com) — Visual system design guides
	- [Grokking System Design](https://www.designgurus.io) — Interview prep with case studies
	- [High Scalability](http://highscalability.com) — Real-world architecture blog