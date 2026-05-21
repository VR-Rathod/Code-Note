---
seoTitle: Classes in OOP – Definition, Attributes, Methods, and Examples
description: "Classes are blueprints for objects in OOP. Covers class definition, attributes, methods, constructors, access modifiers, static members, and class vs object."
keywords: "class, OOP, object-oriented programming, attributes, methods, constructor, access modifiers, static members, class definition, Python class, Java class, C++ class"
---

- # Explanation
	- A class is a blueprint for creating objects (instances). It defines the properties (attributes) and behaviors (methods) that the objects created from it will have. In Python, a class is created using the `class` keyword.
-
- # Steps
	- Use the `class` keyword to define a class.
	-
	- **Add a Constructor (`__init__`)**:
		- The constructor method is used to initialize the attributes of the class when an object is created.
	-
	- **Define Methods**:
		- Methods are functions defined inside a class to perform actions or computations. These methods can modify or interact with the object's attributes.
	-
	- **Create Objects**:
		- Once a class is defined, you can create objects (instances) of that class.
-
- ```python
  # Step 1: Define the class
  class Dog:
      # Step 2: Add a constructor to initialize attributes
      def __init__(self, name, age):
          self.name = name  # attribute 'name'
          self.age = age    # attribute 'age'
  
      # Step 3: Define a method
      def bark(self):
          print(f"{self.name} says woof!")
  
      # Another method
      def info(self):
          print(f"{self.name} is {self.age} years old.")
  
  # Step 4: Create objects (instances) of the class
  dog1 = Dog("Buddy", 3)
  dog2 = Dog("Lucy", 5)
  
  # Call methods on objects
  dog1.bark()   # Output: Buddy says woof!
  dog1.info()   # Output: Buddy is 3 years old.
  
  dog2.bark()   # Output: Lucy says woof!
  dog2.info()   # Output: Lucy is 5 years old.
  ```