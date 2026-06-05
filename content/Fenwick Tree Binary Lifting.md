---
seoTitle: Fenwick Tree Binary Lifting – O(log N) Prefix Sum Search
description: "Learn how to find the k-th element or search prefix sums in a Binary Indexed Tree (Fenwick Tree) in O(log N) using binary lifting. Covers structural analysis, binary search comparison, and implementations in Python, C++, JavaScript, and Java."
keywords: "Fenwick tree, binary indexed tree, binary lifting, prefix sum search, O(log N) search, competitive programming, BIT, data structures, DSA"
treeTitle: DSA - Advanced Tips - Fenwick Tree Binary Lifting
---

> [!info] What is Fenwick Tree Binary Lifting?
> **Fenwick Tree Binary Lifting** is a bitwise technique used to search for prefix sum thresholds in a Binary Indexed Tree (BIT) in **O(log N)** time.
> While standard binary search on prefix sums takes $O(\log^2 N)$ time, binary lifting exploits the internal power-of-2 structure of the Fenwick tree to find the target index in a single $O(\log N)$ pass.

- # The Problem: Finding a Prefix Sum Threshold
  collapsed:: true
	- Assume we have a Fenwick tree representing an array of non-negative frequencies. We want to find the **smallest index $i$** such that the prefix sum is at least $K$:
	- $$\text{prefix\_sum}(i) \ge K$$
	- This operation is essential for maintaining dynamic order statistics (e.g. finding the $k$-th smallest element in a dynamic set).
	-
	- ## 1. The Standard $O(\log^2 N)$ Binary Search
		- The most straightforward approach is to binary search the index range $[1, N]$:
		- ```python
		  # O(log^2 N) search
		  low, high = 1, N
		  ans = -1
		  while low <= high:
		      mid = (low + high) // 2
		      if query(mid) >= K:
		          ans = mid
		          high = mid - 1
		      else:
		          low = mid + 1
		  ```
		- Since each `query(mid)` takes $O(\log N)$ time, the overall complexity is $O(\log^2 N)$.
		-
	- ## 2. The $O(\log N)$ Binary Lifting Solution
		- A Fenwick tree node `tree[idx]` stores the sum of elements in a range of length `idx & -idx` (the largest power of 2 dividing `idx`).
		- Because the ranges are structured as powers of 2, we can build the target index bit by bit, from the most significant bit down to 0, similar to binary lifting on trees:
		- - Start with `idx = 0` and `current_sum = 0`.
		- - Iterate from the largest power of 2 ($2^{\lfloor \log_2 N \rfloor}$) down to $1$ ($2^0$).
		- - For each power $P$: if `idx + P <= N` and `current_sum + tree[idx + P] < K`, we update `idx += P` and `current_sum += tree[idx]`.
		- - At the end of the loop, `idx + 1` is the first index where the prefix sum is at least $K$.
		-
- # Mathematical Analogy & Trace
  collapsed:: true
	- Imagine finding a target distance on a road by jumping in decreasing powers of 2 (e.g., 16 miles, 8 miles, 4 miles, 2 miles, 1 mile).
	- At each step, you check if making the jump would overshoot your destination. If it doesn't, you make the jump; if it does, you stay in place and try the next smaller jump.
	-
	- ## Tracing a Query for $K = 6$
		- Suppose our Fenwick tree has size $N=8$, storing frequencies `[1, 0, 2, 0, 1, 3, 0, 1]`.
		- `tree` values:
			- `tree[1] = 1`
			- `tree[2] = 1`
			- `tree[3] = 2`
			- `tree[4] = 3` (stores sum of `arr[1..4] = 1+0+2+0`)
			- `tree[5] = 1`
			- `tree[6] = 4` (stores sum of `arr[5..6] = 1+3`)
			- `tree[7] = 0`
			- `tree[8] = 8` (stores sum of `arr[1..8] = 8`)
		- Let's find the first index with prefix sum $\ge 6$:
		- Start: `idx = 0`, `sum = 0`. Largest power is $P = 4$.
		- **Step 1 ($P=4$)**:
			- `idx + 4 = 4` ($\le 8$).
			- `sum + tree[4] = 0 + 3 = 3 < 6` $\implies$ Jump!
			- Update: `idx = 4`, `sum = 3`.
		- **Step 2 ($P=2$)**:
			- `idx + 2 = 6` ($\le 8$).
			- `sum + tree[6] = 3 + 4 = 7 \not< 6` $\implies$ Do not jump!
		- **Step 3 ($P=1$)**:
			- `idx + 1 = 5` ($\le 8$).
			- `sum + tree[5] = 3 + 1 = 4 < 6` $\implies$ Jump!
			- Update: `idx = 5`, `sum = 4`.
		- **Loop Ends**: The result index is `idx + 1 = 6`.
		- Verification: Prefix sum at index 5 is 4. Prefix sum at index 6 is 7 $\ge 6$. The first index is indeed 6. Correct!
	-
- # Time & Space Complexity
  collapsed:: true
	- ## Complexity Table
	  collapsed:: true
		- | Method | Time Complexity | Space Complexity | Constant Factor |
		  |---|---|---|---|
		  | **Binary Search** | $O(\log^2 N)$ | $O(N)$ for tree | High (requires $\log N$ query iterations) |
		  | **Binary Lifting** | **$O(\log N)$** | $O(N)$ | **Very Low** (runs in exactly $\approx 20$ loops) |
		-
- # Implementation
  collapsed:: true
	- > [!note] Below are the implementations of a Fenwick Tree containing point updates, prefix queries, and the binary lifting prefix-search algorithm.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs
	  
	  ```python
	  class FenwickTree:
	      def __init__(self, size):
	          self.size = size
	          self.tree = [0] * (size + 1)
	  
	      def update(self, idx, val):
	          while idx <= self.size:
	              self.tree[idx] += val
	              idx += idx & -idx
	  
	      def query(self, idx):
	          s = 0
	          while idx > 0:
	              s += self.tree[idx]
	              idx -= idx & -idx
	          return s
	  
	      # Find the smallest index where prefix sum >= K (O(log N))
	      def find_kth(self, k):
	          idx = 0
	          curr_sum = 0
	          
	          # Find largest power of 2
	          power = 1
	          while (power << 1) <= self.size:
	              power <<= 1
	              
	          while power > 0:
	              if idx + power <= self.size:
	                  # Compare cumulative sum with K
	                  if curr_sum + self.tree[idx + power] < k:
	                      idx += power
	                      curr_sum += self.tree[idx]
	              power >>= 1
	          
	          # The target index is the next element
	          return idx + 1
	  
	  # Example usage
	  bit = FenwickTree(8)
	  freq = [0, 1, 0, 2, 0, 1, 3, 0, 1]
	  for i in range(1, 9):
	      bit.update(i, freq[i])
	  
	  print("First index with sum >= 6:", bit.find_kth(6))  # Output: 6
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  
	  class FenwickTree {
	  private:
	      int size;
	      std::vector<int> tree;
	  
	  public:
	      FenwickTree(int n) : size(n), tree(n + 1, 0) {}
	  
	      void update(int idx, int val) {
	          for (; idx <= size; idx += idx & -idx) {
	              tree[idx] += val;
	          }
	      }
	  
	      int query(int idx) {
	          int sum = 0;
	          for (; idx > 0; idx -= idx & -idx) {
	              sum += tree[idx];
	          }
	          return sum;
	      }
	  
	      // O(log N) binary lifting to find first index with prefix sum >= K
	      int find_kth(int k) {
	          int idx = 0;
	          int curr_sum = 0;
	          
	          int power = 1;
	          while ((power << 1) <= size) {
	              power <<= 1;
	          }
	  
	          for (; power > 0; power >>= 1) {
	              if (idx + power <= size) {
	                  if (curr_sum + tree[idx + power] < k) {
	                      idx += power;
	                      curr_sum += tree[idx];
	                  }
	              }
	          }
	          return idx + 1;
	      }
	  };
	  
	  int main() {
	      FenwickTree bit(8);
	      std::vector<int> freq = {0, 1, 0, 2, 0, 1, 3, 0, 1};
	      for (int i = 1; i <= 8; ++i) {
	          bit.update(i, freq[i]);
	      }
	      std::cout << "First index with sum >= 6: " << bit.find_kth(6) << "\n"; // 6
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class FenwickTree {
	      constructor(size) {
	          this.size = size;
	          this.tree = new Array(size + 1).fill(0);
	      }
	  
	      update(idx, val) {
	          for (; idx <= this.size; idx += idx & -idx) {
	              this.tree[idx] += val;
	          }
	      }
	  
	      query(idx) {
	          let sum = 0;
	          for (; idx > 0; idx -= idx & -idx) {
	              sum += this.tree[idx];
	          }
	          return sum;
	      }
	  
	      findKth(k) {
	          let idx = 0;
	          let currSum = 0;
	          let power = 1;
	          while ((power << 1) <= this.size) {
	              power <<= 1;
	          }
	  
	          for (; power > 0; power >>= 1) {
	              if (idx + power <= this.size) {
	                  if (currSum + this.tree[idx + power] < k) {
	                      idx += power;
	                      currSum += this.tree[idx];
	                  }
	              }
	          }
	          return idx + 1;
	      }
	  }
	  
	  const bit = new FenwickTree(8);
	  const freq = [0, 1, 0, 2, 0, 1, 3, 0, 1];
	  for (let i = 1; i <= 8; i++) {
	      bit.update(i, freq[i]);
	  }
	  console.log("First index with sum >= 6:", bit.findKth(6)); // 6
	  ```
	  
	  ```java
	  public class FenwickBinaryLifting {
	      
	      static class FenwickTree {
	          private final int size;
	          private final int[] tree;
	  
	          public FenwickTree(int n) {
	              this.size = n;
	              this.tree = new int[n + 1];
	          }
	  
	          public void update(int idx, int val) {
	              for (; idx <= size; idx += idx & -idx) {
	                  tree[idx] += val;
	              }
	          }
	  
	          public int query(int idx) {
	              int sum = 0;
	              for (; idx > 0; idx -= idx & -idx) {
	                  sum += tree[idx];
	              }
	              return sum;
	          }
	  
	          public int findKth(int k) {
	              int idx = 0;
	              int currSum = 0;
	              int power = 1;
	              while ((power << 1) <= size) {
	                  power <<= 1;
	              }
	  
	              for (; power > 0; power >>= 1) {
	                  if (idx + power <= size) {
	                      if (currSum + tree[idx + power] < k) {
	                          idx += power;
	                          currSum += tree[idx];
	                      }
	                  }
	              }
	              return idx + 1;
	          }
	      }
	  
	      public static void main(String[] args) {
	          FenwickTree bit = new FenwickTree(8);
	          int[] freq = {0, 1, 0, 2, 0, 1, 3, 0, 1};
	          for (int i = 1; i <= 8; i++) {
	              bit.update(i, freq[i]);
	          }
	          System.out.println("First index with sum >= 6: " + bit.findKth(6)); // 6
	      }
	  }
	  ```
	  
	  :::
	-
- # Key Takeaways
	- **Power-of-2 Alignment** — By iterating downwards in powers of 2, binary lifting jumps directly along the boundaries of the Fenwick tree.
	- **O(log N) Efficiency** — Replaces $O(\log^2 N)$ nested searches with a single traversal, optimizing constant factors in query-intensive problems.
	-
- # More Learn
	- ## Resources
		- [GeeksforGeeks – Constant time range query algorithms](https://www.geeksforgeeks.org/binary-indexed-tree-or-fenwick-tree-2/)
	- ## Related Pages
		- [[Submask Bitwise Iteration]] – O(3^N) submask dynamic programming
		- [[Linear Basis Algorithm]] – Vector space XOR operations
		- [[DSA Algo & System Design]] – Master DSA checklist