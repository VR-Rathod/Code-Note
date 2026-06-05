---
seoTitle: Euclidean Algorithm for GCD – Standard, Extended, and Diophantine Guide
description: "An exhaustive master-level guide to the Euclidean Algorithm for Greatest Common Divisor (GCD) and its Extended variant. Includes the mathematical proof of Lamé's Theorem, solving Linear Diophantine Equations, modular multiplicative inverse derivation, and complete implementations in Python, C++, JavaScript, and Java."
keywords: "Euclidean algorithm, GCD, greatest common divisor, extended Euclidean, Bezout identity, modular inverse, Lamé's Theorem, linear Diophantine equations, number theory, competitive programming, DSA"
treeTitle: DSA - Math & Geometry - Euclidean Algorithm for GCD
---

> [!info] What is the Euclidean Algorithm?
> The **Euclidean Algorithm** is an ancient, extremely efficient method for computing the **Greatest Common Divisor (GCD)** of two integers.
> The **Extended Euclidean Algorithm** goes further by calculating integers $x$ and $y$ such that $ax + by = \gcd(a, b)$ (**Bezout's Identity**). This is critical for solving modular multiplicative inverses and linear Diophantine equations.
> **Time Complexity: O(log(min(a, b)))**.

- # Mathematical Fundamentals
  collapsed:: true
	- To understand the Euclidean algorithm, we must establish three basic principles from number theory:
	-
	- ## 1. Divisibility and Common Divisors
		- An integer $d$ divides an integer $a$ (written as $d \mid a$) if there exists an integer $k$ such that $a = k \cdot d$.
		- The Greatest Common Divisor, $\gcd(a, b)$, is the largest positive integer $d$ that simultaneously divides both $a$ and $b$.
		- If $\gcd(a, b) = 1$, the integers $a$ and $b$ are said to be **coprime** or **relatively prime**.
		-
	- ## 2. The Division Algorithm Theorem
		- For any integer $a$ and any positive integer $b$, there exist unique integers $q$ (quotient) and $r$ (remainder) such that:
		- $$a = q \cdot b + r \quad \text{where} \quad 0 \le r < b$$
		-
	- ## 3. Modulo Reduction Principle
		- The Euclidean algorithm relies on the fact that if $d$ is a common divisor of $a$ and $b$, it must also divide their remainder.
		- Since $a = q \cdot b + r$, we can rewrite the remainder as $r = a - q \cdot b$.
		- If $d \mid a$ and $d \mid b$, then $d$ must divide any linear combination of $a$ and $b$, including $a - q \cdot b$. Hence, $d \mid r$.
		- Therefore:
		- $$\gcd(a, b) = \gcd(b, a \bmod b)$$
		-
- # Standard Euclidean Algorithm
  collapsed:: true
	- ## Standard GCD Recurrence
		- The algorithm reduces the problem of finding $\gcd(a, b)$ to finding $\gcd(b, a \bmod b)$. Since the remainder strictly decreases ($0 \le a \bmod b < b$), the second parameter eventually reaches $0$.
		- At that point:
		- $$\gcd(g, 0) = g$$
		-
	- ## Standard GCD Step-by-Step Trace ($\gcd(105, 35)$)
		- Let's find $\gcd(105, 30)$:
		- 1. $\gcd(105, 30) \implies 105 = 3 \cdot 30 + 15 \implies \gcd(30, 15)$
		- 2. $\gcd(30, 15) \implies 30 = 2 \cdot 15 + 0 \implies \gcd(15, 0)$
		- 3. $\gcd(15, 0) \implies \text{Remainder is } 0 \implies \text{GCD is } 15$.
		-
- # Extended Euclidean Algorithm
  collapsed:: true
	- ## Bezout's Identity
		- Bezout's Identity states that for any non-zero integers $a$ and $b$, there exist integers $x$ and $y$ such that:
		- $$ax + by = \gcd(a, b)$$
		- Note that $x$ and $y$ are not unique. The Extended Euclidean algorithm calculates one such pair of coefficients $(x, y)$ along with the GCD.
		-
	- ## Mathematical Derivation of Updating Formulas
		- We want to solve $ax + by = \gcd(a, b)$.
		- Suppose we call the algorithm recursively for $b$ and $a \bmod b$, obtaining coefficients $x_1$ and $y_1$ such that:
		- $$b \cdot x_1 + (a \bmod b) \cdot y_1 = \gcd(a, b)$$
		- We can express $a \bmod b$ using the division quotient:
		- $$a \bmod b = a - \lfloor \frac{a}{b} \rfloor \cdot b$$
		- Substituting this into the recursive equation:
		- $$b \cdot x_1 + \left(a - \lfloor \frac{a}{b} \rfloor \cdot b\right) \cdot y_1 = \gcd(a, b)$$
		- Grouping the terms by $a$ and $b$:
		- $$a \cdot y_1 + b \cdot \left(x_1 - \lfloor \frac{a}{b} \rfloor \cdot y_1\right) = \gcd(a, b)$$
		- Matching this with the form $ax + by = \gcd(a, b)$, we get the update rules:
		- $$x = y_1$$
		- $$y = x_1 - \lfloor \frac{a}{b} \rfloor \cdot y_1$$
		-
	- ## Base Case
		- When $b = 0$, the equation is $a \cdot x + 0 \cdot y = \gcd(a, 0) = a$.
		- We can choose $x = 1$ and $y = 0$ as our base coefficients.
		-
	- ## Detailed Extended Trace ($\gcd(240, 46)$)
		- We trace the recursive calls of the Extended Euclidean Algorithm:
		-
		- | Step | $a$ | $b$ | $\lfloor a/b \rfloor$ | Recurse | Returned $(g, x_1, y_1)$ | Computed $(x, y)$ |
		  |---|---|---|---|---|---|---|
		  | **1** | 240 | 46 | 5 | $\gcd(46, 10)$ | $(2, -1, 5)$ | $x = 5$, $y = -1 - 5(5) = -26$ |
		  | **2** | 46 | 10 | 4 | $\gcd(10, 6)$ | $(2, 1, -1)$ | $x = -1$, $y = 1 - 4(-1) = 5$ |
		  | **3** | 10 | 6 | 1 | $\gcd(6, 4)$ | $(2, -1, 1)$ | $x = 1$, $y = -1 - 1(1) = -2$ |
		  | **4** | 6 | 4 | 1 | $\gcd(4, 2)$ | $(2, 1, -1)$ | $x = -1$, $y = 1 - 1(-1) = 2$ |
		  | **5** | 4 | 2 | 2 | $\gcd(2, 0)$ | $(2, 1, 0)$ | $x = 0$, $y = 1 - 2(0) = 1$ |
		  | **6 (Base)**| 2 | 0 | - | Base case | - | $x = 1, y = 0$ |
		  |
		- **Final Result**: $\gcd(240, 46) = 2$. Coefficients are $x = 5, y = -26$.
		- Verification: $240(5) + 46(-26) = 1200 - 1196 = 4 \implies$ Wait, $46 \cdot 26 = 1196$. $1200 - 1196 = 4$ — wait, is the GCD 2 or 4?
		- Let's re-calculate:
			- $240 = 5 \cdot 46 + 10$.
			- $46 = 4 \cdot 10 + 6$.
			- $10 = 1 \cdot 6 + 4$.
			- $6 = 1 \cdot 4 + 2$.
			- $4 = 2 \cdot 2 + 0 \implies$ GCD is indeed 2.
			- Let's check coefficients: $240(5) + 46(-26) = 1200 - 1196 = 4 \ne 2$. Where is the error?
			- Let's backtrack carefully:
				- Step 5: $a=4, b=2 \implies x = y_1 = 1$, $y = x_1 - 2 \cdot y_1$. Wait, from base case $x_1=1, y_1=0$, we get:
				  $x = 0$, $y = 1 - 2(0) = 1$. Verification: $4(0) + 2(1) = 2$. Correct.
				- Step 4: $a=6, b=4 \implies x_1 = 0, y_1 = 1$. Update:
				  $x = y_1 = 1$, $y = x_1 - 1(y_1) = 0 - 1(1) = -1$. Verification: $6(1) + 4(-1) = 2$. Correct.
				- Step 3: $a=10, b=6 \implies x_1 = 1, y_1 = -1$. Update:
				  $x = y_1 = -1$, $y = x_1 - 1(y_1) = 1 - 1(-1) = 2$. Verification: $10(-1) + 6(2) = 2$. Correct.
				- Step 2: $a=46, b=10 \implies x_1 = -1, y_1 = 2$. Update:
				  $x = y_1 = 2$, $y = x_1 - 4(y_1) = -1 - 8 = -9$. Verification: $46(2) + 10(-9) = 92 - 90 = 2$. Correct.
				- Step 1: $a=240, b=46 \implies x_1 = 2, y_1 = -9$. Update:
				  $x = y_1 = -9$, $y = x_1 - 5(y_1) = 2 - 5(-9) = 2 + 45 = 47$. Verification: $240(-9) + 46(47) = -2160 + 2162 = 2$. Correct!
				- Ah! The table coefficients had a minor copy error in backtracking. Let's fix the table values to be exactly correct.
		- Corrected Trace Table:
		- | Step | $a$ | $b$ | $\lfloor a/b \rfloor$ | Recurse | Returned $(g, x_1, y_1)$ | Computed $(x, y)$ |
		  |---|---|---|---|---|---|---|
		  | **1** | 240 | 46 | 5 | $\gcd(46, 10)$ | $(2, 2, -9)$ | $x = -9$, $y = 2 - 5(-9) = 47$ |
		  | **2** | 46 | 10 | 4 | $\gcd(10, 6)$ | $(2, -1, 2)$ | $x = 2$, $y = -1 - 4(2) = -9$ |
		  | **3** | 10 | 6 | 1 | $\gcd(6, 4)$ | $(2, 1, -1)$ | $x = -1$, $y = 1 - 1(-1) = 2$ |
		  | **4** | 6 | 4 | 1 | $\gcd(4, 2)$ | $(2, 0, 1)$ | $x = 1$, $y = 0 - 1(1) = -1$ |
		  | **5** | 4 | 2 | 2 | $\gcd(2, 0)$ | $(2, 1, 0)$ | $x = 0$, $y = 1 - 2(0) = 1$ |
		  | **6 (Base)**| 2 | 0 | - | Base case | - | $x = 1, y = 0$ |
		-
- # Complexity Analysis & Lamé's Theorem
  collapsed:: true
	- ## Asymptotic Bound
		- The time complexity of the Euclidean algorithm is **$O(\log(\min(a, b)))$**. This is because, at every two iterations, the remainder is at least cut in half:
		- If $a \ge b$, then $a \bmod b < a/2$.
		-
	- ## Mathematical Proof of Lamé's Theorem
	  collapsed:: true
		- > [!important] Lamé's Theorem (1844)
		  > The number of division steps in the Euclidean algorithm for two positive integers $a$ and $b$ ($a > b$) is at most $5$ times the number of decimal digits of $b$.
		-
		- **Proof**:
		  Let the Euclidean algorithm take $n$ steps to find $\gcd(a, b)$:
		  $$r_0 = a, \quad r_1 = b$$
		  $$r_0 = q_1 \cdot r_1 + r_2$$
		  $$r_1 = q_2 \cdot r_2 + r_3$$
		  $$\dots$$
		  $$r_{n-2} = q_{n-1} \cdot r_{n-1} + r_n$$
		  $$r_{n-1} = q_n \cdot r_n + 0$$
		  Since $r_n \ge 1$ and all quotients $q_i \ge 1$ (with $q_n \ge 2$ because if $q_n$ were 1, the division would have ended earlier):
			- $r_n \ge 1 = F_2$ (where $F_k$ is the $k$-th Fibonacci number)
			- $r_{n-1} \ge 2 \cdot r_n \ge 2 = F_3$
			- $r_{n-2} \ge r_{n-1} + r_n \ge F_3 + F_2 = F_4$
			- By induction: $r_1 \ge F_{n+1}$.
			  
			  Therefore, the smaller number $b = r_1 \ge F_{n+1}$.
			  From the golden ratio approximation of Fibonacci numbers:
			  $$F_{n+1} \approx \frac{\phi^{n+1}}{\sqrt{5}} \quad \text{where} \quad \phi = \frac{1 + \sqrt{5}}{2} \approx 1.618$$
			  Taking the base-10 logarithm on both sides:
			  $$\log_{10} b \ge \log_{10} F_{n+1} > (n-1) \log_{10} \phi - \log_{10} \sqrt{5}$$
			  Since $\log_{10} \phi \approx 0.208 > 1/5$:
			  $$\log_{10} b > \frac{n-1}{5} \implies n < 5 \log_{10} b + 1$$
			  Thus, the number of steps $n$ is at most $5$ times the number of digits of $b$. Q.E.D.
		-
- # Applications & Diophantine Equations
  collapsed:: true
	- ## 1. Modular Multiplicative Inverse
		- If $\gcd(a, m) = 1$, there exists an integer $x$ such that:
		- $$ax \equiv 1 \pmod m$$
		- Using the Extended Euclidean Algorithm, we solve $ax + my = 1$.
		- Taking modulo $m$ on both sides: $ax \equiv 1 \pmod m$.
		- Thus, the coefficient $x$ returned by the algorithm is the modular inverse of $a$. (We adjust $x$ to be positive by computing `(x % m + m) % m`).
		-
	- ## 2. Linear Diophantine Equations
	  collapsed:: true
		- A **Linear Diophantine Equation** is an equation of the form:
		- $$ax + by = c$$
		- where $a$, $b$, and $c$ are given integers, and we seek only integer solutions for $x$ and $y$.
		-
		- ### Solvability Condition
			- The equation has an integer solution if and only if $c$ is a multiple of $g = \gcd(a, b)$.
			-
		- ### Finding a Particular Solution
			- We first find coefficients $x_0', y_0'$ for the equation $a x_0' + b y_0' = g$ using the Extended Euclidean Algorithm.
			- If $g \mid c$, we scale these coefficients by multiplying by $c/g$:
			- $$x_0 = x_0' \cdot \frac{c}{g}, \quad y_0 = y_0' \cdot \frac{c}{g}$$
			- This $(x_0, y_0)$ is a **particular solution** to the Diophantine equation.
			-
		- ### Finding All General Solutions
			- Once we have one particular solution $(x_0, y_0)$, we can generate all other integer solutions by shifting parameters:
			- $$x = x_0 + k \cdot \frac{b}{g}$$
			- $$y = y_0 - k \cdot \frac{a}{g}$$
			- where $k$ is any arbitrary integer.
		-
- # Implementation
  collapsed:: true
	- > [!note] Below are the implementations for both standard GCD, Extended GCD, modular inverse, and a general Linear Diophantine Equation solver.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs
	  
	  ```python
	  # 1. Standard Iterative GCD
	  def gcd(a, b):
	      while b:
	          a, b = b, a % b
	      return a
	  
	  # 2. Extended GCD
	  # Returns (gcd, x, y)
	  def extended_gcd(a, b):
	      if b == 0:
	          return a, 1, 0
	      g, x1, y1 = extended_gcd(b, a % b)
	      x = y1
	      y = x1 - (a // b) * y1
	      return g, x, y
	  
	  # 3. Modular Multiplicative Inverse
	  def mod_inverse(a, m):
	      g, x, _ = extended_gcd(a, m)
	      if g != 1:
	          return None  # Inverse does not exist
	      return (x % m + m) % m
	  
	  # 4. Linear Diophantine Equation Solver
	  # Solves ax + by = c. Returns (Success, x0, y0, dx, dy)
	  # where x = x0 + k*dx, y = y0 + k*dy
	  def solve_diophantine(a, b, c):
	      g, x0_prime, y0_prime = extended_gcd(abs(a), abs(b))
	      if c % g != 0:
	          return False, 0, 0, 0, 0
	      
	      x0 = x0_prime * (c // g)
	      y0 = y0_prime * (c // g)
	      
	      # Adjust signs for negative inputs
	      if a < 0: x0 = -x0
	      if b < 0: y0 = -y0
	          
	      return True, x0, y0, b // g, -a // g
	  
	  # Example Usage
	  print("GCD(240, 46) =", gcd(240, 46))
	  g, x, y = extended_gcd(240, 46)
	  print(f"Extended: 240*({x}) + 46*({y}) = {g}")
	  
	  success, x0, y0, dx, dy = solve_diophantine(240, 46, 10)
	  if success:
	      print(f"Diophantine particular solution: x0={x0}, y0={y0}")
	      print(f"General solution: x = {x0} + k*{dx}, y = {y0} + k*{dy}")
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <tuple>
	  #include <cmath>
	  
	  // 1. Standard Iterative GCD
	  long long gcd(long long a, long long b) {
	      while (b) {
	          a %= b;
	          std::swap(a, b);
	      }
	      return a;
	  }
	  
	  // 2. Extended GCD
	  std::tuple<long long, long long, long long> extended_gcd(long long a, long long b) {
	      if (b == 0) return {a, 1, 0};
	      auto [g, x1, y1] = extended_gcd(b, a % b);
	      long long x = y1;
	      long long y = x1 - (a / b) * y1;
	      return {g, x, y};
	  }
	  
	  // 3. Modular Multiplicative Inverse
	  long long mod_inverse(long long a, long long m) {
	      auto [g, x, y] = extended_gcd(a, m);
	      if (g != 1) return -1;
	      return (x % m + m) % m;
	  }
	  
	  // 4. Linear Diophantine Equation Solver
	  struct DiophantineResult {
	      bool has_solution;
	      long long x0, y0;
	      long long dx, dy;
	  };
	  
	  DiophantineResult solve_diophantine(long long a, long long b, long long c) {
	      auto [g, x0_prime, y0_prime] = extended_gcd(std::abs(a), std::abs(b));
	      if (c % g != 0) {
	          return {false, 0, 0, 0, 0};
	      }
	      long long x0 = x0_prime * (c / g);
	      long long y0 = y0_prime * (c / g);
	      if (a < 0) x0 = -x0;
	      if (b < 0) y0 = -y0;
	      return {true, x0, y0, b / g, -a / g};
	  }
	  
	  int main() {
	      std::cout << "GCD(240, 46) = " << gcd(240, 46) << "\n";
	      auto [g, x, y] = extended_gcd(240, 46);
	      std::cout << "Extended: 240*(" << x << ") + 46*(" << y << ") = " << g << "\n";
	      
	      auto res = solve_diophantine(240, 46, 10);
	      if (res.has_solution) {
	          std::cout << "Diophantine solution: x = " << res.x0 << " + k*" << res.dx 
	                    << ", y = " << res.y0 << " + k*" << res.dy << "\n";
	      }
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  // 1. Standard Iterative GCD
	  function gcd(a, b) {
	      while (b) {
	          let temp = b;
	          b = a % b;
	          a = temp;
	      }
	      return a;
	  }
	  
	  // 2. Extended GCD
	  function extendedGcd(a, b) {
	      if (b === 0) return [a, 1, 0];
	      const [g, x1, y1] = extendedGcd(b, a % b);
	      const x = y1;
	      const y = x1 - Math.floor(a / b) * y1;
	      return [g, x, y];
	  }
	  
	  // 3. Modular Multiplicative Inverse
	  function modInverse(a, m) {
	      const [g, x] = extendedGcd(a, m);
	      if (g !== 1) return -1;
	      return (x % m + m) % m;
	  }
	  
	  // 4. Linear Diophantine Solver
	  function solveDiophantine(a, b, c) {
	      const [g, x0Prime, y0Prime] = extendedGcd(Math.abs(a), Math.abs(b));
	      if (c % g !== 0) {
	          return { hasSolution: false };
	      }
	      let x0 = x0Prime * Math.floor(c / g);
	      let y0 = y0Prime * Math.floor(c / g);
	      if (a < 0) x0 = -x0;
	      if (b < 0) y0 = -y0;
	      return {
	          hasSolution: true,
	          x0, y0,
	          dx: Math.floor(b / g),
	          dy: -Math.floor(a / g)
	      };
	  }
	  
	  console.log("GCD(240, 46) =", gcd(240, 46));
	  const [g, x, y] = extendedGcd(240, 46);
	  console.log(`Extended: 240*(${x}) + 46*(${y}) = ${g}`);
	  const res = solveDiophantine(240, 46, 10);
	  if (res.hasSolution) {
	      console.log(`Diophantine solution: x = ${res.x0} + k*${res.dx}, y = ${res.y0} + k*${res.dy}`);
	  }
	  ```
	  
	  ```java
	  public class ExtendedGCDSolver {
	      
	      // 1. Standard GCD
	      public static long gcd(long a, long b) {
	          while (b != 0) {
	              long temp = b;
	              b = a % b;
	              a = temp;
	          }
	          return a;
	      }
	  
	      static class GCDResult {
	          long gcd, x, y;
	          GCDResult(long g, long x, long y) {
	              this.gcd = g;
	              this.x = x;
	              this.y = y;
	          }
	      }
	  
	      // 2. Extended GCD
	      public static GCDResult extendedGcd(long a, long b) {
	          if (b == 0) return new GCDResult(a, 1, 0);
	          GCDResult next = extendedGcd(b, a % b);
	          long x = next.y;
	          long y = next.x - (a / b) * next.y;
	          return new Result(next.gcd, x, y);
	      }
	  
	      // Helper to avoid naming conflicts with previous implementations
	      static class Result extends GCDResult {
	          Result(long g, long x, long y) { super(g, x, y); }
	      }
	  
	      // 3. Modular Multiplicative Inverse
	      public static long modInverse(long a, long m) {
	          GCDResult res = extendedGcd(a, m);
	          if (res.gcd != 1) return -1;
	          return (res.x % m + m) % m;
	      }
	  
	      static class DiophantineResult {
	          boolean hasSolution;
	          long x0, y0, dx, dy;
	          DiophantineResult(boolean ok, long x0, long y0, long dx, long dy) {
	              this.hasSolution = ok;
	              this.x0 = x0;
	              this.y0 = y0;
	              this.dx = dx;
	              this.dy = dy;
	          }
	      }
	  
	      // 4. Linear Diophantine Equation Solver
	      public static DiophantineResult solveDiophantine(long a, long b, long c) {
	          GCDResult res = extendedGcd(Math.abs(a), Math.abs(b));
	          if (c % res.gcd != 0) {
	              return new DiophantineResult(false, 0, 0, 0, 0);
	          }
	          long x0 = res.x * (c / res.gcd);
	          long y0 = res.y * (c / res.gcd);
	          if (a < 0) x0 = -x0;
	          if (b < 0) y0 = -y0;
	          return new DiophantineResult(true, x0, y0, b / res.gcd, -a / res.gcd);
	      }
	  
	      public static void main(String[] args) {
	          System.out.println("GCD(240, 46) = " + gcd(240, 46));
	          GCDResult res = extendedGcd(240, 46);
	          System.out.println("Extended: 240*(" + res.x + ") + 46*(" + res.y + ") = " + res.gcd);
	          
	          DiophantineResult dioph = solveDiophantine(240, 46, 10);
	          if (dioph.hasSolution) {
	              System.out.println("Diophantine: x = " + dioph.x0 + " + k*" + dioph.dx 
	                                 + ", y = " + dioph.y0 + " + k*" + dioph.dy);
	          }
	      }
	  }
	  ```
	  
	  :::
	-
- # Key Takeaways
	- **Logarithmic Complexity** — Lamé's Theorem guarantees that the Euclidean algorithm scales linearly with the number of decimal digits, making it extremely fast even for numbers with hundreds of digits.
	- **Extended Coefficients** — Computing Bezout's identity coefficients $ax + by = \gcd(a, b)$ is essential to solving Diophantine equations and computing modular inverses.
	- **Diophantine Solvability** — $ax + by = c$ is only solvable if $\gcd(a, b) \mid c$. General solutions shift around a particular solution by factors of $b/g$ and $-a/g$.
	-
- # More Learn
	- ## GitHub & Webs
		- [CP-Algorithms – Extended Euclidean Algorithm](https://cp-algorithms.com/algebra/extended-euclid-algorithm.html)
		- [Wikipedia – Euclidean Algorithm](https://en.wikipedia.org/wiki/Euclidean_algorithm)
	- ## Related Pages
		- [[Binary Exponentiation Algorithm]] – Rapid modular powering
		- [[Sieve of Eratosthenes]] – Fast prime generation
		- [[DSA Algo & System Design]] – Full DSA index