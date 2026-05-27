---
seoTitle: Depth First Search (DFS) – Graph Traversal Algorithm Guide
description: "Comprehensive guide to Depth First Search (DFS). Covers iterative and recursive implementations, edge classifications, cycle detection, topological sorting, and complexities in Python, C++, JavaScript, Java, and C."
keywords: "depth first search, DFS, graph traversal, recursion, backtracking, cycle detection, topological sort, connected components, Tarjan algorithm, time complexity, space complexity, graph coloring, VR-Rathod, Code-Note, Vaibhav Rathod"
---

> [!info] What is Depth First Search (DFS)?
> Depth First Search (DFS) is a fundamental graph traversal algorithm that explores as deep as possible along each branch before backtracking.
> It uses a **stack** (either the system call stack via recursion or an explicit stack structure) to keep track of the path, achieving **O(V + E)** time complexity and serving as the foundation for advanced graph topology analysis.

- # Explanation
  collapsed:: true
	- **Depth First Search** works by starting at a root node (or an arbitrary node in a graph) and choosing one of its adjacent neighbors. It goes deeper and deeper along that path until it hits a node with no unvisited neighbors (a dead end), then backtracks to the most recent node with unexplored paths and continues.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Exploring a **maze** — you walk down a path, turning whenever you can, until you hit a dead end. Once stuck, you backtrack step-by-step to the last intersection where you had a choice, and try a different path. To avoid going in circles, you leave breadcrumbs or marks on the walls (a "visited" list).
	-
	- ## DFS on Trees vs. Graphs
	  collapsed:: true
		- **Trees:** Trees are acyclic. DFS on a tree does not require tracking visited nodes, as there is no way to revisit a node via a different path.
		- **Graphs:** Graphs can contain cycles. We must explicitly track visited nodes using a `visited` set or array to prevent infinite loops and redundant exploration.
	-
	- ## DFS Edge Classification
	  collapsed:: true
		- During a DFS traversal of a graph, the edges of the graph can be categorized into four distinct classes:
			- 1. **Tree Edges:** Edges in the DFS forest. An edge $(u, v)$ is a tree edge if $v$ was first discovered by exploring $(u, v)$.
			- 2. **Back Edges:** Edges $(u, v)$ connecting a vertex $u$ to an ancestor $v$ in a DFS tree. These edges indicate the presence of **cycles** in the graph.
			- 3. **Forward Edges:** Non-tree edges $(u, v)$ connecting a vertex $u$ to a descendant $v$ in a DFS tree.
			- 4. **Cross Edges:** All other edges. They can go between vertices in the same DFS tree (as long as one is not an ancestor of the other) or between different DFS trees.
		-
		- ```mermaid
		  graph TD
		      subgraph DFSTree ["DFS Spanning Tree & Edge Types"]
		          A((A)) ---|"Tree Edge (Discovery)"| B((B))
		          B ---|"Tree Edge (Discovery)"| D((D))
		          A ---|"Tree Edge (Discovery)"| C((C))
		          C -.->|"Forward Edge (to Descendant)"| F((F))
		          C ---|"Tree Edge"| E((E))
		          E ---|"Tree Edge"| F
		          F -.->|"Back Edge (to Ancestor = Cycle)"| A
		          E -.->|"Cross Edge (to sibling branch)"| B
		      end
		  ```
	-
	- ## Why DFS over BFS?
	  collapsed:: true
		- [[Breadth First Search]] explores neighbors level-by-level, which requires storing entire levels in memory (a queue).
		- DFS goes deep, requiring memory proportional to the **maximum depth** of the graph (the path) rather than the width.
		- If target nodes are far from the source but deep, DFS can find them faster than BFS. It is also the natural choice for backtracking, topological sorting, and connectivity diagnostics.
-
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- Visit a node, mark it as visited, and recursively explore all its unvisited neighbors. When a node has no unvisited neighbors, return (backtrack) to the parent node.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — select source node"] --> B["Push node to Stack & mark Visited"]
		      B --> C{"Stack empty?"}
		      C -- Yes --> H["End — Traversal Complete"]
		      C -- No --> D["Pop node U from Stack"]
		      D --> E{"Has unvisited neighbors?"}
		      E -- Yes --> F["Pick an unvisited neighbor V\nPush U back to Stack\nPush V to Stack & mark Visited"]
		      E -- No --> C
		      F --> C
		  ```
	-
	- ## Step-by-Step Algorithm (Iterative)
	  collapsed:: true
		- ```
		  INPUT:  Graph G, Source node S
		  OUTPUT: All nodes visited in DFS order
		  
		  1. Create a stack STACK and a set VISITED
		  2. Push S to STACK
		  3. WHILE STACK is not empty:
		     a. Pop node U from STACK
		     b. IF U is not in VISITED:
		        i. Mark U as VISITED
		        ii. For each neighbor V of U (in reverse order for standard ordering):
		            IF V is not in VISITED:
		               Push V to STACK
		  ```
		- > [!tip] Neighbor Ordering in Iterative Stack
		  > We push neighbors in reverse order (e.g. from right-to-left) to ensure the stack pops them in left-to-right order, matching recursive discovery sequence.
	-
	- ## Live Walkthrough — Graph Traversal
	  collapsed:: true
		- Let's traverse the graph: `A` is connected to `B` and `C`; `B` is connected to `D` and `E`; `C` is connected to `F`.
		- ```
		  Graph Structure:
		       A
		      / \
		     B   C
		    / \   \
		   D   E   F
		  
		  Traversing step-by-step starting at A:
		  
		  ┌────────────────────────────────────────────────────────┐
		  │ Step │ Stack       │ Visited Set      │ Action         │
		  ├────────────────────────────────────────────────────────┤
		  │  1   │ [A]         │ {}               │ Pop A, Visit A │
		  │  2   │ [C, B]      │ {A}              │ Pop B, Visit B │
		  │  3   │ [C, E, D]   │ {A, B}           │ Pop D, Visit D │
		  │  4   │ [C, E]      │ {A, B, D}        │ Pop E, Visit E │
		  │  5   │ [C]         │ {A, B, D, E}     │ Pop C, Visit C │
		  │  6   │ [F]         │ {A, B, D, E, C}  │ Pop F, Visit F │
		  │  7   │ []          │ {A, B, D,E,C,F}  │ Stack empty    │
		  └────────────────────────────────────────────────────────┘
		  
		  DFS Order: A -> B -> D -> E -> C -> F
		  ```
-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > For a graph represented as an **Adjacency List** with **V vertices** and **E edges**:
	  > - **Time Complexity: O(V + E)** — every vertex is visited once, and every edge is checked.
	  > - **Space Complexity: O(V)** — to store the visited set and stack.
	-
	- ## Complexity Table
	  collapsed:: true
		- | Graph Representation | Time Complexity | Space Complexity | Why |
		  |------|------|-----|-----|
		  | **Adjacency List** | **O(V + E)** | **O(V)** | Must traverse all vertices and edges. Stack size is bounded by graph depth. |
		  | **Adjacency Matrix** | **O(V²)** | **O(V)** | Must scan an entire row of size V to find neighbors for each vertex. |
		  | **Edge List** | **O(V · E)** | **O(V)** | Must search the entire list of edges for every vertex lookup. |
	-
	- ## Scaling Comparison vs. Graph Density
	  collapsed:: true
		- ```mermaid
		  xychart-beta
		      title "DFS Performance Scale (Operations vs. Vertices)"
		      x-axis ["V=10", "V=50", "V=250", "V=1000"]
		      y-axis "Operations" 0 --> 1200000
		      bar [20, 300, 7750, 1005000]
		      line [10, 50, 250, 1000]
		  ```
		- | Vertices (V) | Edges (E = V) Sparse | Edges (E = V²) Dense | Adjacency List Operations (V + E) | Adjacency Matrix Operations (V²) |
		  |--------------|----------------------|----------------------|-----------------------------------|----------------------------------|
		  | 10           | 10                   | 100                  | 20                                | 100                              |
		  | 50           | 50                   | 2,500                | 100                               | 2,500                            |
		  | 250          | 250                  | 62,500               | 500                               | 62,500                           |
		  | 1,000        | 1,000                | 1,000,000            | 2,000                             | 1,000,000                        |
		- > [!tip] Rule of Thumb
		  > For **sparse graphs** ($E \ll V²$), the Adjacency List layout is vastly superior, keeping DFS execution near-instantaneous. For **dense graphs** ($E \approx V²$), Adjacency Matrix performance converges to match.
-
- # Implementation
  collapsed:: true
	- > [!note] The iterative version uses an explicit Stack structure.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def dfs_iterative(graph, start):
	      """
	      Iterative DFS using an explicit stack
	      Time: O(V + E) | Space: O(V)
	      Returns the traversal path list.
	      """
	      visited = set()
	      stack = [start]
	      result = []
	  
	      while stack:
	          node = stack.pop()
	          if node not in visited:
	              visited.add(node)
	              result.append(node)
	              # Push neighbors in reverse order to visit them left-to-right
	              for neighbor in reversed(graph.get(node, [])):
	                  if neighbor not in visited:
	                      stack.append(neighbor)
	      return result
	  
	  # Example Graph Adjacency List
	  graph = {
	      'A': ['B', 'C'],
	      'B': ['D', 'E'],
	      'C': ['F'],
	      'D': [],
	      'E': [],
	      'F': []
	  }
	  print("DFS Iterative Path:", dfs_iterative(graph, 'A'))
	  # Output: ['A', 'B', 'D', 'E', 'C', 'F']
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <stack>
	  #include <unordered_set>
	  #include <unordered_map>
	  
	  // Iterative DFS
	  // Time: O(V + E) | Space: O(V)
	  std::vector<char> dfsIterative(std::unordered_map<char, std::vector<char>>& graph, char start) {
	      std::vector<char> result;
	      std::unordered_set<char> visited;
	      std::stack<char> s;
	  
	      s.push(start);
	  
	      while (!s.empty()) {
	          char node = s.top();
	          s.pop();
	  
	          if (visited.find(node) == visited.end()) {
	              visited.insert(node);
	              result.push_back(node);
	  
	              // Push neighbors in reverse order to preserve left-to-right traversal
	              const auto& neighbors = graph[node];
	              for (auto it = neighbors.rbegin(); it != neighbors.rend(); ++it) {
	                  if (visited.find(*it) == visited.end()) {
	                      s.push(*it);
	                  }
	              }
	          }
	      }
	      return result;
	  }
	  
	  int main() {
	      std::unordered_map<char, std::vector<char>> graph = {
	          {'A', {'B', 'C'}},
	          {'B', {'D', 'E'}},
	          {'C', {'F'}},
	          {'D', {}},
	          {'E', {}},
	          {'F', {}}
	      };
	      std::vector<char> path = dfsIterative(graph, 'A');
	      for (char node : path) {
	          std::cout << node << " ";
	      }
	      std::cout << "\n";
	      // Output: A B D E C F
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  // Iterative DFS
	  // Time: O(V + E) | Space: O(V)
	  function dfsIterative(graph, start) {
	      const visited = new Set();
	      const stack = [start];
	      const result = [];
	  
	      while (stack.length > 0) {
	          const node = stack.pop();
	          if (!visited.has(node)) {
	              visited.add(node);
	              result.push(node);
	              
	              // Push neighbors in reverse order
	              const neighbors = graph[node] || [];
	              for (let i = neighbors.length - 1; i >= 0; i--) {
	                  if (!visited.has(neighbors[i])) {
	                      stack.push(neighbors[i]);
	                  }
	              }
	          }
	      }
	      return result;
	  }
	  
	  const graph = {
	      'A': ['B', 'C'],
	      'B': ['D', 'E'],
	      'C': ['F'],
	      'D': [],
	      'E': [],
	      'F': []
	  };
	  console.log("DFS Iterative Path:", dfsIterative(graph, 'A')); 
	  // Output: ['A', 'B', 'D', 'E', 'C', 'F']
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class DFS {
	      // Iterative DFS
	      // Time: O(V + E) | Space: O(V)
	      public static List<Character> dfsIterative(Map<Character, List<Character>> graph, char start) {
	          List<Character> result = new ArrayList<>();
	          Set<Character> visited = new HashSet<>();
	          Stack<Character> stack = new Stack<>();
	  
	          stack.push(start);
	  
	          while (!stack.isEmpty()) {
	              char node = stack.pop();
	              if (!visited.contains(node)) {
	                  visited.add(node);
	                  result.add(node);
	  
	                  List<Character> neighbors = graph.getOrDefault(node, new ArrayList<>());
	                  // Push neighbors in reverse order
	                  for (int i = neighbors.size() - 1; i >= 0; i--) {
	                      char neighbor = neighbors.get(i);
	                      if (!visited.contains(neighbor)) {
	                          stack.push(neighbor);
	                      }
	                  }
	              }
	          }
	          return result;
	      }
	  
	      public static void main(String[] args) {
	          Map<Character, List<Character>> graph = new HashMap<>();
	          graph.put('A', Arrays.asList('B', 'C'));
	          graph.put('B', Arrays.asList('D', 'E'));
	          graph.put('C', Arrays.asList('F'));
	          graph.put('D', new ArrayList<>());
	          graph.put('E', new ArrayList<>());
	          graph.put('F', new ArrayList<>());
	  
	          System.out.println("DFS Iterative Path: " + dfsIterative(graph, 'A'));
	          // Output: [A, B, D, E, C, F]
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  #include <stdbool.h>
	  
	  #define MAX_VERTICES 6
	  
	  struct Graph {
	      int numVertices;
	      int adjMatrix[MAX_VERTICES][MAX_VERTICES];
	  };
	  
	  // Iterative DFS on adjacency matrix
	  // Time: O(V²) | Space: O(V)
	  void dfsIterative(struct Graph* graph, int start) {
	      bool visited[MAX_VERTICES] = {false};
	      int stack[MAX_VERTICES];
	      int top = -1;
	  
	      stack[++top] = start;
	  
	      printf("DFS Iterative: ");
	      while (top >= 0) {
	          int curr = stack[top--];
	  
	          if (!visited[curr]) {
	              visited[curr] = true;
	              printf("%c ", curr + 'A');
	  
	              // Push neighbors in reverse order to maintain left-to-right search
	              for (int i = graph->numVertices - 1; i >= 0; i--) {
	                  if (graph->adjMatrix[curr][i] == 1 && !visited[i]) {
	                      stack[++top] = i;
	                  }
	              }
	          }
	      }
	      printf("\n");
	  }
	  
	  int main() {
	      struct Graph graph;
	      graph.numVertices = 6;
	      for (int i = 0; i < 6; i++) {
	          for (int j = 0; j < 6; j++) {
	              graph.adjMatrix[i][j] = 0;
	          }
	      }
	  
	      // A=0, B=1, C=2, D=3, E=4, F=5
	      graph.adjMatrix[0][1] = 1; // A-B
	      graph.adjMatrix[0][2] = 1; // A-C
	      graph.adjMatrix[1][3] = 1; // B-D
	      graph.adjMatrix[1][4] = 1; // B-E
	      graph.adjMatrix[2][5] = 1; // C-F
	  
	      dfsIterative(&graph, 0); // Output: A B D E C F
	      return 0;
	  }
	  ```
	  
	  :::
-
- # Recursive Variant
  collapsed:: true
	- > [!tip] Recursion vs. Iteration Space Tradeoff
	  > The recursive version uses the implicit system stack.
	  > While cleaner to write, recursive DFS risks **Stack Overflow** errors on extremely deep graphs ($V > 10,000$ in standard runtime environments).
	-
	- :::code-tabs
	  
	  ```python
	  def dfs_recursive(graph, node, visited=None, result=None):
	      """
	      Recursive DFS
	      Time: O(V + E) | Space: O(V)
	      """
	      if visited is None:
	          visited = set()
	      if result is None:
	          result = []
	  
	      visited.add(node)
	      result.append(node)
	  
	      for neighbor in graph.get(node, []):
	          if neighbor not in visited:
	              dfs_recursive(graph, neighbor, visited, result)
	      return result
	  
	  graph = {
	      'A': ['B', 'C'],
	      'B': ['D', 'E'],
	      'C': ['F'],
	      'D': [],
	      'E': [],
	      'F': []
	  }
	  print("DFS Recursive Path:", dfs_recursive(graph, 'A'))
	  # Output: ['A', 'B', 'D', 'E', 'C', 'F']
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <unordered_set>
	  #include <unordered_map>
	  
	  void dfsRecursiveHelper(std::unordered_map<char, std::vector<char>>& graph, char node, 
	                          std::unordered_set<char>& visited, std::vector<char>& result) {
	      visited.insert(node);
	      result.push_back(node);
	  
	      for (char neighbor : graph[node]) {
	          if (visited.find(neighbor) == visited.end()) {
	              dfsRecursiveHelper(graph, neighbor, visited, result);
	          }
	      }
	  }
	  
	  std::vector<char> dfsRecursive(std::unordered_map<char, std::vector<char>>& graph, char start) {
	      std::vector<char> result;
	      std::unordered_set<char> visited;
	      dfsRecursiveHelper(graph, start, visited, result);
	      return result;
	  }
	  
	  int main() {
	      std::unordered_map<char, std::vector<char>> graph = {
	          {'A', {'B', 'C'}},
	          {'B', {'D', 'E'}},
	          {'C', {'F'}},
	          {'D', {}},
	          {'E', {}},
	          {'F', {}}
	      };
	      std::vector<char> path = dfsRecursive(graph, 'A');
	      for (char node : path) std::cout << node << " ";
	      std::cout << "\n";
	      // Output: A B D E C F
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  // Recursive DFS
	  // Time: O(V + E) | Space: O(V)
	  function dfsRecursive(graph, node, visited = new Set(), result = []) {
	      visited.add(node);
	      result.push(node);
	  
	      const neighbors = graph[node] || [];
	      for (const neighbor of neighbors) {
	          if (!visited.has(neighbor)) {
	              dfsRecursive(graph, neighbor, visited, result);
	          }
	      }
	      return result;
	  }
	  
	  const graph = {
	      'A': ['B', 'C'],
	      'B': ['D', 'E'],
	      'C': ['F'],
	      'D': [],
	      'E': [],
	      'F': []
	  };
	  console.log("DFS Recursive Path:", dfsRecursive(graph, 'A')); 
	  // Output: ['A', 'B', 'D', 'E', 'C', 'F']
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class DFSRecursive {
	      private static void dfsHelper(Map<Character, List<Character>> graph, char node, 
	                                    Set<Character> visited, List<Character> result) {
	          visited.add(node);
	          result.add(node);
	  
	          for (char neighbor : graph.getOrDefault(node, new ArrayList<>())) {
	              if (!visited.contains(neighbor)) {
	                  dfsHelper(graph, neighbor, visited, result);
	              }
	          }
	      }
	  
	      public static List<Character> dfsRecursive(Map<Character, List<Character>> graph, char start) {
	          List<Character> result = new ArrayList<>();
	          Set<Character> visited = new HashSet<>();
	          dfsHelper(graph, start, visited, result);
	          return result;
	      }
	  
	      public static void main(String[] args) {
	          Map<Character, List<Character>> graph = new HashMap<>();
	          graph.put('A', Arrays.asList('B', 'C'));
	          graph.put('B', Arrays.asList('D', 'E'));
	          graph.put('C', Arrays.asList('F'));
	          graph.put('D', new ArrayList<>());
	          graph.put('E', new ArrayList<>());
	          graph.put('F', new ArrayList<>());
	  
	          System.out.println("DFS Recursive Path: " + dfsRecursive(graph, 'A'));
	          // Output: [A, B, D, E, C, F]
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdbool.h>
	  
	  #define MAX_VERTICES 6
	  
	  struct Graph {
	      int numVertices;
	      int adjMatrix[MAX_VERTICES][MAX_VERTICES];
	  };
	  
	  void dfsHelper(struct Graph* graph, int node, bool visited[]) {
	      visited[node] = true;
	      printf("%c ", node + 'A');
	  
	      for (int i = 0; i < graph->numVertices; i++) {
	          if (graph->adjMatrix[node][i] == 1 && !visited[i]) {
	              dfsHelper(graph, i, visited);
	          }
	      }
	  }
	  
	  void dfsRecursive(struct Graph* graph, int start) {
	      bool visited[MAX_VERTICES] = {false};
	      printf("DFS Recursive: ");
	      dfsHelper(graph, start, visited);
	      printf("\n");
	  }
	  
	  int main() {
	      struct Graph graph;
	      graph.numVertices = 6;
	      for (int i = 0; i < 6; i++) {
	          for (int j = 0; j < 6; j++) {
	              graph.adjMatrix[i][j] = 0;
	          }
	      }
	  
	      graph.adjMatrix[0][1] = 1; // A-B
	      graph.adjMatrix[0][2] = 1; // A-C
	      graph.adjMatrix[1][3] = 1; // B-D
	      graph.adjMatrix[1][4] = 1; // B-E
	      graph.adjMatrix[2][5] = 1; // C-F
	  
	      dfsRecursive(&graph, 0); // Output: A B D E C F
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use DFS
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"What is the task?"}
	      Q -- "Find shortest path (unweighted)" --> R1["❌ Use BFS\nDFS does not guarantee shortest path first"]
	      Q -- "Topological Sort / Dependencies" --> R2["✅ Use DFS\nFits back-tracking node ordering"]
	      Q -- "Cycle Detection" --> R3["✅ Use DFS\nBack edges directly identify cycles"]
	      Q -- "Exhaustive Search / All Paths" --> R4["✅ Use DFS\nSaves memory vs BFS in wide trees"]
	  ```
	-
	- ## ✅ Use DFS When
		- You need to detect a **cycle** in a graph.
		- You want to perform **Topological Sorting** (e.g., resolving package/task dependencies).
		- You need to find **all possible paths** from a source to a destination.
		- The graph is **very wide** but relatively shallow (DFS uses much less memory than [[Breadth First Search]] here).
		- You are solving **backtracking problems** (e.g., N-Queens, Sudoku, Maze solvers).
		- You want to check **connected components** or bipartite properties.
	-
	- ## ❌ Avoid DFS When
		- You need to find the **shortest path** on an unweighted graph (use [[Breadth First Search]] instead).
		- The graph is **extremely deep** or infinite, which can lead to a Stack Overflow or getting stuck in infinite loops (unless search depth is capped).
-
- # Variations & Common Interview Patterns
	- > [!important] Why Variations Matter
	  > Simple traversal is rarely asked directly. Interviewers test your ability to modify DFS states to solve specific topological and connectivity problems.
	-
	- ## Cycle Detection (Directed Graphs)
	  collapsed:: true
		- We track nodes in the current recursion stack using three states (represented as Colors: White = Unvisited, Gray = Visiting, Black = Visited).
		- If we encounter a node that is currently in the **Visiting** (Gray) state, we have detected a **Back Edge** (Cycle).
		- :::code-tabs
		  
		  ```python
		  def has_cycle_directed(graph, num_vertices):
		      # States: 0 = Unvisited, 1 = Visiting (in recursion stack), 2 = Visited (fully done)
		      state = {i: 0 for i in range(num_vertices)}
		  
		      def dfs(node):
		          state[node] = 1 # Mark as Visiting
		          for neighbor in graph.get(node, []):
		              if state[neighbor] == 1:
		                  return True # Cycle detected!
		              elif state[neighbor] == 0:
		                  if dfs(neighbor):
		                      return True
		          state[node] = 2 # Mark as Visited
		          return False
		  
		      for v in range(num_vertices):
		          if state[v] == 0:
		              if dfs(v):
		                  return True
		      return False
		  
		  # Example: 0 -> 1 -> 2 -> 0 (Cycle)
		  graph = {0: [1], 1: [2], 2: [0]}
		  print("Has Directed Cycle:", has_cycle_directed(graph, 3)) # Output: True
		  ```
		  
		  ```c++
		  #include <iostream>
		  #include <vector>
		  #include <unordered_map>
		  
		  bool dfsCycleDirected(int node, std::unordered_map<int, std::vector<int>>& graph, std::vector<int>& state) {
		      state[node] = 1; // Mark as Visiting
		  
		      for (int neighbor : graph[node]) {
		          if (state[neighbor] == 1) {
		              return true; // Cycle detected
		          } else if (state[neighbor] == 0) {
		              if (dfsCycleDirected(neighbor, graph, state)) {
		                  return true;
		              }
		          }
		      }
		      state[node] = 2; // Mark as Visited
		      return false;
		  }
		  
		  bool hasCycleDirected(std::unordered_map<int, std::vector<int>>& graph, int numVertices) {
		      // 0 = Unvisited, 1 = Visiting, 2 = Visited
		      std::vector<int> state(numVertices, 0);
		      for (int i = 0; i < numVertices; ++i) {
		          if (state[i] == 0) {
		              if (dfsCycleDirected(i, graph, state)) return true;
		          }
		      }
		      return false;
		  }
		  
		  int main() {
		      std::unordered_map<int, std::vector<int>> graph = {{0, {1}}, {1, {2}}, {2, {0}}};
		      std::cout << "Has Directed Cycle: " << (hasCycleDirected(graph, 3) ? "True" : "False") << "\n";
		      return 0;
		  }
		  ```
		  
		  :::
	-
	- ## Cycle Detection (Undirected Graphs)
	  collapsed:: true
		- For undirected graphs, a cycle exists if we visit an already visited node that is **not** the direct parent of the current node.
		- :::code-tabs
		  
		  ```python
		  def has_cycle_undirected(graph, num_vertices):
		      visited = set()
		  
		      def dfs(node, parent):
		          visited.add(node)
		          for neighbor in graph.get(node, []):
		              if neighbor not in visited:
		                  if dfs(neighbor, node):
		                      return True
		              elif neighbor != parent:
		                  return True # Cycle detected (visited node is not the parent)
		          return False
		  
		      for v in range(num_vertices):
		          if v not in visited:
		              if dfs(v, -1):
		                  return True
		      return False
		  
		  # Example: 0 - 1 - 2 - 0 (Cycle)
		  graph = {0: [1, 2], 1: [0, 2], 2: [0, 1]}
		  print("Has Undirected Cycle:", has_cycle_undirected(graph, 3)) # Output: True
		  ```
		  
		  ```c++
		  #include <iostream>
		  #include <vector>
		  #include <unordered_set>
		  #include <unordered_map>
		  
		  bool dfsCycleUndirected(int node, int parent, std::unordered_map<int, std::vector<int>>& graph, 
		                         std::unordered_set<int>& visited) {
		      visited.insert(node);
		  
		      for (int neighbor : graph[node]) {
		          if (visited.find(neighbor) == visited.end()) {
		              if (dfsCycleUndirected(neighbor, node, graph, visited)) return true;
		          } else if (neighbor != parent) {
		              return true; // Cycle detected
		          }
		      }
		      return false;
		  }
		  
		  bool hasCycleUndirected(std::unordered_map<int, std::vector<int>>& graph, int numVertices) {
		      std::unordered_set<int> visited;
		      for (int i = 0; i < numVertices; ++i) {
		          if (visited.find(i) == visited.end()) {
		              if (dfsCycleUndirected(i, -1, graph, visited)) return true;
		          }
		      }
		      return false;
		  }
		  
		  int main() {
		      std::unordered_map<int, std::vector<int>> graph = {{0, {1, 2}}, {1, {0, 2}}, {2, {0, 1}}};
		      std::cout << "Has Undirected Cycle: " << (hasCycleUndirected(graph, 3) ? "True" : "False") << "\n";
		      return 0;
		  }
		  ```
		  
		  :::
	-
	- ## Topological Sort (DFS-based)
	  collapsed:: true
		- Topological sorting for a Directed Acyclic Graph (DAG) is a linear ordering of vertices such that for every directed edge $u \to v$, vertex $u$ comes before $v$.
		- By executing a post-order traversal and pushing nodes to a stack *after* exploring all children, then reversing/popping the stack, we construct the topological order.
		- :::code-tabs
		  
		  ```python
		  def topological_sort(graph, num_vertices):
		      visited = set()
		      stack = []
		  
		      def dfs(node):
		          visited.add(node)
		          for neighbor in graph.get(node, []):
		              if neighbor not in visited:
		                  dfs(neighbor)
		          stack.append(node) # Post-order addition
		  
		      for v in range(num_vertices):
		          if v not in visited:
		              dfs(v)
		      
		      return stack[::-1] # Reverse list to get topological order
		  
		  # Example: 5 -> 2, 5 -> 0, 4 -> 0, 4 -> 1, 2 -> 3, 3 -> 1
		  graph = {5: [2, 0], 4: [0, 1], 2: [3], 3: [1], 0: [], 1: []}
		  print("Topological Sort Order:", topological_sort(graph, 6))
		  # Output: [5, 4, 2, 3, 1, 0] (one of valid topological orders)
		  ```
		  
		  ```c++
		  #include <iostream>
		  #include <vector>
		  #include <unordered_set>
		  #include <unordered_map>
		  #include <algorithm>
		  
		  void dfsTopological(int node, std::unordered_map<int, std::vector<int>>& graph, 
		                      std::unordered_set<int>& visited, std::vector<int>& stack) {
		      visited.insert(node);
		  
		      for (int neighbor : graph[node]) {
		          if (visited.find(neighbor) == visited.end()) {
		              dfsTopological(neighbor, graph, visited, stack);
		          }
		      }
		      stack.push_back(node); // Post-order stack push
		  }
		  
		  std::vector<int> topologicalSort(std::unordered_map<int, std::vector<int>>& graph, int numVertices) {
		      std::unordered_set<int> visited;
		      std::vector<int> stack;
		  
		      for (int i = 0; i < numVertices; ++i) {
		          if (visited.find(i) == visited.end()) {
		              dfsTopological(i, graph, visited, stack);
		          }
		      }
		      std::reverse(stack.begin(), stack.end());
		      return stack;
		  }
		  
		  int main() {
		      std::unordered_map<int, std::vector<int>> graph = {
		          {5, {2, 0}}, {4, {0, 1}}, {2, {3}}, {3, {1}}, {0, {}}, {1, {}}
		      };
		      std::vector<int> order = topologicalSort(graph, 6);
		      std::cout << "Topological Order: ";
		      for (int x : order) std::cout << x << " ";
		      std::cout << "\n";
		      return 0;
		  }
		  ```
		  
		  :::
-
- # Key Takeaways
  collapsed:: true
	- **Core idea** — explore as deep as possible along each branch before backtracking.
	- **Stack-based** — implemented either recursively (relying on the system call stack) or iteratively (using an explicit stack).
	- **Complexity** — $O(V + E)$ time and $O(V)$ space for Adjacency List layout.
	- **Cycle Detection** — look for **Back Edges** using recursion stack coloring (directed) or parent-tracking (undirected).
	- **Topological Sorting** — easily derived via post-order reversal during DFS on a DAG.
	- **Stack Overflow Risk** — recursion can fail on deep paths; use explicit iterative loops for production scale.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [TheAlgorithms – DFS (Python)](https://github.com/TheAlgorithms/Python/blob/master/graphs/depth_first_search.py)
		- [Visualgo — Graph Traversal Visualizations](https://visualgo.net/en/dfsbfs)