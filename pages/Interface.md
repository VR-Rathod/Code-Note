---
seoTitle: Interface in OOP – Complete In-Depth Guide | Contracts, Abstract Methods, Multiple Inheritance
description: "Deep dive into Interfaces in OOP. Covers what an interface is, interface vs abstract class, implementing multiple interfaces, default methods, and examples in Python (ABC/Protocol), C++, Java, JavaScript, and C#."
keywords: "interface, OOP, abstract method, contract, protocol, ABC, implements, multiple interface, Python interface, Java interface, C++ interface, TypeScript interface, VR-Rathod, Code-Note"
displayTitle: Interface
---

> [!info] What is an Interface?
> An **Interface** defines a **contract** — a set of method signatures that any implementing class **must provide**. It specifies *what* a class must do, but says **nothing about how** to do it. Interfaces enable [[Polymorphism]] across unrelated class hierarchies and are the foundation of the **Dependency Inversion Principle**.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of an **electrical wall socket** 🔌. The socket defines a **standard contract**: two holes at specific positions, standard voltage. Any device that follows that contract (has the right plug) can use the socket — a phone charger, a lamp, a fan. The socket doesn't care *how* each device works internally.
		- | Socket | Interface |
		  |---|---|
		  | Standard plug shape | **Method signatures** |
		  | Any device with correct plug | **Implementing class** |
		  | What plug does is up to device | **Implementation details hidden** |
		  | Multiple devices, one socket | **Multiple implementations, one interface** |
	-
	- ## Interface vs Abstract Class
	  collapsed:: true
		- | Feature | Interface | Abstract Class |
		  |---|---|---|
		  | Methods | All abstract (usually) | Mix of abstract + concrete |
		  | Fields | No instance fields | Can have instance fields |
		  | Constructor | No | Yes |
		  | Multiple inheritance | ✅ Yes — a class can implement many | ❌ No — usually single |
		  | Relationship | **Can-do** / capability | **Is-a** / identity |
		  | When to use | Define capabilities across unrelated classes | Share code among related classes |
		-
		- ```
		  Use INTERFACE when:              Use ABSTRACT CLASS when:
		  "Can-do" relationship            "Is-a" relationship
		  Unrelated classes share ability  Related classes share code
		  Multiple "roles" per class       Single base type hierarchy
		  
		  e.g. Flyable, Serializable,      e.g. Animal (base for Dog, Cat)
		       Printable, Comparable             Shape (base for Circle, Rect)
		  ```

- # Python — Interface Patterns
  collapsed:: true
	- Python has no `interface` keyword. Interfaces are implemented via:
	- **1. Abstract Base Classes (ABC)** — enforces implementation at instantiation
	- **2. Protocol (Structural subtyping)** — duck typing with static type hints
	-
	- ```python
	  from abc import ABC, abstractmethod
	  from typing import Protocol
	  
	  # ── Pattern 1: ABC (Nominal — explicit implements) ────
	  class Serializable(ABC):
	      @abstractmethod
	      def serialize(self) -> str: ...
	  
	      @abstractmethod
	      def deserialize(self, data: str) -> None: ...
	  
	  # ── Pattern 2: Protocol (Structural — duck typing) ────
	  class Drawable(Protocol):
	      def draw(self) -> None: ...
	      def get_area(self) -> float: ...
	  ```

- # Implementation
  collapsed:: true
	- > [!note] A `Printable` + `Serializable` interface implemented by `Document` and `Invoice` — showing multiple interfaces per class.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  from abc import ABC, abstractmethod
	  import json
	  
	  # ── Interfaces (ABCs) ─────────────────────────────────
	  class Printable(ABC):
	      @abstractmethod
	      def print_content(self) -> None: ...
	  
	  class Serializable(ABC):
	      @abstractmethod
	      def serialize(self) -> str: ...
	  
	      @abstractmethod
	      def deserialize(self, data: str) -> None: ...
	  
	  class Saveable(ABC):
	      @abstractmethod
	      def save(self, filepath: str) -> None: ...
	  
	  
	  # ── Class implementing MULTIPLE interfaces ─────────────
	  class Document(Printable, Serializable, Saveable):
	      def __init__(self, title: str, content: str):
	          self.title = title
	          self.content = content
	  
	      def print_content(self) -> None:
	          print(f"=== {self.title} ===\n{self.content}")
	  
	      def serialize(self) -> str:
	          return json.dumps({"title": self.title, "content": self.content})
	  
	      def deserialize(self, data: str) -> None:
	          obj = json.loads(data)
	          self.title = obj["title"]
	          self.content = obj["content"]
	  
	      def save(self, filepath: str) -> None:
	          with open(filepath, "w") as f:
	              f.write(self.serialize())
	          print(f"Saved to {filepath}")
	  
	  
	  doc = Document("Meeting Notes", "Discussed project timeline.")
	  doc.print_content()               # === Meeting Notes === ...
	  serialized = doc.serialize()
	  print(serialized)                 # {"title": "Meeting Notes", ...}
	  
	  doc2 = Document("", "")
	  doc2.deserialize(serialized)
	  doc2.print_content()              # === Meeting Notes === ...
	  
	  # Polymorphism via interface type
	  def process(item: Printable) -> None:
	      item.print_content()          # works for ANY Printable
	  
	  process(doc)
	  ```
	  
	  ```c++
	  // ─── C++ — Pure virtual abstract classes as interfaces ────────────────
	  #include <iostream>
	  #include <string>
	  #include <fstream>
	  
	  // Pure interfaces (all pure virtual)
	  class IPrintable {
	  public:
	      virtual void printContent() const = 0;
	      virtual ~IPrintable() {}
	  };
	  
	  class ISerializable {
	  public:
	      virtual std::string serialize() const = 0;
	      virtual void deserialize(const std::string& data) = 0;
	      virtual ~ISerializable() {}
	  };
	  
	  // Class implementing multiple interfaces
	  class Document : public IPrintable, public ISerializable {
	      std::string title_, content_;
	  public:
	      Document(std::string t, std::string c) : title_(t), content_(c) {}
	  
	      void printContent() const override {
	          std::cout << "=== " << title_ << " ===\n" << content_ << "\n";
	      }
	      std::string serialize() const override {
	          return "{\"title\":\"" + title_ + "\",\"content\":\"" + content_ + "\"}";
	      }
	      void deserialize(const std::string& data) override {
	          // simplified parsing
	          std::cout << "Deserialized: " << data << "\n";
	      }
	  };
	  
	  void process(const IPrintable& item) { item.printContent(); }
	  
	  int main() {
	      Document doc("Meeting Notes", "Discussed project timeline.");
	      doc.printContent();
	      std::cout << doc.serialize() << "\n";
	      process(doc);
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import com.google.gson.Gson;
	  
	  interface Printable {
	      void printContent();
	  }
	  
	  interface Serializable {
	      String serialize();
	      void deserialize(String data);
	  }
	  
	  interface Saveable {
	      void save(String filepath);
	      // Java 8+ default method — optional implementation
	      default String getFormat() { return "json"; }
	  }
	  
	  // Implementing MULTIPLE interfaces
	  class Document implements Printable, Serializable, Saveable {
	      private String title;
	      private String content;
	  
	      Document(String title, String content) {
	          this.title = title; this.content = content;
	      }
	  
	      @Override public void printContent() {
	          System.out.println("=== " + title + " ===\n" + content);
	      }
	      @Override public String serialize() {
	          return "{\"title\":\"" + title + "\",\"content\":\"" + content + "\"}";
	      }
	      @Override public void deserialize(String data) {
	          System.out.println("Deserialized: " + data);
	      }
	      @Override public void save(String filepath) {
	          System.out.println("Saved to " + filepath + " as " + getFormat());
	      }
	  }
	  
	  class InterfaceDemo {
	      static void process(Printable item) { item.printContent(); }
	  
	      public static void main(String[] args) {
	          Document doc = new Document("Meeting Notes", "Discussed timeline.");
	          process(doc);
	          System.out.println(doc.serialize());
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript — Duck typing + Symbol.hasInstance ────────────────────
	  // JS has no interface keyword. Use duck typing + JSDoc or TypeScript.
	  
	  // "Interface" via base class with throwing methods
	  class Printable {
	      printContent() { throw new Error("printContent() must be implemented"); }
	  }
	  
	  class Serializable {
	      serialize() { throw new Error("serialize() must be implemented"); }
	      deserialize(data) { throw new Error("deserialize() must be implemented"); }
	  }
	  
	  // Mixin pattern for multiple "interfaces"
	  const SerializableMixin = (Base) => class extends Base {
	      serialize() { return JSON.stringify(this); }
	      deserialize(data) { Object.assign(this, JSON.parse(data)); }
	  };
	  
	  class Document extends SerializableMixin(Printable) {
	      constructor(title, content) {
	          super();
	          this.title = title;
	          this.content = content;
	      }
	      printContent() {
	          console.log(`=== ${this.title} ===\n${this.content}`);
	      }
	  }
	  
	  const doc = new Document("Meeting Notes", "Discussed timeline.");
	  doc.printContent();
	  console.log(doc.serialize());
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Text.Json;
	  
	  interface IPrintable {
	      void PrintContent();
	  }
	  
	  interface ISerializable {
	      string Serialize();
	      void Deserialize(string data);
	  }
	  
	  interface ISaveable {
	      void Save(string filepath);
	      string Format => "json";  // C# 8+ default interface method
	  }
	  
	  // Implementing multiple interfaces
	  class Document : IPrintable, ISerializable, ISaveable {
	      public string Title { get; private set; }
	      public string Content { get; private set; }
	  
	      public Document(string title, string content) {
	          Title = title; Content = content;
	      }
	  
	      public void PrintContent() =>
	          Console.WriteLine($"=== {Title} ===\n{Content}");
	  
	      public string Serialize() =>
	          JsonSerializer.Serialize(new { Title, Content });
	  
	      public void Deserialize(string data) =>
	          Console.WriteLine($"Deserialized: {data}");
	  
	      public void Save(string filepath) =>
	          Console.WriteLine($"Saved to {filepath}");
	  
	      static void Process(IPrintable item) => item.PrintContent();
	  
	      static void Main() {
	          var doc = new Document("Meeting Notes", "Discussed timeline.");
	          Process(doc);
	          Console.WriteLine(doc.Serialize());
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- An interface defines **what** — not **how**. It's a pure contract.
	- A class can implement **multiple interfaces** — enabling a form of multiple inheritance without the diamond problem.
	- **Interface = Can-do / capability** (Flyable, Serializable). **Abstract class = Is-a / identity** (Animal, Shape).
	- Python uses `ABC` (nominal) or `Protocol` (structural/duck typing) to simulate interfaces.
	- Interfaces are the core tool for applying the **Dependency Inversion Principle** — depend on abstractions, not concretions.

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Python Docs — abc module](https://docs.python.org/3/library/abc.html)
		- [Python typing.Protocol](https://docs.python.org/3/library/typing.html#typing.Protocol)
		- [Java Docs — Interfaces](https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html)
		- [C# Interfaces](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/interfaces/)