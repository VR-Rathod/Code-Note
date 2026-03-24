# History
	- **How**:
		- Developed by **Dennis Ritchie** in the early 1970s at **Bell Labs**.
		- Designed as an evolution of the B programming language, with the goal of providing more control over hardware and efficient system programming.
		- Became the foundation for many modern programming languages and operating systems.
		- Evolved through versions, with the ANSI C standard (C89) and the C99 standard being notable milestones.
		-
	- **Who**:
		- **Dennis Ritchie**, a computer scientist, is the creator of C.
		- **Bell Labs**, the research lab at AT&T, where C was first developed.
		-
	- **Why**:
		- To create a portable, efficient language that could be used for system programming and writing operating systems.
		- To provide low-level access to memory and hardware while maintaining readability and simplicity.
		- To enable the development of the **UNIX operating system**, which was one of its first major uses.
-
- # introduction
	- ## Advantages:
		- **Performance and Control**:
		  C offers **direct memory manipulation** through **pointers** and **manual memory management**, making it highly efficient for system programming, embedded systems, and performance-critical applications. This level of control allows developers to fine-tune performance but requires careful handling.
		-
		- **Portability**:
		  C is **platform-independent**, with programs easily portable across different systems. It has been the foundation of many operating systems and compilers, ensuring that C code can run on almost any machine with minimal changes.
		-
		- **Simplicity and Efficiency**:
		  The language’s **minimalistic syntax** makes C easy to learn and use, focusing on low-level functionality and providing high efficiency in system-level applications. It’s often the language of choice for tasks like OS development and embedded systems.
		-
		- **Wide Use and Support**:
		  As one of the oldest and most widely used languages, C enjoys strong **community support**, vast resources, and a large library ecosystem, making it a dependable choice for many types of programming.
		-
		- **Low-Level System Programming**:
		  C is perfect for **system-level programming** (e.g., operating systems, device drivers) due to its ability to interact directly with hardware and manage system resources efficiently.
	-
	- ## Disadvantages:
		- **Manual Memory Management**:
		  Unlike modern languages with garbage collection, C requires developers to manually manage memory using `malloc` and `free`. This can lead to **memory leaks** or **segmentation faults** if not handled correctly.
		-
		- **No Object-Oriented Features**:
		  C is a **procedural language**, lacking native support for **object-oriented programming** concepts like classes, inheritance, and polymorphism, which makes it less suited for large, complex applications that benefit from these features.
		-
		- **Error Handling**:
		  C lacks built-in **exception handling** (e.g., `try/catch`), requiring manual checks (return codes, error flags) that can make error management cumbersome and more error-prone.
		-
		- **Complex Pointer Arithmetic**:
		  The heavy use of **pointers** in C, while offering power and flexibility, also introduces complexity. Improper pointer manipulation can result in hard-to-find bugs, such as **buffer overflows** or memory corruption.
		-
		- **Low-Level Nature**:
		  C’s focus on low-level operations means it’s less suitable for high-level tasks such as GUI development or applications requiring extensive built-in libraries and frameworks, which are easier to implement in higher-level languages like Python or Java.
		-
		- **Lack of Higher-Level Abstractions**:
		  While C is powerful, it lacks the advanced data structures and higher-level abstractions found in languages like C++ or Java, requiring more effort to implement features like dynamic arrays, complex data structures, or multithreading.
-
- # Notes
	- `main()` is the entry point of a C program.
	- `printf("Hello World\n");` is used for printing output.
	-
	- ## variables Types
	  collapsed:: true
		- ```c
		  char	character type
		  short	short integer
		  int		integer type
		  long	long integer
		  float	single-precision floating-point type
		  double	double-precision floating-point type
		  void	no type
		  ```
		-
		- Data format example : ~
			- ```c++
			  int number = 5;       // Integer
			      float f = 0.95f;      // Floating point number
			      double PI = 3.14159;  // Double precision floating point number
			      char yes = 'Y';       // Character
			      char s[] = "ME";      // String (array of characters)
			      _Bool isRight = 1;    // Boolean (C99 and later, 1 for true, 0 for false)
			      
			      // Constants
			      const float RATE = 0.8f;
			  
			      // Output the variables to check their values
			      printf("Integer: %d\n", number);
			      printf("Float: %.2f\n", f);
			      printf("Double: %.5f\n", PI);
			      printf("Char: %c\n", yes);
			      printf("String: %s\n", s);
			      printf("Boolean: %d\n", isRight);
			      printf("Constant RATE: %.2f\n", RATE);
			  ```
			-
		-
	-
	- ## Primitive Data Types
	  collapsed:: true
		- Data Types in Details : ~
			- ```c
			  Data Types			Size 			Range / Description
			  char				1 byte			−128 ~ 127	single character/alphanumeric/ASCII
			  signed char			1 byte			−128 ~ 127	-
			  unsigned char		1 byte		   	   0 ~ 255	-
			  int					2 to 4 bytes −32,768 ~ 32,767	store integers
			  signed int			2 bytes	−32,	 768 ~ 32,767	
			  unsigned int		2 bytes			   0 ~ 65,535	
			  short int			2 bytes		 −32,768 ~ 32,767	
			  signed short int 	2 bytes		 −32,768 ~ 32,767	
			  unsigned short int	2 bytes			   0 ~ 65,535	
			  long int			4 bytes		 -2,147,483,648 ~ 2,147,483,647	
			  signed long int		4 bytes	-2,147,483,648 ~ 2,147,483,647	
			  unsigned long int	4 bytes			   0 ~ 4,294,967,295	
			  float				4 bytes		 3.4E-38 ~ 3.4E+38	
			  double				8 bytes		1.7E-308 ~ 1.7E+308	
			  long double			10 bytes   3.4E-4932 ~ 1.1E+4932
			  ```
		-
		- Basic format specifiers : ~
			- ```c
			  %d or %i				int integer
			  %f						float single-precision decimal type
			  %lf						double high precision floating point data or number
			  %c						char character
			  %s						for strings strings
			  
			  -----------------------------------------------------------------------------
			  
			  Octal				%ho			%o			%lo
			  Decimal				%hd			%d			%ld
			  Hexadecimal			%hx /%hX	%x /%X		%lx /%lX
			  ```
			-
	-
	- ## User input string
	  collapsed:: true
		- ```c
		  // create a string
		  char firstName[30];
		  // Ask the user to enter some text
		  printf("Enter your name: \n");
		  // get and save the text
		  scanf("%s", &firstName);
		  // output text
		  printf("Hello %s.", firstName);
		  ```
	-
	- ## Comments
	  collapsed:: true
		- ```c
		  // this is a comment
		  printf("Hello World!"); // Can comment anywhere in file
		  
		  /*Multi-line comment, print Hello World!
		  to the screen, it's awesome */
		  ```
	-
	- ## Condition
	  collapsed:: true
		- ```c
		  int time = 20;
		  if (time < 18) {
		    printf("Goodbye!");
		  } else {
		    printf("Good evening!");
		  }
		  // Output -> "Good evening!"
		  int time = 22;
		  if (time < 10) {
		    printf("Good morning!");
		  } else if (time < 20) {
		    printf("Goodbye!");
		  } else {
		    printf("Good evening!");
		  }
		  // Output -> "Good evening!"
		  ```
		-
	-
	- ## C Important Tags
	  collapsed:: true
		- Control the number of spaces
			- ```c
			  int a1 = 20, a2 = 345, a3 = 700;
			  int b1 = 56720, b2 = 9999, b3 = 20098;
			  int c1 = 233, c2 = 205, c3 = 1;
			  int d1 = 34, d2 = 0, d3 = 23;
			  
			  printf("%-9d %-9d %-9d\n", a1, a2, a3);
			  printf("%-9d %-9d %-9d\n", b1, b2, b3);
			  printf("%-9d %-9d %-9d\n", c1, c2, c3);
			  printf("%-9d %-9d %-9d\n", d1, d2, d3);
			  
			  --------------------------------------------------
			  20        345       700      
			  56720     9999      20098    
			  233       205       1        
			  34        0         23  
			  ```
		- Strings
			- ```c
			  char greetings[] = "Hello World!";
			  printf("%s", greetings);
			  access string
			  
			  
			  char greetings[] = "Hello World!";
			  printf("%c", greetings[0]);
			  modify string
			  
			  
			  char greetings[] = "Hello World!";
			  greetings[0] = 'J';
			  
			  printf("%s", greetings);
			  // prints "Jello World!"
			  Another way to create a string
			  
			  
			  char greetings[] = {'H','e','l','l','\0'};
			  
			  printf("%s", greetings);
			  // print "Hell!"
			  Creating String using character pointer (String Literals)
			  
			  
			  char *greetings = "Hello";
			  printf("%s", greetings);
			  // print "Hello!"
			  ```
		- Switch
			- ```c
			  int day = 4;
			  
			  switch (day) {
			    case 3: printf("Wednesday"); break;
			    case 4: printf("Thursday"); break;
			    default:
			      printf("Weekend!");
			  }
			  // output -> "Thursday" (day 4)
			  ```
			-
	-
	- ## pointer variable
	  collapsed:: true
		- ```c
		  int myAge = 43; // an int variable
		  int*ptr = &myAge; // pointer variable named ptr, used to store the address of myAge
		  
		  printf("%d\n", myAge); // print the value of myAge (43)
		  
		  printf("%p\n", \&myAge); // output the memory address of myAge (0x7ffe5367e044)
		  printf("%p\n", ptr); // use the pointer (0x7ffe5367e044) to output the memory address of myAge
		  
		  
		  This will Show The Diffrance
		  
		  int myAge = 43; // variable declaration
		  int*ptr = &myAge; // pointer declaration
		  
		  // Reference: output myAge with a pointer
		  // memory address (0x7ffe5367e044)
		  printf("%p\n", ptr);
		  // dereference: output the value of myAge with a pointer (43)
		  printf("%d\n", *ptr);
		  
		  ```
	-
	- ## Operators
	  collapsed:: true
		- ## Arithmetic Operators
		  collapsed:: true
			- ```c
			  int myNum = 100 + 50;
			  int sum1 = 100 + 50; // 150 (100 + 50)
			  int sum2 = sum1 + 250; // 400 (150 + 250)
			  int sum3 = sum2 + sum2; // 800 (400 + 400)
			  ```
		- ## Assignment operator
		  collapsed:: true
			- ```c
			  x = 5			x = 5
			  x += 3			x = x + 3
			  x -= 3			x = x - 3
			  x *= 3			x = x * 3
			  x /= 3			x = x / 3
			  x %= 3			x = x % 3
			  x &= 3			x = x & 3
			  x |= 3			x = x | 3
			  x ^= 3			x = x ^ 3
			  x >>= 3			x = x >> 3
			  x <<= 3			x = x << 3
			  ```
		- ## Comparison Operators
		  collapsed:: true
			- ```c
			  // Demo
			  
			  int x = 5;
			  int y = 3;
			  
			  printf("%d", x > y);
			  // returns 1 (true) because 5 is greater than 3
			  
			  ---------------------------------------------------------------------------------
			  ==	equals	x == y
			  !=	not equal to	x != y
			  >	greater than	x > y
			  <	less than	x < y
			  >=	greater than or equal to	x >= y
			  <=	less than or equal to	x <= y
			  ```
		- ## Logical Operators
		  collapsed:: true
			- ```c
			  &&	and logical	returns true if both statements are true		x < 5 && x < 10
			  ||	or logical	returns true if one of the statements is true	x < 5 || x < 4
			  !	not logical	Invert result, return false if true				!(x < 5 && x < 10)
			  ```
		- ## Bitwise operators
		  collapsed:: true
			- ```c
			  &				Bitwise AND operation, "AND" operation by binary digits				(A & B) will get 12 which is 0000 1100
			  |				Bitwise OR operator, "or" operation by binary digit					(A | B) will get 61 which is 0011 1101
			  ^				XOR operator, perform "XOR" operation by binary digits				(A ^ B) will get 49 which is 0011 0001
			  ~				Inversion operator, perform "inversion" operation by binary bit		(~A) will get -61 which is 1100 0011
			  <<				binary left shift operator											A << 2 will get 240 which is 1111 0000
			  >>				binary right shift operator											A >> 2 will get 15 which is 0000 1111
			  ```
			-
	-
	- ## C Preprocessor
	  collapsed:: true
		- ## Preprocessor Directives
		  collapsed:: true
			- ```c
			  #define		define a macro
			  #include	include a source code file
			  #undef		undefined macro
			  #ifdef		Returns true if the macro is defined
			  #ifndef		Returns true if the macro is not defined
			  #if			Compile the following code if the given condition is true
			  #else		Alternative to #if
			  #elif		If the #if condition is false, the current condition is true
			  #endif		End a #if...#else conditional compilation block
			  #error		Print an error message when standard error is encountered
			  #pragma		Issue special commands to the compiler using the standardized method
			  
			  ---------------------------------------------------------------------------------
			    
			  // replace all MAX_ARRAY_LENGTH with 20
			  #define MAX_ARRAY_LENGTH 20
			  // Get stdio.h from the system library
			  #include <stdio.h>
			  // Get myheader.h in the local directory
			  #include "myheader.h"
			  #undef FILE_SIZE
			  #define FILE_SIZE 42 // undefine and define to 42
			  ```
		-
		- ## Predefined macros
		  collapsed:: true
			- ```c
			  __DATE__	The current date, a character constant in the format "MMM DD YYYY"
			  __TIME__	The current time, a character constant in the format "HH:MM:SS"
			  __FILE__	This will contain the current filename, a string constant
			  __LINE__	This will contain the current line number, a decimal constant
			  __STDC__	Defined as 1 when the compiler compiles against the ANSI standard
			  
			  -----------------------------------------------------------------------------
			  
			  // Example
			  #include <stdio.h>
			  
			  int main() {
			    printf("File :%s\n", __FILE__);
			    printf("Date :%s\n", __DATE__);
			    printf("Time :%s\n", __TIME__);
			    printf("Line :%d\n", __LINE__);
			    printf("ANSI :%d\n", __STDC__);
			  }
			  ```
		-
		- ## Macro continuation operator ()
		  collapsed:: true
			- ```c
			  #define message_for(a, b) \
			      printf(#a " and " #b ": We love you(@' 3 '@)!\n")
			  ```
			-
		-
	-
	- ## C Function
	  collapsed:: true
		- ## Function declaration and definition
		  collapsed:: true
			- ```c
			  int main(void) {
			    printf("Hello World!");
			  
			    return 0;
			  }
			  The function consists of two parts
			  
			  
			  void myFunction() { // declaration declaration
			    // function body (code to be executed) (definition)
			  }
			  Declaration declares the function name, return type and parameters (if any)
			  Definition function body (code to execute)
			  
			  // function declaration
			  void myFunction();
			  // main method
			  int main() {
			    myFunction(); // --> call the function
			  
			    return 0;
			  }
			  
			  void myFunction() {// Function definition
			    printf("Good evening!");
			  }
			  ```
		-
		- ## Call function
		  collapsed:: true
			- ```c
			  // create function
			  void myFunction() {
			    printf("Good evening!");
			  }
			  
			  int main() {
			    myFunction(); // call the function
			    myFunction(); // can be called multiple times
			  
			    return 0;
			  }
			  // Output -> "Good evening!"
			  // Output -> "Good evening!"
			  ```
			- ## Function parameters
			  collapsed:: true
				- ```c
				  void myFunction(char name[]) {
				    printf("Hello %s\n", name);
				  }
				  
				  int main() {
				    myFunction("Liam");
				    myFunction("Jenny");
				  
				    return 0;
				  }
				  // Hello Liam
				  // Hello Jenny
				  ```
			- ## Multiple parameters
			  collapsed:: true
				- ```c
				  void myFunction(char name[], int age) {
				    printf("Hi %s, you are %d years old.\n",name,age);
				  }
				  int main() {
				    myFunction("Liam", 3);
				    myFunction("Jenny", 14);
				  
				    return 0;
				  }
				  // Hi Liam you are 3 years old.
				  // Hi Jenny you are 14 years old.
				  ```
			- ## Return value
			  collapsed:: true
				- ```c
				  int myFunction(int x) {
				    return 5 + x;
				  }
				  
				  int main() {
				    printf("Result: %d", myFunction(3));
				    return 0;
				  }
				  // output 8 (5 + 3)
				  two parameters
				  
				  
				  int myFunction(int x, int y) {
				    return x + y;
				  }
				  
				  int main() {
				    printf("Result: %d", myFunction(5, 3));
				    // store the result in a variable
				    int result = myFunction(5, 3);
				    printf("Result = %d", result);
				  
				    return 0;
				  }
				  // result: 8 (5 + 3)
				  // result = 8 (5 + 3)
				  ```
			- ## Recursive example
			  collapsed:: true
				- ```c
				  int sum(int k);
				  
				  int main() {
				    int result = sum(10);
				    printf("%d", result);
				  
				    return 0;
				  }
				  
				  int sum(int k) {
				    if (k > 0) {
				      return k + sum(k -1);
				    } else {
				      return 0;
				    }
				  }
				  ```
			- ## Mathematical functions
			  collapsed:: true
				- ```c
				  #include <math.h>
				  
				  void main(void) {
				    printf("%f", sqrt(16)); // square root
				    printf("%f", ceil(1.4)); // round up (round)
				    printf("%f", floor(1.4)); // round up (round)
				    printf("%f", pow(4, 3)); // x(4) to the power of y(3)
				  }
				  abs(x) absolute value
				  acos(x) arc cosine value
				  asin(x) arc sine
				  atan(x) arc tangent
				  cbrt(x) cube root
				  cos(x) cosine
				  the value of exp(x) Ex
				  sin(x) the sine of x
				  tangent of tan(x) angle
				  ```
		-
		- ## Function parameters
		  collapsed:: true
			- ```c
			  void myFunction(char name[]) {
			    printf("Hello %s\n", name);
			  }
			  
			  int main() {
			    myFunction("Liam");
			    myFunction("Jenny");
			  
			    return 0;
			  }
			  // Hello Liam
			  // Hello Jenny
			  ```
		-
		- ## Multiple parameters
		  collapsed:: true
			- ```c
			  void myFunction(char name[], int age) {
			    printf("Hi %s, you are %d years old.\n",name,age);
			  }
			  int main() {
			    myFunction("Liam", 3);
			    myFunction("Jenny", 14);
			  
			    return 0;
			  }
			  // Hi Liam you are 3 years old.
			  // Hi Jenny you are 14 years old.
			  ```
		-
		- ## Return value
		  collapsed:: true
			- ```c
			  int myFunction(int x) {
			    return 5 + x;
			  }
			  
			  int main() {
			    printf("Result: %d", myFunction(3));
			    return 0;
			  }
			  // output 8 (5 + 3)
			  ```
		-
		- ## Recursive example
		  collapsed:: true
			- ```c
			  int sum(int k);
			  
			  int main() {
			    int result = sum(10);
			    printf("%d", result);
			  
			    return 0;
			  }
			  
			  int sum(int k) {
			    if (k > 0) {
			      return k + sum(k -1);
			    } else {
			      return 0;
			    }
			  }
			  ```
		-
		- ## Mathematical functions
		  collapsed:: true
			- ```C
			  #include <math.h>
			  
			  void main(void) {
			    printf("%f", sqrt(16)); // square root
			    printf("%f", ceil(1.4)); // round up (round)
			    printf("%f", floor(1.4)); // round up (round)
			    printf("%f", pow(4, 3)); // x(4) to the power of y(3)
			  }
			  -------------------------------------------------------------------------
			    abs(x) absolute value
			  acos(x) arc cosine value
			  asin(x) arc sine
			  atan(x) arc tangent
			  cbrt(x) cube root
			  cos(x) cosine
			  the value of exp(x) Ex
			  sin(x) the sine of x
			  tangent of tan(x) angle
			  ```
		-
		- ## Return value
		  collapsed:: true
			- ```c
			  int myFunction(int x) {
			    return 5 + x;
			  }
			  
			  int main() {
			    printf("Result: %d", myFunction(3));
			    return 0;
			  }
			  // output 8 (5 + 3)
			  ---------------------------------------------------------
			  //  two parameters
			  
			  int myFunction(int x, int y) {
			    return x + y;
			  }
			  
			  int main() {
			    printf("Result: %d", myFunction(5, 3));
			    // store the result in a variable
			    int result = myFunction(5, 3);
			    printf("Result = %d", result);
			  
			    return 0;
			  }
			  // result: 8 (5 + 3)
			  // result = 8 (5 + 3)
			  ```
	-
	- ## C Structures
	  collapsed:: true
		- ## Create structure
		  collapsed:: true
			- ```c
			  struct MyStructure { // structure declaration
			    int myNum; // member (int variable)
			    char myLetter; // member (char variable)
			  }; // end the structure with a semicolon
			  Create a struct variable called s1
			  
			  struct myStructure {
			    int myNum;
			    char myLetter;
			  };
			  
			  int main() {
			    struct myStructure s1;
			  
			    return 0;
			  }
			  ```
		-
		- ## Strings in the structure
		  collapsed:: true
			- ```c
			  struct myStructure {
			    int myNum;
			    char myLetter;
			    char myString[30]; // String
			  };
			  
			  int main() {
			    struct myStructure s1;
			    strcpy(s1. myString, "Some text");
			    // print value
			    printf("my string: %s", s1.myString);
			  
			    return 0;
			  }
			  ```
		-
		- ## Accessing structure members
		  collapsed:: true
			- ```c
			  // create a structure called myStructure
			  struct myStructure {
			    int myNum;
			    char myLetter;
			  };
			  
			  int main() {
			    // Create a structure variable called myStructure called s1
			    struct myStructure s1;
			    // Assign values ​​to the members of s1
			    s1.myNum = 13;
			    s1.myLetter = 'B';
			  
			    // Create a structure variable of myStructure called s2
			    // and assign it a value
			    struct myStructure s2 = {13, 'B'};
			    // print value
			    printf("My number: %d\n", s1.myNum);
			    printf("My letter: %c\n", s1.myLetter);
			  
			    return 0;
			  }`
			  
			  --------------------------------------------------------------------------
			  // Create different structure variables
			  
			  struct myStructure s1;
			  struct myStructure s2;
			  // Assign values ​​to different structure variables
			  s1.myNum = 13;
			  s1.myLetter = 'B';
			  
			  s2.myNum = 20;
			  s2.myLetter = 'C';
			  ```
		-
		- ## Copy structure
		  collapsed:: true
			- ```c
			  struct myStructure s1 = {
			    13, 'B', "Some text"
			  };
			  
			  struct myStructure s2;
			  s2 = s1;
			  ```
		-
		- ## Modify value
		  collapsed:: true
			- ```c
			  // Create a struct variable and assign it a value
			  struct myStructure s1 = {
			    13, 'B'
			  };
			  // modify the value
			  s1.myNum = 30;
			  s1.myLetter = 'C';
			  // print value
			  printf("%d %c %s",
			      s1.myNum,
			      s1.myLetter);
			  ```
		-
	-
	- ## file processing
	  collapsed:: true
		- ## File processing function
			- ```c
			  fopen()			open a new or existing file
			  fprintf()		write data to file
			  fscanf()		read data from a file
			  fputc()			write a character to file
			  fgetc()			read a character from a file
			  fclose()		close the file
			  fseek()			set the file pointer to the given position
			  fputw()			Write an integer to a file
			  fgetw()			read an integer from a file
			  ftell()			returns the current position
			  rewind()		set the file pointer to the beginning of the file
			  ```
		- ## Open mode parameter
		  collapsed:: true
			- ```c
			  r		Open a text file in read mode, allowing the file to be read
			  w		Open a text file in write mode, allowing writing to the file
			  a		Open a text file in append mode
			  If 		the file does not exist, a new one will be created
			  r+		Open a text file in read-write mode, allowing reading and writing of the file
			  w+		Open a text file in read-write mode, allowing reading and writing of the file
			  a+		Open a text file in read-write mode, allowing reading and writing of the file
			  rb		Open a binary file in read mode
			  wb		Open binary file in write mode
			  ab		Open a binary file in append mode
			  rb+		open binary file in read-write mode
			  wb+		Open binary file in read-write mode
			  ab+		open binary file in read-write mode
			  ```
	-
-
- # Library & Frameworks
	- [[GLib]] - Core library for C with data structures, utilities, and threading.
	- [[GTK]] - GUI toolkit for creating graphical user interfaces.
	- [[libcurl]] - Library for transferring data with URLs (HTTP, FTP, etc.).
	- [[OpenSSL]] - Cryptography and SSL/TLS protocols.
	- [[SQLite]] - Lightweight, self-contained SQL database engine.
	- [[libxml2]] - XML parsing and manipulation.
	- [[ncurses]] - Library for text-based interfaces and terminal handling.
	- [[SDL]] - Multimedia library for graphics, sound, and input handling in games.
	- [[pthread]] - POSIX threads library for multithreading support.
	- [[libevent]] - Event notification library for asynchronous I/O.
	- [[jansson]] - JSON library for encoding and decoding.
	- [[zlib]] - Data compression library.
-
- # More Learn
	- Explore the following links for valuable resources, communities, and tools to enhance your skills : -
		-
		- [C Programing Algorithms](https://github.com/TheAlgorithms/C)