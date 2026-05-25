---
date: 2025-03-26T12:40:55+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Finger Tree Explained – Functional Sequence Data Structure
description: "Finger trees are functional data structures supporting O(1) access at both ends and O(log n) splits. Covers 2-3 finger trees, monoid annotations, and deque."
keywords: "finger tree, functional data structure, deque, O(1) access, O(log n) split, monoid annotation, 2-3 tree, time complexity, space complexity, persistent data structure"
---

- # Explanation
	- A **Finger Tree** is a data structure that supports efficient access and updates at both ends of a sequence (like a deque) and allows efficient range queries and updates.
	-
	- It’s often used for sequences where you need to access both ends and perform frequent insertions and deletions.
-
- # Steps:
	- The **finger tree** has a finger (a pointer) to a specific position in the sequence, which enables efficient access to both ends and arbitrary positions.
	-
	- **Insertion/Deletion**: The structure supports logarithmic-time operations to add/remove elements from both ends.
-
- # Time Complexity:
	- **Access/Insertion/Deletion**: O(log n)
	- **Query**: O(log n) for general operations, O(1) for accessing ends.
-
- ```python
  class FingerTreeNode:
      def __init__(self, value=None, left=None, right=None):
          self.value = value
          self.left = left
          self.right = right
  
  class FingerTree:
      def __init__(self):
          self.root = None
  
      def insert_left(self, value):
          new_node = FingerTreeNode(value=value)
          if self.root:
              new_node.right = self.root
              self.root.left = new_node
          self.root = new_node
  
      def insert_right(self, value):
          new_node = FingerTreeNode(value=value)
          if self.root:
              current = self.root
              while current.right:
                  current = current.right
              current.right = new_node
              new_node.left = current
          else:
              self.root = new_node
  
      def get_left(self):
          return self.root.value if self.root else None
  
      def get_right(self):
          current = self.root
          while current and current.right:
              current = current.right
          return current.value if current else None
  
  # Example usage
  finger_tree = FingerTree()
  finger_tree.insert_left(10)
  finger_tree.insert_right(20)
  
  print("Left end:", finger_tree.get_left())  # Output: 10
  print("Right end:", finger_tree.get_right())  # Output: 20
  ```