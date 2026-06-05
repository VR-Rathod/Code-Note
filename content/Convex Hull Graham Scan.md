---
seoTitle: Convex Hull Graham Scan – Polar Sort & Stack Algorithm Guide
description: "Graham Scan computes the convex hull of a 2D point set by sorting points by polar angle and using a stack to filter right turns. Covers pivot selection, cross product orientation test, O(n log n) complexity, and full code in Python, C++, JavaScript, and Java."
keywords: "convex hull, Graham scan, polar angle sort, cross product, stack algorithm, computational geometry, O(n log n), time complexity, space complexity, point set, orientation test, collinear points"
treeTitle: DSA - Math & Geometry - Convex Hull Graham Scan
---

> [!info] What is Graham Scan?
> **Graham Scan** is an $O(N \log N)$ algorithm to find the **Convex Hull** of a set of 2D points.
> It works by finding the lowest point (pivot), sorting all other points by their polar angle with respect to the pivot, and then using a stack-based traversal to prune right turns (non-convex steps).

- # Explanation
  collapsed:: true
	- Graham Scan builds the convex hull boundary in a single counter-clockwise sweep. It ensures the hull remains convex by validating that each new point forms a **left turn** (counter-clockwise) relative to the preceding two points on the hull.
	-
	- Named after **Ronald Graham (1972)**, it was one of the earliest algorithms in computational geometry.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine standing at the absolute bottom-left nail (pivot) on a pegboard and looking out at all the other nails. You turn your head from right to left (sweeping polar angles) to look at each nail in order.
		- As you walk from nail to nail in this sorted order, you lay a string. If the string ever bends to the right, you've made a detour inside the outer perimeter; you backtrack, remove the intermediate nails, and pull the string tight again.
	-
	- ## Advantages and Disadvantages
	  collapsed:: true
		- | | Detail |
		  |---|---|
		  | ✅ **Deterministic** | Guaranteed $O(N \log N)$ time complexity regardless of the shape of the hull |
		  | ✅ **Efficient** | Amortized linear time $O(N)$ traversal phase after sorting |
		  | ❌ **Sorting Overhead** | Requires sorting all points by polar angle, which can be numerically unstable if not handled via cross products |
		  | ❌ **Not Output-Sensitive** | Always takes $O(N \log N)$ even if the hull has only 3 points (unlike Jarvis March or Chan's) |
		-
- # Core Concept — Polar Sorting & Orientation
  collapsed:: true
	- ## The Pivot Point
	  collapsed:: true
		- The algorithm starts by selecting a **pivot point** $P_0$.
		- $P_0$ is guaranteed to be on the convex hull. We find it by picking the point with the **minimum y-coordinate** (if there is a tie, pick the one with the **minimum x-coordinate**).
		-
	- ## Polar Angle Sorting via Cross Product
	  collapsed:: true
		- Sorting points by polar angle with respect to $P_0$ normally requires computing angles using `atan2(y, x)`. However, floating-point trigonometry is slow and prone to precision issues.
		- Instead, we use the **cross product** to determine the relative angle of two points $A$ and $B$ from $P_0$:
		- ```
		  cross(P0, A, B) = (A.x - P0.x) * (B.y - P0.y) - (A.y - P0.y) * (B.x - P0.x)
		  
		  Result > 0  →  A is clockwise from B (A has smaller polar angle than B)
		  Result < 0  →  A is counter-clockwise from B (A has larger polar angle than B)
		  Result = 0  →  Collinear (same angle) — keep the point farther from P0
		  ```
		-
	- ## Orientation Test (CCW)
	  collapsed:: true
		- For any three points $P_1$, $P_2$, $P_3$, we want to determine the turn direction:
		- ```mermaid
		  flowchart TD
		      A["cross(P1, P2, P3)"] --> B{"Result Value"}
		      B -- "> 0" --> C["Counter-Clockwise (Left Turn) ✅<br/>Keep P3 on stack"]
		      B -- "= 0" --> D["Collinear (Straight) ❌<br/>Pop P2, keep farther P3"]
		      B -- "< 0" --> E["Clockwise (Right Turn) ❌<br/>Pop P2, check previous"]
		  ```
		-
- # Algorithm Steps
  collapsed:: true
	- ## Pseudocode
	  collapsed:: true
		- ```
		  INPUT:  set of 2D points
		  OUTPUT: stack of hull points in counter-clockwise order
		  
		  1. Find pivot P0 (lowest Y, then lowest X).
		  2. Sort remaining points by polar angle with P0.
		     - If two points have the same angle, remove the closer one.
		  3. Initialize stack with P0, points[0], points[1].
		  4. FOR i from 2 to n-1:
		        WHILE stack.size() >= 2 and cross(second_to_top(stack), top(stack), points[i]) <= 0:
		            stack.pop()
		        stack.push(points[i])
		  5. RETURN stack
		  ```
		-
	- ## Visual Walkthrough
	  collapsed:: true
		- Consider points: `P0(0,0)`, `A(2,1)`, `B(1,2)`, `C(0,2)`, `D(1,1)` (interior)
		- ```
		  1. Pivot: P0(0,0)
		  2. Sorted by polar angle with P0: A(2,1), D(1,1), B(1,2), C(0,2) (Note: D and B are collinear with P0, D is closer so it precedes/is pruned).
		  3. Initialize Stack: [P0, A, B]
		  4. Process C(0,2):
		     - Top of stack = B(1,2)
		     - Second to top = A(2,1)
		     - Check turn A -> B -> C: Left turn (CCW).
		     - Push C. Stack: [P0, A, B, C]
		  5. Final Hull: [P0, A, B, C] -> (0,0), (2,1), (1,2), (0,2)
		  ```
		-
- # Time & Space Complexity
  collapsed:: true
	- ## Complexity Table
	  collapsed:: true
		- | Phase | Time Complexity | Details |
		  |---|---|---|
		  | **Pivot Search** | $O(N)$ | Single linear scan to find minimum Y and X |
		  | **Polar Sort** | $O(N \log N)$ | Sorting $N - 1$ points |
		  | **Stack Traversal** | $O(N)$ | Each point is pushed once and popped at most once |
		  | **Total Time** | **$O(N \log N)$** | Dominated by the polar angle sorting phase |
		  | **Space Complexity** | **$O(N)$** | To store sorted points and stack |
		-
- # Implementation
  collapsed:: true
	- > [!note] All implementations below use cross products for custom sorting to maintain numerical precision.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs
	  
	  ```python
	  import math
	  
	  def dist_sq(p1, p2):
	      return (p1[0] - p2[0])**2 + (p1[1] - p2[1])**2
	  
	  def orientation(p, q, r):
	      """
	      0 -> Collinear
	      1 -> Clockwise
	      2 -> Counter-Clockwise
	      """
	      val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1])
	      if val == 0:
	          return 0
	      return 1 if val > 0 else 2
	  
	  def graham_scan(points):
	      n = len(points)
	      if n < 3:
	          return points
	  
	      # 1. Find pivot (lowest y, then lowest x)
	      pivot_idx = 0
	      for i in range(1, n):
	          if points[i][1] < points[pivot_idx][1]:
	              pivot_idx = i
	          elif points[i][1] == points[pivot_idx][1] and points[i][0] < points[pivot_idx][0]:
	              pivot_idx = i
	  
	      # Swap pivot to the first position
	      points[0], points[pivot_idx] = points[pivot_idx], points[0]
	      p0 = points[0]
	  
	      # 2. Sort remaining points by polar angle with p0
	      # If polar angles are same, sort by distance from p0
	      def polar_comparator(p):
	          # Returns (angle, distance)
	          # Using atan2 is simpler in Python, but we can also do custom keys
	          return (math.atan2(p[1] - p0[1], p[0] - p0[0]), dist_sq(p0, p))
	  
	      sorted_points = sorted(points[1:], key=polar_comparator)
	  
	      # Handle collinear points: keep only the furthest point for same angle
	      unique_points = []
	      for p in sorted_points:
	          if len(unique_points) > 0 and orientation(p0, unique_points[-1], p) == 0:
	              if dist_sq(p0, p) > dist_sq(p0, unique_points[-1]):
	                  unique_points[-1] = p
	          else:
	              unique_points.append(p)
	  
	      if len(unique_points) < 2:
	          return [p0] + unique_points
	  
	      # 3. Stack traversal
	      stack = [p0, unique_points[0], unique_points[1]]
	      for p in unique_points[2:]:
	          while len(stack) > 1 and orientation(stack[-2], stack[-1], p) != 2:
	              stack.pop()
	          stack.append(p)
	  
	      return stack
	  
	      # Example
	  points = [(0, 3), (1, 1), (2, 2), (4, 4), (0, 0), (1, 2), (3, 1), (3, 3)]
	  print("Convex Hull:", graham_scan(points))
	  # Output: [(0, 0), (3, 1), (4, 4), (0, 3)]
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  #include <stack>
	  
	  struct Point {
	      int x, y;
	  };
	  
	  Point p0; // Global pivot point for sorting
	  
	  int distSq(Point p1, Point p2) {
	      return (p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y);
	  }
	  
	  int orientation(Point p, Point q, Point r) {
	      int val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
	      if (val == 0) return 0;  // Collinear
	      return (val > 0) ? 1 : 2; // Clockwise or Counter-Clockwise
	  }
	  
	  bool compare(Point p1, Point p2) {
	      int orient = orientation(p0, p1, p2);
	      if (orient == 0)
	          return distSq(p0, p1) < distSq(p0, p2);
	      return (orient == 2);
	  }
	  
	  std::vector<Point> grahamScan(std::vector<Point>& points) {
	      int n = points.size();
	      if (n < 3) return points;
	  
	      // Find pivot
	      int ymin = points[0].y, min_idx = 0;
	      for (int i = 1; i < n; i++) {
	          int y = points[i].y;
	          if ((y < ymin) || (ymin == y && points[i].x < points[min_idx].x)) {
	              ymin = points[i].y;
	              min_idx = i;
	          }
	      }
	  
	      std::swap(points[0], points[min_idx]);
	      p0 = points[0];
	  
	      // Sort points[1...n-1]
	      std::sort(points.begin() + 1, points.end(), compare);
	  
	      // Filter collinear points
	      int m = 1; // Index of modified array
	      for (int i = 1; i < n; i++) {
	          while (i < n - 1 && orientation(p0, points[i], points[i+1]) == 0)
	              i++;
	          points[m++] = points[i];
	      }
	  
	      if (m < 3) return std::vector<Point>({points[0], points[1]});
	  
	      std::vector<Point> hull;
	      hull.push_back(points[0]);
	      hull.push_back(points[1]);
	      hull.push_back(points[2]);
	  
	      for (int i = 3; i < m; i++) {
	          while (hull.size() > 1 && orientation(hull[hull.size()-2], hull.back(), points[i]) != 2) {
	              hull.pop_back();
	          }
	          hull.push_back(points[i]);
	      }
	  
	      return hull;
	  }
	  
	  int main() {
	      std::vector<Point> points = {{0, 3}, {1, 1}, {2, 2}, {4, 4}, {0, 0}, {1, 2}, {3, 1}, {3, 3}};
	      auto hull = grahamScan(points);
	      std::cout << "Convex Hull:\n";
	      for (auto p : hull)
	          std::cout << "(" << p.x << ", " << p.y << ")\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function distSq(p1, p2) {
	      return (p1[0] - p2[0])**2 + (p1[1] - p2[1])**2;
	  }
	  
	  function orientation(p, q, r) {
	      const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
	      if (val === 0) return 0;
	      return (val > 0) ? 1 : 2;
	  }
	  
	  function grahamScan(points) {
	      const n = points.length;
	      if (n < 3) return points;
	  
	      // Find pivot
	      let pivotIdx = 0;
	      for (let i = 1; i < n; i++) {
	          if (points[i][1] < points[pivotIdx][1]) {
	              pivotIdx = i;
	          } else if (points[i][1] === points[pivotIdx][1] && points[i][0] < points[pivotIdx][0]) {
	              pivotIdx = i;
	          }
	      }
	  
	      const p0 = points[pivotIdx];
	      const remaining = points.filter((_, idx) => idx !== pivotIdx);
	  
	      remaining.sort((p1, p2) => {
	          const orient = orientation(p0, p1, p2);
	          if (orient === 0) {
	              return distSq(p0, p1) - distSq(p0, p2);
	          }
	          return (orient === 2) ? -1 : 1;
	      });
	  
	      // Filter collinear points
	      const unique = [];
	      for (const p of remaining) {
	          if (unique.length > 0 && orientation(p0, unique[unique.length - 1], p) === 0) {
	              if (distSq(p0, p) > distSq(p0, unique[unique.length - 1])) {
	                  unique[unique.length - 1] = p;
	              }
	          } else {
	              unique.push(p);
	          }
	      }
	  
	      if (unique.length < 2) return [p0, ...unique];
	  
	      const stack = [p0, unique[0], unique[1]];
	      for (let i = 2; i < unique.length; i++) {
	          while (stack.length > 1 && orientation(stack[stack.length - 2], stack[stack.length - 1], unique[i]) !== 2) {
	              stack.pop();
	          }
	          stack.push(unique[i]);
	      }
	  
	      return stack;
	  }
	  
	  const points = [[0, 3], [1, 1], [2, 2], [4, 4], [0, 0], [1, 2], [3, 1], [3, 3]];
	  console.log("Convex Hull:", grahamScan(points));
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class GrahamScan {
	      static class Point {
	          int x, y;
	          Point(int x, int y) { this.x = x; this.y = y; }
	      }
	  
	      static Point p0;
	  
	      static int distSq(Point p1, Point p2) {
	          return (p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y);
	      }
	  
	      static int orientation(Point p, Point q, Point r) {
	          int val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
	          if (val == 0) return 0;
	          return (val > 0) ? 1 : 2;
	      }
	  
	      static List<Point> grahamScan(List<Point> points) {
	          int n = points.size();
	          if (n < 3) return points;
	  
	          int minIdx = 0;
	          for (int i = 1; i < n; i++) {
	              if (points.get(i).y < points.get(minIdx).y) {
	                  minIdx = i;
	              } else if (points.get(i).y == points.get(minIdx).y && points.get(i).x < points.get(minIdx).x) {
	                  minIdx = i;
	              }
	          }
	  
	          p0 = points.get(minIdx);
	          points.set(minIdx, points.get(0));
	          points.set(0, p0);
	  
	          points.subList(1, n).sort((p1, p2) -> {
	              int orient = orientation(p0, p1, p2);
	              if (orient == 0) {
	                  return Integer.compare(distSq(p0, p1), distSq(p0, p2));
	              }
	              return (orient == 2) ? -1 : 1;
	          });
	  
	          List<Point> unique = new ArrayList<>();
	          for (int i = 1; i < n; i++) {
	              Point p = points.get(i);
	              if (!unique.isEmpty() && orientation(p0, unique.get(unique.size() - 1), p) == 0) {
	                  if (distSq(p0, p) > distSq(p0, unique.get(unique.size() - 1))) {
	                      unique.set(unique.size() - 1, p);
	                  }
	              } else {
	                  unique.add(p);
	              }
	          }
	  
	          if (unique.size() < 2) {
	              List<Point> res = new ArrayList<>();
	              res.add(p0);
	              res.addAll(unique);
	              return res;
	          }
	  
	          Stack<Point> stack = new Stack<>();
	          stack.push(p0);
	          stack.push(unique.get(0));
	          stack.push(unique.get(1));
	  
	          for (int i = 2; i < unique.size(); i++) {
	              Point next = unique.get(i);
	              while (stack.size() > 1) {
	                  Point top = stack.pop();
	                  Point prev = stack.peek();
	                  if (orientation(prev, top, next) == 2) {
	                      stack.push(top);
	                      break;
	                  }
	              }
	              stack.push(next);
	          }
	  
	          return new ArrayList<>(stack);
	      }
	  
	      public static void main(String[] args) {
	          List<Point> points = new ArrayList<>(Arrays.asList(
	              new Point(0, 3), new Point(1, 1), new Point(2, 2), new Point(4, 4),
	              new Point(0, 0), new Point(1, 2), new Point(3, 1), new Point(3, 3)
	          ));
	          List<Point> hull = grahamScan(points);
	          System.out.println("Convex Hull:");
	          for (Point p : hull)
	              System.out.println("(" + p.x + ", " + p.y + ")");
	      }
	  }
	  ```
	  
	  :::
	-
- # When to Use Graham Scan
  collapsed:: true
	- ## ✅ Use Graham Scan When:
		- You want guaranteed $O(N \log N)$ worst-case execution time.
		- The coordinates are integer values, allowing exact cross products without floating-point errors.
		- The hull is large, making Jarvis March's $O(N^2)$ worst case unacceptable.
	-
	- ## ❌ Avoid Graham Scan When:
		- The points arrive dynamically in a stream — use **dynamic convex hull** structures instead.
		- The hull is tiny ($h \ll N$), where Jarvis March $O(N)$ or Chan's Algorithm $O(N \log h)$ would run faster.
		-
- # Key Takeaways
	- **Polar Angle Ordering** — Sorting points around a pivot allows us to scan them in a single counter-clockwise direction.
	- **Stack-based Traversal** — Eliminating right turns keeps the polygon boundary strictly convex.
	- **Determinism** — The sort is the bottleneck, yielding a robust $O(N \log N)$ overall complexity.
	- **Collinear Filtering** — Handled by picking only the furthest point when points share a polar angle, preventing collinear edge overlap.
	-
- # More Learn
	- ## GitHub & Webs
		- [TheAlgorithms – Graham Scan Python](https://github.com/TheAlgorithms/Python/blob/master/computational_geometry/convex_hull.py)
		- [GeeksforGeeks – Graham Scan](https://www.geeksforgeeks.org/convex-hull-set-2-graham-scan/)
	- ## Related Pages
		- [[Convex Hull Jarvis March]] – Output-sensitive gift wrapping method
		- [[Convex Hull Divide and Conquer]] – Divide and conquer merge-based algorithm
		- [[Convex Hull Quickhull]] – Average $O(N \log N)$ divide & conquer
		- [[DSA Algo & System Design]] – Master DSA list