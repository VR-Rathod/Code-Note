---
seoTitle: Binary Search Algorithm – O(log n) Divide and Conquer Search
description: "Binary search efficiently finds elements in sorted arrays by halving the search space each step. Covers iterative and recursive implementations in Python, C++, JavaScript, Java, and C with O(log n) complexity."
keywords: "binary search, search algorithm, sorted array, O(log n), divide and conquer, iterative binary search, recursive binary search, time complexity, space complexity, algorithm implementation, binary search C++, binary search Python, binary search Java, VR-Rathod, Code-Note, code note vr, vr book , Vaibhav Rathod, vaibhav, Rathod , book of rathod"
treeTitle: DSA - Sorting & Searching - Binary Search
---

> [!info] What is Binary Search?
> Binary Search is an efficient algorithm that finds a target value in a **sorted array** by repeatedly halving the search space.
> Instead of scanning every element, it eliminates half of the remaining candidates with each comparison — achieving **O(log n)** time.
> **Prerequisite:** The array **must be sorted** before applying Binary Search.

- # Explanation
  collapsed:: true
	- **Binary Search** works by comparing the target to the **middle element** of the search range. Based on that comparison, it discards the half that cannot contain the target and repeats on the surviving half.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Opening a **dictionary** — you flip to the middle, check if your word comes before or after, then repeat on the correct half. You never revisit eliminated pages.
	-
	- ## Why Binary Search Over Linear Search?
	  collapsed:: true
		- [[Linear Search]] checks every element one by one — **O(n)**.
		- Binary Search halves the problem space every step — **O(log n)**.
		- Searching **1 million elements**: Linear needs ~500,000 comparisons on average. Binary needs just **~20**.
-
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- Imagine playing a **number guessing game** — instead of guessing randomly, you always guess the middle of the remaining range. Each guess cuts the possibilities in half.
		- This is exactly what Binary Search does: **always look at the middle element, then discard the half where the target cannot be**.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — array must be sorted"] --> B["Set pointers:\nlow = 0  |  high = last index"]
		      B --> C{"low ≤ high?"}
		      C -- No --> H["❌ Return -1  — Not Found"]
		      C -- Yes --> D["Compute mid:\nmid = low + (high − low) / 2"]
		      D --> E{"Compare\narr[mid] vs target"}
		      E -- "Equal" --> F["✅ Found — Return mid"]
		      E -- "arr[mid] < target\ntarget is to the right" --> G["Discard left half\nlow = mid + 1"]
		      E -- "arr[mid] > target\ntarget is to the left" --> I["Discard right half\nhigh = mid - 1"]
		      G --> C
		      I --> C
		  ```
	-
	- ## Step-by-Step Algorithm
	  collapsed:: true
		- ```
		  INPUT:  sorted array arr[], target value
		  OUTPUT: index of target, or -1 if not found
		  
		  1. low  ← 0                               set left boundary
		  2. high ← length(arr) − 1                 set right boundary
		  
		  3. WHILE low ≤ high:                       search space is not empty
		     a. mid ← low + (high − low) / 2        find middle safely (no overflow)
		     b. IF arr[mid] == target  → RETURN mid  found it!
		        IF arr[mid] <  target  → low  = mid + 1   target is to the right
		        IF arr[mid] >  target  → high = mid − 1   target is to the left
		  
		  4. RETURN −1                               not found after exhausting the range
		  ```
		- > [!tip] Why `low + (high − low) / 2` instead of `(low + high) / 2`?
		  > If both `low` and `high` are very large numbers (near `INT_MAX`), adding them together can **overflow** in C, C++, and Java. The safer form avoids this entirely. Python has unlimited integers so this isn't needed there.
	-
	- ## Live Walkthrough — Finding 9 in [1, 3, 5, 7, 9, 11, 13]
	  collapsed:: true
		- Starting with `low = 0`, `high = 6`. Watch how each step halves the search space:
		- ```
		  Array:  [ 1,  3,  5,  7,  9, 11, 13 ]
		  Index:    0   1   2   3   4   5   6
		  Target = 9
		  
		  ┌──────────────────────────────────────────────────────────────┐
		  │ Step │ low │ high │ mid │ arr[mid] │ Action                  │
		  ├──────────────────────────────────────────────────────────────┤
		  │  1   │  0  │  6   │  3  │    7     │ 7 < 9  → discard left  │
		  │      │     │      │     │          │ low = 4                 │
		  │  2   │  4  │  6   │  5  │   11     │ 11 > 9 → discard right │
		  │      │     │      │     │          │ high = 4                │
		  │  3   │  4  │  4   │  4  │    9     │ 9 == 9 ✅ FOUND        │
		  │      │     │      │     │          │ return index 4          │
		  └──────────────────────────────────────────────────────────────┘
		  
		  Result: Found in 3 comparisons
		          Linear Search would need 5 comparisons for the same answer
		          See [[Linear Search]] for comparison
		  ```
		-
		- ```mermaid
		  flowchart LR
		      subgraph Step1["Step 1 — Check middle, discard left half"]
		          A["[1, 3, 5, 7, 9, 11, 13]\nmid=3 → arr[3]=7 → 7 < 9\nlow = 4"]
		      end
		      subgraph Step2["Step 2 — Check middle, discard right half"]
		          B["Remaining: [9, 11, 13]\nmid=5 → arr[5]=11 → 11 > 9\nhigh = 4"]
		      end
		      subgraph Step3["Step 3 — Found!"]
		          C["Remaining: [9]\nmid=4 → arr[4]=9 == 9\n✅ Return index 4"]
		      end
		      Step1 --> Step2 --> Step3
		  ```
-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > Binary Search always halves the search space → **O(log n)** time, **O(1)** space (iterative).
	  > For 1 billion elements, it needs at most **30 comparisons**.
	  > For a detailed guide on asymptotic notations and how to derive this math, see [[Complexity Analysis]].
	-
	- ## Complexity Table
	  collapsed:: true
		- | Case | Time | Why |
		  |------|------|-----|
		  | **Best** | **O(1)** | Target is at the midpoint on the first check |
		  | **Average** | **O(log n)** | Halves the search space every iteration |
		  | **Worst** | **O(log n)** | Target is at an edge or not found at all |
		  | **Space (Iterative)** | **O(1)** | Only a few integer variables needed |
		  | **Space (Recursive)** | **O(log n)** | Each call adds a frame to the call stack |
	-
	- ## Scaling Comparison vs. [[Linear Search]]
	  collapsed:: true
		- ```mermaid
		  xychart-beta
		      title "Comparisons needed: Binary Search vs Linear Search"
		      x-axis ["1K", "10K", "100K", "1M", "1B"]
		      y-axis "Comparisons" 0 --> 500000
		      bar [500, 5000, 50000, 500000, 500000]
		      line [10, 13, 17, 20, 30]
		  ```
		- | Elements | Linear Search (avg) | Binary Search |
		  |----------|--------------------:|-------------:|
		  | 1,000 | ~500 | ~10 |
		  | 10,000 | ~5,000 | ~13 |
		  | 100,000 | ~50,000 | ~17 |
		  | 1,000,000 | ~500,000 | ~20 |
		  | 1,000,000,000 | ~500,000,000 | ~30 |
		- > [!tip] Rule of Thumb
		  > Every time you **double** the array size, Binary Search needs just **one extra comparison**.
		  > That's logarithmic growth at its best.
-
- # Implementation
  collapsed:: true
	- > [!note] All implementations below are **iterative** (preferred for production).
	  > Iterative = O(1) space. Recursive = O(log n) stack space.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def binary_search(arr, target):
	      """
	      Iterative Binary Search
	      Time: O(log n) | Space: O(1)
	      Returns index of target, or -1 if not found.
	      """
	      low, high = 0, len(arr) - 1
	  
	      while low <= high:
	          mid = (low + high) // 2        # Integer division — no overflow in Python
	          if arr[mid] == target:
	              return mid                 # Found
	          elif arr[mid] < target:
	              low = mid + 1             # Target in right half
	          else:
	              high = mid - 1            # Target in left half
	  
	      return -1                         # Not found
	  
	  # Example
	  arr = [1, 3, 5, 7, 9, 11, 13]
	  print(binary_search(arr, 9))          # Output: 4
	  print(binary_search(arr, 6))          # Output: -1
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  
	  // Iterative Binary Search
	  // Time: O(log n) | Space: O(1)
	  int binarySearch(const std::vector<int>& arr, int target) {
	      int low = 0, high = static_cast<int>(arr.size()) - 1;
	  
	      while (low <= high) {
	          // Use low + (high - low) / 2 to prevent integer overflow
	          // (low + high) can overflow if both are near INT_MAX
	          int mid = low + (high - low) / 2;
	          if (arr[mid] == target)
	              return mid;               // Found
	          else if (arr[mid] < target)
	              low = mid + 1;            // Target in right half
	          else
	              high = mid - 1;           // Target in left half
	      }
	  
	      return -1;                        // Not found
	  }
	  
	  int main() {
	      std::vector<int> arr = {1, 3, 5, 7, 9, 11, 13};
	      std::cout << binarySearch(arr, 9) << "\n";  // Output: 4
	      std::cout << binarySearch(arr, 6) << "\n";  // Output: -1
	  }
	  ```
	  
	  ```javascript
	  // Iterative Binary Search (ES6)
	  // Time: O(log n) | Space: O(1)
	  function binarySearch(arr, target) {
	    let low = 0, high = arr.length - 1;
	  
	    while (low <= high) {
	      // Math.floor needed because JS / returns float
	      const mid = Math.floor((low + high) / 2);
	      if (arr[mid] === target) return mid;         // Found (=== avoids type coercion)
	      else if (arr[mid] < target) low = mid + 1;  // Target in right half
	      else high = mid - 1;                        // Target in left half
	    }
	  
	    return -1;  // Not found
	  }
	  
	  const arr = [1, 3, 5, 7, 9, 11, 13];
	  console.log(binarySearch(arr, 9));   // Output: 4
	  console.log(binarySearch(arr, 6));   // Output: -1
	  ```
	  
	  ```java
	  public class BinarySearch {
	      // Iterative Binary Search
	      // Time: O(log n) | Space: O(1)
	      public static int binarySearch(int[] arr, int target) {
	          int low = 0, high = arr.length - 1;
	  
	          while (low <= high) {
	              // Prevents overflow: avoids (low + high) which can exceed Integer.MAX_VALUE
	              int mid = low + (high - low) / 2;
	              if (arr[mid] == target) return mid;          // Found
	              else if (arr[mid] < target) low = mid + 1;  // Search right
	              else high = mid - 1;                         // Search left
	          }
	  
	          return -1;  // Not found
	      }
	  
	      public static void main(String[] args) {
	          int[] arr = {1, 3, 5, 7, 9, 11, 13};
	          System.out.println(binarySearch(arr, 9));  // Output: 4
	          System.out.println(binarySearch(arr, 6));  // Output: -1
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  
	  /* Iterative Binary Search
	     Time: O(log n) | Space: O(1)
	     Returns index of target, or -1 if not found. */
	  int binarySearch(int arr[], int n, int target) {
	      int low = 0, high = n - 1;
	  
	      while (low <= high) {
	          int mid = low + (high - low) / 2;  /* Prevents integer overflow */
	          if (arr[mid] == target) return mid;
	          else if (arr[mid] < target) low = mid + 1;   /* Search right */
	          else high = mid - 1;                          /* Search left  */
	      }
	  
	      return -1;  /* Not found */
	  }
	  
	  int main() {
	      int arr[] = {1, 3, 5, 7, 9, 11, 13};
	      int n = sizeof(arr) / sizeof(arr[0]);
	      printf("%d\n", binarySearch(arr, n, 9));   /* Output: 4 */
	      printf("%d\n", binarySearch(arr, n, 6));   /* Output: -1 */
	      return 0;
	  }
	  :::
	  -
	  - # Recursive Variant
	  collapsed:: true
	  - > [!tip] Iterative vs Recursive
	  > Both have **O(log n) time**. The difference is space:
	  > - **Iterative** → O(1) space (preferred in production, no stack risk)
	  > - **Recursive** → O(log n) space (cleaner to read, good for learning)
	  -
	  - ## How Recursion Works Here
	  collapsed:: true
	  - ```mermaid
	   flowchart TD
	       A["binary_search(arr, 9, low=0, high=6)"]
	       A --> B["mid=3, arr[3]=7 < 9\nCall: binary_search(arr, 9, low=4, high=6)"]
	       B --> C["mid=5, arr[5]=11 > 9\nCall: binary_search(arr, 9, low=4, high=4)"]
	       C --> D["mid=4, arr[4]=9 == 9\n✅ return 4"]
	       D --> C --> B --> A
	   ```
	-
	- :::code-tabs
	  
	  ```python
	  def binary_search_recursive(arr, target, low=0, high=None):
	      """
	      Recursive Binary Search
	      Time: O(log n) | Space: O(log n) — call stack depth
	      """
	      if high is None:
	          high = len(arr) - 1
	  
	      if low > high:           # Base case: search space exhausted
	          return -1
	  
	      mid = (low + high) // 2
	  
	      if arr[mid] == target:                                     # Found
	          return mid
	      elif arr[mid] < target:                                    # Search right half
	          return binary_search_recursive(arr, target, mid + 1, high)
	      else:                                                      # Search left half
	          return binary_search_recursive(arr, target, low, mid - 1)
	  
	  arr = [1, 3, 5, 7, 9, 11, 13]
	  print(binary_search_recursive(arr, 9))   # Output: 4
	  print(binary_search_recursive(arr, 6))   # Output: -1
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  
	  using namespace std;
	  
	  int binary_search_recursive(
	      vector<int>& arr,
	      int target,
	      int low,
	      int high
	  ) {
	  
	      // Base case:
	      // Search space exhausted
	      if (low > high)
	          return -1;
	  
	      int mid = low + (high - low) / 2;
	  
	      // Found target
	      if (arr[mid] == target)
	          return mid;
	  
	      // Search right half
	      if (arr[mid] < target)
	          return binary_search_recursive(
	              arr,
	              target,
	              mid + 1,
	              high
	          );
	  
	      // Search left half
	      return binary_search_recursive(
	          arr,
	          target,
	          low,
	          mid - 1
	      );
	  }
	  
	  int main() {
	  
	      vector<int> arr = {
	          1, 3, 5, 7, 9, 11, 13
	      };
	  
	      cout << binary_search_recursive(
	          arr,
	          9,
	          0,
	          arr.size() - 1
	      ) << endl;
	  
	      // Output: 4
	  
	      cout << binary_search_recursive(
	          arr,
	          6,
	          0,
	          arr.size() - 1
	      ) << endl;
	  
	      // Output: -1
	  }
	  ```
	  
	  ```javascript
	  function binarySearchRecursive(
	      arr,
	      target,
	      low = 0,
	      high = arr.length - 1
	  ) {
	  
	      // Base case:
	      // Search space exhausted
	      if (low > high)
	          return -1;
	  
	      let mid =
	          Math.floor((low + high) / 2);
	  
	      // Found target
	      if (arr[mid] === target)
	          return mid;
	  
	      // Search right half
	      if (arr[mid] < target)
	          return binarySearchRecursive(
	              arr,
	              target,
	              mid + 1,
	              high
	          );
	  
	      // Search left half
	      return binarySearchRecursive(
	          arr,
	          target,
	          low,
	          mid - 1
	      );
	  }
	  
	  
	  const arr = [
	      1, 3, 5, 7, 9, 11, 13
	  ];
	  
	  console.log(
	      binarySearchRecursive(arr, 9)
	  );
	  
	  // Output: 4
	  
	  console.log(
	      binarySearchRecursive(arr, 6)
	  );
	  
	  // Output: -1
	  ```
	  
	  ```java
	  public class Main {
	  
	      static int binarySearchRecursive(
	          int[] arr,
	          int target,
	          int low,
	          int high
	      ) {
	  
	          // Base case:
	          // Search space exhausted
	          if (low > high)
	              return -1;
	  
	          int mid =
	              low + (high - low) / 2;
	  
	          // Found target
	          if (arr[mid] == target)
	              return mid;
	  
	          // Search right half
	          if (arr[mid] < target)
	              return binarySearchRecursive(
	                  arr,
	                  target,
	                  mid + 1,
	                  high
	              );
	  
	          // Search left half
	          return binarySearchRecursive(
	              arr,
	              target,
	              low,
	              mid - 1
	          );
	      }
	  
	      public static void main(String[] args) {
	  
	          int[] arr = {
	              1, 3, 5, 7, 9, 11, 13
	          };
	  
	          System.out.println(
	              binarySearchRecursive(
	                  arr,
	                  9,
	                  0,
	                  arr.length - 1
	              )
	          );
	  
	          // Output: 4
	  
	          System.out.println(
	              binarySearchRecursive(
	                  arr,
	                  6,
	                  0,
	                  arr.length - 1
	              )
	          );
	  
	          // Output: -1
	      }
	  }
	  ```
	  :::
-
- # When to Use Binary Search
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Is your\narray sorted?"}
	      Q -- No --> S1{"Will you search\nit many times?"}
	      S1 -- Yes --> R1["✅ Sort once, then\nuse Binary Search"]
	      S1 -- No --> R2["❌ Use Linear Search\n(sort cost not worth it)"]
	      Q -- Yes --> S2{"Array size?"}
	      S2 -- "< 20 elements" --> R3["❌ Linear Search is fine\n(overhead negligible)"]
	      S2 -- "> 20 elements" --> R4["✅ Use Binary Search"]
	  ```
	-
	- ## ✅ Use Binary Search When
		- Data is **already sorted** (ascending or descending)
		- You need to perform **many lookups** on the same static dataset
		- Dataset is **large** — thousands or millions of elements
		- Memory is limited — iterative version uses only **O(1) space**
		- You need **exact match** on numbers, strings, or comparable custom types
	-
	- ## ❌ Avoid Binary Search When
		- Array is **unsorted** and you only need **one search** (sort cost > [[Linear Search]])
		- Array is **very small** — under ~20 elements ([[Linear Search]] is fast enough)
		- Data **changes frequently** — insertions/deletions break sorted order
		- You need **approximate or fuzzy matching** (use variant forms instead)
-
- # Binary Search Variants
  collapsed:: true
	- > [!important] Why Variants Matter
	  > Standard binary search finds *any* occurrence of the target.
	  > If duplicates exist, you often need the **first** or **last** occurrence — that's where Lower/Upper Bound come in.
	-
	- ## Variant Overview
	  collapsed:: true
		- ```mermaid
		  flowchart LR
		      BS["Binary Search\nFind any match"]
		      BS --> LB["Lower Bound\nFirst index ≥ target"]
		      BS --> UB["Upper Bound\nFirst index > target"]
		      LB --> COUNT["Count occurrences\nupper - lower"]
		      LB --> FIRST["Find first occurrence"]
		      UB --> LAST["Find last occurrence\nupper - 1"]
		  ```
	-
	- ## Lower Bound — First Position ≥ Target
	  collapsed:: true
		- The first index `i` where `arr[i] >= target`. Works correctly even when target doesn't exist.
		- :::code-tabs
		  
		  ```python
		  def lower_bound(arr, target):
		      """
		      Returns first index i where arr[i] >= target.
		      If target > all elements, returns len(arr).
		      """
		      low, high = 0, len(arr)          # Note: high = len(arr), not len-1
		      while low < high:                 # Note: strict <, not <=
		          mid = (low + high) // 2
		          if arr[mid] < target:
		              low = mid + 1             # mid is too small, go right
		          else:
		              high = mid                # mid could be the answer, keep it
		      return low
		  
		  arr = [1, 3, 5, 5, 5, 9, 13]
		  print(lower_bound(arr, 5))    # Output: 2  (first index of 5)
		  print(lower_bound(arr, 6))    # Output: 5  (where 6 would be inserted)
		  ```
		  
		  ```c++
		  #include <iostream>
		  #include <vector>
		  
		  using namespace std;
		  
		  int lower_bound_custom(vector<int>& arr, int target) {
		  
		      int low = 0;
		      int high = arr.size();
		  
		      while (low < high) {
		  
		          int mid = low + (high - low) / 2;
		  
		          if (arr[mid] < target)
		              low = mid + 1;
		          else
		              high = mid;
		      }
		  
		      return low;
		  }
		  
		  int main() {
		  
		      vector<int> arr = {1, 3, 5, 5, 5, 9, 13};
		  
		      cout << lower_bound_custom(arr, 5) << endl; // 2
		      cout << lower_bound_custom(arr, 6) << endl; // 5
		  }
		  ```
		  
		  ```javascript
		  function lowerBound(arr, target) {
		  
		      let low = 0;
		      let high = arr.length;
		  
		      while (low < high) {
		  
		          let mid = Math.floor((low + high) / 2);
		  
		          if (arr[mid] < target)
		              low = mid + 1;
		          else
		              high = mid;
		      }
		  
		      return low;
		  }
		  
		  
		  const arr = [1, 3, 5, 5, 5, 9, 13];
		  
		  console.log(lowerBound(arr, 5)); // 2
		  console.log(lowerBound(arr, 6)); // 5
		  ```
		  
		  ```java
		  public class Main {
		  
		      static int lowerBound(int[] arr, int target) {
		  
		          int low = 0;
		          int high = arr.length;
		  
		          while (low < high) {
		  
		              int mid = low + (high - low) / 2;
		  
		              if (arr[mid] < target)
		                  low = mid + 1;
		              else
		                  high = mid;
		          }
		  
		          return low;
		      }
		  
		      public static void main(String[] args) {
		  
		          int[] arr = {1, 3, 5, 5, 5, 9, 13};
		  
		          System.out.println(lowerBound(arr, 5)); // 2
		          System.out.println(lowerBound(arr, 6)); // 5
		      }
		  }
		  ```
		  :::
	-
	- ## Upper Bound — First Position > Target
	  collapsed:: true
		- The first index `i` where `arr[i] > target`. Use `upper - 1` to find the last occurrence.
		- :::code-tabs
		  
		  ```python
		  def upper_bound(arr, target):
		      """
		      Returns first index i where arr[i] > target.
		      Equivalent to: one past the last occurrence of target.
		      """
		      low, high = 0, len(arr)
		      while low < high:
		          mid = (low + high) // 2
		          if arr[mid] <= target:
		              low = mid + 1             # mid is ≤ target, go right
		          else:
		              high = mid                # mid could be the answer, keep it
		      return low
		  
		  arr = [1, 3, 5, 5, 5, 9, 13]
		  print(upper_bound(arr, 5))            # Output: 5  (one past last 5)
		  print(upper_bound(arr, 5) - 1)        # Output: 4  (last occurrence of 5)
		  
		  # Count occurrences of target
		  count = upper_bound(arr, 5) - lower_bound(arr, 5)
		  print(count)                          # Output: 3
		  ```
		  
		  ```c++
		  #include <iostream>
		  #include <vector>
		  
		  using namespace std;
		  
		  int upper_bound_custom(vector<int>& arr, int target) {
		  
		      int low = 0;
		      int high = arr.size();
		  
		      while (low < high) {
		  
		          int mid = low + (high - low) / 2;
		  
		          if (arr[mid] <= target)
		              low = mid + 1;
		          else
		              high = mid;
		      }
		  
		      return low;
		  }
		  
		  int main() {
		  
		      vector<int> arr = {1, 3, 5, 5, 5, 9, 13};
		  
		      cout << upper_bound_custom(arr, 5) << endl;     // 5
		      cout << upper_bound_custom(arr, 5) - 1 << endl; // 4
		  }
		  ```
		  
		  ```javascript
		  function upperBound(arr, target) {
		  
		      let low = 0;
		      let high = arr.length;
		  
		      while (low < high) {
		  
		          let mid = Math.floor((low + high) / 2);
		  
		          if (arr[mid] <= target)
		              low = mid + 1;
		          else
		              high = mid;
		      }
		  
		      return low;
		  }
		  
		  
		  const arr = [1, 3, 5, 5, 5, 9, 13];
		  
		  console.log(upperBound(arr, 5));     // 5
		  console.log(upperBound(arr, 5) - 1); // 4
		  ```
		  
		  ```java
		  public class Main {
		  
		      static int upperBound(int[] arr, int target) {
		  
		          int low = 0;
		          int high = arr.length;
		  
		          while (low < high) {
		  
		              int mid = low + (high - low) / 2;
		  
		              if (arr[mid] <= target)
		                  low = mid + 1;
		              else
		                  high = mid;
		          }
		  
		          return low;
		      }
		  
		      public static void main(String[] args) {
		  
		          int[] arr = {1, 3, 5, 5, 5, 9, 13};
		  
		          System.out.println(upperBound(arr, 5));     // 5
		          System.out.println(upperBound(arr, 5) - 1); // 4
		      }
		  }
		  ```
		  :::
	-
	- ## Python Built-in — `bisect` Module
	  collapsed:: true
		- > [!tip] Use `bisect` in production Python code — it's implemented in C and battle-tested.
		- :::code-tabs
		  
		  ```python
		  import bisect
		  
		  arr = [1, 3, 5, 5, 5, 9, 13]
		  
		  # bisect_left  = lower_bound (first index >= target)
		  print(bisect.bisect_left(arr, 5))     # Output: 2
		  
		  # bisect_right = upper_bound (first index > target)
		  print(bisect.bisect_right(arr, 5))    # Output: 5
		  
		  # Count occurrences
		  count = bisect.bisect_right(arr, 5) - bisect.bisect_left(arr, 5)
		  print(count)                          # Output: 3
		  
		  # Safe existence check (O(log n))
		  def contains(arr, target):
		      i = bisect.bisect_left(arr, target)
		      return i < len(arr) and arr[i] == target
		  
		  print(contains(arr, 5))               # True
		  print(contains(arr, 6))               # False
		  ```
		  
		  ```c++
		  #include <iostream>
		  #include <vector>
		  #include <algorithm>
		  
		  using namespace std;
		  
		  int main() {
		  
		      vector<int> arr = {1, 3, 5, 5, 5, 9, 13};
		  
		      // lower_bound = first index >= target
		      int lb = lower_bound(arr.begin(), arr.end(), 5) - arr.begin();
		  
		      // upper_bound = first index > target
		      int ub = upper_bound(arr.begin(), arr.end(), 5) - arr.begin();
		  
		      cout << lb << endl; // 2
		      cout << ub << endl; // 5
		  
		      // count occurrences
		      cout << ub - lb << endl; // 3
		  
		      return 0;
		  }
		  ```
		  
		  ```javascript
		  function lowerBound(arr, target) {
		  
		      let left = 0;
		      let right = arr.length;
		  
		      while (left < right) {
		  
		          let mid = Math.floor((left + right) / 2);
		  
		          if (arr[mid] < target)
		              left = mid + 1;
		          else
		              right = mid;
		      }
		  
		      return left;
		  }
		  
		  const arr = [1, 3, 5, 5, 5, 9, 13];
		  
		  console.log(lowerBound(arr, 5));
		  // Output: 2
		  ```
		  
		  ```java
		  public class Main {
		  
		      static int lowerBound(int[] arr, int target) {
		  
		          int left = 0;
		          int right = arr.length;
		  
		          while (left < right) {
		  
		              int mid = left + (right - left) / 2;
		  
		              if (arr[mid] < target)
		                  left = mid + 1;
		              else
		                  right = mid;
		          }
		  
		          return left;
		      }
		  
		      public static void main(String[] args) {
		  
		          int[] arr = {1, 3, 5, 5, 5, 9, 13};
		  
		          System.out.println(lowerBound(arr, 5));
		  
		          // Output: 2
		      }
		  }
		  ```
		  :::
-
- # Key Takeaways
  collapsed:: true
	- **Core idea** — halve the search space each step → **O(log n)** time, **O(1)** space (iterative).
	- **Hard requirement** — array must be **sorted** before using Binary Search; no exceptions.
	- **Overflow safe** — always write `mid = low + (high - low) / 2` in C/C++/Java, not `(low + high) / 2`.
	- **Iterative > Recursive** for production — iterative avoids call stack growth and is slightly faster.
	- **Duplicates** — for first/last occurrence, use `lower_bound` / `upper_bound` variants, not plain binary search.
	- **Python shortcut** — the built-in `bisect` module gives you battle-tested binary search in one import.
	- **Diminishing returns** — binary search on < 20 elements is overkill; the overhead isn't worth the gain.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Binary Search](https://www.geeksforgeeks.org/binary-search/)
		- [Wikipedia -> Binary search algorithm](https://en.wikipedia.org/wiki/Binary_search_algorithm)
		- [CP-Algorithms -> Binary Search](https://cp-algorithms.com/num_methods/binary_search.html)