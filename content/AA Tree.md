---
author: Vaibhav Rathod
authorUrl: https://google.com
seoTitle: AA Tree Explained – Self-Balancing BST with C++ Implementation
description: "AA Tree is a simplified variant of Red-Black Tree. Learn skew, split, insertion, deletion, and search with C++ code examples and complexity analysis."
keywords: "AA tree, balanced BST, self-balancing tree, skew, split, C++, data structures, algorithms, binary search tree, tree rotation"
---

- # History
	- **Invented by**: Arne Andersson in 1993.
	- **Why**: Simplify the Red-Black Tree by restricting left red links only — fewer cases to handle during rebalancing.
	- **Named after**: Arne Andersson → "AA" Tree.
-
- # Introduction
	- An **AA Tree** is a self-balancing Binary Search Tree (BST) — a simplified variant of the Red-Black Tree.
	- Instead of colors, it uses a **level** (integer) per node to enforce balance.
	- Only **right children** can have the same level as their parent (no left horizontal links allowed).
	- Two operations maintain balance: **Skew** (fix left horizontal link) and **Split** (fix double right horizontal link).
	-
	- ## Advantages
		- Simpler implementation than Red-Black Trees (fewer rotation cases).
		- Guaranteed O(log n) for insert, delete, search.
		- Easier to reason about correctness.
	-
	- ## Disadvantages
		- Slightly slower than Red-Black Trees in practice due to extra passes.
		- Less commonly used, so fewer library implementations available.
-
- # Core Concepts
	- ## Level Rule
	  collapsed:: true
		- Every node has an integer **level**.
		- Leaf nodes have level 1.
		- Left child level must be exactly **one less** than parent level.
		- Right child level must be **equal or one less** than parent level.
		- Right grandchild level must be **strictly less** than parent level.
	-
	- ## Skew (Fix Left Horizontal Link)
		- A **right rotation** to remove a left horizontal link (left child same level as parent).
		- ```
		        |          →        |
		       T(lvl)            L(lvl)
		      /     \           /     \
		   L(lvl)   R        LL       T(lvl)
		   /   \                     /    \
		  LL    LR                  LR     R
		  ```
		- ```cpp
		  Node* skew(Node* T) {
		      if (T && T->left && T->left->level == T->level) {
		          Node* L = T->left;
		          T->left = L->right;
		          L->right = T;
		          return L;
		      }
		      return T;
		  }
		  ```
	-
	- ## Split (Fix Double Right Horizontal Link)
	  collapsed:: true
		- A **left rotation + level increment** to remove two consecutive right horizontal links.
		- ```
		        |              →         |
		       T(lvl)               R(lvl+1)
		      /     \              /        \
		     A     R(lvl)        T(lvl)    RR(lvl)
		           /    \        /    \
		          RL   RR(lvl)  A      RL
		  ```
		- ```cpp
		  Node* split(Node* T) {
		      if (T && T->right && T->right->right &&
		          T->right->right->level == T->level) {
		          Node* R = T->right;
		          T->right = R->left;
		          R->left = T;
		          R->level++;
		          return R;
		      }
		      return T;
		  }
		  ```
-
- # C++ Implementation
	- ## Node Structure
	  collapsed:: true
		- ```cpp
		  #include <iostream>
		  
		  struct Node {
		      int key;
		      int level;
		      Node* left;
		      Node* right;
		  
		      Node(int k) : key(k), level(1), left(nullptr), right(nullptr) {}
		  };
		  ```
	-
	- ## Skew & Split
	  collapsed:: true
		- ```cpp
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
		      if (T && T->right && T->right->right &&
		          T->right->right->level == T->level) {
		          Node* R = T->right;
		          T->right = R->left;
		          R->left = T;
		          R->level++;
		          return R;
		      }
		      return T;
		  }
		  ```
	-
	- ## Insert
	  collapsed:: true
		- ```cpp
		  Node* insert(Node* T, int key) {
		      if (!T) return new Node(key);
		  
		      if (key < T->key)
		          T->left = insert(T->left, key);
		      else if (key > T->key)
		          T->right = insert(T->right, key);
		      else
		          return T; // duplicate — ignore
		  
		      T = skew(T);
		      T = split(T);
		      return T;
		  }
		  ```
	-
	- ## Search
	  collapsed:: true
		- ```cpp
		  Node* search(Node* T, int key) {
		      if (!T || T->key == key) return T;
		      if (key < T->key) return search(T->left, key);
		      return search(T->right, key);
		  }
		  ```
	-
	- ## Delete (with rebalance helpers)
	  collapsed:: true
		- ```cpp
		  // Find minimum node in subtree
		  Node* findMin(Node* T) {
		      while (T->left) T = T->left;
		      return T;
		  }
		  
		  // Decrease level if needed after deletion
		  Node* decreaseLevel(Node* T) {
		      int shouldBe = std::min(
		          T->left  ? T->left->level  : 0,
		          T->right ? T->right->level : 0
		      ) + 1;
		  
		      if (shouldBe < T->level) {
		          T->level = shouldBe;
		          if (T->right && shouldBe < T->right->level)
		              T->right->level = shouldBe;
		      }
		      return T;
		  }
		  
		  Node* remove(Node* T, int key) {
		      if (!T) return nullptr;
		  
		      if (key < T->key)
		          T->left = remove(T->left, key);
		      else if (key > T->key)
		          T->right = remove(T->right, key);
		      else {
		          if (!T->left && !T->right) { delete T; return nullptr; }
		          if (!T->left) {
		              Node* succ = findMin(T->right);
		              T->key = succ->key;
		              T->right = remove(T->right, succ->key);
		          } else {
		              // find predecessor
		              Node* pred = T->left;
		              while (pred->right) pred = pred->right;
		              T->key = pred->key;
		              T->left = remove(T->left, pred->key);
		          }
		      }
		  
		      T = decreaseLevel(T);
		      T = skew(T);
		      if (T->right) T->right = skew(T->right);
		      if (T->right && T->right->right) T->right->right = skew(T->right->right);
		      T = split(T);
		      if (T->right) T->right = split(T->right);
		      return T;
		  }
		  ```
	-
	- ## Full Usage Example
	  collapsed:: true
		- ```cpp
		  int main() {
		      Node* root = nullptr;
		  
		      // Insert
		      for (int k : {5, 3, 7, 1, 4, 6, 8})
		          root = insert(root, k);
		  
		      // Search
		      Node* found = search(root, 4);
		      std::cout << (found ? "Found: " + std::to_string(found->key) : "Not found") << "\n";
		      // Found: 4
		  
		      // Delete
		      root = remove(root, 3);
		      std::cout << (search(root, 3) ? "Still there" : "Deleted") << "\n";
		      // Deleted
		  
		      return 0;
		  }
		  ```
-
- # Time & Space Complexity
  collapsed:: true
	- ```
	  Operation    Time (avg)    Time (worst)    Space
	  Search       O(log n)      O(log n)        O(log n) stack
	  Insert       O(log n)      O(log n)        O(log n) stack
	  Delete       O(log n)      O(log n)        O(log n) stack
	  Space (tree) —             —               O(n)
	  ```
	- Height is always **O(log n)** — guaranteed by level invariants.
-
- # AA Tree vs Red-Black Tree
  collapsed:: true
	- ```
	  Property           AA Tree          Red-Black Tree
	  Balance via        Levels           Colors (Red/Black)
	  Left red links     Not allowed      Allowed
	  Rotation cases     2 (skew, split)  Up to 6
	  Implementation     Simpler          More complex
	  Performance        Slightly slower  Slightly faster
	  ```
-
- # Key Takeaways
	- AA Tree = Red-Black Tree with **only right horizontal links** allowed.
	- Two operations: **skew** (right rotation) and **split** (left rotation + level up).
	- All operations run in **O(log n)** guaranteed.
	- Great choice when you want a balanced BST with simpler code than Red-Black.