---
seoTitle: Objects in OOP – Instances, State, Behavior, and Identity Guide
description: "Objects are instances of classes with state, behavior, and identity. Covers object creation, instance variables, methods, object lifecycle, and object-oriented."
keywords: "object, OOP, object-oriented programming, instance, state, behavior, identity, instance variables, methods, object lifecycle, class instantiation, software design"
---

- # Explanation
	- An object is an instance of a class. While a class is a blueprint or template, an object is a specific entity created from that class. Objects have attributes (also called properties or fields) and methods (also called functions or behaviors) that are defined by the class.
-
- # steps
	- First, you define a class. This is a blueprint for creating objects.
	-
	- The class should have attributes (data) and methods (functions) that the objects created from this class will have.
	-
	- After defining the class, you create an object by using the class name and parentheses. This is called instantiating an object.
	-
	- Each object will have its own specific data for the attributes that were defined in the class.
	-
	- To access or modify an object's attributes, you use dot notation, like `object.attribute`.
	-
	- To call an object's method (a function inside the class), you use dot notation as well, like `object.method()` to make the object perform an action.
-
- ```python
  # Step 1: Define a class
  class Car:
      # Constructor to initialize attributes
      def __init__(self, brand, model, year):
          self.brand = brand   # Attribute: brand of the car
          self.model = model   # Attribute: model of the car
          self.year = year     # Attribute: year of the car
  
      # Method to display car details
      def display_info(self):
          print(f"{self.year} {self.brand} {self.model}")
  
      # Method to start the car
      def start(self):
          print(f"{self.brand} {self.model} is now running!")
  
  # Step 2: Create objects (instances) of the class
  car1 = Car("Toyota", "Corolla", 2022)
  car2 = Car("Tesla", "Model S", 2023)
  
  # Step 3: Access object attributes and call methods
  car1.display_info()  # Output: 2022 Toyota Corolla
  car1.start()         # Output: Toyota Corolla is now running!
  
  car2.display_info()  # Output: 2023 Tesla Model S
  car2.start()         # Output: Tesla Model S is now running!
  ```