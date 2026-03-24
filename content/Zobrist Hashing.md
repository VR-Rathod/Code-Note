# Explanation
	- **Zobrist Hashing** is a hashing technique used in computer games (like chess) to represent game states efficiently. It works by assigning a random bitstring to each possible move or position, then XORing the bitstrings together to create a unique hash for the current game state.
-
- # Steps
	- **Assign a random bitstring** to each possible position or move.
	-
	- For each move, **XOR** the corresponding bitstrings together to update the hash.
	-
	- The resulting hash represents the current game state.
-
- # Time Complexity
	- O(1) for each update or calculation, as XOR operations are constant-time.
-
- ```python
  import random
  
  class ZobristHashing:
      def __init__(self, size):
          self.size = size
          self.table = [[random.getrandbits(64) for _ in range(2)] for _ in range(size)]
          self.hash_value = 0
  
      def update(self, index, bit):
          self.hash_value ^= self.table[index][bit]
  
      def get_hash(self):
          return self.hash_value
  
  # Example usage
  zobrist = ZobristHashing(10)
  zobrist.update(3, 0)
  zobrist.update(7, 1)
  print(f"Hash Value: {zobrist.get_hash()}")
  ```