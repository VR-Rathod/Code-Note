---
seoTitle: Quadtree Complete Guide – 2D Spatial Partitioning
description: "A comprehensive reference on Quadtrees. Covers Point vs Region Quadtrees, recursive splitting, range queries, and collision detection with Python and C++ implementations."
keywords: "quadtree, spatial partitioning, 2D range search, collision detection, point quadtree, region quadtree, computational geometry, VR-Rathod, Code-Note, code note vr, vr book"
---

> [!info] What is a Quadtree?
> A **Quadtree** is a tree data structure used to partition a two-dimensional space by recursively subdividing it into four quadrants (NW, NE, SW, SE).
> It is primarily used for spatial indexing, collision detection, image compression, and geographic information systems (GIS).

- # Explanation
  - A **Quadtree** recursively partitions a 2D space. Each internal node has exactly four children.
  -
  - ## Real-World Analogy
    - **Google Maps Viewport**: When you are zoomed out to view a country, the map rendering engine doesn't need to load the locations of individual coffee shops. However, as you zoom in on a specific block, the map sub-divides that region to load highly detailed local markers. This viewport partitioning is modeled dynamically by a Quadtree.
  -
  - ## Why Quadtree?
    - Performing a range search (finding all points inside a rectangle) or collision detection on $N$ points in a flat list takes $O(N)$ time.
    - By partitioning the space using a Quadtree, we prune irrelevant regions of space instantly, bringing query times down to $O(\log N)$ on average.
    -
    - ### Point Quadtree vs. Region Quadtree
      - **Point Quadtree**: Each point inserted acts as the center for the split. The shape of the tree is dependent on the order of insertions, much like a standard Binary Search Tree (BST), which can become unbalanced.
      - **Region Quadtree (PR-Quadtree)**: The space is split into four equal-sized quadrants centered at the geometric midpoint. Splitting happens when a node's capacity (maximum points allowed) is exceeded. This is the standard choice for spatial databases and collision detection.
-
- # How It Works
  collapsed:: true
  - ## Core Mechanics
    - 1. **Bounding Box (AABB)**: Every node is bounded by a rectangle defined by its center `(x, y)` and half-dimensions `(w, h)`.
    - 2. **Capacity**: The threshold of points a node can hold. If exceeded, the node subdivides.
    - 3. **Subdivision**: Creating four child nodes:
      - **NW (North-West)**: Top-left quadrant.
      - **NE (North-East)**: Top-right quadrant.
      - **SW (South-West)**: Bottom-left quadrant.
      - **SE (South-East)**: Bottom-right quadrant.
    - 4. **Point Distribution**: Points are inserted into the leaf nodes. Upon subdivision, existing points in the leaf are distributed into the appropriate children to maintain the property that only leaves contain points.
  -
  - ## Visual Walkthrough
    - ### 2D Grid Subdivision
      - Below is an illustration of a $[0, 8] \times [0, 8]$ square divided when capacity is 1:
      - ```
        +-----------------------+ (8,8)
        |           |  o P3     |
        |    NW     |    NE     |
        |           |           |
        |-----------+-----------| (4,4)
        |  o P1     |           |
        |           |  o P2     |
        |    SW     |    SE     |
        +-----------------------+ (0,0)
        ```
    -
    - ### Corresponding Quadtree Structure
      - ```mermaid
        graph TD
            Root["Root Bounding Box [0, 8] x [0, 8]"]
            Root --> NW["NW [0, 4] x [4, 8]<br>(Empty)"]
            Root --> NE["NE [4, 8] x [4, 8]<br>(Contains P3)"]
            Root --> SW["SW [0, 4] x [0, 4]<br>(Contains P1)"]
            Root --> SE["SE [4, 8] x [0, 4]<br>(Contains P2)"]
        ```
-
- # Time & Space Complexity
  collapsed:: true
  - | Operation | Average Case | Worst Case (Degenerate) | Notes |
    |---|---|---|---|
    | **Insertion** | $O(\log N)$ | $O(N)$ or $O(H)$ | Worst case occurs when points cluster tightly or are collinear |
    | **Deletion** | $O(\log N)$ | $O(N)$ | Involves structural merging |
    | **Range Query** | $O(\log N + K)$ | $O(N)$ | $K$ is the number of points retrieved in the query range |
    | **Space Complexity** | $O(N)$ | $O(N \cdot H)$ | $H$ is the height, dependent on point density and boundary limits |
  - > [!tip] Preventing Infinite Recursion
    > If multiple duplicate points reside at the exact same coordinate, the capacity check will trigger subdivision infinitely. Practical implementations enforce a `min_size` limit under which a node will refuse to subdivide and instead bucket the duplicates.
-
- # Implementation
  collapsed:: true
  - :::code-tabs
    
    ```python
    class Point:
        def __init__(self, x, y, data=None):
            self.x = x
            self.y = y
            self.data = data # Store user-defined payload (e.g. game entities)

        def __repr__(self):
            return f"Point({self.x}, {self.y})"

    class Rectangle:
        def __init__(self, x, y, w, h):
            # x, y: center of the rectangle
            # w, h: half-width and half-height
            self.x = x
            self.y = y
            self.w = w
            self.h = h

        def contains(self, point):
            """Checks if a point is within the rectangle boundary."""
            return (self.x - self.w <= point.x <= self.x + self.w and
                    self.y - self.h <= point.y <= self.y + self.h)

        def intersects(self, range_rect):
            """Checks if this rectangle overlaps with another range rectangle."""
            return not (range_rect.x - range_rect.w > self.x + self.w or
                        range_rect.x + range_rect.w < self.x - self.w or
                        range_rect.y - range_rect.h > self.y + self.h or
                        range_rect.y + range_rect.h < self.y - self.h)

    class QuadTree:
        def __init__(self, boundary, capacity=4, min_size=1e-5):
            self.boundary = boundary
            self.capacity = capacity
            self.min_size = min_size # Prevent infinite subdivision from duplicates
            self.points = []
            self.divided = False
            self.nw = None
            self.ne = None
            self.sw = None
            self.se = None

        def subdivide(self):
            """Splits the current node into 4 quadrant children."""
            x = self.boundary.x
            y = self.boundary.y
            w = self.boundary.w / 2
            h = self.boundary.h / 2

            self.nw = QuadTree(Rectangle(x - w, y + h, w, h), self.capacity, self.min_size)
            self.ne = QuadTree(Rectangle(x + w, y + h, w, h), self.capacity, self.min_size)
            self.sw = QuadTree(Rectangle(x - w, y - h, w, h), self.capacity, self.min_size)
            self.se = QuadTree(Rectangle(x + w, y - h, w, h), self.capacity, self.min_size)
            self.divided = True

            # Re-distribute existing leaf points to children
            for p in self.points:
                self._insert_into_children(p)
            self.points.clear()

        def _insert_into_children(self, point):
            """Inserts point into matching child sub-quadrant."""
            if self.nw.insert(point): return True
            if self.ne.insert(point): return True
            if self.sw.insert(point): return True
            if self.se.insert(point): return True
            return False

        def insert(self, point):
            """Inserts a point into the Quadtree."""
            if not self.boundary.contains(point):
                return False

            if not self.divided:
                # If capacity is not exceeded, or we reached size limit, store it here
                if len(self.points) < self.capacity or self.boundary.w <= self.min_size:
                    self.points.append(point)
                    return True
                else:
                    self.subdivide()

            return self._insert_into_children(point)

        def query(self, range_rect, found_points=None):
            """Queries all points falling inside range_rect."""
            if found_points is None:
                found_points = []

            # If range does not intersect this quadrant, prune early
            if not self.boundary.intersects(range_rect):
                return found_points

            if not self.divided:
                # Leaf check
                for p in self.points:
                    if range_rect.contains(p):
                        found_points.append(p)
            else:
                # Search children recursively
                self.nw.query(range_rect, found_points)
                self.ne.query(range_rect, found_points)
                self.sw.query(range_rect, found_points)
                self.se.query(range_rect, found_points)

            return found_points
    ```

    ```c++
    #include <iostream>
    #include <vector>
    #include <string>
    #include <memory>

    struct Point {
        double x, y;
        std::string data;
        Point(double x, double y, std::string data = "") : x(x), y(y), data(data) {}
    };

    struct Rectangle {
        double x, y; // Center x, y coordinates
        double w, h; // Half-width and half-height dimensions
        Rectangle(double x, double y, double w, double h) : x(x), y(y), w(w), h(h) {}

        bool contains(const Point& point) const {
            return (point.x >= x - w && point.x <= x + w &&
                    point.y >= y - h && point.y <= y + h);
        }

        bool intersects(const Rectangle& range) const {
            return !(range.x - range.w > x + w ||
                     range.x + range.w < x - w ||
                     range.y - range.h > y + h ||
                     range.y + range.h < y - h);
        }
    };

    class QuadTree {
    private:
        Rectangle boundary;
        int capacity;
        double minSize;
        std::vector<Point> points;
        bool divided;

        // Child node pointers
        QuadTree* nw;
        QuadTree* ne;
        QuadTree* sw;
        QuadTree* se;

        void subdivide() {
            double x = boundary.x;
            double y = boundary.y;
            double w = boundary.w / 2.0;
            double h = boundary.h / 2.0;

            nw = new QuadTree(Rectangle(x - w, y + h, w, h), capacity, minSize);
            ne = new QuadTree(Rectangle(x + w, y + h, w, h), capacity, minSize);
            sw = new QuadTree(Rectangle(x - w, y - h, w, h), capacity, minSize);
            se = new QuadTree(Rectangle(x + w, y - h, w, h), capacity, minSize);
            divided = true;

            // Re-distribute points into children
            for (const auto& p : points) {
                insertIntoChildren(p);
            }
            points.clear();
        }

        bool insertIntoChildren(const Point& p) {
            if (nw->insert(p)) return true;
            if (ne->insert(p)) return true;
            if (sw->insert(p)) return true;
            if (se->insert(p)) return true;
            return false;
        }

    public:
        QuadTree(Rectangle boundary, int capacity = 4, double minSize = 1e-5)
            : boundary(boundary), capacity(capacity), minSize(minSize), divided(false),
              nw(nullptr), ne(nullptr), sw(nullptr), se(nullptr) {}

        ~QuadTree() {
            delete nw;
            delete ne;
            delete sw;
            delete se;
        }

        bool insert(const Point& p) {
            if (!boundary.contains(p)) {
                return false;
            }

            if (!divided) {
                if (points.size() < static_cast<size_t>(capacity) || boundary.w <= minSize) {
                    points.push_back(p);
                    return true;
                } else {
                    subdivide();
                }
            }

            return insertIntoChildren(p);
        }

        void query(const Rectangle& range, std::vector<Point>& found) const {
            if (!boundary.intersects(range)) {
                return;
            }

            if (!divided) {
                for (const auto& p : points) {
                    if (range.contains(p)) {
                        found.push_back(p);
                    }
                }
            } else {
                nw->query(range, found);
                ne->query(range, found);
                sw->query(range, found);
                se->query(range, found);
            }
        }
    };
    ```

    :::
-
- # When to Use
  collapsed:: true
  - ## ✅ Use Quadtree When:
    - You are building **2D game collision detection** systems (checking spatial overlaps between entities).
    - You are implementing spatial indexing for GIS engines (finding points within a radius or bounding box).
    - You need to perform image compression (recursively splitting detailed blocks, merging solid background blocks).
  - ## Avoid When:
    - Data resides in **1D space** (use simple [[Binary Search]] or BST variants).
    - Data is in **3D or higher dimensions** (use an Octree for 3D or a k-d tree for arbitrary dimensional spaces).
    - Data is highly dynamic, and coordinate updates happen continuously (updating points requires delete-then-re-insert, which can be computationally expensive).
-
- # Variations & Related Concepts
  collapsed:: true
  - **Octree**: The 3D equivalent of a Quadtree, dividing space into 8 octants.
  - **k-d Tree**: An alternative multi-dimensional partitioning structure that splits coordinates along one axis at a time.
  - **R-Tree**: Bounding box tree tailored for spatial databases where objects have volumes/areas.
-
- # Key Takeaways
  collapsed:: true
  - A Quadtree divides a 2D region into four sub-quadrants (NW, NE, SW, SE) recursively.
  - Spatial range queries run in $O(\log N + K)$ average-case time, vastly outperforming $O(N)$ brute-force array scans.
  - Region Quadtrees use a capacity threshold to decide when to subdivide a node.
  - Duplicate points can trigger infinite splitting unless bounded by a minimum node size (`min_size`).
  - Memory cleanup must recursively delete children to avoid memory leaks in systems languages like C++.
-
- # More Learn
  collapsed:: true
  - ## GitHub & Webs
    - [Wikipedia -> Quadtree](https://en.wikipedia.org/wiki/Quadtree)
    - [GeeksforGeeks -> Quad Tree](https://www.geeksforgeeks.org/quad-tree/)