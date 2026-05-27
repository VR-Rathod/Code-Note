---
seoTitle: Prototype Pattern in OOP – Complete In-Depth Guide | Creational Design Pattern, Cloning
description: "Deep dive into the Prototype design pattern. Covers object cloning, shallow vs deep copy, prototype registry, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "prototype pattern, creational design pattern, object cloning, shallow copy, deep copy, clone interface, prototype registry, GoF, Python clone, Java Cloneable, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Prototype Pattern
---

> [!info] What is the Prototype Pattern?
> The **Prototype Pattern** is a **creational design pattern** that creates new objects by **cloning an existing object** (the prototype) rather than instantiating from scratch. It delegates the duplication logic to the objects themselves. Use it when object creation is expensive or complex, and a copy is cheaper than a new construction.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of **cell division** 🧬 — a cell doesn't build a new cell from scratch from raw atoms. It **copies itself** and the copy starts as an identical version.
		- Or: **Document templates** 📄 — you open an existing report, duplicate it, then customize the copy. Much faster than building a new report from scratch.
		- In code: instead of `new Enemy(level=5, weapon="sword", armor="chainmail")`, you clone an existing level-5 knight and just change the color.
	-
	- ## Shallow vs Deep Copy
	  collapsed:: true
		- | | Shallow Copy | Deep Copy |
		  |---|---|---|
		  | **Primitive fields** | Copied by value ✅ | Copied by value ✅ |
		  | **Object references** | Shared ⚠️ (same object) | New copies created ✅ |
		  | **Risk** | Modifying nested objects affects original | Safe — fully independent |
		  | **Speed** | Faster | Slower |
		- ```
		  Original: { name: "Knight", stats: { hp: 100 } }
		  
		  Shallow clone: { name: "Knight", stats: → SAME OBJECT }
		  clone.stats.hp = 50  ← also changes original.stats.hp!  ⚠️
		  
		  Deep clone:    { name: "Knight", stats: { hp: 100 } }  ← new object
		  clone.stats.hp = 50  ← original unchanged ✅
		  ```
	-
	- ## UML Structure
	  collapsed:: true
		- ```mermaid
		  classDiagram
		      class Prototype {
		          <<interface>>
		          +clone() Prototype
		      }
		      class ConcretePrototypeA {
		          -field1
		          -field2
		          +clone() ConcretePrototypeA
		      }
		      class ConcretePrototypeB {
		          -field1
		          -nested: Object
		          +clone() ConcretePrototypeB
		      }
		      class PrototypeRegistry {
		          -prototypes: Map
		          +get(key) Prototype
		          +register(key, prototype)
		      }
		      Prototype <|.. ConcretePrototypeA
		      Prototype <|.. ConcretePrototypeB
		      PrototypeRegistry o--> Prototype : stores
		  ```

- # Implementation
  collapsed:: true
	- > [!note] Game enemy system — clone pre-built enemy archetypes instead of reconstructing from scratch each time.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  import copy
	  from dataclasses import dataclass, field
	  
	  # ── Prototype (deep copy via copy.deepcopy) ───────────────────────────
	  @dataclass
	  class EnemyStats:
	      hp: int
	      attack: int
	      defense: int
	  
	  @dataclass
	  class Enemy:
	      name: str
	      level: int
	      weapon: str
	      stats: EnemyStats                    # Nested object — needs deep copy
	      abilities: list[str] = field(default_factory=list)
	  
	      def clone(self) -> "Enemy":
	          """Deep clone — fully independent copy."""
	          return copy.deepcopy(self)
	  
	      def __str__(self) -> str:
	          return (f"[{self.name}] Lv{self.level} | {self.weapon} | "
	                  f"HP:{self.stats.hp} ATK:{self.stats.attack} DEF:{self.stats.defense} | "
	                  f"Abilities:{self.abilities}")
	  
	  # ── Prototype Registry ────────────────────────────────────────────────
	  class EnemyRegistry:
	      _registry: dict[str, Enemy] = {}
	  
	      @classmethod
	      def register(cls, key: str, enemy: Enemy) -> None:
	          cls._registry[key] = enemy
	  
	      @classmethod
	      def spawn(cls, key: str) -> Enemy:
	          """Clone the prototype — O(1) lookup + deep copy."""
	          proto = cls._registry.get(key)
	          if not proto: raise KeyError(f"Unknown enemy type: {key}")
	          return proto.clone()
	  
	  # ── Setup prototypes (done once at game start) ────────────────────────
	  EnemyRegistry.register("goblin", Enemy(
	      name="Goblin", level=1, weapon="Dagger",
	      stats=EnemyStats(hp=30, attack=5, defense=2),
	      abilities=["Sneak", "Poison"]
	  ))
	  EnemyRegistry.register("knight", Enemy(
	      name="Knight", level=5, weapon="Sword",
	      stats=EnemyStats(hp=120, attack=18, defense=15),
	      abilities=["Block", "Slash", "Parry"]
	  ))
	  
	  # ── Spawning enemies — fast cloning, no reconstruction ───────────────
	  g1 = EnemyRegistry.spawn("goblin")
	  g2 = EnemyRegistry.spawn("goblin")
	  
	  # Customize clone without affecting prototype or other clones
	  g2.name = "Elite Goblin"
	  g2.level = 3
	  g2.stats.hp = 60                  # Deep copy — g1.stats.hp stays 30
	  
	  print(g1)                          # [Goblin] Lv1 | HP:30 ...
	  print(g2)                          # [Elite Goblin] Lv3 | HP:60 ...
	  
	  knight = EnemyRegistry.spawn("knight")
	  print(knight)
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  #include <memory>
	  #include <map>
	  
	  // ── Prototype interface ──────────────────────────────────────────────
	  class Enemy {
	  public:
	      virtual std::unique_ptr<Enemy> clone() const = 0;
	      virtual void print() const = 0;
	      virtual ~Enemy() = default;
	  };
	  
	  // ── Concrete Prototype ───────────────────────────────────────────────
	  class Goblin : public Enemy {
	      std::string name_;
	      int level_, hp_, attack_;
	      std::vector<std::string> abilities_;
	  public:
	      Goblin(std::string name, int level, int hp, int attack,
	             std::vector<std::string> abilities)
	          : name_(std::move(name)), level_(level), hp_(hp),
	            attack_(attack), abilities_(std::move(abilities)) {}
	  
	      // Clone creates an independent copy (value semantics)
	      std::unique_ptr<Enemy> clone() const override {
	          return std::make_unique<Goblin>(*this);  // Copy constructor = deep copy
	      }
	  
	      void setHp(int hp) { hp_ = hp; }
	      void setLevel(int lv) { level_ = lv; }
	  
	      void print() const override {
	          std::cout << "[" << name_ << "] Lv" << level_
	                    << " HP:" << hp_ << " ATK:" << attack_ << "\n";
	          for (const auto& a : abilities_) std::cout << "  - " << a << "\n";
	      }
	  };
	  
	  // ── Registry ─────────────────────────────────────────────────────────
	  class EnemyRegistry {
	      std::map<std::string, std::unique_ptr<Enemy>> registry_;
	  public:
	      void registerEnemy(const std::string& key, std::unique_ptr<Enemy> proto) {
	          registry_[key] = std::move(proto);
	      }
	      std::unique_ptr<Enemy> spawn(const std::string& key) {
	          return registry_.at(key)->clone();
	      }
	  };
	  
	  int main() {
	      EnemyRegistry reg;
	      reg.registerEnemy("goblin",
	          std::make_unique<Goblin>("Goblin", 1, 30, 5,
	              std::vector<std::string>{"Sneak", "Poison"}));
	  
	      auto g1 = reg.spawn("goblin");
	      auto g2 = reg.spawn("goblin");   // Independent clone
	  
	      g1->print();
	      g2->print();
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  // ── Prototype interface ────────────────────────────────────────────────
	  interface Cloneable<T> {
	      T clone();
	  }
	  
	  class EnemyStats {
	      int hp, attack, defense;
	      EnemyStats(int hp, int attack, int defense) {
	          this.hp = hp; this.attack = attack; this.defense = defense;
	      }
	      EnemyStats copy() { return new EnemyStats(hp, attack, defense); } // Deep copy
	  }
	  
	  class Enemy implements Cloneable<Enemy> {
	      String name;
	      int level;
	      String weapon;
	      EnemyStats stats;
	      List<String> abilities;
	  
	      Enemy(String name, int level, String weapon, EnemyStats stats, List<String> abilities) {
	          this.name = name; this.level = level; this.weapon = weapon;
	          this.stats = stats; this.abilities = abilities;
	      }
	  
	      @Override
	      public Enemy clone() {
	          // Deep copy: new stats object + new abilities list
	          return new Enemy(name, level, weapon,
	              stats.copy(), new ArrayList<>(abilities));
	      }
	  
	      @Override public String toString() {
	          return String.format("[%s] Lv%d | %s | HP:%d ATK:%d | %s",
	              name, level, weapon, stats.hp, stats.attack, abilities);
	      }
	  }
	  
	  class EnemyRegistry {
	      private Map<String, Enemy> registry = new HashMap<>();
	      void register(String key, Enemy e)  { registry.put(key, e); }
	      Enemy spawn(String key)              { return registry.get(key).clone(); }
	  }
	  
	  class PrototypeDemo {
	      public static void main(String[] args) {
	          EnemyRegistry reg = new EnemyRegistry();
	          reg.register("goblin", new Enemy("Goblin", 1, "Dagger",
	              new EnemyStats(30, 5, 2), List.of("Sneak", "Poison")));
	  
	          Enemy g1 = reg.spawn("goblin");
	          Enemy g2 = reg.spawn("goblin");
	  
	          g2.name      = "Elite Goblin";
	          g2.level     = 3;
	          g2.stats.hp  = 60;             // g1.stats.hp still 30 ✅
	  
	          System.out.println(g1);
	          System.out.println(g2);
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  
	  class Enemy {
	      constructor(name, level, weapon, stats, abilities) {
	          this.name      = name;
	          this.level     = level;
	          this.weapon    = weapon;
	          this.stats     = { ...stats };           // Shallow copy of stats
	          this.abilities = [...abilities];          // Shallow copy of array
	      }
	  
	      clone() {
	          // Deep clone via constructor (copies nested objects)
	          return new Enemy(
	              this.name, this.level, this.weapon,
	              { ...this.stats },                   // new stats object
	              [...this.abilities]                   // new abilities array
	          );
	      }
	  
	      toString() {
	          return `[${this.name}] Lv${this.level} | ${this.weapon} | HP:${this.stats.hp}`;
	      }
	  }
	  
	  class EnemyRegistry {
	      #registry = new Map();
	      register(key, enemy)  { this.#registry.set(key, enemy); }
	      spawn(key)            { return this.#registry.get(key).clone(); }
	  }
	  
	  const registry = new EnemyRegistry();
	  registry.register("goblin",
	      new Enemy("Goblin", 1, "Dagger", { hp: 30, attack: 5 }, ["Sneak", "Poison"]));
	  
	  const g1 = registry.spawn("goblin");
	  const g2 = registry.spawn("goblin");
	  g2.name      = "Elite Goblin";
	  g2.stats.hp  = 60;               // g1.stats.hp still 30 ✅
	  
	  console.log(g1.toString());      // [Goblin] Lv1 | HP:30
	  console.log(g2.toString());      // [Elite Goblin] Lv1 | HP:60
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  
	  record EnemyStats(int Hp, int Attack, int Defense) {
	      // Records are immutable value types — safe to share or copy
	  }
	  
	  class Enemy : ICloneable {
	      public string Name;
	      public int Level;
	      public string Weapon;
	      public EnemyStats Stats;             // Record — value type (safe)
	      public List<string> Abilities;
	  
	      public Enemy(string name, int level, string weapon,
	                   EnemyStats stats, List<string> abilities) {
	          Name = name; Level = level; Weapon = weapon;
	          Stats = stats; Abilities = abilities;
	      }
	  
	      public object Clone() {
	          // Deep clone: records copy by value, list needs new list
	          return new Enemy(Name, Level, Weapon, Stats, new List<string>(Abilities));
	      }
	  
	      public override string ToString() =>
	          $"[{Name}] Lv{Level} | {Weapon} | HP:{Stats.Hp} ATK:{Stats.Attack} | [{string.Join(", ", Abilities)}]";
	  }
	  
	  class EnemyRegistry {
	      Dictionary<string, Enemy> registry = new();
	      public void Register(string key, Enemy e)  => registry[key] = e;
	      public Enemy Spawn(string key)             => (Enemy)registry[key].Clone();
	  }
	  
	  class PrototypeDemo {
	      static void Main() {
	          var reg = new EnemyRegistry();
	          reg.Register("goblin", new Enemy("Goblin", 1, "Dagger",
	              new EnemyStats(30, 5, 2), new List<string> { "Sneak", "Poison" }));
	  
	          var g1 = reg.Spawn("goblin");
	          var g2 = reg.Spawn("goblin");
	  
	          g2.Name    = "Elite Goblin";
	          g2.Level   = 3;
	          g2.Stats   = g2.Stats with { Hp = 60 };   // Record update — g1 unchanged ✅
	  
	          Console.WriteLine(g1);
	          Console.WriteLine(g2);
	      }
	  }
	  ```
	  
	  :::

- # When to Use
  collapsed:: true
	- ## ✅ Use Prototype When:
		- Object creation is **expensive** (database calls, network requests, complex computations).
		- You need many objects that differ only slightly from a base configuration.
		- You want to avoid subclassing for every variation.
		- The class hierarchy is complex and construction is opaque.
	- ## ❌ Avoid When:
		- Objects are simple and cheap to construct from scratch.
		- Cloning semantics are unclear (circular references, external resources).

- # Key Takeaways
  collapsed:: true
	- Clone existing objects instead of constructing new ones from scratch.
	- Always use **deep copy** for nested objects to ensure full independence.
	- A **Prototype Registry** pre-builds archetypes; `spawn()` returns clones in O(1).
	- Python: `copy.deepcopy()`. Java: `Cloneable` / custom clone. C++: copy constructor.
	- Related patterns: [[Factory Pattern]], [[Abstract Factory Pattern]], [[Builder Pattern]]

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Refactoring Guru — Prototype](https://refactoring.guru/design-patterns/prototype)
		- [GoF Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
