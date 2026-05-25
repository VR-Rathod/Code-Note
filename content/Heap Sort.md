---
date: 2025-03-26T12:40:55+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Heap Sort Algorithm – In-Place O(n log n) Sorting Explained
description: "Heap sort builds a max-heap then repeatedly extracts the maximum. Covers heapify, build-heap, O(n log n) worst case, in-place sorting, and comparison with."
keywords: "heap sort, sorting algorithm, max-heap, heapify, O(n log n), in-place sort, comparison sort, time complexity, space complexity, binary heap, algorithm"
---

- # Explanation
	- **Heap Sort** is a comparison-based sorting algorithm that uses a binary heap data structure. The algorithm works by building a max heap (or min heap) and then repeatedly extracting the largest (or smallest) element and rebuilding the heap until the list is sorted.
	-
- # Steps:
	- **Build a max heap** from the input data.
	-
	- **Swap the root** of the heap (the maximum element) with the last element in the heap.
	-
	- Reduce the size of the heap by 1 and **heapify** the root of the tree.
	-
	- Repeat the process until the heap is empty.
-
- # Time Complexity:
	- **Best Case, Average Case, Worst Case:** **O(n log n)**
-
- ```python
  def heapify(arr, n, i):
      largest = i  # Initialize largest as root
      left = 2 * i + 1  # Left child
      right = 2 * i + 2  # Right child
  
      # See if left child of root exists and is greater than root
      if left < n and arr[left] > arr[largest]:
          largest = left
  
      # See if right child of root exists and is greater than root
      if right < n and arr[right] > arr[largest]:
          largest = right
  
      # Change root, if needed
      if largest != i:
          arr[i], arr[largest] = arr[largest], arr[i]  # Swap
  
          # Heapify the root
          heapify(arr, n, largest)
  
  def heap_sort(arr):
      n = len(arr)
  
      # Build a maxheap
      for i in range(n // 2 - 1, -1, -1):
          heapify(arr, n, i)
  
      # One by one extract elements
      for i in range(n - 1, 0, -1):
          arr[i], arr[0] = arr[0], arr[i]  # Swap
          heapify(arr, i, 0)
  
  # Example usage
  arr = [12, 11, 13, 5, 6, 7]
  heap_sort(arr)
  print("Sorted array is:", arr)
  ```