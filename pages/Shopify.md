---
seoTitle: Shopify Reference – Store Setup, Liquid Themes, and API Guide
description: "Shopify reference covering store setup, Liquid templating, Shopify CLI, theme development, Storefront API, Admin API, and app development with Polaris."
keywords: "Shopify, e-commerce, Liquid template, Shopify CLI, theme development, Storefront API, Admin API, Polaris, Shopify app, online store, headless commerce"
displayTitle: Shopify
---

- # History
	- **How**:
		- **Shopify** was founded in **2006** by **Tobias Lütke**, **Daniel Weinand**, and **Scott Lake**.
		- The founders originally set out to open an online snowboard shop called *Snowdevil*, but found existing e-commerce software (like Yahoo! Store) to be restrictive, expensive, and difficult to customize.
		- Tobias Lütke, a programmer, decided to write his own e-commerce software using the newly released framework **Ruby on Rails**.
		- Realizing the software was more valuable than the snowboards, they pivoted to launch Shopify as a hosted platform.
		- Key milestones:
			- **2009**: Launched an API platform and App Store, shifting from a website builder to a software ecosystem.
			- **2013**: Released Shopify Payments and Shopify POS (Point of Sale) for physical retail.
			- **2016**: Introduced Shopify Plus, targeting enterprise-level merchants.
			- **2020s**: Expanded to support headless commerce via Hydrogen (Remix framework) and Oxygen hosting.
	-
	- **Who**:
		- Founded by **Tobias Lütke**, **Daniel Weinand**, and **Scott Lake**. Lütke remains CEO and chief architect of the core platform.
	-
	- **Why**:
		- Created to lower the barrier of entry for merchants starting online stores, while providing developers with highly customizable templates and API options to build complex e-commerce architectures.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Managed Hosting & Security** — PCI-compliance, hosting, CDN, SSL, and server load scaling are fully managed by Shopify.
		- **Huge App Ecosystem** — Over 8,000 apps in the Shopify App Store to extend functionality without writing custom integrations.
		- **Robust APIs** — Rich API access for storefronts, product catalogs, cart logic, orders, checkout, and inventory.
		- **Theme Customization** — Liquid templating combined with the Theme Editor allows merchants to modify layouts visually while developers retain full code control.
		- **Built-in POS** — Synchronizes online and in-person inventory, customers, and order history natively.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Transactional and Platform Fees** — Monthly subscriptions plus transaction fees if not using Shopify Payments.
		- **Lock-in** — Moving away from Shopify requires migrating database schema, rebuilding frontends, and replacing integrations.
		- **Limited Core Database Customization** — Custom attributes (metafields) are supported, but adding entirely custom database tables requires external app databases.
		- **API Rate Limits** — Standard API usage is governed by Leaky Bucket rate limits, which can throttle heavy ERP synchronization integrations.
	-
	- ## Remember Points
	  collapsed:: true
		- **Liquid is Server-Side** — Liquid executes on Shopify's servers before returning static HTML/CSS to the client. You cannot run Liquid logic dynamically client-side.
		- **Shopify CLI** — The main terminal tool used to build, test, and deploy Shopify themes and custom applications.
		- **Theme Schema** — Setting definitions (`settings_schema.json` and section schema tags) determine what controls are visible to merchants in the visual editor.
-
- # Liquid Templating Basics
	- ## Syntax Syntax: Output vs. Tags
	  collapsed:: true
		- Liquid uses two primary syntax indicators: output markup `{{ ... }}` and tag markup `{% ... %}`.
		- ```liquid
		  {% comment %} This is a comment tag and won't render in HTML {% endcomment %}
		  
		  <!-- Output markup outputs data from objects -->
		  <h2>{{ product.title }}</h2>
		  <p>Price: {{ product.price | money }}</p>
		  
		  <!-- Filters modify outputs via the pipe character '|' -->
		  <p>{{ "shopify platform" | upcase | replace: "PLATFORM", "E-COMMERCE" }}</p>
		  
		  <!-- Outputting collections -->
		  <p>First variant SKU: {{ product.variants.first.sku }}</p>
		  ```
	-
	- ## Variables: assign and capture
	  collapsed:: true
		- ```liquid
		  <!-- 'assign' creates or changes variables -->
		  {% assign discount_rate = 0.15 %}
		  {% assign sale_price = product.price | times: discount_rate %}
		  
		  <!-- 'capture' compiles blocks of text/HTML into a single string variable -->
		  {% capture banner_html %}
		    <div class="promo-banner">
		      <h3>{{ product.vendor }} Special Offer!</h3>
		      <p>Save {{ sale_price | money }} today!</p>
		    </div>
		  {% endcapture %}
		  
		  <!-- Render captured variable -->
		  {{ banner_html }}
		  ```
-
- # Liquid Control Flow
	- ## Conditions: if, unless, and case
	  collapsed:: true
		- ```liquid
		  <!-- 1. If / Elsif / Else -->
		  {% if product.available %}
		    <button class="btn add-to-cart">Add to Cart</button>
		  {% elsif product.tags contains 'Preorder' %}
		    <button class="btn preorder">Pre-Order Now</button>
		  {% else %}
		    <button class="btn disabled" disabled>Sold Out</button>
		  {% endif %}
		  
		  <!-- 2. Unless (negation condition) -->
		  {% unless customer.tags contains 'VIP' %}
		    <p>Sign up for VIP status to receive special discounts!</p>
		  {% endunless; %}
		  
		  <!-- 3. Case statement -->
		  {% case product.type %}
		    {% when 'T-Shirt' %}
		       <p>Check our apparel sizing chart.</p>
		    {% when 'Shoes' %}
		       <p>Review shoe sizing options.</p>
		    {% else %}
		       <p>Standard shipping guidelines apply.</p>
		  {% endcase %}
		  ```
	-
	- ## Iteration: for loops and loop helpers
	  collapsed:: true
		- ```liquid
		  <!-- For loop with limit, offset, and reversed parameters -->
		  <ul>
		    {% for product in collections.all.products limit: 5 offset: 2 %}
		      <li>
		        {{ forloop.index }}: {{ product.title }} - 
		        <!-- loop helpers -->
		        {% if forloop.first %} (Starting Item) {% endif %}
		        {% if forloop.last %} (Ending Item) {% endif %}
		      </li>
		    {% else %}
		      <li>No products found in this collection.</li>
		    {% endfor %}
		  </ul>
		  
		  <!-- Tablerow generates HTML table structures automatically -->
		  <table>
		    {% tablerow product in collection.products cols: 3 %}
		      <a href="{{ product.url }}">{{ product.title }}</a>
		    {% endtablerow %}
		  </table>
		  ```
-
- # Theme Directory Structure
	- ## Standard Directory Layout
	  collapsed:: true
		- Shopify Online Store 2.0 themes rely on a strict directory structure:
		- ```text
		  my-theme/
		  ├── assets/          # CSS, JavaScript, images, and fonts loaded in pages
		  ├── config/          # theme settings options and default configurations
		  │   ├── settings_data.json
		  │   └── settings_schema.json
		  ├── layout/          # Theme wrapper files
		  │   ├── theme.liquid
		  │   └── password.liquid
		  ├── locales/         # Translation JSON files for multi-language support
		  ├── sections/        # Modular components that merchants can add/reorder
		  ├── snippets/        # Reusable small helper HTML/Liquid blocks (imported via render)
		  └── templates/       # Page templates (now JSON format in OS 2.0)
		      ├── index.json
		      ├── product.json
		      └── cart.json
		  ```
-
- # Theme Section Schema
	- ## Section Structure and JSON Schema Settings
	  collapsed:: true
		- Sections are modular templates. The developer adds schema configurations to declare fields editable inside the customizer.
		- ```liquid
		  <!-- sections/custom-hero.liquid -->
		  <div class="custom-hero" style="background-color: {{ section.settings.bg_color }};">
		    <div class="hero-container">
		      <h2>{{ section.settings.title }}</h2>
		      
		      <!-- Render block schemas -->
		      {% for block in section.blocks %}
		        <div class="hero-block" {{ block.shopify_attributes }}>
		          {% case block.type %}
		            {% when 'text' %}
		              <p>{{ block.settings.body }}</p>
		            {% when 'button' %}
		              <a href="{{ block.settings.link }}" class="btn">{{ block.settings.label }}</a>
		          {% endcase %}
		        </div>
		      {% endfor %}
		    </div>
		  </div>
		  
		  {% schema %}
		  {
		    "name": "Custom Hero",
		    "tag": "section",
		    "class": "hero-section",
		    "settings": [
		      {
		        "type": "text",
		        "id": "title",
		        "label": "Hero Title",
		        "default": "Welcome to our Store"
		      },
		      {
		        "type": "color",
		        "id": "bg_color",
		        "label": "Background Color",
		        "default": "#f4f4f4"
		      }
		    ],
		    "blocks": [
		      {
		        "type": "text",
		        "name": "Text Block",
		        "settings": [
		          {
		            "type": "textarea",
		            "id": "body",
		            "label": "Text Content"
		          }
		        ]
		      },
		      {
		        "type": "button",
		        "name": "Button Link",
		        "settings": [
		          {
		            "type": "text",
		            "id": "label",
		            "label": "Button Label",
		            "default": "Click Here"
		          },
		          {
		            "type": "url",
		            "id": "link",
		            "label": "Button Link"
		          }
		        ]
		      }
		    ],
		    "presets": [
		      {
		        "name": "Custom Hero",
		        "category": "Hero Elements",
		        "blocks": [
		          { "type": "text" }
		        ]
		      }
		    ]
		  }
		  {% endschema %}
		  ```
-
- # Shopify CLI commands
	- ## Operations Workflow commands
	  collapsed:: true
		- Developers use the CLI to log in, initialize themes, run servers, and push code changes.
		- ```bash
		  # Log in to a specific Shopify development store
		  shopify login --store my-dev-shop.myshopify.com
		  
		  # Initialize a new theme from the Dawn starter repository
		  shopify theme init my-new-theme
		  
		  # Start a local development server for the current directory
		  # (Generates a preview link and syncs changes in real-time)
		  shopify theme dev
		  
		  # Run dev on a specific theme ID or remote store
		  shopify theme dev --store my-dev-shop.myshopify.com --theme 123456789
		  
		  # Pull changes from the active theme on the remote store
		  shopify theme pull
		  
		  # Publish local theme code to a development, staging, or live theme slot
		  shopify theme push
		  
		  # Compile or run checks on Shopify theme syntax constraints
		  shopify theme check
		  ```
-
- # Admin GraphQL API
	- ## Product Queries and Rate Limits
	  collapsed:: true
		- The Admin API is used to manage products, variants, orders, customers, and fulfillment. It runs on a Leaky Bucket algorithm.
		- ```graphql
		  # Query: Fetch list of products, variants, inventory, and metafields
		  query GetProductsWithMetafields {
		    products(first: 10) {
		      edges {
		        node {
		          id
		          title
		          handle
		          status
		          metafield(namespace: "custom", key: "internal_notes") {
		            value
		          }
		          variants(first: 5) {
		            edges {
		              node {
		                id
		                title
		                price
		                inventoryQuantity
		                sku
		              }
		            }
		          }
		        }
		      }
		      pageInfo {
		        hasNextPage
		        endCursor
		      }
		    }
		  }
		  ```
	-
	- ## Leaky Bucket Rate Limit
	  collapsed:: true
		- Admin API calls consume API points depending on nested complexity.
		- Standard shops have a bucket capacity of **1,000 points** refilling at **50 points/second** (Plus stores scale larger).
		- To check cost, query the header response fields or embed requests in GraphQL:
		- ```graphql
		  query {
		    products(first: 5) {
		      edges {
		        node {
		          id
		        }
		      }
		    }
		    # Fetch API usage information in the response payload
		    cost {
		      requestedQueryCost
		      actualQueryCost
		      throttleStatus {
		        maximumAvailable
		        currentlyAvailable
		        restoreRate
		      }
		    }
		  }
		  ```
-
- # Storefront API
	- ## Headless Commerce Cart Operations
	  collapsed:: true
		- The Storefront API is a fast, public GraphQL API designed to build customized frontends (e.g., Gatsby, Next.js, or mobile applications).
		- ```graphql
		  # Mutation: Create a cart and add item variants
		  mutation CreateCartWithLineItem($variantId: ID!, $quantity: Int!) {
		    cartCreate(
		      input: {
		        lines: [
		          {
		            merchandiseId: $variantId
		            quantity: $quantity
		          }
		        ]
		      }
		    ) {
		      cart {
		        id
		        checkoutUrl
		        lines(first: 10) {
		          edges {
		            node {
		              id
		              quantity
		              merchandise {
		                ... on ProductVariant {
		                  id
		                  title
		                  price {
		                    amount
		                    currencyCode
		                  }
		                }
		              }
		            }
		          }
		        }
		      }
		      userErrors {
		        field
		        message
		      }
		    }
		  }
		  ```
-
- # Webhooks & Security
	- ## Signature Validation
	  collapsed:: true
		- Shopify webhooks send POST payloads containing structural JSON. To guarantee integrity, check the `X-Shopify-Hmac-Sha256` header.
		- ```javascript
		  // Node.js Express middleware example
		  const express = require('express');
		  const crypto = require('crypto');
		  const app = express();
		  
		  // Note: MUST capture raw body string for accurate HMAC calculation
		  app.post('/webhooks/order-created', express.raw({ type: 'application/json' }), (req, res) => {
		      const hmacHeader = req.headers['x-shopify-hmac-sha256'];
		      const apiSecret = process.env.SHOPIFY_API_SECRET;
		      
		      const hash = crypto
		          .createHmac('sha256', apiSecret)
		          .update(req.body, 'utf8')
		          .digest('base64');
		          
		      if (hash === hmacHeader) {
		          // HMAC signature verified, process order queue
		          const payload = JSON.parse(req.body.toString());
		          console.log(`Order ${payload.id} received successfully.`);
		          res.status(200).send('Verified');
		      } else {
		          // Security check failed
		          console.warn('Webhook verification check failed.');
		          res.status(401).send('Unauthorized');
		      }
		  });
		  ```
-
- # App Development & Extensions
	- ## Embedded App Architecture
	  collapsed:: true
		- Custom Shopify apps run on external servers and integrate with the Shopify Admin Dashboard via an embedded `iframe`.
		- **App Bridge** — A Javascript SDK provided by Shopify to sync actions, display toasts, route loaders, and open modals outside the iframe boundary.
		- **Polaris UI** — The standard design framework containing React components that match Shopify's design system.
		- **Shopify Functions** — Let developers inject custom code directly into Shopify servers to modify checkout, cart pricing, cart validation, shipping calculations, and discounts.
-
- # More Learn
	- Explore valuable resources for Shopify development:
		-
		- [Shopify Dev Portal (Documentation)](https://shopify.dev/)
		- [Liquid Reference Guide](https://shopify.github.io/liquid/)
		- [Shopify Partners (Developer dashboard)](https://partners.shopify.com/)
		- [Polaris UI Design System](https://polaris.shopify.com/)