---
date: 2026-03-24T17:12:17+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Boruvka's Algorithm – Minimum Spanning Tree Implementation
description: "Boruvka's algorithm finds the minimum spanning tree by repeatedly adding the cheapest edge from each component."
keywords: "Boruvka algorithm, minimum spanning tree, MST, graph algorithm, greedy algorithm, time complexity, space complexity, connected components, edge weight, spanning tree"
---

- # Explanation
	- **Boruvka's Algorithm** is another greedy algorithm used to find the **minimum spanning tree (MST)** of a graph. It repeatedly adds the minimum weight edge from each component until only one component remains.
-
- # Steps:
	- Initially, each vertex is considered a separate component.
	-
	- For each component, find the minimum weight edge that connects it to another component.
	-
	- Add these edges to the MST and merge the components.
	-
	- Repeat until there is only one component.
-
- # Time Complexity:
	- **O(E log V)**, where `V` is the number of vertices and `E` is the number of edges.
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
  
  def boruvka(graph, n):
      uf = UnionFind(n)
      mst = []
      num_components = n
      total_weight = 0
  
      while num_components > 1:
          cheapest = [-1] * n
          for u, v, w in graph:
              set_u, set_v = uf.find(u), uf.find(v)
              if set_u != set_v:
                  if cheapest[set_u] == -1 or cheapest[set_u][2] > w:
                      cheapest[set_u] = (u, v, w)
                  if cheapest[set_v] == -1 or cheapest[set_v][2] > w:
                      cheapest[set_v] = (u, v, w)
  
          for i in range(n):
              if cheapest[i] != -1:
                  u, v, w = cheapest[i]
                  if uf.find(u) != uf.find(v):
                      uf.union(u, v)
                      mst.append((u, v, w))
                      total_weight += w
                      num_components -= 1
          cheapest = [-1] * n
      
      return mst, total_weight
  
  # Example usage
  graph = [(0, 1, 10), (1, 2, 5), (0, 2, 3), (2, 3, 2), (3, 4, 7), (2, 4, 1)]
  n = 5
  mst, weight = boruvka(graph, n)
  print("MST:", mst)
  print("Total weight of MST:", weight)
  ```