---
seoTitle: Splay Tree Explained – Self-Adjusting BST with Amortized O(log n)
description: "Splay trees move recently accessed nodes to the root via splaying rotations. Covers zig, zig-zig, zig-zag cases, amortized O(log n), and cache-friendly access."
keywords: "splay tree, self-adjusting BST, splaying, zig rotation, zig-zig, zig-zag, amortized O(log n), time complexity, space complexity, cache-friendly, data structure, VR-Rathod, Code-Note, code note vr, vr book"
treeTitle: DSA - Trees - Splay Tree
---

> [!info] What is a Splay Tree?
> A **Splay Tree** is a self-adjusting binary search tree (BST) that automatically moves recently accessed elements to the root.
> Rather than maintaining strict structural balance (like AVL or Red-Black trees), it dynamically optimizes for **temporal locality of access**, achieving an **amortized time complexity of $O(\log n)$** for search, insertion, and deletion.

- # Explanation
	- The core operation in a Splay Tree is **Splaying**. Whenever a node is accessed (searched, inserted, or deleted), it is pushed to the root of the tree through a sequence of specific **tree rotations**.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **desk file organizer**. When you need a folder, you pull it out and place it right at the **front**.
		- Over time, files you use frequently stay at the front of the organizer for quick access, while rarely used files naturally drift to the back.
	-
	- ## Why Splay Trees?
	  collapsed:: true
		- In many applications, data access is **highly skewed** (e.g., 80% of queries target 20% of the elements).
		- A Splay Tree automatically minimizes search paths for these frequently accessed elements, making it highly **cache-friendly**.
		- It also does not require storing any balance metadata (like heights or colors) in node structures, reducing memory footprints.
-
- # How It Works
  collapsed:: true
	- ## The Splaying Operations
	  collapsed:: true
		- Splaying moves a target node $X$ to the root using three cases based on the roles of its parent $P$ and grandparent $G$:
		-
		- ### Case 1: Zig (Single Rotation)
		  collapsed:: true
			- **When**: Node $X$'s parent $P$ is the root of the tree.
			- **Action**: Perform a single right rotation (if $X$ is a left child) or left rotation (if $X$ is a right child).
			- ```
			       P (Root)             X
			        /   \     --->     / \
			       X     C            A   P
			      / \                    / \
			     A   B                  B   C
			  ```
		- ### Case 2: Zig-Zig (Double Rotation, Same Direction)
		  collapsed:: true
			- **When**: $X$ and $P$ are both left children, or both right children.
			- **Action**: First rotate $P$ around grandparent $G$, then rotate $X$ around parent $P$ in the same direction.
			- ```
			         G                   P                 X
			        / \                 / \               / \
			       P   D   --->        X   G    --->     A   P
			      / \                 / \ / \               / \
			     X   C               A  B C  D             B   G
			    / \                                           / \
			   A   B                                         C   D
			  ```
		- ### Case 3: Zig-Zag (Double Rotation, Opposite Directions)
		  collapsed:: true
			- **When**: $X$ is a right child and $P$ is a left child (or vice versa).
			- **Action**: First rotate $X$ around parent $P$ (left), then rotate $X$ around grandparent $G$ (right).
			- ```
			         G                   G                   X
			        / \                 / \                 / \
			       P   D   --->        X   D    --->       P   G
			      / \                 / \                 / \ / \
			     A   X               P   C               A  B C  D
			        / \             / \
			       B   C           A   B
			  ```
	-
	- ## Operations
	  collapsed:: true
		- ### Search
			- Search for the key like a normal BST. Splay the found node (or the last accessed node if not found) to the root.
		- ### Insertion
			- Splay the tree with the target key. If the key is not in the tree, split the root and insert the new node as the new root.
		- ### Deletion
			- Splay the target key to the root. Delete the root. Splay the maximum node in the left subtree to become the new root, then attach the right subtree to it.
-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Amortized Bounds
	  > Splay Trees do not guarantee $O(\log n)$ performance for a **single** operation (the worst-case tree can be a linear chain of $O(n)$).
	  > However, the mathematical properties of splay rotations guarantee that any sequence of $m$ operations starting from an empty tree takes $O(m \log n)$ time, yielding an amortized bound of **$O(\log n)$**.
	-
	- | Operation | Time Complexity (Amortized) | Time Complexity (Worst-Case) | Space Complexity |
	  |-----------|-----------------------------|------------------------------|------------------|
	  | **Search** | $O(\log n)$ | $O(n)$ | $O(\log n)$ stack |
	  | **Insert** | $O(\log n)$ | $O(n)$ | $O(\log n)$ stack |
	  | **Delete** | $O(\log n)$ | $O(n)$ | $O(\log n)$ stack |
-
- # Implementation
  collapsed:: true
	- > [!note] Splay Tree Implementation
	  > Below are complete, functional implementations in Python and C++ utilizing bottom-up splaying logic.
	-
	- :::code-tabs
	  
	  ```python
	  class SplayTreeNode:
	      def __init__(self, key):
	          self.key = key
	          self.left = None
	          self.right = None
	  
	  class SplayTree:
	      def __init__(self):
	          self.root = None
	  
	      def _right_rotate(self, x):
	          y = x.left
	          x.left = y.right
	          y.right = x
	          return y
	  
	      def _left_rotate(self, x):
	          y = x.right
	          x.right = y.left
	          y.left = x
	          return y
	  
	      def splay(self, root, key):
	          """Recursively splays the key to the root of the subtree."""
	          if not root or root.key == key:
	              return root
	  
	          # Key lies in the left subtree
	          if key < root.key:
	              if not root.left:
	                  return root
	              
	              # Zig-Zig (Left Left)
	              if key < root.left.key:
	                  root.left.left = self.splay(root.left.left, key)
	                  root = self._right_rotate(root)
	              # Zig-Zag (Left Right)
	              elif key > root.left.key:
	                  root.left.right = self.splay(root.left.right, key)
	                  if root.left.right:
	                      root.left = self._left_rotate(root.left)
	              
	              if not root.left:
	                  return root
	              return self._right_rotate(root)
	  
	          # Key lies in the right subtree
	          else:
	              if not root.right:
	                  return root
	              
	              # Zag-Zig (Right Left)
	              if key < root.right.key:
	                  root.right.left = self.splay(root.right.left, key)
	                  if root.right.left:
	                      root.right = self._right_rotate(root.right)
	              # Zag-Zag (Right Right)
	              elif key > root.right.key:
	                  root.right.right = self.splay(root.right.right, key)
	                  root = self._left_rotate(root)
	              
	              if not root.right:
	                  return root
	              return self._left_rotate(root)
	  
	      def insert(self, key):
	          if not self.root:
	              self.root = SplayTreeNode(key)
	              return
	  
	          self.root = self.splay(self.root, key)
	          if self.root.key == key:
	              return  # Key already exists
	  
	          new_node = SplayTreeNode(key)
	          if key < self.root.key:
	              new_node.right = self.root
	              new_node.left = self.root.left
	              self.root.left = None
	          else:
	              new_node.left = self.root
	              new_node.right = self.root.right
	              self.root.right = None
	          self.root = new_node
	  
	      def search(self, key):
	          self.root = self.splay(self.root, key)
	          return self.root is not None and self.root.key == key
	  
	      def remove(self, key):
	          if not self.root:
	              return
	  
	          self.root = self.splay(self.root, key)
	          if self.root.key != key:
	              return  # Key not in tree
	  
	          # Disconnect root and re-link subtrees
	          if not self.root.left:
	              self.root = self.root.right
	          else:
	              temp_right = self.root.right
	              self.root = self.root.left
	              self.root = self.splay(self.root, key)
	              self.root.right = temp_right
	  
	  # Example Usage
	  if __name__ == "__main__":
	      tree = SplayTree()
	      for val in [100, 50, 200, 75]:
	          tree.insert(val)
	      
	      print("Search 50 (moves to root):", tree.search(50))  # True
	      print("Root is now:", tree.root.key)  # 50
	  ```
	  
	  ```c++
	  #include <iostream>
	  
	  struct Node {
	      int key;
	      Node* left;
	      Node* right;
	      Node(int k) : key(k), left(nullptr), right(nullptr) {}
	  };
	  
	  class SplayTree {
	  private:
	      Node* root;
	  
	      Node* rightRotate(Node* x) {
	          Node* y = x->left;
	          x->left = y->right;
	          y->right = x;
	          return y;
	      }
	  
	      Node* leftRotate(Node* x) {
	          Node* y = x->right;
	          x->right = y->left;
	          y->left = x;
	          return y;
	      }
	  
	      Node* splay(Node* curr, int key) {
	          if (!curr || curr->key == key) return curr;
	  
	          if (key < curr->key) {
	              if (!curr->left) return curr;
	  
	              if (key < curr->left->key) {
	                  curr->left->left = splay(curr->left->left, key);
	                  curr = rightRotate(curr);
	              } else if (key > curr->left->key) {
	                  curr->left->right = splay(curr->left->right, key);
	                  if (curr->left->right) {
	                      curr->left = leftRotate(curr->left);
	                  }
	              }
	  
	              if (!curr->left) return curr;
	              return rightRotate(curr);
	          } else {
	              if (!curr->right) return curr;
	  
	              if (key < curr->right->key) {
	                  curr->right->left = splay(curr->right->left, key);
	                  if (curr->right->left) {
	                      curr->right = rightRotate(curr->right);
	                  }
	              } else if (key > curr->right->key) {
	                  curr->right->right = splay(curr->right->right, key);
	                  curr = leftRotate(curr);
	              }
	  
	              if (!curr->right) return curr;
	              return leftRotate(curr);
	          }
	      }
	  
	      void destroyTree(Node* node) {
	          if (!node) return;
	          destroyTree(node->left);
	          destroyTree(node->right);
	          delete node;
	      }
	  
	  public:
	      SplayTree() : root(nullptr) {}
	      ~SplayTree() { destroyTree(root); }
	  
	      void insert(int key) {
	          if (!root) {
	              root = new Node(key);
	              return;
	          }
	  
	          root = splay(root, key);
	          if (root->key == key) return;
	  
	          Node* newNode = new Node(key);
	          if (key < root->key) {
	              newNode->right = root;
	              newNode->left = root->left;
	              root->left = nullptr;
	          } else {
	              newNode->left = root;
	              newNode->right = root->right;
	              root->right = nullptr;
	          }
	          root = newNode;
	      }
	  
	      bool search(int key) {
	          root = splay(root, key);
	          return root && root->key == key;
	      }
	  
	      void remove(int key) {
	          if (!root) return;
	  
	          root = splay(root, key);
	          if (root->key != key) return;
	  
	          Node* temp = root;
	          if (!root->left) {
	              root = root->right;
	          } else {
	              Node* rightSubtree = root->right;
	              root = root->left;
	              root = splay(root, key);
	              root->right = rightSubtree;
	          }
	          delete temp;
	      }
	  
	      int getRootKey() const {
	          return root ? root->key : -1;
	      }
	  };
	  
	  int main() {
	      SplayTree tree;
	      for (int val : {100, 50, 200, 75}) {
	          tree.insert(val);
	      }
	      std::cout << std::boolalpha;
	      std::cout << "Search 50: " << tree.search(50) << "\n";  // true
	      std::cout << "Root is: " << tree.getRootKey() << "\n";    // 50
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use
  collapsed:: true
	- ## ✅ Use Splay Trees When:
		- You want to design high-performance **cache structures** or memory allocation managers where a small subset of elements is queried repeatedly.
		- Memory overhead per node must be minimized (no storage needed for node height, balance factors, or colors).
		- Implementing a simplified functional dictionary or search mechanism.
	-
	- ## ❌ Avoid When:
		- You need guaranteed **real-time limits** for individual operations (since a single lookup can take $O(n)$ time in the worst-case).
		- The data access pattern is strictly uniform (randomized query keys), in which case Red-Black or AVL trees perform better without the constant overhead of reorganizing rotations on every query.
-
- # Variations & Related
  collapsed:: true
	- [[AA Tree]] – Self-balancing tree using level values.
	- [[Binary Search Tree]] – Non-balancing parent search structure.
-
- # Key Takeaways
  collapsed:: true
	- Splay Trees dynamically adjust node positions based on query trends (temporal locality).
	- The active node is splayed to the root via rotations: **Zig**, **Zig-Zig**, and **Zig-Zag**.
	- Operations yield an amortized bound of **$O(\log n)$** time complexity.
	- Ideal for database query optimizations and caching layers because no auxiliary node metadata is required.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Wikipedia -> Splay tree](https://en.wikipedia.org/wiki/Splay_tree)
		- [GeeksforGeeks -> Splay Tree](https://www.geeksforgeeks.org/splay-tree-set-1-insert/)