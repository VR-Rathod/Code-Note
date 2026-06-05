---
seoTitle: Longest Common Subsequence (LCS) – Dynamic Programming Guide
description: "Master the Longest Common Subsequence algorithm. Covers the DP recurrence, 2D table construction, traceback for reconstruction, space optimization, and applications in diff tools and DNA alignment."
keywords: "Longest Common Subsequence, LCS, dynamic programming, DP table, subsequence, string similarity, DNA alignment, diff algorithm, edit distance, Python, C++, Java, JavaScript"
displayTitle: Longest Common Subsequence (LCS)
treeTitle: DSA - DP & Greedy - Longest Common Subsequence (LCS)
---

> [!info] What is the Longest Common Subsequence?
> The **Longest Common Subsequence (LCS)** of two strings is the longest sequence of characters that appears in both strings **in the same relative order**, but not necessarily contiguously.
> For example: LCS of `"ABCBDAB"` and `"BDCAB"` is `"BCAB"` or `"BDAB"` (length **4**).
> LCS is solved optimally in **$O(M \times N)$** time using Dynamic Programming, where $M$ and $N$ are the string lengths.

- # Explanation
  collapsed:: true
	- A **subsequence** is derived from a string by deleting some (or no) characters without changing the order of the remaining characters. Unlike a substring, characters do not need to be contiguous.
	- **LCS ≠ LCS Substring**: `"ABC"` and `"AC"` have LCS = `"AC"` (length 2), but their longest common **substring** is `"A"` (length 1).
	-
	- ## The DP Recurrence
	  collapsed:: true
		- Define `dp[i][j]` = length of LCS of `X[0..i-1]` and `Y[0..j-1]`.
		- **Base case**: `dp[i][0] = dp[0][j] = 0` for all `i`, `j`.
		- **Recurrence**:
			- If `X[i-1] == Y[j-1]`: `dp[i][j] = dp[i-1][j-1] + 1`
			- Else: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`
		- The final answer is `dp[M][N]`.
	-
	- ## Core Properties
	  collapsed:: true
		- **Optimal Substructure**: The LCS of `X` and `Y` can be built from LCS of their prefixes.
		- **Overlapping Subproblems**: Many sub-problems (e.g., `lcs(X[0..i], Y[0..j])`) are recomputed repeatedly in the naive recursive solution — DP eliminates this.
		- **Not In-Place**: Requires an $O(M \times N)$ table (reducible to $O(\min(M, N))$ with space optimization).
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- Build a 2D table bottom-up. Each cell `dp[i][j]` answers: *"What is the LCS length for the first `i` chars of X and first `j` chars of Y?"*
		- When characters match, extend the diagonal. When they don't, carry forward the best previous answer.
		-
		- ```mermaid
		  flowchart TD
		      A["Initialize dp table: (M+1) × (N+1) all zeros"] --> B["For i = 1 to M, j = 1 to N"]
		      B --> C{"X[i-1] == Y[j-1]?"}
		      C -- Yes --> D["dp[i][j] = dp[i-1][j-1] + 1"]
		      C -- No --> E["dp[i][j] = max(dp[i-1][j], dp[i][j-1])"]
		      D --> F["Continue filling table"]
		      E --> F
		      F --> G["Answer = dp[M][N]"]
		      G --> H["Traceback from dp[M][N] → reconstruct LCS string"]
		  
		      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		  ```
	-
	- ## Step-by-Step Trace (X = "ABCB", Y = "BCB")
	  collapsed:: true
		- ```
		  X = "ABCB"  (M=4)
		  Y = "BCB"   (N=3)
		  
		  Initialize dp table (5×4):
		       ""  B  C  B
		  ""  [ 0, 0, 0, 0 ]
		  A   [ 0, 0, 0, 0 ]
		  B   [ 0, 0, 0, 0 ]
		  C   [ 0, 0, 0, 0 ]
		  B   [ 0, 0, 0, 0 ]
		  
		  Fill dp[i][j]:
		  i=1 (X='A'):
		    j=1: A≠B → max(dp[0][1], dp[1][0]) = max(0,0) = 0
		    j=2: A≠C → max(dp[0][2], dp[1][1]) = max(0,0) = 0
		    j=3: A≠B → max(dp[0][3], dp[1][2]) = max(0,0) = 0
		  
		  i=2 (X='B'):
		    j=1: B==B → dp[1][0] + 1 = 0+1 = 1
		    j=2: B≠C → max(dp[1][2], dp[2][1]) = max(0,1) = 1
		    j=3: B==B → dp[1][2] + 1 = 0+1 = 1
		  
		  i=3 (X='C'):
		    j=1: C≠B → max(dp[2][1], dp[3][0]) = max(1,0) = 1
		    j=2: C==C → dp[2][1] + 1 = 1+1 = 2
		    j=3: C≠B → max(dp[2][3], dp[3][2]) = max(1,2) = 2
		  
		  i=4 (X='B'):
		    j=1: B==B → dp[3][0] + 1 = 0+1 = 1
		    j=2: B≠C → max(dp[3][2], dp[4][1]) = max(2,1) = 2
		    j=3: B==B → dp[3][2] + 1 = 2+1 = 3
		  
		  Final table:
		       ""  B  C  B
		  ""  [ 0, 0, 0, 0 ]
		  A   [ 0, 0, 0, 0 ]
		  B   [ 0, 1, 1, 1 ]
		  C   [ 0, 1, 2, 2 ]
		  B   [ 0, 1, 2, 3 ]
		  
		  LCS Length = dp[4][3] = 3
		  Traceback: dp[4][3]=3: B==B match → dp[3][2]=2
		             dp[3][2]=2: C==C match → dp[2][1]=1
		             dp[2][1]=1: B==B match → dp[1][0]=0
		  LCS = "BCB" ✅
		  ```
- # Complexity Analysis
  collapsed:: true
	- | Scenario | Time Complexity | Space Complexity | Notes |
	  |---|---|---|---|
	  | **Standard DP** | **O(M × N)** | **O(M × N)** | Full 2D table, supports traceback |
	  | **Space-Optimized** | **O(M × N)** | **O(min(M, N))** | Two rolling rows, no traceback |
	  | **Naive Recursion** | **O(2^N)** | **O(N)** stack | Exponential — avoid |
	-
	- ## When does LCS degenerate?
	  collapsed:: true
		- If both strings are identical → LCS = full string, length $N$.
		- If strings share no characters → LCS = empty string, length 0.
		- The DP always runs in $O(M \times N)$ regardless of content — there is no best or worst case based on input structure.
- # Implementation
  collapsed:: true
	- > [!note] LCS with Length + String Reconstruction
	  > The implementation below computes both the LCS length and reconstructs the actual LCS string via traceback. A space-optimized variant (two-row DP) is also included.
		- Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs
	  
	  ```python
	  def lcs(X: str, Y: str) -> tuple[int, str]:
	      M, N = len(X), len(Y)
	      # Build DP table
	      dp = [[0] * (N + 1) for _ in range(M + 1)]
	  
	      for i in range(1, M + 1):
	          for j in range(1, N + 1):
	              if X[i - 1] == Y[j - 1]:
	                  dp[i][j] = dp[i - 1][j - 1] + 1
	              else:
	                  dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
	  
	      # Traceback to reconstruct LCS string
	      result = []
	      i, j = M, N
	      while i > 0 and j > 0:
	          if X[i - 1] == Y[j - 1]:
	              result.append(X[i - 1])
	              i -= 1; j -= 1
	          elif dp[i - 1][j] > dp[i][j - 1]:
	              i -= 1
	          else:
	              j -= 1
	  
	      lcs_str = "".join(reversed(result))
	      return dp[M][N], lcs_str
	  
	  # Example
	  X, Y = "ABCBDAB", "BDCAB"
	  length, seq = lcs(X, Y)
	  print(f"LCS Length: {length}")  # 4
	  print(f"LCS String: {seq}")     # "BCAB" or "BDAB"
	  
	  # Space-optimized version (O(N) space, no traceback)
	  def lcs_length_only(X: str, Y: str) -> int:
	      M, N = len(X), len(Y)
	      prev = [0] * (N + 1)
	      for i in range(1, M + 1):
	          curr = [0] * (N + 1)
	          for j in range(1, N + 1):
	              if X[i - 1] == Y[j - 1]:
	                  curr[j] = prev[j - 1] + 1
	              else:
	                  curr[j] = max(prev[j], curr[j - 1])
	          prev = curr
	      return prev[N]
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <string>
	  #include <algorithm>
	  
	  std::pair<int, std::string> lcs(const std::string& X, const std::string& Y) {
	      int M = X.size(), N = Y.size();
	      std::vector<std::vector<int>> dp(M + 1, std::vector<int>(N + 1, 0));
	  
	      for (int i = 1; i <= M; ++i)
	          for (int j = 1; j <= N; ++j)
	              if (X[i-1] == Y[j-1])
	                  dp[i][j] = dp[i-1][j-1] + 1;
	              else
	                  dp[i][j] = std::max(dp[i-1][j], dp[i][j-1]);
	  
	      // Traceback
	      std::string result;
	      int i = M, j = N;
	      while (i > 0 && j > 0) {
	          if (X[i-1] == Y[j-1]) {
	              result += X[i-1];
	              --i; --j;
	          } else if (dp[i-1][j] > dp[i][j-1]) {
	              --i;
	          } else {
	              --j;
	          }
	      }
	      std::reverse(result.begin(), result.end());
	      return {dp[M][N], result};
	  }
	  
	  int main() {
	      auto [len, seq] = lcs("ABCBDAB", "BDCAB");
	      std::cout << "LCS Length: " << len << "\n"; // 4
	      std::cout << "LCS String: " << seq << "\n"; // BCAB or BDAB
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function lcs(X, Y) {
	      const M = X.length, N = Y.length;
	      const dp = Array.from({ length: M + 1 }, () => new Array(N + 1).fill(0));
	  
	      for (let i = 1; i <= M; i++) {
	          for (let j = 1; j <= N; j++) {
	              if (X[i - 1] === Y[j - 1]) {
	                  dp[i][j] = dp[i - 1][j - 1] + 1;
	              } else {
	                  dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
	              }
	          }
	      }
	  
	      // Traceback
	      let result = "";
	      let i = M, j = N;
	      while (i > 0 && j > 0) {
	          if (X[i - 1] === Y[j - 1]) {
	              result = X[i - 1] + result;
	              i--; j--;
	          } else if (dp[i - 1][j] > dp[i][j - 1]) {
	              i--;
	          } else {
	              j--;
	          }
	      }
	  
	      return { length: dp[M][N], sequence: result };
	  }
	  
	  const { length, sequence } = lcs("ABCBDAB", "BDCAB");
	  console.log("LCS Length:", length);   // 4
	  console.log("LCS String:", sequence); // "BCAB" or "BDAB"
	  ```
	  
	  ```java
	  public class LCS {
	      public static int[] lcsLengthAndTrace(String X, String Y) {
	          int M = X.length(), N = Y.length();
	          int[][] dp = new int[M + 1][N + 1];
	  
	          for (int i = 1; i <= M; i++)
	              for (int j = 1; j <= N; j++)
	                  if (X.charAt(i - 1) == Y.charAt(j - 1))
	                      dp[i][j] = dp[i - 1][j - 1] + 1;
	                  else
	                      dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
	  
	          // Traceback
	          StringBuilder result = new StringBuilder();
	          int i = M, j = N;
	          while (i > 0 && j > 0) {
	              if (X.charAt(i - 1) == Y.charAt(j - 1)) {
	                  result.insert(0, X.charAt(i - 1));
	                  i--; j--;
	              } else if (dp[i - 1][j] > dp[i][j - 1]) {
	                  i--;
	              } else {
	                  j--;
	              }
	          }
	  
	          System.out.println("LCS Length: " + dp[M][N]);
	          System.out.println("LCS String: " + result);
	          return dp[M];
	      }
	  
	      public static void main(String[] args) {
	          lcsLengthAndTrace("ABCBDAB", "BDCAB"); // Length: 4, String: BCAB
	      }
	  }
	  ```
	  
	  :::
- # Alternative Variant (Edit Distance – LCS Extension)
  collapsed:: true
	- > [!tip] Edit Distance (Levenshtein) — Built on LCS Logic
	  > The **Edit Distance** between two strings is the minimum number of insertions, deletions, and substitutions to transform one into the other. It uses the same DP table structure as LCS: `edit_dist = M + N - 2 * LCS_length` (when only insertions and deletions are allowed).
	-
	- :::code-tabs
	  
	  ```python
	  def edit_distance(X: str, Y: str) -> int:
	      """
	      Minimum insertions + deletions to convert X to Y.
	      Formula: M + N - 2 * LCS(X, Y)
	      """
	      M, N = len(X), len(Y)
	      dp = [[0] * (N + 1) for _ in range(M + 1)]
	      for i in range(1, M + 1):
	          for j in range(1, N + 1):
	              if X[i-1] == Y[j-1]:
	                  dp[i][j] = dp[i-1][j-1] + 1
	              else:
	                  dp[i][j] = max(dp[i-1][j], dp[i][j-1])
	      lcs_len = dp[M][N]
	      return M + N - 2 * lcs_len
	  
	  def min_insertions_to_make_palindrome(s: str) -> int:
	      """Min insertions to make string a palindrome = LCS(s, reverse(s)) complement."""
	      return len(s) - lcs_length_only(s, s[::-1])
	  
	  # Examples
	  print(edit_distance("HEAP", "REAP"))      # 2 (delete H, insert R)
	  print(min_insertions_to_make_palindrome("ABCD")) # 3 (ABCDCBA)
	  ```
	  
	  ```javascript
	  function editDistance(X, Y) {
	      // Minimum insertions + deletions = len(X) + len(Y) - 2*LCS
	      const { length: lcsLen } = lcs(X, Y);
	      return X.length + Y.length - 2 * lcsLen;
	  }
	  
	  function minInsertionsPalindrome(s) {
	      const { length: lcsLen } = lcs(s, s.split("").reverse().join(""));
	      return s.length - lcsLen;
	  }
	  
	  console.log(editDistance("HEAP", "REAP"));          // 2
	  console.log(minInsertionsPalindrome("ABCD"));       // 3
	  ```
	  
	  :::
- # When to Use LCS
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Do you need to find\nsimilarity between\ntwo sequences?"}
	      Q -- No --> R1["Use exact string\nmatching (KMP, Rabin-Karp)"]
	      Q -- Yes --> S1{"Must characters\nbe contiguous?"}
	      S1 -- Yes --> R2["Use Longest Common\nSubstring (Sliding Window / DP)"]
	      S1 -- No --> S2{"Need minimum edits\n(insertions + deletions)?"}
	      S2 -- Yes --> R3["✅ Use LCS\nEdit distance = M+N - 2×LCS"]
	      S2 -- No --> R4["✅ Use LCS\n(O(M×N) DP, standard)"]
	  
	      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
	  ```
	-
	- ## ✅ Use LCS When
		- Finding **sequence similarity** between two strings (DNA alignment, protein comparison).
		- Building **diff tools** (e.g., `git diff`) — the diff is derived from LCS.
		- Computing **edit distance** (minimum insertions/deletions to transform one string to another).
		- Finding the minimum number of insertions to make a string a **palindrome**.
	-
	- ## ❌ Avoid LCS When
		- You need characters to be **contiguous** — use Longest Common Substring instead.
		- The strings are extremely long (millions of chars) — $O(M \times N)$ space may be prohibitive; use space-optimized or heuristic diff algorithms.
		- You need **all** common subsequences — exponential in count; LCS only finds the longest.
- # Key Takeaways
  collapsed:: true
	- **Subsequence ≠ Substring** — LCS characters appear in the same order but need not be adjacent. Longest Common Substring requires contiguity.
	- **O(M×N) DP** — The 2D table fills each cell once; the final answer is in `dp[M][N]`.
	- **Recurrence** — Match: extend diagonal (`dp[i-1][j-1] + 1`). Mismatch: take the max of dropping a char from either string.
	- **Traceback** — Walk back through the DP table from `dp[M][N]` to reconstruct the actual LCS string in $O(M+N)$ time.
	- **Space Optimization** — Two rolling rows reduce space from $O(M \times N)$ to $O(\min(M,N))$, at the cost of losing traceback capability.
	- **Foundation Skill** — LCS is the basis for Edit Distance, Shortest Common Supersequence, Palindrome Insertion, and Unix `diff`.
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks → LCS](https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/)
		- [CP Algorithms → LCS](https://cp-algorithms.com/sequences/longest-common-subsequence.html)
		- [LeetCode → Longest Common Subsequence (Problem 1143)](https://leetcode.com/problems/longest-common-subsequence/)
		- [TheAlgorithms – LCS (Python)](https://github.com/TheAlgorithms/Python/blob/master/dynamic_programming/longest_common_subsequence.py)