# Explanation
	- **Euclid's Algorithm** is an efficient way to compute the **Greatest Common Divisor (GCD)** of two integers.
	-
	- The algorithm works on the principle that the GCD of two numbers also divides their difference. In mathematical terms:
		- **GCD(a, b) = GCD(b, a % b)**, where `%` is the modulus operator.
		-
		- This process is repeated until one of the numbers becomes zero, and the non-zero number is the GCD.
-
- # Steps
	- Take two integers `a` and `b`.
	-
	- Repeat the process: set `a = b` and `b = a % b` until `b == 0`.
	-
	- The GCD is the value of `a` when `b == 0`.
-
- # Time Complexity:
	- O(log(min(a, b))), where a and b are the two input numbers.
-
- ```python
  def gcd(a, b):
      while b:
          a, b = b, a % b
      return a
  
  # Example Usage
  a = 56
  b = 98
  result = gcd(a, b)
  print(f"GCD of {a} and {b} is: {result}")
  ```