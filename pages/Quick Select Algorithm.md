---
seoTitle: Quick Select Algorithm – k-th Smallest Element in O(N) Average | In-Depth Guide
description: "Complete guide to the Quick Select Algorithm for finding the k-th smallest element. Covers partition, pivot selection, randomized quickselect, median of medians, heap alternative, and implementations in Python, C++, Java, JavaScript, and C#."
keywords: "quick select, kth smallest, kth largest, partition, pivot, randomized quickselect, median of medians, top-k, O(N) average, array, VR-Rathod, Code-Note, code note vr"
displayTitle: Quick Select Algorithm
---

> [!info] What is Quick Select?
> **Quick Select** finds the **k-th smallest element** in an unsorted array in **O(N) average time** without fully sorting. It uses the same **partition step as QuickSort** but only recurses into the **one half** that contains the target rank — eliminating the other half entirely.

- # Explanation
  collapsed:: true
	- ## Quick Select vs Quick Sort
	  collapsed:: true
		- | | Quick Sort | Quick Select |
		  |---|---|---|
		  | **Goal** | Sort entire array | Find k-th smallest only |
		  | **Recurse into** | Both halves | One half only |
		  | **Time (avg)** | O(N log N) | **O(N)** |
		  | **Time (worst)** | O(N²) | O(N²) |
		  | **Space** | O(log N) | O(log N) |
	-
	- ## The Partition Step
	  collapsed:: true
		- ```
		  pivot = arr[right]
		  
		  Move all elements < pivot to the left of storeIndex
		  Place pivot at storeIndex
		  
		  After partition:
		    arr[0..storeIndex-1] < pivot
		    arr[storeIndex]      = pivot
		    arr[storeIndex+1..]  > pivot
		  
		  → pivot is now at its SORTED POSITION
		  ```
	-
	- ## Selection Logic
	  collapsed:: true
		- ```
		  After partitioning around pivot at position p:
		  
		  if p == k:   → pivot IS the k-th smallest → return it
		  if p > k:    → k-th is in LEFT half  → recurse left
		  if p < k:    → k-th is in RIGHT half → recurse right
		  ```
	-
	- ## Avoiding O(N²) Worst Case
	  collapsed:: true
		- | Strategy | Worst Case | Notes |
		  |---|---|---|
		  | Fixed pivot (last element) | O(N²) on sorted input | Avoid in practice |
		  | **Randomized pivot** | O(N) expected | Simple, fast, use this |
		  | **Median of Medians** | O(N) guaranteed | Complex, large constant |
	-
	- ## Complexity
	  collapsed:: true
		- | | Average | Worst |
		  |---|---|---|
		  | **Time** | O(N) | O(N²) |
		  | **Space** | O(log N) recursion stack | O(N) worst |
- # Implementation
  collapsed:: true
	- > [!note] Randomized Quick Select (k-th smallest), k-th largest variant, and the heap-based alternative.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  import random
	  
	  # ── Partition ─────────────────────────────────────────────────────────
	  def partition(arr: list[int], left: int, right: int) -> int:
	      """Lomuto partition: pivot = arr[right]. Returns pivot's final index."""
	      pivot = arr[right]
	      store = left                           # Everything < pivot goes here
	      for i in range(left, right):
	          if arr[i] < pivot:
	              arr[i], arr[store] = arr[store], arr[i]
	              store += 1
	      arr[store], arr[right] = arr[right], arr[store]   # Place pivot
	      return store
	  
	  # ── Randomized Quick Select ────────────────────────────────────────────
	  def quick_select(arr: list[int], k: int) -> int:
	      """Find k-th smallest (0-indexed: k=0 is minimum). O(N) average."""
	      arr = arr[:]     # Work on a copy
	      left, right = 0, len(arr) - 1
	  
	      while left <= right:
	          # Randomize pivot → avoids O(N²) worst case
	          pivot_idx = random.randint(left, right)
	          arr[pivot_idx], arr[right] = arr[right], arr[pivot_idx]
	  
	          p = partition(arr, left, right)
	  
	          if   p == k: return arr[p]     # Found
	       elif p > k:  right = p - 1    # k-th is in left half
	          else:        left  = p + 1    # k-th is in right half
	  
	      return arr[left]
	  
	  # ── Convenience wrappers ──────────────────────────────────────────────
	  def kth_smallest(arr: list[int], k: int) -> int:
	      """1-indexed: kth_smallest(arr, 1) = minimum."""
	      return quick_select(arr, k - 1)
	  
	  def kth_largest(arr: list[int], k: int) -> int:
	      """1-indexed: kth_largest(arr, 1) = maximum."""
	      return quick_select(arr, len(arr) - k)
	  
	  def find_median(arr: list[int]) -> float:
	      n = len(arr)
	      if n % 2 == 1:
	          return kth_smallest(arr, n // 2 + 1)
	      else:
	          lo = kth_smallest(arr, n // 2)
	          hi = kth_smallest(arr, n // 2 + 1)
	          return (lo + hi) / 2
	  
	  # ── Tests ──────────────────────────────────────────────────────────
	  arr = [3, 6, 8, 10, 1, 2, 1]
	  print(kth_smallest(arr, 1))    # 1  (minimum)
	  print(kth_smallest(arr, 3))    # 3  (3rd smallest)
	  print(kth_largest(arr, 2))     # 8  (2nd largest)
	  print(find_median(arr))        # 3.0 (median of 7 elements)
	  
	  # Python's built-in heapq alternative (simpler, O(N log K))
	  import heapq
	  def kth_smallest_heap(arr, k):
	      return heapq.nsmallest(k, arr)[-1]   # O(N log K)
	  
	  print(kth_smallest_heap(arr, 3))  # 3
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  #include <random>
	  
	  int partition(std::vector<int>& arr, int lo, int hi) {
	      int pivot = arr[hi], store = lo;
	      for (int i = lo; i < hi; ++i)
	          if (arr[i] < pivot) std::swap(arr[i], arr[store++]);
	      std::swap(arr[store], arr[hi]);
	      return store;
	  }
	  
	  // Randomized Quick Select — k is 0-indexed
	  int quickSelect(std::vector<int> arr, int k) {
	      static std::mt19937 rng(42);
	      int lo = 0, hi = arr.size() - 1;
	      while (lo <= hi) {
	          // Randomize pivot
	          std::uniform_int_distribution<int> dist(lo, hi);
	          std::swap(arr[dist(rng)], arr[hi]);
	  
	          int p = partition(arr, lo, hi);
	          if      (p == k) return arr[p];
	          else if (p > k)  hi = p - 1;
	          else             lo = p + 1;
	      }
	      return arr[lo];
	  }
	  
	  int main() {
	      std::vector<int> arr = {3, 6, 8, 10, 1, 2, 1};
	      std::cout << "1st smallest: " << quickSelect(arr, 0) << "\n"; // 1
	      std::cout << "3rd smallest: " << quickSelect(arr, 2) << "\n"; // 3
	      std::cout << "2nd largest:  " << quickSelect(arr, arr.size()-2) << "\n"; // 8
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  class QuickSelect {
	      private static final Random RNG = new Random(42);
	  
	      static int partition(int[] arr, int lo, int hi) {
	          int pivot = arr[hi], store = lo;
	          for (int i = lo; i < hi; i++)
	              if (arr[i] < pivot) { int t=arr[i]; arr[i]=arr[store]; arr[store++]=t; }
	          int t=arr[store]; arr[store]=arr[hi]; arr[hi]=t;
	          return store;
	      }
	  
	      // k is 0-indexed
	      static int select(int[] arr, int k) {
	          arr = arr.clone();
	          int lo = 0, hi = arr.length - 1;
	          while (lo <= hi) {
	              int ri = lo + RNG.nextInt(hi - lo + 1);
	              int t = arr[ri]; arr[ri] = arr[hi]; arr[hi] = t;
	              int p = partition(arr, lo, hi);
	              if      (p == k) return arr[p];
	              else if (p > k)  hi = p - 1;
	              else             lo = p + 1;
	          }
	          return arr[lo];
	      }
	  
	      public static void main(String[] args) {
	          int[] arr = {3, 6, 8, 10, 1, 2, 1};
	          System.out.println("1st smallest: " + select(arr, 0));              // 1
	          System.out.println("3rd smallest: " + select(arr, 2));              // 3
	          System.out.println("2nd largest:  " + select(arr, arr.length-2));   // 8
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  function partition(arr, lo, hi) {
	      const pivot = arr[hi];
	      let store = lo;
	      for (let i = lo; i < hi; i++)
	          if (arr[i] < pivot) [arr[i], arr[store++]] = [arr[store], arr[i]];
	      [arr[store], arr[hi]] = [arr[hi], arr[store]];
	      return store;
	  }
	  
	  // k is 0-indexed
	  function quickSelect(arr, k) {
	      arr = [...arr];
	      let lo = 0, hi = arr.length - 1;
	      while (lo <= hi) {
	          const ri = lo + Math.floor(Math.random() * (hi - lo + 1));
	          [arr[ri], arr[hi]] = [arr[hi], arr[ri]];
	          const p = partition(arr, lo, hi);
	          if      (p === k) return arr[p];
	          else if (p > k)   hi = p - 1;
	          else              lo = p + 1;
	      }
	      return arr[lo];
	  }
	  
	  const arr = [3, 6, 8, 10, 1, 2, 1];
	  console.log("1st smallest:", quickSelect(arr, 0));              // 1
	  console.log("3rd smallest:", quickSelect(arr, 2));              // 3
	  console.log("2nd largest:", quickSelect(arr, arr.length - 2));  // 8
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  
	  class QuickSelect {
	      static Random rng = new(42);
	  
	      static int Partition(int[] arr, int lo, int hi) {
	          int pivot = arr[hi], store = lo;
	          for (int i = lo; i < hi; i++)
	              if (arr[i] < pivot) (arr[i], arr[store]) = (arr[store++], arr[i]);
	          (arr[store], arr[hi]) = (arr[hi], arr[store]);
	          return store;
	      }
	  
	      static int Select(int[] arr, int k) {
	          arr = (int[])arr.Clone();
	          int lo = 0, hi = arr.Length - 1;
	          while (lo <= hi) {
	              int ri = lo + rng.Next(hi - lo + 1);
	              (arr[ri], arr[hi]) = (arr[hi], arr[ri]);
	              int p = Partition(arr, lo, hi);
	              if      (p == k) return arr[p];
	              else if (p > k)  hi = p - 1;
	              else             lo = p + 1;
	          }
	          return arr[lo];
	      }
	  
	      static void Main() {
	          int[] arr = {3, 6, 8, 10, 1, 2, 1};
	          Console.WriteLine($"1st smallest: {Select(arr, 0)}");              // 1
	          Console.WriteLine($"3rd smallest: {Select(arr, 2)}");              // 3
	          Console.WriteLine($"2nd largest:  {Select(arr, arr.Length-2)}");   // 8
	      }
	  }
	  ```
	  
	  :::
- # Key Takeaways
  collapsed:: true
	- **Partition places pivot at its exact sorted position** — everything left is smaller, everything right is larger.
	- Recurse into **only one half** based on where k falls relative to the pivot's position.
	- **Randomize the pivot** to achieve O(N) expected time and avoid O(N²) worst case.
	- **k-th largest** = `quickSelect(arr, n-k)` (0-indexed).
	- For production code with k << n, a **min-heap of size k** is often simpler: O(N log K).
	- Related: [[Boyer More Majority Vote]], [[Two Pointers Technique]], [[Kadane's Algorithm]]
- # More Learn
  collapsed:: true
	- ## LeetCode Problems
		- [LeetCode 215 – Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)
		- [LeetCode 703 – Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/)
		- [LeetCode 347 – Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)