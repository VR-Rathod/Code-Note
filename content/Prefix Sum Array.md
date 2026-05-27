---
seoTitle: Prefix Sum Array – O(1) Range Query Pre-computation In-Depth Guide
description: "Complete guide to the Prefix Sum technique. Covers 1D and 2D prefix sums, range sum queries in O(1), subarray sum equals K, difference arrays, and implementations in Python, C++, Java, JavaScript, and C#."
keywords: "prefix sum, range sum query, subarray sum equals K, 2D prefix sum, difference array, O(1) query, pre-computation, array, VR-Rathod, Code-Note, code note vr"
displayTitle: Prefix Sum Array
---

> [!info] What is the Prefix Sum Technique?
> The **Prefix Sum Array** pre-computes the cumulative sum of an array in **O(N)** so that any **range sum query `sum(L, R)`** can be answered in **O(1)**. It is one of the most powerful pre-computation techniques in competitive programming and is the backbone of 2D image integrals, difference arrays, and subarray counting problems.

- # Explanation
  collapsed:: true
	- ## Core Idea
	  collapsed:: true
		- ```
		  Array:  [3,  1,  4,  1,  5,  9,  2,  6]
		  Index:   0   1   2   3   4   5   6   7
		  
		  Prefix: [0,  3,  4,  8,  9, 14, 23, 25, 31]
		           ^   ^                             ^
		           |   |                             |
		        P[0]=0  P[1]=3             P[8]=3+1+4+1+5+9+2+6=31
		  
		  Build:  P[0] = 0 (sentinel, simplifies queries)
		          P[i] = P[i-1] + arr[i-1]
		  
		  Query:  sum(L, R) = P[R+1] − P[L]
		                     (0-indexed, inclusive)
		  
		  Example: sum(2, 5) = P[6] − P[2] = 23 − 4 = 19
		           arr[2..5] = 4+1+5+9 = 19  ✓
		  ```
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine a **mileage odometer** 🚗:
		  - You record the odometer reading at every city.
		  - "How far from city 3 to city 7?" → `odometer[7] − odometer[3]`.
		  - You computed the answer in O(1) using precomputed running totals.
	-
	- ## 2D Prefix Sum — Submatrix Queries
	  collapsed:: true
		- ```
		  2D Array:         Prefix Sum Matrix P:
		  1  2  3           0  0  0  0
		  4  5  6    →      0  1  3  6
		  7  8  9           0  5 12 21
		                    0 12 27 45
		  
		  P[i][j] = A[i-1][j-1] + P[i-1][j] + P[i][j-1] - P[i-1][j-1]
		  
		  Query sum(r1,c1, r2,c2) =
		      P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]
		  ```
	-
	- ## Difference Array — Range Update in O(1)
	  collapsed:: true
		- Complement technique: add +val to range [L, R] in O(1), then reconstruct with prefix sum.
		- ```
		  diff[L]   += val
		  diff[R+1] -= val
		  Reconstruct: arr[i] = arr[i-1] + diff[i]
		  ```
	-
	- ## Complexity
	  collapsed:: true
		- | Operation | Time | Space |
		  |---|---|---|
		  | **Build** | O(N) | O(N) |
		  | **Query** | O(1) | — |
		  | **2D Build** | O(N×M) | O(N×M) |
		  | **2D Query** | O(1) | — |

- # Implementation
  collapsed:: true
	- > [!note] Four problems: Range Sum Query, Subarray Sum = K (with hashmap), 2D prefix sum, and Difference Array for range updates.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  from collections import defaultdict
	  
	  # ══════════════════════════════════════════════════════
	  # 1. 1D Prefix Sum — Range Query O(1)
	  # ══════════════════════════════════════════════════════
	  class PrefixSum:
	      def __init__(self, arr: list[int]):
	          n = len(arr)
	          self.prefix = [0] * (n + 1)         # sentinel at index 0
	          for i in range(n):
	              self.prefix[i+1] = self.prefix[i] + arr[i]
	  
	      def query(self, left: int, right: int) -> int:
	          """Sum of arr[left..right] inclusive (0-indexed)."""
	          return self.prefix[right+1] - self.prefix[left]
	  
	  arr = [3, 1, 4, 1, 5, 9, 2, 6]
	  ps  = PrefixSum(arr)
	  print(ps.query(2, 5))   # 4+1+5+9 = 19
	  print(ps.query(0, 7))   # 31 (full array)
	  
	  # ══════════════════════════════════════════════════════
	  # 2. Subarray Sum Equals K (LeetCode 560) — O(N)
	  # Running prefix + hashmap to count subarrays
	  # ══════════════════════════════════════════════════════
	  def subarray_sum_k(nums: list[int], k: int) -> int:
	      count = 0
	      prefix = 0
	      freq: dict[int, int] = defaultdict(int)
	      freq[0] = 1               # Empty subarray has sum 0
	  
	      for num in nums:
	          prefix += num
	          # How many previous prefixes satisfy: prefix - prev = k → prev = prefix - k
	          count += freq[prefix - k]
	          freq[prefix] += 1
	  
	      return count
	  
	  print(subarray_sum_k([1, 1, 1], 2))            # 2
	  print(subarray_sum_k([3, 4, 7, 2, -3, 1, 4, 2], 7))  # 4
	  
	  # ══════════════════════════════════════════════════════
	  # 3. 2D Prefix Sum — Submatrix Sum in O(1)
	  # ══════════════════════════════════════════════════════
	  class PrefixSum2D:
	      def __init__(self, matrix: list[list[int]]):
	          if not matrix: return
	          rows, cols = len(matrix), len(matrix[0])
	          self.P = [[0] * (cols + 1) for _ in range(rows + 1)]
	          for r in range(1, rows + 1):
	              for c in range(1, cols + 1):
	                  self.P[r][c] = (matrix[r-1][c-1]
	                                + self.P[r-1][c]
	                                + self.P[r][c-1]
	                                - self.P[r-1][c-1])
	  
	      def query(self, r1: int, c1: int, r2: int, c2: int) -> int:
	          """Sum of rectangle [r1,c1]..[r2,c2] inclusive (0-indexed)."""
	          return (self.P[r2+1][c2+1]
	                - self.P[r1][c2+1]
	                - self.P[r2+1][c1]
	                + self.P[r1][c1])
	  
	  grid = [[1,2,3],[4,5,6],[7,8,9]]
	  ps2d = PrefixSum2D(grid)
	  print(ps2d.query(0, 0, 1, 1))   # 1+2+4+5 = 12
	  print(ps2d.query(1, 1, 2, 2))   # 5+6+8+9 = 28
	  
	  # ══════════════════════════════════════════════════════
	  # 4. Difference Array — Range Update O(1), Reconstruct O(N)
	  # ══════════════════════════════════════════════════════
	  class DifferenceArray:
	      def __init__(self, n: int):
	          self.diff = [0] * (n + 1)
	  
	      def update(self, left: int, right: int, val: int) -> None:
	          """Add val to arr[left..right] in O(1)."""
	          self.diff[left]     += val
	          self.diff[right + 1] -= val
	  
	      def build(self) -> list[int]:
	          """Reconstruct array from difference array."""
	          arr = []
	          running = 0
	          for d in self.diff[:-1]:
	              running += d
	              arr.append(running)
	          return arr
	  
	  da = DifferenceArray(6)      # Array of 6 zeros
	  da.update(1, 3, 5)           # arr[1..3] += 5
	  da.update(2, 5, 3)           # arr[2..5] += 3
	  print(da.build())            # [0, 5, 8, 8, 3, 3]
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <vector>
	  #include <unordered_map>
	  
	  // 1. 1D Prefix Sum
	  class PrefixSum {
	      std::vector<int> P;
	  public:
	      PrefixSum(const std::vector<int>& a) : P(a.size()+1, 0) {
	          for (int i = 0; i < (int)a.size(); ++i) P[i+1] = P[i] + a[i];
	      }
	      int query(int l, int r) { return P[r+1] - P[l]; }
	  };
	  
	  // 2. Subarray Sum = K
	  int subarraySumK(const std::vector<int>& nums, int k) {
	      std::unordered_map<int,int> freq{{0,1}};
	      int count = 0, prefix = 0;
	      for (int x : nums) {
	          prefix += x;
	          if (freq.count(prefix - k)) count += freq[prefix - k];
	          freq[prefix]++;
	      }
	      return count;
	  }
	  
	  // 3. 2D Prefix Sum
	  class PrefixSum2D {
	      std::vector<std::vector<int>> P;
	  public:
	      PrefixSum2D(const std::vector<std::vector<int>>& m) {
	          int R = m.size(), C = m[0].size();
	          P.assign(R+1, std::vector<int>(C+1, 0));
	          for (int r=1;r<=R;r++) for (int c=1;c<=C;c++)
	              P[r][c] = m[r-1][c-1] + P[r-1][c] + P[r][c-1] - P[r-1][c-1];
	      }
	      int query(int r1,int c1,int r2,int c2) {
	          return P[r2+1][c2+1]-P[r1][c2+1]-P[r2+1][c1]+P[r1][c1];
	      }
	  };
	  
	  int main() {
	      std::vector<int> arr = {3,1,4,1,5,9,2,6};
	      PrefixSum ps(arr);
	      std::cout << "Range(2,5): " << ps.query(2,5) << "\n";      // 19
	  
	      std::cout << "SubarrayK:  " << subarraySumK({1,1,1},2) << "\n";  // 2
	  
	      std::vector<std::vector<int>> grid={{1,2,3},{4,5,6},{7,8,9}};
	      PrefixSum2D ps2(grid);
	      std::cout << "2D(0,0,1,1): " << ps2.query(0,0,1,1) << "\n"; // 12
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  class NumArray {
	      private final int[] prefix;
	      NumArray(int[] nums) {
	          prefix = new int[nums.length + 1];
	          for (int i = 0; i < nums.length; i++) prefix[i+1] = prefix[i] + nums[i];
	      }
	      int sumRange(int l, int r) { return prefix[r+1] - prefix[l]; }
	  }
	  
	  class PrefixSumDemo {
	      static int subarraySumK(int[] nums, int k) {
	          Map<Integer,Integer> freq = new HashMap<>();
	          freq.put(0, 1);
	          int count = 0, prefix = 0;
	          for (int x : nums) {
	              prefix += x;
	              count += freq.getOrDefault(prefix - k, 0);
	              freq.merge(prefix, 1, Integer::sum);
	          }
	          return count;
	      }
	  
	      public static void main(String[] args) {
	          int[] arr = {3,1,4,1,5,9,2,6};
	          NumArray ps = new NumArray(arr);
	          System.out.println("Range(2,5): " + ps.sumRange(2,5));    // 19
	          System.out.println("SubarrayK:  " + subarraySumK(new int[]{1,1,1},2)); // 2
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  
	  class PrefixSum {
	      constructor(arr) {
	          this.P = new Array(arr.length + 1).fill(0);
	          for (let i = 0; i < arr.length; i++) this.P[i+1] = this.P[i] + arr[i];
	      }
	      query(l, r) { return this.P[r+1] - this.P[l]; }
	  }
	  
	  function subarraySumK(nums, k) {
	      const freq = new Map([[0, 1]]);
	      let count = 0, prefix = 0;
	      for (const x of nums) {
	          prefix += x;
	          count += (freq.get(prefix - k) || 0);
	          freq.set(prefix, (freq.get(prefix) || 0) + 1);
	      }
	      return count;
	  }
	  
	  const arr = [3,1,4,1,5,9,2,6];
	  const ps = new PrefixSum(arr);
	  console.log("Range(2,5):", ps.query(2, 5));             // 19
	  console.log("SubarrayK: ", subarraySumK([1,1,1], 2));  // 2
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  
	  class PrefixSum {
	      readonly int[] P;
	      public PrefixSum(int[] a) {
	          P = new int[a.Length + 1];
	          for (int i = 0; i < a.Length; i++) P[i+1] = P[i] + a[i];
	      }
	      public int Query(int l, int r) => P[r+1] - P[l];
	  }
	  
	  class PrefixSumDemo {
	      static int SubarraySumK(int[] nums, int k) {
	          var freq = new Dictionary<int,int> {{0,1}};
	          int count = 0, prefix = 0;
	          foreach (var x in nums) {
	              prefix += x;
	              freq.TryGetValue(prefix-k, out int c); count += c;
	              freq.TryGetValue(prefix, out int v); freq[prefix] = v + 1;
	          }
	          return count;
	      }
	  
	      static void Main() {
	          var ps = new PrefixSum(new[]{3,1,4,1,5,9,2,6});
	          Console.WriteLine($"Range(2,5): {ps.Query(2,5)}");            // 19
	          Console.WriteLine($"SubarrayK:  {SubarraySumK(new[]{1,1,1}, 2)}"); // 2
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- **Build O(N), Query O(1)** — the core trade-off: pay once, query many times.
	- Formula: `prefix[i] = prefix[i-1] + arr[i]` · `sum(L,R) = prefix[R+1] - prefix[L]`.
	- **Subarray Sum = K** uses a running prefix + hashmap: look up `freq[prefix − k]` at each step.
	- **2D Prefix Sum** enables O(1) sub-matrix sum queries (image integral, used in image processing and competitive programming).
	- **Difference Array** is the inverse: range updates in O(1), reconstruct with a prefix sum.
	- Related: [[Sliding Window Technique]], [[Kadane's Algorithm]], [[MOs Algorithm (Query square root decomposition)]]

- # More Learn
  collapsed:: true
	- ## LeetCode Problems
		- [LeetCode 303 – Range Sum Query (Immutable)](https://leetcode.com/problems/range-sum-query-immutable/)
		- [LeetCode 560 – Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/)
		- [LeetCode 304 – Range Sum Query 2D](https://leetcode.com/problems/range-sum-query-2d-immutable/)
		- [LeetCode 1109 – Corporate Flight Bookings (Difference Array)](https://leetcode.com/problems/corporate-flight-bookings/)
