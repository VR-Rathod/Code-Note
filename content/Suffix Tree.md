# Explanation:
	- A **Suffix Tree** is a compressed trie of all suffixes of a given string.
	-
	- It allows efficient string matching, substring search, and various other operations on strings.
-
- # Steps:
	- Construct the tree by inserting all suffixes of a string.
	-
	- Each node represents a substring, and each edge represents a suffix of the string.
-
- # Time Complexity:
	- **Construction**: O(n) where n is the length of the string.
	- **Querying**: O(m), where m is the length of the substring being queried.
-
- ```python
  class SuffixTreeNode:
      def __init__(self):
          self.children = {}
          self.suffix_link = None
  
  class SuffixTree:
      def __init__(self, text):
          self.text = text
          self.root = SuffixTreeNode()
          self.build()
  
      def build(self):
          # Placeholder for constructing suffix tree
          pass
  
  # Example usage
  suffix_tree = SuffixTree("banana")
  ```