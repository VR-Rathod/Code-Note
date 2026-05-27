---
seoTitle: Liskov Substitution Principle (LSP) – Complete Guide | SOLID, Subtype Correctness
description: "Deep dive into the Liskov Substitution Principle (LSP) from SOLID. Covers what it means for subtypes to be substitutable, classic violations (Square-Rectangle problem), preconditions, postconditions, and examples in Python and Java."
keywords: "Liskov Substitution Principle, LSP, SOLID, subtype, square rectangle problem, behavioral subtyping, preconditions, postconditions, Python LSP, Java LSP, VR-Rathod, Code-Note"
displayTitle: Liskov Substitution Principle (LSP)
---

> [!info] What is the Liskov Substitution Principle?
> The **Liskov Substitution Principle (LSP)** — the **L** in [[SOLID]] — states that objects of a **subclass must be substitutable for objects of their superclass** without breaking the correctness of the program. If class B extends class A, you should be able to replace A with B everywhere and have the program still work correctly.

- # Explanation
  collapsed:: true
	- ## Simple Definition
	  collapsed:: true
		- > *"If S is a subtype of T, then objects of type T may be replaced with objects of type S without altering any of the desirable properties of the program."* — Barbara Liskov (1987)
		- In plain English: **Subclasses must honor their parent's contract** — they can extend behavior but must not contradict or weaken what the parent promises.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine a `Bird` class with a `fly()` method. You create an `Ostrich` subclass — but ostriches can't fly! If code calls `bird.fly()`, substituting an `Ostrich` breaks the program.
		- **LSP says**: Don't inherit from `Bird` if you can't fulfill the `fly()` contract. Instead, restructure the hierarchy or use interfaces.
	-
	- ## The Classic Violation — Square extends Rectangle
	  collapsed:: true
		- ```python
		  # ❌ LSP Violation — Square "IS-A" Rectangle... or is it?
		  class Rectangle:
		      def __init__(self, width, height):
		          self.width = width
		          self.height = height
		  
		      def set_width(self, w): self.width = w
		      def set_height(self, h): self.height = h
		      def area(self): return self.width * self.height
		  
		  class Square(Rectangle):
		      def set_width(self, w):    # Forces both dimensions equal
		          self.width = w
		          self.height = w
		  
		      def set_height(self, h):   # Forces both dimensions equal
		          self.width = h
		          self.height = h
		  
		  # Client code that works for Rectangle:
		  def resize_and_check(rect: Rectangle):
		      rect.set_width(5)
		      rect.set_height(3)
		      assert rect.area() == 15, f"Expected 15, got {rect.area()}"  # ✅ passes for Rectangle
		      # ❌ FAILS for Square! set_height(3) also set width=3, so area=9, not 15
		  
		  r = Rectangle(2, 2)
		  resize_and_check(r)    # ✅ passes
		  
		  s = Square(2)
		  resize_and_check(s)    # ❌ AssertionError — LSP violated!
		  
		  # Fix: don't inherit Square from Rectangle. Use a common Shape interface.
		  ```

- # LSP Rules
  collapsed:: true
	- | Rule | Description |
	  |---|---|
	  | **Preconditions** | Subtype must not strengthen preconditions (can't require more strict input) |
	  | **Postconditions** | Subtype must not weaken postconditions (must deliver at least what parent promises) |
	  | **Invariants** | Subtype must preserve all invariants of the parent |
	  | **Exceptions** | Subtype must not throw new exceptions not in parent's contract |
	  | **Return types** | Subtype can return a more specific type (covariant) |
	-
	- ```
	  Strength direction:
	  Parent: can_withdraw(amount) → True if balance >= amount
	  
	  ❌ LSP violation: SavingsAccount.can_withdraw() also checks withdrawal limit
	     (strengthened precondition — now has MORE requirements than parent promised)
	  
	  ✅ LSP compliant: SavingsAccount.can_withdraw() honors same contract
	     (only narrows postcondition, never expands precondition)
	  ```

- # Implementation
  collapsed:: true
	- > [!note] LSP-compliant account hierarchy and Bird hierarchy — avoiding classic violations.
	  > Languages: [[Python]] · [[Java]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python — LSP-compliant design ────────────────────────────────────
	  from abc import ABC, abstractmethod
	  from decimal import Decimal
	  
	  # ── LSP Violation: Square/Rectangle ─ Fixed via separate interface ─────
	  class Shape(ABC):
	      @abstractmethod
	      def area(self) -> float: ...
	  
	  class Rectangle(Shape):
	      def __init__(self, w: float, h: float):
	          self.width = w
	          self.height = h
	      def area(self) -> float: return self.width * self.height
	  
	  class Square(Shape):   # Square is its OWN shape, not a Rectangle
	      def __init__(self, side: float):
	          self.side = side
	      def area(self) -> float: return self.side ** 2
	  
	  # Now: substitute any Shape safely
	  def print_area(shape: Shape) -> None:  # Works correctly for ALL shapes
	      print(f"{type(shape).__name__}: area = {shape.area():.2f}")
	  
	  for s in [Rectangle(5, 3), Square(4)]:
	      print_area(s)  # ✅ Both work correctly
	  
	  
	  # ── LSP-compliant Account hierarchy ───────────────────────────────────
	  class Account(ABC):
	      def __init__(self, balance: Decimal):
	          self._balance = balance
	  
	      @property
	      def balance(self) -> Decimal: return self._balance
	  
	      @abstractmethod
	      def deposit(self, amount: Decimal) -> None: ...
	  
	      @abstractmethod
	      def can_withdraw(self, amount: Decimal) -> bool: ...
	  
	      def withdraw(self, amount: Decimal) -> Decimal:
	          if not self.can_withdraw(amount):
	              raise ValueError(f"Cannot withdraw {amount} from {type(self).__name__}")
	          self._balance -= amount
	          return amount
	  
	  class CheckingAccount(Account):
	      def deposit(self, amount: Decimal) -> None:
	          if amount <= 0: raise ValueError("Amount must be positive")
	          self._balance += amount
	  
	      def can_withdraw(self, amount: Decimal) -> bool:
	          return amount > 0 and self._balance >= amount  # Same contract as parent specifies
	  
	  class SavingsAccount(Account):
	      def __init__(self, balance: Decimal, min_balance: Decimal = Decimal("100")):
	          super().__init__(balance)
	          self.min_balance = min_balance
	  
	      def deposit(self, amount: Decimal) -> None:
	          if amount <= 0: raise ValueError("Amount must be positive")
	          self._balance += amount
	  
	      def can_withdraw(self, amount: Decimal) -> bool:
	          # Savings requires minimum balance — THIS IS DOCUMENTED in the class, not sneaky
		      return amount > 0 and (self._balance - amount) >= self.min_balance
	  
	  # LSP test: substitute any Account freely
	  def process_withdrawal(account: Account, amount: Decimal) -> None:
	      if account.can_withdraw(amount):
	          account.withdraw(amount)
	          print(f"Withdrew {amount}. Balance: {account.balance}")
	      else:
	          print(f"Cannot withdraw {amount}. Balance: {account.balance}")
	  
	  checking = CheckingAccount(Decimal("500"))
	  savings  = SavingsAccount(Decimal("500"))
	  
	  process_withdrawal(checking, Decimal("200"))  # ✅ Withdrew 200. Balance: 300
	  process_withdrawal(savings, Decimal("450"))   # ✅ Cannot withdraw — would go below min
	  process_withdrawal(savings, Decimal("350"))   # ✅ Withdrew 350. Balance: 150
	  ```
	  
	  ```java
	  // ─── Java — LSP-compliant Bird hierarchy ─────────────────────────────
	  
	  // ❌ Original LSP violation (don't do this):
	  // class Bird { void fly() {} }
	  // class Ostrich extends Bird { void fly() { throw new UnsupportedOperationException(); } }
	  
	  // ✅ LSP fix — separate abilities via interfaces
	  interface Animal {
	      String makeSound();
	      String move();
	  }
	  
	  interface Flyable {
	      String fly();
	      default double maxAltitude() { return 1000; }
	  }
	  
	  interface Swimmable {
	      String swim();
	  }
	  
	  // Flyable birds
	  class Eagle implements Animal, Flyable {
	      public String makeSound() { return "Screech!"; }
	      public String move() { return "Soars through the air"; }
	      public String fly() { return "Eagle flying at " + maxAltitude() + "m"; }
	  }
	  
	  // Non-flyable bird — doesn't implement Flyable
	  class Ostrich implements Animal, Swimmable {
	      public String makeSound() { return "Boom!"; }
	      public String move() { return "Runs at 70 km/h"; }
	      public String swim() { return "Ostrich paddling"; }
	  }
	  
	  // Duck — can fly AND swim
	  class Duck implements Animal, Flyable, Swimmable {
	      public String makeSound() { return "Quack!"; }
	      public String move() { return "Waddles and swims"; }
	      public String fly() { return "Duck flying low"; }
	      public String swim() { return "Duck swimming"; }
	  }
	  
	  class LSPDemo {
	      static void makeItFly(Flyable f) {
	          System.out.println(f.fly());  // Only called on actually flyable things
	      }
	      static void makeAnimalSound(Animal a) {
	          System.out.println(a.makeSound());  // Works for ALL animals
	      }
	  
	      public static void main(String[] args) {
	          Eagle eagle = new Eagle();
	          Ostrich ostrich = new Ostrich();
	          Duck duck = new Duck();
	  
	          // All work as Animal substitutes
	          for (Animal a : new Animal[]{eagle, ostrich, duck})
	              makeAnimalSound(a);
	  
	          // Only flyable ones fly
	          for (Flyable f : new Flyable[]{eagle, duck})
	              makeItFly(f);
	          // No ClassCastException, no UnsupportedOperationException — LSP maintained!
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- **Subtypes must honor their parent's contract** — same input acceptance, same output guarantees.
	- **Square/Rectangle problem**: a Square IS-A Rectangle geometrically but violates it behaviorally — prefer interfaces over forced inheritance.
	- **Bird/Ostrich problem**: Don't put `fly()` in a base `Bird` class if not all birds can fly — use capability interfaces (`Flyable`).
	- A class that throws `UnsupportedOperationException` or `NotImplementedException` for inherited methods is a **red flag** for LSP violation.
	- Works closely with: [[Inheritance]], [[Interface]], [[Open Closed Principle (OCP)]]

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Liskov Substitution — Wikipedia](https://en.wikipedia.org/wiki/Liskov_substitution_principle)
		- [Refactoring Guru — SOLID](https://refactoring.guru/solid)
