# Explanation
	- A **Circular Buffer** is a data structure that works like a fixed-size queue, but it "wraps around" once it reaches the end, making it ideal for situations where a continuous stream of data must be processed, such as in real-time systems or buffering.
-
- # Steps
	- **Initialize the buffer** with a fixed size.
	-
	- **Add data** to the buffer and keep track of the current position (write pointer).
	-
	- When the buffer reaches its end, **wrap around** to the beginning.
	-
	- **Read data** from the buffer by maintaining a separate read pointer.
-
- # Time Complexity
	- **Insertion**: O(1)
	- **Deletion**: O(1)
-
- ```python
  class CircularBuffer:
      def __init__(self, size):
          self.size = size
          self.buffer = [None] * size
          self.write_ptr = 0
          self.read_ptr = 0
      
      def write(self, value):
          self.buffer[self.write_ptr] = value
          self.write_ptr = (self.write_ptr + 1) % self.size
      
      def read(self):
          value = self.buffer[self.read_ptr]
          self.read_ptr = (self.read_ptr + 1) % self.size
          return value
  
  # Example usage
  cb = CircularBuffer(5)
  cb.write(1)
  cb.write(2)
  print(cb.read())  # Outputs: 1
  ```