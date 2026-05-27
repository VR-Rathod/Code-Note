---
seoTitle: Adapter Pattern in OOP – Complete In-Depth Guide | Structural Design Pattern, Wrapper
description: "Deep dive into the Adapter design pattern. Covers class adapter vs object adapter, incompatible interfaces, legacy integration, two-way adapters, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "adapter pattern, structural design pattern, wrapper, incompatible interfaces, legacy code, class adapter, object adapter, GoF, Python adapter, Java adapter, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Adapter Pattern
---

> [!info] What is the Adapter Pattern?
> The **Adapter Pattern** is a **structural design pattern** that allows objects with **incompatible interfaces** to work together. It acts as a **wrapper** that translates one interface into another that a client expects — like a power plug adapter that lets you plug a European device into an American socket.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **travel power adapter** 🔌:
		  - Your laptop charger has a US plug (two flat pins).
		  - The wall socket in Europe has a different shape.
		  - The **adapter** sits between them, converting the interface — the laptop doesn't change, the wall doesn't change, the adapter bridges the gap.
		- In code: you have a new component expecting `ILogger` but the existing logger class exposes `WriteLog()` — the adapter wraps the old class and exposes `ILogger`.
	-
	- ## Object Adapter vs Class Adapter
	  collapsed:: true
		- | | Object Adapter | Class Adapter |
		  |---|---|---|
		  | **Mechanism** | Composition (has-a) | Multiple inheritance / extends |
		  | **Flexibility** | Can adapt subclasses too | Limited to specific class |
		  | **Preferred** | ✅ Yes (follows composition over inheritance) | ❌ Only when necessary |
		  | **Languages** | All OOP languages | Only languages with multiple inheritance |
	-
	- ## UML Structure
	  collapsed:: true
		- ```mermaid
		  classDiagram
		      class Target {
		          <<interface>>
		          +request()
		      }
		      class Adaptee {
		          +specificRequest()
		      }
		      class Adapter {
		          -adaptee: Adaptee
		          +request()
		      }
		      class Client {
		          +doWork(target: Target)
		      }
		      Target <|.. Adapter
		      Adapter o--> Adaptee : wraps
		      Client --> Target : uses
		  ```

- # Implementation
  collapsed:: true
	- > [!note] Integrating a legacy XML analytics API with a new JSON-based analytics interface. The adapter translates between them without changing either side.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  # Scenario: new code expects IAnalytics (JSON-based),
	  # but LegacyXMLAnalytics speaks XML only.
	  from abc import ABC, abstractmethod
	  import json, xml.etree.ElementTree as ET
	  
	  # ── Target Interface (what the new system expects) ─────────────────
	  class IAnalytics(ABC):
	      @abstractmethod
	      def track_event(self, event: dict) -> None: ...
	  
	      @abstractmethod
	      def get_report(self) -> dict: ...
	  
	  # ── Adaptee (legacy system with XML interface) ─────────────────────
	  class LegacyXMLAnalytics:
	      """Old library — speaks only XML, cannot be changed."""
	      def __init__(self):
	          self._events: list[str] = []
	  
	      def log_xml_event(self, xml_str: str) -> None:
	          self._events.append(xml_str)
	          print(f"[Legacy XML] Logged: {xml_str}")
	  
	      def export_xml_report(self) -> str:
	          events_xml = "".join(f"<event>{e}</event>" for e in self._events)
	          return f"<report><count>{len(self._events)}</count>{events_xml}</report>"
	  
	  # ── Adapter (Object Adapter — uses composition) ────────────────────
	  class XMLAnalyticsAdapter(IAnalytics):
	      """Translates IAnalytics calls → LegacyXMLAnalytics calls."""
	      def __init__(self):
	          self._legacy = LegacyXMLAnalytics()   # Wrap the adaptee
	  
	      def track_event(self, event: dict) -> None:
	          # Convert JSON dict → XML string for the legacy system
	          xml_str = "<event>"
	          for k, v in event.items():
	              xml_str += f"<{k}>{v}</{k}>"
	          xml_str += "</event>"
	          self._legacy.log_xml_event(xml_str)
	  
	      def get_report(self) -> dict:
	          # Convert XML report → JSON dict for the new system
	          xml_report = self._legacy.export_xml_report()
	          root = ET.fromstring(xml_report)
	          return {
	              "total_events": int(root.find("count").text),
	              "format": "adapted_from_xml"
	          }
	  
	  # ── New Analytics Service (speaks IAnalytics only) ─────────────────
	  class AnalyticsDashboard:
	      def __init__(self, analytics: IAnalytics):
	          self.analytics = analytics
	  
	      def record_page_view(self, page: str, user_id: str) -> None:
	          self.analytics.track_event({"type": "page_view", "page": page, "user": user_id})
	  
	      def show_report(self) -> None:
	          report = self.analytics.get_report()
	          print(f"Dashboard Report: {report}")
	  
	  # ── Client ─────────────────────────────────────────────────────────
	  # Plug legacy XML system into new JSON-expecting dashboard
	  adapter = XMLAnalyticsAdapter()
	  dashboard = AnalyticsDashboard(adapter)   # Client uses IAnalytics interface only
	  
	  dashboard.record_page_view("/home", "user-42")
	  dashboard.record_page_view("/about", "user-99")
	  dashboard.show_report()
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <map>
	  
	  // ── Target Interface ──────────────────────────────────────────────────
	  class ILogger {
	  public:
	      virtual void log(const std::string& level, const std::string& msg) = 0;
	      virtual ~ILogger() = default;
	  };
	  
	  // ── Adaptee (legacy logger with different interface) ───────────────────
	  class LegacyLogger {
	  public:
	      void writeLog(int severity, const std::string& message) {
	          static std::map<int, std::string> levels{{0,"INFO"},{1,"WARN"},{2,"ERROR"}};
	          std::cout << "[Legacy:" << levels[severity] << "] " << message << "\n";
	      }
	  };
	  
	  // ── Adapter (Object Adapter) ──────────────────────────────────────────
	  class LegacyLoggerAdapter : public ILogger {
	      LegacyLogger legacy_;
	  public:
	      void log(const std::string& level, const std::string& msg) override {
	          int severity = (level == "ERROR") ? 2 : (level == "WARN") ? 1 : 0;
	          legacy_.writeLog(severity, msg);   // Translate & delegate
	      }
	  };
	  
	  // ── New Application (uses ILogger) ────────────────────────────────────
	  class Application {
	      ILogger& logger_;
	  public:
	      Application(ILogger& logger) : logger_(logger) {}
	      void startup()  { logger_.log("INFO", "Application started"); }
	      void error()    { logger_.log("ERROR", "Something failed"); }
	  };
	  
	  int main() {
	      LegacyLoggerAdapter adapter;
	      Application app(adapter);   // Works with ILogger interface
	      app.startup();
	      app.error();
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  
	  // ── Target Interface ─────────────────────────────────────────────────
	  interface ILogger {
	      void log(String level, String message);
	  }
	  
	  // ── Adaptee (legacy system) ──────────────────────────────────────────
	  class LegacyLogger {
	      public void writeLog(int severity, String message) {
	          String[] levels = {"INFO", "WARN", "ERROR"};
	          System.out.printf("[Legacy:%s] %s%n", levels[severity], message);
	      }
	  }
	  
	  // ── Adapter (wraps LegacyLogger) ─────────────────────────────────────
	  class LegacyLoggerAdapter implements ILogger {
	      private final LegacyLogger legacy = new LegacyLogger();
	  
	      @Override
	      public void log(String level, String message) {
	          int severity = switch (level) {
	              case "ERROR" -> 2;
	              case "WARN"  -> 1;
	              default      -> 0;
	          };
	          legacy.writeLog(severity, message);
	      }
	  }
	  
	  // ── Application (uses ILogger) ────────────────────────────────────────
	  class Application {
	      private final ILogger logger;
	  
	      Application(ILogger logger) { this.logger = logger; }
	      void startup() { logger.log("INFO",  "Application started"); }
	      void error()   { logger.log("ERROR", "Something failed"); }
	  }
	  
	  class AdapterDemo {
	      public static void main(String[] args) {
	          ILogger adapter = new LegacyLoggerAdapter();
	          Application app = new Application(adapter);
	          app.startup();
	          app.error();
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  
	  // ── Adaptee (legacy console-based logger) ─────────────────────────────
	  class LegacyConsoleLogger {
	      writeLog(severity, message) {
	          const levels = ['INFO', 'WARN', 'ERROR'];
	          console.log(`[Legacy:${levels[severity]}] ${message}`);
	      }
	  }
	  
	  // ── Adapter ────────────────────────────────────────────────────────────
	  class LegacyLoggerAdapter {
	      #legacy = new LegacyConsoleLogger();
	  
	      log(level, message) {
	          const severity = level === 'ERROR' ? 2 : level === 'WARN' ? 1 : 0;
	          this.#legacy.writeLog(severity, message);
	      }
	  }
	  
	  // ── Application (expects logger with .log(level, message)) ────────────
	  class Application {
	      constructor(logger) { this.logger = logger; }
	      startup() { this.logger.log('INFO',  'Application started'); }
	      error()   { this.logger.log('ERROR', 'Something failed'); }
	  }
	  
	  const adapter = new LegacyLoggerAdapter();
	  const app = new Application(adapter);
	  app.startup();
	  app.error();
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  
	  // ── Target Interface ──────────────────────────────────────────────────
	  interface ILogger {
	      void Log(string level, string message);
	  }
	  
	  // ── Adaptee ───────────────────────────────────────────────────────────
	  class LegacyLogger {
	      public void WriteLog(int severity, string message) {
	          string[] levels = { "INFO", "WARN", "ERROR" };
	          Console.WriteLine($"[Legacy:{levels[severity]}] {message}");
	      }
	  }
	  
	  // ── Adapter ───────────────────────────────────────────────────────────
	  class LegacyLoggerAdapter : ILogger {
	      readonly LegacyLogger legacy = new();
	  
	      public void Log(string level, string message) {
	          int severity = level switch {
	              "ERROR" => 2,
	              "WARN"  => 1,
	              _       => 0
	          };
	          legacy.WriteLog(severity, message);
	      }
	  }
	  
	  class Application {
	      readonly ILogger logger;
	      public Application(ILogger logger) { this.logger = logger; }
	      public void Startup() => logger.Log("INFO",  "Application started");
	      public void Error()   => logger.Log("ERROR", "Something failed");
	  
	      static void Main() {
	          ILogger adapter = new LegacyLoggerAdapter();
	          var app = new Application(adapter);
	          app.Startup();
	          app.Error();
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- Bridges **incompatible interfaces** without modifying either the client or the adaptee.
	- Uses **composition** (Object Adapter) — wraps the adaptee, translates calls, delegates.
	- Essential for **legacy integration** and third-party library integration.
	- Follows the **Open/Closed Principle**: extend behavior without modifying existing classes.
	- Related: [[Decorator Pattern]], [[Facade Pattern]], [[Proxy Pattern]]

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Refactoring Guru — Adapter](https://refactoring.guru/design-patterns/adapter)
		- [GoF Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
