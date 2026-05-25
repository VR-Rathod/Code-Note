---
date: 2026-03-24T17:12:17+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Convex Hull – Graham Scan Algorithm Implementation Guide
description: "Graham scan computes the convex hull by sorting points by polar angle and using a stack. Covers pivot selection, cross product orientation, O(n log n)."
keywords: "convex hull, Graham scan, polar angle sort, cross product, stack algorithm, computational geometry, O(n log n), time complexity, space complexity, point set"
---

- # Explanation
	- **Graham Scan** is another algorithm for finding the convex hull. It sorts the points by angle with respect to the pivot point and then processes them in a counterclockwise order to find the convex hull.
-
- # Steps:
	- Find the point with the lowest y-coordinate (pivot).
	-
	- Sort the remaining points by the angle with the pivot.
	-
	- Process the sorted points and use a stack to maintain the convex hull.
-
- # Time Complexity:
	- O(n log n), where `n` is the number of points (due to sorting).
-
- ```python
  import math
  
  def orientation(p, q, r):
      val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1])
      if val == 0:
          return 0
      return 1 if val > 0 else -1
  
  def graham_scan(points):
      points = sorted(points, key=lambda p: (p[0], p[1]))
      n = len(points)
      if n < 3:
          return points
      
      lower = []
      for p in points:
          while len(lower) >= 2 and orientation(lower[-2], lower[-1], p) != -1:
              lower.pop()
          lower.append(p)
      
      upper = []
      for p in reversed(points):
          while len(upper) >= 2 and orientation(upper[-2], upper[-1], p) != -1:
              upper.pop()
          upper.append(p)
      
      return lower[:-1] + upper[:-1]
  
  # Example usage
  points = [(0, 0), (2, 2), (2, 0), (3, 1), (1, 1)]
  result = graham_scan(points)
  print(f"Convex Hull: {result}")
  ```