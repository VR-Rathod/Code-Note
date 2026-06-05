---
seoTitle: Abstract Classes in OOP – Complete In-Depth Guide | Abstract Methods, Template Method
description: "Deep dive into Abstract Classes in OOP. Covers what abstract classes are, abstract vs concrete methods, abstract class vs interface, the template method pattern, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "abstract class, OOP, abstract method, ABC, template method, Python abstract class, Java abstract class, C++ pure virtual, interface vs abstract class, VR-Rathod, Code-Note"
displayTitle: Abstract Classes
treeTitle: DSA - OOP - Abstract Classes
---

> [!info] What is an Abstract Class?
> An **Abstract Class** is a class that **cannot be instantiated directly** and is designed to serve as a base for other classes. It defines a **partial implementation** — some methods are concrete (with bodies), others are **abstract** (declared without bodies, forcing subclasses to implement them). It bridges the gap between [[Interface]] (pure contract) and a concrete class (full implementation).

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **game character template** 🎮. You can't play as "a character" — you play as a `Warrior`, `Mage`, or `Archer`. The base `Character` template defines common behavior: `move()`, `attack()`, `defend()` with default implementations. But each subclass must define `use_special_ability()` — their own unique skill.
		- The base `Character` is the **abstract class** — it exists to be extended, not instantiated.
	-
	- ## Abstract Class vs Interface
	  collapsed:: true
		- | Feature | Abstract Class | [[Interface]] |
		  |---|---|---|
		  | Instantiatable? | ❌ No | ❌ No |
		  | Concrete methods | ✅ Yes | Only via default methods (Java 8+) |
		  | Instance fields/state | ✅ Yes | ❌ No |
		  | Constructor | ✅ Yes (for subclasses) | ❌ No |
		  | Multiple inheritance | ❌ Usually single base | ✅ Multiple interfaces |
		  | Relationship | **Is-A** (identity) | **Can-do** (capability) |
		  | When to use | Related classes sharing **code** | Unrelated classes sharing **behavior** |
	-
	- ## Template Method Pattern
	  collapsed:: true
		- Abstract classes naturally enable the **Template Method Pattern** — the base class defines the **algorithm skeleton** in a concrete method, but defers specific steps to abstract methods in subclasses.
		- ```python
		  class DataMiner(ABC):
		      # ── Template method — algorithm skeleton ──
		      def mine(self, path: str) -> dict:    # concrete — NOT overridden
		          data = self.extract_data(path)    # abstract step 1
		          parsed = self.parse_data(data)    # abstract step 2
		          analysis = self.analyze(parsed)   # abstract step 3
		          return analysis
		  
		      # ── Abstract steps — subclass must define ──
		      @abstractmethod
		      def extract_data(self, path: str) -> str: ...
		  
		      @abstractmethod
		      def parse_data(self, raw: str) -> list: ...
		  
		      def analyze(self, data: list) -> dict:  # concrete default
		          return {"count": len(data)}
		  ```
- # Implementation
  collapsed:: true
	- > [!note] A `Shape` abstract class hierarchy + a `DataExporter` template method pattern.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python — Abstract classes via ABC ────────────────────────────────
	  from abc import ABC, abstractmethod
	  import math
	  from typing import final
	  
	  class Shape(ABC):
	      def __init__(self, color: str = "white", filled: bool = False):
	          self.color = color
	          self.filled = filled
	  
	      # ── Abstract methods — MUST be overridden ──────────
	      @abstractmethod
	      def area(self) -> float: ...
	  
	      @abstractmethod
	      def perimeter(self) -> float: ...
	  
	      # ── Concrete methods — shared by all shapes ────────
	      def describe(self) -> str:
	          return (f"{self.__class__.__name__}[{self.color}]: "
	                  f"area={self.area():.2f}, perimeter={self.perimeter():.2f}, "
	                  f"filled={'yes' if self.filled else 'no'}")
	  
	      def scale(self, factor: float) -> None:
	          raise NotImplementedError(f"{type(self).__name__} doesn't support scaling")
	  
	      def __repr__(self) -> str:
	          return f"{type(self).__name__}(color={self.color!r})"
	  
	  
	  class Circle(Shape):
	      def __init__(self, radius: float, color: str = "red", filled: bool = True):
	          super().__init__(color, filled)
	          if radius <= 0: raise ValueError("Radius must be positive")
	          self.radius = radius
	  
	      def area(self) -> float: return math.pi * self.radius ** 2
	      def perimeter(self) -> float: return 2 * math.pi * self.radius
	      def scale(self, factor: float) -> None:
	          self.radius *= factor
	  
	  
	  class Rectangle(Shape):
	      def __init__(self, width: float, height: float, color: str = "blue"):
	          super().__init__(color, False)
	          self.width = width
	          self.height = height
	  
	      def area(self) -> float: return self.width * self.height
	      def perimeter(self) -> float: return 2 * (self.width + self.height)
	      def scale(self, factor: float) -> None:
	          self.width *= factor
	          self.height *= factor
	  
	  
	  class Triangle(Shape):
	      def __init__(self, a: float, b: float, c: float, color: str = "green"):
	          super().__init__(color)
	          self.a, self.b, self.c = a, b, c
	  
	      def area(self) -> float:
	          s = (self.a + self.b + self.c) / 2
	          return math.sqrt(s * (s-self.a) * (s-self.b) * (s-self.c))
	  
	      def perimeter(self) -> float: return self.a + self.b + self.c
	  
	  
	  # ❌ Cannot instantiate abstract class
	  try:
	      s = Shape()
	  except TypeError as e:
	      print(f"Error: {e}")  # Can't instantiate abstract class Shape
	  
	  # ✅ Can instantiate concrete subclasses
	  shapes: list[Shape] = [Circle(5), Rectangle(4, 6), Triangle(3, 4, 5)]
	  for shape in shapes:
	      print(shape.describe())
	  
	  # Template method pattern for export
	  class DataExporter(ABC):
	      def export(self, data: list[dict], filepath: str) -> None:
	          """Template method — skeleton algorithm."""
	          validated = self._validate(data)
	          formatted = self._format(validated)
	          self._write(formatted, filepath)
	          print(f"Exported {len(data)} records to {filepath}")
	  
	      def _validate(self, data: list[dict]) -> list[dict]:
	          return [d for d in data if d]  # default: filter empty
	  
	      @abstractmethod
	      def _format(self, data: list[dict]) -> str: ...
	  
	      @abstractmethod
	      def _write(self, content: str, filepath: str) -> None: ...
	  
	  class JSONExporter(DataExporter):
	      def _format(self, data: list[dict]) -> str:
	          import json
	          return json.dumps(data, indent=2)
	      def _write(self, content: str, filepath: str) -> None:
	          print(f"  → Writing JSON: {filepath}")
	  
	  class CSVExporter(DataExporter):
	      def _format(self, data: list[dict]) -> str:
	          if not data: return ""
	          header = ",".join(data[0].keys())
	          rows = [",".join(str(v) for v in d.values()) for d in data]
	          return "\n".join([header] + rows)
	      def _write(self, content: str, filepath: str) -> None:
	          print(f"  → Writing CSV: {filepath}")
	  
	  records = [{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]
	  JSONExporter().export(records, "output.json")
	  CSVExporter().export(records, "output.csv")
	  ```
	  
	  ```c++
	  // ─── C++ — Abstract class via pure virtual methods ────────────────────
	  #include <iostream>
	  #include <cmath>
	  #include <string>
	  #include <vector>
	  
	  class Shape {
	  protected:
	      std::string color_;
	      bool filled_;
	  public:
	      Shape(std::string color = "white", bool filled = false)
	          : color_(color), filled_(filled) {}
	  
	      // Pure virtual — abstract methods
	      virtual double area() const = 0;
	      virtual double perimeter() const = 0;
	  
	      // Concrete — shared by all
	      virtual std::string describe() const {
	          return color_ + " shape: area=" + std::to_string(area()) +
	                 ", perim=" + std::to_string(perimeter());
	      }
	  
	      virtual ~Shape() {}
	  };
	  
	  class Circle : public Shape {
	      double radius_;
	  public:
	      Circle(double r, std::string color = "red") : Shape(color, true), radius_(r) {}
	      double area() const override { return M_PI * radius_ * radius_; }
	      double perimeter() const override { return 2 * M_PI * radius_; }
	  };
	  
	  class Rectangle : public Shape {
	      double w_, h_;
	  public:
	      Rectangle(double w, double h, std::string c = "blue") : Shape(c), w_(w), h_(h) {}
	      double area() const override { return w_ * h_; }
	      double perimeter() const override { return 2 * (w_ + h_); }
	  };
	  
	  int main() {
	      // Shape s; // ❌ error: cannot instantiate abstract class
	      std::vector<Shape*> shapes = { new Circle(5), new Rectangle(4, 6) };
	      for (auto* s : shapes) std::cout << s->describe() << "\n";
	      for (auto* s : shapes) delete s;
	  }
	  ```
	  
	  ```java
	  // ─── Java — abstract class with template method ───────────────────────
	  import java.util.*;
	  
	  abstract class Shape {
	      protected String color;
	      protected boolean filled;
	  
	      Shape(String color, boolean filled) { this.color = color; this.filled = filled; }
	  
	      // Abstract — must override
	      public abstract double area();
	      public abstract double perimeter();
	  
	      // Concrete — shared by all shapes
	      public String describe() {
	          return String.format("%s[%s]: area=%.2f, perim=%.2f, filled=%b",
	              getClass().getSimpleName(), color, area(), perimeter(), filled);
	      }
	  }
	  
	  class Circle extends Shape {
	      double radius;
	      Circle(double r, String color) { super(color, true); this.radius = r; }
	      public double area() { return Math.PI * radius * radius; }
	      public double perimeter() { return 2 * Math.PI * radius; }
	  }
	  
	  class Rectangle extends Shape {
	      double w, h;
	      Rectangle(double w, double h, String c) { super(c, false); this.w = w; this.h = h; }
	      public double area() { return w * h; }
	      public double perimeter() { return 2 * (w + h); }
	  }
	  
	  class AbstractClassDemo {
	      public static void main(String[] args) {
	          List<Shape> shapes = List.of(new Circle(5, "red"), new Rectangle(4, 6, "blue"));
	          shapes.forEach(s -> System.out.println(s.describe()));
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript — Abstract class simulation ───────────────────────────
	  class Shape {
	      constructor(color = "white", filled = false) {
	          if (new.target === Shape)
	              throw new Error("Cannot instantiate abstract class Shape!");
	          this.color = color;
	          this.filled = filled;
	      }
	      // "Abstract" methods — enforce in subclasses
	      area() { throw new Error("area() must be overridden"); }
	      perimeter() { throw new Error("perimeter() must be overridden"); }
	  
	      // Concrete
	      describe() {
	          return `${this.constructor.name}[${this.color}]: area=${this.area().toFixed(2)}, perim=${this.perimeter().toFixed(2)}`;
	      }
	  }
	  
	  class Circle extends Shape {
	      constructor(radius, color = "red") { super(color, true); this.radius = radius; }
	      area() { return Math.PI * this.radius ** 2; }
	      perimeter() { return 2 * Math.PI * this.radius; }
	  }
	  
	  class Rectangle extends Shape {
	      constructor(w, h, color = "blue") { super(color); this.w = w; this.h = h; }
	      area() { return this.w * this.h; }
	      perimeter() { return 2 * (this.w + this.h); }
	  }
	  
	  // try { new Shape(); } catch(e) { console.error(e.message); } // Error!
	  const shapes = [new Circle(5), new Rectangle(4, 6)];
	  shapes.forEach(s => console.log(s.describe()));
	  ```
	  
	  ```csharp
	  // ─── C# — abstract class ─────────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  
	  abstract class Shape {
	      public string Color { get; }
	      public bool Filled { get; }
	  
	      protected Shape(string color = "white", bool filled = false) {
	          Color = color; Filled = filled;
	      }
	  
	      public abstract double Area();
	      public abstract double Perimeter();
	  
	      public virtual string Describe() =>
	          $"{GetType().Name}[{Color}]: area={Area():F2}, perim={Perimeter():F2}, filled={Filled}";
	  }
	  
	  class Circle : Shape {
	      double radius;
	      public Circle(double r, string color = "red") : base(color, true) { radius = r; }
	      public override double Area() => Math.PI * radius * radius;
	      public override double Perimeter() => 2 * Math.PI * radius;
	  }
	  
	  class Rectangle : Shape {
	      double w, h;
	      public Rectangle(double w, double h, string c = "blue") : base(c) { this.w = w; this.h = h; }
	      public override double Area() => w * h;
	      public override double Perimeter() => 2 * (w + h);
	  }
	  
	  class Program {
	      static void Main() {
	          // new Shape(); // ❌ error: cannot instantiate abstract class
	          var shapes = new List<Shape> { new Circle(5), new Rectangle(4, 6) };
	          shapes.ForEach(s => Console.WriteLine(s.Describe()));
	      }
	  }
	  ```
	  
	  :::
- # Key Takeaways
  collapsed:: true
	- **Abstract class** = template for subclasses — defines what must be done, may show how common parts work.
	- **Cannot be instantiated** — attempting to do so throws a `TypeError` (Python), compile error (Java/C#/C++).
	- Mix of **abstract methods** (must override) and **concrete methods** (optional to override).
	- Prefer **abstract class** when: related classes share code + state. Prefer **interface** when: unrelated classes share capability.
	- Enables **Template Method Pattern** — define algorithm skeleton in base, defer variable steps to subclasses.
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Python abc module](https://docs.python.org/3/library/abc.html)
		- [Java Abstract Classes](https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html)
		- [Refactoring Guru — Template Method](https://refactoring.guru/design-patterns/template-method)