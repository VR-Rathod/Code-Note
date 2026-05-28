---
seoTitle: Lua Programming Reference – Embeddable Scripting, Metatables and Coroutines
description: "Comprehensive Lua reference covering tables, metatables, OOP simulation, coroutines concurrency, lexical environment scoping, and C/C++ embedding API."
keywords: "lua, lua scripting, metatables, coroutines, love2d, embeddable, c api, virtual stack, luau, luajit"
displayTitle: Lua
---

- # History
	- **How**:
		- Developed in 1993 by **Roberto Ierusalimschy, Luiz Henrique de Figueiredo, and Waldemar Celes** at the **Pontifical Catholic University of Rio de Janeiro** (PUC-Rio), Brazil.
		- Originally designed to meet strict trade barriers in Brazil, requiring custom, lightweight configuration and data entry tools.
		- Evolved from two earlier configuration languages, SOL (Simple Object Language) and DEL (Data Entry Language), into a complete scripting engine.
		- Developed with a focus on simplicity, portability, embeddability, and a very small memory footprint (the entire compiled interpreter is under 300KB).
		- Standard versions transitioned from Lua 5.0 (introducing register-based VMs), Lua 5.1/5.2 (modifying environment controls), to Lua 5.3/5.4 (introducing distinct integer types, generational garbage collection, and const variables).
	-
	- **Who**:
		- Created by **Roberto Ierusalimschy**, **Luiz Henrique de Figueiredo**, and **Waldemar Celes**.
		- Maintained by PUC-Rio and community contributors.
	-
	- **Why**:
		- Built to be a highly portable, embeddable scripting language for C/C++ applications.
		- Provides a simple mechanism for domain experts, level designers, and configuration managers to write logic without recompiling host applications.
-
- # Introduction
	- ## Core Pillars
	  collapsed:: true
		- **Highly Embeddable** — Acts as a library inside host C/C++ applications, exposing a robust C API for bidirectional communication.
		- **Tables as a Unified Data Structure** — Exposes only one compound data structure, the **Table**, which represents arrays, hashes, objects, sets, and modules.
		- **Cooperative Multitasking** — Employs coroutines to support non-preemptive concurrency without the overhead of OS threads.
		- **Metamechanisms** — Instead of providing rigid features (like OOP), Lua provides extensible mechanisms (metatables) allowing users to construct their own paradigms.
	-
	- ## Advantages
	  collapsed:: true
		- **Extreme Speed** — Among the fastest interpreted languages, especially when executed via **LuaJIT** (which matches native C speeds in many calculations).
		- **Minimal Footprint** — Consumes negligible RAM and binary size, perfect for embedded controllers and mobile game packages.
		- **Clean Portability** — Written in pure ANSI C; compiles out-of-the-box on virtually any compiler and CPU architecture.
		- **Flexible Syntax** — Simple, clean layout with dynamic typing and automatic memory garbage collection.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Sparse Standard Library** — Lacks comprehensive built-in directories, networking, or file-system utilities, requiring external packages (LuaRocks) or host integrations.
		- **1-Based Indexing** — Arrays start at index `1` by default convention, which can cause confusion for developers transitioning from C/C++/Java/Python.
		- **Implicit Global Scoping** — Variables are globally scoped by default unless marked with the `local` keyword, which can lead to scoping bugs if variables are misdeclared.
		- **No Native OOP Classes** — Lacks traditional class-based inheritance declarations, requiring custom metatable construction.
-
- # Basics & Control Flow
  collapsed:: true
	- ## Syntax & Hello World
		- ```lua
		  print("Hello, World!")
		  ```
		- Commands do not require semi-colons, though they are valid delimiters.
	-
	- ## Comments
		- ```lua
		  -- Single-line comment
		  
		  --[[
		    Multi-line
		    comment block
		  --]]
		  ```
	-
	- ## Variables & Types
		- Variables are dynamically typed. Variables are globally scoped by default unless explicitly declared `local` (highly recommended for performance and scope safety).
		- ```lua
		  local str = "Alice"        -- string
		  local num = 42             -- number (double-precision float by default)
		  local intVal = 100         -- number (integer type in Lua 5.3+)
		  local isTrue = true        -- boolean
		  local empty = nil          -- nil (signifies absence of value)
		  local myTable = {}         -- table
		  local myFunc = function() end -- function
		  
		  -- Constants (Lua 5.4+)
		  local MAX_LIMIT <const> = 500
		  ```
	-
	- ## Operators & Precedence
		- ```lua
		  -- Arithmetic: +, -, *, /, %, ^ (exponentiation), // (floor division)
		  -- String Concatenation: ..
		  local msg = "Value: " .. 42 -- "Value: 42"
		  
		  -- Length operator: #
		  local arr = {10, 20, 30}
		  print(#arr) -- Outputs 3
		  
		  -- Logical: and, or, not (nil and false are falsy; 0 and empty strings are truthy!)
		  local val = nil or "default" -- "default"
		  ```
	-
	- ## Control Flow
		- ```lua
		  -- if-elseif-else
		  local score = 85
		  if score >= 90 then
		      print("A")
		  elseif score >= 80 then
		      print("B")
		  else
		      print("C")
		  end
		  
		  -- loops: while
		  local count = 1
		  while count <= 3 do
		      count = count + 1
		  end
		  
		  -- loops: repeat-until (executes at least once)
		  local x = 10
		  repeat
		      x = x - 1
		  until x == 5
		  
		  -- Numeric for: (start, limit, step)
		  for i = 1, 5, 2 do
		      print(i) -- Prints 1, 3, 5
		  end
		  ```
-
- # Functions & Closures
  collapsed:: true
	- ## Declarations & Multiple Returns
		- ```lua
		  local function getCoordinates()
		      return 100, 200 -- Multiple return values
		  end
		  
		  local x, y = getCoordinates()
		  ```
	-
	- ## Variadic Parameters
		- Exposes parameters pack using `...`.
		- ```lua
		  local function sum(...)
		      local total = 0
		      local args = {...} -- pack arguments into table
		      for i = 1, #args do
		          total = total + args[i]
		      end
		      return total
		  end
		  
		  print(sum(1, 2, 3, 4)) -- 10
		  ```
	-
	- ## Closures & Lexical Scoping
		- Functions are first-class values and can capture state (upvalues) from their enclosing scope.
		- ```lua
		  local function createCounter()
		      local count = 0 -- local upvalue
		      return function()
		          count = count + 1
		          return count
		      end
		  end
		  
		  local counter = createCounter()
		  print(counter()) -- 1
		  print(counter()) -- 2
		  ```
-
- # Tables
  collapsed:: true
	- ## Arrays & Dictionaries
		- The Table is Lua's only data structure. Arrays are 1-indexed by convention.
		- ```lua
		  -- 1. Array (elements at integer keys starting at 1)
		  local fruits = {"Apple", "Banana", "Cherry"}
		  print(fruits[1]) -- "Apple"
		  
		  -- 2. Dictionary (hash map)
		  local user = {
		      name = "John",
		      age = 30
		  }
		  print(user.name) -- Dot notation syntactic sugar for user["name"]
		  ```
	-
	- ## Table Helper Catalog
		- ```lua
		  local list = {"A", "B"}
		  
		  table.insert(list, "C")        -- Appends to array end: {"A", "B", "C"}
		  table.insert(list, 2, "X")     -- Inserts at index 2: {"A", "X", "B", "C"}
		  table.remove(list, 2)          -- Removes index 2: {"A", "B", "C"}
		  
		  local str = table.concat(list, "-") -- Concatenate: "A-B-C"
		  
		  local numbers = {5, 2, 8}
		  table.sort(numbers)            -- Sorts table in-place: {2, 5, 8}
		  ```
-
- # Metatables & Object-Oriented Simulation
  collapsed:: true
	- ## Metatables & Overriding Behavior
		- Metatables allow modifying behavior of tables when operations are performed (e.g. adding two tables).
		- ```lua
		  local mt = {
		      -- __add overrides addition (+) operator
		      __add = function(table1, table2)
		          local result = {}
		          for k, v in pairs(table1) do result[k] = v end
		          for k, v in pairs(table2) do result[k] = (result[k] or 0) + v end
		          return result
		      end,
		      
		      -- __tostring overrides string formatting
		      __tostring = function(t)
		          return "Vector {" .. (t.x or 0) .. ", " .. (t.y or 0) .. "}"
		      end
		  }
		  
		  local vec1 = {x = 10, y = 2}
		  local vec2 = {x = 5, y = 8}
		  
		  setmetatable(vec1, mt)
		  setmetatable(vec2, mt)
		  
		  local vec3 = vec1 + vec2
		  setmetatable(vec3, mt)
		  print(vec3) -- Vector {15, 10}
		  ```
	-
	- ## __index and __newindex Fallbacks
		- **`__index`**: Triggered when reading a key not present in the table. Can point to a fallback table or function.
		- **`__newindex`**: Triggered when writing a key not present in the table.
		- ```lua
		  local defaults = {ip = "127.0.0.1", port = 80}
		  local config = {}
		  
		  setmetatable(config, {
		      __index = defaults -- If key not found, check defaults table
		  })
		  
		  print(config.ip)   -- "127.0.0.1" (from defaults)
		  config.ip = "8.8.8.8"
		  print(config.ip)   -- "8.8.8.8" (stored locally in config now)
		  ```
	-
	- ## Prototype-Based Object-Oriented Programming (OOP)
		- Using metatables and `__index` pointers, we can implement standard class and inheritance patterns.
		- ```lua
		  -- 1. Base Class definition
		  local Shape = {}
		  Shape.__index = Shape
		  
		  function Shape.new(x, y)
		      local instance = setmetatable({}, Shape)
		      instance.x = x
		      instance.y = y
		      return instance
		  end
		  
		  function Shape:move(dx, dy)
		      self.x = self.x + dx
		      self.y = self.y + dy
		  end
		  
		  -- 2. Inheritance definition
		  local Circle = setmetatable({}, { __index = Shape }) -- Circle inherits from Shape
		  Circle.__index = Circle
		  
		  function Circle.new(x, y, radius)
		      local instance = Shape.new(x, y) -- Call base constructor
		      setmetatable(instance, Circle)   -- Bind instance to subclass
		      instance.radius = radius
		      return instance
		  end
		  
		  -- Override method
		  function Circle:draw()
		      return "Circle at " .. self.x .. ", " .. self.y .. " radius " .. self.radius
		  end
		  
		  local c = Circle.new(10, 10, 5)
		  c:move(5, -2) -- Calls base method
		  print(c:draw()) -- "Circle at 15, 8 radius 5"
		  ```
-
- # Coroutines (Multitasking)
  collapsed:: true
	- ## Coroutine Lifecycle & State Machine
		- Coroutines provide non-preemptive cooperative multitasking. A coroutine must explicitly yield control using `coroutine.yield()`.
		- States:
		  - `suspended`: Created, or yielded.
		  - `running`: Actively executing.
		  - `normal`: Active, but suspended waiting for another coroutine to return (e.g. nested calls).
		  - `dead`: Finished execution, or crashed.
	-
	- ## Producer-Consumer Pipeline Example
		- ```lua
		  local producer = coroutine.create(function()
		      for i = 1, 3 do
		          print("Producer: Generating " .. i)
		          coroutine.yield(i) -- Suspend execution, returning value to resume() call
		      end
		  end)
		  
		  local consumer = function()
		      while true do
		          local status, val = coroutine.resume(producer) -- Transfer execution control to producer
		          if not status or coroutine.status(producer) == "dead" then
		              print("Producer dead. Terminating.")
		              break
		          end
		          print("Consumer: Received " .. val)
		      end
		  end
		  
		  consumer()
		  -- Output:
		  -- Producer: Generating 1
		  -- Consumer: Received 1
		  -- Producer: Generating 2
		  -- Consumer: Received 2
		  -- Producer: Generating 3
		  -- Consumer: Received 3
		  -- Producer dead. Terminating.
		  ```
-
- # Environments & Scopes
  collapsed:: true
	- ## Global Table (_G)
		- All global variables reside in the standard global table `_G`.
		- ```lua
		  x = 100
		  print(_G.x) -- 100
		  ```
	-
	- ## Lexical Scoping (_ENV) & Sandboxing
		- Since Lua 5.2, global variables compile down to lookups in the lexical environment table **`_ENV`**. By overriding `_ENV`, you can completely isolate and sandbox untrusted code blocks.
		- ```lua
		  -- Secure Sandboxing environment creation
		  local sandbox_env = {
		      print = print, -- Only allow standard output printing
		      math = math    -- Only allow mathematical libraries
		  }
		  
		  local untrusted_code = load([[
		      print(math.sin(1))
		      -- os.exit() -- Compile error! Not in sandboxed _ENV environment
		  ]])
		  
		  -- Assign the sandbox environment to the code chunk function
		  setupvalue(untrusted_code, 1, sandbox_env) 
		  untrusted_code()
		  ```
-
- # Embedding Lua in C/C++ (C API)
  collapsed:: true
	- ## The Virtual Stack Concept
		- Bidirectional data transfer between Lua and C/C++ is managed via a virtual execution stack. Access is managed strictly via stack indexes:
		  - Positive index: index from bottom (1 = first element pushed).
		  - Negative index: index from top (-1 = top element).
	-
	- ## Basic Integration C Code
		- Exposes setup operations to load standard libraries, push values, and compile execution paths.
		- ```c
		  #include <lua.h>
		  #include <lualib.h>
		  #include <lauxlib.h>
		  
		  int main(void) {
		      lua_State *L = luaL_newstate(); // Initialize Lua State
		      luaL_openlibs(L);               // Load standard libraries
		  
		      // 1. Run string path
		      luaL_dostring(L, "x = 10 + 5");
		  
		      // 2. Query variable from Lua global stack
		      lua_getglobal(L, "x");          // Push global variable 'x' onto stack
		      if (lua_isnumber(L, -1)) {      // Inspect top of stack
		          int x = (int)lua_tonumber(L, -1);
		          printf("x from Lua: %d\n", x);
		      }
		      lua_pop(L, 1);                  // Pop variable from stack
		  
		      // Close environment
		      lua_close(L);
		      return 0;
		  }
		  ```
-
- # Comparison: Lua vs C++
  collapsed:: true
	- ## Direct Comparison Table
		- ```
		  Feature                  Lua                                     C++
		  Execution Model          VM Interpreter / JIT compilation        Compiled direct to Machine assembly (AOT)
		  Memory Management        Automatic Garbage Collection (GC)       Manual RAII / Smart Pointers / Raw delete
		  Type Safety              Dynamic typing                          Strict static compile-time typing
		  Index Convention         1-based indexing by default             0-based indexing
		  Standard Libraries       Extremely sparse standard libraries     Massive Standard Template Library (STL)
		  Concurrency Safety       Cooperative Coroutines (Single-thread)  Threads, Mutex locks, async futures
		  Extensibility            Exposed C API integration wrapper       Requires manually compiling libraries/headers
		  ```
-
- # Libs & Framework
	- ## Core Libraries and Package Managers:
		- [[LuaRocks]] - The official package manager, allowing dependency installations and module packing.
		- [[LuaSocket]] - Networking library providing support for raw TCP, UDP, and HTTP sockets.
	-
	- ## Game Frameworks:
		- [[Love]] - High-performance 2D game engine executing Lua scripting logic (LÖVE).
		- [[Defold]] - Multiplatform 2D/3D game engine utilizing Lua for script logic layers.
	-
	- ## Alternative Compilers & Dialects:
		- [[Luau]] - Roblox's performance-focused, statically typed compiler derivative of Lua.
		- [[LuaJIT]] - Just-In-Time compiler for Lua, achieving native speeds on CPU-bound code.
-
- # More Learn
	- Explore the following links for valuable resources, communities, and tools to enhance your skills : -
		- [Lua Official Website](https://www.lua.org/)
		- [Lua 5.4 Reference Manual](https://www.lua.org/manual/5.4/)
		- [Programming in Lua Book](https://www.lua.org/pil/)
		- [Love2D Game Development Wiki](https://love2d.org/wiki/Main_Page)