---
seoTitle: Complexity Analysis & Big O Guide – Complete DSA Mathematics
description: "Complete reference for time and space complexity, Big O notation, and algorithm mathematics. Learn Master Theorem, logarithmic growth, and amortized complexity — from beginner to advanced."
keywords: "complexity analysis, time complexity, space complexity, big o notation, master theorem, log n math, recurrence relations, asymptotic analysis, algorithm math, amortized analysis, VR-Rathod, Code-Note, code note vr, vr book"
---

- # What is Complexity Analysis?
  collapsed:: true
	- **Complexity Analysis** is the mathematical evaluation of the resources (time and memory) consumed by an algorithm.
	-
	- ### 🧠 Beginner Mental Model
	  Think of it like ordering food at a restaurant:
	  - **Bad waiter**: Takes 5 minutes per person, so 100 people = 500 minutes. 😰 → $O(n)$ per group
	  - **Good waiter**: Takes a menu order once for the whole table → $O(1)$ per group
	  - The algorithm is the waiter. The input size $n$ is the number of people.
	-
	- Instead of measuring execution time in seconds (which varies across hardware, OS, and CPU load), we measure complexity in terms of the number of **basic operations** and **memory slots** used relative to input size $n$.
	-
	- We express this using **asymptotic notations** to describe the *growth rate* of resource usage as input size scales toward infinity.
	-
	- ### Key Terms
	  | Term | Meaning |
	  |---|---|
	  | **Input size ($n$)** | The quantity the algorithm works on (array length, number of nodes, etc.) |
	  | **Basic operation** | A single comparison, assignment, arithmetic op, or memory access |
	  | **Growth rate** | How fast the operation count increases as $n$ grows |
	  | **Asymptotic** | Behavior of the algorithm as $n \to \infty$ (very large values) |
	-

- # Why It Matters
  collapsed:: true
	- Hardware improvements (faster CPUs, more RAM) **cannot fix** a fundamentally inefficient algorithm. As data scales, algorithmic efficiency dominates hardware performance.
	-
	- > [!important] Scaling Breakdown
	  > Suppose a computer can perform $10^9$ operations per second. Here is how different algorithms scale for input size $n = 10^6$ (one million elements):
	  > * **Logarithmic time** $O(\log n)$ $\approx 20$ operations $\implies$ **$0.02$ microseconds**
	  > * **Linear time** $O(n)$ $= 10^6$ operations $\implies$ **$1$ millisecond**
	  > * **Linearithmic time** $O(n \log n)$ $\approx 2 \cdot 10^7$ operations $\implies$ **$20$ milliseconds**
	  > * **Quadratic time** $O(n^2)$ $= 10^{12}$ operations $\implies$ **$1,000$ seconds** (~$16.6$ minutes)
	  > * **Exponential time** $O(2^n)$ $= 2^{10^6}$ operations $\implies$ **Will never finish** (longer than the age of the universe)
	  >
	  > Choosing the correct algorithm can mean the difference between an instant response and a system crash.
	-
	- ### 📦 Real Analogy — Searching in a Phone Book
	  | Strategy | Complexity | How it works |
	  |---|---|---|
	  | Read every single name | $O(n)$ | Linear search |
	  | Open to the middle, eliminate half | $O(\log n)$ | Binary search |
	  | Teleport to exact page | $O(1)$ | Hash map lookup |
	-

- # How It Works
  collapsed:: true
	- ## 1. Asymptotic Notations
	  collapsed:: true
		- We use three primary mathematical notations to describe the bounds of an algorithm:
		-
		- | Notation | Name | Purpose | Mathematical Definition | Intuition |
		  |---|---|---|---|---|
		  | **$O(g(n))$** | **Big O** | **Upper Bound** (Worst case) | $\exists\, c, n_0 > 0$ such that $T(n) \le c \cdot g(n)$ for all $n \ge n_0$ | "Will never be slower than this" |
		  | **$\Omega(g(n))$** | **Big Omega** | **Lower Bound** (Best case) | $\exists\, c, n_0 > 0$ such that $T(n) \ge c \cdot g(n)$ for all $n \ge n_0$ | "Will never be faster than this" |
		  | **$\Theta(g(n))$** | **Big Theta** | **Tight Bound** (Exact) | $\exists\, c_1, c_2, n_0 > 0$ such that $c_1 \cdot g(n) \le T(n) \le c_2 \cdot g(n)$ | "Always grows at this rate" |
		-
		- > [!tip] When do we use which?
		  > - In **interviews and practice**, people almost always say "Big O" even when they technically mean Big Theta.
		  > - **Big O** = "ceiling" → useful to guarantee a worst case bound.
		  > - **Big Omega** = "floor" → useful to prove no algorithm can beat this limit.
		  > - **Big Theta** = "exact fit" → used in rigorous academic proofs.
		-
		- ### Formal Definition Explained (Beginner Friendly)
		  The definition $T(n) \le c \cdot g(n)$ for all $n \ge n_0$ means:
		  - We're allowed to pick any positive constant $c$ (scaling factor).
		  - We're allowed to ignore a finite "startup" region (i.e., for small $n$, the constants can dominate).
		  - Beyond some threshold $n_0$, $g(n)$ is always a valid upper bound on $T(n)$.
		  - **In practice**: constants are dropped because they vary by machine.
		-
		- ### Visualizing the Notations
		  ```
		  T(n)
		    |              ↑ c₂·g(n)  (upper bound, O)
		    |            ↗
		    |         ↗ T(n)           (actual runtime, inside Θ band)
		    |       ↗
		    |     ↗  ↗ c₁·g(n)        (lower bound, Ω)
		    +------------------------→ n
		         n₀
		  ```
		  Beyond $n_0$, the function $T(n)$ is sandwiched between $c_1 \cdot g(n)$ and $c_2 \cdot g(n)$.
		-
	- ## 2. Simplification Rules
	  collapsed:: true
		- When computing Big O, we apply these simplification rules:
		-
		- ### Rule 1 — Drop Constants
		  Constants don't affect the growth rate:
		  $$O(2n) = O(n)$$
		  $$O(500) = O(1)$$
		  $$O(3n^2 + 7n) = O(n^2)$$
		-
		- ### Rule 2 — Drop Non-Dominant Terms
		  Keep only the fastest-growing term:
		  $$O(n^2 + n) = O(n^2) \quad \text{(because } n^2 \gg n \text{ for large } n\text{)}$$
		  $$O(n + \log n) = O(n)$$
		  $$O(2^n + n^{100}) = O(2^n)$$
		-
		- ### Rule 3 — Different Variables
		  If two loops iterate over *different* inputs, use separate variables:
		  ```python
		  def process(arr_a, arr_b):
		      for a in arr_a:  # O(a)
		          print(a)
		      for b in arr_b:  # O(b)
		          print(b)
		  # Total: O(a + b), NOT O(n)
		  ```
		-
		- ### Rule 4 — Sequences vs. Nesting
		  | Pattern | Complexity | Code Structure |
		  |---|---|---|
		  | Sequential loops | $O(n + m)$ | `for ... : ; for ... :` |
		  | Nested loops | $O(n \times m)$ | `for ...: for ...:` |
		-
		- ### Quick Practice Problems
		  > [!note] Can you simplify these?
		  > 1. $O(n + 42)$ → ?
		  > 2. $O(4n^3 + 2n^2 + 100n)$ → ?
		  > 3. $O(n \cdot m + n)$ where $n \neq m$ → ?
		  >
		  > **Answers**: $O(n)$, $O(n^3)$, $O(n \cdot m)$
		-
	- ## 3. Common Complexity Classes
	  collapsed:: true
		- Below are the most common complexity classes, ordered from fastest to slowest:
		-
		- | Complexity Class | Name | Example Algorithm | Analogy |
		  |---|---|---|---|
		  | **$O(1)$** | Constant | Array index access, push/pop | Finding your seat by ticket number |
		  | **$O(\log n)$** | Logarithmic | [[Binary Search]], BST lookup | Phone book binary search |
		  | **$O(\sqrt{n})$** | Square Root | Trial division primality test | Checking grid diagonals |
		  | **$O(n)$** | Linear | [[Linear Search]], array traversal | Reading a book page by page |
		  | **$O(n \log n)$** | Linearithmic | [[Merge Sort]], Heap Sort | Sorting a deck optimally |
		  | **$O(n^2)$** | Quadratic | Bubble Sort, nested loops | Comparing every pair in a group |
		  | **$O(n^3)$** | Cubic | Naive matrix multiplication | Triple nested loop |
		  | **$O(2^n)$** | Exponential | Recursive subset generation | All possible subsets |
		  | **$O(n!)$** | Factorial | Generating all permutations | Brute-force travelling salesman |
		-
		- ```mermaid
		  xychart-beta
		      title "Growth Rate Curves (n vs Operations)"
		      x-axis ["n=1", "n=2", "n=4", "n=8", "n=16"]
		      y-axis "Operations" 0 --> 300
		      line "O(1) Constant" [1, 1, 1, 1, 1]
		      line "O(log n) Logarithmic" [0, 1, 2, 3, 4]
		      line "O(n) Linear" [1, 2, 4, 8, 16]
		      line "O(n log n) Linearithmic" [0, 2, 8, 24, 64]
		      line "O(n^2) Quadratic" [1, 4, 16, 64, 256]
		  ```
		-
		- > [!tip] The Complexity Ladder
		  > $$O(1) < O(\log n) < O(\sqrt{n}) < O(n) < O(n \log n) < O(n^2) < O(n^3) < O(2^n) < O(n!)$$
		  > Always aim as far **left** on this ladder as possible.
		-
	- ## 4. Mathematical Derivation of $O(\log n)$
	  collapsed:: true
		- Logarithmic growth is incredibly efficient. Here is a step-by-step mathematical proof of why halving the search space (like in [[Binary Search]]) yields $O(\log n)$:
		-
		- 1. Let the initial search space size be $n$.
		- 2. Each iteration divides the search space by $2$.
		- 3. After $k$ iterations, the remaining size is:
		     $$\text{Size after } k \text{ steps} = \frac{n}{2^k}$$
		- 4. The search terminates when the space is reduced to $1$:
		     $$\frac{n}{2^k} = 1 \implies n = 2^k$$
		- 5. Take the base-2 logarithm of both sides:
		     $$\log_2(n) = \log_2(2^k) = k$$
		- 6. Therefore, the number of steps $k = \log_2(n)$, which we write as **$O(\log n)$**.
		-
		- > [!tip] Logarithmic Growth Rule
		  > Every time the input size $n$ **doubles**, a logarithmic algorithm requires only **one extra step**.
		  > | $n$ | $\log_2(n)$ |
		  > |---|---|
		  > | 1 | 0 |
		  > | 2 | 1 |
		  > | 4 | 2 |
		  > | 8 | 3 |
		  > | 1,024 | 10 |
		  > | 1,048,576 | 20 |
		  > | 1,073,741,824 (1 billion) | 30 |
		-
		- ### Why the base of log doesn't matter in Big O
		  Since $\log_a(n) = \frac{\log_b(n)}{\log_b(a)}$ and $\log_b(a)$ is a **constant**, the bases only differ by a constant factor:
		  $$O(\log_2 n) = O(\log_{10} n) = O(\log n)$$
		  This is why we drop the base in Big O notation.
		-
	- ## 5. Code Complexity Analysis — Step by Step
	  collapsed:: true
		- Here is how to identify complexities by reading code patterns:
		-
		- ### 🟢 Constant Time — $O(1)$
		  Operations that don't depend on input size at all:
		  ```python
		  def get_first_element(arr):
		      # Always exactly 1 operation, regardless of len(arr)
		      return arr[0] if arr else None

		  def is_even(n):
		      # Single arithmetic check — constant time
		      return n % 2 == 0

		  def swap(arr, i, j):
		      # Three assignments — still O(1) since it's a fixed number
		      arr[i], arr[j] = arr[j], arr[i]
		  ```
		-
		- ### 🟡 Logarithmic Time — $O(\log n)$
		  Each iteration cuts the problem in half (or by a constant fraction):
		  ```python
		  def binary_search(arr, target):
		      low, high = 0, len(arr) - 1
		      while low <= high:
		          mid = (low + high) // 2
		          if arr[mid] == target:
		              return mid
		          elif arr[mid] < target:
		              low = mid + 1      # Discard left half
		          else:
		              high = mid - 1     # Discard right half
		      return -1
		  # Search space: n → n/2 → n/4 → ... → 1
		  # Steps = log₂(n)  →  O(log n)

		  def count_digits(n):
		      count = 0
		      while n > 0:
		          n //= 10   # Divides by 10 each time
		          count += 1
		      return count
		  # Steps ≈ log₁₀(n)  →  O(log n)
		  ```
		-
		- ### 🟠 Linear Time — $O(n)$
		  A single pass through all $n$ elements:
		  ```python
		  def find_max(arr):
		      max_val = arr[0]
		      for item in arr:       # Loop runs n times
		          if item > max_val:
		              max_val = item
		      return max_val

		  def sum_array(arr):
		      total = 0
		      for x in arr:          # One operation per element
		          total += x
		      return total
		  ```
		-
		- ### 🔴 Quadratic Time — $O(n^2)$
		  A nested loop where both loops scale with $n$:
		  ```python
		  def bubble_sort(arr):
		      n = len(arr)
		      for i in range(n):           # Outer: n iterations
		          for j in range(n - i - 1): # Inner: up to n iterations
		              if arr[j] > arr[j + 1]:
		                  arr[j], arr[j + 1] = arr[j + 1], arr[j]
		  # Total comparisons ≈ n*(n-1)/2  =  O(n²)

		  def print_all_pairs(arr):
		      for i in range(len(arr)):    # O(n)
		          for j in range(len(arr)): # O(n) for each i
		              print(arr[i], arr[j])
		  # Total: O(n × n) = O(n²)
		  ```
		-
		- ### 🔵 Linearithmic Time — $O(n \log n)$
		  Divide-and-conquer: split $\log n$ times, process $n$ elements each split:
		  ```python
		  def merge_sort(arr):
		      if len(arr) <= 1:
		          return arr
		      mid = len(arr) // 2
		      left = merge_sort(arr[:mid])   # T(n/2) — split left half
		      right = merge_sort(arr[mid:])  # T(n/2) — split right half
		      return merge(left, right)      # O(n)   — merge step

		  def merge(left, right):
		      result = []
		      i = j = 0
		      while i < len(left) and j < len(right):
		          if left[i] <= right[j]:
		              result.append(left[i]); i += 1
		          else:
		              result.append(right[j]); j += 1
		      result.extend(left[i:])
		      result.extend(right[j:])
		      return result
		  # Recurrence: T(n) = 2T(n/2) + O(n) → O(n log n)
		  ```
		-
		- ### ⚫ Exponential Time — $O(2^n)$
		  Each call generates two more calls — the tree doubles at each level:
		  ```python
		  def fibonacci_naive(n):
		      # For each call, we make 2 more recursive calls
		      if n <= 1:
		          return n
		      return fibonacci_naive(n - 1) + fibonacci_naive(n - 2)
		  # Call tree has ~2^n nodes → O(2^n) time, O(n) space

		  def all_subsets(arr):
		      # Generates all 2^n subsets of arr
		      if not arr:
		          return [[]]
		      first = arr[0]
		      rest_subsets = all_subsets(arr[1:])
		      return rest_subsets + [[first] + s for s in rest_subsets]
		  ```
		-
		- ### 🟣 Tricky Multi-Loop Example
		  Not all nested loops are $O(n^2)$. Always trace the actual iterations:
		  ```python
		  def mystery(n):
		      i = 1
		      while i < n:
		          i *= 2   # i doubles: 1, 2, 4, 8, ..., n
		      # Loop runs log₂(n) times → O(log n) ❗ NOT O(n)

		  def print_triangle(n):
		      for i in range(n):           # n rows
		          for j in range(i + 1):   # 1, 2, 3, ..., n iterations
		              print("*", end=" ")
		      # Total = 1 + 2 + ... + n = n(n+1)/2 = O(n²)
		  ```
		-
	- ## 6. Recurrence Relations & Master Theorem
	  collapsed:: true
		- For **recursive divide-and-conquer** algorithms, we express time complexity as a recurrence relation:
		  $$T(n) = aT(n/b) + f(n)$$
		- Where:
		  * $a \ge 1$: Number of subproblems at each recursion level.
		  * $b > 1$: Factor by which the input size shrinks.
		  * $f(n)$: Work done *outside* the recursive calls (splitting, merging, processing).
		-
		- ### Step-by-Step: Reading a Recurrence
		  For `merge_sort`: `T(n) = 2T(n/2) + O(n)`
		  | Symbol | Meaning | Value |
		  |---|---|---|
		  | $a = 2$ | Split into 2 halves | Two recursive calls |
		  | $b = 2$ | Each half is $n/2$ size | Problem halves each level |
		  | $f(n) = O(n)$ | Merging two sorted arrays | Linear merge step |
		-
		- The **Master Theorem** provides a shortcut to solve recurrences of this form:
		-
		- > [!important] The 3 Cases of the Master Theorem
		  > First compute the **critical exponent**: $p = \log_b a$
		  >
		  > **Case 1 — Recursive work dominates** (subproblems take most time):
		  > $$\text{If } f(n) = O(n^{p - \epsilon}) \text{ for some } \epsilon > 0, \text{ then:}$$
		  > $$T(n) = \Theta(n^p)$$
		  >
		  > **Case 2 — Work is balanced** (split cost equals recursive cost):
		  > $$\text{If } f(n) = \Theta(n^p), \text{ then:}$$
		  > $$T(n) = \Theta(n^p \log n)$$
		  >
		  > **Case 3 — Combining work dominates** (merge/split takes most time):
		  > $$\text{If } f(n) = \Omega(n^{p + \epsilon}) \text{ for some } \epsilon > 0, \text{ then:}$$
		  > $$T(n) = \Theta(f(n))$$
		-
		- ### Real-World Recurrence Examples
		  * **[[Binary Search]]**: $T(n) = T(n/2) + O(1)$
		    * $a=1$, $b=2$, $f(n)=O(1)$
		    * Critical exponent: $p = \log_2 1 = 0$, so $n^p = 1$
		    * $f(n) = O(1) = \Theta(n^0)$ → **Case 2**
		    * $$T(n) = \Theta(1 \cdot \log n) = \Theta(\log n) ✅$$
		  * **[[Merge Sort]]**: $T(n) = 2T(n/2) + O(n)$
		    * $a=2$, $b=2$, $f(n)=O(n)$
		    * Critical exponent: $p = \log_2 2 = 1$, so $n^p = n$
		    * $f(n) = O(n) = \Theta(n^1)$ → **Case 2**
		    * $$T(n) = \Theta(n \log n) ✅$$
		  * **Strassen's Matrix Multiply**: $T(n) = 7T(n/2) + O(n^2)$
		    * $a=7$, $b=2$, $f(n)=O(n^2)$
		    * Critical exponent: $p = \log_2 7 \approx 2.807$
		    * $f(n) = O(n^2) = O(n^{2.807 - 0.807})$ → **Case 1**
		    * $$T(n) = \Theta(n^{\log_2 7}) \approx \Theta(n^{2.807}) ✅$$
		-
		- ### Recursion Tree Method (Alternative to Master Theorem)
		  For $T(n) = 2T(n/2) + n$:
		  ```
		  Level 0:        n                     → cost: n
		  Level 1:    n/2   n/2                 → cost: n
		  Level 2:  n/4 n/4 n/4 n/4             → cost: n
		  ...
		  Level k:  [2^k nodes, each n/2^k]     → cost: n
		                                          (log n levels)
		  Total cost = n × log n = O(n log n)
		  ```
		-
	- ## 7. Space Complexity & the Call Stack
	  collapsed:: true
		- **Space complexity** measures the memory an algorithm uses relative to input size $n$.
		-
		- | Type | Definition |
		  |---|---|
		  | **Input Space** | Memory occupied by the input data itself |
		  | **Auxiliary Space** | Extra memory used by the algorithm (variables, call stack, data structures) |
		  | **Total Space** | Input Space + Auxiliary Space |
		-
		- > [!note] Interview Convention
		  > Most algorithm interviews refer to **auxiliary space** when they say "space complexity". We generally exclude the input itself.
		-
		- ### Call Stack Memory
		  When a function calls itself recursively, each active call occupies a **stack frame** on the call stack:
		  ```
		  Call Stack for: factorial(4)
		  ┌─────────────────────┐
		  │  factorial(1) → 1   │  ← Top of stack (most recent)
		  ├─────────────────────┤
		  │  factorial(2)        │
		  ├─────────────────────┤
		  │  factorial(3)        │
		  ├─────────────────────┤
		  │  factorial(4)        │  ← Bottom of stack (first call)
		  └─────────────────────┘
		  Depth = 4 = n  →  Space: O(n)
		  ```
		-
		- ### Space Complexity Examples
		  ```python
		  # O(1) Space — Iterative: single stack frame, fixed variables
		  def sum_iterative(n):
		      total = 0
		      for i in range(1, n + 1):
		          total += i
		      return total

		  # O(n) Space — Recursive: n stack frames deep
		  def sum_recursive(n):
		      if n == 0:
		          return 0
		      return n + sum_recursive(n - 1)

		  # O(log n) Space — Recursive Binary Search: log n stack frames
		  def binary_search_recursive(arr, low, high, target):
		      if low > high:
		          return -1
		      mid = (low + high) // 2
		      if arr[mid] == target:
		          return mid
		      elif arr[mid] < target:
		          return binary_search_recursive(arr, mid + 1, high, target)
		      else:
		          return binary_search_recursive(arr, low, mid - 1, target)

		  # O(n) Space — Creating a new array
		  def double_array(arr):
		      return [x * 2 for x in arr]  # New list of size n
		  ```
		-
		- ### Iterative vs Recursive Space
		  | Algorithm | Time | Space (Iterative) | Space (Recursive) |
		  |---|---|---|---|
		  | Factorial | $O(n)$ | $O(1)$ | $O(n)$ |
		  | Binary Search | $O(\log n)$ | $O(1)$ | $O(\log n)$ |
		  | Merge Sort | $O(n \log n)$ | $O(n)$ | $O(n)$ |
		  | Fibonacci (naive) | $O(2^n)$ | $O(1)$ | $O(n)$ |
		-
	- ## 8. Amortized Analysis
	  collapsed:: true
		- Some operations are expensive *occasionally* but cheap *most of the time*. **Amortized Analysis** averages the cost per operation across a long sequence to give a tighter bound than worst-case alone.
		-
		- ### Example: Dynamic Array (Python `list` / C++ `std::vector`)
		  When inserting elements into a dynamic array:
		  1. **Normal insert** (space available): $O(1)$ — just write to empty slot.
		  2. **Full array insert** (no space): Allocate $2n$ slots, copy all $n$ elements, then insert → $O(n)$ one-time cost.
		  3. After doubling, the next $n$ inserts are all $O(1)$ again.
		-
		  **Amortized Cost:**
		  $$\text{Total cost of } n \text{ insertions} = \underbrace{n \cdot O(1)}_{\text{Normal inserts}} + \underbrace{O(n)}_{\text{Doubling cost}} = O(n)$$
		  $$\text{Amortized cost per insertion} = \frac{O(n)}{n} = \mathbf{O(1)}$$
		-
		- > [!tip] Banker's Argument
		  > Think of each $O(1)$ insert as paying 2 coins:
		  > - 1 coin for itself
		  > - 1 coin saved in a "doubling bank"
		  >
		  > When doubling happens, you have $n$ coins saved → can afford the $O(n)$ copy.
		  > Every insert's amortized cost = **2 coins = $O(1)$**.
		-
		- ### Other Amortized Examples
		  | Data Structure | Operation | Amortized Cost | Worst Case |
		  |---|---|---|---|
		  | Dynamic Array | `append` | $O(1)$ | $O(n)$ |
		  | Binary Heap (`heapify`) | Build from $n$ elements | $O(n)$ total | $O(n \log n)$ naive |
		  | Splay Tree | Any single op | $O(\log n)$ | $O(n)$ |
		  | Union-Find (path compression) | `find` | $O(\alpha(n))$ ≈ $O(1)$ | $O(\log n)$ |
		-
	- ## 9. Best / Average / Worst Case — When Do They Differ?
	  collapsed:: true
		- Complexity can vary depending on the specific input. A complete analysis covers all three cases:
		-
		- | Algorithm | Best Case | Average Case | Worst Case |
		  |---|---|---|---|
		  | Linear Search | $O(1)$ (first element) | $O(n/2) = O(n)$ | $O(n)$ (not found) |
		  | Binary Search | $O(1)$ (midpoint is target) | $O(\log n)$ | $O(\log n)$ |
		  | Quick Sort | $O(n \log n)$ (balanced pivot) | $O(n \log n)$ | $O(n^2)$ (sorted array, bad pivot) |
		  | Bubble Sort | $O(n)$ (already sorted) | $O(n^2)$ | $O(n^2)$ |
		  | Hash Map lookup | $O(1)$ | $O(1)$ | $O(n)$ (all keys collide) |
		-
		- ```python
		  def linear_search(arr, target):
		      for i, item in enumerate(arr):
		          if item == target:
		              return i    # Best case: O(1) if target is at index 0
		      return -1           # Worst case: O(n) if not found
		  ```
		-
		- > [!note] Quick Sort and Pivot Selection
		  > The worst case $O(n^2)$ of Quick Sort occurs when the pivot always splits the array into $[n-1, 0]$ (e.g., always picking the smallest element on a sorted array).
		  > **Randomized Quick Sort** avoids this by choosing pivots randomly → expected $O(n \log n)$.
		-

- # Real-World Applications
  collapsed:: true
	- ### 🗄️ Database Indexing
	  Databases store millions of rows. A full-table scan without an index is $O(n)$. Adding a B-Tree index transforms lookups to $O(\log n)$.
	  - Searching 1 million rows without index: ~$1,000,000$ comparisons
	  - Searching with B-Tree index: ~$20$ comparisons ($\log_2 10^6 \approx 20$)
	-
	- ### ⚡ High-Frequency Trading (HFT)
	  Trade brokers use hash maps ($O(1)$ amortized lookup) instead of balanced BSTs ($O(\log n)$) to minimize microsecond-scale latency. At 10,000 trades/second, even $O(\log n)$ can be a bottleneck.
	-
	- ### 🌐 Network Routing
	  Network routers handle millions of packets/second. They use **Trie** structures for prefix matching IP addresses in $O(L)$ time (where $L = 32$ bits for IPv4), completely **independent** of total number of routes $n$.
	-
	- ### 🔒 Cryptography
	  The security of RSA encryption relies on the fact that multiplying two large primes is $O(n^2)$ but **factoring** the product back is believed to be exponential — the computational gap is the security guarantee.
	-
	- ### 🧬 Bioinformatics
	  DNA sequence alignment uses **Dynamic Programming** algorithms like Smith-Waterman in $O(n \cdot m)$ time. For whole-genome alignment (billions of bases), approximations and heuristics reduce this to $O(n \log n)$.
	-

- # Key Takeaways
  collapsed:: true
	- **Time & Space** — Analyze operations performed (time) and extra memory allocated (space). Both matter.
	- **Big O is the Standard** — In practice, Big O (worst case) is what engineers discuss. It's the safety guarantee.
	- **Simplify ruthlessly** — Drop constants and non-dominant terms. $O(3n^2 + 50n + 200) = O(n^2)$.
	- **Logarithmic is powerful** — $O(\log n)$ means doubling the input only costs 1 more step. Always prefer it over $O(n)$ when possible.
	- **Recursion has hidden costs** — Every recursive call adds a stack frame. A $k$-level-deep recursion costs $O(k)$ space.
	- **Amortized smooths spikes** — When one expensive operation enables many cheap ones, the true per-operation cost is lower than it looks.
	- **Context matters** — $O(n^2)$ is fine for $n = 100$; catastrophic for $n = 10^6$. Always estimate the expected input size.
	-
	- ```mermaid
	  graph TD
	    A["Input: n"] --> B{"What does the algorithm do?"}
	    B -->|"Fixed ops regardless of n"| C["O(1) — Constant"]
	    B -->|"Halves problem each step"| D["O(log n) — Logarithmic"]
	    B -->|"One pass through all n"| E["O(n) — Linear"]
	    B -->|"Divide + merge each level"| F["O(n log n) — Linearithmic"]
	    B -->|"Nested loop over n"| G["O(n²) — Quadratic"]
	    B -->|"Two branches per call"| H["O(2^n) — Exponential"]
	  ```
	-

- # More Learn
	- * [Big-O Cheat Sheet](https://www.bigocheatsheet.com/) — Quick reference for all complexity classes with data structures
	- * [Khan Academy: Asymptotic Notation](https://www.khanacademy.org/computing/computer-science/algorithms/asymptotic-notation/a/asymptotic-notation) — Thorough introduction to algorithm math
	- * [Master Theorem - Wikipedia](https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms)) — In-depth proof and edge cases
	- * [Visualgo — Algorithm Visualizer](https://visualgo.net/en) — Interactive visual animations for sorting and searching
	- * [MIT OpenCourseWare — Introduction to Algorithms](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/) — Full lecture series with problem sets