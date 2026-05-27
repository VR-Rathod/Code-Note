---
seoTitle: Proxy Pattern in OOP – Complete In-Depth Guide | Structural Design Pattern, Virtual Proxy, Protection Proxy
description: "Deep dive into the Proxy design pattern. Covers virtual proxy, protection proxy, caching proxy, remote proxy, logging proxy, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "proxy pattern, structural design pattern, virtual proxy, protection proxy, caching proxy, lazy initialization, access control, GoF, Python proxy, Java proxy, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Proxy Pattern
---

> [!info] What is the Proxy Pattern?
> The **Proxy Pattern** is a **structural design pattern** that provides a **surrogate or placeholder** for another object to control access to it. The proxy has the same interface as the real object — clients can't tell the difference — but the proxy adds functionality like lazy initialization, access control, caching, or logging before/after delegating to the real object.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **bank teller** 💳:
		  - You don't go directly to the bank vault to get your money.
		  - You go to the teller (proxy), who checks your identity (access control), logs the transaction (logging), and only then accesses the vault (real subject).
		  - Or: **HTTP proxy servers** — they sit between your browser and the internet, caching responses, filtering content, and logging requests — while the browser thinks it's talking directly to the server.
	-
	- ## Types of Proxies
	  collapsed:: true
		- | Type | Description | Use Case |
		  |---|---|---|
		  | **Virtual Proxy** | Creates expensive object on demand (lazy init) | Large images, DB connections |
		  | **Protection Proxy** | Controls access based on permissions | Authorization, role-based access |
		  | **Caching Proxy** | Caches results, returns cached for repeat requests | API calls, database queries |
		  | **Remote Proxy** | Represents an object in another address space | Network services, RPC |
		  | **Logging Proxy** | Logs all requests before/after delegation | Debugging, audit trails |
	-
	- ## Proxy vs Decorator vs Adapter
	  collapsed:: true
		- | | Proxy | [[Decorator Pattern]] | [[Adapter Pattern]] |
		  |---|---|---|---|
		  | **Interface** | Same as real subject | Same as component | Different |
		  | **Purpose** | Control access | Add behavior | Convert interface |
		  | **Client knows** | Proxy exists? No | Decorator exists? No | Uses new interface |
	-
	- ## UML Structure
	  collapsed:: true
		- ```mermaid
		  classDiagram
		      class Subject {
		          <<interface>>
		          +request()
		      }
		      class RealSubject {
		          +request()
		      }
		      class Proxy {
		          -realSubject: RealSubject
		          +request()
		      }
		      class Client {
		          +doWork(s: Subject)
		      }
		      Subject <|.. RealSubject
		      Subject <|.. Proxy
		      Proxy o--> RealSubject : delegates to
		      Client --> Subject : uses
		  ```

- # Implementation
  collapsed:: true
	- > [!note] Three proxy types in one: Virtual Proxy (lazy image load), Caching Proxy (API responses), Protection Proxy (role-based file access).
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  from abc import ABC, abstractmethod
	  from functools import lru_cache
	  from typing import Optional
	  import time
	  
	  # ═══════════════════════════════════════════════════════════════════
	  # 1. VIRTUAL PROXY — Lazy initialization (expensive object)
	  # ═══════════════════════════════════════════════════════════════════
	  class Image(ABC):
	      @abstractmethod
	      def display(self) -> None: ...
	  
	  class HighResImage(Image):
	      """Expensive: simulates loading a large image file from disk."""
	      def __init__(self, filename: str):
	          self._filename = filename
	          print(f"[HighResImage] Loading '{filename}' from disk... (expensive!)")
	          time.sleep(0.1)   # Simulate load time
	  
	      def display(self) -> None:
	          print(f"[HighResImage] Displaying '{self._filename}'")
	  
	  class ImageProxy(Image):
	      """Virtual Proxy: creates HighResImage only when display() is first called."""
	      def __init__(self, filename: str):
	          self._filename = filename
	          self._real: Optional[HighResImage] = None  # Not loaded yet
	  
	      def display(self) -> None:
	          if self._real is None:               # Lazy initialization
	              self._real = HighResImage(self._filename)
	          self._real.display()                 # Delegate to real object
	  
	  # ═══════════════════════════════════════════════════════════════════
	  # 2. CACHING PROXY — Avoid repeated expensive operations
	  # ═══════════════════════════════════════════════════════════════════
	  class WeatherService(ABC):
	      @abstractmethod
	      def get_temperature(self, city: str) -> float: ...
	  
	  class RealWeatherService(WeatherService):
	      """Simulates a slow external API call."""
	      def get_temperature(self, city: str) -> float:
	          print(f"  [API] Fetching temperature for {city}...")
	          time.sleep(0.05)
	          return {"London": 15.0, "Tokyo": 22.0, "NYC": 18.0}.get(city, 20.0)
	  
	  class CachingWeatherProxy(WeatherService):
	      """Caching Proxy: returns cached data on repeated calls."""
	      def __init__(self):
	          self._real = RealWeatherService()
	          self._cache: dict[str, float] = {}
	  
	      def get_temperature(self, city: str) -> float:
	          if city not in self._cache:
	              self._cache[city] = self._real.get_temperature(city)   # Miss
	              print(f"  [Cache] Stored {city}")
	          else:
	              print(f"  [Cache] HIT for {city}")
	          return self._cache[city]
	  
	  # ═══════════════════════════════════════════════════════════════════
	  # 3. PROTECTION PROXY — Role-based access control
	  # ═══════════════════════════════════════════════════════════════════
	  class FileService(ABC):
	      @abstractmethod
	      def read(self, filename: str) -> str: ...
	      @abstractmethod
	      def delete(self, filename: str) -> None: ...
	  
	  class RealFileService(FileService):
	      def read(self, filename: str) -> str:
	          return f"[File] Contents of '{filename}'"
	      def delete(self, filename: str) -> None:
	          print(f"[File] Deleted '{filename}'")
	  
	  class ProtectedFileProxy(FileService):
	      """Protection Proxy: restricts delete to admin role."""
	      def __init__(self, user_role: str):
	          self._real = RealFileService()
	          self._role = user_role
	  
	      def read(self, filename: str) -> str:
	          return self._real.read(filename)      # All roles can read
	  
	      def delete(self, filename: str) -> None:
	          if self._role != "admin":
	              raise PermissionError(f"Role '{self._role}' cannot delete files!")
	          self._real.delete(filename)           # Delegate only for admin
	  
	  
	  # ── Client ─────────────────────────────────────────────────────────
	  print("=== Virtual Proxy ===")
	  img = ImageProxy("wallpaper.jpg")  # No load yet
	  print("Proxy created, image not loaded yet.")
	  img.display()                      # Load happens here
	  img.display()                      # No reload — already loaded
	  
	  print("\n=== Caching Proxy ===")
	  weather = CachingWeatherProxy()
	  print(weather.get_temperature("London"))  # API call
	  print(weather.get_temperature("London"))  # Cache hit
	  print(weather.get_temperature("Tokyo"))   # API call
	  
	  print("\n=== Protection Proxy ===")
	  user_proxy  = ProtectedFileProxy("user")
	  admin_proxy = ProtectedFileProxy("admin")
	  print(user_proxy.read("report.txt"))      # OK
	  try:
	      user_proxy.delete("report.txt")       # PermissionError
	  except PermissionError as e:
	      print(f"Blocked: {e}")
	  admin_proxy.delete("report.txt")          # OK
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <unordered_map>
	  #include <memory>
	  #include <stdexcept>
	  
	  // ── Virtual Proxy ─────────────────────────────────────────────────────
	  class Image {
	  public:
	      virtual void display() = 0;
	      virtual ~Image() = default;
	  };
	  
	  class HighResImage : public Image {
	      std::string filename_;
	  public:
	      HighResImage(const std::string& filename) : filename_(filename) {
	          std::cout << "[HighResImage] Loading '" << filename << "' (expensive)\n";
	      }
	      void display() override {
	          std::cout << "[HighResImage] Displaying '" << filename_ << "'\n";
	      }
	  };
	  
	  class ImageProxy : public Image {
	      std::string filename_;
	      mutable std::unique_ptr<HighResImage> real_;
	  public:
	      ImageProxy(std::string filename) : filename_(std::move(filename)) {}
	      void display() override {
	          if (!real_) real_ = std::make_unique<HighResImage>(filename_);  // Lazy init
	          real_->display();
	      }
	  };
	  
	  // ── Caching Proxy ─────────────────────────────────────────────────────
	  class WeatherService {
	  public:
	      virtual double getTemperature(const std::string& city) = 0;
	      virtual ~WeatherService() = default;
	  };
	  
	  class RealWeatherService : public WeatherService {
	  public:
	      double getTemperature(const std::string& city) override {
	          std::cout << "  [API] Fetching " << city << "\n";
	          if (city == "London") return 15.0;
	          if (city == "Tokyo")  return 22.0;
	          return 20.0;
	      }
	  };
	  
	  class CachingWeatherProxy : public WeatherService {
	      RealWeatherService real_;
	      std::unordered_map<std::string, double> cache_;
	  public:
	      double getTemperature(const std::string& city) override {
	          auto it = cache_.find(city);
	          if (it != cache_.end()) {
	              std::cout << "  [Cache] HIT: " << city << "\n";
	              return it->second;
	          }
	          double temp = real_.getTemperature(city);
	          cache_[city] = temp;
	          return temp;
	      }
	  };
	  
	  int main() {
	      std::cout << "=== Virtual Proxy ===\n";
	      ImageProxy img("wallpaper.jpg");
	      std::cout << "Proxy created — no load yet.\n";
	      img.display();   // Load happens here
	      img.display();   // Already loaded
	  
	      std::cout << "\n=== Caching Proxy ===\n";
	      CachingWeatherProxy weather;
	      std::cout << weather.getTemperature("London") << "\n";  // API call
	      std::cout << weather.getTemperature("London") << "\n";  // Cache hit
	      std::cout << weather.getTemperature("Tokyo")  << "\n";  // API call
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  // ── Virtual Proxy ─────────────────────────────────────────────────────
	  interface Image { void display(); }
	  
	  class HighResImage implements Image {
	      private final String filename;
	      HighResImage(String filename) {
	          this.filename = filename;
	          System.out.println("[HighResImage] Loading '" + filename + "' (expensive)");
	      }
	      public void display() { System.out.println("[HighResImage] Displaying '" + filename + "'"); }
	  }
	  
	  class ImageProxy implements Image {
	      private final String filename;
	      private HighResImage real = null;
	  
	      ImageProxy(String filename) { this.filename = filename; }
	  
	      public void display() {
	          if (real == null) real = new HighResImage(filename);  // Lazy init
	          real.display();
	      }
	  }
	  
	  // ── Protection Proxy ──────────────────────────────────────────────────
	  interface FileService { String read(String f); void delete(String f); }
	  
	  class RealFileService implements FileService {
	      public String read(String f)   { return "[File] Contents of '" + f + "'"; }
	      public void   delete(String f) { System.out.println("[File] Deleted '" + f + "'"); }
	  }
	  
	  class ProtectedFileProxy implements FileService {
	      private final RealFileService real = new RealFileService();
	      private final String role;
	  
	      ProtectedFileProxy(String role) { this.role = role; }
	  
	      public String read(String f) { return real.read(f); }
	  
	      public void delete(String f) {
	          if (!role.equals("admin"))
	              throw new SecurityException("Role '" + role + "' cannot delete!");
	          real.delete(f);
	      }
	  }
	  
	  class ProxyDemo {
	      public static void main(String[] args) {
	          System.out.println("=== Virtual Proxy ===");
	          Image img = new ImageProxy("wallpaper.jpg");
	          System.out.println("Proxy created — no load yet.");
	          img.display();   // Load happens now
	          img.display();   // Reuse
	  
	          System.out.println("\n=== Protection Proxy ===");
	          FileService user  = new ProtectedFileProxy("user");
	          FileService admin = new ProtectedFileProxy("admin");
	          System.out.println(user.read("report.txt"));
	          try { user.delete("report.txt"); }
	          catch (SecurityException e) { System.out.println("Blocked: " + e.getMessage()); }
	          admin.delete("report.txt");  // OK
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  // JS has built-in Proxy object — showcase both custom and built-in
	  
	  // ── Custom Virtual Proxy ──────────────────────────────────────────────
	  class HighResImage {
	      constructor(filename) {
	          this.filename = filename;
	          console.log(`[HighResImage] Loading '${filename}' (expensive)`);
	      }
	      display() { console.log(`[HighResImage] Displaying '${this.filename}'`); }
	  }
	  
	  class ImageProxy {
	      #filename; #real = null;
	      constructor(filename) { this.#filename = filename; }
	      display() {
	          if (!this.#real) this.#real = new HighResImage(this.#filename);
	          this.#real.display();
	      }
	  }
	  
	  // ── JS Built-in Proxy — Validation & Logging ──────────────────────────
	  const user = { name: "Alice", age: 25, role: "user" };
	  
	  const userProxy = new Proxy(user, {
	      get(target, prop) {
	          console.log(`[Proxy] Getting: ${prop}`);
	          return target[prop];
	      },
	      set(target, prop, value) {
	          if (prop === "age" && (typeof value !== "number" || value < 0))
	              throw new TypeError("Age must be a positive number");
	          console.log(`[Proxy] Setting: ${prop} = ${value}`);
	          target[prop] = value;
	          return true;
	      }
	  });
	  
	  console.log("=== Custom Virtual Proxy ===");
	  const img = new ImageProxy("wallpaper.jpg");
	  console.log("Proxy created — no load yet.");
	  img.display();
	  img.display();
	  
	  console.log("\n=== Built-in JS Proxy ===");
	  console.log(userProxy.name);    // Logs: Getting: name
	  userProxy.age = 30;             // Logs: Setting: age = 30
	  try { userProxy.age = -5; } catch (e) { console.log("Error:", e.message); }
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  
	  // ── Virtual Proxy ─────────────────────────────────────────────────────
	  interface IImage { void Display(); }
	  
	  class HighResImage : IImage {
	      readonly string filename;
	      public HighResImage(string filename) {
	          this.filename = filename;
	          Console.WriteLine($"[HighResImage] Loading '{filename}' (expensive)");
	      }
	      public void Display() => Console.WriteLine($"[HighResImage] Displaying '{filename}'");
	  }
	  
	  class ImageProxy : IImage {
	      readonly string filename;
	      HighResImage? real = null;
	  
	      public ImageProxy(string filename) { this.filename = filename; }
	  
	      public void Display() {
	          real ??= new HighResImage(filename);   // Lazy init with ??=
	          real.Display();
	      }
	  }
	  
	  // ── Caching Proxy ─────────────────────────────────────────────────────
	  interface IWeatherService { double GetTemperature(string city); }
	  
	  class RealWeatherService : IWeatherService {
	      public double GetTemperature(string city) {
	          Console.WriteLine($"  [API] Fetching {city}");
	          return city switch { "London" => 15.0, "Tokyo" => 22.0, _ => 20.0 };
	      }
	  }
	  
	  class CachingWeatherProxy : IWeatherService {
	      readonly RealWeatherService real = new();
	      readonly Dictionary<string, double> cache = new();
	  
	      public double GetTemperature(string city) {
	          if (cache.TryGetValue(city, out var cached)) {
	              Console.WriteLine($"  [Cache] HIT: {city}");
	              return cached;
	          }
	          var temp = real.GetTemperature(city);
	          cache[city] = temp;
	          return temp;
	      }
	  }
	  
	  class ProxyDemo {
	      static void Main() {
	          Console.WriteLine("=== Virtual Proxy ===");
	          IImage img = new ImageProxy("wallpaper.jpg");
	          Console.WriteLine("Proxy created — no load yet.");
	          img.Display();    // Load happens here
	          img.Display();    // Reuse
	  
	          Console.WriteLine("\n=== Caching Proxy ===");
	          IWeatherService weather = new CachingWeatherProxy();
	          Console.WriteLine(weather.GetTemperature("London"));   // API call
	          Console.WriteLine(weather.GetTemperature("London"));   // Cache hit
	          Console.WriteLine(weather.GetTemperature("Tokyo"));    // API call
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- The proxy has the **same interface** as the real subject — transparent to clients.
	- Main proxy types: **Virtual** (lazy init), **Caching** (performance), **Protection** (access control), **Logging** (audit).
	- Use **composition**: the proxy holds a reference to the real subject and delegates calls.
	- JS has a built-in `Proxy` object for dynamic interception of property access.
	- Related: [[Decorator Pattern]], [[Adapter Pattern]], [[Facade Pattern]]

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Refactoring Guru — Proxy](https://refactoring.guru/design-patterns/proxy)
		- [GoF Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
