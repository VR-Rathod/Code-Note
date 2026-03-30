---
seoTitle: Radix Sort Algorithm – Non-Comparison Integer Sorting Guide
description: "Radix sort sorts integers digit by digit using counting sort as a subroutine. Covers LSD and MSD radix sort, O(nk) time, and comparison with comparison-based."
keywords: "radix sort, integer sort, LSD radix sort, MSD radix sort, counting sort, O(nk), non-comparison sort, time complexity, space complexity, digit sort, algorithm"
---

- # Explanation
	- **Radix Sort** is a non-comparative sorting algorithm that sorts numbers digit by digit, starting from the least significant digit to the most significant digit, using a stable sub-sorting algorithm (such as counting sort).
	-
- # Steps:
	- Sort the elements based on the least significant digit.
	-
	- Move to the next more significant digit and repeat the sorting.
	-
	- Continue this process until all digits are processed.
-
- # Time Complexity:
	- **Best, Average, Worst Case:** **O(nk)**, where `n` is the number of elements and `k` is the number of digits.
-
- ```python
  def radix_sort(arr):
      def counting_sort(arr, exp):
          output = [0] * len(arr)
          count = [0] * 10
  
          # Count occurrences of digits
          for num in arr:
              index = num // exp
              count[index % 10] += 1
  
          # Calculate positions
          for i in range(1, 10):
              count[i] += count[i - 1]
  
          # Place the elements in their sorted position
          for i in range(len(arr) - 1, -1, -1):
              num = arr[i]
              index = num // exp
              output[count[index % 10] - 1] = num
              count[index % 10] -= 1
  
          # Copy the sorted output to the original array
          for i in range(len(arr)):
              arr[i] = output[i]
  
      # Get the maximum element
      max_val = max(arr)
      exp = 1
  
      while max_val // exp > 0:
          counting_sort(arr, exp)
          exp *= 10
  
      return arr
  
  # Example usage
  arr = [170, 45, 75, 90, 802, 24, 2, 66]
  print("Sorted array is:", radix_sort(arr))
  ```