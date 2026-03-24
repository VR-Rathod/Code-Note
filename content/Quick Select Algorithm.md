# Explanation
	- Quick Select is used to find the **k-th smallest element** in an unordered array. It is similar to QuickSort but only partially sorts the array.
-
- # Steps
	- Choose a pivot and partition the array such that elements less than the pivot are on the left, and elements greater than the pivot are on the right.
	-
	- If the pivot position is the k-th smallest, return it.
	-
	- If the pivot position is greater than k, recursively search the left side; otherwise, search the right side.
-
- # Time Complexity
	- **O(n)** on average, **O(n^2)** in the worst case.
-
- ```python
  import random
  
  def quick_select(arr, k):
      if len(arr) == 1:
          return arr[0]
  
      pivot = random.choice(arr)
      left = [x for x in arr if x < pivot]
      right = [x for x in arr if x > pivot]
      middle = [x for x in arr if x == pivot]
  
      if k < len(left):
          return quick_select(left, k)
      elif k < len(left) + len(middle):
          return middle[0]
      else:
          return quick_select(right, k - len(left) - len(middle))
  
  # Example usage
  arr = [7, 10, 4, 3, 20, 15]
  k = 3
  print(f"The {k+1}-th smallest element is:", quick_select(arr, k))
  ```