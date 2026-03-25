---
seoTitle: FM-Index Explained – Compressed Full-Text Search Index
description: "FM-index enables compressed full-text search using Burrows-Wheeler Transform and suffix arrays. Covers backward search, LF-mapping, count and locate operations."
keywords: "FM-index, full-text search, Burrows-Wheeler transform, suffix array, backward search, LF-mapping, compressed index, time complexity, space complexity, bioinformatics"
---

# Explanation
	- The **FM-index** is a data structure used for efficient full-text searching, especially for applications like searching within compressed texts. It is based on the Burrows-Wheeler Transform (BWT) and allows fast searching while using less space than traditional indexing methods.
-
- # Steps
	- **Construct the Burrows-Wheeler Transform (BWT)** of the text.
	-
	- **Build the suffix array** for the text.
	-
	- **Preprocess the text** to store information about the first and last columns of the BWT matrix.
	-
	- **Use the FM-index** to perform backward searches by repeatedly scanning the text from the last column to the first column.
-
- # Time Complexity
	- **Preprocessing time**: O(n log n) for BWT and suffix array construction.
	-
	- **Query time**: O(m log n), where `m` is the length of the pattern being searched, and `n` is the length of the text.
-
- ```python
  class FMIndex:
      def __init__(self, text):
          self.text = text
          self.bwt = self.burrows_wheeler_transform(text)
          self.suffix_array = self.build_suffix_array(text)
          
      def burrows_wheeler_transform(self, text):
          # Generate the Burrows-Wheeler Transform (BWT) for the text
          pass
      
      def build_suffix_array(self, text):
          # Build the suffix array for the text
          pass
  
      def search(self, pattern):
          # Implement backward search with FM-index
          pass
  
  # Example usage
  fm_index = FMIndex("banana")
  print(fm_index.search("ana"))  # Example search
  ```