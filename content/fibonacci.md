---
seoTitle: Fibonacci Sequence – Algorithms, Complexity, and Implementations
description: "Explore Fibonacci number computation via recursion, memoization, dynamic programming, and matrix exponentiation."
keywords: "Fibonacci sequence, dynamic programming, memoization, matrix exponentiation, recursion, O(n), O(log n), time complexity, space complexity, golden ratio, algorithm"
---

- Useful for moderate n values
- ```C++
  // Usefull for small Numbers
  int fib = round(pow(1.618, n) / sqrt(5));
  ```
- ```python
  import math
  
  def fibonacci(n):
      phi = (1 + math.sqrt(5)) / 2
      return round((phi ** n) / math.sqrt(5))
  
  print(fibonacci(int(input())))
  ```