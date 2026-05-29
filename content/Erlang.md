---
seoTitle: Erlang Programming Reference – Concurrent Distributed Systems Guide
description: "Comprehensive Erlang reference covering pattern matching, actors, lightweight processes, mailboxes, supervision trees, and the OTP framework."
keywords: "Erlang, BEAM, concurrency, actor model, OTP, GenServer, supervisor, distributed systems, pattern matching, processes, syntax reference, cheat sheet, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Erlang
---

- # History
	- **How**:
		- **Erlang** was developed at the **Ericsson Computer Science Laboratory** in **1986** by **Joe Armstrong**, **Robert Virding**, and **Mike Williams**.
		- The goal was to build a language specifically tailored for programming telephone switches, which required extreme concurrency, fault tolerance, and near-zero downtime.
		- Standardized internally at Ericsson, and subsequently released as open-source in **1998**.
		- Erlang pioneered the **Actor Model** of concurrency on the **BEAM VM** (Erlang Run-Time System), laying the architecture for fault-tolerant microservices, chat systems, and modern languages like **Elixir**.
	-
	- **Who**:
		- **Joe Armstrong**, **Robert Virding**, and **Mike Williams** (creators).
	-
	- **Why**:
		- Developed to build massively concurrent, distributed, and highly available systems that can easily survive hardware/software failures and update code on-the-fly without shutting down.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Massive Concurrency (Lightweight Processes)** — Processes are managed by the BEAM VM (not OS threads), taking only ~2KB of memory. Millions of processes can run simultaneously.
		- **Superb Fault Tolerance ("Let it Crash")** — Share-nothing architecture means process crashes do not leak memory or affect other processes. Supervision trees restart failed processes automatically.
		- **Hot Code Loading** — Compile and update logic in a running system without dropping active user connections.
		- **Distributed by Design** — Spawning a process on another machine over the network uses the exact same syntax as spawning locally.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Unorthodox Syntax (Prolog roots)** — Capitalization rules, commas, semicolons, and periods are used as expression separators/terminators, which can feel weird for C/Java developers.
		- **Poor CPU-bound Performance** — BEAM VM is optimized for high-throughput, low-latency I/O (networking). It is slow for compute-heavy number-crunching tasks.
		- **Dynamic Typing Pitfalls** — Type checks occur at runtime, though Dialyzer (static analysis tool) helps catch errors before deployment.
	-
	- ## Remember Points
	  collapsed:: true
		- **Variable Capitalization** — Variables **must** start with an uppercase letter or an underscore. Atoms **must** start with a lowercase letter.
		- **Punctuation Rules**:
			- Comma `,` separates statements.
			- Semicolon `;` separates clauses (like inside case branches or function overloads).
			- Period `.` terminates functions and expressions completely.
-
- # Basics
	- ## Hello World & Module Structure
		- ```erlang
		  -module(hello_world).
		  -export([hello/0]). % Export hello function with 0 arguments
		  
		  hello() ->
		      io:format("Hello, World!~n"). % ~n prints a newline
		  ```
		- `-module(name).` declares module namespace.
		- `-export([func/arity]).` makes functions public.
		- `->` introduces function body.
	-
	- ## Variables and Atoms
		- ```erlang
		  % 1. Variables (must start with Uppercase)
		  % Variables can only be bound once (Single assignment / immutable)
		  Name = "VR Rathod",
		  Age = 25,
		  
		  % 2. Atoms (Lowercase constants whose name is their value)
		  ok,
		  error,
		  undefined,
		  
		  % 3. Tuples (fixed-size structured arrays)
		  Point = {3.14, 2.71},
		  
		  % 4. Lists (dynamic arrays)
		  List = [1, 2, 3]
		  ```
-
- # Operators & Pattern Matching
	- ## The Match Operator (`=`)
	  collapsed:: true
		- ```erlang
		  % In Erlang, '=' is the match operator, not assignment
		  X = 10, % binds X to 10
		  
		  % Match check
		  {ok, Result} = {ok, "success"}, % Result binds to "success"
		  
		  % List splitting
		  [Head | Tail] = [1, 2, 3], % Head = 1, Tail = [2, 3]
		  
		  % Comparisons: =:= (strict equality), =/= (strict inequality)
		  1.0 =:= 1. % returns false (different types)
		  ```
-
- # Control Flow
	- ## Recursion (No Loops)
	  collapsed:: true
		- ```erlang
		  % Erlang has no loop statements. Loop states are processed recursively:
		  sum_list([], Acc) -> Acc;
		  sum_list([Head | Tail], Acc) -> sum_list(Tail, Acc + Head).
		  ```
	-
	- ## Case and If Expressions
	  collapsed:: true
		- ```erlang
		  % 1. Case (pattern match on values)
		  case FileResult of
		      {ok, Content} -> io:format("Read: ~p~n", [Content]);
		      {error, Reason} -> io:format("Failed: ~p~n", [Reason])
		  end,
		  
		  % 2. If (guard-based condition checking)
		  if
		      Age >= 18 -> adult;
		      true -> minor % 'true' acts as default else branch
		  end.
		  ```
-
- # Processes & Concurrency
	- ## Spawning and Message Passing
	  collapsed:: true
		- ```erlang
		  % 1. Spawn a process (executes module:function(args) asynchronously)
		  Pid = spawn(fun() -> 
		      receive
		          {greet, Name} -> io:format("Hello ~p!~n", [Name])
		      end
		  end),
		  
		  % 2. Send message (operator '!')
		  Pid ! {greet, "VR"},
		  
		  % 3. Receive block (reads from process mailbox)
		  receive
		      {ok, Value} -> Value
		  after
		      5000 -> timeout -- exits after 5 seconds
		  end.
		  ```
-
- # OTP Framework (Open Telecom Platform)
	- ## GenServer (Generic Server Behavior)
	  collapsed:: true
		- ```erlang
		  -module(counter_server).
		  -behaviour(gen_server).
		  
		  % API
		  -export([start_link/0, increment/1, get_count/1]).
		  % GenServer Callbacks
		  -export([init/1, handle_call/3, handle_cast/2]).
		  
		  start_link() -> gen_server:start_link(?MODULE, 0, []).
		  
		  increment(Pid) -> gen_server:cast(Pid, increment). % async
		  get_count(Pid) -> gen_server:call(Pid, get_count).  % sync
		  
		  % Callback Implementations
		  init(State) -> {ok, State}.
		  
		  handle_cast(increment, State) -> {noreply, State + 1}.
		  
		  handle_call(get_count, _From, State) -> {reply, State, State}.
		  ```
	-
	- ## Supervision Trees
	  collapsed:: true
		- ```erlang
		  % Supervisors restart failed child servers automatically
		  init([]) ->
		      Children = [
		          #{id => counter_srv,
		            start => {counter_server, start_link, []},
		            restart => permanent, % restart always if crashes
		            type => worker}
		      ],
		      {ok, { #{strategy => one_for_one, intensity => 5, period => 10}, Children }}.
		  ```
-
- # Build Tools & Package Managers
	- ## Rebar3 Compiler
		- **Rebar3**: The standard build tool and compiler chain for Erlang projects.
		- ```bash
		  # Create project from template
		  rebar3 new app my_erlang_project
		  
		  # Compile project files
		  rebar3 compile
		  
		  # Run interactive shell console with project compiled
		  rebar3 shell
		  ```
-
- # More Learn
	- Explore valuable resources for Erlang:
		-
		- [Erlang.org (Official portal)](https://www.erlang.org/)
		- [Learn You Some Erlang for Great Good! (Excellent book)](https://learnyousomeerlang.com/)
		- [Designing for Scalability with Erlang/OTP (O'Reilly)](https://www.oreilly.com/library/view/designing-for-scalability/9781449339791/)
		- [Rebar3 Documentation](https://www.rebar3.org/)
