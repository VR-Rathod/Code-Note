# History
**How**:
	- Developed by **Bjarne Stroustrup** in 1979 at **Bell Labs**.
	- Originally designed as an enhancement to the C programming language, adding object-oriented features and better abstractions.
	- Evolved through several versions (C++98, C++03, C++11, C++14, C++17, C++20, and beyond).
	  
	  **Who**:
	- **Bjarne Stroustrup**, a computer scientist, is the creator of C++.
	- **Bell Labs**, the research lab at AT&T, where C++ was first developed.
	  
	  **Why**:
	- To address the need for a more efficient, flexible, and powerful language than C.
	- To support both **low-level system programming** and **high-level application development**, balancing performance and abstraction.
	- To introduce features like **object-oriented programming (OOP)** while retaining C's performance and control.
- # Introduction
  collapsed:: true
	- ## Advantages:
	  collapsed:: true
		- **Performance and Control:**
		  collapsed:: true
			- C++ provides **direct memory manipulation** with **pointers** and **manual memory management**, making it ideal for high-performance applications (e.g., games, systems programming, real-time systems).
		-
		- **Object-Oriented Programming (OOP):**
		  collapsed:: true
			- Supports **classes, inheritance, polymorphism**, and **encapsulation**, enabling more maintainable and reusable code.
		-
		- **Multi-Paradigm:**
		  collapsed:: true
			- C++ supports **procedural**, **object-oriented**, and **generic programming** (through templates), giving developers flexibility to choose the best approach.
		-
		- **Standard Template Library (STL):**
		  collapsed:: true
			- Offers a rich set of **generic data structures** (like vectors, maps, lists) and **algorithms**, saving development time and improving efficiency.
		-
		- **Cross-Platform:**
		  collapsed:: true
			- C++ is highly portable, and many modern applications (including operating systems, games, and web browsers) are built using it.
		-
		- **Compatibility with C:**
		  collapsed:: true
			- C++ is largely compatible with C code, making it easy to integrate or port legacy C code into C++ projects.
	-
	- ## Disadvantages:
	  collapsed:: true
		- **Complex Syntax:**
			- C++ has a more **complex syntax** than some other modern languages, making it harder for beginners to learn and use effectively.
		-
		- **Memory Management:**
		  collapsed:: true
			- While offering more control over memory, manual memory management can lead to **memory leaks** or **segmentation faults** if not handled correctly.
		-
		- **Long Compilation Times:**
		  collapsed:: true
			- Due to its extensive features (like templates), C++ can suffer from **long compile times** in large projects.
		-
		- **Lack of Garbage Collection:**
		  collapsed:: true
			- Unlike languages like Java or Python, C++ does not include automatic garbage collection, which places more responsibility on the developer for managing memory.
		-
		- **Complex Error Handling:**
		  collapsed:: true
			- Exception handling is available, but the process can be difficult to manage in large applications, especially when dealing with resource management or **RAII** (Resource Acquisition Is Initialization).
		-
		- **Platform-Specific Issues:**
		  collapsed:: true
			- While C++ is portable, it still requires careful attention to platform-specific details (e.g., differences in compilers, hardware, or OS).
-
- # Notes
  collapsed:: true
	- `main()` function is the entry point of a C++ program
	- `std::count<< "Hello Word" << std::endl;` use for print
	-
	- ## variables Types
	  collapsed:: true
		- ```c++
		  int number = 5;       // Integer
		  float f = 0.95;       // Floating number
		  double PI = 3.14159;  // Floating number
		  char yes = 'Y';       // Character
		  std::string s = "ME"; // String (text)
		  bool isRight = true;  // Boolean
		  
		  // Constants
		  const float RATE = 0.8;	
		  ```
	-
	- ## Primitive Data Types
	  collapsed:: true
		- ```
		  DataType		Size			Range
		  int				4 bytes			-231 to 231-1
		  float			4 bytes			N/A
		  double			8 bytes			N/A
		  char			1 byte			-128 to 127
		  bool			1 byte			true / false
		  void			N/A				N/A
		  wchar_t			2 or 4 bytes	1 wide character
		  ```
	-
	- ## User Input
	  collapsed:: true
		- ```c++
		  int num;
		  
		  std::cout << "Type a number: ";
		  std::cin >> num;
		  
		  std::cout << "You entered " << num;
		  ```
	-
	- ## Swap
	  collapsed:: true
		- ```c++
		  int a = 5, b = 10;
		  std::swap(a, b);
		  
		  // Outputs: a=10, b=5
		  std::cout << "a=" << a << ", b=" << b;
		  ```
	-
	- ## Comments
	  collapsed:: true
		- ```c++
		  // A single one line comment in C++
		  
		  /* This is a multiple line comment
		     in C++ */
		  ```
	-
	- ## Condition
	  collapsed:: true
		- ```c++
		  if (a == 10) {
		      // do something
		  }
		  ```
	-
	- ## C++ Functions
	  collapsed:: true
		- How To Write Func?
			- ```c++
			  #include <iostream>
			   
			  void hello(); // Declaring
			   
			  int main() {  // main function
			      hello();    // Calling
			  }
			   
			  void hello() { // Defining
			      std::cout << "Hello QuickRef!\n";
			  }
			  ```
		- ## Arguments & Returns
			- ```c++
			  #include <iostream>
			  
			  int add(int a, int b) {
			      return a + b;  
			  }
			  
			  int main() {
			      std::cout << add(10, 20); 
			  }
			  ```
		- ## Overloading
			- ```c++
			  void fun(string a, string b) {
			      std::cout << a + " " + b;
			  }
			  void fun(string a) {
			      std::cout << a;
			  }
			  void fun(int a) {
			      std::cout << a;
			  }
			  ```
		- ## Built-in Functions
			- ```c++
			  #include <iostream>
			  #include <cmath> // import library
			   
			  int main() {
			      // sqrt() is from cmath
			      std::cout << sqrt(9);
			  }
			  ```
	-
	- ## References
	  collapsed:: true
		- ```c++
		  int i = 1;
		  int& ri = i; // ri is a reference to i
		  
		  ri = 2; // i is now changed to 2
		  std::cout << "i=" << i;
		  
		  i = 3;   // i is now changed to 3
		  std::cout << "ri=" << ri;
		  ```
	-
	- ## Namespaces
	  collapsed:: true
		- ```c++
		  #include <iostream>
		  namespace ns1 {int val(){return 5;}}
		  int main()
		  {
		      std::cout << ns1::val();
		  }
		  ```
	-
	- ## C++ Arrays
	  collapsed:: true
		- ## Declaration
			- ```c++
			  std::array<int, 3> marks; // Definition
			  marks[0] = 92;
			  marks[1] = 97;
			  marks[2] = 98;
			  
			  // Define and initialize
			  std::array<int, 3> = {92, 97, 98};
			  
			  // With empty members
			  std::array<int, 3> marks = {92, 97};
			  std::cout << marks[2]; // Outputs: 0
			  ```
		- ## Manipulation
			- ```c++
			  ┌─────┬─────┬─────┬─────┬─────┬─────┐
			  | 92  | 97  | 98  | 99  | 98  | 94  |
			  └─────┴─────┴─────┴─────┴─────┴─────┘
			     0     1     2     3     4     5
			    ---------------------------------------
			  std::array<int, 6> marks = {92, 97, 98, 99, 98, 94};
			  
			  // Print first element
			  std::cout << marks[0];
			  
			  // Change 2th element to 99
			  marks[1] = 99;
			  
			  // Take input from the user
			  std::cin >> marks[2];
			  ```
		- ## Displaying
			- ```c++
			  char ref[5] = {'R', 'e', 'f'};
			  
			  // Range based for loop
			  for (const int &n : ref) {
			      std::cout << std::string(1, n);
			  }
			  
			  // Traditional for loop
			  for (int i = 0; i < sizeof(ref); ++i) {
			      std::cout << ref[i];
			  }
			  ```
		- ## Multidimensional
			- ```c++
			       j0   j1   j2   j3   j4   j5
			     ┌────┬────┬────┬────┬────┬────┐
			  i0 | 1  | 2  | 3  | 4  | 5  | 6  |
			     ├────┼────┼────┼────┼────┼────┤
			  i1 | 6  | 5  | 4  | 3  | 2  | 1  |
			     └────┴────┴────┴────┴────┴────┘
			  ---------------------------------------
			  int x[2][6] = {
			      {1,2,3,4,5,6}, {6,5,4,3,2,1}
			  };
			  for (int i = 0; i < 2; ++i) {
			      for (int j = 0; j < 6; ++j) {
			          std::cout << x[i][j] << " ";
			      }
			  }
			  // Outputs: 1 2 3 4 5 6 6 5 4 3 2 1 
			  ```
			-
	-
	- ## C++ Conditionals
	  collapsed:: true
		- ## If Clause
			- ```c++
			  if (a == 10) {
			      // do something
			  }
			  -------------------------
			    int number = 16;
			  
			  if (number % 2 == 0)
			  {
			      std::cout << "even";
			  }
			  else
			  {
			      std::cout << "odd";
			  }
			  
			  // Outputs: even
			  ```
		- ## Else if Statement
			- ```c++
			  int score = 99;
			  if (score == 100) {
			      std::cout << "Superb";
			  }
			  else if (score >= 90) {
			      std::cout << "Excellent";
			  }
			  else if (score >= 80) {
			      std::cout << "Very Good";
			  }
			  else if (score >= 70) {
			      std::cout << "Good";
			  }
			  else if (score >= 60)
			      std::cout << "OK";
			  else
			      std::cout << "What?";
			  ```
		- ## Operators
			- ```c++
			  Relational Operators
			  a == b	a is equal to b
			  a != b	a is NOT equal to b
			  a < b	a is less than b
			  a > b	a is greater b
			  a <= b	a is less than or equal to b
			  a >= b	a is greater or equal to b
			  
			  Assignment Operators
			  a += b	Aka a = a + b
			  a -= b	Aka a = a - b
			  a *= b	Aka a = a * b
			  a /= b	Aka a = a / b
			  a %= b	Aka a = a % b
			  
			  Logical Operators
			  exp1 && exp2	Both are true (AND)
			  exp1 || exp2	Either is true (OR)
			  !exp	exp is false (NOT)
			  
			  Bitwise Operators
			  a & b	Binary AND
			  a | b	Binary OR
			  a ^ b	Binary XOR
			  ~ a	Binary One's Complement
			  a << b	Binary Shift Left
			  a >> b	Binary Shift Right
			  ```
		- ## Ternary Operator
			- ```c++
			             ┌── True ──┐
			  Result = Condition ? Exp1 : Exp2;
			             └───── False ─────┘
			  -------------------------------------------
			  int x = 3, y = 5, max;
			  max = (x > y) ? x : y;
			  
			  // Outputs: 5
			  std::cout << max << std::endl;
			  -------------------------------------------
			  int x = 3, y = 5, max;
			  if (x > y) {
			      max = x;
			  } else {
			      max = y;
			  }
			  // Outputs: 5
			  std::cout << max << std::endl;
			  ```
		- ## Switch Statement
			- ```c++
			  int num = 2;
			  switch (num) {
			      case 0:
			          std::cout << "Zero";
			          break;
			      case 1:
			          std::cout << "One";
			          break;
			      case 2:
			          std::cout << "Two";
			          break;
			      case 3:
			          std::cout << "Three";
			          break;
			      default:
			          std::cout << "What?";
			          break;
			  }
			  ```
	-
	- ## C++ Loops
	  collapsed:: true
		- ## While
			- ```c++
			  int i = 0;
			  while (i < 6) {
			      std::cout << i++;
			  }
			  
			  // Outputs: 012345
			  ```
		- ## Do-while
			- ```c++
			  int i = 1;
			  do {
			      std::cout << i++;
			  } while (i <= 5);
			  
			  // Outputs: 12345
			  ```
		- ## Continue statements
			- ```c++
			  for (int i = 0; i < 10; i++) {
			      if (i % 2 == 0) {
			          continue;
			      }
			      std::cout << i;
			  } // Outputs: 13579
			  ```
		- ## Infinite loop
			- ```c++
			  while (true) { // true or 1
			      std::cout << "infinite loop";
			  }
			  -----------------------------------------
			  for (;;) {
			      std::cout << "infinite loop";
			  }
			  -----------------------------------------
			  for(int i = 1; i > 0; i++) {
			      std::cout << "infinite loop";
			  }
			  ```
		- ## for_each (Since C++11)
			- ```c++
			  #include <iostream>
			  
			  int main()
			  {
			      auto print = [](int num) { std::cout << num << std::endl; };
			  
			      std::array<int, 4> arr = {1, 2, 3, 4};
			      std::for_each(arr.begin(), arr.end(), print);
			      return 0;
			  }
			  ```
		- ## Range-based (Since C++11)
			- ```c++
			  for (int n : {1, 2, 3, 4, 5}) {
			      std::cout << n << " ";
			  }
			  // Outputs: 1 2 3 4 5
			  ```
		- ## Break statements
			- ```c++
			  int password, times = 0;
			  while (password != 1234) {
			      if (times++ >= 3) {
			          std::cout << "Locked!\n";
			          break;
			      }
			      std::cout << "Password: ";
			      std::cin >> password; // input
			  }
			  ```
		- ## Several variations
			- ```c++
			  for (int i = 0, j = 2; i < 3; i++, j--){
			      std::cout << "i=" << i << ",";
			      std::cout << "j=" << j << ";";
			  }
			  // Outputs: i=0,j=2;i=1,j=1;i=2,j=0;
			  ```
			-
	-
	- ## C++ Classes & Objects
	  collapsed:: true
		- ## Defining a Class
			- ```c++
			  class MyClass {
			    public:             // Access specifier
			      int myNum;        // Attribute (int variable)
			      string myString;  // Attribute (string variable)
			  };
			  ```
		- ## Creating an Object
			- ```c++
			  MyClass myObj;  // Create an object of MyClass
			  
			  myObj.myNum = 15;          // Set the value of myNum to 15
			  myObj.myString = "Hello";  // Set the value of myString to "Hello"
			  
			  cout << myObj.myNum << endl;         // Output 15
			  cout << myObj.myString << endl;      // Output "Hello"
			  ```
		- ## Constructors
			- ```c++
			  class MyClass {
			    public:
			      int myNum;
			      string myString;
			      MyClass() {  // Constructor
			        myNum = 0;
			        myString = "";
			      }
			  };
			  
			  MyClass myObj;  // Create an object of MyClass
			  
			  cout << myObj.myNum << endl;         // Output 0
			  cout << myObj.myString << endl;      // Output ""
			  ```
		- ## Destructors
			- ```c++
			  class MyClass {
			    public:
			      int myNum;
			      string myString;
			      MyClass() {  // Constructor
			        myNum = 0;
			        myString = "";
			      }
			      ~MyClass() {  // Destructor
			        cout << "Object destroyed." << endl;
			      }
			  };
			  
			  MyClass myObj;  // Create an object of MyClass
			  
			  // Code here...
			  
			  // Object is destroyed automatically when the program exits the scope`
			  ```
		- ## Class Methods
			- ```c++
			  class MyClass {
			    public:
			      int myNum;
			      string myString;
			      void myMethod() {  // Method/function defined inside the class
			        cout << "Hello World!" << endl;
			      }
			  };
			  
			  MyClass myObj;  // Create an object of MyClass
			  myObj.myMethod();  // Call the method
			  ```
		- ## Access Modifiers
			- ```c++
			  class MyClass {
			    public:     // Public access specifier
			      int x;    // Public attribute
			    private:    // Private access specifier
			      int y;    // Private attribute
			    protected:  // Protected access specifier
			      int z;    // Protected attribute
			  };
			  
			  MyClass myObj;
			  myObj.x = 25;  // Allowed (public)
			  myObj.y = 50;  // Not allowed (private)
			  myObj.z = 75;  // Not allowed (protected)
			  ```
		- ## Getters and Setters
			- ```c++
			  class MyClass {
			    private:
			      int myNum;
			    public:
			      void setMyNum(int num) {  // Setter
			        myNum = num;
			      }
			      int getMyNum() {  // Getter
			        return myNum;
			      }
			  };
			  
			  MyClass myObj;
			  myObj.setMyNum(15);  // Set the value of myNum to 15
			  cout << myObj.getMyNum() << endl;  // Output 15
			  ```
		- ## Inheritance
			- ```c++
			  class Vehicle {
			    public:
			      string brand = "Ford";
			      void honk() {
			        cout << "Tuut, tuut!" << endl;
			      }
			  };
			  
			  class Car : public Vehicle {
			    public:
			      string model = "Mustang";
			  };
			  
			  Car myCar;
			  myCar.honk();  // Output "Tuut, tuut!"
			  cout << myCar.brand + " " + myCar.model << endl;  // Output "Ford Mustang"
			  ```
	-
	- ## C++ Preprocessor
	  collapsed:: true
		- ## List of Preprocessor
			- ```c++
			  if
			  elif
			  else
			  endif
			  ifdef
			  ifndef
			  define
			  undef
			  include
			  line
			  error
			  pragma
			  defined
			  __has_include
			  __has_cpp_attribute
			  export
			  import
			  module
			  ```
		- ## Includes
			- ```c++
			  #include "iostream"
			  #include <iostream>
			  ```
		- ## Defines
			- ```c++
			  #define FOO
			  #define FOO "hello"
			  
			  #undef FOO
			  ```
		- ## If
			- ```c++
			  #ifdef DEBUG
			    console.log('hi');
			  #elif defined VERBOSE
			    ...
			  #else
			    ...
			  #endif
			  ```
		- ## Error
			- ```c++
			  #if VERSION == 2.0
			    #error Unsupported
			    #warning Not really supported
			  #endif
			  ```
		- ## Token concat
			- ```c++
			  #define DST(name) name##_s name##_t
			  DST(object);   #=> object_s object_t;
			  ```
		- ## Stringification
			- ```c++
			  #define STR(name) #name
			  char * a = STR(object);   #=> char * a = "object";
			  ```
		- ## file and line
			- ```c++
			  #define LOG(msg) console.log(__FILE__, __LINE__, msg)
			  #=> console.log("file.txt", 3, "hey")`
			  ```
	-
	- ## Miscellaneous
		- ## Escape Sequences
			- ```c++
			  \b	Backspace
			  \f	Form feed
			  \n	Newline
			  \r	Return
			  \t	Horizontal tab
			  \v	Vertical tab
			  \\	Backslash
			  \'	Single quotation mark
			  \"	Double quotation mark
			  \?	Question mark
			  \0	Null Character
			  ```
		- ## Keywords
			- All ref Keywords are [Here](https://en.cppreference.com/w/cpp/keyword)
-
- # Library & Frameworks
  id:: 673ac308-24d0-40b6-b0d7-a4b6cac5b79a
	- [[STL (Standard Template Library)]] - Provides common data structures and algorithms like vectors, maps, sets, and sorting functions.
	-
	- [[Boost]] - A collection of peer-reviewed libraries that extend the functionality of C++, including threading, file system, and smart pointers.
	-
	- [[Qt]] - Cross-platform framework for building GUI applications, with additional support for networking, database management, and mobile apps.
	-
	- [[OpenCV]] - Computer vision library for real-time image processing, object detection, and video analysis.
	-
	- [[SFML (Simple and Fast Multimedia Library)]] - Library for handling graphics, sound, and input for game development and multimedia applications.
	-
	- [[Eigen]] - Template library for linear algebra, matrix, and vector operations, used in scientific computing and machine learning.
	-
	- [[C++ REST SDK (cpprest)]] - Cross-platform library for building RESTful web services and clients, including HTTP communication and JSON parsing.
	-
	- [[POCO (C++ Portable Components)]] - Cross-platform libraries for network and web-based applications, including modules for HTTP, database connectivity, and JSON/XML parsing.
	-
	- [[Google Test (gtest)]] - Framework for unit testing in C++, with support for mock objects and assertions.
	-
	- [[ACE (Adaptive Communicative Environment)]] - Framework for building high-performance, networked, and real-time systems.
	-
	- [[TBB (Threading Building Blocks)]] - Parallel programming library from Intel, designed to leverage multi-core processors for high-performance computing.
	-
	- [[SDL (Simple DirectMedia Layer)]] - Cross-platform multimedia library for game development, handling audio, graphics, and input devices.
-
-
- # More Learn
  
  Explore the following links for valuable resources, communities, and tools to enhance your skills : -
	-
	- [C++ Roadmap](https://github.com/salmer/CppDeveloperRoadmap)
	- [Cheat Sheets for c++](https://hackingcpp.com/cpp/cheat_sheets.html)
	- [Docs Book](https://cplusplus.com/doc/tutorial/)
	- [C++ references](https://en.cppreference.com/w/)
   	- [C++ Advance Ref.](https://en.cppreference.com/w/cpp/utility/functional/ref.html)
