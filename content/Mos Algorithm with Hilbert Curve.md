---
seoTitle: Mo's Algorithm with Hilbert Curve – Advanced Query Sorting Optimization
description: "Optimize Mo's Algorithm range queries using a Hilbert Space-Filling Curve. Learn how mapping 2D (L, R) coordinates to a 1D Hilbert index minimizes pointer travel, yielding a 2x constant factor speedup. Includes implementations in Python, C++, JavaScript, and Java."
keywords: "Mo's Algorithm, Mos algorithm, Hilbert curve, query sorting, space-filling curve, range query optimization, square root decomposition, competitive programming, DSA"
---

> [!info] What is Mo's Algorithm with Hilbert Curve?
> **Mo's Algorithm with Hilbert Curve** is a high-level optimization for offline range query processing.
> Instead of sorting queries $(L, R)$ in standard block blocks of size $\sqrt{N}$, it maps the 2D query coordinate $(L, R)$ to a 1D position along a **Hilbert Curve** (a continuous space-filling fractal).
> Sorting queries by their Hilbert index ensures that the left and right pointers $(L, R)$ slide smoothly across the array, eliminating large pointer jumps and yielding a **2x to 3x constant-factor speedup** in practice.

- # Why Standard Mo's Sorting is Suboptimal
  collapsed:: true
	- ## 1. The Block Sorting Zig-Zag
		- Standard Mo's sorting groups queries into blocks of size $B = \sqrt{N}$ by the left index $L$, and sorts ascending by the right index $R$:
		- ```python
		  # Standard Mo's Comparator
		  sort_key = lambda q: (q.L // BlockSize, q.R)
		  ```
		- While the pointers move at most $O((N + Q)\sqrt{N})$ steps, this approach causes a "zig-zag" pattern. When transitioning from the end of block $k$ to the beginning of block $k+1$, the right pointer $R$ often has to jump all the way from the end of the array back to the beginning.
		- Alternating block sorting (sorting $R$ descending on odd blocks) reduces this but still leaves localized jumps.
		-
	- ## 2. The Space-Filling Curve Solution
		- A **Hilbert Curve** is a continuous fractal curve that fills a 2D space.
		- By treating the query range $(L, R)$ as a coordinate on a 2D grid, we can trace a single continuous path that visits every cell in the grid exactly once without any large jumps.
		- By converting $(L, R)$ to its distance along this Hilbert path, we get a 1D index. Sorting queries by this index guarantees the pointers move along the shortest continuous path connecting all query coordinates.
		-
		- ```mermaid
		  flowchart LR
		      Coords["Query Range (L, R) in 2D Grid"] -->|"Hilbert Mapping"| Index["1D Hilbert Curve Distance"]
		      Index -->|"Sort Queries"| SmoothPath["Smooth Pointer Navigation (No Jumps) ✅"]
		  ```
		-
- # Hilbert Curve Bitwise Conversion
  collapsed:: true
	- The grid size is rounded up to the nearest power of 2, typically $2^{20}$ (which handles $N \le 10^6$).
	- Here is the classic recursive bitwise function used in competitive programming to convert a 2D grid coordinate $(x, y)$ into a 1D Hilbert index:
	-
	- ```c++
	  long long getHilbert(int x, int y, int pow, int rotate) {
	      if (pow == 0) return 0;
	      int hpow = 1 << (pow - 1);
	      int seg = (x < hpow) ? ((y < hpow) ? 0 : 1) : ((y < hpow) ? 3 : 2);
	      seg = (seg + rotate) & 3;
	      const int rotateDelta[4] = {3, 0, 0, 1};
	      int nx = x & (x ^ hpow), ny = y & (y ^ hpow);
	      int nrot = (rotate + rotateDelta[seg]) & 3;
	      long long subSquareSize = 1LL << (2 * pow - 2);
	      long long ans = seg * subSquareSize;
	      long long add = getHilbert(nx, ny, pow - 1, nrot);
	      ans += (seg == 1 || seg == 2) ? add : (subSquareSize - 1 - add);
	      return ans;
	  }
	  ```
	-
- # Performance Comparison
  collapsed:: true
	- | Sorting Strategy | Average Pointer Steps | Cache Locality | Overhead |
	  |---|---|---|---|
	  | **Standard Block** | Higher (zig-zag jumps) | Moderate | Very Low (integer division) |
	  | **Alternating Block**| Medium | Moderate | Very Low |
	  | **Hilbert Curve** | **Lowest (smooth path)** | **Excellent** | Low ($O(\log N)$ bitwise per query) |
	-
- # Implementation
  collapsed:: true
	- > [!note] Below is the complete implementation of Mo's Algorithm for Range Sum queries using Hilbert Curve sorting.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs

	  ```python
	  # Hilbert curve coordinate conversion helper
	  # K is the power of 2 for grid size (e.g. 20 for N <= 10^6)
	  def get_hilbert(x, y, pow_val=20, rotate=0):
	      if pow_val == 0:
	          return 0
	      hpow = 1 << (pow_val - 1)
	      seg = 0
	      if x < hpow:
	          seg = 0 if y < hpow else 1
	      else:
	          seg = 3 if y < hpow else 2
	      
	      seg = (seg + rotate) & 3
	      rotate_delta = [3, 0, 0, 1]
	      
	      nx = x & (x ^ hpow)
	      ny = y & (y ^ hpow)
	      nrot = (rotate + rotate_delta[seg]) & 3
	      
	      sub_square_size = 1 << (2 * pow_val - 2)
	      ans = seg * sub_square_size
	      add = get_hilbert(nx, ny, pow_val - 1, nrot)
	      
	      if seg == 1 or seg == 2:
	          ans += add
	      else:
	          ans += (sub_square_size - 1 - add)
	      return ans

	  # Mo's Algorithm using Hilbert Curve Sorting
	  def mos_algorithm_hilbert(arr, queries):
	      # Add query indices and compute Hilbert values
	      # We use 20 bits for N <= 10^6
	      queries_with_hilbert = []
	      for i, (l, r) in enumerate(queries):
	          h = get_hilbert(l, r, 20, 0)
	          queries_with_hilbert.append((l, r, i, h))
	      
	      # Sort queries by their Hilbert index
	      queries_with_hilbert.sort(key=lambda q: q[3])
	      
	      ans = [0] * len(queries)
	      curr_sum = 0
	      left, right = 0, -1
	      
	      # Window operations
	      for l, r, idx, _ in queries_with_hilbert:
	          while right < r:
	              right += 1
	              curr_sum += arr[right]
	          while left > l:
	              left -= 1
	              curr_sum += arr[left]
	          while right > r:
	              curr_sum -= arr[right]
	              right -= 1
	          while left < l:
	              curr_sum -= arr[left]
	              left += 1
	          ans[idx] = curr_sum
	          
	      return ans

	  # Example Usage
	  array = [1, 2, 1, 3, 4, 2, 3, 1]
	  queries = [(0, 4), (2, 6), (1, 3), (0, 7)]
	  print("Range Sums:", mos_algorithm_hilbert(array, queries))
	  # Output: [11, 13, 6, 17]
	  ```

	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>

	  inline long long getHilbert(int x, int y, int pow_val, int rotate) {
	      if (pow_val == 0) return 0;
	      int hpow = 1 << (pow_val - 1);
	      int seg = (x < hpow) ? ((y < hpow) ? 0 : 1) : ((y < hpow) ? 3 : 2);
	      seg = (seg + rotate) & 3;
	      const int rotateDelta[4] = {3, 0, 0, 1};
	      int nx = x & (x ^ hpow), ny = y & (y ^ hpow);
	      int nrot = (rotate + rotateDelta[seg]) & 3;
	      long long subSquareSize = 1LL << (2 * pow_val - 2);
	      long long ans = seg * subSquareSize;
	      long long add = getHilbert(nx, ny, pow_val - 1, nrot);
	      ans += (seg == 1 || seg == 2) ? add : (subSquareSize - 1 - add);
	      return ans;
	  }

	  struct Query {
	      int l, r, idx;
	      long long h_val;
	  };

	  std::vector<long long> solveMosHilbert(const std::vector<int>& arr, std::vector<Query>& queries) {
	      for (auto& q : queries) {
	          q.h_val = getHilbert(q.l, q.r, 20, 0); // 20 bits grid size
	      }
	      
	      std::sort(queries.begin(), queries.end(), [](const Query& a, const Query& b) {
	          return a.h_val < b.h_val;
	      });

	      std::vector<long long> ans(queries.size());
	      long long curr_sum = 0;
	      int left = 0, right = -1;

	      for (const auto& q : queries) {
	          while (right < q.r) curr_sum += arr[++right];
	          while (left > q.l) curr_sum += arr[--left];
	          while (right > q.r) curr_sum -= arr[right--];
	          while (left < q.l) curr_sum -= arr[left++];
	          ans[q.idx] = curr_sum;
	      }
	      return ans;
	  }

	  int main() {
	      std::vector<int> arr = {1, 2, 1, 3, 4, 2, 3, 1};
	      std::vector<Query> queries = {{0, 4, 0, 0}, {2, 6, 1, 0}, {1, 3, 2, 0}, {0, 7, 3, 0}};
	      auto ans = solveMosHilbert(arr, queries);
	      for (long long x : ans) std::cout << x << " ";
	      std::cout << "\n"; // 11 13 6 17
	      return 0;
	  }
	  ```

	  ```javascript
	  function getHilbert(x, y, powVal = 20, rotate = 0) {
	      if (powVal === 0) return 0n;
	      const hpow = 1 << (powVal - 1);
	      let seg = 0;
	      if (x < hpow) {
	          seg = y < hpow ? 0 : 1;
	      } else {
	          seg = y < hpow ? 3 : 2;
	      }
	      
	      seg = (seg + rotate) & 3;
	      const rotateDelta = [3, 0, 0, 1];
	      
	      const nx = x & (x ^ hpow);
	      const ny = y & (y ^ hpow);
	      const nrot = (rotate + rotateDelta[seg]) & 3;
	      
	      const subSquareSize = 1n << BigInt(2 * powVal - 2);
	      let ans = BigInt(seg) * subSquareSize;
	      const add = getHilbert(nx, ny, powVal - 1, nrot);
	      
	      if (seg === 1 || seg === 2) {
	          ans += add;
	      } else {
	          ans += (subSquareSize - 1n - add);
	      }
	      return ans;
	  }

	  function solveMosHilbert(arr, queries) {
	      const indexed = queries.map(([l, r], i) => {
	          return { l, r, idx: i, hVal: getHilbert(l, r, 20, 0) };
	      });

	      indexed.sort((a, b) => (a.hVal < b.hVal ? -1 : a.hVal > b.hVal ? 1 : 0));

	      const ans = new Array(queries.length);
	      let currSum = 0;
	      let left = 0, right = -1;

	      for (const q of indexed) {
	          while (right < q.r) currSum += arr[++right];
	          while (left > q.l) currSum += arr[--left];
	          while (right > q.r) currSum -= arr[right--];
	          while (left < q.l) currSum -= arr[left++];
	          ans[q.idx] = currSum;
	      }
	      return ans;
	  }

	  const arr = [1, 2, 1, 3, 4, 2, 3, 1];
	  console.log("Range Sums:", solveMosHilbert(arr, [[0,4],[2,6],[1,3],[0,7]]));
	  ```

	  ```java
	  import java.util.*;

	  public class MosHilbert {

	      public static long getHilbert(int x, int y, int powVal, int rotate) {
	          if (powVal == 0) return 0;
	          int hpow = 1 << (powVal - 1);
	          int seg = (x < hpow) ? ((y < hpow) ? 0 : 1) : ((y < hpow) ? 3 : 2);
	          seg = (seg + rotate) & 3;
	          int[] rotateDelta = {3, 0, 0, 1};
	          int nx = x & (x ^ hpow);
	          int ny = y & (y ^ hpow);
	          int nrot = (rotate + rotateDelta[seg]) & 3;
	          long subSquareSize = 1L << (2 * powVal - 2);
	          long ans = seg * subSquareSize;
	          long add = getHilbert(nx, ny, powVal - 1, nrot);
	          ans += (seg == 1 || seg == 2) ? add : (subSquareSize - 1 - add);
	          return ans;
	      }

	      static class Query {
	          int l, r, idx;
	          long hVal;
	          Query(int l, int r, int idx) {
	              this.l = l;
	              this.r = r;
	              this.idx = idx;
	              this.hVal = getHilbert(l, r, 20, 0);
	          }
	      }

	      public static long[] solveMosHilbert(int[] arr, List<Query> queries) {
	          queries.sort(Comparator.comparingLong(q -> q.hVal));

	          long[] ans = new long[queries.size()];
	          long currSum = 0;
	          int left = 0, right = -1;

	          for (Query q : queries) {
	              while (right < q.r) currSum += arr[++right];
	              while (left > q.l) currSum += arr[--left];
	              while (right > q.r) currSum -= arr[right--];
	              while (left < q.l) currSum -= arr[left++];
	              ans[q.idx] = currSum;
	          }
	          return ans;
	      }

	      public static void main(String[] args) {
	          int[] arr = {1, 2, 1, 3, 4, 2, 3, 1};
	          List<Query> queries = new ArrayList<>(Arrays.asList(
	              new Query(0, 4, 0), new Query(2, 6, 1), new Query(1, 3, 2), new Query(0, 7, 3)
	          ));
	          long[] ans = solveMosHilbert(arr, queries);
	          System.out.println("Range Sums: " + Arrays.toString(ans));
	      }
	  }
	  ```

	  :::
	-
- # Key Takeaways
	- **Locality Preservation** — Converting 2D query bounds $(L, R)$ to a 1D Hilbert value keeps nearby queries adjacent in the sorted sequence.
	- **Zig-Zag Elimination** — Pointers slide smoothly in a continuous line rather than jumping across the array on block boundary crossings, yielding a 2x-3x speedup.
	-
- # More Learn
	- ## Resources
		- [Codeforces – Optimizing Mo's Algorithm with Hilbert Curve](https://codeforces.com/blog/entry/61203)
	- ## Related Pages
		- [[MOs Algorithm (Query square root decomposition)]] – Core block-based Mo's Algorithm
		- [[Submask Bitwise Iteration]] – $O(3^N)$ submask DP iteration
		- [[DSA Algo & System Design]] – Master DSA checklist
