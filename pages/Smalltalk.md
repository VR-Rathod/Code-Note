---
seoTitle: Smalltalk Reference – Pure Object-Oriented Syntax Guide
description: "Comprehensive Smalltalk reference covering message passing (unary, binary, keyword), classes, blocks (closures), cascades, and image-based programming."
keywords: "Smalltalk, OOP, Pharo, Squeak, message passing, cascades, blocks, closures, image-based, syntax reference, cheat sheet, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Smalltalk
---

- # History
	- **How**:
		- **Smalltalk** was created by **Alan Kay**, **Dan Ingalls**, and **Adele Goldberg** at **Xerox PARC** in the **1970s**.
		- It was designed as a complete software environment and OS, pioneering graphical user interfaces (GUIs), mouse-driven windowing, and the Model-View-Controller (MVC) design pattern.
		- Standardized across major releases: Smalltalk-72, Smalltalk-76, and the famous **Smalltalk-80**, which was open-sourced and influenced all modern Object-Oriented languages (such as Ruby, Objective-C, Java, and Python).
		- Smalltalk established the concept of **"pure Object-Oriented Programming"** where everything (including numbers, boolean structures, classes, and compile scopes) is a first-class object, communicating solely via **message passing**.
	-
	- **Who**:
		- **Alan Kay** (conceived the actor/object concepts), **Dan Ingalls** (implemented the code virtual machines), and **Adele Goldberg** (led the documentation and design team).
	-
	- **Why**:
		- Created to design a user-centric computing environment where software can be dynamically composed, debugged, and modified live during execution.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Pure Object Orientation** — Absolute consistency. No raw primitives; numbers like `5` and boolean states like `true` are regular objects with methods.
		- **Dynamic Live Debugging (The Image Model)** — Code runs in a persistent memory state ("The Image"). Execution can be paused, edited, and resumed mid-crash without restarting the process.
		- **Elegant, Minimalist Syntax** — The syntax is incredibly small, fitting on a post-card. Message sending rules govern all logic.
		- **First-Class Blocks (Closures)** — Code blocks are objects, enabling powerful, custom control flow architectures (like custom loops or error checks).
	-
	- ## Disadvantages
	  collapsed:: true
		- **Non-traditional File Layout** — Standard Smalltalk tools store code in a binary image rather than text files, which can make git versioning and command-line deployments challenging.
		- **Small Modern Ecosystem** — Limited catalog of libraries for web development or cloud integrations compared to languages like Python or JavaScript.
		- **Dynamic Execution Overhead** — Dynamic message dispatching is slower than statically compiled function calls.
	-
	- ## Remember Points
	  collapsed:: true
		- **Messages, Not Methods** — You do not call methods; you send messages to objects. The object decides how to process the selector.
		- **Message Precedence Rules** — Unary messages evaluate first, then binary, then keyword messages. Parentheses override order.
		- **Return Expression** — The caret `^` returns values from methods. Without `^`, the method implicitly returns `self`.
-
- # Basics
	- ## Hello World & Output
		- ```smalltalk
		  "This is a comment in Smalltalk (wrapped in double quotes)"
		  
		  "Transcript is the standard output logging window"
		  Transcript show: 'Hello, World!'; cr.
		  ```
		- Single quotes `'hello'` declare literal string objects.
		- Semicolon `;` cascades multiple messages to the same receiver object.
	-
	- ## Variables and Assignments
		- ```smalltalk
		  "1. Declaring Local Variables (enclosed in vertical pipes |)"
		  | name age |
		  
		  "2. Assignment (:=)"
		  name := 'VR Rathod'.
		  age := 25.
		  
		  "3. Literal Objects:"
		  "Numbers:"
		  10. "Integer"
		  3.14. "Float"
		  (2/3). "Fractional object representing exactly two-thirds"
		  
		  "Array literal:"
		  #( 1 2 3 'four' )
		  ```
-
- # Message Passing Types
	- ## Unary Messages (No Arguments)
	  collapsed:: true
		- ```smalltalk
		  "Syntax: receiver selector"
		  5 negated. -- Returns -5
		  'hello' size. -- Returns 5
		  ```
	-
	- ## Binary Messages (Operators)
	  collapsed:: true
		- ```smalltalk
		  "Syntax: receiver operator argument"
		  3 + 4. -- Returns 7
		  'hello', ' world'. -- Concatenation returns 'hello world'
		  ```
	-
	- ## Keyword Messages (Multi-Arguments)
	  collapsed:: true
		- ```smalltalk
		  "Syntax: receiver key1: arg1 key2: arg2"
		  "at:put: is a single selector taking two arguments"
		  myArray at: 1 put: 'first'. 
		  
		  'hello' copyFrom: 1 to: 3. -- Returns 'hel'
		  ```
	-
	- ## Precedence and Cascades
	  collapsed:: true
		- ```smalltalk
		  "1. Precedence: Unary > Binary > Keyword (evaluated left to right)"
		  2 + 3 raisedTo: 2 negated. 
		  "Evaluated as:"
		  "  2 negated -> -2"
		  "  2 + 3 -> 5"
		  "  5 raisedTo: -2 -> 0.04"
		  
		  "2. Cascades (;): Send multiple messages to the same receiver"
		  Transcript 
		    show: 'Line 1';
		    cr;
		    show: 'Line 2'. -- sends show:, cr, and show: to Transcript
		  ```
-
- # Control Flow via Messages
	- ## Conditionals
	  collapsed:: true
		- In Smalltalk, conditionals are regular keyword messages sent to Boolean objects (`true`/`false`):
		- ```smalltalk
		  "ifTrue:ifFalse: is a message sent to (score >= 90)"
		  (score >= 90)
		      ifTrue: [ Transcript show: 'Grade A' ]
		      ifFalse: [ Transcript show: 'Grade F' ].
		  ```
	-
	- ## Loops
	  collapsed:: true
		- Loops are also implemented by sending messages to numbers or blocks:
		- ```smalltalk
		  "1. Times Loop"
		  5 timesRepeat: [ Transcript show: 'Looping'; cr ].
		  
		  "2. Counter Loop (to:do:)"
		  1 to: 5 do: [ :i |
		      Transcript show: i printString; cr.
		  ].
		  
		  "3. While Loop (whileTrue: sent to condition block)"
		  [ counter < 3 ] whileTrue: [
		      counter := counter + 1.
		  ].
		  ```
-
- # Blocks (Closures)
	- ## Code Block Evaluations
	  collapsed:: true
		- Blocks are deferred execution closure objects:
		- ```smalltalk
		  "1. Block definition: [ :args | expressions ]"
		  | addBlock |
		  addBlock := [ :a :b | a + b ].
		  
		  "2. Evaluate using value: selector"
		  result := addBlock value: 10 value: 20. -- returns 30
		  
		  "3. Caret Return (exits containing method, not just block scope)"
		  myMethod
		      [ ^ 'Early Exit' ] value.
		      ^ 'Default Return' -- Never reached if block evaluates
		  ```
-
- # Class Definitions
	- ## Creating Classes & Methods
	  collapsed:: true
		- Classes are created dynamically by sending messages to parent classes:
		- ```smalltalk
		  "1. Class Declaration"
		  Object subclass: #Person
		      instanceVariableNames: 'name age'
		      classVariableNames: ''
		      package: 'App-Model'
		  
		  "2. Method Definition (Accessors)"
		  name: aString
		      name := aString.
		      
		  name
		      ^ name.
		  ```
-
- # Runtimes & Environments
	- ## Image-based concept
		- **The Image**: A binary snapshot of memory containing all active objects, classes, and execution state. Saved dynamically to disk (`.image`).
		- **Pharo**: Modern, open-source Smalltalk IDE and virtual machine.
		- **Squeak**: Multimedia-rich open-source Smalltalk dialect.
		- ```bash
		  # Run Pharo image headlessly from terminal executing script file
		  pharo Pharo.image eval "Transcript show: 'CLI Smalltalk'; cr"
		  ```
-
- # More Learn
	- Explore valuable resources for Smalltalk:
		-
		- [Pharo.org (Modern Smalltalk ecosystem)](https://pharo.org/)
		- [Pharo by Example (Free PDF book)](http://books.pharo.org/)
		- [Squeak.org](https://squeak.org/)
		- [GNU Smalltalk](https://www.gnu.org/software/smalltalk/)
