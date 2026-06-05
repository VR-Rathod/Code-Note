---
seoTitle: Disjoint-Set Data Structure (Union-Find) Complete Guide – Union by Rank and Path Compression
description: "A comprehensive guide on the Disjoint-Set (Union-Find) data structure. Covers path compression, union by rank, complexity analysis, and Python/C++ implementations."
keywords: "disjoint set, union find, path compression, union by rank, inverse ackermann, connected components, graph algorithms, kruskals algorithm, VR-Rathod, Code-Note, code note vr, vr book, Disjoint-set Data Structure"

treeTitle: DSA - Advanced Data Structures - Disjoint Set Data Structure
---

> [!info] What is the Disjoint-Set Data Structure?
> A **Disjoint-Set** (or **Union-Find**) is a data structure that keeps track of a partition of a set into elements grouped into disjoint (non-overlapping) subsets.
> It supports two primary operations:
> - **Find**: Determine which subset a particular element belongs to (returns a representative member).
> - **Union**: Merge two subsets into a single subset.

- # Explanation
  - The Disjoint-Set data structure is crucial for problems involving dynamic connectivity. It allows us to group elements and efficiently check if two elements belong to the same group in near-constant time.
  -
  - ## Real-World Analogy
    - **Social Circles & Representatives**: Imagine a convention where attendees belong to different clubs. At first, each person is their own club's representative. When two clubs merge, one representative is chosen to speak for the combined group. To check if two people belong to the same club, we ask each person who their representative is; if they name the same representative, they belong to the same club.
    - **Network Routers**: Routers in a local network are grouped into subnets. Union-Find determines if a packet can traverse between any two routers by checking if they are in the same connected subnet component.
-
- # How It Works
  collapsed:: true
  - ## Core Mechanics
    - A Disjoint-Set is represented as a forest of trees, where each tree represents a set. The root of each tree is the representative of that set.
    -
    - ### 1. Path Compression (Optimization for Find)
      - During the recursive `find` operation, we traverse up the parent pointers to find the root.
      - **Optimization**: Once the root is found, we update the parent pointers of all traversed nodes to point directly to the root. This flattens the tree, ensuring subsequent queries take $O(1)$ amortized time.
    -
    - ### 2. Union by Rank or Size (Optimization for Union)
      - When merging two trees, we want to avoid creating deep trees (which degrades lookup time).
      - **Optimization**: We attach the shorter tree (lower rank) under the root of the taller tree (higher rank). The "rank" represents an upper bound on the height of the tree.
  -
  - ## Complexity and Inverse Ackermann Function
    - Combining path compression and union by rank yields an amortized time complexity of $O(\alpha(N))$ per operation, where $\alpha$ is the **Inverse Ackermann function**.
    - The Ackermann function grows extremely fast; consequently, its inverse $\alpha(N)$ grows incredibly slowly. For all practical values of $N$ (up to $2^{2^{19256}}$), $\alpha(N) < 5$. Hence, operations run in near-constant time.
  -
  - ## Visual Walkthrough
    - ### Initial State (5 elements, each is its own root)
      - ```
        0     1     2     3     4
        ```
    -
    - ### After Union(0, 1) and Union(2, 3)
      - `0` becomes parent of `1`; `2` becomes parent of `3`:
      - ```
          0     2     4
         /     /
        1     3
        ```
    -
    - ### After Union(1, 3)
      - We find representative of `1` (which is `0`) and of `3` (which is `2`). Since both have rank 1, we attach root `2` under root `0`:
      - ```
            0     4
           / \
          1   2
             /
            3
        ```
    -
    - ### During Find(3) with Path Compression
      - Tracing `3 -> 2 -> 0`. We find root `0`.
      - Path compression updates `3`'s parent directly to `0`:
      - ```
            0     4
          / | \
         1  2  3
        ```
-
- # Time & Space Complexity
  collapsed:: true
  - | Operation | Without Optimizations | With Path Compression Only | With Union by Rank Only | With Both (Optimized) |
    |---|---|---|---|---|
    | **Find** | $O(N)$ | $O(\log N)$ | $O(\log N)$ | $O(\alpha(N))$ |
    | **Union** | $O(N)$ | $O(\log N)$ | $O(\log N)$ | $O(\alpha(N))$ |
    | **Space Complexity** | $O(N)$ | $O(N)$ | $O(N)$ | $O(N)$ |
-
- # Implementation
  collapsed:: true
  - :::code-tabs
    
    ```python
    class DisjointSet:
        def __init__(self, size):
            """Initializes size elements, each in its own set."""
            self.parent = list(range(size))
            self.rank = [0] * size

        def find(self, x):
            """Finds the representative of the set containing x with path compression."""
            if self.parent[x] != x:
                self.parent[x] = self.find(self.parent[x])  # Path compression
            return self.parent[x]

        def union(self, x, y):
            """Merges the sets containing x and y using union by rank."""
            root_x = self.find(x)
            root_y = self.find(y)

            if root_x != root_y:
                # Union by rank: attach smaller tree under taller tree
                if self.rank[root_x] < self.rank[root_y]:
                    self.parent[root_x] = root_y
                elif self.rank[root_x] > self.rank[root_y]:
                    self.parent[root_y] = root_x
                else:
                    self.parent[root_y] = root_x
                    self.rank[root_x] += 1
                return True
            return False  # Already in the same set

        def connected(self, x, y):
            """Checks if elements x and y belong to the same set."""
            return self.find(x) == self.find(y)
    ```

    ```c++
    #include <iostream>
    #include <vector>
    #include <numeric>

    class DisjointSet {
    private:
        std::vector<int> parent;
        std::vector<int> rank;

    public:
        // Initializes size elements, each in its own set
        DisjointSet(int size) {
            parent.resize(size);
            std::iota(parent.begin(), parent.end(), 0); // parent[i] = i
            rank.assign(size, 0);
        }

        // Finds the representative of the set containing x with path compression
        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]); // Path compression
            }
            return parent[x];
        }

        // Merges the sets containing x and y using union by rank
        bool unionSets(int x, int y) {
            int rootX = find(x);
            int rootY = find(y);

            if (rootX != rootY) {
                // Union by rank: attach smaller tree under taller tree
                if (rank[rootX] < rank[rootY]) {
                    parent[rootX] = rootY;
                } else if (rank[rootX] > rank[rootY]) {
                    parent[rootY] = rootX;
                } else {
                    parent[rootY] = rootX;
                    rank[rootX]++;
                }
                return true;
            }
            return false; // Already in the same set
        }

        // Checks if elements x and y belong to the same set
        bool connected(int x, int y) {
            return find(x) == find(y);
        }
    };

    int main() {
        DisjointSet ds(5);
        ds.unionSets(0, 1);
        ds.unionSets(2, 3);
        
        std::cout << std::boolalpha;
        std::cout << "0 and 1 connected: " << ds.connected(0, 1) << "\n"; // True
        std::cout << "0 and 2 connected: " << ds.connected(0, 2) << "\n"; // False
        
        ds.unionSets(1, 2);
        std::cout << "0 and 2 connected after union: " << ds.connected(0, 2) << "\n"; // True
        return 0;
    }
    ```

    :::
-
- # When to Use
  collapsed:: true
  - ## ✅ Use Disjoint-Set When:
    - You need to detect cycles in an undirected graph (e.g. during Kruskal's algorithm).
    - You are finding the number of connected components in a dynamic graph where edges are added continuously.
    - You are implementing grid connectivity algorithms (like percolation theory or maze generation).
  - ## ❌ Do NOT Use Disjoint-Set When:
    - You need to delete edges/connections. Standard Disjoint-Set does not support edge deletion (requires complex fully dynamic connectivity data structures).
    - You need to find actual paths between nodes (use DFS or BFS instead).
-
- # Variations & Related Concepts
  collapsed:: true
  - **Union by Size**: Instead of storing rank (height bound), store the size (number of elements) of each component. Attach the smaller tree to the larger one.
  - **Persistent Disjoint-Set**: A variation that keeps track of the history of unions, allowing you to query connectivity at any point in the past.
  - **Dinic's Dynamic Trees / Link-Cut Trees**: Self-balancing trees that can maintain connected components under both edge insertions and deletions.
-
- # Key Takeaways
  collapsed:: true
  - Disjoint-Set efficiently manages partitioning of elements into disjoint subsets.
  - Path compression flattens tree paths on every find operation, yielding $O(1)$ amortized lookups.
  - Union by rank attaches shallow trees under deep ones to prevent degrading tree shapes.
  - Together, these optimizations yield near-constant time $O(\alpha(N))$ operations.
-
- # More Learn
  collapsed:: true
  - ## GitHub & Webs
    - [Wikipedia -> Disjoint-set data structure](https://en.wikipedia.org/wiki/Disjoint-set_data_structure)
    - [GeeksforGeeks -> Disjoint Set Data Structures](https://www.geeksforgeeks.org/introduction-to-disjoint-set-data-structure-or-union-find-algorithm/)