---
seoTitle: Strategy Pattern in OOP – Complete In-Depth Guide | Behavioral Design Pattern
description: "Deep dive into the Strategy design pattern. Covers intent, participants, UML diagram, how to swap algorithms at runtime, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "strategy pattern, behavioral design pattern, algorithm swap, policy pattern, GoF, Python strategy, Java strategy, C++ strategy, dependency injection strategy, VR-Rathod, Code-Note"
displayTitle: Strategy Pattern
---

> [!info] What is the Strategy Pattern?
> The **Strategy Pattern** is a **behavioral design pattern** that defines a **family of algorithms**, encapsulates each one in a class, and makes them **interchangeable at runtime**. The client selects the strategy to use, decoupling the algorithm from the code that uses it. It follows the **Open/Closed Principle** — open for extension (new strategies), closed for modification.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of **GPS navigation** 🗺️. You can choose your route strategy:
		  - **Fastest** (highway, tolls allowed)
		  - **Shortest** (minimum distance)
		  - **Eco** (fuel-efficient, avoids traffic)
		  - **No tolls** (avoid toll roads)
		- The navigation app (context) uses whichever strategy you pick. You can switch mid-journey. The app's core code doesn't change — only the routing algorithm swaps.
	-
	- ## Participants
	  collapsed:: true
		- | Role | Responsibility |
		  |---|---|
		  | **Strategy** (interface) | Defines the algorithm interface |
		  | **Concrete Strategy** | Implements the specific algorithm |
		  | **Context** | Holds a reference to a Strategy; delegates work to it |
		  | **Client** | Selects and injects the strategy into the context |
	-
	- ## UML Structure
	  collapsed:: true
		- ```mermaid
		  classDiagram
		      class Context {
		          -strategy: Strategy
		          +setStrategy(s: Strategy)
		          +executeStrategy()
		      }
		      class Strategy {
		          <<interface>>
		          +execute(data) result
		      }
		      class ConcreteStrategyA {
		          +execute(data) result
		      }
		      class ConcreteStrategyB {
		          +execute(data) result
		      }
		      Context o--> Strategy : uses
		      Strategy <|.. ConcreteStrategyA
		      Strategy <|.. ConcreteStrategyB
		  ```

- # Implementation
  collapsed:: true
	- > [!note] A `PaymentProcessor` context with interchangeable payment strategies: Credit Card, PayPal, Crypto.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  from abc import ABC, abstractmethod
	  from dataclasses import dataclass
	  
	  # ── Strategy interface ─────────────────────────────────
	  class PaymentStrategy(ABC):
	      @abstractmethod
	      def pay(self, amount: float) -> str: ...
	  
	      @abstractmethod
	      def get_name(self) -> str: ...
	  
	  # ── Concrete strategies ────────────────────────────────
	  @dataclass
	  class CreditCardStrategy(PaymentStrategy):
	      card_number: str
	      cvv: str
	      expiry: str
	  
	      def pay(self, amount: float) -> str:
	          return f"Charged ${amount:.2f} to card ending {self.card_number[-4:]}"
	  
	      def get_name(self) -> str: return "Credit Card"
	  
	  @dataclass
	  class PayPalStrategy(PaymentStrategy):
	      email: str
	      password: str
	  
	      def pay(self, amount: float) -> str:
	          return f"PayPal payment of ${amount:.2f} from account {self.email}"
	  
	      def get_name(self) -> str: return "PayPal"
	  
	  @dataclass
	  class CryptoStrategy(PaymentStrategy):
	      wallet_address: str
	      coin: str = "BTC"
	  
	      def pay(self, amount: float) -> str:
	          return f"Sent ${amount:.2f} in {self.coin} to {self.wallet_address[:8]}..."
	  
	      def get_name(self) -> str: return f"Crypto ({self.coin})"
	  
	  # ── Context ────────────────────────────────────────────
	  class ShoppingCart:
	      def __init__(self):
	          self._items: list[tuple[str, float]] = []
	          self._strategy: PaymentStrategy | None = None
	  
	      def add_item(self, name: str, price: float) -> None:
	          self._items.append((name, price))
	  
	      def set_payment_strategy(self, strategy: PaymentStrategy) -> None:
	          self._strategy = strategy
	          print(f"Payment method set to: {strategy.get_name()}")
	  
	      def total(self) -> float:
	          return sum(price for _, price in self._items)
	  
	      def checkout(self) -> str:
	          if not self._strategy:
	              raise ValueError("No payment strategy selected!")
	          if not self._items:
	              raise ValueError("Cart is empty!")
	          result = self._strategy.pay(self.total())
	          print(f"✅ {result}")
	          self._items.clear()
	          return result
	  
	  # ── Client usage ───────────────────────────────────────
	  cart = ShoppingCart()
	  cart.add_item("Laptop", 999.99)
	  cart.add_item("Mouse", 29.99)
	  
	  # Strategy can be switched at runtime
	  cart.set_payment_strategy(CreditCardStrategy("4111111111111234", "123", "12/26"))
	  cart.checkout()
	  # Payment method set to: Credit Card
	  # ✅ Charged $1029.98 to card ending 1234
	  
	  cart.add_item("Monitor", 399.99)
	  cart.set_payment_strategy(PayPalStrategy("alice@example.com", "***"))
	  cart.checkout()
	  # ✅ PayPal payment of $399.99 from account alice@example.com
	  
	  cart.add_item("Keyboard", 89.99)
	  cart.set_payment_strategy(CryptoStrategy("1A2b3C4d5E6f7G8h9I..."))
	  cart.checkout()
	  # ✅ Sent $89.99 in BTC to 1A2b3C4d...
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <memory>
	  #include <vector>
	  
	  // ── Strategy interface ─────────────────────────────────
	  class PaymentStrategy {
	  public:
	      virtual std::string pay(double amount) const = 0;
	      virtual std::string getName() const = 0;
	      virtual ~PaymentStrategy() {}
	  };
	  
	  // ── Concrete strategies ────────────────────────────────
	  class CreditCardStrategy : public PaymentStrategy {
	      std::string last4_;
	  public:
	      CreditCardStrategy(std::string cardNum) : last4_(cardNum.substr(cardNum.size()-4)) {}
	      std::string pay(double amount) const override {
	          return "Charged $" + std::to_string(amount) + " to card ending " + last4_;
	      }
	      std::string getName() const override { return "Credit Card"; }
	  };
	  
	  class PayPalStrategy : public PaymentStrategy {
	      std::string email_;
	  public:
	      PayPalStrategy(std::string email) : email_(email) {}
	      std::string pay(double amount) const override {
	          return "PayPal $" + std::to_string(amount) + " from " + email_;
	      }
	      std::string getName() const override { return "PayPal"; }
	  };
	  
	  // ── Context ────────────────────────────────────────────
	  class ShoppingCart {
	      std::shared_ptr<PaymentStrategy> strategy_;
	      std::vector<std::pair<std::string, double>> items_;
	  public:
	      void setStrategy(std::shared_ptr<PaymentStrategy> s) {
	          strategy_ = s;
	          std::cout << "Payment set to: " << s->getName() << "\n";
	      }
	      void addItem(std::string name, double price) { items_.push_back({name, price}); }
	      double total() const {
	          double sum = 0;
	          for (const auto& [_, p] : items_) sum += p;
	          return sum;
	      }
	      void checkout() {
	          if (!strategy_) throw std::runtime_error("No strategy set");
	          std::cout << "✅ " << strategy_->pay(total()) << "\n";
	          items_.clear();
	      }
	  };
	  
	  int main() {
	      ShoppingCart cart;
	      cart.addItem("Laptop", 999.99);
	      cart.setStrategy(std::make_shared<CreditCardStrategy>("4111111111111234"));
	      cart.checkout();
	      cart.addItem("Monitor", 399.99);
	      cart.setStrategy(std::make_shared<PayPalStrategy>("alice@example.com"));
	      cart.checkout();
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  interface PaymentStrategy {
	      String pay(double amount);
	      String getName();
	  }
	  
	  class CreditCardStrategy implements PaymentStrategy {
	      private String last4;
	      CreditCardStrategy(String cardNum) { this.last4 = cardNum.substring(cardNum.length() - 4); }
	      public String pay(double amount) { return String.format("Charged $%.2f to card ending %s", amount, last4); }
	      public String getName() { return "Credit Card"; }
	  }
	  
	  class PayPalStrategy implements PaymentStrategy {
	      private String email;
	      PayPalStrategy(String email) { this.email = email; }
	      public String pay(double amount) { return String.format("PayPal $%.2f from %s", amount, email); }
	      public String getName() { return "PayPal"; }
	  }
	  
	  class ShoppingCart {
	      private PaymentStrategy strategy;
	      private List<double[]> items = new ArrayList<>();
	  
	      public void setStrategy(PaymentStrategy s) {
	          this.strategy = s;
	          System.out.println("Strategy: " + s.getName());
	      }
	      public void addItem(String name, double price) { items.add(new double[]{price}); }
	      public double total() { return items.stream().mapToDouble(i -> i[0]).sum(); }
	      public void checkout() {
	          System.out.println("✅ " + strategy.pay(total()));
	          items.clear();
	      }
	  }
	  
	  class StrategyDemo {
	      public static void main(String[] args) {
	          ShoppingCart cart = new ShoppingCart();
	          cart.addItem("Laptop", 999.99);
	          cart.setStrategy(new CreditCardStrategy("4111111111111234"));
	          cart.checkout();
	  
	          cart.addItem("Monitor", 399.99);
	          cart.setStrategy(new PayPalStrategy("alice@example.com"));
	          cart.checkout();
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  class CreditCardStrategy {
	      constructor(cardNum) { this.last4 = cardNum.slice(-4); }
	      pay(amount) { return `Charged $${amount.toFixed(2)} to card ending ${this.last4}`; }
	      get name() { return "Credit Card"; }
	  }
	  
	  class PayPalStrategy {
	      constructor(email) { this.email = email; }
	      pay(amount) { return `PayPal $${amount.toFixed(2)} from ${this.email}`; }
	      get name() { return "PayPal"; }
	  }
	  
	  class ShoppingCart {
	      #strategy = null;
	      #items = [];
	  
	      setStrategy(strategy) {
	          this.#strategy = strategy;
	          console.log(`Strategy: ${strategy.name}`);
	      }
	      addItem(name, price) { this.#items.push({ name, price }); }
	      get total() { return this.#items.reduce((s, i) => s + i.price, 0); }
	      checkout() {
	          if (!this.#strategy) throw new Error("No strategy set");
	          console.log(`✅ ${this.#strategy.pay(this.total)}`);
	          this.#items = [];
	      }
	  }
	  
	  const cart = new ShoppingCart();
	  cart.addItem("Laptop", 999.99);
	  cart.setStrategy(new CreditCardStrategy("4111111111111234"));
	  cart.checkout();
	  cart.addItem("Monitor", 399.99);
	  cart.setStrategy(new PayPalStrategy("alice@example.com"));
	  cart.checkout();
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  
	  interface IPaymentStrategy {
	      string Pay(double amount);
	      string Name { get; }
	  }
	  
	  class CreditCardStrategy : IPaymentStrategy {
	      string last4;
	      public CreditCardStrategy(string card) { last4 = card[^4..]; }
	      public string Pay(double amount) => $"Charged ${amount:F2} to card ending {last4}";
	      public string Name => "Credit Card";
	  }
	  
	  class PayPalStrategy : IPaymentStrategy {
	      string email;
	      public PayPalStrategy(string email) { this.email = email; }
	      public string Pay(double amount) => $"PayPal ${amount:F2} from {email}";
	      public string Name => "PayPal";
	  }
	  
	  class ShoppingCart {
	      IPaymentStrategy? strategy;
	      List<double> items = new();
	  
	      public void SetStrategy(IPaymentStrategy s) {
	          strategy = s;
	          Console.WriteLine($"Strategy: {s.Name}");
	      }
	      public void AddItem(string name, double price) => items.Add(price);
	      double Total => items.Sum();
	  
	      public void Checkout() {
	          Console.WriteLine($"✅ {strategy!.Pay(Total)}");
	          items.Clear();
	      }
	  
	      static void Main() {
	          var cart = new ShoppingCart();
	          cart.AddItem("Laptop", 999.99);
	          cart.SetStrategy(new CreditCardStrategy("4111111111111234"));
	          cart.Checkout();
	          cart.AddItem("Monitor", 399.99);
	          cart.SetStrategy(new PayPalStrategy("alice@example.com"));
	          cart.Checkout();
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- **Encapsulate what varies** — the algorithm — and make it swappable.
	- Eliminates long `if/elif/switch` chains for selecting behavior.
	- Follows **Open/Closed Principle** — add new strategies without touching the context.
	- Enables **runtime behavior switching** — change payment method, sort algorithm, compression format on the fly.
	- Related patterns: [[Observer Pattern]], [[Command Pattern]], [[Factory Pattern]]

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Refactoring Guru — Strategy](https://refactoring.guru/design-patterns/strategy)
		- [GoF Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
