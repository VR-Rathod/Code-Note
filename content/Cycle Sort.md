---
date: 2025-03-26T12:40:55+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Cycle Sort Algorithm – Minimum Write Sorting Explained
description: "Cycle sort minimizes the number of writes to memory by placing each element in its correct cycle position. Covers cycle detection, O(n^2) time, and use cases."
keywords: "cycle sort, sorting algorithm, minimum writes, in-place sort, cycle detection, O(n^2), time complexity, space complexity, comparison sort, memory writes"
---

- # Explanation
	- **Cycle Sort** is a non-comparative sorting algorithm that places elements at their correct positions by cycling them through the array. It is efficient for sorting arrays where the elements are distinct.
-
- # Steps:
	- For each element in the array, find its correct position by rotating the cycle.
	- Swap the element to its correct position.
	- Repeat until all elements are sorted.
-
- # Time Complexity:
	- **Best, Average, Worst Case:** **O(n^2)**.
-
- ```python
  def cycle_sort(arr):
      n = len(arr)
      for cycle_start in range(0, n - 1):
          item = arr[cycle_start]
  
          # Find the position of the element to be placed
          pos = cycle_start
          for i in range(cycle_start + 1, n):
              if arr[i] < item:
                  pos += 1
  
          # If the element is already in the correct position
          if pos == cycle_start:
              continue
  
          # Otherwise, put the element to its correct position
          while item == arr[pos]:
              pos += 1
          arr[pos], item = item, arr[pos]
  
          # Rotate the remaining elements in the cycle
          while pos != cycle_start:
              pos = cycle_start
              for i in range(cycle_start + 1, n):
                  if arr[i] < item:
                      pos += 1
              while item == arr[pos]:
                  pos += 1
              arr[pos], item = item, arr[pos]
  
      return arr
  
  # Example usage
  arr = [5, 2, 9, 1, 5, 6]
  print("Sorted array is:", cycle_sort(arr))
  ```