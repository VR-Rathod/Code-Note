---
seoTitle: Kosaraju's Algorithm – Strongly Connected Components (SCC)
description: "Master Kosaraju's algorithm for finding Strongly Connected Components in a directed graph. Covers the 2-pass DFS strategy, graph transposition, and O(V+E) complexity in 5 languages."
keywords: "Kosaraju algorithm, Strongly Connected Components, SCC, graph traversal, DFS, transpose graph, O(V+E), algorithm, VR-Rathod, Code-Note, Kosarajus Algorithm"
displayTitle: Kosaraju's Algorithm
treeTitle: DSA - Graph Algorithms - Kosarajus Algorithm
---

> [!info] What is Kosaraju's Algorithm?
> **Kosaraju's Algorithm** is an elegant linear-time algorithm used to find all **Strongly Connected Components (SCCs)** in a directed graph.
> A Strongly Connected Component is a maximal subset of vertices where every vertex is reachable from every other vertex in that subset. The algorithm works in two passes: it performs a Depth-First Search (DFS) to determine the finishing order of nodes, reverses the graph's edges, and then processes nodes in reverse order to extract the SCCs.

- # Explanation
  collapsed:: true
	- **The Core Problem:** How do we identify clusters in a directed network (like Twitter followers or web links) where everyone in the cluster can reach everyone else? In undirected graphs, simple DFS/BFS works, but in directed graphs, one-way streets complicate reachability.
	- **The Solution:** Kosaraju's algorithm exploits the property that a graph and its transpose (reversed edges) share the exact same Strongly Connected Components.
	-
	- ## Why Reversing Works (The Magic)
	  collapsed:: true
		- In a directed graph, SCCs form a Directed Acyclic Graph (DAG) of components. If there is an edge from $SCC_A$ to $SCC_B$, there cannot be a path back (otherwise they'd merge into one SCC).
		- If we do a DFS, nodes in a "sink" SCC (no outgoing edges to other SCCs) will finish expanding first.
		- When we **reverse all edges**, "sink" SCCs become "source" SCCs.
		- If we process the nodes in the reverse of their DFS finishing times, we are guaranteed to explore the reversed graph starting from the sink SCCs. The DFS is thus trapped inside that single SCC and cannot bleed into other components!
-
- # How It Works
  collapsed:: true
	- ## Step-by-Step Execution
	  collapsed:: true
		- 1. **Pass 1 (DFS for Finishing Times):** Perform a DFS from every unvisited vertex in the original graph. When a recursive DFS call finishes (meaning all its descendants are explored), push that vertex onto a stack.
		- 2. **Transpose the Graph:** Create a new graph where the direction of every edge is reversed.
		- 3. **Pass 2 (Extract SCCs):** While the stack is not empty:
			- Pop a vertex from the stack.
			- If it hasn't been visited (reset the visited array for Pass 2), start a DFS on the transposed graph from this vertex.
			- Every vertex visited during this specific DFS call forms one Strongly Connected Component.
	-
	- ```mermaid
	  flowchart TD
	      A["Start: Original Graph G"] --> B["Run DFS on G"]
	      B --> C["Push nodes to Stack upon finishing"]
	      C --> D["Reverse all edges to create G^T"]
	      D --> E{"Is Stack empty?"}
	      E -- Yes --> F["Done! All SCCs extracted"]
	      E -- No --> G["Pop node 'v' from Stack"]
	      G --> H{"Is 'v' already visited?"}
	      H -- Yes --> E
	      H -- No --> I["Run DFS from 'v' on G^T\nAll nodes visited form one SCC"]
	      I --> E
	  ```
-
- # Complexity Analysis
  collapsed:: true
	- | Step | Time Complexity | Space Complexity |
	  |---|---|---|
	  | **Pass 1: First DFS** | $O(V + E)$ | $O(V)$ (Stack/Visited/Recursion) |
	  | **Graph Transposition** | $O(V + E)$ | $O(V + E)$ (Storing reversed graph) |
	  | **Pass 2: Second DFS** | $O(V + E)$ | $O(V)$ |
	  | **Total (Average/Worst)** | **O(V + E)** | **O(V + E)** |
-
- # Implementation
  collapsed:: true
	- > [!note] Kosaraju's Algorithm Implementation
	  > The code runs two DFS passes and outputs groups of vertices where each group represents an individual SCC.
	-
	- :::code-tabs
	  
	  ```python
	  from collections import defaultdict
	  
	  class Graph:
	      def __init__(self, vertices):
	          self.V = vertices
	          self.graph = defaultdict(list)
	          
	      def add_edge(self, u, v):
	          self.graph[u].append(v)
	          
	      def dfs(self, v, visited, stack):
	          visited[v] = True
	          for neighbor in self.graph[v]:
	              if not visited[neighbor]:
	                  self.dfs(neighbor, visited, stack)
	          stack.append(v)
	          
	      def get_transpose(self):
	          g = Graph(self.V)
	          for i in self.graph:
	              for j in self.graph[i]:
	                  g.add_edge(j, i)
	          return g
	          
	      def dfs_util(self, v, visited, scc):
	          visited[v] = True
	          scc.append(v)
	          for neighbor in self.graph[v]:
	              if not visited[neighbor]:
	                  self.dfs_util(neighbor, visited, scc)
	                  
	      def get_sccs(self):
	          stack = []
	          visited = [False] * self.V
	          
	          # Pass 1: Fill stack with finishing times
	          for i in range(self.V):
	              if not visited[i]:
	                  self.dfs(i, visited, stack)
	                  
	          # Transpose graph
	          gr = self.get_transpose()
	          
	          # Pass 2: Process nodes in reverse finishing order
	          visited = [False] * self.V
	          all_sccs = []
	          
	          while stack:
	              i = stack.pop()
	              if not visited[i]:
	                  scc = []
	                  gr.dfs_util(i, visited, scc)
	                  all_sccs.append(scc)
	                  
	          return all_sccs
	  
	  if __name__ == "__main__":
	      g = Graph(5)
	      g.add_edge(1, 0)
	      g.add_edge(0, 2)
	      g.add_edge(2, 1)
	      g.add_edge(0, 3)
	      g.add_edge(3, 4)
	      
	      print("Strongly Connected Components:")
	      sccs = g.get_sccs()
	      for scc in sccs:
	          print(scc)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <stack>
	  
	  using namespace std;
	  
	  class Graph {
	      int V;
	      vector<vector<int>> adj;
	  
	      void fillOrder(int v, vector<bool>& visited, stack<int>& Stack) {
	          visited[v] = true;
	          for (int i : adj[v])
	              if (!visited[i])
	                  fillOrder(i, visited, Stack);
	          Stack.push(v);
	      }
	  
	      void DFSUtil(int v, vector<bool>& visited, vector<int>& scc) {
	          visited[v] = true;
	          scc.push_back(v);
	          for (int i : adj[v])
	              if (!visited[i])
	                  DFSUtil(i, visited, scc);
	      }
	  
	      Graph getTranspose() {
	          Graph g(V);
	          for (int v = 0; v < V; v++) {
	              for (int i : adj[v]) {
	                  g.adj[i].push_back(v);
	              }
	          }
	          return g;
	      }
	  
	  public:
	      Graph(int V) {
	          this->V = V;
	          adj.resize(V);
	      }
	  
	      void addEdge(int v, int w) {
	          adj[v].push_back(w);
	      }
	  
	      void printSCCs() {
	          stack<int> Stack;
	          vector<bool> visited(V, false);
	  
	          for (int i = 0; i < V; i++)
	              if (!visited[i])
	                  fillOrder(i, visited, Stack);
	  
	          Graph gr = getTranspose();
	  
	          for (int i = 0; i < V; i++)
	              visited[i] = false;
	  
	          cout << "Strongly Connected Components:\n";
	          while (!Stack.empty()) {
	              int v = Stack.top();
	              Stack.pop();
	  
	              if (!visited[v]) {
	                  vector<int> scc;
	                  gr.DFSUtil(v, visited, scc);
	                  for (int node : scc) {
	                      cout << node << " ";
	                  }
	                  cout << "\n";
	              }
	          }
	      }
	  };
	  
	  int main() {
	      Graph g(5);
	      g.addEdge(1, 0);
	      g.addEdge(0, 2);
	      g.addEdge(2, 1);
	      g.addEdge(0, 3);
	      g.addEdge(3, 4);
	  
	      g.printSCCs();
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class Graph {
	      constructor(v) {
	          this.V = v;
	          this.adj = Array.from({length: v}, () => []);
	      }
	      
	      addEdge(v, w) {
	          this.adj[v].push(w);
	      }
	      
	      fillOrder(v, visited, stack) {
	          visited[v] = true;
	          for (let i of this.adj[v]) {
	              if (!visited[i]) {
	                  this.fillOrder(i, visited, stack);
	              }
	          }
	          stack.push(v);
	      }
	      
	      getTranspose() {
	          let g = new Graph(this.V);
	          for (let v = 0; v < this.V; v++) {
	              for (let i of this.adj[v]) {
	                  g.adj[i].push(v);
	              }
	          }
	          return g;
	      }
	      
	      DFSUtil(v, visited, scc) {
	          visited[v] = true;
	          scc.push(v);
	          for (let i of this.adj[v]) {
	              if (!visited[i]) {
	                  this.DFSUtil(i, visited, scc);
	              }
	          }
	      }
	      
	      printSCCs() {
	          let stack = [];
	          let visited = new Array(this.V).fill(false);
	          
	          for (let i = 0; i < this.V; i++) {
	              if (!visited[i]) {
	                  this.fillOrder(i, visited, stack);
	              }
	          }
	          
	          let gr = this.getTranspose();
	          visited.fill(false);
	          
	          console.log("Strongly Connected Components:");
	          while (stack.length > 0) {
	              let v = stack.pop();
	              if (!visited[v]) {
	                  let scc = [];
	                  gr.DFSUtil(v, visited, scc);
	                  console.log(scc.join(" "));
	              }
	          }
	      }
	  }
	  
	  let g = new Graph(5);
	  g.addEdge(1, 0);
	  g.addEdge(0, 2);
	  g.addEdge(2, 1);
	  g.addEdge(0, 3);
	  g.addEdge(3, 4);
	  
	  g.printSCCs();
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  class Graph {
	      private int V;
	      private LinkedList<Integer> adj[];
	      
	      Graph(int v) {
	          V = v;
	          adj = new LinkedList[v];
	          for (int i = 0; i < v; ++i)
	              adj[i] = new LinkedList();
	      }
	      
	      void addEdge(int v, int w) {
	          adj[v].add(w);
	      }
	      
	      void DFSUtil(int v, boolean visited[], List<Integer> scc) {
	          visited[v] = true;
	          scc.add(v);
	          
	          for (Integer n : adj[v]) {
	              if (!visited[n])
	                  DFSUtil(n, visited, scc);
	          }
	      }
	      
	      Graph getTranspose() {
	          Graph g = new Graph(V);
	          for (int v = 0; v < V; v++) {
	              for (Integer n : adj[v])
	                  g.adj[n].add(v);
	          }
	          return g;
	      }
	      
	      void fillOrder(int v, boolean visited[], Stack<Integer> stack) {
	          visited[v] = true;
	          
	          for (Integer n : adj[v]) {
	              if (!visited[n])
	                  fillOrder(n, visited, stack);
	          }
	          stack.push(v);
	      }
	      
	      void printSCCs() {
	          Stack<Integer> stack = new Stack<>();
	          boolean visited[] = new boolean[V];
	          
	          for (int i = 0; i < V; i++)
	              if (!visited[i])
	                  fillOrder(i, visited, stack);
	                  
	          Graph gr = getTranspose();
	          Arrays.fill(visited, false);
	          
	          System.out.println("Strongly Connected Components:");
	          while (!stack.empty()) {
	              int v = stack.pop();
	              if (!visited[v]) {
	                  List<Integer> scc = new ArrayList<>();
	                  gr.DFSUtil(v, visited, scc);
	                  for (int node : scc) System.out.print(node + " ");
	                  System.out.println();
	              }
	          }
	      }
	      
	      public static void main(String args[]) {
	          Graph g = new Graph(5);
	          g.addEdge(1, 0);
	          g.addEdge(0, 2);
	          g.addEdge(2, 1);
	          g.addEdge(0, 3);
	          g.addEdge(3, 4);
	          
	          g.printSCCs();
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  
	  typedef struct Node {
	      int vertex;
	      struct Node* next;
	  } Node;
	  
	  typedef struct Graph {
	      int V;
	      Node** adj;
	  } Graph;
	  
	  Graph* createGraph(int V) {
	      Graph* graph = (Graph*)malloc(sizeof(Graph));
	      graph->V = V;
	      graph->adj = (Node**)malloc(V * sizeof(Node*));
	      for (int i = 0; i < V; i++) graph->adj[i] = NULL;
	      return graph;
	  }
	  
	  void addEdge(Graph* graph, int src, int dest) {
	      Node* newNode = (Node*)malloc(sizeof(Node));
	      newNode->vertex = dest;
	      newNode->next = graph->adj[src];
	      graph->adj[src] = newNode;
	  }
	  
	  void fillOrder(Graph* graph, int v, int visited[], int* stack, int* top) {
	      visited[v] = 1;
	      Node* temp = graph->adj[v];
	      while (temp != NULL) {
	          if (!visited[temp->vertex]) {
	              fillOrder(graph, temp->vertex, visited, stack, top);
	          }
	          temp = temp->next;
	      }
	      stack[++(*top)] = v;
	  }
	  
	  void DFSUtil(Graph* graph, int v, int visited[]) {
	      visited[v] = 1;
	      printf("%d ", v);
	      Node* temp = graph->adj[v];
	      while (temp != NULL) {
	          if (!visited[temp->vertex]) {
	              DFSUtil(graph, temp->vertex, visited);
	          }
	          temp = temp->next;
	      }
	  }
	  
	  Graph* getTranspose(Graph* graph) {
	      Graph* transGraph = createGraph(graph->V);
	      for (int v = 0; v < graph->V; v++) {
	          Node* temp = graph->adj[v];
	          while (temp != NULL) {
	              addEdge(transGraph, temp->vertex, v);
	              temp = temp->next;
	          }
	      }
	      return transGraph;
	  }
	  
	  void printSCCs(Graph* graph) {
	      int V = graph->V;
	      int* visited = (int*)calloc(V, sizeof(int));
	      int* stack = (int*)malloc(V * sizeof(int));
	      int top = -1;
	      
	      for (int i = 0; i < V; i++) {
	          if (!visited[i]) {
	              fillOrder(graph, i, visited, stack, &top);
	          }
	      }
	      
	      Graph* transGraph = getTranspose(graph);
	      for (int i = 0; i < V; i++) visited[i] = 0;
	      
	      printf("Strongly Connected Components:\n");
	      while (top >= 0) {
	          int v = stack[top--];
	          if (!visited[v]) {
	              DFSUtil(transGraph, v, visited);
	              printf("\n");
	          }
	      }
	      
	      free(visited);
	      free(stack);
	  }
	  
	  int main() {
	      Graph* g = createGraph(5);
	      addEdge(g, 1, 0);
	      addEdge(g, 0, 2);
	      addEdge(g, 2, 1);
	      addEdge(g, 0, 3);
	      addEdge(g, 3, 4);
	      
	      printSCCs(g);
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Kosaraju's Algorithm
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Need to find SCCs\nin a directed graph?"}
	      Q -- Yes --> S1{"Is graph structure easily\nreversible / transposed?"}
	      S1 -- Yes --> R1["✅ Use Kosaraju's Algorithm\n(Easy to understand and implement)"]
	      S1 -- No (Complex object references) --> R2["✅ Use Tarjan's Algorithm\n(Requires only 1 pass)"]
	  ```
	-
	- ## ✅ Use Kosaraju's Algorithm When
		- You need to find all Strongly Connected Components.
		- Generating the transposed graph is cheap and straightforward (e.g., you use an adjacency matrix or simple adjacency list).
		- You want an algorithm that is logically very simple to explain and trace (two simple DFS loops).
	-
	- ## ❌ Avoid Kosaraju's Algorithm When
		- Memory is severely constrained. Reversing the graph doubles the edge storage requirement $O(E)$ space if you don't destroy the original. Tarjan's algorithm is $O(V+E)$ time but requires no extra graph copy.
		- Caching and memory latency are highly sensitive. Two passes over the graph means cache lines are completely refreshed between passes.
-
- # Key Takeaways
  collapsed:: true
	- **Twin Pass Structure** — uses exactly two standard DFS executions separated by a graph reversal.
	- **Post-Order Stack** — the first DFS builds a stack based entirely on when nodes *finish* expanding, organically sorting topological clusters.
	- **The Transpose Trick** — reversing the graph acts as a filter, allowing the second DFS to explore precisely within the bounds of a single component without escaping to others.
	- **Linear Efficiency** — accomplishes complex cycle clustering in purely linear time $O(V + E)$.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Kosaraju's Algorithm for SCCs](https://www.geeksforgeeks.org/strongly-connected-components/)
		- [TheAlgorithms – Kosaraju (Python)](https://github.com/TheAlgorithms/Python/blob/master/graphs/kosaraju.py)