---
seoTitle: MO's Algorithm – Offline Square Root Decomposition for Range Queries
description: "Complete guide to MO's Algorithm for efficient offline range queries. Covers block sorting, O((N+Q)√N) complexity, add/remove operations, Hilbert curve ordering, and implementations in Python, C++, Java, JavaScript, and C#."
keywords: "MO's algorithm, square root decomposition, offline range queries, block sorting, sqrt(N), range sum, O((N+Q)sqrtN), competitive programming, VR-Rathod, Code-Note, code note vr"
displayTitle: MO's Algorithm (Query square root decomposition)
---

> [!info] What is MO's Algorithm?
> **MO's Algorithm** answers **multiple offline range queries** on a static array in **O((N + Q) × √N)** time — much better than O(N × Q) naive approach. It works by **sorting queries in a clever order** to minimize how much the left and right window pointers move across all queries combined.

- # Explanation
  collapsed:: true
	- ## The Problem
	  collapsed:: true
		- You have an array of N elements and Q queries `(L, R)` asking for some aggregate (sum, count distinct, XOR, etc.) of `arr[L..R]`.
		- **Naive:** Re-compute each query from scratch → O(N × Q).
		- **MO's:** Sort queries, maintain a sliding window, reuse previous work → O((N+Q)√N).
	-
	- ## The Key Insight — Query Ordering
	  collapsed:: true
		- Divide array into blocks of size **B = √N**.
		- Sort queries by: **(block of L, then R ascending for even blocks / R descending for odd blocks)**
		- This "Mo's ordering" minimizes total pointer movement:
			- **Right pointer** moves O(N) per block × O(√N) blocks = O(N√N) total
			- **Left pointer** moves O(√N) per query × O(Q) queries = O(Q√N) total
			- Total: **O((N + Q)√N)**
		- ```
		  Block size B = √N
		  
		  Queries sorted by:
		    1. block(L) = L / B
		    2. within same block: R ascending (even blocks) or R descending (odd blocks)
		  ```
	-
	- ## The Window Operations
	  collapsed:: true
		- For each query, extend/shrink the window by calling `add(x)` or `remove(x)`:
		- ```
		  while right < query.R: add(arr[++right])
		  while left  > query.L: add(arr[--left])
		  while right > query.R: remove(arr[right--])
		  while left  < query.L: remove(arr[left++])
		  answer[query.id] = current_aggregate
		  ```
	-
	- ## What can MO's compute?
	  collapsed:: true
		- | Query Type | add() / remove() | aggregate() |
		  |---|---|---|
		  | Range Sum | freq[x] += x | running sum |
		  | Count Distinct | freq[x]++/-- ; if 0→ count-- | count |
		  | Range XOR | xor ^= x | xor |
		  | Frequency mode | count array | max frequency |
	-
	- ## Complexity
	  collapsed:: true
		- | | Value |
		  |---|---|
		  | **Time** | O((N + Q) × √N) |
		  | **Space** | O(N + Q) for freq map and answers |
		  | **Constraint** | **Offline only** — all queries must be known in advance |
- # Implementation
  collapsed:: true
	- > [!note] MO's Algorithm applied to range sum queries and count-distinct queries on the same array.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  import math
	  from collections import defaultdict
	  
	  class MoAlgorithm:
	      def __init__(self, arr: list[int]):
	          self.arr   = arr
	          self.n     = len(arr)
	          self.block = max(1, int(math.isqrt(self.n)))
	  
	      def sort_queries(self, queries: list[tuple[int,int]]) -> list[tuple[int,int,int]]:
	          """Attach original index, then sort by MO's order."""
	          indexed = [(l, r, i) for i, (l, r) in enumerate(queries)]
	          return sorted(indexed,
	                        key=lambda q: (q[0] // self.block,
	                                    q[1] if (q[0] // self.block) % 2 == 0 else -q[1]))
	  
	      # ── Range Sum via MO ──────────────────────────────────────────────
	      def range_sums(self, queries: list[tuple[int,int]]) -> list[int]:
	          arr = self.arr
	          sorted_q = self.sort_queries(queries)
	          answers = [0] * len(queries)
	          curr_sum = 0
	          left = right = 0
	          curr_sum = arr[0]   # Initial window [0, 0]
	  
	          for ql, qr, qi in sorted_q:
	              while right < qr: right += 1; curr_sum += arr[right]
	              while left  > ql: left  -= 1; curr_sum += arr[left]
	              while right > qr: curr_sum -= arr[right]; right -= 1
	              while left  < ql: curr_sum -= arr[left];  left  += 1
	              answers[qi] = curr_sum
	  
	          return answers
	  
	      # ── Count Distinct via MO ─────────────────────────────────────────
	      def count_distinct(self, queries: list[tuple[int,int]]) -> list[int]:
	          arr = self.arr
	          sorted_q = self.sort_queries(queries)
	          answers  = [0] * len(queries)
	          freq     = defaultdict(int)
	          distinct = 0
	          left = right = 0
	          # Initialize window [0, 0]
	          freq[arr[0]] += 1; distinct = 1
	  
	          def add(idx: int):
	              nonlocal distinct
	              freq[arr[idx]] += 1
	              if freq[arr[idx]] == 1: distinct += 1
	  
	          def remove(idx: int):
	              nonlocal distinct
	              freq[arr[idx]] -= 1
	              if freq[arr[idx]] == 0: distinct -= 1
	  
	          for ql, qr, qi in sorted_q:
	              while right < qr: right += 1; add(right)
	              while left  > ql: left  -= 1; add(left)
	              while right > qr: remove(right); right -= 1
	              while left  < ql: remove(left);  left  += 1
	              answers[qi] = distinct
	  
	          return answers
	  
	  
	  # ── Demo ───────────────────────────────────────────────────────────
	  arr = [1, 2, 1, 3, 4, 2, 3, 1]
	  mo  = MoAlgorithm(arr)
	  
	  queries = [(0, 4), (2, 6), (1, 3), (0, 7)]
	  
	  print("Range Sums:    ", mo.range_sums(queries))
	  # query (0,4)= 1+2+1+3+4=11, (2,6)=1+3+4+2+3=13, (1,3)=2+1+3=6, (0,7)=17
	  
	  print("Count Distinct:", mo.count_distinct(queries))
	  # (0,4)→3 distinct {1,2,3,4}→4, (2,6)→{1,2,3,4}→4, (1,3)→{1,2,3}→3, (0,7)→4
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <vector>
	  #include <cmath>
	  #include <algorithm>
	  #include <unordered_map>
	  
	  struct Query { int l, r, idx; };
	  
	  int BLOCK;
	  
	  bool moCompare(const Query& a, const Query& b) {
	      int ba = a.l / BLOCK, bb = b.l / BLOCK;
	      if (ba != bb) return ba < bb;
	      return (ba % 2 == 0) ? (a.r < b.r) : (a.r > b.r);
	  }
	  
	  std::vector<int> moCountDistinct(const std::vector<int>& arr,
	                                   std::vector<Query>& queries) {
	      BLOCK = std::max(1, (int)std::sqrt(arr.size()));
	      std::sort(queries.begin(), queries.end(), moCompare);
	  
	      std::unordered_map<int,int> freq;
	      int distinct = 0, left = 0, right = -1;
	  
	      auto add = [&](int i) {
	          if (++freq[arr[i]] == 1) ++distinct;
	      };
	      auto rem = [&](int i) {
	          if (--freq[arr[i]] == 0) --distinct;
	      };
	  
	      std::vector<int> ans(queries.size());
	      for (const auto& q : queries) {
	          while (right < q.r) add(++right);
	          while (left  > q.l) add(--left);
	          while (right > q.r) rem(right--);
	          while (left  < q.l) rem(left++);
	          ans[q.idx] = distinct;
	      }
	      return ans;
	  }
	  
	  int main() {
	      std::vector<int> arr = {1,2,1,3,4,2,3,1};
	      std::vector<Query> queries = {{0,4,0},{2,6,1},{1,3,2},{0,7,3}};
	      auto ans = moCountDistinct(arr, queries);
	      for (int x : ans) std::cout << x << " ";
	      std::cout << "\n";   // 4 4 3 4
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  class MoAlgorithm {
	      int[] arr;
	      int block;
	  
	      MoAlgorithm(int[] arr) {
	          this.arr   = arr;
	          this.block = Math.max(1, (int)Math.sqrt(arr.length));
	      }
	  
	      int[] countDistinct(int[][] queries) {
	          int Q = queries.length;
	          Integer[] order = new Integer[Q];
	          for (int i = 0; i < Q; i++) order[i] = i;
	          Arrays.sort(order, (a, b) -> {
	              int ba = queries[a][0]/block, bb = queries[b][0]/block;
	              if (ba != bb) return ba-bb;
	              return (ba%2==0) ? queries[a][1]-queries[b][1] : queries[b][1]-queries[a][1];
	          });
	  
	          int[] freq = new int[100001], ans = new int[Q];
	          int distinct=0, left=0, right=-1;
	  
	          for (int qi : order) {
	              int ql = queries[qi][0], qr = queries[qi][1];
	              while (right < qr) { if(++freq[arr[++right]]==1) distinct++; }
	              while (left  > ql) { if(++freq[arr[--left]]==1) distinct++; }
	              while (right > qr) { if(--freq[arr[right--]]==0) distinct--; }
	              while (left  < ql) { if(--freq[arr[left++]]==0) distinct--; }
	              ans[qi] = distinct;
	          }
	          return ans;
	      }
	  
	      public static void main(String[] args) {
	          int[] arr = {1,2,1,3,4,2,3,1};
	          int[][] queries = {{0,4},{2,6},{1,3},{0,7}};
	          System.out.println(Arrays.toString(new MoAlgorithm(arr).countDistinct(queries)));
	          // [4, 4, 3, 4]
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  function moAlgorithm(arr, queries) {
	      const n = arr.length;
	      const block = Math.max(1, Math.floor(Math.sqrt(n)));
	  
	      const indexed = queries.map(([l, r], i) => [l, r, i]);
	      indexed.sort(([al, ar, ai], [bl, br, bi]) => {
	          const ba = Math.floor(al/block), bb = Math.floor(bl/block);
	          if (ba !== bb) return ba - bb;
	          return ba % 2 === 0 ? ar - br : br - ar;
	      });
	  
	      const freq = new Map();
	      let distinct = 0, left = 0, right = -1;
	      const ans = new Array(queries.length);
	  
	      const add = (i) => {
	          freq.set(arr[i], (freq.get(arr[i]) || 0) + 1);
	          if (freq.get(arr[i]) === 1) distinct++;
	      };
	      const rem = (i) => {
	          freq.set(arr[i], freq.get(arr[i]) - 1);
	          if (freq.get(arr[i]) === 0) distinct--;
	      };
	  
	      for (const [ql, qr, qi] of indexed) {
	          while (right < qr) add(++right);
	          while (left  > ql) add(--left);
	          while (right > qr) rem(right--);
	          while (left  < ql) rem(left++);
	          ans[qi] = distinct;
	      }
	      return ans;
	  }
	  
	  const arr = [1, 2, 1, 3, 4, 2, 3, 1];
	  console.log(moAlgorithm(arr, [[0,4],[2,6],[1,3],[0,7]]));  // [4, 4, 3, 4]
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  using System.Linq;
	  
	  class MoAlgorithm {
	      int[] arr; int block;
	  
	      public MoAlgorithm(int[] arr) {
	          this.arr   = arr;
	          this.block = Math.Max(1, (int)Math.Sqrt(arr.Length));
	      }
	  
	      public int[] CountDistinct(int[][] queries) {
	          int Q = queries.Length;
	          var order = Enumerable.Range(0, Q).OrderBy(i => {
	              int b = queries[i][0] / block;
	              return (b, b % 2 == 0 ? queries[i][1] : -queries[i][1]);
	          }).ToArray();
	  
	          var freq = new Dictionary<int,int>();
	          int distinct=0, left=0, right=-1;
	          var ans = new int[Q];
	  
	          void Add(int i) { freq.TryGetValue(arr[i], out int v); freq[arr[i]]=v+1; if(v==0) distinct++; }
	          void Rem(int i) { freq[arr[i]]--; if(freq[arr[i]]==0) distinct--; }
	  
	          foreach (var qi in order) {
	              int ql=queries[qi][0], qr=queries[qi][1];
	              while (right < qr) Add(++right);
	              while (left  > ql) Add(--left);
	              while (right > qr) Rem(right--);
	              while (left  < ql) Rem(left++);
	              ans[qi] = distinct;
	          }
	          return ans;
	      }
	  
	      static void Main() {
	          var arr = new[]{1,2,1,3,4,2,3,1};
	          var q   = new[]{new[]{0,4},new[]{2,6},new[]{1,3},new[]{0,7}};
	          Console.WriteLine(string.Join(", ", new MoAlgorithm(arr).CountDistinct(q)));
	          // 4, 4, 3, 4
	      }
	  }
	  ```
	  
	  :::
- # Key Takeaways
  collapsed:: true
	- **Sort queries** by (block of L, then R with alternating direction) to minimize total pointer travel.
	- Maintain a **sliding window** with `add()` and `remove()` — each runs in O(1).
	- Each pointer moves at most **O((N+Q)√N)** steps total across all queries.
	- Works for **any aggregate** that supports efficient single-element add/remove (sum, distinct, XOR, frequency mode).
	- **Offline only** — all queries must be known before processing starts.
	- Related: [[Prefix Sum Array]], [[Sliding Window Technique]], [[Distinct elements in subarray using Mos Algorithm]]
- # More Learn
  collapsed:: true
	- ## Resources
		- [CP-Algorithms — MO's Algorithm](https://cp-algorithms.com/data_structures/sqrt_decomposition.html)
		- [Codeforces — MO's Algorithm Tutorial](https://codeforces.com/blog/entry/61203)