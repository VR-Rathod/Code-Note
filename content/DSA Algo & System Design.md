---
date: 2026-03-31T18:59:53+05:30
lastmod: 2026-05-22T17:59:04+05:30

seoTitle: DSA and System Design Reference – Interview Preparation Guide
description: "Data structures, algorithms, and system design reference for technical interviews. Covers arrays, trees, graphs, sorting, design patterns, scalability, and."
keywords: "DSA, data structures, algorithms, system design, technical interview, arrays, trees, graphs, sorting, design patterns, scalability, coding interview, dsa notes, dsa cheatsheet, dsa guide, algorithm reference, competitive programming, VR-Rathod, Code-Note, code note vr, vr book"
---

- # OOP consepts
  collapsed:: true
	- ## The  **core concepts**  of OOP are indeed  **14** :-
	  collapsed:: true
		- [[Class]] - Blueprint for creating objects, defining properties and methods.
		  logseq.order-list-type:: number
		- [[Constructor]] - Special method for initializing objects when created.
		  logseq.order-list-type:: number
		- [[Destructors]] - Method for cleaning up when an object is destroyed or goes out of scope.
		  logseq.order-list-type:: number
		- [[Object]] - An instance of a class containing data and behavior.
		  logseq.order-list-type:: number
		- [[Encapsulation]] - Bundling data and methods, restricting direct access to an object's internal state.
		  logseq.order-list-type:: number
		- [[Abstraction]] - Hiding complex implementation details and exposing only essential features.
		  logseq.order-list-type:: number
		- [[Inheritance]] - Mechanism by which one class derives properties and behaviors from another.
		  logseq.order-list-type:: number
		- [[Polymorphism]] - Ability for objects of different types to be treated as instances of a common superclass.
		  logseq.order-list-type:: number
		- [[Composition]] - Creating complex objects by combining simpler objects, a "has-a" relationship.
		  id:: 67e63024-2a0a-4a19-aff1-05ad33f056cf
		  logseq.order-list-type:: number
		- [[Interface]] - Defines a contract that classes must follow, without providing implementation.
		  logseq.order-list-type:: number
		- [[Method Overloading]] - Defining multiple methods with the same name but different parameters.
		  logseq.order-list-type:: number
		- [[Method Overriding]] - Redefining a method in a subclass to change its behavior.
		  logseq.order-list-type:: number
		- [[Static Methods and Class Methods]] - Methods that belong to the class rather than instances.
		  logseq.order-list-type:: number
		- [[Dynamic Binding (Late Binding)]] - Resolving method calls at runtime based on the object type.
		  logseq.order-list-type:: number
	-
	- ## **additional related concepts** or **design patterns** that can supplement or extend OOP are:-
		- [[Delegation]] - One object handing over responsibilities to another.
		- [[Mixin]] - A class that provides functionality to other classes without being a parent class.
		- [[Abstract Classes]] - Classes that cannot be instantiated and may contain abstract methods.
		- [[Loose Coupling and High Cohesion]] - Reducing dependencies between components and ensuring focused class responsibilities
		- [[Factory Pattern]] - Creating objects without specifying the exact class of object to be created.
		- [[Observer Pattern]] - Notifying multiple objects about state changes in another object.
		- [[Singleton Pattern]] - Ensuring a class has only one instance and providing a global point of access.
-
- # Complexity Analysis
	- [[Complexity Analysis]] - Complete guide to time and space complexity, Big O notation, and algorithm mathematics.
-
- # Data Structures
	- ## Linear Data Structures:
		- 1) [[Arrays]] - Contiguous memory structures covering static and dynamic arrays, multi-dimensional indexing, and amortized time analysis.
		- 2) [[Linked Lists]] - Sequential data nodes covering singly, doubly, and circular configurations with insertion/deletion algorithms.
		- 3) [[Stacks]] - LIFO (Last-In, First-Out) operations, execution call stacks, and monotonic stack patterns for range queries.
		- 4) [[Queues]] - FIFO (First-In, First-Out) structures including circular queues, double-ended queues (Deques), and priority queue scheduling.
		- 5) [[Hash Tables]] - Key-value mapping mechanisms, hashing functions, and collision resolution techniques like chaining and open addressing.
		- 6) [[Circular buffer]] - Fixed-size ring buffer implementation supporting circular queues, overwritten streaming data, and concurrency-safe queue bounds.
	- ## Trees:
		- ### Basic Trees:
			- 1) [[Binary Tree]] - Hierarchical structure where each node has at most two children.
			- 2) [[Binary Search Tree (BST)]] - Node-based binary tree with ordered left and right subtrees.
			- 3) [[Heap (Data Structure)]] - Complete binary tree that satisfies the heap property for priority sorting.
			- 4) [[Trie (Prefix Tree)]] - Search tree used for efficient prefix retrieval of keys over a character alphabet.
			- 5) [[Segment Tree]] - Tree structure used for storing interval information and answering range queries.
		- ### Advanced Trees:
			- 1) [[AA Tree]] - self-balancing binary search tree
			- 2) [[Binary Indexed Tree or Fenwick Tree]] - Efficiently supports dynamic prefix sums and point updates.
			- 3) [[Cartesian Tree]] - the inorder traversal of the tree gives a sorted sequence
			- 4) [[Counted B-Trees]] - efficient range queries
			- 5) [[Crit-bit Trees]] - storing strings, especially strings of arbitrary length
			- 6) [[Fibonacci heap]] - optimize priority queues and supports very efficient
			- 7) [[Finger Tree]] - supports efficient access and updates
			- 8) [[Interval Tree]] - binary search tree used to store intervals.
			- 9) [[Quadtree]] - used to partition a two-dimensional space
			- 10) [[Scapegoat Tree]] - self-balancing binary search tree
			- 11) [[Splay Tree]] - the accessed element to the root via **splaying**
			- 12) [[Suffix Tree]] - efficient string matching, substring search, and various other
			- 13) [[Van Emde Boas Tree]] - supports **efficient priority queue** operations.
	- ## Graphs:
		- 1) [[Graph Representations]] - Complete guide to representing graphs using Adjacency Lists, Adjacency Matrices, and Edge Lists with complexity tradeoffs.
		- 2) [[Directed & Undirected Graphs]] - Overview of graph directionality, vertex degrees, and fundamental pathing terminology.
		- 3) [[Weighted & Unweighted Graphs]] - Storing edge weights in matrices/lists and their application in shortest-path and MST algorithms.
		- 4) [[Bipartite Graphs]] - Understanding bipartite structure, odd-length cycle checks, and the 2-coloring detection algorithm.
	- ## Advanced & Specialized Data Structures:
		- 1) [[Disjoint-set Data Structure]] (Union-Find) - Near-constant time dynamic connectivity tracking utilizing path compression and union by rank.
		- 2) [[Bloom Filter]] - Space-efficient probabilistic data structure used for set membership queries with zero false negatives.
		- 3) [[Rope (Data Structure)]] - Binary tree-based string representation optimized for efficient concatenation and substring manipulation of large texts.
		- 4) [[Zipper]] - Functional cursor pattern enabling efficient, purely functional traversal and localized edits of tree structures.
		- 5) [[Binary Decision Diagram]] - Compact canonical representation of boolean functions supporting efficient boolean operations.
		- 6) [[Cuckoo Hashing]] - Hash table resolution scheme utilizing multiple tables and element displacement to guarantee O(1) worst-case lookup.
		- 7) [[Zobrist Hashing]] - Incremental XOR hashing method used to cache and identify game states in transposition tables.
		- 8) [[FM-index]] - Compressed full-text substring search index utilizing the Burrows-Wheeler Transform and Suffix Array.
		- 9) [[Winged Edge]] - Boundary representation topology for 3D polygon meshes supporting constant-time adjacency traversal.
		- 10) [[Five Balltree Construction Algorithms]] - Hierarchical spatial indexing that partitions metric spaces into nested hyperspheres for fast nearest neighbor search.
		- 11) [[Binary Space Partitioning]] - Pre-computed spatial subdivision tree that partitions geometry using hyperplanes for rendering order.
-
- # Algorithms
	- ## Searching & Graph Traversal:
		- 1) [[Linear Search]] - check each element in list one by one until we find the target element.
		- 2) [[Binary Search]] - efficient algorithm to find an element in a **sorted** array.
		- 3) [[Depth First Search]] - explores as far as possible along each branch before backtracking.
		- 4) [[Breadth First Search]] - explores all the neighboring nodes at the present level
		- 5) [[A* Search Algorithm]] - Heuristic-based pathfinding algorithm that finds the shortest path using distance and estimated cost.
	-
	- ## Sorting:
		- 1) [[Bubble Sort]] - In-place comparison sort that repeatedly swaps adjacent elements if they are out of order, optimized with an early-termination flag.
		- 2) [[Selection Sort]] - In-place comparison sort that divides the list into sorted and unsorted parts, iteratively selecting and swapping the minimum element to minimize swaps.
		- 3) [[Insertion Sort]] - In-place comparison sort that builds the sorted array one element at a time, highly efficient for small or nearly sorted datasets.
		- 4) [[Merge Sort]] - Stable divide-and-conquer sorting algorithm that recursively splits the array and merges sorted sub-arrays, guaranteeing O(n log n) time.
		- 5) [[Quick Sort]] - In-place divide-and-conquer algorithm utilizing randomized pivoting (Hoare/Lomuto) to achieve highly optimized O(n log n) average performance.
		- 6) [[Heap Sort]] - In-place comparison sort that utilizes a binary max-heap structure to iteratively extract the maximum element in O(n log n) time.
		- 7) [[Counting Sort]] - Non-comparison integer sorting algorithm that uses cumulative frequency counts of key occurrences to achieve O(n + k) linear time.
		- 8) [[Radix Sort]] - Non-comparison integer sort that processes elements digit-by-digit from Least Significant Digit (LSD) to Most Significant Digit (MSD) in O(d * (n + k)) time.
		- 9) [[Bucket Sort]] - Distribution-based sort that normalizes elements into uniform interval buckets, sorting each bucket with Insertion Sort to achieve stable O(n + k) average time.
		- 10) [[Shell Sort]] - In-place comparison sort generalizing Insertion Sort by comparing elements across a diminishing gap sequence to eliminate far-apart inversions.
		- 11) [[Comb Sort]] - In-place comparison sort improving on Bubble Sort by using a shrink factor gap sequence to eliminate slow-moving 'turtle' elements.
		- 12) [[Pigeonhole Sort]] - Stable non-comparison integer sort that maps elements to individual key pigeonholes, optimal when the range of keys matches the array size.
		- 13) [[Cycle Sort]] - In-place comparison sort that minimizes the total number of memory writes to at most O(n), optimal for write-sensitive hardware (Flash/EEPROM).
	-
	- ## String Algorithms:
		- 1) [[Knuth Morris Pratt Algorithm (KMP)]] - string searching algorithm that bypasses redundant comparisons using a failure function.
		- 2) [[Rabin-Karp Algorithm]] - string searching used to find a pattern within a larger text.
		- 3) [[Z Algorithm]] - Linear-time pattern matching using the prefix-based Z-array, detailing string compression and periodicity check variants.
		- 4) [[Manachers Algorithm]] - Finding the longest palindromic substring in O(N) time with string transformation, symmetry mirroring, and palindromic count variants.
		- 5) [[burrows-wheeler-transform]] - Reversible string transformation for text compression, featuring cyclic rotations, suffix sorting, and stable inverse BWT decoding.
		- 6) [[Aho Corasick Algorithm]] - Multi-pattern dictionary matching using a trie with suffix/dictionary link optimization and automated transition variants.
	-
	- ## Graph Algorithms:
		- 1) [[Dijkstras Algorithm]] - find the shortest paths from a source vertex-other vertices
		- 2) [[Bellman Ford Algorithm]] - dynamic algorithm used for finding the shortest path
		- 3) [[Floyd Warshall Algorithm]] - finding the shortest paths between all pairs
		- 4) [[Johnson Algorithm]] - find **all pairs shortest paths** in a weighted directed graph.
		- 5) [[Kruskal Algorithm]] - algorithm used to find the (MST) of a graph.
		- 6) [[Prims Algorithm]] - algorithm used to find the MST of a graph
		- 7) [[Boruvkas Algorithm]] - algorithm used to find theMST of a graph.
		- 8) [[Kosarajus Algorithm]] - find the SCC of a directed graph.
		- 9) [[Tarjans Algorithm]] - algorithm used to find SCCs in a directed graph.
		- 10) [[Topological Sort Algorithm]] - used to order the vertices of a **directed acyclic graph**
		- 11) [[Flood Fill Algorithm]] - used to determine the area connected to a given node
		- 12) [[Lee Algorithm]] - BFS based algorithm used to find the shortest path
		- 13) [[Eukerian Path (Hierholzer's Algorithm)]] - path that visits every edge exactly once.
	-
	- ## Arrays & Two Pointers:
		- 1) [[Kadane's Algorithm]] - used to find the **maximum sum subarray**
		- 2) [[Floyd Cycle Detection Algorithm]] - also known as **Tortoise and Hare**
		- 3) [[Quick Select Algorithm]] - find the **k-th smallest element**
		- 4) [[Boyer-More Majority Vote]] - used to find the **majority element**
		- 5) [[MO’s Algorithm (Query square root decomposition)]] - square root decomposition technique
		- 6) [[Distinct elements in subarray using Mo’s Algorithm]] - square root decomposition
		- 7) [[Two Pointers Technique]] - Efficient linear search method using two pointers in opposite or same directions to solve pair matching and subarray problems.
		- 8) [[Sliding Window Technique]] - Subarray/substring analysis method maintaining a range window to reduce O(N^2) search spaces to linear O(N) time.
		- 9) [[Prefix Sum Array]] - Pre-computation strategy enabling O(1) range sum queries on static arrays across 1D and 2D bounds.
	-
	- ## Dynamic Programming (DP):
		- 1) [[Dynamic Programming Concepts]] - Core paradigms of overlapping subproblems and optimal substructure using Memoization (Top-down) or Tabulation (Bottom-up).
		- 2) [[0/1 Knapsack Problem]] - Classic optimization problem of selecting items with weights and values, including space-optimized dynamic programming techniques.
		- 3) [[Longest Common Subsequence (LCS)]] - Subsequence similarity matching utilizing a dynamic programming matrix for DNA alignment and diff tools.
		- 4) [[Longest Increasing Subsequence (LIS)]] - Finding the longest ordered subsequence using dynamic programming or O(N log N) patience sorting with binary search.
		- 5) [[Matrix Chain Multiplication]] - Classic interval dynamic programming problem optimizing parenthesization for matrix multiplication chain products.
	-
	- ## Greedy Algorithms & Backtracking:
		- 1) [[Greedy Algorithm Concepts]] - Decision-making paradigm that makes the locally optimal choice at each step to find a global optimum.
		- 2) [[Huffman Coding Compression]] - **lossless data compression** algorithm
		- 3) [[Activity Selection Problem]] - Classic interval scheduling optimization problem selecting maximum non-overlapping tasks sorted by finish times.
		- 4) [[Backtracking Concepts]] - Systematic state space tree search exploring all potential configurations with optimization pruning to solve constraints.
		- 5) [[N-Queens Problem]] - Backtracking puzzle of placing N non-attacking chess queens on an N×N board, utilizing row/column/diagonal bitmask guards.
		- 6) [[Sudoku Solver]] - Constraint satisfaction problem utilizing backtracking search and constraint propagation to fill empty cells.
	-
	- ## Geometric Algorithms:
		- 1) [[Line Sweep Algorithm]] - solve geometric problems
		- 2) [[Convex Hull | Set 1 (Jarvis’s Algorithm or Wrapping)]] - finding the convex hull
		- 3) [[Convex Hull | Set 2 (Graham Scan)]] - finding the convex hull.
		- 4) [[Convex Hull using Divide and Conquer Algorithm]] - enclose a set of points in a plane.
		- 5) [[Quickhull Algorithm for Convex Hull]] - divide and conquer approach for finding convex hull
	-
	- ## Mathematical & Miscellaneous Algorithms:
		- 1) [[Euclid's Algorithm]] - efficient way to compute the **Greatest Common Divisor**
		- 2) [[Ackermann Function]] - well-known recursive function that grows very quickly.
		- 3) [[Hungarian - Kuhn–Munkres - Munkres Assignment-Algorithm]] - combinatorial optimization algorithm
		- 4) [[Dekker's Algorithm]] - first algorithms to solve the mutual exclusion
		- 5) [[Sieve of Eratosthenes]] - Classic number theory algorithm for generating all prime numbers up to a given limit in O(N log log N) time.
		- 6) [[Fast Exponentiation]] - Logarithmic time modular power computation (binary exponentiation) used extensively in cryptography.
-
- # Short fourmulas
	- [[fibonacci]] - Short trick
	- [[palindrome]] - short method
-
- # Binary system
	- [[binary]] - every type of binary calculations
-
- # System Design
	- [[System Design]] - For in-depth system design notes covering scalability, load balancing, caching, databases, microservices, CAP theorem, message queues, API design, and real-world case studies.
-
- # More Learn
	- Explore the following links for valuable resources, communities, and tools to enhance your skills:
	-
	- ## Github & Webs
		- [Learn Big Company's Problem Solution](https://github.com/nishant-Tiwari24/company-wise-dsa)
		- [Awesome Algorithms](https://github.com/tayllan/awesome-algorithms)
		- [Complate FAANG Preparation](https://github.com/AkashSingh3031/The-Complete-FAANG-Preparation?tab=readme-ov-file)
		- [Code and It's Pattern Learn](https://github.com/seanprashad/leetcode-patterns)
		- [DSA using Js](https://github.com/amejiarosario/dsa.js-data-structures-algorithms-javascript)
		- [Open-Source Collection of 200+ Algorithmic Flash Cards to Help you Preparing your Algorithm & Data Structure Interview](https://github.com/teivah/algodeck)
		- [188 Problem Solved in C++ DSA](https://github.com/mandliya/algorithms_and_data_structures)
		- [DSA Problem Solve](https://github.com/fishercoder1534/Leetcode)
		- [Domain-Driven Hexagon](https://github.com/Sairyss/domain-driven-hexagon)
		- [System Design primer can help to understand How system work](https://github.com/donnemartin/system-design-primer)
		- [The Patterns of Scalable, Reliable, and Performant Large-Scale Systems](https://github.com/binhnguyennus/awesome-scalability)
		- [The Simplest Way to understand patterns](https://github.com/kamranahmedse/design-patterns-for-humans)
		- [Design Patterns for Multiple Language ](https://github.com/DovAmir/awesome-design-patterns)
		- [System Design Preparation](https://github.com/checkcheckzz/system-design-interview)
		- [System Design E-book](https://github.com/karanpratapsingh/system-design)
		- [Coding Interview Preparation](https://github.com/jwasham/coding-interview-university)
		- [SDE Interview Question](https://github.com/twowaits/SDE-Interview-Questions)