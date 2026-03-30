---
seoTitle: Burrows-Wheeler Transform – Data Compression Algorithm Guide
description: "The Burrows-Wheeler Transform rearranges characters to improve compression. Learn BWT construction, inverse transform, suffix arrays, and use in bzip2."
keywords: "Burrows-Wheeler transform, BWT, data compression, suffix array, bzip2, string transformation, inverse BWT, time complexity, space complexity, text compression"
---

- # Explanation
	- The **Burrows-Wheeler Transform (BWT)** is a string transformation algorithm used in data compression. It reorders the characters of a string into runs of similar characters, making it easier to compress.
-
- # Steps
	- **Generate all cyclic rotations** of the string.
	-
	- Sort these rotations lexicographically.
	-
	- The last column of the sorted rotations is the BWT of the string.
-
- # Time Complexity
	- **Time complexity**: O(n log n) for sorting the rotations.
-
- ```python
  def burrows_wheeler_transform(s):
      s = s + '$'  # Adding a sentinel character
      rotations = [s[i:] + s[:i] for i in range(len(s))]
      rotations.sort()
      return ''.join([rotation[-1] for rotation in rotations])
  
  # Example usage
  s = "banana"
  bwt = burrows_wheeler_transform(s)
  print(f"BWT of '{s}' is '{bwt}'")
  ```