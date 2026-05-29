---
seoTitle: Ada Programming Reference – Safe Systems and Real-Time Guide
description: "Comprehensive Ada language reference covering packages, strong typing, tasks (concurrency), generics, exception handling, and safety-critical software patterns."
keywords: "Ada, Ada 2012, SPARK, real-time, safety-critical, tasking, packages, strong typing, syntax reference, cheat sheet, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Ada
---

- # History
	- **How**:
		- **Ada** was commissioned by the **U.S. Department of Defense** (DoD) in the late **1970s** to replace the hundreds of incompatible programming languages then used in embedded military systems.
		- Named after **Ada Lovelace** (the mathematician widely regarded as the first computer programmer).
		- Standardized under key revisions:
			- **Ada 83**: Established the core modular structures, packages, and tasking models.
			- **Ada 95**: Introduced Object-Oriented Programming, protected objects for concurrent synchronization, and standard C library interfaces.
			- **Ada 2005 / 2012 / 2022**: Added contract-based programming (preconditions, postconditions, invariants), iterator loops, and parallel tasks.
		- Today, Ada is the standard language for safety-critical software systems where bugs cost lives: commercial avionics (Boeing/Airbus flight control), railway signaling, space exploration, and defense systems.
	-
	- **Who**:
		- Designed by a team led by **Jean Ichbiah** at CII Honeywell Bull, commissioned by the DoD.
	-
	- **Why**:
		- Created to enforce rigorous compiler-level checks, type safety, modular structures, and embedded real-time concurrent synchronization to guarantee software correctness.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Extreme Type Safety** — Compiler catches logical errors early by validating variable ranges and strict type constraints (e.g. preventing adding meters to feet).
		- **Native Concurrency (Tasking)** — Concurrency is built directly into the language syntax (Tasks and Protected Objects), independent of OS libraries.
		- **Readability & Maintenance** — Pascal-style English syntax avoids cryptic operators, making codebase maintenance over decades highly reliable.
		- **Contract-Based Programming (Ada 2012)** — Embed formal preconditions and postconditions into subprogram interfaces to guarantee runtime behavior.
		- **SPARK Verification** — A formally defined subset of Ada that allows mathematical proofs of program correctness, eliminating runtime exceptions.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Syntax Verbosity** — Heavy boilerplate declarations for packages, types, and parameter modes.
		- **Rigid Compiler Checks** — Very strict compiler rules can make rapid prototyping and loose coding cycles feel frustrating.
		- **Niche Ecosystem** — Few modern libraries for web development, machine learning, or mobile apps compared to C++ or Python.
	-
	- ## Remember Points
	  collapsed:: true
		- **Spec vs. Body** — Code is split between a specification file (`.ads`) declaring interfaces and a body file (`.adb`) implementing logic.
		- **Parameter Modes** — Subprogram arguments declare explicit access: `in` (read-only), `out` (write-only), or `in out` (read-write).
		- **Case-Insensitive** — `Procedure`, `procedure`, and `PROCEDURE` are identical.
-
- # Basics
	- ## Hello World & Output
		- ```ada
		  with Ada.Text_IO; -- Import input-output package
		  
		  procedure Hello is
		  begin
		     -- Put_Line prints text with a trailing newline
		     Ada.Text_IO.Put_Line ("Hello, World!");
		  end Hello;
		  ```
		- `with` imports libraries.
		- `procedure Hello` declares the entry subprogram.
		- `begin ... end Hello;` encloses execution block.
	-
	- ## Variables and Range Constraints
		- ```ada
		  procedure Variables is
		     -- Declarations go in this section before the 'begin' block
		     Age : Integer := 25;
		     Pi  : constant Float := 3.14159;
		     
		     -- Custom Integer Type with strict range constraints
		     type Day_Of_Month is new Integer range 1 .. 31;
		     Today : Day_Of_Month := 28;
		     
		     -- Subtype (retains compatibility with parent type but checks ranges)
		     subtype Working_Hours is Integer range 0 .. 8;
		     Shift : Working_Hours := 8;
		  begin
		     -- Today := Today + 10; -- Will raise Constraint_Error at runtime if value exceeds 31!
		     null; -- Keyword indicating no action (empty statement)
		  end Variables;
		  ```
-
- # Control Flow
	- ## Conditionals: if and case
	  collapsed:: true
		- ```ada
		  if Score >= 90 then
		     Ada.Text_IO.Put_Line ("Grade A");
		  elsif Score >= 80 then
		     Ada.Text_IO.Put_Line ("Grade B");
		  else
		     Ada.Text_IO.Put_Line ("Grade F");
		  end if;
		  
		  -- Case statement (Must be exhaustive!)
		  case Score is
		     when 90 .. 100 =>
		        Ada.Text_IO.Put_Line ("Excellent");
		     when 80 .. 89 =>
		        Ada.Text_IO.Put_Line ("Good");
		     when others =>
		        Ada.Text_IO.Put_Line ("Other");
		  end case;
		  ```
	-
	- ## Loops
	  collapsed:: true
		- ```ada
		  -- 1. Standard Counted Loop (Range is inclusive)
		  for I in 1 .. 5 loop
		     Ada.Text_IO.Put_Line ("Index: " & Integer'Image (I));
		  end loop;
		  
		     -- Image attribute converts integer to printable string
		     
		  -- 2. While Loop
		  while Counter < 3 loop
		     Counter := Counter + 1;
		  end loop;
		  
		  -- 3. Infinite loop with Exit statement
		  loop
		     Counter := Counter - 1;
		     exit when Counter = 0; -- Break loop condition
		  end loop;
		  ```
-
- # Subprograms
	- ## Procedures vs. Functions
	  collapsed:: true
		- Procedures perform tasks and return multiple outputs via parameter modes. Functions return a single value:
		- ```ada
		  -- 1. Procedure definition
		  procedure Calculate (X : in Float; Y : in Float; Result : out Float) is
		  begin
		     Result := X + Y;
		  end Calculate;
		  
		  -- 2. Function definition
		  function Square (Val : in Float) return Float is
		  begin
		     return Val * Val;
		  end Square;
		  
		  -- Parameter Modes:
		  -- in      : Read-only (default if unspecified)
		  -- out     : Write-only (cannot read original value inside)
		  -- in out  : Read-write (can both read and modify value)
		  ```
-
- # Packages (Specification vs. Body)
	- ## Specification file (`.ads`)
	  collapsed:: true
		- Defines the public API interface:
		- ```ada
		  -- math_utils.ads
		  package Math_Utils is
		     -- Public functions
		     function Double (X : in Integer) return Integer;
		     
		  private
		     -- Hidden elements
		     Secret_Multiplier : constant Integer := 2;
		  end Math_Utils;
		  ```
	-
	- ## Body file (`.adb`)
	  collapsed:: true
		- Implements the package interface:
		- ```ada
		  -- math_utils.adb
		  package body Math_Utils is
		     function Double (X : in Integer) return Integer is
		     begin
		        return X * Secret_Multiplier;
		     end Double;
		  end Math_Utils;
		  ```
-
- # Tasking (Concurrency)
	- ## Rendezvous and Protected Objects
	  collapsed:: true
		- Tasks are concurrent units. Communication is handled via **Rendezvous** synchronization:
		- ```ada
		  -- Task specification
		  task type Worker is
		     entry Start (ID : in Integer); -- Entry point
		  end Worker;
		  
		  -- Task body (execution thread)
		  task body Worker is
		     Local_ID : Integer;
		  begin
		     accept Start (ID : in Integer) do
		        Local_ID := ID; -- Rendezvous point (blocks until caller hits entry)
		     end Start;
		     
		     Ada.Text_IO.Put_Line ("Worker running: " & Integer'Image (Local_ID));
		  end Worker;
		  ```
	-
	- ## Protected Objects
	  collapsed:: true
		- Protected objects provide mutual exclusion for shared data:
		- ```ada
		  protected Counter is
		     procedure Increment;
		     function Get return Integer;
		  private
		     Val : Integer := 0;
		  end Counter;
		  
		  protected body Counter is
		     procedure Increment is
		     begin
		        Val := Val + 1; -- Exclusive write lock
		     end Increment;
		     
		     function Get return Integer is
		     begin
		        return Val; -- Shared read lock
		     end Get;
		  end Counter;
		  ```
-
- # Generics
	- ## Parameterized Subprograms
	  collapsed:: true
		- ```ada
		  -- Generic procedure template
		  generic
		     type Element is private; -- generic type argument
		  procedure Swap (X, Y : in out Element);
		  
		  procedure Swap (X, Y : in out Element) is
		     Temp : Element;
		  begin
		     Temp := X;
		     X := Y;
		     Y := Temp;
		  end Swap;
		  
		  -- Instantiation:
		  -- procedure Swap_Int is new Swap (Integer);
		  ```
-
- # Compilation Tools
	- ## GNAT
		- **GNAT**: Part of the GNU Compiler Collection (GCC), the standard Ada compiler.
		- ```bash
		  # Compile Ada program (handles spec and body dependency linking)
		  gnatmake hello.adb
		  
		  # Run executable
		  ./hello
		  ```
-
- # More Learn
	- Explore valuable resources for Ada:
		-
		- [Ada-lang.org (Community portal)](https://learn.adacore.com/)
		- [AdaCore Learning University](https://university.adacore.com/)
		- [Ada Information Clearinghouse](https://www.adaic.org/)
		- [SPARK Proving Tools](https://www.adacore.com/about-spark)
