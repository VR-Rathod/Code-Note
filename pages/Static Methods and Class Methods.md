# Explanation
	- **Static methods** and **class methods** are both methods that belong to the class itself rather than instances of the class.
	- **Static Method**: Doesn’t take `self` or `cls` as its first argument. It can be called on the class itself or instances, but it doesn’t modify class state or instance state.
	- **Class Method**: Takes `cls` as its first argument and can modify class-level attributes. It is called on the class itself.
-
- # Steps
	- Define a `@staticmethod` for a static method that doesn't need class or instance data.
	-
	- Define a `@classmethod` for a class method that can modify class-level attributes.
-
- ```python
  class MyClass:
      count = 0  # Class attribute
  
      @staticmethod
      def static_method():
          print("This is a static method.")
  
      @classmethod
      def class_method(cls):
          cls.count += 1
          print(f"Class method called. Count is now {cls.count}")
  
  # Calling static and class methods
  MyClass.static_method()  # Output: This is a static method.
  MyClass.class_method()  # Output: Class method called. Count is now 1
  ```