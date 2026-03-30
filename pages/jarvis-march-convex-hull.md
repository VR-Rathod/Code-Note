---
seoTitle: Jarvis March Algorithm – Convex Hull Gift Wrapping Explained
description: "Jarvis March (Gift Wrapping) finds the convex hull of a point set by wrapping around outermost points. Covers orientation test, O(nh) complexity, C++ and Python implementations."
keywords: "convex hull, Jarvis march, gift wrapping algorithm, computational geometry, orientation test, O(nh) complexity, DSA, algorithms, point set, polygon, jarvis algorithm, convex hull algorithm, VR-Rathod, Code-Note, code note vr, vr book, dsa notes, algorithm reference"
---

- # Introduction
	- **Jarvis March** (also called **Gift Wrapping**) is one of the simplest algorithms for computing the **Convex Hull** of a set of 2D points.
	- A **Convex Hull** is the smallest convex polygon that contains all the given points — like stretching a rubber band around the outermost points.
	- Named after **R.A. Jarvis** (1973).
	-
	- ## Real-World Analogy
		- Imagine hammering nails into a board at each point location.
		- Stretch a rubber band around all the nails and let it snap tight.
		- The shape the rubber band forms = the Convex Hull.
	-
	- ## Advantages
		- Simple to understand and implement.
		- Output-sensitive — faster when the hull has few points (small `h`).
		- Works correctly for collinear points with proper orientation check.
	-
	- ## Disadvantages
		- O(nh) — slow when hull has many points (worst case O(n²)).
		- Graham Scan and Chan's Algorithm are faster for large inputs.
-
- # Core Concept — Orientation Test
  collapsed:: true
	- ## Cross Product for Orientation
	  collapsed:: true
		- Given three points O, A, B — the cross product tells us their turn direction.
		- ```
		  cross(O, A, B) = (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x)
		  
		  Result > 0  → Counter-clockwise (left turn)
		  Result = 0  → Collinear (no turn)
		  Result < 0  → Clockwise (right turn)
		  ```
		- Jarvis March picks the point that makes the most **counter-clockwise** turn from the current direction.
-
- # Algorithm Steps
  collapsed:: true
	- ```
	  1. Find the leftmost point (smallest x) — guaranteed to be on the hull.
	  2. Set current = leftmost point.
	  3. Loop:
	     a. Add current to hull.
	     b. Set candidate = any other point (e.g., points[0]).
	     c. For every other point r:
	        - If cross(current, candidate, r) > 0 → r is more counter-clockwise → candidate = r
	        - If cross = 0 (collinear) → pick the farther point
	     d. current = candidate
	  4. Stop when current == leftmost point (hull is closed).
	  ```
	- ```
	  Visual Example:
	  
	  Points: (0,0), (1,1), (2,0), (2,2), (0,2)
	  
	  Start at (0,0) — leftmost
	  → wrap to (2,0) → (2,2) → (0,2) → back to (0,0)
	  
	  Hull = [(0,0), (2,0), (2,2), (0,2)]
	  ```
-
- # C++ Implementation
  collapsed:: true
	- ## Full Implementation
	  collapsed:: true
		- ```cpp
		  #include <iostream>
		  #include <vector>
		  #include <algorithm>
		  
		  struct Point {
		      int x, y;
		  };
		  
		  // Cross product of vectors OA and OB
		  // > 0 : counter-clockwise
		  // = 0 : collinear
		  // < 0 : clockwise
		  int cross(Point O, Point A, Point B) {
		      return (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
		  }
		  
		  std::vector<Point> jarvisMarch(std::vector<Point>& points) {
		      int n = points.size();
		      if (n < 3) return points;
		  
		      // Find leftmost point
		      int leftmost = 0;
		      for (int i = 1; i < n; i++)
		          if (points[i].x < points[leftmost].x)
		              leftmost = i;
		  
		      std::vector<Point> hull;
		      int current = leftmost;
		  
		      do {
		          hull.push_back(points[current]);
		          int candidate = (current + 1) % n;
		  
		          for (int i = 0; i < n; i++) {
		              int c = cross(points[current], points[candidate], points[i]);
		              if (c > 0) {
		                  // i is more counter-clockwise than candidate
		                  candidate = i;
		              } else if (c == 0) {
		                  // collinear — pick farther point
		                  auto dx1 = points[i].x - points[current].x;
		                  auto dy1 = points[i].y - points[current].y;
		                  auto dx2 = points[candidate].x - points[current].x;
		                  auto dy2 = points[candidate].y - points[current].y;
		                  if (dx1*dx1 + dy1*dy1 > dx2*dx2 + dy2*dy2)
		                      candidate = i;
		              }
		          }
		  
		          current = candidate;
		      } while (current != leftmost);
		  
		      return hull;
		  }
		  
		  int main() {
		      std::vector<Point> points = {
		          {0,0}, {1,1}, {2,0}, {2,2}, {0,2}, {1,0}
		      };
		  
		      auto hull = jarvisMarch(points);
		  
		      std::cout << "Convex Hull points:\n";
		      for (auto& p : hull)
		          std::cout << "(" << p.x << ", " << p.y << ")\n";
		      // (0,0) → (2,0) → (2,2) → (0,2)
		  
		      return 0;
		  }
		  ```
-
- # Python Implementation
  collapsed:: true
	- ```python
	  def cross(O, A, B):
	      """Cross product of OA and OB vectors.
	      > 0: counter-clockwise, = 0: collinear, < 0: clockwise
	      """
	      return (A[0] - O[0]) * (B[1] - O[1]) - (A[1] - O[1]) * (B[0] - O[0])
	  
	  def jarvis_march(points):
	      n = len(points)
	      if n < 3:
	          return points
	  
	      # Start from leftmost point
	      start = min(points, key=lambda p: p[0])
	      hull = []
	      current = start
	  
	      while True:
	          hull.append(current)
	          candidate = points[0]
	  
	          for point in points[1:]:
	              c = cross(current, candidate, point)
	              if c > 0:
	                  candidate = point
	              elif c == 0:
	                  # Collinear — pick farther point
	                  d1 = (point[0]-current[0])**2 + (point[1]-current[1])**2
	                  d2 = (candidate[0]-current[0])**2 + (candidate[1]-current[1])**2
	                  if d1 > d2:
	                      candidate = point
	  
	          current = candidate
	          if current == start:
	              break
	  
	      return hull
	  
	  # Example
	  points = [(0,0), (1,1), (2,0), (2,2), (0,2), (1,0)]
	  hull = jarvis_march(points)
	  print("Convex Hull:", hull)
	  # [(0,0), (2,0), (2,2), (0,2)]
	  ```
-
- # Time & Space Complexity
  collapsed:: true
	- ```
	  Case          Time        Explanation
	  Best          O(n)        Hull has 3 points — only 3 outer iterations
	  Average       O(nh)       h = hull points, n = total points
	  Worst         O(n²)       All points on hull (e.g., circle of points)
	  Space         O(h)        Only hull points stored
	  ```
	- `h` = number of points on the convex hull.
	- When `h` is small (e.g., 3–10), Jarvis March is very fast.
	- When `h ≈ n` (all points on hull), it degrades to O(n²).
-
- # Convex Hull Algorithm Comparison
  collapsed:: true
	- ```
	  Algorithm         Time          Notes
	  Jarvis March      O(nh)         Simple, output-sensitive
	  Graham Scan       O(n log n)    Sort-based, faster for large n
	  Chan's Algorithm  O(n log h)    Optimal output-sensitive
	  Quickhull         O(n log n)    Divide & conquer, fast in practice
	  ```
	- Use **Jarvis March** when: simple implementation needed, `h` is small.
	- Use **Graham Scan** when: general purpose, `n` is large.
	- Use **Chan's** when: optimal theoretical complexity needed.
-
- # Key Takeaways
	- Jarvis March = Gift Wrapping — start at leftmost, keep turning counter-clockwise.
	- Core operation: **cross product** to determine turn direction.
	- Time: **O(nh)** — output-sensitive, great when hull is small.
	- Handle collinear points by picking the **farther** point.
	- For large inputs with many hull points, prefer Graham Scan or Chan's Algorithm.