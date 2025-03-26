# Explanation
	- The **Rabin-Karp Algorithm** is a string searching algorithm used to find a pattern within a larger text. It uses a **hashing** technique to perform efficient string matching. The idea behind Rabin-Karp is to compare the hash values of the pattern and substrings of the text. If the hash values match, we then perform an **actual string comparison** to check for a real match.
-
- # Steps:
	- Compute the hash of the **pattern** and the first window of the **text**.
	- Compare the hash of each substring in the text with the hash of the pattern.
	- If the hashes match, compare the actual strings of the pattern and the substring.
	- Repeat the process for all possible windows in the text.
-
- # Time Complexity:
	- The **worst-case time complexity** is **O(n*m)**, where **n** is the size of the text and **m** is the size of the pattern.
	- The **average-case time complexity** is **O(n + m)**, provided hashing is done efficiently.
-
- ```python
  def rabin_karp(text, pattern):
      n = len(text)
      m = len(pattern)
      d = 256  # Number of characters in the input alphabet
      q = 101  # A prime number to perform modulus operation
      
      # Calculate hash value of the pattern and first window of the text
      p_hash = 0
      t_hash = 0
      for i in range(m):
          p_hash = (p_hash * d + ord(pattern[i])) % q
          t_hash = (t_hash * d + ord(text[i])) % q
      
      # Check for pattern match
      for i in range(n - m + 1):
          if p_hash == t_hash:  # Hashes match, compare strings
              if text[i:i + m] == pattern:
                  print(f"Pattern found at index {i}")
          
          if i < n - m:
              # Update hash value for next window
              t_hash = (d * (t_hash - ord(text[i]) * (d ** (m - 1))) + ord(text[i + m])) % q
              if t_hash < 0:
                  t_hash += q
  
  # Example usage
  text = "ABABDABACDABABCABAB"
  pattern = "ABABCABAB"
  rabin_karp(text, pattern)
  ```