---
seoTitle: Rust Programming Reference – Modern Systems Programming, Safety & Concurrency
description: "Comprehensive Rust reference covering ownership, borrowing, lifetimes, traits, generics, smart pointers, unsafe Rust, macros, concurrency, and tooling."
keywords: "rust, rust programming, ownership, borrowing, lifetimes, cargo, smart pointers, traits, unsafe rust, actix, tokio, rust vs cpp, systems programming, memory safety"
displayTitle: Rust
---

- # History
	- **How**:
		- Developed by **Graydon Hoare** at **Mozilla Research** in 2010.
		- Designed to provide memory safety, concurrency, and performance without the pitfalls of C and C++.
		- Focuses on ensuring **memory safety** without a garbage collector using **ownership** and **borrowing** rules.
		- Stable release of **Rust 1.0** was in 2015. Evolved with **async/await** in 1.39 and **const generics** in 1.51.
		- Maintained today by the independent, non-profit **Rust Foundation**.
	-
	- **Who**:
		- **Graydon Hoare** (creator) and Mozilla Research.
		- **Rust Foundation** (established in 2021 by Mozilla, AWS, Google, Huawei, Microsoft).
	-
	- **Why**:
		- To replace C/C++ in performance-critical, security-sensitive applications (browsers, OS, kernels, database engines).
		- To eliminate memory corruption bugs (use-after-free, double free, buffer overflow) at compile time.
		- To make concurrent programming safe and free of data races.
-
- # Introduction
	- ## Core Pillars
	  collapsed:: true
		- **Memory Safety Without GC** — The compiler's borrow checker validates references at compile time, eliminating the runtime overhead of a garbage collector and the safety hazards of manual allocation.
		- **Fearless Concurrency** — Type safety and ownership rules prevent data races (two threads accessing the same memory concurrently, with at least one writer) at compile time.
		- **Zero-Cost Abstractions** — High-level constructs (iterators, closures, pattern matching, generics) compile down to low-level assembly identical to hand-optimized C/C++.
	-
	- ## Advantages
	  collapsed:: true
		- **Absolute Safety** — Zero segment faults, null pointer dereferences, or buffer overflows in safe Rust.
		- **Predictable Performance** — Minimal runtime, no garbage collection pauses, direct hardware control.
		- **Modern Tooling** — Cargo handles compiling, dependencies, testing, formatting, linting, and documentation out of the box.
		- **Algebraic Data Types** — Enums with associated data combined with pattern matching prevent invalid states.
		- **Expressive Type System** — Traits define shared behavior clearly, facilitating reusable generic components.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Borrow Checker Friction** — The compiler can be highly restrictive, especially for developers transitioning from garbage-collected languages or those writing cyclic data structures (like graphs).
		- **Compile Times** — Strict safety checks, monomorphization of generics, and advanced optimizations make compile times slower than Go or C.
		- **No Traditional OOP** — Lacks class-based inheritance; reuse is achieved via composition, traits, and generics, which requires a mindset shift.
		- **Syntax Verbosity** — Lifetime annotations (`'a`) and nested generic constraints can make signatures complex and hard to read.
-
- # Basics
	- ## Hello World & Entry Point
		- ```rust
		  fn main() {
		      println!("Hello, World!");
		  }
		  ```
		- `fn main()` is the entry point of every executable Rust program.
		- `println!` is a **macro** (indicated by the `!`), which performs compile-time string format validation.
	-
	- ## Comments
		- ```rust
		  // Single-line comment
		  
		  /* Multi-line
		     comment block */
		  
		  /// Outer doc comment (generates documentation for the item below it)
		  
		  //! Inner doc comment (generates documentation for the enclosing module/crate)
		  ```
	-
	- ## Variables, Mutability & Shadowing
		- ```rust
		  // Variables are immutable by default
		  let x = 5; 
		  // x = 6; // Compile Error!
		  
		  // Use 'mut' to make variables mutable
		  let mut y = 10;
		  y = 15; // Allowed
		  
		  // Constants must have explicit types and are evaluated at compile time
		  const MAX_POINTS: u32 = 100_000;
		  
		  // Shadowing: Re-declaring a variable with the same name in the same scope
		  let spaces = "   ";
		  let spaces = spaces.len(); // Shadowing allows changing type and mutability
		  ```
	-
	- ## Primitive Data Types
		- ```rust
		  // Scalar Types
		  let i: i32 = -42;       // Signed integers: i8, i16, i32, i64, i128, isize
		  let u: u32 = 42;        // Unsigned integers: u8, u16, u32, u64, u128, usize
		  let f: f64 = 3.14159;   // Floats: f32, f64
		  let b: bool = true;     // Boolean: true, false
		  let c: char = 'ℤ';      // Character: 4-byte Unicode scalar value
		  
		  // Compound Types
		  let tuple: (i32, f64, u8) = (500, 6.4, 1);
		  let first = tuple.0;    // Accessing tuple elements
		  
		  let array: [i32; 5] = [1, 2, 3, 4, 5]; // Fixed-size, stored on stack
		  let slice: &[i32] = &array[1..3];      // View into a contiguous sequence
		  ```
	-
	- ## Integer Types Summary Table
		- ```
		  Length      Signed      Unsigned
		  8-bit       i8          u8
		  16-bit      i16         u16
		  32-bit      i32         u32
		  64-bit      i64         u64
		  128-bit     i128        u128
		  arch        isize       usize (pointer sized)
		  ```
	-
	- ## Operators & Expressions
		- In Rust, almost everything is an **expression** (evaluates to a value). **Statements** end in semicolons and do not return values (or rather, return the unit type `()`).
		- ```rust
		  // Block expression returning a value
		  let y = {
		      let x = 3;
		      x + 1 // No semicolon means this is the return expression
		  }; // y = 4
		  
		  // Arithmetic, Relational, Logical, and Bitwise operators are standard:
		  // +, -, *, /, %, ==, !=, <, >, <=, >=, &&, ||, !, &, |, ^, <<, >>
		  ```
-
- # Control Flow
  collapsed:: true
	- ## if / else expressions
		- ```rust
		  let number = 6;
		  if number % 4 == 0 {
		      println!("divisible by 4");
		  } else if number % 3 == 0 {
		      println!("divisible by 3");
		  } else {
		      println!("not divisible by 4 or 3");
		  }
		  
		  // 'if' is an expression and can bind to a variable
		  let condition = true;
		  let val = if condition { 5 } else { 6 }; // arms must return the same type
		  ```
	-
	- ## Loops: loop, while, and for
		- ```rust
		  // loop: infinite loop with breaks returning values
		  let mut counter = 0;
		  let result = loop {
		      counter += 1;
		      if counter == 10 {
		          break counter * 2; // Returns 20
		      }
		  };
		  
		  // Loop labels for nested loops
		  'outer: loop {
		      loop {
		          break 'outer; // Exits the outer loop
		      }
		  }
		  
		  // while: conditional loop
		  let mut number = 3;
		  while number != 0 {
		      number -= 1;
		  }
		  
		  // for: iterator-based loop (safe and optimized)
		  let a = [10, 20, 30, 40, 50];
		  for element in a.iter() {
		      println!("value: {}", element);
		  }
		  
		  // range loops (exclusive: 1..4 prints 1, 2, 3; inclusive: 1..=4 prints 1, 2, 3, 4)
		  for number in (1..4).rev() {
		      println!("{}!", number);
		  }
		  ```
	-
	- ## match Control Flow
		- ```rust
		  enum Coin { Penny, Nickel, Dime, Quarter }
		  
		  let coin = Coin::Dime;
		  let value = match coin {
		      Coin::Penny => 1,
		      Coin::Nickel => 5,
		      Coin::Dime => 10,
		      Coin::Quarter => 25,
		  };
		  ```
-
- # Functions & Closures
  collapsed:: true
	- ## Function Definitions
		- ```rust
		  // Type annotations are mandatory for parameters and return types
		  fn add(x: i32, y: i32) -> i32 {
		      x + y // Implicit return (expression, no semicolon)
		  }
		  
		  // Early returns use the 'return' keyword
		  fn check_even(x: i32) -> bool {
		      if x % 2 == 0 {
		          return true;
		      }
		      false
		  }
		  ```
	-
	- ## Closures (Anonymous Functions)
		- ```rust
		  // Basic closure syntax: |param1, param2| expression
		  let add_one = |x: i32| x + 1;
		  let result = add_one(5); // 6
		  
		  // Type inference allows omitting type annotations
		  let print_sum = |x, y| println!("sum: {}", x + y);
		  
		  // Capture modes: closures automatically borrow or take ownership of variables
		  let list = vec![1, 2, 3];
		  
		  // Borrowing immutably
		  let only_borrows = || println!("From list: {:?}", list);
		  
		  // Forcing ownership transfer using the 'move' keyword
		  let takes_ownership = move || println!("Owned list: {:?}", list);
		  // println!("{:?}", list); // Compile Error! list was moved into closure
		  ```
	-
	- ## Fn, FnMut, and FnOnce Traits
		- Rust classifies closures into three traits based on how they handle captured variables:
		- **`FnOnce`** — Consumes captures. Can be called at most once (moves out of captures).
		- **`FnMut`** — Mutates captures. Can be called multiple times (borrows mutably).
		- **`Fn`** — Borrows captures immutably. Can be called concurrently and multiple times.
		- ```rust
		  fn call_once<F>(f: F) where F: FnOnce() { f(); }
		  fn call_mut<F>(mut f: F) where F: FnMut() { f(); }
		  fn call_shared<F>(f: F) where F: Fn() { f(); }
		  ```
-
- # Ownership, Borrowing & Lifetimes
  collapsed:: true
	- ## The 3 Rules of Ownership
		- 1. Each value in Rust has an owner (variable).
		- 2. There can only be one owner at a time.
		- 3. When the owner goes out of scope, the value is automatically dropped (memory freed).
	-
	- ## Move vs Copy Semantics
		- If a type implements the `Copy` trait (e.g., primitive types stored on stack), assignment performs a bitwise copy.
		- Otherwise, assignment/passing transfers ownership (**Move**), and the source variable becomes invalid.
		- ```rust
		  // Move Semantics
		  let s1 = String::from("hello"); // Heap allocated
		  let s2 = s1; // Ownership is moved to s2. s1 is now invalid!
		  // println!("{}", s1); // Compile Error!
		  
		  // Copy Semantics
		  let x = 5;
		  let y = x; // x is Copy, so both x and y are valid and independent.
		  println!("x: {}, y: {}", x, y); // Works
		  
		  // Explicit Deep Copying
		  let s3 = s2.clone(); // Deep copy of heap data. Both s2 and s3 are valid.
		  ```
	-
	- ## Borrowing and References
		- To use a value without taking ownership, we borrow it using **References** (`&`).
		- ```rust
		  fn calculate_length(s: &String) -> usize { // Borrowed reference
		      s.len()
		  } // s goes out of scope, but since it doesn't own what it points to, nothing happens.
		  ```
	-
	- ## The Borrow Checker Rules
		- At any given time, you can have:
		- **Rule 1**: Either any number of immutable references (`&T`) to a resource...
		- **Rule 2**: OR exactly one mutable reference (`&mut T`) to a resource.
		- **Rule 3**: References must always be valid (never point to dropped memory - no dangling references).
		- ```rust
		  let mut s = String::from("hello");
		  
		  let r1 = &s; // Fine
		  let r2 = &s; // Fine
		  // let r3 = &mut s; // Compile Error! Cannot borrow mutably when immutably borrowed.
		  
		  println!("{}, {}", r1, r2); // r1 and r2 scopes end after their last use
		  
		  let r3 = &mut s; // Fine! r1 and r2 are no longer active in scope.
		  ```
	-
	- ## Lifetimes: Preventing Dangling References
		- Lifetimes are named regions of scope that the compiler (`borrow checker`) uses to verify that all borrows are valid.
		- ```rust
		  // Function with generic lifetime parameter 'a
		  // Specifies that the returned reference lives as long as the shortest of 'x' or 'y'
		  fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
		      if x.len() > y.len() { x } else { y }
		  }
		  ```
	-
	- ## Lifetime Elision Rules
		- The compiler automatically deduces lifetimes in function signatures based on three rules:
		- 1. Each input parameter gets its own input lifetime parameter (e.g., `fn foo<'a, 'b>(x: &'a i32, y: &'b i32)`).
		- 2. If there is exactly one input lifetime parameter, that lifetime is assigned to all output lifetime parameters (e.g., `fn foo<'a>(x: &'a i32) -> &'a i32`).
		- 3. If there are multiple input lifetime parameters, but one of them is `&self` or `&mut self`, the lifetime of `self` is assigned to all outputs.
	-
	- ## Lifetimes in Structs
		- If a struct holds a reference, it must be annotated with a lifetime, indicating the struct cannot outlive the reference it holds.
		- ```rust
		  struct ImportantExcerpt<'a> {
		      part: &'a str, // Struct cannot outlive the string slice 'part' points to
		  }
		  ```
	-
	- ## The 'static Lifetime
		- Points to data that lives for the entire duration of the program (e.g., string literals, static variables).
		- ```rust
		  let s: &'static str = "I have a static lifetime.";
		  ```
-
- # Data Types & Type System
  collapsed:: true
	- ## Structs
		- ```rust
		  // 1. Classic Struct
		  struct User {
		      active: bool,
		      username: String,
		      sign_in_count: u64,
		  }
		  
		  // Instantiation
		  let user1 = User {
		      active: true,
		      username: String::from("admin"),
		      sign_in_count: 1,
		  };
		  
		  // 2. Tuple Struct
		  struct Color(i32, i32, i32);
		  let black = Color(0, 0, 0);
		  
		  // 3. Unit-Like Struct (Useful for traits on empty types)
		  struct AlwaysEqual;
		  ```
	-
	- ## Methods and Associated Functions
		- Methods are defined inside `impl` blocks and take `self` as their first parameter. Associated functions (like constructors) do not take `self`.
		- ```rust
		  struct Rectangle {
		      width: u32,
		      height: u32,
		  }
		  
		  impl Rectangle {
		      // Associated function (Constructor)
		      fn square(size: u32) -> Self {
		          Self { width: size, height: size }
		      }
		      
		      // Method (Immutably borrows self)
		      fn area(&self) -> u32 {
		          self.width * self.height
		      }
		      
		      // Method (Mutably borrows self)
		      fn scale(&mut self, factor: u32) {
		          self.width *= factor;
		          self.height *= factor;
		      }
		  }
		  
		  let mut rect = Rectangle::square(10); // Call associated function
		  println!("Area: {}", rect.area()); // Call method
		  ```
	-
	- ## Enums (Algebraic Data Types)
		- Rust enums are sum types; they can store data of varying types within each variant.
		- ```rust
		  enum IpAddr {
		      V4(u8, u8, u8, u8),
		      V6(String),
		  }
		  
		  let home = IpAddr::V4(127, 0, 0, 1);
		  let loopback = IpAddr::V6(String::from("::1"));
		  ```
	-
	- ## Option and Result
		- Built-in enums representing optional values and recoverable errors respectively (no `null` or exceptions).
		- ```rust
		  // Option<T> definition
		  // enum Option<T> { Some(T), None }
		  let x: Option<i32> = Some(5);
		  let y: Option<i32> = None;
		  
		  // Result<T, E> definition
		  // enum Result<T, E> { Ok(T), Err(E) }
		  let success: Result<i32, &str> = Ok(200);
		  let failure: Result<i32, &str> = Err("404 Not Found");
		  ```
	-
	- ## Pattern Matching
		- ```rust
		  // Match must be exhaustive
		  let some_u8_value = Some(3u8);
		  match some_u8_value {
		      Some(1) => println!("one"),
		      Some(3) => println!("three"),
		      _ => (), // Wildcard placeholder for other cases
		  }
		  
		  // if let shorthand (when you only care about one pattern)
		  if let Some(3) = some_u8_value {
		      println!("Found three!");
		  }
		  
		  // while let conditional loop
		  let mut stack = vec![1, 2, 3];
		  while let Some(top) = stack.pop() {
		      println!("{}", top);
		  }
		  ```
	-
	- ## Advanced Pattern Matching Patterns
		- ```rust
		  struct Point { x: i32, y: i32 }
		  let p = Point { x: 0, y: 7 };
		  
		  // Destructuring and match guards
		  match p {
		      Point { x, y } if x == y => println!("On diagonal at {}", x),
		      Point { x: 0, y } => println!("On Y axis at {}", y),
		      Point { x, y: 0 } => println!("On X axis at {}", x),
		      Point { x, y } => println!("Somewhere else at ({}, {})", x, y),
		  }
		  
		  // @ Binding: capture a value while testing it
		  enum Message { Hello { id: i32 } }
		  let msg = Message::Hello { id: 5 };
		  
		  match msg {
		      Message::Hello { id: id_variable @ 3..=7 } => {
		          println!("Found an id in range 3 to 7: {}", id_variable)
		      }
		      Message::Hello { id: 10..=12 } => println!("Found id in range 10-12"),
		      _ => ()
		  }
		  ```
-
- # Traits & Generics
  collapsed:: true
	- ## Generics
		- ```rust
		  // Generic Struct
		  struct Point<T> {
		      x: T,
		      y: T,
		  }
		  
		  // Generic Function
		  fn largest<T: PartialOrd>(list: &[T]) -> &T {
		      let mut largest = &list[0];
		      for item in list {
		          if item > largest { largest = item; }
		      }
		      largest
		  }
		  ```
	-
	- ## Traits (Shared Behavior Interfaces)
		- ```rust
		  pub trait Summary {
		      fn summarize(&self) -> String;
		      
		      // Default implementation
		      fn author(&self) -> String {
		          String::from("Anonymous")
		      }
		  }
		  
		  struct Article {
		      title: String,
		      content: String,
		  }
		  
		  impl Summary for Article {
		      fn summarize(&self) -> String {
		          format!("{} - {}", self.title, self.content)
		      }
		  }
		  ```
	-
	- ## Trait Bounds & where Clauses
		- ```rust
		  // Trait bound syntax
		  fn notify<T: Summary>(item: &T) {
		      println!("Breaking news! {}", item.summarize());
		  }
		  
		  // Multiple trait bounds using +
		  fn display_and_summary<T: Summary + std::fmt::Debug>(item: &T) {}
		  
		  // Clean syntax with where clauses for complex bounds
		  fn some_function<T, U>(t: &T, u: &U) -> i32
		  where
		      T: Summary + Clone,
		      U: std::fmt::Debug + Clone,
		  {
		      0
		  }
		  ```
	-
	- ## Static Dispatch (Monomorphization) vs Dynamic Dispatch (Trait Objects)
		- **Static Dispatch**: Compiler replaces generic code with non-generic code for each concrete type used (**zero runtime cost**, but inflates binary size).
		- **Dynamic Dispatch**: Resolved at runtime via vtables using **Trait Objects** (`&dyn Trait` or `Box<dyn Trait>`). Requires object safety.
		- ```rust
		  // Static Dispatch (Compile-time)
		  fn print_static<T: Summary>(item: T) {
		      println!("{}", item.summarize());
		  }
		  
		  // Dynamic Dispatch (Runtime lookup)
		  fn print_dynamic(item: &dyn Summary) {
		      println!("{}", item.summarize()); // dynamic call via vtable pointer
		  }
		  ```
	-
	- ## Common Standard Library Traits
		- `Debug`: Enables debug printing with formatting `{:?}`.
		- `Clone`: Explicit duplicate generation of an object.
		- `Copy`: Implicit duplication via bitwise copy (stack-only types).
		- `Default`: Provides default constructor functions (`Default::default()`).
		- `Drop`: Destructor logic for releasing resources (RAII). Cannot implement both `Copy` and `Drop`.
		- `Iterator`: Allows iteration over sequences (requires `next()` method implementation).
		- `Display`: Custom user-facing formatting with `{}`.
	-
	- ## The Orphan Rule
		- You can implement a trait on a type if and only if **either the trait or the type is local to your crate**. This prevents third-party crates from breaking each other by defining conflicting implementations for external types (e.g., implementing `Display` on `Vec<T>` is forbidden).
-
- # Memory Management & Smart Pointers
  collapsed:: true
	- ## RAII (Resource Acquisition Is Initialization)
		- Resources (memory, files, sockets) are acquired in constructors and released automatically inside the `Drop::drop` destructor when variables go out of scope.
		- ```rust
		  struct CustomSmartPointer {
		      data: String,
		  }
		  
		  impl Drop for CustomSmartPointer {
		      fn drop(&mut self) {
		          println!("Dropping CustomSmartPointer with data `{}`!", self.data);
		      }
		  }
		  ```
	-
	- ## Box<T> (Heap Allocation)
		- Used to store data on the heap instead of the stack. Provides exclusive ownership.
		- ```rust
		  let b = Box::new(5); // Stores '5' on the heap, 'b' points to it
		  println!("b = {}", *b); // Dereferencing to access value
		  ```
	-
	- ## Rc<T> (Reference Counting)
		- Enables shared ownership within a single thread. Tracks the number of references. When reference count drops to 0, data is cleaned up.
		- ```rust
		  use std::rc::Rc;
		  
		  let data = Rc::new(String::from("shared"));
		  let ref1 = Rc::clone(&data); // Increases reference count
		  let ref2 = Rc::clone(&data); // Increases reference count
		  
		  println!("Reference count: {}", Rc::strong_count(&data)); // 3
		  ```
	-
	- ## Arc<T> (Atomic Reference Counting)
		- Thread-safe version of `Rc<T>` using atomic operations. Essential for multi-threaded shared ownership, but has a slight performance overhead compared to `Rc`.
		- ```rust
		  use std::sync::Arc;
		  use std::thread;
		  
		  let data = Arc::new(vec![1, 2, 3]);
		  let data_clone = Arc::clone(&data);
		  
		  thread::spawn(move || {
		      println!("From thread: {:?}", data_clone);
		  }).join().unwrap();
		  ```
	-
	- ## Cell<T> and RefCell<T> (Interior Mutability)
		- Allows mutating values even when the wrapping container is immutable. Borrows rules are enforced at runtime rather than compile time.
		- **`Cell<T>`**: Works on `Copy` types by copying values in/out. No borrowing overhead.
		- **`RefCell<T>`**: Works on non-copy types, returning dynamically checked smart references (`Ref` and `RefMut`). Panics at runtime if borrowing rules are violated.
		- ```rust
		  use std::cell::RefCell;
		  
		  let val = RefCell::new(5);
		  
		  // Mutate even though 'val' is immutable
		  *val.borrow_mut() += 10; 
		  
		  println!("val: {:?}", val.borrow()); // 15
		  
		  // Runtime Panic example:
		  let r1 = val.borrow();
		  // let r2 = val.borrow_mut(); // Panic at runtime! Already borrowed immutably.
		  ```
	-
	- ## Smart Pointer Comparison Table
		- ```
		  Smart Pointer    Ownership       Threading        Borrow Check Timing
		  Box<T>           Exclusive       N/A              Compile Time
		  Rc<T>            Shared          Single-Thread    Compile Time
		  Arc<T>           Shared          Multi-Thread     Compile Time
		  RefCell<T>       Interior        Single-Thread    Runtime
		  Mutex<T>         Interior/Lock   Multi-Thread     Runtime
		  ```
-
- # Concurrency
  collapsed:: true
	- ## Thread Spawning
		- ```rust
		  use std::thread;
		  use std::time::Duration;
		  
		  let handle = thread::spawn(|| {
		      for i in 1..5 {
		          println!("hi number {} from the spawned thread!", i);
		          thread::sleep(Duration::from_millis(1));
		      }
		  });
		  
		  handle.join().unwrap(); // Wait for thread to finish
		  ```
	-
	- ## Message Passing (Channels)
		- Multi-Producer, Single-Consumer (`mpsc`) channel for passing data between threads safely.
		- ```rust
		  use std::sync::mpsc;
		  use std::thread;
		  
		  let (tx, rx) = mpsc::channel();
		  
		  thread::spawn(move || {
		      let val = String::from("message from thread");
		      tx.send(val).unwrap(); // transfers ownership of 'val' to receiver thread
		  });
		  
		  let received = rx.recv().unwrap(); // blocks main thread until message arrives
		  println!("Got: {}", received);
		  ```
	-
	- ## Shared State (Mutex & Arc)
		- Safely mutates data across multiple threads by acquiring locks.
		- ```rust
		  use std::sync::{Arc, Mutex};
		  use std::thread;
		  
		  let counter = Arc::new(Mutex::new(0));
		  let mut handles = vec![];
		  
		  for _ in 0..10 {
		      let counter = Arc::clone(&counter);
		      let handle = thread::spawn(move || {
		          let mut num = counter.lock().unwrap(); // Acquires lock, blocks until free
		          *num += 1;
		      });
		      handles.push(handle);
		  }
		  
		  for handle in handles {
		      handle.join().unwrap();
		  }
		  
		  println!("Result: {}", *counter.lock().unwrap()); // 10
		  ```
	-
	- ## Send & Sync (Thread Safety Auto-Traits)
		- Rust enforces thread safety statically using two marker traits:
		- **`Send`**: Indicates ownership of the type can be transferred across thread boundaries. Most types are `Send` (except `Rc<T>`, raw pointers).
		- **`Sync`**: Indicates it is safe for multiple threads to access references of this type concurrently. A type `T` is `Sync` if and only if `&T` is `Send` (e.g. types with raw interior mutability like `RefCell` are not `Sync`, whereas `Mutex` is).
-
- # Metaprogramming (Macros)
  collapsed:: true
	- ## Declarative Macros (macro_rules!)
		- Pattern-matching macros that generate code at compile time.
		- ```rust
		  #[macro_export]
		  macro_rules! my_vec {
		      ( $( $x:expr ),* ) => {
		          {
		              let mut temp_vec = Vec::new();
		              $(
		                  temp_vec.push($x);
		              )*
		              temp_vec
		          }
		      };
		  }
		  
		  let v = my_vec![1, 2, 3];
		  ```
	-
	- ## Procedural Macros
		- Function-like macros that act as AST transformers, accepting Rust token streams as input and producing new token streams.
		- **Derive Macros**: `#[derive(MyTrait)]` automatically implements traits for structs/enums.
		- **Attribute-like Macros**: `#[route(GET, "/")]` defines custom metadata attributes.
		- **Function-like Macros**: `sql!("SELECT * FROM users")` looks like function calls but processes code at compile time.
-
- # Error Handling
  collapsed:: true
	- ## Unrecoverable Errors with panic!
		- For fatal, unrecoverable states. Aborts the thread or unwinds stack.
		- ```rust
		  // panic!("crash and burn");
		  ```
	-
	- ## Recoverable Errors with Result<T, E>
		- ```rust
		  use std::fs::File;
		  use std::io::{self, Read};
		  
		  fn read_username_from_file() -> Result<String, io::Error> {
		      let username_file_result = File::open("username.txt");
		      
		      let mut username_file = match username_file_result {
		          Ok(file) => file,
		          Err(e) => return Err(e), // Early return on error
		      };
		      
		      let mut username = String::new();
		      match username_file.read_to_string(&mut username) {
		          Ok(_) => Ok(username),
		          Err(e) => Err(e),
		      }
		  }
		  ```
	-
	- ## Error Propagation with the ? Operator
		- The `?` operator simplifies error propagation. If a `Result` is `Err`, it returns the error early.
		- ```rust
		  fn read_username_from_file_short() -> Result<String, io::Error> {
		      let mut username = String::new();
		      File::open("username.txt")?.read_to_string(&mut username)?;
		      Ok(username)
		  }
		  ```
-
- # Unsafe Rust
  collapsed:: true
	- ## The unsafe Superpowers
		- An `unsafe` block disables compiler safety checks for five specific operations ("superpowers"). Regular borrow checker rules inside unsafe are still active, but the programmer takes full responsibility.
		- 1. Dereferencing raw pointers.
		- 2. Calling unsafe functions/methods.
		- 3. Implementing unsafe traits.
		- 4. Mutating static mutable variables.
		- 5. Accessing fields of a `union`.
	-
	- ## Dereferencing Raw Pointers
		- Raw pointers (`*const T`, `*mut T`) bypass the borrow checker. Creating them is safe, but dereferencing them must be inside an `unsafe` block.
		- ```rust
		  let mut num = 5;
		  
		  // Safe raw pointer creation
		  let r1 = &num as *const i32;
		  let r2 = &mut num as *mut i32;
		  
		  // Unsafe dereferencing
		  unsafe {
		      println!("r1 is: {}", *r1);
		      *r2 = 10;
		      println!("r2 is: {}", *r2);
		  }
		  ```
	-
	- ## Calling Unsafe Functions and FFI
		- ```rust
		  // Unsafe function definition
		  unsafe fn dangerous() {}
		  
		  unsafe {
		      dangerous(); // Must be called within unsafe
		  }
		  
		  // Foreign Function Interface (FFI) - calling C code
		  extern "C" {
		      fn abs(input: i32) -> i32;
		  }
		  
		  fn main() {
		      unsafe {
		          println!("Absolute value of -3 according to C: {}", abs(-3));
		      }
		  }
		  ```
	-
	- ## Mutating Static Mutable Variables
		- Global mutable state is inherently unsafe because of potential data races.
		- ```rust
		  static mut COUNTER: u32 = 0;
		  
		  fn add_to_counter(inc: u32) {
		      unsafe {
		          COUNTER += inc; // Unsafe mutation
		      }
		  }
		  ```
-
- # Ecosystem & Tooling
  collapsed:: true
	- ## Cargo: The Build System & Package Manager
		- ```bash
		  cargo new my_project    # Create new package
		  cargo build             # Compile debug binary (target/debug/)
		  cargo build --release   # Compile optimized production binary (target/release/)
		  cargo run               # Build and execute the program in one step
		  cargo check             # Perform compile check (fast, no binary creation)
		  cargo test              # Run unit and integration tests
		  cargo doc --open        # Generate and display HTML documentation
		  ```
	-
	- ## Config files: Cargo.toml
		- ```toml
		  [package]
		  name = "my_project"
		  version = "0.1.0"
		  edition = "2021"
		  
		  [dependencies]
		  serde = { version = "1.0", features = ["derive"] }
		  tokio = { version = "1.0", features = ["full"] }
		  ```
	-
	- ## Standard Quality Tools
		- **`rustc`** — The Rust compiler.
		- **`rustup`** — Handles toolchains (switch between stable, beta, nightly) and updates.
		- **`clippy`** — A powerful collection of lints to catch common mistakes and enforce best idioms. Run using `cargo clippy`.
		- **`rustfmt`** — Standard automatic formatter to keep codebase styles clean. Run using `cargo fmt`.
-
- # Comparison: Rust vs C++
  collapsed:: true
	- ## Direct Comparison Table
		- ```
		  Feature                  Rust                                    C++
		  Memory Management        Borrow Checker + RAII (Zero GC)          Smart Pointers / Manual RAII / Raw delete
		  Type & Memory Safety     Guaranteed at compile time (Safe Rust)  Manual, prone to Undefined Behavior (UB)
		  Generics                 Traits constraints (Monomorphization)   Templates (Monomorphization) / Concepts
		  OOP Paradigm             Composition over inheritance (Traits)   Traditional class-based inheritance
		  Error Handling           Result<T, E> & Option<T> (No Exceptions) try/catch Exceptions or return codes
		  Concurrency Safety       Statically guaranteed (Send/Sync)        Manual locking, data races are undefined
		  Package Management       Cargo (Standardized, Crates.io)          Varies (Vcpkg, Conan, CMake, manual)
		  Compile Times            Typically slow (strict static checks)   Varies, slow on templates instantiation
		  Metadata & Reflection    Proc-Macros (AST analysis)              Limited RTTI / Templates tricks
		  ```
-
- # Libraries & Frameworks
	- ## Core Libraries and Frameworks:
		- [[Rust Standard Library]] - Essential functionality such as file I/O, networking, collections, and concurrency utilities.
		- [[Cargo]] - Rust's package manager and build system, making it easy to manage dependencies, compile code, and distribute packages.
		- [[Serde]] - A powerful serialization/deserialization library for Rust, commonly used for working with JSON, TOML, YAML, and other data formats.
	-
	- ## Web Development Frameworks:
		- [[Rocket]] - A web framework for Rust that focuses on ease of use, type safety, and speed. Rocket provides high-level abstractions for routing, request handling, and templating.
		- [[Actix]] - A powerful actor-based framework for building fast and reliable web applications in Rust, offering a highly concurrent and efficient model for handling requests.
		- [[Warp]] - A lightweight and fast web framework based on **tokio** and **hyper**, designed for building asynchronous, highly concurrent web services.
		- [[Tide]] - An async-first, minimalist web framework built on **async-std**, designed to be simple and extendable for web application development.
	-
	- ## Database and Data Management:
		- [[Diesel]] - A popular ORM for Rust, offering type safety for SQL queries and support for PostgreSQL, SQLite, and MySQL databases.
		- [[SQLx]] - A database library for asynchronous SQL queries in Rust, supporting MySQL, PostgreSQL, and SQLite.
		- [[MongoDB Rust Driver]] - The official Rust driver for MongoDB, enabling efficient interaction with MongoDB databases.
	-
	- ## Testing:
		- [[Rust's built-in testing]] - Rust includes a built-in testing framework, enabling unit tests, integration tests, and documentation tests as part of the standard development process.
		- [[Cargo test]] - A command within **Cargo** to run unit tests and integration tests, making it easy to verify the correctness of your codebase.
		- [[Proptest]] - A property-based testing library for Rust that generates test cases based on properties of the code rather than individual examples.
	-
	- ## Concurrency:
		- [[Tokio]] - A runtime for building asynchronous applications in Rust, providing a powerful set of tools for handling asynchronous I/O, networking, and concurrency.
		- [[async-std]] - An alternative asynchronous runtime for Rust, designed to provide an async version of the Rust standard library.
		- [[Rayon]] - A data parallelism library for Rust that simplifies multi-threading by providing a high-level API for parallel iteration over collections.
	-
	- ## Networking:
		- [[Hyper]] - A fast and low-level HTTP library for Rust, offering both client and server-side support for HTTP/1 and HTTP/2.
		- [[Reqwest]] - An HTTP client library built on top of **hyper**, designed to provide a simpler, high-level interface for making HTTP requests.
		- [[Mio]] - A low-level, event-driven I/O library for Rust, providing building blocks for asynchronous networking applications.
	-
	- ## Cryptography and Security:
		- [[RustCrypto]] - A collection of cryptographic algorithms and utilities written in Rust, including hashing algorithms, block ciphers, and elliptic curve operations.
		- [[Sodiumoxide]] - A Rust wrapper for the **libsodium** cryptographic library, offering modern cryptographic primitives and secure encryption algorithms.
		- [[OpenSSL]] - Rust bindings for the **OpenSSL** library, enabling access to SSL/TLS encryption and cryptographic functionality.
	-
	- ## Logging:
		- [[log]] - A logging facade for Rust, providing a unified interface for logging that works with various logging implementations.
		- [[env_logger]] - A simple logger for Rust, designed to be used with the **log** crate, enabling logging based on environment variables.
	-
	- ## Serialization and Data Formats:
		- [[Serde]] - A powerful framework for serializing and deserializing Rust data structures, used for working with JSON, TOML, YAML, and more.
		- [[Bincode]] - A binary serialization library for Rust, focusing on efficient, compact serialization with support for custom serialization strategies.
	-
	- ## Miscellaneous:
		- [[Clippy]] - A linter for Rust that provides helpful suggestions to improve code quality, optimize performance, and ensure best practices.
		- [[Rustfmt]] - A tool for automatically formatting Rust code according to the official style guidelines.
-
- # More Learn
	- Explore the following links for valuable resources, communities, and tools to enhance your skills : -
		- [Rust Language Website](https://www.rust-lang.org)
		- [The Rust Programming Language Book](https://doc.rust-lang.org/book/)
		- [Rust by Example](https://doc.rust-lang.org/stable/rust-by-example/)
		- [Rustlings Exercises](https://github.com/rust-lang/rustlings)