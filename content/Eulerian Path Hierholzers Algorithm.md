---
seoTitle: Eulerian Path – Hierholzer's Algorithm Implementation Guide
description: "Hierholzer's algorithm finds Eulerian circuits and paths in O(E) time. Covers Eulerian circuit conditions, directed and undirected graphs, and stack-based."
keywords: "Eulerian path, Eulerian circuit, Hierholzer algorithm, graph theory, O(E) time, directed graph, undirected graph, time complexity, space complexity, edge traversal"
---

- # Explanation
	- **Eulerian Path** in a graph is a path that visits every edge exactly once. **Hierholzer's Algorithm** is used to find Eulerian paths or circuits in a graph.
	-
	- An Eulerian **Circuit** exists if all vertices have an even degree. An **Eulerian Path** exists if exactly two vertices have an odd degree.
-
- # Steps:
	- Start at any vertex with an odd degree (if an Eulerian path is sought) or any vertex with an even degree (if an Eulerian circuit is sought).
	-
	- Follow edges, marking them as used, until you have visited all edges.
	-
	- If stuck, backtrack to earlier vertices and continue exploring unused edges.
-
- # Time Complexity:
	- **Time complexity**: O(E), where E is the number of edges in the graph.
-
- ```python
  from collections import defaultdict
  
  class Graph:
      def __init__(self):
          self.graph = defaultdict(list)
  
      def add_edge(self, u, v):
          self.graph[u].append(v)
          self.graph[v].append(u)
      
      def eulerian_path(self):
          start_vertex = None
          odd_degree_count = 0
          for vertex in self.graph:
              if len(self.graph[vertex]) % 2 != 0:
                  odd_degree_count += 1
                  start_vertex = vertex
          
          if odd_degree_count not in [0, 2]:
              return "No Eulerian Path"
  
          if not start_vertex:
              start_vertex = list(self.graph.keys())[0]
          
          stack, path = [start_vertex], []
          
          while stack:
              vertex = stack[-1]
              if self.graph[vertex]:
                  next_vertex = self.graph[vertex].pop()
                  self.graph[next_vertex].remove(vertex)
                  stack.append(next_vertex)
              else:
                  path.append(stack.pop())
          
          return path[::-1]
  
  # Example usage
  g = Graph()
  g.add_edge(0, 1)
  g.add_edge(1, 2)
  g.add_edge(2, 0)
  result = g.eulerian_path()
  print(f"Eulerian Path: {result}")
  ```