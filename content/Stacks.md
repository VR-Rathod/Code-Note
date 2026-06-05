---
seoTitle: Stacks Data Structure - Premium DSA Guide
description: "Master the Stack data structure. Learn the LIFO principle, push/pop operations, and how to implement stacks using Arrays and Linked Lists in multiple languages."
keywords: "Stack, LIFO, Data Structures, DSA, Push, Pop, Monotonic Stack, Array Stack, Linked List Stack, Depth First Search"
treeTitle: DSA - Linear Data Structures - Stacks
---

> [!info] What is a Stack?
> A **Stack** is a linear data structure that follows the **LIFO (Last In, First Out)** principle. The element that is inserted last is the first one to be removed. It is an abstract data type that can be implemented using either an Array or a Linked List.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine a **stack of plates** at a buffet.
		- When the dishwasher brings out clean plates, they put the new plates on the **top** of the stack.
		- When a customer wants a plate, they take one from the **top** of the stack.
		- You cannot easily take a plate from the bottom without causing a disaster. The *last* plate added to the stack is the *first* one taken off (**LIFO**).
	-
	- ## Core Operations
	  collapsed:: true
		- Stacks have three primary operations, all of which operate in $O(1)$ time:
		- 1. **Push**: Add an item to the top of the stack.
		- 2. **Pop**: Remove and return the item from the top of the stack.
		- 3. **Peek / Top**: Return the item at the top without removing it.
		-
		- ```mermaid
		  flowchart TD
		      subgraph Stack Operations
		      A[Top of Stack] --> B[Element 3]
		      B --> C[Element 2]
		      C --> D[Element 1]
		      
		      Push[Push New Element] -.->|Adds to Top| A
		      Pop[Pop Element] -.->|Removes from Top| B
		      end
		  ```
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Why use a Stack?
	  > Stacks are used whenever you need to reverse things, track state, or implement backtracking (like in the "Undo" button of a text editor, or matching parentheses in a compiler).
	-
	- | Operation | Time Complexity | Space Complexity |
	  |-----------|-----------------|------------------|
	  | **Push** | $O(1)$ | $O(1)$ per element |
	  | **Pop** | $O(1)$ | $O(1)$ |
	  | **Peek / Top**| $O(1)$ | $O(1)$ |
- # Implementation
  collapsed:: true
	- > [!note] Stack Implementations
	  > While most modern languages have built-in stacks (e.g., Python lists, C++ `std::stack`), it is crucial to understand how to build them from scratch. Below is an array-based stack implementation.
	-
	- :::code-tabs
	  
	  ```python
	  class Stack:
	      def __init__(self):
	          self.stack = []
	          
	      def is_empty(self):
	          return len(self.stack) == 0
	          
	      def push(self, item):
	          self.stack.append(item)
	          
	      def pop(self):
	          if self.is_empty():
	              raise Exception("Stack Underflow")
	          return self.stack.pop()
	          
	      def peek(self):
	          if self.is_empty():
	              raise Exception("Stack is empty")
	          return self.stack[-1]
	  
	  # Usage
	  s = Stack()
	  s.push(10)
	  s.push(20)
	  print(s.pop()) # Output: 20
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <stdexcept>
	  #define MAX 1000
	  
	  class Stack {
	      int top;
	      int arr[MAX]; // Array-based implementation
	  
	  public:
	      Stack() { top = -1; }
	      
	      bool isEmpty() { return (top < 0); }
	      
	      void push(int x) {
	          if (top >= (MAX - 1)) {
	              throw std::overflow_error("Stack Overflow");
	          }
	          arr[++top] = x;
	      }
	      
	      int pop() {
	          if (top < 0) {
	              throw std::underflow_error("Stack Underflow");
	          }
	          return arr[top--];
	      }
	      
	      int peek() {
	          if (top < 0) {
	              throw std::underflow_error("Stack is empty");
	          }
	          return arr[top];
	      }
	  };
	  
	  int main() {
	      Stack s;
	      s.push(10);
	      s.push(20);
	      std::cout << s.pop() << std::endl; // Output: 20
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class Stack {
	      constructor() {
	          this.items = [];
	      }
	  
	      isEmpty() {
	          return this.items.length === 0;
	      }
	  
	      push(element) {
	          this.items.push(element);
	      }
	  
	      pop() {
	          if (this.isEmpty()) {
	              throw new Error("Stack Underflow");
	          }
	          return this.items.pop();
	      }
	  
	      peek() {
	          if (this.isEmpty()) {
	              throw new Error("Stack is empty");
	          }
	          return this.items[this.items.length - 1];
	      }
	  }
	  
	  // Usage
	  const s = new Stack();
	  s.push(10);
	  s.push(20);
	  console.log(s.pop()); // Output: 20
	  ```
	  
	  ```java
	  class Stack {
	      private static final int MAX = 1000;
	      private int top;
	      private int[] arr = new int[MAX];
	  
	      Stack() {
	          top = -1;
	      }
	  
	      boolean isEmpty() {
	          return (top < 0);
	      }
	  
	      void push(int x) {
	          if (top >= (MAX - 1)) {
	              throw new StackOverflowError("Stack Overflow");
	          }
	          arr[++top] = x;
	      }
	  
	      int pop() {
	          if (top < 0) {
	              throw new RuntimeException("Stack Underflow");
	          }
	          return arr[top--];
	      }
	  
	      int peek() {
	          if (top < 0) {
	              throw new RuntimeException("Stack is empty");
	          }
	          return arr[top];
	      }
	  
	      public static void main(String args[]) {
	          Stack s = new Stack();
	          s.push(10);
	          s.push(20);
	          System.out.println(s.pop()); // Output: 20
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  #define MAX 1000
	  
	  struct Stack {
	      int top;
	      int arr[MAX];
	  };
	  
	  void initStack(struct Stack* s) {
	      s->top = -1;
	  }
	  
	  int isEmpty(struct Stack* s) {
	      return s->top == -1;
	  }
	  
	  void push(struct Stack* s, int item) {
	      if (s->top >= MAX - 1) {
	          printf("Stack Overflow\n");
	          return;
	      }
	      s->arr[++(s->top)] = item;
	  }
	  
	  int pop(struct Stack* s) {
	      if (isEmpty(s)) {
	          printf("Stack Underflow\n");
	          exit(EXIT_FAILURE);
	      }
	      return s->arr[(s->top)--];
	  }
	  
	  int peek(struct Stack* s) {
	      if (isEmpty(s)) {
	          printf("Stack is empty\n");
	          exit(EXIT_FAILURE);
	      }
	      return s->arr[s->top];
	  }
	  
	  int main() {
	      struct Stack s;
	      initStack(&s);
	      push(&s, 10);
	      push(&s, 20);
	      printf("%d\n", pop(&s)); // Output: 20
	      return 0;
	  }
	  ```
	  :::
-
- # Advanced Usage
	- Stacks are the backbone of many advanced algorithms. You will see them heavily used in:
	- **[[Depth First Search]] (DFS)**: Uses a stack (either the call stack via recursion, or an explicit stack data structure) to explore graph nodes.
	- **Monotonic Stacks**: A stack that is strictly increasing or strictly decreasing. Used to solve "Next Greater Element" problems in $O(N)$ time.
	- **Syntax Parsing**: Parentheses matching and evaluating postfix notation equations.