---
seoTitle: Interface Segregation Principle (ISP) – Complete Guide | SOLID, Fat Interfaces
description: "Deep dive into the Interface Segregation Principle (ISP) from SOLID. Covers fat interface problems, splitting interfaces by client need, and examples in Python, Java, and JavaScript."
keywords: "Interface Segregation Principle, ISP, SOLID, fat interface, interface splitting, client-specific interfaces, Python ISP, Java ISP, VR-Rathod, Code-Note"
displayTitle: Interface Segregation Principle (ISP)
---

> [!info] What is the Interface Segregation Principle?
> The **Interface Segregation Principle (ISP)** — the **I** in [[SOLID]] — states that **no client should be forced to depend on methods it does not use**. Large ("fat") interfaces should be split into smaller, more specific ones so that implementing classes only need to provide what they actually support.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine a **multi-function printer** 🖨️ interface that includes `print()`, `scan()`, `fax()`, `copy()`, and `staple()`. A simple USB printer only prints. If it must implement the full interface, it has to stub out scan, fax, copy, and staple — doing nothing or throwing errors. That's a bad design.
		- **ISP solution**: Split into `Printable`, `Scannable`, `Faxable` — each device implements only what it can do.
	-
	- ## The Fat Interface Problem
	  collapsed:: true
		- ```python
		  # ❌ ISP Violation — Fat interface
		  from abc import ABC, abstractmethod
		  
		  class IMultiFunction(ABC):
		      @abstractmethod def print(self, doc): ...
		      @abstractmethod def scan(self, doc): ...
		      @abstractmethod def fax(self, doc): ...
		      @abstractmethod def copy(self, doc): ...
		      @abstractmethod def staple(self, doc): ...
		  
		  class SimplePrinter(IMultiFunction):
		      def print(self, doc): print(f"Printing: {doc}")
		      def scan(self, doc): raise NotImplementedError("This printer can't scan!")
		      def fax(self, doc): raise NotImplementedError("This printer can't fax!")
		      def copy(self, doc): raise NotImplementedError("This printer can't copy!")
		      def staple(self, doc): raise NotImplementedError("This printer can't staple!")
		  # SimplePrinter is forced to depend on methods it doesn't use!
		  ```

- # Implementation
  collapsed:: true
	- > [!note] Splitting a fat printer interface into segregated, focused interfaces.
	  > Languages: [[Python]] · [[Java]] · [[Java Script]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python — ISP via segregated ABCs ────────────────────────────────
	  from abc import ABC, abstractmethod
	  
	  # ── Segregated interfaces ──────────────────────────────
	  class Printable(ABC):
	      @abstractmethod
	      def print_doc(self, document: str) -> None: ...
	  
	  class Scannable(ABC):
	      @abstractmethod
	      def scan_doc(self, document: str) -> str: ...
	  
	  class Faxable(ABC):
	      @abstractmethod
	      def fax_doc(self, document: str, number: str) -> None: ...
	  
	  class Copier(ABC):
	      @abstractmethod
	      def copy_doc(self, document: str, copies: int = 1) -> None: ...
	  
	  # ── Devices implement ONLY what they can do ────────────
	  class SimplePrinter(Printable):
	      """Only prints — implements only Printable."""
	      def print_doc(self, document: str) -> None:
	          print(f"[SimplePrinter] Printing: {document}")
	  
	  class OfficePrinter(Printable, Scannable, Copier):
	      """Office printer — prints, scans, copies."""
	      def print_doc(self, document: str) -> None:
	          print(f"[OfficePrinter] Printing: {document}")
	  
	      def scan_doc(self, document: str) -> str:
	          result = f"SCANNED:{document}"
	          print(f"[OfficePrinter] Scanned: {result}")
	          return result
	  
	      def copy_doc(self, document: str, copies: int = 1) -> None:
	          print(f"[OfficePrinter] Making {copies} copies of: {document}")
	  
	  class AllInOnePrinter(Printable, Scannable, Faxable, Copier):
	      """Enterprise all-in-one — implements everything."""
	      def print_doc(self, document: str) -> None:
	          print(f"[AllInOne] Printing: {document}")
	  
	      def scan_doc(self, document: str) -> str:
	          result = f"SCANNED:{document}"
	          print(f"[AllInOne] Scanned: {result}")
	          return result
	  
	      def fax_doc(self, document: str, number: str) -> None:
	          print(f"[AllInOne] Faxing to {number}: {document}")
	  
	      def copy_doc(self, document: str, copies: int = 1) -> None:
	          print(f"[AllInOne] {copies} copies of: {document}")
	  
	  # ── Functions accept only what they need ───────────────
	  def process_print_job(printer: Printable, doc: str) -> None:
	      printer.print_doc(doc)
	  
	  def process_scan_copy(device: Scannable, copier: Copier, doc: str) -> None:
	      scanned = device.scan_doc(doc)
	      copier.copy_doc(scanned, 2)
	  
	  # Usage
	  simple = SimplePrinter()
	  office = OfficePrinter()
	  allinone = AllInOnePrinter()
	  
	  process_print_job(simple, "report.pdf")    # SimplePrinter only prints ✅
	  process_print_job(office, "slides.pdf")    # OfficePrinter prints ✅
	  process_print_job(allinone, "contract.pdf")
	  process_scan_copy(office, office, "form.pdf")
	  allinone.fax_doc("invoice.pdf", "+1-555-0100")
	  ```
	  
	  ```java
	  // ─── Java — ISP with segregated interfaces ────────────────────────────
	  interface Printable { void printDoc(String document); }
	  interface Scannable { String scanDoc(String document); }
	  interface Faxable { void faxDoc(String document, String number); }
	  interface Copier { void copyDoc(String document, int copies); }
	  
	  class SimplePrinter implements Printable {
	      public void printDoc(String doc) { System.out.println("[Simple] Printing: " + doc); }
	  }
	  
	  class OfficePrinter implements Printable, Scannable, Copier {
	      public void printDoc(String doc) { System.out.println("[Office] Printing: " + doc); }
	      public String scanDoc(String doc) { System.out.println("[Office] Scanned: " + doc); return "SCANNED:" + doc; }
	      public void copyDoc(String doc, int copies) { System.out.println("[Office] " + copies + " copies of: " + doc); }
	  }
	  
	  class AllInOnePrinter implements Printable, Scannable, Faxable, Copier {
	      public void printDoc(String doc) { System.out.println("[AllInOne] Printing: " + doc); }
	      public String scanDoc(String doc) { System.out.println("[AllInOne] Scanned: " + doc); return "SCANNED:" + doc; }
	      public void faxDoc(String doc, String number) { System.out.println("[AllInOne] Fax to " + number + ": " + doc); }
	      public void copyDoc(String doc, int copies) { System.out.println("[AllInOne] " + copies + " copies: " + doc); }
	  }
	  
	  class ISPDemo {
	      static void doPrint(Printable p, String doc) { p.printDoc(doc); }
	      static void doScanAndCopy(Scannable s, Copier c, String doc) {
	          String scanned = s.scanDoc(doc);
	          c.copyDoc(scanned, 2);
	      }
	      public static void main(String[] args) {
	          doPrint(new SimplePrinter(), "report.pdf");
	          doPrint(new OfficePrinter(), "slides.pdf");
	          doScanAndCopy(new OfficePrinter(), new OfficePrinter(), "form.pdf");
	          new AllInOnePrinter().faxDoc("invoice.pdf", "+1-555-0100");
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript — ISP via mixins ──────────────────────────────────────
	  const Printable = (Base) => class extends Base {
	      printDoc(doc) { throw new Error("printDoc must be implemented"); }
	  };
	  const Scannable = (Base) => class extends Base {
	      scanDoc(doc) { throw new Error("scanDoc must be implemented"); }
	  };
	  const Faxable = (Base) => class extends Base {
	      faxDoc(doc, number) { throw new Error("faxDoc must be implemented"); }
	  };
	  
	  class SimplePrinter extends Printable(class {}) {
	      printDoc(doc) { console.log(`[Simple] Printing: ${doc}`); }
	  }
	  
	  class OfficePrinter extends Scannable(Printable(class {})) {
	      printDoc(doc) { console.log(`[Office] Printing: ${doc}`); }
	      scanDoc(doc) { console.log(`[Office] Scanning: ${doc}`); return `SCANNED:${doc}`; }
	  }
	  
	  class AllInOne extends Faxable(Scannable(Printable(class {}))) {
	      printDoc(doc) { console.log(`[AllInOne] Printing: ${doc}`); }
	      scanDoc(doc) { console.log(`[AllInOne] Scanning: ${doc}`); return `SCANNED:${doc}`; }
	      faxDoc(doc, num) { console.log(`[AllInOne] Faxing to ${num}: ${doc}`); }
	  }
	  
	  new SimplePrinter().printDoc("report.pdf");
	  new OfficePrinter().scanDoc("form.pdf");
	  new AllInOne().faxDoc("invoice.pdf", "+1-555-0100");
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- **No client should implement methods it doesn't use** — split fat interfaces into focused ones.
	- Small, focused interfaces are more **reusable** and easier to implement correctly.
	- If a class has to throw `NotImplementedError` or `UnsupportedOperationException` for inherited methods → ISP violated.
	- ISP is the interface counterpart of [[Single Responsibility Principle (SRP)]] — SRP for classes, ISP for interfaces.

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Refactoring Guru — ISP](https://refactoring.guru/solid)
		- [Martin Fowler — Interface](https://martinfowler.com/bliki/InterfaceImplementationPair.html)
