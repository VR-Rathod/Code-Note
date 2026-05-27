---
seoTitle: Factory Pattern in OOP – Complete In-Depth Guide | Creational Design Pattern, Factory Method, Abstract Factory
description: "Deep dive into the Factory design pattern. Covers Simple Factory, Factory Method, and Abstract Factory variants, UML diagrams, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "factory pattern, factory method, abstract factory, creational design pattern, object creation, GoF, Python factory, Java factory, C++ factory, VR-Rathod, Code-Note"
displayTitle: Factory Pattern
---

> [!info] What is the Factory Pattern?
> The **Factory Pattern** is a **creational design pattern** that provides an interface for creating objects **without specifying the exact class** to be created. The decision of which class to instantiate is delegated to factory methods or classes. There are three variants: **Simple Factory**, **Factory Method**, and **Abstract Factory**.

- # Explanation
  collapsed:: true
	- ## Three Factory Variants
	  collapsed:: true
		- | Variant | Description | Complexity |
		  |---|---|---|
		  | **Simple Factory** | A single class with a static method that creates objects | 🟢 Simple |
		  | **Factory Method** | Subclasses decide which class to instantiate (pattern) | 🟡 Medium |
		  | **Abstract Factory** | Factory of factories — creates families of related objects | 🔴 Complex |
	-
	- ## Real-World Analogy
	  collapsed:: true
		- **Factory Method**: A pizza restaurant 🍕 `createPizza()` method — the NYStore creates NY-style pizza, the ChicagoStore creates Chicago-style pizza. Same interface, different concrete products based on which store (factory) you use.
		- **Abstract Factory**: An **IKEA** — they have different furniture "families" (Modern, Classic, Victorian). Each family has matching Chair, Sofa, and Table. The Abstract Factory ensures you get matching pieces from the same family.
	-
	- ## UML — Factory Method
	  collapsed:: true
		- ```mermaid
		  classDiagram
		      class Creator {
		          +factoryMethod() Product
		          +someOperation()
		      }
		      class ConcreteCreatorA {
		          +factoryMethod() ConcreteProductA
		      }
		      class Product { <<interface>> +operation() }
		      class ConcreteProductA { +operation() }
		      class ConcreteProductB { +operation() }
		      Creator <|-- ConcreteCreatorA
		      Product <|.. ConcreteProductA
		      Product <|.. ConcreteProductB
		      Creator ..> Product
		  ```

- # Implementation
  collapsed:: true
	- > [!note] A transport logistics system — factory creates the right Transport object (Truck, Ship, Air) based on the delivery type.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python — All 3 Factory variants ─────────────────────────────────
	  from abc import ABC, abstractmethod
	  
	  # ══════════════════════════════════════════════════════
	  # VARIANT 1: Simple Factory
	  # ══════════════════════════════════════════════════════
	  class Animal(ABC):
	      @abstractmethod
	      def speak(self) -> str: ...
	  
	  class Dog(Animal):
	      def speak(self) -> str: return "Woof!"
	  
	  class Cat(Animal):
	      def speak(self) -> str: return "Meow!"
	  
	  class Bird(Animal):
	      def speak(self) -> str: return "Tweet!"
	  
	  class AnimalFactory:
	      """Simple Factory — one static method, creates based on type string."""
	      @staticmethod
	      def create(animal_type: str) -> Animal:
	          animals = {"dog": Dog, "cat": Cat, "bird": Bird}
	          cls = animals.get(animal_type.lower())
	          if not cls:
	              raise ValueError(f"Unknown animal: {animal_type}")
	          return cls()
	  
	  dog = AnimalFactory.create("dog")
	  print(dog.speak())  # Woof!
	  
	  
	  # ══════════════════════════════════════════════════════
	  # VARIANT 2: Factory Method Pattern
	  # ══════════════════════════════════════════════════════
	  class Transport(ABC):
	      @abstractmethod
	      def deliver(self, cargo: str, destination: str) -> str: ...
	      @abstractmethod
	      def estimated_days(self, distance_km: float) -> int: ...
	  
	  class Truck(Transport):
	      def deliver(self, cargo: str, destination: str) -> str:
	          return f"🚛 Truck delivering {cargo} to {destination} by road"
	      def estimated_days(self, distance_km: float) -> int:
	          return max(1, int(distance_km / 800))
	  
	  class Ship(Transport):
	      def deliver(self, cargo: str, destination: str) -> str:
	          return f"🚢 Ship delivering {cargo} to {destination} by sea"
	      def estimated_days(self, distance_km: float) -> int:
	          return max(5, int(distance_km / 500))
	  
	  class Plane(Transport):
	      def deliver(self, cargo: str, destination: str) -> str:
	          return f"✈️ Plane delivering {cargo} to {destination} by air"
	      def estimated_days(self, distance_km: float) -> int:
	          return 1
	  
	  # Creator base class — defines factory method
	  class Logistics(ABC):
	      @abstractmethod
	      def create_transport(self) -> Transport:
	          """Factory method — subclass decides what to create.""" ...
	  
	      def plan_delivery(self, cargo: str, destination: str, distance_km: float) -> None:
	          transport = self.create_transport()   # calls factory method
	          print(transport.deliver(cargo, destination))
	          print(f"  ETA: {transport.estimated_days(distance_km)} days")
	  
	  # Concrete creators
	  class RoadLogistics(Logistics):
	      def create_transport(self) -> Transport: return Truck()
	  
	  class SeaLogistics(Logistics):
	      def create_transport(self) -> Transport: return Ship()
	  
	  class AirLogistics(Logistics):
	      def create_transport(self) -> Transport: return Plane()
	  
	  # Client — works with any Logistics subclass
	  road = RoadLogistics()
	  road.plan_delivery("Electronics", "Chicago", 1200)
	  # 🚛 Truck delivering Electronics to Chicago by road
	  # ETA: 1 days
	  
	  sea = SeaLogistics()
	  sea.plan_delivery("Furniture", "London", 8000)
	  # 🚢 Ship delivering Furniture to London by sea
	  # ETA: 16 days
	  
	  
	  # ══════════════════════════════════════════════════════
	  # VARIANT 3: Abstract Factory — UI Component families
	  # ══════════════════════════════════════════════════════
	  class Button(ABC):
	      @abstractmethod
	      def render(self) -> str: ...
	  
	  class TextInput(ABC):
	      @abstractmethod
	      def render(self) -> str: ...
	  
	  class UIFactory(ABC):
	      @abstractmethod
	      def create_button(self) -> Button: ...
	      @abstractmethod
	      def create_input(self) -> TextInput: ...
	  
	  # Windows family
	  class WindowsButton(Button):
	      def render(self) -> str: return "[Windows Button ■]"
	  class WindowsInput(TextInput):
	      def render(self) -> str: return "[Windows Input ___]"
	  class WindowsFactory(UIFactory):
	      def create_button(self) -> Button: return WindowsButton()
	      def create_input(self) -> TextInput: return WindowsInput()
	  
	  # Mac family
	  class MacButton(Button):
	      def render(self) -> str: return "( Mac Button ● )"
	  class MacInput(TextInput):
	      def render(self) -> str: return "( Mac Input ___ )"
	  class MacFactory(UIFactory):
	      def create_button(self) -> Button: return MacButton()
	      def create_input(self) -> TextInput: return MacInput()
	  
	  def render_ui(factory: UIFactory) -> None:
	      btn = factory.create_button()
	      inp = factory.create_input()
	      print(f"Button: {btn.render()}")
	      print(f"Input:  {inp.render()}")
	  
	  render_ui(WindowsFactory())
	  # Button: [Windows Button ■]
	  # Input:  [Windows Input ___]
	  render_ui(MacFactory())
	  # Button: ( Mac Button ● )
	  # Input:  ( Mac Input ___ )
	  ```
	  
	  ```c++
	  // ─── C++ — Factory Method Pattern ────────────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <memory>
	  
	  class Transport {
	  public:
	      virtual std::string deliver(const std::string& cargo, const std::string& dest) const = 0;
	      virtual ~Transport() {}
	  };
	  
	  class Truck : public Transport {
	  public:
	      std::string deliver(const std::string& cargo, const std::string& dest) const override {
	          return "[Truck] Delivering " + cargo + " to " + dest + " by road";
	      }
	  };
	  
	  class Ship : public Transport {
	  public:
	      std::string deliver(const std::string& cargo, const std::string& dest) const override {
	          return "[Ship] Delivering " + cargo + " to " + dest + " by sea";
	      }
	  };
	  
	  class Logistics {
	  public:
	      virtual std::unique_ptr<Transport> createTransport() const = 0;
	  
	      void planDelivery(const std::string& cargo, const std::string& dest) const {
	          auto transport = createTransport();
	          std::cout << transport->deliver(cargo, dest) << "\n";
	      }
	      virtual ~Logistics() {}
	  };
	  
	  class RoadLogistics : public Logistics {
	  public:
	      std::unique_ptr<Transport> createTransport() const override {
	          return std::make_unique<Truck>();
	      }
	  };
	  
	  class SeaLogistics : public Logistics {
	  public:
	      std::unique_ptr<Transport> createTransport() const override {
	          return std::make_unique<Ship>();
	      }
	  };
	  
	  int main() {
	      RoadLogistics road;
	      road.planDelivery("Electronics", "Chicago");
	  
	      SeaLogistics sea;
	      sea.planDelivery("Furniture", "London");
	  }
	  ```
	  
	  ```java
	  // ─── Java — Factory Method Pattern ───────────────────────────────────
	  interface Transport {
	      String deliver(String cargo, String destination);
	      int estimatedDays(double distanceKm);
	  }
	  
	  class Truck implements Transport {
	      public String deliver(String c, String d) { return "[Truck] " + c + " → " + d + " by road"; }
	      public int estimatedDays(double km) { return Math.max(1, (int)(km / 800)); }
	  }
	  
	  class Ship implements Transport {
	      public String deliver(String c, String d) { return "[Ship] " + c + " → " + d + " by sea"; }
	      public int estimatedDays(double km) { return Math.max(5, (int)(km / 500)); }
	  }
	  
	  abstract class Logistics {
	      protected abstract Transport createTransport();
	  
	      public void planDelivery(String cargo, String dest, double km) {
	          Transport t = createTransport();
	          System.out.println(t.deliver(cargo, dest));
	          System.out.println("  ETA: " + t.estimatedDays(km) + " days");
	      }
	  }
	  
	  class RoadLogistics extends Logistics {
	      protected Transport createTransport() { return new Truck(); }
	  }
	  
	  class SeaLogistics extends Logistics {
	      protected Transport createTransport() { return new Ship(); }
	  }
	  
	  class FactoryDemo {
	      public static void main(String[] args) {
	          new RoadLogistics().planDelivery("Electronics", "Chicago", 1200);
	          new SeaLogistics().planDelivery("Furniture", "London", 8000);
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript — Simple Factory + Factory Method ─────────────────────
	  // Simple Factory
	  class AnimalFactory {
	      static create(type) {
	          const map = {
	              dog: () => ({ speak: () => "Woof!", type: "dog" }),
	              cat: () => ({ speak: () => "Meow!", type: "cat" }),
	              bird: () => ({ speak: () => "Tweet!", type: "bird" }),
	          };
	          const factory = map[type.toLowerCase()];
	          if (!factory) throw new Error(`Unknown: ${type}`);
	          return factory();
	      }
	  }
	  
	  const dog = AnimalFactory.create("dog");
	  console.log(dog.speak());  // Woof!
	  
	  // Factory Method
	  class Transport {
	      deliver(cargo, dest) { throw new Error("override"); }
	  }
	  class Truck extends Transport {
	      deliver(cargo, dest) { return `[Truck] ${cargo} → ${dest} by road`; }
	  }
	  class Ship extends Transport {
	      deliver(cargo, dest) { return `[Ship] ${cargo} → ${dest} by sea`; }
	  }
	  
	  class Logistics {
	      createTransport() { throw new Error("override"); }
	      planDelivery(cargo, dest) { console.log(this.createTransport().deliver(cargo, dest)); }
	  }
	  class RoadLogistics extends Logistics { createTransport() { return new Truck(); } }
	  class SeaLogistics extends Logistics { createTransport() { return new Ship(); } }
	  
	  new RoadLogistics().planDelivery("Electronics", "Chicago");
	  new SeaLogistics().planDelivery("Furniture", "London");
	  ```
	  
	  ```csharp
	  // ─── C# — Factory Method ─────────────────────────────────────────────
	  using System;
	  
	  interface ITransport {
	      string Deliver(string cargo, string destination);
	  }
	  
	  class Truck : ITransport {
	      public string Deliver(string c, string d) => $"[Truck] {c} → {d} by road";
	  }
	  
	  class Ship : ITransport {
	      public string Deliver(string c, string d) => $"[Ship] {c} → {d} by sea";
	  }
	  
	  abstract class Logistics {
	      protected abstract ITransport CreateTransport();
	      public void PlanDelivery(string cargo, string dest) =>
	          Console.WriteLine(CreateTransport().Deliver(cargo, dest));
	  }
	  
	  class RoadLogistics : Logistics {
	      protected override ITransport CreateTransport() => new Truck();
	  }
	  
	  class SeaLogistics : Logistics {
	      protected override ITransport CreateTransport() => new Ship();
	  }
	  
	  class Program {
	      static void Main() {
	          new RoadLogistics().PlanDelivery("Electronics", "Chicago");
	          new SeaLogistics().PlanDelivery("Furniture", "London");
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- **Simple Factory**: one class, static method, creates based on type — not a GoF pattern but widely used.
	- **Factory Method**: define interface in base class, subclass decides what to create — follows OCP.
	- **Abstract Factory**: factory of factories — ensures matching families of related objects.
	- Use factories when: object creation is complex, you need to decouple client from concrete classes, you want to swap implementations easily.
	- Related patterns: [[Singleton Pattern]], [[Strategy Pattern]], [[Observer Pattern]]

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Refactoring Guru — Factory Method](https://refactoring.guru/design-patterns/factory-method)
		- [Refactoring Guru — Abstract Factory](https://refactoring.guru/design-patterns/abstract-factory)