---
date: 2026-04-04T13:53:48+05:30
lastmod: 2026-05-18T10:12:55+05:30

seoTitle: QA & Software Testing Reference – Beginner to Advanced Guide
description: "Complete QA and software testing reference covering testing types, methodologies (TDD, BDD, Agile QA), tools (Selenium, Cypress, Playwright, Postman, JMeter), bug lifecycle, test planning, and automation frameworks."
keywords: "QA testing, software testing, test automation, Selenium, Cypress, Playwright, Postman, JMeter, TDD, BDD, unit testing, integration testing, E2E testing, performance testing, bug lifecycle, test plan, STLC, SDLC, QA engineer, quality assurance, VR-Rathod, Code-Note"
author: aashish rathod
---

- # QA & Software Testing
- **Quality Assurance (QA)** is the process of ensuring software meets requirements and works correctly before it reaches users. It spans manual testing, automation, performance, and process methodology.
-
- # What is QA vs QC vs Testing?
  collapsed:: true
	- ```
	  QA  (Quality Assurance)  — Process-oriented. Prevent defects. (How we build)
	  QC  (Quality Control)    — Product-oriented. Find defects. (What we built)
	  Testing                  — Execution-oriented. Verify behavior. (Does it work?)
	  
	  QA ⊃ QC ⊃ Testing
	  ```
-
- # SDLC & STLC
  collapsed:: true
	- ## SDLC (Software Development Life Cycle)
	  collapsed:: true
		- ```
		  1. Requirement Analysis
		  2. System Design
		  3. Implementation (Coding)
		  4. Testing
		  5. Deployment
		  6. Maintenance
		  
		  Models: Waterfall, Agile, Scrum, Kanban, V-Model, Spiral
		  ```
	-
	- ## STLC (Software Testing Life Cycle)
	  collapsed:: true
		- ```
		  1. Requirement Analysis   — Understand what to test
		  2. Test Planning          — Scope, resources, schedule, risk
		  3. Test Case Design       — Write test cases & test data
		  4. Test Environment Setup — Servers, DBs, tools, configs
		  5. Test Execution         — Run tests, log results
		  6. Test Closure           — Report, lessons learned, sign-off
		  ```
	-
	- ## V-Model (Verification & Validation)
	  collapsed:: true
		- ```
		  Development Side          Testing Side
		  ─────────────────         ─────────────────
		  Requirements         ←→   Acceptance Testing
		  System Design        ←→   System Testing
		  Architecture Design  ←→   Integration Testing
		  Module Design        ←→   Unit Testing
		                ↓ Coding ↑
		  
		  Each dev phase has a corresponding test phase.
		  ```
-
- # Testing Types
  collapsed:: true
	- ## By Level
	  collapsed:: true
		- ```
		  Unit Testing        — Test individual functions/methods in isolation.
		                        Fast, cheap, developer-written.
		                        Tools: Jest, JUnit, pytest, NUnit, Vitest
		  
		  Integration Testing — Test how modules work together.
		                        DB + API, service-to-service, etc.
		                        Tools: Postman, REST Assured, Supertest
		  
		  System Testing      — Test the complete application end-to-end.
		                        Functional + non-functional.
		  
		  Acceptance Testing  — Validate against business requirements.
		                        UAT (User Acceptance Testing) — done by client/users.
		  ```
	-
	- ## By Approach
	  collapsed:: true
		- ```
		  Black Box Testing   — Tester has NO knowledge of internal code.
		                        Focus: inputs → expected outputs.
		  
		  White Box Testing   — Tester HAS full knowledge of code.
		                        Focus: code paths, branches, conditions.
		  
		  Grey Box Testing    — Partial knowledge. Mix of both.
		                        Common in integration and API testing.
		  ```
	-
	- ## By Purpose
	  collapsed:: true
		- ```
		  Functional Testing    — Does the feature work as expected?
		  Regression Testing    — Did new changes break existing features?
		  Smoke Testing         — Quick sanity check after a build. "Does it start?"
		  Sanity Testing        — Narrow check after a bug fix. "Is this fixed?"
		  Exploratory Testing   — Unscripted, creative testing to find edge cases.
		  Usability Testing     — Is the UI intuitive and user-friendly?
		  Compatibility Testing — Works across browsers, OS, devices?
		  Localization Testing  — Correct language, date, currency formats?
		  Accessibility Testing — Usable by people with disabilities? (WCAG)
		  Security Testing      — Vulnerabilities, auth flaws, injection attacks.
		  ```
	-
	- ## Non-Functional Testing
	  collapsed:: true
		- ```
		  Performance Testing   — How fast does it respond under load?
		  Load Testing          — Behavior under expected user load.
		  Stress Testing        — Behavior beyond normal capacity (breaking point).
		  Spike Testing         — Sudden burst of traffic.
		  Soak/Endurance Testing — Sustained load over long time (memory leaks).
		  Scalability Testing   — Can it scale up/down with demand?
		  Volume Testing        — Large amounts of data in DB.
		  
		  Tools: JMeter, k6, Gatling, Locust, Artillery
		  ```
-
- # Test Design Techniques
  collapsed:: true
	- ## Black Box Techniques
	  collapsed:: true
		- ```
		  Equivalence Partitioning:
		    Divide inputs into valid/invalid groups. Test one value per group.
		    Example: Age field (0-17 invalid, 18-65 valid, 66+ invalid)
		    Test: -1, 25, 70 → covers all partitions with 3 tests.
		  
		  Boundary Value Analysis (BVA):
		    Test at the edges of partitions.
		    Example: Age 18-65 → test 17, 18, 19, 64, 65, 66
		  
		  Decision Table Testing:
		    Map all combinations of conditions → actions.
		    Good for business rules with multiple conditions.
		  
		  State Transition Testing:
		    Model system as states + transitions.
		    Example: Login → Logged In → Idle → Timeout → Logged Out
		  
		  Use Case Testing:
		    Test based on user scenarios/flows.
		  ```
	-
	- ## White Box Techniques
	  collapsed:: true
		- ```
		  Statement Coverage   — Every line of code executed at least once.
		  Branch Coverage      — Every if/else branch taken.
		  Path Coverage        — Every possible execution path.
		  Condition Coverage   — Every boolean sub-expression true and false.
		  
		  MC/DC (Modified Condition/Decision Coverage) — Used in aviation/safety.
		  ```
-
- # Testing Methodologies
  collapsed:: true
	- ## TDD (Test-Driven Development)
	  collapsed:: true
		- ```
		  Red → Green → Refactor cycle:
		  
		  1. RED    — Write a failing test for new functionality
		  2. GREEN  — Write minimal code to make the test pass
		  3. REFACTOR — Clean up code without breaking tests
		  
		  Benefits:
		    - Forces clear requirements before coding
		    - Built-in regression safety net
		    - Leads to modular, testable code
		  
		  Tools: Jest (JS), pytest (Python), JUnit (Java), NUnit (C#)
		  ```
		- ```javascript
		  // TDD Example (Jest)
		  // 1. Write test first
		  test('adds two numbers', () => {
		    expect(add(2, 3)).toBe(5);  // FAILS — add() doesn't exist yet
		  });
		  
		  // 2. Write minimal implementation
		  function add(a, b) { return a + b; }
		  
		  // 3. Test passes → refactor if needed
		  ```
	-
	- ## BDD (Behavior-Driven Development)
	  collapsed:: true
		- ```
		  Write tests in plain English using Gherkin syntax.
		  Bridges gap between business and technical teams.
		  
		  Given — precondition / initial state
		  When  — action / event
		  Then  — expected outcome
		  And   — additional steps
		  
		  Tools: Cucumber (Java/JS), SpecFlow (.NET), Behave (Python), Playwright BDD
		  ```
		- ```gherkin
		  Feature: User Login
		  
		    Scenario: Successful login with valid credentials
		      Given the user is on the login page
		      When  the user enters valid username and password
		      And   clicks the Login button
		      Then  the user should be redirected to the dashboard
		      And   a welcome message should be displayed
		  
		    Scenario: Failed login with wrong password
		      Given the user is on the login page
		      When  the user enters valid username and wrong password
		      Then  an error message "Invalid credentials" should appear
		  ```
	-
	- ## ATDD (Acceptance Test-Driven Development)
	  collapsed:: true
		- ```
		  Like BDD but driven by acceptance criteria from stakeholders.
		  Tests written before development starts.
		  Whole team (dev + QA + business) writes acceptance tests together.
		  ```
	-
	- ## Agile QA
	  collapsed:: true
		- ```
		  QA is embedded in every sprint, not a separate phase.
		  
		  Agile Testing Quadrants:
		    Q1 (Automated, Dev-facing)  — Unit + Integration tests. TDD.
		    Q2 (Automated+Manual, Business-facing) — Functional, Story tests.
		    Q3 (Manual, Business-facing) — Exploratory, Usability, UAT.
		    Q4 (Tools, Non-functional)  — Performance, Security, Load.
		  
		  QA in Scrum:
		    - QA participates in sprint planning, refinement, retrospectives
		    - Definition of Done includes passing tests
		    - Shift-left: test early, test often
		  ```
-
- # Bug / Defect Lifecycle
  collapsed:: true
	- ## Bug States
	  collapsed:: true
		- ```
		  New        → Assigned → Open → Fixed → Retest → Closed
		                                       ↘ Reopen (if still failing)
		  
		  Other states:
		    Rejected   — Not a bug (by design, duplicate, invalid)
		    Deferred   — Valid bug, fixed in future release
		    Cannot Reproduce — Bug not reproducible
		  ```
	-
	- ## Bug Report Template
	  collapsed:: true
		- ```
		  Title:        [Short, clear description]
		  ID:           BUG-001
		  Severity:     Critical / High / Medium / Low
		  Priority:     P1 / P2 / P3 / P4
		  Status:       New
		  Environment:  Chrome 120, Windows 11, Staging
		  
		  Steps to Reproduce:
		    1. Go to login page
		    2. Enter valid email, wrong password
		    3. Click Login
		  
		  Expected Result: Error message "Invalid credentials" shown
		  Actual Result:   App crashes with 500 error
		  
		  Attachments: screenshot.png, console_log.txt
		  ```
	-
	- ## Severity vs Priority
	  collapsed:: true
		- ```
		  Severity — Impact on the system (technical)
		    Critical — App crash, data loss, security breach
		    High     — Major feature broken, no workaround
		    Medium   — Feature partially broken, workaround exists
		    Low      — Minor UI issue, typo
		  
		  Priority — How urgently it needs to be fixed (business)
		    P1 — Fix immediately (blocks release)
		    P2 — Fix in current sprint
		    P3 — Fix in next sprint
		    P4 — Fix when time allows
		  
		  High Severity + Low Priority: App crashes on unsupported browser
		  Low Severity + High Priority: CEO's name is misspelled on homepage
		  ```
-
- # Test Planning & Documentation
  collapsed:: true
	- ## Test Plan
	  collapsed:: true
		- ```
		  A document describing the testing approach for a project.
		  
		  Contents:
		    1. Scope          — What will/won't be tested
		    2. Objectives     — Goals of testing
		    3. Test Strategy  — Approach (manual, automated, tools)
		    4. Resources      — Team, environments, tools
		    5. Schedule       — Timeline, milestones
		    6. Risk & Mitigation
		    7. Entry/Exit Criteria
		  ```
	-
	- ## Test Case Structure
	  collapsed:: true
		- ```
		  Test Case ID:     TC-001
		  Module:           User Authentication
		  Title:            Login with valid credentials
		  Preconditions:    User account exists, app is running
		  
		  Steps:
		    1. Navigate to /login
		    2. Enter email: [email]
		    3. Enter password: [password]
		    4. Click "Login"
		  
		  Expected Result: Redirect to /dashboard, welcome message shown
		  Actual Result:   [filled during execution]
		  Status:          Pass / Fail / Blocked / Skip
		  Priority:        High
		  ```
	-
	- ## Test Coverage Metrics
	  collapsed:: true
		- ```
		  Requirements Coverage = (Tested Requirements / Total Requirements) × 100
		  Test Case Pass Rate   = (Passed / Total Executed) × 100
		  Defect Density        = Defects / KLOC (thousand lines of code)
		  Defect Removal Efficiency (DRE) = (Bugs found before release / Total bugs) × 100
		  
		  Good DRE target: > 95%
		  ```
-
- # Test Automation
  collapsed:: true
	- ## Automation Pyramid
	  collapsed:: true
		- ```
		              /‾‾‾‾‾‾‾‾‾‾‾‾‾\
		             /   E2E Tests    \   ← Few, slow, expensive
		            /─────────────────\
		           /  Integration Tests \  ← Some
		          /─────────────────────\
		         /      Unit Tests       \  ← Many, fast, cheap
		        /───────────────────────\
		  
		  Rule of thumb: 70% unit / 20% integration / 10% E2E
		  ```
	-
	- ## When to Automate
	  collapsed:: true
		- ```
		  Automate:
		    ✅ Regression tests (run every build)
		    ✅ Repetitive tests with many data combinations
		    ✅ Smoke/sanity tests
		    ✅ Performance/load tests
		    ✅ API tests
		  
		  Don't Automate:
		    ❌ One-time tests
		    ❌ Exploratory testing
		    ❌ Tests that change frequently
		    ❌ Usability / UX testing
		  ```
	-
	- ## Page Object Model (POM)
	  collapsed:: true
		- ```
		  Design pattern for UI automation.
		  Separate page structure (locators) from test logic.
		  
		  Benefits: Reusable, maintainable, readable tests.
		  ```
		- ```javascript
		  // Page Object
		  class LoginPage {
		    constructor(page) {
		      this.page = page;
		      this.emailInput    = page.locator('#email');
		      this.passwordInput = page.locator('#password');
		      this.loginButton   = page.locator('button[type="submit"]');
		    }
		  
		    async login(email, password) {
		      await this.emailInput.fill(email);
		      await this.passwordInput.fill(password);
		      await this.loginButton.click();
		    }
		  }
		  
		  // Test
		  test('valid login', async ({ page }) => {
		    const loginPage = new LoginPage(page);
		    await page.goto('/login');
		    await loginPage.login('[email]', '[password]');
		    await expect(page).toHaveURL('/dashboard');
		  });
		  ```
-
- # Testing Tools
  collapsed:: true
	- ## Unit Testing
	  collapsed:: true
		- ```
		  Jest        — JavaScript/TypeScript. Most popular. Built-in mocking.
		  Vitest      — Vite-native, Jest-compatible. Faster for modern JS.
		  Mocha+Chai  — Flexible JS testing. Mocha = runner, Chai = assertions.
		  pytest      — Python. Simple, powerful, great fixtures and plugins.
		  JUnit 5     — Java standard. Annotations, parameterized tests.
		  NUnit/xUnit — .NET/C# testing frameworks.
		  RSpec       — Ruby BDD-style testing.
		  ```
	-
	- ## E2E / UI Automation
	  collapsed:: true
		- ```
		  Playwright  — Microsoft. Multi-browser (Chrome, Firefox, Safari, Edge).
		               Auto-wait, network interception, trace viewer. Modern choice.
		  
		  Cypress     — JavaScript-only. Runs in browser. Great DX, time-travel debug.
		               Best for web apps. No multi-tab support.
		  
		  Selenium    — Language-agnostic (Java, Python, C#, JS). WebDriver protocol.
		               Industry standard. Slower but very flexible.
		  
		  Puppeteer   — Google. Chrome/Chromium only. Good for scraping + testing.
		  
		  WebdriverIO — Node.js. Supports Selenium + Appium. Mobile + web.
		  ```
		- ```javascript
		  // Playwright example
		  import { test, expect } from '@playwright/test';
		  
		  test('user can log in', async ({ page }) => {
		    await page.goto('https://example.com/login');
		    await page.fill('#email', '[email]');
		    await page.fill('#password', '[password]');
		    await page.click('button[type="submit"]');
		    await expect(page).toHaveURL('/dashboard');
		    await expect(page.locator('h1')).toContainText('Welcome');
		  });
		  ```
	-
	- ## API Testing
	  collapsed:: true
		- ```
		  Postman     — GUI tool for manual + automated API testing.
		               Collections, environments, Newman (CLI runner).
		  
		  REST Assured — Java library for REST API testing. Fluent DSL.
		  
		  Supertest   — Node.js HTTP assertion library. Works with Express.
		  
		  Insomnia    — Postman alternative. Clean UI, GraphQL support.
		  
		  Hoppscotch  — Open-source Postman alternative (web-based).
		  ```
		- ```javascript
		  // Supertest + Jest example
		  const request = require('supertest');
		  const app = require('../app');
		  
		  test('GET /users returns 200', async () => {
		    const res = await request(app).get('/users');
		    expect(res.statusCode).toBe(200);
		    expect(res.body).toHaveProperty('users');
		  });
		  ```
	-
	- ## Performance Testing
	  collapsed:: true
		- ```
		  JMeter      — Apache. GUI + CLI. Load, stress, spike testing.
		               Supports HTTP, JDBC, FTP, WebSocket.
		  
		  k6          — Modern, developer-friendly. JavaScript scripts.
		               Cloud + local. Great for CI/CD integration.
		  
		  Gatling     — Scala-based. High performance. Good reports.
		  
		  Locust      — Python. Define user behavior in code. Distributed.
		  
		  Artillery   — Node.js. YAML config. Good for microservices.
		  ```
		- ```javascript
		  // k6 load test example
		  import http from 'k6/http';
		  import { check, sleep } from 'k6';
		  
		  export const options = {
		    vus: 100,          // 100 virtual users
		    duration: '30s',   // run for 30 seconds
		  };
		  
		  export default function () {
		    const res = http.get('https://example.com/api/users');
		    check(res, { 'status is 200': (r) => r.status === 200 });
		    sleep(1);
		  }
		  ```
	-
	- ## Mobile Testing
	  collapsed:: true
		- ```
		  Appium      — Cross-platform mobile automation (iOS + Android).
		               Uses WebDriver protocol. Supports native, hybrid, web apps.
		  
		  Espresso    — Android-only. Google. Fast, reliable, built into Android Studio.
		  
		  XCUITest    — iOS-only. Apple. Integrated with Xcode.
		  
		  Detox       — React Native E2E testing. Gray-box approach.
		  ```
	-
	- ## Test Management Tools
	  collapsed:: true
		- ```
		  TestRail    — Test case management, execution tracking, reporting.
		  Zephyr      — Jira plugin for test management.
		  Xray        — Jira plugin. BDD support, traceability.
		  qTest       — Enterprise test management.
		  Allure      — Beautiful test reports. Works with most frameworks.
		  ```
-
- # CI/CD Integration
  collapsed:: true
	- ## Testing in CI Pipeline
	  collapsed:: true
		- ```
		  Typical pipeline stages:
		  
		  Code Push
		    → Lint & Static Analysis (ESLint, SonarQube)
		    → Unit Tests (Jest, pytest)
		    → Build
		    → Integration Tests (API tests, DB tests)
		    → E2E Tests (Playwright, Cypress — on staging)
		    → Performance Tests (k6 — on staging)
		    → Security Scan (OWASP ZAP, Snyk)
		    → Deploy to Production
		  ```
		- ```yaml
		  # GitHub Actions example
		  name: Test Pipeline
		  on: [push, pull_request]
		  
		  jobs:
		    test:
		      runs-on: ubuntu-latest
		      steps:
		        - uses: actions/checkout@v3
		        - uses: actions/setup-node@v3
		          with: { node-version: '20' }
		        - run: npm ci
		        - run: npm run test:unit
		        - run: npm run test:e2e
		          env:
		            BASE_URL: ${{ secrets.STAGING_URL }}
		  ```
	-
	- ## Shift-Left Testing
	  collapsed:: true
		- ```
		  Move testing earlier in the development cycle.
		  
		  Traditional: Dev → Dev → Dev → TEST → Release
		  Shift-Left:  TEST+Dev → TEST+Dev → TEST+Dev → Release
		  
		  Benefits:
		    - Bugs found earlier = cheaper to fix
		    - Faster feedback loops
		    - Better code quality from the start
		  
		  Practices:
		    - TDD / BDD
		    - Code reviews with QA
		    - Static analysis in IDE
		    - Unit tests written by devs
		  ```
-
- # API Testing Deep Dive
  collapsed:: true
	- ## What to Test in APIs
	  collapsed:: true
		- ```
		  Functional:
		    ✅ Correct status codes (200, 201, 400, 401, 403, 404, 500)
		    ✅ Response body structure and data types
		    ✅ Required fields present
		    ✅ Business logic correctness
		    ✅ CRUD operations work correctly
		  
		  Non-Functional:
		    ✅ Response time < threshold (e.g., < 200ms)
		    ✅ Handles large payloads
		    ✅ Rate limiting works
		  
		  Security:
		    ✅ Auth required on protected endpoints
		    ✅ SQL injection / XSS in inputs
		    ✅ Sensitive data not exposed
		    ✅ CORS configured correctly
		  ```
	-
	- ## REST API Status Codes Cheat Sheet
	  collapsed:: true
		- ```
		  2xx Success:
		    200 OK           — GET, PUT success
		    201 Created      — POST success (resource created)
		    204 No Content   — DELETE success
		  
		  3xx Redirect:
		    301 Moved Permanently
		    304 Not Modified  — Cached response still valid
		  
		  4xx Client Error:
		    400 Bad Request   — Invalid input
		    401 Unauthorized  — Not authenticated
		    403 Forbidden     — Authenticated but no permission
		    404 Not Found     — Resource doesn't exist
		    409 Conflict      — Duplicate resource
		    422 Unprocessable — Validation error
		    429 Too Many Requests — Rate limited
		  
		  5xx Server Error:
		    500 Internal Server Error
		    502 Bad Gateway
		    503 Service Unavailable
		    504 Gateway Timeout
		  ```
-
- # Security Testing Basics
  collapsed:: true
	- ## OWASP Top 10 (Testing Focus)
	  collapsed:: true
		- ```
		  A01 Broken Access Control    — Test: access other users' data, bypass auth
		  A02 Cryptographic Failures   — Test: HTTP instead of HTTPS, weak passwords stored
		  A03 Injection                — Test: SQL injection, XSS, command injection
		  A04 Insecure Design          — Test: missing rate limits, no account lockout
		  A05 Security Misconfiguration — Test: default creds, verbose error messages
		  A06 Vulnerable Components    — Test: outdated libraries (npm audit, Snyk)
		  A07 Auth Failures            — Test: brute force, weak session tokens
		  A08 Software Integrity       — Test: unsigned packages, CI/CD pipeline security
		  A09 Logging Failures         — Test: sensitive data in logs, no audit trail
		  A10 SSRF                     — Test: server fetches attacker-controlled URLs
		  ```
	-
	- ## Basic Security Test Cases
	  collapsed:: true
		- ```
		  SQL Injection:
		    Input: ' OR '1'='1  →  should return error, not data
		  
		  XSS:
		    Input: <script>alert('xss')</script>  →  should be escaped
		  
		  Auth bypass:
		    Access /admin without login  →  should return 401/403
		  
		  IDOR (Insecure Direct Object Reference):
		    GET /users/123  →  logged in as user 456, should return 403
		  ```
-
- # QA Interview Prep
  collapsed:: true
	- ## Common QA Interview Questions
	  collapsed:: true
		- ```
		  Q: What is the difference between Smoke and Sanity testing?
		  A: Smoke = broad, shallow check after a new build ("does it start?")
		     Sanity = narrow, deep check after a bug fix ("is this specific thing fixed?")
		  
		  Q: What is regression testing?
		  A: Re-running existing tests after code changes to ensure nothing is broken.
		  
		  Q: What is the difference between severity and priority?
		  A: Severity = technical impact. Priority = business urgency.
		  
		  Q: What is a test plan vs test case?
		  A: Test plan = strategy document for the whole project.
		     Test case = specific steps to test one scenario.
		  
		  Q: What is boundary value analysis?
		  A: Testing at the edges of valid input ranges (min-1, min, min+1, max-1, max, max+1).
		  
		  Q: What makes a good bug report?
		  A: Clear title, steps to reproduce, expected vs actual result, environment, attachments.
		  
		  Q: What is the testing pyramid?
		  A: Many unit tests → fewer integration tests → even fewer E2E tests.
		  
		  Q: What is POM (Page Object Model)?
		  A: Design pattern separating page locators from test logic for maintainability.
		  ```
-
- # Test Data Management
  collapsed:: true
	- ## Strategies
	  collapsed:: true
		- ```
		  Static Test Data   — Fixed data in files/DB. Simple but can get stale.
		  Dynamic Test Data  — Generated at runtime. Fresh every run.
		  Synthetic Data     — Fake but realistic data. No real PII.
		  Production Clone   — Copy of prod data, anonymized. Most realistic.
		  
		  Golden Dataset     — Curated, stable dataset for regression tests.
		                       Checked into version control.
		  ```
	-
	- ## Data Masking & Anonymization
	  collapsed:: true
		- ```
		  Never use real PII in test environments.
		  
		  Techniques:
		    Substitution  — Replace real name with fake name
		    Shuffling     — Swap values between rows
		    Encryption    — Encrypt sensitive fields
		    Nulling        — Replace with NULL
		    Tokenization  — Replace with random token
		  
		  Tools: Faker.js, Faker (Python), Mockaroo, DataMasker
		  ```
		- ```javascript
		  // Faker.js — generate synthetic test data
		  import { faker } from '@faker-js/faker';
		  
		  const user = {
		    name:  faker.person.fullName(),
		    email: faker.internet.email(),
		    phone: faker.phone.number(),
		    address: faker.location.streetAddress(),
		  };
		  ```
	-
	- ## Test Data in Automation
	  collapsed:: true
		- ```
		  Data-Driven Testing (DDT):
		    Run same test with multiple data sets.
		    Data stored in CSV, JSON, Excel, or DB.
		  
		  Example (pytest parametrize):
		  ```
		- ```python
		  import pytest
		  
		  @pytest.mark.parametrize("username,password,expected", [
		    ("admin",     "correct",  "dashboard"),
		    ("admin",     "wrong",    "error"),
		    ("",          "",         "error"),
		    ("unknown",   "pass",     "error"),
		  ])
		  def test_login(username, password, expected, page):
		      page.goto("/login")
		      page.fill("#username", username)
		      page.fill("#password", password)
		      page.click("button[type=submit]")
		      assert expected in page.url or expected in page.content()
		  ```
-
- # Mocking, Stubbing & Test Doubles
  collapsed:: true
	- ## Types of Test Doubles
	  collapsed:: true
		- ```
		  Dummy    — Passed around but never used. Fills parameter lists.
		  
		  Stub     — Returns hardcoded responses. No logic.
		             "When called with X, return Y."
		  
		  Mock     — Pre-programmed with expectations. Verifies interactions.
		             "Was this method called? How many times? With what args?"
		  
		  Spy      — Wraps real object. Records calls. Can verify after.
		  
		  Fake     — Working implementation but simplified.
		             Example: in-memory DB instead of real DB.
		  ```
	-
	- ## Mocking in Practice
	  collapsed:: true
		- ```javascript
		  // Jest mocking example
		  
		  // Mock a module
		  jest.mock('./emailService');
		  
		  // Stub a return value
		  emailService.send.mockResolvedValue({ success: true });
		  
		  // Spy on a method
		  const spy = jest.spyOn(userService, 'getUser');
		  
		  // Verify it was called
		  expect(spy).toHaveBeenCalledWith(123);
		  expect(spy).toHaveBeenCalledTimes(1);
		  ```
		- ```python
		  # Python unittest.mock
		  from unittest.mock import patch, MagicMock
		  
		  @patch('app.services.email.send')
		  def test_register_sends_email(mock_send):
		      mock_send.return_value = True
		      result = register_user("test@example.com")
		      assert result.success
		      mock_send.assert_called_once_with("test@example.com")
		  ```
	-
	- ## API Mocking / Service Virtualization
	  collapsed:: true
		- ```
		  Mock external APIs during testing so tests don't depend on 3rd parties.
		  
		  Tools:
		    WireMock    — Java. HTTP mock server. Record & replay.
		    MSW         — Mock Service Worker. Intercepts at network level (browser + Node).
		    Nock        — Node.js HTTP mocking.
		    json-server — Fake REST API from a JSON file in 30 seconds.
		  ```
		- ```javascript
		  // MSW (Mock Service Worker) example
		  import { http, HttpResponse } from 'msw';
		  import { setupServer } from 'msw/node';
		  
		  const server = setupServer(
		    http.get('/api/users', () => {
		      return HttpResponse.json([{ id: 1, name: 'Alice' }]);
		    })
		  );
		  
		  beforeAll(() => server.listen());
		  afterEach(() => server.resetHandlers());
		  afterAll(() => server.close());
		  ```
-
- # Contract Testing
  collapsed:: true
	- ## What is Contract Testing?
	  collapsed:: true
		- ```
		  Verify that two services (consumer + provider) agree on the API contract.
		  Catches breaking changes before they reach production.
		  
		  Consumer — the service that calls the API
		  Provider — the service that serves the API
		  Contract — agreed request/response format
		  
		  vs Integration Testing:
		    Integration: spin up both services, test together (slow, brittle)
		    Contract:    each service tested independently against the contract (fast)
		  ```
	-
	- ## Pact (Consumer-Driven Contract Testing)
	  collapsed:: true
		- ```
		  1. Consumer writes a test defining what it expects from the provider
		  2. Pact generates a contract file (pact.json)
		  3. Provider verifies it can fulfill the contract
		  4. Contracts stored in Pact Broker (shared registry)
		  
		  Tools: Pact (JS, Java, Python, Go, .NET), Pact Broker, PactFlow
		  ```
		- ```javascript
		  // Consumer test (Pact JS)
		  const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
		  
		  const provider = new PactV3({ consumer: 'WebApp', provider: 'UserAPI' });
		  
		  it('gets a user by ID', () => {
		    provider
		      .given('user 1 exists')
		      .uponReceiving('a request for user 1')
		      .withRequest({ method: 'GET', path: '/users/1' })
		      .willRespondWith({
		        status: 200,
		        body: { id: MatchersV3.integer(1), name: MatchersV3.string('Alice') }
		      });
		  
		    return provider.executeTest(async (mockServer) => {
		      const user = await getUser(mockServer.url, 1);
		      expect(user.name).toBe('Alice');
		    });
		  });
		  ```
-
- # Visual & Screenshot Testing
  collapsed:: true
	- ## What is Visual Testing?
	  collapsed:: true
		- ```
		  Capture screenshots of UI and compare against approved baselines.
		  Catches unintended visual regressions (layout shifts, color changes, etc.)
		  
		  Pixel-diff:  Compare pixel by pixel. Sensitive to tiny changes.
		  AI-based:    Ignore irrelevant differences (fonts, anti-aliasing).
		  ```
	-
	- ## Tools
	  collapsed:: true
		- ```
		  Percy (BrowserStack) — Cloud visual testing. Integrates with Playwright/Cypress.
		  Chromatic            — Storybook-based. Great for component libraries.
		  Applitools Eyes      — AI-powered. Cross-browser visual testing.
		  Playwright snapshots — Built-in screenshot comparison. No cloud needed.
		  BackstopJS           — Open-source. Config-driven visual regression.
		  ```
		- ```javascript
		  // Playwright built-in visual comparison
		  test('homepage looks correct', async ({ page }) => {
		    await page.goto('/');
		    await expect(page).toHaveScreenshot('homepage.png', {
		      maxDiffPixels: 100,  // allow minor differences
		    });
		  });
		  
		  // First run: creates baseline screenshot
		  // Subsequent runs: compares against baseline
		  // Update baseline: npx playwright test --update-snapshots
		  ```
-
- # Accessibility Testing
  collapsed:: true
	- ## WCAG Levels
	  collapsed:: true
		- ```
		  WCAG (Web Content Accessibility Guidelines) — W3C standard
		  
		  Level A   — Minimum. Must pass. (e.g., images have alt text)
		  Level AA  — Standard target. Required by most laws. (e.g., color contrast 4.5:1)
		  Level AAA — Highest. Not always achievable. (e.g., sign language for video)
		  
		  4 Principles (POUR):
		    Perceivable   — Info presentable to all senses
		    Operable      — UI usable with keyboard, no seizure triggers
		    Understandable — Content readable, predictable
		    Robust        — Works with assistive technologies
		  ```
	-
	- ## Automated Accessibility Tools
	  collapsed:: true
		- ```
		  axe-core     — Most popular. Open-source. Integrates with Playwright/Cypress.
		  Lighthouse   — Google Chrome DevTools. Accessibility audit score.
		  WAVE         — Browser extension. Visual feedback on issues.
		  Pa11y        — CLI tool. CI/CD friendly.
		  Deque axe    — Enterprise version of axe-core.
		  ```
		- ```javascript
		  // axe-core with Playwright
		  import { checkA11y } from 'axe-playwright';
		  
		  test('homepage has no accessibility violations', async ({ page }) => {
		    await page.goto('/');
		    await checkA11y(page, null, {
		      detailedReport: true,
		      detailedReportOptions: { html: true },
		    });
		  });
		  ```
	-
	- ## Manual Accessibility Checks
	  collapsed:: true
		- ```
		  ✅ Tab through entire page with keyboard only
		  ✅ All interactive elements reachable and operable via keyboard
		  ✅ Focus indicator visible at all times
		  ✅ Screen reader announces content correctly (NVDA, VoiceOver, JAWS)
		  ✅ Color contrast ratio ≥ 4.5:1 for normal text, 3:1 for large text
		  ✅ Images have meaningful alt text
		  ✅ Forms have labels associated with inputs
		  ✅ Error messages are descriptive and announced
		  ✅ No content flashes more than 3 times per second
		  ```
-
- # Cross-Browser & Cross-Device Testing
  collapsed:: true
	- ## Browser Compatibility
	  collapsed:: true
		- ```
		  Test on:
		    Chrome (latest + 1 version back)
		    Firefox
		    Safari (macOS + iOS)
		    Edge
		    Samsung Internet (Android)
		  
		  Common issues:
		    CSS grid/flexbox differences
		    JavaScript API support (check caniuse.com)
		    Font rendering differences
		    Date/time formatting
		    File upload behavior
		  ```
	-
	- ## Cloud Testing Platforms
	  collapsed:: true
		- ```
		  BrowserStack  — Real devices + browsers in the cloud.
		                  Manual + automated (Selenium, Playwright, Appium).
		  
		  Sauce Labs    — Cloud testing platform. Parallel test execution.
		                  Supports Selenium, Appium, Cypress.
		  
		  LambdaTest    — Cross-browser testing. Live + automated.
		                  Smart UI visual testing built-in.
		  
		  AWS Device Farm — Real mobile devices on AWS.
		  
		  Playwright    — Built-in multi-browser: Chromium, Firefox, WebKit.
		                  No cloud needed for basic cross-browser.
		  ```
		- ```javascript
		  // Playwright multi-browser config (playwright.config.ts)
		  export default {
		    projects: [
		      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
		      { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
		      { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
		      { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
		      { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
		    ],
		  };
		  ```
-
- # Database Testing
  collapsed:: true
	- ## What to Test
	  collapsed:: true
		- ```
		  Schema Validation:
		    ✅ Tables, columns, data types match spec
		    ✅ Constraints: NOT NULL, UNIQUE, FK, CHECK
		    ✅ Indexes exist for performance-critical queries
		  
		  Data Integrity:
		    ✅ CRUD operations store/retrieve correctly
		    ✅ Foreign key relationships enforced
		    ✅ Cascading deletes/updates work correctly
		    ✅ Transactions are atomic (all or nothing)
		  
		  Migration Testing:
		    ✅ Migration runs without errors
		    ✅ Data preserved after migration
		    ✅ Rollback works correctly
		  
		  Performance:
		    ✅ Slow query detection (EXPLAIN ANALYZE)
		    ✅ Index usage verified
		    ✅ N+1 query problems caught
		  ```
	-
	- ## DB Testing Tools
	  collapsed:: true
		- ```
		  pytest + SQLAlchemy — Python DB integration tests
		  DbUnit              — Java. Reset DB to known state between tests.
		  Flyway / Liquibase  — Migration testing. Version-controlled schema.
		  pgTAP               — PostgreSQL unit testing framework.
		  TestContainers      — Spin up real DB in Docker for tests.
		  ```
		- ```javascript
		  // TestContainers (Node.js) — real Postgres in Docker
		  import { PostgreSqlContainer } from '@testcontainers/postgresql';
		  
		  let container;
		  beforeAll(async () => {
		    container = await new PostgreSqlContainer().start();
		    // connect your app to container.getConnectionUri()
		  });
		  afterAll(() => container.stop());
		  
		  test('saves user to DB', async () => {
		    await db.users.create({ name: 'Alice', email: 'alice@test.com' });
		    const user = await db.users.findByEmail('alice@test.com');
		    expect(user.name).toBe('Alice');
		  });
		  ```
-
- # GraphQL Testing
  collapsed:: true
	- ## What to Test
	  collapsed:: true
		- ```
		  Queries:
		    ✅ Returns correct fields and types
		    ✅ Nested resolvers work correctly
		    ✅ Pagination (first, after, last, before)
		    ✅ Filtering and sorting
		  
		  Mutations:
		    ✅ Creates/updates/deletes data correctly
		    ✅ Returns updated object
		    ✅ Validation errors returned properly
		  
		  Subscriptions:
		    ✅ Real-time updates delivered
		    ✅ Unsubscribe works
		  
		  Error Handling:
		    ✅ Invalid query returns 400 with errors array
		    ✅ Unauthorized access returns proper error
		    ✅ Partial success (some fields fail, others succeed)
		  ```
	-
	- ## GraphQL Testing Tools
	  collapsed:: true
		- ```
		  GraphQL Playground / Apollo Studio — Interactive query explorer
		  Postman     — Supports GraphQL queries natively
		  Insomnia    — GraphQL support with schema introspection
		  Jest + supertest — Unit/integration test resolvers
		  ```
		- ```javascript
		  // GraphQL API test with supertest
		  test('query returns user', async () => {
		    const res = await request(app)
		      .post('/graphql')
		      .send({
		        query: `query { user(id: "1") { id name email } }`
		      });
		  
		    expect(res.status).toBe(200);
		    expect(res.body.data.user.name).toBe('Alice');
		    expect(res.body.errors).toBeUndefined();
		  });
		  ```
-
- # WebSocket & Real-Time Testing
  collapsed:: true
	- ## Challenges
	  collapsed:: true
		- ```
		  WebSockets are stateful, bidirectional, long-lived connections.
		  
		  What to test:
		    ✅ Connection established successfully
		    ✅ Messages sent and received correctly
		    ✅ Reconnection on disconnect
		    ✅ Multiple concurrent clients
		    ✅ Message ordering preserved
		    ✅ Server broadcasts to correct clients
		    ✅ Auth/authorization on connection
		  ```
	-
	- ## Tools
	  collapsed:: true
		- ```
		  Playwright  — Can intercept WebSocket frames natively
		  wscat       — CLI WebSocket client for manual testing
		  Artillery   — Load test WebSocket connections
		  Jest + ws   — Unit test WebSocket server logic
		  ```
		- ```javascript
		  // Playwright WebSocket interception
		  test('receives real-time update', async ({ page }) => {
		    const wsPromise = page.waitForEvent('websocket');
		    await page.goto('/dashboard');
		    const ws = await wsPromise;
		  
		    const msgPromise = ws.waitForEvent('framereceived');
		    // trigger server event...
		    const frame = await msgPromise;
		    expect(JSON.parse(frame.payload)).toMatchObject({ type: 'update' });
		  });
		  ```
-
- # Test Environments
  collapsed:: true
	- ## Environment Types
	  collapsed:: true
		- ```
		  Local (Dev)   — Developer's machine. Fast iteration.
		  CI            — Automated pipeline. Every commit.
		  Integration   — All services connected. Shared team env.
		  Staging       — Production mirror. Pre-release validation.
		  UAT           — Client/user acceptance testing.
		  Production    — Live. Only smoke tests + monitoring.
		  
		  Environment Parity:
		    Staging should be as close to production as possible.
		    Same OS, same DB version, same config (except secrets).
		    Use Docker/containers to ensure consistency.
		  ```
	-
	- ## Environment Configuration
	  collapsed:: true
		- ```
		  Never hardcode environment-specific values in tests.
		  
		  Use environment variables:
		    BASE_URL=https://staging.example.com
		    DB_URL=postgres://...
		    API_KEY=...
		  
		  .env files per environment:
		    .env.local
		    .env.staging
		    .env.production
		  
		  Tools: dotenv, direnv, Vault (secrets)
		  ```
-
- # Advanced Automation Patterns
  collapsed:: true
	- ## Screenplay Pattern
	  collapsed:: true
		- ```
		  More expressive than POM. Models actors performing tasks.
		  
		  Actors   — represent users (Alice, Bob)
		  Abilities — what actors can do (browse web, call API)
		  Tasks    — high-level user goals (log in, place order)
		  Actions  — low-level steps (click, fill, navigate)
		  Questions — assertions about the state of the system
		  
		  Tools: Serenity/JS (JavaScript), Serenity BDD (Java)
		  ```
	-
	- ## Keyword-Driven Testing
	  collapsed:: true
		- ```
		  Tests written as tables of keywords + data.
		  Non-technical stakeholders can write/read tests.
		  
		  | Keyword        | Locator       | Value          |
		  |----------------|---------------|----------------|
		  | Open Browser   | https://...   |                |
		  | Input Text     | #email        | user@test.com  |
		  | Input Text     | #password     | secret123      |
		  | Click Button   | #login-btn    |                |
		  | Verify URL     |               | /dashboard     |
		  
		  Tools: Robot Framework (Python), Gauge
		  ```
	-
	- ## Parallel Test Execution
	  collapsed:: true
		- ```
		  Run tests concurrently to reduce total execution time.
		  
		  Playwright:  workers: 4  (in playwright.config.ts)
		  Jest:        --maxWorkers=4
		  pytest:      pytest-xdist  →  pytest -n 4
		  
		  Requirements for parallel tests:
		    ✅ Tests are independent (no shared state)
		    ✅ Each test uses isolated data
		    ✅ No hardcoded ports or file paths
		    ✅ DB tests use separate schemas or transactions
		  ```
	-
	- ## Retry Logic
	  collapsed:: true
		- ```
		  Flaky tests fail intermittently due to timing, network, or race conditions.
		  
		  Short-term fix: retry failed tests
		  Long-term fix: find and fix root cause
		  
		  Playwright: retries: 2  (in config)
		  Jest:       jest-circus retry plugin
		  pytest:     pytest-rerunfailures  →  @pytest.mark.flaky(reruns=3)
		  
		  Track flaky tests — high flakiness rate = test quality problem.
		  ```
-
- # Chaos Engineering & Resilience Testing
  collapsed:: true
	- ## Concept
	  collapsed:: true
		- ```
		  Deliberately inject failures to test system resilience.
		  "Break things on purpose before they break unexpectedly."
		  
		  Principles:
		    1. Define steady state (normal behavior metrics)
		    2. Hypothesize steady state continues during failure
		    3. Introduce real-world events (server crash, network latency)
		    4. Disprove hypothesis → find weaknesses
		  
		  Start small: test in staging, not production.
		  Gradually move to production (Netflix Chaos Monkey approach).
		  ```
	-
	- ## What to Inject
	  collapsed:: true
		- ```
		  Network:
		    - Latency (add 500ms delay to service calls)
		    - Packet loss
		    - DNS failure
		    - Bandwidth throttling
		  
		  Infrastructure:
		    - Kill a pod/container randomly
		    - CPU/memory pressure
		    - Disk full
		    - Clock skew
		  
		  Application:
		    - Dependency timeout
		    - Return 500 errors from a service
		    - DB connection pool exhaustion
		  ```
	-
	- ## Tools
	  collapsed:: true
		- ```
		  Chaos Monkey (Netflix) — Randomly terminates EC2 instances
		  Chaos Mesh             — Kubernetes chaos engineering platform
		  Gremlin                — Enterprise chaos platform
		  Toxiproxy              — Network condition simulation (Shopify)
		  Pumba                  — Docker chaos tool
		  Litmus                 — Cloud-native chaos for Kubernetes
		  ```
-
- # QA Metrics & Reporting
  collapsed:: true
	- ## Key QA Metrics
	  collapsed:: true
		- ```
		  Test Execution Metrics:
		    Total Tests         — How many tests exist
		    Pass Rate           = Passed / Total Executed × 100
		    Fail Rate           = Failed / Total Executed × 100
		    Blocked Rate        = Blocked / Total × 100
		    Test Coverage       = Tested Requirements / Total Requirements × 100
		  
		  Defect Metrics:
		    Defect Density      = Defects / KLOC
		    Defect Leakage      = Bugs found in prod / Total bugs × 100
		    DRE                 = Bugs caught before release / Total bugs × 100
		    Mean Time to Detect (MTTD)
		    Mean Time to Resolve (MTTR)
		  
		  Automation Metrics:
		    Automation Coverage = Automated Tests / Total Tests × 100
		    Flaky Test Rate     = Flaky Tests / Total Automated × 100
		    Avg Execution Time  — Track trends over time
		  ```
	-
	- ## Test Reports
	  collapsed:: true
		- ```
		  Good test report includes:
		    - Summary: total / passed / failed / skipped
		    - Failure details: test name, error message, screenshot
		    - Trend over time: is quality improving?
		    - Environment info: browser, OS, version
		  
		  Tools:
		    Allure Report  — Beautiful HTML reports. Works with most frameworks.
		    HTML Reporter  — Playwright built-in HTML report.
		    ReportPortal   — Real-time test reporting dashboard.
		    Grafana        — Custom dashboards from test metrics.
		  ```
		- ```bash
		  # Playwright HTML report
		  npx playwright test --reporter=html
		  npx playwright show-report
		  
		  # Allure with pytest
		  pytest --alluredir=./allure-results
		  allure serve ./allure-results
		  ```
	-
	- ## QA KPIs (Key Performance Indicators)
	  collapsed:: true
		- ```
		  Escaped Defects       — Bugs found by users in production. Target: 0.
		  DRE > 95%             — 95%+ bugs caught before release.
		  Automation Coverage > 70% — Most regression tests automated.
		  Flaky Test Rate < 2%  — Low flakiness = reliable test suite.
		  Test Execution Time   — Should decrease over time with optimization.
		  Sprint Bug Carryover  — Bugs not fixed in same sprint. Should be low.
		  ```
-
- # QA Interview Prep — Advanced
  collapsed:: true
	- ## Advanced Questions
	  collapsed:: true
		- ```
		  Q: What is the difference between mocking and stubbing?
		  A: Stub = returns hardcoded data, no verification.
		     Mock = verifies interactions (was it called? how many times?).
		  
		  Q: What is contract testing and when would you use it?
		  A: Verify consumer/provider API agreement independently.
		     Use when microservices need to evolve without breaking each other.
		  
		  Q: How do you handle flaky tests?
		  A: Identify root cause (timing, shared state, network).
		     Add explicit waits, isolate test data, fix race conditions.
		     Track flakiness rate — don't just add retries.
		  
		  Q: What is shift-left testing?
		  A: Move testing earlier in SDLC. TDD, code reviews, static analysis.
		     Cheaper to fix bugs early than after release.
		  
		  Q: How do you test a REST API?
		  A: Status codes, response schema, business logic, auth, error cases,
		     performance (response time), security (injection, IDOR).
		  
		  Q: What is the difference between load and stress testing?
		  A: Load = expected traffic. Stress = beyond capacity (find breaking point).
		  
		  Q: How do you ensure test independence?
		  A: Each test sets up its own data, cleans up after itself.
		     No shared mutable state between tests.
		  
		  Q: What is a test harness?
		  A: Collection of software/tools to run tests: runner, fixtures,
		     mocks, reporters, CI integration.
		  
		  Q: What is mutation testing?
		  A: Automatically introduce bugs (mutations) into code.
		     If tests don't catch them → tests are weak.
		     Tools: Stryker (JS), PIT (Java), mutmut (Python).
		  
		  Q: How do you test microservices?
		  A: Unit test each service in isolation.
		     Contract tests for service boundaries.
		     Integration tests for critical flows.
		     E2E tests for key user journeys only.
		  ```
-
- # Mutation Testing
  collapsed:: true
	- ## Concept
	  collapsed:: true
		- ```
		  Measure the quality of your test suite, not just coverage.
		  
		  How it works:
		    1. Tool makes small code changes (mutations): + → -, == → !=, etc.
		    2. Runs your test suite against each mutant
		    3. If tests FAIL → mutant is "killed" (good — tests caught the bug)
		    4. If tests PASS → mutant "survived" (bad — tests missed the bug)
		  
		  Mutation Score = Killed Mutants / Total Mutants × 100
		  Target: > 80%
		  
		  Common mutations:
		    Arithmetic: + → -, * → /
		    Relational: > → >=, == → !=
		    Logical:    && → ||, ! removed
		    Return:     return true → return false
		  ```
	-
	- ## Tools
	  collapsed:: true
		- ```
		  Stryker    — JavaScript/TypeScript. Most popular for JS.
		  PIT        — Java. Fast, integrates with Maven/Gradle.
		  mutmut     — Python. Simple CLI.
		  Infection  — PHP mutation testing.
		  ```
		- ```bash
		  # Stryker (JavaScript)
		  npx stryker run
		  # Opens HTML report showing survived mutants
		  
		  # mutmut (Python)
		  mutmut run
		  mutmut results
		  mutmut show 5   # show specific surviving mutant
		  ```
-
- # Quick Reference Cheat Sheet
  collapsed:: true
	- ```
	  Testing Types:
	    Unit → Integration → System → Acceptance
	    Black Box / White Box / Grey Box
	    Functional / Non-Functional / Performance / Security
	    Manual / Automated / Visual / Accessibility
	  
	  Methodologies:
	    TDD    — Test first, code second (Red→Green→Refactor)
	    BDD    — Gherkin (Given/When/Then), Cucumber
	    ATDD   — Acceptance criteria drive tests
	    Agile QA — QA in every sprint, testing quadrants
	  
	  Tools by Category:
	    Unit:         Jest, Vitest, pytest, JUnit, NUnit
	    E2E:          Playwright, Cypress, Selenium, WebdriverIO
	    API:          Postman, REST Assured, Supertest, Insomnia
	    Performance:  JMeter, k6, Gatling, Locust, Artillery
	    Mobile:       Appium, Espresso, XCUITest, Detox
	    Visual:       Percy, Chromatic, Applitools, BackstopJS
	    Accessibility: axe-core, Lighthouse, WAVE, Pa11y
	    Contract:     Pact, Pact Broker, PactFlow
	    Mocking:      WireMock, MSW, Nock, json-server
	    DB:           TestContainers, DbUnit, pgTAP
	    Chaos:        Chaos Mesh, Gremlin, Toxiproxy, Pumba
	    Mutation:     Stryker, PIT, mutmut
	    Reports:      Allure, ReportPortal, Playwright HTML
	    Management:   TestRail, Zephyr, Xray, qTest
	    Security:     OWASP ZAP, Snyk, Burp Suite
	    Cross-Browser: BrowserStack, Sauce Labs, LambdaTest
	  
	  Test Data:
	    Faker.js / Faker (Python) — synthetic data generation
	    Data-driven: parametrize tests with CSV/JSON/DB
	    Always mask PII in non-production environments
	  
	  Bug Lifecycle:
	    New → Assigned → Open → Fixed → Retest → Closed
	                                   ↘ Reopen
	    Other: Rejected / Deferred / Cannot Reproduce
	  
	  Severity: Critical > High > Medium > Low
	  Priority: P1 (immediate) > P2 > P3 > P4 (backlog)
	  
	  Key Metrics:
	    DRE > 95%              — bugs caught before release
	    Automation Coverage > 70%
	    Flaky Test Rate < 2%
	    Mutation Score > 80%
	    Escaped Defects → 0
	  
	  Automation Pyramid:
	    70% Unit / 20% Integration / 10% E2E
	  
	  Environments:
	    Local → CI → Integration → Staging → UAT → Production
	  ```