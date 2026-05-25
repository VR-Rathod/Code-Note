---
date: 2025-03-26T12:40:55+05:30
lastmod: 2026-05-25T12:05:10+05:30

seoTitle: Breadth First Search (BFS) – Graph Traversal Algorithm Guide
description: "Comprehensive guide to Breadth First Search (BFS). Covers queue-based level order traversal, unweighted shortest paths, bipartite verification, grid routing, and complexities in Python, C++, JavaScript, Java, and C."
keywords: "breadth first search, BFS, graph traversal, queue, shortest path, bipartite graph, grid pathfinding, time complexity, space complexity, VR-Rathod, Code-Note, Vaibhav Rathod"
---

> [!info] What is Breadth First Search (BFS)?
> Breadth First Search (BFS) is a fundamental graph traversal algorithm that explores all vertices at the current depth (level) before moving to vertices at the next depth level.
> It uses a **Queue** (First-In, First-Out) to track the frontiers of exploration, achieving **O(V + E)** time complexity and guaranteeing the **shortest path in unweighted graphs**.

- # Explanation
  collapsed:: true
	- **Breadth First Search** starts at a root node (or an arbitrary node in a graph) and visits all its immediate neighbors first. Then, it visits the neighbors of those neighbors, moving outward in concentric circles (levels) like ripples in water.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Throwing a stone into a quiet **pond** — the ripples spread outward in growing, circular waves. Every node at distance 1 is touched by the first wave, then distance 2 by the second, and so on.
		- Another analogy is **social media connections** — checking your 1st-degree connections first, then your 2nd-degree connections, then 3rd-degree.
	-
	- ## Why BFS over DFS?
	  collapsed:: true
		- [[Depth First Search]] dives deep immediately. If you need to find the **shortest path** on a graph where all edges have the same cost (unweighted), DFS might find a very long, convoluted path first.
		- BFS explores level by level, ensuring that the first time you reach a destination node, you have taken the **absolute minimum number of steps (edges)**.
-
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- Use a **queue** to keep track of nodes to visit. Enqueue the starting node and mark it as visited.
		- While the queue is not empty: pop the front node, examine it, and enqueue all of its unvisited neighbors, marking them as visited immediately to avoid duplicate queuing.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — select source node"] --> B["Enqueue node & mark Visited"]
		      B --> C{"Queue empty?"}
		      C -- Yes --> H["End — Traversal Complete"]
		      C -- No --> D["Dequeue node U from front"]
		      D --> E["For each neighbor V of U"]
		      E --> F{"V visited?"}
		      F -- No --> G["Enqueue V & mark Visited"]
		      F -- Yes --> E
		      G --> E
		      E -- "No more neighbors" --> C
		  ```
	-
	- ## Step-by-Step Algorithm
	  collapsed:: true
		- ```
		  INPUT:  Graph G, Source node S
		  OUTPUT: All nodes visited in BFS order
		  
		  1. Create a queue Q, and a set VISITED
		  2. Enqueue S onto Q, and add S to VISITED
		  3. WHILE Q is not empty:
		     a. Dequeue U from the front of Q
		     b. Visit U (process the node)
		     c. For each neighbor V of U:
		        IF V is not in VISITED:
		           i. Enqueue V onto Q
		           ii. Add V to VISITED
		  ```
		- > [!important] Mark Visited Upon Enqueue
		  > To prevent the same node from being added to the queue multiple times (which results in redundant work and exponential space growth), always mark a node as visited **when you put it in the queue**, not when you take it out.
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
		  │ Step │ Queue       │ Visited Set      │ Action         │
		  ├────────────────────────────────────────────────────────┤
		  │  1   │ [A]         │ {A}              │ Dequeue A      │
		  │  2   │ [B, C]      │ {A, B, C}        │ Dequeue B      │
		  │  3   │ [C, D, E]   │ {A, B, C, D, E}  │ Dequeue C      │
		  │  4   │ [D, E, F]   │ {A, B, C, D,E,F} │ Dequeue D      │
		  │  5   │ [E, F]      │ {A, B, C, D,E,F} │ Dequeue E      │
		  │  6   │ [F]         │ {A, B, C, D,E,F} │ Dequeue F      │
		  │  7   │ []          │ {A, B, C, D,E,F} │ Queue empty    │
		  └────────────────────────────────────────────────────────┘
		  
		  BFS Order: A -> B -> C -> D -> E -> F
		  ```
-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > For a graph represented as an **Adjacency List** with **V vertices** and **E edges**:
	  > - **Time Complexity: O(V + E)** — every vertex is enqueued and dequeued exactly once, and every edge is checked.
	  > - **Space Complexity: O(V)** — since in the worst case, the queue can hold up to $O(V)$ nodes (e.g., in a star graph or a fully connected level).
	-
	- ## Complexity Table
	  collapsed:: true
		- | Graph Representation | Time Complexity | Space Complexity | Why |
		  |------|------|-----|-----|
		  | **Adjacency List** | **O(V + E)** | **O(V)** | Every vertex and edge is processed. Queue size peaks at the maximum breadth of the graph. |
		  | **Adjacency Matrix** | **O(V²)** | **O(V)** | Must search an entire row of size V to find neighbors for each node. |
		  | **Edge List** | **O(V · E)** | **O(V)** | Must scan all edges for each node lookup. |
	-
	- ## Scaling Comparison vs. [[Depth First Search]]
	  collapsed:: true
		- ```mermaid
		  xychart-beta
		      title "Queue Frontier vs. Call Stack Space (Memory Bounds)"
		      x-axis ["Tree Depth 2", "Tree Depth 5", "Tree Depth 10", "Tree Depth 15"]
		      y-axis "Node Capacity" 0 --> 35000
		      bar [4, 32, 1024, 32768]
		      line [2, 5, 10, 15]
		  ```
		- | Binary Tree Height (h) | Max Stack Space (DFS) | Max Queue Space (BFS) | Total Nodes in Tree |
		  |------------------------|-----------------------|-----------------------|---------------------|
		  | 2                      | 2                     | 4                     | 7                   |
		  | 5                      | 5                     | 32                    | 63                  |
		  | 10                     | 10                    | 1,024                 | 2,047               |
		  | 15                     | 15                    | 32,768                | 65,535              |
		- > [!tip] Memory Scaling Key Insight
		  > For balanced trees, DFS memory requirements grow **linearly** with tree height ($O(h)$), whereas BFS memory grows **exponentially** ($O(2^h)$). In wide, highly branching graphs, BFS can quickly consume available memory.
-
- # Implementation
  collapsed:: true
	- > [!note] BFS is implemented iteratively using a queue data structure.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  from collections import deque
	  
	  def bfs(graph, start):
	      """
	      Iterative BFS using collections.deque
	      Time: O(V + E) | Space: O(V)
	      Returns the BFS traversal order.
	      """
	      visited = {start}
	      queue = deque([start])
	      result = []
	  
	      while queue:
	          node = queue.popleft()
	          result.append(node)
	  
	          for neighbor in graph.get(node, []):
	              if neighbor not in visited:
	                  visited.add(neighbor)
	                  queue.append(neighbor)
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
	  print("BFS Traversal Path:", bfs(graph, 'A'))
	  # Output: ['A', 'B', 'C', 'D', 'E', 'F']
	  ```
	  
	  ```cpp
	  #include <iostream>
	  #include <vector>
	  #include <queue>
	  #include <unordered_set>
	  #include <unordered_map>
	  
	  // BFS implementation
	  // Time: O(V + E) | Space: O(V)
	  std::vector<char> bfs(std::unordered_map<char, std::vector<char>>& graph, char start) {
	      std::vector<char> result;
	      std::unordered_set<char> visited;
	      std::queue<char> q;
	  
	      q.push(start);
	      visited.insert(start);
	  
	      while (!q.empty()) {
	          char node = q.front();
	          q.pop();
	          result.push_back(node);
	  
	          for (char neighbor : graph[node]) {
	              if (visited.find(neighbor) == visited.end()) {
	                  visited.insert(neighbor);
	                  q.push(neighbor);
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
	      std::vector<char> path = bfs(graph, 'A');
	      for (char node : path) {
	          std::cout << node << " ";
	      }
	      std::cout << "\n";
	      // Output: A B C D E F
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  // Iterative BFS
	  // Time: O(V + E) | Space: O(V)
	  function bfs(graph, start) {
	      const visited = new Set([start]);
	      const queue = [start];
	      const result = [];
	  
	      while (queue.length > 0) {
	          // Shift takes O(N) in vanilla JS arrays. 
	          // For production scales, use a custom doubly linked list queue.
	          const node = queue.shift(); 
	          result.push(node);
	  
	          const neighbors = graph[node] || [];
	          for (const neighbor of neighbors) {
	              if (!visited.has(neighbor)) {
	                  visited.add(neighbor);
	                  queue.push(neighbor);
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
	  console.log("BFS Traversal Path:", bfs(graph, 'A'));
	  // Output: ['A', 'B', 'C', 'D', 'E', 'F']
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class BFS {
	      // Iterative BFS
	      // Time: O(V + E) | Space: O(V)
	      public static List<Character> bfs(Map<Character, List<Character>> graph, char start) {
	          List<Character> result = new ArrayList<>();
	          Set<Character> visited = new HashSet<>();
	          Queue<Character> queue = new LinkedList<>();
	  
	          queue.add(start);
	          visited.add(start);
	  
	          while (!queue.isEmpty()) {
	              char node = queue.poll();
	              result.add(node);
	  
	              for (char neighbor : graph.getOrDefault(node, new ArrayList<>())) {
	                  if (!visited.contains(neighbor)) {
	                      visited.add(neighbor);
	                      queue.add(neighbor);
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
	  
	          System.out.println("BFS Traversal Path: " + bfs(graph, 'A'));
	          // Output: [A, B, C, D, E, F]
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
	  
	  // BFS traversal on adjacency matrix
	  // Time: O(V²) | Space: O(V)
	  void bfs(struct Graph* graph, int start) {
	      bool visited[MAX_VERTICES] = {false};
	      int queue[MAX_VERTICES];
	      int front = 0, rear = 0;
	  
	      queue[rear++] = start;
	      visited[start] = true;
	  
	      printf("BFS: ");
	      while (front < rear) {
	          int curr = queue[front++];
	          printf("%c ", curr + 'A');
	  
	          for (int i = 0; i < graph->numVertices; i++) {
	              if (graph->adjMatrix[curr][i] == 1 && !visited[i]) {
	                  visited[i] = true;
	                  queue[rear++] = i;
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
	  
	      graph.adjMatrix[0][1] = 1; // A-B
	      graph.adjMatrix[0][2] = 1; // A-C
	      graph.adjMatrix[1][3] = 1; // B-D
	      graph.adjMatrix[1][4] = 1; // B-E
	      graph.adjMatrix[2][5] = 1; // C-F
	  
	      bfs(&graph, 0); // Output: A B C D E F
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use BFS
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"What is the task?"}
	      Q -- "Find shortest path (unweighted)" --> R1["✅ Use BFS\nFirst time target is popped, it's the shortest path"]
	      Q -- "Topological Sort / Cycle detection" --> R2["❌ Use DFS\nDFS is more natural and cleaner for sorting"]
	      Q -- "Web Crawler / Peer-to-Peer" --> R3["✅ Use BFS\nExplore local links before distant ones"]
	      Q -- "Tree is extremely wide" --> R4["❌ Use DFS\nQueue size can exceed RAM limits"]
	  ```
	-
	- ## ✅ Use BFS When
		- You want to find the **shortest path** on an unweighted graph or tree (guarantees least edges traversed).
		- You want to find the **minimum steps** to solve a puzzle (e.g., Rubik's cube, chess state transitions).
		- You are building **P2P network discovery** or **social network** searches (finding degrees of separation).
		- You are building a **web crawler** that indexes pages level-by-level.
		- You want to check if a graph is **bipartite**.
	-
	- ## ❌ Avoid BFS When
		- The graph is **extremely wide** (large branching factor), causing the queue to require vast amounts of memory to store current frontier levels.
		- You need to search for solutions **deep down** a tree and have limited memory (use [[Depth First Search]] instead).
-
- # Variations & Common Interview Patterns
	- > [!important] Why Variations Matter
	  > BFS variations form the basis of all distance-based graph traversal questions in competitive programming and interviews.
	-
	- ## Shortest Path Reconstruction (Unweighted Graph)
	  collapsed:: true
		- By tracking a `parent` mapping during traversal, we can reconstruct the exact path from source to target.
		- :::code-tabs
		  
		  ```python
		  from collections import deque
		  
		  def shortest_path_unweighted(graph, start, target):
		      visited = {start}
		      queue = deque([start])
		      parent = {start: None}
		  
		      while queue:
		          curr = queue.popleft()
		          if curr == target:
		              break
		          for neighbor in graph.get(curr, []):
		              if neighbor not in visited:
		                  visited.add(neighbor)
		                  parent[neighbor] = curr
		                  queue.append(neighbor)
		  
		      if target not in visited:
		          return [] # Path not found
		  
		      # Reconstruct path
		      path = []
		      curr = target
		      while curr is not None:
		          path.append(curr)
		          curr = parent[curr]
		      return path[::-1] # Reverse path to get start -> target
		  
		  # Example Graph
		  graph = {'A': ['B', 'C'], 'B': ['D'], 'C': ['D'], 'D': []}
		  print("Shortest Path A to D:", shortest_path_unweighted(graph, 'A', 'D'))
		  # Output: ['A', 'B', 'D'] (or ['A', 'C', 'D'])
		  ```
		  
		  ```cpp
		  #include <iostream>
		  #include <vector>
		  #include <queue>
		  #include <unordered_set>
		  #include <unordered_map>
		  #include <algorithm>
		  
		  std::vector<char> shortestPath(std::unordered_map<char, std::vector<char>>& graph, char start, char target) {
		      std::unordered_set<char> visited = {start};
		      std::queue<char> q;
		      std::unordered_map<char, char> parent;
		      parent[start] = '\0';
		      q.push(start);
		  
		      bool found = false;
		      while (!q.empty()) {
		          char curr = q.front();
		          q.pop();
		          if (curr == target) {
		              found = true;
		              break;
		          }
		          for (char neighbor : graph[curr]) {
		              if (visited.find(neighbor) == visited.end()) {
		                  visited.insert(neighbor);
		                  parent[neighbor] = curr;
		                  q.push(neighbor);
		              }
		          }
		      }
		  
		      if (!found) return {};
		  
		      std::vector<char> path;
		      char curr = target;
		      while (curr != '\0') {
		          path.push_back(curr);
		          curr = parent[curr];
		      }
		      std::reverse(path.begin(), path.end());
		      return path;
		  }
		  
		  int main() {
		      std::unordered_map<char, std::vector<char>> graph = {{'A', {'B', 'C'}}, {'B', {'D'}}, {'C', {'D'}}, {'D', {}}};
		      std::vector<char> path = shortestPath(graph, 'A', 'D');
		      std::cout << "Shortest Path A to D: ";
		      for (char node : path) std::cout << node << " ";
		      std::cout << "\n";
		      return 0;
		  }
		  ```
		  
		  :::
	-
	- ## Bipartite Graph Verification (2-Coloring)
	  collapsed:: true
		- A graph is Bipartite if it can be colored using exactly 2 colors such that no adjacent vertices share the same color. A graph is bipartite if and only if it contains no odd-length cycles.
		- :::code-tabs
		  
		  ```python
		  from collections import deque
		  
		  def is_bipartite(graph, num_vertices):
		      # Colors: -1 = Uncolored, 0 = Color A, 1 = Color B
		      color = {i: -1 for i in range(num_vertices)}
		  
		      for i in range(num_vertices):
		          if color[i] == -1: # Found a new connected component
		              queue = deque([i])
		              color[i] = 0
		              while queue:
		                  curr = queue.popleft()
		                  for neighbor in graph.get(curr, []):
		                      if color[neighbor] == -1:
		                          color[neighbor] = 1 - color[curr] # Color with opposite
		                          queue.append(neighbor)
		                      elif color[neighbor] == color[curr]:
		                          return False # Adjacent nodes have same color
		      return True
		  
		  # Example: 0 - 1 - 2 - 3 - 0 (Even cycle, Bipartite)
		  graph = {0: [1, 3], 1: [0, 2], 2: [1, 3], 3: [0, 2]}
		  print("Is Bipartite:", is_bipartite(graph, 4)) # Output: True
		  ```
		  
		  ```cpp
		  #include <iostream>
		  #include <vector>
		  #include <queue>
		  #include <unordered_map>
		  
		  bool isBipartite(std::unordered_map<int, std::vector<int>>& graph, int numVertices) {
		      std::vector<int> color(numVertices, -1);
		  
		      for (int i = 0; i < numVertices; ++i) {
		          if (color[i] == -1) {
		              std::queue<int> q;
		              q.push(i);
		              color[i] = 0;
		  
		              while (!q.empty()) {
		                  int curr = q.front();
		                  q.pop();
		  
		                  for (int neighbor : graph[curr]) {
		                      if (color[neighbor] == -1) {
		                          color[neighbor] = 1 - color[curr];
		                          q.push(neighbor);
		                      } else if (color[neighbor] == color[curr]) {
		                          return false; // Conflict found
		                      }
		                  }
		              }
		          }
		      }
		      return true;
		  }
		  
		  int main() {
		      std::unordered_map<int, std::vector<int>> graph = {{0, {1, 3}}, {1, {0, 2}}, {2, {1, 3}}, {3, {0, 2}}};
		      std::cout << "Is Bipartite: " << (isBipartite(graph, 4) ? "True" : "False") << "\n";
		      return 0;
		  }
		  ```
		  
		  :::
	-
	- ## 2D Grid Pathfinding (Matrix BFS)
	  collapsed:: true
		- Navigating coordinates in a grid (e.g. up, down, left, right). We must validate boundary constraints and handle obstacles.
		- :::code-tabs
		  
		  ```python
		  from collections import deque
		  
		  def min_path_grid(grid, start, end):
		      # Grid containing: 0 = Path, 1 = Obstacle
		      rows, cols = len(grid), len(grid[0])
		      queue = deque([(start[0], start[1], 0)]) # (r, c, steps)
		      visited = {start}
		      directions = [(-1, 0), (1, 0), (0, -1), (0, 1)] # Up, Down, Left, Right
		  
		      while queue:
		          r, c, steps = queue.popleft()
		          if (r, c) == end:
		              return steps
		  
		          for dr, dc in directions:
		              nr, nc = r + dr, c + dc
		              if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0:
		                  if (nr, nc) not in visited:
		                      visited.add((nr, nc))
		                      queue.append((nr, nc, steps + 1))
		      return -1 # Path not found
		  
		  grid = [
		      [0, 0, 1],
		      [1, 0, 0],
		      [0, 0, 0]
		  ]
		  print("Steps on Grid:", min_path_grid(grid, (0, 0), (2, 2))) # Output: 4
		  ```
		  
		  ```cpp
		  #include <iostream>
		  #include <vector>
		  #include <queue>
		  #include <set>
		  
		  struct Cell {
		      int r, c, steps;
		  };
		  
		  int minPathGrid(const std::vector<std::vector<int>>& grid, std::pair<int, int> start, std::pair<int, int> end) {
		      int rows = grid.size();
		      int cols = grid[0].size();
		      std::queue<Cell> q;
		      std::set<std::pair<int, int>> visited;
		  
		      q.push({start.first, start.second, 0});
		      visited.insert(start);
		  
		      std::vector<std::pair<int, int>> directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
		  
		      while (!q.empty()) {
		          Cell curr = q.front();
		          q.pop();
		  
		          if (curr.r == end.first && curr.c == end.second) {
		              return curr.steps;
		          }
		  
		          for (auto& dir : directions) {
		              int nr = curr.r + dir.first;
		              int nc = curr.c + dir.second;
		  
		              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 0) {
		                  if (visited.find({nr, nc}) == visited.end()) {
		                      visited.insert({nr, nc});
		                      q.push({nr, nc, curr.steps + 1});
		                  }
		              }
		          }
		      }
		      return -1;
		  }
		  
		  int main() {
		      std::vector<std::vector<int>> grid = {{0, 0, 1}, {1, 0, 0}, {0, 0, 0}};
		      std::cout << "Steps on Grid: " << minPathGrid(grid, {0, 0}, {2, 2}) << "\n";
		      return 0;
		  }
		  ```
		  
		  :::
-
- # Key Takeaways
	- **Core idea** — explore level-by-level, expanding outwards like ripples in water.
	- **Queue-based** — uses a FIFO queue to manage the nodes that need processing.
	- **Complexity** — $O(V + E)$ time and $O(V)$ space.
	- **Shortest Path** — guarantees finding the shortest path first in an unweighted graph.
	- **Memory footprint** — can become very large for high branching factor trees (exponential space growth).
-
- # More Learn
	- ## GitHub & Webs
		- [TheAlgorithms – BFS (Python)](https://github.com/TheAlgorithms/Python/blob/master/graphs/breadth_first_search.py)
		- [Visualgo — BFS/DFS Visualizations](https://visualgo.net/en/dfsbfs)