---
seoTitle: Backtracking Concepts – State Space Search, Pruning & Algorithm Patterns
description: "Master Backtracking algorithms in DSA. Learn the state space tree model, pruning strategies, the standard backtracking template, and how it applies to N-Queens, Sudoku, Subset Sum, and permutation problems."
keywords: "backtracking, state space tree, pruning, constraint satisfaction, N-Queens, Sudoku, subset sum, permutations, combinations, recursion, DFS, algorithm design, Python, C++, Java, JavaScript"
displayTitle: Backtracking Concepts
treeTitle: DSA - DP & Greedy - Backtracking Concepts
---

> [!info] What is Backtracking?
> **Backtracking** is a systematic algorithm for finding all (or some) solutions to a problem by **incrementally building candidates** and **abandoning** ("backtracking") a candidate as soon as it is determined it cannot lead to a valid solution.
> It is a depth-first search ([[Depth First Search]]) on an **implicit state space tree** — each node is a partial candidate, each branch extends it, and pruning eliminates branches early.
> Backtracking is the foundation for solving [[N-Queens Problem]], [[Sudoku Solver]], subset sum, permutations, and constraint satisfaction problems (CSPs).

- # Explanation
  collapsed:: true
	- ## Core Concepts
	  collapsed:: true
		- **State**: The current partial solution being built (e.g., current column assignments for queens).
		- **Choice**: At each step, choose from a set of possible extensions to the current state.
		- **Constraint**: A rule that the state must satisfy. If violated, prune (backtrack immediately).
		- **Goal**: A complete state that satisfies all constraints (a solution).
	-
	- ## Backtracking vs Brute Force
	  collapsed:: true
		- **Brute Force** generates ALL candidates, then filters valid ones — $O(K^N)$ where $K$ is branching factor.
		- **Backtracking** prunes invalid candidates EARLY, avoiding large subtrees entirely.
		- **Example**: For 8-queens, brute force tries $8^8 = 16,777,216$ placements. Backtracking with row+column+diagonal pruning explores only ~2,057 nodes.
	-
	- ## Backtracking vs [[Dynamic Programming Concepts]]
	  collapsed:: true
		- | Aspect | Backtracking | Dynamic Programming |
		  |--------|--------------|---------------------|
		  | Strategy | Try all paths, prune dead ends | Reuse computed sub-results |
		  | Overlapping Subproblems | Doesn't exploit | Exploits (memoization) |
		  | State Space | Exponential (pruned) | Polynomial |
		  | Returns | All solutions / first solution | Single optimal value |
		  | Use case | CSPs, permutations, puzzles | Optimization, counting |
	-
	- ## The Implicit State Space Tree
	  collapsed:: true
		- Each **level** of the tree corresponds to one decision in the problem.
		- Each **node** is a partial solution at that decision point.
		- Each **edge** is the choice made (extend the partial solution by one element).
		- **Leaf nodes** are either complete solutions or dead ends.
		- ```
		  Example: Subsets of {1, 2, 3}
		  Level 0:              []
		  Level 1:        [1]        []
		  Level 2:     [1,2] [1]   [2] []
		  Level 3:  [1,2,3][1,2][1,3][1][2,3][2][3][]
		  → All 8 subsets explored via DFS
		  ```
- # How It Works
  collapsed:: true
	- ## The Universal Backtracking Template
	  collapsed:: true
		- ```python
		  def backtrack(state, choices, result):
		      if is_goal(state):           # Base case: complete solution found
		          result.append(copy(state))
		          return
		  
		      for choice in choices:
		          if is_valid(state, choice):       # Constraint check (PRUNE HERE)
		              apply(state, choice)           # Make choice
		              backtrack(state, next_choices(choice), result)  # Recurse
		              undo(state, choice)            # Undo choice (BACKTRACK)
		  ```
		-
		- ```mermaid
		  flowchart TD
		      A["backtrack(state)"] --> B{"is_goal(state)?"}
		      B -- Yes --> C["Add state to solutions\nReturn"]
		      B -- No --> D["For each choice in available_choices"]
		      D --> E{"is_valid(state, choice)?\n(constraint check — PRUNE)"}
		      E -- No --> F["Skip choice\n← Pruning avoids subtree"]
		      E -- Yes --> G["apply(state, choice)\n(extend partial solution)"]
		      G --> H["backtrack(state)\n(recurse deeper)"]
		      H --> I["undo(state, choice)\n(restore state — BACKTRACK)"]
		      I --> D
		      D --> J["All choices exhausted\nReturn to parent"]
		  
		      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		  ```
	-
	- ## Step-by-Step Trace (Permutations of [1,2,3])
	  collapsed:: true
		- ```
		  backtrack(path=[], remaining=[1,2,3])
		    Choose 1: path=[1], remaining=[2,3]
		      Choose 2: path=[1,2], remaining=[3]
		        Choose 3: path=[1,2,3] → GOAL → add [1,2,3] ✅
		      Choose 3: path=[1,3], remaining=[2]
		        Choose 2: path=[1,3,2] → GOAL → add [1,3,2] ✅
		    Choose 2: path=[2], remaining=[1,3]
		      Choose 1: path=[2,1], remaining=[3]
		        Choose 3: path=[2,1,3] → GOAL → add [2,1,3] ✅
		      Choose 3: path=[2,3], remaining=[1]
		        Choose 1: path=[2,3,1] → GOAL → add [2,3,1] ✅
		    Choose 3: path=[3], remaining=[1,2]
		      ... → [3,1,2] ✅, [3,2,1] ✅
		  
		  Total: 6 permutations (3! = 6) ✅
		  ```
- # Complexity Analysis
  collapsed:: true
	- > [!important] Backtracking Complexity Depends on Pruning
	  > Without pruning: $O(K^N)$ where $K$ = branching factor, $N$ = depth. With pruning, the actual explored nodes can be exponentially smaller.
	-
	- | Problem | Without Pruning | With Pruning | Notes |
	  |---------|-----------------|--------------|-------|
	  | **Permutations of N** | $O(N!)$ | $O(N!)$ | Optimal — must visit all |
	  | **Subsets of N** | $O(2^N)$ | $O(2^N)$ | Optimal — must visit all |
	  | **[[N-Queens Problem]] (N=8)** | $O(8^8)$ = 16M | ~2,057 nodes | Dramatic pruning |
	  | **[[Sudoku Solver]] (9×9)** | $O(9^{81})$ | Exponentially smaller | Constraint propagation |
	  | **Subset Sum** | $O(2^N)$ | $O(2^N)$ worst | Pruning helps on average |
- # Implementation
  collapsed:: true
	- > [!note] Classic Backtracking Problems — Subsets, Permutations, Combination Sum
	  > Three fundamental backtracking patterns every developer should know.
		- Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs
	  
	  ```python
	  from copy import deepcopy
	  
	  # === 1. All Subsets ===
	  def subsets(nums: list[int]) -> list[list[int]]:
	      result = []
	      def backtrack(start: int, path: list[int]):
	          result.append(path[:])            # Every path is a valid subset
	          for i in range(start, len(nums)):
	              path.append(nums[i])
	              backtrack(i + 1, path)
	              path.pop()                    # Backtrack
	      backtrack(0, [])
	      return result
	  
	  # === 2. All Permutations ===
	  def permutations(nums: list[int]) -> list[list[int]]:
	      result = []
	      def backtrack(path: list[int], remaining: list[int]):
	          if not remaining:                 # Goal: all numbers used
	              result.append(path[:])
	              return
	          for i, num in enumerate(remaining):
	              path.append(num)
	              backtrack(path, remaining[:i] + remaining[i+1:])
	              path.pop()                    # Backtrack
	      backtrack([], nums)
	      return result
	  
	  # === 3. Combination Sum (reuse allowed) ===
	  def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
	      result = []
	      candidates.sort()
	  
	      def backtrack(start: int, path: list[int], remaining: int):
	          if remaining == 0:               # Goal reached
	              result.append(path[:])
	              return
	          for i in range(start, len(candidates)):
	              if candidates[i] > remaining:
	                  break                    # PRUNE: sorted, so no point continuing
	              path.append(candidates[i])
	              backtrack(i, path, remaining - candidates[i])  # i = allow reuse
	              path.pop()                   # Backtrack
	  
	      backtrack(0, [], target)
	      return result
	  
	  # Examples
	  print("Subsets:", subsets([1,2,3]))
	  print("Perms:", permutations([1,2,3]))
	  print("CombSum:", combination_sum([2,3,6,7], 7))  # [[2,2,3],[7]]
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  // All Subsets
	  void subsetsHelper(const std::vector<int>& nums, int start,
	                     std::vector<int>& path, std::vector<std::vector<int>>& result) {
	      result.push_back(path);
	      for (int i = start; i < (int)nums.size(); ++i) {
	          path.push_back(nums[i]);
	          subsetsHelper(nums, i + 1, path, result);
	          path.pop_back();  // backtrack
	      }
	  }
	  
	  // All Permutations
	  void permsHelper(std::vector<int>& nums, int start, std::vector<std::vector<int>>& result) {
	      if (start == (int)nums.size()) { result.push_back(nums); return; }
	      for (int i = start; i < (int)nums.size(); ++i) {
	          std::swap(nums[start], nums[i]);
	          permsHelper(nums, start + 1, result);
	          std::swap(nums[start], nums[i]);  // backtrack
	      }
	  }
	  
	  int main() {
	      std::vector<int> nums = {1, 2, 3};
	      std::vector<int> path;
	      std::vector<std::vector<int>> result;
	  
	      subsetsHelper(nums, 0, path, result);
	      std::cout << "Subsets count: " << result.size() << "\n"; // 8
	  
	      result.clear();
	      permsHelper(nums, 0, result);
	      std::cout << "Perms count: " << result.size() << "\n";   // 6
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  // All Subsets
	  function subsets(nums) {
	      const result = [];
	      function backtrack(start, path) {
	          result.push([...path]);
	          for (let i = start; i < nums.length; i++) {
	              path.push(nums[i]);
	              backtrack(i + 1, path);
	              path.pop();           // backtrack
	          }
	      }
	      backtrack(0, []);
	      return result;
	  }
	  
	  // All Permutations
	  function permutations(nums) {
	      const result = [];
	      function backtrack(path, remaining) {
	          if (remaining.length === 0) { result.push([...path]); return; }
	          for (let i = 0; i < remaining.length; i++) {
	              path.push(remaining[i]);
	              backtrack(path, [...remaining.slice(0,i), ...remaining.slice(i+1)]);
	              path.pop();           // backtrack
	          }
	      }
	      backtrack([], nums);
	      return result;
	  }
	  
	  console.log("Subsets:", subsets([1,2,3]).length);     // 8
	  console.log("Perms:", permutations([1,2,3]).length);  // 6
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class BacktrackingBasics {
	      // All Subsets
	      public static List<List<Integer>> subsets(int[] nums) {
	          List<List<Integer>> result = new ArrayList<>();
	          backtrackSubsets(nums, 0, new ArrayList<>(), result);
	          return result;
	      }
	      static void backtrackSubsets(int[] nums, int start, List<Integer> path, List<List<Integer>> result) {
	          result.add(new ArrayList<>(path));
	          for (int i = start; i < nums.length; i++) {
	              path.add(nums[i]);
	              backtrackSubsets(nums, i + 1, path, result);
	              path.remove(path.size() - 1);  // backtrack
	          }
	      }
	  
	      // All Permutations
	      public static List<List<Integer>> permutations(int[] nums) {
	          List<List<Integer>> result = new ArrayList<>();
	          backtrackPerms(nums, 0, result);
	          return result;
	      }
	      static void backtrackPerms(int[] nums, int start, List<List<Integer>> result) {
	          if (start == nums.length) {
	              List<Integer> perm = new ArrayList<>();
	              for (int n : nums) perm.add(n);
	              result.add(perm); return;
	          }
	          for (int i = start; i < nums.length; i++) {
	              int tmp = nums[start]; nums[start] = nums[i]; nums[i] = tmp;  // swap
	              backtrackPerms(nums, start + 1, result);
	              tmp = nums[start]; nums[start] = nums[i]; nums[i] = tmp;  // backtrack
	          }
	      }
	  
	      public static void main(String[] args) {
	          System.out.println("Subsets: " + subsets(new int[]{1,2,3}).size());     // 8
	          System.out.println("Perms: " + permutations(new int[]{1,2,3}).size());  // 6
	      }
	  }
	  ```
	  
	  :::
- # Alternative Variant (Backtracking with Memoization — Word Break)
  collapsed:: true
	- > [!tip] Backtracking + Memoization = Top-Down DP
	  > Pure backtracking revisits the same states. Adding a `memo` dictionary caches results at each position, converting exponential backtracking into polynomial DP. Classic example: **Word Break**.
	-
	- :::code-tabs
	  
	  ```python
	  from functools import lru_cache
	  
	  def word_break(s: str, word_dict: list[str]) -> bool:
	      """
	      Can s be segmented into words from word_dict?
	      Backtracking + memoization = O(N² * L) vs O(2^N) pure backtracking.
	      """
	      words = set(word_dict)
	  
	      @lru_cache(maxsize=None)
	      def backtrack(start: int) -> bool:
	          if start == len(s):
	              return True              # Goal: used all characters
	          for end in range(start + 1, len(s) + 1):
	              if s[start:end] in words and backtrack(end):
	                  return True
	          return False                 # No valid split from this position
	  
	      return backtrack(0)
	  
	  # Example
	  print(word_break("leetcode", ["leet", "code"]))     # True
	  print(word_break("applepenapple", ["apple", "pen"])) # True
	  print(word_break("catsandog", ["cats","dog","sand","and","cat"])) # False
	  ```
	  
	  :::
- # When to Use Backtracking
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Does the problem require\nexploring multiple configurations\nto find valid solutions?"}
	      Q -- No --> R1["Use Greedy or DP\nfor single optimal path"]
	      Q -- Yes --> S1{"Can sub-results\nbe reused?\n(overlapping subproblems)"}
	      S1 -- Yes --> R2["Add Memoization\n(Backtracking + Memo = Top-Down DP)"]
	      S1 -- No --> S2{"Can invalid paths\nbe detected early?"}
	      S2 -- Yes --> R3["✅ Use Backtracking with Pruning\n(much faster than brute force)"]
	      S2 -- No --> R4["Use Backtracking\n(explores full state space)"]
	  
	      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
	  ```
	-
	- ## ✅ Use Backtracking When
		- Finding **all valid solutions** (subsets, permutations, combinations).
		- **Constraint satisfaction problems** — [[N-Queens Problem]], [[Sudoku Solver]], crossword filling.
		- **Puzzle solving** — maze traversal, knight's tour, 0/1 subset sum.
		- When the problem has **hard constraints** that eliminate large portions of the search space early.
	-
	- ## ❌ Avoid Pure Backtracking When
		- The problem has **overlapping subproblems** — add memoization or switch to [[Dynamic Programming Concepts]].
		- You only need **one optimal solution** (not all solutions) — consider [[Greedy Algorithm Concepts]] if applicable.
		- The search space is too large even with pruning (e.g., very large $N$) — use heuristics (simulated annealing, genetic algorithms).
- # Key Takeaways
  collapsed:: true
	- **DFS on Implicit Tree** — Backtracking is depth-first search on a state space tree that is never explicitly built — nodes are generated on the fly.
	- **Three Operations** — Every backtracking solution follows: **Choose**, **Recurse**, **Undo** (the undo restores state for the next sibling branch).
	- **Pruning is Everything** — The power of backtracking comes from detecting invalid states early. Without pruning it is brute force.
	- **State Restoration** — The `undo` step must perfectly reverse the `apply` step. Forgetting this causes subtle bugs where the state leaks between branches.
	- **Backtrack + Memo = DP** — When sub-results are reusable, caching transforms exponential backtracking into polynomial [[Dynamic Programming Concepts]].
	- **Template Recognition** — If you see: "find all combinations/permutations/subsets/arrangements satisfying constraints" → it's almost certainly backtracking.
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks → Backtracking Introduction](https://www.geeksforgeeks.org/backtracking-introduction/)
		- [LeetCode → Backtracking Problem List](https://leetcode.com/tag/backtracking/)
		- [LeetCode → Subsets (Problem 78)](https://leetcode.com/problems/subsets/)
		- [LeetCode → Combination Sum (Problem 39)](https://leetcode.com/problems/combination-sum/)
		- [TheAlgorithms – Backtracking (Python)](https://github.com/TheAlgorithms/Python/tree/master/backtracking)