---
seoTitle: Google Test (gtest) – C++ Unit Testing Framework Reference
description: "Google Test (gtest) is Google's C++ unit testing framework. Covers test cases, assertions, fixtures, mocking with gMock, parameterized tests, and CMake integration."
keywords: "Google Test, gtest, C++ unit testing, gMock, test fixtures, assertions, parameterized tests, CMake testing, C++ testing framework, TDD, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Google Test (gtest)
---

- # History
  collapsed:: true
	- **Who**: Developed by Google's testing technology team.
	- **Why**: To provide a robust, portable C++ testing framework that supports test discovery, rich assertions, and test fixtures.
	- **When**: Open-sourced around 2008. Now part of the `googletest` monorepo which also includes gMock.
- # Introduction
  collapsed:: true
	- ## What is Google Test?
		- A C++ testing framework by Google, widely used in industry and open-source projects.
		- Provides test discovery, assertions, fixtures, parameterized tests, and death tests.
		- GitHub: [google/googletest](https://github.com/google/googletest)
	-
	- ## Advantages
	  collapsed:: true
		- Rich assertion macros (EXPECT_*, ASSERT_*).
		- Test fixtures for shared setup/teardown.
		- Parameterized tests to run the same test with different inputs.
		- gMock integration for mocking.
		- Excellent IDE and CI integration.
		- Widely adopted — large community and documentation.
	-
	- ## Disadvantages
	  collapsed:: true
		- Requires compilation (not header-only).
		- More verbose than Catch2 for simple tests.
		- gMock has a learning curve.
- # Installation & Setup
  collapsed:: true
	- ## CMake (FetchContent — Recommended)
		- ```cmake
		  include(FetchContent)
		  FetchContent_Declare(googletest
		      URL https://github.com/google/googletest/archive/refs/tags/v1.14.0.zip
		  )
		  FetchContent_MakeAvailable(googletest)
		  
		  enable_testing()
		  add_executable(my_tests test_main.cpp)
		  target_link_libraries(my_tests GTest::gtest_main)
		  include(GoogleTest)
		  gtest_discover_tests(my_tests)
		  ```
	-
	- ## vcpkg
		- ```bash
		  vcpkg install gtest
		  ```
	-
	- ## apt (Ubuntu)
		- ```bash
		  sudo apt install libgtest-dev
		  ```
- # Core Concepts
  collapsed:: true
	- ## Basic Test Structure
	  collapsed:: true
		- ```cpp
		  #include <gtest/gtest.h>
		  
		  // TEST(TestSuiteName, TestName)
		  TEST(MathTest, Addition) {
		      EXPECT_EQ(2 + 2, 4);
		      EXPECT_EQ(10 + 5, 15);
		  }
		  
		  TEST(MathTest, Division) {
		      EXPECT_DOUBLE_EQ(10.0 / 3.0, 3.3333333333333335);
		  }
		  
		  int main(int argc, char** argv) {
		      ::testing::InitGoogleTest(&argc, argv);
		      return RUN_ALL_TESTS();
		  }
		  // With gtest_main linked, you don't need main()
		  ```
	-
	- ## Assertion Macros
	  collapsed:: true
		- ```cpp
		  // EXPECT_* — non-fatal: test continues on failure
		  // ASSERT_* — fatal: test stops on failure
		  
		  EXPECT_EQ(a, b);       // a == b
		  EXPECT_NE(a, b);       // a != b
		  EXPECT_LT(a, b);       // a < b
		  EXPECT_LE(a, b);       // a <= b
		  EXPECT_GT(a, b);       // a > b
		  EXPECT_GE(a, b);       // a >= b
		  
		  EXPECT_TRUE(condition);
		  EXPECT_FALSE(condition);
		  
		  EXPECT_STREQ(s1, s2);  // C-string equality
		  EXPECT_STRNE(s1, s2);
		  
		  EXPECT_FLOAT_EQ(f1, f2);   // float with tolerance
		  EXPECT_DOUBLE_EQ(d1, d2);  // double with tolerance
		  EXPECT_NEAR(a, b, abs_error); // within abs_error
		  
		  // Fatal versions
		  ASSERT_EQ(a, b);
		  ASSERT_TRUE(ptr != nullptr); // stops test if ptr is null
		  ```
	-
	- ## Custom Failure Messages
	  collapsed:: true
		- ```cpp
		  EXPECT_EQ(result, expected) << "Failed for input: " << input;
		  ASSERT_GT(size, 0) << "Container should not be empty";
		  ```
- # Test Fixtures
  collapsed:: true
	- ```cpp
	  #include <gtest/gtest.h>
	  #include <vector>
	  
	  // Fixture class — inherits from ::testing::Test
	  class VectorTest : public ::testing::Test {
	  protected:
	      std::vector<int> v;
	  
	      void SetUp() override {
	          v = {1, 2, 3, 4, 5}; // runs before each test
	      }
	  
	      void TearDown() override {
	          // runs after each test (optional cleanup)
	      }
	  };
	  
	  // Use TEST_F for fixture tests
	  TEST_F(VectorTest, SizeIsCorrect) {
	      EXPECT_EQ(v.size(), 5u);
	  }
	  
	  TEST_F(VectorTest, FirstElement) {
	      EXPECT_EQ(v[0], 1);
	  }
	  
	  TEST_F(VectorTest, PushBack) {
	      v.push_back(6);
	      EXPECT_EQ(v.size(), 6u);
	      EXPECT_EQ(v.back(), 6);
	  }
	  ```
- # Parameterized Tests
  collapsed:: true
	- ```cpp
	  #include <gtest/gtest.h>
	  
	  // Function to test
	  bool isPrime(int n) {
	      if (n < 2) return false;
	      for (int i = 2; i * i <= n; i++)
	          if (n % i == 0) return false;
	      return true;
	  }
	  
	  // Parameterized fixture
	  class PrimeTest : public ::testing::TestWithParam<int> {};
	  
	  TEST_P(PrimeTest, IsPrime) {
	      EXPECT_TRUE(isPrime(GetParam()));
	  }
	  
	  INSTANTIATE_TEST_SUITE_P(
	      PrimeValues,
	      PrimeTest,
	      ::testing::Values(2, 3, 5, 7, 11, 13, 17, 19)
	  );
	  
	  // Non-prime test
	  class NonPrimeTest : public ::testing::TestWithParam<int> {};
	  TEST_P(NonPrimeTest, IsNotPrime) {
	      EXPECT_FALSE(isPrime(GetParam()));
	  }
	  INSTANTIATE_TEST_SUITE_P(
	      NonPrimeValues, NonPrimeTest,
	      ::testing::Values(0, 1, 4, 6, 8, 9, 10)
	  );
	  ```
- # Exception & Death Tests
  collapsed:: true
	- ```cpp
	  // Exception tests
	  EXPECT_THROW(throw std::runtime_error("err"), std::runtime_error);
	  EXPECT_NO_THROW(safeFunction());
	  EXPECT_ANY_THROW(riskyFunction());
	  
	  // Death tests — test that code crashes/exits as expected
	  void crashFunc() { int* p = nullptr; *p = 1; }
	  
	  EXPECT_DEATH(crashFunc(), ""); // expects crash (any message)
	  EXPECT_EXIT(exit(1), ::testing::ExitedWithCode(1), "");
	  ```
- # gMock — Mocking
  collapsed:: true
	- ```cpp
	  #include <gmock/gmock.h>
	  
	  // Interface to mock
	  class Database {
	  public:
	      virtual ~Database() = default;
	      virtual bool connect(const std::string& url) = 0;
	      virtual std::string query(const std::string& sql) = 0;
	  };
	  
	  // Mock class
	  class MockDatabase : public Database {
	  public:
	      MOCK_METHOD(bool, connect, (const std::string& url), (override));
	      MOCK_METHOD(std::string, query, (const std::string& sql), (override));
	  };
	  
	  // Test using mock
	  TEST(ServiceTest, ConnectsAndQueries) {
	      MockDatabase db;
	  
	      EXPECT_CALL(db, connect("localhost"))
	          .Times(1)
	          .WillOnce(::testing::Return(true));
	  
	      EXPECT_CALL(db, query(::testing::HasSubstr("SELECT")))
	          .WillOnce(::testing::Return("result_data"));
	  
	      EXPECT_TRUE(db.connect("localhost"));
	      EXPECT_EQ(db.query("SELECT * FROM users"), "result_data");
	  }
	  ```
- # Running Tests
  collapsed:: true
	- ```bash
	  # Build and run
	  cmake -B build && cmake --build build
	  ./build/my_tests
	  
	  # Run specific test
	  ./my_tests --gtest_filter=MathTest.Addition
	  
	  # Run all tests matching pattern
	  ./my_tests --gtest_filter=Math*
	  
	  # List all tests
	  ./my_tests --gtest_list_tests
	  
	  # Run with CTest
	  cd build && ctest --output-on-failure
	  ```
- # More Learn
	- [GoogleTest GitHub](https://github.com/google/googletest)
	- [GoogleTest Primer](https://google.github.io/googletest/primer.html)
	- [gMock for Dummies](https://google.github.io/googletest/gmock_for_dummies.html)
	- [GoogleTest Advanced Guide](https://google.github.io/googletest/advanced.html)