---
seoTitle: Splay Tree Explained – Self-Adjusting BST with Amortized O(log n)
description: "Splay trees move recently accessed nodes to the root via splaying rotations. Covers zig, zig-zig, zig-zag cases, amortized O(log n), and cache-friendly access."
keywords: "splay tree, self-adjusting BST, splaying, zig rotation, zig-zig, zig-zag, amortized O(log n), time complexity, space complexity, cache-friendly, data structure"
---

# Explanation
	- A **Splay Tree** is a self-adjusting binary search tree that automatically moves the accessed element to the root via **splaying**.
	-
	- The **splaying** operation brings the accessed node to the root by performing rotations.
-
- # Steps:
	- **Insertion**: Insert as in a regular binary search tree, then perform a splay operation to bring the newly inserted node to the root.
	-
	- **Splaying**: The splay operation involves a series of tree rotations that move the accessed node to the root.
-
- # Time Complexity:
	- **Insertion**: O(log n) amortized
	-
	- **Search**: O(log n) amortized
-
- ```python
  class SplayTreeNode:
      def __init__(self, key):
          self.key = key
          self.left = None
          self.right = None
  
  class SplayTree:
      def __init__(self):
          self.root = None
      
      def insert(self, key):
          self.root = self._insert(self.root, key)
          self._splay(self.root, key)
  
      def _insert(self, node, key):
          if not node:
              return SplayTreeNode(key)
          
          if key < node.key:
              node.left = self._insert(node.left, key)
          else:
              node.right = self._insert(node.right, key)
          
          return node
      
      def _splay(self, node, key):
          # Placeholder for the splay operation
          pass
  
  # Example usage
  splay_tree = SplayTree()
  splay_tree.insert(10)
  splay_tree.insert(20)
  splay_tree.insert(5)
  ```