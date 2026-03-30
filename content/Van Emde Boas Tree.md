---
seoTitle: Van Emde Boas Tree – O(log log u) Integer Priority Queue
description: "Van Emde Boas trees support integer operations in O(log log u) time. Covers recursive structure, universe size, successor/predecessor queries, and memory."
keywords: "Van Emde Boas tree, vEB tree, O(log log u), integer priority queue, successor query, predecessor query, universe size, time complexity, space complexity, data structure"
---

- # Explanation
	- A **Van Emde Boas Tree** is a data structure that supports **efficient priority queue** operations.
	-
	- It works for integer keys in a specific range and allows operations like **insert**, **delete**, and **minimum** in O(log log n) time.
-
- # Steps
	- The tree uses recursive structure and recursive splitting of the universe to maintain fast operations.
	-
	- It supports operations on a fixed-size universe (e.g., 0 to 1000).
-
- # Time Complexity
	- **Insert/Delete/Min**: O(log log n)
-
- ```python
  class VanEmdeBoasTree:
      def __init__(self, universe_size):
          self.universe_size = universe_size
          self.tree = [None] * (universe_size + 1)
      
      def insert(self, key):
          # Insert operation
          pass
  
  # Example usage
  veb_tree = VanEmdeBoasTree(1000)
  veb_tree.insert(10)
  ```