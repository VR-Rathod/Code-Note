---
seoTitle: Method Overriding in OOP – Complete In-Depth Guide | Runtime Polymorphism, super(), virtual
description: "Deep dive into Method Overriding in OOP. Covers runtime polymorphism, how child classes redefine parent methods, the super() keyword, @override annotation, virtual dispatch, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "method overriding, OOP, runtime polymorphism, virtual function, override, super, @Override, Python override, Java override, C++ virtual override, VR-Rathod, Code-Note"
displayTitle: Method Overriding
---

> [!info] What is Method Overriding?
> **Method Overriding** occurs when a **subclass redefines a method that already exists in its parent class**, providing a specialized or completely different implementation. The overriding method has the **same name, same parameters, and same return type**. It is the core mechanism of **runtime polymorphism** — which method runs is determined at **execution time** based on the actual object type.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- A **company** 🏢 has a standard `generate_report()` procedure. The `SalesTeam` overrides it to generate a revenue report, and the `HRTeam` overrides it to generate a headcount report. Same method name, called the same way — but each department's version does something different.
		- Same call: `team.generate_report()` → different output depending on the actual team type.
	-
	- ## Overriding vs Overloading
	  collapsed:: true
		- | Feature | Overriding | [[Method Overloading]] |
		  |---|---|---|
		  | Location | Different classes (parent/child) | Same class |
		  | Parameters | **Must match** parent | **Must differ** |
		  | Return type | Usually same | Can differ |
		  | When resolved | **Runtime** (dynamic dispatch) | **Compile time** (static) |
		  | Polymorphism | Runtime / Dynamic | Compile-time / Static |
	-
	- ## The `super()` Role in Overriding
	  collapsed:: true
		- When overriding, you often want to **extend** the parent's behavior rather than completely replace it. Use `super()` to call the parent's version first:
		- ```python
		  class Animal:
		      def speak(self):
		          return "..."
		  
		  class Dog(Animal):
		      def speak(self):           # Override
		          parent_sound = super().speak()    # extend parent
		          return f"Woof! (also: {parent_sound})"
		  ```
	-
	- ## Rules for Valid Overriding
	  collapsed:: true
		- | Rule | Detail |
		  |---|---|
		  | **Same name** | Method name must be identical |
		  | **Same parameters** | Signature must match (Java/C# strict; Python flexible) |
		  | **Same or wider return type** | Can return a subtype (covariant return — Java/C++) |
		  | **Same or broader access** | Can't narrow access (public → private is invalid) |
		  | **Not final/static** | Final methods can't be overridden; static methods are hidden, not overridden |

- # Implementation
  collapsed:: true
	- > [!note] A `Shape → Circle / Rectangle / Triangle` hierarchy demonstrating full override of `area()`, `perimeter()`, and `describe()`.
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
	  
	      # Non-abstract method — can be overridden or inherited
	      def describe(self) -> str:
	          return (f"{self.__class__.__name__}[{self.color}]: "
	                  f"area={self.area():.2f}, perimeter={self.perimeter():.2f}")
	  
	  
	  class Circle(Shape):
	      def __init__(self, radius: float, color: str = "red"):
	          super().__init__(color)   # call parent __init__
	          self.radius = radius
	  
	      def area(self) -> float:           # OVERRIDE abstract
	          return math.pi * self.radius ** 2
	  
	      def perimeter(self) -> float:      # OVERRIDE abstract
	          return 2 * math.pi * self.radius
	  
	      def describe(self) -> str:         # OVERRIDE non-abstract (extend)
	          base = super().describe()      # call parent's describe()
	          return f"{base} | radius={self.radius}"
	  
	  
	  class Square(Shape):
	      def __init__(self, side: float, color: str = "blue"):
	          super().__init__(color)
	          self.side = side
	  
	      def area(self) -> float:
	          return self.side ** 2
	  
	      def perimeter(self) -> float:
	          return 4 * self.side
	  
	      # describe() is NOT overridden — inherits parent version
	  
	  
	  # Polymorphism: same call, different behavior
	  shapes: list[Shape] = [Circle(5), Square(4), Circle(3, "green")]
	  
	  for shape in shapes:
	      print(shape.describe())
	  # Circle[red]: area=78.54, perimeter=31.42 | radius=5
	  # Square[blue]: area=16.00, perimeter=16.00
	  # Circle[green]: area=28.27, perimeter=18.85 | radius=3
	  
	  # Works via base type reference — runtime dispatch
	  def print_shape(s: Shape) -> None:
	      print(f"Type: {type(s).__name__}, Area: {s.area():.2f}")
	  
	  for shape in shapes:
	      print_shape(shape)
	  ```
	  
	  ```c++
	  // ─── C++ — virtual + override ─────────────────────────────────────────
	  #include <iostream>
	  #include <cmath>
	  #include <vector>
	  #include <memory>
	  
	  class Shape {
	  protected:
	      std::string color_;
	  public:
	      Shape(std::string color = "white") : color_(color) {}
	      virtual double area() const = 0;          // pure virtual — MUST override
	      virtual double perimeter() const = 0;
	      virtual std::string describe() const {    // virtual — CAN override
	          return color_ + " shape: area=" + std::to_string(area());
	      }
	      virtual ~Shape() {}
	  };
	  
	  class Circle : public Shape {
	      double radius_;
	  public:
	      Circle(double r, std::string color = "red")
	          : Shape(color), radius_(r) {}
	  
	      double area() const override {
	          return M_PI * radius_ * radius_;
	      }
	      double perimeter() const override {
	          return 2 * M_PI * radius_;
	      }
	      std::string describe() const override {
	          return Shape::describe() + " | Circle r=" + std::to_string(radius_);
	      }
	  };
	  
	  class Square : public Shape {
	      double side_;
	  public:
	      Square(double s, std::string color = "blue") : Shape(color), side_(s) {}
	      double area() const override { return side_ * side_; }
	      double perimeter() const override { return 4 * side_; }
	      // describe() not overridden — uses Shape::describe()
	  };
	  
	  int main() {
	      std::vector<std::unique_ptr<Shape>> shapes;
	      shapes.push_back(std::make_unique<Circle>(5));
	      shapes.push_back(std::make_unique<Square>(4));
	  
	      for (const auto& s : shapes) {
	          std::cout << s->describe() << "\n";  // virtual dispatch
	          std::cout << "Area: " << s->area() << "\n";
	      }
	  }
	  ```
	  
	  ```java
	  // ─── Java — @Override annotation ─────────────────────────────────────
	  import java.util.*;
	  
	  abstract class Shape {
	      protected String color;
	      Shape(String color) { this.color = color; }
	  
	      public abstract double area();
	      public abstract double perimeter();
	  
	      // Non-abstract — can be overridden
	      public String describe() {
	          return String.format("%s[%s]: area=%.2f, perim=%.2f",
	              getClass().getSimpleName(), color, area(), perimeter());
	      }
	  }
	  
	  class Circle extends Shape {
	      double radius;
	      Circle(double r, String color) { super(color); this.radius = r; }
	  
	      @Override public double area() { return Math.PI * radius * radius; }
	      @Override public double perimeter() { return 2 * Math.PI * radius; }
	  
	      @Override public String describe() {   // extends parent
	          return super.describe() + " | radius=" + radius;
	      }
	  }
	  
	  class Square extends Shape {
	      double side;
	      Square(double s, String color) { super(color); this.side = s; }
	  
	      @Override public double area() { return side * side; }
	      @Override public double perimeter() { return 4 * side; }
	      // describe() inherited from Shape — not overridden
	  }
	  
	  class OverrideDemo {
	      static void printShape(Shape s) {
	          System.out.println(s.describe());
	      }
	      public static void main(String[] args) {
	          List<Shape> shapes = List.of(
	              new Circle(5, "red"),
	              new Square(4, "blue")
	          );
	          shapes.forEach(OverrideDemo::printShape);
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  class Shape {
	      constructor(color = "white") { this.color = color; }
	      area() { throw new Error("area() must be overridden"); }
	      perimeter() { throw new Error("perimeter() must be overridden"); }
	      describe() {
	          return `${this.constructor.name}[${this.color}]: area=${this.area().toFixed(2)}`;
	      }
	  }
	  
	  class Circle extends Shape {
	      constructor(radius, color = "red") { super(color); this.radius = radius; }
	      area() { return Math.PI * this.radius ** 2; }           // Override
	      perimeter() { return 2 * Math.PI * this.radius; }       // Override
	      describe() {                                            // Override + extend
	          return `${super.describe()} | radius=${this.radius}`;
	      }
	  }
	  
	  class Square extends Shape {
	      constructor(side, color = "blue") { super(color); this.side = side; }
	      area() { return this.side ** 2; }
	      perimeter() { return 4 * this.side; }
	      // describe() inherited — not overridden
	  }
	  
	  const shapes = [new Circle(5), new Square(4)];
	  shapes.forEach(s => console.log(s.describe()));
	  ```
	  
	  ```csharp
	  // ─── C# — virtual + override ─────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  
	  abstract class Shape {
	      protected string Color;
	      protected Shape(string color = "white") { Color = color; }
	  
	      public abstract double Area();
	      public abstract double Perimeter();
	  
	      public virtual string Describe() =>
	          $"{GetType().Name}[{Color}]: area={Area():F2}, perim={Perimeter():F2}";
	  }
	  
	  class Circle : Shape {
	      double radius;
	      public Circle(double r, string color = "red") : base(color) { radius = r; }
	      public override double Area() => Math.PI * radius * radius;
	      public override double Perimeter() => 2 * Math.PI * radius;
	      public override string Describe() =>            // extend base
	          $"{base.Describe()} | radius={radius}";
	  }
	  
	  class Square : Shape {
	      double side;
	      public Square(double s, string color = "blue") : base(color) { side = s; }
	      public override double Area() => side * side;
	      public override double Perimeter() => 4 * side;
	      // Describe() not overridden — uses Shape.Describe()
	  }
	  
	  class Program {
	      static void Main() {
	          var shapes = new List<Shape> { new Circle(5), new Square(4) };
	          foreach (var s in shapes) Console.WriteLine(s.Describe());
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- **Same signature, different class** — that's method overriding.
	- Resolved at **runtime** — the actual object's class determines which version runs.
	- Use `super()` / `super.method()` / `base.Method()` to **extend** (not replace) parent behavior.
	- `@Override` (Java) / `override` (C#/C++) keywords catch typos at compile time — always use them.
	- `final` (Java) / `sealed` (C#) / no `virtual` (C++) methods **cannot** be overridden.

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Java @Override](https://docs.oracle.com/javase/tutorial/java/IandI/override.html)
		- [Python super()](https://docs.python.org/3/library/functions.html#super)
		- [cppreference — override specifier](https://en.cppreference.com/w/cpp/language/override)