---
seoTitle: Abstract Classes in OOP – C++ Guide with Examples
description: "Abstract classes define interfaces with partial implementation. Covers pure virtual functions, abstract base classes, inheritance, and C++ examples."
keywords: "abstract classes, OOP, pure virtual, C++, abstract base class, inheritance, polymorphism, interface, virtual functions"
---

- # Introduction
	- An **Abstract Class** is a class that **cannot be instantiated directly**.
	- It defines a **contract** — a set of methods that all derived classes must implement.
	- In C++, a class becomes abstract when it has at least one **pure virtual function** (`= 0`).
	- Used to enforce a common interface across a family of related classes.
	-
	- ## Class Hierarchy Diagram
	  collapsed:: true
		- ```mermaid
		  classDiagram
		    class Shape {
		        <<abstract>>
		        +area() double
		        +draw() void
		    }
		
		    class Circle {
		        -radius: double
		        +area() double
		        +draw() void
		    }
		
		    class Rectangle {
		        -width: double
		        -height: double
		        +area() double
		        +draw() void
		    }
		
		    Shape <|-- Circle
		    Shape <|-- Rectangle
		  ```
	-
	- ## Advantages
		- Enforces a consistent interface across subclasses.
		- Enables **polymorphism** — treat different types uniformly via base pointer.
		- Separates interface from implementation.
	-
	- ## Disadvantages
		- Cannot instantiate the abstract class directly.
		- All pure virtual methods must be overridden in concrete subclasses.
		- Adds a layer of indirection (vtable lookup) — minor runtime cost.
-
- # Core Concepts
  collapsed:: true
	- ## Pure Virtual Function
	  collapsed:: true
		- Declared with `= 0` — no body in the base class.
		- Forces every concrete subclass to provide an implementation.
		- ```c++
		  class Shape {
		  public:
		      virtual double area() = 0;   // pure virtual
		      virtual void draw() = 0;     // pure virtual
		      virtual ~Shape() {}          // always virtual destructor
		  };
		  
		  // Shape s; // ERROR — cannot instantiate abstract class
		  ```
	-
	- ## Concrete Subclass
	  collapsed:: true
		- A class that inherits from an abstract class and implements **all** pure virtual methods.
		- ```c++
		  class Circle : public Shape {
		      double radius;
		  public:
		      Circle(double r) : radius(r) {}
		  
		      double area() override {
		          return 3.14159 * radius * radius;
		      }
		  
		      void draw() override {
		          std::cout << "Drawing Circle\n";
		      }
		  };
		  ```
	-
	- ## Abstract Class with Partial Implementation
	  collapsed:: true
		- Abstract classes can also have **non-pure virtual** methods (with a default body).
		- Subclasses may override them or use the default.
		- ```c++
		  class Animal {
		  public:
		      virtual void sound() = 0;          // must override
		  
		      virtual void breathe() {            // optional override
		          std::cout << "Breathing...\n";
		      }
		  
		      virtual ~Animal() {}
		  };
		  
		  class Dog : public Animal {
		  public:
		      void sound() override {
		          std::cout << "Woof!\n";
		      }
		      // breathe() inherited from Animal — no need to override
		  };
		  ```
-
- # C++ Examples
  collapsed:: true
	- ## Basic Abstract Class
	  collapsed:: true
		- ```c++
		  #include <iostream>
		  
		  class Shape {
		  public:
		      virtual double area() = 0;
		      virtual double perimeter() = 0;
		      virtual ~Shape() {}
		  };
		  
		  class Rectangle : public Shape {
		      double w, h;
		  public:
		      Rectangle(double w, double h) : w(w), h(h) {}
		      double area() override { return w * h; }
		      double perimeter() override { return 2 * (w + h); }
		  };
		  
		  class Circle : public Shape {
		      double r;
		  public:
		      Circle(double r) : r(r) {}
		      double area() override { return 3.14159 * r * r; }
		      double perimeter() override { return 2 * 3.14159 * r; }
		  };
		  
		  int main() {
		      Shape* s1 = new Rectangle(4, 5);
		      Shape* s2 = new Circle(3);
		  
		      std::cout << s1->area();      // 20
		      std::cout << s2->area();      // 28.274...
		  
		      delete s1;
		      delete s2;
		  }
		  ```
	-
	- ## Polymorphism via Abstract Base
	  collapsed:: true
		- ```c++
		  #include <vector>
		  #include <memory>
		  
		  std::vector<std::unique_ptr<Shape>> shapes;
		  shapes.push_back(std::make_unique<Rectangle>(3, 4));
		  shapes.push_back(std::make_unique<Circle>(5));
		  shapes.push_back(std::make_unique<Rectangle>(2, 7));
		  
		  for (const auto& s : shapes) {
		      std::cout << "Area: " << s->area() << "\n";
		  }
		  // Area: 12
		  // Area: 78.539...
		  // Area: 14
		  ```
	-
	- ## Abstract Class as Interface (all pure virtual)
	  collapsed:: true
		- ```c++
		  // Pure interface — no data, no implementation
		  class ISerializable {
		  public:
		      virtual std::string serialize() = 0;
		      virtual void deserialize(const std::string& data) = 0;
		      virtual ~ISerializable() {}
		  };
		  
		  class Config : public ISerializable {
		      std::string content;
		  public:
		      std::string serialize() override { return content; }
		      void deserialize(const std::string& data) override { content = data; }
		  };
		  ```
-
- # Abstract Class vs Interface (C++)
  collapsed:: true
	- C++ has no `interface` keyword — interfaces are simulated with **all-pure-virtual abstract classes**.
	- ```
	  Feature                  Abstract Class         Interface (simulated)
	  Pure virtual methods     Some or all            All
	  Non-virtual methods      Allowed                Not typical
	  Data members             Allowed                Not typical
	  Multiple inheritance     Possible (careful)     Common pattern
	  ```
-
- # When to Use Abstract Classes
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Do you have a family of\nrelated classes?"}
	      Q -- No --> S1{"Stand-alone functionality?"}
	      S1 -- Yes --> R1["✅ Use standard Concrete Class"]
	      Q -- Yes --> S2{"Do they share a\ncommon interface?"}
	      S2 -- Yes --> S3{"Do they share some\ncommon implementation?"}
	      S3 -- Yes --> R2["✅ Use Abstract Class\nwith partial implementation"]
	      S3 -- No --> R3["✅ Use Interface\n(All pure virtual abstract class)"]
	  ```
	-
	- ## ✅ Use Abstract Classes When:
		- You want to share code among several closely related classes.
		- You expect classes that extend your abstract class to have many common methods or fields, or require access modifiers other than public (such as protected and private).
		- You want to declare non-static or non-final fields to define the state of an object.
	-
	- ## ❌ Avoid When:
		- You just want to define a contract for unrelated classes (use an interface).
		- You are simply storing data without behavior (use a `struct` or plain class).
-
- # Rules & Best Practices
  collapsed:: true
	- Always declare a **virtual destructor** in abstract base classes.
	- Use `override` keyword in derived classes — catches typos at compile time.
	- Prefer **smart pointers** (`unique_ptr`, `shared_ptr`) when storing polymorphic objects.
	- Keep abstract classes focused — don't mix unrelated responsibilities.
	- ```c++
	  // Good practice
	  class Base {
	  public:
	      virtual void doWork() = 0;
	      virtual ~Base() = default;  // virtual destructor
	  };
	  
	  class Derived : public Base {
	  public:
	      void doWork() override { /* ... */ }
	  };
	  ```
-
- # Key Takeaways
	- Abstract class = class with at least one `= 0` pure virtual function.
	- Cannot be instantiated — only used as a base type.
	- Enables **runtime polymorphism** via base class pointers/references.
	- Always add a **virtual destructor** to avoid undefined behavior on delete.
-
- # More Learn
	- ## GitHub & Webs
		- [GeeksforGeeks - Pure Virtual Functions and Abstract Classes in C++](https://www.geeksforgeeks.org/pure-virtual-functions-and-abstract-classes/)
		- [cppreference - Abstract class](https://en.cppreference.com/w/cpp/language/abstract_class)