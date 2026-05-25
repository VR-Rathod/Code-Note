---
date: 2026-05-22T17:59:04+05:30
lastmod: 2026-05-22T17:59:04+05:30

seoTitle: Arrays Data Structure - Comprehensive DSA Guide
description: "Master Arrays in Data Structures & Algorithms. Learn about static vs dynamic arrays, memory contiguity, amortized time complexity, and implement dynamic arrays in multiple languages."
keywords: "Arrays, DSA, Data Structures, Dynamic Array, Static Array, Amortized Time Complexity, Memory Contiguity, C++ Vector, Java ArrayList, Python List"
---

> [!info] What is an Array?
> An **Array** is a linear data structure that stores a collection of elements of the same type in **contiguous memory locations**. Because the items are stored sequentially side-by-side in memory, arrays allow extremely fast $O(1)$ random access to any element using its index.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine a row of numbered lockers in a school hallway.
		- If you know that John's locker is locker No.5, you don't have to open lockers 1, 2, 3, and 4 to find it. You can walk straight to locker No.5 and open it instantly.
		- This is exactly how an array works. Because the computer knows exactly where the "first locker" is in memory, and it knows the size of each locker, it can calculate the exact memory address of locker No.5 using simple math, resulting in instant access.
	-
	- ## Static vs Dynamic Arrays
	  collapsed:: true
		- ### Static Arrays
		  A static array has a **fixed size** determined at the time of its creation. If you create an array of size 5, it can only hold 5 elements. If you need a 6th element, you are out of luck.
		  *Example: Standard arrays in C, C++, and Java (e.g., `int arr[5];`).*
		- ### Dynamic Arrays
		  A dynamic array can **resize itself automatically** when it gets full. Under the hood, it is still a static array. When it reaches capacity, it creates a brand new, larger static array (usually double the size), copies all the old elements over, and then adds the new element.
		  *Example: `list` in Python, `std::vector` in C++, `ArrayList` in Java, `Array` in JavaScript.*
	-
	- ## Memory Contiguity & Cache Locality
	  collapsed:: true
		- The most powerful feature of an array is **Cache Locality**.
		- When a CPU reads a variable from RAM, it doesn't just read that one variable. It reads a whole "block" of memory (a cache line) into its ultra-fast L1/L2 cache.
		- Because array elements are exactly next to each other, accessing `array[0]` automatically loads `array[1]`, `array[2]`, etc., into the CPU cache. This makes iterating over an array significantly faster in practice than iterating over a Linked List, even though both are mathematically $O(N)$ time.
-
- # How It Works (Dynamic Resizing)
  collapsed:: true
	- ## The Resizing Process
	  collapsed:: true
		- 1. A dynamic array starts with a fixed capacity (e.g., 2).
		- 2. As you append elements, the `size` increases.
		- 3. When `size == capacity`, the array is completely full.
		- 4. A new array is allocated in memory with `capacity * 2`.
		- 5. The old elements are copied into the new array.
		- 6. The new element is appended, and the old array is deleted from memory.
		-
		- ```mermaid
		  flowchart TD
		      A["[ 10, 20 ]\nSize: 2 | Cap: 2"] -->|Append 30| B{"Is Size == Cap?"}
		      B -- Yes --> C["Allocate New Array\nCap: 4"]
		      C --> D["Copy Old Elements\n[ 10, 20, _, _ ]"]
		      D --> E["Insert New Element\n[ 10, 20, 30, _ ]"]
		      E --> F["Size: 3 | Cap: 4"]
		  ```
-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > Arrays provide fast access but slow insertions/deletions at the front or middle.
	-
	- | Operation | Best Case | Worst Case | Average/Amortized | Explanation |
	  |-----------|-----------|------------|-------------------|-------------|
	  | **Access (Index)** | $O(1)$ | $O(1)$ | $O(1)$ | Direct memory address calculation. |
	  | **Search (Value)** | $O(1)$ | $O(N)$ | $O(N)$ | Must check every element sequentially (unless sorted). |
	  | **Insert (End)** | $O(1)$ | $O(N)$ | $O(1)$ **Amortized** | Usually $O(1)$, but $O(N)$ when resizing occurs. |
	  | **Insert/Delete (Middle)** | $O(1)$ | $O(N)$ | $O(N)$ | Must shift all subsequent elements to the right/left. |
	  | **Space Complexity** | $O(N)$ | $O(N)$ | $O(N)$ | Requires continuous block of memory. |
	-
	- ## Amortized Analysis of Dynamic Arrays
	  collapsed:: true
		- Why is appending to a dynamic array considered $O(1)$ time if resizing takes $O(N)$ time?
		- If we double the capacity every time we resize, the expensive $O(N)$ operation happens very rarely.
		- To append $N$ elements, the number of copies made during resizing is: $1 + 2 + 4 + 8 + \dots + \frac{N}{2} \approx N$.
		- Since we do $N$ total copies for $N$ appends, the average (amortized) cost per append is $\frac{N}{N} = 1$, which is $O(1)$.
-
- # Implementation
	- > [!note] Building a Dynamic Array from Scratch
	  > Below is how you would implement a dynamic array (like `std::vector` or `ArrayList`) under the hood using native arrays and memory management.
	-
	- :::code-tabs
	  
	  ```python
	  import ctypes
	  
	  class DynamicArray:
	      def __init__(self):
	          self.n = 0        # Count of actual elements
	          self.capacity = 1 # Default array capacity
	          self.A = self._make_array(self.capacity)
	          
	      def __len__(self):
	          return self.n
	          
	      def __getitem__(self, k):
	          if not 0 <= k < self.n:
	              raise IndexError('invalid index')
	          return self.A[k]
	          
	      def append(self, obj):
	          # If full, double the capacity
	          if self.n == self.capacity:
	              self._resize(2 * self.capacity)
	          self.A[self.n] = obj
	          self.n += 1
	          
	      def _resize(self, new_cap):
	          # Allocate new, bigger array
	          B = self._make_array(new_cap)
	          # Copy existing elements
	          for k in range(self.n):
	              B[k] = self.A[k]
	          self.A = B
	          self.capacity = new_cap
	          
	      def _make_array(self, new_cap):
	          # Returns a low-level C array using the ctypes module
	          return (new_cap * ctypes.py_object)()
	  
	  # Usage
	  arr = DynamicArray()
	  arr.append(10)
	  arr.append(20) # Resizes internally
	  print(arr[0], arr[1])
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <stdexcept>
	  
	  template <typename T>
	  class DynamicArray {
	  private:
	      T* arr;
	      int capacity;
	      int size;
	  
	  public:
	      DynamicArray() {
	          capacity = 1;
	          size = 0;
	          arr = new T[capacity];
	      }
	      
	      ~DynamicArray() {
	          delete[] arr;
	      }
	  
	      void push_back(T data) {
	          // If array is full, double its capacity
	          if (size == capacity) {
	              T* temp = new T[2 * capacity];
	              for (int i = 0; i < capacity; i++) {
	                  temp[i] = arr[i];
	              }
	              delete[] arr;
	              capacity *= 2;
	              arr = temp;
	          }
	          arr[size] = data;
	          size++;
	      }
	  
	      T get(int index) {
	          if (index < 0 || index >= size) {
	              throw std::out_of_range("Index out of bounds");
	          }
	          return arr[index];
	      }
	      
	      int getSize() { return size; }
	      int getCapacity() { return capacity; }
	  };
	  
	  int main() {
	      DynamicArray<int> arr;
	      arr.push_back(10);
	      arr.push_back(20);
	      std::cout << "Element at 0: " << arr.get(0) << std::endl;
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class DynamicArray {
	      constructor() {
	          this.length = 0;
	          this.capacity = 1;
	          this.data = new Array(this.capacity);
	      }
	  
	      get(index) {
	          if (index < 0 || index >= this.length) {
	              throw new Error("Index out of bounds");
	          }
	          return this.data[index];
	      }
	  
	      push(item) {
	          if (this.length === this.capacity) {
	              this._resize(this.capacity * 2);
	          }
	          this.data[this.length] = item;
	          this.length++;
	      }
	  
	      _resize(newCapacity) {
	          const newData = new Array(newCapacity);
	          for (let i = 0; i < this.length; i++) {
	              newData[i] = this.data[i];
	          }
	          this.data = newData;
	          this.capacity = newCapacity;
	      }
	  }
	  
	  // Usage
	  const arr = new DynamicArray();
	  arr.push(10);
	  arr.push(20);
	  console.log(arr.get(0), arr.get(1));
	  ```
	  
	  ```java
	  public class DynamicArray<T> {
	      private Object[] data;
	      private int size;
	      private int capacity;
	  
	      public DynamicArray() {
	          this.capacity = 1;
	          this.size = 0;
	          this.data = new Object[capacity];
	      }
	  
	      public void add(T element) {
	          if (size == capacity) {
	              resize(2 * capacity);
	          }
	          data[size] = element;
	          size++;
	      }
	  
	      @SuppressWarnings("unchecked")
	      public T get(int index) {
	          if (index < 0 || index >= size) {
	              throw new IndexOutOfBoundsException("Index out of bounds");
	          }
	          return (T) data[index];
	      }
	  
	      private void resize(int newCapacity) {
	          Object[] newData = new Object[newCapacity];
	          for (int i = 0; i < size; i++) {
	              newData[i] = data[i];
	          }
	          data = newData;
	          capacity = newCapacity;
	      }
	  
	      public static void main(String[] args) {
	          DynamicArray<Integer> arr = new DynamicArray<>();
	          arr.add(10);
	          arr.add(20);
	          System.out.println(arr.get(0));
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  
	  typedef struct {
	      int *array;
	      size_t size;
	      size_t capacity;
	  } DynamicArray;
	  
	  void initArray(DynamicArray *a, size_t initialCapacity) {
	      a->array = (int *)malloc(initialCapacity * sizeof(int));
	      a->size = 0;
	      a->capacity = initialCapacity;
	  }
	  
	  void insertArray(DynamicArray *a, int element) {
	      if (a->size == a->capacity) {
	          a->capacity *= 2;
	          a->array = (int *)realloc(a->array, a->capacity * sizeof(int));
	      }
	      a->array[a->size++] = element;
	  }
	  
	  void freeArray(DynamicArray *a) {
	      free(a->array);
	      a->array = NULL;
	      a->size = a->capacity = 0;
	  }
	  
	  int main() {
	      DynamicArray arr;
	      initArray(&arr, 1);  // initially 1 element
	      
	      insertArray(&arr, 10);
	      insertArray(&arr, 20); // Automatically resizes
	      
	      printf("Element at 0: %d\n", arr.array[0]);
	      printf("Element at 1: %d\n", arr.array[1]);
	      
	      freeArray(&arr);
	      return 0;
	  }
	  ```
	  :::
-
- # Common Array Algorithms
	- Mastering arrays unlocks numerous algorithmic techniques detailed heavily in the algorithms sections:
	- [[Kadanes Algorithm]] - Maximum Subarray Sum
	- [[Boyer-More Majority Vote]] - Finding majority elements
	- [[Sliding Window Technique]] - Analyzing sub-arrays of fixed length
	- [[Two Pointers Technique]] - Used on sorted arrays for finding pairs
	- [[Prefix Sum Array]] - Extremely fast range sum queries