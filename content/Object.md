---
seoTitle: Object in OOP – Complete In-Depth Guide | Instances, Memory Model, Identity vs Equality
description: "Deep dive into Objects in OOP. Covers what an object is, object identity vs equality, shallow vs deep copy, object lifecycle, memory model, and practical examples in Python, C++, Java, JavaScript, and C#."
keywords: "object, OOP, instance, object identity, object equality, shallow copy, deep copy, object lifecycle, garbage collection, Python object, Java object, C++ object, VR-Rathod, Code-Note"
displayTitle: Object
treeTitle: DSA - OOP - Object
---

> [!info] What is an Object?
> An **Object** is a concrete **instance of a class** — a specific realization of a blueprint that **occupies memory** and holds its own data. While a [[Class]] defines the structure, an object is the actual entity that lives and operates in your program at runtime.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- A **Class** = the cookie cutter mold 🍪
		- An **Object** = the actual cookie made using that mold
		- Every cookie (object) has the same shape (class structure) but can have different icing (attribute values). You can make as many cookies as you want from one mold.
		- | Class (Blueprint) | Object (Instance) |
		  |---|---|
		  | Cookie cutter mold | Actual cookie |
		  | `class Dog:` | `buddy = Dog("Buddy", 3)` |
		  | Defined once | Created thousands of times |
		  | No memory allocated | Memory allocated on heap |
	-
	- ## Object vs Class
	  collapsed:: true
		- ```
		  CLASS (template — in code/static segment):
		  ┌──────────────────────────────────┐
		  │  class Dog:                      │
		  │    name: str                     │
		  │    age: int                      │
		  │    def bark(): ...               │
		  └──────────────────────────────────┘
		                  ↓ Instantiation (buddy = Dog("Buddy", 3))
		  
		  OBJECT (instance — on heap):
		  ┌──────────────────────────────────┐
		  │  buddy (Dog instance)            │
		  │    name = "Buddy"                │
		  │    age  = 3                      │
		  │    [bark method → shared class]  │
		  └──────────────────────────────────┘
		  ```
- # Object Identity, Equality & Value
  collapsed:: true
	- Three ways objects can be "the same" — and they are **not** the same thing:
	- | Concept | Checks | Python | Java |
	  |---|---|---|---|
	  | **Identity** | Are they the **same object** in memory? | `a is b` | `a == b` (for primitives), or `a == b` on ref types |
	  | **Equality** | Do they have the **same value**? | `a == b` (calls `__eq__`) | `a.equals(b)` |
	  | **Value** | Do they hold the same data? | `vars(a) == vars(b)` | Manual field comparison |
	-
	- ```python
	  class Point:
	      def __init__(self, x, y):
	          self.x = x
	          self.y = y
	      def __eq__(self, other):
	          return self.x == other.x and self.y == other.y
	      def __repr__(self):
	          return f"Point({self.x}, {self.y})"
	  
	  p1 = Point(1, 2)
	  p2 = Point(1, 2)
	  p3 = p1          # same reference
	  
	  print(p1 is p2)   # False — different objects in memory
	  print(p1 is p3)   # True  — same object
	  print(p1 == p2)   # True  — same value (via __eq__)
	  print(id(p1))     # e.g. 140234567890 — memory address
	  print(id(p2))     # different address
	  ```
- # Shallow Copy vs Deep Copy
  collapsed:: true
	- When you copy an object, **nested mutable objects** may or may not be copied:
	- | Copy Type | Top-level | Nested objects | Risk |
	  |---|---|---|---|
	  | **Assignment** (`b = a`) | Same object (alias) | Same | Mutations affect both |
	  | **Shallow copy** | New top-level object | Still shared | Nested mutations affect both |
	  | **Deep copy** | New top-level object | Fully independent | Safe — fully isolated |
	-
	- ```python
	  import copy
	  
	  class Team:
	      def __init__(self, name, members):
	          self.name = name
	          self.members = members  # mutable list — danger!
	  
	  original = Team("Alpha", ["Alice", "Bob"])
	  
	  alias         = original             # ALIAS
	  shallow       = copy.copy(original)  # SHALLOW COPY
	  deep          = copy.deepcopy(original)  # DEEP COPY
	  
	  original.members.append("Charlie")
	  
	  print(alias.members)    # ['Alice', 'Bob', 'Charlie']  ← aliased — changed!
	  print(shallow.members)  # ['Alice', 'Bob', 'Charlie']  ← shared inner list!
	  print(deep.members)     # ['Alice', 'Bob']             ← fully independent ✅
	  ```
- # Object Lifecycle
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      A["📝 Class defined\n(no memory allocated)"] --> B["🏗️ Object created\nobj = MyClass()"]
	      B --> C["🧠 Memory allocated on heap\n(Java/Python) or stack/heap (C++)"]
	      C --> D["⚙️ Constructor runs\nAttributes initialized"]
	      D --> E["✅ Object in use\nMethods called, state modified"]
	      E --> F{"Reference count = 0\nor out of scope?"}
	      F -- "No → still in use" --> E
	      F -- "Yes" --> G["🗑️ Destructor called\n__del__ / ~MyClass()"]
	      G --> H["♻️ Memory freed\n(GC or manual delete)"]
	  ```
- # Implementation
  collapsed:: true
	- > [!note] A `GameCharacter` object demonstrating creation, copying, identity, equality, and lifecycle across 5 languages.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  import copy
	  
	  class GameCharacter:
	      total_characters: int = 0
	  
	      def __init__(self, name: str, hp: int, inventory: list[str]):
	          self.name = name
	          self.hp = hp
	          self.inventory = inventory
	          GameCharacter.total_characters += 1
	          self._id = GameCharacter.total_characters
	  
	      def take_damage(self, dmg: int) -> None:
	          self.hp = max(0, self.hp - dmg)
	  
	      def is_alive(self) -> bool:
	          return self.hp > 0
	  
	      # Identity: same memory address?
	      # Equality: same name and hp?
	      def __eq__(self, other) -> bool:
	          return isinstance(other, GameCharacter) and self.name == other.name and self.hp == other.hp
	  
	      def __hash__(self):
	          return hash((self.name, self._id))
	  
	      def __repr__(self) -> str:
	          return f"GameCharacter(name={self.name!r}, hp={self.hp}, inv={self.inventory})"
	  
	      def __del__(self):
	          print(f"[Destructor] {self.name} removed from memory.")
	  
	  
	  hero = GameCharacter("Aragorn", 100, ["sword", "shield"])
	  print(hero)           # GameCharacter(name='Aragorn', hp=100, inv=['sword', 'shield'])
	  hero.take_damage(30)
	  print(hero.is_alive()) # True
	  
	  # Copying
	  alias   = hero
	  shallow = copy.copy(hero)
	  deep    = copy.deepcopy(hero)
	  
	  hero.inventory.append("ring")
	  print(alias.inventory)   # ['sword', 'shield', 'ring'] — same object
	  print(shallow.inventory) # ['sword', 'shield', 'ring'] — shared list
	  print(deep.inventory)    # ['sword', 'shield']         — independent
	  
	  hero2 = GameCharacter("Aragorn", 70, ["sword"])
	  print(hero is alias)  # True  — identity
	  print(hero == hero2)  # False — same name but different hp
	  print(id(hero), id(hero2))  # different addresses
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  
	  class GameCharacter {
	  public:
	      std::string name;
	      int hp;
	      std::vector<std::string> inventory;
	  
	      GameCharacter(std::string name, int hp, std::vector<std::string> inv)
	          : name(name), hp(hp), inventory(inv) {
	          std::cout << "[Constructor] " << name << " created.\n";
	      }
	  
	      // Copy constructor — shallow by default
	      GameCharacter(const GameCharacter& other) = default;
	  
	      ~GameCharacter() {
	          std::cout << "[Destructor] " << name << " removed.\n";
	      }
	  
	      void takeDamage(int dmg) { hp = std::max(0, hp - dmg); }
	      bool isAlive() const { return hp > 0; }
	  
	      bool operator==(const GameCharacter& other) const {
	          return name == other.name && hp == other.hp;
	      }
	  };
	  
	  int main() {
	      GameCharacter hero("Aragorn", 100, {"sword", "shield"});
	      hero.takeDamage(30);
	      std::cout << hero.isAlive() << "\n";  // 1 (true)
	  
	      // Shallow copy (C++ default copy)
	      GameCharacter copy1 = hero;
	      copy1.name = "Clone";   // independent name
	      copy1.inventory.push_back("ring");  // shared! (shallow)
	  
	      std::cout << hero.inventory.size() << "\n";  // 3 (shared vector)
	      std::cout << (hero == copy1) << "\n";        // 0 — different name
	  }
	  // Destructors print when objects go out of scope
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  public class GameCharacter {
	      public String name;
	      public int hp;
	      public List<String> inventory;
	  
	      public GameCharacter(String name, int hp, List<String> inventory) {
	          this.name = name;
	          this.hp = hp;
	          this.inventory = new ArrayList<>(inventory);
	      }
	  
	      public void takeDamage(int dmg) { hp = Math.max(0, hp - dmg); }
	      public boolean isAlive() { return hp > 0; }
	  
	      @Override
	      public boolean equals(Object o) {
	          if (this == o) return true;
	          if (!(o instanceof GameCharacter)) return false;
	          GameCharacter g = (GameCharacter) o;
	          return hp == g.hp && name.equals(g.name);
	      }
	  
	      @Override
	      public String toString() {
	          return "GameCharacter(" + name + ", hp=" + hp + ")";
	      }
	  
	      public static void main(String[] args) {
	          GameCharacter hero = new GameCharacter("Aragorn", 100, List.of("sword", "shield"));
	          System.out.println(hero);      // GameCharacter(Aragorn, hp=100)
	          hero.takeDamage(30);
	          System.out.println(hero.isAlive()); // true
	  
	          GameCharacter ref = hero;   // alias — same object
	          GameCharacter copy = new GameCharacter(hero.name, hero.hp, hero.inventory);
	  
	          System.out.println(hero == ref);       // true  — same reference
	          System.out.println(hero == copy);      // false — different reference
	          System.out.println(hero.equals(copy)); // true  — same value
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  class GameCharacter {
	      static #totalCharacters = 0;
	  
	      constructor(name, hp, inventory) {
	          this.name = name;
	          this.hp = hp;
	          this.inventory = [...inventory]; // shallow copy of array
	          GameCharacter.#totalCharacters++;
	          this._id = GameCharacter.#totalCharacters;
	      }
	  
	      takeDamage(dmg) { this.hp = Math.max(0, this.hp - dmg); }
	      isAlive() { return this.hp > 0; }
	  
	      equals(other) {
	          return this.name === other.name && this.hp === other.hp;
	      }
	  
	      // Deep copy via structured clone
	      clone() {
	          return structuredClone(this);
	      }
	  
	      toString() {
	          return `GameCharacter(${this.name}, hp=${this.hp})`;
	      }
	  }
	  
	  const hero = new GameCharacter("Aragorn", 100, ["sword", "shield"]);
	  const alias = hero;                          // same reference
	  const deep  = hero.clone();                  // deep copy
	  
	  hero.takeDamage(30);
	  console.log(hero.isAlive());        // true
	  console.log(hero === alias);        // true  — same reference
	  console.log(hero === deep);         // false — different object
	  console.log(hero.equals(deep));     // false — hp differs now
	  hero.inventory.push("ring");
	  console.log(alias.inventory);       // ["sword","shield","ring"] — aliased
	  console.log(deep.inventory);        // ["sword","shield"] — independent
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  
	  public class GameCharacter {
	      public string Name { get; set; }
	      public int Hp { get; set; }
	      public List<string> Inventory { get; set; }
	  
	      public GameCharacter(string name, int hp, List<string> inventory) {
	          Name = name; Hp = hp;
	          Inventory = new List<string>(inventory); // shallow copy
	      }
	  
	      public void TakeDamage(int dmg) => Hp = Math.Max(0, Hp - dmg);
	      public bool IsAlive() => Hp > 0;
	  
	      // Deep copy
	      public GameCharacter DeepCopy() =>
	          new GameCharacter(Name, Hp, new List<string>(Inventory));
	  
	      public override bool Equals(object? obj) =>
	          obj is GameCharacter g && Name == g.Name && Hp == g.Hp;
	  
	      public override string ToString() => $"GameCharacter({Name}, hp={Hp})";
	  
	      ~GameCharacter() => Console.WriteLine($"[Finalizer] {Name} collected.");
	  
	      public static void Main(string[] args) {
	          var hero = new GameCharacter("Aragorn", 100, new List<string> { "sword" });
	          var alias = hero;               // same reference
	          var deep  = hero.DeepCopy();    // independent
	  
	          hero.TakeDamage(30);
	          Console.WriteLine(hero.IsAlive());           // True
	          Console.WriteLine(object.ReferenceEquals(hero, alias)); // True
	          Console.WriteLine(object.ReferenceEquals(hero, deep));  // False
	          Console.WriteLine(hero.Equals(deep));        // False — hp differs
	      }
	  }
	  ```
	  
	  :::
- # Key Takeaways
  collapsed:: true
	- An **object** is a runtime instance of a class — it **occupies memory** and holds its own state.
	- **Identity** (`is` / `===` / `==` on refs) checks same memory address; **Equality** checks same value.
	- **Shallow copy** copies the top-level object but shares nested mutable objects. **Deep copy** is fully independent.
	- Python manages memory via **reference counting + garbage collection**. C++ requires manual `delete` or RAII.
	- Each object holds its own **instance attributes**, but shares **class methods** with all other instances.
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Python Data Model — Objects, values, types](https://docs.python.org/3/reference/datamodel.html)
		- [Real Python — OOP Objects](https://realpython.com/python3-object-oriented-programming/)
		- [Java — Object class](https://docs.oracle.com/javase/8/docs/api/java/lang/Object.html)