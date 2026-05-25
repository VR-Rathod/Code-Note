---
date: 2026-03-31T12:26:35+05:30
lastmod: 2026-05-25T11:36:10+05:30

seoTitle: Fenwick Tree (Binary Indexed Tree) – Prefix Sum Data Structure
description: "Master Fenwick Trees (Binary Indexed Trees) in DSA. Learn dynamic prefix sums, point updates using bitwise LSB operations, and O(N) tree building."
keywords: "Fenwick Tree, Binary Indexed Tree, BIT, Prefix Sum, LSB, Point Update, Range Query, Data Structures, DSA, BIT C++, BIT Python"
displayTitle: Binary Indexed Tree or Fenwick Tree
---

> [!info] What is a Fenwick Tree?
> A **Fenwick Tree** (also known as a **Binary Indexed Tree (BIT)**) is a data structure that maintains prefix sums of an array of numbers dynamically.
> It supports **point updates** and **range sum queries** in logarithmic $O(\log n)$ time, requiring exactly the same amount of memory as the input array ($O(n)$ space), with extremely small constant factors.

- # Explanation
  collapsed:: true
	- ## Why use a Fenwick Tree over Segment Tree?
	  collapsed:: true
		- Both Fenwick Trees and [[Segment Tree]] solve the dynamic prefix sum/range query problem in $O(\log n)$ time.
		- However, a Fenwick Tree has significant advantages:
		  - **Memory Efficiency**: A Segment Tree requires up to $4N$ memory slots. A Fenwick Tree requires exactly $N+1$ slots (an identical footprint to the original array).
		  - **Code Simplicity**: A Fenwick Tree is implemented in just a few lines of loop-based code (no recursion needed).
		  - **Performance**: Due to bitwise calculations, Fenwick Trees are faster in practice with smaller constant overheads.
		- *Note: Unlike Segment Trees, a standard Fenwick Tree only supports operations that are **invertible** (like sum, multiplication, XOR). It cannot easily support Range Minimum/Maximum queries without additional overhead.*
	-
	- ## The Bitwise LSB Logic
	  collapsed:: true
		- The tree uses **1-based indexing**. The index $i$ is represented in binary.
		- The number of elements covered by the node at index $i$ is determined by the **Least Significant Bit (LSB)** of $i$.
		- **LSB formula**:
		  $$LSB(i) = i \ \& \ (-i)$$
		- *Example index range coverage:*
		  - Index $1 \ (0001_2)$: LSB is $1$. Stores sum of range `[1, 1]`.
		  - Index $2 \ (0010_2)$: LSB is $2$. Stores sum of range `[1, 2]`.
		  - Index $3 \ (0011_2)$: LSB is $1$. Stores sum of range `[3, 3]`.
		  - Index $4 \ (0100_2)$: LSB is $4$. Stores sum of range `[1, 4]`.
		-
		- ```
		  Fenwick Range Coverage:
		  i = 1 : [1]
		  i = 2 : [1, 2]
		  i = 3 : [3]
		  i = 4 : [1, 2, 3, 4]
		  i = 5 : [5]
		  i = 6 : [5, 6]
		  i = 7 : [7]
		  i = 8 : [1, 2, 3, 4, 5, 6, 7, 8]
		  ```
		-
		- ```mermaid
		  graph TD
		      Node8["Index 8 (covers 1..8)"] --> Node4["Index 4 (covers 1..4)"]
		      Node8 --> Node6["Index 6 (covers 5..6)"]
		      Node8 --> Node7["Index 7 (covers 7..7)"]
		      Node4 --> Node2["Index 2 (covers 1..2)"]
		      Node4 --> Node3["Index 3 (covers 3..3)"]
		      Node2 --> Node1["Index 1 (covers 1..1)"]
		      Node6 --> Node5["Index 5 (covers 5..5)"]
		      
		      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		  ```

- # Core Operations
  collapsed:: true
	- ## 1. Query (Prefix Sum up to Index $i$)
	  collapsed:: true
		- To calculate the prefix sum from $1$ to $i$:
		  1. Add `tree[i]` to the running sum.
		  2. Discard the least significant bit of $i$ by subtracting its LSB: `i -= i & -i`.
		  3. Repeat until $i == 0$.
		- **Time Complexity: $O(\log n)$**
	-
	- ## 2. Update (Point Update at Index $i$)
	  collapsed:: true
		- To add a delta value to the element at index $i$, we must update all nodes that cover index $i$:
		  1. Add `delta` to `tree[i]`.
		  2. Propagate upward by adding its LSB: `i += i & -i`.
		  3. Repeat until $i$ exceeds the array size $N$.
		- **Time Complexity: $O(\log n)$**
	-
	- ## 3. Range Sum Query ($L$ to $R$)
	  collapsed:: true
		- The sum of elements between $L$ and $R$ (inclusive) is computed as:
		  $$\text{Sum}(L, R) = \text{Query}(R) - \text{Query}(L-1)$$
		- **Time Complexity: $O(\log n)$**
	-
	- ## 4. Fast Build ($O(N)$ initialization)
	  collapsed:: true
		- Instead of performing $N$ updates (which takes $O(N \log N)$), we can initialize in $O(N)$ time:
		  1. Copy the original array to the tree (1-indexed).
		  2. For each index $i$ from 1 to $N$, add its value to its immediate parent: `parent = i + (i & -i)`. If `parent <= N`, add `tree[i]` to `tree[parent]`.

- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > A Fenwick Tree provides logarithmic time complexities with an exceptionally low memory overhead.
	  > Refer to [[Complexity Analysis]] for further mathematical proofs on binary structures.
	-
	- | Operation | Time Complexity | Space Complexity |
	  |-----------|-----------------|------------------|
	  | **Build** | $O(N)$ | $O(N)$ |
	  | **Prefix Query** | $O(\log N)$ | $O(1)$ iterative |
	  | **Point Update** | $O(\log N)$ | $O(1)$ iterative |
	  | **Range Query** | $O(\log N)$ | $O(1)$ iterative |

- # Implementation
  collapsed:: true
	- > [!note] Fenwick Tree Implementation
	  > Below is the implementation of a 1-indexed Fenwick Tree supporting $O(N)$ construction, point updates, and range sum queries.
	-
	- :::code-tabs
	  
	  ```python
	  class FenwickTree:
	      def __init__(self, arr):
	          """Initialize and build the Fenwick Tree in O(N) time."""
	          self.n = len(arr)
	          self.tree = [0] + list(arr) # 1-based indexing helper
	          
	          for i in range(1, self.n + 1):
	              parent = i + (i & -i)
	              if parent <= self.n:
	                  self.tree[parent] += self.tree[i]
	  
	      def update(self, idx: int, delta: int):
	          """Add delta to the element at 1-based index idx."""
	          while idx <= self.n:
	              self.tree[idx] += delta
	              idx += idx & -idx
	  
	      def query(self, idx: int) -> int:
	          """Returns prefix sum from index 1 to 1-based index idx."""
	          total_sum = 0
	          while idx > 0:
	              total_sum += self.tree[idx]
	              idx -= idx & -idx
	          return total_sum
	  
	      def range_query(self, L: int, R: int) -> int:
	          """Returns sum in 1-based range [L, R]."""
	          return self.query(R) - self.query(L - 1)
	  
	  # Example Usage
	  arr = [1, 3, 5, 7, 9]
	  bit = FenwickTree(arr)
	  print("Sum of range [2, 4]:", bit.range_query(2, 4)) # Output: 15 (3 + 5 + 7)
	  bit.update(3, 2)                                    # Add 2 to index 3 (value 5 becomes 7)
	  print("Sum of range [2, 4]:", bit.range_query(2, 4)) # Output: 17 (3 + 7 + 7)
	  ```
	  
	  ```cpp
	  #include <iostream>
	  #include <vector>
	  
	  class FenwickTree {
	  private:
	      int n;
	      std::vector<int> tree;
	  
	  public:
	      FenwickTree(const std::vector<int>& arr) {
	          n = arr.size();
	          tree.assign(n + 1, 0);
	          for (int i = 0; i < n; i++) {
	              tree[i + 1] = arr[i];
	          }
	          for (int i = 1; i <= n; i++) {
	              int parent = i + (i & -i);
	              if (parent <= n) {
	                  tree[parent] += tree[i];
	              }
	          }
	      }
	  
	      void update(int idx, int delta) {
	          while (idx <= n) {
	              tree[idx] += delta;
	              idx += idx & -idx;
	          }
	      }
	  
	      int query(int idx) {
	          int totalSum = 0;
	          while (idx > 0) {
	              totalSum += tree[idx];
	              idx -= idx & -idx;
	          }
	          return totalSum;
	      }
	  
	      int rangeQuery(int L, int R) {
	          return query(R) - query(L - 1);
	      }
	  };
	  
	  int main() {
	      std::vector<int> arr = {1, 3, 5, 7, 9};
	      FenwickTree bit(arr);
	      std::cout << "Sum [2, 4]: " << bit.rangeQuery(2, 4) << "\n"; // Output: 15
	      bit.update(3, 2);
	      std::cout << "Sum [2, 4]: " << bit.rangeQuery(2, 4) << "\n"; // Output: 17
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class FenwickTree {
	      constructor(arr) {
	          this.n = arr.length;
	          this.tree = [0, ...arr];
	          for (let i = 1; i <= this.n; i++) {
	              const parent = i + (i & -i);
	              if (parent <= this.n) {
	                  this.tree[parent] += this.tree[i];
	              }
	          }
	      }
	  
	      update(idx, delta) {
	          while (idx <= this.n) {
	              this.tree[idx] += delta;
	              idx += idx & -idx;
	          }
	      }
	  
	      query(idx) {
	          let totalSum = 0;
	          while (idx > 0) {
	              totalSum += this.tree[idx];
	              idx -= idx & -idx;
	          }
	          return totalSum;
	      }
	  
	      rangeQuery(L, R) {
	          return this.query(R) - this.query(L - 1);
	      }
	  }
	  ```
	  
	  ```java
	  public class FenwickTree {
	      private int[] tree;
	      private int n;
	  
	      public FenwickTree(int[] arr) {
	          this.n = arr.length;
	          this.tree = new int[n + 1];
	          System.arraycopy(arr, 0, tree, 1, n);
	          for (int i = 1; i <= n; i++) {
	              int parent = i + (i & -i);
	              if (parent <= n) {
	                  tree[parent] += tree[i];
	              }
	          }
	      }
	  
	      public void update(int idx, int delta) {
	          while (idx <= n) {
	              tree[idx] += delta;
	              idx += idx & -idx;
	          }
	      }
	  
	      public int query(int idx) {
	          int totalSum = 0;
	          while (idx > 0) {
	              totalSum += tree[idx];
	              idx -= idx & -idx;
	          }
	          return totalSum;
	      }
	  
	      public int rangeQuery(int L, int R) {
	          return query(R) - query(L - 1);
	      }
	  }
	  ```
	  
	  :::