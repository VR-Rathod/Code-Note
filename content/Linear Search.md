---
seoTitle: Linear Search Algorithm – Sequential Search Implementation Guide
description: "Linear search scans each element sequentially to find a target. Covers O(n) time complexity, unsorted arrays, sentinel search optimization, and when to use it."
keywords: "linear search, sequential search, O(n), unsorted array, search algorithm, time complexity, space complexity, sentinel search, brute force, algorithm implementation"
---

# Explanation
	- Linear Search is a simple searching algorithm used to find an element in a list or array. This algorithm checks each element of the list one by one until it finds the target element.
-
- # Steps:
	- **Start** from the first element of the list.
	-
	- Compare each element with the **target element**.
	-
	- If an element matches the target, return its index.
	-
	- If no element matches the target, return **-1** (element not found).
-
- # Time Complexity:
	- The time complexity of Linear Search is **O(n)**, where **n** is the number of elements in the list or array.
-
- ```python
  def linear_search(arr, target):
      for index, element in enumerate(arr):
          if element == target:
              return index  # Target found, return index
      return -1  # Target not found
  
  # Example usage
  arr = [2, 4, 6, 8, 10]
  target = 6
  
  result = linear_search(arr, target)
  
  if result != -1:
      print(f"Element found at index {result}")
  else:
      print("Element not found")
  ```