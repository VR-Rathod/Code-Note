---
seoTitle: Matrix Chain Multiplication – Interval DP Optimization Guide
description: "Master Matrix Chain Multiplication using interval dynamic programming. Covers parenthesization optimization, the dp[i][j] recurrence, O(N³) tabulation, traceback for optimal split, and applications in compiler optimization."
keywords: "Matrix Chain Multiplication, interval DP, parenthesization, dynamic programming, O(N³), optimal split, matrix multiplication, MCM, Python, C++, Java, JavaScript"
displayTitle: Matrix Chain Multiplication
treeTitle: DSA - DP & Greedy - Matrix Chain Multiplication
---

> [!info] What is Matrix Chain Multiplication?
> **Matrix Chain Multiplication (MCM)** asks: given a chain of $N$ matrices $A_1, A_2, \ldots, A_N$, in what **order** (parenthesization) should we multiply them to minimize the **total number of scalar multiplications**?
> Matrix multiplication is associative, so the result is the same regardless of order — but the **cost** varies dramatically.
> MCM is solved in **$O(N^3)$** time using **interval Dynamic Programming**.

- # Explanation
  collapsed:: true
	- Multiplying a $(p \times q)$ matrix by a $(q \times r)$ matrix costs $p \times q \times r$ scalar multiplications.
	- For a chain of $N$ matrices, there are **exponentially many** parenthesizations (the Catalan number $C_{N-1}$), so brute force is infeasible for large $N$.
	-
	- ## The Key Insight
	  collapsed:: true
		- At some **split point** $k$ between $i$ and $j$, we multiply `(A_i ... A_k)` with `(A_{k+1} ... A_j)`.
		- The cost of this split is: `cost(i,k) + cost(k+1,j) + p[i-1] * p[k] * p[j]`
		- We try all valid $k$ values and take the minimum — this is the interval DP recurrence.
	-
	- ## The DP Recurrence
	  collapsed:: true
		- Represent the chain by dimensions array `p[]` where matrix $A_i$ has dimensions `p[i-1] × p[i]`.
		- `dp[i][j]` = minimum scalar multiplications to compute $A_i \times \ldots \times A_j$.
		- **Base case**: `dp[i][i] = 0` (single matrix, no multiplication needed).
		- **Recurrence**:
		  ```
		  dp[i][j] = min over k from i to j-1 of:
		               dp[i][k] + dp[k+1][j] + p[i-1] * p[k] * p[j]
		  ```
		- Fill by **increasing chain length** (length 2, then 3, ..., then N).
	-
	- ## Core Properties
	  collapsed:: true
		- **Optimal Substructure**: The optimal parenthesization of a chain contains optimal parenthesizations of its sub-chains.
		- **Overlapping Subproblems**: Many sub-chain costs are needed multiple times — DP avoids recomputation.
		- **Interval DP Pattern**: The key pattern is iterating over **chain lengths** from smallest to largest, not from left to right like linear DP.
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- Fill the DP table diagonally — start with chains of length 1 (cost 0), then length 2, then 3, up to length $N$.
		- Each cell `dp[i][j]` tries all possible split points $k$ and takes the minimum total cost.
		-
		- ```mermaid
		  flowchart TD
		      A["Input: dimensions array p[0..N]\nMatrix i has dims p[i-1] × p[i]"] --> B["Initialize dp[i][i] = 0 for all i"]
		      B --> C["For chain_len = 2 to N"]
		      C --> D["For i = 1 to N-chain_len+1\nj = i + chain_len - 1"]
		      D --> E["dp[i][j] = ∞"]
		      E --> F["For k = i to j-1\ncost = dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j]"]
		      F --> G{"cost < dp[i][j]?"}
		      G -- Yes --> H["dp[i][j] = cost\nsplit[i][j] = k"]
		      G -- No --> I["Try next k"]
		      H --> I
		      I --> F
		      F --> J["dp[1][N] = minimum total cost"]
		  
		      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		  ```
	-
	- ## Step-by-Step Trace (3 Matrices: A₁=10×30, A₂=30×5, A₃=5×60)
	  collapsed:: true
		- ```
		  Dimensions array: p = [10, 30, 5, 60]
		  Matrices: A1(10×30), A2(30×5), A3(5×60)
		  
		  Initialize: dp[1][1]=0, dp[2][2]=0, dp[3][3]=0
		  
		  Chain length = 2:
		    i=1, j=2: k=1
		      cost = dp[1][1] + dp[2][2] + p[0]*p[1]*p[2]
		           = 0 + 0 + 10*30*5 = 1500
		      dp[1][2] = 1500, split[1][2] = 1
		  
		    i=2, j=3: k=2
		      cost = dp[2][2] + dp[3][3] + p[1]*p[2]*p[3]
		           = 0 + 0 + 30*5*60 = 9000
		      dp[2][3] = 9000, split[2][3] = 2
		  
		  Chain length = 3:
		    i=1, j=3:
		      k=1: cost = dp[1][1] + dp[2][3] + p[0]*p[1]*p[3]
		                 = 0 + 9000 + 10*30*60 = 27000
		      k=2: cost = dp[1][2] + dp[3][3] + p[0]*p[2]*p[3]
		                 = 1500 + 0 + 10*5*60 = 4500 ← minimum!
		      dp[1][3] = 4500, split[1][3] = 2
		  
		  Result: Minimum multiplications = dp[1][3] = 4500
		  Optimal parenthesization: split at k=2 → (A1 × A2) × A3
		  
		  Verification:
		    Option 1: (A1×A2)×A3 = 1500 + 9000 = ... wait
		    Actually:
		    k=2 means: (A1A2) × A3
		      Cost(A1×A2) = 10×30×5 = 1500
		      Cost((A1A2)×A3) = 10×5×60 = 3000
		      Total = 1500 + 3000 = 4500 ✅
		  
		    k=1 means: A1 × (A2A3)
		      Cost(A2×A3) = 30×5×60 = 9000
		      Cost(A1×(A2A3)) = 10×30×60 = 18000
		      Total = 9000 + 18000 = 27000 ❌ (much worse)
		  ```
- # Complexity Analysis
  collapsed:: true
	- | Scenario | Time Complexity | Space Complexity | Notes |
	  |---|---|---|---|
	  | **Naive Recursion** | **O(2^N)** | **O(N)** stack | Catalan number of parenthesizations |
	  | **Memoization (Top-Down)** | **O(N³)** | **O(N²)** memo table | Recursive with cache |
	  | **Tabulation (Bottom-Up)** | **O(N³)** | **O(N²)** dp table | Iterative, cache-friendly |
	-
	- ## Why O(N³)?
	  collapsed:: true
		- There are $O(N^2)$ sub-problems (all pairs `[i,j]`).
		- Each sub-problem tries up to $O(N)$ split points $k$.
		- Total: $O(N^2) \times O(N) = O(N^3)$.
- # Implementation
  collapsed:: true
	- > [!note] Matrix Chain Multiplication — Bottom-Up DP with Optimal Parenthesization
	  > The implementation below computes the minimum cost and reconstructs the optimal parenthesization string via the `split[][]` table.
		- Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs
	  
	  ```python
	  def matrix_chain_order(p: list[int]) -> tuple[int, str]:
	      """
	      p[i] = rows of matrix i, p[i+1] = cols of matrix i (1-indexed matrices).
	      Returns (min_cost, optimal_parenthesization).
	      """
	      n = len(p) - 1  # Number of matrices
	      # dp[i][j] = min cost to multiply matrices i..j (1-indexed)
	      dp = [[0] * (n + 1) for _ in range(n + 1)]
	      split = [[0] * (n + 1) for _ in range(n + 1)]
	  
	      # Fill by increasing chain length
	      for length in range(2, n + 1):          # chain length
	          for i in range(1, n - length + 2):  # start index
	              j = i + length - 1              # end index
	              dp[i][j] = float('inf')
	              for k in range(i, j):            # split point
	                  cost = dp[i][k] + dp[k+1][j] + p[i-1] * p[k] * p[j]
	                  if cost < dp[i][j]:
	                      dp[i][j] = cost
	                      split[i][j] = k
	  
	      def reconstruct(i, j) -> str:
	          if i == j:
	              return f"A{i}"
	          k = split[i][j]
	          return f"({reconstruct(i, k)} × {reconstruct(k+1, j)})"
	  
	      return dp[1][n], reconstruct(1, n)
	  
	  # Example: A1(10×30), A2(30×5), A3(5×60)
	  p = [10, 30, 5, 60]
	  cost, parens = matrix_chain_order(p)
	  print(f"Min Cost: {cost}")        # 4500
	  print(f"Optimal: {parens}")       # ((A1 × A2) × A3)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <climits>
	  #include <string>
	  
	  std::pair<int, std::string> matrixChainOrder(const std::vector<int>& p) {
	      int n = p.size() - 1;
	      std::vector<std::vector<int>> dp(n + 1, std::vector<int>(n + 1, 0));
	      std::vector<std::vector<int>> split(n + 1, std::vector<int>(n + 1, 0));
	  
	      for (int len = 2; len <= n; ++len) {
	          for (int i = 1; i <= n - len + 1; ++i) {
	              int j = i + len - 1;
	              dp[i][j] = INT_MAX;
	              for (int k = i; k < j; ++k) {
	                  int cost = dp[i][k] + dp[k+1][j] + p[i-1] * p[k] * p[j];
	                  if (cost < dp[i][j]) {
	                      dp[i][j] = cost;
	                      split[i][j] = k;
	                  }
	              }
	          }
	      }
	  
	      // Reconstruct parenthesization
	      std::function<std::string(int, int)> reconstruct = [&](int i, int j) -> std::string {
	          if (i == j) return "A" + std::to_string(i);
	          return "(" + reconstruct(i, split[i][j]) + " × " + reconstruct(split[i][j]+1, j) + ")";
	      };
	  
	      return {dp[1][n], reconstruct(1, n)};
	  }
	  
	  int main() {
	      std::vector<int> p = {10, 30, 5, 60};
	      auto [cost, parens] = matrixChainOrder(p);
	      std::cout << "Min Cost: " << cost << "\n";   // 4500
	      std::cout << "Optimal: " << parens << "\n";  // ((A1 × A2) × A3)
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function matrixChainOrder(p) {
	      const n = p.length - 1;
	      const dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
	      const split = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
	  
	      for (let len = 2; len <= n; len++) {
	          for (let i = 1; i <= n - len + 1; i++) {
	              const j = i + len - 1;
	              dp[i][j] = Infinity;
	              for (let k = i; k < j; k++) {
	                  const cost = dp[i][k] + dp[k+1][j] + p[i-1] * p[k] * p[j];
	                  if (cost < dp[i][j]) {
	                      dp[i][j] = cost;
	                      split[i][j] = k;
	                  }
	              }
	          }
	      }
	  
	      function reconstruct(i, j) {
	          if (i === j) return `A${i}`;
	          return `(${reconstruct(i, split[i][j])} × ${reconstruct(split[i][j] + 1, j)})`;
	      }
	  
	      return { cost: dp[1][n], parens: reconstruct(1, n) };
	  }
	  
	  const p = [10, 30, 5, 60];
	  const { cost, parens } = matrixChainOrder(p);
	  console.log("Min Cost:", cost);    // 4500
	  console.log("Optimal:", parens);  // ((A1 × A2) × A3)
	  ```
	  
	  ```java
	  public class MatrixChainMultiplication {
	      static int[][] dp, split;
	  
	      public static int matrixChainOrder(int[] p) {
	          int n = p.length - 1;
	          dp = new int[n + 1][n + 1];
	          split = new int[n + 1][n + 1];
	  
	          for (int len = 2; len <= n; len++) {
	              for (int i = 1; i <= n - len + 1; i++) {
	                  int j = i + len - 1;
	                  dp[i][j] = Integer.MAX_VALUE;
	                  for (int k = i; k < j; k++) {
	                      int cost = dp[i][k] + dp[k+1][j] + p[i-1] * p[k] * p[j];
	                      if (cost < dp[i][j]) {
	                          dp[i][j] = cost;
	                          split[i][j] = k;
	                      }
	                  }
	              }
	          }
	          return dp[1][n];
	      }
	  
	      static String reconstruct(int i, int j) {
	          if (i == j) return "A" + i;
	          return "(" + reconstruct(i, split[i][j]) + " × " + reconstruct(split[i][j] + 1, j) + ")";
	      }
	  
	      public static void main(String[] args) {
	          int[] p = {10, 30, 5, 60};
	          int cost = matrixChainOrder(p);
	          System.out.println("Min Cost: " + cost);                // 4500
	          System.out.println("Optimal: " + reconstruct(1, 3));   // ((A1 × A2) × A3)
	      }
	  }
	  ```
	  
	  :::
- # Alternative Variant (Top-Down Memoization)
  collapsed:: true
	- > [!tip] Top-Down Memoization — Easier to Write, Same Complexity
	  > The recursive memoized version is often easier to reason about: define `memo[i][j]` and return cached results. Same $O(N^3)$ time and $O(N^2)$ space as bottom-up tabulation.
	-
	- :::code-tabs
	  
	  ```python
	  from functools import lru_cache
	  
	  def matrix_chain_memo(p: list[int]) -> int:
	      n = len(p) - 1
	  
	      @lru_cache(maxsize=None)
	      def solve(i: int, j: int) -> int:
	          if i == j:
	              return 0
	          return min(
	              solve(i, k) + solve(k + 1, j) + p[i - 1] * p[k] * p[j]
	              for k in range(i, j)
	          )
	  
	      return solve(1, n)
	  
	  # Example
	  p = [10, 30, 5, 60]
	  print(matrix_chain_memo(p))  # 4500
	  ```
	  
	  ```javascript
	  function matrixChainMemo(p) {
	      const n = p.length - 1;
	      const memo = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(-1));
	  
	      function solve(i, j) {
	          if (i === j) return 0;
	          if (memo[i][j] !== -1) return memo[i][j];
	          let best = Infinity;
	          for (let k = i; k < j; k++) {
	              const cost = solve(i, k) + solve(k + 1, j) + p[i-1] * p[k] * p[j];
	              if (cost < best) best = cost;
	          }
	          return memo[i][j] = best;
	      }
	  
	      return solve(1, n);
	  }
	  
	  console.log(matrixChainMemo([10, 30, 5, 60])); // 4500
	  ```
	  
	  :::
- # When to Use Matrix Chain Multiplication
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Do you have a chain of\noperations where order\naffects total cost?"}
	      Q -- No --> R1["Use simpler greedy\nor linear DP"]
	      Q -- Yes --> S1{"Is the operation\nassociative?"}
	      S1 -- No --> R2["Order is fixed;\nMCM doesn't apply"]
	      S1 -- Yes --> S2{"Is the cost function\ndecomposable into\nsubproblems?"}
	      S2 -- No --> R3["Use brute-force\nor heuristics"]
	      S2 -- Yes --> R4["✅ Use Interval DP\n(MCM pattern, O(N³))"]
	  
	      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
	  ```
	-
	- ## ✅ Use MCM / Interval DP When
		- You need to find the **optimal parenthesization** of a chain of matrix multiplications.
		- Any problem that requires **optimal way to split a sequence** into sub-sequences (Burst Balloons, Palindrome Partitioning, Optimal BST).
		- **Compiler optimization** — reordering matrix operations in linear algebra kernels (BLAS, ML frameworks).
	-
	- ## ❌ Avoid MCM When
		- The number of matrices is very large ($N > 1000$) — $O(N^3)$ may be too slow; consider approximation algorithms.
		- The operation is **not associative** — order matters for correctness, not just cost.
		- You only need to compute the product once with a fixed order — just multiply sequentially.
- # Key Takeaways
  collapsed:: true
	- **Order ≠ Result, But Order = Cost** — Matrix multiplication is associative (same result), but parenthesization dramatically affects the number of scalar operations.
	- **Interval DP Pattern** — Fill the DP table by increasing chain lengths (2, 3, ..., N), not row by row. This is the defining characteristic of interval DP.
	- **O(N³) Optimal** — Three nested loops: chain length, start index, split point. Each sub-problem solved once → $O(N^3)$ total.
	- **Split Table for Reconstruction** — Store the optimal split point $k$ in a `split[][]` table and recursively reconstruct the parenthesization string.
	- **Generalizable Pattern** — MCM is the canonical interval DP problem. The same pattern applies to Burst Balloons, Palindrome Partitioning II, Optimal BST, and Stone Merging.
	- **Exponential Brute Force** — There are Catalan number $C_{N-1}$ parenthesizations; for $N=10$ that's 4862. DP reduces this to a polynomial $O(N^3)$.
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks → Matrix Chain Multiplication DP](https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/)
		- [CP Algorithms → Matrix Chain Multiplication](https://cp-algorithms.com/dynamic_programming/matrix_chain_multiplication.html)
		- [LeetCode → Burst Balloons (MCM Variant, Problem 312)](https://leetcode.com/problems/burst-balloons/)
		- [TheAlgorithms – MCM (Python)](https://github.com/TheAlgorithms/Python/blob/master/dynamic_programming/matrix_chain_order.py)