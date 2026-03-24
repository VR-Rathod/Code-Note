# History
	- **How**:
		- Developed by **James Gosling** and **Mike Sheridan** at **Sun Microsystems** in **1991**.
		- Initially created as part of the **Green Project** with the goal of developing software for consumer electronics.
		- Initially called **Oak**, the language was later renamed to **Java** in 1995.
		- Designed as a platform-independent language that could run on any device with the Java Virtual Machine (JVM), making it "write once, run anywhere."
		- Became widely adopted in the late 1990s, with the release of Java 1.0 in 1996. Java continued to evolve with major releases, with significant milestones like **Java 5** (introduced generics) and **Java 8** (introduced lambda expressions and the Stream API).
	-
	- **Who**:
		- **James Gosling**, known as the "father of Java," led the development at Sun Microsystems.
		- **Sun Microsystems**, the company behind Java’s creation, which was later acquired by **Oracle Corporation** in 2010.
	-
	- **Why**:
		- Created to be a **platform-independent** language, solving the problem of software needing to be rewritten for each type of hardware.
		- Designed for **distributed computing** and internet-based applications, particularly for small, embedded systems, but soon expanded to larger enterprise applications.
		- To provide a secure, reliable, and high-performance language that could be used across multiple platforms, leveraging the **Java Virtual Machine (JVM)** for portability.
		- To allow developers to write code once and have it run anywhere, which made it particularly popular for web applications, enterprise solutions, and mobile development (with **Android**).
-
- # introduction
	- ## Advantages :
		- **Performance and Optimization**:
		  Java, while not as fast as low-level languages like C, offers **JIT (Just-In-Time) compilation** via the **Java Virtual Machine (JVM)**, which allows for **runtime optimizations**. Java programs can achieve high performance, especially with JVM optimizations and modern hardware.
		-
		- **Portability**:
		  One of Java's biggest advantages is its **platform independence**. Java code is compiled to **bytecode** which runs on any platform with a JVM, making it truly "write once, run anywhere." This portability is a huge benefit for cross-platform applications, web servers, and mobile development (especially for Android).
		-
		- **Object-Oriented Design**:
		  Java is a **purely object-oriented** language, which promotes better code organization, reusability, and scalability. Its emphasis on concepts like classes, inheritance, polymorphism, and encapsulation makes it a strong choice for developing large, complex applications and systems.
		-
		- **Garbage Collection**:
		  Java handles **automatic memory management** through **garbage collection**, which reduces the risk of memory leaks and makes memory management more straightforward compared to languages like C or C++ that require manual memory handling.
		-
		- **Rich Standard Library**:
		  Java offers a vast **standard library (Java API)** that provides built-in functionality for handling tasks like networking, file I/O, data structures, GUI creation, and more. This can significantly speed up development time.
		-
		- **Security**:
		  Java has robust **security features** like bytecode verification, the sandbox model, and strong built-in encryption capabilities. These features make Java a secure choice for developing applications, especially in web-based and enterprise environments.
		-
		- **Community Support and Ecosystem**:
		  Java enjoys a large, active community and has been in use for decades. This has led to an extensive ecosystem, including a wealth of frameworks, libraries, tools, and third-party support that simplifies development.
	-
	- ### **Disadvantages** :
		- **Performance Overhead**:
		  Java's reliance on the JVM introduces some **performance overhead** compared to native languages like C or C++. While JIT compilation optimizes performance, Java is generally slower than compiled languages due to the abstraction layer the JVM creates.
		-
		- **Verbose Syntax**:
		  Java’s syntax can be **verbose** compared to languages like Python or JavaScript. The need for boilerplate code (e.g., getters/setters, explicit declarations) can make Java applications longer and more cumbersome to write.
		-
		- **Memory Consumption**:
		  Java applications tend to consume more **memory** than those written in languages like C or C++ due to the overhead of the JVM and garbage collector. This can be an issue in memory-constrained environments like embedded systems or mobile applications with limited resources.
		-
		- **Lack of Low-Level System Access**:
		  Java abstracts much of the system-level interaction, making it **less suitable for low-level system programming** (e.g., writing device drivers or OS kernels). It cannot directly manipulate hardware or memory as languages like C can.
		-
		- **Slow Startup Time**:
		  Java applications, especially larger ones, can have a **slower startup time** compared to natively compiled applications. The JVM needs to load, initialize, and compile the bytecode, which can add delay during the application's launch.
		-
		- **Multithreading Complexity**:
		  While Java supports **multithreading**, managing threads can still be complex. While modern versions (Java 8 and beyond) have introduced useful tools like the **Fork/Join framework** and **Streams API**, writing efficient multithreaded applications still requires careful attention to thread safety and concurrency issues.
		-
		- **Less Flexibility in Some Areas**:
		  Java’s strict object-oriented structure can sometimes be restrictive. For example, **functional programming** features were introduced relatively late (Java 8), and some developers may find them less flexible or harder to use compared to languages that have been designed with functional programming in mind (e.g., Scala or Haskell).
-
- # Notes
- **`main()`** is the entry point of a **Java program**.
- **`System.out.println("Hello World");`** is used for printing output in Java.
-
- ## variables Types
  collapsed:: true
	- ```java
	  int number = 5;           // Integer
	  float f = 0.95f;          // Floating point number (single-precision)
	  double PI = 3.14159;      // Double precision floating point number
	  char yes = 'Y';           // Character
	  String s = "ME";          // String (object)
	  boolean isRight = true;   // Boolean (true/false)
	  
	  final float RATE = 0.8f;  // Constant (final makes it immutable)
	  
	  // Output the variables to check their values
	  System.out.println("Integer: " + number);
	  System.out.println("Float: " + f);
	  System.out.println("Double: " + PI);
	  System.out.println("Char: " + yes);
	  System.out.println("String: " + s);
	  System.out.println("Boolean: " + isRight);
	  System.out.println("Constant RATE: " + RATE);
	  ```
- ## Primitive Data Types
  collapsed:: true
	- ```java
	  DataType		Size			Range / Description
	  char			2 bytes			0 ~ 65,535 (Unicode characters)
	  byte			1 byte			-128 ~ 127
	  short			2 bytes			-32,768 ~ 32,767
	  int				4 bytes			-2,147,483,648 ~ 2,147,483,647
	  long			8 bytes			-9,223,372,036,854,775,808 ~ 9,223,372,036,854,775,807
	  float			4 bytes			3.4E-38 ~ 3.4E+38 (single-precision floating-point)
	  double			8 bytes			1.7E-308 ~ 1.7E+308 (double-precision floating-point)
	  boolean			1 byte			true or false
	  ```
- ## User Input
  collapsed:: true
	- ```java
	  Scanner in = new Scanner(System.in);
	  String str = in.nextLine();
	  System.out.println(str);
	  
	  int num = in.nextInt();
	  System.out.println(num);
	  ```
- ## Comment
  collapsed:: true
	- ```java
	  // I am a single line comment!
	   
	  /*
	  And I am a 
	  multi-line comment!
	  */
	  
	  /**
	   * This  
	   * is  
	   * documentation  
	   * comment 
	   */
	  ```
- ## Conditionals
  collapsed:: true
	- ```java
	  int j = 10;
	  
	  if (j == 10) {
	    System.out.println("I get printed");
	  } else if (j > 10) {
	    System.out.println("I don't");
	  } else {
	    System.out.println("I also don't");
	  }
	  ```
	-
	- ## If else
	  collapsed:: true
		- ```java
		  int k = 15;
		  if (k > 20) {
		    System.out.println(1);
		  } else if (k > 10) {
		    System.out.println(2);
		  } else {
		    System.out.println(3);
		  }
		  ```
	-
	- ## Switch
	  collapsed:: true
		- ```java
		  int month = 3;
		  String str;
		  switch (month) {
		    case 1:
		      str = "January";
		      break;
		    case 2:
		      str = "February";
		      break;
		    case 3:
		      str = "March";
		      break;
		    default:
		      str = "Some other month";
		      break;
		  }
		  
		  // Outputs: Result March
		  System.out.println("Result " + str);
		  ```
	-
	- ## Ternary operator
	  collapsed:: true
		- ```java
		  int a = 10;
		  int b = 20;
		  int max = (a > b) ? a : b;
		  
		  // Outputs: 20
		  System.out.println(max);
		  ```
- ## Java Loops
  collapsed:: true
	- ## For Loop
	  collapsed:: true
		- ```java
		  for (int i = 0; i < 10; i++) {
		    System.out.print(i);
		  }
		  // Outputs: 0123456789
		  -----------------------------------
		  for (int i = 0,j = 0; i < 3; i++,j--) {
		    System.out.print(j + "|" + i + " ");
		  }
		  // Outputs: 0|0 -1|1 -2|2
		  ```
	- ## Enhanced For Loop
		- ```java
		  int[] numbers = {1,2,3,4,5};
		  
		  for (int number: numbers) {
		    System.out.print(number);
		  }
		  // Outputs: 12345
		  ```
	- ## While Loop
		- ```java
		  int count = 0;
		  
		  while (count < 5) {
		    System.out.print(count);
		    count++;
		  }
		  // Outputs: 01234
		  ```
	- ## Do While Loop
		- ```java
		  int count = 0;
		  
		  do {
		    System.out.print(count);
		    count++;
		  } while (count < 5);
		  // Outputs: 01234
		  ```
	- ## Continue Statement
		- ```java
		  for (int i = 0; i < 5; i++) {
		    if (i == 3) {
		      continue;
		    }
		    System.out.print(i);
		  }
		  // Outputs: 01245
		  ```
	- ## Break Statement
		- ```java
		  for (int i = 0; i < 5; i++) {
		    System.out.print(i);
		    if (i == 3) {
		      break;
		    }
		  }
		  // Outputs: 0123
		  ```
- ## Misc
  collapsed:: true
	- ## Access Modifiers
	  collapsed:: true
		- ```java
		  Modifier		Class		Package		Subclass		World
		  public			Y			Y			Y				Y
		  protected		Y			Y			Y				N
		  no modifier		Y			Y			N				N
		  private			Y			N			N				N
		  ```
	- ## Math methods
	  collapsed:: true
		- ```java
		  Math.max(a,b)			Maximum of a and b
		  Math.min(a,b)			Minimum of a and b
		  Math.abs(a)				Absolute value a
		  Math.sqrt(a)			Square-root of a
		  Math.pow(a,b)			Power of b
		  Math.round(a)			Closest integer
		  Math.sin(ang)			Sine of ang
		  Math.cos(ang)			Cosine of ang
		  Math.tan(ang)			Tangent of ang
		  Math.asin(ang)			Inverse sine of ang
		  Math.log(a)				Natural logarithm of a
		  Math.toDegrees(rad)		Angle rad in degrees
		  Math.toRadians(deg)		Angle deg in radians
		  ```
	- ## Try/Catch/Finally
	  
	  ```java
	  try {
	    // something
	  } catch (Exception e) {
	    e.printStackTrace();
	  } finally {
	    System.out.println("always printed");
	  }`
	  ```
-
- # Library & Frameworks
	- [[Apache Commons Lang]] - Provides utilities for common Java tasks, such as string manipulation, object reflection, and math functions.
	- [[Google Guava]] - A set of core libraries for Java, including collections, caching, primitives support, and more.
	- [[SLF4J]] - Simple Logging Facade for Java, provides a simple logging interface and supports various logging frameworks.
	- [[Log4j]] - A powerful logging framework for Java applications, supporting configuration via files and dynamic logging.
	- [[Jackson]] - A JSON processing library for Java, capable of converting Java objects to JSON and vice versa.
	- [[JUnit]] - A widely used testing framework for Java, supporting unit testing and assertions.
	- [[Spring Framework]] - Comprehensive framework for building Java-based applications, including dependency injection, aspect-oriented programming, and more.
	- [[Apache Maven]] - A build automation tool for Java projects, managing dependencies, build lifecycle, and project documentation.
	- [[Hibernate]] - ORM (Object-Relational Mapping) framework for Java, mapping Java objects to database tables.
	- [[JavaFX]] - GUI framework for building rich user interfaces in Java, including support for modern UI components.
	- [[Mockito]] - A mocking framework for unit tests in Java, helping to isolate code under test and simulate external dependencies.
	- [[JUnit 5]] - A next-generation testing framework, focusing on flexibility and extensibility.
	- [[Apache POI]] - A library for reading and writing Microsoft Office formats (Excel, Word, PowerPoint) in Java.
	- [[Retrofit]] - A type-safe HTTP client for Java and Android, used for integrating with REST APIs.
	- [[Gson]] - A library for converting Java objects into their JSON representation and vice versa.
	- [[Java Mail API]] - Provides a platform-independent and protocol-independent framework for building mail and messaging applications.
	- [[Bouncy Castle]] - A cryptography library for Java, supporting a wide variety of cryptographic algorithms.
	- [[Apache HttpClient]] - A robust and efficient HTTP client library for Java, often used for making HTTP requests.
	- [[Slick2D]] - A lightweight 2D game development library for Java, used for graphics and sound in game development.
	- [[Vert.x]] - A toolkit for building reactive applications in Java, supporting event-driven, non-blocking I/O.
	- [[OkHttp]] - An efficient HTTP client for Android and Java applications, supporting HTTP/2 and WebSockets.
	- [[JUnit Pioneer]] - A collection of extensions for JUnit 5, adding additional functionality to the testing framework.
	- [[Lombok]] - A Java library that reduces boilerplate code by generating common code like getters, setters, constructors, etc.
-
- # More Learn
  
  Explore the following links for valuable resources, communities, and tools to enhance your skills : -
	-
	- ## Github & Webs
		-
		- [Java Developer Roadmap](https://github.com/s4kibs4mi/java-developer-roadmap)
		- [Java Design patterns](https://github.com/iluwatar/java-design-patterns)
	-
	-
-