---
seoTitle: Queues Data Structure - Premium DSA Guide
description: "Master the Queue data structure. Learn the FIFO principle, Enqueue/Dequeue operations, Circular Queues, Deques, and multi-language implementations."
keywords: "Queue, FIFO, Data Structures, DSA, Enqueue, Dequeue, Circular Queue, Deque, Breadth First Search"
---

> [!info] What is a Queue?
> A **Queue** is a linear data structure that follows the **FIFO (First In, First Out)** principle. The element that is inserted first is the first one to be removed. Like stacks, queues can be implemented using Arrays or Linked Lists.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine a **line at a movie theater ticket counter**.
		- The first person to join the line is the first person to get a ticket and leave.
		- If you join the line, you go to the **back (tail)**.
		- The cashier serves the person at the **front (head)**.
	-
	- ## Core Operations
	  collapsed:: true
		- Queues have primary operations that must execute in $O(1)$ time:
		- 1. **Enqueue (Push)**: Add an item to the **back/tail** of the queue.
		- 2. **Dequeue (Pop)**: Remove and return the item from the **front/head** of the queue.
		- 3. **Peek / Front**: Return the item at the front without removing it.
		-
		- ```mermaid
		  flowchart LR
		      Enqueue[Enqueue] -.->|Adds to Tail| C[Element 3 - Tail]
		      C --> B[Element 2]
		      B --> A[Element 1 - Head]
		      A -.->|Removes from Head| Dequeue[Dequeue]
		  ```

- # Variations of Queues
  collapsed:: true
	- ### 1. Standard Queue
	  Standard FIFO behavior. If implemented with a basic Array, removing elements from the front leaves "dead space" at the beginning of the array, wasting memory.
	- ### 2. [[Circular buffer]] (Circular Queue)
	  Solves the wasted space issue of Array Queues. When the "tail" reaches the end of the array, it wraps around to the beginning using modulo arithmetic (`(tail + 1) % capacity`).
	- ### 3. Deque (Double-Ended Queue)
	  Elements can be inserted and removed from **both the front and the back**. It combines the powers of a Stack and a Queue.
	- ### 4. Priority Queue
	  Elements are dequeued based on their *priority* rather than their arrival time. Implemented using a [[Heap (Data Structure)]].

- # Time & Space Complexity
  collapsed:: true
	- > [!important] Arrays vs Linked Lists for Queues
	  > Implementing a Queue with a standard array is bad because removing the first element requires shifting all other elements ($O(N)$ time). Always use a Linked List or a Circular Array for $O(1)$ Enqueue/Dequeue operations.
	-
	- | Operation | Time Complexity | Space Complexity |
	  |-----------|-----------------|------------------|
	  | **Enqueue** | $O(1)$ | $O(1)$ per element |
	  | **Dequeue** | $O(1)$ | $O(1)$ |
	  | **Peek Front**| $O(1)$ | $O(1)$ |

- # Implementation
  collapsed:: true
	- > [!note] Linked-List Queue Implementation
	  > Below is a queue implemented using a Singly Linked List, ensuring perfect $O(1)$ operations without wasting memory space.
	-
	- :::code-tabs
	  
	  ```python
	  class Node:
	      def __init__(self, data):
	          self.data = data
	          self.next = None
	  
	  class Queue:
	      def __init__(self):
	          self.head = None # Front of the queue
	          self.tail = None # Back of the queue
	          
	      def is_empty(self):
	          return self.head is None
	          
	      def enqueue(self, item):
	          new_node = Node(item)
	          if self.tail is None:
	              self.head = self.tail = new_node
	              return
	          self.tail.next = new_node
	          self.tail = new_node
	          
	      def dequeue(self):
	          if self.is_empty():
	              raise Exception("Queue is empty")
	          temp = self.head
	          self.head = temp.next
	          if self.head is None:
	              self.tail = None
	          return temp.data
	  
	  # Usage
	  q = Queue()
	  q.enqueue(10)
	  q.enqueue(20)
	  print(q.dequeue()) # Output: 10
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <stdexcept>
	  
	  struct Node {
	      int data;
	      Node* next;
	      Node(int val) : data(val), next(nullptr) {}
	  };
	  
	  class Queue {
	      Node *head, *tail;
	  public:
	      Queue() {
	          head = tail = nullptr;
	      }
	      
	      bool isEmpty() { return head == nullptr; }
	      
	      void enqueue(int val) {
	          Node* temp = new Node(val);
	          if (tail == nullptr) {
	              head = tail = temp;
	              return;
	          }
	          tail->next = temp;
	          tail = temp;
	      }
	      
	      int dequeue() {
	          if (isEmpty()) throw std::underflow_error("Queue is empty");
	          Node* temp = head;
	          head = head->next;
	          if (head == nullptr) tail = nullptr;
	          int data = temp->data;
	          delete temp;
	          return data;
	      }
	  };
	  
	  int main() {
	      Queue q;
	      q.enqueue(10);
	      q.enqueue(20);
	      std::cout << q.dequeue() << std::endl; // Output: 10
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class Node {
	      constructor(data) {
	          this.data = data;
	          this.next = null;
	      }
	  }
	  
	  class Queue {
	      constructor() {
	          this.head = null;
	          this.tail = null;
	      }
	  
	      isEmpty() {
	          return this.head === null;
	      }
	  
	      enqueue(data) {
	          const newNode = new Node(data);
	          if (this.tail === null) {
	              this.head = this.tail = newNode;
	              return;
	          }
	          this.tail.next = newNode;
	          this.tail = newNode;
	      }
	  
	      dequeue() {
	          if (this.isEmpty()) throw new Error("Queue is empty");
	          const temp = this.head;
	          this.head = this.head.next;
	          if (this.head === null) {
	              this.tail = null;
	          }
	          return temp.data;
	      }
	  }
	  
	  // Usage
	  const q = new Queue();
	  q.enqueue(10);
	  q.enqueue(20);
	  console.log(q.dequeue()); // Output: 10
	  ```
	  
	  ```java
	  class Node {
	      int data;
	      Node next;
	      Node(int data) { this.data = data; }
	  }
	  
	  public class Queue {
	      Node head, tail;
	  
	      public Queue() {
	          this.head = this.tail = null;
	      }
	  
	      public boolean isEmpty() {
	          return head == null;
	      }
	  
	      public void enqueue(int data) {
	          Node newNode = new Node(data);
	          if (this.tail == null) {
	              this.head = this.tail = newNode;
	              return;
	          }
	          this.tail.next = newNode;
	          this.tail = newNode;
	      }
	  
	      public int dequeue() {
	          if (this.isEmpty()) throw new RuntimeException("Queue is empty");
	          Node temp = head;
	          head = head.next;
	          if (head == null) {
	              tail = null;
	          }
	          return temp.data;
	      }
	  
	      public static void main(String[] args) {
	          Queue q = new Queue();
	          q.enqueue(10);
	          q.enqueue(20);
	          System.out.println(q.dequeue()); // Output: 10
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  
	  struct Node {
	      int data;
	      struct Node* next;
	  };
	  
	  struct Queue {
	      struct Node *head, *tail;
	  };
	  
	  struct Node* createNode(int data) {
	      struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
	      newNode->data = data;
	      newNode->next = NULL;
	      return newNode;
	  }
	  
	  struct Queue* createQueue() {
	      struct Queue* q = (struct Queue*)malloc(sizeof(struct Queue));
	      q->head = q->tail = NULL;
	      return q;
	  }
	  
	  void enqueue(struct Queue* q, int data) {
	      struct Node* newNode = createNode(data);
	      if (q->tail == NULL) {
	          q->head = q->tail = newNode;
	          return;
	      }
	      q->tail->next = newNode;
	      q->tail = newNode;
	  }
	  
	  int dequeue(struct Queue* q) {
	      if (q->head == NULL) {
	          printf("Queue is empty\n");
	          exit(EXIT_FAILURE);
	      }
	      struct Node* temp = q->head;
	      q->head = q->head->next;
	      if (q->head == NULL) {
	          q->tail = NULL;
	      }
	      int data = temp->data;
	      free(temp);
	      return data;
	  }
	  
	  int main() {
	      struct Queue* q = createQueue();
	      enqueue(q, 10);
	      enqueue(q, 20);
	      printf("%d\n", dequeue(q)); // Output: 10
	      return 0;
	  }
	  ```
	  :::
-
- # Advanced Usage
	- Queues are the foundational data structure behind graph traversals and scheduling algorithms:
	- **[[Breadth First Search]] (BFS)**: Uses a queue to explore nodes level-by-level (closest nodes first).
	- **CPU Task Scheduling**: Operating systems use queues to manage processes waiting for CPU time.
	- **Topological Sorting (Kahn's Algorithm)**: Uses a queue to sort a directed acyclic graph based on in-degrees.