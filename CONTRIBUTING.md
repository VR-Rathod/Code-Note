# Contributing to Free Code Notes 🚀

Thank you for taking the time to contribute! This guide defines the **exact format and structure** every page must follow. Consistent structure makes the knowledge base easy to navigate in Logseq and SEO-friendly on the web.

---

## Page Types & Which Format to Use

Please follow the correct template based on the type of page you are creating:

| Page Type | Format to Follow | Description |
| :--- | :--- | :--- |
| 💻 **Programming Language** | [Programming Page Format](#programming-page-format) | For core languages like C++, Python, Java, etc. |
| 🐧 **Operating System / Distro** | [OS Page Format](#os-page-format) | For distros and OS-related guides like Kali Linux, Ubuntu, etc. |
| 📦 **Framework / Library** | [Framework/Library Page Format](#frameworklibrary-page-format) | For libraries and frameworks like React, Express, etc. |
| 🧮 **Algorithm / Data Structure** | [Algorithm/Data Structure Format](#algorithmdata-structure-format) | For DSA topics like Binary Search, Dijkstra's Algorithm, etc. |
| 🛠️ **Tool / Software** | [Tool/Software Format](#toolsoftware-format) | For software utilities and tools like Git, Docker, etc. |
| 💡 **Concept / Theory** | [Concept/Theory Format](#concepttheory-format) | For general theoretical and conceptual pages. |

---

## File Naming Convention

To maintain consistency across the knowledge base, adhere to these rules:

*   Use the **exact display name** as the filename:
    *   *Examples:* `Kali Linux.md`, `Cpp.md`, `React js.md`
*   Use kebab-case/spaces properly:
    *   *Algorithmic pages:* Use kebab-case/capitalization matching the name, e.g., `Binary Search.md`, `Dijkstras Algorithm.md`
*   Place all files inside the `pages/` directory.
*   Link your new pages in `index.md` under the correct section using Logseq `[[Page Name]]` syntax.

---

## Frontmatter Configuration (Required)

Every page **must** start with the following SEO-optimized frontmatter:

```yaml
seoTitle: <Page Name> Complete Guide – <Short Description>
description: "Comprehensive <topic> reference covering <key topics>."
keywords: "<keyword1>, <keyword2>, ..., VR-Rathod, Code-Note, Vaibhav Rathod, vaibhav, Vaibhav, VR, code note vr, vr book, <Your name / your code tags>"
displayTitle: Better Title  # This is the title of the page (not required for all pages)
comments: false/true        # For enabling or disabling comments
treeTitle: main page - sub page - sub page
```

### Author Attribution

#### For a Single Author
```yaml
author: Your Name (Default: Vaibhav Rathod) 
authorUrl: Your Website URL (Default: GitHub profile VR-Rathod)
```

#### For Multiple Authors
```yaml
authors:
  - name: Name 1
    url: Url 1
  - name: Name 2
    url: Url 2
```

---

## Page Structure Templates

Below are the templates for each page type. You can copy and paste these directly to start writing your page.

### Programming Page Format

> [!NOTE]
> See [Cpp.md](pages/Cpp.md) or `Java.md` as reference implementations.

```text
# History
  collapsed:: true
  - How: (origin story, who created it, when)
  - Who: (creator name, organization)
  - Why: (motivation, problem it solved)

# Introduction
  collapsed:: true
  - ## Advantages
  - ## Disadvantages

# Basics
  collapsed:: true
  - ## Hello World & Entry Point
  - ## Comments
  - ## Variables & Data Types
  - ## Operators
  - ## Type Casting
  - ## User Input / Output

# Control Flow
  collapsed:: true
  - ## if / else
  - ## Switch
  - ## Loops (for, while, do-while)
  - ## break / continue

# Functions
  collapsed:: true
  - ## Declaration & Definition
  - ## Parameters & Return Types
  - ## Recursion
  - ## Lambda / Anonymous Functions (if applicable)

# Data Structures
  collapsed:: true
  - ## Arrays / Lists
  - ## Strings
  - ## Dictionaries / Maps
  - ## Sets
  - ## Stacks & Queues

# OOP (if applicable)
  collapsed:: true
  - ## Classes & Objects
  - ## Constructors & Destructors
  - ## Inheritance
  - ## Polymorphism
  - ## Encapsulation & Abstraction

# Advanced Topics
  collapsed:: true
  - ## Memory Management / Pointers (if applicable)
  - ## Concurrency / Threads
  - ## Error Handling / Exceptions
  - ## File I/O
  - ## Generics / Templates (if applicable)

# Standard Library / Built-ins
  collapsed:: true
  - (language-specific: STL, stdlib, built-in modules)

# Frameworks & Libraries
  collapsed:: true
  - (link to dedicated pages using [[Page Name]])

# More Learn
  - ## Github & Webs (trusted links only)
  - ## Master Playlists YouTube (free playlists only)
```

**Rules for code blocks:**
*   Always use fenced code blocks with the language tag: ` ```c++ `, ` ```python `, ` ```java `
*   Include comments inside code explaining what each line does.
*   Show both the code **AND** its output where relevant.
*   Keep examples minimal but complete — they must run as-is.

---

### OS Page Format

> [!NOTE]
> See [Kali Linux.md](pages/Kali Linux.md) as the reference implementation.

```text
# History
  collapsed:: true
  - How / Who / Why

# Introduction
  collapsed:: true
  - ## What is <OS>?
  - ## Advantages
  - ## Disadvantages
  - ## Use Cases

# Installation & Setup
  collapsed:: true
  - ## System Requirements
  - ## Installation Steps
  - ## First Boot Configuration

# Kernel & Architecture
  collapsed:: true
  - ## Kernel Type
  - ## Linux File System Hierarchy (for Linux distros)
  - ## Boot Process

# Shell & Terminal
  collapsed:: true
  - ## Shell Types
  - ## Essential Commands (with examples)
  - ## File Permissions
  - ## I/O Redirection & Pipes
  - ## Shell Scripting Basics

# User & Group Management
  collapsed:: true
  - ## Account Types
  - ## User Commands
  - ## Group Commands

# Package Management
  collapsed:: true
  - ## Package Manager (apt, yum, pacman, etc.)
  - ## Common Commands

# Networking
  collapsed:: true
  - ## Network Commands
  - ## Firewall / iptables
  - ## SSH

# [OS-Specific Section]
  collapsed:: true
  - (e.g., for Kali: Security Tools, Penetration Testing Workflow)
  - (e.g., for Ubuntu: Desktop Environment, Snap packages)

# More Learn
  - ## Github & Webs
  - ## Master Playlists YouTube
```

---

### Framework/Library Page Format

```text
# History
  collapsed:: true

# Introduction
  collapsed:: true
  - ## What problem does it solve?
  - ## Advantages / Disadvantages
  - ## When to use vs alternatives

# Installation & Setup
  collapsed:: true

# Core Concepts
  collapsed:: true
  - (framework-specific fundamentals)

# Common Patterns & Examples
  collapsed:: true

# Advanced Usage
  collapsed:: true

# More Learn
```

---

### Algorithm/Data Structure Format

> [!NOTE]
> See `Binary Search.md` as the reference implementation.

```text
# Explanation
  - Clear definition, purpose, real-world use cases
  - ## Real-World Analogy  (optional but recommended)
  - ## Why <Algorithm>?   (optional — key insight or motivation)

# How It Works
  collapsed:: true
  - ## Step-by-Step Process  (ASCII art / pseudocode block)
  - ## Visual Walkthrough    (traced example with sample data)

# Time & Space Complexity
  collapsed:: true
  - Plain text table: Best / Average / Worst / Space
  - Comparison to alternatives if relevant

# Implementation
  collapsed:: true
  - Use :::code-tabs for multi-language tab view (Python, C++, JS, Java, C)
  - Use logseq default code block for single-language focused snippet
  - At minimum: Python + one systems language (C++ or C)

# Recursive Variant   (optional)
  collapsed:: true
  - Use logseq default code block for the recursive version

# When to Use
  collapsed:: true
  - ## Use <Algorithm> When:   (bullet list of ✅ good cases)
  - ## Avoid When:             (bullet list of ❌ bad cases)

# Variations / Related  (optional)
  collapsed:: true
  - Use logseq default code block for each variant snippet

# Key Takeaways
  - 4–7 concise bullets summarizing the most important points
```

---

### Tool/Software Format

```text
# History
  collapsed:: true

# Introduction
  collapsed:: true
  - ## What is it?
  - ## Advantages / Disadvantages

# Installation
  collapsed:: true

# Core Features & Usage
  collapsed:: true

# Common Commands / Workflows
  collapsed:: true

# More Learn
```

---

### Concept/Theory Format

> [!IMPORTANT]
> Internal links (using `[[Page Name]]`) must be included within paragraphs or bullet points where page names are mentioned.

```text
# What is <Concept>?
  - Clear definition

# Why It Matters
  collapsed:: true

# How It Works
  collapsed:: true
  - With examples and diagrams (ASCII art)

# Real-World Applications
  collapsed:: true

# More Learn
```

---

## Code Block Styles

This project uses three code block styles. Use the right one for the right context:

### 1. Plain Fenced Block — ```` ```language ````
Use for a **single standalone snippet** inside a regular bullet.

```python
def example():
    pass
```

### 2. `:::code-note` — Single-Language Focus Block
Use for a **featured snippet** that deserves visual emphasis — a clean, dedicated display for one language. Perfect for: recursive variants, utility helpers, and built-in usage examples.

```text
:::code-note

```python
def example_highlighted():
    # Highlights a specific, important implementation detail
    pass
```
:::
```

### 3. `:::code-tabs` — Multi-Language Tab View
Use when showing the **same algorithm in multiple languages** side-by-side as switchable tabs. Perfect for: main implementation sections where you want Python, C++, JS, Java, and C all available.

```text
:::code-tabs

```python
# Python implementation
```

```c++
// C++ implementation
```

```javascript
// JavaScript implementation
```

:::
```

> [!IMPORTANT]
> Always use `:::code-tabs` for multi-language implementations, `:::code-note` for single highlighted snippets, and plain fenced blocks for inline examples within bullet text.

---

## General Rules (Apply to ALL Pages)

1.  **`collapsed:: true`** — Add to every top-level section except the first (e.g., `# Explanation` or `# History`) and last (e.g., `# Key Takeaways` or `# More Learn`). This keeps the Logseq interface clean.
2.  **Logseq Bullet Syntax** — All content must use the `- ` (dash + space) bullet format. Headings inside bullets must use `## ` or `### `.
3.  **Internal Links** — Use `[[Page Name]]` to link to other pages in the knowledge base. Never use relative file paths.
4.  **No Broken Links** — Only link to pages that actually exist in `/pages/`. If the page doesn't exist yet, create it first or leave it as plain text.
5.  **Code Block Language Tags** — Always specify the language tag. Use ```` ```bash ```` for terminal commands, ```` ```python ```` for Python, etc. See the [Code Block Styles](#code-block-styles) section.
6.  **No Promotion** — The `# More Learn` section only accepts links to trusted public resources (GitHub repositories, official docs, free YouTube playlists). Personal social media promotion is strictly prohibited.
7.  **Spelling & Grammar** — Write in clear English. Perform a spell-check before submitting.
8.  **No Duplicate Content** — If a topic is already covered in another page, link to it with `[[Page Name]]` instead of duplicating information.
9.  **SEO Keywords** — Always end the `keywords` frontmatter field with: `, VR-Rathod, Code-Note, code note vr, vr book`.
10. **File Size** — There is no maximum size limit. Deeper, more comprehensive pages are highly valued over brief summaries.
11. **Code Comments** — All code snippets must have inline comments explaining key lines. Include command output where relevant.
12. **Overflow Prevention** — In C, C++, and Java, always use `mid = low + (high - low) / 2` instead of `(low + high) / 2` when implementing binary search to prevent integer overflow. Make sure to document this in your code comments.

---

## Submitting Your Contribution

1.  **Fork** the repository.
2.  **Create your page** inside the `/pages/` directory following the correct template and general rules.
3.  **Add a link** to your page in `index.md` under the correct category section.
4.  **Submit a Pull Request (PR)** with a clear, descriptive title (e.g., `Add: <Page Name>` or `Update: <Page Name>`).
5.  In the PR description, briefly outline what content was added or updated.

If you have any questions, feel free to reach out via the repository's GitHub Issues or check the contact email listed in the `README.md`.

Thank you for contributing! 🦾
