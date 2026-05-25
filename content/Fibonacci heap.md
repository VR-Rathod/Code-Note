---
seoTitle: Fibonacci Heap Explained – Amortized Efficient Priority Queue
description: "Fibonacci heaps support decrease-key in O(1) amortized time, enabling faster Dijkstra. Learn lazy merging, cascading cut, mark bits, and amortized complexity."
keywords: "Fibonacci heap, priority queue, amortized complexity, decrease key, lazy merge, cascading cut, O(1) amortized, time complexity, space complexity, graph algorithms"
---

- # Explanation
	- A **Fibonacci Heap** is a collection of heap-ordered trees where each tree follows the heap property. It is used to optimize priority queues and supports very efficient **decrease-key** and **delete-min** operations.
	-
	- It is often used in algorithms like **Dijkstra's shortest path algorithm** and **Prim's minimum spanning tree algorithm**.
-
- # Steps:
	- **Insert**: Insert a new element by creating a new tree with the element and adding it to the root list.
	-
	- **Minimum**: The minimum element is easily accessible from the root list.
	-
	- **Decrease Key**: The decrease key operation is optimized by cutting and reattaching nodes.
	-
	- **Meld**: Two Fibonacci heaps can be merged efficiently by merging their root lists.
-
- # Time Complexity:
	- **Insertion**: O(1) (amortized)
	-
	- **Find Min**: O(1)
	-
	- **Decrease Key**: O(1) (amortized)
	-
	- **Delete Min**: O(log n) (amortized)
-
- ```python
  class FibonacciHeapNode:
      def __init__(self, key):
          self.key = key
          self.degree = 0
          self.parent = None
          self.child = None
          self.mark = False
          self.next = self
          self.prev = self
  
  class FibonacciHeap:
      def __init__(self):
          self.min = None
          self.num_nodes = 0
      
      def insert(self, key):
          node = FibonacciHeapNode(key)
          if not self.min:
              self.min = node
          else:
              self._link(self.min, node)
          self.num_nodes += 1
          return node
  
      def _link(self, node1, node2):
          node1.next = node2
          node2.prev = node1
          if node1.key > node2.key:
              self.min = node2
  
      def find_min(self):
          return self.min.key if self.min else None
  
  # Example usage
  fib_heap = FibonacciHeap()
  fib_heap.insert(3)
  fib_heap.insert(5)
  fib_heap.insert(1)
  
  print("Minimum value in Fibonacci Heap:", fib_heap.find_min())  # Output: 1
  ```