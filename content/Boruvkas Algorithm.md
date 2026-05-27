---
seoTitle: Borůvka's Algorithm – Minimum Spanning Tree (MST) for Parallel Processing
description: "Master Boruvka's algorithm, the oldest MST algorithm. Covers component-level greedy choices, O(E log V) complexity, phase reduction, and parallel/distributed computing applications."
keywords: "Boruvka algorithm, Minimum Spanning Tree, MST, Sollin's algorithm, parallel MST, O(E log V), greedy algorithm, graph algorithm, VR-Rathod, Code-Note, Boruvkas Algorithm"
displayTitle: Borůvka's Algorithm
---

> [!info] What is Borůvka's Algorithm?
> **Borůvka's Algorithm** (also known as Sollin's Algorithm) is a greedy algorithm for finding the **Minimum Spanning Tree (MST)** of a graph. It is historically the oldest MST algorithm, discovered by Otakar Borůvka in 1926 to construct an efficient electricity network for Moravia.
> Instead of growing one tree (like Prim) or sorting all edges globally (like Kruskal), Borůvka's algorithm works in **phases**. In each phase, every disjoint connected component simultaneously identifies its cheapest outgoing edge, and all these edges are added to the MST at once.

- # Explanation
  collapsed:: true
	- **The Core Problem:** How can we build an MST efficiently if we are in a distributed system, or if we have thousands of CPU cores available for parallel processing? Kruskal's relies on a strict global sort, and Prim's relies on a sequential priority queue, making them inherently sequential.
	- **The Solution:** Borůvka's algorithm takes a component-based approach. If every individual component simultaneously grabs the absolute cheapest edge connecting it to any other component, no cycles will be formed (assuming all edge weights are distinct) and all those edges are guaranteed to belong to the MST.
	-
	- ## Phase-Based Reduction
	  collapsed:: true
		- The algorithm starts with $V$ individual components (each vertex is its own component).
		- In **Phase 1**, all $V$ components search their incident edges and pick the cheapest one. We add these edges, merging components. The number of components is reduced by at least half (often more).
		- In **Phase 2**, the new larger components again search for their cheapest outgoing edges leading to *other* components. We add them, merging again.
		- Because the number of components halves (or better) with every single phase, the algorithm requires at most $\log_2 V$ phases to merge the entire graph into a single tree.
-
- # How It Works
  collapsed:: true
	- ## Step-by-Step Execution
	  collapsed:: true
		- 1. **Initialize:** Start with an empty MST and treat each vertex as a separate component. Create an array `cheapest[]` to store the minimum weight outgoing edge for each component.
		- 2. **Loop Phases:** While the number of distinct components is greater than 1:
			- Reset the `cheapest[]` array for all components.
			- Iterate through all edges $(u, v, w)$ in the graph:
				- Find the component $c_u$ for vertex $u$ and $c_v$ for vertex $v$.
				- If $c_u \neq c_v$ (the edge connects two different components):
					- If $w$ is cheaper than the current `cheapest[c_u]`, update `cheapest[c_u] = edge`.
					- If $w$ is cheaper than the current `cheapest[c_v]`, update `cheapest[c_v] = edge`.
			- Iterate through all components:
				- If a component has a `cheapest` edge recorded, add that edge to the MST.
				- Merge the two components connected by this edge into one component.
				- Decrease the total component count.
		- 3. **Terminate:** Stop when only 1 component remains.
	-
	- ```mermaid
	  flowchart TD
	      A["Start: V isolated components"] --> B["While components > 1"]
	      B --> C["Reset cheapest[] array"]
	      C --> D["For every edge (u, v, weight):"]
	      D --> E{"Do u and v belong to\ndifferent components?"}
	      E -- No --> F["Ignore edge"]
	      E -- Yes --> G["If weight < cheapest[u_comp],\ncheapest[u_comp] = edge"]
	      G --> H["If weight < cheapest[v_comp],\ncheapest[v_comp] = edge"]
	      F --> I["Finished checking all edges?"]
	      H --> I
	      I -- No --> D
	      I -- Yes --> J["For every component: add its\ncheapest[] edge to MST & Merge"]
	      J --> B
	      B -- False --> K["Done! MST found"]
	  ```
-
- # Complexity Analysis
  collapsed:: true
	- | Step | Time Complexity | Space Complexity |
	  |---|---|---|
	  | **Finding cheapest edges per phase** | $O(E)$ | $O(V)$ (for tracking components/cheapest edges) |
	  | **Number of Phases** | $O(\log V)$ | $O(1)$ |
	  | **Total (Average/Worst)** | **O(E log V)** | **O(V + E)** |
	-
	- ## Parallel Supremacy
	  collapsed:: true
		- While the sequential time complexity is $O(E \log V)$ (the same as Prim/Kruskal on sparse graphs), the $O(E)$ step in each phase can be distributed entirely in parallel. Every CPU core can check different edges simultaneously to find the cheapest outgoing paths.
-
- # Implementation
  collapsed:: true
	- > [!note] Borůvka's Algorithm Implementation
	  > The implementations below use a Disjoint Set Union (DSU) to efficiently group components and identify whether vertices belong to the same component during each phase.
	-
	- :::code-tabs
	  
	  ```python
	  class UnionFind:
	      def __init__(self, n):
	          self.parent = list(range(n))
	          self.rank = [0] * n
	      
	      def find(self, i):
	          if self.parent[i] != i:
	              self.parent[i] = self.find(self.parent[i])
	          return self.parent[i]
	      
	      def union(self, i, j):
	          root_i = self.find(i)
	          root_j = self.find(j)
	          if root_i != root_j:
	              if self.rank[root_i] < self.rank[root_j]:
	                  self.parent[root_i] = root_j
	              elif self.rank[root_i] > self.rank[root_j]:
	                  self.parent[root_j] = root_i
	              else:
	                  self.parent[root_j] = root_i
	                  self.rank[root_i] += 1
	              return True
	          return False
	  
	  def boruvka(n, edges):
	      uf = UnionFind(n)
	      mst = []
	      total_cost = 0
	      num_components = n
	      
	      while num_components > 1:
	          # cheapest stores the index of the cheapest edge for each component
	          cheapest = [-1] * n
	          
	          # Iterate through all edges to find the cheapest outgoing edge for every component
	          for i, (u, v, w) in enumerate(edges):
	              set_u = uf.find(u)
	              set_v = uf.find(v)
	              
	              if set_u != set_v:
	                  if cheapest[set_u] == -1 or edges[cheapest[set_u]][2] > w:
	                      cheapest[set_u] = i
	                  if cheapest[set_v] == -1 or edges[cheapest[set_v]][2] > w:
	                      cheapest[set_v] = i
	                      
	          # Add the cheapest edges to MST
	          for node in range(n):
	              if cheapest[node] != -1:
	                  edge_idx = cheapest[node]
	                  u, v, w = edges[edge_idx]
	                  set_u = uf.find(u)
	                  set_v = uf.find(v)
	                  
	                  if set_u != set_v:
	                      mst.append((u, v, w))
	                      total_cost += w
	                      uf.union(set_u, set_v)
	                      num_components -= 1
	                      
	      return mst, total_cost
	  
	  if __name__ == "__main__":
	      V = 4
	      edges = [
	          (0, 1, 10), (0, 2, 6), (0, 3, 5),
	          (1, 3, 15), (2, 3, 4)
	      ]
	      mst_edges, cost = boruvka(V, edges)
	      print(f"Total MST Cost: {cost}")
	      print("Edges in MST:", mst_edges)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  
	  using namespace std;
	  
	  struct Edge {
	      int u, v, weight;
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
	          return parent[i] = find(parent[i]);
	      }
	      
	      bool unite(int i, int j) {
	          int root_i = find(i);
	          int root_j = find(j);
	          if (root_i != root_j) {
	              if (rank[root_i] < rank[root_j]) parent[root_i] = root_j;
	              else if (rank[root_i] > rank[root_j]) parent[root_j] = root_i;
	              else {
	                  parent[root_j] = root_i;
	                  rank[root_i]++;
	              }
	              return true;
	          }
	          return false;
	      }
	  };
	  
	  void boruvka(int V, const vector<Edge>& edges) {
	      UnionFind uf(V);
	      vector<Edge> mst;
	      int totalCost = 0;
	      int numComponents = V;
	      
	      while (numComponents > 1) {
	          vector<int> cheapest(V, -1);
	          
	          // Find cheapest edges
	          for (int i = 0; i < edges.size(); ++i) {
	              int set_u = uf.find(edges[i].u);
	              int set_v = uf.find(edges[i].v);
	              
	              if (set_u != set_v) {
	                  if (cheapest[set_u] == -1 || edges[cheapest[set_u]].weight > edges[i].weight) {
	                      cheapest[set_u] = i;
	                  }
	                  if (cheapest[set_v] == -1 || edges[cheapest[set_v]].weight > edges[i].weight) {
	                      cheapest[set_v] = i;
	                  }
	              }
	          }
	          
	          // Add edges
	          for (int i = 0; i < V; ++i) {
	              if (cheapest[i] != -1) {
	                  int edge_idx = cheapest[i];
	                  int u = edges[edge_idx].u;
	                  int v = edges[edge_idx].v;
	                  int w = edges[edge_idx].weight;
	                  
	                  int set_u = uf.find(u);
	                  int set_v = uf.find(v);
	                  
	                  if (set_u != set_v) {
	                      mst.push_back(edges[edge_idx]);
	                      totalCost += w;
	                      uf.unite(set_u, set_v);
	                      numComponents--;
	                  }
	              }
	          }
	      }
	      
	      cout << "Total MST Cost: " << totalCost << "\nEdges in MST:\n";
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
	      boruvka(V, edges);
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
	              this.parent[i] = this.find(this.parent[i]);
	          }
	          return this.parent[i];
	      }
	      
	      union(i, j) {
	          const rootI = this.find(i);
	          const rootJ = this.find(j);
	          if (rootI !== rootJ) {
	              if (this.rank[rootI] < this.rank[rootJ]) this.parent[rootI] = rootJ;
	              else if (this.rank[rootI] > this.rank[rootJ]) this.parent[rootJ] = rootI;
	              else {
	                  this.parent[rootJ] = rootI;
	                  this.rank[rootI]++;
	              }
	              return true;
	          }
	          return false;
	      }
	  }
	  
	  function boruvka(V, edges) {
	      const uf = new UnionFind(V);
	      const mst = [];
	      let totalCost = 0;
	      let numComponents = V;
	      
	      while (numComponents > 1) {
	          const cheapest = new Array(V).fill(-1);
	          
	          for (let i = 0; i < edges.length; i++) {
	              const setU = uf.find(edges[i][0]);
	              const setV = uf.find(edges[i][1]);
	              const w = edges[i][2];
	              
	              if (setU !== setV) {
	                  if (cheapest[setU] === -1 || edges[cheapest[setU]][2] > w) {
	                      cheapest[setU] = i;
	                  }
	                  if (cheapest[setV] === -1 || edges[cheapest[setV]][2] > w) {
	                      cheapest[setV] = i;
	                  }
	              }
	          }
	          
	          for (let i = 0; i < V; i++) {
	              if (cheapest[i] !== -1) {
	                  const edgeIdx = cheapest[i];
	                  const [u, v, w] = edges[edgeIdx];
	                  const setU = uf.find(u);
	                  const setV = uf.find(v);
	                  
	                  if (setU !== setV) {
	                      mst.push([u, v, w]);
	                      totalCost += w;
	                      uf.union(setU, setV);
	                      numComponents--;
	                  }
	              }
	          }
	      }
	      
	      console.log(`Total MST Cost: ${totalCost}`);
	      console.log("Edges in MST:", mst);
	  }
	  
	  const V = 4;
	  const edges = [
	      [0, 1, 10], [0, 2, 6], [0, 3, 5],
	      [1, 3, 15], [2, 3, 4]
	  ];
	  boruvka(V, edges);
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  class Edge {
	      int u, v, weight;
	      Edge(int u, int v, int w) { this.u = u; this.v = v; this.weight = w; }
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
	  
	  public class BoruvkaAlgorithm {
	      public static void boruvka(int V, List<Edge> edges) {
	          UnionFind uf = new UnionFind(V);
	          List<Edge> mst = new ArrayList<>();
	          int totalCost = 0;
	          int numComponents = V;
	          
	          while (numComponents > 1) {
	              int[] cheapest = new int[V];
	              Arrays.fill(cheapest, -1);
	              
	              for (int i = 0; i < edges.size(); i++) {
	                  int setU = uf.find(edges.get(i).u);
	                  int setV = uf.find(edges.get(i).v);
	                  
	                  if (setU != setV) {
	                      if (cheapest[setU] == -1 || edges.get(cheapest[setU]).weight > edges.get(i).weight) {
	                          cheapest[setU] = i;
	                      }
	                      if (cheapest[setV] == -1 || edges.get(cheapest[setV]).weight > edges.get(i).weight) {
	                          cheapest[setV] = i;
	                      }
	                  }
	              }
	              
	              for (int i = 0; i < V; i++) {
	                  if (cheapest[i] != -1) {
	                      int edgeIdx = cheapest[i];
	                      Edge e = edges.get(edgeIdx);
	                      int setU = uf.find(e.u);
	                      int setV = uf.find(e.v);
	                      
	                      if (setU != setV) {
	                          mst.add(e);
	                          totalCost += e.weight;
	                          uf.union(setU, setV);
	                          numComponents--;
	                      }
	                  }
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
	          
	          boruvka(V, edges);
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
	  
	  void boruvka(int V, int E, struct Edge* edges) {
	      struct UnionFind* uf = createUF(V);
	      int totalCost = 0;
	      int numComponents = V;
	      
	      int* cheapest = (int*)malloc(V * sizeof(int));
	      
	      printf("Edges in MST:\n");
	      while (numComponents > 1) {
	          for (int i = 0; i < V; i++) cheapest[i] = -1;
	          
	          for (int i = 0; i < E; i++) {
	              int setU = find(uf, edges[i].u);
	              int setV = find(uf, edges[i].v);
	              
	              if (setU != setV) {
	                  if (cheapest[setU] == -1 || edges[cheapest[setU]].weight > edges[i].weight)
	                      cheapest[setU] = i;
	                  if (cheapest[setV] == -1 || edges[cheapest[setV]].weight > edges[i].weight)
	                      cheapest[setV] = i;
	              }
	          }
	          
	          for (int i = 0; i < V; i++) {
	              if (cheapest[i] != -1) {
	                  int edgeIdx = cheapest[i];
	                  int setU = find(uf, edges[edgeIdx].u);
	                  int setV = find(uf, edges[edgeIdx].v);
	                  
	                  if (setU != setV) {
	                      printf("%d - %d : %d\n", edges[edgeIdx].u, edges[edgeIdx].v, edges[edgeIdx].weight);
	                      totalCost += edges[edgeIdx].weight;
	                      unite(uf, setU, setV);
	                      numComponents--;
	                  }
	              }
	          }
	      }
	      printf("Total MST Cost: %d\n", totalCost);
	      
	      free(cheapest);
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
	      boruvka(V, E, edges);
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Borůvka's Algorithm
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Are you running in a\nparallel / distributed computing environment?"}
	      Q -- Yes --> S1{"Do edges have distinct weights?"}
	      S1 -- Yes --> R1["✅ Use Borůvka's Algorithm\n(Scale horizontally with MapReduce/Spark)"]
	      S1 -- No --> R2["⚠️ Apply tie-breaking rules, then use Borůvka's"]
	      Q -- No (Single Threaded) --> R3["❌ Use Kruskal's or Prim's\n(Faster constant factors)"]
	  ```
	-
	- ## ✅ Use Borůvka's Algorithm When
		- You are working in a **Parallel Computing** environment (like Apache Spark, MapReduce, or GPU hardware). Because the cheapest edge for each component is totally independent, this step parallelizes beautifully.
		- Edge weights are distinct (or can be made distinct through tie-breaking using vertex IDs).
	-
	- ## ❌ Avoid Borůvka's Algorithm When
		- Running on standard single-threaded sequential hardware. While mathematically $O(E \log V)$, its constant-factor overhead makes it slightly slower than Kruskal's or Prim's on traditional CPUs.
		- Graph edges have many identical weights and strict tie-breaking logic is not implemented, as simultaneous ties can incorrectly create cyclic references.
-
- # Key Takeaways
  collapsed:: true
	- **The Original MST** — developed in 1926, making it the oldest algorithm for spanning trees, well before computers even existed.
	- **Phase Execution** — operates in discrete rounds, guaranteeing the number of connected components shrinks by at least half every phase.
	- **Parallel Dominance** — easily the best algorithm for distributing graph computation across massive computer clusters.
	- **Logarithmic Bound** — absolutely guarantees the algorithm finishes in $\log_2 V$ phases at most, independent of the graph's structure.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Boruvka's Algorithm](https://www.geeksforgeeks.org/boruvkas-algorithm-greedy-algo-9/)
		- [TheAlgorithms – Boruvka (Python)](https://github.com/TheAlgorithms/Python/blob/master/graphs/boruvka.py)
