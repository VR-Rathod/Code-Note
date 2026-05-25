---
date: 2025-03-26T12:40:55+05:30
lastmod: 2026-05-22T17:59:04+05:30

seoTitle: Circular Buffer (Ring Buffer) – Fixed-Size O(1) FIFO Queue
description: "Master Circular Buffers (Ring Buffers). Learn about head/tail pointers, empty/full states, overwriting vs non-overwriting behavior, and implementations in 5 languages."
keywords: "circular buffer, ring buffer, FIFO queue, embedded systems, O(1) complexity, hardware buffer, tail pointer, head pointer, C++, Python, JavaScript, Java, C"
---

> [!info] What is a Circular Buffer?
> A **Circular Buffer** (or **Ring Buffer**) is a linear data structure that uses a single, fixed-size buffer as if it were connected end-to-end.
> It maintains two pointers (usually called `head` / `read` and `tail` / `write`) to track data stream flow. Once the write pointer reaches the end of the array, it automatically wraps around to the beginning, making it extremely memory-efficient for continuous streaming data.

- # Explanation
  collapsed:: true
	- Unlike standard queues that dynamically resize or shift memory elements (which incurs $O(N)$ overhead), a Circular Buffer preserves memory allocations by utilizing modular math to wrap index bounds.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **clock face**.
		- The hours represent storage slot locations. The hour hand could represent the **Read pointer (head)** and the minute hand (running faster) represents the **Write pointer (tail)**.
		- As time marches on, hands sweep past 12 and wrap around to 1 again, reusing the same hours without ever needing new numbers.
	-
	- ## Tracking Full vs Empty States
	  collapsed:: true
		- Since `head == tail` when the buffer is completely empty AND when it is completely full, we must use a strategy to distinguish these states:
		- 1. **Count Tracker**: Maintain a simple integer variable `count` tracking the current number of elements. (Highly readable; used in our base implementation).
		- 2. **Leave One Slot Empty**: Define the buffer as full when `(tail + 1) % capacity == head`. The maximum capacity is then `size - 1` slots, leaving 1 slot unused to avoid pointer collision ambiguity.
-
- # How It Works
  collapsed:: true
	- ## Circular Pointer Movement
	  collapsed:: true
		- Pointers move using modulo arithmetic: `index = (index + 1) % capacity`.
		- Below is a visual representation of a buffer with capacity 4:
		-
		- ```
		  Initial State (Empty):
		  [ _ , _ , _ , _ ]  -> head = 0, tail = 0, count = 0
		  
		  Enqueue 10, 20:
		  [ 10 , 20 , _ , _ ] -> head = 0, tail = 2, count = 2
		  
		  Dequeue (returns 10):
		  [ _ , 20 , _ , _ ]  -> head = 1, tail = 2, count = 1
		  
		  Enqueue 30, 40, 50 (Wrap around):
		  [ 50 , 20 , 30 , 40 ] -> head = 1, tail = 1, count = 4 (Full)
		  ```
	-
	- ## Enqueue/Dequeue Logic Flowchart
	  collapsed:: true
		- ```mermaid
		  flowchart TD
		      Q["Operation Request"]
		      Q -- "Enqueue(Val)" --> F{"Is count == capacity?"}
		      F -- Yes --> R1["❌ Fail (Buffer Full) or\n🔄 Overwrite oldest at head"]
		      F -- No --> W["Write Val at tail\ntail = (tail + 1) % capacity\ncount = count + 1"]
		      
		      Q -- "Dequeue()" --> E{"Is count == 0?"}
		      E -- Yes --> R2["❌ Fail (Buffer Empty)"]
		      E -- No --> R["Read Val at head\nhead = (head + 1) % capacity\ncount = count - 1\nReturn Val"]
		  ```
	-
	- ## Step-by-Step Algorithm
	  collapsed:: true
		- ```
		  ENQUEUE(buffer, val):
		    IF buffer.count == buffer.capacity:
		       RETURN Error ("Buffer Full")
		    buffer.data[buffer.tail] ← val
		    buffer.tail ← (buffer.tail + 1) MOD buffer.capacity
		    buffer.count ← buffer.count + 1
		    RETURN Success
		    
		  DEQUEUE(buffer):
		    IF buffer.count == 0:
		       RETURN Error ("Buffer Empty")
		    val ← buffer.data[buffer.head]
		    buffer.head ← (buffer.head + 1) MOD buffer.capacity
		    buffer.count ← buffer.count − 1
		    RETURN val
		  ```
-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > - **All operations (Enqueue, Dequeue, Peek)**: Strict **O(1)** time.
	  > - **Space Complexity**: Strict **O(N)** space where $N$ is the fixed pre-allocated capacity.
	-
	- ## Complexity Table
	  collapsed:: true
		- | Operation | Time Complexity | Space Complexity | Why |
		  |---|---|---|---|
		  | **Enqueue (Write)** | $O(1)$ | $O(1)$ auxiliary | Just writing to an array index and updating pointers. |
		  | **Dequeue (Read)** | $O(1)$ | $O(1)$ auxiliary | Direct read from array index and updating pointers. |
		  | **IsFull / IsEmpty** | $O(1)$ | $O(1)$ | Simple bounds checks on variable counters. |
		  | **Space Overhead** | — | $O(N)$ total | Pre-allocated static size prevents dynamic heap re-allocation. |
-
- # Base Implementation
  collapsed:: true
	- > [!note] Fixed-size Circular Buffer with Full/Empty Safety (Non-overwriting).
	  > Prevents writing new elements when capacity is exhausted.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  class CircularBufferBase:
	      def __init__(self, capacity: int):
	          self.capacity = capacity
	          self.buffer = [None] * capacity
	          self.head = 0  # Read pointer
	          self.tail = 0  # Write pointer
	          self.count = 0  # Element count

	      def is_full(self) -> bool:
	          return self.count == self.capacity

	      def is_empty(self) -> bool:
	          return self.count == 0

	      def enqueue(self, val) -> bool:
	          if self.is_full():
	              return False
	          self.buffer[self.tail] = val
	          self.tail = (self.tail + 1) % self.capacity
	          self.count += 1
	          return True

	      def dequeue(self):
	          if self.is_empty():
	              return None
	          val = self.buffer[self.head]
	          self.buffer[self.head] = None
	          self.head = (self.head + 1) % self.capacity
	          self.count -= 1
	          return val

	  # Example usage
	  if __name__ == "__main__":
	      cb = CircularBufferBase(3)
	      cb.enqueue(1)
	      cb.enqueue(2)
	      print(cb.enqueue(3))  # True
	      print(cb.enqueue(4))  # False (Full)
	      print(cb.dequeue())    # 1
	  ```

	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <stdexcept>

	  template <typename T>
	  class CircularBufferBase {
	  private:
	      std::vector<T> buffer;
	      int capacity;
	      int head;
	      int tail;
	      int count;

	  public:
	      CircularBufferBase(int cap) : capacity(cap), buffer(cap), head(0), tail(0), count(0) {}

	      bool isFull() const { return count == capacity; }
	      bool isEmpty() const { return count == 0; }

	      bool enqueue(const T& val) {
	          if (isFull()) return false;
	          buffer[tail] = val;
	          tail = (tail + 1) % capacity;
	          count++;
	          return true;
	      }

	      T dequeue() {
	          if (isEmpty()) {
	              throw std::underflow_error("Buffer empty");
	          }
	          T val = buffer[head];
	          head = (head + 1) % capacity;
	          count--;
	          return val;
	      }
	  };

	  int main() {
	      CircularBufferBase<int> cb(3);
	      cb.enqueue(10);
	      cb.enqueue(20);
	      std::cout << std::boolalpha << cb.enqueue(30) << "\n"; // true
	      std::cout << cb.enqueue(40) << "\n";                 // false
	      std::cout << cb.dequeue() << "\n";                   // 10
	      return 0;
	  }
	  ```

	  ```javascript
	  class CircularBufferBase {
	      constructor(capacity) {
	          this.capacity = capacity;
	          this.buffer = new Array(capacity).fill(null);
	          this.head = 0;
	          this.tail = 0;
	          this.count = 0;
	      }

	      isFull() { return this.count === this.capacity; }
	      isEmpty() { return this.count === 0; }

	      enqueue(val) {
	          if (this.isFull()) return false;
	          this.buffer[this.tail] = val;
	          this.tail = (this.tail + 1) % this.capacity;
	          this.count++;
	          return true;
	      }

	      dequeue() {
	          if (this.isEmpty()) return null;
	          const val = this.buffer[this.head];
	          this.buffer[this.head] = null;
	          this.head = (this.head + 1) % this.capacity;
	          this.count--;
	          return val;
	      }
	  }

	  // Example Usage
	  const cb = new CircularBufferBase(3);
	  cb.enqueue(1);
	  cb.enqueue(2);
	  console.log(cb.enqueue(3)); // true
	  console.log(cb.enqueue(4)); // false
	  console.log(cb.dequeue());   // 1
	  ```

	  ```java
	  public class CircularBufferBase<T> {
	      private final T[] buffer;
	      private final int capacity;
	      private int head = 0;
	      private int tail = 0;
	      private int count = 0;

	      @SuppressWarnings("unchecked")
	      public CircularBufferBase(int capacity) {
	          this.capacity = capacity;
	          this.buffer = (T[]) new Object[capacity];
	      }

	      public boolean isFull() { return count == capacity; }
	      public boolean isEmpty() { return count == 0; }

	      public boolean enqueue(T val) {
	          if (isFull()) return false;
	          buffer[tail] = val;
	          tail = (tail + 1) % capacity;
	          count++;
	          return true;
	      }

	      public T dequeue() {
	          if (isEmpty()) return null;
	          T val = buffer[head];
	          buffer[head] = null;
	          head = (head + 1) % capacity;
	          count--;
	          return val;
	      }

	      public static void main(String[] args) {
	          CircularBufferBase<Integer> cb = new CircularBufferBase<>(3);
	          cb.enqueue(1);
	          cb.enqueue(2);
	          System.out.println(cb.enqueue(3)); // true
	          System.out.println(cb.enqueue(4)); // false
	          System.out.println(cb.dequeue());   // 1
	      }
	  }
	  ```

	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  #include <stdbool.h>

	  typedef struct {
	      int* buffer;
	      int capacity;
	      int head;
	      int tail;
	      int count;
	  } CircularBufferBase;

	  CircularBufferBase* createBuffer(int capacity) {
	      CircularBufferBase* cb = (CircularBufferBase*)malloc(sizeof(CircularBufferBase));
	      cb->buffer = (int*)malloc(capacity * sizeof(int));
	      cb->capacity = capacity;
	      cb->head = 0;
	      cb->tail = 0;
	      cb->count = 0;
	      return cb;
	  }

	  bool isFull(CircularBufferBase* cb) { return cb->count == cb->capacity; }
	  bool isEmpty(CircularBufferBase* cb) { return cb->count == 0; }

	  bool enqueue(CircularBufferBase* cb, int val) {
	      if (isFull(cb)) return false;
	      cb->buffer[cb->tail] = val;
	      cb->tail = (cb->tail + 1) % cb->capacity;
	      cb->count++;
	      return true;
	  }

	  int dequeue(CircularBufferBase* cb, bool* success) {
	      if (isEmpty(cb)) {
	          if (success) *success = false;
	          return -1;
	      }
	      int val = cb->buffer[cb->head];
	      cb->head = (cb->head + 1) % cb->capacity;
	      cb->count--;
	      if (success) *success = true;
	      return val;
	  }

	  void freeBuffer(CircularBufferBase* cb) {
	      free(cb->buffer);
	      free(cb);
	  }

	  int main() {
	      CircularBufferBase* cb = createBuffer(3);
	      enqueue(cb, 1);
	      enqueue(cb, 2);
	      printf("Enqueue 3: %s\n", enqueue(cb, 3) ? "true" : "false"); // true
	      printf("Enqueue 4: %s\n", enqueue(cb, 4) ? "true" : "false"); // false
	      bool success;
	      printf("Dequeued: %d\n", dequeue(cb, &success));              // 1
	      freeBuffer(cb);
	      return 0;
	  }
	  ```

	  :::
-
- # Alternative Variant (Overwriting Circular Buffer)
  collapsed:: true
	- > [!tip] Overwriting Old Elements when Full
	  > Under the overwriting variant, if a write occurs when capacity is maxed out, the buffer **discards the oldest element** (overwrites the slot) and automatically pushes the head pointer forward.
	  > This is the standard behavior used in system logging streams, audio processing rings, and trace telemetry collection.
	-
	- :::code-tabs
	  
	  ```python
	  class CircularBufferVariant:
	      def __init__(self, capacity: int):
	          self.capacity = capacity
	          self.buffer = [None] * capacity
	          self.head = 0
	          self.tail = 0
	          self.count = 0

	      def is_full(self) -> bool: return self.count == self.capacity
	      def is_empty(self) -> bool: return self.count == 0

	      def enqueue(self, val):
	          if self.is_full():
	              # Overwrite slot and shift head forward to discard oldest element
	              self.buffer[self.tail] = val
	              self.tail = (self.tail + 1) % self.capacity
	              self.head = (self.head + 1) % self.capacity
	          else:
	              self.buffer[self.tail] = val
	              self.tail = (self.tail + 1) % self.capacity
	              self.count += 1

	      def dequeue(self):
	          if self.is_empty():
	              return None
	          val = self.buffer[self.head]
	          self.buffer[self.head] = None
	          self.head = (self.head + 1) % self.capacity
	          self.count -= 1
	          return val

	  # Example usage
	  if __name__ == "__main__":
	      cb = CircularBufferVariant(3)
	      cb.enqueue(1)
	      cb.enqueue(2)
	      cb.enqueue(3)
	      cb.enqueue(4)          # Overwrites 1. Head advances to index 1 (value 2).
	      print(cb.dequeue())    # Output: 2
	  ```

	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <stdexcept>

	  template <typename T>
	  class CircularBufferVariant {
	  private:
	      std::vector<T> buffer;
	      int capacity;
	      int head;
	      int tail;
	      int count;

	  public:
	      CircularBufferVariant(int cap) : capacity(cap), buffer(cap), head(0), tail(0), count(0) {}

	      bool isFull() const { return count == capacity; }
	      bool isEmpty() const { return count == 0; }

	      void enqueue(const T& val) {
	          if (isFull()) {
	              buffer[tail] = val;
	              tail = (tail + 1) % capacity;
	              head = (head + 1) % capacity;
	          } else {
	              buffer[tail] = val;
	              tail = (tail + 1) % capacity;
	              count++;
	          }
	      }

	      T dequeue() {
	          if (isEmpty()) {
	              throw std::underflow_error("Buffer empty");
	          }
	          T val = buffer[head];
	          head = (head + 1) % capacity;
	          count--;
	          return val;
	      }
	  };

	  int main() {
	      CircularBufferVariant<int> cb(3);
	      cb.enqueue(1);
	      cb.enqueue(2);
	      cb.enqueue(3);
	      cb.enqueue(4); // Overwrites 1
	      std::cout << cb.dequeue() << "\n"; // Output: 2
	      return 0;
	  }
	  ```

	  ```javascript
	  class CircularBufferVariant {
	      constructor(capacity) {
	          this.capacity = capacity;
	          this.buffer = new Array(capacity).fill(null);
	          this.head = 0;
	          this.tail = 0;
	          this.count = 0;
	      }

	      isFull() { return this.count === this.capacity; }
	      isEmpty() { return this.count === 0; }

	      enqueue(val) {
	          if (this.isFull()) {
	              this.buffer[this.tail] = val;
	              this.tail = (this.tail + 1) % this.capacity;
	              this.head = (this.head + 1) % this.capacity;
	          } else {
	              this.buffer[this.tail] = val;
	              this.tail = (this.tail + 1) % this.capacity;
	              this.count++;
	          }
	      }

	      dequeue() {
	          if (this.isEmpty()) return null;
	          const val = this.buffer[this.head];
	          this.buffer[this.head] = null;
	          this.head = (this.head + 1) % this.capacity;
	          this.count--;
	          return val;
	      }
	  }

	  // Example Usage
	  const cb = new CircularBufferVariant(3);
	  cb.enqueue(1);
	  cb.enqueue(2);
	  cb.enqueue(3);
	  cb.enqueue(4); // Overwrites 1
	  console.log(cb.dequeue()); // 2
	  ```

	  ```java
	  public class CircularBufferVariant<T> {
	      private final T[] buffer;
	      private final int capacity;
	      private int head = 0;
	      private int tail = 0;
	      private int count = 0;

	      @SuppressWarnings("unchecked")
	      public CircularBufferVariant(int capacity) {
	          this.capacity = capacity;
	          this.buffer = (T[]) new Object[capacity];
	      }

	      public boolean isFull() { return count == capacity; }
	      public boolean isEmpty() { return count == 0; }

	      public void enqueue(T val) {
	          if (isFull()) {
	              buffer[tail] = val;
	              tail = (tail + 1) % capacity;
	              head = (head + 1) % capacity;
	          } else {
	              buffer[tail] = val;
	              tail = (tail + 1) % capacity;
	              count++;
	          }
	      }

	      public T dequeue() {
	          if (isEmpty()) return null;
	          T val = buffer[head];
	          buffer[head] = null;
	          head = (head + 1) % capacity;
	          count--;
	          return val;
	      }

	      public static void main(String[] args) {
	          CircularBufferVariant<Integer> cb = new CircularBufferVariant<>(3);
	          cb.enqueue(1);
	          cb.enqueue(2);
	          cb.enqueue(3);
	          cb.enqueue(4); // Overwrites 1
	          System.out.println(cb.dequeue()); // 2
	      }
	  }
	  ```

	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  #include <stdbool.h>

	  typedef struct {
	      int* buffer;
	      int capacity;
	      int head;
	      int tail;
	      int count;
	  } CircularBufferVariant;

	  CircularBufferVariant* createBuffer(int capacity) {
	      CircularBufferVariant* cb = (CircularBufferVariant*)malloc(sizeof(CircularBufferVariant));
	      cb->buffer = (int*)malloc(capacity * sizeof(int));
	      cb->capacity = capacity;
	      cb->head = 0;
	      cb->tail = 0;
	      cb->count = 0;
	      return cb;
	  }

	  void enqueue(CircularBufferVariant* cb, int val) {
	      if (cb->count == cb->capacity) {
	          cb->buffer[cb->tail] = val;
	          cb->tail = (cb->tail + 1) % cb->capacity;
	          cb->head = (cb->head + 1) % cb->capacity;
	      } else {
	          cb->buffer[cb->tail] = val;
	          cb->tail = (cb->tail + 1) % cb->capacity;
	          cb->count++;
	      }
	  }

	  int dequeue(CircularBufferVariant* cb, bool* success) {
	      if (cb->count == 0) {
	          if (success) *success = false;
	          return -1;
	      }
	      int val = cb->buffer[cb->head];
	      cb->head = (cb->head + 1) % cb->capacity;
	      cb->count--;
	      if (success) *success = true;
	      return val;
	  }

	  void freeBuffer(CircularBufferVariant* cb) {
	      free(cb->buffer);
	      free(cb);
	  }

	  int main() {
	      CircularBufferVariant* cb = createBuffer(3);
	      enqueue(cb, 1);
	      enqueue(cb, 2);
	      enqueue(cb, 3);
	      enqueue(cb, 4); // Overwrites 1
	      bool success;
	      printf("Dequeued: %d\n", dequeue(cb, &success)); // Output: 2
	      freeBuffer(cb);
	      return 0;
	  }
	  ```

	  :::
-
- # When to Use Circular Buffer
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"What is the application type?"}
	      Q -- "Streaming audio/packet feeds" --> R1["✅ Use Circular Buffer\nPreallocated fixed-size ring minimizes garbage collection and latency"]
	      Q -- "Random-access search & sort" --> R2["❌ Avoid Circular Buffer\nUse standard arrays or vectors since ring indexing adds offsets"]
	      Q -- "Undetermined dynamic growing queues" --> R3["❌ Avoid Circular Buffer\nUse dynamic deques or linked nodes"]
	  ```
	-
	- ## ✅ Use Circular Buffer When
		- Working in **embedded/real-time systems** where dynamic allocation (malloc/free) is dangerous or too slow.
		- Creating **I/O stream pipelines** (e.g. keyboard stroke buffer, network packet processing queues, audio signal buffers).
		- Implementing a circular logger storing only the last 1,000 log events.
	-
	- ## ❌ Avoid Circular Buffer When
		- You need to search for values at arbitrary positions inside the queue (ring offset index makes iteration math slower than basic arrays).
		- The capacity demands are highly unpredictable, requiring frequent resizing.
-
- # Key Takeaways
  collapsed:: true
	- **Fixed space** — allocates memory blocks once during initialization; zero run-time allocation.
	- **Modulo wrapping** — uses tail and head updates bounded by `% capacity` to loop indices.
	- **Overwriting behavior** — variant enables automatic overwrites of old records under streaming pressures.
	- **O(1) Bounds** — provides absolute, predictable O(1) performance profiles ideal for hardware design.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Embedded Artistry - Ring Buffer Implementation](https://embeddedartistry.com/blog/2017/04/06/circular-buffer/)
		- [Wikipedia - Circular Buffer](https://en.wikipedia.org/wiki/Circular_buffer)