---
seoTitle: Convex Hull Jarvis March – Gift Wrapping Algorithm Guide
description: "Jarvis March (Gift Wrapping) finds the convex hull of a 2D point set by wrapping around outermost points. Covers orientation test, cross product, O(nh) complexity, and implementations in Python, C++, JavaScript, and Java."
keywords: "convex hull, Jarvis march, gift wrapping algorithm, computational geometry, orientation test, cross product, O(nh) complexity, DSA, algorithms, point set, convex polygon, jarvis algorithm, convex hull C++, convex hull Python, VR-Rathod, Code-Note, code note vr, vr book"
treeTitle: DSA - Math & Geometry - Convex Hull Jarvis March
---

> [!info] What is Jarvis March?
> **Jarvis March** (also called **Gift Wrapping**) finds the **Convex Hull** of a set of 2D points — the smallest convex polygon enclosing all points.
> It works by starting at the leftmost point and repeatedly wrapping to the most counter-clockwise point until the hull is closed.
> **Time Complexity: O(n·h)** where `n` = total points and `h` = hull points.

- # Explanation
  collapsed:: true
	- A **Convex Hull** is the smallest convex polygon containing all given points. Think of it as stretching a rubber band around the outermost points and letting it snap tight — the rubber band's shape is the convex hull.
	-
	- Jarvis March builds the hull one point at a time by finding which point makes the most **counter-clockwise** turn from the current direction. Named after **R.A. Jarvis (1973)**.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine nails hammered into a board at each point location. Stretch a rubber band around all the nails and let it snap tight — the rubber band's outline **is** the Convex Hull.
		- Jarvis March simulates this by "wrapping" around the outermost points in a counter-clockwise direction.
	-
	- ## Advantages and Disadvantages
	  collapsed:: true
		- | | Detail |
		  |---|---|
		  | ✅ **Simple** | Easy to understand and implement from scratch |
		  | ✅ **Output-sensitive** | Fast when the hull is small (`h` << `n`) |
		  | ✅ **Handles collinear** | With proper orientation check, manages collinear points correctly |
		  | ❌ **Slow for large h** | Degrades to O(n²) when all points are on the hull |
		  | ❌ **Better alternatives** | Graham Scan and Chan's Algorithm are faster for large input |
		-
- # Core Concept — Orientation Test
  collapsed:: true
	- ## What Is the Cross Product?
	  collapsed:: true
		- Given three ordered points **O**, **A**, **B** — the cross product of vectors OA and OB tells us their **turn direction**:
		- ```
		  cross(O, A, B) = (A.x - O.x) * (B.y - O.y)
		                 - (A.y - O.y) * (B.x - O.x)
		  
		  Result > 0  →  Counter-clockwise (left turn)  ← Jarvis March wants this
		  Result = 0  →  Collinear (no turn) — pick the farther point
		  Result < 0  →  Clockwise (right turn)
		  ```
		-
		- ```mermaid
		  flowchart LR
		      O["Point O<br/>(current)"] -->|"Cross product > 0"| CCW["Counter-Clockwise ✅<br/>Update candidate"]
		      O -->|"Cross product = 0"| COL["Collinear<br/>Pick farther point"]
		      O -->|"Cross product < 0"| CW["Clockwise ❌<br/>Keep current candidate"]
		  ```
		-
	- ## Why Cross Product Works
	  collapsed:: true
		- The cross product gives the **signed area** of the parallelogram formed by vectors OA and OB.
		- **Positive** area = B is to the left of the direction OA = counter-clockwise turn.
		- **Negative** area = B is to the right of the direction OA = clockwise turn.
		- **Zero** = O, A, and B are all on the same line.
		- Jarvis March always wants the **most counter-clockwise** candidate at every step.
		-
- # Algorithm Steps
  collapsed:: true
	- ## Pseudocode
	  collapsed:: true
		- ```
		  INPUT:  set of 2D points
		  OUTPUT: list of hull points in counter-clockwise order
		  
		  1. leftmost  ← point with smallest x-coordinate (guaranteed on hull)
		  2. current   ← leftmost
		  3. hull      ← []
		  
		  4. DO:
		     a. Add current to hull
		     b. candidate ← any other point (e.g., points[0])
		     c. FOR every point r in points:
		           IF cross(current, candidate, r) > 0:
		               candidate ← r      ← r is more counter-clockwise
		           ELSE IF cross == 0:
		               candidate ← farther point (by squared distance)
		     d. current ← candidate
		  5. WHILE current ≠ leftmost
		  
		  6. RETURN hull
		  ```
		-
	- ## Visual Walkthrough
	  collapsed:: true
		- Points: `(0,0)`, `(1,1)`, `(2,0)`, `(2,2)`, `(0,2)`
		- ```
		  Step 1: Start at leftmost → (0,0)
		          Scan all others → most CCW is (2,0)
		          Hull: [(0,0)]
		  
		  Step 2: current = (2,0)
		          Scan all → most CCW from (0,0)→(2,0) direction is (2,2)
		          Hull: [(0,0), (2,0)]
		  
		  Step 3: current = (2,2)
		          Scan all → most CCW is (0,2)
		          Hull: [(0,0), (2,0), (2,2)]
		  
		  Step 4: current = (0,2)
		          Scan all → most CCW brings us back to (0,0)
		          current == leftmost → STOP
		  
		  Final Hull: [(0,0), (2,0), (2,2), (0,2)]
		  Interior points NOT on hull: (1,1) — correctly excluded
		  ```
		- ```mermaid
		  flowchart LR
		      Start["Start<br/>(0,0) leftmost"] --> P1["→ (2,0)<br/>most CCW from start"]
		      P1 --> P2["→ (2,2)<br/>most CCW from (2,0)"]
		      P2 --> P3["→ (0,2)<br/>most CCW from (2,2)"]
		      P3 --> End["→ (0,0)<br/>back to start ✅<br/>Hull closed"]
		  ```
		-
	- ## Full Algorithm Flowchart
	  collapsed:: true
		- ```mermaid
		  flowchart TD
		      A["Find leftmost point<br/>current = leftmost"] --> B["Add current to hull"]
		      B --> C["candidate = points[0]"]
		      C --> D["For each point r in points"]
		      D --> E{"cross(current,<br/>candidate, r) > 0?"}
		      E -- Yes --> F["candidate = r<br/>(more CCW)"]
		      E -- No --> G{"cross == 0?<br/>(collinear)"}
		      G -- Yes --> H{"r farther<br/>than candidate?"}
		      H -- Yes --> F
		      H -- No --> I["Keep candidate"]
		      G -- No --> I
		      F --> D
		      I --> D
		      D --> J{"All points<br/>checked?"}
		      J -- No --> D
		      J -- Yes --> K["current = candidate"]
		      K --> L{"current ==<br/>leftmost?"}
		      L -- No --> B
		      L -- Yes --> M["✅ Return hull"]
		  ```
		-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > Jarvis March is **output-sensitive**: the more hull points, the slower it gets.
	  > Time = O(n·h) — for each of the `h` hull points, we scan all `n` points.
	  > See [[Complexity Analysis]] for a deeper guide on asymptotic analysis.
	-
	- ## Complexity Table
	  collapsed:: true
		- | Case | Time | Why |
		  |------|------|-----|
		  | **Best** | **O(n)** | Hull has only 3 points — 3 outer iterations only |
		  | **Average** | **O(n·h)** | `h` = number of hull points, each needs full scan |
		  | **Worst** | **O(n²)** | All `n` points are on the hull (e.g., points on a circle) |
		  | **Space** | **O(h)** | Only the hull points are stored |
		-
		- `h` = number of points on the convex hull.
		- When `h` is small (3–10), Jarvis March is very efficient.
		- When `h ≈ n` (e.g., all points on the perimeter of a circle), it degrades to O(n²).
		-
	- ## Convex Hull Algorithm Comparison
	  collapsed:: true
		- | Algorithm | Time | Best When |
		  |---|---|---|
		  | **Jarvis March** | O(n·h) | Simple implementation needed; `h` is very small |
		  | **Graham Scan** | O(n log n) | General purpose; `n` is large |
		  | **Chan's Algorithm** | O(n log h) | Optimal output-sensitive performance |
		  | **Quickhull** | O(n log n) avg | Divide and conquer; fast in practice |
		  | **Andrew's Monotone Chain** | O(n log n) | Clean, robust, easy to implement after sorting |
		-
		- ```mermaid
		  flowchart LR
		      All["All Convex Hull<br/>Algorithms"] --> JM["Jarvis March<br/>O(n·h)<br/>Output-sensitive"]
		      All --> GS["Graham Scan<br/>O(n log n)<br/>Sort-based"]
		      All --> CA["Chan's Algorithm<br/>O(n log h)<br/>Optimal"]
		      All --> QH["Quickhull<br/>O(n log n) avg<br/>Divide & conquer"]
		  ```
		-
- # Implementation
  collapsed:: true
	- > [!note] All implementations below return the convex hull as an ordered list of points.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs
	  
	  ```python
	  def cross(O, A, B):
	      """
	      Cross product of vectors OA and OB.
	      > 0: counter-clockwise, = 0: collinear, < 0: clockwise
	      """
	      return (A[0] - O[0]) * (B[1] - O[1]) - (A[1] - O[1]) * (B[0] - O[0])
	  
	  def jarvis_march(points):
	      """
	      Jarvis March (Gift Wrapping) Algorithm
	      Time: O(n*h) | Space: O(h)
	      Returns convex hull vertices in counter-clockwise order.
	      """
	      n = len(points)
	      if n < 3:
	          return points
	  
	      # Start from the leftmost point (guaranteed on hull)
	      start = min(points, key=lambda p: p[0])
	      hull = []
	      current = start
	  
	      while True:
	          hull.append(current)
	          candidate = points[0]
	  
	          for point in points[1:]:
	              c = cross(current, candidate, point)
	              if c > 0:
	                  candidate = point      # More counter-clockwise
	              elif c == 0:
	                  # Collinear — pick the farther point
	                  d1 = (point[0]-current[0])**2 + (point[1]-current[1])**2
	                  d2 = (candidate[0]-current[0])**2 + (candidate[1]-current[1])**2
	                  if d1 > d2:
	                      candidate = point
	  
	          current = candidate
	          if current == start:    # Hull is closed
	              break
	  
	      return hull
	  
	  # Example
	  points = [(0,0), (1,1), (2,0), (2,2), (0,2), (1,0)]
	  hull = jarvis_march(points)
	  print("Convex Hull:", hull)
	  # Output: [(0,0), (2,0), (2,2), (0,2)]
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <vector>
	  
	  struct Point {
	      int x, y;
	  };
	  
	  // Cross product of vectors OA and OB
	  // > 0 : counter-clockwise
	  // = 0 : collinear
	  // < 0 : clockwise
	  int cross(Point O, Point A, Point B) {
	      return (A.x - O.x) * (B.y - O.y)
	           - (A.y - O.y) * (B.x - O.x);
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
	                  // Collinear — pick the farther point
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
	  
	      std::cout << "Convex Hull:\n";
	      for (auto& p : hull)
	          std::cout << "(" << p.x << ", " << p.y << ")\n";
	      // (0,0) → (2,0) → (2,2) → (0,2)
	  
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  // Cross product of vectors OA and OB
	  // > 0: counter-clockwise, = 0: collinear, < 0: clockwise
	  function cross(O, A, B) {
	      return (A[0] - O[0]) * (B[1] - O[1])
	           - (A[1] - O[1]) * (B[0] - O[0]);
	  }
	  
	  function jarvisMarch(points) {
	      const n = points.length;
	      if (n < 3) return points;
	  
	      // Find leftmost point
	      let start = points.reduce((a, b) => a[0] < b[0] ? a : b);
	      const hull = [];
	      let current = start;
	  
	      do {
	          hull.push(current);
	          let candidate = points[0];
	  
	          for (const point of points) {
	              const c = cross(current, candidate, point);
	              if (c > 0) {
	                  candidate = point;   // More counter-clockwise
	              } else if (c === 0) {
	                  // Collinear — pick farther point
	                  const d1 = (point[0]-current[0])**2 + (point[1]-current[1])**2;
	                  const d2 = (candidate[0]-current[0])**2 + (candidate[1]-current[1])**2;
	                  if (d1 > d2) candidate = point;
	              }
	          }
	  
	          current = candidate;
	      } while (current !== start && JSON.stringify(current) !== JSON.stringify(start));
	  
	      return hull;
	  }
	  
	  const points = [[0,0],[1,1],[2,0],[2,2],[0,2],[1,0]];
	  console.log("Convex Hull:", jarvisMarch(points));
	  // [[0,0],[2,0],[2,2],[0,2]]
	  ```
	  
	  ```java
	  import java.util.ArrayList;
	  import java.util.List;
	  
	  public class JarvisMarch {
	  
	      static int cross(int[] O, int[] A, int[] B) {
	          // Cross product of vectors OA and OB
	          // > 0: CCW, = 0: collinear, < 0: CW
	          return (A[0] - O[0]) * (B[1] - O[1])
	               - (A[1] - O[1]) * (B[0] - O[0]);
	      }
	  
	      static List<int[]> jarvisMarch(int[][] points) {
	          int n = points.length;
	          List<int[]> hull = new ArrayList<>();
	          if (n < 3) return hull;
	  
	          // Find leftmost point
	          int leftmost = 0;
	          for (int i = 1; i < n; i++)
	              if (points[i][0] < points[leftmost][0])
	                  leftmost = i;
	  
	          int current = leftmost;
	          do {
	              hull.add(points[current]);
	              int candidate = (current + 1) % n;
	  
	              for (int i = 0; i < n; i++) {
	                  int c = cross(points[current], points[candidate], points[i]);
	                  if (c > 0) {
	                      candidate = i;   // More counter-clockwise
	                  } else if (c == 0) {
	                      // Collinear — pick farther
	                      long dx1 = points[i][0] - points[current][0];
	                      long dy1 = points[i][1] - points[current][1];
	                      long dx2 = points[candidate][0] - points[current][0];
	                      long dy2 = points[candidate][1] - points[current][1];
	                      if (dx1*dx1 + dy1*dy1 > dx2*dx2 + dy2*dy2)
	                          candidate = i;
	                  }
	              }
	              current = candidate;
	          } while (current != leftmost);
	  
	          return hull;
	      }
	  
	      public static void main(String[] args) {
	          int[][] points = {{0,0},{1,1},{2,0},{2,2},{0,2},{1,0}};
	          List<int[]> hull = jarvisMarch(points);
	          System.out.println("Convex Hull:");
	          for (int[] p : hull)
	              System.out.println("(" + p[0] + ", " + p[1] + ")");
	          // (0,0) → (2,0) → (2,2) → (0,2)
	      }
	  }
	  ```
	  
	  :::
	-
- # Collinear Point Handling
  collapsed:: true
	- > [!warning] Collinear Points Can Break Naïve Implementations
	  > If three or more points are perfectly collinear on the hull boundary, a naïve cross-product check returns 0 and the algorithm may add **intermediate collinear points** to the hull or skip the correct endpoint.
	  > The fix: when the cross product is 0, **always pick the farther point** from the current position.
	-
	- ```mermaid
	  flowchart TD
	      A["cross(O, A, B) == 0<br/>Points are collinear"] --> B{"Which point<br/>is farther from O?"}
	      B -- "B is farther" --> C["candidate = B<br/>Skip intermediate A"]
	      B -- "A is farther" --> D["Keep A as candidate<br/>B is intermediate"]
	  ```
	-
- # When to Use Jarvis March
  collapsed:: true
	- ## ✅ Use Jarvis March When
		- The convex hull is **small** (`h` << `n`) — the algorithm runs in near-linear time
		- You need a **simple, readable** implementation to understand convex hull concepts
		- The dataset is **moderate** in size (hundreds to low thousands of points)
		- You are building a **teaching or prototype** implementation
	-
	- ## ❌ Avoid Jarvis March When
		- Hull may contain **many points** (e.g., points distributed on a circle) — use **[[Convex Hull Graham Scan]] O(n log n)**
		- `n` is very large (tens of thousands+) and `h` is unpredictable — use **Chan's Algorithm O(n log h)**
		- You need **guaranteed O(n log n)** performance regardless of output size
		-
- # Key Takeaways
  collapsed:: true
	- **Gift Wrapping analogy** — start at the leftmost point, keep "wrapping" to the most counter-clockwise candidate until you return to the start.
	- **Core operation** — the **cross product** determines turn direction (CCW, collinear, or CW).
	- **Output-sensitive** — time is **O(n·h)**, best when `h` is small and degrades to O(n²) when all points are on the hull.
	- **Collinear handling** — when cross product is zero, always pick the **farther** point to correctly skip intermediate collinear vertices.
	- **Alternatives** — prefer [[Convex Hull Graham Scan]] for large inputs, Chan's Algorithm for optimal output-sensitive performance.
	- See [[Complexity Analysis]] for the full mathematical breakdown of O(n·h).
	-
- # More Learn
	- ## GitHub & Webs
		- [TheAlgorithms – Convex Hull](https://github.com/TheAlgorithms/Python/blob/master/computational_geometry/convex_hull.py)
		- [Visualgo – Convex Hull Visualization](https://visualgo.net/en/convexhull)
		- [CP-Algorithms – Convex Hull](https://cp-algorithms.com/geometry/convex-hull.html)
	- ## Related Pages
		- [[Convex Hull Graham Scan]] – O(n log n) sort-based convex hull
		- [[Convex Hull Divide and Conquer]] – divide and conquer approach
		- [[Convex Hull Quickhull]] – fast average-case divide and conquer
		- [[DSA Algo & System Design]] – Full algorithm reference
		- [[Complexity Analysis]] – Understanding O(n·h) mathematically