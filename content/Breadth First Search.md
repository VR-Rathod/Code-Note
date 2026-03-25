---
seoTitle: Breadth First Search (BFS) – Graph Traversal Algorithm Guide
description: "BFS traverses graphs level by level using a queue. Covers shortest path in unweighted graphs, connected components, bipartite checking, time and space."
keywords: "breadth first search, BFS, graph traversal, queue, shortest path, unweighted graph, connected components, bipartite graph, time complexity, space complexity, tree traversal"
---

# Explanation
	- Breadth First Search (BFS) is a graph traversal algorithm used to search nodes in a graph or tree data structure. It explores all the neighboring nodes at the present level before moving on to nodes at the next level. BFS uses a queue data structure to keep track of the nodes to be processed.
-
- # Steps:
	- **Start** from a node (typically the root node or any arbitrary node).
	-
	- Mark the node as **visited** and enqueue it.
	-
	- While the queue is not empty:
		- Dequeue the front node.
		- Visit all its **adjacent unvisited nodes** and enqueue them.
		-
- This process continues until all nodes are visited.
-
- # Time Complexity:
	- For a graph with **V vertices** and **E edges**, the time complexity of BFS is **O(V + E)**.
-
- ```python
  from collections import deque
  
  def bfs(graph, start):
      visited = set()  # Set to keep track of visited nodes
      queue = deque([start])  # Initialize queue with the starting node
  
      while queue:
          node = queue.popleft()  # Pop the first element from the queue
          if node not in visited:
              visited.add(node)
              print(node)  # Print the node as we visit it
              
              # Add all unvisited neighbors to the queue
              for neighbor in graph[node]:
                  if neighbor not in visited:
                      queue.append(neighbor)
  
  # Example graph
  graph = {
      'A': ['B', 'C'],
      'B': ['A', 'D', 'E'],
      'C': ['A', 'F'],
      'D': ['B'],
      'E': ['B', 'F'],
      'F': ['C', 'E']
  }
  
  # Call BFS starting from node 'A'
  bfs(graph, 'A')
  ```