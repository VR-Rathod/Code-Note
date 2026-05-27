---
seoTitle: Template Method Pattern in OOP – Complete In-Depth Guide | Behavioral Design Pattern
description: "Deep dive into the Template Method design pattern. Covers skeleton algorithms, abstract steps, hook methods, Hollywood Principle, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "template method pattern, behavioral design pattern, skeleton algorithm, hook method, Hollywood Principle, GoF, Python template method, Java template method, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Template Method Pattern
---

> [!info] What is the Template Method Pattern?
> The **Template Method Pattern** is a **behavioral design pattern** that defines the **skeleton of an algorithm** in a base class, deferring some steps to subclasses. Subclasses can override specific steps without changing the algorithm's structure. It embodies the **Hollywood Principle**: "Don't call us, we'll call you" — the base class calls the overridable steps, not the other way around.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of **making coffee or tea** ☕🍵:
		  - Both follow the same skeleton: Boil water → Brew → Pour in cup → Add extras.
		  - The **steps differ**: coffee brews differently from tea; extras differ (sugar vs lemon).
		  - The skeleton (template) is the same. The specific steps are different.
		  - The base class defines the skeleton. Subclasses fill in the details.
	-
	- ## The Hollywood Principle
	  collapsed:: true
		- > "Don't call us, we'll call you."
		- The base class **calls** the overridable methods — subclasses don't call the base class algorithm.
		- This inverts control: instead of subclasses driving the flow, the parent template drives it.
	-
	- ## Template Method vs Strategy
	  collapsed:: true
		- | | Template Method | [[Strategy Pattern]] |
		  |---|---|---|
		  | **Mechanism** | Inheritance — subclasses override steps | Composition — inject strategy object |
		  | **Change scope** | Change individual steps | Swap entire algorithm |
		  | **Coupling** | Tighter (inheritance) | Looser (composition, preferred) |
		  | **Use when** | Variants differ in 1–2 steps | Variants differ in the whole approach |
	-
	- ## UML Structure
	  collapsed:: true
		- ```mermaid
		  classDiagram
		      class AbstractClass {
		          +templateMethod()
		          #step1()
		          #step2()
		          #hook()
		      }
		      class ConcreteClassA {
		          #step1()
		          #step2()
		      }
		      class ConcreteClassB {
		          #step1()
		          #step2()
		          #hook()
		      }
		      AbstractClass <|-- ConcreteClassA
		      AbstractClass <|-- ConcreteClassB
		  ```

- # Implementation
  collapsed:: true
	- > [!note] Data processing pipeline — read, parse, analyze, report. The pipeline skeleton is fixed; each data type fills in its own steps.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  from abc import ABC, abstractmethod
	  
	  # ── Abstract Class with Template Method ───────────────────────────────
	  class DataProcessor(ABC):
	      """Template: fixed skeleton for processing any data format."""
	  
	      # ── Template Method — DO NOT override this ──────────────────────
	      def process(self, source: str) -> dict:
	          """Skeleton: always runs these steps in this order."""
	          print(f"\n{'='*40}")
	          raw  = self.read_data(source)        # Step 1 — overridable
	          data = self.parse_data(raw)           # Step 2 — overridable
	          if self.should_validate():            # Hook — optional override
	              data = self.validate(data)
	          result = self.analyze(data)           # Step 3 — overridable
	          self.report(result)                   # Step 4 — overridable
	          print(f"{'='*40}")
	          return result
	  
	      # ── Abstract steps — MUST override ─────────────────────────────
	      @abstractmethod
	      def read_data(self, source: str) -> str: ...
	  
	      @abstractmethod
	      def parse_data(self, raw: str) -> list: ...
	  
	      @abstractmethod
	      def analyze(self, data: list) -> dict: ...
	  
	      # ── Concrete step — shared by all ───────────────────────────────
	      def report(self, result: dict) -> None:
	          print(f"Result: {result}")
	  
	      # ── Hook — optional override, has default behavior ──────────────
	      def should_validate(self) -> bool:
	          return False   # Default: skip validation
	  
	      def validate(self, data: list) -> list:
	          return data    # Default: pass through
	  
	  
	  # ── Concrete Class A — CSV Processor ─────────────────────────────────
	  class CSVProcessor(DataProcessor):
	      def read_data(self, source: str) -> str:
	          print(f"Reading CSV from: {source}")
	          return "Alice,30,Engineer\nBob,25,Designer\nCarol,35,Manager"
	  
	      def parse_data(self, raw: str) -> list:
	          print("Parsing CSV rows...")
	          return [r.split(",") for r in raw.strip().splitlines()]
	  
	      def analyze(self, data: list) -> dict:
	          ages = [int(row[1]) for row in data]
	          return {"count": len(data), "avg_age": sum(ages) / len(ages)}
	  
	      # Override hook to enable validation
	      def should_validate(self) -> bool: return True
	      def validate(self, data: list) -> list:
	          print("Validating CSV rows...")
	          return [row for row in data if len(row) == 3]  # Drop malformed rows
	  
	  
	  # ── Concrete Class B — Log Processor ─────────────────────────────────
	  class LogProcessor(DataProcessor):
	      def read_data(self, source: str) -> str:
	          print(f"Reading log from: {source}")
	          return "[ERROR] DB timeout\n[INFO] Server start\n[ERROR] Disk full\n[WARN] High memory"
	  
	      def parse_data(self, raw: str) -> list:
	          print("Parsing log entries...")
	          return [line.split("] ", 1) for line in raw.splitlines()]
	  
	      def analyze(self, data: list) -> dict:
	          counts = {}
	          for level, _ in data:
	              key = level.lstrip("[")
	              counts[key] = counts.get(key, 0) + 1
	          return {"log_levels": counts, "total": len(data)}
	  
	  
	  # ── Client ─────────────────────────────────────────────────────────
	  csv_proc = CSVProcessor()
	  csv_proc.process("employees.csv")
	  # ==============================
	  # Reading CSV from: employees.csv
	  # Parsing CSV rows...
	  # Validating CSV rows...
	  # Result: {'count': 3, 'avg_age': 30.0}
	  
	  log_proc = LogProcessor()
	  log_proc.process("server.log")
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  #include <sstream>
	  
	  // ── Abstract Class ────────────────────────────────────────────────────
	  class DataProcessor {
	  public:
	      // Template Method — non-virtual (fixed skeleton)
	      void process(const std::string& source) {
	          std::cout << "\n" << std::string(40, '=') << "\n";
	          std::string raw   = readData(source);    // virtual step
	          auto        data  = parseData(raw);       // virtual step
	          auto        result = analyze(data);       // virtual step
	          report(result);
	          std::cout << std::string(40, '=') << "\n";
	      }
	  
	  protected:
	      virtual std::string readData(const std::string& src) = 0;
	      virtual std::vector<std::string> parseData(const std::string& raw) = 0;
	      virtual std::string analyze(const std::vector<std::string>& data) = 0;
	  
	      // Concrete step — shared
	      void report(const std::string& result) {
	          std::cout << "Result: " << result << "\n";
	      }
	  
	  public:
	      virtual ~DataProcessor() = default;
	  };
	  
	  // ── Concrete Class — CSV ──────────────────────────────────────────────
	  class CSVProcessor : public DataProcessor {
	      std::string readData(const std::string& src) override {
	          std::cout << "Reading CSV: " << src << "\n";
	          return "Alice,30\nBob,25\nCarol,35";
	      }
	      std::vector<std::string> parseData(const std::string& raw) override {
	          std::vector<std::string> rows;
	          std::stringstream ss(raw);
	          std::string row;
	          while (std::getline(ss, row)) rows.push_back(row);
	          return rows;
	      }
	      std::string analyze(const std::vector<std::string>& data) override {
	          return "Processed " + std::to_string(data.size()) + " rows";
	      }
	  };
	  
	  // ── Concrete Class — Log ──────────────────────────────────────────────
	  class LogProcessor : public DataProcessor {
	      std::string readData(const std::string& src) override {
	          std::cout << "Reading log: " << src << "\n";
	          return "[ERROR] DB timeout\n[INFO] Server start\n[ERROR] Disk full";
	      }
	      std::vector<std::string> parseData(const std::string& raw) override {
	          std::vector<std::string> lines;
	          std::stringstream ss(raw);
	          std::string line;
	          while (std::getline(ss, line)) lines.push_back(line);
	          return lines;
	      }
	      std::string analyze(const std::vector<std::string>& data) override {
	          int errors = 0;
	          for (const auto& l : data) if (l.find("[ERROR]") != std::string::npos) ++errors;
	          return "Errors: " + std::to_string(errors) + "/" + std::to_string(data.size());
	      }
	  };
	  
	  int main() {
	      CSVProcessor csv;  csv.process("employees.csv");
	      LogProcessor log;  log.process("server.log");
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  // ── Abstract Class ─────────────────────────────────────────────────────
	  abstract class DataProcessor {
	  
	      // Template Method — final prevents overriding the skeleton
	      public final void process(String source) {
	          System.out.println("\n" + "=".repeat(40));
	          String raw  = readData(source);
	          List<String> data = parseData(raw);
	          Map<String, Object> result = analyze(data);
	          report(result);
	          System.out.println("=".repeat(40));
	      }
	  
	      protected abstract String readData(String source);
	      protected abstract List<String> parseData(String raw);
	      protected abstract Map<String, Object> analyze(List<String> data);
	  
	      // Concrete shared step
	      protected void report(Map<String, Object> result) {
	          System.out.println("Result: " + result);
	      }
	  
	      // Hook — optional override
	      protected boolean shouldValidate() { return false; }
	  }
	  
	  // ── Concrete Class — CSV ────────────────────────────────────────────────
	  class CSVProcessor extends DataProcessor {
	      protected String readData(String source) {
	          System.out.println("Reading CSV: " + source);
	          return "Alice,30,Engineer\nBob,25,Designer";
	      }
	      protected List<String> parseData(String raw) {
	          System.out.println("Parsing CSV...");
	          return Arrays.asList(raw.split("\n"));
	      }
	      protected Map<String, Object> analyze(List<String> data) {
	          return Map.of("rows", data.size(), "format", "CSV");
	      }
	  }
	  
	  // ── Concrete Class — Log ────────────────────────────────────────────────
	  class LogProcessor extends DataProcessor {
	      protected String readData(String source) {
	          System.out.println("Reading log: " + source);
	          return "[ERROR] DB timeout\n[INFO] Start\n[ERROR] Disk full";
	      }
	      protected List<String> parseData(String raw) {
	          return Arrays.asList(raw.split("\n"));
	      }
	      protected Map<String, Object> analyze(List<String> data) {
	          long errors = data.stream().filter(l -> l.contains("[ERROR]")).count();
	          return Map.of("total", data.size(), "errors", errors);
	      }
	  }
	  
	  class TemplateMethodDemo {
	      public static void main(String[] args) {
	          new CSVProcessor().process("employees.csv");
	          new LogProcessor().process("server.log");
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  
	  // ── Abstract Base Class ───────────────────────────────────────────────
	  class DataProcessor {
	      // Template Method — defines the skeleton
	      process(source) {
	          console.log("\n" + "=".repeat(40));
	          const raw    = this.readData(source);     // overridable step
	          const data   = this.parseData(raw);       // overridable step
	          const result = this.analyze(data);        // overridable step
	          this.report(result);                      // shared step
	          console.log("=".repeat(40));
	          return result;
	      }
	  
	      // Steps to override
	      readData(source)  { throw new Error("readData() must be implemented"); }
	      parseData(raw)    { throw new Error("parseData() must be implemented"); }
	      analyze(data)     { throw new Error("analyze() must be implemented"); }
	  
	      // Shared step
	      report(result) { console.log("Result:", result); }
	  
	      // Hook — default no-op
	      shouldValidate() { return false; }
	  }
	  
	  // ── CSV Processor ─────────────────────────────────────────────────────
	  class CSVProcessor extends DataProcessor {
	      readData(source) {
	          console.log(`Reading CSV: ${source}`);
	          return "Alice,30\nBob,25\nCarol,35";
	      }
	      parseData(raw) {
	          return raw.split("\n").map(row => row.split(","));
	      }
	      analyze(data) {
	          const ages = data.map(r => parseInt(r[1]));
	          return { count: data.length, avgAge: ages.reduce((a, b) => a + b, 0) / ages.length };
	      }
	  }
	  
	  // ── Log Processor ─────────────────────────────────────────────────────
	  class LogProcessor extends DataProcessor {
	      readData(source) {
	          console.log(`Reading log: ${source}`);
	          return "[ERROR] DB timeout\n[INFO] Start\n[ERROR] Disk full";
	      }
	      parseData(raw) { return raw.split("\n"); }
	      analyze(data) {
	          const errors = data.filter(l => l.includes("[ERROR]")).length;
	          return { total: data.length, errors };
	      }
	  }
	  
	  new CSVProcessor().process("employees.csv");
	  new LogProcessor().process("server.log");
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  using System.Linq;
	  
	  // ── Abstract Class ────────────────────────────────────────────────────
	  abstract class DataProcessor {
	  
	      // Template Method — sealed prevents overriding the skeleton
	      public sealed void Process(string source) {
	          Console.WriteLine("\n" + new string('=', 40));
	          var raw    = ReadData(source);
	          var data   = ParseData(raw);
	          var result = Analyze(data);
	          Report(result);
	          Console.WriteLine(new string('=', 40));
	      }
	  
	      protected abstract string ReadData(string source);
	      protected abstract List<string> ParseData(string raw);
	      protected abstract Dictionary<string, object> Analyze(List<string> data);
	  
	      // Shared concrete step
	      protected void Report(Dictionary<string, object> result) {
	          Console.WriteLine("Result: " + string.Join(", ", result.Select(kv => $"{kv.Key}={kv.Value}")));
	      }
	  
	      // Hook — optional
	      protected virtual bool ShouldValidate() => false;
	  }
	  
	  class CSVProcessor : DataProcessor {
	      protected override string ReadData(string s) { Console.WriteLine($"Reading CSV: {s}"); return "Alice,30\nBob,25\nCarol,35"; }
	      protected override List<string> ParseData(string raw) => new(raw.Split("\n"));
	      protected override Dictionary<string, object> Analyze(List<string> data) {
	          var ages = data.Select(r => int.Parse(r.Split(',')[1])).ToList();
	          return new() { ["count"] = data.Count, ["avg_age"] = ages.Average() };
	      }
	  }
	  
	  class LogProcessor : DataProcessor {
	      protected override string ReadData(string s) { Console.WriteLine($"Reading log: {s}"); return "[ERROR] DB\n[INFO] Start\n[ERROR] Disk"; }
	      protected override List<string> ParseData(string raw) => new(raw.Split("\n"));
	      protected override Dictionary<string, object> Analyze(List<string> data) {
	          var errors = data.Count(l => l.Contains("[ERROR]"));
	          return new() { ["total"] = data.Count, ["errors"] = errors };
	      }
	  }
	  
	  class TemplateMethodDemo {
	      static void Main() {
	          new CSVProcessor().Process("employees.csv");
	          new LogProcessor().Process("server.log");
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- Defines an algorithm's **skeleton** in the base class — subclasses fill in specific steps.
	- The base class **calls** the overridable steps (Hollywood Principle) — inversion of control.
	- Use `final` / `sealed` / non-virtual on the template method to lock the skeleton.
	- **Hooks** are optional override points with a default behavior (vs. abstract steps that must be overridden).
	- Prefer [[Strategy Pattern]] when you want to swap the whole algorithm; use Template Method when only steps vary.
	- Related: [[Strategy Pattern]], [[Factory Pattern]], [[Observer Pattern]]

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Refactoring Guru — Template Method](https://refactoring.guru/design-patterns/template-method)
		- [GoF Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
