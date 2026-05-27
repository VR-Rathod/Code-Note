---
seoTitle: Builder Pattern in OOP – Complete In-Depth Guide | Creational Design Pattern
description: "Deep dive into the Builder design pattern. Covers step-by-step object construction, fluent interface, Director vs. Builder, telescoping constructor problem, and examples in Python, C++, Java, JavaScript, and C#."
keywords: "builder pattern, creational design pattern, fluent interface, director, telescoping constructor, GoF, Python builder, Java builder, C++ builder, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Builder Pattern
---

> [!info] What is the [[Builder Pattern]]?
> The **Builder Pattern** is a **creational design pattern** that constructs **complex objects step by step**. It separates the construction process from the final representation, so the same construction process can create different representations. It solves the **telescoping constructor problem** — objects with many optional parameters become unreadable with just constructors.

- # Explanation
  collapsed:: true
	- ## The Problem It Solves — Telescoping Constructor
	  collapsed:: true
		- ```python
		  # ❌ Telescoping Constructor Anti-Pattern
		  # As options grow, constructor calls become unreadable:
		  
		  server = Server("localhost", 8080, True, False, None, 30, 10, "gzip", True, None)
		  #                   host   port  ssl  debug cert timeout retries encoding ipv6 proxy
		  # What does True mean? What does 10 mean? → Unreadable!
		  
		  # ✅ Builder: readable, explicit, optional
		  server = ServerBuilder("localhost").port(8080).ssl(True).timeout(30).build()
		  ```
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **custom burger order** 🍔:
		  - You don't shout the full order at once: `Burger(bun, beef, lettuce, tomato, no_cheese, extra_sauce)`
		  - Instead you build it step by step: "Add bun. Add beef. Add lettuce. No cheese. Extra sauce please."
		  - The cashier (Director) guides the process. The kitchen (Builder) assembles it.
		  - Result: exactly the burger you wanted, step by step, readable and flexible.
	-
	- ## UML Structure
	  collapsed:: true
		- ```mermaid
		  classDiagram
		      class Director {
		          -builder: Builder
		          +setBuilder(b: Builder)
		          +constructMinimal()
		          +constructFull()
		      }
		      class Builder {
		          <<interface>>
		          +reset()
		          +setPartA()
		          +setPartB()
		          +setPartC()
		          +getResult()
		      }
		      class ConcreteBuilder {
		          -product: Product
		          +reset()
		          +setPartA()
		          +setPartB()
		          +setPartC()
		          +getResult() Product
		      }
		      class Product {
		          +partA
		          +partB
		          +partC
		      }
		      Director o--> Builder : uses
		      Builder <|.. ConcreteBuilder
		      ConcreteBuilder --> Product : builds
		  ```

- # Implementation
  collapsed:: true
	- > [!note] Building an HTTP Request object with optional headers, body, auth, timeout. Classic real-world builder use case.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  from dataclasses import dataclass, field
	  from typing import Optional
	  
	  # ── Product ─────────────────────────────────────────────────────────
	  @dataclass
	  class HttpRequest:
	      method: str
	      url: str
	      headers: dict[str, str] = field(default_factory=dict)
	      body: Optional[str] = None
	      timeout: int = 30
	      auth_token: Optional[str] = None
	      retries: int = 3
	      verify_ssl: bool = True
	  
	      def __str__(self) -> str:
	          lines = [f"{self.method} {self.url}", f"Timeout: {self.timeout}s"]
	          if self.auth_token: lines.append(f"Auth: Bearer {self.auth_token[:8]}...")
	          if self.headers:    lines.append(f"Headers: {self.headers}")
	          if self.body:       lines.append(f"Body: {self.body[:50]}...")
	          return " | ".join(lines)
	  
	  # ── Builder ─────────────────────────────────────────────────────────
	  class HttpRequestBuilder:
	      def __init__(self, method: str, url: str):
	          self._method = method
	          self._url = url
	          self._headers: dict[str, str] = {}
	          self._body: Optional[str] = None
	          self._timeout: int = 30
	          self._auth_token: Optional[str] = None
	          self._retries: int = 3
	          self._verify_ssl: bool = True
	  
	      # Fluent interface — each method returns self for chaining
	      def header(self, key: str, value: str) -> "HttpRequestBuilder":
	          self._headers[key] = value
	          return self
	  
	      def body(self, data: str) -> "HttpRequestBuilder":
	          self._body = data
	          return self
	  
	      def timeout(self, seconds: int) -> "HttpRequestBuilder":
	          self._timeout = seconds
	          return self
	  
	      def auth_token(self, token: str) -> "HttpRequestBuilder":
	          self._auth_token = token
	          return self
	  
	      def retries(self, count: int) -> "HttpRequestBuilder":
	          self._retries = count
	          return self
	  
	      def no_ssl_verify(self) -> "HttpRequestBuilder":
	          self._verify_ssl = False
	          return self
	  
	      def build(self) -> HttpRequest:
	          return HttpRequest(
	              method=self._method,
	              url=self._url,
	              headers=self._headers,
	              body=self._body,
	              timeout=self._timeout,
	              auth_token=self._auth_token,
	              retries=self._retries,
	              verify_ssl=self._verify_ssl,
	          )
	  
	  # ── Director ─────────────────────────────────────────────────────────
	  class ApiRequestDirector:
	      """Pre-defined construction recipes for common request types."""
	      @staticmethod
	      def build_json_post(url: str, body: str, token: str) -> HttpRequest:
	          return (HttpRequestBuilder("POST", url)
	                  .header("Content-Type", "application/json")
	                  .header("Accept", "application/json")
	                  .auth_token(token)
	                  .body(body)
	                  .timeout(60)
	                  .retries(3)
	                  .build())
	  
	      @staticmethod
	      def build_health_check(url: str) -> HttpRequest:
	          return (HttpRequestBuilder("GET", url)
	                  .timeout(5)
	                  .retries(1)
	                  .build())
	  
	  # ── Client ─────────────────────────────────────────────────────────
	  # Direct builder usage
	  req1 = (HttpRequestBuilder("GET", "https://api.example.com/users")
	          .header("Accept", "application/json")
	          .auth_token("abc123xyz")
	          .timeout(15)
	          .build())
	  
	  print(req1)
	  
	  # Using Director for common patterns
	  req2 = ApiRequestDirector.build_json_post(
	      "https://api.example.com/data",
	      '{"name": "Alice"}',
	      "mytoken123"
	  )
	  print(req2)
	  
	  health = ApiRequestDirector.build_health_check("https://api.example.com/health")
	  print(health)
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <map>
	  #include <optional>
	  
	  // ── Product ──────────────────────────────────────────────────────────
	  struct HttpRequest {
	      std::string method;
	      std::string url;
	      std::map<std::string, std::string> headers;
	      std::optional<std::string> body;
	      int timeout    = 30;
	      int retries    = 3;
	      bool verifySsl = true;
	      std::optional<std::string> authToken;
	  
	      void print() const {
	          std::cout << method << " " << url
	                    << " | Timeout: " << timeout << "s\n";
	          for (const auto& [k, v] : headers)
	              std::cout << "  " << k << ": " << v << "\n";
	      }
	  };
	  
	  // ── Builder ──────────────────────────────────────────────────────────
	  class HttpRequestBuilder {
	      HttpRequest req_;
	  public:
	      HttpRequestBuilder(std::string method, std::string url) {
	          req_.method = std::move(method);
	          req_.url    = std::move(url);
	      }
	  
	      HttpRequestBuilder& header(std::string key, std::string val) {
	          req_.headers[std::move(key)] = std::move(val);
	          return *this;
	      }
	  
	      HttpRequestBuilder& body(std::string data) {
	          req_.body = std::move(data);
	          return *this;
	      }
	  
	      HttpRequestBuilder& timeout(int seconds) {
	          req_.timeout = seconds;
	          return *this;
	      }
	  
	      HttpRequestBuilder& authToken(std::string token) {
	          req_.authToken = std::move(token);
	          return *this;
	      }
	  
	      HttpRequestBuilder& retries(int count) {
	          req_.retries = count;
	          return *this;
	      }
	  
	      HttpRequest build() { return req_; }
	  };
	  
	  int main() {
	      HttpRequest req = HttpRequestBuilder("POST", "https://api.example.com/data")
	          .header("Content-Type", "application/json")
	          .header("Accept", "application/json")
	          .authToken("mytoken123")
	          .body("{\"name\": \"Alice\"}")
	          .timeout(60)
	          .retries(3)
	          .build();
	  
	      req.print();
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  // ── Product ───────────────────────────────────────────────────────────
	  class HttpRequest {
	      private final String method;
	      private final String url;
	      private final Map<String, String> headers;
	      private final String body;
	      private final int timeout;
	      private final int retries;
	      private final String authToken;
	  
	      private HttpRequest(Builder b) {
	          this.method    = b.method;
	          this.url       = b.url;
	          this.headers   = Collections.unmodifiableMap(b.headers);
	          this.body      = b.body;
	          this.timeout   = b.timeout;
	          this.retries   = b.retries;
	          this.authToken = b.authToken;
	      }
	  
	      @Override public String toString() {
	          return method + " " + url + " | timeout=" + timeout + "s | retries=" + retries;
	      }
	  
	      // ── Static Inner Builder (Java idiom) ────────────────────────────
	      static class Builder {
	          private final String method, url;
	          private Map<String, String> headers = new LinkedHashMap<>();
	          private String body, authToken;
	          private int timeout = 30, retries = 3;
	  
	          Builder(String method, String url) {
	              this.method = method;
	              this.url    = url;
	          }
	  
	          Builder header(String key, String value) { headers.put(key, value); return this; }
	          Builder body(String data)                { body = data;             return this; }
	          Builder timeout(int secs)               { timeout = secs;          return this; }
	          Builder authToken(String token)         { authToken = token;       return this; }
	          Builder retries(int count)              { retries = count;         return this; }
	          HttpRequest build()                     { return new HttpRequest(this); }
	      }
	  }
	  
	  class BuilderDemo {
	      public static void main(String[] args) {
	          HttpRequest req = new HttpRequest.Builder("POST", "https://api.example.com/data")
	              .header("Content-Type", "application/json")
	              .authToken("mytoken123")
	              .body("{\"name\": \"Alice\"}")
	              .timeout(60)
	              .retries(3)
	              .build();
	  
	          System.out.println(req);
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  class HttpRequest {
	      constructor({ method, url, headers, body, timeout, retries, authToken }) {
	          Object.assign(this, { method, url, headers, body, timeout, retries, authToken });
	      }
	      toString() {
	          return `${this.method} ${this.url} | timeout=${this.timeout}s | retries=${this.retries}`;
	      }
	  }
	  
	  class HttpRequestBuilder {
	      constructor(method, url) {
	          this._method    = method;
	          this._url       = url;
	          this._headers   = {};
	          this._body      = null;
	          this._timeout   = 30;
	          this._retries   = 3;
	          this._authToken = null;
	      }
	  
	      header(key, value)  { this._headers[key] = value; return this; }
	      body(data)          { this._body = data;          return this; }
	      timeout(secs)       { this._timeout = secs;       return this; }
	      authToken(token)    { this._authToken = token;    return this; }
	      retries(count)      { this._retries = count;      return this; }
	  
	      build() {
	          return new HttpRequest({
	              method:    this._method,
	              url:       this._url,
	              headers:   this._headers,
	              body:      this._body,
	              timeout:   this._timeout,
	              retries:   this._retries,
	              authToken: this._authToken,
	          });
	      }
	  }
	  
	  const req = new HttpRequestBuilder("POST", "https://api.example.com/data")
	      .header("Content-Type", "application/json")
	      .authToken("mytoken123")
	      .body(JSON.stringify({ name: "Alice" }))
	      .timeout(60)
	      .retries(3)
	      .build();
	  
	  console.log(req.toString());
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  using System.Text;
	  
	  record HttpRequest(
	      string Method, string Url,
	      Dictionary<string, string> Headers,
	      string? Body, int Timeout, int Retries, string? AuthToken
	  ) {
	      public override string ToString() =>
	          $"{Method} {Url} | timeout={Timeout}s | retries={Retries}";
	  }
	  
	  class HttpRequestBuilder {
	      readonly string method, url;
	      Dictionary<string, string> headers = new();
	      string? body, authToken;
	      int timeout = 30, retries = 3;
	  
	      public HttpRequestBuilder(string method, string url) {
	          this.method = method; this.url = url;
	      }
	  
	      public HttpRequestBuilder Header(string key, string val) { headers[key] = val; return this; }
	      public HttpRequestBuilder Body(string data)              { body = data;         return this; }
	      public HttpRequestBuilder Timeout(int secs)              { timeout = secs;      return this; }
	      public HttpRequestBuilder AuthToken(string token)        { authToken = token;   return this; }
	      public HttpRequestBuilder Retries(int count)             { retries = count;     return this; }
	  
	      public HttpRequest Build() => new(method, url, headers, body, timeout, retries, authToken);
	  
	      static void Main() {
	          var req = new HttpRequestBuilder("POST", "https://api.example.com/data")
	              .Header("Content-Type", "application/json")
	              .AuthToken("mytoken123")
	              .Body("{\"name\": \"Alice\"}")
	              .Timeout(60)
	              .Retries(3)
	              .Build();
	  
	          Console.WriteLine(req);
	      }
	  }
	  ```
	  
	  :::

- # When to Use
  collapsed:: true
	- ## ✅ Use Builder When:
		- Objects have many optional parameters (5+ constructor arguments is a code smell).
		- The construction process involves multiple steps.
		- You need to build different representations of the same object (e.g., minimal config vs. full config).
		- You want **readable, self-documenting** object creation.
	- ## ❌ Avoid When:
		- Objects are simple — just use a constructor or named arguments.
		- All fields are required — a constructor is cleaner.

- # Key Takeaways
  collapsed:: true
	- Solves the **telescoping constructor** problem — no more unreadable parameter lists.
	- **Fluent interface** (method chaining) makes construction readable and explicit.
	- The **Director** is optional — it encodes pre-defined construction recipes.
	- Builder separates **what** is built from **how** it's built — improves testability.
	- Related patterns: [[Factory Pattern]], [[Abstract Factory Pattern]], [[Prototype Pattern]]

- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Refactoring Guru — Builder](https://refactoring.guru/design-patterns/builder)
		- [GoF Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
