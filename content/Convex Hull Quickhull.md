---
seoTitle: Convex Hull Quickhull – Partitioning & Triangle Pruning Guide
description: "Quickhull finds the convex hull of a 2D point set recursively by selecting farthest points and pruning points inside triangles. Covers O(n log n) average vs O(n^2) worst complexity, and implementations in Python, C++, JavaScript, and Java."
keywords: "convex hull, Quickhull, divide and conquer, computational geometry, farthest point, triangle pruning, O(n log n), worst case O(n^2), DSA, algorithms"
---

> [!info] What is Quickhull?
> **Quickhull** is a divide-and-conquer algorithm for finding the **Convex Hull** of a set of 2D points.
> Named for its structural similarity to **Quicksort**, it works by partitioning points using a splitting line, finding the farthest point, and pruning all points that fall inside the resulting triangle.
> **Average Complexity: O(n log n)** | **Worst-case Complexity: O(n²)**.

- # Explanation
  collapsed:: true
	- Quickhull recursively divides the point set by identifying extreme points and constructing boundaries. Unlike other divide and conquer algorithms that sort first and split in half, Quickhull partitions points geometrically.
	-
	- At each step, a point that is **farthest** from a baseline is identified. This point is guaranteed to be on the hull. Along with the baseline, it forms a **triangle**. Any point inside this triangle is strictly interior to the convex hull and can be immediately **pruned** (discarded), significantly speeding up execution.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine a large, irregular piece of **dough**. You pull it from the leftmost and rightmost edges (creating a baseline).
		- Then, you find the point that sticks out the most on top, and pinch the dough there, pulling it out. This forms a triangular shape. You can slice off and throw away any dough inside that triangle, as it can never form the outer crust. You repeat this pinching process on the remaining bulging parts of the dough until the crust is smooth.
	-
	- ## Advantages and Disadvantages
	  collapsed:: true
		- | | Detail |
		  |---|---|
		  | ✅ **Extremely Fast Average Case** | In practice, it is often the fastest algorithm because it prunes large numbers of interior points early |
		  | ✅ **Low Space Overhead** | In-place partitioning keeps memory footprint small |
		  | ❌ **Worst-Case Degradation** | Like Quicksort, if the partition is highly unbalanced, time complexity degrades to $O(N^2)$ |
		  | ❌ **Collinear/Precision Sensitivity** | Distance computations and collinear points require careful tolerance handling |
		-
- # Core Concept — Triangle Pruning & Partitioning
  collapsed:: true
	- ## The Partitioning Line
	  collapsed:: true
		- Given a line segment $AB$, we can classify any point $P$ based on which side of the line it lies:
		- ```
		  cross(A, B, P) = (B.x - A.x) * (P.y - A.y) - (B.y - A.y) * (P.x - A.x)

		  Result > 0  →  P is to the left of line AB
		  Result < 0  →  P is to the right of line AB
		  Result = 0  →  P is collinear with line AB
		  ```
		-
	- ## Farthest Point & Triangle Pruning
	  collapsed:: true
		- For the set of points to the left of $AB$, we find the point $C$ that maximizes the perpendicular distance to $AB$ (which is proportional to the cross product $\text{cross}(A, B, C)$).
		- Point $C$ forms a triangle $\triangle ABC$.
		- ```mermaid
		  flowchart TD
		      A["Line segment AB"] --> B["Find farthest point C"]
		      B --> C_pt["Point C is on the Hull"]
		      C_pt --> D["Form triangle ABC"]
		      D --> E["Prune all points inside ABC 🚫"]
		      D --> F["Recurse on points left of AC"]
		      D --> G["Recurse on points left of CB"]
		  ```
		-
- # Algorithm Steps
  collapsed:: true
	- ## Pseudocode
	  collapsed:: true
		- ```
		  INPUT:  set of 2D points
		  OUTPUT: list of hull points

		  1. Find leftmost point A and rightmost point B. Add A and B to Hull.
		  2. Split points into:
		     - S1: points to the left of A -> B
		     - S2: points to the left of B -> A
		  3. FindHull(S1, A, B)
		  4. FindHull(S2, B, A)
		  5. RETURN Hull

		  Function FindHull(P, A, B):
		     IF P is empty: RETURN
		     C ← point in P with maximum distance to AB
		     Add C to Hull (between A and B)
		     Split P into:
		       - P1: points to the left of A -> C
		       - P2: points to the left of C -> B
		     FindHull(P1, A, C)
		     FindHull(P2, C, B)
		  ```
		-
- # Time & Space Complexity
  collapsed:: true
	- ## Complexity Table
	  collapsed:: true
		- | Case | Time Complexity | Why |
		  |------|------|-----|
		  | **Best Case** | **$O(N)$** | When points are pruned in huge groups (e.g., highly clustered interior) |
		  | **Average Case** | **$O(N \log N)$** | Balanced partitioning at each recursive step |
		  | **Worst Case** | **$O(N^2)$** | Points distributed such that each step only prunes 1 point (e.g., points on a parabola) |
		  | **Space Complexity** | **$O(\log N)$ avg / $O(N)$ worst** | Stack space due to recursion depth |
		-
- # Implementation
  collapsed:: true
	- > [!note] Points inside the partition are filtered dynamically using cross-product signs.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs

	  ```python
	  def cross_product(a, b, c):
	      # Returns positive if c is to the left of ab, negative if to the right, 0 if collinear
	      return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])

	  def distance(a, b, c):
	      # Cross product is proportional to perpendicular distance
	      return abs(cross_product(a, b, c))

	  def quickhull(points):
	      n = len(points)
	      if n < 3:
	          return points

	      # 1. Find extreme points
	      min_x = min(points, key=lambda p: (p[0], p[1]))
	      max_x = max(points, key=lambda p: (p[0], p[1]))

	      hull = []

	      # Partition points to left and right of min_x -> max_x
	      left_set = []
	      right_set = []
	      for p in points:
	          if p == min_x or p == max_x:
	              continue
	          cp = cross_product(min_x, max_x, p)
	          if cp > 0:
	              left_set.append(p)
	          elif cp < 0:
	              right_set.append(p)

	      def find_hull(pts, p1, p2):
	          if not pts:
	              return []

	          # Find farthest point
	          farthest = max(pts, key=lambda p: distance(p1, p2, p))

	          # Points to the left of p1 -> farthest
	          s1 = [p for p in pts if cross_product(p1, farthest, p) > 0]
	          # Points to the left of farthest -> p2
	          s2 = [p for p in pts if cross_product(farthest, p2, p) > 0]

	          # Farthest point is part of hull, recurse on sides
	          return find_hull(s1, p1, farthest) + [farthest] + find_hull(s2, farthest, p2)

	      # Combine results: min_x -> upper hull -> max_x -> lower hull -> back to min_x
	      upper = find_hull(left_set, min_x, max_x)
	      lower = find_hull(right_set, max_x, min_x)

	      return [min_x] + upper + [max_x] + lower

	  # Example usage
	  pts = [(0, 3), (1, 1), (2, 2), (4, 4), (0, 0), (1, 2), (3, 1), (3, 3)]
	  print("Convex Hull (CCW order):", quickhull(pts))
	  # Output: [(0, 0), (3, 1), (4, 4), (0, 3)]
	  ```

	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  #include <cmath>

	  struct Point {
	      int x, y;
	  };

	  int crossProduct(Point a, Point b, Point c) {
	      return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
	  }

	  int distance(Point a, Point b, Point c) {
	      return std::abs(crossProduct(a, b, c));
	  }

	  void findHull(const std::vector<Point>& pts, Point p1, Point p2, std::vector<Point>& hull) {
	      if (pts.empty()) return;

	      // Find farthest point
	      int max_dist = -1;
	      Point farthest = pts[0];
	      for (const auto& p : pts) {
	          int dist = distance(p1, p2, p);
	          if (dist > max_dist) {
	              max_dist = dist;
	              farthest = p;
	          }
	      }

	      // Split remaining points
	      std::vector<Point> s1, s2;
	      for (const auto& p : pts) {
	          if (crossProduct(p1, farthest, p) > 0) s1.push_back(p);
	          else if (crossProduct(farthest, p2, p) > 0) s2.push_back(p);
	      }

	      findHull(s1, p1, farthest, hull);
	      hull.push_back(farthest);
	      findHull(s2, farthest, p2, hull);
	  }

	  std::vector<Point> quickHull(std::vector<Point>& points) {
	      int n = points.size();
	      if (n < 3) return points;

	      auto min_max = std::minmax_element(points.begin(), points.end(), [](Point a, Point b) {
	          return a.x < b.x || (a.x == b.x && a.y < b.y);
	      });

	      Point min_x = *min_max.first;
	      Point max_x = *min_max.second;

	      std::vector<Point> left_set, right_set;
	      for (const auto& p : points) {
	          if ((p.x == min_x.x && p.y == min_x.y) || (p.x == max_x.x && p.y == max_x.y))
	              continue;
	          int cp = crossProduct(min_x, max_x, p);
	          if (cp > 0) left_set.push_back(p);
	          else if (cp < 0) right_set.push_back(p);
	      }

	      std::vector<Point> hull;
	      hull.push_back(min_x);
	      findHull(left_set, min_x, max_x, hull);
	      hull.push_back(max_x);
	      findHull(right_set, max_x, min_x, hull);

	      return hull;
	  }

	  int main() {
	      std::vector<Point> points = {{0, 3}, {1, 1}, {2, 2}, {4, 4}, {0, 0}, {1, 2}, {3, 1}, {3, 3}};
	      auto hull = quickHull(points);
	      std::cout << "Convex Hull:\n";
	      for (auto p : hull)
	          std::cout << "(" << p.x << ", " << p.y << ")\n";
	      return 0;
	  }
	  ```

	  ```javascript
	  function crossProduct(a, b, c) {
	      return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
	  }

	  function distance(a, b, c) {
	      return Math.abs(crossProduct(a, b, c));
	  }

	  function quickHull(points) {
	      const n = points.length;
	      if (n < 3) return points;

	      let minX = points[0];
	      let maxX = points[0];
	      for (let i = 1; i < n; i++) {
	          if (points[i][0] < minX[0] || (points[i][0] === minX[0] && points[i][1] < minX[1])) minX = points[i];
	          if (points[i][0] > maxX[0] || (points[i][0] === maxX[0] && points[i][1] > maxX[1])) maxX = points[i];
	      }

	      const leftSet = [];
	      const rightSet = [];

	      for (const p of points) {
	          if (p === minX || p === maxX) continue;
	          const cp = crossProduct(minX, maxX, p);
	          if (cp > 0) leftSet.push(p);
	          else if (cp < 0) rightSet.push(p);
	      }

	      function findHull(pts, p1, p2) {
	          if (pts.length === 0) return [];

	          let farthest = pts[0];
	          let maxDist = -1;
	          for (const p of pts) {
	              const dist = distance(p1, p2, p);
	              if (dist > maxDist) {
	                  maxDist = dist;
	                  farthest = p;
	              }
	          }

	          const s1 = [];
	          const s2 = [];
	          for (const p of pts) {
	              if (crossProduct(p1, farthest, p) > 0) s1.push(p);
	              else if (crossProduct(farthest, p2, p) > 0) s2.push(p);
	          }

	          return [...findHull(s1, p1, farthest), farthest, ...findHull(s2, farthest, p2)];
	      }

	      return [minX, ...findHull(leftSet, minX, maxX), maxX, ...findHull(rightSet, maxX, minX)];
	  }

	  const points = [[0, 3], [1, 1], [2, 2], [4, 4], [0, 0], [1, 2], [3, 1], [3, 3]];
	  console.log("Convex Hull:", quickHull(points));
	  ```

	  ```java
	  import java.util.*;

	  public class ConvexHullQuickhull {
	      static class Point {
	          int x, y;
	          Point(int x, int y) { this.x = x; this.y = y; }
	      }

	      static int crossProduct(Point a, Point b, Point c) {
	          return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
	      }

	      static int distance(Point a, Point b, Point c) {
	          return Math.abs(crossProduct(a, b, c));
	      }

	      static void findHull(List<Point> pts, Point p1, Point p2, List<Point> hull) {
	          if (pts.isEmpty()) return;

	          int maxDist = -1;
	          Point farthest = pts.get(0);
	          for (Point p : pts) {
	              int dist = distance(p1, p2, p);
	              if (dist > maxDist) {
	                  maxDist = dist;
	                  farthest = p;
	              }
	          }

	          List<Point> s1 = new ArrayList<>();
	          List<Point> s2 = new ArrayList<>();
	          for (Point p : pts) {
	              if (crossProduct(p1, farthest, p) > 0) s1.add(p);
	              else if (crossProduct(farthest, p2, p) > 0) s2.add(p);
	          }

	          findHull(s1, p1, farthest, hull);
	          hull.add(farthest);
	          findHull(s2, farthest, p2, hull);
	      }

	      public static List<Point> quickHull(List<Point> points) {
	          int n = points.size();
	          List<Point> hull = new ArrayList<>();
	          if (n < 3) return points;

	          Point minX = points.get(0);
	          Point maxX = points.get(0);
	          for (Point p : points) {
	              if (p.x < minX.x || (p.x == minX.x && p.y < minX.y)) minX = p;
	              if (p.x > maxX.x || (p.x == maxX.x && p.y > maxX.y)) maxX = p;
	          }

	          List<Point> leftSet = new ArrayList<>();
	          List<Point> rightSet = new ArrayList<>();

	          for (Point p : points) {
	              if (p == minX || p == maxX) continue;
	              int cp = crossProduct(minX, maxX, p);
	              if (cp > 0) leftSet.add(p);
	              else if (cp < 0) rightSet.add(p);
	          }

	          hull.add(minX);
	          findHull(leftSet, minX, maxX, hull);
	          hull.add(maxX);
	          findHull(rightSet, maxX, minX, hull);

	          return hull;
	      }

	      public static void main(String[] args) {
	          List<Point> points = new ArrayList<>(Arrays.asList(
	              new Point(0, 3), new Point(1, 1), new Point(2, 2), new Point(4, 4),
	              new Point(0, 0), new Point(1, 2), new Point(3, 1), new Point(3, 3)
	          ));
	          List<Point> hull = quickHull(points);
	          System.out.println("Convex Hull:");
	          for (Point p : hull)
	              System.out.println("(" + p.x + ", " + p.y + ")");
	      }
	  }
	  ```

	  :::
	-
- # When to Use Quickhull
  collapsed:: true
	- ## ✅ Use When:
		- You expect a lot of internal/clustered points, where early triangle pruning can yield $O(N)$ execution.
		- In practice, Quickhull outperforms Graham Scan on random point distributions due to aggressive pruning.
	-
	- ## ❌ Avoid When:
		- The points lie strictly on a boundary (e.g., a circle or ellipse). Since no points can be pruned, it degrades to $O(N^2)$.
		- You require a worst-case guarantee of $O(N \log N)$ — use **Graham Scan** or **Andrew's Monotone Chain**.
		-
- # Key Takeaways
	- **Quicksort Analogy** — Splitting points around lines dynamically partitioned is identical to partitioning pivot ranges in sorting.
	- **Triangle Pruning** — A strong performance benefit: discarding interior points inside $\triangle ABC$ at each step leaves very few points to process.
	- **Worst-case $O(N^2)$** — Degrades when partition shapes are unbalanced, such as circular layout profiles.
	-
- # More Learn
	- ## Related Pages
		- [[Convex Hull Jarvis March]] – Gift wrapping method
		- [[Convex Hull Graham Scan]] – Stack-based polar-sort algorithm
		- [[Convex Hull Divide and Conquer]] – Divide and conquer merge-based algorithm
		- [[DSA Algo & System Design]] – Full algorithm reference
