---
seoTitle: Delegation Pattern in OOP – Design Pattern Reference Guide
description: "Delegation forwards method calls to a helper object. Covers delegation vs inheritance, delegate pattern, event delegation, and language-specific examples."
keywords: "delegation, OOP, design pattern, delegate pattern, method forwarding, composition, event delegation, software design, object-oriented programming, helper object"
treeTitle: DSA - OOP - Delegation
---

> [!info] What is Delegation?
> **Delegation** is an OOP design pattern where an object (**delegator**) hands off a specific responsibility to another object (**delegate**) rather than performing it directly. It models a **"Has-A" relationship** — the delegator *has a* reference to the delegate and calls its methods to get the work done.
> This is the core mechanism behind **Composition over Inheritance**, allowing behavior reuse without creating deep inheritance hierarchies.

- # Explanation
  collapsed:: true
	- ## Delegation vs Inheritance
	  collapsed:: true
		- **Inheritance** ("Is-A"): `Car` extends `Vehicle`. The subclass *is a* type of the parent class. Behavior is baked into the hierarchy.
		- **Delegation** ("Has-A"): `Computer` has a `Printer`. The delegator holds a reference to the helper object and *forwards* specific calls to it.
		- Delegation is preferred when:
			- The relationship is behavioral, not taxonomic.
			- You want to swap or change behavior at runtime by replacing the delegate.
			- Adding inheritance would create an inflexible or illogical hierarchy.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **CEO (delegator)** and a **team of specialists (delegates)**.
		- The CEO doesn't personally handle legal work, accounting, or PR. Instead, they **delegate** each task to the appropriate specialist.
		- The CEO only needs to know *who to call*, not *how the work is done*. This is exactly how delegation works in code.
	-
	- ## Visual Structure
	  collapsed:: true
		- ```
		  ┌─────────────────────────────────────────────────┐
		  │                   Delegator                     │
		  │   Computer                                      │
		  │  ┌──────────────────────────────────┐           │
		  │  │  printer: Printer  (reference)   │           │
		  │  └──────────────────────────────────┘           │
		  │                                                 │
		  │  print_document() ──────────────────────────►   │
		  └─────────────────────────────────────────────────┘
		                                       │
		                                       ▼
		                         ┌─────────────────────────┐
		                         │        Delegate          │
		                         │         Printer          │
		                         │   print()               │
		                         └─────────────────────────┘
		  ```
		-
		- ```mermaid
		  graph LR
		      Delegator["Computer\n(Delegator)"] -- "holds reference" --> Delegate["Printer\n(Delegate)"]
		      Client(["Client"]) -- "calls print_document()" --> Delegator
		      Delegator -- "forwards → print()" --> Delegate
		  
		      classDef delegator fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		      classDef delegate fill:#1f2937,stroke:#10b981,stroke-width:2px,color:#fff;
		      classDef client fill:#374151,stroke:#6b7280,stroke-width:2px,color:#d1d5db;
		      class Delegator delegator;
		      class Delegate delegate;
		      class Client client;
		  ```
- # Core Concepts
  collapsed:: true
	- ## 1. Simple Delegation
	  collapsed:: true
		- The delegator holds a **direct reference** to the delegate and forwards specific method calls.
		- The delegate performs the actual work; the delegator does not need to know the implementation details.
		- **Benefit**: The delegate can be swapped at runtime for a different implementation (e.g., `ColorPrinter` instead of `Printer`).
	-
	- ## 2. Interface-Based Delegation
	  collapsed:: true
		- Define an **interface (or abstract class)** that the delegate must implement. The delegator depends only on the interface, not a concrete class.
		- This enables full **Dependency Injection** — the delegator is decoupled from any specific delegate implementation.
		- **Benefit**: Maximizes flexibility and testability (easily mock the delegate in tests).
	-
	- ## 3. Delegation vs Composition
	  collapsed:: true
		- Delegation *is a form of* Composition. The distinction is intent:
			- **Composition**: An object is built *from* other objects (structural).
			- **Delegation**: An object *forwards calls* to another object (behavioral).
		- All delegation uses composition, but not all composition is delegation.
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity of Delegation
	  > Delegation itself adds minimal overhead — it is an extra method call (indirection). In most languages, this is negligible ($O(1)$ per forwarded call). The complexity of any operation is dominated by the delegate's own implementation.
	-
	- | Aspect | Notes |
	  |--------|-------|
	  | **Method Forwarding Overhead** | $O(1)$ — a single additional function call per delegation |
	  | **Memory Overhead** | $O(1)$ — one extra reference/pointer stored in the delegator |
	  | **Runtime Swapping** | $O(1)$ — replacing the delegate reference is constant time |
	  | **Testability** | High — delegate can be replaced with a mock object |
	  | **Coupling** | Low — delegator depends on interface, not concrete implementation |
- # Implementation
  collapsed:: true
	- > [!note] Delegation Pattern Implementation
	  > Below are examples demonstrating delegation using an interface (or abstract base class) so the delegate is fully swappable at runtime.
	-
	- :::code-tabs
	  
	  ```python
	  from abc import ABC, abstractmethod
	  
	  # --- Delegate Interface ---
	  class PrinterInterface(ABC):
	      @abstractmethod
	      def print_doc(self, content: str) -> None:
	          pass
	  
	  # --- Concrete Delegates ---
	  class StandardPrinter(PrinterInterface):
	      def print_doc(self, content: str) -> None:
	          print(f"[Standard] Printing: {content}")
	  
	  class PDFPrinter(PrinterInterface):
	      def print_doc(self, content: str) -> None:
	          print(f"[PDF] Exporting to PDF: {content}")
	  
	  # --- Delegator ---
	  class Computer:
	      def __init__(self, printer: PrinterInterface):
	          self._printer = printer  # delegate reference
	  
	      def set_printer(self, printer: PrinterInterface) -> None:
	          self._printer = printer  # swap delegate at runtime
	  
	      def print_document(self, content: str) -> None:
	          self._printer.print_doc(content)  # forward the call
	  
	  # --- Example Usage ---
	  computer = Computer(StandardPrinter())
	  computer.print_document("Hello World")    # [Standard] Printing: Hello World
	  
	  computer.set_printer(PDFPrinter())        # swap delegate at runtime
	  computer.print_document("Hello World")    # [PDF] Exporting to PDF: Hello World
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <memory>
	  #include <string>
	  
	  // --- Delegate Interface ---
	  class PrinterInterface {
	  public:
	      virtual void printDoc(const std::string& content) = 0;
	      virtual ~PrinterInterface() = default;
	  };
	  
	  // --- Concrete Delegates ---
	  class StandardPrinter : public PrinterInterface {
	  public:
	      void printDoc(const std::string& content) override {
	          std::cout << "[Standard] Printing: " << content << "\n";
	      }
	  };
	  
	  class PDFPrinter : public PrinterInterface {
	  public:
	      void printDoc(const std::string& content) override {
	          std::cout << "[PDF] Exporting to PDF: " << content << "\n";
	      }
	  };
	  
	  // --- Delegator ---
	  class Computer {
	  private:
	      std::shared_ptr<PrinterInterface> printer;
	  
	  public:
	      explicit Computer(std::shared_ptr<PrinterInterface> p) : printer(std::move(p)) {}
	  
	      void setPrinter(std::shared_ptr<PrinterInterface> p) {
	          printer = std::move(p);
	      }
	  
	      void printDocument(const std::string& content) {
	          printer->printDoc(content); // forward the call
	      }
	  };
	  
	  int main() {
	      Computer computer(std::make_shared<StandardPrinter>());
	      computer.printDocument("Hello World"); // [Standard] Printing: Hello World
	  
	      computer.setPrinter(std::make_shared<PDFPrinter>()); // swap at runtime
	      computer.printDocument("Hello World"); // [PDF] Exporting to PDF: Hello World
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  // --- Concrete Delegates ---
	  class StandardPrinter {
	      printDoc(content) {
	          console.log(`[Standard] Printing: ${content}`);
	      }
	  }
	  
	  class PDFPrinter {
	      printDoc(content) {
	          console.log(`[PDF] Exporting to PDF: ${content}`);
	      }
	  }
	  
	  // --- Delegator ---
	  class Computer {
	      constructor(printer) {
	          this._printer = printer; // delegate reference
	      }
	  
	      setPrinter(printer) {
	          this._printer = printer; // swap delegate at runtime
	      }
	  
	      printDocument(content) {
	          this._printer.printDoc(content); // forward the call
	      }
	  }
	  
	  // --- Example Usage ---
	  const computer = new Computer(new StandardPrinter());
	  computer.printDocument("Hello World"); // [Standard] Printing: Hello World
	  
	  computer.setPrinter(new PDFPrinter()); // swap delegate at runtime
	  computer.printDocument("Hello World"); // [PDF] Exporting to PDF: Hello World
	  ```
	  
	  ```java
	  // --- Delegate Interface ---
	  interface PrinterInterface {
	      void printDoc(String content);
	  }
	  
	  // --- Concrete Delegates ---
	  class StandardPrinter implements PrinterInterface {
	      @Override
	      public void printDoc(String content) {
	          System.out.println("[Standard] Printing: " + content);
	      }
	  }
	  
	  class PDFPrinter implements PrinterInterface {
	      @Override
	      public void printDoc(String content) {
	          System.out.println("[PDF] Exporting to PDF: " + content);
	      }
	  }
	  
	  // --- Delegator ---
	  class Computer {
	      private PrinterInterface printer;
	  
	      public Computer(PrinterInterface printer) {
	          this.printer = printer;
	      }
	  
	      public void setPrinter(PrinterInterface printer) {
	          this.printer = printer; // swap delegate at runtime
	      }
	  
	      public void printDocument(String content) {
	          printer.printDoc(content); // forward the call
	      }
	  }
	  
	  // --- Example Usage ---
	  public class Main {
	      public static void main(String[] args) {
	          Computer computer = new Computer(new StandardPrinter());
	          computer.printDocument("Hello World"); // [Standard] Printing: Hello World
	  
	          computer.setPrinter(new PDFPrinter()); // swap at runtime
	          computer.printDocument("Hello World"); // [PDF] Exporting to PDF: Hello World
	      }
	  }
	  ```
	  
	  :::
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- 1. The **Client** calls a method on the **Delegator** object.
		- 2. The Delegator does not implement the behavior itself — it **forwards** the call to the **Delegate** object it holds a reference to.
		- 3. The Delegate performs the actual work and returns the result.
		- 4. Optionally, the Delegator can **pre/post-process** before or after forwarding.
		-
		- ```mermaid
		  sequenceDiagram
		      participant Client
		      participant Computer as Computer (Delegator)
		      participant Printer as Printer (Delegate)
		  
		      Client->>Computer: printDocument("Hello")
		      Computer->>Printer: printDoc("Hello")
		      Printer-->>Computer: (work done)
		      Computer-->>Client: (returns)
		  ```
	-
	- ## Step-by-Step Trace
	  collapsed:: true
		- ```
		  Setup:
		    printer = StandardPrinter()
		    computer = Computer(printer)   ← stores reference
		  
		  Client calls:
		    computer.printDocument("Hello World")
		  
		  Inside Computer.printDocument():
		    → self._printer.print_doc("Hello World")   ← forward to delegate
		  
		  Inside StandardPrinter.print_doc():
		    → print("[Standard] Printing: Hello World") ← actual work
		  
		  Output: [Standard] Printing: Hello World
		  
		  Runtime swap:
		    computer.set_printer(PDFPrinter())          ← replace delegate
		  
		  Client calls again:
		    computer.printDocument("Hello World")
		    → PDFPrinter.print_doc("Hello World")
		    → print("[PDF] Exporting to PDF: Hello World")
		  
		  Output: [PDF] Exporting to PDF: Hello World
		  ```
- # Alternative Variant (Event Delegation & Transparent Proxy)
  collapsed:: true
	- > [!tip] Event Delegation — Delegating UI Event Handling
	  > In the browser DOM, **event delegation** attaches a single listener to a parent element and delegates handling of child events based on `event.target`. This avoids adding individual listeners to thousands of child nodes.
	-
	- :::code-tabs
	  
	  ```javascript
	  // --- DOM Event Delegation ---
	  // One listener on the parent <ul> handles clicks on any child <li>
	  
	  const list = document.getElementById('item-list');
	  
	  list.addEventListener('click', function(event) {
	      if (event.target && event.target.tagName === 'LI') {
	          console.log('Clicked item:', event.target.textContent);
	          event.target.classList.toggle('selected');
	      }
	  });
	  
	  // Adding 1000 items → still only ONE event listener on the parent
	  for (let i = 1; i <= 5; i++) {
	      const li = document.createElement('li');
	      li.textContent = `Item ${i}`;
	      list.appendChild(li);
	  }
	  ```
	  
	  ```python
	  # --- Transparent Proxy via __getattr__ ---
	  # Delegates ALL unknown attribute accesses automatically
	  
	  class SmartDelegate:
	      def __init__(self, delegate):
	          self._delegate = delegate
	  
	      def __getattr__(self, name):
	          # Forward any attribute/method not on SmartDelegate itself
	          return getattr(self._delegate, name)
	  
	      def __repr__(self):
	          return f"SmartDelegate({self._delegate!r})"
	  
	  class Printer:
	      def print_doc(self, text): print(f"Printing: {text}")
	      def get_status(self): return "Ready"
	  
	  proxy = SmartDelegate(Printer())
	  proxy.print_doc("Hello")    # Printing: Hello
	  print(proxy.get_status())   # Ready
	  ```
	  
	  :::
- # When to Use Delegation
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Does a class need\nbehavior it should\nnot own directly?"}
	      Q -- No --> R1["Implement directly\nin the class"]
	      Q -- Yes --> S1{"Can it extend\na base class?"}
	      S1 -- Yes --> S2{"Would inheritance\ncreate tight coupling\nor rigid hierarchy?"}
	      S2 -- No --> R2["Use Inheritance"]
	      S2 -- Yes --> R3["✅ Use Delegation\n(forward to delegate object)"]
	      S1 -- No --> R3
	  
	      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
	  ```
	-
	- ## ✅ Use Delegation When
		- A class needs behavior that belongs to a **different responsibility** (printing, logging, persistence).
		- You want to **swap behavior at runtime** by replacing the delegate reference.
		- **Inheritance would create an illogical hierarchy** (e.g., `Computer extends Printer` makes no sense).
		- You want behavior that can be **unit-tested independently** by mocking the delegate.
	-
	- ## ❌ Avoid Delegation When
		- The forwarded behavior is **trivial** and only ever used in one place — a simple method call is enough.
		- The overhead of maintaining a delegate reference and interface outweighs the flexibility gained.
		- The behavior is genuinely **intrinsic to the class** — use regular inheritance or direct implementation.
- # Key Takeaways
  collapsed:: true
	- **"Has-A" Pattern** — The delegator *has a* reference to the delegate and uses it to get work done.
	- **Runtime Flexibility** — The delegate can be swapped at runtime, enabling dynamic behavior changes without modifying the delegator.
	- **Separation of Concerns** — Each class stays focused on its own responsibility; behavior is cleanly delegated to the right object.
	- **Testability** — Delegates can be independently tested and easily mocked during unit testing of the delegator.
	- **Interface Coupling** — Well-designed delegation programs to an interface, not a concrete class, giving maximum flexibility.
	- **Foundation of Composition** — Delegation is the behavioral core of the "Composition over Inheritance" principle.
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Refactoring Guru → Proxy Pattern (Delegation)](https://refactoring.guru/design-patterns/proxy)
		- [GeeksforGeeks → Delegation vs Inheritance in Java](https://www.geeksforgeeks.org/delegation-vs-inheritance-java/)
		- [MDN → Event Delegation (JavaScript)](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Event_bubbling)