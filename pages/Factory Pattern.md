---
seoTitle: Factory Pattern – Creational Design Pattern Reference Guide
description: "Factory pattern creates objects without specifying exact classes. Covers factory method, abstract factory, simple factory, and when to use factory vs."
keywords: "factory pattern, design pattern, creational pattern, factory method, abstract factory, object creation, OOP, software design, dependency injection, SOLID principles"
---

# Explanation
	- The **Factory Pattern** is a creational design pattern that provides a method for creating objects without specifying the exact class of object that will be created.
	- **"Encapsulates object creation"**: The factory method encapsulates the instantiation logic and can return different objects based on conditions.
	- **Use Case**: Useful when object creation logic is complex or when you want to provide different implementations for the same interface.
-
- # Steps
	- Define a factory class that will create and return different types of objects based on input.
	-
	- The factory method abstracts away the details of object creation.
-
- ```python
  class Animal:
      def speak(self):
          pass
  
  class Dog(Animal):
      def speak(self):
          return "Woof!"
  
  class Cat(Animal):
      def speak(self):
          return "Meow!"
  
  class AnimalFactory:
      def create_animal(self, animal_type):
          if animal_type == "dog":
              return Dog()
          elif animal_type == "cat":
              return Cat()
          return None
  
  # Factory Usage
  factory = AnimalFactory()
  animal = factory.create_animal("dog")
  print(animal.speak())  # Output: Woof!
  ```