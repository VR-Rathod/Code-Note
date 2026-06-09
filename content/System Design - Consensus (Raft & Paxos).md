---
seoTitle: Distributed Consensus Algorithms (Paxos, Raft, Zab) – System Design
description: "An in-depth guide to distributed consensus algorithms. Learn Paxos (single-decree, multi-paxos), Raft (leader election, log replication, safety), and Zab protocols."
keywords: "consensus, raft, paxos, zab, distributed systems, leader election, log replication, split brain, distributed consistency, system design"
displayTitle: System Design - Consensus (Raft & Paxos)
---

> [!info] What is Distributed Consensus?
> **Distributed Consensus** is the process by which a set of independent nodes in a network agree on a single data value or a sequence of state changes (a log), even if some nodes fail or the network is partitioned. It is the core building block of reliable distributed key-value stores and coordinator services.

- # Consensus Overview
	- In a distributed system, consensus is required to maintain a consistent state machine across replicated servers. The system must remain available and correct as long as a majority of nodes (a quorum, typically $F = \lfloor N/2 \rfloor + 1$ nodes) are functional.
	-
	- ## Core Consensus Trade-offs
		- | Algorithm | Primary Goal | Leader Model | Common Use Cases |
		  |-----------|--------------|--------------|-------------------|
		  | **Paxos** | Theoretical generality | Symmetric (any node can propose) | Spanner, Chubby, Ceph |
		  | **Raft** | Understandability & simplicity | Strong leader (all changes go through leader) | etcd, Consul, CockroachDB |
		  | **Zab** | Primary-backup log replication | Primary-Backup (ZooKeeper Atomic Broadcast) | Apache ZooKeeper |
-
- # Paxos Protocol
  collapsed:: true
	- Paxos, designed by Leslie Lamport, is the foundational consensus protocol. It is historically split into **Single-Decree Paxos** (agreeing on a single value) and **Multi-Paxos** (agreeing on a stream of values to form a log).
	-
	- ## Node Roles
		- 1. **Proposers**: Advocate for client requests by proposing values to the cluster.
		- 2. **Acceptors**: Form a quorum to vote on proposals. They store state and guarantee agreement safety.
		- 3. **Learners**: Read the agreed-upon value from acceptors (non-voting replication nodes).
	-
	- ## Phase 1: Prepare
		- **Phase 1a (Prepare)**: A Proposer chooses a unique, increasing proposal number $N$ and sends a `Prepare(N)` request to a majority of Acceptors.
		- **Phase 1b (Promise)**: If an Acceptor receives `Prepare(N)` with $N$ larger than any proposal number it has already seen, it responds with a **Promise** never to accept any future proposal numbered less than $N$. It also sends the highest-numbered proposal it has *already* accepted (if any), say $(N_{accepted}, V_{accepted})$.
	-
	- ## Phase 2: Accept
		- **Phase 2a (Accept)**: If the Proposer receives promises from a majority of Acceptors, it must choose a value $V$ to propose.
			- $V$ is set to the value of the highest-numbered proposal returned by Acceptors in Phase 1b.
			- If no Acceptor had previously accepted a value, the Proposer can choose its own value.
			- The Proposer sends an `Accept(N, V)` message to the Acceptors.
		- **Phase 2b (Accepted)**: If an Acceptor receives `Accept(N, V)`, it accepts the proposal $(N, V)$ unless it has already promised (in Phase 1b) to ignore proposals numbered $N$ or higher.
-
- # Raft Protocol
  collapsed:: true
	- Raft decomposes consensus into three independent subproblems: Leader Election, Log Replication, and Safety.
	-
	- ## Node States
		- 1. **Follower**: Passive state. Only responds to RPCs from candidates and leaders.
		- 2. **Candidate**: State entered when follower times out without a heartbeat. Initiates election.
		- 3. **Leader**: Active state. Handles all client writes, replicates logs, and sends heartbeats.
	-
	- ## Subproblem 1: Leader Election
		- Followers expect periodic heartbeats (`AppendEntries` RPC with empty log) from the leader.
		- If a follower's election timer (randomized between `150ms` and `300ms` to avoid split votes) expires, it changes its state to **Candidate**, increments its current term, votes for itself, and sends `RequestVote` RPCs to all other nodes.
		- A candidate wins the election if it receives votes from a majority of nodes for the same term.
	-
	- ## Subproblem 2: Log Replication
		- Once elected, the leader acts as the entry point for all writes.
		-
		- ```mermaid
		  sequenceDiagram
		      participant Client
		      participant Leader
		      participant Follower
		      
		      Client->>Leader: Write request (cmd)
		      Note over Leader: Append cmd to local log (uncommitted)
		      Leader->>Follower: AppendEntries(term, prevLogIndex, prevLogTerm, entries)
		      Follower->>Leader: AppendEntries Success
		      Note over Leader: Quorum reached -> Commit cmd
		      Leader->>Client: Success Response
		      Note over Leader: Heartbeat notifies followers to commit
		  ```
	-
	- ## Subproblem 3: Raft Safety Rules
		- Raft enforces 5 core safety properties to guarantee correct execution:
		-
		- 1. **Election Safety**: At most one leader can be elected per term.
		- 2. **Leader Append-Only**: A leader never overwrites or deletes its own log entries; it only appends new ones.
		- 3. **Log Matching**: If two logs contain an entry with the same index and term, then they are identical in all entries up through the given index.
		- 4. **Leader Completeness**: If a log entry is committed in a given term, that entry will be present in the logs of the leaders for all higher-numbered terms.
			- *Enforced by Election Restriction*: A candidate only wins an election if its log is at least as up-to-date as the voter's log.
		- 5. **State Machine Safety**: If a server has applied a log entry at a given index to its state machine, no other server will ever apply a different log entry for the same index.
-
- # Raft RPC Code representation
  collapsed:: true
	- :::code-tabs
	  
	  ```python
	  from typing import List, Dict, Optional
	  import dataclasses
	  
	  @dataclasses.dataclass
	  class LogEntry:
	      term: int
	      command: str
	  
	  @dataclasses.dataclass
	  class RequestVoteArgs:
	      term: int           # Candidate's term
	      candidate_id: str   # Candidate requesting vote
	      last_log_index: int # Index of candidate's last log entry
	      last_log_term: int  # Term of candidate's last log entry
	  
	  @dataclasses.dataclass
	  class RequestVoteReply:
	      term: int           # Current term of voter, for candidate to update itself
	      vote_granted: bool  # True means candidate received vote
	  
	  @dataclasses.dataclass
	  class AppendEntriesArgs:
	      term: int                  # Leader's term
	      leader_id: str             # Leader ID
	      prev_log_index: int        # Index of log entry immediately preceding new ones
	      prev_log_term: int         # Term of prev_log_index entry
	      entries: List[LogEntry]    # Log entries to store (empty for heartbeat)
	      leader_commit: int         # Leader's commitIndex
	  
	  @dataclasses.dataclass
	  class AppendEntriesReply:
	      term: int                  # Current term of receiver, for leader to update itself
	      success: bool              # True if follower contained entry matching prev_log_index/term
	      match_index: Optional[int] = None # Help leader optimize nextIndex decrement on failure
	  ```
	  
	  ```javascript
	  // Node replica mock class showing local state variables in Raft
	  class RaftNode {
	      constructor(replicaId, peers) {
	          this.replicaId = replicaId;
	          this.peers = peers; // List of peer IDs
	  
	          // Persistent State on all nodes
	          this.currentTerm = 0;
	          this.votedFor = null;
	          this.log = []; // Array of LogEntry objects
	  
	          // Volatile State on all nodes
	          this.commitIndex = 0;
	          this.lastApplied = 0;
	  
	          // Volatile State on Leaders (Reinitialized after election)
	          this.nextIndex = {};  // Peer ID -> next log index to send to that peer
	          this.matchIndex = {}; // Peer ID -> index of highest log entry known to be replicated
	      }
	  }
	  ```
	  
	  :::
-
- # Key Differences & Takeaways
  collapsed:: true
	- **Leader vs. Leaderless**: Raft uses a strong leader role to simplify log indexing and replication, whereas Classic Paxos allows multiple proposers to run concurrently (causing potential "livelocks" where two proposers outbid each other continuously).
	- **Understanding**: Raft was structured explicitly to reduce state transition combinations, making it far easier to implement and reason about compared to Multi-Paxos.
	- **ZooKeeper / Zab**: Zab focuses on primary-backup systems. Unlike Raft, Zab enforces FIFO client order execution via strict transaction ID matching ($zxid$).
-
- # More Learn
  collapsed:: true
	- [In Search of an Understandable Consensus Algorithm](https://raft.github.io/raft.pdf) — The original Raft paper by Diego Ongaro and John Ousterhout.
	- [Raft Interactive Visualization](https://thesecretlivesofdata.com/raft/) — Visual guide to Raft node election and consensus steps.
	- [Paxos Made Simple](https://lamport.azurewebsites.net/pubs/paxos-simple.pdf) — Leslie Lamport's famous attempt to demystify Paxos.
