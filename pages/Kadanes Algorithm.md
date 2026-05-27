---
seoTitle: Kadane's Algorithm – Maximum Subarray Sum in O(N) | In-Depth Guide
description: "Complete guide to Kadane's Algorithm for finding the maximum sum subarray in O(N) time. Covers DP intuition, local vs global max, all-negative arrays, subarray tracking, 2D extension, and implementations in Python, C++, Java, JavaScript, and C#."
keywords: "Kadane algorithm, maximum subarray, dynamic programming, O(n), linear time, subarray sum, negative numbers, maximum sum, interview problem, VR-Rathod, Code-Note, code note vr"
displayTitle: Kadane's Algorithm
---

> [!info] What is Kadane's Algorithm?
> **Kadane's Algorithm** finds the contiguous subarray within a 1D array that has the **largest sum**, in a single O(N) pass. It's a classic dynamic programming technique where at each position you make one greedy local decision: **extend the current subarray** or **start fresh** from the current element.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine you're tracking **daily profit/loss** for a store 🏪:
		  - Some days are profits (+), some are losses (−).
		  - You want to find the **best consecutive stretch** of days that maximized total profit.
		  - At each day, you ask: "Is it better to continue my current run, or start counting fresh from today?"
		  - That single decision, repeated N times, gives you the best period in O(N).
	-
	- ## The Core DP Decision
	  collapsed:: true
		- ```
		  For each element num at index i:
		  
		    current = max(num, current + num)
		    ─────────────────────────────────
		    Option A: num          → start a new subarray here
		    Option B: current + num → extend the previous subarray
		  
		  Whichever is bigger becomes the new "current best ending at i"
		  
		  global_max = max(global_max, current)
		  ```
		- This is **Bellman's principle of optimality** applied to arrays — the best subarray ending at `i` depends only on the best subarray ending at `i-1`.
	-
	- ## Visual Trace
	  collapsed:: true
		- Array: `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`
		- | i | num | current (max subarray ending here) | global_max |
		  |---|---|---|---|
		  | 0 | -2 | -2 | -2 |
		  | 1 | 1 | max(1, -2+1) = **1** | 1 |
		  | 2 | -3 | max(-3, 1-3) = **-2** | 1 |
		  | 3 | 4 | max(4, -2+4) = **4** | 4 |
		  | 4 | -1 | max(-1, 4-1) = **3** | 4 |
		  | 5 | 2 | max(2, 3+2) = **5** | 5 |
		  | 6 | 1 | max(1, 5+1) = **6** | **6** |
		  | 7 | -5 | max(-5, 6-5) = **1** | 6 |
		  | 8 | 4 | max(4, 1+4) = **5** | 6 |
		- **Answer:** Max subarray sum = **6**, from subarray `[4, -1, 2, 1]`
	-
	- ## Edge Cases
	  collapsed:: true
		- | Case | Behaviour |
		  |---|---|
		  | **All negative** | Returns the largest (least negative) single element |
		  | **All positive** | Returns sum of entire array |
		  | **Single element** | Returns that element |
		  | **Zero in array** | Works correctly — zero doesn't hurt the running sum |
		- **Tricky:** Initialise `current = arr[0]` and `max_sum = arr[0]` (not 0!) to handle all-negative arrays correctly.
	-
	- ## Complexity
	  collapsed:: true
		- | | Value |
		  |---|---|
		  | **Time** | O(N) — single pass |
		  | **Space** | O(1) — only 2 variables |

- # Implementation
  collapsed:: true
	- > [!note] Standard Kadane's + variant that also returns the actual subarray indices.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  from typing import Tuple
	  
	  def kadane(arr: list[int]) -> int:
	      """Returns maximum subarray sum."""
	      current = max_sum = arr[0]
	      for num in arr[1:]:
	          current = max(num, current + num)
	          max_sum = max(max_sum, current)
	      return max_sum
	  
	  
	  def kadane_with_indices(arr: list[int]) -> Tuple[int, int, int]:
	      """Returns (max_sum, start_index, end_index) of the best subarray."""
	      max_sum = current = arr[0]
	      start = end = 0
	      temp_start = 0
	  
	      for i in range(1, len(arr)):
	          if arr[i] > current + arr[i]:
	              current = arr[i]
	              temp_start = i          # Potential new start
	          else:
	              current += arr[i]
	  
	          if current > max_sum:
	              max_sum = current
	              start = temp_start      # Confirm new start
	              end   = i               # Update end
	  
	      return max_sum, start, end
	  
	  
	  # ── Tests ──────────────────────────────────────────────────────────
	  arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
	  print(f"Max Sum: {kadane(arr)}")                       # 6
	  
	  total, s, e = kadane_with_indices(arr)
	  print(f"Max Sum: {total} | Subarray: {arr[s:e+1]}")   # 6 | [4, -1, 2, 1]
	  
	  # All-negative array
	  neg = [-8, -3, -6, -2, -5]
	  print(f"All negative: {kadane(neg)}")                  # -2 (least negative)
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  #include <climits>
	  
	  struct Result { int maxSum, start, end; };
	  
	  // Standard Kadane
	  int kadane(const std::vector<int>& arr) {
	      int current = arr[0], maxSum = arr[0];
	      for (int i = 1; i < (int)arr.size(); ++i) {
	          current = std::max(arr[i], current + arr[i]);
	          maxSum  = std::max(maxSum, current);
	      }
	      return maxSum;
	  }
	  
	  // Kadane with index tracking
	  Result kadaneWithIndices(const std::vector<int>& arr) {
	      int current = arr[0], maxSum = arr[0];
	      int start = 0, end = 0, tempStart = 0;
	  
	      for (int i = 1; i < (int)arr.size(); ++i) {
	          if (arr[i] > current + arr[i]) {
	              current   = arr[i];
	              tempStart = i;
	          } else {
	              current += arr[i];
	          }
	          if (current > maxSum) {
	              maxSum = current;
	              start  = tempStart;
	              end    = i;
	          }
	      }
	      return {maxSum, start, end};
	  }
	  
	  int main() {
	      std::vector<int> arr = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
	  
	      std::cout << "Max Sum: " << kadane(arr) << "\n";  // 6
	  
	      auto [ms, s, e] = kadaneWithIndices(arr);
	      std::cout << "Max Sum: " << ms
	                << " | Indices: [" << s << ", " << e << "]\n";
	      for (int i = s; i <= e; ++i) std::cout << arr[i] << " ";
	      std::cout << "\n";
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.Arrays;
	  
	  class KadaneAlgorithm {
	  
	      static int kadane(int[] arr) {
	          int current = arr[0], maxSum = arr[0];
	          for (int i = 1; i < arr.length; i++) {
	              current = Math.max(arr[i], current + arr[i]);
	              maxSum  = Math.max(maxSum, current);
	          }
	          return maxSum;
	      }
	  
	      static int[] kadaneWithIndices(int[] arr) {
	          int current = arr[0], maxSum = arr[0];
	          int start = 0, end = 0, tempStart = 0;
	  
	          for (int i = 1; i < arr.length; i++) {
	              if (arr[i] > current + arr[i]) {
	                  current   = arr[i];
	                  tempStart = i;
	              } else {
	                  current += arr[i];
	              }
	              if (current > maxSum) {
	                  maxSum = current;
	                  start  = tempStart;
	                  end    = i;
	              }
	          }
	          return new int[]{maxSum, start, end};
	      }
	  
	      public static void main(String[] args) {
	          int[] arr = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
	  
	          System.out.println("Max Sum: " + kadane(arr));  // 6
	  
	          int[] res = kadaneWithIndices(arr);
	          System.out.printf("Max Sum: %d | Subarray: %s%n",
	              res[0], Arrays.toString(Arrays.copyOfRange(arr, res[1], res[2]+1)));
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  
	  function kadane(arr) {
	      let current = arr[0], maxSum = arr[0];
	      for (let i = 1; i < arr.length; i++) {
	          current = Math.max(arr[i], current + arr[i]);
	          maxSum  = Math.max(maxSum, current);
	      }
	      return maxSum;
	  }
	  
	  function kadaneWithIndices(arr) {
	      let current = arr[0], maxSum = arr[0];
	      let start = 0, end = 0, tempStart = 0;
	  
	      for (let i = 1; i < arr.length; i++) {
	          if (arr[i] > current + arr[i]) {
	              current   = arr[i];
	              tempStart = i;
	          } else {
	              current += arr[i];
	          }
	          if (current > maxSum) {
	              maxSum = current;
	              start  = tempStart;
	              end    = i;
	          }
	      }
	      return { maxSum, start, end, subarray: arr.slice(start, end + 1) };
	  }
	  
	  const arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
	  console.log("Max Sum:", kadane(arr));                    // 6
	  
	  const result = kadaneWithIndices(arr);
	  console.log(`Max Sum: ${result.maxSum} | Subarray: [${result.subarray}]`);
	  // Max Sum: 6 | Subarray: [4, -1, 2, 1]
	  
	  // All-negative
	  console.log("All negative:", kadane([-8, -3, -6, -2, -5]));  // -2
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  
	  class KadaneAlgorithm {
	      static int Kadane(int[] arr) {
	          int current = arr[0], maxSum = arr[0];
	          for (int i = 1; i < arr.Length; i++) {
	              current = Math.Max(arr[i], current + arr[i]);
	              maxSum  = Math.Max(maxSum, current);
	          }
	          return maxSum;
	      }
	  
	      static (int maxSum, int start, int end) KadaneWithIndices(int[] arr) {
	          int current = arr[0], maxSum = arr[0];
	          int start = 0, end = 0, tempStart = 0;
	  
	          for (int i = 1; i < arr.Length; i++) {
	              if (arr[i] > current + arr[i]) {
	                  current   = arr[i];
	                  tempStart = i;
	              } else {
	                  current += arr[i];
	              }
	              if (current > maxSum) {
	                  maxSum = current;
	                  start  = tempStart;
	                  end    = i;
	              }
	          }
	          return (maxSum, start, end);
	      }
	  
	      static void Main() {
	          int[] arr = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
	  
	          Console.WriteLine($"Max Sum: {Kadane(arr)}");  // 6
	  
	          var (ms, s, e) = KadaneWithIndices(arr);
	          Console.WriteLine($"Max Sum: {ms} | Indices: [{s}, {e}]");
	          Console.WriteLine("Subarray: " + string.Join(", ", arr[s..(e+1)]));
	      }
	  }
	  ```
	  
	  :::

- # Extensions & Variants
  collapsed:: true
	- ## Variant 1 — Circular Array Maximum Subarray
	  collapsed:: true
		- A circular subarray can wrap around. The answer is either:
		  - `kadane(arr)` — no wrap, OR
		  - `total_sum − kadane(−arr)` — wrap = total minus the minimum middle subarray
		- ```python
		  def max_circular_subarray(arr):
		      total    = sum(arr)
		      max_norm = kadane(arr)
		      max_wrap = total - kadane([-x for x in arr])   # total - min subarray
		      return max(max_norm, max_wrap) if max_wrap != 0 else max_norm
		  ```
	-
	- ## Variant 2 — 2D Maximum Sum Rectangle
	  collapsed:: true
		- Fix the left and right column boundaries, collapse each row into a 1D array (prefix sum per row), then run Kadane on that 1D array.
		- Time: O(N² × M) — standard approach for "max sum submatrix" problems.

- # Key Takeaways
  collapsed:: true
	- **Single pass O(N)** — the most efficient possible for this problem.
	- Core decision: `current = max(num, current + num)` — extend or restart.
	- **Initialise with `arr[0]`**, not 0 — handles all-negative arrays.
	- To track the actual subarray, record `tempStart` when restarting and commit `start = tempStart` when a new global max is found.
	- Related: [[Sliding Window Technique]], [[Prefix Sum Array]], [[Dynamic Programming Concepts]]

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [LeetCode 53 – Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)
		- [Wikipedia – Maximum Subarray Problem](https://en.wikipedia.org/wiki/Maximum_subarray_problem)