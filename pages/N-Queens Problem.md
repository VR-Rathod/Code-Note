---
seoTitle: N-Queens Problem – Backtracking & Bitmask Optimization Guide
description: "Master the N-Queens Problem with backtracking and bitmask optimization. Covers row/column/diagonal constraints, all-solutions vs one-solution variants, O(N!) pruning, and full implementations in Python, C++, JavaScript, and Java."
keywords: "N-Queens, N-Queens problem, backtracking, bitmask, diagonal guards, constraint satisfaction, chess, state space search, DSA, Python, C++, Java, JavaScript, algorithm"
displayTitle: N-Queens Problem
treeTitle: DSA - DP & Greedy - N-Queens Problem
---

> [!info] What is the N-Queens Problem?
> The **N-Queens Problem** asks: place $N$ chess queens on an $N \times N$ board so that **no two queens attack each other** — no two queens share the same row, column, or diagonal.
> It is solved using [[Backtracking Concepts]] and is the canonical example of constraint-satisfaction search with aggressive pruning.
> The standard solution runs in **$O(N!)$** (unavoidable for finding all solutions) but bitmask optimization reduces constant factors by **3-5×** over naive backtracking.

- # Explanation
  collapsed:: true
	- ## Why Backtracking Works Here
	  collapsed:: true
		- A queen attacks along its row, column, and both diagonals. If we place queens **one per row**, we only need to check column and diagonal conflicts.
		- This **eliminates the row constraint entirely** (one queen per row, guaranteed) and reduces branching factor from $N^2$ to $N$ per level.
		- At each row, we try all $N$ columns. If a column or diagonal is already occupied → prune immediately.
	-
	- ## The Three Constraints
	  collapsed:: true
		- For a queen placed at `(row, col)`:
			- **Column**: No other queen in the same column → track `cols_used` set.
			- **Main diagonal** (top-left → bottom-right): All cells where `row - col` is constant.
			- **Anti-diagonal** (top-right → bottom-left): All cells where `row + col` is constant.
		- ```
		  For an 8×8 board:
		  Main diagonal index  = row - col  ∈ [-7, 7] (15 values)
		  Anti-diagonal index  = row + col  ∈ [0, 14] (15 values)
		  Column index         = col        ∈ [0, 7]  (8 values)
		  ```
	-
	- ## N-Queens Solution Count
	  collapsed:: true
		- | N | Solutions | Notes |
		  |---|-----------|-------|
		  | 1 | 1 | Trivial |
		  | 2 | 0 | Impossible |
		  | 3 | 0 | Impossible |
		  | 4 | 2 | Smallest non-trivial case |
		  | 8 | 92 | Classic 8-Queens |
		  | 10 | 724 | — |
		  | 15 | 2,279,184 | — |
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- Place queens row by row. For each row, try all columns. A placement is valid if:
		  1. The column is not occupied.
		  2. The main diagonal index (`row - col`) is not occupied.
		  3. The anti-diagonal index (`row + col`) is not occupied.
		- If valid → place queen, recurse to next row. When all N rows are placed → record solution.
		-
		- ```mermaid
		  flowchart TD
		      A["backtrack(row=0)"] --> B{"row == N?"}
		      B -- Yes --> C["Record solution (all N queens placed) ✅"]
		      B -- No --> D["For col = 0 to N-1"]
		      D --> E{"col not in cols_used\nAND (row-col) not in diag\nAND (row+col) not in anti_diag?"}
		      E -- No --> F["Skip col — PRUNE"]
		      E -- Yes --> G["Place queen at (row,col)\nUpdate cols, diag, anti_diag"]
		      G --> H["backtrack(row+1)"]
		      H --> I["Remove queen (row,col)\nRestore cols, diag, anti_diag — BACKTRACK"]
		      I --> D
		  
		      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		  ```
	-
	- ## Step-by-Step Trace (N=4)
	  collapsed:: true
		- ```
		  N=4, rows 0..3, cols 0..3
		  
		  Row 0: try col=0 → place Q at (0,0). cols={0}, diag={0}, anti={0}
		    Row 1: col=0 → col conflict, skip
		           col=1 → diag (1-1=0) conflict, skip
		           col=2 → place Q at (1,2). cols={0,2}, diag={0,-1}, anti={0,3}
		      Row 2: col=0 → anti (2+0=2) no, but col=0 conflict, skip
		             col=1 → diag (2-1=1) ok, anti(2+1=3) CONFLICT, skip
		             col=2 → col conflict, skip
		             col=3 → diag (2-3=-1) CONFLICT, skip
		      ALL COLUMNS FAILED → backtrack to row 1
		    Row 1: col=3 → place Q at (1,3). cols={0,3}, diag={0,-2}, anti={0,4}
		      Row 2: col=0 → col conflict
		             col=1 → diag(2-1=1) ok, anti(2+1=3) ok → place Q at (2,1)
		               cols={0,3,1}, diag={0,-2,1}, anti={0,4,3}
		        Row 3: col=0 → col conflict
		               col=1 → col conflict
		               col=2 → diag(3-2=1) CONFLICT
		               col=3 → col conflict
		        ALL FAIL → backtrack to row 2
		             col=2 → col conflict
		             col=3 → col conflict
		      ALL FAIL → backtrack to row 1
		  Row 0: col=1 → place Q at (0,1). cols={1}, diag={1}, anti={1}
		    ... (continues to find 2 solutions for N=4)
		  
		  N=4 Solutions:
		  Solution 1:    Solution 2:
		  . Q . .        . . Q .
		  . . . Q        Q . . .
		  Q . . .        . . . Q
		  . . Q .        . Q . .
		  ```
- # Complexity Analysis
  collapsed:: true
	- | Approach | Time Complexity | Space Complexity | Notes |
	  |----------|-----------------|------------------|-------|
	  | **Naive Backtracking** | $O(N!)$ | $O(N)$ stack + $O(N^2)$ board | $O(N)$ valid placements per row in worst case |
	  | **Bitmask Optimization** | $O(N!)$ | $O(N)$ | 3 integers track all constraints; 3-5× faster |
	  | **Brute Force (no pruning)** | $O(N^{2N})$ | $O(N)$ | Try every cell for every queen — extremely slow |
	-
	- ## Why O(N!) is Unavoidable
	  collapsed:: true
		- At row 0: $N$ choices. Row 1: at most $N-1$ (one column taken). Row 2: at most $N-2$. ... → Total ≤ $N! = N \times (N-1) \times \ldots \times 1$.
		- In practice, diagonal pruning eliminates most paths. For $N=8$: only 92 solutions out of $8! = 40,320$ permutations.
- # Implementation
  collapsed:: true
	- > [!note] N-Queens — Standard Backtracking + Bitmask Optimization
	  > The bitmask variant tracks columns, main diagonal, and anti-diagonal as three integers and uses bitwise operations for O(1) constraint checks.
		- Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs
	  
	  ```python
	  def solve_n_queens(n: int) -> list[list[str]]:
	      """Returns all N-Queens solutions as board strings."""
	      results = []
	      queens = [-1] * n       # queens[row] = col where queen is placed
	  
	      cols    = set()          # occupied columns
	      diag    = set()          # occupied main diagonals (row - col)
	      anti    = set()          # occupied anti-diagonals (row + col)
	  
	      def backtrack(row: int):
	          if row == n:
	              board = []
	              for r in range(n):
	                  row_str = "." * queens[r] + "Q" + "." * (n - queens[r] - 1)
	                  board.append(row_str)
	              results.append(board)
	              return
	          for col in range(n):
	              if col in cols or (row-col) in diag or (row+col) in anti:
	                  continue                # Constraint check — PRUNE
	              # Place queen
	              queens[row] = col
	              cols.add(col); diag.add(row-col); anti.add(row+col)
	              backtrack(row + 1)
	              # Remove queen — BACKTRACK
	              cols.discard(col); diag.discard(row-col); anti.discard(row+col)
	  
	      backtrack(0)
	      return results
	  
	  # Bitmask optimization — O(N!) but with faster constant via bit ops
	  def solve_n_queens_bitmask(n: int) -> int:
	      """Returns count of solutions using bitmask tracking."""
	      count = [0]
	      limit = (1 << n) - 1     # N ones = all columns
	  
	      def backtrack(cols: int, left_diag: int, right_diag: int):
	          if cols == limit:     # All columns filled → solution found
	              count[0] += 1
	              return
	          # Available columns = positions not attacked
	          available = limit & ~(cols | left_diag | right_diag)
	          while available:
	              pos = available & (-available)   # Isolate lowest set bit
	              available &= available - 1       # Remove that bit
	              backtrack(
	                  cols | pos,
	                  (left_diag | pos) << 1,   # Shift diagonals
	                  (right_diag | pos) >> 1
	              )
	  
	      backtrack(0, 0, 0)
	      return count[0]
	  
	  # Examples
	  solutions = solve_n_queens(4)
	  print(f"N=4: {len(solutions)} solutions")  # 2
	  for sol in solutions:
	      print("\n".join(sol)); print()
	  
	  print(f"N=8 (bitmask): {solve_n_queens_bitmask(8)} solutions")  # 92
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <string>
	  #include <unordered_set>
	  
	  class NQueens {
	      int n;
	      std::vector<std::vector<std::string>> results;
	      std::vector<int> queens;
	      std::unordered_set<int> cols, diag, anti;
	  
	      void backtrack(int row) {
	          if (row == n) {
	              std::vector<std::string> board;
	              for (int r = 0; r < n; ++r) {
	                  std::string s(n, '.');
	                  s[queens[r]] = 'Q';
	                  board.push_back(s);
	              }
	              results.push_back(board);
	              return;
	          }
	          for (int col = 0; col < n; ++col) {
	              if (cols.count(col) || diag.count(row-col) || anti.count(row+col))
	                  continue;
	              queens[row] = col;
	              cols.insert(col); diag.insert(row-col); anti.insert(row+col);
	              backtrack(row + 1);
	              cols.erase(col); diag.erase(row-col); anti.erase(row+col);
	          }
	      }
	  
	  public:
	      explicit NQueens(int n) : n(n), queens(n, -1) {}
	  
	      std::vector<std::vector<std::string>> solve() {
	          backtrack(0);
	          return results;
	      }
	  
	      // Bitmask count only
	      static int countBitmask(int n) {
	          int count = 0, limit = (1 << n) - 1;
	          std::function<void(int, int, int)> bt = [&](int cols, int ld, int rd) {
	              if (cols == limit) { ++count; return; }
	              int avail = limit & ~(cols | ld | rd);
	              while (avail) {
	                  int pos = avail & (-avail);
	                  avail &= avail - 1;
	                  bt(cols|pos, (ld|pos)<<1, (rd|pos)>>1);
	              }
	          };
	          bt(0, 0, 0);
	          return count;
	      }
	  };
	  
	  int main() {
	      NQueens nq(4);
	      auto solutions = nq.solve();
	      std::cout << "N=4 solutions: " << solutions.size() << "\n"; // 2
	  
	      std::cout << "N=8 (bitmask): " << NQueens::countBitmask(8) << "\n"; // 92
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function solveNQueens(n) {
	      const results = [];
	      const queens = new Array(n).fill(-1);
	      const cols = new Set(), diag = new Set(), anti = new Set();
	  
	      function backtrack(row) {
	          if (row === n) {
	              const board = queens.map(col =>
	                  ".".repeat(col) + "Q" + ".".repeat(n - col - 1)
	              );
	              results.push(board);
	              return;
	          }
	          for (let col = 0; col < n; col++) {
	              if (cols.has(col) || diag.has(row-col) || anti.has(row+col)) continue;
	              queens[row] = col;
	              cols.add(col); diag.add(row-col); anti.add(row+col);
	              backtrack(row + 1);
	              cols.delete(col); diag.delete(row-col); anti.delete(row+col);
	          }
	      }
	  
	      backtrack(0);
	      return results;
	  }
	  
	  const solutions = solveNQueens(4);
	  console.log(`N=4: ${solutions.length} solutions`); // 2
	  solutions.forEach(sol => console.log(sol.join("\n") + "\n"));
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class NQueens {
	      private int n;
	      private List<List<String>> results = new ArrayList<>();
	      private int[] queens;
	      private Set<Integer> cols = new HashSet<>(), diag = new HashSet<>(), anti = new HashSet<>();
	  
	      public NQueens(int n) { this.n = n; this.queens = new int[n]; }
	  
	      private void backtrack(int row) {
	          if (row == n) {
	              List<String> board = new ArrayList<>();
	              for (int r = 0; r < n; r++) {
	                  char[] rowArr = new char[n];
	                  Arrays.fill(rowArr, '.');
	                  rowArr[queens[r]] = 'Q';
	                  board.add(new String(rowArr));
	              }
	              results.add(board);
	              return;
	          }
	          for (int col = 0; col < n; col++) {
	              if (cols.contains(col) || diag.contains(row-col) || anti.contains(row+col)) continue;
	              queens[row] = col;
	              cols.add(col); diag.add(row-col); anti.add(row+col);
	              backtrack(row + 1);
	              cols.remove(col); diag.remove(row-col); anti.remove(row+col);
	          }
	      }
	  
	      public List<List<String>> solve() { backtrack(0); return results; }
	  
	      public static void main(String[] args) {
	          NQueens nq = new NQueens(4);
	          System.out.println("N=4: " + nq.solve().size() + " solutions"); // 2
	      }
	  }
	  ```
	  
	  :::
- # Alternative Variant (Find Any One Solution – Early Exit)
  collapsed:: true
	- > [!tip] Finding Just the First Solution — O(N!) but exits at first success
	  > When only one valid placement is needed (e.g., LeetCode #52 asks for count; a game might need any valid state), add early exit by returning `True` as soon as the first solution is found, avoiding exploring the remaining search tree.
	-
	- :::code-tabs
	  
	  ```python
	  def solve_n_queens_one(n: int) -> list[int] | None:
	      """Find any one valid queen placement. Returns column indices per row, or None."""
	      queens = [-1] * n
	      cols = set(); diag = set(); anti = set()
	  
	      def backtrack(row: int) -> bool:
	          if row == n:
	              return True           # Found one solution → stop immediately
	          for col in range(n):
	              if col in cols or (row-col) in diag or (row+col) in anti:
	                  continue
	              queens[row] = col
	              cols.add(col); diag.add(row-col); anti.add(row+col)
	              if backtrack(row + 1):
	                  return True       # Propagate success upward — no backtrack needed
	              cols.discard(col); diag.discard(row-col); anti.discard(row+col)
	          return False              # No valid placement at this row
	  
	      return queens if backtrack(0) else None
	  
	  # Example
	  sol = solve_n_queens_one(8)
	  print("One solution (col indices):", sol)  # e.g. [0,4,7,5,2,6,1,3]
	  ```
	  
	  :::
- # When to Use N-Queens / Backtracking
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Do you need to place\nitems on a grid/sequence\nwithout conflicts?"}
	      Q -- No --> R1["Use standard search\nor DP"]
	      Q -- Yes --> S1{"Are conflicts\ndetectable early?"}
	      S1 -- No --> R2["Use BFS or\nexhaustive search"]
	      S1 -- Yes --> S2{"Need all solutions\nor just one?"}
	      S2 -- All --> R3["✅ [[Backtracking Concepts]]\nwith set/bitmask constraints"]
	      S2 -- One --> R4["✅ [[Backtracking Concepts]]\nwith early exit (return True on first)"]
	  
	      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
	  ```
	-
	- ## ✅ Use N-Queens Pattern When
		- Placing non-attacking pieces on a grid (queens, rooks, knights).
		- **Interview constraint-satisfaction problems** — classic backtracking benchmark.
		- Grid-based scheduling where certain rows/columns/diagonals must remain unique.
		- Bitmask optimization applies when $N \leq 32$ (int) or $N \leq 64$ (long).
	-
	- ## Related Problems
		- [[Sudoku Solver]] — 2D constraint satisfaction, same [[Backtracking Concepts]] template.
		- Knight's Tour — place a knight visiting every cell exactly once (backtracking + Warnsdorff's heuristic).
		- LeetCode #51 (N-Queens all solutions), #52 (count only).
- # Key Takeaways
  collapsed:: true
	- **One Queen Per Row** — Fixing one queen per row reduces branching from $O(N^2)$ to $O(N)$ per level while guaranteeing no row conflicts.
	- **Three Constraint Sets** — Column, main diagonal (`row-col`), and anti-diagonal (`row+col`) sets provide $O(1)$ validity checks per candidate.
	- **Bitmask = 3-5× Speedup** — Tracking three integer bitmasks instead of three sets eliminates set overhead and enables hardware-level bit tricks (`pos & -pos` to isolate lowest set bit).
	- **O(N!) Unavoidable for All Solutions** — To enumerate all solutions, the algorithm must explore all valid paths. For $N=8$: 92 solutions found in ~2000 explored nodes (vs $8!$ = 40,320 brute force).
	- **Early Exit for One Solution** — Returning `True` immediately on finding the first solution propagates upward, skipping all unexplored siblings.
	- **Canonical Backtracking Example** — N-Queens perfectly demonstrates: choose a column, check constraints, recurse to next row, undo if stuck.
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks → N-Queens Problem](https://www.geeksforgeeks.org/n-queen-problem-backtracking-3/)
		- [LeetCode → N-Queens (Problem 51)](https://leetcode.com/problems/n-queens/)
		- [LeetCode → N-Queens II (Problem 52)](https://leetcode.com/problems/n-queens-ii/)
		- [Visualgo → N-Queens Visualization](https://visualgo.net/en/recursion)
		- [TheAlgorithms – N-Queens (Python)](https://github.com/TheAlgorithms/Python/blob/master/backtracking/n_queens.py)