# Explanation
	- Abstraction is the OOP concept where you hide the complex implementation details and show only the essential features of an object. It allows you to focus on what an object does rather than how it performs the task. In Python, abstraction is typically implemented using abstract classes and abstract methods, where the class provides a skeleton and the subclass implements the details.
	  
	  **Key Points**:
		- **Abstract Class**: A class that cannot be instantiated directly and may contain abstract methods.
		- **Abstract Method**: A method in the abstract class that does not have any implementation and must be overridden in subclasses.
-
- # Steps
	- Create an abstract class using the `ABC` module and `abstractmethod`.
	-
	- Define abstract methods without implementation in the abstract class.
	-
	- Implement these abstract methods in subclasses.
-
- ```python
  from abc import ABC, abstractmethod
  
  class Animal(ABC):  # Abstract class
      @abstractmethod
      def sound(self):  # Abstract method
          pass
  
  class Dog(Animal):  # Concrete class
      def sound(self):
          print("Woof!")
  
  class Cat(Animal):  # Concrete class
      def sound(self):
          print("Meow!")
  
  dog = Dog()
  dog.sound()  # Output: Woof!
  ```