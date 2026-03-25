---
seoTitle: Disjoint Set Data Structure – Union-Find with Path Compression
description: "Disjoint set (Union-Find) tracks non-overlapping sets with near-constant operations. Covers union by rank, path compression, inverse Ackermann complexity, and."
keywords: "disjoint set, Union-Find, path compression, union by rank, inverse Ackermann, connected components, O(alpha n), time complexity, space complexity, graph algorithm"
---

# Explanation
	- The **Disjoint-set** (or **Union-Find**) data structure is used to efficiently manage a collection of disjoint sets. It supports two main operations: **find** (finding the representative or leader of a set) and **union** (merging two sets).
-
- # Steps
	- **Find operation**: Find the representative (or parent) of an element, typically using path compression for efficiency.
	- **Union operation**: Combine two sets by linking the root of one set to the root of the other, using union by rank or size for efficiency.
-
- # Time Complexity
	- **Time complexity**: O(α(n)), where α is the inverse Ackermann function, which grows extremely slowly, almost constant for all practical purposes.
-
- ```python
  class DisjointSet:
      def __init__(self, n):
          self.parent = list(range(n))
          self.rank = [1] * n
  
      def find(self, x):
          if self.parent[x] != x:
              self.parent[x] = self.find(self.parent[x])  # Path compression
          return self.parent[x]
  
      def union(self, x, y):
          root_x = self.find(x)
          root_y = self.find(y)
          
          if root_x != root_y:
              # Union by rank
              if self.rank[root_x] > self.rank[root_y]:
                  self.parent[root_y] = root_x
              elif self.rank[root_x] < self.rank[root_y]:
                  self.parent[root_x] = root_y
              else:
                  self.parent[root_y] = root_x
                  self.rank[root_x] += 1
  
  # Example usage
  ds = DisjointSet(5)
  ds.union(0, 1)
  ds.union(1, 2)
  print(ds.find(0))  # Should print 0
  print(ds.find(2))  # Should print 0
  ```