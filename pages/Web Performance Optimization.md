---
seoTitle: Web Performance Optimization – Fast Data Loading & Page Navigation Guide
description: "Complete guide to web performance optimization covering fast backend-to-frontend data loading, page navigation, caching strategies, lazy loading, code splitting, and modern performance techniques."
keywords: "web performance, optimization, fast loading, data fetching, page navigation, caching, lazy loading, code splitting, CDN, compression, prefetching, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Web Performance Optimization
---

- # History
  collapsed:: true
	- **How**:
		- Web performance optimization evolved with the growth of the internet and user expectations.
		- Early 2000s: Focus on image optimization and minification.
		- 2010s: Introduction of CDNs, HTTP/2, and modern bundlers.
		- 2020s: Core Web Vitals, edge computing, and modern frameworks with built-in optimization.
	-
	- **Who**:
		- **Google** — Introduced Core Web Vitals and PageSpeed Insights.
		- **Cloudflare, Akamai** — Pioneered CDN technology.
		- **Web Performance Working Group** — W3C standards for performance APIs.
	-
	- **Why**:
		- Faster websites improve user experience and engagement.
		- Performance directly impacts SEO rankings and conversion rates.
		- Mobile users demand fast loading on slower networks.
		- Every 100ms delay can reduce conversions by 7%.
-
- # Introduction
  collapsed:: true
	- ## Advantages
		- **Better User Experience** — Fast loading keeps users engaged.
		- **Higher Conversion Rates** — Speed directly correlates with sales and signups.
		- **Improved SEO** — Google ranks faster sites higher.
		- **Reduced Bounce Rate** — Users stay longer on fast sites.
		- **Lower Server Costs** — Efficient data transfer reduces bandwidth usage.
		- **Mobile Performance** — Critical for users on slower networks.
		- **Competitive Advantage** — Faster than competitors = more users.
	-
	- ## Key Metrics
		- **FCP (First Contentful Paint)** — When first content appears (< 1.8s good).
		- **LCP (Largest Contentful Paint)** — When main content loads (< 2.5s good).
		- **FID (First Input Delay)** — Time until page becomes interactive (< 100ms good).
		- **CLS (Cumulative Layout Shift)** — Visual stability (< 0.1 good).
		- **TTFB (Time to First Byte)** — Server response time (< 600ms good).
		- **TTI (Time to Interactive)** — When page is fully interactive (< 3.8s good).
-
- # Fast Backend to Frontend Data Loading
  collapsed:: true
	- ## API Optimization Techniques
		- ```javascript
		  // 1. Use GraphQL for precise data fetching (avoid over-fetching)
		  const query = `
		    query GetUser {
		      user(id: "123") {
		        name
		        email
		        // Only fetch needed fields
		      }
		    }
		  `;
		  
		  // 2. REST API with field selection
		  fetch('/api/users/123?fields=name,email')
		    .then(res => res.json())
		    .then(data => console.log(data));
		  
		  // 3. Pagination for large datasets
		  fetch('/api/posts?page=1&limit=20')
		    .then(res => res.json());
		  
		  // 4. Compression (gzip/brotli) - Server-side
		  // Express.js example
		  const compression = require('compression');
		  app.use(compression());
		  
		  // 5. Response caching headers
		  res.setHeader('Cache-Control', 'public, max-age=3600');
		  res.setHeader('ETag', 'unique-version-id');
		  ```
	-
	- ## Data Fetching Strategies
		- ```javascript
		  // 1. Parallel requests (fetch multiple at once)
		  const [users, posts, comments] = await Promise.all([
		    fetch('/api/users').then(r => r.json()),
		    fetch('/api/posts').then(r => r.json()),
		    fetch('/api/comments').then(r => r.json())
		  ]);
		  
		  // 2. Sequential requests (when data depends on previous)
		  const user = await fetch('/api/user/123').then(r => r.json());
		  const posts = await fetch(`/api/users/${user.id}/posts`).then(r => r.json());
		  
		  // 3. Streaming data (Server-Sent Events)
		  const eventSource = new EventSource('/api/stream');
		  eventSource.onmessage = (event) => {
		    const data = JSON.parse(event.data);
		    updateUI(data);
		  };
		  
		  // 4. WebSocket for real-time data
		  const socket = new WebSocket('wss://api.example.com');
		  socket.onmessage = (event) => {
		    const data = JSON.parse(event.data);
		    updateUI(data);
		  };
		  
		  // 5. Incremental loading (load critical data first)
		  async function loadData() {
		    // Load critical data immediately
		    const critical = await fetch('/api/critical').then(r => r.json());
		    renderCritical(critical);
		    
		    // Load non-critical data after
		    const additional = await fetch('/api/additional').then(r => r.json());
		    renderAdditional(additional);
		  }
		  ```
	-
	- ## Request Optimization
		- ```javascript
		  // 1. Debouncing API calls (search input)
		  function debounce(func, delay) {
		    let timeoutId;
		    return function(...args) {
		      clearTimeout(timeoutId);
		      timeoutId = setTimeout(() => func.apply(this, args), delay);
		    };
		  }
		  
		  const searchAPI = debounce((query) => {
		    fetch(`/api/search?q=${query}`)
		      .then(res => res.json())
		      .then(data => displayResults(data));
		  }, 300);
		  
		  // 2. Request cancellation (AbortController)
		  let controller = new AbortController();
		  
		  function searchWithCancel(query) {
		    // Cancel previous request
		    controller.abort();
		    controller = new AbortController();
		    
		    fetch(`/api/search?q=${query}`, { signal: controller.signal })
		      .then(res => res.json())
		      .then(data => displayResults(data))
		      .catch(err => {
		        if (err.name === 'AbortError') {
		          console.log('Request cancelled');
		        }
		      });
		  }
		  
		  // 3. Request batching (combine multiple requests)
		  class RequestBatcher {
		    constructor(batchFn, delay = 50) {
		      this.batchFn = batchFn;
		      this.delay = delay;
		      this.queue = [];
		      this.timeoutId = null;
		    }
		    
		    add(request) {
		      return new Promise((resolve, reject) => {
		        this.queue.push({ request, resolve, reject });
		        
		        if (!this.timeoutId) {
		          this.timeoutId = setTimeout(() => this.flush(), this.delay);
		        }
		      });
		    }
		    
		    flush() {
		      const batch = this.queue.splice(0);
		      this.timeoutId = null;
		      
		      this.batchFn(batch.map(item => item.request))
		        .then(results => {
		          batch.forEach((item, index) => {
		            item.resolve(results[index]);
		          });
		        })
		        .catch(error => {
		          batch.forEach(item => item.reject(error));
		        });
		    }
		  }
		  
		  // Usage
		  const batcher = new RequestBatcher(async (ids) => {
		    const response = await fetch('/api/users/batch', {
		      method: 'POST',
		      body: JSON.stringify({ ids })
		    });
		    return response.json();
		  });
		  
		  // Multiple calls get batched automatically
		  batcher.add(1).then(user => console.log(user));
		  batcher.add(2).then(user => console.log(user));
		  batcher.add(3).then(user => console.log(user));
		  ```
	-
	- ## Backend Optimization
		- ```javascript
		  // Node.js/Express Backend Optimization
		  
		  // 1. Database query optimization
		  // Bad: N+1 query problem
		  const users = await User.findAll();
		  for (const user of users) {
		    user.posts = await Post.findAll({ where: { userId: user.id } });
		  }
		  
		  // Good: Use joins/includes
		  const users = await User.findAll({
		    include: [{ model: Post }]
		  });
		  
		  // 2. Database indexing
		  // Create index on frequently queried fields
		  // SQL: CREATE INDEX idx_user_email ON users(email);
		  
		  // 3. Response compression
		  const compression = require('compression');
		  app.use(compression({
		    level: 6, // Compression level (0-9)
		    threshold: 1024 // Only compress responses > 1KB
		  }));
		  
		  // 4. Caching with Redis
		  const redis = require('redis');
		  const client = redis.createClient();
		  
		  app.get('/api/users/:id', async (req, res) => {
		    const cacheKey = `user:${req.params.id}`;
		    
		    // Check cache first
		    const cached = await client.get(cacheKey);
		    if (cached) {
		      return res.json(JSON.parse(cached));
		    }
		    
		    // Fetch from database
		    const user = await User.findByPk(req.params.id);
		    
		    // Store in cache (expire after 1 hour)
		    await client.setEx(cacheKey, 3600, JSON.stringify(user));
		    
		    res.json(user);
		  });
		  
		  // 5. Connection pooling
		  const { Pool } = require('pg');
		  const pool = new Pool({
		    max: 20, // Maximum connections
		    idleTimeoutMillis: 30000,
		    connectionTimeoutMillis: 2000
		  });
		  
		  // 6. Rate limiting
		  const rateLimit = require('express-rate-limit');
		  const limiter = rateLimit({
		    windowMs: 15 * 60 * 1000, // 15 minutes
		    max: 100 // Limit each IP to 100 requests per window
		  });
		  app.use('/api/', limiter);
		  
		  // 7. Async processing for heavy tasks
		  const Queue = require('bull');
		  const emailQueue = new Queue('email');
		  
		  app.post('/api/send-email', async (req, res) => {
		    // Add to queue instead of processing immediately
		    await emailQueue.add({ email: req.body.email });
		    res.json({ message: 'Email queued' });
		  });
		  
		  // Process queue in background
		  emailQueue.process(async (job) => {
		    await sendEmail(job.data.email);
		  });
		  
		  // 8. HTTP/2 Server Push
		  const http2 = require('http2');
		  const server = http2.createSecureServer(options);
		  
		  server.on('stream', (stream, headers) => {
		    // Push critical resources
		    stream.pushStream({ ':path': '/styles.css' }, (err, pushStream) => {
		      pushStream.respondWithFile('styles.css');
		    });
		  });
		  ```
	-
	- ## Data Serialization & Transfer
		- ```javascript
		  // 1. Use efficient data formats
		  
		  // JSON (standard, human-readable)
		  const jsonData = JSON.stringify({ name: 'John', age: 30 });
		  // Size: ~25 bytes
		  
		  // MessagePack (binary, smaller)
		  const msgpack = require('msgpack5')();
		  const packed = msgpack.encode({ name: 'John', age: 30 });
		  // Size: ~15 bytes (40% smaller)
		  
		  // Protocol Buffers (fastest, smallest)
		  // Define schema in .proto file, compile, use
		  
		  // 2. Remove unnecessary data
		  // Bad: Send entire object
		  res.json(user); // Includes password hash, internal IDs, etc.
		  
		  // Good: Send only needed fields
		  res.json({
		    id: user.id,
		    name: user.name,
		    email: user.email
		  });
		  
		  // 3. Use ETags for conditional requests
		  const etag = require('etag');
		  
		  app.get('/api/data', (req, res) => {
		    const data = getData();
		    const tag = etag(JSON.stringify(data));
		    
		    if (req.headers['if-none-match'] === tag) {
		      return res.status(304).end(); // Not Modified
		    }
		    
		    res.setHeader('ETag', tag);
		    res.json(data);
		  });
		  ```
	-
- # Fast Page Navigation & Routing
  collapsed:: true
	- ## Client-Side Routing (SPA)
		- ```javascript
		  // React Router - Fast client-side navigation
		  import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
		  
		  function App() {
		    return (
		      <BrowserRouter>
		        <nav>
		          <Link to="/">Home</Link>
		          <Link to="/about">About</Link>
		        </nav>
		        
		        <Routes>
		          <Route path="/" element={<Home />} />
		          <Route path="/about" element={<About />} />
		        </Routes>
		      </BrowserRouter>
		    );
		  }
		  
		  // Vue Router
		  import { createRouter, createWebHistory } from 'vue-router';
		  
		  const router = createRouter({
		    history: createWebHistory(),
		    routes: [
		      { path: '/', component: Home },
		      { path: '/about', component: About }
		    ]
		  });
		  
		  // Vanilla JavaScript SPA Router
		  class Router {
		    constructor(routes) {
		      this.routes = routes;
		      this.init();
		    }
		    
		    init() {
		      // Handle link clicks
		      document.addEventListener('click', (e) => {
		        if (e.target.matches('[data-link]')) {
		          e.preventDefault();
		          this.navigate(e.target.href);
		        }
		      });
		      
		      // Handle back/forward buttons
		      window.addEventListener('popstate', () => {
		        this.loadRoute(window.location.pathname);
		      });
		      
		      // Load initial route
		      this.loadRoute(window.location.pathname);
		    }
		    
		    navigate(url) {
		      history.pushState(null, null, url);
		      this.loadRoute(url);
		    }
		    
		    loadRoute(path) {
		      const route = this.routes[path] || this.routes['/404'];
		      document.getElementById('app').innerHTML = route();
		    }
		  }
		  
		  // Usage
		  const router = new Router({
		    '/': () => '<h1>Home</h1>',
		    '/about': () => '<h1>About</h1>',
		    '/404': () => '<h1>Not Found</h1>'
		  });
		  ```
	-
	- ## Prefetching & Preloading
		- ```html
		  <!-- 1. DNS Prefetch (resolve domain early) -->
		  <link rel="dns-prefetch" href="https://api.example.com">
		  
		  <!-- 2. Preconnect (establish connection early) -->
		  <link rel="preconnect" href="https://cdn.example.com">
		  
		  <!-- 3. Prefetch (load resource for next navigation) -->
		  <link rel="prefetch" href="/next-page.html">
		  <link rel="prefetch" href="/api/data.json">
		  
		  <!-- 4. Preload (load critical resource immediately) -->
		  <link rel="preload" href="/critical.css" as="style">
		  <link rel="preload" href="/hero.jpg" as="image">
		  <link rel="preload" href="/font.woff2" as="font" crossorigin>
		  
		  <!-- 5. Prerender (render entire page in background) -->
		  <link rel="prerender" href="/next-page.html">
		  ```
		- ```javascript
		  // JavaScript prefetching
		  
		  // 1. Prefetch on hover (anticipate navigation)
		  document.querySelectorAll('a').forEach(link => {
		    link.addEventListener('mouseenter', () => {
		      const url = link.href;
		      const prefetchLink = document.createElement('link');
		      prefetchLink.rel = 'prefetch';
		      prefetchLink.href = url;
		      document.head.appendChild(prefetchLink);
		    });
		  });
		  
		  // 2. Intersection Observer prefetching
		  const observer = new IntersectionObserver((entries) => {
		    entries.forEach(entry => {
		      if (entry.isIntersecting) {
		        const link = entry.target;
		        prefetchPage(link.href);
		        observer.unobserve(link);
		      }
		    });
		  });
		  
		  document.querySelectorAll('a[data-prefetch]').forEach(link => {
		    observer.observe(link);
		  });
		  
		  function prefetchPage(url) {
		    fetch(url, { priority: 'low' })
		      .then(res => res.text())
		      .then(html => {
		        // Cache in memory or service worker
		        console.log('Prefetched:', url);
		      });
		  }
		  
		  // 3. Quicklink library (automatic prefetching)
		  import quicklink from 'quicklink';
		  
		  quicklink.listen({
		    timeout: 2000, // Wait 2s after page load
		    priority: true, // Use high priority fetch
		    origins: [location.hostname] // Only prefetch same origin
		  });
		  ```
	-
	- ## Code Splitting & Lazy Loading
		- ```javascript
		  // React lazy loading
		  import React, { lazy, Suspense } from 'react';
		  
		  // Lazy load component
		  const About = lazy(() => import('./pages/About'));
		  const Dashboard = lazy(() => import('./pages/Dashboard'));
		  
		  function App() {
		    return (
		      <Suspense fallback={<div>Loading...</div>}>
		        <Routes>
		          <Route path="/" element={<Home />} />
		          <Route path="/about" element={<About />} />
		          <Route path="/dashboard" element={<Dashboard />} />
		        </Routes>
		      </Suspense>
		    );
		  }
		  
		  // Vue lazy loading
		  const routes = [
		    {
		      path: '/',
		      component: () => import('./views/Home.vue')
		    },
		    {
		      path: '/about',
		      component: () => import('./views/About.vue')
		    }
		  ];
		  
		  // Webpack dynamic imports
		  button.addEventListener('click', async () => {
		    const module = await import('./heavy-module.js');
		    module.doSomething();
		  });
		  
		  // Route-based code splitting (Webpack)
		  const routes = {
		    '/': () => import('./pages/home'),
		    '/about': () => import('./pages/about'),
		    '/contact': () => import('./pages/contact')
		  };
		  
		  async function loadRoute(path) {
		    const module = await routes[path]();
		    renderPage(module.default);
		  }
		  ```
	-
	- ## Page Transition Optimization
		- ```javascript
		  // 1. View Transitions API (Modern browsers)
		  async function navigateWithTransition(url) {
		    if (!document.startViewTransition) {
		      // Fallback for unsupported browsers
		      return navigate(url);
		    }
		    
		    const transition = document.startViewTransition(async () => {
		      await navigate(url);
		    });
		    
		    await transition.finished;
		  }
		  
		  // CSS for view transitions
		  // ::view-transition-old(root) {
		  //   animation: fade-out 0.3s ease-out;
		  // }
		  // ::view-transition-new(root) {
		  //   animation: fade-in 0.3s ease-in;
		  // }
		  
		  // 2. Optimistic UI updates
		  async function updateData(newData) {
		    // Update UI immediately (optimistic)
		    updateUI(newData);
		    
		    try {
		      // Send to server
		      await fetch('/api/update', {
		        method: 'POST',
		        body: JSON.stringify(newData)
		      });
		    } catch (error) {
		      // Revert on error
		      revertUI();
		      showError('Update failed');
		    }
		  }
		  
		  // 3. Skeleton screens (perceived performance)
		  function showSkeleton() {
		    return `
		      <div class="skeleton">
		        <div class="skeleton-line"></div>
		        <div class="skeleton-line"></div>
		        <div class="skeleton-line short"></div>
		      </div>
		    `;
		  }
		  
		  async function loadPage() {
		    // Show skeleton immediately
		    document.getElementById('content').innerHTML = showSkeleton();
		    
		    // Load actual content
		    const data = await fetch('/api/data').then(r => r.json());
		    document.getElementById('content').innerHTML = renderContent(data);
		  }
		  
		  // 4. Progressive enhancement
		  // Start with basic HTML, enhance with JavaScript
		  <a href="/page" class="enhanced-link">
		    Go to page
		  </a>
		  
		  // Enhance with JavaScript
		  document.querySelectorAll('.enhanced-link').forEach(link => {
		    link.addEventListener('click', (e) => {
		      e.preventDefault();
		      navigateWithTransition(link.href);
		    });
		  });
		  ```
	-
	- ## Service Worker Caching
		- ```javascript
		  // service-worker.js
		  const CACHE_NAME = 'v1';
		  const urlsToCache = [
		    '/',
		    '/styles.css',
		    '/script.js',
		    '/logo.png'
		  ];
		  
		  // Install service worker and cache assets
		  self.addEventListener('install', (event) => {
		    event.waitUntil(
		      caches.open(CACHE_NAME)
		        .then(cache => cache.addAll(urlsToCache))
		    );
		  });
		  
		  // Intercept fetch requests
		  self.addEventListener('fetch', (event) => {
		    event.respondWith(
		      caches.match(event.request)
		        .then(response => {
		          // Return cached version or fetch from network
		          return response || fetch(event.request);
		        })
		    );
		  });
		  
		  // Cache-first strategy (for static assets)
		  self.addEventListener('fetch', (event) => {
		    event.respondWith(
		      caches.match(event.request)
		        .then(cached => cached || fetch(event.request))
		    );
		  });
		  
		  // Network-first strategy (for dynamic data)
		  self.addEventListener('fetch', (event) => {
		    event.respondWith(
		      fetch(event.request)
		        .catch(() => caches.match(event.request))
		    );
		  });
		  
		  // Stale-while-revalidate (best of both)
		  self.addEventListener('fetch', (event) => {
		    event.respondWith(
		      caches.open(CACHE_NAME).then(cache => {
		        return cache.match(event.request).then(cached => {
		          const fetchPromise = fetch(event.request).then(response => {
		            cache.put(event.request, response.clone());
		            return response;
		          });
		          return cached || fetchPromise;
		        });
		      })
		    );
		  });
		  
		  // Register service worker
		  if ('serviceWorker' in navigator) {
		    navigator.serviceWorker.register('/service-worker.js')
		      .then(reg => console.log('Service Worker registered'))
		      .catch(err => console.error('Service Worker failed', err));
		  }
		  ```
	-
	- ## Instant Navigation Techniques
		- ```javascript
		  // 1. Turbo/Turbolinks (Hotwire)
		  // Automatically intercepts links and replaces content
		  import Turbo from '@hotwired/turbo';
		  
		  // Links navigate instantly without full page reload
		  <a href="/page">Fast navigation</a>
		  
		  // 2. PJAX (PushState + AJAX)
		  function pjax(url) {
		    fetch(url)
		      .then(res => res.text())
		      .then(html => {
		        const parser = new DOMParser();
		        const doc = parser.parseFromString(html, 'text/html');
		        
		        // Replace content
		        document.getElementById('content').innerHTML = 
		          doc.getElementById('content').innerHTML;
		        
		        // Update URL
		        history.pushState(null, '', url);
		        
		        // Update title
		        document.title = doc.title;
		      });
		  }
		  
		  // 3. Instant.page (automatic prefetching)
		  // Just include the script - it handles everything
		  <script src="//instant.page/5.1.1" type="module"></script>
		  
		  // 4. Custom instant navigation
		  class InstantNav {
		    constructor() {
		      this.cache = new Map();
		      this.init();
		    }
		    
		    init() {
		      // Prefetch on hover
		      document.addEventListener('mouseover', (e) => {
		        if (e.target.tagName === 'A') {
		          this.prefetch(e.target.href);
		        }
		      });
		      
		      // Navigate on click
		      document.addEventListener('click', (e) => {
		        if (e.target.tagName === 'A') {
		          e.preventDefault();
		          this.navigate(e.target.href);
		        }
		      });
		    }
		    
		    async prefetch(url) {
		      if (this.cache.has(url)) return;
		      
		      const response = await fetch(url);
		      const html = await response.text();
		      this.cache.set(url, html);
		    }
		    
		    async navigate(url) {
		      let html = this.cache.get(url);
		      
		      if (!html) {
		        const response = await fetch(url);
		        html = await response.text();
		      }
		      
		      const parser = new DOMParser();
		      const doc = parser.parseFromString(html, 'text/html');
		      
		      // Replace content with fade effect
		      const content = document.getElementById('content');
		      content.style.opacity = '0';
		      
		      setTimeout(() => {
		        content.innerHTML = doc.getElementById('content').innerHTML;
		        content.style.opacity = '1';
		        history.pushState(null, '', url);
		        document.title = doc.title;
		      }, 150);
		    }
		  }
		  
		  new InstantNav();
		  ```
	-
- # Caching Strategies
  collapsed:: true
	- ## Browser Caching
		- ```javascript
		  // Server-side cache headers (Node.js/Express)
		  
		  // 1. Cache static assets for 1 year
		  app.use('/static', express.static('public', {
		    maxAge: '1y',
		    immutable: true
		  }));
		  
		  // 2. Cache-Control headers
		  app.get('/api/data', (req, res) => {
		    // No caching (always fetch fresh)
		    res.setHeader('Cache-Control', 'no-store');
		    
		    // Cache for 5 minutes, revalidate
		    res.setHeader('Cache-Control', 'max-age=300, must-revalidate');
		    
		    // Cache for 1 hour, can serve stale while revalidating
		    res.setHeader('Cache-Control', 'max-age=3600, stale-while-revalidate=86400');
		    
		    // Public cache (CDN can cache)
		    res.setHeader('Cache-Control', 'public, max-age=3600');
		    
		    // Private cache (only browser, not CDN)
		    res.setHeader('Cache-Control', 'private, max-age=3600');
		    
		    res.json(data);
		  });
		  
		  // 3. ETag for conditional requests
		  const etag = require('etag');
		  
		  app.get('/api/data', (req, res) => {
		    const data = getData();
		    const tag = etag(JSON.stringify(data));
		    
		    // Client sends If-None-Match header
		    if (req.headers['if-none-match'] === tag) {
		      return res.status(304).end(); // Not Modified - no data sent
		    }
		    
		    res.setHeader('ETag', tag);
		    res.setHeader('Cache-Control', 'max-age=0, must-revalidate');
		    res.json(data);
		  });
		  
		  // 4. Last-Modified header
		  app.get('/api/data', (req, res) => {
		    const lastModified = new Date('2024-01-01');
		    
		    if (req.headers['if-modified-since']) {
		      const clientDate = new Date(req.headers['if-modified-since']);
		      if (clientDate >= lastModified) {
		        return res.status(304).end();
		      }
		    }
		    
		    res.setHeader('Last-Modified', lastModified.toUTCString());
		    res.json(data);
		  });
		  ```
	-
	- ## Client-Side Caching
		- ```javascript
		  // 1. Memory cache (simple object)
		  const cache = {};
		  
		  async function fetchWithCache(url) {
		    if (cache[url]) {
		      return cache[url];
		    }
		    
		    const response = await fetch(url);
		    const data = await response.json();
		    cache[url] = data;
		    return data;
		  }
		  
		  // 2. LocalStorage cache with expiration
		  class LocalStorageCache {
		    set(key, value, ttl = 3600000) { // Default 1 hour
		      const item = {
		        value: value,
		        expiry: Date.now() + ttl
		      };
		      localStorage.setItem(key, JSON.stringify(item));
		    }
		    
		    get(key) {
		      const itemStr = localStorage.getItem(key);
		      if (!itemStr) return null;
		      
		      const item = JSON.parse(itemStr);
		      if (Date.now() > item.expiry) {
		        localStorage.removeItem(key);
		        return null;
		      }
		      
		      return item.value;
		    }
		    
		    remove(key) {
		      localStorage.removeItem(key);
		    }
		    
		    clear() {
		      localStorage.clear();
		    }
		  }
		  
		  // Usage
		  const cache = new LocalStorageCache();
		  
		  async function fetchData(url) {
		    const cached = cache.get(url);
		    if (cached) return cached;
		    
		    const response = await fetch(url);
		    const data = await response.json();
		    cache.set(url, data, 300000); // Cache for 5 minutes
		    return data;
		  }
		  
		  // 3. IndexedDB cache (for large data)
		  class IndexedDBCache {
		    constructor(dbName = 'cache', storeName = 'data') {
		      this.dbName = dbName;
		      this.storeName = storeName;
		      this.db = null;
		    }
		    
		    async init() {
		      return new Promise((resolve, reject) => {
		        const request = indexedDB.open(this.dbName, 1);
		        
		        request.onerror = () => reject(request.error);
		        request.onsuccess = () => {
		          this.db = request.result;
		          resolve();
		        };
		        
		        request.onupgradeneeded = (event) => {
		          const db = event.target.result;
		          if (!db.objectStoreNames.contains(this.storeName)) {
		            db.createObjectStore(this.storeName);
		          }
		        };
		      });
		    }
		    
		    async set(key, value) {
		      const tx = this.db.transaction(this.storeName, 'readwrite');
		      const store = tx.objectStore(this.storeName);
		      store.put(value, key);
		      return tx.complete;
		    }
		    
		    async get(key) {
		      const tx = this.db.transaction(this.storeName, 'readonly');
		      const store = tx.objectStore(this.storeName);
		      return store.get(key);
		    }
		  }
		  
		  // 4. Cache API (Service Worker)
		  async function cacheFirst(request) {
		    const cache = await caches.open('v1');
		    const cached = await cache.match(request);
		    return cached || fetch(request);
		  }
		  
		  async function networkFirst(request) {
		    try {
		      const response = await fetch(request);
		      const cache = await caches.open('v1');
		      cache.put(request, response.clone());
		      return response;
		    } catch (error) {
		      return caches.match(request);
		    }
		  }
		  ```
	-
	- ## CDN & Edge Caching
		- ```javascript
		  // Cloudflare Workers example (edge caching)
		  addEventListener('fetch', event => {
		    event.respondWith(handleRequest(event.request));
		  });
		  
		  async function handleRequest(request) {
		    const cache = caches.default;
		    
		    // Check cache first
		    let response = await cache.match(request);
		    
		    if (!response) {
		      // Fetch from origin
		      response = await fetch(request);
		      
		      // Cache for 1 hour
		      const headers = new Headers(response.headers);
		      headers.set('Cache-Control', 'public, max-age=3600');
		      
		      response = new Response(response.body, {
		        status: response.status,
		        statusText: response.statusText,
		        headers: headers
		      });
		      
		      // Store in edge cache
		      event.waitUntil(cache.put(request, response.clone()));
		    }
		    
		    return response;
		  }
		  
		  // CDN cache purging
		  // Cloudflare API example
		  async function purgeCache(urls) {
		    const response = await fetch(
		      `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`,
		      {
		        method: 'POST',
		        headers: {
		          'Authorization': `Bearer ${API_TOKEN}`,
		          'Content-Type': 'application/json'
		        },
		        body: JSON.stringify({ files: urls })
		      }
		    );
		    return response.json();
		  }
		  ```
	-
- # Resource Optimization
  collapsed:: true
	- ## Image Optimization
		- ```html
		  <!-- 1. Modern image formats -->
		  <picture>
		    <source srcset="image.avif" type="image/avif">
		    <source srcset="image.webp" type="image/webp">
		    <img src="image.jpg" alt="Fallback">
		  </picture>
		  
		  <!-- 2. Responsive images -->
		  <img 
		    srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
		    sizes="(max-width: 600px) 480px, (max-width: 1000px) 800px, 1200px"
		    src="medium.jpg" 
		    alt="Responsive image">
		  
		  <!-- 3. Lazy loading -->
		  <img src="image.jpg" loading="lazy" alt="Lazy loaded">
		  
		  <!-- 4. Blur placeholder (LQIP - Low Quality Image Placeholder) -->
		  <img 
		    src="tiny-blur.jpg" 
		    data-src="full-image.jpg" 
		    class="lazy-blur"
		    alt="Image">
		  ```
		- ```javascript
		  // Lazy loading with Intersection Observer
		  const imageObserver = new IntersectionObserver((entries) => {
		    entries.forEach(entry => {
		      if (entry.isIntersecting) {
		        const img = entry.target;
		        img.src = img.dataset.src;
		        img.classList.remove('lazy');
		        imageObserver.unobserve(img);
		      }
		    });
		  });
		  
		  document.querySelectorAll('img.lazy').forEach(img => {
		    imageObserver.observe(img);
		  });
		  
		  // Progressive image loading
		  function loadProgressiveImage(img) {
		    const lowSrc = img.dataset.lowsrc;
		    const highSrc = img.dataset.highsrc;
		    
		    // Load low quality first
		    img.src = lowSrc;
		    
		    // Load high quality in background
		    const highImg = new Image();
		    highImg.onload = () => {
		      img.src = highSrc;
		      img.classList.add('loaded');
		    };
		    highImg.src = highSrc;
		  }
		  ```
	-
	- ## JavaScript Optimization
		- ```javascript
		  // 1. Code splitting
		  // Webpack automatically splits at dynamic imports
		  button.addEventListener('click', async () => {
		    const module = await import('./heavy-feature.js');
		    module.init();
		  });
		  
		  // 2. Tree shaking (remove unused code)
		  // Use ES6 imports (not CommonJS require)
		  import { usedFunction } from './utils'; // Only usedFunction is bundled
		  
		  // 3. Minification (production build)
		  // Webpack/Vite automatically minifies in production
		  
		  // 4. Defer/Async script loading
		  // <script src="script.js" defer></script>  // Execute after HTML parsing
		  // <script src="script.js" async></script>  // Execute as soon as loaded
		  
		  // 5. Remove console.logs in production
		  // Webpack config
		  // optimization: {
		  //   minimize: true,
		  //   minimizer: [
		  //     new TerserPlugin({
		  //       terserOptions: {
		  //         compress: {
		  //           drop_console: true
		  //         }
		  //       }
		  //     })
		  //   ]
		  // }
		  
		  // 6. Debounce expensive operations
		  function debounce(func, delay) {
		    let timeoutId;
		    return function(...args) {
		      clearTimeout(timeoutId);
		      timeoutId = setTimeout(() => func.apply(this, args), delay);
		    };
		  }
		  
		  const expensiveOperation = debounce(() => {
		    // Heavy computation
		  }, 300);
		  
		  // 7. Throttle scroll/resize handlers
		  function throttle(func, limit) {
		    let inThrottle;
		    return function(...args) {
		      if (!inThrottle) {
		        func.apply(this, args);
		        inThrottle = true;
		        setTimeout(() => inThrottle = false, limit);
		      }
		    };
		  }
		  
		  window.addEventListener('scroll', throttle(() => {
		    // Handle scroll
		  }, 100));
		  
		  // 8. Web Workers for heavy computation
		  // main.js
		  const worker = new Worker('worker.js');
		  worker.postMessage({ data: largeDataset });
		  worker.onmessage = (e) => {
		    console.log('Result:', e.data);
		  };
		  
		  // worker.js
		  self.onmessage = (e) => {
		    const result = heavyComputation(e.data);
		    self.postMessage(result);
		  };
		  ```
	-
	- ## CSS Optimization
		- ```css
		  /* 1. Critical CSS (inline above-the-fold styles) */
		  /* Extract and inline critical CSS in <head> */
		  
		  /* 2. Remove unused CSS */
		  /* Use PurgeCSS or similar tools */
		  
		  /* 3. Minify CSS */
		  /* Use cssnano or similar */
		  
		  /* 4. Use efficient selectors */
		  /* Good */
		  .button { }
		  
		  /* Bad (slow) */
		  div > ul > li > a { }
		  
		  /* 5. Avoid @import (blocks rendering) */
		  /* Bad */
		  @import url('styles.css');
		  
		  /* Good */
		  /* <link rel="stylesheet" href="styles.css"> */
		  
		  /* 6. Use CSS containment */
		  .component {
		    contain: layout style paint;
		  }
		  
		  /* 7. Use content-visibility for off-screen content */
		  .list-item {
		    content-visibility: auto;
		    contain-intrinsic-size: 0 500px;
		  }
		  ```
	-
	- ## Font Optimization
		- ```html
		  <!-- 1. Preload critical fonts -->
		  <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
		  
		  <!-- 2. Use font-display for better loading -->
		  <style>
		    @font-face {
		      font-family: 'CustomFont';
		      src: url('/fonts/custom.woff2') format('woff2');
		      font-display: swap; /* Show fallback immediately, swap when loaded */
		      /* Options: auto, block, swap, fallback, optional */
		    }
		  </style>
		  
		  <!-- 3. Subset fonts (only include needed characters) -->
		  <!-- Use tools like glyphhanger or fonttools -->
		  
		  <!-- 4. Use variable fonts (one file for all weights) -->
		  <style>
		    @font-face {
		      font-family: 'Inter';
		      src: url('/fonts/inter-variable.woff2') format('woff2');
		      font-weight: 100 900; /* Supports all weights */
		    }
		  </style>
		  ```
	-
	- ## Compression
		- ```javascript
		  // Server-side compression (Node.js/Express)
		  const compression = require('compression');
		  
		  app.use(compression({
		    level: 6, // Compression level (0-9)
		    threshold: 1024, // Only compress > 1KB
		    filter: (req, res) => {
		      // Don't compress images
		      if (req.headers['x-no-compression']) {
		        return false;
		      }
		      return compression.filter(req, res);
		    }
		  }));
		  
		  // Brotli compression (better than gzip)
		  const shrinkRay = require('shrink-ray-current');
		  app.use(shrinkRay());
		  
		  // Static file compression
		  // Pre-compress files at build time
		  // Serve .gz or .br files if available
		  app.get('*.js', (req, res, next) => {
		    if (req.header('Accept-Encoding').includes('br')) {
		      req.url = req.url + '.br';
		      res.set('Content-Encoding', 'br');
		      res.set('Content-Type', 'application/javascript');
		    } else if (req.header('Accept-Encoding').includes('gzip')) {
		      req.url = req.url + '.gz';
		      res.set('Content-Encoding', 'gzip');
		      res.set('Content-Type', 'application/javascript');
		    }
		    next();
		  });
		  ```
	-
