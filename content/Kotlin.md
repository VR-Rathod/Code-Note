---
seoTitle: Kotlin Programming Reference – JVM, Android, and Multiplatform Guide
description: "Comprehensive Kotlin reference covering null safety, coroutines, extension functions, data classes, sealed classes, delegation, generics, and Java interoperability."
keywords: "kotlin, kotlin programming, null safety, coroutines, extension functions, data classes, sealed classes, android, jetpack compose, kotlin multiplatform, JVM, spring boot, ktor"
displayTitle: Kotlin
---

- # History
	- **How**:
		- Developed by **JetBrains**, Kotlin was officially announced in 2011 and released in 2016 as a modern, open-source language.
		- Designed as a modern alternative to Java, addressing many of its verbosity and safety limitations while preserving 100% interoperability.
		- Google announced official first-class support for Kotlin on Android at Google I/O 2017, boosting global mobile adoption.
		- Evolved through stable versions, introducing **coroutines** for asynchronous workflows, **Kotlin Multiplatform (KMP)** for cross-platform sharing, and compiler enhancements (such as the K2 compiler).
	-
	- **Who**:
		- **JetBrains** (under Andrey Breslav and subsequent teams) developed the language.
		- Maintained jointly by **JetBrains** and the **Kotlin Foundation** (founded by JetBrains and Google).
	-
	- **Why**:
		- To improve developer productivity by eliminating boilerplate (getters/setters, semi-colons, verbose anonymous classes).
		- To solve the billion-dollar mistake of NullPointerExceptions via built-in type-system safety.
		- To provide smooth migration from Java while supporting both object-oriented and functional paradigms.
-
- # Introduction
	- ## Core Pillars
	  collapsed:: true
		- **Conciseness** — Boasting substantial reductions in boilerplate code through data classes, type inference, smart casts, and lambdas.
		- **Null Safety** — The compiler distinguishes between nullable and non-nullable types, catching potential NullPointerExceptions at compile time.
		- **100% Interoperability** — Call existing Java code and libraries from Kotlin seamlessly, and call Kotlin code from Java with standard annotations.
		- **Multiplatform Capability** — Compile Kotlin code to JVM bytecode, JavaScript, and Native machine code (iOS, macOS, Linux, Windows) to share code across stacks.
	-
	- ## Advantages
	  collapsed:: true
		- **Built-in Safety** — Integrated null safety, smart casts, and read-only properties prevent common runtime exceptions.
		- **Coroutines Concurrency** — Asynchronous code is written sequentially, avoiding callback hell and optimizing resource usage (millions of concurrent coroutines on a single thread).
		- **Extensibility** — Extension functions and properties allow developers to add functionality to external classes without inheriting them.
		- **Tooling Support** — JetBrains provides deep, mature integration with IntelliJ IDEA, Android Studio, and compiler analysis tools.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Compilation Speed** — In larger clean builds, Kotlin can compile slightly slower than Java, though incremental compilation is highly optimized.
		- **Kotlin Multiplatform Maturity** — While the core language sharing is highly stable, platform-specific UI rendering tools (like Compose Multiplatform) are newer compared to Flutter.
		- **Runtime Overhead** — Involving minor JVM runtime additions (a small standard library package size footprint) compared to pure Java.
		- **Java-Specific Pitfalls** — Interoperating with raw Java libraries sometimes returns "platform types" where nullability isn't strictly defined, which can bypass safety checks if not handled manually.
-
- # Basics
	- ## Hello World & Entry Point
		- ```kotlin
		  // Modern Kotlin (1.3+)
		  fun main() {
		      println("Hello, World!")
		  }
		  
		  // Classic Kotlin (pre-1.3 / command line args)
		  fun main(args: Array<String>) {
		      println("Arguments size: ${args.size}")
		  }
		  ```
		- `fun` declares a function. Semi-colons are optional.
		- `println` is an alias mapping to `System.out.println` under the hood.
	-
	- ## Comments
		- ```kotlin
		  // Single-line comment
		  
		  /* Multi-line
		     comment block */
		  
		  /**
		   * KDoc document comment (supports Markdown formatting)
		   * @param name Name of user
		   */
		  ```
	-
	- ## Variables & Mutability
		- ```kotlin
		  // Read-only (Immutable) variable - preferred
		  val name: String = "Kotlin"
		  // name = "Java" // Compile Error!
		  
		  // Mutable variable
		  var counter = 10 
		  counter = 15 // Allowed
		  
		  // Compile-time constants (global scope or inside objects)
		  const val PI = 3.14159
		  
		  // Type Inference: Compiler deduces type if initialized
		  val age = 25 // Deduces Int
		  ```
	-
	- ## Primitive & Basic Types
		- In Kotlin, everything is conceptually an object; primitives are optimized into JVM primitive types at execution time where possible.
		- ```kotlin
		  // Numbers
		  val doubleVal: Double = 64.0
		  val floatVal: Float = 32.0f
		  val longVal: Long = 64L
		  val intVal: Int = 32
		  val shortVal: Short = 16
		  val byteVal: Byte = 8
		  
		  // Booleans & Characters
		  val isTrue: Boolean = true
		  val character: Char = 'K' // Characters cannot be treated directly as numbers
		  
		  // Arrays
		  val numbers: IntArray = intArrayOf(1, 2, 3)
		  val genericArray: Array<String> = arrayOf("A", "B", "C")
		  ```
	-
	- ## Strings & Templates
		- ```kotlin
		  val greeting = "Hello"
		  val target = "World"
		  
		  // String Templates
		  val message = "$greeting, $target!" // Prints: Hello, World!
		  val expression = "Length is ${target.length}" // Prints: Length is 5
		  
		  // Raw Strings (Multiline strings with margin stripping)
		  val sql = """
		      SELECT * FROM users
		      WHERE age > 18
		  """.trimIndent()
		  ```
	-
	- ## Operators & Equality
		- ```kotlin
		  // Structural Equality (Checks values using equals())
		  val list1 = listOf(1, 2)
		  val list2 = listOf(1, 2)
		  val isStructurallyEqual = list1 == list2 // true
		  
		  // Referential Equality (Checks if both references point to the same memory address)
		  val isReferentiallyEqual = list1 === list2 // false
		  
		  // Safe cast operator
		  val obj: Any = "Hello"
		  val str: String? = obj as? String // returns "Hello" (returns null if type cast fails)
		  ```
-
- # Control Flow
  collapsed:: true
	- ## if as an Expression
		- In Kotlin, `if` is an expression that returns a value, replacing the ternary operator (`cond ? a : b`).
		- ```kotlin
		  val a = 5
		  val b = 10
		  val max = if (a > b) a else b // Else branch is required when used as an expression
		  
		  // Block if expression (the last line is the returned value)
		  val result = if (a > b) {
		      println("a is larger")
		      a
		  } else {
		      println("b is larger")
		      b
		  }
		  ```
	-
	- ## when Expression (Replaces switch)
		- A powerful pattern matching construct. Can be used as a statement or an expression (exhaustive matching required for expression).
		- ```kotlin
		  val x = 3
		  val description = when (x) {
		      1 -> "One"
		      2, 3 -> "Two or Three" // Multiple matches combined with comma
		      in 4..10 -> "Between 4 and 10" // Range checks
		      is String -> "Is a String of length ${x.length}" // Type checks (Smart cast active inside branch)
		      else -> "Unknown" // Required unless compiler knows all cases are checked (e.g. sealed types)
		  }
		  
		  // No-argument when (acts as an if-else chain)
		  val email = "user@domain.com"
		  when {
		      email.isEmpty() -> println("Empty")
		      email.contains("@") -> println("Valid email")
		      else -> println("Invalid")
		  }
		  ```
	-
	- ## Loops: while, do-while, and for
		- ```kotlin
		  // while and do-while are identical to standard Java syntax
		  var count = 3
		  while (count > 0) {
		      count--
		  }
		  
		  // for loops iterate over ranges or collections (uses iterator convention)
		  for (i in 1..5) println(i) // Inclusive range: 1, 2, 3, 4, 5
		  for (i in 1 until 5) println(i) // Exclusive range: 1, 2, 3, 4
		  for (i in 5 downTo 1 step 2) println(i) // Downward range: 5, 3, 1
		  
		  val list = listOf("A", "B", "C")
		  for (item in list) {
		      println(item)
		  }
		  for ((index, value) in list.withIndex()) {
		      println("Index $index has value $value")
		  }
		  ```
	-
	- ## Jump Expressions & Labels
		- Any expression in Kotlin can be marked with a **label** (`@`), which is useful for returns, breaks, or continues in nested blocks.
		- ```kotlin
		  // Returning from a lambda inside a loop
		  fun foo() {
		      listOf(1, 2, 3).forEach {
		          if (it == 2) return@forEach // Local return from lambda, loop continues
		          println(it)
		      }
		      println("Done")
		  }
		  
		  // Breaking outer loops
		  loop@ for (i in 1..3) {
		      for (j in 1..3) {
		          if (i == 2) break@loop // Exits the outer loop
		      }
		  }
		  ```
-
- # OOP — Object-Oriented Programming
  collapsed:: true
	- ## Classes & Constructors
		- A class can have one **primary constructor** and one or more **secondary constructors**. Primary constructors are defined directly in the header.
		- ```kotlin
		  // Primary constructor with property declarations (val/var)
		  class Person(val firstName: String, var age: Int) {
		      
		      // Initializer blocks run immediately after primary constructor creation
		      init {
		          println("Person initialized with name $firstName")
		      }
		      
		      // Secondary constructor (must delegate to primary using 'this')
		      constructor(firstName: String) : this(firstName, 0) {
		          println("Secondary constructor called")
		      }
		  }
		  ```
	-
	- ## Inheritance
		- Classes and methods are **closed (final)** by default. To make a class or method subclassable/overridable, mark it with the **`open`** keyword.
		- ```kotlin
		  open class Vehicle(val name: String) {
		      open fun startEngine() {
		          println("Engine starting")
		      }
		  }
		  
		  class Car(name: String, val brand: String) : Vehicle(name) {
		      override fun startEngine() {
		          super.startEngine() // call parent method
		          println("Car engine roaring")
		      }
		  }
		  ```
	-
	- ## Interfaces
		- Kotlin interfaces can contain abstract methods as well as method implementations (similar to Java 8+). They cannot hold state, but can have properties.
		- ```kotlin
		  interface Drivable {
		      val maxSpeed: Int // Abstract property
		      
		      fun drive() {
		          println("Driving at speed limit") // Default implementation
		      }
		  }
		  
		  class SportsCar : Drivable {
		      override val maxSpeed: Int = 300
		  }
		  ```
	-
	- ## Visibility Modifiers
		- `public` — Default. Accessible anywhere.
		- `private` — Accessible only within the declaring file or class.
		- `protected` — Accessible in subclasses (not available to top-level files).
		- `internal` — Accessible within the same **module** (e.g. Gradle module, Maven project).
	-
	- ## Data Classes
		- Intended to hold data. The compiler automatically generates `equals()`, `hashCode()`, `toString()`, component properties (for destructuring), and a `copy()` method.
		- ```kotlin
		  data class User(val name: String, val email: String)
		  
		  val user1 = User("Alice", "alice@test.com")
		  val user2 = user1.copy(email = "new@test.com") // Copy with modification
		  
		  // Destructuring declarations
		  val (name, email) = user1
		  println("$name uses $email")
		  ```
	-
	- ## Sealed Classes & Interfaces
		- Restricts class hierarchies. Direct subclasses must be defined in the same package. Perfect for state management (e.g., in Android MVI architecture) where `when` checks can be made exhaustively.
		- ```kotlin
		  sealed class UIState {
		      object Loading : UIState()
		      data class Success(val data: String) : UIState()
		      data class Error(val exception: Throwable) : UIState()
		  }
		  
		  fun render(state: UIState) {
		      // No 'else' branch needed because hierarchy is sealed
		      when (state) {
		          is UIState.Loading -> println("Loading...")
		          is UIState.Success -> println("Data: ${state.data}")
		          is UIState.Error -> println("Error: ${state.exception.message}")
		      }
		  }
		  ```
	-
	- ## Companion Objects & Singletons
		- Kotlin replaces `static` members with companion objects. The `object` keyword defines a pure singleton.
		- ```kotlin
		  // Singleton
		  object DatabaseConfig {
		      val dbUrl = "jdbc:mysql://localhost:3306"
		  }
		  
		  // Class with static-like companion object
		  class MyService {
		      companion object {
		          const val TIMEOUT_LIMIT = 5000
		          
		          fun create(): MyService = MyService()
		      }
		  }
		  
		  val service = MyService.create() // Call static-like companion method
		  ```
-
- # Functions & Functional Programming
  collapsed:: true
	- ## Default and Named Arguments
		- Eliminates constructor/method overload bloat.
		- ```kotlin
		  fun connect(host: String = "localhost", port: Int = 8080, secure: Boolean = false) {
		      println("Connecting to $host:$port (secure: $secure)")
		  }
		  
		  connect() // Uses all defaults
		  connect("127.0.0.1", secure = true) // Named arguments skip non-required properties
		  ```
	-
	- ## Extension Functions & Properties
		- Adds functionality to classes without inheriting them. Extensions resolve statically under the hood.
		- ```kotlin
		  // Extension function on String
		  fun String.isEmail(): Boolean {
		      return this.contains("@") && this.contains(".")
		  }
		  
		  // Usage
		  val email = "test@domain.com"
		  println(email.isEmail()) // true
		  ```
	-
	- ## Higher-Order Functions & Lambdas
		- A higher-order function takes a function as a parameter or returns one.
		- ```kotlin
		  // Higher order function definition
		  fun calculate(x: Int, y: Int, operation: (Int, Int) -> Int): Int {
		      return operation(x, y)
		  }
		  
		  // Trailing Lambda Convention: If the last parameter is a function, 
		  // the lambda expression can be passed outside the parentheses.
		  val sum = calculate(5, 10) { a, b -> a + b }
		  ```
	-
	- ## Inline Functions
		- Instructs the compiler to inline the function body and lambdas at call sites, eliminating runtime object generation for lambdas.
		- ```kotlin
		  inline fun <T> lockAndRun(body: () -> T): T {
		      // acquires lock
		      val result = body()
		      // releases lock
		      return result
		  }
		  
		  // 'noinline' prevents inlining for specific lambda parameters
		  // 'crossinline' ensures lambdas cannot execute non-local returns (e.g. return from outer function)
		  ```
	-
	- ## Scope Functions Table
		- Scope functions execute a block of code on an object in context. They differ in how the context object is referenced (`this` vs `it`) and their return values.
		- | Function | Reference | Return Value | Common Use Case |
		  | :--- | :--- | :--- | :--- |
		  | **`let`** | `it` (lambda arg) | Lambda result | Null checking wrapper, mapping variables |
		  | **`run`** | `this` (receiver) | Lambda result | Object configuration + computation |
		  | **`with`** | `this` (receiver) | Lambda result | Invoking multiple actions on same receiver |
		  | **`apply`** | `this` (receiver) | Context object | Configuring object properties [[Builder Pattern]] |
		  | **`also`** | `it` (lambda arg) | Context object | Logging, printing side-effects |
	-
	- ## Scope Functions Code Examples
		- ```kotlin
		  data class User(var name: String, var age: Int)
		  
		  // apply: Configures object and returns it
		  val user = User("Temp", 20).apply {
		      name = "Alice" // implicit 'this'
		      age = 25
		  }
		  
		  // let: Operates on object and returns lambda result
		  val nameLength = user.let {
		      println("Processing ${it.name}") // referenced as 'it'
		      it.name.length
		  }
		  ```
-
- # Null Safety
  collapsed:: true
	- ## Nullable vs Non-Nullable Types
		- By default, variables in Kotlin are non-nullable.
		- ```kotlin
		  var name: String = "Kotlin"
		  // name = null // Compile Error!
		  
		  // Append ? to define nullable type
		  var nullableName: String? = "Kotlin"
		  nullableName = null // Allowed
		  ```
	-
	- ## Safe Calls (?.) & Elvis Operator (?:)
		- ```kotlin
		  val length: Int? = nullableName?.length // Returns length, or null if nullableName is null
		  
		  // Elvis operator provides a fallback default value
		  val actualLength: Int = nullableName?.length ?: 0 // Returns 0 if left side is null
		  
		  // Non-null assertion (!!) - forces compilation, throws NPE at runtime if null
		  val forcedLength: Int = nullableName!!.length 
		  ```
	-
	- ## Smart Casts
		- The compiler automatically casts variables after verifying their types with `is` or non-null checks.
		- ```kotlin
		  fun process(obj: Any) {
		      if (obj is String) {
		          // 'obj' is smart-cast to String automatically in this block
		          println("String length: ${obj.length}")
		      }
		      
		      val text: String? = "hello"
		      if (text != null) {
		          // 'text' is smart-cast to non-null String
		          println(text.length)
		      }
		  }
		  ```
	-
	- ## Platform Types (Java Interop)
		- When calling Java code, if the nullability is unannotated, Kotlin treats them as **platform types** (`String!`). The compiler will not enforce null checks, raising the risk of runtime NPEs. Developers should verify and wrap platform values carefully.
-
- # Generics
  collapsed:: true
	- ## Covariance (out) and Contravariance (in)
		- Kotlin uses declaration-site variance to denote type behavior.
		- **Covariance (`out`)**: Producer. Allows subclasses where parent classes are requested. Read-only.
		- **Contravariance (`in`)**: Consumer. Allows parent classes where subclasses are requested. Write-only.
		- ```kotlin
		  // Covariant class (out): Read-only output
		  interface Source<out T> {
		      fun nextItem(): T // T only used in output positions
		  }
		  
		  // Contravariant class (in): Write-only input
		  interface Comparable<in T> {
		      fun compareTo(other: T): Int // T only used in input positions
		  }
		  ```
	-
	- ## Use-Site Variance (Type Projections)
		- When you cannot declare variance globally, you can project the type at the argument level.
		- ```kotlin
		  fun copy(from: Array<out Any>, to: Array<Any>) {
		      // from is constrained to be read-only output
		      for (i in from.indices) { to[i] = from[i] }
		  }
		  ```
	-
	- ## Reified Type Parameters
		- In Java/Kotlin, generics are erased at runtime. Marking a function `inline` with a `reified` type preserves the type class, enabling dynamic reflection and type checks.
		- ```kotlin
		  inline fun <reified T> checkType(item: Any): Boolean {
		      return item is T // Valid because T is reified (preserved at runtime)
		  }
		  
		  // Usage:
		  val isString = checkType<String>("Hello") // true
		  ```
-
- # Delegation
  collapsed:: true
	- ## Class Delegation
		- Outsources implementation of interface requirements using the **`by`** keyword, replacing inheritance boilerplates.
		- ```kotlin
		  interface Printer {
		      fun printMessage()
		  }
		  
		  class RealPrinter : Printer {
		      override fun printMessage() = println("Real printing")
		  }
		  
		  // Delegates all Printer interface methods to delegatesInstance
		  class DelegateManager(delegatesInstance: Printer) : Printer by delegatesInstance
		  
		  val printer = RealPrinter()
		  DelegateManager(printer).printMessage() // "Real printing"
		  ```
	-
	- ## Delegated Properties
		- ```kotlin
		  // 1. Lazy Delegate: Computed only on first access
		  val lazyValue: String by lazy {
		      println("Computed first time!")
		      "Lazy Data"
		  }
		  
		  // 2. Observable Delegate: Triggers behavior on property modifications
		  import kotlin.properties.Delegates
		  
		  var observedName: String by Delegates.observable("Initial") { prop, old, new ->
		      println("Changed $old -> $new")
		  }
		  ```
-
- # Concurrency & Coroutines
  collapsed:: true
	- ## Suspending Functions
		- Functions marked with `suspend` can pause execution without blocking the underlying thread, allowing other processes to run.
		- ```kotlin
		  suspend fun fetchNetworkData(): String {
		      kotlinx.coroutines.delay(1000) // Suspend execution for 1 sec
		      return "Data"
		  }
		  ```
	-
	- ## Coroutine Builders
		- **`launch`** — Fires and forgets. Returns a `Job` to monitor cancellation. Non-blocking.
		- **`async`** — Initiates a task returning a `Deferred<T>` (comparable to a Future). Call `await()` to yield results.
		- **`runBlocking`** — Bridges non-coroutine entry points (like `main`) by blocking the current thread until all child tasks finish.
		- ```kotlin
		  import kotlinx.coroutines.*
		  
		  fun main() = runBlocking {
		      
		      // Parallel asynchronous execution
		      val deferred1: Deferred<String> = async {
		          delay(500)
		          "Result A"
		      }
		      val deferred2: Deferred<String> = async {
		          delay(1000)
		          "Result B"
		      }
		      
		      println("Results: ${deferred1.await()} and ${deferred2.await()}")
		  }
		  ```
	-
	- ## Dispatchers
		- **`Dispatchers.Main`** — Runs on UI thread (Android specific).
		- **`Dispatchers.IO`** — Optimised for network or disk input/output (disk reads, API calls).
		- **`Dispatchers.Default`** — Optimised for CPU intensive operations (sorting lists, image parsing).
		- **`Dispatchers.Unconfined`** — Starts on current thread, resumes on whatever thread suspended the code.
-
- # Kotlin Multiplatform (KMP)
  collapsed:: true
	- ## expect / actual Modifier
		- KMP shares business logic. Access platform-specific logic (e.g. UUID generation) in common code using `expect`, providing specific native bindings with `actual`.
		- ```kotlin
		  // inside commonMain
		  expect fun getPlatformName(): String
		  
		  // inside androidMain
		  actual fun getPlatformName(): String = "Android Device"
		  
		  // inside iosMain
		  actual fun getPlatformName(): String = "iOS Device"
		  ```
-
- # Comparison: Kotlin vs Java
  collapsed:: true
	- ## Direct Comparison Table
		- ```
		  Feature                  Kotlin                                  Java
		  Null Safety              Types are non-null by default (T?)      Requires optional class / manual check
		  Extension Functions      Supported (statically resolved)         No (must write static Utils helper classes)
		  Boilerplate              Very low (Automatic properties/copy)    High (requires manual getters/setters/constructors)
		  Smart Casts              Yes (using is checks)                   Explicit casts required in statements
		  Checked Exceptions       No (all exceptions are unchecked)       Yes (forces try/catch or throws signatures)
		  Singleton Pattern        Integrated via 'object' keyword         Requires custom singleton boilerplate code
		  Coroutines               Integrated (lightweight threads)        Lacks native suspension (Threads/Project Loom)
		  Data Classes             Data classes auto-generate standard core Rec/Records (Java 16+) / standard overrides
		  Delegation               Class & property delegation supported   Manual delegating patterns only
		  ```
-
- # Libraries & Frameworks
	- ## Core Libraries and Frameworks:
		- [[Kotlin Standard Library]] - The official library providing essential features like collections, null safety utilities, and extension properties.
		- [[Kotlinx.coroutines]] - The official library for asynchronous programming, offering tools to manage thread dispatching and scopes.
		- [[Kotlinx.serialization]] - High-performance compiler-plugin based serialization for JSON, Protocol Buffers, and CBOR.
	-
	- ## Web Development Frameworks:
		- [[Ktor]] - A lightweight, asynchronous framework developed by JetBrains for microservices, servers, and HTTP clients.
		- [[Spring Boot (with Kotlin)]] - Enterprise standard backing, utilizing Kotlin compiler-friendly constructors and reactive coroutine models.
		- [[Vert.x (with Kotlin)]] - Toolkit for compiling event-driven, reactive JVM microservices.
	-
	- ## Database and Data Management:
		- [[Exposed]] - A SQL library and ORM by JetBrains, supporting safe DSL constructions.
		- [[SQLDelight]] - Multiplatform library that generates safe Kotlin API bindings directly from standard SQL files.
	-
	- ## Testing:
		- [[Spek]] - Spec-based testing framework targeting Behavior-Driven Development (BDD).
		- [[MockK]] - Best-in-class mocking tool designed specifically for Kotlin's final classes, objects, and coroutine scopes.
	-
	- ## Mobile & Multiplatform:
		- [[Jetpack Compose]] - Modern Android UI toolkit, fully written in and utilizing Kotlin compilers.
		- [[Kotlin Multiplatform]] - Multiplatform sharing engine for logic sharing on Android, iOS, Desktop, and Web.
	-
	- ## Logging:
		- [[Kotlin Logging]] - Thin wrapper around SLF4J that optimizes logging execution behind inline functions.
-
- # More Learn
	- Explore the following links for valuable resources, communities, and tools to enhance your skills : -
		- [Kotlin official website](https://kotlinlang.org/)
		- [Kotlin Playgrounds (Web editor)](https://play.kotlinlang.org/)
		- [Kotlin Tour and Tutorials](https://kotlinlang.org/docs/kotlin-tour-welcome.html)
		- [Doodle UI Framework](https://github.com/nacular/doodle)