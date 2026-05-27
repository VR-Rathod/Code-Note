---
seoTitle: Johnson's Algorithm – All-Pairs Shortest Path for Sparse Graphs
description: "Master Johnson's algorithm for all-pairs shortest paths. Covers Bellman-Ford reweighting, Dijkstra integration, mathematical proofs, and O(V^2 log V + VE) implementations in Python, C++, JavaScript, Java, and C."
keywords: "Johnson algorithm, all-pairs shortest path, sparse graph, reweighting, Dijkstra, Bellman-Ford, O(V^2 log V), time complexity, space complexity, graph algorithm, VR-Rathod, Code-Note"
displayTitle: Johnson Algorithm
---

> [!info] What is Johnson's Algorithm?
> **Johnson's Algorithm** is an efficient way to find the shortest paths between all pairs of vertices in a sparse, directed, weighted graph.
> It handles **negative edge weights** (but not negative weight cycles) by using the **Bellman-Ford algorithm** to mathematically reweight all edges to be non-negative. Once all edges are non-negative, it runs **Dijkstra's algorithm** from every vertex to find the shortest paths, achieving much better performance on sparse graphs than the $O(V^3)$ Floyd-Warshall algorithm.

- # Explanation
  collapsed:: true
	- **The Core Problem:** Dijkstra's algorithm is fast ($O(E \log V)$ per vertex) but fails on negative weights. Bellman-Ford handles negative weights but is slow ($O(VE)$ per vertex). If we want all-pairs shortest paths on a sparse graph with negative weights, running Bellman-Ford from every node takes $O(V^2E)$, which is too slow.
	- **The Solution:** Johnson's algorithm cleverly transforms the graph so that all edge weights become non-negative without altering the relative shortest paths between nodes. Then, it safely applies Dijkstra's algorithm from every vertex.
	-
	- ## The Reweighting Technique (Telescoping Sum)
	  collapsed:: true
		- Suppose we assign a potential or weight $h(v)$ to every vertex $v$.
		- We define a new edge weight: $w'(u, v) = w(u, v) + h(u) - h(v)$
		- Any path $p$ from $s$ to $t$ will have its new weight calculated as:
		  $w'(p) = w(p) + h(s) - h(t)$
		- Because $h(s)$ and $h(t)$ are constants for any paths between $s$ and $t$, the path that strictly minimizes $w'(p)$ also strictly minimizes $w(p)$. Thus, shortest paths are preserved!
	-
	- ## How to Compute Valid Potentials $h(v)$
	  collapsed:: true
		- We need $w'(u, v) \ge 0$.
		- This implies $w(u, v) + h(u) - h(v) \ge 0 \implies h(v) - h(u) \le w(u, v)$.
		- This is exactly the **triangle inequality** maintained by shortest paths!
		- Therefore, we can add a dummy vertex $S$ with 0-weight edges to all other vertices, run **Bellman-Ford** from $S$, and use the resulting shortest distances as our potentials $h(v)$.
-
- # How It Works
  collapsed:: true
	- ## Step-by-Step Execution
	  collapsed:: true
		- 1. **Add Dummy Source:** Add a new vertex $S$ to the graph. Add directed edges of weight 0 from $S$ to all other vertices in the graph.
		- 2. **Run Bellman-Ford:** Run the Bellman-Ford algorithm starting from $S$.
			- If Bellman-Ford detects a negative weight cycle, **abort**. The shortest paths are undefined.
			- Otherwise, record the shortest path distances from $S$ to every node $v$ as $h(v)$.
		- 3. **Reweight Edges:** For every original edge $(u, v)$ with weight $w(u, v)$, compute the new non-negative weight:
		  $w'(u, v) = w(u, v) + h(u) - h(v)$
		- 4. **Run Dijkstra:** Remove the dummy vertex $S$. Run Dijkstra's algorithm using the non-negative weights $w'$ from *every* vertex to find all-pairs shortest paths in the reweighted graph.
		- 5. **Restore Distances:** Convert the Dijkstra distances back to the original graph distances:
		  $dist(u, v) = dist'(u, v) - h(u) + h(v)$
	-
	- ```mermaid
	  flowchart TD
	      A["Start: Graph G(V, E) with negative weights"] --> B["Add dummy node S\nConnect S to all v with weight 0"]
	      B --> C["Run Bellman-Ford from S\nto find distances h(v)"]
	      C --> D{"Negative Cycle?"}
	      D -- Yes --> E["ABORT\nGraph contains negative cycle"]
	      D -- No --> F["Reweight all edges:\nw'(u,v) = w(u,v) + h(u) - h(v)"]
	      F --> G["Remove S.\nAll w'(u,v) are now ≥ 0"]
	      G --> H["Run Dijkstra from EVERY vertex u\nusing weights w' to find dist'(u, v)"]
	      H --> I["Restore original distances:\ndist(u,v) = dist'(u,v) - h(u) + h(v)"]
	  ```
-
- # Complexity Analysis
  collapsed:: true
	- | Step | Time Complexity | Space Complexity |
	  |---|---|---|
	  | **Bellman-Ford** | $O(V \cdot E)$ | $O(V)$ |
	  | **Reweighting** | $O(E)$ | $O(E)$ |
	  | **V × Dijkstra** | $O(V \cdot E \log V)$ | $O(V^2)$ (to store all-pairs distances) |
	  | **Total (Average/Worst)** | **O(V² log V + VE)** | **O(V² + E)** |
	-
	- ## Why not Floyd-Warshall?
	  collapsed:: true
		- **Floyd-Warshall** always runs in $O(V^3)$.
		- **Johnson's Algorithm** runs in $O(V E \log V)$.
		- If the graph is **dense** ($E \approx V^2$), Johnson's is $O(V^3 \log V)$, making Floyd-Warshall faster due to lower constant factors.
		- If the graph is **sparse** ($E \approx V$), Johnson's is $O(V^2 \log V)$, which is drastically faster than $O(V^3)$.
-
- # Implementation
  collapsed:: true
	- > [!note] All-Pairs Shortest Path via Johnson's Algorithm
	  > The following implementations output the full shortest-path distance matrix. If a path does not exist, it prints "INF". If a negative cycle is detected by the initial Bellman-Ford pass, the algorithms terminate early.
	-
	- :::code-tabs
	  
	  ```python
	  import heapq
	  
	  class Edge:
	      def __init__(self, dest, weight):
	          self.dest = dest
	          self.weight = weight
	  
	  def bellman_ford(n, edges, start, h):
	      h[start] = 0
	      # Relax edges V times
	      for i in range(n):
	          for u, v, w in edges:
	              if h[u] != float('inf') and h[u] + w < h[v]:
	                  h[v] = h[u] + w
	                  # If we can relax on the Nth iteration, there's a negative cycle
	                  if i == n - 1:
	                      return False
	      return True
	  
	  def dijkstra(n, adj, start, dist_prime):
	      pq = [(0, start)]
	      dist_prime[start] = 0
	      
	      while pq:
	          d, u = heapq.heappop(pq)
	          
	          if d > dist_prime[u]:
	              continue
	              
	          for edge in adj[u]:
	              v = edge.dest
	              w = edge.weight
	              if dist_prime[u] + w < dist_prime[v]:
	                  dist_prime[v] = dist_prime[u] + w
	                  heapq.heappush(pq, (dist_prime[v], v))
	  
	  def johnsons_algorithm(n, edges):
	      # Add dummy node n connected to all other nodes with weight 0
	      augmented_edges = edges[:]
	      for i in range(n):
	          augmented_edges.append((n, i, 0))
	          
	      h = [float('inf')] * (n + 1)
	      if not bellman_ford(n + 1, augmented_edges, n, h):
	          print("Graph contains a negative weight cycle.")
	          return None
	          
	      # Reweight edges: w'(u, v) = w(u, v) + h(u) - h(v)
	      adj = [[] for _ in range(n)]
	      for u, v, w in edges:
	          new_w = w + h[u] - h[v]
	          adj[u].append(Edge(v, new_w))
	          
	      # Run Dijkstra from every node
	      all_pairs_dist = []
	      for u in range(n):
	          dist_prime = [float('inf')] * n
	          dijkstra(n, adj, u, dist_prime)
	          
	          # Convert distances back
	          dist = []
	          for v in range(n):
	              if dist_prime[v] == float('inf'):
	                  dist.append(float('inf'))
	              else:
	                  dist.append(dist_prime[v] - h[u] + h[v])
	          all_pairs_dist.append(dist)
	          
	      return all_pairs_dist
	  
	  if __name__ == "__main__":
	      V = 4
	      # Edges as (u, v, w)
	      edges = [
	          (0, 1, -5),
	          (0, 2, 2),
	          (0, 3, 3),
	          (1, 2, 4),
	          (2, 3, 1)
	      ]
	      
	      dists = johnsons_algorithm(V, edges)
	      if dists:
	          print("All-pairs shortest paths:")
	          for i in range(V):
	              row = ["INF" if d == float('inf') else str(d) for d in dists[i]]
	              print(f"From {i}: {', '.join(row)}")
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <queue>
	  #include <climits>
	  
	  using namespace std;
	  
	  const int INF = 1e9;
	  
	  struct Edge {
	      int src, dest, weight;
	  };
	  
	  struct AdjEdge {
	      int dest, weight;
	  };
	  
	  bool bellmanFord(int V, const vector<Edge>& edges, int src, vector<int>& h) {
	      h.assign(V, INF);
	      h[src] = 0;
	      
	      for (int i = 0; i < V; ++i) {
	          for (const auto& e : edges) {
	              if (h[e.src] != INF && h[e.src] + e.weight < h[e.dest]) {
	                  h[e.dest] = h[e.src] + e.weight;
	                  if (i == V - 1) return false; // Negative cycle
	              }
	          }
	      }
	      return true;
	  }
	  
	  void dijkstra(int V, const vector<vector<AdjEdge>>& adj, int src, vector<int>& dist) {
	      dist.assign(V, INF);
	      dist[src] = 0;
	      priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
	      pq.push({0, src});
	      
	      while (!pq.empty()) {
	          int d = pq.top().first;
	          int u = pq.top().second;
	          pq.pop();
	          
	          if (d > dist[u]) continue;
	          
	          for (const auto& e : adj[u]) {
	              if (dist[u] + e.weight < dist[e.dest]) {
	                  dist[e.dest] = dist[u] + e.weight;
	                  pq.push({dist[e.dest], e.dest});
	              }
	          }
	      }
	  }
	  
	  void johnsonAlgorithm(int V, const vector<Edge>& edges) {
	      vector<Edge> augmentedEdges = edges;
	      int dummyNode = V;
	      for (int i = 0; i < V; ++i) {
	          augmentedEdges.push_back({dummyNode, i, 0});
	      }
	      
	      vector<int> h;
	      if (!bellmanFord(V + 1, augmentedEdges, dummyNode, h)) {
	          cout << "Graph contains a negative weight cycle.\n";
	          return;
	      }
	      
	      vector<vector<AdjEdge>> adj(V);
	      for (const auto& e : edges) {
	          int newWeight = e.weight + h[e.src] - h[e.dest];
	          adj[e.src].push_back({e.dest, newWeight});
	      }
	      
	      cout << "All-pairs shortest paths:\n";
	      for (int u = 0; u < V; ++u) {
	          vector<int> distPrime;
	          dijkstra(V, adj, u, distPrime);
	          
	          cout << "From " << u << ": ";
	          for (int v = 0; v < V; ++v) {
	              if (distPrime[v] == INF) {
	                  cout << "INF ";
	              } else {
	                  int actualDist = distPrime[v] - h[u] + h[v];
	                  cout << actualDist << " ";
	              }
	          }
	          cout << "\n";
	      }
	  }
	  
	  int main() {
	      int V = 4;
	      vector<Edge> edges = {
	          {0, 1, -5}, {0, 2, 2}, {0, 3, 3},
	          {1, 2, 4}, {2, 3, 1}
	      };
	      johnsonAlgorithm(V, edges);
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class PriorityQueue {
	      constructor() {
	          this.values = [];
	      }
	      enqueue(val, priority) {
	          this.values.push({val, priority});
	          this.sort();
	      }
	      dequeue() {
	          return this.values.shift();
	      }
	      sort() {
	          this.values.sort((a, b) => a.priority - b.priority);
	      }
	      isEmpty() {
	          return this.values.length === 0;
	      }
	  }
	  
	  function bellmanFord(V, edges, src, h) {
	      for (let i = 0; i < V; i++) h[i] = Infinity;
	      h[src] = 0;
	      
	      for (let i = 0; i < V; i++) {
	          for (const {u, v, w} of edges) {
	              if (h[u] !== Infinity && h[u] + w < h[v]) {
	                  h[v] = h[u] + w;
	                  if (i === V - 1) return false;
	              }
	          }
	      }
	      return true;
	  }
	  
	  function dijkstra(V, adj, src, dist) {
	      for (let i = 0; i < V; i++) dist[i] = Infinity;
	      dist[src] = 0;
	      
	      const pq = new PriorityQueue();
	      pq.enqueue(src, 0);
	      
	      while (!pq.isEmpty()) {
	          const {val: u, priority: d} = pq.dequeue();
	          
	          if (d > dist[u]) continue;
	          
	          for (const {v, w} of adj[u]) {
	              if (dist[u] + w < dist[v]) {
	                  dist[v] = dist[u] + w;
	                  pq.enqueue(v, dist[v]);
	              }
	          }
	      }
	  }
	  
	  function johnsonsAlgorithm(V, edges) {
	      const augmentedEdges = [...edges];
	      const dummy = V;
	      for (let i = 0; i < V; i++) {
	          augmentedEdges.push({u: dummy, v: i, w: 0});
	      }
	      
	      const h = new Array(V + 1);
	      if (!bellmanFord(V + 1, augmentedEdges, dummy, h)) {
	          console.log("Graph contains a negative weight cycle.");
	          return;
	      }
	      
	      const adj = Array.from({length: V}, () => []);
	      for (const {u, v, w} of edges) {
	          const newW = w + h[u] - h[v];
	          adj[u].push({v, w: newW});
	      }
	      
	      console.log("All-pairs shortest paths:");
	      for (let u = 0; u < V; u++) {
	          const distPrime = new Array(V);
	          dijkstra(V, adj, u, distPrime);
	          
	          let row = `From ${u}: `;
	          for (let v = 0; v < V; v++) {
	              if (distPrime[v] === Infinity) {
	                  row += "INF ";
	              } else {
	                  const actualDist = distPrime[v] - h[u] + h[v];
	                  row += actualDist + " ";
	              }
	          }
	          console.log(row);
	      }
	  }
	  
	  const V = 4;
	  const edges = [
	      {u: 0, v: 1, w: -5}, {u: 0, v: 2, w: 2}, {u: 0, v: 3, w: 3},
	      {u: 1, v: 2, w: 4}, {u: 2, v: 3, w: 1}
	  ];
	  johnsonsAlgorithm(V, edges);
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  class Edge {
	      int src, dest, weight;
	      Edge(int s, int d, int w) { src = s; dest = d; weight = w; }
	  }
	  
	  class AdjEdge {
	      int dest, weight;
	      AdjEdge(int d, int w) { dest = d; weight = w; }
	  }
	  
	  public class JohnsonAlgorithm {
	      static final int INF = (int)1e9;
	      
	      static boolean bellmanFord(int V, List<Edge> edges, int src, int[] h) {
	          Arrays.fill(h, INF);
	          h[src] = 0;
	          
	          for (int i = 0; i < V; i++) {
	              for (Edge e : edges) {
	                  if (h[e.src] != INF && h[e.src] + e.weight < h[e.dest]) {
	                      h[e.dest] = h[e.src] + e.weight;
	                      if (i == V - 1) return false;
	                  }
	              }
	          }
	          return true;
	      }
	      
	      static void dijkstra(int V, List<List<AdjEdge>> adj, int src, int[] dist) {
	          Arrays.fill(dist, INF);
	          dist[src] = 0;
	          PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
	          pq.add(new int[]{0, src});
	          
	          while (!pq.isEmpty()) {
	              int[] curr = pq.poll();
	              int d = curr[0];
	              int u = curr[1];
	              
	              if (d > dist[u]) continue;
	              
	              for (AdjEdge e : adj.get(u)) {
	                  if (dist[u] + e.weight < dist[e.dest]) {
	                      dist[e.dest] = dist[u] + e.weight;
	                      pq.add(new int[]{dist[e.dest], e.dest});
	                  }
	              }
	          }
	      }
	      
	      public static void johnsonAlgorithm(int V, List<Edge> edges) {
	          List<Edge> augEdges = new ArrayList<>(edges);
	          int dummy = V;
	          for (int i = 0; i < V; i++) {
	              augEdges.add(new Edge(dummy, i, 0));
	          }
	          
	          int[] h = new int[V + 1];
	          if (!bellmanFord(V + 1, augEdges, dummy, h)) {
	              System.out.println("Graph contains a negative weight cycle.");
	              return;
	          }
	          
	          List<List<AdjEdge>> adj = new ArrayList<>();
	          for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
	          
	          for (Edge e : edges) {
	              int newW = e.weight + h[e.src] - h[e.dest];
	              adj.get(e.src).add(new AdjEdge(e.dest, newW));
	          }
	          
	          System.out.println("All-pairs shortest paths:");
	          for (int u = 0; u < V; u++) {
	              int[] distPrime = new int[V];
	              dijkstra(V, adj, u, distPrime);
	              
	              System.out.print("From " + u + ": ");
	              for (int v = 0; v < V; v++) {
	                  if (distPrime[v] == INF) {
	                      System.out.print("INF ");
	                  } else {
	                      int actualDist = distPrime[v] - h[u] + h[v];
	                      System.out.print(actualDist + " ");
	                  }
	              }
	              System.out.println();
	          }
	      }
	      
	      public static void main(String[] args) {
	          int V = 4;
	          List<Edge> edges = new ArrayList<>();
	          edges.add(new Edge(0, 1, -5));
	          edges.add(new Edge(0, 2, 2));
	          edges.add(new Edge(0, 3, 3));
	          edges.add(new Edge(1, 2, 4));
	          edges.add(new Edge(2, 3, 1));
	          
	          johnsonAlgorithm(V, edges);
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  
	  #define INF 1000000000
	  
	  struct Edge {
	      int src, dest, weight;
	  };
	  
	  int bellmanFord(int V, int E, struct Edge* edges, int src, int* h) {
	      for (int i = 0; i < V; i++) h[i] = INF;
	      h[src] = 0;
	      
	      for (int i = 0; i < V; i++) {
	          for (int j = 0; j < E; j++) {
	              int u = edges[j].src;
	              int v = edges[j].dest;
	              int w = edges[j].weight;
	              if (h[u] != INF && h[u] + w < h[v]) {
	                  h[v] = h[u] + w;
	                  if (i == V - 1) return 0; // Negative cycle
	              }
	          }
	      }
	      return 1;
	  }
	  
	  void dijkstra(int V, int u, int* adj_dest, int* adj_weight, int* head, int* next, int* dist) {
	      int* visited = (int*)calloc(V, sizeof(int));
	      for (int i = 0; i < V; i++) dist[i] = INF;
	      dist[u] = 0;
	      
	      for (int i = 0; i < V; i++) {
	          int min_d = INF, min_u = -1;
	          for (int j = 0; j < V; j++) {
	              if (!visited[j] && dist[j] < min_d) {
	                  min_d = dist[j];
	                  min_u = j;
	              }
	          }
	          if (min_u == -1) break;
	          visited[min_u] = 1;
	          
	          for (int e = head[min_u]; e != -1; e = next[e]) {
	              int v = adj_dest[e];
	              int w = adj_weight[e];
	              if (dist[min_u] + w < dist[v]) {
	                  dist[v] = dist[min_u] + w;
	              }
	          }
	      }
	      free(visited);
	  }
	  
	  void johnsonAlgorithm(int V, int E, struct Edge* edges) {
	      int aug_E = E + V;
	      struct Edge* augEdges = (struct Edge*)malloc(aug_E * sizeof(struct Edge));
	      for (int i = 0; i < E; i++) augEdges[i] = edges[i];
	      for (int i = 0; i < V; i++) {
	          augEdges[E + i].src = V;
	          augEdges[E + i].dest = i;
	          augEdges[E + i].weight = 0;
	      }
	      
	      int* h = (int*)malloc((V + 1) * sizeof(int));
	      if (!bellmanFord(V + 1, aug_E, augEdges, V, h)) {
	          printf("Graph contains a negative weight cycle.\n");
	          free(augEdges); free(h); return;
	      }
	      
	      int* head = (int*)malloc(V * sizeof(int));
	      int* next = (int*)malloc(E * sizeof(int));
	      int* adj_dest = (int*)malloc(E * sizeof(int));
	      int* adj_weight = (int*)malloc(E * sizeof(int));
	      
	      for (int i = 0; i < V; i++) head[i] = -1;
	      
	      for (int i = 0; i < E; i++) {
	          int u = edges[i].src;
	          int v = edges[i].dest;
	          int w = edges[i].weight + h[u] - h[v];
	          
	          adj_dest[i] = v;
	          adj_weight[i] = w;
	          next[i] = head[u];
	          head[u] = i;
	      }
	      
	      printf("All-pairs shortest paths:\n");
	      int* dist = (int*)malloc(V * sizeof(int));
	      for (int u = 0; u < V; u++) {
	          dijkstra(V, u, adj_dest, adj_weight, head, next, dist);
	          printf("From %d: ", u);
	          for (int v = 0; v < V; v++) {
	              if (dist[v] == INF) printf("INF ");
	              else printf("%d ", dist[v] - h[u] + h[v]);
	          }
	          printf("\n");
	      }
	      
	      free(augEdges); free(h); free(head); free(next); free(adj_dest); free(adj_weight); free(dist);
	  }
	  
	  int main() {
	      int V = 4, E = 5;
	      struct Edge edges[] = {
	          {0, 1, -5}, {0, 2, 2}, {0, 3, 3},
	          {1, 2, 4}, {2, 3, 1}
	      };
	      johnsonAlgorithm(V, E, edges);
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Johnson's Algorithm
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Are there negative\nedge weights?"}
	      Q -- No --> R1["✅ Use Dijkstra's Algorithm from all nodes\n(Faster and simpler)"]
	      Q -- Yes --> S1{"Is the graph\nDense or Sparse?"}
	      S1 -- Dense (E ≈ V²) --> R2["✅ Use Floyd-Warshall Algorithm\n(O(V³), highly vectorized array operations)"]
	      S1 -- Sparse (E ≈ V) --> R3["✅ Use Johnson's Algorithm\n(O(V² log V), scales better for low edge counts)"]
	  ```
	-
	- ## ✅ Use Johnson's Algorithm When
		- You need **all-pairs shortest paths** in a graph that contains **negative edge weights**.
		- The graph is **sparse** ($E \ll V^2$). Johnson's algorithm capitalizes on $E$ being small via Dijkstra's priority queues.
		- Negative weight cycles must be detected gracefully.
	-
	- ## ❌ Avoid Johnson's Algorithm When
		- The graph has **no negative edge weights** (skip Bellman-Ford reweighting entirely and just run Dijkstra from every node).
		- The graph is **dense** (Floyd-Warshall is easier to write, uses simple array operations, and acts much faster in practice on caches).
-
- # Key Takeaways
  collapsed:: true
	- **Hybrid Approach** — combines Bellman-Ford's robustness to negative weights with Dijkstra's blazing speed.
	- **Telescoping Potential Function** — reweights edges safely such that shortest paths mathematically preserve their topological integrity ($w' = w + h_u - h_v$).
	- **Sparse Superiority** — destroys Floyd-Warshall in time complexity ($O(V^2 \log V)$ vs $O(V^3)$) precisely when the number of edges is limited.
	- **Negative Cycle Guard** — naturally inherits Bellman-Ford's ability to reject graphs containing uncomputable $−\infty$ shortest paths.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Johnson's algorithm for All-pairs shortest paths](https://www.geeksforgeeks.org/johnsons-algorithm/)
		- [TheAlgorithms – Johnson Algorithm (Python)](https://github.com/TheAlgorithms/Python/blob/master/graphs/johnson.py)