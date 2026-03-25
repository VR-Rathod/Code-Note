---
seoTitle: Ackermann Function Explained – Recursion and Complexity
description: "The Ackermann function is a total computable function that is not primitive recursive. Explore its definition, recursion depth, and complexity analysis."
keywords: "Ackermann function, recursion, primitive recursive, computability theory, recursive function, time complexity, space complexity, theoretical computer science, call stack"
---

# Explanation
	- The **Ackermann function** is a well-known recursive function that grows very quickly. It is often used in theoretical computer science to illustrate the difference between primitive recursive functions and general recursive functions.
-
- # Steps
	- The function is defined as:
	-
	- A(0, n) = n + 1
	-
	- A(m, 0) = A(m - 1, 1) for m > 0
	-
	- A(m, n) = A(m - 1, A(m, n - 1)) for m > 0 and n > 0
-
- # Time Complexity
	- The **time complexity** of the Ackermann function is not expressible in simple Big-O notation, as it grows faster than any primitive recursive function.
-
- ```python
  def ackermann(m, n):
      if m == 0:
          return n + 1
      elif m > 0 and n == 0:
          return ackermann(m - 1, 1)
      else:
          return ackermann(m - 1, ackermann(m, n - 1))
  
  # Example usage
  print(ackermann(3, 4))  # This will calculate A(3, 4)
  ```