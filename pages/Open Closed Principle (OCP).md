---
seoTitle: Open Closed Principle (OCP) – Complete Guide | Open for Extension, Closed for Modification
description: "Deep dive into the Open/Closed Principle (OCP) from SOLID. Covers what it means to be open for extension and closed for modification, how to use polymorphism and strategy pattern for OCP, and examples in Python, Java, and JavaScript."
keywords: "Open Closed Principle, OCP, SOLID, open for extension, closed for modification, polymorphism, strategy pattern, Python OCP, Java OCP, clean architecture, VR-Rathod, Code-Note"
displayTitle: Open Closed Principle (OCP)
---

> [!info] What is the Open/Closed Principle?
> The **Open/Closed Principle (OCP)** — the **O** in [[SOLID]] — states that software entities (classes, modules, functions) should be **open for extension but closed for modification**. You should be able to add new behavior without changing existing tested, working code. New features = new code, not modified old code.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **plugin architecture** 🔌 in an application like Photoshop or VS Code. The core application is **closed for modification** — Photoshop's team doesn't rewrite their core every time a new filter is needed. Instead, it's **open for extension** — new plugins/filters can be added without touching the core. The core defines a stable interface; extensions implement it.
	-
	- ## The Problem OCP Solves
	  collapsed:: true
		- Without OCP, adding a new "type" or "behavior" requires modifying existing methods — specifically dangerous `if/switch` chains:
		- ```python
		  # ❌ OCP Violation — Must modify this every time a new shape is added
		  def calculate_total_area(shapes):
		      total = 0
		      for shape in shapes:
		          if shape.type == "circle":
		              total += 3.14 * shape.radius ** 2
		          elif shape.type == "rectangle":
		              total += shape.width * shape.height
		          elif shape.type == "triangle":    # ← modify here to add triangle
		              total += 0.5 * shape.base * shape.height
		          # Every new shape = modify this function = risk breaking circles/rectangles
		      return total
		  
		  # ✅ OCP Compliant — Add new shapes without modifying calculate_total_area
		  from abc import ABC, abstractmethod
		  
		  class Shape(ABC):
		      @abstractmethod
		      def area(self) -> float: ...
		  
		  class Circle(Shape):
		      def __init__(self, r): self.r = r
		      def area(self): return 3.14 * self.r ** 2
		  
		  class Rectangle(Shape):
		      def __init__(self, w, h): self.w = w; self.h = h
		      def area(self): return self.w * self.h
		  
		  # NEW SHAPE — no modification to calculate_total_area!
		  class Triangle(Shape):
		      def __init__(self, b, h): self.b = b; self.h = h
		      def area(self): return 0.5 * self.b * self.h
		  
		  def calculate_total_area(shapes: list[Shape]) -> float:
		      return sum(s.area() for s in shapes)  # ← never changes!
		  
		  shapes = [Circle(5), Rectangle(4, 6), Triangle(3, 8)]
		  print(calculate_total_area(shapes))  # 127.42
		  ```

- # Implementation
  collapsed:: true
	- > [!note] A discount system — adding new discount types without modifying the calculation engine.
	  > Languages: [[Python]] · [[Java]] · [[Java Script]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python — OCP via abstract strategy ───────────────────────────────
	  from abc import ABC, abstractmethod
	  from dataclasses import dataclass
	  
	  @dataclass
	  class Order:
	      customer: str
	      amount: float
	      membership: str = "basic"
	  
	  # ── Extension point (never modified) ──────────────────
	  class DiscountStrategy(ABC):
	      @abstractmethod
	      def apply(self, order: Order) -> float:
	          """Return the discount amount.""" ...
	  
	      @abstractmethod
	      def description(self) -> str: ...
	  
	  # ── Concrete strategies (extensions — closed for modification) ──
	  class NoDiscount(DiscountStrategy):
	      def apply(self, order: Order) -> float: return 0.0
	      def description(self) -> str: return "No discount"
	  
	  class PercentageDiscount(DiscountStrategy):
	      def __init__(self, rate: float): self.rate = rate
	      def apply(self, order: Order) -> float: return order.amount * self.rate
	      def description(self) -> str: return f"{self.rate*100:.0f}% discount"
	  
	  class MembershipDiscount(DiscountStrategy):
	      _rates = {"basic": 0.0, "silver": 0.05, "gold": 0.10, "platinum": 0.20}
	      def apply(self, order: Order) -> float:
	          return order.amount * self._rates.get(order.membership, 0.0)
	      def description(self) -> str: return f"Membership ({order.membership}) discount"
	  
	  class SeasonalDiscount(DiscountStrategy):
	      def __init__(self, season_rate: float): self.rate = season_rate
	      def apply(self, order: Order) -> float: return order.amount * self.rate
	      def description(self) -> str: return f"Seasonal {self.rate*100:.0f}% discount"
	  
	  # NEW: Holiday discount added WITHOUT modifying anything above
	  class HolidayDiscount(DiscountStrategy):
	      def apply(self, order: Order) -> float:
	          return min(order.amount * 0.25, 50.0)  # 25% but max $50
	      def description(self) -> str: return "Holiday discount (max $50)"
	  
	  # ── Pricing engine — CLOSED for modification ───────────
	  class PricingEngine:
	      """This class NEVER changes when new discounts are added."""
	      def __init__(self, strategy: DiscountStrategy):
	          self.strategy = strategy
	  
	      def calculate(self, order: Order) -> dict:
	          discount = self.strategy.apply(order)
	          return {
	              "order_amount": order.amount,
	              "discount": discount,
	              "discount_desc": self.strategy.description(),
	              "final_price": order.amount - discount,
	          }
	  
	  # Usage
	  order = Order("Alice", 200.0, "gold")
	  
	  for strategy in [NoDiscount(), PercentageDiscount(0.15), MembershipDiscount(), HolidayDiscount()]:
	      engine = PricingEngine(strategy)
	      result = engine.calculate(order)
	      print(f"{result['discount_desc']}: ${result['final_price']:.2f}")
	  
	  # No discount: $200.00
	  # 15% discount: $170.00
	  # Membership (gold) discount: $180.00
	  # Holiday discount (max $50): $150.00
	  ```
	  
	  ```java
	  // ─── Java — OCP with interface extension ─────────────────────────────
	  interface DiscountStrategy {
	      double apply(double amount, String membership);
	      String getDescription();
	  }
	  
	  class NoDiscount implements DiscountStrategy {
	      public double apply(double amount, String m) { return 0; }
	      public String getDescription() { return "No discount"; }
	  }
	  
	  class PercentageDiscount implements DiscountStrategy {
	      private double rate;
	      PercentageDiscount(double rate) { this.rate = rate; }
	      public double apply(double amount, String m) { return amount * rate; }
	      public String getDescription() { return rate * 100 + "% discount"; }
	  }
	  
	  class MembershipDiscount implements DiscountStrategy {
	      public double apply(double amount, String membership) {
	          return switch (membership) {
	              case "silver" -> amount * 0.05;
	              case "gold" -> amount * 0.10;
	              case "platinum" -> amount * 0.20;
	              default -> 0;
	          };
	      }
	      public String getDescription() { return "Membership discount"; }
	  }
	  
	  // NEW strategy — added without modifying PricingEngine
	  class HolidayDiscount implements DiscountStrategy {
	      public double apply(double amount, String m) { return Math.min(amount * 0.25, 50); }
	      public String getDescription() { return "Holiday discount (max $50)"; }
	  }
	  
	  class PricingEngine {
	      private DiscountStrategy strategy;
	      PricingEngine(DiscountStrategy s) { this.strategy = s; }
	      double calculate(double amount, String membership) {
	          return amount - strategy.apply(amount, membership);
	      }
	      void printResult(double amount, String membership) {
	          System.out.printf("%s: $%.2f%n", strategy.getDescription(), calculate(amount, membership));
	      }
	  }
	  
	  class OCPDemo {
	      public static void main(String[] args) {
	          double amount = 200;
	          String membership = "gold";
	          for (var strategy : new DiscountStrategy[]{
	                  new NoDiscount(), new PercentageDiscount(0.15),
	                  new MembershipDiscount(), new HolidayDiscount()}) {
	              new PricingEngine(strategy).printResult(amount, membership);
	          }
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript — OCP via class extension ─────────────────────────────
	  class DiscountStrategy {
	      apply(amount, membership) { throw new Error("apply() must be implemented"); }
	      get description() { throw new Error("description must be implemented"); }
	  }
	  
	  class NoDiscount extends DiscountStrategy {
	      apply() { return 0; }
	      get description() { return "No discount"; }
	  }
	  
	  class PercentageDiscount extends DiscountStrategy {
	      constructor(rate) { super(); this.rate = rate; }
	      apply(amount) { return amount * this.rate; }
	      get description() { return `${this.rate * 100}% discount`; }
	  }
	  
	  class MembershipDiscount extends DiscountStrategy {
	      apply(amount, membership) {
	          const rates = { silver: 0.05, gold: 0.10, platinum: 0.20 };
	          return amount * (rates[membership] ?? 0);
	      }
	      get description() { return "Membership discount"; }
	  }
	  
	  // New strategy — no modification to PricingEngine
	  class HolidayDiscount extends DiscountStrategy {
	      apply(amount) { return Math.min(amount * 0.25, 50); }
	      get description() { return "Holiday discount (max $50)"; }
	  }
	  
	  class PricingEngine {
	      constructor(strategy) { this.strategy = strategy; }
	      calculate(amount, membership) {
	          const disc = this.strategy.apply(amount, membership);
	          return { discount: disc, final: amount - disc, desc: this.strategy.description };
	      }
	  }
	  
	  const order = { amount: 200, membership: "gold" };
	  for (const s of [new NoDiscount(), new PercentageDiscount(0.15), new MembershipDiscount(), new HolidayDiscount()]) {
	      const r = new PricingEngine(s).calculate(order.amount, order.membership);
	      console.log(`${r.desc}: $${r.final.toFixed(2)}`);
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- **Open for extension** — new behavior can be added by writing new code (new classes/functions).
	- **Closed for modification** — existing working code is not touched when adding new features.
	- Implemented via **polymorphism**, **abstract classes**, **interfaces**, and **strategy/plugin patterns**.
	- The key: define **stable abstractions** (interfaces) that vary points implement — the core code never sees the concrete type.
	- Closely related to: [[Strategy Pattern]], [[Polymorphism]], [[Dependency Inversion Principle (DIP)]]

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Martin Fowler — OCP](https://martinfowler.com/ieeeSoftware/openClosed.pdf)
		- [Refactoring Guru — OCP](https://refactoring.guru/design-patterns)
