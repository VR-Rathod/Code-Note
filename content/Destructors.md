---
seoTitle: Destructors in OOP – Memory Cleanup and Resource Management
description: "Destructors clean up resources when objects are destroyed. Covers destructor syntax, RAII, finalizers, garbage collection, and language differences in C++,."
keywords: "destructors, OOP, memory management, RAII, finalizers, garbage collection, C++ destructor, Python __del__, resource cleanup, object lifecycle, object-oriented programming"
---

- # Explanation
	- A **destructor** is a special method in a class that is automatically called when an object is destroyed. In Python, this is done through the `__del__()` method. The destructor is typically used to clean up resources or perform any final tasks when an object is no longer needed.
	- **Python does not have a traditional destructor** (like in C++ or Java), but the `__del__()` method can be used for cleanup when the object is about to be destroyed.
-
- # Steps
	- Define the `__del__()` method in your class.
	-
	- Use it to release resources or cleanup tasks when the object is destroyed.
-
- ```python
  class Car:
      def __init__(self, brand, model):
          self.brand = brand
          self.model = model
  
      def __del__(self):  # Destructor
          print(f"Destructor called for {self.brand} {self.model}")
  
  car = Car("Toyota", "Corolla")
  del car  # Destructor will be called here
  ```