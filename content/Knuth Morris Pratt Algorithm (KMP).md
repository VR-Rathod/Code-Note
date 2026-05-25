---
date: 2026-05-22T17:59:04+05:30
lastmod: 2026-05-22T17:59:04+05:30

seoTitle: Knuth-Morris-Pratt (KMP) Algorithm – O(n + m) String Matching
description: "Detailed guide to the Knuth-Morris-Pratt (KMP) string search algorithm. Explains the Prefix Function (LPS array), iterative implementations in Python, C++, JavaScript, Java, and C, and complexity analysis."
keywords: "KMP algorithm, Knuth-Morris-Pratt, string search, pattern matching, LPS array, prefix function, time complexity, space complexity, iterative KMP, O(n + m), competitive programming, DSA notes"
---

> [!info] What is the Knuth-Morris-Pratt (KMP) Algorithm?
> The **Knuth-Morris-Pratt (KMP)** algorithm is an efficient string-searching (pattern-matching) algorithm that finds all occurrences of a **pattern** string $P$ of length $m$ within a **text** string $T$ of length $n$.
> Unlike the naive approach which checks every index and backtracks the text pointer on mismatch, KMP pre-processes the pattern to identify internal self-similarities. This allows the algorithm to skip redundant character comparisons, achieving a guaranteed **O(n + m)** time complexity.

- # Explanation
  collapsed:: true
	- The fundamental bottleneck of naive string search is **backtracking**. If we are searching for `aaaaab` in `aaaaaaaaab`, a mismatch at the last character forces us to slide the pattern by only 1 index and re-evaluate characters we have already seen.
	- **KMP** avoids this by recognizing that when a mismatch occurs, the matched characters themselves tell us where the next potential match could begin.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine reading the word **"participate"** in a book. If you read **"participa..."** and then see a typo like **"participo"** instead of **"participate"**, you don't start reading the entire sentence again from the second character.
		- Your brain automatically knows you have already successfully matched the prefix **"partic"** and you naturally resume checking from the position of the mismatch, utilizing your memory of what was already read. KMP works exactly like this "memory buffer".
	-
	- ## Why KMP Over Naive Search?
	  collapsed:: true
		- **Naive Search**: Slides the pattern index-by-index. In the worst case (e.g., text `AAAA...A` and pattern `AAAB`), it takes **O(n * m)** time.
		- **KMP**: Pushes the pattern forward dynamically without backtracking the text index. In the worst case, it takes **O(n + m)** time.
		- If searching a 10MB text file for a 1,000-character pattern, Naive Search could perform up to **10 billion comparisons**, whereas KMP performs at most **20 million comparisons**.
-
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- When a mismatch occurs between the text character $T[i]$ and pattern character $P[j]$:
		  1. We do **not** decrement the text pointer $i$.
		  2. We shift the pattern pointer $j$ back to a pre-computed index using our **LPS array** (Longest Prefix Suffix). This index represents the length of the longest proper prefix of the pattern that is also a suffix of the currently matched substring.
		-
		- ```mermaid
		  flowchart TD
		      Start["Start Search Phase"] --> SetPointers["Initialize pointers:\ni = 0 (text index) | j = 0 (pattern index)"]
		      SetPointers --> LoopCheck{"i < n (text length)?"}
		      LoopCheck -- No --> EndMatch["Search Completed"]
		      LoopCheck -- Yes --> MatchChar{"T[i] == P[j]?"}
		      MatchChar -- Yes --> IncPointers["Increment both:\ni = i + 1 | j = j + 1"]
		      IncPointers --> MatchFound{"j == m (pattern length)?"}
		      MatchFound -- Yes --> RecordMatch["✅ Match Found at (i - j)\nShift: j = LPS[j - 1]"]
		      RecordMatch --> LoopCheck
		      MatchFound -- No --> LoopCheck
		      
		      MatchChar -- No --> CheckJ{"j > 0?"}
		      CheckJ -- Yes --> ShiftJ["Shift pattern pointer:\nj = LPS[j - 1] (No backtracking i!)"]
		      ShiftJ --> LoopCheck
		      CheckJ -- No --> IncI["Increment text pointer:\ni = i + 1"]
		      IncI --> LoopCheck
		  ```
	-
	- ## The LPS Array (Longest Prefix Suffix)
	  collapsed:: true
		- The LPS array (also called the *Failure Function* or *pi table*) is a preprocessed array of size $m$ (length of pattern).
		- **Definition**: `LPS[i]` stores the length of the longest proper prefix of the substring `P[0...i]` that is also a suffix of `P[0...i]`.
		- > [!note] Proper Prefix
		  > A prefix of a string that is not the entire string itself. For example, proper prefixes of `"abc"` are `""`, `"a"`, `"ab"`.
		-
		- ### LPS Walkthrough for Pattern `"ababc"`
			- `P[0...0] = "a"`: Prefixes = {}, Suffixes = {} $\rightarrow$ `LPS[0] = 0`
			- `P[0...1] = "ab"`: Prefixes = {"a"}, Suffixes = {"b"} $\rightarrow$ `LPS[1] = 0`
			- `P[0...2] = "aba"`: Prefixes = {"a", "ab"}, Suffixes = {"a", "ba"} $\rightarrow$ Shared: "a" $\rightarrow$ `LPS[2] = 1`
			- `P[0...3] = "abab"`: Prefixes = {"a", "ab", "aba"}, Suffixes = {"b", "ab", "bab"} $\rightarrow$ Shared: "ab" $\rightarrow$ `LPS[3] = 2`
			- `P[0...4] = "ababc"`: Prefixes = {"a", "ab", "aba", "abab"}, Suffixes = {"c", "bc", "abc", "babc"} $\rightarrow$ Shared: None $\rightarrow$ `LPS[4] = 0`
			-
			- **Resulting LPS Array**: `[0, 0, 1, 2, 0]`
	-
	- ## Preprocessing Algorithm (LPS Construction)
	  collapsed:: true
		- The LPS array is constructed in $O(m)$ time using a two-pointer approach:
		- ```
		  INPUT:  pattern string P
		  OUTPUT: LPS array
		  
		  1. Initialize LPS[0] ← 0, length ← 0, i ← 1
		  2. WHILE i < length(P):
		     a. IF P[i] == P[length]:
		        length ← length + 1
		        LPS[i]  ← length
		        i       ← i + 1
		     b. ELSE (P[i] != P[length]):
		        IF length != 0:
		           length ← LPS[length - 1]    (backtrack prefix pointer)
		        ELSE:
		           LPS[i] ← 0
		           i      ← i + 1
		  ```
	-
	- ## Live Walkthrough — Finding `"ababc"` in `"ababcababcabc"`
	  collapsed:: true
		- Let Text $T = \text{"ababcababcabc"}$ and Pattern $P = \text{"ababc"}$.
		- The precomputed LPS array for `"ababc"` is `[0, 0, 1, 2, 0]`.
		-
		- ```
		  T = [ a,  b,  a,  b,  c,  a,  b,  a,  b,  c,  a,  b,  c ]
		  i =   0   1   2   3   4   5   6   7   8   9  10  11  12
		  
		  P = [ a,  b,  a,  b,  c ]
		  j =   0   1   2   3   4
		  ```
		-
		- | Step | i | j | T[i] | P[j] | Action | State / Explanation |
		  |:----:|:-:|:-:|:----:|:----:|:-------|:--------------------|
		  | 1 | 0-4 | 0-4 | `ababc` | `ababc` | Matches! | `i` increments to 5, `j` increments to 5. `j == m` ✅ **Match 1 found at index 0**. |
		  | 2 | 5 | 5 | - | - | Shift `j` | `j = LPS[j-1] = LPS[4] = 0`. Reset pattern pointer to start. |
		  | 3 | 5-9 | 0-4 | `ababc` | `ababc` | Matches! | `i` increments to 10, `j` increments to 5. `j == m` ✅ **Match 2 found at index 5**. |
		  | 4 | 10 | 5 | - | - | Shift `j` | `j = LPS[j-1] = LPS[4] = 0`. Reset pattern pointer. |
		  | 5 | 10-12|0-2| `abc` | `aba` | Mismatch! | `T[12] = 'c'` matches `P[2] = 'a'`. Mismatch at `j=2`. |
		  | 6 | 12 | 2 | `c` | `a` | Shift `j` | `j = LPS[j-1] = LPS[1] = 0`. (No backtracking on `i`!). |
		  | 7 | 12 | 0 | `c` | `a` | Mismatch, `j=0`| `T[12] = 'c'` vs `P[0] = 'a'`. Since `j == 0`, increment `i` to 13. |
		  | 8 | 13 | 0 | - | - | Loop terminates | `i == n` (13). Search ends. |
-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > KMP guarantees linear time complexity: **O(n + m)** time and **O(m)** space.
	  > This bound is strict, regardless of the inputs (no worst-case trap).
	  > For details on linear runtime proofs, see [[Complexity Analysis]].
	-
	- ## Complexity Table
	  collapsed:: true
		- | Case | Time Complexity | Space Complexity | Why |
		  |------|-----------------|------------------|-----|
		  | **Best Case** | **O(n)** | **O(m)** | Minimal mismatches; search slides smoothly. |
		  | **Average Case** | **O(n + m)** | **O(m)** | Normal distributed string characters. |
		  | **Worst Case** | **O(n + m)** | **O(m)** | Repeated structures (e.g. searching `a^k` in `a^p`). |
		  | **Space Complexity**| **O(m)** | **O(m)** | Required to store the LPS array of size $m$. |
	-
	- ## Why is KMP linear? (Amortized Analysis)
	  collapsed:: true
		- It seems like KMP could be slower because of the inner backtracks on `j` (e.g. `j = LPS[j-1]`).
		- However, note that:
			- `j` increases by at most $1$ when `i` increases by $1$.
			- `j` can only decrease via `LPS` shifts.
			- Since `j` starts at $0$ and cannot go below $0$, the total number of decrements of `j` can never exceed the total number of increments.
			- Since `j` can only increment $n$ times (once per text character), the total number of updates to `j` across the entire algorithm is bounded by **2n**.
			- Thus, the runtime is strictly linear: **O(n + m)**.
-
- # Implementation
  collapsed:: true
	- > [!note] All implementations below are **iterative** and return all 0-based start indices of matches.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def kmp_search(text: str, pattern: str) -> list[int]:
	      """
	      KMP String Matching Algorithm
	      Time: O(n + m) | Space: O(m)
	      Returns all starting indices of pattern in text.
	      """
	      n, m = len(text), len(pattern)
	      if m == 0:
	          return []
	      if n < m:
	          return []
	  
	      # Step 1: Preprocess the pattern to construct LPS array
	      lps = [0] * m
	      length = 0  # Length of the previous longest prefix suffix
	      i = 1
	  
	      while i < m:
	          if pattern[i] == pattern[length]:
	              length += 1
	              lps[i] = length
	              i += 1
	          else:
	              if length != 0:
	                  length = lps[length - 1]
	              else:
	                  lps[i] = 0
	                  i += 1
	  
	      # Step 2: Match the pattern in the text
	      matches = []
	      text_ptr = 0     # i
	      pattern_ptr = 0  # j
	  
	      while text_ptr < n:
	          if pattern[pattern_ptr] == text[text_ptr]:
	              text_ptr += 1
	              pattern_ptr += 1
	  
	          if pattern_ptr == m:
	              matches.append(text_ptr - pattern_ptr)
	              pattern_ptr = lps[pattern_ptr - 1]
	          elif text_ptr < n and pattern[pattern_ptr] != text[text_ptr]:
	              if pattern_ptr != 0:
	                  pattern_ptr = lps[pattern_ptr - 1]
	              else:
	                  text_ptr += 1
	  
	      return matches
	  
	  # Example Usage
	  if __name__ == "__main__":
	      text = "ababcababcabc"
	      pattern = "ababc"
	      print("Pattern indices:", kmp_search(text, pattern))  # Output: [0, 5]
	  ```
	  
	  ```cpp
	  #include <iostream>
	  #include <vector>
	  #include <string>
	  
	  // KMP String Matching Algorithm
	  // Time: O(n + m) | Space: O(m)
	  std::vector<int> kmpSearch(const std::string& text, const std::string& pattern) {
	      int n = text.length();
	      int m = pattern.length();
	      
	      if (m == 0 || n < m) return {};
	      
	      // Step 1: Preprocess the pattern to get LPS array
	      std::vector<int> lps(m, 0);
	      int length = 0; // Length of the previous longest prefix suffix
	      int i = 1;
	      
	      while (i < m) {
	          if (pattern[i] == pattern[length]) {
	              length++;
	              lps[i] = length;
	              i++;
	          } else {
	              if (length != 0) {
	                  length = lps[length - 1];
	              } else {
	                  lps[i] = 0;
	                  i++;
	              }
	          }
	      }
	      
	      // Step 2: Match the pattern in the text
	      std::vector<int> matches;
	      int text_ptr = 0;    // i
	      int pattern_ptr = 0; // j
	      
	      while (text_ptr < n) {
	          if (pattern[pattern_ptr] == text[text_ptr]) {
	              text_ptr++;
	              pattern_ptr++;
	          }
	          
	          if (pattern_ptr == m) {
	              matches.push_back(text_ptr - pattern_ptr);
	              pattern_ptr = lps[pattern_ptr - 1];
	          } else if (text_ptr < n && pattern[pattern_ptr] != text[text_ptr]) {
	              if (pattern_ptr != 0) {
	                  pattern_ptr = lps[pattern_ptr - 1];
	              } else {
	                  text_ptr++;
	              }
	          }
	      }
	      
	      return matches;
	  }
	  
	  int main() {
	      std::string text = "ababcababcabc";
	      std::string pattern = "ababc";
	      std::vector<int> indices = kmpSearch(text, pattern);
	      for (int idx : indices) {
	          std::cout << idx << " "; // Output: 0 5
	      }
	      std::cout << std::endl;
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  /**
	   * KMP String Matching Algorithm
	   * Time: O(n + m) | Space: O(m)
	   * @param {string} text
	   * @param {string} pattern
	   * @returns {number[]} Array of starting indices
	   */
	  function kmpSearch(text, pattern) {
	    const n = text.length;
	    const m = pattern.length;
	    
	    if (m === 0 || n < m) return [];
	    
	    // Step 1: Preprocess pattern (LPS array)
	    const lps = new Array(m).fill(0);
	    let length = 0;
	    let i = 1;
	    
	    while (i < m) {
	      if (pattern[i] === pattern[length]) {
	        length++;
	        lps[i] = length;
	        i++;
	      } else {
	        if (length !== 0) {
	          length = lps[length - 1];
	        } else {
	          lps[i] = 0;
	          i++;
	        }
	      }
	    }
	    
	    // Step 2: Match pattern in text
	    const matches = [];
	    let textPtr = 0;
	    let patternPtr = 0;
	    
	    while (textPtr < n) {
	      if (pattern[patternPtr] === text[textPtr]) {
	        textPtr++;
	        patternPtr++;
	      }
	      
	      if (patternPtr === m) {
	        matches.push(textPtr - patternPtr);
	        patternPtr = lps[patternPtr - 1];
	      } else if (textPtr < n && pattern[patternPtr] !== text[textPtr]) {
	        if (patternPtr !== 0) {
	          patternPtr = lps[patternPtr - 1];
	        } else {
	          textPtr++;
	        }
	      }
	    }
	    
	    return matches;
	  }
	  
	  // Example Usage
	  const text = "ababcababcabc";
	  const pattern = "ababc";
	  console.log(kmpSearch(text, pattern)); // Output: [0, 5]
	  ```
	  
	  ```java
	  import java.util.ArrayList;
	  import java.util.List;
	  
	  public class KMPAlgorithm {
	      /**
	       * KMP String Matching Algorithm
	       * Time: O(n + m) | Space: O(m)
	       */
	      public static List<Integer> kmpSearch(String text, String pattern) {
	          List<Integer> matches = new ArrayList<>();
	          int n = text.length();
	          int m = pattern.length();
	          
	          if (m == 0 || n < m) {
	              return matches;
	          }
	          
	          // Step 1: Preprocess pattern (LPS array)
	          int[] lps = new int[m];
	          int length = 0;
	          int i = 1;
	          
	          while (i < m) {
	              if (pattern.charAt(i) == pattern.charAt(length)) {
	                  length++;
	                  lps[i] = length;
	                  i++;
	              } else {
	                  if (length != 0) {
	                      length = lps[length - 1];
	                  } else {
	                      lps[i] = 0;
	                      i++;
	                  }
	              }
	          }
	          
	          // Step 2: Match pattern in text
	          int textPtr = 0;    // i
	          int patternPtr = 0; // j
	          
	          while (textPtr < n) {
	              if (pattern.charAt(patternPtr) == text.charAt(textPtr)) {
	                  textPtr++;
	                  patternPtr++;
	              }
	              
	              if (patternPtr == m) {
	                  matches.add(textPtr - patternPtr);
	                  patternPtr = lps[patternPtr - 1];
	              } else if (textPtr < n && pattern.charAt(patternPtr) != text.charAt(textPtr)) {
	                  if (patternPtr != 0) {
	                      patternPtr = lps[patternPtr - 1];
	                  } else {
	                      textPtr++;
	                  }
	              }
	          }
	          
	          return matches;
	      }
	  
	      public static void main(String[] args) {
	          String text = "ababcababcabc";
	          String pattern = "ababc";
	          System.out.println(kmpSearch(text, pattern)); // Output: [0, 5]
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <string.h>
	  #include <stdlib.h>
	  
	  /**
	   * KMP String Matching Algorithm
	   * Time: O(n + m) | Space: O(m)
	   * Prints all starting indices of matches.
	   */
	  void kmpSearch(const char* text, const char* pattern) {
	      int n = strlen(text);
	      int m = strlen(pattern);
	      
	      if (m == 0 || n < m) {
	          return;
	      }
	      
	      // Allocate memory for LPS array
	      int* lps = (int*)malloc(m * sizeof(int));
	      if (lps == NULL) {
	          return;
	      }
	      
	      // Initialize LPS array
	      lps[0] = 0;
	      int length = 0;
	      int i = 1;
	      
	      while (i < m) {
	          if (pattern[i] == pattern[length]) {
	              length++;
	              lps[i] = length;
	              i++;
	          } else {
	              if (length != 0) {
	                  length = lps[length - 1];
	              } else {
	                  lps[i] = 0;
	                  i++;
	              }
	          }
	      }
	      
	      // Match pattern in text
	      int text_ptr = 0;    // i
	      int pattern_ptr = 0; // j
	      int found_count = 0;
	      
	      while (text_ptr < n) {
	          if (pattern[pattern_ptr] == text[text_ptr]) {
	              text_ptr++;
	              pattern_ptr++;
	          }
	          
	          if (pattern_ptr == m) {
	              printf("Pattern found at index %d\n", text_ptr - pattern_ptr);
	              found_count++;
	              pattern_ptr = lps[pattern_ptr - 1];
	          } else if (text_ptr < n && pattern[pattern_ptr] != text[text_ptr]) {
	              if (pattern_ptr != 0) {
	                  pattern_ptr = lps[pattern_ptr - 1];
	              } else {
	                  text_ptr++;
	              }
	          }
	      }
	      
	      if (found_count == 0) {
	          printf("Pattern not found\n");
	      }
	      
	      free(lps);
	  }
	  
	  int main() {
	      const char* text = "ababcababcabc";
	      const char* pattern = "ababc";
	      kmpSearch(text, pattern); // Output: Pattern found at index 0, Pattern found at index 5
	      return 0;
	  }
	  ```
	  
	  :::
-
- # Alternative Variant (DFA-based KMP)
  collapsed:: true
	- > [!info] DFA-based KMP vs. LPS-based KMP
	  > While the standard LPS-based KMP uses backtracking on mismatch (reducing state transition computations), the **DFA-based (Deterministic Finite Automaton)** variant builds a complete transition table.
	  > - **DFA-based**: Preprocessing takes $O(R \cdot m)$ time and space, where $R$ is the alphabet size (e.g., 256 for ASCII). However, it handles text characters in *strict* $O(1)$ transitions per character without backtracking. Excellent for streaming characters.
	  > - **LPS-based**: Preprocessing takes $O(m)$ time and space, regardless of the alphabet size. Search takes $O(n)$ amortized, but can make up to $2m$ comparisons per character in the worst case (with total bound $2n$).
	-
	- :::code-tabs
	  
	  ```python
	  def kmp_dfa_search(text: str, pattern: str) -> list[int]:
	      """
	      DFA-based KMP Search
	      Time: O(n + R*m) | Space: O(R*m)
	      """
	      R = 256  # ASCII alphabet size
	      m = len(pattern)
	      n = len(text)
	      if m == 0 or n < m:
	          return []
	  
	      # Construct DFA transition table
	      dfa = [[0] * m for _ in range(R)]
	      dfa[ord(pattern[0])][0] = 1
	  
	      x = 0  # Restart state
	      for j in range(1, m):
	          for c in range(R):
	              dfa[c][j] = dfa[c][x]  # Copy mismatch cases
	          dfa[ord(pattern[j])][j] = j + 1  # Set match case
	          x = dfa[ord(pattern[j])][x]  # Update restart state
	  
	      matches = []
	      state = 0
	      for i in range(n):
	          char_val = ord(text[i])
	          if char_val >= R:
	              state = 0
	              continue
	          state = dfa[char_val][state]
	          if state == m:
	              matches.append(i - m + 1)
	              state = x  # Reset to restart state for overlapping matches
	  
	      return matches
	  
	  # Example Usage
	  if __name__ == "__main__":
	      text = "ababa"
	      pattern = "aba"
	      print("DFA indices:", kmp_dfa_search(text, pattern))  # Output: [0, 2]
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <string>
	  
	  // DFA-based KMP Search
	  // Time: O(n + R*m) | Space: O(R*m)
	  std::vector<int> kmpDfaSearch(const std::string& text, const std::string& pattern) {
	      int n = text.length();
	      int m = pattern.length();
	      if (m == 0 || n < m) return {};
	  
	      const int R = 256; // Alphabet size
	      std::vector<std::vector<int>> dfa(R, std::vector<int>(m, 0));
	  
	      // Base case
	      dfa[static_cast<unsigned char>(pattern[0])][0] = 1;
	  
	      int x = 0; // Restart state
	      for (int j = 1; j < m; j++) {
	          for (int c = 0; c < R; c++) {
	              dfa[c][j] = dfa[c][x]; // Copy mismatch cases
	          }
	          dfa[static_cast<unsigned char>(pattern[j])][j] = j + 1; // Match case
	          x = dfa[static_cast<unsigned char>(pattern[j])][x]; // Update restart state
	      }
	  
	      std::vector<int> matches;
	      int state = 0;
	      for (int i = 0; i < n; i++) {
	          unsigned char char_val = text[i];
	          state = dfa[char_val][state];
	          if (state == m) {
	              matches.push_back(i - m + 1);
	              state = x; // Reset to restart state for overlapping matches
	          }
	      }
	      return matches;
	  }
	  
	  int main() {
	      std::string text = "ababa";
	      std::string pattern = "aba";
	      std::vector<int> indices = kmpDfaSearch(text, pattern);
	      for (int idx : indices) {
	          std::cout << idx << " "; // Output: 0 2
	      }
	      std::cout << std::endl;
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  /**
	   * DFA-based KMP Search
	   * Time: O(n + R*m) | Space: O(R*m)
	   */
	  function kmpDfaSearch(text, pattern) {
	    const n = text.length;
	    const m = pattern.length;
	    if (m === 0 || n < m) return [];
	  
	    const R = 256;
	    const dfa = Array.from({ length: R }, () => new Array(m).fill(0));
	  
	    dfa[pattern.charCodeAt(0)][0] = 1;
	  
	    let x = 0; // Restart state
	    for (let j = 1; j < m; j++) {
	      const matchChar = pattern.charCodeAt(j);
	      for (let c = 0; c < R; c++) {
	        dfa[c][j] = dfa[c][x];
	      }
	      dfa[matchChar][j] = j + 1;
	      x = dfa[matchChar][x];
	    }
	  
	    const matches = [];
	    let state = 0;
	    for (let i = 0; i < n; i++) {
	      const charVal = text.charCodeAt(i);
	      if (charVal >= R) {
	        state = 0;
	        continue;
	      }
	      state = dfa[charVal][state];
	      if (state === m) {
	        matches.push(i - m + 1);
	        state = x;
	      }
	    }
	    return matches;
	  }
	  
	  // Example Usage
	  console.log(kmpDfaSearch("ababa", "aba")); // Output: [0, 2]
	  ```
	  
	  ```java
	  import java.util.ArrayList;
	  import java.util.List;
	  
	  public class KMPDfa {
	      /**
	       * DFA-based KMP Search
	       * Time: O(n + R*m) | Space: O(R*m)
	       */
	      public static List<Integer> kmpDfaSearch(String text, String pattern) {
	          int n = text.length();
	          int m = pattern.length();
	          List<Integer> matches = new ArrayList<>();
	          if (m == 0 || n < m) return matches;
	  
	          int R = 256;
	          int[][] dfa = new int[R][m];
	          dfa[pattern.charAt(0)][0] = 1;
	  
	          int x = 0; // Restart state
	          for (int j = 1; j < m; j++) {
	              char matchChar = pattern.charAt(j);
	              for (int c = 0; c < R; c++) {
	                  dfa[c][j] = dfa[c][x];
	              }
	              dfa[matchChar][j] = j + 1;
	              x = dfa[matchChar][x];
	          }
	  
	          int state = 0;
	          for (int i = 0; i < n; i++) {
	              char charVal = text.charAt(i);
	              if (charVal >= R) {
	                  state = 0;
	                  continue;
	              }
	              state = dfa[charVal][state];
	              if (state == m) {
	                  matches.add(i - m + 1);
	                  state = x;
	              }
	          }
	          return matches;
	      }
	  
	      public static void main(String[] args) {
	          System.out.println(kmpDfaSearch("ababa", "aba")); // Output: [0, 2]
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <string.h>
	  #include <stdlib.h>
	  
	  /* DFA-based KMP Search
	     Time: O(n + R*m) | Space: O(R*m) */
	  void kmpDfaSearch(const char* text, const char* pattern) {
	      int n = strlen(text);
	      int m = strlen(pattern);
	      if (m == 0 || n < m) return;
	  
	      int R = 256;
	      int** dfa = (int**)malloc(R * sizeof(int*));
	      for (int i = 0; i < R; i++) {
	          dfa[i] = (int*)calloc(m, sizeof(int));
	      }
	  
	      dfa[(unsigned char)pattern[0]][0] = 1;
	  
	      int x = 0; // Restart state
	      for (int j = 1; j < m; j++) {
	          unsigned char matchChar = pattern[j];
	          for (int c = 0; c < R; c++) {
	              dfa[c][j] = dfa[c][x];
	          }
	          dfa[matchChar][j] = j + 1;
	          x = dfa[matchChar][x];
	      }
	  
	      int state = 0;
	      int found = 0;
	      for (int i = 0; i < n; i++) {
	          unsigned char charVal = text[i];
	          state = dfa[charVal][state];
	          if (state == m) {
	              printf("Pattern found at index %d\n", i - m + 1);
	              found++;
	              state = x;
	          }
	      }
	      if (found == 0) {
	          printf("Pattern not found\n");
	      }
	  
	      for (int i = 0; i < R; i++) {
	          free(dfa[i]);
	      }
	      free(dfa);
	  }
	  
	  int main() {
	      kmpDfaSearch("ababa", "aba"); // Output: Pattern found at index 0, Pattern found at index 2
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use KMP
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Is the search alphabet size large\nor the pattern short?"}
	      Q -- "Large alphabet / Short pattern" --> S1{"Do you have a streaming input\nor need real-time O(1) response?"}
	      S1 -- Yes --> R1["✅ Use DFA-based KMP\nStrict O(1) per-character time"]
	      S1 -- No --> R2["✅ Use standard LPS-based KMP\nMemory efficient O(m) space"]
	      Q -- "Multiple patterns to search" --> R3["❌ Use Aho-Corasick\n(KMP is only for single pattern)"]
	  ```
	-
	- ## ✅ Use KMP When
		- You are searching for a **single fixed pattern** in a large text or input stream.
		- Memory is limited, as the LPS-based version uses only **O(m) space** (unlike Z-algo which uses $O(n+m)$ space).
		- You want to guarantee **worst-case linear time** $O(n + m)$ (avoiding $O(n \cdot m)$ worst-case of Rabin-Karp or Naive).
		- You are searching in data streams where backtracking the text pointer is expensive or impossible.
	-
	- ## ❌ Avoid KMP When
		- You have **multiple patterns** to search for simultaneously (use [[Aho Corasick Algorithm]] or [[Rabin-Karp Algorithm]]).
		- The alphabet size is extremely large and you want to use the DFA variant (which consumes $O(R \cdot m)$ space).
		- The text is small or matching is infrequent, where [[Linear Search]] or Naive matching overhead is negligible.
-
- # Comparisons
  collapsed:: true
	- ## String Search Algorithms Comparison
		- | Algorithm | Time Complexity (Worst) | Space Complexity | Preprocessing Time | Best Used For |
		  |-----------|-------------------------|------------------|--------------------|---------------|
		  | **Naive Search** | $O(n \cdot m)$ | $O(1)$ | None | Tiny texts and short patterns |
		  | **KMP Algorithm** | $O(n + m)$ | $O(m)$ | $O(m)$ | General pattern matching with single pattern |
		  | **[[Rabin-Karp Algorithm]]** | $O(n \cdot m)$ (avg $O(n+m)$) | $O(1)$ | $O(m)$ | Multiple patterns search simultaneously (hashing) |
		  | **[[Z Algorithm]]** | $O(n + m)$ | $O(n + m)$ | $O(n + m)$ | Prefix matching and string analysis (auto-correlations) |
-
- # Key Takeaways
  collapsed:: true
	- **Linear bound** — guarantees $O(n + m)$ string matching without backtracking the text index.
	- **LPS Array** — uses the Longest Prefix Suffix array of size $m$ to determine where to resume matches on failure.
	- **Amortized Analysis** — the text pointer only increments, and the pattern pointer decreases, bound to $2n$ total updates.
	- **DFA Variant** — supports stream matching in strict $O(1)$ time per char at the expense of $O(R \cdot m)$ transition memory.
	- **Single Pattern** — KMP is optimized for a single pattern; multi-pattern matching requires Aho-Corasick or Rabin-Karp.
-
- # More Learn
	- ## GitHub & Webs
		- [TheAlgorithms – KMP (Python)](https://github.com/TheAlgorithms/Python/blob/master/searches/kmp.py)
		- [GeeksforGeeks — KMP Algorithm](https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/)