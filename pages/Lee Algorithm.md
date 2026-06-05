---
seoTitle: Lee Algorithm – Shortest Path in a Maze using BFS
description: "Master the Lee Algorithm for routing and maze solving. Covers BFS expansion, wave propagation, backtracking, and optimal shortest path extraction in a 2D grid."
keywords: "Lee algorithm, BFS, shortest path, maze solving, grid traversal, wave propagation, O(RxC), algorithm, VR-Rathod, Code-Note, Lee Algorithm"
displayTitle: Lee Algorithm
treeTitle: DSA - Graph Algorithms - Lee Algorithm
---

> [!info] What is the Lee Algorithm?
> The **Lee Algorithm** is a Breadth-First Search (BFS) based algorithm that always finds the **optimal (shortest) path** between a source and a destination in a maze or grid. 
> Originally designed in 1961 for wire routing on printed circuit boards, it operates by propagating a "wave" outward from the starting point, bypassing obstacles until it hits the target.

- # Explanation
  collapsed:: true
	- **The Core Problem:** Given a 2D grid filled with empty spaces and obstacles (walls), how do we find the absolute shortest path from point $S$ to point $E$? DFS might find a path, but it will likely weave around inefficiently.
	- **The Solution:** BFS guarantees that the first time we discover the destination node, it was reached via the shortest possible sequence of steps. The Lee Algorithm systematically labels expanding rings of neighbors with their distance from the source.
	-
	- ## The 3 Phases of the Lee Algorithm
	  collapsed:: true
		- 1. **Initialization:** Mark the start node with distance 0. Insert it into a Queue.
		- 2. **Wave Propagation:** While the queue is not empty, dequeue a cell. Check all its valid 4-way neighbors. If they are unvisited and not obstacles, mark them with `distance = current_distance + 1` and enqueue them. Stop when the destination is reached.
		- 3. **Backtracking (Path Extraction):** Starting from the destination, look at its neighbors to find one that has a distance exactly 1 less than the destination. Move to it. Repeat until you arrive back at 0. This gives you the exact shortest path coordinates!
-
- # How It Works
  collapsed:: true
	- ## Step-by-Step Execution
	  collapsed:: true
		- 1. Create a `visited` matrix (or modify the grid in-place if allowed). Create a Queue.
		- 2. Enqueue the starting coordinate `(sx, sy, dist=0)`. Mark it as visited.
		- 3. Dequeue an element. If it matches `(dx, dy)`, return its `dist`.
		- 4. Iterate over the 4 directions (Up, Down, Left, Right):
			- Calculate `(nx, ny)`.
			- If `(nx, ny)` is inside the grid, is not a wall, and has not been visited:
				- Mark visited.
				- Enqueue `(nx, ny, dist + 1)`.
		- 5. If the queue empties and destination wasn't reached, no path exists.
	-
	- ```mermaid
	  flowchart TD
	      A["Start: Queue = [Source]"] --> B{"Is Queue empty?"}
	      B -- Yes --> C["Path does not exist"]
	      B -- No --> D["Pop node (x, y, dist)"]
	      D --> E{"Is node == Destination?"}
	      E -- Yes --> F["Shortest path length is 'dist'"]
	      E -- No --> G["For each valid, unvisited neighbor:"]
	      G --> H["Mark visited\nPush (nx, ny, dist+1) to Queue"]
	      H --> B
	  ```
-
- # Complexity Analysis
  collapsed:: true
	- | Step | Time Complexity | Space Complexity |
	  |---|---|---|
	  | **Wave Propagation (BFS)** | $O(R \times C)$ | $O(R \times C)$ (for Queue and Visited array) |
	  | **Total (Average/Worst)** | **O(R × C)** | **O(R × C)** |
	- *Where $R$ is rows and $C$ is columns of the grid.*
-
- # Implementation
  collapsed:: true
	- > [!note] Lee Algorithm Implementation
	  > The following implementations return the integer length of the shortest path. If no path is possible, they return `-1`.
	-
	- :::code-tabs
	  
	  ```python
	  from collections import deque
	  
	  def lee_algorithm(grid, src, dest):
	      rows = len(grid)
	      cols = len(grid[0])
	      
	      if grid[src[0]][src[1]] == 0 or grid[dest[0]][dest[1]] == 0:
	          return -1 # 0 means obstacle
	          
	      visited = [[False for _ in range(cols)] for _ in range(rows)]
	      visited[src[0]][src[1]] = True
	      
	      # Queue stores (r, c, dist)
	      q = deque([(src[0], src[1], 0)])
	      
	      row_moves = [-1, 1, 0, 0]
	      col_moves = [0, 0, -1, 1]
	      
	      while q:
	          r, c, dist = q.popleft()
	          
	          if (r, c) == dest:
	              return dist
	              
	          for i in range(4):
	              new_r = r + row_moves[i]
	              new_c = c + col_moves[i]
	              
	              if (0 <= new_r < rows and 0 <= new_c < cols and 
	                  grid[new_r][new_c] == 1 and not visited[new_r][new_c]):
	                  
	                  visited[new_r][new_c] = True
	                  q.append((new_r, new_c, dist + 1))
	                  
	      return -1
	  
	  if __name__ == "__main__":
	      # 1 = Open, 0 = Wall
	      maze = [
	          [1, 0, 1, 1, 1],
	          [1, 0, 1, 0, 1],
	          [1, 1, 1, 0, 1],
	          [0, 0, 0, 0, 1],
	          [1, 1, 1, 1, 1]
	      ]
	      src = (0, 0)
	      dest = (4, 0)
	      
	      ans = lee_algorithm(maze, src, dest)
	      print(f"Shortest path length: {ans}")
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <queue>
	  
	  using namespace std;
	  
	  struct Node {
	      int r, c, dist;
	  };
	  
	  int leeAlgorithm(vector<vector<int>>& grid, pair<int, int> src, pair<int, int> dest) {
	      int rows = grid.size();
	      int cols = grid[0].size();
	      
	      if (grid[src.first][src.second] == 0 || grid[dest.first][dest.second] == 0) return -1;
	      
	      vector<vector<bool>> visited(rows, vector<bool>(cols, false));
	      visited[src.first][src.second] = true;
	      
	      queue<Node> q;
	      q.push({src.first, src.second, 0});
	      
	      int rowMoves[] = {-1, 1, 0, 0};
	      int colMoves[] = {0, 0, -1, 1};
	      
	      while (!q.empty()) {
	          Node curr = q.front();
	          q.pop();
	          
	          if (curr.r == dest.first && curr.c == dest.second) {
	              return curr.dist;
	          }
	          
	          for (int i = 0; i < 4; i++) {
	              int newR = curr.r + rowMoves[i];
	              int newC = curr.c + colMoves[i];
	              
	              if (newR >= 0 && newR < rows && newC >= 0 && newC < cols && 
	                  grid[newR][newC] == 1 && !visited[newR][newC]) {
	                  
	                  visited[newR][newC] = true;
	                  q.push({newR, newC, curr.dist + 1});
	              }
	          }
	      }
	      return -1;
	  }
	  
	  int main() {
	      vector<vector<int>> maze = {
	          {1, 0, 1, 1, 1},
	          {1, 0, 1, 0, 1},
	          {1, 1, 1, 0, 1},
	          {0, 0, 0, 0, 1},
	          {1, 1, 1, 1, 1}
	      };
	      cout << "Shortest path length: " << leeAlgorithm(maze, {0, 0}, {4, 0}) << endl;
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function leeAlgorithm(grid, src, dest) {
	      const rows = grid.length;
	      const cols = grid[0].length;
	      
	      if (grid[src[0]][src[1]] === 0 || grid[dest[0]][dest[1]] === 0) return -1;
	      
	      const visited = Array.from({length: rows}, () => new Array(cols).fill(false));
	      visited[src[0]][src[1]] = true;
	      
	      const q = [[src[0], src[1], 0]];
	      const rowMoves = [-1, 1, 0, 0];
	      const colMoves = [0, 0, -1, 1];
	      
	      while (q.length > 0) {
	          const [r, c, dist] = q.shift();
	          
	          if (r === dest[0] && c === dest[1]) return dist;
	          
	          for (let i = 0; i < 4; i++) {
	              let newR = r + rowMoves[i];
	              let newC = c + colMoves[i];
	              
	              if (newR >= 0 && newR < rows && newC >= 0 && newC < cols && 
	                  grid[newR][newC] === 1 && !visited[newR][newC]) {
	                  visited[newR][newC] = true;
	                  q.push([newR, newC, dist + 1]);
	              }
	          }
	      }
	      return -1;
	  }
	  
	  const maze = [
	      [1, 0, 1, 1, 1],
	      [1, 0, 1, 0, 1],
	      [1, 1, 1, 0, 1],
	      [0, 0, 0, 0, 1],
	      [1, 1, 1, 1, 1]
	  ];
	  console.log("Shortest path length:", leeAlgorithm(maze, [0,0], [4,0]));
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class LeeAlgorithm {
	      static class Node {
	          int r, c, dist;
	          Node(int r, int c, int dist) {
	              this.r = r; this.c = c; this.dist = dist;
	          }
	      }
	      
	      public static int leeAlgorithm(int[][] grid, int[] src, int[] dest) {
	          int rows = grid.length;
	          int cols = grid[0].length;
	          
	          if (grid[src[0]][src[1]] == 0 || grid[dest[0]][dest[1]] == 0) return -1;
	          
	          boolean[][] visited = new boolean[rows][cols];
	          visited[src[0]][src[1]] = true;
	          
	          Queue<Node> q = new LinkedList<>();
	          q.add(new Node(src[0], src[1], 0));
	          
	          int[] rowMoves = {-1, 1, 0, 0};
	          int[] colMoves = {0, 0, -1, 1};
	          
	          while (!q.isEmpty()) {
	              Node curr = q.poll();
	              
	              if (curr.r == dest[0] && curr.c == dest[1]) {
	                  return curr.dist;
	              }
	              
	              for (int i = 0; i < 4; i++) {
	                  int newR = curr.r + rowMoves[i];
	                  int newC = curr.c + colMoves[i];
	                  
	                  if (newR >= 0 && newR < rows && newC >= 0 && newC < cols && 
	                      grid[newR][newC] == 1 && !visited[newR][newC]) {
	                      
	                      visited[newR][newC] = true;
	                      q.add(new Node(newR, newC, curr.dist + 1));
	                  }
	              }
	          }
	          return -1;
	      }
	      
	      public static void main(String[] args) {
	          int[][] maze = {
	              {1, 0, 1, 1, 1},
	              {1, 0, 1, 0, 1},
	              {1, 1, 1, 0, 1},
	              {0, 0, 0, 0, 1},
	              {1, 1, 1, 1, 1}
	          };
	          int[] src = {0, 0};
	          int[] dest = {4, 0};
	          System.out.println("Shortest path length: " + leeAlgorithm(maze, src, dest));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdbool.h>
	  
	  #define MAX 100
	  
	  typedef struct {
	      int r, c, dist;
	  } Node;
	  
	  int leeAlgorithm(int rows, int cols, int grid[rows][cols], int sr, int sc, int dr, int dc) {
	      if (grid[sr][sc] == 0 || grid[dr][dc] == 0) return -1;
	      
	      bool visited[MAX][MAX] = {false};
	      visited[sr][sc] = true;
	      
	      Node q[MAX * MAX];
	      int head = 0, tail = 0;
	      
	      q[tail++] = (Node){sr, sc, 0};
	      
	      int rowMoves[] = {-1, 1, 0, 0};
	      int colMoves[] = {0, 0, -1, 1};
	      
	      while (head < tail) {
	          Node curr = q[head++];
	          
	          if (curr.r == dr && curr.c == dc) {
	              return curr.dist;
	          }
	          
	          for (int i = 0; i < 4; i++) {
	              int newR = curr.r + rowMoves[i];
	              int newC = curr.c + colMoves[i];
	              
	              if (newR >= 0 && newR < rows && newC >= 0 && newC < cols && 
	                  grid[newR][newC] == 1 && !visited[newR][newC]) {
	                  
	                  visited[newR][newC] = true;
	                  q[tail++] = (Node){newR, newC, curr.dist + 1};
	              }
	          }
	      }
	      return -1;
	  }
	  
	  int main() {
	      int R = 5, C = 5;
	      int maze[5][5] = {
	          {1, 0, 1, 1, 1},
	          {1, 0, 1, 0, 1},
	          {1, 1, 1, 0, 1},
	          {0, 0, 0, 0, 1},
	          {1, 1, 1, 1, 1}
	      };
	      
	      printf("Shortest path length: %d\n", leeAlgorithm(R, C, maze, 0, 0, 4, 0));
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Lee Algorithm
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Finding shortest path in a grid?"}
	      Q -- Yes --> S1{"Are edge weights uniform\n(all steps cost 1)?"}
	      S1 -- Yes --> R1["✅ Use Lee Algorithm (BFS)\n(Simplest and guarantees optimality)"]
	      S1 -- No --> R2["❌ Use Dijkstra's Algorithm or A*"]
	  ```
	-
	- ## ✅ Use Lee Algorithm When
		- Routing physical wires on a circuit board where Manhattan distance determines length.
		- Solving grid-based puzzles (e.g., escaping a maze, Pac-Man ghost logic).
		- All movements (Up/Down/Left/Right) cost exactly 1 unit of distance.
	-
	- ## ❌ Avoid Lee Algorithm When
		- The graph is weighted (e.g., moving through swamp costs 5, road costs 1). BFS cannot handle variable weights; use Dijkstra's algorithm.
		- The search space is infinitely large or mostly empty without obstacles. Uninformed BFS will waste massive amounts of time expanding the wave in wrong directions. Use $A^*$ search with a heuristic instead.
-
- # Key Takeaways
  collapsed:: true
	- **Wave Expansion** — the algorithm grows evenly in all directions exactly like a ripple from a water droplet.
	- **Shortest Path Guarantee** — because BFS expands layer by layer, the first path to touch the destination is mathematically guaranteed to be the shortest path.
	- **Unweighted Grids Only** — designed explicitly for uniformly weighted matrix geometries.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Shortest path in a Binary Maze](https://www.geeksforgeeks.org/shortest-path-in-a-binary-maze/)
		- [Wikipedia – Lee Algorithm](https://en.wikipedia.org/wiki/Lee_algorithm)