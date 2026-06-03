---
seoTitle: Wix Velo & Studio Complete Guide – Architecture, Code, and Custom APIs
description: "Comprehensive Wix developer reference covering drag-and-drop design, Wix Velo (JavaScript on client/server), Wix Data, custom API routing, headless integrations, e-commerce custom SPIs, and performance optimization."
keywords: "Wix, website builder, Wix Velo, JavaScript API, e-commerce, SEO, Wix Studio, dynamic website, Wix CMS, headless Wix, VR-Rathod, Code-Note, code note vr, vr book"
comments: true
displayTitle: Wix Developer Guide
---

> [!info] What is Wix?
> **Wix** is a cloud-based development platform that combines visual drag-and-drop website design (via editors like Wix Editor and Wix Studio) with a full-stack, serverless JavaScript runtime environment called **Velo by Wix**. Velo exposes unified client-side UI selector APIs (`$w`), automatic serverless Node.js backend integrations, dynamic page routers, and high-performance cloud databases, making it an agile framework for developing complex web applications without managing servers or host infrastructures.

- # History
	- **How**: Wix was founded in **2006** by **Avishai Abrahami**, **Nadav Abrahami**, and **Gidi Torbey** in Tel Aviv, Israel. It initially focused on Flash-based web builders. Recognizing Flash's deprecation, Wix completely rebuilt its core engine in 2012 using HTML5. To bridge the gap between simple visual design and complex software engineering, Wix launched **Wix Code** in 2017, later rebranded as **Corvid** in 2019, and renamed **Velo** in 2020.
	- **Who**: Developed and managed by **Wix.com Ltd.** alongside a global ecosystem of agency partners, enterprise developers, and designers.
	- **Why**: Wix was built to solve the development friction of hosting, database provisioning, and server setups for standard web platforms. With Velo and Wix Studio, it allows developers to write code only where custom logic is required, while leaving layout structures and animations to responsive visual editors.
-
- # Introduction
  collapsed:: true
	- ## What problem does it solve?
		- Traditional development requires maintaining database clusters, routing engines, API endpoints, SSL certifications, and CDN caches. Wix Velo abstracts these infrastructure layers, providing a serverless full-stack workspace where databases, client selectors, and backend Web Modules are automatically connected.
	-
	- ## Advantages
		- **Serverless Backend**: Write server-side JavaScript in Web Modules (`.jsw` files) that run on Node.js without establishing custom API request/response pathways.
		- **Integrated Cloud Database**: Create schema-less collections in Wix Data with automated data hook overrides (before/after inserts, updates, deletes).
		- **Visual Interface Declarations**: UI elements are configured visually in the editor, and instantly selected in client-side code using the `$w` jQuery-style selector.
		- **Built-in Security**: OAuth2, secure secret storage keys, and database roles are managed directly through the Wix dashboard.
		- **Modern Web Developer Workspace**: Integrates with local development via Wix CLI, a browser-based VS Code IDE (Wix IDE), Git branching, and Site Monitoring dashboards.
	-
	- ## Disadvantages
		- **Proprietary Framework Lock-In**: Code written for Wix cannot be exported to run on other hosting backends (e.g., AWS, Vercel, Heroku).
		- **Performance Bounds**: Cold starts on serverless backend functions can introduce latency for first-time visits.
		- **Limited Database Control**: No direct access to run raw SQL tuning queries or change lower-level database configuration flags (Wix manages the database scaling).
		- **API Limitations**: Some core components are black-boxed; developers must work within the parameters of the Wix JS SDK.
	-
	- ## When to use vs alternatives
		- **Use Wix When**:
			- Building dynamic directory sites, booking platforms, custom storefronts, or corporate portals requiring rapid development.
			- Projects where client editors need visual access to modify layouts and content via a CMS without developer intervention.
		- **Avoid Wix When**:
			- Building high-frequency trading apps, large multiplayer games, or platforms requiring lower-level kernel access, custom WebSockets servers, or raw database optimization.
-
- # Installation & Setup
  collapsed:: true
	- To unlock full-stack programming capabilities in Wix, developers must enable **Developer Mode** or utilize the **Wix Studio** workspace.
	-
	- ## Enabling Velo Developer Mode
		- 1. Open your website inside the **Wix Editor**.
		- 2. Locate the top navigation menu bar.
		- 3. Click on **Dev Mode** in the dropdown.
		- 4. Click **Turn on Dev Mode**.
		- 5. A code panel will slide up from the bottom, and the sidebar will update to show page files, databases (Collections), and backend directories.
	-
	- ## Setting Up Wix Studio Workspace
		- Wix Studio is the advanced responsive editing suite. In Studio, the developer workspace includes the **Wix IDE** (a browser version of VS Code) and the ability to connect to local development tools.
	-
	- ## Local Developer CLI Tooling
		- Developers can write code locally in their preferred IDE (like VS Code) and sync changes to Wix using the Wix CLI:
		- ```bash
		  # Install the Wix CLI globally on your system
		  npm install -g @wix/cli
		  
		  # Authenticate the CLI with your Wix developer account
		  wix login
		  
		  # Initialize and pull your site's codebase locally
		  wix init --site-id <your-site-id>
		  
		  # Start the local development server to sync code live as you write
		  wix dev
		  ```
	-
	- ## Code Repository File Layout
		- ```
		  ├── src/
		  │   ├── public/              # Client-side JavaScript files accessible globally
		  │   ├── backend/             # Server-side JavaScript files, HTTP endpoints, and Web Modules
		  │   │   ├── http-functions.js# Custom REST API endpoints
		  │   │   ├── data.js          # Database hooks (beforeInsert, afterUpdate, etc.)
		  │   │   ├── routers.js       # Dynamic routing hooks
		  │   │   └── jobs.config      # Scheduled cron job configurations
		  │   ├── pages/               # Page-specific client scripts
		  │   │   ├── Home.js          # JavaScript running on the homepage
		  │   │   └── masterPage.js    # Global JavaScript running across all pages
		  │   └── assets/              # Theme static assets
		  ├── package.json             # NPM package declarations
		  └── wix.config.json          # Wix site parameters configurations
		  ```
-
- # Core Concepts
  collapsed:: true
	- Wix development revolves around selecting UI elements, handling page events, querying data collections, and communicating with serverless backend APIs.
	-
	- ## Front-end Selector API (`$w`)
		- The `$w` selector is a jQuery-like selection engine used to interact with page visual elements.
		- Elements are selected by their ID (e.g. `#submitButton`) prefixed with `#`.
		-
		- ### Selector Syntax Examples
			- ```javascript
			  // Hide an alert text box on page load
			  $w('#alertText').hide();
			  
			  // Change the text content of a header label
			  $w('#headerLabel').text = 'Welcome to the Velo Dashboard';
			  
			  // Enable a disabled submit button
			  $w('#submitButton').enable();
			  
			  // Change the source URL of an image placeholder
			  $w('#profileImage').src = 'https://images.example.com/user12.jpg';
			  ```
	-
	- ## The Page Lifecycle
		- Wix separates page loading states to support Server-Side Rendering (SSR) for SEO bots and Client-Side Rendering (CSR) for interactive users.
		-
		- ### `$w.onReady()` Hook
			- This function executes automatically as soon as the page structure is fully loaded inside the client browser. All UI selectors must be placed inside this block.
			- ```javascript
			  import wixWindow from 'wix-window';
			  
			  $w.onReady(function () {
			    // This code runs only when the page DOM is ready.
			    console.log("DOM loaded. Init elements.");
			    
			    // Optimize execution: Skip expensive visual calculations during SSR phase
			    if (wixWindow.rendering.env === 'backend') {
			      // Code here executes only on Wix servers during SSR page prep
			      $w('#interactiveChart').hide();
			    } else {
			      // Code here executes only in the user's browser
			      $w('#interactiveChart').show();
			      initUserInteractions();
			    }
			  });
			  
			  function initUserInteractions() {
			    $w('#actionButton').onClick(() => {
			      $w('#statusText').text = "Button clicked in browser!";
			    });
			  }
			  ```
	-
	- ## Wix Data CMS & Databases
		- Wix features built-in NoSQL document databases called **Collections**.
		- Collections can store text, rich content, images, reference fields, and geo-locations.
		- Mapped fields have:
			- **Field Name**: The user-facing label (e.g. `First Name`).
			- **Field Key**: The database identifier used in code queries (e.g. `firstName`).
	-
	- ## Wix Datasets
		- Datasets are intermediate, invisible connector elements added to pages via the visual editor.
		- They act as a bridge, binding page elements (e.g. inputs, tables, repeaters) directly to a database collection without writing manual query code.
		- They support Read-Only, Write-Only, and Read-Write dataset configurations.
	-
	- ## Repeaters & Scoped Selection
		- A **Repeater** is a dynamic list layout element. It duplicates its design template for every item inside an array.
		- When writing code inside repeater events (like clicking a button in a list item), you must scope the selection to the current item row.
		-
		- ### Repeater Selection Code Pattern
			- ```javascript
			  $w.onReady(function () {
			    // Bind data to the repeater
			    const listData = [
			      { _id: '1', title: 'Product Alpha', price: '$9.99' },
			      { _id: '2', title: 'Product Beta', price: '$14.99' },
			      { _id: '3', title: 'Product Gamma', price: '$24.99' }
			    ];
			    
			    $w('#productRepeater').data = listData;
			    
			    // 1. onItemReady handles layout formatting for each item
			    $w('#productRepeater').onItemReady(($item, itemData, index) => {
			      // Note: Use '$item' instead of '$w' to select elements inside the current repeater item row.
			      $item('#itemTitle').text = itemData.title;
			      $item('#itemPrice').text = itemData.price;
			      
			      // 2. Event handler scoped to this item
			      $item('#buyButton').onClick((event) => {
			        // Scopes selector to target exactly which button was clicked
			        const clickedItemId = itemData._id;
			        console.log(`User clicked Buy for item ID: ${clickedItemId}`);
			        addToCart(clickedItemId);
			      });
			    });
			  });
			  
			  function addToCart(id) {
			    $w('#cartStatusText').text = `Item ${id} added to cart.`;
			  }
			  ```
-
- # Common Patterns & Examples
  collapsed:: true
	- Below are production-ready code examples covering the most common developer tasks in Velo.
	-
	- ## Dynamic Database Filtering & Text Search
		- Querying a database collection and rendering results inside a repeater based on a user's input:
		- ```javascript
		  import wixData from 'wix-data';
		  
		  $w.onReady(function () {
		    // Listen to changes in the filter dropdown
		    $w('#categoryDropdown').onChange(() => {
		      filterData();
		    });
		    
		    // Listen to keystrokes in the search input box (with debounce)
		    let debounceTimer;
		    $w('#searchInput').onInput(() => {
		      clearTimeout(debounceTimer);
		      debounceTimer = setTimeout(() => {
		        filterData();
		      }, 400); // Wait 400ms after user stops typing
		    });
		  });
		  
		  function filterData() {
		    const searchVal = $w('#searchInput').value;
		    const categoryVal = $w('#categoryDropdown').value;
		    
		    // Create a base query object
		    let query = wixData.query('ArticlesCollection');
		    
		    if (searchVal) {
		      // Use 'contains' for fuzzy string matching
		      query = query.contains('title', searchVal);
		    }
		    
		    if (categoryVal && categoryVal !== 'all') {
		      // Filter query by matching category field reference key
		      query = query.eq('category', categoryVal);
		    }
		    
		    query.descending('_createdDate')
		      .limit(20)
		      .find()
		      .then(results => {
		        if (results.items.length > 0) {
		          $w('#resultsRepeater').data = results.items;
		          $w('#noResultsText').hide();
		        } else {
		          $w('#resultsRepeater').data = [];
		          $w('#noResultsText').show();
		        }
		      })
		      .catch(err => {
		        console.error("Database query failed: " + err.message);
		      });
		  }
		  ```
	-
	- ## Custom Form Submission & Data Verification
		- Validating inputs programmatically before executing a database insert:
		- ```javascript
		  import wixData from 'wix-data';
		  
		  $w.onReady(function () {
		    $w('#submitButton').onClick(() => {
		      validateAndSubmit();
		    });
		  });
		  
		  function validateAndSubmit() {
		    const email = $w('#emailInput').value;
		    const phone = $w('#phoneInput').value;
		    const name = $w('#nameInput').value;
		    
		    // Clear past error indicators
		    $w('#errorText').hide();
		    
		    // Simple email regex validation
		    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		    if (!emailRegex.test(email)) {
		      showError('Please enter a valid email address.');
		      return;
		    }
		    
		    if (!phone || phone.length < 10) {
		      showError('Please enter a valid phone number (min 10 digits).');
		      return;
		    }
		    
		    if (!name || name.trim() === '') {
		      showError('Name cannot be left blank.');
		      return;
		    }
		    
		    // Disable button to prevent double form submission
		    $w('#submitButton').disable();
		    $w('#submitButton').label = 'Submitting...';
		    
		    const submissionData = {
		      fullName: name,
		      emailAddress: email,
		      phoneNumber: phone,
		      status: 'pending'
		    };
		    
		    // Insert directly into database collection
		    wixData.insert('LeadsCollection', submissionData)
		      .then(() => {
		        $w('#formWrapper').hide();
		        $w('#successMessage').show();
		      })
		      .catch(err => {
		        showError('System error saving data: ' + err.message);
		        $w('#submitButton').enable();
		        $w('#submitButton').label = 'Submit';
		      });
		  }
		  
		  function showError(msg) {
		    $w('#errorText').text = msg;
		    $w('#errorText').show();
		  }
		  ```
	-
	- ## Database Hooks (Collection Rules in Backend)
		- Data hooks execute code automatically on Wix servers before or after mutations occur in a collection.
		- Data hooks must be defined in the `backend/data.js` file.
		- ```javascript
		  // backend/data.js
		  
		  /**
		   * Triggers automatically before a new entry is saved to 'ArticlesCollection'.
		   * Forces the slug field value to be alphanumeric lowercase.
		   */
		  export function ArticlesCollection_beforeInsert(item, context) {
		    if (item.title) {
		      // Generate slug from title: "Hello World!" -> "hello-world"
		      item.slug = item.title
		        .toLowerCase()
		        .replace(/[^a-z0-9\s-]/g, '')
		        .replace(/\s+/g, '-');
		    }
		    
		    // Automatically record user id who initiated transaction
		    if (context.userId) {
		      item.authorId = context.userId;
		    }
		    
		    // You must return the modified item object
		    return item;
		  }
		  
		  /**
		   * Triggers automatically before updating an item.
		   * Records the update timestamp.
		   */
		  export function ArticlesCollection_beforeUpdate(item, context) {
		    item.lastModified = new Date();
		    return item;
		  }
		  ```
-
- # Advanced Usage
  collapsed:: true
	- Complex Wix configurations require writing backend Web Modules, REST endpoints, Routers, and custom SPI integrations.
	-
	- ## Web Modules (`.jsw` Backend Files)
		- Web Modules are JavaScript files created in the `backend/` folder. They run in a secure server-side Node.js environment.
		- Velo dynamically generates an RPC protocol mapping backend functions to frontend events. You can import backend functions directly into your frontend code like local modules.
		-
		- ### Server Code (`backend/paymentService.jsw`)
			- ```javascript
			  import { getSecret } from 'wix-secrets-backend';
			  import wixFetch from 'wix-fetch';
			  
			  /**
			   * Initiates payment gateway token securely on the server-side.
			   * Prevents API key exposure to the client browser.
			   */
			  export async function getGatewayToken(amount) {
			    try {
			      // Securely pull API private key from Wix Secrets manager
			      const apiKey = await getSecret('PAYMENT_GATEWAY_API_KEY');
			      
			      const response = await wixFetch.fetch('https://api.paymentgateway.com/v1/tokens', {
			        method: 'POST',
			        headers: {
			          'Authorization': `Bearer ${apiKey}`,
			          'Content-Type': 'application/json'
			        },
			        body: JSON.stringify({ amount: amount, currency: 'USD' })
			      });
			      
			      if (!response.ok) {
			        throw new Error('Failed to fetch token from gateway API');
			      }
			      
			      const data = await response.json();
			      return { success: true, token: data.payment_token };
			    } catch (error) {
			      return { success: false, error: error.message };
			    }
			  }
			  ```
		-
		- ### Client Code (`pages/Checkout.js`)
			- ```javascript
			  // Import the backend service function as a standard JS module
			  import { getGatewayToken } from 'backend/paymentService.jsw';
			  
			  $w.onReady(function () {
			    $w('#payButton').onClick(() => {
			      const cartAmount = 49.99;
			      
			      // Run backend serverless function asynchronously
			      getGatewayToken(cartAmount)
			        .then(result => {
			          if (result.success) {
			            console.log("Token received safely on client: " + result.token);
			            openCheckoutWindow(result.token);
			          } else {
			            $w('#checkoutError').text = "Payment Token Error: " + result.error;
			            $w('#checkoutError').show();
			          }
			        });
			    });
			  });
			  
			  function openCheckoutWindow(token) {
			    // Render payment window modal
			  }
			  ```
	-
	- ## HTTP Functions (`backend/http-functions.js`)
		- Wix can expose custom API endpoints on the domain, enabling external systems (Webhooks, databases, CRMs) to fetch data.
		- Endpoint files must be named `http-functions.js` in the `backend/` folder.
		-
		- ### API Routes Layout
			- Endpoints follow the format: `https://<your-domain>/_functions/<function-name>`
			- Function syntax uses HTTP verbs: `get_myFunction`, `post_myFunction`, etc.
		-
		- ### Code Implementation (`backend/http-functions.js`)
			- ```javascript
			  import { ok, badRequest, serverError } from 'wix-http-functions';
			  import wixData from 'wix-data';
			  
			  /**
			   * Responds to GET request at URL:
			   * https://www.mysite.com/_functions/getLeadsEndpoint
			   */
			  export function get_getLeadsEndpoint(request) {
			    const response = {
			      headers: {
			        'Content-Type': 'application/json'
			      }
			    };
			    
			    // Extract query parameters: ?limit=10
			    const limit = parseInt(request.query.limit, 10) || 10;
			    
			    return wixData.query('LeadsCollection')
			      .limit(limit)
			      .find()
			      .then(results => {
			        response.body = {
			          status: 'success',
			          count: results.items.length,
			          leads: results.items
			        };
			        return ok(response);
			      })
			      .catch(error => {
			        response.body = {
			          status: 'error',
			          message: error.message
			        };
			        return serverError(response);
			      });
			  }
			  
			  /**
			   * Responds to POST requests at URL:
			   * https://www.mysite.com/_functions/postWebhookEntry
			   */
			  export function post_postWebhookEntry(request) {
			    const response = {
			      headers: {
			        'Content-Type': 'application/json'
			      }
			    };
			    
			    // Read the request body stream JSON payload
			    return request.body.json()
			      .then(body => {
			        if (!body.email) {
			          response.body = { error: 'Missing email address parameter' };
			          return badRequest(response);
			        }
			        
			        const newEntry = {
			          emailAddress: body.email,
			          source: 'external_webhook',
			          timestamp: new Date()
			        };
			        
			        return wixData.insert('LeadsCollection', newEntry)
			          .then(result => {
			            response.body = { success: true, id: result._id };
			            return ok(response);
			          });
			      })
			      .catch(err => {
			        response.body = { error: err.message };
			        return serverError(response);
			      });
			  }
			  ```
	-
	- ## Custom Routing API (`backend/routers.js`)
		- Routers control dynamic paths, custom page loads, redirection rules, and dynamic meta-data injection for SEO bots:
		- ```javascript
		  // backend/routers.js
		  
		  import { ok, redirect, next } from 'wix-router';
		  import wixData from 'wix-data';
		  
		  /**
		   * Manages routing request parameters dynamically.
		   * Maps path /members/[memberSlug]
		   */
		  export function members_Router(request) {
		    // Extract path segment (e.g. memberSlug)
		    const pathSegments = request.path;
		    const slug = pathSegments[0];
		    
		    return wixData.query('MembersCollection')
		      .eq('profileSlug', slug)
		      .find()
		      .then(results => {
		        if (results.items.length > 0) {
		          // Send user profile data to the target page dynamically
		          const memberData = results.items[0];
		          
		          // Configure SEO variables on the fly
		          const seoData = {
		            title: `${memberData.fullName} Profile Dashboard`,
		            metaDescription: `Read reviews and contact information for ${memberData.fullName}.`,
		            keywords: 'members, directory, developer'
		          };
		          
		          // Render page: "members-profile-page" with custom payload
		          return ok("members-profile-page", memberData, seoData);
		        }
		        
		        // Redirect invalid profiles to directory homepage
		        return redirect('/members-directory', '301');
		      })
		      .catch(err => {
		        return next(); // Fallback to default Wix 404 handler
		      });
		  }
		  ```
	-
	- ## Wix Headless Integration (Wix SDK)
		- Wix Headless allows you to consume Wix backend services (Wix Stores, Wix Bookings, Wix CMS) inside external JavaScript applications (Next.js, React Native, Mobile Apps) via the unified `@wix/sdk` client:
		- ```javascript
		  import { createClient, OAuthStrategy } from '@wix/sdk';
		  import { items } from '@wix/data';
		  
		  // Initialize the headless Wix SDK client
		  const wixClient = createClient({
		    modules: { items },
		    auth: OAuthStrategy({
		      clientId: 'your-wix-client-id-here',
		      tokens: {
		        // Provide token storage context
		        accessToken: { value: '', expiresAt: 0 },
		        refreshToken: { value: '', expiresAt: 0 }
		      }
		    })
		  });
		  
		  // Fetch dynamic items from external React framework
		  export async function fetchExternalProducts() {
		    const response = await wixClient.items.queryDataItems({
		      dataCollectionId: 'ProductsCollection'
		    })
		    .find();
		    
		    return response.items;
		  }
		  ```
	-
	- ## Service Provider Interfaces (SPIs)
		- Wix SPIs allow custom developers to intercept core platform processes and inject custom business logic at run-time:
		- **E-commerce Checkout Validation SPI**: Prevent payment processing unless specific validation conditions (e.g. valid corporate email, order value restrictions per user) are met.
		- **Custom Shipping SPI**: Dynamically calculate custom shipping rules by sending cart coordinates to third-party shipping APIs.
	-
	- ## Custom Elements (Custom UI Layouts)
		- Custom Elements let you embed standard HTML web components, React widgets, or Vue frameworks inside a Wix page:
		- ```javascript
		  // Create an HTML5 Custom Element class
		  class ChartElement extends HTMLElement {
		    connectedCallback() {
		      this.innerHTML = `
		        <div class="custom-widget bg-gray-100 p-4 border rounded">
		          <h3 class="font-bold text-lg">Dynamic Widget</h3>
		          <p>Running code inside a custom element boundary.</p>
		        </div>
		      `;
		    }
		  }
		  
		  // Register custom component
		  customElements.define('chart-element', ChartElement);
		  ```
-
- # Wix Velo API Code Cookbooks
  collapsed:: true
	- This section provides copy-pasteable, commented code examples for common web design and automation patterns on Wix.
	-
	- ## 1. Multi-Step Form Layout Controller
		- Simulates a slide-based checkout or questionnaire experience by toggling section container visibilities:
		- ```javascript
		  $w.onReady(function () {
		    let currentStep = 1;
		    
		    $w('#nextButton').onClick(() => {
		      if (validateStep(currentStep)) {
		        goToStep(currentStep + 1);
		      }
		    });
		    
		    $w('#prevButton').onClick(() => {
		      goToStep(currentStep - 1);
		    });
		    
		    function goToStep(step) {
		      currentStep = step;
		      
		      // Toggle container visibility based on steps
		      if (currentStep === 1) {
			$w('#step1Container').show();
			$w('#step2Container').hide();
			$w('#step3Container').hide();
			$w('#prevButton').disable();
		      } else if (currentStep === 2) {
			$w('#step1Container').hide();
			$w('#step2Container').show();
			$w('#step3Container').hide();
			$w('#prevButton').enable();
			$w('#nextButton').label = 'Next';
		      } else if (currentStep === 3) {
			$w('#step1Container').hide();
			$w('#step2Container').hide();
			$w('#step3Container').show();
			$w('#nextButton').label = 'Submit';
		      }
		    }
		  });
		  
		  function validateStep(step) {
		    if (step === 1) {
		      return $w('#firstName').value !== '';
		    }
		    return true;
		  }
		  ```
	-
	- ## 2. Search Autocomplete Droplist
		- Renders an autocomplete suggestions list in a repeater while the user is typing:
		- ```javascript
		  import wixData from 'wix-data';
		  
		  $w.onReady(function () {
		    $w('#searchBar').onInput((event) => {
		      const inputVal = event.target.value;
		      
		      if (inputVal.length > 2) {
			wixData.query('ArticlesCollection')
			  .startsWith('title', inputVal)
			  .limit(5)
			  .find()
			  .then(results => {
			    if (results.items.length > 0) {
			      $w('#suggestionsRepeater').data = results.items;
			      $w('#suggestionsRepeater').show();
			    } else {
			      $w('#suggestionsRepeater').hide();
			    }
			  });
		      } else {
			$w('#suggestionsRepeater').hide();
		      }
		    });
		    
		    $w('#suggestionsRepeater').onItemReady(($item, itemData) => {
		      $item('#suggestionText').text = itemData.title;
		      $item('#suggestionText').onClick(() => {
			$w('#searchBar').value = itemData.title;
			$w('#suggestionsRepeater').hide();
			executeSearch(itemData.title);
		      });
		    });
		  });
		  
		  function executeSearch(query) {
		    console.log("Searching for: " + query);
		  }
		  ```
	-
	- ## 3. Dynamic Sticky Navigation Header
		- Toggles custom CSS variables or header size classes based on viewport scroll events:
		- ```javascript
		  import wixWindow from 'wix-window';
		  
		  $w.onReady(function () {
		    // Bind a viewport enter anchor placed below the header fold
		    $w('#scrollAnchor').onViewportLeave(() => {
		      // Make the header sticky and smaller when user scrolls down
		      $w('#headerStrip').addClass('sticky-fixed-size');
		      $w('#logoImage').size = 'small';
		    });
		    
		    $w('#scrollAnchor').onViewportEnter(() => {
		      // Reset header back to normal when returning to the top
		      $w('#headerStrip').removeClass('sticky-fixed-size');
		      $w('#logoImage').size = 'large';
		    });
		  });
		  ```
	-
	- ## 4. Custom Payment Integration Trigger
		- Initiates dynamic payments and redirects users to a secure checkout:
		- ```javascript
		  import wixPay from 'wix-pay';
		  import { createPaymentRequest } from 'backend/payments.jsw';
		  
		  $w.onReady(function () {
		    $w('#buyTicketButton').onClick(async () => {
		      const ticketQty = parseInt($w('#quantityDropdown').value, 10);
		      
		      // 1. Create a secure payment mapping in backend
		      const paymentResult = await createPaymentRequest(ticketQty);
		      
		      if (paymentResult.success) {
			// 2. Trigger the front-end checkout modal window
			wixPay.startPayment(paymentResult.paymentId)
			  .then(result => {
			    if (result.status === 'Successful') {
			      $w('#statusMessage').text = "Transaction successful! Check your email.";
			      $w('#statusMessage').show();
			    }
			  });
		      }
		    });
		  });
		  ```
	-
	- ## 5. Fetch External weather API JSON Data
		- Renders external API data directly in a dashboard element:
		- ```javascript
		  import wixFetch from 'wix-fetch';
		  
		  $w.onReady(function () {
		    const city = 'New York';
		    
		    wixFetch.fetch(`https://api.weatherapi.com/v1/current.json?q=${city}`)
		      .then(res => res.json())
		      .then(data => {
			$w('#weatherLabel').text = `${city} temp is currently: ${data.current.temp_c}°C`;
		      })
		      .catch(err => console.error("Weather fetch failure: " + err.message));
		  });
		  ```
	-
	- ## 6. User Session State Store
		- Caches transient variables to prevent loading identical database collections twice:
		- ```javascript
		  import { session } from 'wix-storage';
		  
		  $w.onReady(function () {
		    const isCached = session.getItem('USER_DASHBOARD_LOADED');
		    
		    if (isCached) {
		      $w('#dashboardLoader').hide();
		      renderCachedDashboard();
		    } else {
		      loadDashboardData();
		    }
		  });
		  
		  function loadDashboardData() {
		    // Perform database calls...
		    session.setItem('USER_DASHBOARD_LOADED', 'true');
		  }
		  
		  function renderCachedDashboard() {
		    // Load from local elements...
		  }
		  ```
	-
	- ## 7. Backend Cron Job Configuration (`backend/jobs.config`)
		- Defines execution schedules for backend script functions:
		- ```json
		  {
		    "jobs": [
		      {
			"functionLocation": "/backend/jobs.js",
			"functionName": "cleanOldLeads",
			"description": "Deletes draft leads older than 30 days every night.",
			"executionConfig": {
			  "time": "02:00"
			}
		      }
		    ]
		  }
		  ```
	-
	- ## 8. Bulk Collection Data Import
		- Inserts array elements inside a single transactional database call:
		- ```javascript
		  import wixData from 'wix-data';
		  
		  export function bulkImportLeads(recordsList) {
		    // Performs bulk inserts within a single db request pipeline
		    return wixData.bulkInsert('LeadsCollection', recordsList)
		      .then(results => {
			return { inserted: results.inserted, errors: results.errors };
		      });
		  }
		  ```
	-
	- ## 9. User Roles Verification Hook
		- Restricts form element interactions depending on active security roles:
		- ```javascript
		  import wixUsers from 'wix-users';
		  
		  $w.onReady(function () {
		    const currentUser = wixUsers.currentUser;
		    
		    if (currentUser.loggedIn) {
		      currentUser.getRoles()
			.then(roles => {
			  const isAdmin = roles.some(role => role.name === 'Admin');
			  if (isAdmin) {
			    $w('#adminControlsContainer').show();
			  }
			});
		    }
		  });
		  ```
	-
	- ## 10. Router Custom Redirection Rule
		- Dynamic URL redirection based on browser parameters:
		- ```javascript
		  import wixLocation from 'wix-location';
		  
		  $w.onReady(function () {
		    const queryParams = wixLocation.query;
		    
		    if (queryParams.ref === 'promo') {
		      // Redirect user to discounted store page
		      wixLocation.to('/promo-store');
		    }
		  });
		  ```
	-
	- ## 11. Custom Video Player Controls
		- Controls native video player components through JS selector calls:
		- ```javascript
		  $w.onReady(function () {
		    $w('#playBtn').onClick(() => {
		      $w('#mainVideo').play();
		    });
		    
		    $w('#pauseBtn').onClick(() => {
		      $w('#mainVideo').pause();
		    });
		  });
		  ```
	-
	- ## 12. Dynamic Page Pagination Controller
		- Custom pagination implementation for datasets:
		- ```javascript
		  $w.onReady(function () {
		    $w('#nextPageBtn').onClick(() => {
		      $w('#myDataset').nextPage();
		    });
		    
		    $w('#prevPageBtn').onClick(() => {
		      $w('#myDataset').previousPage();
		    });
		  });
		  ```
	-
	- ## 13. Dynamic Accordion Toggle
		- Interactive accordion details wrapper toggling box collapsed states:
		- ```javascript
		  $w.onReady(function () {
		    $w('#accordionHeader').onClick(() => {
		      if ($w('#accordionContent').collapsed) {
			$w('#accordionContent').expand();
		      } else {
			$w('#accordionContent').collapse();
		      }
		    });
		  });
		  ```
	-
	- ## 14. E-commerce Item Options Injector
		- Add products dynamically with specific color configurations to the cart:
		- ```javascript
		  import wixStores from 'wix-stores';
		  
		  export function addToCartWithOptions(productId) {
		    const options = {
		      "choices": { "Color": "Blue", "Size": "M" }
		    };
		    
		    return wixStores.cart.addProducts([{
		      productId: productId,
		      quantity: 1,
		      options: options
		    }]);
		  }
		  ```
	-
	- ## 15. Form Reset Controller
		- Clears all form elements in a single function call:
		- ```javascript
		  function resetContactForm() {
		    $w('#firstName').value = '';
		    $w('#emailInput').value = '';
		    $w('#messageArea').value = '';
		    $w('#errorText').hide();
		  }
		  ```
	-
	- ## 16. Localized Date Formatter Utility
		- Formats database timestamp columns to localized formats inside a repeater item:
		- ```javascript
		  export function formatTimestamp(dateObj) {
		    const options = { year: 'numeric', month: 'long', day: 'numeric' };
		    return dateObj.toLocaleDateString('en-US', options);
		  }
		  ```
	-
	- ## 17. Scroll-To View Anchor Smooth Effect
		- Animates view scrolling to a specific page section coordinates:
		- ```javascript
		  $w.onReady(function () {
		    $w('#backToTopBtn').onClick(() => {
		      $w('#topAnchor').scrollTo();
		    });
		  });
		  ```
	-
	- ## 18. Dynamic Repeater Index Badges
		- Adds count values inside repeaters dynamically:
		- ```javascript
		  $w.onReady(function () {
		    $w('#myRepeater').onItemReady(($item, itemData, index) => {
		      $item('#indexBadge').text = (index + 1).toString();
		    });
		  });
		  ```
	-
	- ## 19. Secret Tokens Fetcher (Backend only)
		- Prevents keys from loading to the browser:
		- ```javascript
		  import { getSecret } from 'wix-secrets-backend';
		  
		  export async function getClientConfig() {
		    const apiSecret = await getSecret('SECURE_API_TOKEN');
		    return { token: apiSecret };
		  }
		  ```
	-
	- ## 20. Form Verification Failure Highlighters
		- Adds error style classes to invalid fields:
		- ```javascript
		  function highlightFieldError(elementId) {
		    $w(`#${elementId}`).style.borderColor = "#FF0000";
		    $w(`#${elementId}`).style.borderWidth = 2;
		  }
		  ```
	-
	- ## 21. Multi-Selection Checkbox Filter
		- Filters a repeater dynamically based on multiple selected checkboxes:
		- ```javascript
		  import wixData from 'wix-data';
		  
		  $w.onReady(function () {
		    $w('#tagCheckboxGroup').onChange(() => {
		      const selectedTags = $w('#tagCheckboxGroup').value; // Returns array of selected strings
		      
		      if (selectedTags.length > 0) {
		        wixData.query('ArticlesCollection')
		          .hasAll('tags', selectedTags) // Filters items containing all selected tags
		          .find()
		          .then(results => {
		            $w('#resultsRepeater').data = results.items;
		          });
		      } else {
		        // Reset list if no tags are selected
		        loadAllArticles();
		      }
		    });
		  });
		  
		  function loadAllArticles() {
		    wixData.query('ArticlesCollection').find().then(r => { $w('#resultsRepeater').data = r.items; });
		  }
		  ```
	-
	- ## 22. Dynamic Element Displayer Based on Time
		- Shows or hides an alert banner depending on the current visitor's local hour:
		- ```javascript
		  $w.onReady(function () {
		    const currentHour = new Date().getHours();
		    
		    // Show support online banner only during business hours (9 AM - 5 PM)
		    if (currentHour >= 9 && currentHour < 17) {
		      $w('#supportOnlineBanner').show();
		      $w('#supportOfflineBanner').hide();
		    } else {
		      $w('#supportOnlineBanner').hide();
		      $w('#supportOfflineBanner').show();
		    }
		  });
		  ```
	-
	- ## 23. Direct File Upload Button Trigger
		- Programmatically starts a file upload on button click and saves URL to database:
		- ```javascript
		  $w.onReady(function () {
		    $w('#uploadTriggerBtn').onClick(() => {
		      // Programmatically click the hidden file upload button
		      $w('#hiddenUploadButton').uploadFiles()
		        .then(uploadedFiles => {
		          if (uploadedFiles.length > 0) {
		            const fileUrl = uploadedFiles[0].fileUrl;
		            $w('#uploadedFileName').text = uploadedFiles[0].fileName;
		            saveFileToCollection(fileUrl);
		          }
		        })
		        .catch(err => {
		          console.error("Upload failed: " + err.message);
		        });
		    });
		  });
		  
		  function saveFileToCollection(url) {
		    // Database insert mapping...
		  }
		  ```
	-
	- ## 24. Repeater Item Count Summary
		- Counts and displays total number of items loaded in a repeater:
		- ```javascript
		  $w.onReady(function () {
		    $w('#myDataset').onReady(() => {
		      const totalCount = $w('#myDataset').getTotalCount();
		      $w('#totalCountLabel').text = `Displaying ${totalCount} records.`;
		    });
		  });
		  ```
	-
	- ## 25. Custom Currency Formatter
		- Utility function to format numbers to currency strings inside lists:
		- ```javascript
		  export function formatCurrency(amount, currencyCode = 'USD') {
		    return new Intl.NumberFormat('en-US', {
		      style: 'currency',
		      currency: currencyCode,
		    }).format(amount);
		  }
		  ```
-
- # Wix E-commerce SPI Customization
  collapsed:: true
	- Service Provider Interfaces (SPIs) allow developers to inject custom server-side logic directly into Wix's native commerce pipelines.
	-
	- ## E-commerce SPI Concept
		- SPIs act as dynamic middlewares. When Wix processes checkout tasks (shipping calculations, discount applications, order validations), it triggers custom functions hosted securely on your serverless backend, awaiting response parameters before completing the transaction.
	-
	- ## Custom Shipping SPI Implementation (`backend/spi/shipping-rates/shipping-rates.js`)
		- Calculates customized shipping rates based on order total:
		- ```javascript
		  /**
		   * Calculates custom shipping rates.
		   * Triggers automatically during checkout.
		   */
		  export function getShippingRates(options) {
		    const items = options.shippingRatesRequest.lineItems;
		    let totalWeight = 0;
		    
		    items.forEach(item => {
		      totalWeight += (item.physicalProperties.weight || 0) * item.quantity;
		    });
		    
		    let rate = 5.00; // Base rate
		    
		    if (totalWeight > 20) {
		      rate = 15.00; // Heavy shipping rate
		    }
		    
		    return {
		      shippingRates: [
		        {
		          code: 'custom-shipping-rate',
		          title: 'Velo Custom Shipping',
		          logistics: {
		            deliveryTime: '3-5 Business Days'
		          },
		          cost: {
		            amount: rate.toString(),
		            currency: 'USD'
		          }
		        }
		      ]
		    };
		  }
		  ```
-
- # Testing & Debugging Frameworks
  collapsed:: true
	- Wix provides logging, error reporting, and serverless log streams.
	-
	- ## Site Monitoring Integration
		- You can stream Velo console logs, exceptions, and API payloads in real-time to external analytics dashboards (like Google Cloud Operations Suite or Stackdriver):
		- ```json
		  // backend/site-monitoring-config.json
		  {
		    "gcpProject": "wix-site-telemetry-project",
		    "logName": "velo-server-logs",
		    "filterSeverity": "WARNING"
		  }
		  ```
	-
	- ## Backend Unit Testing (`backend/paymentService.test.js`)
		- Developers can write tests for backend `.jsw` modules using default testing parameters:
		- ```javascript
		  import { getGatewayToken } from './paymentService.jsw';
		  
		  // Mock payment gateway response testing
		  describe('Payment Gateway API Tokenizer', () => {
		    it('should fail gracefully if amount is negative', async () => {
		      const result = await getGatewayToken(-10);
		      expect(result.success).toBe(false);
		      expect(result.error).toContain('Amount cannot be negative');
		    });
		  });
		  ```
-
- # More Learn
	- ## Developer Documentation & Framework References
		- [Wix Velo API Reference Directory](https://www.wix.com/velo/reference/api-overview)
		- [Wix Studio Developer Workspace Guides](https://dev.wix.com/)
		- [Wix Headless SDK Client Documentation](https://dev.wix.com/docs/headless/sdk)
		- [Wix HTTP Functions (Creating Custom API Webhooks)](https://www.wix.com/velo/reference/wix-http-functions)
		- [Wix Secrets Manager (Storing API Private Keys)](https://www.wix.com/velo/reference/wix-secrets-backend)
		- [Wix Data Query & Database Operations Reference](https://www.wix.com/velo/reference/wix-data)
		- [Velo Web Forum (Developer Discussions)](https://forum.wix.com/)