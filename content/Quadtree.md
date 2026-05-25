---
date: 2025-03-26T12:40:55+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Quadtree Explained – 2D Spatial Partitioning Data Structure
description: "Quadtrees recursively subdivide 2D space into four quadrants for spatial queries. Covers point quadtree, region quadtree, nearest neighbor search, and game."
keywords: "quadtree, spatial partitioning, 2D space, point quadtree, region quadtree, nearest neighbor, collision detection, time complexity, space complexity, game development"
---

- # Explanation:
	- A **Quadtree** is a tree data structure used to partition a two-dimensional space by recursively subdividing it into four quadrants or regions.
	-
	- It is particularly useful in applications such as image processing, spatial indexing, and computer graphics.
-
- # Steps:
	- The space is recursively divided into four quadrants until a predefined condition is met (such as a maximum number of points in a quadrant or a minimum size of the region).
	-
	- Each node in the tree represents a quadrant, and each child node corresponds to a subdivision of the parent quadrant.
-
- # Time Complexity:
	- **Insertion**: O(log n) for balanced trees, or O(n) in the worst case if all points are in the same quadrant.
	- **Querying**: O(log n) for searching in balanced structures.
-
- ```python
  class QuadtreeNode:
      def __init__(self, x, y, value):
          self.x = x
          self.y = y
          self.value = value
          self.nw = self.ne = self.sw = self.se = None
  
  class Quadtree:
      def __init__(self, x_min, x_max, y_min, y_max):
          self.boundary = (x_min, x_max, y_min, y_max)
          self.root = None
  
      def insert(self, node, x, y, value):
          if node is None:
              return QuadtreeNode(x, y, value)
          if x < node.x:
              if y < node.y:
                  node.sw = self.insert(node.sw, x, y, value)
              else:
                  node.nw = self.insert(node.nw, x, y, value)
          else:
              if y < node.y:
                  node.se = self.insert(node.se, x, y, value)
              else:
                  node.ne = self.insert(node.ne, x, y, value)
          return node
  
      def add(self, x, y, value):
          self.root = self.insert(self.root, x, y, value)
  
      def search(self, node, x, y):
          if node is None:
              return None
          if node.x == x and node.y == y:
              return node
          if x < node.x:
              if y < node.y:
                  return self.search(node.sw, x, y)
              else:
                  return self.search(node.nw, x, y)
          else:
              if y < node.y:
                  return self.search(node.se, x, y)
              else:
                  return self.search(node.ne, x, y)
  
  # Example usage
  quadtree = Quadtree(0, 10, 0, 10)
  quadtree.add(1, 1, "A")
  quadtree.add(2, 3, "B")
  
  node = quadtree.search(quadtree.root, 1, 1)
  if node:
      print(f"Found point: {node.value}")
  else:
      print("Point not found")
  ```