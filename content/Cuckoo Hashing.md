# Explanation
	- **Cuckoo Hashing** is a hash table algorithm that resolves collisions using two hash functions. If an item collides at one position, it is "kicked out" and reinserted into another position using a second hash function.
-
- # Steps
	- **Insert an element** using the first hash function.
	-
	- If the spot is occupied, **evict the existing element** and insert it using the second hash function.
	-
	- Repeat until the element is inserted without further eviction.
-
- # Time Complexity
	- **Time complexity**: O(1) average for insertion and look-up.
-
- ```python
  class CuckooHashing:
      def __init__(self, size):
          self.size = size
          self.table1 = [None] * size
          self.table2 = [None] * size
  
      def hash1(self, key):
          return hash(key) % self.size
  
      def hash2(self, key):
          return (hash(key) * 2) % self.size
  
      def insert(self, key):
          pos1 = self.hash1(key)
          if self.table1[pos1] is None:
              self.table1[pos1] = key
          else:
              evicted = self.table1[pos1]
              self.table1[pos1] = key
              self.insert_in_table2(evicted)
  
      def insert_in_table2(self, key):
          pos2 = self.hash2(key)
          if self.table2[pos2] is None:
              self.table2[pos2] = key
          else:
              evicted = self.table2[pos2]
              self.table2[pos2] = key
              self.insert(evicted)
  
  # Example usage
  cuckoo = CuckooHashing(10)
  cuckoo.insert("hello")
  cuckoo.insert("world")
  ```