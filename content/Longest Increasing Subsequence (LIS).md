---
seoTitle: Longest Increasing Subsequence (LIS) – DP & O(N log N) Guide
description: "Master the Longest Increasing Subsequence algorithm. Covers the O(N²) DP approach, the O(N log N) patience sorting with binary search, traceback reconstruction, and applications in scheduling and stack problems."
keywords: "Longest Increasing Subsequence, LIS, dynamic programming, patience sorting, binary search, O(N log N), subsequence, greedy, DP, Python, C++, Java, JavaScript"
displayTitle: Longest Increasing Subsequence (LIS)
---

> [!info] What is the Longest Increasing Subsequence?
> The **Longest Increasing Subsequence (LIS)** of an array is the longest subsequence of elements such that each element is **strictly greater than the previous** one.
> For example, in `[10, 9, 2, 5, 3, 7, 101, 18]`, the LIS is `[2, 3, 7, 101]` (length **4**).
> LIS can be solved in **$O(N^2)$ with DP** or optimally in **$O(N \log N)$** using patience sorting with binary search.

- # Explanation
  collapsed:: true
	- A **subsequence** preserves relative order but does not need to be contiguous. The LIS must be **strictly increasing** (no equal elements allowed unless the problem specifies non-decreasing).
	-
	- ## Two Approaches
	  collapsed:: true
		- ### O(N²) Dynamic Programming
		  - `dp[i]` = length of LIS ending at index `i`.
		  - **Recurrence**: `dp[i] = max(dp[j] + 1)` for all `j < i` where `arr[j] < arr[i]`.
		  - **Base case**: `dp[i] = 1` (every element is an LIS of length 1 by itself).
		  - Answer = `max(dp[i])` for all `i`.
		-
		- ### O(N log N) Patience Sorting
		  - Maintain a list `tails` where `tails[i]` = the smallest possible tail element of all increasing subsequences of length `i+1`.
		  - For each new element, **binary search** for its position in `tails`:
		    - If it extends all subsequences → append to `tails`.
		    - Otherwise → replace `tails[pos]` (keeps the door open for longer future subsequences).
		  - The LIS length = `len(tails)`.
	-
	- ## Core Properties
	  collapsed:: true
		- **Optimal Substructure**: The LIS ending at index `i` is built from the LIS ending at some earlier index `j`.
		- **Overlapping Subproblems**: `dp[i]` is needed multiple times — DP avoids recomputation.
		- **Greedy Insight** (O(N log N)): Keeping the smallest possible tail for each length maximizes the chance of extending future subsequences.

- # How It Works
  collapsed:: true
	- ## The Core Idea (O(N log N) Patience Sorting)
	  collapsed:: true
		- Think of laying playing cards into piles (like the card game Patience/Solitaire):
		  - Place each card on the leftmost pile whose top card is ≥ current card.
		  - If no such pile exists, start a new pile.
		  - The number of piles = LIS length.
		-
		- ```mermaid
		  flowchart TD
		      A["Initialize tails = []"] --> B["For each num in arr"]
		      B --> C{"Binary search for\nfirst tails[pos] >= num"}
		      C -- Found --> D["Replace tails[pos] = num\n(greedy: keep smallest tail)"]
		      C -- Not Found --> E["Append num to tails\n(extends longest subsequence)"]
		      D --> F["Continue"]
		      E --> F
		      F --> B
		      F --> G["LIS length = len(tails)"]

		      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		  ```
	-
	- ## Step-by-Step Trace (arr = [10, 9, 2, 5, 3, 7, 101, 18])
	  collapsed:: true
		- ```
		  O(N²) DP Trace:
		  arr: [10,  9,  2,  5,  3,  7, 101, 18]
		  dp:  [ 1,  1,  1,  0,  0,  0,   0,  0]

		  i=0 (10): dp[0]=1 (base)
		  i=1 (9):  9<10? No → dp[1]=1
		  i=2 (2):  2<10? No, 2<9? No → dp[2]=1
		  i=3 (5):  5>2? Yes → dp[3]=dp[2]+1=2
		  i=4 (3):  3>2? Yes → dp[4]=dp[2]+1=2
		  i=5 (7):  7>5? Yes → dp[5]=dp[3]+1=3; 7>3? dp[4]+1=3 → stays 3
		  i=6 (101): 101>7? Yes → dp[6]=dp[5]+1=4
		  i=7 (18): 18>7? Yes → dp[7]=dp[5]+1=4; 18<101 → stays 4

		  dp = [1, 1, 1, 2, 2, 3, 4, 4]
		  LIS length = max(dp) = 4 ✅

		  ──────────────────────────────────
		  O(N log N) Patience Sort Trace:
		  tails = []

		  num=10: tails=[] → no place found → append → tails=[10]
		  num=9:  bisect_left([10],9)=0 → replace → tails=[9]
		  num=2:  bisect_left([9],2)=0  → replace → tails=[2]
		  num=5:  bisect_left([2],5)=1  → append  → tails=[2,5]
		  num=3:  bisect_left([2,5],3)=1 → replace → tails=[2,3]
		  num=7:  bisect_left([2,3],7)=2 → append  → tails=[2,3,7]
		  num=101:bisect_left([2,3,7],101)=3 → append → tails=[2,3,7,101]
		  num=18: bisect_left([2,3,7,101],18)=3 → replace → tails=[2,3,7,18]

		  LIS length = len(tails) = 4 ✅
		  (Note: tails=[2,3,7,18] is NOT the LCS itself, just a structure to track length)
		  ```

- # Complexity Analysis
  collapsed:: true
	- | Approach | Time Complexity | Space Complexity | Supports Reconstruction? |
	  |---|---|---|---|
	  | **Naive Recursion** | **O(2^N)** | **O(N)** stack | ❌ |
	  | **DP (O(N²))** | **O(N²)** | **O(N)** dp array | ✅ via traceback |
	  | **Patience Sort (O(N log N))** | **O(N log N)** | **O(N)** tails array | ✅ with parent array |
	-
	- ## Why O(N log N)?
	  collapsed:: true
		- For each of the $N$ elements, we perform a binary search on `tails` (size at most $N$) → $O(\log N)$ per element → total $O(N \log N)$.
		- The greedy replacement never worsens the tails structure — it only improves future extension opportunities.

- # Implementation
  collapsed:: true
	- > [!note] LIS — Both O(N²) DP and O(N log N) Patience Sort
	  > The implementation below includes both approaches. The O(N log N) version also includes parent-array tracking to reconstruct the actual LIS sequence.
	  - Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs
	  
	  ```python
	  from bisect import bisect_left

	  def lis_dp(arr: list[int]) -> tuple[int, list[int]]:
	      """O(N²) DP — returns length and reconstructed LIS."""
	      n = len(arr)
	      if not arr: return 0, []
	      dp = [1] * n
	      parent = [-1] * n

	      for i in range(1, n):
	          for j in range(i):
	              if arr[j] < arr[i] and dp[j] + 1 > dp[i]:
	                  dp[i] = dp[j] + 1
	                  parent[i] = j

	      # Traceback
	      max_len = max(dp)
	      idx = dp.index(max_len)
	      lis = []
	      while idx != -1:
	          lis.append(arr[idx])
	          idx = parent[idx]
	      return max_len, lis[::-1]

	  def lis_nlogn(arr: list[int]) -> tuple[int, list[int]]:
	      """O(N log N) Patience Sort — returns length and reconstructed LIS."""
	      n = len(arr)
	      if not arr: return 0, []
	      tails = []        # tails[i] = smallest tail of IS with length i+1
	      tail_idx = []     # index in arr of each tail element
	      parent = [-1] * n

	      for i, num in enumerate(arr):
	          pos = bisect_left(tails, num)
	          if pos == len(tails):
	              tails.append(num)
	              tail_idx.append(i)
	          else:
	              tails[pos] = num
	              tail_idx[pos] = i
	          parent[i] = tail_idx[pos - 1] if pos > 0 else -1

	      # Traceback from last tail element
	      lis = []
	      idx = tail_idx[-1]
	      while idx != -1:
	          lis.append(arr[idx])
	          idx = parent[idx]
	      return len(tails), lis[::-1]

	  # Example
	  arr = [10, 9, 2, 5, 3, 7, 101, 18]
	  length, seq = lis_dp(arr)
	  print(f"DP   — Length: {length}, LIS: {seq}")    # 4, [2, 3, 7, 101]
	  length, seq = lis_nlogn(arr)
	  print(f"N logN— Length: {length}, LIS: {seq}")   # 4, [2, 3, 7, 18]
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>

	  // O(N log N) — length only
	  int lis_length(const std::vector<int>& arr) {
	      std::vector<int> tails;
	      for (int num : arr) {
	          auto it = std::lower_bound(tails.begin(), tails.end(), num);
	          if (it == tails.end())
	              tails.push_back(num);
	          else
	              *it = num;
	      }
	      return tails.size();
	  }

	  // O(N²) DP — with reconstruction
	  std::vector<int> lis_dp(const std::vector<int>& arr) {
	      int n = arr.size();
	      std::vector<int> dp(n, 1), parent(n, -1);
	      int max_len = 1, end_idx = 0;

	      for (int i = 1; i < n; ++i) {
	          for (int j = 0; j < i; ++j) {
	              if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) {
	                  dp[i] = dp[j] + 1;
	                  parent[i] = j;
	              }
	          }
	          if (dp[i] > max_len) { max_len = dp[i]; end_idx = i; }
	      }

	      std::vector<int> lis;
	      for (int i = end_idx; i != -1; i = parent[i]) lis.push_back(arr[i]);
	      std::reverse(lis.begin(), lis.end());
	      return lis;
	  }

	  int main() {
	      std::vector<int> arr = {10, 9, 2, 5, 3, 7, 101, 18};
	      std::cout << "LIS Length: " << lis_length(arr) << "\n"; // 4

	      auto lis = lis_dp(arr);
	      std::cout << "LIS: ";
	      for (int v : lis) std::cout << v << " "; // 2 3 7 101
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function lowerBound(arr, target) {
	      let lo = 0, hi = arr.length;
	      while (lo < hi) {
	          const mid = (lo + hi) >> 1;
	          if (arr[mid] < target) lo = mid + 1;
	          else hi = mid;
	      }
	      return lo;
	  }

	  function lisLength(arr) {
	      // O(N log N) — length only
	      const tails = [];
	      for (const num of arr) {
	          const pos = lowerBound(tails, num);
	          if (pos === tails.length) tails.push(num);
	          else tails[pos] = num;
	      }
	      return tails.length;
	  }

	  function lisDP(arr) {
	      // O(N²) DP — with reconstruction
	      const n = arr.length;
	      const dp = new Array(n).fill(1);
	      const parent = new Array(n).fill(-1);
	      let maxLen = 1, endIdx = 0;

	      for (let i = 1; i < n; i++) {
	          for (let j = 0; j < i; j++) {
	              if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) {
	                  dp[i] = dp[j] + 1;
	                  parent[i] = j;
	              }
	          }
	          if (dp[i] > maxLen) { maxLen = dp[i]; endIdx = i; }
	      }

	      const lis = [];
	      for (let i = endIdx; i !== -1; i = parent[i]) lis.push(arr[i]);
	      return lis.reverse();
	  }

	  const arr = [10, 9, 2, 5, 3, 7, 101, 18];
	  console.log("LIS Length:", lisLength(arr)); // 4
	  console.log("LIS:", lisDP(arr));            // [2, 3, 7, 101]
	  ```
	  
	  ```java
	  import java.util.*;

	  public class LIS {
	      // O(N log N) — length only
	      public static int lisLength(int[] arr) {
	          List<Integer> tails = new ArrayList<>();
	          for (int num : arr) {
	              int pos = Collections.binarySearch(tails, num);
	              if (pos < 0) pos = -(pos + 1); // insertion point
	              if (pos == tails.size()) tails.add(num);
	              else tails.set(pos, num);
	          }
	          return tails.size();
	      }

	      // O(N²) DP — with reconstruction
	      public static List<Integer> lisDP(int[] arr) {
	          int n = arr.length;
	          int[] dp = new int[n], parent = new int[n];
	          Arrays.fill(dp, 1);
	          Arrays.fill(parent, -1);
	          int maxLen = 1, endIdx = 0;

	          for (int i = 1; i < n; i++) {
	              for (int j = 0; j < i; j++) {
	                  if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) {
	                      dp[i] = dp[j] + 1;
	                      parent[i] = j;
	                  }
	              }
	              if (dp[i] > maxLen) { maxLen = dp[i]; endIdx = i; }
	          }

	          List<Integer> lis = new ArrayList<>();
	          for (int i = endIdx; i != -1; i = parent[i]) lis.add(0, arr[i]);
	          return lis;
	      }

	      public static void main(String[] args) {
	          int[] arr = {10, 9, 2, 5, 3, 7, 101, 18};
	          System.out.println("LIS Length: " + lisLength(arr)); // 4
	          System.out.println("LIS: " + lisDP(arr));            // [2, 3, 7, 101]
	      }
	  }
	  ```
	  
	  :::

- # Alternative Variant (Non-Decreasing LIS & 2D Variation)
  collapsed:: true
	- > [!tip] Non-Decreasing LIS & Box Stacking (2D LIS)
	  > Change `bisect_left` to `bisect_right` to allow **equal elements** (non-decreasing). For **2D problems** (e.g., Box Stacking — stack boxes where each dimension is smaller), sort by one dimension and apply LIS on the second dimension.
	-
	- :::code-tabs
	  
	  ```python
	  from bisect import bisect_right

	  def lis_non_decreasing(arr: list[int]) -> int:
	      """LIS allowing equal elements (non-strictly increasing)."""
	      tails = []
	      for num in arr:
	          pos = bisect_right(tails, num)  # bisect_right allows equals
	          if pos == len(tails):
	              tails.append(num)
	          else:
	              tails[pos] = num
	      return len(tails)

	  def box_stacking_lis(boxes: list[tuple[int, int]]) -> int:
	      """
	      Box stacking: given (width, height) pairs, find longest chain
	      where box[i].width < box[j].width AND box[i].height < box[j].height.
	      Sort by width, then apply LIS on height.
	      """
	      boxes.sort()  # sort by width ascending
	      heights = [h for _, h in boxes]
	      return lis_length_strictly(heights)

	  def lis_length_strictly(arr):
	      from bisect import bisect_left
	      tails = []
	      for num in arr:
	          pos = bisect_left(tails, num)
	          if pos == len(tails): tails.append(num)
	          else: tails[pos] = num
	      return len(tails)

	  # Examples
	  print(lis_non_decreasing([1, 2, 2, 3, 4]))   # 5 (includes equals)
	  print(box_stacking_lis([(1,3),(2,2),(3,4),(2,5)]))  # 2
	  ```
	  
	  :::

- # When to Use LIS
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Do you need the longest\nordered subsequence?"}
	      Q -- No --> R1["Use LCS for similarity\nor sorting for ordering"]
	      Q -- Yes --> S1{"Is N large\n(N > 10,000)?"}
	      S1 -- Yes --> R2["✅ Use O(N log N)\nPatience Sort + Binary Search"]
	      S1 -- No --> S2{"Do you need the\nactual sequence?"}
	      S2 -- Yes --> R3["✅ Use O(N²) DP\nwith parent traceback"]
	      S2 -- No --> R4["✅ Either approach works\nO(N log N) preferred"]

	      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
	  ```
	-
	- ## ✅ Use LIS When
		- Finding the length of the longest **strictly or non-decreasingly ordered** subsequence.
		- **Activity scheduling** — find the maximum number of non-overlapping intervals (sort by end, LIS on start).
		- **Box/envelope stacking** — longest chain of boxes where each dimension is strictly smaller.
		- **Patience Sorting** — optimal strategy for the card game Patience/Solitaire.
	-
	- ## ❌ Avoid LIS When
		- You need characters to match (not just ordering) — use **LCS** instead.
		- You need **all** increasing subsequences — exponential in count.
		- The ordering constraint is non-monotonic — standard LIS won't apply directly.

- # Key Takeaways
  collapsed:: true
	- **Two Algorithms** — $O(N^2)$ DP is simple and supports reconstruction; $O(N \log N)$ patience sort is optimal for large inputs.
	- **Greedy Insight** — The `tails` array replaces each element with the smallest possible tail, keeping subsequences extensible for as long as possible.
	- **tails ≠ LIS** — The `tails` array after processing gives the LIS **length** but not necessarily the actual LIS sequence. Use a parent array for traceback.
	- **bisect_left vs bisect_right** — `bisect_left` → strictly increasing LIS. `bisect_right` → non-decreasing LIS (allows equal elements).
	- **2D Generalization** — Sort by one dimension, apply LIS on the other (Box Stacking, Russian Doll Envelopes LeetCode #354).
	- **Dilworth's Theorem** — The minimum number of strictly decreasing subsequences to partition an array equals the LIS length (elegant duality).

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks → LIS O(N log N)](https://www.geeksforgeeks.org/longest-monotonically-increasing-subsequence-size-n-log-n/)
		- [CP Algorithms → LIS](https://cp-algorithms.com/sequences/longest_increasing_subsequence.html)
		- [LeetCode → Longest Increasing Subsequence (Problem 300)](https://leetcode.com/problems/longest-increasing-subsequence/)
		- [LeetCode → Russian Doll Envelopes (Problem 354)](https://leetcode.com/problems/russian-doll-envelopes/)
		- [TheAlgorithms – LIS (Python)](https://github.com/TheAlgorithms/Python/blob/master/dynamic_programming/longest_increasing_subsequence.py)
