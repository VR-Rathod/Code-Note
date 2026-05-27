---
seoTitle: Greedy Algorithm Concepts – Strategy, Proof Techniques & Pattern Guide
description: "Master Greedy Algorithms in DSA. Learn the greedy choice property, optimal substructure, exchange argument proofs, and when greedy works vs fails with real-world examples and full implementations."
keywords: "greedy algorithm, greedy choice property, optimal substructure, exchange argument, activity selection, interval scheduling, greedy vs DP, DSA, algorithm design, Python, C++, Java"
displayTitle: Greedy Algorithm Concepts
---

> [!info] What is a Greedy Algorithm?
> A **Greedy Algorithm** builds a solution by making the **locally optimal choice at each step** without reconsidering past decisions, hoping this leads to a **globally optimal solution**.
> Unlike [[Dynamic Programming Concepts]], greedy never looks back — it picks the best available option right now and moves on.
> The challenge is proving that local optimality actually guarantees global optimality for a given problem.

- # Explanation
  collapsed:: true
	- A greedy strategy works when two conditions hold simultaneously:
	- ## 1. Greedy Choice Property
	  collapsed:: true
		- A **globally optimal solution** can be constructed by making a **locally optimal (greedy) choice** at each step.
		- In other words: the best local decision at each point leads to the best global decision, without needing to explore other paths.
		- **Example**: In the [[Activity Selection Problem]], always picking the activity that **finishes earliest** is locally optimal and provably leads to the maximum number of non-overlapping activities.
	-
	- ## 2. Optimal Substructure
	  collapsed:: true
		- An optimal solution to the problem contains optimal solutions to its sub-problems — the same condition required for [[Dynamic Programming Concepts]].
		- **Key difference from DP**: DP explores all sub-problems to find the best. Greedy commits to one choice immediately and reduces the problem size.
	-
	- ## When Does Greedy Fail?
	  collapsed:: true
		- Greedy fails when a locally optimal choice leads to a globally suboptimal result.
		- **Classic counter-example** (0/1 [[Knapsack Problem]]):
		  ```
		  Items: (weight=10, value=60), (weight=20, value=100), (weight=30, value=120)
		  Capacity = 50

		  Greedy by value/weight ratio: Pick item1(ratio=6), item2(ratio=5), item3(ratio=4)
		  Greedy picks: item1+item2 = value 160 (fits: 30kg used)
		  Actually optimal: item2+item3 = value 220 ← Greedy FAILS here
		  ```
		- **Use [[Dynamic Programming Concepts]]** or **backtracking** when greedy fails.
	-
	- ## Greedy vs Dynamic Programming
	  collapsed:: true
		- | Aspect | Greedy | Dynamic Programming |
		  |--------|--------|---------------------|
		  | Decision | Commit immediately | Explore all options |
		  | Time Complexity | Usually $O(N \log N)$ | Usually $O(N^2)$ or $O(N^3)$ |
		  | Correctness | Requires proof | Always correct if recurrence is right |
		  | Revisiting | Never | Yes (overlapping subproblems) |
		  | Examples | Dijkstra, Huffman, Kruskal | LCS, LIS, Knapsack |

- # How It Works
  collapsed:: true
	- ## The Greedy Template
	  collapsed:: true
		- 1. **Define** what "locally optimal" means for this problem.
		- 2. **Sort or structure** input so the greedy choice is easy to identify.
		- 3. **Iterate**: pick the best available choice, add to solution, eliminate invalid options.
		- 4. **Prove** correctness using the **Exchange Argument**.
		-
		- ```mermaid
		  flowchart TD
		      A["Define greedy choice\n(e.g., 'always pick smallest/earliest/highest ratio')"] --> B["Sort / preprocess input\nto make greedy choice O(1) or O(log N)"]
		      B --> C["While solution incomplete"]
		      C --> D["Make the locally optimal choice\n(pick next best candidate)"]
		      D --> E{"Choice valid\n(constraints satisfied)?"}
		      E -- Yes --> F["Add to solution\nUpdate state"]
		      E -- No --> G["Skip / discard candidate"]
		      F --> C
		      G --> C
		      C --> H["✅ Greedy solution complete"]

		      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		  ```
	-
	- ## The Exchange Argument (Proof Technique)
	  collapsed:: true
		- The standard way to prove a greedy algorithm is correct:
		- 1. Assume there exists an **optimal solution OPT** that differs from the **greedy solution G**.
		- 2. Find the **first point of difference** between OPT and G.
		- 3. Show that **swapping** OPT's choice for G's greedy choice produces a solution that is **at least as good** as OPT.
		- 4. By repeated exchange, OPT can be transformed into G without worsening the objective → G is optimal.
		- ```
		  Exchange Argument for Activity Selection:
		  OPT picks activity X first. G picks activity Y (earliest finish time).
		  Since Y finishes ≤ X, swapping X for Y in OPT leaves at least as many
		  compatible activities remaining → OPT' ≥ OPT → G is optimal. ✅
		  ```

- # Complexity Analysis
  collapsed:: true
	- > [!important] Complexity by Problem Type
	  > Greedy algorithms are generally much faster than DP. The dominant cost is usually the initial **sort** step.
	-
	- | Problem | Time Complexity | Key Step |
	  |---------|-----------------|----------|
	  | [[Activity Selection Problem]] | $O(N \log N)$ | Sort by finish time |
	  | [[Huffman Coding Compression]] | $O(N \log N)$ | Min-heap operations |
	  | [[Dijkstras Algorithm]] | $O((V+E) \log V)$ | Priority queue (greedy shortest path) |
	  | [[Kruskals Algorithm]] | $O(E \log E)$ | Sort edges by weight |
	  | Fractional Knapsack | $O(N \log N)$ | Sort by value/weight ratio |
	  | [[Prims Algorithm]] | $O((V+E) \log V)$ | Min spanning tree, greedy edge selection |

- # Implementation
  collapsed:: true
	- > [!note] Fractional Knapsack — A Clean Greedy Example
	  > Unlike the 0/1 [[Knapsack Problem]] (which requires DP), the **Fractional Knapsack** allows taking fractions of items. Sorting by value/weight ratio and greedily taking the best is provably optimal.
	  - Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs
	  
	  ```python
	  def fractional_knapsack(capacity: int, items: list[tuple[int, int]]) -> float:
	      """
	      Greedy fractional knapsack.
	      items: list of (weight, value) tuples.
	      Returns maximum value achievable within capacity.
	      """
	      # Sort by value/weight ratio descending (greedy choice)
	      items.sort(key=lambda x: x[1] / x[0], reverse=True)

	      total_value = 0.0
	      for weight, value in items:
	          if capacity <= 0:
	              break
	          take = min(weight, capacity)        # take as much as possible
	          total_value += take * (value / weight)
	          capacity -= take

	      return total_value

	  # Example
	  items = [(10, 60), (20, 100), (30, 120)]  # (weight, value)
	  capacity = 50
	  print(f"Max Value: {fractional_knapsack(capacity, items)}")  # 240.0
	  # Picks: all of item1 (60) + all of item2 (100) + 20/30 of item3 (80) = 240
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>

	  struct Item { int weight, value; };

	  double fractionalKnapsack(int capacity, std::vector<Item> items) {
	      // Greedy: sort by value/weight ratio descending
	      std::sort(items.begin(), items.end(), [](const Item& a, const Item& b) {
	          return (double)a.value / a.weight > (double)b.value / b.weight;
	      });

	      double totalValue = 0.0;
	      for (const auto& item : items) {
	          if (capacity <= 0) break;
	          int take = std::min(item.weight, capacity);
	          totalValue += take * ((double)item.value / item.weight);
	          capacity -= take;
	      }
	      return totalValue;
	  }

	  int main() {
	      std::vector<Item> items = {{10, 60}, {20, 100}, {30, 120}};
	      std::cout << "Max Value: " << fractionalKnapsack(50, items) << "\n"; // 240
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function fractionalKnapsack(capacity, items) {
	      // items: [{weight, value}, ...]
	      items.sort((a, b) => (b.value / b.weight) - (a.value / a.weight));

	      let totalValue = 0;
	      for (const { weight, value } of items) {
	          if (capacity <= 0) break;
	          const take = Math.min(weight, capacity);
	          totalValue += take * (value / weight);
	          capacity -= take;
	      }
	      return totalValue;
	  }

	  const items = [{weight:10,value:60},{weight:20,value:100},{weight:30,value:120}];
	  console.log("Max Value:", fractionalKnapsack(50, items)); // 240
	  ```
	  
	  ```java
	  import java.util.Arrays;

	  public class FractionalKnapsack {
	      public static double solve(int capacity, int[][] items) {
	          // items[i] = {weight, value}
	          // Sort by value/weight ratio descending
	          Arrays.sort(items, (a, b) -> Double.compare(
	              (double)b[1]/b[0], (double)a[1]/a[0]
	          ));

	          double totalValue = 0;
	          for (int[] item : items) {
	              if (capacity <= 0) break;
	              int take = Math.min(item[0], capacity);
	              totalValue += take * ((double)item[1] / item[0]);
	              capacity -= take;
	          }
	          return totalValue;
	      }

	      public static void main(String[] args) {
	          int[][] items = {{10, 60}, {20, 100}, {30, 120}};
	          System.out.println("Max Value: " + solve(50, items)); // 240.0
	      }
	  }
	  ```
	  
	  :::

- # Alternative Variant (Job Scheduling to Minimize Lateness)
  collapsed:: true
	- > [!tip] Earliest Deadline First (EDF) Scheduling
	  > Given jobs with deadlines and processing times, schedule them to minimize the **maximum lateness** (lateness = completion time - deadline). The greedy strategy: sort by **earliest deadline first**.
	-
	- :::code-tabs
	  
	  ```python
	  def minimize_max_lateness(jobs: list[tuple[int, int]]) -> tuple[int, list]:
	      """
	      jobs: list of (processing_time, deadline).
	      Returns (max_lateness, schedule order).
	      Greedy: sort by earliest deadline first.
	      """
	      jobs_with_idx = [(t, d, i+1) for i, (t, d) in enumerate(jobs)]
	      jobs_with_idx.sort(key=lambda x: x[1])  # sort by deadline

	      time = 0
	      max_lateness = 0
	      schedule = []

	      for proc_time, deadline, job_id in jobs_with_idx:
	          time += proc_time
	          lateness = max(0, time - deadline)
	          max_lateness = max(max_lateness, lateness)
	          schedule.append((job_id, time, lateness))

	      return max_lateness, schedule

	  # Example
	  jobs = [(3, 6), (2, 8), (1, 9), (4, 9), (3, 14), (2, 15)]
	  max_late, sched = minimize_max_lateness(jobs)
	  print(f"Max Lateness: {max_late}")  # 1
	  for job_id, finish, late in sched:
	      print(f"  Job {job_id}: finish={finish}, lateness={late}")
	  ```
	  
	  :::

- # When to Use Greedy
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Does the problem have\nOptimal Substructure?"}
	      Q -- No --> R1["Use Brute Force\nor Heuristics"]
	      Q -- Yes --> S1{"Does Greedy Choice\nProperty hold?\n(provable by exchange argument)"}
	      S1 -- No --> R2["Use Dynamic Programming\n([[Dynamic Programming Concepts]])"]
	      S1 -- Yes --> S2{"Is sorting / priority queue\nsufficient to make greedy choice?"}
	      S2 -- Yes --> R3["✅ Use Greedy Algorithm\n(O(N log N) typically)"]
	      S2 -- No --> R4["Use Greedy with\nUnion-Find or Segment Trees"]

	      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
	  ```
	-
	- ## ✅ Greedy Works For
		- **[[Activity Selection Problem]]** — pick earliest finishing activity.
		- **[[Huffman Coding Compression]]** — build optimal prefix-free codes.
		- **[[Dijkstras Algorithm]]** — shortest path (non-negative weights).
		- **[[Kruskals Algorithm]] / [[Prims Algorithm]]** — Minimum Spanning Tree.
		- **Fractional Knapsack** — sort by value/weight ratio.
		- **Coin Change (canonical coins)** — pick largest denomination first.
	-
	- ## ❌ Greedy Fails For
		- **0/1 [[Knapsack Problem]]** — must use DP (can't take fractions).
		- **Shortest Path with negative edges** — must use Bellman-Ford.
		- **Coin Change (arbitrary coins)** — greedy can fail (use DP).
		- **Traveling Salesman Problem (TSP)** — greedy gives approximation only.

- # Key Takeaways
  collapsed:: true
	- **Local → Global** — Greedy makes the locally best choice at each step. Correctness requires proving that local optimality implies global optimality.
	- **Two Conditions** — Greedy works only when both **Greedy Choice Property** AND **Optimal Substructure** hold.
	- **Exchange Argument** — The standard proof technique: show any optimal solution can be "swapped" toward the greedy solution without losing optimality.
	- **Faster than DP** — Greedy is typically $O(N \log N)$ (dominated by sorting), vs DP's $O(N^2)$ or higher.
	- **Irreversible Decisions** — Unlike backtracking or DP, greedy never reconsiders past choices. This is its speed advantage and its risk.
	- **Recognize by Pattern** — Common greedy patterns: sort by ratio/deadline/finish time, use a priority queue (heap), or pick smallest/largest remaining element.

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks → Greedy Algorithms](https://www.geeksforgeeks.org/greedy-algorithms/)
		- [CP Algorithms → Greedy](https://cp-algorithms.com/greedy/)
		- [Brilliant.org → Greedy Algorithms](https://brilliant.org/wiki/greedy-algorithm/)
		- [TheAlgorithms – Greedy (Python)](https://github.com/TheAlgorithms/Python/tree/master/greedy_methods)
