---
seoTitle: Burrows-Wheeler Transform (BWT) – Data Compression & Reversible Transformation
description: "Comprehensive guide to the Burrows-Wheeler Transform (BWT). Covers cyclic rotations, suffix sorting, stable inverse BWT decoding, and implementation in 5 languages."
keywords: "Burrows-Wheeler Transform, BWT, inverse BWT, data compression, Burrows Wheeler, bzip2, LF-mapping, suffix array, string transformation, C++, Python, Java, JavaScript, C"
---

> [!info] What is the Burrows-Wheeler Transform?
> The **Burrows-Wheeler Transform (BWT)** is a reversible string transformation algorithm that rearranges a string's characters into runs of identical symbols.
> By doing so, it clusters similar characters together without losing any original structure, preparing the text for extremely efficient compression algorithms like Run-Length Encoding (RLE) or Huffman Coding. It is the primary engine behind the **bzip2** compression tool.

- # Explanation
  collapsed:: true
	- Unlike standard compression methods, BWT is a **transformation**, not a compressor. It does not reduce string size by itself; it only permutes character ordering.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine sorting a directory of names: if you sort by last name, all members of the "Smith" family end up adjacent.
		- In text, words have predictable contexts (e.g., the letter `h` frequently follows `t`). By sorting cyclic rotations, we align characters that appear in similar contexts, grouping common letters (like `t`s or `e`s) next to each other.
	-
	- ## BWT Construction Process
	  collapsed:: true
		- 1. **Sentinel Character**: Append a sentinel character (conventionally `$`) to the end of string $S$. The sentinel must be lexicographically smaller than any character in the alphabet.
		- 2. **Cyclic Rotations**: Generate all $N$ cyclic rotations of the string.
		- 3. **Lexicographical Sort**: Sort all rotations alphabetically.
		- 4. **Last Column**: Extract the last character of each sorted rotation. This column is the BWT.
-
- # How It Works
  collapsed:: true
	- ## Forward BWT Matrix for `"banana$"`
	  collapsed:: true
		- Let's sort the cyclic rotations of $S = \text{"banana$"}$.
		-
		- | Index | Cyclic Rotation | Last Character (BWT) |
		  |---|---|---|
		  | 0 | **$**banana | a |
		  | 1 | **a**$banan | n |
		  | 2 | **a**nana$b | n |
		  | 3 | **a**na$ban | b |
		  | 4 | **b**anana$ | $ |
		  | 5 | **n**ana$ba | a |
		  | 6 | **n**a$bana | a |
		- Resulting BWT: `"annb$aa"`.
	-
	- ## Reversibility & LF-Mapping
	  collapsed:: true
		- How do we decode `"annb$aa"` back to `"banana"`?
		- We use the **LF-Mapping** property: the $i$-th occurrence of character $C$ in the **Last** column corresponds to the $i$-th occurrence of the same character $C$ in the sorted **First** column.
		-
		- ```mermaid
		  flowchart TD
		      A["BWT String (Last Column)\ne.g. 'annb$aa'"] --> B["Pair each character with index:\n[('a',0), ('n',1), ('n',2), ('b',3), ('$',4), ('a',5), ('a',6)]"]
		      B --> C["Sort stably to get First Column:\n[('$',4), ('a',0), ('a',5), ('a',6), ('b',3), ('n',1), ('n',2)]"]
		      C --> D["Build LF transitions:\nLF[FirstColumn[i].originalIndex] = i"]
		      D --> E["Start at index of '$' in Last Column\nFollow LF transitions backwards to decode S"]
		      E --> F["Reverse decoded characters to get original string"]
		  ```
-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > - **Time Complexity**:
	  >   - **Forward BWT**: $O(N^2 \log N)$ using naive string sorting, but can be optimized to **O(N log N)** or **O(N)** using a Suffix Array.
	  >   - **Inverse BWT**: **O(N log N)** using standard sorting algorithms, or **O(N + R)** using counting sort.
	  > - **Space Complexity**: **O(N)** auxiliary space for string permutations or indices.
	-
	- ## Complexity Table
	  collapsed:: true
		- | Phase | Time Complexity (Naive) | Time Complexity (Optimal) | Space Complexity | Why |
		  |---|---|---|---|---|
		  | **Forward BWT** | $O(N^2 \log N)$ | $O(N)$ (via Suffix Array) | $O(N)$ | Generating/sorting full cyclic rotations vs. suffix pointers. |
		  | **Inverse BWT** | $O(N \log N)$ | $O(N)$ (via Counting Sort) | $O(N)$ | Requires stable sorting to reconstruct First/Last column mapping. |
-
- # Base Implementation
  collapsed:: true
	- > [!note] Forward Burrows-Wheeler Transform.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  def burrows_wheeler_transform(s: str) -> str:
	      """
	      Computes the forward Burrows-Wheeler Transform of string s.
	      Appends '$' as the lexicographically smallest sentinel character.
	      Time: O(N^2 log N) | Space: O(N^2)
	      """
	      if not s:
	          return ""
	      s = s + "$"
	      n = len(s)
	      # Generate all cyclic rotations
	      rotations = [s[i:] + s[:i] for i in range(n)]
	      # Sort rotations lexicographically
	      rotations.sort()
	      # Extract the last character of each rotation
	      return "".join(rotation[-1] for rotation in rotations)

	  # Example Usage
	  if __name__ == "__main__":
	      print(burrows_wheeler_transform("banana"))  # Output: "annb$aa"
	  ```

	  ```c++
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  #include <algorithm>

	  // Forward Burrows-Wheeler Transform
	  // Time: O(N^2 log N) | Space: O(N^2)
	  std::string burrowsWheelerTransform(const std::string& s) {
	      if (s.empty()) return "";
	      
	      std::string temp = s + "$";
	      int n = temp.length();
	      std::vector<std::string> rotations(n);
	      
	      for (int i = 0; i < n; ++i) {
	          rotations[i] = temp.substr(i) + temp.substr(0, i);
	      }
	      
	      std::sort(rotations.begin(), rotations.end());
	      
	      std::string bwt = "";
	      for (const std::string& rotation : rotations) {
	          bwt += rotation.back();
	      }
	      return bwt;
	  }

	  int main() {
	      std::cout << burrowsWheelerTransform("banana") << "\n"; // Output: annb$aa
	      return 0;
	  }
	  ```

	  ```javascript
	  /**
	   * Forward Burrows-Wheeler Transform
	   * Time: O(N^2 log N) | Space: O(N^2)
	   */
	  function burrowsWheelerTransform(s) {
	      if (!s) return "";
	      const temp = s + "$";
	      const n = temp.length;
	      const rotations = [];
	      
	      for (let i = 0; i < n; i++) {
	          rotations.push(temp.substring(i) + temp.substring(0, i));
	      }
	      
	      rotations.sort();
	      
	      let bwt = "";
	      for (let i = 0; i < n; i++) {
	          bwt += rotations[i][n - 1];
	      }
	      return bwt;
	  }

	  // Example Usage
	  console.log(burrowsWheelerTransform("banana")); // Output: "annb$aa"
	  ```

	  ```java
	  import java.util.Arrays;

	  public class BWTForward {
	      /**
	       * Computes the forward Burrows-Wheeler Transform.
	       * Time: O(N^2 log N) | Space: O(N^2)
	       */
	      public static String burrowsWheelerTransform(String s) {
	          if (s == null || s.length() == 0) return "";
	          
	          String temp = s + "$";
	          int n = temp.length();
	          String[] rotations = new String[n];
	          
	          for (int i = 0; i < n; i++) {
	              rotations[i] = temp.substring(i) + temp.substring(0, i);
	          }
	          
	          Arrays.sort(rotations);
	          
	          StringBuilder bwt = new StringBuilder();
	          for (String rotation : rotations) {
	              bwt.append(rotation.charAt(n - 1));
	          }
	          return bwt.toString();
	      }

	      public static void main(String[] args) {
	          System.out.println(burrowsWheelerTransform("banana")); // Output: annb$aa
	      }
	  }
	  ```

	  ```c
	  #include <stdio.h>
	  #include <string.h>
	  #include <stdlib.h>

	  int compareStrings(const void* a, const void* b) {
	      return strcmp(*(const char**)a, *(const char**)b);
	  }

	  /* Forward Burrows-Wheeler Transform
	     Time: O(N^2 log N) | Space: O(N^2) */
	  char* burrowsWheelerTransform(const char* s) {
	      int len = strlen(s);
	      int n = len + 1;
	      
	      char* temp = (char*)malloc((n + 1) * sizeof(char));
	      strcpy(temp, s);
	      temp[len] = '$';
	      temp[n] = '\0';
	      
	      char** rotations = (char**)malloc(n * sizeof(char*));
	      for (int i = 0; i < n; i++) {
	          rotations[i] = (char*)malloc((n + 1) * sizeof(char));
	          strncpy(rotations[i], temp + i, n - i);
	          strncpy(rotations[i] + (n - i), temp, i);
	          rotations[i][n] = '\0';
	      }
	      
	      qsort(rotations, n, sizeof(char*), compareStrings);
	      
	      char* bwt = (char*)malloc((n + 1) * sizeof(char));
	      for (int i = 0; i < n; i++) {
	          bwt[i] = rotations[i][n - 1];
	      }
	      bwt[n] = '\0';
	      
	      for (int i = 0; i < n; i++) {
	          free(rotations[i]);
	      }
	      free(rotations);
	      free(temp);
	      
	      return bwt;
	  }

	  int main() {
	      char* result = burrowsWheelerTransform("banana");
	      printf("%s\n", result); // Output: annb$aa
	      free(result);
	      return 0;
	  }
	  ```

	  :::
-
- # Alternative Variant (Inverse Burrows-Wheeler Transform)
  collapsed:: true
	- > [!tip] Decoding BWT back to the original string
	  > Since BWT is reversible, the original string can be reconstructed in linear-like time without storing the entire sorted rotation matrix, relying entirely on the stable sorting mapping between the first and last columns.
	-
	- :::code-tabs
	  
	  ```python
	  def inverse_burrows_wheeler_transform(bwt: str) -> str:
	      """
	      Reconstructs the original string from its BWT string.
	      Time: O(N log N) (due to sort) | Space: O(N)
	      """
	      n = len(bwt)
	      # Pair each character with its original index to keep track during sorting
	      paired = [(char, idx) for idx, char in enumerate(bwt)]
	      # Sort stable to construct the first column
	      first_col = sorted(paired, key=lambda x: x[0])
	      
	      # Map indices from the first column back to the last column (LF-mapping)
	      lf = [0] * n
	      for i in range(n):
	          lf[first_col[i][1]] = i
	          
	      # Trace back from sentinel character '$'
	      idx = bwt.index("$")
	      reconstructed = []
	      for _ in range(n - 1):
	          idx = lf[idx]
	          reconstructed.append(bwt[idx])
	          
	      return "".join(reconstructed[::-1])

	  # Example Usage
	  if __name__ == "__main__":
	      print(inverse_burrows_wheeler_transform("annb$aa"))  # Output: "banana"
	  ```

	  ```c++
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  #include <algorithm>

	  struct Element {
	      char val;
	      int originalIdx;
	  };

	  bool compareElements(const Element& a, const Element& b) {
	      if (a.val == b.val) {
	          return a.originalIdx < b.originalIdx; // Keep stable sort order
	      }
	      return a.val < b.val;
	  }

	  // Inverse Burrows-Wheeler Transform
	  // Time: O(N log N) | Space: O(N)
	  std::string inverseBurrowsWheeler(const std::string& bwt) {
	      int n = bwt.length();
	      std::vector<Element> paired(n);
	      for (int i = 0; i < n; ++i) {
	          paired[i] = {bwt[i], i};
	      }
	      
	      std::stable_sort(paired.begin(), paired.end(), compareElements);
	      
	      std::vector<int> lf(n);
	      for (int i = 0; i < n; ++i) {
	          lf[paired[i].originalIdx] = i;
	      }
	      
	      int idx = -1;
	      for (int i = 0; i < n; ++i) {
	          if (bwt[i] == '$') {
	              idx = i;
	              break;
	          }
	      }
	      
	      std::string reconstructed = "";
	      for (int i = 0; i < n - 1; ++i) {
	          idx = lf[idx];
	          reconstructed += bwt[idx];
	      }
	      
	      std::reverse(reconstructed.begin(), reconstructed.end());
	      return reconstructed;
	  }

	  int main() {
	      std::cout << inverseBurrowsWheeler("annb$aa") << "\n"; // Output: banana
	      return 0;
	  }
	  ```

	  ```javascript
	  function inverseBurrowsWheeler(bwt) {
	      const n = bwt.length;
	      const paired = [];
	      for (let i = 0; i < n; i++) {
	          paired.push({ char: bwt[i], idx: i });
	      }
	      
	      // Stable sorting helper
	      paired.sort((a, b) => {
	          if (a.char === b.char) return a.idx - b.idx;
	          return a.char < b.char ? -1 : 1;
	      });
	      
	      const lf = new Array(n);
	      for (let i = 0; i < n; i++) {
	          lf[paired[i].idx] = i;
	      }
	      
	      let idx = bwt.indexOf("$");
	      const reconstructed = [];
	      for (let i = 0; i < n - 1; i++) {
	          idx = lf[idx];
	          reconstructed.push(bwt[idx]);
	      }
	      
	      return reconstructed.reverse().join("");
	  }

	  // Example Usage
	  console.log(inverseBurrowsWheeler("annb$aa")); // Output: "banana"
	  ```

	  ```java
	  import java.util.Arrays;
	  import java.util.Comparator;

	  public class BWTInverse {
	      static class Element {
	          char val;
	          int originalIdx;
	          Element(char val, int originalIdx) {
	              this.val = val;
	              this.originalIdx = originalIdx;
	          }
	      }

	      /**
	       * Decoding the BWT string to the original string.
	       * Time: O(N log N) | Space: O(N)
	       */
	      public static String inverseBurrowsWheeler(String bwt) {
	          int n = bwt.length();
	          Element[] paired = new Element[n];
	          for (int i = 0; i < n; i++) {
	              paired[i] = new Element(bwt.charAt(i), i);
	          }
	          
	          // Stable sort
	          Arrays.sort(paired, (a, b) -> {
	              if (a.val == b.val) return Integer.compare(a.originalIdx, b.originalIdx);
	              return Character.compare(a.val, b.val);
	          });
	          
	          int[] lf = new int[n];
	          for (int i = 0; i < n; i++) {
	              lf[paired[i].originalIdx] = i;
	          }
	          
	          int idx = bwt.indexOf('$');
	          StringBuilder sb = new StringBuilder();
	          for (int i = 0; i < n - 1; i++) {
	              idx = lf[idx];
	              sb.append(bwt.charAt(idx));
	          }
	          
	          return sb.reverse().toString();
	      }

	      public static void main(String[] args) {
	          System.out.println(inverseBurrowsWheeler("annb$aa")); // Output: banana
	      }
	  }
	  ```

	  ```c
	  #include <stdio.h>
	  #include <string.h>
	  #include <stdlib.h>

	  typedef struct {
	      char val;
	      int originalIdx;
	  } Element;

	  int compareElements(const void* a, const void* b) {
	      Element* ea = (Element*)a;
	      Element* eb = (Element*)b;
	      if (ea->val == eb->val) {
	          return ea->originalIdx - eb->originalIdx; // Stable comparator
	      }
	      return ea->val - eb->val;
	  }

	  /* Inverse Burrows-Wheeler Transform
	     Time: O(N log N) | Space: O(N) */
	  char* inverseBurrowsWheeler(const char* bwt) {
	      int n = strlen(bwt);
	      Element* paired = (Element*)malloc(n * sizeof(Element));
	      for (int i = 0; i < n; ++i) {
	          paired[i].val = bwt[i];
	          paired[i].originalIdx = i;
	      }
	      
	      qsort(paired, n, sizeof(Element), compareElements);
	      
	      int* lf = (int*)malloc(n * sizeof(int));
	      for (int i = 0; i < n; ++i) {
	          lf[paired[i].originalIdx] = i;
	      }
	      
	      int idx = -1;
	      for (int i = 0; i < n; ++i) {
	          if (bwt[i] == '$') {
	              idx = i;
	              break;
	          }
	      }
	      
	      char* reconstructed = (char*)malloc(n * sizeof(char));
	      for (int i = 0; i < n - 1; ++i) {
	          idx = lf[idx];
	          reconstructed[i] = bwt[idx];
	      }
	      reconstructed[n - 1] = '\0';
	      
	      // Reverse the string
	      for (int i = 0; i < (n - 1) / 2; ++i) {
	          char temp = reconstructed[i];
	          reconstructed[i] = reconstructed[n - 2 - i];
	          reconstructed[n - 2 - i] = temp;
	      }
	      
	      free(paired);
	      free(lf);
	      return reconstructed;
	  }

	  int main() {
	      char* result = inverseBurrowsWheeler("annb$aa");
	      printf("%s\n", result); // Output: banana
	      free(result);
	      return 0;
	  }
	  ```

	  :::
-
- # When to Use BWT
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"What is the target requirement?"}
	      Q -- "Clustering symbols for compression" --> R1["✅ Use BWT\nCreates long run lengths suitable for RLE/MTF/Huffman"]
	      Q -- "Exact matching of substrings" --> R2["✅ Use BWT + FM-Index\nExtremely memory efficient substring search"]
	      Q -- "General hashing / encryption" --> R3["❌ Avoid BWT\nIt is entirely reversible and not a hashing algorithm"]
	  ```
	-
	- ## ✅ Use BWT When
		- Preparing text for high-performance block-sorting compression pipelines (like **bzip2**).
		- Implementing text indexing structures like the **FM-Index** (used widely in bioinformatics DNA alignment for storing huge genomes in memory).
	-
	- ## ❌ Avoid BWT When
		- You need instant, random-access modifications to a string (recomputing BWT on small insertions is extremely expensive).
		- You require hashing or irreversible lossy compression.
-
- # Key Takeaways
  collapsed:: true
	- **Reversibility** — does not compress by itself; it is a lossless, reversible permutation of string characters.
	- **Clustering effect** — groups similar context characters adjacent to one another, optimizing text for run-length encoding.
	- **Sentinel rule** — requires a sentinel (`$`) smaller than all other letters to map boundaries during inversion.
	- **LF Mapping** — the core math mapping occurrences in the last sorted column to occurrences in the first column.
	- **Suffix Arrays** — construction of forward BWT can be optimized from $O(N^2 \log N)$ to $O(N)$ utilizing a Suffix Array.
	- **Compression basis** — serves as the foundation for the bzip2 archive format, paired with Move-To-Front (MTF) and Huffman.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [TheAlgorithms – Burrows-Wheeler Transform (Python)](https://github.com/TheAlgorithms/Python/blob/master/hashes/burrows_wheeler.py)
		- [GeeksforGeeks — Burrows-Wheeler Transform](https://www.geeksforgeeks.org/burrows-wheeler-transform-and-its-inversion/)