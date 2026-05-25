---
seoTitle: AA Tree Explained – Self-Balancing BST with C++ and Python
description: "Learn AA Trees, a simplified Red-Black Tree variant using levels instead of colors. Detailed skew, split, insert, delete operations in C++ and Python."
keywords: "AA tree, balanced BST, self-balancing tree, skew, split, C++, Python, data structures, algorithms, binary search tree, tree rotation, VR-Rathod, Code-Note, code note vr, vr book"
---

> [!info] What is an AA Tree?
> An **AA Tree** (Arne Andersson Tree) is a self-balancing binary search tree that simplifies the classic Red-Black Tree.
> It enforces balance using node **levels** (integers) rather than colors, significantly reducing the number of rotation cases needed during insertions and deletions.

- # Explanation
	- An **AA Tree** is a variant of the Red-Black Tree that eliminates half of the restructuring cases by requiring that **only right children** can be at the same level as their parent. 
	- Instead of colors (Red/Black), every node is tagged with an integer **level** representing the black height of the node.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **corporate hierarchy** where employees are assigned strict grade levels.
		  - You can have a peer (at your same grade level) working directly under you, but to avoid structural confusion, they **must sit on your right**. 
		  - No peers are allowed to sit on your left (left-child same level).
		  - You can have at most one peer reporting to you; if a second peer joins them, it triggers a promotion (level increment) to rebalance the team.
	-
	- ## Why AA Tree Over Red-Black Tree?
	  collapsed:: true
		- Red-Black Trees are highly efficient but notoriously complex to implement, requiring up to **6 balancing cases** for insertion and **8 cases** for deletion.
		- By restricting red links (nodes at the same level) to the right side, the AA Tree reduces rebalancing to just **2 simple operations**: **Skew** and **Split**.
-
- # How It Works
  collapsed:: true
	- ## The Level Rules
	  collapsed:: true
		- 1. Leaf nodes have a level of 1.
		- 2. The level of a left child must be exactly 1 less than its parent's level.
		- 3. The level of a right child must be equal to or 1 less than its parent's level.
		- 4. The level of a right grandchild must be strictly less than its grandparent's level.
		- 5. Every node with level > 1 must have two children.
	-
	- ## The Two Core Rebalancing Operations
	  collapsed:: true
		- ### 1. Skew (Right Rotation)
		  collapsed:: true
			- **Trigger**: When a left child has the same level as its parent (violating Rule 2).
			- **Action**: Perform a right rotation to turn the left horizontal link into a right horizontal link.
			- ```
			        Parent (Lvl X)                   LeftChild (Lvl X)
			          /        \                       /           \
			  LeftChild (Lvl X) Right                  LL        Parent (Lvl X)
			       /     \                                          /     \
			     LL      LR                                        LR    Right
			  ```
		- ### 2. Split (Left Rotation + Level Up)
		  collapsed:: true
			- **Trigger**: When a node has two consecutive right children at the same level (violating Rule 4).
			- **Action**: Perform a left rotation on the node and increment its level (promote it).
			- ```
			        Parent (Lvl X)                               RightChild (Lvl X+1)
			          /        \                                    /            \
			         A      RightChild (Lvl X)   ----->        Parent (Lvl X)   Grandchild (Lvl X)
			                    /       \                         /       \
			                   RL     Grandchild (Lvl X)         A        RL
			  ```
	-
	- ## Step-by-Step Insertion Process
	  collapsed:: true
		- 1. Perform standard BST insertion and set the new node's level to 1.
		- 2. On backtracking up the recursion tree, apply `skew()` to fix any left horizontal links.
		- 3. Apply `split()` to fix any double right horizontal links.
		- 4. Repeat skew and split checks at each parent node along the insertion path.
-
- # Time & Space Complexity
  collapsed:: true
	- | Operation | Time Complexity (Average) | Time Complexity (Worst) | Space Complexity |
	  |-----------|---------------------------|-------------------------|------------------|
	  | **Search** | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ call stack |
	  | **Insert** | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ call stack |
	  | **Delete** | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ call stack |
	- Height is guaranteed to be tightly bounded, yielding $O(\log n)$ performance across all operations.
-
- # Implementation
  collapsed:: true
	- > [!note] AA Tree Implementation
	  > Below are complete implementations for AA Trees, including search, skew, split, and insert operations.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  class AANode:
	      def __init__(self, key):
	          self.key = key
	          self.level = 1
	          self.left = None
	          self.right = None
	  
	  class AATree:
	      def __init__(self):
	          self.root = None
	  
	      def skew(self, node):
	          """Perform a right rotation if a node has a left child at the same level."""
	          if not node or not node.left:
	              return node
	          if node.left.level == node.level:
	              left_child = node.left
	              node.left = left_child.right
	              left_child.right = node
	              return left_child
	          return node
	  
	      def split(self, node):
	          """Perform a left rotation and level increment if there are consecutive right children at the same level."""
	          if not node or not node.right or not node.right.right:
	              return node
	          if node.right.right.level == node.level:
	              right_child = node.right
	              node.right = right_child.left
	              right_child.left = node
	              right_child.level += 1
	              return right_child
	          return node
	  
	      def insert(self, key):
	          self.root = self._insert(self.root, key)
	  
	      def _insert(self, node, key):
	          if not node:
	              return AANode(key)
	          
	          if key < node.key:
	              node.left = self._insert(node.left, key)
	          elif key > node.key:
	              node.right = self._insert(node.right, key)
	          else:
	              return node  # Ignore duplicate keys
	          
	          # Rebalance node
	          node = self.skew(node)
	          node = self.split(node)
	          return node
	  
	      def search(self, key):
	          """Return True if key exists in the tree, else False."""
	          curr = self.root
	          while curr:
	              if key == curr.key:
	                  return True
	              elif key < curr.key:
	                  curr = curr.left
	              else:
	                  curr = curr.right
	          return False
	  
	      def remove(self, key):
	          self.root = self._remove(self.root, key)
	  
	      def _decrease_level(self, node):
	          """Decrease level of a node if it is higher than its children's level + 1."""
	          if not node:
	              return node
	          left_lvl = node.left.level if node.left else 0
	          right_lvl = node.right.level if node.right else 0
	          should_be = min(left_lvl, right_lvl) + 1
	          
	          if should_be < node.level:
	              node.level = should_be
	              if node.right and should_be < node.right.level:
	                  node.right.level = should_be
	          return node
	  
	      def _remove(self, node, key):
	          if not node:
	              return None
	          
	          if key < node.key:
	              node.left = self._remove(node.left, key)
	          elif key > node.key:
	              node.right = self._remove(node.right, key)
	          else:
	              # Found the node to delete
	              if not node.left and not node.right:
	                  return None
	              elif not node.left:
	                  # Find successor
	                  succ = node.right
	                  while succ.left:
	                      succ = succ.left
	                  node.key = succ.key
	                  node.right = self._remove(node.right, succ.key)
	              else:
	                  # Find predecessor
	                  pred = node.left
	                  while pred.right:
	                      pred = pred.right
	                  node.key = pred.key
	                  node.left = self._remove(node.left, pred.key)
	          
	          # Rebalance node
	          node = self._decrease_level(node)
	          node = self.skew(node)
	          if node.right:
	              node.right = self.skew(node.right)
	              if node.right.right:
	                  node.right.right = self.skew(node.right.right)
	          node = self.split(node)
	          if node.right:
	              node.right = self.split(node.right)
	          return node
	  
	  # Example Usage
	  if __name__ == "__main__":
	      tree = AATree()
	      for val in [10, 20, 5, 15, 30]:
	          tree.insert(val)
	      
	      print("Search 15:", tree.search(15))  # Output: True
	      tree.remove(15)
	      print("Search 15 after removal:", tree.search(15))  # Output: False
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  struct Node {
	      int key;
	      int level;
	      Node* left;
	      Node* right;
	  
	      Node(int k) : key(k), level(1), left(nullptr), right(nullptr) {}
	  };
	  
	  class AATree {
	  private:
	      Node* root;
	  
	      Node* skew(Node* T) {
	          if (T && T->left && T->left->level == T->level) {
	              Node* L = T->left;
	              T->left = L->right;
	              L->right = T;
	              return L;
	          }
	          return T;
	      }
	  
	      Node* split(Node* T) {
	          if (T && T->right && T->right->right && T->right->right->level == T->level) {
	              Node* R = T->right;
	              T->right = R->left;
	              R->left = T;
	              R->level++;
	              return R;
	          }
	          return T;
	      }
	  
	      Node* decreaseLevel(Node* T) {
	          int leftLvl = T->left ? T->left->level : 0;
	          int rightLvl = T->right ? T->right->level : 0;
	          int shouldBe = std::min(leftLvl, rightLvl) + 1;
	  
	          if (shouldBe < T->level) {
	              T->level = shouldBe;
	              if (T->right && shouldBe < T->right->level) {
	                  T->right->level = shouldBe;
	              }
	          }
	          return T;
	      }
	  
	      Node* insert(Node* T, int key) {
	          if (!T) return new Node(key);
	  
	          if (key < T->key) {
	              T->left = insert(T->left, key);
	          } else if (key > T->key) {
	              T->right = insert(T->right, key);
	          } else {
	              return T; // Ignore duplicates
	          }
	  
	          T = skew(T);
	          T = split(T);
	          return T;
	      }
	  
	      Node* findMin(Node* T) {
	          while (T->left) T = T->left;
	          return T;
	      }
	  
	      Node* findMax(Node* T) {
	          while (T->right) T = T->right;
	          return T;
	      }
	  
	      Node* remove(Node* T, int key) {
	          if (!T) return nullptr;
	  
	          if (key < T->key) {
	              T->left = remove(T->left, key);
	          } else if (key > T->key) {
	              T->right = remove(T->right, key);
	          } else {
	              // Found the target node
	              if (!T->left && !T->right) {
	                  delete T;
	                  return nullptr;
	              } else if (!T->left) {
	                  Node* succ = findMin(T->right);
	                  T->key = succ->key;
	                  T->right = remove(T->right, succ->key);
	              } else {
	                  Node* pred = findMax(T->left);
	                  T->key = pred->key;
	                  T->left = remove(T->left, pred->key);
	              }
	          }
	  
	          // Rebalance
	          T = decreaseLevel(T);
	          T = skew(T);
	          if (T->right) T->right = skew(T->right);
	          if (T->right && T->right->right) T->right->right = skew(T->right->right);
	          T = split(T);
	          if (T->right) T->right = split(T->right);
	          return T;
	      }
	  
	      void destroyTree(Node* T) {
	          if (!T) return;
	          destroyTree(T->left);
	          destroyTree(T->right);
	          delete T;
	      }
	  
	  public:
	      AATree() : root(nullptr) {}
	      ~AATree() { destroyTree(root); }
	  
	      void insert(int key) { root = insert(root, key); }
	      void remove(int key) { root = remove(root, key); }
	  
	      bool search(int key) {
	          Node* curr = root;
	          while (curr) {
	              if (key == curr->key) return true;
	              else if (key < curr->key) curr = curr->left;
	              else curr = curr->right;
	          }
	          return false;
	      }
	  };
	  
	  int main() {
	      AATree tree;
	      for (int val : {10, 20, 5, 15, 30}) {
	          tree.insert(val);
	      }
	      std::cout << std::boolalpha;
	      std::cout << "Search 15: " << tree.search(15) << "\n";  // true
	      tree.remove(15);
	      std::cout << "Search 15 after removal: " << tree.search(15) << "\n";  // false
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class AANode {
	      constructor(key) {
	          this.key = key;
	          this.level = 1;
	          this.left = null;
	          this.right = null;
	      }
	  }
	  
	  class AATree {
	      constructor() {
	          this.root = null;
	      }
	  
	      skew(node) {
	          if (!node || !node.left) return node;
	          if (node.left.level === node.level) {
	              let leftChild = node.left;
	              node.left = leftChild.right;
	              leftChild.right = node;
	              return leftChild;
	          }
	          return node;
	      }
	  
	      split(node) {
	          if (!node || !node.right || !node.right.right) return node;
	          if (node.right.right.level === node.level) {
	              let rightChild = node.right;
	              node.right = rightChild.left;
	              rightChild.left = node;
	              rightChild.level++;
	              return rightChild;
	          }
	          return node;
	      }
	  
	      insert(key) {
	          this.root = this._insert(this.root, key);
	      }
	  
	      _insert(node, key) {
	          if (!node) return new AANode(key);
	          if (key < node.key) {
	              node.left = this._insert(node.left, key);
	          } else if (key > node.key) {
	              node.right = this._insert(node.right, key);
	          } else {
	              return node;
	          }
	          node = this.skew(node);
	          node = this.split(node);
	          return node;
	      }
	  
	      search(key) {
	          let curr = this.root;
	          while (curr) {
	              if (key === curr.key) return true;
	              else if (key < curr.key) curr = curr.left;
	              else curr = curr.right;
	          }
	          return false;
	      }
	  }
	  ```
	  
	  ```java
	  class AANode {
	      int key, level;
	      AANode left, right;
	      public AANode(int key) {
	          this.key = key;
	          this.level = 1;
	      }
	  }
	  
	  public class AATree {
	      private AANode root;
	  
	      private AANode skew(AANode node) {
	          if (node == null || node.left == null) return node;
	          if (node.left.level == node.level) {
	              AANode leftChild = node.left;
	              node.left = leftChild.right;
	              leftChild.right = node;
	              return leftChild;
	          }
	          return node;
	      }
	  
	      private AANode split(AANode node) {
	          if (node == null || node.right == null || node.right.right == null) return node;
	          if (node.right.right.level == node.level) {
	              AANode rightChild = node.right;
	              node.right = rightChild.left;
	              rightChild.left = node;
	              rightChild.level++;
	              return rightChild;
	          }
	          return node;
	      }
	  
	      public void insert(int key) {
	          root = insertRec(root, key);
	      }
	  
	      private AANode insertRec(AANode node, int key) {
	          if (node == null) return new AANode(key);
	          if (key < node.key) node.left = insertRec(node.left, key);
	          else if (key > node.key) node.right = insertRec(node.right, key);
	          else return node;
	          
	          node = skew(node);
	          node = split(node);
	          return node;
	      }
	  
	      public boolean search(int key) {
	          AANode curr = root;
	          while (curr != null) {
	              if (key == curr.key) return true;
	              else if (key < curr.key) curr = curr.left;
	              else curr = curr.right;
	          }
	          return false;
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  
	  typedef struct AANode {
	      int key;
	      int level;
	      struct AANode *left, *right;
	  } AANode;
	  
	  AANode* createNode(int key) {
	      AANode* node = (AANode*)malloc(sizeof(AANode));
	      node->key = key;
	      node->level = 1;
	      node->left = node->right = NULL;
	      return node;
	  }
	  
	  AANode* skew(AANode* node) {
	      if (node == NULL || node->left == NULL) return node;
	      if (node->left->level == node->level) {
	          AANode* leftChild = node->left;
	          node->left = leftChild->right;
	          leftChild->right = node;
	          return leftChild;
	      }
	      return node;
	  }
	  
	  AANode* split(AANode* node) {
	      if (node == NULL || node->right == NULL || node->right->right == NULL) return node;
	      if (node->right->right->level == node->level) {
	          AANode* rightChild = node->right;
	          node->right = rightChild->left;
	          rightChild->left = node;
	          rightChild->level++;
	          return rightChild;
	      }
	      return node;
	  }
	  
	  AANode* insert(AANode* node, int key) {
	      if (node == NULL) return createNode(key);
	      if (key < node->key) node->left = insert(node->left, key);
	      else if (key > node->key) node->right = insert(node->right, key);
	      else return node;
	      
	      node = skew(node);
	      node = split(node);
	      return node;
	  }
	  
	  int search(AANode* root, int key) {
	      AANode* curr = root;
	      while (curr != NULL) {
	          if (key == curr->key) return 1;
	          else if (key < curr->key) curr = curr->left;
	          else curr = curr->right;
	      }
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Need a self-balancing\nbinary search tree?"}
	      Q -- No --> S1{"Static data?"}
	      S1 -- Yes --> R1["✅ Use standard BST\nor sorted array"]
	      Q -- Yes --> S2{"Are you implementing\nit from scratch?"}
	      S2 -- No --> R2["✅ Use standard library\nRed-Black Tree (std::map, TreeMap)"]
	      S2 -- Yes --> S3{"Need simpler code\nthan Red-Black Tree?"}
	      S3 -- Yes --> R3["✅ Use AA Tree"]
	      S3 -- No --> R4["✅ Use AVL or Red-Black"]
	  ```
	-
	- ## ✅ Use AA Tree When:
		- You want to implement a self-balancing BST from scratch and want to avoid the complex edge-cases of Red-Black Trees.
		- Standard libraries aren't available, and coding simplicity is paramount.
		- Low variance lookup/insert performance is needed.
	-
	- ## ❌ Avoid When:
		- Maximum execution speed is crucial; standard Red-Black Trees or AVL Trees perform slightly fewer operations in practice because they do not require re-rotations during balanced lookups.
		- Pre-built collections are already available in the language's standard library (e.g., `std::set` in C++ or `TreeMap` in Java).
-
- # Variations & Related
  collapsed:: true
	- [[Binary Search Tree (BST)]] - The parent class of all ordered tree types.
	- [[Segment Tree]] - Balanced interval querying structure.
	- [[Splay Tree]] - A self-adjusting search tree that optimizes for recently queried elements.
-
- # Key Takeaways
	- AA Trees enforce balance via integer **levels** instead of node colors.
	- They eliminate left-leaning horizontal links by only allowing red links to lean right.
	- Two operations, **skew** (right rotate) and **split** (left rotate and level up), handle all insertion balance needs.
	- The worst-case height is $O(\log n)$, guaranteeing lookup, insert, and delete in $O(\log n)$ time.
-
- # More Learn
	- ## GitHub & Webs
		- [TheAlgorithms – Binary Tree](https://github.com/TheAlgorithms/Python/tree/master/data_structures/binary_tree)
		- [Wikipedia - AA tree](https://en.wikipedia.org/wiki/AA_tree)