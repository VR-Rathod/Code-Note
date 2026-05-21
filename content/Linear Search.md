---
seoTitle: Linear Search Algorithm – O(n) Sequential Search Guide
description: "Linear Search scans each element one by one to find a target. Covers O(n) complexity, iterative and sentinel variants, comparison with Binary Search, and implementations in Python, C++, JavaScript, Java, and C."
keywords: "linear search, sequential search, O(n), unsorted array, brute force search, sentinel search, search algorithm, time complexity, linear search Python, linear search C++, linear search Java, linear search JavaScript, VR-Rathod, Code-Note, code note vr, vr book"
---

> [!info] What is Linear Search?
> Linear Search is the simplest searching algorithm — it scans every element from left to right until the target is found or the end is reached.
> It works on **sorted or unsorted** arrays and requires **no preprocessing**.
> **Time Complexity: O(n)** — in the worst case, every element must be checked.

- # Explanation
  collapsed:: true
	- Linear Search checks each element of a list **one by one** in order. It makes no assumptions about whether the data is sorted.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine looking for a specific book on an unorganized shelf — you start at one end and check each book title until you find the one you want (or reach the end without finding it).
		- That's exactly Linear Search: **exhaustive, sequential, no skipping**.
	-
	- ## Why Learn Linear Search?
	  collapsed:: true
		- It is the **baseline algorithm** for search — every other search algorithm is measured against it.
		- It is the **only correct option** when:
			- The array is **unsorted** and sorting would cost more than the search itself.
			- The dataset is **small** (under ~20 elements, the overhead is negligible).
			- You need to find **all** occurrences, not just the first.
		- Compare with [[Binary Search]] — which is **O(log n)** but requires a **sorted** array.
	-
-
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- Start at index 0. Compare the element at the current index with the target. If they match, return the index. If not, move to the next index. Repeat until found or all elements are exhausted.
		-
		- ```mermaid
		  flowchart TD
		      A["Start<br/>index = 0"] --> B{"index < length?"}
		      B -- No --> G["❌ Return -1<br/>Not Found"]
		      B -- Yes --> C{"arr[index]<br/>== target?"}
		      C -- Yes --> F["✅ Return index<br/>Found!"]
		      C -- No --> D["index = index + 1"]
		      D --> B
		  ```
		-
	-
	- ## Step-by-Step Algorithm
	  collapsed:: true
		- ```
		  INPUT:  array arr[], target value
		  OUTPUT: index of target, or -1 if not found
		  
		  1. index ← 0
		  2. WHILE index < length(arr):
		     a. IF arr[index] == target:
		           RETURN index          ← Found
		     b. index ← index + 1
		  3. RETURN -1                   ← Not Found
		  ```
		-
	-
	- ## Live Walkthrough
	  collapsed:: true
		- Searching for `6` in `[2, 4, 6, 8, 10]`:
		- ```
		  Array:  [  2,   4,   6,   8,  10  ]
		  Index:     0    1    2    3    4
		  
		  ┌─────────────────────────────────────────────────┐
		  │ Step │ index │ arr[index] │ Action               │
		  ├─────────────────────────────────────────────────┤
		  │  1   │   0   │     2      │ 2 ≠ 6  → move right │
		  │  2   │   1   │     4      │ 4 ≠ 6  → move right │
		  │  3   │   2   │     6      │ 6 == 6 ✅ FOUND      │
		  │      │       │            │ return index 2        │
		  └─────────────────────────────────────────────────┘
		  
		  Result: Found in 3 comparisons
		          Best case: 1 comparison (target at index 0)
		          Worst case: n comparisons (target at end or not found)
		          Compare with [[Binary Search]] for sorted arrays
		  ```
		-
		- ```mermaid
		  flowchart LR
		      subgraph Step1["Step 1 (index=0)"]
		          A["arr[0] = 2<br/>2 ≠ 6<br/>Move right"]
		      end
		      subgraph Step2["Step 2 (index=1)"]
		          B["arr[1] = 4<br/>4 ≠ 6<br/>Move right"]
		      end
		      subgraph Step3["Step 3 (index=2)"]
		          C["arr[2] = 6<br/>6 == 6 ✅<br/>Return index 2"]
		      end
		      Step1 --> Step2 --> Step3
		  ```
		-
-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > Linear Search always scans elements one by one → **O(n)** time, **O(1)** space.
	  > In the worst case, it checks every single element in the array.
	  > For a detailed guide on how to derive these complexities, see [[Complexity Analysis]].
	-
	- ## Complexity Table
	  collapsed:: true
		- | Case | Time | Why |
		  |------|------|-----|
		  | **Best** | **O(1)** | Target is the very first element |
		  | **Average** | **O(n/2) = O(n)** | Target is somewhere in the middle |
		  | **Worst** | **O(n)** | Target is at the last position or not found |
		  | **Space** | **O(1)** | Only a single index variable needed |
		-
	- ## Scaling Comparison vs. [[Binary Search]]
	  collapsed:: true
		- ```mermaid
		  xychart-beta
		      title "Comparisons needed: Linear vs Binary Search"
		      x-axis ["1K", "10K", "100K", "1M", "1B"]
		      y-axis "Comparisons" 0 --> 600000
		      bar [500, 5000, 50000, 500000, 500000]
		      line [10, 13, 17, 20, 30]
		  ```
		- | Elements | Linear Search (avg) | [[Binary Search]] |
		  |----------|--------------------:|------------------:|
		  | 1,000 | ~500 | ~10 |
		  | 10,000 | ~5,000 | ~13 |
		  | 100,000 | ~50,000 | ~17 |
		  | 1,000,000 | ~500,000 | ~20 |
		  | 1,000,000,000 | ~500,000,000 | ~30 |
		- > [!tip] Key Insight
		  > Linear Search grows **proportionally** with input size. Every extra element may need to be visited.
		  > [[Binary Search]] grows **logarithmically** — but only works on **sorted** data.
		-
-
- # Implementation
  collapsed:: true
	- > [!note] All implementations below return the **index** of the target, or **-1** if not found.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def linear_search(arr, target):
	      """
	      Iterative Linear Search
	      Time: O(n) | Space: O(1)
	      Returns index of target, or -1 if not found.
	      """
	      for index in range(len(arr)):     # Scan left to right
	          if arr[index] == target:
	              return index              # Found — return its position
	      return -1                         # Not found after full scan
	  
	  # Example
	  arr = [2, 4, 6, 8, 10]
	  print(linear_search(arr, 6))          # Output: 2
	  print(linear_search(arr, 5))          # Output: -1
	  ```
	  
	  ```cpp
	  #include <iostream>
	  #include <vector>
	  
	  // Iterative Linear Search
	  // Time: O(n) | Space: O(1)
	  int linear_search(const std::vector<int>& arr, int target) {
	      for (int i = 0; i < (int)arr.size(); i++) {
	          if (arr[i] == target)
	              return i;              // Found — return index
	      }
	      return -1;                    // Not found
	  }
	  
	  int main() {
	      std::vector<int> arr = {2, 4, 6, 8, 10};
	      std::cout << linear_search(arr, 6) << "\n";    // Output: 2
	      std::cout << linear_search(arr, 5) << "\n";    // Output: -1
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function linearSearch(arr, target) {
	      // Scan every element left to right
	      for (let i = 0; i < arr.length; i++) {
	          if (arr[i] === target) return i;   // Found
	      }
	      return -1;                             // Not found
	  }
	  
	  const arr = [2, 4, 6, 8, 10];
	  console.log(linearSearch(arr, 6));  // Output: 2
	  console.log(linearSearch(arr, 5));  // Output: -1
	  ```
	  
	  ```java
	  public class LinearSearch {
	  
	      // Time: O(n) | Space: O(1)
	      static int linearSearch(int[] arr, int target) {
	          for (int i = 0; i < arr.length; i++) {
	              if (arr[i] == target)
	                  return i;      // Found
	          }
	          return -1;             // Not found
	      }
	  
	      public static void main(String[] args) {
	          int[] arr = {2, 4, 6, 8, 10};
	          System.out.println(linearSearch(arr, 6));  // 2
	          System.out.println(linearSearch(arr, 5));  // -1
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  
	  /* Linear Search in C
	     Time: O(n) | Space: O(1) */
	  int linear_search(int arr[], int n, int target) {
	      for (int i = 0; i < n; i++) {
	          if (arr[i] == target)
	              return i;     /* Found */
	      }
	      return -1;            /* Not found */
	  }
	  
	  int main() {
	      int arr[] = {2, 4, 6, 8, 10};
	      int n = sizeof(arr) / sizeof(arr[0]);
	      printf("%d\n", linear_search(arr, n, 6));   /* Output: 2  */
	      printf("%d\n", linear_search(arr, n, 5));   /* Output: -1 */
	      return 0;
	  }
	  ```
	  
	  :::
	-
-
- # Sentinel Linear Search
  collapsed:: true
	- > [!tip] What is Sentinel Search?
	  > A small optimization: place the **target as the last element** (the "sentinel") before searching.
	  > This eliminates the **bounds check** (`i < n`) inside the loop — one fewer comparison per iteration.
	  > Useful in performance-critical code where the array can be safely extended.
	-
	- ## How Sentinel Works
	  collapsed:: true
		- ```mermaid
		  flowchart TD
		      A["Place target at arr[n]<br/>(sentinel position)"] --> B["index = 0"]
		      B --> C{"arr[index] == target?"}
		      C -- No --> D["index = index + 1"]
		      D --> C
		      C -- Yes --> E{"index < n?"}
		      E -- Yes --> F["✅ Found at index"]
		      E -- No --> G["❌ Return -1<br/>Only found sentinel"]
		  ```
		-
	-
	- ## Sentinel Implementation
	  collapsed:: true
		- ```python
		  def sentinel_search(arr, target):
		      """
		      Sentinel Linear Search — eliminates the bounds check
		      Time: O(n) | Space: O(1) extra (modifies arr temporarily)
		      """
		      n = len(arr)
		      arr.append(target)         # Place sentinel at the end
		  
		      i = 0
		      while arr[i] != target:   # No bounds check needed!
		          i += 1
		  
		      arr.pop()                  # Remove sentinel
		  
		      if i < n:
		          return i              # Found within original array
		      return -1                 # Only matched the sentinel
		  
		  # Example
		  arr = [2, 4, 6, 8, 10]
		  print(sentinel_search(arr, 6))  # Output: 2
		  print(sentinel_search(arr, 5))  # Output: -1
		  ```
		-
-
- # Find All Occurrences
  collapsed:: true
	- > [!note] Standard Linear Search returns only the **first** match.
	  > To find **all** occurrences, collect every matching index instead of returning early.
	- ```python
	  def find_all(arr, target):
	      """Find all indices where target appears."""
	      return [i for i, v in enumerate(arr) if v == target]
	  
	  arr = [3, 5, 5, 7, 5, 9]
	  print(find_all(arr, 5))  # Output: [1, 2, 4]
	  ```
	-
-
- # When to Use Linear Search
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Is the array sorted?"}
	      Q -- Yes --> Q2{"How many searches?"}
	      Q2 -- "Many lookups" --> R1["✅ Use Binary Search<br/>O(log n) is much faster"]
	      Q2 -- "Just one lookup" --> R2["✅ Linear Search is fine<br/>(sort cost > search cost)"]
	      Q -- No --> Q3{"Array size?"}
	      Q3 -- "< 20 elements" --> R3["✅ Linear Search<br/>overhead negligible"]
	      Q3 -- "> 20 elements" --> Q4{"Need ALL matches?"}
	      Q4 -- Yes --> R4["✅ Linear Search<br/>(only algorithm that finds all)"]
	      Q4 -- No --> R5["Consider sorting first<br/>then Binary Search"]
	  ```
	-
	- ## ✅ Use Linear Search When
		- Data is **unsorted** and you need only **one or a few** searches
		- Dataset is **small** — under ~20 elements where overhead is negligible
		- You need to find **all** occurrences, not just the first
		- Searching through **linked lists** or **non-random-access** structures
		- Data arrives as a **stream** and cannot be sorted in advance
	-
	- ## ❌ Avoid Linear Search When
		- Array is **sorted** and you need repeated lookups — use [[Binary Search]] (**O(log n)**)
		- Dataset is **very large** — millions of elements where O(n) is too slow
		- You need **fast average-case** performance in a production search system
		-
- # Key Takeaways
	- **Core idea** — check every element one by one → **O(n)** time, **O(1)** space.
	- **No prerequisites** — works on sorted, unsorted, and partially sorted arrays equally well.
	- **Best case O(1)** — if the target is at the first position.
	- **Worst case O(n)** — if the target is at the last position or not present at all.
	- **Sentinel optimization** — place the target at the end to remove the bounds check inside the loop.
	- **All occurrences** — the only standard search that naturally finds every instance in a single pass.
	- **Use [[Binary Search]] instead** whenever the data is sorted and lookups are frequent.
	-
- # More Learn
	- ## GitHub & Webs
		- [TheAlgorithms – Linear Search](https://github.com/TheAlgorithms/Python/blob/master/searches/linear_search.py)
		- [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)