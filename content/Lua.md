---
date: 2025-01-01T11:35:35+05:30
lastmod: 2026-05-21T13:09:49+05:30

seoTitle: Lua Programming Language – Syntax Reference and Scripting Guide
description: "Lua reference covering tables, metatables, coroutines, closures, modules, and embedding Lua in C/C++ applications for game scripting and configuration."
keywords: "Lua programming, Lua language, tables, metatables, coroutines, closures, modules, game scripting, C embedding, Lua 5.4, syntax reference, cheat sheet"
---

- # History
	- **How**:
	  Lua is a lightweight, high-level, embeddable scripting language, created in 1993 by Roberto Ierusalimschy, Luiz Henrique de Figueiredo, and Waldemar Celes at the **Pontifical Catholic University of Rio de Janeiro**, Brazil. Lua was originally designed for embedded systems and to be used as a **scripting language** for applications. It was developed to be **fast**, **small**, and **flexible**, making it suitable for a variety of applications, from gaming to networking.
		-
		- **Name**: Lua (means "moon" in Portuguese)
		- **Created**: 1993
		- **Creators**: Roberto Ierusalimschy, Luiz Henrique de Figueiredo, Waldemar Celes
		- **Primary Usage**: Embedded scripting language for applications
		-
	- ### Why was Lua created?
		- Lua was created because there was a need for a lightweight, efficient, and flexible scripting language that could easily be embedded into existing applications. The developers were aiming for a language that had low memory consumption while providing powerful capabilities, especially for applications that required customization or scripting.
-
- # Intro
	- ## Introduction to Lua:
		- Lua is a **scripting language** with a focus on simplicity, flexibility, and performance. It’s widely used in the gaming industry, embedded systems, and other applications that require fast scripting.
-
	- ## Advanced Topics:
		- **Metatables and Metamethods**: Lua provides a feature known as metatables, which allows users to define custom behavior for tables, such as defining custom operators (`+`, `-`, etc.) or controlling the behavior of table indexing.
		- **Coroutines**: Lua has built-in support for cooperative multitasking with coroutines, which are lighter than threads and allow for managing multiple tasks concurrently.
		- **Garbage Collection**: Lua uses an automatic garbage collection mechanism to manage memory effectively.
-
	- ## Disadvantages:
		- **Limited Standard Library**: Lua has a small standard library, which means you often have to rely on external libraries for additional functionality.
		- **Manual Memory Management**: While Lua uses garbage collection, developers still need to manage memory carefully to avoid performance bottlenecks.
		- **No Direct Object-Oriented Support**: Lua doesn’t have built-in support for object-oriented programming (OOP), but you can simulate it with tables and metatables.
-
- # Notes
- # Libs & Framework
	- [[LuaSocket]]: A Lua library for networking. It provides support for TCP and UDP sockets.
	- [[LuaRocks]]: A package manager for Lua, which helps you install and manage Lua modules.
	- [[Love]] : A framework for making 2D games in Lua.
-
- # More Learn
	- Explore the following links for valuable resources, communities, and tools to enhance your skills : -