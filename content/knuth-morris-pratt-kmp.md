---
seoTitle: KMP Algorithm – Knuth-Morris-Pratt String Search Explained
description: "KMP searches for a pattern in a string in O(n+m) time using a failure function. Covers prefix function construction, pattern matching, and comparison with."
keywords: "KMP algorithm, Knuth-Morris-Pratt, string search, pattern matching, failure function, prefix function, O(n+m), time complexity, space complexity, substring search"
---

- # Explanation
	- The KMP algorithm is used for **pattern matching** in a text. It improves upon the naive approach by avoiding unnecessary re-evaluations of characters.
-
- # Steps
	- Preprocess the pattern to create a **longest prefix suffix (LPS)** array.
	-
	- Traverse the text and the pattern while using the LPS array to skip unnecessary comparisons.
	-
- # Time Complexity
	- O(n + m)**, where `n` is the length of the text and `m` is the length of the pattern.
-
- ```python
  def KMP(pattern, text):
      def compute_lps(pattern):
          lps = [0] * len(pattern)
          length = 0
          i = 1
          while i < len(pattern):
              if pattern[i] == pattern[length]:
                  length += 1
                  lps[i] = length
                  i += 1
              else:
                  if length != 0:
                      length = lps[length - 1]
                  else:
                      i += 1
          return lps
  
      lps = compute_lps(pattern)
      i = j = 0
      while i < len(text):
          if pattern[j] == text[i]:
              i += 1
              j += 1
          if j == len(pattern):
              return i - j
          elif i < len(text) and pattern[j] != text[i]:
              if j != 0:
                  j = lps[j - 1]
              else:
                  i += 1
      return -1
  
  # Example usage
  text = "ababcababcabc"
  pattern = "ababc"
  print("Pattern found at index:", KMP(pattern, text))
  ```