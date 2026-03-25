---
seoTitle: Line Sweep Algorithm – Computational Geometry Technique Guide
description: "Line sweep processes geometric events in sorted order to solve intersection and area problems. Covers event queue, sweep line, interval tree, and O(n log n)."
keywords: "line sweep, sweep line, computational geometry, event queue, interval intersection, O(n log n), time complexity, space complexity, geometric algorithm, segment intersection"
---

# Explanation
	- The **Line Sweep Algorithm** is used to solve geometric problems like finding intersections of line segments, closest pair of points, and convex hulls. It involves sweeping a line across the plane, processing events (like endpoints or intersections) in order, and maintaining a data structure to store active segments.
-
- # Steps
	- **Sort** the events (endpoints, intersections, etc.).
	-
	- **Initialize** a data structure to maintain active elements (e.g., active segments).
	-
	- **Process events** in order, updating the data structure as the line sweeps.
	-
	- **Handle each event** depending on the problem (e.g., checking for intersections, updating active segments).
	-
	- **Return** the result (e.g., number of intersections).
-
- # Time Complexity
	- **Time complexity**: O(n log n), where `n` is the number of events. Sorting the events and updating the data structure each take logarithmic time.
-
- ```python
  import sortedcontainers
  
  class LineSweep:
      def __init__(self):
          self.events = []  # Events are sorted by x-coordinates
          self.active = sortedcontainers.SortedList()  # Active segments
      
      # Function to add events and process them
      def add_event(self, event):
          self.events.append(event)
      
      # Process the events
      def process_events(self):
          self.events.sort(key=lambda e: e[0])  # Sort by x-coordinate
          for event in self.events:
              print(f"Processing event: {event}")
              # Active segment management and other processing here
  
  # Example usage:
  events = [(1, 2), (3, 4), (5, 6)]  # Sample events
  line_sweep = LineSweep()
  for event in events:
      line_sweep.add_event(event)
  line_sweep.process_events()
  ```