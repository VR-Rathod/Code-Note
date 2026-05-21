---
seoTitle: Manacher's Algorithm – Longest Palindromic Substring in O(n)
description: "Manacher's algorithm finds the longest palindromic substring in linear time. Covers center expansion, palindrome radius array, O(n) time, and string."
keywords: "Manacher algorithm, longest palindrome, palindromic substring, O(n), linear time, string algorithm, center expansion, palindrome radius, time complexity, space complexity"
---

- # Explanation:
	- **Manacher's Algorithm** is an efficient algorithm to find the **longest palindromic substring** in linear time **O(n)**.
	-
	- It avoids redundant checks by expanding around possible centers while using previously computed results to minimize effort.
-
- # Steps:
	- Transform the input string to insert special characters (e.g., `#`) between each character and at the ends, so every palindrome has an odd length.
	-
	- Use a center-expansion technique to find palindromes while maintaining the current rightmost palindrome's boundaries.
	-
	- Update the result if a longer palindrome is found during the process.
-
- # Time Complexity:
	- **Time complexity**: **O(n)**, where `n` is the length of the string.
-
- ```python
  def manacher(s):
      # Preprocess the string to handle even-length palindromes
      s = '#' + '#'.join(s) + '#'
      n = len(s)
      p = [0] * n
      center, right = 0, 0
      
      for i in range(n):
          mirror = 2 * center - i
          if i < right:
              p[i] = min(right - i, p[mirror])
          
          # Try expanding around center i
          while i + p[i] + 1 < n and i - p[i] - 1 >= 0 and s[i + p[i] + 1] == s[i - p[i] - 1]:
              p[i] += 1
          
          # Update center and right boundary
          if i + p[i] > right:
              center, right = i, i + p[i]
      
      # Find the longest palindrome
      max_len = max(p)
      center_index = p.index(max_len)
      return s[center_index - max_len:center_index + max_len].replace('#', '')
  
  # Example usage
  s = "babad"
  result = manacher(s)
  print(f"Longest palindromic substring: {result}")
  ```