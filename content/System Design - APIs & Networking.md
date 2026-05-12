---
seoTitle: APIs & Networking in System Design – REST, gRPC, WebSockets, CDN, Rate Limiting
description: "Complete API and networking reference for system design: REST vs gRPC vs GraphQL, WebSockets vs SSE, DNS resolution, CDN, load balancing, rate limiting algorithms, and HTTP/2 vs HTTP/3."
keywords: "REST API, gRPC, GraphQL, WebSockets, SSE, CDN, DNS, rate limiting, token bucket, load balancing, HTTP2, HTTP3, API design, system design, VR-Rathod, Code-Note"
displayTitle: System Design - APIs & Networking
---

> [!info] About This Page
> Covers **API design and networking** — protocols, real-time communication, DNS, CDN, and rate limiting.
> Parent: [[System Design]]. See also: [[System Design - Microservices]], [[System Design - Scalability & CAP]].

- # API Design Protocols
  collapsed:: true
	- ## REST vs GraphQL vs gRPC
	  collapsed:: true
		- | Aspect | REST | GraphQL | gRPC |
		  |--------|------|---------|------|
		  | Protocol | HTTP/1.1–2 | HTTP | HTTP/2 |
		  | Format | JSON / XML | JSON | Protocol Buffers (binary) |
		  | Type safety | ❌ No schema | ✅ Schema required | ✅ .proto schema |
		  | Over/under-fetch | ❌ Common issue | ✅ Fetch exactly what you need | ✅ Defined contracts |
		  | Caching | ✅ HTTP cache works | ❌ Complex (POST-based) | ❌ No native |
		  | Streaming | ❌ No | ✅ Subscriptions | ✅ Bidirectional streaming |
		  | Browser support | ✅ Native | ✅ Native | ❌ Limited (need grpc-web) |
		  | Code generation | Manual | Codegen tools | ✅ First-class (protoc) |
		  | Best for | Public APIs, CRUD | Mobile apps, BFF pattern | Internal microservices |
	-
	- ## REST API Design Best Practices
	  collapsed:: true
		- ```
		  Resources are nouns, not verbs:
		    ✅ GET  /users/123
		    ❌ GET  /getUser?id=123

		  Use correct HTTP methods:
		    GET     → Read (idempotent, cacheable)
		    POST    → Create (not idempotent)
		    PUT     → Replace entire resource (idempotent)
		    PATCH   → Partial update (idempotent)
		    DELETE  → Delete (idempotent)

		  Use standard status codes:
		    200 OK           → GET, PUT success
		    201 Created      → POST success (include Location header)
		    204 No Content   → DELETE success
		    400 Bad Request  → Invalid input
		    401 Unauthorized → Not authenticated
		    403 Forbidden    → Authenticated but no permission
		    404 Not Found    → Resource doesn't exist
		    409 Conflict     → Duplicate / state conflict
		    422 Unprocessable→ Validation failed
		    429 Too Many Req → Rate limited
		    500 Internal Err → Server bug

		  Versioning:
		    URL path:    /api/v1/users  (simplest, most visible)
		    Header:      Accept: application/vnd.api.v1+json
		    Query param: /users?version=1
		  ```
	-
	- ## gRPC Deep Dive
	  collapsed:: true
		- ```protobuf
		  // user.proto — define service contract
		  syntax = "proto3";

		  service UserService {
		    rpc GetUser    (GetUserRequest)    returns (User);
		    rpc ListUsers  (ListUsersRequest)  returns (stream User);  // server streaming
		    rpc CreateUser (CreateUserRequest) returns (User);
		  }

		  message GetUserRequest { string user_id = 1; }

		  message User {
		    string id    = 1;
		    string name  = 2;
		    string email = 3;
		    int64  created_at = 4;
		  }
		  ```
		- ```
		  gRPC streaming types:
		    Unary:              Client sends 1 request → Server sends 1 response
		    Server streaming:   Client sends 1 → Server sends stream
		    Client streaming:   Client sends stream → Server sends 1
		    Bidirectional:      Both stream simultaneously (chat, gaming)
		  ```

- # Real-Time Communication
  collapsed:: true
	- ## Comparison
	  collapsed:: true
		- | Method | Direction | Connection | Overhead | When to Use |
		  |--------|----------|-----------|---------|------------|
		  | Short Polling | C→S (repeated) | New each time | High | Simple, infrequent updates |
		  | Long Polling | C→S (hold) | Held open | Medium | Near real-time, simple setup |
		  | **WebSockets** | Bidirectional | Persistent | Low (after handshake) | Chat, gaming, trading, collaboration |
		  | **SSE** | S→C only | Persistent | Low | Dashboards, feeds, notifications |
	-
	- ## WebSocket Flow
	  collapsed:: true
		- ```
		  1. Client sends HTTP Upgrade request:
		     GET /chat HTTP/1.1
		     Upgrade: websocket
		     Connection: Upgrade
		     Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==

		  2. Server responds:
		     HTTP/1.1 101 Switching Protocols
		     Upgrade: websocket
		     Connection: Upgrade
		     Sec-WebSocket-Accept: <hash>

		  3. Persistent TCP connection — both sides can send at any time

		  Scaling WebSockets:
		    → Sticky sessions (same client → same server)
		    → Or: all servers connect to shared pub/sub (Redis Pub/Sub)
		    → Client disconnects stored in shared state (Redis)
		  ```
	-
	- ## SSE (Server-Sent Events)
	  collapsed:: true
		- ```javascript
		  // Server (Node.js)
		  app.get('/events', (req, res) => {
		    res.setHeader('Content-Type', 'text/event-stream');
		    res.setHeader('Cache-Control', 'no-cache');

		    const send = () => res.write(`data: ${JSON.stringify({ time: Date.now() })}\n\n`);
		    const interval = setInterval(send, 1000);
		    req.on('close', () => clearInterval(interval));
		  });

		  // Client
		  const es = new EventSource('/events');
		  es.onmessage = (e) => console.log(JSON.parse(e.data));
		  // Auto-reconnects on disconnect — built into browser!
		  ```

- # DNS & CDN
  collapsed:: true
	- ## DNS Resolution Flow
	  collapsed:: true
		- ```mermaid
		  flowchart LR
		      Browser --> BCache[Browser Cache]
		      BCache -->|miss| OS[OS Cache]
		      OS -->|miss| Resolver[Recursive Resolver\nISP / 8.8.8.8]
		      Resolver -->|miss| Root[Root Nameserver]
		      Root --> TLD[TLD Nameserver .com]
		      TLD --> Auth[Authoritative NS]
		      Auth --> IP[IP Address ✅]
		  ```
		- | DNS Record | Maps | Example |
		  |-----------|------|--------|
		  | A | Domain → IPv4 | example.com → 93.184.216.34 |
		  | AAAA | Domain → IPv6 | example.com → 2606:2800::1 |
		  | CNAME | Alias → Domain | www → example.com |
		  | MX | Mail server | priority + mail host |
		  | TXT | Arbitrary text | SPF, DKIM, domain verification |
		  | NS | Nameserver for domain | ns1.example.com |
	-
	- ## CDN Architecture
	  collapsed:: true
		- ```
		  Without CDN:
		    User in Mumbai → Server in Virginia (200ms latency)

		  With CDN:
		    User in Mumbai → CDN edge in Mumbai (10ms latency)
		    Cache miss → CDN fetches from origin, caches at edge

		  CDN caches:
		    ✅ Static: JS, CSS, images, videos, fonts
		    ✅ Dynamic (some CDNs): edge computing, personalised content

		  Providers: Cloudflare, AWS CloudFront, Akamai, Fastly, Azure CDN

		  Cache invalidation:
		    Versioned filenames: main.abc123.js (change content = new URL)
		    CDN purge API: invalidate specific paths on deploy
		    Short TTL + stale-while-revalidate for dynamic content
		  ```

- # Rate Limiting
  collapsed:: true
	- ## Algorithms
	  collapsed:: true
		- | Algorithm | Burst Allowed | Accuracy | Memory | Best For |
		  |----------|--------------|---------|--------|---------|
		  | **Token Bucket** | ✅ Yes | High | Low | APIs that allow short bursts |
		  | **Leaky Bucket** | ❌ Smoothed | High | Low | Smooth output rate |
		  | **Fixed Window** | ✅ at edges | Low (boundary bug) | Very Low | Simple, approximate |
		  | **Sliding Window Log** | Partial | Very High | High | Strict accuracy |
		  | **Sliding Window Counter** | Partial | High | Low | Balanced accuracy/memory |
	-
	- ## Token Bucket Explained
	  collapsed:: true
		- ```
		  Bucket capacity: 10 tokens
		  Refill rate:      2 tokens/second
		  Request cost:     1 token

		  t=0:  10 tokens, 5 requests → 5 tokens remain
		  t=1:  7 tokens (refilled 2), 3 requests → 4 tokens
		  t=2:  6 tokens, 10 requests → 6 allowed, 4 REJECTED (429)

		  Allows burst up to bucket size, then throttles to refill rate.
		  ```
	-
	- ## Redis Rate Limiter (Sliding Window)
	  collapsed:: true
		- ```lua
		  -- Lua script for atomic sliding window rate limit
		  local key       = KEYS[1]         -- e.g. "ratelimit:user:123"
		  local limit     = tonumber(ARGV[1]) -- e.g. 100
		  local window_ms = tonumber(ARGV[2]) -- e.g. 60000 (1 minute)
		  local now       = tonumber(ARGV[3]) -- current timestamp ms

		  -- Remove entries outside the window
		  redis.call('ZREMRANGEBYSCORE', key, 0, now - window_ms)

		  -- Count entries in window
		  local count = redis.call('ZCARD', key)

		  if count < limit then
		    -- Add this request
		    redis.call('ZADD', key, now, now)
		    redis.call('PEXPIRE', key, window_ms)
		    return 1   -- allowed
		  end

		  return 0      -- rejected
		  ```
	-
	- ## Rate Limit Response Headers
	  collapsed:: true
		- ```http
		  HTTP/1.1 429 Too Many Requests
		  X-RateLimit-Limit: 100
		  X-RateLimit-Remaining: 0
		  X-RateLimit-Reset: 1715500000
		  Retry-After: 60
		  Content-Type: application/json

		  {"error": "rate_limit_exceeded", "retry_after_seconds": 60}
		  ```

- # HTTP Versions
  collapsed:: true
	- | Feature | HTTP/1.1 | HTTP/2 | HTTP/3 |
	  |---------|---------|-------|-------|
	  | Transport | TCP | TCP | QUIC (UDP) |
	  | Multiplexing | ❌ One request at a time | ✅ Multiple streams | ✅ Multiple streams |
	  | Header compression | ❌ | ✅ HPACK | ✅ QPACK |
	  | Head-of-line blocking | ✅ (TCP + app level) | ✅ (TCP level) | ❌ Eliminated |
	  | Server push | ❌ | ✅ | ✅ |
	  | Connection setup | 1-RTT | 1-RTT | 0-RTT possible |
	  | Best for | Legacy systems | Most modern apps | Mobile, lossy networks |

- # Security in APIs
  collapsed:: true
	- ## Auth Flow Comparison
	  collapsed:: true
		- | Method | How | Stateful? | Best For |
		  |--------|-----|----------|---------|
		  | Session + Cookie | Server stores session | ✅ Yes | Traditional web apps |
		  | JWT | Signed token, client stores | ❌ No | SPAs, mobile, microservices |
		  | OAuth 2.0 | Delegate to identity provider | ❌ | "Login with Google" |
		  | API Key | Static secret in header | ❌ | Server-to-server, developer APIs |
		  | mTLS | Mutual certificates | ❌ | Microservice-to-microservice |
	-
	- ## JWT Structure
	  collapsed:: true
		- ```
		  JWT = header.payload.signature

		  Header:    { "alg": "HS256", "typ": "JWT" }
		  Payload:   { "sub": "user123", "role": "admin", "exp": 1715500000 }
		  Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)

		  Flow:
		    1. User logs in → server creates JWT → returns to client
		    2. Client stores JWT (httpOnly cookie recommended)
		    3. Every request: Authorization: Bearer <token>
		    4. Server verifies signature → extracts claims → authorizes

		  Best practices:
		    ✅ Short expiry (15 min access token)
		    ✅ Refresh tokens (7 days, rotated)
		    ✅ Store in httpOnly cookie (not localStorage)
		    ✅ Use RS256 (asymmetric) for distributed verification
		  ```

- # Useful Links & Resources
	- [[System Design]] — Hub page
	- [[System Design - Microservices]] — Service patterns, API gateway
	- [HTTP/2 Explained](https://http2-explained.haxx.se) — Deep dive on HTTP/2
	- [HTTP/3 Explained](https://http3-explained.haxx.se) — QUIC and HTTP/3
	- [JWT.io](https://jwt.io) — JWT debugger and library list
	- [Cloudflare Rate Limiting](https://developers.cloudflare.com/waf/rate-limiting-rules/) — Managed rate limiting
	- [REST API Design Guide](https://restfulapi.net) — REST best practices
