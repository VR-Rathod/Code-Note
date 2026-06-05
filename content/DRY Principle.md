---
seoTitle: DRY Principle in OOP – Complete In-Depth Guide | Don't Repeat Yourself, Code Reuse
description: "Deep dive into the DRY (Don't Repeat Yourself) principle. Covers why duplication hurts, how to identify and eliminate repetition using functions, classes, inheritance, and design patterns, with examples in Python, Java, and JavaScript."
keywords: "DRY principle, Don't Repeat Yourself, code reuse, single source of truth, refactoring, Python DRY, Java DRY, design principles, SOLID, clean code, VR-Rathod, Code-Note"
displayTitle: DRY Principle
treeTitle: DSA - OOP - DRY Principle
---

> [!info] What is the DRY Principle?
> **DRY** stands for **"Don't Repeat Yourself"** — a software design principle stating that **every piece of knowledge or logic must have a single, authoritative, unambiguous representation in a system**. Duplication of logic means two places to update, two places to break, and two sources of potential inconsistency.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine a **restaurant menu** 🍽️ that lists the price of "Chicken Burger" in 12 different places: on the board, on each table card, on the website, on the delivery app. If the price changes, someone has to update all 12 places. Miss one? Now you have inconsistent pricing.
		- **DRY solution**: Store the price in **one place** (a database). Every display reads from that single source. Update once, reflected everywhere.
	-
	- ## The Cost of WET Code (Write Everything Twice)
	  collapsed:: true
		- WET = "Write Everything Twice" (or "Wastefully Everything Twice") — the violation of DRY.
		- ```
		  WET Code Costs:
		  ┌───────────────────────────────────────────────┐
		  │  1. Bug in logic → must fix in N places       │
		  │  2. Change in requirements → must update N files│
		  │  3. Test must cover N copies                  │
		  │  4. Developer must learn N copies             │
		  │  5. Inconsistency risk grows with N           │
		  └───────────────────────────────────────────────┘
		  ```
	-
	- ## When DRY Applies
	  collapsed:: true
		- | Type | DRY Violation | DRY Solution |
		  |---|---|---|
		  | **Code** | Same logic in 5 functions | Extract to one shared function |
		  | **Data** | Same config value hard-coded in 20 files | Central config file / constant |
		  | **Documentation** | Same explanation in 3 places | One doc, link to it |
		  | **Database** | Same data in two tables | Normalize into one table |
		  | **Tests** | Same setup in every test | Shared fixture / setup function |
- # DRY in Code — Before & After
  collapsed:: true
	- ## Bad (WET) vs Good (DRY) Code
	  collapsed:: true
		- ```python
		  # ❌ WET — Duplicated validation logic
		  def create_user(name, age):
		      if not name or not name.strip():
		          raise ValueError("Name cannot be empty")
		      if age < 0 or age > 150:
		          raise ValueError("Invalid age")
		      return {"name": name.strip(), "age": age}
		  
		  def update_user(user_id, name, age):
		      if not name or not name.strip():     # ← duplicated!
		          raise ValueError("Name cannot be empty")
		      if age < 0 or age > 150:             # ← duplicated!
		          raise ValueError("Invalid age")
		      return {"id": user_id, "name": name.strip(), "age": age}
		  
		  def register_admin(name, age):
		      if not name or not name.strip():     # ← duplicated again!
		          raise ValueError("Name cannot be empty")
		      if age < 0 or age > 150:             # ← duplicated again!
		          raise ValueError("Invalid age")
		      return {"name": name.strip(), "age": age, "role": "admin"}
		  
		  
		  # ✅ DRY — Logic extracted once
		  def _validate_name(name: str) -> str:
		      """Single authoritative validation for names."""
		      if not name or not name.strip():
		          raise ValueError("Name cannot be empty")
		      return name.strip()
		  
		  def _validate_age(age: int) -> int:
		      """Single authoritative validation for age."""
		      if age < 0 or age > 150:
		          raise ValueError(f"Invalid age: {age}")
		      return age
		  
		  def create_user(name: str, age: int) -> dict:
		      return {"name": _validate_name(name), "age": _validate_age(age)}
		  
		  def update_user(user_id: int, name: str, age: int) -> dict:
		      return {"id": user_id, "name": _validate_name(name), "age": _validate_age(age)}
		  
		  def register_admin(name: str, age: int) -> dict:
		      return {"name": _validate_name(name), "age": _validate_age(age), "role": "admin"}
		  ```
- # Implementation
  collapsed:: true
	- > [!note] DRY applied at the class level — eliminating duplicated discount logic, repeated email formatting, and hard-coded magic values.
	  > Languages: [[Python]] · [[Java]] · [[Java Script]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python — DRY via class hierarchy + constants ─────────────────────
	  from decimal import Decimal
	  from dataclasses import dataclass, field
	  from typing import ClassVar
	  
	  
	  # ── Single source of truth for tax rates and limits ────
	  @dataclass
	  class PricingConfig:
	      TAX_RATE: ClassVar[Decimal] = Decimal("0.08")  # 8%
	      MAX_DISCOUNT: ClassVar[Decimal] = Decimal("0.50")  # 50%
	      MIN_PRICE: ClassVar[Decimal] = Decimal("0.01")
	  
	  
	  @dataclass
	  class Product:
	      name: str
	      base_price: Decimal
	  
	      def __post_init__(self):
	          if self.base_price < PricingConfig.MIN_PRICE:
	              raise ValueError(f"Price must be >= {PricingConfig.MIN_PRICE}")
	  
	      # ── DRY: Single place for tax calculation ─────────
	   @property
	   def price_with_tax(self) -> Decimal:
	       return self.base_price * (1 + PricingConfig.TAX_RATE)
	  
	      def apply_discount(self, rate: Decimal) -> Decimal:
	          if rate > PricingConfig.MAX_DISCOUNT:
	              rate = PricingConfig.MAX_DISCOUNT  # clamped
	          return self.base_price * (1 - rate)
	  
	      def __repr__(self) -> str:
	          return f"Product({self.name!r}, ${self.base_price})"
	  
	  
	  @dataclass
	  class Cart:
	      items: list[tuple[Product, int]] = field(default_factory=list)
	  
	      def add(self, product: Product, qty: int = 1) -> None:
	          self.items.append((product, qty))
	  
	      # ── DRY: Single place for total calculation ────────
	      def subtotal(self) -> Decimal:
	          return sum(p.base_price * q for p, q in self.items)
	  
	      def total_with_tax(self) -> Decimal:
	          return self.subtotal() * (1 + PricingConfig.TAX_RATE)
	  
	      def receipt(self) -> str:
	          lines = [f"  {p.name} x{q} = ${p.base_price * q:.2f}" for p, q in self.items]
	          return "\n".join([
	              "=== Receipt ===",
	              *lines,
	              f"  Subtotal: ${self.subtotal():.2f}",
	              f"  Tax ({PricingConfig.TAX_RATE*100:.0f}%): ${(self.subtotal() * PricingConfig.TAX_RATE):.2f}",
	              f"  TOTAL: ${self.total_with_tax():.2f}",
	          ])
	  
	  
	  p1 = Product("Widget", Decimal("9.99"))
	  p2 = Product("Gadget", Decimal("24.99"))
	  cart = Cart()
	  cart.add(p1, 2)
	  cart.add(p2, 1)
	  print(cart.receipt())
	  ```
	  
	  ```java
	  // ─── Java — DRY via constants and shared utility methods ─────────────
	  import java.math.BigDecimal;
	  import java.math.RoundingMode;
	  
	  public class DryDemo {
	  
	      // ── Single source of truth ─────────────────────────
	      static final BigDecimal TAX_RATE = new BigDecimal("0.08");
	      static final BigDecimal MAX_DISCOUNT = new BigDecimal("0.50");
	  
	      // ── DRY: shared validation ─────────────────────────
	      static BigDecimal applyTax(BigDecimal amount) {
	          return amount.multiply(BigDecimal.ONE.add(TAX_RATE))
	                       .setScale(2, RoundingMode.HALF_UP);
	      }
	  
	      static BigDecimal applyDiscount(BigDecimal price, BigDecimal rate) {
	          if (rate.compareTo(MAX_DISCOUNT) > 0) rate = MAX_DISCOUNT;
	          return price.multiply(BigDecimal.ONE.subtract(rate))
	                      .setScale(2, RoundingMode.HALF_UP);
	      }
	  
	      // ── DRY: format money in ONE place ─────────────────
	      static String formatPrice(BigDecimal amount) {
	          return String.format("$%.2f", amount);
	      }
	  
	      static class Product {
	          String name;
	          BigDecimal price;
	          Product(String name, String price) { this.name = name; this.price = new BigDecimal(price); }
	          BigDecimal priceWithTax() { return applyTax(price); }  // reuses shared applyTax
	          BigDecimal withDiscount(String rate) { return applyDiscount(price, new BigDecimal(rate)); }
	          public String toString() { return name + " (" + formatPrice(price) + ")"; }
	      }
	  
	      public static void main(String[] args) {
	          Product p1 = new Product("Widget", "9.99");
	          Product p2 = new Product("Gadget", "24.99");
	  
	          System.out.println(p1 + " + tax = " + formatPrice(p1.priceWithTax()));
	          System.out.println(p2 + " - 20% = " + formatPrice(p2.withDiscount("0.20")));
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript — DRY via constants and shared utilities ─────────────
	  // Single source of truth
	  const PRICING = {
	      TAX_RATE: 0.08,
	      MAX_DISCOUNT: 0.50,
	      MIN_PRICE: 0.01,
	  };
	  
	  // DRY: shared utility functions used everywhere
	  const applyTax = (amount) => +(amount * (1 + PRICING.TAX_RATE)).toFixed(2);
	  const applyDiscount = (price, rate) => {
	      const clamped = Math.min(rate, PRICING.MAX_DISCOUNT);
	      return +(price * (1 - clamped)).toFixed(2);
	  };
	  const formatPrice = (amount) => `$${amount.toFixed(2)}`;
	  
	  class Product {
	      constructor(name, price) {
	          if (price < PRICING.MIN_PRICE) throw new Error("Price too low");
	          this.name = name;
	          this.price = price;
	      }
	      get priceWithTax() { return applyTax(this.price); }
	      withDiscount(rate) { return applyDiscount(this.price, rate); }
	      toString() { return `${this.name} (${formatPrice(this.price)})`; }
	  }
	  
	  class Cart {
	      constructor() { this.items = []; }
	      add(product, qty = 1) { this.items.push({ product, qty }); }
	      get subtotal() { return this.items.reduce((s, {product, qty}) => s + product.price * qty, 0); }
	      get total() { return applyTax(this.subtotal); }  // reuses shared applyTax
	      receipt() {
	          const lines = this.items.map(({product, qty}) =>
	              `  ${product.name} x${qty} = ${formatPrice(product.price * qty)}`);
	          return [
	              "=== Receipt ===",
	              ...lines,
	              `  Subtotal: ${formatPrice(this.subtotal)}`,
	              `  Tax: ${formatPrice(this.subtotal * PRICING.TAX_RATE)}`,
	              `  TOTAL: ${formatPrice(this.total)}`,
	          ].join('\n');
	      }
	  }
	  
	  const cart = new Cart();
	  cart.add(new Product("Widget", 9.99), 2);
	  cart.add(new Product("Gadget", 24.99));
	  console.log(cart.receipt());
	  ```
	  
	  :::
- # When NOT to Apply DRY — The Danger of Premature Abstraction
  collapsed:: true
	- DRY can be over-applied. Forcing two pieces of code into one shared abstraction when they are *accidentally similar* can create **wrong couplings**.
	- ```
	  ✅ Apply DRY when:
	  - Same LOGIC (not just same structure) exists in multiple places
	  - Logic changes for the same reason simultaneously
	  - Duplication creates real maintenance pain
	  
	  ❌ Avoid DRY when:
	  - Code looks the same but changes for different reasons (coincidental similarity)
	  - Shared abstraction would require 15 parameters to handle all edge cases
	  - You're abstracting with only 2 examples — wait for a 3rd occurrence (Rule of Three)
	  ```
	- > [!tip] **Rule of Three**: Duplicate once (it's acceptable). Duplicate twice — consider abstracting. Duplicate a third time — abstract it now.
- # Key Takeaways
  collapsed:: true
	- **Every piece of knowledge = one authoritative representation**.
	- DRY applies to: code logic, data values, configuration, documentation, schema.
	- Violations (WET code) create maintenance nightmares — N places to update, N chances to break.
	- Apply via: **functions**, **classes**, **constants**, **inheritance**, **templates**, **configs**.
	- Don't over-abstract — wait for 3+ occurrences (Rule of Three) before generalizing.
	- Related principles: [[YAGNI Principle]], [[Single Responsibility Principle (SRP)]], [[Law of Demeter]]
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [The Pragmatic Programmer — DRY](https://pragprog.com/tips/)
		- [Martin Fowler — Don't Repeat Yourself](https://www.martinfowler.com/ieeeSoftware/repetition.pdf)