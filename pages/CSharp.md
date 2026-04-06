---
seoTitle: C# Programming Reference – Modern .NET Syntax and Features
description: "Comprehensive C# reference covering .NET 8, LINQ, async/await, generics, delegates, records, pattern matching, and frameworks for web, desktop, and game development."
keywords: "csharp, C# programming, C# reference, LINQ, async await, generics, delegates, records, pattern matching, .NET 8, Unity, ASP.NET Core, C# syntax, object-oriented, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: C#
---

-
- # History
  collapsed:: true
	- **How**:
		- Developed by **Anders Hejlsberg** at **Microsoft** starting in 1999, released with .NET Framework 1.0 in 2002.
		- Originally called "Cool" (C-like Object Oriented Language), renamed to **C#** before release.
		- Evolved through major versions: C# 2.0 (generics), 3.0 (LINQ, lambdas), 5.0 (async/await), 6.0 (expression-bodied members), 7.0 (tuples, pattern matching), 8.0 (nullable refs), 9.0 (records), 10.0 (global usings), 11.0 (raw strings), 12.0 (primary constructors).
	-
	- **Who**:
		- **Anders Hejlsberg** — lead architect of C#, also creator of Turbo Pascal and Delphi.
		- **Microsoft** — develops and maintains C# and the .NET platform.
	-
	- **Why**:
		- To create a modern, type-safe, object-oriented language for the .NET platform.
		- To combine C++ power with Java-like safety and productivity.
		- To support cross-platform development via .NET Core / .NET 5+.
-
- # Introduction
  collapsed:: true
	- ## Advantages
	  collapsed:: true
		- **Managed Runtime** — Garbage collection, no manual memory management.
		- **Multi-Paradigm** — OOP, functional (LINQ, lambdas), async, generic programming.
		- **Cross-Platform** — .NET 5+ runs on Windows, Linux, macOS, iOS, Android.
		- **Rich Ecosystem** — NuGet packages, ASP.NET Core, Entity Framework, Unity.
		- **Modern Features** — Records, pattern matching, nullable reference types, source generators.
		- **Strong Tooling** — Visual Studio, VS Code, Rider — best-in-class IDE support.
		- **Interop** — P/Invoke for native C/C++ libraries, COM interop.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Performance** — Slower than C/C++ due to managed runtime (though .NET 8 is very fast).
		- **Memory Overhead** — GC pauses can affect real-time applications.
		- **Windows Bias** — Some APIs still Windows-only (WPF, WinForms).
		- **Verbosity** — More boilerplate than Python or Kotlin for simple tasks.
-
- # Basics
  collapsed:: true
	- ## Hello World & Entry Point
	  collapsed:: true
		- ```csharp
		  // Traditional (all versions)
		  using System;
		  
		  class Program {
		      static void Main(string[] args) {
		          Console.WriteLine("Hello, World!");
		      }
		  }
		  
		  // Top-level statements (C# 9+) — no class/Main needed
		  Console.WriteLine("Hello, World!");
		  ```
	-
	- ## Comments
	  collapsed:: true
		- ```csharp
		  // Single-line comment
		  
		  /* Multi-line
		     comment */
		  
		  /// <summary>
		  /// XML doc comment — used by IntelliSense and doc generators
		  /// </summary>
		  /// <param name="x">Parameter description</param>
		  /// <returns>Return value description</returns>
		  ```
	-
	- ## Variables & Data Types
	  collapsed:: true
		- ```csharp
		  // Value types
		  int    age    = 25;           // 32-bit integer
		  long   big    = 9_999_999L;   // 64-bit integer (underscores for readability)
		  float  price  = 9.99f;        // 32-bit float
		  double pi     = 3.14159265;   // 64-bit float
		  decimal money = 99.99m;       // 128-bit precise decimal (use for money)
		  char   grade  = 'A';          // 16-bit Unicode character
		  bool   active = true;         // true / false
		  
		  // Reference types
		  string name   = "Alice";      // immutable Unicode string
		  object obj    = 42;           // base type of everything
		  
		  // Type inference
		  var x = 42;           // int
		  var s = "hello";      // string
		  var list = new List<int>(); // List<int>
		  
		  // Constants
		  const double TAX = 0.18;
		  
		  // Nullable value types (C# 2+)
		  int? nullableInt = null;
		  double? nullableDouble = 3.14;
		  ```
	-
	- ## Primitive Data Types Table
	  collapsed:: true
		- ```
		  Type       Alias     Size       Range
		  bool       Boolean   1 bit      true / false
		  byte       Byte      1 byte     0 to 255
		  sbyte      SByte     1 byte     -128 to 127
		  char       Char      2 bytes    U+0000 to U+FFFF
		  short      Int16     2 bytes    -32,768 to 32,767
		  ushort     UInt16    2 bytes    0 to 65,535
		  int        Int32     4 bytes    -2.1B to 2.1B
		  uint       UInt32    4 bytes    0 to 4.3B
		  long       Int64     8 bytes    -9.2E18 to 9.2E18
		  ulong      UInt64    8 bytes    0 to 18.4E18
		  float      Single    4 bytes    ±1.5E-45 to ±3.4E38
		  double     Double    8 bytes    ±5.0E-324 to ±1.7E308
		  decimal    Decimal   16 bytes   ±1.0E-28 to ±7.9E28
		  ```
	-
	- ## User Input / Output
	  collapsed:: true
		- ```csharp
		  // Output
		  Console.WriteLine("Hello");          // with newline
		  Console.Write("No newline");         // without newline
		  Console.WriteLine($"Name: {name}");  // string interpolation
		  Console.WriteLine("Pi: {0:F2}", 3.14159); // format string → Pi: 3.14
		  
		  // Input
		  Console.Write("Enter your name: ");
		  string input = Console.ReadLine()!;  // ! = non-null assertion
		  
		  // Parse input
		  Console.Write("Enter a number: ");
		  if (int.TryParse(Console.ReadLine(), out int num)) {
		      Console.WriteLine($"You entered: {num}");
		  } else {
		      Console.WriteLine("Invalid number");
		  }
		  ```
	-
	- ## Operators
	  collapsed:: true
		- ```csharp
		  // Arithmetic
		  int a = 10, b = 3;
		  Console.WriteLine(a + b);   // 13
		  Console.WriteLine(a - b);   // 7
		  Console.WriteLine(a * b);   // 30
		  Console.WriteLine(a / b);   // 3 (integer division)
		  Console.WriteLine(a % b);   // 1 (modulo)
		  Console.WriteLine(a++);     // 10 (post-increment)
		  Console.WriteLine(++a);     // 12 (pre-increment)
		  
		  // Relational
		  a == b;  a != b;  a < b;  a > b;  a <= b;  a >= b;
		  
		  // Logical
		  true && false;  // false
		  true || false;  // true
		  !true;          // false
		  
		  // Bitwise
		  a & b;   a | b;   a ^ b;   ~a;   a << 1;   a >> 1;
		  
		  // Assignment
		  a += b;  a -= b;  a *= b;  a /= b;  a %= b;
		  a &= b;  a |= b;  a ^= b;  a <<= 1;  a >>= 1;
		  
		  // Null-coalescing (C# 2+)
		  string? s = null;
		  string result = s ?? "default";       // "default"
		  s ??= "assigned";                     // assign if null
		  
		  // Null-conditional (C# 6+)
		  string? name = null;
		  int? len = name?.Length;              // null (no NullReferenceException)
		  int len2 = name?.Length ?? 0;         // 0
		  
		  // Ternary
		  string label = (age >= 18) ? "Adult" : "Minor";
		  ```
	-
	- ## Type Casting
	  collapsed:: true
		- ```csharp
		  // Implicit (safe, no data loss)
		  int i = 42;
		  double d = i;   // int → double
		  
		  // Explicit cast (may lose data)
		  double pi = 3.14;
		  int truncated = (int)pi;  // 3
		  
		  // Convert class (handles strings too)
		  string s = "42";
		  int n = Convert.ToInt32(s);
		  double x = Convert.ToDouble("3.14");
		  
		  // Parse / TryParse
		  int parsed = int.Parse("99");
		  bool ok = int.TryParse("abc", out int val); // ok = false, val = 0
		  
		  // as / is operators
		  object obj = "hello";
		  string? str = obj as string;  // null if cast fails (no exception)
		  if (obj is string s2) {
		      Console.WriteLine(s2.ToUpper()); // pattern matching cast
		  }
		  ```
-
- # Strings
  collapsed:: true
	- ## String Basics
	  collapsed:: true
		- ```csharp
		  string s = "Hello, World!";
		  
		  Console.WriteLine(s.Length);          // 13
		  Console.WriteLine(s[0]);              // H
		  Console.WriteLine(s.ToUpper());       // HELLO, WORLD!
		  Console.WriteLine(s.ToLower());       // hello, world!
		  Console.WriteLine(s.Trim());          // removes whitespace
		  Console.WriteLine(s.TrimStart());     // removes leading whitespace
		  Console.WriteLine(s.TrimEnd());       // removes trailing whitespace
		  Console.WriteLine(s.Replace("World", "C#")); // Hello, C#!
		  Console.WriteLine(s.Contains("World"));      // True
		  Console.WriteLine(s.StartsWith("Hello"));    // True
		  Console.WriteLine(s.EndsWith("!"));          // True
		  Console.WriteLine(s.IndexOf("World"));       // 7
		  Console.WriteLine(s.Substring(7, 5));        // World
		  Console.WriteLine(s.Split(", ")[0]);         // Hello
		  Console.WriteLine(string.IsNullOrEmpty(""));  // True
		  Console.WriteLine(string.IsNullOrWhiteSpace(" ")); // True
		  ```
	-
	- ## String Interpolation & Formatting
	  collapsed:: true
		- ```csharp
		  string name = "Alice";
		  int age = 30;
		  double score = 98.567;
		  
		  // Interpolation (C# 6+)
		  Console.WriteLine($"Name: {name}, Age: {age}");
		  Console.WriteLine($"Score: {score:F2}");    // 98.57 (2 decimal places)
		  Console.WriteLine($"Hex: {255:X}");         // FF
		  Console.WriteLine($"Padded: {age:D5}");     // 00030
		  Console.WriteLine($"Currency: {9.99:C}");   // $9.99
		  
		  // Verbatim string (raw path, no escape needed)
		  string path = @"C:\Users\Alice\Documents";
		  
		  // Raw string literals (C# 11+)
		  string json = """
		      {
		          "name": "Alice",
		          "age": 30
		      }
		      """;
		  ```
	-
	- ## StringBuilder — Efficient String Building
	  collapsed:: true
		- ```csharp
		  using System.Text;
		  
		  var sb = new StringBuilder();
		  sb.Append("Hello");
		  sb.Append(", ");
		  sb.AppendLine("World!");
		  sb.Insert(0, ">> ");
		  sb.Replace("World", "C#");
		  
		  Console.WriteLine(sb.ToString()); // >> Hello, C#!
		  Console.WriteLine(sb.Length);     // length
		  sb.Clear();                        // reset
		  
		  // Use StringBuilder when building strings in loops
		  // string + string in a loop = O(n²), StringBuilder = O(n)
		  ```
-
- # Control Flow
  collapsed:: true
	- ## if / else if / else
	  collapsed:: true
		- ```csharp
		  int score = 85;
		  
		  if (score >= 90) {
		      Console.WriteLine("A");
		  } else if (score >= 80) {
		      Console.WriteLine("B");
		  } else if (score >= 70) {
		      Console.WriteLine("C");
		  } else {
		      Console.WriteLine("F");
		  }
		  // Output: B
		  ```
	-
	- ## Switch Statement & Switch Expression
	  collapsed:: true
		- ```csharp
		  // Classic switch
		  int day = 3;
		  switch (day) {
		      case 1: Console.WriteLine("Monday");    break;
		      case 2: Console.WriteLine("Tuesday");   break;
		      case 3: Console.WriteLine("Wednesday"); break;
		      default: Console.WriteLine("Other");    break;
		  }
		  
		  // Switch expression (C# 8+) — concise, returns a value
		  string dayName = day switch {
		      1 => "Monday",
		      2 => "Tuesday",
		      3 => "Wednesday",
		      4 => "Thursday",
		      5 => "Friday",
		      _ => "Weekend"  // default
		  };
		  Console.WriteLine(dayName); // Wednesday
		  ```
	-
	- ## Loops
	  collapsed:: true
		- ```csharp
		  // for
		  for (int i = 0; i < 5; i++) {
		      Console.Write(i + " "); // 0 1 2 3 4
		  }
		  
		  // while
		  int n = 0;
		  while (n < 5) {
		      Console.Write(n++ + " ");
		  }
		  
		  // do-while (executes at least once)
		  int x = 0;
		  do {
		      Console.Write(x++ + " ");
		  } while (x < 3);
		  
		  // foreach (works on any IEnumerable)
		  int[] nums = {1, 2, 3, 4, 5};
		  foreach (int num in nums) {
		      Console.Write(num + " ");
		  }
		  
		  // break / continue
		  for (int i = 0; i < 10; i++) {
		      if (i == 3) continue; // skip 3
		      if (i == 7) break;    // stop at 7
		      Console.Write(i + " "); // 0 1 2 4 5 6
		  }
		  ```
	-
	- ## Pattern Matching (C# 7+)
	  collapsed:: true
		- ```csharp
		  object obj = 42;
		  
		  // is pattern
		  if (obj is int n) {
		      Console.WriteLine($"Integer: {n}");
		  }
		  
		  // switch with patterns (C# 8+)
		  static string Describe(object o) => o switch {
		      int i when i < 0    => "negative int",
		      int i               => $"positive int: {i}",
		      string s            => $"string: {s}",
		      null                => "null",
		      _                   => "unknown"
		  };
		  
		  Console.WriteLine(Describe(42));      // positive int: 42
		  Console.WriteLine(Describe("hello")); // string: hello
		  Console.WriteLine(Describe(null));    // null
		  
		  // Property pattern (C# 8+)
		  static string GetDiscount(Person p) => p switch {
		      { Age: < 18 }           => "Student discount",
		      { Age: >= 65 }          => "Senior discount",
		      { Name: "VIP" }         => "VIP discount",
		      _                       => "No discount"
		  };
		  ```
-
- # Functions & Methods
  collapsed:: true
	- ## Method Declaration
	  collapsed:: true
		- ```csharp
		  // Basic method
		  static int Add(int a, int b) {
		      return a + b;
		  }
		  
		  // Expression-bodied method (C# 6+)
		  static int Multiply(int a, int b) => a * b;
		  
		  // void method
		  static void Greet(string name) => Console.WriteLine($"Hello, {name}!");
		  
		  // Calling
		  Console.WriteLine(Add(3, 4));      // 7
		  Console.WriteLine(Multiply(3, 4)); // 12
		  Greet("Alice");                    // Hello, Alice!
		  ```
	-
	- ## Parameters
	  collapsed:: true
		- ```csharp
		  // Default parameters
		  static void Greet(string name, string msg = "Hello") {
		      Console.WriteLine($"{msg}, {name}!");
		  }
		  Greet("Alice");          // Hello, Alice!
		  Greet("Bob", "Hi");      // Hi, Bob!
		  
		  // Named arguments
		  Greet(msg: "Hey", name: "Charlie"); // Hey, Charlie!
		  
		  // ref — pass by reference (caller must initialize)
		  static void Double(ref int x) { x *= 2; }
		  int n = 5;
		  Double(ref n);
		  Console.WriteLine(n); // 10
		  
		  // out — output parameter (caller doesn't need to initialize)
		  static bool TryDivide(int a, int b, out double result) {
		      if (b == 0) { result = 0; return false; }
		      result = (double)a / b;
		      return true;
		  }
		  if (TryDivide(10, 3, out double r)) Console.WriteLine(r); // 3.333...
		  
		  // in — read-only reference (C# 7.2+)
		  static void Print(in int x) { Console.WriteLine(x); }
		  
		  // params — variable number of arguments
		  static int Sum(params int[] nums) => nums.Sum();
		  Console.WriteLine(Sum(1, 2, 3, 4, 5)); // 15
		  ```
	-
	- ## Local Functions (C# 7+)
	  collapsed:: true
		- ```csharp
		  static int Factorial(int n) {
		      // Local function — only visible inside Factorial
		      int Calc(int x) => x <= 1 ? 1 : x * Calc(x - 1);
		      return Calc(n);
		  }
		  Console.WriteLine(Factorial(5)); // 120
		  ```
	-
	- ## Lambda Expressions
	  collapsed:: true
		- ```csharp
		  // Func<TInput, TOutput>
		  Func<int, int> square = x => x * x;
		  Console.WriteLine(square(5)); // 25
		  
		  // Action<T> — no return value
		  Action<string> print = s => Console.WriteLine(s);
		  print("Hello"); // Hello
		  
		  // Predicate<T> — returns bool
		  Predicate<int> isEven = n => n % 2 == 0;
		  Console.WriteLine(isEven(4)); // True
		  
		  // Multi-line lambda
		  Func<int, int, int> add = (a, b) => {
		      int result = a + b;
		      return result;
		  };
		  
		  // Used with LINQ
		  var nums = new[] {1, 2, 3, 4, 5};
		  var evens = nums.Where(n => n % 2 == 0).ToList(); // {2, 4}
		  ```
	-
	- ## Extension Methods
	  collapsed:: true
		- ```csharp
		  // Must be in a static class, first param has 'this'
		  public static class StringExtensions {
		      public static bool IsPalindrome(this string s) {
		          string rev = new string(s.Reverse().ToArray());
		          return s == rev;
		      }
		      
		      public static string Repeat(this string s, int times) =>
		          string.Concat(Enumerable.Repeat(s, times));
		  }
		  
		  // Usage — called as if it's a method on string
		  Console.WriteLine("racecar".IsPalindrome()); // True
		  Console.WriteLine("ha".Repeat(3));           // hahaha
		  ```
-
- # Collections & Data Structures
  collapsed:: true
	- ## Arrays
	  collapsed:: true
		- ```csharp
		  // 1D array
		  int[] nums = {1, 2, 3, 4, 5};
		  int[] zeros = new int[5];          // all zeros
		  
		  Console.WriteLine(nums[0]);        // 1
		  Console.WriteLine(nums.Length);    // 5
		  Array.Sort(nums);
		  Array.Reverse(nums);
		  
		  // 2D array
		  int[,] grid = new int[3, 3];
		  grid[0, 0] = 1;
		  Console.WriteLine(grid.GetLength(0)); // rows = 3
		  
		  // Jagged array (array of arrays)
		  int[][] jagged = new int[3][];
		  jagged[0] = new int[] {1, 2};
		  jagged[1] = new int[] {3, 4, 5};
		  ```
	-
	- ## List\<T\>
	  collapsed:: true
		- ```csharp
		  using System.Collections.Generic;
		  
		  var list = new List<int> {1, 2, 3};
		  
		  list.Add(4);
		  list.AddRange(new[] {5, 6});
		  list.Insert(0, 0);          // insert at index 0
		  list.Remove(3);             // remove first occurrence of 3
		  list.RemoveAt(0);           // remove at index
		  list.RemoveAll(x => x < 3); // remove all matching
		  
		  Console.WriteLine(list.Count);       // count
		  Console.WriteLine(list.Contains(4)); // True
		  Console.WriteLine(list.IndexOf(4));  // index
		  
		  list.Sort();
		  list.Reverse();
		  list.Clear();
		  
		  // Convert
		  int[] arr = list.ToArray();
		  List<string> strs = new List<string>(new[] {"a", "b"});
		  ```
	-
	- ## Dictionary\<TKey, TValue\>
	  collapsed:: true
		- ```csharp
		  var dict = new Dictionary<string, int> {
		      ["Alice"] = 95,
		      ["Bob"]   = 87
		  };
		  
		  dict["Charlie"] = 92;
		  dict.Add("Dave", 78);
		  
		  Console.WriteLine(dict["Alice"]);          // 95
		  Console.WriteLine(dict.ContainsKey("Bob")); // True
		  Console.WriteLine(dict.Count);             // 4
		  
		  dict.Remove("Dave");
		  
		  // Safe access
		  if (dict.TryGetValue("Alice", out int score)) {
		      Console.WriteLine(score); // 95
		  }
		  
		  // Iterate
		  foreach (var (key, val) in dict) {
		      Console.WriteLine($"{key}: {val}");
		  }
		  
		  // Keys and Values
		  foreach (string key in dict.Keys) { }
		  foreach (int val in dict.Values) { }
		  ```
	-
	- ## HashSet\<T\>
	  collapsed:: true
		- ```csharp
		  var set = new HashSet<int> {1, 2, 3, 4, 5};
		  set.Add(3);    // ignored — already exists
		  set.Remove(1);
		  
		  Console.WriteLine(set.Contains(3)); // True
		  Console.WriteLine(set.Count);       // 4
		  
		  // Set operations
		  var a = new HashSet<int> {1, 2, 3, 4};
		  var b = new HashSet<int> {3, 4, 5, 6};
		  
		  a.UnionWith(b);        // a = {1,2,3,4,5,6}
		  a.IntersectWith(b);    // a = {3,4}
		  a.ExceptWith(b);       // a = {1,2}
		  ```
	-
	- ## Queue\<T\> & Stack\<T\>
	  collapsed:: true
		- ```csharp
		  // Queue — FIFO
		  var queue = new Queue<string>();
		  queue.Enqueue("first");
		  queue.Enqueue("second");
		  queue.Enqueue("third");
		  
		  Console.WriteLine(queue.Peek());    // "first" (don't remove)
		  Console.WriteLine(queue.Dequeue()); // "first" (remove)
		  Console.WriteLine(queue.Count);     // 2
		  
		  // Stack — LIFO
		  var stack = new Stack<int>();
		  stack.Push(1);
		  stack.Push(2);
		  stack.Push(3);
		  
		  Console.WriteLine(stack.Peek()); // 3
		  Console.WriteLine(stack.Pop());  // 3
		  Console.WriteLine(stack.Count);  // 2
		  ```
-
- # OOP — Classes & Objects
	-
	- ## Classes & Objects
	  collapsed:: true
		- ```csharp
		  public class Car {
		      // Fields
		      private string _brand;
		      private int _year;
		      
		      // Properties (C# way of getters/setters)
		      public string Brand {
		          get => _brand;
		          set => _brand = value ?? throw new ArgumentNullException();
		      }
		      
		      // Auto-property (compiler generates backing field)
		      public int Year { get; set; }
		      public string Model { get; init; } // init-only (C# 9+)
		      
		      // Constructor
		      public Car(string brand, int year, string model) {
		          _brand = brand;
		          Year = year;
		          Model = model;
		      }
		      
		      // Method
		      public string Describe() => $"{Year} {_brand} {Model}";
		      
		      // Static method
		      public static Car Create(string brand) => new Car(brand, 2024, "Base");
		      
		      // Override ToString
		      public override string ToString() => Describe();
		  }
		  
		  // Usage
		  var car = new Car("Toyota", 2022, "Camry");
		  Console.WriteLine(car.Describe()); // 2022 Toyota Camry
		  Console.WriteLine(car);            // calls ToString()
		  
		  // Object initializer syntax
		  var car2 = new Car("Honda", 2023, "Civic") { Year = 2024 };
		  ```
	-
	- ## Constructors
	  collapsed:: true
		- ```csharp
		  public class Person {
		      public string Name { get; }
		      public int Age { get; }
		      
		      // Primary constructor (C# 12+)
		      // public Person(string name, int age) { Name = name; Age = age; }
		      
		      public Person(string name, int age) {
		          Name = name;
		          Age = age;
		      }
		      
		      // Constructor chaining with : this()
		      public Person(string name) : this(name, 0) { }
		      
		      // Static constructor — runs once before first use
		      static Person() {
		          Console.WriteLine("Person class initialized");
		      }
		  }
		  
		  var p1 = new Person("Alice", 30);
		  var p2 = new Person("Bob"); // Age = 0
		  ```
	-
	- ## Records (C# 9+) — Immutable Data Classes
	  collapsed:: true
		- ```csharp
		  // Record — immutable by default, value equality, auto ToString
		  public record Point(double X, double Y);
		  
		  var p1 = new Point(1.0, 2.0);
		  var p2 = new Point(1.0, 2.0);
		  
		  Console.WriteLine(p1 == p2);    // True (value equality!)
		  Console.WriteLine(p1);          // Point { X = 1, Y = 2 }
		  
		  // Non-destructive mutation with 'with'
		  var p3 = p1 with { X = 5.0 };
		  Console.WriteLine(p3);          // Point { X = 5, Y = 2 }
		  
		  // Record struct (C# 10+) — value type record
		  public record struct Color(byte R, byte G, byte B);
		  
		  // Mutable record
		  public record class MutablePoint {
		      public double X { get; set; }
		      public double Y { get; set; }
		  }
		  ```
	-
	- ## Static Classes & Members
	  collapsed:: true
		- ```csharp
		  public static class MathHelper {
		      public static double PI = 3.14159265;
		      
		      public static double CircleArea(double r) => PI * r * r;
		      public static double Clamp(double val, double min, double max) =>
		          Math.Max(min, Math.Min(max, val));
		  }
		  
		  Console.WriteLine(MathHelper.CircleArea(5)); // 78.539...
		  Console.WriteLine(MathHelper.Clamp(15, 0, 10)); // 10
		  ```
-
- # OOP — Inheritance & Polymorphism
	- [[DSA Algo & System Design]] - visit this page for in-depth Learning
	-
	- ## Inheritance
	  collapsed:: true
		- ```csharp
		  public class Animal {
		      public string Name { get; }
		      
		      public Animal(string name) { Name = name; }
		      
		      public virtual void Speak() =>
		          Console.WriteLine($"{Name} makes a sound");
		      
		      public void Eat() => Console.WriteLine($"{Name} is eating");
		  }
		  
		  public class Dog : Animal {
		      public string Breed { get; }
		      
		      public Dog(string name, string breed) : base(name) {
		          Breed = breed;
		      }
		      
		      public override void Speak() =>
		          Console.WriteLine($"{Name} says Woof!");
		      
		      public void Fetch() => Console.WriteLine($"{Name} fetches the ball");
		  }
		  
		  Dog d = new Dog("Rex", "Labrador");
		  d.Speak();  // Rex says Woof!
		  d.Eat();    // Rex is eating
		  d.Fetch();  // Rex fetches the ball
		  
		  // Polymorphism via base reference
		  Animal a = new Dog("Buddy", "Poodle");
		  a.Speak(); // Buddy says Woof! (runtime dispatch)
		  ```
	-
	- ## Abstract Classes & Interfaces
	  collapsed:: true
		- ```csharp
		  // Abstract class — cannot be instantiated, can have implementation
		  public abstract class Shape {
		      public string Color { get; set; } = "Black";
		      
		      public abstract double Area();     // must override
		      public abstract double Perimeter(); // must override
		      
		      public void Describe() =>
		          Console.WriteLine($"{Color} shape, area={Area():F2}");
		  }
		  
		  // Interface — pure contract, no implementation (until C# 8 default methods)
		  public interface IDrawable {
		      void Draw();
		      void Resize(double factor); // all abstract by default
		  }
		  
		  public interface ISerializable {
		      string Serialize();
		  }
		  
		  // Class implementing abstract + multiple interfaces
		  public class Circle : Shape, IDrawable, ISerializable {
		      public double Radius { get; }
		      
		      public Circle(double r) { Radius = r; }
		      
		      public override double Area() => Math.PI * Radius * Radius;
		      public override double Perimeter() => 2 * Math.PI * Radius;
		      public void Draw() => Console.WriteLine($"Drawing circle r={Radius}");
		      public void Resize(double f) { /* ... */ }
		      public string Serialize() => $"{{\"radius\":{Radius}}}";
		  }
		  
		  Circle c = new Circle(5);
		  c.Describe();    // Black shape, area=78.54
		  c.Draw();        // Drawing circle r=5
		  Console.WriteLine(c.Serialize()); // {"radius":5}
		  ```
	-
	- ## sealed, abstract, override, new
	  collapsed:: true
		- ```csharp
		  public class Base {
		      public virtual void Foo() => Console.WriteLine("Base.Foo");
		      public virtual void Bar() => Console.WriteLine("Base.Bar");
		  }
		  
		  public class Derived : Base {
		      public override void Foo() => Console.WriteLine("Derived.Foo"); // override
		      public sealed override void Bar() => Console.WriteLine("Derived.Bar"); // no further override
		      public new void Baz() { } // hides base method (not polymorphic)
		  }
		  
		  // sealed class — cannot be inherited
		  public sealed class FinalClass { }
		  ```
-
- # Generics
  collapsed:: true
	- ## Generic Methods & Classes
	  collapsed:: true
		- ```csharp
		  // Generic method
		  static T Max<T>(T a, T b) where T : IComparable<T> =>
		      a.CompareTo(b) >= 0 ? a : b;
		  
		  Console.WriteLine(Max(3, 7));       // 7
		  Console.WriteLine(Max("apple", "banana")); // banana
		  
		  // Generic class
		  public class Stack<T> {
		      private List<T> _items = new();
		      
		      public void Push(T item) => _items.Add(item);
		      public T Pop() {
		          var item = _items[^1]; // index from end (C# 8+)
		          _items.RemoveAt(_items.Count - 1);
		          return item;
		      }
		      public T Peek() => _items[^1];
		      public int Count => _items.Count;
		      public bool IsEmpty => _items.Count == 0;
		  }
		  
		  var stack = new Stack<string>();
		  stack.Push("a"); stack.Push("b"); stack.Push("c");
		  Console.WriteLine(stack.Pop()); // c
		  ```
	-
	- ## Generic Constraints
	  collapsed:: true
		- ```csharp
		  // where T : class        — T must be a reference type
		  // where T : struct       — T must be a value type
		  // where T : new()        — T must have parameterless constructor
		  // where T : BaseClass    — T must inherit from BaseClass
		  // where T : IInterface   — T must implement IInterface
		  // where T : notnull      — T must be non-nullable (C# 8+)
		  
		  static T CreateAndInit<T>() where T : new() => new T();
		  
		  static void PrintAll<T>(IEnumerable<T> items) where T : notnull {
		      foreach (var item in items) Console.WriteLine(item);
		  }
		  ```
-
- # Delegates, Events & Func/Action
  collapsed:: true
	- ## Delegates
	  collapsed:: true
		- ```csharp
		  // Delegate — type-safe function pointer
		  delegate int MathOp(int a, int b);
		  
		  static int Add(int a, int b) => a + b;
		  static int Mul(int a, int b) => a * b;
		  
		  MathOp op = Add;
		  Console.WriteLine(op(3, 4)); // 7
		  
		  op = Mul;
		  Console.WriteLine(op(3, 4)); // 12
		  
		  // Multicast delegate — chain multiple methods
		  Action<string> log = Console.WriteLine;
		  log += s => Console.Error.WriteLine($"[ERR] {s}");
		  log("test"); // calls both
		  ```
	-
	- ## Func, Action, Predicate
	  collapsed:: true
		- ```csharp
		  // Func<T1, T2, ..., TResult> — has return value
		  Func<int, int, int> add = (a, b) => a + b;
		  Func<string, int> len = s => s.Length;
		  Func<int> getRandom = () => new Random().Next(100);
		  
		  // Action<T1, T2, ...> — no return value (void)
		  Action greet = () => Console.WriteLine("Hello!");
		  Action<string, int> info = (name, age) =>
		      Console.WriteLine($"{name} is {age}");
		  
		  // Predicate<T> — returns bool
		  Predicate<int> isPositive = n => n > 0;
		  
		  Console.WriteLine(add(3, 4));        // 7
		  Console.WriteLine(isPositive(-1));   // False
		  ```
	-
	- ## Events
	  collapsed:: true
		- ```csharp
		  public class Button {
		      // Event based on EventHandler delegate
		      public event EventHandler? Clicked;
		      public event EventHandler<string>? TextChanged;
		      
		      public void Click() {
		          Clicked?.Invoke(this, EventArgs.Empty); // safe invoke
		      }
		      
		      public void ChangeText(string text) {
		          TextChanged?.Invoke(this, text);
		      }
		  }
		  
		  var btn = new Button();
		  
		  // Subscribe
		  btn.Clicked += (sender, e) => Console.WriteLine("Button clicked!");
		  btn.TextChanged += (sender, text) => Console.WriteLine($"Text: {text}");
		  
		  btn.Click();           // Button clicked!
		  btn.ChangeText("OK");  // Text: OK
		  ```
-
- # LINQ — Language Integrated Query
  collapsed:: true
	- ## Query Syntax vs Method Syntax
	  collapsed:: true
		- ```csharp
		  using System.Linq;
		  
		  int[] nums = {5, 3, 8, 1, 9, 2, 7, 4, 6};
		  
		  // Method syntax (most common)
		  var result = nums
		      .Where(n => n > 4)
		      .OrderBy(n => n)
		      .Select(n => n * 2)
		      .ToList();
		  // result = {10, 12, 14, 16, 18}
		  
		  // Query syntax (SQL-like)
		  var result2 = (from n in nums
		                 where n > 4
		                 orderby n
		                 select n * 2).ToList();
		  ```
	-
	- ## Common LINQ Methods
	  collapsed:: true
		- ```csharp
		  var nums = new[] {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
		  
		  // Filtering
		  nums.Where(n => n % 2 == 0);          // {2,4,6,8,10}
		  
		  // Projection
		  nums.Select(n => n * n);               // {1,4,9,16,...}
		  nums.Select((n, i) => $"{i}:{n}");     // with index
		  
		  // Ordering
		  nums.OrderBy(n => n);
		  nums.OrderByDescending(n => n);
		  nums.ThenBy(n => n);                   // secondary sort
		  
		  // Aggregation
		  nums.Count();                          // 10
		  nums.Count(n => n > 5);               // 5
		  nums.Sum();                            // 55
		  nums.Sum(n => n * 2);                 // 110
		  nums.Min();                            // 1
		  nums.Max();                            // 10
		  nums.Average();                        // 5.5
		  nums.Aggregate((acc, n) => acc + n);  // 55 (custom reduce)
		  
		  // Element access
		  nums.First();                          // 1
		  nums.First(n => n > 5);               // 6
		  nums.FirstOrDefault(n => n > 100);    // 0 (default)
		  nums.Last();                           // 10
		  nums.Single(n => n == 5);             // 5 (throws if 0 or >1)
		  nums.ElementAt(3);                    // 4
		  
		  // Existence checks
		  nums.Any(n => n > 9);                 // True
		  nums.All(n => n > 0);                 // True
		  nums.Contains(5);                     // True
		  
		  // Set operations
		  nums.Distinct();
		  nums.Union(new[] {11, 12});
		  nums.Intersect(new[] {1, 2, 3});
		  nums.Except(new[] {1, 2, 3});
		  
		  // Partitioning
		  nums.Take(3);                         // {1,2,3}
		  nums.Skip(7);                         // {8,9,10}
		  nums.TakeLast(3);                     // {8,9,10}
		  nums.SkipLast(7);                     // {1,2,3}
		  nums.TakeWhile(n => n < 5);           // {1,2,3,4}
		  
		  // Grouping
		  nums.GroupBy(n => n % 2 == 0 ? "even" : "odd");
		  
		  // Flattening
		  var nested = new[] { new[]{1,2}, new[]{3,4} };
		  nested.SelectMany(x => x);            // {1,2,3,4}
		  
		  // Conversion
		  nums.ToList();
		  nums.ToArray();
		  nums.ToDictionary(n => n, n => n * n);
		  nums.ToHashSet();
		  ```
	-
	- ## LINQ with Objects
	  collapsed:: true
		- ```csharp
		  record Product(string Name, string Category, decimal Price);
		  
		  var products = new List<Product> {
		      new("Laptop",  "Electronics", 999.99m),
		      new("Phone",   "Electronics", 699.99m),
		      new("Desk",    "Furniture",   299.99m),
		      new("Chair",   "Furniture",   199.99m),
		      new("Monitor", "Electronics", 399.99m),
		  };
		  
		  // Filter + sort + project
		  var expensive = products
		      .Where(p => p.Price > 300)
		      .OrderByDescending(p => p.Price)
		      .Select(p => new { p.Name, p.Price })
		      .ToList();
		  
		  // Group by category
		  var byCategory = products
		      .GroupBy(p => p.Category)
		      .Select(g => new {
		          Category = g.Key,
		          Count = g.Count(),
		          TotalValue = g.Sum(p => p.Price),
		          Avg = g.Average(p => p.Price)
		      });
		  
		  foreach (var cat in byCategory) {
		      Console.WriteLine($"{cat.Category}: {cat.Count} items, avg ${cat.Avg:F2}");
		  }
		  ```
-
- # Async / Await
  collapsed:: true
	- ## Basics
	  collapsed:: true
		- ```csharp
		  using System.Threading.Tasks;
		  
		  // async method returns Task, Task<T>, or ValueTask<T>
		  static async Task<string> FetchDataAsync(string url) {
		      using var client = new System.Net.Http.HttpClient();
		      string data = await client.GetStringAsync(url); // non-blocking wait
		      return data;
		  }
		  
		  // Call async method
		  static async Task Main() {
		      string result = await FetchDataAsync("https://api.example.com/data");
		      Console.WriteLine(result);
		  }
		  ```
	-
	- ## Task Patterns
	  collapsed:: true
		- ```csharp
		  // Run CPU-bound work on thread pool
		  int result = await Task.Run(() => {
		      // heavy computation
		      return Enumerable.Range(1, 1_000_000).Sum();
		  });
		  
		  // Delay (non-blocking sleep)
		  await Task.Delay(1000); // wait 1 second
		  
		  // Run multiple tasks concurrently
		  var t1 = FetchDataAsync("url1");
		  var t2 = FetchDataAsync("url2");
		  var t3 = FetchDataAsync("url3");
		  
		  string[] results = await Task.WhenAll(t1, t2, t3); // all in parallel
		  
		  // First to complete
		  Task<string> first = await Task.WhenAny(t1, t2, t3);
		  
		  // Cancellation
		  var cts = new CancellationTokenSource();
		  cts.CancelAfter(TimeSpan.FromSeconds(5));
		  
		  try {
		      string data = await FetchDataAsync("url", cts.Token);
		  } catch (OperationCanceledException) {
		      Console.WriteLine("Request cancelled");
		  }
		  ```
	-
	- ## async void vs async Task
	  collapsed:: true
		- ```csharp
		  // async Task — preferred, awaitable, exceptions propagate
		  async Task DoWorkAsync() { await Task.Delay(100); }
		  
		  // async void — only for event handlers, exceptions are unobserved
		  async void Button_Click(object sender, EventArgs e) {
		      await DoWorkAsync();
		  }
		  
		  // ValueTask<T> — for hot paths where result is often synchronous
		  async ValueTask<int> GetCachedValueAsync() {
		      if (_cache.TryGetValue("key", out int val)) return val; // sync path
		      return await FetchFromDbAsync(); // async path
		  }
		  ```
-
- # Exception Handling
  collapsed:: true
	- ```csharp
	  // try / catch / finally
	  try {
	      int[] arr = new int[5];
	      arr[10] = 1; // IndexOutOfRangeException
	  } catch (IndexOutOfRangeException ex) {
	      Console.WriteLine($"Index error: {ex.Message}");
	  } catch (Exception ex) when (ex.Message.Contains("critical")) {
	      // Exception filter (C# 6+)
	      Console.WriteLine("Critical error");
	  } catch (Exception ex) {
	      Console.WriteLine($"General error: {ex.Message}");
	      throw; // re-throw preserving stack trace
	  } finally {
	      Console.WriteLine("Always runs");
	  }
	  
	  // Custom exception
	  public class ValidationException : Exception {
	      public string Field { get; }
	      public ValidationException(string field, string message)
	          : base(message) { Field = field; }
	  }
	  
	  throw new ValidationException("Email", "Invalid email format");
	  
	  // using statement — auto-dispose (IDisposable)
	  using var file = new System.IO.StreamReader("data.txt");
	  string content = file.ReadToEnd();
	  // file.Dispose() called automatically
	  ```
-
- # File I/O
  collapsed:: true
	- ```csharp
	  using System.IO;
	  
	  // Write text
	  File.WriteAllText("output.txt", "Hello, World!");
	  File.AppendAllText("output.txt", "\nSecond line");
	  File.WriteAllLines("lines.txt", new[] {"line1", "line2", "line3"});
	  
	  // Read text
	  string content = File.ReadAllText("output.txt");
	  string[] lines = File.ReadAllLines("lines.txt");
	  
	  // Check existence
	  bool exists = File.Exists("output.txt");
	  
	  // StreamReader / StreamWriter (for large files)
	  using var writer = new StreamWriter("big.txt");
	  writer.WriteLine("Line 1");
	  writer.WriteLine("Line 2");
	  
	  using var reader = new StreamReader("big.txt");
	  while (!reader.EndOfStream) {
	      string? line = reader.ReadLine();
	      Console.WriteLine(line);
	  }
	  
	  // Async file I/O
	  string data = await File.ReadAllTextAsync("output.txt");
	  await File.WriteAllTextAsync("output.txt", "async write");
	  
	  // Directory operations
	  Directory.CreateDirectory("myFolder");
	  string[] files = Directory.GetFiles(".", "*.txt");
	  string[] dirs = Directory.GetDirectories(".");
	  ```
-
- # Modern C# Features
  collapsed:: true
	- ## Nullable Reference Types (C# 8+)
	  collapsed:: true
		- ```csharp
		  // Enable in .csproj: <Nullable>enable</Nullable>
		  
		  string name = "Alice";    // non-nullable — cannot be null
		  string? nullableName = null; // nullable — can be null
		  
		  // Null-forgiving operator (!)
		  string forced = nullableName!; // tells compiler "trust me, not null"
		  
		  // Null checks
		  if (nullableName is not null) {
		      Console.WriteLine(nullableName.Length); // safe
		  }
		  
		  Console.WriteLine(nullableName?.Length ?? 0); // null-safe
		  ```
	-
	- ## Tuples (C# 7+)
	  collapsed:: true
		- ```csharp
		  // Named tuple
		  (string Name, int Age) person = ("Alice", 30);
		  Console.WriteLine(person.Name); // Alice
		  Console.WriteLine(person.Age);  // 30
		  
		  // Return multiple values
		  static (int Min, int Max, double Avg) Stats(int[] nums) =>
		      (nums.Min(), nums.Max(), nums.Average());
		  
		  var (min, max, avg) = Stats(new[] {1,2,3,4,5}); // deconstruct
		  Console.WriteLine($"Min={min}, Max={max}, Avg={avg}");
		  ```
	-
	- ## Span\<T\> & Memory\<T\> (C# 7.2+)
	  collapsed:: true
		- ```csharp
		  // Span<T> — stack-allocated, zero-copy slice of memory
		  int[] arr = {1, 2, 3, 4, 5};
		  Span<int> span = arr.AsSpan();
		  Span<int> slice = span.Slice(1, 3); // {2, 3, 4} — no copy
		  
		  // String slicing without allocation
		  ReadOnlySpan<char> str = "Hello, World!".AsSpan();
		  ReadOnlySpan<char> hello = str.Slice(0, 5); // "Hello"
		  Console.WriteLine(hello.ToString());
		  ```
	-
	- ## Index & Range (C# 8+)
	  collapsed:: true
		- ```csharp
		  int[] arr = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
		  
		  Console.WriteLine(arr[^1]);      // 9  (last element)
		  Console.WriteLine(arr[^2]);      // 8  (second to last)
		  
		  int[] slice1 = arr[2..5];        // {2, 3, 4}
		  int[] slice2 = arr[..3];         // {0, 1, 2}
		  int[] slice3 = arr[7..];         // {7, 8, 9}
		  int[] slice4 = arr[^3..];        // {7, 8, 9}
		  int[] copy   = arr[..];          // full copy
		  ```
	-
	- ## Required Members & Primary Constructors (C# 12)
	  collapsed:: true
		- ```csharp
		  // required property — must be set in object initializer
		  public class Config {
		      public required string Host { get; init; }
		      public required int Port { get; init; }
		      public string Protocol { get; init; } = "https";
		  }
		  
		  var cfg = new Config { Host = "localhost", Port = 8080 };
		  
		  // Primary constructor (C# 12) — parameters available throughout class
		  public class Logger(string name, bool verbose = false) {
		      public void Log(string msg) {
		          if (verbose) Console.WriteLine($"[{name}] {msg}");
		      }
		  }
		  ```
-
- # Library & Frameworks
  collapsed:: true
	- ## Core .NET
	  collapsed:: true
		- [[.NET Framework / .NET Core / .NET 5+]] - Base platform for C# applications.
		- [[System.Linq]] - Language-Integrated Query (LINQ) for collections.
		- [[System.Threading]] - Multi-threading and asynchronous programming.
		- [[System.Net.Http]] - HTTP communication and web requests.
	-
	- ## Web
	  collapsed:: true
		- [[ASP.NET Core]] - Cross-platform web framework for APIs, MVC, and Razor Pages.
		- [[Blazor]] - Build interactive web UIs using C# instead of JavaScript.
		- [[SignalR]] - Real-time communication (WebSockets) for web apps.
		- [[gRPC for .NET]] - High-performance RPC framework.
	-
	- ## Desktop & GUI
	  collapsed:: true
		- [[WPF (Windows Presentation Foundation)]] - Rich desktop apps (Windows only).
		- [[Windows Forms]] - Simpler Windows desktop framework.
		- [[MAUI (.NET Multi-platform App UI)]] - Cross-platform desktop + mobile (Windows, macOS, iOS, Android).
	-
	- ## Data & ORM
	  collapsed:: true
		- [[Entity Framework Core]] - ORM for SQL databases (Code-First, Migrations).
		- [[Dapper]] - Lightweight micro-ORM for raw SQL with mapping.
		- [[MongoDB .NET Driver]] - MongoDB client for .NET.
	-
	- ## JSON & Serialization
	  collapsed:: true
		- [[System.Text.Json]] - Built-in high-performance JSON (recommended for .NET 5+).
		- [[Newtonsoft.Json (Json.NET)]] - Feature-rich JSON serialization/deserialization.
	-
	- ## Testing
	  collapsed:: true
		- [[xUnit]] - Modern unit testing framework (recommended for .NET).
		- [[NUnit]] - Classic unit testing framework for .NET.
		- [[Moq]] - Mocking library for unit tests.
		- [[FluentAssertions]] - Readable assertion library.
	-
	- ## Logging
	  collapsed:: true
		- [[Serilog]] - Structured logging with multiple sinks.
		- [[NLog]] - Flexible logging with rich configuration.
		- [[Microsoft.Extensions.Logging]] - Built-in .NET logging abstraction.
	-
	- ## Game Development
	  collapsed:: true
		- [[Unity]] - Most popular game engine using C# scripting.
		- [[CSharp for Unity]] - Unity-specific C# patterns: MonoBehaviour lifecycle, ScriptableObjects, coroutines, events, and performance tips.
		- [[MonoGame]] - Cross-platform framework for 2D/3D games.
		- [[Godot (C# support)]] - Open-source engine with C# via Mono.
	-
	- ## Utilities
	  collapsed:: true
		- [[AutoMapper]] - Object-to-object mapping.
		- [[FluentValidation]] - Fluent validation rules.
		- [[MediatR]] - Mediator pattern for CQRS.
		- [[Polly]] - Resilience and transient-fault-handling (retry, circuit breaker).
-
- # More Learn
	- [Microsoft C# Guide](https://learn.microsoft.com/en-us/dotnet/csharp/)
	- [C# Language Reference](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/)
	- [.NET API Browser](https://learn.microsoft.com/en-us/dotnet/api/)
	- [C# Roadmap](https://roadmap.sh/csharp)
	- [dotnetfiddle — Online C# Compiler](https://dotnetfiddle.net/)
	- [C++ to C# Comparison](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-version-history)
	- [TheAlgorithms C#](https://github.com/TheAlgorithms/C-Sharp)
	- [Awesome .NET](https://github.com/quozd/awesome-dotnet)
	- [C# Discord Community](https://discord.gg/csharp)