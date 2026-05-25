---
date: 2025-05-15T11:00:41+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Method Overloading in OOP – Compile-Time Polymorphism Guide
description: "Method overloading defines multiple methods with the same name but different parameters. Covers compile-time polymorphism, parameter types, return types, and."
keywords: "method overloading, OOP, compile-time polymorphism, static polymorphism, parameter types, Java overloading, C++ overloading, Python overloading, software design"
---

- # Explanation
	- **Method Overloading** allows a class to have multiple methods with the same name but different parameters (number or type of parameters). However, Python **does not support method overloading** natively. In Python, the last method definition overrides any previous ones with the same name.
	- In languages like Java, you can overload methods with different argument types or numbers, but Python handles this differently by allowing only one method definition per name.
-
- # Steps
	- In languages that support method overloading (e.g., Java), define multiple methods with the same name but different signatures.
	- In Python, you can simulate overloading by checking argument types or numbers inside a method.
-
- ```python
  class Calculator:
      def add(self, a, b=None):  # Optional second argument for overloading
          if b is not None:
              return a + b
          return a + a  # If only one argument, add it twice
  
  calc = Calculator()
  print(calc.add(5))  # Output: 10
  print(calc.add(5, 3))  # Output: 8
  ```
-
- ---
- # c++
	- In **C++**, method overloading allows a class to have multiple methods with the same name but different parameter lists (different number or type of parameters). The compiler determines which method to call based on the arguments passed.
-
- # Explanation
	- In C++, **method overloading** means that two or more methods with the same name can exist in the same class, but they must differ in the number or types of their parameters.
	- The C++ compiler will choose the correct method to call at **compile-time** based on the arguments passed.
-
- # Steps
	- Define methods with the same name but different parameter types or numbers.
	- The compiler resolves which method to call based on the arguments at compile-time.
-
- ```C++
  #include <iostream>
  using namespace std;
  
  class Calculator {
  public:
      // Overloaded add method with two integers
      int add(int a, int b) {
          return a + b;
      }
  
      // Overloaded add method with three integers
      int add(int a, int b, int c) {
          return a + b + c;
      }
  
      // Overloaded add method with two doubles
      double add(double a, double b) {
          return a + b;
      }
  };
  
  int main() {
      Calculator calc;
  
      cout << "Sum of two integers: " << calc.add(2, 3) << endl;        // Calls add(int, int)
      cout << "Sum of three integers: " << calc.add(2, 3, 4) << endl;    // Calls add(int, int, int)
      cout << "Sum of two doubles: " << calc.add(2.5, 3.5) << endl;      // Calls add(double, double)
  
      return 0;
  }
  ```