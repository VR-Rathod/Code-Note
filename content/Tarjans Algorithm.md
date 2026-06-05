---
seoTitle: Tarjan's Algorithm – Strongly Connected Components (SCC) in One Pass
description: "Master Tarjan's algorithm for finding Strongly Connected Components in a directed graph using a single DFS pass, low-link values, and a recursion stack."
keywords: "Tarjan algorithm, Strongly Connected Components, SCC, DFS, low-link values, graph traversal, O(V+E), algorithm, VR-Rathod, Code-Note, Tarjans Algorithm"
displayTitle: Tarjan's Algorithm
treeTitle: DSA - Graph Algorithms - Tarjans Algorithm
---

> [!info] What is Tarjan's Algorithm?
> **Tarjan's Algorithm** is an elegant, single-pass algorithm used to find all **Strongly Connected Components (SCCs)** in a directed graph.
> Unlike Kosaraju's algorithm which requires two DFS passes and a transposed graph, Tarjan's manages to achieve the same result in a **single depth-first search**. It does this by assigning "ids" and "low-link" values to nodes as they are visited, grouping them into clusters based on back-edges.

- # Explanation
  collapsed:: true
	- **The Core Problem:** How can we identify cyclical clusters (where every node reaches every other node) in one sweep, without needing to copy and reverse the entire graph?
	- **The Solution:** Tarjan's algorithm tracks how deep into the graph a node can reach. If a node discovers a back-edge to an ancestor, it means a cycle exists, and they belong to the same SCC.
	-
	- ## The Concept of `id` and `low-link`
	  collapsed:: true
		- `id`: The time/order in which a node is discovered.
		- `low`: The smallest `id` of any node reachable from this node, including itself.
		- As DFS explores, it assigns `id` and `low`.
		- When a node explores a neighbor that is already on the current DFS stack (a back-edge), it updates its own `low` value to match the neighbor's `id`.
		- After a node finishes exploring all its neighbors, if its `low == id`, it means this node is the "root" of an SCC. Everything currently above it on the stack belongs to its component.
-
- # How It Works
  collapsed:: true
	- ## Step-by-Step Execution
	  collapsed:: true
		- 1. **Initialize:** Maintain a global `id_counter`, an `ids` array, a `low` array, an `on_stack` boolean array, and a `stack` data structure.
		- 2. **Run DFS:** For every unvisited node, run DFS:
			- Assign the current `id_counter` to both `id` and `low`. Increment counter.
			- Push the node to the stack and mark it as `on_stack`.
			- For every neighbor:
				- If unvisited: recursively call DFS, then update `low = min(low, neighbor.low)`.
				- If visited AND `on_stack`: update `low = min(low, neighbor.id)`. (This handles back-edges).
		- 3. **Extract Component:** After exploring all neighbors of a node, if `low == id`:
			- Pop nodes off the stack until the current node is popped.
			- Mark them as no longer `on_stack`.
			- This cluster of popped nodes is one complete SCC.
	-
	- ```mermaid
	  flowchart TD
	      A["Start DFS on unvisited node 'u'"] --> B["u.id = u.low = counter++\nPush u to stack"]
	      B --> C["For each neighbor 'v' of 'u':"]
	      C --> D{"Is 'v' visited?"}
	      D -- No --> E["DFS(v)\nu.low = min(u.low, v.low)"]
	      D -- Yes --> F{"Is 'v' on stack?"}
	      F -- Yes (Back-edge) --> G["u.low = min(u.low, v.id)"]
	      F -- No (Cross-edge) --> H["Ignore"]
	      E --> I["Done with all neighbors?"]
	      G --> I
	      H --> I
	      I -- No --> C
	      I -- Yes --> J{"Does u.low == u.id?"}
	      J -- Yes (Root of SCC) --> K["Pop from stack until 'u' is popped\nGroup forms an SCC"]
	      J -- No --> L["Return to caller"]
	  ```
-
- # Complexity Analysis
  collapsed:: true
	- | Step | Time Complexity | Space Complexity |
	  |---|---|---|
	  | **DFS Traversal** | $O(V + E)$ | $O(V)$ (for Stack, ID arrays) |
	  | **Total (Average/Worst)** | **O(V + E)** | **O(V)** |
	-
	- *Why is it fast?* It strictly processes each node and each edge exactly once, incurring very low overhead compared to multi-pass algorithms.
-
- # Implementation
  collapsed:: true
	- > [!note] Tarjan's SCC Implementation
	  > Uses arrays to track discovery `id`, `low` link values, and a stack to build components dynamically.
	-
	- :::code-tabs
	  
	  ```python
	  from collections import defaultdict
	  
	  class Graph:
	      def __init__(self, vertices):
	          self.V = vertices
	          self.graph = defaultdict(list)
	          self.Time = 0
	          
	      def add_edge(self, u, v):
	          self.graph[u].append(v)
	          
	      def scc_util(self, u, low, disc, stackMember, st, all_sccs):
	          disc[u] = self.Time
	          low[u] = self.Time
	          self.Time += 1
	          stackMember[u] = True
	          st.append(u)
	          
	          for v in self.graph[u]:
	              if disc[v] == -1:
	                  self.scc_util(v, low, disc, stackMember, st, all_sccs)
	                  low[u] = min(low[u], low[v])
	              elif stackMember[v] == True:
	                  low[u] = min(low[u], disc[v])
	                  
	          if low[u] == disc[u]:
	              scc = []
	              while True:
	                  w = st.pop()
	                  stackMember[w] = False
	                  scc.append(w)
	                  if w == u:
	                      break
	              all_sccs.append(scc)
	              
	      def tarjan_scc(self):
	          disc = [-1] * self.V
	          low = [-1] * self.V
	          stackMember = [False] * self.V
	          st = []
	          all_sccs = []
	          
	          for i in range(self.V):
	              if disc[i] == -1:
	                  self.scc_util(i, low, disc, stackMember, st, all_sccs)
	                  
	          return all_sccs
	  
	  if __name__ == "__main__":
	      g = Graph(5)
	      g.add_edge(1, 0)
	      g.add_edge(0, 2)
	      g.add_edge(2, 1)
	      g.add_edge(0, 3)
	      g.add_edge(3, 4)
	      
	      print("Tarjan's Strongly Connected Components:")
	      for scc in g.tarjan_scc():
	          print(scc)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <stack>
	  #include <algorithm>
	  
	  using namespace std;
	  
	  class Graph {
	      int V;
	      vector<vector<int>> adj;
	      int time;
	  
	      void SCCUtil(int u, vector<int>& disc, vector<int>& low, stack<int>& st, vector<bool>& stackMember) {
	          disc[u] = low[u] = ++time;
	          st.push(u);
	          stackMember[u] = true;
	  
	          for (int v : adj[u]) {
	              if (disc[v] == -1) {
	                  SCCUtil(v, disc, low, st, stackMember);
	                  low[u] = min(low[u], low[v]);
	              } else if (stackMember[v]) {
	                  low[u] = min(low[u], disc[v]);
	              }
	          }
	  
	          if (low[u] == disc[u]) {
	              cout << "SCC: ";
	              while (true) {
	                  int w = st.top();
	                  st.pop();
	                  stackMember[w] = false;
	                  cout << w << " ";
	                  if (w == u) break;
	              }
	              cout << "\n";
	          }
	      }
	  
	  public:
	      Graph(int V) {
	          this->V = V;
	          adj.resize(V);
	          time = 0;
	      }
	  
	      void addEdge(int u, int v) {
	          adj[u].push_back(v);
	      }
	  
	      void tarjanSCC() {
	          vector<int> disc(V, -1);
	          vector<int> low(V, -1);
	          vector<bool> stackMember(V, false);
	          stack<int> st;
	  
	          for (int i = 0; i < V; i++) {
	              if (disc[i] == -1) {
	                  SCCUtil(i, disc, low, st, stackMember);
	              }
	          }
	      }
	  };
	  
	  int main() {
	      Graph g(5);
	      g.addEdge(1, 0);
	      g.addEdge(0, 2);
	      g.addEdge(2, 1);
	      g.addEdge(0, 3);
	      g.addEdge(3, 4);
	      
	      cout << "Tarjan's Strongly Connected Components:\n";
	      g.tarjanSCC();
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class Graph {
	      constructor(v) {
	          this.V = v;
	          this.adj = Array.from({length: v}, () => []);
	          this.time = 0;
	      }
	      
	      addEdge(u, v) {
	          this.adj[u].push(v);
	      }
	      
	      SCCUtil(u, disc, low, st, stackMember) {
	          disc[u] = low[u] = ++this.time;
	          st.push(u);
	          stackMember[u] = true;
	          
	          for (let v of this.adj[u]) {
	              if (disc[v] === -1) {
	                  this.SCCUtil(v, disc, low, st, stackMember);
	                  low[u] = Math.min(low[u], low[v]);
	              } else if (stackMember[v]) {
	                  low[u] = Math.min(low[u], disc[v]);
	              }
	          }
	          
	          if (low[u] === disc[u]) {
	              let scc = [];
	              while (true) {
	                  let w = st.pop();
	                  stackMember[w] = false;
	                  scc.push(w);
	                  if (w === u) break;
	              }
	              console.log(scc.join(" "));
	          }
	      }
	      
	      tarjanSCC() {
	          let disc = new Array(this.V).fill(-1);
	          let low = new Array(this.V).fill(-1);
	          let stackMember = new Array(this.V).fill(false);
	          let st = [];
	          
	          for (let i = 0; i < this.V; i++) {
	              if (disc[i] === -1) {
	                  this.SCCUtil(i, disc, low, st, stackMember);
	              }
	          }
	      }
	  }
	  
	  let g = new Graph(5);
	  g.addEdge(1, 0);
	  g.addEdge(0, 2);
	  g.addEdge(2, 1);
	  g.addEdge(0, 3);
	  g.addEdge(3, 4);
	  
	  console.log("Tarjan's Strongly Connected Components:");
	  g.tarjanSCC();
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  class Graph {
	      private int V;
	      private List<Integer>[] adj;
	      private int time;
	      
	      Graph(int v) {
	          V = v;
	          adj = new ArrayList[v];
	          for (int i = 0; i < v; ++i)
	              adj[i] = new ArrayList<>();
	          time = 0;
	      }
	      
	      void addEdge(int u, int v) {
	          adj[u].add(v);
	      }
	      
	      void SCCUtil(int u, int disc[], int low[], Stack<Integer> st, boolean stackMember[]) {
	          disc[u] = low[u] = ++time;
	          st.push(u);
	          stackMember[u] = true;
	          
	          for (int v : adj[u]) {
	              if (disc[v] == -1) {
	                  SCCUtil(v, disc, low, st, stackMember);
	                  low[u] = Math.min(low[u], low[v]);
	              } else if (stackMember[v]) {
	                  low[u] = Math.min(low[u], disc[v]);
	              }
	          }
	          
	          if (low[u] == disc[u]) {
	              System.out.print("SCC: ");
	              while (true) {
	                  int w = st.pop();
	                  stackMember[w] = false;
	                  System.out.print(w + " ");
	                  if (w == u) break;
	              }
	              System.out.println();
	          }
	      }
	      
	      void tarjanSCC() {
	          int[] disc = new int[V];
	          int[] low = new int[V];
	          boolean[] stackMember = new boolean[V];
	          Arrays.fill(disc, -1);
	          Arrays.fill(low, -1);
	          Stack<Integer> st = new Stack<>();
	          
	          for (int i = 0; i < V; i++) {
	              if (disc[i] == -1)
	                  SCCUtil(i, disc, low, st, stackMember);
	          }
	      }
	      
	      public static void main(String args[]) {
	          Graph g = new Graph(5);
	          g.addEdge(1, 0);
	          g.addEdge(0, 2);
	          g.addEdge(2, 1);
	          g.addEdge(0, 3);
	          g.addEdge(3, 4);
	          
	          System.out.println("Tarjan's Strongly Connected Components:");
	          g.tarjanSCC();
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  
	  #define min(a,b) ((a)<(b)?(a):(b))
	  
	  typedef struct Node {
	      int vertex;
	      struct Node* next;
	  } Node;
	  
	  typedef struct Graph {
	      int V;
	      Node** adj;
	  } Graph;
	  
	  Graph* createGraph(int V) {
	      Graph* graph = (Graph*)malloc(sizeof(Graph));
	      graph->V = V;
	      graph->adj = (Node**)malloc(V * sizeof(Node*));
	      for (int i = 0; i < V; i++) graph->adj[i] = NULL;
	      return graph;
	  }
	  
	  void addEdge(Graph* graph, int u, int v) {
	      Node* newNode = (Node*)malloc(sizeof(Node));
	      newNode->vertex = v;
	      newNode->next = graph->adj[u];
	      graph->adj[u] = newNode;
	  }
	  
	  void SCCUtil(Graph* graph, int u, int* disc, int* low, int* stack, int* top, int* stackMember, int* time) {
	      disc[u] = low[u] = ++(*time);
	      stack[++(*top)] = u;
	      stackMember[u] = 1;
	  
	      Node* temp = graph->adj[u];
	      while (temp != NULL) {
	          int v = temp->vertex;
	          if (disc[v] == -1) {
	              SCCUtil(graph, v, disc, low, stack, top, stackMember, time);
	              low[u] = min(low[u], low[v]);
	          } else if (stackMember[v]) {
	              low[u] = min(low[u], disc[v]);
	          }
	          temp = temp->next;
	      }
	  
	      if (low[u] == disc[u]) {
	          printf("SCC: ");
	          while (1) {
	              int w = stack[(*top)--];
	              stackMember[w] = 0;
	              printf("%d ", w);
	              if (w == u) break;
	          }
	          printf("\n");
	      }
	  }
	  
	  void tarjanSCC(Graph* graph) {
	      int V = graph->V;
	      int* disc = (int*)malloc(V * sizeof(int));
	      int* low = (int*)malloc(V * sizeof(int));
	      int* stackMember = (int*)calloc(V, sizeof(int));
	      int* stack = (int*)malloc(V * sizeof(int));
	      int top = -1;
	      int time = 0;
	  
	      for (int i = 0; i < V; i++) {
	          disc[i] = -1;
	          low[i] = -1;
	      }
	  
	      for (int i = 0; i < V; i++) {
	          if (disc[i] == -1) {
	              SCCUtil(graph, i, disc, low, stack, &top, stackMember, &time);
	          }
	      }
	      
	      free(disc); free(low); free(stackMember); free(stack);
	  }
	  
	  int main() {
	      Graph* g = createGraph(5);
	      addEdge(g, 1, 0);
	      addEdge(g, 0, 2);
	      addEdge(g, 2, 1);
	      addEdge(g, 0, 3);
	      addEdge(g, 3, 4);
	      
	      printf("Tarjan's Strongly Connected Components:\n");
	      tarjanSCC(g);
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Tarjan's Algorithm
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Need to find SCCs\nin a directed graph?"}
	      Q -- Yes --> S1{"Is memory optimization critical\n(no graph copies allowed)?"}
	      S1 -- Yes --> R1["✅ Use Tarjan's Algorithm\n(1 Pass, No Transpose required)"]
	      S1 -- No --> R2["✅ Use Kosaraju's Algorithm\n(Easier to write from memory)"]
	  ```
	-
	- ## ✅ Use Tarjan's Algorithm When
		- You want the **theoretically optimal** constant factors for finding SCCs. By running only 1 pass instead of 2 (plus a transpose operation), it operates faster in real-world benchmarks due to fewer cache misses.
		- Memory is tight. Avoiding the construction of $G^T$ saves $O(V + E)$ extra memory.
	-
	- ## ❌ Avoid Tarjan's Algorithm When
		- You are in an interview and are prone to making mistakes managing `id`, `low`, and stack constraints. Kosaraju's two simple DFS loops are much harder to mess up.
-
- # Key Takeaways
  collapsed:: true
	- **Single Pass** — accomplishes in one pass what Kosaraju does in two.
	- **Low-Link Value** — the `low` array serves as a mathematical breadcrumb trail, collapsing loops into single root values.
	- **Dynamic Stack Management** — elements are kept on the stack exactly until their SCC root determines they have nowhere else to expand, perfectly segmenting the components.
	- **Cache Friendly** — traverses memory sequentially in one run, making it the industry standard for SCC extraction in compilers and analysis tools.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Tarjan's Algorithm to find SCC](https://www.geeksforgeeks.org/tarjan-algorithm-find-strongly-connected-components/)
		- [TheAlgorithms – Tarjan (Python)](https://github.com/TheAlgorithms/Python/blob/master/graphs/tarjans_scc.py)