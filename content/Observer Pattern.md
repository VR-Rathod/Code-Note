---
seoTitle: Observer Pattern in OOP – Complete In-Depth Guide | Event System, Publish-Subscribe
description: "Deep dive into the Observer design pattern. Covers event-driven systems, publisher-subscriber model, push vs pull observers, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "observer pattern, behavioral design pattern, event system, publish subscribe, listener, event-driven, GoF, Python observer, Java observer, C++ observer, VR-Rathod, Code-Note"
displayTitle: Observer Pattern
---

> [!info] What is the Observer Pattern?
> The **Observer Pattern** is a **behavioral design pattern** where an object (**Subject/Publisher**) maintains a list of dependents (**Observers/Listeners**) and **automatically notifies them when its state changes**. It enables event-driven systems and is the foundation of most UI frameworks, reactive programming, and MVC architectures.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **YouTube channel subscription** 📺. You (observer) subscribe to a channel (subject). When the channel uploads a new video (state change), YouTube automatically notifies all subscribers. You can unsubscribe anytime — the channel doesn't care who's watching.
		- | Real World | Observer Pattern |
		  |---|---|
		  | YouTube Channel | **Subject / Publisher** |
		  | Your subscription | **Observer registered** |
		  | New video uploaded | **State change → notify()** |
		  | You watching the notification | **Observer's update() called** |
		  | Unsubscribing | **Observer detached** |
	-
	- ## UML Structure
	  collapsed:: true
		- ```mermaid
		  classDiagram
		      class Subject {
		          -observers: List~Observer~
		          +attach(o: Observer)
		          +detach(o: Observer)
		          +notify()
		      }
		      class Observer {
		          <<interface>>
		          +update(data)
		      }
		      class ConcreteSubject {
		          -state
		          +setState(s)
		          +getState()
		      }
		      class ConcreteObserverA { +update(data) }
		      class ConcreteObserverB { +update(data) }
		      Subject o--> Observer
		      Subject <|-- ConcreteSubject
		      Observer <|.. ConcreteObserverA
		      Observer <|.. ConcreteObserverB
		  ```
- # Implementation
  collapsed:: true
	- > [!note] A stock price tracker — `StockMarket` notifies `Portfolio`, `AlertService`, and `DashboardDisplay` observers on price changes.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  from abc import ABC, abstractmethod
	  from dataclasses import dataclass, field
	  from typing import Any
	  
	  # ── Observer interface ─────────────────────────────────
	  class Observer(ABC):
	      @abstractmethod
	      def update(self, event: str, data: Any) -> None: ...
	  
	  # ── Subject (Publisher) ────────────────────────────────
	  class Subject:
	      def __init__(self):
	          self._observers: list[Observer] = []
	  
	      def attach(self, observer: Observer) -> None:
	          self._observers.append(observer)
	          print(f"Observer {observer.__class__.__name__} subscribed")
	  
	      def detach(self, observer: Observer) -> None:
	          self._observers.remove(observer)
	          print(f"Observer {observer.__class__.__name__} unsubscribed")
	  
	      def notify(self, event: str, data: Any) -> None:
	          for obs in self._observers:
	              obs.update(event, data)
	  
	  # ── Concrete Subject ───────────────────────────────────
	  class StockMarket(Subject):
	      def __init__(self):
	          super().__init__()
	          self._prices: dict[str, float] = {}
	  
	      def update_price(self, symbol: str, price: float) -> None:
	          old = self._prices.get(symbol)
	          self._prices[symbol] = price
	          change = ((price - old) / old * 100) if old else 0
	          self.notify("price_update", {
	              "symbol": symbol, "price": price,
	              "change_pct": change, "old_price": old
	          })
	  
	      def get_price(self, symbol: str) -> float:
	          return self._prices.get(symbol, 0.0)
	  
	  # ── Concrete Observers ─────────────────────────────────
	  class Portfolio(Observer):
	      def __init__(self, name: str):
	          self.name = name
	          self.holdings: dict[str, tuple[int, float]] = {}  # symbol → (qty, avg_price)
	          self.total_value = 0.0
	  
	      def add_holding(self, symbol: str, qty: int, buy_price: float):
	          self.holdings[symbol] = (qty, buy_price)
	  
	      def update(self, event: str, data: dict) -> None:
	          if event == "price_update":
	              symbol = data["symbol"]
	              if symbol in self.holdings:
	                  qty, buy = self.holdings[symbol]
	                  current_value = qty * data["price"]
	                  pnl = current_value - (qty * buy)
	                  print(f"  [Portfolio:{self.name}] {symbol}: ${data['price']:.2f} | "
	                        f"PnL: ${pnl:+.2f}")
	  
	  class PriceAlert(Observer):
	      def __init__(self, symbol: str, threshold: float, direction: str = "above"):
	          self.symbol = symbol
	          self.threshold = threshold
	          self.direction = direction  # "above" | "below"
	  
	      def update(self, event: str, data: dict) -> None:
	          if event == "price_update" and data["symbol"] == self.symbol:
	              price = data["price"]
	              triggered = (self.direction == "above" and price > self.threshold or
	                           self.direction == "below" and price < self.threshold)
	              if triggered:
	                  print(f"  🚨 ALERT: {self.symbol} is {self.direction} ${self.threshold}! "
	                        f"Current: ${price:.2f}")
	  
	  class Dashboard(Observer):
	      def update(self, event: str, data: dict) -> None:
	          if event == "price_update":
	              arrow = "📈" if data["change_pct"] >= 0 else "📉"
	              print(f"  [Dashboard] {data['symbol']} {arrow} ${data['price']:.2f} "
	                    f"({data['change_pct']:+.1f}%)")
	  
	  # ── Usage ──────────────────────────────────────────────
	  market = StockMarket()
	  
	  portfolio = Portfolio("Alice")
	  portfolio.add_holding("AAPL", 10, 150.0)
	  portfolio.add_holding("GOOGL", 5, 2800.0)
	  
	  alert = PriceAlert("AAPL", threshold=160.0, direction="above")
	  dashboard = Dashboard()
	  
	  market.attach(portfolio)
	  market.attach(alert)
	  market.attach(dashboard)
	  
	  print("\n--- Price Update ---")
	  market.update_price("AAPL", 162.50)
	  print("\n--- Price Update ---")
	  market.update_price("GOOGL", 2750.0)
	  print("\n--- Price Update ---")
	  market.update_price("AAPL", 155.0)
	  
	  market.detach(alert)  # Alert unsubscribed
	  market.update_price("AAPL", 175.0)  # No alert fires now
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <vector>
	  #include <string>
	  #include <map>
	  #include <memory>
	  #include <algorithm>
	  
	  class Observer {
	  public:
	      virtual void update(const std::string& symbol, double price, double changePct) = 0;
	      virtual ~Observer() {}
	  };
	  
	  class StockMarket {
	      std::vector<Observer*> observers_;
	      std::map<std::string, double> prices_;
	  public:
	      void attach(Observer* o) { observers_.push_back(o); }
	      void detach(Observer* o) {
	          observers_.erase(std::remove(observers_.begin(), observers_.end(), o), observers_.end());
	      }
	      void updatePrice(const std::string& symbol, double price) {
	          double old = prices_.count(symbol) ? prices_[symbol] : price;
	          prices_[symbol] = price;
	          double pct = old > 0 ? (price - old) / old * 100 : 0;
	          for (auto* o : observers_) o->update(symbol, price, pct);
	      }
	  };
	  
	  class Dashboard : public Observer {
	  public:
	      void update(const std::string& sym, double price, double pct) override {
	          std::cout << "[Dashboard] " << sym << " $" << price << " (" << pct << "%)\n";
	      }
	  };
	  
	  class PriceAlert : public Observer {
	      std::string sym_; double threshold_;
	  public:
	      PriceAlert(std::string sym, double t) : sym_(sym), threshold_(t) {}
	      void update(const std::string& sym, double price, double) override {
	          if (sym == sym_ && price > threshold_)
	              std::cout << "[ALERT] " << sym << " above $" << threshold_ << "! Now: $" << price << "\n";
	      }
	  };
	  
	  int main() {
	      StockMarket market;
	      Dashboard dash;
	      PriceAlert alert("AAPL", 160.0);
	      market.attach(&dash);
	      market.attach(&alert);
	      market.updatePrice("AAPL", 162.50);
	      market.updatePrice("GOOGL", 2750.0);
	      market.detach(&alert);
	      market.updatePrice("AAPL", 175.0);  // No alert
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  interface StockObserver {
	      void update(String symbol, double price, double changePct);
	  }
	  
	  class StockMarket {
	      private List<StockObserver> observers = new ArrayList<>();
	      private Map<String, Double> prices = new HashMap<>();
	  
	      public void attach(StockObserver o) { observers.add(o); }
	      public void detach(StockObserver o) { observers.remove(o); }
	  
	      public void updatePrice(String symbol, double price) {
	          double old = prices.getOrDefault(symbol, price);
	          prices.put(symbol, price);
	          double pct = (price - old) / old * 100;
	          observers.forEach(o -> o.update(symbol, price, pct));
	      }
	  }
	  
	  class Dashboard implements StockObserver {
	      public void update(String sym, double price, double pct) {
	          System.out.printf("[Dashboard] %s $%.2f (%+.1f%%)%n", sym, price, pct);
	      }
	  }
	  
	  class PriceAlert implements StockObserver {
	      private String sym; private double threshold;
	      PriceAlert(String sym, double t) { this.sym = sym; this.threshold = t; }
	      public void update(String s, double price, double pct) {
	          if (s.equals(sym) && price > threshold)
	              System.out.printf("[ALERT] %s above $%.2f! Now: $%.2f%n", sym, threshold, price);
	      }
	  }
	  
	  class ObserverDemo {
	      public static void main(String[] args) {
	          StockMarket market = new StockMarket();
	          market.attach(new Dashboard());
	          market.attach(new PriceAlert("AAPL", 160.0));
	          market.updatePrice("AAPL", 162.50);
	          market.updatePrice("GOOGL", 2750.0);
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  class EventEmitter {
	      #listeners = new Map();
	  
	      on(event, listener) {
	          if (!this.#listeners.has(event)) this.#listeners.set(event, []);
	          this.#listeners.get(event).push(listener);
	      }
	  
	      off(event, listener) {
	          const ls = this.#listeners.get(event) || [];
	          this.#listeners.set(event, ls.filter(l => l !== listener));
	      }
	  
	      emit(event, data) {
	          (this.#listeners.get(event) || []).forEach(l => l(data));
	      }
	  }
	  
	  class StockMarket extends EventEmitter {
	      #prices = {};
	  
	      updatePrice(symbol, price) {
	          const old = this.#prices[symbol] ?? price;
	          this.#prices[symbol] = price;
	          this.emit('priceUpdate', { symbol, price, changePct: (price - old) / old * 100 });
	      }
	  }
	  
	  const market = new StockMarket();
	  
	  const dashboard = ({ symbol, price, changePct }) =>
	      console.log(`[Dashboard] ${symbol} $${price.toFixed(2)} (${changePct > 0 ? '📈' : '📉'}${changePct.toFixed(1)}%)`);
	  
	  const alert = ({ symbol, price }) => {
	      if (symbol === 'AAPL' && price > 160)
	          console.log(`[ALERT] AAPL above $160! Now: $${price.toFixed(2)}`);
	  };
	  
	  market.on('priceUpdate', dashboard);
	  market.on('priceUpdate', alert);
	  
	  market.updatePrice('AAPL', 162.50);
	  market.updatePrice('GOOGL', 2750.0);
	  market.off('priceUpdate', alert);
	  market.updatePrice('AAPL', 175.0);  // No alert
	  ```
	  
	  ```csharp
	  // ─── C# — using events/delegates ─────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  
	  class PriceUpdateArgs : EventArgs {
	      public string Symbol { get; set; }
	      public double Price { get; set; }
	      public double ChangePct { get; set; }
	  }
	  
	  class StockMarket {
	      public event EventHandler<PriceUpdateArgs>? PriceUpdated;
	      private Dictionary<string, double> prices = new();
	  
	      public void UpdatePrice(string symbol, double price) {
	          double old = prices.ContainsKey(symbol) ? prices[symbol] : price;
	          prices[symbol] = price;
	          PriceUpdated?.Invoke(this, new PriceUpdateArgs {
	              Symbol = symbol, Price = price, ChangePct = (price - old) / old * 100
	          });
	      }
	  }
	  
	  class Program {
	      static void OnDashboard(object? s, PriceUpdateArgs e) =>
	          Console.WriteLine($"[Dashboard] {e.Symbol} ${e.Price:F2} ({e.ChangePct:+F1}%)");
	  
	      static void OnAlert(object? s, PriceUpdateArgs e) {
	          if (e.Symbol == "AAPL" && e.Price > 160)
	              Console.WriteLine($"[ALERT] AAPL above $160! Now: ${e.Price:F2}");
	      }
	  
	      static void Main() {
	          var market = new StockMarket();
	          market.PriceUpdated += OnDashboard;
	          market.PriceUpdated += OnAlert;
	          market.UpdatePrice("AAPL", 162.50);
	          market.UpdatePrice("GOOGL", 2750.0);
	          market.PriceUpdated -= OnAlert;
	          market.UpdatePrice("AAPL", 175.0);  // No alert
	      }
	  }
	  ```
	  
	  :::
- # Key Takeaways
  collapsed:: true
	- **Subject** maintains a list of observers; **observers** register/unregister dynamically.
	- Decouples **event producers** from **event consumers** — subject doesn't know observer internals.
	- Foundation of: **GUI event handling**, **MVC/MVP pattern**, **reactive programming** (RxJS, etc.), **game event systems**.
	- Watch out for: **memory leaks** (observers not unregistered), **notification storms** (too many observers slow things).
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Refactoring Guru — Observer](https://refactoring.guru/design-patterns/observer)
		- [GoF Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)