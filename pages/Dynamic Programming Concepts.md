---
seoTitle: Dynamic Programming – Memoization & Tabulation In-Depth Guide
description: "Complete guide to Dynamic Programming. Covers optimal substructure, overlapping subproblems, memoization (top-down), tabulation (bottom-up), state design, space optimisation, and implementations in Python, C++, Java, JavaScript, and C#."
keywords: "dynamic programming, memoization, tabulation, top-down, bottom-up, optimal substructure, overlapping subproblems, recurrence, DP, VR-Rathod, Code-Note, code note vr"
displayTitle: Dynamic Programming Concepts
---

> [!info] What is Dynamic Programming?
> **Dynamic Programming (DP)** solves complex problems by breaking them into **overlapping subproblems**, solving each subproblem once, and storing results to avoid redundant recomputation. It is applicable when a problem has **Optimal Substructure** and **Overlapping Subproblems** — the two mandatory properties.

- # Core Properties
  collapsed:: true
	- ## 1. Optimal Substructure
	  collapsed:: true
		- The optimal solution to the problem contains optimal solutions to its subproblems.
		- ```
		  Shortest path A→C through B = shortest path A→B + shortest path B→C
		  LCS("ABCD", "ACBD") = built from LCS of prefixes
		  ```
		- **Does NOT hold for:** Longest simple path (without revisiting nodes) in a general graph.
	-
	- ## 2. Overlapping Subproblems
	  collapsed:: true
		- The same subproblems are solved multiple times in naive recursion.
		- ```
		  Fibonacci naïve:
		    fib(5) = fib(4) + fib(3)
		    fib(4) = fib(3) + fib(2)    ← fib(3) computed twice!
		    fib(3) = fib(2) + fib(1)    ← fib(2) computed 3×!
		  
		  Time: O(2^N) without DP → O(N) with DP
		  ```
		- **Does NOT hold for:** Merge Sort (subproblems are distinct, non-overlapping).

- # Two DP Paradigms
  collapsed:: true
	- ## Top-Down — Memoization
	  collapsed:: true
		- Write the **natural recursion** exactly as the mathematical definition, then add a cache (memo table) to store results of already-solved subproblems.
		- ```
		  cache = {}
		  
		  def dp(state):
		      if state in cache:        ← Check cache first
		          return cache[state]
		      if base_case(state):
		          return base_value
		      
		      result = combine(dp(substate1), dp(substate2), ...)
		      cache[state] = result     ← Store result
		      return result
		  ```
		- **Pros:** Only computes states that are actually needed (lazy). Natural to write from recurrence.
		- **Cons:** Recursion stack overhead; Python has recursion limit.
	-
	- ## Bottom-Up — Tabulation
	  collapsed:: true
		- Iteratively fill a table in **dependency order** — smaller subproblems first, larger ones after.
		- ```
		  # Fill dp[] from base cases upward
		  dp[0] = base_case_0
		  dp[1] = base_case_1
		  
		  for i in range(2, n+1):
		      dp[i] = recurrence(dp[i-1], dp[i-2], ...)
		  
		  return dp[n]
		  ```
		- **Pros:** No recursion stack; easier to apply space optimisation; usually faster in practice.
		- **Cons:** Must fill all states even if some aren't needed.
	-
	- ## Comparison
	  collapsed:: true
		- | Aspect | Top-Down (Memo) | Bottom-Up (Tabulation) |
		  |---|---|---|
		  | **Code style** | Recursive (natural) | Iterative |
		  | **Subproblems solved** | Only reachable ones | All states |
		  | **Stack overhead** | Yes | No |
		  | **Space optimisation** | Harder | Easy (rolling array) |
		  | **Speed in practice** | Slightly slower | Slightly faster |

- # The DP Design Framework
  collapsed:: true
	- ```
	  Step 1: IDENTIFY the subproblem
	      → What information do I need to solve a smaller version?
	      → dp[i], dp[i][j], dp[i][j][k], dp[mask], dp[i][last]...
	  
	  Step 2: WRITE the recurrence
	      → Express dp[state] in terms of smaller states
	      → Identify base cases
	  
	  Step 3: CHOOSE approach
	      → Top-down: add @cache to recursion
	      → Bottom-up: fill table in topological order
	  
	  Step 4: OPTIMISE space
	      → If dp[i] depends only on dp[i-1], use two variables
	      → If dp[i][j] depends only on dp[i-1][...], use 1D rolling array
	  ```

- # Implementation — Fibonacci (Learning Template)
  collapsed:: true
	- > [!note] Fibonacci shows all 4 approaches: naive recursion, memoization, tabulation, and O(1) space.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  import sys
	  from functools import lru_cache
	  sys.setrecursionlimit(10000)
	  
	  # ══════════════════════════════════════════════════════
	  # 1. Naive Recursion — O(2^N) time  (DO NOT USE for large N)
	  # ══════════════════════════════════════════════════════
	  def fib_naive(n: int) -> int:
	      if n <= 1: return n
	      return fib_naive(n - 1) + fib_naive(n - 2)
	  
	  # ══════════════════════════════════════════════════════
	  # 2. Top-Down Memoization — O(N) time, O(N) space
	  # ══════════════════════════════════════════════════════
	  @lru_cache(maxsize=None)
	  def fib_memo(n: int) -> int:
	      if n <= 1: return n
	      return fib_memo(n - 1) + fib_memo(n - 2)
	  
	  # Without decorator (explicit cache):
	  def fib_memo_explicit(n: int, memo: dict = {}) -> int:
	      if n in memo: return memo[n]
	      if n <= 1:    return n
	      memo[n] = fib_memo_explicit(n-1, memo) + fib_memo_explicit(n-2, memo)
	      return memo[n]
	  
	  # ══════════════════════════════════════════════════════
	  # 3. Bottom-Up Tabulation — O(N) time, O(N) space
	  # ══════════════════════════════════════════════════════
	  def fib_tab(n: int) -> int:
	      if n <= 1: return n
	      dp = [0] * (n + 1)
	      dp[1] = 1
	      for i in range(2, n + 1):
	          dp[i] = dp[i-1] + dp[i-2]
	      return dp[n]
	  
	  # ══════════════════════════════════════════════════════
	  # 4. Space-Optimised — O(N) time, O(1) space
	  # ══════════════════════════════════════════════════════
	  def fib(n: int) -> int:
	      a, b = 0, 1
	      for _ in range(n):
	          a, b = b, a + b
	      return a
	  
	  # ══════════════════════════════════════════════════════
	  # 5. Coin Change — classic DP template
	  # ══════════════════════════════════════════════════════
	  def coin_change(coins: list[int], amount: int) -> int:
	      """Minimum number of coins to make `amount`. -1 if impossible."""
	      INF = float("inf")
	      dp = [INF] * (amount + 1)
	      dp[0] = 0                                    # Base case
	      for a in range(1, amount + 1):
	          for coin in coins:
	              if a >= coin:
	                  dp[a] = min(dp[a], dp[a - coin] + 1)
	      return dp[amount] if dp[amount] != INF else -1
	  
	  # Tests
	  print([fib(i) for i in range(10)])   # [0,1,1,2,3,5,8,13,21,34]
	  print(fib_memo(40))                   # 102334155
	  print(coin_change([1,5,6,9], 11))     # 2 (coins: 5+6)
	  print(coin_change([2], 3))            # -1
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <vector>
	  #include <unordered_map>
	  #include <climits>
	  
	  // 1. Top-Down Memoization
	  std::unordered_map<int,long long> memo;
	  long long fibMemo(int n) {
	      if (n <= 1) return n;
	      if (memo.count(n)) return memo[n];
	      return memo[n] = fibMemo(n-1) + fibMemo(n-2);
	  }
	  
	  // 2. Bottom-Up Tabulation
	  long long fibTab(int n) {
	      if (n <= 1) return n;
	      std::vector<long long> dp(n+1);
	      dp[0]=0; dp[1]=1;
	      for (int i=2; i<=n; ++i) dp[i]=dp[i-1]+dp[i-2];
	      return dp[n];
	  }
	  
	  // 3. Space-Optimised
	  long long fib(int n) {
	      long long a=0, b=1;
	      for (int i=0; i<n; ++i) { long long t=a+b; a=b; b=t; }
	      return a;
	  }
	  
	  // 4. Coin Change
	  int coinChange(const std::vector<int>& coins, int amount) {
	      std::vector<int> dp(amount+1, INT_MAX);
	      dp[0]=0;
	      for (int a=1; a<=amount; ++a)
	          for (int c : coins)
	              if (a>=c && dp[a-c]!=INT_MAX)
	                  dp[a] = std::min(dp[a], dp[a-c]+1);
	      return dp[amount]==INT_MAX ? -1 : dp[amount];
	  }
	  
	  int main() {
	      for (int i=0;i<10;++i) std::cout<<fib(i)<<" "; std::cout<<"\n";
	      std::cout<<fibMemo(40)<<"\n";
	      std::cout<<coinChange({1,5,6,9},11)<<"\n"; // 2
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  class DPDemo {
	      // 1. Memoization
	      static Map<Integer,Long> memo = new HashMap<>();
	      static long fibMemo(int n) {
	          if (n<=1) return n;
	          if (memo.containsKey(n)) return memo.get(n);
	          long res = fibMemo(n-1)+fibMemo(n-2);
	          memo.put(n,res); return res;
	      }
	  
	      // 2. Tabulation
	      static long fibTab(int n) {
	          if (n<=1) return n;
	          long[] dp = new long[n+1];
	          dp[1]=1;
	          for (int i=2;i<=n;i++) dp[i]=dp[i-1]+dp[i-2];
	          return dp[n];
	      }
	  
	      // 3. Space-Optimised
	      static long fib(int n) {
	          long a=0,b=1;
	          for (int i=0;i<n;i++){long t=a+b;a=b;b=t;}
	          return a;
	      }
	  
	      // 4. Coin Change
	      static int coinChange(int[] coins, int amount) {
	          int[] dp = new int[amount+1];
	          Arrays.fill(dp, amount+1);
	          dp[0]=0;
	          for (int a=1;a<=amount;a++)
	              for (int c:coins) if(a>=c) dp[a]=Math.min(dp[a],dp[a-c]+1);
	          return dp[amount]>amount ? -1 : dp[amount];
	      }
	  
	      public static void main(String[] args) {
	          for (int i=0;i<10;i++) System.out.print(fib(i)+" ");
	          System.out.println();
	          System.out.println(coinChange(new int[]{1,5,6,9},11)); // 2
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  
	  // 1. Memoization (closure cache)
	  const fibMemo = (() => {
	      const cache = new Map([[0,0],[1,1]]);
	      return function fib(n) {
	          if (cache.has(n)) return cache.get(n);
	          const res = fib(n-1) + fib(n-2);
	          cache.set(n, res); return res;
	      };
	  })();
	  
	  // 2. Tabulation
	  function fibTab(n) {
	      if (n <= 1) return n;
	      const dp = [0, 1];
	      for (let i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];
	      return dp[n];
	  }
	  
	  // 3. Space-Optimised
	  function fib(n) {
	      let [a, b] = [0, 1];
	      for (let i = 0; i < n; i++) [a, b] = [b, a + b];
	      return a;
	  }
	  
	  // 4. Coin Change
	  function coinChange(coins, amount) {
	      const dp = new Array(amount + 1).fill(Infinity);
	      dp[0] = 0;
	      for (let a = 1; a <= amount; a++)
	          for (const c of coins)
	              if (a >= c) dp[a] = Math.min(dp[a], dp[a-c] + 1);
	      return dp[amount] === Infinity ? -1 : dp[amount];
	  }
	  
	  console.log(Array.from({length:10},(_,i)=>fib(i)));  // [0,1,1,2,3,5,8,13,21,34]
	  console.log(coinChange([1,5,6,9], 11));               // 2
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  
	  class DPDemo {
	      static Dictionary<int,long> memo = new();
	  
	      static long FibMemo(int n) {
	          if (n <= 1) return n;
	          if (memo.TryGetValue(n, out long v)) return v;
	          return memo[n] = FibMemo(n-1) + FibMemo(n-2);
	      }
	  
	      static long Fib(int n) {
	          long a=0, b=1;
	          for (int i=0;i<n;i++){long t=a+b;a=b;b=t;}
	          return a;
	      }
	  
	      static int CoinChange(int[] coins, int amount) {
	          var dp = new int[amount+1];
	          Array.Fill(dp, amount+1);
	          dp[0]=0;
	          for (int a=1;a<=amount;a++)
	              foreach (var c in coins)
	                  if (a>=c) dp[a]=Math.Min(dp[a],dp[a-c]+1);
	          return dp[amount]>amount ? -1 : dp[amount];
	      }
	  
	      static void Main() {
	          for (int i=0;i<10;i++) Console.Write(Fib(i)+" ");
	          Console.WriteLine();
	          Console.WriteLine(CoinChange(new[]{1,5,6,9},11)); // 2
	      }
	  }
	  ```
	  
	  :::

- # DP Problem Categories
  collapsed:: true
	- | Category | Examples | Pattern |
	  |---|---|---|
	  | **Linear** | Fibonacci, Climbing Stairs | dp[i] = f(dp[i-1], dp[i-2]) |
	  | **Knapsack** | 0/1 Knapsack, Subset Sum | dp[i][w] = take/skip item |
	  | **String** | LCS, Edit Distance, LIS | dp[i][j] on two strings/arrays |
	  | **Interval** | Matrix Chain, Burst Balloons | dp[i][j] = try all split points k |
	  | **Tree** | Tree DP, House Robber III | dp[node][included/excluded] |
	  | **Bitmask** | TSP, Assignment | dp[mask][i] = states as subsets |
	  | **Digit** | Count numbers with property | dp[pos][tight][...] |

- # Key Takeaways
  collapsed:: true
	- Two required properties: **Optimal Substructure** + **Overlapping Subproblems**.
	- **Memoization** = recursion + cache (top-down). **Tabulation** = iterative + table (bottom-up).
	- Design state → write recurrence → choose approach → optimise space.
	- Space optimisation: if dp[i] depends only on dp[i-1], use two variables (O(1) space).
	- Related: [[0/1 Knapsack Problem]], [[Longest Common Subsequence (LCS)]], [[Longest Increasing Subsequence (LIS)]], [[Matrix Chain Multiplication]]

- # More Learn
  collapsed:: true
	- ## LeetCode
		- [LeetCode 70 – Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)
		- [LeetCode 322 – Coin Change](https://leetcode.com/problems/coin-change/)
		- [LeetCode 300 – Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)
