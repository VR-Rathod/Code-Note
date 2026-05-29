---
seoTitle: Elixir Programming Language – Functional Syntax Reference Guide
description: "Elixir reference covering pattern matching, processes, OTP, GenServer, Phoenix framework, pipelines, and functional programming for concurrent distributed."
keywords: "Elixir programming, Elixir language, OTP, GenServer, Phoenix, pattern matching, processes, functional programming, concurrent, distributed systems, syntax reference, cheat sheet, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Elixir
---

- # History
	- **How**:
		- **Elixir** was created by **José Valim** and first released in **2011**. It is a functional, concurrent language built on the **Erlang VM** (BEAM), which was originally developed for telecom applications by Ericsson in the 1980s.
		- Elixir was designed to bring modern features and improved developer experience to the Erlang ecosystem, including metaprogramming, a more user-friendly syntax, and tools to better support large-scale, concurrent systems.
		- Valim created Elixir because he wanted a language that could offer the same reliability and performance as Erlang but with a more modern syntax and tooling. Elixir leverages Erlang's lightweight process model and fault-tolerant design, which is crucial for building distributed and scalable systems.
		- Since its release, Elixir has become popular in fields like **real-time web applications**, **distributed systems**, and **microservices**, largely due to its focus on concurrency, scalability, and fault tolerance.
	-
	- **Who**:
		- Elixir was created by **José Valim**, a Brazilian software engineer who had previously worked with the Ruby on Rails community. He saw the opportunity to build a language that would harness the power of Erlang's concurrency model while making it more approachable for modern developers.
		- Elixir is open-source and is maintained by the **Elixir Core Team** and the **Elixir community**. The language has seen growing support and adoption from companies and developers building scalable, high-performance systems.
	-
	- **Why**:
		- Elixir was created to provide a modern, functional programming language that could leverage the power of Erlang’s **actor-based concurrency model**, enabling developers to build concurrent, distributed, and fault-tolerant systems.
		- The language aims to improve the **developer experience** compared to Erlang by offering a more accessible syntax, robust tooling (including the **Mix** build tool and **ExUnit** testing framework), and support for metaprogramming.
		- Elixir’s focus on **concurrency**, **fault tolerance**, and **distributed computing** makes it ideal for **real-time applications**, such as messaging systems, web services, and other systems requiring high availability and reliability.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **High Concurrency & Scalability** — Runs on Erlang BEAM VM, allowing millions of lightweight processes to execute concurrently. Perfect for high-traffic real-time systems.
		- **Fault Tolerance** — Follows Erlang's "Let it crash" philosophy. Processes are isolated; failures are isolated and resolved using Supervision Trees.
		- **Hot Code Upgrades** — Allows code deployment and updates to a running server without down-time.
		- **Immutability & Pure Functions** — Side-effect-free programming makes code extremely easy to trace, debug, and test.
		- **Excellent Developer Tooling** — Bundled with Mix (project manager), ExUnit (test runner), Hex (package manager), and IEx (interactive shell).
		- **Meta-programming** — Macro system allows developers to extend the language syntax and write compile-time code generation.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Steep Functional Paradigm Shift** — Learning curve for developers transitioning from object-oriented styles (classes, mutability).
		- **Ecosystem Size** — Smaller overall community and library catalog compared to Python, JavaScript, or Java.
		- **CPU-bound Tasks Performance** — BEAM VM is optimized for highly concurrent, IO-bound operations (networking, databases). It can be slow for intense compute-heavy algorithms (scientific math, image processing).
		- **No Static Types** — Elixir is dynamically typed (though Dialyzer provides static type specs analysis).
	-
	- ## Remember Points
	  collapsed:: true
		- **Processes are NOT Threads** — BEAM processes are extremely lightweight (~2KB memory overhead) and run inside isolated heaps.
		- **State is Held in Processes** — There is no global state. State is persisted by looping processes (like GenServer).
		- **Pattern Matching is Key** — Almost every statement (including assignments) is a pattern match operation.
-
- # Basics
	- ## Hello World & Entry Point
		- ```elixir
		  defmodule MyProject.Main do
		    def hello do
		      IO.puts "Hello, World!"
		    end
		  end
		  
		  # Run function
		  MyProject.Main.hello()
		  ```
		- `defmodule` declares a namespace module in Elixir.
		- `def` defines a public function.
		- `IO.puts` prints a string to the console with a trailing newline.
	-
	- ## Comments
		- ```elixir
		  # This is a single-line comment in Elixir.
		  
		  # There is no native multi-line comment block;
		  # each line in a multi-line comment block must start with '#'
		  
		  @doc "Documentation for functions, used by ExDoc"
		  def documented_function do
		  end
		  ```
	-
	- ## Variables and Atoms
		- ```elixir
		  # Variables are bound to values. They can be rebound, but the data is immutable.
		  name = "VR Rathod"
		  age = 25
		  
		  # Atoms (Constants whose name is their value, similar to Symbols in Ruby)
		  :ok
		  :error
		  :not_found
		  
		  # Booleans are just atoms underneath:
		  # true is equivalent to :true
		  # false is equivalent to :false
		  ```
	-
	- ## Data Types Table
		- ```
		  Type        Example                 Description
		  Integer     42, 0x1F                Standard integer
		  Float       3.14                    Floating-point number
		  Boolean     true, false             Booleans (atoms underneath)
		  Atom        :ok, :error             Constant names
		  String      "Hello"                 UTF-8 encoded binary
		  List        [1, 2, "three"]         Linked list of values (heterogeneous)
		  Tuple       {1, 2, :ok}             Contiguous array of values
		  Map         %{"key" => "value"}     Key-value store
		  ```
-
- # Operators & Pattern Matching
	- ## The Match Operator (`=`)
	  collapsed:: true
		- ```elixir
		  # In Elixir, '=' is the match operator, not assignment
		  x = 1 // Matches x with 1. Since x is unbound, it binds to 1.
		  
		  # Match check
		  1 = x // Matches 1 with value of x (1). Success!
		  # 2 = x // Raises MatchError
		  ```
	-
	- ## Destructuring
	  collapsed:: true
		- ```elixir
		  # Destructure Tuple
		  {status, result} = {:ok, "success"} // status = :ok, result = "success"
		  
		  # Destructure List
		  [head | tail] = [1, 2, 3] // head = 1, tail = [2, 3]
		  ```
	-
	- ## The Pin Operator (`^`)
	  collapsed:: true
		- ```elixir
		  # Use pin operator to match against a variable's existing value rather than rebinding it.
		  x = 10
		  # {^x, y} = {20, 30} // Raises MatchError (expects first element to be 10)
		  {^x, y} = {10, 30} // y = 30
		  ```
-
- # Control Flow
	- ## Conditionals: if, unless, cond
	  collapsed:: true
		- ```elixir
		  # 1. If
		  if age >= 18 do
		    "Adult"
		  else
		    "Minor"
		  end
		  
		  # 2. Unless (negated if)
		  unless is_authorized do
		    "Access Denied"
		  end
		  
		  # 3. Cond (evaluates first expression that evaluates to truthy)
		  cond do
		    score >= 90 -> "Grade A"
		    score >= 80 -> "Grade B"
		    true        -> "Grade F" # default fallback
		  end
		  ```
	-
	- ## Case Expressions
	  collapsed:: true
		- ```elixir
		  # Match on structural shape and values
		  case File.read("data.txt") do
		    {:ok, contents} -> IO.puts("Contents: #{contents}")
		    {:error, :enoent} -> IO.puts("File not found.")
		    {:error, reason}  -> IO.puts("Failed: #{reason}")
		  end
		  ```
	-
	- ## With Expressions
	  collapsed:: true
		- ```elixir
		  # with sequences matching steps. If any step fails to match,
		  # it breaks early and returns the unmatched term.
		  with {:ok, user} <- get_user(1),
		       {:ok, profile} <- get_profile(user.id),
		       {:ok, address} <- parse_address(profile.address) do
		    {:ok, {user, address}}
		  else
		    {:error, reason} -> {:error, "Chaining failed due to: #{reason}"}
		  end
		  ```
	-
	- ## Recursion (No Loops)
	  collapsed:: true
		- ```elixir
		  # Loop through recursion
		  defmodule Math do
		    def sum_list([], acc), do: acc
		    def sum_list([head | tail], acc), do: sum_list(tail, acc + head)
		  end
		  
		  Math.sum_list([1, 2, 3], 0) # 6
		  ```
-
- # Collections
	- ## Lists vs Tuples
	  collapsed:: true
		- ```elixir
		  # Lists: Linked list (fast prepends O(1), slow reads O(n))
		  list = [2, 3]
		  full_list = [1 | list] # [1, 2, 3] (Cons prepending)
		  
		  # Tuples: Contiguous array (fast reads O(1), slow insertions/updates O(n))
		  tuple = {:ok, "data"}
		  elem(tuple, 1) # "data"
		  ```
	-
	- ## Maps
	  collapsed:: true
		- ```elixir
		  # map literals
		  map = %{:name => "Alice", "age" => 30}
		  
		  # Syntactic sugar if keys are atoms
		  atom_map = %{name: "Alice", age: 30}
		  atom_map.name # "Alice"
		  
		  # Updating maps (returns new map)
		  updated_map = %{atom_map | age: 31}
		  ```
	-
	- ## Structs
	  collapsed:: true
		- ```elixir
		  # Structs are extension maps with compile-time checks and default values
		  defmodule User do
		    defstruct name: "Guest", age: 18
		  end
		  
		  guest = %User{} # %User{name: "Guest", age: 18}
		  user = %User{name: "VR", age: 25}
		  ```
	-
	- ## Enum and Stream Modules
	  collapsed:: true
		- ```elixir
		  # Enum evaluates collections eagerly
		  list = [1, 2, 3, 4]
		  doubled = Enum.map(list, fn x -> x * 2 end) # [2, 4, 6, 8]
		  
		  # Stream evaluates collections lazily (infinite processing)
		  stream = Stream.map(list, fn x -> x * 2 end)
		  # Nothing evaluated yet
		  Enum.take(stream, 2) # [2, 4]
		  ```
-
- # Functions & Modules
	- ## Defining Functions & Guards
	  collapsed:: true
		- ```elixir
		  defmodule Account do
		    # Public function
		    def check_eligibility(age) when age >= 18 do
		      :ok
		    end
		    
		    # Overloaded body for pattern match
		    def check_eligibility(_age) do
		      {:error, :underage}
		    end
		    
		    # Private function (defp)
		    defp secret_key do
		      "123"
		    end
		  end
		  ```
	-
	- ## The Pipe Operator (`|>`)
	  collapsed:: true
		- ```elixir
		  # Passes result of expression as first argument of next function
		  string = "  hello world  "
		  
		  # Traditional
		  res = String.capitalize(String.trim(string))
		  
		  # Piped (Highly readable flow)
		  res = 
		    string
		    |> String.trim()
		    |> String.capitalize() # "Hello world"
		  ```
-
- # Processes & Concurrency
	- ## Spawning Processes
	  collapsed:: true
		- ```elixir
		  # Spawn creates a new BEAM lightweight process executing given function
		  pid = spawn(fn -> 
		    IO.puts("Running in background process")
		  end)
		  ```
	-
	- ## Sending & Receiving Messages
	  collapsed:: true
		- ```elixir
		  # Send message
		  send(self(), {:hello, "world"})
		  
		  # Receive message
		  receive do
		    {:hello, msg} -> 
		      IO.puts("Received: #{msg}")
		    {:error, _} -> 
		      IO.puts("Failed")
		  after
		    5000 -> 
		      IO.puts("Timeout after 5 seconds")
		  end
		  ```
-
- # OTP (Open Telecom Platform)
	- ## Agent (State Storage)
	  collapsed:: true
		- ```elixir
		  # Simplifies running background process to store state
		  {:ok, agent} = Agent.start_link(fn -> [] end)
		  
		  Agent.update(agent, fn state -> ["Item 1" | state] end)
		  items = Agent.get(agent, fn state -> state end) # ["Item 1"]
		  ```
	-
	- ## GenServer (Generic Server Process)
	  collapsed:: true
		- ```elixir
		  defmodule QueueServer do
		    use GenServer
		    
		    # Client API
		    def start_link(initial_state) do
		      GenServer.start_link(__MODULE__, initial_state)
		    end
		    
		    def enqueue(pid, element) do
		      GenServer.cast(pid, {:enqueue, element}) # asynchronous
		    end
		    
		    def dequeue(pid) do
		      GenServer.call(pid, :dequeue) # synchronous
		    end
		    
		    # Server Callbacks
		    @impl true
		    def init(state) do
		      {:ok, state}
		    end
		    
		    @impl true
		    def handle_cast({:enqueue, element}, state) do
		      {:noreply, state ++ [element]}
		    end
		    
		    @impl true
		    def handle_call(:dequeue, _from, [head | tail]) do
		      {:reply, head, tail}
		    end
		  end
		  ```
	-
	- ## Supervision Trees
	  collapsed:: true
		- ```elixir
		  # Supervisors monitor worker processes and restart them upon failure
		  children = [
		    {QueueServer, [1, 2, 3]}
		  ]
		  
		  # Start supervisor with One-For-One strategy:
		  # if a child process dies, only that process is restarted.
		  Supervisor.start_link(children, strategy: :one_for_one)
		  ```
-
- # Exception Handling
	- ## Try, Rescue, Raise
	  collapsed:: true
		- ```elixir
		  try do
		    raise "Some error occurred"
		  rescue
		    e in RuntimeError -> IO.puts("Rescued: #{e.message}")
		  after
		    IO.puts("Finished")
		  end
		  ```
-
- # File I/O
	- ## Reading & Writing
	  collapsed:: true
		- ```elixir
		  # Write to file
		  File.write("config.txt", "port=4000\nhost=localhost\n")
		  
		  # Read from file
		  case File.read("config.txt") do
		    {:ok, binary} -> IO.puts(binary)
		    {:error, reason} -> IO.puts("Error: #{reason}")
		  end
		  ```
-
- # Metaprogramming
	- ## Macros: Quote and Unquote
	  collapsed:: true
		- ```elixir
		  # Macros inject code blocks into compile-time AST
		  defmodule Assertion do
		    defmacro assert(expression) do
		      quote do
		        if !unquote(expression) do
		          raise "Assertion failed!"
		        end
		      end
		    end
		  end
		  ```
-
- # Build Tools & Environment
	- ## Mix Commands
		- Mix is the build tool shipped with Elixir.
		- ```bash
		  # Create new project template
		  mix new my_app
		  
		  # Compile project
		  mix compile
		  
		  # Run interactive IEx console with project code loaded
		  iex -S mix
		  
		  # Run tests
		  mix test
		  ```
-
- # Useful Libraries & Frameworks
	- [[Phoenix]] - Scalable, highly performant real-time web framework (like Rails but faster).
	-
	- [[Ecto]] - Data database mapping, validation and query DSL.
	-
	- [[Nerves]] - Build and deploy real-time firmware for embedded systems.
	-
	- [[Jason]] - Fast, pure-Elixir parser for JSON strings.
-
- # More Learn
	- Explore valuable resources for Elixir:
		-
		- [Elixir-lang.org guides](https://elixir-lang.org/getting-started/introduction.html)
		- [HexDocs (Elixir library references)](https://hexdocs.pm/)
		- [Exercism Elixir track](https://exercism.org/tracks/elixir)
		- [Elixir School](https://elixirschool.com/)