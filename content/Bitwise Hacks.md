---
seoTitle: Advanced Bitwise Hacks – O(1) Fast Formulas
description: "Master advanced bitwise operations including Brian Kernighan's Algorithm, XOR Swaps, and Power of 2 checks."
keywords: "bitwise hacks, brian kernighan algorithm, xor swap, power of 2, bit manipulation, fast formulas, O(1), VR-Rathod, Code-Note, code note vr, vr book"
---

> [!info] What are Bitwise Hacks?
> Bitwise hacks are extremely fast, low-level formulas that manipulate integer data directly at the binary level using bitwise operators (`&`, `|`, `^`, `~`, `<<`, `>>`).
> They execute in a single CPU cycle ($O(1)$) and are essential for competitive programming, graphics engines, and performance-critical systems.

- # 1. Check if a Number is a Power of 2
  - **Formula**: `(x & (x - 1)) == 0`
  - **Explanation**: A power of 2 has exactly one bit set to `1` (e.g., `8` is `1000`). Subtracting `1` from it flips all bits starting from that single `1` downwards (e.g., `7` is `0111`). Therefore, `x & (x - 1)` clears that single bit, leaving `0`.
  - **Note**: Ensure `x > 0` before checking.
  - ```c++
    bool isPowerOfTwo(int x) {
        return x > 0 && (x & (x - 1)) == 0;
    }
    ```

- # 2. Count Set Bits (Brian Kernighan’s Algorithm)
  - **Formula**: `x = x & (x - 1)`
  - **Explanation**: Instead of checking every bit in an integer ($O(\text{Bits})$ time), Brian Kernighan's algorithm drops the lowest set bit in each iteration.
  - **Time Complexity**: $O(K)$ where $K$ is the number of set bits (`1`s).
  - ```python
    def count_set_bits(x):
        count = 0
        while x > 0:
            x = x & (x - 1)  # Clear the lowest set bit
            count += 1
        return count
    ```

- # 3. Isolate the Rightmost 1-Bit
  - **Formula**: `x & (-x)`
  - **Explanation**: In Two's Complement representation, `-x` is equivalent to `(~x) + 1`. This mathematical property flips all bits above the lowest set bit, leaving only the rightmost set bit in common with `x`.
  - Highly useful in building the Fenwick Tree (Binary Indexed Tree).
  - ```c++
    int isolateRightmostBit(int x) {
        return x & (-x);
    }
    ```

- # 4. The XOR Swap
  - **Formula**: `a ^= b; b ^= a; a ^= b;`
  - **Explanation**: Swaps the values of two variables without using a temporary third variable, utilizing the property $A \oplus B \oplus B = A$.
  - ```c++
    void swap(int &a, int &b) {
        if (&a != &b) { // Must not point to the same memory location!
            a ^= b;
            b ^= a;
            a ^= b;
        }
    }
    ```

- # Key Takeaways
  collapsed:: true
  - Bitwise hacks exploit the binary representation of integers to replace loops and conditionals with single-instruction math.
  - They are the foundation of many high-performance data structures like Fenwick Trees and Zobrist Hashing.

- # More Learn
  collapsed:: true
  - ## GitHub & Webs
    - [Bit Twiddling Hacks (Stanford)](https://graphics.stanford.edu/~seander/bithacks.html)
    - [GeeksforGeeks -> Bit Magic](https://www.geeksforgeeks.org/bitwise-hacks-for-competitive-programming/)
