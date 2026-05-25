---
seoTitle: Bubble Sort Algorithm – Implementation, Optimization, and Complexity Analysis
description: "In-depth guide to Bubble Sort with early termination. Covers stability, adaptability, visual step-by-step traces, and complete implementations in Python, C++, JavaScript, Java, and C."
keywords: "bubble sort, optimized bubble sort, sorting algorithm, adjacent swap, O(n^2), stable sort, in-place sort, time complexity, space complexity, comparison sort, VR-Rathod, Code-Note, Vaibhav Rathod"
---

> [!info] What is Bubble Sort?
> Bubble Sort is a simple, comparison-based sorting algorithm that repeatedly steps through a list, compares adjacent elements, and swaps them if they are in the wrong order.
> In its optimized form, it achieves **O(n)** time complexity for already-sorted inputs by using a tracking flag to detect early completion.

- # Explanation
  collapsed:: true
	- **Bubble Sort** works by comparing consecutive pairs of elements from left to right. If an element is larger than the one next to it, they are swapped.
	-
	- During each pass through the array, the largest unsorted element "bubbles" up to its correct final position at the end of the array. The algorithm then repeats the process for the remaining unsorted portion.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine a line of people of different heights standing in random order. Starting from the left, you compare two adjacent people. If the one on the left is taller, you have them swap places. You repeat this down the line until the tallest person has moved all the way to the right. Then you start over from the left to find the next tallest person.
	-
	- ## Core Properties
	  collapsed:: true
		- **Stability:** **Stable** (Yes). It preserves the relative order of identical elements because it only swaps adjacent elements when one is strictly greater than the other (`arr[j] > arr[j+1]`).
		- **In-Place:** **Yes**. It operates directly on the input array, requiring only $O(1)$ auxiliary space.
		- **Adaptability:** **Yes** (when optimized). By checking if any swap occurred during a pass, the algorithm terminates early, resulting in a linear $O(n)$ best-case time complexity.
-
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- Maintain an outer loop for the passes and an inner loop to compare adjacent elements. If the inner loop completes a full pass without performing a single swap, the array is already sorted, and we terminate immediately.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — input array of size N"] --> B["i = 0"]
		      B --> C{"i < N - 1?"}
		      C -- No --> H["End — Array Sorted"]
		      C -- Yes --> D["swapped = false\nj = 0"]
		      D --> E{"j < N - i - 1?"}
		      E -- Yes --> F{"arr[j] > arr[j+1]?"}
		      F -- Yes --> G["Swap arr[j] & arr[j+1]\nswapped = true"]
		      F -- No --> I["j = j + 1"]
		      G --> I
		      I --> E
		      E -- No --> J{"swapped == false?"}
		      J -- Yes --> H
		      J -- No --> K["i = i + 1"]
		      K --> C
		      
		  ```
	-
	- ## Step-by-Step Trace (Sorting: [5, 1, 4, 2, 8])
	  collapsed:: true
		- Let's trace how the numbers move through the passes:
		- ```
		  Initial Array: [ 5, 1, 4, 2, 8 ]
		  
		  Pass 1:
		  - Compare 5 and 1: 5 > 1 → Swap → [ 1, 5, 4, 2, 8 ]
		  - Compare 5 and 4: 5 > 4 → Swap → [ 1, 4, 5, 2, 8 ]
		  - Compare 5 and 2: 5 > 2 → Swap → [ 1, 4, 2, 5, 8 ]
		  - Compare 5 and 8: 5 < 8 → No Swap
		  - End of Pass 1: [ 1, 4, 2, 5, 8 ] (8 is placed)
		  
		  Pass 2:
		  - Compare 1 and 4: 1 < 4 → No Swap
		  - Compare 4 and 2: 4 > 2 → Swap → [ 1, 2, 4, 5, 8 ]
		  - Compare 4 and 5: 4 < 5 → No Swap
		  - End of Pass 2: [ 1, 2, 4, 5, 8 ] (5 is placed)
		  
		  Pass 3:
		  - Compare 1 and 2: 1 < 2 → No Swap
		  - Compare 2 and 4: 2 < 4 → No Swap
		  - End of Pass 3: [ 1, 2, 4, 5, 8 ] (No swaps made in this pass → Terminate!)
		  ```
		-
		- | Pass | Comparison | Elements Compared | Swap Performed? | Array State |
		  |---|---|---|---|---|
		  | **1** | j = 0 | 5 vs 1 | **Yes** | `[1, 5, 4, 2, 8]` |
		  | **1** | j = 1 | 5 vs 4 | **Yes** | `[1, 4, 5, 2, 8]` |
		  | **1** | j = 2 | 5 vs 2 | **Yes** | `[1, 4, 2, 5, 8]` |
		  | **1** | j = 3 | 5 vs 8 | No | `[1, 4, 2, 5, 8]` |
		  | **2** | j = 0 | 1 vs 4 | No | `[1, 4, 2, 5, 8]` |
		  | **2** | j = 1 | 4 vs 2 | **Yes** | `[1, 2, 4, 5, 8]` |
		  | **2** | j = 2 | 4 vs 5 | No | `[1, 2, 4, 5, 8]` |
		  | **3** | j = 0 | 1 vs 2 | No | `[1, 2, 4, 5, 8]` |
		  | **3** | j = 1 | 2 vs 4 | No | `[1, 2, 4, 5, 8]` |
-
- # Complexity Analysis
  collapsed:: true
	- | Scenario | Time Complexity | Space Complexity | Trigger Condition |
	  |---|---|---|---|
	  | **Best Case** | **O(n)** | **O(1)** | Array is already fully sorted. |
	  | **Average Case**| **O(n²)** | **O(1)** | Elements are in arbitrary random order. |
	  | **Worst Case** | **O(n²)** | **O(1)** | Array is reversed or completely unsorted. |
	-
	- ## Why the Worst Case triggers
	  collapsed:: true
		- If the array is sorted in reverse order, every single comparison requires a swap, meaning the inner loop runs a total of $\frac{n(n-1)}{2}$ times, leading to $O(n^2)$ complexity.
-
- # Implementation
  collapsed:: true
	- > [!note] In-place Optimized implementations.
	  - Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def bubble_sort(arr):
	      n = len(arr)
	      for i in range(n):
	          swapped = False
	          for j in range(0, n - i - 1):
	              if arr[j] > arr[j + 1]:
	                  # Swap adjacent elements
	                  arr[j], arr[j + 1] = arr[j + 1], arr[j]
	                  swapped = True
	          # If no two elements were swapped by inner loop, then break
	          if not swapped:
	              break
	      return arr
	  
	  # Example Setup
	  if __name__ == "__main__":
	      data = [64, 34, 25, 12, 22, 11, 90]
	      print("Original:", data)
	      bubble_sort(data)
	      print("Sorted:  ", data)
	  ```
	  
	  ```cpp
	  #include <iostream>
	  #include <vector>
	  
	  void bubbleSort(std::vector<int>& arr) {
	      int n = arr.size();
	      for (int i = 0; i < n; ++i) {
	          bool swapped = false;
	          for (int j = 0; j < n - i - 1; ++j) {
	              if (arr[j] > arr[j + 1]) {
	                  std::swap(arr[j], arr[j + 1]);
	                  swapped = true;
	              }
	          }
	          if (!swapped) break;
	      }
	  }
	  
	  int main() {
	      std::vector<int> data = {64, 34, 25, 12, 22, 11, 90};
	      bubbleSort(data);
	      std::cout << "Sorted: ";
	      for (int val : data) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function bubbleSort(arr) {
	      const n = arr.length;
	      for (let i = 0; i < n; i++) {
	          let swapped = false;
	          for (let j = 0; j < n - i - 1; j++) {
	              if (arr[j] > arr[j + 1]) {
	                  const temp = arr[j];
	                  arr[j] = arr[j + 1];
	                  arr[j + 1] = temp;
	                  swapped = true;
	              }
	          }
	          if (!swapped) break;
	      }
	      return arr;
	  }
	  
	  // Example
	  const data = [64, 34, 25, 12, 22, 11, 90];
	  bubbleSort(data);
	  console.log("Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  public class BubbleSort {
	      public static void bubbleSort(int[] arr) {
	          int n = arr.length;
	          for (int i = 0; i < n; i++) {
	              boolean swapped = false;
	              for (int j = 0; j < n - i - 1; j++) {
	                  if (arr[j] > arr[j + 1]) {
	                      int temp = arr[j];
	                      arr[j] = arr[j + 1];
	                      arr[j + 1] = temp;
	                      swapped = true;
	                  }
	              }
	              if (!swapped) break;
	          }
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {64, 34, 25, 12, 22, 11, 90};
	          bubbleSort(data);
	          System.out.println("Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdbool.h>
	  
	  void bubbleSort(int arr[], int n) {
	      for (int i = 0; i < n; i++) {
	          bool swapped = false;
	          for (int j = 0; j < n - i - 1; j++) {
	              if (arr[j] > arr[j + 1]) {
	                  int temp = arr[j];
	                  arr[j] = arr[j + 1];
	                  arr[j + 1] = temp;
	                  swapped = true;
	              }
	          }
	          if (!swapped) break;
	      }
	  }
	  
	      int data[] = {64, 34, 25, 12, 22, 11, 90};
	      int n = sizeof(data) / sizeof(data[0]);
	      bubbleSort(data, n);
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
- # Recursive Variant (Recursive Bubble Sort)
  collapsed:: true
	- > [!tip] Iterative vs. Recursive Bubble Sort
	  > The recursive variant of Bubble Sort replaces the outer loop with recursion. It performs one full pass of comparisons to bubble the largest element to the end, then recursively calls itself on the remaining $N-1$ elements.
	  > Although it does not improve time complexity (remaining $O(n^2)$), it introduces a stack memory overhead of $O(n)$ due to recursive call frames.
	-
	- :::code-tabs
	  
	  ```python
	  def recursive_bubble_sort(arr, n=None):
	      if n is None:
	          n = len(arr)
	      # Base case: 1 element left
	      if n <= 1:
	          return arr
	          
	      # Perform one pass of bubble sort to place the largest element at the end
	      for j in range(n - 1):
	          if arr[j] > arr[j + 1]:
	              arr[j], arr[j + 1] = arr[j + 1], arr[j]
	              
	      # Largest element is fixed, recurse for the remaining portion
	      return recursive_bubble_sort(arr, n - 1)
	  
	  if __name__ == "__main__":
	      data = [64, 34, 25, 12, 22, 11, 90]
	      print("Recursive Sorted:", recursive_bubble_sort(data))
	  ```
	  
	  ```cpp
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  void recursiveBubbleSort(std::vector<int>& arr, int n) {
	      if (n <= 1) return;
	      
	      // One pass of bubble sort
	      for (int i = 0; i < n - 1; ++i) {
	          if (arr[i] > arr[i + 1]) {
	              std::swap(arr[i], arr[i + 1]);
	          }
	      }
	      
	      // Recurse on remaining elements
	      recursiveBubbleSort(arr, n - 1);
	  }
	  
	  int main() {
	      std::vector<int> data = {64, 34, 25, 12, 22, 11, 90};
	      recursiveBubbleSort(data, data.size());
	      std::cout << "Recursive Sorted: ";
	      for (int x : data) std::cout << x << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function recursiveBubbleSort(arr, n = arr.length) {
	      if (n <= 1) return arr;
	      
	      // One pass of bubble sort
	      for (let i = 0; i < n - 1; i++) {
	          if (arr[i] > arr[i + 1]) {
	              let temp = arr[i];
	              arr[i] = arr[i + 1];
	              arr[i + 1] = temp;
	          }
	      }
	      
	      // Recurse on remaining elements
	      return recursiveBubbleSort(arr, n - 1);
	  }
	  
	  const data = [64, 34, 25, 12, 22, 11, 90];
	  recursiveBubbleSort(data);
	  console.log("Recursive Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  public class BubbleSortRecursive {
	      public static void recursiveBubbleSort(int[] arr, int n) {
	          if (n <= 1) return;
	          
	          // One pass of bubble sort
	          for (int i = 0; i < n - 1; i++) {
	              if (arr[i] > arr[i + 1]) {
	                  int temp = arr[i];
	                  arr[i] = arr[i + 1];
	                  arr[i + 1] = temp;
	              }
	          }
	          
	          // Recurse on remaining elements
	          recursiveBubbleSort(arr, n - 1);
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {64, 34, 25, 12, 22, 11, 90};
	          recursiveBubbleSort(data, data.length);
	          System.out.println("Recursive Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  
	  void recursiveBubbleSort(int arr[], int n) {
	      if (n <= 1) return;
	      
	      // One pass of bubble sort
	      for (int i = 0; i < n - 1; i++) {
	          if (arr[i] > arr[i + 1]) {
	              int temp = arr[i];
	              arr[i] = arr[i + 1];
	              arr[i + 1] = temp;
	          }
	      }
	      
	      // Recurse on remaining elements
	      recursiveBubbleSort(arr, n - 1);
	  }
	  
	  int main() {
	      int data[] = {64, 34, 25, 12, 22, 11, 90};
	      int n = sizeof(data) / sizeof(data[0]);
	      recursiveBubbleSort(data, n);
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
- # When to Use Bubble Sort
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Is dataset size\nsmall (N <= 100)?"}
	      Q -- No --> R1["❌ Use Merge / Quick / Heap Sort\n(O(n^2) is too slow)"]
	      Q -- Yes --> S1{"Is the array\nalready sorted or\nnearly sorted?"}
	      S1 -- Yes --> S2{"Do you need a\nsimple stable\nin-place sort?"}
	      S2 -- Yes --> R2["✅ Use Optimized Bubble Sort\n(O(n) best-case, stable, in-place)"]
	      S2 -- No --> R3["❌ Use Insertion Sort\n(Insertion Sort has lower constant factors)"]
	      S1 -- No --> R3
	  ```
	-
	- ## ✅ Use Bubble Sort When
		- The dataset is extremely small, and you need a quick, simple implementation.
		- The array is highly likely to be already sorted or nearly-sorted, enabling the early-termination check to finish in linear $O(n)$ time.
		- Stableness is required, and auxiliary memory is restricted to $O(1)$.
	-
	- ## ❌ Avoid Bubble Sort When
		- You are sorting general or large-scale datasets, where $O(n^2)$ time becomes a massive performance bottleneck.
		- In practice, **Insertion Sort** is consistently faster on average for small datasets, as it does fewer memory swap operations.
-
- # Key Takeaways
  collapsed:: true
	- **Simple Logic** — repeatedly compares adjacent elements and swaps them if out of order, placing the largest item at the end of each pass.
	- **Stable** — relative order of equal keys is preserved since swapping only occurs if $arr[j] > arr[j+1]$.
	- **In-place** — does not require auxiliary memory structures, yielding a space complexity of $O(1)$.
	- **Adaptive** — optimized with a swapped flag, running in $O(n)$ time for already sorted inputs.
	- **High Constant Factor** — generally performs poorly on random arrays because swap operations are more expensive than shifting elements.
	- **Recursive Cost** — recursive variants introduce $O(n)$ call stack depth without improving the sorting execution profile.