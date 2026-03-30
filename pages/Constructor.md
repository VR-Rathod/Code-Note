---
seoTitle: Constructors in OOP – Initialization, Overloading, and Patterns
description: "Constructors initialize objects when they are created. Covers default constructors, parameterized constructors, copy constructors, constructor overloading, and."
keywords: "constructor, OOP, object-oriented programming, default constructor, parameterized constructor, copy constructor, constructor overloading, constructor chaining, initialization"
---

- # Explanation
	- A **constructor** is a special method that is called automatically when an object is created. In Python, the constructor is defined using the `__init__()` method. The constructor is used to initialize the attributes of the object when it is created.
	  
	  **Key Points**:
		- **`__init__` Method**: A special method that acts as a constructor in Python. It is automatically invoked when an object is created.
		- **Attribute Initialization**: Inside the constructor, you can initialize the object’s attributes with specific values.
-
- # Steps
	- Define the `__init__()` method in your class.
	-
	- Initialize the object’s attributes inside the constructor.
-
- ```python
  class Car:
      def __init__(self, brand, model, year):  # Constructor
          self.brand = brand
          self.model = model
          self.year = year
  
  car = Car("Toyota", "Corolla", 2022)  # Constructor is automatically called
  print(car.brand)  # Output: Toyota
  ```