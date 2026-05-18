---
seoTitle: HTML5 Complete Guide – Semantic Elements, Forms, and Modern Web Development
description: "Comprehensive HTML5 reference covering document structure, semantic elements, forms, tables, media, accessibility, SEO meta tags, and best practices."
keywords: "HTML, HTML5, semantic HTML, web development, forms, tables, accessibility, SEO, meta tags, HTML elements, HTML attributes, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: HTML
author: Makvana Smitrajsinh
authorUrl: https://portfolio-eight-theta-7g6hpaehqn.vercel.app/
---

- # History
  collapsed:: true
	- **How**:
		- Developed by **Tim Berners-Lee** in **1991** at **CERN** as the foundational markup language for the World Wide Web.
		- Originally called **HTML** (HyperText Markup Language), designed to structure and link documents.
		- Evolved through versions: HTML 2.0 (1995), HTML 4.01 (1999), XHTML (2000), HTML5 (2014).
		- HTML5 introduced semantic elements, multimedia support, and APIs for modern web applications.
	-
	- **Who**:
		- **Tim Berners-Lee** — British computer scientist, inventor of the World Wide Web.
		- **W3C** (World Wide Web Consortium) — oversees HTML standards and development.
		- **WHATWG** (Web Hypertext Application Technology Working Group) — maintains the living HTML standard.
	-
	- **Why**:
		- To create a universal, platform-independent way to structure and share documents on the web.
		- To enable hyperlinks connecting documents across the internet.
		- To provide a foundation for multimedia, interactive, and accessible web content.
-
- # Introduction
  collapsed:: true
	- ## Advantages
		- **Universal Standard** — Supported by all browsers and platforms (Chrome, Firefox, Safari, Edge).
		- **Easy to Learn** — Simple tag-based syntax, beginner-friendly.
		- **Semantic Markup** — Elements like `<header>`, `<article>`, `<nav>` improve accessibility and SEO.
		- **Multimedia Support** — Native `<video>`, `<audio>`, `<canvas>` without plugins.
		- **Accessibility** — ARIA attributes and semantic tags support screen readers and assistive technologies.
		- **SEO-Friendly** — Proper structure and meta tags improve search engine rankings.
		- **Integration** — Works seamlessly with CSS (styling) and JavaScript (interactivity).
	-
	- ## Disadvantages
		- **Static by Nature** — No logic or dynamic behavior without JavaScript.
		- **Limited Styling** — Requires CSS for layout and visual design.
		- **Browser Inconsistencies** — Older browsers may not support HTML5 features.
		- **No Built-in Security** — Vulnerable to XSS attacks without proper sanitization.
		- **Verbose** — Can become repetitive for large documents.
-
- # Basics
  collapsed:: true
	- ## Document Structure & Entry Point
		- ```html
		  <!DOCTYPE html>
		  <html lang="en">
		  <head>
		      <meta charset="UTF-8">
		      <meta name="viewport" content="width=device-width, initial-scale=1.0">
		      <title>My First Page</title>
		  </head>
		  <body>
		      <h1>Hello, World!</h1>
		      <p>This is my first HTML page.</p>
		  </body>
		  </html>
		  ```
		- `<!DOCTYPE html>` — Declares HTML5 document type.
		- `<html>` — Root element, contains all content.
		- `<head>` — Metadata, links to CSS/JS, title, meta tags.
		- `<body>` — Visible content displayed in the browser.
	-
	- ## Comments
		- ```html
		  <!-- This is a single-line comment -->
		  
		  <!-- 
		      This is a 
		      multi-line comment 
		  -->
		  
		  <!-- TODO: Add navigation menu -->
		  ```
	-
	- ## Text Elements & Formatting
		- ```html
		  <!-- Headings (h1 is largest, h6 is smallest) -->
		  <h1>Main Heading</h1>
		  <h2>Subheading</h2>
		  <h3>Section Title</h3>
		  <h4>Subsection</h4>
		  <h5>Minor Heading</h5>
		  <h6>Smallest Heading</h6>
		  
		  <!-- Paragraphs -->
		  <p>This is a paragraph of text.</p>
		  
		  <!-- Line break -->
		  <p>First line<br>Second line</p>
		  
		  <!-- Horizontal rule -->
		  <hr>
		  
		  <!-- Text formatting -->
		  <strong>Bold text (semantic importance)</strong>
		  <b>Bold text (visual only)</b>
		  <em>Italic text (semantic emphasis)</em>
		  <i>Italic text (visual only)</i>
		  <mark>Highlighted text</mark>
		  <small>Smaller text</small>
		  <del>Deleted text</del>
		  <ins>Inserted text</ins>
		  <sub>Subscript</sub> H<sub>2</sub>O
		  <sup>Superscript</sup> E=mc<sup>2</sup>
		  <code>Inline code</code>
		  <pre>Preformatted text preserves    spaces</pre>
		  <kbd>Keyboard input</kbd>
		  <samp>Sample output</samp>
		  <var>Variable</var>
		  <abbr title="HyperText Markup Language">HTML</abbr>
		  <q>Short inline quote</q>
		  <blockquote cite="https://example.com">
		      Long block quote with citation
		  </blockquote>
		  ```
	-
	- ## Links & Navigation
		- ```html
		  <!-- Basic link -->
		  <a href="https://example.com">Visit Example</a>
		  
		  <!-- Open in new tab -->
		  <a href="https://example.com" target="_blank" rel="noopener noreferrer">
		      External Link
		  </a>
		  
		  <!-- Relative links -->
		  <a href="/about.html">About Page</a>
		  <a href="../index.html">Parent Directory</a>
		  <a href="./contact.html">Same Directory</a>
		  
		  <!-- Anchor links (jump to section) -->
		  <a href="#section1">Go to Section 1</a>
		  <h2 id="section1">Section 1</h2>
		  
		  <!-- Email link -->
		  <a href="mailto:email@example.com">Send Email</a>
		  
		  <!-- Phone link -->
		  <a href="tel:+1234567890">Call Us</a>
		  
		  <!-- Download link -->
		  <a href="document.pdf" download>Download PDF</a>
		  ```
	-
	- ## Images
		- ```html
		  <!-- Basic image -->
		  <img src="image.jpg" alt="Description of image">
		  
		  <!-- Image with dimensions -->
		  <img src="photo.jpg" alt="Photo" width="300" height="200">
		  
		  <!-- Responsive image -->
		  <img src="image.jpg" alt="Responsive" style="max-width: 100%; height: auto;">
		  
		  <!-- Image with link -->
		  <a href="https://example.com">
		      <img src="logo.png" alt="Company Logo">
		  </a>
		  
		  <!-- Picture element for responsive images -->
		  <picture>
		      <source media="(min-width: 800px)" srcset="large.jpg">
		      <source media="(min-width: 400px)" srcset="medium.jpg">
		      <img src="small.jpg" alt="Responsive image">
		  </picture>
		  
		  <!-- Figure with caption -->
		  <figure>
		      <img src="chart.png" alt="Sales Chart">
		      <figcaption>Q4 Sales Performance</figcaption>
		  </figure>
		  ```
	-
	- ## Lists
		- ```html
		  <!-- Unordered list (bullets) -->
		  <ul>
		      <li>Item 1</li>
		      <li>Item 2</li>
		      <li>Item 3</li>
		  </ul>
		  
		  <!-- Ordered list (numbers) -->
		  <ol>
		      <li>First step</li>
		      <li>Second step</li>
		      <li>Third step</li>
		  </ol>
		  
		  <!-- Ordered list with custom start -->
		  <ol start="5">
		      <li>Item 5</li>
		      <li>Item 6</li>
		  </ol>
		  
		  <!-- Ordered list with type -->
		  <ol type="A">
		      <li>Item A</li>
		      <li>Item B</li>
		  </ol>
		  
		  <!-- Description list -->
		  <dl>
		      <dt>HTML</dt>
		      <dd>HyperText Markup Language</dd>
		      <dt>CSS</dt>
		      <dd>Cascading Style Sheets</dd>
		  </dl>
		  
		  <!-- Nested lists -->
		  <ul>
		      <li>Parent Item 1
		          <ul>
		              <li>Child Item 1.1</li>
		              <li>Child Item 1.2</li>
		          </ul>
		      </li>
		      <li>Parent Item 2</li>
		  </ul>
		  ```
	-
- # Semantic HTML5 Elements
  collapsed:: true
	- ## Document Structure
		- ```html
		  <!DOCTYPE html>
		  <html lang="en">
		  <head>
		      <meta charset="UTF-8">
		      <title>Semantic Page</title>
		  </head>
		  <body>
		      <!-- Header section -->
		      <header>
		          <nav>
		              <ul>
		                  <li><a href="#home">Home</a></li>
		                  <li><a href="#about">About</a></li>
		                  <li><a href="#contact">Contact</a></li>
		              </ul>
		          </nav>
		      </header>
		      
		      <!-- Main content -->
		      <main>
		          <article>
		              <header>
		                  <h1>Article Title</h1>
		                  <p>Published on <time datetime="2024-01-15">January 15, 2024</time></p>
		              </header>
		              <section>
		                  <h2>Introduction</h2>
		                  <p>Article content...</p>
		              </section>
		              <section>
		                  <h2>Main Content</h2>
		                  <p>More content...</p>
		              </section>
		              <footer>
		                  <p>Author: John Doe</p>
		              </footer>
		          </article>
		          
		          <aside>
		              <h3>Related Links</h3>
		              <ul>
		                  <li><a href="#">Link 1</a></li>
		                  <li><a href="#">Link 2</a></li>
		              </ul>
		          </aside>
		      </main>
		      
		      <!-- Footer section -->
		      <footer>
		          <p>&copy; 2024 Company Name. All rights reserved.</p>
		      </footer>
		  </body>
		  </html>
		  ```
	-
	- ## Semantic Elements Explained
		- `<header>` — Introductory content or navigation links (can be used multiple times).
		- `<nav>` — Navigation links section.
		- `<main>` — Main content of the document (only one per page).
		- `<article>` — Self-contained content that could be distributed independently.
		- `<section>` — Thematic grouping of content, typically with a heading.
		- `<aside>` — Content tangentially related to main content (sidebars, callouts).
		- `<footer>` — Footer for document or section (copyright, links, author info).
		- `<figure>` — Self-contained content like images, diagrams, code listings.
		- `<figcaption>` — Caption for `<figure>` element.
		- `<time>` — Represents a specific time or date.
		- `<mark>` — Highlighted or marked text for reference.
		- `<details>` — Disclosure widget that can be toggled open/closed.
		- `<summary>` — Summary or label for `<details>` element.
	-
	- ## Details & Summary (Interactive)
		- ```html
		  <details>
		      <summary>Click to expand</summary>
		      <p>Hidden content that appears when expanded.</p>
		      <ul>
		          <li>Item 1</li>
		          <li>Item 2</li>
		      </ul>
		  </details>
		  
		  <!-- Open by default -->
		  <details open>
		      <summary>Already expanded</summary>
		      <p>This content is visible by default.</p>
		  </details>
		  ```
	-
- # Forms & Input Elements
  collapsed:: true
	- ## Basic Form Structure
		- ```html
		  <form action="/submit" method="POST">
		      <label for="username">Username:</label>
		      <input type="text" id="username" name="username" required>
		      
		      <label for="password">Password:</label>
		      <input type="password" id="password" name="password" required>
		      
		      <button type="submit">Submit</button>
		  </form>
		  ```
	-
	- ## Input Types
		- ```html
		  <!-- Text inputs -->
		  <input type="text" placeholder="Enter text">
		  <input type="email" placeholder="email@example.com">
		  <input type="password" placeholder="Password">
		  <input type="tel" placeholder="Phone number">
		  <input type="url" placeholder="https://example.com">
		  <input type="search" placeholder="Search...">
		  
		  <!-- Number inputs -->
		  <input type="number" min="0" max="100" step="5" value="50">
		  <input type="range" min="0" max="100" value="50">
		  
		  <!-- Date and time -->
		  <input type="date">
		  <input type="time">
		  <input type="datetime-local">
		  <input type="month">
		  <input type="week">
		  
		  <!-- Selection inputs -->
		  <input type="checkbox" id="agree" name="agree">
		  <label for="agree">I agree to terms</label>
		  
		  <input type="radio" id="male" name="gender" value="male">
		  <label for="male">Male</label>
		  <input type="radio" id="female" name="gender" value="female">
		  <label for="female">Female</label>
		  
		  <!-- File upload -->
		  <input type="file" accept=".pdf,.doc,.docx">
		  <input type="file" accept="image/*" multiple>
		  
		  <!-- Color picker -->
		  <input type="color" value="#ff0000">
		  
		  <!-- Hidden input -->
		  <input type="hidden" name="userId" value="12345">
		  ```
	-
	- ## Textarea & Select
		- ```html
		  <!-- Multi-line text -->
		  <textarea name="message" rows="5" cols="40" placeholder="Enter message..."></textarea>
		  
		  <!-- Dropdown select -->
		  <select name="country">
		      <option value="">Select country</option>
		      <option value="us">United States</option>
		      <option value="uk">United Kingdom</option>
		      <option value="ca">Canada</option>
		  </select>
		  
		  <!-- Multiple selection -->
		  <select name="skills" multiple>
		      <option value="html">HTML</option>
		      <option value="css">CSS</option>
		      <option value="js">JavaScript</option>
		  </select>
		  
		  <!-- Grouped options -->
		  <select name="food">
		      <optgroup label="Fruits">
		          <option value="apple">Apple</option>
		          <option value="banana">Banana</option>
		      </optgroup>
		      <optgroup label="Vegetables">
		          <option value="carrot">Carrot</option>
		          <option value="broccoli">Broccoli</option>
		      </optgroup>
		  </select>
		  ```
	-
	- ## Form Attributes & Validation
		- ```html
		  <form action="/submit" method="POST" novalidate>
		      <!-- Required field -->
		      <input type="text" name="username" required>
		      
		      <!-- Min/max length -->
		      <input type="text" name="code" minlength="3" maxlength="10">
		      
		      <!-- Pattern validation (regex) -->
		      <input type="text" name="zipcode" pattern="[0-9]{5}" 
		             title="5-digit zip code">
		      
		      <!-- Email validation -->
		      <input type="email" name="email" required>
		      
		      <!-- Number range -->
		      <input type="number" name="age" min="18" max="100">
		      
		      <!-- Disabled input -->
		      <input type="text" name="readonly" value="Cannot edit" disabled>
		      
		      <!-- Readonly input -->
		      <input type="text" name="readonly" value="Can copy" readonly>
		      
		      <!-- Autofocus -->
		      <input type="text" name="first" autofocus>
		      
		      <!-- Autocomplete -->
		      <input type="email" name="email" autocomplete="email">
		      
		      <!-- Placeholder -->
		      <input type="text" placeholder="Enter your name">
		      
		      <button type="submit">Submit</button>
		      <button type="reset">Reset</button>
		      <button type="button">Custom Action</button>
		  </form>
		  ```
	-
	- ## Datalist (Autocomplete Suggestions)
		- ```html
		  <label for="browser">Choose browser:</label>
		  <input list="browsers" id="browser" name="browser">
		  <datalist id="browsers">
		      <option value="Chrome">
		      <option value="Firefox">
		      <option value="Safari">
		      <option value="Edge">
		  </datalist>
		  ```
	-
	- ## Fieldset & Legend (Grouping)
		- ```html
		  <form>
		      <fieldset>
		          <legend>Personal Information</legend>
		          <label for="fname">First Name:</label>
		          <input type="text" id="fname" name="fname"><br>
		          <label for="lname">Last Name:</label>
		          <input type="text" id="lname" name="lname">
		      </fieldset>
		      
		      <fieldset>
		          <legend>Contact Details</legend>
		          <label for="email">Email:</label>
		          <input type="email" id="email" name="email"><br>
		          <label for="phone">Phone:</label>
		          <input type="tel" id="phone" name="phone">
		      </fieldset>
		  </form>
		  ```
	-
- # Tables
  collapsed:: true
	- ## Basic Table Structure
		- ```html
		  <table>
		      <thead>
		          <tr>
		              <th>Name</th>
		              <th>Age</th>
		              <th>City</th>
		          </tr>
		      </thead>
		      <tbody>
		          <tr>
		              <td>Alice</td>
		              <td>25</td>
		              <td>New York</td>
		          </tr>
		          <tr>
		              <td>Bob</td>
		              <td>30</td>
		              <td>London</td>
		          </tr>
		      </tbody>
		      <tfoot>
		          <tr>
		              <td colspan="3">Total: 2 people</td>
		          </tr>
		      </tfoot>
		  </table>
		  ```
	-
	- ## Table with Colspan & Rowspan
		- ```html
		  <table border="1">
		      <tr>
		          <th>Name</th>
		          <th colspan="2">Contact</th>
		      </tr>
		      <tr>
		          <td>John</td>
		          <td>Email</td>
		          <td>john@example.com</td>
		      </tr>
		      <tr>
		          <td rowspan="2">Jane</td>
		          <td>Email</td>
		          <td>jane@example.com</td>
		      </tr>
		      <tr>
		          <td>Phone</td>
		          <td>123-456-7890</td>
		      </tr>
		  </table>
		  ```
	-
	- ## Table with Caption
		- ```html
		  <table>
		      <caption>Monthly Sales Report</caption>
		      <thead>
		          <tr>
		              <th>Month</th>
		              <th>Sales</th>
		          </tr>
		      </thead>
		      <tbody>
		          <tr>
		              <td>January</td>
		              <td>$10,000</td>
		          </tr>
		          <tr>
		              <td>February</td>
		              <td>$12,000</td>
		          </tr>
		      </tbody>
		  </table>
		  ```
	-
- # Multimedia Elements
  collapsed:: true
	- ## Audio
		- ```html
		  <!-- Basic audio -->
		  <audio controls>
		      <source src="audio.mp3" type="audio/mpeg">
		      <source src="audio.ogg" type="audio/ogg">
		      Your browser does not support the audio element.
		  </audio>
		  
		  <!-- Autoplay and loop -->
		  <audio controls autoplay loop muted>
		      <source src="background.mp3" type="audio/mpeg">
		  </audio>
		  
		  <!-- Preload options -->
		  <audio controls preload="auto">
		      <source src="song.mp3" type="audio/mpeg">
		  </audio>
		  <!-- preload values: auto, metadata, none -->
		  ```
	-
	- ## Video
		- ```html
		  <!-- Basic video -->
		  <video controls width="640" height="360">
		      <source src="video.mp4" type="video/mp4">
		      <source src="video.webm" type="video/webm">
		      Your browser does not support the video tag.
		  </video>
		  
		  <!-- Video with poster and attributes -->
		  <video controls width="800" poster="thumbnail.jpg" preload="metadata">
		      <source src="movie.mp4" type="video/mp4">
		      <track src="subtitles_en.vtt" kind="subtitles" srclang="en" label="English">
		      <track src="subtitles_es.vtt" kind="subtitles" srclang="es" label="Spanish">
		  </video>
		  
		  <!-- Autoplay muted (required for autoplay in most browsers) -->
		  <video autoplay muted loop playsinline>
		      <source src="background.mp4" type="video/mp4">
		  </video>
		  ```
	-
	- ## Iframe (Embedding External Content)
		- ```html
		  <!-- Embed webpage -->
		  <iframe src="https://example.com" width="800" height="600"></iframe>
		  
		  <!-- YouTube video -->
		  <iframe width="560" height="315" 
		          src="https://www.youtube.com/embed/VIDEO_ID" 
		          frameborder="0" 
		          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
		          allowfullscreen>
		  </iframe>
		  
		  <!-- Google Maps -->
		  <iframe src="https://www.google.com/maps/embed?pb=..." 
		          width="600" height="450" 
		          style="border:0;" 
		          allowfullscreen="" 
		          loading="lazy">
		  </iframe>
		  
		  <!-- Sandbox attribute for security -->
		  <iframe src="untrusted.html" sandbox="allow-scripts allow-same-origin"></iframe>
		  ```
	-
	- ## Canvas (Drawing Graphics)
		- ```html
		  <canvas id="myCanvas" width="400" height="200" style="border:1px solid #000;">
		      Your browser does not support the canvas element.
		  </canvas>
		  
		  <script>
		      const canvas = document.getElementById('myCanvas');
		      const ctx = canvas.getContext('2d');
		      
		      // Draw rectangle
		      ctx.fillStyle = '#FF0000';
		      ctx.fillRect(20, 20, 150, 100);
		      
		      // Draw circle
		      ctx.beginPath();
		      ctx.arc(300, 70, 50, 0, 2 * Math.PI);
		      ctx.fillStyle = '#0000FF';
		      ctx.fill();
		  </script>
		  ```
	-
	- ## SVG (Scalable Vector Graphics)
		- ```html
		  <!-- Inline SVG -->
		  <svg width="200" height="200">
		      <circle cx="100" cy="100" r="80" fill="blue" />
		      <rect x="50" y="50" width="100" height="100" fill="red" opacity="0.5" />
		      <line x1="0" y1="0" x2="200" y2="200" stroke="green" stroke-width="2" />
		      <text x="100" y="100" text-anchor="middle" fill="white">SVG Text</text>
		  </svg>
		  
		  <!-- External SVG -->
		  <img src="logo.svg" alt="Logo">
		  <object data="diagram.svg" type="image/svg+xml"></object>
		  ```
	-
- # Meta Tags & SEO
  collapsed:: true
	- ## Essential Meta Tags
		- ```html
		  <head>
		      <!-- Character encoding -->
		      <meta charset="UTF-8">
		      
		      <!-- Viewport for responsive design -->
		      <meta name="viewport" content="width=device-width, initial-scale=1.0">
		      
		      <!-- Page title (appears in browser tab and search results) -->
		      <title>Page Title - 50-60 characters optimal</title>
		      
		      <!-- Meta description (appears in search results) -->
		      <meta name="description" content="Concise description of page content, 150-160 characters optimal for SEO.">
		      
		      <!-- Keywords (less important for modern SEO) -->
		      <meta name="keywords" content="html, web development, tutorial">
		      
		      <!-- Author -->
		      <meta name="author" content="Your Name">
		      
		      <!-- Robots (control search engine indexing) -->
		      <meta name="robots" content="index, follow">
		      <!-- Options: index/noindex, follow/nofollow -->
		      
		      <!-- Canonical URL (prevent duplicate content issues) -->
		      <link rel="canonical" href="https://example.com/page">
		      
		      <!-- Language -->
		      <meta http-equiv="content-language" content="en-US">
		  </head>
		  ```
	-
	- ## Open Graph (Social Media Sharing)
		- ```html
		  <!-- Facebook, LinkedIn, etc. -->
		  <meta property="og:title" content="Page Title">
		  <meta property="og:description" content="Description for social media">
		  <meta property="og:image" content="https://example.com/image.jpg">
		  <meta property="og:url" content="https://example.com/page">
		  <meta property="og:type" content="website">
		  <meta property="og:site_name" content="Site Name">
		  <meta property="og:locale" content="en_US">
		  ```
	-
	- ## Twitter Card
		- ```html
		  <meta name="twitter:card" content="summary_large_image">
		  <meta name="twitter:site" content="@username">
		  <meta name="twitter:title" content="Page Title">
		  <meta name="twitter:description" content="Description for Twitter">
		  <meta name="twitter:image" content="https://example.com/image.jpg">
		  <meta name="twitter:creator" content="@author">
		  ```
	-
	- ## Favicon & App Icons
		- ```html
		  <!-- Standard favicon -->
		  <link rel="icon" type="image/x-icon" href="/favicon.ico">
		  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
		  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
		  
		  <!-- Apple Touch Icon -->
		  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
		  
		  <!-- Android Chrome -->
		  <link rel="manifest" href="/site.webmanifest">
		  
		  <!-- Safari Pinned Tab -->
		  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
		  
		  <!-- Theme color for mobile browsers -->
		  <meta name="theme-color" content="#ffffff">
		  ```
	-
	- ## Other Important Meta Tags
		- ```html
		  <!-- Refresh/redirect after 5 seconds -->
		  <meta http-equiv="refresh" content="5;url=https://example.com">
		  
		  <!-- Disable automatic phone number detection -->
		  <meta name="format-detection" content="telephone=no">
		  
		  <!-- Prevent caching -->
		  <meta http-equiv="cache-control" content="no-cache">
		  <meta http-equiv="expires" content="0">
		  <meta http-equiv="pragma" content="no-cache">
		  
		  <!-- IE compatibility mode -->
		  <meta http-equiv="X-UA-Compatible" content="IE=edge">
		  
		  <!-- Referrer policy -->
		  <meta name="referrer" content="no-referrer-when-downgrade">
		  ```
	-
- # Accessibility (ARIA & Best Practices)
  collapsed:: true
	- ## ARIA Roles
		- ```html
		  <!-- Landmark roles -->
		  <header role="banner">Site header</header>
		  <nav role="navigation">Navigation menu</nav>
		  <main role="main">Main content</main>
		  <aside role="complementary">Sidebar</aside>
		  <footer role="contentinfo">Footer</footer>
		  
		  <!-- Widget roles -->
		  <div role="button" tabindex="0">Custom Button</div>
		  <div role="alert">Important message</div>
		  <div role="dialog" aria-labelledby="dialog-title">
		      <h2 id="dialog-title">Dialog Title</h2>
		  </div>
		  
		  <!-- Document structure roles -->
		  <div role="article">Article content</div>
		  <div role="list">
		      <div role="listitem">Item 1</div>
		      <div role="listitem">Item 2</div>
		  </div>
		  ```
	-
	- ## ARIA Attributes
		- ```html
		  <!-- Labels and descriptions -->
		  <button aria-label="Close dialog">×</button>
		  <input type="text" aria-labelledby="username-label">
		  <label id="username-label">Username</label>
		  <button aria-describedby="help-text">Submit</button>
		  <span id="help-text">Click to submit the form</span>
		  
		  <!-- States and properties -->
		  <button aria-pressed="false">Toggle</button>
		  <div aria-expanded="false">Collapsed content</div>
		  <input type="checkbox" aria-checked="true">
		  <button aria-disabled="true">Disabled Button</button>
		  <div aria-hidden="true">Hidden from screen readers</div>
		  <div aria-live="polite">Dynamic content updates</div>
		  <div aria-live="assertive">Urgent updates</div>
		  
		  <!-- Required and invalid -->
		  <input type="text" aria-required="true">
		  <input type="email" aria-invalid="true" aria-errormessage="email-error">
		  <span id="email-error" role="alert">Invalid email format</span>
		  
		  <!-- Current state -->
		  <a href="#" aria-current="page">Current Page</a>
		  ```
	-
	- ## Accessible Forms
		- ```html
		  <form>
		      <!-- Always associate labels with inputs -->
		      <label for="email">Email Address:</label>
		      <input type="email" id="email" name="email" 
		             aria-required="true" 
		             aria-describedby="email-help">
		      <small id="email-help">We'll never share your email</small>
		      
		      <!-- Error messages -->
		      <input type="text" id="username" 
		             aria-invalid="true" 
		             aria-errormessage="username-error">
		      <span id="username-error" role="alert">
		          Username must be at least 3 characters
		      </span>
		      
		      <!-- Fieldset for radio groups -->
		      <fieldset>
		          <legend>Choose payment method</legend>
		          <input type="radio" id="credit" name="payment" value="credit">
		          <label for="credit">Credit Card</label>
		          <input type="radio" id="paypal" name="payment" value="paypal">
		          <label for="paypal">PayPal</label>
		      </fieldset>
		  </form>
		  ```
	-
	- ## Keyboard Navigation
		- ```html
		  <!-- Tabindex -->
		  <div tabindex="0">Focusable div</div>
		  <div tabindex="-1">Programmatically focusable</div>
		  <!-- tabindex="0" = natural tab order -->
		  <!-- tabindex="-1" = not in tab order, but focusable via JS -->
		  <!-- tabindex="1+" = custom tab order (avoid if possible) -->
		  
		  <!-- Skip to main content link -->
		  <a href="#main-content" class="skip-link">Skip to main content</a>
		  <main id="main-content">
		      <!-- Main content -->
		  </main>
		  ```
	-
	- ## Image Accessibility
		- ```html
		  <!-- Descriptive alt text -->
		  <img src="chart.png" alt="Bar chart showing 50% increase in sales">
		  
		  <!-- Decorative images (empty alt) -->
		  <img src="decoration.png" alt="">
		  
		  <!-- Complex images with longdesc -->
		  <img src="complex-diagram.png" 
		       alt="System architecture diagram" 
		       aria-describedby="diagram-desc">
		  <div id="diagram-desc">
		      Detailed description of the diagram...
		  </div>
		  ```
	-
- # Advanced HTML5 Features
  collapsed:: true
	- ## Data Attributes
		- ```html
		  <!-- Custom data attributes -->
		  <div data-user-id="12345" data-role="admin" data-status="active">
		      User Profile
		  </div>
		  
		  <button data-action="delete" data-item-id="789">Delete</button>
		  
		  <script>
		      const div = document.querySelector('div');
		      console.log(div.dataset.userId);    // "12345"
		      console.log(div.dataset.role);      // "admin"
		      console.log(div.dataset.status);    // "active"
		      
		      // Set data attribute
		      div.dataset.newAttr = "value";
		  </script>
		  ```
	-
	- ## Content Editable
		- ```html
		  <!-- Make any element editable -->
		  <div contenteditable="true">
		      You can edit this text directly in the browser.
		  </div>
		  
		  <p contenteditable="false">This paragraph cannot be edited.</p>
		  
		  <!-- Editable list -->
		  <ul contenteditable="true">
		      <li>Edit me</li>
		      <li>Or me</li>
		  </ul>
		  ```
	-
	- ## Drag and Drop
		- ```html
		  <!-- Draggable element -->
		  <div draggable="true" id="drag-item">
		      Drag me!
		  </div>
		  
		  <!-- Drop zone -->
		  <div id="drop-zone" style="width: 200px; height: 200px; border: 2px dashed #ccc;">
		      Drop here
		  </div>
		  
		  <script>
		      const dragItem = document.getElementById('drag-item');
		      const dropZone = document.getElementById('drop-zone');
		      
		      dragItem.addEventListener('dragstart', (e) => {
		          e.dataTransfer.setData('text/plain', e.target.id);
		      });
		      
		      dropZone.addEventListener('dragover', (e) => {
		          e.preventDefault(); // Allow drop
		      });
		      
		      dropZone.addEventListener('drop', (e) => {
		          e.preventDefault();
		          const data = e.dataTransfer.getData('text/plain');
		          const element = document.getElementById(data);
		          dropZone.appendChild(element);
		      });
		  </script>
		  ```
	-
	- ## Local Storage & Session Storage
		- ```html
		  <script>
		      // Local Storage (persists after browser close)
		      localStorage.setItem('username', 'JohnDoe');
		      localStorage.setItem('theme', 'dark');
		      
		      const username = localStorage.getItem('username');
		      console.log(username); // "JohnDoe"
		      
		      localStorage.removeItem('theme');
		      localStorage.clear(); // Remove all items
		      
		      // Session Storage (cleared when tab closes)
		      sessionStorage.setItem('sessionId', '12345');
		      const sessionId = sessionStorage.getItem('sessionId');
		      
		      // Store objects (must stringify)
		      const user = { name: 'John', age: 30 };
		      localStorage.setItem('user', JSON.stringify(user));
		      const storedUser = JSON.parse(localStorage.getItem('user'));
		  </script>
		  ```
	-
	- ## Geolocation API
		- ```html
		  <button onclick="getLocation()">Get My Location</button>
		  <p id="location"></p>
		  
		  <script>
		      function getLocation() {
		          if (navigator.geolocation) {
		              navigator.geolocation.getCurrentPosition(showPosition, showError);
		          } else {
		              document.getElementById('location').innerHTML = 
		                  "Geolocation is not supported by this browser.";
		          }
		      }
		      
		      function showPosition(position) {
		          document.getElementById('location').innerHTML = 
		              "Latitude: " + position.coords.latitude + 
		              "<br>Longitude: " + position.coords.longitude;
		      }
		      
		      function showError(error) {
		          console.error("Error: " + error.message);
		      }
		  </script>
		  ```
	-
- # Best Practices & Performance
  collapsed:: true
	- ## HTML Structure Best Practices
		- Use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`) instead of generic `<div>`.
		- Always include `<!DOCTYPE html>` declaration.
		- Set `lang` attribute on `<html>` tag for accessibility and SEO.
		- Use lowercase for element names and attributes.
		- Always close tags properly (even self-closing tags in XHTML).
		- Indent nested elements for readability.
		- Use meaningful IDs and class names (kebab-case or camelCase).
		- Validate HTML using W3C Validator.
	-
	- ## Performance Optimization
		- ```html
		  <!-- Defer JavaScript loading -->
		  <script src="script.js" defer></script>
		  
		  <!-- Async JavaScript (for independent scripts) -->
		  <script src="analytics.js" async></script>
		  
		  <!-- Preload critical resources -->
		  <link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
		  <link rel="preload" href="hero.jpg" as="image">
		  
		  <!-- Prefetch resources for next page -->
		  <link rel="prefetch" href="next-page.html">
		  
		  <!-- DNS prefetch for external domains -->
		  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
		  
		  <!-- Preconnect to external domains -->
		  <link rel="preconnect" href="https://cdn.example.com">
		  
		  <!-- Lazy loading images -->
		  <img src="image.jpg" alt="Description" loading="lazy">
		  
		  <!-- Responsive images for performance -->
		  <img srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
		       sizes="(max-width: 600px) 480px, (max-width: 1000px) 800px, 1200px"
		       src="medium.jpg" alt="Responsive image">
		  ```
	-
	- ## Security Best Practices
		- ```html
		  <!-- Use HTTPS for all external resources -->
		  <link rel="stylesheet" href="https://cdn.example.com/style.css">
		  
		  <!-- Add rel="noopener noreferrer" to external links -->
		  <a href="https://external.com" target="_blank" rel="noopener noreferrer">
		      External Link
		  </a>
		  
		  <!-- Content Security Policy -->
		  <meta http-equiv="Content-Security-Policy" 
		        content="default-src 'self'; script-src 'self' https://trusted.com">
		  
		  <!-- Prevent clickjacking -->
		  <meta http-equiv="X-Frame-Options" content="DENY">
		  
		  <!-- XSS Protection -->
		  <meta http-equiv="X-XSS-Protection" content="1; mode=block">
		  
		  <!-- Disable MIME type sniffing -->
		  <meta http-equiv="X-Content-Type-Options" content="nosniff">
		  ```
	-
	- ## SEO Best Practices
		- Use one `<h1>` per page (main heading).
		- Use heading hierarchy properly (h1 → h2 → h3, don't skip levels).
		- Write descriptive alt text for all images.
		- Use descriptive link text (avoid "click here").
		- Create a sitemap.xml and robots.txt.
		- Use structured data (Schema.org) for rich snippets.
		- Ensure mobile-friendly responsive design.
		- Optimize page load speed.
		- Use canonical URLs to prevent duplicate content.
	-
	- ## Accessibility Checklist
		- Provide alt text for all images.
		- Use semantic HTML elements.
		- Ensure sufficient color contrast (WCAG AA: 4.5:1 for normal text).
		- Make all functionality keyboard accessible.
		- Use ARIA attributes when semantic HTML isn't enough.
		- Provide captions and transcripts for multimedia.
		- Test with screen readers (NVDA, JAWS, VoiceOver).
		- Use focus indicators for interactive elements.
		- Avoid using color alone to convey information.
		- Provide skip navigation links.
	-
- # HTML Entities & Special Characters
  collapsed:: true
	- ## Common HTML Entities
		- ```html
		  <!-- Reserved characters -->
		  &lt;      <!-- < (less than) -->
		  &gt;      <!-- > (greater than) -->
		  &amp;     <!-- & (ampersand) -->
		  &quot;    <!-- " (double quote) -->
		  &apos;    <!-- ' (apostrophe) -->
		  
		  <!-- Spaces -->
		  &nbsp;    <!-- non-breaking space -->
		  &ensp;    <!-- en space -->
		  &emsp;    <!-- em space -->
		  
		  <!-- Symbols -->
		  &copy;    <!-- © (copyright) -->
		  &reg;     <!-- ® (registered trademark) -->
		  &trade;   <!-- ™ (trademark) -->
		  &euro;    <!-- € (euro) -->
		  &pound;   <!-- £ (pound) -->
		  &yen;     <!-- ¥ (yen) -->
		  &cent;    <!-- ¢ (cent) -->
		  
		  <!-- Math symbols -->
		  &times;   <!-- × (multiplication) -->
		  &divide;  <!-- ÷ (division) -->
		  &plusmn;  <!-- ± (plus-minus) -->
		  &ne;      <!-- ≠ (not equal) -->
		  &le;      <!-- ≤ (less than or equal) -->
		  &ge;      <!-- ≥ (greater than or equal) -->
		  
		  <!-- Arrows -->
		  &larr;    <!-- ← (left arrow) -->
		  &rarr;    <!-- → (right arrow) -->
		  &uarr;    <!-- ↑ (up arrow) -->
		  &darr;    <!-- ↓ (down arrow) -->
		  
		  <!-- Accented characters -->
		  &aacute;  <!-- á -->
		  &eacute;  <!-- é -->
		  &ntilde;  <!-- ñ -->
		  &uuml;    <!-- ü -->
		  
		  <!-- Example usage -->
		  <p>Price: &euro;50 &times; 2 = &euro;100</p>
		  <p>&copy; 2024 Company Name. All rights reserved&trade;</p>
		  <p>5 &lt; 10 &amp; 10 &gt; 5</p>
		  ```
	-
- # More Learn
	- ## Github & Webs
		- [HTML HEAD - Comprehensive Guide](https://github.com/joshbuchea/HEAD)
		- [HTML5 Boilerplate - Professional Front-end Template](https://github.com/h5bp/html5-boilerplate)
		- [HTML Basics - Learning Resources](https://github.com/learning-zone/html-basics)
		- [HTML5 Interview Questions](https://github.com/Devinterview-io/html5-interview-questions)
		- [MDN Web Docs - HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
		- [W3C HTML Specification](https://html.spec.whatwg.org/)
		- [Can I Use - Browser Compatibility](https://caniuse.com/)
		- [HTML Validator](https://validator.w3.org/)
	-
	- ## Master Playlists YouTube
		- [HTML Full Course - FreeCodeCamp](https://www.youtube.com/watch?v=pQN-pnXPaVg)
		- [HTML & CSS Tutorial - Traversy Media](https://www.youtube.com/watch?v=UB1O30fR-EE)
		- [HTML Crash Course - Programming with Mosh](https://www.youtube.com/watch?v=qz0aGYrrlhU)
		- [HTML5 Semantic Elements - Web Dev Simplified](https://www.youtube.com/watch?v=kGW8Al_cga4)