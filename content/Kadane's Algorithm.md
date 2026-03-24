# Explanation
	- Kadane’s Algorithm is used to find the **maximum sum subarray** in a given array of integers. It works in **O(n)** time.
-
- # Steps
	- Initialize two variables: `current_sum` and `max_sum`.
	-
	- Traverse through the array, adding each element to `current_sum`.
	-
	- If `current_sum` becomes negative, reset it to 0.
	-
	- Update `max_sum` to the maximum value between `max_sum` and `current_sum`.
-
- # Time Complexity
	- **O(n)**, where `n` is the number of elements in the array.
-
- ```python
  def kadane(arr):
      max_sum = current_sum = arr[0]
      for num in arr[1:]:
          current_sum = max(num, current_sum + num)
          max_sum = max(max_sum, current_sum)
      return max_sum
  
  # Example usage
  arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
  print("Maximum Sum Subarray:", kadane(arr))
  ```