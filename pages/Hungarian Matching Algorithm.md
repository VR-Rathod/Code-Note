---
seoTitle: Hungarian Matching Algorithm – Master LP, König's & Matrix Reduction Guide
description: "An exhaustive master-level guide to the Hungarian (Kuhn-Munkres) Algorithm. Covers the Linear Programming primal-dual formulation, König's Theorem, programmatic minimum vertex cover line drawing, a complete 4x4 trace, and 4-language implementations."
keywords: "Hungarian algorithm, Kuhn-Munkres, assignment problem, bipartite matching, linear programming, Konig's Theorem, vertex cover, matrix reduction, time complexity, DSA"
---

> [!info] What is the Hungarian Algorithm?
> The **Hungarian Algorithm** (also called the **Kuhn-Munkres Algorithm**) is a combinatorial optimization algorithm that solves the **Assignment Problem** in polynomial time: **O(N³)**.
> It finds the minimum weight perfect matching in a weighted bipartite graph, mapping $N$ workers to $N$ tasks to minimize total cost.

- # Linear Programming Formulation
  collapsed:: true
	- The assignment problem can be formally modeled as a Linear Program (LP).
	-
	- ## 1. Primal LP Formulation
		- Let $c_{ij}$ be the cost of assigning worker $i$ to task $j$. Let $x_{ij}$ be a decision variable where $x_{ij} = 1$ if worker $i$ is assigned to task $j$, and $0$ otherwise.
		- $$\text{Minimize } \sum_{i=1}^N \sum_{j=1}^N c_{ij} x_{ij}$$
		- Subject to the constraints:
		- $$\sum_{j=1}^N x_{ij} = 1 \quad \forall i \in \{1, \dots, N\} \quad \text{(Each worker gets exactly one task)}$$
		- $$\sum_{i=1}^N x_{ij} = 1 \quad \forall j \in \{1, \dots, N\} \quad \text{(Each task gets exactly one worker)}$$
		- $$x_{ij} \ge 0 \quad \forall i, j$$
		- (Due to the Birkhoff-von Neumann theorem, the extreme points of this LP are integer-valued, so we do not need to explicitly enforce $x_{ij} \in \{0, 1\}$).
		-
	- ## 2. Dual LP Formulation
		- The dual problem introduces potentials $u_i$ for workers (rows) and $v_j$ for tasks (columns):
		- $$\text{Maximize } \sum_{i=1}^N u_i + \sum_{j=1}^N v_j$$
		- Subject to the constraint:
		- $$u_i + v_j \le c_{ij} \quad \forall i, j$$
		- Under the **Complementary Slackness** theorem, if $x_{ij} > 0$, then we must have $u_i + v_j = c_{ij}$.
		- The Hungarian algorithm maintains these potentials $u_i$ and $v_j$ and iteratively updates them until a perfect matching can be formed using only tight edges where $c_{ij} - u_i - v_j = 0$ (the zero-cost slots).
		-
- # Graph Theory Foundations & König's Theorem
  collapsed:: true
	- ## Bipartite Graphs & Matching
		- We represent workers and tasks as a bipartite graph $G = (V_L \cup V_R, E)$. A **matching** is a set of edges without common vertices. A **perfect matching** matches every vertex in the graph.
		-
	- ## Kőnig's Theorem (1931)
		- > [!important] Kőnig's Theorem
		  > In any bipartite graph, the size of a **maximum matching** is equal to the size of a **minimum vertex cover** (the minimum number of vertices needed to touch all edges).
		-
		- In the Hungarian algorithm, Step 3 requires us to find the minimum number of horizontal and vertical lines to cover all zeros.
		- Since covering a zero with a row-line or col-line corresponds to choosing a row-vertex or col-vertex to cover a zero-edge in the bipartite graph of zero costs:
		- **Min Lines to Cover Zeros = Min Vertex Cover = Max Matching of Zeros**
		- If the maximum matching of zero-cost cells is $N$, we can make a perfect assignment using only zeros, which means our dual solutions are tight and optimal.
		-
	- ## Programmatic Line-Drawing Algorithm (Minimum Vertex Cover)
	  collapsed:: true
		- To find the minimum covering lines programmatically:
		- 1. Find a maximum matching in the bipartite graph of zero-cost cells.
		- 2. Mark all **unmatched** rows.
		- 3. For each newly marked row, mark all columns that have a zero in that row.
		- 4. For each newly marked column, mark the row that is currently matched with it.
		- 5. Repeat steps 3 and 4 until no more rows or columns can be marked.
		- 6. Draw lines through all **unmarked rows** and all **marked columns**. This set of lines covers all zeros with the minimum count $k$.
		-
- # Complete 4x4 Matrix Reduction Trace
  collapsed:: true
	- Let's minimize the cost for the following 4x4 cost matrix:
	  $$C = \begin{pmatrix} 9 & 2 & 7 & 8 \\ 6 & 4 & 3 & 7 \\ 5 & 8 & 1 & 8 \\ 7 & 6 & 9 & 4 \end{pmatrix}$$
	-
	- ### Step 1: Row Reduction
	  - Row minima: Row 1 = 2, Row 2 = 3, Row 3 = 1, Row 4 = 4.
	  - Subtract minima:
	    $$C_{row} = \begin{pmatrix} 9-2 & 2-2 & 7-2 & 8-2 \\ 6-3 & 4-3 & 3-3 & 7-3 \\ 5-1 & 8-1 & 1-1 & 8-1 \\ 7-4 & 6-4 & 9-4 & 4-4 \end{pmatrix} = \begin{pmatrix} 7 & 0 & 5 & 6 \\ 3 & 1 & 0 & 4 \\ 4 & 7 & 0 & 7 \\ 3 & 2 & 5 & 0 \end{pmatrix}$$
	-
	- ### Step 2: Column Reduction
	  - Column minima of $C_{row}$: Col 1 = 3, Col 2 = 0, Col 3 = 0, Col 4 = 0.
	  - Subtract minima:
	    $$C_{col} = \begin{pmatrix} 7-3 & 0 & 5 & 6 \\ 3-3 & 1 & 0 & 4 \\ 4-3 & 7 & 0 & 7 \\ 3-3 & 2 & 5 & 0 \end{pmatrix} = \begin{pmatrix} 4 & 0 & 5 & 6 \\ 0 & 1 & 0 & 4 \\ 1 & 7 & 0 & 7 \\ 0 & 2 & 5 & 0 \end{pmatrix}$$
	-
	- ### Step 3: Draw Lines to Cover Zeros
	  - Zeros are at $(0,1)$, $(1,0)$, $(1,2)$, $(2,2)$, $(3,0)$, $(3,3)$.
	  - Let's cover them:
	    - Line 1: Col 1 (covers $(1,0)$ and $(3,0)$)
	    - Line 2: Col 3 (covers $(1,2)$ and $(2,2)$)
	    - Line 3: Row 1 (covers $(0,1)$)
	    - Line 4: Row 4 (covers $(3,3)$)
	    Wait! Can we cover all zeros with 3 lines?
	    Let's check:
	    - Col 1 (covers $(1,0)$, $(3,0)$)
	    - Col 3 (covers $(1,2)$, $(2,2)$)
	    - Row 1 (covers $(0,1)$)
	    - Row 4 (covers $(3,3)$)
	    Is there a way with 3 lines?
	    If we select Col 1, Col 3, and Row 1:
	      - Remaining uncovered zeros: $(3,3)$. We need a line for it (either Row 4 or Col 4).
	      So we need at least 4 lines to cover all zeros.
	      Since the number of lines $k = 4 = N$, we already have our optimal matching!
	-
	- ### Step 4: Final Optimal Assignment
	  - Find rows/columns with a single zero first:
	    - Row 1: Zero at Col 2 $\implies$ Worker 1 $\to$ Task 2 (Original Cost = 2).
	    - Row 3: Zero at Col 3 $\implies$ Worker 3 $\to$ Task 3 (Original Cost = 1).
	    - Row 4: Zeros at Col 1 and Col 4. Since Col 1 is assigned to Row 2, assign Worker 4 $\to$ Task 4 (Original Cost = 4).
	    - Row 2: Zero at Col 1 $\implies$ Worker 2 $\to$ Task 1 (Original Cost = 6).
	  - **Total Minimum Cost** = $2 + 6 + 1 + 4 = 13$.
	-
- # Variations and Edge Cases
  collapsed:: true
	- ## 1. Maximization Problems
		- To maximize total profit, multiply all elements by $-1$ or subtract all elements from the maximum element in the matrix. Then solve as a minimization problem.
		-
	- ## 2. Unbalanced Assignment (Rectangular Matrices)
		- If the number of workers $M$ is not equal to the number of tasks $N$:
		- Pad the matrix with dummy rows or columns filled with $0$s to make it a square matrix of size $\max(M, N) \times \max(M, N)$.
		-
	- ## 3. Forbidden Assignments
		- If worker $i$ cannot perform task $j$, set $c_{ij} = \infty$ (or a very large constant $M$).
		-
- # Time & Space Complexity
  collapsed:: true
	- ## Complexity Table
	  collapsed:: true
		- | Implementation | Time Complexity | Space Complexity | Details |
		  |---|---|---|---|
		  | **Brute Force** | $O(N!)$ | $O(N)$ | Checked via permutations |
		  | **Hungarian Algorithm** | **$O(N^3)$** | **$O(N^2)$** | Efficient potentials augmentation |
		-
- # Implementation
  collapsed:: true
	- > [!note] Below are the implementations in Python (using SciPy and a custom solver), C++, JavaScript, and Java.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs

	  ```python
	  # 1. Standard Library Implementation (Requires SciPy)
	  from scipy.optimize import linear_sum_assignment

	  def solve_assignment_scipy(cost_matrix):
	      row_ind, col_ind = linear_sum_assignment(cost_matrix)
	      total_cost = sum(cost_matrix[r][c] for r, c in zip(row_ind, col_ind))
	      return list(zip(row_ind, col_ind)), total_cost

	  # Example
	  costs = [
	      [9, 2, 7, 8],
	      [6, 4, 3, 7],
	      [5, 8, 1, 8],
	      [7, 6, 9, 4]
	  ]
	  assignments, total = solve_assignment_scipy(costs)
	  print("SciPy Assignment:", assignments, "Total Cost:", total)
	  ```

	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  #include <cmath>

	  // Self-contained O(N^3) Hungarian implementation
	  class Hungarian {
	  private:
	      int n;
	      std::vector<std::vector<double>> cost;
	      std::vector<double> u, v;
	      std::vector<int> p, way;

	  public:
	      Hungarian(const std::vector<std::vector<double>>& cost_matrix) {
	          n = cost_matrix.size();
	          cost = cost_matrix;
	          u.assign(n + 1, 0);
	          v.assign(n + 1, 0);
	          p.assign(n + 1, 0);
	          way.assign(n + 1, 0);
	      }

	      double solve(std::vector<int>& assignment) {
	          for (int i = 1; i <= n; ++i) {
	              p[0] = i;
	              int j0 = 0;
	              std::vector<double> minv(n + 1, 1e18);
	              std::vector<bool> used(n + 1, false);
	              do {
	                  used[j0] = true;
	                  int i0 = p[j0], j1 = 0;
	                  double delta = 1e18;
	                  for (int j = 1; j <= n; ++j) {
	                      if (!used[j]) {
	                          double cur = cost[i0 - 1][j - 1] - u[i0] - v[j];
	                          if (cur < minv[j]) {
	                              minv[j] = cur;
	                              way[j] = j0;
	                          }
	                          if (minv[j] < delta) {
	                              delta = minv[j];
	                              j1 = j;
	                          }
	                      }
	                  }
	                  for (int j = 0; j <= n; ++j) {
	                      if (used[j]) {
	                          u[p[j]] += delta;
	                          v[j] -= delta;
	                      } else {
	                          minv[j] -= delta;
	                      }
	                  }
	                  j0 = j1;
	              } while (p[j0] != 0);
	              do {
	                  int j1 = way[j0];
	                  p[j0] = p[j1];
	                  j0 = j1;
	              } while (j0 != 0);
	          }

	          assignment.assign(n, 0);
	          for (int j = 1; j <= n; ++j) {
	              assignment[p[j] - 1] = j - 1;
	          }
	          return -v[0];
	      }
	  };

	  int main() {
	      std::vector<std::vector<double>> cost_matrix = {
	          {9, 2, 7, 8},
	          {6, 4, 3, 7},
	          {5, 8, 1, 8},
	          {7, 6, 9, 4}
	      };
	      Hungarian solver(cost_matrix);
	      std::vector<int> assignment;
	      double min_cost = solver.solve(assignment);

	      std::cout << "Optimal assignment:\n";
	      for (int i = 0; i < cost_matrix.size(); ++i) {
	          std::cout << "Worker " << i << " -> Task " << assignment[i] << "\n";
	      }
	      std::cout << "Total Cost: " << min_cost << "\n";
	      return 0;
	  }
	  ```

	  ```javascript
	  // Self-contained Hungarian Algorithm
	  function hungarian(costMatrix) {
	      const n = costMatrix.length;
	      const u = new Array(n + 1).fill(0);
	      const v = new Array(n + 1).fill(0);
	      const p = new Array(n + 1).fill(0);
	      const way = new Array(n + 1).fill(0);

	      for (let i = 1; i <= n; i++) {
	          p[0] = i;
	          let j0 = 0;
	          const minv = new Array(n + 1).fill(Infinity);
	          const used = new Array(n + 1).fill(false);
	          
	          do {
	              used[j0] = true;
	              const i0 = p[j0];
	              let j1 = 0;
	              let delta = Infinity;
	              
	              for (let j = 1; j <= n; j++) {
	                  if (!used[j]) {
	                      const cur = costMatrix[i0 - 1][j - 1] - u[i0] - v[j];
	                      if (cur < minv[j]) {
	                          minv[j] = cur;
	                          way[j] = j0;
	                      }
	                      if (minv[j] < delta) {
	                          delta = minv[j];
	                          j1 = j;
	                      }
	                  }
	              }
	              
	              for (let j = 0; j <= n; j++) {
	                  if (used[j]) {
	                      u[p[j]] += delta;
	                      v[j] -= delta;
	                  } else {
	                      minv[j] -= delta;
	                  }
	              }
	              j0 = j1;
	          } while (p[j0] !== 0);
	          
	          do {
	              const j1 = way[j0];
	              p[j0] = p[j1];
	              j0 = j1;
	          } while (j0 !== 0);
	      }

	      const assignment = new Array(n);
	      for (let j = 1; j <= n; j++) {
	          assignment[p[j] - 1] = j - 1;
	      }
	      return { assignment, cost: -v[0] };
	  }

	  const costs = [
	      [9, 2, 7, 8],
	      [6, 4, 3, 7],
	      [5, 8, 1, 8],
	      [7, 6, 9, 4]
	  ];
	  const res = hungarian(costs);
	  console.log("Assignments:", res.assignment);
	  console.log("Total Cost:", res.cost);
	  ```

	  ```java
	  import java.util.*;

	  public class HungarianAlgorithm {
	      
	      public static double solve(double[][] costMatrix, int[] assignment) {
	          int n = costMatrix.length;
	          double[] u = new double[n + 1];
	          double[] v = new double[n + 1];
	          int[] p = new int[n + 1];
	          int[] way = new int[n + 1];

	          for (int i = 1; i <= n; i++) {
	              p[0] = i;
	              int j0 = 0;
	              double[] minv = new double[n + 1];
	              Arrays.fill(minv, Double.MAX_VALUE);
	              boolean[] used = new boolean[n + 1];

	              do {
	                  used[j0] = true;
	                  int i0 = p[j0];
	                  int j1 = 0;
	                  double delta = Double.MAX_VALUE;

	                  for (int j = 1; j <= n; j++) {
	                      if (!used[j]) {
	                          double cur = costMatrix[i0 - 1][j - 1] - u[i0] - v[j];
	                          if (cur < minv[j]) {
	                              minv[j] = cur;
	                              way[j] = j0;
	                          }
	                          if (minv[j] < delta) {
	                              delta = minv[j];
	                              j1 = j;
	                          }
	                      }
	                  }

	                  for (int j = 0; j <= n; j++) {
	                      if (used[j]) {
	                          u[p[j]] += delta;
	                          v[j] -= delta;
	                      } else {
	                          minv[j] -= delta;
	                      }
	                  }
	                  j0 = j1;
	              } while (p[j0] != 0);

	              do {
	                  int j1 = way[j0];
	                  p[j0] = p[j1];
	                  j0 = j1;
	              } while (j0 != 0);
	          }

	          for (int j = 1; j <= n; j++) {
	              assignment[p[j] - 1] = j - 1;
	          }
	          return -v[0];
	      }

	      public static void main(String[] args) {
	          double[][] costs = {
	              {9, 2, 7, 8},
	              {6, 4, 3, 7},
	              {5, 8, 1, 8},
	              {7, 6, 9, 4}
	          };
	          int[] assign = new int[costs.length];
	          double cost = solve(costs, assign);

	          System.out.println("Assignments: " + Arrays.toString(assign));
	          System.out.println("Total Cost: " + cost);
	      }
	  }
	  ```

	  :::
	-
- # When to Use Hungarian Matching
  collapsed:: true
	- ## ✅ Use When:
		- You want to assign workers to tasks or map pairs in bipartite graphs while minimizing total cost.
		- Matrix dimensions $N \le 1000$. The $O(N^3)$ complexity makes it exceptionally fast for medium-scale matching tables.
	-
	- ## ❌ Avoid When:
		- The graph is highly sparse — use **Min-Cost Max-Flow (MCMF)** algorithms or successive shortest paths on graph networks which perform better on sparse edges.
		- The coordinates represent geometric positions — specialized geometric matching algorithms exist that can solve assignments in better time.
		-
- # Key Takeaways
	- **LP Dual Potentials** — By maintaining potentials $u_i + v_j \le c_{ij}$ and matching only slack edges ($u_i + v_j = c_{ij}$), the algorithm constructs an optimal assignment.
	- **Kőnig's Theorem** — Validates that the minimum lines drawn to cover zeros is equal to the size of the maximum zero matching.
	- **Complexity** — Polynomial bounds $O(N^3)$ replace the NP-Hard permutations ($O(N!)$) brute-force.
	-
- # More Learn
	- ## GitHub & Webs
		- [CP-Algorithms – Hungarian Algorithm](https://cp-algorithms.com/graph/hungarian-algorithm.html)
		- [Wikipedia – Hungarian Algorithm](https://en.wikipedia.org/wiki/Hungarian_algorithm)
	- ## Related Pages
		- [[Ackermann Function]] – Theoretical growth bounds
		- [[Euclidean Algorithm for GCD]] – Fundamental number theory
		- [[DSA Algo & System Design]] – Full DSA index