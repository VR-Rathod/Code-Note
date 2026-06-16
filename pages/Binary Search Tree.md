---
seoTitle: Binary Search Tree (BST) – Operations & Deletion Guide
description: "Master Binary Search Trees (BST) in Data Structures & Algorithms. Learn about insertion, searching, deletion algorithms (Hibbard deletion), and average vs worst case complexities."
keywords: "Binary Search Tree, BST, Hibbard Deletion, BST Insertion, BST Search, Data Structures, DSA, Tree Operations, BST C++, BST Java"
treeTitle: DSA - Trees - Binary Search Tree (BST)
---

> [!info] What is a Binary Search Tree (BST)?
> A **Binary Search Tree (BST)** is a binary tree in which every node satisfies the **BST Property**:
> 1. The key of the **left subtree** is strictly less than the root's key.
> 2. The key of the **right subtree** is strictly greater than the root's key.
> 3. Both the left and right subtrees must also be binary search trees.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of looking up a word in a physical **Dictionary**.
		- When you open the dictionary to the middle, if your target word comes alphabetically before the current page, you focus entirely on the left half. If it comes after, you focus on the right half.
		- This divide-and-conquer lookup behavior is exactly what a BST models dynamically.
	-
	- ## Why Use a BST?
	  collapsed:: true
		- In a simple [[Arrays]] or Linked List, insertion takes $O(1)$ but searching takes $O(n)$.
		- In a sorted array, searching takes $O(\log n)$ via [[Binary Search]], but inserting a new element takes $O(n)$ because elements must be shifted.
		- A BST combines the best of both: **$O(\log n)$ search** and **$O(\log n)$ insertion/deletion** (when balanced).
		- An **In-order traversal** of a BST always yields keys in **sorted ascending order**.
- # Operations
  collapsed:: true
	- ## 1. Searching
	  collapsed:: true
		- Compare the target with the root. If they match, return the node. If the target is smaller, go to the left subtree. If the target is larger, go to the right subtree. Repeat until found or a leaf node's child is reached (`null`).
		-
		- ### Visual Dry-Run (Search for 60)
		  ```
		        50
		       /  \
		     30    70
		    /  \  /  \
		  20   40 60  80
		  
		  Step 1: Start at root (50). 60 > 50 -> Go Right.
		  Step 2: Current node (70). 60 < 70 -> Go Left.
		  Step 3: Current node (60). 60 == 60 -> ✅ Found!
		  ```
		-
		- ```mermaid
		  flowchart TD
		      A["Compare target with Node"] --> B{"node.val == target?"}
		      B -- Yes --> C["✅ Found! Return Node"]
		      B -- No --> D{"target < node.val?"}
		      D -- Yes --> E["Search Left Subtree"]
		      D -- No --> F["Search Right Subtree"]
		  ```
	-
	- ## 2. Insertion
	  collapsed:: true
		- Follow the search path to find the appropriate leaf position. Attach the new node as a left or right child.
		-
		- ### Visual Dry-Run (Insert 65)
		  ```
		  Current Tree:
		        50
		       /  \
		     30    70
		    /  \  /  \
		  20   40 60  80
		  
		  Step 1: Start at root (50). 65 > 50 -> Go Right.
		  Step 2: Current node (70). 65 < 70 -> Go Left.
		  Step 3: Current node (60). 65 > 60 -> Go Right.
		  Step 4: Node 60 has no right child. Insert 65 as right child of 60.
		  
		  Resulting Tree:
		        50
		       /  \
		     30    70
		    /  \  /  \
		  20   40 60  80
		            \
		            65
		  ```
	-
	- ## 3. Deletion (Hibbard Deletion)
	  collapsed:: true
		- Deleting a node requires restructuring the tree to preserve the BST property. There are three cases:
		-
		- ### Case 1: Node is a Leaf (No Children)
		  Simply delete the node and set its parent's pointer to `null`.
		- ### Case 2: Node has One Child
		  Bypass the node by pointing its parent directly to its child (like removing a node from a linked list).
		- ### Case 3: Node has Two Children
		  1. Find the node's **Inorder Successor** (smallest node in the right subtree) or **Inorder Predecessor** (largest node in the left subtree).
		  2. Copy the successor's value into the target node.
		  3. Delete the successor node (which is guaranteed to have at most one child).
		-
		- ```mermaid
		  graph TD
		      subgraph BeforeDeletion["Before Deleting Node 50 (Case 3)"]
		          R1((50)) --> L1((30))
		          R1 --> R2((70))
		          R2 --> RL1((60))
		          R2 --> RR1((80))
		      end
		      subgraph AfterDeletion["After Deleting Node 50"]
		          R3((60)) --> L3((30))
		          R3 --> R4((70))
		          R4 --> RR2((80))
		      end
		      
		      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		  ```
	-
	- ## 4. Tree Traversals (DFS)
	  collapsed:: true
		- Traversing a BST in different orders yields different useful sequences.
		- Consider this tree: `[50, 30, 70, 20, 40, 60, 80]`
		- **In-order (Left, Root, Right)**: Visits elements in sorted ascending order.
			- `20, 30, 40, 50, 60, 70, 80`
		- **Pre-order (Root, Left, Right)**: Useful for creating a copy of the tree.
			- `50, 30, 20, 40, 70, 60, 80`
		- **Post-order (Left, Right, Root)**: Useful for deleting the tree (children deleted before parents).
			- `20, 40, 30, 60, 80, 70, 50`
- # Time & Space Complexity
  collapsed:: true
	- > [!important] The Balance Caveat
	  > The time complexity of BST operations is proportional to the **height of the tree** ($h$).
	  > For details on algorithmic scaling and proofs, see [[Complexity Analysis]].
	-
	- | Case | Time Complexity | Why |
	  |------|-----------------|-----|
	  | **Best Case (Balanced)** | $O(\log n)$ | Tree height is minimized, operations split search space in half. |
	  | **Average Case** | $O(\log n)$ | Random insertions produce a reasonably balanced tree. |
	  | **Worst Case (Skewed)** | $O(n)$ | If elements are inserted in sorted order, the tree becomes a linked list. |
	  | **Space Complexity** | $O(h)$ | Auxiliary recursion stack space where $h$ is height of tree. |
	- > [!tip] Self-Balancing trees
	  > To prevent the worst-case $O(n)$ degradation, advanced self-balancing trees like AVL Trees and Red-Black Trees dynamically rebalance themselves to ensure $h = O(\log n)$ at all times.
- # Implementation
  collapsed:: true
	- > [!note] BST Implementation
	  > Below is a standard recursive implementation of a Binary Search Tree supporting insert, search, delete, and sorted in-order traversal.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  class Node:
	      def __init__(self, key):
	          self.key = key
	          self.left = None
	          self.right = None
	  
	  class BST:
	      def __init__(self):
	          self.root = None
	  
	      def insert(self, key):
	          self.root = self._insert(self.root, key)
	  
	      def _insert(self, root, key):
	          if not root:
	              return Node(key)
	          if key < root.key:
	              root.left = self._insert(root.left, key)
	          elif key > root.key:
	              root.right = self._insert(root.right, key)
	          return root
	  
	      def search(self, key):
	          return self._search(self.root, key)
	  
	      def _search(self, root, key):
	          if not root or root.key == key:
	              return root
	          if key < root.key:
	              return self._search(root.left, key)
	          return self._search(root.right, key)
	  
	      def delete(self, key):
	          self.root = self._delete(self.root, key)
	  
	      def _delete(self, root, key):
	          if not root:
	              return root
	          if key < root.key:
	              root.left = self._delete(root.left, key)
	          elif key > root.key:
	              root.right = self._delete(root.right, key)
	          else:
	              # Case 1 & 2: One child or no child
	              if not root.left:
	                  return root.right
	              elif not root.right:
	                  return root.left
	              # Case 3: Two children
	              temp = self._min_value_node(root.right)
	              root.key = temp.key
	              root.right = self._delete(root.right, temp.key)
	          return root
	  
	      def _min_value_node(self, node):
	          current = node
	          while current.left:
	              current = current.left
	          return current
	  
	      def inorder(self):
	          res = []
	          self._inorder(self.root, res)
	          return res
	  
	      def _inorder(self, root, res):
	          if root:
	              self._inorder(root.left, res)
	              res.append(root.key)
	              self._inorder(root.right, res)
	  
	  # Example Usage
	  bst = BST()
	  for val in [50, 30, 70, 20, 40, 60, 80]:
	      bst.insert(val)
	  print("In-order (sorted):", bst.inorder()) # [20, 30, 40, 50, 60, 70, 80]
	  bst.delete(50)
	  print("After deleting 50:", bst.inorder())  # [20, 30, 40, 60, 70, 80]
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  
	  struct Node {
	      int key;
	      Node* left;
	      Node* right;
	      Node(int val) : key(val), left(nullptr), right(nullptr) {}
	  };
	  
	  class BST {
	  private:
	      Node* root;
	  
	      Node* insert(Node* root, int key) {
	          if (!root) return new Node(key);
	          if (key < root->key)
	              root->left = insert(root->left, key);
	          else if (key > root->key)
	              root->right = insert(root->right, key);
	          return root;
	      }
	  
	      Node* search(Node* root, int key) {
	          if (!root || root->key == key) return root;
	          if (key < root->key) return search(root->left, key);
	          return search(root->right, key);
	      }
	  
	      Node* minValueNode(Node* node) {
	          Node* current = node;
	          while (current && current->left) current = current->left;
	          return current;
	      }
	  
	      Node* deleteNode(Node* root, int key) {
	          if (!root) return root;
	          if (key < root->key)
	              root->left = deleteNode(root->left, key);
	          else if (key > root->key)
	              root->right = deleteNode(root->right, key);
	          else {
	              if (!root->left) {
	                  Node* temp = root->right;
	                  delete root;
	                  return temp;
	              } else if (!root->right) {
	                  Node* temp = root->left;
	                  delete root;
	                  return temp;
	              }
	              Node* temp = minValueNode(root->right);
	              root->key = temp->key;
	              root->right = deleteNode(root->right, temp->key);
	          }
	          return root;
	      }
	  
	      void inorder(Node* root, std::vector<int>& res) {
	          if (!root) return;
	          inorder(root->left, res);
	          res.push_back(root->key);
	          inorder(root->right, res);
	      }
	  
	  public:
	      BST() : root(nullptr) {}
	      void insert(int key) { root = insert(root, key); }
	      bool search(int key) { return search(root, key) != nullptr; }
	      void remove(int key) { root = deleteNode(root, key); }
	      std::vector<int> getSorted() {
	          std::vector<int> res;
	          inorder(root, res);
	          return res;
	      }
	  };
	  
	  int main() {
	      BST bst;
	      bst.insert(50);
	      bst.insert(30);
	      bst.insert(70);
	      std::cout << "Contains 30? " << (bst.search(30) ? "Yes" : "No") << "\n";
	      bst.remove(30);
	      std::cout << "Contains 30? " << (bst.search(30) ? "Yes" : "No") << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class Node {
	      constructor(key) {
	          this.key = key;
	          this.left = null;
	          this.right = null;
	      }
	  }
	  
	  class BST {
	      constructor() {
	          this.root = null;
	      }
	  
	      insert(key) {
	          this.root = this._insert(this.root, key);
	      }
	  
	      _insert(root, key) {
	          if (!root) return new Node(key);
	          if (key < root.key) {
	              root.left = this._insert(root.left, key);
	          } else if (key > root.key) {
	              root.right = this._insert(root.right, key);
	          }
	          return root;
	      }
	  
	      search(key) {
	          return this._search(this.root, key);
	      }
	  
	      _search(root, key) {
	          if (!root || root.key === key) return root;
	          if (key < root.key) return this._search(root.left, key);
	          return this._search(root.right, key);
	      }
	  
	      delete(key) {
	          this.root = this._delete(this.root, key);
	      }
	  
	      _delete(root, key) {
	          if (!root) return null;
	          if (key < root.key) {
	              root.left = this._delete(root.left, key);
	          } else if (key > root.key) {
	              root.right = this._delete(root.right, key);
	          } else {
	              if (!root.left) return root.right;
	              if (!root.right) return root.left;
	              let temp = this._minValueNode(root.right);
	              root.key = temp.key;
	              root.right = this._delete(root.right, temp.key);
	          }
	          return root;
	      }
	  
	      _minValueNode(node) {
	          let current = node;
	          while (current.left) current = current.left;
	          return current;
	      }
	  }
	  ```
	  
	  ```java
	  class Node {
	      int key;
	      Node left, right;
	      public Node(int item) {
	          key = item;
	          left = right = null;
	      }
	  }
	  
	  public class BST {
	      private Node root;
	  
	      public BST() { root = null; }
	  
	      public void insert(int key) { root = insertRec(root, key); }
	      private Node insertRec(Node root, int key) {
	          if (root == null) return new Node(key);
	          if (key < root.key) root.left = insertRec(root.left, key);
	          else if (key > root.key) root.right = insertRec(root.right, key);
	          return root;
	      }
	  
	      public boolean search(int key) { return searchRec(root, key) != null; }
	      private Node searchRec(Node root, int key) {
	          if (root == null || root.key == key) return root;
	          if (key < root.key) return searchRec(root.left, key);
	          return searchRec(root.right, key);
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  
	  struct Node {
	      int key;
	      struct Node *left, *right;
	  };
	  
	  struct Node* newNode(int item) {
	      struct Node* temp = (struct Node*)malloc(sizeof(struct Node));
	      temp->key = item;
	      temp->left = temp->right = NULL;
	      return temp;
	  }
	  
	  struct Node* insert(struct Node* node, int key) {
	      if (node == NULL) return newNode(key);
	      if (key < node->key)
	          node->left = insert(node->left, key);
	      else if (key > node->key)
	          node->right = insert(node->right, key);
	      return node;
	  }
	  
	  struct Node* search(struct Node* root, int key) {
	      if (root == NULL || root->key == key)
	          return root;
	      if (root->key < key)
	          return search(root->right, key);
	      return search(root->left, key);
	  }
	  
	  struct Node* minValueNode(struct Node* node) {
	      struct Node* current = node;
	      while (current && current->left != NULL)
	          current = current->left;
	      return current;
	  }
	  
	  struct Node* deleteNode(struct Node* root, int key) {
	      if (root == NULL) return root;
	      if (key < root->key)
	          root->left = deleteNode(root->left, key);
	      else if (key > root->key)
	          root->right = deleteNode(root->right, key);
	      else {
	          if (root->left == NULL) {
	              struct Node* temp = root->right;
	              free(root);
	              return temp;
	          } else if (root->right == NULL) {
	              struct Node* temp = root->left;
	              free(root);
	              return temp;
	          }
	          struct Node* temp = minValueNode(root->right);
	          root->key = temp->key;
	          root->right = deleteNode(root->right, temp->key);
	      }
	      return root;
	  }
	  
	  void inorder(struct Node* root) {
	      if (root != NULL) {
	          inorder(root->left);
	          printf("%d ", root->key);
	          inorder(root->right);
	      }
	  }
	  
	  int main() {
	      struct Node* root = NULL;
	      root = insert(root, 50);
	      insert(root, 30);
	      insert(root, 70);
	      printf("Contains 30? %s\n", search(root, 30) ? "Yes" : "No");
	      root = deleteNode(root, 30);
	      printf("Contains 30? %s\n", search(root, 30) ? "Yes" : "No");
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use a BST
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Need sorted data\nand dynamic updates?"}
	      Q -- No --> S1{"Only searching?"}
	      S1 -- Yes --> R1["✅ Use a sorted array\n+ Binary Search"]
	      S1 -- No --> R2["❌ Consider Hash Table\nO(1) lookups"]
	      Q -- Yes --> S2{"Are insertions\nrandom or sorted?"}
	      S2 -- "Sorted" --> R3["❌ Vanilla BST becomes O(n)\nUse AVL/Red-Black Tree"]
	      S2 -- "Random" --> R4["✅ Vanilla BST is O(log n)"]
	  ```
	-
	- ## ✅ Use a BST When
		- You need **frequent insertions and deletions** while keeping data **sorted**.
		- You need to support **range queries** (e.g., "find all elements between X and Y").
		- You need to quickly find the **minimum, maximum, successor, or predecessor**.
		- You want **$O(\log n)$** lookup times but cannot afford the $O(n)$ insertion time of a sorted array.
	-
	- ## ❌ Avoid a BST When
		- Data is inserted in **sorted or nearly sorted order** (the tree degrades into a linked list with $O(n)$ operations).
		- You only need exact-match lookups and don't care about order — use a **Hash Table** for $O(1)$ performance.
		- Memory is severely constrained (pointers for left and right children add overhead compared to arrays).
-
- # Key Takeaways
	- **Core Property**: Left children are smaller, right children are larger.
	- **In-Order Traversal** always yields a perfectly sorted list.
	- **Complexity**: $O(\log n)$ average time for Search, Insert, and Delete, but $O(n)$ in the worst case (unbalanced).
	- **Hibbard Deletion**: Deleting a node with two children requires swapping it with its inorder successor or predecessor.
	- **Self-Balancing**: In production, prefer balanced variants like AVL or Red-Black trees to guarantee $O(\log n)$ performance.
-
- # More Learn
	- ## GitHub & Webs
		- [TheAlgorithms – Binary Search Tree](https://github.com/TheAlgorithms/Python/blob/master/data_structures/binary_tree/binary_search_tree.py)
		- [Visualgo - BST](https://visualgo.net/en/bst)