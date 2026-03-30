---
seoTitle: Quickhull Algorithm – Convex Hull via Divide and Conquer
description: "Quickhull finds the convex hull by recursively finding the farthest point from each edge. Covers O(n log n) average, O(n^2) worst case, and comparison with."
keywords: "Quickhull, convex hull, divide and conquer, computational geometry, farthest point, O(n log n), time complexity, space complexity, point set, geometric algorithm"
---

- # Explanation
	- **Quickhull Algorithm** is a divide and conquer approach for finding the convex hull of a set of points. It works by selecting the two extreme points (leftmost and rightmost), and then recursively dividing the set of points into two subsets (one on the left and one on the right) and finding the convex hull for each subset.
-
- # Steps
	- **Find the leftmost** and **rightmost** points from the set of points.
	-
	- **Divide the points** into two sets: one on the left of the line formed by the leftmost and rightmost points, and one on the right.
	-
	- **Recursively find** the convex hull for each subset by finding the farthest point from the line and forming new sub-problems.
	-
	- **Combine** the results to form the complete convex hull.
-
- # Time Complexity
	- O(n log n) on average, where `n` is the number of points. However, in the worst case, it can be O(n²).
-
- ```python
  def cross(o, a, b):
      return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  
  def quickhull(points):
      if len(points) < 3:
          return points
  
      points = sorted(points)
      leftmost = points[0]
      rightmost = points[-1]
  
      left_set = [point for point in points if cross(leftmost, rightmost, point) > 0]
      right_set = [point for point in points if cross(leftmost, rightmost, point) < 0]
  
      def find_hull(points_set, a, b):
          if not points_set:
              return []
          farthest = max(points_set, key=lambda point: cross(a, b, point))
          points_set.remove(farthest)
          
          left_of_ab = [point for point in points_set if cross(a, farthest, point) > 0]
          right_of_ab = [point for point in points_set if cross(farthest, b, point) > 0]
          
          return find_hull(left_of_ab, a, farthest) + [farthest] + find_hull(right_of_ab, farthest, b)
  
      return [leftmost] + find_hull(left_set, leftmost, rightmost) + [rightmost] + find_hull(right_set, rightmost, leftmost)
  
  # Example usage
  points = [(0, 0), (2, 2), (2, 0), (3, 1), (1, 1)]
  result = quickhull(points)
  print(f"Convex Hull: {result}")
  ```