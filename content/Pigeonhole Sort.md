---
seoTitle: Pigeonhole Sort Algorithm – Stability, Key Mapping, and Complexity
description: "In-depth guide to Pigeonhole Sort. Details structural list-based mapping for stability, comparison with Counting Sort, time/space complexity analysis, and complete code implementations in five languages."
keywords: "pigeonhole sort, pigeonholesort, non-comparison sort, stable sort, key mapping, counting sort comparison, time complexity, space complexity, VR-Rathod, Code-Note, Vaibhav Rathod"
---

> [!info] What is Pigeonhole Sort?
> **Pigeonhole Sort** is a non-comparison sorting algorithm that is highly efficient when the range of key values ($Range = Max - Min + 1$) is approximately the same as the number of elements ($N$). Unlike basic Counting Sort, which only tracks frequency counts, Pigeonhole Sort actually moves items into a list-of-lists structure ("holes"), making it naturally **stable** and easily extensible to sorting key-value pairs or structured data.

- # Explanation
  collapsed:: true
	- Pigeonhole Sort is an application of the mathematical **Pigeonhole Principle**. It maps each value to its corresponding bucket (or "pigeonhole").
	-
	- ## Pigeonhole Sort vs. Counting Sort
	  collapsed:: true
		- While both algorithms share a time complexity of $O(n + Range)$, they differ in execution:
		  - **Counting Sort** accumulates frequencies and calculates index offsets. The auxiliary array contains counts.
		  - **Pigeonhole Sort** maintains lists in each hole. Items are physically appended to their corresponding hole list. This preserves duplicate item stability directly and allows sorting structs/objects with aux data.
	-
	- ## Core Properties
	  collapsed:: true
		- **Stability:** **Stable** (Yes, when using list-append mapping to preserve arrival order).
		- **In-Place:** **No**. Requires dynamic arrays or linked lists for each pigeonhole.
		- **Adaptability:** **No** (Always runs in $O(n + Range)$ regardless of input order).
-
- # How It Works
  collapsed:: true
	- ## The Process Flow
	  collapsed:: true
		- 1. Find the minimum (`min_val`) and maximum (`max_val`) elements in the array to compute $Range = max\_val - min\_val + 1$.
		- 2. Initialize an array of $Range$ empty lists (pigeonholes).
		- 3. Iterate through the input array and append each element `x` to `holes[x - min_val]`.
		- 4. Iterate through the holes in order, copying elements back to the original array.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — Input Array of size N"] --> B["Find min_val and max_val"]
		      B --> C["Range = max_val - min_val + 1"]
		      C --> D["Initialize 'Range' empty lists (holes)"]
		      D --> E["For each x in array: append x to holes[x - min_val]"]
		      E --> F["Iterate holes and copy elements back to original array"]
		      F --> G["End — Array Sorted"]
		      style G fill:#22c55e,stroke:#15803d,stroke-width:2px,color:#fff
		  ```
	-
	- ## Step-by-Step Trace (Sorting: [8, 3, 2, 7, 4, 6, 8])
	  collapsed:: true
		- Input Array: `[8, 3, 2, 7, 4, 6, 8]`
		- Minimum is $2$, Maximum is $8$. Range is $8 - 2 + 1 = 7$ pigeonholes.
		-
		- | Element | Target Hole Index (Val - 2) | Assigned Hole | Resulting Holes Array |
		  |---|---|---|---|
		  | **8** | 6 | Hole 6 | `[[], [], [], [], [], [], [8]]` |
		  | **3** | 1 | Hole 1 | `[[], [3], [], [], [], [], [8]]` |
		  | **2** | 0 | Hole 0 | `[[2], [3], [], [], [], [], [8]]` |
		  | **7** | 5 | Hole 5 | `[[2], [3], [], [], [], [7], [8]]` |
		  | **4** | 2 | Hole 2 | `[[2], [3], [4], [], [], [7], [8]]` |
		  | **6** | 4 | Hole 4 | `[[2], [3], [4], [], [6], [7], [8]]` |
		  | **8** | 6 | Hole 6 | `[[2], [3], [4], [], [6], [7], [8, 8]]` (Appended) |
		-
		- **Rebuilding Array from Holes:**
		  - Read Hole 0 `[2]` $\rightarrow$ `[2]`
		  - Read Hole 1 `[3]` $\rightarrow$ `[2, 3]`
		  - Read Hole 2 `[4]` $\rightarrow$ `[2, 3, 4]`
		  - Read Hole 3 `[]`
		  - Read Hole 4 `[6]` $\rightarrow$ `[2, 3, 4, 6]`
		  - Read Hole 5 `[7]` $\rightarrow$ `[2, 3, 4, 6, 7]`
		  - Read Hole 6 `[8, 8]` $\rightarrow$ `[2, 3, 4, 6, 7, 8, 8]` (Stability maintained)
-
- # Complexity Analysis
  collapsed:: true
	- | Scenario | Time Complexity | Space Complexity | Trigger Condition |
	  |---|---|---|---|
	  | **Best Case** | **O(n + Range)** | **O(n + Range)** | Uniformly runs for all configurations. |
	  | **Average Case** | **O(n + Range)** | **O(n + Range)** | Uniformly runs for all configurations. |
	  | **Worst Case** | **O(n + Range)** | **O(n + Range)** | Uniformly runs for all configurations. |
	-
	- ## Limitations of Pigeonhole Sort
	  collapsed:: true
		- If the range of elements is extremely large compared to $N$ (e.g. `[1, 1000000000]`), creating the pigeonhole array requires an excessive amount of memory, making Pigeonhole Sort impractical. In such scenarios, comparison sorting ($O(n \log n)$) or Radix Sort is preferred.
-
- # Implementation
  collapsed:: true
	- > [!note] Stable Pigeonhole Sort using list-based buckets.
	  - Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def pigeonhole_sort(arr):
	      if not arr:
	          return arr
	      
	      min_val = min(arr)
	      max_val = max(arr)
	      size = max_val - min_val + 1
	      
	      # Create pigeonholes as empty lists to ensure stability
	      holes = [[] for _ in range(size)]
	      
	      # Map elements to pigeonholes
	      for x in arr:
	          holes[x - min_val].append(x)
	          
	      # Collect elements from pigeonholes back to original list
	      idx = 0
	      for h in holes:
	          for x in h:
	              arr[idx] = x
	              idx += 1
	      return arr
	  
	  if __name__ == "__main__":
	      data = [8, 3, 2, 7, 4, 6, 8]
	      print("Original:", data)
	      pigeonhole_sort(data)
	      print("Sorted:  ", data)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  void pigeonholeSort(std::vector<int>& arr) {
	      if (arr.empty()) return;
	  
	      int minVal = *std::min_element(arr.begin(), arr.end());
	      int maxVal = *std::max_element(arr.begin(), arr.end());
	      int range = maxVal - minVal + 1;
	  
	      // Vector of vectors to maintain stable list mapping
	      std::vector<std::vector<int>> holes(range);
	  
	      for (int x : arr) {
	          holes[x - minVal].push_back(x);
	      }
  
	      int idx = 0;
	      for (int i = 0; i < range; ++i) {
	          for (int x : holes[i]) {
	              arr[idx++] = x;
	          }
	      }
	  }
	  
	  int main() {
	      std::vector<int> data = {8, 3, 2, 7, 4, 6, 8};
	      pigeonholeSort(data);
	      std::cout << "Sorted: ";
	      for (int val : data) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function pigeonholeSort(arr) {
	      const n = arr.length;
	      if (n <= 1) return arr;
	  
	      let minVal = arr[0];
	      let maxVal = arr[0];
	      for (let i = 1; i < n; i++) {
	          if (arr[i] < minVal) minVal = arr[i];
	          if (arr[i] > maxVal) maxVal = arr[i];
	      }
	  
	      const range = maxVal - minVal + 1;
	      const holes = Array.from({ length: range }, () => []);
	  
	      // Map elements to holes
	      for (let i = 0; i < n; i++) {
	          holes[arr[i] - minVal].push(arr[i]);
	      }
	  
	      // Rebuild array
	      let idx = 0;
	      for (let i = 0; i < range; i++) {
	          for (let j = 0; j < holes[i].length; j++) {
	              arr[idx++] = holes[i][j];
	          }
	      }
	      return arr;
	  }
	  
	  // Example
	  const data = [8, 3, 2, 7, 4, 6, 8];
	  pigeonholeSort(data);
	  console.log("Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.ArrayList;
	  import java.util.Arrays;
	  import java.util.List;
	  
	  public class PigeonholeSort {
	      public static void pigeonholeSort(int[] arr) {
	          int n = arr.length;
	          if (n <= 1) return;
	  
	          int minVal = arr[0];
	          int maxVal = arr[0];
	          for (int i = 1; i < n; i++) {
	              if (arr[i] < minVal) minVal = arr[i];
	              if (arr[i] > maxVal) maxVal = arr[i];
	          }
	  
	          int range = maxVal - minVal + 1;
	          List<List<Integer>> holes = new ArrayList<>(range);
	          for (int i = 0; i < range; i++) {
	              holes.add(new ArrayList<>());
	          }
	  
	          // Map elements
	          for (int x : arr) {
	              holes.get(x - minVal).add(x);
	          }
	  
	          // Rebuild
	          int idx = 0;
	          for (int i = 0; i < range; i++) {
	              for (int x : holes.get(i)) {
	                  arr[idx++] = x;
	              }
	          }
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {8, 3, 2, 7, 4, 6, 8};
	          pigeonholeSort(data);
	          System.out.println("Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  
	  struct Node {
	      int data;
	      struct Node* next;
	  };
	  
	  void pigeonholeSort(int arr[], int n) {
	      if (n <= 1) return;
	  
	      int minVal = arr[0];
	      int maxVal = arr[0];
	      for (int i = 1; i < n; i++) {
	          if (arr[i] < minVal) minVal = arr[i];
	          if (arr[i] > maxVal) maxVal = arr[i];
	      }
  
	      int range = maxVal - minVal + 1;
	      struct Node** holes = (struct Node**)malloc(range * sizeof(struct Node*));
	      struct Node** tails = (struct Node**)malloc(range * sizeof(struct Node*));
	      for (int i = 0; i < range; i++) {
	          holes[i] = NULL;
	          tails[i] = NULL;
	      }
	  
	      // Map elements to holes (preserving arrival order using tail pointers)
	      for (int i = 0; i < n; i++) {
	          int val = arr[i];
	          int holeIdx = val - minVal;
	          struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
	          newNode->data = val;
	          newNode->next = NULL;
	  
	          if (holes[holeIdx] == NULL) {
	              holes[holeIdx] = newNode;
	              tails[holeIdx] = newNode;
	          } else {
	              tails[holeIdx]->next = newNode;
	              tails[holeIdx] = newNode;
	          }
	      }
	  
	      // Rebuild and free memory
	      int idx = 0;
	      for (int i = 0; i < range; i++) {
	          struct Node* current = holes[i];
	          while (current != NULL) {
	              arr[idx++] = current->data;
	              struct Node* temp = current;
	              current = current->next;
	              free(temp);
	          }
	      }
	  
	      free(holes);
	      free(tails);
	  }
	  
	  int main() {
	      int data[] = {8, 3, 2, 7, 4, 6, 8};
	      int n = sizeof(data) / sizeof(data[0]);
	      pigeonholeSort(data, n);
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
- # Alternative Variant (Pigeonhole Sort for Custom Objects)
  collapsed:: true
	- > [!tip] Pigeonhole Sort vs. Counting Sort for Records
	  > Counting Sort is excellent for arrays of plain integers, but it can be awkward when sorting custom records or objects by integer keys.
	  > **Pigeonhole Sort** handles records naturally by setting up each hole as a dynamic list. We physically place the entire custom record inside the corresponding hole, directly maintaining its auxiliary attributes and stability.
	-
	- :::code-tabs
	  
	  ```python
	  class Record:
	      def __init__(self, key, value):
	          self.key = key
	          self.value = value
	      def __repr__(self):
	          return f"({self.key}: {self.value})"
	  
	  def pigeonhole_sort_records(arr):
	      if not arr:
	          return arr
	      
	      min_val = min(rec.key for rec in arr)
	      max_val = max(rec.key for rec in arr)
	      range_size = max_val - min_val + 1
	      
	      # Create holes as list-of-lists of Record objects
	      holes = [[] for _ in range(range_size)]
	      
	      for rec in arr:
	          holes[rec.key - min_val].append(rec)
	          
	      idx = 0
	      for h in holes:
	          for rec in h:
	              arr[idx] = rec
	              idx += 1
	      return arr
	  
	  if __name__ == "__main__":
	      data = [
	          Record(8, "Alice"),
	          Record(3, "Bob"),
	          Record(2, "Charlie"),
	          Record(7, "David"),
	          Record(3, "Eve")
	      ]
	      print("Original:", data)
	      pigeonhole_sort_records(data)
	      print("Sorted:  ", data)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <string>
	  #include <algorithm>
	  
	  struct Record {
	      int key;
	      std::string name;
	  };
	  
	  void pigeonholeSortRecords(std::vector<Record>& arr) {
	      if (arr.empty()) return;
	  
	      int minVal = arr[0].key;
	      int maxVal = arr[0].key;
	      for (const auto& rec : arr) {
	          if (rec.key < minVal) minVal = rec.key;
	          if (rec.key > maxVal) maxVal = rec.key;
	      }
	      int range = maxVal - minVal + 1;
	  
	      std::vector<std::vector<Record>> holes(range);
	      for (const auto& rec : arr) {
	          holes[rec.key - minVal].push_back(rec);
	      }
	  
	      int idx = 0;
	      for (int i = 0; i < range; ++i) {
	          for (const auto& rec : holes[i]) {
	              arr[idx++] = rec;
	          }
	      }
	  }
	  
	  int main() {
	      std::vector<Record> data = {
	          {8, "Alice"}, {3, "Bob"}, {2, "Charlie"}, {7, "David"}, {3, "Eve"}
	      };
	      pigeonholeSortRecords(data);
	      std::cout << "Sorted Records:\n";
	      for (const auto& rec : data) {
	          std::cout << "  " << rec.key << ": " << rec.name << "\n";
	      }
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class Record {
	      constructor(key, name) {
	          this.key = key;
	          this.name = name;
	      }
	  }
	  
	  function pigeonholeSortRecords(arr) {
	      const n = arr.length;
	      if (n <= 1) return arr;
	  
	      let minVal = arr[0].key;
	      let maxVal = arr[0].key;
	      for (let i = 1; i < n; i++) {
	          if (arr[i].key < minVal) minVal = arr[i].key;
	          if (arr[i].key > maxVal) maxVal = arr[i].key;
	      }
	  
	      const range = maxVal - minVal + 1;
	      const holes = Array.from({ length: range }, () => []);
	  
	      for (let i = 0; i < n; i++) {
	          holes[arr[i].key - minVal].push(arr[i]);
	      }
	  
	      let idx = 0;
	      for (let i = 0; i < range; i++) {
	          for (let j = 0; j < holes[i].length; j++) {
	              arr[idx++] = holes[i][j];
	          }
	      }
	      return arr;
	  }
	  
	  const data = [
	      new Record(8, "Alice"),
	      new Record(3, "Bob"),
	      new Record(2, "Charlie"),
	      new Record(7, "David"),
	      new Record(3, "Eve")
	  ];
	  pigeonholeSortRecords(data);
	  console.log("Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.ArrayList;
	  import java.util.List;
	  
	  class Record {
	      int key;
	      String name;
	      Record(int key, String name) {
	          this.key = key;
	          this.name = name;
	      }
	      @Override
	      public String toString() {
	          return key + ": " + name;
	      }
	  }
	  
	  public class PigeonholeSortRecords {
	      public static void pigeonholeSortRecords(List<Record> arr) {
	          int n = arr.size();
	          if (n <= 1) return;
	  
	          int minVal = arr.get(0).key;
	          int maxVal = arr.get(0).key;
	          for (Record rec : arr) {
	              if (rec.key < minVal) minVal = rec.key;
	              if (rec.key > maxVal) maxVal = rec.key;
	          }
	  
	          int range = maxVal - minVal + 1;
	          List<List<Record>> holes = new ArrayList<>(range);
	          for (int i = 0; i < range; i++) {
	              holes.add(new ArrayList<>());
	          }
	  
	          for (Record rec : arr) {
	              holes.get(rec.key - minVal).add(rec);
	          }
	  
	          int idx = 0;
	          for (int i = 0; i < range; i++) {
	              for (Record rec : holes.get(i)) {
	                  arr.set(idx++, rec);
	              }
	          }
	      }
	  
	      public static void main(String[] args) {
	          List<Record> data = new ArrayList<>();
	          data.add(new Record(8, "Alice"));
	          data.add(new Record(3, "Bob"));
	          data.add(new Record(2, "Charlie"));
	          data.add(new Record(7, "David"));
	          data.add(new Record(3, "Eve"));
	  
	          pigeonholeSortRecords(data);
	          System.out.println("Sorted Records: " + data);
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  #include <string.h>
	  
	  struct Record {
	      int key;
	      char name[20];
	  };
	  
	  struct Node {
	      struct Record record;
	      struct Node* next;
	  };
	  
	  void pigeonholeSortRecords(struct Record arr[], int n) {
	      if (n <= 1) return;
	  
	      int minVal = arr[0].key;
	      int maxVal = arr[0].key;
	      for (int i = 1; i < n; i++) {
	          if (arr[i].key < minVal) minVal = arr[i].key;
	          if (arr[i].key > maxVal) maxVal = arr[i].key;
	      }
	  
	      int range = maxVal - minVal + 1;
	      struct Node** holes = (struct Node**)malloc(range * sizeof(struct Node*));
	      struct Node** tails = (struct Node**)malloc(range * sizeof(struct Node*));
	      for (int i = 0; i < range; i++) {
	          holes[i] = NULL;
	          tails[i] = NULL;
	      }
	  
	      for (int i = 0; i < n; i++) {
	          int holeIdx = arr[i].key - minVal;
	          struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
	          newNode->record = arr[i];
	          newNode->next = NULL;
	  
	          if (holes[holeIdx] == NULL) {
	              holes[holeIdx] = newNode;
	              tails[holeIdx] = newNode;
	          } else {
	              tails[holeIdx]->next = newNode;
	              tails[holeIdx] = newNode;
	          }
	      }
	  
	      int idx = 0;
	      for (int i = 0; i < range; i++) {
	          struct Node* current = holes[i];
	          while (current != NULL) {
	              arr[idx++] = current->record;
	              struct Node* temp = current;
	              current = current->next;
	              free(temp);
	          }
	      }
	      free(holes);
	      free(tails);
	  }
	  
	  int main() {
	      struct Record data[] = {
	          {8, "Alice"}, {3, "Bob"}, {2, "Charlie"}, {7, "David"}, {3, "Eve"}
	      };
	      int n = sizeof(data) / sizeof(data[0]);
	      pigeonholeSortRecords(data, n);
	      printf("Sorted Records:\n");
	      for (int i = 0; i < n; i++) {
	          printf("  %d: %s\n", data[i].key, data[i].name);
	      }
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Pigeonhole Sort
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Are keys\nintegers?"}
	      Q -- No --> R1["❌ Use Comparison / Bucket Sort"]
	      Q -- Yes --> S1{"Is range of values\nRange = Max - Min + 1\nsmall (Range ≈ N)?"}
	      S1 -- No --> R2["❌ Use Radix / Counting / Comparison Sort\n(avoid huge memory allocation)"]
	      S1 -- Yes --> S2{"Are you sorting structs/objects\nwith key-value associations?"}
	      S2 -- Yes --> R3["✅ Use Pigeonhole Sort\n(list-of-lists mapping preserves structures stably)"]
	      S2 -- No --> R4["✅ Counting Sort is also fine\n(but Pigeonhole Sort works great)"]
	  ```
	-
	- ## ✅ Use Pigeonhole Sort When
		- Keys are **integers** and their range ($Max - Min + 1$) is roughly equal to or smaller than the array size $N$.
		- You are sorting **complex objects or records** based on integer keys and require a **stable** sort.
		- The values are uniformly distributed over a small, dense range of integer keys.
	-
	- ## ❌ Avoid Pigeonhole Sort When
		- Keys are non-integers (e.g., floats, strings) or represent a **sparse range** ($Range \gg N$), which leads to massive memory overhead.
		- Memory is severely constrained, since Pigeonhole Sort creates dynamic lists or pointers for each hole.
-
- # Key Takeaways
  collapsed:: true
	- **Pigeonhole Principle** — maps elements to corresponding lists (pigeonholes) using their numeric keys offset by the minimum value.
	- **Stable** — preserves the relative input order of identical key values via list appending.
	- **Out-of-place** — requires dynamic array structures or linked lists for each bucket, scaling memory space to $O(n + Range)$.
	- **Key-value natural mapping** — directly holds the elements or pointers to complex structs, unlike basic Counting Sort which only records counts.
	- **Linear time performance** — runs in $O(n + Range)$ time, optimal when the numeric value spread matches $N$.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Pigeonhole Sort](https://www.geeksforgeeks.org/pigeonhole-sort/)
		- [TheAlgorithms – Pigeonhole Sort (Python)](https://github.com/TheAlgorithms/Python/blob/master/sorts/pigeon_hole_sort.py)