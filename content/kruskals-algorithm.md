---
seoTitle: Kruskal's Algorithm – Minimum Spanning Tree with Union-Find
description: "Kruskal's algorithm builds the MST by greedily adding the cheapest non-cycle edge. Covers Union-Find data structure, edge sorting, O(E log E) complexity."
keywords: "Kruskal algorithm, minimum spanning tree, MST, Union-Find, greedy algorithm, edge sorting, O(E log E), time complexity, space complexity, graph algorithm"
---

# Explanation
	- **Kruskal’s Algorithm** is a greedy algorithm used to find the **minimum spanning tree (MST)** of a graph. It selects edges in increasing weight order, ensuring no cycles are formed, and the graph remains connected.
-
- # Steps:
	- Sort all the edges of the graph in non-decreasing order of their weight.
	-
	- Initialize a disjoint-set (union-find) structure to keep track of cycles.
	-
	- For each edge in the sorted list, if the edge connects two different sets, include it in the MST and merge the sets.
	-
	- Repeat until the MST contains `V-1` edges (where `V` is the number of vertices).
-
- # Time Complexity:
	- **O(E log E)**, where `E` is the number of edges.
-
- ```python
  class UnionFind:
      def __init__(self, n):
          self.parent = list(range(n))
          self.rank = [0] * n
      
      def find(self, u):
          if self.parent[u] != u:
              self.parent[u] = self.find(self.parent[u])
          return self.parent[u]
      
      def union(self, u, v):
          root_u, root_v = self.find(u), self.find(v)
          if root_u != root_v:
              if self.rank[root_u] > self.rank[root_v]:
                  self.parent[root_v] = root_u
              else:
                  self.parent[root_u] = root_v
                  if self.rank[root_u] == self.rank[root_v]:
                      self.rank[root_v] += 1
  
  def kruskal(n, edges):
      uf = UnionFind(n)
      mst = []
      edges.sort(key=lambda x: x[2])  # Sort edges by weight
      for u, v, w in edges:
          if uf.find(u) != uf.find(v):
              uf.union(u, v)
              mst.append((u, v, w))
      return mst
  
  # Example usage
  edges = [(0, 1, 10), (0, 2, 6), (0, 3, 5), (1, 3, 15), (2, 3, 4)]
  n = 4
  print("MST:", kruskal(n, edges))
  ```