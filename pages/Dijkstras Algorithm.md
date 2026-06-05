---
seoTitle: Dijkstra's Algorithm – Shortest Path in Weighted Graphs
description: "Comprehensive guide to Dijkstra's Algorithm. Covers greedy shortest path traversal, priority queue implementation, edge relaxation, and time complexities in Python, C++, JavaScript, Java, and C."
keywords: "Dijkstra algorithm, shortest path, weighted graph, priority queue, greedy algorithm, O(E log V), time complexity, space complexity, non-negative weights, VR-Rathod, Code-Note , Dijkstras Algorithm"
displayTitle: Dijkstra's Algorithm
treeTitle: DSA - Graph Algorithms - Dijkstras Algorithm
---

> [!info] What is Dijkstra's Algorithm?
> **Dijkstra's Algorithm** is a greedy algorithm used to find the absolute shortest path from a starting (source) node to all other nodes in a weighted graph.
> It requires all edge weights to be **non-negative**. It utilizes a Priority Queue (Min-Heap) to continually process the closest unvisited node, guaranteeing optimal $O(E \log V)$ performance.

- # Explanation
  collapsed:: true
	- **Dijkstra's Algorithm** works by maintaining a set of unvisited nodes and calculating the tentative distance from the source to each node. It iteratively selects the unvisited node with the smallest tentative distance, explores its neighbors, and updates their distances if a shorter path is found.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine a network of cities connected by highways, where the "weight" is the driving time between cities. You start at City A with a stopwatch at 0.
		- You look at all immediate neighboring cities and log their estimated arrival times. You then "teleport" to the city with the **shortest arrival time** on your list and permanently lock it in as the fastest possible route. From that new city, you check its neighbors, update any faster routes, and repeat.
	-
	- ## The Edge Relaxation Rule
	  collapsed:: true
		- The core mechanism of Dijkstra's is "Relaxation".
		- If the current known shortest distance to node $U$ is $dist[U]$, and there is an edge from $U$ to $V$ with weight $W$:
		- `if dist[U] + W < dist[V]`, then `dist[V] = dist[U] + W`.
		- By repeatedly relaxing edges starting from the closest nodes, the algorithm converges on the optimal shortest path.
	-
	- ## Why No Negative Weights?
	  collapsed:: true
		- Dijkstra's relies on a greedy assumption: once a node is popped from the priority queue, its shortest path is permanently finalized.
		- If a negative edge exists, it could retroactively create a shorter path to a "finalized" node, breaking the algorithm's core guarantee. If your graph has negative edges, use the [[Bellman Ford Algorithm]] instead.
-
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- Initialize a distance array `dist[]` where the source node is 0 and all others are $\infty$.
		- Push the source node into a Min-Priority Queue.
		- Repeatedly pop the node with the smallest distance. If its current path is outdated, ignore it. Otherwise, relax all of its outgoing edges and push any updated neighbors into the queue.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — Set dist[S] = 0, others ∞\nPush (0, S) to Min-Heap"] --> B{"Is Min-Heap empty?"}
		      B -- Yes --> H["End — All reachable nodes found"]
		      B -- No --> C["Pop (d, U) with smallest distance"]
		      C --> D{"Is d > dist[U]?"}
		      D -- Yes --> B
		      D -- No --> E["For each neighbor V of U\nwith edge weight W"]
		      E --> F{"dist[U] + W < dist[V]?"}
		      F -- Yes --> G["Relax Edge:\ndist[V] = dist[U] + W\nPush (dist[V], V) to Min-Heap"]
		      F -- No --> E
		      G --> E
		      E -- "All neighbors checked" --> B
		  ```
	-
	- ## Step-by-Step Algorithm
	  collapsed:: true
		- ```
		  INPUT:  Graph G, Source S
		  OUTPUT: Array dist[] containing shortest paths from S
		  
		  1. Create array dist[] of size V, initialize all to INFINITY
		  2. dist[S] = 0
		  3. Create Min-Priority Queue PQ
		  4. Push (0, S) into PQ
		  5. WHILE PQ is not empty:
		     a. Pop (d, U) from PQ
		     b. IF d > dist[U]:
		           CONTINUE (Stale pair, ignore)
		     c. FOR each neighbor V of U with weight W:
		           IF dist[U] + W < dist[V]:
		              dist[V] = dist[U] + W
		              Push (dist[V], V) into PQ
		  6. RETURN dist[]
		  ```
	-
	- ## Live Walkthrough — Graph Traversal
	  collapsed:: true
		- Graph: `A -> B (weight 4)`, `A -> C (weight 1)`, `C -> B (weight 2)`, `B -> D (weight 1)`, `C -> D (weight 5)`.
		- Start at `A`.
		- ```
		  ┌────────────────────────────────────────────────────────┐
		  │ Step │ Min-Heap        │ dist[] Array     │ Action         │
		  ├────────────────────────────────────────────────────────┤
		  │ Init │ (0, A)          │ A=0, B=∞, C=∞, D=∞|              │
		  │  1   │                 │                  │ Pop (0, A)     │
		  │      │                 │                  │ Relax A->B (4) │
		  │      │ (4, B), (1, C)  │ A=0, B=4, C=1, D=∞| Relax A->C (1) │
		  │  2   │                 │                  │ Pop (1, C)     │
		  │      │                 │                  │ Relax C->B (1+2=3 < 4) │
		  │      │ (3, B), (6, D)  │ A=0, B=3, C=1, D=∞| Relax C->D (1+5=6) │
		  │  3   │                 │                  │ Pop (3, B)     │
		  │      │                 │                  │ Relax B->D (3+1=4 < 6) │
		  │      │ (4, D), (6, D)  │ A=0, B=3, C=1, D=4|              │
		  │  4   │                 │                  │ Pop (4, D)     │
		  │      │                 │                  │ No neighbors   │
		  │  5   │                 │                  │ Pop (6, D)     │
		  │      │                 │                  │ 6 > dist[D]=4, Ignore! │
		  └────────────────────────────────────────────────────────┘
		  
		  Shortest Paths from A: B=3, C=1, D=4
		  ```
-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > Using an Adjacency List and a Min-Heap (Priority Queue):
	  > - **Time Complexity: O((V + E) log V)** — each vertex and edge is processed, and heap operations take $O(\log V)$.
	  > - **Space Complexity: O(V + E)** — graph representation and priority queue.
	-
	- ## Complexity Table
	  collapsed:: true
		- | Data Structure | Time Complexity | Why |
		  |------|------|-----|
		  | **Array / Unsorted List** | **O(V²)** | Finding the minimum distance node takes $O(V)$. Good for dense graphs ($E \approx V²$). |
		  | **Binary Min-Heap** | **O((V + E) log V)** | Standard implementation. Popping and pushing to the heap takes logarithmic time. |
		  | **Fibonacci Heap** | **O(E + V log V)** | Theoretically optimal, but constants are too high for practical implementation. |
-
- # Implementation
  collapsed:: true
	- > [!note] Standard implementation using Adjacency List and Min-Heap.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  import heapq
	  
	  def dijkstra(graph, num_vertices, start):
	      """
	      Dijkstra's Algorithm using heapq
	      Time: O(E log V) | Space: O(V)
	      """
	      dist = {i: float('inf') for i in range(num_vertices)}
	      dist[start] = 0
	      
	      # Min-heap storing tuples of (distance, vertex)
	      pq = [(0, start)]
	      
	      while pq:
	          current_dist, u = heapq.heappop(pq)
	          
	          # If we find a stale tuple (longer than current known shortest), ignore
	          if current_dist > dist[u]:
	              continue
	              
	          for v, weight in graph.get(u, []):
	              alt = current_dist + weight
	              if alt < dist[v]:
	                  dist[v] = alt
	                  heapq.heappush(pq, (alt, v))
	                  
	      return dist
	  
	  # Example
	  # Graph: 0 -> 1(weight 4), 0 -> 2(weight 1), 2 -> 1(weight 2), 1 -> 3(weight 1), 2 -> 3(weight 5)
	  graph = {
	      0: [(1, 4), (2, 1)],
	      1: [(3, 1)],
	      2: [(1, 2), (3, 5)],
	      3: []
	  }
	  print("Shortest paths from 0:", dijkstra(graph, 4, 0))
	  # Output: {0: 0, 1: 3, 2: 1, 3: 4}
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <queue>
	  #include <unordered_map>
	  
	  using namespace std;
	  
	  const int INF = 1e9;
	  
	  vector<int> dijkstra(int numVertices, unordered_map<int, vector<pair<int, int>>>& graph, int start) {
	      vector<int> dist(numVertices, INF);
	      dist[start] = 0;
	  
	      // Min-heap: stores {distance, vertex}
	      priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
	      pq.push({0, start});
	  
	      while (!pq.empty()) {
	          int current_dist = pq.top().first;
	          int u = pq.top().second;
	          pq.pop();
	  
	          // Ignore stale pairs
	          if (current_dist > dist[u]) continue;
	  
	          for (auto& edge : graph[u]) {
	              int v = edge.first;
	              int weight = edge.second;
	  
	              if (dist[u] + weight < dist[v]) {
	                  dist[v] = dist[u] + weight;
	                  pq.push({dist[v], v});
	              }
	          }
	      }
	      return dist;
	  }
	  
	  int main() {
	      unordered_map<int, vector<pair<int, int>>> graph = {
	          {0, {{1, 4}, {2, 1}}},
	          {1, {{3, 1}}},
	          {2, {{1, 2}, {3, 5}}},
	          {3, {}}
	      };
	      
	      vector<int> distances = dijkstra(4, graph, 0);
	      cout << "Shortest paths from 0: ";
	      for (int i = 0; i < 4; i++) {
	          cout << "Node " << i << ":" << distances[i] << " ";
	      }
	      cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  // Custom Min-Heap Implementation for Dijkstra's
	  class MinHeap {
	      constructor() { this.data = []; }
	      push(item) {
	          this.data.push(item);
	          this.up(this.data.length - 1);
	      }
	      pop() {
	          if (this.data.length === 0) return null;
	          const top = this.data[0];
	          const bottom = this.data.pop();
	          if (this.data.length > 0) {
	              this.data[0] = bottom;
	              this.down(0);
	          }
	          return top;
	      }
	      up(i) {
	          while (i > 0) {
	              const p = Math.floor((i - 1) / 2);
	              if (this.data[p].d <= this.data[i].d) break;
	              [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
	              i = p;
	          }
	      }
	      down(i) {
	          const len = this.data.length;
	          while (i * 2 + 1 < len) {
	              let child = i * 2 + 1;
	              if (child + 1 < len && this.data[child + 1].d < this.data[child].d) child++;
	              if (this.data[i].d <= this.data[child].d) break;
	              [this.data[i], this.data[child]] = [this.data[child], this.data[i]];
	              i = child;
	          }
	      }
	      isEmpty() { return this.data.length === 0; }
	  }
	  
	  function dijkstra(graph, numVertices, start) {
	      const dist = Array(numVertices).fill(Infinity);
	      dist[start] = 0;
	      
	      const pq = new MinHeap();
	      pq.push({ d: 0, u: start });
	      
	      while (!pq.isEmpty()) {
	          const { d: current_dist, u } = pq.pop();
	          
	          if (current_dist > dist[u]) continue;
	          
	          const neighbors = graph[u] || [];
	          for (const [v, weight] of neighbors) {
	              if (dist[u] + weight < dist[v]) {
	                  dist[v] = dist[u] + weight;
	                  pq.push({ d: dist[v], u: v });
	              }
	          }
	      }
	      return dist;
	  }
	  
	  const graph = {
	      0: [[1, 4], [2, 1]],
	      1: [[3, 1]],
	      2: [[1, 2], [3, 5]],
	      3: []
	  };
	  console.log("Shortest paths from 0:", dijkstra(graph, 4, 0));
	  // Output: [ 0, 3, 1, 4 ]
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class Dijkstra {
	      static class Edge {
	          int target, weight;
	          Edge(int t, int w) { target = t; weight = w; }
	      }
	  
	      static class Node implements Comparable<Node> {
	          int id, dist;
	          Node(int i, int d) { id = i; dist = d; }
	          public int compareTo(Node other) { return Integer.compare(this.dist, other.dist); }
	      }
	  
	      public static int[] dijkstra(Map<Integer, List<Edge>> graph, int numVertices, int start) {
	          int[] dist = new int[numVertices];
	          Arrays.fill(dist, Integer.MAX_VALUE);
	          dist[start] = 0;
	  
	          PriorityQueue<Node> pq = new PriorityQueue<>();
	          pq.add(new Node(start, 0));
	  
	          while (!pq.isEmpty()) {
	              Node current = pq.poll();
	              int u = current.id;
	  
	              if (current.dist > dist[u]) continue;
	  
	              for (Edge edge : graph.getOrDefault(u, new ArrayList<>())) {
	                  int v = edge.target;
	                  if (dist[u] + edge.weight < dist[v]) {
	                      dist[v] = dist[u] + edge.weight;
	                      pq.add(new Node(v, dist[v]));
	                  }
	              }
	          }
	          return dist;
	      }
	  
	      public static void main(String[] args) {
	          Map<Integer, List<Edge>> graph = new HashMap<>();
	          graph.put(0, Arrays.asList(new Edge(1, 4), new Edge(2, 1)));
	          graph.put(1, Arrays.asList(new Edge(3, 1)));
	          graph.put(2, Arrays.asList(new Edge(1, 2), new Edge(3, 5)));
	          graph.put(3, new ArrayList<>());
	  
	          int[] distances = dijkstra(graph, 4, 0);
	          System.out.println("Shortest paths from 0: " + Arrays.toString(distances));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  #include <stdbool.h>
	  #include <limits.h>
	  
	  #define V 4
	  
	  // Time: O(V²) - Using an array instead of a heap for dense graphs
	  int minDistance(int dist[], bool sptSet[]) {
	      int min = INT_MAX, min_index;
	      for (int v = 0; v < V; v++) {
	          if (!sptSet[v] && dist[v] <= min) {
	              min = dist[v];
	              min_index = v;
	          }
	      }
	      return min_index;
	  }
	  
	  void dijkstra(int graph[V][V], int src) {
	      int dist[V];
	      bool sptSet[V];
	  
	      for (int i = 0; i < V; i++) {
	          dist[i] = INT_MAX;
	          sptSet[i] = false;
	      }
	      dist[src] = 0;
	  
	      for (int count = 0; count < V - 1; count++) {
	          int u = minDistance(dist, sptSet);
	          sptSet[u] = true;
	  
	          for (int v = 0; v < V; v++) {
	              if (!sptSet[v] && graph[u][v] && dist[u] != INT_MAX 
	                  && dist[u] + graph[u][v] < dist[v]) {
	                  dist[v] = dist[u] + graph[u][v];
	              }
	          }
	      }
	  
	      printf("Vertex \t Distance from Source\n");
	      for (int i = 0; i < V; i++) {
	          printf("%d \t\t %d\n", i, dist[i]);
	      }
	  }
	  
	  int main() {
	      int graph[V][V] = {
	          {0, 4, 1, 0},
	          {0, 0, 0, 1},
	          {0, 2, 0, 5},
	          {0, 0, 0, 0}
	      };
	      dijkstra(graph, 0);
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Dijkstra
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Graph Properties"}
	      Q -- "Unweighted edges" --> R1["❌ Use BFS\nBFS is faster O(V+E) and needs no heap"]
	      Q -- "Negative edge weights" --> R2["❌ Use Bellman-Ford\nDijkstra will return incorrect results"]
	      Q -- "Grid with distance heuristics" --> R3["❌ Use A*\nA* uses distance heuristics to skip nodes"]
	      Q -- "Positive weighted graph" --> R4["✅ Use Dijkstra\nThe absolute fastest optimal path finder"]
	  ```
	-
	- ## ✅ Use Dijkstra When
		- You need to find the shortest path from a single source to all other nodes in a positively weighted graph.
		- Routing packets through a network where latency is always $>0$.
		- Mapping applications where road lengths are purely non-negative distances.
-
- # Key Takeaways
  collapsed:: true
	- **Core idea** — Greedily select the closest unvisited node, relax its edges, repeat.
	- **Constraint** — Instantly breaks if there are **negative edge weights**.
	- **Min-Heap driven** — Powered by a priority queue for $O(\log V)$ vertex selection.
	- **Stale tuples** — Always check `if current_dist > dist[u]: continue` to skip outdated heap records.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Dijkstra's Algorithm](https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/)
		- [TheAlgorithms – Dijkstra (Python)](https://github.com/TheAlgorithms/Python/blob/master/graphs/dijkstra.py)