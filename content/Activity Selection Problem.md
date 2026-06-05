---
seoTitle: Activity Selection Problem – Greedy Interval Scheduling Algorithm Guide
description: "Master the Activity Selection Problem using greedy interval scheduling. Covers earliest finish time strategy, exchange argument proof, weighted variant with DP, and full implementations in Python, C++, JavaScript, and Java."
keywords: "activity selection problem, interval scheduling, greedy algorithm, earliest finish time, non-overlapping intervals, weighted job scheduling, DP, Python, C++, Java, JavaScript, DSA"
displayTitle: Activity Selection Problem
treeTitle: DSA - DP & Greedy - Activity Selection Problem
---

> [!info] What is the Activity Selection Problem?
> The **Activity Selection Problem** asks: given $N$ activities with start times $s_i$ and finish times $f_i$, select the **maximum number of non-overlapping activities** a single resource can perform.
> The [[Greedy Algorithm Concepts|greedy]] strategy — **always pick the activity that finishes earliest** — is provably optimal and runs in **$O(N \log N)$** time (dominated by sorting).
> This is the canonical problem for proving greedy correctness using the **exchange argument**.

- # Explanation
  collapsed:: true
	- Two activities $i$ and $j$ are **compatible** if they do not overlap: $f_i \leq s_j$ or $f_j \leq s_i$.
	- The goal is to find the **largest compatible subset** of activities.
	-
	- ## Why Earliest Finish Time is Greedy-Optimal
	  collapsed:: true
		- **Intuition**: Finishing early leaves maximum time for future activities.
		- **Exchange Argument Proof**:
		  1. Let OPT be any optimal solution. Let $a_1$ be the first activity picked by OPT.
		  2. Let $g_1$ be the first activity picked by greedy (earliest finish).
		  3. Since greedy picks earliest finish: $f(g_1) \leq f(a_1)$.
		  4. Replace $a_1$ with $g_1$ in OPT → result is still valid (same or more time freed up) and still optimal size.
		  5. Repeat → greedy solution matches OPT in size. ✅
	-
	- ## Activity Selection vs Interval Scheduling Variants
	  collapsed:: true
		- | Variant | Goal | Strategy |
		  |---------|------|----------|
		  | **Max Activities (unweighted)** | Max number of non-overlapping activities | Greedy: sort by finish time |
		  | **Interval Coloring** | Min resources (rooms/machines) | Greedy: sort by start time, assign to available resource |
		  | **Weighted Job Scheduling** | Max total weight of non-overlapping jobs | [[Dynamic Programming Concepts]]: DP + binary search |
		  | **Min Interval Coverage** | Fewest intervals to cover a range | Greedy: always pick interval extending coverage farthest |
	-
	- ## Core Properties
	  collapsed:: true
		- **Stability**: Not applicable.
		- **Greedy Choice Property**: Selecting the activity with the earliest finish time never eliminates a globally optimal set.
		- **Optimal Substructure**: After selecting activity $k$, the remaining problem is the same — find max activities compatible with $k$ from the remaining set.
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- 1. **Sort** all activities by finish time.
		- 2. Always **select the first compatible activity** (the one that starts after the last selected activity finishes).
		- 3. Repeat until no more activities remain.
		-
		- ```mermaid
		  flowchart TD
		      A["Sort activities by finish time f_i"] --> B["Select first activity\n(always included in optimal)"]
		      B --> C["last_finish = f[0]"]
		      C --> D["For each remaining activity i (sorted by finish)"]
		      D --> E{"s[i] >= last_finish?\n(compatible with last selected)"}
		      E -- Yes --> F["Select activity i\nlast_finish = f[i]"]
		      E -- No --> G["Skip activity i\n(overlaps with last selected)"]
		      F --> D
		      G --> D
		      D --> H["✅ Selected set = maximum non-overlapping activities"]
		  
		      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		  ```
	-
	- ## Step-by-Step Trace
	  collapsed:: true
		- ```
		  Activities (start, finish):
		  A1=(1,4), A2=(3,5), A3=(0,6), A4=(5,7), A5=(3,9), A6=(5,9), A7=(6,10), A8=(8,11), A9=(8,12), A10=(2,14)
		  
		  After sorting by finish time:
		  A1=(1,4), A2=(3,5), A3=(0,6), A4=(5,7), A5=(3,9), A6=(5,9), A7=(6,10), A8=(8,11), A9=(8,12), A10=(2,14)
		  
		  Step 1: Select A1 (finish=4). last_finish=4
		  Step 2: A2 start=3 < 4 → skip
		  Step 3: A3 start=0 < 4 → skip
		  Step 4: A4 start=5 >= 4 → SELECT A4. last_finish=7
		  Step 5: A5 start=3 < 7 → skip
		  Step 6: A6 start=5 < 7 → skip
		  Step 7: A7 start=6 < 7 → skip
		  Step 8: A8 start=8 >= 7 → SELECT A8. last_finish=11
		  Step 9: A9 start=8 < 11 → skip
		  Step 10: A10 start=2 < 11 → skip
		  
		  Selected: {A1, A4, A8} → 3 activities ✅
		  ```
- # Complexity Analysis
  collapsed:: true
	- | Scenario | Time Complexity | Space Complexity | Notes |
	  |---|---|---|---|
	  | **Unweighted (Greedy)** | **O(N log N)** | **O(N)** | Dominated by sort; O(1) extra after |
	  | **Pre-sorted input** | **O(N)** | **O(1)** | Single pass after sort |
	  | **Weighted (DP + BSearch)** | **O(N log N)** | **O(N)** | DP table + binary search for prev compatible |
	-
	- ## Why O(N log N)?
	  collapsed:: true
		- Sorting takes $O(N \log N)$. The greedy sweep is a single linear pass $O(N)$. Total = $O(N \log N)$.
		- If activities are already sorted by finish time, the entire algorithm runs in $O(N)$.
- # Implementation
  collapsed:: true
	- > [!note] Activity Selection — Greedy (Unweighted) + Weighted DP Variant
	  > The standard greedy returns the count and selected activities. The weighted variant uses DP + binary search to maximize total profit.
		- Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs
	  
	  ```python
	  def activity_selection(activities: list[tuple[int, int]]) -> list[tuple[int, int]]:
	      """
	      Greedy Activity Selection — unweighted.
	      activities: list of (start, finish) tuples.
	      Returns list of selected (start, finish) pairs.
	      """
	      # Sort by finish time
	      sorted_acts = sorted(activities, key=lambda x: x[1])
	      selected = [sorted_acts[0]]
	      last_finish = sorted_acts[0][1]
	  
	      for start, finish in sorted_acts[1:]:
	          if start >= last_finish:
	              selected.append((start, finish))
	              last_finish = finish
	  
	      return selected
	  
	  # Weighted Job Scheduling — O(N log N) DP
	  from bisect import bisect_right
	  
	  def weighted_job_scheduling(jobs: list[tuple[int, int, int]]) -> int:
	      """
	      jobs: list of (start, finish, profit).
	      Returns maximum total profit of non-overlapping jobs.
	      """
	      jobs.sort(key=lambda x: x[1])  # sort by finish time
	      n = len(jobs)
	      finish_times = [j[1] for j in jobs]
	      dp = [0] * (n + 1)
	  
	      for i in range(1, n + 1):
	          start, finish, profit = jobs[i - 1]
	          # Find last job that doesn't conflict (finish <= start of current)
	          j = bisect_right(finish_times, start, 0, i - 1)
	          # Either include job i (profit + dp[j]) or exclude it (dp[i-1])
	          dp[i] = max(dp[i - 1], profit + dp[j])
	  
	      return dp[n]
	  
	  # Examples
	  activities = [(1,4),(3,5),(0,6),(5,7),(3,9),(5,9),(6,10),(8,11),(8,12),(2,14)]
	  selected = activity_selection(activities)
	  print(f"Selected: {selected}")       # [(1,4), (5,7), (8,11)]
	  print(f"Count: {len(selected)}")     # 3
	  
	  jobs = [(1, 4, 20), (3, 5, 30), (0, 6, 15), (5, 7, 40)]
	  print(f"Max Profit: {weighted_job_scheduling(jobs)}")  # 60 (job1 + job4)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  using Activity = std::pair<int, int>; // (start, finish)
	  
	  std::vector<Activity> activitySelection(std::vector<Activity> activities) {
	      std::sort(activities.begin(), activities.end(),
	                [](const Activity& a, const Activity& b) { return a.second < b.second; });
	  
	      std::vector<Activity> selected = {activities[0]};
	      int lastFinish = activities[0].second;
	  
	      for (size_t i = 1; i < activities.size(); ++i) {
	          if (activities[i].first >= lastFinish) {
	              selected.push_back(activities[i]);
	              lastFinish = activities[i].second;
	          }
	      }
	      return selected;
	  }
	  
	  int main() {
	      std::vector<Activity> acts = {{1,4},{3,5},{0,6},{5,7},{3,9},{5,9},{6,10},{8,11}};
	      auto result = activitySelection(acts);
	      std::cout << "Selected " << result.size() << " activities:\n";
	      for (auto [s, f] : result)
	          std::cout << "  (" << s << ", " << f << ")\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function activitySelection(activities) {
	      // activities: [{start, finish}, ...]
	      activities.sort((a, b) => a.finish - b.finish);
	      const selected = [activities[0]];
	      let lastFinish = activities[0].finish;
	  
	      for (let i = 1; i < activities.length; i++) {
	          if (activities[i].start >= lastFinish) {
	              selected.push(activities[i]);
	              lastFinish = activities[i].finish;
	          }
	      }
	      return selected;
	  }
	  
	  const acts = [
	      {start:1,finish:4},{start:3,finish:5},{start:0,finish:6},
	      {start:5,finish:7},{start:8,finish:11}
	  ];
	  const result = activitySelection(acts);
	  console.log("Count:", result.length);    // 3
	  console.log("Selected:", result);
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class ActivitySelection {
	      public static List<int[]> select(int[][] activities) {
	          // activities[i] = {start, finish}
	          Arrays.sort(activities, (a, b) -> a[1] - b[1]);
	          List<int[]> selected = new ArrayList<>();
	          selected.add(activities[0]);
	          int lastFinish = activities[0][1];
	  
	          for (int i = 1; i < activities.length; i++) {
	              if (activities[i][0] >= lastFinish) {
	                  selected.add(activities[i]);
	                  lastFinish = activities[i][1];
	              }
	          }
	          return selected;
	      }
	  
	      public static void main(String[] args) {
	          int[][] acts = {{1,4},{3,5},{0,6},{5,7},{3,9},{8,11}};
	          List<int[]> result = select(acts);
	          System.out.println("Count: " + result.size());
	          for (int[] a : result)
	              System.out.println("  (" + a[0] + ", " + a[1] + ")");
	      }
	  }
	  ```
	  
	  :::
- # Alternative Variant (Interval Coloring — Minimum Machines)
  collapsed:: true
	- > [!tip] Interval Coloring — Find Minimum Number of Machines Needed
	  > Given $N$ activities, what is the minimum number of machines (rooms, processors) needed so all activities run simultaneously? Greedy: **sort by start time**, maintain a min-heap of finish times. If a machine is free (heap top ≤ current start), reuse it; otherwise add a new machine.
	-
	- :::code-tabs
	  
	  ```python
	  import heapq
	  
	  def min_machines(activities: list[tuple[int, int]]) -> int:
	      """
	      Minimum machines to run all activities without conflicts.
	      Greedy: sort by start, use min-heap of finish times.
	      """
	      if not activities:
	          return 0
	      activities.sort(key=lambda x: x[0])  # sort by start time
	      heap = []  # min-heap of finish times (machines in use)
	  
	      for start, finish in activities:
	          if heap and heap[0] <= start:
	              heapq.heapreplace(heap, finish)  # reuse freed machine
	          else:
	              heapq.heappush(heap, finish)     # add new machine
	  
	      return len(heap)
	  
	  # Example
	  activities = [(0,6),(1,4),(3,5),(5,7),(3,9),(5,9),(6,10),(8,11)]
	  print(f"Min machines: {min_machines(activities)}")  # 3
	  ```
	  
	  :::
- # When to Use Activity Selection
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Do you have intervals\nwith start/finish times?"}
	      Q -- No --> R1["Use standard sorting\nor scheduling algorithms"]
	      Q -- Yes --> S1{"Are all activities\nequally valuable (unweighted)?"}
	      S1 -- Yes --> R2["✅ Greedy: Sort by finish time\nO(N log N), maximum count"]
	      S1 -- No --> S2{"Do activities have\ndifferent profits/weights?"}
	      S2 -- Yes --> R3["✅ Weighted Job Scheduling\nDP + Binary Search, O(N log N)"]
	      S2 -- No --> R4["✅ Greedy: earliest finish first"]
	  
	      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
	  ```
	-
	- ## ✅ Use Activity Selection When
		- Maximizing the **count** of non-overlapping intervals (all equal value).
		- **Room/machine allocation** problems — minimize resources used.
		- **Meeting scheduling** — fit the most meetings in a day.
		- LeetCode-style problems: "Non-overlapping Intervals", "Meeting Rooms II".
	-
	- ## ❌ Avoid Simple Greedy When
		- Activities have **different profits/weights** — switch to Weighted Job Scheduling DP.
		- The constraint is not just non-overlap but involves **dependencies** between activities.
- # Key Takeaways
  collapsed:: true
	- **Earliest Finish First** — The greedy choice is always picking the activity with the earliest finish time, maximizing remaining time for future activities.
	- **Exchange Argument Proven** — Correctness is guaranteed by the exchange argument: any optimal solution can be transformed into the greedy solution without reducing the count.
	- **O(N log N) → O(N)** — Sorting dominates; after sorting, a single linear scan is enough.
	- **Weighted Variant Needs DP** — When activities have different profits, greedy fails. Use DP + binary search ([[Dynamic Programming Concepts]]) for the weighted version.
	- **Interval Coloring Dual** — The minimum number of machines = the maximum overlap depth at any point (use min-heap of finish times).
	- **LeetCode Applications** — "Non-overlapping Intervals" (#435), "Meeting Rooms II" (#253), "Minimum Number of Arrows to Burst Balloons" (#452).
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks → Activity Selection Problem](https://www.geeksforgeeks.org/activity-selection-problem-greedy-algo-1/)
		- [CP Algorithms → Scheduling](https://cp-algorithms.com/greedy/job_scheduling.html)
		- [LeetCode → Non-overlapping Intervals (Problem 435)](https://leetcode.com/problems/non-overlapping-intervals/)
		- [LeetCode → Meeting Rooms II (Problem 253)](https://leetcode.com/problems/meeting-rooms-ii/)