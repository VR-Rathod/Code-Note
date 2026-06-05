---
seoTitle: Destructor in OOP – Complete In-Depth Guide | RAII, Cleanup, Memory Management
description: "Deep dive into Destructors in OOP. Covers purpose, RAII pattern, when destructors are called, virtual destructors, Python __del__, and resource management in Python, C++, Java, JavaScript, and C#."
keywords: "destructor, OOP, RAII, __del__, virtual destructor, cleanup, garbage collection, resource management, Python destructor, C++ destructor, Java finalizer, VR-Rathod, Code-Note"
displayTitle: Destructors
treeTitle: DSA - OOP - Destructors
---

> [!info] What is a Destructor?
> A **Destructor** is a special method that is **automatically called when an object is destroyed or goes out of scope**. Its purpose is to **release resources** (memory, file handles, network connections, locks) that the object acquired during its lifetime. It is the counterpart of the [[Constructor]].

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of renting a hotel room 🏨. When you **check in** (constructor), the room is prepared for you. When you **check out** (destructor), the hotel staff cleans up — towels collected, minibar reset, room key deactivated. The cleanup happens automatically when you leave; you don't have to manually call the cleaning crew each time.
	-
	- ## When Are Destructors Called?
	  collapsed:: true
		- | Language | When Called | Mechanism |
		  |---|---|---|
		  | **Python** | When reference count drops to 0 (or GC cycle runs) | Reference counting + cyclic GC |
		  | **C++** | When object goes out of scope (stack) or `delete` is called (heap) | RAII — deterministic |
		  | **Java** | When GC decides to collect (non-deterministic) | `finalize()` (deprecated Java 9+) |
		  | **JavaScript** | When GC collects (non-deterministic) | `FinalizationRegistry` (ES2021) |
		  | **C#** | When GC collects (non-deterministic) | `~ClassName()` finalizer — use `IDisposable` instead |
	-
	- ## RAII — Resource Acquisition Is Initialization (C++)
	  collapsed:: true
		- C++ destructors fire **deterministically** when an object goes out of scope, making them the backbone of the **RAII** pattern — resources are tied to object lifetimes.
		- ```
		  {
		      FileHandle f("data.txt");   // Constructor opens file
		      f.write("Hello");
		  }                              // ← Destructor auto-called — file closed!
		  // No resource leak, even if exception thrown
		  ```
		- > [!tip] In Python/Java/C#, use `with` / `try-with-resources` / `using` statements as the equivalent of RAII — they guarantee cleanup via context managers.
- # Virtual Destructor (C++)
  collapsed:: true
	- In C++, if you delete a derived class object through a **base class pointer**, the base destructor runs (not the derived). This causes resource leaks in the derived class. Fix: make the base destructor `virtual`.
	- ```c++
	  class Base {
	  public:
	      // Without virtual: only Base::~Base() runs on delete
	      virtual ~Base() { std::cout << "Base destroyed\n"; }
	  };
	  
	  class Derived : public Base {
	      int* data;
	  public:
	      Derived() : data(new int[100]) {}
	      ~Derived() {                         // Runs ONLY if Base has virtual destructor
	          delete[] data;
	          std::cout << "Derived destroyed\n";
	      }
	  };
	  
	  Base* b = new Derived();
	  delete b;
	  // With virtual: Derived destroyed → Base destroyed  ✅
	  // Without virtual: only Base destroyed → MEMORY LEAK ❌
	  ```
	- > [!important] **Rule**: Any class meant to be used as a base class MUST declare a `virtual` destructor in C++.
- # Implementation
  collapsed:: true
	- > [!note] A `FileManager` class demonstrating proper resource cleanup via destructor, context manager, and RAII equivalents.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  class FileManager:
	      def __init__(self, filename: str, mode: str = "r"):
	          self.filename = filename
	          self.mode = mode
	          self._file = None
	          self._open()
	  
	      def _open(self):
	          self._file = open(self.filename, self.mode)
	          print(f"[Constructor] Opened {self.filename}")
	  
	      def read(self) -> str:
	          if self._file and not self._file.closed:
	              return self._file.read()
	          return ""
	  
	      def write(self, content: str) -> None:
	          if self._file and not self._file.closed:
	              self._file.write(content)
	  
	      # ── Destructor ────────────────────────────────────
	      def __del__(self):
	          if self._file and not self._file.closed:
	              self._file.close()
	              print(f"[Destructor] Closed {self.filename}")
	  
	      # ── Context Manager (preferred Python RAII pattern) ──
	      def __enter__(self):
	          return self
	  
	      def __exit__(self, exc_type, exc_val, exc_tb):
	          self.__del__()  # Guaranteed cleanup
	          return False    # Don't suppress exceptions
	  
	  
	  # 1. Using destructor (GC-dependent — not recommended for files!)
	  fm = FileManager("test.txt", "w")
	  fm.write("Hello, World!")
	  del fm  # [Destructor] Closed test.txt  ← explicit trigger
	  
	  # 2. Using context manager (recommended — guaranteed cleanup)
	  with FileManager("test.txt", "r") as fm:
	      content = fm.read()
	      print(content)
	  # [Destructor] auto-called on __exit__
	  ```
	  
	  ```c++
	  // ─── C++ — RAII (deterministic cleanup) ──────────────────────────────
	  #include <iostream>
	  #include <fstream>
	  #include <string>
	  #include <stdexcept>
	  
	  class FileManager {
	  private:
	      std::string filename_;
	      std::fstream file_;
	  
	  public:
	      FileManager(const std::string& filename, std::ios::openmode mode = std::ios::in) {
	          filename_ = filename;
	          file_.open(filename, mode);
	          if (!file_.is_open())
	              throw std::runtime_error("Cannot open: " + filename);
	          std::cout << "[Constructor] Opened " << filename << "\n";
	      }
	  
	      // ── Destructor — auto-called when object goes out of scope ──
	      ~FileManager() {
	          if (file_.is_open()) {
	              file_.close();
	              std::cout << "[Destructor] Closed " << filename_ << "\n";
	          }
	      }
	  
	      // Disable copy to prevent double-close
	      FileManager(const FileManager&) = delete;
	      FileManager& operator=(const FileManager&) = delete;
	  
	      // Allow move
	      FileManager(FileManager&&) = default;
	  
	      void write(const std::string& content) { file_ << content; }
	  
	      std::string read() {
	          std::string content((std::istreambuf_iterator<char>(file_)),
	                               std::istreambuf_iterator<char>());
	          return content;
	      }
	  };
	  
	  int main() {
	      {
	          FileManager fm("test.txt", std::ios::out);
	          fm.write("Hello, RAII!");
	      }  // ← Destructor fires here — file closed automatically
	      
	      std::cout << "After scope — file is closed!\n";
	  }
	  ```
	  
	  ```java
	  // ─── Java — try-with-resources (AutoCloseable) ────────────────────────
	  import java.io.*;
	  
	  public class FileManager implements AutoCloseable {
	      private final String filename;
	      private BufferedWriter writer;
	  
	      public FileManager(String filename) throws IOException {
	          this.filename = filename;
	          this.writer = new BufferedWriter(new FileWriter(filename));
	          System.out.println("[Constructor] Opened " + filename);
	      }
	  
	      public void write(String content) throws IOException {
	          writer.write(content);
	      }
	  
	      // ── close() = Java's destructor equivalent ──────────────
	      @Override
	      public void close() throws IOException {
	          if (writer != null) {
	              writer.close();
	              System.out.println("[close()] Closed " + filename);
	          }
	      }
	  
	      // finalize() is DEPRECATED in Java 9+ — do not rely on it
	      // Use close() + try-with-resources instead
	  
	      public static void main(String[] args) throws IOException {
	          // try-with-resources: close() guaranteed to run
	          try (FileManager fm = new FileManager("test.txt")) {
	              fm.write("Hello Java!");
	          }  // close() called automatically here
	          System.out.println("File closed. Safe to continue.");
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript — FinalizationRegistry (ES2021) ──────────────────────
	  // Note: JS has no deterministic destructor. Use explicit cleanup patterns.
	  
	  class FileManager {
	      #filename;
	      #open = false;
	  
	      constructor(filename) {
	          this.#filename = filename;
	          this.#open = true;
	          console.log(`[Constructor] Opened ${filename}`);
	      }
	  
	      write(content) {
	          if (!this.#open) throw new Error("File is closed");
	          console.log(`[Write] ${content} → ${this.#filename}`);
	      }
	  
	      // Explicit close (recommended — don't rely on GC)
	      close() {
	          if (this.#open) {
	              this.#open = false;
	              console.log(`[Destructor/close] Closed ${this.#filename}`);
	          }
	      }
	  }
	  
	  // FinalizationRegistry — GC notification (non-deterministic)
	  const registry = new FinalizationRegistry((filename) => {
	      console.log(`[GC] ${filename} was garbage collected`);
	  });
	  
	  // Usage — explicit cleanup (RAII equivalent)
	  const fm = new FileManager("test.txt");
	  registry.register(fm, fm._filename);
	  try {
	      fm.write("Hello!");
	  } finally {
	      fm.close();  // Always close in finally block
	  }
	  ```
	  
	  ```csharp
	  // ─── C# — IDisposable + using statement ──────────────────────────────
	  using System;
	  using System.IO;
	  
	  public class FileManager : IDisposable {
	      private readonly string filename;
	      private StreamWriter writer;
	      private bool disposed = false;
	  
	      public FileManager(string filename) {
	          this.filename = filename;
	          writer = new StreamWriter(filename);
	          Console.WriteLine($"[Constructor] Opened {filename}");
	      }
	  
	      public void Write(string content) {
	          if (disposed) throw new ObjectDisposedException(nameof(FileManager));
	          writer.Write(content);
	      }
	  
	      // ── IDisposable.Dispose() = Destructor equivalent ─────
	      public void Dispose() {
	          Dispose(true);
	          GC.SuppressFinalize(this);
	      }
	  
	      protected virtual void Dispose(bool disposing) {
	          if (!disposed) {
	              if (disposing) writer?.Close();
	              disposed = true;
	              Console.WriteLine($"[Dispose] Closed {filename}");
	          }
	      }
	  
	      // Finalizer (last resort if Dispose not called)
	      ~FileManager() => Dispose(false);
	  
	      static void Main() {
	          using (var fm = new FileManager("test.txt")) {
	              fm.Write("Hello C#!");
	          }  // Dispose() guaranteed here
	          Console.WriteLine("File safely closed.");
	      }
	  }
	  ```
	  
	  :::
- # Destructor vs Context Manager / IDisposable
  collapsed:: true
	- | Language | Destructor | Preferred RAII Pattern | Guarantee |
	  |---|---|---|---|
	  | **Python** | `__del__()` | `with` statement + `__enter__`/`__exit__` | ✅ Guaranteed by `with` |
	  | **C++** | `~ClassName()` | RAII (destructor = cleanup) | ✅ Deterministic |
	  | **Java** | `finalize()` (deprecated) | `try-with-resources` + `AutoCloseable` | ✅ Guaranteed by `try` |
	  | **JavaScript** | `FinalizationRegistry` | Explicit `.close()` in `finally` | ⚠️ Manual |
	  | **C#** | `~ClassName()` finalizer | `using` + `IDisposable` | ✅ Guaranteed by `using` |
	-
	- > [!warning] Never rely on `__del__` (Python) or finalizers (Java/C#) as the **only** cleanup mechanism. GC timing is non-deterministic — resources may leak. Always use context managers or `IDisposable`.
- # Key Takeaways
  collapsed:: true
	- Destructors run **automatically** — you don't call them manually.
	- **C++** — most powerful: destructors are deterministic, run at scope exit (RAII).
	- **Python** — `__del__` is non-deterministic; prefer `with` statement + `__enter__`/`__exit__`.
	- **Java** — `finalize()` is deprecated; use `AutoCloseable` + `try-with-resources`.
	- **C#** — use `IDisposable` + `using` statement; finalizers are last-resort fallbacks.
	- Always declare **virtual destructors** in C++ base classes to prevent resource leaks on polymorphic deletion.
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Python Docs — __del__](https://docs.python.org/3/reference/datamodel.html#object.__del__)
		- [cppreference — Destructor](https://en.cppreference.com/w/cpp/language/destructor)
		- [RAII — cppreference](https://en.cppreference.com/w/cpp/language/raii)
		- [C# IDisposable Pattern](https://docs.microsoft.com/en-us/dotnet/standard/garbage-collection/implementing-dispose)