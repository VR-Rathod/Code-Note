---
date: 2025-03-26T12:40:55+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Interval Tree Explained – Overlapping Interval Query Structure
description: "Interval trees efficiently find all intervals overlapping a query point or range. Covers augmented BST, centered interval tree, O(log n + k) query, and."
keywords: "interval tree, overlapping intervals, augmented BST, O(log n + k), range query, scheduling, segment overlap, time complexity, space complexity, data structure"
---

- # Explanation:
	- An **Interval Tree** is a balanced binary search tree used to store intervals. It allows querying for all intervals that overlap with a given interval.
	-
	- It is particularly useful in applications like scheduling, computational geometry, and range queries.
-
- # Steps:
	- Each node in the interval tree stores an interval and the **maximum value** of the interval's end point in its subtree.
	-
	- **Insert** and **Query** operations are similar to binary search trees with added logic to handle intervals.
-
- # Time Complexity:
	- **Insertion**: O(log n)
	-
	- **Query**: O(log n + k), where k is the number of intervals that overlap with the query interval.
-
- ```python
  class IntervalTreeNode:
      def __init__(self, interval):
          self.interval = interval
          self.max = interval[1]
          self.left = None
          self.right = None
  
  class IntervalTree:
      def __init__(self):
          self.root = None
  
      def insert(self, node, interval):
          if not node:
              return IntervalTreeNode(interval)
          
          low, high = interval
          if low < node.interval[0]:
              node.left = self.insert(node.left, interval)
          else:
              node.right = self.insert(node.right, interval)
  
          node.max = max(node.max, high)
          return node
  
      def query(self, node, interval):
          if not node:
              return []
  
          low, high = interval
          result = []
  
          if self._overlap(node.interval, interval):
              result.append(node.interval)
  
          if node.left and node.left.max >= low:
              result.extend(self.query(node.left, interval))
          
          if node.right and node.right.interval[0] <= high:
              result.extend(self.query(node.right, interval))
  
          return result
      
      def _overlap(self, interval1, interval2):
          return interval1[0] <= interval2[1] and interval2[0] <= interval1[1]
  
  # Example usage
  interval_tree = IntervalTree()
  interval_tree.root = interval_tree.insert(interval_tree.root, (1, 5))
  interval_tree.root = interval_tree.insert(interval_tree.root, (3, 8))
  interval_tree.root = interval_tree.insert(interval_tree.root, (6, 10))
  
  query_result = interval_tree.query(interval_tree.root, (4, 7))
  print("Intervals that overlap:", query_result)  # Output: [(1, 5), (3, 8), (6, 10)]
  ```