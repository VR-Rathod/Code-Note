---
seoTitle: Binary Exponentiation – Modular Reduction, Matrix Power & Proofs Guide
description: "An exhaustive master-level guide to Binary Exponentiation (Fast Exponentiation). Covers mathematical induction proofs, modular exponentiation, Fermat's and Euler's totient theorem exponent reductions, general linear recurrence matrix exponentiation, and 4-language implementations."
keywords: "binary exponentiation, fast exponentiation, modular exponentiation, modular power, matrix exponentiation, Fibonacci O(log N), Euler's totient, Fermat's Little Theorem, RSA, time complexity, DSA"
---

> [!info] What is Binary Exponentiation?
> **Binary Exponentiation** (also called **Fast Exponentiation** or **exponentiation by squaring**) is an algorithm that computes $a^b$ in **O(log b)** multiplications, instead of the naive $O(b)$ linear loop.
> It is a fundamental tool for cryptography (RSA), modular arithmetic reduction, and computing large linear recurrences via matrix exponentiation.

- # Mathematical Proof of Correctness
  collapsed:: true
	- We want to prove that the recursive formula:
	- $$P(a, b) = \begin{cases} 1 & \text{if } b = 0 \\ P(a, b/2)^2 & \text{if } b > 0 \text{ and } b \text{ is even} \\ a \cdot P(a, (b-1)/2)^2 & \text{if } b > 0 \text{ and } b \text{ is odd} \end{cases}$$
	- correctly computes $a^b$ for all integers $b \ge 0$.
	-
	- **Proof by Induction**:
	  - **Base Case**: For $b = 0$, $P(a, 0) = 1 = a^0$. The base case holds.
	  - **Inductive Step**: Assume the formula is correct for all exponents smaller than $b$. We show it holds for $b$:
	    - **Case 1: $b$ is even ($b = 2k$)**
	      $$P(a, 2k) = P(a, k)^2$$
	      By the induction hypothesis, $P(a, k) = a^k$. Therefore:
	      $$P(a, 2k) = (a^k)^2 = a^{2k} = a^b$$
	    - **Case 2: $b$ is odd ($b = 2k + 1$)**
	      $$P(a, 2k+1) = a \cdot P(a, k)^2$$
	      By the induction hypothesis, $P(a, k) = a^k$. Therefore:
	      $$P(a, 2k+1) = a \cdot (a^k)^2 = a \cdot a^{2k} = a^{2k+1} = a^b$$
	  In both cases, $P(a, b) = a^b$. By mathematical induction, the algorithm is correct. Q.E.D.
	-
- # Modular Exponentiation & Exponent Reduction
  collapsed:: true
	- ## 1. Modular Exponentiation
		- To calculate $(a^b \bmod m)$, we apply the modulus operator at every multiplication:
		- $$(x \cdot y) \bmod m = ((x \bmod m) \cdot (y \bmod m)) \bmod m$$
		- This ensures that our intermediate products never exceed $m^2$, preventing integer overflow.
		-
	- ## 2. Exponent Reduction via Euler's Totient Theorem
	  collapsed:: true
		- If the exponent $b$ is extremely large (e.g. $b = 10^{100}$ or $b = 2^{2^N}$), we cannot compute it directly. However, if $\gcd(a, m) = 1$, we can reduce the exponent using **Euler's Totient Theorem**:
		- $$a^{\phi(m)} \equiv 1 \pmod m$$
		- where $\phi(m)$ is **Euler's Totient Function** (the number of integers up to $m$ coprime to $m$).
		- Consequently, we can reduce the exponent $b$ modulo $\phi(m)$:
		- $$a^b \equiv a^{b \bmod \phi(m)} \pmod m$$
		-
		- ### Special Case: Fermat's Little Theorem
			- If the modulus $p$ is a prime number, then $\phi(p) = p - 1$.
			- If $\gcd(a, p) = 1$, the reduction simplifies to **Fermat's Little Theorem**:
			- $$a^{p-1} \equiv 1 \pmod p \implies a^b \equiv a^{b \bmod (p - 1)} \pmod p$$
		-
- # Matrix Exponentiation (Deep Dive)
  collapsed:: true
	- ## 1. Linear Recurrence Generalization
		- Suppose we have a homogeneous linear recurrence of order $k$:
		- $$F_n = c_1 F_{n-1} + c_2 F_{n-2} + \dots + c_k F_{n-k}$$
		- We can represent the state transition as a vector-matrix multiplication:
		- $$\begin{pmatrix} F_{n} \\ F_{n-1} \\ F_{n-2} \\ \vdots \\ F_{n-k+1} \end{pmatrix} = \begin{pmatrix} c_1 & c_2 & c_3 & \dots & c_k \\ 1 & 0 & 0 & \dots & 0 \\ 0 & 1 & 0 & \dots & 0 \\ \vdots & \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & \dots & 1 & 0 \end{pmatrix} \cdot \begin{pmatrix} F_{n-1} \\ F_{n-2} \\ F_{n-3} \\ \vdots \\ F_{n-k} \end{pmatrix}$$
		- Let $S_n$ be the state vector $\begin{pmatrix} F_n & F_{n-1} & \dots & F_{n-k+1} \end{pmatrix}^T$, and $T$ be the $k \times k$ transition matrix.
		- $$S_n = T \cdot S_{n-1}$$
		- By induction, we can compute the $n$-th state vector directly from the base state $S_{k-1}$:
		- $$S_n = T^{n - k + 1} \cdot S_{k-1}$$
		- Since we can compute $T^{n - k + 1}$ in $O(k^3 \log n)$ matrix multiplications using binary exponentiation, we can find the $n$-th term of any linear recurrence in logarithmic time.
		-
	- ## 2. Example: Tribonacci Numbers
	  collapsed:: true
		- The Tribonacci sequence is defined as:
		  $$T_n = T_{n-1} + T_{n-2} + T_{n-3} \quad \text{with} \quad T_0 = 0, T_1 = 0, T_2 = 1$$
		- The transition matrix $T$ is:
		  $$T = \begin{pmatrix} 1 & 1 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{pmatrix}$$
		- To find the $n$-th Tribonacci number, we compute:
		  $$\begin{pmatrix} T_n \\ T_{n-1} \\ T_{n-2} \end{pmatrix} = \begin{pmatrix} 1 & 1 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{pmatrix}^{n-2} \cdot \begin{pmatrix} T_2 \\ T_1 \\ T_0 \end{pmatrix}$$
		-
- # Time & Space Complexity
  collapsed:: true
	- ## Complexity Table
	  collapsed:: true
		- | Implementation | Time Complexity | Space Complexity | Details |
		  |---|---|---|---|
		  | **Standard Power** | $O(\log b)$ | $O(\log b)$ recursive / $O(1)$ iterative | Halves exponent size at each step |
		  | **Modular Power** | $O(\log b)$ | $O(1)$ iterative | Numbers kept small by modulus $m$ |
		  | **Matrix Power** | $O(K^3 \log N)$ | $O(K^2)$ | $K \times K$ matrix size |
		-
- # Implementation
  collapsed:: true
	- > [!note] Below are the implementations for iterative Modular Exponentiation and 2x2 Matrix Exponentiation (to compute Fibonacci).
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs

	  ```python
	  # 1. Iterative Modular Exponentiation: (a^b) % m
	  def bin_pow(a, b, m):
	      res = 1
	      a = a % m
	      while b > 0:
	          if b & 1:
	              res = (res * a) % m
	          a = (a * a) % m
	          b >>= 1
	      return res

	  # 2. Matrix Multiplication Helper
	  def multiply_matrix(A, B, m):
	      C = [[0, 0], [0, 0]]
	      for i in range(2):
	          for j in range(2):
	              for k in range(2):
	                  C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % m
	      return C

	  # 3. Matrix Exponentiation to get Fibonacci F_N % m
	  def fibonacci_matrix(n, m):
	      if n == 0:
	          return 0
	      # Transition matrix T = [[1, 1], [1, 0]]
	      T = [[1, 1], [1, 0]]
	      # Identity matrix I
	      I = [[1, 0], [0, 1]]
	      
	      # Power transition matrix to T^(n-1)
	      power = n - 1
	      while power > 0:
	          if power & 1:
	              I = multiply_matrix(I, T, m)
	          T = multiply_matrix(T, T, m)
	          power >>= 1
	      # F_n is I[0][0]
	      return I[0][0]

	  # Example usage
	  print("3^13 % 1000000007 =", bin_pow(3, 13, 1000000007))
	  print("10th Fibonacci % 10007 =", fibonacci_matrix(10, 10007))  # 55
	  ```

	  ```c++
	  #include <iostream>
	  #include <vector>

	  // 1. Iterative Modular Exponentiation: (a^b) % m
	  long long bin_pow(long long a, long long b, long long m) {
	      long long res = 1;
	      a %= m;
	      while (b > 0) {
	          if (b & 1)
	              res = (res * a) % m;
	          a = (a * a) % m;
	          b >>= 1;
	      }
	      return res;
	  }

	  typedef std::vector<std::vector<long long>> Matrix;

	  // Helper to multiply 2x2 matrices
	  Matrix multiply(const Matrix& A, const Matrix& B, long long m) {
	      Matrix C(2, std::vector<long long>(2, 0));
	      for (int i = 0; i < 2; ++i) {
	          for (int j = 0; j < 2; ++j) {
	              for (int k = 0; k < 2; ++k) {
	                  C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % m;
	              }
	          }
	      }
	      return C;
	  }

	  // 2. Matrix Exponentiation to get Fibonacci F_N % m
	  long long fibonacci_matrix(long long n, long long m) {
	      if (n == 0) return 0;
	      Matrix T = {{1, 1}, {1, 0}};
	      Matrix I = {{1, 0}, {0, 1}};

	      long long power = n - 1;
	      while (power > 0) {
	          if (power & 1)
	              I = multiply(I, T, m);
	          T = multiply(T, T, m);
	          power >>= 1;
	      }
	      return I[0][0];
	  }

	  int main() {
	      std::cout << "3^13 % 1000000007 = " << bin_pow(3, 13, 1000000007) << "\n";
	      std::cout << "10th Fibonacci % 10007 = " << fibonacci_matrix(10, 10007) << "\n";
	      return 0;
	  }
	  ```

	  ```javascript
	  // 1. Iterative Modular Exponentiation: (a^b) % m using BigInt for safety
	  function binPow(a, b, m) {
	      let res = 1n;
	      a = BigInt(a) % BigInt(m);
	      b = BigInt(b);
	      const mod = BigInt(m);
	      
	      while (b > 0n) {
	          if (b & 1n) {
	              res = (res * a) % mod;
	          }
	          a = (a * a) % mod;
	          b >>= 1n;
	      }
	      return Number(res);
	  }

	  // Helper to multiply 2x2 matrices
	  function multiply(A, B, m) {
	      const C = [[0n, 0n], [0n, 0n]];
	      const mod = BigInt(m);
	      for (let i = 0; i < 2; i++) {
	          for (let j = 0; j < 2; j++) {
	              for (let k = 0; k < 2; k++) {
	                  C[i][j] = (C[i][j] + BigInt(A[i][k]) * BigInt(B[k][j])) % mod;
	              }
	          }
	      }
	      return C;
	  }

	  // 2. Matrix Exponentiation to get Fibonacci F_N % m
	  function fibonacciMatrix(n, m) {
	      if (n === 0) return 0;
	      let T = [[1n, 1n], [1n, 0n]];
	      let I = [[1n, 0n], [0n, 1n]];

	      let power = BigInt(n - 1);
	      while (power > 0n) {
	          if (power & 1n) {
	              I = multiply(I, T, m);
	          }
	          T = multiply(T, T, m);
	          power >>= 1n;
	      }
	      return Number(I[0][0]);
	  }

	  console.log("3^13 % 1000000007 =", binPow(3, 13, 1000000007));
	  console.log("10th Fibonacci % 10007 =", fibonacciMatrix(10, 10007));
	  ```

	  ```java
	  import java.util.*;

	  public class BinaryExponentiation {

	      // 1. Iterative Modular Exponentiation: (a^b) % m
	      public static long binPow(long a, long b, long m) {
	          long res = 1;
	          a %= m;
	          while (b > 0) {
	              if ((b & 1) == 1) {
	                  res = (res * a) % m;
	              }
	              a = (a * a) % m;
	              b >>= 1;
	          }
	          return res;
	      }

	      // Helper to multiply 2x2 matrices
	      private static long[][] multiply(long[][] A, long[][] B, long m) {
	          long[][] C = new long[2][2];
	          for (int i = 0; i < 2; i++) {
	              for (int j = 0; j < 2; j++) {
	                  for (int k = 0; k < 2; k++) {
	                      C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % m;
	                  }
	              }
	          }
	          return C;
	      }

	      // 2. Matrix Exponentiation to get Fibonacci F_N % m
	      public static long fibonacciMatrix(long n, long m) {
	          if (n == 0) return 0;
	          long[][] T = {{1, 1}, {1, 0}};
	          long[][] I = {{1, 0}, {0, 1}};

	          long power = n - 1;
	          while (power > 0) {
	              if ((power & 1) == 1) {
	                  I = multiply(I, T, m);
	              }
	              T = multiply(T, T, m);
	              power >>= 1;
	          }
	          return I[0][0];
	          }

	      public static void main(String[] args) {
	          System.out.println("3^13 % 1000000007 = " + binPow(3, 13, 1000000007));
	          System.out.println("10th Fibonacci % 10007 = " + fibonacciMatrix(10, 10007));
	      }
	  }
	  ```

	  :::
	-
- # Key Takeaways
	- **Logarithmic Exponentiation** — Halving the exponent size at each step by squaring the base reduces linear multiplication loops $O(b)$ to $O(\log b)$ operations.
	- **Modular Safety & Euler Reduction** — Modular multiplication prevents overflow. Euler's Totient Theorem ($a^b \equiv a^{b \bmod \phi(m)} \pmod m$) enables reducing massive exponent terms.
	- **Matrix Recurrence Solving** — Linear homogeneous recurrences (e.g. Fibonacci, Tribonacci) are solvable in $O(k^3 \log N)$ time by exponentiating the transition matrix $T$.
	-
- # More Learn
	- ## GitHub & Webs
		- [CP-Algorithms – Binary Exponentiation](https://cp-algorithms.com/algebra/binary-exponentiation.html)
		- [Wikipedia – Exponentiation by squaring](https://en.wikipedia.org/wiki/Exponentiation_by_squaring)
	- ## Related Pages
		- [[Euclidean Algorithm for GCD]] – Extended GCD and modular inverse
		- [[Sieve of Eratosthenes]] – Fast prime generation
		- [[DSA Algo & System Design]] – Full DSA index