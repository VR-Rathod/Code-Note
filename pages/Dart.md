---
seoTitle: Dart Programming Reference – Syntax Reference and Flutter Guide
description: "Comprehensive Dart language reference covering null safety, variables, async/await, streams, isolates, OOP, mixins, generics, pattern matching, Dart 3 features, and Flutter ecosystem."
keywords: "Dart programming, Dart language, Flutter, null safety, async await, streams, generics, mixins, cross-platform, mobile development, Dart syntax, cheat sheet, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Dart
---

- # History
	- **How**:
		- Developed by **Google**, Dart was introduced in 2011 as a modern, object-oriented programming language designed to address the limitations of JavaScript in building large-scale applications.
		- Dart was created as a general-purpose language with a focus on high performance, especially for building client-side applications, and can be compiled to **JavaScript** to run in browsers.
		- Dart has evolved over the years with major changes, transitioning from a focus on web development to becoming the primary language for building cross-platform mobile applications with the **Flutter** framework.
		- **Key Milestones**:
			- 2011: Dart was first announced by Google as a potential successor to JavaScript, aiming to provide better performance and more structured programming features.
			- 2017: The launch of **Flutter**, a UI toolkit by Google, marked Dart's significant growth in mobile app development.
			- 2020: Dart saw a rise in adoption due to the increasing popularity of **Flutter** for cross-platform mobile development, leading to more community contributions and language improvements.
			- 2023: Release of **Dart 3**, introducing 100% sound null safety, Records, Patterns, Class Modifiers, and Switch Expressions.
	-
	- **Who**:
		- Dart was created and is maintained by **Google** and its development team.
		- The language is used and supported by a growing community of developers, especially in mobile app development with Flutter.
	-
	- **Why**:
		- Dart was developed to overcome the performance limitations of JavaScript, aiming to provide a better experience for building complex web and mobile applications.
		- It was also designed to be easy to learn for developers familiar with object-oriented programming languages (e.g., Java, C# ), and to be compiled to highly optimized machine code or JavaScript for web development.
		- **Flutter's** success has significantly boosted Dart’s adoption, as it is the primary language for building cross-platform apps on iOS, Android, web, and desktop.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Optimized for Performance** — Dart is designed for high-performance applications. It can be compiled into **native code** (ARM/x64) for mobile/desktop, or to **JavaScript/Wasm** for web applications.
		- **Rich Asynchronous Programming** — Built-in support for **Futures**, **Streams**, and **async/await** for managing non-blocking IO.
		- **Flutter Integration** — Dart is the sole programming language for **Flutter**, allowing rapid development of modern, native-performing cross-platform user interfaces.
		- **Easy to Learn** — Clean C-style syntax familiar to C++, Java, JavaScript, and C# developers.
		- **Sound Null Safety** — 100% sound null safety ensures that variables cannot contain null values unless explicitly declared, eliminating runtime null-dereference errors.
		- **Hot Reload** — Fast developer iterations using JIT compilation in development, allowing developers to see UI changes instantly without losing app state.
		- **Rich Standard Library** — Extensive utilities for collections, conversion, math, asynchronous tasks, and filesystem operations.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Smaller Ecosystem** — While Dart is growing rapidly, its ecosystem is still smaller than JavaScript or Python for backend development and general-purpose tooling.
		- **Dependency on Flutter** — The language is strongly coupled with Flutter's popularity. Outside of the Flutter framework, general Dart adoption is relatively low.
		- **No Multi-Threading in Traditional Sense** — Dart code runs in a single thread of execution within an **Isolate**. Multithreading requires spawning separate Isolates which communicate via message passing, adding architectural complexity.
		- **Web Output Size** — Dart-to-JavaScript compilation can result in larger file sizes compared to hand-written or optimized JS.
	-
	- ## Remember Points
	  collapsed:: true
		- **Single Threaded** — Uses an event-loop execution model.
		- **Sound Null Safety** — Compile-time null-safety guarantees.
		- **Dual Compilation** — JIT (Just-In-Time) for fast development cycles and AOT (Ahead-Of-Time) for fast production runtimes.
-
- # Basics
	- ## Hello World & Entry Point
		- ```dart
		  void main() {
		    print('Hello, World!');
		  }
		  ```
		- `main()` is the required entry point function of every Dart program.
		- `void` indicates that the function returns no value.
		- `print()` writes text to the standard console output.
	-
	- ## Comments
		- ```dart
		  // This is a single-line comment.
		  
		  /*
		     This is a multi-line
		     comment block.
		  */
		  
		  /// This is a documentation comment (Doxygen/Dartdoc style).
		  /// Used for generating code documentation and IDE tooltips.
		  void documentedFunction() {}
		  ```
	-
	- ## Variables & Constants
		- ```dart
		  // Dynamically typed / type-inferred variables
		  var name = 'VR Rathod'; // Type inferred as String
		  dynamic flexible = 42; // Variable can hold any type at runtime
		  flexible = 'Now a string'; 
		  
		  // Explicitly typed variables
		  int age = 25;
		  double weight = 72.5;
		  bool isDeveloper = true;
		  String language = 'Dart';
		  
		  // final - Value must be set once and is read-only. Evaluated at runtime.
		  final DateTime now = DateTime.now();
		  
		  // const - Value is a compile-time constant. Implicitly final.
		  const double pi = 3.14159265;
		  const List<int> numbers = [1, 2, 3]; // Immutable list
		  ```
	-
	- ## Primitive Data Types Table
		- ```
		  Type      Size/Representation        Description
		  num       Varies                     Base class for numeric types (int, double)
		  int       64-bit signed integer      Integer values (on VM, platform-dependent on Web)
		  double    64-bit IEEE 754 float      Floating-point values
		  bool      boolean (true/false)       Boolean logic values
		  String    UTF-16 sequence            Text strings
		  Null      null                       The absence of value (under null safety)
		  ```
	-
	- ## Type Inference & Dynamic Typing
		- ```dart
		  // Object is the base class for all non-nullable types
		  Object something = 'Hello';
		  // something.substring(1); // Compile Error: Object doesn't have substring()
		  
		  // dynamic bypasses compile-time checks (unsafe)
		  dynamic loose = 'Hello';
		  print(loose.substring(1)); // Works at compile time, might fail at runtime
		  
		  // var infers type once
		  var x = 10;
		  // x = 'string'; // Compile Error: int cannot be assigned to String
		  ```
	-
	- ## User Input
		- ```dart
		  import 'dart:io';
		  
		  void main() {
		    stdout.write('Enter your name: ');
		    String? input = stdin.readLineSync(); // Reads line from terminal (can be null)
		    
		    if (input != null && input.isNotEmpty) {
		      print('Hello, $input!');
		    } else {
		      print('Hello, Stranger!');
		    }
		  }
		  ```
	-
	- ## Operators
	  collapsed:: true
		- ```dart
		  // Arithmetic
		  // + (add), - (sub), * (mul), / (div), ~/ (integer division), % (modulo)
		  int divResult = 5 ~/ 2; // 2 (returns int)
		  double exactDiv = 5 / 2; // 2.5 (returns double)
		  
		  // Relational & Equality
		  // ==, !=, >, <, >=, <=
		  
		  // Type Test Operators
		  // as (typecast), is (true if object has the type), is! (true if object does not have the type)
		  if (name is String) {
		    print('name is a String');
		  }
		  
		  // Assignment
		  // =, +=, -=, *=, /=, ~/=, %=, ??=
		  int? nullableScore;
		  nullableScore ??= 10; // Assigns 10 only if nullableScore is currently null
		  
		  // Logical
		  // && (AND), || (OR), ! (NOT)
		  
		  // Conditional / Ternary
		  // condition ? expr1 : expr2
		  String access = age >= 18 ? 'Allowed' : 'Denied';
		  
		  // Cascade Notation
		  // .. (allows sequential operations on same object)
		  var paint = Paint()
		    ..color = Colors.black
		    ..strokeCap = StrokeCap.round
		    ..strokeWidth = 5.0;
		  ```
	-
	- ## Type Casting
	  collapsed:: true
		- ```dart
		  // Upcasting (implicit)
		  num value = 10; // int is subtype of num
		  
		  // Downcasting (explicit using 'as')
		  int concreteInt = value as int; // Will throw TypeError at runtime if not int
		  
		  // Safe check before casting
		  if (value is int) {
		    int safeInt = value; // Type promotion handles casting automatically!
		  }
		  ```
	-
	- ## Sound Null Safety
	  collapsed:: true
		- ```dart
		  // Non-nullable type (default)
		  int nonNullScore = 100;
		  // nonNullScore = null; // Compile Error
		  
		  // Nullable type (appended with ?)
		  int? nullableScore;
		  nullableScore = null; // Allowed
		  
		  // Null-aware Operators:
		  // ?. (Null-aware member access)
		  print(nullableScore?.toString()); // Prints null instead of throwing exception
		  
		  // ?? (Null-coalescing fallback operator)
		  int finalScore = nullableScore ?? 0; // Uses 0 if nullableScore is null
		  
		  // ! (Null assertion operator / Bang operator)
		  int forcedScore = nullableScore!; // Forces value, throws NullThrownError if null
		  
		  // late keyword - lazily initialized non-nullable variable
		  late String description;
		  description = 'Lazy text'; // Initialized later, fails at runtime if read before write
		  ```
-
- # Control Flow
	- ## if / else if / else
	  collapsed:: true
		- ```dart
		  int score = 85;
		  if (score >= 90) {
		    print('Grade A');
		  } else if (score >= 80) {
		    print('Grade B');
		  } else {
		    print('Grade F');
		  }
		  ```
	-
	- ## Switch Statement & Switch Expression (Dart 3)
	  collapsed:: true
		- ```dart
		  // Traditional Switch
		  var command = 'OPEN';
		  switch (command) {
		    case 'CLOSED':
		      print('Closed');
		      break;
		    case 'OPEN':
		      print('Open');
		      break;
		    default:
		      print('Unknown');
		  }
		  
		  // Switch Expression (Dart 3) - Concise, returns value, exhaustive
		  var color = 'red';
		  var hexColor = switch (color) {
		    'red' => '#FF0000',
		    'blue' => '#0000FF',
		    'green' => '#00FF00',
		    _ => '#000000' // Default fallback
		  };
		  ```
	-
	- ## Loops
	  collapsed:: true
		- ```dart
		  // Standard For Loop
		  for (var i = 0; i < 5; i++) {
		    print(i);
		  }
		  
		  // For-In Loop (Iterating over iterables)
		  var list = [10, 20, 30];
		  for (var element in list) {
		    print(element);
		  }
		  
		  // ForEach lambda
		  list.forEach(print);
		  
		  // While Loop
		  int count = 0;
		  while (count < 3) {
		    print(count++);
		  }
		  
		  // Do-While Loop
		  int index = 0;
		  do {
		    print(index++);
		  } while (index < 3);
		  
		  // Collection-if & Collection-for (within list/map literals)
		  bool includePromo = true;
		  var cart = [
		    'Apple',
		    'Banana',
		    if (includePromo) 'Free Cookie',
		    for (int i = 1; i <= 3; i++) 'Item $i'
		  ];
		  ```
	-
	- ## break / continue / assert
	  collapsed:: true
		- ```dart
		  for (var i = 0; i < 10; i++) {
		    if (i == 3) continue; // Skip iteration
		    if (i == 7) break;    // Exit loop
		    print(i);
		  }
		  
		  // assert - checks conditions in debug mode, ignored in release
		  int value = 5;
		  assert(value < 10); // Throws AssertionError if false
		  ```
-
- # Functions
	- ## Declaration, Definition & Return
	  collapsed:: true
		- ```dart
		  // standard declaration
		  int add(int a, int b) {
		    return a + b;
		  }
		  
		  // Shorthand arrow syntax (for single expression functions)
		  int subtract(int a, int b) => a - b;
		  ```
	-
	- ## Function Parameters
	  collapsed:: true
		- ```dart
		  // 1. Required Positional Parameters
		  void setIdentity(String name, int age) {}
		  
		  // 2. Optional Positional Parameters (wrapped in [])
		  void logMsg(String msg, [String? level, int? code]) {
		    print('$level ($code): $msg');
		  }
		  // logMsg('Starting', 'INFO'); // Valid
		  
		  // 3. Named Parameters (wrapped in {}, implicitly optional unless marked 'required')
		  void createUser({required String username, String? email, int age = 18}) {
		    print('User: $username, Email: $email, Age: $age');
		  }
		  // createUser(username: 'vr_ Rathod', age: 26); // Valid
		  ```
	-
	- ## Anonymous Functions & Lambdas
	  collapsed:: true
		- ```dart
		  void main() {
		    var fruits = ['apple', 'banana', 'mango'];
		    
		    // Anonymous function block
		    fruits.forEach((item) {
		      print('Fruit: $item');
		    });
		    
		    // Arrow anonymous function
		    var mapped = fruits.map((item) => item.toUpperCase());
		  }
		  ```
	-
	- ## Closures & Lexical Scope
	  collapsed:: true
		- ```dart
		  // Closures capture variables from outer scopes
		  Function makeAdder(int addBy) {
		    return (int i) => addBy + i;
		  }
		  
		  void main() {
		    var add2 = makeAdder(2);
		    var add5 = makeAdder(5);
		    print(add2(3)); // 5
		    print(add5(3)); // 8
		  }
		  ```
	-
	- ## Typedefs
	  collapsed:: true
		- ```dart
		  // Defines a function signature type alias
		  typedef MathOperation = int Function(int a, int b);
		  
		  int executeOp(int x, int y, MathOperation op) {
		    return op(x, y);
		  }
		  ```
	-
	- ## Generator Functions (`sync*` & `async*`)
	  collapsed:: true
		- ```dart
		  // Synchronous Generator: Returns Iterable
		  Iterable<int> countTo(int max) sync* {
		    for (int i = 1; i <= max; i++) {
		      yield i; // Produces value lazily
		    }
		  }
		  
		  // Asynchronous Generator: Returns Stream
		  Stream<int> asyncCounter(int max) async* {
		    for (int i = 1; i <= max; i++) {
		      await Future.delayed(Duration(seconds: 1));
		      yield i; // Emits value asynchronously
		    }
		  }
		  ```
-
- # Memory & References
	- ## Variable References
		- In Dart, every variable contains a **reference** to an object in memory, not the object data itself.
		- Assigning one variable to another copies the reference, pointing both variables to the same underlying object instance.
		- ```dart
		  var listA = [1, 2, 3];
		  var listB = listA; // Copies reference
		  listB.add(4);
		  print(listA); // [1, 2, 3, 4] — listA is mutated
		  ```
	-
	- ## Garbage Collection (GC)
		- Dart utilizes an advanced automatic garbage collector:
			- **Generational GC**: Optimized for short-lived objects (typical in UI rendering like Flutter's widget build tree).
			- **Young Generation (Scavenger)**: Cleans up temporary objects quickly.
			- **Old Generation (Mark-Sweep)**: Manages long-lived objects.
	-
	- ## Weak References & Finalizers
		- ```dart
		  // WeakReference prevents GC from keeping referenced object alive
		  var heavyObject = HeavyResource();
		  var weakRef = WeakReference(heavyObject);
		  
		  // Retrieve value
		  var target = weakRef.target; // Returns null if object was GC'd
		  
		  // Finalizer - triggers callback when object is garbage-collected
		  final Finalizer<String> resourceCleanup = Finalizer((token) {
		    print('Cleaning native memory associated with token: $token');
		  });
		  
		  resourceCleanup.attach(heavyObject, 'native_token_123');
		  ```
-
- # Arrays, Strings & Collections
	- ## Strings
	  collapsed:: true
		- ```dart
		  // Single or double quotes
		  String s1 = 'Hello';
		  String s2 = "World";
		  
		  // String Interpolation
		  int count = 5;
		  String total = 'The total count is $count'; // evaluates variable
		  String upper = 'Uppercase: ${s1.toUpperCase()}'; // evaluates expression
		  
		  // Multi-line Strings
		  String multi = '''
		    Line 1
		    Line 2
		  ''';
		  
		  // Raw String (ignores escape characters)
		  String raw = r'C:\Users\Name\Documents';
		  
		  // Common methods
		  print(s1.substring(1, 3)); // 'el'
		  print(s1.contains('ell')); // true
		  print(s1.split('e')); // ['H', 'llo']
		  ```
	-
	- ## Lists (Dynamic Arrays)
	  collapsed:: true
		- ```dart
		  // Literal List definition
		  List<int> numbers = [10, 20, 30];
		  
		  numbers.add(40);
		  numbers.addAll([50, 60]);
		  numbers.removeAt(0); // Removes 10
		  
		  print(numbers[0]); // 20
		  print(numbers.length); // 5
		  
		  // Spread operator (...) and Null-aware spread (...?)
		  var moreNumbers = [0, ...numbers]; // [0, 20, 30, 40, 50, 60]
		  List<int>? dynamicNullList;
		  var safeCombined = [0, ...?dynamicNullList]; // [0] (no exception thrown)
		  
		  // Iterating lists
		  var squares = [for (var n in numbers) n * n];
		  ```
	-
	- ## Sets (Unique Collections)
	  collapsed:: true
		- ```dart
		  // Set literal
		  Set<String> uniqueColors = {'red', 'blue', 'green'};
		  uniqueColors.add('red'); // Ignored, value already exists
		  
		  // Set operations
		  var primary = {'red', 'blue', 'yellow'};
		  var secondary = {'green', 'orange', 'purple'};
		  
		  print(primary.intersection(secondary)); // {}
		  print(primary.union(secondary)); // {red, blue, yellow, green, orange, purple}
		  print(primary.difference({'red'})); // {blue, yellow}
		  ```
	-
	- ## Maps (Key-Value Pairs)
	  collapsed:: true
		- ```dart
		  // Map Literal
		  Map<String, int> scores = {
		    'Alice': 95,
		    'Bob': 87,
		  };
		  
		  scores['Charlie'] = 92; // Adding entry
		  print(scores['Alice']); // 95
		  print(scores['Unregistered']); // null (returns null if key not present)
		  
		  // Useful map properties & methods
		  print(scores.keys); // (Alice, Bob, Charlie)
		  print(scores.containsKey('Bob')); // true
		  scores.putIfAbsent('Bob', () => 100); // Does not overwrite 87
		  ```
-
- # OOP — Object-Oriented Programming
	- ## Classes & Objects
	  collapsed:: true
		- ```dart
		  class Point {
		    double x; // Instance variable
		    double y;
		    
		    // Generative constructor with syntactic sugar for initialization
		    Point(this.x, this.y);
		    
		    // Method
		    double distanceToOrigin() {
		      return x * x + y * y;
		    }
		  }
		  
		  void main() {
		    Point p = Point(3.0, 4.0); // Instantiate object (new keyword is optional)
		    print(p.distanceToOrigin()); // 25.0
		  }
		  ```
	-
	- ## Constructors Deep Dive
	  collapsed:: true
		- ```dart
		  class Car {
		    String make;
		    String model;
		    int year;
		    
		    // 1. Standard constructor
		    Car(this.make, this.model, this.year);
		    
		    // 2. Named constructor
		    Car.classic(this.make, this.model) : year = 1970; // initializer list
		    
		    // 3. Redirecting Constructor
		    Car.ford(String model, int year) : this('Ford', model, year);
		    
		    // 4. Constant Constructor (constructs immutable compile-time constants)
		    // All instance fields must be final
		  }
		  
		  class ImmutablePoint {
		    final double x;
		    final double y;
		    const ImmutablePoint(this.x, this.y); // Const constructor
		  }
		  
		  // 5. Factory Constructor
		  // Used when constructor doesn't always create new instance of the class
		  class Logger {
		    final String name;
		    static final Map<String, Logger> _cache = {};
		    
		    factory Logger(String name) {
		      return _cache.putIfAbsent(name, () => Logger._internal(name));
		    }
		    
		    Logger._internal(this.name); // Private named constructor
		  }
		  ```
	-
	- ## Access Modifiers & Encapsulation
	  collapsed:: true
		- Dart does not have `public`, `private`, or `protected` keywords.
		- Access modifiers are defined at the **library** level:
			- Identifier without leading underscore: **Public**.
			- Identifier prefixed with leading underscore `_`: **Library-private** (accessible only within the file where declared).
		- ```dart
		  class BankAccount {
		    double _balance = 0.0; // Private field
		    
		    // Public Getter
		    double get balance => _balance;
		    
		    // Public Setter
		    set deposit(double amount) {
		      if (amount > 0) _balance += amount;
		    }
		  }
		  ```
	-
	- ## Static Variables & Methods
	  collapsed:: true
		- ```dart
		  class Circle {
		    static const double pi = 3.14159; // Class variable
		    double radius;
		    
		    Circle(this.radius);
		    
		    static double calculateArea(double r) => pi * r * r; // Class method
		  }
		  ```
	-
	- ## Operator Overloading
	  collapsed:: true
		- ```dart
		  class Vector {
		    final int x, y;
		    Vector(this.x, this.y);
		    
		    // Overload the + operator
		    Vector operator +(Vector other) {
		      return Vector(x + other.x, y + other.y);
		    }
		    
		    // Overload the == operator
		    @override
		    bool operator ==(Object other) =>
		      identical(this, other) ||
		      other is Vector && runtimeType == other.runtimeType && x == other.x && y == other.y;
		      
		    @override
		    int get hashCode => x.hashCode ^ y.hashCode;
		  }
		  ```
-
- # OOP — Inheritance & Interfaces
	- ## Single Inheritance
	  collapsed:: true
		- ```dart
		  class Vehicle {
		    String brand;
		    Vehicle(this.brand);
		    
		    void honk() => print('Beep!');
		  }
		  
		  class Truck extends Vehicle {
		    double loadCapacity;
		    
		    // Constructor chaining
		    Truck(String brand, this.loadCapacity) : super(brand);
		    
		    @override
		    void honk() {
		      super.honk(); // Call parent implementation
		      print('Bwahhh!'); // Custom override
		    }
		  }
		  ```
	-
	- ## Interfaces & Implicit Interfaces
	  collapsed:: true
		- Every Dart class implicitly defines an **interface** containing all instance members.
		- There is no `interface` keyword (pre-Dart 3). Instead, you use `implements` to implement any class's interface.
		- If you implement a class, you must provide concrete implementations for every method of the interface.
		- ```dart
		  class Instrument {
		    void play() {}
		  }
		  
		  class Guitar implements Instrument {
		    @override
		    void play() => print('Strumming strings');
		  }
		  ```
	-
	- ## Mixins
	  collapsed:: true
		- Mixins provide a way to reuse class code in multiple class hierarchies.
		- ```dart
		  mixin Swimmer {
		    void swim() => print('Swimming in water');
		  }
		  
		  mixin Walker {
		    void walk() => print('Walking on ground');
		  }
		  
		  class Duck extends Vehicle with Swimmer, Walker {
		    Duck() : super('Donald');
		  }
		  
		  // Constraining a mixin to specific superclass types using 'on'
		  mixin Flight on Vehicle {
		    void fly() => print('Flying vehicle!');
		  }
		  ```
-
- # OOP — Polymorphism
	- ## Runtime Polymorphism
	  collapsed:: true
		- Polymorphism is implemented through method overriding and dynamic dispatch.
		- ```dart
		  abstract class Shape {
		    double get area; // Abstract getter
		  }
		  
		  class Circle extends Shape {
		    double radius;
		    Circle(this.radius);
		    
		    @override
		    double get area => 3.14159 * radius * radius;
		  }
		  
		  class Square extends Shape {
		    double side;
		    Square(this.side);
		    
		    @override
		    double get area => side * side;
		  }
		  
		  void printArea(Shape s) {
		    print('Area: ${s.area}'); // Resolves subclass area getter at runtime
		  }
		  ```
-
- # OOP — Advanced Concepts & Class Modifiers (Dart 3)
	- ## Class Modifiers
	  collapsed:: true
		- Dart 3 introduced modifiers to restrict class instantiation, extension, and implementation properties:
			- `mixin class`: Declares a class that can also be used as a mixin.
			- `base`: Requires any subclass to extend or implement with the `base` modifier (preserves class hierarchy properties).
			- `interface`: Allows external code to implement the class but prevents extending it.
			- `final`: Prevents both extending and implementing the class from outside its declaring library.
			- `sealed`: Declares an abstract class with a closed set of subtypes declared in the same file. Exhaustive for switch cases.
		- ```dart
		  // sealed class
		  sealed class Result {}
		  class Success extends Result { final String data; Success(this.data); }
		  class Failure extends Result { final Exception err; Failure(this.err); }
		  
		  // Compiles only if all subtypes are handled (compiler ensures exhaustiveness)
		  String handle(Result res) => switch(res) {
		    Success s => 'Got: ${s.data}',
		    Failure f => 'Error: ${f.err}',
		  };
		  ```
	-
	- ## Extension Methods
	  collapsed:: true
		- ```dart
		  // Add functionality to existing classes without subclassing
		  extension StringParsing on String {
		    int toInt() => int.parse(this);
		  }
		  
		  void main() {
		    int num = '123'.toInt(); // Extends String class
		  }
		  ```
	-
	- ## Extension Types (Dart 3.3)
	  collapsed:: true
		- ```dart
		  // Zero-cost wrapping over an underlying type. No runtime allocation.
		  extension type Id(int value) {
		    bool get isValid => value > 0;
		  }
		  
		  void main() {
		    Id userId = Id(42);
		    print(userId.isValid); // true
		    // int raw = userId; // Compile Error: Id is type-safe distinct from int
		  }
		  ```
	-
	- ## Callable Classes
	  collapsed:: true
		- ```dart
		  // Implementing the call() method makes the object behaves like a function
		  class Greeter {
		    String greeting;
		    Greeter(this.greeting);
		    
		    void call(String name) => print('$greeting, $name!');
		  }
		  
		  void main() {
		    var sayHello = Greeter('Hello');
		    sayHello('VR'); // Invokes the call() method
		  }
		  ```
-
- # Generics
	- ## Generic Classes & Methods
	  collapsed:: true
		- ```dart
		  // Generic Class
		  class Box<T> {
		    T value;
		    Box(this.value);
		    
		    T getValue() => value;
		  }
		  
		  // Generic Method
		  T findFirst<T>(List<T> items) {
		    return items[0];
		  }
		  ```
	-
	- ## Generic Constraints
	  collapsed:: true
		- ```dart
		  // Restrict generic type parameter to a subclass of a specific type
		  class MathBox<T extends num> {
		    T val;
		    MathBox(this.val);
		    
		    double square() => val.toDouble() * val.toDouble();
		  }
		  ```
-
- # Exception Handling
	- ## Throwing & Catching Exceptions
	  collapsed:: true
		- ```dart
		  void checkAge(int age) {
		    if (age < 0) {
		      // You can throw any non-null object in Dart
		      throw ArgumentError('Age cannot be negative');
		    }
		  }
		  
		  void main() {
		    try {
		      checkAge(-5);
		    } on ArgumentError catch (e) {
		      print('Specific error handled: $e');
		    } on Exception catch (e) {
		      print('General exception handled: $e');
		    } catch (e, stackTrace) {
		      // Fallback block captures everything else
		      print('Unknown error: $e');
		      print('Stacktrace: $stackTrace');
		      rethrow; // Propagate exception up call stack
		    } finally {
		      print('Clean up operations here.');
		    }
		  }
		  ```
	-
	- ## Custom Exceptions
	  collapsed:: true
		- ```dart
		  class OutOfGasException implements Exception {
		    final String message;
		    OutOfGasException(this.message);
		    
		    @override
		    String toString() => 'OutOfGasException: $message';
		  }
		  ```
-
- # Concurrency & Asynchronous Programming
	- ## The Event Loop
		- Dart runs in a single-threaded loop (event loop), executing tasks from two FIFO queues:
			- **Microtask Queue**: High priority tasks (runs before event queue).
			- **Event Queue**: External events, IO, timers, Futures.
	-
	- ## Futures
	  collapsed:: true
		- ```dart
		  // returns a future that resolves to String
		  Future<String> fetchUserData() {
		    return Future.delayed(Duration(seconds: 2), () => 'Alice');
		  }
		  
		  // Handling Future using async/await
		  Future<void> main() async {
		    print('Fetching user...');
		    String name = await fetchUserData(); // Suspends execution until future completes
		    print('User name: $name');
		  }
		  
		  // Alternative chaining approach using .then()
		  void loadUser() {
		    fetchUserData().then((name) {
		      print('Loaded: $name');
		    }).catchError((err) {
		      print('Error: $err');
		    });
		  }
		  ```
	-
	- ## Streams (Data Pipes)
	  collapsed:: true
		- ```dart
		  // A Stream is a sequence of asynchronous events.
		  // 1. Single-Subscription stream - can only be listened to once
		  // 2. Broadcast stream - can be listened to multiple times simultaneously
		  
		  import 'dart:async';
		  
		  void main() async {
		    // Stream Controller usage
		    final controller = StreamController<String>.broadcast();
		    
		    // Listen to stream
		    final subscription = controller.stream.listen(
		      (data) => print('Received: $data'),
		      onError: (err) => print('Error: $err'),
		      onDone: () => print('Stream Closed'),
		    );
		    
		    // Add items to stream
		    controller.sink.add('Event 1');
		    controller.sink.add('Event 2');
		    
		    await controller.close();
		  }
		  ```
	-
	- ## Isolates (Concurreny via Actor Model)
	  collapsed:: true
		- Dart utilizes Isolates rather than threads. Isolates have their own isolated heap memory and event loops, preventing race conditions and shared mutable memory. Communication occurs via message passing.
		- ```dart
		  import 'dart:isolate';
		  
		  // Entry point for spawned isolate (must be global or static function)
		  void isolateTask(SendPort sendPort) {
		    int total = 0;
		    for (int i = 0; i < 1000000000; i++) total += i; // Heavy compute
		    sendPort.send(total); // Send result back
		  }
		  
		  void main() async {
		    final receivePort = ReceivePort();
		    
		    // Spawn new isolate
		    await Isolate.spawn(isolateTask, receivePort.sendPort);
		    
		    // Wait for message response
		    final result = await receivePort.first;
		    print('Computed value from Isolate: $result');
		  }
		  ```
-
- # File I/O
	- ## Reading & Writing Files
	  collapsed:: true
		- ```dart
		  import 'dart:io';
		  
		  void main() async {
		    final file = File('data.txt');
		    
		    // Asynchronous writing
		    await file.writeAsString('Hello, Dart File I/O!\n');
		    
		    // Appending
		    await file.writeAsString('Appended line\n', mode: FileMode.append);
		    
		    // Asynchronous reading
		    if (await file.exists()) {
		      String contents = await file.readAsString();
		      print('File content:\n$contents');
		    }
		    
		    // Binary raw I/O
		    List<int> bytes = await file.readAsBytes();
		  }
		  ```
-
- # Libraries & Namespaces
	- ## Library Directives
	  collapsed:: true
		- ```dart
		  // Importing library
		  import 'dart:math'; // Standard library
		  import 'package:http/http.dart' as http; // Package prefix namespace
		  import 'my_helper.dart' show checkStatus; // Only import checkStatus
		  import 'my_helper.dart' hide performCalculation; // Import everything except
		  
		  // Deferred loading (lazy loading of code units)
		  import 'lazy_module.dart' deferred as lazy;
		  
		  Future<void> load() async {
		    await lazy.loadLibrary(); // Loads on-demand
		    lazy.runWork();
		  }
		  
		  // Exporting libraries
		  // my_package.dart exports multiple library fragments
		  export 'src/models.dart';
		  export 'src/controllers.dart';
		  ```
-
- # Preprocessor & Compilation
	- ## Compilation Pipeline
		- **JIT (Just-In-Time)**: Transpiles code to VM bytecode or machine code during execution. Used by Flutter Hot Reload.
		- **AOT (Ahead-Of-Time)**: Compiles directly into native machine architecture instructions for fast startups and high performance in production.
	-
	- ## CLI Commands
		- ```bash
		  # Run a Dart script
		  dart run bin/main.dart
		  
		  # Compile to native self-contained executable file
		  dart compile exe bin/main.dart -o build/main.exe
		  
		  # Compile to JavaScript web target
		  dart compile js bin/main.dart -o build/main.js
		  ```
	-
	- ## Metadata Annotations
		- ```dart
		  @override // Marks a subclass method overriding a superclass method
		  @deprecated // Marks method/variable as deprecated
		  @pragma('vm:prefer-inline') // Gives custom instructions to the compiler
		  ```
-
- # Advanced Topics
	- ## Native Interoperability (FFI)
	  collapsed:: true
		- Dart FFI (`dart:ffi`) allows calling native C/C++ libraries.
		- ```dart
		  import 'dart:ffi' as ffi;
		  import 'package:ffi/ffi.dart';
		  
		  // Load native dynamic library (DLL / .so / .dylib)
		  final ffi.DynamicLibrary nativeLib = ffi.DynamicLibrary.open('math_lib.dll');
		  
		  // Look up function signature
		  typedef NativeAdd = ffi.Int32 Function(ffi.Int32, ffi.Int32);
		  typedef DartAdd = int Function(int, int);
		  
		  final DartAdd nativeAdd = nativeLib
		    .lookupFunction<NativeAdd, DartAdd>('add_numbers');
		  ```
	-
	- ## JS Interop (Web Targets)
	  collapsed:: true
		- ```dart
		  import 'dart:js_interop';
		  
		  @JS('window.alert')
		  external void browserAlert(JSString message);
		  ```
-
- # Bit Manipulation
	- ## Bitwise Operators
	  collapsed:: true
		- ```dart
		  void main() {
		    int a = 12; // Binary: 00001100
		    int b = 25; // Binary: 00011001
		    
		    print(a & b);   // AND: 8 (00001000)
		    print(a | b);   // OR: 29 (00011101)
		    print(a ^ b);   // XOR: 21 (00010101)
		    print(~a);      // NOT: -13 (two's complement)
		    print(a << 2);  // Left Shift: 48
		    print(a >> 2);  // Right Shift (Sign-extending): 3
		    print(a >>> 2); // Unsigned Right Shift: 3
		  }
		  ```
-
- # Build Tools & Project Configuration
	- ## pubspec.yaml Structure
	  collapsed:: true
		- ```yaml
		  name: code_note_dart
		  description: A Dart project containing reference code notes.
		  version: 1.0.0
		  publish_to: 'none'
		  
		  environment:
		    sdk: '>=3.0.0 <4.0.0' # Targets Dart 3.x SDK
		    
		  dependencies:
		    http: ^1.1.0
		    path: ^1.8.3
		    
		  dev_dependencies:
		    lints: ^2.1.0
		    test: ^1.24.0
		  ```
-
- # Miscellaneous
	- ## Enums & Enhanced Enums
	  collapsed:: true
		- ```dart
		  // Enhanced Enum (Dart 2.17+) allows fields, constructor, and methods
		  enum LogLevel {
		    info('INFO', 200),
		    warning('WARN', 400),
		    error('ERROR', 500);
		    
		    final String label;
		    final int code;
		    const LogLevel(this.label, this.code);
		    
		    void printLog() => print('$label (Code $code)');
		  }
		  ```
	-
	- ## Records (Dart 3)
	  collapsed:: true
		- ```dart
		  // Records are anonymous, immutable aggregate types
		  void main() {
		    // 1. Positional fields
		    var point = (1.5, 2.5);
		    print(point.$1); // 1.5
		    
		    // 2. Named fields
		    var user = (name: 'VR', age: 26);
		    print(user.name); // 'VR'
		  }
		  ```
	-
	- ## Pattern Matching & Destructuring (Dart 3)
	  collapsed:: true
		- ```dart
		  // Destructuring using patterns
		  void main() {
		    var pair = (1, 'two');
		    var (a, b) = pair; // Binds 1 to a, 'two' to b
		    
		    var list = [1, 2, 3];
		    if (list case [1, var y, 3]) {
		      print(y); // 2 (Pattern matched lists with y extracted)
		    }
		  }
		  ```
-
- # Useful Libraries & Frameworks
	- [[Flutter]] - The leading cross-platform UI framework using Dart for mobile, web, and desktop apps.
	-
	- [[Bloc & Cubit]] - State management libraries separating business logic from presentation layer.
	-
	- [[Riverpod]] - Compile-safe reactive state-management and dependency injection framework.
	-
	- [[Dio]] - A powerful HTTP client supporting interceptors, global configurations, and file downloads.
	-
	- [[Get_it]] - Fast service locator for dependency injection.
	-
	- [[RxDart]] - Adds Rx stream capabilities to standard streams.
	-
	- [[Shelf]] - Lightweight modular web server framework for backend Dart APIs.
-
- # More Learn
	- Explore valuable resources and tools to enhance your Dart skills:
		-
		- [Dart Language Tour](https://dart.dev/guides/language/language-tour)
		- [Effective Dart (Style & Practices)](https://dart.dev/guides/language/effective-dart)
		- [Dart API Reference](https://api.dart.dev/)
		- [Pub.dev Packages](https://pub.dev/)
		- [DartPad (Online Editor)](https://dartpad.dev/)
		- [Flutter Roadmap](https://github.com/olexale/flutter_roadmap)