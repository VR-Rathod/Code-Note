---
seoTitle: Class in OOP – Complete In-Depth Guide | Blueprints, Attributes, Methods, Access Modifiers
description: "Deep dive into Classes in Object-Oriented Programming. Covers what a class is, anatomy of a class, attributes vs methods, access modifiers, static vs instance members, constructors, class relationships, memory model, and when to use classes. With code examples in Python, C++, Java, JavaScript, and C#."
keywords: "class, OOP, object-oriented programming, class definition, class vs object, attributes, methods, constructor, destructor, access modifiers, static members, instance members, encapsulation, class anatomy, class diagram, class memory model, Python class, C++ class, Java class, JavaScript class, CSharp class, VR-Rathod, Code-Note, Vaibhav Rathod"
displayTitle: Class in OOP
---

> [!info] What is a Class?
> A **Class** is a **blueprint / template** for creating objects. It defines what **data** (attributes) an object will hold and what **actions** (methods) it can perform. A class does not occupy memory by itself — memory is allocated only when an **object** (instance) is created from it.

- # Explanation
	- ## Real-World Analogy
		- Think of a class as an **architectural blueprint of a house**.
		- The **blueprint** itself is not a house — it describes how a house should look (rooms, walls, windows).
		- Every actual **house built** from that blueprint is an **object** (an instance of the blueprint).
		- Multiple different houses can be built from the same blueprint, each with their own address, color, and furniture — but they all share the same structure.
		- | Blueprint Concept | OOP Equivalent |
		  |---|---|
		  | Blueprint / Template | **Class** |
		  | Actual House built | **Object / Instance** |
		  | Blueprint's room plan | **Attributes (fields)** |
		  | Blueprint's instructions | **Methods (functions)** |
		  | Building the house | **Instantiation (`new` keyword)** |
	-
	- ## Why Do We Need Classes?
	  collapsed:: true
		- Without classes, we'd write duplicate code for every object (e.g., writing a separate function for every user, every car, etc.). Classes solve this through **reusability**, **organization**, and **abstraction**.
		- ```
		  WITHOUT classes:                     WITH a class:
		  
		  user1_name = "Alice"                 class User:
		  user1_age  = 30                          def __init__(self, name, age):
		  user2_name = "Bob"                           self.name = name
		  user2_age  = 25                              self.age = age
		  ...
		                                       user1 = User("Alice", 30)
		                                       user2 = User("Bob", 25)
		  ```
		- > [!tip] Classes group related data and behavior together, making code easier to read, maintain, and scale.
-
- # Anatomy of a Class
  collapsed:: true
	- A class has multiple distinct parts. Each part serves a specific role:
	-
	- ```mermaid
	  classDiagram
	      class BankAccount {
	          - String ownerName
	          - float balance
	          - String accountNumber
	          + __init__(owner, initialBalance)
	          + deposit(amount) void
	          + withdraw(amount) bool
	          + get_balance() float
	          + __str__() String
	      }
	  ```
	-
	- | Class Part | Symbol | Role |
	  |---|---|---|
	  | **Class Name** | `BankAccount` | Identifier — must be unique and descriptive (PascalCase convention) |
	  | **Attributes / Fields** | `ownerName`, `balance` | Store the **state** of the object (data it holds) |
	  | **Constructor** | `__init__` | Special method to **initialize** attributes when the object is created |
	  | **Instance Methods** | `deposit()`, `withdraw()` | Functions that **operate on** the object's data |
	  | **Access Modifiers** | `+` public, `-` private | Control **who can access** what |
	  | **Return Types** | `void`, `float`, `bool` | What the method returns |
	-
	- ## The Three Zones Inside a Class
	  collapsed:: true
		- ```
		  ┌───────────────────────────────────────────────┐
		  │               CLASS: BankAccount              │
		  ├───────────────────────────────────────────────┤
		  │  ZONE 1: CLASS-LEVEL DATA (Attributes)        │
		  │  ─────────────────────────────────────────    │
		  │  owner_name    : str    → "Alice"             │
		  │  balance       : float  → 1000.00             │
		  │  account_num   : str    → "ACC-001"           │
		  ├───────────────────────────────────────────────┤
		  │  ZONE 2: CONSTRUCTOR (Initialization)         │
		  │  ─────────────────────────────────────────    │
		  │  __init__(self, owner, balance)               │
		  │    Runs automatically on object creation.     │
		  │    Sets initial values of all attributes.     │
		  ├───────────────────────────────────────────────┤
		  │  ZONE 3: BEHAVIOR (Methods)                   │
		  │  ─────────────────────────────────────────    │
		  │  deposit(amount)  → Adds money                │
		  │  withdraw(amount) → Removes money if valid    │
		  │  get_balance()    → Returns current balance   │
		  └───────────────────────────────────────────────┘
		  ```
-
- # Attributes vs Methods
  collapsed:: true
	- ## Attributes (Fields / Properties)
	  collapsed:: true
		- Attributes store the **state** (data) of an object.
		- There are two types of attributes:
		- | Type | Where Defined | Scope | Memory |
		  |---|---|---|---|
		  | **Instance Attribute** | Inside `__init__` (or constructor) with `self.` | Belongs to each **individual object** | New copy per object |
		  | **Class Attribute** | Outside any method, at class level | **Shared** across all objects | One shared copy |
		-
		- ```python
		  class Dog:
		      species = "Canis lupus familiaris"  # ← Class Attribute (shared)
		  
		      def __init__(self, name, age):
		          self.name = name  # ← Instance Attribute (unique per object)
		          self.age = age    # ← Instance Attribute
		  
		  dog1 = Dog("Buddy", 3)
		  dog2 = Dog("Luna", 5)
		  
		  print(dog1.species)  # Canis lupus familiaris (from class)
		  print(dog2.species)  # Canis lupus familiaris (same shared)
		  print(dog1.name)     # Buddy  (unique to dog1)
		  print(dog2.name)     # Luna   (unique to dog2)
		  ```
		-
		- > [!important] Instance attributes are unique per object. Class attributes are shared by all instances. Changing a class attribute affects ALL objects.
	-
	- ## Methods (Behaviors)
	  collapsed:: true
		- Methods are **functions defined inside a class**. They define what the object can **do** and how it interacts with its data.
		- | Method Type | Decorator | First Param | When to Use |
		  |---|---|---|---|
		  | **Instance Method** | *(none)* | `self` | Operate on instance data (most common) |
		  | **Class Method** | `@classmethod` | `cls` | Operate on class-level data; factory constructors |
		  | **Static Method** | `@staticmethod` | *(none)* | Utility functions related to the class but needing no instance/class data |
		-
		- ```python
		  class Temperature:
		      scale = "Celsius"  # Class attribute
		  
		      def __init__(self, value):
		          self.value = value  # Instance attribute
		  
		      # --- Instance Method ---
		      def to_fahrenheit(self):
		          return (self.value * 9/5) + 32
		  
		      # --- Class Method ---
		      @classmethod
		      def from_fahrenheit(cls, f_value):
		          return cls((f_value - 32) * 5/9)
		  
		      # --- Static Method ---
		      @staticmethod
		      def boiling_point():
		          return 100  # Always 100°C, needs no instance data
		  
		  t1 = Temperature(25)
		  print(t1.to_fahrenheit())          # 77.0  — uses instance data
		  
		  t2 = Temperature.from_fahrenheit(77)  # creates object via classmethod
		  print(t2.value)                     # 25.0
		  
		  print(Temperature.boiling_point())  # 100   — no instance needed
		  ```
-
- # Access Modifiers
  collapsed:: true
	- Access modifiers control **who can see and use** an attribute or method from outside the class. They are a key part of [[Encapsulation]].
	-
	- | Modifier | Syntax (Python) | Syntax (Java/C#/C++) | Who Can Access |
	  |---|---|---|---|
	  | **Public** | `self.name` (no prefix) | `public` | Accessible from **anywhere** |
	  | **Protected** | `self._name` (single underscore) | `protected` | Accessible within the class and **subclasses** |
	  | **Private** | `self.__name` (double underscore) | `private` | Accessible **only within** the class itself |
	-
	- ```mermaid
	  flowchart LR
	      subgraph "Outside World"
	          EX[External Code]
	      end
	      subgraph "Subclass"
	          SUB[Child Class]
	      end
	      subgraph "Class"
	          PUB["✅ Public\nself.name"]
	          PRO["⚠️ Protected\nself._name"]
	          PRI["❌ Private\nself.__name"]
	      end
	  
	      EX -- "can access" --> PUB
	      EX -- "should not access" --> PRO
	      EX -- "cannot access" --> PRI
	      SUB -- "can access" --> PUB
	      SUB -- "can access" --> PRO
	      SUB -- "cannot access" --> PRI
	  ```
	-
	- > [!tip] Python enforces private access through **name mangling** — `self.__name` is internally stored as `self._ClassName__name`. It's a convention, not a hard lock. Java/C++ enforce it strictly at compile time.
-
- # Class vs Object (Instance)
  collapsed:: true
	- A class and an object are **not the same thing**. A class is a template; an object is a living realization of that template.
	-
	- | Concept | Class | Object |
	  |---|---|---|
	  | **What it is** | Blueprint / Template | Actual usable entity in memory |
	  | **Memory** | No memory allocated (just a definition) | Memory allocated at creation |
	  | **How many** | Defined once | Can have thousands of instances |
	  | **Created with** | `class` keyword | Constructor call (`Dog("Buddy", 3)`) |
	  | **Example** | `class Car:` | `my_car = Car("Tesla", "Model 3")` |
	-
	- ## Memory Model: What Happens When You Create an Object
	  collapsed:: true
		- ```
		  ─── Class Definition (stored in code segment, no heap allocation) ───
		  
		  class Car:                  ← Blueprint lives here
		      def __init__(self, brand, model):
		          self.brand = brand
		          self.model = model
		      def drive(self):
		          print(f"{self.brand} is driving!")
		  
		  
		  ─── After: my_car = Car("Toyota", "Corolla") ───
		  
		  STACK                       HEAP
		  ┌──────────┐               ┌──────────────────────────────┐
		  │ my_car   │──────────────▶│  Object: Car                 │
		  │ (ref ptr)│               │  ─────────────────────────── │
		  └──────────┘               │  brand = "Toyota"            │
		                             │  model = "Corolla"           │
		                             │  [methods → shared via class] │
		                             └──────────────────────────────┘
		  
		  ─── After: your_car = Car("Honda", "Civic") ───
		  
		  STACK                       HEAP
		  ┌──────────┐               ┌──────────────────────────────┐
		  │ your_car │──────────────▶│  Object: Car                 │
		  │ (ref ptr)│               │  brand = "Honda"             │
		  └──────────┘               │  model = "Civic"             │
		                             └──────────────────────────────┘
		  
		  Note: Both objects SHARE the same class methods (drive),
		        but have their OWN brand/model attribute copies.
		  ```
-
- # Static vs Instance Members
  collapsed:: true
	- | Feature | Instance Member | Static Member |
	  |---|---|---|
	  | **Belongs to** | Each individual object | The class itself |
	  | **Access via** | `object.attribute` | `ClassName.attribute` |
	  | **Memory** | Separate copy per object | Single shared copy |
	  | **Can access** | Instance + class data | Class data only (no `self`) |
	  | **Use case** | Per-object state (name, age) | Shared counters, constants, utilities |
	-
	- ```python
	  class Counter:
	      count = 0  # Static/Class attribute
	  
	      def __init__(self, name):
	          self.name = name       # Instance attribute
	          Counter.count += 1     # Modify shared class attribute
	  
	      @staticmethod
	      def get_count():
	          return Counter.count
	  
	  a = Counter("Alpha")
	  b = Counter("Beta")
	  c = Counter("Gamma")
	  
	  print(Counter.get_count())  # 3 — shared count across all instances
	  print(a.name)               # Alpha — unique to 'a'
	  ```
-
- # Class Relationships
  collapsed:: true
	- Classes rarely exist in isolation. They relate to each other in structured ways:
	-
	- ```mermaid
	  classDiagram
	      direction LR
	  
	      class Animal {
	          +String name
	          +speak() void
	      }
	      class Dog {
	          +String breed
	          +fetch() void
	      }
	      class Owner {
	          +String ownerName
	      }
	      class Collar {
	          +String material
	      }
	  
	      Animal <|-- Dog : Inheritance (is-a)
	      Owner "1" o-- "0..*" Dog : Aggregation (has-a, independent)
	      Dog "1" *-- "1" Collar : Composition (has-a, dependent)
	  ```
	-
	- | Relationship | Symbol | Meaning | Example |
	  |---|---|---|---|
	  | **Inheritance** | `<|--` | Child **is-a** Parent. Child inherits all parent behavior | `Dog` is-a `Animal` |
	  | **Composition** | `*--` | Strong ownership — child **cannot exist** without parent | `Collar` cannot exist without `Dog` |
	  | **Aggregation** | `o--` | Weak relationship — child **can exist** independently | `Owner` has `Dog`, but dog can survive without owner |
	  | **Association** | `-->` | General relationship — one class **uses** another | `Car` uses `Engine` |
-
- # How It Works
  collapsed:: true
	- ## Step-by-Step: Class Creation to Object Use
	  collapsed:: true
		- ```
		  1. DEFINE THE CLASS
		     └─ Use 'class' keyword
		     └─ Name it (PascalCase: MyClass)
		     └─ Define attributes in __init__
		     └─ Define methods as functions inside
		  
		  2. INSTANTIATE AN OBJECT
		     └─ Call ClassName(args)
		     └─ Python calls __new__() to allocate memory
		     └─ Python calls __init__() to set attribute values
		     └─ Returns the object reference
		  
		  3. USE THE OBJECT
		     └─ Access attributes: obj.attribute
		     └─ Call methods:     obj.method()
		     └─ Modify state:     obj.attribute = new_value
		  
		  4. OBJECT IS DESTROYED
		     └─ Goes out of scope / garbage collected
		     └─ __del__() called (destructor) if defined
		     └─ Memory freed
		  ```
	-
	- ## Lifecycle Flowchart
	  collapsed:: true
		- ```mermaid
		  flowchart TD
		      A["📝 Class Definition\n(Blueprint created)"] --> B["🏗️ Instantiation\nobj = MyClass(args)"]
		      B --> C["🔧 __new__() called\nMemory allocated on heap"]
		      C --> D["⚙️ __init__() called\nAttributes initialized with values"]
		      D --> E["✅ Object ready to use\nobj.attribute / obj.method()"]
		      E --> F{Object still needed?}
		      F -- "Yes" --> E
		      F -- "No (out of scope)" --> G["🗑️ __del__() called\nCleanup / destructor runs"]
		      G --> H["♻️ Memory freed by\nGarbage Collector"]
		  ```
-
- # Implementation
  collapsed:: true
	- > [!note] Full class implementation of a `BankAccount` — demonstrating attributes, constructor, instance methods, class methods, static methods, access modifiers, and `__str__` / `__repr__` dunder methods.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  
	  class BankAccount:
	      """A class representing a bank account."""
	  
	      # Class attribute (shared by all accounts)
	      bank_name: str = "Code Bank"
	      _total_accounts: int = 0
	  
	      def __init__(self, owner: str, initial_balance: float = 0.0):
	          # Instance attributes (unique per object)
	          self.owner: str = owner            # public
	          self.__balance: float = initial_balance  # private (name-mangled)
	          self._account_id: str = f"ACC-{BankAccount._total_accounts + 1:04d}"  # protected
	          BankAccount._total_accounts += 1
	  
	      # ── Instance Methods ──────────────────────────────
	      def deposit(self, amount: float) -> None:
	          """Add money to the account."""
	          if amount <= 0:
	              raise ValueError("Deposit amount must be positive.")
	          self.__balance += amount
	          print(f"✅ Deposited ${amount:.2f}. New balance: ${self.__balance:.2f}")
	  
	      def withdraw(self, amount: float) -> bool:
	          """Remove money if sufficient funds exist."""
	          if amount <= 0:
	              raise ValueError("Withdrawal must be positive.")
	          if amount > self.__balance:
	              print(f"❌ Insufficient funds. Balance: ${self.__balance:.2f}")
	              return False
	          self.__balance -= amount
	          print(f"✅ Withdrew ${amount:.2f}. New balance: ${self.__balance:.2f}")
	          return True
	  
	      def get_balance(self) -> float:
	          """Getter for the private __balance attribute."""
	          return self.__balance
	  
	      # ── Class Method ──────────────────────────────────
	      @classmethod
	      def get_total_accounts(cls) -> int:
	          """Returns how many accounts have been created."""
	          return cls._total_accounts
	  
	      # ── Static Method ─────────────────────────────────
	      @staticmethod
	      def is_valid_amount(amount: float) -> bool:
	          """Utility: checks if an amount is a valid positive number."""
	          return isinstance(amount, (int, float)) and amount > 0
	  
	      # ── Dunder Methods (Magic Methods) ────────────────
	      def __str__(self) -> str:
	          """Human-readable string for print()."""
	          return f"[{self._account_id}] Owner: {self.owner} | Balance: ${self.__balance:.2f}"
	  
	      def __repr__(self) -> str:
	          """Developer-friendly representation."""
	          return f"BankAccount(owner='{self.owner}', balance={self.__balance})"
	  
	  
	  # ── Usage ────────────────────────────────────────────────
	  acc1 = BankAccount("Alice", 500.0)
	  acc2 = BankAccount("Bob")
	  
	  acc1.deposit(200)          # ✅ Deposited $200.00. New balance: $700.00
	  acc1.withdraw(100)         # ✅ Withdrew $100.00.  New balance: $600.00
	  acc1.withdraw(800)         # ❌ Insufficient funds. Balance: $600.00
	  
	  print(acc1)                # [ACC-0001] Owner: Alice | Balance: $600.00
	  print(repr(acc1))          # BankAccount(owner='Alice', balance=600.0)
	  
	  print(BankAccount.get_total_accounts())       # 2
	  print(BankAccount.is_valid_amount(-50))       # False
	  print(BankAccount.bank_name)                  # Code Bank
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <stdexcept>
	  
	  class BankAccount {
	  private:
	      // Private instance attributes
	      double balance_;
	      std::string account_id_;
	  
	      // Private static class attribute (shared)
	      static int total_accounts_;
	  
	  public:
	      // Public instance attributes
	      std::string owner;
	      static std::string bank_name;
	  
	      // ── Constructor ───────────────────────────────────
	      BankAccount(const std::string& owner_name, double initial_balance = 0.0)
	          : owner(owner_name), balance_(initial_balance) {
	          ++total_accounts_;
	          account_id_ = "ACC-" + std::to_string(total_accounts_);
	      }
	  
	      // ── Destructor ────────────────────────────────────
	      ~BankAccount() {
	          std::cout << "Account " << account_id_ << " closed.\n";
	      }
	  
	      // ── Instance Methods ──────────────────────────────
	      void deposit(double amount) {
	          if (amount <= 0) throw std::invalid_argument("Amount must be positive.");
	          balance_ += amount;
	          std::cout << "Deposited $" << amount << ". Balance: $" << balance_ << "\n";
	      }
	  
	      bool withdraw(double amount) {
	          if (amount > balance_) {
	              std::cout << "Insufficient funds.\n";
	              return false;
	          }
	          balance_ -= amount;
	          std::cout << "Withdrew $" << amount << ". Balance: $" << balance_ << "\n";
	          return true;
	      }
	  
	      double getBalance() const { return balance_; }
	  
	      // ── Static Method ─────────────────────────────────
	      static int getTotalAccounts() { return total_accounts_; }
	  
	      // ── Overloaded operator for printing ──────────────
	      friend std::ostream& operator<<(std::ostream& os, const BankAccount& acc) {
	          os << "[" << acc.account_id_ << "] Owner: " << acc.owner
	             << " | Balance: $" << acc.balance_;
	          return os;
	      }
	  };
	  
	  // ── Static member initialization (required in .cpp) ───────────────────
	  int BankAccount::total_accounts_ = 0;
	  std::string BankAccount::bank_name = "Code Bank";
	  
	  int main() {
	      BankAccount acc1("Alice", 500.0);
	      BankAccount acc2("Bob");
	  
	      acc1.deposit(200);       // Deposited $200. Balance: $700
	      acc1.withdraw(100);      // Withdrew $100.  Balance: $600
	      acc1.withdraw(800);      // Insufficient funds.
	  
	      std::cout << acc1 << "\n";                     // [ACC-1] Owner: Alice | Balance: $600
	      std::cout << BankAccount::getTotalAccounts(); // 2
	      return 0;
	  }
	  // Note: destructors auto-called when acc1/acc2 go out of scope
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  public class BankAccount {
	  
	      // Private instance fields
	      private double balance;
	      private String accountId;
	  
	      // Public instance fields
	      public String owner;
	  
	      // Static (class-level) fields
	      public static String bankName = "Code Bank";
	      private static int totalAccounts = 0;
	  
	      // ── Constructor ───────────────────────────────────
	      public BankAccount(String owner, double initialBalance) {
	          this.owner = owner;
	          this.balance = initialBalance;
	          totalAccounts++;
	          this.accountId = String.format("ACC-%04d", totalAccounts);
	      }
	  
	      public BankAccount(String owner) {
	          this(owner, 0.0); // Overloaded constructor
	      }
	  
	      // ── Instance Methods ──────────────────────────────
	      public void deposit(double amount) {
	          if (amount <= 0) throw new IllegalArgumentException("Amount must be positive.");
	          balance += amount;
	          System.out.printf("Deposited $%.2f. Balance: $%.2f%n", amount, balance);
	      }
	  
	      public boolean withdraw(double amount) {
	          if (amount > balance) {
	              System.out.println("Insufficient funds.");
	              return false;
	          }
	          balance -= amount;
	          System.out.printf("Withdrew $%.2f. Balance: $%.2f%n", amount, balance);
	          return true;
	      }
	  
	      public double getBalance() { return balance; }
	  
	      // ── Static Method ─────────────────────────────────
	      public static int getTotalAccounts() { return totalAccounts; }
	  
	      public static boolean isValidAmount(double amount) {
	          return amount > 0;
	      }
	  
	      // ── toString (like Python __str__) ────────────────
	      @Override
	      public String toString() {
	          return String.format("[%s] Owner: %s | Balance: $%.2f", accountId, owner, balance);
	      }
	  
	      public static void main(String[] args) {
	          BankAccount acc1 = new BankAccount("Alice", 500.0);
	          BankAccount acc2 = new BankAccount("Bob");
	  
	          acc1.deposit(200);       // Deposited $200.00. Balance: $700.00
	          acc1.withdraw(100);      // Withdrew $100.00.  Balance: $600.00
	          acc1.withdraw(800);      // Insufficient funds.
	  
	          System.out.println(acc1);                         // [ACC-0001] Owner: Alice | Balance: $600.00
	          System.out.println(BankAccount.getTotalAccounts()); // 2
	          System.out.println(BankAccount.bankName);           // Code Bank
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript (ES6+ Classes) ────────────────────────────────────────
	  
	  class BankAccount {
	      // Private fields (ES2022 syntax)
	      #balance;
	      #accountId;
	  
	      // Static class field (shared)
	      static bankName = "Code Bank";
	      static #totalAccounts = 0;
	  
	      // ── Constructor ───────────────────────────────────
	      constructor(owner, initialBalance = 0) {
	          this.owner = owner;             // public instance field
	          this.#balance = initialBalance; // private instance field
	          BankAccount.#totalAccounts++;
	          this.#accountId = `ACC-${String(BankAccount.#totalAccounts).padStart(4, '0')}`;
	      }
	  
	      // ── Instance Methods ──────────────────────────────
	      deposit(amount) {
	          if (amount <= 0) throw new Error("Amount must be positive.");
	          this.#balance += amount;
	          console.log(`✅ Deposited $${amount}. New balance: $${this.#balance}`);
	      }
	  
	      withdraw(amount) {
	          if (amount > this.#balance) {
	              console.log(`❌ Insufficient funds. Balance: $${this.#balance}`);
	              return false;
	          }
	          this.#balance -= amount;
	          console.log(`✅ Withdrew $${amount}. New balance: $${this.#balance}`);
	          return true;
	      }
	  
	      // ── Getter (property accessor) ────────────────────
	      get balance() {
	          return this.#balance;
	      }
	  
	      // ── Static Methods ────────────────────────────────
	      static getTotalAccounts() {
	          return BankAccount.#totalAccounts;
	      }
	  
	      static isValidAmount(amount) {
	          return typeof amount === 'number' && amount > 0;
	      }
	  
	      // ── toString ──────────────────────────────────────
	      toString() {
	          return `[${this.#accountId}] Owner: ${this.owner} | Balance: $${this.#balance}`;
	      }
	  }
	  
	  // ── Usage ─────────────────────────────────────────────
	  const acc1 = new BankAccount("Alice", 500);
	  const acc2 = new BankAccount("Bob");
	  
	  acc1.deposit(200);          // ✅ Deposited $200. New balance: $700
	  acc1.withdraw(100);         // ✅ Withdrew $100.  New balance: $600
	  acc1.withdraw(800);         // ❌ Insufficient funds.
	  
	  console.log(acc1.toString());                     // [ACC-0001] Owner: Alice | Balance: $600
	  console.log(BankAccount.getTotalAccounts());      // 2
	  console.log(BankAccount.bankName);               // Code Bank
	  console.log(BankAccount.isValidAmount(-50));     // false
	  console.log(acc1.balance);                       // 600 (via getter)
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  
	  public class BankAccount {
	  
	      // Private instance fields
	      private double balance;
	      private string accountId;
	  
	      // Public instance property
	      public string Owner { get; private set; }
	  
	      // Static (class-level) fields
	      public static string BankName = "Code Bank";
	      private static int totalAccounts = 0;
	  
	      // ── Constructor ───────────────────────────────────
	      public BankAccount(string owner, double initialBalance = 0.0) {
	          Owner = owner;
	          balance = initialBalance;
	          totalAccounts++;
	          accountId = $"ACC-{totalAccounts:D4}";
	      }
	  
	      // ── Instance Methods ──────────────────────────────
	      public void Deposit(double amount) {
	          if (amount <= 0) throw new ArgumentException("Amount must be positive.");
	          balance += amount;
	          Console.WriteLine($"Deposited ${amount:F2}. Balance: ${balance:F2}");
	      }
	  
	      public bool Withdraw(double amount) {
	          if (amount > balance) {
	              Console.WriteLine("Insufficient funds.");
	              return false;
	          }
	          balance -= amount;
	          Console.WriteLine($"Withdrew ${amount:F2}. Balance: ${balance:F2}");
	          return true;
	      }
	  
	      // ── Property (Encapsulated Getter) ─────────────────
	      public double Balance => balance;
	  
	      // ── Static Methods ────────────────────────────────
	      public static int GetTotalAccounts() => totalAccounts;
	  
	      public static bool IsValidAmount(double amount) => amount > 0;
	  
	      // ── ToString ──────────────────────────────────────
	      public override string ToString() =>
	          $"[{accountId}] Owner: {Owner} | Balance: ${balance:F2}";
	  
	      // ── Entry Point ───────────────────────────────────
	      public static void Main(string[] args) {
	          var acc1 = new BankAccount("Alice", 500.0);
	          var acc2 = new BankAccount("Bob");
	  
	          acc1.Deposit(200);         // Deposited $200.00. Balance: $700.00
	          acc1.Withdraw(100);        // Withdrew $100.00.  Balance: $600.00
	          acc1.Withdraw(800);        // Insufficient funds.
	  
	          Console.WriteLine(acc1);                       // [ACC-0001] Owner: Alice | Balance: $600.00
	          Console.WriteLine(BankAccount.GetTotalAccounts()); // 2
	          Console.WriteLine(BankAccount.BankName);          // Code Bank
	      }
	  }
	  ```
	  
	  :::
-
- # Special / Magic Methods (Dunder Methods)
  collapsed:: true
	- Python classes have special methods surrounded by double underscores (`__method__`) that give your class built-in Python behavior.
	-
	- | Dunder Method | When Called | Purpose |
	  |---|---|---|
	  | `__init__(self, ...)` | On object creation `MyClass()` | Initialize attributes (Constructor) |
	  | `__del__(self)` | On object destruction | Cleanup (Destructor) |
	  | `__str__(self)` | On `print(obj)` or `str(obj)` | Human-readable string |
	  | `__repr__(self)` | On `repr(obj)` or in the REPL | Developer debug string |
	  | `__len__(self)` | On `len(obj)` | Return object's "length" |
	  | `__eq__(self, other)` | On `obj1 == obj2` | Define equality |
	  | `__lt__(self, other)` | On `obj1 < obj2` | Define less-than comparison |
	  | `__add__(self, other)` | On `obj1 + obj2` | Operator overloading for `+` |
	  | `__getitem__(self, key)` | On `obj[key]` | Index/bracket access |
	  | `__iter__(self)` | On `for x in obj` | Make object iterable |
	  | `__enter__` / `__exit__` | On `with obj:` | Context manager support |
	-
	- ```python
	  class Vector:
	      def __init__(self, x, y):
	          self.x = x
	          self.y = y
	  
	      def __add__(self, other):        # v1 + v2
	          return Vector(self.x + other.x, self.y + other.y)
	  
	      def __eq__(self, other):         # v1 == v2
	          return self.x == other.x and self.y == other.y
	  
	      def __repr__(self):              # repr(v)
	          return f"Vector({self.x}, {self.y})"
	  
	      def __len__(self):               # len(v)
	          return int((self.x**2 + self.y**2) ** 0.5)
	  
	  v1 = Vector(1, 2)
	  v2 = Vector(3, 4)
	  v3 = v1 + v2
	  
	  print(v3)           # Vector(4, 6)   ← uses __repr__
	  print(v1 == v2)     # False          ← uses __eq__
	  print(len(v2))      # 5              ← uses __len__
	  ```
-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > - **Object Instantiation: O(k)** where k is the number of attributes initialized.
	  > - **Attribute Access: O(1)** — direct memory lookup via object reference.
	  > - **Method Call: O(1)** — calling overhead; actual complexity depends on the method body.
	  > - **Space per object: O(k)** — one value stored per attribute.
	-
	- | Operation | Time Complexity | Notes |
	  |---|---|---|
	  | Create object (`__init__`) | **O(k)** | k = number of attributes initialized |
	  | Access attribute (`obj.attr`) | **O(1)** | Direct pointer lookup via `__dict__` |
	  | Call method (`obj.method()`) | **O(1)** + method body | Method resolution is O(1) in most languages |
	  | Attribute lookup (Python) | **O(1)** average | Hash table lookup in `__dict__` |
	  | Delete object (`del obj`) | **O(1)** | Reference removed; GC handles memory |
-
- # When to Use a Class
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Do you have data\nAND related behavior?"}
	      Q -- "Yes" --> A{"Will you create\nmultiple instances?"}
	      Q -- "No (just functions)" --> R1["❌ Use standalone functions\nor a module"]
	      A -- "Yes" --> R2["✅ Use a Class\nGroup related state + behavior"]
	      A -- "No (single use)" --> B{"Do related concepts\nform a hierarchy?"}
	      B -- "Yes (parent/child)" --> R3["✅ Use Classes with Inheritance"]
	      B -- "No" --> R4["⚠️ Consider a simple dict/struct\nor dataclass"]
	  ```
	-
	- ## ✅ Use a Class When
		- You need to represent a **real-world entity** (User, Car, BankAccount, Product).
		- You have **multiple instances** that share the same structure but different data.
		- You want to **encapsulate** related data and behavior together.
		- You plan to use **inheritance** to create specialized versions of an entity.
		- You need **state** to persist across multiple method calls.
	-
	- ## ❌ Avoid a Class When
		- You only need a **single function** with no related data.
		- Your data has **no behavior** — a simple `dict`, `namedtuple`, or `@dataclass` is enough.
		- You're writing quick **scripts or one-off utilities** — plain functions are simpler.
-
- # Concepts Directly Linked to Class
  collapsed:: true
	- | Concept | Role | Page |
	  |---|---|---|
	  | **Constructor** | How objects are initialized | [[Constructor]] |
	  | **Destructor** | How objects are cleaned up | [[Destructors]] |
	  | **Object** | The instance created from a class | [[Object]] |
	  | **Encapsulation** | Hiding internal state via access modifiers | [[Encapsulation]] |
	  | **Abstraction** | Exposing only essential details | [[Abstraction]] |
	  | **Inheritance** | Deriving a new class from an existing one | [[Inheritance]] |
	  | **Polymorphism** | One interface, many behaviors | [[Polymorphism]] |
	  | **Composition** | Building classes that contain other objects | [[Composition]] |
	  | **Interface** | Defining a contract for a class | [[Interface]] |
	  | **Abstract Classes** | Partial implementations classes must complete | [[Abstract Classes]] |
	  | **Static Methods** | Class-level methods | [[Static Methods and Class Methods]] |
	  | **Method Overloading** | Same method name, different parameters | [[Method Overloading]] |
	  | **Method Overriding** | Redefining a parent method in a child | [[Method Overriding]] |
-
- # Key Takeaways
  collapsed:: true
	- **Blueprint** — A class defines structure; objects are the actual entities built from it.
	- **Attributes** hold **state**; **methods** define **behavior**. Together they model real-world entities.
	- **Instance vs Class** — Instance members are unique per object; class/static members are shared.
	- **Access Modifiers** — `public`, `protected`, and `private` control visibility and enforce [[Encapsulation]].
	- **Dunder methods** — Python's `__init__`, `__str__`, `__add__`, etc. integrate your class with built-in Python behaviors.
	- **Memory** — Each object holds its own copy of instance attributes; methods are shared via the class.
	- **Relationships** — Classes interact via Inheritance (is-a), Composition (has-a / dependent), and Aggregation (has-a / independent).
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Python Official Docs — Classes](https://docs.python.org/3/tutorial/classes.html)
		- [Real Python — OOP in Python](https://realpython.com/python3-object-oriented-programming/)
		- [TheAlgorithms — Python OOP Examples](https://github.com/TheAlgorithms/Python)
		- [Refactoring.Guru — OOP Concepts](https://refactoring.guru/design-patterns/what-is-pattern)
		- [C++ Classes Reference — cppreference.com](https://en.cppreference.com/w/cpp/language/class)
		- [Java Classes Oracle Docs](https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html)