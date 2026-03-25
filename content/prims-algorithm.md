---
seoTitle: Prim's Algorithm – Minimum Spanning Tree with Priority Queue
description: "Prim's algorithm grows the MST one vertex at a time using a priority queue. Covers adjacency matrix vs list implementations, O(E log V) complexity, and dense."
keywords: "Prim algorithm, minimum spanning tree, MST, priority queue, greedy algorithm, O(E log V), time complexity, space complexity, dense graph, graph algorithm"
---

# Explanation
	- **Prim’s Algorithm** is a greedy algorithm used to find the **minimum spanning tree (MST)** of a graph. It builds the MST by starting from an arbitrary node and adding the smallest edge connecting a vertex in the MST to a vertex outside it.
-
- # Steps:
	- Start from an arbitrary vertex and mark it as part of the MST.
	-
	- Select the smallest edge connecting the MST to a vertex outside the MST and add it to the MST.
	-
	- Repeat until all vertices are included in the MST.
-
- # Time Complexity:
	- **O(E log V)**, where `V` is the number of vertices and `E` is the number of edges (using priority queue)
-
- ```python
  import heapq
  
  def prim(graph, n):
      mst = []
      visited = [False] * n
      min_heap = [(0, 0)]  # (weight, vertex)
      total_weight = 0
      
      while min_heap:
          weight, u = heapq.heappop(min_heap)
          if visited[u]:
              continue
          visited[u] = True
          total_weight += weight
          
          for v, w in graph[u]:
              if not visited[v]:
                  heapq.heappush(min_heap, (w, v))
          
          mst.append(u)
      
      return mst, total_weight
  
  # Example usage
  graph = {0: [(1, 2), (3, 1)], 1: [(0, 2), (3, 3)], 2: [(3, 1)], 3: [(0, 1), (1, 3), (2, 1)]}
  n = 4
  mst, weight = prim(graph, n)
  print("MST:", mst)
  print("Total weight of MST:", weight)
  ```