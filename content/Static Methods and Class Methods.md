---
seoTitle: Static Methods and Class Methods in OOP – Complete In-Depth Guide
description: "Deep dive into Static Methods and Class Methods in OOP. Covers the difference between instance, class, and static methods, when to use each, factory patterns, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "static methods, class methods, instance methods, @staticmethod, @classmethod, static keyword, factory method, Python static, Java static, C++ static, VR-Rathod, Code-Note"
displayTitle: Static Methods and Class Methods
treeTitle: DSA - OOP - Static Methods and Class Methods
---

> [!info] What are Static and Class Methods?
> **Static methods** and **class methods** belong to the **class itself** rather than to any individual object instance. They don't receive `self` (the object) as a first argument. **Class methods** receive `cls` (the class), while **static methods** receive nothing extra — they are pure utility functions scoped inside a class.

- # Explanation
  collapsed:: true
	- ## The Three Method Types Compared
	  collapsed:: true
		- | Method Type | Decorator | First Param | Access | When to Use |
		  |---|---|---|---|---|
		  | **Instance Method** | *(none)* | `self` | Instance + class data | Operate on object state (most common) |
		  | **Class Method** | `@classmethod` | `cls` | Class data only (no instance) | Factories, alternate constructors, class-level logic |
		  | **Static Method** | `@staticmethod` | *(none)* | Nothing automatic | Utility functions related to the class but needing no context |
		-
		- ```python
		  class MyClass:
		      class_var = "shared"
		  
		      def instance_method(self):     # has 'self' → access to object + class
		          return f"instance: {self.class_var}"
		  
		      @classmethod
		      def class_method(cls):         # has 'cls' → access to class only
		          return f"class: {cls.class_var}"
		  
		      @staticmethod
		      def static_method():           # no self/cls → pure utility
		          return "static: no context"
		  
		  obj = MyClass()
		  print(obj.instance_method())       # instance: shared
		  print(MyClass.class_method())      # class: shared
		  print(MyClass.static_method())     # static: no context
		  print(obj.static_method())         # also valid via instance
		  ```
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **library** 📚:
		- **Instance method** = A member borrowing a specific book (needs to know *which* member and *which* book).
		- **Class method** = The library administrator changing the library's opening hours (acts on the *library as a whole*, not a specific member).
		- **Static method** = A utility posted on the wall: "How to find the Dewey Decimal section" (useful to the library, but needs no knowledge of any specific member or current state).
- # Class Methods as Factory Constructors
  collapsed:: true
	- The most powerful use of `@classmethod` is creating **alternative constructors** (factory methods) with meaningful names:
	- ```python
	  class Date:
	      def __init__(self, year: int, month: int, day: int):
	          self.year = year
	          self.month = month
	          self.day = day
	  
	      # ── Factory class methods ─────────────────────────
	      @classmethod
	      def from_string(cls, date_str: str) -> "Date":
	          """Create Date from 'YYYY-MM-DD' string."""
	          year, month, day = map(int, date_str.split("-"))
	          return cls(year, month, day)
	  
	      @classmethod
	      def today(cls) -> "Date":
	          """Create Date for current date."""
	          from datetime import date
	          d = date.today()
	          return cls(d.year, d.month, d.day)
	  
	      def __repr__(self) -> str:
	          return f"Date({self.year}-{self.month:02d}-{self.day:02d})"
	  
	  
	  d1 = Date(2024, 5, 26)                 # standard constructor
	  d2 = Date.from_string("2024-05-26")    # factory — from string
	  d3 = Date.today()                      # factory — today's date
	  
	  print(d1)  # Date(2024-05-26)
	  print(d2)  # Date(2024-05-26)
	  ```
- # Implementation
  collapsed:: true
	- > [!note] A `MathUtils` class with static utility methods, and a `User` class with class-level factory constructors.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  import math
	  
	  class MathUtils:
	      PI = math.pi   # class attribute
	  
	      # Static methods — no access to self or cls
	      @staticmethod
	      def clamp(value: float, min_val: float, max_val: float) -> float:
	          return max(min_val, min(value, max_val))
	  
	      @staticmethod
	      def lerp(a: float, b: float, t: float) -> float:
	          """Linear interpolation between a and b at position t (0–1)."""
	          return a + (b - a) * MathUtils.clamp(t, 0, 1)
	  
	      @staticmethod
	      def is_prime(n: int) -> bool:
	          if n < 2: return False
	          for i in range(2, int(math.sqrt(n)) + 1):
	              if n % i == 0: return False
	          return True
	  
	      # Class method — can access/modify class attributes
	      @classmethod
	      def circle_area(cls, radius: float) -> float:
	          return cls.PI * radius ** 2
	  
	  
	  class User:
	      _count = 0
	  
	      def __init__(self, name: str, email: str, role: str = "user"):
	          self.name = name
	          self.email = email
	          self.role = role
	          User._count += 1
	  
	      # Factory class methods
	      @classmethod
	      def create_admin(cls, name: str, email: str) -> "User":
	          return cls(name, email, role="admin")
	  
	      @classmethod
	      def from_dict(cls, data: dict) -> "User":
	          return cls(data["name"], data["email"], data.get("role", "user"))
	  
	      @classmethod
	      def get_count(cls) -> int:
	          return cls._count
	  
	      def __repr__(self) -> str:
	          return f"User({self.name!r}, role={self.role!r})"
	  
	  
	  # Static method usage
	  print(MathUtils.lerp(0, 100, 0.25))   # 25.0
	  print(MathUtils.is_prime(17))         # True
	  print(MathUtils.circle_area(5))       # 78.53...
	  
	  # Class method / factory usage
	  u1 = User("Alice", "alice@example.com")
	  u2 = User.create_admin("Bob", "bob@example.com")
	  u3 = User.from_dict({"name": "Carol", "email": "carol@ex.com", "role": "mod"})
	  print(User.get_count())  # 3
	  print(u2)                # User('Bob', role='admin')
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <cmath>
	  
	  class MathUtils {
	  public:
	      static constexpr double PI = 3.14159265358979;
	  
	      static double clamp(double val, double lo, double hi) {
	          return std::max(lo, std::min(val, hi));
	      }
	      static double lerp(double a, double b, double t) {
	          return a + (b - a) * clamp(t, 0.0, 1.0);
	      }
	      static bool isPrime(int n) {
	          if (n < 2) return false;
	          for (int i = 2; i <= (int)std::sqrt(n); i++)
	              if (n % i == 0) return false;
	          return true;
	      }
	      static double circleArea(double radius) {
	          return PI * radius * radius;
	      }
	  };
	  
	  class User {
	  private:
	      static int count_;
	  
	  public:
	      std::string name, email, role;
	  
	      User(std::string name, std::string email, std::string role = "user")
	          : name(name), email(email), role(role) { ++count_; }
	  
	      static User createAdmin(const std::string& name, const std::string& email) {
	          return User(name, email, "admin");
	      }
	      static int getCount() { return count_; }
	  };
	  int User::count_ = 0;
	  
	  int main() {
	      std::cout << MathUtils::lerp(0, 100, 0.25) << "\n";  // 25
	      std::cout << MathUtils::isPrime(17) << "\n";         // 1
	  
	      User u1("Alice", "alice@ex.com");
	      User u2 = User::createAdmin("Bob", "bob@ex.com");
	      std::cout << User::getCount() << "\n";               // 2
	      std::cout << u2.name << ", " << u2.role << "\n";    // Bob, admin
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  public class StaticDemo {
	  
	      static class MathUtils {
	          public static final double PI = Math.PI;
	  
	          public static double clamp(double val, double lo, double hi) {
	              return Math.max(lo, Math.min(val, hi));
	          }
	          public static double lerp(double a, double b, double t) {
	              return a + (b - a) * clamp(t, 0, 1);
	          }
	          public static boolean isPrime(int n) {
	              if (n < 2) return false;
	              for (int i = 2; i <= Math.sqrt(n); i++)
	                  if (n % i == 0) return false;
	              return true;
	          }
	      }
	  
	      static class User {
	          private static int count = 0;
	          public final String name, email, role;
	  
	          public User(String name, String email, String role) {
	              this.name = name; this.email = email; this.role = role;
	              count++;
	          }
	          public static User createAdmin(String name, String email) {
	              return new User(name, email, "admin");
	          }
	          public static int getCount() { return count; }
	          public String toString() { return "User(" + name + ", " + role + ")"; }
	      }
	  
	      public static void main(String[] args) {
	          System.out.println(MathUtils.lerp(0, 100, 0.25)); // 25.0
	          System.out.println(MathUtils.isPrime(17));        // true
	  
	          User u1 = new User("Alice", "alice@ex.com", "user");
	          User u2 = User.createAdmin("Bob", "bob@ex.com");
	          System.out.println(User.getCount());  // 2
	          System.out.println(u2);               // User(Bob, admin)
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  class MathUtils {
	      static PI = Math.PI;
	  
	      static clamp(val, lo, hi) { return Math.max(lo, Math.min(val, hi)); }
	      static lerp(a, b, t) { return a + (b - a) * MathUtils.clamp(t, 0, 1); }
	      static isPrime(n) {
	          if (n < 2) return false;
	          for (let i = 2; i <= Math.sqrt(n); i++)
	              if (n % i === 0) return false;
	          return true;
	      }
	      static circleArea(r) { return MathUtils.PI * r * r; }
	  }
	  
	  class User {
	      static #count = 0;
	  
	      constructor(name, email, role = "user") {
	          this.name = name; this.email = email; this.role = role;
	          User.#count++;
	      }
	  
	      static createAdmin(name, email) { return new User(name, email, "admin"); }
	      static fromDict(data) { return new User(data.name, data.email, data.role); }
	      static getCount() { return User.#count; }
	      toString() { return `User(${this.name}, ${this.role})`; }
	  }
	  
	  console.log(MathUtils.lerp(0, 100, 0.25));  // 25
	  console.log(MathUtils.isPrime(17));          // true
	  
	  const u1 = new User("Alice", "alice@ex.com");
	  const u2 = User.createAdmin("Bob", "bob@ex.com");
	  console.log(User.getCount());                // 2
	  console.log(u2.toString());                  // User(Bob, admin)
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  
	  public static class MathUtils {
	      public const double PI = Math.PI;
	  
	      public static double Clamp(double val, double lo, double hi) =>
	          Math.Max(lo, Math.Min(val, hi));
	  
	      public static double Lerp(double a, double b, double t) =>
	          a + (b - a) * Clamp(t, 0, 1);
	  
	      public static bool IsPrime(int n) {
	          if (n < 2) return false;
	          for (int i = 2; i <= Math.Sqrt(n); i++)
	              if (n % i == 0) return false;
	          return true;
	      }
	  }
	  
	  public class User {
	      private static int count = 0;
	      public string Name { get; }
	      public string Email { get; }
	      public string Role { get; }
	  
	      public User(string name, string email, string role = "user") {
	          Name = name; Email = email; Role = role; count++;
	      }
	  
	      public static User CreateAdmin(string name, string email) =>
	          new User(name, email, "admin");
	  
	      public static int GetCount() => count;
	  
	      public override string ToString() => $"User({Name}, {Role})";
	  
	      static void Main() {
	          Console.WriteLine(MathUtils.Lerp(0, 100, 0.25)); // 25
	          Console.WriteLine(MathUtils.IsPrime(17));        // True
	  
	          var u1 = new User("Alice", "alice@ex.com");
	          var u2 = User.CreateAdmin("Bob", "bob@ex.com");
	          Console.WriteLine(User.GetCount());  // 2
	          Console.WriteLine(u2);               // User(Bob, admin)
	      }
	  }
	  ```
	  
	  :::
- # Key Takeaways
  collapsed:: true
	- **Instance methods** → need object state (`self`). The most common type.
	- **Class methods** (`@classmethod`) → receive `cls`, operate on class-level data. Perfect for **factory constructors** and **class-level counters**.
	- **Static methods** (`@staticmethod`) → no `self` or `cls`. Pure **utility functions** scoped inside a class for logical grouping.
	- In Java/C++/C#, `static` keyword on a method or field means it belongs to the class, shared by all instances.
	- Static fields/methods are accessed via `ClassName.method()` — not via an object instance.
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Real Python — staticmethod vs classmethod](https://realpython.com/instance-class-and-static-methods-demystified/)
		- [Python Docs — @staticmethod](https://docs.python.org/3/library/functions.html#staticmethod)
		- [Java Docs — Static Members](https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html)