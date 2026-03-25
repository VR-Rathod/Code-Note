---
seoTitle: Counting Sort Algorithm – Linear Time Integer Sorting Guide
description: "Counting sort achieves O(n+k) time by counting element frequencies. Learn stable counting sort, prefix sum technique, limitations, and comparison with radix."
keywords: "counting sort, integer sort, O(n+k), linear time sort, stable sort, prefix sum, frequency array, time complexity, space complexity, non-comparison sort"
---

# Explanation
	- **Counting Sort** is a non-comparison-based sorting algorithm that counts the occurrences of each distinct element in the input array and uses this count to place elements in the correct position in the sorted output.
	-
- # Steps:
	- Find the range of the input (maximum and minimum values).
	-
	- Create a count array where the index represents the element and the value at each index represents the frequency of that element.
	-
	- Modify the count array by adding the count of previous elements to each index, which helps in determining the correct position of each element.
	-
	- Build the output array using the modified count array.
-
- # Time Complexity:
	- **Best Case, Average Case, Worst Case:** **O(n + k)** where `n` is the number of elements and `k` is the range of the input.
-
- ```python
  def counting_sort(arr):
      max_val = max(arr)
      min_val = min(arr)
      range_of_elements = max_val - min_val + 1
      count = [0] * range_of_elements
      output = [0] * len(arr)
  
      # Store count of occurrences
      for num in arr:
          count[num - min_val] += 1
  
      # Change count[i] to be the actual position of this number in output[]
      for i in range(1, len(count)):
          count[i] += count[i - 1]
  
      # Build the output array
      for num in reversed(arr):
          output[count[num - min_val] - 1] = num
          count[num - min_val] -= 1
  
      return output
  
  # Example usage
  arr = [4, 2, 2, 8, 3, 3, 1]
  print("Sorted array is:", counting_sort(arr))
  ```