# Explanation
	- An **Abstract Class** is a class that cannot be instantiated directly. It defines a blueprint for subclasses to follow, and may contain abstract methods (methods without implementation) that must be implemented by concrete subclasses.
	- **"Enforces a contract"**: Abstract classes ensure that subclasses implement the required methods.
	- **Use Case**: When you want to define a common interface for a group of related classes.
-
- # Steps
	- Create an abstract class using the `abc` module in Python.
	-
	- Define abstract methods using `@abstractmethod` decorator.
	-
	- Create concrete subclasses that implement the abstract methods.
-
- ```python
  from abc import ABC, abstractmethod
  
  class Animal(ABC):
      @abstractmethod
      def sound(self):
          pass
  
  class Dog(Animal):
      def sound(self):
          print("Woof!")
  
  class Cat(Animal):
      def sound(self):
          print("Meow!")
  
  dog = Dog()
  dog.sound()  # Output: Woof!
  
  cat = Cat()
  cat.sound()  # Output: Meow!
  ```