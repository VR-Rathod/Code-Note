---
seoTitle: Z Algorithm – Linear Time String Matching and Pattern Search
description: "The Z algorithm computes the Z-array for O(n+m) pattern matching. Covers Z-function definition, Z-box construction, pattern search application, and comparison."
keywords: "Z algorithm, Z-function, string matching, pattern search, O(n+m), linear time, Z-array, Z-box, time complexity, space complexity, string algorithm"
---

- # Explanation
	- The **Z Algorithm** is a string matching algorithm that provides efficient matching of **prefixes** within a string. It represents the string as an array where each index in the array holds a **Z-value**. The Z-value at each index represents the length of the longest substring starting from that index which is also a prefix of the string.
-
- # Steps:
	- Compute the **Z-array** for the given string.
	- The Z-value at each index tells the length of the matching prefix starting from that index.
	- If a Z-value matches the length of the pattern, it indicates a match at that position.
-
- # Time Complexity:
	- The time complexity of the Z Algorithm is **O(n)**, where **n** is the size of the string.
-
- ```python
  def z_algorithm(s):
      z = [0] * len(s)
      l, r, k = 0, 0, 0
      for i in range(1, len(s)):
          if i <= r:
              z[i] = min(r - i + 1, z[i - l])
          while i + z[i] < len(s) and s[z[i]] == s[i + z[i]]:
              z[i] += 1
          if i + z[i] - 1 > r:
              l, r = i, i + z[i] - 1
      return z
  
  def pattern_search(text, pattern):
      combined = pattern + "$" + text
      z = z_algorithm(combined)
      m = len(pattern)
      for i in range(m + 1, len(z)):
          if z[i] == m:
              print(f"Pattern found at index {i - m - 1}")
  
  # Example usage
  text = "ABABDABACDABABCABAB"
  pattern = "ABABCABAB"
  pattern_search(text, pattern)
  ```