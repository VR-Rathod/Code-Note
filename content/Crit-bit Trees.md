---
seoTitle: Crit-bit Trees Explained – Fast Binary Trie Implementation
description: "Crit-bit trees are compact binary tries for fast string and integer lookups. Learn critical bit identification, insertion, deletion, and performance vs hash."
keywords: "crit-bit tree, binary trie, prefix tree, string lookup, critical bit, radix tree, time complexity, space complexity, data structure, key-value store"
---

- # Explanation
	- A **Crit-bit Tree** is a binary search tree used for storing strings, especially strings of arbitrary length, in a compressed form.
	-
	- The **Crit-bit** refers to the bit position in the common prefix of two strings where they differ. The tree is a form of **binary trie** with a compressed path.
	-
	- The tree is used to efficiently handle string searches and updates, with each node storing a single bit representing the largest common prefix bit difference between the two strings.
-
- # Steps:
	- **Insertion**: When inserting, the tree finds the position where the strings differ and creates a new node at the "crit-bit" position.
	-
	- **Search**: Searching in a Crit-bit Tree works by following the path based on the crit-bit values (common prefix bit position) and comparing the strings.
-
- # Time Complexity:
	- **Insertion**: O(k), where k is the length of the string.
	- **Search**: O(k), where k is the length of the string.
-
- ```python
  class CritBitTreeNode:
      def __init__(self, key=None):
          self.key = key
          self.left = None
          self.right = None
          self.bit_pos = None  # Position of the critical bit
  
  class CritBitTree:
      def __init__(self):
          self.root = None
      
      def insert(self, key):
          self.root = self._insert(self.root, key)
      
      def _insert(self, node, key):
          if not node:
              return CritBitTreeNode(key)
          
          # Find the critical bit where they differ
          common_prefix_length = self._common_prefix_length(node.key, key)
          if common_prefix_length < len(node.key):
              node.bit_pos = common_prefix_length
          
          if key[node.bit_pos] == '0':
              node.left = self._insert(node.left, key)
          else:
              node.right = self._insert(node.right, key)
          
          return node
      
      def _common_prefix_length(self, key1, key2):
          length = 0
          while length < len(key1) and length < len(key2) and key1[length] == key2[length]:
              length += 1
          return length
  
  # Example usage
  tree = CritBitTree()
  tree.insert("hello")
  tree.insert("helium")
  tree.insert("hero")
  ```