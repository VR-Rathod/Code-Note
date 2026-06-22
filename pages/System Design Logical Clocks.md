---
seoTitle: Distributed Logical Clocks (Lamport, Vector Clocks) – System Design
description: "Learn how distributed systems order events without synchronized physical clocks. Covers Lamport Timestamps, Vector Clocks, causality, and concurrent update detection."
keywords: "logical clock, lamport timestamp, vector clock, causality, happens-before, clock drift, NTP, distributed systems, system design"
displayTitle: System Design - Logical Clocks
title: System Design Logical Clocks
treeTitle: System Design - Distributed Systems - Logical Clocks
---

> [!info] What is a Logical Clock?
> A **Logical Clock** is a mechanism for ordering events in a distributed system without relying on physical time (like Wall Clock time). Because physical clocks drift and NTP sync is unreliable at high resolution, logical clocks use monotonic counters to capture causal relationships ("happens-before" ordering) between events.

- # The Physical Clock Problem
	- Distributed systems cannot trust physical clocks (system timers) for ordering transactions.
	- **Clock Drift**: Hardware clocks drift due to temperature, virtualization, and CPU usage.
	- **NTP Limitations**: Network Time Protocol synchronization is periodic and can result in clocks jumping backward or forward, violating monotonic progression.
	- **The Hazard**: If server A processes a transaction at physical time `10:00:05.100` and server B processes a dependent transaction at physical time `10:00:05.090` (due to clock skew), a database using physical times would incorrectly order B before A (Last-Write-Wins error).
-
- # Lamport Timestamps
  collapsed:: true
	- Leslie Lamport introduced the concept of **Logical Time** and the **Happens-Before Relation** ($\to$).
	-
	- ## Happens-Before Relation ($\to$)
		- We define $a \to b$ ("event $a$ happens-before event $b$") if:
		- 1. $a$ and $b$ occur in the same process, and $a$ occurs before $b$ chronologically.
		- 2. $a$ is the sending of a message by one process, and $b$ is the receipt of that same message by another process.
		- 3. Transitivity: If $a \to b$ and $b \to c$, then $a \to c$.
		- *If neither $a \to b$ nor $b \to a$, then the events are **concurrent** ($a \parallel b$).*
	-
	- ## Clock Updates Algorithm
		- Each process maintains a single integer counter $L$, initialized to `0`.
		-
		- 1. **Before an internal event**, a process increments its counter:
		   $$L = L + 1$$
		- 2. **When sending a message**, a process increments its counter and attaches it to the message payload: `Message(data, L)`.
		- 3. **When receiving a message** with timestamp $L_{msg}$, the receiver updates its counter:
		   $$L_{local} = \max(L_{local}, L_{msg}) + 1$$
	-
	- ## The Limitation of Lamport Timestamps
		- Lamport timestamps guarantee that if $a \to b$, then $L(a) < L(b)$.
		- However, **the converse is NOT true**: if $L(a) < L(b)$, we cannot infer whether $a \to b$ or if $a$ and $b$ were concurrent ($a \parallel b$). Therefore, Lamport timestamps cannot be used to detect conflicts.
-
- # Vector Clocks
  collapsed:: true
	- Vector clocks extend Lamport timestamps to capture true causality and identify concurrent updates (conflicts).
	-
	- ## The Mechanism
		- Given $N$ processes in a system, each process maintains an array (vector) $V$ of size $N$, where $V[i]$ represents the clock of process $i$.
		-
		- 1. **Before an internal event**, process $i$ increments its own entry:
		   $$V_i[i] = V_i[i] + 1$$
		- 2. **When sending a message**, process $i$ increments its entry and attaches the copy of its vector $V_i$ to the message: `Message(data, V_i)`.
		- 3. **When receiving a message** from process $i$ with vector $V_{msg}$, the receiver $j$:
			- Updates all vector entries to the element-wise maximum:
			  $$V_j[k] = \max(V_j[k], V_{msg}[k]) \quad \forall k \in [0, N-1]$$
			- Increments its own logical time:
			  $$V_j[j] = V_j[j] + 1$$
	-
	- ## Determining Causality vs. Concurrency
		- To compare two vector clocks $V_A$ and $V_B$:
		-
		- - **Causally Precedes** ($V_A < V_B$):
		   $$V_A \le V_B \iff V_A[k] \le V_B[k] \quad \forall k \quad \text{AND} \quad \exists k \text{ such that } V_A[k] < V_B[k]$$
		   *(All elements in $V_A$ are less than or equal to $V_B$, and at least one is strictly less. This means event A causally preceded event B).*
		- - **Concurrent / Conflict** ($V_A \parallel V_B$):
		   $$V_A \not\le V_B \quad \text{AND} \quad V_B \not\le V_A$$
		   *(Some elements in $V_A$ are larger than $V_B$, while others are smaller. This proves events happened concurrently and requires a conflict resolution strategy, such as LWW or CRDT).*
-
- # Implementation
  collapsed:: true
	- :::code-tabs
	  
	  ```python
	  from typing import Dict
	  
	  class VectorClock:
	      """
	      Vector Clock representation for a node in a distributed system.
	      Can use strings as node keys to accommodate dynamic node topologies.
	      """
	      def __init__(self, node_id: str):
	          self.node_id = node_id
	          self.clock: Dict[str, int] = {self.node_id: 0}
	  
	      def tick(self):
	          """Increment local node logical timestamp."""
	          self.clock[self.node_id] = self.clock.get(self.node_id, 0) + 1
	  
	      def send_event(self) -> Dict[str, int]:
	          """Increment local time and return payload vector clock."""
	          self.tick()
	          return self.clock.copy()
	  
	      def receive_event(self, incoming_clock: Dict[str, int]):
	          """
	          Merge local clock with incoming clock, then increment local time.
	          """
	          # Union keys of both clocks
	          all_nodes = set(self.clock.keys()).union(incoming_clock.keys())
	          for node in all_nodes:
	              self.clock[node] = max(self.clock.get(node, 0), incoming_clock.get(node, 0))
	          self.tick()
	  
	      @staticmethod
	      def compare(v1: Dict[str, int], v2: Dict[str, int]) -> str:
	          """
	          Compares two vector clocks.
	          Returns:
	          - 'LESS' if v1 causally precedes v2
	          - 'GREATER' if v1 causally succeeds v2
	          - 'EQUAL' if identical
	          - 'CONCURRENT' if conflict exists (no causal relationship)
	          """
	          nodes = set(v1.keys()).union(v2.keys())
	          v1_dominates = False
	          v2_dominates = False
	  
	          for node in nodes:
	              t1 = v1.get(node, 0)
	              t2 = v2.get(node, 0)
	              if t1 > t2:
	                  v1_dominates = True
	              elif t1 < t2:
	                  v2_dominates = True
	  
	          if v1_dominates and v2_dominates:
	              return "CONCURRENT"
	          elif v1_dominates:
	              return "GREATER"
	          elif v2_dominates:
	              return "LESS"
	          return "EQUAL"
	  
	  # Example Usage
	  if __name__ == "__main__":
	      nodeA = VectorClock("A")
	      nodeB = VectorClock("B")
	  
	      # Node A does internal work
	      nodeA.tick()
	      
	      # Node A sends message to Node B
	      payload = nodeA.send_event() # payload = {"A": 2}
	      nodeB.receive_event(payload) # B merges payload and ticks local
	  
	      # Create a concurrent state for testing
	      clock1 = {"A": 2, "B": 1} # A's state
	      clock2 = {"A": 1, "B": 3} # B's concurrent state
	  
	      print("Comparison result:", VectorClock.compare(clock1, clock2)) # CONCURRENT
	  ```
	  
	  ```javascript
	  // JS utility to check if vector clock v1 <= v2
	  function isLessOrEqual(v1, v2) {
	      const allNodes = new Set([...Object.keys(v1), ...Object.keys(v2)]);
	      for (const node of allNodes) {
	          const t1 = v1[node] || 0;
	          const t2 = v2[node] || 0;
	          if (t1 > t2) return false;
	      }
	      return true;
	  }
	  
	  function determineCausality(v1, v2) {
	      const le12 = isLessOrEqual(v1, v2);
	      const le21 = isLessOrEqual(v2, v1);
	  
	      if (le12 && le21) return "EQUAL";
	      if (le12 && !le21) return "V1_PRECEDES_V2";
	      if (!le12 && le21) return "V2_PRECEDES_V1";
	      return "CONCURRENT_CONFLICT";
	  }
	  ```
	  
	  :::
-
- # Key Differences & Summary
  collapsed:: true
	- **Lamport Timestamps**: Use a single scalar value. Low space overhead, but cannot distinguish between causal dependency and concurrency.
	- **Vector Clocks**: Use an array/map of size $N$ (number of replica nodes). Higher space overhead ($O(N)$ attached to every write/message), but guarantees complete causal conflict detection.
	- **DynamoDB Vector Clock size**: Systems like Amazon's Dynamo paper trim vector clocks (garbage collect old keys) when the array gets too large, which can occasionally fallback to physical time resolution for edge-cases.
-
- # More Learn
  collapsed:: true
	- [Time, Clocks, and the Ordering of Events in a Distributed System](https://lamport.azurewebsites.net/pubs/time-clocks.pdf) — Leslie Lamport's 1978 breakthrough paper (one of the most cited papers in computer science).
	- [Vector Clocks: An In-depth Introduction](https://www.cs.rutgers.edu/~px/417/notes/clocks/index.html) — Technical guide on logical vector calculations.