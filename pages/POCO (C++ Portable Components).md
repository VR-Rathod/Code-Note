---
seoTitle: POCO C++ Libraries – Portable Components Reference Guide
description: "POCO C++ Libraries reference covering HTTP server/client, JSON/XML parsing, database access, threading, filesystem, and networking for cross-platform C++ apps."
keywords: "POCO C++, POCO libraries, C++ HTTP, C++ networking, C++ JSON, C++ XML, C++ database, Poco::Net, Poco::JSON, cross-platform C++, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: POCO (C++ Portable Components)
---

- # History
  collapsed:: true
	- **Who**: Created by Günter Obiltschnig at Applied Informatics Software Engineering GmbH.
	- **Why**: To provide a comprehensive set of C++ class libraries for building networked, portable applications — similar to what Java's standard library offers but for C++.
	- **When**: First released in 2004. Actively maintained.
- # Introduction
  collapsed:: true
	- ## What is POCO?
		- A collection of open-source C++ class libraries for building networked, portable applications.
		- Covers HTTP, FTP, SMTP, JSON, XML, SQL, threading, filesystem, and more.
		- Website: [pocoproject.org](https://pocoproject.org/)
	-
	- ## Advantages
	  collapsed:: true
		- Comprehensive — covers networking, data, threading, and utilities in one library.
		- Cross-platform: Windows, Linux, macOS, embedded.
		- Clean, consistent C++ API.
		- Good documentation and active community.
	-
	- ## Disadvantages
	  collapsed:: true
		- Large dependency for simple use cases.
		- Requires compilation (not header-only).
		- Some APIs feel dated compared to modern C++17/20.
- # Installation & Setup
  collapsed:: true
	- ## apt (Ubuntu)
		- ```bash
		  sudo apt install libpoco-dev
		  ```
	-
	- ## vcpkg
		- ```bash
		  vcpkg install poco
		  ```
	-
	- ## CMake
		- ```cmake
		  find_package(Poco REQUIRED COMPONENTS Net JSON XML Data)
		  target_link_libraries(MyApp Poco::Net Poco::JSON Poco::XML Poco::Data)
		  ```
- # Core Concepts
  collapsed:: true
	- ## HTTP Client
	  collapsed:: true
		- ```c++
		  #include <Poco/Net/HTTPClientSession.h>
		  #include <Poco/Net/HTTPRequest.h>
		  #include <Poco/Net/HTTPResponse.h>
		  #include <Poco/StreamCopier.h>
		  #include <iostream>
		  
		  Poco::Net::HTTPClientSession session("example.com", 80);
		  
		  Poco::Net::HTTPRequest request(
		      Poco::Net::HTTPRequest::HTTP_GET,
		      "/",
		      Poco::Net::HTTPMessage::HTTP_1_1
		  );
		  request.setContentLength(0);
		  session.sendRequest(request);
		  
		  Poco::Net::HTTPResponse response;
		  std::istream& rs = session.receiveResponse(response);
		  
		  std::cout << response.getStatus() << " " << response.getReason() << "\n";
		  Poco::StreamCopier::copyStream(rs, std::cout);
		  ```
	-
	- ## JSON Parsing
	  collapsed:: true
		- ```c++
		  #include <Poco/JSON/Parser.h>
		  #include <Poco/JSON/Object.h>
		  
		  std::string json = R"({"name":"Alice","age":30,"active":true})";
		  
		  Poco::JSON::Parser parser;
		  Poco::Dynamic::Var result = parser.parse(json);
		  Poco::JSON::Object::Ptr obj = result.extract<Poco::JSON::Object::Ptr>();
		  
		  std::string name = obj->getValue<std::string>("name");
		  int age = obj->getValue<int>("age");
		  bool active = obj->getValue<bool>("active");
		  
		  std::cout << name << ", " << age; // Alice, 30
		  ```
	-
	- ## Threading
	  collapsed:: true
		- ```c++
		  #include <Poco/Thread.h>
		  #include <Poco/Runnable.h>
		  
		  class MyTask : public Poco::Runnable {
		  public:
		      void run() override {
		          std::cout << "Running in thread\n";
		      }
		  };
		  
		  MyTask task;
		  Poco::Thread thread;
		  thread.start(task);
		  thread.join();
		  ```
- # More Learn
	- [POCO Official Docs](https://pocoproject.org/documentation/)
	- [POCO GitHub](https://github.com/pocoproject/poco)
	- [POCO Samples](https://github.com/pocoproject/poco/tree/master/Net/samples)