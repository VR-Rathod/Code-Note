---
seoTitle: Polymorphism in OOP – Complete In-Depth Guide | Compile-time vs Runtime, Duck Typing, Virtual Dispatch
description: "Deep dive into Polymorphism in OOP. Covers compile-time (method overloading, operator overloading) vs runtime (method overriding, virtual dispatch) polymorphism, duck typing, and practical examples in Python, C++, Java, JavaScript, and C#."
keywords: "polymorphism, OOP, runtime polymorphism, compile-time polymorphism, method overloading, method overriding, virtual functions, duck typing, dynamic dispatch, upcasting, Python polymorphism, Java polymorphism, C++ virtual, VR-Rathod, Code-Note"
displayTitle: Polymorphism
treeTitle: DSA - OOP - Polymorphism
---

> [!info] What is Polymorphism?
> **Polymorphism** (Greek: *poly* = many, *morph* = form) is the ability of **different objects to be treated as instances of the same type**, while each responds to the same message (method call) **in its own way**. It is one of the four core pillars of OOP alongside [[Encapsulation]], [[Abstraction]], and [[Inheritance]].

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **universal remote control** 📺🔊💡 — one remote, one `power()` button. But pressing it:
			- On a **TV** → turns the TV on/off
			- On a **Speaker** → turns audio on/off
			- On a **Smart Light** → toggles the light
		- Same button (same method call), different behavior depending on the object receiving it. That's polymorphism.
		- Another way: A **driver** can drive any vehicle. `drive(vehicle)` works whether `vehicle` is a car, truck, or motorcycle — each responds differently internally.
	-
	- ## The Two Types of Polymorphism
	  collapsed:: true
		- ```mermaid
		  flowchart TD
		      P["Polymorphism"]
		      P --> CT["Compile-Time\n(Static)"]
		      P --> RT["Runtime\n(Dynamic)"]
		      CT --> OL["Method Overloading\n(same name, diff params)"]
		      CT --> OP["Operator Overloading\n(__add__, __eq__)"]
		      RT --> OR["Method Overriding\n(subclass redefines parent method)"]
		      RT --> VD["Virtual Dispatch\n(base pointer → child method)"]
		  ```
		-
		- | Type | When Resolved | Mechanism | Example |
		  |---|---|---|---|
		  | **Compile-time** | At compile/parse time | Overloading, templates | `add(int)` vs `add(float)` |
		  | **Runtime** | At execution time | Virtual dispatch, overriding | `shape.area()` → Circle or Square area |
- # Compile-Time Polymorphism
  collapsed:: true
	- ## Method Overloading
	  collapsed:: true
		- Same method name, different parameter types or counts. Resolved at compile time.
		- > [!note] Python does **not** support true method overloading (last definition wins). Use default arguments or `*args` instead. Java and C++ support it natively.
		- ```python
		  # Python equivalent using default args / *args
		  class Calculator:
		      def add(self, a, b=0, c=0):
		          return a + b + c
		  
		  calc = Calculator()
		  print(calc.add(1, 2))     # 3
		  print(calc.add(1, 2, 3))  # 6
		  ```
	-
	- ## Operator Overloading
	  collapsed:: true
		- Define custom behavior for operators (`+`, `==`, `<`, etc.) on your objects.
		- ```python
		  class Vector:
		      def __init__(self, x, y):
		          self.x = x
		          self.y = y
		  
		      def __add__(self, other):   # v1 + v2
		          return Vector(self.x + other.x, self.y + other.y)
		  
		      def __eq__(self, other):    # v1 == v2
		          return self.x == other.x and self.y == other.y
		  
		      def __repr__(self):
		          return f"Vector({self.x}, {self.y})"
		  
		  v1 = Vector(1, 2)
		  v2 = Vector(3, 4)
		  print(v1 + v2)    # Vector(4, 6)
		  print(v1 == v2)   # False
		  ```
- # Runtime Polymorphism
  collapsed:: true
	- ## Method Overriding + Virtual Dispatch
	  collapsed:: true
		- Subclass redefines a parent method. When called via a base-type reference, the **actual object's** method runs.
		- ```
		  Base reference            Object in memory
		  ────────────────          ──────────────────
		  Animal* a = &dog;   →     Dog object
		  a->speak()          →     Dog::speak()  ← NOT Animal::speak()
		                            (virtual dispatch resolved at runtime)
		  ```
	-
	- ## Duck Typing (Python)
	  collapsed:: true
		- Python uses **duck typing**: *"If it walks like a duck and quacks like a duck, it's a duck."*
		- No inheritance needed — any object with the right method can be used polymorphically.
		- ```python
		  class Duck:
		      def sound(self): return "Quack!"
		  
		  class Dog:
		      def sound(self): return "Woof!"
		  
		  class Cat:
		      def sound(self): return "Meow!"
		  
		  def make_sound(animal):  # No type constraint — pure duck typing
		      print(animal.sound())
		  
		  for animal in [Duck(), Dog(), Cat()]:
		      make_sound(animal)
		  # Quack!  Woof!  Meow!
		  ```
- # Implementation
  collapsed:: true
	- > [!note] Runtime polymorphism via a `Shape` hierarchy — `Circle`, `Rectangle`, `Triangle` each implement `area()` and `describe()` differently.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  import math
	  from abc import ABC, abstractmethod
	  
	  class Shape(ABC):
	      def __init__(self, color: str = "white"):
	          self.color = color
	  
	      @abstractmethod
	      def area(self) -> float: ...
	  
	      @abstractmethod
	      def perimeter(self) -> float: ...
	  
	      def describe(self) -> str:
	          return (f"{self.__class__.__name__}({self.color}): "
	                  f"area={self.area():.2f}, perimeter={self.perimeter():.2f}")
	  
	  class Circle(Shape):
	      def __init__(self, radius: float, color: str = "red"):
	          super().__init__(color)
	          self.radius = radius
	  
	      def area(self) -> float:
	          return math.pi * self.radius ** 2
	  
	      def perimeter(self) -> float:
	          return 2 * math.pi * self.radius
	  
	  class Rectangle(Shape):
	      def __init__(self, w: float, h: float, color: str = "blue"):
	          super().__init__(color)
	          self.w, self.h = w, h
	  
	      def area(self) -> float:
	          return self.w * self.h
	  
	      def perimeter(self) -> float:
	          return 2 * (self.w + self.h)
	  
	  class Triangle(Shape):
	      def __init__(self, a: float, b: float, c: float, color: str = "green"):
	          super().__init__(color)
	          self.a, self.b, self.c = a, b, c
	  
	      def area(self) -> float:
	          s = (self.a + self.b + self.c) / 2
	          return math.sqrt(s * (s-self.a) * (s-self.b) * (s-self.c))
	  
	      def perimeter(self) -> float:
	          return self.a + self.b + self.c
	  
	  # Polymorphism: same interface, different behavior
	  shapes: list[Shape] = [Circle(5), Rectangle(4, 6), Triangle(3, 4, 5)]
	  
	  for shape in shapes:
	      print(shape.describe())
	  # Circle(red):     area=78.54, perimeter=31.42
	  # Rectangle(blue): area=24.00, perimeter=20.00
	  # Triangle(green): area=6.00,  perimeter=12.00
	  
	  # Total area — works for any Shape without knowing type
	  total = sum(s.area() for s in shapes)
	  print(f"Total area: {total:.2f}")  # Total area: 108.54
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <vector>
	  #include <memory>
	  #include <cmath>
	  
	  class Shape {
	  public:
	      virtual double area() const = 0;
	      virtual double perimeter() const = 0;
	      virtual std::string name() const = 0;
	      virtual ~Shape() {}
	  
	      void describe() const {
	          std::cout << name() << ": area=" << area()
	                    << ", perimeter=" << perimeter() << "\n";
	      }
	  };
	  
	  class Circle : public Shape {
	      double radius_;
	  public:
	      Circle(double r) : radius_(r) {}
	      double area() const override { return M_PI * radius_ * radius_; }
	      double perimeter() const override { return 2 * M_PI * radius_; }
	      std::string name() const override { return "Circle"; }
	  };
	  
	  class Rectangle : public Shape {
	      double w_, h_;
	  public:
	      Rectangle(double w, double h) : w_(w), h_(h) {}
	      double area() const override { return w_ * h_; }
	      double perimeter() const override { return 2 * (w_ + h_); }
	      std::string name() const override { return "Rectangle"; }
	  };
	  
	  int main() {
	      std::vector<std::unique_ptr<Shape>> shapes;
	      shapes.push_back(std::make_unique<Circle>(5));
	      shapes.push_back(std::make_unique<Rectangle>(4, 6));
	  
	      double total = 0;
	      for (const auto& s : shapes) {
	          s->describe();          // virtual dispatch
	          total += s->area();
	      }
	      std::cout << "Total area: " << total << "\n";
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  abstract class Shape {
	      public abstract double area();
	      public abstract double perimeter();
	      public abstract String shapeName();
	  
	      public void describe() {
	          System.out.printf("%s: area=%.2f, perimeter=%.2f%n",
	              shapeName(), area(), perimeter());
	      }
	  }
	  
	  class Circle extends Shape {
	      private double radius;
	      Circle(double r) { this.radius = r; }
	      public double area() { return Math.PI * radius * radius; }
	      public double perimeter() { return 2 * Math.PI * radius; }
	      public String shapeName() { return "Circle"; }
	  }
	  
	  class Rectangle extends Shape {
	      private double w, h;
	      Rectangle(double w, double h) { this.w = w; this.h = h; }
	      public double area() { return w * h; }
	      public double perimeter() { return 2 * (w + h); }
	      public String shapeName() { return "Rectangle"; }
	  }
	  
	  public class PolymorphismDemo {
	      public static void main(String[] args) {
	          List<Shape> shapes = List.of(new Circle(5), new Rectangle(4, 6));
	          double total = 0;
	          for (Shape s : shapes) {
	              s.describe();
	              total += s.area();
	          }
	          System.out.printf("Total area: %.2f%n", total);
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  class Shape {
	      area() { throw new Error("area() must be implemented"); }
	      perimeter() { throw new Error("perimeter() must be implemented"); }
	      get shapeName() { return this.constructor.name; }
	  
	      describe() {
	          console.log(`${this.shapeName}: area=${this.area().toFixed(2)}, perimeter=${this.perimeter().toFixed(2)}`);
	      }
	  }
	  
	  class Circle extends Shape {
	      constructor(r) { super(); this.r = r; }
	      area() { return Math.PI * this.r ** 2; }
	      perimeter() { return 2 * Math.PI * this.r; }
	  }
	  
	  class Rectangle extends Shape {
	      constructor(w, h) { super(); this.w = w; this.h = h; }
	      area() { return this.w * this.h; }
	      perimeter() { return 2 * (this.w + this.h); }
	  }
	  
	  const shapes = [new Circle(5), new Rectangle(4, 6)];
	  let total = 0;
	  for (const s of shapes) {
	      s.describe();
	      total += s.area();
	  }
	  console.log(`Total area: ${total.toFixed(2)}`);
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  
	  abstract class Shape {
	      public abstract double Area();
	      public abstract double Perimeter();
	      public abstract string ShapeName { get; }
	  
	      public void Describe() =>
	          Console.WriteLine($"{ShapeName}: area={Area():F2}, perimeter={Perimeter():F2}");
	  }
	  
	  class Circle : Shape {
	      double r;
	      public Circle(double r) { this.r = r; }
	      public override double Area() => Math.PI * r * r;
	      public override double Perimeter() => 2 * Math.PI * r;
	      public override string ShapeName => "Circle";
	  }
	  
	  class Rectangle : Shape {
	      double w, h;
	      public Rectangle(double w, double h) { this.w = w; this.h = h; }
	      public override double Area() => w * h;
	      public override double Perimeter() => 2 * (w + h);
	      public override string ShapeName => "Rectangle";
	  }
	  
	  class Program {
	      static void Main() {
	          var shapes = new List<Shape> { new Circle(5), new Rectangle(4, 6) };
	          double total = 0;
	          foreach (var s in shapes) {
	              s.Describe();
	              total += s.Area();
	          }
	          Console.WriteLine($"Total area: {total:F2}");
	      }
	  }
	  ```
	  
	  :::
- # When to Use Polymorphism
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Do multiple types share\na common behavior/interface?"}
	      Q -- Yes --> Q2{"Should caller care about\nthe specific type?"}
	      Q2 -- No --> R1["✅ Use Polymorphism\nBase type reference + override"]
	      Q2 -- Yes --> R2["⚠️ Use type-specific calls\n(switch/if-else on type)"]
	      Q -- No --> R3["❌ Simple function is enough\nNo polymorphism needed"]
	  ```
	-
	- ## ✅ Use Polymorphism When
		- You have multiple types that **share a common behavior** (all shapes have `area()`).
		- You want to write code that **works on a base type** without knowing the concrete type.
		- Building **plugin systems**, **renderers**, **payment processors**, **event handlers**.
	-
	- ## ❌ Avoid When
		- Only one type exists — no need for the abstraction.
		- The behavior differs **so radically** between types that a shared interface would be meaningless.
- # Key Takeaways
  collapsed:: true
	- **One interface, many behaviors** — the defining motto of polymorphism.
	- **Compile-time** = overloading + operator overloading (resolved at parse/compile time).
	- **Runtime** = overriding + virtual dispatch (resolved at execution time via vtable / method table).
	- **Duck typing** (Python/JS) — polymorphism without inheritance — any object with the right method qualifies.
	- Enables **Open/Closed Principle** — add new types without changing existing code.
	- Always use an **abstract base class or interface** to define the shared contract.
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Real Python — OOP Polymorphism](https://realpython.com/python3-object-oriented-programming/#polymorphism)
		- [GeeksforGeeks — Polymorphism in Python](https://www.geeksforgeeks.org/polymorphism-in-python/)
		- [Oracle Java — Polymorphism](https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html)
		- [cppreference — Virtual Functions](https://en.cppreference.com/w/cpp/language/virtual)