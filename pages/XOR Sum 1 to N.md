---
seoTitle: Fast O(1) XOR Sum from 1 to N Formula
description: "Learn the competitive programming trick to compute the bitwise XOR sum of all integers from 1 to N in O(1) time without looping."
keywords: "xor sum, bitwise operations, competitive programming math, O(1) time complexity, bit manipulation trick, VR-Rathod, Code-Note, code note vr, vr book"
treeTitle: DSA - Advanced Tips - XOR Sum 1 to N
---

> [!info] The XOR Sum Trick
> If you need to calculate `1 ^ 2 ^ 3 ^ ... ^ N` (the bitwise XOR sum of all integers from $1$ to $N$), you do not need an $O(N)$ loop.
> Thanks to a repeating mathematical pattern in binary representations, this can be solved in pure **$O(1)$ constant time**.

- # Explanation
	- If we write down the XOR sum from $1$ to $N$ and observe the results, a perfect repeating sequence of length 4 emerges.
	- Let $f(N)$ be the XOR sum of $1 \oplus 2 \oplus \dots \oplus N$.
	- | N | Sequence | Binary | Result $f(N)$ | Pattern |
	  |---|---|---|---|---|
	  | 1 | `1` | `001` | **1** | $N$ |
	  | 2 | `1 ^ 2` | `011` | **3** | $N + 1$ |
	  | 3 | `1 ^ 2 ^ 3` | `000` | **0** | $0$ |
	  | 4 | `1 ^ 2 ^ 3 ^ 4` | `100` | **4** | $N$ |
	  | 5 | `... ^ 5` | `001` | **1** | $1$ |
	  | 6 | `... ^ 6` | `111` | **7** | $N + 1$ |
	  | 7 | `... ^ 7` | `000` | **0** | $0$ |
	  | 8 | `... ^ 8` | `1000` | **8** | $N$ |
	- **The Pattern:** 
	  Based on the remainder of $N \pmod 4$:
		- If `N % 4 == 0`, then $f(N) = N$
		- If `N % 4 == 1`, then $f(N) = 1$
		- If `N % 4 == 2`, then $f(N) = N + 1$
		- If `N % 4 == 3`, then $f(N) = 0$
- # Implementation
  collapsed:: true
	- :::code-tabs
	  
	  ```python
	  def compute_xor_1_to_n(n):
	      remainder = n % 4
	      if remainder == 0:
	          return n
	      elif remainder == 1:
	          return 1
	      elif remainder == 2:
	          return n + 1
	      else:
	          return 0
	          
	  print(f"XOR Sum 1 to 100: {compute_xor_1_to_n(100)}")
	  ```
	  
	  ```c++
	  #include <iostream>
	  
	  int computeXor1ToN(int n) {
	      switch(n % 4) {
	          case 0: return n;
	          case 1: return 1;
	          case 2: return n + 1;
	          case 3: return 0;
	      }
	      return 0; // Fallback, never reached
	  }
	  
	  int main() {
	      std::cout << "XOR Sum 1 to 100: " << computeXor1ToN(100) << "\n";
	      return 0;
	  }
	  ```
	  :::
- # Finding XOR Sum between L and R
	- Because XOR is its own inverse ($A \oplus A = 0$), you can find the XOR sum of a range $[L, R]$ in $O(1)$ time by computing:
	- `XOR_Sum(L, R) = f(R) ^ f(L - 1)`
	- This perfectly cancels out the prefix from $1$ to $L-1$.
- # Key Takeaways
	- The XOR sum from $1$ to $N$ repeats in a predictable 4-step cycle.
	- Using modulo arithmetic, we bypass $O(N)$ iteration entirely.
	- Range queries $[L, R]$ can be computed in $O(1)$ by combining two prefix sums.
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Calculate XOR from 1 to n](https://www.geeksforgeeks.org/calculate-xor-1-n/)