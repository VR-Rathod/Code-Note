---
date: 2026-03-24T17:12:17+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Loose Coupling and High Cohesion – Software Design Principles
description: "Loose coupling and high cohesion are key software design principles. Covers dependency reduction, module responsibility, SOLID principles, and refactoring."
keywords: "loose coupling, high cohesion, software design, SOLID principles, dependency injection, module design, refactoring, maintainability, object-oriented programming, design principles"
---

- # Explanation
	- **Loose Coupling**: Reduces dependencies between objects, making the system more flexible and easier to maintain.
	- **High Cohesion**: Ensures that a class or module is focused on a specific responsibility, improving clarity and maintainability.
-
- # Steps
	- Achieve **loose coupling** by minimizing direct dependencies between objects. Use interfaces or abstract classes to decouple components.
	-
	- Achieve **high cohesion** by ensuring that each class has a well-defined, singular responsibility.
-
- ```python
  class Printer:
      def print(self):
          print("Printing...")
  
  class Computer:
      def __init__(self, printer):
          self.printer = printer  # Loose coupling (dependency injection)
  
      def print_document(self):
          self.printer.print()
  
  printer = Printer()
  computer = Computer(printer)
  computer.print_document()  # Output: Printing...
  ```