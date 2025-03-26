# Explanation
	- **Bellman-Ford Algorithm** is a dynamic programming algorithm used for finding the shortest path in graphs, even with negative weight edges. It also detects negative weight cycles.
-
- # Steps:
	- Initialize distances to all vertices as infinity, and set the distance to the source vertex as 0.
	- Relax all edges `V-1` times (where `V` is the number of vertices).
	- Check for negative weight cycles by attempting to relax all edges once more.
-
- # Time Complexity:
	- **O(V * E)**, where `V` is the number of vertices and `E` is the number of edges.
-
- ```python
  def bellman_ford(graph, source, n):
      dist = [float('inf')] * n
      dist[source] = 0
      for _ in range(n-1):
          for u, v, w in graph:
              if dist[u] + w < dist[v]:
                  dist[v] = dist[u] + w
      # Check for negative-weight cycles
      for u, v, w in graph:
          if dist[u] + w < dist[v]:
              print("Graph contains negative weight cycle")
              return
      return dist
  
  # Example usage
  graph = [(0, 1, -1), (0, 2, 4), (1, 2, 3), (1, 3, 2), (1, 4, 2), (3, 2, 5), (3, 4, -3), (4, 3, 3)]
  n = 5
  source = 0
  print("Shortest distances:", bellman_ford(graph, source, n))
  ```