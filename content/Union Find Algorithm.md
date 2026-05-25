---
date: 2025-03-26T12:40:55+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Union-Find Algorithm – Disjoint Set with Path Compression
description: "Union-Find tracks disjoint sets with near O(1) amortized operations. Covers union by rank, path compression, inverse Ackermann complexity, and MST applications."
keywords: "Union-Find, disjoint set, path compression, union by rank, inverse Ackermann, O(alpha n), time complexity, space complexity, connected components, MST"
---

- # Explanation
	- **Union-Find** is a data structure that is used to keep track of a collection of disjoint sets.
	-
	- It supports two main operations:
		- **Find**: Determines which set a particular element belongs to.
		-
		- **Union**: Merges two sets into a single set.
		-
	- Union-Find is widely used in algorithms like **Kruskal's Minimum Spanning Tree** and **connected components in a graph**.
-
- # Steps:
	- **Find**: Use path compression to flatten the tree structure for faster future lookups.
	-
	- **Union**: Use union by rank or size to keep the tree balanced by attaching the smaller tree under the larger tree.
-
- # Time Complexity:
	- **Find** and **Union** operations are nearly O(1) with **path compression** and **union by rank**.
-
- ```python
  class UnionFind:
      def __init__(self, size):
          self.parent = list(range(size))
          self.rank = [1] * size
  
      def find(self, x):
          if self.parent[x] != x:
              self.parent[x] = self.find(self.parent[x])  # Path compression
          return self.parent[x]
  
      def union(self, x, y):
          rootX = self.find(x)
          rootY = self.find(y)
  
          if rootX != rootY:
              # Union by rank
              if self.rank[rootX] > self.rank[rootY]:
                  self.parent[rootY] = rootX
              elif self.rank[rootX] < self.rank[rootY]:
                  self.parent[rootX] = rootY
              else:
                  self.parent[rootY] = rootX
                  self.rank[rootX] += 1
  
  # Example Usage
  uf = UnionFind(5)
  uf.union(0, 1)
  uf.union(2, 3)
  uf.union(1, 2)
  
  print(uf.find(0))  # Output: 2
  print(uf.find(3))  # Output: 2
  ```