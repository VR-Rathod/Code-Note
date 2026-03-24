# Explanation
	- A **Bloom Filter** is a space-efficient probabilistic data structure used to test whether an element is a member of a set. It can produce false positives but never false negatives.
-
- # Steps
	- **Hash the element** using multiple hash functions.
	- **Set bits** at the positions returned by the hash functions.
	- **Query**: Check if all bits corresponding to the hash values are set. If yes, the element is possibly in the set; otherwise, it’s definitely not.
-
- # Time Complexity
	- O(k) for insertions and queries, where `k` is the number of hash functions.
-
- ```python
  from bitarray import bitarray
  import hashlib
  
  class BloomFilter:
      def __init__(self, size, num_hashes):
          self.size = size
          self.num_hashes = num_hashes
          self.bit_array = bitarray(size)
          self.bit_array.setall(0)
      
      def _hash(self, item, i):
          return int(hashlib.md5(f"{item}{i}".encode()).hexdigest(), 16) % self.size
      
      def insert(self, item):
          for i in range(self.num_hashes):
              idx = self._hash(item, i)
              self.bit_array[idx] = 1
      
      def query(self, item):
          return all(self.bit_array[self._hash(item, i)] for i in range(self.num_hashes))
  
  # Example usage
  bf = BloomFilter(1000, 3)
  bf.insert("apple")
  print(bf.query("apple"))  # True
  print(bf.query("banana"))  # False
  ```