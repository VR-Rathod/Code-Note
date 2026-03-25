---
seoTitle: AA Tree Explained – Balanced BST Implementation Guide
description: "AA tree is a balanced binary search tree variant of red-black trees. Learn insertion, deletion, skew, split operations, and time complexity analysis."
keywords: "AA tree, balanced BST, self-balancing tree, binary search tree, skew operation, split operation, time complexity, space complexity, tree rotation, data structures"
---

# Explanation
	- The **AA Tree** is a self-balancing binary search tree (BST). It’s a variation of the Red-Black Tree but with a simpler set of rules. The primary difference lies in how the tree is balanced, and it ensures that operations like insertion, deletion, and searching remain efficient.
-
- # Steps:
	- The **balance condition** is enforced with a single balance factor for each node (the "level"), which simplifies the balancing process.
	-
	- **Level Rule**: The left child of a node must have the same level or one more level than its parent.
	-
	- **Rotation Rule**: The tree uses rotations (like right or left) to ensure the balance after insertion or deletion.
-
- # Time Complexity
	- **Insertion**: O(log n)
	- **Deletion**: O(log n)
	- **Search**: O(log n)
-
- ```python
  class AATreeNode:
      def __init__(self, key):
          self.key = key
          self.level = 1
          self.left = None
          self.right = None
  
  class AATree:
      def __init__(self):
          self.root = None
      
      def skew(self, node):
          if node and node.left and node.left.level == node.level:
              node = self.rotate_right(node)
          return node
      
      def split(self, node):
          if node and node.right and node.right.right and node.right.right.level == node.level:
              node = self.rotate_left(node)
              node.level += 1
          return node
      
      def rotate_right(self, node):
          temp = node.left
          node.left = temp.right
          temp.right = node
          return temp
      
      def rotate_left(self, node):
          temp = node.right
          node.right = temp.left
          temp.left = node
          return temp
  
      def insert(self, node, key):
          if node is None:
              return AATreeNode(key)
          
          if key < node.key:
              node.left = self.insert(node.left, key)
          elif key > node.key:
              node.right = self.insert(node.right, key)
          else:
              return node
  
          node = self.skew(node)
          node = self.split(node)
          return node
      
      def search(self, node, key):
          if node is None or node.key == key:
              return node
          elif key < node.key:
              return self.search(node.left, key)
          else:
              return self.search(node.right, key)
  
      def add(self, key):
          self.root = self.insert(self.root, key)
  
  # Example usage
  aatree = AATree()
  aatree.add(10)
  aatree.add(20)
  aatree.add(5)
  
  result = aatree.search(aatree.root, 10)
  if result:
      print(f"Found key {result.key}")
  else:
      print("Key not found")
  ```