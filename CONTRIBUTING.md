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
- Use kebab-case only for multi-word algorithmic pages: `binary-search.md`, `dijkstras-algorithm.md`
- Place all pages inside the `/pages/` directory
- Link pages in `index.md` under the correct section using Logseq `[[Page Name]]` syntax

---

## Frontmatter (Required on Every Page)

Every page **must** start with SEO frontmatter:

```yaml
---
seoTitle: <Page Name> Complete Guide – <Short Description>
description: "Comprehensive <topic> reference covering <key topics>."
keywords: "<keyword1>, <keyword2>, ..., VR-Rathod, Code-Note, code note vr, vr book , <You'r name / your code tags>"
---
```

- `seoTitle` — Keep under 60 characters. Format: `Topic Name – Subtitle`
- `description` — 1-2 sentences, 120-160 characters. Mention key subtopics.
- `keywords` — Comma-separated. Always end with the standard author tags.

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
- Always use fenced code blocks with the language tag: ` ```cpp `, ` ```python `, ` ```java `
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

```
# What is <Algorithm/DS>?
  - Definition, purpose, real-world use cases

# How It Works
  collapsed:: true
  - Step-by-step explanation with diagram (ASCII art if needed)

# Complexity
  collapsed:: true
  - Time: O(?) — best / average / worst
  - Space: O(?)

# Implementation
  collapsed:: true
  - ## Python
  - ## Java
  - ## C++
  - (at least 2 languages)

# Variations / Related
  collapsed:: true

# More Learn
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

# Related Concepts
  collapsed:: true
  - [[Related Page 1]]
  - [[Related Page 2]]

# More Learn
```

---

## General Rules (Apply to ALL Pages)

1. **collapsed:: true** — Add to every top-level section except the last `# More Learn` section. This keeps Logseq clean.
2. **Logseq bullet syntax** — All content must use `- ` (dash + space, by default will apply if you are using Logseq) bullet format. Headings inside bullets use `## ` or `### `.
3. **Internal links** — Use `[[Page Name]]` to link to other pages in the knowledge base. Never use relative file paths.
4. **No broken links** — Only link to pages that actually exist in `/pages/`. If the page doesn't exist yet, create it or leave plain text.
5. **Code blocks** — Always specify the language. Use ```` ```bash ```` for terminal commands, ```` ```python ```` for Python, etc.
6. **No promotion** — The `# More Learn` section only accepts links to trusted public resources: GitHub repos, official docs, free YouTube playlists. No personal social media promotion.
7. **Spelling & grammar** — Write in clear English. Use spell-check before submitting.
8. **No duplicate content** — If a topic is already covered in another page, link to it with `[[Page Name]]` instead of repeating it.
9. **SEO keywords** — Always end the `keywords` frontmatter field with `, VR-Rathod, Code-Note, code note vr, vr book`.
10. **File size** — There is no maximum size. Bigger, more detailed pages are better. Depth is valued over brevity.

---

## Submitting Your Contribution

1. Fork the repository
2. Create your page in `/pages/` following the correct format above
3. Add a link to your page in `index.md` under the correct section
4. Submit a Pull Request with a clear title: `Add: <Page Name>` or `Update: <Page Name>`
5. In the PR description, briefly describe what you added or changed

If you have any questions, contact via the repository issues or email listed in the README.

Thank you for contributing! 🦾
