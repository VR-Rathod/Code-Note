# Explanation:
	- A **Cartesian Tree** is a binary tree in which the heap property is satisfied (the value of each node is less than or equal to its children) and the inorder traversal of the tree gives a sorted sequence of elements.
	-
	- The Cartesian Tree is a binary search tree (BST) in terms of the **inorder** traversal but satisfies the **heap property** in terms of node values.
-
- # Steps:
	- **Insertion**: Each insertion keeps the tree balanced by promoting the new element to the root and adjusting the tree using rotations (similar to splay operations).
	-
	- **Heap Property**: The tree must maintain the heap property such that every parent node has a value less than or equal to its children.
-
- # Time Complexity:
	- **Insertion**: O(log n)
	- **Search**: O(log n) for balanced trees, but it can be worse depending on tree shape.
-
- ```python
  class CartesianTreeNode:
      def __init__(self, key):
          self.key = key
          self.left = None
          self.right = None
  
  class CartesianTree:
      def __init__(self):
          self.root = None
  
      def merge(self, left, right):
          if not left or not right:
              return left if left else right
          if left.key < right.key:
              left.right = self.merge(left.right, right)
              return left
          else:
              right.left = self.merge(left, right.left)
              return right
  
      def insert(self, root, key):
          new_node = CartesianTreeNode(key)
          return self.merge(root, new_node)
  
      def inorder(self, root):
          if not root:
              return []
          return self.inorder(root.left) + [root.key] + self.inorder(root.right)
  
  # Example usage
  cartesian_tree = CartesianTree()
  cartesian_tree.root = cartesian_tree.insert(cartesian_tree.root, 5)
  cartesian_tree.root = cartesian_tree.insert(cartesian_tree.root, 2)
  cartesian_tree.root = cartesian_tree.insert(cartesian_tree.root, 8)
  
  print("Inorder traversal:", cartesian_tree.inorder(cartesian_tree.root))  # Output: [2, 5, 8]
  ```