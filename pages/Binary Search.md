---
seoTitle: Binary Search Algorithm – Implementation and Complexity
description: "Binary search efficiently finds elements in sorted arrays by halving the search space each step. Covers iterative and recursive implementations with O(log n)."
keywords: "binary search, search algorithm, sorted array, O(log n), divide and conquer, iterative binary search, recursive binary search, time complexity, space complexity, algorithm implementation"
---

# Explanation
	- Binary Search is an efficient algorithm used to find an element in a sorted list or array. It works by dividing the list into two halves and repeatedly narrowing down the search space until the target element is found.
-
- # Steps:
	- The **list must be sorted** first.
	-
	- Start with the low pointer at index 0 and the high pointer at the last index of the list.
	-
	- Find the middle element: `mid = (low + high) // 2`.
	-
	- **Compare the middle element** with the target:
		- If the middle element is equal to the target, return the index.
		-
		- If the middle element is greater than the target, the target must be in the left half, so set `high = mid - 1`.
		-
		- If the middle element is smaller than the target, the target must be in the right half, so set `low = mid + 1`.
		-
	- This process repeats until the target element is found or the search space is exhausted.
-
- # Time Complexity:
	- The time complexity of Binary Search is **O(log n)**, where **n** is the number of elements in the list or array.
-
- ```python
  def binary_search(arr, target):
      low = 0
      high = len(arr) - 1
  
      while low <= high:
          mid = (low + high) // 2  # Find middle index
          if arr[mid] == target:   # Target found
              return mid
          elif arr[mid] < target:  # Target is in the right half
              low = mid + 1
          else:                    # Target is in the left half
              high = mid - 1
  
      return -1  # Target not found
  
  # Example usage
  arr = [1, 3, 5, 7, 9, 11, 13]
  target = 9
  result = binary_search(arr, target)
  
  if result != -1:
      print(f"Element found at index {result}")
  else:
      print("Element not found")
  ```