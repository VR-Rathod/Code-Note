---
seoTitle: 0/1 Knapsack Problem – Dynamic Programming In-Depth Guide
description: "Complete guide to the 0/1 Knapsack Problem. Covers DP recurrence, 2D and 1D space-optimised solutions, subset sum, partition equal subset, and implementations in Python, C++, Java, JavaScript, and C#."
keywords: "0/1 knapsack, knapsack problem, dynamic programming, subset sum, partition equal subset, O(NW), DP table, VR-Rathod, Code-Note, code note vr"
displayTitle: 0/1 Knapsack Problem
---

> [!info] What is the 0/1 Knapsack Problem?
> Given N items each with a **weight** and a **value**, and a knapsack with capacity W, find the **maximum total value** you can carry. Each item can be taken **at most once (0 or 1 time)**. This is a classic NP-hard optimisation problem solved in pseudo-polynomial O(N×W) time using DP.

- # Explanation
  collapsed:: true
	- ## The Decision at Each Item
	  collapsed:: true
		- For item i with weight `w[i]` and value `v[i]`:
		- ```
		  Option A (SKIP item i):   dp[i][c] = dp[i-1][c]
		  Option B (TAKE item i):   dp[i][c] = dp[i-1][c - w[i]] + v[i]
		                            (only valid if c >= w[i])
		  
		  dp[i][c] = max(Option A, Option B)
		  ```
		- Base case: `dp[0][c] = 0` for all c (no items → no value)
	-
	- ## DP Table Trace
	  collapsed:: true
		- Items: `(weight, value)` = `(2,3), (3,4), (4,5), (5,6)`, Capacity W = 5
		- ```
		  dp[i][c]:  c=0  1  2  3  4  5
		  i=0 (-)     0   0  0  0  0  0
		  i=1 (2,3)   0   0  3  3  3  3
		  i=2 (3,4)   0   0  3  4  4  7
		  i=3 (4,5)   0   0  3  4  5  7
		  i=4 (5,6)   0   0  3  4  5  7
		  
		  Answer: dp[4][5] = 7 (take items (2,3)+(3,4))
		  ```
	-
	- ## Space Optimisation to O(W)
	  collapsed:: true
		- The 2D DP only uses row `i-1` to compute row `i`, so we can use **one 1D array** iterated **right-to-left** to avoid using item i twice:
		- ```
		  dp = [0] * (W + 1)
		  for each item (w, v):
		      for c from W down to w:    ← RIGHT-TO-LEFT is critical!
		          dp[c] = max(dp[c], dp[c-w] + v)
		  ```
		- **Why right-to-left?** If we went left-to-right, `dp[c-w]` would already use the current item → item used more than once (becomes Unbounded Knapsack).
	-
	- ## Complexity
	  collapsed:: true
		- | | 2D DP | 1D Optimised |
		  |---|---|---|
		  | **Time** | O(N × W) | O(N × W) |
		  | **Space** | O(N × W) | **O(W)** |

- # Implementation
  collapsed:: true
	- > [!note] 0/1 Knapsack with item tracking, Subset Sum, and Partition Equal Subset Sum.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  
	  # ══════════════════════════════════════════════════════
	  # 1. 0/1 Knapsack — 2D DP (also tracks which items taken)
	  # ══════════════════════════════════════════════════════
	  def knapsack_2d(weights: list[int], values: list[int], W: int):
	      n = len(weights)
	      dp = [[0] * (W + 1) for _ in range(n + 1)]
	  
	      for i in range(1, n + 1):
	          w, v = weights[i-1], values[i-1]
	          for c in range(W + 1):
	              dp[i][c] = dp[i-1][c]            # Skip item i
	              if c >= w:
	                  dp[i][c] = max(dp[i][c], dp[i-1][c-w] + v)   # Take item i
	  
	      # Backtrack to find which items were taken
	      items_taken = []
	      c = W
	      for i in range(n, 0, -1):
	          if dp[i][c] != dp[i-1][c]:           # Item i was taken
	              items_taken.append(i-1)
	              c -= weights[i-1]
	  
	      return dp[n][W], list(reversed(items_taken))
	  
	  # ══════════════════════════════════════════════════════
	  # 2. 0/1 Knapsack — Space-Optimised 1D (O(W) space)
	  # ══════════════════════════════════════════════════════
	  def knapsack(weights: list[int], values: list[int], W: int) -> int:
	      dp = [0] * (W + 1)
	      for w, v in zip(weights, values):
	          for c in range(W, w - 1, -1):        # Right-to-left!
	              dp[c] = max(dp[c], dp[c - w] + v)
	      return dp[W]
	  
	  # ══════════════════════════════════════════════════════
	  # 3. Subset Sum — can we make sum S from subset of nums?
	  # ══════════════════════════════════════════════════════
	  def subset_sum(nums: list[int], S: int) -> bool:
	      dp = [False] * (S + 1)
	      dp[0] = True                             # Empty subset sums to 0
	      for num in nums:
	          for s in range(S, num - 1, -1):      # Right-to-left
	              dp[s] = dp[s] or dp[s - num]
	      return dp[S]
	  
	  # ══════════════════════════════════════════════════════
	  # 4. Partition Equal Subset Sum (LeetCode 416)
	  # ══════════════════════════════════════════════════════
	  def can_partition(nums: list[int]) -> bool:
	      total = sum(nums)
	      if total % 2 != 0: return False          # Odd total → impossible
	      return subset_sum(nums, total // 2)
	  
	  # Tests
	  weights = [2, 3, 4, 5]
	  values  = [3, 4, 5, 6]
	  W = 5
	  
	  max_val, items = knapsack_2d(weights, values, W)
	  print(f"Max value: {max_val}")   # 7
	  print(f"Items taken (0-indexed): {items}")   # [0, 1] → weights 2+3=5
	  
	  print(knapsack(weights, values, W))           # 7
	  print(subset_sum([3, 1, 1, 2, 2, 1], 5))     # True
	  print(can_partition([1, 5, 11, 5]))           # True (11 == 1+5+5)
	  print(can_partition([1, 2, 3, 5]))            # False
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  // 1D Space-Optimised Knapsack
	  int knapsack(const std::vector<int>& w, const std::vector<int>& v, int W) {
	      std::vector<int> dp(W+1, 0);
	      for (int i = 0; i < (int)w.size(); ++i)
	          for (int c = W; c >= w[i]; --c)
	              dp[c] = std::max(dp[c], dp[c-w[i]] + v[i]);
	      return dp[W];
	  }
	  
	  // Partition Equal Subset Sum
	  bool canPartition(const std::vector<int>& nums) {
	      int total = 0;
	      for (int x : nums) total += x;
	      if (total % 2) return false;
	      int half = total / 2;
	      std::vector<bool> dp(half+1, false);
	      dp[0] = true;
	      for (int x : nums)
	          for (int s = half; s >= x; --s)
	              dp[s] = dp[s] || dp[s-x];
	      return dp[half];
	  }
	  
	  int main() {
	      std::cout << knapsack({2,3,4,5},{3,4,5,6},5) << "\n"; // 7
	      std::cout << canPartition({1,5,11,5}) << "\n";         // 1 (true)
	      std::cout << canPartition({1,2,3,5}) << "\n";          // 0 (false)
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  class Knapsack {
	      static int knapsack(int[] w, int[] v, int W) {
	          int[] dp = new int[W+1];
	          for (int i=0;i<w.length;i++)
	              for (int c=W;c>=w[i];c--)
	                  dp[c] = Math.max(dp[c], dp[c-w[i]]+v[i]);
	          return dp[W];
	      }
	  
	      static boolean canPartition(int[] nums) {
	          int total = Arrays.stream(nums).sum();
	          if (total%2!=0) return false;
	          int half = total/2;
	          boolean[] dp = new boolean[half+1];
	          dp[0]=true;
	          for (int x:nums)
	              for (int s=half;s>=x;s--)
	                  dp[s]=dp[s]||dp[s-x];
	          return dp[half];
	      }
	  
	      public static void main(String[] args) {
	          System.out.println(knapsack(new int[]{2,3,4,5},new int[]{3,4,5,6},5)); // 7
	          System.out.println(canPartition(new int[]{1,5,11,5}));  // true
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  function knapsack(weights, values, W) {
	      const dp = new Array(W+1).fill(0);
	      for (let i=0;i<weights.length;i++)
	          for (let c=W;c>=weights[i];c--)
	              dp[c] = Math.max(dp[c], dp[c-weights[i]]+values[i]);
	      return dp[W];
	  }
	  
	  function canPartition(nums) {
	      const total = nums.reduce((a,b)=>a+b,0);
	      if (total%2!==0) return false;
	      const half=total/2, dp=new Array(half+1).fill(false);
	      dp[0]=true;
	      for (const x of nums)
	          for (let s=half;s>=x;s--)
	              dp[s]=dp[s]||dp[s-x];
	      return dp[half];
	  }
	  
	  console.log(knapsack([2,3,4,5],[3,4,5,6],5));  // 7
	  console.log(canPartition([1,5,11,5]));           // true
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Linq;
	  
	  class Knapsack {
	      static int Solve(int[] w, int[] v, int W) {
	          var dp = new int[W+1];
	          for (int i=0;i<w.Length;i++)
	              for (int c=W;c>=w[i];c--)
	                  dp[c]=Math.Max(dp[c],dp[c-w[i]]+v[i]);
	          return dp[W];
	      }
	  
	      static bool CanPartition(int[] nums) {
	          int total=nums.Sum();
	          if (total%2!=0) return false;
	          int half=total/2;
	          var dp=new bool[half+1]; dp[0]=true;
	          foreach(var x in nums)
	              for(int s=half;s>=x;s--)
	                  dp[s]=dp[s]||dp[s-x];
	          return dp[half];
	      }
	  
	      static void Main() {
	          Console.WriteLine(Solve(new[]{2,3,4,5},new[]{3,4,5,6},5));   // 7
	          Console.WriteLine(CanPartition(new[]{1,5,11,5}));              // True
	      }
	  }
	  ```
	  
	  :::

- # Variants
  collapsed:: true
	- | Variant | Change | Direction |
	  |---|---|---|
	  | **0/1 Knapsack** | Each item used ≤ 1 | Right-to-left |
	  | **Unbounded Knapsack** | Each item used unlimited times | Left-to-right |
	  | **Subset Sum** | Values = 1, check if target reachable | Right-to-left |
	  | **Partition Equal Subset** | Subset sum = total/2 | Right-to-left |
	  | **Coin Change (min coins)** | Unbounded, minimise count | Left-to-right |
	  | **Coin Change (count ways)** | Unbounded, count combinations | Left-to-right |

- # Key Takeaways
  collapsed:: true
	- State: `dp[i][c]` = max value using first i items with capacity c.
	- Recurrence: `max(skip, take)` — take only when `c >= weight[i]`.
	- 1D optimisation: iterate capacity **right-to-left** to enforce "each item used once".
	- **Backtracking** through 2D table reveals which items were selected.
	- Related: [[Dynamic Programming Concepts]], [[Longest Common Subsequence (LCS)]], [[Longest Increasing Subsequence (LIS)]]

- # More Learn
  collapsed:: true
	- ## LeetCode Problems
		- [LeetCode 416 – Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/)
		- [LeetCode 494 – Target Sum](https://leetcode.com/problems/target-sum/)
		- [LeetCode 474 – Ones and Zeroes (2D Knapsack)](https://leetcode.com/problems/ones-and-zeroes/)
