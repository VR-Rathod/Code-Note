---
seoTitle: Kosaraju's Algorithm – Strongly Connected Components in Graphs
description: "Kosaraju's algorithm finds all SCCs in a directed graph using two DFS passes. Covers transpose graph, finish order, O(V+E) complexity, and SCC applications."
keywords: "Kosaraju algorithm, strongly connected components, SCC, directed graph, DFS, transpose graph, O(V+E), time complexity, space complexity, graph algorithm"
---

- # Explanation
	- **Kosaraju's Algorithm** is used to find the **strongly connected components (SCC)** of a directed graph. It works by performing two depth-first searches (DFS).
-
- # Steps:
	- Perform DFS on the original graph to get the finish times of each vertex.
	-
	- Reverse all edges in the graph.
	-
	- Perform DFS on the reversed graph in the order of decreasing finish times from the first DFS to identify SCCs.
-
- # Time Complexity:
	- **O(V + E)**, where `V` is the number of vertices and `E` is the number of edges.
-
- ```python
  def kosaraju(graph, V):
      def dfs(v, visited, stack):
          visited[v] = True
          for u in graph[v]:
              if not visited[u]:
                  dfs(u, visited, stack)
          stack.append(v)
      
      def reverse_graph(graph, V):
          rev_graph = {i: [] for i in range(V)}
          for u in graph:
              for v in graph[u]:
                  rev_graph[v].append(u)
          return rev_graph
  
      stack = []
      visited = [False] * V
      for i in range(V):
          if not visited[i]:
              dfs(i, visited, stack)
      
      rev_graph = reverse_graph(graph, V)
      visited = [False] * V
      sccs = []
      
      while stack:
          v = stack.pop()
          if not visited[v]:
              component = []
              dfs(v, visited, component)
              sccs.append(component)
      
      return sccs
  
  # Example usage
  graph = {0: [1], 1: [2], 2: [0], 3: [2], 4: [5], 5: [4]}
  V = 6
  print("Strongly Connected Components:", kosaraju(graph, V))
  ```