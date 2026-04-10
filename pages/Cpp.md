---
seoTitle: C++ Programming Reference – Modern C++ Syntax and Features
description: "Comprehensive C++ reference covering STL, templates, smart pointers, lambdas, move semantics, C++11/14/17/20 features, and object-oriented programming patterns."
keywords: "cpp, C++ programming, C++ reference, STL, templates, smart pointers, lambdas, move semantics, C++17, C++20, object-oriented, modern C++, cpp notes, cpp cheatsheet, cpp guide, c++ tutorial, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: C++
---

- # History
- **How**:
	- Developed by **Bjarne Stroustrup** in 1979 at **Bell Labs**.
	- Originally called "C with Classes", renamed to **C++** in 1983.
	- Evolved through major standards: C++98, C++03, C++11, C++14, C++17, C++20, C++23.
-
- **Who**:
	- **Bjarne Stroustrup** — creator of C++, computer scientist at Bell Labs / AT&T.
-
- **Why**:
	- To add **object-oriented programming** to C while keeping its raw performance.
	- To support both **low-level system programming** and **high-level application development**.
	- To introduce abstractions (classes, templates, RAII) without sacrificing speed.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Performance & Control** — Direct memory access via pointers, zero-cost abstractions, ideal for games, OS, embedded systems.
		- **Multi-Paradigm** — Supports procedural, object-oriented, and generic programming (templates).
		- **STL** — Rich standard library: vectors, maps, algorithms, iterators.
		- **RAII** — Resource Acquisition Is Initialization ensures safe resource management.
		- **Compatibility with C** — Can integrate legacy C code directly.
		- **Cross-Platform** — Compiles on Linux, Windows, macOS, embedded targets.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Complex Syntax** — Steeper learning curve than Python or Java.
		- **Manual Memory Management** — Risk of memory leaks and segfaults without smart pointers.
		- **Long Compile Times** — Heavy template usage can slow builds significantly.
		- **No Garbage Collection** — Developer is responsible for memory lifecycle.
		- **Undefined Behavior** — Many operations (out-of-bounds, null deref) are UB, not exceptions.
-
- # Basics
	- ## Hello World & Entry Point
		- ```c++
		  #include <iostream>
		  
		  int main() {
		      std::cout << "Hello, World!" << std::endl;
		      return 0;
		  }
		  ```
		- `main()` is the program entry point, returns `int` (0 = success).
		- `#include <iostream>` brings in the standard I/O stream library.
	-
	- ## Comments
		- ```c++
		  // Single line comment
		  
		  /* Multi-line
		     comment */
		  
		  /// Doxygen-style doc comment (used for documentation generation)
		  ```
	-
	- ## Variables & Data Types
		- ```c++
		  int age = 25;             // Integer (4 bytes)
		  float price = 9.99f;      // Single precision float (4 bytes)
		  double pi = 3.14159265;   // Double precision float (8 bytes)
		  char grade = 'A';         // Single character (1 byte)
		  bool isActive = true;     // Boolean (1 byte)
		  std::string name = "VR bro"; // String (from <string>)
		  
		  // Constants
		  const int MAX = 100;
		  constexpr double TAX = 0.18; // Compile-time constant (C++11)
		  ```
	-
	- ## Primitive Data Types Table
		- ```
		  Type          Size        Range
		  bool          1 byte      true / false
		  char          1 byte      -128 to 127
		  int           4 bytes     -2,147,483,648 to 2,147,483,647
		  long          8 bytes     -9.2E18 to 9.2E18
		  float         4 bytes     ~6-7 decimal digits precision
		  double        8 bytes     ~15-16 decimal digits precision
		  long double   10/16 bytes extended precision
		  wchar_t       2/4 bytes   wide character
		  ```
	-
	- ## Type Modifiers
		- ```c++
		  unsigned int u = 4294967295U;  // no negative values
		  short int s = 32767; // 2 bytes (16 bits) , range -32,768 to 32,767
		  long long ll = 9223372036854775807LL;
		  unsigned long long ull = 18446744073709551615ULL;
		  ```
	-
	- ## auto & Type Deduction (C++11)
		- ```c++
		  auto x = 42;          // int
		  auto y = 3.14;        // double
		  auto z = "hello";     // const char*
		  auto s = std::string("hi"); // std::string
		  
		  // decltype — deduce type from expression
		  int a = 5;
		  decltype(a) b = 10;   // b is int
		  ```
	-
	- ## User Input
		- ```c++
		  #include <iostream>
		  #include <string>
		  
		  int main() {
		      int num;
		      std::string name;
		  
		      std::cout << "Enter a number: ";
		      std::cin >> num;
		  
		      std::cout << "Enter your name: ";
		      std::cin.ignore();
		      std::getline(std::cin, name); // reads full line with spaces
		  
		      std::cout << "Hello " << name << ", you entered " << num;
		  }
		  ```
	-
	- ## Operators
	  collapsed:: true
		- ```c++
		  // Arithmetic
		  +  -  *  /  %   // add, sub, mul, div, modulo
		  ++x  x++        // pre/post increment
		  --x  x--        // pre/post decrement
		  
		  // Relational
		  ==  !=  <  >  <=  >=
		  
		  // Logical
		  &&  ||  !
		  
		  // Bitwise
		  &   |   ^   ~   <<   >>
		  
		  // Assignment
		  =  +=  -=  *=  /=  %=  &=  |=  ^=  <<=  >>=
		  
		  // Ternary
		  int max = (a > b) ? a : b;
		  
		  // sizeof
		  std::cout << sizeof(int);   // 4
		  ```
	-
	- ## Type Casting
	  collapsed:: true
		- ```c++
		  // C-style (avoid in modern C++)
		  double d = (double)5 / 2;
		  
		  // C++ style casts (preferred)
		  int i = static_cast<int>(3.99);       // 3 — safe compile-time cast
		  
		  Base* b = new Derived();
		  Derived* d = dynamic_cast<Derived*>(b); // safe runtime downcast (needs RTTI)
		  
		  const int ci = 5;
		  int* p = const_cast<int*>(&ci);        // removes const (use carefully)
		  
		  int* ip = reinterpret_cast<int*>(0xDEAD); // low-level bit reinterpretation
		  ```
-
- # Control Flow
  collapsed:: true
	- ## if / else if / else
	  collapsed:: true
		- ```c++
		  int score = 85;
		  
		  if (score >= 90) {
		      std::cout << "A";
		  } else if (score >= 80) {
		      std::cout << "B";
		  } else if (score >= 70) {
		      std::cout << "C";
		  } else {
		      std::cout << "F";
		  }
		  // Output: B
		  ```
	-
	- ## Switch Statement
	  collapsed:: true
		- ```c++
		  int day = 3;
		  switch (day) {
		      case 1: std::cout << "Monday";    break;
		      case 2: std::cout << "Tuesday";   break;
		      case 3: std::cout << "Wednesday"; break;
		      default: std::cout << "Other";    break;
		  }
		  ```
	-
	- ## Ternary Operator
	  collapsed:: true
		- ```c++
		  //        condition ? if_true : if_false
		  int max = (a > b) ? a : b;
		  std::string label = (age >= 18) ? "Adult" : "Minor";
		  ```
	-
	- ## Loops
	  collapsed:: true
		- ```c++
		  // for loop
		  for (int i = 0; i < 5; i++) {
		      std::cout << i << " ";
		  }
		  // Output: 0 1 2 3 4
		  
		  // while loop
		  int i = 0;
		  while (i < 5) {
		      std::cout << i++;
		  }
		  
		  // do-while (executes at least once)
		  int n = 0;
		  do {
		      std::cout << n++;
		  } while (n < 3);
		  
		  // range-based for (C++11)
		  std::vector<int> nums = {1, 2, 3, 4, 5};
		  for (int n : nums) {
		      std::cout << n << " ";
		  }
		  
		  // range-based with auto & reference (efficient for large objects)
		  for (const auto& n : nums) {
		      std::cout << n << " ";
		  }
		  ```
	-
	- ## break / continue / goto
	  collapsed:: true
		- ```c++
		  for (int i = 0; i < 10; i++) {
		      if (i == 3) continue; // skip 3
		      if (i == 7) break;    // stop at 7
		      std::cout << i << " ";
		  }
		  // Output: 0 1 2 4 5 6
		  
		  // goto (avoid in modern code, but valid)
		  goto end;
		  std::cout << "skipped";
		  end:
		  std::cout << "reached end";
		  ```
-
- # Functions
  collapsed:: true
	- ## Declaration, Definition & Calling
	  collapsed:: true
		- ```c++
		  #include <iostream>
		  
		  int add(int a, int b); // declaration (prototype)
		  
		  int main() {
		      std::cout << add(3, 4); // calling → 7
		  }
		  
		  int add(int a, int b) { // definition
		      return a + b;
		  }
		  ```
	-
	- ## Default Arguments
	  collapsed:: true
		- ```c++
		  void greet(std::string name, std::string msg = "Hello") {
		      std::cout << msg << ", " << name;
		  }
		  
		  greet("Alice");          // Hello, Alice
		  greet("Bob", "Hi");      // Hi, Bob
		  ```
	-
	- ## Function Overloading
	  collapsed:: true
		- ```c++
		  int area(int side) { return side * side; }
		  int area(int w, int h) { return w * h; }
		  double area(double r) { return 3.14159 * r * r; }
		  
		  std::cout << area(5);       // 25
		  std::cout << area(3, 4);    // 12
		  std::cout << area(2.0);     // 12.566...
		  ```
	-
	- ## Pass by Value, Reference & Pointer
	  collapsed:: true
		- ```c++
		  void byValue(int x) { x = 99; }       // original unchanged
		  void byRef(int& x) { x = 99; }         // original changed
		  void byPtr(int* x) { *x = 99; }        // original changed via pointer
		  
		  int n = 5;
		  byValue(n); // n = 5
		  byRef(n);   // n = 99
		  byPtr(&n);  // n = 99
		  ```
	-
	- ## Inline Functions
	  collapsed:: true
		- ```c++
		  // Hint to compiler to expand function body at call site (avoids call overhead)
		  inline int square(int x) { return x * x; }
		  
		  std::cout << square(5); // 25
		  ```
	-
	- ## Recursive Functions
	  collapsed:: true
		- ```c++
		  int factorial(int n) {
		      if (n <= 1) return 1;
		      return n * factorial(n - 1);
		  }
		  
		  std::cout << factorial(5); // 120
		  ```
	-
	- ## Lambda Functions (C++11)
	  collapsed:: true
		- ```c++
		  // [capture](params) -> return_type { body }
		  
		  auto add = [](int a, int b) { return a + b; };
		  std::cout << add(3, 4); // 7
		  
		  int x = 10;
		  auto addX = [x](int n) { return n + x; };  // capture by value
		  auto addXRef = [&x](int n) { x += n; };    // capture by reference
		  
		  // capture all by value [=], all by ref [&]
		  auto all = [=]() { return x * 2; };
		  
		  // used with STL algorithms
		  std::vector<int> v = {3, 1, 4, 1, 5};
		  std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });
		  // v = {5, 4, 3, 1, 1}
		  ```
	-
	- ## std::function & Function Pointers
	  collapsed:: true
		- ```c++
		  #include <functional>
		  
		  // Function pointer
		  int (*fp)(int, int) = add;
		  std::cout << fp(2, 3); // 5
		  
		  // std::function — wraps any callable
		  std::function<int(int, int)> fn = add;
		  fn = [](int a, int b) { return a * b; };
		  std::cout << fn(3, 4); // 12
		  ```
-
- # Pointers & References
  collapsed:: true
	- ## Pointers Basics
	  collapsed:: true
		- ```c++
		  int val = 42;
		  int* ptr = &val;   // ptr holds address of val
		  
		  std::cout << val;   // 42  — value
		  std::cout << &val;  // 0x... — address
		  std::cout << ptr;   // 0x... — same address
		  std::cout << *ptr;  // 42  — dereference (value at address)
		  
		  *ptr = 99;          // modifies val through pointer
		  std::cout << val;   // 99
		  ```
	-
	- ## Pointer Arithmetic
	  collapsed:: true
		- ```c++
		  int arr[] = {10, 20, 30, 40};
		  int* p = arr;
		  
		  std::cout << *p;      // 10
		  std::cout << *(p+1);  // 20
		  std::cout << *(p+2);  // 30
		  
		  p++;                  // move to next element
		  std::cout << *p;      // 20
		  ```
	-
	- ## Null Pointer & nullptr (C++11)
	  collapsed:: true
		- ```c++
		  int* p = nullptr;  // preferred over NULL or 0 in modern C++
		  
		  if (p != nullptr) {
		      std::cout << *p;
		  } else {
		      std::cout << "null pointer";
		  }
		  ```
	-
	- ## References
	  collapsed:: true
		- ```c++
		  int a = 10;
		  int& ref = a;  // ref is an alias for a
		  
		  ref = 20;      // a is now 20
		  std::cout << a; // 20
		  
		  // References vs Pointers:
		  // - References cannot be null, pointers can
		  // - References cannot be reassigned, pointers can
		  // - References are safer and cleaner for most use cases
		  ```
	-
	- ## const Pointers
	  collapsed:: true
		- ```c++
		  int x = 5, y = 10;
		  
		  const int* p1 = &x;    // pointer to const — can't change *p1
		  int* const p2 = &x;    // const pointer — can't change p2 itself
		  const int* const p3 = &x; // both const
		  
		  // p1 = &y;  ✓ (can change where it points)
		  // *p1 = 9;  ✗ (can't change value)
		  // p2 = &y;  ✗ (can't change pointer)
		  // *p2 = 9;  ✓ (can change value)
		  ```
	-
	- ## Dynamic Memory (new / delete)
	  collapsed:: true
		- ```c++
		  // Allocate single value
		  int* p = new int(42);
		  std::cout << *p;  // 42
		  delete p;         // free memory
		  p = nullptr;      // good practice
		  
		  // Allocate array
		  int* arr = new int[5]{1, 2, 3, 4, 5};
		  std::cout << arr[2]; // 3
		  delete[] arr;        // must use delete[] for arrays
		  
		  // Prefer smart pointers over raw new/delete in modern C++
		  ```
-
- # Arrays & Strings
  collapsed:: true
	- ## C-Style Arrays
	  collapsed:: true
		- ```c++
		  int marks[5] = {92, 87, 95, 78, 88};
		  
		  std::cout << marks[0];  // 92
		  marks[1] = 99;
		  
		  // size of array
		  int size = sizeof(marks) / sizeof(marks[0]); // 5
		  
		  // 2D array
		  int grid[2][3] = {{1, 2, 3}, {4, 5, 6}};
		  std::cout << grid[1][2]; // 6
		  ```
	-
	- ## std::array (C++11) — Preferred over C arrays
	  collapsed:: true
		- ```c++
		  #include <array>
		  
		  std::array<int, 5> arr = {1, 2, 3, 4, 5};
		  
		  std::cout << arr[0];        // 1
		  std::cout << arr.size();    // 5
		  std::cout << arr.front();   // 1
		  std::cout << arr.back();    // 5
		  arr.fill(0);                // set all to 0
		  
		  // iterate
		  for (const auto& x : arr) std::cout << x << " ";
		  ```
	-
	- ## std::string
	  collapsed:: true
		- ```c++
		  #include <string>
		  
		  std::string s = "Hello, World!";
		  
		  std::cout << s.length();        // 13
		  std::cout << s.size();          // 13 (same as length)
		  std::cout << s[0];              // H
		  std::cout << s.substr(7, 5);    // World
		  std::cout << s.find("World");   // 7
		  
		  s += " C++";                    // concatenation
		  s.replace(7, 5, "C++");        // replace "World" with "C++"
		  s.erase(5, 2);                 // erase 2 chars at index 5
		  
		  // convert
		  int n = std::stoi("42");        // string to int
		  std::string str = std::to_string(99); // int to string
		  
		  // compare
		  if (s == "Hello") { ... }
		  if (s.compare("Hello") == 0) { ... }
		  
		  // empty check
		  if (s.empty()) { ... }
		  ```
	-
	- ## String Views (C++17) — Zero-copy string reference
	  collapsed:: true
		- ```c++
		  #include <string_view>
		  
		  void print(std::string_view sv) {
		      std::cout << sv;  // no copy made
		  }
		  
		  std::string s = "Hello";
		  print(s);         // works with std::string
		  print("World");   // works with string literals
		  ```
-
- # OOP — Object-Oriented Programming
	- [[DSA Algo & System Design]] - visit this page for in-depth Learning
	-
	- ## Classes & Objects
	  collapsed:: true
		- ```c++
		  class Car {
		  public:
		      std::string brand;
		      int year;
		  
		      void display() {
		          std::cout << brand << " (" << year << ")\n";
		      }
		  };
		  
		  Car c;
		  c.brand = "Toyota";
		  c.year = 2022;
		  c.display(); // Toyota (2022)
		  ```
	-
	- ## Constructors & Destructors
	  collapsed:: true
		- ```c++
		  class Person {
		  public:
		      std::string name;
		      int age;
		  
		      // Default constructor
		      Person() : name("Unknown"), age(0) {}
		  
		      // Parameterized constructor
		      Person(std::string n, int a) : name(n), age(a) {}
		  
		      // Copy constructor
		      Person(const Person& other) : name(other.name), age(other.age) {}
		  
		      // Destructor
		      ~Person() {
		          std::cout << name << " destroyed\n";
		      }
		  
		      void show() { std::cout << name << ", " << age << "\n"; }
		  };
		  
		  Person p1("Alice", 30);
		  Person p2 = p1;          // copy constructor
		  p1.show();               // Alice, 30
		  ```
	-
	- ## Access Modifiers
	  collapsed:: true
		- ```c++
		  class BankAccount {
		  public:
		      std::string owner;    // accessible everywhere
		  
		  protected:
		      double balance;       // accessible in class + subclasses
		  
		  private:
		      std::string pin;      // accessible only inside this class
		  };
		  ```
	-
	- ## Getters & Setters (Encapsulation)
	  collapsed:: true
		- ```c++
		  class Temperature {
		  private:
		      double celsius;
		  
		  public:
		      void setCelsius(double c) {
		          if (c >= -273.15) celsius = c;
		      }
		      double getCelsius() const { return celsius; }
		      double getFahrenheit() const { return celsius * 9.0/5.0 + 32; }
		  };
		  
		  Temperature t;
		  t.setCelsius(100);
		  std::cout << t.getFahrenheit(); // 212
		  ```
	-
	- ## Static Members
	  collapsed:: true
		- ```c++
		  class Counter {
		  public:
		      static int count;  // shared across all instances
		  
		      Counter() { count++; }
		      ~Counter() { count--; }
		  
		      static int getCount() { return count; } // static method
		  };
		  
		  int Counter::count = 0; // must define outside class
		  
		  Counter a, b, c;
		  std::cout << Counter::getCount(); // 3
		  ```
	-
	- ## Friend Functions & Classes
	  collapsed:: true
		- ```c++
		  class Box {
		  private:
		      double width;
		  public:
		      Box(double w) : width(w) {}
		      friend double getWidth(Box b); // friend function declaration
		  };
		  
		  double getWidth(Box b) {
		      return b.width; // can access private member
		  }
		  
		  Box b(5.5);
		  std::cout << getWidth(b); // 5.5
		  ```
	-
	- ## Operator Overloading
	  collapsed:: true
		- ```c++
		  class Vector2D {
		  public:
		      float x, y;
		      Vector2D(float x, float y) : x(x), y(y) {}
		  
		      // Overload +
		      Vector2D operator+(const Vector2D& other) const {
		          return Vector2D(x + other.x, y + other.y);
		      }
		  
		      // Overload <<
		      friend std::ostream& operator<<(std::ostream& os, const Vector2D& v) {
		          return os << "(" << v.x << ", " << v.y << ")";
		      }
		  };
		  
		  Vector2D a(1, 2), b(3, 4);
		  std::cout << a + b; // (4, 6)
		  ```
-
- # OOP — Inheritance
  collapsed:: true
	- ## Single Inheritance
	  collapsed:: true
		- ```c++
		  class Animal {
		  public:
		      std::string name;
		      Animal(std::string n) : name(n) {}
		      void eat() { std::cout << name << " is eating\n"; }
		  };
		  
		  class Dog : public Animal {
		  public:
		      Dog(std::string n) : Animal(n) {}
		      void bark() { std::cout << name << " says Woof!\n"; }
		  };
		  
		  Dog d("Rex");
		  d.eat();   // Rex is eating
		  d.bark();  // Rex says Woof!
		  ```
	-
	- ## Inheritance Types
	  collapsed:: true
		- ```c++
		  class Base { ... };
		  
		  class PublicDerived    : public Base    { ... }; // public → public, protected → protected
		  class ProtectedDerived : protected Base { ... }; // public → protected
		  class PrivateDerived   : private Base   { ... }; // all → private
		  ```
	-
	- ## Multi-Level & Multiple Inheritance
	  collapsed:: true
		- ```c++
		  // Multi-level
		  class A { public: void hello() { std::cout << "A\n"; } };
		  class B : public A {};
		  class C : public B {};  // C inherits from B which inherits from A
		  
		  C obj;
		  obj.hello(); // A
		  
		  // Multiple inheritance
		  class Flyable { public: void fly() { std::cout << "Flying\n"; } };
		  class Swimmable { public: void swim() { std::cout << "Swimming\n"; } };
		  
		  class Duck : public Flyable, public Swimmable {};
		  
		  Duck d;
		  d.fly();   // Flying
		  d.swim();  // Swimming
		  ```
	-
	- ## Virtual Inheritance (Diamond Problem Fix)
	  collapsed:: true
		- ```c++
		  class A { public: int x = 1; };
		  class B : virtual public A {};
		  class C : virtual public A {};
		  class D : public B, public C {}; // only one copy of A
		  
		  D obj;
		  std::cout << obj.x; // 1 — no ambiguity
		  ```
	-
	- ## Constructor Chaining
	  collapsed:: true
		- ```c++
		  class Shape {
		  public:
		      std::string color;
		      Shape(std::string c) : color(c) {
		          std::cout << "Shape created\n";
		      }
		  };
		  
		  class Circle : public Shape {
		  public:
		      double radius;
		      Circle(std::string c, double r) : Shape(c), radius(r) {
		          std::cout << "Circle created\n";
		      }
		  };
		  
		  Circle ci("red", 5.0);
		  // Output:
		  // Shape created
		  // Circle created
		  ```
-
- # OOP — Polymorphism
  collapsed:: true
	- ## Virtual Functions & Runtime Polymorphism
	  collapsed:: true
		- ```c++
		  class Shape {
		  public:
		      virtual double area() const { return 0; }  // virtual
		      virtual void draw() const { std::cout << "Drawing shape\n"; }
		      virtual ~Shape() {}  // always virtual destructor in base class
		  };
		  
		  class Circle : public Shape {
		      double r;
		  public:
		      Circle(double r) : r(r) {}
		      double area() const override { return 3.14159 * r * r; }
		      void draw() const override { std::cout << "Drawing circle\n"; }
		  };
		  
		  class Rectangle : public Shape {
		      double w, h;
		  public:
		      Rectangle(double w, double h) : w(w), h(h) {}
		      double area() const override { return w * h; }
		      void draw() const override { std::cout << "Drawing rectangle\n"; }
		  };
		  
		  // Polymorphic usage via base pointer
		  Shape* s1 = new Circle(5);
		  Shape* s2 = new Rectangle(4, 6);
		  
		  s1->draw();           // Drawing circle
		  s2->draw();           // Drawing rectangle
		  std::cout << s1->area(); // 78.539...
		  
		  delete s1; delete s2;
		  ```
	-
	- ## Pure Virtual Functions & Abstract Classes
	  collapsed:: true
		- ```c++
		  class Animal {
		  public:
		      virtual void sound() = 0;  // pure virtual — makes class abstract
		      virtual ~Animal() {}
		  };
		  
		  // Animal a; // ERROR — cannot instantiate abstract class
		  
		  class Dog : public Animal {
		  public:
		      void sound() override { std::cout << "Woof!\n"; }
		  };
		  
		  class Cat : public Animal {
		  public:
		      void sound() override { std::cout << "Meow!\n"; }
		  };
		  
		  Animal* a = new Dog();
		  a->sound(); // Woof!
		  delete a;
		  ```
	-
	- ## override & final (C++11)
	  collapsed:: true
		- ```c++
		  class Base {
		  public:
		      virtual void foo() {}
		      virtual void bar() {}
		  };
		  
		  class Derived : public Base {
		  public:
		      void foo() override {}       // override — compiler checks it actually overrides
		      void bar() override final {} // final — no further override allowed
		  };
		  
		  class Leaf : public Derived {
		      // void bar() override {} // ERROR — bar is final
		  };
		  ```
	-
	- ## vtable & vptr (How Virtual Works Internally)
	  collapsed:: true
		- Each class with virtual functions has a **vtable** (virtual function table).
		- Each object has a hidden **vptr** pointing to its class's vtable.
		- At runtime, the correct function is looked up via the vtable — this is **dynamic dispatch**.
		- ```c++
		  // Conceptually:
		  // Circle vtable → { &Circle::area, &Circle::draw }
		  // Rectangle vtable → { &Rectangle::area, &Rectangle::draw }
		  
		  Shape* s = new Circle(3);
		  s->area(); // looks up Circle::area via vptr → vtable
		  ```
-
- # OOP — Advanced Concepts
  collapsed:: true
	- ## Rule of Three / Five / Zero
	  collapsed:: true
		- ```c++
		  // Rule of Three: if you define any of these, define all three:
		  // destructor, copy constructor, copy assignment operator
		  
		  // Rule of Five (C++11): also define move constructor & move assignment
		  
		  class Buffer {
		      int* data;
		      size_t size;
		  public:
		      Buffer(size_t s) : size(s), data(new int[s]) {}
		  
		      ~Buffer() { delete[] data; }                          // destructor
		  
		      Buffer(const Buffer& o) : size(o.size), data(new int[o.size]) {
		          std::copy(o.data, o.data + size, data);           // copy constructor
		      }
		  
		      Buffer& operator=(const Buffer& o) {                  // copy assignment
		          if (this != &o) {
		              delete[] data;
		              size = o.size;
		              data = new int[size];
		              std::copy(o.data, o.data + size, data);
		          }
		          return *this;
		      }
		  
		      Buffer(Buffer&& o) noexcept : size(o.size), data(o.data) { // move constructor
		          o.data = nullptr; o.size = 0;
		      }
		  
		      Buffer& operator=(Buffer&& o) noexcept {              // move assignment
		          if (this != &o) {
		              delete[] data;
		              data = o.data; size = o.size;
		              o.data = nullptr; o.size = 0;
		          }
		          return *this;
		      }
		  };
		  
		  // Rule of Zero: use smart pointers/STL — no manual resource management needed
		  ```
	-
	- ## Move Semantics & rvalue References (C++11)
	  collapsed:: true
		- ```c++
		  std::string a = "Hello";
		  std::string b = std::move(a); // moves a's data into b — no copy
		  // a is now in valid but unspecified state
		  
		  // rvalue reference: T&&
		  void process(std::string&& s) {
		      std::cout << "moved: " << s;
		  }
		  process(std::move(b));
		  
		  // std::move doesn't move — it casts to rvalue reference
		  // actual move happens in move constructor/assignment
		  ```
	-
	- ## RAII (Resource Acquisition Is Initialization)
	  collapsed:: true
		- ```c++
		  // Core C++ idiom: tie resource lifetime to object lifetime
		  // Resource acquired in constructor, released in destructor
		  
		  class FileHandle {
		      FILE* file;
		  public:
		      FileHandle(const char* path) {
		          file = fopen(path, "r");
		          if (!file) throw std::runtime_error("Cannot open file");
		      }
		      ~FileHandle() {
		          if (file) fclose(file); // always released, even on exception
		      }
		      FILE* get() { return file; }
		  };
		  
		  {
		      FileHandle f("data.txt"); // acquired
		      // use f.get()...
		  } // destructor called here — file closed automatically
		  ```
-
- # Smart Pointers (C++11)
  collapsed:: true
	- ## unique_ptr — Exclusive Ownership
	  collapsed:: true
		- ```c++
		  #include <memory>
		  
		  std::unique_ptr<int> p = std::make_unique<int>(42);
		  std::cout << *p; // 42
		  
		  // cannot copy, only move
		  std::unique_ptr<int> p2 = std::move(p);
		  // p is now nullptr
		  
		  // with custom class
		  auto obj = std::make_unique<Person>("Alice", 30);
		  obj->show();
		  // automatically deleted when out of scope — no delete needed
		  ```
	-
	- ## shared_ptr — Shared Ownership
	  collapsed:: true
		- ```c++
		  auto sp1 = std::make_shared<int>(100);
		  auto sp2 = sp1;  // both own the resource
		  
		  std::cout << sp1.use_count(); // 2 — reference count
		  std::cout << *sp1;            // 100
		  
		  sp1.reset(); // sp1 releases ownership
		  std::cout << sp2.use_count(); // 1
		  // resource deleted when last shared_ptr goes out of scope
		  ```
	-
	- ## weak_ptr — Non-Owning Observer
	  collapsed:: true
		- ```c++
		  // Breaks circular references between shared_ptrs
		  auto sp = std::make_shared<int>(50);
		  std::weak_ptr<int> wp = sp;
		  
		  std::cout << wp.use_count(); // 1 (weak_ptr doesn't increase count)
		  
		  if (auto locked = wp.lock()) { // lock() returns shared_ptr if still alive
		      std::cout << *locked;      // 50
		  }
		  
		  sp.reset(); // resource freed
		  std::cout << wp.expired(); // 1 (true — resource gone)
		  ```
	-
	- ## Smart Pointer Comparison
	  collapsed:: true
		- ```
		  Type          Ownership       Copyable    Use Case
		  unique_ptr    Exclusive        No         Single owner, factory returns
		  shared_ptr    Shared (ref cnt) Yes        Multiple owners, shared data
		  weak_ptr      None (observer)  Yes        Break cycles, cache, observer
		  ```
-
- # Templates & Generic Programming
  collapsed:: true
	- ## Function Templates
	  collapsed:: true
		- ```c++
		  template <typename T>
		  T maxOf(T a, T b) {
		      return (a > b) ? a : b;
		  }
		  
		  std::cout << maxOf(3, 7);       // 7 (int)
		  std::cout << maxOf(3.5, 2.1);   // 3.5 (double)
		  std::cout << maxOf('a', 'z');   // z (char)
		  
		  // Multiple type params
		  template <typename T, typename U>
		  auto add(T a, U b) -> decltype(a + b) {
		      return a + b;
		  }
		  ```
	-
	- ## Class Templates
	  collapsed:: true
		- ```c++
		  template <typename T>
		  class Stack {
		      std::vector<T> data;
		  public:
		      void push(T val) { data.push_back(val); }
		      void pop() { data.pop_back(); }
		      T top() const { return data.back(); }
		      bool empty() const { return data.empty(); }
		  };
		  
		  Stack<int> si;
		  si.push(1); si.push(2); si.push(3);
		  std::cout << si.top(); // 3
		  
		  Stack<std::string> ss;
		  ss.push("hello");
		  ```
	-
	- ## Template Specialization
	  collapsed:: true
		- ```c++
		  template <typename T>
		  void print(T val) { std::cout << "Generic: " << val; }
		  
		  // Full specialization for bool
		  template <>
		  void print<bool>(bool val) {
		      std::cout << (val ? "true" : "false");
		  }
		  
		  print(42);    // Generic: 42
		  print(true);  // true
		  ```
	-
	- ## Variadic Templates (C++11)
	  collapsed:: true
		- ```c++
		  // Accept any number of arguments of any types
		  template <typename... Args>
		  void log(Args... args) {
		      (std::cout << ... << args) << "\n"; // fold expression (C++17)
		  }
		  
		  log("Value: ", 42, " and ", 3.14);
		  // Output: Value: 42 and 3.14
		  ```
	-
	- ## Concepts (C++20) — Constrained Templates
	  collapsed:: true
		- ```c++
		  #include <concepts>
		  
		  // Define a concept
		  template <typename T>
		  concept Numeric = std::integral<T> || std::floating_point<T>;
		  
		  // Use concept to constrain template
		  template <Numeric T>
		  T square(T x) { return x * x; }
		  
		  std::cout << square(5);    // 25
		  std::cout << square(2.5);  // 6.25
		  // square("hi");           // compile error — not Numeric
		  
		  // Shorthand with auto
		  auto multiply(Numeric auto a, Numeric auto b) { return a * b; }
		  ```
-
- # STL — Standard Template Library
  collapsed:: true
	- ## Containers Overview
	  collapsed:: true
		- ```
		  Container         Type              Use Case
		  vector            Sequence          Dynamic array, fast random access
		  deque             Sequence          Fast insert/remove at both ends
		  list              Sequence          Fast insert/remove anywhere
		  array             Sequence          Fixed-size array
		  stack             Adaptor           LIFO
		  queue             Adaptor           FIFO
		  priority_queue    Adaptor           Max-heap by default
		  set               Associative       Unique sorted keys
		  multiset          Associative       Sorted keys, duplicates allowed
		  map               Associative       Key-value, sorted by key
		  multimap          Associative       Key-value, duplicate keys allowed
		  unordered_set     Unordered         Hash set, O(1) avg lookup
		  unordered_map     Unordered         Hash map, O(1) avg lookup
		  ```
	-
	- ## vector
	  collapsed:: true
		- ```c++
		  #include <vector>
		  
		  std::vector<int> v = {1, 2, 3};
		  
		  v.push_back(4);       // {1,2,3,4}
		  v.pop_back();         // {1,2,3}
		  v.insert(v.begin()+1, 99); // {1,99,2,3}
		  v.erase(v.begin()+1); // {1,2,3}
		  
		  std::cout << v[0];    // 1
		  std::cout << v.at(1); // 2 (bounds-checked)
		  std::cout << v.size();// 3
		  std::cout << v.front(); // 1
		  std::cout << v.back();  // 3
		  
		  v.reserve(100);       // pre-allocate capacity
		  v.clear();            // remove all elements
		  
		  // iterate
		  for (auto& x : v) std::cout << x << " ";
		  ```
	-
	- ## map & unordered_map
	  collapsed:: true
		- ```c++
		  #include <map>
		  #include <unordered_map>
		  
		  std::map<std::string, int> scores;
		  scores["Alice"] = 95;
		  scores["Bob"] = 87;
		  scores.insert({"Charlie", 91});
		  
		  std::cout << scores["Alice"];   // 95
		  std::cout << scores.count("Bob"); // 1 (exists)
		  scores.erase("Bob");
		  
		  for (const auto& [key, val] : scores) { // structured bindings C++17
		      std::cout << key << ": " << val << "\n";
		  }
		  
		  // unordered_map — O(1) avg, no ordering
		  std::unordered_map<std::string, int> umap;
		  umap["x"] = 10;
		  ```
	-
	- ## set & unordered_set
	  collapsed:: true
		- ```c++
		  #include <set>
		  
		  std::set<int> s = {5, 3, 1, 4, 2};
		  // automatically sorted: {1,2,3,4,5}
		  
		  s.insert(6);
		  s.erase(3);
		  std::cout << s.count(4); // 1 (exists)
		  
		  for (int x : s) std::cout << x << " "; // 1 2 4 5 6
		  ```
	-
	- ## stack, queue, priority_queue
	  collapsed:: true
		- ```c++
		  #include <stack>
		  #include <queue>
		  
		  // Stack (LIFO)
		  std::stack<int> st;
		  st.push(1); st.push(2); st.push(3);
		  std::cout << st.top(); // 3
		  st.pop();
		  
		  // Queue (FIFO)
		  std::queue<int> q;
		  q.push(1); q.push(2); q.push(3);
		  std::cout << q.front(); // 1
		  q.pop();
		  
		  // Priority Queue (max-heap by default)
		  std::priority_queue<int> pq;
		  pq.push(3); pq.push(1); pq.push(5);
		  std::cout << pq.top(); // 5
		  
		  // Min-heap
		  std::priority_queue<int, std::vector<int>, std::greater<int>> minpq;
		  minpq.push(3); minpq.push(1); minpq.push(5);
		  std::cout << minpq.top(); // 1
		  ```
	-
	- ## STL Algorithms
	  collapsed:: true
		- ```c++
		  #include <algorithm>
		  #include <numeric>
		  
		  std::vector<int> v = {5, 3, 1, 4, 2};
		  
		  std::sort(v.begin(), v.end());              // {1,2,3,4,5}
		  std::sort(v.begin(), v.end(), std::greater<int>()); // {5,4,3,2,1}
		  
		  std::reverse(v.begin(), v.end());
		  
		  auto it = std::find(v.begin(), v.end(), 3);
		  if (it != v.end()) std::cout << "found at " << (it - v.begin());
		  
		  int sum = std::accumulate(v.begin(), v.end(), 0); // sum all
		  int mx  = *std::max_element(v.begin(), v.end());
		  int mn  = *std::min_element(v.begin(), v.end());
		  
		  std::count(v.begin(), v.end(), 3);          // count occurrences of 3
		  
		  // transform — apply function to each element
		  std::transform(v.begin(), v.end(), v.begin(), [](int x){ return x * 2; });
		  
		  // remove_if + erase idiom
		  v.erase(std::remove_if(v.begin(), v.end(), [](int x){ return x % 2 == 0; }), v.end());
		  
		  // binary search (requires sorted range)
		  std::sort(v.begin(), v.end());
		  bool found = std::binary_search(v.begin(), v.end(), 3);
		  ```
	-
	- ## Iterators
	  collapsed:: true
		- ```c++
		  std::vector<int> v = {10, 20, 30, 40};
		  
		  auto it = v.begin();   // iterator to first element
		  auto end = v.end();    // iterator past last element
		  
		  std::cout << *it;      // 10
		  ++it;
		  std::cout << *it;      // 20
		  
		  // reverse iterator
		  for (auto rit = v.rbegin(); rit != v.rend(); ++rit)
		      std::cout << *rit << " "; // 40 30 20 10
		  
		  // const iterator
		  for (auto cit = v.cbegin(); cit != v.cend(); ++cit)
		      std::cout << *cit << " ";
		  ```
-
- # Exception Handling
  collapsed:: true
	- ## try / catch / throw
	  collapsed:: true
		- ```c++
		  #include <stdexcept>
		  
		  double divide(double a, double b) {
		      if (b == 0) throw std::invalid_argument("Division by zero");
		      return a / b;
		  }
		  
		  try {
		      std::cout << divide(10, 2);  // 5
		      std::cout << divide(10, 0);  // throws
		  } catch (const std::invalid_argument& e) {
		      std::cerr << "Error: " << e.what();
		  } catch (const std::exception& e) {
		      std::cerr << "Exception: " << e.what();
		  } catch (...) {
		      std::cerr << "Unknown exception";
		  }
		  ```
	-
	- ## Standard Exception Hierarchy
	  collapsed:: true
		- ```
		  std::exception
		  ├── std::logic_error
		  │   ├── std::invalid_argument
		  │   ├── std::out_of_range
		  │   └── std::length_error
		  └── std::runtime_error
		      ├── std::overflow_error
		      ├── std::underflow_error
		      └── std::range_error
		  ```
	-
	- ## Custom Exceptions
	  collapsed:: true
		- ```c++
		  class AppError : public std::exception {
		      std::string msg;
		  public:
		      AppError(std::string m) : msg(m) {}
		      const char* what() const noexcept override { return msg.c_str(); }
		  };
		  
		  throw AppError("Something went wrong");
		  ```
	-
	- ## noexcept (C++11)
	  collapsed:: true
		- ```c++
		  void safeFunc() noexcept {
		      // guarantees no exception is thrown
		      // if one is thrown, std::terminate() is called
		  }
		  
		  // noexcept is important for move constructors — enables optimizations
		  Buffer(Buffer&& o) noexcept { ... }
		  ```
-
- # Modern C++ Features
  collapsed:: true
	- ## C++11 Key Features
	  collapsed:: true
		- ```c++
		  // auto type deduction
		  auto x = 42;
		  
		  // Range-based for
		  for (const auto& item : container) { ... }
		  
		  // nullptr
		  int* p = nullptr;
		  
		  // Lambda expressions
		  auto fn = [](int x) { return x * 2; };
		  
		  // Smart pointers
		  auto sp = std::make_shared<MyClass>();
		  
		  // Move semantics
		  std::string s = std::move(other);
		  
		  // Initializer lists
		  std::vector<int> v = {1, 2, 3, 4, 5};
		  
		  // constexpr
		  constexpr int SIZE = 256;
		  
		  // static_assert
		  static_assert(sizeof(int) == 4, "int must be 4 bytes");
		  
		  // Delegating constructors
		  class Foo {
		      Foo(int x) : Foo(x, 0) {}
		      Foo(int x, int y) { ... }
		  };
		  
		  // override & final
		  void foo() override final {}
		  
		  // Scoped enums
		  enum class Color { Red, Green, Blue };
		  Color c = Color::Red;
		  ```
	-
	- ## C++14 Key Features
	  collapsed:: true
		- ```c++
		  // Generic lambdas
		  auto add = [](auto a, auto b) { return a + b; };
		  
		  // Return type deduction
		  auto square(int x) { return x * x; }
		  
		  // std::make_unique
		  auto p = std::make_unique<int>(42);
		  
		  // Binary literals & digit separators
		  int flags = 0b1010'1010;
		  long big = 1'000'000;
		  ```
	-
	- ## C++17 Key Features
	  collapsed:: true
		- ```c++
		  // Structured bindings
		  auto [x, y] = std::pair{1, 2};
		  for (auto& [key, val] : myMap) { ... }
		  
		  // if constexpr — compile-time branching
		  template <typename T>
		  void process(T val) {
		      if constexpr (std::is_integral_v<T>) {
		          std::cout << "integer: " << val;
		      } else {
		          std::cout << "other: " << val;
		      }
		  }
		  
		  // std::optional — value that may or may not exist
		  #include <optional>
		  std::optional<int> findValue(bool found) {
		      if (found) return 42;
		      return std::nullopt;
		  }
		  auto val = findValue(true);
		  if (val) std::cout << *val; // 42
		  
		  // std::variant — type-safe union
		  #include <variant>
		  std::variant<int, double, std::string> v = "hello";
		  std::cout << std::get<std::string>(v);
		  
		  // std::any — holds any type
		  #include <any>
		  std::any a = 42;
		  a = std::string("hello");
		  std::cout << std::any_cast<std::string>(a);
		  
		  // Filesystem
		  #include <filesystem>
		  namespace fs = std::filesystem;
		  fs::create_directory("mydir");
		  for (auto& entry : fs::directory_iterator(".")) {
		      std::cout << entry.path() << "\n";
		  }
		  
		  // Parallel algorithms
		  #include <execution>
		  std::sort(std::execution::par, v.begin(), v.end());
		  ```
	-
	- ## C++20 Key Features
	  collapsed:: true
		- ```c++
		  // Concepts (see Templates section)
		  template <std::integral T>
		  T gcd(T a, T b) { return b ? gcd(b, a % b) : a; }
		  
		  // Ranges — composable, lazy algorithms
		  #include <ranges>
		  auto v = std::vector{1,2,3,4,5,6,7,8,9,10};
		  auto result = v | std::views::filter([](int x){ return x % 2 == 0; })
		                  | std::views::transform([](int x){ return x * x; });
		  for (int x : result) std::cout << x << " "; // 4 16 36 64 100
		  
		  // Coroutines (co_await, co_yield, co_return)
		  #include <coroutine>
		  // Used for async code, generators, lazy sequences
		  
		  // std::span — non-owning view over contiguous data
		  #include <span>
		  void process(std::span<int> data) {
		      for (int x : data) std::cout << x;
		  }
		  int arr[] = {1,2,3};
		  process(arr);
		  
		  // Three-way comparison operator <=>
		  auto result = (5 <=> 3); // std::strong_ordering::greater
		  
		  // Modules (replaces #include for large projects)
		  // import std;  // import entire standard library (compiler support varies)
		  
		  // consteval — must be evaluated at compile time
		  consteval int square(int x) { return x * x; }
		  constexpr int s = square(5); // 25
		  ```
	-
	- ## C++23 Highlights
	  collapsed:: true
		- ```c++
		  // std::print / std::println (finally!)
		  #include <print>
		  std::println("Hello, {}!", "World");
		  std::print("x = {}, y = {}\n", 1, 2);
		  
		  // std::expected — error handling without exceptions
		  #include <expected>
		  std::expected<int, std::string> divide(int a, int b) {
		      if (b == 0) return std::unexpected("division by zero");
		      return a / b;
		  }
		  auto r = divide(10, 2);
		  if (r) std::cout << *r;
		  else std::cout << r.error();
		  
		  // std::flat_map / std::flat_set — cache-friendly sorted containers
		  // Deducing this (explicit object parameter)
		  struct Widget {
		      auto& value(this auto& self) { return self.val; }
		      int val;
		  };
		  ```
-
- # Concurrency & Multithreading
  collapsed:: true
	- ## std::thread (C++11)
	  collapsed:: true
		- ```c++
		  #include <thread>
		  #include <iostream>
		  
		  void task(int id) {
		      std::cout << "Thread " << id << " running\n";
		  }
		  
		  int main() {
		      std::thread t1(task, 1);
		      std::thread t2(task, 2);
		  
		      t1.join(); // wait for t1 to finish
		      t2.join(); // wait for t2 to finish
		  
		      // t.detach() — run independently (fire and forget)
		  }
		  ```
	-
	- ## Mutex & Lock Guard
	  collapsed:: true
		- ```c++
		  #include <mutex>
		  
		  std::mutex mtx;
		  int counter = 0;
		  
		  void increment() {
		      std::lock_guard<std::mutex> lock(mtx); // RAII lock — auto-unlocks
		      counter++;
		  }
		  
		  // unique_lock — more flexible (can unlock manually)
		  void process() {
		      std::unique_lock<std::mutex> lock(mtx);
		      // do work...
		      lock.unlock();
		      // do non-critical work...
		      lock.lock();
		  }
		  ```
	-
	- ## Condition Variables
	  collapsed:: true
		- ```c++
		  #include <condition_variable>
		  
		  std::mutex mtx;
		  std::condition_variable cv;
		  bool ready = false;
		  
		  void worker() {
		      std::unique_lock<std::mutex> lock(mtx);
		      cv.wait(lock, []{ return ready; }); // wait until ready == true
		      std::cout << "Worker running\n";
		  }
		  
		  void producer() {
		      std::lock_guard<std::mutex> lock(mtx);
		      ready = true;
		      cv.notify_one(); // wake one waiting thread
		  }
		  ```
	-
	- ## std::async & std::future
	  collapsed:: true
		- ```c++
		  #include <future>
		  
		  int compute(int x) { return x * x; }
		  
		  // Launch async task
		  std::future<int> f = std::async(std::launch::async, compute, 5);
		  
		  // Do other work...
		  
		  int result = f.get(); // blocks until result is ready
		  std::cout << result;  // 25
		  
		  // std::promise — manually set a future value
		  std::promise<int> p;
		  std::future<int> fut = p.get_future();
		  std::thread t([&p]{ p.set_value(42); });
		  std::cout << fut.get(); // 42
		  t.join();
		  ```
	-
	- ## Atomic Operations (C++11)
	  collapsed:: true
		- ```c++
		  #include <atomic>
		  
		  std::atomic<int> counter{0};
		  
		  void increment() {
		      counter++;           // atomic — thread-safe, no mutex needed
		      counter.fetch_add(1); // explicit atomic add
		  }
		  
		  std::cout << counter.load(); // atomic read
		  counter.store(0);            // atomic write
		  
		  // Compare-and-swap
		  int expected = 5;
		  counter.compare_exchange_strong(expected, 10);
		  // if counter == 5, set to 10; else load current into expected
		  ```
-
- # File I/O
  collapsed:: true
	- ## Reading & Writing Files
	  collapsed:: true
		- ```c++
		  #include <fstream>
		  #include <string>
		  
		  // Write to file
		  std::ofstream outFile("data.txt");
		  if (outFile.is_open()) {
		      outFile << "Hello, File!\n";
		      outFile << "Line 2\n";
		      outFile.close();
		  }
		  
		  // Read from file
		  std::ifstream inFile("data.txt");
		  std::string line;
		  while (std::getline(inFile, line)) {
		      std::cout << line << "\n";
		  }
		  inFile.close();
		  
		  // Append to file
		  std::ofstream appendFile("data.txt", std::ios::app);
		  appendFile << "Appended line\n";
		  ```
	-
	- ## Binary File I/O
	  collapsed:: true
		- ```c++
		  struct Point { int x, y; };
		  
		  // Write binary
		  std::ofstream out("points.bin", std::ios::binary);
		  Point p{10, 20};
		  out.write(reinterpret_cast<char*>(&p), sizeof(p));
		  
		  // Read binary
		  std::ifstream in("points.bin", std::ios::binary);
		  Point q;
		  in.read(reinterpret_cast<char*>(&q), sizeof(q));
		  std::cout << q.x << ", " << q.y; // 10, 20
		  ```
	-
	- ## String Streams
	  collapsed:: true
		- ```c++
		  #include <sstream>
		  
		  // Build string with stream
		  std::ostringstream oss;
		  oss << "Name: " << "Alice" << ", Age: " << 30;
		  std::string result = oss.str();
		  
		  // Parse string
		  std::istringstream iss("10 20 30");
		  int a, b, c;
		  iss >> a >> b >> c; // a=10, b=20, c=30
		  ```
-
- # Namespaces
  collapsed:: true
	- ## Defining & Using Namespaces
	  collapsed:: true
		- ```c++
		  namespace Math {
		      const double PI = 3.14159;
		      int square(int x) { return x * x; }
		  
		      namespace Trig {
		          double sin(double x) { return std::sin(x); }
		      }
		  }
		  
		  std::cout << Math::PI;              // 3.14159
		  std::cout << Math::square(5);       // 25
		  std::cout << Math::Trig::sin(0.5);  // nested namespace
		  
		  // using declaration
		  using Math::square;
		  std::cout << square(4); // 16
		  
		  // using directive (avoid in headers)
		  using namespace Math;
		  std::cout << PI; // 3.14159
		  
		  // Inline namespace (C++11) — for versioning
		  namespace Lib {
		      inline namespace v2 {
		          void func() { std::cout << "v2"; }
		      }
		  }
		  Lib::func(); // calls v2::func
		  ```
	-
	- ## Anonymous Namespaces
	  collapsed:: true
		- ```c++
		  // Limits visibility to current translation unit (like static in C)
		  namespace {
		      int internalHelper() { return 42; }
		  }
		  // internalHelper() only accessible in this .cpp file
		  ```
-
- # Preprocessor & Compilation
  collapsed:: true
	- ## Preprocessor Directives
	  collapsed:: true
		- ```c++
		  #include <iostream>    // system header
		  #include "myfile.h"    // local header
		  
		  #define PI 3.14159
		  #define MAX(a,b) ((a) > (b) ? (a) : (b))
		  #undef PI
		  
		  #ifdef DEBUG
		      std::cout << "Debug mode\n";
		  #elif defined VERBOSE
		      std::cout << "Verbose mode\n";
		  #else
		      std::cout << "Release mode\n";
		  #endif
		  
		  #ifndef MYHEADER_H
		  #define MYHEADER_H
		  // header content
		  #endif
		  
		  #pragma once  // modern alternative to include guards
		  
		  #error "Unsupported platform"  // compile-time error
		  ```
	-
	- ## Predefined Macros
	  collapsed:: true
		- ```c++
		  __FILE__      // current filename
		  __LINE__      // current line number
		  __DATE__      // compilation date "MMM DD YYYY"
		  __TIME__      // compilation time "HH:MM:SS"
		  __cplusplus   // C++ standard version (201703L = C++17, 202002L = C++20)
		  __func__      // current function name (C++11)
		  ```
	-
	- ## Header Files & Compilation Model
	  collapsed:: true
		- ```c++
		  // myclass.h — declaration
		  #pragma once
		  class MyClass {
		  public:
		      void hello();
		  };
		  
		  // myclass.cpp — definition
		  #include "myclass.h"
		  #include <iostream>
		  void MyClass::hello() {
		      std::cout << "Hello!\n";
		  }
		  
		  // main.cpp
		  #include "myclass.h"
		  int main() {
		      MyClass obj;
		      obj.hello();
		  }
		  
		  // Compile:
		  // g++ main.cpp myclass.cpp -o app
		  ```
-
- # Advanced Topics
  collapsed:: true
	- ## Type Traits (C++11)
	  collapsed:: true
		- ```c++
		  #include <type_traits>
		  
		  std::is_integral<int>::value      // true
		  std::is_floating_point<double>::value // true
		  std::is_pointer<int*>::value       // true
		  std::is_same<int, int>::value      // true
		  std::is_base_of<Base, Derived>::value // true
		  
		  // Shorthand (C++17)
		  std::is_integral_v<int>            // true
		  std::is_same_v<int, float>         // false
		  
		  // Conditional type
		  std::conditional_t<true, int, double>  // int
		  std::conditional_t<false, int, double> // double
		  
		  // Remove/add qualifiers
		  std::remove_const_t<const int>     // int
		  std::add_pointer_t<int>            // int*
		  ```
	-
	- ## SFINAE & enable_if (Pre-C++20)
	  collapsed:: true
		- ```c++
		  // Substitution Failure Is Not An Error
		  // Enable function only for integral types
		  template <typename T>
		  typename std::enable_if_t<std::is_integral_v<T>, T>
		  double_it(T x) { return x * 2; }
		  
		  double_it(5);    // works
		  // double_it(3.14); // compile error — not integral
		  
		  // C++20 Concepts are cleaner — prefer those
		  ```
	-
	- ## constexpr & Compile-Time Programming
	  collapsed:: true
		- ```c++
		  constexpr int factorial(int n) {
		      return n <= 1 ? 1 : n * factorial(n - 1);
		  }
		  
		  constexpr int f5 = factorial(5); // computed at compile time: 120
		  
		  // constexpr if (C++17)
		  template <typename T>
		  auto process(T val) {
		      if constexpr (std::is_integral_v<T>)
		          return val * 2;
		      else
		          return val + 0.5;
		  }
		  
		  // consteval (C++20) — MUST be compile-time
		  consteval int square(int x) { return x * x; }
		  ```
	-
	- ## Memory Model & Alignment
	  collapsed:: true
		- ```c++
		  // alignas — specify alignment
		  alignas(16) float simdData[4]; // 16-byte aligned for SIMD
		  
		  // alignof — query alignment
		  std::cout << alignof(double); // typically 8
		  
		  // std::aligned_storage (C++11)
		  std::aligned_storage_t<sizeof(int), alignof(int)> storage;
		  
		  // Placement new — construct in pre-allocated memory
		  char buf[sizeof(MyClass)];
		  MyClass* obj = new (buf) MyClass(); // construct in buf
		  obj->~MyClass();                    // must manually call destructor
		  ```
	-
	- ## Design Patterns in C++
	  collapsed:: true
		- ```c++
		  // Singleton
		  class Singleton {
		      static Singleton* instance;
		      Singleton() {}
		  public:
		      static Singleton& getInstance() {
		          static Singleton inst; // thread-safe in C++11
		          return inst;
		      }
		  };
		  
		  // Factory
		  class Shape { public: virtual void draw() = 0; };
		  class Circle : public Shape { public: void draw() override { std::cout << "Circle\n"; } };
		  class Square : public Shape { public: void draw() override { std::cout << "Square\n"; } };
		  
		  std::unique_ptr<Shape> createShape(std::string type) {
		      if (type == "circle") return std::make_unique<Circle>();
		      if (type == "square") return std::make_unique<Square>();
		      return nullptr;
		  }
		  
		  // Observer
		  class Observer { public: virtual void update(int val) = 0; };
		  class Subject {
		      std::vector<Observer*> observers;
		      int state;
		  public:
		      void attach(Observer* o) { observers.push_back(o); }
		      void setState(int s) {
		          state = s;
		          for (auto* o : observers) o->update(state);
		      }
		  };
		  ```
	-
	- ## Structured Bindings (C++17)
	  collapsed:: true
		- ```c++
		  // Unpack pairs, tuples, structs, arrays
		  auto [x, y] = std::make_pair(1, 2);
		  
		  std::tuple<int, std::string, double> t{1, "hello", 3.14};
		  auto [id, name, score] = t;
		  
		  struct Point { int x, y; };
		  Point p{10, 20};
		  auto [px, py] = p;
		  
		  // In range-based for
		  std::map<std::string, int> m{{"a", 1}, {"b", 2}};
		  for (auto& [key, val] : m) {
		      std::cout << key << "=" << val << "\n";
		  }
		  ```
-
- # Utilities & Practical STL
  collapsed:: true
	- ## std::pair & std::tuple
	  collapsed:: true
		- ```c++
		  #include <utility>
		  #include <tuple>
		  
		  // pair — two values
		  std::pair<std::string, int> p = {"Alice", 30};
		  std::cout << p.first << ", " << p.second; // Alice, 30
		  
		  auto p2 = std::make_pair("Bob", 25);
		  
		  // tuple — N values of different types
		  std::tuple<int, std::string, double> t = {1, "hello", 3.14};
		  
		  std::cout << std::get<0>(t); // 1
		  std::cout << std::get<1>(t); // hello
		  std::cout << std::get<2>(t); // 3.14
		  
		  auto t2 = std::make_tuple(42, "world", 2.71);
		  
		  // structured binding (C++17)
		  auto [id, name, score] = t;
		  
		  // tie — unpack into existing variables
		  int a; std::string b;
		  std::tie(a, b, std::ignore) = t;
		  ```
	-
	- ## std::deque, std::list, std::forward_list
	  collapsed:: true
		- ```c++
		  #include <deque>
		  #include <list>
		  #include <forward_list>
		  
		  // deque — double-ended queue, fast insert/remove at both ends
		  std::deque<int> dq = {2, 3, 4};
		  dq.push_front(1);  // {1,2,3,4}
		  dq.push_back(5);   // {1,2,3,4,5}
		  dq.pop_front();    // {2,3,4,5}
		  std::cout << dq[1]; // 3
		  
		  // list — doubly linked list, O(1) insert/remove anywhere
		  std::list<int> lst = {1, 2, 3, 4};
		  auto it = lst.begin();
		  std::advance(it, 2);
		  lst.insert(it, 99);  // {1,2,99,3,4}
		  lst.remove(2);       // removes all 2s
		  lst.sort();
		  lst.reverse();
		  
		  // forward_list — singly linked, minimal memory
		  std::forward_list<int> fl = {3, 1, 4, 1, 5};
		  fl.push_front(0);
		  fl.sort();
		  fl.unique(); // remove consecutive duplicates
		  ```
	-
	- ## std::initializer_list
	  collapsed:: true
		- ```c++
		  #include <initializer_list>
		  
		  // Accept brace-init in your own functions/classes
		  void printAll(std::initializer_list<int> vals) {
		      for (int v : vals) std::cout << v << " ";
		  }
		  printAll({1, 2, 3, 4, 5}); // 1 2 3 4 5
		  
		  class NumberSet {
		      std::vector<int> data;
		  public:
		      NumberSet(std::initializer_list<int> list) : data(list) {}
		      void print() { for (int x : data) std::cout << x << " "; }
		  };
		  
		  NumberSet ns{10, 20, 30}; // uses initializer_list constructor
		  ns.print(); // 10 20 30
		  ```
	-
	- ## std::chrono — Time & Duration
	  collapsed:: true
		- ```c++
		  #include <chrono>
		  #include <thread>
		  
		  using namespace std::chrono;
		  
		  // Get current time
		  auto start = high_resolution_clock::now();
		  
		  // Simulate work
		  std::this_thread::sleep_for(milliseconds(100));
		  
		  auto end = high_resolution_clock::now();
		  auto elapsed = duration_cast<milliseconds>(end - start);
		  std::cout << "Elapsed: " << elapsed.count() << "ms\n";
		  
		  // Duration literals (C++14)
		  auto t1 = 2s;    // 2 seconds
		  auto t2 = 500ms; // 500 milliseconds
		  auto t3 = 1min;  // 1 minute
		  
		  // Time point arithmetic
		  auto now = system_clock::now();
		  auto future = now + hours(24); // 24 hours from now
		  
		  // Convert to time_t for display
		  auto tt = system_clock::to_time_t(now);
		  std::cout << std::ctime(&tt);
		  ```
	-
	- ## std::random — Random Number Generation
	  collapsed:: true
		- ```c++
		  #include <random>
		  
		  // Mersenne Twister engine (high quality)
		  std::mt19937 rng(std::random_device{}()); // seed with hardware entropy
		  
		  // Uniform integer distribution
		  std::uniform_int_distribution<int> dice(1, 6);
		  std::cout << dice(rng); // random 1-6
		  
		  // Uniform real distribution
		  std::uniform_real_distribution<double> prob(0.0, 1.0);
		  std::cout << prob(rng); // random 0.0-1.0
		  
		  // Normal distribution
		  std::normal_distribution<double> normal(0.0, 1.0); // mean=0, stddev=1
		  std::cout << normal(rng);
		  
		  // Shuffle a container
		  std::vector<int> v = {1, 2, 3, 4, 5};
		  std::shuffle(v.begin(), v.end(), rng);
		  ```
	-
	- ## std::regex — Regular Expressions
	  collapsed:: true
		- ```c++
		  #include <regex>
		  #include <string>
		  
		  std::string text = "Hello, my email is user@example.com";
		  std::regex emailPattern(R"(\w+@\w+\.\w+)");
		  
		  // Check if match exists
		  if (std::regex_search(text, emailPattern)) {
		      std::cout << "Email found!\n";
		  }
		  
		  // Extract match
		  std::smatch match;
		  if (std::regex_search(text, match, emailPattern)) {
		      std::cout << "Found: " << match[0]; // user@example.com
		  }
		  
		  // Full match
		  std::regex intPattern(R"(\d+)");
		  std::cout << std::regex_match("12345", intPattern); // 1 (true)
		  
		  // Replace
		  std::string result = std::regex_replace(text, emailPattern, "[REDACTED]");
		  std::cout << result;
		  
		  // Iterate all matches
		  std::sregex_iterator it(text.begin(), text.end(), emailPattern);
		  std::sregex_iterator end;
		  for (; it != end; ++it) std::cout << (*it)[0] << "\n";
		  ```
	-
	- ## std::format (C++20) — Type-Safe String Formatting
	  collapsed:: true
		- ```c++
		  #include <format>
		  
		  // Basic formatting
		  std::string s = std::format("Hello, {}!", "World");
		  std::cout << s; // Hello, World!
		  
		  // Multiple args
		  std::cout << std::format("Name: {}, Age: {}", "Alice", 30);
		  
		  // Positional args
		  std::cout << std::format("{0} + {1} = {2}", 3, 4, 7);
		  
		  // Format specifiers
		  std::cout << std::format("{:.2f}", 3.14159);  // 3.14
		  std::cout << std::format("{:>10}", "right");  // right-aligned
		  std::cout << std::format("{:0>5}", 42);       // 00042
		  std::cout << std::format("{:#x}", 255);       // 0xff
		  std::cout << std::format("{:b}", 10);         // 1010 (binary)
		  
		  // C++23: std::print (directly to stdout)
		  // std::println("Value: {}", 42);
		  ```
-
- # Scope, Storage & Linkage
  collapsed:: true
	- ## Variable Scope
	  collapsed:: true
		- ```c++
		  int global = 10;  // global scope — accessible everywhere in file
		  
		  void foo() {
		      int local = 5;  // local scope — only inside foo()
		      {
		          int block = 3; // block scope — only inside this {}
		          std::cout << local + block; // 8
		      }
		      // block is destroyed here
		  }
		  
		  // Shadowing — inner variable hides outer
		  int x = 1;
		  {
		      int x = 2;          // shadows outer x
		      std::cout << x;     // 2
		  }
		  std::cout << x;         // 1
		  ```
	-
	- ## Storage Duration
	  collapsed:: true
		- ```c++
		  // Automatic — default for local variables, destroyed at end of scope
		  void foo() { int x = 5; } // x destroyed when foo() returns
		  
		  // Static — persists for program lifetime
		  void counter() {
		      static int count = 0; // initialized once, persists between calls
		      count++;
		      std::cout << count;
		  }
		  counter(); // 1
		  counter(); // 2
		  counter(); // 3
		  
		  // Dynamic — heap, controlled by new/delete or smart pointers
		  int* p = new int(42);
		  delete p;
		  
		  // Thread-local (C++11) — one copy per thread
		  thread_local int tls = 0;
		  ```
	-
	- ## Linkage (extern, static)
	  collapsed:: true
		- ```c++
		  // External linkage — visible across translation units
		  int globalVar = 42;          // external by default
		  extern int globalVar;        // declare in other .cpp files
		  
		  // Internal linkage — visible only in current translation unit
		  static int fileLocal = 10;   // static at file scope = internal linkage
		  namespace { int anon = 5; }  // anonymous namespace = internal linkage
		  
		  // inline variables (C++17) — define in header, one definition across TUs
		  inline int sharedConst = 100;
		  
		  // constinit (C++20) — guarantee static init at compile time
		  constinit int initAtCompileTime = 42;
		  ```
-
- # Bit Manipulation
  collapsed:: true
	- ## Bitwise Operations
	  collapsed:: true
		- ```c++
		  int a = 0b1010; // 10
		  int b = 0b1100; // 12
		  
		  std::cout << (a & b);  // AND  → 0b1000 = 8
		  std::cout << (a | b);  // OR   → 0b1110 = 14
		  std::cout << (a ^ b);  // XOR  → 0b0110 = 6
		  std::cout << (~a);     // NOT  → -11 (two's complement)
		  std::cout << (a << 1); // LEFT SHIFT  → 0b10100 = 20
		  std::cout << (a >> 1); // RIGHT SHIFT → 0b0101 = 5
		  ```
	-
	- ## Common Bit Tricks
	  collapsed:: true
		- ```c++
		  int n = 42;
		  
		  // Check if bit i is set
		  bool isSet = (n >> i) & 1;
		  
		  // Set bit i
		  n |= (1 << i);
		  
		  // Clear bit i
		  n &= ~(1 << i);
		  
		  // Toggle bit i
		  n ^= (1 << i);
		  
		  // Check if power of 2
		  bool isPow2 = n > 0 && (n & (n - 1)) == 0;
		  
		  // Count set bits (popcount)
		  int bits = __builtin_popcount(n);       // GCC/Clang
		  int bits2 = std::popcount((unsigned)n); // C++20 <bit>
		  
		  // Isolate lowest set bit
		  int lowest = n & (-n);
		  
		  // Clear lowest set bit
		  n = n & (n - 1);
		  
		  // Swap without temp
		  a ^= b; b ^= a; a ^= b;
		  ```
	-
	- ## std::bitset
	  collapsed:: true
		- ```c++
		  #include <bitset>
		  
		  std::bitset<8> bits(0b10110100); // 8-bit set
		  
		  std::cout << bits;          // 10110100
		  std::cout << bits[3];       // 0 (bit at position 3)
		  std::cout << bits.count();  // 4 (number of set bits)
		  std::cout << bits.size();   // 8
		  
		  bits.set(0);    // set bit 0 → 10110101
		  bits.reset(7);  // clear bit 7 → 00110101
		  bits.flip(1);   // toggle bit 1
		  bits.flip();    // flip all bits
		  
		  std::cout << bits.to_ulong();  // convert to unsigned long
		  std::cout << bits.to_string(); // convert to string
		  
		  // Bitwise ops on bitsets
		  std::bitset<8> a(0b1010), b(0b1100);
		  std::cout << (a & b); // 00001000
		  std::cout << (a | b); // 00001110
		  std::cout << (a ^ b); // 00000110
		  ```
-
- # Build Tools & Compilation
  collapsed:: true
	- ## g++ / clang++ Compilation
	  collapsed:: true
		- ```bash
		  # Basic compile
		  g++ main.cpp -o app
		  
		  # Specify C++ standard
		  g++ -std=c++17 main.cpp -o app
		  g++ -std=c++20 main.cpp -o app
		  
		  # Multiple files
		  g++ -std=c++17 main.cpp utils.cpp -o app
		  
		  # Optimization levels
		  g++ -O0 main.cpp -o app   # no optimization (debug)
		  g++ -O2 main.cpp -o app   # standard optimization
		  g++ -O3 main.cpp -o app   # aggressive optimization
		  
		  # Debug info (for gdb/lldb)
		  g++ -g -std=c++17 main.cpp -o app
		  
		  # Warnings
		  g++ -Wall -Wextra -std=c++17 main.cpp -o app
		  
		  # Define macros
		  g++ -DDEBUG main.cpp -o app
		  
		  # Include path & link library
		  g++ -I./include -L./lib -lmylib main.cpp -o app
		  ```
	-
	- ## CMake Basics
	  collapsed:: true
		- ```cmake
		  # CMakeLists.txt
		  cmake_minimum_required(VERSION 3.20)
		  project(MyApp VERSION 1.0)
		  
		  set(CMAKE_CXX_STANDARD 20)
		  set(CMAKE_CXX_STANDARD_REQUIRED True)
		  
		  # Add executable
		  add_executable(MyApp main.cpp utils.cpp)
		  
		  # Add library
		  add_library(MyLib STATIC lib.cpp)
		  target_link_libraries(MyApp PRIVATE MyLib)
		  
		  # Include directories
		  target_include_directories(MyApp PRIVATE include/)
		  
		  # Build:
		  # mkdir build && cd build
		  # cmake ..
		  # cmake --build .
		  ```
-
- # Miscellaneous
  collapsed:: true
	- ## Enums & Scoped Enums
	  collapsed:: true
		- ```c++
		  // Old-style enum (pollutes namespace)
		  enum Direction { North, South, East, West };
		  Direction d = North;
		  
		  // Scoped enum (C++11) — preferred
		  enum class Color { Red, Green, Blue };
		  Color c = Color::Red;
		  
		  // Enum with underlying type
		  enum class Status : uint8_t { OK = 0, Error = 1, Pending = 2 };
		  
		  // Cast to underlying type
		  int val = static_cast<int>(Color::Green); // 1
		  ```
	-
	- ## Unions & std::variant
	  collapsed:: true
		- ```c++
		  // C-style union — unsafe, no type tracking
		  union Data {
		      int i;
		      float f;
		      char c;
		  };
		  Data d; d.i = 42;
		  
		  // std::variant (C++17) — type-safe union
		  std::variant<int, float, std::string> v = 42;
		  v = 3.14f;
		  v = "hello";
		  
		  std::visit([](auto&& val) { std::cout << val; }, v);
		  ```
	-
	- ## Escape Sequences
	  collapsed:: true
		- ```c++
		  \n    Newline
		  \t    Horizontal tab
		  \r    Carriage return
		  \\    Backslash
		  \'    Single quote
		  \"    Double quote
		  \0    Null character
		  \a    Bell/alert
		  \b    Backspace
		  \f    Form feed
		  \v    Vertical tab
		  \xNN  Hex value (e.g. \x41 = 'A')
		  \uNNNN Unicode (C++11)
		  ```
	-
	- ## Useful Standard Headers
	  collapsed:: true
		- ```c++
		  <iostream>      // cin, cout, cerr
		  <string>        // std::string
		  <vector>        // std::vector
		  <array>         // std::array
		  <map>           // std::map
		  <set>           // std::set
		  <unordered_map> // std::unordered_map
		  <algorithm>     // sort, find, transform...
		  <numeric>       // accumulate, iota...
		  <functional>    // std::function, std::bind
		  <memory>        // smart pointers
		  <thread>        // std::thread
		  <mutex>         // std::mutex
		  <future>        // std::async, std::future
		  <atomic>        // std::atomic
		  <fstream>       // file I/O
		  <sstream>       // string streams
		  <filesystem>    // fs operations (C++17)
		  <optional>      // std::optional (C++17)
		  <variant>       // std::variant (C++17)
		  <any>           // std::any (C++17)
		  <span>          // std::span (C++20)
		  <ranges>        // ranges & views (C++20)
		  <concepts>      // concepts (C++20)
		  <format>        // std::format (C++20)
		  <print>         // std::print (C++23)
		  <expected>      // std::expected (C++23)
		  <cmath>         // math functions
		  <cstring>       // C string functions
		  <cassert>       // assert()
		  <stdexcept>     // standard exceptions
		  <type_traits>   // type traits
		  <chrono>        // time utilities
		  <random>        // random number generation
		  <regex>         // regular expressions
		  ```
-
- # Literals, Type Aliases & Character Manipulation
  collapsed:: true
	- ## Literals & Suffixes
	  collapsed:: true
		- ```c++
		  // Integer literals
		  int dec  = 255;       // decimal
		  int hex  = 0xFF;      // hexadecimal
		  int oct  = 0377;      // octal
		  int bin  = 0b11111111; // binary (C++14)
		  
		  // Digit separators (C++14)
		  int million = 1'000'000;
		  double pi   = 3.141'592'653;
		  
		  // Type suffixes
		  auto a = 42;      // int
		  auto b = 42u;     // unsigned int
		  auto c = 42l;     // long
		  auto d = 42ll;    // long long
		  auto e = 42ul;    // unsigned long
		  auto f = 3.14f;   // float
		  auto g = 3.14;    // double
		  auto h = 3.14l;   // long double
		  
		  // String literals
		  const char* s1 = "hello";
		  const wchar_t* s2 = L"wide";
		  const char16_t* s3 = u"utf16";
		  const char32_t* s4 = U"utf32";
		  const char* s5 = u8"utf8";
		  
		  // Raw string literals (no escape processing)
		  const char* path = R"(C:\Users\name\file.txt)";
		  const char* regex = R"(\d+\.\d+)";
		  
		  // User-defined literals (C++11)
		  // operator"" suffix
		  long double operator"" _km(long double d) { return d * 1000.0; }
		  long double dist = 5.0_km; // 5000.0
		  ```
	-
	- ## Type Aliases
	  collapsed:: true
		- ```c++
		  // Old C-style typedef
		  typedef unsigned long long uint64;
		  typedef std::vector<int> IntVec;
		  
		  // Modern using alias (C++11) — preferred
		  using uint64 = unsigned long long;
		  using IntVec = std::vector<int>;
		  using StringMap = std::map<std::string, std::string>;
		  
		  // Alias templates — typedef can't do this
		  template <typename T>
		  using Vec = std::vector<T>;
		  
		  Vec<int> vi = {1, 2, 3};
		  Vec<std::string> vs = {"a", "b"};
		  
		  // Function pointer alias
		  using Callback = void(*)(int, int);
		  using Handler = std::function<void(std::string)>;
		  ```
	-
	- ## Character Manipulation (`<cctype>`)
	  collapsed:: true
		- ```c++
		  #include <cctype>
		  #include <string>
		  #include <algorithm>
		  
		  char c = 'A';
		  
		  // Classification
		  std::isalpha(c);   // true — is letter
		  std::isdigit(c);   // false — is digit
		  std::isalnum(c);   // true — is letter or digit
		  std::isspace(c);   // false — is whitespace
		  std::isupper(c);   // true — is uppercase
		  std::islower(c);   // false — is lowercase
		  std::ispunct(c);   // false — is punctuation
		  
		  // Conversion
		  std::tolower('A'); // 'a'
		  std::toupper('a'); // 'A'
		  
		  // Convert entire string
		  std::string s = "Hello World";
		  std::transform(s.begin(), s.end(), s.begin(), ::tolower);
		  // s = "hello world"
		  
		  std::transform(s.begin(), s.end(), s.begin(), ::toupper);
		  // s = "HELLO WORLD"
		  
		  // Count digits in string
		  int digits = std::count_if(s.begin(), s.end(), ::isdigit);
		  ```
-
- # Arguments to main & Getting Things Out of Functions
  collapsed:: true
	- ## argc & argv
	  collapsed:: true
		- ```c++
		  // int main(int argc, char* argv[])
		  // argc — argument count (includes program name)
		  // argv — array of C-strings
		  
		  int main(int argc, char* argv[]) {
		      std::cout << "Program: " << argv[0] << "\n";
		      std::cout << "Args: " << argc - 1 << "\n";
		  
		      for (int i = 1; i < argc; i++) {
		          std::cout << "arg[" << i << "] = " << argv[i] << "\n";
		      }
		      return 0;
		  }
		  
		  // Run: ./app hello world 42
		  // Program: ./app
		  // Args: 3
		  // arg[1] = hello
		  // arg[2] = world
		  // arg[3] = 42
		  
		  // Convert args
		  int n = std::stoi(argv[1]);
		  double d = std::stod(argv[2]);
		  ```
	-
	- ## Multiple Return Strategies
	  collapsed:: true
		- ```c++
		  // 1. Return struct
		  struct MinMax { int min, max; };
		  MinMax getMinMax(std::vector<int>& v) {
		      return { *std::min_element(v.begin(), v.end()),
		               *std::max_element(v.begin(), v.end()) };
		  }
		  auto [mn, mx] = getMinMax(v); // structured binding
		  
		  // 2. Return std::pair
		  std::pair<bool, int> findFirst(std::vector<int>& v, int target) {
		      for (int i = 0; i < v.size(); i++)
		          if (v[i] == target) return {true, i};
		      return {false, -1};
		  }
		  auto [found, idx] = findFirst(v, 3);
		  
		  // 3. Return std::tuple
		  std::tuple<int, int, int> divide(int a, int b) {
		      return {a / b, a % b, b};
		  }
		  auto [quot, rem, divisor] = divide(17, 5);
		  
		  // 4. Return std::optional (value or nothing)
		  std::optional<int> safeSqrt(int n) {
		      if (n < 0) return std::nullopt;
		      return static_cast<int>(std::sqrt(n));
		  }
		  if (auto r = safeSqrt(16)) std::cout << *r; // 4
		  
		  // 5. Output parameters (old style, avoid when possible)
		  void getCoords(int& x, int& y) { x = 10; y = 20; }
		  int x, y; getCoords(x, y);
		  ```
-
- # Overflow, Underflow & Numeric Limits
  collapsed:: true
	- ## Integer Overflow & Underflow
	  collapsed:: true
		- ```c++
		  #include <climits>
		  #include <limits>
		  
		  // Numeric limits
		  std::cout << INT_MAX;    // 2147483647
		  std::cout << INT_MIN;    // -2147483648
		  std::cout << UINT_MAX;   // 4294967295
		  std::cout << LLONG_MAX;  // 9223372036854775807
		  
		  // std::numeric_limits (preferred, works for any type)
		  std::cout << std::numeric_limits<int>::max();
		  std::cout << std::numeric_limits<int>::min();
		  std::cout << std::numeric_limits<double>::max();
		  std::cout << std::numeric_limits<double>::epsilon(); // smallest diff
		  std::cout << std::numeric_limits<float>::infinity();
		  
		  // Overflow wraps around for unsigned (defined behavior)
		  unsigned int u = UINT_MAX;
		  u++; // u = 0 (wraps)
		  
		  // Overflow for signed int is UNDEFINED BEHAVIOR
		  int i = INT_MAX;
		  i++; // UB — don't do this
		  
		  // Safe check before overflow
		  if (a > std::numeric_limits<int>::max() - b) {
		      // would overflow
		  }
		  ```
	-
	- ## Floating Point Precision
	  collapsed:: true
		- ```c++
		  // Floating point is not exact
		  double a = 0.1 + 0.2;
		  std::cout << (a == 0.3);  // 0 (false!) — precision issue
		  
		  // Correct comparison
		  double epsilon = 1e-9;
		  std::cout << (std::abs(a - 0.3) < epsilon); // 1 (true)
		  
		  // Special values
		  double inf = std::numeric_limits<double>::infinity();
		  double nan = std::numeric_limits<double>::quiet_NaN();
		  
		  std::cout << std::isinf(inf);  // 1
		  std::cout << std::isnan(nan);  // 1
		  std::cout << std::isfinite(42.0); // 1
		  ```
-
- # Deep Dive: Classes & Constructors
  collapsed:: true
	- ## Class Memory Layout & this Pointer
	  collapsed:: true
		- ```c++
		  class Point {
		  public:
		      int x, y;
		      Point(int x, int y) : x(x), y(y) {}
		  
		      void print() {
		          // 'this' is a pointer to the current object
		          std::cout << this->x << ", " << this->y;
		          std::cout << " (at " << this << ")\n";
		      }
		  
		      // Return *this for method chaining
		      Point& setX(int x) { this->x = x; return *this; }
		      Point& setY(int y) { this->y = y; return *this; }
		  };
		  
		  Point p(1, 2);
		  p.setX(10).setY(20); // method chaining
		  
		  // sizeof class
		  std::cout << sizeof(Point); // 8 (two ints, no padding needed)
		  
		  // Memory layout: members stored in declaration order
		  // Padding added for alignment
		  struct Padded { char a; int b; char c; };
		  std::cout << sizeof(Padded); // likely 12, not 6 (padding)
		  
		  struct Packed { int b; char a; char c; };
		  std::cout << sizeof(Packed); // likely 8 (better layout)
		  ```
	-
	- ## Constructor Details
	  collapsed:: true
		- ```c++
		  class Widget {
		      int id;
		      std::string name;
		      double value;
		  public:
		      // Member initializer list — always prefer over assignment in body
		      // Initialized in DECLARATION ORDER, not list order
		      Widget(int i, std::string n, double v)
		          : id(i), name(std::move(n)), value(v) {}
		  
		      // Delegating constructor (C++11) — one constructor calls another
		      Widget() : Widget(0, "default", 0.0) {}
		      Widget(int i) : Widget(i, "unnamed", 0.0) {}
		  
		      // Converting constructor — implicit conversion from int
		      Widget(int i) : id(i), name(""), value(0) {}
		  
		      // explicit — prevents implicit conversion
		      explicit Widget(double v) : id(0), name(""), value(v) {}
		  };
		  
		  Widget w1(1, "hello", 3.14);
		  Widget w2;          // calls delegating constructor
		  Widget w3 = 42;     // implicit conversion (if not explicit)
		  // Widget w4 = 3.14; // ERROR if constructor is explicit
		  Widget w4(3.14);    // OK — explicit call
		  
		  // = delete — disable a constructor
		  class NonCopyable {
		  public:
		      NonCopyable() = default;
		      NonCopyable(const NonCopyable&) = delete;  // no copy
		      NonCopyable& operator=(const NonCopyable&) = delete;
		  };
		  
		  // = default — compiler generates default implementation
		  class Simple {
		  public:
		      Simple() = default;
		      ~Simple() = default;
		  };
		  ```
-
- # Three-Way Comparison & Logical Operators
  collapsed:: true
	- ## Three-Way Comparison `<=>` (C++20)
	  collapsed:: true
		- ```c++
		  #include <compare>
		  
		  // Returns ordering type, not bool
		  auto r1 = (5 <=> 3);  // std::strong_ordering::greater
		  auto r2 = (3 <=> 5);  // std::strong_ordering::less
		  auto r3 = (5 <=> 5);  // std::strong_ordering::equal
		  
		  // Ordering types:
		  // strong_ordering  — for integers (equal means identical)
		  // weak_ordering    — for floats (equivalent but not identical)
		  // partial_ordering — for floats with NaN (incomparable possible)
		  
		  // Check result
		  if (r1 > 0) std::cout << "greater";
		  if (r1 < 0) std::cout << "less";
		  if (r1 == 0) std::cout << "equal";
		  
		  // Auto-generate all comparison operators from <=>
		  struct Point {
		      int x, y;
		      auto operator<=>(const Point&) const = default;
		      // Now ==, !=, <, >, <=, >= all work automatically
		  };
		  
		  Point a{1, 2}, b{1, 3};
		  std::cout << (a < b);   // true
		  std::cout << (a == b);  // false
		  
		  // Custom spaceship operator
		  struct Version {
		      int major, minor, patch;
		      std::strong_ordering operator<=>(const Version& o) const {
		          if (auto c = major <=> o.major; c != 0) return c;
		          if (auto c = minor <=> o.minor; c != 0) return c;
		          return patch <=> o.patch;
		      }
		      bool operator==(const Version&) const = default;
		  };
		  ```
	-
	- ## Short-Circuit Evaluation
	  collapsed:: true
		- ```c++
		  // && stops at first false
		  // || stops at first true
		  
		  int x = 0;
		  if (x != 0 && 10 / x > 1) { // safe — 10/x never evaluated if x==0
		      std::cout << "ok";
		  }
		  
		  // Useful for null checks
		  std::string* p = nullptr;
		  if (p != nullptr && p->length() > 0) { // safe
		      std::cout << *p;
		  }
		  
		  // Side effects in conditions (avoid, but know it exists)
		  int a = 0, b = 0;
		  if (++a || ++b) { // b is never incremented
		      std::cout << a << " " << b; // 1 0
		  }
		  ```
-
- # Function-Like Entities
  collapsed:: true
	- ## Functors (Function Objects)
	  collapsed:: true
		- ```c++
		  // A class with operator() — behaves like a function but has state
		  class Multiplier {
		      int factor;
		  public:
		      Multiplier(int f) : factor(f) {}
		      int operator()(int x) const { return x * factor; }
		  };
		  
		  Multiplier triple(3);
		  std::cout << triple(5);  // 15
		  std::cout << triple(10); // 30
		  
		  // Used with STL algorithms
		  std::vector<int> v = {1, 2, 3, 4, 5};
		  std::transform(v.begin(), v.end(), v.begin(), Multiplier(2));
		  // v = {2, 4, 6, 8, 10}
		  ```
	-
	- ## std::bind (C++11)
	  collapsed:: true
		- ```c++
		  #include <functional>
		  
		  int add(int a, int b) { return a + b; }
		  
		  // Bind first argument to 10
		  auto add10 = std::bind(add, 10, std::placeholders::_1);
		  std::cout << add10(5);  // 15
		  std::cout << add10(20); // 30
		  
		  // Bind member function
		  class Printer {
		  public:
		      void print(std::string msg) { std::cout << msg; }
		  };
		  
		  Printer p;
		  auto fn = std::bind(&Printer::print, &p, std::placeholders::_1);
		  fn("Hello"); // Hello
		  
		  // Note: prefer lambdas over std::bind in modern C++
		  auto add10_lambda = [](int x) { return add(10, x); };
		  ```
	-
	- ## std::invoke (C++17)
	  collapsed:: true
		- ```c++
		  #include <functional>
		  
		  // Uniformly call any callable: function, lambda, functor, member fn
		  int add(int a, int b) { return a + b; }
		  
		  std::invoke(add, 3, 4);                    // 7 — free function
		  std::invoke([](int x){ return x*2; }, 5);  // 10 — lambda
		  
		  struct Foo { int val; int get() { return val; } };
		  Foo f{42};
		  std::invoke(&Foo::get, f);   // 42 — member function
		  std::invoke(&Foo::val, f);   // 42 — member variable
		  ```
-
- # Ranges Library (C++20)
  collapsed:: true
	- ## Views & Pipelines
	  collapsed:: true
		- ```c++
		  #include <ranges>
		  #include <vector>
		  
		  std::vector<int> v = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
		  
		  // filter — keep only even numbers
		  auto evens = v | std::views::filter([](int x){ return x % 2 == 0; });
		  
		  // transform — square each
		  auto squared = evens | std::views::transform([](int x){ return x * x; });
		  
		  // Chain (lazy — nothing computed until iterated)
		  for (int x : squared) std::cout << x << " "; // 4 16 36 64 100
		  
		  // take / drop
		  auto first3 = v | std::views::take(3);   // {1, 2, 3}
		  auto skip2  = v | std::views::drop(2);   // {3, 4, 5, ...}
		  
		  // reverse
		  auto rev = v | std::views::reverse;
		  
		  // iota — generate sequence
		  for (int i : std::views::iota(1, 6)) std::cout << i; // 12345
		  
		  // keys / values (for maps)
		  std::map<std::string, int> m{{"a",1},{"b",2}};
		  for (auto& k : m | std::views::keys) std::cout << k;   // ab
		  for (auto& v : m | std::views::values) std::cout << v; // 12
		  ```
	-
	- ## Range Algorithms
	  collapsed:: true
		- ```c++
		  #include <algorithm>
		  #include <ranges>
		  
		  std::vector<int> v = {5, 3, 1, 4, 2};
		  
		  // Ranges versions — no begin/end needed
		  std::ranges::sort(v);                    // {1,2,3,4,5}
		  std::ranges::reverse(v);                 // {5,4,3,2,1}
		  
		  auto it = std::ranges::find(v, 3);
		  bool found = std::ranges::contains(v, 3); // C++23
		  
		  std::ranges::sort(v, std::greater{});    // descending
		  std::ranges::sort(v, {}, &MyStruct::key); // sort by member
		  
		  // Projections — transform before comparing
		  struct Person { std::string name; int age; };
		  std::vector<Person> people = {{"Bob",30},{"Alice",25}};
		  std::ranges::sort(people, {}, &Person::age); // sort by age
		  std::ranges::sort(people, {}, &Person::name); // sort by name
		  ```
-
- # Coroutines (C++20)
  collapsed:: true
	- ## Coroutine Basics
	  collapsed:: true
		- A coroutine is a function that can **suspend** and **resume** execution.
		- Uses three keywords: `co_await`, `co_yield`, `co_return`
		- Requires a **promise type** and a **coroutine handle** — usually provided by a library.
		- ```c++
		  #include <coroutine>
		  #include <iostream>
		  
		  // Minimal generator coroutine
		  struct Generator {
		      struct promise_type {
		          int current_value;
		          Generator get_return_object() {
		              return Generator{std::coroutine_handle<promise_type>::from_promise(*this)};
		          }
		          std::suspend_always initial_suspend() { return {}; }
		          std::suspend_always final_suspend() noexcept { return {}; }
		          std::suspend_always yield_value(int v) {
		              current_value = v; return {};
		          }
		          void return_void() {}
		          void unhandled_exception() { std::terminate(); }
		      };
		  
		      std::coroutine_handle<promise_type> handle;
		      Generator(std::coroutine_handle<promise_type> h) : handle(h) {}
		      ~Generator() { if (handle) handle.destroy(); }
		  
		      bool next() { handle.resume(); return !handle.done(); }
		      int value() { return handle.promise().current_value; }
		  };
		  
		  Generator counter(int start, int end) {
		      for (int i = start; i <= end; i++)
		          co_yield i;  // suspend and yield value
		  }
		  
		  auto gen = counter(1, 5);
		  while (gen.next()) std::cout << gen.value() << " "; // 1 2 3 4 5
		  ```
	-
	- ## co_await — Async Suspension
	  collapsed:: true
		- ```c++
		  // co_await suspends the coroutine until the awaitable completes
		  // Used for async I/O, networking, task scheduling
		  
		  // Conceptual async task (real impl needs a scheduler/runtime)
		  Task<int> fetchData() {
		      auto result = co_await asyncHttpGet("https://api.example.com");
		      co_return result.statusCode;
		  }
		  
		  // std::suspend_always — always suspends
		  // std::suspend_never  — never suspends (runs to completion)
		  
		  // In practice, use a library:
		  // - cppcoro (popular coroutine library)
		  // - Asio (networking with coroutines)
		  // - C++23 std::generator for simple generators
		  ```
-
- # Modules (C++20)
  collapsed:: true
	- ## Module Basics
	  collapsed:: true
		- Modules replace `#include` — faster compilation, no header guards, no macro leakage.
		- ```c++
		  // math.ixx (or math.cppm) — module interface unit
		  export module math;  // declare module
		  
		  export int add(int a, int b) { return a + b; }  // exported — visible to importers
		  
		  int helper() { return 42; }  // NOT exported — internal only
		  
		  export namespace Math {
		      double pi = 3.14159;
		      double square(double x) { return x * x; }
		  }
		  ```
		- ```c++
		  // main.cpp — import the module
		  import math;
		  
		  int main() {
		      std::cout << add(3, 4);       // 7
		      std::cout << Math::square(5); // 25
		      // helper() — ERROR, not exported
		  }
		  ```
	-
	- ## Module Partitions & std import
	  collapsed:: true
		- ```c++
		  // Partition — split large module into parts
		  export module mylib:utils;  // partition "utils" of module "mylib"
		  export void utilFunc() {}
		  
		  // Primary module imports its partitions
		  export module mylib;
		  export import :utils;
		  
		  // Import standard library (C++23, compiler support varies)
		  import std;  // import everything
		  import std.core; // core subset
		  
		  // Compile with modules (g++/clang++)
		  // g++ -std=c++20 -fmodules-ts math.ixx main.cpp -o app
		  ```
-
- # Building Custom Iterators
  collapsed:: true
	- ## Iterator Concepts
	  collapsed:: true
		- ```
		  Iterator Category    Operations              Example
		  Input               ++, *, ==, !=           istream_iterator
		  Output              ++, *=                  ostream_iterator
		  Forward             ++, *, ==, !=           forward_list::iterator
		  Bidirectional       ++, --, *, ==, !=       list::iterator
		  Random Access       ++, --, +, -, [], <     vector::iterator
		  Contiguous (C++20)  Random Access + contiguous memory  vector::iterator
		  ```
	-
	- ## Custom Iterator Implementation
	  collapsed:: true
		- ```c++
		  #include <iterator>
		  
		  template <typename T>
		  class Range {
		      T start_, end_, step_;
		  public:
		      Range(T start, T end, T step = 1) : start_(start), end_(end), step_(step) {}
		  
		      struct Iterator {
		          using iterator_category = std::forward_iterator_tag;
		          using value_type = T;
		          using difference_type = std::ptrdiff_t;
		          using pointer = T*;
		          using reference = T&;
		  
		          T current, step;
		          Iterator(T c, T s) : current(c), step(s) {}
		  
		          T operator*() const { return current; }
		          Iterator& operator++() { current += step; return *this; }
		          Iterator operator++(int) { auto tmp = *this; ++(*this); return tmp; }
		          bool operator==(const Iterator& o) const { return current >= o.current; }
		          bool operator!=(const Iterator& o) const { return !(*this == o); }
		      };
		  
		      Iterator begin() { return Iterator(start_, step_); }
		      Iterator end()   { return Iterator(end_, step_); }
		  };
		  
		  // Usage — works with range-based for and STL algorithms
		  for (int i : Range(1, 10, 2)) std::cout << i << " "; // 1 3 5 7 9
		  
		  Range<double> r(0.0, 1.0, 0.25);
		  std::vector<double> v(r.begin(), r.end()); // {0.0, 0.25, 0.5, 0.75}
		  ```
-
- # Library & Frameworks
  id:: 673ac308-24d0-40b6-b0d7-a4b6cac5b79a
	- [[Cpp for Unreal]] - Unreal-specific C++ patterns: UObject system, UPROPERTY/UFUNCTION macros, TArray/TMap, delegates, GC, networking replication.
	-
	- [[STL (Standard Template Library)]] - Vectors, maps, sets, algorithms, iterators — the backbone of every C++ program.
	-
	- [[Boost]] - Peer-reviewed libraries extending C++: threading, filesystem, smart pointers, regex, and more.
	-
	- [[Qt]] - Cross-platform GUI framework with networking, database, and mobile support.
	-
	- [[OpenCV]] - Computer vision library for real-time image processing and object detection.
	-
	- [[SFML (Simple and Fast Multimedia Library)]] - Graphics, sound, and input for game development.
	-
	- [[Eigen]] - Template library for linear algebra, matrices, and vectors — used in ML and scientific computing.
	-
	- [[C++ REST SDK (cpprest)]] - Cross-platform RESTful web services and HTTP communication.
	-
	- [[POCO (C++ Portable Components)]] - HTTP, database, JSON/XML parsing for networked applications.
	-
	- [[Google Test (gtest)]] - Unit testing framework with mock objects and assertions.
	-
	- [[ACE (Adaptive Communicative Environment)]] - High-performance networked and real-time systems.
	-
	- [[TBB (Threading Building Blocks)]] - Intel's parallel programming library for multi-core performance.
	-
	- [[SDL (Simple DirectMedia Layer)]] - Cross-platform multimedia: audio, graphics, input for games.
	-
	- [[Catch2]] - Modern, header-only C++ testing framework — simpler than gtest.
	-
	- [[nlohmann json]] - Single-header JSON library, the most popular C++ JSON parser.
	-
	- [[spdlog]] - Fast, header-only logging library for C++.
-
- # More Learn
	- Explore the following links for valuable resources, communities, and tools to enhance your skills : -
		-
		- [C++ Roadmap](https://github.com/salmer/CppDeveloperRoadmap)
		- [Cheat Sheets for C++](https://hackingcpp.com/cpp/cheat_sheets.html)
		- [cplusplus.com Tutorial](https://cplusplus.com/doc/tutorial/)
		- [cppreference — Full Reference](https://en.cppreference.com/w/)
		- [C++ Core Guidelines (Bjarne + Herb)](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)
		- [Compiler Explorer (godbolt.org)](https://godbolt.org/)
		- [C++ Insights — See template expansions](https://cppinsights.io/)
		- [Quick Bench — Benchmark C++ code](https://quick-bench.com/)
		- [Learn C++ (learncpp.com)](https://www.learncpp.com/)
		- [C++ Algorithms (TheAlgorithms)](https://github.com/TheAlgorithms/C-Plus-Plus)
		- [Awesome C++](https://github.com/fffaraz/awesome-cpp)