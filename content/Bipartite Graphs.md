---
date: 2026-05-25T11:36:10+05:30
lastmod: 2026-05-25T11:36:10+05:30

seoTitle: Bipartite Graphs Complete Guide – Definition, Detection, and Algorithms
description: "A comprehensive guide to Bipartite Graphs. Learn how to detect bipartite graphs using BFS/DFS 2-coloring, characterization by odd-length cycles, and applications."
keywords: "bipartite graph, 2-coloring, odd-length cycle, graph coloring, graph bipartite check, BFS 2-coloring, DFS bipartite, VR-Rathod, Code-Note, code note vr, vr book"
---

> [!info] What is a Bipartite Graph?
> A **Bipartite Graph** (or bigraph) is a graph whose vertices can be divided into two disjoint and independent sets $U$ and $V$ such that every edge connects a vertex in $U$ to one in $V$.
> In other words, no two vertices within the same set are adjacent. It is 2-colorable and contains no odd-length cycles.

- # Explanation
  - Bipartite graphs are fundamental in computer science, especially for modeling relationship networks between two different classes of objects. A key mathematical property is that **a graph is bipartite if and only if it contains no odd-length cycles**.
  -
  - ## Real-World Analogy
    - **Job Applicants & Job Openings (Matching)**: An applicant can apply for jobs, but applicants do not connect to other applicants, and job openings do not connect to other job openings.
    - **Actors & Movies (Bipartite Network)**: An actor acts in a movie. An actor does not connect directly to another actor, and a movie does not connect directly to another movie.
    - **Users & Products (Recommendation Systems)**: Users rate products. Connections only exist between users and products, never between users themselves or products themselves.
-
- # How It Works
  collapsed:: true
  - ## Core Mechanics
    - Checking if a graph is bipartite is equivalent to checking if it is 2-colorable.
    - We traverse the graph using Breadth-First Search (BFS) or Depth-First Search (DFS) and color each uncolored node with a starting color (e.g., `0`).
    - For each visited node, color all its adjacent unvisited neighbors with the opposite color (`1 - current_color`).
    - If an adjacent neighbor is already colored and has the same color as the current node, the graph contains an odd-length cycle and is not bipartite.
    - Since graphs can be disconnected, we must run this coloring check for all components by looping over all vertices.
  -
  - ## BFS vs DFS Bipartiteness Check
    - Both BFS and DFS can check bipartiteness in $O(V + E)$ time.
    - **BFS Approach**: Explores level-by-level, making it intuitive for layering colors.
    - **DFS Approach**: Explores paths deeply and backtracks, which is equally efficient but uses call stack memory instead of a queue.
  -
  - ## Visual Walkthrough
    - ### 1. Bipartite Graph (Square: 0-1-2-3-0)
      - ```
          0(Color A) ----- 1(Color B)
          |                |
          |                |
          3(Color B) ----- 2(Color A)
        ```
      - **Color Assignment Process**:
        1. Start BFS at `0`, color it **A**.
        2. Neighbors of `0` are `1` and `3`. Color both **B**.
        3. Dequeue `1`. Neighbor `2` is uncolored; color it **A**. Neighbor `0` is already colored **A** (no conflict).
        4. Dequeue `3`. Neighbor `2` is already colored **A** (no conflict). Neighbor `0` is already colored **A** (no conflict).
        5. Dequeue `2`. All neighbors colored. BFS ends.
        6. The partition is $U = \{0, 2\}$ and $V = \{1, 3\}$. Valid!
    -
    - ### 2. Non-Bipartite Graph (Triangle: 0-1-2-0)
      - ```
          0(Color A) ----- 1(Color B)
           \              /
            \            /
             2(Color B / Conflict!)
        ```
      - **Color Assignment Process**:
        1. Start BFS at `0`, color it **A**.
        2. Neighbors of `0` are `1` and `2`. Color both **B**.
        3. Dequeue `1`. Neighbor `2` is already colored **B**. But `1` is also colored **B**!
        4. **Conflict**: Neighbor `2` has the same color as current node `1`. Bipartiteness fails because an odd cycle ($0 \to 1 \to 2 \to 0$) of length 3 exists.
-
- # Time & Space Complexity
  collapsed:: true
  - | Algorithm / Representation | Time Complexity | Space Complexity |
    |---|---|---|
    | **BFS Bipartite Check (Adjacency List)** | $O(V + E)$ | $O(V)$ |
    | **DFS Bipartite Check (Adjacency List)** | $O(V + E)$ | $O(V)$ |
  - *Note: $V$ is the number of vertices, and $E$ is the number of edges. Space is used for the color tracking array and the BFS queue or DFS recursion stack.*
-
- # Implementation
  collapsed:: true
  - :::code-tabs
    
    ```python
    from collections import deque

    def is_bipartite(V, adj):
        """
        Determines if a graph represented as an adjacency list is bipartite.
        Handles disconnected graphs.
        
        Colors:
        -1 : Uncolored
         0 : Color A
         1 : Color B
        """
        color = [-1] * V

        for start in range(V):
            if color[start] == -1:
                # Start BFS for this component
                color[start] = 0
                queue = deque([start])

                while queue:
                    u = queue.popleft()

                    for v in adj[u]:
                        if color[v] == -1:
                            # Color neighbor with the opposite color
                            color[v] = 1 - color[u]
                            queue.append(v)
                        elif color[v] == color[u]:
                            # Conflict detected: adjacent nodes share the same color
                            return False
        return True

    # Example Usage
    if __name__ == "__main__":
        # Bipartite Graph (Square: 0-1-2-3-0)
        V1 = 4
        adj1 = [
            [1, 3], # 0
            [0, 2], # 1
            [1, 3], # 2
            [0, 2]  # 3
        ]
        print(f"Graph 1 Bipartite? {is_bipartite(V1, adj1)}") # Output: True

        # Non-Bipartite Graph (Triangle: 0-1-2-0)
        V2 = 3
        adj2 = [
            [1, 2], # 0
            [0, 2], # 1
            [0, 1]  # 2
        ]
        print(f"Graph 2 Bipartite? {is_bipartite(V2, adj2)}") # Output: False
    ```

    ```cpp
    #include <iostream>
    #include <vector>
    #include <queue>

    class BipartiteChecker {
    public:
        /**
         * Determines if a graph is bipartite.
         * Handles disconnected graphs.
         * 
         * Colors:
         * -1 : Uncolored
         *  0 : Color A
         *  1 : Color B
         */
        static bool isBipartite(int V, const std::vector<std::vector<int>>& adj) {
            std::vector<int> color(V, -1);

            for (int start = 0; start < V; ++start) {
                if (color[start] == -1) {
                    // Start BFS for this component
                    color[start] = 0;
                    std::queue<int> q;
                    q.push(start);

                    while (!q.empty()) {
                        int u = q.front();
                        q.pop();

                        for (int v : adj[u]) {
                            if (color[v] == -1) {
                                // Color neighbor with the opposite color
                                color[v] = 1 - color[u];
                                q.push(v);
                            } else if (color[v] == color[u]) {
                                // Conflict detected: adjacent nodes share the same color
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        }
    };

    int main() {
        // Bipartite Graph (Square: 0-1-2-3-0)
        int V1 = 4;
        std::vector<std::vector<int>> adj1(V1);
        adj1[0] = {1, 3};
        adj1[1] = {0, 2};
        adj1[2] = {1, 3};
        adj1[3] = {0, 2};

        std::cout << "Graph 1 Bipartite? " 
                  << (BipartiteChecker::isBipartite(V1, adj1) ? "Yes" : "No") 
                  << std::endl; // Output: Yes

        // Non-Bipartite Graph (Triangle: 0-1-2-0)
        int V2 = 3;
        std::vector<std::vector<int>> adj2(V2);
        adj2[0] = {1, 2};
        adj2[1] = {0, 2};
        adj2[2] = {0, 1};

        std::cout << "Graph 2 Bipartite? " 
                  << (BipartiteChecker::isBipartite(V2, adj2) ? "Yes" : "No") 
                  << std::endl; // Output: No

        return 0;
    }
    ```

    :::
-
- # When to Use
  collapsed:: true
  - ## ✅ Use Bipartite Check When:
    - You are solving the **Maximum Bipartite Matching** problem (e.g. assigning jobs to candidates, students to dorm rooms).
    - You need to determine if a graph can be 2-colored (e.g. checking if register allocation is possible with only 2 registers).
    - You are analyzing social networks or transaction networks to partition them into two distinct categories (e.g. buyers and sellers).
-
- # Variations & Related Concepts
  collapsed:: true
  - **Complete Bipartite Graph ($K_{m,n}$)**: A special bipartite graph where every vertex of Set $U$ ($|U|=m$) is connected to every vertex of Set $V$ ($|V|=n$). It has a total of $m \times n$ edges.
  - **Graph Coloring**: Coloring nodes such that no two adjacent nodes share the same color. A graph is bipartite if and only if its chromatic number is $\le 2$.
  - **Odd Cycle Detection**: Finding if a graph has a cycle of odd length. A graph has an odd cycle if and only if it is NOT bipartite.
-
- # Key Takeaways
  - A graph is bipartite if its vertices can be split into two independent sets with no intra-set edges.
  - A graph is bipartite if and only if it does not contain any odd-length cycles.
  - You can check bipartiteness in $O(V + E)$ time using BFS or DFS 2-coloring.
  - Remember to loop over all vertices to handle disconnected graphs correctly.
