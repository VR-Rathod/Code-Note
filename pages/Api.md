---
seoTitle: API Development Reference – REST, SOAP, GraphQL, and gRPC Guide
description: "Comprehensive API reference guide. Covers REST design principles, HTTP methods and status codes, SOAP, GraphQL, gRPC, authentication, caching, rate limiting, and code snippets in JavaScript, Python, Go, and Java."
keywords: "API, REST API, GraphQL, gRPC, SOAP, HTTP methods, HTTP status codes, OAuth 2.0, JWT, API design, web API, JSON, Axios, Fetch, FastAPI"
displayTitle: API Development
---

> [!info] What is an API?
> An **API (Application Programming Interface)** is a set of defined rules, protocols, and tools that enables different software applications to communicate and share data with one another. It acts as an abstraction layer, hiding the underlying complexity of systems and databases while exposing a clean, secure interface for clients.

- # Architecture & Communication Flow
  collapsed:: true
	- ## Client-Server Sequence
	  collapsed:: true
		- ```mermaid
		  sequenceDiagram
		      autonumber
		      actor Client as Client App (Web/Mobile)
		      participant API as API Gateway / Router
		      participant Server as Application Server
		      participant DB as Database
		      
		      Client->>API: Send Request (HTTP Method, URL, Headers, Body)
		      Note over API: Authenticate request & check Rate Limits
		      API-->>Client: 401 Unauthorized (If authentication fails)
		      API->>Server: Route request to Controller
		      Server->>DB: Query / Mutate Data
		      DB-->>Server: Return raw data
		      Note over Server: Format data (usually to JSON) & process logic
		      Server->>API: Send Response Payload + HTTP Status Code
		      API->>Client: Deliver formatted Response Payload
		  ```
	-
	- ## API Styles Comparison
	  collapsed:: true
		- | Feature | REST | SOAP | GraphQL | gRPC |
		  |---|---|---|---|---|
		  | **Protocol** | HTTP / HTTPS | HTTP, SMTP, TCP, etc. | HTTP / HTTPS | HTTP/2 |
		  | **Data Format** | JSON, XML, HTML, Text | XML (strictly) | JSON | Protocol Buffers (Binary) |
		  | **Statefulness** | Stateless | State-agnostic (often stateful) | Stateless | Stateful or Stateless |
		  | **Operations** | CRUD via HTTP Methods | Remote Procedure Call (RPC) | Query, Mutation, Subscription | Remote Procedure Calls |
		  | **Speed & Size** | Medium / Large (JSON text) | Heavy (verbose XML overhead) | Medium (Client-selected payload) | Extremely fast (packed binary) |
		  | **Use Case** | General Web APIs, CRUD | Enterprise integrations, banking | Complex web frontends, mobile | Microservices communication |
-
- # RESTful API Design Principles
  collapsed:: true
	- **REST (Representational State Transfer)** is an architectural style designed by Roy Fielding in 2000. For an API to be considered RESTful, it must adhere to these core constraints:
	-
	- ## Core Constraints
		- 1. **Client-Server Separation**: The client (frontend/UI) and the server (backend/data storage) must evolve independently.
		- 2. **Statelessness**: Each request from a client must contain all the information necessary to process it. The server does not store client session state.
		- 3. **Cacheability**: Responses must declare themselves as cacheable or non-cacheable to improve performance.
		- 4. **Layered System**: The client cannot tell whether it is connected directly to the end server or to an intermediate (e.g., load balancer, gateway).
		- 5. **Uniform Interface**: Resources are identified by URIs. Interaction with resources is performed using standard representations (e.g., JSON) and HTTP methods.
-
- # HTTP Methods & Status Codes
  collapsed:: true
	- ## HTTP Request Methods
	  collapsed:: true
		- | Method | Purpose | Safe | Idempotent | Description |
		  |---|---|---|---|---|
		  | **`GET`** | Retrieve resource | Yes | Yes | Fetches data from server. Should never modify data. |
		  | **`POST`** | Create resource | No | No | Submits data to create a new resource on the server. |
		  | **`PUT`** | Replace resource | No | Yes | Replaces an entire target resource with the request payload. |
		  | **`PATCH`** | Partially update | No | No | Applies partial modifications to an existing resource. |
		  | **`DELETE`** | Remove resource | No | Yes | Deletes the specified resource. |
	-
	- ## Standard HTTP Status Codes
	  collapsed:: true
		- ### 🟢 2xx Success
		  collapsed:: true
			- `200 OK`: Request succeeded. Response body contains the fetched data.
			- `201 Created`: Request succeeded and a new resource was created.
			- `204 No Content`: Request succeeded but there is no payload to return (often for DELETE/PUT updates).
		- ### 🟡 3xx Redirection
		  collapsed:: true
			- `301 Moved Permanently`: The URI of the requested resource has changed.
			- `304 Not Modified`: Cached response is still valid; client doesn't need to download the resource again.
		- ### 🔴 4xx Client Errors
		  collapsed:: true
			- `400 Bad Request`: The request was invalid or could not be parsed by the server.
			- `401 Unauthorized`: Authentication credentials are missing or invalid.
			- `403 Forbidden`: The client is authenticated but does not have permission to access the resource.
			- `404 Not Found`: The requested resource could not be found.
			- `429 Too Many Requests`: The client has exceeded rate limits.
		- ### 💥 5xx Server Errors
		  collapsed:: true
			- `500 Internal Server Error`: Generic fallback for unexpected backend crashes.
			- `502 Bad Gateway`: Server acting as a gateway received an invalid response from upstream.
			- `503 Service Unavailable`: Server is overloaded or down for maintenance.
-
- # API Security & Traffic Control
  collapsed:: true
	- ## Authentication & Authorization
	  collapsed:: true
		- **API Keys**: Simple tokens sent in request headers or queries. Easy to implement but lack security granularity and expiration dates.
		- **JWT (JSON Web Token)**: Cryptographically signed tokens encoding user details and claims. Stateless, allowing servers to verify identity without database queries.
		- **OAuth 2.0**: The industry-standard authorization framework. Utilizes access tokens, refresh tokens, and authentication servers to grant restricted access to third-party clients.
	-
	- ## Traffic Management
	  collapsed:: true
		- **Rate Limiting & Throttling**: Restricting the number of requests a client can make in a given timeframe (e.g., 60 requests/minute). Solves Denial of Service (DoS) attacks and ensures fair usage. Response headers typically include:
			- `X-RateLimit-Limit`: Maximum requests allowed.
			- `X-RateLimit-Remaining`: Remaining request count in current window.
			- `X-RateLimit-Reset`: Time when the limit window resets.
		- **Caching**: Storing API responses in cache layers (e.g., Redis or CDN) to reduce database load. Managed using HTTP headers:
			- `Cache-Control: max-age=3600`
			- `ETag`: Token identifying the version of the resource.
		- **Webhooks**: Event-driven API patterns where the server pushes real-time data to a client's pre-configured URL endpoint upon event triggers.
-
- # Consuming APIs (Code Examples)
  collapsed:: true
	- :::code-tabs
	  
	  ```javascript
	  // ─── JS Fetch ────────────────────────────────────────────────────────
	  // Making a GET and POST request using Native browser Fetch API
	  
	  const API_URL = "https://api.example.com/v1/users";
	  
	  // 1. GET Request
	  async function getUsers() {
	    try {
	      const response = await fetch(API_URL, {
	        method: "GET",
	        headers: {
	          "Accept": "application/json",
	          "Authorization": "Bearer YOUR_JWT_TOKEN"
	        }
	      });
	      if (!response.ok) {
	        throw new Error(`HTTP error! status: ${response.status}`);
	      }
	      const users = await response.json();
	      console.log("Users:", users);
	    } catch (error) {
	      console.error("GET failed:", error);
	    }
	  }
	  
	  // 2. POST Request
	  async function createUser(userData) {
	    try {
	      const response = await fetch(API_URL, {
	        method: "POST",
	        headers: {
	          "Content-Type": "application/json",
	          "Authorization": "Bearer YOUR_JWT_TOKEN"
	        },
	        body: JSON.stringify(userData)
	      });
	      const newUser = await response.json();
	      console.log("Created User:", newUser);
	    } catch (error) {
	      console.error("POST failed:", error);
	    }
	  }
	  ```
	  
	  ```javascript
	  // ─── JS Axios ────────────────────────────────────────────────────────
	  // Consuming endpoints with Axios (automatically handles JSON parsing)
	  import axios from 'axios';
	  
	  const apiClient = axios.create({
	    baseURL: 'https://api.example.com/v1',
	    timeout: 5000,
	    headers: {
	      'Authorization': 'Bearer YOUR_JWT_TOKEN',
	      'Content-Type': 'application/json'
	    }
	  });
	  
	  // GET request
	  async function fetchUsers() {
	    try {
	      const response = await apiClient.get('/users');
	      console.log("Data:", response.data);
	    } catch (error) {
	      console.error("Axios GET failed:", error.message);
	    }
	  }
	  
	  // POST request
	  async function addNewUser(userData) {
	    try {
	      const response = await apiClient.post('/users', userData);
	      console.log("Created:", response.data);
	    } catch (error) {
	      console.error("Axios POST failed:", error.message);
	    }
	  }
	  ```
	  
	  ```python
	  # ─── Python Requests ──────────────────────────────────────────────────
	  # Standard HTTP client consumption in Python
	  import requests
	  
	  API_URL = "https://api.example.com/v1/users"
	  headers = {
	      "Authorization": "Bearer YOUR_JWT_TOKEN",
	      "Content-Type": "application/json"
	  }
	  
	  # GET Request
	  def get_users():
	      try:
	          response = requests.get(API_URL, headers=headers, timeout=5)
	          response.raise_for_status() # Raise exception for 4xx/5xx status codes
	          users = response.json()
	          print("Users:", users)
	      except requests.exceptions.RequestException as e:
	          print("Request failed:", e)
	  
	  # POST Request
	  def create_user(user_data):
	      try:
	          response = requests.post(API_URL, headers=headers, json=user_data, timeout=5)
	          response.raise_for_status()
	          print("Created:", response.json())
	      except requests.exceptions.RequestException as e:
	          print("POST request failed:", e)
	  ```
	  
	  ```go
	  // ─── Go net/http ─────────────────────────────────────────────────────
	  package main
	  
	  import (
	  	"bytes"
	  	"encoding/json"
	  	"fmt"
	  	"io"
	  	"net/http"
	  	"time"
	  )
	  
	  type User struct {
	  	Name  string `json:"name"`
	  	Email string `json:"email"`
	  }
	  
	  func main() {
	  	client := &http.Client{Timeout: 5 * time.Second}
	  	url := "https://api.example.com/v1/users"
	  
	  	// 1. GET Request
	  	req, _ := http.NewRequest("GET", url, nil)
	  	req.Header.Add("Authorization", "Bearer YOUR_JWT_TOKEN")
	  	
	  	resp, err := client.Do(req)
	  	if err == nil {
	  		defer resp.Body.Close()
	  		body, _ := io.ReadAll(resp.Body)
	  		fmt.Println("GET response:", string(body))
	  	}
	  
	  	// 2. POST Request
	  	newUser := User{Name: "Alice", Email: "alice@example.com"}
	  	jsonData, _ := json.Marshal(newUser)
	  	
	  	postReq, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	  	postReq.Header.Add("Content-Type", "application/json")
	  	postReq.Header.Add("Authorization", "Bearer YOUR_JWT_TOKEN")
	  	
	  	postResp, postErr := client.Do(postReq)
	  	if postErr == nil {
	  		defer postResp.Body.Close()
	  		body, _ := io.ReadAll(postResp.Body)
	  		fmt.Println("POST response:", string(body))
	  	}
	  }
	  ```
	  
	  ```java
	  // ─── Java HttpClient ─────────────────────────────────────────────────
	  import java.net.URI;
	  import java.net.http.HttpClient;
	  import java.net.http.HttpRequest;
	  import java.net.http.HttpResponse;
	  import java.time.Duration;
	  
	  public class ApiClientExample {
	      private static final HttpClient client = HttpClient.newBuilder()
	              .connectTimeout(Duration.ofSeconds(5))
	              .build();
	      private static final String API_URL = "https://api.example.com/v1/users";
	  
	      public static void main(String[] args) throws Exception {
	          // 1. GET Request
	          HttpRequest getRequest = HttpRequest.newBuilder()
	                  .uri(URI.create(API_URL))
	                  .header("Authorization", "Bearer YOUR_JWT_TOKEN")
	                  .GET()
	                  .build();
	  
	          HttpResponse<String> getResponse = client.send(getRequest, HttpResponse.BodyHandlers.ofString());
	          System.out.println("GET Response: " + getResponse.body());
	  
	          // 2. POST Request
	          String jsonBody = "{\"name\":\"Bob\",\"email\":\"bob@example.com\"}";
	          HttpRequest postRequest = HttpRequest.newBuilder()
	                  .uri(URI.create(API_URL))
	                  .header("Content-Type", "application/json")
	                  .header("Authorization", "Bearer YOUR_JWT_TOKEN")
	                  .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
	                  .build();
	  
	          HttpResponse<String> postResponse = client.send(postRequest, HttpResponse.BodyHandlers.ofString());
	          System.out.println("POST Response: " + postResponse.body());
	      }
	  }
	  ```
	  
	  :::
-
- # API Backend Frameworks
  collapsed:: true
	- | Framework | Language | Architecture Style | Pros | Cons |
	  |---|---|---|---|---|
	  | **FastAPI** | Python | REST, GraphQL | Modern async support, auto-generated OpenAPI/Swagger UI docs, Pydantic type validation. | Relies on Python async ecosystem compatibility. |
	  | **Express** | Node.js | REST, GraphQL | Highly flexible, lightweight, massive ecosystem, excellent middleware pattern. | Unstructured; requires developers to architect routing/DB layers. |
	  | **Spring Boot**| Java | REST, SOAP, GraphQL | Enterprise-ready, dependency injection, robust security framework, highly scalable. | Heavy runtime footprint, steep learning curve. |
	  | **ASP.NET Core**| C# | REST, gRPC | Blazing fast execution, strongly typed, excellent dependency injection support. | Relies heavily on Microsoft's .NET ecosystem. |
	  | **Flask** | Python | REST | Extremely simple, lightweight microframework, perfect for tiny backends/prototypes. | Lacks native async features, requires extensions for enterprise use. |
-
- # Learning References
  collapsed:: true
	- ## Documentation & Guidelines
		- [Roy Fielding's REST Dissertation](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
		- [MDN Web Docs — HTTP API Guideline](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
		- [OpenAPI Specification (OAS)](https://swagger.io/specification/)
		- [GraphQL Foundation Documentation](https://graphql.org/learn/)
		- [gRPC Guides & Docs](https://grpc.io/docs/)