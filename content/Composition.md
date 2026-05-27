---
seoTitle: Composition in OOP – Complete In-Depth Guide | HAS-A Relationship, vs Inheritance
description: "Deep dive into Composition in OOP. Covers the HAS-A relationship, Composition vs Inheritance, Aggregation vs Composition, dependency injection via composition, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "composition, OOP, has-a relationship, composition vs inheritance, aggregation, dependency injection, object composition, Python composition, Java composition, C++ composition, VR-Rathod, Code-Note"
displayTitle: Composition
---

> [!info] What is Composition?
> **Composition** is an OOP design technique where a class is built by **containing instances of other classes** as attributes, rather than inheriting from them. It models a **"HAS-A"** relationship — a `Car` HAS-A `Engine`. When the parent object is destroyed, the composed objects are destroyed with it (strong ownership — unlike [[Aggregation]]).

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- A **Computer** 🖥️ is composed of a `CPU`, `RAM`, `HardDrive`, and `GraphicsCard`. The computer HAS-A CPU. When the computer is scrapped (destroyed), all its components are destroyed with it — they have no independent existence apart from this computer.
		- | Composition | OOP Equivalent |
		  |---|---|
		  | Computer HAS-A CPU | `class Computer: def __init__: self.cpu = CPU()` |
		  | CPU can't work without Computer here | **Composed object lifecycle tied to owner** |
		  | Computer *is not* a CPU | **No inheritance — HAS-A not IS-A** |
	-
	- ## Composition vs Inheritance
	  collapsed:: true
		- | Aspect | Composition | Inheritance |
		  |---|---|---|
		  | Relationship | **HAS-A** | **IS-A** |
		  | Coupling | **Loose** — components are replaceable | **Tight** — child locked to parent structure |
		  | Flexibility | ✅ Swap implementations at runtime | ❌ Fixed at compile time |
		  | Code Reuse | Via delegation to inner objects | Via inherited methods |
		  | Testability | ✅ Inject mock components easily | ❌ Harder to mock parent behavior |
		  | When to prefer | "Favor composition over inheritance" (GoF) | Clear IS-A hierarchy |
		-
		- > [!tip] **"Favor Composition Over Inheritance"** — one of the most important software design principles from the Gang of Four Design Patterns book. Composition leads to more flexible, testable, maintainable code.
	-
	- ## Composition vs Aggregation
	  collapsed:: true
		- | | Composition | Aggregation |
		  |---|---|---|
		  | Ownership | **Strong** — child cannot exist without parent | **Weak** — child can exist independently |
		  | Lifecycle | Child destroyed with parent | Child survives parent destruction |
		  | Example | `Car` + `Engine` (Engine created inside Car) | `Team` + `Player` (Player exists without team) |
		  | UML symbol | ◆ (filled diamond) | ◇ (empty diamond) |

- # Implementation
  collapsed:: true
	- > [!note] A `Car` composed of `Engine`, `Transmission`, and `GPS` — showing composition, delegation, and dependency injection.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  from dataclasses import dataclass, field
	  
	  @dataclass
	  class Engine:
	      cylinders: int
	      horsepower: int
	      _running: bool = field(default=False, repr=False)
	  
	      def start(self) -> str:
	          self._running = True
	          return f"Engine ({self.cylinders}cyl, {self.horsepower}hp) started 🔥"
	  
	      def stop(self) -> str:
	          self._running = False
	          return "Engine stopped."
	  
	      def is_running(self) -> bool:
	          return self._running
	  
	  
	  @dataclass
	  class GPS:
	      provider: str = "Google Maps"
	  
	      def navigate_to(self, destination: str) -> str:
	          return f"[{self.provider}] Navigating to {destination}..."
	  
	  
	  @dataclass
	  class Transmission:
	      type_: str = "Automatic"  # "Manual" | "Automatic" | "CVT"
	      current_gear: int = 0
	  
	      def shift_up(self) -> str:
	          self.current_gear += 1
	          return f"{self.type_} → Gear {self.current_gear}"
	  
	  
	  class Car:
	      """Car HAS-A Engine, Transmission, GPS — all created and owned by Car."""
	  
	      def __init__(self, make: str, model: str,
	                   engine: Engine = None,    # ← Dependency Injection
	                   gps: GPS = None):
	          self.make = make
	          self.model = model
	          # Composition — Car owns these:
	          self.engine = engine or Engine(4, 200)       # default engine
	          self.transmission = Transmission("Automatic") # always created here
	          self.gps = gps or GPS()                      # default GPS
	  
	      def start(self) -> str:
	          return f"{self.make} {self.model}: {self.engine.start()}"
	  
	      def navigate(self, destination: str) -> str:
	          if not self.engine.is_running():
	              return "Start the car first!"
	          return self.gps.navigate_to(destination)
	  
	      def shift(self) -> str:
	          return self.transmission.shift_up()
	  
	      def __repr__(self) -> str:
	          return f"Car({self.make} {self.model}, {self.engine.horsepower}hp)"
	  
	  
	  # Standard usage
	  car1 = Car("Toyota", "Supra")
	  print(car1.start())             # Toyota Supra: Engine (4cyl, 200hp) started 🔥
	  print(car1.navigate("Airport")) # [Google Maps] Navigating to Airport...
	  print(car1.shift())             # Automatic → Gear 1
	  
	  # Dependency injection — inject a custom engine
	  v8 = Engine(8, 500)
	  car2 = Car("Ford", "Mustang", engine=v8, gps=GPS("Waze"))
	  print(car2)                     # Car(Ford Mustang, 500hp)
	  print(car2.start())             # Ford Mustang: Engine (8cyl, 500hp) started 🔥
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <memory>
	  
	  class Engine {
	      int cylinders_, hp_;
	      bool running_ = false;
	  public:
	      Engine(int cyl, int hp) : cylinders_(cyl), hp_(hp) {}
	      std::string start() {
	          running_ = true;
	          return "Engine (" + std::to_string(cylinders_) + "cyl, "
	                            + std::to_string(hp_) + "hp) started";
	      }
	      bool isRunning() const { return running_; }
	      ~Engine() { std::cout << "[Engine destroyed]\n"; }
	  };
	  
	  class GPS {
	      std::string provider_;
	  public:
	      GPS(std::string provider = "Google Maps") : provider_(provider) {}
	      std::string navigateTo(const std::string& dest) {
	          return "[" + provider_ + "] Navigating to " + dest;
	      }
	  };
	  
	  class Car {
	      std::string make_, model_;
	      Engine engine_;          // Composition — value type (owned)
	      GPS gps_;                // Composition — value type (owned)
	  public:
	      Car(std::string make, std::string model, int cyl = 4, int hp = 200)
	          : make_(make), model_(model), engine_(cyl, hp), gps_() {}
	  
	      std::string start() { return make_ + " " + model_ + ": " + engine_.start(); }
	      std::string navigate(const std::string& dest) {
	          if (!engine_.isRunning()) return "Start car first!";
	          return gps_.navigateTo(dest);
	      }
	      ~Car() { std::cout << "[Car " << make_ << " destroyed]\n"; }
	  };
	  
	  int main() {
	      Car car("Toyota", "Supra");
	      std::cout << car.start() << "\n";
	      std::cout << car.navigate("Airport") << "\n";
	  }
	  // Destructors: [Car Toyota destroyed] then [Engine destroyed]
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  public class CompositionDemo {
	  
	      static class Engine {
	          int cylinders, hp;
	          boolean running = false;
	          Engine(int cyl, int hp) { this.cylinders = cyl; this.hp = hp; }
	          String start() { running = true; return "Engine (" + cylinders + "cyl, " + hp + "hp) started"; }
	          boolean isRunning() { return running; }
	      }
	  
	      static class GPS {
	          String provider;
	          GPS(String provider) { this.provider = provider; }
	          GPS() { this("Google Maps"); }
	          String navigateTo(String dest) { return "[" + provider + "] Navigating to " + dest; }
	      }
	  
	      static class Car {
	          String make, model;
	          Engine engine;     // Composition
	          GPS gps;           // Composition
	  
	          Car(String make, String model) {
	              this(make, model, new Engine(4, 200), new GPS());
	          }
	  
	          Car(String make, String model, Engine engine, GPS gps) {
	              this.make = make; this.model = model;
	              this.engine = engine; this.gps = gps;  // Dependency Injection
	          }
	  
	          String start() { return make + " " + model + ": " + engine.start(); }
	          String navigate(String dest) {
	              if (!engine.isRunning()) return "Start car first!";
	              return gps.navigateTo(dest);
	          }
	      }
	  
	      public static void main(String[] args) {
	          Car car1 = new Car("Toyota", "Supra");
	          System.out.println(car1.start());
	          System.out.println(car1.navigate("Airport"));
	  
	          // Dependency injection
	          Car car2 = new Car("Ford", "Mustang", new Engine(8, 500), new GPS("Waze"));
	          System.out.println(car2.start());
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  class Engine {
	      constructor(cylinders, hp) {
	          this.cylinders = cylinders;
	          this.hp = hp;
	          this.running = false;
	      }
	      start() { this.running = true; return `Engine (${this.cylinders}cyl, ${this.hp}hp) started 🔥`; }
	      isRunning() { return this.running; }
	  }
	  
	  class GPS {
	      constructor(provider = "Google Maps") { this.provider = provider; }
	      navigateTo(dest) { return `[${this.provider}] Navigating to ${dest}...`; }
	  }
	  
	  class Car {
	      constructor(make, model, engine = new Engine(4, 200), gps = new GPS()) {
	          this.make = make;
	          this.model = model;
	          this.engine = engine;   // Composition
	          this.gps = gps;         // Composition (Dependency Injection)
	      }
	  
	      start() { return `${this.make} ${this.model}: ${this.engine.start()}`; }
	  
	      navigate(dest) {
	          return this.engine.isRunning()
	              ? this.gps.navigateTo(dest)
	              : "Start the car first!";
	      }
	  
	      toString() { return `Car(${this.make} ${this.model}, ${this.engine.hp}hp)`; }
	  }
	  
	  const car1 = new Car("Toyota", "Supra");
	  console.log(car1.start());              // Toyota Supra: Engine (4cyl, 200hp) started 🔥
	  console.log(car1.navigate("Airport"));  // [Google Maps] Navigating to Airport...
	  
	  const car2 = new Car("Ford", "Mustang", new Engine(8, 500), new GPS("Waze"));
	  console.log(car2.toString());           // Car(Ford Mustang, 500hp)
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  
	  class Engine {
	      public int Cylinders { get; }
	      public int Hp { get; }
	      public bool Running { get; private set; }
	  
	      public Engine(int cyl, int hp) { Cylinders = cyl; Hp = hp; }
	      public string Start() { Running = true; return $"Engine ({Cylinders}cyl, {Hp}hp) started"; }
	  }
	  
	  class GPS {
	      string provider;
	      public GPS(string provider = "Google Maps") { this.provider = provider; }
	      public string NavigateTo(string dest) => $"[{provider}] Navigating to {dest}";
	  }
	  
	  class Car {
	      string make, model;
	      Engine engine;   // Composition
	      GPS gps;         // Composition
	  
	      public Car(string make, string model, Engine engine = null, GPS gps = null) {
	          this.make = make; this.model = model;
	          this.engine = engine ?? new Engine(4, 200);
	          this.gps = gps ?? new GPS();
	      }
	  
	      public string Start() => $"{make} {model}: {engine.Start()}";
	      public string Navigate(string dest) =>
	          engine.Running ? gps.NavigateTo(dest) : "Start the car first!";
	  
	      static void Main() {
	          var car1 = new Car("Toyota", "Supra");
	          Console.WriteLine(car1.Start());
	          Console.WriteLine(car1.Navigate("Airport"));
	  
	          var car2 = new Car("Ford", "Mustang", new Engine(8, 500), new GPS("Waze"));
	          Console.WriteLine(car2.Start());
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- **Composition = HAS-A relationship** — an object contains other objects as its components.
	- **Strong ownership** — composed objects are created and destroyed with the parent (unlike [[Aggregation]]).
	- **Favor Composition Over Inheritance** — composition is more flexible, testable, and avoids tight coupling.
	- **Dependency Injection** — pass composed objects via the constructor to make them swappable (great for testing).
	- Composition delegates behavior to inner objects — the outer class acts as an **orchestrator**.

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Real Python — Composition vs Inheritance](https://realpython.com/inheritance-composition-python/)
		- [Refactoring.Guru — Composition over Inheritance](https://refactoring.guru/design-patterns/composite)
		- [GoF — Design Patterns Book](https://en.wikipedia.org/wiki/Design_Patterns)