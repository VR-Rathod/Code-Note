---
seoTitle: Sudoku Solver – Backtracking & Constraint Propagation Algorithm Guide
description: "Master Sudoku Solver using backtracking and constraint propagation. Covers cell selection heuristics, row/column/box constraint sets, naked singles, and full implementations in Python, C++, JavaScript, and Java."
keywords: "Sudoku solver, backtracking, constraint propagation, naked singles, constraint satisfaction, CSP, row column box, algorithm, DSA, Python, C++, Java, JavaScript"
displayTitle: Sudoku Solver
---

> [!info] What is the Sudoku Solver Problem?
> A **Sudoku Solver** fills a partially-completed 9×9 grid following three rules: each **row**, each **column**, and each **3×3 box** must contain the digits 1–9 exactly once.
> It is solved using [[Backtracking Concepts]] with **constraint propagation** — detecting invalid states early and propagating implications to eliminate impossible digits before recursing.
> A well-optimized solver with constraint propagation solves most puzzles in **microseconds**.

- # Explanation
  collapsed:: true
	- ## The Three Constraints
	  collapsed:: true
		- For every cell `(row, col)` filled with digit `d`:
		  - **Row constraint**: `d` must not appear elsewhere in row `row`.
		  - **Column constraint**: `d` must not appear elsewhere in column `col`.
		  - **Box constraint**: `d` must not appear elsewhere in the 3×3 box containing `(row, col)`. Box index = `(row // 3) * 3 + (col // 3)`.
	-
	- ## Backtracking vs Constraint Propagation
	  collapsed:: true
		- | Technique | How It Works | When It Solves |
		  |-----------|-------------|----------------|
		  | **Pure Backtracking** | Try each digit 1-9, recurse, backtrack on conflict | All puzzles (slow for hard ones) |
		  | **Naked Singles** | If a cell has only one possible digit → fill it immediately | Many easy/medium puzzles without recursion |
		  | **Hidden Singles** | If a digit can only go in one cell in a row/col/box → place it | Harder puzzles |
		  | **Backtracking + Propagation** | Propagate constraints after each placement, recurse on remaining | All puzzles, much faster |
	-
	- ## Minimum Remaining Values (MRV) Heuristic
	  collapsed:: true
		- Instead of filling cells left-to-right, top-to-bottom, pick the **empty cell with the fewest valid candidates** (Minimum Remaining Values heuristic).
		- This detects conflicts earlier and reduces the search tree size dramatically.
		- **Example**: If a cell has only 1 valid digit, fill it immediately (naked single). If 2 cells have 2 candidates each vs one with 5 — pick the cell with 2 candidates first.

- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- 1. **Find an empty cell** (use MRV: pick cell with fewest candidates).
		- 2. **Try each valid digit** (not in same row, column, or box).
		- 3. **Place digit**, update constraints, recurse.
		- 4. If recursion fails → **remove digit, backtrack**, try next digit.
		- 5. If no digit works → return `False` (this branch is unsolvable → propagate backtrack).
		-
		- ```mermaid
		  flowchart TD
		      A["Find empty cell (MRV: fewest candidates)"] --> B{"No empty cells?"}
		      B -- Yes --> C["✅ Puzzle Solved!"]
		      B -- No --> D["For digit = 1 to 9"]
		      D --> E{"Is digit valid?\n(not in row, col, box)"}
		      E -- No --> F["Skip digit"]
		      E -- Yes --> G["Place digit in cell\nUpdate row/col/box constraints"]
		      G --> H["Recurse: solve next cell"]
		      H --> I{"Recursion\nsuccessful?"}
		      I -- Yes --> J["✅ Return True — propagate success"]
		      I -- No --> K["Remove digit — BACKTRACK\nRestore constraints"]
		      K --> D
		      D --> L{"All digits\ntried?"}
		      L -- Yes --> M["❌ Return False — backtrack to parent"]

		      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		  ```
	-
	- ## Step-by-Step Trace (Simplified 4×4 Sudoku)
	  collapsed:: true
		- ```
		  4×4 Sudoku (boxes are 2×2):
		  Digits: 1-4, each row/col/2×2-box contains each exactly once.

		  Initial board:
		  1 . | . 4
		  . 4 | 1 .
		  ----+----
		  . 1 | . 3
		  . . | 4 .

		  Empty cells: (0,1),(0,2),(1,0),(1,3),(2,0),(2,2),(3,0),(3,1),(3,3)

		  Cell (0,1): row has {1,4}, col1 has {4,1}, box has {1,4}
		    Candidates: {2,3} → MRV=2
		  Cell (0,2): row has {1,4}, col2 has {1,4}, box has {1,4}
		    Candidates: {2,3} → MRV=2
		  Cell (1,0): row has {4,1}, col0 has {1}, box has {1,4}
		    Candidates: {2,3} → MRV=2

		  Pick (0,1), try digit=2:
		    Place 2 at (0,1). Board: [1,2,.,4]
		    Next: (0,2): row={1,2,4}, col2={1,4} → candidates={3}
		    Place 3 at (0,2). Board: [1,2,3,4] ← row 0 complete ✅
		    Continue filling...  (eventually solves fully)

		  Final board:
		  1 2 | 3 4
		  3 4 | 1 2
		  ----+----
		  4 1 | 2 3
		  2 3 | 4 1
		  ✅ Solved!
		  ```

- # Complexity Analysis
  collapsed:: true
	- | Approach | Time Complexity | Space Complexity | Notes |
	  |----------|-----------------|------------------|-------|
	  | **Pure Backtracking (worst)** | $O(9^{81})$ | $O(81)$ = $O(1)$ | Without pruning — never reached in practice |
	  | **Backtracking + Constraints** | $O(9^M)$ where $M$ = empty cells | $O(81)$ = $O(1)$ | M ≤ 81; constraint checking drastically reduces $M$ |
	  | **Constraint Propagation Only** | $O(81 \times 9)$ ≈ $O(1)$ | $O(1)$ | Solves easy/medium without recursion |
	  | **MRV + Backtracking** | Exponential worst | $O(81)$ | Typical hard puzzle: microseconds |
	-
	- ## In Practice
	  collapsed:: true
		- Sudoku has exactly 81 cells. Even without MRV, $9^{81}$ is the theoretical upper bound — but with row/column/box constraints, the effective branching factor is 2-3 per cell, not 9.
		- Peter Norvig's famous constraint-propagation solver solves 95 hard puzzles in ~0.1 seconds each.

- # Implementation
  collapsed:: true
	- > [!note] Sudoku Solver — Backtracking with Bitset Constraint Tracking
	  > Uses three arrays of sets (rows, cols, boxes) for O(1) validity checks. Includes MRV heuristic for the advanced variant.
	  - Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs
	  
	  ```python
	  def solve_sudoku(board: list[list[str]]) -> bool:
	      """
	      Solves Sudoku in-place. Empty cells are '.'.
	      Returns True if solved, False if unsolvable.
	      Uses backtracking with set-based O(1) constraint checks.
	      """
	      rows  = [set() for _ in range(9)]
	      cols  = [set() for _ in range(9)]
	      boxes = [set() for _ in range(9)]
	      empties = []

	      # Initialize constraint sets from given digits
	      for r in range(9):
	          for c in range(9):
	              if board[r][c] != '.':
	                  d = board[r][c]
	                  b = (r // 3) * 3 + c // 3
	                  rows[r].add(d); cols[c].add(d); boxes[b].add(d)
	              else:
	                  empties.append((r, c))

	      def backtrack(idx: int) -> bool:
	          if idx == len(empties):
	              return True                  # All cells filled → solved!
	          r, c = empties[idx]
	          b = (r // 3) * 3 + c // 3
	          for d in "123456789":
	              if d in rows[r] or d in cols[c] or d in boxes[b]:
	                  continue                # Constraint violated → skip
	              # Place digit
	              board[r][c] = d
	              rows[r].add(d); cols[c].add(d); boxes[b].add(d)
	              if backtrack(idx + 1):
	                  return True
	              # Remove digit — BACKTRACK
	              board[r][c] = '.'
	              rows[r].discard(d); cols[c].discard(d); boxes[b].discard(d)
	          return False

	      return backtrack(0)

	  # Example
	  board = [
	      ["5","3",".",".","7",".",".",".","."],
	      ["6",".",".","1","9","5",".",".","."],
	      [".","9","8",".",".",".",".","6","."],
	      ["8",".",".",".","6",".",".",".","3"],
	      ["4",".",".","8",".","3",".",".","1"],
	      ["7",".",".",".","2",".",".",".","6"],
	      [".","6",".",".",".",".","2","8","."],
	      [".",".",".","4","1","9",".",".","5"],
	      [".",".",".",".","8",".",".","7","9"],
	  ]
	  solve_sudoku(board)
	  for row in board:
	      print(" ".join(row))
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <array>

	  class SudokuSolver {
	      std::array<std::array<bool,10>, 9> rows{}, cols{}, boxes{};

	      int boxIdx(int r, int c) { return (r/3)*3 + c/3; }

	      bool backtrack(std::vector<std::vector<char>>& board,
	                     std::vector<std::pair<int,int>>& empties, int idx) {
	          if (idx == (int)empties.size()) return true;
	          auto [r, c] = empties[idx];
	          int b = boxIdx(r, c);
	          for (int d = 1; d <= 9; ++d) {
	              if (rows[r][d] || cols[c][d] || boxes[b][d]) continue;
	              board[r][c] = '0' + d;
	              rows[r][d] = cols[c][d] = boxes[b][d] = true;
	              if (backtrack(board, empties, idx+1)) return true;
	              board[r][c] = '.';
	              rows[r][d] = cols[c][d] = boxes[b][d] = false;
	          }
	          return false;
	      }

	  public:
	      void solveSudoku(std::vector<std::vector<char>>& board) {
	          std::vector<std::pair<int,int>> empties;
	          for (int r = 0; r < 9; ++r)
	              for (int c = 0; c < 9; ++c)
	                  if (board[r][c] != '.') {
	                      int d = board[r][c] - '0', b = boxIdx(r,c);
	                      rows[r][d] = cols[c][d] = boxes[b][d] = true;
	                  } else {
	                      empties.push_back({r, c});
	                  }
	          backtrack(board, empties, 0);
	      }
	  };

	  int main() {
	      std::vector<std::vector<char>> board = {
	          {'5','3','.','.','7','.','.','.','.'},
	          {'6','.','.','1','9','5','.','.','.'},
	          {'.','9','8','.','.','.','.','6','.'},
	          {'8','.','.','.','6','.','.','.','3'},
	          {'4','.','.','8','.','3','.','.','1'},
	          {'7','.','.','.','2','.','.','.','6'},
	          {'.','6','.','.','.','.','2','8','.'},
	          {'.','.','.','4','1','9','.','.','5'},
	          {'.','.','.','.','8','.','.','7','9'}
	      };
	      SudokuSolver solver;
	      solver.solveSudoku(board);
	      for (auto& row : board) {
	          for (char c : row) std::cout << c << " ";
	          std::cout << "\n";
	      }
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function solveSudoku(board) {
	      const rows  = Array.from({length: 9}, () => new Set());
	      const cols  = Array.from({length: 9}, () => new Set());
	      const boxes = Array.from({length: 9}, () => new Set());
	      const empties = [];

	      for (let r = 0; r < 9; r++) {
	          for (let c = 0; c < 9; c++) {
	              const b = Math.floor(r/3)*3 + Math.floor(c/3);
	              if (board[r][c] !== '.') {
	                  const d = board[r][c];
	                  rows[r].add(d); cols[c].add(d); boxes[b].add(d);
	              } else {
	                  empties.push([r, c]);
	              }
	          }
	      }

	      function backtrack(idx) {
	          if (idx === empties.length) return true;
	          const [r, c] = empties[idx];
	          const b = Math.floor(r/3)*3 + Math.floor(c/3);
	          for (let d = 1; d <= 9; d++) {
	              const sd = String(d);
	              if (rows[r].has(sd) || cols[c].has(sd) || boxes[b].has(sd)) continue;
	              board[r][c] = sd;
	              rows[r].add(sd); cols[c].add(sd); boxes[b].add(sd);
	              if (backtrack(idx + 1)) return true;
	              board[r][c] = '.';
	              rows[r].delete(sd); cols[c].delete(sd); boxes[b].delete(sd);
	          }
	          return false;
	      }

	      return backtrack(0);
	  }

	  const board = [
	      ["5","3",".",".","7",".",".",".","."],
	      ["6",".",".","1","9","5",".",".","."],
	      [".","9","8",".",".",".",".","6","."],
	      ["8",".",".",".","6",".",".",".","3"],
	      ["4",".",".","8",".","3",".",".","1"],
	      ["7",".",".",".","2",".",".",".","6"],
	      [".","6",".",".",".",".","2","8","."],
	      [".",".",".","4","1","9",".",".","5"],
	      [".",".",".",".","8",".",".","7","9"]
	  ];
	  solveSudoku(board);
	  board.forEach(row => console.log(row.join(" ")));
	  ```
	  
	  ```java
	  import java.util.*;

	  public class SudokuSolver {
	      private boolean[][] rows  = new boolean[9][10];
	      private boolean[][] cols  = new boolean[9][10];
	      private boolean[][] boxes = new boolean[9][10];

	      private int boxIdx(int r, int c) { return (r/3)*3 + c/3; }

	      private boolean backtrack(char[][] board, List<int[]> empties, int idx) {
	          if (idx == empties.size()) return true;
	          int r = empties.get(idx)[0], c = empties.get(idx)[1];
	          int b = boxIdx(r, c);
	          for (int d = 1; d <= 9; d++) {
	              if (rows[r][d] || cols[c][d] || boxes[b][d]) continue;
	              board[r][c] = (char)('0' + d);
	              rows[r][d] = cols[c][d] = boxes[b][d] = true;
	              if (backtrack(board, empties, idx+1)) return true;
	              board[r][c] = '.';
	              rows[r][d] = cols[c][d] = boxes[b][d] = false;
	          }
	          return false;
	      }

	      public void solveSudoku(char[][] board) {
	          List<int[]> empties = new ArrayList<>();
	          for (int r = 0; r < 9; r++)
	              for (int c = 0; c < 9; c++) {
	                  int b = boxIdx(r, c);
	                  if (board[r][c] != '.') {
	                      int d = board[r][c] - '0';
	                      rows[r][d] = cols[c][d] = boxes[b][d] = true;
	                  } else {
	                      empties.add(new int[]{r, c});
	                  }
	              }
	          backtrack(board, empties, 0);
	      }

	      public static void main(String[] args) {
	          char[][] board = {
	              {'5','3','.','.','7','.','.','.','.'},
	              {'6','.','.','1','9','5','.','.','.'},
	              {'.','9','8','.','.','.','.','6','.'},
	              {'8','.','.','.','6','.','.','.','3'},
	              {'4','.','.','8','.','3','.','.','1'},
	              {'7','.','.','.','2','.','.','.','6'},
	              {'.','6','.','.','.','.','2','8','.'},
	              {'.','.','.','4','1','9','.','.','5'},
	              {'.','.','.','.','8','.','.','7','9'}
	          };
	          new SudokuSolver().solveSudoku(board);
	          for (char[] row : board) System.out.println(new String(row));
	      }
	  }
	  ```
	  
	  :::

- # Alternative Variant (Constraint Propagation — Naked Singles)
  collapsed:: true
	- > [!tip] Naked Singles Propagation — Solve Without Backtracking
	  > Many easy/medium puzzles can be solved purely through **constraint propagation**: if a cell has only one valid digit (naked single), fill it. Repeat until no more naked singles remain. Only then fall back to backtracking for the remaining undetermined cells.
	-
	- :::code-tabs
	  
	  ```python
	  def solve_with_propagation(board: list[list[str]]) -> bool:
	      """
	      Phase 1: Propagate naked singles until no more can be placed.
	      Phase 2: Fall back to backtracking for remaining cells.
	      """
	      def candidates(board, r, c):
	          if board[r][c] != '.':
	              return set()
	          used = set(board[r])  # row
	          used |= {board[i][c] for i in range(9)}  # col
	          br, bc = (r // 3) * 3, (c // 3) * 3
	          used |= {board[br+i][bc+j] for i in range(3) for j in range(3)}  # box
	          return set("123456789") - used

	      # Phase 1: Naked singles loop
	      changed = True
	      while changed:
	          changed = False
	          for r in range(9):
	              for c in range(9):
	                  cands = candidates(board, r, c)
	                  if len(cands) == 1:
	                      board[r][c] = cands.pop()
	                      changed = True
	                  elif len(cands) == 0 and board[r][c] == '.':
	                      return False  # Contradiction

	      # Phase 2: Backtrack on remaining empty cells
	      return solve_sudoku(board)   # Reuse standard solver

	  # Example: many easy puzzles solved in Phase 1 alone, no backtracking needed
	  ```
	  
	  :::

- # When to Use Sudoku Solver Approach
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Is the problem a\nConstraint Satisfaction Problem\n(fill grid / assign values)?"}
	      Q -- No --> R1["Use standard search\nor DP"]
	      Q -- Yes --> S1{"Can constraints be\nchecked in O(1)\nafter each assignment?"}
	      S1 -- No --> R2["Model constraints\nas sets/bitmasks first"]
	      S1 -- Yes --> S2{"Can constraint\npropagation reduce\nsearch space first?"}
	      S2 -- Yes --> R3["✅ Constraint Propagation\nthen Backtracking\n(fastest for CSPs)"]
	      S2 -- No --> R4["✅ Backtracking\nwith O(1) constraint sets"]

	      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
	  ```
	-
	- ## ✅ Use This Pattern When
		- Any **9×9 or N×N grid constraint satisfaction** — Sudoku, Latin Squares.
		- Assigning values to variables subject to **row/column/region uniqueness** constraints.
		- **Interview problems**: LeetCode #37 (Sudoku Solver), #36 (Valid Sudoku).
		- Similar to [[N-Queens Problem]] — same backtracking template, different constraints.
	-
	- ## ❌ Avoid If
		- The grid is very large ($N > 50$) — pure backtracking may be too slow; use dedicated CSP solvers (arc consistency AC-3).
		- The puzzle has no unique solution — backtracking finds one; additional logic needed to enumerate all solutions.

- # Key Takeaways
  collapsed:: true
	- **Three Constraint Sets** — Maintaining boolean arrays for rows, columns, and boxes gives $O(1)$ validity checking per digit placement.
	- **Box Index Formula** — `box = (row // 3) * 3 + (col // 3)` maps any cell to its 3×3 box index (0–8).
	- **Backtrack + Undo** — Every digit placement must be perfectly undoable: restore the cell to `'.'` and remove the digit from all three constraint sets.
	- **MRV Heuristic** — Picking the empty cell with the fewest candidates reduces the search tree dramatically — often the single most impactful optimization.
	- **Constraint Propagation** — Naked singles (cells with only one valid digit) should be filled immediately without recursion. This alone solves most published Sudoku puzzles.
	- **Practical Performance** — With row/col/box sets + MRV, a typical 9×9 Sudoku with 30 empty cells is solved in under 1ms; even "world's hardest" Sudoku takes < 100ms.

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks → Sudoku Solver](https://www.geeksforgeeks.org/sudoku-backtracking-7/)
		- [LeetCode → Sudoku Solver (Problem 37)](https://leetcode.com/problems/sudoku-solver/)
		- [Peter Norvig → Solving Every Sudoku Puzzle](https://norvig.com/sudoku.html)
		- [TheAlgorithms – Sudoku Solver (Python)](https://github.com/TheAlgorithms/Python/blob/master/backtracking/sudoku.py)
		- [Wikipedia → Sudoku solving algorithms](https://en.wikipedia.org/wiki/Sudoku_solving_algorithms)
