---
seoTitle: Composition in OOP – Favor Composition Over Inheritance Guide
description: "Composition builds complex objects by combining simpler ones. Covers has-a relationship, composition vs inheritance, dependency injection, and design."
keywords: "composition, OOP, object-oriented programming, has-a relationship, composition over inheritance, dependency injection, design patterns, software design, flexibility"
---

- # Explanation
	- **Composition** is an OOP principle where one object is made up of other objects, i.e., it has instances of other classes as attributes. Composition represents a "has-a" relationship between objects.
	- **Has-A Relationship**: This means that an object can contain other objects, which may represent part of its functionality.
-
- # Steps
	- Define classes for both the containing class and the contained class.
	-
	- Create an instance of the contained class as an attribute in the containing class.
	-
	- Use the contained object's methods or attributes from the containing class.
-
- ```python
  class Engine:
      def start(self):
          print("Engine started.")
  
  class Car:
      def __init__(self, brand):
          self.brand = brand
          self.engine = Engine()  # Car has an engine (Composition)
  
      def drive(self):
          self.engine.start()
          print(f"The {self.brand} is driving.")
  
  car = Car("Toyota")
  car.drive()
  ```