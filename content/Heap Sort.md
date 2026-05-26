---
seoTitle: Heap Sort Algorithm – Implementation, Heap Mechanics, and Complexity
description: "In-depth guide to Heap Sort. Explains max-heap representation, O(n) heapify phase, in-place sorting steps, stability, and complete code in Python, C++, JavaScript, Java, and C."
keywords: "heap sort, heapsort, binary heap, max heap, heapify, O(n log n), unstable sort, in-place sort, time complexity, space complexity, comparison sort, VR-Rathod, Code-Note, Vaibhav Rathod"
---

> [!info] What is Heap Sort?
> Heap Sort is an in-place, comparison-based sorting algorithm based on the **Binary Heap** data structure.
> It works by building a Max-Heap from the array, then repeatedly removing the maximum element from the heap (placing it at the end of the array) and restoring the heap structure.
> It guarantees **O(n log n)** performance in all cases and requires **O(1)** auxiliary space, making it a reliable fallback sort.

- # Explanation
  collapsed:: true
	- **Heap Sort** can be thought of as an optimization of Selection Sort. While Selection Sort searches the unsorted portion linearly ($O(n)$) to find the maximum element, Heap Sort organizes the unsorted portion into a binary heap to find and extract the maximum element in logarithmic ($O(\log n)$) time.
	-
	- ## Binary Heap Representation
	  collapsed:: true
		- A binary heap is a complete binary tree stored in an array. For a node at index $i$:
			- **Left Child:** `2 * i + 1`
			- **Right Child:** `2 * i + 2`
			- **Parent:** `(i - 1) / 2`
		- A **Max-Heap** satisfies the property: `arr[parent] >= arr[child]`.
	-
	- ## Phases of Heap Sort
	  collapsed:: true
		- 1. **Heapify / Build Max-Heap:** Transform the input array into a Max-Heap. We do this by calling `heapify` on all non-leaf nodes starting from the bottom (`n/2 - 1`) up to the root (`0`). This phase runs in **O(n)** time.
		- 2. **Sort Down / Extract:** Swap the root of the heap (the maximum element) with the last element of the unsorted portion. Reduce the heap size by 1, and call `heapify` on the root to restore the Max-Heap property. Repeat this process until the heap size is 1. This phase runs in **O(n log n)** time.
	-
	- ## Core Properties
	  collapsed:: true
		- **Stability:** **Unstable** (No). Re-heapifying swaps non-adjacent elements across the heap tree structure, which disrupts the relative order of identical keys.
		- **In-Place:** **Yes**. The heap is built directly within the input array, requiring only $O(1)$ auxiliary space.
		- **Adaptability:** **No**. It performs the same heap operations regardless of whether the array is initially sorted.
-
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- Build the heap, then extract.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — input array of size N"] --> B["Build Max-Heap\nfor i = N/2 - 1 down to 0: heapify(N, i)"]
		      B --> C["size = N - 1"]
		      C --> D{"size > 0?"}
		      D -- No --> H["End — Array Sorted"]
		      D -- Yes --> E["Swap arr[0] & arr[size]\n(Extract max to final sorted position)"]
		      E --> F["heapify(size, 0)\n(Restore Max-Heap structure for remaining elements)"]
		      F --> G["size = size - 1"]
		      G --> D
		  ```
	-
	- ## Heapify Structural Walkthrough (Heapifying node 0)
	  collapsed:: true
		- When `heapify` is called on index `i`, we check its children. If a child is larger than the parent, we swap them and recursively call `heapify` on the affected subtree:
		- ```
		  Initial (violates Max-Heap):
		        4 (index 0)
		       / \
		      10  3   --> Max child is 10 (index 1)
		     /  \
		    5    1
		  
		  After Swap:
		       10 (index 0)
		       / \
		      4   3   --> Recurse heapify on index 1: children are 5 and 1.
		     / \          Max child is 5 (index 3). Swap!
		    5   1
		  
		  Final Max-Heap:
		       10
		       / \
		      5   3
		     / \
		    4   1
		  ```
	-
	- ## Step-by-Step Trace (Sorting: [4, 10, 3, 5, 1])
	  collapsed:: true
		- Trace of the extraction phase starting with the Max-Heap `[10, 5, 3, 4, 1]`:
		- ```
		  Heap State: [ 10, 5, 3, 4, 1 ]
		  
		  - Swap root (10) with last element (1) → Extract 10 → Heap Size = 4
		    Array: [ 1, 5, 3, 4 | 10 ] → Heapify root (1) → Heap State: [ 5, 4, 3, 1 | 10 ]
		  
		  - Swap root (5) with last element (1) → Extract 5 → Heap Size = 3
		    Array: [ 1, 4, 3 | 5, 10 ] → Heapify root (1) → Heap State: [ 4, 1, 3 | 5, 10 ]
		  
		  - Swap root (4) with last element (3) → Extract 4 → Heap Size = 2
		    Array: [ 3, 1 | 4, 5, 10 ] → Heapify root (3) → Heap State: [ 3, 1 | 4, 5, 10 ]
		  
		  - Swap root (3) with last element (1) → Extract 3 → Heap Size = 1
		    Array: [ 1 | 3, 4, 5, 10 ]
		  
		  - Heap Size = 1 → Stop. Sorted Array: [ 1, 3, 4, 5, 10 ]
		  ```
-
- # Complexity Analysis
  collapsed:: true
	- | Scenario | Time Complexity | Space Complexity | Trigger Condition |
	  |---|---|---|---|
	  | **Best Case** | **O(n log n)** | **O(1)** | Triggered on distinct elements. |
	  | **Average Case**| **O(n log n)** | **O(1)** | Triggered on random inputs. |
	  | **Worst Case** | **O(n log n)** | **O(1)** | Triggered on any input. |
	-
	- ## Guaranteed Performance
	  collapsed:: true
		- Unlike Quick Sort, Heap Sort has a guaranteed worst-case time complexity of $O(n \log n)$ and is completely immune to bad pivot decisions or pathological input cases, making it popular in real-time embedded systems where timing must be predictable.
-
- # Implementation
  collapsed:: true
	- > [!note] In-place Heap Sort implementations using max-heaps.
	  - Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def heap_sort(arr):
	      n = len(arr)
	      
	      def heapify(size, root):
	          largest = root
	          left = 2 * root + 1
	          right = 2 * root + 2
	          
	          # Check if left child is larger than root
	          if left < size and arr[left] > arr[largest]:
	              largest = left
	          # Check if right child is larger than largest so far
	          if right < size and arr[right] > arr[largest]:
	              largest = right
	              
	          # If largest is not root, swap and continue heapifying
	          if largest != root:
	              arr[root], arr[largest] = arr[largest], arr[root]
	              heapify(size, largest)
	              
	      # Build Max-Heap
	      for i in range(n // 2 - 1, -1, -1):
	          heapify(n, i)
	          
	      # Extract elements one by one from heap
	      for i in range(n - 1, 0, -1):
	          # Swap current root to the end
	          arr[0], arr[i] = arr[i], arr[0]
	          # Restore heap property on reduced heap
	          heapify(i, 0)
	          
	      return arr
	  
	  # Example Setup
	  if __name__ == "__main__":
	      data = [4, 10, 3, 5, 1]
	      print("Original:", data)
	      heap_sort(data)
	      print("Sorted:  ", data)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  
	  void heapify(std::vector<int>& arr, int size, int root) {
	      int largest = root;
	      int left = 2 * root + 1;
	      int right = 2 * root + 2;
	  
	      if (left < size && arr[left] > arr[largest]) {
	          largest = left;
	      }
	      if (right < size && arr[right] > arr[largest]) {
	          largest = right;
	      }
	  
	      if (largest != root) {
	          std::swap(arr[root], arr[largest]);
	          heapify(arr, size, largest);
	      }
	  }
	  
	  void heapSort(std::vector<int>& arr) {
	      int n = arr.size();
	  
	      // Build Max-Heap
	      for (int i = n / 2 - 1; i >= 0; --i) {
	          heapify(arr, n, i);
	      }
	  
	      // Extract elements
	      for (int i = n - 1; i > 0; --i) {
	          std::swap(arr[0], arr[i]);
	          heapify(arr, i, 0);
	      }
	  }
	  
	  int main() {
	      std::vector<int> data = {4, 10, 3, 5, 1};
	      heapSort(data);
	      std::cout << "Sorted: ";
	      for (int val : data) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function heapSort(arr) {
	      const n = arr.length;
	  
	      function heapify(size, root) {
	          let largest = root;
	          const left = 2 * root + 1;
	          const right = 2 * root + 2;
	  
	          if (left < size && arr[left] > arr[largest]) {
	              largest = left;
	          }
	          if (right < size && arr[right] > arr[largest]) {
	              largest = right;
	          }
	  
	          if (largest !== root) {
	              const temp = arr[root];
	              arr[root] = arr[largest];
	              arr[largest] = temp;
	              heapify(size, largest);
	          }
	      }
	  
	      // Build Max-Heap
	      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
	          heapify(n, i);
	      }
	  
	      // Extract elements
	      for (let i = n - 1; i > 0; i--) {
	          const temp = arr[0];
	          arr[0] = arr[i];
	          arr[i] = temp;
	          heapify(i, 0);
	      }
	      return arr;
	  }
	  
	  // Example
	  const data = [4, 10, 3, 5, 1];
	  heapSort(data);
	  console.log("Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  public class HeapSort {
	      private static void heapify(int[] arr, int size, int root) {
	          int largest = root;
	          int left = 2 * root + 1;
	          int right = 2 * root + 2;
	  
	          if (left < size && arr[left] > arr[largest]) {
	              largest = left;
	          }
	          if (right < size && arr[right] > arr[largest]) {
	              largest = right;
	          }
	  
	          if (largest != root) {
	              int temp = arr[root];
	              arr[root] = arr[largest];
	              arr[largest] = temp;
	              heapify(arr, size, largest);
	          }
	      }
	  
	      public static void heapSort(int[] arr) {
	          int n = arr.length;
	  
	          // Build Max-Heap
	          for (int i = n / 2 - 1; i >= 0; i--) {
	              heapify(arr, n, i);
	          }
	  
	          // Extract elements
	          for (int i = n - 1; i > 0; i--) {
	              int temp = arr[0];
	              arr[0] = arr[i];
	              arr[i] = temp;
	              heapify(arr, i, 0);
	          }
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {4, 10, 3, 5, 1};
	          heapSort(data);
	          System.out.println("Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  
	  void swap(int* a, int* b) {
	      int temp = *a;
	      *a = *b;
	      *b = temp;
	  }
	  
	  void heapify(int arr[], int size, int root) {
	      int largest = root;
	      int left = 2 * root + 1;
	      int right = 2 * root + 2;
	  
	      if (left < size && arr[left] > arr[largest]) {
	          largest = left;
	      }
	      if (right < size && arr[right] > arr[largest]) {
	          largest = right;
	      }
	  
	      if (largest != root) {
	          swap(&arr[root], &arr[largest]);
	          heapify(arr, size, largest);
	      }
	  }
	  
	  void heapSort(int arr[], int n) {
	      // Build Max-Heap
	      for (int i = n / 2 - 1; i >= 0; i--) {
	          heapify(arr, n, i);
	      }
	  
	      // Extract elements
	      for (int i = n - 1; i > 0; i--) {
	          swap(&arr[0], &arr[i]);
	          heapify(arr, i, 0);
	      }
	  }
	  
	  int main() {
	      int data[] = {4, 10, 3, 5, 1};
	      int n = sizeof(data) / sizeof(data[0]);
	      heapSort(data, n);
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
- # Alternative Variant (Min-Heap Sort)
  collapsed:: true
	- > [!tip] Sorting in Descending Order using a Min-Heap
	  > Standard Heap Sort builds a **Max-Heap** to sort an array in ascending order.
	  > To sort in **descending order** in-place, we build a **Min-Heap** instead. In a Min-Heap, the root is always the smallest element. We repeatedly swap the root with the last element of the unsorted portion and re-heapify. This places the smallest elements at the end, resulting in a descending-sorted array.
	-
	- :::code-tabs
	  
	  ```python
	  def min_heapify(arr, size, root):
	      smallest = root
	      left = 2 * root + 1
	      right = 2 * root + 2
	      
	      if left < size and arr[left] < arr[smallest]:
	          smallest = left
	      if right < size and arr[right] < arr[smallest]:
	          smallest = right
	          
	      if smallest != root:
	          arr[root], arr[smallest] = arr[smallest], arr[root]
	          min_heapify(arr, size, smallest)
	  
	  def min_heap_sort(arr):
	      n = len(arr)
	      
	      # Build Min-Heap
	      for i in range(n // 2 - 1, -1, -1):
	          min_heapify(arr, n, i)
	          
	      # Extract elements one by one
	      for i in range(n - 1, 0, -1):
	          arr[0], arr[i] = arr[i], arr[0]
	          min_heapify(arr, i, 0)
	          
	      return arr
	  
	  if __name__ == "__main__":
	      data = [4, 10, 3, 5, 1]
	      print("Original:", data)
	      min_heap_sort(data)
	      print("Sorted (Descending):", data)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  
	  void minHeapify(std::vector<int>& arr, int size, int root) {
	      int smallest = root;
	      int left = 2 * root + 1;
	      int right = 2 * root + 2;
	  
	      if (left < size && arr[left] < arr[smallest]) {
	          smallest = left;
	      }
	      if (right < size && arr[right] < arr[smallest]) {
	          smallest = right;
	      }
	  
	      if (smallest != root) {
	          std::swap(arr[root], arr[smallest]);
	          minHeapify(arr, size, smallest);
	      }
	  }
	  
	  void minHeapSort(std::vector<int>& arr) {
	      int n = arr.size();
	  
	      // Build Min-Heap
	      for (int i = n / 2 - 1; i >= 0; --i) {
	          minHeapify(arr, n, i);
	      }
	  
	      // Extract elements
	      for (int i = n - 1; i > 0; --i) {
	          std::swap(arr[0], arr[i]);
	          minHeapify(arr, i, 0);
	      }
	  }
	  
	  int main() {
	      std::vector<int> data = {4, 10, 3, 5, 1};
	      minHeapSort(data);
	      std::cout << "Sorted (Descending): ";
	      for (int val : data) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function minHeapify(arr, size, root) {
	      let smallest = root;
	      const left = 2 * root + 1;
	      const right = 2 * root + 2;
	  
	      if (left < size && arr[left] < arr[smallest]) {
	          smallest = left;
	      }
	      if (right < size && arr[right] < arr[smallest]) {
	          smallest = right;
	      }
	  
	      if (smallest !== root) {
	          const temp = arr[root];
	          arr[root] = arr[smallest];
	          arr[smallest] = temp;
	          minHeapify(arr, size, smallest);
	      }
	  }
	  
	  function minHeapSort(arr) {
	      const n = arr.length;
	  
	      // Build Min-Heap
	      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
	          minHeapify(arr, n, i);
	      }
	  
	      // Extract elements
	      for (let i = n - 1; i > 0; i--) {
	          const temp = arr[0];
	          arr[0] = arr[i];
	          arr[i] = temp;
	          minHeapify(arr, i, 0);
	      }
	      return arr;
	  }
	  
	  const data = [4, 10, 3, 5, 1];
	  minHeapSort(data);
	  console.log("Sorted (Descending):", data);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  public class MinHeapSort {
	      private static void minHeapify(int[] arr, int size, int root) {
	          int smallest = root;
	          int left = 2 * root + 1;
	          int right = 2 * root + 2;
	  
	          if (left < size && arr[left] < arr[smallest]) {
	              smallest = left;
	          }
	          if (right < size && arr[right] < arr[smallest]) {
	              smallest = right;
	          }
	  
	          if (smallest != root) {
	              int temp = arr[root];
	              arr[root] = arr[smallest];
	              arr[smallest] = temp;
	              minHeapify(arr, size, smallest);
	          }
	      }
	  
	      public static void minHeapSort(int[] arr) {
	          int n = arr.length;
	  
	          // Build Min-Heap
	          for (int i = n / 2 - 1; i >= 0; i--) {
	              minHeapify(arr, n, i);
	          }
	  
	          // Extract elements
	          for (int i = n - 1; i > 0; i--) {
	              int temp = arr[0];
	              arr[0] = arr[i];
	              arr[i] = temp;
	              minHeapify(arr, i, 0);
	          }
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {4, 10, 3, 5, 1};
	          minHeapSort(data);
	          System.out.println("Sorted (Descending): " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  
	  void minHeapSwap(int* a, int* b) {
	      int temp = *a;
	      *a = *b;
	      *b = temp;
	  }
	  
	  void minHeapify(int arr[], int size, int root) {
	      int smallest = root;
	      int left = 2 * root + 1;
	      int right = 2 * root + 2;
	  
	      if (left < size && arr[left] < arr[smallest]) {
	          smallest = left;
	      }
	      if (right < size && arr[right] < arr[smallest]) {
	          smallest = right;
	      }
	  
	      if (smallest != root) {
	          minHeapSwap(&arr[root], &arr[smallest]);
	          minHeapify(arr, size, smallest);
	      }
	  }
	  
	  void minHeapSort(int arr[], int n) {
	      // Build Min-Heap
	      for (int i = n / 2 - 1; i >= 0; i--) {
	          minHeapify(arr, n, i);
	      }
	  
	      // Extract elements
	      for (int i = n - 1; i > 0; i--) {
	          minHeapSwap(&arr[0], &arr[i]);
	          minHeapify(arr, i, 0);
	      }
	  }
	  
	  int main() {
	      int data[] = {4, 10, 3, 5, 1};
	      int n = sizeof(data) / sizeof(data[0]);
	      minHeapSort(data, n);
	      printf("Sorted (Descending): ");
	      for (int i = 0; i < n; i++) {
	          printf("%d ", data[i]);
	      }
	      printf("\n");
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Heap Sort
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Is memory extremely\nrestricted (O(1) space required)?"}
	      Q -- No --> S1{"Do you need a stable sort?"}
	      S1 -- Yes --> R1["❌ Use Merge Sort\n(Stable, O(N log N) space)"]
	      S1 -- No --> S2{"Is guaranteed O(N log N)\nworst-case important?"}
	      S2 -- Yes --> R2["✅ Use Heap Sort\n(O(1) space, O(N log N) worst-case)"]
	      S2 -- No --> R3["✅ Use Quick Sort\n(Better average-case constant factor)"]
	      Q -- Yes --> S3{"Do you need a stable sort?"}
	      S3 -- Yes --> R4["❌ Cannot use Heap Sort\n(Heap Sort is unstable.\nConsider Insertion Sort if N is small)"]
	      S3 -- No --> R2
	  ```
	-
	- ## ✅ Use Heap Sort When
		- You need a guaranteed $O(n \log n)$ worst-case time complexity with no chance of performance degradation like Quick Sort.
		- Auxiliary memory is strictly limited to $O(1)$ space, making Merge Sort ($O(n)$ space) impractical.
		- You are working in real-time or safety-critical systems (e.g., embedded control devices) where predictable execution limits are mandatory.
	-
	- ## ❌ Avoid Heap Sort When
		- A **stable** sort is required (relative order of duplicate elements must be preserved).
		- Cache efficiency is highly critical. Heap Sort has poor cache locality because it references distant indices when traversing up and down the tree representation.
		- The dataset is small (simpler algorithms like Insertion Sort have lower constant factor overhead).
-
- # Key Takeaways
  collapsed:: true
	- **Binary Heap Advantage** — constructs a complete binary tree mapping over the input array, finding and extracting elements without allocating additional pointer structures.
	- **Predictable Performance** — guarantees $O(n \log n)$ complexity in best, average, and worst cases, ensuring complete immunity to pathological inputs.
	- **Strictly In-place** — requires $O(1)$ auxiliary storage, making it highly memory efficient compared to Merge Sort.
	- **Unstable Mechanics** — parent-child swaps across wide tree structures break the original relative order of duplicate elements.
	- **Poor Cache Locality** — indexing patterns jump across distant indices (e.g. from index $i$ to $2i+1$), causing high cache miss rates on modern CPUs.
	- **Descending Sort via Min-Heap** — swapping out the root of a Min-Heap naturally places smaller items towards the end, sorting the array in descending order.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Heap Sort](https://www.geeksforgeeks.org/heap-sort/)
		- [TheAlgorithms – Heap Sort (Python)](https://github.com/TheAlgorithms/Python/blob/master/sorts/heap_sort.py)