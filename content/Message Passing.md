---
seoTitle: Message Passing in OOP – Complete In-Depth Guide | Object Communication
description: "Deep dive into Message Passing in OOP. Covers how objects communicate by sending messages, synchronous vs asynchronous passing, method dispatch, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "message passing, OOP, object communication, method dispatch, synchronous, asynchronous, actor model, event-driven, Python, Java, C++, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Message Passing
treeTitle: DSA - OOP - Message Passing
---

> [!info] What is Message Passing?
> **Message Passing** is the mechanism by which objects communicate in OOP — one object sends a **message** to another object requesting it to perform an action. In OOP, a "message" is simply a **method call**: the sender names the method and supplies arguments; the receiver decides how to respond. It is the foundation of all inter-object collaboration.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of **restaurant ordering** 🍽️:
			- You (client object) don't cook the food yourself.
			- You send a **message** to the waiter (receiving object): `"I want pasta, medium spicy"`.
			- The waiter decides how to fulfil it — you don't know if the chef changes, the kitchen method changes, or there's a delay.
			- This is **encapsulated message passing**: the sender knows *what* to ask, not *how* it's done.
	-
	- ## Why Message Passing Matters
	  collapsed:: true
		- | Benefit | Explanation |
		  |---|---|
		  | **Decoupling** | Sender only knows the interface, not the implementation |
		  | **Polymorphism** | Same message, different handlers (duck typing, method overriding) |
		  | **Encapsulation** | Receiver controls its own state; the sender can't touch internals |
		  | **Extensibility** | Add new receivers without changing senders |
		  | **Testability** | Mock receivers easily in unit tests |
	-
	- ## Anatomy of a Message
	  collapsed:: true
		- A message has three parts:
		- ```
		  receiver.method_name(arguments)
		  ┌──────────┐ ┌──────────────┐ ┌──────────────┐
		  │ Receiver │ │ Message Name │ │  Arguments   │
		  │ (object) │ │ (method)     │ │ (parameters) │
		  └──────────┘ └──────────────┘ └──────────────┘
		  
		  Example:
		  account.deposit(500)
		   ^^^^^^^  ^^^^^^^  ^^^
		  receiver  message  arg
		  ```
	-
	- ## Synchronous vs Asynchronous Message Passing
	  collapsed:: true
		- | | Synchronous | Asynchronous |
		  |---|---|---|
		  | **Execution** | Caller **blocks** until receiver responds | Caller **continues** immediately |
		  | **Example** | Regular method call | `async/await`, callbacks, actor model |
		  | **Use case** | Simple operations, math, getters | I/O, network, long computations |
		  | **Error handling** | Exceptions propagate directly | Futures, error callbacks |
		- ```
		  Synchronous:                 Asynchronous:
		  
		  Sender ──call()──► Receiver  Sender ──send()──► Queue ──► Receiver
		         ◄──result──           Sender continues...         processes later
		  ```
- # How It Works
  collapsed:: true
	- ## Method Dispatch
	  collapsed:: true
		- When you send a message, the runtime performs **method dispatch** — finding the right method to call:
		- ```
		  animal.speak()
		  
		  Runtime lookup:
		  1. What is the actual type of `animal`? → Dog
		  2. Does Dog have a `speak()` method?    → Yes → call Dog.speak()
		  3. If not, check parent class            → Animal.speak()
		  4. If not found anywhere                 → AttributeError / NoSuchMethodError
		  ```
		- This lookup at runtime is called **dynamic dispatch** (for virtual methods) or **static dispatch** (resolved at compile time).
	-
	- ## Message Passing vs Direct Field Access
	  collapsed:: true
		- | | Message Passing | Direct Field Access |
		  |---|---|---|
		  | **Approach** | `account.get_balance()` | `account.balance` |
		  | **Encapsulation** | ✅ Preserved | ❌ Breaks encapsulation |
		  | **Validation** | ✅ Can validate inside method | ❌ No validation |
		  | **Flexibility** | ✅ Can change internals freely | ❌ Callers depend on field name |
		  | **OOP Principle** | Correct | Anti-pattern |
- # Implementation
  collapsed:: true
	- > [!note] Message passing in a banking system — objects talk only through method calls.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  # Message Passing: BankAccount communicates only via method calls
	  
	  class BankAccount:
	      def __init__(self, owner: str, balance: float = 0.0):
	          self._owner = owner          # Private state — no direct access
	          self._balance = balance
	          self._history: list[str] = []
	  
	      # Message: "deposit"
	      def deposit(self, amount: float) -> None:
	          if amount <= 0:
	              raise ValueError("Deposit must be positive")
	          self._balance += amount
	          self._history.append(f"+{amount:.2f}")
	          print(f"[{self._owner}] Deposited ${amount:.2f}. Balance: ${self._balance:.2f}")
	  
	      # Message: "withdraw"
	      def withdraw(self, amount: float) -> bool:
	          if amount > self._balance:
	              print(f"[{self._owner}] Insufficient funds.")
	              return False
	          self._balance -= amount
	          self._history.append(f"-{amount:.2f}")
	          print(f"[{self._owner}] Withdrew ${amount:.2f}. Balance: ${self._balance:.2f}")
	          return True
	  
	      # Message: "get_balance"
	      def get_balance(self) -> float:
	          return self._balance
	  
	      # Message: "transfer" — triggers messages on another object
	      def transfer(self, amount: float, target: "BankAccount") -> None:
	          if self.withdraw(amount):                   # Message to self
	              target.deposit(amount)                  # Message to another object
	              print(f"Transfer of ${amount:.2f} complete.")
	  
	  
	  class ATM:
	      """ATM only communicates via messages — never touches account internals."""
	      def process(self, account: BankAccount, action: str, amount: float) -> None:
	          if action == "deposit":
	              account.deposit(amount)           # Send "deposit" message
	          elif action == "withdraw":
	              account.withdraw(amount)          # Send "withdraw" message
	          else:
	              print(f"Unknown action: {action}")
	  
	  
	  # ── Client code ─────────────────────────────────────────────────────
	  alice = BankAccount("Alice", 1000.0)
	  bob   = BankAccount("Bob",   500.0)
	  atm   = ATM()
	  
	  atm.process(alice, "deposit", 200)    # ATM → alice.deposit(200)
	  atm.process(alice, "withdraw", 300)   # ATM → alice.withdraw(300)
	  alice.transfer(400, bob)              # alice → self.withdraw(400) → bob.deposit(400)
	  print(f"Alice: ${alice.get_balance():.2f}, Bob: ${bob.get_balance():.2f}")
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  #include <stdexcept>
	  
	  class BankAccount {
	      std::string owner_;
	      double balance_;
	      std::vector<std::string> history_;
	  
	  public:
	      BankAccount(std::string owner, double balance = 0.0)
	          : owner_(std::move(owner)), balance_(balance) {}
	  
	      // Message: "deposit"
	      void deposit(double amount) {
	          if (amount <= 0) throw std::invalid_argument("Must be positive");
	          balance_ += amount;
	          history_.push_back("+" + std::to_string(amount));
	          std::cout << "[" << owner_ << "] Deposited $" << amount
	                    << ". Balance: $" << balance_ << "\n";
	      }
	  
	      // Message: "withdraw"
	      bool withdraw(double amount) {
	          if (amount > balance_) {
	              std::cout << "[" << owner_ << "] Insufficient funds.\n";
	              return false;
	          }
	          balance_ -= amount;
	          history_.push_back("-" + std::to_string(amount));
	          std::cout << "[" << owner_ << "] Withdrew $" << amount
	                    << ". Balance: $" << balance_ << "\n";
	          return true;
	      }
	  
	      double getBalance() const { return balance_; }
	  
	      // Message: "transfer" — sends messages to self and target
	      void transfer(double amount, BankAccount& target) {
	          if (withdraw(amount)) {           // Message to self
	              target.deposit(amount);       // Message to another object
	              std::cout << "Transfer of $" << amount << " complete.\n";
	          }
	      }
	  };
	  
	  int main() {
	      BankAccount alice("Alice", 1000.0);
	      BankAccount bob("Bob", 500.0);
	  
	      alice.deposit(200);       // Send "deposit" message
	      alice.withdraw(300);      // Send "withdraw" message
	      alice.transfer(400, bob); // Send "transfer" message → cascades
	  
	      std::cout << "Alice: $" << alice.getBalance()
	                << ", Bob: $" << bob.getBalance() << "\n";
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  class BankAccount {
	      private final String owner;
	      private double balance;
	      private final List<String> history = new ArrayList<>();
	  
	      BankAccount(String owner, double balance) {
	          this.owner = owner;
	          this.balance = balance;
	      }
	  
	      // Message: "deposit"
	      public void deposit(double amount) {
	          if (amount <= 0) throw new IllegalArgumentException("Must be positive");
	          balance += amount;
	          history.add("+" + amount);
	          System.out.printf("[%s] Deposited $%.2f. Balance: $%.2f%n", owner, amount, balance);
	      }
	  
	      // Message: "withdraw"
	      public boolean withdraw(double amount) {
	          if (amount > balance) {
	              System.out.printf("[%s] Insufficient funds.%n", owner);
	              return false;
	          }
	          balance -= amount;
	          history.add("-" + amount);
	          System.out.printf("[%s] Withdrew $%.2f. Balance: $%.2f%n", owner, amount, balance);
	          return true;
	      }
	  
	      public double getBalance() { return balance; }
	  
	      // Message: "transfer" — cascading messages
	      public void transfer(double amount, BankAccount target) {
	          if (withdraw(amount)) {          // Message to self
	              target.deposit(amount);      // Message to target object
	              System.out.printf("Transfer of $%.2f complete.%n", amount);
	          }
	      }
	  }
	  
	  class MessagePassingDemo {
	      public static void main(String[] args) {
	          BankAccount alice = new BankAccount("Alice", 1000.0);
	          BankAccount bob   = new BankAccount("Bob",   500.0);
	  
	          alice.deposit(200);        // Send "deposit" message
	          alice.withdraw(300);       // Send "withdraw" message
	          alice.transfer(400, bob);  // Cascading message passing
	  
	          System.out.printf("Alice: $%.2f, Bob: $%.2f%n",
	              alice.getBalance(), bob.getBalance());
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  class BankAccount {
	      #owner;
	      #balance;
	      #history = [];
	  
	      constructor(owner, balance = 0) {
	          this.#owner = owner;
	          this.#balance = balance;
	      }
	  
	      // Message: "deposit"
	      deposit(amount) {
	          if (amount <= 0) throw new Error("Must be positive");
	          this.#balance += amount;
	          this.#history.push(`+${amount}`);
	          console.log(`[${this.#owner}] Deposited $${amount}. Balance: $${this.#balance}`);
	      }
	  
	      // Message: "withdraw"
	      withdraw(amount) {
	          if (amount > this.#balance) {
	              console.log(`[${this.#owner}] Insufficient funds.`);
	              return false;
	          }
	          this.#balance -= amount;
	          this.#history.push(`-${amount}`);
	          console.log(`[${this.#owner}] Withdrew $${amount}. Balance: $${this.#balance}`);
	          return true;
	      }
	  
	      get balance() { return this.#balance; }
	  
	      // Message: "transfer" — cascading messages
	      transfer(amount, target) {
	          if (this.withdraw(amount)) {    // Message to self
	              target.deposit(amount);    // Message to another object
	              console.log(`Transfer of $${amount} complete.`);
	          }
	      }
	  }
	  
	  const alice = new BankAccount("Alice", 1000);
	  const bob   = new BankAccount("Bob",   500);
	  
	  alice.deposit(200);         // Send "deposit" message
	  alice.withdraw(300);        // Send "withdraw" message
	  alice.transfer(400, bob);   // Cascading message passing
	  
	  console.log(`Alice: $${alice.balance}, Bob: $${bob.balance}`);
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  
	  class BankAccount {
	      private string owner;
	      private double balance;
	      private List<string> history = new();
	  
	      public BankAccount(string owner, double balance) {
	          this.owner = owner;
	          this.balance = balance;
	      }
	  
	      // Message: "Deposit"
	      public void Deposit(double amount) {
	          if (amount <= 0) throw new ArgumentException("Must be positive");
	          balance += amount;
	          history.Add($"+{amount}");
	          Console.WriteLine($"[{owner}] Deposited ${amount:F2}. Balance: ${balance:F2}");
	      }
	  
	      // Message: "Withdraw"
	      public bool Withdraw(double amount) {
	          if (amount > balance) {
	              Console.WriteLine($"[{owner}] Insufficient funds.");
	              return false;
	          }
	          balance -= amount;
	          history.Add($"-{amount}");
	          Console.WriteLine($"[{owner}] Withdrew ${amount:F2}. Balance: ${balance:F2}");
	          return true;
	      }
	  
	      public double Balance => balance;
	  
	      // Message: "Transfer" — cascading
	      public void Transfer(double amount, BankAccount target) {
	          if (Withdraw(amount)) {       // Message to self
	              target.Deposit(amount);   // Message to target object
	              Console.WriteLine($"Transfer of ${amount:F2} complete.");
	          }
	      }
	  
	      static void Main() {
	          var alice = new BankAccount("Alice", 1000.0);
	          var bob   = new BankAccount("Bob",   500.0);
	  
	          alice.Deposit(200);
	          alice.Withdraw(300);
	          alice.Transfer(400, bob);
	  
	          Console.WriteLine($"Alice: ${alice.Balance:F2}, Bob: ${bob.Balance:F2}");
	      }
	  }
	  ```
	  
	  :::
- # Asynchronous Message Passing
  collapsed:: true
	- > [!tip] In modern systems, objects often communicate asynchronously using queues, futures, or the Actor Model (e.g., Erlang, Akka, Python's `asyncio`).
	-
	- ## Python Async Example
	  collapsed:: true
		- ```python
		  import asyncio
		  
		  class NotificationService:
		      async def send_email(self, to: str, subject: str) -> str:
		          """Async message — simulates I/O delay."""
		          await asyncio.sleep(1)  # Simulate network call
		          return f"Email sent to {to}: {subject}"
		  
		  class UserRegistration:
		      def __init__(self, notifier: NotificationService):
		          self.notifier = notifier
		  
		      async def register(self, email: str) -> None:
		          print(f"Registering {email}...")
		          # Async message: caller doesn't block waiting for email to send
		          result = await self.notifier.send_email(email, "Welcome!")
		          print(result)
		  
		  async def main():
		      notifier = NotificationService()
		      reg = UserRegistration(notifier)
		      await reg.register("alice@example.com")
		  
		  asyncio.run(main())
		  ```
- # Key Takeaways
  collapsed:: true
	- **Every method call is a message** — `obj.method(args)` = send `method` message to `obj` with `args`.
	- Sender knows **what to ask**, not **how it's done** — preserves encapsulation.
	- **Dynamic dispatch** resolves the correct handler at runtime based on the receiver's actual type.
	- **Synchronous** messages block the caller; **asynchronous** messages (callbacks, async/await, actors) do not.
	- Message passing is the mechanism that makes **polymorphism** work in practice.
	- Related: [[Encapsulation]], [[Polymorphism]], [[dynamic-binding]], [[Loose Coupling and High Cohesion]]
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Wikipedia — Message Passing](https://en.wikipedia.org/wiki/Message_passing)
		- [Refactoring Guru — Tell, Don't Ask](https://refactoring.guru/smells/feature-envy)