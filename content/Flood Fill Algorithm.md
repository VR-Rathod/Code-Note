---
date: 2025-03-26T12:40:55+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Flood Fill Algorithm – BFS and DFS Implementation Guide
description: "Flood fill fills connected regions in a grid, used in paint tools and game maps. Covers BFS and DFS approaches, 4-connectivity vs 8-connectivity, and."
keywords: "flood fill, BFS, DFS, grid algorithm, connected region, paint bucket, 4-connectivity, 8-connectivity, time complexity, space complexity, image processing"
---

- # Explanation
	- **Flood Fill** is an algorithm used to determine the area connected to a given node in a multi-dimensional array.
	-
- # Steps:
	- Start from a given point and mark it as visited.
	-
	- Check neighboring cells and recursively visit all cells that are the same as the starting point.
	-
	- Continue until the entire connected region is filled.
-
- #### **Time Complexity:**
	- **O(N)**, where `N` is the number of cells in the grid.
-
- ```python
  def flood_fill(grid, x, y, new_color):
      original_color = grid[x][y]
      if original_color == new_color:
          return
      def dfs(x, y):
          if x < 0 or x >= len(grid) or y < 0 or y >= len(grid[0]):
              return
          if grid[x][y] != original_color:
              return
          grid[x][y] = new_color
          dfs(x+1, y)
          dfs(x-1, y)
          dfs(x, y+1)
          dfs(x, y-1)
      
      dfs(x, y)
  
  # Example usage
  grid = [[1, 1, 0], [1, 1, 0], [0, 0, 0]]
  flood_fill(grid, 0, 0, 2)
  print("Flood-filled grid:", grid)
  ```