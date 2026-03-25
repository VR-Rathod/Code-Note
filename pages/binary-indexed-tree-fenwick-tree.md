---
seoTitle: Fenwick Tree (Binary Indexed Tree) – Prefix Sum Data Structure
description: "Fenwick trees support prefix sum queries and point updates in O(log n). Covers BIT construction, update and query operations, 2D BIT, and range update."
keywords: "Fenwick tree, binary indexed tree, BIT, prefix sum, point update, O(log n), range query, 2D BIT, time complexity, space complexity, data structure"
---

- Explanation:
	- The **Binary Indexed Tree (BIT)**, also known as a **Fenwick Tree**, is a data structure that efficiently supports dynamic cumulative frequency tables.
	-
	- It allows you to compute prefix sums and update elements in **O(log n)** time. It is particularly useful for problems that require frequent range sum queries and updates.
-
- # Steps:
	- The tree is implemented using an array, where each node represents a cumulative sum of elements.
	-
	- **Update Operation**: Updates an element in the array, and its impact propagates upward.
	-
	- **Query Operation**: Computes the sum of elements from the start to a given index by summing the values of the relevant nodes.
-
- #### Time Complexity:
	- **Update**: O(log n)
	- **Query**: O(log n)
-
- ```python
  class FenwickTree:
      def __init__(self, n):
          self.n = n
          self.tree = [0] * (n + 1)
  
      def update(self, index, delta):
          while index <= self.n:
              self.tree[index] += delta
              index += index & -index  # Move to the parent node
  
      def query(self, index):
          sum = 0
          while index > 0:
              sum += self.tree[index]
              index -= index & -index  # Move to the parent node
          return sum
  
  # Example usage
  fenwick = FenwickTree(5)
  fenwick.update(1, 3)
  fenwick.update(3, 5)
  
  print(f"Sum of first 3 elements: {fenwick.query(3)}")  # Output: 8
  print(f"Sum of first 5 elements: {fenwick.query(5)}")  # Output: 8
  ```