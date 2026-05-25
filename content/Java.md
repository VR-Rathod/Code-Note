---
date: 2024-10-31T19:09:35-07:00
lastmod: 2026-04-06T17:35:35+05:30

seoTitle: Java Programming Reference – Modern Java Syntax and Features
description: "Comprehensive Java reference covering Collections, Streams, Generics, Lambdas, Concurrency, JVM internals, Java 11/17/21 features, and object-oriented design patterns."
keywords: "java, Java programming, Java reference, collections, streams, generics, lambdas, concurrency, JVM, Java 17, Java 21, object-oriented, design patterns, java notes, java cheatsheet, java guide, VR-Rathod, Code-Note"
---

- # History
- **How**:
	- Developed by **James Gosling** and his team at **Sun Microsystems** in **1991**.
	- Originally called **Oak**, renamed to **Java** in 1995.
	- Designed as "write once, run anywhere" via the **Java Virtual Machine (JVM)**.
	- Evolved through major releases: Java 5 (generics), Java 8 (lambdas/streams), Java 11 (LTS), Java 17 (LTS), Java 21 (LTS, virtual threads).
-
- **Who**:
	- **James Gosling** — creator of Java, known as the "father of Java".
	- **Sun Microsystems** (later acquired by **Oracle** in 2010).
-
- **Why**:
	- To create a **platform-independent** language that runs on any device with a JVM.
	- To provide a **secure, reliable, high-performance** language for enterprise and web applications.
	- To support **distributed computing** and internet-based applications.
-
- # Introduction
	- ## Advantages
		- **Platform Independence** — Bytecode runs on any JVM (Windows, Linux, macOS).
		- **Object-Oriented** — Supports inheritance, polymorphism, encapsulation, abstraction.
		- **Garbage Collection** — Automatic memory management reduces memory leaks.
		- **Rich Standard Library** — Extensive Java API for networking, I/O, data structures, GUI.
		- **Strong Ecosystem** — Spring, Hibernate, Maven, Gradle, and thousands of libraries.
		- **Security** — Bytecode verification, sandbox model, built-in encryption.
		- **Multithreading** — Built-in support for concurrent programming.
	-
	- ## Disadvantages
		- **Performance Overhead** — JVM abstraction is slower than native compiled languages.
		- **Verbose Syntax** — More boilerplate than Python or Kotlin.
		- **Memory Consumption** — JVM and GC overhead can be significant.
		- **Slow Startup** — JVM initialization adds startup latency.
		- **No Low-Level Access** — Cannot directly manipulate hardware or memory.
- # Basics
	- ## Hello World & Entry Point
		- ```java
		  public class HelloWorld {
		      public static void main(String[] args) {
		          System.out.println("Hello, World!");
		      }
		  }
		  ```
		- `main()` is the program entry point, must be `public static void`.
		- `System.out.println()` prints to console with newline.
	-
	- ## Comments
		- ```java
		  // Single line comment
		  
		  /* Multi-line
		     comment */
		  
		  /** Javadoc comment
		   * Used for documentation generation
		   * @param name description
		   * @return description
		   */
		  ```
	-
	- ## Variables & Data Types
		- ```java
		  int age = 25;                    // Integer (4 bytes)
		  long bigNum = 9999999999L;       // Long (8 bytes)
		  float price = 9.99f;             // Float (4 bytes)
		  double pi = 3.14159265;          // Double (8 bytes)
		  char grade = 'A';                // Character (2 bytes, Unicode)
		  boolean isActive = true;         // Boolean (true/false)
		  String name = "Kiro";            // String (object, not primitive)
		  
		  // Constants
		  final int MAX = 100;
		  final double TAX = 0.18;
		  ```
	-
	- ## Primitive Data Types Table
		- ```
		  Type       Size        Range
		  byte       1 byte      -128 to 127
		  short      2 bytes     -32,768 to 32,767
		  int        4 bytes     -2,147,483,648 to 2,147,483,647
		  long       8 bytes     -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
		  float      4 bytes     ~6-7 decimal digits precision
		  double     8 bytes     ~15-16 decimal digits precision
		  char       2 bytes     0 to 65,535 (Unicode)
		  boolean    1 byte      true / false
		  ```
	-
	- ## Type Inference (var - Java 10+)
		- ```java
		  var x = 42;              // int
		  var y = 3.14;            // double
		  var s = "hello";         // String
		  var list = new ArrayList<String>(); // ArrayList<String>
		  
		  // var only works for local variables with initializers
		  ```
	-
	- ## User Input
		- ```java
		  import java.util.Scanner;
		  
		  public class Main {
		      public static void main(String[] args) {
		          Scanner scanner = new Scanner(System.in);
		          
		          System.out.print("Enter a number: ");
		          int num = scanner.nextInt();
		          
		          System.out.print("Enter your name: ");
		          scanner.nextLine(); // consume newline
		          String name = scanner.nextLine();
		          
		          System.out.println("Hello " + name + ", you entered " + num);
		          scanner.close();
		      }
		  }
		  ```
	-
	- ## Operators
	  collapsed:: true
		- ```java
		  // Arithmetic
		  +  -  *  /  %   // add, sub, mul, div, modulo
		  ++x  x++        // pre/post increment
		  --x  x--        // pre/post decrement
		  
		  // Relational
		  ==  !=  <  >  <=  >=
		  
		  // Logical
		  &&  ||  !
		  
		  // Bitwise
		  &   |   ^   ~   <<   >>   >>>  // >>> is unsigned right shift
		  
		  // Assignment
		  =  +=  -=  *=  /=  %=  &=  |=  ^=  <<=  >>=  >>>=
		  
		  // Ternary
		  int max = (a > b) ? a : b;
		  
		  // instanceof
		  if (obj instanceof String) { ... }
		  ```
	-
	- ## Type Casting
	  collapsed:: true
		- ```java
		  // Widening (automatic)
		  int i = 9;
		  double d = i;  // 9.0
		  
		  // Narrowing (manual)
		  double d = 9.78;
		  int i = (int) d;  // 9 (truncates)
		  
		  // Object casting
		  Object obj = "Hello";
		  String str = (String) obj;  // downcast
		  
		  // Safe casting with instanceof
		  if (obj instanceof String) {
		      String s = (String) obj;
		  }
		  
		  // Pattern matching (Java 16+)
		  if (obj instanceof String s) {
		      System.out.println(s.length());  // s is already cast
		  }
		  ```
- # Control Flow
  collapsed:: true
	- ## if / else if / else
	  collapsed:: true
		- ```java
		  int score = 85;
		  
		  if (score >= 90) {
		      System.out.println("A");
		  } else if (score >= 80) {
		      System.out.println("B");
		  } else if (score >= 70) {
		      System.out.println("C");
		  } else {
		      System.out.println("F");
		  }
		  // Output: B
		  ```
	-
	- ## Switch Statement
	  collapsed:: true
		- ```java
		  int day = 3;
		  switch (day) {
		      case 1: System.out.println("Monday");    break;
		      case 2: System.out.println("Tuesday");   break;
		      case 3: System.out.println("Wednesday"); break;
		      default: System.out.println("Other");    break;
		  }
		  
		  // Switch Expression (Java 14+)
		  String result = switch (day) {
		      case 1 -> "Monday";
		      case 2 -> "Tuesday";
		      case 3 -> "Wednesday";
		      default -> "Other";
		  };
		  ```
	-
	- ## Ternary Operator
	  collapsed:: true
		- ```java
		  int max = (a > b) ? a : b;
		  String label = (age >= 18) ? "Adult" : "Minor";
		  ```
	-
	- ## Loops
	  collapsed:: true
		- ```java
		  // for loop
		  for (int i = 0; i < 5; i++) {
		      System.out.print(i + " ");
		  }
		  // Output: 0 1 2 3 4
		  
		  // while loop
		  int i = 0;
		  while (i < 5) {
		      System.out.print(i++);
		  }
		  
		  // do-while (executes at least once)
		  int n = 0;
		  do {
		      System.out.print(n++);
		  } while (n < 3);
		  
		  // enhanced for (for-each)
		  int[] nums = {1, 2, 3, 4, 5};
		  for (int num : nums) {
		      System.out.print(num + " ");
		  }
		  ```
	-
	- ## break / continue / labeled
	  collapsed:: true
		- ```java
		  for (int i = 0; i < 10; i++) {
		      if (i == 3) continue; // skip 3
		      if (i == 7) break;    // stop at 7
		      System.out.print(i + " ");
		  }
		  // Output: 0 1 2 4 5 6
		  
		  // Labeled break — exit outer loop
		  outer:
		  for (int i = 0; i < 3; i++) {
		      for (int j = 0; j < 3; j++) {
		          if (j == 1) break outer;
		          System.out.println(i + "," + j);
		      }
		  }
		  ```
- # Functions (Methods)
  collapsed:: true
	- ## Declaration & Calling
	  collapsed:: true
		- ```java
		  public class Main {
		      // static method — called without an object
		      static int add(int a, int b) {
		          return a + b;
		      }
		  
		      public static void main(String[] args) {
		          System.out.println(add(3, 4)); // 7
		      }
		  }
		  ```
	-
	- ## Method Overloading
	  collapsed:: true
		- ```java
		  static int area(int side) { return side * side; }
		  static int area(int w, int h) { return w * h; }
		  static double area(double r) { return Math.PI * r * r; }
		  
		  System.out.println(area(5));       // 25
		  System.out.println(area(3, 4));    // 12
		  System.out.println(area(2.0));     // 12.566...
		  ```
	-
	- ## Varargs
	  collapsed:: true
		- ```java
		  static int sum(int... nums) {
		      int total = 0;
		      for (int n : nums) total += n;
		      return total;
		  }
		  
		  System.out.println(sum(1, 2, 3));       // 6
		  System.out.println(sum(1, 2, 3, 4, 5)); // 15
		  ```
	-
	- ## Recursion
	  collapsed:: true
		- ```java
		  static int factorial(int n) {
		      if (n <= 1) return 1;
		      return n * factorial(n - 1);
		  }
		  
		  System.out.println(factorial(5)); // 120
		  ```
	-
	- ## Lambda Expressions (Java 8+)
	  collapsed:: true
		- ```java
		  import java.util.function.*;
		  
		  // (params) -> expression
		  // (params) -> { body }
		  
		  // Functional interface
		  Runnable r = () -> System.out.println("Hello");
		  r.run(); // Hello
		  
		  // BiFunction
		  BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;
		  System.out.println(add.apply(3, 4)); // 7
		  
		  // Predicate
		  Predicate<String> isEmpty = s -> s.isEmpty();
		  System.out.println(isEmpty.test("")); // true
		  
		  // Function
		  Function<String, Integer> len = s -> s.length();
		  System.out.println(len.apply("hello")); // 5
		  
		  // Consumer
		  Consumer<String> print = s -> System.out.println(s);
		  print.accept("World"); // World
		  
		  // Supplier
		  Supplier<String> greet = () -> "Hello!";
		  System.out.println(greet.get()); // Hello!
		  ```
	-
	- ## Method References (Java 8+)
	  collapsed:: true
		- ```java
		  // ClassName::staticMethod
		  Function<String, Integer> parse = Integer::parseInt;
		  
		  // instance::method
		  String str = "hello";
		  Supplier<Integer> len = str::length;
		  
		  // ClassName::instanceMethod
		  Function<String, String> upper = String::toUpperCase;
		  
		  // ClassName::new (constructor reference)
		  Supplier<ArrayList<String>> listFactory = ArrayList::new;
		  
		  // Used with streams
		  List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
		  names.forEach(System.out::println);
		  ```
- # Arrays & Strings
  collapsed:: true
	- ## Arrays
	  collapsed:: true
		- ```java
		  // Declaration & initialization
		  int[] marks = {92, 87, 95, 78, 88};
		  int[] arr = new int[5]; // default 0
		  
		  System.out.println(marks[0]);  // 92
		  System.out.println(marks.length); // 5
		  
		  // 2D array
		  int[][] grid = {{1, 2, 3}, {4, 5, 6}};
		  System.out.println(grid[1][2]); // 6
		  
		  // Iterate
		  for (int m : marks) System.out.print(m + " ");
		  
		  // Sort & search
		  Arrays.sort(marks);
		  int idx = Arrays.binarySearch(marks, 92);
		  
		  // Copy
		  int[] copy = Arrays.copyOf(marks, marks.length);
		  int[] range = Arrays.copyOfRange(marks, 1, 4);
		  
		  // Fill
		  Arrays.fill(arr, 7); // {7,7,7,7,7}
		  ```
	-
	- ## String
	  collapsed:: true
		- ```java
		  String s = "Hello, World!";
		  
		  System.out.println(s.length());        // 13
		  System.out.println(s.charAt(0));        // H
		  System.out.println(s.substring(7, 12)); // World
		  System.out.println(s.indexOf("World")); // 7
		  System.out.println(s.contains("World")); // true
		  System.out.println(s.toUpperCase());    // HELLO, WORLD!
		  System.out.println(s.toLowerCase());    // hello, world!
		  System.out.println(s.trim());           // removes leading/trailing spaces
		  System.out.println(s.replace("World", "Java")); // Hello, Java!
		  System.out.println(s.startsWith("Hello")); // true
		  System.out.println(s.endsWith("!"));    // true
		  System.out.println(s.isEmpty());        // false
		  
		  // Split
		  String[] parts = "a,b,c".split(","); // ["a","b","c"]
		  
		  // Join
		  String joined = String.join("-", "a", "b", "c"); // a-b-c
		  
		  // Convert
		  int n = Integer.parseInt("42");
		  String str = String.valueOf(99);
		  
		  // Compare (always use .equals(), not ==)
		  if (s.equals("Hello")) { ... }
		  if (s.equalsIgnoreCase("hello")) { ... }
		  ```
	-
	- ## StringBuilder
	  collapsed:: true
		- ```java
		  // Mutable string — use for heavy concatenation
		  StringBuilder sb = new StringBuilder();
		  sb.append("Hello");
		  sb.append(", ");
		  sb.append("World!");
		  sb.insert(5, " there");
		  sb.delete(5, 11);
		  sb.reverse();
		  
		  String result = sb.toString();
		  System.out.println(sb.length()); // current length
		  ```
	-
	- ## String Formatting
	  collapsed:: true
		- ```java
		  // String.format
		  String msg = String.format("Name: %s, Age: %d, Score: %.2f", "Alice", 30, 95.5);
		  
		  // printf (to console)
		  System.out.printf("%-10s %5d%n", "Alice", 30);
		  
		  // Text blocks (Java 15+)
		  String json = """
		          {
		              "name": "Alice",
		              "age": 30
		          }
		          """;
		  
		  // Formatted (Java 15+)
		  String s = "Hello %s".formatted("World"); // Hello World
		  ```
- # OOP — Object-Oriented Programming
	- [[DSA Algo & System Design]] - visit this page for in-depth Learning
	-
	- ## Classes & Objects
	  collapsed:: true
		- ```java
		  public class Car {
		      // Fields
		      String brand;
		      int year;
		  
		      // Method
		      void display() {
		          System.out.println(brand + " (" + year + ")");
		      }
		  }
		  
		  Car c = new Car();
		  c.brand = "Toyota";
		  c.year = 2022;
		  c.display(); // Toyota (2022)
		  ```
	-
	- ## Constructors
	  collapsed:: true
		- ```java
		  public class Person {
		      String name;
		      int age;
		  
		      // Default constructor
		      Person() {
		          this.name = "Unknown";
		          this.age = 0;
		      }
		  
		      // Parameterized constructor
		      Person(String name, int age) {
		          this.name = name;
		          this.age = age;
		      }
		  
		      // Constructor chaining with this()
		      Person(String name) {
		          this(name, 0); // calls parameterized constructor
		      }
		  
		      void show() {
		          System.out.println(name + ", " + age);
		      }
		  }
		  
		  Person p1 = new Person("Alice", 30);
		  p1.show(); // Alice, 30
		  ```
	-
	- ## Access Modifiers
	  collapsed:: true
		- ```java
		  public class BankAccount {
		      public String owner;      // accessible everywhere
		      protected double balance; // accessible in class + subclasses + package
		      int accountNum;           // package-private (default)
		      private String pin;       // accessible only inside this class
		  }
		  
		  // Modifier   Class  Package  Subclass  World
		  // public       Y      Y        Y         Y
		  // protected    Y      Y        Y         N
		  // (default)    Y      Y        N         N
		  // private      Y      N        N         N
		  ```
	-
	- ## Getters & Setters (Encapsulation)
	  collapsed:: true
		- ```java
		  public class Temperature {
		      private double celsius;
		  
		      public void setCelsius(double c) {
		          if (c >= -273.15) this.celsius = c;
		      }
		      public double getCelsius() { return celsius; }
		      public double getFahrenheit() { return celsius * 9.0 / 5.0 + 32; }
		  }
		  
		  Temperature t = new Temperature();
		  t.setCelsius(100);
		  System.out.println(t.getFahrenheit()); // 212.0
		  ```
	-
	- ## Static Members
	  collapsed:: true
		- ```java
		  public class Counter {
		      static int count = 0; // shared across all instances
		  
		      Counter() { count++; }
		  
		      static int getCount() { return count; } // static method
		  }
		  
		  new Counter(); new Counter(); new Counter();
		  System.out.println(Counter.getCount()); // 3
		  ```
	-
	- ## Records (Java 16+)
	  collapsed:: true
		- ```java
		  // Immutable data class — auto-generates constructor, getters, equals, hashCode, toString
		  record Point(int x, int y) {}
		  
		  Point p = new Point(3, 4);
		  System.out.println(p.x());       // 3
		  System.out.println(p.y());       // 4
		  System.out.println(p);           // Point[x=3, y=4]
		  
		  // Custom compact constructor
		  record Range(int min, int max) {
		      Range {
		          if (min > max) throw new IllegalArgumentException("min > max");
		      }
		  }
		  ```
-
- # OOP — Inheritance
  collapsed:: true
	- ## Single Inheritance
	  collapsed:: true
		- ```java
		  class Animal {
		      String name;
		      Animal(String name) { this.name = name; }
		      void eat() { System.out.println(name + " is eating"); }
		  }
		  
		  class Dog extends Animal {
		      Dog(String name) { super(name); } // call parent constructor
		      void bark() { System.out.println(name + " says Woof!"); }
		  }
		  
		  Dog d = new Dog("Rex");
		  d.eat();   // Rex is eating
		  d.bark();  // Rex says Woof!
		  ```
	-
	- ## Method Overriding
	  collapsed:: true
		- ```java
		  class Shape {
		      double area() { return 0; }
		      void draw() { System.out.println("Drawing shape"); }
		  }
		  
		  class Circle extends Shape {
		      double r;
		      Circle(double r) { this.r = r; }
		  
		      @Override
		      double area() { return Math.PI * r * r; }
		  
		      @Override
		      void draw() { System.out.println("Drawing circle"); }
		  }
		  
		  Shape s = new Circle(5); // polymorphism
		  s.draw();                // Drawing circle
		  System.out.println(s.area()); // 78.539...
		  ```
	-
	- ## super Keyword
	  collapsed:: true
		- ```java
		  class Vehicle {
		      String type = "Vehicle";
		      void info() { System.out.println("I am a " + type); }
		  }
		  
		  class Car extends Vehicle {
		      String type = "Car";
		  
		      void info() {
		          super.info();                    // call parent method
		          System.out.println("I am a " + type);
		          System.out.println("Parent type: " + super.type); // parent field
		      }
		  }
		  ```
	-
	- ## final Keyword
	  collapsed:: true
		- ```java
		  final int MAX = 100;          // constant — cannot reassign
		  
		  final class Immutable { ... } // cannot be subclassed
		  
		  class Base {
		      final void locked() { ... } // cannot be overridden
		  }
		  ```
	-
	- ## Abstract Classes
	  collapsed:: true
		- ```java
		  abstract class Animal {
		      abstract void sound(); // must be implemented by subclass
		  
		      void breathe() { System.out.println("Breathing..."); } // concrete method
		  }
		  
		  // Animal a = new Animal(); // ERROR — cannot instantiate abstract class
		  
		  class Dog extends Animal {
		      @Override
		      void sound() { System.out.println("Woof!"); }
		  }
		  
		  Animal a = new Dog();
		  a.sound();   // Woof!
		  a.breathe(); // Breathing...
		  ```
	-
	- ## Interfaces
	  collapsed:: true
		- ```java
		  interface Flyable {
		      void fly(); // abstract by default
		  
		      default void land() { // default method (Java 8+)
		          System.out.println("Landing...");
		      }
		  
		      static void info() { // static method (Java 8+)
		          System.out.println("Flyable interface");
		      }
		  }
		  
		  interface Swimmable {
		      void swim();
		  }
		  
		  // A class can implement multiple interfaces
		  class Duck implements Flyable, Swimmable {
		      public void fly()  { System.out.println("Duck flying"); }
		      public void swim() { System.out.println("Duck swimming"); }
		  }
		  
		  Duck d = new Duck();
		  d.fly();   // Duck flying
		  d.swim();  // Duck swimming
		  d.land();  // Landing... (default method)
		  Flyable.info(); // Flyable interface (static method)
		  ```
- # OOP — Polymorphism
  collapsed:: true
	- ## Runtime Polymorphism
	  collapsed:: true
		- ```java
		  class Shape {
		      double area() { return 0; }
		      void draw() { System.out.println("Drawing shape"); }
		  }
		  
		  class Circle extends Shape {
		      double r;
		      Circle(double r) { this.r = r; }
		  
		      @Override double area() { return Math.PI * r * r; }
		      @Override void draw() { System.out.println("Drawing circle"); }
		  }
		  
		  class Rectangle extends Shape {
		      double w, h;
		      Rectangle(double w, double h) { this.w = w; this.h = h; }
		  
		      @Override double area() { return w * h; }
		      @Override void draw() { System.out.println("Drawing rectangle"); }
		  }
		  
		  // Polymorphic usage via base reference
		  Shape s1 = new Circle(5);
		  Shape s2 = new Rectangle(4, 6);
		  
		  s1.draw();                    // Drawing circle
		  s2.draw();                    // Drawing rectangle
		  System.out.println(s1.area()); // 78.539...
		  ```
	-
	- ## Sealed Classes (Java 17+)
	  collapsed:: true
		- ```java
		  // Restrict which classes can extend/implement
		  sealed class Shape permits Circle, Rectangle, Triangle {}
		  
		  final class Circle extends Shape { double r; }
		  final class Rectangle extends Shape { double w, h; }
		  non-sealed class Triangle extends Shape {} // can be extended freely
		  
		  // Works great with pattern matching switch (Java 21+)
		  double area(Shape s) {
		      return switch (s) {
		          case Circle c    -> Math.PI * c.r * c.r;
		          case Rectangle r -> r.w * r.h;
		          case Triangle t  -> 0; // handle
		      };
		  }
		  ```
- # OOP — Advanced Concepts
  collapsed:: true
	- ## Generics
	  collapsed:: true
		- ```java
		  // Generic class
		  class Stack<T> {
		      private List<T> data = new ArrayList<>();
		  
		      public void push(T val) { data.add(val); }
		      public T pop() { return data.remove(data.size() - 1); }
		      public T peek() { return data.get(data.size() - 1); }
		      public boolean isEmpty() { return data.isEmpty(); }
		  }
		  
		  Stack<Integer> si = new Stack<>();
		  si.push(1); si.push(2); si.push(3);
		  System.out.println(si.peek()); // 3
		  
		  // Generic method
		  static <T extends Comparable<T>> T maxOf(T a, T b) {
		      return (a.compareTo(b) > 0) ? a : b;
		  }
		  System.out.println(maxOf(3, 7));       // 7
		  System.out.println(maxOf("apple", "banana")); // banana
		  
		  // Wildcards
		  void printList(List<?> list) { ... }           // unknown type
		  void addNumbers(List<? extends Number> list) { ... } // upper bound
		  void addInts(List<? super Integer> list) { ... }     // lower bound
		  ```
	-
	- ## Enums
	  collapsed:: true
		- ```java
		  enum Day {
		      MON, TUE, WED, THU, FRI, SAT, SUN
		  }
		  
		  Day d = Day.WED;
		  System.out.println(d);         // WED
		  System.out.println(d.ordinal()); // 2
		  System.out.println(d.name());    // WED
		  
		  // Enum with fields & methods
		  enum Planet {
		      MERCURY(3.303e+23, 2.4397e6),
		      EARTH(5.976e+24, 6.37814e6);
		  
		      private final double mass, radius;
		      Planet(double mass, double radius) {
		          this.mass = mass;
		          this.radius = radius;
		      }
		      double surfaceGravity() { return 6.67300E-11 * mass / (radius * radius); }
		  }
		  
		  System.out.println(Planet.EARTH.surfaceGravity()); // 9.802...
		  
		  // Switch on enum
		  switch (d) {
		      case SAT, SUN -> System.out.println("Weekend");
		      default       -> System.out.println("Weekday");
		  }
		  ```
	-
	- ## Functional Interfaces & @FunctionalInterface
	  collapsed:: true
		- ```java
		  @FunctionalInterface
		  interface Transformer<T, R> {
		      R transform(T input);
		  }
		  
		  Transformer<String, Integer> len = s -> s.length();
		  System.out.println(len.transform("hello")); // 5
		  
		  // Built-in functional interfaces (java.util.function)
		  // Function<T,R>    — T -> R
		  // BiFunction<T,U,R>— (T,U) -> R
		  // Predicate<T>     — T -> boolean
		  // Consumer<T>      — T -> void
		  // Supplier<T>      — () -> T
		  // UnaryOperator<T> — T -> T
		  // BinaryOperator<T>— (T,T) -> T
		  ```
- # Collections Framework
  collapsed:: true
	- ## Collections Overview
	  collapsed:: true
		- ```
		  Interface     Implementation       Use Case
		  List          ArrayList            Dynamic array, fast random access
		  List          LinkedList           Fast insert/remove at ends
		  Set           HashSet              Unique elements, O(1) avg lookup
		  Set           LinkedHashSet        Unique elements, insertion order
		  Set           TreeSet              Unique sorted elements
		  Map           HashMap              Key-value, O(1) avg lookup
		  Map           LinkedHashMap        Key-value, insertion order
		  Map           TreeMap              Key-value, sorted by key
		  Queue         ArrayDeque           FIFO / LIFO (preferred over Stack)
		  Queue         PriorityQueue        Min-heap by default
		  ```
	-
	- ## List — ArrayList & LinkedList
	  collapsed:: true
		- ```java
		  import java.util.*;
		  
		  List<Integer> list = new ArrayList<>();
		  list.add(1); list.add(2); list.add(3);
		  list.add(1, 99);          // insert at index 1 → [1,99,2,3]
		  list.remove(Integer.valueOf(99)); // remove by value
		  list.remove(0);           // remove by index
		  
		  System.out.println(list.get(0));   // 1
		  System.out.println(list.size());   // 2
		  System.out.println(list.contains(2)); // true
		  
		  Collections.sort(list);
		  Collections.reverse(list);
		  Collections.shuffle(list);
		  
		  // Iterate
		  for (int x : list) System.out.print(x + " ");
		  list.forEach(System.out::println);
		  ```
	-
	- ## Map — HashMap & TreeMap
	  collapsed:: true
		- ```java
		  Map<String, Integer> scores = new HashMap<>();
		  scores.put("Alice", 95);
		  scores.put("Bob", 87);
		  scores.putIfAbsent("Charlie", 91);
		  
		  System.out.println(scores.get("Alice"));          // 95
		  System.out.println(scores.getOrDefault("Dave", 0)); // 0
		  System.out.println(scores.containsKey("Bob"));    // true
		  scores.remove("Bob");
		  
		  // Iterate
		  for (Map.Entry<String, Integer> e : scores.entrySet()) {
		      System.out.println(e.getKey() + ": " + e.getValue());
		  }
		  scores.forEach((k, v) -> System.out.println(k + "=" + v));
		  
		  // Compute
		  scores.compute("Alice", (k, v) -> v + 5);  // Alice: 100
		  scores.merge("Alice", 10, Integer::sum);    // Alice: 110
		  ```
	-
	- ## Set — HashSet & TreeSet
	  collapsed:: true
		- ```java
		  Set<Integer> set = new HashSet<>(Arrays.asList(5, 3, 1, 4, 2));
		  set.add(6);
		  set.remove(3);
		  System.out.println(set.contains(4)); // true
		  
		  // TreeSet — sorted
		  Set<Integer> sorted = new TreeSet<>(set);
		  System.out.println(sorted); // [1, 2, 4, 5, 6]
		  ```
	-
	- ## Queue & Deque
	  collapsed:: true
		- ```java
		  // ArrayDeque — preferred for both Queue and Stack
		  Deque<Integer> queue = new ArrayDeque<>();
		  queue.offer(1); queue.offer(2); queue.offer(3); // enqueue
		  System.out.println(queue.peek());  // 1 (front)
		  System.out.println(queue.poll());  // 1 (remove front)
		  
		  // Use as Stack (LIFO)
		  Deque<Integer> stack = new ArrayDeque<>();
		  stack.push(1); stack.push(2); stack.push(3);
		  System.out.println(stack.peek()); // 3 (top)
		  System.out.println(stack.pop());  // 3
		  
		  // PriorityQueue — min-heap by default
		  PriorityQueue<Integer> pq = new PriorityQueue<>();
		  pq.offer(3); pq.offer(1); pq.offer(5);
		  System.out.println(pq.peek()); // 1
		  
		  // Max-heap
		  PriorityQueue<Integer> maxPq = new PriorityQueue<>(Collections.reverseOrder());
		  ```
- # Streams API (Java 8+)
  collapsed:: true
	- ## Stream Basics
	  collapsed:: true
		- ```java
		  import java.util.stream.*;
		  
		  List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
		  
		  // filter → map → collect
		  List<Integer> result = nums.stream()
		      .filter(n -> n % 2 == 0)       // keep evens
		      .map(n -> n * n)                // square them
		      .collect(Collectors.toList());  // [4, 16, 36, 64, 100]
		  
		  // reduce
		  int sum = nums.stream().reduce(0, Integer::sum); // 55
		  
		  // count, min, max
		  long count = nums.stream().filter(n -> n > 5).count(); // 5
		  Optional<Integer> max = nums.stream().max(Integer::compareTo); // 10
		  
		  // forEach
		  nums.stream().forEach(System.out::println);
		  
		  // anyMatch, allMatch, noneMatch
		  boolean anyEven = nums.stream().anyMatch(n -> n % 2 == 0); // true
		  boolean allPos  = nums.stream().allMatch(n -> n > 0);       // true
		  ```
	-
	- ## Stream Operations
	  collapsed:: true
		- ```java
		  List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "Dave", "Eve");
		  
		  // sorted, distinct, limit, skip
		  names.stream()
		      .filter(s -> s.length() > 3)
		      .sorted()
		      .limit(3)
		      .forEach(System.out::println); // Alice, Charlie, Dave
		  
		  // flatMap — flatten nested collections
		  List<List<Integer>> nested = Arrays.asList(
		      Arrays.asList(1, 2), Arrays.asList(3, 4));
		  List<Integer> flat = nested.stream()
		      .flatMap(Collection::stream)
		      .collect(Collectors.toList()); // [1,2,3,4]
		  
		  // Collectors
		  Map<Integer, List<String>> byLength = names.stream()
		      .collect(Collectors.groupingBy(String::length));
		  
		  String joined = names.stream()
		      .collect(Collectors.joining(", ", "[", "]")); // [Alice, Bob, ...]
		  
		  // toMap
		  Map<String, Integer> nameLengths = names.stream()
		      .collect(Collectors.toMap(s -> s, String::length));
		  ```
	-
	- ## Parallel Streams
	  collapsed:: true
		- ```java
		  // parallelStream — uses ForkJoinPool
		  long sum = LongStream.rangeClosed(1, 1_000_000)
		      .parallel()
		      .sum(); // 500000500000
		  
		  List<Integer> result = nums.parallelStream()
		      .filter(n -> n % 2 == 0)
		      .collect(Collectors.toList());
		  ```
	-
	- ## Optional (Java 8+)
	  collapsed:: true
		- ```java
		  Optional<String> opt = Optional.of("Hello");
		  Optional<String> empty = Optional.empty();
		  
		  opt.isPresent();                    // true
		  opt.get();                          // "Hello"
		  opt.orElse("default");              // "Hello"
		  empty.orElse("default");            // "default"
		  empty.orElseGet(() -> "computed");  // "computed"
		  empty.orElseThrow(() -> new RuntimeException("missing"));
		  
		  opt.map(String::toUpperCase);       // Optional["HELLO"]
		  opt.filter(s -> s.length() > 3);   // Optional["Hello"]
		  opt.ifPresent(System.out::println); // Hello
		  
		  // From nullable
		  Optional<String> nullable = Optional.ofNullable(null); // empty
		  ```
- # Exception Handling
  collapsed:: true
	- ## try / catch / finally
	  collapsed:: true
		- ```java
		  static double divide(double a, double b) {
		      if (b == 0) throw new ArithmeticException("Division by zero");
		      return a / b;
		  }
		  
		  try {
		      System.out.println(divide(10, 2));  // 5.0
		      System.out.println(divide(10, 0));  // throws
		  } catch (ArithmeticException e) {
		      System.err.println("Error: " + e.getMessage());
		  } catch (Exception e) {
		      System.err.println("Exception: " + e.getMessage());
		  } finally {
		      System.out.println("Always runs");
		  }
		  ```
	-
	- ## Exception Hierarchy
	  collapsed:: true
		- ```
		  Throwable
		  ├── Error (don't catch — JVM errors)
		  │   ├── OutOfMemoryError
		  │   └── StackOverflowError
		  └── Exception
		      ├── RuntimeException (unchecked)
		      │   ├── NullPointerException
		      │   ├── ArrayIndexOutOfBoundsException
		      │   ├── ClassCastException
		      │   └── ArithmeticException
		      └── IOException (checked — must handle or declare)
		          ├── FileNotFoundException
		          └── SQLException
		  ```
	-
	- ## Checked vs Unchecked
	  collapsed:: true
		- ```java
		  // Checked — must declare with throws or catch
		  void readFile(String path) throws IOException {
		      FileReader fr = new FileReader(path); // throws FileNotFoundException
		  }
		  
		  // Unchecked — RuntimeException, no need to declare
		  void process(String s) {
		      System.out.println(s.length()); // NullPointerException if s is null
		  }
		  ```
	-
	- ## Custom Exceptions
	  collapsed:: true
		- ```java
		  class AppException extends RuntimeException {
		      private final int code;
		  
		      AppException(String message, int code) {
		          super(message);
		          this.code = code;
		      }
		  
		      int getCode() { return code; }
		  }
		  
		  throw new AppException("Something went wrong", 500);
		  ```
	-
	- ## try-with-resources (Java 7+)
	  collapsed:: true
		- ```java
		  // AutoCloseable resources are closed automatically
		  try (FileReader fr = new FileReader("data.txt");
		       BufferedReader br = new BufferedReader(fr)) {
		      String line;
		      while ((line = br.readLine()) != null) {
		          System.out.println(line);
		      }
		  } catch (IOException e) {
		      e.printStackTrace();
		  }
		  // fr and br are closed even if exception occurs
		  ```
	-
	- ## Multi-catch (Java 7+)
	  collapsed:: true
		- ```java
		  try {
		      // risky code
		  } catch (IOException | SQLException e) {
		      System.err.println("IO or SQL error: " + e.getMessage());
		  }
		  ```
- # Modern Java Features
  collapsed:: true
	- ## Java 8 Key Features
	  collapsed:: true
		- ```java
		  // Lambda expressions
		  Runnable r = () -> System.out.println("Hello");
		  
		  // Streams API
		  list.stream().filter(x -> x > 0).map(x -> x * 2).collect(Collectors.toList());
		  
		  // Optional
		  Optional<String> opt = Optional.ofNullable(value);
		  
		  // Default methods in interfaces
		  interface Greeter {
		      default void greet() { System.out.println("Hello!"); }
		  }
		  
		  // Method references
		  names.forEach(System.out::println);
		  
		  // Date/Time API (java.time)
		  LocalDate today = LocalDate.now();
		  LocalDateTime now = LocalDateTime.now();
		  ```
	-
	- ## Java 11 Key Features
	  collapsed:: true
		- ```java
		  // String methods
		  "  hello  ".strip();          // "hello" (Unicode-aware trim)
		  "".isBlank();                 // true
		  "a\nb\nc".lines().count();    // 3
		  "ha".repeat(3);               // "hahaha"
		  
		  // var in lambda (Java 11)
		  list.stream().map((var s) -> s.toUpperCase());
		  
		  // HTTP Client (java.net.http)
		  HttpClient client = HttpClient.newHttpClient();
		  HttpRequest request = HttpRequest.newBuilder()
		      .uri(URI.create("https://example.com"))
		      .build();
		  HttpResponse<String> response = client.send(request,
		      HttpResponse.BodyHandlers.ofString());
		  System.out.println(response.body());
		  ```
	-
	- ## Java 17 Key Features
	  collapsed:: true
		- ```java
		  // Sealed classes
		  sealed interface Shape permits Circle, Rectangle {}
		  
		  // Pattern matching for instanceof (Java 16)
		  if (obj instanceof String s) {
		      System.out.println(s.toUpperCase()); // s already cast
		  }
		  
		  // Records (Java 16)
		  record Point(int x, int y) {}
		  
		  // Switch expressions (Java 14)
		  String result = switch (day) {
		      case MON, TUE -> "Early week";
		      case WED      -> "Midweek";
		      default       -> "Late week";
		  };
		  
		  // Text blocks (Java 15)
		  String json = """
		          {"name": "Alice", "age": 30}
		          """;
		  ```
	-
	- ## Java 21 Key Features
	  collapsed:: true
		- ```java
		  // Virtual Threads (Project Loom)
		  Thread.ofVirtual().start(() -> System.out.println("Virtual thread!"));
		  
		  // Structured Concurrency
		  try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
		      Future<String> user  = scope.fork(() -> fetchUser());
		      Future<String> order = scope.fork(() -> fetchOrder());
		      scope.join().throwIfFailed();
		      return user.resultNow() + order.resultNow();
		  }
		  
		  // Pattern Matching for switch (Java 21)
		  Object obj = 42;
		  String desc = switch (obj) {
		      case Integer i -> "int: " + i;
		      case String s  -> "string: " + s;
		      case null      -> "null";
		      default        -> "other";
		  };
		  
		  // Sequenced Collections
		  SequencedCollection<String> sc = new ArrayList<>(List.of("a","b","c"));
		  sc.getFirst(); // "a"
		  sc.getLast();  // "c"
		  sc.reversed(); // ["c","b","a"]
		  ```
- # Concurrency & Multithreading
  collapsed:: true
	- ## Thread Basics
	  collapsed:: true
		- ```java
		  // Extend Thread
		  class MyThread extends Thread {
		      public void run() { System.out.println("Thread " + getId()); }
		  }
		  
		  // Implement Runnable (preferred)
		  Thread t1 = new Thread(() -> System.out.println("Lambda thread"));
		  t1.start();
		  t1.join(); // wait for t1 to finish
		  
		  // Thread info
		  System.out.println(Thread.currentThread().getName());
		  Thread.sleep(1000); // sleep 1 second (throws InterruptedException)
		  ```
	-
	- ## synchronized & Locks
	  collapsed:: true
		- ```java
		  import java.util.concurrent.locks.*;
		  
		  class Counter {
		      private int count = 0;
		  
		      // synchronized method — one thread at a time
		      synchronized void increment() { count++; }
		  
		      // synchronized block — finer control
		      void decrement() {
		          synchronized (this) { count--; }
		      }
		  
		      int getCount() { return count; }
		  }
		  
		  // ReentrantLock — more flexible
		  ReentrantLock lock = new ReentrantLock();
		  lock.lock();
		  try {
		      // critical section
		  } finally {
		      lock.unlock(); // always unlock in finally
		  }
		  ```
	-
	- ## ExecutorService & Thread Pools
	  collapsed:: true
		- ```java
		  import java.util.concurrent.*;
		  
		  // Fixed thread pool
		  ExecutorService executor = Executors.newFixedThreadPool(4);
		  
		  executor.submit(() -> System.out.println("Task 1"));
		  executor.submit(() -> System.out.println("Task 2"));
		  
		  executor.shutdown();       // stop accepting new tasks
		  executor.awaitTermination(5, TimeUnit.SECONDS);
		  
		  // Callable — returns a result
		  Callable<Integer> task = () -> 42;
		  Future<Integer> future = executor.submit(task);
		  System.out.println(future.get()); // 42 (blocks until done)
		  ```
	-
	- ## CompletableFuture (Java 8+)
	  collapsed:: true
		- ```java
		  import java.util.concurrent.CompletableFuture;
		  
		  CompletableFuture<Integer> cf = CompletableFuture
		      .supplyAsync(() -> 42)
		      .thenApply(n -> n * 2)
		      .thenApply(n -> n + 1);
		  
		  System.out.println(cf.get()); // 85
		  
		  // Combine two futures
		  CompletableFuture<String> f1 = CompletableFuture.supplyAsync(() -> "Hello");
		  CompletableFuture<String> f2 = CompletableFuture.supplyAsync(() -> " World");
		  
		  CompletableFuture<String> combined = f1.thenCombine(f2, (a, b) -> a + b);
		  System.out.println(combined.get()); // Hello World
		  
		  // Exception handling
		  cf.exceptionally(ex -> { System.err.println(ex); return -1; });
		  ```
	-
	- ## Atomic Variables
	  collapsed:: true
		- ```java
		  import java.util.concurrent.atomic.*;
		  
		  AtomicInteger counter = new AtomicInteger(0);
		  counter.incrementAndGet();       // thread-safe ++
		  counter.addAndGet(5);            // thread-safe +=
		  counter.get();                   // read
		  counter.set(0);                  // write
		  
		  // Compare-and-swap
		  counter.compareAndSet(5, 10);    // if 5, set to 10
		  ```
- # File I/O
  collapsed:: true
	- ## Reading & Writing Files
	  collapsed:: true
		- ```java
		  import java.nio.file.*;
		  import java.io.*;
		  
		  // Write to file (NIO — preferred)
		  Path path = Path.of("data.txt");
		  Files.writeString(path, "Hello, File!\nLine 2\n");
		  
		  // Read entire file
		  String content = Files.readString(path);
		  
		  // Read all lines
		  List<String> lines = Files.readAllLines(path);
		  lines.forEach(System.out::println);
		  
		  // Append to file
		  Files.writeString(path, "Appended\n", StandardOpenOption.APPEND);
		  
		  // Stream lines (lazy — good for large files)
		  try (Stream<String> stream = Files.lines(path)) {
		      stream.filter(l -> l.contains("Hello")).forEach(System.out::println);
		  }
		  ```
	-
	- ## BufferedReader / BufferedWriter
	  collapsed:: true
		- ```java
		  // Write
		  try (BufferedWriter bw = new BufferedWriter(new FileWriter("out.txt"))) {
		      bw.write("Hello");
		      bw.newLine();
		      bw.write("World");
		  }
		  
		  // Read
		  try (BufferedReader br = new BufferedReader(new FileReader("out.txt"))) {
		      String line;
		      while ((line = br.readLine()) != null) {
		          System.out.println(line);
		      }
		  }
		  ```
	-
	- ## Path & Files Utilities (NIO.2)
	  collapsed:: true
		- ```java
		  Path p = Path.of("src", "main", "App.java");
		  
		  Files.exists(p);                    // check existence
		  Files.createDirectories(p.getParent()); // create dirs
		  Files.copy(p, Path.of("backup.java"), StandardCopyOption.REPLACE_EXISTING);
		  Files.move(p, Path.of("new.java"));
		  Files.delete(p);
		  
		  // Walk directory tree
		  try (Stream<Path> walk = Files.walk(Path.of("."))) {
		      walk.filter(Files::isRegularFile)
		          .filter(f -> f.toString().endsWith(".java"))
		          .forEach(System.out::println);
		  }
		  
		  // File metadata
		  System.out.println(Files.size(p));
		  System.out.println(Files.getLastModifiedTime(p));
		  ```
- # Design Patterns
  collapsed:: true
	- ## Singleton
	  collapsed:: true
		- ```java
		  // Thread-safe lazy singleton
		  public class Singleton {
		      private static volatile Singleton instance;
		  
		      private Singleton() {}
		  
		      public static Singleton getInstance() {
		          if (instance == null) {
		              synchronized (Singleton.class) {
		                  if (instance == null) instance = new Singleton();
		              }
		          }
		          return instance;
		      }
		  }
		  
		  // Enum singleton (simplest, thread-safe)
		  enum AppConfig {
		      INSTANCE;
		      public String getVersion() { return "1.0"; }
		  }
		  AppConfig.INSTANCE.getVersion();
		  ```
	-
	- ## Factory
	  collapsed:: true
		- ```java
		  interface Shape { void draw(); }
		  class Circle implements Shape { public void draw() { System.out.println("Circle"); } }
		  class Square implements Shape { public void draw() { System.out.println("Square"); } }
		  
		  class ShapeFactory {
		      static Shape create(String type) {
		          return switch (type) {
		              case "circle" -> new Circle();
		              case "square" -> new Square();
		              default -> throw new IllegalArgumentException("Unknown: " + type);
		          };
		      }
		  }
		  
		  Shape s = ShapeFactory.create("circle");
		  s.draw(); // Circle
		  ```
	-
	- ## Builder
	  collapsed:: true
		- ```java
		  class Person {
		      private final String name;
		      private final int age;
		      private final String email;
		  
		      private Person(Builder b) {
		          this.name = b.name; this.age = b.age; this.email = b.email;
		      }
		  
		      static class Builder {
		          private String name;
		          private int age;
		          private String email;
		  
		          Builder name(String name)   { this.name = name;   return this; }
		          Builder age(int age)         { this.age = age;     return this; }
		          Builder email(String email) { this.email = email; return this; }
		          Person build()              { return new Person(this); }
		      }
		  }
		  
		  Person p = new Person.Builder()
		      .name("Alice").age(30).email("[email]").build();
		  ```
	-
	- ## Observer
	  collapsed:: true
		- ```java
		  interface Observer { void update(int value); }
		  
		  class Subject {
		      private List<Observer> observers = new ArrayList<>();
		      private int state;
		  
		      void attach(Observer o) { observers.add(o); }
		      void setState(int s) {
		          this.state = s;
		          observers.forEach(o -> o.update(state));
		      }
		  }
		  
		  Subject subject = new Subject();
		  subject.attach(val -> System.out.println("Observer 1: " + val));
		  subject.attach(val -> System.out.println("Observer 2: " + val));
		  subject.setState(42);
		  // Observer 1: 42
		  // Observer 2: 42
		  ```