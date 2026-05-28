---
seoTitle: Quick Sort Algorithm – Implementation, Partitioning Schemes, and Complexity
description: "In-depth guide to Quick Sort. Compares Lomuto vs Hoare partitioning, pivot selection strategies to avoid O(n^2) worst case, and contains complete codes in Python, C++, JavaScript, Java, and C."
keywords: "quick sort, quicksort, partitioning scheme, Hoare partition, Lomuto partition, random pivot, O(n log n), unstable sort, sorting algorithm, VR-Rathod, Code-Note, Vaibhav Rathod"
---

> [!info] What is Quick Sort?
> Quick Sort is a highly efficient, in-place, divide-and-conquer comparison sorting algorithm.
> It works by selecting a 'pivot' element and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot.
> It achieves an average time complexity of **O(n log n)** and requires minimal memory ($O(\log n)$ stack space).

- # Explanation
  collapsed:: true
	- **Quick Sort** recursively partitions an array using the following steps:
		- 1. Choose a **pivot** element from the array.
		- 2. **Partition** the array: reorder elements such that all elements with values less than the pivot come before it, while all elements with values greater than the pivot come after it.
		- 3. Recursively apply the above steps to the sub-array of smaller elements and the sub-array of larger elements.
	-
	- ## Partitioning Schemes
	  collapsed:: true
		- There are two primary partitioning algorithms:
			- **Lomuto Partition Scheme:** The pivot is typically chosen as the last element. A single pointer scans the array, swapping elements smaller than the pivot to the left. It is easier to implement but performs more swaps and behaves poorly when all elements are equal.
			- **Hoare Partition Scheme:** Uses two pointers starting at the ends of the array and moving toward each other. They stop when they find an element on the left larger than the pivot and an element on the right smaller than the pivot, and swap them. It performs about three times fewer swaps on average than Lomuto and handles duplicate keys efficiently.
	-
	- ## Pivot Selection Strategies
	  collapsed:: true
		- The choice of the pivot significantly impacts performance:
			- **Fixed Pivot (First or Last element):** If the array is already sorted or reverse-sorted, a fixed pivot causes highly unbalanced partitions, degrading the time complexity to $O(n^2)$.
			- **Random Pivot:** Selecting a random element as the pivot makes the worst-case $O(n^2)$ behavior extremely rare ($P \approx 0$).
			- **Median-of-Three:** Choosing the median of the first, middle, and last elements as the pivot provides stable $O(n \log n)$ partitioning for sorted inputs.
	-
	- ## Core Properties
	  collapsed:: true
		- **Stability:** **Unstable** (No). Swapping elements over the pivot can easily disrupt the relative order of equal keys.
		- **In-Place:** **Yes** (in terms of auxiliary data storage). It only requires stack space for recursive calls ($O(\log n)$ average, $O(n)$ worst-case).
		- **Adaptability:** **No**. It does not perform faster on sorted arrays unless random pivoting or median-of-three is combined with early termination guards.
-
- # How It Works (Hoare Partitioning)
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- Pick a pivot (e.g. random, but swapped to the beginning). Initialize left pointer $i$ and right pointer $j$.
		- Move $i$ rightwards while elements are less than pivot, and $j$ leftwards while elements are greater than pivot.
		- If they haven't crossed, swap them and repeat.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — input partition arr[low..high]"] --> B["Select random pivot & swap to arr[low]"]
		      B --> C["i = low - 1\nj = high + 1\npivot = arr[low]"]
		      C --> D["i = i + 1"]
		      D --> E{"arr[i] < pivot?"}
		      E -- Yes --> D
		      E -- No --> F["j = j - 1"]
		      F --> G{"arr[j] > pivot?"}
		      G -- Yes --> F
		      G -- No --> H{"i >= j?"}
		      H -- No --> I["Swap arr[i] & arr[j]"]
		      I --> D
		      H -- Yes --> J["Return j (split index)"]
		  ```
	-
	- ## Step-by-Step Trace (Sorting: [10, 80, 30, 90, 40, 50, 70], Pivot = 40)
	  collapsed:: true
		- Let's trace a single Hoare partition pass around pivot = 40:
		- ```
		  Initial Array: [ 10, 80, 30, 90, 40, 50, 70 ]  (Pivot = 40)
		  i starts at -1, j starts at 7
		  
		  - Move i: arr[0]=10 < 40 (OK) → arr[1]=80 > 40 (Stop! i=1)
		  - Move j: arr[6]=70 > 40 (OK) → arr[5]=50 > 40 (OK) → arr[4]=40 (Stop! j=4)
		  - i < j (1 < 4) → Swap arr[1] and arr[4] → [ 10, 40, 30, 90, 80, 50, 70 ]
		  
		  - Move i: arr[2]=30 < 40 (OK) → arr[3]=90 > 40 (Stop! i=3)
		  - Move j: arr[3]=90 > 40 (Stop! j=3)
		  - i < j is false (3 >= 3) → Partition ends. Return split index j = 3.
		  
		  Sub-arrays created: Left [10, 40, 30] and Right [90, 80, 50, 70]
		  ```
-
- # Complexity Analysis
  collapsed:: true
	- | Scenario | Time Complexity | Space Complexity | Trigger Condition |
	  |---|---|---|---|
	  | **Best Case** | **O(n log n)** | **O(log n)** | Recursion tree is perfectly balanced (pivot is median). |
	  | **Average Case**| **O(n log n)** | **O(log n)** | Pivot splits partition reasonably well. |
	  | **Worst Case** | **O(n²)** | **O(n)** | Highly unbalanced partitions (e.g. sorted input with fixed pivot). |
	-
	- ## Mitigating the Worst Case
	  collapsed:: true
		- By using a **randomized pivot**, the chance of choosing a bad pivot at every level of the recursion tree is mathematically negligible. Thus, randomized Quick Sort guarantees $O(n \log n)$ expected time on all inputs.
-
- # Implementation
  collapsed:: true
	- > [!note] In-place Quick Sort using Hoare partitioning and randomized pivot.
		- Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  import random
	  
	  def quick_sort(arr):
	      def _quick_sort(l, h):
	          if l < h:
	              p = _partition(l, h)
	              _quick_sort(l, p)
	              _quick_sort(p + 1, h)
	              
	      def _partition(l, h):
	          # Randomized pivot selection to avoid O(N^2)
	          pivot_idx = random.randint(l, h)
	          arr[l], arr[pivot_idx] = arr[pivot_idx], arr[l]
	          pivot = arr[l]
	          
	          i = l - 1
	          j = h + 1
	          while True:
	              i += 1
	              while arr[i] < pivot:
	                  i += 1
	              j -= 1
	              while arr[j] > pivot:
	                  j -= 1
	              if i >= j:
	                  return j
	              arr[i], arr[j] = arr[j], arr[i]
	  
	      _quick_sort(0, len(arr) - 1)
	      return arr
	  
	  # Example Setup
	  if __name__ == "__main__":
	      data = [10, 80, 30, 90, 40, 50, 70]
	      print("Original:", data)
	      quick_sort(data)
	      print("Sorted:  ", data)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <cstdlib>
	  #include <ctime>
	  
	  int partition(std::vector<int>& arr, int l, int h) {
	      int pivotIdx = l + std::rand() % (h - l + 1);
	      std::swap(arr[l], arr[pivotIdx]);
	      int pivot = arr[l];
	  
	      int i = l - 1;
	      int j = h + 1;
	      while (true) {
	          do { ++i; } while (arr[i] < pivot);
	          do { --j; } while (arr[j] > pivot);
	          if (i >= j) return j;
	          std::swap(arr[i], arr[j]);
	      }
	  }
	  
	  void quickSortHelper(std::vector<int>& arr, int l, int h) {
	      if (l < h) {
	          int p = partition(arr, l, h);
	          quickSortHelper(arr, l, p);
	          quickSortHelper(arr, p + 1, h);
	      }
	  }
	  
	  void quickSort(std::vector<int>& arr) {
	      if (!arr.empty()) {
	          quickSortHelper(arr, 0, arr.size() - 1);
	      }
	  }
	  
	  int main() {
	      std::srand(std::time(0));
	      std::vector<int> data = {10, 80, 30, 90, 40, 50, 70};
	      quickSort(data);
	      std::cout << "Sorted: ";
	      for (int val : data) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function quickSort(arr) {
	      function partition(l, h) {
	          const pivotIdx = l + Math.floor(Math.random() * (h - l + 1));
	          const tempPivot = arr[l];
	          arr[l] = arr[pivotIdx];
	          arr[pivotIdx] = tempPivot;
	          const pivot = arr[l];
	  
	          let i = l - 1;
	          let j = h + 1;
	          while (true) {
	              do { i++; } while (arr[i] < pivot);
	              do { j--; } while (arr[j] > pivot);
	              if (i >= j) return j;
	              
	              const temp = arr[i];
	              arr[i] = arr[j];
	              arr[j] = temp;
	          }
	      }
	  
	      function sort(l, h) {
	          if (l < h) {
	              const p = partition(l, h);
	              sort(l, p);
	              sort(p + 1, h);
	          }
	      }
	  
	      sort(0, arr.length - 1);
	      return arr;
	  }
	  
	  // Example
	  const data = [10, 80, 30, 90, 40, 50, 70];
	  quickSort(data);
	  console.log("Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  import java.util.Random;
	  
	  public class QuickSort {
	      private static final Random rand = new Random();
	  
	      private static int partition(int[] arr, int l, int h) {
	          int pivotIdx = l + rand.nextInt(h - l + 1);
	          int tempPivot = arr[l];
	          arr[l] = arr[pivotIdx];
	          arr[pivotIdx] = tempPivot;
	          int pivot = arr[l];
	  
	          int i = l - 1;
	          int j = h + 1;
	          while (true) {
	              do { i++; } while (arr[i] < pivot);
	              do { j--; } while (arr[j] > pivot);
	              if (i >= j) return j;
	  
	              int temp = arr[i];
	              arr[i] = arr[j];
	              arr[j] = temp;
	          }
	      }
	  
	      private static void sort(int[] arr, int l, int h) {
	          if (l < h) {
	              int p = partition(arr, l, h);
	              sort(arr, l, p);
	              sort(arr, p + 1, h);
	          }
	      }
	  
	      public static void quickSort(int[] arr) {
	          sort(arr, 0, arr.length - 1);
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {10, 80, 30, 90, 40, 50, 70};
	          quickSort(data);
	          System.out.println("Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  #include <time.h>
	  
	  void swap(int* a, int* b) {
	      int temp = *a;
	      *a = *b;
	      *b = temp;
	  }
	  
	  int partition(int arr[], int l, int h) {
	      int pivotIdx = l + rand() % (h - l + 1);
	      swap(&arr[l], &arr[pivotIdx]);
	      int pivot = arr[l];
	  
	      int i = l - 1;
	      int j = h + 1;
	      while (1) {
	          do { i++; } while (arr[i] < pivot);
	          do { j--; } while (arr[j] > pivot);
	          if (i >= j) return j;
	          swap(&arr[i], &arr[j]);
	      }
	  }
	  
	  void quickSortHelper(int arr[], int l, int h) {
	      if (l < h) {
	          int p = partition(arr, l, h);
	          quickSortHelper(arr, l, p);
	          quickSortHelper(arr, p + 1, h);
	      }
	  }
	  
	  void quickSort(int arr[], int n) {
	      quickSortHelper(arr, 0, n - 1);
	  }
	  
	  int main() {
	      srand(time(NULL));
	      int data[] = {10, 80, 30, 90, 40, 50, 70};
	      int n = sizeof(data) / sizeof(data[0]);
	      quickSort(data, n);
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
- # Alternative Variant (Iterative Quick Sort)
  collapsed:: true
	- > [!tip] Iterative Quick Sort (Custom Stack)
	  > The iterative variant of Quick Sort uses an explicit, custom stack structure to store subarray boundaries `[low, high]` instead of relying on recursive compiler stack frames.
	  > This prevents runtime **Stack Overflow** bugs for massive inputs while maintaining the in-place sorting properties and randomized Hoare partition speeds.
	-
	- :::code-tabs
	  
	  ```python
	  import random
	  
	  def quick_sort_iterative(arr):
	      n = len(arr)
	      if n <= 1:
	          return arr
	      
	      # Custom stack for subarray boundaries (each entry is (l, h))
	      stack = [(0, n - 1)]
	      while stack:
	          l, h = stack.pop()
	          if l < h:
	              # Randomized pivot selection
	              pivot_idx = random.randint(l, h)
	              arr[l], arr[pivot_idx] = arr[pivot_idx], arr[l]
	              pivot = arr[l]
	              
	              # Hoare partition
	              i = l - 1
	              j = h + 1
	              while True:
	                  i += 1
	                  while arr[i] < pivot:
	                      i += 1
	                  j -= 1
	                  while arr[j] > pivot:
	                      j -= 1
	                  if i >= j:
	                      p = j
	                      break
	                  arr[i], arr[j] = arr[j], arr[i]
	                  
	              # Push partitions
	              if p > l:
	                  stack.append((l, p))
	              if p + 1 < h:
	                  stack.append((p + 1, h))
	      return arr
	  
	  if __name__ == "__main__":
	      data = [10, 80, 30, 90, 40, 50, 70]
	      print("Iterative Sorted:", quick_sort_iterative(data))
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <stack>
	  #include <cstdlib>
	  #include <ctime>
	  
	  int partitionHoare(std::vector<int>& arr, int l, int h) {
	      int pivotIdx = l + std::rand() % (h - l + 1);
	      std::swap(arr[l], arr[pivotIdx]);
	      int pivot = arr[l];
	      int i = l - 1;
	      int j = h + 1;
	      while (true) {
	          do { ++i; } while (arr[i] < pivot);
	          do { --j; } while (arr[j] > pivot);
	          if (i >= j) return j;
	          std::swap(arr[i], arr[j]);
	      }
	  }
	  
	  void quickSortIterative(std::vector<int>& arr) {
	      int n = arr.size();
	      if (n <= 1) return;
	      
	      std::stack<std::pair<int, int>> st;
	      st.push({0, n - 1});
	      
	      while (!st.empty()) {
	          auto range = st.top();
	          st.pop();
	          int l = range.first;
	          int h = range.second;
	          
	          if (l < h) {
	              int p = partitionHoare(arr, l, h);
	              if (p > l) {
	                  st.push({l, p});
	              }
	              if (p + 1 < h) {
	                  st.push({p + 1, h});
	              }
	          }
	      }
	  }
	  
	  int main() {
	      std::srand(std::time(0));
	      std::vector<int> data = {10, 80, 30, 90, 40, 50, 70};
	      quickSortIterative(data);
	      std::cout << "Iterative Sorted: ";
	      for (int val : data) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function quickSortIterative(arr) {
	      const n = arr.length;
	      if (n <= 1) return arr;
	      
	      const stack = [];
	      stack.push([0, n - 1]);
	      
	      while (stack.length > 0) {
	          const [l, h] = stack.pop();
	          
	          if (l < h) {
	              const pivotIdx = l + Math.floor(Math.random() * (h - l + 1));
	              const tempPivot = arr[l];
	              arr[l] = arr[pivotIdx];
	              arr[pivotIdx] = tempPivot;
	              const pivot = arr[l];
	              
	              let i = l - 1;
	              let j = h + 1;
	              let p;
	              while (true) {
	                  do { i++; } while (arr[i] < pivot);
	                  do { j--; } while (arr[j] > pivot);
	                  if (i >= j) {
	                      p = j;
	                      break;
	                  }
	                  const temp = arr[i];
	                  arr[i] = arr[j];
	                  arr[j] = temp;
	              }
	              
	              if (p > l) {
	                  stack.push([l, p]);
	              }
	              if (p + 1 < h) {
	                  stack.push([p + 1, h]);
	              }
	          }
	      }
	      return arr;
	  }
	  
	  const data = [10, 80, 30, 90, 40, 50, 70];
	  quickSortIterative(data);
	  console.log("Iterative Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.Stack;
	  import java.util.Random;
	  import java.util.Arrays;
	  
	  public class QuickSortIterative {
	      private static final Random rand = new Random();
	  
	      private static int partition(int[] arr, int l, int h) {
	          int pivotIdx = l + rand.nextInt(h - l + 1);
	          int tempPivot = arr[l];
	          arr[l] = arr[pivotIdx];
	          arr[pivotIdx] = tempPivot;
	          int pivot = arr[l];
	          
	          int i = l - 1;
	          int j = h + 1;
	          while (true) {
	              do { i++; } while (arr[i] < pivot);
	              do { j--; } while (arr[j] > pivot);
	              if (i >= j) return j;
	  
	              int temp = arr[i];
	              arr[i] = arr[j];
	              arr[j] = temp;
	          }
	      }
	  
	      public static void quickSortIterative(int[] arr) {
	          int n = arr.length;
	          if (n <= 1) return;
	          
	          Stack<int[]> stack = new Stack<>();
	          stack.push(new int[]{0, n - 1});
	          
	          while (!stack.isEmpty()) {
	              int[] range = stack.pop();
	              int l = range[0];
	              int h = range[1];
	              
	              if (l < h) {
	                  int p = partition(arr, l, h);
	                  if (p > l) {
	                      stack.push(new int[]{l, p});
	                  }
	                  if (p + 1 < h) {
	                      stack.push(new int[]{p + 1, h});
	                  }
	              }
	          }
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {10, 80, 30, 90, 40, 50, 70};
	          quickSortIterative(data);
	          System.out.println("Iterative Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  #include <time.h>
	  
	  void swap_it(int* a, int* b) {
	      int temp = *a;
	      *a = *b;
	      *b = temp;
	  }
	  
	  int partitionHoareIterative(int arr[], int l, int h) {
	      int pivotIdx = l + rand() % (h - l + 1);
	      swap_it(&arr[l], &arr[pivotIdx]);
	      int pivot = arr[l];
	      
	      int i = l - 1;
	      int j = h + 1;
	      while (1) {
	          do { i++; } while (arr[i] < pivot);
	          do { j--; } while (arr[j] > pivot);
	          if (i >= j) return j;
	          swap_it(&arr[i], &arr[j]);
	      }
	  }
	  
	  void quickSortIterative(int arr[], int n) {
	      if (n <= 1) return;
	      
	      int* stack = (int*)malloc(n * sizeof(int));
	      int top = -1;
	      
	      stack[++top] = 0;
	      stack[++top] = n - 1;
	      
	      while (top >= 0) {
	          int h = stack[top--];
	          int l = stack[top--];
	          
	          if (l < h) {
	              int p = partitionHoareIterative(arr, l, h);
	              if (p > l) {
	                  stack[++top] = l;
	                  stack[++top] = p;
	              }
	              if (p + 1 < h) {
	                  stack[++top] = p + 1;
	                  stack[++top] = h;
	              }
	          }
	      }
	      free(stack);
	  }
	  
	  int main() {
	      srand(time(NULL));
	      int data[] = {10, 80, 30, 90, 40, 50, 70};
	      int n = sizeof(data) / sizeof(data[0]);
	      quickSortIterative(data, n);
	      printf("Iterative Sorted: ");
	      for (int i = 0; i < n; i++) {
	          printf("%d ", data[i]);
	      }
	      printf("\n");
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Quick Sort
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Is stability\nrequired?"}
	      Q -- Yes --> R1["❌ Use Merge Sort\n(Quick Sort is unstable)"]
	      Q -- No --> S1{"Is memory/extra space\nlimited?"}
	      S1 -- Yes --> S2{"Are you worried about\nO(n^2) worst-case time\nor stack overflow?"}
	      S2 -- Yes --> R2["❌ Use Heap Sort\n(Guaranteed O(n log n) and O(1) space)"]
	      S2 -- No --> R3["✅ Use Quick Sort\n(Fastest general-purpose sort in-place)"]
	      S1 -- No --> R3
	  ```
	-
	- ## ✅ Use Quick Sort When
		- You require the fastest practical general-purpose **in-place** sorting on arrays.
		- Stability is not a constraint.
		- Cache locality is important, as Quick Sort traverses memory sequentially in partitions, matching hardware caches beautifully.
		- Stacking depth overhead ($O(\log n)$) is acceptable.
	-
	- ## ❌ Avoid Quick Sort When
		- You require a **stable** sort (use Merge Sort or Insertion Sort instead).
		- You require guaranteed $O(n \log n)$ bounds under all conditions (e.g., real-time systems with hard latency requirements). Use Heap Sort instead.
		- Sorting linked lists, since lists do not support random indexing (needed for partitioning).
-
- # Key Takeaways
  collapsed:: true
	- **Pivot Partitioning** — selects a pivot and groups elements such that lower values are on the left and higher values are on the right.
	- **Unstable** — element exchanges across partition indices scramble the order of equal elements.
	- **In-place** — modifies the array directly without auxiliary tables, though it consumes $O(\log n)$ memory for recursive stack frames.
	- **Highly Efficient** — average case complexity of $O(n \log n)$ with low constant factors, usually outpacing Heap and Merge Sort.
	- **Worst-case Risk** — fixed pivot choices degrade to $O(n^2)$ on sorted inputs; random pivot selection mitigates this risk.
	- **Iterative Alternative** — iterative variants manage subarray bounds in a manual stack, avoiding recursion stack overflow.
	- **Hybrid Core** — serves as the main engine for modern library sorters like Introsort (used in C++ `std::sort`).
-
- # More Learn
  collapsed:: true
	- ## C++ standard library std::sort
		- In standard runtimes (e.g. libstdc++), the function `std::sort` uses **Introsort**, which starts with Quick Sort, switches to **Heap Sort** if recursion depth exceeds a threshold ($2 \log N$), and switches to **Insertion Sort** if the size of partition is very small ($< 16$ elements).
	- ## GitHub & Webs
		- [GeeksforGeeks -> Quick Sort](https://www.geeksforgeeks.org/quick-sort/)
		- [TheAlgorithms – Quick Sort (Python)](https://github.com/TheAlgorithms/Python/blob/master/sorts/quick_sort.py)