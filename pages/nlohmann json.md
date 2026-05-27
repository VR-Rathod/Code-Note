---
seoTitle: nlohmann/json – C++ JSON Library Complete Reference
description: "nlohmann/json is the most popular single-header C++ JSON library. Covers parsing, serialization, custom types, JSON Pointer, JSON Schema, and STL integration."
keywords: "nlohmann json, C++ JSON, json.hpp, JSON parsing, JSON serialization, C++ JSON library, single header, modern C++, json pointer, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: nlohmann/json
---

- # History
  collapsed:: true
	- **Who**: Created by Niels Lohmann (GitHub: nlohmann).
	- **Why**: To provide a modern, intuitive C++ JSON library that feels natural — using STL containers and operator overloading so JSON reads like native C++ code.
	- **When**: First released around 2013, now one of the most starred C++ repos on GitHub.
- # Introduction
  collapsed:: true
	- ## What is it?
		- A single-header JSON library for C++11 and later.
		- Include just `json.hpp` — no build system changes needed.
		- GitHub: [nlohmann/json](https://github.com/nlohmann/json)
	-
	- ## Advantages
	  collapsed:: true
		- Single header — drop `json.hpp` into your project and go.
		- Intuitive syntax — JSON objects map naturally to C++ types.
		- Full JSON spec compliance (RFC 8259).
		- Supports custom type serialization/deserialization.
		- STL-compatible iterators and algorithms.
	-
	- ## Disadvantages
	  collapsed:: true
		- Slower than simpler parsers (simdjson, RapidJSON) for high-throughput use.
		- Large header can increase compile times.
		- Not ideal for embedded/constrained environments.
- # Installation & Setup
  collapsed:: true
	- ## Single Header (Easiest)
		- ```bash
		  # Download json.hpp from GitHub releases
		  wget https://github.com/nlohmann/json/releases/latest/download/json.hpp
		  ```
		- ```c++
		  #include "json.hpp"
		  using json = nlohmann::json;
		  ```
	-
	- ## vcpkg
		- ```bash
		  vcpkg install nlohmann-json
		  ```
	-
	- ## CMake (FetchContent)
		- ```cmake
		  include(FetchContent)
		  FetchContent_Declare(json
		      URL https://github.com/nlohmann/json/releases/download/v3.11.3/json.hpp
		  )
		  FetchContent_MakeAvailable(json)
		  target_link_libraries(MyApp nlohmann_json::nlohmann_json)
		  ```
- # Core Concepts
  collapsed:: true
	- ## Creating JSON
	  collapsed:: true
		- ```c++
		  #include <nlohmann/json.hpp>
		  using json = nlohmann::json;
		  
		  // From literals
		  json j = {
		      {"name", "Alice"},
		      {"age", 30},
		      {"active", true},
		      {"scores", {95, 87, 92}},
		      {"address", {
		          {"city", "Mumbai"},
		          {"zip", "400001"}
		      }}
		  };
		  
		  std::cout << j.dump(4); // pretty print with 4-space indent
		  ```
	-
	- ## Accessing Values
	  collapsed:: true
		- ```c++
		  json j = {{"name", "Bob"}, {"age", 25}, {"scores", {10, 20, 30}}};
		  
		  std::string name = j["name"];       // "Bob"
		  int age = j["age"];                 // 25
		  int first = j["scores"][0];         // 10
		  
		  // Safe access with .value() — returns default if key missing
		  std::string city = j.value("city", "Unknown"); // "Unknown"
		  
		  // Check existence
		  if (j.contains("name")) { ... }
		  if (j.count("age")) { ... }
		  ```
	-
	- ## Parsing JSON Strings
	  collapsed:: true
		- ```c++
		  std::string raw = R"({"id": 1, "title": "Hello", "tags": ["cpp", "json"]})";
		  
		  json j = json::parse(raw);
		  
		  std::cout << j["title"];        // Hello
		  std::cout << j["tags"][0];      // cpp
		  
		  // Parse with error handling
		  try {
		      json bad = json::parse("{invalid}");
		  } catch (const json::parse_error& e) {
		      std::cout << "Parse error: " << e.what();
		  }
		  ```
	-
	- ## Serialization (to string)
	  collapsed:: true
		- ```c++
		  json j = {{"x", 1}, {"y", 2}};
		  
		  std::string compact = j.dump();      // {"x":1,"y":2}
		  std::string pretty  = j.dump(2);     // pretty with 2-space indent
		  
		  // To stream
		  std::cout << j << "\n";
		  std::ofstream file("out.json");
		  file << j;
		  ```
	-
	- ## Reading from File
	  collapsed:: true
		- ```c++
		  #include <fstream>
		  
		  std::ifstream file("config.json");
		  json config;
		  file >> config;
		  
		  std::string host = config["server"]["host"];
		  int port = config["server"]["port"];
		  ```
- # Custom Type Serialization
  collapsed:: true
	- ```c++
	  struct Point {
	      double x, y;
	  };
	  
	  // Define to_json and from_json in the same namespace as Point
	  void to_json(json& j, const Point& p) {
	      j = json{{"x", p.x}, {"y", p.y}};
	  }
	  
	  void from_json(const json& j, Point& p) {
	      j.at("x").get_to(p.x);
	      j.at("y").get_to(p.y);
	  }
	  
	  // Usage
	  Point pt{3.0, 4.0};
	  json j = pt;                    // calls to_json
	  std::cout << j.dump();          // {"x":3.0,"y":4.0}
	  
	  Point pt2 = j.get<Point>();     // calls from_json
	  std::cout << pt2.x;             // 3.0
	  ```
- # STL Container Integration
  collapsed:: true
	- ```c++
	  // vector
	  std::vector<int> v = {1, 2, 3};
	  json j = v;                          // [1,2,3]
	  std::vector<int> v2 = j.get<std::vector<int>>();
	  
	  // map
	  std::map<std::string, int> m = {{"a", 1}, {"b", 2}};
	  json jm = m;                         // {"a":1,"b":2}
	  
	  // Iterate JSON object
	  for (auto& [key, val] : j.items()) {
	      std::cout << key << ": " << val << "\n";
	  }
	  
	  // Iterate JSON array
	  for (const auto& item : j) {
	      std::cout << item << "\n";
	  }
	  ```
- # JSON Pointer & Patch
  collapsed:: true
	- ```c++
	  json j = {{"a", {{"b", {{"c", 42}}}}}};
	  
	  // JSON Pointer (RFC 6901)
	  std::cout << j["/a/b/c"_json_pointer]; // 42
	  
	  // Modify via pointer
	  j["/a/b/c"_json_pointer] = 99;
	  
	  // JSON Patch (RFC 6902)
	  json patch = json::parse(R"([
	      {"op": "replace", "path": "/a/b/c", "value": 100},
	      {"op": "add", "path": "/a/b/d", "value": "new"}
	  ])");
	  json patched = j.patch(patch);
	  ```
- # More Learn
	- [nlohmann/json GitHub](https://github.com/nlohmann/json)
	- [Official Documentation](https://json.nlohmann.me/)
	- [API Reference](https://json.nlohmann.me/api/basic_json/)