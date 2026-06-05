---
seoTitle: Gosper's Hack – Fast O(1) Bitwise Combinatorics Iteration
description: "Learn Gosper's Hack, an advanced bitwise trick to generate the next integer with the same number of set bits in O(1) time."
keywords: "gospers hack, bitwise combinatorics, k-combinations, set bits, bitwise algorithms, competitive programming, VR-Rathod, Code-Note, code note vr, vr book"
treeTitle: DSA - Advanced Tips - Gospers Hack
---

> [!info] What is Gosper's Hack?
> **Gosper's Hack** is a brilliantly optimized bitwise formula that generates the *next* integer having exactly the same number of set bits (1s) as the current integer.
> It executes in pure $O(1)$ time without any loops, making it the absolute fastest way to iterate through all $k$-combinations of an $n$-element set.

- # Explanation
	- In combinatorics (e.g., in the Traveling Salesperson Problem using Dynamic Programming), you often need to iterate over all subsets of size $k$ from a total of $n$ elements.
	- A subset is typically represented as a bitmask. For example, if $n=5$ and $k=3$, a bitmask like `00111` (decimal 7) represents selecting the first three items. The "next" subset of size 3 is `01011` (decimal 11).
	- Traditionally, calculating the "next" mask requires a loop. Gosper's Hack calculates it directly via arithmetic and bitwise shifts.
- # How It Works
  collapsed:: true
	- Let $X$ be the current integer.
	- 1. Isolate the rightmost set bit: `c = X & -X`
	- 2. Find the block of consecutive set bits starting from the rightmost bit, and flip the bit immediately to its left: `r = X + c`
	- 3. Right-shift the block of ones to the far right to reset the sequence, then OR it with the flipped block: `(((r ^ X) >> 2) / c) | r`
	- The combination of these operations produces the lexicographically next bitmask.
- # Implementation
  collapsed:: true
	- :::code-tabs
	  
	  ```c++
	  #include <iostream>
	  #include <bitset>
	  
	  // Generates the next integer with the same number of set bits
	  int nextCombination(int x) {
	      int c = x & -x;
	      int r = x + c;
	      // Shift bits, dividing by c (which is a power of 2, so this is safe)
	      return (((r ^ x) >> 2) / c) | r; 
	  }
	  
	  int main() {
	      // We want all subsets of size 3 (00111 in binary = 7)
	      int current = 7;
	      
	      // 0111000 in binary = 56, the maximum value for 3 bits in 6 total slots
	      int limit = 56;  
	  
	      while (current <= limit) {
	          std::cout << std::bitset<6>(current) << "\n";
	          current = nextCombination(current);
	      }
	      return 0;
	  }
	  ```
	  
	  ```python
	  def next_combination(x):
	      c = x & -x
	      r = x + c
	      # In Python, integer division is //
	      return (((r ^ x) >> 2) // c) | r
	  
	  current = 7
	  for _ in range(5):
	      print(f"{current:06b}")
	      current = next_combination(current)
	  ```
	  :::
- # Key Takeaways
	- Gosper's hack eliminates the need for recursive generation or iterative combinations counting.
	- It uses fundamental Two's Complement properties (`x & -x`) to manipulate bit groupings.
	- It is heavily utilized in subset-sum optimizations, dynamic programming over subsets (Bitmask DP), and competitive programming.
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Wikipedia -> Combinatorial number system (Gosper's hack)](https://en.wikipedia.org/wiki/Combinatorial_number_system#Applications)