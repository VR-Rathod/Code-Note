---
seoTitle: Directed vs Undirected Graphs Complete Guide – Properties and Degrees
description: "A comprehensive guide on Directed and Undirected Graphs. Covers edge directionality, vertex degrees, Handshaking Lemma, pathing concepts, and code."
keywords: "directed graph, undirected graph, digraph, degree, in-degree, out-degree, handshaking lemma, path, cycle, walk, VR-Rathod, Code-Note, code note vr, vr book"
treeTitle: DSA - Graphs - Directed & Undirected Graphs
---

> [!info] What are Directed and Undirected Graphs?
> Graphs are classified based on whether their connections (edges) have a specific direction:
> - **Undirected Graphs**: Edges represent bidirectional relationships (if $A$ is connected to $B$, $B$ is connected to $A$).
> - **Directed Graphs (Digraphs)**: Edges represent one-way relationships (from a source vertex to a target vertex).

- # Explanation
	- Edge directionality alters the mathematical properties and traversability of a graph.
	-
	- ## Real-World Analogy
		- **Undirected Graph (Mutual Friendships)**: On Facebook, friendship is mutual. If Alice is friends with Bob, Bob is friends with Alice. An edge exists symmetrically between them.
		- **Directed Graph (Follower Networks)**: On Twitter or Instagram, Bob can follow Alice, but Alice does not necessarily follow Bob. The connection has a direction: `Bob -> Alice`.
		- **Street Layouts**: A city map with normal two-way streets is represented by an undirected graph, whereas a city with one-way streets is modeled as a directed graph.
-
- # How It Works
  collapsed:: true
	- ## Core Mechanics
		- Let $V$ be the number of vertices and $E$ be the number of edges.
		-
		- ### Vertex Degrees
			- **Degree of a Vertex**: The number of edges connected to a vertex.
			- **Undirected Graphs**:
				- $\text{deg}(v)$: Total edges incident to vertex $v$.
			- **Directed Graphs (Digraphs)**:
				- **In-degree ($\text{deg}^-(v)$)**: Number of incoming edges pointing to $v$.
				- **Out-degree ($\text{deg}^+(v)$)**: Number of outgoing edges pointing from $v$.
				- **Total degree**: $\text{deg}(v) = \text{deg}^-(v) + \text{deg}^+(v)$.
		-
		- ### Mathematical Properties
			- **Handshaking Lemma (Undirected Graphs)**:
			  $$\sum_{v \in V} \text{deg}(v) = 2|E|$$
			  *Proof*: Every edge has two endpoints. When we sum the degrees of all vertices, every edge is counted exactly twice (once for each endpoint).
			  *Corollary*: Any undirected graph must contain an **even** number of vertices with an odd degree.
			-
			- **Handshaking Lemma (Directed Graphs)**:
			  $$\sum_{v \in V} \text{deg}^-(v) = \sum_{v \in V} \text{deg}^+(v) = |E|$$
			  *Proof*: Every directed edge points from exactly one vertex (contributing 1 to out-degree sum) and points to exactly one vertex (contributing 1 to in-degree sum).
		-
		- ### Pathing Concepts
			- To describe movement across graphs, we define:
				- **Walk**: A sequence of vertices and edges where vertices and edges can be repeated.
				- **Trail**: A walk where **no edges** are repeated.
				- **Path**: A walk where **no vertices** (and therefore no edges) are repeated.
				- **Cycle**: A path that starts and ends at the same vertex.
	-
	- ## Visual Walkthrough
		- ### Graph Comparison
			- ```
			  Undirected Graph                 Directed Graph
			      0 --- 1                         0 ---> 1
			      |   /                           ^    /
			      |  /                            |   v
			      2                               2 <
			  ```
		-
		- ### Degree Analysis Table
			- | Vertex | Undirected Degree | Directed In-Degree | Directed Out-Degree |
			  |---|---|---|---|
			  | **0** | 2 (incident to 1, 2) | 1 (from 2) | 1 (to 1) |
			  | **1** | 2 (incident to 0, 2) | 1 (from 0) | 1 (to 2) |
			  | **2** | 2 (incident to 0, 1) | 1 (from 1) | 1 (to 0) |
-
- # Time & Space Complexity
  collapsed:: true
	- Calculating degrees of all vertices depends on the chosen representation:
		- | Representation | Calculating Degrees | Notes |
		  |---|---|---|
		  | **Adjacency List** | $O(V + E)$ | Traverse all lists once and count elements. |
		  | **Adjacency Matrix** | $O(V^2)$ | Must scan every cell in the $V \times V$ matrix. |
-
- # Implementation
  collapsed:: true
	- :::code-tabs
	  
	  ```python
	  class DirectedGraph:
	      def __init__(self, num_vertices):
	          self.V = num_vertices
	          self.adj_list = [[] for _ in range(num_vertices)]
	  
	      def add_edge(self, u, v):
	          # u -> v (directed edge)
	          self.adj_list[u].append(v)
	  
	      def calculate_degrees(self):
	          """Returns (in_degrees, out_degrees) lists."""
	          in_degrees = [0] * self.V
	          out_degrees = [0] * self.V
	  
	          for u in range(self.V):
	              out_degrees[u] = len(self.adj_list[u])
	              for v in self.adj_list[u]:
	                  in_degrees[v] += 1
	  
	          return in_degrees, out_degrees
	  
	      def is_valid_path(self, path):
	          """Checks if a sequence of vertices represents a valid path in the graph."""
	          if not path:
	              return True
	          
	          # Check boundaries
	          for node in path:
	              if node < 0 or node >= self.V:
	                  return False
	  
	          for i in range(len(path) - 1):
	              u, v = path[i], path[i + 1]
	              if v not in self.adj_list[u]:
	                  return False
	          return True
	  
	  
	  class UndirectedGraph:
	      def __init__(self, num_vertices):
	          self.V = num_vertices
	          self.adj_list = [[] for _ in range(num_vertices)]
	  
	      def add_edge(self, u, v):
	          self.adj_list[u].append(v)
	          self.adj_list[v].append(u)
	  
	      def calculate_degrees(self):
	          """Returns a list of vertex degrees."""
	          degrees = [len(self.adj_list[u]) for u in range(self.V)]
	          return degrees
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  class DirectedGraph {
	  private:
	      int V;
	      std::vector<std::vector<int>> adjList;
	  
	  public:
	      DirectedGraph(int vertices) : V(vertices), adjList(vertices) {}
	  
	      void addEdge(int u, int v) {
	          adjList[u].push_back(v);
	      }
	  
	      std::pair<std::vector<int>, std::vector<int>> calculateDegrees() const {
	          std::vector<int> inDegrees(V, 0);
	          std::vector<int> outDegrees(V, 0);
	  
	          for (int u = 0; u < V; ++u) {
	              outDegrees[u] = adjList[u].size();
	              for (int v : adjList[u]) {
	                  inDegrees[v]++;
	              }
	          }
	          return {inDegrees, outDegrees};
	      }
	  
	      bool isValidPath(const std::vector<int>& path) const {
	          if (path.empty()) return true;
	  
	          for (int node : path) {
	              if (node < 0 || node >= V) return false;
	          }
	  
	          for (size_t i = 0; i < path.size() - 1; ++i) {
	              int u = path[i];
	              int v = path[i + 1];
	              auto it = std::find(adjList[u].begin(), adjList[u].end(), v);
	              if (it == adjList[u].end()) {
	                  return false;
	              }
	          }
	          return true;
	      }
	  };
	  
	  class UndirectedGraph {
	  private:
	      int V;
	      std::vector<std::vector<int>> adjList;
	  
	  public:
	      UndirectedGraph(int vertices) : V(vertices), adjList(vertices) {}
	  
	      void addEdge(int u, int v) {
	          adjList[u].push_back(v);
	          adjList[v].push_back(u);
	      }
	  
	      std::vector<int> calculateDegrees() const {
	          std::vector<int> degrees(V);
	          for (int u = 0; u < V; ++u) {
	              degrees[u] = adjList[u].size();
	          }
	          return degrees;
	      }
	  };
	  ```
	  
	  :::
-
- # When to Use
  collapsed:: true
	- ## ✅ Use Directed Graphs When:
		- You need to represent dependencies, such as package builds or task scheduling (resulting in [[Topological Sort Algorithm]] constraints on a DAG).
		- You are modeling internet links (web crawling, PageRank) or financial transaction paths.
	- ## ✅ Use Undirected Graphs When:
		- Relationships are bidirectional by nature (e.g. electrical circuits, chemical bonds, physical road networks).
		- You want to study simple graph connectivity and components.
-
- # Variations & Related Concepts
  collapsed:: true
	- **Directed Acyclic Graph (DAG)**: A directed graph containing no cycles. Highly important for dependency modeling.
	- **Strongly Connected Component (SCC)**: A subset of vertices in a directed graph where every vertex is reachable from every other vertex in the subset. Found using [[kosarajus-algorithm]] or [[tarjans-algorithm]].
-
- # Key Takeaways
  collapsed:: true
	- Undirected graphs represent mutual relationships, while directed graphs represent directional flows.
	- The sum of all degrees in an undirected graph equals twice the edge count ($2|E|$).
	- The sum of in-degrees equals the sum of out-degrees, which equals the total edge count ($|E|$) in directed graphs.
	- Pathing terms range from general walks (repeated vertices/edges allowed) to trails (no repeated edges) and paths (no repeated vertices).
	- Graph traversals (BFS, DFS) must account for edge direction to prevent incorrect reachability assumptions.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Wikipedia -> Directed graph](https://en.wikipedia.org/wiki/Directed_graph)
		- [GeeksforGeeks -> Mathematics | Graph Theory Basics](https://www.geeksforgeeks.org/mathematics-graph-theory-basics/)