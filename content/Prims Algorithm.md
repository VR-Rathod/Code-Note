---
seoTitle: Prim's Algorithm – Minimum Spanning Tree (MST) using Priority Queues
description: "Master Prim's Algorithm for finding the Minimum Spanning Tree (MST). Covers the greedy growing tree approach, Priority Queue/Heap implementation, dense vs. sparse graph strategies, and code in 5 languages."
keywords: "Prim's algorithm, Minimum Spanning Tree, MST, Priority Queue, greedy algorithm, O(E log V), time complexity, dense graphs, graph algorithm, VR-Rathod, Code-Note"
---

> [!info] What is Prim's Algorithm?
> **Prim's Algorithm** is a greedy algorithm that finds a **Minimum Spanning Tree (MST)** for a connected, undirected, weighted graph.
> Unlike Kruskal's algorithm, which builds a forest of disconnected trees that eventually merge, Prim's algorithm starts from a single root node and continuously grows a single tree. At each step, it safely adds the cheapest possible edge that connects the existing tree to a new, unvisited node.

- # Explanation
  collapsed:: true
	- **The Core Problem:** We want to connect all nodes in a network with the absolute minimum total edge weight, without forming any cycles.
	- **The Solution (The Cut Property):** If we divide the graph into two sets—nodes currently in the MST and nodes not yet in the MST—the cheapest edge connecting the two sets is guaranteed to be part of the Minimum Spanning Tree. Prim's Algorithm exploits this property repeatedly.
	-
	- ## Using a Priority Queue (Min-Heap)
	  collapsed:: true
		- To efficiently find the cheapest edge connecting the growing tree to the unvisited nodes, we use a Priority Queue (or Min-Heap).
		- We insert the starting node with a cost of 0.
		- When a node is extracted from the queue, it means we have found the cheapest path to attach it to the MST. We then look at all its neighboring nodes and insert their connecting edges into the priority queue.
		- This approach mirrors **Dijkstra's Algorithm**, but instead of tracking the total distance from the source, Prim's tracks the **cheapest single edge** connecting a node to the tree.
-
- # How It Works
  collapsed:: true
	- ## Step-by-Step Execution
	  collapsed:: true
		- 1. **Initialize:** Create an array to track visited nodes. Create a Min-Heap (Priority Queue) to store edges in the format `(weight, u, v)`.
		- 2. **Start:** Pick an arbitrary starting node. Mark its cost to join the tree as 0. Push it into the Min-Heap.
		- 3. **Iterate:** While the Min-Heap is not empty and we haven't visited all nodes:
			- Extract the node with the minimum connecting edge weight from the Min-Heap.
			- If the node has already been visited, discard it (to avoid cycles).
			- Otherwise, mark the node as visited and add the edge to our MST.
			- For every unvisited neighbor of this node, push the connecting edge into the Min-Heap.
		- 4. **Terminate:** Stop when exactly $V$ nodes have been added to the MST.
	-
	- ```mermaid
	  flowchart TD
	      A["Start: Choose arbitrary node S"] --> B["Mark S as visited\nPush all edges from S into Min-Heap"]
	      B --> C{"Is Min-Heap empty or\nall nodes visited?"}
	      C -- Yes --> D["Done! MST found"]
	      C -- No --> E["Extract minimum weight edge (u, v) from Heap"]
	      E --> F{"Is v already visited?"}
	      F -- Yes (Cycle) --> C
	      F -- No --> G["Mark v as visited\nAdd (u, v) to MST"]
	      G --> H["Push all edges from v to\nunvisited nodes into Min-Heap"]
	      H --> C
	  ```
-
- # Complexity Analysis
  collapsed:: true
	- | Implementation Strategy | Time Complexity | Space Complexity | Best Use Case |
	  |---|---|---|---|
	  | **Adjacency Matrix (Simple Array)** | $O(V^2)$ | $O(V^2)$ | Extremely Dense Graphs ($E \approx V^2$) |
	  | **Adjacency List + Binary Heap** | $O(E \log V)$ | $O(V + E)$ | Sparse/Medium Graphs ($E \ll V^2$) |
	  | **Adjacency List + Fibonacci Heap** | $O(E + V \log V)$ | $O(V + E)$ | Theoretical Optimum for all graphs |
	-
	- ## Prim's vs. Kruskal's
	  collapsed:: true
		- **Prim's Algorithm** is generally faster on **dense graphs** because it can be implemented in $O(V^2)$ without sorting edges, skipping the $O(E \log E)$ bottleneck of Kruskal's.
		- **Kruskal's Algorithm** is generally faster on **sparse graphs**, as $E$ is small and sorting is very fast, whereas Prim's priority queue overhead can be slightly heavier.
-
- # Implementation
  collapsed:: true
	- > [!note] Prim's MST Algorithm Implementation
	  > The code below uses an Adjacency List and a Min-Heap (Priority Queue) to achieve $O(E \log V)$ time complexity, outputting the total MST cost and the constituent edges.
	-
	- :::code-tabs
	  
	  ```python
	  import heapq
	  
	  def prims(n, edges):
	      # Build Adjacency List
	      adj = {i: [] for i in range(n)}
	      for u, v, w in edges:
	          adj[u].append((w, v))
	          adj[v].append((w, u))
	          
	      mst = []
	      visited = [False] * n
	      total_cost = 0
	      
	      # Min-Heap stores (weight, source, destination)
	      # Starting arbitrarily from node 0
	      pq = [(0, -1, 0)]
	      
	      edges_added = 0
	      while pq and edges_added < n:
	          w, u, v = heapq.heappop(pq)
	          
	          if visited[v]:
	              continue
	              
	          visited[v] = True
	          total_cost += w
	          if u != -1:
	              mst.append((u, v, w))
	          
	          edges_added += 1
	          
	          for next_w, next_v in adj[v]:
	              if not visited[next_v]:
	                  heapq.heappush(pq, (next_w, v, next_v))
	                  
	      return mst, total_cost
	  
	  if __name__ == "__main__":
	      V = 5
	      edges = [
	          (0, 1, 2), (0, 3, 6), (1, 2, 3), 
	          (1, 3, 8), (1, 4, 5), (2, 4, 7), (3, 4, 9)
	      ]
	      mst_edges, cost = prims(V, edges)
	      print(f"Total MST Cost: {cost}")
	      print("Edges in MST:", mst_edges)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <queue>
	  
	  using namespace std;
	  
	  struct Edge {
	      int to, weight;
	  };
	  
	  struct QueueNode {
	      int weight, from, to;
	      bool operator>(const QueueNode& other) const {
	          return weight > other.weight;
	      }
	  };
	  
	  void prims(int n, const vector<vector<Edge>>& adj) {
	      vector<bool> visited(n, false);
	      vector<QueueNode> mst;
	      int total_cost = 0;
	      
	      priority_queue<QueueNode, vector<QueueNode>, greater<QueueNode>> pq;
	      
	      // Start from node 0
	      pq.push({0, -1, 0});
	      int edges_added = 0;
	      
	      while (!pq.empty() && edges_added < n) {
	          QueueNode curr = pq.top();
	          pq.pop();
	          
	          int v = curr.to;
	          if (visited[v]) continue;
	          
	          visited[v] = true;
	          total_cost += curr.weight;
	          if (curr.from != -1) {
	              mst.push_back(curr);
	          }
	          edges_added++;
	          
	          for (const auto& edge : adj[v]) {
	              if (!visited[edge.to]) {
	                  pq.push({edge.weight, v, edge.to});
	              }
	          }
	      }
	      
	      cout << "Total MST Cost: " << total_cost << "\nEdges in MST:\n";
	      for (const auto& e : mst) {
	          cout << e.from << " - " << e.to << " : " << e.weight << "\n";
	      }
	  }
	  
	  int main() {
	      int V = 5;
	      vector<vector<Edge>> adj(V);
	      auto addEdge = [&](int u, int v, int w) {
	          adj[u].push_back({v, w});
	          adj[v].push_back({u, w});
	      };
	      
	      addEdge(0, 1, 2); addEdge(0, 3, 6); addEdge(1, 2, 3);
	      addEdge(1, 3, 8); addEdge(1, 4, 5); addEdge(2, 4, 7); addEdge(3, 4, 9);
	      
	      prims(V, adj);
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class PriorityQueue {
	      constructor() {
	          this.values = [];
	      }
	      enqueue(weight, from, to) {
	          this.values.push({weight, from, to});
	          this.sort();
	      }
	      dequeue() {
	          return this.values.shift();
	      }
	      sort() {
	          this.values.sort((a, b) => a.weight - b.weight);
	      }
	      isEmpty() {
	          return this.values.length === 0;
	      }
	  }
	  
	  function prims(n, edges) {
	      const adj = Array.from({length: n}, () => []);
	      for (const [u, v, w] of edges) {
	          adj[u].push({to: v, weight: w});
	          adj[v].push({to: u, weight: w});
	      }
	      
	      const visited = new Array(n).fill(false);
	      const mst = [];
	      let totalCost = 0;
	      
	      const pq = new PriorityQueue();
	      pq.enqueue(0, -1, 0);
	      
	      let edgesAdded = 0;
	      while (!pq.isEmpty() && edgesAdded < n) {
	          const {weight: w, from: u, to: v} = pq.dequeue();
	          
	          if (visited[v]) continue;
	          
	          visited[v] = true;
	          totalCost += w;
	          if (u !== -1) {
	              mst.push({u, v, w});
	          }
	          edgesAdded++;
	          
	          for (const neighbor of adj[v]) {
	              if (!visited[neighbor.to]) {
	                  pq.enqueue(neighbor.weight, v, neighbor.to);
	              }
	          }
	      }
	      
	      console.log(`Total MST Cost: ${totalCost}`);
	      console.log("Edges in MST:", mst);
	  }
	  
	  const V = 5;
	  const edges = [
	      [0, 1, 2], [0, 3, 6], [1, 2, 3],
	      [1, 3, 8], [1, 4, 5], [2, 4, 7], [3, 4, 9]
	  ];
	  prims(V, edges);
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  class Edge {
	      int to, weight;
	      Edge(int t, int w) { to = t; weight = w; }
	  }
	  
	  class QueueNode implements Comparable<QueueNode> {
	      int weight, from, to;
	      QueueNode(int w, int f, int t) { weight = w; from = f; to = t; }
	      public int compareTo(QueueNode other) {
	          return Integer.compare(this.weight, other.weight);
	      }
	  }
	  
	  public class PrimsAlgorithm {
	      public static void prims(int n, List<List<Edge>> adj) {
	          boolean[] visited = new boolean[n];
	          List<QueueNode> mst = new ArrayList<>();
	          int totalCost = 0;
	          
	          PriorityQueue<QueueNode> pq = new PriorityQueue<>();
	          pq.add(new QueueNode(0, -1, 0));
	          
	          int edgesAdded = 0;
	          while (!pq.isEmpty() && edgesAdded < n) {
	              QueueNode curr = pq.poll();
	              int v = curr.to;
	              
	              if (visited[v]) continue;
	              
	              visited[v] = true;
	              totalCost += curr.weight;
	              if (curr.from != -1) {
	                  mst.add(curr);
	              }
	              edgesAdded++;
	              
	              for (Edge edge : adj.get(v)) {
	                  if (!visited[edge.to]) {
	                      pq.add(new QueueNode(edge.weight, v, edge.to));
	                  }
	              }
	          }
	          
	          System.out.println("Total MST Cost: " + totalCost);
	          System.out.println("Edges in MST:");
	          for (QueueNode e : mst) {
	              System.out.println(e.from + " - " + e.to + " : " + e.weight);
	          }
	      }
	      
	      public static void main(String[] args) {
	          int V = 5;
	          List<List<Edge>> adj = new ArrayList<>();
	          for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
	          
	          adj.get(0).add(new Edge(1, 2)); adj.get(1).add(new Edge(0, 2));
	          adj.get(0).add(new Edge(3, 6)); adj.get(3).add(new Edge(0, 6));
	          adj.get(1).add(new Edge(2, 3)); adj.get(2).add(new Edge(1, 3));
	          adj.get(1).add(new Edge(3, 8)); adj.get(3).add(new Edge(1, 8));
	          adj.get(1).add(new Edge(4, 5)); adj.get(4).add(new Edge(1, 5));
	          adj.get(2).add(new Edge(4, 7)); adj.get(4).add(new Edge(2, 7));
	          adj.get(3).add(new Edge(4, 9)); adj.get(4).add(new Edge(3, 9));
	          
	          prims(V, adj);
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  #include <stdbool.h>
	  
	  #define INF 1000000000
	  
	  // Using the simpler O(V^2) implementation for C 
	  // which is optimal for highly dense matrices.
	  void primsDense(int V, int graph[][5]) {
	      int parent[V]; 
	      int key[V]; 
	      bool visited[V]; 
	  
	      for (int i = 0; i < V; i++) {
	          key[i] = INF;
	          visited[i] = false;
	      }
	  
	      key[0] = 0; 
	      parent[0] = -1; 
	  
	      for (int count = 0; count < V - 1; count++) {
	          int min = INF, u = -1;
	  
	          for (int v = 0; v < V; v++) {
	              if (!visited[v] && key[v] < min) {
	                  min = key[v];
	                  u = v;
	              }
	          }
	  
	          if (u == -1) break;
	          visited[u] = true;
	  
	          for (int v = 0; v < V; v++) {
	              if (graph[u][v] && !visited[v] && graph[u][v] < key[v]) {
	                  parent[v] = u;
	                  key[v] = graph[u][v];
	              }
	          }
	      }
	  
	      int totalCost = 0;
	      printf("Edges in MST:\n");
	      for (int i = 1; i < V; i++) {
	          printf("%d - %d : %d\n", parent[i], i, graph[i][parent[i]]);
	          totalCost += graph[i][parent[i]];
	      }
	      printf("Total MST Cost: %d\n", totalCost);
	  }
	  
	  int main() {
	      int V = 5;
	      int graph[5][5] = {
	          {0, 2, 0, 6, 0},
	          {2, 0, 3, 8, 5},
	          {0, 3, 0, 0, 7},
	          {6, 8, 0, 0, 9},
	          {0, 5, 7, 9, 0}
	      };
	      primsDense(V, graph);
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Prim's Algorithm
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Is the graph Dense or Sparse?"}
	      Q -- Sparse (E ≈ V) --> S1{"Are edges pre-sorted?"}
	      S1 -- Yes --> R1["✅ Use Kruskal's Algorithm"]
	      S1 -- No --> R2["✅ Both Prim's (with Heap) and Kruskal's work exceptionally well"]
	      Q -- Dense (E ≈ V²) --> R3["✅ Use Prim's Algorithm (with Adjacency Matrix)\n(Runs in strict O(V²) avoiding V² log V edge sorts)"]
	  ```
	-
	- ## ✅ Use Prim's Algorithm When
		- The graph is highly **dense** ($E \approx V^2$). By using an adjacency matrix and a simple array to track minimum edges, Prim's runs in pure $O(V^2)$ time, which is faster than Kruskal's sorting overhead.
		- The graph geometry makes it easier to naturally grow a single connected component from a specific localized starting point (e.g., expanding a physical power grid outward from a single plant).
	-
	- ## ❌ Avoid Prim's Algorithm When
		- The graph is extremely **sparse** and edges are already sorted. Kruskal's algorithm becomes virtually $O(E)$ and is vastly simpler to manage without priority queue overhead.
		- Dealing with a disconnected graph (a "Forest"). Prim's will only find the spanning tree for the single connected component containing the starting node, requiring a surrounding loop to catch the rest.
-
- # Key Takeaways
  collapsed:: true
	- **Single Tree Growth** — unlike Kruskal's which merges disjoint sets globally, Prim's focuses entirely on expanding the boundaries of one central tree.
	- **Dijkstra's Cousin** — functionally identical to Dijkstra's shortest path algorithm, except it optimizes for the *cheapest single connecting edge* rather than the *cheapest cumulative path from the start*.
	- **Dense Graph King** — the matrix-based $O(V^2)$ variant of Prim's is the theoretically optimal and practically fastest way to process highly dense graph networks.
	- **Priority Queue Heavy** — the sparse $O(E \log V)$ variant heavily relies on Min-Heaps to quickly locate the cheapest edge crossing the cut.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Prim's Minimum Spanning Tree (MST)](https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/)
		- [TheAlgorithms – Prim's (Python)](https://github.com/TheAlgorithms/Python/blob/master/graphs/prims.py)
