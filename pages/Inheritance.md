---
seoTitle: Inheritance in OOP – Complete In-Depth Guide | Types, Method Resolution, Super()
description: "Deep dive into Inheritance in OOP. Covers single, multi-level, multiple, hierarchical, and hybrid inheritance, method resolution order (MRO), the super() keyword, and IS-A relationships with examples in Python, C++, Java, JavaScript, and C#."
keywords: "inheritance, OOP, single inheritance, multiple inheritance, multilevel inheritance, hierarchical inheritance, method resolution order, MRO, super keyword, is-a relationship, Python inheritance, Java inheritance, C++ inheritance, VR-Rathod, Code-Note"
displayTitle: Inheritance
---

> [!info] What is Inheritance?
> **Inheritance** is the OOP mechanism by which a **child class (subclass/derived class)** acquires the properties and behaviors of a **parent class (superclass/base class)**. It models an **"is-a"** relationship and enables **code reuse**, **specialization**, and the foundation of [[Polymorphism]].

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **family tree** 🌳. A child inherits traits from their parents — eye color, hair color, some behaviors. But the child is also their own person and can have unique traits the parent doesn't have, or can behave differently in some situations.
		- In OOP: A `Dog` class inherits from `Animal`. It gets `eat()`, `breathe()`, `sleep()` from `Animal` for free, and adds its own `fetch()` and `bark()` behaviors.
		- | Real World | OOP Equivalent |
		  |---|---|
		  | Parent / Parent class | **Base class / Superclass** |
		  | Child / Offspring | **Derived class / Subclass** |
		  | Inherited traits | **Inherited attributes & methods** |
		  | Child's unique traits | **Overridden or new methods** |
		  | "A dog IS an animal" | **IS-A relationship** |
	-
	- ## The IS-A Relationship Rule
	  collapsed:: true
		- Always ask: **"Is a [child] a [parent]?"** — if yes, inheritance is appropriate.
		- ```
		  ✅ Valid IS-A:          ❌ Invalid IS-A (use Composition):
		  Dog IS-A Animal         Car HAS-A Engine   (not: Engine IS-A Car)
		  Student IS-A Person     Dog HAS-A Tail     (not: Tail IS-A Dog)
		  Manager IS-A Employee   User HAS-A Address (not: Address IS-A User)
		  ```

- # Types of Inheritance
  collapsed:: true
	- ## 1. Single Inheritance
	  collapsed:: true
		- One child inherits from exactly one parent.
		- ```mermaid
		  classDiagram
		      Animal <|-- Dog
		      class Animal { +eat() +sleep() }
		      class Dog { +bark() +fetch() }
		  ```
	- ## 2. Multi-Level Inheritance
	  collapsed:: true
		- A chain: grandchild inherits from child, which inherits from parent.
		- ```mermaid
		  classDiagram
		      Animal <|-- Mammal
		      Mammal <|-- Dog
		      class Animal { +breathe() }
		      class Mammal { +nurse() }
		      class Dog { +bark() }
		  ```
	- ## 3. Multiple Inheritance
	  collapsed:: true
		- A child inherits from **more than one** parent class.
		- Python and C++ support this. Java does not (uses interfaces instead).
		- ```mermaid
		  classDiagram
		      Flyable <|-- FlyingFish
		      Swimmable <|-- FlyingFish
		      class Flyable { +fly() }
		      class Swimmable { +swim() }
		      class FlyingFish { +hunt() }
		  ```
	- ## 4. Hierarchical Inheritance
	  collapsed:: true
		- Multiple children inherit from the same single parent.
		- ```mermaid
		  classDiagram
		      Shape <|-- Circle
		      Shape <|-- Rectangle
		      Shape <|-- Triangle
		      class Shape { +area() +perimeter() }
		  ```
	- ## 5. Hybrid Inheritance
	  collapsed:: true
		- A combination of multiple inheritance types. Can create the **Diamond Problem** (ambiguity in method resolution).
		- Python resolves this with **MRO (Method Resolution Order)** using C3 linearization.

- # Method Resolution Order (MRO)
  collapsed:: true
	- When multiple parents define the same method, which one gets called? MRO answers this.
	- Python uses **C3 Linearization** — reads left-to-right, depth-first.
	- ```python
	  class A:
	      def greet(self): print("Hello from A")
	  
	  class B(A):
	      def greet(self): print("Hello from B")
	  
	  class C(A):
	      def greet(self): print("Hello from C")
	  
	  class D(B, C):  # Multiple inheritance
	      pass
	  
	  d = D()
	  d.greet()          # Hello from B  (MRO: D → B → C → A)
	  print(D.__mro__)   # (<class 'D'>, <class 'B'>, <class 'C'>, <class 'A'>, <class 'object'>)
	  ```

- # The `super()` Keyword
  collapsed:: true
	- `super()` calls a method from the **parent class**, allowing you to extend (not replace) inherited behavior.
	- ```python
	  class Animal:
	      def __init__(self, name: str):
	          self.name = name
	          print(f"Animal created: {name}")
	  
	      def speak(self) -> str:
	          return f"{self.name} makes a sound"
	  
	  class Dog(Animal):
	      def __init__(self, name: str, breed: str):
	          super().__init__(name)   # ← Call parent __init__ first
	          self.breed = breed
	          print(f"Dog created: breed={breed}")
	  
	      def speak(self) -> str:
	          base = super().speak()   # ← Extend parent's speak
	          return f"{base} — Woof!"
	  
	  dog = Dog("Buddy", "Labrador")
	  # Animal created: Buddy
	  # Dog created: breed=Labrador
	  print(dog.speak())  # Buddy makes a sound — Woof!
	  ```

- # Implementation
  collapsed:: true
	- > [!note] Full multi-level inheritance example: `Animal → Mammal → Dog` demonstrating inheritance, super(), method overriding, and polymorphism.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  class Animal:
	      def __init__(self, name: str, sound: str):
	          self.name = name
	          self._sound = sound   # protected
	          self.__alive = True   # private
	  
	      def speak(self) -> str:
	          return f"{self.name} says {self._sound}"
	  
	      def eat(self, food: str) -> str:
	          return f"{self.name} is eating {food}"
	  
	      def is_alive(self) -> bool:
	          return self.__alive
	  
	      def __str__(self) -> str:
	          return f"Animal({self.name})"
	  
	  
	  class Mammal(Animal):
	      def __init__(self, name: str, sound: str, fur_color: str):
	          super().__init__(name, sound)
	          self.fur_color = fur_color
	  
	      def nurse(self) -> str:
	          return f"{self.name} is nursing young"
	  
	      def __str__(self) -> str:
	          return f"Mammal({self.name}, fur={self.fur_color})"
	  
	  
	  class Dog(Mammal):
	      def __init__(self, name: str, breed: str):
	          super().__init__(name, "Woof", "golden")
	          self.breed = breed
	  
	      def fetch(self, item: str) -> str:
	          return f"{self.name} fetches the {item}!"
	  
	      def speak(self) -> str:              # override
	          return f"{self.name} barks loudly: {self._sound}!"
	  
	      def __str__(self) -> str:
	          return f"Dog({self.name}, breed={self.breed})"
	  
	  
	  dog = Dog("Buddy", "Labrador")
	  print(dog)              # Dog(Buddy, breed=Labrador)
	  print(dog.speak())      # Buddy barks loudly: Woof!
	  print(dog.eat("bone"))  # Buddy is eating bone   ← inherited from Animal
	  print(dog.nurse())      # Buddy is nursing young ← inherited from Mammal
	  print(dog.fetch("ball"))# Buddy fetches the ball!
	  print(dog.is_alive())   # True ← private method inherited
	  
	  # Inheritance chain check
	  print(isinstance(dog, Dog))    # True
	  print(isinstance(dog, Mammal)) # True
	  print(isinstance(dog, Animal)) # True
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <string>
	  
	  class Animal {
	  protected:
	      std::string name_;
	      std::string sound_;
	  
	  public:
	      Animal(const std::string& name, const std::string& sound)
	          : name_(name), sound_(sound) {}
	  
	      virtual std::string speak() const {
	          return name_ + " says " + sound_;
	      }
	      std::string eat(const std::string& food) const {
	          return name_ + " is eating " + food;
	      }
	      virtual ~Animal() {}
	  };
	  
	  class Mammal : public Animal {
	  public:
	      std::string furColor;
	  
	      Mammal(const std::string& name, const std::string& sound, const std::string& fur)
	          : Animal(name, sound), furColor(fur) {}
	  
	      std::string nurse() const {
	          return name_ + " is nursing young";
	      }
	  };
	  
	  class Dog : public Mammal {
	  public:
	      std::string breed;
	  
	      Dog(const std::string& name, const std::string& breed)
	          : Mammal(name, "Woof", "golden"), breed(breed) {}
	  
	      std::string speak() const override {
	          return name_ + " barks loudly: " + sound_ + "!";
	      }
	  
	      std::string fetch(const std::string& item) const {
	          return name_ + " fetches the " + item + "!";
	      }
	  };
	  
	  int main() {
	      Dog dog("Buddy", "Labrador");
	      std::cout << dog.speak() << "\n";       // Buddy barks loudly: Woof!
	      std::cout << dog.eat("bone") << "\n";   // Buddy is eating bone
	      std::cout << dog.nurse() << "\n";       // Buddy is nursing young
	      std::cout << dog.fetch("ball") << "\n"; // Buddy fetches the ball!
	  
	      Animal* a = &dog;                       // polymorphism via base pointer
	      std::cout << a->speak() << "\n";        // Buddy barks loudly: Woof! (virtual)
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  public class InheritanceDemo {
	  
	      static class Animal {
	          protected String name;
	          protected String sound;
	  
	          Animal(String name, String sound) {
	              this.name = name;
	              this.sound = sound;
	          }
	  
	          public String speak() {
	              return name + " says " + sound;
	          }
	          public String eat(String food) {
	              return name + " is eating " + food;
	          }
	      }
	  
	      static class Mammal extends Animal {
	          String furColor;
	  
	          Mammal(String name, String sound, String furColor) {
	              super(name, sound);
	              this.furColor = furColor;
	          }
	  
	          public String nurse() {
	              return name + " is nursing young";
	          }
	      }
	  
	      static class Dog extends Mammal {
	          String breed;
	  
	          Dog(String name, String breed) {
	              super(name, "Woof", "golden");
	              this.breed = breed;
	          }
	  
	          @Override
	          public String speak() {
	              return name + " barks loudly: " + sound + "!";
	          }
	  
	          public String fetch(String item) {
	              return name + " fetches the " + item + "!";
	          }
	      }
	  
	      public static void main(String[] args) {
	          Dog dog = new Dog("Buddy", "Labrador");
	          System.out.println(dog.speak());      // Buddy barks loudly: Woof!
	          System.out.println(dog.eat("bone"));  // Buddy is eating bone
	          System.out.println(dog.nurse());      // Buddy is nursing young
	          System.out.println(dog.fetch("ball"));// Buddy fetches the ball!
	  
	          Animal a = dog;  // upcasting
	          System.out.println(a.speak());        // Buddy barks loudly: Woof! (polymorphism)
	  
	          System.out.println(dog instanceof Animal); // true
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  class Animal {
	      constructor(name, sound) {
	          this.name = name;
	          this._sound = sound;  // protected convention
	      }
	      speak() { return `${this.name} says ${this._sound}`; }
	      eat(food) { return `${this.name} is eating ${food}`; }
	      toString() { return `Animal(${this.name})`; }
	  }
	  
	  class Mammal extends Animal {
	      constructor(name, sound, furColor) {
	          super(name, sound);      // must call super() before 'this'
	          this.furColor = furColor;
	      }
	      nurse() { return `${this.name} is nursing young`; }
	  }
	  
	  class Dog extends Mammal {
	      constructor(name, breed) {
	          super(name, "Woof", "golden");
	          this.breed = breed;
	      }
	      speak() {                      // override
	          return `${this.name} barks loudly: ${this._sound}!`;
	      }
	      fetch(item) { return `${this.name} fetches the ${item}!`; }
	      toString() { return `Dog(${this.name}, breed=${this.breed})`; }
	  }
	  
	  const dog = new Dog("Buddy", "Labrador");
	  console.log(dog.toString());       // Dog(Buddy, breed=Labrador)
	  console.log(dog.speak());          // Buddy barks loudly: Woof!
	  console.log(dog.eat("bone"));      // Buddy is eating bone
	  console.log(dog.nurse());          // Buddy is nursing young
	  console.log(dog.fetch("ball"));    // Buddy fetches the ball!
	  console.log(dog instanceof Animal);// true
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  
	  class Animal {
	      protected string Name;
	      protected string Sound;
	  
	      public Animal(string name, string sound) {
	          Name = name;
	          Sound = sound;
	      }
	      public virtual string Speak() => $"{Name} says {Sound}";
	      public string Eat(string food) => $"{Name} is eating {food}";
	  }
	  
	  class Mammal : Animal {
	      public string FurColor;
	      public Mammal(string name, string sound, string furColor)
	          : base(name, sound) {
	          FurColor = furColor;
	      }
	      public string Nurse() => $"{Name} is nursing young";
	  }
	  
	  class Dog : Mammal {
	      public string Breed;
	      public Dog(string name, string breed)
	          : base(name, "Woof", "golden") {
	          Breed = breed;
	      }
	      public override string Speak() => $"{Name} barks loudly: {Sound}!";
	      public string Fetch(string item) => $"{Name} fetches the {item}!";
	  }
	  
	  class Program {
	      static void Main() {
	          Dog dog = new Dog("Buddy", "Labrador");
	          Console.WriteLine(dog.Speak());       // Buddy barks loudly: Woof!
	          Console.WriteLine(dog.Eat("bone"));   // Buddy is eating bone
	          Console.WriteLine(dog.Nurse());       // Buddy is nursing young
	          Console.WriteLine(dog.Fetch("ball")); // Buddy fetches the ball!
	  
	          Animal a = dog;   // upcasting
	          Console.WriteLine(a.Speak());         // Buddy barks loudly: Woof! (virtual)
	          Console.WriteLine(dog is Animal);     // True
	      }
	  }
	  ```
	  
	  :::

- # When to Use Inheritance
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Does a true IS-A\nrelationship exist?"}
	      Q -- Yes --> Q2{"Will child need to\nextend parent behavior?"}
	      Q2 -- Yes --> R1["✅ Use Inheritance\n(child overrides/extends parent)"]
	      Q2 -- No --> R2["⚠️ Consider just using the parent\nor a mixin"]
	      Q -- No --> R3["❌ Use Composition instead\n(HAS-A relationship)"]
	  ```
	-
	- ## ✅ Use Inheritance When
		- A strict **IS-A** relationship exists (Dog IS-A Animal, Manager IS-A Employee).
		- You want to reuse parent code and **extend or override** it in the child.
		- You need **polymorphism** — treating different subclasses uniformly via the base type.
	-
	- ## ❌ Avoid Inheritance When
		- The relationship is **HAS-A** not IS-A (prefer [[Composition]]).
		- You are inheriting just to reuse code with **no logical relationship** (use [[Mixin]] or utility functions).
		- Deep inheritance chains (more than 3–4 levels) make code hard to follow.

- # Key Takeaways
  collapsed:: true
	- **IS-A** — inheritance models "is-a" relationships. Always verify before using.
	- **Code Reuse** — child gets all public/protected attributes and methods of parent for free.
	- **Override** — child can specialize parent methods while still calling `super()` to extend them.
	- **MRO** — Python uses C3 linearization to resolve method lookup order in multiple inheritance.
	- **Polymorphism enabler** — base class references can hold derived class objects, and virtual methods dispatch correctly at runtime.
	- Prefer **shallow** hierarchies — deep chains hurt readability and maintainability.

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Real Python — Inheritance and Composition](https://realpython.com/inheritance-composition-python/)
		- [Python Official Docs — Inheritance](https://docs.python.org/3/tutorial/classes.html#inheritance)
		- [Oracle Java — Inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html)
		- [cppreference — Derived Classes](https://en.cppreference.com/w/cpp/language/derived_class)