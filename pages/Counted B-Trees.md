---
seoTitle: Counted B-Trees – Order Statistics and Database Indexing
description: "Master Counted B-Trees (Augmented B-Trees). Learn dynamic Rank and Select operations in databases, and complete implementations in Python, C++, and Java."
keywords: "Counted B-Tree, Augmented B-Tree, Order Statistics, Database Index, B-Tree Rank, B-Tree Select, Data Structures, DSA, Python, C++, Java, VR-Rathod, Code-Note, code note vr, vr book"
---

> [!info] What is a Counted B-Tree?
> A **Counted B-Tree** (or Augmented B-Tree) is a self-balancing search tree in which each child pointer is augmented with the **subtree size** (the total number of keys stored in that child's branch).
> This allows database indices to support **order statistic operations** (like finding the $k$-th smallest element or finding the rank of an element) in logarithmic time, even for disk-backed storage.

- # Explanation
	- ## The Need for Augmentation
	  collapsed:: true
		- Standard B-Trees are widely used in DBMS engines (like MySQL, PostgreSQL) to enable $O(\log N)$ search, insertion, and deletion by matching node sizes with disk pages.
		- However, finding the **median** value or querying the **rank** of an element by value in standard structures requires $O(N)$ scanning.
		- By adding a `count` field alongside each child pointer:
		  - We can skip whole subtrees during searches, similar to binary search.
		  - Updates (insert/delete) maintain the count sums along the parent path recursively with negligible overhead.
	-
	- ## Structure Example
	  collapsed:: true
		- For a B-Tree node of order 3, keys are stored alongside subtree counts:
		  ```
		                 Node: [ Key: 50 | Key: 100 ]
		                /        |          \
		   Child 1 (size: 5)  Child 2 (size: 12)  Child 3 (size: 8)
		  ```
		  - This tells us:
		    - There are 5 keys smaller than 50.
		    - There are 12 keys between 50 and 100.
		    - There are 8 keys greater than 100.
		    - Total size of this subtree = $5 + 12 + 8 + 2 \text{ (local keys)} = 27$ elements.
-
- # How It Works
  collapsed:: true
	- ## 1. Select Query (Find $k$-th Smallest Element)
	  collapsed:: true
		- Start at the root node.
		- For each child pointer, inspect the subtree size:
		  - If $k \leq \text{size of Left Subtree}$, recurse into the Left Child.
		  - If $k == \text{size of Left Subtree} + 1$, the current key is the target.
		  - If $k > \text{size of Left Subtree} + 1$, subtract the left size + 1 from $k$, and search the next child pointer.
		- **Time Complexity: $O(\log N)$**
	-
	- ## 2. Rank Query (Find Index position of Key)
	  collapsed:: true
		- To find the rank of a key $X$ (the number of elements strictly smaller than $X$):
		  - During the search down to $X$, keep a running sum of sizes of all subtrees and keys that lie to the **left** of the search path.
		  - When $X$ is found, add the size of its left subtree to the running sum and return it.
		- **Time Complexity: $O(\log N)$**
-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > All operations scale logarithmically with tree height. Because B-Trees have a massive branching factor (high fan-out), tree depth is extremely small, minimizing disk I/O.
	-
	- | Operation | Time Complexity | Space Complexity |
	  |-----------|-----------------|------------------|
	  | **Search** | $O(\log_b N)$ | $O(\log_b N)$ recursion depth |
	  | **Select ($k$-th)** | $O(\log_b N)$ | $O(1)$ iterative / $O(\log_b N)$ stack |
	  | **Rank** | $O(\log_b N)$ | $O(1)$ iterative |
	  | **Insert / Delete** | $O(\log_b N)$ | $O(\log_b N)$ |
-
- # Implementation
  collapsed:: true
	- > [!note] B-Tree Order Statistics
	  > Below is a conceptual implementation of Counted B-Tree node structures, Select, and Rank algorithms in Python, C++, JavaScript, Java, and C.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  class CountedBTreeNode:
	      def __init__(self, is_leaf=True):
	          self.is_leaf = is_leaf
	          self.keys = []       # Stored keys
	          self.children = []   # Pointers to children
	          self.counts = []     # Stored counts for each child subtree
	  
	  class CountedBTree:
	      def __init__(self, t):
	          self.root = CountedBTreeNode()
	          self.t = t # Minimum degree
	  
	      def select(self, k):
	          """Find the k-th smallest element (1-based index)."""
	          return self._select(self.root, k)
	  
	      def _select(self, node, k):
	          if not node:
	              return None
	          
	          i = 0
	          while i < len(node.keys):
	              left_subtree_size = node.counts[i] if not node.is_leaf else 0
	              
	              if k <= left_subtree_size:
	                  return self._select(node.children[i], k)
	              elif k == left_subtree_size + 1:
	                  return node.keys[i]
	              
	              k -= (left_subtree_size + 1)
	              i += 1
	              
	          if not node.is_leaf:
	              return self._select(node.children[i], k)
	          return None
	  
	      def rank(self, key):
	          """Find the number of elements strictly smaller than key."""
	          return self._rank(self.root, key)
	  
	      def _rank(self, node, key):
	          if not node:
	              return 0
	          
	          rank_sum = 0
	          i = 0
	          while i < len(node.keys):
	              if key < node.keys[i]:
	                  if not node.is_leaf:
	                      return rank_sum + self._rank(node.children[i], key)
	                  return rank_sum
	              elif key == node.keys[i]:
	                  left_size = node.counts[i] if not node.is_leaf else 0
	                  return rank_sum + left_size
	              
	              left_size = node.counts[i] if not node.is_leaf else 0
	              rank_sum += left_size + 1
	              i += 1
	              
	          if not node.is_leaf:
	              return rank_sum + self._rank(node.children[i], key)
	          return rank_sum
	  
	  # Example Usage
	  if __name__ == "__main__":
	      tree = CountedBTree(t=2)
	      root = tree.root
	      root.is_leaf = False
	      root.keys = [50]
	      
	      c1 = CountedBTreeNode(is_leaf=True)
	      c1.keys = [10, 20, 30]
	      c2 = CountedBTreeNode(is_leaf=True)
	      c2.keys = [60, 70]
	      
	      root.children = [c1, c2]
	      root.counts = [3, 2]
	      
	      print("4th smallest element:", tree.select(4))  # Output: 50
	      print("Rank of 60:", tree.rank(60))  # Output: 4 (10, 20, 30, 50)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <numeric>
	  
	  struct CountedBTreeNode {
	      bool is_leaf;
	      std::vector<int> keys;
	      std::vector<CountedBTreeNode*> children;
	      std::vector<int> counts; // sizes of subtrees pointed to by children
	  
	      CountedBTreeNode(bool leaf = true) : is_leaf(leaf) {}
	  };
	  
	  class CountedBTree {
	  private:
	      CountedBTreeNode* root;
	      int t; // Minimum degree
	  
	      int selectRec(CountedBTreeNode* node, int k) {
	          if (!node) return -1;
	          
	          int i = 0;
	          while (i < node->keys.size()) {
	              int left_size = (!node->is_leaf && i < node->counts.size()) ? node->counts[i] : 0;
	              if (k <= left_size) {
	                  return selectRec(node->children[i], k);
	              } else if (k == left_size + 1) {
	                  return node->keys[i];
	              }
	              k -= (left_size + 1);
	              i++;
	          }
	          if (!node->is_leaf && i < node->children.size()) {
	              return selectRec(node->children[i], k);
	          }
	          return -1;
	      }
	  
	      int rankRec(CountedBTreeNode* node, int key) {
	          if (!node) return 0;
	          
	          int rank_sum = 0;
	          int i = 0;
	          while (i < node->keys.size()) {
	              if (key < node->keys[i]) {
	                  if (!node->is_leaf) {
	                      return rank_sum + rankRec(node->children[i], key);
	                  }
	                  return rank_sum;
	              } else if (key == node->keys[i]) {
	                  int left_size = (!node->is_leaf && i < node->counts.size()) ? node->counts[i] : 0;
	                  return rank_sum + left_size;
	              }
	              int left_size = (!node->is_leaf && i < node->counts.size()) ? node->counts[i] : 0;
	              rank_sum += left_size + 1;
	              i++;
	          }
	          if (!node->is_leaf && i < node->children.size()) {
	              return rank_sum + rankRec(node->children[i], key);
	          }
	          return rank_sum;
	      }
	  
	      void destroyTree(CountedBTreeNode* node) {
	          if (!node) return;
	          if (!node->is_leaf) {
	              for (auto child : node->children) {
	                  destroyTree(child);
	              }
	          }
	          delete node;
	      }
	  
	  public:
	      CountedBTree(int min_degree) : t(min_degree) {
	          root = new CountedBTreeNode();
	      }
	      ~CountedBTree() {
	          destroyTree(root);
	      }
	  
	      void setRoot(CountedBTreeNode* r) {
	          destroyTree(root);
	          root = r;
	      }
	  
	      int select(int k) {
	          return selectRec(root, k);
	      }
	  
	      int rank(int key) {
	          return rankRec(root, key);
	      }
	  };
	  
	  int main() {
	      CountedBTree tree(2);
	      CountedBTreeNode* root = new CountedBTreeNode(false);
	      root->keys = {50};
	      
	      CountedBTreeNode* c1 = new CountedBTreeNode(true);
	      c1->keys = {10, 20, 30};
	      CountedBTreeNode* c2 = new CountedBTreeNode(true);
	      c2->keys = {60, 70};
	      
	      root->children = {c1, c2};
	      root->counts = {3, 2};
	      
	      tree.setRoot(root);
	      
	      std::cout << "4th smallest element: " << tree.select(4) << "\n";  // Output: 50
	      std::cout << "Rank of 60: " << tree.rank(60) << "\n";  // Output: 4
	      return 0;
	  }
	  ```
	  
	  ```java
	  import java.util.ArrayList;
	  import java.util.List;
	  
	  class CountedBTreeNode {
	      boolean isLeaf = true;
	      List<Integer> keys = new ArrayList<>();
	      List<CountedBTreeNode> children = new ArrayList<>();
	      List<Integer> counts = new ArrayList<>(); // subtree sizes
	  }
	  
	  public class CountedBTree {
	      private CountedBTreeNode root = new CountedBTreeNode();
	  
	      public Integer select(int k) {
	          return selectRec(root, k);
	      }
	  
	      private Integer selectRec(CountedBTreeNode node, int k) {
	          if (node == null) return null;
	          int i = 0;
	          while (i < node.keys.size()) {
	              int leftSize = (!node.isLeaf && i < node.counts.size()) ? node.counts.get(i) : 0;
	              if (k <= leftSize) {
	                  return selectRec(node.children.get(i), k);
	              } else if (k == leftSize + 1) {
	                  return node.keys.get(i);
	              }
	              k -= (leftSize + 1);
	              i++;
	          }
	          if (!node.isLeaf && i < node.children.size()) {
	              return selectRec(node.children.get(i), k);
	          }
	          return null;
	      }
	  
	      public int rank(int key) {
	          return rankRec(root, key);
	      }
	  
	      private int rankRec(CountedBTreeNode node, int key) {
	          if (node == null) return 0;
	          int rankSum = 0;
	          int i = 0;
	          while (i < node.keys.size()) {
	              if (key < node.keys.get(i)) {
	                  if (!node.isLeaf) {
	                      return rankSum + rankRec(node.children.get(i), key);
	                  }
	                  return rankSum;
	              } else if (key == node.keys.get(i)) {
	                  int leftSize = (!node.isLeaf && i < node.counts.size()) ? node.counts.get(i) : 0;
	                  return rankSum + leftSize;
	              }
	              int leftSize = (!node.isLeaf && i < node.counts.size()) ? node.counts.get(i) : 0;
	              rankSum += leftSize + 1;
	              i++;
	          }
	          if (!node.isLeaf && i < node.children.size()) {
	              return rankSum + rankRec(node.children.get(i), key);
	          }
	          return rankSum;
	      }
	  }
	  ```
	  
	  ```javascript
	  class CountedBTreeNode {
	      constructor(isLeaf = true) {
	          this.isLeaf = isLeaf;
	          this.keys = [];
	          this.children = [];
	          this.counts = []; // sizes of subtrees
	      }
	  }
	  
	  class CountedBTree {
	      constructor(t) {
	          this.root = new CountedBTreeNode();
	          this.t = t;
	      }
	  
	      select(k) {
	          return this._select(this.root, k);
	      }
	  
	      _select(node, k) {
	          if (!node) return null;
	          let i = 0;
	          while (i < node.keys.length) {
	              let leftSize = (!node.isLeaf && i < node.counts.length) ? node.counts[i] : 0;
	              if (k <= leftSize) {
	                  return this._select(node.children[i], k);
	              } else if (k === leftSize + 1) {
	                  return node.keys[i];
	              }
	              k -= (leftSize + 1);
	              i++;
	          }
	          if (!node.isLeaf && i < node.children.length) {
	              return this._select(node.children[i], k);
	          }
	          return null;
	      }
	  
	      rank(key) {
	          return this._rank(this.root, key);
	      }
	  
	      _rank(node, key) {
	          if (!node) return 0;
	          let rankSum = 0;
	          let i = 0;
	          while (i < node.keys.length) {
	              if (key < node.keys[i]) {
	                  if (!node.isLeaf) {
	                      return rankSum + this._rank(node.children[i], key);
	                  }
	                  return rankSum;
	              } else if (key === node.keys[i]) {
	                  let leftSize = (!node.isLeaf && i < node.counts.length) ? node.counts[i] : 0;
	                  return rankSum + leftSize;
	              }
	              let leftSize = (!node.isLeaf && i < node.counts.length) ? node.counts[i] : 0;
	              rankSum += leftSize + 1;
	              i++;
	          }
	          if (!node.isLeaf && i < node.children.length) {
	              return rankSum + this._rank(node.children[i], key);
	          }
	          return rankSum;
	      }
	  }
	  
	  // Example Usage
	  const tree = new CountedBTree(2);
	  const root = tree.root;
	  root.isLeaf = false;
	  root.keys = [50];
	  
	  const c1 = new CountedBTreeNode(true);
	  c1.keys = [10, 20, 30];
	  const c2 = new CountedBTreeNode(true);
	  c2.keys = [60, 70];
	  
	  root.children = [c1, c2];
	  root.counts = [3, 2];
	  
	  console.log("4th smallest element:", tree.select(4)); // Output: 50
	  console.log("Rank of 60:", tree.rank(60)); // Output: 4
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  #include <stdbool.h>
	  
	  #define MAX_KEYS 3 // For a B-tree of small degree to test logic
	  
	  typedef struct CountedBTreeNode {
	      bool is_leaf;
	      int num_keys;
	      int keys[MAX_KEYS];
	      struct CountedBTreeNode* children[MAX_KEYS + 1];
	      int counts[MAX_KEYS + 1]; // subtree sizes
	  } CountedBTreeNode;
	  
	  CountedBTreeNode* createNode(bool is_leaf) {
	      CountedBTreeNode* node = (CountedBTreeNode*)malloc(sizeof(CountedBTreeNode));
	      node->is_leaf = is_leaf;
	      node->num_keys = 0;
	      for (int i = 0; i <= MAX_KEYS; i++) {
	          node->children[i] = NULL;
	          node->counts[i] = 0;
	      }
	      return node;
	  }
	  
	  int selectKey(CountedBTreeNode* node, int k) {
	      if (!node) return -1;
	      int i = 0;
	      while (i < node->num_keys) {
	          int left_size = (!node->is_leaf) ? node->counts[i] : 0;
	          if (k <= left_size) {
	              return selectKey(node->children[i], k);
	          } else if (k == left_size + 1) {
	              return node->keys[i];
	          }
	          k -= (left_size + 1);
	          i++;
	      }
	      if (!node->is_leaf) {
	          return selectKey(node->children[i], k);
	      }
	      return -1;
	  }
	  
	  int rankKey(CountedBTreeNode* node, int key) {
	      if (!node) return 0;
	      int rank_sum = 0;
	      int i = 0;
	      while (i < node->num_keys) {
	          if (key < node->keys[i]) {
	              if (!node->is_leaf) {
	                  return rank_sum + rankKey(node->children[i], key);
	              }
	              return rank_sum;
	          } else if (key == node->keys[i]) {
	              int left_size = (!node->is_leaf) ? node->counts[i] : 0;
	              return rank_sum + left_size;
	          }
	          int left_size = (!node->is_leaf) ? node->counts[i] : 0;
	          rank_sum += left_size + 1;
	          i++;
	      }
	      if (!node->is_leaf) {
	          return rank_sum + rankKey(node->children[i], key);
	      }
	      return rank_sum;
	  }
	  
	  int main() {
	      CountedBTreeNode* root = createNode(false);
	      root->keys[0] = 50;
	      root->num_keys = 1;
	      
	      CountedBTreeNode* c1 = createNode(true);
	      c1->keys[0] = 10; c1->keys[1] = 20; c1->keys[2] = 30;
	      c1->num_keys = 3;
	      
	      CountedBTreeNode* c2 = createNode(true);
	      c2->keys[0] = 60; c2->keys[1] = 70;
	      c2->num_keys = 2;
	      
	      root->children[0] = c1;
	      root->counts[0] = 3;
	      root->children[1] = c2;
	      root->counts[1] = 2;
	      
	      printf("4th smallest element: %d\n", selectKey(root, 4)); // Output: 50
	      printf("Rank of 60: %d\n", rankKey(root, 60)); // Output: 4
	      
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Is data stored\non disk/blocks?"}
	      Q -- No --> S1{"Need rank/select\noperations?"}
	      S1 -- No --> R1["❌ Use standard balanced trees\n(AVL/Red-Black)"]
	      S1 -- Yes --> R2["✅ Use Order Statistic Tree\n(In-memory is fine)"]
	      Q -- Yes --> S2{"Need rank/select\nor order queries?"}
	      S2 -- No --> R3["❌ Use standard B-Tree"]
	      S2 -- Yes --> R4["✅ Use Counted B-Tree"]
	  ```
	-
	- ## ✅ Use Counted B-Trees When:
		- You are designing database indexes or storage systems that need to support SQL functions like `LIMIT offset, count` or percentile/median queries efficiently without scanning the table.
		- Data is stored on disk/block devices and high tree fan-out is needed to minimize random access operations.
	-
	- ## ❌ Avoid When:
		- Data fits entirely in-memory and you only need lookup/insert operations (a standard AVL tree or Red-Black tree is simpler and faster).
		- Keys are small and you do not require rank or select features.
-
- # Variations & Related
  collapsed:: true
	- [[Binary Indexed Tree or Fenwick Tree]] – Prefix sum query structure.
	- [[Interval Tree]] – Overlapping range query structure.
-
- # Key Takeaways
  collapsed:: true
	- Counted B-Trees augment each child pointer with the **total size** of that child's subtree.
	- Subtree size metadata enables **Select** ($k$-th smallest key) and **Rank** (number of smaller keys) in $O(\log n)$ time.
	- The design is highly suitable for database files where minimizing block-read operations is critical.
	- Updates must propagate count modifications up the parent node chain, which incurs a negligible $O(1)$ overhead per level.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Wikipedia -> B-tree](https://en.wikipedia.org/wiki/B-tree)
		- [GeeksforGeeks -> Order Statistic Tree](https://www.geeksforgeeks.org/order-statistic-tree/)