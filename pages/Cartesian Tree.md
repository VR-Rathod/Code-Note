---
seoTitle: Cartesian Tree – Hybrid BST & Heap Properties Guide
description: "Master Cartesian Trees in DSA. Learn $O(N)$ construction from arrays using a monotonic stack, range minimum query mapping, and comparisons with Treaps."
keywords: "Cartesian Tree, Treap, Heap Property, BST Property, Monotonic Stack, RMQ, Range Minimum Query, Data Structures, DSA, Cartesian Tree Python, Cartesian Tree C++"
---

> [!info] What is a Cartesian Tree?
> A **Cartesian Tree** is a binary tree derived from an array of numbers that simultaneously satisfies two properties:
> 1. **BST Property on Indices**: The **in-order traversal** of the Cartesian tree reconstructs the original array in its exact sequence.
> 2. **Heap Property on Values**: The value of any parent node is less than or equal to (for Min-Heap) or greater than or equal to (for Max-Heap) the values of its children.

- # Explanation
  collapsed:: true
	- ## The BST & Heap Hybrid
	  collapsed:: true
		- For any array, its Cartesian Tree is **unique** if all elements are distinct.
		- If we construct a Min-Heap Cartesian tree:
		  - The minimum element of the array becomes the **Root**.
		  - All elements to the left of this minimum in the array form the **Left Subtree**.
		  - All elements to the right of this minimum in the array form the **Right Subtree**.
		  - This structure repeats recursively.
	-
	- ## Treap Relationship
	  collapsed:: true
		- A **Treap** (Tree + Heap) is structurally identical to a Cartesian Tree!
		- In a Treap, nodes have keys (ordered like a BST) and random priorities (ordered like a heap). A Treap is simply a Cartesian Tree built on keys sorted by their search values, where the tree structure is determined by their priorities.
	-
	- ## Range Minimum Query (RMQ) Connection
	  collapsed:: true
		- Cartesian Trees are closely linked to range queries:
		  - The Lowest Common Ancestor (LCA) of nodes corresponding to indices $i$ and $j$ in a Cartesian tree is the **minimum element** in the subarray `arr[i...j]`.
		  - This reduces the RMQ problem to an LCA query on the Cartesian tree.

- # How It Works (O(N) Construction)
  collapsed:: true
	- While a naive recursive construction takes $O(N^2)$ (always scanning for the minimum), we can construct it in **linear $O(N)$ time** using a **Monotonic Stack**.
	-
	- ## Monotonic Stack Algorithm
	  collapsed:: true
		- We process array elements one-by-one from left to right, maintaining the rightmost path of the tree in a stack (which is sorted in ascending order of node values).
		- For each new element `X`:
		  1. Pop elements from the stack that are greater than `X`.
		  2. The last popped element becomes the **Left Child** of `X` (since it is smaller than previous elements but larger than `X`, and occurs to `X`'s left).
		  3. If the stack is not empty, `X` becomes the **Right Child** of the top element on the stack.
		  4. Push `X` onto the stack.
		-
		- Let's construct a Min-Cartesian Tree for array: `[9, 3, 7, 18]`
		- ```
		  Stack Trace:
		  - Push 9:   Stack: [9]
		  - Push 3:   Pop 9 -> 9 becomes left child of 3. Stack: [3]
		  - Push 7:   3 is top. 7 becomes right child of 3. Stack: [3, 7]
		  - Push 18:  7 is top. 18 becomes right child of 7. Stack: [3, 7, 18]
		  
		  Final Tree:
		        3
		       / \
		      9   7
		           \
		           18
		  ```
		-
		- ```mermaid
		  graph TD
		      Node3((3)) --> Node9((9))
		      Node3 --> Node7((7))
		      Node7 --> Node18((18))
		      
		      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		  ```

- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > Monotonic stack construction processes each element at most twice (one push, one pop) → **O(N)** time.
	  > Read more about monotonic space calculations in [[Complexity Analysis]].
	-
	- | Operation | Time Complexity | Space Complexity |
	  |-----------|-----------------|------------------|
	  | **Build (Stack)** | $O(N)$ | $O(N)$ auxiliary stack space |
	  | **LCA Query (RMQ)** | $O(1)$ after preprocessing | $O(N)$ tree storage |

- # Implementation
  collapsed:: true
	- > [!note] O(N) Cartesian Tree Construction
	  > Below is a complete implementation of Cartesian Tree construction using a monotonic stack.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  class Node:
	      def __init__(self, val, idx):
	          self.val = val
	          self.idx = idx
	          self.left = None
	          self.right = None
	  
	  def build_cartesian_tree(arr):
	      """Constructs a Min-Heap Cartesian Tree in O(N) time using a stack."""
	      stack = []
	      for i, val in enumerate(arr):
	          new_node = Node(val, i)
	          last_popped = None
	          
	          # Maintain Min-Heap property (parent <= child)
	          while stack and stack[-1].val > val:
	              last_popped = stack.pop()
	              
	          # Popped element becomes left child (since it occurred before and is larger)
	          new_node.left = last_popped
	          
	          # If stack is not empty, new_node becomes right child of stack top
	          if stack:
	              stack[-1].right = new_node
	              
	          stack.append(new_node)
	          
	      return stack[0] if stack else None
	  
	  def inorder(root):
	      if not root:
	          return []
	      return inorder(root.left) + [root.val] + inorder(root.right)
	  
	  # Example Usage
	  arr = [9, 3, 7, 18]
	  root = build_cartesian_tree(arr)
	  print("In-order (should match original array):", inorder(root)) # [9, 3, 7, 18]
	  print("Root value (should be min element):", root.val)          # 3
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <stack>
	  
	  struct Node {
	      int val;
	      int idx;
	      Node* left;
	      Node* right;
	      Node(int v, int i) : val(v), idx(i), left(nullptr), right(nullptr) {}
	  };
	  
	  Node* buildCartesianTree(const std::vector<int>& arr) {
	      std::stack<Node*> st;
	      for (int i = 0; i < (int)arr.size(); ++i) {
	          Node* curr = new Node(arr[i], i);
	          Node* last_popped = nullptr;
	          
	          while (!st.empty() && st.top()->val > arr[i]) {
	              last_popped = st.top();
	              st.pop();
	          }
	          
	          curr->left = last_popped;
	          if (!st.empty()) {
	              st.top()->right = curr;
	          }
	          st.push(curr);
	      }
	      
	      // Root is the bottom-most element in stack
	      Node* root = nullptr;
	      while (!st.empty()) {
	          root = st.top();
	          st.pop();
	      }
	      return root;
	  }
	  
	  void inorder(Node* root) {
	      if (!root) return;
	      inorder(root->left);
	      std::cout << root->val << " ";
	      inorder(root->right);
	  }
	  
	  int main() {
	      std::vector<int> arr = {9, 3, 7, 18};
	      Node* root = buildCartesianTree(arr);
	      std::cout << "Inorder: ";
	      inorder(root); // Output: 9 3 7 18
	      std::cout << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class Node {
	      constructor(val, idx) {
	          this.val = val;
	          this.idx = idx;
	          this.left = null;
	          this.right = null;
	      }
	  }
	  
	  function buildCartesianTree(arr) {
	      const stack = [];
	      for (let i = 0; i < arr.length; i++) {
	          const newNode = new Node(arr[i], i);
	          let lastPopped = null;
	          
	          while (stack.length > 0 && stack[stack.length - 1].val > arr[i]) {
	              lastPopped = stack.pop();
	          }
	          
	          newNode.left = lastPopped;
	          if (stack.length > 0) {
	              stack[stack.length - 1].right = newNode;
	          }
	          stack.push(newNode);
	      }
	      
	      return stack.length > 0 ? stack[0] : null;
	  }
	  
	  function inorder(root, result = []) {
	      if (!root) return result;
	      inorder(root.left, result);
	      result.push(root.val);
	      inorder(root.right, result);
	      return result;
	  }
	  
	  // Example Usage
	  const arr = [9, 3, 7, 18];
	  const root = buildCartesianTree(arr);
	  console.log("Inorder:", inorder(root).join(" ")); // Output: 9 3 7 18
	  ```
	  
	  ```java
	  import java.util.Stack;
	  import java.util.ArrayList;
	  import java.util.List;
	  
	  class Node {
	      int val;
	      int idx;
	      Node left;
	      Node right;
	  
	      Node(int val, int idx) {
	          this.val = val;
	          this.idx = idx;
	          this.left = null;
	          this.right = null;
	      }
	  }
	  
	  public class CartesianTree {
	      public static Node buildCartesianTree(int[] arr) {
	          Stack<Node> stack = new Stack<>();
	          for (int i = 0; i < arr.length; i++) {
	              Node newNode = new Node(arr[i], i);
	              Node lastPopped = null;
	  
	              while (!stack.isEmpty() && stack.peek().val > arr[i]) {
	                  lastPopped = stack.pop();
	              }
	  
	              newNode.left = lastPopped;
	              if (!stack.isEmpty()) {
	                  stack.peek().right = newNode;
	              }
	              stack.push(newNode);
	          }
	  
	          Node root = null;
	          for (Node node : stack) {
	              if (root == null) root = node;
	          }
	          return root;
	      }
	  
	      public static void inorder(Node root, List<Integer> result) {
	          if (root == null) return;
	          inorder(root.left, result);
	          result.add(root.val);
	          inorder(root.right, result);
	      }
	  
	      public static void main(String[] args) {
	          int[] arr = {9, 3, 7, 18};
	          Node root = buildCartesianTree(arr);
	          List<Integer> result = new ArrayList<>();
	          inorder(root, result);
	          System.out.println("Inorder: " + result); // Output: [9, 3, 7, 18]
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  
	  typedef struct Node {
	      int val;
	      int idx;
	      struct Node* left;
	      struct Node* right;
	  } Node;
	  
	  Node* createNode(int val, int idx) {
	      Node* node = (Node*)malloc(sizeof(Node));
	      node->val = val;
	      node->idx = idx;
	      node->left = NULL;
	      node->right = NULL;
	      return node;
	  }
	  
	  Node* buildCartesianTree(int arr[], int n) {
	      Node** stack = (Node**)malloc(n * sizeof(Node*));
	      int top = -1;
	      
	      for (int i = 0; i < n; i++) {
	          Node* newNode = createNode(arr[i], i);
	          Node* lastPopped = NULL;
	          
	          while (top >= 0 && stack[top]->val > arr[i]) {
	              lastPopped = stack[top];
	              top--;
	          }
	          
	          newNode->left = lastPopped;
	          if (top >= 0) {
	              stack[top]->right = newNode;
	          }
	          stack[++top] = newNode;
	      }
	      
	      Node* root = top >= 0 ? stack[0] : NULL;
	      free(stack);
	      return root;
	  }
	  
	  void inorder(Node* root) {
	      if (root == NULL) return;
	      inorder(root->left);
	      printf("%d ", root->val);
	      inorder(root->right);
	  }
	  
	  int main() {
	      int arr[] = {9, 3, 7, 18};
	      int n = sizeof(arr) / sizeof(arr[0]);
	      
	      Node* root = buildCartesianTree(arr, n);
	      printf("Inorder: ");
	      inorder(root); // Output: 9 3 7 18
	      printf("\n");
	      
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Cartesian Tree
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Need to answer\nRange Minimum Queries?"}
	      Q -- Yes --> S1{"Array is static?"}
	      S1 -- Yes --> R1["✅ Use Cartesian Tree\n(reduce to LCA) or Sparse Table"]
	      S1 -- No --> R2["❌ Use Segment Tree"]
	      Q -- No --> S2{"Building a Treap?"}
	      S2 -- Yes --> R3["✅ Use Cartesian Tree logic\nwith random priorities"]
	      S2 -- No --> R4["❌ Other trees usually better"]
	  ```
	-
	- ## ✅ Use Cartesian Trees When:
		- You want to convert a Range Minimum/Maximum Query (RMQ) problem into a Lowest Common Ancestor (LCA) problem.
		- You need to construct a Treap in linear time from sorted keys.
	-
	- ## ❌ Avoid When:
		- Data is constantly changing (Segment Trees are better for dynamic RMQ).
		- You simply need to search for elements (use a standard BST).
-
- # Key Takeaways
  collapsed:: true
	- **Hybrid Structure** — acts as a BST for array indices and a Heap for values.
	- **Linear Time Construction** — can be built in $O(N)$ time using a monotonic stack.
	- **RMQ to LCA** — efficiently maps Range Minimum Queries to LCA queries in $O(1)$ time after preprocessing.
	- **Unique Trees** — given an array of distinct elements, the Cartesian Tree is always unique.