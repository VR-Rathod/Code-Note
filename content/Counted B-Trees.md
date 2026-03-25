---
seoTitle: Counted B-Trees Explained – Order Statistics in B-Tree Nodes
description: "Counted B-trees augment B-trees with subtree size counts for order statistics. Covers rank and select operations, augmented tree, O(log n) queries, and."
keywords: "counted B-tree, augmented B-tree, order statistics, rank query, select query, O(log n), database index, time complexity, space complexity, balanced tree, data structure"
---

#### Explanation:
	- A **Counted B-Tree** is a variant of the B-tree where each node additionally stores the count of the number of elements in the subtree.
	-
	- This allows for efficient range queries, such as finding the k-th smallest element or computing the number of elements less than a given value.
-
- # Steps:
	- **Insertion**: Insert elements while maintaining the B-tree structure and update the counts.
	-
	- **Querying**: Use the stored counts to answer range queries efficiently.
-
- # Time Complexity:
	- **Insertion**: O(log n)
	- **Querying**: O(log n)
-
- ```python
  class CountedBTreeNode:
      def __init__(self):
          self.keys = []
          self.children = []
          self.count = 0
  
  class CountedBTree:
      def __init__(self):
          self.root = None
      
      def insert(self, key):
          # Insert and update count
          pass
  
  # Example usage
  counted_btree = CountedBTree()
  counted_btree.insert(5)
  counted_btree.insert(10)
  ```