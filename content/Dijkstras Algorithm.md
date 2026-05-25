---
date: 2026-05-22T17:59:04+05:30
lastmod: 2026-05-22T17:59:04+05:30

seoTitle: Dijkstra's Algorithm – Shortest Path in Weighted Graphs
description: "Dijkstra's algorithm finds shortest paths from a source in non-negative weighted graphs. Covers priority queue implementation, O((V+E) log V) complexity, and."
keywords: "Dijkstra algorithm, shortest path, weighted graph, priority queue, greedy algorithm, O(V+E log V), time complexity, space complexity, non-negative weights, graph algorithm"
---

- # Explanation
	- **Dijkstra's Algorithm** is a greedy algorithm used to find the shortest paths from a source vertex to all other vertices in a **weighted graph** with **non-negative edge weights**.
	-
- # Steps:
	- Initialize the distance to the source as 0 and all other distances as infinity.
	-
	- Mark the source as visited and update the distances to its adjacent vertices.
	-
	- Pick the unvisited vertex with the smallest tentative distance, mark it as visited, and update the distances to its neighbors.
	-
	- Repeat until all vertices are visited.
-
- # Time Complexity:
	- **O(V log V + E log V)** with a priority queue.
-
- ```python
  import heapq
  
  def dijkstra(graph, source):
      n = len(graph)
      dist = [float('inf')] * n
      dist[source] = 0
      pq = [(0, source)]  # (distance, vertex)
  
      while pq:
          d, u = heapq.heappop(pq)
          if d > dist[u]:
              continue
          for v, weight in graph[u]:
              alt = d + weight
              if alt < dist[v]:
                  dist[v] = alt
                  heapq.heappush(pq, (alt, v))
  
      return dist
  
  # Example usage
  graph = [
      [(1, 10), (2, 3)],  # From vertex 0
      [(3, 2)],           # From vertex 1
      [(1, 4), (3, 8)],   # From vertex 2
      []                  # From vertex 3
  ]
  source = 0
  print("Shortest distances:", dijkstra(graph, source))
  ```