---
seoTitle: Dynamic Binding in OOP – Complete In-Depth Guide | Late Binding, Virtual Dispatch, vtable
description: "Deep dive into Dynamic Binding (Late Binding) in OOP. Covers runtime method resolution, vtable mechanism, early vs late binding, virtual functions, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "dynamic binding, late binding, early binding, virtual dispatch, vtable, runtime polymorphism, virtual function, Python dynamic binding, Java dynamic dispatch, C++ vtable, VR-Rathod, Code-Note"
displayTitle: Dynamic Binding (Late Binding)
treeTitle: DSA - OOP - Dynamic Binding
---

> [!info] What is Dynamic Binding?
> **Dynamic Binding** (also called **Late Binding**) is the process of resolving **which method implementation to call at runtime**, based on the actual type of the object — not the declared (compile-time) type of the reference. It is what makes [[Polymorphism]] work. The opposite is **Static (Early) Binding**, where the method is resolved at compile time.

- # Explanation
  collapsed:: true
	- ## Early Binding vs Late Binding
	  collapsed:: true
		- | | Early Binding (Static) | Late Binding (Dynamic) |
		  |---|---|---|
		  | **When resolved** | Compile time | Runtime |
		  | **Based on** | Declared type of reference | Actual type of object |
		  | **Performance** | Faster (no lookup) | Slightly slower (vtable/method table lookup) |
		  | **Mechanism** | Function calls, overloading | Virtual functions, overriding |
		  | **Flexibility** | Less — fixed at compile time | More — swappable at runtime |
		  | **Example** | `int add(int, int)` resolved by compiler | `shape.area()` resolved at runtime |
	-
	- ## Real-World Analogy
	  collapsed:: true
		- **Static binding** = A plane ticket with a fixed seat printed on it. You always sit in the same seat — decided at booking time (compile time).
		- **Dynamic binding** = A flexible seat assignment that is decided at boarding time (runtime) based on which seat is available, your status, etc. — the same request (`"assign me a seat"`) produces different results based on the actual situation.
	-
	- ## How It Works — The vtable (C++)
	  collapsed:: true
		- In C++, dynamic dispatch is implemented via a **virtual table (vtable)** — a hidden table of function pointers per class.
		- ```
		  Class Shape:
		  vtable:
		    [0] → Shape::area()           ← default
		    [1] → Shape::perimeter()
		  
		  Class Circle (inherits Shape):
		  vtable:
		    [0] → Circle::area()          ← overridden!
		    [1] → Circle::perimeter()     ← overridden!
		  
		  Shape* s = new Circle(5);
		  s->area()
		    ↓
		  s's vtable → slot [0] → Circle::area()  ← runtime dispatch!
		  ```
		- Each object holds a hidden **vptr** (virtual pointer) pointing to its class's vtable. When you call a virtual method, the runtime follows the vptr → vtable → correct function.
- # Implementation
  collapsed:: true
	- > [!note] Dynamic binding demonstrated via a `Notification` system — `EmailNotifier`, `SMSNotifier`, `PushNotifier` resolved at runtime.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python — Dynamic binding via method resolution order (MRO) ───────
	  # Python is dynamically typed — ALL method calls are late-bound by default
	  from abc import ABC, abstractmethod
	  
	  class Notifier(ABC):
	      def __init__(self, recipient: str):
	          self.recipient = recipient
	  
	      @abstractmethod
	      def send(self, message: str) -> str: ...
	  
	      def notify(self, message: str) -> None:
	          # Dynamic binding: self.send() resolves to the ACTUAL subclass at runtime
	          result = self.send(message)
	          print(f"[{type(self).__name__}] {result}")
	  
	  
	  class EmailNotifier(Notifier):
	      def send(self, message: str) -> str:
	          return f"Email to {self.recipient}: {message}"
	  
	  class SMSNotifier(Notifier):
	      def send(self, message: str) -> str:
	          return f"SMS to {self.recipient}: {message[:160]}"
	  
	  class PushNotifier(Notifier):
	      def send(self, message: str) -> str:
	          return f"Push notification → {self.recipient}: {message}"
	  
	  
	  # All stored as 'Notifier' references — actual type unknown at compile time
	  notifiers: list[Notifier] = [
	      EmailNotifier("alice@example.com"),
	      SMSNotifier("+1-555-0100"),
	      PushNotifier("device_token_abc123"),
	  ]
	  
	  # Same call → different behavior at runtime (dynamic dispatch)
	  for notifier in notifiers:
	      notifier.notify("Your order has shipped!")
	  
	  # [EmailNotifier] Email to alice@example.com: Your order has shipped!
	  # [SMSNotifier]   SMS to +1-555-0100: Your order has shipped!
	  # [PushNotifier]  Push notification → device_token_abc123: Your order has shipped!
	  
	  
	  # Runtime type swapping — dynamic binding in action
	  def get_notifier(channel: str, recipient: str) -> Notifier:
	      options = {
	          "email": EmailNotifier,
	          "sms": SMSNotifier,
	          "push": PushNotifier,
	      }
	      return options[channel](recipient)
	  
	  n = get_notifier("push", "device_xyz")  # decided at runtime
	  n.notify("Payment confirmed!")
	  ```
	  
	  ```c++
	  // ─── C++ — vtable virtual dispatch ───────────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  #include <memory>
	  
	  class Notifier {
	  protected:
	      std::string recipient_;
	  public:
	      Notifier(std::string r) : recipient_(r) {}
	  
	      // virtual = dynamic binding enabled
	      virtual std::string send(const std::string& msg) const = 0;
	  
	      void notify(const std::string& msg) const {
	          // Dynamic dispatch: send() resolved via vtable at runtime
	          std::cout << "[" << typeid(*this).name() << "] " << send(msg) << "\n";
	      }
	  
	      virtual ~Notifier() {}
	  };
	  
	  class EmailNotifier : public Notifier {
	  public:
	      EmailNotifier(std::string r) : Notifier(r) {}
	      std::string send(const std::string& msg) const override {
	          return "Email to " + recipient_ + ": " + msg;
	      }
	  };
	  
	  class SMSNotifier : public Notifier {
	  public:
	      SMSNotifier(std::string r) : Notifier(r) {}
	      std::string send(const std::string& msg) const override {
	          return "SMS to " + recipient_ + ": " + msg.substr(0, 160);
	      }
	  };
	  
	  int main() {
	      // Base class pointers — actual type unknown at compile time
	      std::vector<std::unique_ptr<Notifier>> notifiers;
	      notifiers.push_back(std::make_unique<EmailNotifier>("alice@ex.com"));
	      notifiers.push_back(std::make_unique<SMSNotifier>("+1-555-0100"));
	  
	      // notify() → send() resolved via vtable at RUNTIME
	      for (const auto& n : notifiers) {
	          n->notify("Your order has shipped!");
	      }
	  }
	  ```
	  
	  ```java
	  // ─── Java — Dynamic method dispatch ──────────────────────────────────
	  import java.util.*;
	  
	  abstract class Notifier {
	      protected String recipient;
	      Notifier(String recipient) { this.recipient = recipient; }
	  
	      public abstract String send(String message);
	  
	      public final void notify(String message) {
	          // Dynamic dispatch: Java always uses runtime type for non-final methods
	          String result = send(message);  // resolved at runtime
	          System.out.println("[" + getClass().getSimpleName() + "] " + result);
	      }
	  }
	  
	  class EmailNotifier extends Notifier {
	      EmailNotifier(String r) { super(r); }
	      @Override public String send(String msg) {
	          return "Email to " + recipient + ": " + msg;
	      }
	  }
	  
	  class SMSNotifier extends Notifier {
	      SMSNotifier(String r) { super(r); }
	      @Override public String send(String msg) {
	          return "SMS to " + recipient + ": " + msg.substring(0, Math.min(160, msg.length()));
	      }
	  }
	  
	  class DynamicBindingDemo {
	      public static void main(String[] args) {
	          List<Notifier> notifiers = List.of(
	              new EmailNotifier("alice@ex.com"),
	              new SMSNotifier("+1-555-0100")
	          );
	          for (Notifier n : notifiers) {
	              n.notify("Your order has shipped!");
	          }
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript — Prototype chain dispatch ────────────────────────────
	  // JS uses prototype-based dynamic dispatch — always late-bound
	  class Notifier {
	      constructor(recipient) { this.recipient = recipient; }
	      send(message) { throw new Error("send() must be overridden"); }
	      notify(message) {
	          // this.send() is resolved at runtime via prototype chain
	          const result = this.send(message);
	          console.log(`[${this.constructor.name}] ${result}`);
	      }
	  }
	  
	  class EmailNotifier extends Notifier {
	      send(msg) { return `Email to ${this.recipient}: ${msg}`; }
	  }
	  
	  class SMSNotifier extends Notifier {
	      send(msg) { return `SMS to ${this.recipient}: ${msg.slice(0, 160)}`; }
	  }
	  
	  const notifiers = [
	      new EmailNotifier("alice@example.com"),
	      new SMSNotifier("+1-555-0100"),
	  ];
	  
	  notifiers.forEach(n => n.notify("Your order has shipped!"));
	  
	  // Runtime type change — truly dynamic
	  let current = new EmailNotifier("bob@ex.com");
	  current.notify("Hello!");    // EmailNotifier
	  current = new SMSNotifier("+44-20-1234"); // swap at runtime
	  current.notify("Hello!");    // SMSNotifier — different dispatch
	  ```
	  
	  ```csharp
	  // ─── C# — virtual method dispatch ────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  
	  abstract class Notifier {
	      protected string Recipient;
	      protected Notifier(string recipient) { Recipient = recipient; }
	  
	      public abstract string Send(string message);
	  
	      public void Notify(string message) {
	          string result = Send(message);  // dynamic dispatch via vtable
	          Console.WriteLine($"[{GetType().Name}] {result}");
	      }
	  }
	  
	  class EmailNotifier : Notifier {
	      public EmailNotifier(string r) : base(r) {}
	      public override string Send(string msg) =>
	          $"Email to {Recipient}: {msg}";
	  }
	  
	  class SMSNotifier : Notifier {
	      public SMSNotifier(string r) : base(r) {}
	      public override string Send(string msg) =>
	          $"SMS to {Recipient}: {msg[..Math.Min(160, msg.Length)]}";
	  }
	  
	  class Program {
	      static void Main() {
	          var notifiers = new List<Notifier> {
	              new EmailNotifier("alice@ex.com"),
	              new SMSNotifier("+1-555-0100"),
	          };
	          foreach (var n in notifiers) n.Notify("Your order has shipped!");
	      }
	  }
	  ```
	  
	  :::
- # Key Takeaways
  collapsed:: true
	- **Dynamic binding** = method resolved at **runtime** based on actual object type.
	- **Python** — all method calls are dynamically bound by default (no static typing at runtime).
	- **C++** — only `virtual` methods are dynamically bound; non-virtual uses early binding (faster).
	- **Java** — all non-static, non-final, non-private methods are dynamically dispatched.
	- **Mechanism** — C++ uses vtable/vptr; Java/C# use method dispatch tables; Python uses MRO.
	- Dynamic binding is **what makes polymorphism work** — same base reference, different runtime behavior.
	- `final` (Java) / `sealed` / non-`virtual` disables dynamic binding for performance-critical code.
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Python Data Model — Method Resolution](https://docs.python.org/3/reference/datamodel.html)
		- [C++ vtable internals](https://en.cppreference.com/w/cpp/language/virtual)
		- [Java Dynamic Dispatch](https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html)