---
seoTitle: Comb Sort Algorithm – Eliminating Turtles, Complexity, and Code
description: "In-depth guide to Comb Sort. Explains how gap-based comparison solves Bubble Sort's 'turtle' problem, details shrink factor optimization, complexity analysis, and complete code implementations."
keywords: "comb sort, combsort, sorting algorithm, bubble sort, shrink factor, turtles and rabbits, in-place sort, time complexity, space complexity, comparison sort, VR-Rathod, Code-Note, Vaibhav Rathod"
treeTitle: DSA - Sorting & Searching - Comb Sort
---

> [!info] What is Comb Sort?
> **Comb Sort** is an in-place comparison-based sorting algorithm. It is a direct improvement on **Bubble Sort** designed to eliminate "turtles"—small values near the end of the array that move extremely slowly to the front in Bubble Sort. By using a decreasing "gap" sequence (shrink factor of $1.3$), Comb Sort compares and swaps elements far apart before finishing with a standard Bubble Sort pass.

- # Explanation
  collapsed:: true
	- In Bubble Sort, elements are always compared to their immediate neighbors ($gap = 1$). If a small value is near the end, it takes many passes to bubble up to the beginning (referred to as a **turtle**). Large values near the beginning move quickly (referred to as **rabbits**).
	-
	- ## Resolving the Turtle Problem
	  collapsed:: true
		- Comb Sort eliminates turtles by comparing elements separated by a larger gap.
		- The gap starts as the array length $N$, and in each pass is divided by the **shrink factor** of $1.3$.
		- Once the gap shrinks to $1$, the algorithm behaves like Bubble Sort, but because the turtles have already been moved, the final pass is extremely fast.
	-
	- ## Core Properties
	  collapsed:: true
		- **Stability:** **Not Stable** (Like Shell Sort, swaps across large gaps can scramble the relative order of identical elements).
		- **In-Place:** **Yes** ($O(1)$ auxiliary space).
		- **Adaptability:** **No** (It always goes through the gap-shrinking loop until no swaps occur).
-
- # How It Works
  collapsed:: true
	- ## The Process Flow
	  collapsed:: true
		- 1. Set the initial gap size to $N$ (the array length).
		- 2. Calculate the new gap: $gap = \lfloor gap / 1.3 \rfloor$. If the gap is less than 1, set it to 1.
		- 3. Loop through the array, comparing elements that are `gap` distance apart. Swap if they are out of order.
		- 4. Repeat steps 2-3. The loop terminates when $gap = 1$ and a full pass is completed with zero swaps.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — Input Array of size N"] --> B["gap = N; sorted = false"]
		      B --> C{"not sorted?"}
		      C -- Yes --> D["gap = floor(gap / 1.3)\nif gap <= 1: gap = 1, sorted = true"]
		      D --> E["i = 0"]
		      E --> F{"i < N - gap?"}
		      F -- Yes --> G{"arr[i] > arr[i + gap]?"}
		      G -- Yes --> H["Swap arr[i] and arr[i + gap]\nsorted = false"]
		      H --> I["i = i + 1"]
		      G -- No --> I
		      I --> F
		      F -- No --> C
		      C -- No --> J["End — Array Sorted"]
		      style J fill:#22c55e,stroke:#15803d,stroke-width:2px,color:#fff
		  ```
	-
	- ## Visual Dry-Run Trace (Sorting: [8, 4, 1, 5, 3] with shrink factor = 1.3)
	  collapsed:: true
		- Initial array: `[8, 4, 1, 5, 3]` ($N = 5$)
		-
		- | Pass | Gap | index (i) | Comparison | Swap? | Array State |
		  |---|---|---|---|---|---|
		  | **1** | $\lfloor 5 / 1.3 \rfloor = 3$ | 0 | `arr[0](8) > arr[3](5)` | Yes | `[5, 4, 1, 8, 3]` |
		  | | | 1 | `arr[1](4) > arr[4](3)` | Yes | `[5, 3, 1, 8, 4]` |
		  | **2** | $\lfloor 3 / 1.3 \rfloor = 2$ | 0 | `arr[0](5) > arr[2](1)` | Yes | `[1, 3, 5, 8, 4]` |
		  | | | 1 | `arr[1](3) < arr[3](8)` | No | `[1, 3, 5, 8, 4]` |
		  | | | 2 | `arr[2](5) > arr[4](4)` | Yes | `[1, 3, 4, 8, 5]` |
		  | **3** | $\lfloor 2 / 1.3 \rfloor = 1$ | 0 | `arr[0](1) < arr[1](3)` | No | `[1, 3, 4, 8, 5]` |
		  | | | 1 | `arr[1](3) < arr[2](4)` | No | `[1, 3, 4, 8, 5]` |
		  | | | 2 | `arr[2](4) < arr[3](8)` | No | `[1, 3, 4, 8, 5]` |
		  | | | 3 | `arr[3](8) > arr[4](5)` | Yes | `[1, 3, 4, 5, 8]` (sorted flag set to false) |
		  | **4** | $\lfloor 1 / 1.3 \rfloor = 1$ | 0 to 3 | All in order | No | `[1, 3, 4, 5, 8]` (Loop terminates) |
-
- # Time & Space Complexity
  collapsed:: true
	- | Scenario | Time Complexity | Space Complexity | Trigger Condition |
	  |---|---|---|---|
	  | **Best Case** | **O(n log n)** | **O(1)** | Array is already sorted or nearly sorted. |
	  | **Average Case** | **O(n² / 2^p)** or **O(n log n)** | **O(1)** | Typical random-ordered arrays. In practice, performs similarly to $O(n \log n)$. |
	  | **Worst Case** | **O(n²)** | **O(1)** | Specific worst-case inputs where elements trigger maximum swaps. |
	-
	- ## Comparison: Comb Sort vs. Shell Sort
	  collapsed:: true
		- While both are gap-based improvements, **Shell Sort** is a gap-based variation of **Insertion Sort**, whereas **Comb Sort** is a gap-based variation of **Bubble Sort**. Shell Sort generally performs fewer comparisons, but Comb Sort is simpler to implement.
-
- # Implementation
  collapsed:: true
	- > [!note] Comb Sort using a standard shrink factor of $1.3$.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def comb_sort(arr):
	      n = len(arr)
	      gap = n
	      shrink = 1.3
	      sorted_flag = False
	      
	      while not sorted_flag:
	          # Shrink the gap
	          gap = int(gap / shrink)
	          if gap <= 1:
	              gap = 1
	              sorted_flag = True
	              
	          # Perform a single pass with the current gap
	          for i in range(0, n - gap):
	              if arr[i] > arr[i + gap]:
	                  arr[i], arr[i + gap] = arr[i + gap], arr[i]
	                  sorted_flag = False # Swaps occurred, not yet sorted
	      return arr
	  
	  if __name__ == "__main__":
	      data = [8, 4, 1, 5, 3]
	      print("Original:", data)
	      comb_sort(data)
	      print("Sorted:  ", data)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  void combSort(std::vector<int>& arr) {
	      int n = arr.size();
	      int gap = n;
	      double shrink = 1.3;
	      bool sorted = false;
	  
	      while (!sorted) {
	          gap = static_cast<int>(gap / shrink);
	          if (gap <= 1) {
	              gap = 1;
	              sorted = true;
	          }
	  
	          for (int i = 0; i < n - gap; ++i) {
	              if (arr[i] > arr[i + gap]) {
	                  std::swap(arr[i], arr[i + gap]);
	                  sorted = false;
	              }
	          }
	      }
	  }
	  
	  int main() {
	      std::vector<int> data = {8, 4, 1, 5, 3};
	      combSort(data);
	      std::cout << "Sorted: ";
	      for (int val : data) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function combSort(arr) {
	      const n = arr.length;
	      let gap = n;
	      const shrink = 1.3;
	      let sorted = false;
	  
	      while (!sorted) {
	          gap = Math.floor(gap / shrink);
	          if (gap <= 1) {
	              gap = 1;
	              sorted = true;
	          }
	  
	          for (let i = 0; i < n - gap; i++) {
	              if (arr[i] > arr[i + gap]) {
	                  const temp = arr[i];
	                  arr[i] = arr[i + gap];
	                  arr[i + gap] = temp;
	                  sorted = false;
	              }
	          }
	      }
	      return arr;
	  }
	  
	  // Example
	  const data = [8, 4, 1, 5, 3];
	  combSort(data);
	  console.log("Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  public class CombSort {
	      public static void combSort(int[] arr) {
	          int n = arr.length;
	          int gap = n;
	          double shrink = 1.3;
	          boolean sorted = false;
	  
	          while (!sorted) {
	              gap = (int) (gap / shrink);
	              if (gap <= 1) {
	                  gap = 1;
	                  sorted = true;
	              }
	  
	              for (int i = 0; i < n - gap; i++) {
	                  if (arr[i] > arr[i + gap]) {
	                      int temp = arr[i];
	                      arr[i] = arr[i + gap];
	                      arr[i + gap] = temp;
	                      sorted = false;
	                  }
	              }
	          }
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {8, 4, 1, 5, 3};
	          combSort(data);
	          System.out.println("Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  
	  void combSort(int arr[], int n) {
	      int gap = n;
	      double shrink = 1.3;
	      int sorted = 0;
	  
	      while (!sorted) {
	          gap = (int)(gap / shrink);
	          if (gap <= 1) {
	              gap = 1;
	              sorted = 1;
	          }
	  
	          for (int i = 0; i < n - gap; i++) {
	              if (arr[i] > arr[i + gap]) {
	                  int temp = arr[i];
	                  arr[i] = arr[i + gap];
	                  arr[i + gap] = temp;
	                  sorted = 0;
	              }
	          }
	      }
	  }
	  
	  int main() {
	      int data[] = {8, 4, 1, 5, 3};
	      int n = sizeof(data) / sizeof(data[0]);
	      combSort(data, n);
	      printf("Sorted: ");
	      for (int i = 0; i < n; i++) {
	          printf("%d ", data[i]);
	      }
	      printf("\n");
	      return 0;
	  }
	  ```
	  
	  :::
-
- # Alternative Variant (Comb Sort 11)
  collapsed:: true
	- > [!tip] The Comb 11 Rule
	  > Comb Sort can experience performance lags if the gap size becomes $9$ or $10$. Empirical evidence shows that forcing the gap to **11** whenever it calculates to $9$ or $10$ significantly accelerates sorting speed. This variation is known as **Comb Sort 11**.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def comb_sort_11(arr):
	      n = len(arr)
	      gap = n
	      shrink = 1.3
	      sorted_flag = False
	      
	      while not sorted_flag:
	          # Shrink the gap
	          gap = int(gap / shrink)
	          if gap <= 1:
	              gap = 1
	              sorted_flag = True
	          elif gap == 9 or gap == 10:
	              gap = 11  # Force gap to 11
	              
	          # Perform a single pass with current gap
	          for i in range(0, n - gap):
	              if arr[i] > arr[i + gap]:
	                  arr[i], arr[i + gap] = arr[i + gap], arr[i]
	                  sorted_flag = False
	      return arr
	  
	  if __name__ == "__main__":
	      data = [8, 4, 1, 5, 3]
	      print("Comb 11 Sorted:", comb_sort_11(data))
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  void combSort11(std::vector<int>& arr) {
	      int n = arr.size();
	      int gap = n;
	      double shrink = 1.3;
	      bool sorted = false;
	  
	      while (!sorted) {
	          gap = static_cast<int>(gap / shrink);
	          if (gap <= 1) {
	              gap = 1;
	              sorted = true;
	          } else if (gap == 9 || gap == 10) {
	              gap = 11; // Comb 11 rule
	          }
	  
	          for (int i = 0; i < n - gap; ++i) {
	              if (arr[i] > arr[i + gap]) {
	                  std::swap(arr[i], arr[i + gap]);
	                  sorted = false;
	              }
	          }
	      }
	  }
	  
	  int main() {
	      std::vector<int> data = {8, 4, 1, 5, 3};
	      combSort11(data);
	      std::cout << "Comb 11 Sorted: ";
	      for (int val : data) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function combSort11(arr) {
	      const n = arr.length;
	      let gap = n;
	      const shrink = 1.3;
	      let sorted = false;
	  
	      while (!sorted) {
	          gap = Math.floor(gap / shrink);
	          if (gap <= 1) {
	              gap = 1;
	              sorted = true;
	          } else if (gap === 9 || gap === 10) {
	              gap = 11;
	          }
	  
	          for (let i = 0; i < n - gap; i++) {
	              if (arr[i] > arr[i + gap]) {
	                  const temp = arr[i];
	                  arr[i] = arr[i + gap];
	                  arr[i + gap] = temp;
	                  sorted = false;
	              }
	          }
	      }
	      return arr;
	  }
	  
	  const data = [8, 4, 1, 5, 3];
	  combSort11(data);
	  console.log("Comb 11 Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  public class CombSort11 {
	      public static void combSort11(int[] arr) {
	          int n = arr.length;
	          int gap = n;
	          double shrink = 1.3;
	          boolean sorted = false;
	  
	          while (!sorted) {
	              gap = (int) (gap / shrink);
	              if (gap <= 1) {
	                  gap = 1;
	                  sorted = true;
	              } else if (gap == 9 || gap == 10) {
	                  gap = 11;
	              }
	  
	              for (int i = 0; i < n - gap; i++) {
	                  if (arr[i] > arr[i + gap]) {
	                      int temp = arr[i];
	                      arr[i] = arr[i + gap];
	                      arr[i + gap] = temp;
	                      sorted = false;
	                  }
	              }
	          }
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {8, 4, 1, 5, 3};
	          combSort11(data);
	          System.out.println("Comb 11 Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  
	  void combSort11(int arr[], int n) {
	      int gap = n;
	      double shrink = 1.3;
	      int sorted = 0;
	  
	      while (!sorted) {
	          gap = (int)(gap / shrink);
	          if (gap <= 1) {
	              gap = 1;
	              sorted = 1;
	          } else if (gap == 9 || gap == 10) {
	              gap = 11;
	          }
	  
	          for (int i = 0; i < n - gap; i++) {
	              if (arr[i] > arr[i + gap]) {
	                  int temp = arr[i];
	                  arr[i] = arr[i + gap];
	                  arr[i + gap] = temp;
	                  sorted = 0;
	              }
	          }
	      }
	  }
	  
	  int main() {
	      int data[] = {8, 4, 1, 5, 3};
	      int n = sizeof(data) / sizeof(data[0]);
	      combSort11(data, n);
	      printf("Comb 11 Sorted: ");
	      for (int i = 0; i < n; i++) {
	          printf("%d ", data[i]);
	      }
	      printf("\n");
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Comb Sort
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Is array size\nsmall or medium?"}
	      Q -- No --> R1["❌ Use Quick/Merge/Heap Sort\n(O(n log n) scaling)"]
	      Q -- Yes --> S1{"Is memory/recursion stack\nhighly restricted?"}
	      S1 -- No --> R2["❌ Other sorts fine\n(but Comb Sort still good)"]
	      S1 -- Yes --> S2{"Is stability\nrequired?"}
	      S2 -- Yes --> R3["❌ Use Insertion/Merge Sort\n(Comb is unstable)"]
	      S2 -- No --> R4["✅ Use Comb Sort\n(In-place, O(1) space, zero recursion, outperforms Bubble)"]
	  ```
	-
	- ## ✅ Use Comb Sort When
		- You want an in-place sort that is **extremely simple to write** but is far faster than Bubble Sort.
		- Memory is tight and recursion stack overflow is a risk, making O(1) space and zero call stack growth essential.
		- The data is general, but you want to eliminate slow-moving "turtles" (small elements near the end).
	-
	- ## ❌ Avoid Comb Sort When
		- You require a **stable** sort (relative order of identical keys must be preserved).
		- You need guaranteed optimal comparison sorting ($O(n \log n)$ worst-case) on large arrays.
-
- # Key Takeaways
  collapsed:: true
	- **Bubble Sort Extension** — compares elements at a distance (`gap`) that shrinks by a factor of 1.3 each pass.
	- **Turtle Elimination** — designed specifically to resolve Bubble Sort's "turtle" anomaly (small values trapped near the end).
	- **Unstable** — element comparisons and swaps across varying gaps can reorder duplicate keys.
	- **In-place** — requires only $O(1)$ auxiliary memory and no stack space.
	- **Comb 11 Rule** — forces gaps of 9 or 10 to become 11, improving average-case complexity to $O(n \log n)$ in practice.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Comb Sort](https://www.geeksforgeeks.org/comb-sort/)
		- [Wikipedia -> Comb sort](https://en.wikipedia.org/wiki/Comb_sort)