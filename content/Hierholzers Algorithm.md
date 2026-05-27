---
seoTitle: Eulerian Path & Circuit (Hierholzer's Algorithm)
description: "Master Hierholzer's algorithm for finding Eulerian Paths and Circuits. Covers degree counting, DFS backtracking, and O(V+E) time complexity."
keywords: "Hierholzer algorithm, Eulerian Path, Eulerian Circuit, graph traversal, DFS, degree counting, O(V+E), algorithm, VR-Rathod, Code-Note"
---

> [!info] What is Hierholzer's Algorithm?
> **Hierholzer's Algorithm** is an efficient linear-time algorithm used to find an **Eulerian Path** or an **Eulerian Circuit** in a graph.
> An **Eulerian Path** is a trail in a finite graph that visits *every edge exactly once*. If the path starts and ends on the same vertex, it is called an **Eulerian Circuit**. Hierholzer's algorithm elegantly constructs this path by performing a Depth-First Search (DFS) and recording nodes only when they get "stuck" (i.e., when they have no unused outgoing edges left).

- # Explanation
  collapsed:: true
	- **The Core Problem:** Given a network of bridges (like the famous Seven Bridges of Königsberg) or a set of directed flights, how do we traverse every single connection exactly once without getting hopelessly stuck halfway through?
	- **The Solution:** We must first ensure a path is mathematically possible by counting the "degrees" (inbound vs outbound connections) of every node. If it is possible, Hierholzer's algorithm dictates that we just start walking. If we hit a dead end, that node *must* be the final destination of our path! We record it, back up a step, and explore alternative edges.
	-
	- ## The Mathematical Rules (For Directed Graphs)
	  collapsed:: true
		- **To have an Eulerian Circuit:** Every single vertex must have `in-degree == out-degree`. (You can start anywhere).
		- **To have an Eulerian Path:** At most one vertex has `out-degree - in-degree == 1` (this is the **Start Node**), and at most one vertex has `in-degree - out-degree == 1` (this is the **End Node**). All other vertices must have `in-degree == out-degree`.
		- *Note: If a graph is broken into disconnected components (that have edges), no Eulerian Path can cover all of it.*
-
- # How It Works
  collapsed:: true
	- ## Step-by-Step Execution
	  collapsed:: true
		- 1. **Count Degrees:** Loop through all edges to calculate the in-degree and out-degree of every vertex.
		- 2. **Find the Start Node:**
			- If there is a node with `out-degree - in-degree == 1`, it MUST be the starting node.
			- Otherwise (if it's a circuit), just pick any node that has outgoing edges.
		- 3. **DFS Traversal:** Start a DFS from the start node.
			- While the current node has outgoing edges, remove one edge from its adjacency list and recursively call DFS on the destination node.
		- 4. **Backtracking (The Magic):** When a node has NO remaining outgoing edges, it means we have reached the end of a sub-path. Push this node onto a stack (or prepend it to a list).
		- 5. **Reverse the Result:** Because nodes are added as they get "stuck", the final destination is added first. Reversing the recorded sequence gives the correct Eulerian Path from start to finish.
	-
	- ```mermaid
	  flowchart TD
	      A["Start: Calculate In/Out Degrees"] --> B{"Check Conditions"}
	      B -- "Invalid degrees" --> C["No Eulerian Path exists"]
	      B -- "Valid" --> D["Find Start Node"]
	      D --> E["Run DFS(start_node)"]
	      E --> F{"Has unused\noutgoing edges?"}
	      F -- Yes --> G["Remove edge (u->v)\nDFS(v)"]
	      G --> F
	      F -- No (Stuck) --> H["Prepend current node\nto Final Path"]
	      H --> I["Return to previous DFS call\n(Backtrack)"]
	      I --> F
	  ```
-
- # Complexity Analysis
  collapsed:: true
	- | Step | Time Complexity | Space Complexity |
	  |---|---|---|
	  | **Counting Degrees** | $O(V + E)$ | $O(V)$ |
	  | **DFS & Backtracking** | $O(V + E)$ | $O(V + E)$ (Call stack + Path storage) |
	  | **Total (Average/Worst)** | **O(V + E)** | **O(V + E)** |
	- *Why is it $O(E)$? Because we physically remove (or mark as visited) each edge as we traverse it, guaranteeing we never process the same edge twice.*
-
- # Implementation
  collapsed:: true
	- > [!note] Hierholzer's Algorithm Implementation
	  > The following implementations demonstrate finding an Eulerian Path in a **Directed Graph**. We use an adjacency list (often a stack/queue for edges) to easily pop unused edges in $O(1)$ time.
	-
	- :::code-tabs
	  
	  ```python
	  from collections import defaultdict
	  
	  def find_eulerian_path(pairs):
	      # Build graph and degree counters
	      graph = defaultdict(list)
	      in_degree = defaultdict(int)
	      out_degree = defaultdict(int)
	      
	      for u, v in pairs:
	          graph[u].append(v)
	          out_degree[u] += 1
	          in_degree[v] += 1
	          
	      # Find start node
	      start_node = pairs[0][0] # fallback
	      for node in out_degree:
	          if out_degree[node] - in_degree[node] == 1:
	              start_node = node
	              break
	              
	      # DFS Traversal
	      path = []
	      def dfs(u):
	          while graph[u]:
	              next_node = graph[u].pop() # Remove edge
	              dfs(next_node)
	          path.append(u) # Got stuck, add to path
	          
	      dfs(start_node)
	      
	      return path[::-1] # Reverse the path
	  
	  if __name__ == "__main__":
	      edges = [("A", "B"), ("B", "C"), ("C", "A"), ("A", "D"), ("D", "B")]
	      print("Eulerian Path:", find_eulerian_path(edges))
	      # Output: A -> D -> B -> C -> A -> B
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <unordered_map>
	  #include <algorithm>
	  
	  using namespace std;
	  
	  vector<string> findEulerianPath(vector<pair<string, string>>& edges) {
	      unordered_map<string, vector<string>> graph;
	      unordered_map<string, int> in_degree, out_degree;
	      
	      for (auto& edge : edges) {
	          graph[edge.first].push_back(edge.second);
	          out_degree[edge.first]++;
	          in_degree[edge.second]++;
	      }
	      
	      string start_node = edges[0].first;
	      for (auto& pair : out_degree) {
	          string node = pair.first;
	          if (out_degree[node] - in_degree[node] == 1) {
	              start_node = node;
	              break;
	          }
	      }
	      
	      vector<string> path;
	      vector<string> stack;
	      stack.push_back(start_node);
	      
	      while (!stack.empty()) {
	          string curr = stack.back();
	          
	          if (!graph[curr].empty()) {
	              string next_node = graph[curr].back();
	              graph[curr].pop_back();
	              stack.push_back(next_node);
	          } else {
	              path.push_back(curr);
	              stack.pop_back();
	          }
	      }
	      
	      reverse(path.begin(), path.end());
	      return path;
	  }
	  
	  int main() {
	      vector<pair<string, string>> edges = {
	          {"A", "B"}, {"B", "C"}, {"C", "A"}, {"A", "D"}, {"D", "B"}
	      };
	      
	      vector<string> path = findEulerianPath(edges);
	      cout << "Eulerian Path: ";
	      for (const string& node : path) {
	          cout << node << " ";
	      }
	      cout << endl;
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function findEulerianPath(edges) {
	      const graph = new Map();
	      const inDegree = new Map();
	      const outDegree = new Map();
	      
	      for (let [u, v] of edges) {
	          if (!graph.has(u)) graph.set(u, []);
	          graph.get(u).push(v);
	          
	          outDegree.set(u, (outDegree.get(u) || 0) + 1);
	          inDegree.set(v, (inDegree.get(v) || 0) + 1);
	      }
	      
	      let startNode = edges[0][0];
	      for (let [node, count] of outDegree) {
	          if (count - (inDegree.get(node) || 0) === 1) {
	              startNode = node;
	              break;
	          }
	      }
	      
	      const path = [];
	      
	      function dfs(u) {
	          const neighbors = graph.get(u) || [];
	          while (neighbors.length > 0) {
	              const nextNode = neighbors.pop();
	              dfs(nextNode);
	          }
	          path.push(u);
	      }
	      
	      dfs(startNode);
	      return path.reverse();
	  }
	  
	  const edges = [["A", "B"], ["B", "C"], ["C", "A"], ["A", "D"], ["D", "B"]];
	  console.log("Eulerian Path:", findEulerianPath(edges).join(" -> "));
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class HierholzerAlgorithm {
	      public static List<String> findEulerianPath(String[][] edges) {
	          Map<String, Stack<String>> graph = new HashMap<>();
	          Map<String, Integer> inDegree = new HashMap<>();
	          Map<String, Integer> outDegree = new HashMap<>();
	          
	          for (String[] edge : edges) {
	              graph.computeIfAbsent(edge[0], k -> new Stack<>()).push(edge[1]);
	              outDegree.put(edge[0], outDegree.getOrDefault(edge[0], 0) + 1);
	              inDegree.put(edge[1], inDegree.getOrDefault(edge[1], 0) + 1);
	          }
	          
	          String startNode = edges[0][0];
	          for (String node : outDegree.keySet()) {
	              if (outDegree.get(node) - inDegree.getOrDefault(node, 0) == 1) {
	                  startNode = node;
	                  break;
	              }
	          }
	          
	          List<String> path = new ArrayList<>();
	          Deque<String> stack = new ArrayDeque<>();
	          stack.push(startNode);
	          
	          while (!stack.isEmpty()) {
	              String curr = stack.peek();
	              if (graph.containsKey(curr) && !graph.get(curr).isEmpty()) {
	                  stack.push(graph.get(curr).pop());
	              } else {
	                  path.add(stack.pop());
	              }
	          }
	          
	          Collections.reverse(path);
	          return path;
	      }
	      
	      public static void main(String[] args) {
	          String[][] edges = {
	              {"A", "B"}, {"B", "C"}, {"C", "A"}, {"A", "D"}, {"D", "B"}
	          };
	          System.out.println("Eulerian Path: " + findEulerianPath(edges));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  #include <string.h>
	  
	  #define MAX_NODES 100
	  
	  typedef struct {
	      int to;
	      int used;
	  } Edge;
	  
	  int graph[MAX_NODES][MAX_NODES];
	  int edge_count[MAX_NODES];
	  int in_degree[MAX_NODES] = {0};
	  int out_degree[MAX_NODES] = {0};
	  int path[MAX_NODES * MAX_NODES];
	  int path_index = 0;
	  
	  void dfs(int u) {
	      while (edge_count[u] > 0) {
	          int v = graph[u][--edge_count[u]];
	          dfs(v);
	      }
	      path[path_index++] = u;
	  }
	  
	  void findEulerianPath(int num_edges, int edges[][2]) {
	      for (int i = 0; i < num_edges; i++) {
	          int u = edges[i][0];
	          int v = edges[i][1];
	          graph[u][edge_count[u]++] = v;
	          out_degree[u]++;
	          in_degree[v]++;
	      }
	      
	      int start_node = edges[0][0];
	      for (int i = 0; i < MAX_NODES; i++) {
	          if (out_degree[i] - in_degree[i] == 1) {
	              start_node = i;
	              break;
	          }
	      }
	      
	      dfs(start_node);
	      
	      printf("Eulerian Path: ");
	      for (int i = path_index - 1; i >= 0; i--) {
	          printf("%d ", path[i]);
	      }
	      printf("\n");
	  }
	  
	  int main() {
	      // Graph represented by integers A=0, B=1, C=2, D=3
	      int edges[][2] = {
	          {0, 1}, {1, 2}, {2, 0}, {0, 3}, {3, 1}
	      };
	      
	      findEulerianPath(5, edges);
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Hierholzer's Algorithm
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Need to traverse EVERY edge\nexactly once?"}
	      Q -- Yes --> S1{"Does a path mathematically exist\n(Check In/Out degrees)?"}
	      S1 -- Yes --> R1["✅ Use Hierholzer's Algorithm\n(Fast and linear time)"]
	      S1 -- No --> R2["❌ Impossible Task\n(No Eulerian Path)"]
	      Q -- No (Every vertex once) --> R3["❌ Use Hamiltonian Path / TSP\n(NP-Hard)"]
	  ```
	-
	- ## ✅ Use Hierholzer's Algorithm When
		- You need to reconstruct a sequence from overlapping pairs (e.g., DNA fragment assembly).
		- Solving puzzles like "draw this shape without lifting your pen or retracing a line".
		- Routing snowplows, garbage trucks, or postal workers where every street (edge) must be visited efficiently.
	-
	- ## ❌ Avoid Hierholzer's Algorithm When
		- You need to visit every **Vertex** exactly once. That is the **Hamiltonian Path** problem, which is completely different and heavily NP-Hard (requiring exponential time backtracking).
-
- # Key Takeaways
  collapsed:: true
	- **Edge Deletion** — structurally modifying the graph by removing/popping edges as you traverse prevents infinite loops.
	- **Post-Order Pathing** — nodes are added to the final list *only* when they reach a dead end. This ensures that cyclic side-quests are naturally completed before moving backward.
	- **Reverse for Truth** — because of the post-order backtracking stack, the final sequence must always be reversed to get the correct chronological path.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Hierholzer’s Algorithm for directed graph](https://www.geeksforgeeks.org/hierholzers-algorithm-directed-graph/)
		- [LeetCode – Reconstruct Itinerary (Eulerian Path Application)](https://leetcode.com/problems/reconstruct-itinerary/)
