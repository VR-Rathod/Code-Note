---
seoTitle: Line Sweep Algorithm – Geometric Processing & Sweep Status Guide
description: "Line sweep processes geometric events in sorted order to solve intersection and closest pair problems. Covers event queue, sweep line status, O(n log n) closest pair algorithm, and implementations in Python, C++, JavaScript, and Java."
keywords: "line sweep, sweep line, computational geometry, event queue, sweep line status, closest pair of points, O(n log n), time complexity, space complexity, geometric algorithm, Bentley-Ottmann"
treeTitle: DSA - Math & Geometry - Line Sweep Algorithm
---

> [!info] What is the Line Sweep Algorithm?
> The **Line Sweep Algorithm** is a fundamental computational geometry paradigm.
> It solves geometric problems by sweeping an imaginary vertical (or horizontal) line across the 2D plane, processing events at discrete points (stored in an **Event Queue**) and maintaining active geometric features in a **Sweep Line Status** structure.
> **Complexity: Typically O(n log n)**.

- # Explanation
  collapsed:: true
	- Many geometric problems seem to require $O(n^2)$ pairwise comparisons (e.g., checking if any two of $n$ segments intersect).
	-
	- The Line Sweep paradigm avoids this by processing elements in a sorted spatial order. By sweeping a line across the plane:
		- 1. We only focus on the **active region** (elements intersecting the sweep line).
		- 2. We only compare elements that are **adjacent** along the sweep line status.
	-
	- ## The Two Key Data Structures
	  collapsed:: true
		- | Structure | Purpose | Data Structure Type |
		  |---|---|---|
		  | **Event Queue** | Holds upcoming events sorted along the sweep direction (e.g. x-coordinate) | Array, Min-Heap, or Balanced BST |
		  | **Sweep Line Status** | Holds active segments intersecting the sweep line, ordered perpendicular to the sweep (e.g. y-coordinate) | Balanced BST (allows $O(\log n)$ insertion, deletion, and neighbor search) |
		-
		- ```mermaid
		  flowchart LR
		      EQ["Event Queue<br/>(Sorted by X)"] -->|"discrete step"| SL["Sweep Line x = c"]
		      SL -->|"updates"| SLS["Sweep Line Status<br/>(Ordered by Y)"]
		  ```
		-
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine a **scanner machine** copying a document.
		- The light bar (sweep line) moves vertically down the page. The scanner doesn't look at the whole page at once. It only processes the pixels directly underneath the light bar (sweep line status) at any given moment, updating its copy of the document as the bar passes over lines, margins, and text borders (event points).
	-
	- ## Common Applications
	  collapsed:: true
		- | Problem | Event Queue | Sweep Line Status | Complexity |
		  |---|---|---|---|
		  | **Segment Intersection (Bentley-Ottmann)** | Segment endpoints, intersection points | Active segments ordered by Y | $O((n + k) \log n)$ ($k$ intersections) |
		  | **Closest Pair of Points** | All points sorted by X | Active points within distance $d$ of sweep line, sorted by Y | $O(n \log n)$ |
		  | **Rectangle Area Union** | Left and right edges of rectangles | Active vertical intervals (via Segment Tree) | $O(n \log n)$ |
		-
- # Application: Closest Pair of Points
  collapsed:: true
	- The closest pair problem finds the two closest points in a 2D plane.
	- Rather than computing distances between all $O(n^2)$ pairs, we use Line Sweep:
	-
	- ## Algorithm Steps
	  collapsed:: true
		- 1. Sort points by X-coordinate.
		- 2. Maintain a running minimum distance $d$.
		- 3. Sweep from left to right. For each point $p$:
			- Remove points from the active set (sweep line status) whose X-coordinate is further than $d$ to the left of $p.x$.
			- Query the active set for points whose Y-coordinate is within $[p.y - d, p.y + d]$.
			- Calculate distance from $p$ to these candidates, and update $d$ if a smaller distance is found.
			- Insert $p$ into the active set.
		-
		- ```mermaid
		  flowchart TD
		      A["Sort points by X"] --> B["Initialize d = infinity"]
		      B --> C["For each point p"]
		      C --> D["Remove active points with X < p.x - d"]
		      D --> E["Search active points in Y-range [p.y - d, p.y + d]"]
		      E --> F["Update d if closer pair found"]
		      F --> G["Add p to active set"]
		      G --> H{"More points?"}
		      H -- Yes --> C
		      H -- No --> I["Return min distance d"]
		  ```
		-
- # Time & Space Complexity
  collapsed:: true
	- ## Complexity Table (Closest Pair)
	  collapsed:: true
		- | Operation | Time Complexity | Details |
		  |---|---|---|
		  | **Initial Sort** | $O(n \log n)$ | Sort by X |
		  | **Active Set Operations** | $O(n \log n)$ | Each point inserted/removed from BST exactly once ($O(\log n)$ per op) |
		  | **Neighbor Checks** | $O(n)$ | In 2D space, at most 5-6 points can reside in the search box; checks are $O(1)$ amortized |
		  | **Total Time** | **$O(n \log n)$** | Bottleneck is BST operations and initial sorting |
		  | **Space Complexity** | **$O(n)$** | To store sorted points and BST status |
		-
- # Implementation (Closest Pair of Points)
  collapsed:: true
	- > [!note] In Python and JavaScript, we use sorted lists/custom trees. In C++ and Java, we use standard library structures (`std::set`, `TreeSet`).
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs
	  
	  ```python
	  import math
	  from bisect import bisect_left
	  
	  def distance(p1, p2):
	      return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)
	  
	  def closest_pair(points):
	      # Sort by x
	      pts = sorted(points, key=lambda p: p[0])
	      n = len(pts)
	      if n <= 1:
	          return float('inf')
	  
	      # Active set ordered by Y. Stores tuples: (y, x)
	      # In Python, we can maintain sorting manually with bisect
	      active_set = []
	      
	      min_dist = distance(pts[0], pts[1])
	      left_idx = 0
	  
	      for i in range(n):
	          p = pts[i]
	          
	          # Remove points whose x-coordinate is too far from current sweep line
	          while pts[left_idx][0] < p[0] - min_dist:
	              # Remove from active set
	              active_set.remove((pts[left_idx][1], pts[left_idx][0]))
	              left_idx += 1
	              
	          # Find range of y coordinates within p[1] - min_dist and p[1] + min_dist
	          lower_bound = (p[1] - min_dist, -float('inf'))
	          upper_bound = (p[1] + min_dist, float('inf'))
	          
	          start_pos = bisect_left(active_set, lower_bound)
	          
	          # Check candidates
	          for j in range(start_pos, len(active_set)):
	              active_p = active_set[j]
	              if active_p[0] > p[1] + min_dist:
	                  break
	              dist = distance(p, (active_p[1], active_p[0]))
	              if dist < min_dist:
	                  min_dist = dist
	                  
	          # Insert current point (y, x) into active set
	          pos = bisect_left(active_set, (p[1], p[0]))
	          active_set.insert(pos, (p[1], p[0]))
	  
	      return min_dist
	  
	  # Example usage
	  points = [(2, 3), (12, 30), (40, 50), (5, 1), (12, 10), (3, 4)]
	  print("Closest Pair Distance:", closest_pair(points))
	  # Output: 1.4142135623730951 (between (2,3) and (3,4))
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  #include <cmath>
	  #include <set>
	  
	  struct Point {
	      double x, y;
	  };
	  
	  double dist(Point p1, Point p2) {
	      return std::sqrt((p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y));
	  }
	  
	  // Custom comparator to sort active set by Y, then X
	  struct CompareY {
	      bool operator()(const Point& a, const Point& b) const {
	          if (a.y != b.y) return a.y < b.y;
	          return a.x < b.x;
	      }
	  };
	  
	  double closestPair(std::vector<Point>& points) {
	      int n = points.size();
	      if (n <= 1) return 1e18;
	  
	      // Sort points by X-coordinate
	      std::sort(points.begin(), points.end(), [](Point a, Point b) {
	          return a.x < b.x;
	      });
	  
	      std::set<Point, CompareY> active;
	      double min_d = dist(points[0], points[1]);
	      int left = 0;
	  
	      for (int i = 0; i < n; i++) {
	          Point p = points[i];
	  
	          // Remove points out of sweep range
	          while (points[left].x < p.x - min_d) {
	              active.erase(points[left]);
	              left++;
	          }
	  
	          // Search active set in range [p.y - min_d, p.y + min_d]
	          Point lower_look = { -1e18, p.y - min_d };
	          auto start = active.lower_bound(lower_look);
	  
	          for (auto it = start; it != active.end(); ++it) {
	              if (it->y > p.y + min_d) break;
	              min_d = std::min(min_d, dist(p, *it));
	          }
	  
	          active.insert(p);
	      }
	  
	      return min_d;
	  }
	  
	  int main() {
	      std::vector<Point> points = {{2, 3}, {12, 30}, {40, 50}, {5, 1}, {12, 10}, {3, 4}};
	      std::cout << "Closest Pair Distance: " << closestPair(points) << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  function distance(p1, p2) {
	      return Math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2);
	  }
	  
	  function closestPair(points) {
	      const pts = [...points].sort((a, b) => a[0] - b[0]);
	      const n = pts.length;
	      if (n <= 1) return Infinity;
	  
	      // Active set stores active points sorted by Y
	      const active = [];
	      let minDist = distance(pts[0], pts[1]);
	      let leftIdx = 0;
	  
	      for (let i = 0; i < n; i++) {
	          const p = pts[i];
	  
	          // Remove points outside the vertical sweep band
	          while (pts[leftIdx][0] < p[0] - minDist) {
	              const rem = pts[leftIdx];
	              const remIdx = active.findIndex(pt => pt[0] === rem[0] && pt[1] === rem[1]);
	              if (remIdx !== -1) active.splice(remIdx, 1);
	              leftIdx++;
	          }
	  
	          // Find candidates in active set with y in [p[1] - minDist, p[1] + minDist]
	          // We search the sorted array
	          const lowerY = p[1] - minDist;
	          let j = 0;
	          while (j < active.length && active[j][1] < lowerY) {
	              j++;
	          }
	  
	          while (j < active.length && active[j][1] <= p[1] + minDist) {
	              minDist = Math.min(minDist, distance(p, active[j]));
	              j++;
	          }
	  
	          // Insert into sorted active set
	          let insertIdx = 0;
	          while (insertIdx < active.length && active[insertIdx][1] < p[1]) {
	              insertIdx++;
	          }
	          active.splice(insertIdx, 0, p);
	      }
	  
	      return minDist;
	  }
	  
	  const points = [[2, 3], [12, 30], [40, 50], [5, 1], [12, 10], [3, 4]];
	  console.log("Closest Pair Distance:", closestPair(points));
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class LineSweepClosestPair {
	      static class Point implements Comparable<Point> {
	          double x, y;
	          Point(double x, double y) { this.x = x; this.y = y; }
	  
	          @Override
	          public int compareTo(Point o) {
	              if (this.x != o.x) return Double.compare(this.x, o.x);
	              return Double.compare(this.y, o.y);
	          }
	      }
	  
	      static double dist(Point p1, Point p2) {
	          return Math.sqrt((p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y));
	      }
	  
	      public static double closestPair(Point[] points) {
	          int n = points.length;
	          if (n <= 1) return Double.MAX_VALUE;
	  
	          Arrays.sort(points); // Sort by X
	  
	          // TreeSet sorted by Y-coordinate, then X
	          TreeSet<Point> active = new TreeSet<>((a, b) -> {
	              if (a.y != b.y) return Double.compare(a.y, b.y);
	              return Double.compare(a.x, b.x);
	          });
	  
	          double minD = dist(points[0], points[1]);
	          int left = 0;
	  
	          for (int i = 0; i < n; i++) {
	              Point p = points[i];
	  
	              // Remove points too far left
	              while (points[left].x < p.x - minD) {
	                  active.remove(points[left]);
	                  left++;
	              }
	  
	              // Sub-range lookups: [p.y - minD, p.y + minD]
	              Point from = new Point(-Double.MAX_VALUE, p.y - minD);
	              Point to = new Point(Double.MAX_VALUE, p.y + minD);
	  
	              Set<Point> candidates = active.subSet(from, to);
	              for (Point cand : candidates) {
	                  minD = Math.min(minD, dist(p, cand));
	              }
	  
	              active.add(p);
	          }
	  
	          return minD;
	      }
	  
	      public static void main(String[] args) {
	          Point[] points = {
	              new Point(2, 3), new Point(12, 30), new Point(40, 50),
	              new Point(5, 1), new Point(12, 10), new Point(3, 4)
	          };
	          System.out.println("Closest Pair Distance: " + closestPair(points));
	      }
	  }
	  ```
	  
	  :::
	-
- # When to Use Line Sweep
  collapsed:: true
	- ## ✅ Use When:
		- You need to process geometric data that exhibits spatial locality (e.g., segment intersections, overlaps, area boundaries).
		- You want to reduce a 2D problem to a 1D sequence of operations on a status data structure.
	-
	- ## ❌ Avoid When:
		- The coordinates are high-dimensional ($D > 3$). Line sweep generalizes poorly to higher dimensions where spatial sorting doesn't partition space cleanly.
		- Points or segments move dynamically over time — use **Kd-Trees** or **R-Trees** instead.
		-
- # Key Takeaways
  collapsed:: true
	- **Dimension Reduction** — Line sweep reduces a 2D geometric search to a 1D coordinate scan (Event Queue) and a 1D sorted boundary tracking (Sweep Line Status).
	- **$O(N \log N)$ Complexity** — Achieved by sorting events initially, and utilizing binary search trees for logarithmic search/updates.
	- **Proximity Checks** — In many sweep patterns, checking adjacent neighbors in the sweep line status is sufficient to detect intersections or nearest pairs.
	-
- # More Learn
	- ## Related Pages
		- [[Convex Hull Jarvis March]] – Gift wrapping convex hull
		- [[Convex Hull Graham Scan]] – Stack-based polar angle sort hull
		- [[Convex Hull Divide and Conquer]] – Divide and conquer merge-based hull
		- [[Convex Hull Quickhull]] – Quickhull partition-based hull
		- [[DSA Algo & System Design]] – Complete DSA reference index