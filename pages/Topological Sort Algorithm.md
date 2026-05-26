---
seoTitle: Topological Sort Algorithm – DAG Ordering with DFS and Kahn's
description: "Comprehensive guide to Topological Sorting. Covers Directed Acyclic Graphs (DAG), Kahn's BFS Algorithm, DFS-based post-order stack, and O(V+E) time complexity."
keywords: "topological sort, DAG, directed acyclic graph, DFS, Kahn algorithm, BFS, cycle detection, O(V+E), time complexity, space complexity, dependency resolution, VR-Rathod, Code-Note"
---

> [!info] What is Topological Sort?
> **Topological Sort** is a linear ordering of vertices in a **Directed Acyclic Graph (DAG)** such that for every directed edge $U \rightarrow V$, vertex $U$ comes before vertex $V$ in the ordering.
> It is extensively used for scheduling tasks, resolving dependencies, and building systems (like npm, make, or maven).

- # Explanation
  collapsed:: true
	- Imagine you are enrolling in university courses. You cannot take `Calculus II` before you take `Calculus I`. If you model courses as nodes and prerequisites as directed edges, a **Topological Sort** provides you with a valid sequence in which you can take the courses to satisfy all prerequisites.
	-
	- ## The DAG Requirement
	  collapsed:: true
		- Topological sort is **impossible** if the graph contains a cycle. If `A` requires `B`, and `B` requires `A`, neither can be executed first.
		- Thus, it strictly applies only to **Directed Acyclic Graphs (DAG)**. If a graph cannot be topologically sorted, it proves the graph has a cycle.
	-
	- ## The Two Main Approaches
	  collapsed:: true
		- There are two legendary algorithms to compute the topological sort:
		- **1. Kahn's Algorithm (BFS based):** Uses an in-degree array (counting incoming edges) and a Queue. Nodes with 0 dependencies are pushed to the queue and processed.
		- **2. DFS Algorithm:** Uses Depth-First Search. As you completely finish exploring a node's recursive branches, you push the node onto a Stack. Reversing the stack at the end yields the topological order.
-
- # How It Works
  collapsed:: true
	- ## Approach 1: Kahn's Algorithm (In-Degree)
	  collapsed:: true
		- Calculate the **in-degree** (number of incoming edges) for every vertex.
		- Push all vertices with an in-degree of `0` into a Queue.
		- While the Queue is not empty:
		  - Pop vertex `U`. Add `U` to the topological order array.
		  - For every neighbor `V` of `U`, decrement `V`'s in-degree by 1.
		  - If `V`'s in-degree hits `0`, push `V` into the Queue.
		- If the final sorted array doesn't contain all $V$ vertices, the graph has a cycle!
		-
		- ```mermaid
		  flowchart TD
		      A["Calculate In-Degree for all nodes"] --> B["Queue = [Nodes with In-Degree 0]"]
		      B --> C{"Is Queue empty?"}
		      C -- No --> D["Pop U from Queue\nAdd U to result list"]
		      D --> E["For each neighbor V of U"]
		      E --> F["in_degree[V] -= 1"]
		      F --> G{"in_degree[V] == 0?"}
		      G -- Yes --> H["Push V to Queue"]
		      G -- No --> E2["Next neighbor"]
		      H --> E2
		      E2 -- Loop ends --> C
		      C -- Yes --> I{"Result size == V?"}
		      I -- Yes --> J["Return Result (Valid Sort)"]
		      I -- No --> K["Cycle Detected! No Sort Possible"]
		  ```
	-
	- ## Approach 2: DFS Stack
	  collapsed:: true
		- Create an empty Stack and a `visited` boolean array.
		- Loop through all vertices. If a vertex is unvisited, launch a `DFS(vertex)`.
		- Inside `DFS(u)`:
		  - Mark `u` as visited.
		  - Recursively call DFS on all unvisited neighbors of `u`.
		  - Once all neighbors are processed, **Push `u` to the Stack**.
		- After the loop finishes, popping everything off the stack yields the topological order.
-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > - **Time Complexity: O(V + E)** — Both Kahn's and DFS visit every vertex and edge exactly once.
	  > - **Space Complexity: O(V)** — Memory for the Queue/Stack, In-Degree array, and Visited array.
-
- # Implementation
  collapsed:: true
	- > [!note] Implementation of Kahn's Algorithm (BFS based).
	  > Kahn's algorithm is preferred because it handles cycle detection effortlessly.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  from collections import deque
	  
	  def topological_sort_kahn(num_vertices, graph):
	      """
	      Kahn's Algorithm for Topological Sort
	      Time: O(V + E) | Space: O(V)
	      """
	      in_degree = [0] * num_vertices
	      
	      # Calculate in-degrees
	      for u in range(num_vertices):
	          for v in graph.get(u, []):
	              in_degree[v] += 1
	              
	      # Queue for nodes with no incoming edges
	      queue = deque([i for i in range(num_vertices) if in_degree[i] == 0])
	      top_order = []
	      
	      while queue:
	          u = queue.popleft()
	          top_order.append(u)
	          
	          # Reduce in-degree of neighbors
	          for v in graph.get(u, []):
	              in_degree[v] -= 1
	              if in_degree[v] == 0:
	                  queue.append(v)
	                  
	      # Cycle check
	      if len(top_order) != num_vertices:
	          return "Cycle detected! Topological sort impossible."
	          
	      return top_order
	  
	  # Example Setup
	  # 5 -> 2, 5 -> 0, 4 -> 0, 4 -> 1, 2 -> 3, 3 -> 1
	  graph = {
	      5: [2, 0],
	      4: [0, 1],
	      2: [3],
	      3: [1],
	      0: [],
	      1: []
	  }
	  print("Topological Order:", topological_sort_kahn(6, graph))
	  # Output: [4, 5, 2, 0, 3, 1] (or similar valid ordering)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <queue>
	  
	  using namespace std;
	  
	  vector<int> topologicalSortKahn(int V, vector<vector<int>>& adj) {
	      vector<int> in_degree(V, 0);
	  
	      for (int u = 0; u < V; u++) {
	          for (int v : adj[u]) {
	              in_degree[v]++;
	          }
	      }
	  
	      queue<int> q;
	      for (int i = 0; i < V; i++) {
	          if (in_degree[i] == 0) q.push(i);
	      }
	  
	      vector<int> top_order;
	      while (!q.empty()) {
	          int u = q.front();
	          q.pop();
	          top_order.push_back(u);
	  
	          for (int v : adj[u]) {
	              if (--in_degree[v] == 0) {
	                  q.push(v);
	              }
	          }
	      }
	  
	      if (top_order.size() != V) {
	          cout << "Cycle detected!\n";
	          return {};
	      }
	  
	      return top_order;
	  }
	  
	  int main() {
	      int V = 6;
	      vector<vector<int>> adj(V);
	      adj[5] = {2, 0};
	      adj[4] = {0, 1};
	      adj[2] = {3};
	      adj[3] = {1};
	  
	      vector<int> res = topologicalSortKahn(V, adj);
	      cout << "Topological Order: ";
	      for (int i : res) cout << i << " ";
	      cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function topologicalSortKahn(V, adj) {
	      let in_degree = Array(V).fill(0);
	      
	      for (let u = 0; u < V; u++) {
	          for (let v of adj[u] || []) {
	              in_degree[v]++;
	          }
	      }
	      
	      let queue = [];
	      for (let i = 0; i < V; i++) {
	          if (in_degree[i] === 0) queue.push(i);
	      }
	      
	      let top_order = [];
	      
	      while (queue.length > 0) {
	          let u = queue.shift();
	          top_order.push(u);
	          
	          for (let v of adj[u] || []) {
	              in_degree[v]--;
	              if (in_degree[v] === 0) queue.push(v);
	          }
	      }
	      
	      if (top_order.length !== V) return "Cycle detected!";
	      return top_order;
	  }
	  
	  const adj = {
	      5: [2, 0],
	      4: [0, 1],
	      2: [3],
	      3: [1],
	      0: [],
	      1: []
	  };
	  console.log("Topological Order:", topologicalSortKahn(6, adj));
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class TopologicalSort {
	      public static List<Integer> topologicalSortKahn(int V, List<List<Integer>> adj) {
	          int[] in_degree = new int[V];
	          
	          for (int u = 0; u < V; u++) {
	              for (int v : adj.get(u)) {
	                  in_degree[v]++;
	              }
	          }
	          
	          Queue<Integer> queue = new LinkedList<>();
	          for (int i = 0; i < V; i++) {
	              if (in_degree[i] == 0) {
	                  queue.add(i);
	              }
	          }
	          
	          List<Integer> top_order = new ArrayList<>();
	          while (!queue.isEmpty()) {
	              int u = queue.poll();
	              top_order.add(u);
	              
	              for (int v : adj.get(u)) {
	                  if (--in_degree[v] == 0) {
	                      queue.add(v);
	                  }
	              }
	          }
	          
	          if (top_order.size() != V) {
	              System.out.println("Cycle detected!");
	              return new ArrayList<>();
	          }
	          
	          return top_order;
	      }
	  
	      public static void main(String[] args) {
	          int V = 6;
	          List<List<Integer>> adj = new ArrayList<>(V);
	          for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
	          
	          adj.get(5).add(2);
	          adj.get(5).add(0);
	          adj.get(4).add(0);
	          adj.get(4).add(1);
	          adj.get(2).add(3);
	          adj.get(3).add(1);
	          
	          System.out.println("Topological Order: " + topologicalSortKahn(V, adj));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  #include <stdbool.h>
	  
	  #define MAX_V 100
	  
	  void topologicalSortKahn(int V, int adj[MAX_V][MAX_V], int edge_counts[MAX_V]) {
	      int in_degree[MAX_V] = {0};
	      
	      for (int u = 0; u < V; u++) {
	          for (int i = 0; i < edge_counts[u]; i++) {
	              in_degree[adj[u][i]]++;
	          }
	      }
	      
	      int queue[MAX_V], front = 0, rear = 0;
	      for (int i = 0; i < V; i++) {
	          if (in_degree[i] == 0) {
	              queue[rear++] = i;
	          }
	      }
	      
	      int top_order[MAX_V], count = 0;
	      
	      while (front < rear) {
	          int u = queue[front++];
	          top_order[count++] = u;
	          
	          for (int i = 0; i < edge_counts[u]; i++) {
	              int v = adj[u][i];
	              if (--in_degree[v] == 0) {
	                  queue[rear++] = v;
	              }
	          }
	      }
	      
	      if (count != V) {
	          printf("Cycle detected!\n");
	          return;
	      }
	      
	      printf("Topological Order: ");
	      for (int i = 0; i < count; i++) {
	          printf("%d ", top_order[i]);
	      }
	      printf("\n");
	  }
	  
	  int main() {
	      int V = 6;
	      int adj[MAX_V][MAX_V];
	      int edge_counts[MAX_V] = {0};
	      
	      adj[5][edge_counts[5]++] = 2;
	      adj[5][edge_counts[5]++] = 0;
	      adj[4][edge_counts[4]++] = 0;
	      adj[4][edge_counts[4]++] = 1;
	      adj[2][edge_counts[2]++] = 3;
	      adj[3][edge_counts[3]++] = 1;
	      
	      topologicalSortKahn(V, adj, edge_counts);
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Topological Sort
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Goal"}
	      Q -- "Find shortest path" --> R1["❌ Use Dijkstra or BFS"]
	      Q -- "Graph is undirected" --> R2["❌ Cannot top-sort an undirected graph"]
	      Q -- "Resolve build dependencies" --> R3["✅ Use Kahn's Algorithm\nPerfect for Package Managers"]
	      Q -- "Detect cyclic dependencies" --> R4["✅ Use Kahn's Algorithm\nFails gracefully if cycle exists"]
	  ```
	-
	- ## ✅ Use Topological Sort When
		- Building compilers to determine the order of evaluating subexpressions.
		- Task scheduling algorithms where task B can only start after task A finishes.
		- Package managers (NPM, Pip) resolving complex nested dependency trees.
-
- # Key Takeaways
  collapsed:: true
	- **Core idea** — Valid execution ordering for directed graphs with no cycles.
	- **Kahn's vs DFS** — Kahn's algorithm (using in-degrees) is generally easier to implement intuitively and detects cycles cleanly.
	- **Not Unique** — A graph can have multiple valid topological sort sequences.
	- **DAG Mandatory** — Undirected graphs or cyclic directed graphs mathematically cannot be sorted topologically.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Topological Sort](https://www.geeksforgeeks.org/topological-sorting/)
		- [TheAlgorithms – Topo Sort (Python)](https://github.com/TheAlgorithms/Python/blob/master/graphs/topological_sort.py)