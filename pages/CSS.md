---
seoTitle: CSS3 Complete Guide – Selectors, Flexbox, Grid, Animations, and Responsive Design
description: "Comprehensive CSS3 reference covering selectors, box model, flexbox, CSS grid, animations, transitions, custom properties, media queries, and modern CSS techniques."
keywords: "CSS, CSS3, flexbox, CSS grid, selectors, animations, transitions, custom properties, responsive design, media queries, CSS variables, preprocessors, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: CSS
author: Makvana Smitrajsinh
authorUrl: https://portfolio-eight-theta-7g6hpaehqn.vercel.app/
---

- # History
  collapsed:: true
	- **How**:
		- Developed by **Håkon Wium Lie** and **Bert Bos** in **1994** at **W3C** (World Wide Web Consortium).
		- Designed to separate **content** (HTML) from **presentation** (layout and style).
		- CSS1 released in 1996, CSS2 in 1998, CSS3 started in 1999 (modular approach).
		- CSS3 introduced animations, transitions, flexbox, grid, custom properties, and more.
	-
	- **Who**:
		- **Håkon Wium Lie** — Norwegian web pioneer, creator of CSS, worked at CERN under Tim Berners-Lee.
		- **Bert Bos** — Dutch computer scientist, co-developer of CSS at W3C.
		- **W3C** (World Wide Web Consortium) — oversees CSS standards and development.
	-
	- **Why**:
		- To allow web developers to create **dynamic**, **consistent**, and **maintainable** web designs.
		- To separate structure (HTML) from presentation (CSS) for better code organization.
		- To provide **flexibility** in styling, enabling **responsive design** and **accessibility**.
		- To reduce code redundancy by applying styles globally via classes and selectors.
-
- # Introduction
  collapsed:: true
	- ## Advantages
		- **Separation of Concerns** — CSS separates HTML structure from visual styling.
		- **Reusability** — One stylesheet can style multiple pages.
		- **Responsive Design** — Media queries enable layouts for different screen sizes.
		- **Animations & Transitions** — Create smooth visual effects without JavaScript.
		- **Cross-Browser Compatibility** — Works across all modern browsers.
		- **Customization** — Extensive styling options for colors, fonts, layouts, effects.
		- **Performance** — External stylesheets are cached by browsers.
		- **Maintainability** — Centralized styling makes updates easier.
	-
	- ## Disadvantages
		- **No Logic** — CSS lacks programming constructs (loops, conditions, variables in older versions).
		- **Browser Inconsistencies** — Older browsers may not support modern CSS features.
		- **Specificity Conflicts** — Complex selectors can lead to unexpected overrides.
		- **Scalability Issues** — Large CSS files can become difficult to manage without preprocessors.
		- **Limited Layout Control** — Older techniques (floats, positioning) are cumbersome.
		- **Performance Issues** — Complex animations and selectors can impact performance.
-
- # Basics
  collapsed:: true
	- ## CSS Syntax & Structure
		- ```css
		  /* Selector { property: value; } */
		  
		  h1 {
		      color: blue;           /* Text color */
		      font-size: 24px;       /* Font size */
		      text-align: center;    /* Text alignment */
		  }
		  
		  /* Multiple selectors */
		  h1, h2, h3 {
		      font-family: Arial, sans-serif;
		  }
		  
		  /* Comments */
		  /* This is a single-line comment */
		  
		  /*
		   * This is a
		   * multi-line comment
		   */
		  ```
	-
	- ## Three Ways to Add CSS
		- ```html
		  <!-- 1. Inline CSS (highest specificity, avoid for maintainability) -->
		  <p style="color: red; font-size: 16px;">Inline styled text</p>
		  
		  <!-- 2. Internal CSS (in <head> section) -->
		  <head>
		      <style>
		          p {
		              color: blue;
		              font-size: 14px;
		          }
		      </style>
		  </head>
		  
		  <!-- 3. External CSS (best practice) -->
		  <head>
		      <link rel="stylesheet" href="styles.css">
		  </head>
		  ```
	-
	- ## CSS Selectors
		- ```css
		  /* Universal selector */
		  * {
		      margin: 0;
		      padding: 0;
		  }
		  
		  /* Element selector */
		  p {
		      color: black;
		  }
		  
		  /* Class selector */
		  .highlight {
		      background-color: yellow;
		  }
		  
		  /* ID selector */
		  #header {
		      background-color: navy;
		  }
		  
		  /* Descendant selector (space) */
		  div p {
		      color: red;  /* All <p> inside <div> */
		  }
		  
		  /* Child selector (>) */
		  div > p {
		      color: blue;  /* Direct <p> children of <div> */
		  }
		  
		  /* Adjacent sibling selector (+) */
		  h1 + p {
		      margin-top: 0;  /* <p> immediately after <h1> */
		  }
		  
		  /* General sibling selector (~) */
		  h1 ~ p {
		      color: gray;  /* All <p> siblings after <h1> */
		  }
		  
		  /* Attribute selectors */
		  input[type="text"] {
		      border: 1px solid #ccc;
		  }
		  
		  a[href^="https"] {
		      color: green;  /* Links starting with https */
		  }
		  
		  a[href$=".pdf"] {
		      color: red;  /* Links ending with .pdf */
		  }
		  
		  a[href*="example"] {
		      color: blue;  /* Links containing "example" */
		  }
		  
		  /* Multiple classes */
		  .class1.class2 {
		      font-weight: bold;  /* Elements with both classes */
		  }
		  ```
	-
	- ## Pseudo-classes
		- ```css
		  /* Link states */
		  a:link { color: blue; }
		  a:visited { color: purple; }
		  a:hover { color: red; }
		  a:active { color: orange; }
		  
		  /* Form states */
		  input:focus { border-color: blue; }
		  input:disabled { background-color: #eee; }
		  input:checked { background-color: green; }
		  input:required { border-color: red; }
		  input:valid { border-color: green; }
		  input:invalid { border-color: red; }
		  
		  /* Structural pseudo-classes */
		  li:first-child { font-weight: bold; }
		  li:last-child { margin-bottom: 0; }
		  li:nth-child(2) { color: red; }  /* 2nd child */
		  li:nth-child(odd) { background: #f0f0f0; }  /* Odd rows */
		  li:nth-child(even) { background: white; }   /* Even rows */
		  li:nth-child(3n) { color: blue; }  /* Every 3rd element */
		  
		  p:first-of-type { font-size: 20px; }
		  p:last-of-type { margin-bottom: 0; }
		  p:nth-of-type(2) { color: green; }
		  
		  /* Other useful pseudo-classes */
		  div:empty { display: none; }  /* Empty elements */
		  p:not(.special) { color: gray; }  /* All <p> except .special */
		  :root { --main-color: blue; }  /* Root element (for CSS variables) */
		  ```
	-
	- ## Pseudo-elements
		- ```css
		  /* ::before and ::after */
		  p::before {
		      content: "→ ";
		      color: blue;
		  }
		  
		  p::after {
		      content: " ←";
		      color: red;
		  }
		  
		  /* First letter and first line */
		  p::first-letter {
		      font-size: 2em;
		      font-weight: bold;
		      color: red;
		  }
		  
		  p::first-line {
		      font-variant: small-caps;
		  }
		  
		  /* Selection styling */
		  ::selection {
		      background-color: yellow;
		      color: black;
		  }
		  
		  /* Placeholder styling */
		  input::placeholder {
		      color: #999;
		      font-style: italic;
		  }
		  ```
	-
	- ## Colors & Units
		- ```css
		  /* Color formats */
		  .color-examples {
		      /* Named colors */
		      color: red;
		      
		      /* Hexadecimal */
		      color: #ff0000;
		      color: #f00;  /* Shorthand */
		      
		      /* RGB */
		      color: rgb(255, 0, 0);
		      
		      /* RGBA (with alpha/transparency) */
		      color: rgba(255, 0, 0, 0.5);  /* 50% transparent */
		      
		      /* HSL (Hue, Saturation, Lightness) */
		      color: hsl(0, 100%, 50%);
		      
		      /* HSLA (with alpha) */
		      color: hsla(0, 100%, 50%, 0.5);
		  }
		  
		  /* Length units */
		  .units {
		      /* Absolute units */
		      width: 100px;    /* Pixels */
		      width: 2cm;      /* Centimeters */
		      width: 1in;      /* Inches */
		      
		      /* Relative units */
		      font-size: 1em;     /* Relative to parent font size */
		      font-size: 1rem;    /* Relative to root font size */
		      width: 50%;         /* Percentage of parent */
		      width: 50vw;        /* 50% of viewport width */
		      height: 100vh;      /* 100% of viewport height */
		      font-size: 2vmin;   /* 2% of smaller viewport dimension */
		      font-size: 2vmax;   /* 2% of larger viewport dimension */
		      width: 10ch;        /* Width of 10 "0" characters */
		      line-height: 1.5ex; /* Height of "x" character */
		  }
		  ```
	-
- # Box Model & Layout
  collapsed:: true
	- ## Box Model
		- ```css
		  /* Box model components: content, padding, border, margin */
		  
		  .box {
		      width: 300px;
		      height: 200px;
		      padding: 20px;           /* Space inside border */
		      border: 5px solid black; /* Border around padding */
		      margin: 10px;            /* Space outside border */
		  }
		  
		  /* Individual sides */
		  .box {
		      padding-top: 10px;
		      padding-right: 20px;
		      padding-bottom: 10px;
		      padding-left: 20px;
		      
		      /* Shorthand: top right bottom left (clockwise) */
		      padding: 10px 20px 10px 20px;
		      padding: 10px 20px;  /* vertical horizontal */
		      padding: 10px;       /* all sides */
		  }
		  
		  /* Box-sizing */
		  * {
		      box-sizing: border-box;  /* Include padding and border in width/height */
		  }
		  
		  /* Default is content-box */
		  .content-box {
		      box-sizing: content-box;  /* Width/height only applies to content */
		  }
		  ```
	-
	- ## Display Property
		- ```css
		  /* Block elements (take full width, start on new line) */
		  div {
		      display: block;
		  }
		  
		  /* Inline elements (only take necessary width, no line break) */
		  span {
		      display: inline;
		  }
		  
		  /* Inline-block (inline but can have width/height) */
		  .button {
		      display: inline-block;
		      width: 100px;
		      height: 40px;
		  }
		  
		  /* Hide element */
		  .hidden {
		      display: none;  /* Removes from layout */
		  }
		  
		  /* Visibility (keeps space) */
		  .invisible {
		      visibility: hidden;  /* Hidden but space remains */
		  }
		  
		  /* Flex container */
		  .flex-container {
		      display: flex;
		  }
		  
		  /* Grid container */
		  .grid-container {
		      display: grid;
		  }
		  ```
	-
	- ## Position Property
		- ```css
		  /* Static (default) */
		  .static {
		      position: static;  /* Normal document flow */
		  }
		  
		  /* Relative (relative to normal position) */
		  .relative {
		      position: relative;
		      top: 10px;    /* Move 10px down from normal position */
		      left: 20px;   /* Move 20px right from normal position */
		  }
		  
		  /* Absolute (relative to nearest positioned ancestor) */
		  .absolute {
		      position: absolute;
		      top: 0;
		      right: 0;  /* Position at top-right of parent */
		  }
		  
		  /* Fixed (relative to viewport, stays on scroll) */
		  .fixed {
		      position: fixed;
		      bottom: 20px;
		      right: 20px;  /* Fixed at bottom-right of screen */
		  }
		  
		  /* Sticky (hybrid of relative and fixed) */
		  .sticky {
		      position: sticky;
		      top: 0;  /* Sticks to top when scrolling */
		  }
		  
		  /* Z-index (stacking order) */
		  .layer1 { z-index: 1; }
		  .layer2 { z-index: 2; }  /* Appears above layer1 */
		  .layer3 { z-index: 999; }
		  ```
	-
	- ## Float & Clear
		- ```css
		  /* Float (older layout technique) */
		  .left {
		      float: left;
		      width: 50%;
		  }
		  
		  .right {
		      float: right;
		      width: 50%;
		  }
		  
		  /* Clear floats */
		  .clear {
		      clear: both;  /* Clear both left and right floats */
		  }
		  
		  /* Clearfix hack (for parent of floated elements) */
		  .clearfix::after {
		      content: "";
		      display: table;
		      clear: both;
		  }
		  ```
	-
	- ## Overflow
		- ```css
		  .container {
		      width: 200px;
		      height: 100px;
		      overflow: visible;  /* Default, content overflows */
		      overflow: hidden;   /* Hide overflow */
		      overflow: scroll;   /* Always show scrollbars */
		      overflow: auto;     /* Scrollbars only when needed */
		  }
		  
		  /* Separate horizontal and vertical */
		  .box {
		      overflow-x: hidden;
		      overflow-y: scroll;
		  }
		  ```
	-
- # Flexbox
  collapsed:: true
	- ## Flex Container Properties
		- ```css
		  .container {
		      display: flex;  /* Enable flexbox */
		      
		      /* Direction */
		      flex-direction: row;          /* Default: left to right */
		      flex-direction: row-reverse;  /* Right to left */
		      flex-direction: column;       /* Top to bottom */
		      flex-direction: column-reverse; /* Bottom to top */
		      
		      /* Wrap */
		      flex-wrap: nowrap;   /* Default: single line */
		      flex-wrap: wrap;     /* Multi-line */
		      flex-wrap: wrap-reverse;
		      
		      /* Shorthand for direction and wrap */
		      flex-flow: row wrap;
		      
		      /* Justify content (main axis alignment) */
		      justify-content: flex-start;    /* Default: start */
		      justify-content: flex-end;      /* End */
		      justify-content: center;        /* Center */
		      justify-content: space-between; /* Equal space between items */
		      justify-content: space-around;  /* Equal space around items */
		      justify-content: space-evenly;  /* Equal space everywhere */
		      
		      /* Align items (cross axis alignment) */
		      align-items: stretch;     /* Default: stretch to fill */
		      align-items: flex-start;  /* Top */
		      align-items: flex-end;    /* Bottom */
		      align-items: center;      /* Center */
		      align-items: baseline;    /* Align baselines */
		      
		      /* Align content (multi-line cross axis) */
		      align-content: flex-start;
		      align-content: flex-end;
		      align-content: center;
		      align-content: space-between;
		      align-content: space-around;
		      align-content: stretch;
		      
		      /* Gap between items */
		      gap: 20px;           /* Both row and column gap */
		      row-gap: 10px;       /* Gap between rows */
		      column-gap: 20px;    /* Gap between columns */
		  }
		  ```
	-
	- ## Flex Item Properties
		- ```css
		  .item {
		      /* Order (default is 0) */
		      order: 1;  /* Higher values appear later */
		      
		      /* Flex grow (how much item grows relative to others) */
		      flex-grow: 0;  /* Default: don't grow */
		      flex-grow: 1;  /* Grow to fill space */
		      flex-grow: 2;  /* Grow twice as much as flex-grow: 1 */
		      
		      /* Flex shrink (how much item shrinks) */
		      flex-shrink: 1;  /* Default: can shrink */
		      flex-shrink: 0;  /* Don't shrink */
		      
		      /* Flex basis (initial size before growing/shrinking) */
		      flex-basis: auto;   /* Default: based on content */
		      flex-basis: 200px;  /* Fixed initial size */
		      flex-basis: 50%;    /* Percentage of container */
		      
		      /* Shorthand: flex-grow flex-shrink flex-basis */
		      flex: 0 1 auto;  /* Default */
		      flex: 1;         /* flex: 1 1 0 (grow, shrink, 0 basis) */
		      flex: 2;         /* Grow twice as much */
		      flex: 0 0 200px; /* Fixed 200px, no grow/shrink */
		      
		      /* Align self (override container's align-items) */
		      align-self: auto;       /* Default: inherit from container */
		      align-self: flex-start;
		      align-self: flex-end;
		      align-self: center;
		      align-self: baseline;
		      align-self: stretch;
		  }
		  ```
	-
	- ## Flexbox Examples
		- ```css
		  /* Centered content */
		  .center-box {
		      display: flex;
		      justify-content: center;
		      align-items: center;
		      height: 100vh;
		  }
		  
		  /* Navigation bar */
		  .navbar {
		      display: flex;
		      justify-content: space-between;
		      align-items: center;
		      padding: 1rem;
		  }
		  
		  /* Equal width columns */
		  .columns {
		      display: flex;
		      gap: 20px;
		  }
		  .columns > div {
		      flex: 1;  /* All columns equal width */
		  }
		  
		  /* Responsive card layout */
		  .card-container {
		      display: flex;
		      flex-wrap: wrap;
		      gap: 20px;
		  }
		  .card {
		      flex: 1 1 300px;  /* Grow, shrink, min 300px */
		  }
		  ```
	-
- # CSS Grid
  collapsed:: true
	- ## Grid Container Properties
		- ```css
		  .grid-container {
		      display: grid;
		      
		      /* Define columns */
		      grid-template-columns: 200px 200px 200px;  /* 3 fixed columns */
		      grid-template-columns: 1fr 1fr 1fr;        /* 3 equal columns */
		      grid-template-columns: 1fr 2fr 1fr;        /* Middle column twice as wide */
		      grid-template-columns: repeat(3, 1fr);     /* Repeat 3 times */
		      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Responsive */
		      
		      /* Define rows */
		      grid-template-rows: 100px 200px 100px;
		      grid-template-rows: repeat(3, 1fr);
		      
		      /* Gap between grid items */
		      gap: 20px;              /* Both row and column gap */
		      row-gap: 10px;          /* Gap between rows */
		      column-gap: 20px;       /* Gap between columns */
		      
		      /* Justify items (horizontal alignment within cell) */
		      justify-items: start;   /* Left */
		      justify-items: end;     /* Right */
		      justify-items: center;  /* Center */
		      justify-items: stretch; /* Default: fill cell */
		      
		      /* Align items (vertical alignment within cell) */
		      align-items: start;     /* Top */
		      align-items: end;       /* Bottom */
		      align-items: center;    /* Center */
		      align-items: stretch;   /* Default: fill cell */
		      
		      /* Justify content (align entire grid horizontally) */
		      justify-content: start;
		      justify-content: end;
		      justify-content: center;
		      justify-content: space-between;
		      justify-content: space-around;
		      justify-content: space-evenly;
		      
		      /* Align content (align entire grid vertically) */
		      align-content: start;
		      align-content: end;
		      align-content: center;
		      align-content: space-between;
		      align-content: space-around;
		      align-content: space-evenly;
		  }
		  ```
	-
	- ## Grid Item Properties
		- ```css
		  .grid-item {
		      /* Column placement */
		      grid-column-start: 1;
		      grid-column-end: 3;      /* Span from column 1 to 3 */
		      grid-column: 1 / 3;      /* Shorthand */
		      grid-column: 1 / span 2; /* Start at 1, span 2 columns */
		      
		      /* Row placement */
		      grid-row-start: 1;
		      grid-row-end: 3;
		      grid-row: 1 / 3;         /* Shorthand */
		      grid-row: 1 / span 2;    /* Start at 1, span 2 rows */
		      
		      /* Area shorthand: row-start / col-start / row-end / col-end */
		      grid-area: 1 / 1 / 3 / 3;
		      
		      /* Justify self (override container's justify-items) */
		      justify-self: start;
		      justify-self: end;
		      justify-self: center;
		      justify-self: stretch;
		      
		      /* Align self (override container's align-items) */
		      align-self: start;
		      align-self: end;
		      align-self: center;
		      align-self: stretch;
		  }
		  ```
	-
	- ## Grid Template Areas
		- ```css
		  .grid-layout {
		      display: grid;
		      grid-template-columns: 1fr 3fr 1fr;
		      grid-template-rows: auto 1fr auto;
		      grid-template-areas:
		          "header header header"
		          "sidebar main aside"
		          "footer footer footer";
		      gap: 10px;
		  }
		  
		  .header  { grid-area: header; }
		  .sidebar { grid-area: sidebar; }
		  .main    { grid-area: main; }
		  .aside   { grid-area: aside; }
		  .footer  { grid-area: footer; }
		  ```
	-
	- ## Grid Examples
		- ```css
		  /* Simple 3-column layout */
		  .three-columns {
		      display: grid;
		      grid-template-columns: repeat(3, 1fr);
		      gap: 20px;
		  }
		  
		  /* Responsive grid (auto-fit) */
		  .responsive-grid {
		      display: grid;
		      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		      gap: 20px;
		  }
		  
		  /* Holy Grail Layout */
		  .holy-grail {
		      display: grid;
		      grid-template-columns: 200px 1fr 200px;
		      grid-template-rows: auto 1fr auto;
		      min-height: 100vh;
		  }
		  
		  /* Card spanning multiple columns */
		  .featured-card {
		      grid-column: span 2;
		      grid-row: span 2;
		  }
		  ```
	-
- # Typography & Text Styling
  collapsed:: true
	- ## Font Properties
		- ```css
		  .text {
		      /* Font family */
		      font-family: Arial, Helvetica, sans-serif;
		      font-family: 'Times New Roman', serif;
		      font-family: 'Courier New', monospace;
		      
		      /* Font size */
		      font-size: 16px;
		      font-size: 1rem;
		      font-size: 1.5em;
		      
		      /* Font weight */
		      font-weight: normal;   /* 400 */
		      font-weight: bold;     /* 700 */
		      font-weight: 100;      /* Thin */
		      font-weight: 900;      /* Black */
		      
		      /* Font style */
		      font-style: normal;
		      font-style: italic;
		      font-style: oblique;
		      
		      /* Font variant */
		      font-variant: normal;
		      font-variant: small-caps;
		      
		      /* Line height */
		      line-height: 1.5;      /* Relative to font size */
		      line-height: 24px;     /* Fixed */
		      
		      /* Shorthand: style variant weight size/line-height family */
		      font: italic small-caps bold 16px/1.5 Arial, sans-serif;
		  }
		  ```
	-
	- ## Text Properties
		- ```css
		  .text-styling {
		      /* Color */
		      color: #333;
		      
		      /* Alignment */
		      text-align: left;
		      text-align: right;
		      text-align: center;
		      text-align: justify;
		      
		      /* Decoration */
		      text-decoration: none;
		      text-decoration: underline;
		      text-decoration: overline;
		      text-decoration: line-through;
		      text-decoration: underline wavy red;
		      
		      /* Transform */
		      text-transform: none;
		      text-transform: uppercase;
		      text-transform: lowercase;
		      text-transform: capitalize;
		      
		      /* Indent */
		      text-indent: 50px;
		      
		      /* Letter spacing */
		      letter-spacing: 2px;
		      letter-spacing: 0.1em;
		      
		      /* Word spacing */
		      word-spacing: 5px;
		      
		      /* White space */
		      white-space: normal;    /* Default */
		      white-space: nowrap;    /* No wrapping */
		      white-space: pre;       /* Preserve whitespace */
		      white-space: pre-wrap;  /* Preserve + wrap */
		      
		      /* Text overflow */
		      text-overflow: clip;
		      text-overflow: ellipsis; /* ... */
		      
		      /* Word break */
		      word-break: normal;
		      word-break: break-all;
		      word-break: keep-all;
		      
		      /* Text shadow */
		      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
		      text-shadow: 0 0 10px #fff, 0 0 20px #fff; /* Glow effect */
		  }
		  ```
	-
	- ## Web Fonts (Google Fonts)
		- ```html
		  <!-- In HTML <head> -->
		  <link rel="preconnect" href="https://fonts.googleapis.com">
		  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
		  ```
		- ```css
		  /* In CSS */
		  body {
		      font-family: 'Roboto', sans-serif;
		  }
		  
		  /* @font-face for custom fonts */
		  @font-face {
		      font-family: 'CustomFont';
		      src: url('fonts/custom.woff2') format('woff2'),
		           url('fonts/custom.woff') format('woff');
		      font-weight: normal;
		      font-style: normal;
		      font-display: swap; /* Improve loading performance */
		  }
		  
		  .custom-text {
		      font-family: 'CustomFont', sans-serif;
		  }
		  ```
	-
	- ## Text Truncation with Ellipsis
		- ```css
		  /* Single line truncation */
		  .truncate {
		      white-space: nowrap;
		      overflow: hidden;
		      text-overflow: ellipsis;
		      max-width: 200px;
		  }
		  
		  /* Multi-line truncation (webkit only) */
		  .truncate-multiline {
		      display: -webkit-box;
		      -webkit-line-clamp: 3;  /* Number of lines */
		      -webkit-box-orient: vertical;
		      overflow: hidden;
		  }
		  ```
	-
- # Backgrounds & Borders
  collapsed:: true
	- ## Background Properties
		- ```css
		  .background {
		      /* Background color */
		      background-color: #f0f0f0;
		      background-color: rgba(255, 0, 0, 0.5);
		      
		      /* Background image */
		      background-image: url('image.jpg');
		      background-image: linear-gradient(to right, red, blue);
		      background-image: radial-gradient(circle, red, blue);
		      
		      /* Background repeat */
		      background-repeat: repeat;      /* Default */
		      background-repeat: no-repeat;
		      background-repeat: repeat-x;    /* Horizontal only */
		      background-repeat: repeat-y;    /* Vertical only */
		      
		      /* Background position */
		      background-position: center;
		      background-position: top left;
		      background-position: 50% 50%;
		      background-position: 10px 20px;
		      
		      /* Background size */
		      background-size: auto;          /* Default */
		      background-size: cover;         /* Cover entire element */
		      background-size: contain;       /* Fit inside element */
		      background-size: 100px 200px;   /* Fixed size */
		      background-size: 50% 50%;       /* Percentage */
		      
		      /* Background attachment */
		      background-attachment: scroll;  /* Default */
		      background-attachment: fixed;   /* Fixed to viewport */
		      background-attachment: local;   /* Scrolls with content */
		      
		      /* Background origin */
		      background-origin: padding-box; /* Default */
		      background-origin: border-box;
		      background-origin: content-box;
		      
		      /* Background clip */
		      background-clip: border-box;    /* Default */
		      background-clip: padding-box;
		      background-clip: content-box;
		      background-clip: text;          /* Clip to text (webkit) */
		      
		      /* Shorthand: color image repeat position / size */
		      background: #f0f0f0 url('bg.jpg') no-repeat center / cover;
		  }
		  
		  /* Multiple backgrounds */
		  .multi-bg {
		      background-image: url('front.png'), url('back.jpg');
		      background-position: center, top left;
		      background-repeat: no-repeat, repeat;
		  }
		  
		  /* Gradient backgrounds */
		  .gradient {
		      /* Linear gradient */
		      background: linear-gradient(to right, #ff0000, #0000ff);
		      background: linear-gradient(45deg, red, yellow, green);
		      background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1));
		      
		      /* Radial gradient */
		      background: radial-gradient(circle, red, blue);
		      background: radial-gradient(ellipse at top, red, blue);
		      
		      /* Repeating gradients */
		      background: repeating-linear-gradient(45deg, red, red 10px, blue 10px, blue 20px);
		  }
		  ```
	-
	- ## Border Properties
		- ```css
		  .border {
		      /* Border width */
		      border-width: 1px;
		      border-width: 2px 4px;          /* vertical horizontal */
		      border-width: 1px 2px 3px 4px;  /* top right bottom left */
		      
		      /* Border style */
		      border-style: solid;
		      border-style: dashed;
		      border-style: dotted;
		      border-style: double;
		      border-style: groove;
		      border-style: ridge;
		      border-style: inset;
		      border-style: outset;
		      border-style: none;
		      border-style: hidden;
		      
		      /* Border color */
		      border-color: #000;
		      border-color: red blue green yellow; /* top right bottom left */
		      
		      /* Shorthand: width style color */
		      border: 2px solid #333;
		      
		      /* Individual sides */
		      border-top: 1px solid red;
		      border-right: 2px dashed blue;
		      border-bottom: 3px dotted green;
		      border-left: 4px double yellow;
		      
		      /* Border radius (rounded corners) */
		      border-radius: 10px;            /* All corners */
		      border-radius: 10px 20px;       /* top-left/bottom-right, top-right/bottom-left */
		      border-radius: 10px 20px 30px 40px; /* top-left, top-right, bottom-right, bottom-left */
		      border-radius: 50%;             /* Circle */
		      
		      /* Individual corner radius */
		      border-top-left-radius: 10px;
		      border-top-right-radius: 20px;
		      border-bottom-right-radius: 30px;
		      border-bottom-left-radius: 40px;
		      
		      /* Elliptical corners */
		      border-radius: 50px / 25px;     /* horizontal / vertical */
		  }
		  ```
	-
	- ## Outline (Outside Border)
		- ```css
		  .outline {
		      outline: 2px solid blue;
		      outline-width: 3px;
		      outline-style: dashed;
		      outline-color: red;
		      outline-offset: 5px;  /* Space between border and outline */
		      
		      /* Remove default focus outline */
		      outline: none;  /* Use carefully, provide alternative focus indicator */
		  }
		  ```
	-
	- ## Box Shadow
		- ```css
		  .shadow {
		      /* box-shadow: horizontal vertical blur spread color */
		      box-shadow: 5px 5px 10px rgba(0,0,0,0.3);
		      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
		      
		      /* Inset shadow */
		      box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
		      
		      /* Multiple shadows */
		      box-shadow: 
		          0 2px 4px rgba(0,0,0,0.1),
		          0 4px 8px rgba(0,0,0,0.1),
		          0 8px 16px rgba(0,0,0,0.1);
		      
		      /* No shadow */
		      box-shadow: none;
		  }
		  ```
	-
- # Transitions & Animations
  collapsed:: true
	- ## CSS Transitions
		- ```css
		  .transition {
		      /* Transition property */
		      transition-property: all;           /* All properties */
		      transition-property: background-color;
		      transition-property: width, height; /* Multiple properties */
		      
		      /* Transition duration */
		      transition-duration: 0.3s;
		      transition-duration: 300ms;
		      
		      /* Transition timing function */
		      transition-timing-function: ease;        /* Default */
		      transition-timing-function: linear;
		      transition-timing-function: ease-in;
		      transition-timing-function: ease-out;
		      transition-timing-function: ease-in-out;
		      transition-timing-function: cubic-bezier(0.1, 0.7, 1.0, 0.1);
		      
		      /* Transition delay */
		      transition-delay: 0s;
		      transition-delay: 0.5s;
		      
		      /* Shorthand: property duration timing-function delay */
		      transition: all 0.3s ease 0s;
		      transition: background-color 0.5s ease-in-out;
		      transition: width 0.3s, height 0.3s, background 0.5s;
		  }
		  
		  /* Example: Button hover transition */
		  .button {
		      background-color: blue;
		      color: white;
		      padding: 10px 20px;
		      transition: all 0.3s ease;
		  }
		  
		  .button:hover {
		      background-color: darkblue;
		      transform: scale(1.05);
		  }
		  ```
	-
	- ## CSS Animations
		- ```css
		  /* Define keyframes */
		  @keyframes slide-in {
		      from {
		          transform: translateX(-100%);
		          opacity: 0;
		      }
		      to {
		          transform: translateX(0);
		          opacity: 1;
		      }
		  }
		  
		  /* Percentage keyframes */
		  @keyframes bounce {
		      0% { transform: translateY(0); }
		      50% { transform: translateY(-20px); }
		      100% { transform: translateY(0); }
		  }
		  
		  /* Apply animation */
		  .animated {
		      /* Animation name */
		      animation-name: slide-in;
		      
		      /* Animation duration */
		      animation-duration: 1s;
		      
		      /* Animation timing function */
		      animation-timing-function: ease-in-out;
		      
		      /* Animation delay */
		      animation-delay: 0.5s;
		      
		      /* Animation iteration count */
		      animation-iteration-count: 1;       /* Once */
		      animation-iteration-count: 3;       /* 3 times */
		      animation-iteration-count: infinite; /* Forever */
		      
		      /* Animation direction */
		      animation-direction: normal;        /* Default */
		      animation-direction: reverse;       /* Backwards */
		      animation-direction: alternate;     /* Forward then backward */
		      animation-direction: alternate-reverse;
		      
		      /* Animation fill mode */
		      animation-fill-mode: none;          /* Default */
		      animation-fill-mode: forwards;      /* Keep final state */
		      animation-fill-mode: backwards;     /* Apply first keyframe before start */
		      animation-fill-mode: both;          /* Both forwards and backwards */
		      
		      /* Animation play state */
		      animation-play-state: running;      /* Default */
		      animation-play-state: paused;       /* Pause animation */
		      
		      /* Shorthand: name duration timing-function delay iteration-count direction fill-mode */
		      animation: slide-in 1s ease-in-out 0.5s 1 normal forwards;
		  }
		  
		  /* Pause on hover */
		  .animated:hover {
		      animation-play-state: paused;
		  }
		  ```
	-
	- ## Animation Examples
		- ```css
		  /* Fade in */
		  @keyframes fadeIn {
		      from { opacity: 0; }
		      to { opacity: 1; }
		  }
		  .fade-in {
		      animation: fadeIn 1s ease-in;
		  }
		  
		  /* Spin */
		  @keyframes spin {
		      from { transform: rotate(0deg); }
		      to { transform: rotate(360deg); }
		  }
		  .spinner {
		      animation: spin 2s linear infinite;
		  }
		  
		  /* Pulse */
		  @keyframes pulse {
		      0%, 100% { transform: scale(1); }
		      50% { transform: scale(1.1); }
		  }
		  .pulse {
		      animation: pulse 1s ease-in-out infinite;
		  }
		  
		  /* Shake */
		  @keyframes shake {
		      0%, 100% { transform: translateX(0); }
		      10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
		      20%, 40%, 60%, 80% { transform: translateX(10px); }
		  }
		  .shake {
		      animation: shake 0.5s;
		  }
		  
		  /* Loading dots */
		  @keyframes blink {
		      0%, 100% { opacity: 0; }
		      50% { opacity: 1; }
		  }
		  .dot {
		      animation: blink 1.4s infinite;
		  }
		  .dot:nth-child(2) { animation-delay: 0.2s; }
		  .dot:nth-child(3) { animation-delay: 0.4s; }
		  ```
	-
- # Transforms
  collapsed:: true
	- ## 2D Transforms
		- ```css
		  .transform {
		      /* Translate (move) */
		      transform: translate(50px, 100px);  /* x, y */
		      transform: translateX(50px);
		      transform: translateY(100px);
		      
		      /* Scale (resize) */
		      transform: scale(1.5);              /* Uniform scaling */
		      transform: scale(2, 0.5);           /* x, y */
		      transform: scaleX(2);
		      transform: scaleY(0.5);
		      
		      /* Rotate */
		      transform: rotate(45deg);
		      transform: rotate(-90deg);
		      transform: rotate(0.5turn);         /* Half turn */
		      
		      /* Skew (distort) */
		      transform: skew(20deg, 10deg);      /* x, y */
		      transform: skewX(20deg);
		      transform: skewY(10deg);
		      
		      /* Multiple transforms */
		      transform: translate(50px, 100px) rotate(45deg) scale(1.5);
		      
		      /* Transform origin (pivot point) */
		      transform-origin: center;           /* Default */
		      transform-origin: top left;
		      transform-origin: 50% 50%;
		      transform-origin: 100px 200px;
		  }
		  ```
	-
	- ## 3D Transforms
		- ```css
		  .transform-3d {
		      /* Perspective (depth) */
		      perspective: 1000px;
		      
		      /* 3D translate */
		      transform: translate3d(50px, 100px, 200px);
		      transform: translateZ(100px);
		      
		      /* 3D rotate */
		      transform: rotateX(45deg);
		      transform: rotateY(45deg);
		      transform: rotateZ(45deg);
		      transform: rotate3d(1, 1, 0, 45deg);
		      
		      /* 3D scale */
		      transform: scale3d(2, 2, 2);
		      transform: scaleZ(2);
		      
		      /* Transform style (preserve 3D) */
		      transform-style: flat;              /* Default */
		      transform-style: preserve-3d;       /* Children in 3D space */
		      
		      /* Backface visibility */
		      backface-visibility: visible;       /* Default */
		      backface-visibility: hidden;        /* Hide back face */
		  }
		  
		  /* 3D Card Flip Example */
		  .card-container {
		      perspective: 1000px;
		  }
		  
		  .card {
		      transform-style: preserve-3d;
		      transition: transform 0.6s;
		  }
		  
		  .card:hover {
		      transform: rotateY(180deg);
		  }
		  
		  .card-front, .card-back {
		      backface-visibility: hidden;
		  }
		  
		  .card-back {
		      transform: rotateY(180deg);
		  }
		  ```
	-
- # Responsive Design & Media Queries
  collapsed:: true
	- ## Media Queries
		- ```css
		  /* Basic media query syntax */
		  @media media-type and (condition) {
		      /* CSS rules */
		  }
		  
		  /* Screen width breakpoints */
		  @media (max-width: 768px) {
		      /* Styles for screens 768px and smaller (mobile) */
		      .container {
		          width: 100%;
		          padding: 10px;
		      }
		  }
		  
		  @media (min-width: 769px) and (max-width: 1024px) {
		      /* Styles for tablets (769px to 1024px) */
		      .container {
		          width: 90%;
		      }
		  }
		  
		  @media (min-width: 1025px) {
		      /* Styles for desktops (1025px and larger) */
		      .container {
		          width: 1200px;
		          margin: 0 auto;
		      }
		  }
		  
		  /* Common breakpoints */
		  /* Mobile: 320px - 480px */
		  /* Tablet: 481px - 768px */
		  /* Laptop: 769px - 1024px */
		  /* Desktop: 1025px - 1200px */
		  /* Large Desktop: 1201px+ */
		  
		  /* Orientation */
		  @media (orientation: portrait) {
		      /* Vertical orientation */
		  }
		  
		  @media (orientation: landscape) {
		      /* Horizontal orientation */
		  }
		  
		  /* Device pixel ratio (retina displays) */
		  @media (-webkit-min-device-pixel-ratio: 2),
		         (min-resolution: 192dpi) {
		      /* High DPI displays */
		      .logo {
		          background-image: url('logo@2x.png');
		      }
		  }
		  
		  /* Print styles */
		  @media print {
		      .no-print {
		          display: none;
		      }
		      body {
		          color: black;
		          background: white;
		      }
		  }
		  
		  /* Hover capability */
		  @media (hover: hover) {
		      /* Device supports hover (desktop) */
		      .button:hover {
		          background-color: blue;
		      }
		  }
		  
		  @media (hover: none) {
		      /* Device doesn't support hover (touch) */
		      .button:active {
		          background-color: blue;
		      }
		  }
		  
		  /* Prefers color scheme (dark mode) */
		  @media (prefers-color-scheme: dark) {
		      body {
		          background-color: #1a1a1a;
		          color: #ffffff;
		      }
		  }
		  
		  @media (prefers-color-scheme: light) {
		      body {
		          background-color: #ffffff;
		          color: #000000;
		      }
		  }
		  
		  /* Reduced motion (accessibility) */
		  @media (prefers-reduced-motion: reduce) {
		      * {
		          animation: none !important;
		          transition: none !important;
		      }
		  }
		  ```
	-
	- ## Responsive Units
		- ```css
		  .responsive {
		      /* Viewport units */
		      width: 100vw;      /* 100% of viewport width */
		      height: 100vh;     /* 100% of viewport height */
		      font-size: 5vw;    /* 5% of viewport width */
		      
		      /* Relative units */
		      font-size: 1rem;   /* Relative to root font size */
		      padding: 2em;      /* Relative to element's font size */
		      width: 50%;        /* Percentage of parent */
		      
		      /* Minimum and maximum */
		      width: min(90%, 1200px);  /* Smaller of the two */
		      width: max(300px, 50%);   /* Larger of the two */
		      width: clamp(300px, 50%, 1200px); /* Between min and max */
		  }
		  ```
	-
	- ## Mobile-First Approach
		- ```css
		  /* Base styles (mobile) */
		  .container {
		      width: 100%;
		      padding: 15px;
		  }
		  
		  /* Tablet and up */
		  @media (min-width: 768px) {
		      .container {
		          width: 750px;
		          margin: 0 auto;
		      }
		  }
		  
		  /* Desktop and up */
		  @media (min-width: 1024px) {
		      .container {
		          width: 1000px;
		      }
		  }
		  
		  /* Large desktop */
		  @media (min-width: 1200px) {
		      .container {
		          width: 1170px;
		      }
		  }
		  ```
	-
	- ## Container Queries (Modern CSS)
		- ```css
		  /* Container query (based on parent size, not viewport) */
		  .card-container {
		      container-type: inline-size;
		      container-name: card;
		  }
		  
		  @container card (min-width: 400px) {
		      .card {
		          display: flex;
		          flex-direction: row;
		      }
		  }
		  
		  @container card (max-width: 399px) {
		      .card {
		          display: flex;
		          flex-direction: column;
		      }
		  }
		  ```
	-
- # CSS Variables (Custom Properties)
  collapsed:: true
	- ## Defining and Using Variables
		- ```css
		  /* Define variables in :root (global scope) */
		  :root {
		      --primary-color: #3498db;
		      --secondary-color: #2ecc71;
		      --font-size: 16px;
		      --spacing: 20px;
		      --border-radius: 8px;
		      --transition-speed: 0.3s;
		  }
		  
		  /* Use variables with var() */
		  .button {
		      background-color: var(--primary-color);
		      font-size: var(--font-size);
		      padding: var(--spacing);
		      border-radius: var(--border-radius);
		      transition: all var(--transition-speed);
		  }
		  
		  /* Fallback value */
		  .element {
		      color: var(--text-color, #000);  /* Use #000 if --text-color not defined */
		  }
		  
		  /* Scoped variables */
		  .dark-theme {
		      --primary-color: #1a1a1a;
		      --text-color: #ffffff;
		  }
		  
		  .light-theme {
		      --primary-color: #ffffff;
		      --text-color: #000000;
		  }
		  ```
	-
	- ## Dynamic Theme Switching
		- ```css
		  /* Light theme (default) */
		  :root {
		      --bg-color: #ffffff;
		      --text-color: #000000;
		      --border-color: #cccccc;
		  }
		  
		  /* Dark theme */
		  [data-theme="dark"] {
		      --bg-color: #1a1a1a;
		      --text-color: #ffffff;
		      --border-color: #444444;
		  }
		  
		  /* Apply variables */
		  body {
		      background-color: var(--bg-color);
		      color: var(--text-color);
		  }
		  
		  .card {
		      border: 1px solid var(--border-color);
		  }
		  ```
		- ```javascript
		  // Toggle theme with JavaScript
		  const toggleTheme = () => {
		      const currentTheme = document.documentElement.getAttribute('data-theme');
		      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
		      document.documentElement.setAttribute('data-theme', newTheme);
		  };
		  
		  // Set CSS variable dynamically
		  document.documentElement.style.setProperty('--primary-color', '#ff0000');
		  ```
	-
	- ## Calculations with Variables
		- ```css
		  :root {
		      --base-size: 16px;
		      --multiplier: 2;
		  }
		  
		  .element {
		      /* Use calc() with variables */
		      font-size: calc(var(--base-size) * var(--multiplier));
		      padding: calc(var(--base-size) / 2);
		      margin: calc(var(--base-size) + 10px);
		  }
		  ```
	-
- # Advanced CSS Features
  collapsed:: true
	- ## Filters
		- ```css
		  .filter-effects {
		      /* Blur */
		      filter: blur(5px);
		      
		      /* Brightness */
		      filter: brightness(150%);  /* Brighter */
		      filter: brightness(50%);   /* Darker */
		      
		      /* Contrast */
		      filter: contrast(200%);
		      
		      /* Grayscale */
		      filter: grayscale(100%);   /* Full grayscale */
		      filter: grayscale(50%);    /* Partial */
		      
		      /* Hue rotate */
		      filter: hue-rotate(90deg);
		      
		      /* Invert */
		      filter: invert(100%);
		      
		      /* Opacity */
		      filter: opacity(50%);
		      
		      /* Saturate */
		      filter: saturate(200%);
		      
		      /* Sepia */
		      filter: sepia(100%);
		      
		      /* Drop shadow */
		      filter: drop-shadow(5px 5px 10px rgba(0,0,0,0.5));
		      
		      /* Multiple filters */
		      filter: brightness(110%) contrast(120%) saturate(130%);
		  }
		  
		  /* Backdrop filter (blur background) */
		  .glass-effect {
		      background: rgba(255, 255, 255, 0.1);
		      backdrop-filter: blur(10px);
		  }
		  ```
	-
	- ## Clip Path
		- ```css
		  .clip-path {
		      /* Circle */
		      clip-path: circle(50%);
		      clip-path: circle(100px at center);
		      
		      /* Ellipse */
		      clip-path: ellipse(50% 30% at center);
		      
		      /* Polygon (custom shape) */
		      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); /* Diamond */
		      clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%);      /* Slanted */
		      
		      /* Inset (rectangle with rounded corners) */
		      clip-path: inset(10px 20px 30px 40px round 10px);
		  }
		  ```
	-
	- ## Blend Modes
		- ```css
		  .blend-mode {
		      /* Mix blend mode (blend with background) */
		      mix-blend-mode: normal;
		      mix-blend-mode: multiply;
		      mix-blend-mode: screen;
		      mix-blend-mode: overlay;
		      mix-blend-mode: darken;
		      mix-blend-mode: lighten;
		      mix-blend-mode: color-dodge;
		      mix-blend-mode: color-burn;
		      mix-blend-mode: difference;
		      mix-blend-mode: exclusion;
		      
		      /* Background blend mode */
		      background-image: url('image.jpg'), linear-gradient(red, blue);
		      background-blend-mode: multiply;
		  }
		  ```
	-
	- ## Object Fit & Object Position
		- ```css
		  img, video {
		      /* Object fit (how content fits in container) */
		      object-fit: fill;       /* Default: stretch to fill */
		      object-fit: contain;    /* Fit inside, maintain aspect ratio */
		      object-fit: cover;      /* Cover container, maintain aspect ratio */
		      object-fit: none;       /* Original size */
		      object-fit: scale-down; /* Smaller of none or contain */
		      
		      /* Object position */
		      object-position: center;
		      object-position: top left;
		      object-position: 50% 50%;
		      object-position: 10px 20px;
		  }
		  ```
	-
	- ## Scroll Snap
		- ```css
		  /* Scroll snap container */
		  .scroll-container {
		      scroll-snap-type: y mandatory;  /* Vertical snapping */
		      scroll-snap-type: x mandatory;  /* Horizontal snapping */
		      scroll-snap-type: both mandatory;
		      overflow-y: scroll;
		      height: 100vh;
		  }
		  
		  /* Scroll snap items */
		  .scroll-item {
		      scroll-snap-align: start;   /* Snap to start */
		      scroll-snap-align: center;  /* Snap to center */
		      scroll-snap-align: end;     /* Snap to end */
		      scroll-snap-stop: always;   /* Always stop at this item */
		  }
		  ```
	-
	- ## CSS Grid Auto-Placement
		- ```css
		  .masonry-grid {
		      display: grid;
		      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		      grid-auto-rows: 10px;  /* Small row height */
		      gap: 10px;
		  }
		  
		  .masonry-item {
		      grid-row-end: span 20;  /* Default span */
		  }
		  
		  /* Adjust span based on content height with JavaScript */
		  ```
	-
	- ## Aspect Ratio
		- ```css
		  .aspect-ratio {
		      /* Modern way (CSS aspect-ratio property) */
		      aspect-ratio: 16 / 9;
		      aspect-ratio: 1 / 1;  /* Square */
		      aspect-ratio: 4 / 3;
		      
		      width: 100%;
		      /* Height automatically calculated */
		  }
		  
		  /* Old way (padding hack) */
		  .aspect-ratio-old {
		      position: relative;
		      width: 100%;
		      padding-bottom: 56.25%;  /* 16:9 ratio (9/16 * 100) */
		  }
		  
		  .aspect-ratio-old > * {
		      position: absolute;
		      top: 0;
		      left: 0;
		      width: 100%;
		      height: 100%;
		  }
		  ```
	-
- # CSS Best Practices & Performance
  collapsed:: true
	- ## Specificity & Cascade
		- ```css
		  /* Specificity hierarchy (low to high):
		   * 1. Element selectors (h1, div, p)
		   * 2. Class selectors (.class)
		   * 3. ID selectors (#id)
		   * 4. Inline styles (style="...")
		   * 5. !important (avoid unless necessary)
		   */
		  
		  /* Low specificity (good for reusability) */
		  .button { background: blue; }
		  
		  /* Higher specificity */
		  .header .button { background: red; }
		  
		  /* Even higher */
		  #main .header .button { background: green; }
		  
		  /* Avoid !important */
		  .button { background: yellow !important; }  /* Hard to override */
		  
		  /* Best practice: Keep specificity low */
		  .btn-primary { background: blue; }
		  .btn-secondary { background: gray; }
		  ```
	-
	- ## CSS Organization (BEM Methodology)
		- ```css
		  /* Block Element Modifier (BEM) naming convention */
		  
		  /* Block */
		  .card { }
		  
		  /* Element (part of block) */
		  .card__header { }
		  .card__body { }
		  .card__footer { }
		  
		  /* Modifier (variation of block or element) */
		  .card--featured { }
		  .card--dark { }
		  .card__header--large { }
		  
		  /* Example */
		  .button { }
		  .button--primary { }
		  .button--secondary { }
		  .button--large { }
		  .button__icon { }
		  ```
	-
	- ## Performance Optimization
		- ```css
		  /* Use efficient selectors */
		  /* Good */
		  .nav-item { }
		  
		  /* Bad (slow) */
		  div > ul > li > a { }
		  
		  /* Avoid universal selector in complex rules */
		  /* Bad */
		  * { box-sizing: border-box; }  /* OK at root level */
		  .container * { margin: 0; }   /* Avoid */
		  
		  /* Use transform and opacity for animations (GPU accelerated) */
		  .animated {
		      /* Good (GPU accelerated) */
		      transform: translateX(100px);
		      opacity: 0.5;
		      
		      /* Avoid animating these (causes reflow) */
		      /* width, height, margin, padding, top, left */
		  }
		  
		  /* Use will-change for heavy animations */
		  .heavy-animation {
		      will-change: transform, opacity;
		  }
		  
		  /* Remove will-change after animation */
		  .heavy-animation.done {
		      will-change: auto;
		  }
		  
		  /* Contain layout changes */
		  .isolated-component {
		      contain: layout style paint;
		  }
		  
		  /* Use content-visibility for off-screen content */
		  .long-list-item {
		      content-visibility: auto;
		      contain-intrinsic-size: 0 500px;  /* Estimated height */
		  }
		  ```
	-
	- ## Accessibility Best Practices
		- ```css
		  /* Ensure sufficient color contrast (WCAG AA: 4.5:1) */
		  .text {
		      color: #333;
		      background: #fff;
		  }
		  
		  /* Visible focus indicators */
		  a:focus, button:focus {
		      outline: 2px solid blue;
		      outline-offset: 2px;
		  }
		  
		  /* Don't remove outline without alternative */
		  /* Bad */
		  button:focus { outline: none; }
		  
		  /* Good */
		  button:focus {
		      outline: none;
		      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
		  }
		  
		  /* Respect user preferences */
		  @media (prefers-reduced-motion: reduce) {
		      * {
		          animation-duration: 0.01ms !important;
		          animation-iteration-count: 1 !important;
		          transition-duration: 0.01ms !important;
		      }
		  }
		  
		  /* Hidden but accessible to screen readers */
		  .sr-only {
		      position: absolute;
		      width: 1px;
		      height: 1px;
		      padding: 0;
		      margin: -1px;
		      overflow: hidden;
		      clip: rect(0, 0, 0, 0);
		      white-space: nowrap;
		      border: 0;
		  }
		  
		  /* Minimum touch target size (44x44px) */
		  .button {
		      min-width: 44px;
		      min-height: 44px;
		  }
		  ```
	-
	- ## CSS Reset / Normalize
		- ```css
		  /* Simple CSS Reset */
		  * {
		      margin: 0;
		      padding: 0;
		      box-sizing: border-box;
		  }
		  
		  /* More comprehensive reset */
		  *, *::before, *::after {
		      box-sizing: border-box;
		  }
		  
		  body {
		      margin: 0;
		      font-family: system-ui, -apple-system, sans-serif;
		      line-height: 1.5;
		      -webkit-font-smoothing: antialiased;
		  }
		  
		  img, picture, video, canvas, svg {
		      display: block;
		      max-width: 100%;
		  }
		  
		  input, button, textarea, select {
		      font: inherit;
		  }
		  
		  p, h1, h2, h3, h4, h5, h6 {
		      overflow-wrap: break-word;
		  }
		  ```
	-
- # CSS Preprocessors & Tools
  collapsed:: true
	- ## SASS/SCSS
		- ```scss
		  // Variables
		  $primary-color: #3498db;
		  $font-stack: Arial, sans-serif;
		  
		  // Nesting
		  .nav {
		      background: $primary-color;
		      
		      ul {
		          list-style: none;
		          
		          li {
		              display: inline-block;
		              
		              a {
		                  color: white;
		                  
		                  &:hover {
		                      text-decoration: underline;
		                  }
		              }
		          }
		      }
		  }
		  
		  // Mixins
		  @mixin flex-center {
		      display: flex;
		      justify-content: center;
		      align-items: center;
		  }
		  
		  .container {
		      @include flex-center;
		  }
		  
		  // Functions
		  @function calculate-rem($size) {
		      @return $size / 16px * 1rem;
		  }
		  
		  .text {
		      font-size: calculate-rem(24px);
		  }
		  
		  // Extend/Inheritance
		  %button-base {
		      padding: 10px 20px;
		      border: none;
		      cursor: pointer;
		  }
		  
		  .btn-primary {
		      @extend %button-base;
		      background: blue;
		  }
		  
		  .btn-secondary {
		      @extend %button-base;
		      background: gray;
		  }
		  ```
	-
	- ## PostCSS
		- ```css
		  /* Autoprefixer automatically adds vendor prefixes */
		  .box {
		      display: flex;  /* Autoprefixer adds -webkit-flex, etc. */
		      transform: scale(1.5);
		  }
		  
		  /* CSS Nesting (future CSS, available via PostCSS) */
		  .card {
		      background: white;
		      
		      & .title {
		          font-size: 24px;
		      }
		      
		      &:hover {
		          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
		      }
		  }
		  ```
	-
	- ## CSS Frameworks
		- **Tailwind CSS** — Utility-first CSS framework
		- ```html
		  <div class="flex items-center justify-center h-screen bg-blue-500">
		      <h1 class="text-4xl font-bold text-white">Hello Tailwind</h1>
		  </div>
		  ```
		- **Bootstrap** — Component-based framework
		- ```html
		  <button class="btn btn-primary">Primary Button</button>
		  <div class="container">
		      <div class="row">
		          <div class="col-md-6">Column 1</div>
		          <div class="col-md-6">Column 2</div>
		      </div>
		  </div>
		  ```
	-
- # More Learn
	- ## Github & Webs
		- [Awesome CSS Learning](https://github.com/micromata/awesome-css-learning)
		- [Design Resources for Developers](https://github.com/bradtraversy/design-resources-for-developers)
		- [CSS Protips - Tips & Tricks](https://github.com/AllThingsSmitty/css-protips)
		- [Awesome CSS - Useful Modules](https://github.com/awesome-css-group/awesome-css)
		- [CSS Frameworks Collection](https://github.com/troxler/awesome-css-frameworks)
		- [Animate.css - Animation Library](https://github.com/animate-css/animate.css)
		- [Frontend Dev Bookmarks](https://github.com/dypsilon/frontend-dev-bookmarks)
		- [Grid Garden - Learn CSS Grid by Playing](https://github.com/thomaspark/gridgarden/)
		- [Flexbox Froggy - Learn Flexbox by Playing](https://github.com/thomaspark/flexboxfroggy/)
		- [You Don't Need JavaScript](https://github.com/you-dont-need/You-Dont-Need-JavaScript)
		- [CSS Interview Questions](https://github.com/Devinterview-io/css-interview-questions)
		- [MDN Web Docs - CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
		- [CSS-Tricks](https://css-tricks.com/)
		- [Can I Use - Browser Support](https://caniuse.com/)
		- [Animate.css - Animations](https://animate.style/)
		- [Creative Buttons](https://tympanus.net/Development/CreativeButtons/)
		- [Anime.js - Animation Library](https://animejs.com/)
	-
	- ## Master Playlists YouTube
		- [CSS Full Course - FreeCodeCamp](https://www.youtube.com/watch?v=1Rs2ND1ryYc)
		- [CSS Tutorial - Traversy Media](https://www.youtube.com/watch?v=yfoY53QXEnI)
		- [CSS Crash Course - Web Dev Simplified](https://www.youtube.com/watch?v=Edsxf_NBFrw)
		- [Flexbox Tutorial - Wes Bos](https://www.youtube.com/watch?v=JJSoEo8JSnc)
		- [CSS Grid Tutorial - Wes Bos](https://www.youtube.com/watch?v=T-slCsOrLcc)
		- [CSS Animations - Kevin Powell](https://www.youtube.com/watch?v=YszONjKpgg4)
