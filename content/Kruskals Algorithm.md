---
seoTitle: Kruskal's Algorithm – Minimum Spanning Tree (MST) using Union-Find
description: "Master Kruskal's Algorithm for finding the Minimum Spanning Tree (MST). Covers Disjoint Set Union (DSU), greedy sorting, complexity analysis, and implementations in Python, C++, JavaScript, Java, and C."
keywords: "Kruskal algorithm, Minimum Spanning Tree, MST, Union-Find, Disjoint Set, DSU, greedy algorithm, O(E log E), time complexity, graph algorithm, VR-Rathod, Code-Note"
displayTitle: Kruskal's Algorithm
---

> [!info] What is Kruskal's Algorithm?
> **Kruskal's Algorithm** is a greedy algorithm used to find the **Minimum Spanning Tree (MST)** of a connected, undirected, weighted graph.
> It works by sorting all the edges in the graph in ascending order of their weights, and then repeatedly adding the smallest edge to the MST as long as it does not form a cycle. To efficiently detect cycles, it utilizes the **Disjoint Set Union (DSU) / Union-Find** data structure.

- # Explanation
  collapsed:: true
	- **The Core Problem:** Given a network of nodes (e.g., cities) and weighted connections between them (e.g., cost of building roads), how do we connect all nodes such that the total cost is minimized and there are no redundant loops? This is the Minimum Spanning Tree problem.
	- **The Solution:** Kruskal's algorithm solves this by always being perfectly greedy. It looks at the cheapest possible connection available anywhere in the entire graph and builds it, provided that the connection actually connects two previously disconnected groups.
	-
	- ## Disjoint Set Union (DSU) Integration
	  collapsed:: true
		- The most critical challenge in Kruskal's is knowing whether adding an edge will create a cycle.
		- If an edge connects two nodes that are already in the same connected component, adding it creates a cycle.
		- A **Disjoint Set Union (DSU)** data structure perfectly models this:
			- `Find(x)`: Returns the representative or "root" of the set containing `x`. If `Find(u) == Find(v)`, they are in the same component.
			- `Union(u, v)`: Merges the sets containing `u` and `v` into a single connected component.
		- By using **Path Compression** and **Union by Rank**, DSU operations run in nearly $O(1)$ time (specifically, Inverse Ackermann function $O(\alpha(V))$).
-
- # How It Works
  collapsed:: true
	- ## Step-by-Step Execution
	  collapsed:: true
		- 1. **Initialize:** Create an empty list to store the MST edges. Initialize a Disjoint Set for all $V$ vertices so that each vertex is initially its own separate component.
		- 2. **Sort:** Sort all $E$ edges in the graph in ascending order based on their weights.
		- 3. **Iterate:** Loop through the sorted edges one by one:
			- For the current edge $(u, v)$ with weight $w$:
			- Check if $u$ and $v$ belong to the same set using `Find(u)` and `Find(v)`.
			- If they are in **different** sets, adding the edge will not form a cycle. Add $(u, v)$ to the MST and merge their sets using `Union(u, v)`.
			- If they are in the **same** set, adding the edge forms a cycle. Discard the edge.
		- 4. **Terminate:** Stop when exactly $V - 1$ edges have been added to the MST (since a spanning tree of $V$ nodes always has exactly $V - 1$ edges).
	-
	- ```mermaid
	  flowchart TD
	      A["Start: Graph G(V, E)"] --> B["Initialize DSU with V isolated sets"]
	      B --> C["Sort all edges by ascending weight"]
	      C --> D["Pick next smallest edge (u, v)"]
	      D --> E{"Are Find(u) and\nFind(v) equal?"}
	      E -- Yes (Cycle) --> F["Discard Edge"]
	      E -- No (Different Sets) --> G["Add edge to MST\nUnion(u, v)"]
	      F --> H{"MST has V-1 edges?"}
	      G --> H
	      H -- No --> D
	      H -- Yes --> I["Done! Minimum Spanning Tree found"]
	  ```
-
- # Complexity Analysis
  collapsed:: true
	- | Step | Time Complexity | Space Complexity |
	  |---|---|---|
	  | **Sorting Edges** | $O(E \log E)$ | $O(E)$ (for sorting/storing edges) |
	  | **DSU Initialization** | $O(V)$ | $O(V)$ (for parent/rank arrays) |
	  | **Iterating Edges (Union-Find)** | $O(E \cdot \alpha(V))$ | $O(1)$ |
	  | **Total (Average/Worst)** | **O(E log E) or O(E log V)** | **O(V + E)** |
	-
	- *Note: Since $E \le V^2$, it follows that $\log E \le \log(V^2) = 2 \log V$. Therefore, $O(E \log E)$ is mathematically equivalent to $O(E \log V)$.*
-
- # Implementation
  collapsed:: true
	- > [!note] Kruskal's MST Algorithm Implementation
	  > The code below defines a `UnionFind` struct/class with Path Compression and Union by Rank, sorts the edges, and greedily constructs the Minimum Spanning Tree.
	-
	- :::code-tabs
	  
	  ```python
	  class UnionFind:
	      def __init__(self, n):
	          self.parent = list(range(n))
	          self.rank = [0] * n
	      
	      def find(self, u):
	          if self.parent[u] != u:
	              # Path compression
	              self.parent[u] = self.find(self.parent[u])
	          return self.parent[u]
	      
	      def union(self, u, v):
	          root_u = self.find(u)
	          root_v = self.find(v)
	          
	          if root_u != root_v:
	              # Union by rank
	              if self.rank[root_u] > self.rank[root_v]:
	                  self.parent[root_v] = root_u
	              elif self.rank[root_u] < self.rank[root_v]:
	                  self.parent[root_u] = root_v
	              else:
	                  self.parent[root_v] = root_u
	                  self.rank[root_u] += 1
	              return True
	          return False
	  
	  def kruskal(n, edges):
	      uf = UnionFind(n)
	      mst = []
	      total_cost = 0
	      
	      # Sort edges ascending by weight
	      edges.sort(key=lambda x: x[2])
	      
	      for u, v, w in edges:
	          if uf.union(u, v):
	              mst.append((u, v, w))
	              total_cost += w
	              # Early stopping: spanning tree has exactly V-1 edges
	              if len(mst) == n - 1:
	                  break
	                  
	      return mst, total_cost
	  
	  if __name__ == "__main__":
	      V = 4
	      edges = [
	          (0, 1, 10),
	          (0, 2, 6),
	          (0, 3, 5),
	          (1, 3, 15),
	          (2, 3, 4)
	      ]
	      
	      mst_edges, cost = kruskal(V, edges)
	      print(f"Total MST Cost: {cost}")
	      print("Edges in MST:", mst_edges)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  using namespace std;
	  
	  struct Edge {
	      int u, v, weight;
	      bool operator<(const Edge& other) const {
	          return weight < other.weight;
	      }
	  };
	  
	  class UnionFind {
	  private:
	      vector<int> parent, rank;
	  public:
	      UnionFind(int n) {
	          parent.resize(n);
	          rank.assign(n, 0);
	          for (int i = 0; i < n; ++i) parent[i] = i;
	      }
	      
	      int find(int i) {
	          if (parent[i] == i) return i;
	          return parent[i] = find(parent[i]); // Path compression
	      }
	      
	      bool unite(int i, int j) {
	          int root_i = find(i);
	          int root_j = find(j);
	          if (root_i != root_j) {
	              // Union by rank
	              if (rank[root_i] < rank[root_j]) {
	                  parent[root_i] = root_j;
	              } else if (rank[root_i] > rank[root_j]) {
	                  parent[root_j] = root_i;
	              } else {
	                  parent[root_j] = root_i;
	                  rank[root_i]++;
	              }
	              return true;
	          }
	          return false;
	      }
	  };
	  
	  void kruskal(int n, vector<Edge>& edges) {
	      sort(edges.begin(), edges.end()); // O(E log E)
	      
	      UnionFind uf(n);
	      vector<Edge> mst;
	      int total_cost = 0;
	      
	      for (const auto& edge : edges) {
	          if (uf.unite(edge.u, edge.v)) {
	              mst.push_back(edge);
	              total_cost += edge.weight;
	              if (mst.size() == n - 1) break; // Early stopping
	          }
	      }
	      
	      cout << "Total MST Cost: " << total_cost << "\nEdges in MST:\n";
	      for (const auto& e : mst) {
	          cout << e.u << " - " << e.v << " : " << e.weight << "\n";
	      }
	  }
	  
	  int main() {
	      int V = 4;
	      vector<Edge> edges = {
	          {0, 1, 10}, {0, 2, 6}, {0, 3, 5},
	          {1, 3, 15}, {2, 3, 4}
	      };
	      kruskal(V, edges);
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class UnionFind {
	      constructor(n) {
	          this.parent = Array.from({length: n}, (_, i) => i);
	          this.rank = new Array(n).fill(0);
	      }
	      
	      find(i) {
	          if (this.parent[i] !== i) {
	              this.parent[i] = this.find(this.parent[i]); // Path compression
	          }
	          return this.parent[i];
	      }
	      
	      union(i, j) {
	          const rootI = this.find(i);
	          const rootJ = this.find(j);
	          
	          if (rootI !== rootJ) {
	              if (this.rank[rootI] < this.rank[rootJ]) {
	                  this.parent[rootI] = rootJ;
	              } else if (this.rank[rootI] > this.rank[rootJ]) {
	                  this.parent[rootJ] = rootI;
	              } else {
	                  this.parent[rootJ] = rootI;
	                  this.rank[rootI]++;
	              }
	              return true;
	          }
	          return false;
	      }
	  }
	  
	  function kruskal(n, edges) {
	      edges.sort((a, b) => a.weight - b.weight); // Sort edges by weight
	      
	      const uf = new UnionFind(n);
	      const mst = [];
	      let totalCost = 0;
	      
	      for (const {u, v, weight} of edges) {
	          if (uf.union(u, v)) {
	              mst.push({u, v, weight});
	              totalCost += weight;
	              if (mst.length === n - 1) break;
	          }
	      }
	      
	      console.log(`Total MST Cost: ${totalCost}`);
	      console.log("Edges in MST:", mst);
	  }
	  
	  const V = 4;
	  const edges = [
	      {u: 0, v: 1, weight: 10},
	      {u: 0, v: 2, weight: 6},
	      {u: 0, v: 3, weight: 5},
	      {u: 1, v: 3, weight: 15},
	      {u: 2, v: 3, weight: 4}
	  ];
	  
	  kruskal(V, edges);
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  class Edge implements Comparable<Edge> {
	      int u, v, weight;
	      Edge(int u, int v, int w) { this.u = u; this.v = v; this.weight = w; }
	      public int compareTo(Edge other) {
	          return Integer.compare(this.weight, other.weight);
	      }
	  }
	  
	  class UnionFind {
	      int[] parent, rank;
	      UnionFind(int n) {
	          parent = new int[n];
	          rank = new int[n];
	          for (int i = 0; i < n; i++) parent[i] = i;
	      }
	      
	      int find(int i) {
	          if (parent[i] == i) return i;
	          return parent[i] = find(parent[i]);
	      }
	      
	      boolean union(int i, int j) {
	          int rootI = find(i);
	          int rootJ = find(j);
	          if (rootI != rootJ) {
	              if (rank[rootI] < rank[rootJ]) parent[rootI] = rootJ;
	              else if (rank[rootI] > rank[rootJ]) parent[rootJ] = rootI;
	              else {
	                  parent[rootJ] = rootI;
	                  rank[rootI]++;
	              }
	              return true;
	          }
	          return false;
	      }
	  }
	  
	  public class KruskalAlgorithm {
	      public static void kruskal(int n, List<Edge> edges) {
	          Collections.sort(edges);
	          
	          UnionFind uf = new UnionFind(n);
	          List<Edge> mst = new ArrayList<>();
	          int totalCost = 0;
	          
	          for (Edge e : edges) {
	              if (uf.union(e.u, e.v)) {
	                  mst.add(e);
	                  totalCost += e.weight;
	                  if (mst.size() == n - 1) break;
	              }
	          }
	          
	          System.out.println("Total MST Cost: " + totalCost);
	          System.out.println("Edges in MST:");
	          for (Edge e : mst) {
	              System.out.println(e.u + " - " + e.v + " : " + e.weight);
	          }
	      }
	      
	      public static void main(String[] args) {
	          int V = 4;
	          List<Edge> edges = new ArrayList<>();
	          edges.add(new Edge(0, 1, 10));
	          edges.add(new Edge(0, 2, 6));
	          edges.add(new Edge(0, 3, 5));
	          edges.add(new Edge(1, 3, 15));
	          edges.add(new Edge(2, 3, 4));
	          
	          kruskal(V, edges);
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  
	  struct Edge {
	      int u, v, weight;
	  };
	  
	  struct UnionFind {
	      int *parent, *rank;
	  };
	  
	  struct UnionFind* createUF(int n) {
	      struct UnionFind* uf = (struct UnionFind*)malloc(sizeof(struct UnionFind));
	      uf->parent = (int*)malloc(n * sizeof(int));
	      uf->rank = (int*)calloc(n, sizeof(int));
	      for (int i = 0; i < n; i++) uf->parent[i] = i;
	      return uf;
	  }
	  
	  int find(struct UnionFind* uf, int i) {
	      if (uf->parent[i] == i) return i;
	      return uf->parent[i] = find(uf, uf->parent[i]);
	  }
	  
	  int unite(struct UnionFind* uf, int i, int j) {
	      int rootI = find(uf, i);
	      int rootJ = find(uf, j);
	      if (rootI != rootJ) {
	          if (uf->rank[rootI] < uf->rank[rootJ]) uf->parent[rootI] = rootJ;
	          else if (uf->rank[rootI] > uf->rank[rootJ]) uf->parent[rootJ] = rootI;
	          else {
	              uf->parent[rootJ] = rootI;
	              uf->rank[rootI]++;
	          }
	          return 1;
	      }
	      return 0;
	  }
	  
	  int compareEdges(const void* a, const void* b) {
	      return ((struct Edge*)a)->weight - ((struct Edge*)b)->weight;
	  }
	  
	  void kruskal(int n, int e, struct Edge* edges) {
	      qsort(edges, e, sizeof(struct Edge), compareEdges);
	      
	      struct UnionFind* uf = createUF(n);
	      int totalCost = 0;
	      int edgesAdded = 0;
	      
	      printf("Edges in MST:\n");
	      for (int i = 0; i < e; i++) {
	          if (unite(uf, edges[i].u, edges[i].v)) {
	              printf("%d - %d : %d\n", edges[i].u, edges[i].v, edges[i].weight);
	              totalCost += edges[i].weight;
	              edgesAdded++;
	              if (edgesAdded == n - 1) break;
	          }
	      }
	      printf("Total MST Cost: %d\n", totalCost);
	      
	      free(uf->parent);
	      free(uf->rank);
	      free(uf);
	  }
	  
	  int main() {
	      int V = 4, E = 5;
	      struct Edge edges[] = {
	          {0, 1, 10}, {0, 2, 6}, {0, 3, 5},
	          {1, 3, 15}, {2, 3, 4}
	      };
	      kruskal(V, E, edges);
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Kruskal's Algorithm
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Is the graph Dense or Sparse?"}
	      Q -- Sparse (E ≈ V) --> R1["✅ Use Kruskal's Algorithm\n(Sorting O(E log E) is fast here)"]
	      Q -- Dense (E ≈ V²) --> S1{"Are edges already sorted\nby weight?"}
	      S1 -- Yes --> R2["✅ Use Kruskal's Algorithm\n(Skips sorting cost)"]
	      S1 -- No --> R3["✅ Consider Prim's Algorithm\n(O(V²), avoids sorting V² edges)"]
	  ```
	-
	- ## ✅ Use Kruskal's Algorithm When
		- The graph is **sparse** ($E \ll V^2$). Since Kruskal revolves around sorting edges, fewer edges means a massive speed advantage.
		- The edges are **already sorted** or easily sortable (e.g., using linear Counting/Radix sort if edge weights are small).
		- You need to run computations iteratively across completely disconnected sets (a "Forest" of trees) that slowly merge.
	-
	- ## ❌ Avoid Kruskal's Algorithm When
		- The graph is extremely **dense** ($E \approx V^2$). Sorting $V^2$ edges takes $O(V^2 \log V)$, whereas Prim's algorithm using a simple array can solve Dense MSTs in $O(V^2)$.
-
- # Key Takeaways
  collapsed:: true
	- **Global Greed** — unlike Prim's which grows a single tree locally, Kruskal's evaluates all edges globally, building a "forest" that merges into a single tree.
	- **DSU is Mandatory** — detecting cycles on-the-fly would be $O(V)$ via DFS/BFS, taking total time to $O(EV)$. DSU compresses this to near $O(1)$ per edge check.
	- **Sorting Bottleneck** — the absolute limiting factor for Kruskal's algorithm is the edge sorting phase ($O(E \log E)$).
	- **Early Exit** — the algorithm intelligently stops the instant $V - 1$ edges are secured, skipping evaluation of remaining edges.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Kruskal's Minimum Spanning Tree Algorithm](https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/)
		- [TheAlgorithms – Kruskal (Python)](https://github.com/TheAlgorithms/Python/blob/master/graphs/kruskal.py)