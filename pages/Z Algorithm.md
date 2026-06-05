---
seoTitle: Z Algorithm – Linear Time String Matching and Pattern Search
description: "The Z algorithm computes the Z-array for O(n+m) pattern matching. Covers Z-function definition, Z-box construction, pattern search application, and comparison."
keywords: "Z algorithm, Z-function, string matching, pattern search, O(n+m), linear time, Z-array, Z-box, time complexity, space complexity, string algorithm"
treeTitle: DSA - String Algorithms - Z Algorithm
---

> [!info] What is the Z Algorithm?
> The Z Algorithm is a powerful string-matching algorithm that finds all occurrences of a pattern in a text in linear **O(N + M)** time.
> It constructs a **Z-array** where each entry $Z[i]$ stores the length of the longest substring starting at index $i$ that is also a prefix of the string, utilizing a sliding window called the **Z-box** to avoid redundant comparisons.

- # Explanation
	- The **Z Algorithm** works by building a Z-array for a concatenated string: $S = Pattern + "\$" + Text$ (where `$` is a special delimiter character not present in either string).
	- Once the Z-array for $S$ is built, any index $i$ where $Z[i]$ equals the length of the pattern represents the start of a match.
	-
	- ## Real-World Analogy
		- Imagine a **scanner** comparing a document against a header. Instead of reading character-by-character from scratch every time, the scanner remembers the **borders of the last matching block (Z-box)**.
		- If it is currently scanning inside a block that it already knows matches the header, it skips reading individual characters by copying the results from the matching portion at the very beginning of the document.
	-
	- ## Why the Z Algorithm?
	  collapsed:: true
		- Similar to [[Knuth Morris Pratt Algorithm (KMP)]], the Z Algorithm solves the string matching problem in linear time.
		- The Z Algorithm is often considered **conceptually simpler** because it only requires building one unified Z-array, rather than KMP's prefix function and state machine transitions.
-
- # How It Works
  collapsed:: true
	- ## The Z-Box Core Idea
	  collapsed:: true
		- We maintain an interval $[L, R]$ (the **Z-box**) which represents the rightmost substring that is also a prefix of the string.
		- For any index $i$, we check if it lies inside the current Z-box ($i \le R$):
		- * **If it lies outside ($i > R$)**: We manually compare characters starting at $i$ with the prefix of the string, expanding $R$ as we find matches, and then set $L = i$.
		- * **If it lies inside ($i \le R$)**: We look at the corresponding index in the prefix: $k = i - L$.
		- * If $Z[k]$ is small enough that the match fits entirely within the Z-box ($i + Z[k] - 1 < R$), we simply copy: $Z[i] = Z[k]$.
		- * If $Z[k]$ exceeds the Z-box boundary, we start manually comparing from $R + 1$ onward, and shift our Z-box boundaries $[L, R]$.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — Set L = R = 0"] --> B["i = 1 to Length-1"]
		      B --> C{"i > R?"}
		      C -- Yes --> D["Compare S[i...] with S[0...]\nFind match length len\nIf len > 0: set L = i, R = i + len - 1\nSet Z[i] = len"]
		      C -- No --> E["Let k = i - L"]
		      E --> F{"Z[k] < R - i + 1?"}
		      F -- Yes --> G["Set Z[i] = Z[k]\n(Direct copy, no comparisons)"]
		      F -- No --> H["Compare from S[R+1] onward to find new matches\nUpdate L = i, R = new right boundary\nSet Z[i] = R - i + 1"]
		      D --> I["i = i + 1"]
		      G --> I
		      H --> I
		      I --> B
		  ```
	-
	- ## Step-by-Step Algorithm
	  collapsed:: true
		- ```
		  INPUT:  string S of length N
		  OUTPUT: Z-array of size N
		  
		  1. Initialize Z array of size N with 0s.
		  2. Set L ← 0, R ← 0
		  
		  3. FOR i from 1 to N - 1:
		     a. IF i > R:
		        L ← i, R ← i
		        WHILE R < N and S[R - L] == S[R]:
		           R ← R + 1
		        Z[i] ← R - L
		        R ← R - 1
		     b. ELSE:
		        k ← i - L
		        IF Z[k] < R - i + 1:
		           Z[i] ← Z[k]
		        ELSE:
		           L ← i
		           WHILE R < N and S[R - L] == S[R]:
		              R ← R + 1
		           Z[i] ← R - L
		           R ← R - 1
		  4. RETURN Z
		  ```
	-
	- ## Live Walkthrough — Building Z-array for "aabaa"
	  collapsed:: true
		- Let's construct the Z-array for string $S = `"aabaa"`$.
		-
		- ```
		  S =     [ a,  a,  b,  a,  a ]
		  Index     0   1   2   3   4
		  ```
		  | Index |  L |  R | Z[i] | Calculation & Explanation |
		   |   0    |0  | 0 |  0  | Ignored by definition (matches full string). |
		   |  1    | 1  | 1  |  1   | i > R (1 > 0). Compare S[1] vs S[0] ('a'=='a'). |
		   | | | | | S[2] vs S[1] ('b'!='a'). L=1, R=1, Z[1]=1. |
		   |  2    | 1  |1  |  0   | i > R (2 > 1). Compare S[2] vs S[0] ('b'!='a').  |
		   ||||| Z[2]=0. L and R unchanged. |
		   |  3  | 3  | 4  |  2   | i > R (3 > 1). Compare S[3] vs S[0] ('a'=='a'),  |
		   ||||| S[4] vs S[1] ('a'=='a'). L=3, R=4, Z[3]=2.    |
		   |  4    | 3   | 4 |  1  | i <= R (4 <= 4). k = 4-3 = 1. Z[1] = 1.  |
		   ||||| Since Z[k] (1) < R-i+1 (4-4+1 = 1) is false:    |
		   | || | |L=4, check S[5] (out of bounds). Z[4]=1.     |
		- ```
		  Z-array for "aabaa": [0, 1, 0, 2, 1]
		  ```
			-
-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > - **Time Complexity: O(N)** — every character in the string is compared at most once when expanding the right boundary $R$.
	  > - **Space Complexity: O(N)** — to store the Z-array of size $N$.
	-
	- ## Complexity Table
	  collapsed:: true
		- | Scenario | Time Complexity | Space Complexity | Why |
		  |------|------|-----|-----|
		  | **Z-Array Construction** | **O(N)** | **O(N)** | At each step, either we directly copy values ($O(1)$) or we advance the $R$ pointer. Since $R$ only moves forward, there are at most $2N$ comparisons. |
		  | **Pattern Search** | **O(N + M)** | **O(N + M)** | Concatenated string has length $N + M + 1$. Z-array requires matching memory size. |
-
- # Implementation
  collapsed:: true
	- > [!note] Linear-time Z-array creation and pattern search.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def compute_z(s):
	      """
	      Computes Z-array in O(N) time
	      """
	      n = len(s)
	      z = [0] * n
	      l, r = 0, 0
	  
	      for i in range(1, n):
	          if i <= r:
	              z[i] = min(r - i + 1, z[i - l])
	          while i + z[i] < n and s[z[i]] == s[i + z[i]]:
	              z[i] += 1
	          if i + z[i] - 1 > r:
	              l = i
	              r = i + z[i] - 1
	      return z
	  
	  def z_search(text, pattern):
	      """
	      Searches for pattern in text using Z Algorithm
	      """
	      combined = pattern + "$" + text
	      z = compute_z(combined)
	      m = len(pattern)
	      matches = []
	  
	      for i in range(m + 1, len(combined)):
	          if z[i] == m:
	              matches.append(i - m - 1)  # Map index back to original text
	      return matches
	  
	  # Example
	  text = "ABABDABACDABABCABAB"
	  pattern = "ABABCABAB"
	  print("Pattern found at indices:", z_search(text, pattern))
	  # Output: [10]
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  #include <algorithm>
	  
	  // Compute Z Array
	  std::vector<int> computeZ(const std::string& s) {
	      int n = s.length();
	      std::vector<int> z(n, 0);
	      int l = 0, r = 0;
	  
	      for (int i = 1; i < n; i++) {
	          if (i <= r) {
	              z[i] = std::min(r - i + 1, z[i - l]);
	          }
	          while (i + z[i] < n && s[z[i]] == s[i + z[i]]) {
	              z[i]++;
	          }
	          if (i + z[i] - 1 > r) {
	              l = i;
	              r = i + z[i] - 1;
	          }
	      }
	      return z;
	  }
	  
	  // Z Search
	  std::vector<int> zSearch(const std::string& text, const std::string& pattern) {
	      std::string combined = pattern + "$" + text;
	      std::vector<int> z = computeZ(combined);
	      std::vector<int> matches;
	      int m = pattern.length();
	  
	      for (int i = m + 1; i < (int)combined.length(); i++) {
	          if (z[i] == m) {
	              matches.push_back(i - m - 1);
	          }
	      }
	      return matches;
	  }
	  
	  int main() {
	      std::string text = "ABABDABACDABABCABAB";
	      std::string pattern = "ABABCABAB";
	      std::vector<int> indices = zSearch(text, pattern);
	      for (int idx : indices) {
	          std::cout << "Pattern found at: " << idx << "\n";
	      }
	      // Output: 10
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function computeZ(s) {
	      const n = s.length;
	      const z = new Array(n).fill(0);
	      let l = 0, r = 0;
	  
	      for (let i = 1; i < n; i++) {
	          if (i <= r) {
	              z[i] = Math.min(r - i + 1, z[i - l]);
	          }
	          while (i + z[i] < n && s[z[i]] === s[i + z[i]]) {
	              z[i]++;
	          }
	          if (i + z[i] - 1 > r) {
	              l = i;
	              r = i + z[i] - 1;
	          }
	      }
	      return z;
	  }
	  
	  function zSearch(text, pattern) {
	      const combined = pattern + "$" + text;
	      const z = computeZ(combined);
	      const matches = [];
	      const m = pattern.length;
	  
	      for (let i = m + 1; i < combined.length; i++) {
	          if (z[i] === m) {
	              matches.push(i - m - 1);
	          }
	      }
	      return matches;
	  }
	  
	  const text = "ABABDABACDABABCABAB";
	  const pattern = "ABABCABAB";
	  console.log(zSearch(text, pattern)); // Output: [10]
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class ZAlgorithm {
	      private static int[] computeZ(String s) {
	          int n = s.length();
	          int[] z = new int[n];
	          int l = 0, r = 0;
	  
	          for (int i = 1; i < n; i++) {
	              if (i <= r) {
	                  z[i] = Math.min(r - i + 1, z[i - l]);
	              }
	              while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i])) {
	                  z[i]++;
	              }
	              if (i + z[i] - 1 > r) {
	                  l = i;
	                  r = i + z[i] - 1;
	              }
	          }
	          return z;
	      }
	  
	      public static List<Integer> search(String text, String pattern) {
	          String combined = pattern + "$" + text;
	          int[] z = computeZ(combined);
	          List<Integer> matches = new ArrayList<>();
	          int m = pattern.length();
	  
	          for (int i = m + 1; i < combined.length(); i++) {
	              if (z[i] == m) {
	                  matches.add(i - m - 1);
	              }
	          }
	          return matches;
	      }
	  
	      public static void main(String[] args) {
	          String text = "ABABDABACDABABCABAB";
	          String pattern = "ABABCABAB";
	          System.out.println(search(text, pattern)); // Output: [10]
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
	  
	  void computeZ(char s[], int z[], int n) {
	      int l = 0, r = 0;
	      z[0] = 0;
	  
	      for (int i = 1; i < n; i++) {
	          z[i] = 0;
	          if (i <= r) {
	              z[i] = min(r - i + 1, z[i - l]);
	          }
	          while (i + z[i] < n && s[z[i]] == s[i + z[i]]) {
	              z[i]++;
	          }
	          if (i + z[i] - 1 > r) {
	              l = i;
	              r = i + z[i] - 1;
	          }
	      }
	  }
	  
	  void zSearch(char text[], char pattern[]) {
	      int m = strlen(pattern);
	      int n = strlen(text);
	      int combinedLen = m + 1 + n;
	      char* combined = (char*)malloc((combinedLen + 1) * sizeof(char));
	  
	      strcpy(combined, pattern);
	      combined[m] = '$';
	      strcpy(combined + m + 1, text);
	  
	      int* z = (int*)malloc(combinedLen * sizeof(int));
	      computeZ(combined, z, combinedLen);
	  
	      for (int i = m + 1; i < combinedLen; i++) {
	          if (z[i] == m) {
	              printf("Pattern found at index %d\n", i - m - 1);
	          }
	      }
	  
	      free(combined);
	      free(z);
	  }
	  
	  int main() {
	      char text[] = "ABABDABACDABABCABAB";
	      char pattern[] = "ABABCABAB";
	      zSearch(text, pattern); // Output: Pattern found at index 10
	      return 0;
	  }
	  ```
	  
	  :::
-
- # Alternative Variant (String Compression & Periodicity Checker)
  collapsed:: true
	- > [!info] Z-Array for String Periodicity
	  > Given a string $S$ of length $N$, we can determine if it is composed of a smaller repeated substring (i.e. is periodic) and find its smallest repeating period $p$.
	  > - **Base Focus**: Matches a target pattern inside a text using a concatenated string $Pattern + "\$" + Text$.
	  > - **Variant Focus**: Checks the self-similarity of a single string $S$ by analyzing if there exists a period length $p$ such that $p + Z[p] == N$ and $N \pmod p == 0$. The smallest such $p$ is the fundamental period.
	-
	- :::code-tabs
	  
	  ```python
	  def compute_z(s: str) -> list[int]:
	      n = len(s)
	      z = [0] * n
	      l, r = 0, 0
	      for i in range(1, n):
	          if i <= r:
	              z[i] = min(r - i + 1, z[i - l])
	          while i + z[i] < n and s[z[i]] == s[i + z[i]]:
	              z[i] += 1
	          if i + z[i] - 1 > r:
	              l = i
	              r = i + z[i] - 1
	      return z
	  
	  def find_smallest_period(s: str) -> int:
	      """
	      Returns the length of the smallest repeating unit of s.
	      If the string cannot be compressed, returns the length of s.
	      Time: O(N) | Space: O(N)
	      """
	      n = len(s)
	      if n == 0:
	          return 0
	      z = compute_z(s)
	      for i in range(1, n):
	          if i + z[i] == n and n % i == 0:
	              return i
	      return n
	  
	  # Example Usage
	  if __name__ == "__main__":
	      print(find_smallest_period("ababab"))  # Output: 2 ("ab")
	      print(find_smallest_period("aaaaaa"))  # Output: 1 ("a")
	      print(find_smallest_period("aba"))     # Output: 3 ("aba" - not periodic)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  #include <algorithm>
	  
	  std::vector<int> computeZ(const std::string& s) {
	      int n = s.length();
	      std::vector<int> z(n, 0);
	      int l = 0, r = 0;
	      for (int i = 1; i < n; i++) {
	          if (i <= r) {
	              z[i] = std::min(r - i + 1, z[i - l]);
	          }
	          while (i + z[i] < n && s[z[i]] == s[i + z[i]]) {
	              z[i]++;
	          }
	          if (i + z[i] - 1 > r) {
	              l = i;
	              r = i + z[i] - 1;
	          }
	      }
	      return z;
	  }
	  
	  int findSmallestPeriod(const std::string& s) {
	      int n = s.length();
	      if (n == 0) return 0;
	      std::vector<int> z = computeZ(s);
	      for (int i = 1; i < n; i++) {
	          if (i + z[i] == n && n % i == 0) {
	              return i;
	          }
	      }
	      return n;
	  }
	  
	  int main() {
	      std::cout << findSmallestPeriod("ababab") << "\n"; // Output: 2
	      std::cout << findSmallestPeriod("aaaaaa") << "\n"; // Output: 1
	      std::cout << findSmallestPeriod("aba") << "\n";    // Output: 3
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function computeZ(s) {
	      const n = s.length;
	      const z = new Array(n).fill(0);
	      let l = 0, r = 0;
	      for (let i = 1; i < n; i++) {
	          if (i <= r) {
	              z[i] = Math.min(r - i + 1, z[i - l]);
	          }
	          while (i + z[i] < n && s[z[i]] === s[i + z[i]]) {
	              z[i]++;
	          }
	          if (i + z[i] - 1 > r) {
	              l = i;
	              r = i + z[i] - 1;
	          }
	      }
	      return z;
	  }
	  
	  function findSmallestPeriod(s) {
	      const n = s.length;
	      if (n === 0) return 0;
	      const z = computeZ(s);
	      for (let i = 1; i < n; i++) {
	          if (i + z[i] === n && n % i === 0) {
	              return i;
	          }
	      }
	      return n;
	  }
	  
	  // Example Usage
	  console.log(findSmallestPeriod("ababab")); // Output: 2
	  console.log(findSmallestPeriod("aaaaaa")); // Output: 1
	  console.log(findSmallestPeriod("aba"));    // Output: 3
	  ```
	  
	  ```java
	  import java.util.Arrays;
	  
	  public class ZPeriodicity {
	      private static int[] computeZ(String s) {
	          int n = s.length();
	          int[] z = new int[n];
	          int l = 0, r = 0;
	          for (int i = 1; i < n; i++) {
	              if (i <= r) {
	                  z[i] = Math.min(r - i + 1, z[i - l]);
	              }
	              while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i])) {
	                  z[i]++;
	              }
	              if (i + z[i] - 1 > r) {
	                  l = i;
	                  r = i + z[i] - 1;
	              }
	          }
	          return z;
	      }
	  
	      public static int findSmallestPeriod(String s) {
	          int n = s.length();
	          if (n == 0) return 0;
	          int[] z = computeZ(s);
	          for (int i = 1; i < n; i++) {
	              if (i + z[i] == n && n % i == 0) {
	                  return i;
	              }
	          }
	          return n;
	      }
	  
	      public static void main(String[] args) {
	          System.out.println(findSmallestPeriod("ababab")); // Output: 2
	          System.out.println(findSmallestPeriod("aaaaaa")); // Output: 1
	          System.out.println(findSmallestPeriod("aba"));    // Output: 3
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
	  
	  void computeZ(const char* s, int z[], int n) {
	      int l = 0, r = 0;
	      z[0] = 0;
	      for (int i = 1; i < n; i++) {
	          z[i] = 0;
	          if (i <= r) {
	              z[i] = minVal(r - i + 1, z[i - l]);
	          }
	          while (i + z[i] < n && s[z[i]] == s[i + z[i]]) {
	              z[i]++;
	          }
	          if (i + z[i] - 1 > r) {
	              l = i;
	              r = i + z[i] - 1;
	          }
	      }
	  }
	  
	  int findSmallestPeriod(const char* s) {
	      int n = strlen(s);
	      if (n == 0) return 0;
	      int* z = (int*)malloc(n * sizeof(int));
	      computeZ(s, z, n);
	      int period = n;
	      for (int i = 1; i < n; i++) {
	          if (i + z[i] == n && n % i == 0) {
	              period = i;
	              break;
	          }
	      }
	      free(z);
	      return period;
	  }
	  
	  int main() {
	      printf("%d\n", findSmallestPeriod("ababab")); // Output: 2
	      printf("%d\n", findSmallestPeriod("aaaaaa")); // Output: 1
	      printf("%d\n", findSmallestPeriod("aba"));    // Output: 3
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Z Algorithm
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"What is the query constraint?"}
	      Q -- "Need simple linear string search" --> R1["✅ Use Z Algorithm\nEasy to construct and maintain compared to state transitions"]
	      Q -- "Memory is highly constrained" --> R2["Consider naive or rolling hash\n(Z Algorithm requires O(N+M) auxiliary space)"]
	      Q -- "Find string periods / cyclic properties" --> R3["✅ Use Z Algorithm\nZ-values reveal repetitive patterns directly"]
	  ```
	-
	- ## ✅ Use Z Algorithm When
		- You need a **linear-time** string search and want a simpler implementation than KMP.
		- You need to find **cyclic periods** in a string or check string compression properties.
		- You want to solve problems where you need to check if a prefix of a string matches a substring at index $i$.
		- You want to solve complex string matching/alignment variants where building a unified Z-array is easier than LPS tracking.
	-
	- ## ❌ Avoid Z Algorithm When
		- You cannot afford $O(N + M)$ extra space (KMP and Boyer-Moore can do search with less space once the pattern prefix-table is built).
		- You have multiple patterns to search simultaneously (use [[Aho Corasick Algorithm]]).
-
- # Key Takeaways
  collapsed:: true
	- **Core idea** — calculates the length of matching prefixes starting at each index using a sliding Z-box window.
	- **Z-box optimization** — reuse precalculated values within the [L, R] boundary to achieve $O(N)$ construction.
	- **Search pattern** — run Z Algorithm on $Pattern + "\$" + Text$; where $Z[i] == M$ is a match.
	- **Linear bound** — comparisons only occur when expanding the right-boundary $R$, ensuring overall $O(N)$ operations.
	- **Periodicity detection** — if $i + Z[i] == N$ and $N \pmod i == 0$, then the prefix of length $i$ is the repeating period.
	- **Auxiliary space** — consumes $O(N)$ space for the Z-array, which makes it slightly less memory-efficient than KMP's $O(M)$ buffer.
-
- # More Learn
	- ## GitHub & Webs
		- [TheAlgorithms – Z Algorithm (Python)](https://github.com/TheAlgorithms/Python/blob/master/searches/z_algorithm.py)
		- [GeeksforGeeks — Z Algorithm](https://www.geeksforgeeks.org/z-algorithm-linear-time-pattern-searching-algorithm/)