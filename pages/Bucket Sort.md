# Explanation
	- **Bucket Sort** is a distribution-based sorting algorithm that divides the range of the input elements into a number of buckets, sorts each bucket, and then concatenates the sorted buckets.
	-
- # Steps:
	- Divide the input array into `n` buckets.
	-
	- Sort each bucket individually (usually using a different sorting algorithm).
	-
	- Concatenate the sorted buckets to get the final sorted array.
-
- # Time Complexity:
	- **Best Case, Average Case:** **O(n + k)** where `n` is the number of elements and `k` is the number of buckets.
	- **Worst Case:** **O(n^2)** (if all elements fall into a single bucket).
-
- ```python
  def bucket_sort(arr):
      if len(arr) == 0:
          return arr
      # Create `n` empty buckets
      bucket_count = len(arr)
      min_val, max_val = min(arr), max(arr)
      bucket_range = (max_val - min_val) / bucket_count
  
      # Create the buckets and distribute elements into them
      buckets = [[] for _ in range(bucket_count)]
      for num in arr:
          index = int((num - min_val) / bucket_range)
          if index == bucket_count:
              index -= 1
          buckets[index].append(num)
  
      # Sort each bucket and concatenate them
      sorted_arr = []
      for bucket in buckets:
          sorted_arr.extend(sorted(bucket))
  
      return sorted_arr
  
  # Example usage
  arr = [0.42, 0.32, 0.53, 0.23, 0.72, 0.55]
  print("Sorted array is:", bucket_sort(arr))
  ```