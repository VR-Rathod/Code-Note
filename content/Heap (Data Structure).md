---
seoTitle: Heap Data Structure – Min-Heap, Max-Heap & Priority Queue
description: "Master Heaps in Data Structures & Algorithms. Learn about binary heap representation, heapify operations, O(N) build-heap, and custom priority queue implementations."
keywords: "Heap, Binary Heap, Min-Heap, Max-Heap, Priority Queue, Heapify, Build-Heap, Data Structures, DSA, Heap C++, Heap Python"
---

> [!info] What is a Heap?
> A **Heap** is a specialized tree-based data structure that satisfies the **Heap Property**:
> - In a **Max-Heap**, for any given node $C$, if $P$ is a parent node of $C$, then the key (the value) of $P$ is greater than or equal to the key of $C$. The maximum element is always at the root.
> - In a **Min-Heap**, the key of $P$ is less than or equal to the key of $C$. The minimum element is always at the root.
> It must also be a **Complete Binary Tree** (all levels filled except possibly the last, which is filled left to right).

- # Explanation
  collapsed:: true
	- ## Array-Based Representation
	  collapsed:: true
		- Because a heap is a complete binary tree, it can be extremely efficiently stored in a contiguous 1D array/vector (no pointers needed!).
		- For a node stored at 0-based index $i$:
		  - **Left Child Index**: $2i + 1$
		  - **Right Child Index**: $2i + 2$
		  - **Parent Index**: $\lfloor \frac{i-1}{2} \rfloor$
		-
		- ```
		  Binary Tree representation:
		           10 (index 0)
		          /  \
		  (idx 1) 15   30 (idx 2)
		         /  \
		 (idx 3)40  50 (idx 4)
		  
		  Array Representation:
		  Index:  [  0 ,  1 ,  2 ,  3 ,  4  ]
		  Value:  [ 10 , 15 , 30 , 40 , 50  ]
		  ```
		-
		- ```mermaid
		  graph TD
		      Node0((10)) --> Node1((15))
		      Node0 --> Node2((30))
		      Node1 --> Node3((40))
		      Node1 --> Node4((50))
		      
		      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		  ```

- # Key Heap Operations
  collapsed:: true
	- ## 1. Insertion (Up-Heapify / Bubble-Up)
	  collapsed:: true
		- 1. Add the new element to the bottom-right of the tree (end of the array).
		- 2. Compare the added element with its parent; if it violates the heap property, swap them.
		- 3. Repeat step 2 (bubbling up) until the heap property is satisfied or the root is reached.
		- **Time Complexity: $O(\log n)$**
	-
	- ## 2. Extraction (Down-Heapify / Sift-Down)
	  collapsed:: true
		- 1. Replace the root element (min or max) with the last element of the array.
		- 2. Remove the last element.
		- 3. Compare the new root with its children; if it violates the heap property, swap it with the smaller child (for Min-Heap) or larger child (for Max-Heap).
		- 4. Repeat step 3 (sifting down) until the heap property is satisfied.
		- **Time Complexity: $O(\log n)$**
	-
	- ## 3. Build-Heap ($O(n)$ time)
	  collapsed:: true
		- To build a heap from an unsorted array of size $N$, run `sift-down` on all internal nodes starting from the last internal node $\lfloor \frac{N}{2} \rfloor - 1$ down to root index 0.
		- Mathematically, the sum of heights of all nodes is bounded by $O(N)$, making this initialization cost $O(N)$ instead of $N \log N$.

- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > Heaps excel at retrieving the extreme value in $O(1)$ and modifying elements in $O(\log n)$.
	  > For details on sorting algorithms utilizing heaps, see [[Heap Sort]].
	-
	- | Operation | Time Complexity | Why |
	  |-----------|-----------------|-----|
	  | **Get Min/Max (Peek)** | $O(1)$ | Element is always at root (index 0). |
	  | **Insert** | $O(\log n)$ | Element may bubble up from leaf to root. |
	  | **Extract Min/Max** | $O(\log n)$ | Element replacement at root may sift down to leaf. |
	  | **Build Heap** | $O(n)$ | Math bounded sum of node heights. |
	  | **Space Complexity** | $O(n)$ | Stores elements in a contiguous array. |

- # Priority Queues
  collapsed:: true
	- A **Priority Queue** is an abstract data type where each element has a "priority". Elements with higher priority are served before elements with lower priority.
	- Heaps are the default data structure used to implement priority queues:
	  - `priority_queue` in C++ STL (default Max-Heap).
	  - `PriorityQueue` in Java (default Min-Heap).
	  - `heapq` in Python (provides Min-Heap operations on standard list).

- # Implementation
  collapsed:: true
	- > [!note] Custom Min-Heap Implementation
	  > A clean implementation of a Min-Heap from scratch using an array/list.
	-
	- :::code-tabs
	  
	  ```python
	  class MinHeap:
	      def __init__(self):
	          self.heap = []
	  
	      def get_parent(self, i): return (i - 1) // 2
	      def get_left(self, i): return 2 * i + 1
	      def get_right(self, i): return 2 * i + 2
	  
	      def insert(self, key):
	          self.heap.append(key)
	          self._bubble_up(len(self.heap) - 1)
	  
	      def extract_min(self):
	          if not self.heap:
	              return None
	          if len(self.heap) == 1:
	              return self.heap.pop()
	          
	          root = self.heap[0]
	          self.heap[0] = self.heap.pop()
	          self._sift_down(0)
	          return root
	  
	      def _bubble_up(self, i):
	          parent = self.get_parent(i)
	          if i > 0 and self.heap[i] < self.heap[parent]:
	              self.heap[i], self.heap[parent] = self.heap[parent], self.heap[i]
	              self._bubble_up(parent)
	  
	      def _sift_down(self, i):
	          left = self.get_left(i)
	          right = self.get_right(i)
	          smallest = i
	  
	          if left < len(self.heap) and self.heap[left] < self.heap[smallest]:
	              smallest = left
	          if right < len(self.heap) and self.heap[right] < self.heap[smallest]:
	              smallest = right
	  
	          if smallest != i:
	              self.heap[i], self.heap[smallest] = self.heap[smallest], self.heap[i]
	              self._sift_down(smallest)
	  
	  # Example Usage
	  min_heap = MinHeap()
	  for val in [15, 30, 10, 40, 50]:
	      min_heap.insert(val)
	  print("Extracted Min:", min_heap.extract_min()) # Output: 10
	  print("Extracted Min:", min_heap.extract_min()) # Output: 15
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <stdexcept>
	  
	  class MinHeap {
	  private:
	      std::vector<int> heap;
	  
	      int parent(int i) { return (i - 1) / 2; }
	      int left(int i) { return 2 * i + 1; }
	      int right(int i) { return 2 * i + 2; }
	  
	      void bubbleUp(int i) {
	          if (i > 0 && heap[i] < heap[parent(i)]) {
	              std::swap(heap[i], heap[parent(i)]);
	              bubbleUp(parent(i));
	          }
	      }
	  
	      void siftDown(int i) {
	          int l = left(i);
	          int r = right(i);
	          int smallest = i;
	          if (l < (int)heap.size() && heap[l] < heap[smallest]) smallest = l;
	          if (r < (int)heap.size() && heap[r] < heap[smallest]) smallest = r;
	          if (smallest != i) {
	              std::swap(heap[i], heap[smallest]);
	              siftDown(smallest);
	          }
	      }
	  
	  public:
	      void insert(int key) {
	          heap.push_back(key);
	          bubbleUp((int)heap.size() - 1);
	      }
	  
	      int extractMin() {
	          if (heap.empty()) throw std::out_of_range("Heap empty");
	          int root = heap[0];
	          heap[0] = heap.back();
	          heap.pop_back();
	          siftDown(0);
	          return root;
	      }
	  };
	  
	  int main() {
	      MinHeap mh;
	      mh.insert(15);
	      mh.insert(30);
	      mh.insert(10);
	      std::cout << mh.extractMin() << "\n"; // Output: 10
	      std::cout << mh.extractMin() << "\n"; // Output: 15
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class MinHeap {
	      constructor() {
	          this.heap = [];
	      }
	  
	      getParent(i) { return Math.floor((i - 1) / 2); }
	      getLeft(i) { return 2 * i + 1; }
	      getRight(i) { return 2 * i + 2; }
	  
	      insert(key) {
	          this.heap.push(key);
	          this.bubbleUp(this.heap.length - 1);
	      }
	  
	      extractMin() {
	          if (this.heap.length === 0) return null;
	          if (this.heap.length === 1) return this.heap.pop();
	          const min = this.heap[0];
	          this.heap[0] = this.heap.pop();
	          this.siftDown(0);
	          return min;
	      }
	  
	      bubbleUp(i) {
	          let parent = this.getParent(i);
	          if (i > 0 && this.heap[i] < this.heap[parent]) {
	              [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
	              this.bubbleUp(parent);
	          }
	      }
	  
	      siftDown(i) {
	          const left = this.getLeft(i);
	          const right = this.getRight(i);
	          let smallest = i;
	          if (left < this.heap.length && this.heap[left] < this.heap[smallest]) smallest = left;
	          if (right < this.heap.length && this.heap[right] < this.heap[smallest]) smallest = right;
	          if (smallest !== i) {
	              [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
	              this.siftDown(smallest);
	          }
	      }
	  }
	  ```
	  
	  ```java
	  import java.util.ArrayList;
	  
	  public class MinHeap {
	      private ArrayList<Integer> heap = new ArrayList<>();
	  
	      private int parent(int i) { return (i - 1) / 2; }
	      private int left(int i) { return 2 * i + 1; }
	      private int right(int i) { return 2 * i + 2; }
	  
	      public void insert(int key) {
	          heap.add(key);
	          bubbleUp(heap.size() - 1);
	      }
	  
	      public int extractMin() {
	          if (heap.isEmpty()) throw new IllegalStateException("Heap empty");
	          int root = heap.get(0);
	          int lastVal = heap.remove(heap.size() - 1);
	          if (!heap.isEmpty()) {
	              heap.set(0, lastVal);
	              siftDown(0);
	          }
	          return root;
	      }
	  
	      private void bubbleUp(int i) {
	          int p = parent(i);
	          if (i > 0 && heap.get(i) < heap.get(p)) {
	              swap(i, p);
	              bubbleUp(p);
	          }
	      }
	  
	      private void siftDown(int i) {
	          int l = left(i);
	          int r = right(i);
	          int smallest = i;
	          if (l < heap.size() && heap.get(l) < heap.get(smallest)) smallest = l;
	          if (r < heap.size() && heap.get(r) < heap.get(smallest)) smallest = r;
	          if (smallest != i) {
	              swap(i, smallest);
	              siftDown(smallest);
	          }
	      }
	  
	      private void swap(int i, int j) {
	          int temp = heap.get(i);
	          heap.set(i, heap.get(j));
	          heap.set(j, temp);
	      }
	  }
	  ```
	  
	  :::
