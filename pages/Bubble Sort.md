# Explanation
	- **Bubble Sort** is a simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The process is repeated until the list is sorted.
-
- # Steps:
	- Traverse the list, compare adjacent elements, and swap them if they are in the wrong order.
	-
	- After each pass, the largest unsorted element is "bubbled" to the end.
	-
	- Repeat until no more swaps are needed.
-
- # Time Complexity:
	- **Best Case:** **O(n)** (when the list is already sorted).
	- **Average and Worst Case:** **O(n^2)**.
-
- ```python
  def bubble_sort(arr):
      n = len(arr)
      for i in range(n):
          swapped = False
          for j in range(0, n-i-1):
              if arr[j] > arr[j+1]:
                  arr[j], arr[j+1] = arr[j+1], arr[j]
                  swapped = True
          if not swapped:
              break
      return arr
  
  # Example usage
  arr = [64, 34, 25, 12, 22, 11, 90]
  print("Sorted array is:", bubble_sort(arr))
  ```