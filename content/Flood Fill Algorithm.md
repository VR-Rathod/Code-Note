# Explanation
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