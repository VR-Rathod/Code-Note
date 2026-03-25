---
seoTitle: Hungarian Algorithm – Optimal Assignment Problem Solution
description: "The Hungarian algorithm solves the assignment problem in O(n^3) time. Covers cost matrix, augmenting paths, zero covering, and applications in scheduling and."
keywords: "Hungarian algorithm, Munkres algorithm, assignment problem, bipartite matching, O(n^3), cost matrix, augmenting path, time complexity, space complexity, optimization"
---

# Explanation
	- The **Hungarian Algorithm** (also known as the **Kuhn-Munkres Algorithm**) is a combinatorial optimization algorithm used for solving the **assignment problem**. Given a cost matrix, it finds the optimal way to assign `n` tasks to `n` workers such that the total cost is minimized.
-
- # Steps
	- **Subtract the row minima** from each row.
	- **Subtract the column minima** from each column.
	- **Cover zeros with a minimum number of horizontal and vertical lines**.
	- **Find the smallest uncovered number**, subtract it from all uncovered elements, and add it to all covered elements.
	- Repeat until an optimal assignment is found.
-
- # Time Complexity
	- **Time complexity**: O(n³), where `n` is the number of tasks (or workers).
-
- ```python
  from scipy.optimize import linear_sum_assignment
  
  # Example usage
  cost_matrix = [
      [4, 2, 8],
      [2, 3, 7],
      [3, 6, 4]
  ]
  row_ind, col_ind = linear_sum_assignment(cost_matrix)
  
  print(f"Optimal assignment rows: {row_ind}")
  print(f"Optimal assignment cols: {col_ind}")
  ```