---
seoTitle: Conflict-free Replicated Data Types (CRDT) – System Design Guide
description: "A comprehensive guide on CRDTs (Conflict-free Replicated Data Types). Learn about CvRDT vs CmRDT, state/operation propagation, join-semilattices, and Python/JavaScript implementations."
keywords: "crdt, conflict-free replicated data types, cvrdt, cmrdt, replication, distributed systems, replication conflicts, state-based, operation-based, eventual consistency, yjs, automerge, figma, vr-rathod, code-note"
displayTitle: System Design - CRDT
title: System Design CRDT
treeTitle: System Design - Distributed Systems - CRDT
---

> [!info] What is a CRDT?
> A **Conflict-free Replicated Data Type (CRDT)** is a specialized data structure designed for distributed systems. It allows multiple replicas to be updated independently and concurrently without coordination (like locking or central authorization), with a mathematical guarantee that they will eventually converge to the identical state when all updates are propagated.

- # Explanation
	- In distributed databases or collaborative applications (like Google Docs or Figma), multiple users or servers can edit the same data concurrently. Traditional databases use locks or consensus protocols (like Paxos or Raft) to coordinate writes, which introduces high latency and dependency on network connectivity.
	- CRDTs enable **coordination-free eventual consistency** (AP in the CAP theorem). Replicas can accept updates offline and sync asynchronously.
	-
	- ## Real-World Analogy
		- **Git Merge (Automatic)**: Imagine editing a file where Git can resolve all merges automatically without conflicts. CRDTs are data structures pre-designed with merge rules so that conflict resolution is mathematically deterministic and handled entirely by the structure itself.
		- **Collaborative Whiteboard (Figma)**: Users drag shapes around a canvas. Instead of a server locking each shape, each user moves it locally. The movements are broadcast to others, and a CRDT ensures everyone sees the shapes in the same final positions.
-
- # How It Works
  collapsed:: true
	- ## The Two CRDT Approaches
		- There are two primary ways to design and propagate changes in a CRDT:
		-
		- ### 1. State-Based CRDTs (CvRDTs)
			- **Mechanism**: Replicas send their **entire state** to other replicas.
			- **Merge Operator**: Receivers merge their local state with the incoming state using a merge function ($\sqcup$).
			- **Requirements**: The merge operator must form a **Join-Semilattice**.
			- **Network**: Can tolerate message loss, duplication, and out-of-order delivery, since the merge operator is idempotent.
		-
		- ### 2. Operation-Based CRDTs (CmRDTs)
			- **Mechanism**: Replicas send only the **operations** (mutations) to other replicas.
			- **Requirements**: Operations must be commutative to ensure convergence regardless of delivery order.
			- **Network**: Requires a reliable broadcast channel that guarantees **exactly-once** or **at-least-once** causal delivery.
	-
	- ## Mathematical Foundations of CvRDTs
		- For a state-based CRDT (CvRDT) to guarantee convergence, its states must form a **partially ordered set (poset)**, and the merge operator ($\sqcup$, also called "join") must be a **Join-Semilattice**, which satisfies three properties:
		-
		- 1. **Commutativity**: $A \sqcup B = B \sqcup A$
			- The order in which replicas merge states does not affect the final result.
		- 2. **Associativity**: $(A \sqcup B) \sqcup C = A \sqcup (B \sqcup C)$
			- The grouping of merge operations does not affect the final result.
		- 3. **Idempotency**: $A \sqcup A = A$
			- Merging the same state multiple times yields the same result (no double-counting).
	-
	- ## Visual Walkthrough: G-Counter (Grow-Only Counter)
		- A G-Counter is a state-based CRDT where the value can only increase.
		-
		- ### Initial State (3 replicas: A, B, C)
			- ```
			  Replica A: [0, 0, 0] (Value: 0)
			  Replica B: [0, 0, 0] (Value: 0)
			  Replica C: [0, 0, 0] (Value: 0)
			  ```
		-
		- ### Concurrent Increments
			- A increments twice; B increments once.
			- ```
			  Replica A: [2, 0, 0] (Value: 2)
			  Replica B: [0, 1, 0] (Value: 1)
			  Replica C: [0, 0, 0] (Value: 0)
			  ```
		-
		- ### Synchronization (A sends state to B; B sends state to C)
			- Replicas merge states by taking the **element-wise maximum** of their vectors:
			- $$Merge(V_1, V_2) = [\max(V_{1,0}, V_{2,0}), \max(V_{1,1}, V_{2,1}), \dots]$$
			-
			- **B merges A's state**: $[\max(0, 2), \max(1, 0), \max(0, 0)] = [2, 1, 0]$ (Value: 3)
			- **C merges B's state**: $[\max(0, 0), \max(0, 1), \max(0, 0)] = [0, 1, 0]$ (Value: 1)
			-
			- ```
			  Replica A: [2, 0, 0] (Value: 2)
			  Replica B: [2, 1, 0] (Value: 3)
			  Replica C: [0, 1, 0] (Value: 1)
			  ```
		-
		- ### Full Convergence (All replicas sync)
			- ```
			  Replica A: [2, 1, 0] (Value: 3)
			  Replica B: [2, 1, 0] (Value: 3)
			  Replica C: [2, 1, 0] (Value: 3)
			  ```
-
- # Complexity & Trade-offs
  collapsed:: true
	- ## Complexity Table
		- | Operation / Aspect | State-Based (CvRDT) | Operation-Based (CmRDT) |
		  |--------------------|---------------------|--------------------------|
		  | **Local Update** | $O(1)$ | $O(1)$ |
		  | **Merge/Apply** | $O(N)$ (where $N$ is replica count) | $O(1)$ |
		  | **Message Size** | $O(N)$ (entire state size) | $O(1)$ (operation details only) |
		  | **Network Cost** | Higher (bandwidth overhead) | Lower (small payloads) |
		  | **Network Reliability**| Low requirements (works over UDP/Gossip) | High requirements (needs causal order) |
-
- # Implementations
  collapsed:: true
	- :::code-tabs
	  
	  ```python
	  class PNCounter:
	      """
	      Positive-Negative Counter CvRDT implementation.
	      Allows both increments and decrements by maintaining two G-Counters:
	      one for positive additions (P) and one for negative subtractions (N).
	      """
	      def __init__(self, replica_id: str):
	          self.replica_id = replica_id
	          # Dictionary mapping replica_id -> count
	          self.P = {self.replica_id: 0}
	          self.N = {self.replica_id: 0}
	  
	      def increment(self, amount: int = 1):
	          self.P[self.replica_id] += amount
	  
	      def decrement(self, amount: int = 1):
	          self.N[self.replica_id] += amount
	  
	      def value(self) -> int:
	          """Returns the current accumulated count."""
	          return sum(self.P.values()) - sum(self.N.values())
	  
	      def merge(self, other: 'PNCounter'):
	          """
	          Merges another PNCounter's state into this one.
	          Takes the element-wise maximum for both P and N vectors.
	          """
	          # Merge Positive vector
	          all_p_keys = set(self.P.keys()).union(other.P.keys())
	          for key in all_p_keys:
	              self.P[key] = max(self.P.get(key, 0), other.P.get(key, 0))
	  
	          # Merge Negative vector
	          all_n_keys = set(self.N.keys()).union(other.N.keys())
	          for key in all_n_keys:
	              self.N[key] = max(self.N.get(key, 0), other.N.get(key, 0))
	  
	  # Example Usage
	  if __name__ == "__main__":
	      nodeA = PNCounter("A")
	      nodeB = PNCounter("B")
	  
	      nodeA.increment(5)
	      nodeB.increment(3)
	      nodeA.decrement(2)  # Net value A: 3, B: 3
	  
	      # Sync Node A -> Node B
	      nodeB.merge(nodeA)
	      print("Node B Value after sync:", nodeB.value())  # Expected: 6 (5 - 2 from A + 3 from B)
	  ```
	  
	  ```javascript
	  class LWWElementSet {
	      /**
	       * Last-Write-Wins Element Set (LWW-Element-Set) CvRDT.
	       * Maintains an add set and a remove set with timestamps.
	       */
	      constructor() {
	          this.addSet = new Map();    // element -> timestamp
	          this.removeSet = new Map(); // element -> timestamp
	      }
	  
	      add(element, timestamp = Date.now()) {
	          const existing = this.addSet.get(element) || 0;
	          this.addSet.set(element, Math.max(existing, timestamp));
	      }
	  
	      remove(element, timestamp = Date.now()) {
	          const existing = this.removeSet.get(element) || 0;
	          this.removeSet.set(element, Math.max(existing, timestamp));
	      }
	  
	      contains(element) {
	          const addTime = this.addSet.get(element);
	          if (addTime === undefined) return false;
	  
	          const removeTime = this.removeSet.get(element);
	          if (removeTime === undefined) return true;
	  
	          // If added after removed, or added at the same time (bias towards add)
	          return addTime >= removeTime;
	      }
	  
	      merge(other) {
	          // Merge addSet
	          for (const [element, timestamp] of other.addSet.entries()) {
	              const localTime = this.addSet.get(element) || 0;
	              this.addSet.set(element, Math.max(localTime, timestamp));
	          }
	  
	          // Merge removeSet
	          for (const [element, timestamp] of other.removeSet.entries()) {
	              const localTime = this.removeSet.get(element) || 0;
	              this.removeSet.set(element, Math.max(localTime, timestamp));
	          }
	      }
	  }
	  
	  // Example Usage
	  const client1 = new LWWElementSet();
	  const client2 = new LWWElementSet();
	  
	  client1.add("item1", 100);
	  client2.remove("item1", 150); // client2 removes it with later timestamp
	  
	  client1.merge(client2);
	  console.log("Contains item1?", client1.contains("item1")); // false
	  
	  client1.add("item1", 200); // client1 re-adds it later
	  console.log("Contains item1 after re-add?", client1.contains("item1")); // true
	  ```
	  
	  :::
-
- # CRDT vs Operational Transformation (OT)
  collapsed:: true
	- ## Architectural Differences
		- **Operational Transformation (OT)** is another conflict resolution paradigm used extensively in collaborative editors (e.g., Google Docs).
		- Instead of utilizing math in the data structure itself to resolve conflict, OT intercepts concurrent operations and intercepts/modifies their offsets dynamically depending on peer operations.
		-
		- | Feature | Operational Transformation (OT) | CRDT |
		  |---------|---------------------------------|------|
		  | **Topology** | Typically Server-Client (Centralized) | Peer-to-Peer or Server-Client (Decentralized) |
		  | **Offline Support** | Poor (Requires synchronization locks) | Excellent (Offline updates merge natively) |
		  | **Implementation Complexity** | Extremely high (Edge-cases in transform matrices) | Low to Medium (Relies on data structure rules) |
		  | **Memory Overhead** | Low | High (Needs to store tombstones/metadata) |
		  | **Use Cases** | Google Docs, Wave | Figma, Apple Notes, Yjs, Automerge, Redis |
-
- # Real-World Systems Utilizing CRDTs
  collapsed:: true
	- **Figma**: Uses a custom CRDT layout engine to synchronize multiplayer canvas edits.
	- **Redis Enterprise**: Uses CRDTs to provide Active-Active Multi-Master replication databases across geographically separated regions.
	- **Riak KV / Cassandra**: Uses CRDTs for resolving values in multi-master tables under eventual consistency.
	- **Yjs & Automerge**: Popular open-source JavaScript libraries for building offline-first, real-time collaborative text and rich-text editing applications.
-
- # Key Takeaways
  collapsed:: true
	- **Convergence Guarantee**: CRDTs ensure that any two nodes that have received the same set of updates are guaranteed to be in the same state.
	- **Mathematical Rigor**: CvRDT states must be partially ordered, and merging must be associative, commutative, and idempotent to prevent double-counting.
	- **Tombstones**: Removing data in sets or sequences usually requires storing a record of deletion (a "tombstone"), which can cause data structure size to grow indefinitely unless garbage collected.
-
- # More Learn
  collapsed:: true
	- ## Resources & Readings
		- [A comprehensive study of Convergent and Divergent Replicated Data Types](https://inria.hal.science/inria-00555588/document) — The original seminal paper by Marc Shapiro et al.
		- [Designing Data-Intensive Applications – Martin Kleppmann](https://dataintensive.net/) — Chapter 5 discusses replication and CRDT conflict resolution patterns.
		- [Yjs Documentation](https://docs.yjs.dev/) — In-depth look at production-grade text/rich-text CRDTs.
		- [Wikipedia -> CRDT](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)