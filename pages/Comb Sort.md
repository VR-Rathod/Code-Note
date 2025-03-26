# Explanation
	- **Comb Sort** is a variation of **Bubble Sort** that improves on it by using a gap sequence. It eliminates small values near the end of the list more quickly by using a larger gap between comparisons.
- # Steps:
	- Start with a large gap, typically about 1.3 times the size of the list.
	- Compare elements that are `gap` positions apart.
	- Reduce the gap after each pass and continue sorting.
-
- # Time Complexity:
	- **Best Case:** **O(n log n)**
	- **Worst Case:** **O(n^2)**.
-
- ```python
  def comb_sort(arr):
      n = len(arr)
      gap = n
      swapped = True
      while gap > 1 or swapped:
          gap = max(1, int(gap / 1.3))
          swapped = False
          for i in range(n - gap):
              if arr[i] > arr[i + gap]:
                  arr[i], arr[i + gap] = arr[i + gap], arr[i]
                  swapped = True
      return arr
  
  # Example usage
  arr = [5, 2, 9, 1, 5, 6]
  print("Sorted array is:", comb_sort(arr))
  ```