---
seoTitle: Aggregation in OOP – Complete In-Depth Guide | HAS-A Weak Ownership, vs Composition
description: "Deep dive into Aggregation in OOP. Covers weak HAS-A relationships, independent child lifecycle, differences from Composition and Association, UML notation, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "aggregation, OOP, has-a relationship, weak ownership, aggregation vs composition, independent lifecycle, Python aggregation, Java aggregation, C++ aggregation, UML diamond, VR-Rathod, Code-Note"
displayTitle: Aggregation
treeTitle: DSA - OOP - Aggregation
---

> [!info] What is Aggregation?
> **Aggregation** is a special form of **Association** that represents a **"HAS-A" relationship with weak ownership** — the containing (parent) object holds references to component objects, but those component objects **can exist independently**. When the parent is destroyed, the children survive. This contrasts with [[Composition]], where children are destroyed with the parent.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- A **Football Team** 🏈 has Players. The team HAS players — but if the team is disbanded (destroyed), the players don't cease to exist. They can join another team. The players have an independent existence.
		- Compare this to [[Composition]]: a `Car` HAS an `Engine`. When the car is scrapped, the engine goes with it — the engine has no independent life.
		- | Real World | Aggregation | Composition |
		  |---|---|---|
		  | Team + Players | Players survive team | — |
		  | Library + Books | Books exist without library | — |
		  | Car + Engine | — | Engine destroyed with car |
		  | House + Rooms | — | Rooms don't exist without house |
	-
	- ## Aggregation vs Composition vs Association
	  collapsed:: true
		- | Feature | Association | Aggregation | Composition |
		  |---|---|---|---|
		  | Relationship | Uses-A | Has-A (weak) | Has-A (strong) |
		  | Ownership | None | Weak | Strong |
		  | Child lifecycle | Independent | **Independent** | Tied to parent |
		  | UML | Simple line | ◇ empty diamond | ◆ filled diamond |
		  | Example | Doctor–Patient | Team–Player | Car–Engine |
- # Implementation
  collapsed:: true
	- > [!note] A `Library` with `Books` and a `University` with `Departments` — books and departments can exist independently of their containers.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  class Book:
	      def __init__(self, title: str, author: str, isbn: str):
	          self.title = title
	          self.author = author
	          self.isbn = isbn
	  
	      def __repr__(self) -> str:
	          return f"Book({self.title!r} by {self.author})"
	  
	  
	  class Library:
	      """Aggregation: Library HAS Books, but Books can exist without Library."""
	  
	      def __init__(self, name: str):
	          self.name = name
	          self._books: list[Book] = []  # References — not owned
	  
	      def add_book(self, book: Book) -> None:
	          self._books.append(book)
	          print(f"[{self.name}] Added: {book}")
	  
	      def remove_book(self, book: Book) -> None:
	          self._books.remove(book)
	          print(f"[{self.name}] Removed: {book}")
	  
	      def find_by_author(self, author: str) -> list[Book]:
	          return [b for b in self._books if b.author.lower() == author.lower()]
	  
	      def list_books(self) -> list[str]:
	          return [b.title for b in self._books]
	  
	      def __len__(self) -> int:
	          return len(self._books)
	  
	      def __repr__(self) -> str:
	          return f"Library({self.name!r}, {len(self)} books)"
	  
	      def __del__(self) -> None:
	          print(f"[Library {self.name!r} destroyed — books still exist!]")
	  
	  
	  # Books created independently — they don't belong to any library yet
	  b1 = Book("Clean Code", "Robert Martin", "978-0132350884")
	  b2 = Book("The Pragmatic Programmer", "David Thomas", "978-0135957059")
	  b3 = Book("Design Patterns", "GoF", "978-0201633610")
	  
	  lib1 = Library("Central Library")
	  lib2 = Library("Tech Library")
	  
	  lib1.add_book(b1)
	  lib1.add_book(b2)
	  lib2.add_book(b2)  # Same book in BOTH libraries! (shared reference)
	  lib2.add_book(b3)
	  
	  print(lib1.list_books())  # ['Clean Code', 'The Pragmatic Programmer']
	  print(lib2.list_books())  # ['The Pragmatic Programmer', 'Design Patterns']
	  
	  del lib1  # Library 'Central Library' destroyed — books still exist!
	  
	  # Books survive destruction of library
	  print(b1)  # Book('Clean Code' by Robert Martin) — still alive!
	  print(b2)  # Book('The Pragmatic Programmer' ...) — still alive!
	  print(lib2.list_books())  # ['The Pragmatic Programmer', 'Design Patterns']
	  ```
	  
	  ```c++
	  // ─── C++ — Aggregation: hold raw pointers (no ownership) ─────────────
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  
	  class Player {
	  public:
	      std::string name;
	      int number;
	      Player(std::string name, int num) : name(name), number(num) {}
	      ~Player() { std::cout << "[Player " << name << " still exists]\n"; }
	  };
	  
	  class Team {
	      std::string name_;
	      std::vector<Player*> players_;  // Raw pointers — no ownership (aggregation)
	  public:
	      Team(std::string name) : name_(name) {}
	  
	      void addPlayer(Player* p) { players_.push_back(p); }
	      void removePlayer(Player* p) {
	          players_.erase(std::remove(players_.begin(), players_.end(), p), players_.end());
	      }
	  
	      void listPlayers() const {
	          for (const auto* p : players_)
	              std::cout << "  #" << p->number << " " << p->name << "\n";
	      }
	  
	      ~Team() {
	          std::cout << "[Team " << name_ << " destroyed — players survive]\n";
	          // No delete — we don't own the players
	      }
	  };
	  
	  int main() {
	      Player p1("Messi", 10), p2("Ronaldo", 7), p3("Mbappe", 9);
	  
	      {
	          Team team("All Stars");
	          team.addPlayer(&p1);
	          team.addPlayer(&p2);
	          team.addPlayer(&p3);
	          team.listPlayers();
	      }  // Team destroyed here — but players still exist on stack
	  
	      // Players are still accessible
	      std::cout << p1.name << " is still active!\n";
	      std::cout << p2.name << " is still active!\n";
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  class Book {
	      String title, author, isbn;
	      Book(String title, String author, String isbn) {
	          this.title = title; this.author = author; this.isbn = isbn;
	      }
	      public String toString() { return "Book(" + title + " by " + author + ")"; }
	  }
	  
	  class Library {
	      String name;
	      // References — not owned. Books can belong to multiple libraries
	      List<Book> books = new ArrayList<>();
	  
	      Library(String name) { this.name = name; }
	  
	      void addBook(Book b) { books.add(b); System.out.println("[" + name + "] Added: " + b); }
	      void removeBook(Book b) { books.remove(b); }
	      List<String> listBooks() {
	          List<String> titles = new ArrayList<>();
	          books.forEach(b -> titles.add(b.title));
	          return titles;
	      }
	  }
	  
	  class AggregationDemo {
	      public static void main(String[] args) {
	          Book b1 = new Book("Clean Code", "Martin", "978-0132350884");
	          Book b2 = new Book("Pragmatic Programmer", "Thomas", "978-0135957059");
	  
	          Library lib1 = new Library("Central");
	          Library lib2 = new Library("Tech");
	  
	          lib1.addBook(b1);
	          lib1.addBook(b2);
	          lib2.addBook(b2);  // shared book — aggregation!
	  
	          System.out.println(lib1.listBooks());
	          System.out.println(lib2.listBooks());
	  
	          lib1 = null;  // Library goes away — books survive (GC manages b1, b2)
	          System.out.println(b1);  // Still accessible via b1 reference
	          System.out.println(lib2.listBooks());  // [Pragmatic Programmer]
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  class Book {
	      constructor(title, author, isbn) {
	          this.title = title;
	          this.author = author;
	          this.isbn = isbn;
	      }
	      toString() { return `Book(${this.title} by ${this.author})`; }
	  }
	  
	  class Library {
	      constructor(name) {
	          this.name = name;
	          this._books = [];  // References — not owned
	      }
	  
	      addBook(book) {
	          this._books.push(book);
	          console.log(`[${this.name}] Added: ${book}`);
	      }
	  
	      removeBook(book) {
	          this._books = this._books.filter(b => b !== book);
	      }
	  
	      get books() { return this._books.map(b => b.title); }
	  }
	  
	  const b1 = new Book("Clean Code", "Martin", "978-0132350884");
	  const b2 = new Book("Pragmatic Programmer", "Thomas", "978-0135957059");
	  
	  const lib1 = new Library("Central");
	  const lib2 = new Library("Tech");
	  
	  lib1.addBook(b1);
	  lib1.addBook(b2);
	  lib2.addBook(b2);  // same book in two libraries — shared reference
	  
	  console.log(lib1.books);  // ['Clean Code', 'Pragmatic Programmer']
	  console.log(lib2.books);  // ['Pragmatic Programmer']
	  
	  // lib1 can be nulled — books still exist
	  // let nulledLib = null;  // In GC-managed environment, books survive
	  console.log(b1.toString());  // Book(Clean Code by Martin) — still alive
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  using System.Linq;
	  
	  class Book {
	      public string Title { get; }
	      public string Author { get; }
	      public Book(string title, string author) { Title = title; Author = author; }
	      public override string ToString() => $"Book({Title} by {Author})";
	  }
	  
	  class Library {
	      public string Name { get; }
	      private List<Book> books = new();  // References — not owned
	  
	      public Library(string name) { Name = name; }
	      public void AddBook(Book b) { books.Add(b); Console.WriteLine($"[{Name}] Added: {b}"); }
	      public void RemoveBook(Book b) => books.Remove(b);
	      public List<string> ListBooks() => books.Select(b => b.Title).ToList();
	  }
	  
	  class Program {
	      static void Main() {
	          var b1 = new Book("Clean Code", "Martin");
	          var b2 = new Book("Pragmatic Programmer", "Thomas");
	  
	          var lib1 = new Library("Central");
	          var lib2 = new Library("Tech");
	          lib1.AddBook(b1); lib1.AddBook(b2);
	          lib2.AddBook(b2);  // shared — aggregation
	  
	          Console.WriteLine(string.Join(", ", lib1.ListBooks()));
	          Console.WriteLine(string.Join(", ", lib2.ListBooks()));
	  
	          lib1 = null;   // Library gone — books survive
	          GC.Collect();
	          Console.WriteLine(b1);  // Book(Clean Code by Martin) — still alive
	          Console.WriteLine(string.Join(", ", lib2.ListBooks())); // Pragmatic Programmer
	      }
	  }
	  ```
	  
	  :::
- # Key Takeaways
  collapsed:: true
	- **Aggregation = HAS-A with weak ownership** — child objects survive parent destruction.
	- Represented with **raw pointers** (C++) or **references** (Java/Python/C#/JS) — not embedded instances.
	- A child can be shared between multiple parents (same Book in two Libraries).
	- Weaker than [[Composition]] (strong ownership), stronger than pure [[Association]] (no ownership).
	- Use aggregation when the child has meaning/utility **outside the containing object**.
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks — Aggregation vs Composition](https://www.geeksforgeeks.org/association-composition-aggregation-in-java/)
		- [UML Aggregation — IBM](https://developer.ibm.com/articles/the-class-diagram/)