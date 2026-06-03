---
seoTitle: Eulerian Path – Hierholzer's Algorithm Implementation Guide
description: "Hierholzer's algorithm finds Eulerian circuits and paths in O(E) time. Covers Eulerian circuit conditions, directed and undirected graphs, and stack-based traversal with full implementations."
keywords: "Eulerian path, Eulerian circuit, Hierholzer algorithm, graph theory, O(E) time, directed graph, undirected graph, time complexity, space complexity, edge traversal, Eukerian Path (Hierholzer's Algorithm)"
displayTitle: Eukerian Path (Hierholzer's Algorithm)
title: Eukerian Path Hierholzers Algorithm
---

> [!info] What is an Eulerian Path?
> An **Eulerian Path** is a trail in a graph that visits **every edge exactly once**. An **Eulerian Circuit** is an Eulerian Path that starts and ends at the same vertex.
> **Hierholzer's Algorithm** finds an Eulerian circuit or path in **$O(E)$ time** using an iterative stack-based DFS — far more efficient than the naive approach of trying all permutations.

- # Explanation
  collapsed:: true
	- **Eulerian Path / Circuit** differs from a Hamiltonian Path in that it must traverse every **edge** exactly once (not every vertex).
	-
	- ## Existence Conditions
	  collapsed:: true
		- ### Undirected Graph
			- **Eulerian Circuit**: Every vertex has an **even degree**. Start anywhere.
			- **Eulerian Path**: Exactly **two vertices have an odd degree** (one is the start, the other the end). All other vertices must have even degree.
			- All vertices with non-zero degree must be **connected**.
		-
		- ### Directed Graph
			- **Eulerian Circuit**: Every vertex has `in-degree == out-degree`. Graph is strongly connected.
			- **Eulerian Path**: Exactly one vertex has `out-degree - in-degree = +1` (start), exactly one vertex has `in-degree - out-degree = +1` (end), all others have equal in/out degree.
	-
	- ## Why Hierholzer's Works
	  collapsed:: true
		- The naive approach (DFS, backtrack) could revisit edges unnecessarily, leading to $O(E^2)$ in the worst case.
		- Hierholzer's uses a **stack + output list** trick: when a vertex has no more edges to follow, it is appended to the result. Reversing the result at the end gives the correct path.
		- This ensures each edge is processed exactly once → $O(E)$ time.
	-
	- ## Core Properties
	  collapsed:: true
		- **Stability:** Not applicable (not a sort).
		- **In-Place:** Uses $O(V + E)$ auxiliary space for the adjacency list, stack, and output path.
		- **Graph Type:** Works on both **directed** and **undirected** graphs with the appropriate existence conditions.
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- 1. **Check conditions**: verify the graph has an Eulerian path or circuit.
		- 2. **Choose start vertex**: vertex with odd degree (path) or any vertex (circuit).
		- 3. **Iterative DFS with a stack**: push the current vertex. If it has unvisited edges, push the neighbor and remove the edge. If it has no more edges, pop it onto the output path.
		- 4. **Reverse the output path** to get the correct order.
		-
		- ```mermaid
		  flowchart TD
		      A["Check Eulerian conditions\n(degree parity / in-out degree balance)"] --> B{"Valid\nEulerian Path?"}
		      B -- No --> Z["❌ Return 'No Eulerian Path'"]
		      B -- Yes --> C["Choose start vertex\n(odd-degree vertex or any vertex)"]
		      C --> D["Push start onto stack"]
		      D --> E{"Stack\nnot empty?"}
		      E -- Yes --> F{"Current vertex\nhas edges?"}
		      F -- Yes --> G["Remove edge u→v\nPush v onto stack"]
		      G --> E
		      F -- No --> H["Pop vertex\nAppend to path"]
		      H --> E
		      E -- No --> I["Reverse path → ✅ Eulerian Path found"]
		  
		      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		  ```
	-
	- ## Step-by-Step Trace (Undirected: 0-1-2-0 triangle)
	  collapsed:: true
		- ```
		  Graph edges: 0-1, 1-2, 2-0
		  Adjacency list: {0:[1,2], 1:[0,2], 2:[1,0]}
		  
		  All degrees = 2 (even) → Eulerian Circuit exists. Start at vertex 0.
		  
		  stack = [0], path = []
		  
		  Step 1: top=0, neighbors=[1,2]. Pop edge 0→2.
		    stack = [0, 2]
		  
		  Step 2: top=2, neighbors=[1,0]. Pop edge 2→1.
		    (also remove reverse edge 1→2)
		    stack = [0, 2, 1]
		  
		  Step 3: top=1, neighbors=[0]. Pop edge 1→0.
		    (also remove reverse edge 0→1)
		    stack = [0, 2, 1, 0]
		  
		  Step 4: top=0, neighbors=[] (exhausted). Pop → path = [0]
		    stack = [0, 2, 1]
		  
		  Step 5: top=1, neighbors=[] (exhausted). Pop → path = [0, 1]
		    stack = [0, 2]
		  
		  Step 6: top=2, neighbors=[] (exhausted). Pop → path = [0, 1, 2]
		    stack = [0]
		  
		  Step 7: top=0, neighbors=[] (exhausted). Pop → path = [0, 1, 2, 0]
		    stack = []
		  
		  Reverse path = [0, 2, 1, 0]  ← Eulerian Circuit ✅
		  ```
- # Complexity Analysis
  collapsed:: true
	- | Scenario | Time Complexity | Space Complexity | Notes |
	  |---|---|---|---|
	  | **Best Case** | **O(E)** | **O(V + E)** | All edges form a single circuit |
	  | **Average Case** | **O(E)** | **O(V + E)** | Standard graph traversal |
	  | **Worst Case** | **O(E)** | **O(V + E)** | All edges visited exactly once |
	-
	- ## Why Always O(E)?
	  collapsed:: true
		- Each edge is **added to the stack once** and **removed once** when traversed. The output path appends each vertex at most once per edge removal. There are no repeated edge visits → total work is $O(E)$.
		- The adjacency list is stored as a mutable list/deque, so edge removal is $O(1)$ amortized (pop from end).
- # Implementation
  collapsed:: true
	- > [!note] Hierholzer's Algorithm — Undirected & Directed Graph
	  > The implementation below handles both undirected graphs (removing both directions of an edge) and includes a directed variant. Uses an iterative stack to avoid recursion-depth limits.
		- Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs
	  
	  ```python
	  from collections import defaultdict
	  
	  class EulerianGraph:
	      def __init__(self, directed=False):
	          self.graph = defaultdict(list)
	          self.directed = directed
	  
	      def add_edge(self, u, v):
	          self.graph[u].append(v)
	          if not self.directed:
	              self.graph[v].append(u)
	  
	      def _find_start(self):
	          """Find the correct starting vertex based on degree conditions."""
	          if self.directed:
	              in_deg = defaultdict(int)
	              out_deg = defaultdict(int)
	              for u in self.graph:
	                  out_deg[u] += len(self.graph[u])
	                  for v in self.graph[u]:
	                      in_deg[v] += 1
	              start = None
	              for v in set(list(in_deg) + list(out_deg)):
	                  diff = out_deg[v] - in_deg[v]
	                  if diff == 1:
	                      return v          # Eulerian path start
	                  elif diff not in (0, 1, -1):
	                      return None       # Invalid
	              return next(iter(self.graph))  # Circuit: any vertex
	          else:
	              odd_vertices = [v for v in self.graph if len(self.graph[v]) % 2 != 0]
	              if len(odd_vertices) not in (0, 2):
	                  return None
	              return odd_vertices[0] if odd_vertices else next(iter(self.graph))
	  
	      def find_eulerian_path(self):
	          # Work on a copy so the original graph is preserved
	          adj = defaultdict(list)
	          for u in self.graph:
	              adj[u] = list(self.graph[u])
	  
	          start = self._find_start()
	          if start is None:
	              return []   # No Eulerian path exists
	  
	          stack = [start]
	          path = []
	  
	          while stack:
	              v = stack[-1]
	              if adj[v]:
	                  u = adj[v].pop()
	                  if not self.directed:
	                      adj[u].remove(v)    # Remove reverse edge
	                  stack.append(u)
	              else:
	                  path.append(stack.pop())
	  
	          return path[::-1]
	  
	  # --- Example: Undirected Eulerian Circuit ---
	  g = EulerianGraph(directed=False)
	  for u, v in [(0, 1), (1, 2), (2, 0)]:
	      g.add_edge(u, v)
	  print("Circuit:", g.find_eulerian_path())   # [0, 1, 2, 0] or equivalent
	  
	  # --- Example: Directed Eulerian Path ---
	  dg = EulerianGraph(directed=True)
	  for u, v in [(0, 1), (1, 2), (2, 0), (0, 3), (3, 4)]:
	      dg.add_edge(u, v)
	  print("Path:", dg.find_eulerian_path())
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <stack>
	  #include <unordered_map>
	  #include <algorithm>
	  
	  class EulerianGraph {
	      std::unordered_map<int, std::vector<int>> adj;
	      bool directed;
	  
	  public:
	      explicit EulerianGraph(bool directed = false) : directed(directed) {}
	  
	      void addEdge(int u, int v) {
	          adj[u].push_back(v);
	          if (!directed) adj[v].push_back(u);
	      }
	  
	      int findStart() {
	          if (!directed) {
	              int start = -1, oddCount = 0;
	              for (auto& [v, edges] : adj) {
	                  if (edges.size() % 2 != 0) { oddCount++; start = v; }
	              }
	              if (oddCount != 0 && oddCount != 2) return -1;
	              return (start != -1) ? start : adj.begin()->first;
	          }
	          // Directed: find vertex with out - in = 1
	          std::unordered_map<int, int> balance;
	          for (auto& [u, edges] : adj) {
	              balance[u] += edges.size();
	              for (int v : edges) balance[v]--;
	          }
	          for (auto& [v, b] : balance) {
	              if (b == 1) return v;
	              if (abs(b) > 1) return -1;
	          }
	          return adj.begin()->first;
	      }
	  
	      std::vector<int> findEulerianPath() {
	          // Work on a copy
	          auto adjCopy = adj;
	          int start = findStart();
	          if (start == -1) return {};
	  
	          std::stack<int> stk;
	          std::vector<int> path;
	          stk.push(start);
	  
	          while (!stk.empty()) {
	              int v = stk.top();
	              if (!adjCopy[v].empty()) {
	                  int u = adjCopy[v].back();
	                  adjCopy[v].pop_back();
	                  if (!directed) {
	                      auto it = std::find(adjCopy[u].begin(), adjCopy[u].end(), v);
	                      if (it != adjCopy[u].end()) adjCopy[u].erase(it);
	                  }
	                  stk.push(u);
	              } else {
	                  path.push_back(stk.top());
	                  stk.pop();
	              }
	          }
	          std::reverse(path.begin(), path.end());
	          return path;
	      }
	  };
	  
	  int main() {
	      EulerianGraph g(false);
	      g.addEdge(0, 1); g.addEdge(1, 2); g.addEdge(2, 0);
	      auto path = g.findEulerianPath();
	      std::cout << "Eulerian Circuit: ";
	      for (int v : path) std::cout << v << " ";
	      std::cout << "\n"; // 0 2 1 0 (or equivalent)
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class EulerianGraph {
	      constructor(directed = false) {
	          this.adj = new Map();
	          this.directed = directed;
	      }
	  
	      addEdge(u, v) {
	          if (!this.adj.has(u)) this.adj.set(u, []);
	          if (!this.adj.has(v)) this.adj.set(v, []);
	          this.adj.get(u).push(v);
	          if (!this.directed) this.adj.get(v).push(u);
	      }
	  
	      findStart() {
	          if (!this.directed) {
	              let start = null, oddCount = 0;
	              for (const [v, edges] of this.adj) {
	                  if (edges.length % 2 !== 0) { oddCount++; start = v; }
	              }
	              if (oddCount !== 0 && oddCount !== 2) return null;
	              return start ?? this.adj.keys().next().value;
	          }
	          const balance = new Map();
	          for (const [u, edges] of this.adj) {
	              balance.set(u, (balance.get(u) ?? 0) + edges.length);
	              for (const v of edges) balance.set(v, (balance.get(v) ?? 0) - 1);
	          }
	          for (const [v, b] of balance) {
	              if (b === 1) return v;
	              if (Math.abs(b) > 1) return null;
	          }
	          return this.adj.keys().next().value;
	      }
	  
	      findEulerianPath() {
	          // Deep copy adjacency list
	          const adj = new Map();
	          for (const [v, edges] of this.adj) adj.set(v, [...edges]);
	  
	          const start = this.findStart();
	          if (start === null) return [];
	  
	          const stack = [start];
	          const path = [];
	  
	          while (stack.length > 0) {
	              const v = stack[stack.length - 1];
	              if (adj.get(v)?.length > 0) {
	                  const u = adj.get(v).pop();
	                  if (!this.directed) {
	                      const idx = adj.get(u).indexOf(v);
	                      if (idx !== -1) adj.get(u).splice(idx, 1);
	                  }
	                  stack.push(u);
	              } else {
	                  path.push(stack.pop());
	              }
	          }
	          return path.reverse();
	      }
	  }
	  
	  // Example
	  const g = new EulerianGraph(false);
	  [[0,1],[1,2],[2,0]].forEach(([u,v]) => g.addEdge(u, v));
	  console.log("Eulerian Circuit:", g.findEulerianPath()); // [0, 2, 1, 0]
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class EulerianGraph {
	      private final Map<Integer, List<Integer>> adj = new HashMap<>();
	      private final boolean directed;
	  
	      public EulerianGraph(boolean directed) {
	          this.directed = directed;
	      }
	  
	      public void addEdge(int u, int v) {
	          adj.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
	          adj.computeIfAbsent(v, k -> new ArrayList<>());
	          if (!directed) adj.get(v).add(u);
	      }
	  
	      private int findStart() {
	          if (!directed) {
	              int start = -1, oddCount = 0;
	              for (Map.Entry<Integer, List<Integer>> e : adj.entrySet()) {
	                  if (e.getValue().size() % 2 != 0) { oddCount++; start = e.getKey(); }
	              }
	              if (oddCount != 0 && oddCount != 2) return -1;
	              return (start != -1) ? start : adj.keySet().iterator().next();
	          }
	          Map<Integer, Integer> balance = new HashMap<>();
	          for (Map.Entry<Integer, List<Integer>> e : adj.entrySet()) {
	              balance.merge(e.getKey(), e.getValue().size(), Integer::sum);
	              for (int v : e.getValue()) balance.merge(v, -1, Integer::sum);
	          }
	          for (Map.Entry<Integer, Integer> e : balance.entrySet()) {
	              if (e.getValue() == 1) return e.getKey();
	              if (Math.abs(e.getValue()) > 1) return -1;
	          }
	          return adj.keySet().iterator().next();
	      }
	  
	      public List<Integer> findEulerianPath() {
	          // Deep copy adjacency list
	          Map<Integer, List<Integer>> adjCopy = new HashMap<>();
	          for (Map.Entry<Integer, List<Integer>> e : adj.entrySet())
	              adjCopy.put(e.getKey(), new ArrayList<>(e.getValue()));
	  
	          int start = findStart();
	          if (start == -1) return Collections.emptyList();
	  
	          Deque<Integer> stack = new ArrayDeque<>();
	          List<Integer> path = new ArrayList<>();
	          stack.push(start);
	  
	          while (!stack.isEmpty()) {
	              int v = stack.peek();
	              List<Integer> edges = adjCopy.get(v);
	              if (edges != null && !edges.isEmpty()) {
	                  int u = edges.remove(edges.size() - 1);
	                  if (!directed) adjCopy.get(u).remove(Integer.valueOf(v));
	                  stack.push(u);
	              } else {
	                  path.add(stack.pop());
	              }
	          }
	          Collections.reverse(path);
	          return path;
	      }
	  
	      public static void main(String[] args) {
	          EulerianGraph g = new EulerianGraph(false);
	          g.addEdge(0, 1); g.addEdge(1, 2); g.addEdge(2, 0);
	          System.out.println("Eulerian Circuit: " + g.findEulerianPath()); // [0, 2, 1, 0]
	      }
	  }
	  ```
	  
	  :::
- # Alternative Variant (Directed Graph — Reconstruct Itinerary)
  collapsed:: true
	- > [!tip] Directed Eulerian Path — "Reconstruct Itinerary" Pattern
	  > A classic LeetCode-style application: given a list of airline tickets (directed edges), find the itinerary that uses all tickets exactly once in lexicographic order. This is a directed Eulerian Path where edges are sorted to enforce lexicographic preference.
	-
	- :::code-tabs
	  
	  ```python
	  from collections import defaultdict
	  import heapq
	  
	  def find_itinerary(tickets: list[list[str]]) -> list[str]:
	      """
	      Reconstruct itinerary using Hierholzer's on a directed graph.
	      Edges are stored in a min-heap to ensure lexicographic ordering.
	      """
	      adj = defaultdict(list)
	      for src, dst in tickets:
	          heapq.heappush(adj[src], dst)
	  
	      path = []
	      stack = ["JFK"]
	  
	      while stack:
	          while adj[stack[-1]]:
	              next_dest = heapq.heappop(adj[stack[-1]])
	              stack.append(next_dest)
	          path.append(stack.pop())
	  
	      return path[::-1]
	  
	  # Example
	  tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]
	  print(find_itinerary(tickets))
	  # Output: ['JFK', 'MUC', 'LHR', 'SFO', 'SJC']
	  ```
	  
	  ```javascript
	  function findItinerary(tickets) {
	      const adj = {};
	      tickets.sort((a, b) => a[1].localeCompare(b[1]));
	      for (const [src, dst] of tickets) {
	          if (!adj[src]) adj[src] = [];
	          adj[src].push(dst);
	      }
	  
	      const path = [];
	      const stack = ["JFK"];
	  
	      while (stack.length > 0) {
	          const src = stack[stack.length - 1];
	          if (adj[src] && adj[src].length > 0) {
	              stack.push(adj[src].shift()); // shift picks smallest (sorted)
	          } else {
	              path.push(stack.pop());
	          }
	      }
	      return path.reverse();
	  }
	  
	  const tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]];
	  console.log(findItinerary(tickets));
	  // Output: ['JFK', 'MUC', 'LHR', 'SFO', 'SJC']
	  ```
	  
	  :::
- # When to Use Hierholzer's Algorithm
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Does the problem require\ntraversing every EDGE\nexactly once?"}
	      Q -- No --> R1["Use DFS / BFS\nor Hamiltonian path algorithms"]
	      Q -- Yes --> S1{"Does a valid\nEulerian path exist?\n(check degree conditions)"}
	      S1 -- No --> Z["❌ No Eulerian Path\n(graph conditions not met)"]
	      S1 -- Yes --> S2{"Directed or\nUndirected graph?"}
	      S2 -- Undirected --> R2["✅ Hierholzer's\nCheck: 0 or 2 odd-degree vertices"]
	      S2 -- Directed --> R3["✅ Hierholzer's\nCheck: in-degree == out-degree\n(±1 for path endpoints)"]
	  
	      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
	  ```
	-
	- ## ✅ Use Hierholzer's When
		- You need to find a route that traverses **every edge exactly once** (Eulerian path / circuit).
		- Problems involve **route reconstruction** from a list of directed connections (e.g., airline itineraries, DNA fragment assembly).
		- The graph satisfies Eulerian conditions — otherwise, no such path exists.
		- You need **$O(E)$ performance** — Hierholzer's is optimal for this problem.
	-
	- ## ❌ Avoid Hierholzer's When
		- You need to visit **every vertex** exactly once — that is the Hamiltonian Path problem (NP-Hard).
		- The graph does **not satisfy** Eulerian degree conditions — verify first before running.
		- You need to find the **shortest path** between two specific nodes — use Dijkstra's or BFS instead.
- # Key Takeaways
  collapsed:: true
	- **Edge Traversal, Not Vertex** — Eulerian paths must visit every *edge* exactly once; Hamiltonian paths must visit every *vertex* exactly once. These are entirely different problems.
	- **O(E) Optimal** — Hierholzer's algorithm is asymptotically optimal: each edge is pushed to the stack once and popped once.
	- **Degree Conditions** — For undirected graphs: 0 or 2 odd-degree vertices. For directed graphs: all vertices must have balanced in/out degree (±1 at endpoints for a path).
	- **Stack + Reverse Trick** — The iterative DFS appends vertices to the output only when they are fully exhausted (no remaining edges), then reverses the result for the correct path order.
	- **Directed vs Undirected** — Both use the same algorithm skeleton, but directed graphs skip removing the reverse edge, and use in/out degree for existence checks.
	- **Common Applications** — DNA fragment assembly, Chinese Postman Problem, circuit board routing, airline itinerary reconstruction (LeetCode #332).
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [CP Algorithms → Eulerian Path](https://cp-algorithms.com/graph/euler_path.html)
		- [GeeksforGeeks → Hierholzer's Algorithm](https://www.geeksforgeeks.org/hierholzers-algorithm-directed-graph/)
		- [LeetCode → Reconstruct Itinerary (Problem 332)](https://leetcode.com/problems/reconstruct-itinerary/)
		- [TheAlgorithms – Eulerian Path (Python)](https://github.com/TheAlgorithms/Python/blob/master/graphs/eulerian_path_and_circuit_for_undirected_graph.py)