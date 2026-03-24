# Explanation
	- **Jarvis's Algorithm (Gift Wrapping)** is a simple algorithm for finding the convex hull of a set of points in the plane. It starts from the leftmost point and repeatedly selects the point that is the most counterclockwise relative to the current point.
-
- # Steps:
	- Start from the leftmost point.
	-
	- For each point, find the next point that forms the largest counterclockwise angle.
	-
	- Repeat until you return to the starting point.
-
- # Time Complexity:
	- **Time complexity**: O(nh), where `n` is the number of points and `h` is the number of points in the convex hull.
-
- ```python
  def cross(o, a, b):
      return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  
  def jarvis_algorithm(points):
      n = len(points)
      if n < 3:
          return points
      
      leftmost = min(points, key=lambda p: p[0])
      hull = []
      p = leftmost
      while True:
          hull.append(p)
          q = points[0]
          for r in points[1:]:
              if cross(p, q, r) > 0:
                  q = r
          p = q
          if p == leftmost:
              break
      return hull
  
  # Example usage
  points = [(0, 0), (2, 2), (2, 0), (3, 1), (1, 1)]
  result = jarvis_algorithm(points)
  print(f"Convex Hull: {result}")
  ```