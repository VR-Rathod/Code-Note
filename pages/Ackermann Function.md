---
seoTitle: Ackermann Function – Computability, Up-Arrows & Inverse Ackermann Guide
description: "An exhaustive master-level guide to the Ackermann Function. Covers Computability Theory, Primitive Recursive vs General Recursive functions, Knuth's Up-Arrow notation, recursive trace trees, and the Inverse Ackermann complexity bounds in Disjoint Set Union."
keywords: "Ackermann function, recursion, primitive recursive, computability theory, Knuth up-arrow, inverse Ackermann, Union-Find complexity, tetration, stack overflow, DSA"
---

> [!info] What is the Ackermann Function?
> The **Ackermann Function** is a famous mathematical function in theoretical computer science.
> It is a **total computable** function (always terminates) that is **not primitive recursive**.
> It grows faster than any primitive recursive function (such as exponentials or factorials) and is used to define growth limits and analyze the **Inverse Ackermann Function** $\alpha(N)$ complexity in Disjoint Set Union (DSU).

- # Mathematical Definition
  collapsed:: true
	- The modern Péter-Ackermann formulation (simplifying Wilhelm Ackermann's 1928 three-argument version) is defined recursively for non-negative integers $m$ and $n$ as:
	- $$A(m, n) = \begin{cases} n + 1 & \text{if } m = 0 \\ A(m - 1, 1) & \text{if } m > 0 \text{ and } n = 0 \\ A(m - 1, A(m, n - 1)) & \text{if } m > 0 \text{ and } n > 0 \end{cases}$$
	-
	- ## Growth Rate & Value Table
	  collapsed:: true
		- The function grows astronomically. The row number $m$ determines the operator level (successor, addition, multiplication, exponentiation, tetration, etc.):
		-
		- | $m$ | $A(m, n)$ Formula | Operator Representation | Examples |
		  |---|---|---|---|
		  | **0** | $n + 1$ | Successor | $A(0, 3) = 4$ |
		  | **1** | $n + 2$ | Addition | $A(1, 3) = 5$ |
		  | **2** | $2n + 3$ | Multiplication | $A(2, 3) = 9$ |
		  | **3** | $2^{n+3} - 3$ | Exponentiation | $A(3, 3) = 61$ |
		  | **4** | $2 \uparrow\uparrow (n+3) - 3$ | Tetration (Power Tower) | $A(4, 0) = 13$, $A(4, 1) = 65533$, $A(4, 2) = 2^{65536}-3$ |
		  | **5** | $2 \uparrow\uparrow\uparrow (n+3) - 3$| Pentation | $A(5, 0) = A(4, 1) = 65533$ |
		-
		- $A(4, 2)$ has 19,729 decimal digits.
		- $A(4, 3)$ is $2^{2^{2^{65536}}} - 3$, a number so large it cannot be written in decimal form in the observable universe.
		-
	- ## Knuth's Up-Arrow Notation
	  collapsed:: true
		- To express such massive growth, Donald Knuth introduced **Up-Arrow Notation** (1976).
		- Single arrow ($\uparrow$) represents exponentiation:
		  $$a \uparrow b = a^b$$
		- Double arrow ($\uparrow\uparrow$) represents tetration (repeated exponentiation):
		  $$a \uparrow\uparrow b = \underbrace{a^{a^{\cdot^{\cdot^a}}}}_{b \text{ times}}$$
		- Triple arrow ($\uparrow\uparrow\uparrow$) represents pentation (repeated tetration):
		  $$a \uparrow\uparrow\uparrow b = \underbrace{a \uparrow\uparrow (a \uparrow\uparrow \dots \uparrow\uparrow a)}_{b \text{ times}}$$
		- The general Ackermann function can be written using Knuth's up-arrows for $m \ge 1$:
		  $$A(m, n) = 2 \uparrow^{m-2} (n + 3) - 3$$
		-
- # Computability Theory (Deep Dive)
  collapsed:: true
	- In mathematical logic, computable functions are divided into classes based on how they can be constructed:
	-
	- ## 1. Primitive Recursive Functions
		- These are functions that can be built using basic operations (zero function, successor function, projection) and combined via **composition** and **primitive recursion**.
		- In programming terms, primitive recursive functions correspond to programs where **every loop is bounded** (e.g., standard `for` loops where the iteration count is determined before the loop starts).
		- Examples include addition, multiplication, factorials, and exponentiation.
		-
	- ## 2. General Recursive Functions (μ-Recursive)
		- These functions allow **unbounded search** (minimization operator $\mu$).
		- In programming terms, they correspond to programs containing `while` loops that may run indefinitely until a condition is met.
		-
	- ## Why the Ackermann Function is Not Primitive Recursive
	  collapsed:: true
		- Before Wilhelm Ackermann, mathematicians wondered if every computable function was also primitive recursive.
		- Ackermann proved that his function is computable (it terminates, as either $m$ decreases, or $m$ stays the same and $n$ decreases), but it is **not primitive recursive**.
		- The proof rests on showing that **every primitive recursive function is bounded** by some single-argument Ackermann row function $f(n) = A(k, n)$ for a fixed $k$.
		- Since $A(n, n)$ grows faster than any single row $A(k, n)$ eventually, it must grow faster than any primitive recursive function. Hence, $A(n, n)$ cannot be primitive recursive.
		- This established that the set of primitive recursive functions is a **strict subset** of all total computable functions.
		-
- # Step-by-Step Call Trace Tree ($A(2, 1)$)
  collapsed:: true
	- To see how the recursion explodes, let's trace $A(2, 1)$ step-by-step:
	-
	- ```
	  A(2, 1)
	   ├── A(1, A(2, 0))               [since m>0, n>0]
	   │    ├── A(2, 0)                [evaluate inner parameter]
	   │    │    └── A(1, 1)           [since m>0, n=0]
	   │    │         ├── A(0, A(1, 0))
	   │    │         │    ├── A(1, 0)
	   │    │         │    │    └── A(0, 1) = 2
	   │    │         │    └── A(0, 2) = 3
	   │    │         └── Result = 3
	   │    ├── Inner parameter evaluated to 3: A(2, 0) = 3
	   │    └── A(1, 3)                [evaluate outer call]
	   │         ├── A(0, A(1, 2))
	   │         │    ├── A(1, 2)
	   │         │    │    ├── A(0, A(1, 1))
	   │         │    │    │    ├── A(1, 1) = 3  [known from earlier]
	   │         │    │    │    └── A(0, 3) = 4
	   │         │    │    └── Result = 4
	   │         │    └── A(0, 4) = 5
	   │         └── Result = 5
	   └── Final Result A(2, 1) = 5
	  ```
	-
- # The Inverse Ackermann Function $\alpha(N)$
  collapsed:: true
	- ## Definition
		- Because the Ackermann function grows so rapidly, its **inverse**, denoted as $\alpha(N)$, grows incredibly slowly.
		- For any integer $N$, $\alpha(N)$ is defined as the smallest $m$ such that the diagonal Ackermann function $A(m, m)$ exceeds or equals $N$:
		- $$\alpha(N) = \min \{ m \ge 1 : A(m, m) \ge N \}$$
		-
	- ## Slow Growth Visualization
		- Let's compute some values of $\alpha(N)$:
		- - $A(1, 1) = 3 \implies \alpha(N) = 1$ for $N \le 3$
		- - $A(2, 2) = 7 \implies \alpha(N) = 2$ for $4 \le N \le 7$
		- - $A(3, 3) = 61 \implies \alpha(N) = 3$ for $8 \le N \le 61$
		- - $A(4, 4) = 2 \uparrow\uparrow 7 - 3 \gg 10^{80} \implies \alpha(N) = 4$ for $62 \le N \le 2 \uparrow\uparrow 7 - 3$
		- Since $10^{80}$ is the estimated number of atoms in the observable universe, for any input $N$ encountered in the physical world (or in any computer algorithm), we have:
		- $$\alpha(N) \le 4$$
		-
	- ## Amortized Complexity in Disjoint Set Union (DSU)
	  collapsed:: true
		- The most famous appearance of $\alpha(N)$ in computer science is in the **Disjoint Set Data Structure (Union-Find)**.
		- If we implement DSU with both optimization techniques:
			- 1. **Union by Rank / Size** (attaching the shorter tree under the taller)
			- 2. **Path Compression** (flattening the tree during `find` queries)
		- Then any sequence of $M$ operations on a set of $N$ elements takes **$O(M \cdot \alpha(N))$** time.
		- This represents near-linear performance. In practice, $\alpha(N)$ is effectively a constant ($\le 4$), making the amortized time per operation $O(1)$.
		-
- # Implementation
  collapsed:: true
	- > [!note] Below are the implementations for the Basic Recursive, Memoized, and Iterative (with explicit stack) versions.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs

	  ```python
	  # 1. Basic Recursive
	  def ackermann_recursive(m: int, n: int) -> int:
	      if m == 0:
	          return n + 1
	      if n == 0:
	          return ackermann_recursive(m - 1, 1)
	      return ackermann_recursive(m - 1, ackermann_recursive(m, n - 1))

	  # 2. Memoized (to handle slightly larger values)
	  memo = {}
	  def ackermann_memo(m: int, n: int) -> int:
	      if m == 0:
	          return n + 1
	      key = (m, n)
	      if key in memo:
	          return memo[key]
	      if n == 0:
	          res = ackermann_memo(m - 1, 1)
	      else:
	          res = ackermann_memo(m - 1, ackermann_memo(m, n - 1))
	      memo[key] = res
	      return res

	  # 3. Iterative with Explicit Stack (prevents stack overflow)
	  def ackermann_iterative(m: int, n: int) -> int:
	      stack = [m]
	      while stack:
	          m_val = stack.pop()
	          if m_val == 0:
	              n = n + 1
	          elif n == 0:
	              stack.append(m_val - 1)
	              n = 1
	          else:
	              stack.append(m_val - 1)
	              stack.append(m_val)
	              n = n - 1
	      return n

	  # Example usage
	  print("A(2, 1) =", ackermann_recursive(2, 1))  # 5
	  print("A(3, 4) =", ackermann_memo(3, 4))        # 125
	  print("A(3, 7) =", ackermann_iterative(3, 7))   # 4093
	  ```

	  ```c++
	  #include <iostream>
	  #include <map>
	  #include <stack>

	  // 1. Basic Recursive
	  long long ackermann_recursive(long long m, long long n) {
	      if (m == 0) return n + 1;
	      if (n == 0) return ackermann_recursive(m - 1, 1);
	      return ackermann_recursive(m - 1, ackermann_recursive(m, n - 1));
	  }

	  // 2. Memoized
	  std::map<std::pair<long long, long long>, long long> memo;
	  long long ackermann_memo(long long m, long long n) {
	      if (m == 0) return n + 1;
	      auto key = std::make_pair(m, n);
	      auto it = memo.find(key);
	      if (it != memo.end()) return it->second;
	      
	      long long res;
	      if (n == 0) {
	          res = ackermann_memo(m - 1, 1);
	      } else {
	          res = ackermann_memo(m - 1, ackermann_memo(m, n - 1));
	      }
	      memo[key] = res;
	      return res;
	  }

	  // 3. Iterative with Explicit Stack
	  long long ackermann_iterative(long long m, long long n) {
	      std::stack<long long> stk;
	      stk.push(m);
	      while (!stk.empty()) {
	          m = stk.top(); stk.pop();
	          if (m == 0) {
	              n = n + 1;
	          } else if (n == 0) {
	              stk.push(m - 1);
	              n = 1;
	          } else {
	              stk.push(m - 1);
	              stk.push(m);
	              n = n - 1;
	          }
	      }
	      return n;
	  }

	  int main() {
	      std::cout << "A(2, 1) = " << ackermann_recursive(2, 1) << "\n"; // 5
	      std::cout << "A(3, 4) = " << ackermann_memo(3, 4) << "\n";       // 125
	      std::cout << "A(3, 7) = " << ackermann_iterative(3, 7) << "\n";  // 4093
	      return 0;
	  }
	  ```

	  ```javascript
	  // 1. Basic Recursive
	  function ackermannRecursive(m, n) {
	      if (m === 0) return n + 1;
	      if (n === 0) return ackermannRecursive(m - 1, 1);
	      return ackermannRecursive(m - 1, ackermannRecursive(m, n - 1));
	  }

	  // 2. Memoized
	  const memo = new Map();
	  function ackermannMemo(m, n) {
	      if (m === 0) return n + 1;
	      const key = `${m},${n}`;
	      if (memo.has(key)) return memo.get(key);
	      
	      let res;
	      if (n === 0) {
	          res = ackermannMemo(m - 1, 1);
	      } else {
	          res = ackermannMemo(m - 1, ackermannMemo(m, n - 1));
	      }
	      memo.set(key, res);
	      return res;
	  }

	  // 3. Iterative with Explicit Stack
	  function ackermannIterative(m, n) {
	      const stack = [m];
	      while (stack.length > 0) {
	          const mVal = stack.pop();
	          if (mVal === 0) {
	              n = n + 1;
	          } else if (n === 0) {
	              stack.push(mVal - 1);
	              n = 1;
	          } else {
	              stack.push(mVal - 1);
	              stack.push(mVal);
	              n = n - 1;
	          }
	      }
	      return n;
	  }

	  console.log("A(2, 1) =", ackermannRecursive(2, 1));
	  console.log("A(3, 4) =", ackermannMemo(3, 4));
	  console.log("A(3, 7) =", ackermannIterative(3, 7));
	  ```

	  ```java
	  import java.util.*;

	  public class Ackermann {
	      
	      // 1. Basic Recursive
	      public static long ackermannRecursive(long m, long n) {
	          if (m == 0) return n + 1;
	          if (n == 0) return ackermannRecursive(m - 1, 1);
	          return ackermannRecursive(m - 1, ackermannRecursive(m, n - 1));
	      }

	      // 2. Memoized
	      private static Map<String, Long> memo = new HashMap<>();
	      public static long ackermannMemo(long m, long n) {
	          if (m == 0) return n + 1;
	          String key = m + "," + n;
	          if (memo.containsKey(key)) return memo.get(key);
	          
	          long res;
	          if (n == 0) {
	              res = ackermannMemo(m - 1, 1);
	          } else {
	              res = ackermannMemo(m - 1, ackermannMemo(m, n - 1));
	          }
	          memo.put(key, res);
	          return res;
	      }

	      // 3. Iterative with Explicit Stack
	      public static long ackermannIterative(long m, long n) {
	          Stack<Long> stack = new Stack<>();
	          stack.push(m);
	          while (!stack.isEmpty()) {
	              long mVal = stack.pop();
	              if (mVal == 0) {
	                  n = n + 1;
	              } else if (n == 0) {
	                  stack.push(mVal - 1);
	                  n = 1;
	              } else {
	                  stack.push(mVal - 1);
	                  stack.push(mVal);
	                  n = n - 1;
	              }
	          }
	          return n;
	      }

	      public static void main(String[] args) {
	          System.out.println("A(2, 1) = " + ackermannRecursive(2, 1));
	          System.out.println("A(3, 4) = " + ackermannMemo(3, 4));
	          System.out.println("A(3, 7) = " + ackermannIterative(3, 7));
	      }
	  }
	  ```

	  :::
	-
- # Key Takeaways
	- **Termination Guarantee** — Even though the Ackermann function grows hyper-exponentially, it is a total computable function that always terminates for non-negative inputs.
	- **Primitive Recursion Limit** — Proves that primitive recursive functions (bounded loops) cannot represent all computable functions.
	- **Amortized Constant Bound** — DSU's amortized complexity of $O(\alpha(N))$ is practically $O(1)$ since $\alpha(N) \le 4$ for all numbers within the bounds of physics.
	-
- # More Learn
	- ## GitHub & Webs
		- [Wikipedia -> Ackermann function](https://en.wikipedia.org/wiki/Ackermann_function)
		- [Computerphile -> The Most Difficult Program to Compute?](https://www.youtube.com/watch?v=i7sm9dzFtEI)
	- ## Related Pages
		- [[Euclidean Algorithm for GCD]] – Extended GCD and modular inverse
		- [[Binary Exponentiation Algorithm]] – Rapid modular powering
		- [[DSA Algo & System Design]] – Full DSA index