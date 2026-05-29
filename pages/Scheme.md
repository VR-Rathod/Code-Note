---
seoTitle: Scheme Programming Reference – Lisp Dialect Guide
description: "Comprehensive Scheme language reference covering S-expressions, dynamic typing, closures, recursion, tail-call optimization, macros (syntax-rules), and continuations."
keywords: "Scheme, Lisp, S-expressions, functional programming, macros, continuations, tail-call optimization, R5RS, R7RS, syntax reference, cheat sheet, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Scheme
---

- # History
	- **How**:
		- **Scheme** was created by **Guy L. Steele** and **Gerald Jay Sussman** in **1975** at the MIT Artificial Intelligence Laboratory.
		- Developed as a minimalist dialect of **Lisp**, it was designed to explore the actor model of computation and study lexical scoping rules.
		- Standardized across major revisions, notably **R5RS** (Revised^5 Report on the Algorithmic Language Scheme, widely regarded as the classic minimalist standard) and **R7RS** (offering modern modular library structures).
		- Scheme introduced two critical innovations to the Lisp family: **lexical scoping** (enabling modular closures) and a strict requirement for **tail-call optimization (TCO)**.
	-
	- **Who**:
		- **Guy L. Steele** and **Gerald Jay Sussman** (creators).
	-
	- **Why**:
		- Developed to create a clean, simple, and mathematically elegant programming language with a minimal set of core primitives that can easily express complex computational patterns.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Minimalist Core** — The entire standard language consists of only a few core concepts and primitives, making it exceptionally easy to learn and modify.
		- **Hygienic Macro System** — Unlike C-style preprocessors, Scheme's `syntax-rules` macros prevent variable name conflicts (variable capture) automatically.
		- **Tail-Call Optimization (TCO)** — The standard guarantees that recursive tail calls run in constant stack space, allowing recursion to act as efficient loops.
		- **First-Class Continuations** — Using `call/cc`, programmers can save and restore the execution state of the program at any point, enabling custom thread pools and exception handlers.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Readability (Nested Parentheses)** — The heavy prefix notation and nesting of parentheses (`(((x)))`) can be visually difficult to parse.
		- **Fragmented Implementations** — Scheme has many different implementations (Racket, Chicken, Guile, Chez), each adding incompatible library systems and extensions.
		- **Dynamic Typing Errors** — Type mismatches are caught only during execution, requiring extensive test coverage.
	-
	- ## Remember Points
	  collapsed:: true
		- **Prefix Notation** — Operations are written before their arguments: `(+ 2 3)` instead of `2 + 3`.
		- **Homoiconicity** — Code is formatted in standard data structures (Lists), meaning code can be processed and generated directly as data.
		- **Boolean Values** — `#t` represents True, `#f` represents False.
-
- # Basics
	- ## Hello World & Output
		- ```scheme
		  ; This is a single-line comment in Scheme
		  
		  ; display prints output to console
		  (display "Hello, World!")
		  (newline) ; prints newline
		  ```
		- Prefix notation is used: `(operator arg1 arg2 ...)`.
		- Semicolon `;` begins comments.
	-
	- ## Variables and Data Types
		- ```scheme
		  ; 1. Global Definitions (define)
		  (define name "VR Rathod")
		  (define age 25)
		  
		  ; 2. Mutating Variables (set!)
		  (set! age 26) ; Updates age to 26
		  
		  ; 3. Core Types:
		  ; Symbols (unique, immutable identifiers prefixed by quote)
		  (define status 'success)
		  
		  ; Lists (linked lists of pairs)
		  (define colors '(red green blue))
		  ```
-
- # Local Bindings (let, let*, letrec)
	- ## Scope Declarations
	  collapsed:: true
		- In Scheme, local variables are bound within a `let` block structure:
		- ```scheme
		  ; 1. let: binds variables in parallel (variables cannot reference each other)
		  (let ((x 10)
		        (y 20))
		    (+ x y)) ; returns 30
		    
		  ; 2. let*: binds variables sequentially (y can reference x)
		  (let* ((x 5)
		         (y (* x 2)))
		    (+ x y)) ; returns 15
		    
		  ; 3. letrec: binds variables recursively (useful for local recursive functions)
		  (letrec ((factorial (lambda (n)
		                        (if (<= n 1)
		                            1
		                            (* n (factorial (- n 1)))))))
		    (factorial 5)) ; returns 120
		  ```
-
- # Control Flow
	- ## Conditionals: if, cond
	  collapsed:: true
		- ```scheme
		  ; 1. IF expression: (if condition then-expr else-expr)
		  (if (>= age 18)
		      (display "Adult")
		      (display "Minor"))
		      
		  ; 2. COND (Switch-case equivalent)
		  (cond ((< age 13) (display "Child"))
		        ((< age 20) (display "Teenager"))
		        (else (display "Adult")))
		  ```
	-
	- ## Loops via Recursion (Tail-Call Optimization)
	  collapsed:: true
		- Scheme does not have traditional `for` or `while` loop constructs. Iteration is performed using recursion:
		- ```scheme
		  ; Named let - binds loop parameter values recursively
		  (let loop ((count 1))
		    (if (<= count 5)
		        (begin
		          (display count)
		          (newline)
		          (loop (+ count 1))) ; recursive tail-call
		        (display "Finished")))
		  ```
-
- # Functions & Closures
	- ## lambda and Higher-Order Functions
	  collapsed:: true
		- ```scheme
		  ; Declaring lambda: (lambda (params) body)
		  (define add (lambda (a b) (+ a b)))
		  
		  ; Shorthand function definition:
		  (define (subtract a b) (- a b))
		  
		  ; Higher-Order Functions
		  (define nums '(1 2 3 4))
		  
		  ; map
		  (define doubled (map (lambda (x) (* x 2)) nums)) ; '(2 4 6 8)
		  
		  ; filter
		  (define evens (filter even? nums)) ; '(2 4)
		  ```
-
- # Pairs & Lists
	- ## List Operations
	  collapsed:: true
		- Lists are constructed using nested **Pairs** (cons cells).
		- ```scheme
		  ; cons: creates a pair cell -> (head . tail)
		  (define p (cons 1 2)) ; (1 . 2)
		  
		  ; car: extracts first element of pair
		  (car p) ; 1
		  
		  ; cdr: extracts second element of pair (tail)
		  (cdr p) ; 2
		  
		  ; Lists are chains of pairs ending with empty list '()
		  (define my-list (cons 10 (cons 20 '()))) ; '(10 20)
		  
		  (car my-list) ; 10
		  (cdr my-list) ; '(20)
		  ```
-
- # Hygienic Macros
	- ## compile-time translations
	  collapsed:: true
		- ```scheme
		  ; define-syntax and syntax-rules create pattern-matching compiler macros
		  (define-syntax my-unless
		    (syntax-rules ()
		      ((_ condition body)
		       (if (not condition)
		           body))))
		           
		  ; Usage:
		  (my-unless (= age 0) (display "Age is not zero"))
		  ```
-
- # First-Class Continuations
	- ## call-with-current-continuation (call/cc)
	  collapsed:: true
		- ```scheme
		  ; call/cc captures the current execution stack pointer and passes it as a function argument
		  (define exit-continuation #f)
		  
		  (define (search-list val lst)
		    (call/cc (lambda (k)
		               (set! exit-continuation k) ; k represents execution exit route
		               (for-each (lambda (x)
		                           (if (= x val)
		                               (k #t))) ; exits immediately returning #t
		                         lst)
		               #f)))
		  ```
-
- # More Learn
	- Explore valuable resources for Scheme:
		-
		- [Scheme.org (Official portal)](https://scheme.org/)
		- [Structure and Interpretation of Computer Programs (SICP)](https://mitpress.mit.edu/sites/default/files/sicp/index.html)
		- [Racket Language (Modern Scheme/Lisp ecosystem)](https://racket-lang.org/)
		- [Chicken Scheme Compiler](http://call-cc.org/)
