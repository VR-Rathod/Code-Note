---
date: 2025-05-15T11:00:41+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Singleton Pattern – Creational Design Pattern Reference Guide
description: "Singleton ensures only one instance of a class exists. Covers thread-safe singleton, lazy initialization, double-checked locking, and when to avoid singleton."
keywords: "singleton pattern, design pattern, creational pattern, thread-safe singleton, lazy initialization, double-checked locking, OOP, software design, anti-pattern, instance control"
---

- # Explanation
	- The **Singleton Pattern** is a creational design pattern that ensures a class has only one instance, and provides a global point of access to that instance.
	- **"Single Instance"**: The Singleton ensures that only one object of the class is created throughout the application.
	- **Use Case**: Useful when you need to control access to shared resources, like database connections or logging.
-
- # Steps
	- Make the constructor of the class private to prevent direct instantiation.
	- Provide a static method that will return the single instance of the class.
-
- ```python
  class Singleton:
      _instance = None
  
      def __new__(cls):
          if cls._instance is None:
              cls._instance = super(Singleton, cls).__new__(cls)
          return cls._instance
  
  # Singleton usage
  singleton1 = Singleton()
  singleton2 = Singleton()
  
  print(singleton1 is singleton2)  # Output: True (Both are the same instance)
  ```