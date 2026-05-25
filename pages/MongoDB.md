---
seoTitle: MongoDB Complete Guide – NoSQL Database, CRUD Operations, Aggregation & Indexing
description: "Comprehensive MongoDB reference covering document model, CRUD operations, aggregation framework, indexing, replication, sharding, transactions, and performance optimization."
keywords: "MongoDB, NoSQL, document database, CRUD operations, aggregation, indexing, replication, sharding, MongoDB Atlas, Mongoose, database design, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: MongoDB
author: Makvana Smitrajsinh
authorUrl: https://portfolio-eight-theta-7g6hpaehqn.vercel.app/
---

- # History
  collapsed:: true
	- **How**:
		- Developed by **10gen** (now MongoDB Inc.) in **2007** as a scalable, document-oriented database.
		- Named from "humongous" — designed to handle massive amounts of data.
		- First released in **2009** as open-source software.
		- Evolved from a Platform-as-a-Service (PaaS) product to a standalone database.
		- MongoDB Atlas (cloud-hosted) launched in 2016.
	-
	- **Who**:
		- **Dwight Merriman**, **Eliot Horowitz**, and **Kevin Ryan** — founders of 10gen/MongoDB Inc.
		- **MongoDB Inc.** — maintains and develops MongoDB.
		- Large open-source community contributing to drivers, tools, and ecosystem.
	-
	- **Why**:
		- Traditional relational databases struggled with horizontal scaling and flexible schemas.
		- Need for databases that could handle unstructured and semi-structured data.
		- Modern applications required faster development cycles with evolving data models.
		- Cloud-native architecture demanded distributed, scalable databases.
		- JSON-like documents matched how developers think about data in applications.
-
- # Introduction
  collapsed:: true
	- ## What is MongoDB?
		- **MongoDB** is a **NoSQL document database** that stores data in flexible, JSON-like documents (BSON format).
		- Schema-less design allows fields to vary from document to document.
		- Supports horizontal scaling through sharding and high availability through replication.
		- Built-in aggregation framework for complex data processing.
		- ACID transactions support (since version 4.0).
	-
	- ## MongoDB vs SQL — Real-World Analogy
		- **SQL Database** — Like a filing cabinet with fixed folders and forms. Every employee record must have the same fields.
		- **MongoDB** — Like a flexible notebook. Each page (document) can have different information while still being organized.
		- ```javascript
		  // SQL: All users must have same columns
		  // users table: id, name, email, phone (phone required even if empty)
		  
		  // MongoDB: Flexible documents
		  { _id: 1, name: "Alice", email: "alice@example.com", phone: "123-456-7890" }
		  { _id: 2, name: "Bob", email: "bob@example.com" }  // No phone field
		  { _id: 3, name: "Charlie", email: "charlie@example.com", preferences: { theme: "dark" } }  // Extra field
		  ```
	-
	- ## When to Use MongoDB
		- **Good Fit:**
			- Rapid application development with evolving requirements
			- Hierarchical data structures (user profiles, product catalogs)
			- Real-time analytics and high-volume data ingestion
			- Content management systems with varied content types
			- Mobile and IoT applications with flexible data models
			- Microservices architecture with independent data stores
		- **Not Ideal For:**
			- Complex multi-table joins and relationships
			- Financial systems requiring strict ACID guarantees across all operations
			- Applications with fixed, unchanging schema
			- Heavy relational data with many-to-many relationships
	-
	- ## Real-World Example: E-commerce Product
		- ```javascript
		  // Traditional SQL: Multiple tables with joins
		  // products table: id, name, price, category_id
		  // categories table: id, name
		  // attributes table: id, product_id, key, value
		  // images table: id, product_id, url
		  
		  // MongoDB: Single document with all related data
		  {
		    _id: ObjectId("507f1f77bcf86cd799439011"),
		    name: "Wireless Headphones",
		    price: 99.99,
		    category: {
		      name: "Electronics",
		      slug: "electronics"
		    },
		    attributes: {
		      color: "Black",
		      bluetooth: "5.0",
		      batteryLife: "30 hours",
		      weight: "250g"
		    },
		    images: [
		      "https://cdn.example.com/headphones-1.jpg",
		      "https://cdn.example.com/headphones-2.jpg"
		    ],
		    reviews: [
		      {
		        user: "Alice",
		        rating: 5,
		        comment: "Excellent sound quality!",
		        date: ISODate("2024-01-15")
		      }
		    ],
		    stock: 150,
		    tags: ["wireless", "bluetooth", "audio"],
		    createdAt: ISODate("2024-01-01"),
		    updatedAt: ISODate("2024-01-15")
		  }
		  
		  // Benefits:
		  // 1. Single query to get all product data (no joins)
		  // 2. Easy to add new attributes without schema changes
		  // 3. Natural mapping to JavaScript objects
		  // 4. Fast reads for product pages
		  ```
	-
	- ## Advantages
		- **Flexible Schema** — No rigid table structure, easy to evolve data models.
		- **Scalability** — Horizontal scaling through sharding across multiple servers.
		- **High Performance** — Optimized for read/write operations, in-memory processing.
		- **Rich Query Language** — Powerful queries, aggregation, text search, geospatial queries.
		- **Document Model** — Natural mapping to objects in programming languages.
		- **Replication** — Built-in replica sets for high availability and data redundancy.
		- **Developer Friendly** — JSON-like syntax, extensive driver support for all major languages.
		- **Cloud Ready** — MongoDB Atlas provides fully managed cloud database service.
		- **Indexing** — Supports various index types for query optimization.
		- **Aggregation Framework** — Powerful data processing and transformation pipeline.
	-
	- ## Disadvantages
		- **Memory Usage** — Can consume significant RAM for large datasets and indexes.
		- **No Joins** — Limited join support compared to SQL (use $lookup or embed documents).
		- **Data Duplication** — Denormalization can lead to redundant data storage.
		- **Transaction Overhead** — Multi-document transactions have performance impact.
		- **Storage Size** — BSON format and indexing can increase storage requirements.
		- **Learning Curve** — Aggregation pipeline and optimal schema design require experience.
		- **Consistency Trade-offs** — Eventual consistency in distributed setups (configurable).
	-
	- ## MongoDB Terminology vs SQL
		- ```
		  SQL Term          MongoDB Term       Description
		  ─────────────────────────────────────────────────────────────
		  Database          Database           Container for collections
		  Table             Collection         Group of documents
		  Row               Document           Single record (JSON-like)
		  Column            Field              Key-value pair in document
		  Index             Index              Same concept
		  Join              $lookup, Embed     Combine data from multiple sources
		  Primary Key       _id field          Unique identifier (auto-generated)
		  Foreign Key       Reference          ObjectId pointing to another document
		  View              View               Read-only aggregation result
		  Transaction       Transaction        ACID operations (multi-document)
		  ```
-
- # Installation & Setup
  collapsed:: true
	- ## MongoDB Community Edition
		- ```bash
		  # Ubuntu/Debian
		  wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
		  echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
		  sudo apt-get update
		  sudo apt-get install -y mongodb-org
		  
		  # Start MongoDB
		  sudo systemctl start mongod
		  sudo systemctl enable mongod
		  
		  # macOS (Homebrew)
		  brew tap mongodb/brew
		  brew install mongodb-community
		  brew services start mongodb-community
		  
		  # Windows
		  # Download installer from mongodb.com/try/download/community
		  # Run installer and follow setup wizard
		  ```
	-
	- ## MongoDB Shell (mongosh)
		- ```bash
		  # Install mongosh
		  npm install -g mongosh
		  
		  # Connect to local MongoDB
		  mongosh
		  
		  # Connect to remote MongoDB
		  mongosh "mongodb://username:password@host:port/database"
		  
		  # Connect to MongoDB Atlas
		  mongosh "mongodb+srv://cluster.mongodb.net/myDatabase" --username myUser
		  ```
	-
	- ## MongoDB Atlas (Cloud)
		- Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
		- Create a free cluster (M0 tier)
		- Whitelist IP addresses
		- Create database user
		- Get connection string
		- ```javascript
		  // Connection string format
		  mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority
		  ```
	-
	- ## Docker Setup
		- ```bash
		  # Pull MongoDB image
		  docker pull mongo:latest
		  
		  # Run MongoDB container
		  docker run -d \
		    --name mongodb \
		    -p 27017:27017 \
		    -e MONGO_INITDB_ROOT_USERNAME=admin \
		    -e MONGO_INITDB_ROOT_PASSWORD=password \
		    -v mongodb_data:/data/db \
		    mongo:latest
		  
		  # Connect to container
		  docker exec -it mongodb mongosh -u admin -p password
		  ```
-
- # Core Concepts
  collapsed:: true
	- ## Database, Collection, Document
		- **Database** — Container for collections (like a database in SQL).
		- **Collection** — Group of documents (like a table in SQL).
		- **Document** — Single record in BSON format (like a row in SQL).
		- ```javascript
		  // Database structure
		  myDatabase
		    ├── users (collection)
		    │   ├── { _id: 1, name: "Alice", age: 25 } (document)
		    │   └── { _id: 2, name: "Bob", age: 30 }
		    └── products (collection)
		        ├── { _id: 1, title: "Laptop", price: 999 }
		        └── { _id: 2, title: "Mouse", price: 25 }
		  ```
	-
	- ## Understanding Documents — Real-World Analogy
		- Think of a MongoDB document like a **JSON object** or a **business card**.
		- Each business card can have different information, but all are still business cards.
		- ```javascript
		  // Business card 1: Full information
		  {
		    name: "Alice Johnson",
		    title: "Software Engineer",
		    company: "Tech Corp",
		    email: "alice@techcorp.com",
		    phone: "123-456-7890",
		    address: {
		      street: "123 Main St",
		      city: "San Francisco",
		      state: "CA"
		    },
		    skills: ["JavaScript", "Python", "MongoDB"]
		  }
		  
		  // Business card 2: Minimal information (still valid!)
		  {
		    name: "Bob Smith",
		    email: "bob@example.com"
		  }
		  
		  // Business card 3: Different structure (also valid!)
		  {
		    name: "Charlie Brown",
		    company: "Startup Inc",
		    socialMedia: {
		      twitter: "@charlie",
		      linkedin: "charlie-brown"
		    },
		    projects: ["Project A", "Project B"]
		  }
		  ```
	-
	- ## BSON (Binary JSON)
		- MongoDB stores documents in BSON format (binary-encoded JSON).
		- Supports additional data types: Date, ObjectId, Binary, Decimal128, etc.
		- More efficient for storage and traversal than plain JSON.
		- ```javascript
		  // JSON vs BSON
		  // JSON
		  { "name": "Alice", "age": 25 }
		  
		  // BSON (supports more types)
		  {
		    "_id": ObjectId("507f1f77bcf86cd799439011"),
		    "name": "Alice",
		    "age": NumberInt(25),
		    "createdAt": ISODate("2024-01-15T10:30:00Z"),
		    "balance": NumberDecimal("1234.56")
		  }
		  ```
	-
	- ## ObjectId
		- Default unique identifier for documents (_id field).
		- 12-byte identifier: 4-byte timestamp + 5-byte random + 3-byte counter.
		- Automatically generated if not provided.
		- **Why ObjectId instead of auto-increment?** — Works in distributed systems without coordination.
		- ```javascript
		  // ObjectId structure
		  ObjectId("507f1f77bcf86cd799439011")
		  // 507f1f77 - timestamp (seconds since epoch)
		  // bcf86c   - random value (machine + process)
		  // d79943   - counter (incremental)
		  // 9011     - random value
		  
		  // Extract timestamp from ObjectId
		  ObjectId("507f1f77bcf86cd799439011").getTimestamp()
		  // Returns: ISODate("2012-10-17T20:46:47.000Z")
		  
		  // Real-world benefit: Know when document was created without separate field
		  const userId = ObjectId("507f1f77bcf86cd799439011")
		  console.log("User created:", userId.getTimestamp())
		  
		  // Generate ObjectId manually
		  const newId = new ObjectId()
		  
		  // Use custom _id (not recommended unless you have good reason)
		  db.users.insertOne({
		    _id: "user-alice-2024",  // Custom string ID
		    name: "Alice"
		  })
		  ```
	-
	- ## Data Types
		- ```javascript
		  {
		    // String
		    "name": "Alice",
		    
		    // Numbers
		    "age": 25,                                    // Int32
		    "price": NumberDecimal("99.99"),              // Decimal128 (precise)
		    "views": NumberLong("9999999999"),            // Int64
		    "rating": 4.5,                                // Double
		    
		    // Boolean
		    "isActive": true,
		    
		    // Date
		    "createdAt": ISODate("2024-01-15T10:30:00Z"),
		    "timestamp": new Date(),
		    
		    // ObjectId
		    "_id": ObjectId("507f1f77bcf86cd799439011"),
		    
		    // Array
		    "tags": ["mongodb", "database", "nosql"],
		    "scores": [85, 90, 78],
		    
		    // Embedded Document (Object)
		    "address": {
		      "street": "123 Main St",
		      "city": "New York",
		      "zip": "10001"
		    },
		    
		    // Array of Documents
		    "orders": [
		      { "item": "Laptop", "qty": 1 },
		      { "item": "Mouse", "qty": 2 }
		    ],
		    
		    // Binary Data
		    "profilePic": BinData(0, "base64encodeddata"),
		    
		    // Null
		    "middleName": null,
		    
		    // Regular Expression
		    "pattern": /^test/i,
		    
		    // Code (JavaScript)
		    "script": Code("function() { return 1; }"),
		    
		    // MinKey / MaxKey (comparison)
		    "min": MinKey(),
		    "max": MaxKey()
		  }
		  ```
-
- # CRUD Operations
  collapsed:: true
	- ## Understanding CRUD — Real-World Analogy
		- **Create** — Adding a new contact to your phone
		- **Read** — Looking up a contact or searching contacts
		- **Update** — Changing someone's phone number
		- **Delete** — Removing an old contact
	-
	- ## Create (Insert)
		- ```javascript
		  // insertOne — insert a single document
		  // Returns: { acknowledged: true, insertedId: ObjectId("...") }
		  db.users.insertOne({
		    username: "alice_dev",
		    email: "alice@example.com",
		    passwordHash: "$2b$10$...",  // Always store hashed passwords
		    profile: {
		      firstName: "Alice",
		      lastName: "Johnson",
		      avatar: "https://cdn.example.com/avatars/alice.jpg"
		    },
		    roles: ["user"],
		    status: "active",
		    emailVerified: false,
		    createdAt: new Date(),
		    lastLogin: null
		  })
		  
		  // insertMany — insert multiple documents in one round trip
		  // Returns: { acknowledged: true, insertedIds: { '0': ObjectId("..."), ... } }
		  db.products.insertMany([
		    {
		      sku: "LAPTOP-001",
		      name: "Gaming Laptop",
		      price: 1299.99,
		      category: "Electronics",
		      stock: 50,
		      tags: ["gaming", "laptop", "high-performance"]
		    },
		    {
		      sku: "MOUSE-001",
		      name: "Wireless Mouse",
		      price: 29.99,
		      category: "Accessories",
		      stock: 200,
		      tags: ["wireless", "mouse", "ergonomic"]
		    }
		  ])
		  
		  // Always handle duplicate key errors (code 11000) in production
		  try {
		    const result = await db.users.insertOne({ email: "alice@example.com", name: "Alice" })
		    console.log("User created:", result.insertedId)
		  } catch (error) {
		    if (error.code === 11000) {
		      console.error("Duplicate email address")
		    } else {
		      throw error
		    }
		  }
		  ```
	-
	- ## Read (Query)
		- ```javascript
		  // find() — returns a cursor over all matching documents
		  db.users.find()  // All documents
		  
		  // Filter with query operators — find active verified users since 2024
		  db.users.find({
		    status: "active",
		    emailVerified: true,
		    createdAt: { $gte: new Date("2024-01-01") }
		  })
		  
		  // findOne() — returns the first matching document or null
		  // Real-world: user login lookup
		  const user = db.users.findOne({ email: "alice@example.com", status: "active" })
		  if (user) {
		    // Verify password, create session, etc.
		  }
		  
		  // Projection — include only needed fields (1=include, 0=exclude)
		  // Reduces data transferred over the network
		  db.users.find(
		    { status: "active" },
		    { username: 1, "profile.firstName": 1, "profile.avatar": 1, _id: 0 }
		  )
		  
		  // Pagination — sort + skip + limit
		  const page = 2
		  const pageSize = 20
		  db.users.find({ status: "active" })
		    .sort({ createdAt: -1 })
		    .skip((page - 1) * pageSize)
		    .limit(pageSize)
		  
		  // Product listing — sort by price desc, rating desc
		  db.products.find({ category: "Electronics" })
		    .sort({ price: -1, rating: -1 })
		    .limit(20)
		  
		  // countDocuments — exact count with filter
		  // estimatedDocumentCount — fast approximate total (no filter)
		  const stats = {
		    totalUsers: await db.users.estimatedDocumentCount(),
		    activeUsers: await db.users.countDocuments({ status: "active" }),
		    newUsersToday: await db.users.countDocuments({
		      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
		    })
		  }
		  
		  // distinct — unique values for a field, optionally filtered
		  const availableCategories = db.products.distinct("category")
		  const electronicBrands = db.products.distinct("brand", { category: "Electronics" })
		  ```
	-
	- ## Query Operators
		- ```javascript
		  // Comparison operators
		  db.products.find({ price: { $eq: 100 } })      // Equal
		  db.products.find({ price: { $ne: 100 } })      // Not equal
		  db.products.find({ price: { $gt: 100 } })      // Greater than
		  db.products.find({ price: { $gte: 100 } })     // Greater than or equal
		  db.products.find({ price: { $lt: 100 } })      // Less than
		  db.products.find({ price: { $lte: 100 } })     // Less than or equal
		  db.products.find({ price: { $in: [50, 100, 150] } })    // In array
		  db.products.find({ price: { $nin: [50, 100, 150] } })   // Not in array
		  
		  // Logical operators
		  db.products.find({
		    $and: [
		      { price: { $gte: 50 } },
		      { price: { $lte: 150 } }
		    ]
		  })
		  
		  db.products.find({
		    $or: [
		      { category: "Electronics" },
		      { price: { $lt: 50 } }
		    ]
		  })
		  
		  db.products.find({
		    $nor: [
		      { category: "Electronics" },
		      { price: { $lt: 50 } }
		    ]
		  })
		  
		  db.products.find({ price: { $not: { $gte: 100 } } })
		  
		  // Element operators
		  db.users.find({ middleName: { $exists: true } })   // Field exists
		  db.users.find({ age: { $type: "int" } })           // Field type
		  db.users.find({ age: { $type: "number" } })        // Any number type
		  
		  // Array operators
		  db.posts.find({ tags: "mongodb" })                 // Array contains value
		  db.posts.find({ tags: { $all: ["mongodb", "database"] } })  // Contains all
		  db.posts.find({ tags: { $size: 3 } })              // Array size
		  db.posts.find({ "comments.author": "Alice" })      // Nested array field
		  
		  db.posts.find({
		    comments: {
		      $elemMatch: {
		        author: "Alice",
		        rating: { $gte: 4 }
		      }
		    }
		  })
		  
		  // String operators
		  db.users.find({ name: { $regex: /^A/i } })  // Starts with A (case-insensitive)
		  
		  // Evaluation operators
		  db.products.find({
		    $expr: { $gt: ["$price", "$cost"] }  // Compare two fields: price > cost
		  })
		  ```
	-
	- ## Update
		- ```javascript
		  // Update one document
		  db.users.updateOne(
		    { name: "Alice" },           // Filter
		    { $set: { age: 26 } }        // Update
		  )
		  // Returns: { acknowledged: true, matchedCount: 1, modifiedCount: 1 }
		  
		  // Update multiple documents
		  db.users.updateMany(
		    { age: { $lt: 25 } },
		    { $set: { status: "young" } }
		  )
		  
		  // Replace entire document
		  db.users.replaceOne(
		    { name: "Alice" },
		    { name: "Alice", age: 26, email: "newemail@example.com" }
		  )
		  
		  // Update operators
		  db.users.updateOne(
		    { name: "Alice" },
		    {
		      $set: { age: 26, city: "NYC" },        // Set fields
		      $unset: { middleName: "" },            // Remove field
		      $inc: { loginCount: 1 },               // Increment
		      $mul: { score: 1.1 },                  // Multiply
		      $rename: { "name": "fullName" },       // Rename field
		      $min: { lowestScore: 50 },             // Set if value is less
		      $max: { highestScore: 100 },           // Set if value is greater
		      $currentDate: { lastModified: true }   // Set current date
		    }
		  )
		  
		  // Array update operators
		  db.posts.updateOne(
		    { _id: 1 },
		    {
		      $push: { tags: "new-tag" },            // Add to array
		      $pull: { tags: "old-tag" },            // Remove from array
		      $addToSet: { tags: "unique-tag" },     // Add if not exists
		      $pop: { tags: 1 },                     // Remove last element (1) or first (-1)
		      $pullAll: { tags: ["tag1", "tag2"] }   // Remove multiple values
		    }
		  )
		  
		  // Update array element
		  db.posts.updateOne(
		    { _id: 1, "comments.author": "Alice" },
		    { $set: { "comments.$.rating": 5 } }     // $ is positional operator
		  )
		  
		  // Update all array elements
		  db.posts.updateOne(
		    { _id: 1 },
		    { $inc: { "comments.$[].likes": 1 } }    // Increment all comments' likes
		  )
		  
		  // Update with array filters
		  db.posts.updateOne(
		    { _id: 1 },
		    { $set: { "comments.$[elem].verified": true } },
		    { arrayFilters: [{ "elem.rating": { $gte: 4 } }] }
		  )
		  
		  // Upsert (insert if not exists)
		  db.users.updateOne(
		    { email: "new@example.com" },
		    { $set: { name: "New User", age: 25 } },
		    { upsert: true }
		  )
		  ```
	-
	- ## Delete
		- ```javascript
		  // Delete one document
		  db.users.deleteOne({ name: "Alice" })
		  // Returns: { acknowledged: true, deletedCount: 1 }
		  
		  // Delete multiple documents
		  db.users.deleteMany({ age: { $lt: 18 } })
		  // Returns: { acknowledged: true, deletedCount: 5 }
		  
		  // Delete all documents in collection
		  db.users.deleteMany({})
		  
		  // Find and delete (returns deleted document)
		  db.users.findOneAndDelete(
		    { name: "Alice" },
		    { sort: { age: -1 } }  // Delete oldest Alice
		  )
		  ```
	-
	- ## Bulk Operations
		- ```javascript
		  // Bulk write operations
		  db.users.bulkWrite([
		    {
		      insertOne: {
		        document: { name: "Alice", age: 25 }
		      }
		    },
		    {
		      updateOne: {
		        filter: { name: "Bob" },
		        update: { $set: { age: 31 } }
		      }
		    },
		    {
		      updateMany: {
		        filter: { age: { $lt: 25 } },
		        update: { $set: { status: "young" } }
		      }
		    },
		    {
		      deleteOne: {
		        filter: { name: "Charlie" }
		      }
		    },
		    {
		      replaceOne: {
		        filter: { name: "Diana" },
		        replacement: { name: "Diana", age: 29, city: "LA" }
		      }
		    }
		  ], { ordered: false })  // Continue on error
		  ```
-
- # Aggregation Framework
  collapsed:: true
	- ## Pipeline Concept
		- Aggregation processes documents through a pipeline of stages.
		- Each stage transforms documents and passes results to next stage.
		- Similar to Unix pipes: `collection | stage1 | stage2 | stage3 | result`
		- ```javascript
		  db.collection.aggregate([
		    { $stage1: { ... } },
		    { $stage2: { ... } },
		    { $stage3: { ... } }
		  ])
		  ```
	-
	- ## Common Pipeline Stages
		- ```javascript
		  // $match - Filter documents (like find())
		  db.orders.aggregate([
		    { $match: { status: "completed", total: { $gte: 100 } } }
		  ])
		  
		  // $project - Select/transform fields
		  db.users.aggregate([
		    {
		      $project: {
		        name: 1,
		        email: 1,
		        fullName: { $concat: ["$firstName", " ", "$lastName"] },
		        _id: 0
		      }
		    }
		  ])
		  
		  // $group - Group documents and calculate aggregates
		  db.orders.aggregate([
		    {
		      $group: {
		        _id: "$customerId",              // Group by field
		        totalSpent: { $sum: "$amount" },
		        orderCount: { $sum: 1 },
		        avgOrder: { $avg: "$amount" },
		        maxOrder: { $max: "$amount" },
		        minOrder: { $min: "$amount" },
		        orders: { $push: "$orderId" }    // Collect into array
		      }
		    }
		  ])
		  
		  // $sort - Sort documents
		  db.products.aggregate([
		    { $sort: { price: -1, name: 1 } }  // Descending price, ascending name
		  ])
		  
		  // $limit - Limit number of documents
		  db.products.aggregate([
		    { $sort: { sales: -1 } },
		    { $limit: 10 }  // Top 10 products
		  ])
		  
		  // $skip - Skip documents
		  db.products.aggregate([
		    { $sort: { sales: -1 } },
		    { $skip: 20 },
		    { $limit: 10 }  // Page 3
		  ])
		  
		  // $unwind - Deconstruct array field
		  db.posts.aggregate([
		    { $unwind: "$tags" }  // Create document for each tag
		  ])
		  // Before: { _id: 1, title: "Post", tags: ["a", "b", "c"] }
		  // After:  { _id: 1, title: "Post", tags: "a" }
		  //         { _id: 1, title: "Post", tags: "b" }
		  //         { _id: 1, title: "Post", tags: "c" }
		  
		  // $lookup - Join collections (left outer join)
		  db.orders.aggregate([
		    {
		      $lookup: {
		        from: "customers",           // Collection to join
		        localField: "customerId",    // Field in orders
		        foreignField: "_id",         // Field in customers
		        as: "customerInfo"           // Output array field
		      }
		    }
		  ])
		  
		  // $addFields - Add new fields
		  db.products.aggregate([
		    {
		      $addFields: {
		        discountPrice: { $multiply: ["$price", 0.9] },
		        inStock: { $gt: ["$quantity", 0] }
		      }
		    }
		  ])
		  
		  // $count - Count documents
		  db.users.aggregate([
		    { $match: { age: { $gte: 25 } } },
		    { $count: "totalUsers" }
		  ])
		  
		  // $out - Write results to collection
		  db.orders.aggregate([
		    { $match: { status: "completed" } },
		    { $out: "completedOrders" }  // Creates/replaces collection
		  ])
		  
		  // $merge - Merge results into collection
		  db.orders.aggregate([
		    { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
		    { $merge: { into: "customerStats", whenMatched: "merge" } }
		  ])
		  ```
	-
	- ## Aggregation Operators
		- ```javascript
		  // Arithmetic operators
		  db.products.aggregate([
		    {
		      $project: {
		        total: { $add: ["$price", "$tax"] },
		        difference: { $subtract: ["$price", "$cost"] },
		        discounted: { $multiply: ["$price", 0.9] },
		        perUnit: { $divide: ["$totalPrice", "$quantity"] },
		        remainder: { $mod: ["$quantity", 10] },
		        absolute: { $abs: "$profit" },
		        rounded: { $round: ["$price", 2] },
		        ceiling: { $ceil: "$price" },
		        floor: { $floor: "$price" }
		      }
		    }
		  ])
		  
		  // String operators
		  db.users.aggregate([
		    {
		      $project: {
		        fullName: { $concat: ["$firstName", " ", "$lastName"] },
		        upper: { $toUpper: "$name" },
		        lower: { $toLower: "$email" },
		        substring: { $substr: ["$name", 0, 3] },
		        length: { $strLenCP: "$name" },
		        split: { $split: ["$email", "@"] },
		        trim: { $trim: { input: "$name" } }
		      }
		    }
		  ])
		  
		  // Array operators
		  db.posts.aggregate([
		    {
		      $project: {
		        tagCount: { $size: "$tags" },
		        firstTag: { $arrayElemAt: ["$tags", 0] },
		        lastTag: { $arrayElemAt: ["$tags", -1] },
		        slicedTags: { $slice: ["$tags", 2] },  // First 2 elements
		        hasTag: { $in: ["mongodb", "$tags"] },
		        allTags: { $concatArrays: ["$tags", "$categories"] }
		      }
		    }
		  ])
		  
		  // Conditional operators
		  db.products.aggregate([
		    {
		      $project: {
		        status: {
		          $cond: {
		            if: { $gte: ["$quantity", 10] },
		            then: "In Stock",
		            else: "Low Stock"
		          }
		        },
		        category: {
		          $switch: {
		            branches: [
		              { case: { $lt: ["$price", 50] }, then: "Budget" },
		              { case: { $lt: ["$price", 200] }, then: "Mid-range" },
		              { case: { $gte: ["$price", 200] }, then: "Premium" }
		            ],
		            default: "Unknown"
		          }
		        },
		        displayPrice: {
		          $ifNull: ["$salePrice", "$price"]  // Use salePrice if exists
		        }
		      }
		    }
		  ])
		  
		  // Date operators
		  db.orders.aggregate([
		    {
		      $project: {
		        year: { $year: "$orderDate" },
		        month: { $month: "$orderDate" },
		        day: { $dayOfMonth: "$orderDate" },
		        dayOfWeek: { $dayOfWeek: "$orderDate" },
		        hour: { $hour: "$orderDate" },
		        dateString: { $dateToString: {
		          format: "%Y-%m-%d",
		          date: "$orderDate"
		        }},
		        daysSinceOrder: {
		          $divide: [
		            { $subtract: [new Date(), "$orderDate"] },
		            1000 * 60 * 60 * 24
		          ]
		        }
		      }
		    }
		  ])
		  
		  // Type conversion
		  db.data.aggregate([
		    {
		      $project: {
		        priceAsString: { $toString: "$price" },
		        quantityAsInt: { $toInt: "$quantity" },
		        ratingAsDouble: { $toDouble: "$rating" },
		        dateAsString: { $toString: "$createdAt" }
		      }
		    }
		  ])
		  ```
	-
	- ## Complex Aggregation Examples
		- ```javascript
		  // Sales report by category and month
		  db.orders.aggregate([
		    { $match: { status: "completed" } },
		    {
		      $group: {
		        _id: {
		          category: "$category",
		          year: { $year: "$orderDate" },
		          month: { $month: "$orderDate" }
		        },
		        totalSales: { $sum: "$amount" },
		        orderCount: { $sum: 1 },
		        avgOrderValue: { $avg: "$amount" }
		      }
		    },
		    { $sort: { "_id.year": -1, "_id.month": -1, totalSales: -1 } }
		  ])
		  
		  // Top 5 customers with order details
		  db.orders.aggregate([
		    {
		      $group: {
		        _id: "$customerId",
		        totalSpent: { $sum: "$amount" },
		        orderCount: { $sum: 1 }
		      }
		    },
		    { $sort: { totalSpent: -1 } },
		    { $limit: 5 },
		    {
		      $lookup: {
		        from: "customers",
		        localField: "_id",
		        foreignField: "_id",
		        as: "customer"
		      }
		    },
		    { $unwind: "$customer" },
		    {
		      $project: {
		        _id: 0,
		        customerId: "$_id",
		        name: "$customer.name",
		        email: "$customer.email",
		        totalSpent: 1,
		        orderCount: 1,
		        avgOrderValue: { $divide: ["$totalSpent", "$orderCount"] }
		      }
		    }
		  ])
		  
		  // Product recommendations (frequently bought together)
		  db.orders.aggregate([
		    { $unwind: "$items" },
		    {
		      $lookup: {
		        from: "orders",
		        let: { orderId: "$_id" },
		        pipeline: [
		          { $match: { $expr: { $eq: ["$_id", "$$orderId"] } } },
		          { $unwind: "$items" }
		        ],
		        as: "relatedItems"
		      }
		    },
		    { $unwind: "$relatedItems" },
		    {
		      $match: {
		        $expr: { $ne: ["$items.productId", "$relatedItems.items.productId"] }
		      }
		    },
		    {
		      $group: {
		        _id: {
		          product: "$items.productId",
		          relatedProduct: "$relatedItems.items.productId"
		        },
		        frequency: { $sum: 1 }
		      }
		    },
		    { $sort: { frequency: -1 } }
		  ])
		  ```
	-
	- ## Faceted Search
		- ```javascript
		  // Multiple aggregations in single query
		  db.products.aggregate([
		    {
		      $facet: {
		        // Price ranges
		        priceRanges: [
		          {
		            $bucket: {
		              groupBy: "$price",
		              boundaries: [0, 50, 100, 200, 500],
		              default: "500+",
		              output: { count: { $sum: 1 } }
		            }
		          }
		        ],
		        // Top categories
		        topCategories: [
		          { $group: { _id: "$category", count: { $sum: 1 } } },
		          { $sort: { count: -1 } },
		          { $limit: 5 }
		        ],
		        // Statistics
		        stats: [
		          {
		            $group: {
		              _id: null,
		              avgPrice: { $avg: "$price" },
		              minPrice: { $min: "$price" },
		              maxPrice: { $max: "$price" },
		              totalProducts: { $sum: 1 }
		            }
		          }
		        ]
		      }
		    }
		  ])
		  ```
-
- # Indexing
  collapsed:: true
	- ## Index Basics
		- Indexes improve query performance by creating efficient data structures.
		- Without indexes, MongoDB performs collection scans (reads every document).
		- Indexes trade write performance and storage for faster reads.
		- Every collection has default index on `_id` field.
		- ```javascript
		  // Create single field index
		  db.users.createIndex({ email: 1 })  // 1 = ascending, -1 = descending
		  
		  // Create compound index (multiple fields)
		  db.users.createIndex({ lastName: 1, firstName: 1 })
		  
		  // Create unique index
		  db.users.createIndex({ email: 1 }, { unique: true })
		  
		  // Create sparse index (only documents with field)
		  db.users.createIndex({ phone: 1 }, { sparse: true })
		  
		  // Create TTL index (auto-delete after time)
		  db.sessions.createIndex(
		    { createdAt: 1 },
		    { expireAfterSeconds: 3600 }  // Delete after 1 hour
		  )
		  
		  // List all indexes
		  db.users.getIndexes()
		  
		  // Drop index
		  db.users.dropIndex("email_1")
		  db.users.dropIndex({ email: 1 })
		  
		  // Drop all indexes (except _id)
		  db.users.dropIndexes()
		  ```
	-
	- ## Index Types
		- ```javascript
		  // Single field index
		  db.products.createIndex({ price: 1 })
		  
		  // Compound index (order matters!)
		  db.products.createIndex({ category: 1, price: -1 })
		  // Good for: { category: "X" }, { category: "X", price: { $gte: 50 } }
		  // Not optimal for: { price: { $gte: 50 } } alone
		  
		  // Multikey index (array fields)
		  db.posts.createIndex({ tags: 1 })  // Automatically multikey if array
		  
		  // Text index (full-text search)
		  db.articles.createIndex({ title: "text", content: "text" })
		  db.articles.find({ $text: { $search: "mongodb tutorial" } })
		  
		  // Geospatial index (2dsphere for Earth-like sphere)
		  db.places.createIndex({ location: "2dsphere" })
		  db.places.find({
		    location: {
		      $near: {
		        $geometry: { type: "Point", coordinates: [-73.9667, 40.78] },
		        $maxDistance: 5000  // 5km
		      }
		    }
		  })
		  
		  // Hashed index (for sharding)
		  db.users.createIndex({ userId: "hashed" })
		  
		  // Wildcard index (index all fields)
		  db.products.createIndex({ "$**": 1 })
		  db.products.createIndex({ "attributes.$**": 1 })  // Specific path
		  ```
	-
	- ## Index Properties
		- ```javascript
		  // Unique index
		  db.users.createIndex(
		    { email: 1 },
		    { unique: true }
		  )
		  
		  // Partial index (index subset of documents)
		  db.orders.createIndex(
		    { customerId: 1, orderDate: -1 },
		    { partialFilterExpression: { status: "active" } }
		  )
		  
		  // Case-insensitive index
		  db.users.createIndex(
		    { email: 1 },
		    { collation: { locale: "en", strength: 2 } }
		  )
		  
		  // Background index creation (non-blocking)
		  db.users.createIndex(
		    { lastName: 1 },
		    { background: true }  // Deprecated in 4.2+, now default
		  )
		  
		  // Index with name
		  db.products.createIndex(
		    { category: 1, price: -1 },
		    { name: "category_price_idx" }
		  )
		  ```
	-
	- ## Index Performance Analysis
		- ```javascript
		  // Explain query execution
		  db.users.find({ age: { $gte: 25 } }).explain("executionStats")
		  
		  // Key metrics in explain output:
		  // - executionTimeMillis: Query execution time
		  // - totalDocsExamined: Documents scanned
		  // - totalKeysExamined: Index keys scanned
		  // - stage: IXSCAN (index scan) vs COLLSCAN (collection scan)
		  
		  // Analyze index usage
		  db.users.aggregate([
		    { $indexStats: {} }
		  ])
		  
		  // Check if index is used
		  db.users.find({ email: "alice@example.com" }).explain("executionStats")
		  // Look for: "stage": "IXSCAN" (good) vs "stage": "COLLSCAN" (bad)
		  
		  // Hint to force index usage
		  db.users.find({ age: 25 }).hint({ age: 1 })
		  db.users.find({ age: 25 }).hint("age_1")
		  ```
	-
	- ## Index Best Practices
		- **ESR Rule** — Equality, Sort, Range (order fields in compound index).
		- ```javascript
		  // Query: { status: "active", createdAt: { $gte: date } } sorted by createdAt
		  // Optimal index: { status: 1, createdAt: -1 }
		  // E (Equality): status
		  // S (Sort): createdAt
		  // R (Range): createdAt
		  ```
		- **Selectivity** — Index fields with high cardinality (many unique values).
		- **Covered Queries** — Query only uses indexed fields (no document fetch).
		- ```javascript
		  db.users.createIndex({ email: 1, name: 1 })
		  db.users.find(
		    { email: "alice@example.com" },
		    { email: 1, name: 1, _id: 0 }  // Covered query
		  )
		  ```
		- **Index Intersection** — MongoDB can use multiple indexes for single query.
		- **Avoid Over-Indexing** — Each index slows writes and uses memory.
		- **Monitor Index Usage** — Remove unused indexes.
-
- # Data Modeling
  collapsed:: true
	- ## Embedded vs Referenced
		- **Embedded Documents** — Store related data in single document.
		- **Referenced Documents** — Store references (like foreign keys in SQL).
		- ```javascript
		  // Embedded (denormalized)
		  {
		    _id: 1,
		    title: "Blog Post",
		    author: {
		      name: "Alice",
		      email: "alice@example.com"
		    },
		    comments: [
		      { user: "Bob", text: "Great post!", date: ISODate("2024-01-15") },
		      { user: "Charlie", text: "Thanks!", date: ISODate("2024-01-16") }
		    ]
		  }
		  
		  // Referenced (normalized)
		  // posts collection
		  {
		    _id: 1,
		    title: "Blog Post",
		    authorId: ObjectId("507f1f77bcf86cd799439011")
		  }
		  
		  // users collection
		  {
		    _id: ObjectId("507f1f77bcf86cd799439011"),
		    name: "Alice",
		    email: "alice@example.com"
		  }
		  
		  // comments collection
		  {
		    _id: 1,
		    postId: 1,
		    userId: ObjectId("507f1f77bcf86cd799439012"),
		    text: "Great post!",
		    date: ISODate("2024-01-15")
		  }
		  ```
	-
	- ## When to Embed vs Reference
		- **Embed when:**
			- One-to-one relationships
			- One-to-few relationships (small arrays)
			- Data is frequently accessed together
			- Data doesn't change often
			- Need atomic updates
		- **Reference when:**
			- One-to-many relationships (large arrays)
			- Many-to-many relationships
			- Data is accessed independently
			- Data changes frequently
			- Document size would exceed 16MB limit
			- Need to query related data separately
	-
	- ## Common Patterns
		- ```javascript
		  // One-to-One (Embedded)
		  {
		    _id: 1,
		    name: "Alice",
		    address: {
		      street: "123 Main St",
		      city: "NYC",
		      zip: "10001"
		    }
		  }
		  
		  // One-to-Few (Embedded Array)
		  {
		    _id: 1,
		    name: "Alice",
		    emails: [
		      "alice@work.com",
		      "alice@personal.com"
		    ]
		  }
		  
		  // One-to-Many (Referenced)
		  // user document
		  { _id: 1, name: "Alice" }
		  
		  // order documents
		  { _id: 101, userId: 1, total: 99.99 }
		  { _id: 102, userId: 1, total: 149.99 }
		  
		  // One-to-Squillions (Parent Reference)
		  // host document
		  { _id: "server1", name: "Web Server 1" }
		  
		  // log documents (millions)
		  { _id: 1, hostId: "server1", message: "Error", timestamp: ISODate() }
		  { _id: 2, hostId: "server1", message: "Warning", timestamp: ISODate() }
		  
		  // Many-to-Many (Array of References)
		  // student document
		  {
		    _id: 1,
		    name: "Alice",
		    courseIds: [101, 102, 103]
		  }
		  
		  // course document
		  {
		    _id: 101,
		    title: "MongoDB Basics",
		    studentIds: [1, 2, 3, 4]
		  }
		  
		  // Two-Way Referencing
		  // product document
		  {
		    _id: 1,
		    name: "Laptop",
		    categoryId: 10
		  }
		  
		  // category document
		  {
		    _id: 10,
		    name: "Electronics",
		    productIds: [1, 2, 3]
		  }
		  ```
	-
	- ## Schema Design Patterns
		- ```javascript
		  // Attribute Pattern (flexible schema)
		  {
		    _id: 1,
		    name: "Product A",
		    attributes: [
		      { key: "color", value: "red" },
		      { key: "size", value: "large" },
		      { key: "weight", value: "2kg" }
		    ]
		  }
		  db.products.createIndex({ "attributes.key": 1, "attributes.value": 1 })
		  
		  // Bucket Pattern (time-series data)
		  {
		    _id: 1,
		    sensorId: "sensor-1",
		    date: ISODate("2024-01-15"),
		    measurements: [
		      { time: ISODate("2024-01-15T00:00:00Z"), temp: 20.5 },
		      { time: ISODate("2024-01-15T00:01:00Z"), temp: 20.6 },
		      { time: ISODate("2024-01-15T00:02:00Z"), temp: 20.4 }
		    ]
		  }
		  
		  // Outlier Pattern (handle exceptions)
		  // Normal document
		  {
		    _id: 1,
		    productId: "prod-1",
		    reviews: [
		      { user: "Alice", rating: 5 },
		      { user: "Bob", rating: 4 }
		    ]
		  }
		  
		  // Outlier document (too many reviews)
		  {
		    _id: 2,
		    productId: "prod-2",
		    hasOverflow: true,
		    reviewCount: 10000
		  }
		  // Separate collection for overflow
		  db.reviewsOverflow.find({ productId: "prod-2" })
		  
		  // Computed Pattern (pre-calculate aggregations)
		  {
		    _id: 1,
		    productId: "prod-1",
		    totalReviews: 150,
		    avgRating: 4.5,
		    ratingDistribution: {
		      "5": 80,
		      "4": 40,
		      "3": 20,
		      "2": 7,
		      "1": 3
		    },
		    lastUpdated: ISODate("2024-01-15")
		  }
		  
		  // Subset Pattern (frequently accessed data)
		  // Main document
		  {
		    _id: 1,
		    title: "Movie Title",
		    recentReviews: [  // Last 10 reviews
		      { user: "Alice", rating: 5, text: "Great!" },
		      { user: "Bob", rating: 4, text: "Good" }
		    ],
		    totalReviews: 5000
		  }
		  // Full reviews in separate collection
		  db.allReviews.find({ movieId: 1 })
		  
		  // Extended Reference Pattern (denormalize frequently accessed fields)
		  {
		    _id: 1,
		    title: "Blog Post",
		    authorId: ObjectId("507f1f77bcf86cd799439011"),
		    authorName: "Alice",  // Denormalized for quick access
		    authorAvatar: "avatar.jpg"
		  }
		  ```
	-
	- ## Schema Validation
		- ```javascript
		  // Create collection with validation
		  db.createCollection("users", {
		    validator: {
		      $jsonSchema: {
		        bsonType: "object",
		        required: ["name", "email", "age"],
		        properties: {
		          name: {
		            bsonType: "string",
		            description: "must be a string and is required"
		          },
		          email: {
		            bsonType: "string",
		            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
		            description: "must be a valid email"
		          },
		          age: {
		            bsonType: "int",
		            minimum: 0,
		            maximum: 150,
		            description: "must be an integer between 0 and 150"
		          },
		          status: {
		            enum: ["active", "inactive", "pending"],
		            description: "can only be one of the enum values"
		          }
		        }
		      }
		    },
		    validationLevel: "strict",  // or "moderate"
		    validationAction: "error"   // or "warn"
		  })
		  
		  // Add validation to existing collection
		  db.runCommand({
		    collMod: "users",
		    validator: {
		      $jsonSchema: {
		        bsonType: "object",
		        required: ["email"]
		      }
		    }
		  })
		  ```
-
- # Replication
  collapsed:: true
	- ## Replica Sets
		- Replica set is a group of MongoDB instances that maintain the same data.
		- Provides high availability and data redundancy.
		- One primary node (accepts writes), multiple secondary nodes (replicate data).
		- Automatic failover if primary goes down.
		- ```
		  Replica Set Architecture:
		  
		  ┌─────────────┐
		  │   Primary   │ ← Writes go here
		  │   (Node 1)  │
		  └──────┬──────┘
		         │ Replication
		    ┌────┴────┐
		    ▼         ▼
		  ┌─────┐   ┌─────┐
		  │ Sec │   │ Sec │ ← Read from secondaries (optional)
		  │  2  │   │  3  │
		  └─────┘   └─────┘
		  ```
	-
	- ## Setting Up Replica Set
		- ```bash
		  # Start MongoDB instances
		  mongod --replSet rs0 --port 27017 --dbpath /data/db1
		  mongod --replSet rs0 --port 27018 --dbpath /data/db2
		  mongod --replSet rs0 --port 27019 --dbpath /data/db3
		  ```
		- ```javascript
		  // Connect to one instance and initiate replica set
		  mongosh --port 27017
		  
		  rs.initiate({
		    _id: "rs0",
		    members: [
		      { _id: 0, host: "localhost:27017" },
		      { _id: 1, host: "localhost:27018" },
		      { _id: 2, host: "localhost:27019" }
		    ]
		  })
		  
		  // Check replica set status
		  rs.status()
		  
		  // Check replica set configuration
		  rs.conf()
		  
		  // Add member to replica set
		  rs.add("localhost:27020")
		  
		  // Remove member
		  rs.remove("localhost:27020")
		  
		  // Step down primary (force election)
		  rs.stepDown()
		  ```
	-
	- ## Read Preference
		- ```javascript
		  // Read from primary only (default)
		  db.users.find().readPref("primary")
		  
		  // Read from primary, fallback to secondary
		  db.users.find().readPref("primaryPreferred")
		  
		  // Read from secondary only
		  db.users.find().readPref("secondary")
		  
		  // Read from secondary, fallback to primary
		  db.users.find().readPref("secondaryPreferred")
		  
		  // Read from nearest node (lowest latency)
		  db.users.find().readPref("nearest")
		  ```
	-
	- ## Write Concern
		- ```javascript
		  // Write acknowledged by primary only (default)
		  db.users.insertOne(
		    { name: "Alice" },
		    { writeConcern: { w: 1 } }
		  )
		  
		  // Write acknowledged by majority of nodes
		  db.users.insertOne(
		    { name: "Bob" },
		    { writeConcern: { w: "majority" } }
		  )
		  
		  // Write acknowledged by all nodes
		  db.users.insertOne(
		    { name: "Charlie" },
		    { writeConcern: { w: 3 } }
		  )
		  
		  // Write with timeout
		  db.users.insertOne(
		    { name: "Diana" },
		    { writeConcern: { w: "majority", wtimeout: 5000 } }
		  )
		  
		  // Journaled write (persisted to disk)
		  db.users.insertOne(
		    { name: "Eve" },
		    { writeConcern: { w: 1, j: true } }
		  )
		  ```
	-
	- ## Arbiter Node
		- Arbiter participates in elections but doesn't hold data.
		- Used to break ties in replica sets with even number of nodes.
		- ```javascript
		  // Add arbiter
		  rs.addArb("localhost:27020")
		  ```
	-
	- ## Priority and Hidden Members
		- ```javascript
		  // Set member priority (higher = more likely to become primary)
		  cfg = rs.conf()
		  cfg.members[1].priority = 2  // Higher priority
		  cfg.members[2].priority = 0  // Never becomes primary
		  rs.reconfig(cfg)
		  
		  // Hidden member (for backups, analytics)
		  cfg = rs.conf()
		  cfg.members[2].hidden = true
		  cfg.members[2].priority = 0
		  rs.reconfig(cfg)
		  
		  // Delayed member (for disaster recovery)
		  cfg = rs.conf()
		  cfg.members[2].slaveDelay = 3600  // 1 hour delay
		  cfg.members[2].priority = 0
		  cfg.members[2].hidden = true
		  rs.reconfig(cfg)
		  ```
-
- # Sharding
  collapsed:: true
	- ## Sharding Concept
		- Sharding distributes data across multiple servers (shards).
		- Enables horizontal scaling for large datasets.
		- Each shard is a replica set.
		- ```
		  Sharded Cluster Architecture:
		  
		  ┌──────────────┐
		  │   mongos     │ ← Query router
		  │  (Router)    │
		  └───────┬──────┘
		          │
		     ┌────┴────┬────────┐
		     ▼         ▼        ▼
		  ┌─────┐  ┌─────┐  ┌─────┐
		  │Shard│  │Shard│  │Shard│ ← Data distributed
		  │  1  │  │  2  │  │  3  │
		  └─────┘  └─────┘  └─────┘
		  
		  ┌──────────────┐
		  │ Config Server│ ← Metadata
		  │  Replica Set │
		  └──────────────┘
		  ```
	-
	- ## Shard Key
		- Field(s) used to distribute documents across shards.
		- Immutable once set.
		- Good shard key: high cardinality, even distribution, query isolation.
		- ```javascript
		  // Enable sharding on database
		  sh.enableSharding("myDatabase")
		  
		  // Shard collection by field
		  sh.shardCollection("myDatabase.users", { userId: 1 })
		  
		  // Compound shard key
		  sh.shardCollection("myDatabase.orders", { customerId: 1, orderDate: 1 })
		  
		  // Hashed shard key (even distribution)
		  sh.shardCollection("myDatabase.logs", { _id: "hashed" })
		  ```
	-
	- ## Shard Key Strategies
		- ```javascript
		  // Range-based sharding (good for range queries)
		  sh.shardCollection("myDatabase.users", { age: 1 })
		  // Shard 1: age 0-30
		  // Shard 2: age 31-60
		  // Shard 3: age 61+
		  
		  // Hashed sharding (even distribution)
		  sh.shardCollection("myDatabase.users", { _id: "hashed" })
		  // Evenly distributes based on hash of _id
		  
		  // Compound shard key (query isolation + distribution)
		  sh.shardCollection("myDatabase.orders", { storeId: 1, orderId: 1 })
		  // Queries with storeId go to specific shard
		  ```
	-
	- ## Chunk Management
		- ```javascript
		  // View chunk distribution
		  sh.status()
		  
		  // Split chunk manually
		  sh.splitAt("myDatabase.users", { userId: 50000 })
		  
		  // Move chunk to different shard
		  sh.moveChunk("myDatabase.users", { userId: 50000 }, "shard0001")
		  
		  // Enable/disable balancer
		  sh.stopBalancer()
		  sh.startBalancer()
		  sh.getBalancerState()
		  
		  // Set balancer window
		  db.settings.update(
		    { _id: "balancer" },
		    { $set: { activeWindow: { start: "23:00", stop: "06:00" } } },
		    { upsert: true }
		  )
		  ```
	-
	- ## Targeted vs Broadcast Queries
		- ```javascript
		  // Targeted query (includes shard key)
		  db.users.find({ userId: 12345 })  // Goes to specific shard
		  
		  // Broadcast query (no shard key)
		  db.users.find({ email: "alice@example.com" })  // Queries all shards
		  
		  // Compound shard key query
		  sh.shardCollection("myDatabase.orders", { storeId: 1, orderId: 1 })
		  db.orders.find({ storeId: 5 })  // Targeted (prefix of shard key)
		  db.orders.find({ orderId: 100 })  // Broadcast (not prefix)
		  ```
-
- # Transactions
  collapsed:: true
	- ## ACID Transactions
		- MongoDB supports multi-document ACID transactions (since 4.0).
		- Transactions work across multiple documents, collections, and databases.
		- Replica sets and sharded clusters support transactions.
		- ```javascript
		  // Start session
		  const session = db.getMongo().startSession()
		  
		  // Start transaction
		  session.startTransaction()
		  
		  try {
		    const usersCol = session.getDatabase("myDB").users
		    const accountsCol = session.getDatabase("myDB").accounts
		    
		    // Operations within transaction
		    usersCol.updateOne(
		      { _id: 1 },
		      { $inc: { balance: -100 } }
		    )
		    
		    accountsCol.updateOne(
		      { _id: 2 },
		      { $inc: { balance: 100 } }
		    )
		    
		    // Commit transaction
		    session.commitTransaction()
		    console.log("Transaction committed")
		  } catch (error) {
		    // Abort transaction on error
		    session.abortTransaction()
		    console.log("Transaction aborted:", error)
		  } finally {
		    session.endSession()
		  }
		  ```
	-
	- ## Transaction Options
		- ```javascript
		  // Transaction with options
		  session.startTransaction({
		    readConcern: { level: "snapshot" },
		    writeConcern: { w: "majority" },
		    readPreference: "primary",
		    maxCommitTimeMS: 30000  // 30 seconds timeout
		  })
		  ```
	-
	- ## Callback API (Recommended)
		- ```javascript
		  // Using callback API (handles retries automatically)
		  const session = db.getMongo().startSession()
		  
		  session.withTransaction(async () => {
		    const usersCol = session.getDatabase("myDB").users
		    const accountsCol = session.getDatabase("myDB").accounts
		    
		    await usersCol.updateOne(
		      { _id: 1 },
		      { $inc: { balance: -100 } },
		      { session }
		    )
		    
		    await accountsCol.updateOne(
		      { _id: 2 },
		      { $inc: { balance: 100 } },
		      { session }
		    )
		  })
		  
		  session.endSession()
		  ```
	-
	- ## Transaction Best Practices
		- Keep transactions short (avoid long-running operations).
		- Limit number of operations per transaction.
		- Use appropriate read/write concerns.
		- Handle transient transaction errors with retry logic.
		- Avoid transactions for single-document operations (atomic by default).
		- Consider document design to minimize need for transactions.
-
- # Performance Optimization
  collapsed:: true
	- ## Query Optimization
		- Every query should return only what the client actually needs. Projection cuts down the data transferred over the network. Indexes let MongoDB jump directly to matching documents instead of scanning the whole collection. Covered queries are the fastest possible — MongoDB answers them entirely from the index without touching any documents. Prefer `$in` over multiple `$or` clauses; MongoDB optimizes `$in` into a single index scan.
		- ```javascript
		  // Use projection to limit returned fields
		  db.users.find(
		    { age: { $gte: 25 } },
		    { name: 1, email: 1, _id: 0 }
		  )
		  
		  // Use indexes for frequently queried fields
		  db.users.createIndex({ email: 1 })
		  
		  // Avoid $where and $regex without index
		  // Bad: db.users.find({ $where: "this.age > 25" })
		  // Good: db.users.find({ age: { $gt: 25 } })
		  
		  // Use covered queries (query only indexed fields)
		  db.users.createIndex({ email: 1, name: 1 })
		  db.users.find(
		    { email: "alice@example.com" },
		    { email: 1, name: 1, _id: 0 }
		  )
		  
		  // Limit results
		  db.users.find().limit(100)
		  
		  // Use $in instead of multiple $or
		  // Bad: { $or: [{ status: "A" }, { status: "B" }, { status: "C" }] }
		  // Good: { status: { $in: ["A", "B", "C"] } }
		  ```
	-
	- ## Aggregation Optimization
		- The aggregation pipeline processes documents stage by stage. Placing `$match` first means fewer documents flow through the rest of the pipeline — this is the single biggest win. `$project` early reduces document size so subsequent stages work on less data. When `$match` and `$sort` fields are indexed, MongoDB can use the index instead of loading documents into memory. For pipelines that process more data than fits in RAM (100MB limit by default), `allowDiskUse: true` spills to disk instead of failing.
		- ```javascript
		  // Put $match early in pipeline
		  db.orders.aggregate([
		    { $match: { status: "completed" } },  // Filter first
		    { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
		    { $sort: { total: -1 } }
		  ])
		  
		  // Use $project to reduce document size early
		  db.orders.aggregate([
		    { $project: { customerId: 1, amount: 1 } },  // Only needed fields
		    { $group: { _id: "$customerId", total: { $sum: "$amount" } } }
		  ])
		  
		  // Use indexes for $match and $sort
		  db.orders.createIndex({ status: 1, orderDate: -1 })
		  db.orders.aggregate([
		    { $match: { status: "completed" } },
		    { $sort: { orderDate: -1 } }
		  ])
		  
		  // Avoid $lookup when possible (use embedded documents)
		  // Use allowDiskUse for large aggregations
		  db.orders.aggregate(
		    [ /* pipeline */ ],
		    { allowDiskUse: true }
		  )
		  ```
	-
	- ## Connection Pooling
		- Opening a new TCP connection to MongoDB for every request is expensive — it adds 10–50ms of overhead and can exhaust server resources under load. A connection pool keeps a set of connections open and reuses them across requests. `maxPoolSize` caps total connections (default 100); `minPoolSize` keeps warm connections ready so the first requests after idle periods don't pay the connection cost. `waitQueueTimeoutMS` prevents requests from hanging forever if all connections are busy.
		- ```javascript
		  // Node.js driver connection pooling
		  const { MongoClient } = require('mongodb')
		  
		  const client = new MongoClient(uri, {
		    maxPoolSize: 50,        // Max connections
		    minPoolSize: 10,        // Min connections
		    maxIdleTimeMS: 30000,   // Close idle connections after 30s
		    waitQueueTimeoutMS: 5000  // Wait 5s for available connection
		  })
		  ```
	-
	- ## Monitoring & Profiling
		- The database profiler captures slow queries to the `system.profile` collection so you can find and fix them. Level 1 logs only queries slower than `slowms` (recommended for production). Level 2 logs everything (use only in development — it's very noisy). `currentOp()` shows what's running right now, useful for finding stuck operations. `db.stats()` and `db.users.stats()` give storage and index size breakdowns per database and collection.
		- ```javascript
		  // Enable profiling (level 0=off, 1=slow, 2=all)
		  db.setProfilingLevel(1, { slowms: 100 })  // Log queries > 100ms
		  
		  // View slow queries
		  db.system.profile.find().sort({ ts: -1 }).limit(10)
		  
		  // Current operations
		  db.currentOp()
		  
		  // Kill long-running operation
		  db.killOp(12345)
		  
		  // Database statistics
		  db.stats()
		  
		  // Collection statistics
		  db.users.stats()
		  
		  // Server status
		  db.serverStatus()
		  
		  // Index statistics
		  db.users.aggregate([{ $indexStats: {} }])
		  ```
	-
	- ## Memory Management
		- MongoDB's WiredTiger storage engine uses an in-memory cache to serve reads without hitting disk. By default it takes 50% of available RAM minus 1GB. If your working set (hot data + indexes) fits in cache, reads are fast. If it doesn't, MongoDB reads from disk on every cache miss — performance degrades sharply. Monitor `wiredTiger.cache` to see how full the cache is and whether pages are being evicted. Set `cacheSizeGB` explicitly in production so MongoDB doesn't compete with the OS page cache.
		- ```javascript
		  // Check memory usage
		  db.serverStatus().mem
		  
		  // WiredTiger cache size (default: 50% of RAM - 1GB)
		  // Set in mongod.conf:
		  // storage:
		  //   wiredTiger:
		  //     engineConfig:
		  //       cacheSizeGB: 2
		  
		  // Monitor working set
		  db.serverStatus().wiredTiger.cache
		  ```
	-
	- ## Bulk Operations
		- Sending 10,000 individual `insertOne` calls means 10,000 round trips to the server. Bulk operations batch multiple writes into a single network request, dramatically reducing overhead. Unordered bulk ops run in parallel and continue on error — best for independent inserts. Ordered bulk ops stop at the first error — use when operation order matters (e.g., insert then update the same document).
		- ```javascript
		  // Use bulk operations for multiple writes
		  const bulk = db.users.initializeUnorderedBulkOp()
		  
		  for (let i = 0; i < 10000; i++) {
		    bulk.insert({ name: `User${i}`, age: Math.floor(Math.random() * 50) })
		  }
		  
		  bulk.execute()
		  
		  // Ordered vs unordered
		  db.users.initializeOrderedBulkOp()    // Stops on first error
		  db.users.initializeUnorderedBulkOp()  // Continues on error
		  ```
-
- # Security
  collapsed:: true
	- ## Authentication
		- By default MongoDB runs without authentication — anyone who can reach the port has full access. Always enable authentication in production by setting `security.authorization: enabled` in `mongod.conf`. The admin database is the root — create your admin user there first, then create per-database users with the minimum roles they need (principle of least privilege). Never use the `root` role for application users.
		- ```javascript
		  // Create admin user
		  use admin
		  db.createUser({
		    user: "admin",
		    pwd: "securePassword",
		    roles: [{ role: "userAdminAnyDatabase", db: "admin" }]
		  })
		  
		  // Create database user
		  use myDatabase
		  db.createUser({
		    user: "appUser",
		    pwd: "appPassword",
		    roles: [
		      { role: "readWrite", db: "myDatabase" }
		    ]
		  })
		  
		  // Create read-only user
		  db.createUser({
		    user: "readOnlyUser",
		    pwd: "password",
		    roles: [{ role: "read", db: "myDatabase" }]
		  })
		  
		  // View users
		  db.getUsers()
		  
		  // Update user password
		  db.changeUserPassword("appUser", "newPassword")
		  
		  // Grant role to user
		  db.grantRolesToUser("appUser", [{ role: "dbAdmin", db: "myDatabase" }])
		  
		  // Revoke role from user
		  db.revokeRolesFromUser("appUser", [{ role: "dbAdmin", db: "myDatabase" }])
		  
		  // Drop user
		  db.dropUser("appUser")
		  ```
	-
	- ## Built-in Roles
		- MongoDB ships with a hierarchy of built-in roles covering every access level. Database-scoped roles (`read`, `readWrite`, `dbAdmin`) apply to a single database. All-database roles (`readAnyDatabase`, `readWriteAnyDatabase`) span every database on the server. Cluster roles manage replica sets and sharding. For most applications, `readWrite` on the specific database is all you need — never grant `root` or `dbAdminAnyDatabase` to an app user.
		- ```javascript
		  // Database roles
		  read              // Read data from all non-system collections
		  readWrite         // Read and write data
		  dbAdmin           // Database administration
		  dbOwner           // Database owner (all privileges)
		  userAdmin         // Create and modify users
		  
		  // Cluster roles
		  clusterAdmin      // Cluster administration
		  clusterManager    // Manage cluster
		  clusterMonitor    // Monitor cluster
		  hostManager       // Monitor and manage servers
		  
		  // Backup/restore roles
		  backup            // Backup data
		  restore           // Restore data
		  
		  // All-database roles
		  readAnyDatabase   // Read all databases
		  readWriteAnyDatabase  // Read/write all databases
		  userAdminAnyDatabase  // User admin for all databases
		  dbAdminAnyDatabase    // DB admin for all databases
		  
		  // Superuser role
		  root              // Full access to all resources
		  ```
	-
	- ## Custom Roles
		- Built-in roles are often too broad for production. A custom role lets you grant exactly the actions needed on exactly the collections needed — nothing more. For example, an analytics service might need `find` on `orders` and `products` but should never be able to insert or delete. Custom roles are defined in the `admin` database and can be granted to any user across any database.
		- ```javascript
		  // Create custom role
		  use admin
		  db.createRole({
		    role: "customRole",
		    privileges: [
		      {
		        resource: { db: "myDatabase", collection: "users" },
		        actions: ["find", "insert", "update"]
		      },
		      {
		        resource: { db: "myDatabase", collection: "orders" },
		        actions: ["find"]
		      }
		    ],
		    roles: []
		  })
		  
		  // Grant custom role to user
		  db.grantRolesToUser("appUser", [{ role: "customRole", db: "admin" }])
		  ```
	-
	- ## Network Security
		- `bindIp` controls which network interfaces MongoDB listens on. The default `127.0.0.1` means only local connections — safe for development. In production, bind to the server's private IP only, never `0.0.0.0` without a firewall. TLS encrypts all traffic between clients and the server, preventing eavesdropping on the network. `clusterAuthMode: x509` uses certificates for inter-node authentication in replica sets instead of a shared keyfile.
		- ```yaml
		  # mongod.conf
		  net:
		    bindIp: 127.0.0.1,192.168.1.100  # Bind to specific IPs
		    port: 27017
		    tls:
		      mode: requireTLS
		      certificateKeyFile: /path/to/cert.pem
		      CAFile: /path/to/ca.pem
		  
		  security:
		    authorization: enabled
		    clusterAuthMode: x509
		  ```
	-
	- ## Encryption
		- Encryption at rest protects data files on disk — if someone steals the physical drive or a cloud snapshot, they can't read the data without the encryption key. This is an Enterprise-only feature using the WiredTiger encrypted storage engine. Encryption in transit (TLS) protects data moving over the network between your app and MongoDB. Both should be enabled in any production environment handling sensitive data.
		- ```yaml
		  # Encryption at rest (Enterprise only)
		  security:
		    enableEncryption: true
		    encryptionKeyFile: /path/to/keyfile
		  
		  # Encryption in transit (TLS/SSL)
		  net:
		    tls:
		      mode: requireTLS
		      certificateKeyFile: /path/to/cert.pem
		  ```
	-
	- ## Auditing (Enterprise)
		- Auditing records who did what and when — essential for compliance (HIPAA, SOC 2, PCI-DSS) and forensic investigation after a security incident. The `filter` field lets you log only specific operation types (authentication, user management, data access) to keep log volume manageable. Logs are written as JSON to a file, making them easy to ship to a SIEM like Splunk or Datadog.
		- ```yaml
		  # mongod.conf
		  auditLog:
		    destination: file
		    format: JSON
		    path: /var/log/mongodb/audit.json
		    filter: '{ atype: { $in: ["authenticate", "createUser", "dropUser"] } }'
		  ```
	-
	- ## Field-Level Encryption
		- Client-Side Field Level Encryption (CSFLE) encrypts specific sensitive fields (SSN, credit card, medical data) on the client before they ever reach the server. Even MongoDB itself — and anyone with database access — sees only ciphertext for those fields. The encryption keys are managed separately (AWS KMS, Azure Key Vault, GCP KMS, or local). This is the strongest data protection MongoDB offers, as the server never sees plaintext for encrypted fields.
		- ```javascript
		  // Client-side field level encryption (CSFLE)
		  const { MongoClient, ClientEncryption } = require('mongodb')
		  
		  const client = new MongoClient(uri, {
		    autoEncryption: {
		      keyVaultNamespace: 'encryption.__keyVault',
		      kmsProviders: {
		        local: {
		          key: Buffer.from('your-local-master-key', 'base64')
		        }
		      }
		    }
		  })
		  
		  // Encrypted field in schema
		  {
		    name: "Alice",
		    ssn: Binary(Buffer.from("encrypted-data"), 6),  // Encrypted
		    email: "alice@example.com"
		  }
		  ```
-
- # Backup & Restore
  collapsed:: true
	- ## mongodump & mongorestore
		- `mongodump` is MongoDB's built-in logical backup tool. It reads documents from the database and writes them as BSON files to disk. It works on any MongoDB deployment (local, Atlas, replica set) and supports filtering by database, collection, or query. The `--gzip --archive` flags produce a single compressed file instead of a directory tree — easier to store and transfer. `mongorestore` reverses the process. Use `--drop` when restoring to a non-empty database to avoid merging old and new data.
		- ```bash
		  # Backup entire database
		  mongodump --uri="mongodb://localhost:27017" --out=/backup/
		  
		  # Backup specific database
		  mongodump --db=myDatabase --out=/backup/
		  
		  # Backup specific collection
		  mongodump --db=myDatabase --collection=users --out=/backup/
		  
		  # Backup with authentication
		  mongodump --uri="mongodb://user:pass@localhost:27017/myDatabase" --out=/backup/
		  
		  # Compressed backup
		  mongodump --gzip --archive=/backup/mydb.gz
		  
		  # Restore entire backup
		  mongorestore /backup/
		  
		  # Restore specific database
		  mongorestore --db=myDatabase /backup/myDatabase/
		  
		  # Restore with drop (replace existing)
		  mongorestore --drop /backup/
		  
		  # Restore from compressed archive
		  mongorestore --gzip --archive=/backup/mydb.gz
		  ```
	-
	- ## mongoexport & mongoimport
		- `mongoexport` exports a single collection to JSON or CSV — useful for sharing data with other systems, loading into spreadsheets, or migrating to a different database. Unlike `mongodump`, the output is human-readable. `mongoimport` is the reverse. The `--mode=upsert` flag is powerful for incremental imports — it updates existing documents by `_id` instead of failing on duplicates, making it safe to re-run the same import multiple times.
		- ```bash
		  # Export collection to JSON
		  mongoexport --db=myDatabase --collection=users --out=users.json
		  
		  # Export to CSV
		  mongoexport --db=myDatabase --collection=users --type=csv --fields=name,email,age --out=users.csv
		  
		  # Export with query
		  mongoexport --db=myDatabase --collection=users --query='{"age":{"$gte":25}}' --out=users.json
		  
		  # Import from JSON
		  mongoimport --db=myDatabase --collection=users --file=users.json
		  
		  # Import from CSV
		  mongoimport --db=myDatabase --collection=users --type=csv --headerline --file=users.csv
		  
		  # Import with upsert
		  mongoimport --db=myDatabase --collection=users --mode=upsert --file=users.json
		  ```
	-
	- ## Filesystem Snapshots
		- Filesystem snapshots (LVM, AWS EBS, Azure Disk) are the fastest backup method for large databases — they capture the entire disk state in seconds regardless of database size. The critical step is `db.fsyncLock()` before snapshotting: this flushes all pending writes to disk and blocks new writes, ensuring the snapshot is consistent. Without locking, you risk capturing a partially-written state that can't be restored cleanly. Always unlock immediately after the snapshot completes.
		- ```bash
		  # Stop writes (lock database)
		  db.fsyncLock()
		  
		  # Create filesystem snapshot (LVM, EBS, etc.)
		  # ... snapshot commands ...
		  
		  # Unlock database
		  db.fsyncUnlock()
		  ```
	-
	- ## Cloud Backup (Atlas)
		- MongoDB Atlas handles backups automatically with no manual intervention. Continuous backups stream the oplog in real time, enabling point-in-time recovery to any second within the retention window — useful for recovering from accidental deletes or data corruption. Snapshot backups capture the full cluster state at scheduled intervals (hourly, daily, weekly). Backups are stored in a separate cloud region from your cluster, so a regional outage doesn't take out both your data and your backup.
-
- # MongoDB with Programming Languages
  collapsed:: true
	- ## Basic CRUD Operations
		- Each language has an official MongoDB driver that maps the shell's JavaScript API to idiomatic language constructs. The pattern is always the same: create a `MongoClient` with the connection URI, get a database handle, get a collection handle, then call CRUD methods. All drivers support async/await (Node.js), coroutines (Python with Motor), futures (Java), and goroutines (Go). Always close the client when the application shuts down to release connections back to the pool.
		- :::code-tabs
		  ```javascript
		  // Node.js - Install: npm install mongodb
		  const { MongoClient } = require('mongodb')
		  
		  async function main() {
		    const uri = "mongodb://localhost:27017"
		    const client = new MongoClient(uri)
		    
		    try {
		      await client.connect()
		      const db = client.db('myDatabase')
		      const users = db.collection('users')
		      
		      // Insert
		      const insertResult = await users.insertOne({
		        name: "Alice",
		        age: 25,
		        email: "alice@example.com"
		      })
		      console.log(`Inserted: ${insertResult.insertedId}`)
		      
		      // Find one
		      const user = await users.findOne({ name: "Alice" })
		      console.log(user)
		      
		      // Find many
		      const cursor = users.find({ age: { $gte: 25 } })
		      await cursor.forEach(doc => console.log(doc))
		      
		      // Update
		      await users.updateOne(
		        { name: "Alice" },
		        { $set: { age: 26 } }
		      )
		      
		      // Delete
		      await users.deleteOne({ name: "Alice" })
		      
		    } finally {
		      await client.close()
		    }
		  }
		  
		  main().catch(console.error)
		  ```
		  ```python
		  # Python - Install: pip install pymongo
		  from pymongo import MongoClient
		  from datetime import datetime
		  
		  def main():
		      # Connection
		      client = MongoClient('mongodb://localhost:27017/')
		      db = client['myDatabase']
		      users = db['users']
		      
		      # Insert
		      result = users.insert_one({
		          'name': 'Alice',
		          'age': 25,
		          'email': 'alice@example.com',
		          'createdAt': datetime.now()
		      })
		      print(f"Inserted: {result.inserted_id}")
		      
		      # Find one
		      user = users.find_one({'name': 'Alice'})
		      print(user)
		      
		      # Find many
		      for user in users.find({'age': {'$gte': 25}}):
		          print(user)
		      
		      # Update
		      users.update_one(
		          {'name': 'Alice'},
		          {'$set': {'age': 26}}
		      )
		      
		      # Delete
		      users.delete_one({'name': 'Alice'})
		      
		      # Close connection
		      client.close()
		  
		  if __name__ == '__main__':
		      main()
		  ```
		  ```java
		  // Java - Add dependency: org.mongodb:mongodb-driver-sync:4.11.0
		  import com.mongodb.client.*;
		  import org.bson.Document;
		  import static com.mongodb.client.model.Filters.*;
		  import static com.mongodb.client.model.Updates.*;
		  
		  public class MongoExample {
		      public static void main(String[] args) {
		          // Connection
		          MongoClient client = MongoClients.create("mongodb://localhost:27017");
		          MongoDatabase database = client.getDatabase("myDatabase");
		          MongoCollection<Document> users = database.getCollection("users");
		          
		          // Insert
		          Document user = new Document("name", "Alice")
		              .append("age", 25)
		              .append("email", "alice@example.com");
		          users.insertOne(user);
		          System.out.println("Inserted: " + user.getObjectId("_id"));
		          
		          // Find one
		          Document found = users.find(eq("name", "Alice")).first();
		          System.out.println(found.toJson());
		          
		          // Find many
		          for (Document doc : users.find(gte("age", 25))) {
		              System.out.println(doc.toJson());
		          }
		          
		          // Update
		          users.updateOne(
		              eq("name", "Alice"),
		              set("age", 26)
		          );
		          
		          // Delete
		          users.deleteOne(eq("name", "Alice"));
		          
		          // Close
		          client.close();
		      }
		  }
		  ```
		  ```csharp
		  // C# - Install: dotnet add package MongoDB.Driver
		  using MongoDB.Driver;
		  using MongoDB.Bson;
		  
		  class Program
		  {
		      static async Task Main(string[] args)
		      {
		          // Connection
		          var client = new MongoClient("mongodb://localhost:27017");
		          var database = client.GetDatabase("myDatabase");
		          var users = database.GetCollection<BsonDocument>("users");
		          
		          // Insert
		          var user = new BsonDocument
		          {
		              { "name", "Alice" },
		              { "age", 25 },
		              { "email", "alice@example.com" }
		          };
		          await users.InsertOneAsync(user);
		          Console.WriteLine($"Inserted: {user["_id"]}");
		          
		          // Find one
		          var filter = Builders<BsonDocument>.Filter.Eq("name", "Alice");
		          var found = await users.Find(filter).FirstOrDefaultAsync();
		          Console.WriteLine(found.ToJson());
		          
		          // Find many
		          var ageFilter = Builders<BsonDocument>.Filter.Gte("age", 25);
		          var cursor = await users.FindAsync(ageFilter);
		          await cursor.ForEachAsync(doc => Console.WriteLine(doc.ToJson()));
		          
		          // Update
		          var update = Builders<BsonDocument>.Update.Set("age", 26);
		          await users.UpdateOneAsync(filter, update);
		          
		          // Delete
		          await users.DeleteOneAsync(filter);
		      }
		  }
		  ```
		  ```go
		  // Go - Install: go get go.mongodb.org/mongo-driver/mongo
		  package main
		  
		  import (
		      "context"
		      "fmt"
		      "go.mongodb.org/mongo-driver/bson"
		      "go.mongodb.org/mongo-driver/mongo"
		      "go.mongodb.org/mongo-driver/mongo/options"
		  )
		  
		  func main() {
		      // Connection
		      client, err := mongo.Connect(context.TODO(), 
		          options.Client().ApplyURI("mongodb://localhost:27017"))
		      if err != nil {
		          panic(err)
		      }
		      defer client.Disconnect(context.TODO())
		      
		      users := client.Database("myDatabase").Collection("users")
		      
		      // Insert
		      user := bson.D{
		          {Key: "name", Value: "Alice"},
		          {Key: "age", Value: 25},
		          {Key: "email", Value: "alice@example.com"},
		      }
		      result, _ := users.InsertOne(context.TODO(), user)
		      fmt.Println("Inserted:", result.InsertedID)
		      
		      // Find one
		      var found bson.M
		      users.FindOne(context.TODO(), bson.D{{Key: "name", Value: "Alice"}}).Decode(&found)
		      fmt.Println(found)
		      
		      // Find many
		      cursor, _ := users.Find(context.TODO(), 
		          bson.D{{Key: "age", Value: bson.D{{Key: "$gte", Value: 25}}}})
		      defer cursor.Close(context.TODO())
		      
		      for cursor.Next(context.TODO()) {
		          var doc bson.M
		          cursor.Decode(&doc)
		          fmt.Println(doc)
		      }
		      
		      // Update
		      update := bson.D{{Key: "$set", Value: bson.D{{Key: "age", Value: 26}}}}
		      users.UpdateOne(context.TODO(), bson.D{{Key: "name", Value: "Alice"}}, update)
		      
		      // Delete
		      users.DeleteOne(context.TODO(), bson.D{{Key: "name", Value: "Alice"}})
		  }
		  ```
		  :::
	-
	- ## Aggregation Pipeline
		- The aggregation pipeline API is consistent across all drivers — you build the same stage objects (`$match`, `$group`, `$sort`, `$limit`) just using each language's native data structures instead of JavaScript objects. Node.js and Python use dictionaries/objects directly. Java uses the `Aggregates` builder class for type safety. Go uses `bson.D` (ordered key-value pairs) to preserve stage order. The pipeline is passed as an array/list to the `aggregate()` method and returns a cursor you iterate over.
		- :::code-tabs
		  ```javascript
		  // Node.js - Complex aggregation example
		  const pipeline = [
		    // Match active users
		    { $match: { status: 'active' } },
		    
		    // Group by city and calculate stats
		    {
		      $group: {
		        _id: '$city',
		        totalUsers: { $sum: 1 },
		        avgAge: { $avg: '$age' },
		        users: { $push: '$name' }
		      }
		    },
		    
		    // Sort by total users descending
		    { $sort: { totalUsers: -1 } },
		    
		    // Limit to top 10 cities
		    { $limit: 10 }
		  ]
		  
		  const results = await users.aggregate(pipeline).toArray()
		  console.log(results)
		  ```
		  ```python
		  # Python - Complex aggregation example
		  pipeline = [
		      # Match active users
		      {'$match': {'status': 'active'}},
		      
		      # Group by city and calculate stats
		      {
		          '$group': {
		              '_id': '$city',
		              'totalUsers': {'$sum': 1},
		              'avgAge': {'$avg': '$age'},
		              'users': {'$push': '$name'}
		          }
		      },
		      
		      # Sort by total users descending
		      {'$sort': {'totalUsers': -1}},
		      
		      # Limit to top 10 cities
		      {'$limit': 10}
		  ]
		  
		  results = list(users.aggregate(pipeline))
		  for doc in results:
		      print(doc)
		  ```
		  ```java
		  // Java - Complex aggregation example
		  import com.mongodb.client.model.Aggregates;
		  import com.mongodb.client.model.Accumulators;
		  import com.mongodb.client.model.Sorts;
		  
		  List<Bson> pipeline = Arrays.asList(
		      // Match active users
		      Aggregates.match(eq("status", "active")),
		      
		      // Group by city and calculate stats
		      Aggregates.group("$city",
		          Accumulators.sum("totalUsers", 1),
		          Accumulators.avg("avgAge", "$age"),
		          Accumulators.push("users", "$name")
		      ),
		      
		      // Sort by total users descending
		      Aggregates.sort(Sorts.descending("totalUsers")),
		      
		      // Limit to top 10 cities
		      Aggregates.limit(10)
		  );
		  
		  AggregateIterable<Document> results = users.aggregate(pipeline);
		  for (Document doc : results) {
		      System.out.println(doc.toJson());
		  }
		  ```
		  ```go
		  // Go - Complex aggregation example
		  pipeline := mongo.Pipeline{
		      // Match active users
		      {{Key: "$match", Value: bson.D{{Key: "status", Value: "active"}}}},
		      
		      // Group by city and calculate stats
		      {{Key: "$group", Value: bson.D{
		          {Key: "_id", Value: "$city"},
		          {Key: "totalUsers", Value: bson.D{{Key: "$sum", Value: 1}}},
		          {Key: "avgAge", Value: bson.D{{Key: "$avg", Value: "$age"}}},
		          {Key: "users", Value: bson.D{{Key: "$push", Value: "$name"}}},
		      }}},
		      
		      // Sort by total users descending
		      {{Key: "$sort", Value: bson.D{{Key: "totalUsers", Value: -1}}}},
		      
		      // Limit to top 10 cities
		      {{Key: "$limit", Value: 10}},
		  }
		  
		  cursor, _ := users.Aggregate(context.TODO(), pipeline)
		  defer cursor.Close(context.TODO())
		  
		  for cursor.Next(context.TODO()) {
		      var result bson.M
		      cursor.Decode(&result)
		      fmt.Println(result)
		  }
		  ```
		  :::
	-
	- ## Connection Pooling & Error Handling
		- In production, wrap your `MongoClient` in a singleton class so the connection pool is created once at startup and shared across all requests. Configure `maxPoolSize` based on your expected concurrency and MongoDB's `maxIncomingConnections` limit. `serverSelectionTimeoutMS` controls how long the driver waits to find an available server before throwing — set it low (5s) so failures surface quickly rather than hanging. Listen to `serverHeartbeatFailed` events to detect connectivity issues proactively. Always register a shutdown hook to close the client gracefully.
		- :::code-tabs
		  ```javascript
		  // Node.js - Production connection with error handling
		  const { MongoClient } = require('mongodb')
		  
		  class Database {
		    constructor() {
		      this.client = null
		      this.db = null
		    }
		    
		    async connect() {
		      try {
		        this.client = new MongoClient(process.env.MONGODB_URI, {
		          maxPoolSize: 50,
		          minPoolSize: 10,
		          maxIdleTimeMS: 30000,
		          serverSelectionTimeoutMS: 5000,
		          retryWrites: true,
		          retryReads: true
		        })
		        
		        await this.client.connect()
		        this.db = this.client.db(process.env.DB_NAME)
		        console.log('✅ Connected to MongoDB')
		        
		        // Handle events
		        this.client.on('serverHeartbeatFailed', (event) => {
		          console.error('❌ Heartbeat failed:', event)
		        })
		        
		        return this.db
		      } catch (error) {
		        console.error('❌ Connection failed:', error)
		        throw error
		      }
		    }
		    
		    async close() {
		      if (this.client) {
		        await this.client.close()
		        console.log('👋 Disconnected from MongoDB')
		      }
		    }
		  }
		  
		  // Usage
		  const database = new Database()
		  await database.connect()
		  
		  // Graceful shutdown
		  process.on('SIGINT', async () => {
		    await database.close()
		    process.exit(0)
		  })
		  ```
		  ```python
		  # Python - Production connection with error handling
		  from pymongo import MongoClient
		  from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
		  import os
		  import atexit
		  
		  class Database:
		      def __init__(self):
		          self.client = None
		          self.db = None
		      
		      def connect(self):
		          try:
		              self.client = MongoClient(
		                  os.getenv('MONGODB_URI'),
		                  maxPoolSize=50,
		                  minPoolSize=10,
		                  maxIdleTimeMS=30000,
		                  serverSelectionTimeoutMS=5000,
		                  retryWrites=True,
		                  retryReads=True
		              )
		              
		              # Test connection
		              self.client.admin.command('ping')
		              self.db = self.client[os.getenv('DB_NAME')]
		              print('✅ Connected to MongoDB')
		              
		              return self.db
		          except ConnectionFailure as e:
		              print(f'❌ Connection failed: {e}')
		              raise
		          except ServerSelectionTimeoutError as e:
		              print(f'❌ Server selection timeout: {e}')
		              raise
		      
		      def close(self):
		          if self.client:
		              self.client.close()
		              print('👋 Disconnected from MongoDB')
		  
		  # Usage
		  database = Database()
		  db = database.connect()
		  
		  # Graceful shutdown
		  atexit.register(database.close)
		  ```
		  ```java
		  // Java - Production connection with error handling
		  import com.mongodb.ConnectionString;
		  import com.mongodb.MongoClientSettings;
		  import com.mongodb.client.MongoClient;
		  import com.mongodb.client.MongoClients;
		  import com.mongodb.client.MongoDatabase;
		  import com.mongodb.connection.ConnectionPoolSettings;
		  import java.util.concurrent.TimeUnit;
		  
		  public class Database {
		      private MongoClient client;
		      private MongoDatabase db;
		      
		      public MongoDatabase connect(String uri, String dbName) {
		          try {
		              ConnectionPoolSettings poolSettings = ConnectionPoolSettings.builder()
		                  .maxSize(50)
		                  .minSize(10)
		                  .maxWaitTime(5000, TimeUnit.MILLISECONDS)
		                  .maxConnectionIdleTime(30000, TimeUnit.MILLISECONDS)
		                  .build();
		              
		              MongoClientSettings settings = MongoClientSettings.builder()
		                  .applyConnectionString(new ConnectionString(uri))
		                  .applyToConnectionPoolSettings(builder -> 
		                      builder.applySettings(poolSettings))
		                  .retryWrites(true)
		                  .retryReads(true)
		                  .build();
		              
		              this.client = MongoClients.create(settings);
		              this.db = client.getDatabase(dbName);
		              
		              // Test connection
		              db.runCommand(new Document("ping", 1));
		              System.out.println("✅ Connected to MongoDB");
		              
		              return this.db;
		          } catch (Exception e) {
		              System.err.println("❌ Connection failed: " + e.getMessage());
		              throw e;
		          }
		      }
		      
		      public void close() {
		          if (this.client != null) {
		              this.client.close();
		              System.out.println("👋 Disconnected from MongoDB");
		          }
		      }
		  }
		  
		  // Usage with shutdown hook
		  Database database = new Database();
		  MongoDatabase db = database.connect(uri, dbName);
		  
		  Runtime.getRuntime().addShutdownHook(new Thread(() -> {
		      database.close();
		  }));
		  ```
		  :::
-
- # Mongoose (Node.js ODM)
  collapsed:: true
	- ## Setup & Connection
		- ```javascript
		  // Install
		  // npm install mongoose
		  
		  const mongoose = require('mongoose')
		  
		  // Connect
		  mongoose.connect('mongodb://localhost:27017/myDatabase', {
		    useNewUrlParser: true,
		    useUnifiedTopology: true
		  })
		  
		  const db = mongoose.connection
		  db.on('error', console.error.bind(console, 'connection error:'))
		  db.once('open', () => {
		    console.log('Connected to MongoDB')
		  })
		  ```
	-
	- ## Schema & Model
		- ```javascript
		  // Define schema
		  const userSchema = new mongoose.Schema({
		    name: {
		      type: String,
		      required: true,
		      trim: true
		    },
		    email: {
		      type: String,
		      required: true,
		      unique: true,
		      lowercase: true,
		      validate: {
		        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
		        message: 'Invalid email format'
		      }
		    },
		    age: {
		      type: Number,
		      min: 0,
		      max: 150
		    },
		    status: {
		      type: String,
		      enum: ['active', 'inactive', 'pending'],
		      default: 'active'
		    },
		    tags: [String],
		    address: {
		      street: String,
		      city: String,
		      zip: String
		    },
		    createdAt: {
		      type: Date,
		      default: Date.now
		    }
		  }, {
		    timestamps: true  // Adds createdAt and updatedAt
		  })
		  
		  // Create model
		  const User = mongoose.model('User', userSchema)
		  ```
	-
	- ## CRUD Operations
		- ```javascript
		  // Create
		  const user = new User({
		    name: 'Alice',
		    email: 'alice@example.com',
		    age: 25
		  })
		  await user.save()
		  
		  // Or use create
		  const user2 = await User.create({
		    name: 'Bob',
		    email: 'bob@example.com',
		    age: 30
		  })
		  
		  // Find all
		  const users = await User.find()
		  
		  // Find with filter
		  const adults = await User.find({ age: { $gte: 18 } })
		  
		  // Find one
		  const user = await User.findOne({ email: 'alice@example.com' })
		  
		  // Find by ID
		  const user = await User.findById('507f1f77bcf86cd799439011')
		  
		  // Update
		  await User.updateOne(
		    { email: 'alice@example.com' },
		    { $set: { age: 26 } }
		  )
		  
		  // Find and update
		  const updated = await User.findOneAndUpdate(
		    { email: 'alice@example.com' },
		    { $set: { age: 26 } },
		    { new: true }  // Return updated document
		  )
		  
		  // Update by ID
		  await User.findByIdAndUpdate('507f1f77bcf86cd799439011', { age: 26 })
		  
		  // Delete
		  await User.deleteOne({ email: 'alice@example.com' })
		  
		  // Find and delete
		  const deleted = await User.findOneAndDelete({ email: 'alice@example.com' })
		  
		  // Delete by ID
		  await User.findByIdAndDelete('507f1f77bcf86cd799439011')
		  ```
	-
	- ## Query Methods
		- ```javascript
		  // Chaining query methods
		  const users = await User
		    .find({ age: { $gte: 25 } })
		    .select('name email')  // Projection
		    .sort({ age: -1 })     // Sort
		    .limit(10)             // Limit
		    .skip(20)              // Skip
		    .exec()
		  
		  // Count
		  const count = await User.countDocuments({ age: { $gte: 25 } })
		  
		  // Exists
		  const exists = await User.exists({ email: 'alice@example.com' })
		  ```
	-
	- ## Middleware (Hooks)
		- ```javascript
		  // Pre-save hook
		  userSchema.pre('save', async function(next) {
		    if (this.isModified('password')) {
		      this.password = await bcrypt.hash(this.password, 10)
		    }
		    next()
		  })
		  
		  // Post-save hook
		  userSchema.post('save', function(doc, next) {
		    console.log(`User ${doc.name} saved`)
		    next()
		  })
		  
		  // Pre-remove hook
		  userSchema.pre('remove', async function(next) {
		    await Order.deleteMany({ userId: this._id })
		    next()
		  })
		  ```
	-
	- ## Virtual Properties
		- ```javascript
		  // Define virtual
		  userSchema.virtual('fullName').get(function() {
		    return `${this.firstName} ${this.lastName}`
		  })
		  
		  userSchema.virtual('fullName').set(function(name) {
		    const parts = name.split(' ')
		    this.firstName = parts[0]
		    this.lastName = parts[1]
		  })
		  
		  // Use virtual
		  const user = await User.findOne({ email: 'alice@example.com' })
		  console.log(user.fullName)  // "Alice Smith"
		  ```
	-
	- ## Population (References)
		- ```javascript
		  // Define schemas with references
		  const authorSchema = new mongoose.Schema({
		    name: String,
		    email: String
		  })
		  
		  const postSchema = new mongoose.Schema({
		    title: String,
		    content: String,
		    author: {
		      type: mongoose.Schema.Types.ObjectId,
		      ref: 'Author'
		    }
		  })
		  
		  const Author = mongoose.model('Author', authorSchema)
		  const Post = mongoose.model('Post', postSchema)
		  
		  // Create with reference
		  const author = await Author.create({ name: 'Alice', email: 'alice@example.com' })
		  const post = await Post.create({
		    title: 'My Post',
		    content: 'Content here',
		    author: author._id
		  })
		  
		  // Populate reference
		  const postWithAuthor = await Post.findById(post._id).populate('author')
		  console.log(postWithAuthor.author.name)  // "Alice"
		  
		  // Populate with select
		  const post = await Post.findById(postId).populate('author', 'name email')
		  
		  // Nested populate
		  const post = await Post.findById(postId)
		    .populate({
		      path: 'author',
		      populate: { path: 'company' }
		    })
		  ```
-
- # Advanced Features
  collapsed:: true
	- ## Change Streams
		- ```javascript
		  // Watch collection for changes
		  const changeStream = db.users.watch()
		  
		  changeStream.on('change', (change) => {
		    console.log('Change detected:', change)
		  })
		  
		  // Watch with pipeline
		  const pipeline = [
		    { $match: { 'fullDocument.age': { $gte: 25 } } }
		  ]
		  const changeStream = db.users.watch(pipeline)
		  
		  // Watch specific operations
		  const pipeline = [
		    { $match: { operationType: { $in: ['insert', 'update'] } } }
		  ]
		  
		  // Resume from token (for fault tolerance)
		  const changeStream = db.users.watch([], { resumeAfter: resumeToken })
		  ```
	-
	- ## Time Series Collections
		- ```javascript
		  // Create time series collection
		  db.createCollection("weather", {
		    timeseries: {
		      timeField: "timestamp",
		      metaField: "sensorId",
		      granularity: "hours"
		    }
		  })
		  
		  // Insert time series data
		  db.weather.insertMany([
		    {
		      sensorId: "sensor-1",
		      timestamp: ISODate("2024-01-15T10:00:00Z"),
		      temperature: 20.5,
		      humidity: 65
		    },
		    {
		      sensorId: "sensor-1",
		      timestamp: ISODate("2024-01-15T11:00:00Z"),
		      temperature: 21.0,
		      humidity: 63
		    }
		  ])
		  
		  // Query time series data
		  db.weather.find({
		    sensorId: "sensor-1",
		    timestamp: {
		      $gte: ISODate("2024-01-15T00:00:00Z"),
		      $lt: ISODate("2024-01-16T00:00:00Z")
		    }
		  })
		  ```
	-
	- ## Capped Collections
		- ```javascript
		  // Create capped collection (fixed size, FIFO)
		  db.createCollection("logs", {
		    capped: true,
		    size: 10485760,  // 10MB
		    max: 5000        // Max 5000 documents
		  })
		  
		  // Insert into capped collection
		  db.logs.insertOne({
		    message: "Error occurred",
		    timestamp: new Date()
		  })
		  
		  // Tailable cursor (like tail -f)
		  const cursor = db.logs.find().tailable().awaitData()
		  ```
	-
	- ## GridFS (Large Files)
		- ```javascript
		  // Store files larger than 16MB
		  const { GridFSBucket } = require('mongodb')
		  
		  const bucket = new GridFSBucket(db, {
		    bucketName: 'files'
		  })
		  
		  // Upload file
		  const fs = require('fs')
		  fs.createReadStream('./video.mp4')
		    .pipe(bucket.openUploadStream('video.mp4', {
		      metadata: { type: 'video', size: 1024000 }
		    }))
		    .on('finish', () => console.log('Upload complete'))
		  
		  // Download file
		  bucket.openDownloadStreamByName('video.mp4')
		    .pipe(fs.createWriteStream('./downloaded-video.mp4'))
		  
		  // List files
		  const files = await bucket.find().toArray()
		  
		  // Delete file
		  await bucket.delete(fileId)
		  ```
	-
	- ## Geospatial Queries
		- ```javascript
		  // Create 2dsphere index
		  db.places.createIndex({ location: "2dsphere" })
		  
		  // Insert location data
		  db.places.insertOne({
		    name: "Central Park",
		    location: {
		      type: "Point",
		      coordinates: [-73.9654, 40.7829]  // [longitude, latitude]
		    }
		  })
		  
		  // Find near location
		  db.places.find({
		    location: {
		      $near: {
		        $geometry: {
		          type: "Point",
		          coordinates: [-73.9667, 40.78]
		        },
		        $maxDistance: 5000  // 5km in meters
		      }
		    }
		  })
		  
		  // Find within polygon
		  db.places.find({
		    location: {
		      $geoWithin: {
		        $geometry: {
		          type: "Polygon",
		          coordinates: [[
		            [-74.0, 40.7],
		            [-73.9, 40.7],
		            [-73.9, 40.8],
		            [-74.0, 40.8],
		            [-74.0, 40.7]
		          ]]
		        }
		      }
		    }
		  })
		  
		  // Find within circle
		  db.places.find({
		    location: {
		      $geoWithin: {
		        $centerSphere: [[-73.9667, 40.78], 5 / 6378.1]  // 5km radius
		      }
		    }
		  })
		  ```
	-
	- ## Text Search
		- ```javascript
		  // Create text index
		  db.articles.createIndex({ title: "text", content: "text" })
		  
		  // Text search
		  db.articles.find({ $text: { $search: "mongodb tutorial" } })
		  
		  // Text search with score
		  db.articles.find(
		    { $text: { $search: "mongodb tutorial" } },
		    { score: { $meta: "textScore" } }
		  ).sort({ score: { $meta: "textScore" } })
		  
		  // Phrase search
		  db.articles.find({ $text: { $search: "\"mongodb tutorial\"" } })
		  
		  // Exclude terms
		  db.articles.find({ $text: { $search: "mongodb -sql" } })
		  
		  // Case-insensitive search
		  db.articles.find({
		    $text: {
		      $search: "MongoDB",
		      $caseSensitive: false
		    }
		  })
		  ```
	-
	- ## Collations (Locale-Aware Sorting)
		- ```javascript
		  // Create collection with collation
		  db.createCollection("users", {
		    collation: { locale: "en", strength: 2 }
		  })
		  
		  // Query with collation
		  db.users.find({ name: "alice" }).collation({ locale: "en", strength: 2 })
		  
		  // Case-insensitive index
		  db.users.createIndex(
		    { email: 1 },
		    { collation: { locale: "en", strength: 2 } }
		  )
		  
		  // Sort with collation
		  db.users.find().sort({ name: 1 }).collation({ locale: "de" })
		  ```
-
- # Common Use Cases
  collapsed:: true
	- ## Content Management System
		- MongoDB's flexible schema is ideal for CMS because different content types (articles, videos, podcasts, landing pages) all have different fields. Instead of creating a separate SQL table for each content type, you store them all in one collection with varying shapes.
		- Text indexes enable full-text search across titles and body content without a separate search engine.
		- GridFS handles media files (images, videos) larger than the 16MB document limit, storing them in chunks alongside their metadata.
		- ```javascript
		  // CMS article document — flexible schema handles any content type
		  {
		    _id: ObjectId(),
		    type: "article",           // or "video", "podcast", "page"
		    title: "Getting Started with MongoDB",
		    slug: "getting-started-mongodb",
		    status: "published",       // draft | published | archived
		    author: { name: "Alice", id: ObjectId("...") },
		    tags: ["mongodb", "nosql", "database"],
		    content: "Full article body...",
		    metadata: {
		      readTime: 8,             // minutes
		      seoTitle: "...",
		      seoDescription: "..."
		    },
		    comments: [               // Embedded for fast reads
		      { user: "Bob", text: "Great post!", date: ISODate() }
		    ],
		    publishedAt: ISODate("2024-01-15"),
		    updatedAt: ISODate("2024-01-20")
		  }
		  
		  // Text index for search
		  db.content.createIndex({ title: "text", content: "text", tags: "text" })
		  db.content.find({ $text: { $search: "mongodb tutorial" } })
		  ```
	-
	- ## E-commerce Platform
		- Products have wildly different attributes (a shirt has size/color, a laptop has RAM/CPU). MongoDB's flexible schema handles this naturally without EAV (Entity-Attribute-Value) hacks.
		- Shopping carts are embedded in the user document for atomic updates and fast reads. Orders are referenced (separate collection) because they're immutable records you query independently.
		- Transactions ensure inventory decrements and order creation happen atomically — no overselling.
		- ```javascript
		  // Product with variant-specific attributes
		  {
		    _id: ObjectId(),
		    sku: "LAPTOP-PRO-001",
		    name: "Pro Laptop 15",
		    price: 1299.99,
		    category: "Electronics",
		    attributes: {           // Flexible — different per product type
		      cpu: "Intel i7-13th",
		      ram: "16GB",
		      storage: "512GB SSD",
		      display: "15.6 inch FHD"
		    },
		    variants: [
		      { sku: "LAPTOP-PRO-001-SLV", color: "Silver", stock: 25 },
		      { sku: "LAPTOP-PRO-001-BLK", color: "Black", stock: 10 }
		    ],
		    images: ["https://cdn.example.com/laptop-1.jpg"],
		    tags: ["laptop", "intel", "gaming"]
		  }
		  
		  // Atomic order placement with inventory check
		  const session = client.startSession()
		  session.withTransaction(async () => {
		    // Decrement stock
		    await db.products.updateOne(
		      { "variants.sku": "LAPTOP-PRO-001-SLV", "variants.stock": { $gte: 1 } },
		      { $inc: { "variants.$.stock": -1 } },
		      { session }
		    )
		    // Create order
		    await db.orders.insertOne({ userId, items, total, status: "pending" }, { session })
		  })
		  ```
	-
	- ## Real-time Analytics
		- Time series collections (MongoDB 5.0+) are optimized for append-heavy workloads like metrics, events, and sensor data. They compress data automatically and support efficient range queries by time.
		- The aggregation framework replaces the need for a separate analytics database for most reporting needs — group by time buckets, calculate percentiles, build funnels.
		- Change streams push updates to dashboards in real time without polling.
		- ```javascript
		  // Time series collection for application metrics
		  db.createCollection("metrics", {
		    timeseries: {
		      timeField: "timestamp",
		      metaField: "service",
		      granularity: "minutes"
		    }
		  })
		  
		  // Insert metric event
		  db.metrics.insertOne({
		    service: "api-gateway",
		    timestamp: new Date(),
		    responseTime: 142,    // ms
		    statusCode: 200,
		    endpoint: "/users"
		  })
		  
		  // Hourly average response time per service
		  db.metrics.aggregate([
		    { $match: { timestamp: { $gte: new Date(Date.now() - 86400000) } } },
		    {
		      $group: {
		        _id: {
		          service: "$service",
		          hour: { $hour: "$timestamp" }
		        },
		        avgResponseTime: { $avg: "$responseTime" },
		        p95: { $percentile: { input: "$responseTime", p: [0.95], method: "approximate" } },
		        errorRate: {
		          $avg: { $cond: [{ $gte: ["$statusCode", 500] }, 1, 0] }
		        }
		      }
		    },
		    { $sort: { "_id.hour": 1 } }
		  ])
		  ```
	-
	- ## Social Network
		- User profiles use embedded documents for preferences and settings (always accessed together). Posts embed the first few comments (subset pattern) for fast feed rendering, with full comments in a separate collection.
		- Followers/following use arrays of ObjectId references. For users with millions of followers (celebrities), use a separate `follows` collection to avoid the 16MB document limit.
		- Activity feeds use time series or capped collections — you only need the last N events, not the full history.
		- ```javascript
		  // User profile with embedded preferences
		  {
		    _id: ObjectId(),
		    username: "alice_dev",
		    email: "alice@example.com",
		    profile: { bio: "Engineer", avatar: "...", location: "NYC" },
		    preferences: { theme: "dark", notifications: true },
		    followingIds: [ObjectId("..."), ObjectId("...")],  // Who they follow
		    followerCount: 1240,   // Computed field — avoid counting every time
		    createdAt: ISODate()
		  }
		  
		  // Post with subset pattern (first 3 comments embedded)
		  {
		    _id: ObjectId(),
		    authorId: ObjectId("..."),
		    content: "Just shipped a new feature!",
		    likes: { count: 42, userIds: [ObjectId("...")] },
		    recentComments: [          // Subset — only last 3
		      { author: "Bob", text: "Congrats!", date: ISODate() }
		    ],
		    commentCount: 17,          // Total count for "View all 17 comments"
		    createdAt: ISODate()
		  }
		  
		  // Feed query — posts from followed users, sorted by recency
		  db.posts.find({
		    authorId: { $in: currentUser.followingIds }
		  }).sort({ createdAt: -1 }).limit(20)
		  ```
	-
	- ## IoT & Sensor Data
		- IoT devices generate millions of small readings per day. Storing each reading as a separate document is wasteful. The bucket pattern groups readings by device and time window into a single document, dramatically reducing document count and improving compression.
		- Geospatial indexes enable location-based queries like "find all sensors within 10km" or "which devices are inside this zone."
		- ```javascript
		  // Bucket pattern — group 60 readings per document (1 per minute)
		  {
		    _id: ObjectId(),
		    deviceId: "sensor-42",
		    date: ISODate("2024-01-15"),
		    hour: 14,                  // Hour bucket
		    location: {
		      type: "Point",
		      coordinates: [-73.9667, 40.78]
		    },
		    readings: [               // 60 readings per document
		      { minute: 0, temp: 22.1, humidity: 65, pressure: 1013 },
		      { minute: 1, temp: 22.3, humidity: 64, pressure: 1013 },
		      // ... up to minute 59
		    ],
		    summary: {               // Pre-computed for fast queries
		      minTemp: 21.8,
		      maxTemp: 23.1,
		      avgTemp: 22.4
		    }
		  }
		  
		  // Find all sensors near a location reporting high temperature
		  db.sensorBuckets.find({
		    location: {
		      $near: {
		        $geometry: { type: "Point", coordinates: [-73.9667, 40.78] },
		        $maxDistance: 10000   // 10km
		      }
		    },
		    "summary.maxTemp": { $gt: 35 }
		  })
		  ```
	-
	- ## Mobile Applications
		- Mobile apps need offline support and real-time sync. MongoDB Atlas Device Sync (formerly Realm) handles conflict resolution when devices reconnect after being offline.
		- Flexible schema means you can ship new app versions with new fields without a migration — old documents simply won't have the new field, and you handle that in app logic.
		- Geospatial queries power location features like "restaurants near me" or "find friends nearby."
		- ```javascript
		  // User location update (mobile app sends GPS coordinates)
		  db.users.updateOne(
		    { _id: currentUserId },
		    {
		      $set: {
		        location: {
		          type: "Point",
		          coordinates: [longitude, latitude]
		        },
		        lastSeen: new Date()
		      }
		    }
		  )
		  
		  // Find nearby users (within 5km)
		  db.users.find({
		    location: {
		      $near: {
		        $geometry: { type: "Point", coordinates: [userLng, userLat] },
		        $maxDistance: 5000
		      }
		    },
		    _id: { $ne: currentUserId },
		    status: "online"
		  }).limit(20)
		  ```
-
- # Troubleshooting
  collapsed:: true
	- ## Slow Queries
		- The most common cause of slow queries is a missing index — MongoDB falls back to a full collection scan (COLLSCAN), reading every document. Use `explain("executionStats")` to diagnose. Look for `"stage": "COLLSCAN"` in the output — that's your red flag.
		- A query can have an index but still be slow if the index has low selectivity (e.g., a boolean field with 50/50 distribution). Compound indexes with high-cardinality fields first perform much better.
		- ```javascript
		  // Step 1: Identify slow queries via profiler
		  db.setProfilingLevel(1, { slowms: 100 })  // Log queries > 100ms
		  db.system.profile.find().sort({ millis: -1 }).limit(5)
		  
		  // Step 2: Explain the slow query
		  db.orders.find({ status: "pending", customerId: ObjectId("...") })
		    .explain("executionStats")
		  // Look for:
		  // "stage": "COLLSCAN"  → no index used (bad)
		  // "stage": "IXSCAN"   → index used (good)
		  // "totalDocsExamined" >> "nReturned"  → poor selectivity
		  
		  // Step 3: Create the right index
		  // ESR rule: Equality → Sort → Range
		  db.orders.createIndex({ customerId: 1, status: 1, createdAt: -1 })
		  
		  // Step 4: Verify index is used
		  db.orders.find({ customerId: ObjectId("..."), status: "pending" })
		    .sort({ createdAt: -1 })
		    .explain("executionStats")
		  // Now should show "stage": "IXSCAN"
		  ```
	-
	- ## High Memory Usage
		- MongoDB's WiredTiger engine caches frequently accessed data in RAM (default: 50% of available RAM minus 1GB). If your working set (actively used data + indexes) exceeds the cache, MongoDB starts reading from disk — performance drops sharply.
		- Indexes live in RAM. Too many indexes on a large collection can exhaust memory. Use `$indexStats` to find unused indexes and drop them.
		- ```javascript
		  // Check current memory usage
		  db.serverStatus().mem
		  // { bits: 64, resident: 512, virtual: 1024, ... }
		  // resident = actual RAM used (MB)
		  
		  // Check WiredTiger cache hit ratio
		  const wt = db.serverStatus().wiredTiger.cache
		  const hitRatio = wt["pages read into cache"] / wt["pages requested from the cache"]
		  // hitRatio close to 1.0 = good (data in cache)
		  // hitRatio close to 0.0 = bad (reading from disk constantly)
		  
		  // Find unused indexes (candidates for removal)
		  db.orders.aggregate([{ $indexStats: {} }])
		    .forEach(idx => {
		      if (idx.accesses.ops === 0) {
		        print(`Unused index: ${idx.name}`)
		      }
		    })
		  
		  // Adjust WiredTiger cache in mongod.conf
		  // storage:
		  //   wiredTiger:
		  //     engineConfig:
		  //       cacheSizeGB: 4   # Set explicitly instead of relying on default
		  ```
	-
	- ## Connection Issues
		- "Connection refused" usually means MongoDB isn't running or is bound to a different IP. Check `bindIp` in `mongod.conf` — by default it's `127.0.0.1` (localhost only). For remote connections, add the server's IP or use `0.0.0.0` (with firewall rules).
		- "Too many connections" means your app is creating new connections instead of reusing a pool. Always use a singleton MongoClient and configure `maxPoolSize` appropriately.
		- ```javascript
		  // Bad: Creating a new connection per request (exhausts connections fast)
		  app.get('/users', async (req, res) => {
		    const client = new MongoClient(uri)  // ❌ New connection every request
		    await client.connect()
		    const users = await client.db('mydb').collection('users').find().toArray()
		    await client.close()
		    res.json(users)
		  })
		  
		  // Good: Singleton client with connection pool
		  const client = new MongoClient(uri, {
		    maxPoolSize: 50,          // Max concurrent connections
		    minPoolSize: 5,           // Keep 5 connections warm
		    maxIdleTimeMS: 30000      // Close idle connections after 30s
		  })
		  await client.connect()     // Connect once at startup
		  
		  app.get('/users', async (req, res) => {
		    const users = await client.db('mydb').collection('users').find().toArray()
		    res.json(users)           // ✅ Reuses pooled connection
		  })
		  
		  // Check active connections
		  db.serverStatus().connections
		  // { current: 45, available: 955, totalCreated: 1200 }
		  // If current is near maxIncomingConnections, you have a connection leak
		  ```
	-
	- ## Replication Lag
		- Replication lag is the delay between a write on the primary and when it appears on secondaries. High lag means secondaries are falling behind — if the primary fails, you could lose recent writes.
		- Common causes: network latency between nodes, secondary under heavy read load, oplog too small (secondary can't keep up and falls off the oplog).
		- ```javascript
		  // Check replication lag
		  rs.printReplicationInfo()
		  // Shows oplog window (how far back the oplog goes)
		  
		  rs.printSecondaryReplicationInfo()
		  // Shows lag per secondary member
		  // "0 secs (0 hrs) behind the primary" = healthy
		  // "120 secs (0.03 hrs) behind the primary" = lagging
		  
		  // Check oplog size
		  use local
		  db.oplog.rs.stats().maxSize  // Current max oplog size in bytes
		  
		  // Increase oplog size (requires restart or rolling restart)
		  // In mongod.conf:
		  // replication:
		  //   oplogSizeMB: 10240   # 10GB oplog
		  
		  // If secondary is too far behind, it may need to resync
		  // On the lagging secondary:
		  db.adminCommand({ resync: 1 })
		  ```
	-
	- ## Disk Space Issues
		- MongoDB doesn't automatically reclaim disk space after deletes. Deleted documents leave holes in data files. Use `compact` to reclaim space (requires taking the node offline or doing a rolling compact on replica set members).
		- WiredTiger compresses data by default, but if you're storing large uncompressed blobs or have many small documents, storage can grow fast.
		- ```javascript
		  // Check database and collection sizes
		  db.stats()
		  // { dataSize: 1024000, storageSize: 2048000, indexSize: 512000, ... }
		  // dataSize = actual data
		  // storageSize = allocated on disk (includes fragmentation)
		  // If storageSize >> dataSize, you have fragmentation
		  
		  db.orders.stats()
		  // Per-collection breakdown
		  
		  // Compact a collection (reclaims fragmented space)
		  // WARNING: Blocks the collection during compaction
		  db.runCommand({ compact: "orders" })
		  
		  // For replica sets: compact one secondary at a time
		  // 1. Stop reads on secondary
		  // 2. Run compact
		  // 3. Bring back online
		  // 4. Repeat for other secondaries, then step down primary
		  
		  // Archive old data before deleting
		  db.orders.aggregate([
		    { $match: { createdAt: { $lt: new Date("2023-01-01") } } },
		    { $out: "orders_archive_2022" }   // Move to archive collection
		  ])
		  db.orders.deleteMany({ createdAt: { $lt: new Date("2023-01-01") } })
		  ```
-
- # More Learn
	- ## Github & Webs
		- [mongodb/mongo](https://github.com/mongodb/mongo) — MongoDB server source code
		- [mongodb/node-mongodb-native](https://github.com/mongodb/node-mongodb-native) — Official Node.js driver
		- [Automattic/mongoose](https://github.com/Automattic/mongoose) — Mongoose ODM for Node.js
		- [mongodb/mongo-python-driver](https://github.com/mongodb/mongo-python-driver) — Official Python (PyMongo) driver
		- [mongodb/mongo-go-driver](https://github.com/mongodb/mongo-go-driver) — Official Go driver
		- [ramnes/awesome-mongodb](https://github.com/ramnes/awesome-mongodb) — Curated list of MongoDB tools and resources
		- [docs.mongodb.com](https://docs.mongodb.com/) — Official MongoDB documentation
		- [university.mongodb.com](https://university.mongodb.com/) — Free official courses and certifications
		- [mongoplayground.net](https://mongoplayground.net/) — Online MongoDB query sandbox
		- [mongodb.com/developer](https://www.mongodb.com/developer/) — Tutorials, guides, and code examples
	-
	- ## Master Playlists YouTube
		- [MongoDB Crash Course](https://www.youtube.com/watch?v=-56x56UppqQ) — Traversy Media — Beginner-friendly introduction to MongoDB
		- [MongoDB Full Tutorial](https://www.youtube.com/watch?v=c2M-rlkkT5o) — freeCodeCamp.org — 4+ hour comprehensive course covering all core concepts
		- [MongoDB Aggregation Framework](https://www.youtube.com/playlist?list=PL4RCxklHWZ9v2lcat4oEVGQhZg6r4IQGV) — MongoDB Official — Deep dive into the aggregation pipeline
		- [Node.js & MongoDB Tutorial](https://www.youtube.com/playlist?list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA) — The Net Ninja — Building apps with Node.js and MongoDB
		- [MERN Stack Full Course](https://www.youtube.com/watch?v=7CqJlxBYj-M) — freeCodeCamp.org — Full stack MongoDB, Express, React, Node.js project