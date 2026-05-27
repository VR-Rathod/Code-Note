---
seoTitle: Selection Sort Algorithm – Implementation, Analysis, and Swap Minimization
description: "In-depth guide to Selection Sort. Explains selection logic, why it is unstable, swap minimization properties, and contains complete code in Python, C++, JavaScript, Java, and C."
keywords: "selection sort, sorting algorithm, min element swap, O(n^2), unstable sort, in-place sort, time complexity, space complexity, comparison sort, VR-Rathod, Code-Note, Vaibhav Rathod"
---

> [!info] What is Selection Sort?
> Selection Sort is an in-place comparison sorting algorithm.
> It divides the array into sorted and unsorted regions, repeatedly finds the minimum element in the unsorted region, and swaps it with the first unsorted element.
> A key advantage of Selection Sort is that it performs a **maximum of O(n) swaps**, making it highly efficient when writing to memory is expensive.

- # Explanation
  collapsed:: true
	- **Selection Sort** works by maintaining two subarrays within a given array:
		- 1. The subarray which is already sorted (built from left to right).
		- 2. The remaining subarray which is unsorted.
	-
	- In every iteration, the algorithm scans the unsorted subarray to find the minimum element, and then moves it (via a swap) to the end of the sorted subarray.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine sorting a stack of **books** by size on a table. You scan the entire stack to find the thinnest book, remove it, and place it at the beginning of a new shelf. You then scan the remaining stack, find the thinnest book among them, and place it next to the first one. You repeat this until all books are on the shelf.
	-
	- ## Core Properties
	  collapsed:: true
		- **Stability:** **Unstable** (No). Long-distance swaps can easily bypass identical elements and alter their relative order. For example, sorting `[4a, 4b, 2]`:
		  - Find min element which is `2`.
		  - Swap `2` with `4a` -> `[2, 4b, 4a]`.
		  - The relative order of `4a` and `4b` has been reversed!
		- **In-Place:** **Yes**. Requires only $O(1)$ auxiliary space.
		- **Adaptability:** **No**. The algorithm must scan all remaining elements to find the minimum regardless of whether the array is already sorted or not, resulting in $O(n^2)$ complexity in all cases.
-
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- Iterate through the array. For each position $i$, find the index of the smallest element from $i$ to $n-1$, and swap it with the element at position $i$.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — input array of size N"] --> B["i = 0"]
		      B --> C{"i < N - 1?"}
		      C -- No --> H["End — Array Sorted"]
		      C -- Yes --> D["min_idx = i\nj = i + 1"]
		      D --> E{"j < N?"}
		      E -- Yes --> F{"arr[j] < arr[min_idx]?"}
		      F -- Yes --> G["min_idx = j"]
		      F -- No --> I["j = j + 1"]
		      G --> I
		      I --> E
		      E -- No --> J["Swap arr[i] with arr[min_idx]\ni = i + 1"]
		      J --> C
		  ```
	-
	- ## Step-by-Step Trace (Sorting: [64, 25, 12, 22, 11])
	  collapsed:: true
		- Let's trace how the minimum element is selected and swapped at each step:
		- ```
		  Initial Array: [ 64, 25, 12, 22, 11 ]
		  
		  Step 0 (i = 0):
		  - Scan [64, 25, 12, 22, 11] → Min is 11 (index 4)
		  - Swap 64 and 11 → [ 11, 25, 12, 22, 64 ]
		  
		  Step 1 (i = 1):
		  - Scan [25, 12, 22, 64] → Min is 12 (index 2)
		  - Swap 25 and 12 → [ 11, 12, 25, 22, 64 ]
		  
		  Step 2 (i = 2):
		  - Scan [25, 22, 64] → Min is 22 (index 3)
		  - Swap 25 and 22 → [ 11, 12, 22, 25, 64 ]
		  
		  Step 3 (i = 3):
		  - Scan [25, 64] → Min is 25 (index 3)
		  - Swap 25 with itself → [ 11, 12, 22, 25, 64 ]
		  ```
		-
		- | Step | Sorted Portion | Unsorted Portion | Min Selected | Swap Action | Array State |
		  |---|---|---|---|---|---|
		  | **Start**| `[]` | `[64, 25, 12, 22, 11]` | — | — | `[64, 25, 12, 22, 11]` |
		  | **0** | `[11]` | `[25, 12, 22, 64]` | 11 | Swap 64 and 11 | `[11, 25, 12, 22, 64]` |
		  | **1** | `[11, 12]` | `[25, 22, 64]` | 12 | Swap 25 and 12 | `[11, 12, 25, 22, 64]` |
		  | **2** | `[11, 12, 22]`| `[25, 64]` | 22 | Swap 25 and 22 | `[11, 12, 22, 25, 64]` |
		  | **3** | `[11, 12, 22, 25]`| `[64]` | 25 | Swap 25 with 25| `[11, 12, 22, 25, 64]` |
-
- # Complexity Analysis
  collapsed:: true
	- | Scenario | Time Complexity | Space Complexity | Trigger Condition |
	  |---|---|---|---|
	  | **Best Case** | **O(n²)** | **O(1)** | Triggered on any input (even sorted). |
	  | **Average Case**| **O(n²)** | **O(1)** | Triggered on random inputs. |
	  | **Worst Case** | **O(n²)** | **O(1)** | Triggered on any input (e.g. reverse sorted).|
	-
	- ## Why Complexity is Uniformly O(n²)
	  collapsed:: true
		- Selection Sort does not possess any early termination checks or shortcut routes. It must execute the outer loop $N-1$ times, and for each step, search the remaining array linearly to verify the absolute minimum element.
-
- # Implementation
  collapsed:: true
	- > [!note] Standard in-place selection sort implementations.
	  - Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def selection_sort(arr):
	      n = len(arr)
	      for i in range(n):
	          # Find the minimum element in unsorted array
	          min_idx = i
	          for j in range(i + 1, n):
	              if arr[j] < arr[min_idx]:
	                  min_idx = j
	                  
	          # Swap the found minimum element with the first element
	          arr[i], arr[min_idx] = arr[min_idx], arr[i]
	      return arr
	  
	  # Example Setup
	  if __name__ == "__main__":
	      data = [64, 25, 12, 22, 11]
	      print("Original:", data)
	      selection_sort(data)
	      print("Sorted:  ", data)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  
	  void selectionSort(std::vector<int>& arr) {
	      int n = arr.size();
	      for (int i = 0; i < n; ++i) {
	          int minIdx = i;
	          for (int j = i + 1; j < n; ++j) {
	              if (arr[j] < arr[minIdx]) {
	                  minIdx = j;
	              }
	          }
	          std::swap(arr[i], arr[minIdx]);
	      }
	  }
	  
	  int main() {
	      std::vector<int> data = {64, 25, 12, 22, 11};
	      selectionSort(data);
	      std::cout << "Sorted: ";
	      for (int val : data) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function selectionSort(arr) {
	      const n = arr.length;
	      for (let i = 0; i < n; i++) {
	          let minIdx = i;
	          for (let j = i + 1; j < n; j++) {
	              if (arr[j] < arr[minIdx]) {
	                  minIdx = j;
	              }
	          }
	          const temp = arr[i];
	          arr[i] = arr[minIdx];
	          arr[minIdx] = temp;
	      }
	      return arr;
	  }
	  
	  // Example
	  const data = [64, 25, 12, 22, 11];
	  selectionSort(data);
	  console.log("Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  public class SelectionSort {
	      public static void selectionSort(int[] arr) {
	          int n = arr.length;
	          for (int i = 0; i < n; i++) {
	              int minIdx = i;
	              for (int j = i + 1; j < n; j++) {
	                  if (arr[j] < arr[minIdx]) {
	                      minIdx = j;
	                  }
	              }
	              int temp = arr[i];
	              arr[i] = arr[minIdx];
	              arr[minIdx] = temp;
	          }
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {64, 25, 12, 22, 11};
	          selectionSort(data);
	          System.out.println("Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  
	  void selectionSort(int arr[], int n) {
	      for (int i = 0; i < n; i++) {
	          int minIdx = i;
	          for (int j = i + 1; j < n; j++) {
	              if (arr[j] < arr[minIdx]) {
	                  minIdx = j;
	              }
	          }
	          int temp = arr[i];
	          arr[i] = arr[minIdx];
	          arr[minIdx] = temp;
	      }
	  }
	  
	  int main() {
	      int data[] = {64, 25, 12, 22, 11};
	      int n = sizeof(data) / sizeof(data[0]);
	      selectionSort(data, n);
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
- # Recursive Variant (Recursive Selection Sort)
  collapsed:: true
	- > [!tip] Recursive Selection Sort
	  > The recursive variant of Selection Sort divides the problem by finding the minimum element in the current range, swapping it with the first unsorted index, and then recursively calling selection sort on the remaining $N-1$ elements.
	  > This keeps the $O(n^2)$ time complexity while adding an $O(n)$ call stack space requirement.
	-
	- :::code-tabs
	  
	  ```python
	  def recursive_selection_sort(arr, i=0):
	      n = len(arr)
	      # Base case: reached the end
	      if i >= n - 1:
	          return arr
	          
	      # Find minimum in unsorted portion [i...n-1]
	      min_idx = i
	      for j in range(i + 1, n):
	          if arr[j] < arr[min_idx]:
	              min_idx = j
	              
	      # Swap minimum element with first element of unsorted portion
	      arr[i], arr[min_idx] = arr[min_idx], arr[i]
	      
	      # Recurse for remaining elements
	      return recursive_selection_sort(arr, i + 1)
	  
	  if __name__ == "__main__":
	      data = [64, 25, 12, 22, 11]
	      print("Recursive Sorted:", recursive_selection_sort(data))
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  void recursiveSelectionSort(std::vector<int>& arr, int i = 0) {
	      int n = arr.size();
	      if (i >= n - 1) return;
	      
	      int minIdx = i;
	      for (int j = i + 1; j < n; ++j) {
	          if (arr[j] < arr[minIdx]) {
	              minIdx = j;
	          }
	      }
	      std::swap(arr[i], arr[minIdx]);
	      
	      recursiveSelectionSort(arr, i + 1);
	  }
	  
	  int main() {
	      std::vector<int> data = {64, 25, 12, 22, 11};
	      recursiveSelectionSort(data);
	      std::cout << "Recursive Sorted: ";
	      for (int val : data) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function recursiveSelectionSort(arr, i = 0) {
	      const n = arr.length;
	      if (i >= n - 1) return arr;
	      
	      let minIdx = i;
	      for (let j = i + 1; j < n; j++) {
	          if (arr[j] < arr[minIdx]) {
	              minIdx = j;
	          }
	      }
	      const temp = arr[i];
	      arr[i] = arr[minIdx];
	      arr[minIdx] = temp;
	      
	      return recursiveSelectionSort(arr, i + 1);
	  }
	  
	  const data = [64, 25, 12, 22, 11];
	  recursiveSelectionSort(data);
	  console.log("Recursive Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  public class SelectionSortRecursive {
	      public static void recursiveSelectionSort(int[] arr, int i) {
	          int n = arr.length;
	          if (i >= n - 1) return;
	          
	          int minIdx = i;
	          for (int j = i + 1; j < n; j++) {
	              if (arr[j] < arr[minIdx]) {
	                  minIdx = j;
	              }
	          }
	          int temp = arr[i];
	          arr[i] = arr[minIdx];
	          arr[minIdx] = temp;
	          
	          recursiveSelectionSort(arr, i + 1);
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {64, 25, 12, 22, 11};
	          recursiveSelectionSort(data, 0);
	          System.out.println("Recursive Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  
	  void recursiveSelectionSort(int arr[], int n, int i) {
	      if (i >= n - 1) return;
	      
	      int minIdx = i;
	      for (int j = i + 1; j < n; j++) {
	          if (arr[j] < arr[minIdx]) {
	              minIdx = j;
	          }
	      }
	      int temp = arr[i];
	      arr[i] = arr[minIdx];
	      arr[minIdx] = temp;
	      
	      recursiveSelectionSort(arr, n, i + 1);
	  }
	  
	  int main() {
	      int data[] = {64, 25, 12, 22, 11};
	      int n = sizeof(data) / sizeof(data[0]);
	      recursiveSelectionSort(data, n, 0);
	      printf("Recursive Sorted: ");
	      for (int i = 0; i < n; i++) {
	          printf("%d ", data[i]);
	      }
	      printf("\n");
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Selection Sort
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Is memory writing\nextremely costly?"}
	      Q -- Yes --> S1{"Do you need stability?"}
	      S1 -- Yes --> R1["❌ Use Stable sort\n(e.g., Insertion/Merge)\nSelection is unstable"]
	      S1 -- No --> R2["✅ Use Selection Sort\n(Performs at most O(n) swaps)"]
	      Q -- No --> R3["❌ Use Insertion / Quick / Merge Sort\n(Selection Sort always O(n^2))"]
	  ```
	-
	- ## ✅ Use Selection Sort When
		- Writing to memory is extremely expensive relative to reading (e.g., write-sensitive EEPROMs/Flash) and you need an in-place sort with a maximum of $O(n)$ swaps.
		- Stableness is not required, and auxiliary memory is restricted to $O(1)$.
		- You want a simple, straightforward implementation with minimal constant factors for very small lists.
	-
	- ## ❌ Avoid Selection Sort When
		- You require a **stable** sort (it can reverse relative order of equal keys during distant swaps).
		- The dataset is large, where its persistent $O(n^2)$ time is too slow.
		- The data is already sorted or nearly sorted (Selection Sort still executes all $O(n^2)$ steps).
-
- # Key Takeaways
  collapsed:: true
	- **Select & Swap** — finds the absolute minimum element from the unsorted region and swaps it into its correct position.
	- **Unstable** — distant swapping behavior can change the relative order of identical elements.
	- **In-place** — modifies the array directly without allocating extra space, keeping a space complexity of $O(1)$.
	- **No Adaptability** — runs in $O(n^2)$ time across best, average, and worst cases since it always checks the entire remaining array.
	- **Minimal Swaps** — does at most $O(n)$ swaps, which is a major advantage when array writes are costly.
	- **Linear Selection Stack** — recursive layouts incur $O(n)$ space overhead on the recursive stack without changing execution bounds.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Selection Sort](https://www.geeksforgeeks.org/selection-sort/)
		- [TheAlgorithms – Selection Sort (Python)](https://github.com/TheAlgorithms/Python/blob/master/sorts/selection_sort.py)