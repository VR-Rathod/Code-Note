---
date: 2025-03-26T12:40:55+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Topological Sort Algorithm – DAG Ordering with DFS and Kahn's
description: "Topological sort orders vertices of a DAG so all edges go forward. Covers DFS-based sort, Kahn's BFS algorithm, cycle detection, and scheduling applications."
keywords: "topological sort, DAG, directed acyclic graph, DFS, Kahn algorithm, BFS, cycle detection, O(V+E), time complexity, space complexity, dependency resolution"
---

- # Explanation
	- **Topological Sort** is used to order the vertices of a **directed acyclic graph (DAG)** such that for every directed edge `(u, v)`, vertex `u` appears before `v`.
-
- # Steps:
	- Find all vertices with no incoming edges (in-degree of 0) and add them to a queue.
	-
	- Repeatedly remove a vertex from the queue, add it to the topological order, and reduce the in-degree of its neighbors.
	-
	- Repeat until all vertices are processed.
-
- # Time Complexity:
	- **O(V + E)**, where `V` is the number of vertices and `E` is the number of edges.
-
- ```python
  from collections import deque
  
  def topological_sort(graph, V):
      in_degree = [0] * V
      for u, v in graph:
          in_degree[v] += 1
      
      queue = deque([i for i in range(V) if in_degree[i] == 0])
      top_order = []
      
      while queue:
          u = queue.popleft()
          top_order.append(u)
          for v in graph[u]:
              in_degree[v] -= 1
              if in_degree[v] == 0:
                  queue.append(v)
      
      return top_order
  
  # Example usage
  graph = {0: [1], 1: [2], 2: []}
  V = 3
  print("Topological order:", topological_sort(graph, V))
  ```