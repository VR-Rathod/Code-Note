---
date: 2024-10-30T16:21:44-07:00
lastmod: 2026-04-06T17:35:35+05:30

seoTitle: Python Programming Reference – Modern Python Syntax and Features
description: "Comprehensive Python reference covering syntax, OOP, functional programming, decorators, generators, async/await, type hints, comprehensions, and Python 3.10+ features."
keywords: "python, Python programming, Python reference, OOP, decorators, generators, async await, type hints, list comprehensions, Python 3, python cheatsheet, python guide, python tutorial, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Python
---

- # History
- **How**:
	- Developed by **Guido van Rossum** in the late 1980s at **Centrum Wiskunde & Informatica (CWI)**, Netherlands.
	- First released as **Python 0.9.0** in 1991.
	- Evolved through major versions: Python 2.x (2000), Python 3.0 (2008), Python 3.10+ (2021+).
	- Python 2 reached end-of-life in January 2020 — Python 3 is the standard.
-
- **Who**:
	- **Guido van Rossum** — creator of Python, served as "Benevolent Dictator For Life" (BDFL) until 2018.
	- **Python Software Foundation (PSF)** — non-profit that oversees Python's development and community.
-
- **Why**:
	- To create a language that emphasizes **readability** and **simplicity** over verbosity.
	- Inspired by ABC language, designed to be easy to learn yet powerful enough for real-world use.
	- Named after **Monty Python's Flying Circus**, not the snake.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Readable Syntax** — Clean, English-like code reduces cognitive load and learning curve.
		- **Multi-Paradigm** — Supports procedural, object-oriented, and functional programming.
		- **Huge Ecosystem** — PyPI hosts 500,000+ packages; Django, Flask, NumPy, Pandas, PyTorch, etc.
		- **Interpreted & Interactive** — REPL (Read-Eval-Print Loop) for rapid prototyping.
		- **Dynamic Typing** — No need to declare variable types explicitly.
		- **Garbage Collection** — Automatic memory management via reference counting + cyclic GC.
		- **Cross-Platform** — Runs on Linux, Windows, macOS, embedded systems (MicroPython).
		- **Dominant in AI/ML** — De facto language for data science, machine learning, and automation.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Slow Execution** — Interpreted nature makes it slower than C, C++, or Java.
		- **GIL (Global Interpreter Lock)** — Limits true multi-threaded CPU-bound parallelism.
		- **High Memory Usage** — Dynamic typing and object overhead consume more RAM.
		- **Not Ideal for Mobile** — Limited native mobile development support.
		- **Runtime Errors** — Dynamic typing can cause type errors only caught at runtime.
		- **Packaging Complexity** — Dependency management (pip, venv, conda) can be tricky.
-
- # Basics
	- ## Hello World & Entry Point
		- ```python
		  # hello.py
		  print("Hello, World!")
		  
		  # With main guard (best practice for scripts)
		  def main():
		      print("Hello from main!")
		  
		  if __name__ == "__main__":
		      main()
		  ```
		- `if __name__ == "__main__"` ensures code only runs when the file is executed directly, not when imported.
	-
	- ## Comments
		- ```python
		  # Single line comment
		  
		  """
		  Multi-line string used as
		  a block comment (docstring style)
		  """
		  
		  def greet(name):
		      """Greet a person by name. This is a proper docstring."""
		      print(f"Hello, {name}")
		  ```
	-
	- ## Variables & Data Types
		- ```python
		  age = 25              # int
		  price = 9.99          # float
		  name = "Alice"        # str
		  is_active = True      # bool
		  nothing = None        # NoneType
		  
		  # Multiple assignment
		  x = y = z = 0
		  a, b, c = 1, 2, 3    # tuple unpacking
		  
		  # Type checking
		  print(type(age))      # <class 'int'>
		  print(isinstance(age, int))  # True
		  ```
	-
	- ## Primitive Data Types Table
		- ```
		  Type      Example           Notes
		  int       42, -7, 0         Arbitrary precision (no overflow)
		  float     3.14, -0.5        64-bit IEEE 754 double
		  complex   3+4j              Real + imaginary
		  bool      True, False       Subclass of int (True==1, False==0)
		  str       "hello", 'world'  Immutable Unicode sequence
		  bytes     b"data"           Immutable byte sequence
		  NoneType  None              Represents absence of value
		  ```
	-
	- ## Type Conversion
		- ```python
		  int("42")         # 42
		  float("3.14")     # 3.14
		  str(100)          # "100"
		  bool(0)           # False
		  bool("hello")     # True  (non-empty string is truthy)
		  list("abc")       # ['a', 'b', 'c']
		  tuple([1, 2, 3])  # (1, 2, 3)
		  set([1, 1, 2])    # {1, 2}
		  ```
	-
	- ## User Input
		- ```python
		  name = input("Enter your name: ")   # always returns str
		  age = int(input("Enter your age: ")) # convert to int
		  
		  print(f"Hello {name}, you are {age} years old.")
		  ```
	-
	- ## Operators
	  collapsed:: true
		- ```python
		  # Arithmetic
		  +  -  *  /   # add, sub, mul, true division (returns float)
		  //            # floor division (returns int)
		  %             # modulo
		  **            # exponentiation
		  
		  print(7 / 2)   # 3.5
		  print(7 // 2)  # 3
		  print(7 % 2)   # 1
		  print(2 ** 10) # 1024
		  
		  # Comparison
		  ==  !=  <  >  <=  >=
		  
		  # Logical
		  and  or  not
		  
		  # Bitwise
		  &   |   ^   ~   <<   >>
		  
		  # Identity & Membership
		  is    is not   # identity (same object in memory)
		  in    not in   # membership test
		  
		  x = [1, 2, 3]
		  print(2 in x)       # True
		  print(None is None) # True
		  
		  # Walrus operator (Python 3.8+)
		  if (n := len(x)) > 2:
		      print(f"List has {n} elements")
		  ```
-
- # Strings
  collapsed:: true
	- ## String Basics & Methods
	  collapsed:: true
		- ```python
		  s = "Hello, World!"
		  
		  print(len(s))           # 13
		  print(s[0])             # H
		  print(s[-1])            # !
		  print(s[7:12])          # World
		  print(s[:5])            # Hello
		  print(s[::2])           # Hlo ol!
		  print(s[::-1])          # !dlroW ,olleH  (reverse)
		  
		  # Common methods
		  s.upper()               # "HELLO, WORLD!"
		  s.lower()               # "hello, world!"
		  s.strip()               # remove leading/trailing whitespace
		  s.lstrip() / s.rstrip() # left/right strip
		  s.replace("World", "Python")  # "Hello, Python!"
		  s.split(", ")           # ["Hello", "World!"]
		  ", ".join(["a", "b"])   # "a, b"
		  s.startswith("Hello")   # True
		  s.endswith("!")         # True
		  s.find("World")         # 7  (-1 if not found)
		  s.count("l")            # 3
		  s.isdigit()             # False
		  s.isalpha()             # False
		  s.title()               # "Hello, World!"
		  ```
	-
	- ## String Formatting
	  collapsed:: true
		- ```python
		  name = "Alice"
		  score = 95.678
		  
		  # f-strings (Python 3.6+) — preferred
		  print(f"Name: {name}, Score: {score:.2f}")  # Score: 95.68
		  print(f"{2 + 2}")          # 4 — expressions work
		  print(f"{name!r}")         # 'Alice' — repr
		  print(f"{score:>10.2f}")   # right-align, width 10
		  
		  # format() method
		  print("Hello, {}!".format(name))
		  print("{0} + {1} = {2}".format(1, 2, 3))
		  
		  # % formatting (old style, avoid)
		  print("Hello, %s! Score: %.2f" % (name, score))
		  
		  # Multi-line strings
		  text = """
		  Line 1
		  Line 2
		  Line 3
		  """
		  ```
	-
	- ## Raw Strings & Escape Sequences
	  collapsed:: true
		- ```python
		  # Escape sequences
		  print("Tab:\there")       # Tab:    here
		  print("Newline:\nhere")   # Newline: (new line) here
		  print("Quote: \"hi\"")    # Quote: "hi"
		  print("Backslash: \\")    # Backslash: \
		  
		  # Raw strings — backslash treated literally
		  path = r"C:\Users\Alice\Documents"
		  print(path)  # C:\Users\Alice\Documents
		  
		  # Useful for regex patterns
		  import re
		  pattern = r"\d+\.\d+"  # matches decimal numbers
		  ```
-
- # Control Flow
  collapsed:: true
	- ## if / elif / else
	  collapsed:: true
		- ```python
		  score = 85
		  
		  if score >= 90:
		      print("A")
		  elif score >= 80:
		      print("B")
		  elif score >= 70:
		      print("C")
		  else:
		      print("F")
		  # Output: B
		  
		  # One-liner ternary
		  label = "Pass" if score >= 60 else "Fail"
		  ```
	-
	- ## match / case (Python 3.10+ — Structural Pattern Matching)
	  collapsed:: true
		- ```python
		  command = "quit"
		  
		  match command:
		      case "quit":
		          print("Quitting...")
		      case "help":
		          print("Showing help")
		      case _:
		          print("Unknown command")
		  
		  # Match with types and destructuring
		  point = (1, 0)
		  match point:
		      case (0, 0):
		          print("Origin")
		      case (x, 0):
		          print(f"On X-axis at {x}")
		      case (0, y):
		          print(f"On Y-axis at {y}")
		      case (x, y):
		          print(f"Point at ({x}, {y})")
		  ```
	-
	- ## Loops
	  collapsed:: true
		- ```python
		  # for loop — iterates over any iterable
		  for i in range(5):
		      print(i)  # 0 1 2 3 4
		  
		  # range(start, stop, step)
		  for i in range(1, 10, 2):
		      print(i)  # 1 3 5 7 9
		  
		  # iterate over list
		  fruits = ["apple", "banana", "cherry"]
		  for fruit in fruits:
		      print(fruit)
		  
		  # enumerate — get index + value
		  for i, fruit in enumerate(fruits):
		      print(f"{i}: {fruit}")
		  
		  # zip — iterate multiple iterables together
		  names = ["Alice", "Bob"]
		  scores = [95, 87]
		  for name, score in zip(names, scores):
		      print(f"{name}: {score}")
		  
		  # while loop
		  n = 0
		  while n < 5:
		      print(n)
		      n += 1
		  
		  # do-while equivalent
		  while True:
		      val = input("Enter 'q' to quit: ")
		      if val == 'q':
		          break
		  ```
	-
	- ## break / continue / pass / else on loops
	  collapsed:: true
		- ```python
		  for i in range(10):
		      if i == 3: continue   # skip 3
		      if i == 7: break      # stop at 7
		      print(i)
		  # Output: 0 1 2 4 5 6
		  
		  # pass — placeholder, does nothing
		  def todo():
		      pass  # implement later
		  
		  # else on for/while — runs if loop completed without break
		  for i in range(5):
		      if i == 10:
		          break
		  else:
		      print("Loop completed normally")  # this runs
		  ```
-
- # Functions
  collapsed:: true
	- ## Definition, Calling & Return
	  collapsed:: true
		- ```python
		  def add(a, b):
		      return a + b
		  
		  result = add(3, 4)  # 7
		  
		  # Multiple return values (returns a tuple)
		  def min_max(lst):
		      return min(lst), max(lst)
		  
		  lo, hi = min_max([3, 1, 4, 1, 5])
		  print(lo, hi)  # 1 5
		  ```
	-
	- ## Default, *args & **kwargs
	  collapsed:: true
		- ```python
		  # Default arguments
		  def greet(name, msg="Hello"):
		      print(f"{msg}, {name}!")
		  
		  greet("Alice")          # Hello, Alice!
		  greet("Bob", "Hi")      # Hi, Bob!
		  
		  # *args — variable positional arguments (tuple)
		  def total(*args):
		      return sum(args)
		  
		  print(total(1, 2, 3, 4))  # 10
		  
		  # **kwargs — variable keyword arguments (dict)
		  def show_info(**kwargs):
		      for key, val in kwargs.items():
		          print(f"{key}: {val}")
		  
		  show_info(name="Alice", age=30)
		  # name: Alice
		  # age: 30
		  
		  # Combining all
		  def func(a, b, *args, key="default", **kwargs):
		      print(a, b, args, key, kwargs)
		  
		  func(1, 2, 3, 4, key="x", extra=True)
		  # 1 2 (3, 4) x {'extra': True}
		  ```
	-
	- ## Keyword-Only & Positional-Only Arguments
	  collapsed:: true
		- ```python
		  # Keyword-only: params after * must be passed by name
		  def connect(host, *, port=80, timeout=30):
		      print(f"{host}:{port} timeout={timeout}")
		  
		  connect("localhost", port=8080)  # OK
		  # connect("localhost", 8080)     # TypeError
		  
		  # Positional-only (Python 3.8+): params before / must be positional
		  def power(base, exp, /):
		      return base ** exp
		  
		  power(2, 10)          # OK
		  # power(base=2, exp=10) # TypeError
		  ```
	-
	- ## Lambda Functions
	  collapsed:: true
		- ```python
		  # lambda args: expression
		  square = lambda x: x * x
		  print(square(5))  # 25
		  
		  add = lambda a, b: a + b
		  print(add(3, 4))  # 7
		  
		  # Common use: sorting with key
		  people = [("Alice", 30), ("Bob", 25), ("Charlie", 35)]
		  people.sort(key=lambda p: p[1])
		  print(people)  # [('Bob', 25), ('Alice', 30), ('Charlie', 35)]
		  
		  # With map, filter, sorted
		  nums = [1, 2, 3, 4, 5]
		  squares = list(map(lambda x: x**2, nums))   # [1, 4, 9, 16, 25]
		  evens = list(filter(lambda x: x % 2 == 0, nums))  # [2, 4]
		  ```
	-
	- ## Closures & Nested Functions
	  collapsed:: true
		- ```python
		  def make_multiplier(factor):
		      def multiply(x):
		          return x * factor  # captures 'factor' from outer scope
		      return multiply
		  
		  double = make_multiplier(2)
		  triple = make_multiplier(3)
		  
		  print(double(5))  # 10
		  print(triple(5))  # 15
		  
		  # nonlocal — modify outer variable from inner function
		  def counter():
		      count = 0
		      def increment():
		          nonlocal count
		          count += 1
		          return count
		      return increment
		  
		  c = counter()
		  print(c())  # 1
		  print(c())  # 2
		  print(c())  # 3
		  ```
	-
	- ## Decorators
	  collapsed:: true
		- ```python
		  # A decorator wraps a function to add behavior
		  def logger(func):
		      def wrapper(*args, **kwargs):
		          print(f"Calling {func.__name__}")
		          result = func(*args, **kwargs)
		          print(f"Done {func.__name__}")
		          return result
		      return wrapper
		  
		  @logger
		  def add(a, b):
		      return a + b
		  
		  add(3, 4)
		  # Calling add
		  # Done add
		  
		  # Decorator with arguments
		  def repeat(n):
		      def decorator(func):
		          def wrapper(*args, **kwargs):
		              for _ in range(n):
		                  func(*args, **kwargs)
		          return wrapper
		      return decorator
		  
		  @repeat(3)
		  def say_hi():
		      print("Hi!")
		  
		  say_hi()  # Hi! Hi! Hi!
		  
		  # functools.wraps — preserves original function metadata
		  from functools import wraps
		  
		  def timer(func):
		      @wraps(func)
		      def wrapper(*args, **kwargs):
		          import time
		          start = time.time()
		          result = func(*args, **kwargs)
		          print(f"{func.__name__} took {time.time()-start:.4f}s")
		          return result
		      return wrapper
		  ```
	-
	- ## Generators & yield
	  collapsed:: true
		- ```python
		  # Generator function — uses yield instead of return
		  def count_up(n):
		      for i in range(n):
		          yield i  # pauses here, resumes on next()
		  
		  gen = count_up(5)
		  print(next(gen))  # 0
		  print(next(gen))  # 1
		  
		  for val in count_up(3):
		      print(val)  # 0 1 2
		  
		  # Generator expression (like list comp but lazy)
		  squares = (x**2 for x in range(10))
		  print(next(squares))  # 0
		  print(sum(squares))   # 1+4+9+...+81 = 284
		  
		  # Infinite generator
		  def fibonacci():
		      a, b = 0, 1
		      while True:
		          yield a
		          a, b = b, a + b
		  
		  fib = fibonacci()
		  print([next(fib) for _ in range(8)])  # [0, 1, 1, 2, 3, 5, 8, 13]
		  
		  # yield from — delegate to sub-generator
		  def chain(*iterables):
		      for it in iterables:
		          yield from it
		  
		  list(chain([1, 2], [3, 4], [5]))  # [1, 2, 3, 4, 5]
		  ```
-
- # Data Structures
  collapsed:: true
	- ## Lists
	  collapsed:: true
		- ```python
		  nums = [1, 2, 3, 4, 5]
		  
		  # Access & Slicing
		  nums[0]       # 1
		  nums[-1]      # 5
		  nums[1:3]     # [2, 3]
		  nums[::-1]    # [5, 4, 3, 2, 1]  (reversed)
		  
		  # Mutating
		  nums.append(6)          # [1, 2, 3, 4, 5, 6]
		  nums.insert(0, 0)       # [0, 1, 2, 3, 4, 5, 6]
		  nums.extend([7, 8])     # adds multiple
		  nums.remove(3)          # removes first occurrence of 3
		  nums.pop()              # removes & returns last element
		  nums.pop(0)             # removes & returns element at index 0
		  nums.sort()             # sort in-place
		  nums.sort(reverse=True) # descending
		  nums.reverse()          # reverse in-place
		  nums.clear()            # empty the list
		  
		  # Info
		  len(nums)               # length
		  nums.count(2)           # count occurrences
		  nums.index(4)           # index of first occurrence
		  2 in nums               # membership test
		  
		  # Copying
		  copy1 = nums.copy()     # shallow copy
		  copy2 = nums[:]         # also shallow copy
		  import copy
		  deep = copy.deepcopy(nums)  # deep copy
		  ```
	-
	- ## List Comprehensions
	  collapsed:: true
		- ```python
		  # [expression for item in iterable if condition]
		  squares = [x**2 for x in range(10)]
		  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
		  
		  evens = [x for x in range(20) if x % 2 == 0]
		  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
		  
		  # Nested comprehension
		  matrix = [[i * j for j in range(1, 4)] for i in range(1, 4)]
		  # [[1, 2, 3], [2, 4, 6], [3, 6, 9]]
		  
		  # Flatten a 2D list
		  flat = [x for row in matrix for x in row]
		  # [1, 2, 3, 2, 4, 6, 3, 6, 9]
		  
		  # With conditional expression
		  labels = ["even" if x % 2 == 0 else "odd" for x in range(5)]
		  # ['even', 'odd', 'even', 'odd', 'even']
		  ```
	-
	- ## Tuples
	  collapsed:: true
		- ```python
		  # Immutable ordered sequence
		  point = (3, 4)
		  rgb = (255, 128, 0)
		  single = (42,)  # trailing comma required for single-element tuple
		  
		  x, y = point    # unpacking
		  a, *rest = (1, 2, 3, 4, 5)  # a=1, rest=[2,3,4,5]
		  
		  point[0]        # 3
		  len(point)      # 2
		  point.count(3)  # 1
		  point.index(4)  # 1
		  
		  # Named tuples — tuples with named fields
		  from collections import namedtuple
		  Point = namedtuple("Point", ["x", "y"])
		  p = Point(3, 4)
		  print(p.x, p.y)  # 3 4
		  print(p)          # Point(x=3, y=4)
		  ```
	-
	- ## Dictionaries
	  collapsed:: true
		- ```python
		  person = {"name": "Alice", "age": 30, "city": "NYC"}
		  
		  # Access
		  person["name"]              # "Alice"
		  person.get("age")           # 30
		  person.get("email", "N/A")  # "N/A" (default if missing)
		  
		  # Mutating
		  person["email"] = "alice@example.com"  # add/update
		  person.update({"age": 31, "job": "Dev"})
		  del person["city"]
		  person.pop("job")           # remove & return value
		  
		  # Iteration
		  for key in person:
		      print(key)
		  for key, val in person.items():
		      print(f"{key}: {val}")
		  for val in person.values():
		      print(val)
		  
		  # Info
		  len(person)                 # number of keys
		  "name" in person            # True
		  person.keys()               # dict_keys([...])
		  person.values()             # dict_values([...])
		  
		  # Dict comprehension
		  squares = {x: x**2 for x in range(5)}
		  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
		  
		  # Merge dicts (Python 3.9+)
		  d1 = {"a": 1}
		  d2 = {"b": 2}
		  merged = d1 | d2   # {"a": 1, "b": 2}
		  
		  # defaultdict — auto-creates missing keys
		  from collections import defaultdict
		  dd = defaultdict(list)
		  dd["fruits"].append("apple")  # no KeyError
		  
		  # Counter — count occurrences
		  from collections import Counter
		  c = Counter("mississippi")
		  print(c.most_common(3))  # [('s', 4), ('i', 4), ('p', 2)]
		  ```
	-
	- ## Sets
	  collapsed:: true
		- ```python
		  # Unordered collection of unique elements
		  s = {1, 2, 3, 4, 5}
		  empty = set()  # NOT {} — that's an empty dict
		  
		  s.add(6)
		  s.remove(3)    # raises KeyError if not found
		  s.discard(99)  # no error if not found
		  s.pop()        # remove & return arbitrary element
		  
		  # Set operations
		  a = {1, 2, 3, 4}
		  b = {3, 4, 5, 6}
		  
		  a | b   # union:        {1, 2, 3, 4, 5, 6}
		  a & b   # intersection: {3, 4}
		  a - b   # difference:   {1, 2}
		  a ^ b   # symmetric diff: {1, 2, 5, 6}
		  
		  a.issubset(b)    # False
		  a.issuperset(b)  # False
		  a.isdisjoint({7, 8})  # True
		  
		  # Set comprehension
		  evens = {x for x in range(10) if x % 2 == 0}
		  # {0, 2, 4, 6, 8}
		  ```
-
- # OOP — Object-Oriented Programming
	- [[DSA Algo & System Design]] - visit this page for in-depth Learning
	-
	- ## Classes & Objects
	  collapsed:: true
		- ```python
		  class Car:
		      # Class variable (shared by all instances)
		      wheels = 4
		  
		      def __init__(self, brand, year):
		          # Instance variables
		          self.brand = brand
		          self.year = year
		  
		      def display(self):
		          print(f"{self.brand} ({self.year})")
		  
		  c = Car("Toyota", 2022)
		  c.display()           # Toyota (2022)
		  print(Car.wheels)     # 4
		  print(c.wheels)       # 4
		  ```
	-
	- ## __init__, __str__, __repr__ & Dunder Methods
	  collapsed:: true
		- ```python
		  class Vector:
		      def __init__(self, x, y):
		          self.x = x
		          self.y = y
		  
		      def __str__(self):
		          return f"Vector({self.x}, {self.y})"  # for print()
		  
		      def __repr__(self):
		          return f"Vector(x={self.x}, y={self.y})"  # for debugging
		  
		      def __add__(self, other):
		          return Vector(self.x + other.x, self.y + other.y)
		  
		      def __len__(self):
		          return 2
		  
		      def __eq__(self, other):
		          return self.x == other.x and self.y == other.y
		  
		      def __lt__(self, other):
		          return (self.x**2 + self.y**2) < (other.x**2 + other.y**2)
		  
		  v1 = Vector(1, 2)
		  v2 = Vector(3, 4)
		  print(v1 + v2)   # Vector(4, 6)
		  print(len(v1))   # 2
		  print(v1 == v2)  # False
		  ```
	-
	- ## Class Methods, Static Methods & Properties
	  collapsed:: true
		- ```python
		  class Temperature:
		      def __init__(self, celsius):
		          self._celsius = celsius
		  
		      @property
		      def celsius(self):
		          return self._celsius
		  
		      @celsius.setter
		      def celsius(self, value):
		          if value < -273.15:
		              raise ValueError("Below absolute zero!")
		          self._celsius = value
		  
		      @property
		      def fahrenheit(self):
		          return self._celsius * 9/5 + 32
		  
		      @classmethod
		      def from_fahrenheit(cls, f):
		          return cls((f - 32) * 5/9)  # alternative constructor
		  
		      @staticmethod
		      def is_valid(c):
		          return c >= -273.15  # utility, no self/cls needed
		  
		  t = Temperature(100)
		  print(t.fahrenheit)          # 212.0
		  t.celsius = 0
		  print(t.celsius)             # 0
		  
		  t2 = Temperature.from_fahrenheit(32)
		  print(t2.celsius)            # 0.0
		  
		  print(Temperature.is_valid(-300))  # False
		  ```
	-
	- ## Inheritance
	  collapsed:: true
		- ```python
		  class Animal:
		      def __init__(self, name):
		          self.name = name
		  
		      def speak(self):
		          return f"{self.name} makes a sound"
		  
		      def __str__(self):
		          return f"Animal({self.name})"
		  
		  class Dog(Animal):
		      def speak(self):                    # override
		          return f"{self.name} says Woof!"
		  
		      def fetch(self):
		          return f"{self.name} fetches the ball"
		  
		  class Cat(Animal):
		      def speak(self):
		          return f"{self.name} says Meow!"
		  
		  d = Dog("Rex")
		  print(d.speak())   # Rex says Woof!
		  print(d.fetch())   # Rex fetches the ball
		  
		  # super() — call parent method
		  class GuideDog(Dog):
		      def __init__(self, name, owner):
		          super().__init__(name)  # call Dog/__Animal __init__
		          self.owner = owner
		  
		      def speak(self):
		          return super().speak() + " (guide dog)"
		  
		  g = GuideDog("Buddy", "Alice")
		  print(g.speak())  # Buddy says Woof! (guide dog)
		  ```
	-
	- ## Multiple Inheritance & MRO
	  collapsed:: true
		- ```python
		  class Flyable:
		      def fly(self): return "Flying"
		  
		  class Swimmable:
		      def swim(self): return "Swimming"
		  
		  class Duck(Flyable, Swimmable):
		      def quack(self): return "Quack!"
		  
		  d = Duck()
		  print(d.fly())   # Flying
		  print(d.swim())  # Swimming
		  
		  # MRO — Method Resolution Order (C3 linearization)
		  print(Duck.__mro__)
		  # (<class 'Duck'>, <class 'Flyable'>, <class 'Swimmable'>, <class 'object'>)
		  ```
	-
	- ## Abstract Classes
	  collapsed:: true
		- ```python
		  from abc import ABC, abstractmethod
		  
		  class Shape(ABC):
		      @abstractmethod
		      def area(self) -> float:
		          pass
		  
		      @abstractmethod
		      def perimeter(self) -> float:
		          pass
		  
		      def describe(self):
		          return f"Area: {self.area():.2f}, Perimeter: {self.perimeter():.2f}"
		  
		  # Shape()  # TypeError — cannot instantiate abstract class
		  
		  class Circle(Shape):
		      def __init__(self, r):
		          self.r = r
		  
		      def area(self):
		          return 3.14159 * self.r ** 2
		  
		  def perimeter(self):
		          return 2 * 3.14159 * self.r
		  
		  c = Circle(5)
		  print(c.describe())  # Area: 78.54, Perimeter: 31.42
		  ```
	-
	- ## Dataclasses (Python 3.7+)
	  collapsed:: true
		- ```python
		  from dataclasses import dataclass, field
		  
		  @dataclass
		  class Point:
		      x: float
		      y: float
		      z: float = 0.0  # default value
		  
		  @dataclass
		  class Player:
		      name: str
		      score: int = 0
		      inventory: list = field(default_factory=list)  # mutable default
		  
		      def add_item(self, item):
		          self.inventory.append(item)
		  
		  p = Point(1.0, 2.0)
		  print(p)         # Point(x=1.0, y=2.0, z=0.0)
		  print(p.x)       # 1.0
		  
		  # Auto-generates __init__, __repr__, __eq__
		  p2 = Point(1.0, 2.0)
		  print(p == p2)   # True
		  
		  # Frozen dataclass (immutable)
		  @dataclass(frozen=True)
		  class Config:
		      host: str
		      port: int = 8080
		  ```
-
- # Error Handling
  collapsed:: true
	- ## try / except / else / finally
	  collapsed:: true
		- ```python
		  try:
		      result = 10 / 0
		  except ZeroDivisionError as e:
		      print(f"Error: {e}")
		  except (TypeError, ValueError) as e:
		      print(f"Type or Value error: {e}")
		  except Exception as e:
		      print(f"Unexpected error: {e}")
		  else:
		      print("No error occurred")   # runs only if no exception
		  finally:
		      print("Always runs")         # cleanup code
		  
		  # Catching all exceptions (use sparingly)
		  try:
		      risky_operation()
		  except Exception:
		      pass  # silently ignore
		  ```
	-
	- ## Raising Exceptions
	  collapsed:: true
		- ```python
		  def divide(a, b):
		      if b == 0:
		          raise ValueError("Denominator cannot be zero")
		      return a / b
		  
		  # Re-raise
		  try:
		      divide(1, 0)
		  except ValueError:
		      print("Caught it")
		      raise  # re-raises the same exception
		  
		  # raise from — chain exceptions
		  try:
		      int("abc")
		  except ValueError as e:
		      raise RuntimeError("Conversion failed") from e
		  ```
	-
	- ## Custom Exceptions
	  collapsed:: true
		- ```python
		  class AppError(Exception):
		      """Base exception for this app."""
		      pass
		  
		  class ValidationError(AppError):
		      def __init__(self, field, message):
		          self.field = field
		          super().__init__(f"Validation error on '{field}': {message}")
		  
		  class NotFoundError(AppError):
		      pass
		  
		  try:
		      raise ValidationError("email", "Invalid format")
		  except ValidationError as e:
		      print(e)         # Validation error on 'email': Invalid format
		      print(e.field)   # email
		  ```
	-
	- ## Context Managers (with statement)
	  collapsed:: true
		- ```python
		  # Built-in: file handling
		  with open("data.txt", "r") as f:
		      content = f.read()
		  # file automatically closed after block, even on exception
		  
		  # Custom context manager using class
		  class Timer:
		      def __enter__(self):
		          import time
		          self.start = time.time()
		          return self
		  
		      def __exit__(self, exc_type, exc_val, exc_tb):
		          import time
		          self.elapsed = time.time() - self.start
		          print(f"Elapsed: {self.elapsed:.4f}s")
		          return False  # don't suppress exceptions
		  
		  with Timer() as t:
		      sum(range(1_000_000))
		  
		  # Custom context manager using contextlib
		  from contextlib import contextmanager
		  
		  @contextmanager
		  def managed_resource(name):
		      print(f"Acquiring {name}")
		      try:
		          yield name
		      finally:
		          print(f"Releasing {name}")
		  
		  with managed_resource("DB connection") as res:
		      print(f"Using {res}")
		  ```
-
- # File I/O
  collapsed:: true
	- ## Reading & Writing Files
	  collapsed:: true
		- ```python
		  # Write to file
		  with open("output.txt", "w") as f:
		      f.write("Hello, World!\n")
		      f.writelines(["Line 1\n", "Line 2\n"])
		  
		  # Read entire file
		  with open("output.txt", "r") as f:
		      content = f.read()
		  
		  # Read line by line (memory efficient)
		  with open("output.txt", "r") as f:
		      for line in f:
		          print(line.strip())
		  
		  # Read all lines into list
		  with open("output.txt", "r") as f:
		      lines = f.readlines()
		  
		  # Append to file
		  with open("output.txt", "a") as f:
		      f.write("Appended line\n")
		  
		  # File modes:
		  # "r"  — read (default)
		  # "w"  — write (overwrites)
		  # "a"  — append
		  # "rb" — read binary
		  # "wb" — write binary
		  # "r+" — read + write
		  ```
	-
	- ## pathlib (Python 3.4+) — Modern File Paths
	  collapsed:: true
		- ```python
		  from pathlib import Path
		  
		  p = Path("data/output.txt")
		  
		  p.exists()          # True/False
		  p.is_file()         # True
		  p.is_dir()          # False
		  p.suffix            # ".txt"
		  p.stem              # "output"
		  p.name              # "output.txt"
		  p.parent            # Path("data")
		  
		  # Read/write
		  p.write_text("Hello!")
		  content = p.read_text()
		  
		  # Create directories
		  Path("new/dir").mkdir(parents=True, exist_ok=True)
		  
		  # Glob
		  for f in Path(".").glob("**/*.py"):
		      print(f)
		  
		  # Join paths
		  base = Path("/home/user")
		  full = base / "documents" / "file.txt"
		  print(full)  # /home/user/documents/file.txt
		  ```
-
- # Type Hints (Python 3.5+)
  collapsed:: true
	- ## Basic Type Annotations
	  collapsed:: true
		- ```python
		  # Variable annotations
		  name: str = "Alice"
		  age: int = 30
		  scores: list[int] = [95, 87, 92]
		  
		  # Function annotations
		  def greet(name: str, times: int = 1) -> str:
		      return (f"Hello, {name}! " * times).strip()
		  
		  # Optional — value can be None
		  from typing import Optional
		  def find_user(id: int) -> Optional[str]:
		      return None
		  
		  # Python 3.10+ shorthand for Optional
		  def find(id: int) -> str | None:
		      return None
		  ```
	-
	- ## Advanced Type Hints
	  collapsed:: true
		- ```python
		  from typing import Union, Tuple, Dict, List, Callable, TypeVar, Generic
		  
		  # Union — multiple possible types
		  def process(val: Union[int, str]) -> str:
		      return str(val)
		  
		  # Python 3.10+ shorthand
		  def process(val: int | str) -> str:
		      return str(val)
		  
		  # Callable — function type
		  def apply(func: Callable[[int, int], int], a: int, b: int) -> int:
		      return func(a, b)
		  
		  # TypeVar — generic type variable
		  T = TypeVar("T")
		  
		  def first(lst: list[T]) -> T:
		      return lst[0]
		  
		  # TypedDict — typed dictionary
		  from typing import TypedDict
		  
		  class UserDict(TypedDict):
		      name: str
		      age: int
		      email: str
		  
		  user: UserDict = {"name": "Alice", "age": 30, "email": "a@b.com"}
		  
		  # Literal — restrict to specific values
		  from typing import Literal
		  
		  def set_direction(d: Literal["left", "right", "up", "down"]) -> None:
		      pass
		  ```
-
- # Functional Programming
  collapsed:: true
	- ## map, filter, reduce
	  collapsed:: true
		- ```python
		  nums = [1, 2, 3, 4, 5]
		  
		  # map — apply function to each element
		  squares = list(map(lambda x: x**2, nums))
		  # [1, 4, 9, 16, 25]
		  
		  # filter — keep elements where function returns True
		  evens = list(filter(lambda x: x % 2 == 0, nums))
		  # [2, 4]
		  
		  # reduce — fold list to single value
		  from functools import reduce
		  product = reduce(lambda acc, x: acc * x, nums)
		  # 120  (1*2*3*4*5)
		  
		  # Prefer list comprehensions over map/filter for readability
		  squares = [x**2 for x in nums]
		  evens = [x for x in nums if x % 2 == 0]
		  ```
	-
	- ## itertools — Powerful Iteration Tools
	  collapsed:: true
		- ```python
		  import itertools
		  
		  # chain — combine iterables
		  list(itertools.chain([1, 2], [3, 4], [5]))
		  # [1, 2, 3, 4, 5]
		  
		  # product — cartesian product
		  list(itertools.product([1, 2], ["a", "b"]))
		  # [(1,'a'), (1,'b'), (2,'a'), (2,'b')]
		  
		  # combinations & permutations
		  list(itertools.combinations([1, 2, 3], 2))
		  # [(1,2), (1,3), (2,3)]
		  list(itertools.permutations([1, 2, 3], 2))
		  # [(1,2), (1,3), (2,1), (2,3), (3,1), (3,2)]
		  
		  # groupby — group consecutive elements
		  data = [("a", 1), ("a", 2), ("b", 3), ("b", 4)]
		  for key, group in itertools.groupby(data, key=lambda x: x[0]):
		      print(key, list(group))
		  # a [('a', 1), ('a', 2)]
		  # b [('b', 3), ('b', 4)]
		  
		  # islice — lazy slice of iterator
		  gen = (x**2 for x in range(1000))
		  first5 = list(itertools.islice(gen, 5))
		  # [0, 1, 4, 9, 16]
		  
		  # count, cycle, repeat — infinite iterators
		  counter = itertools.count(start=10, step=2)  # 10, 12, 14, ...
		  cycler = itertools.cycle(["A", "B", "C"])    # A, B, C, A, B, C, ...
		  ```
	-
	- ## functools
	  collapsed:: true
		- ```python
		  from functools import partial, lru_cache, cached_property
		  
		  # partial — fix some arguments of a function
		  def power(base, exp):
		      return base ** exp
		  
		  square = partial(power, exp=2)
		  cube = partial(power, exp=3)
		  print(square(5))  # 25
		  print(cube(3))    # 27
		  
		  # lru_cache — memoize function results
		  @lru_cache(maxsize=None)
		  def fib(n):
		      if n < 2: return n
		      return fib(n-1) + fib(n-2)
		  
		  print(fib(50))  # fast — results cached
		  print(fib.cache_info())  # CacheInfo(hits=48, misses=51, ...)
		  
		  # cached_property — compute once, cache on instance
		  class Circle:
		      def __init__(self, r):
		          self.r = r
		  
		      @cached_property
		      def area(self):
		          print("Computing...")
		          return 3.14159 * self.r ** 2
		  
		  c = Circle(5)
		  print(c.area)  # Computing... 78.539...
		  print(c.area)  # 78.539... (cached, no recompute)
		  ```
-
- # Async Programming
  collapsed:: true
	- ## async / await Basics
	  collapsed:: true
		- ```python
		  import asyncio
		  
		  async def fetch_data(url: str) -> str:
		      await asyncio.sleep(1)  # simulate I/O wait
		      return f"Data from {url}"
		  
		  async def main():
		      result = await fetch_data("https://api.example.com")
		      print(result)
		  
		  asyncio.run(main())
		  ```
	-
	- ## Concurrent Tasks with asyncio
	  collapsed:: true
		- ```python
		  import asyncio
		  
		  async def task(name, delay):
		      await asyncio.sleep(delay)
		      print(f"{name} done after {delay}s")
		      return name
		  
		  async def main():
		      # Run tasks concurrently (not sequentially)
		      results = await asyncio.gather(
		          task("A", 2),
		          task("B", 1),
		          task("C", 3),
		      )
		      print(results)  # ['A', 'B', 'C']
		  
		  asyncio.run(main())
		  # B done after 1s
		  # A done after 2s
		  # C done after 3s
		  # Total time: ~3s (not 6s)
		  
		  # asyncio.create_task — fire and forget
		  async def main():
		      t1 = asyncio.create_task(task("X", 1))
		      t2 = asyncio.create_task(task("Y", 2))
		      await t1
		      await t2
		  ```
	-
	- ## Async Generators & Context Managers
	  collapsed:: true
		- ```python
		  # Async generator
		  async def async_range(n):
		      for i in range(n):
		          await asyncio.sleep(0.1)
		          yield i
		  
		  async def main():
		      async for val in async_range(5):
		          print(val)
		  
		  # Async context manager
		  class AsyncDB:
		      async def __aenter__(self):
		          print("Connecting...")
		          return self
		  
		      async def __aexit__(self, *args):
		          print("Disconnecting...")
		  
		  async def main():
		      async with AsyncDB() as db:
		          print("Using DB")
		  ```
-
- # Modules & Packages
  collapsed:: true
	- ## Importing
	  collapsed:: true
		- ```python
		  import math                        # import module
		  import math as m                   # alias
		  from math import sqrt, pi          # import specific names
		  from math import *                 # import all (avoid — pollutes namespace)
		  
		  print(math.sqrt(16))   # 4.0
		  print(m.pi)            # 3.14159...
		  print(sqrt(25))        # 5.0
		  
		  # Relative imports (inside packages)
		  from . import sibling_module
		  from ..utils import helper
		  ```
	-
	- ## Creating Modules & Packages
		- ```
		  mypackage/
		  ├── __init__.py       # makes it a package
		  ├── utils.py
		  └── models/
		      ├── __init__.py
		      └── user.py
		  ```
		- ```python
		  # utils.py
		  def add(a, b):
		      return a + b
		  
		  # __init__.py — control what's exported
		  from .utils import add
		  __all__ = ["add"]
		  
		  # Usage
		  from mypackage import add
		  from mypackage.models.user import User
		  ```
	-
	- ## Standard Library Highlights
	  collapsed:: true
		- ```python
		  import os           # OS interface, env vars, paths
		  import sys          # interpreter info, argv, path
		  import json         # JSON encode/decode
		  import re           # regular expressions
		  import datetime     # dates and times
		  import math         # math functions
		  import random       # random numbers
		  import collections  # Counter, defaultdict, deque, OrderedDict
		  import itertools    # combinatorics, infinite iterators
		  import functools    # higher-order functions, lru_cache
		  import threading    # threads
		  import multiprocessing  # processes
		  import subprocess   # run shell commands
		  import logging      # logging framework
		  import unittest     # testing
		  import argparse     # CLI argument parsing
		  import dataclasses  # @dataclass
		  import typing       # type hints
		  import pathlib      # modern file paths
		  import contextlib   # context manager utilities
		  import abc          # abstract base classes
		  import enum         # enumerations
		  import copy         # shallow/deep copy
		  import time         # time functions
		  import hashlib      # hashing (SHA, MD5)
		  import base64       # base64 encoding
		  import csv          # CSV read/write
		  import sqlite3      # SQLite database
		  import http.server  # simple HTTP server
		  import urllib       # URL handling
		  ```
-
- # Advanced Python
  collapsed:: true
	- ## Metaclasses
	  collapsed:: true
		- ```python
		  # Metaclass controls class creation
		  class SingletonMeta(type):
		      _instances = {}
		  
		      def __call__(cls, *args, **kwargs):
		          if cls not in cls._instances:
		              cls._instances[cls] = super().__call__(*args, **kwargs)
		          return cls._instances[cls]
		  
		  class Database(metaclass=SingletonMeta):
		      def __init__(self):
		          self.connection = "Connected"
		  
		  db1 = Database()
		  db2 = Database()
		  print(db1 is db2)  # True — same instance
		  ```
	-
	- ## Descriptors
	  collapsed:: true
		- ```python
		  # Descriptors control attribute access
		  class Validator:
		      def __set_name__(self, owner, name):
		          self.name = name
		  
		      def __get__(self, obj, objtype=None):
		          if obj is None: return self
		          return obj.__dict__.get(self.name)
		  
		      def __set__(self, obj, value):
		          if not isinstance(value, int) or value < 0:
		              raise ValueError(f"{self.name} must be a non-negative int")
		          obj.__dict__[self.name] = value
		  
		  class Product:
		      price = Validator()
		      quantity = Validator()
		  
		      def __init__(self, price, quantity):
		          self.price = price
		          self.quantity = quantity
		  
		  p = Product(10, 5)
		  # p.price = -1  # ValueError
		  ```
	-
	- ## __slots__ — Memory Optimization
	  collapsed:: true
		- ```python
		  # Without __slots__: each instance has a __dict__ (flexible but heavy)
		  # With __slots__: fixed set of attributes, no __dict__, less memory
		  
		  class Point:
		      __slots__ = ("x", "y")
		  
		      def __init__(self, x, y):
		          self.x = x
		          self.y = y
		  
		  p = Point(1, 2)
		  print(p.x)  # 1
		  # p.z = 3   # AttributeError — z not in __slots__
		  # p.__dict__ # AttributeError — no __dict__
		  
		  # Useful when creating millions of small objects
		  ```
	-
	- ## Enums
	  collapsed:: true
		- ```python
		  from enum import Enum, auto, IntEnum
		  
		  class Color(Enum):
		      RED = 1
		      GREEN = 2
		      BLUE = 3
		  
		  class Direction(Enum):
		      NORTH = auto()  # auto-assigns values: 1, 2, 3, 4
		      SOUTH = auto()
		      EAST = auto()
		      WEST = auto()
		  
		  print(Color.RED)          # Color.RED
		  print(Color.RED.value)    # 1
		  print(Color.RED.name)     # "RED"
		  print(Color(2))           # Color.GREEN
		  
		  for c in Color:
		      print(c)
		  
		  # IntEnum — can compare with ints
		  class Status(IntEnum):
		      OK = 200
		      NOT_FOUND = 404
		      ERROR = 500
		  
		  print(Status.OK == 200)   # True
		  ```
	-
	- ## Protocol (Structural Subtyping — Python 3.8+)
	  collapsed:: true
		- ```python
		  from typing import Protocol
		  
		  class Drawable(Protocol):
		      def draw(self) -> None: ...
		  
		  class Circle:
		      def draw(self) -> None:
		          print("Drawing circle")
		  
		  class Square:
		      def draw(self) -> None:
		          print("Drawing square")
		  
		  def render(shape: Drawable) -> None:
		      shape.draw()
		  
		  # No explicit inheritance needed — duck typing with type safety
		  render(Circle())  # Drawing circle
		  render(Square())  # Drawing square
		  ```
-
- # Concurrency
  collapsed:: true
	- ## Threading
	  collapsed:: true
		- ```python
		  import threading
		  
		  def worker(name, count):
		      for i in range(count):
		          print(f"{name}: {i}")
		  
		  t1 = threading.Thread(target=worker, args=("Thread-1", 3))
		  t2 = threading.Thread(target=worker, args=("Thread-2", 3))
		  
		  t1.start()
		  t2.start()
		  t1.join()  # wait for t1 to finish
		  t2.join()
		  
		  # Thread-safe with Lock
		  lock = threading.Lock()
		  counter = 0
		  
		  def increment():
		      global counter
		      with lock:
		          counter += 1
		  
		  # Note: GIL limits CPU-bound threading — use multiprocessing for CPU tasks
		  ```
	-
	- ## Multiprocessing
	  collapsed:: true
		- ```python
		  from multiprocessing import Process, Pool
		  
		  def cpu_task(n):
		      return sum(i**2 for i in range(n))
		  
		  # Process pool — parallel execution
		  with Pool(processes=4) as pool:
		      results = pool.map(cpu_task, [10**6, 10**6, 10**6, 10**6])
		  print(results)
		  
		  # Individual processes
		  p = Process(target=cpu_task, args=(10**6,))
		  p.start()
		  p.join()
		  ```
	-
	- ## concurrent.futures — High-Level API
	  collapsed:: true
		- ```python
		  from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
		  
		  def fetch(url):
		      import time; time.sleep(1)
		      return f"Result from {url}"
		  
		  urls = ["url1", "url2", "url3", "url4"]
		  
		  # ThreadPoolExecutor — good for I/O-bound tasks
		  with ThreadPoolExecutor(max_workers=4) as executor:
		      results = list(executor.map(fetch, urls))
		  print(results)
		  
		  # ProcessPoolExecutor — good for CPU-bound tasks
		  with ProcessPoolExecutor(max_workers=4) as executor:
		      futures = [executor.submit(cpu_task, 10**6) for _ in range(4)]
		      results = [f.result() for f in futures]
		  ```
-
- # Libs & Framework
  collapsed:: true
	- ## 1. Web Development
		- [[Django]]: High-level web framework for building robust web applications.
		- [[Flask]]: Lightweight web framework for small to medium web apps.
		- [[FastAPI]]: Modern, fast (high-performance) web framework for building APIs.
	-
	- ## 2. Data Science & Machine Learning
		- [[NumPy]]: Fundamental package for scientific computing (handling arrays and matrices).
		- [[Pandas]]: Library for data manipulation and analysis, especially for structured data.
		- [[Matplotlib]]: Plotting library for creating static, animated, and interactive visualizations.
		- [[Scikit-learn]]: Machine learning library for data mining and analysis.
		- [[PyTorch]]: Deep learning library for building neural networks.
		- [[XGBoost]]: Optimized gradient boosting library for machine learning.
	-
	- ## 3. Data Visualization
		- [[Seaborn]]: Statistical data visualization based on Matplotlib.
		- [[Plotly]]: Interactive graphing library for making interactive plots.
		- [[Bokeh]]: Interactive visualization library for web applications.
		- [[Altair]]: Declarative statistical visualization library.
	-
	- ## 4. Natural Language Processing (NLP)
		- [[NLTK]]: Toolkit for working with human language data (text).
		- [[spaCy]]: Industrial-strength NLP library for advanced text processing.
		- [[Transformers (by Hugging Face)]]: Pre-trained models for NLP tasks such as text classification, translation, etc.
	-
	- ## 5. Web Scraping
		- [[BeautifulSoup]]: Library for parsing HTML and XML documents and extracting data from them.
		- [[Scrapy]]: Framework for large-scale web scraping and crawling.
		- [[Selenium]]: Web testing tool that can be used for scraping dynamic web pages.
	-
	- ## 6. Automation & Scripting
		- [[Celery]]: Distributed task queue for running asynchronous tasks in the background.
		- [[PyAutoGUI]]: GUI automation library for controlling the mouse and keyboard.
		- [[Watchdog]]: Library to monitor file system events and changes.
	-
	- ## 7. Computer Vision
		- [[OpenCV]]: Open-source computer vision and machine learning software library.
		- [[Pillow]]: Python Imaging Library (PIL) fork for image processing tasks.
		- [[scikit-image]]: Collection of algorithms for image processing in Python.
	-
	- ## 8. Game Development
		- [[Pygame]]: Set of Python modules for writing video games.
		- [[Panda3D]]: Game engine and 3D rendering library.
	-
	- ## 9. Testing
		- [[unittest]]: Python's built-in library for writing unit tests.
		- [[pytest]]: Framework for writing simple and scalable test cases.
		- [[nose2]]: Another unit testing framework that extends the built-in `unittest`.
	-
	- ## 10. Database Interaction
		- [[SQLAlchemy]]: SQL toolkit and Object-Relational Mapping (ORM) library.
		- [[Peewee]]: Simple ORM for SQLite, MySQL, and PostgreSQL.
		- [[Django ORM]]: Built-in ORM for Django web framework.
	-
	- ## 11. Networking
		- [[Socket]]: Built-in Python library for low-level networking.
		- [[Twisted]]: Event-driven networking engine for building network applications.
		- [[requests]]: Simple, elegant HTTP library for interacting with web APIs.
	-
	- ## 12. Cybersecurity & Cryptography
		- [[PyCryptodome]]: Cryptography library that supports various encryption algorithms.
		- [[Scapy]]: Tool for packet manipulation and network testing.
		- [[cryptography]]: Library for implementing secure encryption algorithms.
	-
	- ## 13. GUI Development
		- [[Tkinter]]: Python's built-in library for creating desktop GUI applications.
		- [[PyQt]]: Python bindings for Qt, a popular C++ framework for GUI development.
		- [[Kivy]]: Open-source Python library for developing multitouch applications.
	-
	- ## 14. Scientific Computing & Engineering
		- [[SciPy]]: Library for scientific and technical computing, built on top of NumPy.
		- [[SymPy]]: Symbolic mathematics library.
		- [[Astropy]]: Library for astronomy-related calculations.
	-
	- ## 15. DevOps & Infrastructure Automation
		- [[Ansible]]: Automation tool for IT configuration management and deployment.
		- [[Fabric]]: Library for automating system administration tasks via SSH.
		- [[SaltStack]]: Infrastructure automation tool that allows the management of systems.
	-
	- ## 16. Cloud Computing & Serverless
		- [[Boto3]]: Amazon Web Services (AWS) SDK for Python.
		- [[Google Cloud Client Libraries]]: Python libraries for interacting with Google Cloud services.
		- [[Azure SDK for Python]]: Python library for Microsoft Azure services.
	-
	- ## 17. File Formats
		- [[openpyxl]]: For reading/writing Excel (xlsx) files.
		- [[PyYAML]]: For parsing and writing YAML files.
	-
	- ## 18. Time & Date Manipulation
		- [[Pendulum]]: Date/time library with a more intuitive API than stdlib datetime.
-
- # More Learn
	- Explore the following links for valuable resources, communities, and tools to enhance your skills:
		-
		- ## GitHub & Webs
			- [Python Roadmap](https://github.com/DjangoEx/awesome-python-roadmaps)
			- [Python Patterns](https://github.com/faif/python-patterns)
			- [Track Like samurai🐱‍👤](https://github.com/yangchris11/samurai)
			- [Official Python Docs](https://docs.python.org/3/)
			- [Real Python Tutorials](https://realpython.com/)
			-
			- <ins>ML Concepts</ins>
				- [Learn Machine Learning](https://mlu-explain.github.io/)
			-
			- <ins>Hacking Support</ins>
				- [SherLock](https://github.com/sherlock-project/sherlock)