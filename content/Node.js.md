---
date: 2026-03-26T15:35:09+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Node.js Complete Reference – JavaScript Runtime Guide
description: "Comprehensive Node.js reference covering modules, async/await, streams, HTTP, Express, file system, events, buffers, clusters, and best practices."
keywords: "nodejs, node.js, javascript runtime, npm, async, event loop, streams, http, express, fs, buffers, cluster, CommonJS, ESM, backend, server, nodejs notes, nodejs cheatsheet, nodejs guide, backend javascript, VR-Rathod, Code-Note, code note vr, vr book"
---

- # History
	- **Created by**: Ryan Dahl in 2009.
	- **Why**: Existing servers (Apache) used blocking I/O — one thread per request. Dahl built Node.js on Chrome's V8 engine with a non-blocking, event-driven model.
	- **Key milestone**: npm (Node Package Manager) launched in 2010 — became the world's largest software registry.
	- **Current**: Maintained by the OpenJS Foundation. LTS releases every 2 years.
	- **Versions**: Use LTS (Long Term Support) for production — e.g., Node 20 LTS, Node 22 LTS.
-
- # Introduction
	- **Node.js** is a JavaScript runtime built on Chrome's **V8 engine** — runs JS outside the browser.
	- Uses a **single-threaded, non-blocking, event-driven** architecture.
	- Ideal for: REST APIs, real-time apps (chat, gaming), microservices, CLI tools, streaming.
	- NOT ideal for: CPU-intensive tasks (image processing, ML) — blocks the event loop.
	-
	- ## Advantages
		- Same language (JS) on frontend and backend — full-stack JS.
		- Non-blocking I/O — handles thousands of concurrent connections efficiently.
		- Massive npm ecosystem — 2M+ packages.
		- Fast startup time — great for serverless/edge functions.
		- Active community and wide industry adoption.
	-
	- ## Disadvantages
		- Single-threaded — CPU-heavy tasks block the event loop.
		- Callback hell (mitigated by async/await).
		- npm dependency hell — large `node_modules`, security risks.
		- Weak type safety (use TypeScript to fix this).
		- Error handling can be tricky in async code.
- # Basics
  collapsed:: true
	- ## Hello World & Running Files
	  collapsed:: true
		- ```js
		  // hello.js
		  console.log("Hello, Node.js!");
		  ```
		- ```bash
		  node hello.js
		  # Hello, Node.js!
		  
		  node --version   # check version
		  node             # open REPL (interactive shell)
		  ```
	-
	- ## Global Objects
	  collapsed:: true
		- ```js
		  console.log(__filename);  // absolute path of current file
		  console.log(__dirname);   // absolute path of current directory
		  console.log(process.env); // environment variables
		  console.log(process.argv);// command-line arguments array
		  // process.argv[0] = 'node', process.argv[1] = script path
		  
		  setTimeout(() => console.log("after 1s"), 1000);
		  setInterval(() => console.log("every 2s"), 2000);
		  clearTimeout(id);
		  clearInterval(id);
		  ```
	-
	- ## process Object
	  collapsed:: true
		- ```js
		  process.exit(0);          // exit with success code
		  process.exit(1);          // exit with error code
		  process.env.PORT          // read env variable
		  process.argv              // CLI arguments
		  process.cwd()             // current working directory
		  process.memoryUsage()     // memory stats
		  process.uptime()          // seconds since process started
		  
		  // Handle uncaught errors
		  process.on('uncaughtException', (err) => {
		      console.error('Uncaught:', err);
		      process.exit(1);
		  });
		  
		  process.on('unhandledRejection', (reason) => {
		      console.error('Unhandled rejection:', reason);
		  });
		  ```
- # Modules
  collapsed:: true
	- ## CommonJS (CJS) — Default in Node.js
	  collapsed:: true
		- ```js
		  // math.js — exporting
		  function add(a, b) { return a + b; }
		  function subtract(a, b) { return a - b; }
		  
		  module.exports = { add, subtract };
		  // or export single value:
		  module.exports = add;
		  ```
		- ```js
		  // main.js — importing
		  const { add, subtract } = require('./math');
		  const add = require('./math'); // if single export
		  
		  // Built-in modules
		  const fs   = require('fs');
		  const path = require('path');
		  const http = require('http');
		  const os   = require('os');
		  ```
	-
	- ## ES Modules (ESM) — Modern standard
	  collapsed:: true
		- Enable by: rename file to `.mjs` OR add `"type": "module"` in `package.json`.
		- ```js
		  // math.mjs — exporting
		  export function add(a, b) { return a + b; }
		  export const PI = 3.14159;
		  export default function multiply(a, b) { return a * b; }
		  ```
		- ```js
		  // main.mjs — importing
		  import { add, PI } from './math.mjs';
		  import multiply from './math.mjs';      // default import
		  import * as math from './math.mjs';     // namespace import
		  
		  // Dynamic import (works in both CJS and ESM)
		  const { add } = await import('./math.mjs');
		  ```
	-
	- ## CJS vs ESM
	  collapsed:: true
		- ```
		  Feature           CommonJS (CJS)         ES Modules (ESM)
		  Syntax            require() / exports     import / export
		  Loading           Synchronous             Asynchronous
		  Top-level await   No                      Yes
		  Tree shaking      No                      Yes
		  Default in Node   Yes                     No (opt-in)
		  Browser support   No                      Yes
		  ```
- # npm & package.json
  collapsed:: true
	- ## Essential npm Commands
	  collapsed:: true
		- ```bash
		  npm init              # create package.json interactively
		  npm init -y           # create with all defaults
		  
		  npm install           # install all deps from package.json
		  npm install express   # install and add to dependencies
		  npm install -D nodemon # install as devDependency
		  npm install -g nodemon # install globally
		  
		  npm uninstall express  # remove package
		  npm update             # update all packages
		  npm outdated           # list outdated packages
		  
		  npm run dev            # run script named "dev"
		  npm run build          # run script named "build"
		  npm test               # run test script
		  
		  npm list               # list installed packages
		  npm list --depth=0     # top-level only
		  npx nodemon app.js     # run without global install
		  ```
	-
	- ## package.json Structure
	  collapsed:: true
		- ```json
		  {
		    "name": "my-app",
		    "version": "1.0.0",
		    "description": "My Node.js app",
		    "main": "index.js",
		    "type": "module",
		    "scripts": {
		      "start":   "node index.js",
		      "dev":     "nodemon index.js",
		      "build":   "tsc",
		      "test":    "jest"
		    },
		    "dependencies": {
		      "express": "^4.18.2"
		    },
		    "devDependencies": {
		      "nodemon": "^3.0.1",
		      "jest":    "^29.0.0"
		    },
		    "engines": {
		      "node": ">=18.0.0"
		    }
		  }
		  ```
	-
	- ## .npmrc & .nvmrc
	  collapsed:: true
		- ```bash
		  # .nvmrc — pin Node version for the project
		  20.11.0
		  
		  # use it:
		  nvm use        # reads .nvmrc automatically
		  nvm install    # installs version from .nvmrc
		  ```
- # Async Patterns
  collapsed:: true
	- ## Callbacks (old style)
	  collapsed:: true
		- ```js
		  const fs = require('fs');
		  
		  // Node.js callback convention: (error, result)
		  fs.readFile('file.txt', 'utf8', (err, data) => {
		      if (err) {
		          console.error('Error:', err);
		          return;
		      }
		      console.log(data);
		  });
		  
		  // Callback hell — avoid this
		  fs.readFile('a.txt', 'utf8', (err, a) => {
		      fs.readFile('b.txt', 'utf8', (err, b) => {
		          fs.readFile('c.txt', 'utf8', (err, c) => {
		              // deeply nested — hard to read/maintain
		          });
		      });
		  });
		  ```
	-
	- ## Promises
	  collapsed:: true
		- ```js
		  const fs = require('fs').promises; // promise-based fs
		  
		  fs.readFile('file.txt', 'utf8')
		      .then(data => console.log(data))
		      .catch(err => console.error(err))
		      .finally(() => console.log('done'));
		  
		  // Promise.all — run in parallel, wait for all
		  Promise.all([
		      fs.readFile('a.txt', 'utf8'),
		      fs.readFile('b.txt', 'utf8'),
		      fs.readFile('c.txt', 'utf8'eadFiles() {
		      try {
		          const a = await fs.readFile('a.txt', 'utf8');
		          const b = await fs.readFile('b.txt', 'utf8');
		          console.log(a, b);
		      } catch (err) {
		          console.error('Error:', err.message);
		      }
		  }
		  
		  readFiles();
		  
		  // Parallel with async/await
		  async function readParallel() {
		      const [a, b] = await Promise.all([
		          fs.readFile('a.txt', 'utf8'),
		          fs.readFile('b.txt', 'utf8'),
		      ]);
		      console.log(a, b);
		  }
		  
		  // Top-level await (ESM only)
		  const data = await fs.readFile('file.txt', 'utf8');
		  ```
	-
	- ## util.promisify — Convert callbacks to promises
	  collapsed:: true
		- ```js
		  const { promisify } = require('util');
		  const fs = require('fs');
		  
		  const readFile = promisify(fs.readFile);
		  
		  const data = await readFile('file.txt', 'utf8');
		  console.log(data);
		  ```
- # Event Loop
  collapsed:: true
	- ## How It Works
	  collapsed:: true
		- Node.js runs on a **single thread** but handles concurrency via the event loop.
		- I/O operations (file, network) are offloaded to **libuv** (C++ thread pool).
		- When I/O completes, the callback is queued and the event loop picks it up.
		- ```
		  Event Loop Phases (in order):
		  1. timers          — setTimeout, setInterval callbacks
		  2. pending I/O     — I/O callbacks deferred from previous loop
		  3. idle/prepare    — internal use
		  4. poll            — retrieve new I/O events (blocks here if queue empty)
		  5. check           — setImmediate callbacks
		  6. close callbacks — e.g., socket.on('close')
		  
		  Between each phase:
		  - process.nextTick() queue (runs first — before I/O)
		  - Promise microtask queue (runs after nextTick)
		  ```
	-
	- ## setTimeout vs setImmediate vs process.nextTick
	  collapsed:: true
		- ```js
		  console.log('1 - sync');
		  
		  process.nextTick(() => console.log('2 - nextTick'));
		  
		  Promise.resolve().then(() => console.log('3 - promise'));
		  
		  setImmediate(() => console.log('4 - setImmediate'));
		  
		  setTimeout(() => console.log('5 - setTimeout 0'), 0);
		  
		  console.log('6 - sync');
		  
		  // Output order:
		  // 1 - sync
		  // 6 - sync
		  // 2 - nextTick      ← runs before I/O, before promises
		  // 3 - promise       ← microtask queue
		  // 5 - setTimeout 0  ← timers phase
		  // 4 - setImmediate  ← check phase
		  ```
- # File System (fs)
  collapsed:: true
	- ## Read & Write Files
	  collapsed:: true
		- ```js
		  const fs = require('fs').promises;
		  
		  // Read file
		  const data = await fs.readFile('file.txt', 'utf8');
		  
		  // Write file (overwrites)
		  await fs.writeFile('output.txt', 'Hello World', 'utf8');
		  
		  // Append to file
		  await fs.appendFile('log.txt', 'new line\n', 'utf8');
		  
		  // Delete file
		  await fs.unlink('file.txt');
		  
		  // Copy file
		  await fs.copyFile('src.txt', 'dest.txt');
		  
		  // Rename / Move
		  await fs.rename('old.txt', 'new.txt');
		  
		  // Check if file exists
		  try {
		      await fs.access('file.txt');
		      console.log('exists');
		  } catch {
		      console.log('not found');
		  }
		  ```
	-
	- ## Directories
	  collapsed:: true
		- ```js
		  // Create directory
		  await fs.mkdir('mydir', { recursive: true }); // recursive = no error if exists
		  
		  // Read directory contents
		  const files = await fs.readdir('./src');
		  console.log(files); // ['index.js', 'utils.js', ...]
		  
		  // Read with file types
		  const entries = await fs.readdir('./src', { withFileTypes: true });
		  entries.forEach(e => {
		      console.log(e.name, e.isDirectory() ? 'DIR' : 'FILE');
		  });
		  
		  // Remove directory
		  await fs.rmdir('mydir');                      // must be empty
		  await fs.rm('mydir', { recursive: true });    // remove with contents
		  ```
	-
	- ## path Module
	  collapsed:: true
		- ```js
		  const path = require('path');
		  
		  path.join('/users', 'john', 'file.txt')  // /users/john/file.txt
		  path.resolve('src', 'index.js')          // absolute path
		  path.basename('/users/john/file.txt')    // 'file.txt'
		  path.dirname('/users/john/file.txt')     // '/users/john'
		  path.extname('file.txt')                 // '.txt'
		  path.parse('/users/john/file.txt')
		  // { root: '/', dir: '/users/john', base: 'file.txt',
		  //   ext: '.txt', name: 'file' }
		  
		  // Safe cross-platform paths (use join, not string concat)
		  const filePath = path.join(__dirname, 'data', 'users.json');
		  ```
- # Events (EventEmitter)
  collapsed:: true
	- ## Basic EventEmitter
	  collapsed:: true
		- ```js
		  const { EventEmitter } = require('events');
		  
		  const emitter = new EventEmitter();
		  
		  // Register listener
		  emitter.on('data', (msg) => {
		      console.log('Received:', msg);
		  });
		  
		  // One-time listener
		  emitter.once('connect', () => {
		      console.log('Connected!');
		  });
		  
		  // Emit event
		  emitter.emit('data', 'Hello');   // Received: Hello
		  emitter.emit('connect');         // Connected!
		  emitter.emit('connect');         // (nothing — once only fires once)
		  
		  // Remove listener
		  const handler = (msg) => console.log(msg);
		  emitter.on('msg', handler);
		  emitter.off('msg', handler);     // remove specific listener
		  emitter.removeAllListeners('msg');
		  ```
	-
	- ## Custom EventEmitter Class
	  collapsed:: true
		- ```js
		  const { EventEmitter } = require('events');
		  
		  class Database extends EventEmitter {
		      connect(url) {
		          // simulate async connection
		          setTimeout(() => {
		              this.emit('connected', { url });
		          }, 500);
		      }
		  
		      query(sql) {
		          try {
		              // run query...
		              this.emit('result', { rows: [] });
		          } catch (err) {
		              this.emit('error', err);
		          }
		      }
		  }
		  
		  const db = new Database();
		  db.on('connected', ({ url }) => console.log('Connected to', url));
		  db.on('error', (err) => console.error('DB Error:', err));
		  db.connect('mongodb://localhost:27017');
		  ```
- # Streams
  collapsed:: true
	- ## Stream Types
	  collapsed:: true
		- ```
		  Type          Direction       Example
		  Readable      Read only       fs.createReadStream, http.IncomingMessage
		  Writable      Write only      fs.createWriteStream, http.ServerResponse
		  Duplex        Read + Write    net.Socket
		  Transform     Read+Write+mod  zlib.createGzip, crypto streams
		  ```
	-
	- ## Reading & Writing Streams
	  collapsed:: true
		- ```js
		  const fs = require('fs');
		  
		  // Readable stream
		  const readable = fs.createReadStream('large.txt', { encoding: 'utf8' });
		  
		  readable.on('data', (chunk) => {
		      console.log('Chunk:', chunk.length, 'bytes');
		  });
		  readable.on('end', () => console.log('Done reading'));
		  readable.on('error', (err) => console.error(err));
		  
		  // Writable stream
		  const writable = fs.createWriteStream('output.txt');
		  writable.write('Hello ');
		  writable.write('World\n');
		  writable.end(); // flush and close
		  writable.on('finish', () => console.log('Done writing'));
		  ```
	-
	- ## pipe — Connect streams
	  collapsed:: true
		- ```js
		  const fs = require('fs');
		  const zlib = require('zlib');
		  
		  // Copy file
		  fs.createReadStream('input.txt')
		      .pipe(fs.createWriteStream('output.txt'));
		  
		  // Compress file with gzip
		  fs.createReadStream('file.txt')
		      .pipe(zlib.createGzip())
		      .pipe(fs.createWriteStream('file.txt.gz'));
		  
		  // Decompress
		  fs.createReadStream('file.txt.gz')
		      .pipe(zlib.createGunzip())
		      .pipe(fs.createWriteStream('file.txt'));
		  ```
	-
	- ## stream/promises (Node 16+)
	  collapsed:: true
		- ```js
		  const { pipeline } = require('stream/promises');
		  const fs = require('fs');
		  const zlib = require('zlib');
		  
		  // pipeline handles errors and cleanup automatically
		  await pipeline(
		      fs.createReadStream('input.txt'),
		      zlib.createGzip(),
		      fs.createWriteStream('input.txt.gz')
		  );
		  console.log('Compression complete');
		  ```
- # HTTP Server (built-in)
  collapsed:: true
	- ## Basic HTTP Server
	  collapsed:: true
		- ```js
		  const http = require('http');
		  
		  const server = http.createServer((req, res) => {
		      const { method, url } = req;
		  
		      // Set response headers
		      res.setHeader('Content-Type', 'application/json');
		  
		      if (method === 'GET' && url === '/') {
		          res.writeHead(200);
		          res.end(JSON.stringify({ message: 'Hello World' }));
		      } else if (method === 'GET' && url === '/health') {
		          res.writeHead(200);
		          res.end(JSON.stringify({ status: 'ok' }));
		      } else {
		          res.writeHead(404);
		          res.end(JSON.stringify({ error: 'Not Found' }));
		      }
		  });
		  
		  server.listen(3000, () => {
		      console.log('Server running at http://localhost:3000');
		  });
		  ```
	-
	- ## Reading Request Body
	  collapsed:: true
		- ```js
		  const http = require('http');
		  
		  const server = http.createServer((req, res) => {
		      if (req.method === 'POST') {
		          let body = '';
		  
		          req.on('data', chunk => { body += chunk.toString(); });
		  
		          req.on('end', () => {
		              const data = JSON.parse(body);
		              console.log('Received:', data);
		              res.writeHead(201);
		              res.end(JSON.stringify({ received: data }));
		          });
		      }
		  });
		  
		  server.listen(3000);
		  ```
- # Express.js
  collapsed:: true
	- ## Setup
	  collapsed:: true
		- ```bash
		  npm install express
		  npm install -D @types/express  # if using TypeScript
		  ```
		- ```js
		  const express = require('express');
		  const app = express();
		  
		  app.use(express.json());           // parse JSON bodies
		  app.use(express.urlencoded({ extended: true })); // parse form data
		  
		  app.listen(3000, () => console.log('Server on port 3000'));
		  ```
	-
	- ## Routing
	  collapsed:: true
		- ```js
		  // Basic routes
		  app.get('/',    (req, res) => res.send('Home'));
		  app.post('/users',   (req, res) => res.status(201).json(req.body));
		  app.put('/users/:id', (req, res) => res.json({ id: req.params.id }));
		  app.delete('/users/:id', (req, res) => res.sendStatus(204));
		  
		  // Route params
		  app.get('/users/:id', (req, res) => {
		      const { id } = req.params;   // /users/42 → id = '42'
		      res.json({ userId: id });
		  });
		  
		  // Query strings
		  app.get('/search', (req, res) => {
		      const { q, page = 1 } = req.query; // /search?q=node&page=2
		      res.json({ query: q, page });
		  });
		  
		  // Router — group related routes
		  const router = express.Router();
		  router.get('/',    (req, res) => res.json({ users: [] }));
		  router.post('/',   (req, res) => res.status(201).json(req.body));
		  router.get('/:id', (req, res) => res.json({ id: req.params.id }));
		  
		  app.use('/users', router); // mount at /users
		  ```
	-
	- ## Middleware
	  collapsed:: true
		- ```js
		  // Middleware = function(req, res, next)
		  // Must call next() to pass to the next handler
		  
		  // Application-level middleware
		  app.use((req, res, next) => {
		      console.log(`${req.method} ${req.url} - ${Date.now()}`);
		      next();
		  });
		  
		  // Route-level middleware
		  function authMiddleware(req, res, next) {
		      const token = req.headers.authorization;
		      if (!token) return res.status(401).json({ error: 'Unauthorized' });
		      req.user = { id: 1 }; // attach to request
		      next();
		  }
		  
		  app.get('/profile', authMiddleware, (req, res) => {
		      res.json(req.user);
		  });
		  
		  // Error-handling middleware (4 params — must be last)
		  app.use((err, req, res, next) => {
		      console.error(err.stack);
		      res.status(500).json({ error: err.message });
		  });
		  ```
	-
	- ## Response Methods
	  collapsed:: true
		- ```js
		  res.send('text')              // send string/buffer/object
		  res.json({ key: 'value' })    // send JSON (sets Content-Type)
		  res.status(404).json({})      // set status + send JSON
		  res.sendStatus(204)           // status only, no body
		  res.sendFile('/path/to/file') // send a file
		  res.redirect('/new-url')      // 302 redirect
		  res.redirect(301, '/new-url') // permanent redirect
		  res.setHeader('X-Custom', 'value')
		  res.cookie('token', 'abc', { httpOnly: true, secure: true })
		  res.clearCookie('token')
		  ```
- # Environment Variables
  collapsed:: true
	- ## .env & dotenv
	  collapsed:: true
		- ```bash
		  npm install dotenv
		  ```
		- ```bash
		  # .env file — never commit to git
		  PORT=3000
		  DB_URL=mongodb://localhost:27017/mydb
		  JWT_SECRET=supersecretkey
		  NODE_ENV=development
		  ```
		- ```js
		  require('dotenv').config(); // load .env into process.env
		  // or in ESM:
		  import 'dotenv/config';
		  
		  const port = process.env.PORT || 3000;
		  const dbUrl = process.env.DB_URL;
		  
		  if (!dbUrl) throw new Error('DB_URL is required');
		  ```
	-
	- ## NODE_ENV
	  collapsed:: true
		- ```js
		  const isDev  = process.env.NODE_ENV === 'development';
		  const isProd = process.env.NODE_ENV === 'production';
		  
		  if (isDev) {
		      app.use(morgan('dev')); // verbose logging in dev only
		  }
		  ```
- # Error Handling
  collapsed:: true
	- ## Sync Errors
	  collapsed:: true
		- ```js
		  try {
		      const data = JSON.parse('invalid json');
		  } catch (err) {
		      console.error('Parse error:', err.message);
		  }
		  ```
	-
	- ## Async Errors
	  collapsed:: true
		- ```js
		  // async/await — always use try/catch
		  async function getUser(id) {
		      try {
		          const user = await db.findById(id);
		          if (!user) throw new Error('User not found');
		          return user;
		      } catch (err) {
		          throw err; // re-throw or handle
		      }
		  }
		  
		  // Wrap async route handlers to catch errors
		  const asyncHandler = (fn) => (req, res, next) =>
		      Promise.resolve(fn(req, res, next)).catch(next);
		  
		  app.get('/users/:id', asyncHandler(async (req, res) => {
		      const user = await getUser(req.params.id);
		      res.json(user);
		  }));
		  ```
	-
	- ## Custom Error Classes
	  collapsed:: true
		- ```js
		  class AppError extends Error {
		      constructor(message, statusCode = 500) {
		          super(message);
		          this.statusCode = statusCode;
		          this.name = this.constructor.name;
		          Error.captureStackTrace(this, this.constructor);
		      }
		  }
		  
		  class NotFoundError extends AppError {
		      constructor(resource) {
		          super(`${resource} not found`, 404);
		      }
		  }
		  
		  class ValidationError extends AppError {
		      constructor(message) {
		          super(message, 400);
		      }
		  }
		  
		  // Usage
		  throw new NotFoundError('User');
		  throw new ValidationError('Email is required');
		  
		  // Express error handler
		  app.use((err, req, res, next) => {
		      const status = err.statusCode || 500;
		      res.status(status).json({ error: err.message });
		  });
		  ```
- # Worker Threads & Cluster
  collapsed:: true
	- ## Worker Threads (CPU-intensive tasks)
	  collapsed:: true
		- ```js
		  // main.js
		  const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
		  
		  if (isMainThread) {
		      const worker = new Worker(__filename, {
		          workerData: { num: 40 }
		      });
		  
		      worker.on('message', result => console.log('Result:', result));
		      worker.on('error', err => console.error(err));
		      worker.on('exit', code => console.log('Worker exited:', code));
		  } else {
		      // This runs in the worker thread
		      function fibonacci(n) {
		          if (n <= 1) return n;
		          return fibonacci(n - 1) + fibonacci(n - 2);
		      }
		      parentPort.postMessage(fibonacci(workerData.num));
		  }
		  ```
	-
	- ## Cluster (Multi-core HTTP servers)
	  collapsed:: true
		- ```js
		  const cluster = require('cluster');
		  const http = require('http');
		  const os = require('os');
		  
		  if (cluster.isPrimary) {
		      const numCPUs = os.cpus().length;
		      console.log(`Primary ${process.pid} — forking ${numCPUs} workers`);
		  
		      for (let i = 0; i < numCPUs; i++) {
		          cluster.fork();
		      }
		  
		      cluster.on('exit', (worker, code) => {
		          console.log(`Worker ${worker.process.pid} died — restarting`);
		          cluster.fork(); // auto-restart
		      });
		  } else {
		      http.createServer((req, res) => {
		          res.end(`Worker ${process.pid} handled this`);
		      }).listen(3000);
		  
		      console.log(`Worker ${process.pid} started`);
		  }
		  ```
- # Useful Built-in Modules
  collapsed:: true
	- ## os Module
	  collapsed:: true
		- ```js
		  const os = require('os');
		  
		  os.platform()      // 'linux', 'darwin', 'win32'
		  os.arch()          // 'x64', 'arm64'
		  os.cpus()          // array of CPU info objects
		  os.cpus().length   // number of CPU cores
		  os.totalmem()      // total RAM in bytes
		  os.freemem()       // free RAM in bytes
		  os.homedir()       // '/home/user' or 'C:\Users\user'
		  os.tmpdir()        // temp directory path
		  os.hostname()      // machine hostname
		  os.networkInterfaces() // network interface info
		  ```
	-
	- ## crypto Module
	  collapsed:: true
		- ```js
		  const crypto = require('crypto');
		  
		  // Hash (one-way)
		  const hash = crypto.createHash('sha256')
		      .update('password123')
		      .digest('hex');
		  
		  // HMAC (with secret key)
		  const hmac = crypto.createHmac('sha256', 'secret')
		      .update('data')
		      .digest('hex');
		  
		  // Random bytes (for tokens, salts)
		  const token = crypto.randomBytes(32).toString('hex'); // 64-char hex string
		  const uuid  = crypto.randomUUID(); // 'xxxxxxxx-xxxx-...'
		  
		  // Timing-safe comparison (prevents timing attacks)
		  const safe = crypto.timingSafeEqual(
		      Buffer.from(hash1),
		      Buffer.from(hash2)
		  );
		  ```
	-
	- ## url & querystring
	  collapsed:: true
		- ```js
		  const { URL, URLSearchParams } = require('url');
		  
		  const u = new URL('https://example.com/search?q=node&page=2');
		  u.hostname   // 'example.com'
		  u.pathname   // '/search'
		  u.searchParams.get('q')    // 'node'
		  u.searchParams.get('page') // '2'
		  u.searchParams.set('page', '3');
		  u.toString() // updated URL string
		  
		  // Build query string
		  const params = new URLSearchParams({ q: 'node', page: 1 });
		  params.toString() // 'q=node&page=1'
		  ```
- # Essential npm Packages
  collapsed:: true
	- ```
	  Package          Category         Use
	  express          Framework        HTTP server, routing, middleware
	  fastify          Framework        Faster alternative to Express
	  dotenv           Config           Load .env variables
	  nodemon          Dev tool         Auto-restart on file change
	  morgan           Logging          HTTP request logger middleware
	  winston          Logging          Production-grade logger
	  cors             Middleware       Enable CORS headers
	  helmet           Security         Set secure HTTP headers
	  bcrypt           Security         Hash passwords
	  jsonwebtoken     Auth             Create/verify JWT tokens
	  zod              Validation       Schema validation (TypeScript-first)
	  joi              Validation       Object schema validation
	  mongoose         Database         MongoDB ODM
	  prisma           Database         Type-safe ORM (PostgreSQL, MySQL, SQLite)
	  pg               Database         PostgreSQL client
	  redis            Cache            Redis client
	  axios            HTTP client      Make HTTP requests
	  node-fetch       HTTP client      Fetch API for Node
	  multer           File upload      Handle multipart/form-data
	  sharp            Image           Fast image processing
	  jest             Testing          Unit/integration testing
	  vitest           Testing          Fast Vite-native test runner
	  supertest        Testing          HTTP endpoint testing
	  ```
-
- # Project Structure (Best Practice)
  collapsed:: true
	- ```
	  my-api/
	  ├── src/
	  │   ├── index.js          ← entry point, starts server
	  │   ├── app.js            ← express app setup (no listen)
	  │   ├── routes/
	  │   │   ├── users.js      ← user routes
	  │   │   └── auth.js       ← auth routes
	  │   ├── controllers/
	  │   │   └── userController.js
	  │   ├── services/
	  │   │   └── userService.js  ← business logic
	  │   ├── models/
	  │   │   └── User.js         ← DB schema/model
	  │   ├── middleware/
	  │   │   ├── auth.js
	  │   │   └── errorHandler.js
	  │   └── utils/
	  │       └── logger.js
	  ├── tests/
	  ├── .env
	  ├── .env.example          ← commit this, not .env
	  ├── .gitignore
	  └── package.json
	  ```
-
- # Key Takeaways
	- Node.js = V8 + libuv — non-blocking I/O on a single thread via the event loop.
	- Use **async/await** everywhere — avoid raw callbacks.
	- **Never block the event loop** — offload CPU work to Worker Threads.
	- Use **Cluster** or a process manager (PM2) to use all CPU cores in production.
	- Always validate env variables at startup — fail fast if config is missing.
	- Use **ESM** (`import/export`) for new projects — it's the modern standard.
	- Structure code in layers: routes → controllers → services → models.
-
- # Useful Links
	- Official Docs: https://nodejs.org/en/docs
	- npm Registry: https://www.npmjs.com
	- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices
	- Express Docs: https://expressjs.com
	- Fastify Docs: https://fastify.dev