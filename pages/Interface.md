---
seoTitle: Interfaces in OOP – Definition, Implementation, and Usage Guide
description: "Interfaces define contracts that classes must implement. Covers interface vs abstract class, multiple interface implementation, default methods, and design."
keywords: "interface, OOP, object-oriented programming, contract, abstract class, multiple implementation, default methods, Java interface, C# interface, TypeScript interface, design"
---

- # Explanation
	- An **interface** in Python is typically implemented using an **abstract base class (ABC)**. It defines a contract for subclasses: they must implement the methods defined in the interface. An interface only specifies method signatures, but doesn't provide any implementation.
	- Python doesn’t have explicit interfaces like Java or C#. Instead, we use **abstract classes** with abstract methods to mimic the behavior of interfaces.
-
- # Steps
	- Define an abstract base class with abstract methods using `ABC` and `abstractmethod`.
	- Create subclasses that inherit the abstract base class and implement the abstract methods.
-
- ```python
  from abc import ABC, abstractmethod
  
  class Vehicle(ABC):  # Interface (Abstract Base Class)
      @abstractmethod
      def start(self):
          pass
  
  class Car(Vehicle):  # Concrete class
      def start(self):
          print("Car is starting.")
  
  car = Car()
  car.start()  # Output: Car is starting.
  ```