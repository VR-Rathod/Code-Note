---
seoTitle: Weighted vs Unweighted Graphs Complete Guide – Representations and Algorithms
description: "A comprehensive guide on Weighted and Unweighted Graphs. Covers edge weights representation in lists and matrices, and algorithmic contexts (Dijkstra, MST)."
keywords: "weighted graph, unweighted graph, edge weights, adjacency list, adjacency matrix, dijkstras algorithm, minimum spanning tree, VR-Rathod, Code-Note, code note vr, vr book"
treeTitle: DSA - Graphs - Weighted & Unweighted Graphs
---

> [!info] What are Weighted and Unweighted Graphs?
> - **Unweighted Graphs**: Edges represent simple connections with no associated value. Every connection has the same "cost" (implicitly 1).
> - **Weighted Graphs**: Edges have numerical values (weights) representing costs, distances, travel times, or capacities between vertices.

- # Explanation
	- Edge weights transform how we find paths and structure graphs. For instance, finding the shortest path changes from simple edge counts to minimizing total cumulative edge weights.
	-
	- ## Real-World Analogy
		- **Unweighted Graph (Subway Map Index)**: A simple subway map where you only care about which stations are connected by a line. Each stop is counted as "1 step" regardless of the physical distance between stations.
		- **Weighted Graph (Road Network Navigation)**: A highway map showing the physical distance (in miles) or travel time (in minutes) between cities. A path with 2 edges (e.g. 50 miles + 60 miles = 110 miles) is preferred over a path with 1 edge of 150 miles.
		- **Logistics & Shipping**: A supply chain graph where edges represent shipping routes and weights represent shipping costs or transport capacity.
-
- # How It Works
  collapsed:: true
	- ## Core Mechanics
		- Edge weights require adjustments to our standard graph representations:
		-
		- ### 1. Adjacency List Representation
			- Instead of storing just the neighbor index `v` in the list, we store a pair: `(v, weight)`.
			- **Example**: `Adj[u] = [(v1, w1), (v2, w2)]`
		-
		- ### 2. Adjacency Matrix Representation
			- Instead of cell values of `0` and `1`:
				- `Matrix[u][v] = weight` if an edge exists.
				- If no edge exists:
					- In **Shortest Path** contexts: Store $\infty$ (infinity) to represent unreachable paths.
					- In **Max Flow / Capacity** contexts: Store `0` to represent zero capacity.
					- In generic contexts: Store `None` or `-1` (if weights are strictly positive).
		-
		- ### 3. Edge List Representation
			- Each edge is stored as a tuple/triplet: `(u, v, weight)`.
	-
	- ## Algorithmic Context
		- Adding edge weights changes the algorithm selected for routing and connectivity:
		-
		- ### Shortest Path
			- **Unweighted Graphs**: [[Breadth First Search]] (BFS) finds the shortest path in $O(V + E)$ time.
			- **Weighted Graphs (Positive Weights)**: [[Dijkstras-algorithm]] calculates shortest paths in $O((V+E)\log V)$ time.
			- **Weighted Graphs (Negative Weights)**: [[Bellman Ford Algorithm]] must be used ($O(VE)$) to avoid infinite loops in negative cycles.
		-
		- ### Minimum Spanning Tree (MST)
			- Weighted graphs are used to construct Minimum Spanning Trees (connecting all nodes with the minimum sum of edge weights) using [[prims-algorithm]] or [[kruskals-algorithm]].
	-
	- ## Visual Walkthrough
		- ### Simple Weighted Graph (Undirected)
			- ```
			       (5)
			    0 ----- 1
			    |     /
			  (10)|   / (2)
			    |  /
			    2
			  ```
		-
		- ### Adjacency Matrix (using $\infty$ for no edge)
			- ```
			       0     1     2
			   0 [  0,    5,   10]
			   1 [  5,    0,    2]
			   2 [ 10,    2,    0]
			  ```
		-
		- ### Adjacency List
			- ```
			  0 -> [(1, 5), (2, 10)]
			  1 -> [(0, 5), (2, 2)]
			  2 -> [(0, 10), (1, 2)]
			  ```
-
- # Time & Space Complexity
  collapsed:: true
	- | Representation | Space Complexity | Neighbor Query Time | Edge Query $(u, v)$ |
	  |---|---|---|---|
	  | **Weighted Adjacency List** | $O(V + E)$ | $O(\text{degree}(u))$ | $O(\text{degree}(u))$ |
	  | **Weighted Adjacency Matrix** | $O(V^2)$ | $O(V)$ | $O(1)$ |
	  | **Weighted Edge List** | $O(E)$ | $O(E)$ | $O(E)$ |
-
- # Implementation
  collapsed:: true
	- :::code-tabs
	  
	  ```python
	  import math
	  
	  # 1. WEIGHTED ADJACENCY LIST REPRESENTATION
	  class WeightedGraphList:
	      def __init__(self, num_vertices):
	          self.V = num_vertices
	          self.adj_list = [[] for _ in range(num_vertices)] # Stores (neighbor, weight) pairs
	  
	      def add_edge(self, u, v, weight, directed=False):
	          self.adj_list[u].append((v, weight))
	          if not directed:
	              self.adj_list[v].append((u, weight))
	  
	      def get_neighbors(self, u):
	          """Returns list of (neighbor, weight) tuples."""
	          return self.adj_list[u]
	  
	      def print_graph(self):
	          for u in range(self.V):
	              print(f"{u} -> {self.adj_list[u]}")
	  
	  
	  # 2. WEIGHTED ADJACENCY MATRIX REPRESENTATION
	  class WeightedGraphMatrix:
	      def __init__(self, num_vertices):
	          self.V = num_vertices
	          # Initialize matrix with infinity for non-existent paths, 0 for self-loops
	          self.matrix = [[math.inf] * num_vertices for _ in range(num_vertices)]
	          for i in range(num_vertices):
	              self.matrix[i][i] = 0
	  
	      def add_edge(self, u, v, weight, directed=False):
	          self.matrix[u][v] = weight
	          if not directed:
	              self.matrix[v][u] = weight
	  
	      def get_weight(self, u, v):
	          return self.matrix[u][v]
	  
	      def print_graph(self):
	          for row in self.matrix:
	              formatted_row = [str(x) if x != math.inf else "INF" for x in row]
	              print(" ".join(formatted_row))
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <limits>
	  
	  // 1. WEIGHTED ADJACENCY LIST REPRESENTATION
	  class WeightedGraphList {
	  private:
	      int V;
	      // Stores pair of (neighbor, weight)
	      std::vector<std::vector<std::pair<int, double>>> adjList;
	  
	  public:
	      WeightedGraphList(int vertices) : V(vertices), adjList(vertices) {}
	  
	      void addEdge(int u, int v, double weight, bool directed = false) {
	          adjList[u].push_back({v, weight});
	          if (!directed) {
	              adjList[v].push_back({u, weight});
	          }
	      }
	  
	      const std::vector<std::pair<int, double>>& getNeighbors(int u) const {
	          return adjList[u];
	      }
	  
	      void printGraph() const {
	          for (int i = 0; i < V; ++i) {
	              std::cout << i << " -> [";
	              for (size_t j = 0; j < adjList[i].size(); ++j) {
	                  std::cout << "(" << adjList[i][j].first << ", " << adjList[i][j].second << ")";
	                  if (j + 1 < adjList[i].size()) std::cout << ", ";
	              }
	              std::cout << "]\n";
	          }
	      }
	  };
	  
	  // 2. WEIGHTED ADJACENCY MATRIX REPRESENTATION
	  class WeightedGraphMatrix {
	  private:
	      int V;
	      double INF_VAL;
	      std::vector<std::vector<double>> matrix;
	  
	  public:
	      WeightedGraphMatrix(int vertices) : V(vertices), INF_VAL(std::numeric_limits<double>::infinity()) {
	          matrix.assign(V, std::vector<double>(V, INF_VAL));
	          for (int i = 0; i < V; ++i) {
	              matrix[i][i] = 0;
	          }
	      }
	  
	      void addEdge(int u, int v, double weight, bool directed = false) {
	          matrix[u][v] = weight;
	          if (!directed) {
	              matrix[v][u] = weight;
	          }
	      }
	  
	      double getWeight(int u, int v) const {
	          return matrix[u][v];
	      }
	  
	      void printGraph() const {
	          for (int i = 0; i < V; ++i) {
	              for (int j = 0; j < V; ++j) {
	                  if (matrix[i][j] == INF_VAL) {
	                      std::cout << "INF ";
	                  } else {
	                      std::cout << matrix[i][j] << " ";
	                  }
	              }
	              std::cout << "\n";
	          }
	      }
	  };
	  ```
	  
	  :::
-
- # When to Use
  collapsed:: true
	- ## ✅ Use Weighted Graphs When:
		- You are modeling physical networks where distances or travel times vary (e.g. GPS, shipping, routing protocols like OSPF).
		- Edges have capacities, such as bandwidth in telecom channels or flow volume in water pipes.
	- ## ✅ Use Unweighted Graphs When:
		- Only connectivity or reachability matters (e.g. tracking followers on social networks, check-ins, or solving simple mazes).
		- Every link has an identical cost, making BFS the faster and simpler shortest-path solution.
-
- # Variations & Related Concepts
  collapsed:: true
	- **Negative Edge Weights**: Edges with negative values. If a cycle exists where the sum of weights is negative, it's a **negative cycle**. Pathfinding algorithms will fail to terminate or yield infinite negative costs unless handled by [[Bellman Ford Algorithm]].
	- **Flow Networks**: Directed, weighted graphs where weights represent maximum capacities. Solved using Ford-Fulkerson or Edmonds-Karp algorithms.
-
- # Key Takeaways
  collapsed:: true
	- Unweighted graphs represent uniform connections, while weighted graphs assign costs, lengths, or capacities to edges.
	- Weighted adjacency lists store tuples `(neighbor, weight)`.
	- Weighted adjacency matrices use $\infty$ (for shortest path) or $0$ (for flow) to represent non-existent edges.
	- Shortest path calculations on weighted graphs require Dijkstra's or Bellman-Ford, as standard BFS will fail to yield correct results.
	- MST algorithms (Prim's, Kruskal's) require weighted graphs to optimize structural connection costs.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Wikipedia -> Graph (abstract data type)](https://en.wikipedia.org/wiki/Graph_(abstract_data_type))
		- [GeeksforGeeks -> Graph Data Structure And Algorithms](https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/)