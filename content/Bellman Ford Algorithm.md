---
seoTitle: Bellman-Ford Algorithm – Shortest Path with Negative Edges
description: "Comprehensive guide to the Bellman-Ford Algorithm. Covers dynamic programming approach, V-1 edge relaxations, negative weight cycle detection, and time complexities in Python, C++, JavaScript, Java, and C."
keywords: "Bellman-Ford algorithm, shortest path, negative edges, graph algorithm, edge relaxation, negative cycle detection, dynamic programming, time complexity, space complexity, VR-Rathod, Code-Note , Bellman Ford Algorithm"
displayTitle: Bellman Ford Algorithm
treeTitle: DSA - Graph Algorithms - Bellman Ford Algorithm
---

> [!info] What is the Bellman-Ford Algorithm?
> **Bellman-Ford Algorithm** is a versatile dynamic programming algorithm used for finding the shortest path from a source vertex to all other vertices in a directed weighted graph.
> Unlike [[Dijkstras Algorithm]], Bellman-Ford **can handle negative edge weights** and has the built-in capability to detect **negative weight cycles**.

- # Explanation
  collapsed:: true
	- **Bellman-Ford Algorithm** systematically relaxes all the edges in the graph $V-1$ times (where $V$ is the number of vertices). Since the longest possible shortest path without a cycle can have at most $V-1$ edges, doing exactly $V-1$ complete sweeps guarantees that all optimal distances will propagate correctly.
	-
	- ## Why does it work with negative edges?
	  collapsed:: true
		- Dijkstra's algorithm uses a greedy approach: it commits to the shortest local path permanently. If a negative edge later reduces that path, Dijkstra's cannot adapt.
		- Bellman-Ford is a dynamic programming approach: it makes no permanent commitments until the very end. By repeatedly relaxing every single edge $V-1$ times, it allows negative weights to recursively lower the distance of any node down the chain.
	-
	- ## Detecting Negative Weight Cycles
	  collapsed:: true
		- A **negative weight cycle** is a loop in a graph where the sum of the edge weights is less than zero. If such a cycle is reachable from the source, the "shortest path" is technically $-\infty$ because you can infinitely loop to reduce the distance forever.
		- After relaxing all edges $V-1$ times, Bellman-Ford does **one final sweep**. If any distance shrinks during this $V$-th sweep, it proves that a negative cycle exists.
-
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- Initialize a distance array `dist[]` where the source node is 0 and all others are $\infty$.
		- Run a loop $V-1$ times. Inside the loop, iterate through *every single edge* `(U, V)` with weight `W`.
		- If `dist[U] + W < dist[V]`, update `dist[V] = dist[U] + W`.
		- Run a final loop over all edges. If any edge can *still* be relaxed, flag a negative cycle.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — Set dist[S] = 0, others ∞"] --> B["Repeat V-1 Times"]
		      B --> C["For every edge (U, V, W)"]
		      C --> D{"dist[U] + W < dist[V]?"}
		      D -- Yes --> E["Relax Edge:\ndist[V] = dist[U] + W"]
		      D -- No --> C
		      E --> C
		      C -- "Sweep complete" --> F{"Loop V-1 times?"}
		      F -- No --> B
		      F -- Yes --> G["For every edge (U, V, W) again"]
		      G --> H{"dist[U] + W < dist[V]?"}
		      H -- Yes --> I["Negative Cycle Detected!"]
		      H -- No --> J["End — Shortest paths found"]
		      G -- All checked --> J
		  ```
	-
	- ## Step-by-Step Algorithm
	  collapsed:: true
		- ```
		  INPUT:  Graph G(V, E), Source S
		  OUTPUT: Array dist[] or "Negative Cycle"
		  
		  1. Create array dist[] of size V, initialize all to INFINITY
		  2. dist[S] = 0
		  3. Loop V - 1 times:
		       FOR each edge (U, V) with weight W in E:
		           IF dist[U] + W < dist[V]:
		               dist[V] = dist[U] + W
		  4. FOR each edge (U, V) with weight W in E:
		           IF dist[U] + W < dist[V]:
		               RETURN "Negative weight cycle detected"
		  5. RETURN dist[]
		  ```
-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > - **Time Complexity: O(V × E)** — We iterate over all $E$ edges exactly $V-1$ times.
	  > - **Space Complexity: O(V)** — We only need a distance array of size $V$.
	-
	- ## Why is it slower than Dijkstra?
	  collapsed:: true
		- Dijkstra's runs in $O((V+E) \log V)$ because it intelligently selects which edges to explore using a priority queue. Bellman-Ford blindly processes *all* edges repeatedly ($O(V \times E)$), which is significantly slower for dense graphs, but absolutely necessary if negative weights exist.
-
- # Implementation
  collapsed:: true
	- > [!note] Standard implementation using an Edge List.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def bellman_ford(num_vertices, edges, source):
	      """
	      Bellman-Ford Algorithm
	      edges: list of tuples (u, v, weight)
	      Time: O(V * E) | Space: O(V)
	      """
	      dist = [float('inf')] * num_vertices
	      dist[source] = 0
	      
	      # Relax all edges V - 1 times
	      for _ in range(num_vertices - 1):
	          for u, v, w in edges:
	              if dist[u] != float('inf') and dist[u] + w < dist[v]:
	                  dist[v] = dist[u] + w
	                  
	      # Check for negative-weight cycles
	      for u, v, w in edges:
	          if dist[u] != float('inf') and dist[u] + w < dist[v]:
	              return "Graph contains a negative weight cycle!"
	              
	      return dist
	  
	  # Example: 5 vertices
	  # Edges: (0->1: -1), (0->2: 4), (1->2: 3), (1->3: 2), (1->4: 2), (3->2: 5), (3->4: -3), (4->3: 3)
	  edges = [
	      (0, 1, -1), (0, 2, 4), 
	      (1, 2, 3), (1, 3, 2), (1, 4, 2), 
	      (3, 2, 5), (3, 4, -3), 
	      (4, 3, 3)
	  ]
	  print("Shortest distances:", bellman_ford(5, edges, 0))
	  # Output: Shortest distances: [0, -1, 2, -2, 1]
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  
	  using namespace std;
	  
	  const int INF = 1e9;
	  
	  struct Edge {
	      int u, v, weight;
	  };
	  
	  void bellman_ford(int V, int E, vector<Edge>& edges, int source) {
	      vector<int> dist(V, INF);
	      dist[source] = 0;
	  
	      // Relax all edges V - 1 times
	      for (int i = 1; i <= V - 1; i++) {
	          for (int j = 0; j < E; j++) {
	              int u = edges[j].u;
	              int v = edges[j].v;
	              int weight = edges[j].weight;
	              if (dist[u] != INF && dist[u] + weight < dist[v]) {
	                  dist[v] = dist[u] + weight;
	              }
	          }
	      }
	  
	      // Check for negative-weight cycles
	      for (int i = 0; i < E; i++) {
	          int u = edges[i].u;
	          int v = edges[i].v;
	          int weight = edges[i].weight;
	          if (dist[u] != INF && dist[u] + weight < dist[v]) {
	              cout << "Graph contains a negative weight cycle!" << endl;
	              return;
	          }
	      }
	  
	      cout << "Vertex distances from source " << source << ":\n";
	      for (int i = 0; i < V; i++) {
	          cout << i << " \t " << dist[i] << "\n";
	      }
	  }
	  
	  int main() {
	      int V = 5;
	      int E = 8;
	      vector<Edge> edges = {
	          {0, 1, -1}, {0, 2, 4}, {1, 2, 3}, {1, 3, 2}, 
	          {1, 4, 2}, {3, 2, 5}, {3, 4, -3}, {4, 3, 3}
	      };
	  
	      bellman_ford(V, E, edges, 0);
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function bellmanFord(numVertices, edges, source) {
	      const dist = Array(numVertices).fill(Infinity);
	      dist[source] = 0;
	  
	      for (let i = 0; i < numVertices - 1; i++) {
	          for (const [u, v, w] of edges) {
	              if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
	                  dist[v] = dist[u] + w;
	              }
	          }
	      }
	  
	      for (const [u, v, w] of edges) {
	          if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
	              return "Graph contains a negative weight cycle!";
	          }
	      }
	  
	      return dist;
	  }
	  
	  const edges = [
	      [0, 1, -1], [0, 2, 4], [1, 2, 3], [1, 3, 2],
	      [1, 4, 2], [3, 2, 5], [3, 4, -3], [4, 3, 3]
	  ];
	  console.log("Shortest distances:", bellmanFord(5, edges, 0));
	  // Output: [0, -1, 2, -2, 1]
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class BellmanFord {
	      static class Edge {
	          int u, v, weight;
	          Edge(int u, int v, int w) {
	              this.u = u;
	              this.v = v;
	              this.weight = w;
	          }
	      }
	  
	      public static void bellmanFord(int V, List<Edge> edges, int source) {
	          int[] dist = new int[V];
	          Arrays.fill(dist, Integer.MAX_VALUE);
	          dist[source] = 0;
	  
	          for (int i = 1; i < V; ++i) {
	              for (Edge edge : edges) {
	                  int u = edge.u;
	                  int v = edge.v;
	                  int weight = edge.weight;
	                  if (dist[u] != Integer.MAX_VALUE && dist[u] + weight < dist[v]) {
	                      dist[v] = dist[u] + weight;
	                  }
	              }
	          }
	  
	          for (Edge edge : edges) {
	              int u = edge.u;
	              int v = edge.v;
	              int weight = edge.weight;
	              if (dist[u] != Integer.MAX_VALUE && dist[u] + weight < dist[v]) {
	                  System.out.println("Graph contains a negative weight cycle!");
	                  return;
	              }
	          }
	  
	          System.out.println("Vertex Distances:");
	          for (int i = 0; i < V; ++i) {
	              System.out.println(i + "\t" + dist[i]);
	          }
	      }
	  
	      public static void main(String[] args) {
	          List<Edge> edges = new ArrayList<>();
	          edges.add(new Edge(0, 1, -1));
	          edges.add(new Edge(0, 2, 4));
	          edges.add(new Edge(1, 2, 3));
	          edges.add(new Edge(1, 3, 2));
	          edges.add(new Edge(1, 4, 2));
	          edges.add(new Edge(3, 2, 5));
	          edges.add(new Edge(3, 4, -3));
	          edges.add(new Edge(4, 3, 3));
	  
	          bellmanFord(5, edges, 0);
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  #include <limits.h>
	  
	  struct Edge {
	      int u, v, weight;
	  };
	  
	  void bellman_ford(int V, int E, struct Edge* edges, int source) {
	      int dist[V];
	      for (int i = 0; i < V; i++) dist[i] = INT_MAX;
	      dist[source] = 0;
	  
	      for (int i = 1; i <= V - 1; i++) {
	          for (int j = 0; j < E; j++) {
	              int u = edges[j].u;
	              int v = edges[j].v;
	              int weight = edges[j].weight;
	              if (dist[u] != INT_MAX && dist[u] + weight < dist[v]) {
	                  dist[v] = dist[u] + weight;
	              }
	          }
	      }
	  
	      for (int i = 0; i < E; i++) {
	          int u = edges[i].u;
	          int v = edges[i].v;
	          int weight = edges[i].weight;
	          if (dist[u] != INT_MAX && dist[u] + weight < dist[v]) {
	              printf("Graph contains a negative weight cycle!\n");
	              return;
	          }
	      }
	  
	      printf("Vertex \t Distance from Source\n");
	      for (int i = 0; i < V; i++) {
	          printf("%d \t\t %d\n", i, dist[i]);
	      }
	  }
	  
	  int main() {
	      int V = 5, E = 8;
	      struct Edge edges[] = {
	          {0, 1, -1}, {0, 2, 4}, {1, 2, 3}, {1, 3, 2}, 
	          {1, 4, 2}, {3, 2, 5}, {3, 4, -3}, {4, 3, 3}
	      };
	      bellman_ford(V, E, edges, 0);
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Bellman-Ford
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Graph Properties"}
	      Q -- "Positive edge weights only" --> R1["❌ Use Dijkstra\nDijkstra O((V+E)logV) is much faster"]
	      Q -- "All pairs shortest path" --> R2["❌ Use Floyd-Warshall\nBetter for all pairs"]
	      Q -- "Negative edges present" --> R3["✅ Use Bellman-Ford\nDijkstra fails here"]
	      Q -- "Need to detect negative cycle" --> R4["✅ Use Bellman-Ford\nGuaranteed cycle detection"]
	  ```
	-
	- ## ✅ Use Bellman-Ford When
		- Modeling financial transactions/arbitrage where negative weights represent profit margins.
		- The graph contains negative edges and you need the shortest path from a single source.
		- You explicitly need to prove whether or not a network contains a negative weight cycle.
-
- # Key Takeaways
  collapsed:: true
	- **Core idea** — Dynamically relax all edges $V-1$ times to guarantee optimal path propagation.
	- **Negative Edge Power** — Can handle negative weights, unlike Dijkstra's greedy logic.
	- **Cycle Detection** — A $V$-th sweep that results in a relaxation perfectly flags a negative cycle.
	- **Edge List format** — It's often easiest to implement Bellman-Ford using a simple flat list of edges `(U, V, W)` rather than an adjacency matrix or list.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Bellman-Ford Algorithm](https://www.geeksforgeeks.org/bellman-ford-algorithm-dp-23/)
		- [TheAlgorithms – Bellman-Ford (Python)](https://github.com/TheAlgorithms/Python/blob/master/graphs/bellman_ford.py)