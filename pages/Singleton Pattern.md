---
seoTitle: Singleton Pattern – Complete In-Depth Guide | Creational Design Pattern
description: "Deep dive into the Singleton design pattern. Covers thread safety, lazy initialization, metaclass approach, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "singleton pattern, creational design pattern, thread-safe singleton, lazy initialization, Python singleton, Java singleton, C++ singleton, double-checked locking, VR-Rathod, Code-Note"
displayTitle: Singleton Pattern
---

> [!info] What is the Singleton Pattern?
> The **Singleton Pattern** is a **creational design pattern** that ensures a class has **only one instance** throughout the application lifecycle and provides a **global access point** to that instance. Useful for shared resources like database connections, configuration managers, loggers, and thread pools.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- The **President of a country** 🏛️ — there's exactly one at any time. If you ask "Who's the president?" you always get the same person. If you call `President.getInstance()` twice, you get the same object.
	-
	- ## When to Use
	  collapsed:: true
		- | Use Case | Why Singleton |
		  |---|---|
		  | **Database connection pool** | One pool shared across the app |
		  | **Logger** | All code writes to the same log handler |
		  | **Configuration manager** | One source of truth for app settings |
		  | **Cache** | Single in-memory cache shared everywhere |
		  | **Thread pool** | One pool, avoid overhead of recreation |
	-
	- ## Common Pitfalls
	  collapsed:: true
		- | Pitfall | Problem |
		  |---|---|
		  | **Global state** | Makes code harder to test — hidden dependency |
		  | **Thread safety** | Multiple threads may create multiple instances simultaneously |
		  | **Subclassing** | Singleton classes are hard to subclass |
		  | **Overuse** | Don't singleton everything — use dependency injection instead |
		- > [!warning] Singletons are essentially **global variables** with a fancy pattern. Prefer **dependency injection** when testability matters.

- # Implementation
  collapsed:: true
	- > [!note] Thread-safe Singleton implementations using different approaches per language.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python — Thread-safe via threading.Lock + metaclass ─────────────
	  import threading
	  from typing import ClassVar
	  
	  # ── Method 1: Classic with __new__ + threading.Lock ────
	  class DatabaseConnection:
	      _instance: ClassVar["DatabaseConnection | None"] = None
	      _lock: ClassVar[threading.Lock] = threading.Lock()
	  
	      def __new__(cls, *args, **kwargs) -> "DatabaseConnection":
	          if cls._instance is None:
	              with cls._lock:  # Thread-safe: double-checked locking
	                  if cls._instance is None:
	                      cls._instance = super().__new__(cls)
	                      cls._instance._initialized = False
	          return cls._instance
	  
	      def __init__(self, host: str = "localhost", port: int = 5432):
	          if self._initialized:
	              return
	          self.host = host
	          self.port = port
	          self._connected = False
	          self._initialized = True
	          print(f"[DB] Connection created: {host}:{port}")
	  
	      def connect(self) -> None:
	          if not self._connected:
	              self._connected = True
	              print(f"[DB] Connected to {self.host}:{self.port}")
	  
	      def query(self, sql: str) -> list:
	          print(f"[DB] Executing: {sql}")
	          return []
	  
	  
	  # ── Method 2: Cleaner — Metaclass Singleton ────────────
	  class SingletonMeta(type):
	      _instances: ClassVar[dict] = {}
	      _lock: ClassVar[threading.Lock] = threading.Lock()
	  
	      def __call__(cls, *args, **kwargs):
	          with cls._lock:
	              if cls not in cls._instances:
	                  instance = super().__call__(*args, **kwargs)
	                  cls._instances[cls] = instance
	          return cls._instances[cls]
	  
	  class AppConfig(metaclass=SingletonMeta):
	      def __init__(self, env: str = "production"):
	          self.env = env
	          self.settings: dict = {
	              "debug": env != "production",
	              "max_retries": 3,
	              "timeout": 30,
	          }
	          print(f"[Config] Initialized for env: {env}")
	  
	      def get(self, key: str, default=None):
	          return self.settings.get(key, default)
	  
	  
	  # Usage — same instance every time
	  db1 = DatabaseConnection("prod.server.com", 5432)
	  db2 = DatabaseConnection("ignored_host", 9999)  # returns same instance!
	  
	  print(db1 is db2)           # True — same object
	  print(id(db1) == id(db2))   # True — same memory address
	  db1.connect()
	  db2.query("SELECT * FROM users")  # still connected from db1.connect()
	  
	  config1 = AppConfig("staging")
	  config2 = AppConfig()  # "staging" already set — returns same instance
	  print(config1 is config2)   # True
	  print(config2.env)          # staging (not "production"!)
	  ```
	  
	  ```c++
	  // ─── C++ — Thread-safe via std::call_once ─────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <mutex>
	  
	  class DatabaseConnection {
	  private:
	      std::string host_;
	      int port_;
	      bool connected_ = false;
	  
	      // Private constructor
	      DatabaseConnection(std::string host, int port)
	          : host_(host), port_(port) {
	          std::cout << "[DB] Created: " << host << ":" << port << "\n";
	      }
	  
	      static DatabaseConnection* instance_;
	      static std::once_flag flag_;
	  
	  public:
	      // Deleted copy/move — prevent duplication
	      DatabaseConnection(const DatabaseConnection&) = delete;
	      DatabaseConnection& operator=(const DatabaseConnection&) = delete;
	  
	      static DatabaseConnection& getInstance(std::string host = "localhost", int port = 5432) {
	          std::call_once(flag_, [&]() {
	              instance_ = new DatabaseConnection(host, port);
	          });
	          return *instance_;
	      }
	  
	      void connect() {
	          connected_ = true;
	          std::cout << "[DB] Connected to " << host_ << ":" << port_ << "\n";
	      }
	  
	      void query(const std::string& sql) {
	          std::cout << "[DB] Query: " << sql << "\n";
	      }
	  };
	  
	  DatabaseConnection* DatabaseConnection::instance_ = nullptr;
	  std::once_flag DatabaseConnection::flag_;
	  
	  int main() {
	      auto& db1 = DatabaseConnection::getInstance("prod.server.com", 5432);
	      auto& db2 = DatabaseConnection::getInstance("ignored", 9999);
	  
	      std::cout << (&db1 == &db2) << "\n";  // 1 — same object
	      db1.connect();
	      db2.query("SELECT 1");  // still connected
	  }
	  ```
	  
	  ```java
	  // ─── Java — Enum Singleton (Best Practice) ────────────────────────────
	  public enum DatabaseConnection {
	      INSTANCE;  // ← Only one instance, thread-safe by JVM, serialization-safe
	  
	      private String host = "localhost";
	      private int port = 5432;
	      private boolean connected = false;
	  
	      // Can add methods to enum instances
	      public void configure(String host, int port) {
	          this.host = host; this.port = port;
	      }
	  
	      public void connect() {
	          if (!connected) {
	              connected = true;
	              System.out.println("[DB] Connected to " + host + ":" + port);
	          }
	      }
	  
	      public void query(String sql) {
	          System.out.println("[DB] Query: " + sql);
	      }
	  }
	  
	  // ── Alternative: Double-Checked Locking ─────────────────────────────
	  class AppConfig {
	      private volatile static AppConfig instance;
	      private String env;
	  
	      private AppConfig(String env) {
	          this.env = env;
	          System.out.println("[Config] Init for: " + env);
	      }
	  
	      public static AppConfig getInstance(String env) {
	          if (instance == null) {                    // First check (no lock)
	              synchronized (AppConfig.class) {
	                  if (instance == null) {            // Second check (with lock)
	                      instance = new AppConfig(env);
	                  }
	              }
	          }
	          return instance;
	      }
	  
	      public String getEnv() { return env; }
	  }
	  
	  class SingletonDemo {
	      public static void main(String[] args) {
	          // Enum singleton
	          DatabaseConnection.INSTANCE.configure("prod.server.com", 5432);
	          DatabaseConnection.INSTANCE.connect();
	          DatabaseConnection.INSTANCE.query("SELECT 1");
	  
	          // Double-checked locking
	          AppConfig c1 = AppConfig.getInstance("staging");
	          AppConfig c2 = AppConfig.getInstance("ignored");
	          System.out.println(c1 == c2);   // true
	          System.out.println(c2.getEnv()); // staging
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript — Module-level singleton (most idiomatic) ────────────
	  
	  // Method 1: Module export (simplest — modules are singletons in JS)
	  // database.js:
	  class DatabaseConnection {
	      #host;
	      #port;
	      #connected = false;
	  
	      constructor(host = "localhost", port = 5432) {
	          this.#host = host;
	          this.#port = port;
	          console.log(`[DB] Created: ${host}:${port}`);
	      }
	  
	      connect() {
	          if (!this.#connected) {
	              this.#connected = true;
	              console.log(`[DB] Connected to ${this.#host}:${this.#port}`);
	          }
	      }
	  
	      query(sql) { console.log(`[DB] Query: ${sql}`); }
	  }
	  
	  // Singleton via closure + static
	  class SingletonDB {
	      static #instance = null;
	  
	      constructor(host, port) {
	          if (SingletonDB.#instance) return SingletonDB.#instance;
	          this.host = host; this.port = port;
	          SingletonDB.#instance = this;
	          console.log(`[DB] Created: ${host}:${port}`);
	      }
	  
	      static getInstance(host = "localhost", port = 5432) {
	          if (!SingletonDB.#instance) new SingletonDB(host, port);
	          return SingletonDB.#instance;
	      }
	  
	      connect() { console.log(`[DB] Connected to ${this.host}:${this.port}`); }
	      query(sql) { console.log(`[DB] Query: ${sql}`); }
	  }
	  
	  const db1 = SingletonDB.getInstance("prod.server.com", 5432);
	  const db2 = SingletonDB.getInstance("ignored", 9999);
	  console.log(db1 === db2);  // true
	  db1.connect();
	  db2.query("SELECT 1");
	  ```
	  
	  ```csharp
	  // ─── C# — Lazy<T> Singleton (thread-safe, lazy-initialized) ──────────
	  using System;
	  
	  public sealed class DatabaseConnection {
	      // Lazy<T> is thread-safe by default
	      private static readonly Lazy<DatabaseConnection> _lazy =
	          new Lazy<DatabaseConnection>(() => new DatabaseConnection());
	  
	      public static DatabaseConnection Instance => _lazy.Value;
	  
	      private string host;
	      private int port;
	      private bool connected;
	  
	      // Private constructor — prevents external creation
	      private DatabaseConnection(string host = "localhost", int port = 5432) {
	          this.host = host; this.port = port;
	          Console.WriteLine($"[DB] Created: {host}:{port}");
	      }
	  
	      public void Configure(string host, int port) {
	          this.host = host; this.port = port;
	      }
	  
	      public void Connect() {
	          if (!connected) {
	              connected = true;
	              Console.WriteLine($"[DB] Connected to {host}:{port}");
	          }
	      }
	  
	      public void Query(string sql) => Console.WriteLine($"[DB] Query: {sql}");
	  
	      static void Main() {
	          var db1 = DatabaseConnection.Instance;
	          var db2 = DatabaseConnection.Instance;
	          Console.WriteLine(ReferenceEquals(db1, db2));  // True
	          db1.Configure("prod.server.com", 5432);
	          db1.Connect();
	          db2.Query("SELECT 1");  // same connection
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- **One instance, global access** — that's the Singleton.
	- Always make constructor **private** to prevent external instantiation.
	- **Thread safety** is critical — use `threading.Lock` (Python), `std::call_once` (C++), `enum` (Java — best practice), `Lazy<T>` (C#).
	- **Java**: prefer `enum Singleton` — it's thread-safe, serialization-safe, and reflection-proof.
	- **Python**: prefer metaclass approach or module-level singleton.
	- Consider **dependency injection** as an alternative — easier to test and mock.

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Refactoring Guru — Singleton](https://refactoring.guru/design-patterns/singleton)
		- [Effective Java — Singleton via enum](https://www.informit.com/articles/article.aspx?p=1216151&seqNum=3)