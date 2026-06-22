---
seoTitle: Distributed Transactions (2PC, 3PC, Saga) – System Design Guide
description: "A comprehensive guide on managing atomic transactions across distributed database nodes and microservices. Covers 2PC, 3PC, and Saga patterns."
keywords: "distributed transactions, 2pc, 3pc, two-phase commit, three-phase commit, saga pattern, microservices transactions, split-brain, coordinator failure, eventual consistency, system design"
displayTitle: System Design - Distributed Transactions
title: System Design Distributed Transactions
treeTitle: System Design - Microservices - Distributed Transactions
---

> [!info] What is a Distributed Transaction?
> A **Distributed Transaction** is a set of operations that updates data across two or more physically separated databases, tables, or microservices, while guaranteeing **Atomicity** and **Consistency** (all databases update successfully, or they all roll back together).

- # The Atomic Commitment Challenge
	- Maintaining ACID properties becomes challenging when transactions span multiple database instances over a network. A single network drop can cause one node to commit while another node fails, leaving the system in an inconsistent state.
-
- # Two-Phase Commit (2PC)
  collapsed:: true
	- Two-Phase Commit (2PC) is a synchronous protocol that uses a central **Coordinator** to negotiate writes across multiple **Participants** (database shards/nodes).
	-
	- ## Phase 1: Prepare (Voting Phase)
		- 1. The Coordinator sends a `Prepare` message to all Participants.
		- 2. Participants execute the transaction locally (write to log, lock resource locks), but do *not* commit.
		- 3. Each Participant responds with a vote: `VOTE_COMMIT` (ready) or `VOTE_ABORT` (error/conflict).
	-
	- ## Phase 2: Commit (Execution Phase)
		- - **If ALL Participants vote `VOTE_COMMIT`**:
			- The Coordinator writes a decision to its log and sends a `Global_Commit` message.
			- Participants commit their local transactions, release locks, and reply `Acknowledge`.
		- - **If ANY Participant votes `VOTE_ABORT` (or times out)**:
			- The Coordinator sends a `Global_Abort` message.
			- Participants roll back local changes and release locks.
	-
	- ## Critical Failure Modes of 2PC
		- **Blocking Protocol**: 2PC is synchronous and blocking. If the Coordinator crashes after participants vote `VOTE_COMMIT` but before sending `Global_Commit`, participants must hold resource locks indefinitely, waiting for the coordinator to recover.
		- **SPOF**: If the coordinator is permanently lost, administrative intervention is required to unlock databases.
-
- # Three-Phase Commit (3PC)
  collapsed:: true
	- Three-Phase Commit (3PC) is a non-blocking refinement of 2PC designed to eliminate the coordinator failure lockup. It inserts a middle phase (`Pre-Commit`) and utilizes timeouts.
	-
	- ## Phase 1: Can-Commit
		- Identical to the 2PC Prepare phase. Coordinator polls participants, participants reply with their capability to write.
	-
	- ## Phase 2: Pre-Commit
		- If everyone voted ready, Coordinator sends a `PreCommit` message.
		- Participants allocate resources, write to local transaction logs, and respond with `Acknowledge`.
		- *Critical Shift*: Participants are now guaranteed that everyone is ready. If a participant times out waiting for Phase 3, it assumes success and commits anyway.
	-
	- ## Phase 3: Do-Commit
		- Coordinator sends `DoCommit` to execute final writes.
	-
	- ## Limitation of 3PC
		- Although non-blocking, 3PC **does not guarantee consistency during network partitions**. If a partition splits the coordinator from some participants during the Pre-Commit state, some nodes may commit while others roll back, causing split-brain inconsistency.
-
- # The Saga Pattern (Eventual Consistency)
  collapsed:: true
	- In microservice architectures, blocking database locks are too expensive. The **Saga Pattern** is an asynchronous, eventual consistency pattern.
	-
	- ## Concept
		- A Saga breaks a global transaction down into a series of **local transactions** ($T_1, T_2, \dots, T_n$). Each local transaction updates its own database.
		- If any local transaction fails (e.g. payment rejected), the Saga triggers a series of **Compensating Transactions** ($C_n, \dots, C_1$) in reverse order to undo the updates.
		-
		- ```
		  Success Path:   [T1: Create Order] -> [T2: Debit Wallet] -> [T3: Ship Item]
		  Failure Path:   [T1: Create Order] -> [T2: Debit Wallet (FAIL)]
		                  [C2: Credit Wallet (Undo T2)] -> [C1: Cancel Order (Undo T1)]
		  ```
	-
	- ## Implementation Patterns
		- - **Choreography**: Event-driven. Services publish events and subscribe to other services' events (decentralized, loose coupling, harder to debug).
		- - **Orchestration**: A central Orchestrator class defines the state machine, tells services what local transaction to run, and triggers compensating commands on failure.
-
- # Comparison Table
  collapsed:: true
	- | Metric | Two-Phase Commit (2PC) | Three-Phase Commit (3PC) | Saga Pattern |
	  |--------|-----------------------|-------------------------|--------------|
	  | **Consistency Model** | Strong Consistency (ACID) | Strong Consistency (ACID) | Eventual Consistency (BASE) |
	  | **Blocking Nature** | Yes (Blocks on coordinator failure) | No (Uses timeouts to unblock) | No (Asynchronous execution) |
	  | **Locking Duration** | High (Locks held during consensus) | High | None (No global database locks) |
	  | **Network Sensitivity**| Vulnerable to drops | Vulnerable to partitions | Resilient (eventual retry) |
	  | **Use Cases** | Distributed SQL (Spanner) | Distributed coordination | E-commerce checkout pipelines |
-
- # Implementation: Orchestrated Saga
  collapsed:: true
	- :::code-tabs
	  
	  ```python
	  import time
	  
	  class OrderService:
	      def create(self) -> bool:
	          print("[T1] Order created successfully.")
	          return True
	      def cancel(self):
	          print("[C1] Order cancelled (compensated).")
	  
	  class PaymentService:
	      def debit(self) -> bool:
	          # Simulate a payment failure
	          print("[T2] Attempting wallet debit... FAILED (Insufficient funds).")
	          return False
	      def credit(self):
	          print("[C2] Refunded payment (compensated).")
	  
	  class SagaOrchestrator:
	      """Manages transaction flow and compensation triggers."""
	      def __init__(self):
	          self.order_service = OrderService()
	          self.payment_service = PaymentService()
	          
	      def execute_checkout_flow(self) -> bool:
	          # Phase 1: Create Order
	          if not self.order_service.create():
	              return False
	          
	          # Phase 2: Debit Payment
	          payment_success = self.payment_service.debit()
	          
	          if not payment_success:
	              print("Saga error encountered. Initiating compensations...")
	              # Rollback in reverse order
	              self.payment_service.credit() # Refund T2 (if T2 had partially run)
	              self.order_service.cancel()   # Cancel T1
	              return False
	              
	          print("Saga completed successfully.")
	          return True
	  
	  if __name__ == "__main__":
	      orchestrator = SagaOrchestrator()
	      orchestrator.execute_checkout_flow()
	  ```
	  
	  ```javascript
	  // Saga Step registry representation
	  class SagaBuilder {
	      constructor() {
	          this.steps = [];
	      }
	      addStep(action, compensate) {
	          this.steps.push({ action, compensate });
	      }
	  }
	  ```
	  
	  :::
-
- # More Learn
  collapsed:: true
	- [Designing Data-Intensive Applications](https://dataintensive.net/) — Chapter 9 covers atomic commitments and distributed transactions in depth.
	- [Sagas – Hector Garcia-Molina (1987)](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf) — The original research paper introducing the Saga pattern.