---
seoTitle: Shell Sort Algorithm – Gap Sequence Optimization, Complexity, and Code
description: "In-depth guide to Shell Sort. Explains gap sequences (Shell's original, Knuth's 3k+1, and Ciura's), time and space complexity, stability analysis, and full implementations in Python, C++, JavaScript, Java, and C."
keywords: "shell sort, shellsort, gap sequence, insertion sort, Knuth sequence, Ciura sequence, in-place sort, time complexity, space complexity, comparison sort, VR-Rathod, Code-Note, Vaibhav Rathod"
treeTitle: DSA - Sorting & Searching - Shell Sort
---

> [!info] What is Shell Sort?
> **Shell Sort** is an in-place comparison-based sorting algorithm. It is a highly optimized generalization of **Insertion Sort** that overcomes the limitation of shifting elements by only one position at a time. By comparing and swapping elements that are separated by a decreasing "gap", it quickly eliminates large inversions and transitions the array into a nearly-sorted state, where Insertion Sort runs in near-linear time.

- # Explanation
  collapsed:: true
	- Shell Sort works by grouping elements that are `gap` elements apart, sorting them using Insertion Sort, then reducing the gap until it reaches $1$.
	-
	- ## Why Gaps Matter
	  collapsed:: true
		- In Insertion Sort, if the smallest element is at the very end of the array, it requires $O(n)$ swaps to move to the front.
		- Shell Sort allows elements to make giant leaps, resolving far-apart inversions in early passes.
		-
		- ### Gap Sequences:
			- **Shell's Original Sequence:** $N/2, N/4, \dots, 1$. Worst-case time complexity: $O(n^2)$.
			- **Knuth's Sequence ($3k + 1$):** $1, 4, 13, 40, \dots$ (where $h_i = 3h_{i-1} + 1$). Worst-case time complexity: $O(n^{1.5})$.
			- **Ciura's Sequence:** $1, 4, 9, 20, 46, 103, \dots$ (empirically shown to be one of the best performing sequences).
	-
	- ## Core Properties
	  collapsed:: true
		- **Stability:** **Not Stable** (Elements are swapped over large gaps, which can disrupt the relative order of equal elements).
		- **In-Place:** **Yes** ($O(1)$ auxiliary space).
		- **Adaptability:** **Yes** (Performs significantly faster on partially sorted inputs).
-
- # How It Works
  collapsed:: true
	- ## Process Flow
	  collapsed:: true
		- 1. Calculate the starting gap size (e.g., using Knuth's formula $gap < N/3$).
		- 2. Perform a gap-based insertion sort on the sub-arrays.
		- 3. Decrease the gap size (e.g., $gap = \lfloor gap / 3 \rfloor$).
		- 4. Repeat until $gap = 1$, which performs a final standard Insertion Sort.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — Input Array of size N"] --> B["Initialize gap using Knuth's formula:\ngap = 1; while gap < N/3: gap = gap * 3 + 1"]
		      B --> C{"gap > 0?"}
		      C -- Yes --> D["Perform Insertion Sort for elements at distance 'gap'"]
		      D --> E["Reduce gap: gap = gap / 3"]
		      E --> C
		      C -- No --> F["End — Array Sorted"]
		      style F fill:#22c55e,stroke:#15803d,stroke-width:2px,color:#fff
		  ```
	-
	- ## Visual Dry-Run Trace (Sorting: [9, 8, 3, 7, 5, 6, 4, 1] using Knuth's sequence)
	  collapsed:: true
		- Initial array: `[9, 8, 3, 7, 5, 6, 4, 1]` ($N = 8$)
		- Knuth's gap condition: `gap < 8/3` (2) $\rightarrow$ Initial `gap = 4` (since $1 \times 3 + 1 = 4$).
		-
		- ### Pass 1 (gap = 4):
			- Compare indices $(0, 4) \rightarrow 9 > 5 \rightarrow$ swap $\rightarrow$ `[5, 8, 3, 7, 9, 6, 4, 1]`
			- Compare indices $(1, 5) \rightarrow 8 > 6 \rightarrow$ swap $\rightarrow$ `[5, 6, 3, 7, 9, 8, 4, 1]`
			- Compare indices $(2, 6) \rightarrow 3 < 4 \rightarrow$ no swap $\rightarrow$ `[5, 6, 3, 7, 9, 8, 4, 1]`
			- Compare indices $(3, 7) \rightarrow 7 > 1 \rightarrow$ swap $\rightarrow$ `[5, 6, 3, 1, 9, 8, 4, 7]`
			- Array after Pass 1: `[5, 6, 3, 1, 9, 8, 4, 7]`
		-
		- ### Pass 2 (gap = 1):
			- Run standard Insertion Sort:
			- $i=1$: `6 > 5` $\rightarrow$ `[5, 6, 3, 1, 9, 8, 4, 7]`
			- $i=2$: `3 < 6` and `3 < 5` $\rightarrow$ insert 3 $\rightarrow$ `[3, 5, 6, 1, 9, 8, 4, 7]`
			- $i=3$: `1` shifts 6, 5, 3 $\rightarrow$ insert 1 $\rightarrow$ `[1, 3, 5, 6, 9, 8, 4, 7]`
			- $i=4$: `9` is in place $\rightarrow$ `[1, 3, 5, 6, 9, 8, 4, 7]`
			- $i=5$: `8 < 9` $\rightarrow$ shift 9 $\rightarrow$ `[1, 3, 5, 6, 8, 9, 4, 7]`
			- $i=6$: `4` shifts 9, 8, 6, 5 $\rightarrow$ insert 4 $\rightarrow$ `[1, 3, 4, 5, 6, 8, 9, 7]`
			- $i=7$: `7` shifts 9, 8 $\rightarrow$ insert 7 $\rightarrow$ `[1, 3, 4, 5, 6, 7, 8, 9]`
			- Final Sorted Array: `[1, 3, 4, 5, 6, 7, 8, 9]`
-
- # Complexity Analysis
  collapsed:: true
	- | Scenario | Time Complexity | Space Complexity | Trigger Condition |
	  |---|---|---|---|
	  | **Best Case** | **O(n log n)** | **O(1)** | Array is already sorted (can be $O(n)$ under specific gap-checking optimizations). |
	  | **Average Case** | **O(n^(1.25)) to O(n^(1.5))** | **O(1)** | Depends heavily on the chosen gap sequence. Knuth's sequence yields $O(n^{1.5})$. |
	  | **Worst Case** | **O(n^(1.5)) to O(n²)** | **O(1)** | For Shell's sequence: $O(n^2)$. For Knuth's sequence: $O(n^{1.5})$. |
	-
	- ## Why Shell Sort outperforms Insertion Sort
	  collapsed:: true
		- In the worst case of Insertion Sort ($O(n^2)$), every element must be shifted one by one. In Shell Sort, elements move long distances early on, creating a partially sorted state that requires very few shifts in the final $gap = 1$ pass.
-
- # Implementation
  collapsed:: true
	- > [!note] Shell Sort using Knuth's Gap Sequence ($3k + 1$).
		- Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def shell_sort(arr):
	      n = len(arr)
	      gap = 1
	      # Initialize Knuth's gap sequence: 1, 4, 13, 40, 121, ...
	      while gap < n // 3:
	          gap = gap * 3 + 1
	          
	      while gap > 0:
	          # Perform a gap-based insertion sort
	          for i in range(gap, n):
	              temp = arr[i]
	              j = i
	              while j >= gap and arr[j - gap] > temp:
	                  arr[j] = arr[j - gap]
	                  j -= gap
	              arr[j] = temp
	          # Reduce the gap
	          gap //= 3
	      return arr
	  
	  if __name__ == "__main__":
	      data = [9, 8, 3, 7, 5, 6, 4, 1]
	      print("Original:", data)
	      shell_sort(data)
	      print("Sorted:  ", data)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  
	  void shellSort(std::vector<int>& arr) {
	      int n = arr.size();
	      int gap = 1;
	      // Initialize Knuth's gap sequence: 1, 4, 13, 40, ...
	      while (gap < n / 3) {
	          gap = gap * 3 + 1;
	      }
	  
	      while (gap > 0) {
	          for (int i = gap; i < n; ++i) {
	              int temp = arr[i];
	              int j = i;
	              while (j >= gap && arr[j - gap] > temp) {
	                  arr[j] = arr[j - gap];
	                  j -= gap;
	              }
	              arr[j] = temp;
	          }
	          gap /= 3; // Reduce gap
	      }
	  }
	  
	  int main() {
	      std::vector<int> data = {9, 8, 3, 7, 5, 6, 4, 1};
	      shellSort(data);
	      std::cout << "Sorted: ";
	      for (int val : data) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function shellSort(arr) {
	      const n = arr.length;
	      let gap = 1;
	      // Initialize Knuth's gap sequence
	      while (gap < Math.floor(n / 3)) {
	          gap = gap * 3 + 1;
	      }
	  
	      while (gap > 0) {
	          for (let i = gap; i < n; i++) {
	              const temp = arr[i];
	              let j = i;
	              while (j >= gap && arr[j - gap] > temp) {
	                  arr[j] = arr[j - gap];
	                  j -= gap;
	              }
	              arr[j] = temp;
	          }
	          gap = Math.floor(gap / 3); // Reduce gap
	      }
	      return arr;
	  }
	  
	  // Example
	  const data = [9, 8, 3, 7, 5, 6, 4, 1];
	  shellSort(data);
	  console.log("Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  public class ShellSort {
	      public static void shellSort(int[] arr) {
	          int n = arr.length;
	          int gap = 1;
	          // Initialize Knuth's gap sequence
	          while (gap < n / 3) {
	              gap = gap * 3 + 1;
	          }
	  
	          while (gap > 0) {
	              for (int i = gap; i < n; i++) {
	                  int temp = arr[i];
	                  int j = i;
	                  while (j >= gap && arr[j - gap] > temp) {
	                      arr[j] = arr[j - gap];
	                      j -= gap;
	                  }
	                  arr[j] = temp;
	              }
	              gap /= 3; // Reduce gap
	          }
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {9, 8, 3, 7, 5, 6, 4, 1};
	          shellSort(data);
	          System.out.println("Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  
	  void shellSort(int arr[], int n) {
	      int gap = 1;
	      // Initialize Knuth's gap sequence
	      while (gap < n / 3) {
	          gap = gap * 3 + 1;
	      }
	  
	      while (gap > 0) {
	          for (int i = gap; i < n; i++) {
	              int temp = arr[i];
	              int j = i;
	              while (j >= gap && arr[j - gap] > temp) {
	                  arr[j] = arr[j - gap];
	                  j -= gap;
	              }
	              arr[j] = temp;
	          }
	          gap /= 3; // Reduce gap
	      }
	  }
	  
	  int main() {
	      int data[] = {9, 8, 3, 7, 5, 6, 4, 1};
	      int n = sizeof(data) / sizeof(data[0]);
	      shellSort(data, n);
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
- # Alternative Variant (Hibbard's Gap Sequence)
  collapsed:: true
	- > [!tip] Shell's vs. Hibbard's Gap Sequences
	  > Shell's original sequence ($N/2^k$) has a worst-case time complexity of $O(n^2)$ when elements at odd and even positions are not compared until the very end.
	  > **Hibbard's gap sequence** ($2^k - 1$) ensures that consecutive gaps are coprime, avoiding this lockstep anomaly and reducing the worst-case complexity to **O(n^(1.5))**.
	-
	- :::code-tabs
	  
	  ```python
	  def shell_sort_hibbard(arr):
	      n = len(arr)
	      # Precompute Hibbard gaps: 1, 3, 7, 15, 31, ...
	      gaps = []
	      k = 1
	      while True:
	          gap = (1 << k) - 1
	          if gap >= n:
	              break
	          gaps.append(gap)
	          k += 1
	      
	      # Sort from largest gap to smallest
	      for gap in reversed(gaps):
	          for i in range(gap, n):
	              temp = arr[i]
	              j = i
	              while j >= gap and arr[j - gap] > temp:
	                  arr[j] = arr[j - gap]
	                  j -= gap
	              arr[j] = temp
	      return arr
	  
	  if __name__ == "__main__":
	      data = [9, 8, 3, 7, 5, 6, 4, 1]
	      print("Hibbard Sorted:", shell_sort_hibbard(data))
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  
	  void shellSortHibbard(std::vector<int>& arr) {
	      int n = arr.size();
	      std::vector<int> gaps;
	      int k = 1;
	      while (true) {
	          int gap = (1 << k) - 1;
	          if (gap >= n) break;
	          gaps.push_back(gap);
	          k++;
	      }
	  
	      for (auto it = gaps.rbegin(); it != gaps.rend(); ++it) {
	          int gap = *it;
	          for (int i = gap; i < n; ++i) {
	              int temp = arr[i];
	              int j = i;
	              while (j >= gap && arr[j - gap] > temp) {
	                  arr[j] = arr[j - gap];
	                  j -= gap;
	              }
	              arr[j] = temp;
	          }
	      }
	  }
	  
	  int main() {
	      std::vector<int> data = {9, 8, 3, 7, 5, 6, 4, 1};
	      shellSortHibbard(data);
	      std::cout << "Hibbard Sorted: ";
	      for (int val : data) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function shellSortHibbard(arr) {
	      const n = arr.length;
	      const gaps = [];
	      let k = 1;
	      while (true) {
	          const gap = (1 << k) - 1;
	          if (gap >= n) break;
	          gaps.push(gap);
	          k++;
	      }
	  
	      for (let g = gaps.length - 1; g >= 0; g--) {
	          const gap = gaps[g];
	          for (let i = gap; i < n; i++) {
	              const temp = arr[i];
	              let j = i;
	              while (j >= gap && arr[j - gap] > temp) {
	                  arr[j] = arr[j - gap];
	                  j -= gap;
	              }
	              arr[j] = temp;
	          }
	      }
	      return arr;
	  }
	  
	  const data = [9, 8, 3, 7, 5, 6, 4, 1];
	  shellSortHibbard(data);
	  console.log("Hibbard Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.ArrayList;
	  import java.util.Collections;
	  import java.util.List;
	  import java.util.Arrays;
	  
	  public class ShellSortHibbard {
	      public static void shellSortHibbard(int[] arr) {
	          int n = arr.length;
	          List<Integer> gaps = new ArrayList<>();
	          int k = 1;
	          while (true) {
	              int gap = (1 << k) - 1;
	              if (gap >= n) break;
	              gaps.add(gap);
	              k++;
	          }
	  
	          for (int g = gaps.size() - 1; g >= 0; g--) {
	              int gap = gaps.get(g);
	              for (int i = gap; i < n; i++) {
	                  int temp = arr[i];
	                  int j = i;
	                  while (j >= gap && arr[j - gap] > temp) {
	                      arr[j] = arr[j - gap];
	                      j -= gap;
	                  }
	                  arr[j] = temp;
	              }
	          }
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {9, 8, 3, 7, 5, 6, 4, 1};
	          shellSortHibbard(data);
	          System.out.println("Hibbard Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  
	  void shellSortHibbard(int arr[], int n) {
	      int gaps[32];
	      int gapCount = 0;
	      int k = 1;
	      while (1) {
	          int gap = (1 << k) - 1;
	          if (gap >= n) break;
	          gaps[gapCount++] = gap;
	          k++;
	      }
	  
	      for (int g = gapCount - 1; g >= 0; g--) {
	          int gap = gaps[g];
	          for (int i = gap; i < n; i++) {
	              int temp = arr[i];
	              int j = i;
	              while (j >= gap && arr[j - gap] > temp) {
	                  arr[j] = arr[j - gap];
	                  j -= gap;
	              }
	              arr[j] = temp;
	          }
	      }
	  }
	  
	  int main() {
	      int data[] = {9, 8, 3, 7, 5, 6, 4, 1};
	      int n = sizeof(data) / sizeof(data[0]);
	      shellSortHibbard(data, n);
	      printf("Hibbard Sorted: ");
	      for (int i = 0; i < n; i++) {
	          printf("%d ", data[i]);
	      }
	      printf("\n");
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Shell Sort
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Is array size\nsmall or medium?"}
	      Q -- No --> R1["❌ Use O(n log n) sorts\n(Quick, Merge, Heap)"]
	      Q -- Yes --> S1{"Is memory/recursion stack\nhighly restricted?"}
	      S1 -- No --> R2["❌ Other sorts fine\n(but Shell Sort still good)"]
	      S1 -- Yes --> S2{"Is stability\nrequired?"}
	      S2 -- Yes --> R3["❌ Use Insertion/Merge Sort\n(Shell is unstable)"]
	      S2 -- No --> R4["✅ Use Shell Sort\n(In-place, O(1) space, zero recursion overhead)"]
	  ```
	-
	- ## ✅ Use Shell Sort When
		- Memory is extremely limited and you need an **in-place** sort with **O(1) auxiliary space**.
		- The dataset is of small to medium size ($N \le 10,000$) where constant factors matter.
		- Recursion overhead (call stack frames) from Quick Sort or Merge Sort is unwanted or prohibited (e.g., embedded controllers).
		- The data is already partially sorted, where Shell Sort runs in near-linear time.
	-
	- ## ❌ Avoid Shell Sort When
		- You require a **stable** sort (relative order of identical keys must be preserved).
		- Sorting extremely large arrays ($N \gg 100,000$), where $O(n \log n)$ algorithms like Quick Sort or Merge Sort are far faster.
-
- # Key Takeaways
  collapsed:: true
	- **Generalization of Insertion Sort** — compares elements at a distance (`gap`) to resolve far-apart inversions quickly.
	- **Unstable** — element swaps over large gaps can change the relative order of duplicate keys.
	- **In-place** — operates directly on the input array requiring only $O(1)$ auxiliary memory.
	- **Complexity sequence dependency** — worst-case complexity ranges from $O(n^2)$ (Shell's original) down to $O(n^{1.5})$ (Knuth/Hibbard) depending on gap choices.
	- **Zero call stack footprint** — unlike recursive Quick/Merge sorts, it runs in a single loop layout, ideal for memory-constrained embedded code.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Shell Sort](https://www.geeksforgeeks.org/shellsort/)
		- [TheAlgorithms – Shell Sort (Python)](https://github.com/TheAlgorithms/Python/blob/master/sorts/shell_sort.py)