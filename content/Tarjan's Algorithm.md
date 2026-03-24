# Explanation
	- **Tarjan’s Algorithm** is another algorithm used to find **strongly connected components (SCCs)** in a directed graph. It uses a single DFS traversal.
	-
- # Steps:
	- Perform DFS while maintaining discovery times and the lowest reachable node for each vertex.
	-
	- Use a stack to track the vertices being visited.
	-
	- When a SCC is found, pop the vertices from the stack.
-
- # Time Complexity:
	- **O(V + E)**, where `V` is the number of vertices and `E` is the number of edges.
-
- ```python
  def tarjans(graph, V):
      index = 0
      stack = []
      low_link = [-1] * V
      index_at = [-1] * V
      on_stack = [False] * V
      sccs = []
  
      def dfs(v):
          nonlocal index
          stack.append(v)
          on_stack[v] = True
          index_at[v] = index
          low_link[v] = index
          index += 1
          
          for u in graph[v]:
              if index_at[u] == -1:
                  dfs(u)
                  low_link[v] = min(low_link[v], low_link[u])
              elif on_stack[u]:
                  low_link[v] = min(low_link[v], index_at[u])
          
          if low_link[v] == index_at[v]:
              scc = []
              while True:
                  w = stack.pop()
                  on_stack[w] = False
                  scc.append(w)
                  if w == v:
                      break
              sccs.append(scc)
      
      for i in range(V):
          if index_at[i] == -1:
              dfs(i)
      
      return sccs
  
  # Example usage
  graph = {0: [1], 1: [2], 2: [0], 3: [2], 4: [5], 5: [4]}
  V = 6
  print("Strongly Connected Components:", tarjans(graph, V))
  ```