---
seoTitle: Decorator Pattern in OOP – Complete In-Depth Guide | Structural Design Pattern, Wrapper
description: "Deep dive into the Decorator design pattern. Covers adding behaviors to objects dynamically without subclassing, wrapping pattern, component/decorator hierarchy, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "decorator pattern, structural design pattern, wrapper, dynamic behavior, Python @decorator, Java decorator, C++ decorator, GoF, VR-Rathod, Code-Note"
displayTitle: Decorator Pattern
---

> [!info] What is the Decorator Pattern?
> The **Decorator Pattern** is a **structural design pattern** that lets you **attach new behaviors to objects at runtime** by wrapping them in decorator classes that share the same interface. It's an alternative to subclassing for extending functionality — instead of creating `LoggedService`, `CachedService`, `AuthenticatedService` subclasses, you stack decorators: `Authenticated(Cached(Logged(service)))`.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of getting **dressed** 👔. You start with a base outfit. Then you add layers: coat, hat, scarf, gloves. Each layer adds functionality (warmth, protection) without changing you. You can remove/add layers independently. The layers wrap around the core.
		- | Real World | Decorator Pattern |
		  |---|---|
		  | Base outfit (you) | **Component** |
		  | Adding a coat | **ConcreteDecorator** wrapping component |
		  | Adding a hat on top | **Another decorator** on the stack |
		  | Removing scarf | **Remove one decorator** — others unchanged |
	-
	- ## Decorator vs Inheritance
	  collapsed:: true
		- | Feature | Inheritance | Decorator |
		  |---|---|---|
		  | Added at | Compile time (fixed) | **Runtime** (dynamic) |
		  | Combinations | Exponential class explosion | Stack any combo freely |
		  | Flexibility | Rigid hierarchy | ✅ Highly flexible |
		  | Example | `LoggedCachedAuthService` | `Auth(Cache(Log(service)))` |
	-
	- ## Python's Built-in `@decorator`
	  collapsed:: true
		- Python's `@decorator` syntax is related but different — it's a function transformer at import time, not the OOP Decorator pattern. The OOP pattern wraps objects, Python's `@` syntax wraps functions.

- # Implementation
  collapsed:: true
	- > [!note] A coffee ordering system — add milk, sugar, whip, and syrups as decorators to a base espresso.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python — Decorator Pattern (Coffee + Middleware) ─────────────────
	  from abc import ABC, abstractmethod
	  
	  # ── Component interface ────────────────────────────────
	  class Coffee(ABC):
	      @abstractmethod
	      def cost(self) -> float: ...
	  
	      @abstractmethod
	      def description(self) -> str: ...
	  
	  # ── Concrete component ─────────────────────────────────
	  class Espresso(Coffee):
	      def cost(self) -> float: return 1.50
	      def description(self) -> str: return "Espresso"
	  
	  class SimpleCoffee(Coffee):
	      def cost(self) -> float: return 1.00
	      def description(self) -> str: return "Simple Coffee"
	  
	  # ── Base Decorator ─────────────────────────────────────
	  class CoffeeDecorator(Coffee):
	      def __init__(self, coffee: Coffee):
	          self._coffee = coffee  # wrapped component
	  
	      def cost(self) -> float: return self._coffee.cost()
	      def description(self) -> str: return self._coffee.description()
	  
	  # ── Concrete Decorators ────────────────────────────────
	  class Milk(CoffeeDecorator):
	      def cost(self) -> float: return self._coffee.cost() + 0.25
	      def description(self) -> str: return self._coffee.description() + ", Milk"
	  
	  class Sugar(CoffeeDecorator):
	      def cost(self) -> float: return self._coffee.cost() + 0.10
	      def description(self) -> str: return self._coffee.description() + ", Sugar"
	  
	  class WhippedCream(CoffeeDecorator):
	      def cost(self) -> float: return self._coffee.cost() + 0.50
	      def description(self) -> str: return self._coffee.description() + ", Whipped Cream"
	  
	  class VanillaSyrup(CoffeeDecorator):
	      def cost(self) -> float: return self._coffee.cost() + 0.75
	      def description(self) -> str: return self._coffee.description() + ", Vanilla Syrup"
	  
	  # Usage — stack decorators dynamically
	  order1 = Espresso()
	  order1 = Milk(order1)
	  order1 = Sugar(order1)
	  print(f"{order1.description()} = ${order1.cost():.2f}")
	  # Espresso, Milk, Sugar = $1.85
	  
	  order2 = Espresso()
	  order2 = WhippedCream(Milk(VanillaSyrup(order2)))  # stack in one line
	  print(f"{order2.description()} = ${order2.cost():.2f}")
	  # Espresso, Vanilla Syrup, Milk, Whipped Cream = $3.00
	  
	  # Any combination without class explosion!
	  
	  
	  # ── Decorator for services — Logging + Caching ─────────
	  class DataService(ABC):
	      @abstractmethod
	      def get_data(self, key: str) -> dict: ...
	  
	  class RealDataService(DataService):
	      def get_data(self, key: str) -> dict:
	          print(f"  [DB] Fetching {key} from database...")
	          return {"key": key, "value": f"data-{key}"}
	  
	  class LoggingDecorator(DataService):
	      def __init__(self, service: DataService): self._service = service
	      def get_data(self, key: str) -> dict:
	          print(f"[LOG] get_data called with key={key!r}")
	          result = self._service.get_data(key)
	          print(f"[LOG] get_data returned {result}")
	          return result
	  
	  class CachingDecorator(DataService):
	      def __init__(self, service: DataService):
	          self._service = service
	          self._cache: dict[str, dict] = {}
	      def get_data(self, key: str) -> dict:
	          if key not in self._cache:
	              self._cache[key] = self._service.get_data(key)
	          else:
	              print(f"[CACHE] Hit for key={key!r}")
	          return self._cache[key]
	  
	  # Stack: Logging + Caching + Real service
	  service = LoggingDecorator(CachingDecorator(RealDataService()))
	  service.get_data("user:42")   # logs, cache miss, DB fetch
	  service.get_data("user:42")   # logs, cache hit — no DB!
	  ```
	  
	  ```c++
	  // ─── C++ — Coffee Decorator ───────────────────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <memory>
	  
	  class Coffee {
	  public:
	      virtual double cost() const = 0;
	      virtual std::string description() const = 0;
	      virtual ~Coffee() {}
	  };
	  
	  class Espresso : public Coffee {
	  public:
	      double cost() const override { return 1.50; }
	      std::string description() const override { return "Espresso"; }
	  };
	  
	  class CoffeeDecorator : public Coffee {
	  protected:
	      std::unique_ptr<Coffee> coffee_;
	  public:
	      CoffeeDecorator(std::unique_ptr<Coffee> c) : coffee_(std::move(c)) {}
	      double cost() const override { return coffee_->cost(); }
	      std::string description() const override { return coffee_->description(); }
	  };
	  
	  class Milk : public CoffeeDecorator {
	  public:
	      using CoffeeDecorator::CoffeeDecorator;
	      double cost() const override { return coffee_->cost() + 0.25; }
	      std::string description() const override { return coffee_->description() + ", Milk"; }
	  };
	  
	  class Sugar : public CoffeeDecorator {
	  public:
	      using CoffeeDecorator::CoffeeDecorator;
	      double cost() const override { return coffee_->cost() + 0.10; }
	      std::string description() const override { return coffee_->description() + ", Sugar"; }
	  };
	  
	  class WhippedCream : public CoffeeDecorator {
	  public:
	      using CoffeeDecorator::CoffeeDecorator;
	      double cost() const override { return coffee_->cost() + 0.50; }
	      std::string description() const override { return coffee_->description() + ", Whipped Cream"; }
	  };
	  
	  int main() {
	      auto order = std::make_unique<Espresso>();
	      auto with_milk = std::make_unique<Milk>(std::move(order));
	      auto with_sugar = std::make_unique<Sugar>(std::move(with_milk));
	      std::cout << with_sugar->description() << " = $" << with_sugar->cost() << "\n";
	      // Espresso, Milk, Sugar = $1.85
	  }
	  ```
	  
	  ```java
	  // ─── Java — Coffee Decorator ─────────────────────────────────────────
	  interface Coffee {
	      double cost();
	      String description();
	  }
	  
	  class Espresso implements Coffee {
	      public double cost() { return 1.50; }
	      public String description() { return "Espresso"; }
	  }
	  
	  abstract class CoffeeDecorator implements Coffee {
	      protected Coffee coffee;
	      CoffeeDecorator(Coffee c) { this.coffee = c; }
	      public double cost() { return coffee.cost(); }
	      public String description() { return coffee.description(); }
	  }
	  
	  class Milk extends CoffeeDecorator {
	      Milk(Coffee c) { super(c); }
	      public double cost() { return coffee.cost() + 0.25; }
	      public String description() { return coffee.description() + ", Milk"; }
	  }
	  
	  class WhippedCream extends CoffeeDecorator {
	      WhippedCream(Coffee c) { super(c); }
	      public double cost() { return coffee.cost() + 0.50; }
	      public String description() { return coffee.description() + ", Whipped Cream"; }
	  }
	  
	  class VanillaSyrup extends CoffeeDecorator {
	      VanillaSyrup(Coffee c) { super(c); }
	      public double cost() { return coffee.cost() + 0.75; }
	      public String description() { return coffee.description() + ", Vanilla Syrup"; }
	  }
	  
	  class DecoratorDemo {
	      public static void main(String[] args) {
	          Coffee order = new WhippedCream(new Milk(new VanillaSyrup(new Espresso())));
	          System.out.printf("%s = $%.2f%n", order.description(), order.cost());
	          // Espresso, Vanilla Syrup, Milk, Whipped Cream = $3.00
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript — Coffee Decorator ────────────────────────────────────
	  class Espresso {
	      get cost() { return 1.50; }
	      get description() { return "Espresso"; }
	  }
	  
	  class CoffeeDecorator {
	      constructor(coffee) { this._coffee = coffee; }
	      get cost() { return this._coffee.cost; }
	      get description() { return this._coffee.description; }
	  }
	  
	  class Milk extends CoffeeDecorator {
	      get cost() { return this._coffee.cost + 0.25; }
	      get description() { return `${this._coffee.description}, Milk`; }
	  }
	  
	  class WhippedCream extends CoffeeDecorator {
	      get cost() { return this._coffee.cost + 0.50; }
	      get description() { return `${this._coffee.description}, Whipped Cream`; }
	  }
	  
	  class VanillaSyrup extends CoffeeDecorator {
	      get cost() { return this._coffee.cost + 0.75; }
	      get description() { return `${this._coffee.description}, Vanilla Syrup`; }
	  }
	  
	  const order = new WhippedCream(new Milk(new VanillaSyrup(new Espresso())));
	  console.log(`${order.description} = $${order.cost.toFixed(2)}`);
	  // Espresso, Vanilla Syrup, Milk, Whipped Cream = $3.00
	  ```
	  
	  ```csharp
	  // ─── C# — Coffee Decorator ────────────────────────────────────────────
	  using System;
	  
	  interface ICoffee {
	      double Cost { get; }
	      string Description { get; }
	  }
	  
	  class Espresso : ICoffee {
	      public double Cost => 1.50;
	      public string Description => "Espresso";
	  }
	  
	  abstract class CoffeeDecorator : ICoffee {
	      protected ICoffee coffee;
	      protected CoffeeDecorator(ICoffee c) { coffee = c; }
	      public virtual double Cost => coffee.Cost;
	      public virtual string Description => coffee.Description;
	  }
	  
	  class Milk : CoffeeDecorator {
	      public Milk(ICoffee c) : base(c) {}
	      public override double Cost => coffee.Cost + 0.25;
	      public override string Description => $"{coffee.Description}, Milk";
	  }
	  
	  class WhippedCream : CoffeeDecorator {
	      public WhippedCream(ICoffee c) : base(c) {}
	      public override double Cost => coffee.Cost + 0.50;
	      public override string Description => $"{coffee.Description}, Whipped Cream";
	  }
	  
	  class Program {
	      static void Main() {
	          ICoffee order = new WhippedCream(new Milk(new Espresso()));
	          Console.WriteLine($"{order.Description} = ${order.Cost:F2}");
	          // Espresso, Milk, Whipped Cream = $2.25
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- **Decorators wrap objects** — same interface, new behavior layered on top.
	- Enables **runtime composition** — stack any combination of behaviors without class explosion.
	- Follows **Open/Closed Principle** — new behavior via new decorator classes, not modified base.
	- Real-world usage: **Java I/O streams** (`BufferedInputStream(FileInputStream(...))`), **Python WSGI middleware**, **logging/caching/auth wrappers**.
	- Note: Python's `@decorator` syntax for functions is related in spirit but different — it's applied at function definition time, not at object creation time.

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Refactoring Guru — Decorator](https://refactoring.guru/design-patterns/decorator)
		- [GoF Design Patterns — Decorator](https://en.wikipedia.org/wiki/Decorator_pattern)
