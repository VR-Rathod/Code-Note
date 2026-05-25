---
date: 2025-10-09T14:23:07+05:30
lastmod: 2026-05-22T16:45:19+05:30

seoTitle: GraphQL Complete Guide – Schema, Queries, Mutations, Subscriptions & Best Practices
description: "Comprehensive GraphQL reference covering type system, schema design, queries, mutations, subscriptions, resolvers, directives, performance optimization, and real-world patterns."
keywords: "GraphQL, GraphQL queries, mutations, schema, resolvers, subscriptions, fragments, variables, GraphQL Python, graphene, Apollo, API development, GraphQL best practices, type system, directives, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: GraphQL
author: Makvana Smitrajsinh
authorUrl: https://portfolio-eight-theta-7g6hpaehqn.vercel.app/
---

- # History
  collapsed:: true
	- **How**:
		- Developed internally by **Facebook** in **2012** to solve mobile app data fetching challenges.
		- Created to address over-fetching and under-fetching problems in REST APIs.
		- Built to handle complex, nested data requirements for Facebook's mobile apps.
		- Open-sourced in **2015** at React.js Conf.
		- GraphQL Foundation established in **2018** under the Linux Foundation.
		- Specification-driven development ensures consistency across implementations.
	-
	- **Who**:
		- **Lee Byron**, **Dan Schafer**, and **Nick Schrock** — original creators at Facebook.
		- **Facebook Engineering Team** — initial development and production use.
		- **GraphQL Foundation** — now maintains the specification and ecosystem.
		- Large open-source community with implementations in 20+ languages.
		- Major adopters: GitHub, Shopify, Twitter, Airbnb, Netflix, PayPal.
	-
	- **Why**:
		- REST APIs caused over-fetching (too much data) and under-fetching (multiple requests).
		- Mobile apps needed efficient data loading with limited bandwidth.
		- Frontend teams wanted independence from backend API changes.
		- Need for strongly-typed contracts between client and server.
		- Real-time data requirements for modern applications.
		- Desire for better developer experience with self-documenting APIs.
-
- # Introduction
  collapsed:: true
	- ## What is GraphQL?
		- **GraphQL** is a **query language for APIs** and a **runtime for executing those queries**.
		- Provides a complete and understandable description of data in your API.
		- Clients can request exactly what they need, nothing more, nothing less.
		- Single endpoint architecture — all operations through one URL.
		- Strongly typed schema defines API capabilities and structure.
		- Enables powerful developer tools through introspection.
	-
	- ## GraphQL vs REST — Real-World Analogy
		- **REST API** — Like ordering from a fixed menu. You get predefined meals (endpoints) with set ingredients (fields). Want extra data? Order another meal (another request).
		- **GraphQL** — Like a custom buffet. You pick exactly what you want on your plate in one trip. Need more? Just ask for it in the same request.
		- ```graphql
		  # REST: Multiple requests for user profile page
		  GET /users/123              # Get user
		  GET /users/123/posts        # Get user's posts
		  GET /users/123/followers    # Get followers
		  GET /posts/456/comments     # Get comments for each post
		  # Result: 4+ HTTP requests, over-fetching data
		  
		  # GraphQL: Single request with exact data needed
		  query {
		    user(id: "123") {
		      name
		      email
		      posts(limit: 5) {
		        title
		        createdAt
		        comments(limit: 3) {
		          author
		          text
		        }
		      }
		      followers(limit: 10) {
		        name
		        avatar
		      }
		    }
		  }
		  # Result: 1 HTTP request, exact data needed
		  ```
	-
	- ## When to Use GraphQL
		- **Good Fit:**
			- Mobile applications with bandwidth constraints
			- Complex frontend requirements with nested data
			- Multiple clients (web, mobile, desktop) with different data needs
			- Rapid frontend development with evolving requirements
			- Microservices architecture with data aggregation needs
			- Real-time applications (chat, notifications, live updates)
			- Public APIs where clients need flexibility
			- Applications with complex data relationships
		- **Not Ideal For:**
			- Simple CRUD APIs with straightforward resources
			- File upload/download heavy applications
			- Applications requiring extensive HTTP caching
			- Teams unfamiliar with GraphQL (high learning curve)
			- Simple internal tools with fixed data requirements
			- Legacy systems with established REST patterns
	-
	- ## Real-World Example: Social Media Feed
		- ```graphql
		  # Traditional REST approach
		  GET /api/feed              # Returns posts with basic info
		  GET /api/users/1           # Get author details for post 1
		  GET /api/users/2           # Get author details for post 2
		  GET /api/posts/1/likes     # Get likes for post 1
		  GET /api/posts/2/likes     # Get likes for post 2
		  # Problem: N+1 queries, over-fetching, multiple round trips
		  
		  # GraphQL approach
		  query GetFeed {
		    feed(limit: 10) {
		      id
		      content
		      createdAt
		      author {
		        id
		        name
		        avatar
		        isVerified
		      }
		      likes {
		        count
		        viewerHasLiked
		      }
		      comments(limit: 3) {
		        id
		        text
		        author {
		          name
		          avatar
		        }
		      }
		      media {
		        type
		        url
		        thumbnail
		      }
		    }
		  }
		  # Result: Single request, exact data, no over-fetching
		  ```
	-
	- ## Advantages
		- **Precise Data Fetching** — Request exactly what you need, reducing bandwidth and improving performance.
		- **Single Endpoint** — All operations through one URL, simplifying API architecture.
		- **Strongly Typed Schema** — Type system provides validation, documentation, and tooling support.
		- **No Over/Under-Fetching** — Clients control response shape, eliminating wasted data transfer.
		- **Rapid Frontend Development** — Frontend teams can iterate without backend changes.
		- **Real-Time Capabilities** — Built-in subscription support for live data.
		- **Introspection** — APIs are self-documenting, enabling powerful developer tools.
		- **Versioning Not Required** — Schema evolution through field deprecation instead of versions.
		- **Aggregation Layer** — Can combine multiple data sources behind single schema.
		- **Better Developer Experience** — Auto-complete, type checking, and GraphQL Playground.
	-
	- ## Disadvantages
		- **Complexity** — Higher learning curve compared to REST, especially for simple APIs.
		- **Caching Challenges** — HTTP caching less effective due to POST requests and dynamic queries.
		- **Query Complexity** — Deeply nested queries can cause performance issues (N+1 problem).
		- **Security Concerns** — Requires query depth limiting, complexity analysis, and rate limiting.
		- **File Uploads** — Not natively supported, requires multipart spec or separate endpoint.
		- **Error Handling** — Partial errors can be confusing (200 OK with errors in response).
		- **Monitoring** — Harder to monitor than REST (all requests to same endpoint).
		- **Backend Complexity** — Resolvers, DataLoader, and optimization require careful implementation.
		- **Tooling Maturity** — While improving, REST has more mature ecosystem in some areas.
	-
	- ## GraphQL vs REST Comparison
		- ```
		  Feature              GraphQL                    REST
		  ─────────────────────────────────────────────────────────────────
		  Endpoints            Single endpoint            Multiple endpoints
		  Data Fetching        Client specifies fields    Server defines response
		  Over-fetching        No                         Common
		  Under-fetching       No                         Common (N+1 requests)
		  Versioning           Not needed                 Required (v1, v2)
		  Caching              Complex (needs work)       Simple (HTTP cache)
		  Real-time            Built-in (subscriptions)   Requires WebSocket/SSE
		  Type System          Strongly typed             Not enforced
		  Documentation        Auto-generated             Manual (OpenAPI)
		  Learning Curve       Steeper                    Gentler
		  File Upload          Complex                    Simple
		  HTTP Methods         POST (mostly)              GET, POST, PUT, DELETE
		  Error Handling       Partial errors possible    HTTP status codes
		  ```
-
- # Installation & Setup
  collapsed:: true
	- ## Node.js / JavaScript
		- ```bash
		  # Apollo Server (most popular)
		  npm install @apollo/server graphql
		  
		  # Express GraphQL
		  npm install express express-graphql graphql
		  
		  # GraphQL.js (reference implementation)
		  npm install graphql
		  
		  # Apollo Client (frontend)
		  npm install @apollo/client graphql
		  ```
	-
	- ## Python
		- ```bash
		  # Graphene (most popular)
		  pip install graphene
		  
		  # Strawberry (modern, type-hint based)
		  pip install strawberry-graphql
		  
		  # Ariadne (schema-first)
		  pip install ariadne
		  
		  # GraphQL-core (reference implementation)
		  pip install graphql-core
		  ```
	-
	- ## Other Languages
		- ```bash
		  # Java - GraphQL Java
		  # Add to pom.xml or build.gradle
		  
		  # C# - GraphQL for .NET
		  dotnet add package GraphQL
		  
		  # Go - gqlgen
		  go get github.com/99designs/gqlgen
		  
		  # Ruby - GraphQL Ruby
		  gem install graphql
		  
		  # PHP - GraphQL PHP
		  composer require webonyx/graphql-php
		  ```
	-
	- ## Quick Start Examples
		- :::code-tabs
		  ```javascript
		  // JavaScript - Apollo Server
		  const { ApolloServer } = require('@apollo/server');
		  const { startStandaloneServer } = require('@apollo/server/standalone');
		  
		  // Schema definition
		  const typeDefs = `
		    type Query {
		      hello: String
		      user(id: ID!): User
		    }
		    
		    type User {
		      id: ID!
		      name: String!
		      email: String!
		    }
		  `;
		  
		  // Resolvers
		  const resolvers = {
		    Query: {
		      hello: () => 'Hello, GraphQL!',
		      user: (parent, args) => ({
		        id: args.id,
		        name: 'Alice',
		        email: 'alice@example.com'
		      })
		    }
		  };
		  
		  // Create server
		  const server = new ApolloServer({ typeDefs, resolvers });
		  
		  // Start server
		  startStandaloneServer(server, { port: 4000 }).then(({ url }) => {
		    console.log(`Server ready at ${url}`);
		  });
		  ```
		  
		  ```python
		  # Python - Graphene with Flask
		  import graphene
		  from flask import Flask
		  from flask_graphql import GraphQLView
		  
		  # Define types
		  class User(graphene.ObjectType):
		      id = graphene.ID()
		      name = graphene.String()
		      email = graphene.String()
		  
		  # Define queries
		  class Query(graphene.ObjectType):
		      hello = graphene.String()
		      user = graphene.Field(User, id=graphene.ID(required=True))
		      
		      def resolve_hello(self, info):
		          return "Hello, GraphQL!"
		      
		      def resolve_user(self, info, id):
		          return User(id=id, name="Alice", email="alice@example.com")
		  
		  # Create schema
		  schema = graphene.Schema(query=Query)
		  
		  # Flask app
		  app = Flask(__name__)
		  app.add_url_rule('/graphql', view_func=GraphQLView.as_view(
		      'graphql',
		      schema=schema,
		      graphiql=True  # Enable GraphiQL interface
		  ))
		  
		  if __name__ == '__main__':
		      app.run(debug=True)
		  ```
		  
		  ```cpp
		  // C++ - cppgraphqlgen (Microsoft GraphQL implementation)
		  #include <graphqlservice/GraphQLService.h>
		  #include <graphqlservice/JSONResponse.h>
		  
		  using namespace graphql;
		  
		  // Define User type
		  struct User {
		      std::string id;
		      std::string name;
		      std::string email;
		  };
		  
		  // Query resolver
		  class Query : public object::Query {
		  public:
		      std::string getHello() const {
		          return "Hello, GraphQL!";
		      }
		      
		      std::shared_ptr<User> getUser(std::string id) const {
		          auto user = std::make_shared<User>();
		          user->id = id;
		          user->name = "Alice";
		          user->email = "alice@example.com";
		          return user;
		      }
		  };
		  
		  // Schema definition
		  const char* schema = R"(
		      type Query {
		          hello: String
		          user(id: ID!): User
		      }
		      
		      type User {
		          id: ID!
		          name: String!
		          email: String!
		      }
		  )";
		  
		  int main() {
		      auto query = std::make_shared<Query>();
		      auto service = std::make_shared<service::Request>(
		          parseSchemaString(schema),
		          query
		      );
		      
		      // Execute query
		      auto result = service->resolve(R"({ hello })");
		      std::cout << response::toJSON(result) << std::endl;
		      
		      return 0;
		  }
		  ```
		  :::
-
- # Core Concepts
  collapsed:: true
	- ## Schema Definition Language (SDL)
		- GraphQL schemas are written in SDL — a human-readable syntax.
		- Defines types, fields, relationships, and operations.
		- Acts as a contract between client and server.
		- ```graphql
		  # Basic type definition
		  type User {
		    id: ID!           # ! means non-nullable (required)
		    name: String!
		    email: String
		    age: Int
		    isActive: Boolean!
		  }
		  
		  # Type with relationships
		  type Post {
		    id: ID!
		    title: String!
		    content: String!
		    author: User!     # Relationship to User
		    comments: [Comment!]!  # Array of Comments
		    tags: [String!]!  # Array of strings
		  }
		  
		  type Comment {
		    id: ID!
		    text: String!
		    author: User!
		    post: Post!
		  }
		  ```
	-
	- ## Scalar Types
		- Built-in scalar types represent primitive values.
		- **Why scalars matter**: They define the leaf values in your GraphQL tree. Every field eventually resolves to a scalar.
		- **Think of scalars as**: The basic building blocks — like atoms in chemistry. Everything complex is built from these simple types.
		- ```graphql
		  type Example {
		    # Built-in scalars
		    id: ID              # Unique identifier (serialized as String)
		                        # Use for: database IDs, unique keys
		                        # Example: "user-123", "507f1f77bcf86cd799439011"
		    
		    name: String        # UTF-8 character sequence
		                        # Use for: text, names, descriptions
		                        # Example: "Alice Johnson", "Hello World"
		    
		    age: Int            # Signed 32-bit integer (-2,147,483,648 to 2,147,483,647)
		                        # Use for: counts, ages, quantities
		                        # Example: 25, 100, -5
		    
		    price: Float        # Signed double-precision floating-point
		                        # Use for: prices, percentages, measurements
		                        # Example: 99.99, 3.14159, -0.5
		    
		    isActive: Boolean   # true or false
		                        # Use for: flags, toggles, yes/no questions
		                        # Example: true, false
		    
		    # Custom scalars (must be implemented)
		    date: Date          # Custom date scalar (YYYY-MM-DD)
		    datetime: DateTime  # Custom datetime scalar (ISO 8601)
		    email: Email        # Custom email validation scalar
		    url: URL            # Custom URL scalar
		    json: JSON          # Custom JSON scalar (any valid JSON)
		  }
		  
		  # Custom scalar definition
		  scalar Date
		  scalar DateTime
		  scalar Email
		  scalar JSON
		  
		  # Real-world example: Why custom scalars?
		  # Without custom scalar:
		  type User {
		    email: String  # Could be "not-an-email" — no validation!
		  }
		  
		  # With custom scalar:
		  type User {
		    email: Email  # Automatically validates email format
		  }
		  # Server rejects invalid emails before reaching your resolver
		  ```
	-
	- ## Object Types
		- Core building blocks of GraphQL schema.
		- Represent entities with fields.
		- ```graphql
		  type User {
		    id: ID!
		    username: String!
		    email: String!
		    profile: Profile
		    posts: [Post!]!
		    followers: [User!]!
		    createdAt: DateTime!
		  }
		  
		  type Profile {
		    bio: String
		    avatar: String
		    website: URL
		    location: String
		  }
		  
		  # Real-world example: E-commerce product
		  type Product {
		    id: ID!
		    sku: String!
		    name: String!
		    description: String
		    price: Float!
		    currency: String!
		    category: Category!
		    images: [Image!]!
		    variants: [ProductVariant!]!
		    reviews: [Review!]!
		    averageRating: Float
		    stock: Int!
		    isAvailable: Boolean!
		    createdAt: DateTime!
		    updatedAt: DateTime!
		  }
		  
		  type Category {
		    id: ID!
		    name: String!
		    slug: String!
		    products: [Product!]!
		  }
		  
		  type Image {
		    url: String!
		    alt: String
		    width: Int
		    height: Int
		  }
		  
		  type ProductVariant {
		    id: ID!
		    name: String!
		    price: Float!
		    stock: Int!
		    attributes: JSON
		  }
		  
		  type Review {
		    id: ID!
		    rating: Int!
		    title: String
		    comment: String
		    author: User!
		    createdAt: DateTime!
		  }
		  ```
	-
	- ## Query Type (Read Operations)
		- Entry point for reading data.
		- Every GraphQL schema must have a Query type.
		- ```graphql
		  type Query {
		    # Get single item
		    user(id: ID!): User
		    post(id: ID!): Post
		    product(id: ID!): Product
		    
		    # Get lists
		    users: [User!]!
		    posts(limit: Int, offset: Int): [Post!]!
		    products(category: String, minPrice: Float, maxPrice: Float): [Product!]!
		    
		    # Search
		    searchUsers(query: String!): [User!]!
		    searchProducts(query: String!, filters: ProductFilters): [Product!]!
		    
		    # Current user (authentication)
		    me: User
		    
		    # Aggregations
		    userCount: Int!
		    productStats: ProductStats!
		  }
		  
		  input ProductFilters {
		    category: String
		    minPrice: Float
		    maxPrice: Float
		    inStock: Boolean
		  }
		  
		  type ProductStats {
		    total: Int!
		    averagePrice: Float!
		    categories: [CategoryCount!]!
		  }
		  
		  type CategoryCount {
		    category: String!
		    count: Int!
		  }
		  ```
	-
	- ## Mutation Type (Write Operations)
		- Entry point for creating, updating, deleting data.
		- ```graphql
		  type Mutation {
		    # Create
		    createUser(input: CreateUserInput!): User!
		    createPost(input: CreatePostInput!): Post!
		    
		    # Update
		    updateUser(id: ID!, input: UpdateUserInput!): User!
		    updatePost(id: ID!, input: UpdatePostInput!): Post!
		    
		    # Delete
		    deleteUser(id: ID!): Boolean!
		    deletePost(id: ID!): Boolean!
		    
		    # Authentication
		    login(email: String!, password: String!): AuthPayload!
		    logout: Boolean!
		    register(input: RegisterInput!): AuthPayload!
		    
		    # Complex operations
		    likePost(postId: ID!): Post!
		    followUser(userId: ID!): User!
		    addComment(postId: ID!, text: String!): Comment!
		  }
		  
		  input CreateUserInput {
		    username: String!
		    email: String!
		    password: String!
		    profile: ProfileInput
		  }
		  
		  input UpdateUserInput {
		    username: String
		    email: String
		    profile: ProfileInput
		  }
		  
		  input ProfileInput {
		    bio: String
		    avatar: String
		    website: String
		  }
		  
		  input CreatePostInput {
		    title: String!
		    content: String!
		    tags: [String!]
		  }
		  
		  input UpdatePostInput {
		    title: String
		    content: String
		    tags: [String!]
		  }
		  
		  input RegisterInput {
		    username: String!
		    email: String!
		    password: String!
		  }
		  
		  type AuthPayload {
		    token: String!
		    user: User!
		  }
		  ```
	-
	- ## Subscription Type (Real-Time)
		- Entry point for real-time data updates.
		- Clients subscribe to events and receive updates when data changes.
		- ```graphql
		  type Subscription {
		    # New items
		    postCreated: Post!
		    userRegistered: User!
		    
		    # Updates
		    postUpdated(postId: ID!): Post!
		    userStatusChanged(userId: ID!): User!
		    
		    # Real-time notifications
		    notificationReceived: Notification!
		    messageReceived(chatId: ID!): Message!
		    
		    # Live data
		    stockPriceUpdated(symbol: String!): StockPrice!
		    orderStatusChanged(orderId: ID!): Order!
		  }
		  
		  type Notification {
		    id: ID!
		    type: String!
		    message: String!
		    createdAt: DateTime!
		  }
		  
		  type Message {
		    id: ID!
		    text: String!
		    author: User!
		    chatId: ID!
		    createdAt: DateTime!
		  }
		  
		  type StockPrice {
		    symbol: String!
		    price: Float!
		    change: Float!
		    timestamp: DateTime!
		  }
		  ```
	-
	- ## Enums
		- Represent a fixed set of possible values.
		- **Why use enums**: Type safety, auto-complete, and prevent invalid values.
		- **Think of enums as**: A multiple-choice question with predefined answers. You can't choose an answer that's not on the list.
		- **Enums vs Strings**: Enums catch typos at query time, strings don't.
		- ```graphql
		  enum UserRole {
		    ADMIN       # Full system access
		    MODERATOR   # Can moderate content
		    USER        # Standard user
		    GUEST       # Limited access
		  }
		  
		  enum OrderStatus {
		    PENDING     # Order placed, not yet processed
		    PROCESSING  # Being prepared
		    SHIPPED     # On the way
		    DELIVERED   # Completed
		    CANCELLED   # Cancelled by user or system
		  }
		  
		  enum PostVisibility {
		    PUBLIC        # Everyone can see
		    PRIVATE       # Only author can see
		    FRIENDS_ONLY  # Only friends can see
		  }
		  
		  type User {
		    id: ID!
		    name: String!
		    role: UserRole!  # Must be one of: ADMIN, MODERATOR, USER, GUEST
		  }
		  
		  type Order {
		    id: ID!
		    status: OrderStatus!  # Must be valid OrderStatus
		    total: Float!
		  }
		  
		  # Why enums are better than strings:
		  # ❌ With String:
		  query {
		    updateOrder(status: "SHIPPD") {  # Typo! Server accepts it
		      id
		    }
		  }
		  
		  # ✅ With Enum:
		  query {
		    updateOrder(status: SHIPPD) {  # Error! Not a valid OrderStatus
		      id                            # GraphQL catches this before execution
		    }
		  }
		  
		  # Enums also enable auto-complete in GraphQL clients
		  ```
	-
	- ## Interfaces
		- Abstract types that define common fields.
		- Types can implement interfaces.
		- **Why interfaces**: Share common fields across multiple types without duplication.
		- **Think of interfaces as**: A contract or blueprint. Any type implementing it must have these fields.
		- **Real-world analogy**: Like a "Vehicle" interface — cars, bikes, trucks all have wheels and engines, but each has unique features too.
		- ```graphql
		  interface Node {
		    id: ID!
		    createdAt: DateTime!
		    updatedAt: DateTime!
		  }
		  
		  type User implements Node {
		    id: ID!
		    createdAt: DateTime!
		    updatedAt: DateTime!
		    name: String!
		    email: String!
		  }
		  
		  type Post implements Node {
		    id: ID!
		    createdAt: DateTime!
		    updatedAt: DateTime!
		    title: String!
		    content: String!
		  }
		  
		  # Real-world example: Search results
		  interface SearchResult {
		    id: ID!
		    title: String!
		    relevance: Float!
		  }
		  
		  type ProductResult implements SearchResult {
		    id: ID!
		    title: String!
		    relevance: Float!
		    price: Float!
		    image: String!
		  }
		  
		  type ArticleResult implements SearchResult {
		    id: ID!
		    title: String!
		    relevance: Float!
		    excerpt: String!
		    author: User!
		  }
		  
		  type UserResult implements SearchResult {
		    id: ID!
		    title: String!  # username
		    relevance: Float!
		    avatar: String!
		    bio: String
		  }
		  ```
	-
	- ## Union Types
		- Represent one of several possible types.
		- Useful for heterogeneous collections.
		- **Why unions**: When a field can return different types (like search results).
		- **Think of unions as**: A box that can contain different things. You don't know what's inside until you open it.
		- **Unions vs Interfaces**: Unions don't require shared fields. Types can be completely different.
		- **Real-world analogy**: Search results can be users, posts, or products — all different types in one list.
		- ```graphql
		  union SearchResult = User | Post | Product | Article
		  
		  type Query {
		    search(query: String!): [SearchResult!]!
		  }
		  
		  # Real-world example: Activity feed
		  union FeedItem = Post | Comment | Like | Share
		  
		  type Post {
		    id: ID!
		    content: String!
		    author: User!
		  }
		  
		  type Comment {
		    id: ID!
		    text: String!
		    author: User!
		    post: Post!
		  }
		  
		  type Like {
		    id: ID!
		    user: User!
		    target: Post!
		  }
		  
		  type Share {
		    id: ID!
		    user: User!
		    post: Post!
		  }
		  
		  type Query {
		    feed: [FeedItem!]!
		  }
		  ```
	-
	- ## Input Types
		- Special types for mutation arguments.
		- Cannot have fields that are other object types (only scalars, enums, other inputs).
		- **Why input types**: Group related arguments, make mutations cleaner and more maintainable.
		- **Think of input types as**: A form you fill out. All related information grouped together.
		- **Input vs Object types**: Inputs are for sending data TO the server. Objects are for receiving data FROM the server.
		- **Key difference**: Input types can't have resolvers or circular references.
		- ```graphql
		  input CreateUserInput {
		    username: String!
		    email: String!
		    password: String!
		    profile: ProfileInput
		  }
		  
		  input ProfileInput {
		    bio: String
		    avatar: String
		    website: String
		    location: String
		  }
		  
		  input UpdateUserInput {
		    username: String
		    email: String
		    profile: ProfileInput
		  }
		  
		  type Mutation {
		    createUser(input: CreateUserInput!): User!
		    updateUser(id: ID!, input: UpdateUserInput!): User!
		  }
		  
		  # Real-world example: Product filters
		  input ProductFilterInput {
		    category: String
		    minPrice: Float
		    maxPrice: Float
		    inStock: Boolean
		    tags: [String!]
		    sortBy: ProductSortField
		    sortOrder: SortOrder
		  }
		  
		  enum ProductSortField {
		    PRICE
		    NAME
		    CREATED_AT
		    POPULARITY
		  }
		  
		  enum SortOrder {
		    ASC
		    DESC
		  }
		  
		  type Query {
		    products(filter: ProductFilterInput, limit: Int, offset: Int): [Product!]!
		  }
		  ```
	-
	- ## Directives
		- Modify execution behavior of queries and schemas.
		- **Why directives**: Add metadata and control flow without changing schema structure.
		- **Think of directives as**: Annotations or decorators that change how fields behave.
		- **Common use cases**: Conditional fields, authentication, caching, rate limiting, deprecation.
		- ```graphql
		  # Built-in directives
		  
		  # @include - Include field if condition is true
		  query GetUser($withEmail: Boolean!) {
		    user(id: "123") {
		      name
		      email @include(if: $withEmail)
		    }
		  }
		  
		  # @skip - Skip field if condition is true
		  query GetUser($skipEmail: Boolean!) {
		    user(id: "123") {
		      name
		      email @skip(if: $skipEmail)
		    }
		  }
		  
		  # @deprecated - Mark field as deprecated
		  type User {
		    id: ID!
		    name: String!
		    username: String! @deprecated(reason: "Use 'name' instead")
		    oldEmail: String @deprecated(reason: "Use 'email' field")
		  }
		  
		  # Custom directives (schema definition)
		  directive @auth(requires: UserRole!) on FIELD_DEFINITION
		  directive @rateLimit(limit: Int!, duration: Int!) on FIELD_DEFINITION
		  directive @cacheControl(maxAge: Int!) on FIELD_DEFINITION | OBJECT
		  
		  type Query {
		    users: [User!]! @auth(requires: ADMIN)
		    me: User @auth(requires: USER)
		    publicPosts: [Post!]! @cacheControl(maxAge: 3600)
		    searchUsers(query: String!): [User!]! @rateLimit(limit: 10, duration: 60)
		  }
		  ```
-
- # Queries
  collapsed:: true
	- ## Basic Query
		- ```graphql
		  # Simple query
		  query {
		    hello
		  }
		  
		  # Query with field selection
		  query {
		    user(id: "123") {
		      id
		      name
		      email
		    }
		  }
		  
		  # Named query (recommended)
		  query GetUser {
		    user(id: "123") {
		      id
		      name
		      email
		    }
		  }
		  ```
	-
	- ## Query with Arguments
		- ```graphql
		  query {
		    user(id: "123") {
		      name
		    }
		    
		    posts(limit: 10, offset: 0) {
		      title
		      content
		    }
		    
		    products(
		      category: "Electronics"
		      minPrice: 100
		      maxPrice: 1000
		      inStock: true
		    ) {
		      name
		      price
		    }
		  }
		  ```
	-
	- ## Nested Queries
		- ```graphql
		  query {
		    user(id: "123") {
		      id
		      name
		      posts {
		        id
		        title
		        comments {
		          id
		          text
		          author {
		            name
		            avatar
		          }
		        }
		      }
		      followers {
		        id
		        name
		      }
		    }
		  }
		  
		  # Real-world example: E-commerce order details
		  query GetOrder {
		    order(id: "ORD-123") {
		      id
		      orderNumber
		      status
		      total
		      customer {
		        id
		        name
		        email
		      }
		      items {
		        id
		        quantity
		        price
		        product {
		          id
		          name
		          image
		        }
		      }
		      shippingAddress {
		        street
		        city
		        country
		        postalCode
		      }
		      payment {
		        method
		        status
		        transactionId
		      }
		    }
		  }
		  ```
	-
	- ## Query with Variables
		- ```graphql
		  # Query definition with variables
		  query GetUser($userId: ID!, $includeEmail: Boolean!) {
		    user(id: $userId) {
		      id
		      name
		      email @include(if: $includeEmail)
		    }
		  }
		  
		  # Variables (sent separately)
		  {
		    "userId": "123",
		    "includeEmail": true
		  }
		  
		  # Real-world example: Paginated product list
		  query GetProducts(
		    $category: String
		    $minPrice: Float
		    $maxPrice: Float
		    $limit: Int = 20
		    $offset: Int = 0
		    $sortBy: ProductSortField = CREATED_AT
		    $sortOrder: SortOrder = DESC
		  ) {
		    products(
		      filter: {
		        category: $category
		        minPrice: $minPrice
		        maxPrice: $maxPrice
		      }
		      limit: $limit
		      offset: $offset
		      sortBy: $sortBy
		      sortOrder: $sortOrder
		    ) {
		      id
		      name
		      price
		      image
		      rating
		    }
		    
		    productCount(filter: {
		      category: $category
		      minPrice: $minPrice
		      maxPrice: $maxPrice
		    })
		  }
		  
		  # Variables
		  {
		    "category": "Electronics",
		    "minPrice": 100,
		    "maxPrice": 1000,
		    "limit": 20,
		    "offset": 0
		  }
		  ```
	-
	- ## Aliases
		- Rename fields in response to avoid conflicts.
		- **Why aliases**: Query the same field multiple times with different arguments.
		- **Think of aliases as**: Nicknames for fields in the response.
		- **Real-world use case**: Fetch cheap and expensive products in one query, or compare data from different time periods.
		- ```graphql
		  query {
		    # Fetch same field with different arguments
		    cheapProducts: products(maxPrice: 50) {
		      name
		      price
		    }
		    
		    expensiveProducts: products(minPrice: 1000) {
		      name
		      price
		    }
		    
		    # Multiple users
		    alice: user(id: "1") {
		      name
		      email
		    }
		    
		    bob: user(id: "2") {
		      name
		      email
		    }
		  }
		  
		  # Response
		  {
		    "data": {
		      "cheapProducts": [...],
		      "expensiveProducts": [...],
		      "alice": { "name": "Alice", "email": "alice@example.com" },
		      "bob": { "name": "Bob", "email": "bob@example.com" }
		    }
		  }
		  ```
	-
	- ## Fragments
		- Reusable units of fields.
		- Reduce duplication in queries.
		- **Why fragments**: DRY (Don't Repeat Yourself) principle for GraphQL queries.
		- **Think of fragments as**: Reusable templates or snippets. Define once, use everywhere.
		- **Benefits**: Easier maintenance, consistency, smaller query size.
		- **Two types**: Named fragments (reusable) and inline fragments (for unions/interfaces).
		- ```graphql
		  # Define fragment
		  fragment UserFields on User {
		    id
		    name
		    email
		    avatar
		  }
		  
		  # Use fragment
		  query {
		    user(id: "123") {
		      ...UserFields
		      posts {
		        title
		      }
		    }
		    
		    me {
		      ...UserFields
		      followers {
		        ...UserFields
		      }
		    }
		  }
		  
		  # Inline fragments (for unions/interfaces)
		  query {
		    search(query: "graphql") {
		      ... on User {
		        name
		        email
		      }
		      ... on Post {
		        title
		        content
		      }
		      ... on Product {
		        name
		        price
		      }
		    }
		  }
		  
		  # Real-world example: Social feed
		  fragment PostFields on Post {
		    id
		    content
		    createdAt
		    author {
		      ...UserFields
		    }
		    likes {
		      count
		      viewerHasLiked
		    }
		  }
		  
		  fragment UserFields on User {
		    id
		    name
		    avatar
		    isVerified
		  }
		  
		  query GetFeed {
		    feed {
		      ... on Post {
		        ...PostFields
		      }
		      ... on Comment {
		        id
		        text
		        author {
		          ...UserFields
		        }
		        post {
		          ...PostFields
		        }
		      }
		      ... on Like {
		        id
		        user {
		          ...UserFields
		        }
		      }
		    }
		  }
		  ```
	-
	- ## Multiple Operations
		- ```graphql
		  # Multiple queries in one document
		  query GetUser {
		    user(id: "123") {
		      name
		    }
		  }
		  
		  query GetPosts {
		    posts {
		      title
		    }
		  }
		  
		  # Execute specific operation
		  # Send operationName: "GetUser" with request
		  ```
-
- # Mutations
  collapsed:: true
	- ## Basic Mutation
		- ```graphql
		  mutation {
		    createUser(
		      username: "alice"
		      email: "alice@example.com"
		      password: "secret123"
		    ) {
		      id
		      username
		      email
		      createdAt
		    }
		  }
		  
		  # Named mutation (recommended)
		  mutation CreateUser {
		    createUser(
		      username: "alice"
		      email: "alice@example.com"
		      password: "secret123"
		    ) {
		      id
		      username
		      email
		    }
		  }
		  ```
	-
	- ## Mutation with Input Types
		- ```graphql
		  mutation CreateUser($input: CreateUserInput!) {
		    createUser(input: $input) {
		      id
		      username
		      email
		      profile {
		        bio
		        avatar
		      }
		      createdAt
		    }
		  }
		  
		  # Variables
		  {
		    "input": {
		      "username": "alice",
		      "email": "alice@example.com",
		      "password": "secret123",
		      "profile": {
		        "bio": "Software developer",
		        "avatar": "https://example.com/avatar.jpg"
		      }
		    }
		  }
		  ```
	-
	- ## Update Mutation
		- ```graphql
		  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
		    updateUser(id: $id, input: $input) {
		      id
		      username
		      email
		      profile {
		        bio
		        website
		      }
		      updatedAt
		    }
		  }
		  
		  # Variables
		  {
		    "id": "123",
		    "input": {
		      "profile": {
		        "bio": "Senior Software Engineer",
		        "website": "https://alice.dev"
		      }
		    }
		  }
		  ```
	-
	- ## Delete Mutation
		- ```graphql
		  mutation DeleteUser($id: ID!) {
		    deleteUser(id: $id)
		  }
		  
		  # Or return deleted object
		  mutation DeletePost($id: ID!) {
		    deletePost(id: $id) {
		      id
		      title
		      deletedAt
		    }
		  }
		  ```
	-
	- ## Multiple Mutations
		- ```graphql
		  # Mutations execute sequentially (not parallel)
		  mutation {
		    first: createPost(input: { title: "First Post", content: "..." }) {
		      id
		    }
		    
		    second: createPost(input: { title: "Second Post", content: "..." }) {
		      id
		    }
		    
		    third: createPost(input: { title: "Third Post", content: "..." }) {
		      id
		    }
		  }
		  # Executes in order: first, then second, then third
		  ```
	-
	- ## Real-World Mutation Examples
		- ```graphql
		  # User registration
		  mutation Register($input: RegisterInput!) {
		    register(input: $input) {
		      token
		      user {
		        id
		        username
		        email
		      }
		    }
		  }
		  
		  # Login
		  mutation Login($email: String!, $password: String!) {
		    login(email: $email, password: $password) {
		      token
		      refreshToken
		      expiresAt
		      user {
		        id
		        username
		        role
		      }
		    }
		  }
		  
		  # Create post with tags
		  mutation CreatePost($input: CreatePostInput!) {
		    createPost(input: $input) {
		      id
		      title
		      content
		      tags
		      author {
		        id
		        name
		      }
		      createdAt
		    }
		  }
		  
		  # Like post
		  mutation LikePost($postId: ID!) {
		    likePost(postId: $postId) {
		      id
		      likes {
		        count
		        viewerHasLiked
		      }
		    }
		  }
		  
		  # Add comment
		  mutation AddComment($postId: ID!, $text: String!) {
		    addComment(postId: $postId, text: $text) {
		      id
		      text
		      author {
		        name
		        avatar
		      }
		      createdAt
		    }
		  }
		  
		  # Place order
		  mutation PlaceOrder($input: PlaceOrderInput!) {
		    placeOrder(input: $input) {
		      id
		      orderNumber
		      status
		      total
		      items {
		        product {
		          name
		        }
		        quantity
		        price
		      }
		      estimatedDelivery
		    }
		  }
		  ```
-
- # Subscriptions
  collapsed:: true
	- ## Basic Subscription
		- ```graphql
		  subscription {
		    postCreated {
		      id
		      title
		      author {
		        name
		      }
		    }
		  }
		  ```
	-
	- ## Subscription with Arguments
		- ```graphql
		  subscription OnMessageReceived($chatId: ID!) {
		    messageReceived(chatId: $chatId) {
		      id
		      text
		      author {
		        id
		        name
		        avatar
		      }
		      createdAt
		    }
		  }
		  
		  # Variables
		  {
		    "chatId": "chat-123"
		  }
		  ```
	-
	- ## Real-World Subscription Examples
		- ```graphql
		  # Real-time notifications
		  subscription OnNotification {
		    notificationReceived {
		      id
		      type
		      message
		      data
		      createdAt
		      read
		    }
		  }
		  
		  # Live chat messages
		  subscription OnChatMessage($chatId: ID!) {
		    messageReceived(chatId: $chatId) {
		      id
		      text
		      author {
		        id
		        name
		        avatar
		        isOnline
		      }
		      createdAt
		    }
		  }
		  
		  # Order status updates
		  subscription OnOrderUpdate($orderId: ID!) {
		    orderStatusChanged(orderId: $orderId) {
		      id
		      status
		      statusMessage
		      updatedAt
		    }
		  }
		  
		  # Stock price updates
		  subscription OnStockPrice($symbol: String!) {
		    stockPriceUpdated(symbol: $symbol) {
		      symbol
		      price
		      change
		      changePercent
		      timestamp
		    }
		  }
		  
		  # User presence
		  subscription OnUserStatus($userId: ID!) {
		    userStatusChanged(userId: $userId) {
		      id
		      isOnline
		      lastSeen
		    }
		  }
		  ```
	-
	- ## Subscription Implementation (Server)
		- ```javascript
		  // Apollo Server with subscriptions
		  const { ApolloServer } = require('@apollo/server');
		  const { createServer } = require('http');
		  const { WebSocketServer } = require('ws');
		  const { useServer } = require('graphql-ws/lib/use/ws');
		  const { PubSub } = require('graphql-subscriptions');
		  
		  const pubsub = new PubSub();
		  
		  const typeDefs = `
		    type Message {
		      id: ID!
		      text: String!
		      author: String!
		    }
		    
		    type Query {
		      messages: [Message!]!
		    }
		    
		    type Mutation {
		      sendMessage(text: String!, author: String!): Message!
		    }
		    
		    type Subscription {
		      messageReceived: Message!
		    }
		  `;
		  
		  const resolvers = {
		    Query: {
		      messages: () => messages
		    },
		    Mutation: {
		      sendMessage: (_, { text, author }) => {
		        const message = { id: Date.now().toString(), text, author };
		        messages.push(message);
		        pubsub.publish('MESSAGE_RECEIVED', { messageReceived: message });
		        return message;
		      }
		    },
		    Subscription: {
		      messageReceived: {
		        subscribe: () => pubsub.asyncIterator(['MESSAGE_RECEIVED'])
		      }
		    }
		  };
		  
		  // Setup WebSocket server for subscriptions
		  const httpServer = createServer();
		  const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' });
		  useServer({ schema }, wsServer);
		  ```
	-
	- ## Subscription Client (JavaScript)
		- ```javascript
		  import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
		  import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
		  import { getMainDefinition } from '@apollo/client/utilities';
		  import { createClient } from 'graphql-ws';
		  
		  // HTTP link for queries and mutations
		  const httpLink = new HttpLink({
		    uri: 'http://localhost:4000/graphql'
		  });
		  
		  // WebSocket link for subscriptions
		  const wsLink = new GraphQLWsLink(createClient({
		    url: 'ws://localhost:4000/graphql'
		  }));
		  
		  // Split based on operation type
		  const splitLink = split(
		    ({ query }) => {
		      const definition = getMainDefinition(query);
		      return (
		        definition.kind === 'OperationDefinition' &&
		        definition.operation === 'subscription'
		      );
		    },
		    wsLink,
		    httpLink
		  );
		  
		  const client = new ApolloClient({
		    link: splitLink,
		    cache: new InMemoryCache()
		  });
		  
		  // Use subscription
		  client.subscribe({
		    query: gql`
		      subscription {
		        messageReceived {
		          id
		          text
		          author
		        }
		      }
		    `
		  }).subscribe({
		    next: ({ data }) => {
		      console.log('New message:', data.messageReceived);
		    },
		    error: (error) => {
		      console.error('Subscription error:', error);
		    }
		  });
		  ```
-
- # Resolvers
  collapsed:: true
	- ## What are Resolvers?
		- Functions that resolve a value for a type or field in schema.
		- Connect schema to data sources (databases, APIs, etc.).
		- Execute for each field in a query.
		- **Why resolvers**: The schema defines WHAT data is available. Resolvers define HOW to get that data.
		- **Think of resolvers as**: The implementation behind the interface. Schema is the menu, resolvers are the kitchen.
		- **Key concept**: Each field can have its own resolver. GraphQL calls them as needed.
		- ```javascript
		  // Resolver signature (4 parameters)
		  fieldName: (parent, args, context, info) => {
		    // parent: Result from parent resolver (previous level in query tree)
		    //         Example: When resolving user.posts, parent is the user object
		    
		    // args: Arguments passed to this field in the query
		    //       Example: { id: "123", limit: 10 }
		    
		    // context: Shared object across ALL resolvers in this request
		    //          Example: { user, db, dataSources, req, res }
		    //          Use for: authentication, database connections, caching
		    
		    // info: Metadata about the query execution
		    //       Example: field name, parent type, query AST
		    //       Rarely used in practice
		    
		    return value;  // Can be a value, Promise, or throw an error
		  }
		  
		  // Real-world example with all 4 parameters:
		  const resolvers = {
		    User: {
		      posts: async (parent, args, context, info) => {
		        // parent = { id: "123", name: "Alice", ... }
		        // args = { limit: 10, offset: 0 }
		        // context = { db, user, loaders }
		        // info = { fieldName: "posts", ... }
		        
		        console.log(`Fetching posts for user ${parent.id}`);
		        console.log(`Limit: ${args.limit}, Offset: ${args.offset}`);
		        console.log(`Requested by: ${context.user?.name}`);
		        
		        return await context.db.posts.findByAuthorId(parent.id, {
		          limit: args.limit,
		          offset: args.offset
		        });
		      }
		    }
		  };
		  ```
	-
	- ## Basic Resolvers
		- :::code-tabs
		  ```javascript
		  // JavaScript - Basic resolvers
		  const resolvers = {
		    Query: {
		      hello: () => 'Hello, GraphQL!',
		      
		      user: (parent, args, context) => {
		        return context.db.users.findById(args.id);
		      },
		      
		      users: (parent, args, context) => {
		        return context.db.users.findAll();
		      }
		    },
		    
		    Mutation: {
		      createUser: (parent, args, context) => {
		        const user = context.db.users.create(args.input);
		        return user;
		      },
		      
		      updateUser: (parent, args, context) => {
		        return context.db.users.update(args.id, args.input);
		      },
		      
		      deleteUser: (parent, args, context) => {
		        return context.db.users.delete(args.id);
		      }
		    },
		    
		    User: {
		      // Field resolver for computed field
		      fullName: (parent) => {
		        return `${parent.firstName} ${parent.lastName}`;
		      },
		      
		      // Resolve relationship
		      posts: (parent, args, context) => {
		        return context.db.posts.findByAuthorId(parent.id);
		      }
		    }
		  };
		  ```
		  
		  ```python
		  # Python - Graphene resolvers
		  import graphene
		  
		  class User(graphene.ObjectType):
		      id = graphene.ID()
		      first_name = graphene.String()
		      last_name = graphene.String()
		      full_name = graphene.String()
		      posts = graphene.List(lambda: Post)
		      
		      def resolve_full_name(self, info):
		          return f"{self.first_name} {self.last_name}"
		      
		      def resolve_posts(self, info):
		          return info.context.db.posts.find_by_author_id(self.id)
		  
		  class Query(graphene.ObjectType):
		      hello = graphene.String()
		      user = graphene.Field(User, id=graphene.ID(required=True))
		      users = graphene.List(User)
		      
		      def resolve_hello(self, info):
		          return "Hello, GraphQL!"
		      
		      def resolve_user(self, info, id):
		          return info.context.db.users.find_by_id(id)
		      
		      def resolve_users(self, info):
		          return info.context.db.users.find_all()
		  
		  class CreateUserInput(graphene.InputObjectType):
		      username = graphene.String(required=True)
		      email = graphene.String(required=True)
		  
		  class Mutation(graphene.ObjectType):
		      create_user = graphene.Field(User, input=CreateUserInput(required=True))
		      update_user = graphene.Field(User, id=graphene.ID(required=True), input=CreateUserInput(required=True))
		      delete_user = graphene.Boolean(id=graphene.ID(required=True))
		      
		      def resolve_create_user(self, info, input):
		          return info.context.db.users.create(input)
		      
		      def resolve_update_user(self, info, id, input):
		          return info.context.db.users.update(id, input)
		      
		      def resolve_delete_user(self, info, id):
		          return info.context.db.users.delete(id)
		  
		  schema = graphene.Schema(query=Query, mutation=Mutation)
		  ```
		  
		  ```cpp
		  // C++ - cppgraphqlgen resolvers
		  #include <graphqlservice/GraphQLService.h>
		  
		  class UserObject : public object::User {
		  private:
		      std::string m_id;
		      std::string m_firstName;
		      std::string m_lastName;
		      
		  public:
		      UserObject(std::string id, std::string firstName, std::string lastName)
		          : m_id(std::move(id))
		          , m_firstName(std::move(firstName))
		          , m_lastName(std::move(lastName)) {}
		      
		      // Field resolvers
		      std::string getId() const override {
		          return m_id;
		      }
		      
		      std::string getFirstName() const override {
		          return m_firstName;
		      }
		      
		      std::string getLastName() const override {
		          return m_lastName;
		      }
		      
		      // Computed field
		      std::string getFullName() const override {
		          return m_firstName + " " + m_lastName;
		      }
		      
		      // Relationship resolver
		      std::vector<std::shared_ptr<Post>> getPosts(
		          const service::FieldParams& params) const override {
		          auto& db = params.state.get<Database>();
		          return db.posts.findByAuthorId(m_id);
		      }
		  };
		  
		  class QueryObject : public object::Query {
		  public:
		      std::string getHello() const override {
		          return "Hello, GraphQL!";
		      }
		      
		      std::shared_ptr<UserObject> getUser(
		          service::FieldParams&& params,
		          std::string&& id) const override {
		          auto& db = params.state.get<Database>();
		          return db.users.findById(id);
		      }
		      
		      std::vector<std::shared_ptr<UserObject>> getUsers(
		          service::FieldParams&& params) const override {
		          auto& db = params.state.get<Database>();
		          return db.users.findAll();
		      }
		  };
		  ```
		  :::
	-
	- ## Resolver Chain
		- Resolvers execute in a chain from parent to child.
		- **Why this matters**: Understanding the chain helps you optimize queries and avoid N+1 problems.
		- **Think of it as**: A waterfall — data flows from top to bottom, each level using results from above.
		- **Execution order**: Breadth-first for queries (parallel), depth-first for mutations (sequential).
		- ```javascript
		  // Query
		  query {
		    user(id: "123") {
		      name
		      posts {
		        title
		        comments {
		          text
		        }
		      }
		    }
		  }
		  
		  // Resolver execution order
		  const resolvers = {
		    Query: {
		      user: (parent, args) => {
		        // 1. Executes first
		        return { id: "123", name: "Alice" };
		      }
		    },
		    User: {
		      posts: (parent, args) => {
		        // 2. Executes with parent = { id: "123", name: "Alice" }
		        return [{ id: "1", title: "Post 1" }];
		      }
		    },
		    Post: {
		      comments: (parent, args) => {
		        // 3. Executes with parent = { id: "1", title: "Post 1" }
		        return [{ id: "1", text: "Comment 1" }];
		      }
		    }
		  };
		  ```
	-
	- ## Context Object
		- Shared object passed to all resolvers.
		- Contains authentication, database connections, etc.
		- **Why context**: Avoid passing the same data (user, db) to every resolver manually.
		- **Think of context as**: A backpack that every resolver can access. Put shared tools in it once.
		- **Best practices**: Create context per request (not globally). Include: user, db, dataSources, loaders.
		- **Security tip**: Context is created BEFORE resolvers run. Perfect place for authentication.
		- ```javascript
		  // Apollo Server context
		  const server = new ApolloServer({
		    typeDefs,
		    resolvers,
		    context: async ({ req }) => {
		      // Get token from headers
		      const token = req.headers.authorization || '';
		      
		      // Verify token and get user
		      const user = await getUserFromToken(token);
		      
		      // Return context object
		      return {
		        user,
		        db: database,
		        dataSources: {
		          userAPI: new UserAPI(),
		          postAPI: new PostAPI()
		        }
		      };
		    }
		  });
		  
		  // Use context in resolvers
		  const resolvers = {
		    Query: {
		      me: (parent, args, context) => {
		        if (!context.user) {
		          throw new Error('Not authenticated');
		        }
		        return context.user;
		      },
		      
		      users: (parent, args, context) => {
		        return context.db.users.findAll();
		      }
		    }
		  };
		  ```
	-
	- ## Async Resolvers
		- Resolvers can be async functions.
		- :::code-tabs
		  ```javascript
		  // JavaScript - Async/await resolvers
		  const resolvers = {
		    Query: {
		      user: async (parent, args, context) => {
		        const user = await context.db.users.findById(args.id);
		        return user;
		      },
		      
		      posts: async (parent, args, context) => {
		        const posts = await context.db.posts.find({
		          limit: args.limit,
		          offset: args.offset
		        });
		        return posts;
		      }
		    },
		    
		    User: {
		      posts: async (parent, args, context) => {
		        return await context.db.posts.findByAuthorId(parent.id);
		      },
		      
		      followers: async (parent, args, context) => {
		        return await context.db.follows.getFollowers(parent.id);
		      }
		    }
		  };
		  ```
		  
		  ```python
		  # Python - Async resolvers with asyncio
		  import graphene
		  from graphql.execution.executors.asyncio import AsyncioExecutor
		  
		  class Query(graphene.ObjectType):
		      user = graphene.Field(User, id=graphene.ID(required=True))
		      posts = graphene.List(Post, limit=graphene.Int(), offset=graphene.Int())
		      
		      async def resolve_user(self, info, id):
		          user = await info.context.db.users.find_by_id(id)
		          return user
		      
		      async def resolve_posts(self, info, limit=10, offset=0):
		          posts = await info.context.db.posts.find(
		              limit=limit,
		              offset=offset
		          )
		          return posts
		  
		  class User(graphene.ObjectType):
		      id = graphene.ID()
		      name = graphene.String()
		      posts = graphene.List(lambda: Post)
		      followers = graphene.List(lambda: User)
		      
		      async def resolve_posts(self, info):
		          return await info.context.db.posts.find_by_author_id(self.id)
		      
		      async def resolve_followers(self, info):
		          return await info.context.db.follows.get_followers(self.id)
		  
		  # Execute with async executor
		  schema = graphene.Schema(query=Query)
		  result = await schema.execute_async(
		      query_string,
		      executor=AsyncioExecutor()
		  )
		  ```
		  
		  ```cpp
		  // C++ - Async resolvers with futures
		  #include <future>
		  #include <graphqlservice/GraphQLService.h>
		  
		  class QueryObject : public object::Query {
		  public:
		      // Async resolver using std::future
		      std::future<std::shared_ptr<UserObject>> getUserAsync(
		          service::FieldParams&& params,
		          std::string&& id) const {
		          
		          return std::async(std::launch::async, [id, &params]() {
		              auto& db = params.state.get<Database>();
		              return db.users.findById(id);
		          });
		      }
		      
		      std::future<std::vector<std::shared_ptr<Post>>> getPostsAsync(
		          service::FieldParams&& params,
		          int limit,
		          int offset) const {
		          
		          return std::async(std::launch::async, [limit, offset, &params]() {
		              auto& db = params.state.get<Database>();
		              return db.posts.find(limit, offset);
		          });
		      }
		  };
		  
		  class UserObject : public object::User {
		  public:
		      std::future<std::vector<std::shared_ptr<Post>>> getPostsAsync(
		          const service::FieldParams& params) const {
		          
		          return std::async(std::launch::async, [this, &params]() {
		              auto& db = params.state.get<Database>();
		              return db.posts.findByAuthorId(m_id);
		          });
		      }
		      
		      std::future<std::vector<std::shared_ptr<User>>> getFollowersAsync(
		          const service::FieldParams& params) const {
		          
		          return std::async(std::launch::async, [this, &params]() {
		              auto& db = params.state.get<Database>();
		              return db.follows.getFollowers(m_id);
		          });
		      }
		  };
		  ```
		  :::
	-
	- ## Error Handling
		- :::code-tabs
		  ```javascript
		  // JavaScript - Error handling in resolvers
		  const resolvers = {
		    Query: {
		      user: async (parent, args, context) => {
		        const user = await context.db.users.findById(args.id);
		        
		        if (!user) {
		          throw new Error('User not found');
		        }
		        
		        return user;
		      }
		    },
		    
		    Mutation: {
		      createUser: async (parent, args, context) => {
		        // Validation
		        if (!args.input.email.includes('@')) {
		          throw new Error('Invalid email address');
		        }
		        
		        // Check authentication
		        if (!context.user) {
		          throw new Error('Not authenticated');
		        }
		        
		        // Check authorization
		        if (context.user.role !== 'ADMIN') {
		          throw new Error('Not authorized');
		        }
		        
		        try {
		          const user = await context.db.users.create(args.input);
		          return user;
		        } catch (error) {
		          if (error.code === 'DUPLICATE_EMAIL') {
		            throw new Error('Email already exists');
		          }
		          throw error;
		        }
		      }
		    }
		  };
		  ```
		  
		  ```python
		  # Python - Error handling with GraphQLError
		  import graphene
		  from graphql import GraphQLError
		  
		  class Query(graphene.ObjectType):
		      user = graphene.Field(User, id=graphene.ID(required=True))
		      
		      def resolve_user(self, info, id):
		          user = info.context.db.users.find_by_id(id)
		          
		          if not user:
		              raise GraphQLError('User not found')
		          
		          return user
		  
		  class CreateUserInput(graphene.InputObjectType):
		      email = graphene.String(required=True)
		      username = graphene.String(required=True)
		  
		  class Mutation(graphene.ObjectType):
		      create_user = graphene.Field(User, input=CreateUserInput(required=True))
		      
		      def resolve_create_user(self, info, input):
		          # Validation
		          if '@' not in input.email:
		              raise GraphQLError('Invalid email address')
		          
		          # Check authentication
		          if not info.context.user:
		              raise GraphQLError('Not authenticated')
		          
		          # Check authorization
		          if info.context.user.role != 'ADMIN':
		              raise GraphQLError('Not authorized')
		          
		          try:
		              user = info.context.db.users.create(input)
		              return user
		          except Exception as e:
		              if hasattr(e, 'code') and e.code == 'DUPLICATE_EMAIL':
		                  raise GraphQLError('Email already exists')
		              raise GraphQLError(str(e))
		  ```
		  
		  ```cpp
		  // C++ - Error handling with exceptions
		  #include <graphqlservice/GraphQLService.h>
		  #include <stdexcept>
		  
		  class QueryObject : public object::Query {
		  public:
		      std::shared_ptr<UserObject> getUser(
		          service::FieldParams&& params,
		          std::string&& id) const override {
		          
		          auto& db = params.state.get<Database>();
		          auto user = db.users.findById(id);
		          
		          if (!user) {
		              throw service::schema_exception({
		                  "User not found"
		              });
		          }
		          
		          return user;
		      }
		  };
		  
		  class MutationObject : public object::Mutation {
		  public:
		      std::shared_ptr<UserObject> createUser(
		          service::FieldParams&& params,
		          CreateUserInput&& input) const override {
		          
		          // Validation
		          if (input.email.find('@') == std::string::npos) {
		              throw service::schema_exception({
		                  "Invalid email address"
		              });
		          }
		          
		          // Check authentication
		          auto& context = params.state.get<Context>();
		          if (!context.user) {
		              throw service::schema_exception({
		                  "Not authenticated"
		              });
		          }
		          
		          // Check authorization
		          if (context.user->role != UserRole::ADMIN) {
		              throw service::schema_exception({
		                  "Not authorized"
		              });
		          }
		          
		          try {
		              auto& db = params.state.get<Database>();
		              return db.users.create(input);
		          } catch (const DuplicateEmailException& e) {
		              throw service::schema_exception({
		                  "Email already exists"
		              });
		          }
		      }
		  };
		  ```
		  :::
-
- # Advanced Patterns
  collapsed:: true
	- ## DataLoader (N+1 Problem Solution)
		- Batches and caches database requests.
		- Solves N+1 query problem.
		- **What is N+1 problem**: Making N database queries when you could make 1.
		- **Why it happens**: GraphQL resolvers run independently. Fetching related data can trigger many queries.
		- **Real-world analogy**: Instead of making 100 separate trips to the store (one for each item), make one trip and buy everything at once.
		- **How DataLoader works**: Collects all requests in a single tick, batches them, makes one query, distributes results.
		- **Key benefit**: Turns 101 queries into 2 queries automatically.
		- ```javascript
		  const DataLoader = require('dataloader');
		  
		  // Without DataLoader (N+1 problem)
		  const resolvers = {
		    Query: {
		      posts: () => db.posts.findAll()  // 1 query
		    },
		    Post: {
		      author: (post) => db.users.findById(post.authorId)  // N queries!
		    }
		  };
		  // If 100 posts, makes 101 database queries!
		  
		  // With DataLoader (batched)
		  const createLoaders = () => ({
		    userLoader: new DataLoader(async (userIds) => {
		      const users = await db.users.findByIds(userIds);
		      return userIds.map(id => users.find(u => u.id === id));
		    })
		  });
		  
		  const server = new ApolloServer({
		    typeDefs,
		    resolvers,
		    context: () => ({
		      loaders: createLoaders()
		    })
		  });
		  
		  const resolvers = {
		    Query: {
		      posts: () => db.posts.findAll()  // 1 query
		    },
		    Post: {
		      author: (post, args, context) => {
		        return context.loaders.userLoader.load(post.authorId);  // Batched!
		      }
		    }
		  };
		  // If 100 posts, makes only 2 queries: 1 for posts, 1 batched for all users
		  ```
	-
	- ## Pagination
		- **Why pagination**: Don't load 10,000 items at once. Bad for performance and user experience.
		- **Two main approaches**: Offset-based (simple) and cursor-based (scalable).
		- ### Offset-Based Pagination
			- **How it works**: Skip X items, take Y items (like SQL LIMIT/OFFSET).
			- **Pros**: Simple to implement, easy to understand, can jump to any page.
			- **Cons**: Performance degrades with large offsets, inconsistent with real-time data.
			- **Use when**: Small datasets, admin panels, data doesn't change frequently.
			- ```graphql
			  type Query {
			    posts(limit: Int, offset: Int): [Post!]!
			    postCount: Int!
			  }
			  
			  # Usage
			  query {
			    posts(limit: 20, offset: 40) {  # Page 3
			      id
			      title
			    }
			    postCount
			  }
			  ```
		- ### Cursor-Based Pagination (Relay Style)
			- **How it works**: Use a cursor (pointer) to mark position, fetch items after/before cursor.
			- **Pros**: Consistent results, works with real-time data, scales to millions of items.
			- **Cons**: More complex, can't jump to arbitrary page, cursor must be opaque.
			- **Use when**: Large datasets, infinite scroll, real-time feeds, production apps.
			- **Cursor explained**: Like a bookmark in a book. You can always return to exact position.
			- ```graphql
			  type Query {
			    posts(first: Int, after: String, last: Int, before: String): PostConnection!
			  }
			  
			  type PostConnection {
			    edges: [PostEdge!]!
			    pageInfo: PageInfo!
			    totalCount: Int!
			  }
			  
			  type PostEdge {
			    node: Post!
			    cursor: String!
			  }
			  
			  type PageInfo {
			    hasNextPage: Boolean!
			    hasPreviousPage: Boolean!
			    startCursor: String
			    endCursor: String
			  }
			  
			  # Usage
			  query {
			    posts(first: 20, after: "cursor123") {
			      edges {
			        node {
			          id
			          title
			        }
			        cursor
			      }
			      pageInfo {
			        hasNextPage
			        endCursor
			      }
			    }
			  }
			  ```
	-
	- ## Authentication & Authorization
		- **Authentication**: Who are you? (Identity verification)
		- **Authorization**: What can you do? (Permission checking)
		- **Key difference**: Authentication happens once (in context). Authorization happens per field (in resolvers).
		- **Best practice**: Authenticate in context, authorize in resolvers or directives.
		- **Security principle**: Fail closed (deny by default), not open.
		- ```javascript
		  // Authentication in context
		  const server = new ApolloServer({
		    typeDefs,
		    resolvers,
		    context: async ({ req }) => {
		      const token = req.headers.authorization?.replace('Bearer ', '');
		      
		      if (!token) {
		        return { user: null };
		      }
		      
		      try {
		        const user = await verifyToken(token);
		        return { user };
		      } catch (error) {
		        return { user: null };
		      }
		    }
		  });
		  
		  // Authorization in resolvers
		  const resolvers = {
		    Query: {
		      me: (parent, args, context) => {
		        if (!context.user) {
		          throw new Error('Not authenticated');
		        }
		        return context.user;
		      },
		      
		      users: (parent, args, context) => {
		        if (!context.user || context.user.role !== 'ADMIN') {
		          throw new Error('Not authorized');
		        }
		        return db.users.findAll();
		      }
		    },
		    
		    Mutation: {
		      deleteUser: (parent, args, context) => {
		        if (!context.user) {
		          throw new Error('Not authenticated');
		        }
		        
		        if (context.user.role !== 'ADMIN' && context.user.id !== args.id) {
		          throw new Error('Not authorized');
		        }
		        
		        return db.users.delete(args.id);
		      }
		    }
		  };
		  
		  // Custom directive for authorization
		  const { SchemaDirectiveVisitor } = require('@graphql-tools/utils');
		  
		  class AuthDirective extends SchemaDirectiveVisitor {
		    visitFieldDefinition(field) {
		      const { resolve = defaultFieldResolver } = field;
		      const { requires } = this.args;
		      
		      field.resolve = async function(...args) {
		        const context = args[2];
		        
		        if (!context.user) {
		          throw new Error('Not authenticated');
		        }
		        
		        if (requires && context.user.role !== requires) {
		          throw new Error('Not authorized');
		        }
		        
		        return resolve.apply(this, args);
		      };
		    }
		  }
		  
		  // Use directive in schema
		  const typeDefs = `
		    directive @auth(requires: UserRole) on FIELD_DEFINITION
		    
		    enum UserRole {
		      ADMIN
		      USER
		    }
		    
		    type Query {
		      me: User @auth
		      users: [User!]! @auth(requires: ADMIN)
		    }
		  `;
		  ```
	-
	- ## Caching
		- **Why caching is hard in GraphQL**: POST requests, dynamic queries, no URL-based caching.
		- **Solution layers**: Response caching (server), field caching (resolver), client caching (Apollo).
		- **Cache control**: Tell clients and CDNs how long to cache responses.
		- **Key insight**: Cache at multiple levels for best performance.
		- ```javascript
		  // Response caching with cache control
		  const { ApolloServer } = require('@apollo/server');
		  const responseCachePlugin = require('@apollo/server-plugin-response-cache');
		  
		  const server = new ApolloServer({
		    typeDefs,
		    resolvers,
		    plugins: [responseCachePlugin()]
		  });
		  
		  // Cache control in schema
		  const typeDefs = `
		    type Query {
		      posts: [Post!]! @cacheControl(maxAge: 60)
		      user(id: ID!): User @cacheControl(maxAge: 300)
		    }
		    
		    type Post @cacheControl(maxAge: 60) {
		      id: ID!
		      title: String!
		    }
		  `;
		  
		  // Cache control in resolvers
		  const resolvers = {
		    Query: {
		      posts: (parent, args, context, info) => {
		        info.cacheControl.setCacheHint({ maxAge: 60 });
		        return db.posts.findAll();
		      }
		    }
		  };
		  
		  // Client-side caching (Apollo Client)
		  import { InMemoryCache } from '@apollo/client';
		  
		  const cache = new InMemoryCache({
		    typePolicies: {
		      Query: {
		        fields: {
		          posts: {
		            merge(existing, incoming) {
		              return incoming;
		            }
		          }
		        }
		      }
		    }
		  });
		  ```
	-
	- ## Rate Limiting
		- **Why rate limiting**: Prevent abuse, protect server resources, ensure fair usage.
		- **Three approaches**: Request-based (simple), query complexity (smart), query depth (prevent nesting).
		- **Request-based**: Limit requests per IP/user (e.g., 100 requests per minute).
		- **Complexity-based**: Calculate query cost, limit total cost (e.g., max 1000 points per query).
		- **Depth-based**: Limit nesting levels (e.g., max 5 levels deep).
		- **Best practice**: Combine all three for comprehensive protection.
		- ```javascript
		  const { RateLimiterMemory } = require('rate-limiter-flexible');
		  
		  const rateLimiter = new RateLimiterMemory({
		    points: 100,  // Number of requests
		    duration: 60  // Per 60 seconds
		  });
		  
		  const server = new ApolloServer({
		    typeDefs,
		    resolvers,
		    context: async ({ req }) => {
		      const ip = req.ip;
		      
		      try {
		        await rateLimiter.consume(ip);
		      } catch (error) {
		        throw new Error('Too many requests');
		      }
		      
		      return { ip };
		    }
		  });
		  
		  // Query complexity limiting
		  const { createComplexityLimitRule } = require('graphql-validation-complexity');
		  
		  const server = new ApolloServer({
		    typeDefs,
		    resolvers,
		    validationRules: [
		      createComplexityLimitRule(1000, {
		        onCost: (cost) => console.log('Query cost:', cost)
		      })
		    ]
		  });
		  
		  // Depth limiting
		  const depthLimit = require('graphql-depth-limit');
		  
		  const server = new ApolloServer({
		    typeDefs,
		    resolvers,
		    validationRules: [depthLimit(5)]  // Max depth of 5
		  });
		  ```
	-
	- ## File Upload
		- **Challenge**: GraphQL spec doesn't define file uploads (it's JSON-based).
		- **Solution**: Use multipart form data with special Upload scalar.
		- **How it works**: File sent as multipart, referenced in GraphQL variables.
		- **Alternative**: Upload to separate endpoint, return URL, use URL in GraphQL mutation.
		- **Production tip**: Use cloud storage (S3, Cloudinary) for scalability.
		- ```graphql
		  # Schema
		  scalar Upload
		  
		  type File {
		    filename: String!
		    mimetype: String!
		    encoding: String!
		    url: String!
		  }
		  
		  type Mutation {
		    uploadFile(file: Upload!): File!
		    uploadFiles(files: [Upload!]!): [File!]!
		  }
		  ```
		- ```javascript
		  // Resolver
		  const { GraphQLUpload } = require('graphql-upload');
		  const { createWriteStream } = require('fs');
		  const path = require('path');
		  
		  const resolvers = {
		    Upload: GraphQLUpload,
		    
		    Mutation: {
		      uploadFile: async (parent, { file }) => {
		        const { createReadStream, filename, mimetype, encoding } = await file;
		        
		        const stream = createReadStream();
		        const filePath = path.join(__dirname, 'uploads', filename);
		        
		        await new Promise((resolve, reject) => {
		          stream
		            .pipe(createWriteStream(filePath))
		            .on('finish', resolve)
		            .on('error', reject);
		        });
		        
		        return {
		          filename,
		          mimetype,
		          encoding,
		          url: `/uploads/${filename}`
		        };
		      }
		    }
		  };
		  
		  // Client (with Apollo Client)
		  import { gql, useMutation } from '@apollo/client';
		  
		  const UPLOAD_FILE = gql`
		    mutation UploadFile($file: Upload!) {
		      uploadFile(file: $file) {
		        filename
		        url
		      }
		    }
		  `;
		  
		  function FileUpload() {
		    const [uploadFile] = useMutation(UPLOAD_FILE);
		    
		    const handleFileChange = (e) => {
		      const file = e.target.files[0];
		      uploadFile({ variables: { file } });
		    };
		    
		    return <input type="file" onChange={handleFileChange} />;
		  }
		  ```
-
- # Performance Optimization
  collapsed:: true
	- ## Query Optimization
		- **Why optimization matters**: GraphQL's flexibility can lead to expensive queries if not managed.
		- **The problem**: Clients can request anything. Some queries are cheap, others can kill your server.
		- **The solution**: Multiple layers of protection and optimization.
		- **Use DataLoader** — Batch and cache database requests (solves N+1 problem).
		- **Limit Query Depth** — Prevent deeply nested queries (e.g., user.posts.author.posts.author...).
		- **Limit Query Complexity** — Calculate and limit query cost (assign points to fields).
		- **Pagination** — Always paginate large lists (never return unbounded arrays).
		- **Field-Level Caching** — Cache expensive computations (e.g., aggregations).
		- **Database Indexes** — Index frequently queried fields (standard database optimization).
		- **Monitoring** — Track slow queries, identify bottlenecks, optimize hot paths.
	-
	- ## N+1 Problem
		- **What it is**: The most common GraphQL performance issue.
		- **Why it happens**: Resolvers run independently for each item in a list.
		- **Example**: Fetching 100 posts, each post fetches its author = 101 queries (1 for posts + 100 for authors).
		- **Impact**: Can slow queries from 10ms to 10 seconds. Kills database performance.
		- **Detection**: Look for repeated queries with different IDs in database logs.
		- **Solutions**: DataLoader (automatic batching), database joins, denormalization.
		- ```javascript
		  // Problem: N+1 queries
		  const resolvers = {
		    Query: {
		      posts: () => db.posts.findAll()  // 1 query
		    },
		    Post: {
		      author: (post) => db.users.findById(post.authorId),  // N queries
		      comments: (post) => db.comments.findByPostId(post.id)  // N queries
		    }
		  };
		  // 100 posts = 1 + 100 + 100 = 201 queries!
		  
		  // Solution 1: DataLoader
		  const userLoader = new DataLoader(async (ids) => {
		    const users = await db.users.findByIds(ids);
		    return ids.map(id => users.find(u => u.id === id));
		  });
		  
		  const resolvers = {
		    Post: {
		      author: (post, args, context) => {
		        return context.loaders.userLoader.load(post.authorId);
		      }
		    }
		  };
		  // 100 posts = 1 + 1 + 1 = 3 queries!
		  
		  // Solution 2: Join in database
		  const resolvers = {
		    Query: {
		      posts: async () => {
		        return await db.posts.findAll({
		          include: ['author', 'comments']
		        });
		      }
		    }
		  };
		  // 100 posts = 1 query with joins
		  ```
	-
	- ## Monitoring & Tracing
		- **Why monitoring**: You can't optimize what you don't measure.
		- **What to track**: Query execution time, resolver performance, error rates, cache hit rates.
		- **Tools**: Apollo Studio (best), custom plugins, APM tools (New Relic, Datadog).
		- **Key metrics**: P95 latency (95% of queries faster than X), error rate, queries per second.
		- **Production tip**: Log slow queries (>1s), alert on error spikes, track schema usage.
		- ```javascript
		  // Apollo Server with tracing
		  const { ApolloServer } = require('@apollo/server');
		  const { ApolloServerPluginLandingPageGraphQLPlayground } = require('@apollo/server-plugin-landing-page-graphql-playground');
		  
		  const server = new ApolloServer({
		    typeDefs,
		    resolvers,
		    plugins: [
		      {
		        async requestDidStart() {
		          const start = Date.now();
		          
		          return {
		            async willSendResponse({ response }) {
		              const duration = Date.now() - start;
		              console.log(`Query took ${duration}ms`);
		            }
		          };
		        }
		      }
		    ]
		  });
		  
		  // Custom logging plugin
		  const loggingPlugin = {
		    async requestDidStart({ request, context }) {
		      console.log('Query:', request.query);
		      console.log('Variables:', request.variables);
		      console.log('User:', context.user?.id);
		      
		      return {
		        async didEncounterErrors({ errors }) {
		          console.error('Errors:', errors);
		        },
		        
		        async willSendResponse({ response }) {
		          console.log('Response:', JSON.stringify(response).slice(0, 100));
		        }
		      };
		    }
		  };
		  ```
-
- # Best Practices
  collapsed:: true
	- ## Schema Design
		- **Use descriptive names** — Clear, self-documenting field names.
		- **Nullable by default** — Only use `!` when truly required.
		- **Input types for mutations** — Group related arguments.
		- **Enums for fixed values** — Better than strings for status, roles, etc.
		- **Pagination for lists** — Always paginate potentially large lists.
		- **Versioning through deprecation** — Use `@deprecated` instead of versions.
		- **Consistent naming** — camelCase for fields, PascalCase for types.
	-
	- ## Query Design
		- **Name your operations** — Always use named queries/mutations.
		- **Use fragments** — Reduce duplication with fragments.
		- **Use variables** — Never hardcode values in queries.
		- **Request only needed fields** — Don't over-fetch data.
		- **Avoid deeply nested queries** — Limit query depth.
	-
	- ## Security
		- **Authentication** — Verify user identity in context.
		- **Authorization** — Check permissions in resolvers or directives.
		- **Query depth limiting** — Prevent deeply nested queries.
		- **Query complexity limiting** — Calculate and limit query cost.
		- **Rate limiting** — Limit requests per user/IP.
		- **Input validation** — Validate all user inputs.
		- **Disable introspection in production** — Hide schema from attackers.
		- **Use HTTPS** — Always use encrypted connections.
	-
	- ## Error Handling
		- **Use specific error messages** — Help clients understand what went wrong.
		- **Don't expose sensitive data** — Sanitize error messages in production.
		- **Use error codes** — Structured error handling with codes.
		- **Partial errors** — Return data with errors when possible.
		- ```javascript
		  // Good error handling
		  const resolvers = {
		    Query: {
		      user: async (parent, args, context) => {
		        if (!context.user) {
		          throw new Error('UNAUTHENTICATED: Please log in');
		        }
		        
		        const user = await db.users.findById(args.id);
		        
		        if (!user) {
		          throw new Error('NOT_FOUND: User not found');
		        }
		        
		        if (user.id !== context.user.id && context.user.role !== 'ADMIN') {
		          throw new Error('FORBIDDEN: Not authorized to view this user');
		        }
		        
		        return user;
		      }
		    }
		  };
		  ```
	-
	- ## Testing
		- ```javascript
		  // Unit test resolvers
		  const { user } = require('./resolvers');
		  
		  test('user resolver returns user', async () => {
		    const mockContext = {
		      db: {
		        users: {
		          findById: jest.fn().mockResolvedValue({
		            id: '123',
		            name: 'Alice'
		          })
		        }
		      }
		    };
		    
		    const result = await user(null, { id: '123' }, mockContext);
		    
		    expect(result).toEqual({ id: '123', name: 'Alice' });
		    expect(mockContext.db.users.findById).toHaveBeenCalledWith('123');
		  });
		  
		  // Integration test with Apollo Server
		  const { ApolloServer } = require('@apollo/server');
		  const { createTestClient } = require('apollo-server-testing');
		  
		  const server = new ApolloServer({ typeDefs, resolvers });
		  const { query, mutate } = createTestClient(server);
		  
		  test('query returns user', async () => {
		    const GET_USER = gql`
		      query GetUser($id: ID!) {
		        user(id: $id) {
		          id
		          name
		        }
		      }
		    `;
		    
		    const result = await query({
		      query: GET_USER,
		      variables: { id: '123' }
		    });
		    
		    expect(result.data.user).toEqual({
		      id: '123',
		      name: 'Alice'
		    });
		  });
		  ```
-
- # Real-World Examples
  collapsed:: true
	- ## Social Media API
		- ```graphql
		  type User {
		    id: ID!
		    username: String!
		    email: String!
		    avatar: String
		    bio: String
		    isVerified: Boolean!
		    followers: [User!]!
		    following: [User!]!
		    posts: [Post!]!
		    createdAt: DateTime!
		  }
		  
		  type Post {
		    id: ID!
		    content: String!
		    images: [String!]!
		    author: User!
		    likes: LikeInfo!
		    comments: [Comment!]!
		    shares: Int!
		    createdAt: DateTime!
		    updatedAt: DateTime!
		  }
		  
		  type LikeInfo {
		    count: Int!
		    viewerHasLiked: Boolean!
		    users: [User!]!
		  }
		  
		  type Comment {
		    id: ID!
		    text: String!
		    author: User!
		    post: Post!
		    likes: Int!
		    createdAt: DateTime!
		  }
		  
		  type Query {
		    me: User
		    user(username: String!): User
		    feed(limit: Int = 20, cursor: String): PostConnection!
		    post(id: ID!): Post
		    searchUsers(query: String!): [User!]!
		  }
		  
		  type Mutation {
		    register(input: RegisterInput!): AuthPayload!
		    login(email: String!, password: String!): AuthPayload!
		    createPost(input: CreatePostInput!): Post!
		    likePost(postId: ID!): Post!
		    unlikePost(postId: ID!): Post!
		    addComment(postId: ID!, text: String!): Comment!
		    followUser(userId: ID!): User!
		    unfollowUser(userId: ID!): User!
		  }
		  
		  type Subscription {
		    postCreated(userId: ID!): Post!
		    commentAdded(postId: ID!): Comment!
		    notificationReceived: Notification!
		  }
		  
		  input RegisterInput {
		    username: String!
		    email: String!
		    password: String!
		  }
		  
		  input CreatePostInput {
		    content: String!
		    images: [String!]
		  }
		  
		  type AuthPayload {
		    token: String!
		    user: User!
		  }
		  
		  type PostConnection {
		    edges: [PostEdge!]!
		    pageInfo: PageInfo!
		  }
		  
		  type PostEdge {
		    node: Post!
		    cursor: String!
		  }
		  
		  type PageInfo {
		    hasNextPage: Boolean!
		    endCursor: String
		  }
		  
		  type Notification {
		    id: ID!
		    type: NotificationType!
		    message: String!
		    actor: User!
		    createdAt: DateTime!
		    read: Boolean!
		  }
		  
		  enum NotificationType {
		    LIKE
		    COMMENT
		    FOLLOW
		    MENTION
		  }
		  ```
	-
	- ## E-Commerce API
		- ```graphql
		  type Product {
		    id: ID!
		    sku: String!
		    name: String!
		    description: String!
		    price: Float!
		    compareAtPrice: Float
		    currency: String!
		    category: Category!
		    images: [Image!]!
		    variants: [ProductVariant!]!
		    reviews: ReviewConnection!
		    averageRating: Float
		    stock: Int!
		    isAvailable: Boolean!
		    tags: [String!]!
		    createdAt: DateTime!
		  }
		  
		  type ProductVariant {
		    id: ID!
		    name: String!
		    price: Float!
		    stock: Int!
		    sku: String!
		    attributes: JSON!
		  }
		  
		  type Category {
		    id: ID!
		    name: String!
		    slug: String!
		    parent: Category
		    children: [Category!]!
		    products: [Product!]!
		  }
		  
		  type Image {
		    url: String!
		    alt: String
		    width: Int
		    height: Int
		  }
		  
		  type Review {
		    id: ID!
		    rating: Int!
		    title: String
		    comment: String!
		    author: User!
		    product: Product!
		    helpful: Int!
		    createdAt: DateTime!
		  }
		  
		  type Cart {
		    id: ID!
		    items: [CartItem!]!
		    subtotal: Float!
		    tax: Float!
		    shipping: Float!
		    total: Float!
		  }
		  
		  type CartItem {
		    id: ID!
		    product: Product!
		    variant: ProductVariant
		    quantity: Int!
		    price: Float!
		  }
		  
		  type Order {
		    id: ID!
		    orderNumber: String!
		    customer: User!
		    items: [OrderItem!]!
		    subtotal: Float!
		    tax: Float!
		    shipping: Float!
		    total: Float!
		    status: OrderStatus!
		    shippingAddress: Address!
		    billingAddress: Address!
		    payment: Payment!
		    createdAt: DateTime!
		    updatedAt: DateTime!
		  }
		  
		  type OrderItem {
		    id: ID!
		    product: Product!
		    variant: ProductVariant
		    quantity: Int!
		    price: Float!
		  }
		  
		  type Address {
		    street: String!
		    city: String!
		    state: String!
		    country: String!
		    postalCode: String!
		  }
		  
		  type Payment {
		    method: PaymentMethod!
		    status: PaymentStatus!
		    transactionId: String
		  }
		  
		  enum OrderStatus {
		    PENDING
		    PROCESSING
		    SHIPPED
		    DELIVERED
		    CANCELLED
		  }
		  
		  enum PaymentMethod {
		    CREDIT_CARD
		    DEBIT_CARD
		    PAYPAL
		    STRIPE
		  }
		  
		  enum PaymentStatus {
		    PENDING
		    COMPLETED
		    FAILED
		    REFUNDED
		  }
		  
		  type Query {
		    products(filter: ProductFilter, limit: Int, offset: Int): [Product!]!
		    product(id: ID!): Product
		    categories: [Category!]!
		    category(slug: String!): Category
		    cart: Cart
		    orders: [Order!]!
		    order(id: ID!): Order
		  }
		  
		  type Mutation {
		    addToCart(productId: ID!, variantId: ID, quantity: Int!): Cart!
		    removeFromCart(itemId: ID!): Cart!
		    updateCartItem(itemId: ID!, quantity: Int!): Cart!
		    clearCart: Cart!
		    placeOrder(input: PlaceOrderInput!): Order!
		    cancelOrder(orderId: ID!): Order!
		    addReview(input: AddReviewInput!): Review!
		  }
		  
		  input ProductFilter {
		    category: String
		    minPrice: Float
		    maxPrice: Float
		    inStock: Boolean
		    tags: [String!]
		  }
		  
		  input PlaceOrderInput {
		    shippingAddress: AddressInput!
		    billingAddress: AddressInput!
		    paymentMethod: PaymentMethod!
		  }
		  
		  input AddressInput {
		    street: String!
		    city: String!
		    state: String!
		    country: String!
		    postalCode: String!
		  }
		  
		  input AddReviewInput {
		    productId: ID!
		    rating: Int!
		    title: String
		    comment: String!
		  }
		  ```
-
- # Tools & Ecosystem
  collapsed:: true
	- ## GraphQL Playground / GraphiQL
		- Interactive GraphQL IDE for testing queries.
		- Auto-complete, documentation explorer, query history.
		- Built into most GraphQL servers.
	-
	- ## Apollo Studio
		- Cloud platform for GraphQL development.
		- Schema registry, performance monitoring, analytics.
		- Free tier available at [studio.apollographql.com](https://studio.apollographql.com)
	-
	- ## GraphQL Code Generator
		- Generate TypeScript types from schema.
		- ```bash
		  npm install -D @graphql-codegen/cli
		  npx graphql-codegen init
		  ```
	-
	- ## Prisma
		- Modern ORM with GraphQL integration.
		- Type-safe database access.
		- ```bash
		  npm install prisma @prisma/client
		  npx prisma init
		  ```
	-
	- ## Hasura
		- Instant GraphQL API on PostgreSQL.
		- Real-time subscriptions, authorization.
		- [hasura.io](https://hasura.io)
	-
	- ## PostGraphile
		- GraphQL API from PostgreSQL schema.
		- Automatic CRUD operations.
		- [graphile.org/postgraphile](https://www.graphile.org/postgraphile/)
-
- # Common Patterns
  collapsed:: true
	- ## Relay Specification
		- Standard for pagination, mutations, and global IDs.
		- Used by Facebook, adopted widely.
		- ```graphql
		  # Node interface (global ID)
		  interface Node {
		    id: ID!
		  }
		  
		  # Connection pattern (pagination)
		  type UserConnection {
		    edges: [UserEdge!]!
		    pageInfo: PageInfo!
		  }
		  
		  type UserEdge {
		    node: User!
		    cursor: String!
		  }
		  
		  type PageInfo {
		    hasNextPage: Boolean!
		    hasPreviousPage: Boolean!
		    startCursor: String
		    endCursor: String
		  }
		  
		  # Mutation pattern
		  input CreateUserInput {
		    clientMutationId: String
		    username: String!
		    email: String!
		  }
		  
		  type CreateUserPayload {
		    clientMutationId: String
		    user: User!
		    userEdge: UserEdge!
		  }
		  ```
	-
	- ## Federation (Microservices)
		- Combine multiple GraphQL services into one schema.
		- Each service owns part of the schema.
		- ```graphql
		  # Users service
		  type User @key(fields: "id") {
		    id: ID!
		    username: String!
		    email: String!
		  }
		  
		  # Posts service
		  extend type User @key(fields: "id") {
		    id: ID! @external
		    posts: [Post!]!
		  }
		  
		  type Post {
		    id: ID!
		    title: String!
		    author: User!
		  }
		  ```
-
- # Resources
  collapsed:: true
	- ## Official Documentation
		- [GraphQL.org](https://graphql.org) — Official GraphQL website
		- [GraphQL Spec](https://spec.graphql.org) — GraphQL specification
		- [Apollo Docs](https://www.apollographql.com/docs/) — Apollo Server & Client
		- [Relay Docs](https://relay.dev) — Relay framework
	-
	- ## Learning Resources
		- [How to GraphQL](https://www.howtographql.com) — Free tutorial
		- [GraphQL Playground](https://www.graphqlbin.com) — Online playground
		- [Apollo Odyssey](https://odyssey.apollographql.com) — Free courses
	-
	- ## Tools
		- [GraphQL Playground](https://github.com/graphql/graphql-playground) — GraphQL IDE
		- [Apollo Studio](https://studio.apollographql.com) — Schema registry & monitoring
		- [GraphQL Code Generator](https://www.graphql-code-generator.com) — Type generation
		- [Altair GraphQL Client](https://altair.sirmuel.design) — GraphQL client
	-
	- ## Community
		- [GraphQL Discord](https://discord.graphql.org) — Official Discord server
		- [r/graphql](https://reddit.com/r/graphql) — Reddit community
		- [Stack Overflow](https://stackoverflow.com/questions/tagged/graphql) — Q&A

- # More Learn
	- ## Github & Webs
		- [graphql/graphql-spec](https://github.com/graphql/graphql-spec) — Official GraphQL specification repository
		- [graphql/graphql-js](https://github.com/graphql/graphql-js) — Reference implementation of GraphQL in JavaScript
		- [apollographql/apollo-server](https://github.com/apollographql/apollo-server) — Apollo Server source code
		- [graphql-python/graphene](https://github.com/graphql-python/graphene) — GraphQL framework for Python
		- [graphql.org](https://graphql.org) — Official GraphQL website and documentation
		- [apollographql.com/docs](https://www.apollographql.com/docs/) — Apollo Server & Client full documentation
		- [howtographql.com](https://www.howtographql.com) — Free fullstack GraphQL tutorial (beginner to advanced)
		- [odyssey.apollographql.com](https://odyssey.apollographql.com) — Free interactive GraphQL courses by Apollo
		- [graphql-code-generator.com](https://the-guild.dev/graphql/codegen) — Generate TypeScript types from GraphQL schema
		- [hasura.io/learn](https://hasura.io/learn/) — Free GraphQL tutorials with real-world projects
	-
	- ## Master Playlists YouTube
		- [GraphQL Full Course - Novice to Expert](https://www.youtube.com/watch?v=ed8SzALpx1Q) — freeCodeCamp.org — Complete GraphQL crash course
		- [GraphQL Tutorial for Beginners](https://www.youtube.com/playlist?list=PL4cUxeGkcC9iK6Qhn-QLcXCXPQUov1U7f) — The Net Ninja — Beginner-friendly playlist covering schema, queries, mutations
		- [Apollo GraphQL Tutorial](https://www.youtube.com/playlist?list=PLillGF-RfqbYZty73_PHBqKRDnv7ikh68) — Traversy Media — Practical Apollo Server & Client walkthrough
		- [GraphQL with React & Apollo](https://www.youtube.com/watch?v=YyUWW04HwKY) — Academind — Full project building a GraphQL API with React frontend
