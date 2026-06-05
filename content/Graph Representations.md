---
seoTitle: Graph Representations Complete Guide – Matrix, List, and Edge List
description: "A comprehensive guide on Graph Representations. Covers Adjacency Matrix, Adjacency List, and Edge List, their complexity tradeoffs, and Python/C++ code."
keywords: "graph representations, adjacency matrix, adjacency list, edge list, graph data structure, space complexity, time complexity, VR-Rathod, Code-Note, code note vr, vr book"
treeTitle: DSA - Graphs - Graph Representations
---

> [!info] What are Graph Representations?
> A **Graph** is a mathematical structure consisting of a set of vertices (nodes) $V$ and a set of edges $E$ connecting them.
> To process graphs in algorithms, we represent them computationally using three primary structures: **Adjacency Lists**, **Adjacency Matrices**, and **Edge Lists**.

- # Explanation
	- Selecting the right representation for a graph is a critical design choice that dictates the memory usage and runtime of graph traversal algorithms.
	-
	- ## Real-World Analogy
		- **Adjacency List (Personal Directory)**: Imagine a social network where every user has a personal directory listing only their immediate friends. If you have 3 friends, your list has 3 entries. This is highly space-efficient for sparse networks.
		- **Adjacency Matrix (Seating Chart)**: Imagine a classroom with 50 seats. The teacher uses a grid of size $50 \times 50$. A mark at row $A$ and column $B$ indicates they are partners. Even if only two students are in the class, the entire grid must still be maintained.
		- **Edge List (Flight Schedule)**: A simple list of scheduled flights, where each entry is a tuple: `(Origin, Destination)`. Perfect when we only care about the connections themselves rather than quick neighborhood lookups.
-
- # How It Works
  collapsed:: true
	- ## Core Mechanics
		- Let $V$ be the number of vertices and $E$ be the number of edges.
		-
		- ### 1. Adjacency Matrix
			- A 2D array of size $V \times V$.
			- `Matrix[i][j] = 1` indicates an edge exists from vertex $i$ to $j$; otherwise, `Matrix[i][j] = 0`.
			- **Pros**: $O(1)$ lookup to check if edge $(u, v)$ exists.
			- **Cons**: Occupies $O(V^2)$ space regardless of edge density. Finding neighbors of a node takes $O(V)$ time.
		-
		- ### 2. Adjacency List
			- An array of $V$ lists (or vectors).
			- Index $i$ stores all neighbor vertices connected to vertex $i$ by an edge.
			- **Pros**: Space-efficient ($O(V + E)$). Traversing all neighbors of a node takes $O(\text{degree}(v))$ time.
			- **Cons**: Edge lookup $(u, v)$ takes $O(\text{degree}(u))$ time in the worst case (searching the list).
		-
		- ### 3. Edge List
			- A flat array or list containing all edges represented as pairs `(u, v)` (or triplets `(u, v, weight)`).
			- **Pros**: Highly space-efficient for very sparse graphs. Extremely simple to iterate over all edges.
			- **Cons**: Checking if $(u, v)$ exists or finding neighbors of a vertex requires scanning the entire list of edges ($O(E)$ time).
	-
	- ## Visual Walkthrough
		- ### Simple Undirected Graph
			- We have a graph with 4 vertices ($0, 1, 2, 3$) and 4 edges:
			- ```
			    0 --- 1
			    |   /
			    |  /
			    2 --- 3
			  ```
		-
		- ### Adjacency Matrix Representation
			- A symmetric matrix for undirected graphs:
			- ```
			      0  1  2  3
			   0 [0, 1, 1, 0]
			   1 [1, 0, 1, 0]
			   2 [1, 1, 0, 1]
			   3 [0, 0, 1, 0]
			  ```
		-
		- ### Adjacency List Representation
			- List of neighbors:
			- ```
			  0 -> [1, 2]
			  1 -> [0, 2]
			  2 -> [0, 1, 3]
			  3 -> [2]
			  ```
		-
		- ### Edge List Representation
			- Array of connections:
			- ```
			  Edges = [(0, 1), (0, 2), (1, 2), (2, 3)]
			  ```
-
- # Time & Space Complexity
  collapsed:: true
	- ### Operation Tradeoff Table
		- | Operation | Adjacency Matrix | Adjacency List | Edge List |
		  |---|---|---|---|
		  | **Space Complexity** | $O(V^2)$ | $O(V + E)$ | $O(E)$ |
		  | **Add Edge** | $O(1)$ | $O(1)$ | $O(1)$ |
		  | **Remove Edge** | $O(1)$ | $O(\text{degree}(u))$ | $O(E)$ |
		  | **Check Edge $(u, v)$** | $O(1)$ | $O(\text{degree}(u))$ | $O(E)$ |
		  | **Find Neighbors of $u$** | $O(V)$ | $O(\text{degree}(u))$ | $O(E)$ |
		  | **Add Vertex** | $O(V^2)$ (reallocate) | $O(1)$ | $O(1)$ |
		  | **Remove Vertex** | $O(V^2)$ | $O(V + E)$ | $O(E)$ |
-
- # Implementation
  collapsed:: true
	- :::code-tabs
	  
	  ```python
	  # 1. ADJACENCY MATRIX REPRESENTATION
	  class GraphMatrix:
	      def __init__(self, num_vertices):
	          self.num_vertices = num_vertices
	          self.matrix = [[0] * num_vertices for _ in range(num_vertices)]
	  
	      def add_edge(self, u, v, directed=False):
	          self.matrix[u][v] = 1
	          if not directed:
	              self.matrix[v][u] = 1
	  
	      def remove_edge(self, u, v, directed=False):
	          self.matrix[u][v] = 0
	          if not directed:
	              self.matrix[v][u] = 0
	  
	      def has_edge(self, u, v):
	          return self.matrix[u][v] == 1
	  
	      def get_neighbors(self, u):
	          return [v for v, val in enumerate(self.matrix[u]) if val == 1]
	  
	      def print_graph(self):
	          for row in self.matrix:
	              print(" ".join(map(str, row)))
	  
	  
	  # 2. ADJACENCY LIST REPRESENTATION
	  class GraphList:
	      def __init__(self, num_vertices):
	          self.num_vertices = num_vertices
	          self.adj_list = [[] for _ in range(num_vertices)]
	  
	      def add_edge(self, u, v, directed=False):
	          # To avoid duplicates in undirected graphs, checks can be added
	          self.adj_list[u].append(v)
	          if not directed:
	              self.adj_list[v].append(u)
	  
	      def remove_edge(self, u, v, directed=False):
	          if v in self.adj_list[u]:
	              self.adj_list[u].remove(v)
	          if not directed and u in self.adj_list[v]:
	              self.adj_list[v].remove(u)
	  
	      def has_edge(self, u, v):
	          return v in self.adj_list[u]
	  
	      def get_neighbors(self, u):
	          return self.adj_list[u]
	  
	      def print_graph(self):
	          for u in range(self.num_vertices):
	              print(f"{u} -> {self.adj_list[u]}")
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  // 1. ADJACENCY MATRIX REPRESENTATION
	  class GraphMatrix {
	  private:
	      int numVertices;
	      std::vector<std::vector<int>> matrix;
	  
	  public:
	      GraphMatrix(int vertices) : numVertices(vertices), matrix(vertices, std::vector<int>(vertices, 0)) {}
	  
	      void addEdge(int u, int v, bool directed = false) {
	          matrix[u][v] = 1;
	          if (!directed) {
	              matrix[v][u] = 1;
	          }
	      }
	  
	      void removeEdge(int u, int v, bool directed = false) {
	          matrix[u][v] = 0;
	          if (!directed) {
	              matrix[v][u] = 0;
	          }
	      }
	  
	      bool hasEdge(int u, int v) const {
	          return matrix[u][v] == 1;
	      }
	  
	      std::vector<int> getNeighbors(int u) const {
	          std::vector<int> neighbors;
	          for (int v = 0; v < numVertices; ++v) {
	              if (matrix[u][v] == 1) {
	                  neighbors.push_back(v);
	              }
	          }
	          return neighbors;
	      }
	  
	      void printGraph() const {
	          for (int i = 0; i < numVertices; ++i) {
	              for (int j = 0; j < numVertices; ++j) {
	                  std::cout << matrix[i][j] << " ";
	              }
	              std::cout << "\n";
	          }
	      }
	  };
	  
	  // 2. ADJACENCY LIST REPRESENTATION
	  class GraphList {
	  private:
	      int numVertices;
	      std::vector<std::vector<int>> adjList;
	  
	  public:
	      GraphList(int vertices) : numVertices(vertices), adjList(vertices) {}
	  
	      void addEdge(int u, int v, bool directed = false) {
	          adjList[u].push_back(v);
	          if (!directed) {
	              adjList[v].push_back(u);
	          }
	      }
	  
	      void removeEdge(int u, int v, bool directed = false) {
	          auto it = std::find(adjList[u].begin(), adjList[u].end(), v);
	          if (it != adjList[u].end()) {
	              adjList[u].erase(it);
	          }
	          if (!directed) {
	              auto it2 = std::find(adjList[v].begin(), adjList[v].end(), u);
	              if (it2 != adjList[v].end()) {
	                  adjList[v].erase(it2);
	              }
	          }
	      }
	  
	      bool hasEdge(int u, int v) const {
	          return std::find(adjList[u].begin(), adjList[u].end(), v) != adjList[u].end();
	      }
	  
	      const std::vector<int>& getNeighbors(int u) const {
	          return adjList[u];
	      }
	  
	      void printGraph() const {
	          for (int i = 0; i < numVertices; ++i) {
	              std::cout << i << " -> [";
	              for (size_t j = 0; j < adjList[i].size(); ++j) {
	                  std::cout << adjList[i][j];
	                  if (j + 1 < adjList[i].size()) std::cout << ", ";
	              }
	              std::cout << "]\n";
	          }
	      }
	  };
	  ```
	  
	  :::
-
- # When to Use
  collapsed:: true
	- ## ✅ Use Adjacency List When:
		- The graph is **sparse** ($E \ll V^2$). Most real-world graphs (e.g. social networks, road networks) are sparse.
		- You need to perform graph traversals like [[Breadth First Search]] (BFS) or [[Depth First Search]] (DFS) where visiting all neighbors of each node quickly is critical.
	- ## ✅ Use Adjacency Matrix When:
		- The graph is **dense** ($E \approx V^2$).
		- You need $O(1)$ lookups to verify if a direct edge exists between two nodes.
		- The graph size $V$ is small, and memory usage is not a constraint.
	- ## ✅ Use Edge List When:
		- You are implementing edge-centric algorithms (e.g. [[Kruskals-algorithm]] for Minimum Spanning Trees, or [[Bellman Ford Algorithm]] for shortest paths).
		- You want to serialize or stream graph data over a network or save it to disk.
-
- # Variations & Related Concepts
  collapsed:: true
	- **Adjacency Set**: A variation of the Adjacency List where each vertex maps to a **Hash Set** rather than a linked list/vector. This combines the space efficiency of adjacency lists ($O(V + E)$) with the edge query speed of matrices ($O(1)$ average-case).
	- **Incidence Matrix**: A 2D matrix of size $V \times E$ where rows represent vertices and columns represent edges. `Matrix[i][j]` indicates if vertex $i$ is connected by edge $j$.
-
- # Key Takeaways
  collapsed:: true
	- An Adjacency List is the standard choice for representing sparse graphs due to its $O(V + E)$ space complexity.
	- An Adjacency Matrix is best for dense graphs or rapid edge checks ($O(1)$), but suffers from $O(V^2)$ memory scaling.
	- Edge Lists are simple collections of connection tuples, ideal for Kruskal's or Bellman-Ford algorithms.
	- Undirected graphs result in symmetric adjacency matrices.
	- Adjacency Sets are a highly practical hybrid format utilizing hash sets for constant-time edge lookups.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Wikipedia -> Graph (abstract data type)](https://en.wikipedia.org/wiki/Graph_(abstract_data_type))
		- [GeeksforGeeks -> Graph Data Structure And Algorithms](https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/)