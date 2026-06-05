---
seoTitle: FM-Index Complete Guide – Burrows-Wheeler Transform & Backward Search
description: "A comprehensive guide to the FM-index (Ferragina-Manzini index). Covers suffix arrays, BWT construction, LF-mapping, backward search, complexity, and full Python/C++ implementations."
keywords: "FM-index, Burrows-Wheeler Transform, BWT, suffix array, LF-mapping, backward search, string matching, bioinformatics, data compression, VR-Rathod, Code-Note, code note vr, vr book"
treeTitle: DSA - Advanced Data Structures - FM index
---

> [!info] What is the FM-Index?
> The **FM-index** (Ferragina-Manzini index) is a compressed full-text substring search index. It is based on the **Burrows-Wheeler Transform (BWT)** and a sampled **Suffix Array (SA)**.
> It allows searching for a pattern of length $M$ in $O(M)$ time, independent of the text size $N$, while using space comparable to the compressed size of the original text.

- # Explanation
	- The FM-index solves the problem of searching large texts (like genomes in bioinformatics) under tight memory constraints. While a traditional Suffix Tree or Suffix Array takes $O(N \log N)$ or $O(N)$ space, they carry high memory constants (typically $4\times$ to $20\times$ the text size).
	- The FM-index compresses the text using the Burrows-Wheeler Transform (BWT) and utilizes auxiliary tables to search the compressed text directly, without decompressing it.
	-
	- ## Real-World Analogy
		- **A Compact Phonebook with a Smart Index**: Imagine a giant metropolitan phonebook. Instead of keeping the entire book in full text, we run a compression algorithm that groups similar letters together (like BWT does). We also keep a tiny lookup card that tells us where each letter's section starts and how many times letters appear. By starting from the last character of a name and looking at our lookup card, we can jump directly to the page containing that name without scanning the phonebook.
- # How It Works
  collapsed:: true
	- ## Core Mechanics
		- The FM-index relies on three main components: the Suffix Array ($SA$), the Burrows-Wheeler Transform ($BWT$), and the Last-to-First ($LF$) mapping.
		-
		- ### 1. Suffix Array (SA)
			- The Suffix Array of a text $T$ of length $N$ is an array of integers representing the starting positions of the lexicographically sorted suffixes of $T$.
			- To ensure unique suffix sorting, a special sentinel character `$` is appended to the text, which is lexicographically smaller than any other alphabet character.
		-
		- ### 2. Burrows-Wheeler Transform (BWT)
			- The BWT is a string $L$ of length $N$ formed by taking the last column of the sorted cyclic rotations of $T + \$$.
			- Alternatively, it is constructed using the Suffix Array: $L[i] = T[SA[i] - 1]$ (if $SA[i] = 0$, $L[i] = \$ $).
			- Due to sorting, identical contexts cluster together, making $L$ highly compressible (e.g., using run-length encoding).
		-
		- ### 3. LF-Mapping (Last-to-First Mapping)
			- The fundamental property of the BWT is the **LF-mapping**: the $k$-th occurrence of character $C$ in the last column $L$ (BWT) corresponds to the $k$-th occurrence of character $C$ in the first column $F$ (sorted text).
			- This correspondence allows us to traverse the text backwards.
		-
		- ### 4. Lookup Tables for Backward Search
			- **Count Table $C[c]$**: Stores the total number of characters in $T$ that are lexicographically smaller than character $c$.
			- **Occurrence Table $Occ(c, i)$**: Stores the number of occurrences of character $c$ in the prefix $L[0 \dots i]$.
		-
		- ### 5. Backward Search Algorithm
			- To search for a pattern $P$ of length $M$ backwards:
			  1. Initialize search range $[sp, ep] = [0, N-1]$ (representing all suffixes).
			  2. Iterate from the last character of the pattern ($i = M-1$) down to the first ($i = 0$):
			     $$sp = C[P[i]] + Occ(P[i], sp - 1)$$
			     $$ep = C[P[i]] + Occ(P[i], ep) - 1$$
			     *(Note: $Occ(c, -1) = 0$)*
			  3. If $sp > ep$, the pattern does not exist in the text.
			  4. If $sp \le ep$ after all iterations, the pattern appears $ep - sp + 1$ times. The starting positions in the text are stored in $SA[sp \dots ep]$.
	-
	- ## Visual Walkthrough: Searching "ana" in "banana"
		- Let $T = \text{"banana"}$. We append `$` to get $\text{"banana\$"}$.
		-
		- ### Step 1: Sort Cyclic Rotations (Suffix Array & BWT Matrix)
			- | Index | Suffix Array ($SA$) | Suffix | Last Column ($L$ / $BWT$) |
			  |---|---|---|---|
			  | 0 | 6 | `$` | `a` |
			  | 1 | 5 | `a$` | `n` |
			  | 2 | 3 | `ana$` | `n` |
			  | 3 | 1 | `anana$` | `b` |
			  | 4 | 0 | `banana$` | `$` |
			  | 5 | 4 | `na$` | `a` |
			  | 6 | 2 | `nana$` | `a` |
			- The resulting BWT string $L$ is: `annb$aa`
		-
		- ### Step 2: Build Lookup Tables
			- **Count Table $C[c]$**:
				- $C['\$'] = 0$
				- $C['a'] = 1$
				- $C['b'] = 4$
				- $C['n'] = 5$
			- **Occurrence Table $Occ(c, i)$**:
				- | $i$ | BWT $L[i]$ | $Occ('a', i)$ | $Occ('b', i)$ | $Occ('n', i)$ | $Occ('\$', i)$ |
				  |---|---|---|---|---|---|
				  | 0 | `a` | 1 | 0 | 0 | 0 |
				  | 1 | `n` | 1 | 0 | 1 | 0 |
				  | 2 | `n` | 1 | 0 | 2 | 0 |
				  | 3 | `b` | 1 | 1 | 2 | 0 |
				  | 4 | `$` | 1 | 1 | 2 | 1 |
				  | 5 | `a` | 2 | 1 | 2 | 1 |
				  | 6 | `a` | 3 | 1 | 2 | 1 |
		-
		- ### Step 3: Backward Search for Pattern "ana" ($P[0]='a', P[1]='n', P[2]='a'$)
			- **Initialize**: $[sp, ep] = [0, 6]$
			- **Iterate $i = 2$ ($P[2] = 'a'$)**:
				- $sp = C['a'] + Occ('a', -1) = 1 + 0 = 1$
				- $ep = C['a'] + Occ('a', 6) - 1 = 1 + 3 - 1 = 3$
				- Range is $[1, 3]$ (suffixes: `a$`, `ana$`, `anana$`).
			- **Iterate $i = 1$ ($P[1] = 'n'$)**:
				- $sp = C['n'] + Occ('n', sp - 1) = C['n'] + Occ('n', 0) = 5 + 0 = 5$
				- $ep = C['n'] + Occ('n', ep) - 1 = C['n'] + Occ('n', 3) - 1 = 5 + 2 - 1 = 6$
				- Range is $[5, 6]$ (suffixes starting with `na`).
			- **Iterate $i = 0$ ($P[0] = 'a'$)**:
				- $sp = C['a'] + Occ('a', sp - 1) = C['a'] + Occ('a', 4) = 1 + 1 = 2$
				- $ep = C['a'] + Occ('a', ep) - 1 = C['a'] + Occ('a', 6) - 1 = 1 + 3 - 1 = 3$
				- Final Range is $[2, 3]$.
			- **Results**:
				- Suffixes at indices $2$ and $3$ of the SA correspond to matches.
				- $SA[2] = 3$ (suffix: `ana$`), $SA[3] = 1$ (suffix: `anana$`).
				- The occurrences of "ana" start at indices $1$ and $3$ in the original text "banana".
- # Time & Space Complexity
  collapsed:: true
	- | Index Structure | Construction Time | Search Time (Count) | Search Time (Locate) | Space Complexity |
	  |---|---|---|---|---|
	  | **Trie** | $O(N^2)$ | $O(M)$ | $O(M + Occur)$ | $O(N^2 \cdot \Sigma)$ |
	  | **[[Suffix Tree]]** | $O(N)$ | $O(M)$ | $O(M + Occur)$ | $O(N \cdot \Sigma)$ |
	  | **[[Suffix Array]]** | $O(N)$ | $O(M \log N)$ | $O(M \log N + Occur)$ | $O(N)$ |
	  | **[[FM Index]] (Standard)** | $O(N)$ | $O(M)$ | $O(M + Occur \cdot \text{sample\_rate})$ | $O(N \cdot H_k(T) + o(N))$ |
		- *$\Sigma$ is the alphabet size, $Occur$ is the number of pattern occurrences, and $H_k(T)$ is the $k$-th order empirical entropy of the text.*
- # Implementation
  collapsed:: true
	- :::code-tabs
	  
	  ```python
	  class FMIndex:
	      def __init__(self, text):
	          """Constructs the FM-index for the input text."""
	          # Append sentinel character '$' (which is smaller than all other characters)
	          self.text = text + "$"
	          self.n = len(self.text)
	          
	          # 1. Build Suffix Array (SA)
	          self.suffix_array = self._build_suffix_array()
	          
	          # 2. Build BWT
	          self.bwt = "".join(self.text[sa - 1] if sa > 0 else "$" for sa in self.suffix_array)
	          
	          # 3. Build Count Table C
	          self.C = self._build_count_table()
	          
	          # 4. Build Occurrence Table Occ
	          self.Occ = self._build_occurrence_table()
	  
	      def _build_suffix_array(self):
	          """Builds Suffix Array by sorting suffixes (O(N^2 log N) simplicity)."""
	          suffixes = sorted((self.text[i:], i) for i in range(self.n))
	          return [sa[1] for sa in suffixes]
	  
	      def _build_count_table(self):
	          """Builds the C table: C[c] stores count of characters smaller than c."""
	          counts = {}
	          for char in self.text:
	              counts[char] = counts.get(char, 0) + 1
	          
	          sorted_chars = sorted(counts.keys())
	          C = {}
	          total = 0
	          for char in sorted_chars:
	              C[char] = total
	              total += counts[char]
	          return C
	  
	      def _build_occurrence_table(self):
	          """Builds occurrence table Occ[char][i]: count of char in BWT[0..i]."""
	          # Find all unique characters
	          unique_chars = set(self.bwt)
	          Occ = {char: [0] * self.n for char in unique_chars}
	          
	          for i, char in enumerate(self.bwt):
	              for c in unique_chars:
	                  Occ[c][i] = Occ[c][i - 1] if i > 0 else 0
	              Occ[char][i] += 1
	          return Occ
	  
	      def _get_occ(self, char, index):
	          """Helper to safely query Occ table with boundary handling."""
	          if index < 0:
	              return 0
	          if char not in self.Occ:
	              return 0
	          return self.Occ[char][index]
	  
	      def count(self, pattern):
	          """Returns the number of occurrences of the pattern."""
	          sp, ep = self.search_range(pattern)
	          if sp > ep:
	              return 0
	          return ep - sp + 1
	  
	      def search_range(self, pattern):
	          """Returns the [sp, ep] range in suffix array for the pattern."""
	          if not pattern:
	              return 0, -1
	          
	          # Start from the last character
	          curr_char = pattern[-1]
	          if curr_char not in self.C:
	              return 0, -1
	              
	          sp = self.C[curr_char]
	          ep = self.C[curr_char] + self._get_occ(curr_char, self.n - 1) - 1
	          
	          # Iterate backwards
	          for i in range(len(pattern) - 2, -1, -1):
	              char = pattern[i]
	              if char not in self.C:
	                  return 0, -1
	              sp = self.C[char] + self._get_occ(char, sp - 1)
	              ep = self.C[char] + self._get_occ(char, ep) - 1
	              if sp > ep:
	                  break
	          return sp, ep
	  
	      def locate(self, pattern):
	          """Returns starting positions of all occurrences of pattern in text."""
	          sp, ep = self.search_range(pattern)
	          if sp > ep:
	              return []
	          return sorted(self.suffix_array[i] for i in range(sp, ep + 1))
	  
	  # Demonstration
	  if __name__ == "__main__":
	      index = FMIndex("banana")
	      pattern = "ana"
	      print(f"Searching for '{pattern}' in 'banana'")
	      print(f"Occurrences Count: {index.count(pattern)}")
	      print(f"Starting Indices: {index.locate(pattern)}")
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  #include <map>
	  #include <algorithm>
	  #include <set>
	  
	  class FMIndex {
	  private:
	      std::string text;
	      int n;
	      std::vector<int> suffixArray;
	      std::string bwt;
	      std::map<char, int> C;
	      std::map<char, std::vector<int>> Occ;
	  
	      // Construct Suffix Array by sorting suffixes
	      void buildSuffixArray() {
	          std::vector<std::pair<std::string, int>> suffixes;
	          suffixes.reserve(n);
	          for (int i = 0; i < n; ++i) {
	              suffixes.push_back({text.substr(i), i});
	          }
	          std::sort(suffixes.begin(), suffixes.end());
	          suffixArray.resize(n);
	          for (int i = 0; i < n; ++i) {
	              suffixArray[i] = suffixes[i].second;
	          }
	      }
	  
	      // Construct BWT from Suffix Array
	      void buildBWT() {
	          bwt.resize(n);
	          for (int i = 0; i < n; ++i) {
	              int sa = suffixArray[i];
	              bwt[i] = (sa > 0) ? text[sa - 1] : '$';
	          }
	      }
	  
	      // Construct Count table C
	      void buildCountTable() {
	          std::map<char, int> counts;
	          for (char c : text) {
	              counts[c]++;
	          }
	          int total = 0;
	          for (auto const& [c, count] : counts) {
	              C[c] = total;
	              total += count;
	          }
	      }
	  
	      // Construct Occurrence table Occ
	      void buildOccurrenceTable() {
	          std::set<char> uniqueChars(bwt.begin(), bwt.end());
	          for (char c : uniqueChars) {
	              Occ[c] = std::vector<int>(n, 0);
	          }
	          for (int i = 0; i < n; ++i) {
	              char curr = bwt[i];
	              for (char c : uniqueChars) {
	                  if (i > 0) {
	                      Occ[c][i] = Occ[c][i - 1];
	                  }
	              }
	              Occ[curr][i]++;
	          }
	      }
	  
	      int getOcc(char c, int idx) const {
	          if (idx < 0) return 0;
	          auto it = Occ.find(c);
	          if (it == Occ.end()) return 0;
	          return it->second[idx];
	      }
	  
	  public:
	      FMIndex(const std::string& input) {
	          text = input + "$";
	          n = text.length();
	          buildSuffixArray();
	          buildBWT();
	          buildCountTable();
	          buildOccurrenceTable();
	      }
	  
	      // Returns the search range [sp, ep] in the suffix array
	      std::pair<int, int> searchRange(const std::string& pattern) const {
	          if (pattern.empty()) return {0, -1};
	          
	          char lastChar = pattern.back();
	          auto it = C.find(lastChar);
	          if (it == C.end()) return {0, -1};
	          
	          int sp = it->second;
	          int ep = sp + getOcc(lastChar, n - 1) - 1;
	          
	          for (int i = static_cast<int>(pattern.length()) - 2; i >= 0; --i) {
	              char c = pattern[i];
	              auto itC = C.find(c);
	              if (itC == C.end()) return {0, -1};
	              
	              sp = itC->second + getOcc(c, sp - 1);
	              ep = itC->second + getOcc(c, ep) - 1;
	              if (sp > ep) break;
	          }
	          return {sp, ep};
	      }
	  
	      int count(const std::string& pattern) const {
	          auto [sp, ep] = searchRange(pattern);
	          if (sp > ep) return 0;
	          return ep - sp + 1;
	      }
	  
	      std::vector<int> locate(const std::string& pattern) const {
	          auto [sp, ep] = searchRange(pattern);
	          if (sp > ep) return {};
	          std::vector<int> locations;
	          for (int i = sp; i <= ep; ++i) {
	              locations.push_back(suffixArray[i]);
	          }
	          std::sort(locations.begin(), locations.end());
	          return locations;
	      }
	  };
	  
	  int main() {
	      FMIndex index("banana");
	      std::string pattern = "ana";
	      std::cout << "Searching for \"" << pattern << "\" in \"banana\"\n";
	      std::cout << "Count: " << index.count(pattern) << "\n";
	      
	      std::vector<int> locations = index.locate(pattern);
	      std::cout << "Locations: ";
	      for (int idx : locations) {
	          std::cout << idx << " ";
	      }
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  :::
- # When to Use
  collapsed:: true
	- ## ✅ Use FM-Index When:
		- You need to index huge texts (such as the human genome containing billions of base pairs) to perform extremely fast, repeated substring queries on small memory footprints.
		- You need an exact matching index that supports both counting matches and locating their exact text indexes.
		- The alphabet size $\Sigma$ is relatively small (e.g. DNA characters `{A, C, G, T}`).
	- ## ❌ Do NOT Use FM-Index When:
		- The text is highly dynamic and requires frequent updates (insertions, deletions, edits). FM-index is static and reconstruction is costly.
		- The alphabet size $\Sigma$ is extremely large (e.g. general Unicode), as the storage costs for the occurrence/count matrices might scale poorly unless optimized using Wavelet Trees.
- # Variations & Related Concepts
  collapsed:: true
	- **Wavelet Trees**: Used to replace the Occurrence table $Occ(c, i)$ for large alphabets, reducing space complexity from $O(N \cdot \Sigma)$ to $O(N \log \Sigma)$ bits.
	- **Sampled Suffix Array**: Storing only a fraction (e.g. every 16th or 32nd entry) of the Suffix Array to trade search localization speed for dramatic memory savings.
	- **r-index**: A high-performance variation optimized specifically for highly repetitive texts (like populations of genomes), scaling space relative to the number of runs $r$ in the BWT.
- # Key Takeaways
  collapsed:: true
	- The FM-index combines Burrows-Wheeler Transform compression with Suffix Array querying to create a self-indexing, highly compressed representation of a text.
	- Searching is done backwards using LF-mapping properties via Count ($C$) and Occurrence ($Occ$) helper structures.
	- It resolves exact counts in $O(M)$ time and occurrences in $O(M + \text{matches})$ time, using space proportional to the text's entropy.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Wikipedia -> FM-index](https://en.wikipedia.org/wiki/FM-index)