---
seoTitle: Interval Tree Explained – Augmented Balanced BST for Interval Queries
description: "A comprehensive guide to Interval Trees. Explains augmented BSTs (AVL/Red-Black) with max subtree endpoints, interval overlapping queries, and implementations in Python and C++."
keywords: "interval tree, overlapping intervals, augmented BST, O(log n + k), range query, scheduling, segment overlap, time complexity, space complexity, data structure, VR-Rathod, Code-Note, code note vr, vr book"
---

> [!info] What is an Interval Tree?
> An **Interval Tree** is an augmented self-balancing Binary Search Tree (such as AVL or Red-Black Trees) designed to store and query intervals.
> It allows searching for any or all stored intervals that overlap with a query interval in **O(log n + k)** time, where $k$ is the number of overlapping intervals found.

- # Explanation
	- An **Interval Tree** stores intervals of the form `[low, high]`. Nodes are sorted and keyed by their `low` endpoint.
	- To query overlaps efficiently, each node is augmented with an extra property: **max**, which stores the maximum value among all interval endpoints in its subtree.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **classroom scheduling system**. 
		- When reserving a slot for an exam from 2:00 PM to 4:00 PM (`[14, 16]`), the scheduler checks if there are any conflicting exams. 
		- Rather than checking every class slot scheduled that day (linear search), the scheduler walks a decision tree to quickly bypass non-overlapping time ranges.
	-
	- ## Why Interval Trees?
	  collapsed:: true
		- Finding overlapping ranges naively takes $O(n)$ time.
		- By using an augmented balanced tree, search paths that cannot possibly contain overlaps are pruned in $O(\log n)$ time.
		- If the left child's maximum endpoint is less than the query's low endpoint, we are guaranteed that no interval in the left subtree can overlap the query. We can skip it entirely.
-
- # How It Works
  collapsed:: true
	- ## Node Augmentation
	  collapsed:: true
		- Each node $x$ contains:
		  - `interval`: `[low, high]`
		  - `max`: `max(x.interval.high, x.left.max, x.right.max)`
		- ```
		              [15, 20] (max = 30)
		             /                  \
		   [10, 30] (max = 30)       [17, 19] (max = 40)
		          /         \                 \
		  [5, 20] (max=20) [12, 15] (max=15)  [30, 40] (max=40)
		  ```
	-
	- ## Insertion and Balances
	  collapsed:: true
		- 1. Insert interval `[low, high]` like a standard BST using the `low` values as keys.
		- 2. On backtracking, recalculate the `max` value of each node as: `node.max = max(node.interval.high, node.left.max, node.right.max)`.
		- 3. Rebalance using standard tree rotations (e.g. AVL left/right rotations). Remember to update `max` during rotations!
	-
	- ## Overlap Query Algorithm
	  collapsed:: true
		- To query overlapping intervals with `[q_low, q_high]`:
		- ```
		  query_all(node, q):
		      if node is null or node.max < q.low:
		          return  // No possible overlap in this subtree
		      
		      if node.left:
		          query_all(node.left, q)
		          
		      if overlaps(node.interval, q):
		          result.add(node.interval)
		          
		      if node.right and node.interval.low <= q.high:
		          query_all(node.right, q)
		  ```
-
- # Time & Space Complexity
  collapsed:: true
	- | Operation | Time Complexity | Space Complexity |
	  |-----------|-----------------|------------------|
	  | **Insert** | $O(\log n)$ | $O(\log n)$ call stack |
	  | **Search Any** | $O(\log n)$ | $O(\log n)$ call stack |
	  | **Search All** | $O(\log n + k)$ (where $k$ is overlaps found) | $O(\log n + k)$ |
-
- # Implementation
  collapsed:: true
	- > [!note] AVL-Balanced Interval Tree
	  > The following implementations show an augmented AVL tree that maintains balance and updates the `max` attribute during insertions, rotations, and searches.
	-
	- :::code-tabs
	  
	  ```python
	  class Interval:
	      def __init__(self, low, high):
	          self.low = low
	          self.high = high
	  
	      def __repr__(self):
	          return f"[{self.low}, {self.high}]"
	  
	  class IntervalTreeNode:
	      def __init__(self, interval):
	          self.interval = interval
	          self.max = interval.high
	          self.height = 1
	          self.left = None
	          self.right = None
	  
	  class IntervalTree:
	      def __init__(self):
	          self.root = None
	  
	      def get_height(self, node):
	          return node.height if node else 0
	  
	      def get_max(self, node):
	          return node.max if node else float('-inf')
	  
	      def get_balance(self, node):
	          return self.get_height(node.left) - self.get_height(node.right) if node else 0
	  
	      def update_node(self, node):
	          """Update the node height and maximum endpoint recursively."""
	          if not node:
	              return
	          node.height = 1 + max(self.get_height(node.left), self.get_height(node.right))
	          node.max = max(node.interval.high, self.get_max(node.left), self.get_max(node.right))
	  
	      def rotate_right(self, y):
	          x = y.left
	          T2 = x.right
	  
	          x.right = y
	          y.left = T2
	  
	          self.update_node(y)
	          self.update_node(x)
	          return x
	  
	      def rotate_left(self, x):
	          y = x.right
	          T2 = y.left
	  
	          y.left = x
	          x.right = T2
	  
	          self.update_node(x)
	          self.update_node(y)
	          return y
	  
	      def insert(self, root, interval):
	          """Insert an interval and perform AVL balancing."""
	          if not root:
	              return IntervalTreeNode(interval)
	  
	          if interval.low < root.interval.low:
	              root.left = self.insert(root.left, interval)
	          else:
	              root.right = self.insert(root.right, interval)
	  
	          self.update_node(root)
	  
	          balance = self.get_balance(root)
	  
	          # Left Left Case
	          if balance > 1 and interval.low < root.left.interval.low:
	              return self.rotate_right(root)
	  
	          # Right Right Case
	          if balance < -1 and interval.low >= root.right.interval.low:
	              return self.rotate_left(root)
	  
	          # Left Right Case
	          if balance > 1 and interval.low >= root.left.interval.low:
	              root.left = self.rotate_left(root.left)
	              return self.rotate_right(root)
	  
	          # Right Left Case
	          if balance < -1 and interval.low < root.right.interval.low:
	              root.right = self.rotate_right(root.right)
	              return self.rotate_left(root)
	  
	          return root
	  
	      def overlaps(self, i1, i2):
	          return i1.low <= i2.high and i2.low <= i1.high
	  
	      def search_all(self, root, interval, result):
	          """Find all overlapping intervals with the query interval."""
	          if not root:
	              return
	  
	          # If query interval is to the right of root's max, no overlap possible in this subtree
	          if root.max < interval.low:
	              return
	  
	          # Check left subtree
	          if root.left:
	              self.search_all(root.left, interval, result)
	  
	          # Check current node
	          if self.overlaps(root.interval, interval):
	              result.append(root.interval)
	  
	          # Check right subtree (only if root's low is <= query interval high)
	          if root.right and root.interval.low <= interval.high:
	              self.search_all(root.right, interval, result)
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  struct Interval {
	      int low;
	      int high;
	      Interval() : low(0), high(0) {}
	      Interval(int l, int h) : low(l), high(h) {}
	  };
	  
	  struct IntervalTreeNode {
	      Interval interval;
	      int max;
	      int height;
	      IntervalTreeNode* left;
	      IntervalTreeNode* right;
	  
	      IntervalTreeNode(Interval val) {
	          interval = val;
	          max = val.high;
	          height = 1;
	          left = nullptr;
	          right = nullptr;
	      }
	  };
	  
	  class IntervalTree {
	  private:
	      IntervalTreeNode* root;
	  
	      int get_height(IntervalTreeNode* node) {
	          return node ? node->height : 0;
	      }
	  
	      int get_max(IntervalTreeNode* node) {
	          return node ? node->max : -1e9; // Negative infinity replacement
	      }
	  
	      int get_balance(IntervalTreeNode* node) {
	          return node ? get_height(node->left) - get_height(node->right) : 0;
	      }
	  
	      void update_node(IntervalTreeNode* node) {
	          if (!node) return;
	          node->height = 1 + std::max(get_height(node->left), get_height(node->right));
	          node->max = std::max({node->interval.high, get_max(node->left), get_max(node->right)});
	      }
	  
	      IntervalTreeNode* rotate_right(IntervalTreeNode* y) {
	          IntervalTreeNode* x = y->left;
	          IntervalTreeNode* T2 = x->right;
	  
	          x->right = y;
	          y->left = T2;
	  
	          update_node(y);
	          update_node(x);
	          return x;
	      }
	  
	      IntervalTreeNode* rotate_left(IntervalTreeNode* x) {
	          IntervalTreeNode* y = x->right;
	          IntervalTreeNode* T2 = y->left;
	  
	          y->left = x;
	          x->right = T2;
	  
	          update_node(x);
	          update_node(y);
	          return y;
	      }
	  
	      IntervalTreeNode* insert(IntervalTreeNode* node, Interval interval) {
	          if (!node) {
	              return new IntervalTreeNode(interval);
	          }
	  
	          if (interval.low < node->interval.low) {
	              node->left = insert(node->left, interval);
	          } else {
	              node->right = insert(node->right, interval);
	          }
	  
	          update_node(node);
	  
	          int balance = get_balance(node);
	  
	          // Left Left Case
	          if (balance > 1 && interval.low < node->left->interval.low) {
	              return rotate_right(node);
	          }
	  
	          // Right Right Case
	          if (balance < -1 && interval.low >= node->right->interval.low) {
	              return rotate_left(node);
	          }
	  
	          // Left Right Case
	          if (balance > 1 && interval.low >= node->left->interval.low) {
	              node->left = rotate_left(node->left);
	              return rotate_right(node);
	          }
	  
	          // Right Left Case
	          if (balance < -1 && interval.low < node->right->interval.low) {
	              node->right = rotate_right(node->right);
	              return rotate_left(node);
	          }
	  
	          return node;
	      }
	  
	      bool overlaps(Interval i1, Interval i2) {
	          return i1.low <= i2.high && i2.low <= i1.high;
	      }
	  
	      void search_all(IntervalTreeNode* node, Interval interval, std::vector<Interval>& result) {
	          if (!node) return;
	  
	          if (node->max < interval.low) {
	              return;
	          }
	  
	          if (node->left) {
	              search_all(node->left, interval, result);
	          }
	  
	          if (overlaps(node->interval, interval)) {
	              result.push_back(node->interval);
	          }
	  
	          if (node->right && node->interval.low <= interval.high) {
	              search_all(node->right, interval, result);
	          }
	      }
	  
	      void destroy_tree(IntervalTreeNode* node) {
	          if (node) {
	              destroy_tree(node->left);
	              destroy_tree(node->right);
	              delete node;
	          }
	      }
	  
	  public:
	      IntervalTree() : root(nullptr) {}
	  
	      ~IntervalTree() {
	          destroy_tree(root);
	      }
	  
	      void insert(Interval interval) {
	          root = insert(root, interval);
	      }
	  
	      std::vector<Interval> search_all(Interval interval) {
	          std::vector<Interval> result;
	          search_all(root, interval, result);
	          return result;
	      }
	  };
	  ```
	  
	  :::
-
- # When to Use
  collapsed:: true
	- ## Use Interval Trees When:
	  collapsed:: true
		- ✅ You need to find all intervals overlapping a given coordinate (e.g. database querying, time ranges).
		- ✅ Implementing scheduling systems where time overlaps represent double-bookings.
		- ✅ Solving geometric algorithms like segment intersection problems.
	- ## Avoid When:
	  collapsed:: true
		- ❌ Intervals are completely static (a simple sorted array of intervals or a segment tree can be simpler and more performant).
		- ❌ You only need point range queries in 1D space without intervals (standard Segment Tree or Fenwick Tree is better).
-
- # Variations & Related Concepts
  collapsed:: true
	- **Segment Tree**: Stores fixed segment ranges, optimized for point queries and updates on range partitions.
	- **Range Tree**: Multi-dimensional spatial tree that handles points instead of intervals.
-
- # Key Takeaways
  collapsed:: true
	- An Interval Tree is an augmented binary search tree (usually AVL or Red-Black) storing intervals sorted by their lower endpoints.
	- Subtree maximum endpoints (`max`) are updated during insertions and rotations in $O(1)$ time per node.
	- Overlapping interval search skips entire subtrees where `node.max` is less than the query's lower endpoint, achieving $O(\log n + k)$ time.
	- The tree is dynamic and handles insertions and deletions while maintaining balance.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Wikipedia -> Interval tree](https://en.wikipedia.org/wiki/Interval_tree)
		- [GeeksforGeeks -> Interval Tree](https://www.geeksforgeeks.org/interval-tree/)