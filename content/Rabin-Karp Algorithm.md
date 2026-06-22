---
seoTitle: Rabin-Karp Algorithm – Rolling Hash String Search Explained
description: "Rabin-Karp uses rolling hash for O(n+m) average pattern matching. Covers polynomial rolling hash, hash collision handling, multiple pattern search, and Rabin."
keywords: "Rabin-Karp, rolling hash, string search, pattern matching, polynomial hash, hash collision, O(n+m), time complexity, space complexity, multiple pattern search"
treeTitle: DSA - String Algorithms - Rabin-Karp Algorithm
---

> [!info] What is the Rabin-Karp Algorithm?
> Rabin-Karp is a string-searching algorithm that uses a **rolling hash** to find a pattern string within a text string.
> By sliding a window over the text and updating the hash in **O(1)** time, it achieves an average time complexity of **O(N + M)**, making it highly effective for **multiple pattern search** and plagiarism detection.

- # Explanation
	- **Rabin-Karp** works by hashing the pattern, then hashing every substring of the same length in the text.
	- Instead of checking every character at every position (which is $O(N \times M)$), it compares the **hash value** first.
	- If the hash values match, it performs a character-by-character check to confirm the match (resolving any potential **hash collisions**). If the hashes do not match, it moves to the next window immediately.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine sorting through **sealed packages** looking for one that weighs exactly 5.4 kg.
		- Instead of opening every single box and examining the contents, you put each box on a scale. If a box weighs 5.2 kg, you move on immediately. If a box weighs exactly 5.4 kg, you open it to double-check if it contains the correct items (handling the "collision" of another item having the same weight).
	-
	- ## Why Rabin-Karp?
		- Standard algorithms like [[Knuth Morris Pratt Algorithm]] are optimized for searching a single pattern.
		- Rabin-Karp is uniquely suited for **multiple pattern searches** (e.g., searching for 100 different keywords in a document at once). By using a hash table of pattern hashes, we can search for all patterns simultaneously in a single pass of the text.
-
- # How It Works
  collapsed:: true
	- ## The Rolling Hash Core Idea
	  collapsed:: true
		- In a naive search, computing the hash of each window of length $M$ takes $O(M)$ time.
		- Rabin-Karp uses a **polynomial rolling hash** that lets us compute the next window's hash from the previous window's hash in **O(1)** time.
		-
		- If we slide the window from index $i$ to $i+1$, we subtract the contribution of the leftmost character ($Text[i]$) and add the contribution of the new rightmost character ($Text[i+M]$):
		-
		- $$Hash_{next} = \left( d \times (Hash_{prev} - Text[i] \times d^{M-1}) + Text[i+M] \right) \pmod q$$
		-
		- Where:
		- * $d$ is the number of characters in the alphabet (e.g., 256 for ASCII).
		- * $q$ is a large prime number (to prevent integer overflow and minimize collisions).
		-
		- ```mermaid
		  flowchart TD
		      A["Start — Compute hash of Pattern and first Text window"] --> B["i = 0  |  Limit = N - M"]
		      B --> C{"i <= Limit?"}
		      C -- No --> H["❌ End — Search Complete"]
		      C -- Yes --> D{"Pattern Hash == Window Hash?"}
		      D -- Yes --> E{"Do characters match exactly?\n(Verify collision)"}
		      E -- Yes --> F["✅ Record Match at index i"]
		      E -- No --> G
		      D -- No --> G["Compute rolling hash for next window"]
		      F --> G
		      G --> I["i = i + 1"]
		      I --> C
		  ```
	-
	- ## Step-by-Step Algorithm
		- ```
		  INPUT:  text T, pattern P, base d, prime q
		  OUTPUT: indices where P matches in T
		  
		  1. N ← length(T), M ← length(P)
		  2. h ← d^(M-1) mod q
		  3. p_hash ← 0, t_hash ← 0
		  
		  4. FOR j from 0 to M - 1:
		     p_hash ← (d * p_hash + P[j]) mod q
		     t_hash ← (d * t_hash + T[j]) mod q
		     
		  5. FOR i from 0 to N - M:
		     a. IF p_hash == t_hash:
		        IF T[i...i+M-1] == P:
		           Output "Match found at index i"
		     b. IF i < N - M:
		        t_hash ← (d * (t_hash - T[i] * h) + T[i + M]) mod q
		        IF t_hash < 0:
		           t_hash ← t_hash + q
		  ```
	-
	- ## Live Walkthrough — Finding "ABA" in "BABA" (d=10, q=13)
		- Let's search for Pattern = `"ABA"` in Text = `"BABA"`.
		- Characters map to ASCII values: `'A' = 65`, `'B' = 66`. Let's use simple values: `'A' = 1`, `'B' = 2` for illustration.
		- $M = 3$, $d = 10$, $q = 13$.
		- $h = 10^{(3-1)} \pmod{13} = 100 \pmod{13} = 9$.
		-
		- **Pattern Hash**:
		- $p\_hash = (1 \times 10^2 + 2 \times 10^1 + 1 \times 1) \pmod{13} = 121 \pmod{13} = 4$.
		-
		- Let's slide the window:
		- ```
		  Text = [ B, A, B, A ]
		  Index  0  1  2  3
		  
		  ┌─────────────────────────────────────────────────────────────────────────────┐
		  │ Step │ Window │ Text Substring │ Hash Value      │ Match Status             │
		  ├─────────────────────────────────────────────────────────────────────────────┤
		  │  1   │ i = 0  │ "BAB"          │ (2*100+1*10+2)  │ Hash: 212 mod 13 = 4     │
		  │      │        │                │                 │ Hashes match! Check chars│
		  │      │        │                │                 │ "BAB" != "ABA" ❌ Collision│
		  ├─────────────────────────────────────────────────────────────────────────────┤
		  │  2   │ i = 1  │ "ABA"          │ (10*(4-2*9)+1)  │ Rolling calculation:     │
		  │      │        │                │                 │ Hash: (10*(4-18)+1)      │
		  │      │        │                │                 │      = -139 mod 13 = 4   │
		  │      │        │                │                 │ Hashes match! Check chars│
		  │      │        │                │                 │ "ABA" == "ABA" ✅ MATCH  │
		  └─────────────────────────────────────────────────────────────────────────────┘
		  ```
-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > - **Average & Best Case Time: O(N + M)** — rolling hash updates in $O(1)$ and collisions are rare.
	  > - **Worst Case Time: O(N × M)** — happens if the prime modulus is too small or the hash function is poor, causing a collision on every single window (forcing $O(M)$ character comparisons at each step).
	  > - **Space Complexity: O(1)** — only a few integer variables are kept in memory.
	-
	- ## Complexity Table
	  collapsed:: true
		- | Case | Time Complexity | Space Complexity | Why |
		  |------|------|-----|-----|
		  | **Best Case** | **O(N + M)** | **O(1)** | Precomputes pattern hash in $O(M)$ time, scans text in $O(N)$ with no collisions. |
		  | **Average Case**| **O(N + M)** | **O(1)** | Minimal collisions, resolving checks takes negligible time. |
		  | **Worst Case** | **O(N × M)** | **O(1)** | Spurious hits (collisions) on every window check. |
-
- # Implementation
  collapsed:: true
	- > [!note] Standard iterative implementation of Rabin-Karp algorithm.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def rabin_karp(text, pattern, d=256, q=101):
	      """
	      Rabin-Karp String Search
	      Time: O(N + M) avg, O(N*M) worst | Space: O(1)
	      """
	      n, m = len(text), len(pattern)
	      if m > n:
	          return []
	  
	      h = pow(d, m - 1, q)
	      p_hash = 0
	      t_hash = 0
	      matches = []
	  
	      # Precompute hash values
	      for i in range(m):
	          p_hash = (d * p_hash + ord(pattern[i])) % q
	          t_hash = (d * t_hash + ord(text[i])) % q
	  
	      for i in range(n - m + 1):
	          # If hashes match, verify characters
	          if p_hash == t_hash:
	              if text[i : i + m] == pattern:
	                  matches.append(i)
	  
	          # Slide window
	          if i < n - m:
	              t_hash = (d * (t_hash - ord(text[i]) * h) + ord(text[i + m])) % q
	              # Ensure positive hash value
	              if t_hash < 0:
	                  t_hash += q
	  
	      return matches
	  
	  # Example
	  text = "ABABDABACDABABCABAB"
	  pattern = "ABABCABAB"
	  print("Matches found at indices:", rabin_karp(text, pattern))
	  # Output: [10]
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  #include <cmath>
	  
	  // Rabin-Karp String Matching
	  std::vector<int> rabinKarp(const std::string& text, const std::string& pattern, int d = 256, int q = 101) {
	      int n = text.length();
	      int m = pattern.length();
	      std::vector<int> matches;
	  
	      if (m > n) return matches;
	  
	      // Calculate h = d^(m-1) % q
	      int h = 1;
	      for (int i = 0; i < m - 1; i++) {
	          h = (h * d) % q;
	      }
	  
	      int p_hash = 0;
	      int t_hash = 0;
	  
	      // Calculate initial hashes
	      for (int i = 0; i < m; i++) {
	          p_hash = (d * p_hash + pattern[i]) % q;
	          t_hash = (d * t_hash + text[i]) % q;
	      }
	  
	      for (int i = 0; i <= n - m; i++) {
	          if (p_hash == t_hash) {
	              // Double check actual characters
	              if (text.substr(i, m) == pattern) {
	                  matches.push_back(i);
	              }
	          }
	  
	          if (i < n - m) {
	              t_hash = (d * (t_hash - text[i] * h) + text[i + m]) % q;
	              if (t_hash < 0) {
	                  t_hash += q;
	              }
	          }
	      }
	      return matches;
	  }
	  
	  int main() {
	      std::string text = "ABABDABACDABABCABAB";
	      std::string pattern = "ABABCABAB";
	      std::vector<int> results = rabinKarp(text, pattern);
	      for (int idx : results) {
	          std::cout << "Pattern found at index: " << idx << "\n";
	      }
	      // Output: 10
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function rabinKarp(text, pattern, d = 256, q = 101) {
	      const n = text.length;
	      const m = pattern.length;
	      const matches = [];
	  
	      if (m > n) return matches;
	  
	      let h = 1;
	      for (let i = 0; i < m - 1; i++) {
	          h = (h * d) % q;
	      }
	  
	      let pHash = 0;
	      let tHash = 0;
	  
	      for (let i = 0; i < m; i++) {
	          pHash = (d * pHash + pattern.charCodeAt(i)) % q;
	          tHash = (d * tHash + text.charCodeAt(i)) % q;
	      }
	  
	      for (let i = 0; i <= n - m; i++) {
	          if (pHash === tHash) {
	              if (text.substring(i, i + m) === pattern) {
	                  matches.push(i);
	              }
	          }
	  
	          if (i < n - m) {
	              tHash = (d * (tHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
	              if (tHash < 0) {
	                  tHash += q;
	              }
	          }
	      }
	      return matches;
	  }
	  
	  const text = "ABABDABACDABABCABAB";
	  const pattern = "ABABCABAB";
	  console.log(rabinKarp(text, pattern)); // Output: [10]
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class RabinKarp {
	      public static List<Integer> search(String text, String pattern) {
	          int d = 256; // Alphabet size
	          int q = 101; // Large prime
	          int n = text.length();
	          int m = pattern.length();
	          List<Integer> matches = new ArrayList<>();
	  
	          if (m > n) return matches;
	  
	          int h = 1;
	          for (int i = 0; i < m - 1; i++) {
	              h = (h * d) % q;
	          }
	  
	          int pHash = 0;
	          int tHash = 0;
	  
	          for (int i = 0; i < m; i++) {
	              pHash = (d * pHash + pattern.charAt(i)) % q;
	              tHash = (d * tHash + text.charAt(i)) % q;
	          }
	  
	          for (int i = 0; i <= n - m; i++) {
	              if (pHash == tHash) {
	                  if (text.substring(i, i + m).equals(pattern)) {
	                      matches.add(i);
	                  }
	              }
	  
	              if (i < n - m) {
	                  tHash = (d * (tHash - text.charAt(i) * h) + text.charAt(i + m)) % q;
	                  if (tHash < 0) {
	                      tHash += q;
	                  }
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
	  
	  void rabinKarp(char text[], char pattern[], int d, int q) {
	      int n = strlen(text);
	      int m = strlen(pattern);
	      int p_hash = 0;
	      int t_hash = 0;
	      int h = 1;
	  
	      // Calculate h = d^(m-1) % q
	      for (int i = 0; i < m - 1; i++) {
	          h = (h * d) % q;
	      }
	  
	      // Initial hash values
	      for (int i = 0; i < m; i++) {
	          p_hash = (d * p_hash + pattern[i]) % q;
	          t_hash = (d * t_hash + text[i]) % q;
	      }
	  
	      for (int i = 0; i <= n - m; i++) {
	          if (p_hash == t_hash) {
	              // Collision verification
	              int j;
	              for (j = 0; j < m; j++) {
	                  if (text[i + j] != pattern[j])
	                      break;
	              }
	              if (j == m) {
	                  printf("Pattern found at index %d\n", i);
	              }
	          }
	  
	          if (i < n - m) {
	              t_hash = (d * (t_hash - text[i] * h) + text[i + m]) % q;
	              if (t_hash < 0) {
	                  t_hash += q;
	              }
	          }
	      }
	  }
	  
	  int main() {
	      char text[] = "ABABDABACDABABCABAB";
	      char pattern[] = "ABABCABAB";
	      rabinKarp(text, pattern, 256, 101); // Output: Pattern found at index 10
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Rabin-Karp
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"What is the search scenario?"}
	      Q -- "Find multiple patterns at once" --> R1["✅ Use Rabin-Karp\nHash set check makes it scale extremely well"]
	      Q -- "Single pattern search in large text" --> R2["Consider KMP or Boyer-Moore\n(better worst-case complexity)"]
	      Q -- "Plagiarism detection / DNA matching" --> R3["✅ Use Rabin-Karp\nIdeal for sliding window substring comparisons"]
	  ```
	-
	- ## ✅ Use Rabin-Karp When
		- You want to perform **multiple pattern matching** simultaneously (e.g., checking text against a dictionary of vulgar words).
		- You need to build a **plagiarism detector** (comparing overlaps of fixed-length sentences or shingles).
		- You are processing **biological sequence data** where you search for multiple patterns/genes.
	-
	- ## ❌ Avoid Rabin-Karp When
		- You are only searching for a **single pattern** on large datasets — Boyer-Moore or KMP are generally faster and avoid worst-case hash degradation.
		- The alphabet size is very small and the pattern is very long, which might lead to excessive hash collisions.
		-
-
- # Alternative Variant (Multiple Pattern Rabin-Karp)
  collapsed:: true
	- > [!info] Multiple Pattern Search with Rabin-Karp
	  > Standard Rabin-Karp computes a single pattern hash and slides a window over the text.
	  > By storing the precomputed hashes of **multiple patterns** (of same length $M$) in a hash set, we can search for *any* of the patterns in the text in a single pass:
	  > - **Time Complexity**: $O(N + K \cdot M)$ average, where $K$ is the number of patterns.
	  > - **Verification**: When the text window hash is present in the patterns hash set, we retrieve all matching candidate patterns and verify their characters.
	-
	- :::code-tabs
	  
	  ```python
	  def rabin_karp_multi(text: str, patterns: list[str], d=256, q=101) -> dict[str, list[int]]:
	      """
	      Multiple Pattern Rabin-Karp Search
	      Time: O(N + K*M) average | Space: O(K)
	      """
	      if not patterns:
	          return {}
	      m = len(patterns[0])
	      n = len(text)
	  
	      # Map pattern hashes to lists of patterns (handles collisions)
	      pattern_map = {}
	      matches = {p: [] for p in patterns}
	      for p in patterns:
	          if len(p) != m:
	              continue
	          p_hash = 0
	          for char in p:
	              p_hash = (d * p_hash + ord(char)) % q
	          if p_hash not in pattern_map:
	              pattern_map[p_hash] = []
	          pattern_map[p_hash].append(p)
	  
	      if n < m:
	          return matches
	  
	      h = pow(d, m - 1, q)
	      t_hash = 0
	      for i in range(m):
	          t_hash = (d * t_hash + ord(text[i])) % q
	  
	      for i in range(n - m + 1):
	          if t_hash in pattern_map:
	              for p in pattern_map[t_hash]:
	                  if text[i : i + m] == p:
	                      matches[p].append(i)
	  
	          if i < n - m:
	              t_hash = (d * (t_hash - ord(text[i]) * h) + ord(text[i + m])) % q
	              if t_hash < 0:
	                  t_hash += q
	  
	      return matches
	  
	  # Example Usage
	  if __name__ == "__main__":
	      text = "ABABDABACDABABCABAB"
	      patterns = ["ABABC", "ABCAB"]
	      print(rabin_karp_multi(text, patterns))
	      # Output: {'ABABC': [10], 'ABCAB': [12]}
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  #include <unordered_map>
	  
	  // Multiple Pattern Rabin-Karp Search
	  // Time: O(N + K*M) average | Space: O(K)
	  std::unordered_map<std::string, std::vector<int>> rabinKarpMulti(
	      const std::string& text, 
	      const std::vector<std::string>& patterns, 
	      int d = 256, 
	      int q = 101
	  ) {
	      std::unordered_map<std::string, std::vector<int>> matches;
	      if (patterns.empty()) return matches;
	  
	      int m = patterns[0].length();
	      int n = text.length();
	  
	      std::unordered_map<int, std::vector<std::string>> pattern_map;
	      for (const auto& p : patterns) {
	          matches[p] = {};
	          if ((int)p.length() != m) continue;
	          int p_hash = 0;
	          for (char c : p) {
	              p_hash = (d * p_hash + static_cast<unsigned char>(c)) % q;
	          }
	          pattern_map[p_hash].push_back(p);
	      }
	  
	      if (n < m) return matches;
	  
	      int h = 1;
	      for (int i = 0; i < m - 1; i++) {
	          h = (h * d) % q;
	      }
	  
	      int t_hash = 0;
	      for (int i = 0; i < m; i++) {
	          t_hash = (d * t_hash + static_cast<unsigned char>(text[i])) % q;
	      }
	  
	      for (int i = 0; i <= n - m; i++) {
	          if (pattern_map.count(t_hash)) {
	              for (const auto& p : pattern_map[t_hash]) {
	                  if (text.substr(i, m) == p) {
	                      matches[p].push_back(i);
	                  }
	              }
	          }
	  
	          if (i < n - m) {
	              t_hash = (d * (t_hash - text[i] * h) + static_cast<unsigned char>(text[i + m])) % q;
	              if (t_hash < 0) {
	                  t_hash += q;
	              }
	          }
	      }
	  
	      return matches;
	  }
	  
	  int main() {
	      std::string text = "ABABDABACDABABCABAB";
	      std::vector<std::string> patterns = {"ABABC", "ABCAB"};
	      auto results = rabinKarpMulti(text, patterns);
	      for (const auto& pair : results) {
	          std::cout << pair.first << ": ";
	          for (int idx : pair.second) std::cout << idx << " ";
	          std::cout << "\n";
	      }
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  /**
	   * Multiple Pattern Rabin-Karp Search
	   * Time: O(N + K*M) average | Space: O(K)
	   */
	  function rabinKarpMulti(text, patterns, d = 256, q = 101) {
	    const matches = {};
	    if (patterns.length === 0) return matches;
	  
	    const m = patterns[0].length;
	    const n = text.length;
	  
	    const patternMap = {};
	    for (const p of patterns) {
	      matches[p] = [];
	      if (p.length !== m) continue;
	      let pHash = 0;
	      for (let j = 0; j < m; j++) {
	        pHash = (d * pHash + p.charCodeAt(j)) % q;
	      }
	      if (!patternMap[pHash]) {
	        patternMap[pHash] = [];
	      }
	      patternMap[pHash].push(p);
	    }
	  
	    if (n < m) return matches;
	  
	    let h = 1;
	    for (let i = 0; i < m - 1; i++) {
	      h = (h * d) % q;
	    }
	  
	    let tHash = 0;
	    for (let i = 0; i < m; i++) {
	      tHash = (d * tHash + text.charCodeAt(i)) % q;
	    }
	  
	    for (let i = 0; i <= n - m; i++) {
	      if (patternMap[tHash] !== undefined) {
	        for (const p of patternMap[tHash]) {
	          if (text.substring(i, i + m) === p) {
	            matches[p].push(i);
	          }
	        }
	      }
	  
	      if (i < n - m) {
	        tHash = (d * (tHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
	        if (tHash < 0) {
	          tHash += q;
	        }
	      }
	    }
	  
	    return matches;
	  }
	  
	  // Example Usage
	  console.log(rabinKarpMulti("ABABDABACDABABCABAB", ["ABABC", "ABCAB"]));
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class RabinKarpMulti {
	      public static Map<String, List<Integer>> search(String text, List<String> patterns) {
	          int d = 256;
	          int q = 101;
	          Map<String, List<Integer>> matches = new HashMap<>();
	          if (patterns.isEmpty()) return matches;
	  
	          int m = patterns.get(0).length();
	          int n = text.length();
	  
	          Map<Integer, List<String>> patternMap = new HashMap<>();
	          for (String p : patterns) {
	              matches.put(p, new ArrayList<>());
	              if (p.length() != m) continue;
	              int pHash = 0;
	              for (int j = 0; j < m; j++) {
	                  pHash = (d * pHash + p.charAt(j)) % q;
	              }
	              patternMap.computeIfAbsent(pHash, k -> new ArrayList<>()).add(p);
	          }
	  
	          if (n < m) return matches;
	  
	          int h = 1;
	          for (int i = 0; i < m - 1; i++) {
	              h = (h * d) % q;
	          }
	  
	          int tHash = 0;
	          for (int i = 0; i < m; i++) {
	              tHash = (d * tHash + text.charAt(i)) % q;
	          }
	  
	          for (int i = 0; i <= n - m; i++) {
	              if (patternMap.containsKey(tHash)) {
	                  for (String p : patternMap.get(tHash)) {
	                      if (text.substring(i, i + m).equals(p)) {
	                          matches.get(p).add(i);
	                      }
	                  }
	              }
	  
	              if (i < n - m) {
	                  tHash = (d * (tHash - text.charAt(i) * h) + text.charAt(i + m)) % q;
	                  if (tHash < 0) {
	                      tHash += q;
	                  }
	              }
	          }
	  
	          return matches;
	      }
	  
	      public static void main(String[] args) {
	          System.out.println(search("ABABDABACDABABCABAB", Arrays.asList("ABABC", "ABCAB")));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <string.h>
	  #include <stdlib.h>
	  
	  void rabinKarpMulti(const char* text, char patterns[][100], int pattern_count, int d, int q) {
	      int n = strlen(text);
	      if (pattern_count <= 0) return;
	      int m = strlen(patterns[0]);
	  
	      int* p_hashes = (int*)malloc(pattern_count * sizeof(int));
	      for (int k = 0; k < pattern_count; k++) {
	          int p_hash = 0;
	          for (int j = 0; j < m; j++) {
	              p_hash = (d * p_hash + (unsigned char)patterns[k][j]) % q;
	          }
	          p_hashes[k] = p_hash;
	      }
	  
	      if (n < m) {
	          free(p_hashes);
	          return;
	      }
	  
	      int h = 1;
	      for (int i = 0; i < m - 1; i++) {
	          h = (h * d) % q;
	      }
	  
	      int t_hash = 0;
	      for (int i = 0; i < m; i++) {
	          t_hash = (d * t_hash + (unsigned char)text[i]) % q;
	      }
	  
	      for (int i = 0; i <= n - m; i++) {
	          for (int k = 0; k < pattern_count; k++) {
	              if (p_hashes[k] == t_hash) {
	                  int j;
	                  for (j = 0; j < m; j++) {
	                      if (text[i + j] != patterns[k][j])
	                          break;
	                  }
	                  if (j == m) {
	                      printf("Pattern '%s' found at index %d\n", patterns[k], i);
	                  }
	              }
	          }
	  
	          if (i < n - m) {
	              t_hash = (d * (t_hash - (unsigned char)text[i] * h) + (unsigned char)text[i + m]) % q;
	              if (t_hash < 0) {
	                  t_hash += q;
	              }
	          }
	      }
	  
	      free(p_hashes);
	  }
	  
	  int main() {
	      char text[] = "ABABDABACDABABCABAB";
	      char patterns[2][100] = { "ABABC", "ABCAB" };
	      rabinKarpMulti(text, patterns, 2, 256, 101);
	      return 0;
	  }
	  ```
	  
	  :::
-
- # Key Takeaways
  collapsed:: true
	- **Core idea** — use a rolling hash to filter matching candidate windows in $O(1)$ average time.
	- **Average Time Complexity** — $O(N + M)$ due to efficient rolling calculations.
	- **Worst-case bound** — $O(N \cdot M)$ worst case if modular collisions trigger character matching on every iteration.
	- **Collision verification** — always checks characters manually when hashes match to handle collisions.
	- **Best fit** — multi-pattern search and plagiarism matching.
	- **DFA alternative** — while KMP is restricted to one pattern, Rabin-Karp scales to arbitrary sets of patterns of the same length.
-
- # More Learn
	- ## GitHub & Webs
		- [TheAlgorithms – Rabin-Karp (Python)](https://github.com/TheAlgorithms/Python/blob/master/searches/rabin_karp.py)
		- [GeeksforGeeks — Rabin-Karp Algorithm](https://www.geeksforgeeks.org/rabin-karp-algorithm-for-pattern-searching/)