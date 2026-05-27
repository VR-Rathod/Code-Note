---
seoTitle: Single Responsibility Principle (SRP) – Complete Guide | SOLID, One Reason to Change
description: "Deep dive into the Single Responsibility Principle (SRP) from SOLID. Covers what SRP means, why God classes are bad, how to identify violations, and refactoring to SRP-compliant designs with examples in Python, Java, and JavaScript."
keywords: "Single Responsibility Principle, SRP, SOLID, one reason to change, God class, separation of concerns, clean architecture, Python SRP, Java SRP, VR-Rathod, Code-Note"
displayTitle: Single Responsibility Principle (SRP)
---

> [!info] What is the Single Responsibility Principle?
> The **Single Responsibility Principle (SRP)** — the **S** in [[SOLID]] — states that **a class should have only one reason to change**. This means a class should do **one thing and do it well**. If a class handles multiple concerns (data, persistence, rendering, email sending), then changes to any of those concerns force changes to the class.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- A **Swiss Army knife** 🔧 is great for camping survival, but you wouldn't use it as your primary tool in a professional kitchen. A chef uses a dedicated chef's knife, a dedicated peeler, a dedicated bread knife — each tool does one thing extremely well. When the bread knife breaks, you only replace the bread knife, not the whole Swiss Army knife.
		- In code: if a class handles 5 concerns, a change in **any one** of them risks breaking the other 4.
	-
	- ## What "Reason to Change" Means
	  collapsed:: true
		- A "reason to change" = a **stakeholder or actor** who can demand a change to that class:
		- ```
		  class UserManager:             ← Has 4 reasons to change!
		      def create_user()          ← Business rules team
		      def save_to_database()     ← DB team / DBA
		      def send_welcome_email()   ← Marketing team
		      def generate_report()      ← Reporting team
		  
		  If marketing changes email format → we touch UserManager
		  If DBA changes schema → we touch UserManager
		  If business changes validation → we touch UserManager
		  If reporting changes format → we touch UserManager
		  
		  Every change = risk of breaking the other 3 concerns!
		  ```
	-
	- ## The God Class Anti-Pattern
	  collapsed:: true
		- SRP violations often appear as **God Classes** — classes that know and do too much:
		- | God Class Signs | SRP Solution |
		  |---|---|
		  | >500 lines | Split into multiple focused classes |
		  | Method names from different domains (save, email, render, validate) | Separate by domain/concern |
		  | Many different imports (DB, email, HTTP, file IO) | Separate by infrastructure concern |
		  | Hard to unit test without mocking 10 things | Each class = testable in isolation |

- # Before & After
  collapsed:: true
	- ```python
	  # ❌ SRP Violation — UserManager does EVERYTHING
	  class UserManager:
	      def create_user(self, name: str, email: str) -> dict:
	          user = {"name": name, "email": email}
	          # Validation
	          if "@" not in email: raise ValueError("Bad email")
	          # Persistence
	          self._db.save("users", user)
	          # Email
	          self._email_service.send(email, "Welcome!", f"Hello {name}")
	          # Logging
	          self._logger.info(f"User created: {email}")
	          # Report
	          self._reporter.add_event("user_created", email)
	          return user
	  
	  # 4 reasons to change: DB changes, email changes, logging changes, report changes
	  
	  
	  # ✅ SRP — Each class has ONE reason to change
	  class UserValidator:
	      """One reason to change: business rules for user validity."""
	      def validate(self, name: str, email: str) -> None:
	          if not name.strip(): raise ValueError("Name required")
	          if "@" not in email: raise ValueError("Invalid email")
	  
	  class UserRepository:
	      """One reason to change: database schema or storage mechanism."""
	      def __init__(self, db): self.db = db
	      def save(self, user: dict) -> None: self.db.save("users", user)
	      def find_by_email(self, email: str) -> dict: return self.db.find("users", email=email)
	  
	  class UserEmailService:
	      """One reason to change: email templates or provider."""
	      def __init__(self, mailer): self.mailer = mailer
	      def send_welcome(self, name: str, email: str) -> None:
	          self.mailer.send(email, "Welcome!", f"Hello {name}!")
	  
	  class UserService:
	      """Orchestrates — one reason to change: user creation workflow."""
	      def __init__(self, validator, repo, emailer):
	          self.validator = validator
	          self.repo = repo
	          self.emailer = emailer
	  
	      def create_user(self, name: str, email: str) -> dict:
	          self.validator.validate(name, email)
	          user = {"name": name, "email": email}
	          self.repo.save(user)
	          self.emailer.send_welcome(name, email)
	          return user
	  ```

- # Implementation
  collapsed:: true
	- > [!note] Applying SRP to a report generation system — splitting data retrieval, formatting, and export into separate classes.
	  > Languages: [[Python]] · [[Java]] · [[Java Script]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python — SRP applied to Report Generation ───────────────────────
	  from dataclasses import dataclass
	  from datetime import date
	  import csv
	  import json
	  
	  @dataclass
	  class SalesRecord:
	      product: str
	      quantity: int
	      price: float
	      sale_date: date
	  
	  # ── SRP Class 1: Fetch/aggregate data ─────────────────────────────────
	  class SalesDataService:
	      """One reason to change: data source or aggregation logic changes."""
	      def __init__(self, db):
	          self.db = db
	  
	      def get_sales(self, from_date: date, to_date: date) -> list[SalesRecord]:
	          return self.db.query("sales", from_date=from_date, to_date=to_date)
	  
	      def get_total(self, records: list[SalesRecord]) -> float:
	          return sum(r.quantity * r.price for r in records)
	  
	  # ── SRP Class 2: Format data ───────────────────────────────────────────
	  class SalesReportFormatter:
	      """One reason to change: report format or structure changes."""
	      def format_as_text(self, records: list[SalesRecord], total: float) -> str:
	          lines = [f"{'Product':<20} {'Qty':>5} {'Price':>10} {'Total':>12}"]
	          lines.append("-" * 50)
	          for r in records:
	              lines.append(f"{r.product:<20} {r.quantity:>5} ${r.price:>9.2f} ${r.quantity*r.price:>11.2f}")
	          lines.append("-" * 50)
	          lines.append(f"{'TOTAL':>37}: ${total:>11.2f}")
	          return "\n".join(lines)
	  
	      def format_as_dict(self, records: list[SalesRecord], total: float) -> dict:
	          return {
	              "records": [{"product": r.product, "qty": r.quantity, "price": r.price} for r in records],
	              "total": total
	          }
	  
	  # ── SRP Class 3: Export/persist ────────────────────────────────────────
	  class SalesReportExporter:
	      """One reason to change: export mechanism or destination changes."""
	      def export_to_csv(self, records: list[SalesRecord], filepath: str) -> None:
	          with open(filepath, "w", newline="") as f:
	              writer = csv.writer(f)
	              writer.writerow(["Product", "Quantity", "Price", "Date"])
	              for r in records:
	                  writer.writerow([r.product, r.quantity, r.price, r.sale_date])
	          print(f"Exported to {filepath}")
	  
	      def export_to_json(self, data: dict, filepath: str) -> None:
	          with open(filepath, "w") as f:
	              json.dump(data, f, indent=2)
	  
	  # ── Orchestrator: uses all three ───────────────────────────────────────
	  class ReportController:
	      def __init__(self, data_svc: SalesDataService,
	                   formatter: SalesReportFormatter,
	                   exporter: SalesReportExporter):
	          self.data_svc = data_svc
	          self.formatter = formatter
	          self.exporter = exporter
	  
	      def generate_monthly_report(self, year: int, month: int) -> str:
	          from_date = date(year, month, 1)
	          to_date = date(year, month, 28)
	          records = self.data_svc.get_sales(from_date, to_date)
	          total = self.data_svc.get_total(records)
	          return self.formatter.format_as_text(records, total)
	  ```
	  
	  ```java
	  // ─── Java — SRP in a notification system ─────────────────────────────
	  
	  // Each class has ONE reason to change:
	  
	  // 1. Template building (Marketing team)
	  class NotificationTemplate {
	      private String subject, body;
	      NotificationTemplate(String subject, String body) {
	          this.subject = subject; this.body = body;
	      }
	      String render(String recipientName) {
	          return body.replace("{{name}}", recipientName);
	      }
	      String getSubject() { return subject; }
	  }
	  
	  // 2. Sending logic (Infrastructure team)
	  class EmailSender {
	      public void send(String toEmail, String subject, String body) {
	          System.out.println("Sending email to " + toEmail + ": " + subject);
	          // SMTP logic here
	      }
	  }
	  
	  // 3. Recipient lookup (DB team)
	  class RecipientService {
	      public String getEmail(int userId) {
	          return "user" + userId + "@example.com";  // DB lookup
	      }
	      public String getName(int userId) {
	          return "User" + userId;
	      }
	  }
	  
	  // 4. Orchestrator (Product team — workflow)
	  class NotificationService {
	      private NotificationTemplate template;
	      private EmailSender sender;
	      private RecipientService recipientService;
	  
	      NotificationService(NotificationTemplate t, EmailSender s, RecipientService r) {
	          this.template = t; this.sender = s; this.recipientService = r;
	      }
	  
	      public void notifyUser(int userId) {
	          String email = recipientService.getEmail(userId);
	          String name = recipientService.getName(userId);
	          String body = template.render(name);
	          sender.send(email, template.getSubject(), body);
	      }
	  }
	  
	  class SRPDemo {
	      public static void main(String[] args) {
	          var template = new NotificationTemplate("Welcome!", "Hello {{name}}, welcome aboard!");
	          var sender = new EmailSender();
	          var recipients = new RecipientService();
	          var notifier = new NotificationService(template, sender, recipients);
	          notifier.notifyUser(42);
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript — SRP in data processing ─────────────────────────────
	  
	  // 1. Fetching (API/data concern)
	  class DataFetcher {
	      async fetchUsers() {
	          // In production: return fetch('/api/users').then(r => r.json())
	          return [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
	      }
	  }
	  
	  // 2. Processing/transformation (business logic concern)
	  class UserProcessor {
	      enrichUsers(users) {
	          return users.map(u => ({
	              ...u,
	              displayName: u.name.toUpperCase(),
	              slug: u.name.toLowerCase().replace(' ', '-'),
	          }));
	      }
	  
	      filterActiveUsers(users) {
	          return users.filter(u => u.id > 0);  // simplified
	      }
	  }
	  
	  // 3. Rendering (presentation concern)
	  class UserRenderer {
	      renderList(users) {
	          return users.map(u =>
	              `<li id="user-${u.id}">${u.displayName}</li>`
	          ).join('\n');
	      }
	  
	      renderCount(users) {
	          return `Total: ${users.length} users`;
	      }
	  }
	  
	  // 4. Orchestrator (workflow concern)
	  class UserController {
	      constructor(fetcher, processor, renderer) {
	          this.fetcher = fetcher;
	          this.processor = processor;
	          this.renderer = renderer;
	      }
	  
	      async display() {
	          const raw = await this.fetcher.fetchUsers();
	          const enriched = this.processor.enrichUsers(raw);
	          const active = this.processor.filterActiveUsers(enriched);
	          console.log(this.renderer.renderList(active));
	          console.log(this.renderer.renderCount(active));
	      }
	  }
	  
	  const controller = new UserController(
	      new DataFetcher(), new UserProcessor(), new UserRenderer()
	  );
	  controller.display();
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- **One class = one reason to change** — one actor, one concern.
	- SRP reduces coupling: changes in one area don't cascade into unrelated code.
	- Easier to **test** — small, focused classes are trivially mockable.
	- Watch out for **God classes** — if a class has >5 different types of methods, it likely violates SRP.
	- Use **dependency injection** and **composition** to wire SRP-compliant classes together.

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Martin Fowler — Single Responsibility](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html)
		- [Refactoring Guru — SRP](https://refactoring.guru/refactoring/smells/couplers)
