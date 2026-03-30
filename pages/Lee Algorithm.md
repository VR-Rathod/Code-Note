---
seoTitle: Lee Algorithm – Shortest Path in Grid Using BFS Explained
description: "Lee algorithm finds the shortest path in a grid maze using BFS. Covers wave propagation, obstacle handling, O(mn) complexity, and PCB routing applications."
keywords: "Lee algorithm, BFS, grid shortest path, maze solving, wave propagation, O(mn), time complexity, space complexity, PCB routing, grid algorithm"
---

- # Explanation
	- **Lee Algorithm** is a breadth-first search (BFS) based algorithm used to find the shortest path in a grid-based problem, particularly in a **2D grid** (or maze), where movement is allowed only in 4 or 8 directions.
	-
- # Steps:
	- Start at the source node and enqueue it in the queue.
	-
	- Mark the current node as visited and begin processing the neighbors (up, down, left, right, or diagonal).
	-
	- For each unvisited neighbor, enqueue it and mark its distance from the source node.
	-
	- Repeat until the target node is reached or all reachable nodes are visited.
-
- # Time Complexity:
	- **O(V + E)**, where `V` is the number of vertices and `E` is the number of edges.
-
- ```python
  from collections import deque
  
  def lee_algorithm(grid, start, end):
      rows, cols = len(grid), len(grid[0])
      queue = deque([start])
      distances = [[-1] * cols for _ in range(rows)]  # -1 indicates unvisited
      distances[start[0]][start[1]] = 0
      directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]  # Up, Down, Left, Right
  
      while queue:
          x, y = queue.popleft()
          
          # Check if we have reached the end
          if (x, y) == end:
              return distances[x][y]
          
          for dx, dy in directions:
              nx, ny = x + dx, y + dy
              if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == 0 and distances[nx][ny] == -1:
                  distances[nx][ny] = distances[x][y] + 1
                  queue.append((nx, ny))
      
      return -1  # No path found
  
  # Example usage
  grid = [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
      [0, 1, 1, 0]
  ]
  start = (0, 0)
  end = (3, 3)
  print("Shortest path length:", lee_algorithm(grid, start, end))
  ```