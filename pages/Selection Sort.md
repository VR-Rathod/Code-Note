---
seoTitle: Selection Sort Algorithm – Implementation and Complexity Guide
description: "Selection sort finds the minimum element and places it at the front repeatedly. Covers O(n^2) time, O(1) space, unstable sort behavior, and comparison with."
keywords: "selection sort, sorting algorithm, O(n^2), in-place sort, unstable sort, minimum selection, time complexity, space complexity, comparison sort, algorithm implementation"
---

# Explanation
	- **Selection Sort** is a simple comparison-based sorting algorithm. It works by repeatedly selecting the smallest (or largest, depending on sorting order) element from the unsorted part of the list and swapping it with the first unsorted element. This process is repeated until the entire list is sorted.
	-
- # Steps:
	- Start with the first element in the list.
	-
	- Find the smallest element in the unsorted portion of the list.
	-
	- Swap the smallest element with the first unsorted element.
	-
	- Move the boundary of the sorted portion to the right.
	-
	- Repeat the process until the entire list is sorted.
-
- # Time Complexity:
	- **Best Case, Average Case, Worst Case:** **O(n^2)**
-
- ```python
  def selection_sort(arr):
      n = len(arr)
  
      # Traverse through all array elements
      for i in range(n):
          # Find the minimum element in unsorted part
          min_index = i
          for j in range(i + 1, n):
              if arr[j] < arr[min_index]:
                  min_index = j
          
          # Swap the found minimum element with the first element
          arr[i], arr[min_index] = arr[min_index], arr[i]
  
  # Example usage
  arr = [64, 25, 12, 22, 11]
  selection_sort(arr)
  print("Sorted array is:", arr)
  ```