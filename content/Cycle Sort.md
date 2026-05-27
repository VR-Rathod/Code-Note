---
seoTitle: Cycle Sort Algorithm – Optimal Writes, Complexity, and Code
description: "In-depth guide to Cycle Sort. Explains cycle detection, why it is optimal for write-sensitive hardware (EEPROM/Flash), time/space complexity analysis, and complete code implementations in five languages."
keywords: "cycle sort, cyclesort, minimum writes, in-place sort, comparison sort, write-optimal, time complexity, space complexity, EEPROM sorting, VR-Rathod, Code-Note, Vaibhav Rathod"
---

> [!info] What is Cycle Sort?
> **Cycle Sort** is an in-place, comparison-based sorting algorithm. It is theoretically optimal in terms of the total number of writes to the original array, performing at most $O(n)$ writes in the worst case. This unique property makes it highly valuable for sorting systems where writing to memory is exceptionally slow or wears out the hardware (e.g., Flash memory/EEPROM).

- # Explanation
  collapsed:: true
	- Cycle Sort is based on the idea that the permutation to be sorted can be decomposed into disjoint cycles.
	-
	- ## Optimal Memory Writes
	  collapsed:: true
		- In other in-place sorting algorithms like **Quick Sort** or **Selection Sort**, elements may be written back to the array multiple times.
		- In Cycle Sort, each element is written **either zero or one time** directly to its final, correct position. This minimizes memory write wear.
	-
	- ## Core Properties
	  collapsed:: true
		- **Stability:** **Not Stable** (Swapping elements to their final position across the array can scramble identical elements).
		- **In-Place:** **Yes** ($O(1)$ auxiliary space).
		- **Adaptability:** **No** (It always computes element cycles, running in $O(n^2)$ time even on pre-sorted arrays).
-
- # How It Works
  collapsed:: true
	- ## The Process Flow
	  collapsed:: true
		- 1. Decompose the array into cycles. For each `cycle_start` from `0` to `n - 2`:
		- 2. Find the correct position (`pos`) of the element at `cycle_start` by counting how many elements are smaller than it in the rest of the array.
		- 3. If the element is already in the correct place, skip it.
		- 4. Otherwise, find where to put it (skipping duplicate values if any), swap it, and increment the write counter.
		- 5. Continue cycling: track the swapped element and find its correct position, repeating the swap until the element belonging to `cycle_start` is placed back at `cycle_start`.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — Input Array of size N"] --> B["cycle_start = 0"]
		      B --> C{"cycle_start < N - 1?"}
		      C -- Yes --> D["item = arr[cycle_start]; pos = cycle_start"]
		      D --> E["For i = cycle_start + 1 to N-1: if arr[i] < item: pos++"]
		      E --> F{"pos == cycle_start?"}
		      F -- Yes --> G["cycle_start++"]
		      G --> C
		      F -- No --> H["While item == arr[pos]: pos++\nSwap item and arr[pos]; writes++"]
		      H --> I{"pos != cycle_start?"}
		      I -- Yes --> K["pos = cycle_start\nFor i = cycle_start + 1 to N-1: if arr[i] < item: pos++\nWhile item == arr[pos]: pos++\nSwap item and arr[pos]; writes++"]
		      K --> I
		      I -- No --> G
		      C -- No --> L["End — Array Sorted"]
		      style L fill:#22c55e,stroke:#15803d,stroke-width:2px,color:#fff
		  ```
	-
	- ## Step-by-Step Trace (Sorting: [5, 2, 9, 1] - Track Writes)
	  collapsed:: true
		- Initial array: `[5, 2, 9, 1]` ($N = 4$)
		-
		- ### Pass 1 (cycle_start = 0):
		  - `item = 5`, `pos = 0`.
		  - Count smaller elements: `2` and `1` are smaller than `5` $\rightarrow$ `pos` becomes $2$.
		  - `pos != cycle_start` (2 != 0). Swap `5` with `arr[2]` (`9`).
		  - Array becomes: `[5, 2, 5, 1]`, `item` becomes `9`. (Write count = 1).
		  -
		  - **Cycle continuation (pos != cycle_start (2 != 0)):**
		    - Reset `pos = 0`. Count elements smaller than `9` in array: `2`, `5`, `1` are smaller $\rightarrow$ `pos` becomes $3$.
		    - Swap `9` with `arr[3]` (`1`).
		    - Array becomes: `[5, 2, 5, 9]`, `item` becomes `1`. (Write count = 2).
		  -
		  - **Cycle continuation (pos != cycle_start (3 != 0)):**
		    - Reset `pos = 0`. Count elements smaller than `1` in array: None $\rightarrow$ `pos` remains $0$.
		    - Swap `1` with `arr[0]` (`5`).
		    - Array becomes: `[1, 2, 5, 9]`, `item` becomes `5`. (Write count = 3).
		    - Since `pos == cycle_start` (0 == 0), this cycle terminates.
		-
		- ### Pass 2 (cycle_start = 1):
		  - `item = arr[1] = 2`.
		  - Count smaller elements in index range $[2, 3]$: None $\rightarrow$ `pos` remains $1$.
		  - `pos == cycle_start` $\rightarrow$ Already in correct position.
		-
		- ### Pass 3 (cycle_start = 2):
		  - `item = arr[2] = 5`.
		  - Count smaller elements in index range $[3, 3]$: None $\rightarrow$ `pos` remains $2$.
		  - `pos == cycle_start` $\rightarrow$ Already in correct position.
		-
		- Final Sorted Array: `[1, 2, 5, 9]` with exactly 3 writes.
-
- # Complexity Analysis
  collapsed:: true
	- | Scenario | Time Complexity | Space Complexity | Trigger Condition |
	  |---|---|---|---|
	  | **Best Case** | **O(n²)** | **O(1)** | Constant time comparison overhead. Even if pre-sorted, it checks all cycles. |
	  | **Average Case** | **O(n²)** | **O(1)** | Standard execution for any input. |
	  | **Worst Case** | **O(n²)** | **O(1)** | Standard execution for any input. |
	-
	- ## Why Cycle Sort is chosen despite $O(n^2)$ complexity
	  collapsed:: true
		- Although algorithms like Merge Sort ($O(n \log n)$) or Quick Sort are faster in CPU execution, they perform far more memory write operations. Cycle Sort guarantees at most $n-1$ writes in the best case (when already sorted, 0 writes) and at most $2n-1$ writes in the absolute worst case.
-
- # Implementation
  collapsed:: true
	- > [!note] In-place Cycle Sort returning total array writes.
	  - Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def cycle_sort(arr):
	      n = len(arr)
	      writes = 0
	      
	      for cycle_start in range(0, n - 1):
	          item = arr[cycle_start]
	          pos = cycle_start
	          
	          # Find correct position for current element
	          for i in range(cycle_start + 1, n):
	              if arr[i] < item:
	                  pos += 1
	                  
	          # If element is already in correct position, skip
	          if pos == cycle_start:
	              continue
	              
	          # Skip duplicates
	          while item == arr[pos]:
	              pos += 1
	              
	          # Swap element to its correct position
	          arr[pos], item = item, arr[pos]
	          writes += 1
	          
	          # Rotate the rest of the cycle
	          while pos != cycle_start:
	              pos = cycle_start
	              for i in range(cycle_start + 1, n):
	                  if arr[i] < item:
	                      pos += 1
	                      
	              while item == arr[pos]:
	                  pos += 1
	                  
	              arr[pos], item = item, arr[pos]
	              writes += 1
	              
	      return arr
	  
	  if __name__ == "__main__":
	      data = [5, 2, 9, 1]
	      print("Original:", data)
	      cycle_sort(data)
	      print("Sorted:  ", data)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  int cycleSort(std::vector<int>& arr) {
	      int n = arr.size();
	      int writes = 0;
	  
	      for (int cycleStart = 0; cycleStart < n - 1; ++cycleStart) {
	          int item = arr[cycleStart];
	          int pos = cycleStart;
	  
	          for (int i = cycleStart + 1; i < n; ++i) {
	              if (arr[i] < item) {
	                  pos++;
	              }
	          }
	  
	          if (pos == cycleStart) {
	              continue;
	          }
	  
	          while (item == arr[pos]) {
	              pos++;
	          }
	  
	          std::swap(arr[pos], item);
	          writes++;
  
	          while (pos != cycleStart) {
	              pos = cycleStart;
	              for (int i = cycleStart + 1; i < n; ++i) {
	                  if (arr[i] < item) {
	                      pos++;
	                  }
	              }
	  
	              while (item == arr[pos]) {
	                  pos++;
	              }
	  
	              std::swap(arr[pos], item);
	              writes++;
	          }
	      }
	      return writes;
	  }
	  
	  int main() {
	      std::vector<int> data = {5, 2, 9, 1};
	      int writes = cycleSort(data);
	      std::cout << "Sorted: ";
	      for (int val : data) std::cout << val << " ";
	      std::cout << "\nWrites performed: " << writes << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function cycleSort(arr) {
	      const n = arr.length;
	      let writes = 0;
	  
	      for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
	          let item = arr[cycleStart];
	          let pos = cycleStart;
	  
	          for (let i = cycleStart + 1; i < n; i++) {
	              if (arr[i] < item) {
	                  pos++;
	              }
	          }
	  
	          if (pos === cycleStart) {
	              continue;
	          }
	  
	          while (item === arr[pos]) {
	              pos++;
	          }
	  
	          // Swap
	          const temp = arr[pos];
	          arr[pos] = item;
	          item = temp;
	          writes++;
	  
	          while (pos !== cycleStart) {
	              pos = cycleStart;
	              for (let i = cycleStart + 1; i < n; i++) {
	                  if (arr[i] < item) {
	                      pos++;
	                  }
	              }
	  
	              while (item === arr[pos]) {
	                  pos++;
	              }
	  
	              // Swap
	              const temp2 = arr[pos];
	              arr[pos] = item;
	              item = temp2;
	              writes++;
	          }
	      }
	      return arr;
	  }
	  
	  // Example
	  const data = [5, 2, 9, 1];
	  cycleSort(data);
	  console.log("Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  public class CycleSort {
	      public static int cycleSort(int[] arr) {
	          int n = arr.length;
	          int writes = 0;
	  
	          for (int cycleStart = 0; cycleStart < n - 1; cycleStart++) {
	              int item = arr[cycleStart];
	              int pos = cycleStart;
	  
	              for (int i = cycleStart + 1; i < n; i++) {
	                  if (arr[i] < item) {
	                      pos++;
	                  }
	              }
	  
	              if (pos == cycleStart) {
	                  continue;
	              }
	  
	              while (item == arr[pos]) {
	                  pos++;
	              }
	  
	              int temp = arr[pos];
	              arr[pos] = item;
	              item = temp;
	              writes++;
	  
	              while (pos != cycleStart) {
	                  pos = cycleStart;
	                  for (int i = cycleStart + 1; i < n; i++) {
	                      if (arr[i] < item) {
	                          pos++;
	                      }
	                  }
	  
	                  while (item == arr[pos]) {
	                      pos++;
	                  }
	  
	                  temp = arr[pos];
	                  arr[pos] = item;
	                  item = temp;
	                  writes++;
	              }
	          }
	          return writes;
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {5, 2, 9, 1};
	          int writes = cycleSort(data);
	          System.out.println("Sorted: " + Arrays.toString(data) + ", Writes: " + writes);
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  
	  int cycleSort(int arr[], int n) {
	      int writes = 0;
	  
	      for (int cycle_start = 0; cycle_start < n - 1; cycle_start++) {
	          int item = arr[cycle_start];
	          int pos = cycle_start;
	  
	          for (int i = cycle_start + 1; i < n; i++) {
	              if (arr[i] < item) {
	                  pos++;
	              }
	          }
	  
	          if (pos == cycle_start) {
	              continue;
	          }
	  
	          while (item == arr[pos]) {
	              pos++;
	          }
	  
	          int temp = arr[pos];
	          arr[pos] = item;
	          item = temp;
	          writes++;
	  
	          while (pos != cycle_start) {
	              pos = cycle_start;
	              for (int i = cycle_start + 1; i < n; i++) {
	                  if (arr[i] < item) {
	                      pos++;
	                  }
	              }
	  
	              while (item == arr[pos]) {
	                  pos++;
	              }
	  
	              temp = arr[pos];
	              arr[pos] = item;
	              item = temp;
	              writes++;
	          }
	      }
	      return writes;
	  }
	  
	  int main() {
	      int data[] = {5, 2, 9, 1};
	      int n = sizeof(data) / sizeof(data[0]);
	      int writes = cycleSort(data, n);
	      printf("Sorted: ");
	      for (int i = 0; i < n; i++) {
	          printf("%d ", data[i]);
	      }
	      printf("\nWrites: %d\n", writes);
	      return 0;
	  }
	  ```
	  
	  :::
-
- # Alternative Variant (Minimum Swaps to Sort)
  collapsed:: true
	- > [!tip] Counting Cycles to Minimize Swaps
	  > While the standard Cycle Sort algorithm sorts the array in-place, we can extract the cycle-finding logic to calculate the **minimum number of swaps** required to sort any array.
	  > This is highly useful for graph-based permutation problems and runs in $O(n \log n)$ time due to the initial sort, requiring $O(n)$ auxiliary space to track visited positions.
	-
	- :::code-tabs
	  
	  ```python
	  def min_swaps_to_sort(arr):
	      n = len(arr)
	      # Pair each element with its original index
	      arr_pos = [*enumerate(arr)]
	      # Sort based on element values
	      arr_pos.sort(key=lambda it: it[1])
	      
	      visited = [False] * n
	      swaps = 0
	      
	      for i in range(n):
	          # If already visited or already in the correct sorted position, skip
	          if visited[i] or arr_pos[i][0] == i:
	              continue
	              
	          # Find the size of the cycle
	          cycle_size = 0
	          j = i
	          while not visited[j]:
	              visited[j] = True
	              j = arr_pos[j][0]
	              cycle_size += 1
	              
	          if cycle_size > 0:
	              swaps += (cycle_size - 1)
	              
	      return swaps
	  
	  if __name__ == "__main__":
	      data = [5, 2, 9, 1]
	      print("Min swaps to sort:", min_swaps_to_sort(data))
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  int minSwaps(std::vector<int>& arr) {
	      int n = arr.size();
	      std::vector<std::pair<int, int>> arrPos(n);
	      for (int i = 0; i < n; ++i) {
	          arrPos[i] = {arr[i], i};
	      }
	      
	      std::sort(arrPos.begin(), arrPos.end());
	      std::vector<bool> visited(n, false);
	      int swaps = 0;
	      
	      for (int i = 0; i < n; ++i) {
	          if (visited[i] || arrPos[i].second == i) {
	              continue;
	          }
	          
	          int cycle_size = 0;
	          int j = i;
	          while (!visited[j]) {
	              visited[j] = true;
	              j = arrPos[j].second;
	              cycle_size++;
	          }
	          
	          if (cycle_size > 0) {
	              swaps += (cycle_size - 1);
	          }
	      }
	      return swaps;
	  }
	  
	  int main() {
	      std::vector<int> data = {5, 2, 9, 1};
	      std::cout << "Min swaps to sort: " << minSwaps(data) << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function minSwaps(arr) {
	      const n = arr.length;
	      const arrPos = arr.map((val, idx) => ({ val, idx }));
	      arrPos.sort((a, b) => a.val - b.val);
	      
	      const visited = new Array(n).fill(false);
	      let swaps = 0;
	      
	      for (let i = 0; i < n; i++) {
	          if (visited[i] || arrPos[i].idx === i) {
	              continue;
	          }
	          
	          let cycle_size = 0;
	          let j = i;
	          while (!visited[j]) {
	              visited[j] = true;
	              j = arrPos[j].idx;
	              cycle_size++;
	          }
	          
	          if (cycle_size > 0) {
	              swaps += (cycle_size - 1);
	          }
	      }
	      return swaps;
	  }
	  
	  const data = [5, 2, 9, 1];
	  console.log("Min swaps to sort:", minSwaps(data));
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  import java.util.Comparator;
	  
	  public class CycleSortMinSwaps {
	      static class Pair {
	          int value;
	          int index;
	          Pair(int value, int index) {
	              this.value = value;
	              this.index = index;
	          }
	      }
	  
	      public static int minSwaps(int[] arr) {
	          int n = arr.length;
	          Pair[] arrPos = new Pair[n];
	          for (int i = 0; i < n; i++) {
	              arrPos[i] = new Pair(arr[i], i);
	          }
	          
	          Arrays.sort(arrPos, Comparator.comparingInt(a -> a.value));
	          boolean[] visited = new boolean[n];
	          int swaps = 0;
	          
	          for (int i = 0; i < n; i++) {
	              if (visited[i] || arrPos[i].index == i) {
	                  continue;
	              }
	              
	              int cycle_size = 0;
	              int j = i;
	              while (!visited[j]) {
	                  visited[j] = true;
	                  j = arrPos[j].index;
	                  cycle_size++;
	              }
	              
	              if (cycle_size > 0) {
	                  swaps += (cycle_size - 1);
	              }
	          }
	          return swaps;
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {5, 2, 9, 1};
	          System.out.println("Min swaps to sort: " + minSwaps(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  
	  struct Pair {
	      int value;
	      int index;
	  };
	  
	  int comparePairs(const void* a, const void* b) {
	      return ((struct Pair*)a)->value - ((struct Pair*)b)->value;
	  }
	  
	  int minSwaps(int arr[], int n) {
	      struct Pair* arrPos = (struct Pair*)malloc(n * sizeof(struct Pair));
	      for (int i = 0; i < n; i++) {
	          arrPos[i].value = arr[i];
	          arrPos[i].index = i;
	      }
	      
	      qsort(arrPos, n, sizeof(struct Pair), comparePairs);
	      int* visited = (int*)calloc(n, sizeof(int));
	      int swaps = 0;
	      
	      for (int i = 0; i < n; i++) {
	          if (visited[i] || arrPos[i].index == i) {
	              continue;
	          }
	          
	          int cycle_size = 0;
	          int j = i;
	          while (!visited[j]) {
	              visited[j] = 1;
	              j = arrPos[j].index;
	              cycle_size++;
	          }
	          
	          if (cycle_size > 0) {
	              swaps += (cycle_size - 1);
	          }
	      }
	      
	      free(arrPos);
	      free(visited);
	      return swaps;
	  }
	  
	  int main() {
	      int data[] = {5, 2, 9, 1};
	      int n = sizeof(data) / sizeof(data[0]);
	      printf("Min swaps to sort: %d\n", minSwaps(data, n));
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Cycle Sort
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Are memory writes\nextremely costly/restricted\n(e.g., Flash/EEPROM)?"}
	      Q -- No --> R1["❌ Use Quick Sort / Merge Sort\n(Cycle Sort is O(n^2))"]
	      Q -- Yes --> S1{"Is auxiliary space\nseverely limited\nto O(1)?"}
	      S1 -- No --> R2["❌ Cycle Sort is fine\nbut standard sorts preferred"]
	      S1 -- Yes --> S2{"Do you need a\nstable sort?"}
	      S2 -- Yes --> R3["❌ Use Stable sort\n(Cycle Sort is unstable)"]
	      S2 -- No --> R4["✅ Use Cycle Sort\n(Theoretically optimal writes, in-place)"]
	  ```
	-
	- ## ✅ Use Cycle Sort When
		- Memory write operations are extremely slow or physically degrade the storage medium (such as **EEPROM or Flash memory**).
		- You require an **in-place** sorting mechanism with **O(1) auxiliary space** overhead.
		- Minimizing CPU/memory write cycles is the absolute primary constraint of the target system.
	-
	- ## ❌ Avoid Cycle Sort When
		- You require a **stable** sorting algorithm (since it swaps elements across arbitrary cycles).
		- Sorting large datasets where CPU time is critical, because Cycle Sort runs in $O(n^2)$ time even on sorted arrays.
		- Memory writes are cheap and CPU cycles are the primary bottleneck (use $O(n \log n)$ algorithms instead).
-
- # Key Takeaways
  collapsed:: true
	- **Optimal Writes** — performs at most $2n - 1$ writes in the worst case (and 0 in the best case), which is theoretically optimal.
	- **In-place** — operates directly on the input array requiring only $O(1)$ auxiliary memory.
	- **Unstable** — element displacements along disjoint permutation cycles destroy relative order of duplicates.
	- **O(n²) Complexity** — requires quadratic time in best, worst, and average cases due to counting smaller elements for each position.
	- **Permutation Cycles** — maps sorting directly to the concept of decomposing a mathematical permutation into disjoint cycles.
	- **EEPROM/Flash Friendly** — specifically chosen for microcontroller and embedded setups where write endurance is limited.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Cycle Sort](https://www.geeksforgeeks.org/cycle-sort/)
		- [TheAlgorithms – Cycle Sort (Python)](https://github.com/TheAlgorithms/Python/blob/master/sorts/cycle_sort.py)