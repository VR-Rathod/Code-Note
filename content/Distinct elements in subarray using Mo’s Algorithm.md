---
date: 2025-03-26T12:40:55+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Distinct Elements in Subarray Using Mo's Algorithm Explained
description: "Mo's algorithm answers range queries offline in O((n+q) sqrt(n)) time. Learn block decomposition, add/remove operations, and counting distinct elements in."
keywords: "Mo's algorithm, distinct elements, range query, offline algorithm, block decomposition, sqrt decomposition, time complexity, space complexity, subarray query, algorithm"
---

- # Explanation
	- **Mo’s Algorithm** is a square root decomposition technique for answering range queries efficiently. It is especially useful for problems where we need to find distinct elements in a subarray. The algorithm sorts the queries and processes them in a way that minimizes the movement of the window boundaries, resulting in efficient querying.
-
- # Steps
	- **Divide the array** into blocks of size √n.
	-
	- **Sort the queries** based on block number and the right endpoint of the range.
	-
	- For each query, adjust the current window (move the left or right boundary) to match the range specified in the query while keeping track of the distinct elements.
	-
	- **Return the answer** for each query after processing the range.
-
- #### **Time Complexity:**
	- O((n + q) * √n), where `n` is the length of the array and `q` is the number of queries.
-
- ```python
  import math
  
  class MoAlgorithm:
      def __init__(self, arr):
          self.arr = arr
          self.n = len(arr)
          self.block_size = int(math.sqrt(self.n))
  
      def count_distinct_in_range(self, queries):
          result = []
          current_l = 0
          current_r = -1
          freq = [0] * (max(self.arr) + 1)
          distinct_count = 0
  
          # Function to add a point to the current range
          def add(x):
              nonlocal distinct_count
              freq[x] += 1
              if freq[x] == 1:
                  distinct_count += 1
  
          # Function to remove a point from the current range
          def remove(x):
              nonlocal distinct_count
              if freq[x] == 1:
                  distinct_count -= 1
              freq[x] -= 1
  
          # Sort queries by block and right endpoint
          queries.sort(key=lambda q: (q[0] // self.block_size, q[1]))
  
          for l, r in queries:
              while current_r < r:
                  current_r += 1
                  add(self.arr[current_r])
              while current_r > r:
                  remove(self.arr[current_r])
                  current_r -= 1
              while current_l < l:
                  remove(self.arr[current_l])
                  current_l += 1
              while current_l > l:
                  current_l -= 1
                  add(self.arr[current_l])
              
              result.append(distinct_count)
          
          return result
  
  # Example usage
  arr = [1, 2, 1, 3, 2, 1, 3, 2]
  queries = [(0, 3), (1, 4), (2, 6), (0, 7)]
  mo = MoAlgorithm(arr)
  result = mo.count_distinct_in_range(queries)
  print(f"Distinct elements in each query range: {result}")
  ```