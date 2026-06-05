---
seoTitle: Insertion Sort Algorithm – Implementation, Mechanics, and Practical Applications
description: "In-depth guide to Insertion Sort. Explains card-sorting analogy, stability, adaptability, performance on partially sorted datasets, and complete implementations in Python, C++, JavaScript, Java, and C."
keywords: "insertion sort, sorting algorithm, playing cards sort, O(n^2), stable sort, in-place sort, time complexity, space complexity, comparison sort, hybrid sort, VR-Rathod, Code-Note, Vaibhav Rathod"
treeTitle: DSA - Sorting & Searching - Insertion Sort
---

> [!info] What is Insertion Sort?
> Insertion Sort is a simple, comparison-based sorting algorithm that builds the final sorted array one element at a time.
> It works by taking elements from an unsorted portion of the array and inserting them into their correct position in a sorted portion.
> It is highly efficient for **small datasets (N < 15)** and **partially sorted arrays**, serving as the foundation for modern hybrid sorting algorithms like **Timsort** and **Introsort**.

- # Explanation
  collapsed:: true
	- **Insertion Sort** behaves like sorting a hand of playing cards. You start with an empty left hand and the cards face down on the table. You then remove one card at a time from the table and insert it into the correct position in your left hand. To find the correct position, you compare it with the cards already in your hand, from right to left.
	-
	- In the array representation, the first element is considered sorted. The algorithm then iterates from index 1 to $N-1$. For each element (referred to as the `key`), it shifts all elements in the sorted portion that are larger than the `key` one position to the right, and places the `key` in the vacant slot.
	-
	- ## Core Properties
	  collapsed:: true
		- **Stability:** **Stable** (Yes). It only shifts elements if they are strictly greater than the `key` (`arr[j] > key`), preserving the original order of equal elements.
		- **In-Place:** **Yes**. Requires only $O(1)$ auxiliary space.
		- **Adaptability:** **Yes**. If the array is already sorted, the inner loop never executes, yielding a linear $O(n)$ time complexity. It is also extremely fast for "nearly sorted" data.
-
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- For each element at index $i$ (starting from 1):
			- Store the element as `key`.
			- Compare `key` with preceding elements.
			- Shift preceding elements that are greater than `key` to the right.
			- Insert `key` at its correct position.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — input array of size N"] --> B["i = 1"]
		      B --> C{"i < N?"}
		      C -- No --> H["End — Array Sorted"]
		      C -- Yes --> D["key = arr[i]\nj = i - 1"]
		      D --> E{"j >= 0 and arr[j] > key?"}
		      E -- Yes --> F["arr[j+1] = arr[j]\nj = j - 1"]
		      F --> E
		      E -- No --> G["arr[j+1] = key\ni = i + 1"]
		      G --> C
		  ```
	-
	- ## Step-by-Step Trace (Sorting: [12, 11, 13, 5, 6])
	  collapsed:: true
		- Let's trace how elements are shifted to insert the key:
		- ```
		  Initial Array: [ 12, 11, 13, 5, 6 ]
		  
		  Pass 1 (i = 1, key = 11):
		  - 12 > 11 → Shift 12 right → [ 12, 12, 13, 5, 6 ]
		  - Reach index 0 → Insert 11 at index 0 → [ 11, 12, 13, 5, 6 ]
		  
		  Pass 2 (i = 2, key = 13):
		  - 12 < 13 → No shift → Insert 13 at index 2 → [ 11, 12, 13, 5, 6 ]
		  
		  Pass 3 (i = 3, key = 5):
		  - 13 > 5 → Shift 13 right → [ 11, 12, 13, 13, 6 ]
		  - 12 > 5 → Shift 12 right → [ 11, 12, 12, 13, 6 ]
		  - 11 > 5 → Shift 11 right → [ 11, 11, 12, 13, 6 ]
		  - Reach index -1 → Insert 5 at index 0 → [ 5, 11, 12, 13, 6 ]
		  
		  Pass 4 (i = 4, key = 6):
		  - 13 > 6 → Shift 13 right → [ 5, 11, 12, 13, 13 ]
		  - 12 > 6 → Shift 12 right → [ 5, 11, 12, 12, 13 ]
		  - 11 > 6 → Shift 11 right → [ 5, 11, 11, 12, 13 ]
		  - 5 < 6 → Stop shifting → Insert 6 at index 1 → [ 5, 6, 11, 12, 13 ]
		  ```
		-
		- | Pass | Key | Comparisons | Shifting Moves | Array State (After Pass) |
		  |---|---|---|---|---|
		  | **Start**| — | — | — | `[12, 11, 13, 5, 6]` |
		  | **1** | 11 | 12 vs 11 | Shift 12 | `[11, 12, 13, 5, 6]` |
		  | **2** | 13 | 12 vs 13 | None | `[11, 12, 13, 5, 6]` |
		  | **3** | 5 | 13 vs 5, 12 vs 5, 11 vs 5 | Shift 13, 12, 11 | `[5, 11, 12, 13, 6]` |
		  | **4** | 6 | 13 vs 6, 12 vs 6, 11 vs 6, 5 vs 6 | Shift 13, 12, 11 | `[5, 6, 11, 12, 13]` |
-
- # Complexity Analysis
  collapsed:: true
	- | Scenario | Time Complexity | Space Complexity | Trigger Condition |
	  |---|---|---|---|
	  | **Best Case** | **O(n)** | **O(1)** | Array is already fully sorted. |
	  | **Average Case**| **O(n²)** | **O(1)** | Elements are in random order. |
	  | **Worst Case** | **O(n²)** | **O(1)** | Array is reversed sorted. |
	-
	- ## Why Insertion Sort is Used in Practice
	  collapsed:: true
		- Despite its worst-case $O(n^2)$ complexity, Insertion Sort has a very low overhead. Hybrid sorting algorithms like **Timsort** (default in Python, Java, Android) and **Introsort** (default in C++) use Insertion Sort once partitions or merge slices shrink below a threshold size (e.g. 10 to 32 elements).
-
- # Implementation
  collapsed:: true
	- > [!note] In-place insertion sort implementations.
		- Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def insertion_sort(arr):
	      for i in range(1, len(arr)):
	          key = arr[i]
	          j = i - 1
	          # Shift elements of arr[0..i-1] that are greater than key
	          while j >= 0 and arr[j] > key:
	              arr[j + 1] = arr[j]
	              j -= 1
	          arr[j + 1] = key
	      return arr
	  
	  # Example Setup
	  if __name__ == "__main__":
	      data = [12, 11, 13, 5, 6]
	      print("Original:", data)
	      insertion_sort(data)
	      print("Sorted:  ", data)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  
	  void insertionSort(std::vector<int>& arr) {
	      int n = arr.size();
	      for (int i = 1; i < n; ++i) {
	          int key = arr[i];
	          int j = i - 1;
	          while (j >= 0 && arr[j] > key) {
	              arr[j + 1] = arr[j];
	              --j;
	          }
	          arr[j + 1] = key;
	      }
	  }
	  
	  int main() {
	      std::vector<int> data = {12, 11, 13, 5, 6};
	      insertionSort(data);
	      std::cout << "Sorted: ";
	      for (int val : data) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function insertionSort(arr) {
	      const n = arr.length;
	      for (let i = 1; i < n; i++) {
	          const key = arr[i];
	          let j = i - 1;
	          while (j >= 0 && arr[j] > key) {
	              arr[j + 1] = arr[j];
	              j--;
	          }
	          arr[j + 1] = key;
	      }
	      return arr;
	  }
	  
	  // Example
	  const data = [12, 11, 13, 5, 6];
	  insertionSort(data);
	  console.log("Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  public class InsertionSort {
	      public static void insertionSort(int[] arr) {
	          int n = arr.length;
	          for (int i = 1; i < n; i++) {
	              int key = arr[i];
	              int j = i - 1;
	              while (j >= 0 && arr[j] > key) {
	                  arr[j + 1] = arr[j];
	                  j--;
	              }
	                  arr[j + 1] = key;
	          }
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {12, 11, 13, 5, 6};
	          insertionSort(data);
	          System.out.println("Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  
	  void insertionSort(int arr[], int n) {
	      for (int i = 1; i < n; i++) {
	          int key = arr[i];
	          int j = i - 1;
	          while (j >= 0 && arr[j] > key) {
	              arr[j + 1] = arr[j];
	              j--;
	          }
	          arr[j + 1] = key;
	      }
	  }
	  
	  int main() {
	      int data[] = {12, 11, 13, 5, 6};
	      int n = sizeof(data) / sizeof(data[0]);
	      insertionSort(data, n);
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
- # Recursive Variant (Recursive Insertion Sort)
  collapsed:: true
	- > [!tip] Recursive Insertion Sort
	  > Recursive Insertion Sort sorts the first $N-1$ elements of the array recursively, then inserts the last element into its correct sorted position among the sorted elements.
	  > This keeps the $O(n^2)$ time complexity while adding a recursive call stack space of $O(n)$.
	-
	- :::code-tabs
	  
	  ```python
	  def recursive_insertion_sort(arr, n=None):
	      if n is None:
	          n = len(arr)
	      # Base case: 1 element left
	      if n <= 1:
	          return arr
	          
	      # Sort first n-1 elements
	      recursive_insertion_sort(arr, n - 1)
	      
	      # Insert the last element into its correct sorted position
	      last = arr[n - 1]
	      j = n - 2
	      
	      while j >= 0 and arr[j] > last:
	          arr[j + 1] = arr[j]
	          j -= 1
	      arr[j + 1] = last
	      return arr
	  
	  if __name__ == "__main__":
	      data = [12, 11, 13, 5, 6]
	      print("Recursive Sorted:", recursive_insertion_sort(data))
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  
	  void recursiveInsertionSort(std::vector<int>& arr, int n) {
	      if (n <= 1) return;
	      
	      // Sort first n-1 elements
	      recursiveInsertionSort(arr, n - 1);
	      
	      // Insert last element
	      int last = arr[n - 1];
	      int j = n - 2;
	      while (j >= 0 && arr[j] > last) {
	          arr[j + 1] = arr[j];
	          j--;
	      }
	      arr[j + 1] = last;
	  }
	  
	  int main() {
	      std::vector<int> data = {12, 11, 13, 5, 6};
	      recursiveInsertionSort(data, data.size());
	      std::cout << "Recursive Sorted: ";
	      for (int val : data) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function recursiveInsertionSort(arr, n = arr.length) {
	      if (n <= 1) return arr;
	      
	      // Sort first n-1 elements
	      recursiveInsertionSort(arr, n - 1);
	      
	      // Insert last element
	      const last = arr[n - 1];
	      let j = n - 2;
	      while (j >= 0 && arr[j] > last) {
	          arr[j + 1] = arr[j];
	          j--;
	      }
	      arr[j + 1] = last;
	      return arr;
	  }
	  
	  const data = [12, 11, 13, 5, 6];
	  recursiveInsertionSort(data);
	  console.log("Recursive Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  public class InsertionSortRecursive {
	      public static void recursiveInsertionSort(int[] arr, int n) {
	          if (n <= 1) return;
	          
	          // Sort first n-1 elements
	          recursiveInsertionSort(arr, n - 1);
	          
	          // Insert last element
	          int last = arr[n - 1];
	          int j = n - 2;
	          while (j >= 0 && arr[j] > last) {
	              arr[j + 1] = arr[j];
	              j--;
	          }
	          arr[j + 1] = last;
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {12, 11, 13, 5, 6};
	          recursiveInsertionSort(data, data.length);
	          System.out.println("Recursive Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  
	  void recursiveInsertionSort(int arr[], int n) {
	      if (n <= 1) return;
	      
	      // Sort first n-1 elements
	      recursiveInsertionSort(arr, n - 1);
	      
	      // Insert last element
	      int last = arr[n - 1];
	      int j = n - 2;
	      while (j >= 0 && arr[j] > last) {
	          arr[j + 1] = arr[j];
	          j--;
	      }
	      arr[j + 1] = last;
	  }
	  
	  int main() {
	      int data[] = {12, 11, 13, 5, 6};
	      int n = sizeof(data) / sizeof(data[0]);
	      recursiveInsertionSort(data, n);
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
- # When to Use Insertion Sort
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Is the dataset\nsmall (N < 32)?"}
	      Q -- Yes --> S1{"Do you require\na stable sort?"}
	      S1 -- Yes --> R1["✅ Use Insertion Sort\n(Stable, in-place, low constant factor)"]
	      S1 -- No --> R1
	      Q -- No --> S2{"Are you receiving data\nelement-by-element\n(online/live stream)?"}
	      S2 -- Yes --> R2["✅ Use Insertion Sort\n(Inserts incoming items directly into sorted order)"]
	      S2 -- No --> S3{"Is the array\nnearly sorted?"}
	      S3 -- Yes --> R1
	      S3 -- No --> R3["❌ Use Merge / Quick / Heap Sort\n(O(n^2) random-order overhead too high)"]
	  ```
	-
	- ## ✅ Use Insertion Sort When
		- The dataset is small ($N < 32$), where its simplicity and low constant factors outpace $O(n \log n)$ algorithms.
		- The dataset is already nearly-sorted or partially-sorted, running in close to linear $O(n)$ time.
		- You are sorting an **online stream of data**, inserting new items one-by-one as they arrive.
		- You require a **stable**, **in-place** sort with $O(1)$ auxiliary memory footprint.
	-
	- ## ❌ Avoid Insertion Sort When
		- You are sorting large arrays in random or reversed order, where the $O(n^2)$ time complexity becomes prohibitive.
-
- # Key Takeaways
  collapsed:: true
	- **Card Sorting Analogy** — builds the sorted portion element by element by shifting larger sorted keys to make room for the current key.
	- **Stable** — preserves arrival order of duplicate keys because shifting is only triggered by strictly greater elements ($arr[j] > key$).
	- **In-place** — does not allocate additional memory tables, maintaining a space complexity of $O(1)$.
	- **Highly Adaptive** — runs in $O(n)$ best-case time when the input is already sorted, performing zero shifts.
	- **Hybrid Backbone** — serves as the termination step in high-performance library hybrids like Timsort and Introsort.
	- **Online Efficiency** — naturally accommodates appending data streams, immediately inserting incoming elements at correct positions.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Insertion Sort](https://www.geeksforgeeks.org/insertion-sort/)
		- [TheAlgorithms – Insertion Sort (Python)](https://github.com/TheAlgorithms/Python/blob/master/sorts/insertion_sort.py)