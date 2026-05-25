---
seoTitle: Manacher's Algorithm – Longest Palindromic Substring in O(N)
description: "Master Manacher's algorithm for linear-time palindrome detection. Covers transformed strings, boundary guards, LPS search, palindrome count variant, and code in 5 languages."
keywords: "Manacher's algorithm, longest palindromic substring, linear time palindrome, palindromic substrings count, string algorithm, O(N) palindrome, C++, Python, Java, JavaScript, C"
---

> [!info] What is Manacher's Algorithm?
> Manacher's Algorithm is a highly optimized string algorithm that finds the **longest palindromic substring** in a string in guaranteed **O(N)** linear time.
> Standard center-expansion approaches take $O(N^2)$ because they rebuild palindrome information from scratch at each center. Manacher's algorithm avoids this redundancy by using a **mirroring property** based on a previously computed rightmost palindrome boundary.

- # Explanation
  collapsed:: true
	- Finding palindromes is traditionally slow because even-length and odd-length palindromes require separate center logic.
	- **Manacher's Algorithm** solves both problems simultaneously using two key ideas:
		- 1. **String Transformation**: Insert a delimiter character (like `#`) between every character, and prepend/append boundary guards (like `^` and `$`). This converts all palindromes (even and odd) into odd-length palindromes.
		- 2. **Symmetry Mirroring**: For any center, its palindromic radius is symmetric to a previously calculated mirror index on the left, up to the boundary of the rightmost matched palindrome.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine folding a piece of paper in half. If you paint a pattern on one side, it automatically copies onto the other side symmetrically.
		- In a string, if we have already scanned a large palindrome and are currently checking characters inside its right side, we don't need to re-read them character-by-character. We can look at the "folded" (mirrored) position on the left and copy its palindrome radius, only expanding manually if the mirror radius goes past our paper's edge.
	-
	- ## Standard Center-Expansion vs. Manacher's
	  collapsed:: true
		- **Center-Expansion**: Checks each of the $2N - 1$ centers. In the worst case (e.g. `"aaaaa"`), it compares characters repeatedly, resulting in **O(N²)** time.
		- **Manacher's Algorithm**: Tracks the active rightmost palindrome boundary $R$ and its center $C$. When checking center $i$:
			- If $i < R$, we initialize its radius using its mirror index $2C - i$: `P[i] = min(R - i, P[mirror])`.
			- We only expand the search if the palindrome extends beyond $R$, updating $C$ and $R$ accordingly. This bounds the total character comparisons to **O(N)**.
-
- # How It Works
  collapsed:: true
	- ## Execution Flow
	  collapsed:: true
		- ```mermaid
		  flowchart TD
		      Start["Start — Transform S to T\ne.g., 'aba' -> '^#a#b#a#$'"] --> Init["Init P array with 0s\nC = 0, R = 0"]
		      Init --> Loop["For i = 1 to len(T) - 2"]
		      Loop --> CheckBound{"i < R?"}
		      CheckBound -- Yes --> MirrorInit["Set P[i] = min(R - i, P[2*C - i])"]
		      CheckBound -- No --> ZeroInit["Set P[i] = 0"]
		      MirrorInit --> Expand["Expand around i:\nWhile T[i + 1 + P[i]] == T[i - 1 - P[i]]\nIncrement P[i]"]
		      ZeroInit --> Expand
		      Expand --> UpdateBoundary{"i + P[i] > R?"}
		      UpdateBoundary -- Yes --> ShiftBoundary["C = i\nR = i + P[i]"]
		      UpdateBoundary -- No --> Next["i = i + 1"]
		      ShiftBoundary --> Next
		      Next --> LoopCondition{"i < len(T) - 1?"}
		      LoopCondition -- Yes --> Loop
		      LoopCondition -- No --> FindMax["Find max value in P\nMap center & radius back to original S"]
		      FindMax --> End["Return Longest Palindromic Substring"]
		      
		  ```
	-
	- ## Step-by-Step Walkthrough (String: `"babad"`)
	  collapsed:: true
		- Let's trace the algorithm for $S = \text{"babad"}$.
		- Transformed string $T = \text{"^#b#a#b#a#d#$"}$. Length $N = 13$.
		-
		- | i | T[i] | Mirror (2C - i) | Initial P[i] | Expansion Matches | Final P[i] | New Center/Right |
		  |---|---|---|---|---|---|---|
		  | 0 | ^ | - | 0 | None (Guard) | 0 | C=0, R=0 |
		  | 1 | # | - | 0 | None | 0 | C=0, R=0 |
		  | 2 | b | - | 0 | T[1]=='#', T[3]=='#' | 1 | C=2, R=3 |
		  | 3 | # | 2*2-3 = 1 | min(3-3, P[1]) = 0 | None | 0 | C=2, R=3 |
		  | 4 | a | 2*2-4 = 0 | min(3-4, P[0]) = 0 | T[1..3]=='#', T[5..7]=='#b#a#b#' | 3 | C=4, R=7 |
		  | 5 | # | 2*4-5 = 3 | min(7-5, P[3]) = 0 | None | 0 | C=4, R=7 |
		  | 6 | b | 2*4-6 = 2 | min(7-6, P[2]) = 1 | T[2..4]=='bab', T[4..8]=='aba' | 3 | C=6, R=9 |
		  | 7 | # | 2*6-7 = 5 | min(9-7, P[5]) = 0 | None | 0 | C=6, R=9 |
		  | 8 | a | 2*6-8 = 4 | min(9-8, P[4]) = 1 | T[7]==T[9], but T[6]!='#' | 1 | C=6, R=9 |
		  | 9 | # | 2*6-9 = 3 | min(9-9, P[3]) = 0 | None | 0 | C=6, R=9 |
		  | 10| d | - | 0 | T[9]=='#', T[11]=='#' | 1 | C=10, R=11 |
		  | 11| # | - | 0 | None | 0 | C=10, R=11 |
		- Max value in $P$ is $3$ at index $4$ (or index $6$).
		- Map back: `start_index = (center_idx - max_len) // 2` $\rightarrow (4 - 3) // 2 = 0$.
		- Substring `S[0 : 0 + 3] = "bab"`.
-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > - **Time Complexity: O(N)** — Amortized analysis: the right boundary $R$ only advances forward. Comparisons occur only when expanding past $R$.
	  > - **Space Complexity: O(N)** — Requires auxiliary arrays for the transformed string and radius storage.
	-
	- ## Complexity Table
	  collapsed:: true
		- | Phase / Metric | Best Case | Average Case | Worst Case | Space Complexity |
		  |---|---|---|---|---|
		  | **Manacher's Search** | $O(N)$ | $O(N)$ | $O(N)$ | $O(N)$ |
		  | **Counting Palindromes**| $O(N)$ | $O(N)$ | $O(N)$ | $O(N)$ |
-
- # Base Implementation
  collapsed:: true
	- > [!note] Linear-time Longest Palindromic Substring Finder.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def longest_palindromic_substring(s: str) -> str:
	      """
	      Finds the longest palindromic substring in O(N) time and space.
	      """
	      if not s:
	          return ""
	      
	      # Transform string to avoid even/odd center cases
	      # e.g., "babad" -> "^#b#a#b#a#d#$"
	      t = "^#" + "#".join(s) + "#$"
	      n = len(t)
	      p = [0] * n
	      c, r = 0, 0
	      
	      for i in range(1, n - 1):
	          mirror = 2 * c - i
	          if i < r:
	              p[i] = min(r - i, p[mirror])
	              
	          # Expand around center i (guards prevent index out of bounds)
	          while t[i + 1 + p[i]] == t[i - 1 - p[i]]:
	              p[i] += 1
	              
	          # Update center and rightmost boundary
	          if i + p[i] > r:
	              c = i
	              r = i + p[i]
	              
	      # Extract maximum radius and center
	      max_len = 0
	      center_idx = 0
	      for i in range(1, n - 1):
	          if p[i] > max_len:
	              max_len = p[i]
	              center_idx = i
	              
	      start = (center_idx - max_len) // 2
	      return s[start : start + max_len]
	  
	  # Example Usage
	  if __name__ == "__main__":
	      print(longest_palindromic_substring("babad"))  # Output: "bab" (or "aba")
	      print(longest_palindromic_substring("cbbd"))   # Output: "bb"
	  ```
	  
	  ```cpp
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  #include <algorithm>
	  
	  // Manacher's Algorithm - Longest Palindromic Substring
	  // Time: O(N) | Space: O(N)
	  std::string longestPalindromicSubstring(const std::string& s) {
	      if (s.empty()) return "";
	      
	      // Transform string
	      std::string t = "^#";
	      for (char c : s) {
	          t += c;
	          t += '#';
	      }
	      t += '$';
	      
	      int n = t.length();
	      std::vector<int> p(n, 0);
	      int c = 0, r = 0;
	      
	      for (int i = 1; i < n - 1; ++i) {
	          int mirror = 2 * c - i;
	          if (i < r) {
	              p[i] = std::min(r - i, p[mirror]);
	          }
	          
	          // Expand around center i
	          while (t[i + 1 + p[i]] == t[i - 1 - p[i]]) {
	              p[i]++;
	          }
	          
	          // Update center and boundary
	          if (i + p[i] > r) {
	              c = i;
	              r = i + p[i];
	          }
	      }
	      
	      int maxLen = 0;
	      int centerIdx = 0;
	      for (int i = 1; i < n - 1; ++i) {
	          if (p[i] > maxLen) {
	              maxLen = p[i];
	              centerIdx = i;
	          }
	      }
	      
	      int start = (centerIdx - maxLen) / 2;
	      return s.substr(start, maxLen);
	  }
	  
	  int main() {
	      std::cout << longestPalindromicSubstring("babad") << "\n"; // Output: bab
	      std::cout << longestPalindromicSubstring("cbbd") << "\n";  // Output: bb
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  /**
	   * Manacher's Algorithm to find the longest palindromic substring
	   * Time: O(N) | Space: O(N)
	   */
	  function longestPalindromicSubstring(s) {
	      if (!s) return "";
	      
	      // Preprocess string
	      let t = "^#";
	      for (let i = 0; i < s.length; i++) {
	          t += s[i] + "#";
	      }
	      t += "$";
	      
	      const n = t.length;
	      const p = new Array(n).fill(0);
	      let c = 0, r = 0;
	      
	      for (let i = 1; i < n - 1; i++) {
	          const mirror = 2 * c - i;
	          if (i < r) {
	              p[i] = Math.min(r - i, p[mirror]);
	          }
	          
	          while (t[i + 1 + p[i]] === t[i - 1 - p[i]]) {
	              p[i]++;
	          }
	          
	          if (i + p[i] > r) {
	              c = i;
	              r = i + p[i];
	          }
	      }
	      
	      let maxLen = 0;
	      let centerIdx = 0;
	      for (let i = 1; i < n - 1; i++) {
	          if (p[i] > maxLen) {
	              maxLen = p[i];
	              centerIdx = i;
	          }
	      }
	      
	      const start = Math.floor((centerIdx - maxLen) / 2);
	      return s.substring(start, start + maxLen);
	  }
	  
	  // Example Usage
	  console.log(longestPalindromicSubstring("babad")); // Output: "bab"
	  console.log(longestPalindromicSubstring("cbbd"));  // Output: "bb"
	  ```
	  
	  ```java
	  public class ManachersLPS {
	      /**
	       * Finds the longest palindromic substring in O(N) time and space.
	       */
	      public static String longestPalindromicSubstring(String s) {
	          if (s == null || s.length() == 0) return "";
	          
	          // Preprocess string
	          StringBuilder sb = new StringBuilder("^#");
	          for (int i = 0; i < s.length(); i++) {
	              sb.append(s.charAt(i)).append("#");
	          }
	          sb.append("$");
	          String t = sb.toString();
	          
	          int n = t.length();
	          int[] p = new int[n];
	          int c = 0, r = 0;
	          
	          for (int i = 1; i < n - 1; i++) {
	              int mirror = 2 * c - i;
	              if (i < r) {
	                  p[i] = Math.min(r - i, p[mirror]);
	              }
	              
	              while (t.charAt(i + 1 + p[i]) == t.charAt(i - 1 - p[i])) {
	                  p[i]++;
	              }
	              
	              if (i + p[i] > r) {
	                  c = i;
	                  r = i + p[i];
	              }
	          }
	          
	          int maxLen = 0;
	          int centerIdx = 0;
	          for (int i = 1; i < n - 1; i++) {
	              if (p[i] > maxLen) {
	                  maxLen = p[i];
	                  centerIdx = i;
	              }
	          }
	          
	          int start = (centerIdx - maxLen) / 2;
	          return s.substring(start, start + maxLen);
	      }
	  
	      public static void main(String[] args) {
	          System.out.println(longestPalindromicSubstring("babad")); // Output: bab
	          System.out.println(longestPalindromicSubstring("cbbd"));  // Output: bb
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <string.h>
	  #include <stdlib.h>
	  
	  int min(int a, int b) {
	      return (a < b) ? a : b;
	  }
	  
	  /* Manacher's Algorithm - Longest Palindromic Substring
	     Time: O(N) | Space: O(N) */
	  void longestPalindromicSubstring(const char* s, char* result) {
	      int len = strlen(s);
	      if (len == 0) {
	          result[0] = '\0';
	          return;
	      }
	  
	      // Transform string: "aba" -> "^#a#b#a#$"
	      int tLen = 2 * len + 3;
	      char* t = (char*)malloc(tLen * sizeof(char));
	      t[0] = '^';
	      t[1] = '#';
	      for (int i = 0; i < len; i++) {
	          t[2 * i + 2] = s[i];
	          t[2 * i + 3] = '#';
	      }
	      t[tLen - 2] = '$';
	      t[tLen - 1] = '\0';
	  
	      int* p = (int*)calloc(tLen, sizeof(int));
	      int c = 0, r = 0;
	  
	      for (int i = 1; i < tLen - 2; i++) {
	          int mirror = 2 * c - i;
	          if (i < r) {
	              p[i] = min(r - i, p[mirror]);
	          }
	  
	          while (t[i + 1 + p[i]] == t[i - 1 - p[i]]) {
	              p[i]++;
	          }
	  
	          if (i + p[i] > r) {
	              c = i;
	              r = i + p[i];
	          }
	      }
	  
	      int maxLen = 0;
	      int centerIdx = 0;
	      for (int i = 1; i < tLen - 2; i++) {
	          if (p[i] > maxLen) {
	              maxLen = p[i];
	              centerIdx = i;
	          }
	      }
	  
	      int start = (centerIdx - maxLen) / 2;
	      strncpy(result, s + start, maxLen);
	      result[maxLen] = '\0';
	  
	      free(t);
	      free(p);
	  }
	  
	  int main() {
	      char result[100];
	      longestPalindromicSubstring("babad", result);
	      printf("%s\n", result); // Output: bab (or aba)
	      longestPalindromicSubstring("cbbd", result);
	      printf("%s\n", result); // Output: bb
	      return 0;
	  }
	  ```
	  
	  :::
-
- # Alternative Variant (Count All Palindromic Substrings)
  collapsed:: true
	- > [!info] Counting Palindromic Substrings in O(N)
	  > Given a string $S$, we can count the total number of palindromic substrings.
	  > - **Base Focus**: Finds and extracts the single longest palindromic substring.
	  > - **Variant Focus**: Counts the total number of palindromic substrings in $O(N)$ time by summing up the potential original palindromes centered at each index: $\sum \lfloor (P[i] + 1) / 2 \rfloor$.
	-
	- :::code-tabs
	  
	  ```python
	  def count_palindromic_substrings(s: str) -> int:
	      """
	      Counts the total number of palindromic substrings in O(N) time.
	      """
	      if not s:
	          return 0
	      t = "^#" + "#".join(s) + "#$"
	      n = len(t)
	      p = [0] * n
	      c, r = 0, 0
	      total_count = 0
	      
	      for i in range(1, n - 1):
	          mirror = 2 * c - i
	          if i < r:
	              p[i] = min(r - i, p[mirror])
	              
	          while t[i + 1 + p[i]] == t[i - 1 - p[i]]:
	              p[i] += 1
	              
	          if i + p[i] > r:
	              c = i
	              r = i + p[i]
	              
	          # Add the number of palindromes centered at index i
	          total_count += (p[i] + 1) // 2
	          
	      return total_count
	  
	  # Example Usage
	  if __name__ == "__main__":
	      print(count_palindromic_substrings("aba"))    # Output: 4 ("a", "b", "a", "aba")
	      print(count_palindromic_substrings("aaa"))    # Output: 6 ("a", "a", "a", "aa", "aa", "aaa")
	  ```
	  
	  ```cpp
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  #include <algorithm>
	  
	  int countPalindromicSubstrings(const std::string& s) {
	      if (s.empty()) return 0;
	      
	      std::string t = "^#";
	      for (char c : s) {
	          t += c;
	          t += '#';
	      }
	      t += '$';
	      
	      int n = t.length();
	      std::vector<int> p(n, 0);
	      int c = 0, r = 0;
	      int totalCount = 0;
	      
	      for (int i = 1; i < n - 1; ++i) {
	          int mirror = 2 * c - i;
	          if (i < r) {
	              p[i] = std::min(r - i, p[mirror]);
	          }
	          
	          while (t[i + 1 + p[i]] == t[i - 1 - p[i]]) {
	              p[i]++;
	          }
	          
	          if (i + p[i] > r) {
	              c = i;
	              r = i + p[i];
	          }
	          
	          totalCount += (p[i] + 1) / 2;
	      }
	      return totalCount;
	  }
	  
	  int main() {
	      std::cout << countPalindromicSubstrings("aba") << "\n"; // Output: 4
	      std::cout << countPalindromicSubstrings("aaa") << "\n"; // Output: 6
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function countPalindromicSubstrings(s) {
	      if (!s) return 0;
	      let t = "^#";
	      for (let i = 0; i < s.length; i++) {
	          t += s[i] + "#";
	      }
	      t += "$";
	      
	      const n = t.length;
	      const p = new Array(n).fill(0);
	      let c = 0, r = 0;
	      let totalCount = 0;
	      
	      for (let i = 1; i < n - 1; i++) {
	          const mirror = 2 * c - i;
	          if (i < r) {
	              p[i] = Math.min(r - i, p[mirror]);
	          }
	          
	          while (t[i + 1 + p[i]] === t[i - 1 - p[i]]) {
	              p[i]++;
	          }
	          
	          if (i + p[i] > r) {
	              c = i;
	              r = i + p[i];
	          }
	          
	          totalCount += Math.floor((p[i] + 1) / 2);
	      }
	      return totalCount;
	  }
	  
	  console.log(countPalindromicSubstrings("aba")); // Output: 4
	  console.log(countPalindromicSubstrings("aaa")); // Output: 6
	  ```
	  
	  ```java
	  public class CountPalindromes {
	      public static int countPalindromicSubstrings(String s) {
	          if (s == null || s.length() == 0) return 0;
	          
	          StringBuilder sb = new StringBuilder("^#");
	          for (int i = 0; i < s.length(); i++) {
	              sb.append(s.charAt(i)).append("#");
	          }
	          sb.append("$");
	          String t = sb.toString();
	          
	          int n = t.length();
	          int[] p = new int[n];
	          int c = 0, r = 0;
	          int totalCount = 0;
	          
	          for (int i = 1; i < n - 1; i++) {
	              int mirror = 2 * c - i;
	              if (i < r) {
	                  p[i] = Math.min(r - i, p[mirror]);
	              }
	              
	              while (t.charAt(i + 1 + p[i]) == t.charAt(i - 1 - p[i])) {
	                  p[i]++;
	              }
	              
	              if (i + p[i] > r) {
	                  c = i;
	                  r = i + p[i];
	              }
	              
	              totalCount += (p[i] + 1) / 2;
	          }
	          return totalCount;
	      }
	  
	      public static void main(String[] args) {
	          System.out.println(countPalindromicSubstrings("aba")); // Output: 4
	          System.out.println(countPalindromicSubstrings("aaa")); // Output: 6
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <string.h>
	  #include <stdlib.h>
	  
	  int minVal(int a, int b) {
	      return (a < b) ? a : b;
	  }
	  
	  int countPalindromicSubstrings(const char* s) {
	      int len = strlen(s);
	      if (len == 0) return 0;
	  
	      int tLen = 2 * len + 3;
	      char* t = (char*)malloc(tLen * sizeof(char));
	      t[0] = '^';
	      t[1] = '#';
	      for (int i = 0; i < len; i++) {
	          t[2 * i + 2] = s[i];
	          t[2 * i + 3] = '#';
	      }
	      t[tLen - 2] = '$';
	      t[tLen - 1] = '\0';
	  
	      int* p = (int*)calloc(tLen, sizeof(int));
	      int c = 0, r = 0;
	      int totalCount = 0;
	  
	      for (int i = 1; i < tLen - 2; i++) {
	          int mirror = 2 * c - i;
	          if (i < r) {
	              p[i] = minVal(r - i, p[mirror]);
	          }
	  
	          while (t[i + 1 + p[i]] == t[i - 1 - p[i]]) {
	              p[i]++;
	          }
	  
	          if (i + p[i] > r) {
	              c = i;
	              r = i + p[i];
	          }
	  
	          totalCount += (p[i] + 1) / 2;
	      }
	  
	      free(t);
	      free(p);
	      return totalCount;
	  }
	  
	  int main() {
	      printf("%d\n", countPalindromicSubstrings("aba")); // Output: 4
	      printf("%d\n", countPalindromicSubstrings("aaa")); // Output: 6
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Manacher's Algorithm
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"What is the task?"}
	      Q -- "Find longest palindromic substring\nor count all palindromes" --> S1{"Is N small (N <= 1000)?"}
	      S1 -- Yes --> R1["Simple O(N^2) center-expansion\nis fine (less overhead)"]
	      S1 -- No --> R2["✅ Use Manacher's Algorithm\nStrict O(N) guarantees safety against timeouts"]
	      Q -- "Find palindromic subsequence\n(not contiguous)" --> R3["❌ Use Dynamic Programming / LCS\n(Manacher's is strictly for substrings)"]
	  ```
	-
	- ## ✅ Use Manacher's Algorithm When
		- You need to find the **longest palindromic substring** or count all palindromic substrings in a very large string ($N > 10^4$).
		- You need strict linear-time complexity and want to avoid worst-case $O(N^2)$ dynamic programming timeouts.
	-
	- ## ❌ Avoid Manacher's Algorithm When
		- The task involves **palindromic subsequences** (which can be non-contiguous). Use Dynamic Programming instead.
		- The string size is very small, where the string transformation overhead ($2N + 3$) exceeds the cost of a naive $O(N^2)$ center expansion.
-
- # Key Takeaways
  collapsed:: true
	- **Linear time** — finds the longest palindromic substring in guaranteed $O(N)$ comparisons.
	- **String transformation** — inserting separator delimiters (like `#`) normalizes even and odd palindromes into odd lengths.
	- **Boundary guards** — prepending `^` and appending `$` prevents index out-of-bounds checks, streamlining loop logic.
	- **Mirroring property** — copies values from symmetric positions across the center, minimizing manual expansion checks.
	- **Substrings only** — only works for contiguous palindromic substrings; does not apply to palindromic subsequences.
	- **Memory overhead** — uses $O(N)$ auxiliary space for the transformed string buffer and radius array.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [TheAlgorithms – Manacher's Algorithm (Python)](https://github.com/TheAlgorithms/Python/blob/master/strings/manacher.py)
		- [GeeksforGeeks — Manacher's Algorithm](https://www.geeksforgeeks.org/manachers-algorithm-linear-time-longest-palindromic-substring-part-1/)