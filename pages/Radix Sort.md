---
seoTitle: Radix Sort Algorithm – Implementation, Digit-Slicing, and Complexity
description: "In-depth guide to Radix Sort. Compares LSD vs MSD approaches, details shift-offset processing for negative numbers, stable sub-sorting, and complete code in Python, C++, JavaScript, Java, and C."
keywords: "radix sort, radixsort, digit sorting, non-comparison sort, linear time sort, O(d*(n+k)), stable sort, LSD radix sort, time complexity, space complexity, VR-Rathod, Code-Note, Vaibhav Rathod"
treeTitle: DSA - Sorting & Searching - Radix Sort
---

> [!info] What is Radix Sort?
> Radix Sort is a non-comparison integer sorting algorithm that runs in linear time.
> It sorts input data digit by digit, from the Least Significant Digit (LSD) to the Most Significant Digit (MSD), using a stable sorting subroutine (typically **Counting Sort**) to organize elements at each digit position.
> It achieves a time complexity of **O(d * (n + k))**, where $d$ is the number of digits and $k$ is the base of the numbering system (typically 10).

- # Explanation
  collapsed:: true
	- **Radix Sort** avoids comparisons by grouping keys by individual digits that share the same significant position and value.
	-
	- ## LSD vs. MSD Radix Sort
	  collapsed:: true
		- There are two main variations:
			- **Least Significant Digit (LSD):** Starts sorting from the rightmost digit (units place) and moves leftwards (tens, hundreds, etc.). It requires a **stable** sub-sorting algorithm to preserve the work done by previous passes.
			- **Most Significant Digit (MSD):** Starts sorting from the leftmost digit and recursively partitions the array into sub-arrays for subsequent digits. It is suitable for string sorting (lexicographical ordering).
	-
	- ## Handling Negative Integers
	  collapsed:: true
		- Radix Sort relies on digit modulo arithmetic (`(value / exp) % 10`), which requires non-negative values.
		- To support **negative integers**, we find the minimum value in the array (`min_val`). If `min_val` is negative, we shift all elements by `-min_val` to make them positive. We then sort the shifted array using LSD Radix Sort, and finally shift all elements back to their original values.
	-
	- ## Core Properties
	  collapsed:: true
		- **Stability:** **Stable** (Yes, when using LSD with a stable subroutine). Essential because sorting the $i$-th digit must not scramble the order established for the $(i-1)$-th digit.
		- **In-Place:** **No**. It inherits the auxiliary storage requirements of the underlying Counting Sort subroutine ($O(n + k)$).
		- **Adaptability:** **No**. It always performs exactly $d$ passes through the array, where $d$ is determined by the maximum value.
-
- # How It Works (LSD Radix Sort)
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- Find the maximum value to determine the number of digits $d$.
		- Run Counting Sort for each digit place (1, 10, 100, etc.), extracting the digit using `(arr[i] / exp) % 10`.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — input array of size N"] --> B["Find min_val\nShift all elements: arr[i] -= min_val"]
		      B --> C["Find max_val in shifted array\nexp = 1"]
		      C --> D{"max_val / exp > 0?"}
		      D -- Yes --> E["Run Stable Counting Sort on digit: (arr[i] / exp) % 10"]
		      E --> F["exp = exp * 10"]
		      F --> D
		      D -- No --> G["Shift elements back: arr[i] += min_val"]
		      G --> H["End — Array Sorted"]
		  ```
	-
	- ## Step-by-Step Trace (Sorting: [170, 45, 75, 90, 802, 2, 66])
	  collapsed:: true
		- Let's trace the array state after each digit pass (base 10):
		- ```
		  Initial Array: [ 170, 45, 75, 90, 802, 2, 66 ]  (Max is 802 → 3 digits)
		  
		  1. Pass 1 (exp = 1, Units Place):
		     - Digits: 170 (0), 45 (5), 75 (5), 90 (0), 802 (2), 2 (2), 66 (6)
		     - Stable count sort:
		       - 0s: [170, 90]
		       - 2s: [802, 2]
		       - 5s: [45, 75]
		       - 6s: [66]
		     - Output: [ 170, 90, 802, 2, 45, 75, 66 ]
		     
		  2. Pass 2 (exp = 10, Tens Place):
		     - Digits: 170 (7), 90 (9), 802 (0), 2 (0), 45 (4), 75 (7), 66 (6)
		     - Stable count sort:
		       - 0s: [802, 2]
		       - 4s: [45]
		       - 6s: [66]
		       - 7s: [170, 75]
		       - 9s: [90]
		     - Output: [ 802, 2, 45, 66, 170, 75, 90 ]
		     
		  3. Pass 3 (exp = 100, Hundreds Place):
		     - Digits: 802 (8), 2 (0), 45 (0), 66 (0), 170 (1), 75 (0), 90 (0)
		     - Stable count sort:
		       - 0s: [2, 45, 66, 75, 90]
		       - 1s: [170]
		       - 8s: [802]
		     - Output: [ 2, 45, 66, 75, 90, 170, 802 ]
		  ```
-
- # Complexity Analysis
  collapsed:: true
	- | Scenario | Time Complexity | Space Complexity | Trigger Condition |
	  |---|---|---|---|
	  | **Best Case** | **O(d * (n + k))**| **O(n + k)** | Triggered on any input. |
	  | **Average Case**| **O(d * (n + k))**| **O(n + k)** | Triggered on any input. |
	  | **Worst Case** | **O(d * (n + k))**| **O(n + k)** | Triggered on any input. |
	-
	- ## Radix Sort vs. Comparison Sorts
	  collapsed:: true
		- For arrays where word length/digit count $d$ is small (e.g. 32-bit integers, $d \le 10$), Radix Sort runs in $O(n)$ time, outperforming Quick Sort or Merge Sort.
		- However, Radix Sort has higher constant factors, requires auxiliary arrays, and does not benefit from cache locality as well as comparison sorts.
-
- # Implementation
  collapsed:: true
	- > [!note] LSD Radix Sort supporting negative values.
		- Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def radix_sort(arr):
	      if not arr:
	          return arr
	      
	      # Shift everything to positive numbers if negatives exist
	      min_val = min(arr)
	      shifted_arr = [x - min_val for x in arr]
	      max_val = max(shifted_arr) if shifted_arr else 0
	      
	      def counting_sort_by_digit(array, exp):
	          n = len(array)
	          output = [0] * n
	          count = [0] * 10
	          
	          # Count occurrences
	          for i in range(n):
	              index = array[i] // exp
	              count[index % 10] += 1
	              
	          # Accumulate counts
	          for i in range(1, 10):
	              count[i] += count[i - 1]
	              
	          # Build output array (reverse order to ensure stability)
	          for i in range(n - 1, -1, -1):
	              index = array[i] // exp
	              output[count[index % 10] - 1] = array[i]
	              count[index % 10] -= 1
	              
	          # Copy output back to original slice
	          for i in range(n):
	              array[i] = output[i]
	              
	      exp = 1
	      while max_val // exp > 0:
	          counting_sort_by_digit(shifted_arr, exp)
	          exp *= 10
	          
	      # Shift back to original values
	      for i in range(len(arr)):
	          arr[i] = shifted_arr[i] + min_val
	      return arr
	  
	  # Example Setup
	  if __name__ == "__main__":
	      data = [170, -45, 75, -90, 802, 2, 66]
	      print("Original:", data)
	      radix_sort(data)
	      print("Sorted:  ", data)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  void countingSortByDigit(std::vector<int>& arr, int exp) {
	      int n = arr.size();
	      std::vector<int> output(n);
	      int count[10] = {0};
	  
	      for (int i = 0; i < n; ++i) {
	          count[(arr[i] / exp) % 10]++;
	      }
	  
	      for (int i = 1; i < 10; ++i) {
	          count[i] += count[i - 1];
	      }
	  
	      for (int i = n - 1; i >= 0; --i) {
	          output[count[(arr[i] / exp) % 10] - 1] = arr[i];
	          count[(arr[i] / exp) % 10]--;
	      }
	  
	      for (int i = 0; i < n; ++i) {
	          arr[i] = output[i];
	      }
	  }
	  
	  void radixSort(std::vector<int>& arr) {
	      if (arr.empty()) return;
	  
	      int minVal = *std::min_element(arr.begin(), arr.end());
	      for (size_t i = 0; i < arr.size(); ++i) {
	          arr[i] -= minVal;
	      }
	  
	      int maxVal = *std::max_element(arr.begin(), arr.end());
	      for (int exp = 1; maxVal / exp > 0; exp *= 10) {
	          countingSortByDigit(arr, exp);
	      }
	  
	      for (size_t i = 0; i < arr.size(); ++i) {
	          arr[i] += minVal;
	      }
	  }
	  
	  int main() {
	      std::vector<int> data = {170, -45, 75, -90, 802, 2, 66};
	      radixSort(data);
	      std::cout << "Sorted: ";
	      for (int val : data) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function radixSort(arr) {
	      if (arr.length === 0) return arr;
	  
	      let minVal = arr[0];
	      for (let i = 1; i < arr.length; i++) {
	          if (arr[i] < minVal) minVal = arr[i];
	      }
	  
	      const shifted = arr.map(x => x - minVal);
	      let maxVal = shifted[0];
	      for (let i = 1; i < shifted.length; i++) {
	          if (shifted[i] > maxVal) maxVal = shifted[i];
	      }
	  
	      function countingSortByDigit(array, exp) {
	          const n = array.length;
	          const output = new Array(n);
	          const count = new Array(10).fill(0);
	  
	          for (let i = 0; i < n; i++) {
	              const digit = Math.floor(array[i] / exp) % 10;
	              count[digit]++;
	          }
	  
	          for (let i = 1; i < 10; i++) {
	              count[i] += count[i - 1];
	          }
	  
	          for (let i = n - 1; i >= 0; i--) {
	              const digit = Math.floor(array[i] / exp) % 10;
	              output[count[digit] - 1] = array[i];
	              count[digit]--;
	          }
	  
	          for (let i = 0; i < n; i++) {
	              array[i] = output[i];
	          }
	      }
	  
	      for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
	          countingSortByDigit(shifted, exp);
	      }
	  
	      for (let i = 0; i < arr.length; i++) {
	          arr[i] = shifted[i] + minVal;
	      }
	      return arr;
	  }
	  
	  // Example
	  const data = [170, -45, 75, -90, 802, 2, 66];
	  radixSort(data);
	  console.log("Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  public class RadixSort {
	      private static void countingSortByDigit(int[] arr, int exp) {
	          int n = arr.length;
	          int[] output = new int[n];
	          int[] count = new int[10];
	  
	          for (int i = 0; i < n; i++) {
	              count[(arr[i] / exp) % 10]++;
	          }
	  
	          for (int i = 1; i < 10; i++) {
	              count[i] += count[i - 1];
	          }
	  
	          for (int i = n - 1; i >= 0; i--) {
	              output[count[(arr[i] / exp) % 10] - 1] = arr[i];
	              count[(arr[i] / exp) % 10]--;
	          }
	  
	          System.arraycopy(output, 0, arr, 0, n);
	      }
	  
	      public static void radixSort(int[] arr) {
	          if (arr.length == 0) return;
	  
	          int minVal = arr[0];
	          for (int i = 1; i < arr.length; i++) {
	              if (arr[i] < minVal) minVal = arr[i];
	          }
	  
	          for (int i = 0; i < arr.length; i++) {
	              arr[i] -= minVal;
	          }
	  
	          int maxVal = arr[0];
	          for (int i = 1; i < arr.length; i++) {
	              if (arr[i] > maxVal) maxVal = arr[i];
	          }
	  
	          for (int exp = 1; maxVal / exp > 0; exp *= 10) {
	              countingSortByDigit(arr, exp);
	          }
	  
	          for (int i = 0; i < arr.length; i++) {
	              arr[i] += minVal;
	          }
	      }
	  
	      public static void main(String[] args) {
	          int[] data = {170, -45, 75, -90, 802, 2, 66};
	          radixSort(data);
	          System.out.println("Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  
	  void countingSortByDigit(int arr[], int n, int exp) {
	      int* output = (int*)malloc(n * sizeof(int));
	      int count[10] = {0};
	  
	      for (int i = 0; i < n; i++) {
	          count[(arr[i] / exp) % 10]++;
	      }
	  
	      for (int i = 1; i < 10; i++) {
	          count[i] += count[i - 1];
	      }
	  
	      for (int i = n - 1; i >= 0; i--) {
	          output[count[(arr[i] / exp) % 10] - 1] = arr[i];
	          count[(arr[i] / exp) % 10]--;
	      }
	  
	      for (int i = 0; i < n; i++) {
	          arr[i] = output[i];
	      }
	      free(output);
	  }
	  
	  void radixSort(int arr[], int n) {
	      if (n == 0) return;
	  
	      int minVal = arr[0];
	      for (int i = 1; i < n; i++) {
	          if (arr[i] < minVal) minVal = arr[i];
	      }
	  
	      for (int i = 0; i < n; i++) {
	          arr[i] -= minVal;
	      }
	  
	      int maxVal = arr[0];
	      for (int i = 1; i < n; i++) {
	          if (arr[i] > maxVal) maxVal = arr[i];
	      }
	  
	      for (int exp = 1; maxVal / exp > 0; exp *= 10) {
	          countingSortByDigit(arr, n, exp);
	      }
	  
	      for (int i = 0; i < n; i++) {
	          arr[i] += minVal;
	      }
	  }
	  
	  int main() {
	      int data[] = {170, -45, 75, -90, 802, 2, 66};
	      int n = sizeof(data) / sizeof(data[0]);
	      radixSort(data, n);
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
- # Alternative Variant (MSD Radix Sort for Strings)
  collapsed:: true
	- > [!tip] Lexicographical / Alphabetical Sorting
	  > Standard LSD Radix Sort is great for fixed-width integers, but not well-suited for varying-length strings.
	  > **MSD (Most Significant Digit) Radix Sort** processes strings from left to right. It groups strings into buckets based on the character at index `d`, then recursively sorts each bucket for the next character index `d + 1`. Strings that are shorter than `d` are grouped at the beginning and require no further sorting, which is highly efficient.
	-
	- :::code-tabs
	  
	  ```python
	  def char_at(s, d):
	      if d < len(s):
	          return ord(s[d])
	      return -1
	  
	  def msd_radix_sort_strings(arr):
	      aux = [None] * len(arr)
	      
	      def sort(lo, hi, d):
	          if hi <= lo:
	              return
	              
	          R = 256 # ASCII range
	          count = [0] * (R + 2)
	          
	          # 1. Compute frequency counts
	          for i in range(lo, hi + 1):
	              c = char_at(arr[i], d)
	              count[c + 2] += 1
	              
	          # 2. Transform counts to indices
	          for r in range(0, R + 1):
	              count[r + 1] += count[r]
	              
	          # 3. Distribute elements
	          for i in range(lo, hi + 1):
	              c = char_at(arr[i], d)
	              aux[count[c + 1]] = arr[i]
	              count[c + 1] += 1
	              
	          # 4. Copy back
	          for i in range(lo, hi + 1):
	              arr[i] = aux[i - lo]
	              
	          # 5. Recursively sort each bucket (exclude the terminated strings bucket -1)
	          for r in range(0, R):
	              sort(lo + count[r], lo + count[r + 1] - 1, d + 1)
	              
	      sort(0, len(arr) - 1, 0)
	      return arr
	  
	  if __name__ == "__main__":
	      data = ["cat", "car", "cab", "dog", "dad", "caterpillar", "cart"]
	      print("Original:", data)
	      msd_radix_sort_strings(data)
	      print("Sorted:  ", data)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <string>
	  
	  int charAt(const std::string& s, int d) {
	      if (d < s.length()) {
	          return static_cast<unsigned char>(s[d]);
	      }
	      return -1;
	  }
	  
	  void msdRadixSortStrings(std::vector<std::string>& arr, int lo, int hi, int d, std::vector<std::string>& aux) {
	      if (hi <= lo) return;
	  
	      const int R = 256;
	      std::vector<int> count(R + 2, 0);
	  
	      // Compute frequency counts
	      for (int i = lo; i <= hi; ++i) {
	          int c = charAt(arr[i], d);
	          count[c + 2]++;
	      }
	  
	      // Transform counts to indices
	      for (int r = 0; r < R + 1; ++r) {
	          count[r + 1] += count[r];
	      }
	  
	      // Distribute
	      for (int i = lo; i <= hi; ++i) {
	          int c = charAt(arr[i], d);
	          aux[count[c + 1]++] = arr[i];
	      }
	  
	      // Copy back
	      for (int i = lo; i <= hi; ++i) {
	          arr[i] = aux[i - lo];
	      }
	  
	      // Recursively sort each bucket
	      for (int r = 0; r < R; ++r) {
	          msdRadixSortStrings(arr, lo + count[r], lo + count[r + 1] - 1, d + 1, aux);
	      }
	  }
	  
	  void msdRadixSort(std::vector<std::string>& arr) {
	      std::vector<std::string> aux(arr.size());
	      msdRadixSortStrings(arr, 0, arr.size() - 1, 0, aux);
	  }
	  
	  int main() {
	      std::vector<std::string> data = {"cat", "car", "cab", "dog", "dad", "caterpillar", "cart"};
	      msdRadixSort(data);
	      std::cout << "Sorted Strings:\n";
	      for (const auto& s : data) {
	          std::cout << "  " << s << "\n";
	      }
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function charAt(s, d) {
	      if (d < s.length) {
	          return s.charCodeAt(d);
	      }
	      return -1;
	  }
	  
	  function msdRadixSortStrings(arr) {
	      const aux = new Array(arr.length);
	  
	      function sort(lo, hi, d) {
	          if (hi <= lo) return;
	  
	          const R = 256;
	          const count = new Array(R + 2).fill(0);
	  
	          for (let i = lo; i <= hi; i++) {
	              const c = charAt(arr[i], d);
	              count[c + 2]++;
	          }
	  
	          for (let r = 0; r < R + 1; r++) {
	              count[r + 1] += count[r];
	          }
	  
	          for (let i = lo; i <= hi; i++) {
	              const c = charAt(arr[i], d);
	              aux[count[c + 1]++] = arr[i];
	          }
	  
	          for (let i = lo; i <= hi; i++) {
	              arr[i] = aux[i - lo];
	          }
	  
	          for (let r = 0; r < R; r++) {
	              sort(lo + count[r], lo + count[r + 1] - 1, d + 1);
	          }
	      }
	  
	      sort(0, arr.length - 1, 0);
	      return arr;
	  }
	  
	  const data = ["cat", "car", "cab", "dog", "dad", "caterpillar", "cart"];
	  msdRadixSortStrings(data);
	  console.log("Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  public class MSDRadixSort {
	      private static int charAt(String s, int d) {
	          if (d < s.length()) {
	              return s.charAt(d);
	          }
	          return -1;
	      }
	  
	      private static void sort(String[] arr, int lo, int hi, int d, String[] aux) {
	          if (hi <= lo) return;
	  
	          int R = 256;
	          int[] count = new int[R + 2];
	  
	          // Compute frequency counts
	          for (int i = lo; i <= hi; i++) {
	              int c = charAt(arr[i], d);
	              count[c + 2]++;
	          }
	  
	          // Transform counts to indices
	          for (int r = 0; r < R + 1; r++) {
	              count[r + 1] += count[r];
	          }
	  
	          // Distribute
	          for (int i = lo; i <= hi; i++) {
	              int c = charAt(arr[i], d);
	              aux[count[c + 1]++] = arr[i];
	          }
	  
	          // Copy back
	          for (int i = lo; i <= hi; i++) {
	              arr[i] = aux[i - lo];
	          }
	  
	          // Recursively sort each bucket
	          for (int r = 0; r < R; r++) {
	              sort(arr, lo + count[r], lo + count[r + 1] - 1, d + 1, aux);
	          }
	      }
	  
	      public static void msdRadixSort(String[] arr) {
	          String[] aux = new String[arr.length];
	          sort(arr, 0, arr.length - 1, 0, aux);
	      }
	  
	      public static void main(String[] args) {
	          String[] data = {"cat", "car", "cab", "dog", "dad", "caterpillar", "cart"};
	          msdRadixSort(data);
	          System.out.println("Sorted: " + Arrays.toString(data));
	      }
	  }
	  // Note: All recursive calls allocate count arrays, so performance degrades for extremely deep structures.
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  #include <string.h>
	  
	  int charAt(const char* s, int d) {
	      if (d < (int)strlen(s)) {
	          return (unsigned char)s[d];
	      }
	      return -1;
	  }
	  
	  void sort(const char** arr, int lo, int hi, int d, const char** aux) {
	      if (hi <= lo) return;
	  
	      int R = 256;
	      int* count = (int*)calloc(R + 2, sizeof(int));
	  
	      // Compute frequency counts
	      for (int i = lo; i <= hi; i++) {
	          int c = charAt(arr[i], d);
	          count[c + 2]++;
	      }
	  
	      // Transform counts to indices
	      for (int r = 0; r < R + 1; r++) {
	          count[r + 1] += count[r];
	      }
	  
	      // Distribute
	      for (int i = lo; i <= hi; i++) {
	          int c = charAt(arr[i], d);
	          aux[count[c + 1]++] = arr[i];
	      }
	  
	      // Copy back
	      for (int i = lo; i <= hi; i++) {
	          arr[i] = aux[i - lo];
	      }
	  
	      // Recursively sort each bucket
	      for (int r = 0; r < R; r++) {
	          sort(arr, lo + count[r], lo + count[r + 1] - 1, d + 1, aux);
	      }
	  
	      free(count);
	  }
	  
	  void msdRadixSort(const char* arr[], int n) {
	      const char** aux = (const char**)malloc(n * sizeof(char*));
	      sort(arr, 0, n - 1, 0, aux);
	      free(aux);
	  }
	  
	  int main() {
	      const char* data[] = {"cat", "car", "cab", "dog", "dad", "caterpillar", "cart"};
	      int n = sizeof(data) / sizeof(data[0]);
	      msdRadixSort(data, n);
	      printf("Sorted:\n");
	      for (int i = 0; i < n; i++) {
	          printf("  %s\n", data[i]);
	      }
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Radix Sort
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Is the dataset composed of\nfixed-length strings/integers?"}
	      Q -- No --> R1["❌ Use Comparison Sorts\n(Merge / Quick / Heap Sort)"]
	      Q -- Yes --> S1{"Is word length (d)\nsmall (e.g., d < log N)?"}
	      S1 -- No --> R1
	      S1 -- Yes --> S2{"Are you sorting lexicographically\nor string prefixes?"}
	      S2 -- Yes --> R2["✅ Use MSD Radix Sort\n(Recursively partitions buckets)"]
	      S2 -- No --> R3["✅ Use LSD Radix Sort\n(Stable digit-by-digit passes)"]
	  ```
	-
	- ## ✅ Use Radix Sort When
		- You are sorting arrays of strings or integers with a relatively short, uniform word length (small digit count $d$).
		- You need to perform lexicographical or alphabetical prefix sorting on dynamic-length strings (MSD variant).
		- You require a **stable** integer sort (LSD variant) and the maximum value has few significant digits.
	-
	- ## ❌ Avoid Radix Sort When
		- Elements have arbitrary dynamic types or keys that cannot be easily decomposed into discrete characters or digits.
		- The digit/word length $d$ is very large (e.g., sorting long unique binary hashes), where comparison sorts like Quick Sort with $O(n \log n)$ comparisons are faster.
		- Memory overhead is a strict constraint (Radix Sort requires $O(n + k)$ auxiliary arrays).
-
- # Key Takeaways
  collapsed:: true
	- **Lexicographical Decompositions** — processes keys character by character or digit by digit, sorting values without comparing them directly.
	- **LSD vs. MSD** — LSD sorts right-to-left for numeric keys (stable), while MSD sorts left-to-right (partitioning recursively) for lexicographical string keys.
	- **Linear Performance Bound** — runs in $O(d \cdot (n + k))$ time, where $d$ is digit/word length, $n$ is array size, and $k$ is base/radix size.
	- **Auxiliary Requirements** — relies on a stable sorting subroutine (typically Counting Sort), importing its space complexity of $O(n + k)$.
	- **Negative Integer Shift** — handles negative values by shifting them to non-negative ranges via a min-value offset beforehand.
	- **Cache and Constant Penalties** — suffers from high constant factors and poor cache locality compared to highly optimized quicksort routines.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Radix Sort](https://www.geeksforgeeks.org/radix-sort/)
		- [TheAlgorithms – Radix Sort (Python)](https://github.com/TheAlgorithms/Python/blob/master/sorts/radix_sort.py)