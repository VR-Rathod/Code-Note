---
seoTitle: Command Pattern in OOP – Complete In-Depth Guide | Behavioral Design Pattern, Undo/Redo
description: "Deep dive into the Command design pattern. Covers encapsulating operations as objects, undo/redo functionality, command queuing, macro commands, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "command pattern, behavioral design pattern, undo redo, encapsulate request, command queue, macro command, GoF, Python command pattern, Java command pattern, VR-Rathod, Code-Note"
displayTitle: Command Pattern
---

> [!info] What is the Command Pattern?
> The **Command Pattern** is a **behavioral design pattern** that **encapsulates a request as an object**. This lets you parameterize operations, queue them, log them, and support **undo/redo** functionality. The invoker (who triggers the command) is decoupled from the receiver (who executes the action).

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **restaurant order** 🍽️:
		  - **Customer** → places order (client creates the command)
		  - **Order slip** → is the command object (encapsulates the request)
		  - **Waiter** → takes the order to the kitchen (invoker — doesn't know how to cook)
		  - **Chef** → executes the cooking (receiver — does the actual work)
		- The waiter doesn't need to know how to cook. The order slip can be queued, cancelled, or reordered.
	-
	- ## Participants
	  collapsed:: true
		- | Role | Responsibility |
		  |---|---|
		  | **Command** (interface) | Declares `execute()` and `undo()` |
		  | **Concrete Command** | Implements execute/undo; holds reference to receiver |
		  | **Receiver** | Knows how to perform the actual work |
		  | **Invoker** | Calls `execute()` on commands; may maintain history |
		  | **Client** | Creates command objects, sets up receiver and invoker |
	-
	- ## UML Structure
	  collapsed:: true
		- ```mermaid
		  classDiagram
		      class Invoker {
		          -history: List~Command~
		          +execute(cmd: Command)
		          +undo()
		      }
		      class Command {
		          <<interface>>
		          +execute()
		          +undo()
		      }
		      class ConcreteCommand {
		          -receiver: Receiver
		          +execute()
		          +undo()
		      }
		      class Receiver {
		          +action()
		      }
		      Invoker --> Command
		      Command <|.. ConcreteCommand
		      ConcreteCommand --> Receiver
		  ```

- # Implementation
  collapsed:: true
	- > [!note] A text editor with `InsertText`, `DeleteText`, `BoldText` commands — with full undo/redo stack.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python — Text Editor with undo/redo ─────────────────────────────
	  from abc import ABC, abstractmethod
	  from collections import deque
	  
	  # ── Command interface ──────────────────────────────────
	  class Command(ABC):
	      @abstractmethod
	      def execute(self) -> None: ...
	  
	      @abstractmethod
	      def undo(self) -> None: ...
	  
	      @abstractmethod
	      def description(self) -> str: ...
	  
	  # ── Receiver — the actual text document ───────────────
	  class TextDocument:
	      def __init__(self):
	          self._content = ""
	  
	      def insert(self, text: str, position: int = -1) -> None:
	          if position == -1 or position >= len(self._content):
	              self._content += text
	          else:
	              self._content = self._content[:position] + text + self._content[position:]
	  
	      def delete(self, start: int, end: int) -> str:
	          deleted = self._content[start:end]
	          self._content = self._content[:start] + self._content[end:]
	          return deleted
	  
	      @property
	      def content(self) -> str:
	          return self._content
	  
	      def __repr__(self) -> str:
	          return f"Document({self._content!r})"
	  
	  # ── Concrete Commands ──────────────────────────────────
	  class InsertCommand(Command):
	      def __init__(self, doc: TextDocument, text: str, position: int = -1):
	          self.doc = doc
	          self.text = text
	          self.position = position
	  
	      def execute(self) -> None:
	          self.doc.insert(self.text, self.position)
	  
	      def undo(self) -> None:
	          actual_pos = self.position if self.position != -1 else len(self.doc.content) - len(self.text)
	          self.doc.delete(actual_pos, actual_pos + len(self.text))
	  
	      def description(self) -> str:
	          return f"Insert({self.text!r} at {self.position})"
	  
	  class DeleteCommand(Command):
	      def __init__(self, doc: TextDocument, start: int, end: int):
	          self.doc = doc
	          self.start = start
	          self.end = end
	          self._deleted = ""
	  
	      def execute(self) -> None:
	          self._deleted = self.doc.delete(self.start, self.end)
	  
	      def undo(self) -> None:
	          self.doc.insert(self._deleted, self.start)
	  
	      def description(self) -> str:
	          return f"Delete([{self.start}:{self.end}])"
	  
	  class MacroCommand(Command):
	      """Composite command — executes multiple commands as one."""
	      def __init__(self, name: str, *commands: Command):
	          self.name = name
	          self.commands = list(commands)
	  
	      def execute(self) -> None:
	          for cmd in self.commands: cmd.execute()
	  
	      def undo(self) -> None:
	          for cmd in reversed(self.commands): cmd.undo()
	  
	      def description(self) -> str: return f"Macro({self.name})"
	  
	  # ── Invoker — command history manager ─────────────────
	  class Editor:
	      def __init__(self, doc: TextDocument):
	          self.doc = doc
	          self._history: list[Command] = []
	          self._redo_stack: list[Command] = []
	  
	      def execute(self, command: Command) -> None:
	          command.execute()
	          self._history.append(command)
	          self._redo_stack.clear()  # redo stack invalidated on new action
	          print(f"  ✅ {command.description()} → {self.doc.content!r}")
	  
	      def undo(self) -> None:
	          if not self._history:
	              print("  ⚠️ Nothing to undo")
	              return
	          cmd = self._history.pop()
	          cmd.undo()
	          self._redo_stack.append(cmd)
	          print(f"  ↩️ Undid: {cmd.description()} → {self.doc.content!r}")
	  
	      def redo(self) -> None:
	          if not self._redo_stack:
	              print("  ⚠️ Nothing to redo")
	              return
	          cmd = self._redo_stack.pop()
	          cmd.execute()
	          self._history.append(cmd)
	          print(f"  ↪️ Redid: {cmd.description()} → {self.doc.content!r}")
	  
	  # Usage
	  doc = TextDocument()
	  editor = Editor(doc)
	  
	  print("--- Executing commands ---")
	  editor.execute(InsertCommand(doc, "Hello"))
	  editor.execute(InsertCommand(doc, " World"))
	  editor.execute(InsertCommand(doc, "!"))
	  editor.execute(DeleteCommand(doc, 5, 11))  # delete " World"
	  
	  print("\n--- Undo operations ---")
	  editor.undo()  # undo delete
	  editor.undo()  # undo "!"
	  
	  print("\n--- Redo ---")
	  editor.redo()  # redo "!"
	  
	  print("\n--- Macro command ---")
	  macro = MacroCommand("greet",
	      InsertCommand(doc, " Beautiful"),
	      InsertCommand(doc, " Day"))
	  editor.execute(macro)
	  editor.undo()  # undo the entire macro at once
	  ```
	  
	  ```c++
	  // ─── C++ — Command Pattern with undo ─────────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  #include <memory>
	  
	  class Command {
	  public:
	      virtual void execute() = 0;
	      virtual void undo() = 0;
	      virtual std::string description() const = 0;
	      virtual ~Command() {}
	  };
	  
	  class TextDocument {
	      std::string content_;
	  public:
	      void append(const std::string& text) { content_ += text; }
	      void remove(int n) { if (n <= (int)content_.size()) content_.erase(content_.size() - n); }
	      std::string getContent() const { return content_; }
	  };
	  
	  class InsertCommand : public Command {
	      TextDocument& doc_;
	      std::string text_;
	  public:
	      InsertCommand(TextDocument& d, std::string t) : doc_(d), text_(t) {}
	      void execute() override { doc_.append(text_); }
	      void undo() override { doc_.remove(text_.size()); }
	      std::string description() const override { return "Insert(\"" + text_ + "\")"; }
	  };
	  
	  class Editor {
	      std::vector<std::unique_ptr<Command>> history_;
	  public:
	      void execute(std::unique_ptr<Command> cmd) {
	          cmd->execute();
	          std::cout << "  ✅ " << cmd->description() << "\n";
	          history_.push_back(std::move(cmd));
	      }
	      void undo() {
	          if (history_.empty()) { std::cout << "  Nothing to undo\n"; return; }
	          history_.back()->undo();
	          std::cout << "  ↩️ Undid: " << history_.back()->description() << "\n";
	          history_.pop_back();
	      }
	  };
	  
	  int main() {
	      TextDocument doc;
	      Editor editor;
	      editor.execute(std::make_unique<InsertCommand>(doc, "Hello"));
	      editor.execute(std::make_unique<InsertCommand>(doc, " World"));
	      std::cout << "Content: " << doc.getContent() << "\n";
	      editor.undo();
	      std::cout << "After undo: " << doc.getContent() << "\n";
	  }
	  ```
	  
	  ```java
	  // ─── Java — Command Pattern ───────────────────────────────────────────
	  import java.util.*;
	  
	  interface Command {
	      void execute();
	      void undo();
	      String description();
	  }
	  
	  class TextDocument {
	      StringBuilder content = new StringBuilder();
	      void append(String text) { content.append(text); }
	      void remove(int n) { if (n <= content.length()) content.delete(content.length() - n, content.length()); }
	      String getContent() { return content.toString(); }
	  }
	  
	  class InsertCommand implements Command {
	      TextDocument doc; String text;
	      InsertCommand(TextDocument d, String t) { this.doc = d; this.text = t; }
	      public void execute() { doc.append(text); }
	      public void undo() { doc.remove(text.length()); }
	      public String description() { return "Insert(\"" + text + "\")"; }
	  }
	  
	  class Editor {
	      Deque<Command> history = new ArrayDeque<>();
	      public void execute(Command cmd) {
	          cmd.execute();
	          history.push(cmd);
	          System.out.println("  ✅ " + cmd.description());
	      }
	      public void undo() {
	          if (history.isEmpty()) { System.out.println("  Nothing to undo"); return; }
	          Command cmd = history.pop();
	          cmd.undo();
	          System.out.println("  ↩️ Undid: " + cmd.description());
	      }
	  }
	  
	  class CommandDemo {
	      public static void main(String[] args) {
	          TextDocument doc = new TextDocument();
	          Editor editor = new Editor();
	          editor.execute(new InsertCommand(doc, "Hello"));
	          editor.execute(new InsertCommand(doc, " World"));
	          System.out.println("Content: " + doc.getContent());
	          editor.undo();
	          System.out.println("After undo: " + doc.getContent());
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript — Command Pattern ─────────────────────────────────────
	  class TextDocument {
	      constructor() { this._content = ""; }
	      append(text) { this._content += text; }
	      remove(n) { this._content = this._content.slice(0, -n); }
	      get content() { return this._content; }
	  }
	  
	  class InsertCommand {
	      constructor(doc, text) { this.doc = doc; this.text = text; }
	      execute() { this.doc.append(this.text); }
	      undo() { this.doc.remove(this.text.length); }
	      get description() { return `Insert("${this.text}")`; }
	  }
	  
	  class Editor {
	      #history = [];
	      #redoStack = [];
	  
	      execute(cmd) {
	          cmd.execute();
	          this.#history.push(cmd);
	          this.#redoStack = [];
	          console.log(`  ✅ ${cmd.description}`);
	      }
	      undo() {
	          if (!this.#history.length) { console.log("  Nothing to undo"); return; }
	          const cmd = this.#history.pop();
	          cmd.undo();
	          this.#redoStack.push(cmd);
	          console.log(`  ↩️ Undid: ${cmd.description}`);
	      }
	      redo() {
	          if (!this.#redoStack.length) { console.log("  Nothing to redo"); return; }
	          const cmd = this.#redoStack.pop();
	          cmd.execute();
	          this.#history.push(cmd);
	          console.log(`  ↪️ Redid: ${cmd.description}`);
	      }
	  }
	  
	  const doc = new TextDocument();
	  const editor = new Editor();
	  editor.execute(new InsertCommand(doc, "Hello"));
	  editor.execute(new InsertCommand(doc, " World"));
	  console.log("Content:", doc.content);
	  editor.undo();
	  console.log("After undo:", doc.content);
	  editor.redo();
	  console.log("After redo:", doc.content);
	  ```
	  
	  ```csharp
	  // ─── C# — Command Pattern with undo/redo ─────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  using System.Text;
	  
	  interface ICommand {
	      void Execute();
	      void Undo();
	      string Description { get; }
	  }
	  
	  class TextDocument {
	      StringBuilder content = new();
	      public void Append(string text) => content.Append(text);
	      public void Remove(int n) { if (n <= content.Length) content.Remove(content.Length - n, n); }
	      public string Content => content.ToString();
	  }
	  
	  class InsertCommand : ICommand {
	      TextDocument doc; string text;
	      public InsertCommand(TextDocument d, string t) { doc = d; text = t; }
	      public void Execute() => doc.Append(text);
	      public void Undo() => doc.Remove(text.Length);
	      public string Description => $"Insert(\"{text}\")";
	  }
	  
	  class Editor {
	      Stack<ICommand> history = new();
	      Stack<ICommand> redo = new();
	  
	      public void Execute(ICommand cmd) {
	          cmd.Execute();
	          history.Push(cmd);
	          redo.Clear();
	          Console.WriteLine($"  ✅ {cmd.Description}");
	      }
	      public void Undo() {
	          if (history.Count == 0) { Console.WriteLine("  Nothing to undo"); return; }
	          var cmd = history.Pop();
	          cmd.Undo();
	          redo.Push(cmd);
	          Console.WriteLine($"  ↩️ Undid: {cmd.Description}");
	      }
	      public void Redo() {
	          if (redo.Count == 0) { Console.WriteLine("  Nothing to redo"); return; }
	          var cmd = redo.Pop();
	          cmd.Execute();
	          history.Push(cmd);
	          Console.WriteLine($"  ↪️ Redid: {cmd.Description}");
	      }
	  
	      static void Main() {
	          var doc = new TextDocument();
	          var editor = new Editor();
	          editor.Execute(new InsertCommand(doc, "Hello"));
	          editor.Execute(new InsertCommand(doc, " World"));
	          Console.WriteLine("Content: " + doc.Content);
	          editor.Undo();
	          Console.WriteLine("After undo: " + doc.Content);
	          editor.Redo();
	          Console.WriteLine("After redo: " + doc.Content);
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- **Encapsulate requests as objects** — enables queuing, logging, and undo/redo.
	- Decouples **invoker** (who triggers) from **receiver** (who acts).
	- **Undo/redo** = maintain a history stack of commands + call `undo()` in reverse.
	- **Macro command** = composite command — executes multiple commands as one unit.
	- Real-world uses: **text editors**, **transaction systems**, **game action queues**, **UI button actions**, **HTTP request pipelines**.

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Refactoring Guru — Command](https://refactoring.guru/design-patterns/command)
		- [GoF Design Patterns — Command](https://en.wikipedia.org/wiki/Command_pattern)
