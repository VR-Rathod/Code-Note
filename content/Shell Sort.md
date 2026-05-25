---
seoTitle: Shell Sort Algorithm – Gap Sequence Sorting Explained
description: "Shell sort generalizes insertion sort by sorting elements far apart first. Covers gap sequences (Shell, Knuth, Ciura), O(n log^2 n) complexity, and adaptive."
keywords: "shell sort, sorting algorithm, gap sequence, insertion sort, Knuth gap, Ciura gap, O(n log^2 n), time complexity, space complexity, comparison sort, in-place sort"
---

- # Explanation
	- **Shell Sort** is an in-place comparison-based sorting algorithm that generalizes **Insertion Sort** to allow the exchange of far apart elements. It works by comparing elements that are a certain gap apart, and gradually reducing the gap.
-
- # Steps:
	- Start with a large gap and reduce the gap until it becomes 1.
	-
	- For each gap, perform **Insertion Sort** on the elements that are `gap` positions apart.
	-
- # Time Complexity:
	- **Best Case:** **O(n log n)**
	- **Worst Case:** **O(n^2)** (depending on gap sequence used).
-
- ```python
  def shell_sort(arr):
      n = len(arr)
      gap = n // 2
      while gap > 0:
          for i in range(gap, n):
              temp = arr[i]
              j = i
              while j >= gap and arr[j - gap] > temp:
                  arr[j] = arr[j - gap]
                  j -= gap
              arr[j] = temp
          gap //= 2
      return arr
  
  # Example usage
  arr = [5, 2, 9, 1, 5, 6]
  print("Sorted array is:", shell_sort(arr))
  ```