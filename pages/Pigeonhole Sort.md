---
seoTitle: Pigeonhole Sort Algorithm – Integer Sorting by Key Mapping
description: "Pigeonhole sort places elements into pigeonholes based on their key values. Covers O(n+range) time, comparison with counting sort, and use cases for small key."
keywords: "pigeonhole sort, integer sort, O(n+range), counting sort, key mapping, non-comparison sort, time complexity, space complexity, small range, algorithm implementation"
---

# Explanation
	- **Pigeonhole Sort** is a comparison-based sorting algorithm that works well when the range of the elements is small. It maps each element to a "hole" (index) and places it in the corresponding location.
- # Steps:
	- Find the minimum and maximum values in the input.
	- Create an array of pigeonholes (or slots).
	- Place each element in its corresponding pigeonhole.
	- Collect the elements from the pigeonholes and form the sorted array.
- # Time Complexity:
	- **Best Case, Average Case, Worst Case:** **O(n + range)**.
-
- ```python
  def pigeonhole_sort(arr):
      min_val, max_val = min(arr), max(arr)
      range_of_elements = max_val - min_val + 1
      holes = [0] * range_of_elements
  
      # Map elements to pigeonholes
      for num in arr:
          holes[num - min_val] += 1
  
      # Collect elements from pigeonholes
      sorted_arr = []
      for i in range(range_of_elements):
          sorted_arr.extend([i + min_val] * holes[i])
  
      return sorted_arr
  
  # Example usage
  arr = [8, 3, 2, 9, 4, 6, 7]
  print("Sorted array is:", pigeonhole_sort(arr))
  ```