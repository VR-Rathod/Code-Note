---
date: 2025-03-26T12:40:55+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Merge Sort Algorithm – Divide and Conquer Sorting Explained
description: "Merge sort divides the array in half, sorts each half, then merges. Covers O(n log n) guaranteed time, stable sort, external sort applications, and top-down vs."
keywords: "merge sort, divide and conquer, O(n log n), stable sort, external sort, recursive sort, time complexity, space complexity, comparison sort, algorithm implementation"
---

- # Explanation
	- **Merge Sort** is a divide-and-conquer sorting algorithm. It divides the list into smaller sublists, sorts each sublist recursively, and then merges the sorted sublists to produce the final sorted list.
-
- # Steps:
	- If the list has more than one element, split it into two halves.
	-
	- Recursively apply the same operation on both halves.
	-
	- Merge the two sorted halves into a single sorted list.
	-
	- Repeat the process until the list is sorted.
-
- # Time Complexity:
	- **Best Case, Average Case, Worst Case:** **O(n log n)**
-
- ```python
  def merge_sort(arr):
      if len(arr) > 1:
          # Find the middle of the array
          mid = len(arr) // 2
          left_half = arr[:mid]
          right_half = arr[mid:]
  
          # Recursively sort both halves
          merge_sort(left_half)
          merge_sort(right_half)
  
          # Merge the sorted halves
          i = j = k = 0
          while i < len(left_half) and j < len(right_half):
              if left_half[i] < right_half[j]:
                  arr[k] = left_half[i]
                  i += 1
              else:
                  arr[k] = right_half[j]
                  j += 1
              k += 1
  
          # Check if any element was left in the left or right half
          while i < len(left_half):
              arr[k] = left_half[i]
              i += 1
              k += 1
          while j < len(right_half):
              arr[k] = right_half[j]
              j += 1
              k += 1
  
  # Example usage
  arr = [38, 27, 43, 3, 9, 82, 10]
  merge_sort(arr)
  print("Sorted array is:", arr)
  ```