---
seoTitle: Segment Tree – Range Queries & Lazy Propagation Guide
description: "Master Segment Trees in DSA. Learn to build segment trees for range sum/minimum queries, implement point updates, and optimize with Lazy Propagation."
keywords: "Segment Tree, Range Query, Lazy Propagation, Range Sum Query, Point Update, Segment Tree C++, Segment Tree Java, Segment Tree Python, DSA, Segment Tree"
displayTitle: Segment Tree
treeTitle: DSA - Trees - Segment Tree
---

> [!info] What is a Segment Tree?
> A **Segment Tree** is a binary tree data structure used for storing information about intervals or segments. It allows answering **range queries** (e.g., sum, minimum, or maximum of a subarray) and performing **updates** (both point updates and range updates) efficiently in logarithmic $O(\log n)$ time.

- # Explanation
  collapsed:: true
	- ## The Range Query Problem
	  collapsed:: true
		- Suppose you have an array of size $N$ and need to perform two operations:
		  1. **Query**: Find the sum of elements from index $L$ to $R$.
		  2. **Update**: Change the value of the element at index $i$.
		-
		- Comparing different approaches:
			- **Brute Force**: Query takes $O(N)$ (scanning the range), Update takes $O(1)$. If we do $Q$ queries, total cost is $O(Q \cdot N)$, which is too slow.
			- **Prefix Sum**: Query takes $O(1)$ (using `prefix[R] - prefix[L-1]`), but Update takes $O(N)$ (recalculating the prefix sums).
			- **Segment Tree**: Both Query and Update take **$O(\log N)$** time. This is optimal when both operations occur frequently.
	-
	- ## Structure of a Segment Tree
	  collapsed:: true
		- For an array of size $N$, the root represents the entire range `[0, N-1]`.
		- If a node represents range `[L, R]`, and $L \neq R$:
			- Its left child represents `[L, mid]` where $mid = \lfloor\frac{L+R}{2}\rfloor$.
			- Its right child represents `[mid+1, R]`.
		- Leaf nodes represent single elements of the array `[i, i]`.
		-
		- Storing array `[1, 3, 5, 7]` in a Range Sum Segment Tree:
		  ```
		              [0, 3] (Sum: 16)
		             /      \
		      [0, 1] (Sum: 4)  [2, 3] (Sum: 12)
		      /      \          /      \
		  [0,0](1)  [1,1](3)  [2,2](5)  [3,3](7)
		  ```
		-
		- ```mermaid
		  graph TD
		      Node0["[0, 3]<br/>Sum: 16"] --> Node1["[0, 1]<br/>Sum: 4"]
		      Node0 --> Node2["[2, 3]<br/>Sum: 12"]
		      Node1 --> Node3["[0, 0]<br/>Val: 1"]
		      Node1 --> Node4["[1, 1]<br/>Val: 3"]
		      Node2 --> Node5["[2, 2]<br/>Val: 5"]
		      Node2 --> Node6["[3, 3]<br/>Val: 7"]
		      
		      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		  ```
- # Core Operations
  collapsed:: true
	- ## 1. Build ($O(N)$ time)
	  collapsed:: true
		- Construct the tree recursively from the bottom up. We start by dividing the range until we hit leaf nodes, then compute parents as the sum of their left and right children.
	-
	- ## 2. Range Query ($O(\log N)$ time)
	  collapsed:: true
		- To query a range `[QL, QR]`, we traverse the tree. At each node representing `[L, R]`, there are three cases:
			- **No Overlap**: The query range is completely outside the node's range. Return a neutral value (e.g. `0` for sums, `infinity` for minimums).
			- **Complete Overlap**: The node's range `[L, R]` is completely within the query range `[QL, QR]`. Return the value stored in the node.
			- **Partial Overlap**: Part of `[L, R]` lies inside and part outside `[QL, QR]`. Query both children recursively and merge the results.
	-
	- ## 3. Point Update ($O(\log N)$ time)
	  collapsed:: true
		- Follow the path from the root to the leaf node corresponding to the index to update, modify the leaf node, and then backtrack to update the values of all ancestors along that path.
	-
	- ## 4. Lazy Propagation ($O(\log N)$ range update)
	  collapsed:: true
		- Normally, range updates (updating all elements in `[L, R]`) would take $O(N \log N)$ time.
		- **Lazy Propagation** optimizes this to $O(\log N)$ by deferring updates to descendants. When we update a range, we modify the relevant ancestors and store the update details in a separate `lazy[]` array. We only pass this update down to the children when we actually visit those children in a future query or update operation.
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Space Considerations
	  > For an array of size $N$, the Segment Tree can contain up to $2^{\lceil \log_2 N \rceil + 1} - 1 < 4N$ nodes. Thus, we allocate an array of size $4N$ to represent the tree.
	  > Read more about binary tree array sizes in [[Complexity Analysis]].
	-
	- | Operation | Time Complexity | Space Complexity |
	  |-----------|-----------------|------------------|
	  | **Build** | $O(N)$ | $O(N)$ |
	  | **Range Query** | $O(\log N)$ | $O(\log N)$ auxiliary recursive stack space |
	  | **Point Update** | $O(\log N)$ | $O(1)$ iterative / $O(\log N)$ recursive stack |
	  | **Range Update (Lazy)** | $O(\log N)$ | $O(N)$ extra space for the lazy array |
- # Implementation
  collapsed:: true
	- > [!note] Segment Tree for Range Sum Queries
	  > Below is a standard recursive implementation of a Range Sum Segment Tree supporting point updates.
	-
	- :::code-tabs
	  
	  ```python
	  class SegmentTree:
	      def __init__(self, arr):
	          self.n = len(arr)
	          self.tree = [0] * (4 * self.n)
	          if self.n > 0:
	              self._build(arr, 0, 0, self.n - 1)
	  
	      def _build(self, arr, tree_idx, L, R):
	          if L == R:
	              self.tree[tree_idx] = arr[L]
	              return
	          mid = (L + R) // 2
	          self._build(arr, 2 * tree_idx + 1, L, mid)
	          self._build(arr, 2 * tree_idx + 2, mid + 1, R)
	          self.tree[tree_idx] = self.tree[2 * tree_idx + 1] + self.tree[2 * tree_idx + 2]
	  
	      def query(self, QL, QR):
	          return self._query(0, 0, self.n - 1, QL, QR)
	  
	      def _query(self, tree_idx, L, R, QL, QR):
	          if QL <= L and R <= QR: # Complete Overlap
	              return self.tree[tree_idx]
	          if R < QL or L > QR:     # No Overlap
	              return 0
	          # Partial Overlap
	          mid = (L + R) // 2
	          left_sum = self._query(2 * tree_idx + 1, L, mid, QL, QR)
	          right_sum = self._query(2 * tree_idx + 2, mid + 1, R, QL, QR)
	          return left_sum + right_sum
	  
	      def update(self, idx, val):
	          self._update(0, 0, self.n - 1, idx, val)
	  
	      def _update(self, tree_idx, L, R, idx, val):
	          if L == R:
	              self.tree[tree_idx] = val
	              return
	          mid = (L + R) // 2
	          if idx <= mid:
	              self._update(2 * tree_idx + 1, L, mid, idx, val)
	          else:
	              self._update(2 * tree_idx + 2, mid + 1, R, idx, val)
	          self.tree[tree_idx] = self.tree[2 * tree_idx + 1] + self.tree[2 * tree_idx + 2]
	  
	  # Example Usage
	  arr = [1, 3, 5, 7]
	  seg_tree = SegmentTree(arr)
	  print("Sum of range [1, 3]:", seg_tree.query(1, 3)) # Output: 15 (3 + 5 + 7)
	  seg_tree.update(1, 10)                             # Update arr[1] to 10
	  print("Sum of range [1, 3]:", seg_tree.query(1, 3)) # Output: 22 (10 + 5 + 7)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  
	  class SegmentTree {
	  private:
	      int n;
	      std::vector<int> tree;
	  
	      void build(const std::vector<int>& arr, int treeIdx, int L, int R) {
	          if (L == R) {
	              tree[treeIdx] = arr[L];
	              return;
	          }
	          int mid = L + (R - L) / 2;
	          build(arr, 2 * treeIdx + 1, L, mid);
	          build(arr, 2 * treeIdx + 2, mid + 1, R);
	          tree[treeIdx] = tree[2 * treeIdx + 1] + tree[2 * treeIdx + 2];
	      }
	  
	      int query(int treeIdx, int L, int R, int QL, int QR) {
	          if (QL <= L && R <= QR) return tree[treeIdx];
	          if (R < QL || L > QR) return 0;
	          int mid = L + (R - L) / 2;
	          return query(2 * treeIdx + 1, L, mid, QL, QR) +
	                 query(2 * treeIdx + 2, mid + 1, R, QL, QR);
	      }
	  
	      void update(int treeIdx, int L, int R, int idx, int val) {
	          if (L == R) {
	              tree[treeIdx] = val;
	              return;
	          }
	          int mid = L + (R - L) / 2;
	          if (idx <= mid) update(2 * treeIdx + 1, L, mid, idx, val);
	          else update(2 * treeIdx + 2, mid + 1, R, idx, val);
	          tree[treeIdx] = tree[2 * treeIdx + 1] + tree[2 * treeIdx + 2];
	      }
	  
	  public:
	      SegmentTree(const std::vector<int>& arr) {
	          n = arr.size();
	          tree.assign(4 * n, 0);
	          if (n > 0) build(arr, 0, 0, n - 1);
	      }
	  
	      int query(int L, int R) { return query(0, 0, n - 1, L, R); }
	      void update(int idx, int val) { update(0, 0, n - 1, idx, val); }
	  };
	  
	  int main() {
	      std::vector<int> arr = {1, 3, 5, 7};
	      SegmentTree st(arr);
	      std::cout << "Sum [1, 3]: " << st.query(1, 3) << "\n"; // Output: 15
	      st.update(1, 10);
	      std::cout << "Sum [1, 3]: " << st.query(1, 3) << "\n"; // Output: 22
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class SegmentTree {
	      constructor(arr) {
	          this.n = arr.length;
	          this.tree = new Array(4 * this.n).fill(0);
	          if (this.n > 0) this.build(arr, 0, 0, this.n - 1);
	      }
	  
	      build(arr, treeIdx, L, R) {
	          if (L === R) {
	              this.tree[treeIdx] = arr[L];
	              return;
	          }
	          const mid = Math.floor((L + R) / 2);
	          this.build(arr, 2 * treeIdx + 1, L, mid);
	          this.build(arr, 2 * treeIdx + 2, mid + 1, R);
	          this.tree[treeIdx] = this.tree[2 * treeIdx + 1] + this.tree[2 * treeIdx + 2];
	      }
	  
	      query(QL, QR) {
	          return this._query(0, 0, this.n - 1, QL, QR);
	      }
	  
	      _query(treeIdx, L, R, QL, QR) {
	          if (QL <= L && R <= QR) return this.tree[treeIdx];
	          if (R < QL || L > QR) return 0;
	          const mid = Math.floor((L + R) / 2);
	          return this._query(2 * treeIdx + 1, L, mid, QL, QR) +
	                 this._query(2 * treeIdx + 2, mid + 1, R, QL, QR);
	      }
	  
	      update(idx, val) {
	          this._update(0, 0, this.n - 1, idx, val);
	      }
	  
	      _update(treeIdx, L, R, idx, val) {
	          if (L === R) {
	              this.tree[treeIdx] = val;
	              return;
	          }
	          const mid = Math.floor((L + R) / 2);
	          if (idx <= mid) this._update(2 * treeIdx + 1, L, mid, idx, val);
	          else this._update(2 * treeIdx + 2, mid + 1, R, idx, val);
	          this.tree[treeIdx] = this.tree[2 * treeIdx + 1] + this.tree[2 * treeIdx + 2];
	      }
	  }
	  ```
	  
	  ```java
	  public class SegmentTree {
	      private int[] tree;
	      private int n;
	  
	      public SegmentTree(int[] arr) {
	          this.n = arr.length;
	          this.tree = new int[4 * n];
	          if (n > 0) build(arr, 0, 0, n - 1);
	      }
	  
	      private void build(int[] arr, int treeIdx, int L, int R) {
	          if (L == R) {
	              tree[treeIdx] = arr[L];
	              return;
	          }
	          int mid = L + (R - L) / 2;
	          build(arr, 2 * treeIdx + 1, L, mid);
	          build(arr, 2 * treeIdx + 2, mid + 1, R);
	          tree[treeIdx] = tree[2 * treeIdx + 1] + tree[2 * treeIdx + 2];
	      }
	  
	      public int query(int QL, int QR) {
	          return query(0, 0, n - 1, QL, QR);
	      }
	  
	      private int query(int treeIdx, int L, int R, int QL, int QR) {
	          if (QL <= L && R <= QR) return tree[treeIdx];
	          if (R < QL || L > QR) return 0;
	          int mid = L + (R - L) / 2;
	          return query(2 * treeIdx + 1, L, mid, QL, QR) +
	                 query(2 * treeIdx + 2, mid + 1, R, QL, QR);
	      }
	  
	      public void update(int idx, int val) {
	          update(0, 0, n - 1, idx, val);
	      }
	  
	      private void update(int treeIdx, int L, int R, int idx, int val) {
	          if (L == R) {
	              tree[treeIdx] = val;
	              return;
	          }
	          int mid = L + (R - L) / 2;
	          if (idx <= mid) update(2 * treeIdx + 1, L, mid, idx, val);
	          else update(2 * treeIdx + 2, mid + 1, R, idx, val);
	          tree[treeIdx] = tree[2 * treeIdx + 1] + tree[2 * treeIdx + 2];
	      }
	  }
	  ```
	  
	  :::
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- Build from the bottom up: leaf nodes hold single array values; each internal node holds the **aggregate** (sum, min, or max) of its children's range.
		- For queries, decompose the query range into at most $O(\log N)$ non-overlapping segments already stored in the tree.
		-
		- ```mermaid
		  flowchart TD
		      A["Build from arr=[1,3,5,7]"] --> B["Root [0,3] sum=16"]
		      B --> C["Left [0,1] sum=4"]
		      B --> D["Right [2,3] sum=12"]
		      C --> E["Leaf [0,0] val=1"]
		      C --> F["Leaf [1,1] val=3"]
		      D --> G["Leaf [2,2] val=5"]
		      D --> H["Leaf [3,3] val=7"]
		      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		  ```
	-
	- ## Step-by-Step Trace (Query [1,3] on arr=[1,3,5,7])
	  collapsed:: true
		- ```
		  Segment Tree (array form, 0-indexed):
		    tree[0] = 16  (range [0,3])
		    tree[1] = 4   (range [0,1])
		    tree[2] = 12  (range [2,3])
		    tree[3] = 1   (range [0,0], leaf)
		    tree[4] = 3   (range [1,1], leaf)
		    tree[5] = 5   (range [2,2], leaf)
		    tree[6] = 7   (range [3,3], leaf)
		  
		  Query(QL=1, QR=3):
		    tree[0] range [0,3]: Partial Overlap → recurse both children
		    ├── tree[1] range [0,1]: Partial Overlap → recurse both children
		    │   ├── tree[3] range [0,0]: No Overlap (0 < QL=1)  → return 0
		    │   └── tree[4] range [1,1]: Complete Overlap        → return 3 ✅
		    │   └── subtotal = 0 + 3 = 3
		    └── tree[2] range [2,3]: Complete Overlap (⊆ [1,3]) → return 12 ✅
		    Total = 3 + 12 = 15 ✅  (arr[1]+arr[2]+arr[3] = 3+5+7)
		  
		  Update(idx=1, val=10):
		    Path: tree[0] → tree[1] → tree[4]
		    tree[4] = 10
		    Backtrack: tree[1] = tree[3] + tree[4] = 1 + 10 = 11
		    Backtrack: tree[0] = tree[1] + tree[2] = 11 + 12 = 23
		  ```
- # Alternative Variant (Lazy Propagation — Range Update)
  collapsed:: true
	- > [!tip] Lazy Propagation for Efficient Range Updates
	  > Standard point updates are $O(\log N)$. But **range updates** (e.g., add 5 to all elements from index L to R) would take $O(N \log N)$ without optimization. Lazy propagation defers updates by storing pending values in a `lazy[]` array and only pushing them down to children when those children are actually visited.
	-
	- :::code-tabs
	  
	  ```python
	  class LazySegTree:
	      def __init__(self, arr):
	          self.n = len(arr)
	          self.tree = [0] * (4 * self.n)
	          self.lazy = [0] * (4 * self.n)
	          if self.n > 0:
	              self._build(arr, 0, 0, self.n - 1)
	  
	      def _build(self, arr, idx, L, R):
	          if L == R:
	              self.tree[idx] = arr[L]; return
	          mid = (L + R) // 2
	          self._build(arr, 2*idx+1, L, mid)
	          self._build(arr, 2*idx+2, mid+1, R)
	          self.tree[idx] = self.tree[2*idx+1] + self.tree[2*idx+2]
	  
	      def _push_down(self, idx, L, R):
	          if self.lazy[idx] != 0:
	              mid = (L + R) // 2
	              l, r = 2*idx+1, 2*idx+2
	              self.tree[l] += self.lazy[idx] * (mid - L + 1)
	              self.tree[r] += self.lazy[idx] * (R - mid)
	              self.lazy[l] += self.lazy[idx]
	              self.lazy[r] += self.lazy[idx]
	              self.lazy[idx] = 0
	  
	      def range_update(self, QL, QR, val):
	          self._update(0, 0, self.n - 1, QL, QR, val)
	  
	      def _update(self, idx, L, R, QL, QR, val):
	          if QR < L or R < QL: return
	          if QL <= L and R <= QR:
	              self.tree[idx] += val * (R - L + 1)
	              self.lazy[idx] += val; return
	          self._push_down(idx, L, R)
	          mid = (L + R) // 2
	          self._update(2*idx+1, L, mid, QL, QR, val)
	          self._update(2*idx+2, mid+1, R, QL, QR, val)
	          self.tree[idx] = self.tree[2*idx+1] + self.tree[2*idx+2]
	  
	      def query(self, QL, QR):
	          return self._query(0, 0, self.n - 1, QL, QR)
	  
	      def _query(self, idx, L, R, QL, QR):
	          if QR < L or R < QL: return 0
	          if QL <= L and R <= QR: return self.tree[idx]
	          self._push_down(idx, L, R)
	          mid = (L + R) // 2
	          return (self._query(2*idx+1, L, mid, QL, QR) +
	                  self._query(2*idx+2, mid+1, R, QL, QR))
	  
	  # Example
	  arr = [1, 3, 5, 7]
	  seg = LazySegTree(arr)
	  print("Sum [0,3]:", seg.query(0, 3))   # 16
	  seg.range_update(1, 3, 2)              # Add 2 to arr[1..3]
	  print("Sum [0,3]:", seg.query(0, 3))   # 22 (1+5+7+9)
	  print("Sum [1,2]:", seg.query(1, 2))   # 12 (5+7)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  
	  class LazySegTree {
	      int n;
	      std::vector<long long> tree, lazy;
	  
	      void build(const std::vector<int>& arr, int idx, int L, int R) {
	          if (L == R) { tree[idx] = arr[L]; return; }
	          int mid = L + (R - L) / 2;
	          build(arr, 2*idx+1, L, mid);
	          build(arr, 2*idx+2, mid+1, R);
	          tree[idx] = tree[2*idx+1] + tree[2*idx+2];
	      }
	      void pushDown(int idx, int L, int R) {
	          if (!lazy[idx]) return;
	          int mid = L + (R - L) / 2;
	          tree[2*idx+1] += lazy[idx] * (mid - L + 1);
	          tree[2*idx+2] += lazy[idx] * (R - mid);
	          lazy[2*idx+1] += lazy[idx];
	          lazy[2*idx+2] += lazy[idx];
	          lazy[idx] = 0;
	      }
	      void update(int idx, int L, int R, int QL, int QR, long long val) {
	          if (QR < L || R < QL) return;
	          if (QL <= L && R <= QR) { tree[idx] += val*(R-L+1); lazy[idx] += val; return; }
	          pushDown(idx, L, R);
	          int mid = L + (R - L) / 2;
	          update(2*idx+1, L, mid, QL, QR, val);
	          update(2*idx+2, mid+1, R, QL, QR, val);
	          tree[idx] = tree[2*idx+1] + tree[2*idx+2];
	      }
	      long long query(int idx, int L, int R, int QL, int QR) {
	          if (QR < L || R < QL) return 0;
	          if (QL <= L && R <= QR) return tree[idx];
	          pushDown(idx, L, R);
	          int mid = L + (R - L) / 2;
	          return query(2*idx+1, L, mid, QL, QR) + query(2*idx+2, mid+1, R, QL, QR);
	      }
	  public:
	      LazySegTree(const std::vector<int>& arr) {
	          n = arr.size();
	          tree.assign(4*n, 0); lazy.assign(4*n, 0);
	          if (n > 0) build(arr, 0, 0, n-1);
	      }
	      void rangeUpdate(int L, int R, long long val) { update(0, 0, n-1, L, R, val); }
	      long long query(int L, int R) { return query(0, 0, n-1, L, R); }
	  };
	  
	  int main() {
	      std::vector<int> arr = {1, 3, 5, 7};
	      LazySegTree seg(arr);
	      std::cout << seg.query(0, 3) << "\n"; // 16
	      seg.rangeUpdate(1, 3, 2);
	      std::cout << seg.query(0, 3) << "\n"; // 22
	      return 0;
	  }
	  ```
	  
	  :::
- # When to Use a Segment Tree
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Do you need range\nqueries on an array?"}
	      Q -- No --> R1["Use a plain Array"]
	      Q -- Yes --> S1{"Are updates frequent?"}
	      S1 -- No --> R2["Use Prefix Sum Array\n(O(1) query, O(N) build)"]
	      S1 -- Yes --> S2{"Are updates range-based\n(update a whole subarray)?"}
	      S2 -- Yes --> R3["✅ Segment Tree + Lazy Propagation\n(O(log N) range update + query)"]
	      S2 -- No --> R4["✅ Segment Tree\n(O(log N) point update + query)"]
	      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
	  ```
	-
	- ## ✅ Use a Segment Tree When
		- You need both **frequent updates AND range queries** (sum, min, max, GCD) — neither a plain array nor a prefix sum achieves both in $O(\log N)$.
		- You need **range updates** (add a value to every element in `[L, R]`) alongside queries — use Lazy Propagation.
		- Problems involve **dynamic data** that changes between queries.
	-
	- ## ❌ Avoid a Segment Tree When
		- The array is **static** (no updates) — a Prefix Sum Array gives $O(1)$ queries with $O(N)$ build.
		- You only need **point updates with no range queries** — a plain array with $O(1)$ update is sufficient.
		- The query type is **non-decomposable** (e.g., median) — segment trees require associative merge operations.
- # Key Takeaways
  collapsed:: true
	- **Range-Query Specialist** — Segment Trees solve frequent range queries + updates in $O(\log N)$ per operation.
	- **4N Array Size** — Allocate a tree array of size $4N$ to safely store all internal nodes and leaves.
	- **Three Overlap Cases** — Every recursive call is: No Overlap (return neutral), Complete Overlap (return stored value), or Partial Overlap (recurse both children).
	- **Lazy Propagation** — Defers range updates by storing them in a `lazy[]` array; pushes them down only when children are visited, reducing range-update cost from $O(N \log N)$ to $O(\log N)$.
	- **Associative Operations** — Works for any associative merge: sum, min, max, GCD, XOR, product. Non-associative operations (median, mode) are not directly supported.
	- **Merge Flexibility** — By changing only the merge function (`+` → `min` → `max`), the same segment tree skeleton handles different query types.
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [CP Algorithms → Segment Tree](https://cp-algorithms.com/data_structures/segment_tree.html)
		- [GeeksforGeeks → Segment Tree](https://www.geeksforgeeks.org/segment-tree-data-structure/)
		- [Codeforces EDU → Segment Tree Part 1](https://codeforces.com/edu/course/2/lesson/4)
		- [LeetCode → Range Sum Query – Mutable (Problem 307)](https://leetcode.com/problems/range-sum-query-mutable/)