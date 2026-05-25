---
seoTitle: Fibonacci Heap Explained – Amortized O(1) Decrease-Key Heap
description: "A detailed guide to Fibonacci Heaps. Covers lazy consolidation, cascading cuts, mark bits, Dijkstra optimizations, and implementations in Python and C++."
keywords: "Fibonacci heap, priority queue, amortized complexity, decrease key, lazy merge, cascading cut, O(1) amortized, time complexity, space complexity, graph algorithms, VR-Rathod, Code-Note, code note vr, vr book"
---

> [!info] What is a Fibonacci Heap?
> A **Fibonacci Heap** is a lazy, mergeable priority queue composed of a collection of heap-ordered trees.
> It is famous for supporting **decrease-key** and **insert** operations in **O(1) amortized time**, making it the mathematical foundation for optimizing algorithms like Dijkstra's shortest path and Prim's minimum spanning tree to $O(e + v \log v)$ complexity.

- # Explanation
	- A **Fibonacci Heap** relaxes the structural balance rules of binary heaps. Instead of maintaining a perfect binary tree, it delays consolidating trees until an extract-min operation occurs (lazy merging).
	- Multiple trees of varying degrees reside in a circular doubly-linked root list.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine a **lazy office assistant**. 
		- When documents arrive, the assistant doesn't file them in alphabetical folders immediately (which is expensive). Instead, they pile them onto a desk in a loose stack ($O(1)$ lazy insert).
		- Only when the boss asks for the lowest-numbered document (extract-min) does the assistant clean the entire desk, organizing all papers into neat folders of matching sizes (consolidation) to speed up future requests.
	-
	- ## Why Fibonacci Heaps?
	  collapsed:: true
		- In graph algorithms like Dijkstra's, the **decrease-key** operation is called far more frequently ($O(E)$ times) than **extract-min** ($O(V)$ times).
		- A standard Binary Heap requires $O(\log n)$ for decrease-key, leading to $O(E \log V)$ total time.
		- Fibonacci heaps achieve $O(1)$ amortized time for decrease-key, improving the bounds to $O(E + V \log V)$, which is a huge speedup for dense graphs.
-
- # How It Works
  collapsed:: true
	- ## Node Attributes
	  collapsed:: true
		- Every node contains:
		  - `key` and `value`
		  - Pointers: `parent`, `child`, `left` (sibling), `right` (sibling)
		  - `degree`: The number of children.
		  - `mark`: A boolean flag indicating whether the node has lost a child since it was made a child of another node. This is the secret to keeping tree heights logarithmic.
	-
	- ## Lazy Merging & Root List
	  collapsed:: true
		- Inserting and melding simply link circular lists together without re-sorting or reorganizing.
		- ```
		  Min Pointer -> [Root Node: 3] <-> [Root Node: 17] <-> [Root Node: 24]
		                      /                      /
		               [Child: 8]               [Child: 30]
		  ```
	-
	- ## Consolidation (during Extract Min)
	  collapsed:: true
		- When the minimum node is extracted, its children are moved to the root list.
		- Then, **consolidation** traverses the root list, merging trees of the same degree together.
		- When linking two trees, the one with the larger key becomes a child of the one with the smaller key.
	-
	- ## Decrease Key & Cascading Cuts
	  collapsed:: true
		- When key $x$ is decreased:
		  - If $x$'s new key violates the heap property (smaller than its parent $y$), we **cut** $x$ from $y$ and move it to the root list.
		  - We then perform a **cascading cut** on $y$:
		    - If $y$ is unmarked, mark it.
		    - If $y$ is already marked, cut $y$ from its parent $z$, move it to the root list, unmark it, and recursively check $z$.
-
- # Time & Space Complexity
  collapsed:: true
	- | Operation | Amortized Complexity | Worst-case Complexity | Space Complexity |
	  |-----------|----------------------|-----------------------|------------------|
	  | **Insert** | $O(1)$ | $O(1)$ | $O(1)$ |
	  | **Find Min** | $O(1)$ | $O(1)$ | $O(1)$ |
	  | **Meld (Union)**| $O(1)$ | $O(1)$ | $O(1)$ |
	  | **Decrease Key**| $O(1)$ | $O(\log n)$ | $O(1)$ auxiliary |
	  | **Extract Min** | $O(\log n)$ | $O(n)$ | $O(\log n)$ auxiliary |
-
- # Implementation
  collapsed:: true
	- > [!note] Fibonacci Heap Implementation
	  > The following implementations show a lazy Fibonacci Heap with $O(1)$ insert, $O(1)$ decrease-key, cascading cuts, and $O(\log n)$ consolidated extract-min.
	-
	- :::code-tabs
	  
	  ```python
	  import math
	  
	  class FibonacciHeapNode:
	      def __init__(self, key, value=None):
	          self.key = key
	          self.value = value if value is not None else key
	          self.degree = 0
	          self.parent = None
	          self.child = None
	          self.left = self
	          self.right = self
	          self.mark = False
	  
	  class FibonacciHeap:
	      def __init__(self):
	          self.min_node = None
	          self.num_nodes = 0
	  
	      def insert(self, key, value=None):
	          """Insert a new node in O(1) time."""
	          node = FibonacciHeapNode(key, value)
	          if self.min_node is None:
	              self.min_node = node
	          else:
	              self._add_to_root_list(node)
	              if node.key < self.min_node.key:
	                  self.min_node = node
	          self.num_nodes += 1
	          return node
	  
	      def get_min(self):
	          return self.min_node
	  
	      def merge(self, other_heap):
	          """Merge two Fibonacci heaps in O(1) time."""
	          new_heap = FibonacciHeap()
	          new_heap.min_node = self.min_node
	          
	          if self.min_node and other_heap.min_node:
	              self_min_next = self.min_node.right
	              other_min_prev = other_heap.min_node.left
	              
	              self.min_node.right = other_heap.min_node
	              other_heap.min_node.left = self.min_node
	              
	              self_min_next.left = other_min_prev
	              other_min_prev.right = self_min_next
	              
	              if other_heap.min_node.key < self.min_node.key:
	                  new_heap.min_node = other_heap.min_node
	          elif other_heap.min_node:
	              new_heap.min_node = other_heap.min_node
	              
	          new_heap.num_nodes = self.num_nodes + other_heap.num_nodes
	          return new_heap
	  
	      def extract_min(self):
	          """Remove and return the minimum node in O(log n) amortized time."""
	          z = self.min_node
	          if z is not None:
	              if z.child is not None:
	                  # Add children to root list
	                  children = self._get_nodes_in_list(z.child)
	                  for child in children:
	                      self._add_to_root_list(child)
	                      child.parent = None
	              
	              # Remove z from root list
	              z.left.right = z.right
	              z.right.left = z.left
	              
	              if z == z.right:
	                  self.min_node = None
	              else:
	                  self.min_node = z.right
	                  self._consolidate()
	              
	              self.num_nodes -= 1
	          return z
	  
	      def decrease_key(self, x, new_key):
	          """Decrease key of node x to new_key in O(1) amortized time."""
	          if new_key > x.key:
	              raise ValueError("New key is greater than current key")
	          x.key = new_key
	          y = x.parent
	          if y is not None and x.key < y.key:
	              self._cut(x, y)
	              self._cascading_cut(y)
	          if x.key < self.min_node.key:
	              self.min_node = x
	  
	      def _cut(self, x, y):
	          # Remove x from child list of y
	          if y.child == x:
	              if x.right == x:
	                  y.child = None
	              else:
	                  y.child = x.right
	          
	          # Remove x from sibling list
	          x.left.right = x.right
	          x.right.left = x.left
	          y.degree -= 1
	          
	          # Add x to root list
	          self._add_to_root_list(x)
	          x.parent = None
	          x.mark = False
	  
	      def _cascading_cut(self, y):
	          z = y.parent
	          if z is not None:
	              if not y.mark:
	                  y.mark = True
	              else:
	                  self._cut(y, z)
	                  self._cascading_cut(z)
	  
	      def _add_to_root_list(self, node):
	          node.left = self.min_node
	          node.right = self.min_node.right
	          self.min_node.right.left = node
	          self.min_node.right = node
	  
	      def _get_nodes_in_list(self, start):
	          nodes = []
	          curr = start
	          while True:
	              nodes.append(curr)
	              curr = curr.right
	              if curr == start:
	                  break
	          return nodes
	  
	      def _consolidate(self):
	          if self.num_nodes <= 0:
	              return
	          # Max degree upper bound log_phi(n)
	          max_degree = int(math.log(self.num_nodes) / math.log(1.618)) + 2
	          A = [None] * max_degree
	  
	          root_nodes = self._get_nodes_in_list(self.min_node)
	          for w in root_nodes:
	              x = w
	              d = x.degree
	              while d < len(A) and A[d] is not None:
	                  y = A[d]
	                  if x.key > y.key:
	                      x, y = y, x
	                  self._link(y, x)
	                  A[d] = None
	                  d += 1
	              if d < len(A):
	                  A[d] = x
	  
	          self.min_node = None
	          for i in range(len(A)):
	              if A[i] is not None:
	                  if self.min_node is None:
	                      self.min_node = A[i]
	                      A[i].left = A[i]
	                      A[i].right = A[i]
	                  else:
	                      self._add_to_root_list(A[i])
	                      if A[i].key < self.min_node.key:
	                          self.min_node = A[i]
	  
	      def _link(self, y, x):
	          # Remove y from root list
	          y.left.right = y.right
	          y.right.left = y.left
	          
	          # Make y a child of x
	          y.parent = x
	          if x.child is None:
	              x.child = y
	              y.left = y
	              y.right = y
	          else:
	              y.left = x.child
	              y.right = x.child.right
	              x.child.right.left = y
	              x.child.right = y
	          
	          x.degree += 1
	          y.mark = False
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <cmath>
	  #include <algorithm>
	  #include <stdexcept>
	  
	  struct FibonacciHeapNode {
	      int key;
	      int value;
	      int degree;
	      bool mark;
	      FibonacciHeapNode* parent;
	      FibonacciHeapNode* child;
	      FibonacciHeapNode* left;
	      FibonacciHeapNode* right;
	  
	      FibonacciHeapNode(int k, int val) {
	          key = k;
	          value = val;
	          degree = 0;
	          mark = false;
	          parent = nullptr;
	          child = nullptr;
	          left = this;
	          right = this;
	      }
	  };
	  
	  class FibonacciHeap {
	  private:
	      FibonacciHeapNode* min_node;
	      int num_nodes;
	  
	      void add_to_root_list(FibonacciHeapNode* node) {
	          node->left = min_node;
	          node->right = min_node->right;
	          min_node->right->left = node;
	          min_node->right = node;
	      }
	  
	      void remove_from_sibling_list(FibonacciHeapNode* node) {
	          node->left->right = node->right;
	          node->right->left = node->left;
	      }
	  
	      std::vector<FibonacciHeapNode*> get_nodes_in_list(FibonacciHeapNode* start) {
	          std::vector<FibonacciHeapNode*> nodes;
	          if (!start) return nodes;
	          FibonacciHeapNode* curr = start;
	          do {
	              nodes.push_back(curr);
	              curr = curr->right;
	          } while (curr != start);
	          return nodes;
	      }
	  
	      void link_nodes(FibonacciHeapNode* y, FibonacciHeapNode* x) {
	          remove_from_sibling_list(y);
	          y->parent = x;
	          if (!x->child) {
	              x->child = y;
	              y->left = y;
	              y->right = y;
	          } else {
	              y->left = x->child;
	              y->right = x->child->right;
	              x->child->right->left = y;
	              x->child->right = y;
	          }
	          x->degree++;
	          y->mark = false;
	      }
	  
	      void consolidate() {
	          if (num_nodes <= 0) return;
	          int max_degree = static_cast<int>(std::log(num_nodes) / std::log(1.618)) + 2;
	          std::vector<FibonacciHeapNode*> A(max_degree, nullptr);
	  
	          std::vector<FibonacciHeapNode*> root_nodes = get_nodes_in_list(min_node);
	          for (FibonacciHeapNode* w : root_nodes) {
	              FibonacciHeapNode* x = w;
	              int d = x->degree;
	              while (d < max_degree && A[d] != nullptr) {
	                  FibonacciHeapNode* y = A[d];
	                  if (x->key > y->key) {
	                      std::swap(x, y);
	                  }
	                  link_nodes(y, x);
	                  A[d] = nullptr;
	                  d++;
	              }
	              if (d < max_degree) {
	                  A[d] = x;
	              }
	          }
	  
	          min_node = nullptr;
	          for (int i = 0; i < max_degree; ++i) {
	              if (A[i] != nullptr) {
	                  if (!min_node) {
	                      min_node = A[i];
	                      min_node->left = min_node;
	                      min_node->right = min_node;
	                  } else {
	                      add_to_root_list(A[i]);
	                      if (A[i]->key < min_node->key) {
	                          min_node = A[i];
	                      }
	                  }
	              }
	          }
	      }
	  
	      void cut(FibonacciHeapNode* x, FibonacciHeapNode* y) {
	          if (y->child == x) {
	              if (x->right == x) {
	                  y->child = nullptr;
	              } else {
	                  y->child = x->right;
	              }
	          }
	          remove_from_sibling_list(x);
	          y->degree--;
	          add_to_root_list(x);
	          x->parent = nullptr;
	          x->mark = false;
	      }
	  
	      void cascading_cut(FibonacciHeapNode* y) {
	          FibonacciHeapNode* z = y->parent;
	          if (z != nullptr) {
	              if (!y->mark) {
	                  y->mark = true;
	              } else {
	                  cut(y, z);
	                  cascading_cut(z);
	              }
	          }
	      }
	  
	      void destroy_heap(FibonacciHeapNode* start) {
	          if (!start) return;
	          std::vector<FibonacciHeapNode*> nodes = get_nodes_in_list(start);
	          for (FibonacciHeapNode* node : nodes) {
	              destroy_heap(node->child);
	              delete node;
	          }
	      }
	  
	  public:
	      FibonacciHeap() : min_node(nullptr), num_nodes(0) {}
	  
	      ~FibonacciHeap() {
	          destroy_heap(min_node);
	      }
	  
	      FibonacciHeapNode* insert(int key, int value) {
	          FibonacciHeapNode* node = new FibonacciHeapNode(key, value);
	          if (!min_node) {
	              min_node = node;
	          } else {
	              add_to_root_list(node);
	              if (node->key < min_node->key) {
	                  min_node = node;
	              }
	          }
	          num_nodes++;
	          return node;
	      }
	  
	      FibonacciHeapNode* get_min() const {
	          return min_node;
	      }
	  
	      FibonacciHeapNode* extract_min() {
	          FibonacciHeapNode* z = min_node;
	          if (z != nullptr) {
	              if (z->child != nullptr) {
	                  std::vector<FibonacciHeapNode*> children = get_nodes_in_list(z->child);
	                  for (FibonacciHeapNode* child : children) {
	                      add_to_root_list(child);
	                      child->parent = nullptr;
	                  }
	              }
	              remove_from_sibling_list(z);
	              if (z == z->right) {
	                  min_node = nullptr;
	              } else {
	                  min_node = z->right;
	                  consolidate();
	              }
	              num_nodes--;
	          }
	          return z;
	      }
	  
	      void decrease_key(FibonacciHeapNode* x, int new_key) {
	          if (new_key > x->key) {
	              throw std::invalid_argument("New key is greater than current key");
	          }
	          x->key = new_key;
	          FibonacciHeapNode* y = x->parent;
	          if (y != nullptr && x->key < y->key) {
	              cut(x, y);
	              cascading_cut(y);
	          }
	          if (x->key < min_node->key) {
	              min_node = x;
	          }
	      }
	  
	      bool is_empty() const {
	          return num_nodes == 0;
	      }
	  };
	  ```
	  
	  :::
-
- # When to Use
  collapsed:: true
	- ## Use Fibonacci Heaps When:
	  collapsed:: true
		- ✅ You are implementing shortest-path algorithms (like Dijkstra's) or minimum spanning tree algorithms (like Prim's) on large, dense graphs.
		- ✅ The number of **decrease-key** operations vastly outnumbers the number of **extract-min** operations.
		- ✅ You need a priority queue that supports fast meld/union operations in $O(1)$ time.
	- ## Avoid When:
	  collapsed:: true
		- ❌ You only need basic priority queue operations (standard binary heaps have significantly lower constant-factor overheads and are easier to implement).
		- ❌ Memory footprint is extremely tight — Fibonacci heaps store four pointers per node (`parent`, `child`, `left`, `right`) and tracking flags, which consumes a lot of memory.
-
- # Variations & Related Concepts
  collapsed:: true
	- **Binary Heap**: Simple array-backed heap with $O(\log n)$ insertions, deletions, and decrease-keys.
	- **Binomial Heap**: A predecessor to Fibonacci heaps, structured as a set of binomial trees, supporting meld in $O(\log n)$ time.
	- **Pairing Heap**: A self-adjusting heap variant with excellent practical performance, often preferred over Fibonacci heaps due to simpler code and smaller memory overhead, despite slightly higher theoretical bounds for decrease-key.
-
- # Key Takeaways
  collapsed:: true
	- A Fibonacci Heap is a lazily evaluated priority queue structured as a collection of heap-ordered trees.
	- Inserting and merging heaps simply append nodes to a circular root list in $O(1)$ time.
	- During `extract_min`, trees of equal degrees are consolidated (linked) in $O(\log n)$ amortized time.
	- Decreasing a key cuts the node and cascadingly cuts parents that have lost a second child, ensuring the tree heights remain $O(\log n)$.
	- It is highly theoretical; although optimal for asymptotic limits ($O(e + v \log v)$ for Dijkstra), its large constant factors mean binary or pairing heaps are often faster in practice.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Wikipedia -> Fibonacci heap](https://en.wikipedia.org/wiki/Fibonacci_heap)
		- [GeeksforGeeks -> Fibonacci Heap](https://www.geeksforgeeks.org/fibonacci-heap-set-1-introduction/)