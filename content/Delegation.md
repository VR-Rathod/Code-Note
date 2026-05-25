---
date: 2025-05-15T11:00:41+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Delegation Pattern in OOP – Design Pattern Reference Guide
description: "Delegation forwards method calls to a helper object. Covers delegation vs inheritance, delegate pattern, event delegation, and language-specific."
keywords: "delegation, OOP, design pattern, delegate pattern, method forwarding, composition, event delegation, software design, object-oriented programming, helper object"
---

- # Explanation
	- **Delegation** is a design pattern where an object delegates responsibility for certain tasks to another object. Instead of doing the work itself, the delegating object asks another object (delegate) to perform the work.
	- **"Has-A" relationship**: The delegating object "has a" reference to the delegating object and uses it to delegate responsibilities.
	- **Use Case**: Useful when you want to separate concerns and avoid making a class too complex.
-
- # Steps
	- Create a class that performs the main task (Delegate).
	-
	- Create a class that delegates tasks to the delegate class.
	-
	- The delegator calls methods on the delegate class to perform specific tasks.
-
- ```python
  class Printer:
      def print(self):
          print("Printing document...")
  
  class Computer:
      def __init__(self, printer):
          self.printer = printer  # Delegating print functionality
  
      def print_document(self):
          self.printer.print()  # Delegates the printing task
  
  printer = Printer()
  computer = Computer(printer)
  computer.print_document()  # Output: Printing document...
  ```