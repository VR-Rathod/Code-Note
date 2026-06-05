# Contributing to Free Code Notes

Thank you for contributing! This guide defines the **exact format and structure** every page must follow. Consistent structure makes the knowledge base easy to navigate in Logseq and SEO-friendly on the web.

---

## Page Types & Which Format to Use

| Page Type | Format to Follow |
|---|---|
| Programming Language | [Programming Page Format](#programming-page-format) |
| Operating System / Distro | [OS Page Format](#os-page-format) |
| Framework / Library | [Framework Page Format](#frameworklibrary-page-format) |
| Algorithm / Data Structure | [Algorithm Page Format](#algorithmdata-structure-format) |
| Tool / Software | [Tool Page Format](#toolsoftware-format) |
| Concept / Theory | [Concept Page Format](#concepttheory-format) |

---

## File Naming Convention

- Use the **exact display name** as the filename: `Kali Linux.md`, `Cpp.md`, `React js.md`
- Use kebab-case only for multi-word algorithmic pages: `Binary Search.md`, `Dijkstras Algorithm.md`
- Place all pages inside the `/pages/` directory
- Link pages in `index.md` under the correct section using Logseq `[[Page Name]]` syntax

---

## Frontmatter (Required on Every Page)

Every page **must** start with SEO frontmatter:

```yaml

seoTitle: <Page Name> Complete Guide – <Short Description>
description: "Comprehensive <topic> reference covering <key topics>."
keywords: "<keyword1>, <keyword2>, ..., VR-Rathod, Code-Note,Vaibhav Rathod, vaibhav, Vaibhav, VR, code note vr, vr book , <You'r name / your code tags>"
displayTitle: Better Title  # This is title of page (not required for  all page)
`seoTitle` — Keep under 60 characters. Format: `Topic Name – Subtitle`
`description` — 1-2 sentences, 120-160 characters. Mention key subtopics.
`keywords` — Comma-separated. Always end with the standard author tags.
comments: false/true (For Enabling or disable comments)
treeTitle: main page - sub page - sub page
```

### For Single Writer
```yaml
author: Your Name (Default Vaibav Rathod) 
authorUrl: Youe Website URl (Default Git profile VR-Rathod)
```

### For Multiple writers
```yaml
authors:
  - name: Name 1
    url: Url 1

  - name : Name 2
    url: Url 2
```
---

## Programming Page Format

This is the **primary format**. See `Cpp.md` or `Java.md` as reference implementations.

```
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
- Always use fenced code blocks with the language tag: ` ```c++ `, ` ```python `, ` ```java `
- Include comments inside code explaining what each line does
- Show both the code AND its output where relevant
- Keep examples minimal but complete — they must run as-is

---

## OS Page Format

See `Kali Linux.md` as the reference implementation.

```
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

## Framework/Library Page Format

```
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

## Algorithm/Data Structure Format

See `Binary Search.md` or `` as reference implementations.

```
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

## Tool/Software Format

```
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

## Concept/Theory Format
[[internal link must be inthere pera or bullte points name menastion]]

```
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

## Code Block Formats

This project uses three code block styles. Use the right one for the right context:

### 1. Plain Fenced Block — ```` ```language ````
Use for a **single standalone snippet** inside a regular bullet.
```python
def example():
    pass
```

### 2. `:::code-note` — Single-Language Focus Block
Use for a **featured snippet** that deserves visual emphasis — a clean, dedicated display for one language.
Perfect for: recursive variants, utility helpers, built-in usage examples.


### 3. `:::code-tabs` — Multi-Language Tab View
Use when showing the **same algorithm in multiple languages** side by side as switchable tabs.
Perfect for: main implementation sections where you want Python, C++, JS, Java, C all available.
```
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

> **Rule:** Always use `:::code-tabs` for multi-language implementations, `:::code-note` for single highlighted snippets, and plain fenced blocks for inline examples within bullet text.

---

## General Rules (Apply to ALL Pages)

1. **collapsed:: true** — Add to every top-level section except the first (`# Explanation`) and last (`# Key Takeaways`). This keeps Logseq clean.
2. **Logseq bullet syntax** — All content must use `- ` (dash + space, by default will apply if you are using Logseq) bullet format. Headings inside bullets use `## ` or `### `.
3. **Internal links** — Use `[[Page Name]]` to link to other pages in the knowledge base. Never use relative file paths.
4. **No broken links** — Only link to pages that actually exist in `/pages/`. If the page doesn't exist yet, create it or leave plain text.
5. **Code blocks** — Always specify the language tag. Use ```` ```bash ```` for terminal commands, ```` ```python ```` for Python, etc. See [Code Block Formats](#code-block-formats) for `:::code-note` and `:::code-tabs`.
6. **No promotion** — The `# More Learn` section only accepts links to trusted public resources: GitHub repos, official docs, free YouTube playlists. No personal social media promotion.
7. **Spelling & grammar** — Write in clear English. Use spell-check before submitting.
8. **No duplicate content** — If a topic is already covered in another page, link to it with `[[Page Name]]` instead of repeating it.
9. **SEO keywords** — Always end the `keywords` frontmatter field with `, VR-Rathod, Code-Note, code note vr, vr book`.
10. **File size** — There is no maximum size. Bigger, more detailed pages are better. Depth is valued over brevity.
11. **Code comments** — All code snippets must have inline comments explaining key lines. Show output where relevant.
12. **Overflow prevention** — In C/C++/Java, always use `mid = low + (high - low) / 2` instead of `(low + high) / 2` when doing binary search to prevent integer overflow. Document this in your code.

---

## Submitting Your Contribution

1. Fork the repository
2. Create your page in `/pages/` following the correct format above
3. Add a link to your page in `index.md` under the correct section
4. Submit a Pull Request with a clear title: `Add: <Page Name>` or `Update: <Page Name>`
5. In the PR description, briefly describe what you added or changed

If you have any questions, contact via the repository issues or email listed in the README.

Thank you for contributing! 🦾
