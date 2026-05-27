---
seoTitle: Finger Tree Explained – Functional 2-3 Tree Sequence with O(1) Deque
description: "A detailed guide to Finger Trees. Explains functional persistent 2-3 trees with prefix/suffix nodes, deep recursive spines, and implementations in Python and C++."
keywords: "finger tree, functional data structure, deque, O(1) access, O(log n) split, monoid annotation, 2-3 tree, time complexity, space complexity, persistent data structure, VR-Rathod, Code-Note, code note vr, vr book"
---

> [!info] What is a Finger Tree?
> A **Finger Tree** is a functional, persistent sequence representation based on 2-3 trees. By placing "fingers" (pointers) at both ends of the sequence, it achieves **amortized O(1)** time complexity for double-ended queue operations (push/pop front/back) and **O(log n)** time for splitting and concatenation.
> **Monoid Annotation:** It supports annotations with a monoid, allowing it to efficiently behave as a random-access sequence, a priority queue, or a search tree.

- # Explanation
	- A **Finger Tree** is structured recursively. A tree is either `Empty`, a `Single` element, or `Deep`.
	- A `Deep` node contains:
	  - A **left prefix** of 1 to 4 elements.
	  - A **spine** which is another Finger Tree containing **Nodes** (which are either `Node2` or `Node3` grouping 2 or 3 elements).
	  - A **right suffix** of 1 to 4 elements.
	  -
	  - ```
	                   Deep
	                  /  |  \
	             Left  Spine  Right
	            (1..4) (Tree of (1..4)
	                   Nodes)
	    ```
	- Because operations take place at the left and right prefixes, they only propagate deeper into the spine when a prefix overflows (exceeds size 4) or underflows (goes below size 1).
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **shipping cargo container terminal**. 
		- To load/unload cargo quickly, you keep the most active containers at the front and back gates (left and right prefixes, size 1-4).
		- If the front gate gets too crowded, you group 3 containers onto a cargo train and send them to the main central storage yard (spine).
		- If the front gate runs out of containers, you recall a grouped set from the central yard, split them back up, and place them at the gate.
	-
	- ## Why Finger Trees?
	  collapsed:: true
		- In purely functional programming, standard arrays do not support $O(1)$ updates, and linked lists do not support $O(1)$ append/pop at both ends.
		- Finger Trees act as the ultimate persistent deque.
		- By annotating nodes with size, we get $O(\log n)$ random access; by annotating with minimum value, we get a priority queue, all within a single data structure.
-
- # How It Works
  collapsed:: true
	- ## Recursive Structure
	  collapsed:: true
		- A Finger Tree is defined recursively:
		  - `FingerTree T` is either `Empty`, `Single(T)`, or `Deep(Prefix T, FingerTree (Node T), Suffix T)`
		  - `Prefix` and `Suffix` are tuples of size 1 to 4 containing elements of type `T`.
		  - `Node T` is either a `Node2` containing 2 elements of `T`, or `Node3` containing 3 elements of `T`.
	-
	- ## Deque Operations
	  collapsed:: true
		- ### Push Front
		  - If `left` prefix has size $< 4$, simply prepend the new element to `left` prefix. ($O(1)$)
		  - If `left` prefix has size $= 4$, keep the first element, group the remaining 3 elements into a `Node3`, and recursively push this `Node3` to the front of the `spine`.
		- ### Pop Front
		  - Remove the first element of `left` prefix.
		  - If `left` prefix is now empty:
		    - If the `spine` is not empty, pop a node from the `spine`, unpack it (which yields 2 or 3 elements), and make those the new `left` prefix.
		    - If the `spine` is empty, construct a new tree from the `right` suffix.
-
- # Time & Space Complexity
  collapsed:: true
	- | Operation | Amortized Complexity | Worst-case Complexity | Space Complexity |
	  |-----------|----------------------|-----------------------|------------------|
	  | **Push Front/Back** | $O(1)$ | $O(\log n)$ | $O(\log n)$ |
	  | **Pop Front/Back** | $O(1)$ | $O(\log n)$ | $O(\log n)$ |
	  | **Meld (Concat)** | $O(\log(\min(n_1, n_2)))$ | $O(\log n)$ | $O(\log n)$ |
	  | **Split / Access** | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ |
-
- # Implementation
  collapsed:: true
	- > [!note] Persistent 2-3 Finger Tree Deque
	  > The following implementations demonstrate a persistent Finger Tree deque in Python and C++, supporting push/pop at both ends and sequence reconstruction.
	-
	- :::code-tabs
	  
	  ```python
	  class Node2:
	      def __init__(self, a, b):
	          self.a = a
	          self.b = b
	      def __repr__(self):
	          return f"Node2({self.a}, {self.b})"
	  
	  class Node3:
	      def __init__(self, a, b, c):
	          self.a = a
	          self.b = b
	          self.c = c
	      def __repr__(self):
	          return f"Node3({self.a}, {self.b}, {self.c})"
	  
	  class FingerTree:
	      pass
	  
	  class Empty(FingerTree):
	      def push_front(self, x):
	          return Single(x)
	      def push_back(self, x):
	          return Single(x)
	      def pop_front(self):
	          raise IndexError("pop from empty finger tree")
	      def pop_back(self):
	          raise IndexError("pop from empty finger tree")
	      def to_list(self):
	          return []
	      def __repr__(self):
	          return "Empty"
	  
	  class Single(FingerTree):
	      def __init__(self, x):
	          self.x = x
	      def push_front(self, y):
	          return Deep((y,), Empty(), (self.x,))
	      def push_back(self, y):
	          return Deep((self.x,), Empty(), (y,))
	      def pop_front(self):
	          return self.x, Empty()
	      def pop_back(self):
	          return self.x, Empty()
	      def to_list(self):
	          return [self.x]
	      def __repr__(self):
	          return f"Single({self.x})"
	  
	  class Deep(FingerTree):
	      def __init__(self, left, spine, right):
	          # left and right are tuples of length 1 to 4
	          self.left = left
	          self.spine = spine
	          self.right = right
	  
	      def push_front(self, x):
	          if len(self.left) < 4:
	              return Deep((x,) + self.left, self.spine, self.right)
	          else:
	              a, b, c, d = self.left
	              new_node = Node3(b, c, d)
	              return Deep((x, a), self.spine.push_front(new_node), self.right)
	  
	      def push_back(self, x):
	          if len(self.right) < 4:
	              return Deep(self.left, self.spine, self.right + (x,))
	          else:
	              a, b, c, d = self.right
	              new_node = Node3(a, b, c)
	              return Deep(self.left, self.spine.push_back(new_node), (d, x))
	  
	      def pop_front(self):
	          head = self.left[0]
	          tail_left = self.left[1:]
	          if tail_left:
	              return head, Deep(tail_left, self.spine, self.right)
	          
	          if not isinstance(self.spine, Empty):
	              node, new_spine = self.spine.pop_front()
	              if isinstance(node, Node2):
	                  new_left = (node.a, node.b)
	              else:
	                  new_left = (node.a, node.b, node.c)
	              return head, Deep(new_left, new_spine, self.right)
	          
	          if len(self.right) == 1:
	              return head, Single(self.right[0])
	          else:
	              return head, Deep(self.right[:1], Empty(), self.right[1:])
	  
	      def pop_back(self):
	          tail = self.right[-1]
	          init_right = self.right[:-1]
	          if init_right:
	              return tail, Deep(self.left, self.spine, init_right)
	          
	          if not isinstance(self.spine, Empty):
	              node, new_spine = self.spine.pop_back()
	              if isinstance(node, Node2):
	                  new_right = (node.a, node.b)
	              else:
	                  new_right = (node.a, node.b, node.c)
	              return tail, Deep(self.left, new_spine, new_right)
	          
	          if len(self.left) == 1:
	              return tail, Single(self.left[0])
	          else:
	              return tail, Deep(self.left[:-1], Empty(), self.left[-1:])
	  
	      def to_list(self):
	          res = []
	          def flatten(item):
	              if isinstance(item, Node2):
	                  return [item.a, item.b]
	              elif isinstance(item, Node3):
	                  return [item.a, item.b, item.c]
	              else:
	                  return [item]
	          
	          for item in self.left:
	              res.extend(flatten(item))
	          
	          spine_items = self.spine.to_list()
	          for node in spine_items:
	              res.extend(flatten(node))
	              
	          for item in self.right:
	              res.extend(flatten(item))
	          return res
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <memory>
	  #include <utility>
	  #include <stdexcept>
	  
	  struct Node;
	  using NodePtr = std::shared_ptr<Node>;
	  
	  struct Node {
	      enum Type { VALUE, NODE2, NODE3 };
	      Type type;
	      int val;
	      NodePtr a, b, c;
	  
	      Node(int v) : type(VALUE), val(v), a(nullptr), b(nullptr), c(nullptr) {}
	      Node(NodePtr x, NodePtr y) : type(NODE2), val(0), a(x), b(y), c(nullptr) {}
	      Node(NodePtr x, NodePtr y, NodePtr z) : type(NODE3), val(0), a(x), b(y), c(z) {}
	  };
	  
	  class FingerTree;
	  using FTPtr = std::shared_ptr<FingerTree>;
	  
	  class FingerTree {
	  public:
	      enum State { EMPTY, SINGLE, DEEP };
	      State state;
	  
	      FingerTree(State s) : state(s) {}
	      virtual ~FingerTree() = default;
	  
	      virtual FTPtr push_front(NodePtr x) = 0;
	      virtual FTPtr push_back(NodePtr x) = 0;
	      virtual std::pair<NodePtr, FTPtr> pop_front() = 0;
	      virtual std::pair<NodePtr, FTPtr> pop_back() = 0;
	      virtual std::vector<NodePtr> to_vector() = 0;
	  };
	  
	  class EmptyFT : public FingerTree {
	  public:
	      EmptyFT() : FingerTree(EMPTY) {}
	  
	      FTPtr push_front(NodePtr x) override;
	      FTPtr push_back(NodePtr x) override;
	      std::pair<NodePtr, FTPtr> pop_front() override {
	          throw std::underflow_error("pop_front on empty tree");
	      }
	      std::pair<NodePtr, FTPtr> pop_back() override {
	          throw std::underflow_error("pop_back on empty tree");
	      }
	      std::vector<NodePtr> to_vector() override {
	          return {};
	      }
	  };
	  
	  class SingleFT : public FingerTree {
	  public:
	      NodePtr x;
	      SingleFT(NodePtr val) : FingerTree(SINGLE), x(val) {}
	  
	      FTPtr push_front(NodePtr y) override;
	      FTPtr push_back(NodePtr y) override;
	      std::pair<NodePtr, FTPtr> pop_front() override;
	      std::pair<NodePtr, FTPtr> pop_back() override;
	      std::vector<NodePtr> to_vector() override {
	          return {x};
	      }
	  };
	  
	  class DeepFT : public FingerTree {
	  public:
	      std::vector<NodePtr> left;
	      FTPtr spine;
	      std::vector<NodePtr> right;
	  
	      DeepFT(std::vector<NodePtr> l, FTPtr s, std::vector<NodePtr> r)
	          : FingerTree(DEEP), left(l), spine(s), right(r) {}
	  
	      FTPtr push_front(NodePtr x) override {
	          if (left.size() < 4) {
	              std::vector<NodePtr> new_left = {x};
	              new_left.insert(new_left.end(), left.begin(), left.end());
	              return std::make_shared<DeepFT>(new_left, spine, right);
	          } else {
	              NodePtr node = std::make_shared<Node>(left[1], left[2], left[3]);
	              std::vector<NodePtr> new_left = {x, left[0]};
	              return std::make_shared<DeepFT>(new_left, spine->push_front(node), right);
	          }
	      }
	  
	      FTPtr push_back(NodePtr x) override {
	          if (right.size() < 4) {
	              std::vector<NodePtr> new_right = right;
	              new_right.push_back(x);
	              return std::make_shared<DeepFT>(left, spine, new_right);
	          } else {
	              NodePtr node = std::make_shared<Node>(right[0], right[1], right[2]);
	              std::vector<NodePtr> new_right = {right[3], x};
	              return std::make_shared<DeepFT>(left, spine->push_back(node), new_right);
	          }
	      }
	  
	      std::pair<NodePtr, FTPtr> pop_front() override {
	          NodePtr head = left[0];
	          std::vector<NodePtr> tail_left(left.begin() + 1, left.end());
	          if (!tail_left.empty()) {
	              return {head, std::make_shared<DeepFT>(tail_left, spine, right)};
	          }
	  
	          if (spine->state != EMPTY) {
	              auto p = spine->pop_front();
	              NodePtr node = p.first;
	              FTPtr new_spine = p.second;
	              std::vector<NodePtr> new_left;
	              if (node->type == Node::NODE2) {
	                  new_left = {node->a, node->b};
	              } else {
	                  new_left = {node->a, node->b, node->c};
	              }
	              return {head, std::make_shared<DeepFT>(new_left, new_spine, right)};
	          }
	  
	          if (right.size() == 1) {
	              return {head, std::make_shared<SingleFT>(right[0])};
	          } else {
	              std::vector<NodePtr> new_left = {right[0]};
	              std::vector<NodePtr> new_right(right.begin() + 1, right.end());
	              return {head, std::make_shared<DeepFT>(new_left, std::make_shared<EmptyFT>(), new_right)};
	          }
	      }
	  
	      std::pair<NodePtr, FTPtr> pop_back() override {
	          NodePtr tail = right.back();
	          std::vector<NodePtr> init_right(right.begin(), right.end() - 1);
	          if (!init_right.empty()) {
	              return {tail, std::make_shared<DeepFT>(left, spine, init_right)};
	          }
	  
	          if (spine->state != EMPTY) {
	              auto p = spine->pop_back();
	              NodePtr node = p.first;
	              FTPtr new_spine = p.second;
	              std::vector<NodePtr> new_right;
	              if (node->type == Node::NODE2) {
	                  new_right = {node->a, node->b};
	              } else {
	                  new_right = {node->a, node->b, node->c};
	              }
	              return {tail, std::make_shared<DeepFT>(left, new_spine, new_right)};
	          }
	  
	          if (left.size() == 1) {
	              return {tail, std::make_shared<SingleFT>(left[0])};
	          } else {
	              std::vector<NodePtr> new_left(left.begin(), left.end() - 1);
	              std::vector<NodePtr> new_right = {left.back()};
	              return {tail, std::make_shared<DeepFT>(new_left, std::make_shared<EmptyFT>(), new_right)};
	          }
	      }
	  
	      std::vector<NodePtr> to_vector() override {
	          std::vector<NodePtr> res;
	          for (auto& item : left) res.push_back(item);
	          std::vector<NodePtr> spine_items = spine->to_vector();
	          for (auto& item : spine_items) res.push_back(item);
	          for (auto& item : right) res.push_back(item);
	          return res;
	      }
	  };
	  
	  FTPtr EmptyFT::push_front(NodePtr x) { return std::make_shared<SingleFT>(x); }
	  FTPtr EmptyFT::push_back(NodePtr x) { return std::make_shared<SingleFT>(x); }
	  
	  FTPtr SingleFT::push_front(NodePtr y) {
	      return std::make_shared<DeepFT>(std::vector<NodePtr>{y}, std::make_shared<EmptyFT>(), std::vector<NodePtr>{x});
	  }
	  FTPtr SingleFT::push_back(NodePtr y) {
	      return std::make_shared<DeepFT>(std::vector<NodePtr>{x}, std::make_shared<EmptyFT>(), std::vector<NodePtr>{y});
	  }
	  
	  std::pair<NodePtr, FTPtr> SingleFT::pop_front() { return {x, std::make_shared<EmptyFT>()}; }
	  std::pair<NodePtr, FTPtr> SingleFT::pop_back() { return {x, std::make_shared<EmptyFT>()}; }
	  
	  void flatten(NodePtr item, std::vector<int>& res) {
	      if (item->type == Node::VALUE) {
	          res.push_back(item->val);
	      } else if (item->type == Node::NODE2) {
	          flatten(item->a, res);
	          flatten(item->b, res);
	      } else if (item->type == Node::NODE3) {
	          flatten(item->a, res);
	          flatten(item->b, res);
	          flatten(item->c, res);
	      }
	  }
	  ```
	  
	  :::
-
- # When to Use
  collapsed:: true
	- ## Use Finger Trees When:
	  collapsed:: true
		- ✅ You are building purely functional applications in persistent languages (like Haskell, Scala, Clojure) where mutable arrays are prohibited.
		- ✅ You need a persistent Deque with guaranteed $O(1)$ amortized access at both ends.
		- ✅ You need to perform frequent splits and concatenations of sequences in $O(\log n)$ time.
	- ## Avoid When:
	  collapsed:: true
		- ❌ You are in a mutable imperative language (Python, C++) and only need a basic double-ended queue (standard dynamically resized arrays or circular buffers like `std::deque` or `collections.deque` are much faster).
		- ❌ You only need basic sequential access (a simple linked list has less pointer chasing).
-
- # Variations & Related Concepts
  collapsed:: true
	- **2-3 Tree**: The self-balancing multi-way tree on which Finger Trees are structurally based.
	- **PATRICIA Trie**: For string lookup, whereas Finger Trees are for sequential data.
-
- # Key Takeaways
  collapsed:: true
	- A Finger Tree is a persistent, functional sequence representation utilizing a nested recursive structure.
	- By storing active elements (size 1-4) at the left and right prefixes, it acts as a double-ended queue.
	- Pushing and popping elements runs in $O(1)$ amortized time, as cascading changes down the spine occur exponentially less frequently.
	- Splits and concatenations are executed in $O(\log n)$ time.
	- Using monoidal annotations, a single Finger Tree can implement random-access sequences, priority queues, and search trees.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Wikipedia -> Finger tree](https://en.wikipedia.org/wiki/Finger_tree)