---
seoTitle: Depth First Search (DFS) – Graph Traversal Algorithm Guide
description: "DFS explores graphs by going as deep as possible before backtracking. Covers recursive and iterative DFS, cycle detection, topological sort, and connected."
keywords: "depth first search, DFS, graph traversal, recursion, backtracking, cycle detection, topological sort, connected components, time complexity, space complexity"
---

# Explanation
	- Depth First Search (DFS) is a searching algorithm used in graph or tree data structures. It starts from a given node and explores as far as possible along each branch before backtracking. DFS is implemented using recursion or a stack.
-
- # Steps:
	- **Start** from a node (typically the root node or any arbitrary node).
	-
	- Mark the node as **visited**.
	-
	- Visit its **adjacent nodes** that have not been visited yet.
	-
	- This process continues recursively or using a stack, visiting each node until all nodes are explored.
	-
	- If a node has already been visited, it is not revisited.
-
- # Time Complexity:
	- For a graph with **V vertices** and **E edges**, the time complexity of DFS is **O(V + E)**.
-
- ```python
  def dfs(graph, node, visited=None):
      if visited is None:
          visited = set()  # Set to keep track of visited nodes
      
      visited.add(node)
      print(node)  # Print the node as we visit it
      
      for neighbor in graph[node]:
          if neighbor not in visited:
              dfs(graph, neighbor, visited)  # Recursively visit unvisited neighbors
  
  # Example graph
  graph = {
      'A': ['B', 'C'],
      'B': ['A', 'D', 'E'],
      'C': ['A', 'F'],
      'D': ['B'],
      'E': ['B', 'F'],
      'F': ['C', 'E']
  }
  
  # Call DFS starting from node 'A'
  dfs(graph, 'A')
  ```