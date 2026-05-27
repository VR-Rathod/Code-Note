---
seoTitle: Count Distinct Elements in Subarray – MO's Algorithm Variant | In-Depth Guide
description: "Complete guide to counting distinct elements in subarrays using MO's Algorithm. Covers frequency map add/remove, offline query processing, O((N+Q)√N) complexity, and implementations in Python, C++, Java, JavaScript, and C#."
keywords: "distinct elements subarray, Mo's algorithm, count distinct, offline queries, frequency map, square root decomposition, range query, VR-Rathod, Code-Note, code note vr"
displayTitle: Distinct elements in subarray using Mo's Algorithm
---

> [!info] What is this problem?
> Given an array and Q offline queries of the form `(L, R)`, answer: **"How many distinct elements exist in `arr[L..R]`?"** Using a naive approach each query takes O(N), giving O(N×Q) total. MO's Algorithm reduces this to **O((N+Q)×√N)** by smartly ordering queries and maintaining a sliding window with a frequency map.

- # Explanation
  collapsed:: true
	- ## Why MO's Works Here
	  collapsed:: true
		- The key property of this problem is that distinct count can be maintained **incrementally**:
		- **Add element `x` to window:**
		  ```
		  freq[x]++
		  if freq[x] == 1:   # First occurrence → new distinct
		      distinct++
		  ```
		- **Remove element `x` from window:**
		  ```
		  freq[x]--
		  if freq[x] == 0:   # Last occurrence gone → one fewer distinct
		      distinct--
		  ```
		- Each add/remove is **O(1)** → total work is just the number of pointer moves = O((N+Q)√N).
	-
	- ## Step-by-Step Trace
	  collapsed:: true
		- Array: `[1, 2, 1, 3, 4, 2]`
		- Queries sorted by MO order (block=2): `(1,3)`, `(0,4)`, `(2,6)`
		- ```
		  Initial window: [] → distinct=0, freq={}
		  
		  Query (1,3):
		    Add arr[0]=1 → freq={1:1} distinct=1
		    Add arr[1]=2 → freq={1:1,2:1} distinct=2
		    → [wait, left must move to 1]
		    actually window [1..3]: arr[1..3] = [2,1,3]
		    freq={2:1,1:1,3:1} distinct=3
		  
		  Query (0,4): extend left to 0, extend right to 4
		    arr[0]=1 → freq={1:2,...} distinct still 3 (1 already in)
		    arr[4]=4 → freq[4]=1 → distinct=4+1=5? No → check arr[0..4]
		    → [1,2,1,3,4] → distinct elements: {1,2,3,4} = 4
		  ```
	-
	- ## Complexity
	  collapsed:: true
		- | | Value |
		  |---|---|
		  | **Time** | O((N + Q) × √N) |
		  | **Space** | O(N) for frequency map + O(Q) for answers |
		  | **Constraint** | Offline — all queries known upfront |

- # Implementation
  collapsed:: true
	- > [!note] Full MO's-based distinct count: frequency map, Mo ordering, pointer management, and result retrieval.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  import math
	  from collections import defaultdict
	  from typing import NamedTuple
	  
	  class Query(NamedTuple):
	      l: int
	      r: int
	      idx: int
	  
	  def distinct_in_subarrays(arr: list[int], queries: list[tuple[int, int]]) -> list[int]:
	      n     = len(arr)
	      block = max(1, int(math.isqrt(n)))
	  
	      # Sort queries: by block of L, then R direction alternates
	      sorted_q = sorted(
	          [Query(l, r, i) for i, (l, r) in enumerate(queries)],
	          key=lambda q: (q.l // block, q.r if (q.l // block) % 2 == 0 else -q.r)
	      )
	  
	      freq     = defaultdict(int)
	      distinct = 0
	      answers  = [0] * len(queries)
	  
	      def add(i: int) -> None:
	          nonlocal distinct
	          freq[arr[i]] += 1
	          if freq[arr[i]] == 1:
	              distinct += 1
	  
	      def remove(i: int) -> None:
	          nonlocal distinct
	          freq[arr[i]] -= 1
	          if freq[arr[i]] == 0:
	              distinct -= 1
	  
	      # Start with empty window; left will be initialised at first query
	      left  = 0
	      right = -1   # Empty window
	  
	      for q in sorted_q:
	          # Expand right
	          while right < q.r: right += 1; add(right)
	          # Expand left
		      while left  > q.l: left  -= 1; add(left)
	          # Shrink right
	          while right > q.r: remove(right); right -= 1
	          # Shrink left
	          while left  < q.l: remove(left);  left  += 1
	  
	          answers[q.idx] = distinct
	  
	      return answers
	  
	  
	  # ── Demo ──────────────────────────────────────────────────────────
	  arr     = [1, 2, 1, 3, 4, 2, 3, 1]
	  queries = [(0, 4), (2, 6), (1, 3), (0, 7), (3, 7)]
	  
	  results = distinct_in_subarrays(arr, queries)
	  for (l, r), ans in zip(queries, results):
	      subarray = arr[l:r+1]
	      print(f"arr[{l}..{r}] = {subarray} → distinct = {ans}  (expected: {len(set(subarray))})")
	  
	  # arr[0..4] = [1,2,1,3,4] → distinct = 4  (expected: 4)
	  # arr[2..6] = [1,3,4,2,3] → distinct = 4  (expected: 4)
	  # arr[1..3] = [2,1,3]     → distinct = 3  (expected: 3)
	  # arr[0..7] = [1,2,1,3,4,2,3,1] → distinct = 4 (expected: 4)
	  # arr[3..7] = [3,4,2,3,1] → distinct = 4  (expected: 4)
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  #include <unordered_map>
	  #include <cmath>
	  
	  struct Query { int l, r, idx; };
	  
	  std::vector<int> distinctInSubarrays(const std::vector<int>& arr,
	                                       std::vector<Query> queries) {
	      int n = arr.size();
	      int block = std::max(1, (int)std::sqrt(n));
	  
	      std::sort(queries.begin(), queries.end(), [&](const Query& a, const Query& b) {
	          int ba = a.l/block, bb = b.l/block;
	          if (ba != bb) return ba < bb;
	          return (ba % 2 == 0) ? (a.r < b.r) : (a.r > b.r);
	      });
	  
	      std::unordered_map<int,int> freq;
	      int distinct = 0, left = 0, right = -1;
	  
	      auto add = [&](int i) { if (++freq[arr[i]] == 1) ++distinct; };
	      auto rem = [&](int i) { if (--freq[arr[i]] == 0) --distinct; };
	  
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
	      std::vector<Query> queries = {{0,4,0},{2,6,1},{1,3,2},{0,7,3},{3,7,4}};
	      auto results = distinctInSubarrays(arr, queries);
	      for (int x : results) std::cout << x << " ";
	      std::cout << "\n";   // 4 4 3 4 4
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  class DistinctMo {
	      static int[] solve(int[] arr, int[][] queries) {
	          int n = arr.length, Q = queries.length;
	          int block = Math.max(1, (int)Math.sqrt(n));
	  
	          Integer[] order = new Integer[Q];
	          for (int i=0;i<Q;i++) order[i]=i;
	          Arrays.sort(order, (a,b) -> {
	              int ba=queries[a][0]/block, bb=queries[b][0]/block;
	              if (ba!=bb) return ba-bb;
	              return (ba%2==0) ? queries[a][1]-queries[b][1] : queries[b][1]-queries[a][1];
	          });
	  
	          int[] freq = new int[100001], ans = new int[Q];
	          int distinct=0, left=0, right=-1;
	  
	          for (int qi : order) {
	              int ql=queries[qi][0], qr=queries[qi][1];
	              while (right<qr){ if(++freq[arr[++right]]==1) distinct++; }
	              while (left>ql) { if(++freq[arr[--left]]==1) distinct++; }
	              while (right>qr){ if(--freq[arr[right--]]==0) distinct--; }
	              while (left<ql) { if(--freq[arr[left++]]==0) distinct--; }
	              ans[qi]=distinct;
	          }
	          return ans;
	      }
	  
	      public static void main(String[] args) {
	          int[] arr = {1,2,1,3,4,2,3,1};
	          int[][] q = {{0,4},{2,6},{1,3},{0,7},{3,7}};
	          System.out.println(Arrays.toString(solve(arr,q)));
	          // [4, 4, 3, 4, 4]
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  function distinctInSubarrays(arr, queries) {
	      const n = arr.length;
	      const block = Math.max(1, Math.floor(Math.sqrt(n)));
	  
	      const indexed = queries.map(([l,r],i) => [l,r,i]);
	      indexed.sort(([al,ar],[bl,br]) => {
	          const ba = Math.floor(al/block), bb = Math.floor(bl/block);
	          if (ba !== bb) return ba - bb;
	          return ba%2===0 ? ar-br : br-ar;
	      });
	  
	      const freq = new Map();
	      let distinct=0, left=0, right=-1;
	      const ans = new Array(queries.length);
	  
	      const add = i => {
	          freq.set(arr[i], (freq.get(arr[i])||0)+1);
	          if (freq.get(arr[i])===1) distinct++;
	      };
	      const rem = i => {
	          freq.set(arr[i], freq.get(arr[i])-1);
	          if (freq.get(arr[i])===0) distinct--;
	      };
	  
	      for (const [ql,qr,qi] of indexed) {
	          while (right<qr) add(++right);
	          while (left>ql)  add(--left);
	          while (right>qr) rem(right--);
	          while (left<ql)  rem(left++);
	          ans[qi]=distinct;
	      }
	      return ans;
	  }
	  
	  const arr = [1,2,1,3,4,2,3,1];
	  console.log(distinctInSubarrays(arr, [[0,4],[2,6],[1,3],[0,7],[3,7]]));
	  // [4, 4, 3, 4, 4]
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  using System.Linq;
	  
	  class DistinctMo {
	      static int[] Solve(int[] arr, int[][] queries) {
	          int n=arr.Length, Q=queries.Length;
	          int block = Math.Max(1,(int)Math.Sqrt(n));
	  
	          var order = Enumerable.Range(0,Q).OrderBy(i => {
	              int b = queries[i][0]/block;
	              return (b, b%2==0 ? queries[i][1] : -queries[i][1]);
	          }).ToArray();
	  
	          var freq = new Dictionary<int,int>();
	          int distinct=0, left=0, right=-1;
	          var ans = new int[Q];
	  
	          void Add(int i) {
	              freq.TryGetValue(arr[i],out int v); freq[arr[i]]=v+1;
	              if(v==0) distinct++;
	          }
	          void Rem(int i) {
	              freq[arr[i]]--;
	              if(freq[arr[i]]==0) distinct--;
	          }
	  
	          foreach (var qi in order) {
	              int ql=queries[qi][0], qr=queries[qi][1];
	              while(right<qr) Add(++right);
	              while(left>ql)  Add(--left);
	              while(right>qr) Rem(right--);
	              while(left<ql)  Rem(left++);
	              ans[qi]=distinct;
	          }
	          return ans;
	      }
	  
	      static void Main() {
	          var arr = new[]{1,2,1,3,4,2,3,1};
	          var q   = new[]{new[]{0,4},new[]{2,6},new[]{1,3},new[]{0,7},new[]{3,7}};
	          Console.WriteLine(string.Join(", ", Solve(arr,q)));
	          // 4, 4, 3, 4, 4
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- The core add/remove pattern: `freq[x]++; if freq[x]==1: distinct++` / `freq[x]--; if freq[x]==0: distinct--`.
	- This O(1) add/remove makes MO's work for this problem — total cost = number of pointer moves = O((N+Q)√N).
	- **Verification trick:** After computing, cross-check `len(set(arr[l:r+1]))` to verify answers.
	- This is a direct application of [[MOs Algorithm (Query square root decomposition)]] specialised to the distinct-count aggregate.
	- Related: [[MOs Algorithm (Query square root decomposition)]], [[Prefix Sum Array]], [[Sliding Window Technique]]

- # More Learn
  collapsed:: true
	- ## Resources
		- [GeeksForGeeks — MO's Algorithm for Distinct Count](https://www.geeksforgeeks.org/mos-algorithm-query-square-root-decomposition-set-1-introduction/)
		- [CP-Algorithms — MO's Algorithm](https://cp-algorithms.com/data_structures/sqrt_decomposition.html)
