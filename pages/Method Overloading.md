---
seoTitle: Method Overloading in OOP – Complete In-Depth Guide | Compile-time Polymorphism, Multiple Dispatch
description: "Deep dive into Method Overloading in OOP. Covers compile-time polymorphism, how different languages handle overloading, Python alternatives (default args, *args, @singledispatch), and examples in Python, C++, Java, JavaScript, and C#."
keywords: "method overloading, OOP, compile-time polymorphism, function overloading, @singledispatch, default arguments, Python overloading, Java overloading, C++ overloading, VR-Rathod, Code-Note"
displayTitle: Method Overloading
treeTitle: DSA - OOP - Method Overloading
---

> [!info] What is Method Overloading?
> **Method Overloading** is the ability to define **multiple methods with the same name but different parameter signatures** (different types, counts, or order) within the same class. The correct version is selected at **compile time** based on the arguments passed — this is **compile-time polymorphism** (also called static dispatch).

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **barista** ☕ taking orders. She can `serve()` a coffee, `serve()` a cappuccino, or `serve()` an espresso shot. Same action name (`serve`), but different behavior based on what you order (the argument).
		- | One Name | Multiple Signatures |
		  |---|---|
		  | `area()` | `area(radius)` → circle area |
		  | `area()` | `area(width, height)` → rectangle area |
		  | `area()` | `area(a, b, c)` → triangle area |
	-
	- ## Overloading vs Overriding
	  collapsed:: true
		- | Feature | Overloading | [[Method Overriding]] |
		  |---|---|---|
		  | Defined in | **Same class** | **Different class** (child overrides parent) |
		  | When resolved | **Compile time** (static) | **Runtime** (dynamic) |
		  | Return type | Can be different | Usually same |
		  | Polymorphism type | Compile-time / Static | Runtime / Dynamic |
	-
	- ## Python's Approach
	  collapsed:: true
		- Python does **not** support true method overloading (last definition wins). Alternatives:
		- ```python
		  # ❌ Python — last definition wins (no true overloading)
		  class Bad:
		      def greet(self): print("Hello!")
		      def greet(self, name): print(f"Hello, {name}!")  # replaces first!
		  
		  Bad().greet()  # TypeError: greet() missing 1 argument
		  
		  # ✅ Python alternatives:
		  # 1. Default arguments
		  # 2. *args / **kwargs
		  # 3. @singledispatch (functools)
		  # 4. Type checking inside the method
		  ```
- # Implementation
  collapsed:: true
	- > [!note] A `Calculator` class with overloaded `add()`, `multiply()`, and `convert()` methods across all 5 languages.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python — Multiple overloading patterns ───────────────────────────
	  from functools import singledispatch
	  from typing import Union
	  
	  class Calculator:
	      # ── Pattern 1: Default arguments (most common) ────
	      def add(self, a: float, b: float = 0, c: float = 0) -> float:
	          return a + b + c
	  
	      # ── Pattern 2: *args (variable number) ────────────
	      def multiply(self, *args: float) -> float:
	          result = 1
	          for n in args:
	              result *= n
	          return result
	  
	      # ── Pattern 3: Union types + isinstance ───────────
	      def convert(self, value: Union[int, float, str]) -> float:
	          if isinstance(value, str):
	              return float(value)
	          elif isinstance(value, int):
	              return float(value)
	          return value
	  
	  calc = Calculator()
	  print(calc.add(1))           # 1.0
	  print(calc.add(1, 2))        # 3.0
	  print(calc.add(1, 2, 3))     # 6.0
	  print(calc.multiply(2, 3, 4))# 24.0
	  print(calc.convert("3.14"))  # 3.14
	  
	  
	  # ── Pattern 4: @singledispatch (single dispatch on first arg) ──
	  @singledispatch
	  def process(value):
	      raise NotImplementedError(f"No handler for type {type(value)}")
	  
	  @process.register(int)
	  def _(value: int) -> str:
	      return f"Integer: {value}"
	  
	  @process.register(str)
	  def _(value: str) -> str:
	      return f"String of length {len(value)}: {value!r}"
	  
	  @process.register(list)
	  def _(value: list) -> str:
	      return f"List with {len(value)} items"
	  
	  print(process(42))               # Integer: 42
	  print(process("hello"))          # String of length 5: 'hello'
	  print(process([1, 2, 3]))        # List with 3 items
	  ```
	  
	  ```c++
	  // ─── C++ — True compile-time overloading ─────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  
	  class Calculator {
	  public:
	      // ── Overloaded add() ──────────────────────────────
	      int add(int a, int b) {
	          std::cout << "add(int, int)\n";
	          return a + b;
	      }
	      double add(double a, double b) {
	          std::cout << "add(double, double)\n";
	          return a + b;
	      }
	      int add(int a, int b, int c) {
	          std::cout << "add(int, int, int)\n";
	          return a + b + c;
	      }
	  
	      // ── Overloaded print() ────────────────────────────
	      void display(int val) { std::cout << "Int: " << val << "\n"; }
	      void display(double val) { std::cout << "Double: " << val << "\n"; }
	      void display(const std::string& val) { std::cout << "String: " << val << "\n"; }
	  
	      // ── Overloaded area() ─────────────────────────────
	      double area(double radius) {
	          return 3.14159 * radius * radius;          // circle
	      }
	      double area(double width, double height) {
	          return width * height;                     // rectangle
	      }
	      double area(double a, double b, double c) {   // triangle (Heron's)
	          double s = (a + b + c) / 2;
	          return std::sqrt(s * (s-a) * (s-b) * (s-c));
	      }
	  };
	  
	  int main() {
	      Calculator calc;
	      std::cout << calc.add(1, 2) << "\n";          // add(int, int) → 3
	      std::cout << calc.add(1.5, 2.5) << "\n";      // add(double, double) → 4.0
	      std::cout << calc.add(1, 2, 3) << "\n";       // add(int, int, int) → 6
	      calc.display(42);
	      calc.display(3.14);
	      calc.display("hello");
	      std::cout << calc.area(5) << "\n";            // 78.53 (circle)
	      std::cout << calc.area(4, 6) << "\n";         // 24 (rectangle)
	  }
	  ```
	  
	  ```java
	  // ─── Java — Compile-time overloading ─────────────────────────────────
	  public class Calculator {
	  
	      // ── Overloaded add() ──────────────────────────────
	      public int add(int a, int b) { return a + b; }
	      public double add(double a, double b) { return a + b; }
	      public int add(int a, int b, int c) { return a + b + c; }
	      public String add(String a, String b) { return a + b; }   // concatenation
	  
	      // ── Overloaded area() ─────────────────────────────
	      public double area(double radius) {
	          return Math.PI * radius * radius;
	      }
	      public double area(double width, double height) {
	          return width * height;
	      }
	      public double area(double a, double b, double c) {
	          double s = (a + b + c) / 2;
	          return Math.sqrt(s * (s-a) * (s-b) * (s-c));
	      }
	  
	      // ── Overloaded display() ──────────────────────────
	      public void display(int val)    { System.out.println("Int: " + val); }
	      public void display(double val) { System.out.println("Double: " + val); }
	      public void display(String val) { System.out.println("String: " + val); }
	  
	      public static void main(String[] args) {
	          Calculator calc = new Calculator();
	          System.out.println(calc.add(1, 2));       // 3
	          System.out.println(calc.add(1.5, 2.5));   // 4.0
	          System.out.println(calc.add(1, 2, 3));    // 6
	          System.out.println(calc.add("Hello, ", "World!"));  // Hello, World!
	          calc.display(42);
	          calc.display(3.14);
	          System.out.printf("Circle area: %.2f%n", calc.area(5));
	          System.out.printf("Rectangle area: %.2f%n", calc.area(4, 6));
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript — No native overloading; simulate with arguments ──────
	  class Calculator {
	      // Pattern: Check argument types/count manually
	      add(...args) {
	          if (args.length === 0) return 0;
	          if (args.every(a => typeof a === 'string'))
	              return args.join('');          // string concat
	          return args.reduce((sum, n) => sum + Number(n), 0);
	      }
	  
	      area(a, b, c) {
	          if (c !== undefined) {
	              // Triangle (Heron's formula)
	              const s = (a + b + c) / 2;
	              return Math.sqrt(s * (s-a) * (s-b) * (s-c));
	          }
	          if (b !== undefined) return a * b;   // Rectangle
	          return Math.PI * a * a;              // Circle
	      }
	  
	      display(val) {
	          const type = typeof val;
	          if (type === 'number') console.log(`Number: ${val}`);
	          else if (type === 'string') console.log(`String: ${val}`);
	          else console.log(`Unknown: ${val}`);
	      }
	  }
	  
	  const calc = new Calculator();
	  console.log(calc.add(1, 2));              // 3
	  console.log(calc.add(1, 2, 3));           // 6
	  console.log(calc.add("Hello, ", "World!"));// Hello, World!
	  console.log(calc.area(5).toFixed(2));     // 78.54 (circle)
	  console.log(calc.area(4, 6));             // 24 (rectangle)
	  calc.display(42);
	  calc.display("hello");
	  ```
	  
	  ```csharp
	  // ─── C# — Compile-time overloading ───────────────────────────────────
	  using System;
	  
	  public class Calculator {
	      // ── Overloaded Add() ──────────────────────────────
	      public int Add(int a, int b) => a + b;
	      public double Add(double a, double b) => a + b;
	      public int Add(int a, int b, int c) => a + b + c;
	      public string Add(string a, string b) => a + b;
	  
	      // ── Overloaded Area() ─────────────────────────────
	      public double Area(double radius) => Math.PI * radius * radius;
	      public double Area(double width, double height) => width * height;
	      public double Area(double a, double b, double c) {
	          double s = (a + b + c) / 2;
	          return Math.Sqrt(s * (s-a) * (s-b) * (s-c));
	      }
	  
	      // ── Overloaded Display() ──────────────────────────
	      public void Display(int val)    => Console.WriteLine($"Int: {val}");
	      public void Display(double val) => Console.WriteLine($"Double: {val}");
	      public void Display(string val) => Console.WriteLine($"String: {val}");
	  
	      static void Main() {
	          var calc = new Calculator();
	          Console.WriteLine(calc.Add(1, 2));          // 3
	          Console.WriteLine(calc.Add(1.5, 2.5));      // 4
	          Console.WriteLine(calc.Add(1, 2, 3));       // 6
	          Console.WriteLine(calc.Add("Hello, ", "World!"));
	          calc.Display(42);
	          calc.Display(3.14);
	          Console.WriteLine($"Circle: {calc.Area(5):F2}");
	          Console.WriteLine($"Rectangle: {calc.Area(4, 6):F2}");
	      }
	  }
	  ```
	  
	  :::
- # Key Takeaways
  collapsed:: true
	- **Same name, different parameters** — that's method overloading.
	- Resolved at **compile time** (static/early binding) — the opposite of [[Method Overriding]] (runtime).
	- **Python** has no native overloading — use default arguments, `*args`, or `@singledispatch`.
	- **Java/C++/C#** support true overloading — compiler picks the best match based on argument types.
	- Return type alone is **not enough** to distinguish overloaded methods — parameter list must differ.
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Python @singledispatch](https://docs.python.org/3/library/functools.html#functools.singledispatch)
		- [Java Method Overloading](https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html)
		- [C++ Function Overloading](https://en.cppreference.com/w/cpp/language/overload_resolution)