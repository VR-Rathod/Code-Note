# Explanation
	- Inheritance is a fundamental OOP concept where a new class (child class) derives properties and behaviors (methods) from an existing class (parent class). This allows the child class to reuse code from the parent class, making code more reusable and modular. The child class can also extend or override the functionality of the parent class.
	  
	  **Key Points**:
		- **Parent Class**: A class that provides methods and attributes to be inherited.
		- **Child Class**: A class that inherits methods and attributes from the parent class.
-
- # Steps
	- Define a parent class with common attributes and methods.
	-
	- Create a child class that inherits from the parent class.
	-
	- Use inherited methods and attributes, or override them in the child class.
-
- ```python
  class Animal:  # Parent class
      def eat(self):
          print("This animal is eating.")
  
  class Dog(Animal):  # Child class inherits from Animal
      def bark(self):
          print("Woof!")
  
  dog = Dog()
  dog.eat()  # Inherited method from parent class
  dog.bark()  # Child class method
  ```