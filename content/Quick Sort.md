---
seoTitle: Quick Sort Algorithm – Partitioning and Complexity Analysis
description: "Quick sort partitions around a pivot and recursively sorts subarrays. Covers Lomuto and Hoare schemes, randomized pivot, O(n log n) average, and O(n^2) worst."
keywords: "quick sort, sorting algorithm, partitioning, pivot selection, O(n log n), randomized quicksort, time complexity, space complexity, in-place sort, comparison sort"
---

- # Explanation
	- **Quick Sort** is another divide-and-conquer sorting algorithm. It works by selecting a pivot element and partitioning the array into two subarrays — elements less than the pivot and elements greater than the pivot. The subarrays are then sorted recursively.
-
- # Steps:
	- Select a pivot element from the array.
	-
	- Partition the array into two subarrays: one with elements smaller than the pivot, and one with elements greater than the pivot.
	-
	- Recursively apply the same procedure to the two subarrays.
	-
	- Combine the sorted subarrays to get the final sorted array.
-
- # Time Complexity:
	- **Best Case, Average Case:** **O(n log n)**
	- **Worst Case (when the pivot is poorly chosen):** **O(n^2)**
-
- ```python
  def quick_sort(arr):
      if len(arr) <= 1:
          return arr
      pivot = arr[len(arr) // 2]  # Choose the pivot element
      left = [x for x in arr if x < pivot]  # Elements smaller than pivot
      middle = [x for x in arr if x == pivot]  # Elements equal to pivot
      right = [x for x in arr if x > pivot]  # Elements greater than pivot
      return quick_sort(left) + middle + quick_sort(right)
  
  # Example usage
  arr = [38, 27, 43, 3, 9, 82, 10]
  sorted_arr = quick_sort(arr)
  print("Sorted array is:", sorted_arr)
  ```