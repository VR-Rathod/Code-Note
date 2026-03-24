# Explanation
	- **Convex Hull** is the smallest convex polygon that can enclose a set of points in a plane. The **Divide and Conquer Algorithm** for finding the Convex Hull works by dividing the set of points into smaller subsets, solving the Convex Hull problem for each subset, and then merging the results to form the final convex hull.
-
- # Steps
	- **Sort** the points based on their x-coordinates (and y if necessary).
	-
	- **Divide** the points into two halves.
	-
	- **Recursively compute** the convex hull for each half of the set.
	-
	- **Merge** the two convex hulls obtained from the two halves by finding the upper and lower tangent lines between the two hulls.
	-
	- **Return** the combined convex hull.
-
- # Time Complexity
	- **Time complexity**: O(n log n), where `n` is the number of points. The sorting step takes O(n log n), and merging takes linear time.
-
- ```python
  def orientation(p, q, r):
      val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - p[1])
      if val == 0:
          return 0
      return 1 if val > 0 else -1
  
  def merge_hulls(left_hull, right_hull):
      left = max(left_hull, key=lambda x: x[0])
      right = min(right_hull, key=lambda x: x[0])
      
      upper = [left]
      lower = [right]
      
      while True:
          next_left = left_hull[(left_hull.index(left) + 1) % len(left_hull)]
          next_right = right_hull[(right_hull.index(right) + 1) % len(right_hull)]
          
          if orientation(left, next_left, right) > 0:
              upper.append(next_left)
              left = next_left
          else:
              lower.append(next_right)
              right = next_right
  
          if left == right:
              break
      
      return upper + lower
  
  def convex_hull(points):
      points = sorted(points)  # Sort points based on x, then y
      
      left_points = points[:len(points)//2]
      right_points = points[len(points)//2:]
      
      left_hull = [left_points[0]]
      for p in left_points[1:]:
          while len(left_hull) > 1 and orientation(left_hull[-2], left_hull[-1], p) != -1:
              left_hull.pop()
          left_hull.append(p)
      
      right_hull = [right_points[0]]
      for p in right_points[1:]:
          while len(right_hull) > 1 and orientation(right_hull[-2], right_hull[-1], p) != -1:
              right_hull.pop()
          right_hull.append(p)
      
      return merge_hulls(left_hull, right_hull)
  
  # Example usage
  points = [(0, 0), (2, 2), (2, 0), (3, 1), (1, 1)]
  result = convex_hull(points)
  print(f"Convex Hull: {result}")
  ```