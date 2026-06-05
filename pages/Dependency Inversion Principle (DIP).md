---
seoTitle: Dependency Inversion Principle (DIP) – Complete Guide | SOLID, Depend on Abstractions
description: "Deep dive into the Dependency Inversion Principle (DIP) from SOLID. Covers high-level vs low-level modules, depending on abstractions, dependency injection, and examples in Python, Java, and JavaScript."
keywords: "Dependency Inversion Principle, DIP, SOLID, depend on abstractions, dependency injection, inversion of control, IoC, high-level module, low-level module, Python DIP, Java DIP, VR-Rathod, Code-Note"
displayTitle: Dependency Inversion Principle (DIP)
treeTitle: DSA - OOP - Dependency Inversion Principle (DIP)
---

> [!info] What is the Dependency Inversion Principle?
> The **Dependency Inversion Principle (DIP)** — the **D** in [[SOLID]] — has two rules:
> 1. **High-level modules should not depend on low-level modules.** Both should depend on **abstractions**.
> 2. **Abstractions should not depend on details.** Details (concrete implementations) should depend on abstractions.
> This decouples business logic from infrastructure concerns.

- # Explanation
  collapsed:: true
	- ## What is "Dependency Inversion"?
	  collapsed:: true
		- Traditional (non-DIP): `UserService` (high-level) directly creates and uses `MySQLDatabase` (low-level). Change the DB → rewrite UserService.
		- With DIP: Both `UserService` and `MySQLDatabase` depend on a `Database` abstraction (interface). The concrete database can be swapped without touching UserService.
		- ```
		  WITHOUT DIP (bad):
		  UserService → MySQLDatabase
		  (high-level depends on low-level — tightly coupled)
		  
		  WITH DIP (good):
		  UserService → IDatabase (abstraction)
		       ↑
		  MySQLDatabase (details depend on abstraction)
		  PostgresDatabase (also depends on IDatabase)
		  (both high-level and low-level depend on abstraction)
		  ```
	-
	- ## Real-World Analogy
	  collapsed:: true
		- A **lamp** 💡 doesn't depend on a specific power plant. It depends on the **standard electrical socket** (abstraction). Whether the power comes from coal, solar, or nuclear doesn't matter to the lamp. The socket is the abstraction both sides depend on.
	-
	- ## How Dependency Injection Implements DIP
	  collapsed:: true
		- **Dependency Injection (DI)** is the mechanism: instead of creating dependencies inside a class, **inject them from outside**. This way the high-level class never knows the concrete type.
		- ```
		  # Without DI (violation):       class UserService:
		                                       def __init__(self):
		                                           self.db = MySQLDatabase()  ← hard dependency
		  
		  # With DI (DIP-compliant):      class UserService:
		                                       def __init__(self, db: IDatabase):  ← injected
		                                           self.db = db
		  ```
- # Implementation
  collapsed:: true
	- > [!note] A `NotificationService` that works with any notifier backend — Email, SMS, Push — all swappable via DIP.
	  > Languages: [[Python]] · [[Java]] · [[Java Script]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python — DIP via ABC + constructor injection ─────────────────────
	  from abc import ABC, abstractmethod
	  from dataclasses import dataclass
	  
	  # ── Abstraction (the interface both sides depend on) ───
	  class MessageSender(ABC):
	      @abstractmethod
	      def send(self, recipient: str, message: str) -> bool: ...
	  
	      @abstractmethod
	      def provider_name(self) -> str: ...
	  
	  # ── Low-level modules (details) ────────────────────────
	  class EmailSender(MessageSender):
	      def send(self, recipient: str, message: str) -> bool:
	          print(f"[Email] To: {recipient} | {message}")
	          return True
	      def provider_name(self) -> str: return "SMTP Email"
	  
	  class SMSSender(MessageSender):
	      def send(self, recipient: str, message: str) -> bool:
	          print(f"[SMS] To: {recipient} | {message[:160]}")
	          return True
	      def provider_name(self) -> str: return "Twilio SMS"
	  
	  class PushSender(MessageSender):
	      def send(self, recipient: str, message: str) -> bool:
	          print(f"[Push] Token: {recipient[:12]}... | {message}")
	          return True
	      def provider_name(self) -> str: return "Firebase Push"
	  
	  # ── High-level module (business logic) ────────────────
	  @dataclass
	  class NotificationService:
	      """High-level module — depends ONLY on MessageSender abstraction."""
	      _sender: MessageSender
	  
	      def notify(self, recipient: str, message: str) -> None:
	          success = self._sender.send(recipient, message)
	          status = "✅" if success else "❌"
	          print(f"  {status} Sent via {self._sender.provider_name()}")
	  
	      def notify_bulk(self, recipients: list[str], message: str) -> None:
	          print(f"Broadcasting to {len(recipients)} recipients...")
	          for r in recipients:
	              self.notify(r, message)
	  
	  # ── Dependency injection — high-level + low-level ──────
	  # Swap backends without changing NotificationService at all
	  email_notifier = NotificationService(EmailSender())
	  sms_notifier   = NotificationService(SMSSender())
	  push_notifier  = NotificationService(PushSender())
	  
	  email_notifier.notify("alice@example.com", "Your order shipped!")
	  sms_notifier.notify("+1-555-0100", "Verification code: 1234")
	  push_notifier.notify("device_token_abc123xyz", "New message!")
	  
	  # ── Test with a mock — DIP makes testing trivial! ─────
	  class MockSender(MessageSender):
	      def __init__(self): self.sent: list[tuple[str, str]] = []
	      def send(self, r, m) -> bool:
	          self.sent.append((r, m)); return True
	      def provider_name(self) -> str: return "MockSender"
	  
	  mock = MockSender()
	  svc = NotificationService(mock)
	  svc.notify("test@example.com", "Test message")
	  assert len(mock.sent) == 1                            # ✅ verified
	  assert mock.sent[0] == ("test@example.com", "Test message")
	  print("All mock assertions passed!")
	  ```
	  
	  ```java
	  // ─── Java — DIP via interface + constructor injection ─────────────────
	  interface MessageSender {
	      boolean send(String recipient, String message);
	      String getProviderName();
	  }
	  
	  class EmailSender implements MessageSender {
	      public boolean send(String r, String m) { System.out.println("[Email] " + r + ": " + m); return true; }
	      public String getProviderName() { return "SMTP Email"; }
	  }
	  
	  class SMSSender implements MessageSender {
	      public boolean send(String r, String m) { System.out.println("[SMS] " + r + ": " + m); return true; }
	      public String getProviderName() { return "Twilio SMS"; }
	  }
	  
	  // High-level module — depends on interface, not concrete class
	  class NotificationService {
	      private final MessageSender sender;  // inject abstraction
	  
	      NotificationService(MessageSender sender) { this.sender = sender; }
	  
	      void notify(String recipient, String message) {
	          boolean ok = sender.send(recipient, message);
	          System.out.println("  " + (ok ? "✅" : "❌") + " via " + sender.getProviderName());
	      }
	  }
	  
	  // Mock for testing
	  class MockSender implements MessageSender {
	      int callCount = 0;
	      public boolean send(String r, String m) { callCount++; return true; }
	      public String getProviderName() { return "Mock"; }
	  }
	  
	  class DIPDemo {
	      public static void main(String[] args) {
	          new NotificationService(new EmailSender()).notify("alice@ex.com", "Shipped!");
	          new NotificationService(new SMSSender()).notify("+1-555-0100", "Code: 1234");
	  
	          // Test with mock
	          MockSender mock = new MockSender();
	          NotificationService svc = new NotificationService(mock);
	          svc.notify("test@ex.com", "Test");
	          assert mock.callCount == 1 : "Expected 1 call";
	          System.out.println("Mock test passed!");
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript — DIP via constructor injection ───────────────────────
	  class EmailSender {
	      send(recipient, message) { console.log(`[Email] ${recipient}: ${message}`); return true; }
	      get providerName() { return "SMTP Email"; }
	  }
	  
	  class SMSSender {
	      send(recipient, message) { console.log(`[SMS] ${recipient}: ${message}`); return true; }
	      get providerName() { return "Twilio SMS"; }
	  }
	  
	  // High-level module — injected with ANY sender (duck typing)
	  class NotificationService {
	      constructor(sender) { this.sender = sender; }
	  
	      notify(recipient, message) {
	          const ok = this.sender.send(recipient, message);
	          console.log(`  ${ok ? "✅" : "❌"} via ${this.sender.providerName}`);
	      }
	  }
	  
	  // Swap backends freely
	  new NotificationService(new EmailSender()).notify("alice@ex.com", "Order shipped!");
	  new NotificationService(new SMSSender()).notify("+1-555-0100", "Code: 1234");
	  
	  // Mock for testing
	  const mockSender = { calls: [], send(r, m) { this.calls.push({r, m}); return true; }, providerName: "Mock" };
	  const svc = new NotificationService(mockSender);
	  svc.notify("test@ex.com", "Test");
	  console.assert(mockSender.calls.length === 1, "Expected 1 call");
	  console.log("Mock test passed!");
	  ```
	  
	  :::
- # Key Takeaways
  collapsed:: true
	- **High-level code depends on abstractions** (interfaces/ABCs), not concrete low-level classes.
	- **Dependency Injection** is the mechanism that implements DIP — pass dependencies from outside.
	- DIP makes code **testable** — swap real implementations for mocks/stubs at test time.
	- DIP makes code **flexible** — swap databases, email providers, payment gateways without touching business logic.
	- Closely related to: [[Interface]], [[Strategy Pattern]], [[Open Closed Principle (OCP)]], [[Single Responsibility Principle (SRP)]]
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Martin Fowler — Dependency Injection](https://martinfowler.com/articles/injection.html)
		- [Refactoring Guru — DIP](https://refactoring.guru/solid)