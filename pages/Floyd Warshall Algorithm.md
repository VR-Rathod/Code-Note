---
seoTitle: Floyd-Warshall Algorithm – All-Pairs Shortest Path Explained
description: "Comprehensive guide to the Floyd-Warshall Algorithm. Covers dynamic programming formulation, O(V^3) time complexity, matrix initialization, negative cycle detection, and code implementations."
keywords: "Floyd-Warshall, all-pairs shortest path, dynamic programming, O(V^3), negative cycle, graph algorithm, time complexity, space complexity, adjacency matrix, VR-Rathod, Code-Note, Floyd Warshall Algorithm"
displayTitle: Floyd Warshall Algorithm
---

> [!info] What is the Floyd-Warshall Algorithm?
> **Floyd-Warshall Algorithm** is a dynamic programming algorithm for finding shortest paths between **all pairs of vertices** in a weighted graph in a single execution.
> It works on both directed and undirected graphs, supports negative edge weights, and can detect negative cycles, all while utilizing a simple adjacency matrix.

- # Explanation
  collapsed:: true
	- Unlike [[Dijkstras Algorithm]] or [[Bellman Ford Algorithm]] which find the shortest path from *one* starting point to all others (Single-Source Shortest Path), **Floyd-Warshall** calculates the shortest path from *every* node to *every other* node simultaneously (All-Pairs Shortest Path).
	-
	- ## The Intermediate Vertex Strategy
	  collapsed:: true
		- The genius of Floyd-Warshall lies in its subproblem breakdown. It asks a simple question: "If I am trying to go from node $I$ to node $J$, is it faster to route my path through an intermediate node $K$?"
		- The algorithm systematically considers every single node in the graph to act as this "intermediate node $K$" for every possible source $I$ and destination $J$.
	-
	- ## The Recurrence Relation
	  collapsed:: true
		- Let `dist[i][j]` be the shortest known distance from $i$ to $j$.
		- For every node $k$ (acting as the intermediate):
		  `dist[i][j] = min( dist[i][j], dist[i][k] + dist[k][j] )`
		- This simple formula updates the matrix in-place. If going from $i \rightarrow k$ and then $k \rightarrow j$ is cheaper than the currently known path from $i \rightarrow j$, we overwrite the shortest path.
-
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- Create a $V \times V$ distance matrix.
		- Initialize the diagonal to $0$ (distance from a node to itself is 0).
		- Initialize all direct edges with their weights.
		- Initialize all other pairs to $\infty$.
		- Use three nested loops: $K$ (intermediate), $I$ (source), and $J$ (destination). Update the matrix.
		-
		- ```mermaid
		  flowchart TD
		      A["Create VxV dist matrix\ndist[i][i] = 0\ndist[i][j] = weight(i,j)"] --> B["For K = 0 to V-1"]
		      B --> C["For I = 0 to V-1"]
		      C --> D["For J = 0 to V-1"]
		      D --> E{"dist[I][J] >\ndist[I][K] + dist[K][J]?"}
		      E -- Yes --> F["dist[I][J] = \ndist[I][K] + dist[K][J]"]
		      E -- No --> D2["Next J"]
		      F --> D2
		      D2 -- Loop J ends --> C2["Next I"]
		      C2 -- Loop I ends --> B2["Next K"]
		      B2 -- Loop K ends --> G["Done! Matrix contains all shortest paths"]
		  ```
	-
	- ## Negative Cycle Detection
	  collapsed:: true
		- After running the three loops, simply check the main diagonal of the matrix.
		- If `dist[i][i] < 0` for any node $i$, it means the shortest path from the node to itself is negative. This is mathematical proof that the graph contains a **negative weight cycle**.
-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > - **Time Complexity: O(V³)** — Exactly three nested loops that iterate $V$ times.
	  > - **Space Complexity: O(V²)** — Requires a 2D adjacency matrix to store distances.
	-
	- ## Performance Reality
	  collapsed:: true
		- $O(V³)$ limits Floyd-Warshall to relatively small graphs (usually $V < 500$).
		- For larger graphs (e.g., $V = 10,000$), $V^3$ is $1 \text{ trillion}$ operations, which will fail or take hours. In those cases, running Dijkstra's algorithm $V$ times (which takes $O(V(V+E)\log V)$) is significantly faster for sparse graphs.
-
- # Implementation
  collapsed:: true
	- > [!note] Standard implementation using a 2D Adjacency Matrix.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def floyd_warshall(num_vertices, graph_matrix):
	      """
	      Floyd-Warshall Algorithm
	      Time: O(V^3) | Space: O(V^2)
	      """
	      # Initialize the distance matrix
	      dist = [[float('inf')] * num_vertices for _ in range(num_vertices)]
	      
	      for i in range(num_vertices):
	          for j in range(num_vertices):
	              dist[i][j] = graph_matrix[i][j]
	              
	      # The 3 nested loops
	      for k in range(num_vertices):
	          for i in range(num_vertices):
	              for j in range(num_vertices):
	                  # If vertex k is on the shortest path from i to j, update dist[i][j]
	                  if dist[i][k] + dist[k][j] < dist[i][j]:
	                      dist[i][j] = dist[i][k] + dist[k][j]
	                      
	      # Optional: Negative cycle detection
	      for i in range(num_vertices):
	          if dist[i][i] < 0:
	              print("Graph contains a negative weight cycle")
	              return None
	              
	      return dist
	  
	  # Example Setup
	  INF = float('inf')
	  graph = [
	      [0,   5,  INF, 10],
	      [INF, 0,  3,   INF],
	      [INF, INF, 0,   1],
	      [INF, INF, INF, 0]
	  ]
	  
	  result = floyd_warshall(4, graph)
	  for row in result:
	      print(row)
	  # Output:
	  # [0, 5, 8, 9]
	  # [inf, 0, 3, 4]
	  # [inf, inf, 0, 1]
	  # [inf, inf, inf, 0]
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  
	  using namespace std;
	  
	  const int INF = 1e9;
	  
	  void floyd_warshall(int V, vector<vector<int>>& graph) {
	      vector<vector<int>> dist = graph;
	  
	      // K = Intermediate, I = Source, J = Destination
	      for (int k = 0; k < V; k++) {
	          for (int i = 0; i < V; i++) {
	              for (int j = 0; j < V; j++) {
	                  if (dist[i][k] != INF && dist[k][j] != INF && dist[i][k] + dist[k][j] < dist[i][j]) {
	                      dist[i][j] = dist[i][k] + dist[k][j];
	                  }
	              }
	          }
	      }
	  
	      // Print Matrix
	      cout << "Shortest Distance Matrix:\n";
	      for (int i = 0; i < V; i++) {
	          for (int j = 0; j < V; j++) {
	              if (dist[i][j] == INF) cout << "INF ";
	              else cout << dist[i][j] << "   ";
	          }
	          cout << "\n";
	      }
	  }
	  
	  int main() {
	      int V = 4;
	      vector<vector<int>> graph = {
	          {0, 5, INF, 10},
	          {INF, 0, 3, INF},
	          {INF, INF, 0, 1},
	          {INF, INF, INF, 0}
	      };
	      
	      floyd_warshall(V, graph);
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function floydWarshall(V, graph) {
	      let dist = [];
	      
	      // Initialize dist matrix
	      for (let i = 0; i < V; i++) {
	          dist[i] = [];
	          for (let j = 0; j < V; j++) {
	              dist[i][j] = graph[i][j];
	          }
	      }
	  
	      // The 3 nested loops
	      for (let k = 0; k < V; k++) {
	          for (let i = 0; i < V; i++) {
	              for (let j = 0; j < V; j++) {
	                  if (dist[i][k] + dist[k][j] < dist[i][j]) {
	                      dist[i][j] = dist[i][k] + dist[k][j];
	                  }
	              }
	          }
	      }
	  
	      return dist;
	  }
	  
	  const INF = Infinity;
	  const graph = [
	      [0,   5,  INF, 10],
	      [INF, 0,  3,   INF],
	      [INF, INF, 0,   1],
	      [INF, INF, INF, 0]
	  ];
	  
	  console.log(floydWarshall(4, graph));
	  ```
	  
	  ```java
	  public class FloydWarshall {
	      final static int INF = 99999;
	  
	      public static void floydWarshall(int V, int[][] graph) {
	          int[][] dist = new int[V][V];
	  
	          for (int i = 0; i < V; i++) {
	              for (int j = 0; j < V; j++) {
	                  dist[i][j] = graph[i][j];
	              }
	          }
	  
	          for (int k = 0; k < V; k++) {
	              for (int i = 0; i < V; i++) {
	                  for (int j = 0; j < V; j++) {
	                      if (dist[i][k] + dist[k][j] < dist[i][j]) {
	                          dist[i][j] = dist[i][k] + dist[k][j];
	                      }
	                  }
	              }
	          }
	  
	          printSolution(V, dist);
	      }
	  
	          public static void printSolution(int V, int[][] dist) {
	          for (int i = 0; i < V; ++i) {
	              for (int j = 0; j < V; ++j) {
	                  if (dist[i][j] == INF)
	                      System.out.print("INF ");
	                  else
	                      System.out.print(dist[i][j] + "   ");
	              }
	              System.out.println();
	          }
	      }
	  
	      public static void main(String[] args) {
	          int[][] graph = { 
	              {0, 5, INF, 10},
	              {INF, 0, 3, INF},
	              {INF, INF, 0, 1},
	              {INF, INF, INF, 0}
	          };
	          floydWarshall(4, graph);
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #define INF 99999
	  #define V 4
	  
	  void printSolution(int dist[][V]) {
	      printf("Shortest distances between every pair of vertices:\n");
	      for (int i = 0; i < V; i++) {
	          for (int j = 0; j < V; j++) {
	              if (dist[i][j] == INF)
	                  printf("%7s", "INF");
	              else
	                  printf("%7d", dist[i][j]);
	          }
	          printf("\n");
	      }
	  }
	  
	  void floydWarshall(int graph[][V]) {
	      int dist[V][V], i, j, k;
	  
	      for (i = 0; i < V; i++)
	          for (j = 0; j < V; j++)
	              dist[i][j] = graph[i][j];
	  
	      for (k = 0; k < V; k++) {
	          for (i = 0; i < V; i++) {
	              for (j = 0; j < V; j++) {
	                  if (dist[i][k] + dist[k][j] < dist[i][j])
	                      dist[i][j] = dist[i][k] + dist[k][j];
	              }
	          }
	      }
	  
	      printSolution(dist);
	  }
	  
	  int main() {
	      int graph[V][V] = { 
	          {0,   5,  INF, 10},
	          {INF, 0,   3, INF},
	          {INF, INF, 0,   1},
	          {INF, INF, INF, 0}
	      };
	      floydWarshall(graph);
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Floyd-Warshall
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Goal & Properties"}
	      Q -- "Single source, positive edges" --> R1["❌ Use Dijkstra\nO(V³) is a massive waste of time here"]
	      Q -- "All pairs, sparse graph, large V" --> R2["❌ Use Johnson's Algorithm\nor Run Dijkstra V times"]
	      Q -- "All pairs, dense graph, small V" --> R3["✅ Use Floyd-Warshall\nSimple and perfect for dense graphs"]
	      Q -- "Need to find graph diameter" --> R4["✅ Use Floyd-Warshall\nEasiest way to find max shortest path"]
	  ```
	-
	- ## ✅ Use Floyd-Warshall When
		- Calculating transitive closure of a directed graph.
		- Solving all-pairs shortest paths on a graph with fewer than 500 vertices.
		- Finding the "Diameter" of a graph (the longest of all the shortest paths).
-
- # Key Takeaways
  collapsed:: true
	- **Core idea** — Dynamic programming formulation checking if routing through an intermediate node $K$ is faster.
	- **The Triple Loop** — The $K$ loop (intermediate vertex) MUST be the outermost loop for the DP relation to work correctly.
	- **Matrix Base** — Requires an Adjacency Matrix format natively, rather than an Adjacency List.
	- **Detects Negative Cycles** — Proven trivially if the main diagonal ends up with values $< 0$.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Floyd-Warshall Algorithm](https://www.geeksforgeeks.org/floyd-warshall-algorithm-dp-16/)
		- [TheAlgorithms – Floyd-Warshall (Python)](https://github.com/TheAlgorithms/Python/blob/master/graphs/floyd_warshall.py)