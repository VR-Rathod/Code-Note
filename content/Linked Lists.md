---
date: 2026-05-22T17:59:04+05:30
lastmod: 2026-05-22T17:59:04+05:30

seoTitle: Linked Lists Data Structure - Premium DSA Guide
description: "Master Linked Lists. Explore Singly, Doubly, and Circular linked lists. Understand pointer manipulation, operations, and implement lists in Python, C++, JavaScript, Java, and C."
keywords: "Linked List, DSA, Data Structures, Singly Linked List, Doubly Linked List, Pointer Manipulation, Node, Python, C++, Java"
---

> [!info] What is a Linked List?
> A **Linked List** is a linear data structure consisting of a sequence of elements called **Nodes**. Unlike an array, elements are not stored in contiguous memory locations. Instead, each Node contains both the **data** and a **pointer (or reference)** to the next Node in the sequence.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine a **Treasure Hunt**. You are given a starting clue (the "Head"). The clue contains a piece of information (the data) and tells you the exact physical location of the next clue (the pointer).
		- To find the 5th clue, you cannot just magically teleport to it (no $O(1)$ random access). You *must* start at clue 1, which leads to clue 2, which leads to 3, and so on.
		- However, if you want to add a new clue between clue 2 and 3, you don't have to physically move all the other clues (unlike an array). You just rewrite the location on clue 2 to point to your new clue, and make your new clue point to clue 3.
	-
	- ## Node Structure
	  collapsed:: true
		- A basic node contains two fields:
		  1. **Data/Value**: The actual information being stored.
		  2. **Next Pointer**: The memory address of the next node.
		-
		- ```mermaid
		  classDiagram
		      class Node {
		          +Data: Integer
		          +Next: Node Reference
		      }
		  ```
	-
	- ## Types of Linked Lists
	  collapsed:: true
		- ### 1. Singly Linked List
		  Each node points only to the next node. Traversal is strictly one-way (forward). The last node points to `null`.
		- ### 2. Doubly Linked List
		  Each node has **two pointers**: one pointing to the next node, and one pointing to the previous node. This allows for traversal in both directions, making deletions easier but requiring more memory.
		- ### 3. Circular Linked List
		  The last node's `next` pointer points back to the `Head` (first node) instead of `null`, creating a continuous loop. Used in round-robin scheduling algorithms.

- # How It Works (Operations)
  collapsed:: true
	- ## Insertion
	  collapsed:: true
		- Inserting at the beginning (Head) is $O(1)$.
		- Inserting at the end is $O(N)$ unless you maintain a `Tail` pointer, in which case it is $O(1)$.
		-
		- **Inserting a new node "C" between "A" and "B":**
		- ```mermaid
		  flowchart LR
		      A["Node A\nNext: B"] -->|Old Pointer| B["Node B\nNext: null"]
		      
		      A -.->|Step 1: Point to C| C["New Node C\nNext: B"]
		      C -.->|Step 2: Point to B| B
		  ```
	-
	- ## Deletion
	  collapsed:: true
		- To delete a node, you simply change the pointer of the *previous* node to point to the node *after* the one you want to delete. The deleted node is then cleaned up by the garbage collector (or manually freed in C/C++).

- # Time & Space Complexity
  collapsed:: true
	- > [!important] Arrays vs Linked Lists
	  > Linked Lists excel at **dynamic sizing** and **fast insertions/deletions** (if the node is already found), but fail at **random access**. Arrays excel at fast access but suffer when resizing or inserting in the middle.
	-
	- | Operation | Singly Linked List | Array | Explanation |
	  |-----------|--------------------|-------|-------------|
	  | **Access (Index)** | $O(N)$ | $O(1)$ | Must traverse from the head node step-by-step. |
	  | **Search (Value)** | $O(N)$ | $O(N)$ | Must check every node. |
	  | **Insert (Head)** | $O(1)$ | $O(N)$ | Just update the head pointer. Array requires shifting. |
	  | **Insert (Tail)** | $O(N)$ (or $O(1)$ w/ Tail) | $O(1)$ | Depends on if a tail pointer is maintained. |
	  | **Space Complexity** | $O(N)$ | $O(N)$ | Requires extra space for pointers compared to arrays. |

- # Implementation
  collapsed:: true
	- > [!note] Building a Singly Linked List
	  > Below is a complete implementation of a Singly Linked List featuring `append()`, `prepend()`, and `print()` operations.
	-
	- :::code-tabs
	  
	  ```python
	  class Node:
	      def __init__(self, data):
	          self.data = data
	          self.next = None
	  
	  class LinkedList:
	      def __init__(self):
	          self.head = None
	  
	      def append(self, data):
	          new_node = Node(data)
	          if not self.head:
	              self.head = new_node
	              return
	          
	          # Traverse to the end
	          last = self.head
	          while last.next:
	              last = last.next
	          last.next = new_node
	  
	      def prepend(self, data):
	          new_node = Node(data)
	          new_node.next = self.head
	          self.head = new_node
	          
	      def display(self):
	          current = self.head
	          while current:
	              print(current.data, end=" -> ")
	              current = current.next
	          print("None")
	  
	  # Usage
	  ll = LinkedList()
	  ll.append(10)
	  ll.append(20)
	  ll.prepend(5)
	  ll.display() # Output: 5 -> 10 -> 20 -> None
	  ```
	  
	  ```cpp
	  #include <iostream>
	  
	  struct Node {
	      int data;
	      Node* next;
	      Node(int val) : data(val), next(nullptr) {}
	  };
	  
	  class LinkedList {
	  private:
	      Node* head;
	  public:
	      LinkedList() : head(nullptr) {}
	      
	      void append(int data) {
	          Node* newNode = new Node(data);
	          if (!head) {
	              head = newNode;
	              return;
	          }
	          Node* last = head;
	          while (last->next) {
	              last = last->next;
	          }
	          last->next = newNode;
	      }
	      
	      void prepend(int data) {
	          Node* newNode = new Node(data);
	          newNode->next = head;
	          head = newNode;
	      }
	      
	      void display() {
	          Node* current = head;
	          while (current) {
	              std::cout << current->data << " -> ";
	              current = current->next;
	          }
	          std::cout << "nullptr" << std::endl;
	      }
	      
	      ~LinkedList() {
	          Node* current = head;
	          while (current) {
	              Node* next = current->next;
	              delete current;
	              current = next;
	          }
	      }
	  };
	  
	  int main() {
	      LinkedList ll;
	      ll.append(10);
	      ll.append(20);
	      ll.prepend(5);
	      ll.display(); // Output: 5 -> 10 -> 20 -> nullptr
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
	  
	  class LinkedList {
	      constructor() {
	          this.head = null;
	      }
	  
	      append(data) {
	          const newNode = new Node(data);
	          if (!this.head) {
	              this.head = newNode;
	              return;
	          }
	          let last = this.head;
	          while (last.next) {
	              last = last.next;
	          }
	          last.next = newNode;
	      }
	  
	      prepend(data) {
	          const newNode = new Node(data);
	          newNode.next = this.head;
	          this.head = newNode;
	      }
	  
	      display() {
	          let current = this.head;
	          let res = [];
	          while (current) {
	              res.push(current.data);
	              current = current.next;
	          }
	          console.log(res.join(" -> ") + " -> null");
	      }
	  }
	  
	  // Usage
	  const ll = new LinkedList();
	  ll.append(10);
	  ll.append(20);
	  ll.prepend(5);
	  ll.display(); // Output: 5 -> 10 -> 20 -> null
	  ```
	  
	  ```java
	  class Node {
	      int data;
	      Node next;
	      Node(int data) {
	          this.data = data;
	          this.next = null;
	      }
	  }
	  
	  public class LinkedList {
	      private Node head;
	      
	      public void append(int data) {
	          Node newNode = new Node(data);
	          if (head == null) {
	              head = newNode;
	              return;
	          }
	          Node last = head;
	          while (last.next != null) {
	              last = last.next;
	          }
	          last.next = newNode;
	      }
	      
	      public void prepend(int data) {
	          Node newNode = new Node(data);
	          newNode.next = head;
	          head = newNode;
	      }
	      
	      public void display() {
	          Node current = head;
	          while (current != null) {
	              System.out.print(current.data + " -> ");
	              current = current.next;
	          }
	          System.out.println("null");
	      }
	      
	      public static void main(String[] args) {
	          LinkedList ll = new LinkedList();
	          ll.append(10);
	          ll.append(20);
	          ll.prepend(5);
	          ll.display(); // Output: 5 -> 10 -> 20 -> null
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
	  
	  struct Node* createNode(int data) {
	      struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
	      newNode->data = data;
	      newNode->next = NULL;
	      return newNode;
	  }
	  
	  void append(struct Node** head_ref, int data) {
	      struct Node* newNode = createNode(data);
	      if (*head_ref == NULL) {
	          *head_ref = newNode;
	          return;
	      }
	      struct Node* last = *head_ref;
	      while (last->next != NULL) {
	          last = last->next;
	      }
	      last->next = newNode;
	  }
	  
	  void prepend(struct Node** head_ref, int data) {
	      struct Node* newNode = createNode(data);
	      newNode->next = *head_ref;
	      *head_ref = newNode;
	  }
	  
	  void display(struct Node* node) {
	      while (node != NULL) {
	          printf("%d -> ", node->data);
	          node = node->next;
	      }
	      printf("NULL\n");
	  }
	  
	  int main() {
	      struct Node* head = NULL;
	      append(&head, 10);
	      append(&head, 20);
	      prepend(&head, 5);
	      display(head); // Output: 5 -> 10 -> 20 -> NULL
	      return 0;
	  }
	  ```
	  :::
-
- # Advanced Linked List Algorithms
	- When dealing with linked lists in technical interviews, you often cannot use extra array space. This leads to two critical algorithms:
	- [[Floyd Cycle Detection Algorithm]] - Also known as the **Tortoise and Hare**. Uses two pointers moving at different speeds to detect cycles or find the middle node.
	- **Fast & Slow Pointers** - Useful for finding the Nth node from the end in one pass.
