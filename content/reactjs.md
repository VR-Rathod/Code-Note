---
date: 2026-03-24T17:12:17+05:30
lastmod: 2026-04-03T17:55:18+05:30

seoTitle: React.js Reference – Components, Hooks, and State Management Guide
description: "React reference covering functional components, hooks, context, Redux, React Router, performance optimization, React 18 features, and testing with React."
keywords: "reactjs, React, React.js, components, hooks, useState, useEffect, context, Redux, React Router, React 18, React Testing Library"
author: Nirmit Kotadiya
authorUrl: https://github.com/nirmitkotadiya
---

- # 📜 **History**
	- **How**:
		- Developed by Jordan Walke, a software engineer at Facebook, in 2011.
		- First deployed on Facebook’s newsfeed in 2011 and later on Instagram in 2012.
		- Inspired by XHP (an HTML component library for PHP) to improve UI development.
	- **Who**:
		- Created by **Jordan Walke** at **Facebook** (now Meta).
		- Maintained by Meta and a community of developers.
	- **Why**:
		- To build large-scale, dynamic web applications with better performance and maintainability.
		- To address the challenge of complex UI rendering and state management in JavaScript-heavy apps.
		- Promotes the **component-based architecture** for reusable and manageable code.
- # 📘 **Intro**
	- React is an open-source JavaScript library used for building user interfaces, primarily for single-page applications. It enables developers to create large web applications that can update and render efficiently in response to data changes. React encourages a declarative and component-based programming model, promoting reusability and maintainability.
	- - ## ✅ **Advantages**
		- Component-Based Architecture for better code reuse and scalability.
		- Virtual DOM enhances performance by minimizing direct DOM manipulation.
		- Strong ecosystem and community support with rich tooling (Redux, React Router, etc.).
		- Supports **Asynchronous Programming** (Promises, Async/Await).
		- Works well with **JavaScript Design Patterns** (Module, Singleton, Observer).
		- Embraces **Prototypal Inheritance** and **ES6 Classes** for advanced object-oriented capabilities.
		- Supports integration with **TypeScript** for typed JavaScript development.
	- ## ⚠️ **Disadvantages**
		- Steeper learning curve due to JSX and component lifecycle understanding.
		- **Browser inconsistencies** in older or unsupported environments.
		- **Lack of strong typing** in plain JavaScript can lead to **runtime errors**.
		- Requires boilerplate setup (though improved via Create React App, Vite, Next.js, etc.).
		- Can get **complex in large-scale applications**, especially with deep component trees and state management.
- # 🧾 **Notes**
	- ## 📌 Core Concepts
		- **JSX (JavaScript XML)**  
		  Syntax extension allowing HTML to be written within JavaScript. It’s syntactic sugar for `React.createElement()`.
		- **Components**  
		  Building blocks of React UIs. Two types:
			- **Functional Components** – Now standard with Hooks.
			- **Class Components** – Legacy, but still relevant in older codebases.
		- **Props (Properties)**  
		  Read-only inputs passed to components, making them reusable.
		- **State**  
		  Mutable data managed within components. Changes trigger re-renders.
		- **Hooks**  
		  Functions that let functional components use state and lifecycle features. Examples:
			- `useState`, `useEffect`, `useContext`, `useReducer`, `useMemo` etc...
	- **Virtual DOM**  
	  React maintains a lightweight copy of the real DOM and performs diffing to efficiently update the UI.
	- ## ⚙️ Component Lifecycle (Class-Based)
	    
	  1. `constructor()`
	  2. `static getDerivedStateFromProps()`
	  3. `render()`
	  4. `componentDidMount()`
	  5. `shouldComponentUpdate()`
	  6. `getSnapshotBeforeUpdate()`
	  7. `componentDidUpdate()`
	  8. `componentWillUnmount()`
		- >Note: Hooks replace lifecycle methods in functional components.
	- ## 🏗️ State Management Options
	- **Local State** – `useState`, `useReducer`
	- **Global State** – Context API, Redux, Zustand, Jotai
	- **Server State** – React Query, SWR
	- **URL State** – React Router, Next.js router
	- ## 🧩 Common Patterns
	- **Lifting State Up** – Move state to the closest common ancestor.
	- **Controlled vs Uncontrolled Components** – Form input handling strategies.
	- **Render Props / HOC (Higher-Order Components)** – Patterns for reuse (being replaced by hooks).
	- **Compound Components** – Design pattern for interrelated components.
	- ## 📌 1. **JSX (JavaScript XML)**
	- JSX allows mixing HTML with JavaScript.
	- Transpiled by Babel into `React.createElement()`.
	- **Example:**
	    
	  ```jsx
	  const element = <h1 className="greet">Hello, React!</h1>;
	  ```
	- **Expressions inside JSX**: `{}`  
	  Only expressions (not statements) are allowed inside `{}`.
	- ## 🧱 2. **Components**
	- ### ➤ Functional Components
	- Modern standard using hooks.
	- Stateless until hooks like `useState`, `useEffect` are added.
	    
	  ```jsx
	  function Greeting({ name }) {
	  return <h1>Hello, {name}</h1>;
	  }
	  ```
	- ### ➤ Class Components (Legacy)
	- Used with lifecycle methods.
	    
	  ```jsx
	  class Greeting extends React.Component {
	  render() {
	    return <h1>Hello, {this.props.name}</h1>;
	  }
	  }
	  ```
	- ## 📥 3. **Props**
	- Read-only values passed to components.
	- Encourages reusability.
	- Props are immutable — changes should be done through state in the parent.
	    
	  ```jsx
	  <Greeting name="John" />
	  ```
	- ## 🧠 4. **State**
	- Holds dynamic data.
	- Modifying state re-renders the component.
	    
	  ```jsx
	  const [count, setCount] = useState(0);
	  ```
	- Never mutate state directly. Always use setters:
	    
	  ❌ `count++`  
	  ✅ `setCount(count + 1)`
	- ## 🪝 5. **Hooks (Functional Lifecycle + Logic)**
	    
	  > Introduced in React 16.8, **Hooks** allow functional components to manage **state**, access **lifecycle methods**, and handle **side effects**, making class components mostly unnecessary.
	- ## 🔗 **What is a Hook?**
	- A **Hook** is a **JavaScript function** that lets you “hook into” React **features** from functional components.
	- Hooks **cannot be used in class components**.
	- Always start with `use` (e.g. `useState`, `useEffect`).
	- Must be called **at the top level** of the component (not inside loops, conditions, or nested functions).
	- ## 🧰 **Rules of Hooks**
	    
	  1. Only call Hooks at the **top level**.
	  2. Only call Hooks from **React functional components** or **custom hooks**.
	  3. Custom hooks must start with `use`.
	- ## 📚 **Built-in Hooks**
	- ### 1️⃣ `useState` → *State Handling in Functional Components*
	    
	  **✅ Purpose:** Manage **local component state**.  
	    
	  **📦 Syntax:**  
	  ```jsx
	  const [state, setState] = useState(initialValue);
	  ```
	    
	  **🧪 Example:**  
	  ```jsx
	  const [count, setCount] = useState(0);
	  ```
	    
	  **📌 Notes:**
	- Re-renders the component on state update.
	- Always use the setter — never mutate the state directly.
	- ### 2️⃣ `useEffect` → *Side Effects / Lifecycle*
	    
	  **✅ Purpose:** Run **side effects** like data fetching, DOM manipulation, etc.  
	    
	  **📦 Syntax:**  
	  ```jsx
	  useEffect(() => {
	  // effect
	  return () => {
	    // cleanup (optional)
	  };
	  }, [dependencies]);
	  ```
	    
	  **🧪 Example:**  
	  ```jsx
	  useEffect(() => {
	  document.title = `You clicked ${count} times`;
	  }, [count]);
	  ```
	    
	  **📌 Notes:**
	- `[]` dependency = runs once (on mount).
	- No dependency = runs on **every render**.
	- Returns cleanup function that runs on **unmount** or before re-run.
	- ### 3️⃣ `useContext` → *Access Context API*
	    
	  **✅ Purpose:** Access values from a **React Context Provider**.  
	    
	  **📦 Syntax:**  
	  ```jsx
	  const value = useContext(MyContext);
	  ```
	    
	  **🧪 Example:**  
	  ```jsx
	  const theme = useContext(ThemeContext);
	  ```
	    
	  **📌 Notes:**
	- Helps avoid **prop drilling**.
	- Triggers re-render if context value changes.
	- ### 4️⃣ `useRef` → *DOM Access / Persistent Values*
	    
	  **✅ Purpose:** Create a **persistent mutable reference**.  
	    
	  **📦 Syntax:**  
	  ```jsx
	  const ref = useRef(initialValue);
	  ```
	    
	  **🧪 Example:**  
	  ```jsx
	  const inputRef = useRef(null);
	  
	  useEffect(() => {
	  inputRef.current.focus();
	  }, []);
	  ```
	    
	  **📌 Notes:**
	- Changes to `.current` do **not** trigger re-renders.
	- Often used to store DOM references or timers.
	- ### 5️⃣ `useReducer` → *Complex State Logic (Redux-like)*
	    
	  **✅ Purpose:** Handle **complex state transitions** or **multiple state values**.  
	    
	  **📦 Syntax:**  
	  ```jsx
	  const [state, dispatch] = useReducer(reducerFn, initialState);
	  ```
	    
	  **🧪 Example:**  
	  ```jsx
	  const reducer = (state, action) => {
	  switch (action.type) {
	    case "increment":
	      return { count: state.count + 1 };
	    default:
	      return state;
	  }
	  };
	  
	  const [state, dispatch] = useReducer(reducer, { count: 0 });
	  ```
	    
	  **📌 Notes:**
	- Ideal for managing **multiple related state updates**.
	- ### 6️⃣ `useCallback` → *Memoize Functions*
	    
	  **✅ Purpose:** Prevent re-creating functions unnecessarily on every render.  
	    
	  **📦 Syntax:**  
	  ```jsx
	  const memoFn = useCallback(() => {
	  // logic
	  }, [dependencies]);
	  ```
	    
	  **🧪 Example:**  
	  ```jsx
	  const handleClick = useCallback(() => {
	  setCount(count + 1);
	  }, [count]);
	  ```
	    
	  **📌 Notes:**
	- Useful when passing callbacks to child components to avoid re-renders.
	- ### 7️⃣ `useMemo` → *Memoize Expensive Computation*
	    
	  **✅ Purpose:** Cache the result of **expensive operations**.  
	    
	  **📦 Syntax:**  
	  ```jsx
	  const memoizedValue = useMemo(() => computeExpensive(value), [value]);
	  ```
	    
	  **🧪 Example:**  
	  ```jsx
	  const total = useMemo(() => calculateTotal(items), [items]);
	  ```
	    
	  **📌 Notes:**
	- Only recomputes when dependencies change.
	- ### 8️⃣ `useImperativeHandle` → *Expose Custom Methods to Parent*
	    
	  **✅ Purpose:** Allow parents to **call methods** on child components via `ref`.  
	    
	  **📦 Syntax:**  
	  ```jsx
	  useImperativeHandle(ref, () => ({
	  customMethod() {}
	  }));
	  ```
	    
	  **📌 Notes:**
	- Must be used with `forwardRef`.
	- ### 9️⃣ `useLayoutEffect` → *Run Effect Before Paint*
	    
	  **✅ Purpose:** Similar to `useEffect`, but runs **synchronously before paint**.  
	    
	  **📌 Notes:**
	- Use when you need to **measure layout** or update styles **before screen paint**.
	- Use sparingly; can block visual rendering.
	- ### 🔟 `useDebugValue` → *Show Custom Hook Info in DevTools*
	    
	  **✅ Purpose:** Enhance visibility of custom hook values in React DevTools.  
	    
	  **📦 Syntax:**  
	  ```jsx
	  useDebugValue(value);
	  ```
	- ## 🛠️ **Custom Hooks**
	    
	  > Encapsulate and reuse logic across components.  
	    
	  **🧪 Example:**  
	  ```jsx
	  function useToggle(initial = false) {
	  const [value, setValue] = useState(initial);
	  const toggle = () => setValue(v => !v);
	  return [value, toggle];
	  }
	  ```
	    
	  **📌 Notes:**
	- Must start with `use`.
	- Keeps components **clean** and **DRY**.
	- ## 🧠 **Hook Comparison Table**
	    
	  | Hook | Purpose | Equivalent (Class Component) |
	  |---|---|---|
	  | `useState` | Manage local state | `this.state`, `setState()` |
	  | `useEffect` | Side effects (API, DOM, timers) | `componentDidMount`, etc. |
	  | `useContext` | Access context value | `contextType` |
	  | `useRef` | Persist values / DOM refs | `createRef` |
	  | `useReducer` | Complex state logic | Redux pattern |
	  | `useCallback` | Memoize functions | `shouldComponentUpdate` |
	  | `useMemo` | Memoize values | `shouldComponentUpdate` |
	  | `useImperativeHandle` | Expose methods via ref | Class method with `ref` |
	  | `useLayoutEffect` | Sync effect before DOM paint | Sync version of `componentDidMount` |
	  | `useDebugValue` | Debug custom hook info | — |
	- ## ✅ **Best Practices with Hooks**
	- Keep Hooks **at the top** of your component.
	- Avoid using Hooks **conditionally**.
	- Clean up side effects properly using **`return` in `useEffect`**.
	- Prefer `useReducer` for **complex or nested state**.
	- Extract custom logic to **custom hooks**.
	- Avoid **over-using** `useMemo` / `useCallback` — only use when needed.
- # 🧰 **Libs & Framework**
	- ## 🔗 Official Docs & Tools
	- **React Official Website**:   
	  [https://react.dev](https://react.dev) (new docs)
	- **React GitHub Repo**:  
	  [https://github.com/facebook/react](https://github.com/facebook/react)
	- ## 📦 Popular Libraries (React Ecosystem)
	- **React Router** – Declarative routing for React apps.  
	  🔗 [https://reactrouter.com](https://reactrouter.com)
	- **Redux Toolkit** – Predictable state management.  
	  🔗 [https://redux-toolkit.js.org](https://redux-toolkit.js.org)
	- **React Query** – Data-fetching and caching for server-state.  
	  🔗 [https://tanstack.com/query/latest](https://tanstack.com/query/latest)
	- **Formik** – For building forms in React.  
	  🔗 [https://formik.org](https://formik.org)
	- **Yup** – Schema validation (commonly used with Formik).  
	  🔗 [https://github.com/jquense/yup](https://github.com/jquense/yup)
	- **Zustand** – Lightweight state management alternative.  
	  🔗 [https://zustand-demo.pmnd.rs](https://zustand-demo.pmnd.rs)
	- **Jotai / Recoil** – Minimalistic and experimental state libraries.  
	  🔗 [https://jotai.org](https://jotai.org)  
	  🔗 [https://recoiljs.org](https://recoiljs.org)
	- ## 🧩 Frameworks Built on React
	- **Next.js** – Full-stack React framework with SSR, API routes, and more.  
	  🔗 [https://nextjs.org](https://nextjs.org)
	- **Gatsby** – Static site generator for React.  
	  🔗 [https://www.gatsbyjs.com](https://www.gatsbyjs.com)
	- **Remix** – Full-stack React framework with focus on performance & data loading.  
	  🔗 [https://remix.run](https://remix.run)