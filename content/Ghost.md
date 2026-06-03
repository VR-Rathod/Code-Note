---
seoTitle: Ghost CMS Reference – Custom Themes, Headless APIs, and Self-Hosting Guide
description: "Comprehensive Ghost developer guide covering self-hosting setup, Knex Bookshelf architecture, Handlebars theme engine, Admin/Content APIs, memberships, and developer cookbooks."
keywords: "Ghost CMS, Node.js publishing, Handlebars templates, Content API, Admin API, members subscriptions, self-hosting, headless blog, VR-Rathod, Code-Note, code note vr, vr book"
comments: true
displayTitle: Ghost Developer Guide
---

> [!info] What is Ghost?
> **Ghost** is a modern, open-source headless CMS and newsletter publishing platform built on Node.js. It features a fast server-side architecture utilizing Express, Knex.js SQL query builders, the Bookshelf ORM, and the **Handlebars templating engine** (for theme layouts). Designed specifically for professional publishing, Ghost integrates built-in email newsletters, Stripe member subscriptions, and dual-purpose headless REST APIs (Content and Admin API) out of the box.

- # History
	- **How**: Ghost was founded in **2013** by **John O'Nolan** (the former deputy lead of the WordPress UI team) after publishing a conceptual blog post detailing what a modern, Node.js-based blogging engine focused purely on writing should look like. The concept went viral, leading John to launch a Kickstarter campaign that raised £196,300 in 29 days. Ghost was built on top of Express and Node.js. In 2018, Ghost introduced the **Members** feature, evolving from a simple blogging script into a newsletter subscription engine.
	- **Who**: Developed by the non-profit **Ghost Foundation** alongside John O'Nolan, Hannah Wolfe (CTO), and a global community of open-source Javascript engineers.
	- **Why**: Ghost was built as a direct reaction to the increasing complexity of WordPress (which evolved from a blog into a general-purpose CMS). John wanted to create a fast, focused publishing tool that used a modern web stack (JavaScript/Node.js) instead of legacy PHP.
-
- # Introduction
  collapsed:: true
	- ## What problem does it solve?
		- Content publishers face a trade-off between complex CMS setups (WordPress, Drupal) and hosted email list managers (Substack, Mailchimp) where they do not own their design, data, or platform. Ghost solves this by offering a fast Node.js publishing framework where developers can build custom themes, edit raw templates, manage subscriptions natively without external plugins, and deploy the entire stack on their own servers or headless architectures.
	-
	- ## Advantages
		- **Blistering Speed**: Built on Node.js and Express, rendering pages and dispatching API queries significantly faster than database-heavy PHP platforms.
		- **Native Newsletter & Memberships**: Built-in newsletter layouts, subscriber databases, and Stripe paid membership gateways.
		- **Theme Simplicity**: Handles custom layouts using Handlebars, a lightweight semantic template engine.
		- **Headless by Design**: Decoupled database architecture exposes read-only Content APIs and read-write Admin APIs instantly.
		- **Rich Markdown/WYSIWYG Editor**: A distraction-free Koenig editor that supports inline markdown shortcuts, HTML cards, and embeds.
	-
	- ## Disadvantages
		- **Limited Extension Ecosystem**: Does not support dynamic PHP plugins (all extensions must be integrated via JSON webhooks, Admin APIs, or custom Zapier integrations).
		- **Specific Hosting Requirements**: Cannot run on basic shared cPanel PHP hosting (requires a Node.js runtime environment, PM2 process manager, and Nginx reverse proxy).
		- **No Native E-commerce**: Focuses purely on media publishing; building an online product store requires custom integrations (e.g. Snipcart or Shopify embeds).
		- **Theme Coding Knowledge**: Modifying theme structures requires editing Handlebars templates (`.hbs` files), which is more technical than visual drag-and-drop builders.
	-
	- ## When to use vs alternatives
		- **Use Ghost When**:
			- Building professional newsletters, blogs, online magazines, or membership directories where subscription management is a core requirement.
			- Headless blogs mapped to Next.js or React frontend setups.
		- **Avoid Ghost When**:
			- Building complex e-commerce portals, custom web applications with complex relational schemas, or corporate sites requiring dozens of custom form pages.
-
- # Installation & Setup (Self-Hosting)
  collapsed:: true
	- For production environments, Ghost requires a Linux server environment running Node.js, MySQL, and Nginx.
	-
	- ## Server Requirements
		- **OS**: Ubuntu 20.04 or 22.04 LTS (Recommended production target).
		- **Web Server**: Nginx (configured as a reverse proxy targeting Node.js on local ports).
		- **Database**: MySQL 8.0.
		- **Node.js**: Node.js 18.x / 20.x LTS.
		- **Process Manager**: Systemd (managed automatically via Ghost CLI).
	-
	- ## Ghost CLI Installation
		- Install the official CLI management tool globally via NPM:
		- ```bash
		  # Install the CLI tool
		  npm install -g ghost-cli@latest
		  ```
	-
	- ## Local Development Setup
		- You can set up a local sqlite-backed sandbox instance on your local machine:
		- ```bash
		  # Create sandbox directory
		  mkdir local-ghost && cd local-ghost
		  
		  # Install local development instance
		  ghost install local
		  
		  # Access admin dashboard at http://localhost:2368/ghost
		  ```
	-
	- ## Production Deployment
		- On your Ubuntu server, run the setup wizard inside the target web folder:
		- ```bash
		  # Create target directory
		  sudo mkdir -p /var/www/ghost
		  sudo chown <username>:<username> /var/www/ghost
		  cd /var/www/ghost
		  
		  # Run production installation
		  # This configures Nginx SSL via Let's Encrypt, MySQL databases, and systemd automatically
		  ghost install
		  ```
	-
	- ## Production Configuration (`config.production.json`)
		- Declares ports, databases, mail delivery, and URL parameters:
		- ```json
		  {
		    "url": "https://www.mypublisher.com",
		    "server": {
		      "port": 2368,
		      "host": "127.0.0.1"
		    },
		    "database": {
		      "client": "mysql",
		      "connection": {
			"host": "127.0.0.1",
			"user": "ghost_db_user",
			"password": "securepassword",
			"database": "ghost_prod"
		      }
		    },
		    "mail": {
		      "transport": "SMTP",
		      "options": {
			"host": "smtp.mailgun.org",
			"port": 587,
			"auth": {
			  "user": "postmaster@mailgun.mypublisher.com",
			  "pass": "mailgunpass"
			}
		      }
		    },
		    "process": "systemd",
		    "paths": {
		      "contentPath": "content/"
		    }
		  }
		  ```
-
- # Core Architecture & Concepts
  collapsed:: true
	- Ghost is built using a modern decoupled architecture.
	-
	- ## Node.js Express & ORM Stack
		- Ghost runs a Node.js server using **Express** for request handling.
		- **Knex.js** handles database query building, while **Bookshelf.js** acts as the ORM, mapping database rows to JavaScript model objects.
	-
	- ## Ghost API Segmentation
		- Ghost divides access into two distinct API groups:
			- **Content API (Read-Only)**: Used to fetch public content (posts, pages, tags, authors). Does not require authentication signatures (public API token).
			- **Admin API (Read-Write)**: Used to perform mutations (create, edit, delete posts, upload images, manage subscribers). Secured via JWT authorizations.
		-
		- ### API Architecture Pipeline
			- ```mermaid
			  graph LR
			      Client[Next.js Frontend] -->|Public API Key| A(Ghost Content API)
			      A -->|Read Only| C[MySQL Database]
			      Server[External Integration] -->|JWT Auth Token| B(Ghost Admin API)
			      B -->|Read/Write CRUD| C
			  ```
	-
	- ## Webhooks Integration
		- Set up webhooks in Ghost Admin (Settings ➔ Integrations ➔ Custom Integration) to alert external servers of events (e.g. `post.published`, `member.added`).
-
- # Ghost Themes & Handlebars Templating
  collapsed:: true
	- Ghost themes use the **Handlebars** templating language to display content templates.
	-
	- ## Custom Theme Directory Structure
		- Place files inside `content/themes/my-custom-theme/`:
		- ```
		  ├── package.json             # Theme metadata, parameters, and dependencies
		  ├── default.hbs              # Master layout template (contains html wrapper)
		  ├── index.hbs                # Homepage post loop layout
		  ├── post.hbs                 # Single blog article page layout
		  ├── page.hbs                 # Static page layout
		  └── partials/                # Reusable markup chunks
		      ├── navigation.hbs       # Menu links mapping
		      └── loop.hbs             # Post preview card design
		  ```
	-
	- ## Theme Declaration (`package.json`)
		- Declares theme configurations and template compatibility parameters:
		- ```json
		  {
		    "name": "developer-reference-theme",
		    "version": "1.0.0",
		    "description": "Minimal, highly performant theme layout.",
		    "engines": {
		      "ghost": ">=5.0.0"
		    },
		    "config": {
		      "posts_per_page": 10,
		      "card_assets": true
		    }
		  }
		  ```
	-
	- ## Master Layout Template (`default.hbs`)
		- Controls standard document tags:
		- ```html
		  <!DOCTYPE html>
		  <html lang="{{@site.locale}}">
		  <head>
		      <meta charset="utf-8" />
		      <title>{{meta_title}}</title>
		      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
		      <!-- Inject core system styles and scripts -->
		      {{ghost_head}}
		  </head>
		  <body class="{{body_class}}">
		      
		      <header id="siteHeader" class="bg-gray-900 text-white p-6">
			  <h2>{{@site.title}}</h2>
			  <!-- Renders partials/navigation.hbs -->
			  {{navigation}}
		      </header>
		  
		      <main id="siteMain" class="container mx-auto py-8 px-4">
			  <!-- Injects child body layout (index.hbs, post.hbs) here -->
			  {{{body}}}
		      </main>
		  
		      <footer class="text-center py-6 border-t mt-8">
			  <p>&copy; {{date format="YYYY"}} {{@site.title}}</p>
		      </footer>
		  
		      <!-- Inject system analytical scripts -->
		      {{ghost_foot}}
		  </body>
		  </html>
		  ```
	-
	- ## Handlebars Post Iterator Loop (`index.hbs`)
		- Loops through blog posts and renders previews:
		- ```html
		  {{!< default}}
		  {# Tells template to load default.hbs master layout #}
		  
		  <div class="posts-grid grid grid-cols-1 md:grid-cols-2 gap-6">
		      {{#foreach posts}}
			  <article class="post-card border rounded p-6 bg-white shadow-sm">
			      {{#if feature_image}}
				  <div class="image-wrapper mb-4">
				      <img src="{{img_url feature_image size="m"}}" alt="{{title}}" class="rounded w-full h-48 object-cover" />
				  </div>
			      {{/if}}
		  
			      <h2 class="text-2xl font-bold mb-2">
				  <a href="{{url}}" class="hover:text-blue-500">{{title}}</a>
			      </h2>
		  
			      <p class="text-sm text-gray-400 mb-4">
				  Published: {{date format="MMMM DD, YYYY"}}
			      </p>
		  
			      <div class="post-excerpt text-gray-600 mb-4">
				  <p>{{excerpt words="30"}}...</p>
			      </div>
		  
			      <a href="{{url}}" class="text-blue-500 font-semibold">Read Article &rarr;</a>
			  </article>
		      {{/foreach}}
		  </div>
		  
		  <!-- Handlebars pagination component -->
		  {{pagination}}
		  ```
-
- # Ghost Content API & Headless Development
  collapsed:: true
	- The Ghost Content API allows fetching public database records over standard REST endpoints.
	-
	- ## Installing Content API JavaScript SDK
		- ```bash
		  npm install @tryghost/content-api
		  ```
	-
	- ## Initializing and Querying Posts
		- Query public content from an external JavaScript application (e.g. Node.js backend or frontend client):
		- ```javascript
		  import GhostContentAPI from '@tryghost/content-api';
		  
		  // Initialize the Content API client
		  const api = new GhostContentAPI({
		    url: 'https://demo.ghost.io',
		    key: '22444f7844e112d4a51e624b5d', // Public API Key generated in Integrations panel
		    version: "v5.0"
		  });
		  
		  /**
		   * Fetches latest 5 posts including tags and authors.
		   */
		  export async function getLatestBlogPosts() {
		    try {
		      const posts = await api.posts.browse({
			limit: 5,
			include: ['tags', 'authors'],
			filter: 'featured:true' // Fetch only featured posts
		      });
		      return posts;
		    } catch (err) {
		      console.error("Content API query failed: " + err.message);
		      return [];
		    }
		  }
		  ```
	-
	- ## Next.js Static Page Generator Example (`pages/index.js`)
		- Fetch posts at build time inside a Next.js frontend framework:
		- ```javascript
		  import { getLatestBlogPosts } from '../lib/ghost-client';
		  
		  export async function getStaticProps() {
		    const posts = await getLatestBlogPosts();
		    
		    return {
		      props: {
			posts: posts.map(post => ({
			  id: post.id,
			  title: post.title,
			  slug: post.slug,
			  excerpt: post.excerpt,
			  image: post.feature_image || null
			}))
		      },
		      revalidate: 300 // Re-cache static outputs every 5 minutes
		    };
		  }
		  
		  export default function Home({ posts }) {
		    return (
		      <div className="container mx-auto p-6">
			<h1 className="text-3xl font-extrabold mb-6">Headless News Feed</h1>
			<div className="grid gap-4">
			  {posts.map(post => (
			    <div key={post.id} className="border p-4 rounded shadow-sm">
			      <h2>{post.title}</h2>
			      <p className="text-gray-600">{post.excerpt}</p>
			    </div>
			  ))}
			</div>
		      </div>
		    );
		  }
		  ```
-
- # Ghost Admin API (Programmatic Writing)
  collapsed:: true
	- The Admin API allows executing programmatic mutations like creating posts, managing members, and uploading images.
	-
	- ## Installing Admin API SDK
		- ```bash
		  npm install @tryghost/admin-api
		  ```
	-
	- ## Token Auth JWT & Writing Posts
		- The Admin API requires signing JWT authentication payloads. The JavaScript SDK handles token generation automatically using your private API key:
		- ```javascript
		  import GhostAdminAPI from '@tryghost/admin-api';
		  
		  // Initialize the Admin API client
		  const adminApi = new GhostAdminAPI({
		    url: 'https://myblog.com',
		    key: '64eed74621c1f4e19034:e0e5a8d4ff92e106c4b69b2d87e0ea9242d5e219fb0a6b7e', // Secure Admin Private Key
		    version: "v5.0"
		  });
		  
		  /**
		   * Programmatically creates and publishes a new post.
		   */
		  export async function createSystemPost(title, contentHtml) {
		    try {
		      const post = await adminApi.posts.add(
			{
			  title: title,
			  html: contentHtml,
			  status: 'published', // Instantly publish the post
			  tags: ['system-alerts'],
			  authors: ['admin@myblog.com']
			},
			{
			  source: 'html' // Tell Ghost to parse the body field as raw HTML
			}
		      );
		      
		      console.log(`Post created successfully. ID: ${post.id}`);
		      return post.id;
		    } catch (error) {
		      console.error("Admin API transaction failed: " + error.message);
		      return null;
		    }
		  }
		  ```
-
- # Memberships & Newsletter Subscription
  collapsed:: true
	- Ghost features a built-in subscription model that works with Stripe out of the box.
	-
	- ## Stripe Portal Configuration
		- Connect your Stripe account in Ghost Admin (Settings ➔ Membership). Once connected, Ghost automatically creates subscription webhook listeners and portal checkout pages.
	-
	- ## Custom Subscription Registration Form (Client JS)
		- Submit registration forms directly to the active newsletter sign-up endpoint:
		- ```html
		  <div class="signup-form">
		      <input type="email" id="subscriberEmail" placeholder="Enter your email" class="border p-2 rounded" />
		      <button id="subscribeBtn" class="bg-blue-500 text-white p-2 rounded">Subscribe Now</button>
		      <p id="message" class="hidden text-green-500 mt-2"></p>
		  </div>
		  
		  <script>
		      document.getElementById('subscribeBtn').addEventListener('click', () => {
			  const email = document.getElementById('subscriberEmail').value;
			  
			  // Submit email to default Ghost Portal registration URL endpoint
			  fetch('/members/api/send-magic-link/', {
			      method: 'POST',
			      headers: { 'Content-Type': 'application/json' },
			      body: JSON.stringify({
				  email: email,
				  emailType: 'signup'
			      })
			  })
			  .then(res => {
			      if (res.ok) {
				  document.getElementById('message').innerText = 'Check your email inbox for a secure login magic link!';
				  document.getElementById('message').classList.remove('hidden');
			      }
			  });
		      });
		  </script>
		  ```
-
- # Performance Optimization
  collapsed:: true
	- Scaling Ghost self-hosted sites to handle traffic spikes.
	-
	- ## Nginx Reverse Caching Configuration
		- Cache public page outputs directly on Nginx edge proxy nodes to prevent requests from loading the Node.js server:
		- ```nginx
		  # Configure cache keys paths
		  fastcgi_cache_path /var/cache/nginx levels=1:2 keys_zone=GHOST_CACHE:100m inactive=60m;
		  
		  server {
		      listen 80;
		      server_name myblog.com;
		      
		      location / {
			  proxy_pass http://127.0.0.1:2368;
			  proxy_set_header Host $host;
			  
			  # Enable caching parameters
			  proxy_cache GHOST_CACHE;
			  proxy_cache_valid 200 10m; # Cache valid status code outputs for 10 minutes
			  proxy_cache_bypass $cookie_ghost_members_id; # Do not cache authenticated logged-in members
		      }
		  }
		  ```
	-
	- ## Image Optimization Settings
		- Ensure `package.json` contains image size presets. Ghost will automatically crop and scale uploaded images to these formats to decrease responsive page sizes:
		- ```json
		  "config": {
		    "image_sizes": {
		      "xxs": { "width": 30 },
		      "xs": { "width": 100 },
		      "s": { "width": 300 },
		      "m": { "width": 600 },
		      "l": { "width": 1000 },
		      "xl": { "width": 2000 }
		    }
		  }
		  ```
-
- # Security & Governance
  collapsed:: true
	- Maintain secure databases and restrict API accesses.
	-
	- ## Cross-Origin Resource Sharing (CORS) Configuration
		- If using Ghost as a headless CMS, restrict which frontend origins can query the Content API:
		- ```json
		  // Configure CORS parameters in config.production.json
		  "cors": {
		    "origin": "https://www.myfrontendapp.com"
		  }
		  ```
	-
	- ## Admin API Key Rotation
		- Compromised keys should be rotated immediately inside the custom integration dashboard settings panel. Rotating keys invalidates all JWT tokens generated using the prior API key signature.
-
- # Testing & Development Workflows
  collapsed:: true
	- Testing themes and API implementations.
	-
	- ## Theme Validation using Gscan
		- Before deploying a custom theme zip file to production, validate it using the official `gscan` validator CLI:
		- ```bash
		  # Install the gscan validation tool globally
		  npm install -g gscan
		  
		  # Run scan over your custom theme folder
		  gscan /path/to/my-custom-theme
		  
		  # Outputs warnings for missing templates, deprecated helper configurations, or syntax errors
		  ```
-
- # Ghost Developer Code Cookbooks
  collapsed:: true
	- Reusable Handlebars, JavaScript, and CSS snippets for Ghost site custom development.
	-
	- ## 1. Reading Progress Bar Indicator
		- Renders an animated progress bar indicating scroll depth on articles:
		- ```html
		  <!-- Add progress bar container in default.hbs -->
		  <div class="scroll-progress-indicator-bar bg-blue-500 fixed top-0 left-0 h-1 z-50" style="width: 0%;"></div>
		  
		  <script>
		      window.addEventListener('scroll', () => {
			  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
			  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
			  const scrolled = (winScroll / height) * 100;
			  document.querySelector('.scroll-progress-indicator-bar').style.width = scrolled + '%';
		      });
		  </script>
		  ```
	-
	- ## 2. Member Access Premium Flag Checker
		- Conditional helper block showing premium content tags inside post templates:
		- ```html
		  <!-- post.hbs layout check -->
		  {{#has visibility="paid"}}
		      <div class="premium-badge bg-yellow-500 text-white text-xs px-2 py-1 rounded inline-block">
			  Premium Access
		      </div>
		  {{/has}}
		  ```
	-
	- ## 3. Stripe Subscription Checkout Button Link
		- Triggers Stripe portal redirection natively using Ghost Portal parameters:
		- ```html
		  <a href="javascript:" data-portal="signup/yearly" class="btn-checkout primary">
		      Upgrade to Pro Plan - $49/yr
		  </a>
		  ```
	-
	- ## 4. Custom Author Profile Grid Loop
		- Renders all authors in a responsive page layout:
		- ```html
		  <div class="authors-grid grid grid-cols-1 md:grid-cols-3 gap-6">
		      {{#foreach authors}}
			  <div class="author-card border p-4 rounded text-center">
			      {{#if profile_image}}
				  <img src="{{img_url profile_image size="s"}}" alt="{{name}}" class="rounded-full w-24 h-24 mx-auto mb-4" />
			      {{/if}}
			      <h3 class="font-bold">{{name}}</h3>
			      <p class="text-sm text-gray-500 mt-2">{{bio}}</p>
			      <a href="{{url}}" class="text-blue-500 text-xs block mt-4">View Articles</a>
			  </div>
		      {{/foreach}}
		  </div>
		  ```
	-
	- ## 5. Custom CSS Styling Override variables
		- Defines color variables inside a stylesheet:
		- ```css
		  :root {
		      --ghost-color-primary: #3b82f6;
		      --ghost-color-bg: #f3f4f6;
		      --ghost-color-text: #111827;
		  }
		  
		  body {
		      background-color: var(--ghost-color-bg);
		      color: var(--ghost-color-text);
		  }
		  ```
	-
	- ## 6. Collection Post Filter by Tag
		- Renders posts with specific tags:
		- ```html
		  {{#get "posts" filter="tags:security" limit="3"}}
		      <ul class="related-posts">
			  {{#foreach posts}}
			      <li><a href="{{url}}">{{title}}</a></li>
			  {{/foreach}}
		      </ul>
		  {{/get}}
		  ```
	-
	- ## 7. JWT Token Generator Script (Node.js)
		- Programmatically signs tokens to authenticate with the Admin API:
		- ```javascript
		  import jwt from 'jsonwebtoken';
		  
		  export function generateAdminJwt(apiKey) {
		    const [id, secret] = apiKey.split(':');
		    
		    return jwt.sign({}, Buffer.from(secret, 'hex'), {
		      keyid: id,
		      algorithm: 'HS256',
		      expiresIn: '5m',
		      audience: `/v5/admin/`
		    });
		  }
		  ```
	-
	- ## 8. Dynamic Image Source Set (srcset) helper
		- Automatically loads optimal image resolutions:
		- ```html
		  <img src="{{img_url feature_image size="m"}}"
		       srcset="{{img_url feature_image size="s"}} 300w,
			       {{img_url feature_image size="m"}} 600w,
			       {{img_url feature_image size="l"}} 1000w"
		       sizes="(max-width: 800px) 100vw, 700px"
		       alt="{{title}}" />
		  ```
	-
	- ## 9. Custom Mailgun Mail Config
		- JSON configuration setup parameters:
		- ```json
		  "mail": {
		    "transport": "SMTP",
		    "options": {
		      "host": "smtp.eu.mailgun.org",
		      "port": 587,
		      "secure": false,
		      "auth": {
			"user": "mailgun_username",
			"pass": "mailgun_password"
		      }
		    }
		  }
		  ```
	-
	- ## 10. Webhook Response Validator Endpoint
		- Checks webhook body parameters:
		- ```javascript
		  export function isGhostWebhookValid(req, secret) {
		    const signature = req.headers['x-ghost-signature'];
		    const hash = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
		    return signature === hash;
		  }
		  ```
	-
	- ## 11. Less Variable Layout Styling definitions
		- Setup configurations:
		- ```less
		  @color-primary: #10b981;
		  @padding-large: 24px;
		  
		  .custom-accent-badge {
		      background-color: @color-primary;
		      padding: @padding-large;
		  }
		  ```
	-
	- ## 12. Conditional Post Excerpt or Full Post Content
		- Shows preview snippet if user is unsubscribed:
		- ```html
		  {{#if access}}
		      <div class="post-content">{{content}}</div>
		  {{or}}
		      <div class="post-snippet bg-gray-50 p-4 border rounded">
			  <p>{{excerpt words="50"}}...</p>
			  <p class="mt-4"><a href="javascript:" data-portal="signup" class="text-blue-500">Sign up to read the rest!</a></p>
		      </div>
		  {{/if}}
		  ```
	-
	- ## 13. Dynamic Category Tag Cloud List
		- Fetches and displays all site tags:
		- ```html
		  {{#get "tags" limit="all" include="count.posts" order="count.posts desc"}}
		      <div class="tag-cloud flex flex-wrap gap-2">
			  {{#foreach tags}}
			      <a href="{{url}}" class="tag-item bg-gray-100 px-3 py-1 rounded text-sm hover:bg-blue-100">
				  {{name}} ({{count.posts}})
			      </a>
			  {{/foreach}}
		      </div>
		  {{/get}}
		  ```
	-
	- ## 14. E-commerce Button Embedding
		- Embeds Snipcart or other custom products:
		- ```html
		  <button class="snipcart-add-item bg-green-500 text-white p-3 rounded"
			  data-item-id="prod-09"
			  data-item-price="29.99"
			  data-item-url="{{url}}"
			  data-item-description="E-book purchase"
			  data-item-name="{{title}}">
		      Buy E-book
		  </button>
		  ```
	-
	- ## 15. System Header Code Injection block
		- Header parameters injection:
		- ```html
		  <!-- Custom styles injected into header -->
		  <style>
		      .post-card { transition: transform 0.2s ease-in-out; }
		      .post-card:hover { transform: translateY(-2px); }
		  </style>
		  ```
	-
	- ## 16. JSON-T Date Formatter Formats
		- Formatting values:
		- ```html
		  <time datetime="{{date format="YYYY-MM-DD"}}">{{date format="MMMM D, YYYY"}}</time>
		  ```
	-
	- ## 17. Scroll-To top button component CSS
		- Style configurations:
		- ```css
		  .scroll-top-indicator {
		      position: fixed;
		      bottom: 30px;
		      right: 30px;
		      background-color: #000000;
		      color: #ffffff;
		      padding: 10px;
		      border-radius: 50%;
		      cursor: pointer;
		  }
		  ```
	-
	- ## 18. Repeater post grid helper layout
		- Alternating style layouts:
		- ```html
		  {{#foreach posts}}
		      <div class="post-item-row {{#if @even}}bg-gray-50{{/if}}">
			  <a href="{{url}}">{{title}}</a>
		      </div>
		  {{/foreach}}
		  ```
	-
	- ## 19. External API Client Proxy (Node.js Express)
		- Securely routes CRM leads payload without exposing authorization keys:
		- ```javascript
		  import express from 'express';
		  import fetch from 'node-fetch';
		  
		  const app = express();
		  app.use(express.json());
		  
		  app.post('/api/sync-lead', async (req, res) => {
		    try {
		      const result = await fetch('https://crm.example.com/api/v1/leads', {
			method: 'POST',
			body: JSON.stringify(req.body),
			headers: { 
			  'Content-Type': 'application/json',
			  'Authorization': `Bearer ${process.env.CRM_API_KEY}`
			}
		      });
		      
		      const data = await result.json();
		      res.status(result.status).json(data);
		    } catch (err) {
		      res.status(500).json({ error: err.message });
		    }
		  });
		  
		  app.listen(3000);
		  ```
	-
	- ## 20. Webhook Signature Verifier (Node.js)
		- Decodes signature hash generated by Ghost to verify payloads:
		- ```javascript
		  import crypto from 'crypto';
		  
		  export function checkSignature(req, webhookSecret) {
		    const signature = req.headers['x-ghost-signature'];
		    const hash = crypto
		      .createHmac('sha256', webhookSecret)
		      .update(JSON.stringify(req.body))
		      .digest('hex');
		    
		    return signature === hash;
		  }
		  ```
	-
	- ## 21. Custom Element Web Component
		- HTML web component bindings for custom rendering:
		- ```javascript
		  class customCard extends HTMLElement {
		    connectedCallback() {
		      this.innerHTML = `
		        <div class="card-custom bg-white p-6 border rounded shadow">
		          <h4 class="font-bold text-lg">Developer Content Node</h4>
		          <p class="text-sm text-gray-500 mt-2">Custom Element sandbox container.</p>
		        </div>
		      `;
		    }
		  }
		  customElements.define('custom-card', customCard);
		  ```
	-
	- ## 22. Dynamic Menu Dropdown Indicator Layout
		- Handlebars loop for nested navigations:
		- ```html
		  <ul class="nav-dropdown-menu">
		    {{#foreach navigation}}
		      <li class="nav-item-dropdown {{#if current}}nav-current{{/if}}">
			  <a href="{{url}}">{{label}}</a>
		      </li>
		    {{/foreach}}
		  </ul>
		  ```
	-
	- ## 23. Direct Members Log-in Redirector
		- Send users to Portal signin:
		- ```javascript
		  $w.onReady(function () {
		    $w('#loginButton').onClick(() => {
		      window.location.href = '/#/portal/signin';
		    });
		  });
		  ```
	-
	- ## 24. Less CSS fluid container layouts
		- Style alignments for index list cards:
		- ```less
		  .grid-layout-newsletter {
		      display: grid;
		      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		      gap: @padding-large;
		      margin-bottom: 2rem;
		  }
		  ```
	-
	- ## 25. Static Site Title Injector Layout
		- Title tag bindings:
		- ```html
		  <title>{{@site.title}} | {{meta_title}}</title>
		  ```
	-
	- ## 26. Custom Newsletter Layout Card
		- Renders newsletter card layouts in Handlebars:
		- ```html
		  <div class="newsletter-card bg-gray-50 p-8 rounded-lg text-center border">
		    <h3 class="text-2xl font-bold">Join the {{@site.title}} Newsletter</h3>
		    <p class="text-gray-600 mt-2 mb-6">Get premium developer reference notes delivered to your inbox.</p>
		    {{#if @member}}
		      <p class="text-green-500 font-semibold">You are already subscribed, thank you!</p>
		    {{else}}
		      <form data-members-form="signup" class="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
			<input data-members-email type="email" placeholder="email@example.com" required class="border p-2 rounded w-full" />
			<button type="submit" class="bg-blue-500 text-white px-6 py-2 rounded font-bold">Subscribe</button>
		      </form>
		    {{/if}}
		  </div>
		  ```
	-
	- ## 27. Tag Taxonomy Index List Loop
		- Renders tags alphabetically with post counts:
		- ```html
		  {{#get "tags" limit="all" include="count.posts" order="name asc"}}
		    <div class="tags-directory grid grid-cols-2 md:grid-cols-4 gap-4">
		      {{#foreach tags}}
			<a href="{{url}}" class="tag-card p-4 border rounded hover:bg-blue-50 transition">
			  <h4 class="font-bold">{{name}}</h4>
			  <span class="text-xs text-gray-500">{{count.posts}} articles</span>
			</a>
		      {{/foreach}}
		    </div>
		  {{/get}}
		  ```
	-
	- ## 28. Client-side Search Implementation via Content API
		- Connects Content API dynamically using simple JS search filter:
		- ```javascript
		  import GhostContentAPI from '@tryghost/content-api';
		  
		  const api = new GhostContentAPI({
		    url: 'https://demo.ghost.io',
		    key: '22444f7844e112d4a51e624b5d',
		    version: 'v5.0'
		  });
		  
		  const searchInput = document.getElementById('searchQuery');
		  searchInput.addEventListener('input', (e) => {
		    const val = e.target.value;
		    if (val.length < 3) return;
		    
		    api.posts.browse({
		      limit: 'all',
		      filter: `title:~'${val}'` // Search posts containing value
		    })
		    .then(posts => {
		      renderSearchResults(posts);
		    });
		  });
		  
		  function renderSearchResults(posts) {
		    // Render search results markup...
		  }
		  ```
	-
	- ## 29. Next/Prev Pagination Buttons Handlers
		- Handlebars conditional bindings inside templates:
		- ```html
		  <nav class="pagination-nav flex justify-between mt-8 border-t pt-4">
		    {{#if prev}}
		      <a href="{{page_url prev}}" class="prev-btn text-blue-500">&larr; Newer Posts</a>
		    {{/if}}
		    <span class="page-number">Page {{page}} of {{pages}}</span>
		    {{#if next}}
		      <a href="{{page_url next}}" class="next-btn text-blue-500">Older Posts &rarr;</a>
		    {{/if}}
		  </nav>
		  ```
	-
	- ## 30. Secure Member Portal Gateway Middleware (Node.js Express)
		- Middleware to verify active member tokens:
		- ```javascript
		  export function requirePremiumMember(req, res, next) {
		    const memberToken = req.cookies['ghost-members-id'];
		    
		    if (!memberToken) {
		      return res.status(403).json({ error: 'Access restricted to paid premium members only' });
		    }
		    
		    // Token verification logic against Ghost Database...
		    next();
		  }
		  ```
	-
	- ## 31. Gulp Compilation Script (`gulpfile.js`)
		- Build pipeline to compile Sass and zip themes:
		- ```javascript
		  const gulp = require('gulp');
		  const sass = require('gulp-sass')(require('sass'));
		  const zip = require('gulp-zip');
		  
		  gulp.task('css', () => {
		    return gulp.src('./assets/scss/screen.scss')
		      .pipe(sass({ outputStyle: 'compressed' }))
		      .pipe(gulp.dest('./assets/built'));
		  });
		  
		  gulp.task('zip', () => {
		    return gulp.src(['**', '!node_modules/**', '!dist/**'])
		      .pipe(zip('my-theme.zip'))
		      .pipe(gulp.dest('./dist'));
		  });
		  
		  gulp.task('default', gulp.series('css', 'zip'));
		  ```
	-
	- ## 32. Custom Error Layout Page (`error-404.hbs`)
		- Handlebars template for 404 page overrides:
		- ```html
		  {{!< default}}
		  
		  <div class="error-wrapper text-center py-20 bg-gray-50 border rounded-lg max-w-xl mx-auto my-12">
		    <h1 class="text-6xl font-extrabold text-red-500">404</h1>
		    <h2 class="text-2xl font-bold mt-4">Page Not Found</h2>
		    <p class="text-gray-600 mt-2">The requested guide or code note does not exist on this server.</p>
		    <a href="{{@site.url}}" class="btn bg-blue-500 text-white px-6 py-2 rounded inline-block mt-8">Return Home</a>
		  </div>
		  ```
	-
	- ## 33. Author Details Social Links Loop
		- Renders social profiles for post authors:
		- ```html
		  {{#primary_author}}
		    <div class="author-socials flex gap-4 mt-4">
		      {{#if facebook}}
			<a href="{{facebook_url}}" target="_blank" class="social-icon">Facebook</a>
		      {{/if}}
		      {{#if twitter}}
			<a href="{{twitter_url}}" target="_blank" class="social-icon">Twitter</a>
		      {{/if}}
		    </div>
		  {{/primary_author}}
		  ```
	-
	- ## 34. Less CSS Typography Variables Setup
		- Maps standard theme fonts:
		- ```less
		  @font-family-sans: 'Inter', system-ui, -apple-system, sans-serif;
		  @line-height-base: 1.625;
		  
		  body {
		      font-family: @font-family-sans;
		      line-height: @line-height-base;
		  }
		  ```
	-
	- ## 35. Webpack Local Config Compilation Rules
		- Standard Webpack config to compile theme JavaScript assets:
		- ```javascript
		  const path = require('path');
		  
		  module.exports = {
		    entry: './assets/js/index.js',
		    output: {
		      filename: 'index.built.js',
		      path: path.resolve(__dirname, 'assets/built')
		    },
		    mode: 'production'
		  };
		  ```
	-
	- ## 36. Dynamic Category Dropdown Selector (JavaScript Client)
		- Renders category listings dynamically inside select tags:
		- ```javascript
		  document.addEventListener('DOMContentLoaded', () => {
		    const selectEl = document.getElementById('categorySelector');
		    if (selectEl) {
		      selectEl.addEventListener('change', (e) => {
			const tagSlug = e.target.value;
			window.location.href = `/tag/${tagSlug}`;
		      });
		    }
		  });
		  ```
	-
	- ## 37. Local Environment CLI config helper
		- Configure development port parameters via Ghost-CLI commands:
		- ```bash
		  # Set local dev port dynamically
		  ghost config port 2369
		  
		  # Restart local instance to apply changes
		  ghost restart
		  ```
-
- # More Learn
	- ## Developer Documentation & Reference Manuals
		- [Ghost Developer Platform Portal Docs](https://ghost.org/docs/)
		- [Ghost Handlebars Theme Templating Engine Guides](https://ghost.org/docs/themes/)
		- [Ghost-CLI CLI management commands reference](https://ghost.org/docs/ghost-cli/)
		- [Ghost Headless Content API documentation](https://ghost.org/docs/content-api/)
		- [Ghost Admin API CRUD operations reference](https://ghost.org/docs/admin-api/)
		- [Stripe payment gateway integration reference](https://ghost.org/docs/members/)
		- [Ghost GitHub Source Code Repository](https://github.com/TryGhost/Ghost)