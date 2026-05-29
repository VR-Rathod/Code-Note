---
seoTitle: Haskell Programming Language – Functional Programming Reference
description: "Haskell reference covering type classes, monads, functors, lazy evaluation, pattern matching, do-notation, and GHC extensions for pure functional programming."
keywords: "Haskell programming, Haskell language, type classes, monads, functors, lazy evaluation, pattern matching, GHC, functional programming, do-notation, syntax reference, cheat sheet, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Haskell
---

- # History
	- **How**:
		- Haskell was first designed in **1987** by a committee of researchers in functional programming, primarily to serve as a standardized language for functional programming.
		- It was developed to overcome the limitations of earlier functional programming languages, emphasizing purity, laziness, and type safety.
		- Haskell was created as a pure functional programming language, meaning that functions are treated as mathematical functions with no side effects. This makes reasoning about programs easier and allows for more reliable and predictable code.
		- Haskell introduced innovations like **lazy evaluation**, **type inference**, and **immutable data** which influenced modern programming languages.
		- While initially not widely adopted in industry, Haskell has remained influential in academia and in certain specialized areas like compilers, financial systems, and research.
	-
	- **Who**:
		- Haskell was named after the mathematician **Haskell Curry**, who made significant contributions to combinatory logic and functional programming theory.
		- The language was designed by a committee of researchers, including **Simon Peyton Jones**, **John Hughes**, **Phil Wadler**, and others.
		- The language and its ecosystem are maintained by the **Haskell Committee**, and the **Haskell Foundation** helps support the community and the development of related tools and libraries.
	-
	- **Why**:
		- Haskell was created to provide a pure, declarative alternative to imperative programming languages like C and Java, offering better tools for building reliable, concurrent, and scalable systems.
		- Its focus on **pure functions**, **lazy evaluation**, and **strong, static typing** makes Haskell a great choice for systems where correctness, maintainability, and performance are critical.
		- It was also developed to explore and push forward the theoretical foundations of computer science, especially in the areas of category theory, lambda calculus, and logic.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Pure Functional Programming** — Functions are pure, meaning they return the same result for the same arguments and have no side effects, making programs highly predictable and easy to reason about.
		- **Lazy Evaluation** — Calculations are deferred until their results are actually needed, enabling infinite data structures and modular program design.
		- **Strong Static Typing & Inference** — Types are checked at compile time, eliminating a massive class of runtime bugs. Haskell's type inference engine automatically deduces types without requiring boilerplate annotations.
		- **Concurrency & Parallelism** — Lightweight thread models, Software Transactional Memory (STM), and pure computations make concurrent programming safe and free from data races.
		- **Expressive Syntax** — Mathematical syntax allowing concise implementation of complex algorithms.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Steep Learning Curve** — Advanced concepts like Monads, Functors, Applicatives, Monad Transformers, and Category Theory can be daunting for developers used to imperative code.
		- **Lazy Evaluation Overhead** — Lazy evaluation can introduce memory leaks (space leaks) if thunks accumulate in memory without being evaluated.
		- **Smaller Ecosystem** — Fewer libraries and frameworks for rapid enterprise web development compared to languages like Java, Python, or Go.
		- **Compilation Speeds** — Large Haskell projects can have long compile times under GHC due to extensive type checking and optimization passes.
	-
	- ## Remember Points
	  collapsed:: true
		- **Pure by Default** — All functions are pure unless explicitly wrapped in the `IO` monad.
		- **Immutable Data** — Variables are bound to values once; they cannot be mutated in place.
		- **Lazy by Default** — Evaluation is deferred until values are forced by an I/O action or pattern match.
-
- # Basics
	- ## Hello World & Entry Point
		- ```haskell
		  module Main where
		  
		  main :: IO ()
		  main = putStrLn "Hello, World!"
		  ```
		- `module Main where` declares the current module as the program entry point.
		- `main :: IO ()` is the type signature of the entry point function. It performs I/O and returns a unit type `()`.
		- `putStrLn` prints a string to the console with a trailing newline.
	-
	- ## Comments
		- ```haskell
		  -- This is a single-line comment.
		  
		  {-
		    This is a multi-line
		    comment block.
		  -}
		  
		  -- | Documentation comment for functions (Haddock style)
		  myFunc :: Int -> Int
		  myFunc x = x + 1
		  ```
	-
	- ## Variables and Local Bindings
		- ```haskell
		  -- Variables in Haskell are immutable binds
		  x :: Int
		  x = 10 
		  
		  -- Local bindings using 'let ... in' (Expression-level binding)
		  calculateArea :: Double -> Double -> Double
		  calculateArea width height =
		    let area = width * height
		    in area
		  
		  -- Local bindings using 'where' (Declaration-level binding)
		  calculateVolume :: Double -> Double -> Double -> Double
		  calculateVolume w h d = area * d
		    where area = w * h
		  ```
	-
	- ## Primitive Data Types Table
		- ```
		  Type        Description
		  Int         Fixed-precision signed integer (usually 64-bit)
		  Integer     Arbitrary-precision signed integer (unbounded size)
		  Float       Single-precision floating-point number
		  Double      Double-precision floating-point number
		  Bool        Boolean value (True or False)
		  Char        Unicode character (written in single quotes, e.g., 'a')
		  String      Alias for [Char] (List of characters)
		  ()          Unit type (contains exactly one value: ())
		  ```
	-
	- ## Operators
	  collapsed:: true
		- ```haskell
		  -- Arithmetic
		  -- +, -, *, / (Fractional division), div (integer division), mod (modulo)
		  x = 5 / 2   -- 2.5 (Fractional)
		  y = 5 `div` 2 -- 2 (Integer division, backticks convert function to infix)
		  
		  -- Relational & Equality
		  -- ==, /= (Not Equal), <, >, <=, >=
		  
		  -- Logical
		  -- &&, ||, not
		  
		  -- List Concatenation & Prepend
		  -- ++ (list concatenation), : (cons/prepend operator)
		  list1 = [1, 2] ++ [3, 4] -- [1, 2, 3, 4]
		  list2 = 1 : [2, 3]        -- [1, 2, 3]
		  
		  -- Function Application & Composition
		  -- $ (Function application with low precedence, replaces parentheses)
		  -- . (Function composition)
		  printVal = print $ 2 + 2 -- same as: print (2 + 2)
		  ```
-
- # Control Flow
	- ## If-Then-Else Expression
	  collapsed:: true
		- ```haskell
		  -- in Haskell, 'if' is an expression that must always return a value
		  -- both the 'then' and 'else' branches are mandatory and must return the same type
		  checkAge :: Int -> String
		  checkAge age = if age >= 18
		                 then "Adult"
		                 else "Minor"
		  ```
	-
	- ## Case Expressions
	  collapsed:: true
		- ```haskell
		  -- Pattern match values directly on expressions
		  describeList :: [a] -> String
		  describeList xs = case xs of
		    []      -> "empty list"
		    [x]     -> "singleton list"
		    (x:y:_) -> "long list"
		  ```
	-
	- ## Guard Equations
	  collapsed:: true
		- ```haskell
		  -- Guards provide a clean way to test conditional properties on arguments
		  bmiTell :: Double -> String
		  bmiTell bmi
		    | bmi <= 18.5 = "Underweight"
		    | bmi <= 25.0 = "Normal"
		    | bmi <= 30.0 = "Overweight"
		    | otherwise   = "Obese"
		  ```
	-
	- ## Recursion
	  collapsed:: true
		- ```haskell
		  -- Since Haskell has no loops, recursion is used for iteration
		  factorial :: Integer -> Integer
		  factorial 0 = 1 -- Base case
		  factorial n = n * factorial (n - 1) -- Recursive case
		  
		  -- Tail-recursive version with accumulator (helps compile to efficient loops)
		  factorialTail :: Integer -> Integer
		  factorialTail n = go n 1
		    where
		      go 0 acc = acc
		      go k acc = go (k - 1) (acc * k)
		  ```
-
- # Functions
	- ## Type Signatures & Currying
	  collapsed:: true
		- ```haskell
		  -- Every function in Haskell takes exactly one argument and returns another function
		  -- This is called Currying.
		  add :: Int -> Int -> Int
		  add x y = x + y
		  
		  -- Partial Application
		  addFive :: Int -> Int
		  addFive = add 5 -- returns a function expecting the second argument
		  ```
	-
	- ## Pattern Matching in Functions
	  collapsed:: true
		- ```haskell
		  -- Destructure patterns directly in parameter definitions
		  first :: (a, b, c) -> a
		  first (x, _, _) = x
		  
		  head' :: [a] -> a
		  head' [] = error "Empty list!"
		  head' (x:_) = x -- extract head and discard tail
		  ```
	-
	- ## Lambdas (Anonymous Functions)
	  collapsed:: true
		- ```haskell
		  -- Syntax: \argument -> expression
		  addLambda = \x y -> x + y
		  
		  doubleList = map (\x -> x * 2) [1, 2, 3] -- [2, 4, 6]
		  ```
	-
	- ## Higher-Order Functions
	  collapsed:: true
		- ```haskell
		  -- Functions that take functions as arguments or return functions
		  applyTwice :: (a -> a) -> a -> a
		  applyTwice f x = f (f x)
		  
		  -- applyTwice (+3) 10 -> 16
		  ```
	-
	- ## Function Composition & Application
	  collapsed:: true
		- ```haskell
		  -- Function composition: (f . g) x = f (g x)
		  -- Function application: f $ x = f x
		  
		  negateAndSum :: [Int] -> Int
		  negateAndSum = negate . sum -- clean, point-free style (no arguments declared)
		  
		  -- $ avoids nested parentheses
		  val = putStrLn $ show $ sum [1..10]
		  ```
-
- # Custom Data Types
	- ## Type Synonyms
	  collapsed:: true
		- ```haskell
		  -- Creates an alias for an existing type (no new type constructed)
		  type PhoneNumber = String
		  type Name = String
		  type PhoneBook = [(Name, PhoneNumber)]
		  ```
	-
	- ## Algebraic Data Types (ADT)
	  collapsed:: true
		- ```haskell
		  -- 1. Sum Type (enumerations)
		  data Direction = North | South | East | West
		  
		  -- 2. Product Type (records/structs)
		  data Point = Point Double Double -- constructor and arguments
		  
		  -- 3. Sum of Products with Record Syntax (named fields)
		  data Person = Person {
		    name :: String,
		    age  :: Int
		  } deriving (Show, Eq)
		  
		  -- Automatic getters generated:
		  -- name :: Person -> String
		  -- age  :: Person -> Int
		  ```
	-
	- ## Newtype (Zero-overhead Type Wrapping)
	  collapsed:: true
		- ```haskell
		  -- Wraps exactly one type at compile-time for safety, erased at runtime
		  newtype CustomerId = CustomerId Int
		  ```
-
- # Type Classes
	- ## Built-in Type Classes
	  collapsed:: true
		- ```haskell
		  -- Type classes define interfaces for types.
		  -- Eq      - Defines equality (==, /=)
		  -- Ord     - Defines ordering (<, >, <=, >=, compare)
		  -- Show    - Defines string formatting (show)
		  -- Read    - Defines parsing from string (read)
		  -- Num     - Mathematical operations (+, -, *, abs)
		  
		  -- Deriving classes automatically
		  data Color = Red | Blue | Green
		    deriving (Show, Eq, Ord)
		  ```
	-
	- ## Defining Custom Type Classes
	  collapsed:: true
		- ```haskell
		  class Printable a where
		    printMe :: a -> String
		    
		  -- Implement Type Class Instance
		  instance Printable Int where
		    printMe x = "Integer: " ++ show x
		    
		  instance Printable String where
		    printMe s = "String: " ++ s
		  ```
-
- # Functors, Applicatives & Monads
	- ## Functor
	  collapsed:: true
		- ```haskell
		  -- A Functor represents context that can be mapped over.
		  -- fmap :: (a -> b) -> f a -> f b
		  -- Infix operator: <$>
		  
		  x :: Maybe Int
		  x = (+3) <$> Just 5 -- Just 8
		  
		  y :: Maybe Int
		  y = (+3) <$> Nothing -- Nothing
		  ```
	-
	- ## Applicative
	  collapsed:: true
		- ```haskell
		  -- Applicatives allow applying functions wrapped in contexts to values wrapped in contexts.
		  -- pure :: a -> f a
		  -- (<*>) :: f (a -> b) -> f a -> f b
		  
		  res = Just (+) <*> Just 5 <*> Just 3 -- Just 8
		  ```
	-
	- ## Monads & Do-Notation
	  collapsed:: true
		- ```haskell
		  -- Monads sequence operations, handling side effects (errors, I/O, state).
		  -- (>>=) :: m a -> (a -> m b) -> m b -- Bind Operator
		  -- return :: a -> m a
		  
		  -- Standard bind syntax
		  half :: Int -> Maybe Int
		  half x = if even x then Just (x `div` 2) else Nothing
		  
		  val = Just 20 >>= half >>= half -- Just 5
		  
		  -- Do-notation (Syntactic sugar for Monad bind operations)
		  getUserInfo :: Maybe (String, Int)
		  getUserInfo = do
		    name <- Just "Alice"
		    age  <- Just 30
		    return (name, age)
		  ```
-
- # Lazy Evaluation
	- ## Thunks & Lazy Semantics
		- Haskell stores expressions in memory as **thunks** (unevaluated expressions wrapped in pointers).
		- An expression is only evaluated to "Weak Head Normal Form" (WHNF) when forced by I/O operations or pattern matching.
		- ```haskell
		  -- Infinite list definition (safe under lazy evaluation)
		  infiniteOnes = 1 : infiniteOnes
		  
		  -- Take first 5 elements (evaluates only what is needed)
		  firstFive = take 5 infiniteOnes -- [1, 1, 1, 1, 1]
		  ```
	-
	- ## Strictness Control
		- To avoid memory leaks (space leaks caused by thunk accumulation), you can force eager evaluation:
		- ```haskell
		  -- 1. seq function (forces evaluation of first arg before returning second)
		  sumStrict :: Int -> [Int] -> Int
		  sumStrict acc []     = acc
		  sumStrict acc (x:xs) = let nextAcc = acc + x
		                         in nextAcc `seq` sumStrict nextAcc xs
		                         
		  -- 2. strict application operator ($!)
		  result = f $! x -- forces x before applying f
		  
		  -- 3. Bang Patterns (Requires GHC Extension BangPatterns)
		  sumBang :: Int -> [Int] -> Int
		  sumBang !acc []     = acc -- forces evaluation of acc
		  sumBang !acc (x:xs) = sumBang (acc + x) xs
		  ```
-
- # Exception Handling
	- ## Pure Exceptions
		- ```haskell
		  -- throwing pure errors (dangerous, causes crash on evaluation)
		  divide :: Int -> Int -> Int
		  divide _ 0 = error "Division by zero!"
		  divide x y = x `div` y
		  ```
	-
	- ## Impure Exceptions (IO Monad)
		- ```haskell
		  import Control.Exception
		  
		  readAndHandle :: IO ()
		  readAndHandle = do
		    result <- try (readFile "non_existent.txt") :: IO (Either IOException String)
		    case result of
		      Left  ex       -> putStrLn $ "Caught file error: " ++ show ex
		      Right contents -> putStrLn contents
		  ```
-
- # Concurrency & Parallelism
	- ## Green Threads & MVars
	  collapsed:: true
		- ```haskell
		  import Control.Concurrent
		  
		  main :: IO ()
		  main = do
		    mvar <- newEmptyMVar -- Synced communication variable (like a blocking box)
		    
		    -- Fork lightweight thread
		    forkIO $ do
		      threadDelay 1000000 -- microseconds (1s)
		      putMVar mvar "Worker finished"
		      
		    print "Waiting for worker..."
		    val <- takeMVar mvar -- Blocks until variable populated
		    print val
		  ```
	-
	- ## Software Transactional Memory (STM)
	  collapsed:: true
		- ```haskell
		  import Control.Concurrent.STM
		  
		  -- STM guarantees atomic transaction blocks, preventing deadlocks & race conditions
		  transfer :: TVar Int -> TVar Int -> Int -> STM ()
		  transfer fromAcc toAcc amount = do
		    fromBal <- readTVar fromAcc
		    if fromBal < amount
		      then retry -- Aborts transaction and waits for TVar change to retry
		      else do
		        writeTVar fromAcc (fromBal - amount)
		        toBal <- readTVar toAcc
		        writeTVar toAcc (toBal + amount)
		        
		  executeTransfer :: TVar Int -> TVar Int -> Int -> IO ()
		  executeTransfer from to amt = atomically $ transfer from to amt
		  ```
-
- # File I/O
	- ## Lazy I/O vs Strict I/O
	  collapsed:: true
		- ```haskell
		  import System.IO
		  import qualified Data.Text.IO as TIO
		  
		  main :: IO ()
		  main = do
		    -- Standard lazy write/read
		    writeFile "output.txt" "First line\nSecond line\n"
		    
		    contents <- readFile "output.txt"
		    -- file handles stay open lazily until string evaluated
		    putStr contents
		    
		    -- Strict Text I/O (recommended to avoid file lock leaks)
		    strictText <- TIO.readFile "output.txt"
		    TIO.putStr strictText
		  ```
-
- # Modules & Imports
	- ## Module Declarations
	  collapsed:: true
		- ```haskell
		  -- Geometry.hs
		  module Geometry (
		    sphereVolume,
		    sphereArea
		  ) where
		  
		  sphereVolume :: Double -> Double
		  sphereVolume radius = (4.0 / 3.0) * pi * (radius ^ 3)
		  
		  sphereArea :: Double -> Double
		  sphereArea radius = 4 * pi * (radius ^ 2)
		  ```
	-
	- ## Import Syntax
	  collapsed:: true
		- ```haskell
		  import Data.List -- Import all functions
		  import Data.Map (lookup, insert) -- Selective import
		  import Data.Set hiding (null) -- Hide specific name collisions
		  import qualified Data.Text as T -- Namespace alias
		  ```
-
- # Advanced Haskell
	- ## GHC Extensions
	  collapsed:: true
		- Haskell compilers support language extensions declared at the top of the file:
		- ```haskell
		  {-# LANGUAGE OverloadedStrings #-} -- Allows String literals to match Text/ByteString types
		  {-# LANGUAGE BangPatterns #-} -- Allows bang (!) patterns for strictness
		  {-# LANGUAGE MultiParamTypeClasses #-} -- Type classes with multiple parameters
		  {-# LANGUAGE GeneralizedNewtypeDeriving #-} -- Automatic deriving of underlying types for newtypes
		  ```
	-
	- ## Foreign Function Interface (FFI)
	  collapsed:: true
		- ```haskell
		  {-# LANGUAGE ForeignFunctionInterface #-}
		  module Main where
		  
		  import Foreign.C.Types
		  
		  -- Call external C function
		  foreign import ccall "sin" c_sin :: CDouble -> CDouble
		  
		  main :: IO ()
		  main = print $ c_sin 1.0
		  ```
-
- # Build Tools & Ecosystem
	- ## Compiler and Tooling Commands
		- **GHC (Glasgow Haskell Compiler)**: Compile source files.
		- **GHCi**: The interactive Haskell REPL shell.
		- **Stack / Cabal**: Package managers and build tool ecosystems.
		- ```bash
		  # Run GHCi shell
		  ghci
		  
		  # Compile file to native executable
		  ghc Main.hs -o main
		  
		  # Create new Stack project
		  stack new my-project
		  stack build
		  stack run
		  ```
-
- # Miscellaneous
	- ## Pattern Matching Guards & Destructuring
	  collapsed:: true
		- ```haskell
		  -- Extract values using pattern matching
		  let (x, y) = (1, 2) -- x=1, y=2
		  let (h:t)  = [1, 2, 3] -- h=1, t=[2, 3]
		  
		  -- as-patterns (captures both the split parts and the overall structure)
		  firstLetter :: String -> String
		  firstLetter allVal@(c:_) = "First letter of " ++ allVal ++ " is " ++ [c]
		  ```
-
- # Useful Libraries & Frameworks
	- [[Yesod]] - High-performance Type-safe Haskell Web Framework.
	-
	- [[Servant]] - Type-level web DSL for writing REST APIs.
	-
	- [[Aeson]] - High-performance JSON parsing library.
	-
	- [[Lens]] - Declarative getter/setter structures for complex nested objects.
	-
	- [[QuickCheck]] - Automatic property-based test generation library.
-
- # More Learn
	- Explore valuable resources for Haskell:
		-
		- [Haskell.org](https://www.haskell.org/)
		- [Learn You a Haskell for Great Good!](http://learnyouahaskell.com/)
		- [Real World Haskell](http://book.realworldhaskell.org/)
		- [Hoogle (Haskell API Search Engine)](https://hoogle.haskell.org/)
		- [Haskell Roadmap](https://github.com/ghc-proposals/ghc-proposals)