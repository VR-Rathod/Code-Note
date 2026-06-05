---
seoTitle: Counting Sort Algorithm – Implementation, Range Offset, and Stability
description: "In-depth guide to Counting Sort. Details non-comparative sorting mechanics, offset calculations to handle negative integers, stable element positioning, and complete implementations in Python, C++, JavaScript, Java, and C."
keywords: "counting sort, non-comparison sort, linear time sort, O(n+k), stable sort, integer sorting, time complexity, space complexity, VR-Rathod, Code-Note, Vaibhav Rathod"
treeTitle: DSA - Sorting & Searching - Counting Sort
---

> [!info] What is Counting Sort?
> Counting Sort is a non-comparison integer sorting algorithm that runs in linear time.
> It works by counting the occurrences of each unique value in the input array, calculating cumulative frequencies to determine each element's exact final position, and constructing the sorted array.
> It achieves a time complexity of **O(n + k)**, where $k$ is the range of key values.

- # Explanation
  collapsed:: true
	- **Counting Sort** differs from standard sorting algorithms because it performs **zero comparisons** between elements. Instead, it uses the values of the elements directly as indices into a temporary `count` array.
	-
	- ## Supporting Negative Integers via Range Offset
	  collapsed:: true
		- Standard Counting Sort assumes keys are positive integers in the range `[0, k]`.
		- To support **negative integers**, we find the minimum value in the array (`min_val`) and use it as an **offset**. When indexing into the count array, we use `key - min_val` rather than `key`. The range of the count array becomes `(max_val - min_val + 1)`.
	-
	- ## How Stability is Maintained
	  collapsed:: true
		- In the final positioning phase, we iterate through the input array in **reverse order** (from right to left) and place elements into the output array using the updated count indices. This ensures that duplicate elements preserve their relative order, making Counting Sort **stable**.
	-
	- ## Core Properties
	  collapsed:: true
		- **Stability:** **Stable** (Yes). Critical because Counting Sort is frequently used as a subroutine in **Radix Sort**.
		- **In-Place:** **No**. It requires an auxiliary `count` array of size $O(k)$ and an `output` array of size $O(n)$.
		- **Adaptability:** **No**. It performs the same sequence of indexing and counting regardless of whether the array is initially sorted.
-
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- 1. Count occurrences of each key.
		- 2. Accumulate counts (cumulative prefix sums) to determine boundaries.
		- 3. Build the output array by placing elements back in reverse order.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — input array of size N"] --> B["Find min_val and max_val\nrange = max_val - min_val + 1"]
		      B --> C["Initialize count array of size range with zeros\nInitialize output array of size N"]
		      C --> D["Count phase:\nfor x in arr: count[x - min_val]++"]
		      D --> E["Accumulate phase:\nfor i = 1 to range-1: count[i] += count[i-1]"]
		      E --> F["Build phase (Right to Left):\nfor i = N-1 down to 0:\n  output[count[arr[i] - min_val] - 1] = arr[i]\n  count[arr[i] - min_val]--"]
		      F --> G["Copy output back to original arr"]
		      G --> H["End — Array Sorted"]
		  ```
	-
	- ## Step-by-Step Trace (Sorting: [4, -2, 2, -2, 3])
	  collapsed:: true
		- Let's trace how elements are counted and positioned:
		- ```
		  Input Array: [ 4, -2, 2, -2, 3 ] (N = 5)
		  min_val = -2 | max_val = 4 | range = 4 - (-2) + 1 = 7
		  Offset = -2 (To access index: element - min_val)
		  
		  1. Count Array (Index mapping: -2->0, -1->1, 0->2, 1->3, 2->4, 3->5, 4->6):
		     Initial count: [ 0, 0, 0, 0, 0, 0, 0 ]
		     After counting: [ 2, 0, 0, 0, 1, 1, 1 ]  (Two -2s, one 2, one 3, one 4)
		     
		  2. Cumulative Prefix Sum:
		     Accumulating: count[i] = count[i] + count[i-1]
		     Summed count: [ 2, 2, 2, 2, 3, 4, 5 ]
		     
		  3. Build Output Array (Reverse Iteration):
		     - i = 4 (arr[4] = 3): index = 3 - (-2) = 5. count[5] = 4. Place 3 at output[3]. count[5] becomes 3.
		     - i = 3 (arr[3] = -2): index = 0. count[0] = 2. Place -2 at output[1]. count[0] becomes 1.
		     - i = 2 (arr[2] = 2): index = 4. count[4] = 3. Place 2 at output[2]. count[4] becomes 2.
		     - i = 1 (arr[1] = -2): index = 0. count[0] = 1. Place -2 at output[0]. count[0] becomes 0.
		     - i = 0 (arr[0] = 4): index = 6. count[6] = 5. Place 4 at output[4]. count[6] becomes 4.
		     
		  Output Array: [ -2, -2, 2, 3, 4 ]
		  ```
-
- # Complexity Analysis
  collapsed:: true
	- | Scenario | Time Complexity | Space Complexity | Trigger Condition |
	  |---|---|---|---|
	  | **Best Case** | **O(n + k)** | **O(n + k)** | Triggered on any input. |
	  | **Average Case**| **O(n + k)** | **O(n + k)** | Triggered on any input. |
	  | **Worst Case** | **O(n + k)** | **O(n + k)** | Triggered on any input. |
	-
	- ## When to Avoid Counting Sort
	  collapsed:: true
		- If the range of values $k$ is extremely large compared to array size $n$ (for example, sorting `[1, 10, 1000000000]`), the algorithm will allocate a massive count array, leading to high memory usage and worse time performance than $O(n \log n)$ algorithms.
-
- # Implementation
  collapsed:: true
	- > [!note] Stable implementations supporting negative integers.
		- Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def counting_sort(arr):
	      if not arr:
	          return arr
	      
	      min_val = min(arr)
	      max_val = max(arr)
	      range_of_elements = max_val - min_val + 1
	      
	      count = [0] * range_of_elements
	      output = [0] * len(arr)
	      
	      # Store count of each element
	      for x in arr:
	          count[x - min_val] += 1
	          
	      # Store cumulative counts
	      for i in range(1, len(count)):
	          count[i] += count[i - 1]
	          
	      # Build output array (in reverse to maintain stability)
	      for i in range(len(arr) - 1, -1, -1):
	          output[count[arr[i] - min_val] - 1] = arr[i]
	          count[arr[i] - min_val] -= 1
	          
	      # Copy output back to original array
	      for i in range(len(arr)):
	          arr[i] = output[i]
	      return arr
	  
	  # Example Setup
	  if __name__ == "__main__":
	      data = [4, -2, 2, -2, 3]
	      print("Original:", data)
	      counting_sort(data)
	      print("Sorted:  ", data)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  void countingSort(std::vector<int>& arr) {
	      if (arr.empty()) return;
	  
	      int minVal = *std::min_element(arr.begin(), arr.end());
	      int maxVal = *std::max_element(arr.begin(), arr.end());
	      int range = maxVal - minVal + 1;
	  
	      std::vector<int> count(range, 0);
	      std::vector<int> output(arr.size());
	  
	      for (int x : arr) {
	          count[x - minVal]++;
	      }
	  
	      for (int i = 1; i < range; ++i) {
	          count[i] += count[i - 1];
	      }
	  
	      for (int i = arr.size() - 1; i >= 0; --i) {
	          output[count[arr[i] - minVal] - 1] = arr[i];
	          count[arr[i] - minVal]--;
	      }
	  
	      for (size_t i = 0; i < arr.size(); ++i) {
	          arr[i] = output[i];
	      }
	  }
	  
	  int main() {
	      std::vector<int> data = {4, -2, 2, -2, 3};
	      countingSort(data);
	      std::cout << "Sorted: ";
	      for (int val : data) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function countingSort(arr) {
	      if (arr.length === 0) return arr;
	  
	      let minVal = arr[0];
	      let maxVal = arr[0];
	      for (let i = 1; i < arr.length; i++) {
	          if (arr[i] < minVal) minVal = arr[i];
	          if (arr[i] > maxVal) maxVal = arr[i];
	      }
	      const range = maxVal - minVal + 1;
	  
	      const count = new Array(range).fill(0);
	      const output = new Array(arr.length);
	  
	      for (let i = 0; i < arr.length; i++) {
	          count[arr[i] - minVal]++;
	      }
	  
	      for (let i = 1; i < range; i++) {
	          count[i] += count[i - 1];
	      }
	  
	      for (let i = arr.length - 1; i >= 0; i--) {
	          output[count[arr[i] - minVal] - 1] = arr[i];
	          count[arr[i] - minVal]--;
	      }
	  
	      for (let i = 0; i < arr.length; i++) {
	          arr[i] = output[i];
	      }
	      return arr;
	  }
	  
	  // Example
	  const data = [4, -2, 2, -2, 3];
	  countingSort(data);
	  console.log("Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  public class CountingSort {
	      public static void countingSort(int[] arr) {
	          if (arr.length == 0) return;
	  
	          int minVal = arr[0];
	          int maxVal = arr[0];
	          for (int i = 1; i < arr.length; i++) {
	              if (arr[i] < minVal) minVal = arr[i];
	              if (arr[i] > maxVal) maxVal = arr[i];
	          }
	          int range = maxVal - minVal + 1;
	  
	          int[] count = new int[range];
	          int[] output = new int[arr.length];
	  
	          for (int x : arr) {
	              count[x - minVal]++;
	          }
	  
	          for (int i = 1; i < range; i++) {
	              count[i] += count[i - 1];
	          }
	  
	          for (int i = arr.length - 1; i >= 0; i--) {
	              output[count[arr[i] - minVal] - 1] = arr[i];
	              count[arr[i] - minVal]--;
	          }
	  
	          System.arraycopy(output, 0, arr, 0, arr.length);
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {4, -2, 2, -2, 3};
	          countingSort(data);
	          System.out.println("Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  
	  void countingSort(int arr[], int n) {
	      if (n == 0) return;
	  
	      int minVal = arr[0];
	      int maxVal = arr[0];
	      for (int i = 1; i < n; i++) {
	          if (arr[i] < minVal) minVal = arr[i];
	          if (arr[i] > maxVal) maxVal = arr[i];
	      }
	      int range = maxVal - minVal + 1;
	  
	      int* count = (int*)calloc(range, sizeof(int));
	      int* output = (int*)malloc(n * sizeof(int));
	  
	      for (int i = 0; i < n; i++) {
	          count[arr[i] - minVal]++;
	      }
	  
	      for (int i = 1; i < range; i++) {
	          count[i] += count[i - 1];
	      }
	  
	      for (int i = n - 1; i >= 0; i--) {
	          output[count[arr[i] - minVal] - 1] = arr[i];
	          count[arr[i] - minVal]--;
	      }
	  
	      for (int i = 0; i < n; i++) {
	          arr[i] = output[i];
	      }
	  
	      free(count);
	      free(output);
	  }
	  
	  int main() {
	      int data[] = {4, -2, 2, -2, 3};
	      int n = sizeof(data) / sizeof(data[0]);
	      countingSort(data, n);
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
- # Alternative Variant (Counting Sort for Key-Value Objects)
  collapsed:: true
	- > [!tip] Sorting Complex Records using Integer Keys
	  > Standard Counting Sort sorts plain integer arrays. To sort complex records (e.g. key-value pairs) stably by an integer key, we store the full objects in the output array, referencing the objects' keys to find their positions in the count array. We iterate backward to preserve stability.
	-
	- :::code-tabs
	  
	  ```python
	  class Record:
	      def __init__(self, key, value):
	          self.key = key
	          self.value = value
	      def __repr__(self):
	          return f"({self.key}: {self.value})"
	  
	  def counting_sort_records(arr):
	      if not arr:
	          return arr
	          
	      min_val = min(rec.key for rec in arr)
	      max_val = max(rec.key for rec in arr)
	      range_size = max_val - min_val + 1
	      
	      count = [0] * range_size
	      output = [None] * len(arr)
	      
	      # Count frequencies
	      for rec in arr:
	          count[rec.key - min_val] += 1
	          
	      # Accumulate counts
	      for i in range(1, range_size):
	          count[i] += count[i - 1]
	          
	      # Build output array (reverse order for stability)
	      for i in range(len(arr) - 1, -1, -1):
	          rec = arr[i]
	          output[count[rec.key - min_val] - 1] = rec
	          count[rec.key - min_val] -= 1
	          
	      # Copy back
	      for i in range(len(arr)):
	          arr[i] = output[i]
	      return arr
	  
	  if __name__ == "__main__":
	      data = [
	          Record(4, "Alice"),
	          Record(1, "Bob"),
	          Record(3, "Charlie"),
	          Record(1, "David"),
	          Record(2, "Eve")
	      ]
	      print("Original:", data)
	      counting_sort_records(data)
	      print("Sorted:  ", data)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <string>
	  #include <algorithm>
	  
	  struct Record {
	      int key;
	      std::string value;
	  };
	  
	  void countingSortRecords(std::vector<Record>& arr) {
	      if (arr.empty()) return;
	  
	      int minVal = arr[0].key;
	      int maxVal = arr[0].key;
	      for (const auto& rec : arr) {
	          if (rec.key < minVal) minVal = rec.key;
	          if (rec.key > maxVal) maxVal = rec.key;
	      }
	      int range = maxVal - minVal + 1;
	  
	      std::vector<int> count(range, 0);
	      std::vector<Record> output(arr.size());
	  
	      for (const auto& rec : arr) {
	          count[rec.key - minVal]++;
	      }
	  
	      for (int i = 1; i < range; ++i) {
	          count[i] += count[i - 1];
	      }
	  
	      for (int i = arr.size() - 1; i >= 0; --i) {
	          output[count[arr[i].key - minVal] - 1] = arr[i];
	          count[arr[i].key - minVal]--;
	      }
	  
	      arr = std::move(output);
	  }
	  
	  int main() {
	      std::vector<Record> data = {
	          {4, "Alice"}, {1, "Bob"}, {3, "Charlie"}, {1, "David"}, {2, "Eve"}
	      };
	      countingSortRecords(data);
	      std::cout << "Sorted Records:\n";
	      for (const auto& rec : data) {
	          std::cout << "  " << rec.key << ": " << rec.value << "\n";
	      }
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class Record {
	      constructor(key, value) {
	          this.key = key;
	          this.value = value;
	      }
	  }
	  
	  function countingSortRecords(arr) {
	      if (arr.length === 0) return arr;
	  
	      let minVal = arr[0].key;
	      let maxVal = arr[0].key;
	      for (let i = 1; i < arr.length; i++) {
	          if (arr[i].key < minVal) minVal = arr[i].key;
	          if (arr[i].key > maxVal) maxVal = arr[i].key;
	      }
	      const range = maxVal - minVal + 1;
	  
	      const count = new Array(range).fill(0);
	      const output = new Array(arr.length);
	  
	      for (let i = 0; i < arr.length; i++) {
	          count[arr[i].key - minVal]++;
	      }
	  
	      for (let i = 1; i < range; i++) {
	          count[i] += count[i - 1];
	      }
	  
	      for (let i = arr.length - 1; i >= 0; i--) {
	          output[count[arr[i].key - minVal] - 1] = arr[i];
	          count[arr[i].key - minVal]--;
	      }
	  
	      for (let i = 0; i < arr.length; i++) {
	          arr[i] = output[i];
	      }
	      return arr;
	  }
	  
	  const data = [
	      new Record(4, "Alice"),
	      new Record(1, "Bob"),
	      new Record(3, "Charlie"),
	      new Record(1, "David"),
	      new Record(2, "Eve")
	  ];
	  countingSortRecords(data);
	  console.log("Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  class Record {
	      int key;
	      String value;
	      Record(int key, String value) {
	          this.key = key;
	          this.value = value;
	      }
	      @Override
	      public String toString() {
	          return "(" + key + ": " + value + ")";
	      }
	  }
	  
	  public class CountingSortRecords {
	      public static void countingSort(Record[] arr) {
	          if (arr.length == 0) return;
	  
	          int minVal = arr[0].key;
	          int maxVal = arr[0].key;
	          for (Record rec : arr) {
	              if (rec.key < minVal) minVal = rec.key;
	              if (rec.key > maxVal) maxVal = rec.key;
	          }
	          int range = maxVal - minVal + 1;
	  
	          int[] count = new int[range];
	          Record[] output = new Record[arr.length];
	  
	          for (Record rec : arr) {
	              count[rec.key - minVal]++;
	          }
	  
	          for (int i = 1; i < range; i++) {
	              count[i] += count[i - 1];
	          }
	  
	          for (int i = arr.length - 1; i >= 0; i--) {
	              output[count[arr[i].key - minVal] - 1] = arr[i];
	              count[arr[i].key - minVal]--;
	          }
	  
	          System.arraycopy(output, 0, arr, 0, arr.length);
	      }
	  
	      public static void main(String[] args) {
	          Record[] data = {
	              new Record(4, "Alice"),
	              new Record(1, "Bob"),
	              new Record(3, "Charlie"),
	              new Record(1, "David"),
	              new Record(2, "Eve")
	          };
	          countingSort(data);
	          System.out.println("Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  #include <string.h>
	  
	  struct Record {
	      int key;
	      char value[20];
	  };
	  
	  void countingSortRecords(struct Record arr[], int n) {
	      if (n <= 1) return;
	  
	      int minVal = arr[0].key;
	      int maxVal = arr[0].key;
	      for (int i = 1; i < n; i++) {
	          if (arr[i].key < minVal) minVal = arr[i].key;
	          if (arr[i].key > maxVal) maxVal = arr[i].key;
	      }
	      int range = maxVal - minVal + 1;
	  
	      int* count = (int*)calloc(range, sizeof(int));
	      struct Record* output = (struct Record*)malloc(n * sizeof(struct Record));
	  
	      for (int i = 0; i < n; i++) {
	          count[arr[i].key - minVal]++;
	      }
	  
	      for (int i = 1; i < range; i++) {
	          count[i] += count[i - 1];
	      }
	  
	      for (int i = n - 1; i >= 0; i--) {
	          output[count[arr[i].key - minVal] - 1] = arr[i];
	          count[arr[i].key - minVal]--;
	      }
	  
	      for (int i = 0; i < n; i++) {
	          arr[i] = output[i];
	      }
	  
	      free(count);
	      free(output);
	  }
	  
	  int main() {
	      struct Record data[] = {
	          {4, "Alice"},
	          {1, "Bob"},
	          {3, "Charlie"},
	          {1, "David"},
	          {2, "Eve"}
	      };
	      int n = sizeof(data) / sizeof(data[0]);
	      countingSortRecords(data, n);
	      printf("Sorted Records:\n");
	      for (int i = 0; i < n; i++) {
	          printf("  %d: %s\n", data[i].key, data[i].value);
	      }
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Counting Sort
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Are keys\nintegers?"}
	      Q -- No --> R1["❌ Use Comparison Sort\n(e.g., Merge / Quick Sort)"]
	      Q -- Yes --> S1{"Is range of values\nRange = Max - Min + 1\nsmall (Range ≈ N)?"}
	      S1 -- No --> R2["❌ Use Radix Sort or Comparison Sort\n(Avoid huge count array allocations)"]
	      S1 -- Yes --> R3["✅ Use Counting Sort\n(Linear O(N + K) time, stable)"]
	  ```
	-
	- ## ✅ Use Counting Sort When
		- Keys are **integers** and their range ($Max - Min + 1$) is small (preferably $O(n)$) compared to the array size.
		- You require a **stable** sort (relative order of identical keys must be preserved).
		- High performance is needed on positive/negative integer datasets with a small range.
	-
	- ## ❌ Avoid Counting Sort When
		- Keys are non-integers (e.g., floats, strings, complex object keys without numeric mappings).
		- The range of values $k$ is extremely large (e.g., $k \gg n$), which causes excessive memory overhead and slows down the prefix sum calculations.
-
- # Key Takeaways
  collapsed:: true
	- **Non-Comparison Sort** — avoids comparing elements directly, utilizing array indices of a temporary count array to sort in linear time.
	- **Linear Complexity** — operates in guaranteed $O(n + k)$ time across best, average, and worst cases, where $k$ is the integer key range.
	- **Stability Maintained** — traversing the array from right to left during placement ensures duplicate keys maintain their original ordering.
	- **Negative Value Offset** — shifts indices by subtracting the minimum value (`key - min_val`), enabling sorting of negative integers.
	- **Memory Overhead** — allocates $O(n + k)$ auxiliary space, which can become a severe bottleneck if the integer values are sparse.
	- **Subroutine Foundation** — acts as the core stable subroutine for other non-comparison algorithms like **Radix Sort**.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Counting Sort](https://www.geeksforgeeks.org/counting-sort/)
		- [TheAlgorithms – Counting Sort (Python)](https://github.com/TheAlgorithms/Python/blob/master/sorts/counting_sort.py)