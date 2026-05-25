---
seoTitle: Segment Tree – Range Queries & Lazy Propagation Guide
description: "Master Segment Trees in DSA. Learn to build segment trees for range sum/minimum queries, implement point updates, and optimize with Lazy Propagation."
keywords: "Segment Tree, Range Query, Lazy Propagation, Range Sum Query, Point Update, Segment Tree C++, Segment Tree Java, Segment Tree Python, DSA"
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
