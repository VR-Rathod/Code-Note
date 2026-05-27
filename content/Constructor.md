---
seoTitle: Constructor in OOP – Complete In-Depth Guide | Types, Default, Parameterized, Copy Constructor
description: "Deep dive into Constructors in OOP. Covers default, parameterized, copy, and conversion constructors, constructor chaining, initializer lists, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "constructor, OOP, default constructor, parameterized constructor, copy constructor, constructor chaining, initializer list, __init__, this keyword, Python constructor, Java constructor, C++ constructor, VR-Rathod, Code-Note"
displayTitle: Constructor
---

> [!info] What is a Constructor?
> A **Constructor** is a **special method that is automatically called when an object is created**. Its job is to **initialize the object's attributes** to a valid starting state. It has the same name as the class and typically takes no return type. A [[Class]] can have multiple constructors (overloading).

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- A constructor is like the **factory setup process** 🏭 — when an assembly line creates a new product (object), the setup process (constructor) runs immediately to fill in its initial values: color, size, serial number. No product leaves the factory half-configured.
		- | Factory Process | OOP Equivalent |
		  |---|---|
		  | Factory setup | **Constructor** |
		  | Product being built | **Object being created** |
		  | Initial configuration | **Attribute initialization** |
		  | Serial number stamp | **Unique object ID / `id(obj)`** |
	-
	- ## What Constructors Do
	  collapsed:: true
		- ```
		  1. Allocate memory for the object        (done by runtime before constructor)
		  2. Initialize all attributes             (your job — in __init__ / constructor body)
		  3. Run any setup logic                   (validate inputs, open resources, register)
		  4. Return the fully initialized object   (implicit — you don't write 'return self')
		  ```
		-
		- > [!important] In Python, `__new__()` allocates memory and `__init__()` initializes it. You almost always only define `__init__`. In C++, the constructor does both.

- # Types of Constructors
  collapsed:: true
	- | Type | Description | Example |
	  |---|---|---|
	  | **Default** | No parameters (or all have defaults). Creates a "blank" object. | `Person()` |
	  | **Parameterized** | Takes arguments to set initial values | `Person("Alice", 30)` |
	  | **Copy** | Creates a new object as a copy of an existing one | `Person p2 = p1` (C++) |
	  | **Delegating / Chaining** | One constructor calls another constructor of the same class | `this(name, 0)` (Java) |
	  | **Conversion** | Creates an object from a different type (C++ implicit/explicit) | `Person("Alice")` from `string` |
	-
	- ```mermaid
	  flowchart LR
	      CT["Constructor Types"]
	      CT --> DEF["Default\n(no args)"]
	      CT --> PAR["Parameterized\n(with args)"]
	      CT --> COP["Copy\n(from existing object)"]
	      CT --> DEL["Delegating / Chaining\n(calls another constructor)"]
	  ```

- # Constructor Chaining
  collapsed:: true
	- One constructor can call another constructor of the same class to avoid code duplication:
	- ```python
	  # Python — via __init__ default arguments
	  class Connection:
	      def __init__(self, host: str = "localhost", port: int = 5432, db: str = "default"):
	          self.host = host
	          self.port = port
	          self.db = db
	  
	  conn1 = Connection()                          # all defaults
	  conn2 = Connection("prod.server.com", 5432)   # partial
	  conn3 = Connection("staging.com", 3306, "app")# all specified
	  ```
	- ```java
	  // Java — via this(...) delegation
	  class Connection {
	      String host;
	      int port;
	      String db;
	  
	      Connection() {
	          this("localhost", 5432, "default");  // delegates to full constructor
	      }
	  
	      Connection(String host, int port) {
	          this(host, port, "default");
	      }
	  
	      Connection(String host, int port, String db) {
	          this.host = host;
	          this.port = port;
	          this.db = db;
	      }
	  }
	  ```

- # Implementation
  collapsed:: true
	- > [!note] A `DatabaseConnection` class demonstrating all constructor types, chaining, validation, and C++ initializer list.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  class DatabaseConnection:
	      """Represents a database connection with validated settings."""
	  
	      _active_connections: int = 0
	  
	      def __init__(self,
	                   host: str = "localhost",
	                   port: int = 5432,
	                   database: str = "default",
	                   user: str = "admin",
	                   timeout: int = 30):
	          # Validate inputs in constructor
	          if not isinstance(port, int) or not (1024 <= port <= 65535):
	              raise ValueError(f"Invalid port: {port}")
	          if timeout <= 0:
	              raise ValueError(f"Timeout must be positive: {timeout}")
	  
	          self.host = host
	          self.port = port
	          self.database = database
	          self.user = user
	          self.timeout = timeout
	          self._connected = False
	          DatabaseConnection._active_connections += 1
	          self._id = DatabaseConnection._active_connections
	          print(f"[Constructor] Connection #{self._id} configured: {self}")
	  
	      # ── Class Method Constructor (Factory) ────────────
	      @classmethod
	      def from_url(cls, url: str) -> "DatabaseConnection":
	          """Alternative constructor: create from connection URL string."""
	          # e.g. "localhost:5432/mydb"
	          host_port, db = url.rsplit("/", 1)
	          host, port = host_port.rsplit(":", 1)
	          return cls(host=host, port=int(port), database=db)
	  
	      @classmethod
	      def local(cls, database: str = "dev") -> "DatabaseConnection":
	          """Convenience constructor for local dev connections."""
	          return cls(host="localhost", port=5432, database=database)
	  
	      def connect(self) -> None:
	          self._connected = True
	          print(f"[Connected] → {self.host}:{self.port}/{self.database}")
	  
	      def __str__(self) -> str:
	          return f"{self.user}@{self.host}:{self.port}/{self.database}"
	  
	      def __del__(self) -> None:
	          print(f"[Destructor] Connection #{self._id} closed.")
	  
	  
	  # Usage
	  conn1 = DatabaseConnection()                               # default
	  conn2 = DatabaseConnection("prod.server.com", 5432, "app") # parameterized
	  conn3 = DatabaseConnection.from_url("staging.com:3306/analytics") # factory
	  conn4 = DatabaseConnection.local()                         # convenience
	  
	  conn2.connect()  # [Connected] → prod.server.com:5432/app
	  print(DatabaseConnection._active_connections)  # 4
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <stdexcept>
	  
	  class DatabaseConnection {
	  private:
	      std::string host_;
	      int port_;
	      std::string database_;
	      std::string user_;
	      int timeout_;
	      bool connected_ = false;
	  
	  public:
	      // ── Default Constructor ───────────────────────────
	      DatabaseConnection()
	          : DatabaseConnection("localhost", 5432, "default", "admin", 30) {}
	  
	      // ── Parameterized Constructor (with initializer list) ──
	      DatabaseConnection(const std::string& host, int port,
	                         const std::string& db, const std::string& user = "admin",
	                         int timeout = 30)
	          : host_(host), port_(port), database_(db), user_(user), timeout_(timeout) {
	          if (port < 1024 || port > 65535)
	              throw std::invalid_argument("Invalid port: " + std::to_string(port));
	          std::cout << "[Constructor] Configured: " << user_ << "@" << host_ << "\n";
	      }
	  
	      // ── Copy Constructor ──────────────────────────────
	      DatabaseConnection(const DatabaseConnection& other)
	          : host_(other.host_), port_(other.port_),
	            database_(other.database_), user_(other.user_),
	            timeout_(other.timeout_), connected_(false) {
	          std::cout << "[Copy Constructor] Copied from " << other.host_ << "\n";
	      }
	  
	      // ── Destructor ────────────────────────────────────
	      ~DatabaseConnection() {
	          std::cout << "[Destructor] Connection to " << host_ << " closed.\n";
	      }
	  
	      void connect() {
	          connected_ = true;
	          std::cout << "[Connected] → " << host_ << ":" << port_ << "/" << database_ << "\n";
	      }
	  
	      std::string toString() const {
	          return user_ + "@" + host_ + ":" + std::to_string(port_) + "/" + database_;
	      }
	  };
	  
	  int main() {
	      DatabaseConnection conn1;                               // default
	      DatabaseConnection conn2("prod.server.com", 5432, "app"); // parameterized
	      DatabaseConnection conn3 = conn2;                      // copy constructor
	      conn2.connect();
	      std::cout << conn1.toString() << "\n";
	  }   // destructors auto-called here
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  public class DatabaseConnection {
	      private String host;
	      private int port;
	      private String database;
	      private String user;
	      private int timeout;
	      private boolean connected = false;
	  
	      // ── Default Constructor (delegates) ───────────────
	      public DatabaseConnection() {
	          this("localhost", 5432, "default", "admin", 30);
	      }
	  
	      // ── Partial Constructor (delegates) ───────────────
	      public DatabaseConnection(String host, int port) {
	          this(host, port, "default", "admin", 30);
	      }
	  
	      // ── Full Parameterized Constructor ─────────────────
	      public DatabaseConnection(String host, int port, String db,
	                                 String user, int timeout) {
	          if (port < 1024 || port > 65535)
	              throw new IllegalArgumentException("Invalid port: " + port);
	          this.host = host; this.port = port; this.database = db;
	          this.user = user; this.timeout = timeout;
	          System.out.println("[Constructor] Configured: " + this);
	      }
	  
	      public void connect() {
	          connected = true;
	          System.out.println("[Connected] → " + host + ":" + port + "/" + database);
	      }
	  
	      @Override
	      public String toString() {
	          return user + "@" + host + ":" + port + "/" + database;
	      }
	  
	      public static void main(String[] args) {
	          DatabaseConnection c1 = new DatabaseConnection();
	          DatabaseConnection c2 = new DatabaseConnection("prod.server.com", 5432);
	          DatabaseConnection c3 = new DatabaseConnection("prod.server.com", 5432, "app", "root", 60);
	          c3.connect();
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  class DatabaseConnection {
	      static #activeConnections = 0;
	  
	      constructor(host = "localhost", port = 5432, database = "default",
	                  user = "admin", timeout = 30) {
	          if (port < 1024 || port > 65535)
	              throw new Error(`Invalid port: ${port}`);
	          this.host = host;
	          this.port = port;
	          this.database = database;
	          this.user = user;
	          this.timeout = timeout;
	          this.connected = false;
	          DatabaseConnection.#activeConnections++;
	          this._id = DatabaseConnection.#activeConnections;
	          console.log(`[Constructor] #${this._id} configured: ${this}`);
	      }
	  
	      // Static factory method (alternative constructor)
	      static fromUrl(url) {
	          const [hostPort, db] = url.split('/');
	          const [host, port] = hostPort.split(':');
	          return new DatabaseConnection(host, parseInt(port), db);
	      }
	  
	      static local(database = "dev") {
	          return new DatabaseConnection("localhost", 5432, database);
	      }
	  
	      connect() {
	          this.connected = true;
	          console.log(`[Connected] → ${this.host}:${this.port}/${this.database}`);
	      }
	  
	      toString() {
	          return `${this.user}@${this.host}:${this.port}/${this.database}`;
	      }
	  }
	  
	  const c1 = new DatabaseConnection();
	  const c2 = DatabaseConnection.fromUrl("prod.server.com:5432/app");
	  const c3 = DatabaseConnection.local();
	  c2.connect();
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  
	  public class DatabaseConnection {
	      public string Host { get; }
	      public int Port { get; }
	      public string Database { get; }
	      public string User { get; }
	      public int Timeout { get; }
	      private bool connected = false;
	  
	      // ── Default Constructor (delegates via : this()) ──
	      public DatabaseConnection() : this("localhost", 5432, "default", "admin", 30) { }
	  
	      public DatabaseConnection(string host, int port)
	          : this(host, port, "default", "admin", 30) { }
	  
	      // ── Full Parameterized Constructor ─────────────────
	      public DatabaseConnection(string host, int port, string database,
	                                  string user = "admin", int timeout = 30) {
	          if (port < 1024 || port > 65535)
	              throw new ArgumentException($"Invalid port: {port}");
	          Host = host; Port = port; Database = database;
	          User = user; Timeout = timeout;
	          Console.WriteLine($"[Constructor] Configured: {this}");
	      }
	  
	      // Static factory method
	      public static DatabaseConnection Local(string database = "dev") =>
	          new DatabaseConnection("localhost", 5432, database);
	  
	      public void Connect() {
	          connected = true;
	          Console.WriteLine($"[Connected] → {Host}:{Port}/{Database}");
	      }
	  
	      ~DatabaseConnection() => Console.WriteLine($"[Finalizer] {Host} connection closed.");
	  
	      public override string ToString() => $"{User}@{Host}:{Port}/{Database}";
	  
	      static void Main() {
	          var c1 = new DatabaseConnection();
	          var c2 = new DatabaseConnection("prod.server.com", 5432);
	          var c3 = DatabaseConnection.Local("analytics");
	          c2.Connect();
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- A constructor **runs automatically** at object creation — you never call it explicitly.
	- Always **validate inputs** in the constructor to guarantee a valid initial state.
	- Use **constructor chaining** (`this(...)` in Java, `super(...)` in child classes, default args in Python) to avoid duplication.
	- **C++ initializer lists** (`: field_(value)`) initialize members before the constructor body runs — more efficient than assignment inside the body.
	- **Factory class methods** (`@classmethod` in Python, `static` in Java/C#) are alternative constructors with semantic names (`from_url()`, `local()`).

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Python Docs — __init__](https://docs.python.org/3/reference/datamodel.html#object.__init__)
		- [Java Docs — Constructors](https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html)
		- [cppreference — Constructors](https://en.cppreference.com/w/cpp/language/constructor)