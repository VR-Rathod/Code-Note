---
seoTitle: Law of Demeter in OOP – Complete Guide | Principle of Least Knowledge, Tell Don't Ask
description: "Deep dive into the Law of Demeter (LoD) / Principle of Least Knowledge. Covers what LoD is, method chaining violations, the Tell-Don't-Ask principle, and how to refactor to comply, with examples in Python and Java."
keywords: "Law of Demeter, Principle of Least Knowledge, Tell Don't Ask, coupling, object-oriented design, method chaining, LoD, clean code, SOLID, VR-Rathod, Code-Note"
displayTitle: Law of Demeter
treeTitle: DSA - OOP - Law of Demeter
---

> [!info] What is the Law of Demeter?
> The **Law of Demeter (LoD)**, also called the **Principle of Least Knowledge**, states that an object should **only talk to its immediate friends** — it should not reach into the internals of other objects to interact with their internal parts. Informally: **"Only talk to your friends, not to strangers."**

- # Explanation
  collapsed:: true
	- ## The Rule
	  collapsed:: true
		- A method `M` of object `O` may only call methods on:
		- ```
		  ✅ Allowed:
		  1. The object itself (self / this)
		  2. Objects passed as parameters to M
		  3. Objects created/instantiated inside M
		  4. Direct attributes/components of O (objects O directly holds)
		  
		  ❌ Not allowed:
		  5. Objects returned from calling a method on another object
		     (the "chain" — a.getB().getC().doSomething())
		  ```
	-
	- ## Real-World Analogy
	  collapsed:: true
		- If you want your **wallet** 👛 from your jacket pocket, you **ask your friend** to grab their own wallet. You don't reach into your friend's pocket, pull out their wallet, open it, and take their card. That's invasive and tightly couples you to the internal structure of your friend's pocket.
		- **Violation**: `customer.getWallet().getCard().charge(100)` — you're navigating through the customer's wallet to charge a card.
		- **LoD fix**: `customer.makePayment(100)` — the customer handles their own payment internally.
	-
	- ## The Train Wreck Problem
	  collapsed:: true
		- ```python
		  # ❌ Law of Demeter violation — "train wreck"
		  # You're navigating through 4 levels of objects:
		  discount = order.getCustomer().getMembership().getDiscount().getPercentage()
		  #          ^1 friend     ^stranger   ^stranger    ^stranger
		  
		  # Problems:
		  # - If Membership changes its structure, this breaks
		  # - If Customer.getMembership() returns None, this crashes
		  # - order knows too much about Customer → Membership → Discount internals
		  
		  # ✅ LoD fix — delegate through each layer
		  discount = order.getDiscountPercentage()
		  # order asks customer, customer asks membership, membership asks discount
		  # Each object only talks to its immediate friend
		  ```
- # Tell, Don't Ask
  collapsed:: true
	- The **Tell, Don't Ask** principle is closely related to LoD — instead of asking an object for its data to make a decision, **tell the object to make the decision itself**.
	- ```python
	  # ❌ Asking (violation)
	  if employee.getSalary() > 50000:
	      employee.setSalary(employee.getSalary() * 1.10)
	  
	  # ✅ Telling (LoD-compliant)
	  employee.giveRaise(10)  # employee decides how to apply the raise
	  ```
- # Implementation
  collapsed:: true
	- > [!note] Refactoring an order system from LoD-violating code to compliant code.
	  > Languages: [[Python]] · [[Java]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python — Law of Demeter refactoring ─────────────────────────────
	  from dataclasses import dataclass, field
	  from decimal import Decimal
	  
	  
	  # ── Domain objects ────────────────────────────────────
	  @dataclass
	  class Address:
	      street: str
	      city: str
	      country: str
	      zip_code: str
	  
	      # LoD: expose what's needed, not the object itself
	      def is_international(self) -> bool:
	          return self.country != "US"
	  
	      def format_shipping_label(self) -> str:
	          return f"{self.street}, {self.city}, {self.zip_code}, {self.country}"
	  
	  
	  @dataclass
	  class Membership:
	      level: str  # "basic" | "silver" | "gold" | "platinum"
	      _discount_rates: dict = field(default_factory=lambda: {
	          "basic": Decimal("0.00"),
	          "silver": Decimal("0.05"),
	          "gold": Decimal("0.10"),
	          "platinum": Decimal("0.20"),
	      }, repr=False)
	  
	      # LoD: expose the result, not the internal structure
	      def get_discount_rate(self) -> Decimal:
	          return self._discount_rates.get(self.level, Decimal("0.00"))
	  
	      def is_premium(self) -> bool:
	          return self.level in ("gold", "platinum")
	  
	  
	  @dataclass
	  class Customer:
	      name: str
	      email: str
	      address: Address
	      membership: Membership
	  
	      # LoD: delegate — Customer exposes what callers need
	      def get_discount_rate(self) -> Decimal:
	          return self.membership.get_discount_rate()  # delegates to membership
	  
	      def is_premium_member(self) -> bool:
	          return self.membership.is_premium()
	  
	      def get_shipping_label(self) -> str:
	          return self.address.format_shipping_label()  # delegates to address
	  
	      def is_international_shipping(self) -> bool:
	          return self.address.is_international()
	  
	  
	  @dataclass
	  class Order:
	      customer: Customer
	      items: list[tuple[str, Decimal]]  # (name, price)
	  
	      def subtotal(self) -> Decimal:
	          return sum(price for _, price in self.items)
	  
	      # LoD: delegate discount lookup to Customer, not navigate deep
	      def apply_discount(self) -> Decimal:
	          rate = self.customer.get_discount_rate()  # ✅ only one level deep
	          return self.subtotal() * (1 - rate)
	  
	      def shipping_label(self) -> str:
	          return self.customer.get_shipping_label()  # ✅ one level deep
	  
	      def needs_international_shipping(self) -> bool:
	          return self.customer.is_international_shipping()
	  
	  
	  # ❌ LOD violations to show what we avoided:
	  # order.customer.membership.get_discount_rate()  ← 3 levels deep
	  # order.customer.address.country != "US"         ← 2 levels deep
	  
	  # ✅ LOD-compliant usage:
	  addr = Address("123 Main St", "New York", "US", "10001")
	  mem = Membership("gold")
	  cust = Customer("Alice", "alice@ex.com", addr, mem)
	  order = Order(cust, [("Widget", Decimal("50")), ("Gadget", Decimal("30"))])
	  
	  print(f"Subtotal: ${order.subtotal()}")
	  print(f"After discount: ${order.apply_discount():.2f}")  # 10% off → $72.00
	  print(f"Ship to: {order.shipping_label()}")
	  print(f"International: {order.needs_international_shipping()}")  # False
	  ```
	  
	  ```java
	  // ─── Java — Law of Demeter refactoring ───────────────────────────────
	  import java.math.BigDecimal;
	  
	  class Address {
	      private String street, city, country, zip;
	      Address(String street, String city, String country, String zip) {
	          this.street = street; this.city = city; this.country = country; this.zip = zip;
	      }
	      // LoD: expose behaviour, not internals
	      boolean isInternational() { return !"US".equals(country); }
	      String formatLabel() { return street + ", " + city + ", " + zip + ", " + country; }
	  }
	  
	  class Membership {
	      private String level;
	      Membership(String level) { this.level = level; }
	      // LoD: expose result directly
	      BigDecimal getDiscountRate() {
	          return switch (level) {
	              case "gold" -> new BigDecimal("0.10");
	              case "platinum" -> new BigDecimal("0.20");
	              case "silver" -> new BigDecimal("0.05");
	              default -> BigDecimal.ZERO;
	          };
	      }
	      boolean isPremium() { return level.equals("gold") || level.equals("platinum"); }
	  }
	  
	  class Customer {
	      private String name;
	      private Address address;
	      private Membership membership;
	  
	      Customer(String name, Address addr, Membership mem) {
	          this.name = name; this.address = addr; this.membership = mem;
	      }
	      // LoD: delegate — don't expose internals
	      BigDecimal getDiscountRate() { return membership.getDiscountRate(); }
	      boolean isPremiumMember() { return membership.isPremium(); }
	      String getShippingLabel() { return address.formatLabel(); }
	      boolean isInternationalShipping() { return address.isInternational(); }
	  }
	  
	  class Order {
	      private Customer customer;
	      private BigDecimal subtotal;
	  
	      Order(Customer customer, BigDecimal subtotal) {
	          this.customer = customer; this.subtotal = subtotal;
	      }
	  
	      // ✅ Only one level deep — LoD compliant
	      BigDecimal applyDiscount() {
	          BigDecimal rate = customer.getDiscountRate();
	          return subtotal.multiply(BigDecimal.ONE.subtract(rate));
	      }
	  
	      String shippingLabel() { return customer.getShippingLabel(); }
	      boolean needsInternational() { return customer.isInternationalShipping(); }
	  
	      public static void main(String[] args) {
	          var addr = new Address("123 Main St", "NY", "US", "10001");
	          var mem = new Membership("gold");
	          var cust = new Customer("Alice", addr, mem);
	          var order = new Order(cust, new BigDecimal("80"));
	  
	          System.out.println("After discount: $" + order.applyDiscount());  // $72.00
	          System.out.println("Ship to: " + order.shippingLabel());
	          System.out.println("International: " + order.needsInternational());
	      }
	  }
	  ```
	  
	  :::
- # Key Takeaways
  collapsed:: true
	- **"Only talk to your immediate friends"** — don't navigate deep into object graphs.
	- `a.getB().getC().doX()` is a violation — you're depending on B's internal structure changing.
	- **Fix**: Add a method to B that does the navigation internally, then call `a.doXViaB()`.
	- Related pattern: **Tell, Don't Ask** — tell objects what to do; don't ask for data to decide externally.
	- Reduces **coupling** — code depends on fewer classes, making changes safer.
	- Related principles: [[Loose Coupling and High Cohesion]], [[DRY Principle]]
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Martin Fowler — Tell Don't Ask](https://martinfowler.com/bliki/TellDontAsk.html)
		- [Law of Demeter — Wikipedia](https://en.wikipedia.org/wiki/Law_of_Demeter)