# Explanation
	- **Floyd-Warshall Algorithm** is an algorithm for finding the shortest paths between all pairs of vertices in a **weighted graph**.
-
- # Steps:
	- Initialize the distance matrix with the direct edge weights between all pairs of vertices.
	-
	- Update the matrix by considering each vertex as an intermediate vertex.
	-
	- Repeat for all pairs of vertices and for every intermediate vertex.
-
- # Time Complexity:
	- **O(V^3)**, where `V` is the number of vertices.
-
- ```python
  def floyd_warshall(graph, V):
     dist = [[float('inf')] * V for _ in range(V)]
      for i in range(V):
          dist[i][i] = 0
      for u, v, w in graph:
          dist[u][v] = w
      for k in range(V):
          for i in range(V):
              for j in range(V):
                  if dist[i][j] > dist[i][k] + dist[k][j]:
                      dist[i][j] = dist[i][k] + dist[k][j]
     	return dist
  
  # Example usage
  graph = [(0, 1, 5), (0, 2, 10), (1, 2, 3)]
  V = 3
  print("Shortest distance matrix:", floyd_warshall(graph, V))
  ```