---
seoTitle: OCaml Programming Reference – Pragmatic Functional Language Guide
description: "Comprehensive OCaml language reference covering algebraic data types, pattern matching, type inference, functors, modules, and imperative features."
keywords: "OCaml, functional programming, pattern matching, algebraic data types, modules, functors, polymorphic variants, syntax reference, cheat sheet, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: OCaml
---

- # History
	- **How**:
		- **OCaml** (Objective Caml) was created by **Xavier Leroy** and a team at **INRIA** (French National Institute for Research in Digital Science and Technology) in **1996**. It evolved as an extension of the **Caml** language (which itself was derived from the ML programming language family).
		- Key milestones:
			- 1996: First release, integrating object-oriented features with functional Caml.
			- 2000s: Gained significant traction in compiler design, theorem proving (Coq is written in OCaml), and financial systems.
			- 2016: ReasonML was introduced by Facebook, offering a JavaScript-like syntax wrap over OCaml targeting the Web ecosystem.
			- 2022: Release of **OCaml 5.0**, introducing native shared-memory parallel execution (Multicore OCaml) and effect handlers.
	-
	- **Who**:
		- **Xavier Leroy** (lead designer) and the INRIA compiler design team.
	-
	- **Why**:
		- Developed to create a high-performance, pragmatic programming language that combines strong static typing with object-oriented extensions, safety, and rapid execution speeds.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Exceptional Execution Speeds** — Compiles directly to highly optimized native machine assembly (x86/ARM), making it much faster than VM-based languages.
		- **Sound Type System** — Strict type safety with advanced algebraic structures, catching data bugs before compilation completes.
		- **Type Inference** — The compiler deduces virtually all types without requiring verbose manual declarations.
		- **Expressive Module System** — Modular signatures, structures, and **Functors** (functions taking modules as arguments to yield new modules) allow clean architecture design.
		- **Pragmatic Paradigm** — Functional by default, but allows local imperative logic (mutability, loops) when needed for performance optimization.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Idiosyncratic Syntax** — The use of double semicolons `;;` in REPLs, and distinct operators for integer vs float math (e.g. `+` vs `+.`) can be annoying for beginners.
		- **Single-core Legacy** — Until version 5.0, OCaml's runtime utilized a global lock, restricting multi-threaded execution to single CPU cores.
		- **Small Ecosystem Outside Tooling** — Highly specialized for compilers, databases, and financial engines, but has fewer packages for general GUI or web app creation compared to JavaScript or Python.
	-
	- ## Remember Points
	  collapsed:: true
		- **Distinct Operators** — Floats use dot-suffixed operators: `+` for integers, `+.` for floats.
		- **Immutability is Default** — Variables bound using `let` are immutable. Mutability requires using explicit `ref` types.
		- **Expressions Everywhere** — Like other functional languages, code structures evaluate to values.
-
- # Basics
	- ## Hello World & Output
		- ```ocaml
		  (* This is a comment in OCaml *)
		  
		  let () =
		    print_endline "Hello, World!"
		  ```
		- Comments are wrapped in `(* *)`.
		- `print_endline` prints a string with a trailing newline.
		- `let () =` patterns the entry block return state against unit `()`.
	-
	- ## Variables and Value Binding
		- ```ocaml
		  // 1. Immutable Value Binding (let)
		  let name = "VR Rathod"
		  let age = 25
		  
		  // 2. Distinct Math Operators:
		  let sum_int = 5 + 2 // 7
		  let sum_float = 5.0 +. 2.5 // 7.5
		  
		  // 3. Mutable References (ref)
		  let counter = ref 0
		  let () =
		    counter := !counter + 1; // '!value' reads reference, ':=' updates state
		    print_int !counter
		  ```
-
- # Control Flow
	- ## Conditionals: if-then-else
	  collapsed:: true
		- ```ocaml
		  // if-then-else is an expression. Both branches must evaluate to the same type.
		  let status = 
		    if age >= 18 then 
		      "Adult" 
		    else 
		      "Minor"
		  ```
	-
	- ## Pattern Matching (match-with)
	  collapsed:: true
		- ```ocaml
		  let number = 2
		  let word = 
		    match number with
		    | 1 -> "one"
		    | 2 -> "two"
		    | _ -> "many" // wildcard default
		  ```
	-
	- ## Loops (Imperative Constructs)
	  collapsed:: true
		- ```ocaml
		  // 1. For Loop
		  let () =
		    for i = 1 to 5 do
		      print_int i
		    done
		    
		  // 2. While Loop
		  let counter = ref 0 in
		  while !counter < 3 do
		    print_endline "Looping";
		    incr counter // increments ref by 1
		  done
		  ```
-
- # Functions
	- ## Currying & Pipeline Operator
	  collapsed:: true
		- ```ocaml
		  // Curried function by default
		  let add x y = x + y
		  let add_five = add 5
		  
		  // Lambdas (Anonymous functions)
		  let square = fun x -> x * x
		  
		  // Tail Recursion (Requires 'rec' keyword)
		  let rec factorial n acc =
		    if n <= 1 then acc
		    else factorial (n - 1) (acc * n)
		    
		  // Pipeline Operator (|>)
		  let result = 
		    [1; 2; 3; 4]
		    |> List.filter (fun x -> x mod 2 = 0)
		    |> List.map (fun x -> x * x)
		    |> List.fold_left (+) 0
		  ```
-
- # Algebraic Data Types
	- ## Record Types
	  collapsed:: true
		- ```ocaml
		  // Records are immutable structures with explicit field checks
		  type user = {
		    username : string;
		    mutable score : int; // fields can be marked mutable
		  }
		  
		  let u1 = { username = "vr"; score = 100 }
		  let () = u1.score <- u1.score + 10 -- Updates mutable field state
		  ```
	-
	- ## Variants (Sum Types)
	  collapsed:: true
		- ```ocaml
		  type shape =
		    | Circle of float -- holds radius value
		    | Rect of float * float -- holds width * height tuple
		    
		  let get_area s =
		    match s with
		    | Circle r -> 3.14159 *. r *. r
		    | Rect (w, h) -> w *. h
		  ```
	-
	- ## Option Type
	  collapsed:: true
		- ```ocaml
		  // Built-in variant wrapper representing safe null state
		  // type 'a option = None | Some of 'a
		  
		  let safe_divide x y =
		    if y = 0 then None
		    else Some (x / y)
		  ```
-
- # Modules & Functors
	- ## Signatures & Structures
	  collapsed:: true
		- ```ocaml
		  // 1. Signature (Interface definition)
		  module type MathSig = sig
		    val double : int -> int
		  end
		  
		  // 2. Structure (Module implementation)
		  module MathImpl : MathSig = struct
		    let double x = x * 2
		  end
		  ```
	-
	- ## Functors (Parameterized Modules)
	  collapsed:: true
		- ```ocaml
		  // A Functor is a module that accepts other modules as parameters:
		  module type Printable = sig
		    type t
		    val to_string : t -> string
		  end
		  
		  module MakePrinter (P : Printable) = struct
		    let print_val x = print_endline (P.to_string x)
		  end
		  ```
-
- # Build Tools & Package Managers
	- ## OPAM and Dune
		- **OPAM**: The standard package manager for OCaml.
		- **Dune**: High-performance, build system for OCaml projects.
		- ```bash
		  # Initialize project directory template using dune
		  dune init proj my_ocaml_project
		  
		  # Compile project
		  dune build
		  
		  # Run compiled executable
		  dune exec my_ocaml_project
		  ```
-
- # More Learn
	- Explore valuable resources for OCaml:
		-
		- [OCaml.org (Official portal)](https://ocaml.org/)
		- [Real World OCaml (Comprehensive framework guide)](https://realworldocaml.org/)
		- [OCaml Tutorials (Cornell University)](https://cs3110.github.io/textbook/chapters/intro/3110.html)
		- [ReasonML (Alternative JS syntax wrap)](https://reasonml.github.io/)
