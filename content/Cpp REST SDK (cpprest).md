---
date: 2026-05-18T10:12:55+05:30
lastmod: 2026-05-18T10:12:55+05:30

seoTitle: C++ REST SDK (cpprestsdk) – RESTful Web Services Reference
description: "C++ REST SDK (cpprestsdk/Casablanca) reference for building RESTful web services. Covers HTTP client/server, JSON, async tasks, WebSockets, and OAuth."
keywords: "cpprestsdk, C++ REST SDK, Casablanca, C++ HTTP client, C++ REST API, async HTTP, C++ JSON, WebSocket C++, Microsoft REST SDK, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: C++ REST SDK (cpprestsdk)
---

- # History
  collapsed:: true
	- **Who**: Developed by Microsoft (originally codenamed "Casablanca").
	- **Why**: To provide a modern, asynchronous C++ library for building cloud-based client-server communication using REST APIs.
	- **When**: Open-sourced in 2012. GitHub: [microsoft/cpprestsdk](https://github.com/microsoft/cpprestsdk)
- # Introduction
  collapsed:: true
	- ## What is cpprestsdk?
		- A Microsoft open-source library for cross-platform, asynchronous HTTP communication in C++.
		- Built on top of PPL (Parallel Patterns Library) tasks for async programming.
		- Supports HTTP client/server, JSON, WebSockets, and OAuth.
	-
	- ## Advantages
	  collapsed:: true
		- Fully asynchronous — uses `pplx::task` (similar to `std::future`).
		- Built-in JSON support.
		- Cross-platform: Windows, Linux, macOS.
		- WebSocket support.
	-
	- ## Disadvantages
	  collapsed:: true
		- Microsoft has put the project in maintenance mode (limited new features).
		- PPL task model has a learning curve.
		- Heavier than alternatives like cpp-httplib for simple use cases.
- # Installation & Setup
  collapsed:: true
	- ## vcpkg
		- ```bash
		  vcpkg install cpprestsdk
		  ```
	-
	- ## apt (Ubuntu)
		- ```bash
		  sudo apt install libcpprest-dev
		  ```
	-
	- ## CMake
		- ```cmake
		  find_package(cpprestsdk REQUIRED)
		  target_link_libraries(MyApp cpprestsdk::cpprest)
		  ```
- # Core Concepts
  collapsed:: true
	- ## HTTP GET Request
	  collapsed:: true
		- ```cpp
		  #include <cpprest/http_client.h>
		  #include <cpprest/json.h>
		  using namespace web;
		  using namespace web::http;
		  using namespace web::http::client;
		  
		  http_client client(U("https://jsonplaceholder.typicode.com"));
		  
		  client.request(methods::GET, U("/todos/1"))
		      .then([](http_response response) {
		          std::cout << "Status: " << response.status_code() << "\n";
		          return response.extract_json();
		      })
		      .then([](json::value body) {
		          std::wcout << body[U("title")].as_string() << "\n";
		      })
		      .wait(); // block until done
		  ```
	-
	- ## HTTP POST with JSON
	  collapsed:: true
		- ```cpp
		  http_client client(U("https://api.example.com"));
		  
		  json::value body;
		  body[U("name")] = json::value::string(U("Alice"));
		  body[U("age")]  = json::value::number(30);
		  
		  client.request(methods::POST, U("/users"), body.serialize(), U("application/json"))
		      .then([](http_response response) {
		          return response.extract_json();
		      })
		      .then([](json::value result) {
		          std::wcout << result.serialize() << "\n";
		      })
		      .wait();
		  ```
	-
	- ## HTTP Server
	  collapsed:: true
		- ```cpp
		  #include <cpprest/http_listener.h>
		  using namespace web::http::experimental::listener;
		  
		  http_listener listener(U("http://localhost:8080"));
		  
		  listener.support(methods::GET, [](http_request req) {
		      json::value response;
		      response[U("message")] = json::value::string(U("Hello, World!"));
		      req.reply(status_codes::OK, response);
		  });
		  
		  listener.open().wait();
		  std::cout << "Server running on port 8080\n";
		  std::cin.get(); // keep alive
		  listener.close().wait();
		  ```
- # More Learn
	- [cpprestsdk GitHub](https://github.com/microsoft/cpprestsdk)
	- [cpprestsdk Wiki](https://github.com/microsoft/cpprestsdk/wiki)
	- [REST SDK Samples](https://github.com/microsoft/cpprestsdk/tree/master/Release/samples)