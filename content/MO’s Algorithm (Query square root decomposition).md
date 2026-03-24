# Explanation
	- **Mo’s Algorithm** is a square root decomposition technique for answering range queries efficiently. It is commonly used for problems involving range queries, like finding the count of distinct elements in a range or answering range sum queries.
-
- # Steps
	- **Divide** the array into blocks of size √n.
	-
	- **Sort** the queries based on block number and right endpoint.
	-
	- **Process the queries** by adjusting the left and right pointers of the current range and answering the query as you move the pointers.
	-
	- **Maintain** a frequency array or other data structure to handle the query efficiently.
-
- # Time Complexity
	- **Time complexity**: O((n + q) * √n), where `n` is the number of elements and `q` is the number of queries.
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
  
          def add(x):
              nonlocal distinct_count
              freq[x] += 1
              if freq[x] == 1:
                  distinct_count += 1
  
          def remove(x):
              nonlocal distinct_count
              if freq[x] == 1:
                  distinct_count -= 1
              freq[x] -= 1
  
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