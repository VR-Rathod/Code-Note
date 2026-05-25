---
seoTitle: Encapsulation in OOP – Data Hiding and Access Control Guide
description: "Encapsulation bundles data and methods while restricting direct access. Covers access modifiers, getters/setters, data hiding, and benefits for maintainability."
keywords: "encapsulation, OOP, data hiding, access modifiers, getters, setters, private, public, protected, object-oriented programming, software design, maintainability"
---

- # Explanation
	- Encapsulation is the OOP principle of bundling data (attributes) and methods (functions) that manipulate the data into a single unit, i.e., a class. Encapsulation helps to protect the internal state of an object and restricts direct access to some of its attributes, allowing controlled access through public methods. This is achieved by making attributes **private** and providing public methods (getters and setters) to access and modify them.
	  
	  **Key Points**:
		- **Private Attributes**: Attributes that cannot be accessed directly from outside the class.
		- **Public Methods**: Methods that provide controlled access to private attributes.
-
- # Steps
	- Define a class with attributes.
	-
	- Use double underscores (`__`) to make some attributes private.
	-
	- Create public methods to provide controlled access to these private attributes.
-
- ```python
  class Car:
      def __init__(self, brand, model):
          self.__brand = brand  # Private attribute
          self.model = model    # Public attribute
  
      def get_brand(self):  # Public method to access private attribute
          return self.__brand
  
  car = Car("Toyota", "Corolla")
  print(car.get_brand())  # Output: Toyota
  ```