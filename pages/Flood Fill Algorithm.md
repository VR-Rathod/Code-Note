---
seoTitle: Flood Fill Algorithm – Matrix Traversal and Region Filling
description: "Master the Flood Fill Algorithm for matrix traversal. Covers DFS and BFS implementations for painting, image rendering, and connected components."
keywords: "Flood Fill, matrix traversal, BFS, DFS, image rendering, connected components, recursive fill, algorithm, VR-Rathod, Code-Note, Flood Fill Algorithm"
displayTitle: Flood Fill Algorithm
treeTitle: DSA - Graph Algorithms - Flood Fill Algorithm
---

> [!info] What is the Flood Fill Algorithm?
> **Flood Fill** is an algorithm that determines the area connected to a given node in a multi-dimensional array (matrix). 
> It is most famously used in the "bucket fill" tool of paint programs to fill connected, similarly-colored areas with a different color. It operates by exploring adjacent spaces (using BFS or DFS) until the boundary of the region is reached.

- # Explanation
  collapsed:: true
	- **The Core Problem:** Given a 2D grid where each cell represents a color/state, starting at a specific $(X, Y)$ coordinate, we want to replace its color and all adjacent cells of the *same* color with a new replacement color.
	- **The Solution:** We can use basic graph traversal algorithms. A 2D grid is just a graph where every pixel is a node, and it has edges connecting to its 4-way (Up, Down, Left, Right) or 8-way neighbors.
	-
	- ## DFS vs BFS for Flood Fill
	  collapsed:: true
		- **DFS (Depth-First Search):** Explores a path as deeply as possible before backtracking. Easy to write using recursion, but can cause `StackOverflow` on very large grids (like 1000x1000 images).
		- **BFS (Breadth-First Search):** Explores outward in a growing ring (like a ripple in water). Requires an explicit Queue, but prevents stack overflows and is generally safer for large matrices.
-
- # How It Works
  collapsed:: true
	- ## Step-by-Step Execution (Recursive DFS)
	  collapsed:: true
		- 1. **Check Base Cases:**
			- If the starting coordinates $(X, Y)$ are out of bounds, return.
			- If the color of the cell $(X, Y)$ is NOT the original target color, return.
			- If the color of the cell $(X, Y)$ is ALREADY the replacement color, return (prevents infinite loops).
		- 2. **Update Color:** Change the color of cell $(X, Y)$ to the new color.
		- 3. **Recurse:** Make recursive calls to the adjacent cells:
			- `FloodFill(X + 1, Y)` (Right)
			- `FloodFill(X - 1, Y)` (Left)
			- `FloodFill(X, Y + 1)` (Up)
			- `FloodFill(X, Y - 1)` (Down)
	-
	- ```mermaid
	  flowchart TD
	      A["Start FloodFill at (X, Y)"] --> B{"Out of Bounds?"}
	      B -- Yes --> C["Return"]
	      B -- No --> D{"Is color == targetColor?"}
	      D -- No --> C
	      D -- Yes --> E["Set color(X, Y) = newColor"]
	      E --> F["FloodFill(X+1, Y)\nFloodFill(X-1, Y)\nFloodFill(X, Y+1)\nFloodFill(X, Y-1)"]
	      F --> G["Region Filled!"]
	  ```
-
- # Complexity Analysis
  collapsed:: true
	- | Step | Time Complexity | Space Complexity |
	  |---|---|---|
	  | **Iterating/Recursion** | $O(N)$ | $O(N)$ (Stack or Queue size) |
	  | **Total (Average/Worst)** | **O(N)** | **O(N)** |
	- *Where $N$ is the number of pixels/cells matching the target color.*
-
- # Implementation
  collapsed:: true
	- > [!note] Flood Fill Implementations
	  > Below are implementations utilizing the recursive DFS strategy, which is the most standard and elegant way to write Flood Fill.
	-
	- :::code-tabs
	  
	  ```python
	  def flood_fill(image, sr, sc, new_color):
	      rows = len(image)
	      cols = len(image[0])
	      target_color = image[sr][sc]
	      
	      if target_color == new_color:
	          return image
	          
	      def dfs(r, c):
	          if r < 0 or r >= rows or c < 0 or c >= cols:
	              return
	          if image[r][c] != target_color:
	              return
	              
	          image[r][c] = new_color
	          dfs(r + 1, c)
	          dfs(r - 1, c)
	          dfs(r, c + 1)
	          dfs(r, c - 1)
	          
	      dfs(sr, sc)
	      return image
	  
	  if __name__ == "__main__":
	      img = [
	          [1, 1, 1, 2],
	          [1, 1, 0, 2],
	          [1, 0, 1, 2],
	          [2, 2, 2, 2]
	      ]
	      print("Original:")
	      for row in img: print(row)
	      
	      flood_fill(img, 1, 1, 3)
	      
	      print("\nFilled:")
	      for row in img: print(row)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  
	  using namespace std;
	  
	  void dfs(vector<vector<int>>& image, int r, int c, int target_color, int new_color) {
	      if (r < 0 || r >= image.size() || c < 0 || c >= image[0].size() || image[r][c] != target_color) {
	          return;
	      }
	      
	      image[r][c] = new_color;
	      dfs(image, r + 1, c, target_color, new_color);
	      dfs(image, r - 1, c, target_color, new_color);
	      dfs(image, r, c + 1, target_color, new_color);
	      dfs(image, r, c - 1, target_color, new_color);
	  }
	  
	  vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int new_color) {
	      int target_color = image[sr][sc];
	      if (target_color != new_color) {
	          dfs(image, sr, sc, target_color, new_color);
	      }
	      return image;
	  }
	  
	  int main() {
	      vector<vector<int>> img = {
	          {1, 1, 1, 2},
	          {1, 1, 0, 2},
	          {1, 0, 1, 2},
	          {2, 2, 2, 2}
	      };
	      floodFill(img, 1, 1, 3);
	      for (auto row : img) {
	          for (int val : row) cout << val << " ";
	          cout << "\n";
	      }
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function floodFill(image, sr, sc, newColor) {
	      const rows = image.length;
	      const cols = image[0].length;
	      const targetColor = image[sr][sc];
	      
	      if (targetColor === newColor) return image;
	      
	      function dfs(r, c) {
	          if (r < 0 || r >= rows || c < 0 || c >= cols || image[r][c] !== targetColor) {
	              return;
	          }
	          
	          image[r][c] = newColor;
	          dfs(r + 1, c);
	          dfs(r - 1, c);
	          dfs(r, c + 1);
	          dfs(r, c - 1);
	      }
	      
	      dfs(sr, sc);
	      return image;
	  }
	  
	  let img = [
	      [1, 1, 1, 2],
	      [1, 1, 0, 2],
	      [1, 0, 1, 2],
	      [2, 2, 2, 2]
	  ];
	  floodFill(img, 1, 1, 3);
	  console.log(img);
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  public class FloodFillAlgorithm {
	      private static void dfs(int[][] image, int r, int c, int targetColor, int newColor) {
	          if (r < 0 || r >= image.length || c < 0 || c >= image[0].length || image[r][c] != targetColor) {
	              return;
	          }
	          
	          image[r][c] = newColor;
	          dfs(image, r + 1, c, targetColor, newColor);
	          dfs(image, r - 1, c, targetColor, newColor);
	          dfs(image, r, c + 1, targetColor, newColor);
	          dfs(image, r, c - 1, targetColor, newColor);
	      }
	      
	      public static int[][] floodFill(int[][] image, int sr, int sc, int newColor) {
	          int targetColor = image[sr][sc];
	          if (targetColor != newColor) {
	              dfs(image, sr, sc, targetColor, newColor);
	          }
	          return image;
	      }
	      
	      public static void main(String[] args) {
	          int[][] img = {
	              {1, 1, 1, 2},
	              {1, 1, 0, 2},
	              {1, 0, 1, 2},
	              {2, 2, 2, 2}
	          };
	          floodFill(img, 1, 1, 3);
	          for (int[] row : img) {
	              System.out.println(Arrays.toString(row));
	          }
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  
	  void dfs(int rows, int cols, int image[rows][cols], int r, int c, int target, int newC) {
	      if (r < 0 || r >= rows || c < 0 || c >= cols || image[r][c] != target) {
	          return;
	      }
	      
	      image[r][c] = newC;
	      dfs(rows, cols, image, r + 1, c, target, newC);
	      dfs(rows, cols, image, r - 1, c, target, newC);
	      dfs(rows, cols, image, r, c + 1, target, newC);
	      dfs(rows, cols, image, r, c - 1, target, newC);
	  }
	  
	  void floodFill(int rows, int cols, int image[rows][cols], int sr, int sc, int newC) {
	      int target = image[sr][sc];
	      if (target != newC) {
	          dfs(rows, cols, image, sr, sc, target, newC);
	      }
	  }
	  
	  int main() {
	      int R = 4, C = 4;
	      int img[4][4] = {
	          {1, 1, 1, 2},
	          {1, 1, 0, 2},
	          {1, 0, 1, 2},
	          {2, 2, 2, 2}
	      };
	      
	      floodFill(R, C, img, 1, 1, 3);
	      
	      for (int i = 0; i < R; i++) {
	          for (int j = 0; j < C; j++) {
	              printf("%d ", img[i][j]);
	          }
	          printf("\n");
	      }
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Flood Fill
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Need to find/modify a connected\ncomponent in a grid?"}
	      Q -- Yes --> S1{"Is the grid absolutely massive\n(e.g., 4000x4000)?"}
	      S1 -- No --> R1["✅ Use Recursive DFS Flood Fill\n(Simple and clean)"]
	      S1 -- Yes --> R2["✅ Use BFS Flood Fill\n(Prevents StackOverflow)"]
	  ```
	-
	- ## ✅ Use Flood Fill When
		- Building paint/graphics applications.
		- Determining connected components in 2D matrices (e.g., counting islands).
		- Implementing games (like Minesweeper blank tile reveals or Go captures).
	-
	- ## ❌ Avoid Flood Fill When
		- Searching for the shortest path between two points. Flood fill blindly colors everything in the region; you should use Lee's Algorithm (BFS) or A* instead.
-
- # Key Takeaways
  collapsed:: true
	- **Grid as a Graph** — standardizes the concept that 2D matrix arrays are just graphs with implied 4-way or 8-way edges.
	- **Infinite Loop Guard** — immediately checking if `target_color == new_color` prevents the algorithm from recursing forever on already-painted cells.
	- **Memory Tradeoff** — DFS relies on the call stack (which is severely limited in size), while BFS relies on a heap-allocated Queue structure (much safer for huge matrices).
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Flood Fill Algorithm](https://www.geeksforgeeks.org/flood-fill-algorithm-implement-fill-paint/)
		- [LeetCode – Flood Fill Problem](https://leetcode.com/problems/flood-fill/)