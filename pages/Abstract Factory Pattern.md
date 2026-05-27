---
seoTitle: Abstract Factory Pattern in OOP – Complete In-Depth Guide | Creational Design Pattern
description: "Deep dive into the Abstract Factory design pattern. Covers families of related objects, factory of factories, platform-independent UI toolkits, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "abstract factory pattern, creational design pattern, factory of factories, GoF, UI toolkit, platform independence, Python abstract factory, Java abstract factory, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Abstract Factory Pattern
---

> [!info] What is the Abstract Factory Pattern?
> The **Abstract Factory Pattern** is a **creational design pattern** that provides an interface for creating **families of related or dependent objects** without specifying their concrete classes. It's a "factory of factories" — instead of creating individual objects, you create a factory that creates multiple related objects that belong together.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of **furniture brands** 🛋️:
		  - IKEA makes: IKEA Chair, IKEA Table, IKEA Sofa — they all match (same style).
		  - Herman Miller makes: HM Chair, HM Table, HM Sofa — they all match a different style.
		  - You pick a **brand (abstract factory)**, and it gives you a matched **set of furniture** (product family).
		  - You never mix IKEA chairs with Herman Miller tables — that would be inconsistent.
		- In code: the client picks a factory (theme/platform/style), and that factory creates consistent, compatible objects.
	-
	- ## Abstract Factory vs Factory Method
	  collapsed:: true
		- | | [[Factory Pattern\|Factory Method]] | Abstract Factory |
		  |---|---|---|
		  | **Creates** | One product | A family of related products |
		  | **Focus** | How to create one type | How to create consistent groups |
		  | **Structure** | One factory method | Multiple factory methods |
		  | **Use case** | Single object creation | Cross-platform UI, theme systems |
	-
	- ## UML Structure
	  collapsed:: true
		- ```mermaid
		  classDiagram
		      class AbstractFactory {
		          <<interface>>
		          +createButton() Button
		          +createCheckbox() Checkbox
		      }
		      class WinFactory {
		          +createButton() WinButton
		          +createCheckbox() WinCheckbox
		      }
		      class MacFactory {
		          +createButton() MacButton
		          +createCheckbox() MacCheckbox
		      }
		      class Button {
		          <<interface>>
		          +render()
		          +onClick()
		      }
		      class Checkbox {
		          <<interface>>
		          +render()
		          +onCheck()
		      }
		      AbstractFactory <|.. WinFactory
		      AbstractFactory <|.. MacFactory
		      Button <|.. WinButton
		      Button <|.. MacButton
		      Checkbox <|.. WinCheckbox
		      Checkbox <|.. MacCheckbox
		      WinFactory --> WinButton : creates
		      WinFactory --> WinCheckbox : creates
		      MacFactory --> MacButton : creates
		      MacFactory --> MacCheckbox : creates
		  ```

- # Implementation
  collapsed:: true
	- > [!note] Cross-platform UI toolkit — Windows vs Mac consistent widgets. The client code is 100% platform-agnostic.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  from abc import ABC, abstractmethod
	  
	  # ── Abstract Products ─────────────────────────────────────────────────
	  class Button(ABC):
	      @abstractmethod
	      def render(self) -> str: ...
	      @abstractmethod
	      def on_click(self) -> str: ...
	  
	  class Checkbox(ABC):
	      @abstractmethod
	      def render(self) -> str: ...
	      @abstractmethod
	      def on_check(self) -> str: ...
	  
	  # ── Concrete Products: Windows ────────────────────────────────────────
	  class WinButton(Button):
	      def render(self) -> str: return "Render Windows Button [▓▓▓]"
	      def on_click(self) -> str: return "Windows Button clicked"
	  
	  class WinCheckbox(Checkbox):
	      def render(self) -> str: return "Render Windows Checkbox [☑]"
	      def on_check(self) -> str: return "Windows Checkbox checked"
	  
	  # ── Concrete Products: Mac ────────────────────────────────────────────
	  class MacButton(Button):
	      def render(self) -> str: return "Render Mac Button (●)"
	      def on_click(self) -> str: return "Mac Button clicked"
	  
	  class MacCheckbox(Checkbox):
	      def render(self) -> str: return "Render Mac Checkbox (✓)"
	      def on_check(self) -> str: return "Mac Checkbox checked"
	  
	  # ── Abstract Factory ──────────────────────────────────────────────────
	  class GUIFactory(ABC):
	      @abstractmethod
	      def create_button(self) -> Button: ...
	      @abstractmethod
	      def create_checkbox(self) -> Checkbox: ...
	  
	  # ── Concrete Factories ────────────────────────────────────────────────
	  class WinFactory(GUIFactory):
	      def create_button(self) -> Button: return WinButton()
	      def create_checkbox(self) -> Checkbox: return WinCheckbox()
	  
	  class MacFactory(GUIFactory):
	      def create_button(self) -> Button: return MacButton()
	      def create_checkbox(self) -> Checkbox: return MacCheckbox()
	  
	  # ── Client ────────────────────────────────────────────────────────────
	  class Application:
	      """Works with ANY GUIFactory — completely platform-agnostic."""
	      def __init__(self, factory: GUIFactory):
	          self.button   = factory.create_button()    # Consistent product
	          self.checkbox = factory.create_checkbox()  # Same family
	  
	      def render(self) -> None:
	          print(self.button.render())
	          print(self.checkbox.render())
	          print(self.button.on_click())
	          print(self.checkbox.on_check())
	  
	  # ── Usage ─────────────────────────────────────────────────────────────
	  import sys
	  
	  # Factory selected by environment/config — client code unchanged
	  platform = "windows"  # Could come from sys.platform, config, etc.
	  
	  factory = WinFactory() if platform == "windows" else MacFactory()
	  app = Application(factory)
	  app.render()
	  # Render Windows Button [▓▓▓]
	  # Render Windows Checkbox [☑]
	  # Windows Button clicked
	  # Windows Checkbox checked
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <memory>
	  #include <string>
	  
	  // ── Abstract Products ────────────────────────────────────────────────
	  class Button {
	  public:
	      virtual std::string render() const = 0;
	      virtual std::string onClick() const = 0;
	      virtual ~Button() {}
	  };
	  
	  class Checkbox {
	  public:
	      virtual std::string render() const = 0;
	      virtual std::string onCheck() const = 0;
	      virtual ~Checkbox() {}
	  };
	  
	  // ── Concrete Products: Windows ───────────────────────────────────────
	  class WinButton : public Button {
	      std::string render() const override { return "Render Windows Button [▓▓▓]"; }
	      std::string onClick() const override { return "Windows Button clicked"; }
	  };
	  class WinCheckbox : public Checkbox {
	      std::string render() const override { return "Render Windows Checkbox [☑]"; }
	      std::string onCheck() const override { return "Windows Checkbox checked"; }
	  };
	  
	  // ── Concrete Products: Mac ───────────────────────────────────────────
	  class MacButton : public Button {
	      std::string render() const override { return "Render Mac Button (●)"; }
	      std::string onClick() const override { return "Mac Button clicked"; }
	  };
	  class MacCheckbox : public Checkbox {
	      std::string render() const override { return "Render Mac Checkbox (✓)"; }
	      std::string onCheck() const override { return "Mac Checkbox checked"; }
	  };
	  
	  // ── Abstract Factory ─────────────────────────────────────────────────
	  class GUIFactory {
	  public:
	      virtual std::unique_ptr<Button>   createButton()   const = 0;
	      virtual std::unique_ptr<Checkbox> createCheckbox() const = 0;
	      virtual ~GUIFactory() {}
	  };
	  
	  class WinFactory : public GUIFactory {
	      std::unique_ptr<Button>   createButton()   const override { return std::make_unique<WinButton>(); }
	      std::unique_ptr<Checkbox> createCheckbox() const override { return std::make_unique<WinCheckbox>(); }
	  };
	  
	  class MacFactory : public GUIFactory {
	      std::unique_ptr<Button>   createButton()   const override { return std::make_unique<MacButton>(); }
	      std::unique_ptr<Checkbox> createCheckbox() const override { return std::make_unique<MacCheckbox>(); }
	  };
	  
	  // ── Client ───────────────────────────────────────────────────────────
	  class Application {
	      std::unique_ptr<Button>   button_;
	      std::unique_ptr<Checkbox> checkbox_;
	  public:
	      Application(const GUIFactory& factory)
	          : button_(factory.createButton()),
	            checkbox_(factory.createCheckbox()) {}
	  
	      void render() const {
	          std::cout << button_->render()    << "\n";
	          std::cout << checkbox_->render()  << "\n";
	          std::cout << button_->onClick()   << "\n";
	          std::cout << checkbox_->onCheck() << "\n";
	      }
	  };
	  
	  int main() {
	      WinFactory factory;        // Swap to MacFactory for Mac
	      Application app(factory);
	      app.render();
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  
	  // ── Abstract Products ─────────────────────────────────────────────────
	  interface Button   { String render(); String onClick(); }
	  interface Checkbox { String render(); String onCheck(); }
	  
	  // ── Windows Products ──────────────────────────────────────────────────
	  class WinButton   implements Button   {
	      public String render()   { return "Render Windows Button [▓▓▓]"; }
	      public String onClick()  { return "Windows Button clicked"; }
	  }
	  class WinCheckbox implements Checkbox {
	      public String render()   { return "Render Windows Checkbox [☑]"; }
	      public String onCheck()  { return "Windows Checkbox checked"; }
	  }
	  
	  // ── Mac Products ──────────────────────────────────────────────────────
	  class MacButton   implements Button   {
	      public String render()   { return "Render Mac Button (●)"; }
	      public String onClick()  { return "Mac Button clicked"; }
	  }
	  class MacCheckbox implements Checkbox {
	      public String render()   { return "Render Mac Checkbox (✓)"; }
	      public String onCheck()  { return "Mac Checkbox checked"; }
	  }
	  
	  // ── Abstract Factory ──────────────────────────────────────────────────
	  interface GUIFactory {
	      Button   createButton();
	      Checkbox createCheckbox();
	  }
	  
	  class WinFactory implements GUIFactory {
	      public Button   createButton()   { return new WinButton(); }
	      public Checkbox createCheckbox() { return new WinCheckbox(); }
	  }
	  class MacFactory implements GUIFactory {
	      public Button   createButton()   { return new MacButton(); }
	      public Checkbox createCheckbox() { return new MacCheckbox(); }
	  }
	  
	  // ── Client ────────────────────────────────────────────────────────────
	  class Application {
	      private final Button button;
	      private final Checkbox checkbox;
	  
	      Application(GUIFactory factory) {
	          this.button   = factory.createButton();
	          this.checkbox = factory.createCheckbox();
	      }
	  
	      void render() {
	          System.out.println(button.render());
	          System.out.println(checkbox.render());
	          System.out.println(button.onClick());
	          System.out.println(checkbox.onCheck());
	      }
	  }
	  
	  class AbstractFactoryDemo {
	      public static void main(String[] args) {
	          GUIFactory factory = new WinFactory();  // Swap to MacFactory for Mac
	          Application app = new Application(factory);
	          app.render();
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  
	  // ── Concrete Products: Windows ────────────────────────────────────────
	  class WinButton {
	      render()   { return "Render Windows Button [▓▓▓]"; }
	      onClick()  { return "Windows Button clicked"; }
	  }
	  class WinCheckbox {
	      render()   { return "Render Windows Checkbox [☑]"; }
	      onCheck()  { return "Windows Checkbox checked"; }
	  }
	  
	  // ── Concrete Products: Mac ────────────────────────────────────────────
	  class MacButton {
	      render()   { return "Render Mac Button (●)"; }
	      onClick()  { return "Mac Button clicked"; }
	  }
	  class MacCheckbox {
	      render()   { return "Render Mac Checkbox (✓)"; }
	      onCheck()  { return "Mac Checkbox checked"; }
	  }
	  
	  // ── Concrete Factories ────────────────────────────────────────────────
	  class WinFactory {
	      createButton()   { return new WinButton(); }
	      createCheckbox() { return new WinCheckbox(); }
	  }
	  class MacFactory {
	      createButton()   { return new MacButton(); }
	      createCheckbox() { return new MacCheckbox(); }
	  }
	  
	  // ── Client ────────────────────────────────────────────────────────────
	  class Application {
	      constructor(factory) {
	          this.button   = factory.createButton();
	          this.checkbox = factory.createCheckbox();
	      }
	      render() {
	          console.log(this.button.render());
	          console.log(this.checkbox.render());
	          console.log(this.button.onClick());
	          console.log(this.checkbox.onCheck());
	      }
	  }
	  
	  const factory = new WinFactory();  // Swap to MacFactory
	  const app = new Application(factory);
	  app.render();
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  
	  // ── Abstract Products ─────────────────────────────────────────────────
	  interface IButton   { string Render(); string OnClick(); }
	  interface ICheckbox { string Render(); string OnCheck(); }
	  
	  // ── Windows Products ──────────────────────────────────────────────────
	  class WinButton   : IButton   {
	      public string Render()   => "Render Windows Button [▓▓▓]";
	      public string OnClick()  => "Windows Button clicked";
	  }
	  class WinCheckbox : ICheckbox {
	      public string Render()   => "Render Windows Checkbox [☑]";
	      public string OnCheck()  => "Windows Checkbox checked";
	  }
	  
	  // ── Mac Products ──────────────────────────────────────────────────────
	  class MacButton   : IButton   {
	      public string Render()   => "Render Mac Button (●)";
	      public string OnClick()  => "Mac Button clicked";
	  }
	  class MacCheckbox : ICheckbox {
	      public string Render()   => "Render Mac Checkbox (✓)";
	      public string OnCheck()  => "Mac Checkbox checked";
	  }
	  
	  // ── Abstract Factory ──────────────────────────────────────────────────
	  interface IGUIFactory {
	      IButton   CreateButton();
	      ICheckbox CreateCheckbox();
	  }
	  class WinFactory : IGUIFactory {
	      public IButton   CreateButton()   => new WinButton();
	      public ICheckbox CreateCheckbox() => new WinCheckbox();
	  }
	  class MacFactory : IGUIFactory {
	      public IButton   CreateButton()   => new MacButton();
	      public ICheckbox CreateCheckbox() => new MacCheckbox();
	  }
	  
	  // ── Client ────────────────────────────────────────────────────────────
	  class Application {
	      readonly IButton button;
	      readonly ICheckbox checkbox;
	  
	      public Application(IGUIFactory factory) {
	          button   = factory.CreateButton();
	          checkbox = factory.CreateCheckbox();
	      }
	  
	      public void Render() {
	          Console.WriteLine(button.Render());
	          Console.WriteLine(checkbox.Render());
	          Console.WriteLine(button.OnClick());
	          Console.WriteLine(checkbox.OnCheck());
	      }
	  
	      static void Main() {
	          IGUIFactory factory = new WinFactory(); // Swap to MacFactory
	          var app = new Application(factory);
	          app.Render();
	      }
	  }
	  ```
	  
	  :::

- # When to Use
  collapsed:: true
	- ## ✅ Use Abstract Factory When:
		- Your system must be independent of how its products are created, composed, and represented.
		- You need to work with **families of related objects** that must be used together (e.g., Windows widgets vs Mac widgets).
		- You want to enforce consistency among products — mixing families should be impossible.
		- You're building a platform-agnostic system (UI toolkits, database drivers, theme engines).
	- ## ❌ Avoid When:
		- You only need to create **one type of object** — use [[Factory Pattern]] (Factory Method) instead.
		- The product families are simple enough that the extra abstraction is overkill.

- # Key Takeaways
  collapsed:: true
	- Creates **families of related objects** without specifying concrete classes.
	- The client is 100% decoupled from product implementations — only talks to interfaces.
	- Adding a new family = add a new Concrete Factory + Concrete Products; client code untouched.
	- Enforces **consistency**: you can't accidentally mix Windows buttons with Mac checkboxes.
	- Related patterns: [[Factory Pattern]], [[Singleton Pattern]], [[Builder Pattern]]

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Refactoring Guru — Abstract Factory](https://refactoring.guru/design-patterns/abstract-factory)
		- [GoF Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
