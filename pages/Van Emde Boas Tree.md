---
seoTitle: Van Emde Boas Tree Guide – O(log log U) Integer Operations
description: "A comprehensive reference on Van Emde Boas Trees (vEB). Covers recursive universe size splitting, predecessor/successor queries, insertion, deletion, and complexity."
keywords: "van emde boas tree, vEB tree, O(log log U), integer priority queue, successor query, predecessor query, universe size, data structures, VR-Rathod, Code-Note, code note vr, vr book"
treeTitle: DSA - Trees - Van Emde Boas Tree
---

> [!info] What is a Van Emde Boas Tree?
> A **Van Emde Boas Tree** (vEB tree) is an associative array data structure for keys of size $U$ (universe size, which must be a power of 2: $U = 2^{2^k}$).
> It supports search, insert, delete, minimum, maximum, predecessor, and successor queries in $O(\log \log U)$ time.
> Unlike standard trees where runtime depends on the number of elements $N$, a vEB tree's runtime depends only on the size of the key universe $U$.

- # Explanation
	- A **Van Emde Boas Tree** achieves $O(\log \log U)$ runtimes by recursively splitting the universe $U$ into a summary tree and clusters of size $\sqrt{U}$.
	-
	- ## Real-World Analogy
		- **Multi-tier Cargo Tracking**: Imagine sorting cargo numbered $0$ to $9999$ across a warehouse with 100 containers (each holding 100 items). Rather than doing binary search across all 10000 items, you check a high-level summary listing which of the 100 containers are not empty. If container #3 is the first active container, you instantly jump to container #3 and search within it. By splitting the coordinate query into high-level groups and low-level group offsets recursively, you find items in steps proportional to the length of the coordinate's bits, not the total number of items.
	-
	- ## Why Van Emde Boas Tree?
		- For a 64-bit integer universe, a standard self-balancing BST (like AVL or Red-Black) requires $O(\log N)$ comparisons, up to 64 checks.
		- A vEB Tree needs at most $O(\log \log 2^{64}) = O(\log 64) = 6$ operations to perform insertions, deletions, and successor/predecessor queries.
-
- # How It Works
  collapsed:: true
	- ## Core Mechanics
		- Let $U$ be the universe size. A vEB tree partitions a key $x$ into:
			- $\text{high}(x) = \lfloor x / \sqrt{U} \rfloor$: The index of the cluster containing $x$.
			- $\text{low}(x) = x \bmod \sqrt{U}$: The local index of $x$ within its cluster.
			- $\text{index}(h, l) = h \sqrt{U} + l$: Computes the global value from a cluster index and offset.
		-
		- ### Node Structure
			- A vEB tree node contains:
				- `min`: Stores the minimum value in the tree.
				- `max`: Stores the maximum value in the tree.
				- `summary`: A pointer to a smaller vEB tree of size $\sqrt{U}$ that tracks which clusters are non-empty.
				- `cluster`: An array of size $\sqrt{U}$ containing pointers to smaller vEB trees of size $\sqrt{U}$.
			- > [!important] The Minimum Element Optimization
			  > The minimum element `min` is **not** recursively stored in the clusters. It is kept only in the parent node. This optimization ensures that checking for the existence of elements or base cases takes $O(1)$ time, keeping the overall recursion depth bounded by $O(\log \log U)$.
	-
	- ## Step-by-Step Operations
		- ### Successor Query: `successor(x)`
			- 1. If $x < \text{min}$, return `min` (since it's the absolute minimum).
			- 2. Look inside the cluster of $x$, namely $c = \text{high}(x)$. If $x$'s local offset $\text{low}(x)$ is less than the maximum element of cluster $c$, search for the successor recursively inside cluster $c$.
			- 3. Otherwise, search the `summary` to find the next active cluster index $s$ after $c$.
			- 4. If $s$ exists, the successor is the minimum element of cluster $s$.
			- 5. If no active cluster exists, return `None`.
	-
	- ## Visual Walkthrough
		- ### Split Universe for $U=16$ (Clusters and Summary of size $\sqrt{16} = 4$):
			- ```
			  +----------------------------------------+
			  |                 vEB (16)               |
			  |  min: 2                         max: 14 |
			  |                                        |
			  |  +--------------+                      |
			  |  | Summary (4)  |                      |
			  |  | min: 0       |                      |
			  |  | max: 3       |                      |
			  |  +--------------+                      |
			  |                                        |
			  |  Clusters:                             |
			  |  +--------+ +--------+ +--------+      |
			  |  |  C[0]  | |  C[1]  | |  C[3]  |      |
			  |  | (size4)| | (size4)| | (size4)|      |
			  |  | min: 3 | | min: 1 | | min: 2 |      |
			  |  | max: 3 | | max: 1 | | max: 2 |      |
			  |  +--------+ +--------+ +--------+      |
			  +----------------------------------------+
			  ```
			  *Note: The absolute minimum `2` is not stored in cluster C[0]. C[0] contains `3` (offset 3 of cluster 0). C[1] contains `5` (offset 1 of cluster 1). C[3] contains `14` (offset 2 of cluster 3).*
-
- # Time & Space Complexity
  collapsed:: true
	- | Operation | Average & Worst Case | Notes |
	  |---|---|---|
	  | **Search / Member** | $O(\log \log U)$ | Runs in time proportional to binary search on key bit-length |
	  | **Insertion** | $O(\log \log U)$ | Only recursive call is made to cluster or summary, never both |
	  | **Deletion** | $O(\log \log U)$ | Requires cleaning up summary if cluster becomes empty |
	  | **Successor/Predecessor**| $O(\log \log U)$ | Fast range bounds queries |
	  | **Space Complexity** | $O(U)$ | Memory consumption is independent of count $N$. Can be improved to $O(N)$ using hash tables for clusters. |
-
- # Implementation
  collapsed:: true
	- :::code-tabs
	  
	  ```python
	  import math
	  
	  class VEB:
	      def __init__(self, u):
	          # u must be a power of 2 (e.g., 2, 4, 16, 256, 65536)
	          self.u = u
	          self.min = None
	          self.max = None
	  
	          if u > 2:
	              # Compute upper and lower square roots:
	              # u_high = 2^(ceil(lg(u)/2))
	              # u_low  = 2^(floor(lg(u)/2))
	              lg_u = math.log2(u)
	              self.u_high = 2 ** math.ceil(lg_u / 2)
	              self.u_low = 2 ** math.floor(lg_u / 2)
	  
	              self.summary = None
	              self.cluster = [None] * self.u_high
	          else:
	              self.u_high = 0
	              self.u_low = 0
	              self.summary = None
	              self.cluster = []
	  
	      def high(self, x):
	          return x // self.u_low
	  
	      def low(self, x):
	          return x % self.u_low
	  
	      def index(self, h, l):
	          return h * self.u_low + l
	  
	      def insert(self, x):
	          """Inserts a key x into the vEB tree."""
	          if self.min is None:
	              self.min = x
	              self.max = x
	              return
	  
	          if x == self.min or x == self.max:
	              return # Already exists
	  
	          # If x is smaller than min, swap so min holds the absolute minimum
	          if x < self.min:
	              x, self.min = self.min, x
	  
	          if self.u > 2:
	              h = self.high(x)
	              l = self.low(x)
	  
	              if self.cluster[h] is None:
	                  self.cluster[h] = VEB(self.u_low)
	              
	              if self.summary is None:
	                  self.summary = VEB(self.u_high)
	  
	              # If the cluster is empty, insert index h in summary and base insert l in cluster
	              if self.cluster[h].min is None:
	                  self.summary.insert(h)
	                  self.cluster[h].insert(l)
	              else:
	                  self.cluster[h].insert(l)
	  
	          if x > self.max:
	              self.max = x
	  
	      def successor(self, x):
	          """Returns the smallest element strictly greater than x, or None."""
	          if self.u == 2:
	              if x == 0 and self.max == 1:
	                  return 1
	              return None
	  
	          if self.min is not None and x < self.min:
	              return self.min
	  
	          h = self.high(x)
	          l = self.low(x)
	  
	          max_in_curr_cluster = self.cluster[h].max if self.cluster[h] is not None else None
	          if max_in_curr_cluster is not None and l < max_in_curr_cluster:
	              offset = self.cluster[h].successor(l)
	              return self.index(h, offset)
	          else:
	              succ_cluster = self.summary.successor(h) if self.summary is not None else None
	              if succ_cluster is None:
	                  return None
	              offset = self.cluster[succ_cluster].min
	              return self.index(succ_cluster, offset)
	  
	      def predecessor(self, x):
	          """Returns the largest element strictly smaller than x, or None."""
	          if self.u == 2:
	              if x == 1 and self.min == 0:
	                  return 0
	              return None
	  
	          if self.max is not None and x > self.max:
	              return self.max
	  
	          h = self.high(x)
	          l = self.low(x)
	  
	          min_in_curr_cluster = self.cluster[h].min if self.cluster[h] is not None else None
	          if min_in_curr_cluster is not None and l > min_in_curr_cluster:
	              offset = self.cluster[h].predecessor(l)
	              return self.index(h, offset)
	          else:
	              pred_cluster = self.summary.predecessor(h) if self.summary is not None else None
	              if pred_cluster is None:
	                  if self.min is not None and x > self.min:
	                      return self.min
	                  return None
	              offset = self.cluster[pred_cluster].max
	              return self.index(pred_cluster, offset)
	  
	      def delete(self, x):
	          """Deletes a key x from the vEB tree."""
	          if self.min == self.max:
	              if self.min == x:
	                  self.min = None
	                  self.max = None
	              return
	  
	          if self.u == 2:
	              if x == 0:
	                  self.min = 1
	              else:
	                  self.min = 0
	              self.max = self.min
	              return
	  
	          if x == self.min:
	              # Find new minimum
	              first_cluster = self.summary.min
	              x = self.index(first_cluster, self.cluster[first_cluster].min)
	              self.min = x
	  
	          h = self.high(x)
	          l = self.low(x)
	  
	          if self.cluster[h] is not None:
	              self.cluster[h].delete(l)
	  
	              if self.cluster[h].min is None:
	                  self.summary.delete(h)
	                  
	                  if x == self.max:
	                      summary_max = self.summary.max
	                      if summary_max is None:
	                          self.max = self.min
	                      else:
	                          self.max = self.index(summary_max, self.cluster[summary_max].max)
	              elif x == self.max:
	                  self.max = self.index(h, self.cluster[h].max)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <cmath>
	  #include <algorithm>
	  
	  class VEB {
	  private:
	      int u;
	      int min_val;
	      int max_val;
	      int u_high;
	      int u_low;
	      VEB* summary;
	      std::vector<VEB*> cluster;
	  
	      int high(int x) const { return x / u_low; }
	      int low(int x) const { return x % u_low; }
	      int index(int h, int l) const { return h * u_low + l; }
	  
	  public:
	      VEB(int universe_size) : u(universe_size), min_val(-1), max_val(-1), summary(nullptr) {
	          if (u > 2) {
	              double lg_u = std::log2(u);
	              u_high = static_cast<int>(std::pow(2, std::ceil(lg_u / 2.0)));
	              u_low = static_cast<int>(std::pow(2, std::floor(lg_u / 2.0)));
	              cluster.assign(u_high, nullptr);
	          } else {
	              u_high = 0;
	              u_low = 0;
	          }
	      }
	  
	      ~VEB() {
	          delete summary;
	          for (auto* c : cluster) {
	              delete c;
	          }
	      }
	  
	      int getMin() const { return min_val; }
	      int getMax() const { return max_val; }
	  
	      void insert(int x) {
	          if (min_val == -1) {
	              min_val = x;
	              max_val = x;
	              return;
	          }
	  
	          if (x == min_val || x == max_val) return;
	  
	          if (x < min_val) {
	              std::swap(x, min_val);
	          }
	  
	          if (u > 2) {
	              int h = high(x);
	              int l = low(x);
	  
	              if (cluster[h] == nullptr) {
	                  cluster[h] = new VEB(u_low);
	              }
	              if (summary == nullptr) {
	                  summary = new VEB(u_high);
	              }
	  
	              if (cluster[h]->getMin() == -1) {
	                  summary->insert(h);
	                  cluster[h]->insert(l);
	              } else {
	                  cluster[h]->insert(l);
	              }
	          }
	  
	          if (x > max_val) {
	              max_val = x;
	          }
	      }
	  
	      int successor(int x) const {
	          if (u == 2) {
	              if (x == 0 && max_val == 1) return 1;
	              return -1;
	          }
	  
	          if (min_val != -1 && x < min_val) return min_val;
	  
	          int h = high(x);
	          int l = low(x);
	  
	          int max_in_curr_cluster = (cluster[h] != nullptr) ? cluster[h]->getMax() : -1;
	          if (max_in_curr_cluster != -1 && l < max_in_curr_cluster) {
	              int offset = cluster[h]->successor(l);
	              return index(h, offset);
	          } else {
	              int succ_cluster = (summary != nullptr) ? summary->successor(h) : -1;
	              if (succ_cluster == -1) return -1;
	              int offset = cluster[succ_cluster]->getMin();
	              return index(succ_cluster, offset);
	          }
	      }
	  
	      int predecessor(int x) const {
	          if (u == 2) {
	              if (x == 1 && min_val == 0) return 0;
	              return -1;
	          }
	  
	          if (max_val != -1 && x > max_val) return max_val;
	  
	          int h = high(x);
	          int l = low(x);
	  
	          int min_in_curr_cluster = (cluster[h] != nullptr) ? cluster[h]->getMin() : -1;
	          if (min_in_curr_cluster != -1 && l > min_in_curr_cluster) {
	              int offset = cluster[h]->predecessor(l);
	              return index(h, offset);
	          } else {
	              int pred_cluster = (summary != nullptr) ? summary->predecessor(h) : -1;
	              if (pred_cluster == -1) {
	                  if (min_val != -1 && x > min_val) return min_val;
	                  return -1;
	              }
	              int offset = cluster[pred_cluster]->getMax();
	              return index(pred_cluster, offset);
	          }
	      }
	  
	      void remove(int x) {
	          if (min_val == max_val) {
	              if (min_val == x) {
	                  min_val = -1;
	                  max_val = -1;
	              }
	              return;
	          }
	  
	          if (u == 2) {
	              if (x == 0) {
	                  min_val = 1;
	              } else {
	                  min_val = 0;
	              }
	              max_val = min_val;
	              return;
	          }
	  
	          if (x == min_val) {
	              int first_cluster = summary->getMin();
	              x = index(first_cluster, cluster[first_cluster]->getMin());
	              min_val = x;
	          }
	  
	          int h = high(x);
	          int l = low(x);
	  
	          if (cluster[h] != nullptr) {
	              cluster[h]->remove(l);
	  
	              if (cluster[h]->getMin() == -1) {
	                  summary->remove(h);
	  
	                  if (x == max_val) {
	                      int summary_max = summary->getMax();
	                      if (summary_max == -1) {
	                          max_val = min_val;
	                      } else {
	                          max_val = index(summary_max, cluster[summary_max]->getMax());
	                      }
	                  }
	              } else if (x == max_val) {
	                  max_val = index(h, cluster[h]->getMax());
	              }
	          }
	      }
	  };
	  ```
	  
	  :::
-
- # When to Use
  collapsed:: true
	- ## ✅ Use Van Emde Boas Tree When:
		- You are indexing a bounded, dense integer universe of keys (e.g. 16-bit or 32-bit network IP addresses, router table routing indices).
		- You need exceptionally fast successor and predecessor queries that outperform $O(\log N)$ tree structures.
		- You need high-performance priority queues where keys are integers within a fixed range.
	- ## Avoid When:
		- The universe size $U$ is extremely large (e.g., arbitrary 64-bit keys) and keys are highly sparse, as the $O(U)$ spatial complexity of standard vEB trees will lead to high memory consumption.
		- Keys are non-integer types (e.g. strings or custom structures).
-
- # Variations & Related Concepts
	- **Randomized van Emde Boas Tree**: Uses hash tables instead of linear arrays for cluster pointers, reducing overall spatial requirement to $O(N)$ while keeping average operation runtimes at $O(\log \log U)$.
	- **Y-Fast Trie / X-Fast Trie**: Data structures that also support $O(\log \log U)$ search and range queries with $O(N)$ memory.
-
- # Key Takeaways
  collapsed:: true
	- A vEB Tree supports priority queue and successor/predecessor operations in $O(\log \log U)$ time.
	- The runtime depends strictly on the size of the key universe $U$, rather than the number of active elements $N$.
	- It recursively splits the universe into a summary tree and clusters of size $\sqrt{U}$.
	- The `min` element optimization is critical, preventing it from being stored recursively in sub-clusters and ensuring the $O(1)$ short-circuit complexity.
	- Memory cleanup must recursively deallocate the summary and clusters to avoid memory leaks.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Wikipedia -> Van Emde Boas tree](https://en.wikipedia.org/wiki/Van_Emde_Boas_tree)
		- [GeeksforGeeks -> Van Emde Boas Tree](https://www.geeksforgeeks.org/van-emde-boas-tree-set-1-basics-and-construction/)