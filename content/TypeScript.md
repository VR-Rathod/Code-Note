---
date: 2024-10-31T19:09:35-07:00
lastmod: 2026-05-18T10:12:55+05:30

seoTitle: TypeScript Programming Reference – In-Depth Guide to Types, Generics, and Architecture
description: "Comprehensive, highly detailed TypeScript reference covering basic to advanced concepts including type checking, mapped types, conditional types, generic programming, decorators, React integration, and design patterns."
keywords: "typescript, ts, typescript in-depth, typescript programming, ts reference, interfaces, generics, utility types, decorators, strict mode, conditional types, mapped types, modern javascript, ts cheatsheet, VR-Rathod, Code-Note"
displayTitle: TypeScript
---

- # History
  collapsed:: true
	- **How**:
		- Developed by **Microsoft** in 2012.
		- Designed as a strict syntactical superset of JavaScript, adding optional static typing to the language.
		- Transcompiles to clean, standard JavaScript.
	-
	- **Who**:
		- **Anders Hejlsberg** — lead architect of C# and creator of Delphi and Turbo Pascal.
	-
	- **Why**:
		- JavaScript was increasingly being used for massive, complex applications, but lacked the robust type safety and object-oriented paradigms necessary to maintain large codebases.
		- To provide better tooling (IntelliSense, automated refactoring, code navigation).
		- To allow developers to use modern/future ECMAScript features before browser support.
-
- # Introduction
  collapsed:: true
	- ## Core Philosophy
	  collapsed:: true
		- TypeScript's type system is **structural**, not nominal. This means if an object has the required properties of an interface, it is considered to be of that type, regardless of explicit declaration (often called "duck typing").
	-
	- ## Advantages
	  collapsed:: true
		- **Static Typing** — Prevents a vast category of runtime errors (e.g., `undefined is not a function`).
		- **Incredible Developer Experience (DX)** — Auto-completion, inline documentation, and instant error highlighting in VS Code.
		- **Object-Oriented & Functional Support** — First-class support for classes, interfaces, generics, and higher-order functions.
		- **Ecosystem Compatibility** — `DefinitelyTyped` (`@types/*`) provides type definitions for almost all popular JS libraries.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Compilation Overhead** — Code must be built/transpiled before execution (though tools like `esbuild`, `swc`, and `ts-node` make this fast).
		- **Complex Type System** — Advanced features like conditional types and generic inference can become difficult to read.
		- **False Sense of Security** — TypeScript type checks happen at *compile time*, not runtime. If incoming API data is malformed, TypeScript won't catch it natively without runtime validation libraries like Zod or Yup.
-
- # Basics & Primitives
  collapsed:: true
	- ## Primitive Types
	  collapsed:: true
		- ```typescript
		  let isDone: boolean = false;
		  let decimal: number = 6;
		  let hex: number = 0xf00d;
		  let binary: number = 0b1010;
		  let color: string = "blue";
		  
		  // BigInt
		  let big: bigint = 100n;
		  
		  // Symbol
		  let sym: symbol = Symbol("key");
		  ```
	-
	- ## Arrays & Tuples
	  collapsed:: true
		- ```typescript
		  // Arrays
		  let numbers: number[] = [1, 2, 3];
		  let genericNumbers: Array<number> = [1, 2, 3];
		  
		  // Tuples (Fixed length & typed arrays)
		  let tuple: [string, number, boolean] = ["hello", 10, true];
		  
		  // Tuple destructuring
		  const [str, num, flag] = tuple;
		  
		  // Optional tuple elements
		  let optionalTuple: [number, string?] = [10];
		  
		  // Rest elements in Tuples
		  let restTuple: [string, ...number[]] = ["scores", 10, 20, 30];
		  ```
	-
	- ## Special Types
	  collapsed:: true
		- ```typescript
		  // any: Disables type checking (avoid!)
		  let looselyTyped: any = 4;
		  looselyTyped.ifItExists(); // No compiler error
		  
		  // unknown: Type-safe counterpart of any. Forces you to perform type checks.
		  let notSure: unknown = "hello";
		  if (typeof notSure === "string") {
		      console.log(notSure.length); // OK
		  }
		  
		  // void: Absence of any type (usually for function returns)
		  function logMessage(msg: string): void {
		      console.log(msg);
		  }
		  
		  // never: Represents values that never occur (e.g., throwing functions or exhaustive checks)
		  function throwError(msg: string): never {
		      throw new Error(msg);
		  }
		  function infiniteLoop(): never {
		      while (true) {}
		  }
		  ```
	-
	- ## Type Assertions
	  collapsed:: true
		- ```typescript
		  let someValue: unknown = "this is a string";
		  
		  // 'as' syntax (preferred, especially in JSX/TSX)
		  let strLength: number = (someValue as string).length;
		  
		  // Angle-bracket syntax
		  let strLen2: number = (<string>someValue).length;
		  
		  // 'as const' (Const Assertions)
		  // Infers the narrowest possible literal type and makes properties readonly.
		  const config = {
		      endpoint: "https://api.example.com",
		      method: "GET"
		  } as const;
		  // config.method is specifically "GET", not string.
		  ```
-
- # Functions
  collapsed:: true
	- ## Typing Parameters and Returns
	  collapsed:: true
		- ```typescript
		  function add(x: number, y: number): number {
		      return x + y;
		  }
		  
		  // Arrow functions
		  const multiply = (x: number, y: number): number => x * y;
		  ```
	-
	- ## Optional, Default, and Rest Parameters
	  collapsed:: true
		- ```typescript
		  // Optional (?)
		  function greet(name: string, greeting?: string) {
		      return greeting ? `${greeting}, ${name}` : `Hello, ${name}`;
		  }
		  
		  // Default
		  function pow(value: number, exponent: number = 2): number {
		      return value ** exponent;
		  }
		  
		  // Rest Parameters
		  function sum(prefix: string, ...numbers: number[]): string {
		      return prefix + numbers.reduce((a, b) => a + b, 0);
		  }
		  ```
	-
	- ## Function Overloads
	  collapsed:: true
		- TypeScript allows multiple function signatures for a single implementation.
		- ```typescript
		  // Overload signatures
		  function makeDate(timestamp: number): Date;
		  function makeDate(m: number, d: number, y: number): Date;
		  
		  // Implementation signature
		  function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
		      if (d !== undefined && y !== undefined) {
		          return new Date(y, mOrTimestamp - 1, d);
		      } else {
		          return new Date(mOrTimestamp);
		      }
		  }
		  ```
-
- # Interfaces & Type Aliases
  collapsed:: true
	- ## Interfaces
	  collapsed:: true
		- Used primarily for defining object shapes.
		- ```typescript
		  interface User {
		      id: number;
		      name: string;
		      email?: string; // Optional
		      readonly createdAt: Date; // Readonly
		  }
		  
		  const user: User = { id: 1, name: "Alice", createdAt: new Date() };
		  // user.createdAt = new Date(); // Error
		  ```
	-
	- ## Interface Inheritance (Extending)
	  collapsed:: true
		- ```typescript
		  interface Animal {
		      name: string;
		  }
		  
		  interface Dog extends Animal {
		      breed: string;
		  }
		  ```
	-
	- ## Declaration Merging
	  collapsed:: true
		- Interfaces with the same name will merge their properties.
		- ```typescript
		  interface Window {
		      title: string;
		  }
		  interface Window {
		      ts: TypeScriptAPI;
		  }
		  // Window now has both 'title' and 'ts'
		  ```
	-
	- ## Type Aliases
	  collapsed:: true
		- Used to give a name to any type (primitives, unions, intersections, functions, etc.)
		- ```typescript
		  type ID = string | number;
		  
		  type Point = {
		      x: number;
		      y: number;
		  };
		  
		  // Intersection types
		  type Employee = User & { salary: number };
		  ```
	-
	- ## Interface vs Type
	  collapsed:: true
		- Use `interface` for public API definitions, class contracts, and object shapes where declaration merging might be useful.
		- Use `type` for complex types, unions, intersections, utility types, and tuples.
-
- # Classes & Object-Oriented Programming
  collapsed:: true
	- ## Basic Class & Access Modifiers
	  collapsed:: true
		- ```typescript
		  class Person {
		      public name: string;        // Accessible anywhere (default)
		      protected age: number;      // Accessible within class and subclasses
		      private ssn: string;        // Accessible only within this class
		      readonly id: number;        // Cannot be changed after initialization
		  
		      constructor(name: string, age: number, ssn: string) {
		          this.name = name;
		          this.age = age;
		          this.ssn = ssn;
		          this.id = Math.random();
		      }
		  }
		  ```
	-
	- ## Parameter Properties (Shorthand)
	  collapsed:: true
		- ```typescript
		  class Car {
		      // Automatically creates and assigns 'make' and 'model'
		      constructor(public make: string, private model: string) {}
		  }
		  ```
	-
	- ## Getters and Setters
	  collapsed:: true
		- ```typescript
		  class Temperature {
		      private _celsius: number = 0;
		  
		      get fahrenheit() {
		          return this._celsius * 9 / 5 + 32;
		      }
		  
		      set fahrenheit(value: number) {
		          this._celsius = (value - 32) * 5 / 9;
		      }
		  }
		  ```
	-
	- ## Abstract Classes
	  collapsed:: true
		- Base classes from which other classes may be derived. They cannot be instantiated directly.
		- ```typescript
		  abstract class Shape {
		      abstract getArea(): number; // Must be implemented
		  
		      printArea() { // Optional to override
		          console.log(`Area: ${this.getArea()}`);
		      }
		  }
		  
		  class Circle extends Shape {
		      constructor(public radius: number) { super(); }
		      getArea() { return Math.PI * this.radius ** 2; }
		  }
		  ```
	-
	- ## Implements Keyword
	  collapsed:: true
		- Forces a class to adhere to an interface.
		- ```typescript
		  interface Logger {
		      log(msg: string): void;
		  }
		  
		  class ConsoleLogger implements Logger {
		      log(msg: string) { console.log(msg); }
		  }
		  ```
-
- # Enums
  collapsed:: true
	- ## Numeric Enums
	  collapsed:: true
		- ```typescript
		  enum Direction {
		      Up = 1, // Starts at 1
		      Down,   // 2
		      Left,   // 3
		      Right   // 4
		  }
		  ```
	-
	- ## String Enums
	  collapsed:: true
		- Provides readable output at runtime.
		- ```typescript
		  enum LogLevel {
		      ERROR = "ERROR",
		      WARN = "WARN",
		      INFO = "INFO"
		  }
		  ```
	-
	- ## Const Enums
	  collapsed:: true
		- Completely removed during compilation and inlined to save memory.
		- ```typescript
		  const enum Roles {
		      ADMIN = 1,
		      USER = 2
		  }
		  let role = Roles.ADMIN; // Compiles simply to: let role = 1;
		  ```
-
- # Advanced Types & Type Narrowing
  collapsed:: true
	- ## Union Types
	  collapsed:: true
		- ```typescript
		  function formatCommandline(command: string | string[]) {
		      if (typeof command === "string") {
		          return command.trim();
		      } else {
		          return command.join(" ").trim();
		      }
		  }
		  ```
	-
	- ## Type Guards (Narrowing)
	  collapsed:: true
		- ```typescript
		  // typeof: string, number, boolean, symbol
		  // instanceof: custom classes, arrays, Date
		  
		  class Bird { fly() {} }
		  class Fish { swim() {} }
		  
		  function move(animal: Bird | Fish) {
		      if (animal instanceof Bird) {
		          animal.fly();
		      } else {
		          animal.swim();
		      }
		  }
		  
		  // 'in' operator
		  type User = { name: string; role: string };
		  type Admin = { name: string; permissions: string[] };
		  
		  function checkUser(user: User | Admin) {
		      if ("permissions" in user) {
		          console.log(user.permissions); // narrowed to Admin
		      }
		  }
		  ```
	-
	- ## Custom Type Predicates (User-Defined Type Guards)
	  collapsed:: true
		- ```typescript
		  function isFish(pet: Fish | Bird): pet is Fish {
		      return (pet as Fish).swim !== undefined;
		  }
		  
		  let pet = getSmallPet();
		  if (isFish(pet)) {
		      pet.swim(); // Compiler knows pet is Fish
		  }
		  ```
	-
	- ## Discriminated Unions
	  collapsed:: true
		- Highly useful for Redux actions or state machines.
		- ```typescript
		  interface Square { kind: "square"; size: number; }
		  interface Rectangle { kind: "rectangle"; width: number; height: number; }
		  interface Circle { kind: "circle"; radius: number; }
		  
		  type Shape = Square | Rectangle | Circle;
		  
		  function getArea(shape: Shape) {
		      switch (shape.kind) {
		          case "square": return shape.size ** 2;
		          case "rectangle": return shape.width * shape.height;
		          case "circle": return Math.PI * shape.radius ** 2;
		          default:
		              // Exhaustiveness checking
		              const _exhaustiveCheck: never = shape;
		              return _exhaustiveCheck;
		      }
		  }
		  ```
-
- # Generics (The Heart of Reusable Code)
  collapsed:: true
	- Generics act as variables for types, allowing components to work over a variety of types while retaining type safety.
	- ## Generic Functions
	  collapsed:: true
		- ```typescript
		  function identity<T>(arg: T): T {
		      return arg;
		  }
		  
		  let s = identity<string>("hello");
		  let n = identity(42); // Type argument inference
		  ```
	-
	- ## Generic Interfaces & Classes
	  collapsed:: true
		- ```typescript
		  interface KeyValuePair<K, V> {
		      key: K;
		      value: V;
		  }
		  let pair: KeyValuePair<number, string> = { key: 1, value: "A" };
		  
		  class DataStore<T> {
		      private data: T[] = [];
		      add(item: T) { this.data.push(item); }
		      getAll(): T[] { return this.data; }
		  }
		  ```
	-
	- ## Generic Constraints
	  collapsed:: true
		- Restricting the generic type to ensure it possesses certain properties.
		- ```typescript
		  interface HasLength {
		      length: number;
		  }
		  
		  function logLength<T extends HasLength>(arg: T): T {
		      console.log(arg.length); // Guaranteed to exist
		      return arg;
		  }
		  
		  logLength("string"); // OK
		  logLength([1, 2, 3]); // OK
		  // logLength(10); // Error: number doesn't have length
		  ```
	-
	- ## Using Type Parameters in Generic Constraints (`keyof`)
	  collapsed:: true
		- ```typescript
		  function getProperty<T, K extends keyof T>(obj: T, key: K) {
		      return obj[key];
		  }
		  
		  let x = { a: 1, b: 2, c: 3 };
		  getProperty(x, "a"); // OK
		  // getProperty(x, "m"); // Error: "m" is not keyof x
		  ```
-
- # Utility Types
  collapsed:: true
	- TypeScript provides global utility types to facilitate common type transformations.
	- ## Modifying Object Structures
	  collapsed:: true
		- ```typescript
		  interface Todo {
		      title: string;
		      description: string;
		      completed: boolean;
		  }
		  
		  // Partial<T>: All properties optional
		  type OptionalTodo = Partial<Todo>;
		  
		  // Required<T>: All properties required
		  type StrictTodo = Required<OptionalTodo>;
		  
		  // Readonly<T>: All properties readonly
		  type LockedTodo = Readonly<Todo>;
		  
		  // Pick<T, K>: Select specific properties
		  type TodoPreview = Pick<Todo, "title" | "completed">;
		  
		  // Omit<T, K>: Exclude specific properties
		  type TodoMeta = Omit<Todo, "description">;
		  
		  // Record<K, T>: Create dictionary/map types
		  type PageInfo = { title: string };
		  type Page = "home" | "about" | "contact";
		  const nav: Record<Page, PageInfo> = {
		      home: { title: "Home" },
		      about: { title: "About" },
		      contact: { title: "Contact" }
		  };
		  ```
	-
	- ## Union/Intersection Extraction
	  collapsed:: true
		- ```typescript
		  // Exclude<T, U>: Remove U from T
		  type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
		  
		  // Extract<T, U>: Intersect T and U
		  type T1 = Extract<"a" | "b" | "c", "a" | "f">; // "a"
		  
		  // NonNullable<T>: Removes null and undefined
		  type T2 = NonNullable<string | number | undefined>; // string | number
		  ```
	-
	- ## Function Utilities
	  collapsed:: true
		- ```typescript
		  function fetchUser(id: number, active: boolean): { id: number, name: string } {
		      return { id, name: "VR" };
		  }
		  
		  // Parameters<T>: Gets a tuple of function parameters
		  type FuncParams = Parameters<typeof fetchUser>; // [id: number, active: boolean]
		  
		  // ReturnType<T>: Gets the return type
		  type UserReturn = ReturnType<typeof fetchUser>; // { id: number, name: string }
		  ```
-
- # Deep Type Systems (Mapped & Conditional Types)
  collapsed:: true
	- ## Mapped Types
	  collapsed:: true
		- Creating a new type by iterating over the keys of an existing type.
		- ```typescript
		  type Flags = {
		      option1: boolean;
		      option2: boolean;
		  }
		  
		  // Maps over K in Flags, making them all readonly
		  type ReadonlyFlags = {
		      readonly [K in keyof Flags]: Flags[K];
		  }
		  
		  // Removing Modifiers (using -)
		  type Mutable<T> = {
		      -readonly [P in keyof T]: T[P];
		  };
		  ```
	-
	- ## Conditional Types
	  collapsed:: true
		- Uses a ternary operator syntax at the type level: `T extends U ? X : Y`
		- ```typescript
		  type IsString<T> = T extends string ? true : false;
		  
		  type A = IsString<"hello">; // true
		  type B = IsString<123>;     // false
		  
		  // Nested Conditional
		  type TypeName<T> =
		      T extends string ? "string" :
		      T extends number ? "number" :
		      T extends boolean ? "boolean" :
		      "object";
		  ```
	-
	- ## The `infer` Keyword
	  collapsed:: true
		- Used within conditional types to extract inner types.
		- ```typescript
		  // Extract the type of an Array
		  type Flatten<T> = T extends Array<infer U> ? U : T;
		  
		  type C = Flatten<string[]>; // string
		  type D = Flatten<number>;   // number
		  ```
	-
	- ## Template Literal Types (TS 4.1+)
	  collapsed:: true
		- String manipulation at the type level.
		- ```typescript
		  type World = "world";
		  type Greeting = `hello ${World}`; // "hello world"
		  
		  type Events = "click" | "hover";
		  type Handlers = `on${Capitalize<Events>}`; // "onClick" | "onHover"
		  ```
-
- # Decorators (Metadata & Metaprogramming)
  collapsed:: true
	- Enable metaprogramming syntax for class declarations and members. *Requires `experimentalDecorators: true` in tsconfig.*
	- ## Class Decorators
		- ```typescript
		  function Sealed(constructor: Function) {
		      Object.seal(constructor);
		      Object.seal(constructor.prototype);
		  }
		  
		  @Sealed
		  class BugReport {
		      type = "report";
		      title: string;
		      constructor(t: string) { this.title = t; }
		  }
		  ```
	-
	- ## Method Decorators
		- ```typescript
		  function LogPerformance() {
		      return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		          const originalMethod = descriptor.value;
		          descriptor.value = function(...args: any[]) {
		              console.time(propertyKey);
		              const result = originalMethod.apply(this, args);
		              console.timeEnd(propertyKey);
		              return result;
		          };
		      };
		  }
		  
		  class Task {
		      @LogPerformance()
		      run() {
		          // Heavy task
		      }
		  }
		  ```
-
- # TypeScript & React Integration
  collapsed:: true
	- ## Typing Components
		- ```tsx
		  import React, { FC, useState } from 'react';
		  
		  interface ButtonProps {
		      label: string;
		      onClick: () => void;
		      variant?: "primary" | "secondary"; // Optional
		  }
		  
		  // Using React.FC (Functional Component)
		  const Button: FC<ButtonProps> = ({ label, onClick, variant = "primary" }) => {
		      return (
		          <button className={`btn-${variant}`} onClick={onClick}>
		              {label}
		          </button>
		      );
		  };
		  ```
	-
	- ## Typing Hooks
		- ```tsx
		  // useState: Infers string, but can be explicit
		  const [name, setName] = useState<string>("");
		  
		  // useRef: Explicit for HTML elements
		  const inputRef = useRef<HTMLInputElement>(null);
		  
		  // Context
		  interface AuthContextType { user: string | null; login: () => void }
		  const AuthContext = createContext<AuthContextType | null>(null);
		  ```
	-
	- ## Typing Events
		- ```tsx
		  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		      console.log(e.target.value);
		  };
		  
		  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		      e.preventDefault();
		  };
		  ```
-
- # Compiler Configuration (`tsconfig.json`)
  collapsed:: true
	- The configuration file controls how strict the compiler is and how the code is emitted.
	- ```json
	  {
	    "compilerOptions": {
	      "target": "ES2022",           // JavaScript version to compile to
	      "module": "CommonJS",         // Module system
	      "lib": ["DOM", "ES2022"],     // Libraries available
	      "strict": true,               // Enables ALL strict type checking options
	      "noImplicitAny": true,        // Error on 'any' inference
	      "strictNullChecks": true,     // Checks for null/undefined strictly
	      "esModuleInterop": true,      // Better compatibility with CommonJS modules
	      "skipLibCheck": true,         // Skip type checking of declaration files (faster builds)
	      "forceConsistentCasingInFileNames": true
	    },
	    "include": ["src/**/*"],
	    "exclude": ["node_modules", "**/*.spec.ts"]
	  }
	  ```
-
- # More Learn
  
  Explore the following links for valuable resources, communities, and tools to enhance your skills : -
	-
	- ## Github & Webs
		- [TypeScript Official Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
		- [TypeScript Deep Dive (Basarat)](https://basarat.gitbook.io/typescript/)
		- [React+TypeScript Cheatsheets](https://react-typescript-cheatsheet.netlify.app/)
		- [Design patterns in TypeScript](https://github.com/torokmark/design_patterns_in_typescript)
		- [Type Challenges (GitHub)](https://github.com/type-challenges/type-challenges)
	-