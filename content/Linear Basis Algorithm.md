---
seoTitle: Linear Basis Algorithm – XOR Subset Maximization and Vector Spaces
description: "Master the Linear Basis Algorithm in competitive programming. Learn vector spaces over F_2, inserting elements in O(D), finding maximum XOR subset sum, and implementations in Python, C++, JavaScript, and Java."
keywords: "linear basis, XOR basis, vector spaces, F_2, maximum XOR subset, linear algebra, competitive programming, bitwise algorithms, DSA"
---

> [!info] What is the Linear Basis Algorithm?
> **Linear Basis** is an advanced data structure/algorithm that uses linear algebra concepts over the binary field $\mathbb{F}_2$ to solve subset XOR problems.
> It can represent the XOR sums of all possible subsets of an array using a compact basis of size at most $D$ (where $D$ is the maximum number of bits, e.g., 30 or 60).
> **Insert / Query Complexity: O(D)**.

- # Mathematical Foundations
  collapsed:: true
	- ## 1. Integers as Vectors
		- Any integer can be represented in binary:
		- $$x = \sum_{i=0}^{D-1} b_i 2^i \quad \text{where} \quad b_i \in \{0, 1\}$$
		- This binary representation maps directly to a vector in a $D$-dimensional vector space over the field $\mathbb{F}_2$:
		- $$\vec{x} = (b_{D-1}, \dots, b_1, b_0)$$
		-
	- ## 2. XOR as Vector Addition
		- The bitwise XOR operation ($\oplus$) corresponds exactly to vector addition modulo 2 (without carry) in $\mathbb{F}_2$:
		- $$\vec{x} \oplus \vec{y} = (b_x \oplus b_y)_{D-1, \dots, 0}$$
		-
	- ## 3. Linear Independence and Basis
		- A set of vectors is **linearly independent** if no vector in the set can be formed by XORing a subset of the other vectors.
		- A **Linear Basis** of a set of numbers $S$ is a minimal subset of linearly independent numbers that spans (can generate via XOR) the exact same set of values as $S$.
		- Since the vector space has dimension $D$, the size of the basis is at most $D$.
		-
- # How the Algorithm Works
  collapsed:: true
	- We maintain an array `basis` of size $D$ (initially all zeros), where `basis[i]` stores a number in our basis whose highest set bit (MSB) is at index $i$.
	-
	- ## 1. Insertion (`insert(x)`)
		- To insert a number $x$:
		  - Iterate through its bits from MSB ($D-1$) down to LSB ($0$).
		  - If the $i$-th bit of $x$ is set ($1$):
		    - If `basis[i]` is empty ($0$), we insert $x$ here (`basis[i] = x`) and stop.
		    - If `basis[i]` is occupied, we XOR $x$ with `basis[i]` (`x ^= basis[i]`) and continue.
		  - If $x$ becomes $0$, it means $x$ was already linearly dependent on the current basis elements, so it cannot be added.
		-
	- ## 2. Querying Maximum XOR (`query_max()`)
		- To find the maximum possible XOR sum of any subset of the inserted numbers:
		  - Initialize `res = 0`.
		  - Iterate from $D-1$ down to $0$.
		  - If `(res ^ basis[i]) > res`, set `res ^= basis[i]`.
		  - Return `res`.
		  - This greedy approach is guaranteed to yield the global maximum because the MSB of `basis[i]` is strictly at index $i$, meaning each step optimizes the highest possible bit.
		-
- # Step-by-Step Trace (Insert `[4, 6, 2]`)
  collapsed:: true
	- Let $D = 3$ (bases for bits 2, 1, 0). `basis` is initially `[0, 0, 0]`.
	- Let's insert the numbers `4`, `6`, and `2`:
	-
	- 1. **Insert 4** (`100` in binary):
	   - MSB is at bit index 2.
	   - `basis[2]` is empty ($0$).
	   - Insert: `basis[2] = 4`.
	   - `basis` is now `[4, 0, 0]`.
	- 2. **Insert 6** (`110` in binary):
	   - MSB is at bit index 2.
	   - `basis[2]` is occupied ($4$, `100`).
	   - XOR: `6 ^ 4 = 2` (`010` in binary).
	   - Now process $2$. MSB of $2$ is at bit index 1.
	   - `basis[1]` is empty ($0$).
	   - Insert: `basis[1] = 2`.
	   - `basis` is now `[4, 2, 0]`.
	- 3. **Insert 2** (`010` in binary):
	   - MSB is at bit index 1.
	   - `basis[1]` is occupied ($2$, `010`).
	   - XOR: `2 ^ 2 = 0`.
	   - Value becomes $0$. Not inserted (already spanned by $4 \oplus 6 = 2$).
	-
	- **Final Basis**: `[4, 2, 0]`. Spans the subset values $\{0, 2, 4, 6\}$.
	- Max XOR sum is `query_max() = 0 ^ 4 ^ 2 = 6`.
	-
- # Time & Space Complexity
  collapsed:: true
	- ## Complexity Table
	  collapsed:: true
		- | Operation | Time Complexity | Space Complexity | Details |
		  |---|---|---|---|
		  | **Insert** | $O(D)$ | $O(D)$ | $D$ bit iterations |
		  | **Query Max** | $O(D)$ | $O(1)$ | Greedy scan down |
		  | **Query Min** | $O(D)$ | $O(1)$ | Smallest non-zero element |
		  | **Check Spanned** | $O(D)$ | $O(1)$ | Test if element reduces to 0 |
		-
		- $D$ is the maximum number of bits (usually 30 for $10^9$ and 60 for $10^{18}$).
		-
- # Implementation
  collapsed:: true
	- > [!note] Below are the implementations for a 30-bit Linear Basis.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs

	  ```python
	  class LinearBasis:
	      def __init__(self, d=30):
	          self.d = d
	          self.basis = [0] * d

	      def insert(self, x):
	          for i in range(self.d - 1, -1, -1):
	              if (x >> i) & 1:
	                  if not self.basis[i]:
	                      self.basis[i] = x
	                      return True
	                  x ^= self.basis[i]
	          return False

	      def query_max(self):
	          res = 0
	          for i in range(self.d - 1, -1, -1):
	              if (res ^ self.basis[i]) > res:
	                  res ^= self.basis[i]
	          return res

	      def exists(self, x):
	          for i in range(self.d - 1, -1, -1):
	              if (x >> i) & 1:
	                  if not self.basis[i]:
	                      return False
	                  x ^= self.basis[i]
	          return x == 0

	  # Example usage
	  lb = LinearBasis()
	  lb.insert(4)
	  lb.insert(6)
	  lb.insert(2)
	  print("Max XOR sum:", lb.query_max())  # 6
	  print("Exists 2:", lb.exists(2))      # True
	  print("Exists 5:", lb.exists(5))      # False
	  ```

	  ```c++
	  #include <iostream>
	  #include <vector>

	  class LinearBasis {
	  private:
	      int d;
	      std::vector<long long> basis;

	  public:
	      LinearBasis(int d = 60) : d(d), basis(d, 0) {}

	      bool insert(long long x) {
	          for (int i = d - 1; i >= 0; --i) {
	              if ((x >> i) & 1) {
	                  if (!basis[i]) {
	                      basis[i] = x;
	                      return true;
	                  }
	                  x ^= basis[i];
	              }
	          }
	          return false;
	      }

	      long long query_max() {
	          long long res = 0;
	          for (int i = d - 1; i >= 0; --i) {
	              if ((res ^ basis[i]) > res) {
	                  res ^= basis[i];
	              }
	          }
	          return res;
	      }

	      bool exists(long long x) {
	          for (int i = d - 1; i >= 0; --i) {
	              if ((x >> i) & 1) {
	                  if (!basis[i]) return false;
	                  x ^= basis[i];
	              }
	          }
	          return x == 0;
	      }
	  };

	  int main() {
	      LinearBasis lb(30);
	      lb.insert(4);
	      lb.insert(6);
	      lb.insert(2);
	      std::cout << "Max XOR sum: " << lb.query_max() << "\n"; // 6
	      std::cout << "Exists 2: " << (lb.exists(2) ? "Yes" : "No") << "\n"; // Yes
	      return 0;
	  }
	  ```

	  ```javascript
	  class LinearBasis {
	      constructor(d = 30) {
	          this.d = d;
	          this.basis = new Array(d).fill(0);
	      }

	      insert(x) {
	          for (let i = this.d - 1; i >= 0; i--) {
	              if ((x >> i) & 1) {
	                  if (this.basis[i] === 0) {
	                      this.basis[i] = x;
	                      return true;
	                  }
	                  x ^= this.basis[i];
	              }
	          }
	          return false;
	      }

	      queryMax() {
	          let res = 0;
	          for (let i = this.d - 1; i >= 0; i--) {
	              if ((res ^ this.basis[i]) > res) {
	                  res ^= this.basis[i];
	              }
	          }
	          return res;
	      }

	      exists(x) {
	          for (let i = this.d - 1; i >= 0; i--) {
	              if ((x >> i) & 1) {
	                  if (this.basis[i] === 0) return false;
	                  x ^= this.basis[i];
	              }
	          }
	          return x === 0;
	      }
	  }

	  const lb = new LinearBasis();
	  lb.insert(4);
	  lb.insert(6);
	  lb.insert(2);
	  console.log("Max XOR sum:", lb.queryMax()); // 6
	  ```

	  ```java
	  public class LinearBasis {
	      private final int d;
	      private final long[] basis;

	      public LinearBasis(int d) {
	          this.d = d;
	          this.basis = new long[d];
	      }

	      public boolean insert(long x) {
	          for (int i = d - 1; i >= 0; i--) {
	              if (((x >> i) & 1) == 1) {
	                  if (basis[i] == 0) {
	                      basis[i] = x;
	                      return true;
	                  }
	                  x ^= basis[i];
	              }
	          }
	          return false;
	      }

	      public long queryMax() {
	          long res = 0;
	          for (int i = d - 1; i >= 0; i--) {
	              if ((res ^ basis[i]) > res) {
	                  res ^= basis[i];
	              }
	          }
	          return res;
	      }

	      public boolean exists(long x) {
	          for (int i = d - 1; i >= 0; i--) {
	              if (((x >> i) & 1) == 1) {
	                  if (basis[i] == 0) return false;
	                  x ^= basis[i];
	              }
	          }
	          return x == 0;
	      }

	      public static void main(String[] args) {
	          LinearBasis lb = new LinearBasis(30);
	          lb.insert(4);
	          lb.insert(6);
	          lb.insert(2);
	          System.out.println("Max XOR sum: " + lb.queryMax()); // 6
	      }
	  }
	  ```

	  :::
	-
- # Key Takeaways
	- **XOR Vector Space** — Integers are treated as vectors over $\mathbb{F}_2$, and XOR functions as vector addition.
	- **Linear Independence** — Only numbers that introduce new set bits not covered by the current basis span are inserted.
	- **O(D) Efficiency** — The basis keeps space and query costs bound to the word size ($D \approx 30 \text{ or } 60$), which is exceptionally fast in practice.
	-
- # More Learn
	- ## Resources
		- [Codeforces – General Idea of Linear Basis](https://codeforces.com/blog/entry/68953)
	- ## Related Pages
		- [[Bitwise Hacks]] – Fundamental bit manipulation guides
		- [[Submask Bitwise Iteration]] – O(3^N) submask dynamic programming
		- [[DSA Algo & System Design]] – Master DSA checklist
