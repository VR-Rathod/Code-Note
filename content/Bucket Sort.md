---
seoTitle: Bucket Sort Algorithm – Complete Guide, Complexity, and Multi-Language Code
description: "In-depth guide to Bucket Sort. Explains uniform distribution assumption, normalization techniques, insertion sub-sort, time and space complexity, and complete code implementations in Python, C++, JavaScript, Java, and C."
keywords: "bucket sort, bucketsort, distribution sort, sorting algorithm, uniform distribution, time complexity, space complexity, insertion sort, VR-Rathod, Code-Note, Vaibhav Rathod"
---

> [!info] What is Bucket Sort?
> **Bucket Sort** (or Bin Sort) is a distribution-based, non-comparison sorting algorithm. It works by partitioning an array into a number of buckets. Each bucket is then sorted individually—typically using a stable comparison sorting algorithm like **Insertion Sort** or recursively applying Bucket Sort—and finally concatenated to produce the sorted array.
> It achieves a time complexity of **O(n + k)** on average under a uniform distribution assumption, where $n$ is the number of elements and $k$ is the number of buckets.

- # Explanation
  collapsed:: true
	- **Bucket Sort** is highly effective when input values are uniformly distributed over a known range.
	-
	- ## Normalization Mapping
	  collapsed:: true
		- For general inputs (both floating-point and integers), we map values into the range $[0, 1)$ to determine their bucket indices:
		  $$\text{Normalized Value} = \frac{\text{value} - \text{min\_val}}{\text{max\_val} - \text{min\_val}}$$
		  $$\text{Bucket Index} = \lfloor\text{Normalized Value} \times (n - 1)\rfloor$$
		- This ensures elements are distributed evenly across $n$ buckets.
	-
	- ## Core Properties
	  collapsed:: true
		- **Stability:** **Stable** (Yes, provided the underlying sorting algorithm used for each bucket is stable, e.g. Insertion Sort).
		- **In-Place:** **No**. Requires auxiliary arrays/lists for buckets.
		- **Adaptability:** **Yes**. Efficiency increases if the input is uniformly distributed.
-
- # How It Works
  collapsed:: true
	- ## The Process Flow
	  collapsed:: true
		- 1. Find the minimum and maximum values in the array to construct the normalization bounds.
		- 2. Initialize $n$ empty buckets (typically dynamic lists or linked lists).
		- 3. Iterate through the input array, normalize each element, and place it into its corresponding bucket.
		- 4. Sort each individual bucket using a stable insertion sort.
		- 5. Concatenate the sorted buckets sequentially back into the original array.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — Input Array of size N"] --> B["Find min_val and max_val"]
		      B --> C["Create N empty buckets"]
		      C --> D["For each element: index = floor( (val - min) / (max - min) * (N-1) )"]
		      D --> E["Append element to buckets[index]"]
		      E --> F["Sort each bucket using Insertion Sort"]
		      F --> G["Concatenate all sorted buckets back to original array"]
		      G --> H["End — Array Sorted"]
		      style H fill:#22c55e,stroke:#15803d,stroke-width:2px,color:#fff
		  ```
	-
	- ## Visual Dry-Run Trace (Sorting: [0.42, 0.32, 0.53, 0.23, 0.72, 0.55])
	  collapsed:: true
		- Let $n = 6$. Minimum is $0.23$, Maximum is $0.72$. Range is $0.49$.
		- For each element, bucket index is calculated as: $\lfloor\frac{\text{val} - 0.23}{0.49} \times 5\rfloor$.
		-
		- | Element | Normalized (val - 0.23)/0.49 | Bucket Index (Normalized * 5) | Target Bucket |
		  |---|---|---|---|
		  | **0.42** | 0.3877 | $\lfloor 1.938 \rfloor = 1$ | Bucket 1 |
		  | **0.32** | 0.1836 | $\lfloor 0.918 \rfloor = 0$ | Bucket 0 |
		  | **0.53** | 0.6122 | $\lfloor 3.061 \rfloor = 3$ | Bucket 3 |
		  | **0.23** | 0.0000 | $\lfloor 0.000 \rfloor = 0$ | Bucket 0 |
		  | **0.72** | 1.0000 | $\lfloor 5.000 \rfloor = 5$ | Bucket 5 |
		  | **0.55** | 0.6530 | $\lfloor 3.265 \rfloor = 3$ | Bucket 3 |
		-
		- **Buckets before sorting:**
		  - Bucket 0: `[0.32, 0.23]`
		  - Bucket 1: `[0.42]`
		  - Bucket 2: `[]`
		  - Bucket 3: `[0.53, 0.55]`
		  - Bucket 4: `[]`
		  - Bucket 5: `[0.72]`
		-
		- **Buckets after sorting:**
		  - Bucket 0: `[0.23, 0.32]`
		  - Bucket 1: `[0.42]`
		  - Bucket 2: `[]`
		  - Bucket 3: `[0.53, 0.55]`
		  - Bucket 4: `[]`
		  - Bucket 5: `[0.72]`
		-
		- **Final Concatenation:** `[0.23, 0.32, 0.42, 0.53, 0.55, 0.72]`
-
- # Complexity Analysis
  collapsed:: true
	- | Scenario | Time Complexity | Space Complexity | Trigger Condition |
	  |---|---|---|---|
	  | **Best Case** | **O(n + k)** | **O(n + k)** | Uniformly distributed input where each element goes to a separate bucket. |
	  | **Average Case** | **O(n + k)** | **O(n + k)** | Elements are uniformly distributed across buckets. |
	  | **Worst Case** | **O(n²)** | **O(n + k)** | All elements fall into a single bucket, degrading to the bucket sorting algorithm's complexity (Insertion Sort). |
	-
	- ## Performance Considerations
	  collapsed:: true
		- If the input distribution is skewed, many elements will cluster in a few buckets. In such cases, using **Quick Sort** or **Merge Sort** to sort the buckets is preferred, which prevents the worst-case time complexity from degrading to $O(n^2)$ and keeps it at $O(n \log n)$.
-
- # Implementation
  collapsed:: true
	- > [!note] Bucket Sort with Insertion Sort Subroutine.
	  - Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def insertion_sort(arr):
	      for i in range(1, len(arr)):
	          key = arr[i]
	          j = i - 1
	          while j >= 0 and arr[j] > key:
	              arr[j + 1] = arr[j]
	              j -= 1
	          arr[j + 1] = key
	      return arr
	  
	  def bucket_sort(arr):
	      if not arr:
	          return arr
	      
	      min_val = min(arr)
	      max_val = max(arr)
	      
	      # If all elements are identical, array is already sorted
	      if min_val == max_val:
	          return arr
	          
	      n = len(arr)
	      buckets = [[] for _ in range(n)]
	      
	      # Distribute input array values into buckets
	      for val in arr:
	          # Normalize value to [0, 1) range
	          norm = (val - min_val) / (max_val - min_val)
	          bucket_idx = int(norm * (n - 1))
	          buckets[bucket_idx].append(val)
	          
	      # Sort individual buckets
	      for i in range(n):
	          buckets[i] = insertion_sort(buckets[i])
	          
	      # Concatenate buckets back into original array
	      idx = 0
	      for b in buckets:
	          for val in b:
	              arr[idx] = val
	              idx += 1
	      return arr
	  
	  if __name__ == "__main__":
	      data = [0.42, 0.32, 0.53, 0.23, 0.72, 0.55]
	      print("Original:", data)
	      bucket_sort(data)
	      print("Sorted:  ", data)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  void insertionSort(std::vector<double>& arr) {
	      int n = arr.size();
	      for (int i = 1; i < n; ++i) {
	          double key = arr[i];
	          int j = i - 1;
	          while (j >= 0 && arr[j] > key) {
	              arr[j + 1] = arr[j];
	              j--;
	          }
	          arr[j + 1] = key;
	      }
	  }
	  
	  void bucketSort(std::vector<double>& arr) {
	      int n = arr.size();
	      if (n <= 1) return;
	  
	      double minVal = *std::min_element(arr.begin(), arr.end());
	      double maxVal = *std::max_element(arr.begin(), arr.end());
	  
	      if (minVal == maxVal) return;
	  
	      std::vector<std::vector<double>> buckets(n);
	  
	      // Distribute
	      for (int i = 0; i < n; ++i) {
	          double norm = (arr[i] - minVal) / (maxVal - minVal);
	          int bucketIdx = static_cast<int>(norm * (n - 1));
	          buckets[bucketIdx].push_back(arr[i]);
	      }
	  
	      // Sort
	      for (int i = 0; i < n; ++i) {
	          insertionSort(buckets[i]);
	      }
	  
	      // Concatenate
	      int idx = 0;
	      for (int i = 0; i < n; ++i) {
	          for (double val : buckets[i]) {
	              arr[idx++] = val;
	          }
	      }
	  }
	  
	  int main() {
	      std::vector<double> data = {0.42, 0.32, 0.53, 0.23, 0.72, 0.55};
	      bucketSort(data);
	      std::cout << "Sorted: ";
	      for (double val : data) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function insertionSort(arr) {
	      for (let i = 1; i < arr.length; i++) {
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
	  
	  function bucketSort(arr) {
	      const n = arr.length;
	      if (n <= 1) return arr;
	  
	      let minVal = arr[0];
	      let maxVal = arr[0];
	      for (let i = 1; i < n; i++) {
	          if (arr[i] < minVal) minVal = arr[i];
	          if (arr[i] > maxVal) maxVal = arr[i];
	      }
	  
	      if (minVal === maxVal) return arr;
	  
	      const buckets = Array.from({ length: n }, () => []);
	  
	      // Distribute
	      for (let i = 0; i < n; i++) {
	          const norm = (arr[i] - minVal) / (maxVal - minVal);
	          const bucketIdx = Math.floor(norm * (n - 1));
	          buckets[bucketIdx].push(arr[i]);
	      }
	  
	      // Sort
	      for (let i = 0; i < n; i++) {
	          insertionSort(buckets[i]);
	      }
	  
	      // Concatenate
	      let idx = 0;
	      for (let i = 0; i < n; i++) {
	          for (let j = 0; j < buckets[i].length; j++) {
	              arr[idx++] = buckets[i][j];
	          }
	      }
	      return arr;
	  }
	  
	  // Example
	  const data = [0.42, 0.32, 0.53, 0.23, 0.72, 0.55];
	  bucketSort(data);
	  console.log("Sorted:", data);
	  ```
	  
	  ```java
	  import java.util.ArrayList;
	  import java.util.Arrays;
	  import java.util.List;
	  
	  public class BucketSort {
	      private static void insertionSort(List<Double> bucket) {
	          int n = bucket.size();
	          for (int i = 1; i < n; i++) {
	              double key = bucket.get(i);
	              int j = i - 1;
	              while (j >= 0 && bucket.get(j) > key) {
	                  bucket.set(j + 1, bucket.get(j));
	                  j--;
	              }
	              bucket.set(j + 1, key);
	          }
	      }
	  
	      public static void bucketSort(double[] arr) {
	          int n = arr.length;
	          if (n <= 1) return;
	  
	          double minVal = arr[0];
	          double maxVal = arr[0];
	          for (int i = 1; i < n; i++) {
	              if (arr[i] < minVal) minVal = arr[i];
	              if (arr[i] > maxVal) maxVal = arr[i];
	          }
	  
	          if (minVal == maxVal) return;
	  
	          List<List<Double>> buckets = new ArrayList<>(n);
	          for (int i = 0; i < n; i++) {
	              buckets.add(new ArrayList<>());
	          }
	  
	          // Distribute
	          for (int i = 0; i < n; i++) {
	              double norm = (arr[i] - minVal) / (maxVal - minVal);
	              int bucketIdx = (int) (norm * (n - 1));
	              buckets.get(bucketIdx).add(arr[i]);
	          }
	  
	          // Sort
	          for (int i = 0; i < n; i++) {
	              insertionSort(buckets.get(i));
	          }
	  
	          // Concatenate
	          int idx = 0;
	          for (int i = 0; i < n; i++) {
	              for (double val : buckets.get(i)) {
	                  arr[idx++] = val;
	              }
	          }
	      }
	  
	      public static void main(String[] args) {
	          double[] data = {0.42, 0.32, 0.53, 0.23, 0.72, 0.55};
	          bucketSort(data);
	          System.out.println("Sorted: " + Arrays.toString(data));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  
	  struct Node {
	      double data;
	      struct Node* next;
	  };
	  
	  void insertionSort(struct Node** headRef) {
	      struct Node* sorted = NULL;
	      struct Node* current = *headRef;
	      while (current != NULL) {
	          struct Node* next = current->next;
	          if (sorted == NULL || sorted->data >= current->data) {
	              current->next = sorted;
	              sorted = current;
	          } else {
	              struct Node* search = sorted;
	              while (search->next != NULL && search->next->data < current->data) {
	                  search = search->next;
	              }
	              current->next = search->next;
	              search->next = current;
	          }
	          current = next;
	      }
	      *headRef = sorted;
	  }
	  
	  void bucketSort(double arr[], int n) {
	      if (n <= 1) return;
	  
	      double minVal = arr[0];
	      double maxVal = arr[0];
	      for (int i = 1; i < n; i++) {
	          if (arr[i] < minVal) minVal = arr[i];
	          if (arr[i] > maxVal) maxVal = arr[i];
	      }
	  
	      if (minVal == maxVal) return;
	  
	      struct Node** buckets = (struct Node**)malloc(n * sizeof(struct Node*));
	      for (int i = 0; i < n; i++) {
	          buckets[i] = NULL;
	      }
	  
	      // Distribute
	      for (int i = 0; i < n; i++) {
	          double norm = (arr[i] - minVal) / (maxVal - minVal);
	          int bucketIdx = (int)(norm * (n - 1));
	          
	          struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
	          newNode->data = arr[i];
	          newNode->next = buckets[bucketIdx];
	          buckets[bucketIdx] = newNode;
	      }
	  
	      // Sort each bucket
	      for (int i = 0; i < n; i++) {
	          insertionSort(&buckets[i]);
	      }
	  
	      // Concatenate and free memory
	      int idx = 0;
	      for (int i = 0; i < n; i++) {
	          struct Node* current = buckets[i];
	          while (current != NULL) {
	              arr[idx++] = current->data;
	              struct Node* temp = current;
	              current = current->next;
	              free(temp);
	          }
	      }
	      free(buckets);
	  }
	  
	  int main() {
	      double data[] = {0.42, 0.32, 0.53, 0.23, 0.72, 0.55};
	      int n = sizeof(data) / sizeof(data[0]);
	      bucketSort(data, n);
	      printf("Sorted: ");
	      for (int i = 0; i < n; i++) {
	          printf("%f ", data[i]);
	      }
	      printf("\n");
	      return 0;
	  }
	  ```
	  
	  :::
-
- # Recursive Variant
  collapsed:: true
	- > [!tip] Recursive Bucket Sort for High Density Clustered Data
	  > Standard bucket sort uses Insertion Sort as the subroutine. If buckets contain too many values, sorting degrades.
	  > A recursive bucket sort variant applies the bucket sort algorithm recursively to each sub-bucket until the bucket contains at most a threshold size of elements.
	-
	- :::code-tabs
	  
	  ```python
	  def recursive_bucket_sort(arr, bucket_size=0.1):
	      """
	      Recursive Bucket Sort
	      Applies bucket partitioning recursively to handle sub-clusters.
	      """
	      if len(arr) <= 1:
	          return arr
	      
	      min_val = min(arr)
	      max_val = max(arr)
	      
	      if min_val == max_val:
	          return arr
	          
	      bucket_count = int((max_val - min_val) / bucket_size) + 1
	      buckets = [[] for _ in range(bucket_count)]
	      
	      for val in arr:
	          idx = int((val - min_val) / bucket_size)
	          if idx >= bucket_count:
	              idx = bucket_count - 1
	          buckets[idx].append(val)
	          
	      sorted_arr = []
	      for b in buckets:
	          # Recursively sort buckets
	          sorted_arr.extend(recursive_bucket_sort(b, bucket_size))
	          
	      return sorted_arr
	  
	  if __name__ == "__main__":
	      data = [0.42, 0.32, 0.53, 0.23, 0.72, 0.55]
	      print("Recursive Sorted:", recursive_bucket_sort(data))
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  std::vector<double> recursiveBucketSort(std::vector<double> arr, double bucketSize = 0.1) {
	      if (arr.size() <= 1) return arr;
	      double minVal = *std::min_element(arr.begin(), arr.end());
	      double maxVal = *std::max_element(arr.begin(), arr.end());
	      if (minVal == maxVal) return arr;
	  
	      int bucketCount = static_cast<int>((maxVal - minVal) / bucketSize) + 1;
	      std::vector<std::vector<double>> buckets(bucketCount);
	  
	      for (double val : arr) {
	          int bucketIdx = static_cast<int>((val - minVal) / bucketSize);
	          if (bucketIdx >= bucketCount) bucketIdx = bucketCount - 1;
	          buckets[bucketIdx].push_back(val);
	      }
	  
	      std::vector<double> sortedArr;
	      for (int i = 0; i < bucketCount; ++i) {
	          std::vector<double> sortedBucket = recursiveBucketSort(buckets[i], bucketSize);
	          sortedArr.insert(sortedArr.end(), sortedBucket.begin(), sortedBucket.end());
	      }
	      return sortedArr;
	  }
	  
	  int main() {
	      std::vector<double> data = {0.42, 0.32, 0.53, 0.23, 0.72, 0.55};
	      std::vector<double> result = recursiveBucketSort(data);
	      std::cout << "Recursive Sorted: ";
	      for (double val : result) std::cout << val << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function recursiveBucketSort(arr, bucketSize = 0.1) {
	      if (arr.length <= 1) return arr;
	      let minVal = arr[0], maxVal = arr[0];
	      for (let i = 1; i < arr.length; i++) {
	          if (arr[i] < minVal) minVal = arr[i];
	          if (arr[i] > maxVal) maxVal = arr[i];
	      }
	      if (minVal === maxVal) return arr;
	  
	      const bucketCount = Math.floor((maxVal - minVal) / bucketSize) + 1;
	      const buckets = Array.from({ length: bucketCount }, () => []);
	  
	      for (let i = 0; i < arr.length; i++) {
	          let bucketIdx = Math.floor((arr[i] - minVal) / bucketSize);
	          if (bucketIdx >= bucketCount) bucketIdx = bucketCount - 1;
	          buckets[bucketIdx].push(arr[i]);
	      }
	  
	      const sortedArr = [];
	      for (let i = 0; i < bucketCount; i++) {
	          const sortedBucket = recursiveBucketSort(buckets[i], bucketSize);
	          for (let j = 0; j < sortedBucket.length; j++) {
	              sortedArr.push(sortedBucket[j]);
	          }
	      }
	      return sortedArr;
	  }
	  
	  // Example
	  const data = [0.42, 0.32, 0.53, 0.23, 0.72, 0.55];
	  console.log("Recursive Sorted:", recursiveBucketSort(data));
	  ```
	  
	  ```java
	  import java.util.ArrayList;
	  import java.util.List;
	  import java.util.Collections;
	  
	  public class RecursiveBucketSort {
	      public static List<Double> recursiveBucketSort(List<Double> arr, double bucketSize) {
	          if (arr.size() <= 1) return arr;
	          double minVal = arr.get(0);
	          double maxVal = arr.get(0);
	          for (double val : arr) {
	              if (val < minVal) minVal = val;
	              if (val > maxVal) maxVal = val;
	          }
	          if (minVal == maxVal) return arr;
	  
	          int bucketCount = (int) ((maxVal - minVal) / bucketSize) + 1;
	          List<List<Double>> buckets = new ArrayList<>(bucketCount);
	          for (int i = 0; i < bucketCount; i++) {
	              buckets.add(new ArrayList<>());
	          }
	  
	          for (double val : arr) {
	              int bucketIdx = (int) ((val - minVal) / bucketSize);
	              if (bucketIdx >= bucketCount) bucketIdx = bucketCount - 1;
	              buckets.get(bucketIdx).add(val);
	          }
	  
	          List<Double> sortedArr = new ArrayList<>();
	          for (int i = 0; i < bucketCount; i++) {
	              List<Double> sortedBucket = recursiveBucketSort(buckets.get(i), bucketSize);
	              sortedArr.addAll(sortedBucket);
	          }
	          return sortedArr;
	      }
	  
	      public static void main(String[] args) {
	          List<Double> data = Arrays.asList(0.42, 0.32, 0.53, 0.23, 0.72, 0.55);
	          System.out.println("Recursive Sorted: " + recursiveBucketSort(data, 0.1));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  
	  struct Node {
	      double data;
	      struct Node* next;
	  };
	  
	  struct Node* recursiveBucketSortList(struct Node* head, double bucketSize) {
	      if (head == NULL || head->next == NULL) return head;
	      
	      double minVal = head->data;
	      double maxVal = head->data;
	      struct Node* curr = head;
	      while (curr != NULL) {
	          if (curr->data < minVal) minVal = curr->data;
	          if (curr->data > maxVal) maxVal = curr->data;
	          curr = curr->next;
	      }
	      if (minVal == maxVal) return head;
	  
	      int bucketCount = (int)((maxVal - minVal) / bucketSize) + 1;
	      struct Node** buckets = (struct Node**)malloc(bucketCount * sizeof(struct Node*));
	      for (int i = 0; i < bucketCount; i++) buckets[i] = NULL;
	  
	      curr = head;
	      while (curr != NULL) {
	          struct Node* nextNode = curr->next;
	          int idx = (int)((curr->data - minVal) / bucketSize);
	          if (idx >= bucketCount) idx = bucketCount - 1;
	          
	          curr->next = buckets[idx];
	          buckets[idx] = curr;
	          curr = nextNode;
	      }
	  
	      struct Node* newHead = NULL;
	      struct Node* tail = NULL;
	      for (int i = 0; i < bucketCount; i++) {
	          struct Node* sortedBucket = recursiveBucketSortList(buckets[i], bucketSize);
	          if (sortedBucket == NULL) continue;
	          if (newHead == NULL) {
	              newHead = sortedBucket;
	          } else {
	              tail->next = sortedBucket;
	          }
	          tail = sortedBucket;
	          while (tail->next != NULL) {
	              tail = tail->next;
	          }
	      }
	      free(buckets);
	      return newHead;
	  }
	  
	  int main() {
	      double data[] = {0.42, 0.32, 0.53, 0.23, 0.72, 0.55};
	      int n = sizeof(data) / sizeof(data[0]);
	      struct Node* head = NULL;
	      for (int i = n - 1; i >= 0; i--) {
	          struct Node* temp = (struct Node*)malloc(sizeof(struct Node));
	          temp->data = data[i];
	          temp->next = head;
	          head = temp;
	      }
	      
	      head = recursiveBucketSortList(head, 0.1);
	      
	      printf("Recursive Sorted: ");
	      struct Node* curr = head;
	      while (curr != NULL) {
	          printf("%f ", curr->data);
	          struct Node* temp = curr;
	          curr = curr->next;
	          free(temp);
	      }
	      printf("\n");
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Bucket Sort
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Are elements\nuniformly distributed?"}
	      Q -- No --> R1["❌ Do not use Bucket Sort\n(degrades to O(n²))"]
	      Q -- Yes --> S1{"Can you normalize elements\ninto [0, 1) range?"}
	      S1 -- No --> R2["❌ Do not use Bucket Sort"]
	      S1 -- Yes --> S2{"Are memory resources\nrestricted?"}
	      S2 -- Yes --> R3["❌ Avoid (requires auxiliary space)"]
	      S2 -- No --> R4["✅ Use Bucket Sort (O(n + k) performance)"]
	  ```
	-
	- ## ✅ Use Bucket Sort When
		- Elements are **uniformly distributed** over a known range.
		- Floating-point numbers represent your keys (particularly in the range $[0, 1)$).
		- You require a **stable sort** and have sufficient auxiliary memory.
		- You can afford the memory overhead of maintaining bucket arrays to achieve linear-time sorting.
	-
	- ## ❌ Avoid Bucket Sort When
		- Elements are clustered closely or show **highly skewed distributions** (leads to $O(n^2)$).
		- Memory is highly restricted, where in-place algorithms like **Quick Sort** or **Heap Sort** are preferred.
-
- # Key Takeaways
  collapsed:: true
	- **Distribution sort** — partitions input into $n$ uniform buckets before sorting them individually.
	- **Stability** — stable when using a stable sorting subroutine like Insertion Sort inside each bucket.
	- **Uniform distribution requirement** — critical for maintaining $O(n + k)$ average case efficiency.
	- **Recursive scaling** — can be recursively applied on bucket segments if element density is skewed.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Wikipedia -> Bucket sort](https://en.wikipedia.org/wiki/Bucket_sort)
		- [GeeksforGeeks -> Bucket Sort](https://www.geeksforgeeks.org/bucket-sort-2/)