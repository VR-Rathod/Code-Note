---
seoTitle: Convex Hull Divide and Conquer – Recursive Merge & Tangents Guide
description: "Divide and Conquer Convex Hull recursively splits the point set and merges hulls via upper and lower tangents. Covers tangent walk algorithms, O(n log n) merge complexity, and implementations in Python, C++, JavaScript, and Java."
keywords: "convex hull, divide and conquer, computational geometry, upper tangent, lower tangent, tangent walk, O(n log n), merge hull, point set, recursive algorithm"
---

> [!info] What is Divide and Conquer Convex Hull?
> This algorithm finds the **Convex Hull** by sorting points along the X-axis, recursively dividing the point set into left and right halves, finding their individual hulls, and merging them in $O(N)$ time by finding the **upper** and **lower common tangents**.
> **Total Time Complexity: O(n log n)**.

- # Explanation
  collapsed:: true
	- The **Divide and Conquer** paradigm is highly effective for geometric problems. By sorting points by their x-coordinate first, we can divide the set into two disjoint halves (left and right), solve them independently, and merge them.
	-
	- The challenge lies in the **Merge** step: connecting the two separate hulls to form a single, enclosing convex polygon. We do this by finding the two line segments that wrap around both hulls — the **Upper Tangent** and **Lower Tangent**.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine two separate groups of nails wrapped with individual rubber bands. To enclose both groups under one single rubber band, you stretch a larger rubber band around both groups.
		- The two segments of the outer rubber band that span the gap between the two groups are the **upper and lower common tangents**. The parts of the inner rubber bands between these tangents are swallowed up and no longer touch the outer boundary.
	-
	- ## Advantages and Disadvantages
	  collapsed:: true
		- | | Detail |
		  |---|---|
		  | ✅ **Parallelizable** | The left and right subproblems are completely independent and can run in parallel |
		  | ✅ **Optimal Complexity** | Performs in $O(N \log N)$ time, matching the theoretical sorting lower bound |
		  | ❌ **Complex Merge Step** | Finding upper and lower tangents requires careful pointer manipulation and orientation tests |
		  | ❌ **High Constant Factor** | In practice, sorting-based Graham Scan or monotone chain is simpler and has lower constant overhead |
		-
- # Core Concept — Tangent Walking
  collapsed:: true
	- ## What are Upper and Lower Tangents?
	  collapsed:: true
		- An **Upper Tangent** is a line segment $T_U = (L_u, R_u)$ connecting a point on the left hull $L_u$ to a point on the right hull $R_u$ such that all points in both hulls lie **on or below** the line.
		- A **Lower Tangent** is a line segment $T_L = (L_l, R_l)$ connecting a point on the left hull $L_l$ to a point on the right hull $R_l$ such that all points in both hulls lie **on or above** the line.
		-
		- ```mermaid
		  flowchart TD
		      LH["Left Hull<br/>(ordered CCW)"] --- UT["Upper Tangent (Lu, Ru)"] --- RH["Right Hull<br/>(ordered CCW)"]
		      LH --- LT["Lower Tangent (Ll, Rl)"] --- RH
		  ```
		-
	- ## How the Tangent Walk Works
	  collapsed:: true
		- 1. Let $A$ be the rightmost point on the left hull, and $B$ be the leftmost point on the right hull.
		- 2. To find the **Upper Tangent**:
		   - Check if the segment $AB$ can be pushed higher.
		   - Move $A$ counter-clockwise (upward along the left hull) if it makes the angle with $B$ steeper.
		   - Move $B$ clockwise (upward along the right hull) if it makes the angle with $A$ steeper.
		   - Repeat this until no further steps can be made on either side.
		- 3. To find the **Lower Tangent**:
		   - Move $A$ clockwise (downward along the left hull) and $B$ counter-clockwise (downward along the right hull) until no further steps can be made.
		-
- # Merge Step Walkthrough
  collapsed:: true
	- ## Pseudocode for Finding Upper Tangent
	  collapsed:: true
		- ```
		  INPUT: Left Hull (ordered clockwise or CCW), Right Hull (ordered clockwise or CCW)
		  Let n1 = size(left_hull), n2 = size(right_hull)
		  Let ia = index of rightmost point in left_hull
		  Let ib = index of leftmost point in right_hull

		  ia_curr = ia, ib_curr = ib
		  done = false
		  while not done:
		      done = true
		      // Walk up left hull (CCW if ordered clockwise)
		      while direction(left_hull[ia_curr], right_hull[ib_curr], left_hull[(ia_curr - 1) % n1]) is CCW:
		          ia_curr = (ia_curr - 1) % n1
		          done = false
		      // Walk up right hull (CW if ordered clockwise)
		      while direction(right_hull[ib_curr], left_hull[ia_curr], right_hull[(ib_curr + 1) % n2]) is CW:
		          ib_curr = (ib_curr + 1) % n2
		          done = false

		  UPPER_TANGENT = (left_hull[ia_curr], right_hull[ib_curr])
		  ```
		-
- # Time & Space Complexity
  collapsed:: true
	- ## Complexity Table
	  collapsed:: true
		- | Phase | Time Complexity | Details |
		  |---|---|---|
		  | **Sorting** | $O(N \log N)$ | Pre-sorting points by x-coordinates (done once at start) |
		  | **Recursive Division** | $O(\log N)$ | Recursion tree depth is $\log N$ |
		  | **Merging Hulls** | $O(N)$ | Linear time tangent-walk and filtering of interior points |
		  | **Total Time** | **$O(N \log N)$** | Solved by recurrence: $T(N) = 2T(N/2) + O(N)$ |
		  | **Space Complexity** | **$O(N)$** | Auxiliary space to store the recursive stacks and hulls |
		-
- # Implementation
  collapsed:: true
	- > [!note] In order to maintain indices correctly during merging, the sub-hulls are kept in sorted clockwise order.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs

	  ```python
	  def orientation(p, q, r):
	      val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1])
	      if val == 0:
	          return 0  # Collinear
	      return 1 if val > 0 else 2  # 1 -> Clockwise, 2 -> Counter-Clockwise

	  def dist_sq(p1, p2):
	      return (p1[0] - p2[0])**2 + (p1[1] - p2[1])**2

	  def graham_scan_for_base(points):
	      # Simple utility to build small hulls (size <= 5)
	      n = len(points)
	      if n < 3:
	          return sorted(points, key=lambda p: (p[0], p[1]))
	      
	      pivot = min(points, key=lambda p: (p[1], p[0]))
	      sorted_pts = sorted(points, key=lambda p: (math.atan2(p[1]-pivot[1], p[0]-pivot[0]), dist_sq(pivot, p)))
	      
	      stack = [pivot, sorted_pts[0]]
	      for p in sorted_pts[1:]:
	          if p == pivot:
	              continue
	          while len(stack) > 1 and orientation(stack[-2], stack[-1], p) != 2:
	              stack.pop()
	          stack.append(p)
	      return stack

	  import math

	  def merge_hulls(left_hull, right_hull):
	      # Both hulls are in clockwise order
	      n1 = len(left_hull)
	      n2 = len(right_hull)
	      
	      # Find rightmost point of left hull
	      ia = 0
	      for i in range(1, n1):
	          if left_hull[i][0] > left_hull[ia][0]:
	              ia = i
	              
	      # Find leftmost point of right hull
	      ib = 0
	      for i in range(1, n2):
	          if right_hull[i][0] < right_hull[ib][0]:
	              ib = i
	              
	      # Find Upper Tangent
	      ia_u, ib_u = ia, ib
	      done = False
	      while not done:
	          done = True
	          # Check left hull CCW move (prev index in clockwise array)
	          while orientation(right_hull[ib_u], left_hull[ia_u], left_hull[(ia_u - 1) % n1]) == 2:
	              ia_u = (ia_u - 1) % n1
	              done = False
	          # Check right hull CW move (next index in clockwise array)
	          while orientation(left_hull[ia_u], right_hull[ib_u], right_hull[(ib_u + 1) % n2]) == 1:
	              ib_u = (ib_u + 1) % n2
	              done = False
	              
	      # Find Lower Tangent
	      ia_l, ib_l = ia, ib
	      done = False
	      while not done:
	          done = True
	          # Check left hull CW move (next index in clockwise array)
	          while orientation(right_hull[ib_l], left_hull[ia_l], left_hull[(ia_l + 1) % n1]) == 1:
	              ia_l = (ia_l + 1) % n1
	              done = False
	          # Check right hull CCW move (prev index in clockwise array)
	          while orientation(left_hull[ia_l], right_hull[ib_l], right_hull[(ib_l - 1) % n2]) == 2:
	              ib_l = (ib_l - 1) % n2
	              done = False
	              
	      # Construct merged hull
	      merged = []
	      # Add left hull from upper tangent clockwise to lower tangent
	      idx = ia_u
	      while True:
	          merged.append(left_hull[idx])
	          if idx == ia_l:
	              break
	          idx = (idx + 1) % n1
	          
	      # Add right hull from lower tangent clockwise to upper tangent
	      idx = ib_l
	      while True:
	          merged.append(right_hull[idx])
	          if idx == ib_u:
	              break
	          idx = (idx + 1) % n2
	          
	      return merged

	  def divide_and_conquer_hull(points):
	      if len(points) <= 5:
	          # Small base cases solved via Graham Scan
	          hull = graham_scan_for_base(points)
	          # Sort clockwise
	          pivot = min(hull, key=lambda p: (p[1], p[0]))
	          return sorted(hull, key=lambda p: math.atan2(p[1]-pivot[1], p[0]-pivot[0]))
	      
	      # Sort by X
	      points = sorted(points, key=lambda p: (p[0], p[1]))
	      mid = len(points) // 2
	      
	      left_hull = divide_and_conquer_hull(points[:mid])
	      right_hull = divide_and_conquer_hull(points[mid:])
	      
	      return merge_hulls(left_hull, right_hull)

	  # Example usage
	  pts = [(0, 3), (1, 1), (2, 2), (4, 4), (0, 0), (1, 2), (3, 1), (3, 3)]
	  print("Convex Hull (CW order):", divide_and_conquer_hull(pts))
	  ```

	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  #include <cmath>

	  struct Point {
	      int x, y;
	  };

	  int orientation(Point p, Point q, Point r) {
	      int val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
	      if (val == 0) return 0;
	      return (val > 0) ? 1 : 2; // 1: CW, 2: CCW
	  }

	  int distSq(Point p1, Point p2) {
	      return (p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y);
	  }

	  std::vector<Point> smallHull(std::vector<Point>& points) {
	      int n = points.size();
	      if (n < 3) return points;
	      int min_idx = 0;
	      for (int i = 1; i < n; i++) {
	          if (points[i].y < points[min_idx].y || (points[i].y == points[min_idx].y && points[i].x < points[min_idx].x))
	              min_idx = i;
	      }
	      Point p0 = points[min_idx];
	      std::swap(points[0], points[min_idx]);
	      std::sort(points.begin() + 1, points.end(), [p0](Point p1, Point p2) {
	          int orient = orientation(p0, p1, p2);
	          if (orient == 0) return distSq(p0, p1) < distSq(p0, p2);
	          return orient == 2;
	      });
	      std::vector<Point> hull = {points[0], points[1]};
	      for (size_t i = 2; i < points.size(); i++) {
	          while (hull.size() > 1 && orientation(hull[hull.size()-2], hull.back(), points[i]) != 2) {
	              hull.pop_back();
	          }
	          hull.push_back(points[i]);
	      }
	      return hull;
	  }

	  std::vector<Point> mergeHulls(const std::vector<Point>& left, const std::vector<Point>& right) {
	      int n1 = left.size(), n2 = right.size();
	      int ia = 0, ib = 0;
	      for (int i = 1; i < n1; i++) if (left[i].x > left[ia].x) ia = i;
	      for (int i = 1; i < n2; i++) if (right[i].x < right[ib].x) ib = i;

	      int ia_u = ia, ib_u = ib;
	      bool done = false;
	      while (!done) {
	          done = true;
	          while (orientation(right[ib_u], left[ia_u], left[(ia_u - 1 + n1) % n1]) == 2) {
	              ia_u = (ia_u - 1 + n1) % n1;
	              done = false;
	          }
	          while (orientation(left[ia_u], right[ib_u], right[(ib_u + 1) % n2]) == 1) {
	              ib_u = (ib_u + 1) % n2;
	              done = false;
	          }
	      }

	      int ia_l = ia, ib_l = ib;
	      done = false;
	      while (!done) {
	          done = true;
	          while (orientation(right[ib_l], left[ia_l], left[(ia_l + 1) % n1]) == 1) {
	              ia_l = (ia_l + 1) % n1;
	              done = false;
	          }
	          while (orientation(left[ia_l], right[ib_l], right[(ib_l - 1 + n2) % n2]) == 2) {
	              ib_l = (ib_l - 1 + n2) % n2;
	              done = false;
	          }
	      }

	      std::vector<Point> merged;
	      int idx = ia_u;
	      while (true) {
	          merged.push_back(left[idx]);
	          if (idx == ia_l) break;
	          idx = (idx + 1) % n1;
	      }
	      idx = ib_l;
	      while (true) {
	          merged.push_back(right[idx]);
	          if (idx == ib_u) break;
	          idx = (idx + 1) % n2;
	      }
	      return merged;
	  }

	  std::vector<Point> divideAndConquer(std::vector<Point>& points) {
	      if (points.size() <= 5) {
	          auto hull = smallHull(points);
	          Point p0 = hull[0];
	          std::sort(hull.begin(), hull.end(), [p0](Point p1, Point p2) {
	              return atan2(p1.y - p0.y, p1.x - p0.x) < atan2(p2.y - p0.y, p2.x - p0.x);
	          });
	          return hull;
	      }
	      std::sort(points.begin(), points.end(), [](Point p1, Point p2) {
	          return p1.x < p2.x || (p1.x == p2.x && p1.y < p2.y);
	      });
	      int mid = points.size() / 2;
	      std::vector<Point> left(points.begin(), points.begin() + mid);
	      std::vector<Point> right(points.begin() + mid, points.end());
	      auto left_hull = divideAndConquer(left);
	      auto right_hull = divideAndConquer(right);
	      return mergeHulls(left_hull, right_hull);
	  }

	  int main() {
	      std::vector<Point> points = {{0, 3}, {1, 1}, {2, 2}, {4, 4}, {0, 0}, {1, 2}, {3, 1}, {3, 3}};
	      auto hull = divideAndConquer(points);
	      std::cout << "Convex Hull:\n";
	      for (auto p : hull)
	          std::cout << "(" << p.x << ", " << p.y << ")\n";
	      return 0;
	  }
	  ```

	  ```javascript
	  function orientation(p, q, r) {
	      const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
	      if (val === 0) return 0;
	      return (val > 0) ? 1 : 2; // 1: CW, 2: CCW;
	  }

	  function distSq(p1, p2) {
	      return (p1[0] - p2[0])**2 + (p1[1] - p2[1])**2;
	  }

	  function smallHull(points) {
	      const n = points.length;
	      if (n < 3) return points;
	      let minIdx = 0;
	      for (let i = 1; i < n; i++) {
	          if (points[i][1] < points[minIdx][1] || (points[i][1] === points[minIdx][1] && points[i][0] < points[minIdx][0]))
	              minIdx = i;
	      }
	      const p0 = points[minIdx];
	      const remaining = points.filter((_, i) => i !== minIdx);
	      remaining.sort((a, b) => {
	          const o = orientation(p0, a, b);
	          if (o === 0) return distSq(p0, a) - distSq(p0, b);
	          return o === 2 ? -1 : 1;
	      });
	      const stack = [p0, remaining[0], remaining[1]];
	      for (let i = 2; i < remaining.length; i++) {
	          while (stack.length > 1 && orientation(stack[stack.length - 2], stack[stack.length - 1], remaining[i]) !== 2) {
	              stack.pop();
	          }
	          stack.push(remaining[i]);
	      }
	      return stack;
	  }

	  function mergeHulls(left, right) {
	      const n1 = left.length, n2 = right.length;
	      let ia = 0, ib = 0;
	      for (let i = 1; i < n1; i++) if (left[i][0] > left[ia][0]) ia = i;
	      for (let i = 1; i < n2; i++) if (right[i][0] < right[ib][0]) ib = i;

	      let ia_u = ia, ib_u = ib;
	      let done = false;
	      while (!done) {
	          done = true;
	          while (orientation(right[ib_u], left[ia_u], left[(ia_u - 1 + n1) % n1]) === 2) {
	              ia_u = (ia_u - 1 + n1) % n1;
	              done = false;
	          }
	          while (orientation(left[ia_u], right[ib_u], right[(ib_u + 1) % n2]) === 1) {
	              ib_u = (ib_u + 1) % n2;
	              done = false;
	          }
	      }

	      let ia_l = ia, ib_l = ib;
	      done = false;
	      while (!done) {
	          done = true;
	          while (orientation(right[ib_l], left[ia_l], left[(ia_l + 1) % n1]) === 1) {
	              ia_l = (ia_l + 1) % n1;
	              done = false;
	          }
	          while (orientation(left[ia_l], right[ib_l], right[(ib_l - 1 + n2) % n2]) === 2) {
	              ib_l = (ib_l - 1 + n2) % n2;
	              done = false;
	          }
	      }

	      const merged = [];
	      let idx = ia_u;
	      while (true) {
	          merged.push(left[idx]);
	          if (idx === ia_l) break;
	          idx = (idx + 1) % n1;
	      }
	      idx = ib_l;
	      while (true) {
	          merged.push(right[idx]);
	          if (idx === ib_u) break;
	          idx = (idx + 1) % n2;
	      }
	      return merged;
	  }

	  function divideAndConquer(points) {
	      if (points.length <= 5) {
	          const hull = smallHull(points);
	          const p0 = hull[0];
	          hull.sort((a, b) => Math.atan2(a[1]-p0[1], a[0]-p0[0]) - Math.atan2(b[1]-p0[1], b[0]-p0[0]));
	          return hull;
	      }
	      points.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
	      const mid = Math.floor(points.length / 2);
	      const left = points.slice(0, mid);
	      const right = points.slice(mid);
	      const leftHull = divideAndConquer(left);
	      const rightHull = divideAndConquer(right);
	      return mergeHulls(leftHull, rightHull);
	  }

	  const pts = [[0, 3], [1, 1], [2, 2], [4, 4], [0, 0], [1, 2], [3, 1], [3, 3]];
	  console.log("Convex Hull:", divideAndConquer(pts));
	  ```

	  ```java
	  import java.util.*;

	  public class ConvexHullDivideAndConquer {
	      static class Point {
	          int x, y;
	          Point(int x, int y) { this.x = x; this.y = y; }
	      }

	      static int orientation(Point p, Point q, Point r) {
	          int val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
	          if (val == 0) return 0;
	          return (val > 0) ? 1 : 2; // 1: CW, 2: CCW
	      }

	      static int distSq(Point p1, Point p2) {
	          return (p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y);
	      }

	      static List<Point> smallHull(List<Point> points) {
	          int n = points.size();
	          if (n < 3) return points;
	          int minIdx = 0;
	          for (int i = 1; i < n; i++) {
	              if (points.get(i).y < points.get(minIdx).y || 
	                  (points.get(i).y == points.get(minIdx).y && points.get(i).x < points.get(minIdx).x)) {
	                  minIdx = i;
	              }
	          }
	          Point p0 = points.get(minIdx);
	          List<Point> rem = new ArrayList<>(points);
	          rem.remove(minIdx);
	          rem.sort((a, b) -> {
	              int o = orientation(p0, a, b);
	              if (o == 0) return Integer.compare(distSq(p0, a), distSq(p0, b));
	              return o == 2 ? -1 : 1;
	          });
	          List<Point> hull = new ArrayList<>();
	          hull.add(p0);
	          hull.add(rem.get(0));
	          hull.add(rem.get(1));
	          for (int i = 2; i < rem.size(); i++) {
	              while (hull.size() > 1 && orientation(hull.get(hull.size()-2), hull.get(hull.size()-1), rem.get(i)) != 2) {
	                  hull.remove(hull.size() - 1);
	              }
	              hull.add(rem.get(i));
	          }
	          return hull;
	      }

	      static List<Point> mergeHulls(List<Point> left, List<Point> right) {
	          int n1 = left.size(), n2 = right.size();
	          int ia = 0, ib = 0;
	          for (int i = 1; i < n1; i++) if (left.get(i).x > left.get(ia).x) ia = i;
	          for (int i = 1; i < n2; i++) if (right.get(i).x < right.get(ib).x) ib = i;

	          int ia_u = ia, ib_u = ib;
	          boolean done = false;
	          while (!done) {
	              done = true;
	              while (orientation(right.get(ib_u), left.get(ia_u), left.get((ia_u - 1 + n1) % n1)) == 2) {
	                  ia_u = (ia_u - 1 + n1) % n1;
	                  done = false;
	              }
	              while (orientation(left.get(ia_u), right.get(ib_u), right.get((ib_u + 1) % n2)) == 1) {
	                  ib_u = (ib_u + 1) % n2;
	                  done = false;
	              }
	          }

	          int ia_l = ia, ib_l = ib;
	          done = false;
	          while (!done) {
	              done = true;
	              while (orientation(right.get(ib_l), left.get(ia_l), left.get((ia_l + 1) % n1)) == 1) {
	                  ia_l = (ia_l + 1) % n1;
	                  done = false;
	              }
	              while (orientation(left.get(ia_l), right.get(ib_l), right.get((ib_l - 1 + n2) % n2)) == 2) {
	                  ib_l = (ib_l - 1 + n2) % n2;
	                  done = false;
	              }
	          }

	          List<Point> merged = new ArrayList<>();
	          int idx = ia_u;
	          while (true) {
	              merged.add(left.get(idx));
	              if (idx == ia_l) break;
	              idx = (idx + 1) % n1;
	          }
	          idx = ib_l;
	          while (true) {
	              merged.add(right.get(idx));
	              if (idx == ib_u) break;
	              idx = (idx + 1) % n2;
	          }
	          return merged;
	      }

	      static List<Point> divideAndConquer(List<Point> points) {
	          if (points.size() <= 5) {
	              List<Point> hull = smallHull(points);
	              Point p0 = hull.get(0);
	              hull.sort(Comparator.comparingDouble(a -> Math.atan2(a.y - p0.y, a.x - p0.x)));
	              return hull;
	          }
	          points.sort((a, b) -> a.x != b.x ? Integer.compare(a.x, b.x) : Integer.compare(a.y, b.y));
	          int mid = points.size() / 2;
	          List<Point> left = new ArrayList<>(points.subList(0, mid));
	          List<Point> right = new ArrayList<>(points.subList(mid, points.size()));
	          List<Point> leftHull = divideAndConquer(left);
	          List<Point> rightHull = divideAndConquer(right);
	          return mergeHulls(leftHull, rightHull);
	      }

	      public static void main(String[] args) {
	          List<Point> points = new ArrayList<>(Arrays.asList(
	              new Point(0, 3), new Point(1, 1), new Point(2, 2), new Point(4, 4),
	              new Point(0, 0), new Point(1, 2), new Point(3, 1), new Point(3, 3)
	          ));
	          List<Point> hull = divideAndConquer(points);
	          System.out.println("Convex Hull:");
	          for (Point p : hull)
	              System.out.println("(" + p.x + ", " + p.y + ")");
	      }
	  }
	  ```

	  :::
	-
- # When to Use Divide and Conquer Convex Hull
  collapsed:: true
	- ## ✅ Use When:
		- You want to implement a highly scalable parallel algorithm for convex hulls on multi-core architectures.
		- The points can be cleanly partitioned along an axis (e.g., dynamic spatial database layouts).
	-
	- ## ❌ Avoid When:
		- You need a simple, single-threaded algorithm with low constant factor overhead — use **Andrew's Monotone Chain** or **Graham Scan**.
		- Memory consumption is a major concern (due to recursive overhead).
		-
- # Key Takeaways
	- **Sorting Base** — Relies on $O(N \log N)$ sorting of X-coordinates, similar to other sweep or partition geometry methods.
	- **Tangent walks** — Tangents represent outer boundaries. Walking pointers dynamically using orientation tests finds the tangents in $O(H)$ time.
	- **Linear Merge** — Merging two convex hulls with non-overlapping bounds is $O(N)$ because walking pointers traverses only the hull perimeters.
	-
- # More Learn
	- ## Related Pages
		- [[Convex Hull Jarvis March]] – Gift wrapping method
		- [[Convex Hull Graham Scan]] – Stack-based polar-sort algorithm
		- [[Convex Hull Quickhull]] – Quickhull algorithm
		- [[DSA Algo & System Design]] – Complete DSA checklist
