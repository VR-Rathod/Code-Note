---
seoTitle: F# Programming Reference – Functional-First .NET Guide
description: "Comprehensive F# language reference covering immutability, pattern matching, discriminated unions, records, async workflows, query expressions, and .NET interop."
keywords: "F#, F Sharp, .NET, functional programming, pattern matching, discriminated unions, async, actors, computation expressions, syntax reference, cheat sheet, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: F#
---

- # History
	- **How**:
		- **F#** (F Sharp) was developed by **Don Syme** at **Microsoft Research** in Cambridge, first released in **2005**. It was designed to bring the functional-first programming paradigm of the ML family (specifically OCaml) to the .NET Common Language Infrastructure (CLI).
		- Key milestones:
			- 2005: First release, establishing functional patterns on .NET.
			- 2010: Officially integrated into Microsoft Visual Studio. Added **Asynchronous Workflows** (which inspired the `async`/`await` model in C# and other languages).
			- 2012: Introduced **Type Providers** (allowing schema-safe data queries directly from databases or CSVs at compile time).
			- Modern F# (F# 5/6/7+): Runs cross-platform on .NET Core/.NET SDK alongside C# and VB.NET.
	-
	- **Who**:
		- **Don Syme** (creator) and Microsoft Research.
	-
	- **Why**:
		- Created to combine functional programming safety (immutability, type inference, algebraic types) with the performance, library ecosystem, and cross-platform capability of the .NET runtime.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Minimalist, Clean Syntax** — Employs a Python-like indentation system (lightweight syntax) that eliminates curly brackets and semicolons, reducing boilerplate.
		- **Immutability by Default** — Variables cannot be mutated unless explicitly marked, reducing synchronization bugs in multi-threaded code.
		- **Powerful Type Inference** — Implicitly deduces types without requiring explicit type signatures.
		- **Algebraic Data Types** — Discriminated unions and record types make modeling business logic and domains simple and compile-safe.
		- **Seamless .NET Interoperability** — Can invoke C# classes, inherit .NET interfaces, and consume NuGet packages directly.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Smaller Ecosystem than C#** — While it has access to the full .NET ecosystem, F#-specific tutorials, community forums, and jobs are fewer compared to C#.
		- **OOP Interoperability Boilerplate** — Mixing functional structures with standard C# style mutable classes requires writing occasionally verbose conversion layers.
		- **Indentation Sensitivity** — Strict indentation styling rules can trigger compile errors if tab/space characters are mixed in editors.
	-
	- ## Remember Points
	  collapsed:: true
		- **Let Bindings are Immutable** — Once bound using `let`, a value cannot change.
		- **Pipeline Operator (`|>`)** — Feeds the result of an expression as the last argument to the next function.
		- **Type System is Safe** — Prevents null reference errors by defaulting to non-nullable values (uses `Option` wrapper instead).
-
- # Basics
	- ## Hello World & Entry Point
		- ```fsharp
		  open System
		  
		  [<EntryPoint>]
		  let main argv =
		      // printfn prints formatted text with a trailing newline
		      printfn "Hello, World!"
		      0 // Returns exit code integer (0 = success)
		  ```
		- `open` is equivalent to C# `using` / Java `import`.
		- `[<EntryPoint>]` designates the starting execution function of the application.
		- `printfn` uses type-safe string formatting.
	-
	- ## Variables and Value Binding
		- ```fsharp
		  // 1. Immutable Value Binding (Default)
		  let name = "VR Rathod"
		  let age = 25 // Type inferred as int
		  
		  // 2. Mutable Variables (Requires explicit keyword)
		  let mutable counter = 0
		  counter <- counter + 1 // Use '<-' operator to modify mutable variable state
		  
		  // 3. Constant values
		  [<Literal>]
		  let TaxRate = 0.18
		  ```
	-
	- ## Basic Types Table
		- ```
		  Type        Example                 Description
		  int         42                      Standard 32-bit signed integer
		  float       3.14                    64-bit double-precision floating point (C# double)
		  bool        true                    Boolean value
		  string      "F#"                    Unicode string
		  unit        ()                      Equivalent to void (indicates no value returning)
		  ```
-
- # Control Flow
	- ## If-Then-Else Expression
	  collapsed:: true
		- ```fsharp
		  // 'if' is an expression that returns a value; both branches must return matching types
		  let score = 85
		  let grade = 
		      if score >= 90 then
		          "Grade A"
		      elif score >= 80 then
		          "Grade B"
		      else
		          "Grade F"
		  ```
	-
	- ## Match Expression (Pattern Matching)
	  collapsed:: true
		- ```fsharp
		  // High-performance structural pattern matching
		  let number = 2
		  let description = 
		      match number with
		      | 1 -> "One"
		      | 2 -> "Two"
		      | _ -> "Many" // wildcard default
		  ```
	-
	- ## Loops
	  collapsed:: true
		- ```fsharp
		  // 1. For Loop (range)
		  for i = 1 to 5 do
		      printfn "Count: %d" i
		      
		  // 2. For...in Loop (Collections)
		  let list = [10; 20; 30] // semicolon separations in lists
		  for element in list do
		      printfn "Element: %d" element
		      
		  // 3. While Loop
		  let mutable count = 0
		  while count < 3 do
		      printfn "While: %d" count
		      count <- count + 1
		  ```
-
- # Functions
	- ## Currying & Lambda Expressions
	  collapsed:: true
		- ```fsharp
		  // All F# functions take exactly one argument and return a function (Currying)
		  let add x y = x + y
		  
		  // Partial Application
		  let addFive = add 5 // returns (y -> 5 + y)
		  
		  // Lambda Expressions (Syntax: fun arg -> expression)
		  let square = fun x -> x * x
		  ```
	-
	- ## Pipeling and Function Composition
	  collapsed:: true
		- ```fsharp
		  // 1. Pipeline Operator (|>) - passes LHS as last argument of RHS function
		  let nums = [1; 2; 3; 4; 5]
		  let sumOfSquares = 
		      nums
		      |> List.filter (fun x -> x % 2 = 0)
		      |> List.map (fun x -> x * x)
		      |> List.sum // 20
		      
		  // 2. Composition Operator (>>) - combines two functions
		  // (f >> g) x is equivalent to g(f(x))
		  let negateAndString = string >> (fun s -> "Negative: " + s)
		  ```
-
- # Algebraic Data Types
	- ## Record Types
	  collapsed:: true
		- ```fsharp
		  // Records are immutable database-like structures with automatic equality checks
		  type User = {
		      Username : string
		      Age      : int
		  }
		  
		  // Instantiate
		  let u1 = { Username = "vr"; Age = 25 }
		  
		  // Copy updating (creates new record)
		  let u2 = { u1 with Age = 26 }
		  ```
	-
	- ## Discriminated Unions (DUs)
	  collapsed:: true
		- ```fsharp
		  // DUs represent sum types (can be one of several cases)
		  type Shape =
		      | Circle of float -- holds radius
		      | Rectangle of float * float -- holds width * height
		      
		  let c = Circle 5.0
		  
		  // Pattern match against DUs
		  let getArea shape =
		      match shape with
		      | Circle r -> Math.PI * r * r
		      | Rectangle (w, h) -> w * h
		  ```
	-
	- ## Option Type
	  collapsed:: true
		- ```fsharp
		  // Option is a DU wrapper representing values that may or may not exist (no nulls)
		  // Option<'T> = Some of 'T | None
		  
		  let divide x y =
		      if y = 0 then None
		      else Some (x / y)
		  ```
-
- # Concurrency & Async
	- ## Async Workflows
	  collapsed:: true
		- ```fsharp
		  // Async blocks create lightweight computation wrappers
		  let fetchUrl(url : string) =
		      async {
		          let client = new System.Net.WebClient()
		          let! html = client.AsyncDownloadString(System.Uri(url)) -- yield wait execution
		          return html.Length
		      }
		  
		  // Execute asynchronously
		  let task = fetchUrl "https://fsharp.org"
		  let size = Async.RunSynchronously task
		  ```
-
- # Build Tools & Project Configuration
	- ## Dotnet CLI
		- F# uses the standard .NET SDK build engine:
		- ```bash
		  # Create new console project
		  dotnet new console -lang "F#" -o my_fsharp_app
		  
		  # Build and compile
		  dotnet build
		  
		  # Run project
		  dotnet run
		  ```
-
- # Useful Libraries & Frameworks
	- [[Fable]] - High-performance compiler transpiling F# code into clean JavaScript code.
	-
	- [[Giraffe]] - Functional micro-web framework running on top of ASP.NET Core.
	-
	- [[FSharp.Data]] - Provides Type Providers for XML, JSON, CSV, and HTML formats.
-
- # More Learn
	- Explore valuable resources for F#:
		-
		- [F# Software Foundation](https://fsharp.org/)
		- [F# for Fun and Profit (Incredibly comprehensive functional guide)](https://fsharpforfunandprofit.com/)
		- [Microsoft F# Documentation Guides](https://docs.microsoft.com/en-us/dotnet/fsharp/)
