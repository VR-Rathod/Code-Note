---
seoTitle: Boost C++ Libraries – Complete Reference Guide
description: "Comprehensive Boost C++ reference covering smart pointers, filesystem, regex, threading, Asio networking, serialization, and commonly used Boost components."
keywords: "Boost, Boost C++, Boost libraries, boost::asio, boost::filesystem, boost::regex, boost::thread, boost::serialization, C++ libraries, modern C++, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Boost C++ Libraries
---

- # History
  collapsed:: true
	- **How**: Started in 1998 by a group of C++ committee members to provide peer-reviewed, portable C++ libraries.
	- **Who**: Founded by Beman Dawes, David Abrahams, and other C++ Standards Committee members.
	- **Why**: To fill gaps in the C++ Standard Library and serve as a proving ground for future standard features. Many Boost libraries (smart pointers, regex, filesystem, threads) were later adopted into C++11/14/17.

- # Introduction
  collapsed:: true
	- ## What is Boost?
		- Boost is a collection of peer-reviewed, open-source C++ libraries that extend the Standard Library.
		- Many C++11/14/17/20 features originated as Boost libraries (e.g., `shared_ptr`, `regex`, `filesystem`, `thread`).
		- Website: [boost.org](https://www.boost.org/)
	-
	- ## Advantages
	  collapsed:: true
		- Peer-reviewed — high quality, well-tested code.
		- Portable across compilers and platforms.
		- Many libraries are header-only (no linking needed).
		- Huge ecosystem — 160+ libraries covering almost every domain.
		- Strong overlap with modern C++ standards — learning Boost = learning modern C++.
	-
	- ## Disadvantages
	  collapsed:: true
		- Large download size (~500MB full source).
		- Some libraries have complex template-heavy APIs.
		- Build system (b2/bjam) has a learning curve.
		- Some libraries are now superseded by C++17/20 standard equivalents.

- # Installation & Setup
  collapsed:: true
	- ## Linux (apt)
		- ```bash
		  sudo apt install libboost-all-dev
		  ```
	-
	- ## macOS (Homebrew)
		- ```bash
		  brew install boost
		  ```
	-
	- ## Windows (vcpkg)
		- ```bash
		  vcpkg install boost
		  ```
	-
	- ## Build from Source
		- ```bash
		  # Download from boost.org, then:
		  ./bootstrap.sh
		  ./b2 install
		  ```
	-
	- ## CMake Integration
		- ```cmake
		  find_package(Boost REQUIRED COMPONENTS filesystem regex system)
		  target_link_libraries(MyApp Boost::filesystem Boost::regex)
		  ```

- # Core Libraries
  collapsed:: true
	- ## boost::smart_ptr (now in std)
	  collapsed:: true
		- ```cpp
		  #include <boost/shared_ptr.hpp>
		  #include <boost/make_shared.hpp>
		  
		  boost::shared_ptr<int> p = boost::make_shared<int>(42);
		  std::cout << *p; // 42
		  // Prefer std::shared_ptr in modern C++ (C++11+)
		  ```
	-
	- ## boost::filesystem (now std::filesystem in C++17)
	  collapsed:: true
		- ```cpp
		  #include <boost/filesystem.hpp>
		  namespace fs = boost::filesystem;
		  
		  fs::path p = "/home/user/docs";
		  
		  if (fs::exists(p)) {
		      std::cout << "exists\n";
		  }
		  
		  // Iterate directory
		  for (const auto& entry : fs::directory_iterator(p)) {
		      std::cout << entry.path().filename() << "\n";
		  }
		  
		  // Create directories
		  fs::create_directories("/tmp/a/b/c");
		  
		  // File size
		  std::cout << fs::file_size("file.txt") << " bytes\n";
		  ```
	-
	- ## boost::regex (now std::regex in C++11)
	  collapsed:: true
		- ```cpp
		  #include <boost/regex.hpp>
		  
		  std::string text = "Hello, my email is user@example.com";
		  boost::regex pattern(R"(\w+@\w+\.\w+)");
		  
		  boost::smatch match;
		  if (boost::regex_search(text, match, pattern)) {
		      std::cout << "Found: " << match[0]; // user@example.com
		  }
		  
		  // Replace
		  std::string result = boost::regex_replace(text, pattern, "[REDACTED]");
		  ```
	-
	- ## boost::lexical_cast
	  collapsed:: true
		- ```cpp
		  #include <boost/lexical_cast.hpp>
		  
		  int n = boost::lexical_cast<int>("42");       // string → int
		  std::string s = boost::lexical_cast<std::string>(3.14); // double → string
		  
		  // Throws boost::bad_lexical_cast on failure
		  try {
		      int x = boost::lexical_cast<int>("abc"); // throws
		  } catch (const boost::bad_lexical_cast& e) {
		      std::cout << "Cast failed: " << e.what();
		  }
		  ```
	-
	- ## boost::optional (now std::optional in C++17)
	  collapsed:: true
		- ```cpp
		  #include <boost/optional.hpp>
		  
		  boost::optional<int> findValue(bool found) {
		      if (found) return 42;
		      return boost::none;
		  }
		  
		  auto val = findValue(true);
		  if (val) {
		      std::cout << *val; // 42
		  }
		  ```
	-
	- ## boost::variant (now std::variant in C++17)
	  collapsed:: true
		- ```cpp
		  #include <boost/variant.hpp>
		  
		  boost::variant<int, double, std::string> v;
		  v = 42;
		  v = "hello";
		  v = 3.14;
		  
		  std::cout << boost::get<double>(v); // 3.14
		  
		  // Visitor pattern
		  struct Printer : boost::static_visitor<void> {
		      void operator()(int i) const { std::cout << "int: " << i; }
		      void operator()(double d) const { std::cout << "double: " << d; }
		      void operator()(const std::string& s) const { std::cout << "str: " << s; }
		  };
		  boost::apply_visitor(Printer{}, v);
		  ```

- # boost::asio — Networking & Async I/O
  collapsed:: true
	- ## TCP Client
	  collapsed:: true
		- ```cpp
		  #include <boost/asio.hpp>
		  using boost::asio::ip::tcp;
		  
		  boost::asio::io_context io;
		  tcp::resolver resolver(io);
		  tcp::socket socket(io);
		  
		  auto endpoints = resolver.resolve("example.com", "80");
		  boost::asio::connect(socket, endpoints);
		  
		  // Send HTTP GET
		  std::string request = "GET / HTTP/1.0\r\nHost: example.com\r\n\r\n";
		  boost::asio::write(socket, boost::asio::buffer(request));
		  
		  // Read response
		  boost::asio::streambuf response;
		  boost::asio::read_until(socket, response, "\r\n");
		  std::cout << &response;
		  ```
	-
	- ## Async TCP Server
	  collapsed:: true
		- ```cpp
		  #include <boost/asio.hpp>
		  using boost::asio::ip::tcp;
		  
		  boost::asio::io_context io;
		  tcp::acceptor acceptor(io, tcp::endpoint(tcp::v4(), 8080));
		  
		  // Accept one connection asynchronously
		  auto socket = std::make_shared<tcp::socket>(io);
		  acceptor.async_accept(*socket, [socket](boost::system::error_code ec) {
		      if (!ec) {
		          boost::asio::write(*socket, boost::asio::buffer("Hello!\n"));
		      }
		  });
		  
		  io.run(); // event loop
		  ```
	-
	- ## Timers
	  collapsed:: true
		- ```cpp
		  #include <boost/asio.hpp>
		  
		  boost::asio::io_context io;
		  boost::asio::steady_timer timer(io, std::chrono::seconds(2));
		  
		  timer.async_wait([](boost::system::error_code ec) {
		      if (!ec) std::cout << "Timer fired!\n";
		  });
		  
		  io.run();
		  ```

- # boost::thread — Threading
  collapsed:: true
	- ```cpp
	  #include <boost/thread.hpp>
	  
	  void worker(int id) {
	      std::cout << "Thread " << id << " running\n";
	  }
	  
	  boost::thread t1(worker, 1);
	  boost::thread t2(worker, 2);
	  
	  t1.join();
	  t2.join();
	  
	  // Mutex
	  boost::mutex mtx;
	  boost::lock_guard<boost::mutex> lock(mtx);
	  // critical section
	  ```

- # boost::program_options — CLI Argument Parsing
  collapsed:: true
	- ```cpp
	  #include <boost/program_options.hpp>
	  namespace po = boost::program_options;
	  
	  int main(int argc, char* argv[]) {
	      po::options_description desc("Options");
	      desc.add_options()
	          ("help,h", "Show help")
	          ("input,i", po::value<std::string>(), "Input file")
	          ("verbose,v", po::bool_switch(), "Verbose output");
	  
	      po::variables_map vm;
	      po::store(po::parse_command_line(argc, argv, desc), vm);
	      po::notify(vm);
	  
	      if (vm.count("help")) {
	          std::cout << desc;
	          return 0;
	      }
	      if (vm.count("input")) {
	          std::cout << "Input: " << vm["input"].as<std::string>();
	      }
	  }
	  // Run: ./app -i file.txt --verbose
	  ```

- # boost::serialization
  collapsed:: true
	- ```cpp
	  #include <boost/archive/text_oarchive.hpp>
	  #include <boost/archive/text_iarchive.hpp>
	  #include <boost/serialization/string.hpp>
	  #include <fstream>
	  
	  struct Person {
	      std::string name;
	      int age;
	  
	      template <class Archive>
	      void serialize(Archive& ar, const unsigned int) {
	          ar & name & age;
	      }
	  };
	  
	  // Save
	  {
	      std::ofstream ofs("person.txt");
	      boost::archive::text_oarchive oa(ofs);
	      Person p{"Alice", 30};
	      oa << p;
	  }
	  
	  // Load
	  {
	      std::ifstream ifs("person.txt");
	      boost::archive::text_iarchive ia(ifs);
	      Person p;
	      ia >> p;
	      std::cout << p.name << ", " << p.age; // Alice, 30
	  }
	  ```

- # More Learn
	- [Boost Official Docs](https://www.boost.org/doc/libs/)
	- [Boost Getting Started](https://www.boost.org/doc/libs/release/more/getting_started/index.html)
	- [Boost.Asio Tutorial](https://www.boost.org/doc/libs/release/doc/html/boost_asio/tutorial.html)
	- [Awesome Boost](https://github.com/fffaraz/awesome-cpp#networking)
