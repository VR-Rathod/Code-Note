---
seoTitle: Scapegoat Tree Explained – Amortized Balanced BST Without Rotations
description: "Scapegoat trees maintain balance by rebuilding subtrees when imbalance is detected. Covers alpha-weight balance, rebuild trigger, O(log n) amortized operations."
keywords: "scapegoat tree, balanced BST, amortized complexity, alpha-weight balance, tree rebuild, O(log n), time complexity, space complexity, self-balancing tree, data structure"
---

# Explanation:
	- A **Scapegoat Tree** is a type of self-balancing binary search tree that uses an amortized **O(log n)** time complexity for insertion and deletion.
	-
	- Unlike AVL and Red-Black Trees, it does not maintain a strict balance at every node but ensures that the tree does not become unbalanced by periodically rebuilding subtrees.
-
- # Steps:
	- **Insertion**: Insert elements as in a regular binary search tree. When a subtree becomes too unbalanced, a "scapegoat" node is found and the subtree is rebuilt to restore balance.
	-
	- **Rebuilding**: The tree periodically rebuilds a subtree when an insertion violates the balance property.
-
- # Time Complexity:
	- **Insertion**: O(log n) amortized
	- **Rebuilding**: O(n) for the worst case (rebuilding the tree)
-
- ```python
  class ScapegoatTreeNode:
      def __init__(self, key):
          self.key = key
          self.left = None
          self.right = None
          self.parent = None
  
  class ScapegoatTree:
      def __init__(self):
          self.root = None
      
      def insert(self, key):
          # Perform insertion as a regular binary search tree
          self.root = self._insert(self.root, key)
          
          # Check if the tree is balanced and rebuild if necessary
          if self._is_unbalanced(self.root):
              self._rebalance(self.root)
  
      def _insert(self, node, key):
          # Perform binary search tree insertion
          if node is None:
              return ScapegoatTreeNode(key)
          
          if key < node.key:
              node.left = self._insert(node.left, key)
          else:
              node.right = self._insert(node.right, key)
          
          return node
      
      def _is_unbalanced(self, node):
          # Check if a subtree is unbalanced (e.g., height difference)
          return False  # Placeholder for balance checking logic
      
      def _rebalance(self, node):
          # Rebuild the tree or subtree for balance
          pass
  
  # Example usage
  scapegoat_tree = ScapegoatTree()
  scapegoat_tree.insert(10)
  scapegoat_tree.insert(5)
  scapegoat_tree.insert(20)
  
  ```