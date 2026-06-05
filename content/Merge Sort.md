---
seoTitle: Merge Sort Algorithm – Implementation, Recursion Tree, and Complexity
description: "In-depth guide to Merge Sort. Explains divide-and-conquer strategy, linear-time merge phase, stability characteristics, and contains implementations in Python, C++, JavaScript, Java, and C."
keywords: "merge sort, sorting algorithm, divide and conquer, O(n log n), stable sort, auxiliary space, recursion tree, algorithm implementation, VR-Rathod, Code-Note, Vaibhav Rathod"
treeTitle: DSA - Sorting & Searching - Merge Sort
---

> [!info] What is Merge Sort?
> Merge Sort is an external, divide-and-conquer comparison-based sorting algorithm.
> It divides the input array into two halves, recursively sorts them, and then merges the two sorted halves into a single sorted array.
> It guarantees **O(n log n)** worst-case performance and is highly stable, though it requires **O(n)** auxiliary space.

- # Explanation
  collapsed:: true
	- **Merge Sort** works by recursively breaking down a problem into two subproblems of half the size until they are simple enough to be solved directly (arrays of size 0 or 1). It then merges the solutions to the subproblems to solve the original problem.
	-
	- The core of the algorithm is the **merge step**, which combines two already-sorted arrays into a single sorted array in $O(n)$ time.
	-
	- ## Core Properties
	  collapsed:: true
		- **Stability:** **Stable** (Yes). During the merge step, when comparing elements from the left and right halves, we prioritize the left element in case of a tie (`left[i] <= right[j]`), preserving their original order.
		- **In-Place:** **No** (typically). Standard implementations require an auxiliary array of size $O(n)$ to temporarily store merged results.
		- **Adaptability:** **No**. It splits and merges arrays regardless of their initial ordering, always executing the same number of recursive steps.
-
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- 1. Divide: Split the array at its midpoint.
		- 2. Conquer: Recursively call `merge_sort` on both halves.
		- 3. Combine: Merge the two sorted halves back into the original array.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — input array of size N"] --> B{"N <= 1?"}
		      B -- Yes --> C["Return (already sorted)"]
		      B -- No --> D["Split at mid = N / 2\nleft = arr[0..mid]\nright = arr[mid..N]"]
		      D --> E["Recursively call mergeSort(left)\nRecursively call mergeSort(right)"]
		      E --> F["Merge left & right into sorted array"]
		      F --> G["Return sorted array"]
		  ```
	-
	- ## Recursion Divide & Merge Tree (Sorting: [38, 27, 43, 3])
	  collapsed:: true
		- Let's visualize the division and subsequent merging of the subproblems:
		- ```mermaid
		  graph TD
		      subgraph DividePhase ["1. Divide Phase"]
		          D0["[38, 27, 43, 3]"] --> D1["[38, 27]"]
		          D0 --> D2["[43, 3]"]
		          D1 --> D3["[38]"]
		          D1 --> D4["[27]"]
		          D2 --> D5["[43]"]
		          D2 --> D6["[3]"]
		      end
		      
		      subgraph MergePhase ["2. Merge Phase"]
		          M3["[38]"] & M4["[27]"] --> M1["[27, 38]"]
		          M5["[43]"] & M6["[3]"] --> M2["[3, 43]"]
		          M1 & M2 --> M0["[3, 27, 38, 43]"]
		      end
		  ```
	-
	- ## The Merge Step Dry Run
	  collapsed:: true
		- Imagine merging `left = [27, 38]` and `right = [3, 43]`:
		- ```
		  - Compare left[0] (27) vs right[0] (3)  → 3 is smaller  → Output: [3]
		  - Compare left[0] (27) vs right[1] (43) → 27 is smaller → Output: [3, 27]
		  - Compare left[1] (38) vs right[1] (43) → 38 is smaller → Output: [3, 27, 38]
		  - Left half exhausted → Append remainder of right half   → Output: [3, 27, 38, 43]
		  ```
-
- # Complexity Analysis
  collapsed:: true
	- | Scenario | Time Complexity | Space Complexity | Trigger Condition |
	  |---|---|---|---|
	  | **Best Case** | **O(n log n)** | **O(n)** | Triggered on any input. |
	  | **Average Case**| **O(n log n)** | **O(n)** | Triggered on any input. |
	  | **Worst Case** | **O(n log n)** | **O(n)** | Triggered on any input. |
	-
	- ## Why Space Complexity is O(n)
	  collapsed:: true
		- Merging two subarrays requires an auxiliary array of size equal to the sum of the elements being merged to hold them while comparing. In the final merge stage, this requires a temporary array of size $N$.
-
- # Implementation
  collapsed:: true
	- > [!note] Standard out-of-place recursive merge sort implementations.
		- Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def merge_sort(arr):
	      if len(arr) <= 1:
	          return arr
	      
	      mid = len(arr) // 2
	      left = merge_sort(arr[:mid])
	      right = merge_sort(arr[mid:])
	      
	      # Merge Phase
	      merged = []
	      i = j = 0
	      while i < len(left) and j < len(right):
	          if left[i] <= right[j]:
	              merged.append(left[i])
	              i += 1
	          else:
	              merged.append(right[j])
	              j += 1
	              
	      merged.extend(left[i:])
	      merged.extend(right[j:])
	      
	      # Copy back to modify input array in-place
	      for idx in range(len(arr)):
	          arr[idx] = merged[idx]
	      return arr
	  
	  # Example Setup
	  if __name__ == "__main__":
	      data = [38, 27, 43, 3, 9, 82, 10]
	      print("Original:", data)
	      merge_sort(data)
	      print("Sorted:  ", data)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  
	  void merge(std::vector<int>& arr, int l, int m, int r) {
	      int n1 = m - l + 1;
	      int n2 = r - m;
	  
	      std::vector<int> L(n1), R(n2);
	      for (int i = 0; i < n1; ++i) L[i] = arr[l + i];
	      for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];
	  
	      int i = 0, j = 0, k = l;
	      while (i < n1 && j < n2) {
	          if (L[i] <= R[j]) {
	              arr[k] = L[i];
	              ++i;
	          } else {
	              arr[k] = R[j];
	              ++j;
	          }
	          ++k;
	      }
	  
	      while (i < n1) {
	          arr[k] = L[i];
	          ++i;
	          ++k;
	      }
	      while (j < n2) {
	          arr[k] = R[j];
	          ++j;
	          ++k;
	      }
	  }
	  
	  void mergeSortHelper(std::vector<int>& arr, int l, int r) {
	      if (l < r) {
	          int m = l + (r - l) / 2;
	          mergeSortHelper(arr, l, m);
	          mergeSortHelper(arr, m + 1, r);
	          merge(arr, l, m, r);
	      }
	  }
	  
	  void mergeSort(std::vector<int>& arr) {
	      if (!arr.empty()) {
	          mergeSortHelper(arr, 0, arr.size() - 1);
	      }
	  }
	  
	  int main() {
	      std::vector<int> data = {38, 27, 43, 3, 9, 82, 10};
	      mergeSort(data);
	      std::cout << "Sorted: ";
	      for (int val : data) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function mergeSort(arr) {
	      if (arr.length <= 1) return arr;
	  
	      const mid = Math.floor(arr.length / 2);
	      const left = mergeSort(arr.slice(0, mid));
	      const right = mergeSort(arr.slice(mid));
	  
	      // Merge phase
	      const merged = [];
	      let i = 0, j = 0;
	      while (i < left.length && j < right.length) {
	          if (left[i] <= right[j]) {
	              merged.push(left[i]);
	              i++;
	          } else {
	              merged.push(right[j]);
	              j++;
	          }
	      }
	      while (i < left.length) merged.push(left[i++]);
	      while (j < right.length) merged.push(right[j++]);
	  
	      // Modify elements in original array
	      for (let k = 0; k < arr.length; k++) {
	          arr[k] = merged[k];
	      }
	      return arr;
	  }
	  
	  // Example
	  const data = [38, 27, 43, 3, 9, 82, 10];
	  mergeSort(data);
	  console.log("Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  public class MergeSort {
	      private static void merge(int[] arr, int l, int m, int r) {
	          int n1 = m - l + 1;
	          int n2 = r - m;
	  
	          int[] L = new int[n1];
	          int[] R = new int[n2];
	  
	          System.arraycopy(arr, l, L, 0, n1);
	          System.arraycopy(arr, m + 1, R, 0, n2);
	  
	          int i = 0, j = 0, k = l;
	          while (i < n1 && j < n2) {
	              if (L[i] <= R[j]) {
	                  arr[k] = L[i];
	                  i++;
	              } else {
	                  arr[k] = R[j];
	                  j++;
	              }
	              k++;
	          }
	  
	          while (i < n1) {
	              arr[k] = L[i];
	              i++;
	              k++;
	          }
	          while (j < n2) {
	              arr[k] = R[j];
	              j++;
	              k++;
	          }
	      }
	  
	      private static void sort(int[] arr, int l, int r) {
	          if (l < r) {
	              int m = l + (r - l) / 2;
	              sort(arr, l, m);
	              sort(arr, m + 1, r);
	              merge(arr, l, m, r);
	          }
	      }
	  
	      public static void mergeSort(int[] arr) {
	          sort(arr, 0, arr.length - 1);
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {38, 27, 43, 3, 9, 82, 10};
	          mergeSort(data);
	          System.out.println("Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  
	  void merge(int arr[], int l, int m, int r) {
	      int n1 = m - l + 1;
	      int n2 = r - m;
	  
	      int* L = (int*)malloc(n1 * sizeof(int));
	      int* R = (int*)malloc(n2 * sizeof(int));
	  
	      for (int i = 0; i < n1; i++) L[i] = arr[l + i];
	      for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
	  
	      int i = 0, j = 0, k = l;
	      while (i < n1 && j < n2) {
	          if (L[i] <= R[j]) {
	              arr[k] = L[i];
	              i++;
	          } else {
	              arr[k] = R[j];
	              j++;
	          }
	          k++;
	      }
	  
	      while (i < n1) {
	          arr[k] = L[i];
	          i++;
	          k++;
	      }
	      while (j < n2) {
	          arr[k] = R[j];
	          j++;
	          k++;
	      }
	  
	      free(L);
	      free(R);
	  }
	  
	  void mergeSortHelper(int arr[], int l, int r) {
	      if (l < r) {
	          int m = l + (r - l) / 2;
	          mergeSortHelper(arr, l, m);
	          mergeSortHelper(arr, m + 1, r);
	          merge(arr, l, m, r);
	      }
	  }
	  
	  void mergeSort(int arr[], int n) {
	      mergeSortHelper(arr, 0, n - 1);
	  }
	  
	  int main() {
	      int data[] = {38, 27, 43, 3, 9, 82, 10};
	      int n = sizeof(data) / sizeof(data[0]);
	      mergeSort(data, n);
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
- # Alternative Variant (Bottom-Up / Iterative Merge Sort)
  collapsed:: true
	- > [!tip] Bottom-Up Iterative Merge Sort
	  > The bottom-up variant of Merge Sort avoids recursion completely by treating the array as a sequence of small sub-arrays of width $1, 2, 4, 8, \dots$. It iteratively merges these slices, removing call stack overhead ($O(1)$ recursion space) while keeping stability and the $O(n \log n)$ time guarantee.
	-
	- :::code-tabs
	  
	  ```python
	  def merge_sort_bottom_up(arr):
	      n = len(arr)
	      width = 1
	      while width < n:
	          for i in range(0, n, 2 * width):
	              l = i
	              m = min(i + width - 1, n - 1)
	              r = min(i + 2 * width - 1, n - 1)
	              
	              if m < r:
	                  # Merge slices arr[l..m] and arr[m+1..r]
	                  left = arr[l : m + 1]
	                  right = arr[m + 1 : r + 1]
	                  
	                  k = l
	                  i_l = i_r = 0
	                  while i_l < len(left) and i_r < len(right):
	                      if left[i_l] <= right[i_r]:
	                          arr[k] = left[i_l]
	                          i_l += 1
	                      else:
	                          arr[k] = right[i_r]
	                          i_r += 1
	                      k += 1
	                      
	                  while i_l < len(left):
	                      arr[k] = left[i_l]
	                      i_l += 1
	                      k += 1
	                  while i_r < len(right):
	                      arr[k] = right[i_r]
	                      i_r += 1
	                      k += 1
	          width *= 2
	      return arr
	  
	  if __name__ == "__main__":
	      data = [38, 27, 43, 3, 9, 82, 10]
	      print("Bottom-Up Sorted:", merge_sort_bottom_up(data))
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  void mergeBottomUp(std::vector<int>& arr, int l, int m, int r) {
	      int n1 = m - l + 1;
	      int n2 = r - m;
	      std::vector<int> L(n1), R(n2);
	      for (int i = 0; i < n1; ++i) L[i] = arr[l + i];
	      for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];
	      
	      int i = 0, j = 0, k = l;
	      while (i < n1 && j < n2) {
	          if (L[i] <= R[j]) {
	              arr[k++] = L[i++];
	          } else {
	              arr[k++] = R[j++];
	          }
	      }
	      while (i < n1) arr[k++] = L[i++];
	      while (j < n2) arr[k++] = R[j++];
	  }
	  
	  void mergeSortBottomUp(std::vector<int>& arr) {
	      int n = arr.size();
	      for (int width = 1; width < n; width *= 2) {
	          for (int i = 0; i < n; i += 2 * width) {
	              int l = i;
	              int m = std::min(i + width - 1, n - 1);
	              int r = std::min(i + 2 * width - 1, n - 1);
	              if (m < r) {
	                  mergeBottomUp(arr, l, m, r);
	              }
	          }
	      }
	  }
	  
	  int main() {
	      std::vector<int> data = {38, 27, 43, 3, 9, 82, 10};
	      mergeSortBottomUp(data);
	      std::cout << "Bottom-Up Sorted: ";
	      for (int val : data) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function mergeSortBottomUp(arr) {
	      const n = arr.length;
	      for (let width = 1; width < n; width *= 2) {
	          for (let i = 0; i < n; i += 2 * width) {
	              const l = i;
	              const m = Math.min(i + width - 1, n - 1);
	              const r = Math.min(i + 2 * width - 1, n - 1);
	              
	              if (m < r) {
	                  const left = arr.slice(l, m + 1);
	                  const right = arr.slice(m + 1, r + 1);
	                  
	                  let i_l = 0, i_r = 0, k = l;
	                  while (i_l < left.length && i_r < right.length) {
	                      if (left[i_l] <= right[i_r]) {
	                          arr[k++] = left[i_l++];
	                      } else {
	                          arr[k++] = right[i_r++];
	                      }
	                  }
	                  while (i_l < left.length) arr[k++] = left[i_l++];
	                  while (i_r < right.length) arr[k++] = right[i_r++];
	              }
	          }
	      }
	      return arr;
	  }
	  
	  const data = [38, 27, 43, 3, 9, 82, 10];
	  mergeSortBottomUp(data);
	  console.log("Bottom-Up Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  public class MergeSortBottomUp {
	      private static void merge(int[] arr, int l, int m, int r) {
	          int n1 = m - l + 1;
	          int n2 = r - m;
	          int[] L = new int[n1];
	          int[] R = new int[n2];
	          System.arraycopy(arr, l, L, 0, n1);
	          System.arraycopy(arr, m + 1, R, 0, n2);
	          
	          int i = 0, j = 0, k = l;
	          while (i < n1 && j < n2) {
	              if (L[i] <= R[j]) {
	                  arr[k++] = L[i++];
	              } else {
	                  arr[k++] = R[j++];
	              }
	          }
	          while (i < n1) arr[k++] = L[i++];
	          while (j < n2) arr[k++] = R[j++];
	      }
	  
	      public static void mergeSortBottomUp(int[] arr) {
	          int n = arr.length;
	          for (int width = 1; width < n; width *= 2) {
	              for (int i = 0; i < n; i += 2 * width) {
	                  int l = i;
	                  int m = Math.min(i + width - 1, n - 1);
	                  int r = Math.min(i + 2 * width - 1, n - 1);
	                  if (m < r) {
	                      merge(arr, l, m, r);
	                  }
	              }
	          }
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {38, 27, 43, 3, 9, 82, 10};
	          mergeSortBottomUp(data);
	          System.out.println("Bottom-Up Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  
	  void mergeBottomUp(int arr[], int l, int m, int r) {
	      int n1 = m - l + 1;
	      int n2 = r - m;
	      int* L = (int*)malloc(n1 * sizeof(int));
	      int* R = (int*)malloc(n2 * sizeof(int));
	      
	      for (int i = 0; i < n1; i++) L[i] = arr[l + i];
	      for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
	      
	      int i = 0, j = 0, k = l;
	      while (i < n1 && j < n2) {
	          if (L[i] <= R[j]) {
	              arr[k++] = L[i++];
	          } else {
	              arr[k++] = R[j++];
	          }
	      }
	      while (i < n1) arr[k++] = L[i++];
	      while (j < n2) arr[k++] = R[j++];
	      
	      free(L);
	      free(R);
	  }
	  
	  int minVal(int a, int b) {
	      return (a < b) ? a : b;
	  }
	  
	  void mergeSortBottomUp(int arr[], int n) {
	      for (int width = 1; width < n; width *= 2) {
	          for (int i = 0; i < n; i += 2 * width) {
	              int l = i;
	              int m = minVal(i + width - 1, n - 1);
	              int r = minVal(i + 2 * width - 1, n - 1);
	              if (m < r) {
	                  mergeBottomUp(arr, l, m, r);
	              }
	          }
	      }
	  }
	  
	  int main() {
	      int data[] = {38, 27, 43, 3, 9, 82, 10};
	      int n = sizeof(data) / sizeof(data[0]);
	      mergeSortBottomUp(data, n);
	      printf("Bottom-Up Sorted: ");
	      for (int i = 0; i < n; i++) {
	          printf("%d ", data[i]);
	      }
	      printf("\n");
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Merge Sort
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Is stability\nrequired?"}
	      Q -- Yes --> S1{"Is memory/extra space\nseverely limited?"}
	      S1 -- Yes --> R1["❌ Use Stable in-place sorts\n(like Insertion Sort for small arrays)"]
	      S1 -- No --> R2["✅ Use Merge Sort\n(Stable, guaranteed O(n log n))"]
	      Q -- No --> S2{"Are you sorting\nlinked lists?"}
	      S2 -- Yes --> R2
	      S2 -- No --> S3{"Is guaranteed O(n log n)\nperformance critical?"}
	      S3 -- Yes --> R3["✅ Use Heap Sort\n(if space is tight) or Merge Sort"]
	      S3 -- No --> R4["❌ Use Quick Sort\n(Faster in practice on average)"]
	  ```
	-
	- ## ✅ Use Merge Sort When
		- You require a **stable** sort where the relative order of duplicate elements must be preserved.
		- Guaranteed $O(n \log n)$ performance is essential regardless of input patterns (avoiding Quick Sort's worst case).
		- You are sorting **Linked Lists**, because they can be merged in $O(1)$ space by rewiring pointers.
		- Sorting datasets that exceed RAM capacity, where Merge Sort's sequential access patterns are perfect for **External Sorting**.
	-
	- ## ❌ Avoid Merge Sort When
		- System memory is constrained and you cannot allocate the extra $O(n)$ space required for the merge arrays.
		- You are sorting small arrays (under 15-32 elements), where simpler $O(n^2)$ algorithms like Insertion Sort have less overhead.
-
- # Key Takeaways
  collapsed:: true
	- **Divide-and-Conquer** — recursively splits the array in half, sorts the halves, and merges them back in linear time.
	- **Stable** — preserves original ordering of matching items by preferring elements from the left side in the merge comparison.
	- **Out-of-place** — standard implementation requires $O(n)$ extra space to store merging values temporarily.
	- **Guaranteed Bounds** — worst, average, and best-case execution bounds are always $O(n \log n)$.
	- **Iterative Variant** — Bottom-Up Merge Sort performs merges iteratively without using the recursive call stack.
	- **Ideal for Lists** — fits Linked List sorting exceptionally well because pointers can be updated in-place without copying data.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Merge Sort](https://www.geeksforgeeks.org/merge-sort/)
		- [TheAlgorithms – Merge Sort (Python)](https://github.com/TheAlgorithms/Python/blob/master/sorts/merge_sort.py)