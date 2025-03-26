# Explanation
	- **Johnson's Algorithm** is used to find **all pairs shortest paths** in a **weighted directed graph**. It works by transforming the graph to ensure there are no negative weight edges, applying Bellman-Ford, and then running Dijkstra’s algorithm from each vertex.
	-
- # Steps:
	- Add a new vertex to the graph, connected to all vertices with edges of weight 0.
	-
	- Use the Bellman-Ford algorithm from the new vertex to compute shortest paths.
	-
	- Re-weight the original edges using the results from the Bellman-Ford algorithm.
	-
	- Use Dijkstra’s algorithm from each vertex to compute the shortest paths.
-
- # Time Complexity:
	- **O(V^2 log V + VE)**, where `V` is the number of vertices and `E` is the number of edges.
-
- ```python
  // not avalable now
  ```