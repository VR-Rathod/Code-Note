---
seoTitle: Loose Coupling and High Cohesion in OOP – Complete Guide | Clean Architecture Principles
description: "Deep dive into Loose Coupling and High Cohesion — two core OOP design principles. Covers what coupling and cohesion are, how to measure them, how to achieve loose coupling and high cohesion, and real-world examples."
keywords: "loose coupling, high cohesion, OOP, coupling, cohesion, clean architecture, design principles, dependency injection, single responsibility, VR-Rathod, Code-Note"
displayTitle: Loose Coupling and High Cohesion
treeTitle: DSA - OOP - Loose Coupling and High Cohesion
---

> [!info] What are Coupling and Cohesion?
> - **Coupling** measures how **dependent** one module/class is on another. **Loose coupling** = classes know little about each other → easy to change independently.
> - **Cohesion** measures how **focused** a class or module is on a single purpose. **High cohesion** = all parts of a class serve one clear purpose → easy to understand and maintain.
> The goal: **Low coupling + High cohesion = Clean, maintainable architecture**.

- # Coupling Explained
  collapsed:: true
	- ## Types of Coupling (Worst to Best)
	  collapsed:: true
		- | Type | Description | Example |
		  |---|---|---|
		  | **Content coupling** ❌ | One module modifies internals of another | Directly modifying another class's private fields |
		  | **Common coupling** ❌ | Two modules share global data | Global variable both classes read/write |
		  | **Control coupling** ⚠️ | One passes control flags to another | `do_work(is_admin=True)` — changes internal flow |
		  | **External coupling** ⚠️ | Both depend on external format/protocol | Two services both parse the same CSV format |
		  | **Data coupling** ✅ | Modules share only necessary data | Pass only needed parameters — no flags |
		  | **Message coupling** ✅ | Communicate via well-defined messages/interfaces | Dependency injection via interface |
	-
	- ## What Tight Coupling Looks Like
	  collapsed:: true
		- ```python
		  # ❌ Tight coupling
		  class ReportService:
		      def generate(self, user_id: int):
		          db = MySQLDatabase("localhost", "root", "password", "mydb")  # tight!
		          user = db.query(f"SELECT * FROM users WHERE id={user_id}")
		          emailer = SmtpEmailSender("smtp.gmail.com", 587, "user@gmail.com")  # tight!
		          emailer.send(user.email, "Report", f"Hello {user.name}")
		  
		  # To test ReportService, you MUST have MySQL + Gmail SMTP running!
		  # To change DB to PostgreSQL, you MUST modify ReportService!
		  # ReportService knows too much about too many things — TIGHT coupling.
		  ```
- # Cohesion Explained
  collapsed:: true
	- ## Types of Cohesion (Worst to Best)
	  collapsed:: true
		- | Type | Description |
		  |---|---|
		  | **Coincidental** ❌ | Parts grouped arbitrarily — `MiscUtils` class |
		  | **Logical** ⚠️ | Parts do similar things but are unrelated — `FileUtils` with unrelated file ops |
		  | **Temporal** ⚠️ | Parts run at the same time — `onStartup()` mixing DB init + cache warm + email |
		  | **Sequential** 🟡 | Output of one part feeds the next |
		  | **Communicational** 🟡 | Parts operate on the same data |
		  | **Functional** ✅ | All parts serve ONE well-defined purpose — the goal |
	-
	- ## What Low Cohesion Looks Like
	  collapsed:: true
		- ```python
		  # ❌ Low cohesion — UserManager does too many unrelated things
		  class UserManager:
		      def create_user(self, name, email): ...
		      def send_email(self, to, subject, body): ...  # belongs in EmailService
		      def generate_pdf_report(self, user_id): ...   # belongs in ReportService
		      def hash_password(self, password): ...         # belongs in AuthService
		      def format_date(self, timestamp): ...          # belongs in DateUtils
		  # These methods have nothing to do with each other — low cohesion!
		  ```
- # Implementation — Before & After
  collapsed:: true
	- > [!note] Refactoring a tight-coupled, low-cohesion `OrderProcessor` to loose-coupled, high-cohesion design.
	  > Languages: [[Python]] · [[Java]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python — Loose Coupling + High Cohesion ──────────────────────────
	  from abc import ABC, abstractmethod
	  from dataclasses import dataclass
	  from decimal import Decimal
	  
	  # ── High Cohesion: each class does ONE thing ───────────
	  
	  @dataclass
	  class Order:
	      order_id: int
	      customer_email: str
	      items: list[tuple[str, Decimal]]
	  
	      @property
	      def total(self) -> Decimal:
	          return sum(price for _, price in self.items)
	  
	  
	  # ── Loose Coupling: depend on abstractions ─────────────
	  class PaymentGateway(ABC):
	      @abstractmethod
	      def charge(self, email: str, amount: Decimal) -> str: ...  # returns transaction_id
	  
	  class EmailNotifier(ABC):
	      @abstractmethod
	      def send(self, to: str, subject: str, body: str) -> None: ...
	  
	  class OrderRepository(ABC):
	      @abstractmethod
	      def save(self, order: Order) -> None: ...
	      @abstractmethod
	      def find_by_id(self, order_id: int) -> "Order | None": ...
	  
	  
	  # ── Low-level modules (details) ────────────────────────
	  class StripeGateway(PaymentGateway):
	      def charge(self, email: str, amount: Decimal) -> str:
	          print(f"[Stripe] Charging ${amount} to {email}")
	          return f"txn_stripe_{id(self)}"
	  
	  class SendgridEmailer(EmailNotifier):
	      def send(self, to: str, subject: str, body: str) -> None:
	          print(f"[Sendgrid] Email to {to}: {subject}")
	  
	  class InMemoryOrderRepository(OrderRepository):
	      def __init__(self): self._store: dict[int, Order] = {}
	      def save(self, order: Order) -> None: self._store[order.order_id] = order
	      def find_by_id(self, order_id: int) -> "Order | None": return self._store.get(order_id)
	  
	  
	  # ── High-level module — orchestrates, doesn't know details ─
	  @dataclass
	  class OrderProcessor:
	      """High cohesion: ONLY does order processing workflow.
	         Loose coupling: depends on abstractions, not concrete classes."""
	      payment: PaymentGateway
	      notifier: EmailNotifier
	      repository: OrderRepository
	  
	      def process(self, order: Order) -> str:
	          txn_id = self.payment.charge(order.customer_email, order.total)
	          self.repository.save(order)
	          self.notifier.send(
	              order.customer_email,
	              "Order Confirmed",
	              f"Order #{order.order_id} confirmed. Total: ${order.total}"
	          )
	          return txn_id
	  
	  
	  # ── Assemble (wire together) ───────────────────────────
	  processor = OrderProcessor(
	      payment=StripeGateway(),
	      notifier=SendgridEmailer(),
	      repository=InMemoryOrderRepository(),
	  )
	  
	  order = Order(42, "alice@example.com", [("Widget", Decimal("50")), ("Gadget", Decimal("30"))])
	  txn = processor.process(order)
	  print(f"Transaction: {txn}")
	  
	  # Testing is trivial — inject mocks!
	  class MockPayment(PaymentGateway):
	      def __init__(self): self.charges = []
	      def charge(self, email, amount) -> str:
	          self.charges.append((email, amount)); return "txn_mock"
	  
	  class MockEmailer(EmailNotifier):
	      def __init__(self): self.sent = []
	      def send(self, to, subject, body) -> None: self.sent.append((to, subject))
	  
	  mock_payment = MockPayment()
	  mock_email = MockEmailer()
	  test_processor = OrderProcessor(mock_payment, mock_email, InMemoryOrderRepository())
	  test_processor.process(order)
	  assert len(mock_payment.charges) == 1   # ✅ verified payment called
	  assert len(mock_email.sent) == 1         # ✅ verified email sent
	  print("All tests passed!")
	  ```
	  
	  ```java
	  // ─── Java — Loose Coupling via Dependency Injection ──────────────────
	  import java.math.BigDecimal;
	  
	  // Abstractions (interfaces)
	  interface PaymentGateway { String charge(String email, BigDecimal amount); }
	  interface EmailNotifier { void send(String to, String subject, String body); }
	  
	  // Low-level implementations
	  class StripeGateway implements PaymentGateway {
	      public String charge(String email, BigDecimal amount) {
	          System.out.println("[Stripe] Charging $" + amount + " to " + email);
	          return "txn_stripe_001";
	      }
	  }
	  class SendgridEmailer implements EmailNotifier {
	      public void send(String to, String subject, String body) {
	          System.out.println("[Sendgrid] Email to " + to + ": " + subject);
	      }
	  }
	  
	  // High-level module — depends on interfaces (loose coupling)
	  class OrderProcessor {
	      private final PaymentGateway payment;
	      private final EmailNotifier notifier;
	  
	      OrderProcessor(PaymentGateway payment, EmailNotifier notifier) {
	          this.payment = payment;
	          this.notifier = notifier;
	      }
	  
	      String process(int orderId, String email, BigDecimal total) {
	          String txn = payment.charge(email, total);
	          notifier.send(email, "Order Confirmed", "Order #" + orderId + " confirmed");
	          return txn;
	      }
	  }
	  
	  class CouplingDemo {
	      public static void main(String[] args) {
	          OrderProcessor processor = new OrderProcessor(
	              new StripeGateway(), new SendgridEmailer()
	          );
	          String txn = processor.process(42, "alice@ex.com", new BigDecimal("80"));
	          System.out.println("Transaction: " + txn);
	      }
	  }
	  ```
	  
	  :::
- # Quick Reference — Coupling & Cohesion Quality Grid
  collapsed:: true
	- ```
	  ┌──────────────────────────────────────────────────────────────┐
	  │              HIGH COHESION                                   │
	  │         (each class does one thing well)                     │
	  │                                                              │
	  │  Tight Coupling  │          IDEAL ✅                        │
	  │  (hard to test,  │  Low Coupling + High Cohesion            │
	  │  change, reuse)  │  Testable, flexible, maintainable        │
	  │──────────────────┼──────────────────────────────────────────│
	  │  Worst case ❌   │  Loose Coupling                          │
	  │  Tight coupling  │  (easy to swap dependencies)             │
	  │  + Low cohesion  │  But low cohesion means messy classes    │
	  │         LOW COHESION                                         │
	  └──────────────────────────────────────────────────────────────┘
	  ```
- # Key Takeaways
  collapsed:: true
	- **Loose coupling**: classes interact via abstractions (interfaces), not concrete implementations.
	- **High cohesion**: each class has one focused purpose (links to [[Single Responsibility Principle SRP]]).
	- Achieve both via: **Dependency Injection**, **Interfaces/ABCs**, **separating concerns**.
	- Loose + Cohesive code is: **testable** (mock dependencies), **flexible** (swap implementations), **readable** (small, focused classes).
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Martin Fowler — Coupling vs Cohesion](https://martinfowler.com/ieeeSoftware/coupling.pdf)
		- [Wikipedia — Cohesion (computer science)](https://en.wikipedia.org/wiki/Cohesion_(computer_science))