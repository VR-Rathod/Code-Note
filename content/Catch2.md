---
date: 2026-04-08T11:19:07+05:30
lastmod: 2026-05-18T10:12:55+05:30

seoTitle: Catch2 – Modern C++ Testing Framework Reference
description: "Catch2 is a modern, header-friendly C++ testing framework. Covers test cases, sections, BDD-style tests, matchers, generators, and CMake integration."
keywords: "Catch2, C++ testing, unit testing, BDD, test sections, matchers, generators, header-only, modern C++, TDD, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Catch2
---

- # History
  collapsed:: true
	- **Who**: Created by Phil Nash, now maintained by the Catch2 community on GitHub.
	- **Why**: To provide a simpler, more expressive alternative to Google Test — with natural language test names, no separate fixture classes, and a single-header option.
	- **When**: Catch (v1) released around 2010. Catch2 (v2) in 2017. Catch2 v3 (compiled, no longer single-header) in 2022.
- # Introduction
  collapsed:: true
	- ## What is Catch2?
		- A modern C++ testing framework focused on simplicity and expressiveness.
		- Tests read like natural language. No separate fixture class needed.
		- GitHub: [catchorg/Catch2](https://github.com/catchorg/Catch2)
	-
	- ## Advantages
	  collapsed:: true
		- Natural test names — `TEST_CASE("my test description")`.
		- Sections allow shared setup without fixture classes.
		- BDD-style `SCENARIO/GIVEN/WHEN/THEN` macros.
		- Rich matchers for expressive assertions.
		- Property-based testing via generators.
		- Simpler setup than gtest for small projects.
	-
	- ## Disadvantages
	  collapsed:: true
		- v3 is no longer single-header (requires compilation).
		- No built-in mocking (use FakeIt or trompeloeil alongside).
		- Slightly slower compile times than gtest for large suites.
- # Installation & Setup
  collapsed:: true
	- ## CMake (FetchContent)
		- ```cmake
		  include(FetchContent)
		  FetchContent_Declare(Catch2
		      GIT_REPOSITORY https://github.com/catchorg/Catch2.git
		      GIT_TAG v3.5.3
		  )
		  FetchContent_MakeAvailable(Catch2)
		  
		  add_executable(my_tests test.cpp)
		  target_link_libraries(my_tests Catch2::Catch2WithMain)
		  
		  include(CTest)
		  include(Catch)
		  catch_discover_tests(my_tests)
		  ```
	-
	- ## vcpkg
		- ```bash
		  vcpkg install catch2
		  ```
- # Core Concepts
  collapsed:: true
	- ## Basic Test Cases
	  collapsed:: true
		- ```cpp
		  #include <catch2/catch_test_macros.hpp>
		  
		  int factorial(int n) {
		      return n <= 1 ? 1 : n * factorial(n - 1);
		  }
		  
		  TEST_CASE("Factorial of small numbers", "[math]") {
		      REQUIRE(factorial(1) == 1);
		      REQUIRE(factorial(2) == 2);
		      REQUIRE(factorial(3) == 6);
		      REQUIRE(factorial(5) == 120);
		  }
		  
		  TEST_CASE("Factorial of zero", "[math][edge]") {
		      REQUIRE(factorial(0) == 1);
		  }
		  ```
	-
	- ## CHECK vs REQUIRE
	  collapsed:: true
		- ```cpp
		  TEST_CASE("Assertion types") {
		      // REQUIRE — fatal: stops test on failure (like ASSERT_*)
		      REQUIRE(1 + 1 == 2);
		  
		      // CHECK — non-fatal: continues on failure (like EXPECT_*)
		      CHECK(2 * 3 == 6);
		      CHECK(10 / 2 == 5);
		  
		      // REQUIRE_FALSE / CHECK_FALSE
		      REQUIRE_FALSE(false);
		      CHECK_FALSE(1 == 2);
		  }
		  ```
	-
	- ## Sections — Shared Setup Without Fixtures
	  collapsed:: true
		- ```cpp
		  TEST_CASE("Vector operations", "[vector]") {
		      std::vector<int> v;  // setup runs for each SECTION
		  
		      SECTION("push_back increases size") {
		          v.push_back(1);
		          REQUIRE(v.size() == 1);
		      }
		  
		      SECTION("empty vector has size 0") {
		          REQUIRE(v.empty());
		      }
		  
		      SECTION("nested sections") {
		          v.push_back(10);
		          SECTION("first element is 10") {
		              REQUIRE(v[0] == 10);
		          }
		          SECTION("can push more") {
		              v.push_back(20);
		              REQUIRE(v.size() == 2);
		          }
		      }
		  }
		  ```
- # BDD-Style Tests
  collapsed:: true
	- ```cpp
	  #include <catch2/catch_test_macros.hpp>
	  
	  SCENARIO("User logs in", "[auth]") {
	      GIVEN("a registered user") {
	          std::string username = "alice";
	          std::string password = "secret";
	  
	          WHEN("correct credentials are provided") {
	              bool result = login(username, password);
	  
	              THEN("login succeeds") {
	                  REQUIRE(result == true);
	              }
	          }
	  
	          WHEN("wrong password is provided") {
	              bool result = login(username, "wrong");
	  
	              THEN("login fails") {
	                  REQUIRE(result == false);
	              }
	          }
	      }
	  }
	  ```
- # Matchers
  collapsed:: true
	- ```cpp
	  #include <catch2/matchers/catch_matchers_all.hpp>
	  using namespace Catch::Matchers;
	  
	  TEST_CASE("Matchers", "[matchers]") {
	      std::string s = "Hello, World!";
	      REQUIRE_THAT(s, ContainsSubstring("World"));
	      REQUIRE_THAT(s, StartsWith("Hello"));
	      REQUIRE_THAT(s, EndsWith("!"));
	  
	      std::vector<int> v = {1, 2, 3, 4, 5};
	      REQUIRE_THAT(v, Contains(3));
	      REQUIRE_THAT(v, SizeIs(5));
	  
	      double d = 3.14159;
	      REQUIRE_THAT(d, WithinAbs(3.14, 0.01));   // within absolute tolerance
	      REQUIRE_THAT(d, WithinRel(3.14, 0.01));   // within relative tolerance
	  
	      // Combine matchers
	      REQUIRE_THAT(s, ContainsSubstring("Hello") && ContainsSubstring("World"));
	  }
	  ```
- # Generators (Property-Based Style)
  collapsed:: true
	- ```cpp
	  #include <catch2/generators/catch_generators_all.hpp>
	  
	  TEST_CASE("Square is always non-negative", "[generators]") {
	      auto x = GENERATE(range(-5, 6));  // -5, -4, ..., 5
	      REQUIRE(x * x >= 0);
	  }
	  
	  TEST_CASE("String operations", "[generators]") {
	      auto s = GENERATE(
	          std::string("hello"),
	          std::string("world"),
	          std::string("catch2")
	      );
	      REQUIRE_FALSE(s.empty());
	  }
	  
	  // Cartesian product
	  TEST_CASE("All pairs", "[generators]") {
	      auto a = GENERATE(1, 2, 3);
	      auto b = GENERATE(10, 20);
	      REQUIRE(a * b > 0);  // runs 6 times (3 × 2)
	  }
	  ```
- # Exception Testing
  collapsed:: true
	- ```cpp
	  TEST_CASE("Exception handling") {
	      REQUIRE_THROWS(throw std::runtime_error("oops"));
	      REQUIRE_THROWS_AS(throw std::invalid_argument("bad"), std::invalid_argument);
	      REQUIRE_NOTHROW([]{ int x = 1 + 1; }());
	  
	      // With matchers
	      REQUIRE_THROWS_WITH(
	          throw std::runtime_error("file not found"),
	          ContainsSubstring("not found")
	      );
	  }
	  ```
- # Running Tests
  collapsed:: true
	- ```bash
	  # Run all tests
	  ./my_tests
	  
	  # Run by tag
	  ./my_tests "[math]"
	  
	  # Run by name (partial match)
	  ./my_tests "Factorial"
	  
	  # List all tests
	  ./my_tests --list-tests
	  
	  # Verbose output
	  ./my_tests -v
	  
	  # Run with CTest
	  cd build && ctest --output-on-failure
	  ```
- # More Learn
	- [Catch2 GitHub](https://github.com/catchorg/Catch2)
	- [Catch2 Tutorial](https://github.com/catchorg/Catch2/blob/devel/docs/tutorial.md)
	- [Catch2 Reference](https://github.com/catchorg/Catch2/blob/devel/docs/Readme.md)