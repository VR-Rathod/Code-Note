---
seoTitle: Binary Tree Data Structure - Properties & Traversals Guide
description: "Master Binary Trees in Data Structures & Algorithms. Learn about Full, Complete, Perfect, and Balanced Binary Trees, traversals (pre-order, in-order, post-order, level-order), and multi-language implementations."
keywords: "Binary Tree, Tree Traversal, Inorder, Preorder, Postorder, Level Order, DFS, BFS, Balanced Tree, Complete Binary Tree, Data Structures, DSA"
---

> [!info] What is a Binary Tree?
> A **Binary Tree** is a non-linear hierarchical data structure in which each node has at most two children, referred to as the **left child** and the **right child**. It forms the foundational basis for more advanced tree structures like BSTs, Heaps, and Segment Trees.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **Family Tree** starting from a single ancestor.
		- If every person in this family has at most two children, the tree structure matches a Binary Tree.
		- The ancestor is the **Root**, and descendants with no children are the **Leaves**.
	-
	- ## Key Terminology
	  collapsed:: true
		- **Root Node**: The top node of the tree (no parent).
		- **Parent Node**: A node that has pointers to other nodes.
		- **Child Node**: A node descended from another node.
		- **Leaf Node**: A node with no children (left and right pointers are `null`).
		- **Subtree**: A tree formed by a node and all of its descendants.
		- **Depth of a Node**: The number of edges from the root to the node.
		- **Height of a Tree**: The number of edges on the longest path from the root to a leaf.
	-
	- ## Types of Binary Trees
	  collapsed:: true
		- ### 1. Full Binary Tree
		  Every node has either $0$ or $2$ children. No node has only one child.
		- ### 2. Complete Binary Tree
		  All levels are completely filled except possibly the last level, which is filled from left to right.
		- ### 3. Perfect Binary Tree
		  All internal nodes have exactly two children, and all leaf nodes are at the same level.
		- ### 4. Balanced Binary Tree
		  The height of the left and right subtrees of any node differs by at most 1 (e.g., AVL tree, Red-Black tree). Allows $O(\log n)$ operations.
		- ### 5. Degenerate (Skewed) Tree
		  Each parent node has only one child. It behaves like a linked list, degrading search time complexity to $O(n)$.
		-
		- ```mermaid
		  graph TD
		      subgraph PerfectTree["Perfect Binary Tree"]
		          PR((1)) --> PA((2))
		          PR --> PB((3))
		          PA --> PC((4))
		          PA --> PD((5))
		          PB --> PE((6))
		          PB --> PF((7))
		      end
		  ```

- # Tree Traversals
  collapsed:: true
	- Unlike linear structures (arrays, linked lists) which have a single logical way to traverse them, trees can be traversed in multiple ways.
	-
	- ## 1. Depth-First Search (DFS) Traversals
	  collapsed:: true
		- DFS traverses down a branch as far as possible before backtracking.
		- ### Pre-Order (Root → Left → Right)
		  Use case: Copying a tree, prefix expression parsing.
		- ### In-Order (Left → Root → Right)
		  Use case: BST sorted output.
		- ### Post-Order (Left → Right → Root)
		  Use case: Deleting a tree, suffix expression parsing (post-fix evaluation).
	-
	- ## 2. Breadth-First Search (BFS) / Level-Order Traversal
	  collapsed:: true
		- Level-Order traverses level-by-level, from left to right.
		- Use case: Finding the shortest path between nodes, serialization.
		-
		- ```mermaid
		  graph TD
		      A((A)) --> B((B))
		      A --> C((C))
		      B --> D((D))
		      B --> E((E))
		      
		      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		  ```
		- Traversing the tree above:
		  - **Pre-Order**: A → B → D → E → C
		  - **In-Order**: D → B → E → A → C
		  - **Post-Order**: D → E → B → C → A
		  - **Level-Order**: A → B → C → D → E

- # Properties of Binary Trees
  collapsed:: true
	- 1. **Maximum nodes at level $L$** (root is level 0) is $2^L$.
	- 2. **Maximum nodes in a tree of height $H$** is $2^{H+1} - 1$.
	- 3. **Minimum height of a binary tree with $N$ nodes** is $\lceil\log_2(N+1)\rceil - 1$.
	- 4. **Relation between leaf nodes and 2-child nodes**: In any non-empty binary tree, if $L$ is the number of leaf nodes and $N_2$ is the number of nodes with 2 children, then:
	     $$L = N_2 + 1$$

- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > All traversals visit every node exactly once → **O(n)** time.
	  > Space complexity is determined by the maximum call stack depth (DFS) or queue width (BFS).
	  > Refer to [[Complexity Analysis]] for details on space calculations.
	-
	- | Traversal Method | Time Complexity | Space Complexity (Worst) | Space Complexity (Average) |
	  |------------------|-----------------|--------------------------|----------------------------|
	  | **DFS (Pre/In/Post)** | $O(n)$ | $O(n)$ (Skewed tree) | $O(\log n)$ (Balanced tree) |
	  | **BFS (Level-Order)** | $O(n)$ | $O(n)$ (Wide tree - leaves level) | $O(w)$ where $w$ is max width |

- # Implementation
  collapsed:: true
	- > [!note] Standard Recursive Traversals and Iterative Level-Order
	  > Below is the implementation of a Binary Tree node and standard traversals.
	-
	- :::code-tabs
	  
	  ```python
	  from collections import deque
	  
	  class Node:
	      def __init__(self, val):
	          self.val = val
	          self.left = None
	          self.right = None
	  
	  def inorder(root):
	      if not root:
	          return []
	      return inorder(root.left) + [root.val] + inorder(root.right)
	  
	  def preorder(root):
	      if not root:
	          return []
	      return [root.val] + preorder(root.left) + preorder(root.right)
	  
	  def postorder(root):
	      if not root:
	          return []
	      return postorder(root.left) + postorder(root.right) + [root.val]
	  
	  def level_order(root):
	      if not root:
	          return []
	      result, queue = [], deque([root])
	      while queue:
	          node = queue.popleft()
	          result.append(node.val)
	          if node.left:
	              queue.append(node.left)
	          if node.right:
	              queue.append(node.right)
	      return result
	  
	  # Example Setup
	  #     1
	  #    / \
	  #   2   3
	  root = Node(1)
	  root.left = Node(2)
	  root.right = Node(3)
	  print("In-order:", inorder(root))      # Output: [2, 1, 3]
	  print("Level-order:", level_order(root)) # Output: [1, 2, 3]
	  ```
	  
	  ```cpp
	  #include <iostream>
	  #include <vector>
	  #include <queue>
	  
	  struct Node {
	      int val;
	      Node* left;
	      Node* right;
	      Node(int x) : val(x), left(nullptr), right(nullptr) {}
	  };
	  
	  void inorder(Node* root, std::vector<int>& res) {
	      if (!root) return;
	      inorder(root->left, res);
	      res.push_back(root->val);
	      inorder(root->right, res);
	  }
	  
	  void preorder(Node* root, std::vector<int>& res) {
	      if (!root) return;
	      res.push_back(root->val);
	      preorder(root->left, res);
	      preorder(root->right, res);
	  }
	  
	  void postorder(Node* root, std::vector<int>& res) {
	      if (!root) return;
	      postorder(root->left, res);
	      postorder(root->right, res);
	      res.push_back(root->val);
	  }
	  
	  std::vector<int> levelOrder(Node* root) {
	      std::vector<int> res;
	      if (!root) return res;
	      std::queue<Node*> q;
	      q.push(root);
	      while (!q.empty()) {
	          Node* curr = q.front();
	          q.pop();
	          res.push_back(curr->val);
	          if (curr->left) q.push(curr->left);
	          if (curr->right) q.push(curr->right);
	      }
	      return res;
	  }
	  
	  int main() {
	      Node* root = new Node(1);
	      root->left = new Node(2);
	      root->right = new Node(3);
	      
	      std::vector<int> in_res;
	      inorder(root, in_res);
	      std::cout << "Inorder traversal: ";
	      for (int v : in_res) std::cout << v << " ";
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class Node {
	      constructor(val) {
	          this.val = val;
	          this.left = null;
	          this.right = null;
	      }
	  }
	  
	  function inorder(root) {
	      if (!root) return [];
	      return [...inorder(root.left), root.val, ...inorder(root.right)];
	  }
	  
	  function levelOrder(root) {
	      if (!root) return [];
	      const res = [];
	      const queue = [root];
	      while (queue.length > 0) {
	          const curr = queue.shift();
	          res.push(curr.val);
	          if (curr.left) queue.push(curr.left);
	          if (curr.right) queue.push(curr.right);
	      }
	      return res;
	  }
	  
	  const root = new Node(1);
	  root.left = new Node(2);
	  root.right = new Node(3);
	  console.log("In-order:", inorder(root));      // Output: [2, 1, 3]
	  console.log("Level-order:", levelOrder(root)); // Output: [1, 2, 3]
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  class Node {
	      int val;
	      Node left, right;
	      Node(int val) {
	          this.val = val;
	          left = right = null;
	      }
	  }
	  
	  public class BinaryTree {
	      public static List<Integer> inorder(Node root) {
	          List<Integer> res = new ArrayList<>();
	          inorderHelper(root, res);
	          return res;
	      }
	      
	      private static void inorderHelper(Node root, List<Integer> res) {
	          if (root == null) return;
	          inorderHelper(root.left, res);
	          res.add(root.val);
	          inorderHelper(root.right, res);
	      }
	      
	      public static List<Integer> levelOrder(Node root) {
	          List<Integer> res = new ArrayList<>();
	          if (root == null) return res;
	          Queue<Node> queue = new LinkedList<>();
	          queue.add(root);
	          while (!queue.isEmpty()) {
	              Node curr = queue.poll();
	              res.add(curr.val);
	              if (curr.left != null) queue.add(curr.left);
	              if (curr.right != null) queue.add(curr.right);
	          }
	          return res;
	      }
	      
	      public static void main(String[] args) {
	          Node root = new Node(1);
	          root.left = new Node(2);
	          root.right = new Node(3);
	          System.out.println("In-order: " + inorder(root));
	          System.out.println("Level-order: " + levelOrder(root));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  
	  struct Node {
	      int val;
	      struct Node* left;
	      struct Node* right;
	  };
	  
	  struct Node* createNode(int val) {
	      struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
	      newNode->val = val;
	      newNode->left = NULL;
	      newNode->right = NULL;
	      return newNode;
	  }
	  
	  void inorder(struct Node* root) {
	      if (root == NULL) return;
	      inorder(root->left);
	      printf("%d ", root->val);
	      inorder(root->right);
	  }
	  
	  void preorder(struct Node* root) {
	      if (root == NULL) return;
	      printf("%d ", root->val);
	      preorder(root->left);
	      preorder(root->right);
	  }
	  
	  void postorder(struct Node* root) {
	      if (root == NULL) return;
	      postorder(root->left);
	      postorder(root->right);
	      printf("%d ", root->val);
	  }
	  
	  int main() {
	      struct Node* root = createNode(1);
	      root->left = createNode(2);
	      root->right = createNode(3);
	      
	      printf("In-order: ");
	      inorder(root);
	      printf("\n");
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use a Binary Tree
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"What do you need\nto model?"}
	      Q -- "Hierarchical Data" --> R1["✅ Use a Tree"]
	      Q -- "Network/Relationships" --> R2["❌ Use a Graph"]
	      Q -- "Sorted searching" --> R3["✅ Use a Binary Search Tree (BST)"]
	      Q -- "Priority Queue" --> R4["✅ Use a Binary Heap"]
	  ```
	-
	- ## ✅ Use a Binary Tree When
		- Modeling **hierarchical data** (e.g., file systems, organization charts, family trees).
		- Implementing **expression parsers** in compilers (Abstract Syntax Trees).
		- You need a foundation for specialized structures like **BSTs**, **Heaps**, or **Segment Trees**.
		- Storing data for algorithms like Huffman coding for compression.
	-
	- ## ❌ Avoid a Binary Tree When
		- Modeling arbitrary networks where nodes can have multiple parents or cycles (use **Graphs**).
		- You just need a simple ordered collection with $O(1)$ random access (use **Arrays**).
-
- # Key Takeaways
	- **Structure**: Every node has at most two children (left and right).
	- **Traversals**: DFS (Pre-Order, In-Order, Post-Order) and BFS (Level-Order) define how nodes are visited. Time complexity is always $O(n)$.
	- **Types**: Full, Complete, Perfect, and Balanced trees each have distinct constraints and use-cases.
	- **Foundation**: Raw binary trees are rarely used on their own, but they serve as the building blocks for efficient searching (BSTs) and priority scheduling (Heaps).
-
- # More Learn
	- ## GitHub & Webs
		- [TheAlgorithms – Binary Tree](https://github.com/TheAlgorithms/Python/tree/master/data_structures/binary_tree)
		- [Visualgo - BST/Tree](https://visualgo.net/en/bst)
