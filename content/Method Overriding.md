---
seoTitle: Method Overriding in OOP – Runtime Polymorphism and Override Guide
description: "Method overriding redefines a parent class method in a subclass. Covers runtime polymorphism, @Override annotation, virtual methods, covariant return types."
keywords: "method overriding, OOP, runtime polymorphism, @Override, virtual methods, covariant return, Java overriding, Python overriding, C++ override, object-oriented programming"
---

- # Explanation
	- **Method Overriding** allows a subclass to provide its own specific implementation of a method that is already defined in its parent class. This is one of the key features of polymorphism.
	- Overriding is done when a child class defines a method with the same name and signature as a method in the parent class.
-
- # Steps
	- Define a method in the parent class.
	- In the child class, define a method with the same name to change its behavior.
-
- ```python
  class Animal:
      def sound(self):
          print("Animal makes a sound")
  
  class Dog(Animal):
      def sound(self):  # Method overriding
          print("Woof!")
  
  dog = Dog()
  dog.sound()  # Output: Woof!
  ```
-