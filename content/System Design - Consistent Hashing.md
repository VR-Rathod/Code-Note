---
seoTitle: Consistent Hashing Ring Architecture – System Design Guide
description: "An in-depth guide to consistent hashing rings. Learn about range mapping, hot spot mitigation using virtual nodes, and node join/leave logic."
keywords: "consistent hashing, hash ring, virtual nodes, load balancing, sharding, distributed cache, dynamo, cassandra, system design"
displayTitle: System Design - Consistent Hashing
---

> [!info] What is Consistent Hashing?
> **Consistent Hashing** is a hashing technique used to distribute load across a dynamic set of servers (like distributed caches or databases). When a server is added or removed, consistent hashing minimizes key remapping, requiring only $\frac{K}{N}$ keys to be moved (where $K$ is the total number of keys, and $N$ is the number of servers).

- # The Modulo Bottleneck
	- In traditional load-balancing or database sharding, keys are assigned to servers using a simple modulo operation:
	- $$\text{Server} = \text{hash}(\text{key}) \pmod N$$
	- Where $N$ is the number of active servers in the pool.
	-
	- ## Why Modulo Fails at Scale
		- If the cluster scale changes (e.g. a server crashes or a new cache node is added to handle high traffic), $N$ changes to $N+1$ or $N-1$.
		- Under the new modulo formula, **nearly all keys** will resolve to a completely different server index. In a caching tier, this causes a near 100% cache miss rate, triggering a **cache stampede** that can overload back-end databases.
-
- # The Hash Ring Architecture
  collapsed:: true
	- Consistent hashing maps both keys and servers to a circular space called a **Hash Ring**.
	-
	- ## 1. Mapping Servers and Keys
		- - **The Ring Space**: Imagine a circular integer range, typically from $0$ to $2^{32} - 1$ (the output range of a standard 32-bit hash function like MD5 or MurmurHash).
		- - **Server Hashing**: Each server is hashed using its IP address or host name, placing it at a specific coordinate on the ring.
		- - **Key Hashing**: Each data key is hashed using the same function, placing it somewhere on the ring.
	-
	- ## 2. Route Resolution (Clockwise Search)
		- To find which server owns a key, start at the key's coordinate on the ring and travel **clockwise** until you encounter the first server. That server is the owner of the key.
		-
		- ```
		  [Ring: 0 to 2^32]
		      --- Server A (pos: 1000)
		       |
		       +--- Key 1 (pos: 1500) ---> routes to Server B (pos: 3000)
		       |
		      --- Server B (pos: 3000)
		       |
		       +--- Key 2 (pos: 5000) ---> routes to Server A (pos: 1000 - wraps around)
		  ```
	-
	- ## 3. Node Joins and Departures
		- - **Node Crash/Removal**: If Server B crashes, only the keys previously routing to B (those between A and B on the ring) are affected. They now wrap clockwise to Server A. Keys mapped to other servers do not move.
		- - **Node Scale-Up**: If a new Server C is inserted between A and B, only keys sitting between A and C are relocated to C. The rest of the network remains completely unaffected.
-
- # Virtual Nodes (VNodes)
  collapsed:: true
	- Hashing physical servers onto the ring directly has two major flaws:
	- 1. **Uneven Distribution**: Random placement can leave large gaps between servers on the ring, leading to some servers holding 80% of the keys (hot spots) while others remain idle.
	- 2. **Heterogeneity**: It assumes all servers have equal capacity (RAM/CPU).
	-
	- ## The Solution: Virtual Nodes
		- Instead of hashing a physical server once, we create multiple **Virtual Nodes (VNodes)** for each physical machine (e.g. `ServerA-0`, `ServerA-1`, `ServerA-2`) and hash them onto different positions on the ring.
		-
		- - **Balance**: With many VNodes (typically 100 to 250 per physical node), the ring is partitioned into small, interlaced segments, ensuring a highly uniform distribution of keys.
		- - **Capacity Alignment**: Stronger machines can be allocated a higher number of VNodes, drawing a larger portion of the ring's key space.
-
- # Implementation
  collapsed:: true
	- :::code-tabs
	  
	  ```python
	  import hashlib
	  import bisect
	  from typing import List, Dict, Optional
	  
	  class ConsistentHashRing:
	      """
	      Consistent Hash Ring implementation with support for Virtual Nodes.
	      """
	      def __init__(self, replicas: int = 100):
	          self.replicas = replicas # Number of virtual nodes per physical node
	          self.ring: List[int] = [] # Sorted list of virtual node hash keys
	          self.vnode_map: Dict[int, str] = {} # vnode_hash -> physical_node_name
	  
	      def _hash(self, key: str) -> int:
	          """Computes an MD5 integer hash key for the ring."""
	          return int(hashlib.md5(key.encode('utf-8')).hexdigest(), 16)
	  
	      def add_node(self, node: str):
	          """Adds a physical node to the ring using multiple VNode replicas."""
	          for i in range(self.replicas):
	              vnode_key = f"{node}-vnode-{i}"
	              vnode_hash = self._hash(vnode_key)
	              
	              # Insert hash in sorted order using binary search (bisect)
	              idx = bisect.bisect_left(self.ring, vnode_hash)
	              self.ring.insert(idx, vnode_hash)
	              self.vnode_map[vnode_hash] = node
	  
	      def remove_node(self, node: str):
	          """Removes all virtual node listings for a physical node."""
	          for i in range(self.replicas):
	              vnode_key = f"{node}-vnode-{i}"
	              vnode_hash = self._hash(vnode_key)
	              
	              # Locate and delete from ring and mapping dictionary
	              try:
	                  self.ring.remove(vnode_hash)
	                  del self.vnode_map[vnode_hash]
	              except ValueError:
	                  pass
	  
	      def get_node(self, key: str) -> Optional[str]:
	          """
	          Returns the closest physical node clockwise from the key's hash.
	          """
	          if not self.ring:
	              return None
	              
	          key_hash = self._hash(key)
	          
	          # Binary search for the first VNode hash >= key_hash
	          idx = bisect.bisect_right(self.ring, key_hash)
	          
	          # Wrap around to the start of the ring if key_hash is larger than all VNodes
	          if idx == len(self.ring):
	              idx = 0
	              
	          vnode_hash = self.ring[idx]
	          return self.vnode_map[vnode_hash]
	  
	  # Example Usage
	  if __name__ == "__main__":
	      ring = ConsistentHashRing(replicas=3) # Small replica count for demonstration
	      
	      ring.add_node("Server_A")
	      ring.add_node("Server_B")
	      ring.add_node("Server_C")
	      
	      # Map database keys
	      keys = ["user_102", "session_982", "auth_token_381", "user_901"]
	      for k in keys:
	          print(f"Key '{k}' routes to: {ring.get_node(k)}")
	          
	      print("\nRemoving Server_B...")
	      ring.remove_node("Server_B")
	      
	      for k in keys:
	          print(f"Key '{k}' now routes to: {ring.get_node(k)}")
	  ```
	  
	  ```javascript
	  // JS MD5 hashing helper mock showing similar structure
	  class MockRingJS {
	      constructor() {
	          this.ring = []; // sorted array
	          this.nodeMap = new Map();
	      }
	      getNode(keyHash) {
	          // Find first entry >= keyHash
	          for (let i = 0; i < this.ring.length; i++) {
	              if (this.ring[i] >= keyHash) {
	                  return this.nodeMap.get(this.ring[i]);
	              }
	          }
	          // Wrap around fallback
	          return this.nodeMap.get(this.ring[0]);
	      }
	  }
	  ```
	  
	  :::
-
- # Production Implementations
  collapsed:: true
	- **Amazon Dynamo**: The pioneer of VNode consistent hashing for highly-available distributed databases.
	- **Apache Cassandra**: Uses consistent hashing rings (Murmur3Partitioner) to distribute rows across partition nodes.
	- **Discord & CDNs**: Uses consistent hashing for routing clients to websocket gateways and edge-cache servers without dropping ongoing sessions.
-
- # More Learn
  collapsed:: true
	- [Consistent Hashing and Random Trees](https://www.cs.princeton.edu/courses/archive/fall09/cos518/papers/chash.pdf) — Seminal paper by Karger et al. (MIT).
	- [Dynamo: Amazon’s Highly Available Key-value Store](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf) — SOSP 2007 paper showcasing hash ring applications.
