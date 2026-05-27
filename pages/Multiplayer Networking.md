---
seoTitle: Multiplayer Networking – Complete Game Dev Guide Beginner to Advanced
description: "Deep-dive multiplayer game networking reference covering architectures, protocols, transport layers, lag compensation, prediction, synchronization, relay servers, matchmaking, anti-cheat, and real C++ / GDScript examples."
keywords: "multiplayer networking, game networking, client server, peer to peer, lag compensation, client side prediction, server reconciliation, entity interpolation, dead reckoning, tick rate, UDP game networking, RUDP, ENet, GameNetworkingSockets, WebRTC, WebSocket, relay server, matchmaking, ELO, anti-cheat, NAT traversal, game sync, lockstep, rollback netcode, GGPO, authoritative server, deterministic simulation, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Multiplayer Networking – Game Dev Deep Dive
enableToc: true
---

> [!info] About This Page
> This page covers **multiplayer game networking** from first principles to production-grade techniques.
> Engine-agnostic but includes real C++ and GDScript code examples.
> See [[Game Development]] for engine overview and [[Game Systems]] for inventory/quest/save systems.

- # History
  collapsed:: true
	- **How**: Online multiplayer began with MUDs (1978) over dial-up modems. TCP dominated early games (Doom LAN 1993). Quake (1996) pioneered client-server UDP with lag compensation — still the foundation of modern FPS networking.
	- **Who**: John Carmack (Quake), Valve (Source Engine prediction model), and Glenn Fiedler (gafferongames.com) shaped the theory. Ribbit Network and commercial relay SDKs now make it accessible to indie developers.
	- **Why**: Network conditions are hostile — packets drop, arrive out of order, and arrive late. Good networking hides this from the player, making a 200ms-latency game feel like real-time.
- # Introduction
  collapsed:: true
	- ## The Core Problem
	  collapsed:: true
		- ```
		  The internet is NOT reliable:
		    ✗ Packets can be LOST          → you never know they were sent
		    ✗ Packets can be DELAYED       → 50–300+ms latency
		    ✗ Packets can arrive OUT OF ORDER → old state arrives after new state
		    ✗ Packets can DUPLICATE        → rare but real
		  
		  Goal: Simulate a shared, consistent game world
		  across machines with different clocks and unreliable links.
		  ```
		- > [!tip] Networking Philosophy
		  > 1. **Never trust the client** — the server is always authoritative.
		  > 2. **Hide latency** — use prediction, interpolation, and dead reckoning.
		  > 3. **Minimize bandwidth** — send only what changed, use compression.
		  > 4. **Tolerate loss** — UDP is lossy; your protocol handles recovery, not TCP.
	- ## Multiplayer Knowledge Map
	  collapsed:: true
		- ```mermaid
		  mindmap
		    root((Multiplayer\nNetworking))
		      Architecture
		        Client-Server
		        Peer-to-Peer
		        Lockstep
		        Relay
		      Transport
		        UDP
		        TCP
		        RUDP
		        WebRTC
		        WebSocket
		      Synchronization
		        Tick Rate
		        Clock Sync
		        State Sync
		        Input Sync
		      Lag Compensation
		        Client Prediction
		        Server Reconciliation
		        Entity Interpolation
		        Dead Reckoning
		        Lag Compensation Raycasts
		      Advanced
		        Rollback Netcode
		        Determinism
		        Interest Management
		        Delta Compression
		      Infrastructure
		        Matchmaking
		        Relay Servers
		        NAT Traversal
		        Anti-Cheat
		  ```
- # Network Architectures
  collapsed:: true
	- ## Client-Server (Authoritative)
	  collapsed:: true
		- ```mermaid
		  graph TD
		      C1["👤 Client 1\nSends inputs"] -->|UDP| S["🖥️ Authoritative Server\nOwns game state\nValidates all inputs\nBroadcasts world state"]
		      C2["👤 Client 2\nSends inputs"] -->|UDP| S
		      C3["👤 Client 3\nSends inputs"] -->|UDP| S
		      S -->|UDP state snapshot| C1
		      S -->|UDP state snapshot| C2
		      S -->|UDP state snapshot| C3
		  ```
		- | Property | Value |
		  |----------|-------|
		  | Authority | Server owns truth — clients are dumb terminals |
		  | Cheating | Very hard — client controls only inputs |
		  | Latency | Higher — input → server → broadcast |
		  | Cost | Requires server hardware or hosting budget |
		  | Uses | FPS, MMO, battle royale, any competitive game |
		- > [!tip] Industry Standard
		  > **95% of online games use client-server**. The server being authoritative is the only reliable way to prevent cheating.
	- ## Peer-to-Peer (P2P)
	  collapsed:: true
		- ```mermaid
		  graph TD
		      C1["👤 Client 1"] -->|Direct| C2["👤 Client 2"]
		      C1 -->|Direct| C3["👤 Client 3"]
		      C2 -->|Direct| C3
		  ```
		- | Property | Value |
		  |----------|-------|
		  | Authority | Distributed — each peer validates itself |
		  | Cheating | Easier — peers can lie to each other |
		  | Latency | Lower — no server round trip |
		  | Cost | Free — no server needed |
		  | Uses | Fighting games (2 players), small lobbies, RTS lockstep |
		- > [!warning] P2P Problems
		  > - IP exposure (privacy issue, DDoS risk)
		  > - NAT traversal failures (~8% of connections fail)
		  > - Host migration needed when one peer leaves
	- ## Relay Server (Hybrid)
	  collapsed:: true
		- ```mermaid
		  graph TD
		      C1["👤 Client 1"] -->|Encrypted\nUDP| R["🔄 Relay Server\n(Steam Datagram Relay,\nPhoton, Unity Relay)"]
		      C2["👤 Client 2"] -->|Encrypted\nUDP| R
		      R -->|Forwarded packets| C1
		      R -->|Forwarded packets| C2
		  ```
		- Solves NAT traversal (always works) while keeping P2P logic.
		- IP addresses remain hidden. Used by Steam, PlayStation, Xbox.
		- Cost: bandwidth only — no simulation compute.
	- ## Lockstep / Deterministic Simulation
	  collapsed:: true
		- ```mermaid
		  sequenceDiagram
		      participant C1 as Client 1
		      participant C2 as Client 2
		      Note over C1,C2: No server needed — only inputs exchanged
		      C1->>C2: "Frame 10 Input: Move Right"
		      C2->>C1: "Frame 10 Input: Jump"
		      Note over C1,C2: Both simulate Frame 10 identically
		      C1->>C2: "Frame 11 Input: ..."
		  ```
		- | Property | Value |
		  |----------|-------|
		  | What's sent | Only inputs — not state |
		  | Requirement | 100% deterministic simulation (same inputs = same output always) |
		  | Latency | Limited by slowest player for all — input delay |
		  | Recovery | Hash checks detect desync; full state resend if needed |
		  | Uses | RTS (StarCraft, Age of Empires), old fighting games |
		- > [!warning] Determinism is Hard
		  > Float operations differ between CPU architectures and compilers.
		  > You must use fixed-point math, or identical build targets, to guarantee determinism.
	- ## Architecture Comparison
	  collapsed:: true
		- | Architecture | Cheat Resistance | Latency | Bandwidth | Complexity | Best For |
		  |---|---|---|---|---|---|
		  | Authoritative Client-Server | ⭐⭐⭐⭐⭐ | Medium | High | Medium | FPS, MMO, competitive |
		  | P2P | ⭐ | Low | Low | Medium | Fighting games, small lobbies |
		  | Relay + P2P | ⭐ | Low | Medium | Medium | Console party games |
		  | Lockstep | ⭐⭐⭐ | Low (with input delay) | Very Low | High | RTS, deterministic sims |
		  | Rollback Netcode | ⭐⭐⭐ | Very Low (perceived) | Low | Very High | Fighting games |
- # Transport Layer — Protocols
  collapsed:: true
	- ## TCP vs UDP
	  collapsed:: true
		- ```mermaid
		  graph TD
		      subgraph TCP["TCP — Transmission Control Protocol"]
		          T1["✅ Reliable — every packet arrives"] 
		          T2["✅ Ordered — arrives in sequence"]
		          T3["✅ Error-checked"]
		          T4["❌ High latency — waits to resend lost packets"]
		          T5["❌ Head-of-line blocking — new packets wait for old ones"]
		          T6["❌ Congestion control — reduces speed under loss"]
		      end
		      subgraph UDP["UDP — User Datagram Protocol"]
		          U1["✅ Low latency — fire and forget"]
		          U2["✅ No connection overhead"]
		          U3["✅ You control recovery behavior"]
		          U4["❌ No delivery guarantee"]
		          U5["❌ No ordering guarantee"]
		          U6["❌ No congestion control (you implement it)"]
		      end
		  ```
		- | Use Case | Protocol | Why |
		  |---|---|---|
		  | Game state, position updates | **UDP** | Old state is worthless — just send newest |
		  | Login, authentication | **TCP** | Must arrive, order matters |
		  | Chat messages | **TCP** | Must arrive, order matters |
		  | Matchmaking | **TCP/HTTPS** | Reliability required |
		  | File downloads, patches | **TCP** | Integrity critical |
		  | Voice/Video in-game | **UDP** | Latency > reliability |
		- > [!important] Rule
		  > **Use UDP for game state. Use TCP for everything else.**
	- ## Reliable UDP (RUDP)
	  collapsed:: true
		- UDP + selective reliability on top. Only what needs to arrive will be retransmitted.
		- ```
		  Reliability Layer adds:
		    Sequence numbers   — detect out-of-order, detect loss
		    Acknowledgments    — sender knows what arrived
		    Retransmission     — re-send only unacknowledged packets
		    Fragmentation      — split large packets (MTU ~1472 bytes)
		    Ordering channels  — ordered channel for chat, unordered for positions
		  ```
		- | Library | Language | Used By |
		  |---------|----------|---------|
		  | **ENet** | C (easy bindings) | Many indie games, Godot's High-Level Networking |
		  | **GameNetworkingSockets** | C++ | Steam, all Valve games (CS2, Dota 2) |
		  | **KCP** | C | Mobile games, low-latency apps |
		  | **yojimbo** | C++ | gafferongames implementation |
		  | **LiteNetLib** | C# | Unity community standard |
	- ## WebSocket & WebRTC (Browser Games)
	  collapsed:: true
		- | Protocol | Layer | Use Case |
		  |----------|-------|---------|
		  | WebSocket | TCP | Browser server-authoritative games. Easy to implement. |
		  | WebRTC DataChannel | UDP-like (SCTP over DTLS) | Browser P2P games. NAT traversal built-in. |
		- ```javascript
		  // WebSocket client (browser)
		  const ws = new WebSocket("wss://game-server.example.com");
		  ws.binaryType = "arraybuffer"; // Use binary, not text!
		  
		  ws.onmessage = (event) => {
		      const buffer = new DataView(event.data);
		      const packetType = buffer.getUint8(0);
		      // Deserialize based on packet type...
		  };
		  
		  // Send binary packet
		  const packet = new Uint8Array([0x01, ...encodedPlayerInput]);
		  ws.send(packet.buffer);
		  ```
	- ## MTU & Packet Size
	  collapsed:: true
		- ```
		  MTU (Maximum Transmission Unit):
		    Ethernet: 1500 bytes
		    IP header:   20 bytes overhead
		    UDP header:   8 bytes overhead
		    Safe payload: ~1472 bytes per UDP packet
		  
		  Fragmentation (avoid it!):
		    Packets > MTU get fragmented at IP level
		    If any fragment is lost → entire packet lost
		    Fragment assembly adds latency
		  
		  Best Practices:
		    Keep game state packets < 1300 bytes (conservative safe limit)
		    Fragment manually in your RUDP layer if needed
		    Use delta compression to reduce packet size
		  ```
- # Tick Rate & Simulation
  collapsed:: true
	- ## What is Tick Rate?
	  collapsed:: true
		- ```
		  Tick Rate = How many times per second the server simulates the game world
		  
		  Server tick rate:
		    20 tick  → 50ms per update (many MMOs, low-priority games)
		    64 tick  → 15.6ms per update (CS2 default, Valorant)
		    128 tick → 7.8ms per update (CS2 competitive, OW2 servers)
		  
		  Client update rate:
		    How often the client sends inputs to the server (usually matches tick rate)
		  
		  Send rate (snapshot rate):
		    How often server sends state to clients (may be lower than tick rate to save bandwidth)
		  ```
		- | Tick Rate | Games | Feel |
		  |-----------|-------|------|
		  | 20 tick | Fortnite (save the world), many MMOs | Floaty, imprecise registration |
		  | 64 tick | CS:GO default, Valorant, most FPS | Acceptable competitive |
		  | 128 tick | CS:GO competitive, OW2 pro servers | High precision, pro standard |
		  | 60 Hz | Valorant client-side hit registration | Near-128 feel with client prediction |
	- ## Clock Synchronization
	  collapsed:: true
		- Without synced clocks, timestamps are meaningless across machines.
		- ```mermaid
		  sequenceDiagram
		      participant C as Client
		      participant S as Server
		      C->>S: "Ping packet" (t0 = local time)
		      Note over S: Server records receive time t1, send time t2
		      S->>C: "Pong packet" (sends t1, t2)
		      Note over C: Client receives at t3
		      Note over C: RTT = (t3 - t0)
		      Note over C: Server time now = t2 + (t3 - t2) / 2
		      Note over C: Clock offset = ServerNow - t3
		  ```
		- ```c++
		  // NTP-style clock sync (simplified)
		  int64_t syncClock(NetworkSocket& socket) {
		      auto t0 = Clock::now();
		      
		      socket.send(PingPacket{});
		      PongPacket pong = socket.receive();
		      
		      auto t3 = Clock::now();
		      int64_t rtt = (t3 - t0).milliseconds();
		      int64_t serverNow = pong.serverSendTime + rtt / 2;
		      int64_t clockOffset = serverNow - t3;
		      
		      return clockOffset; // Add this to local time to get server time
		  }
		  ```
	- ## Fixed Timestep on the Server
	  collapsed:: true
		- ```c++
		  // Server game loop — fixed tick rate
		  const double TICK_RATE = 64.0;
		  const double TICK_DURATION = 1.0 / TICK_RATE; // 15.625ms
		  
		  double accumulator = 0.0;
		  double lastTime = getTime();
		  uint64_t tickNumber = 0;
		  
		  while (serverRunning) {
		      double now = getTime();
		      accumulator += (now - lastTime);
		      lastTime = now;
		  
		      while (accumulator >= TICK_DURATION) {
		          // 1. Collect all inputs received this tick
		          auto inputs = inputBuffer.consumeTick(tickNumber);
		          
		          // 2. Simulate
		          for (auto& [clientId, input] : inputs) {
		              applyInput(clients[clientId], input);
		          }
		          physicsWorld.step(TICK_DURATION);
		          gameLogic.update(TICK_DURATION);
		          
		          // 3. Send state snapshot to all clients
		          broadcastWorldState(tickNumber);
		          
		          accumulator -= TICK_DURATION;
		          tickNumber++;
		      }
		  
		      // Sleep to avoid burning CPU
		      std::this_thread::sleep_for(std::chrono::milliseconds(1));
		  }
		  ```
- # Lag Compensation Techniques
  collapsed:: true
	- ## The Latency Problem
	  collapsed:: true
		- ```mermaid
		  sequenceDiagram
		      participant C as Client (100ms ping)
		      participant S as Server
		      Note over C: Player aims and shoots at T=0
		      C->>S: "SHOOT" input (arrives at T=50ms)
		      Note over S: Enemy has moved by 50ms!
		      Note over S: Without lag comp → shot misses unfairly
		      Note over S: With lag comp → rewind enemy to T=0 position → hit!
		      S->>C: "HIT confirmed" (arrives at T=100ms)
		  ```
		- > [!important] The Core Trade-off
		  > Lag compensation makes the game feel fair for the **shooter** but can feel unfair for the **target** ("I was behind cover but I died").
		  > This is fundamental — there's no perfect solution, only trade-offs.
	- ## Client-Side Prediction
	  collapsed:: true
		- The client applies input **immediately** without waiting for server confirmation.
		- ```mermaid
		  graph LR
		      Input["🕹️ Player presses W"] --> LocalSim["Client simulates\nmovement instantly"]
		      Input --> Send["Sends input #42\nto server"]
		      LocalSim --> Show["Player sees\nsmooth movement"]
		      Send --> Server["Server processes\ninput #42\nconfirms position"]
		      Server --> Correct["If server disagrees:\ncorrection sent"]
		      Correct --> Reconcile["Client corrects\ntransparently"]
		  ```
		- ```c++
		  // Client prediction loop
		  struct PlayerInput {
		      uint32_t sequence; // Monotonically increasing input ID
		      float moveX, moveY;
		      bool jump;
		      double timestamp;
		  };
		  
		  // Client side
		  class PredictedPlayer {
		      std::deque<PlayerInput> inputHistory; // Keep last N inputs
		      PlayerState localState;
		  
		  public:
		      void processInput(PlayerInput input) {
		          input.sequence = nextSequence++;
		          
		          // 1. Apply locally (IMMEDIATELY — don't wait for server)
		          applyInputToState(localState, input);
		          
		          // 2. Store for reconciliation
		          inputHistory.push_back(input);
		          
		          // 3. Send to server
		          network.sendInput(input);
		      }
		  
		      void onServerCorrection(uint32_t ackSequence, PlayerState serverState) {
		          // Server acknowledged input #ackSequence
		          // Discard all inputs up to and including ackSequence
		          while (!inputHistory.empty() && 
		                 inputHistory.front().sequence <= ackSequence) {
		              inputHistory.pop_front();
		          }
		  
		          // If server state differs, reconcile
		          if (serverState != localState) {
		              // Rewind to server's authoritative state
		              localState = serverState;
		              
		              // Re-apply all unacknowledged inputs
		              for (const auto& input : inputHistory) {
		                  applyInputToState(localState, input);
		              }
		          }
		      }
		  };
		  ```
	- ## Entity Interpolation
	  collapsed:: true
		- Render **other players** slightly in the past using buffered snapshots. Produces perfectly smooth movement without misprediction.
		- ```mermaid
		  graph LR
		      T0["Snapshot\nT=0ms\nEnemy at X=10"] --> Buffer["Interpolation\nBuffer\n(100ms delay)"]
		      T1["Snapshot\nT=50ms\nEnemy at X=15"] --> Buffer
		      T2["Snapshot\nT=100ms\nEnemy at X=20"] --> Buffer
		      Buffer --> Render["Render enemy\nbetween T=0 and T=50\nsmoothly at X=12"]
		  ```
		- ```c++
		  // Entity interpolation
		  struct Snapshot {
		      uint64_t tick;
		      double   timestamp;
		      glm::vec3 position;
		      glm::quat rotation;
		  };
		  
		  class InterpolatedEntity {
		      std::deque<Snapshot> snapshotBuffer; // Receive buffer
		      const double INTERP_DELAY = 0.1; // 100ms behind server time
		  
		  public:
		      void addSnapshot(Snapshot s) {
		          snapshotBuffer.push_back(s);
		          // Keep only last 32 snapshots
		          if (snapshotBuffer.size() > 32)
		              snapshotBuffer.pop_front();
		      }
		  
		      glm::vec3 getInterpolatedPosition(double currentServerTime) {
		          double renderTime = currentServerTime - INTERP_DELAY;
		  
		          // Find two snapshots that bracket renderTime
		          for (size_t i = 0; i + 1 < snapshotBuffer.size(); i++) {
		              auto& s0 = snapshotBuffer[i];
		              auto& s1 = snapshotBuffer[i + 1];
		  
		              if (s0.timestamp <= renderTime && renderTime <= s1.timestamp) {
		                  float t = (renderTime - s0.timestamp) / 
		                            (s1.timestamp - s0.timestamp);
		                  return glm::mix(s0.position, s1.position, t);
		              }
		          }
		  
		          // Extrapolate if we run out of snapshots (packet loss)
		          if (!snapshotBuffer.empty())
		              return snapshotBuffer.back().position; // Dead reckoning fallback
		          return {};
		      }
		  };
		  ```
	- ## Dead Reckoning
	  collapsed:: true
		- Predict entity positions based on **last known velocity** when no new data arrives (packet loss, sparse updates).
		- ```c++
		  struct DeadReckoning {
		      glm::vec3 lastKnownPosition;
		      glm::vec3 lastKnownVelocity;
		      double    lastUpdateTime;
		  
		      glm::vec3 predictPosition(double currentTime) {
		          double dt = currentTime - lastUpdateTime;
		          return lastKnownPosition + lastKnownVelocity * (float)dt;
		      }
		  
		      void onNewData(glm::vec3 pos, glm::vec3 vel, double time) {
		          lastKnownPosition = pos;
		          lastKnownVelocity = vel;
		          lastUpdateTime    = time;
		      }
		  };
		  ```
		- > [!tip] When to Use Which
		  > - **Interpolation** → for other players (render their past, smooth and accurate)
		  > - **Dead Reckoning** → fallback when packets are lost (no buffer data)
		  > - **Prediction** → for the LOCAL player only (apply your own input instantly)
	- ## Server-Side Lag Compensation (for hitscan)
	  collapsed:: true
		- When a player shoots, the server rewinds time to when the client saw the world.
		- ```c++
		  class LagCompensationManager {
		      // Ring buffer of world state snapshots (keep last 1 second = 64 ticks @ 64Hz)
		      struct HistoricalState {
		          uint64_t tick;
		          std::unordered_map<EntityId, ColliderShape> entityColliders;
		      };
		      CircularBuffer<HistoricalState, 128> history;
		  
		  public:
		      void recordTick(uint64_t tick) {
		          HistoricalState state;
		          state.tick = tick;
		          for (auto& [id, entity] : world.entities) {
		              state.entityColliders[id] = entity.getCollider();
		          }
		          history.push(state);
		      }
		  
		      HitResult performLagCompensatedRaycast(
		              EntityId shooterId, Ray ray, 
		              uint64_t clientTick,    // The tick the client was on when they shot
		              double   clientLatency) // The shooter's ping (seconds)
		      {
		          // Find the historical snapshot closest to when the client fired
		          uint64_t rewindTick = clientTick - 
		                                (uint64_t)(clientLatency * SERVER_TICK_RATE);
		          
		          auto* historicalState = history.findNearest(rewindTick);
		          if (!historicalState) return {}; // Too far in the past
		  
		          // Temporarily move all entities to their historical positions
		          ScopedStateOverride override(world, *historicalState);
		  
		          // Perform the raycast in rewound world
		          return world.raycast(ray, /*excludeId=*/shooterId);
		      }
		  };
		  ```
- # Rollback Netcode
  collapsed:: true
	- ## What is Rollback?
	  collapsed:: true
		- Rollback is P2P networking where **the game runs ahead speculatively** using predicted inputs, then corrects when real inputs arrive.
		- ```mermaid
		  sequenceDiagram
		      participant C1 as You (Frame 10)
		      participant C2 as Opponent (Frame 10)
		      Note over C1: Frame 10: You punch
		      Note over C1: Frame 10: Predict opponent stands still (no input yet)
		      C1->C1: Simulate Frame 10 optimistically
		      C2->>C1: "Frame 10: Opponent jumped!" (arrives at Frame 13)
		      C1->C1: ROLLBACK to Frame 10
		      C1->C1: Resimulate 10, 11, 12, 13 with correct opponent input
		      Note over C1: Player sees seamless correction
		  ```
		- | Property | Value |
		  |---|---|
		  | Input delay | **0 frames** (vs 4-8 for delay-based) |
		  | Perceived latency | Near-zero (you act immediately) |
		  | Implementation | Hard — full game state save/restore required |
		  | Game requirement | Fast simulation (< 1ms per frame) |
		  | Used in | Street Fighter V, Guilty Gear Strive, Mortal Kombat 11, Brawlhalla |
	- ## GGPO (Good Game Peace Out)
	  collapsed:: true
		- The reference rollback netcode library — open source, used by most fighting game rollback implementations.
		- ```c++
		  // GGPO integration pseudocode
		  GGPOSession* ggpo;
		  GGPOCallbacks callbacks;
		  
		  // You implement these callbacks:
		  callbacks.save_game_state = [](unsigned char** buffer, int* len, int* checksum, int frame) {
		      *buffer = new unsigned char[sizeof(GameState)];
		      memcpy(*buffer, &gameState, sizeof(GameState));
		      *len = sizeof(GameState);
		      *checksum = calculateChecksum(gameState); // For desync detection
		      return true;
		  };
		  
		  callbacks.load_game_state = [](unsigned char* buffer, int len) {
		      memcpy(&gameState, buffer, len);
		      return true;
		  };
		  
		  callbacks.advance_frame = [](int flags) {
		      // Run one frame of game logic
		      GGPOPlayerHandle handles[2];
		      uint32_t inputs[2];
		      GGPOErrorCode result = ggpo_synchronize_input(ggpo, inputs, sizeof(inputs), nullptr);
		      
		      gameState.update(inputs[0], inputs[1], FRAME_DELTA);
		      ggpo_advance_frame(ggpo);
		      return true;
		  };
		  
		  // Main loop
		  while (running) {
		      uint32_t localInput = getLocalInput();
		      ggpo_add_local_input(ggpo, localPlayerHandle, &localInput, sizeof(localInput));
		      ggpo_idle(ggpo, 0); // Process network messages
		  }
		  ```
		- > [!warning] Rollback Requirement
		  > Your **entire game state must be saveable and restoreable** in under ~200 microseconds.
		  > This means: no heap-allocated dynamic objects in your game state, no file I/O in your simulation.
		  > Use value-type ECS or fixed-size arrays only.
- # State Synchronization Patterns
  collapsed:: true
	- ## Full State vs Delta Compression
	  collapsed:: true
		- ```mermaid
		  graph TD
		      subgraph Full["Full State Snapshot"]
		          F1["Send entire world state every tick"]
		          F2["Simple but expensive"]
		          F3["Bandwidth: O(entities × properties)"]
		      end
		      subgraph Delta["Delta Compression"]
		          D1["Send only CHANGED values since last acknowledged snapshot"]
		          D2["Complex but efficient"]
		          D3["Bandwidth: O(changed entities)"]
		      end
		  ```
		- ```c++
		  // Delta compression example
		  struct PlayerStateDelta {
		      uint8_t  changedFields; // Bitmask: bit 0=position, bit 1=health, bit 2=animation, ...
		      // Only the changed fields follow
		      glm::vec3 position;   // Only if bit 0 set
		      float     health;     // Only if bit 1 set
		      uint8_t   animation;  // Only if bit 2 set
		  };
		  
		  // Serializer with dirty tracking
		  void serializeDelta(BitWriter& writer, 
		                       const PlayerState& current, 
		                       const PlayerState& baseline) 
		  {
		      uint8_t mask = 0;
		      if (current.position  != baseline.position)  mask |= 0x01;
		      if (current.health    != baseline.health)    mask |= 0x02;
		      if (current.animation != baseline.animation) mask |= 0x04;
		      
		      writer.writeByte(mask);
		      if (mask & 0x01) writer.writeVec3Quantized(current.position, -4096, 4096);
		      if (mask & 0x02) writer.writeFloat16(current.health);
		      if (mask & 0x04) writer.writeByte(current.animation);
		  }
		  ```
	- ## Input Synchronization
	  collapsed:: true
		- What the client sends **UP** to the server every tick.
		- ```c++
		  // Compact input packet (fits in ~4 bytes)
		  struct InputPacket {
		      uint16_t sequence;     // Input sequence number (wrap around OK)
		      uint8_t  moveFlags;    // Bitfield: bit0=W, bit1=S, bit2=A, bit3=D
		      uint8_t  actionFlags;  // bit0=jump, bit1=crouch, bit2=shoot, bit3=reload
		      int8_t   aimX;        // Quantized aim delta (-127 to 127)
		      int8_t   aimY;        // Quantized aim delta
		      uint8_t  tick;        // Local tick this input was generated on (low 8 bits)
		  }; // Total: 7 bytes
		  
		  // Reliability: include last 8 inputs in each packet
		  // (redundant sending prevents input loss from causing issues)
		  struct InputPacketBundle {
		      InputPacket inputs[8]; // Current + 7 previous
		  }; // Total: 56 bytes — still small
		  ```
		- > [!tip] Redundant Input Sending
		  > Include the last **N inputs** in every packet. If packet 10 arrives but packet 9 was lost, packet 10 carries input 9 as well. This eliminates input loss entirely for reasonable packet loss rates.
	- ## Interest Management (Relevance)
	  collapsed:: true
		- Don't send updates for entities the client can't see or doesn't care about.
		- ```mermaid
		  graph TD
		      World["🌍 World\n10,000 entities"] --> IM["👁️ Interest Manager\nPer-client relevance filter"]
		      IM --> C1Updates["Client 1 update:\n~50 nearby entities\n→ 2KB/tick"]
		      IM --> C2Updates["Client 2 update:\n~40 nearby entities\n→ 1.5KB/tick"]
		      Note["Without IM:\nEach client would get\n10,000 entity updates\n→ 500KB/tick ❌"]
		  ```
		- ```c++
		  // Interest management — spatial grid approach
		  class InterestManager {
		      static const float VIEW_DISTANCE = 150.0f;
		  
		  public:
		      std::vector<EntityId> getRelevantEntities(EntityId clientPlayer) {
		          auto& playerPos = world.getPosition(clientPlayer);
		          std::vector<EntityId> relevant;
		  
		          // Always include: self, priority entities (bosses, projectiles near player)
		          relevant.push_back(clientPlayer);
		  
		          // Spatial query for nearby entities
		          auto nearby = spatialGrid.query(playerPos, VIEW_DISTANCE);
		          relevant.insert(relevant.end(), nearby.begin(), nearby.end());
		  
		          // Sort by distance — closer = higher priority
		          std::sort(relevant.begin(), relevant.end(), [&](EntityId a, EntityId b) {
		              return glm::distance(world.getPosition(a), playerPos) <
		                     glm::distance(world.getPosition(b), playerPos);
		          });
		  
		          // Cap at max entities per update
		          if (relevant.size() > MAX_ENTITIES_PER_UPDATE)
		              relevant.resize(MAX_ENTITIES_PER_UPDATE);
		  
		          return relevant;
		      }
		  };
		  ```
- # Matchmaking
  collapsed:: true
	- ## Matchmaking Architecture
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Player["👤 Player\nclicks 'Find Match'"] --> Queue["📋 Matchmaking Queue\n(backend service)"]
		      Queue --> Algo["🧠 Matchmaking Algorithm\nELO/TrueSkill + latency + region"]
		      Algo --> |"Match found"| Session["🖥️ Session Created\nGame Server allocated"]
		      Session --> C1["Player 1 receives\nserver IP + token"]
		      Session --> C2["Player 2 receives\nserver IP + token"]
		      C1 --> Server["Both connect to\ngame server"]
		      C2 --> Server
		  ```
	- ## ELO Rating System
	  collapsed:: true
		- ```python
		  # ELO implementation
		  def expected_score(player_elo: float, opponent_elo: float) -> float:
		      """Probability of player winning."""
		      return 1.0 / (1.0 + 10 ** ((opponent_elo - player_elo) / 400))
		  
		  def update_elo(player_elo: float, opponent_elo: float, 
		                  score: float,  # 1.0 = win, 0.5 = draw, 0.0 = loss
		                  k: float = 32) -> float:
		      """Update player's ELO after a game."""
		      expected = expected_score(player_elo, opponent_elo)
		      return player_elo + k * (score - expected)
		  
		  # Example:
		  # Player (1500 ELO) beats Opponent (1600 ELO)
		  new_elo = update_elo(1500, 1600, score=1.0)  # → ~1520
		  ```
	- ## TrueSkill (Microsoft)
	  collapsed:: true
		- More accurate than ELO for team games. Used by Xbox, Halo.
		- ```
		  TrueSkill models skill as a Gaussian distribution:
		    μ (mu)    = estimated skill (mean)
		    σ (sigma) = uncertainty (standard deviation)
		  
		  Conservative skill estimate = μ - 3σ (used for ranking display)
		  
		  Starting values: μ = 25, σ = 8.333
		  
		  After each game:
		    Win  → μ increases, σ decreases (more confident you're skilled)
		    Loss → μ decreases, σ decreases (more confident about skill level)
		  
		  Handles team games, multiple players per team natively.
		  ```
	- ## Matchmaking Quality Metrics
	  collapsed:: true
		- | Metric | Target | Description |
		  |--------|--------|-------------|
		  | Match quality | > 0.8 | ELO difference < 100 |
		  | Wait time | < 60 seconds | For casual, < 5 min for ranked |
		  | Fair match % | > 90% | Matches where skill gap is acceptable |
		  | Abandonment rate | < 5% | Players leaving mid-match |
		  | Latency (avg ping) | < 80ms | Regional server selection |
- # NAT Traversal
  collapsed:: true
	- ## The NAT Problem
	  collapsed:: true
		- ```mermaid
		  graph TD
		      P1["👤 Player 1\nPrivate: 192.168.1.10\nPublic: 73.22.100.5:54321\n(NAT assigned)"] -->|Blocked by NAT| P2["👤 Player 2\nPrivate: 10.0.0.5\nPublic: 98.76.54.32:61234"]
		      P2 -->|Blocked by NAT| P1
		      Note["Direct UDP between P1 and P2 fails\nbecause NAT routers block\nunsolicited incoming packets"]
		  ```
	- ## NAT Traversal Techniques
	  collapsed:: true
		- | Technique | How | Success Rate |
		  |---|---|---|
		  | **STUN** | Discover your public IP:port from a STUN server | ~80% (fails with Symmetric NAT) |
		  | **UDP Hole Punching** | Both peers send to each other simultaneously | ~85% |
		  | **TURN/Relay** | Route all traffic through a relay server | 100% (but adds latency + cost) |
		  | **UPnP** | Auto-configure router port forwarding | ~70% (many routers disable it) |
			- ```mermaid
			  sequenceDiagram
			      participant C1 as Client 1 (behind NAT)
			      participant S as STUN Server
			      participant C2 as Client 2 (behind NAT)
			      C1->>S: "What is my public IP:port?"
			      S->>C1: "73.22.100.5:54321"
			      C2->>S: "What is my public IP:port?"
			      S->>C2: "98.76.54.32:61234"
			      Note over C1,C2: Both discover each other's public addresses via matchmaker
			      C1->>C2: Send UDP to 98.76.54.32:61234 (punch hole)
			      C2->>C1: Send UDP to 73.22.100.5:54321 (punch hole simultaneously)
			      Note over C1,C2: Connection established!
			  ```
- # Anti-Cheat
  collapsed:: true
	- ## Cheat Types
	  collapsed:: true
		- | Cheat | Description | Prevention |
		  |-------|-------------|------------|
		  | Aimbot | Auto-aim assistance | Server-side suspicious aim analysis, VAC |
		  | Wallhack | See through walls | Don't send position data of invisible entities |
		  | Speed hack | Move faster than physics allows | Server validates max speed per tick |
		  | Packet manipulation | Modify sent UDP packets | Packet signing with session key |
		  | Memory editing | Modify game memory values | Kernel-level AC (EAC, BattlEye) |
		  | Macro / input bot | Scripted input | Behavioral analysis, input timing analysis |
	- ## Server-Side Anti-Cheat (Reliable)
	  collapsed:: true
		- ```c++
		  // Authoritative movement validation
		  void ServerPlayerController::validateMovement(
		          EntityId playerId, 
		          const InputPacket& input, 
		          float deltaTime)
		  {
		      PlayerState& state = world.getState(playerId);
		      glm::vec3 requestedPos = simulateMovement(state, input, deltaTime);
		      
		      // Maximum speed check
		      float maxDistanceThisFrame = MAX_PLAYER_SPEED * deltaTime * 1.1f; // 10% tolerance
		      float movedDistance = glm::distance(requestedPos, state.position);
		      
		      if (movedDistance > maxDistanceThisFrame) {
		          // Teleport/speed hack detected
		          log("Speed violation: player {} moved {:.2f}m in {:.3f}s",
		              playerId, movedDistance, deltaTime);
		          
		          // Apply server-authoritative position (don't trust client)
		          state.position = state.position + 
		                           glm::normalize(requestedPos - state.position) * maxDistanceThisFrame;
		          
		          // Increment violation counter
		          violationLog[playerId]++;
		          if (violationLog[playerId] > VIOLATION_THRESHOLD) {
		              kickPlayer(playerId, "Movement violation");
		          }
		      } else {
		          state.position = requestedPos;
		      }
		  }
		  ```
	- ## Interest Management as Anti-Wallhack
	  collapsed:: true
		- ```c++
		  // Don't send position data for invisible enemies
		  bool isEnemyVisible(EntityId viewer, EntityId target) {
		      auto& viewerPos = world.getPosition(viewer);
		      auto& targetPos = world.getPosition(target);
		  
		      // Distance check first (cheap)
		      if (glm::distance(viewerPos, targetPos) > MAX_VISIBILITY_DISTANCE)
		          return false;
		  
		      // FOV check
		      glm::vec3 toTarget = glm::normalize(targetPos - viewerPos);
		      if (glm::dot(world.getForward(viewer), toTarget) < FOV_DOT_THRESHOLD)
		          return false;
		  
		      // Raycast (expensive — do last)
		      return !world.raycastBlocked(viewerPos, targetPos);
		  }
		  
		  // Build server → client snapshot
		  WorldSnapshot buildSnapshot(EntityId clientPlayer) {
		      WorldSnapshot snap;
		      for (auto& [id, entity] : world.entities) {
		          if (id == clientPlayer || isEnemyVisible(clientPlayer, id)) {
		              snap.entities.push_back(entity.getState());
		          }
		          // ← Enemy is NOT in the snapshot if invisible
		          // → Wallhack can't show what the server doesn't send
		      }
		      return snap;
		  }
		  ```
- # Bandwidth Optimization
  collapsed:: true
	- ## Quantization (Float Compression)
	  collapsed:: true
		- ```c++
		  // Quantize a position float to 16 bits
		  // Range: [-4096, 4096] meters → precision: ~0.125m = 12.5cm
		  uint16_t quantizePosition(float value, float min, float max) {
		      float normalized = (value - min) / (max - min); // 0.0 to 1.0
		      return (uint16_t)(normalized * 65535.0f);        // 0 to 65535
		  }
		  float dequantizePosition(uint16_t quantized, float min, float max) {
		      float normalized = quantized / 65535.0f;
		      return min + normalized * (max - min);
		  }
		  
		  // Quantize rotation to quaternion with 16-bit components (smallest-3)
		  // Largest component is implicit (can be derived from the other 3)
		  // This gives ~0.1 degree precision at only 6 bytes (vs 16 for full quat)
		  ```
	- ## Bandwidth Budget Example (FPS Game)
	  collapsed:: true
		- ```
		  Example: 20 players, 64 tick/s server
		  
		  Per-entity state per tick:
		    Position    (3× quantized 16bit)  = 6 bytes
		    Rotation    (smallest-3 quat)     = 6 bytes
		    Velocity    (3× 16bit)            = 6 bytes
		    Health      (8bit 0-255)          = 1 byte
		    State flags (jump, crouch, shoot)  = 1 byte
		  Total per entity: ~20 bytes
		  
		  Per-tick packet (20 other players):
		    Entity data:  20 × 20 = 400 bytes
		    Header:       8 bytes (tick, sequence, ack)
		    Total:        ~408 bytes per packet
		  
		  Bandwidth per client (64 tick):
		    408 × 64 = 26,112 bytes/s = ~26 KB/s downstream
		  
		  Server outgoing (20 clients):
		    26,112 × 20 = 522,240 bytes/s = ~4 Mbps
		  
		  With delta compression (only send changed entities):
		    Average 8 moving entities → 208 bytes/packet → ~13 KB/s
		    Server outgoing: ~2 Mbps (50% savings)
		  ```
- # Implementation in Godot (GDScript)
  collapsed:: true
	- ## Godot Multiplayer API
	  collapsed:: true
		- ```gdscript
		  # server.gd — Authoritative server
		  extends Node
		  
		  const PORT = 7777
		  const MAX_PLAYERS = 32
		  
		  var players: Dictionary = {} # peer_id → PlayerState
		  
		  func _ready():
		      var peer = ENetMultiplayerPeer.new()
		      var err = peer.create_server(PORT, MAX_PLAYERS)
		      if err != OK:
		          push_error("Failed to create server: %s" % err)
		          return
		      
		      multiplayer.multiplayer_peer = peer
		      multiplayer.peer_connected.connect(_on_peer_connected)
		      multiplayer.peer_disconnected.connect(_on_peer_disconnected)
		      print("Server listening on port %d" % PORT)
		  
		  func _on_peer_connected(id: int):
		      print("Player connected: %d" % id)
		      players[id] = PlayerState.new()
		      # Send current world state to new player
		      sync_full_state.rpc_id(id, get_full_state())
		  
		  func _on_peer_disconnected(id: int):
		      players.erase(id)
		      broadcast_player_left.rpc(id)
		  
		  # Receive player input (unreliable, called each tick)
		  @rpc("any_peer", "unreliable_ordered")
		  func receive_input(seq: int, move_x: float, move_y: float, 
		                      jump: bool, aim_x: float, aim_y: float):
		      var sender_id = multiplayer.get_remote_sender_id()
		      if sender_id not in players:
		          return
		      
		      # Validate + apply input server-side
		      var player = players[sender_id]
		      player.apply_input(move_x, move_y, jump, get_process_delta_time())
		      
		  # Broadcast world state every tick
		  @rpc("call_local", "unreliable_ordered")
		  func broadcast_state(tick: int, state_data: PackedByteArray):
		      pass # Clients process received state
		  ```
		- ```gdscript
		  # client.gd — Client with prediction
		  extends Node
		  
		  @onready var server_ip = "127.0.0.1"
		  @onready var server_port = 7777
		  
		  var input_sequence: int = 0
		  var pending_inputs: Array = [] # For reconciliation
		  
		  func connect_to_server():
		      var peer = ENetMultiplayerPeer.new()
		      peer.create_client(server_ip, server_port)
		      multiplayer.multiplayer_peer = peer
		  
		  func _physics_process(delta):
		      if not multiplayer.is_server():
		          _handle_client_frame(delta)
		  
		  func _handle_client_frame(delta: float):
		      # 1. Sample input
		      var input = {
		          "seq": input_sequence,
		          "move_x": Input.get_axis("move_left", "move_right"),
		          "move_y": Input.get_axis("move_up", "move_down"),
		          "jump": Input.is_action_just_pressed("jump"),
		      }
		      
		      # 2. Apply locally (client-side prediction)
		      local_player.apply_input(input.move_x, input.move_y, input.jump, delta)
		      
		      # 3. Store for reconciliation 
		      pending_inputs.append(input)
		      if pending_inputs.size() > 128:
		          pending_inputs.pop_front()
		      
		      # 4. Send to server (unreliable — high frequency)
		      server.receive_input.rpc_id(1, 
		          input.seq, input.move_x, input.move_y, input.jump, 0.0, 0.0)
		      
		      input_sequence += 1
		  ```
	- ## Godot MultiplayerSynchronizer
	  collapsed:: true
		- ```gdscript
		  # Modern Godot 4 approach — scene replication
		  # Add MultiplayerSynchronizer node to your scene
		  
		  # player.gd
		  extends CharacterBody3D
		  
		  # These variables are automatically synced by MultiplayerSynchronizer
		  # Configure in MultiplayerSynchronizer inspector: add position, velocity to sync list
		  
		  @rpc("any_peer", "unreliable_ordered", "call_remote")
		  func set_target_position(pos: Vector3):
		      # Server validates and sets position
		      if multiplayer.is_server():
		          if _is_valid_position(pos):
		              global_position = pos
		  
		  func _is_valid_position(new_pos: Vector3) -> bool:
		      # Validate max movement speed etc.
		      var max_dist = MAX_SPEED * get_process_delta_time() * 1.15
		      return global_position.distance_to(new_pos) <= max_dist
		  ```
- # Godot Networking: ENet vs WebSocket
  collapsed:: true
	- ## When to Use Which
	  collapsed:: true
		- | | ENet | WebSocket |
		  |---|---|---|
		  | Protocol | RUDP over UDP | TCP |
		  | Latency | Low (~20-50ms extra overhead) | Higher (~40-80ms) |
		  | Platforms | Desktop, Mobile, Console | Desktop, Mobile, **Browser** |
		  | Setup | Built into Godot | Built into Godot |
		  | Best for | PC/console multiplayer | Web export, cross-platform casual |
		- ```gdscript
		  # ENet (recommended for most games)
		  var enet_peer = ENetMultiplayerPeer.new()
		  enet_peer.create_server(7777)
		  multiplayer.multiplayer_peer = enet_peer
		  
		  # WebSocket (for browser/web export)
		  var ws_peer = WebSocketMultiplayerPeer.new()
		  ws_peer.create_server(7777)
		  multiplayer.multiplayer_peer = ws_peer
		  ```
- # Production Infrastructure
  collapsed:: true
	- ## Game Server Hosting Options
	  collapsed:: true
		- | Option | Cost | Setup | Best For |
		  |--------|------|-------|---------|
		  | **Self-hosted VPS** (DigitalOcean, Linode) | $5–50/month | Manual | Indie projects, full control |
		  | **AWS GameLift** | Pay per use | Medium | Scalable commercial games |
		  | **Hathora** | Pay per use, game-focused | Easy | Indie → commercial |
		  | **Photon Engine** | Free tier + paid | Easy | Rapid prototyping + production |
		  | **Unity Gaming Services** | Free tier + paid | Easy | Unity games |
		  | **Nakama** (open source) | Self-hosted | Medium | Full game backend (matchmaking + accounts + leaderboards) |
		  | **Agones** (Kubernetes) | Infrastructure cost | Hard | Large scale, Kubernetes-native |
	- ## Server Startup & Health Check
	  collapsed:: true
		- ```c++
		  // Typical game server lifecycle
		  int main() {
		      // 1. Read config from environment (injected by orchestrator)
		      std::string serverIp   = getenv("SERVER_IP");
		      int         serverPort = std::stoi(getenv("SERVER_PORT") ?: "7777");
		      int         maxPlayers = std::stoi(getenv("MAX_PLAYERS") ?: "20");
		      
		      // 2. Initialize systems
		      NetworkServer server(serverIp, serverPort, maxPlayers);
		      GameWorld world;
		      
		      // 3. Register with orchestrator (signal ready to receive players)
		      orchestrator.notifyReady(serverIp, serverPort);
		      
		      // 4. Health check HTTP endpoint (orchestrators ping this)
		      httpServer.get("/health", [](Request& req, Response& res) {
		          res.json({
		              {"status", "ok"},
		              {"players", world.getPlayerCount()},
		              {"tick", world.getCurrentTick()},
		              {"uptime_s", getUptimeSeconds()}
		          });
		      });
		      
		      // 5. Main game loop
		      while (server.isRunning()) {
		          server.processNetworkEvents();
		          world.tick();
		          server.broadcastSnapshot(world.getSnapshot());
		      }
		      
		      // 6. Graceful shutdown — notify orchestrator, save any state
		      orchestrator.notifyShutdown(serverIp, serverPort);
		      return 0;
		  }
		  ```
- # Quick Reference Cheat Sheet
  collapsed:: true
	- ## Topology Decision Tree
	  collapsed:: true
		- ```mermaid
		  graph TD
		      Q1["Browser game?"]
		      Q1 -->|Yes| WebSocket["Use WebSocket\nor WebRTC"]
		      Q1 -->|No| Q2["Fighting game\nor real-time action\nwith 2-4 players?"]
		      Q2 -->|Yes| Q3["Can afford\nhigh implementation\ncomplexity?"]
		      Q3 -->|Yes| Rollback["Rollback Netcode\n(GGPO)"]
		      Q3 -->|No| P2P["Relay + P2P\nwith delay-based"]
		      Q2 -->|No| Q4["RTS or\nturn-based?"]
		      Q4 -->|Yes| Lockstep["Lockstep / Deterministic"]
		      Q4 -->|No| CS["Authoritative\nClient-Server + UDP\n(industry standard)"]
		  ```
	- ## Key Numbers to Remember
	  collapsed:: true
		- | Metric | Value | Notes |
		  |--------|-------|-------|
		  | MTU safe payload | 1472 bytes | Keep UDP packets under this |
		  | Interpolation delay | 100ms | Standard entity interpolation buffer |
		  | Client prediction buffer | Last 64-128 inputs | For reconciliation |
		  | Lag compensation window | 200-500ms | Balance fairness vs cheating ease |
		  | Good ping (FPS) | < 60ms | Competitive standard |
		  | Acceptable ping (FPS) | < 120ms | Casual standard |
		  | Bad ping | > 200ms | Noticeable, degraded experience |
		  | Tick rate (competitive) | 64–128 Hz | CS2, Valorant |
		  | Tick rate (casual) | 20–30 Hz | Many MMOs, Fortnite  |
		  | Max bandwidth per client | 30–60 KB/s | Typical FPS downstream |
	- ## Packet Type Reference
	  collapsed:: true
		- | Packet | Direction | Frequency | Reliability |
		  |--------|-----------|-----------|-------------|
		  | Input | Client → Server | Every tick (64/s) | Unreliable (redundant sending) |
		  | State snapshot | Server → Client | Every tick (64/s) | Unreliable |
		  | Chat message | Either | On event | Reliable |
		  | Login/Auth | Client → Server | Once | Reliable (TCP/HTTPS) |
		  | Spawn/destroy event | Server → Client | On event | Reliable |
		  | Damage event | Server → Client | On event | Reliable (must arrive) |
- # More Learn
	- ## Github & Webs
		- [Gaffer on Games — Networking Articles](https://gafferongames.com/) — The gold standard reference for game networking theory.
		- [Gabriel Gambetta — Fast-Paced Multiplayer](https://www.gabrielgambetta.com/client-server-game-architecture.html) — Classic articles on prediction/reconciliation.
		- [GGPO — Rollback Netcode Library](https://github.com/pond3r/ggpo) — Reference rollback implementation.
		- [GameNetworkingSockets (Valve)](https://github.com/ValveSoftware/GameNetworkingSockets) — Steam's RUDP library, open source.
		- [ENet Library](https://github.com/lsalzman/enet) — Simple RUDP for C/C++.
		- [Nakama — Open Source Game Backend](https://github.com/heroiclabs/nakama) — Accounts, matchmaking, leaderboards.
		- [Photon Engine](https://www.photonengine.com/) — Easy multiplayer SDK (Unity, Godot, Unreal).
		- [Godot Multiplayer Docs](https://docs.godotengine.org/en/stable/tutorials/networking/high_level_multiplayer.html) — Official Godot networking guide.
	- ## Master Playlists YouTube 📺 Free
		- [Game Networking Fundamentals (Glenn Fiedler)](https://gafferongames.com/post/what_every_programmer_needs_to_know_about_game_networking/) — Must-read article series.
		- [Unreal Engine Networking (Official)](https://www.youtube.com/watch?v=JOJP0CvpB8w) — UE5 networking deep dive.
		- [Rollback Netcode Explained (Jett)](https://www.youtube.com/watch?v=0NLe4IpdS1w) — Visual rollback explanation.