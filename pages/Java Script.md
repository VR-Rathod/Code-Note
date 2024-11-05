# History
	- **How**:
		- Developed by Brendan Eich in 1995 at Netscape.
		- Initially created in just 10 days as a client-side scripting language for web browsers.
	-
	- **Who**:
		- Brendan Eich, co-founder of Mozilla and creator of JavaScript.
		- Netscape Communications Corporation.
	-
	- **Why**:
		- To enable dynamic and interactive web content.
		- To complement HTML and CSS for enhanced web development.
-
- # Introduction
  collapsed:: true
	- ## Advanced Topics :
		- Asynchronous Programming (Promises, Async/Await).
		- JavaScript Design Patterns (Module, Singleton, Observer).
		- Prototypal Inheritance and ES6 Classes.
		- TypeScript and Typed JavaScript.
	-
	- ## Disadvantages :
		- Browser inconsistencies in older versions.
		- Lack of strong typing can lead to runtime errors.
		- Complexities in large-scale application development.
-
- # Notes
	- You can Direcly create page by write {filename}.js
	- console.log("msg") - Print that msg
	- console.warn('hello %s', 'QuickRef.ME') - The `%s` is a placeholder for a string, allowing you to format the message with additional variables.
	- console.error(new Error('Oops!')) - console.error(new Error('Oops!'));
	-
	- ## variables Types
	  collapsed:: true
		- **Primitive Types**:
			-
			- **String**: Represents text (e.g., `"Hello, world!"`).
			-
			- **Number**: Represents numeric values (e.g., `42`, `3.14`).
			-
			- **BigInt**: Represents integers of arbitrary precision (e.g., `1234567890123456789012345678901234567890n`).
			-
			- **Boolean**: Represents a logical entity that can be either `true` or `false`.
			-
			- **Undefined**: A variable that has been declared but has not been assigned a value (e.g., `let a;`).
			-
			- **Null**: Represents the intentional absence of any value (e.g., `let b = null;`).
			-
			- **Symbol**: A unique and immutable primitive value often used as object property keys.
		-
		- **Object Types**:
			-
			- **Object**: A collection of key-value pairs (e.g., `{ name: "Alice", age: 25 }`).
			- **Array**: A special type of object for storing ordered lists (e.g., `[1, 2, 3]`).
			- **Function**: A callable object that can be defined with the `function` keyword (e.g., `function add(a, b) { return a + b; }`).
			- **Date**: A built-in object for working with dates and times (e.g., `new Date()`).
			- **RegExp**: Regular expressions for pattern matching in strings (e.g., `/abc/`).
		-
	-
	- ## Scope Types
	  collapsed:: true
		-
		- **Global Scope**: Variables declared outside any function or block. Accessible anywhere in the code.
			-
			- ```js
			  // Variable declared globally
			  const color = 'blue';
			  
			  function printColor() {
			    console.log(color);
			  }
			  
			  printColor(); // => blue
			  ```
		-
		- **Function Scope**: Variables declared inside a function using `var`. Accessible only within that function.
			-
			- ```js
			  function myFunction() {
			    
			    var pizzaName = "Margarita";
			    // Code here can use pizzaName
			    
			  }
			  
			  // Code here can't use pizzaName
			  ```
		-
		- **Block Scope**: Variables declared with `let` or `const` within a block (e.g., inside `{}` braces). Accessible only within that block.
			-
			- ```js
			  const isLoggedIn = true;
			  
			  if (isLoggedIn == true) {
			    const statusMessage = 'Logged in.';
			  }
			  
			  // Uncaught ReferenceError...
			  console.log(statusMessage);
			  ```
		-
		- **Extra Explain**
		- ## let vs var
			-
			- ```js
			  for (let i = 0; i < 3; i++) {
			    // This is the Max Scope for 'let'
			    // i accessible ✔️
			  }
			  // i not accessible ❌
			  ```
		-
		- ## Loops with closures
			-
			- ```js
			  // Prints 3 thrice, not what we meant.
			  for (var i = 0; i < 3; i++) {
			    setTimeout(_ => console.log(i), 10);
			  }
			  ```
		-
	-
	- ## Operators
	  collapsed:: true
		-
		- ### Arithmetic Operators
			-
			- `+` (Addition)
			- `-` (Subtraction)
			- `*` (Multiplication)
			- `/` (Division)
			- `%` (Modulus)
			- `**` (Exponentiation)
		-
		- ### Assignment Operators
			-
			- `=` (Assign)
			- `+=` (Add and assign)
			- `-=` (Subtract and assign)
			- `*=` (Multiply and assign)
			- `/=` (Divide and assign)
			- `%=` (Modulus and assign)
			- `**=` (Exponentiation and assign)
		-
		- ### Comparison Operators
			- `==` (Equal to)
			- `===` (Strict equal to)
			- `!=` (Not equal to)
			- `!==` (Strict not equal to)
			- `>` (Greater than)
			- `<` (Less than)
			- `>=` (Greater than or equal to)
			- `<=` (Less than or equal to)
		-
		- ### Logical Operators
			- `&&` (Logical AND)
			- `||` (Logical OR)
			- `!` (Logical NOT)
		-
		- ### Bitwise Operators
			- `&` (Bitwise AND)
			- `|` (Bitwise OR)
			- `^` (Bitwise XOR)
			- `~` (Bitwise NOT)
			- `<<` (Left shift)
			- `>>` (Right shift)
			- `>>>` (Unsigned right shift)
		-
		- ### Unary Operators
			- `++` (Increment)
			- `--` (Decrement)
			- `+` (Unary plus)
			- `-` (Unary negation)
			- `typeof` (Returns the type of a variable)
			- `void` (Evaluates an expression and returns `undefined`)
			- `delete` (Deletes a property from an object)
		-
		- ### Ternary Operator
			- A shorthand for `if...else` statements.
			- `condition ? exprIfTrue : exprIfFalse`
		-
		- ### Comma Operator
			- Allows multiple expressions to be evaluated, returning the value of the last expression.
			- `expr1, expr2, expr3`
		-
		- ### Spread and Rest Operators
			- **Spread Operator**: `...` (expands an iterable into individual elements)
			- Example: `let arr = [1, 2]; let newArr = [...arr, 3];`
			-
			- **Rest Operator**: `...` (gathers multiple elements into an array)
			- Example: `function myFunc(...args) { /* args is an array */ }`
		-
		- ### Instanceof Operator
			- Tests whether an object is an instance of a specific constructor.
			- `object instanceof Constructor`
		-
		- ### **In Operator**
			- Checks if a property exists in an object.
			- `property in object`
	-
	- ## JavaScript Conditionals
	  collapsed:: true
		- ## if Statement
			- ```js
			  const isMailSent = true;
			  
			  if (isMailSent) {
			    console.log('Mail sent to recipient');
			  }
			  ```
		- ##
		- ### Ternary Operator
			- ```js
			  var x=1;
			  
			  // => true
			  result = (x == 1) ? true : false;
			  
			  ```
		-
		- ## else if
			- ```js
			  const size = 10;
			  
			  if (size > 100) {
			    console.log('Big');
			  } else if (size > 20) {
			    console.log('Medium');
			  } else if (size > 4) {
			    console.log('Small');
			  } else {
			    console.log('Tiny');
			  }
			  // Print: Small
			  ```
		-
		- ## switch Statement
			- ```js
			  const food = 'salad';
			  
			  switch (food) {
			    case 'oyster':
			      console.log('The taste of the sea');
			      break;
			    case 'pizza':
			      console.log('A delicious pie');
			      break;
			    default:
			      console.log('Enjoy your meal');
			  }
			  ```
		-
		- ## == vs ===
			- ```js
			  0 == false   // true
			  0 === false  // false, different type
			  1 == "1"     // true,  automatic type conversion 
			  1 === "1"    // false, different type
			  null == undefined  // true
			  null === undefined // false
			  '0' == false       // true
			  '0' === false      // false
			  ```
	-
	- ## JavaScript Functions
	  collapsed:: true
		- ## Functions
			- ```js
			  // Defining the function:
			  function sum(num1, num2) {
			    return num1 + num2;
			  }
			  
			  // Calling the function:
			  sum(3, 6); // 9
			  ```
		-
		- ## Anonymous Functions
			- ```js
			  // Named function
			  function rocketToMars() {
			    return 'BOOM!';
			  }
			  
			  // Anonymous function
			  const rocketToMars = function() {
			    return 'BOOM!';
			  }
			  ```
		-
		- ## return Keyword
			- ```js
			  // With return
			  function sum(num1, num2) {
			    return num1 + num2;
			  }
			  
			  // The function doesn't output the sum
			  function sum(num1, num2) {
			    num1 + num2;
			  }
			  ```
		-
		- ## Calling Functions
			- ```js
			  // Defining the function
			  function sum(num1, num2) {
			    return num1 + num2;
			  }
			  
			  // Calling the function
			  sum(2, 4); // 6
			  ```
		-
		- ## Function Expressions
			- ```js
			  const dog = function() {
			    return 'Woof!';
			  }
			  ```
		-
		- ## Function Parameters
			- ```js
			  // The parameter is name
			  function sayHello(name) {
			    return `Hello, ${name}!`;
			  }
			  ```
		-
		- ## Function Declaration
			- ```js
			  function add(num1, num2) {
			    return num1 + num2;
			  }
			  ```
		-
		- ## Arrow Functions (ES6)
			- ```js
			  // With two arguments
			  
			  const sum = (param1, param2) => { 
			    return param1 + param2; 
			  }; 
			  console.log(sum(2,5)); // => 7 
			  
			  // With no arguments
			  
			  const printHello = () => { 
			    console.log('hello'); 
			  }; 
			  printHello(); // => hello
			  
			  // With a single argument
			  
			  const checkWeight = weight => { 
			    console.log(`Weight : ${weight}`); 
			  }; 
			  checkWeight(25); // => Weight : 25 
			  
			  // Concise arrow functions
			  
			  const multiply = (a, b) => a * b; 
			  // => 60 
			  console.log(multiply(2, 30)); 
			  ```
		-
	-
	- ## JavaScript Arrays
	  collapsed:: true
		- ## Mutable chart
			- ```js
			  		add	remove	start	end
			  push	✔					✔
			  pop			 ✔				✔
			  unshift	✔			✔	
			  shift		 ✔		✔
			  ```
		-
		- ## Arrays
			- ```js
			  const fruits = ["apple", "orange", "banana"];
			  
			  // Different data types
			  const data = [1, 'chicken', false];
			  ```
		-
		- ## Property .length
			- ```js
			  const numbers = [1, 2, 3, 4];
			  
			  numbers.length // 4
			  ```
		-
		- ## Index
			- ```js
			  // Accessing an array element
			  const myArray = [100, 200, 300];
			  
			  console.log(myArray[0]); // 100
			  console.log(myArray[1]); // 200
			  ```
		-
		- ## Method .push()
			- ```jS
			  // Adding a single element:
			  const cart = ['apple', 'orange'];
			  cart.push('pear'); 
			  
			  // Adding multiple elements:
			  const numbers = [1, 2];
			  numbers.push(3, 4, 5);
			  
			  ```
		-
		- ## Method .pop()
			- ```js
			  const fruits = ["apple", "orange", "banana"];
			  
			  const fruit = fruits.pop(); // 'banana'
			  console.log(fruits); // ["apple", "orange"]
			  ```
		-
		- ## Method .shift()
			- ```js
			  let cats = ['Bob', 'Willy', 'Mini'];
			  
			  cats.shift(); // ['Willy', 'Mini']
			  ```
		-
		- ## Method .unshift()
			- ```js
			  let cats = ['Bob'];
			  
			  // => ['Willy', 'Bob']
			  cats.unshift('Willy');
			  
			  // => ['Puff', 'George', 'Willy', 'Bob']
			  cats.unshift('Puff', 'George');
			  ```
		-
		- ## Method .concat()
			- ```js
			  const numbers = [3, 2, 1]
			  const newFirstNumber = 4
			      
			  // => [ 4, 3, 2, 1 ]
			  [newFirstNumber].concat(numbers)
			      
			  // => [ 3, 2, 1, 4 ]
			  numbers.concat(newFirstNumber)
			  ```
	-
	- ## JavaScript Loops
	  collapsed:: true
		- ## While Loop
			- ```js
			  while (condition) {
			    // code block to be executed
			  }
			  
			  let i = 0;
			  while (i < 5) {        
			    console.log(i);
			    i++;
			  }``
			  ```
		-
		- ## Reverse Loop
			- ```js
			  const fruits = ["apple", "orange", "banana"];
			  
			  for (let i = fruits.length - 1; i >= 0; i--) {
			    console.log(`${i}. ${fruits[i]}`);
			  }
			  
			  // => 2. banana
			  // => 1. orange
			  // => 0. apple
			  ```
		-
		- ## Do…While Statement
			- ```js
			  x = 0
			  i = 0
			  
			  do {
			    x = x + i;
			    console.log(x)
			    i++;
			  } while (i < 5);
			  // => 0 1 3 6 10
			  ```
		-
		- ## For Loop
			- ```js
			  for (let i = 0; i < 4; i += 1) {
			    console.log(i);
			  };
			  
			  // => 0, 1, 2, 3
			  ```
		-
		- ## Looping Through Arrays
			- ```js
			  for (let i = 0; i < array.length; i++){
			    console.log(array[i]);
			  }
			  
			  // => Every item in the array
			  ```
		-
		- ## Break
			- ```ls
			  for (let i = 0; i < 99; i += 1) {
			    if (i > 5) {
			       break;
			    }
			    console.log(i)
			  }
			  // => 0 1 2 3 4 5
			  ```
		-
		- ## Continue
			- ```js
			  for (i = 0; i < 10; i++) {
			    if (i === 3) { continue; }
			    text += "The number is " + i + "<br>";
			  }
			  ```
		-
		- ## Nested
			- ```js
			  for (let i = 0; i < 2; i += 1) {
			    for (let j = 0; j < 3; j += 1) {
			      console.log(`${i}-${j}`);
			    }
			  }
			  ```
		-
		- ## for...in loop
			- ```js
			  const fruits = ["apple", "orange", "banana"];
			  
			  for (let index in fruits) {
			    console.log(index);
			  }
			  // => 0
			  // => 1
			  // => 2
			  ```
		-
		- ## for...of loop
			- ```js
			  const fruits = ["apple", "orange", "banana"];
			  
			  for (let fruit of fruits) {
			    console.log(fruit);
			  }
			  // => apple
			  // => orange
			  // => banana
			  ```
			-
-
-
- # Library & Frameworks
	- [[ React js ]] - This is Use Full  for Front-end single page web application
	- [[Node Js]] -
	- [[jQuery]]    - Simplifies DOM manipulation.
	- [[Lodash]]   - Utility library for JavaScript.
	- [[Angular]]  - Platform for building mobile and desktop web applications.
	- [[Vue.js]]     - Progressive framework for building user interfaces.
- #
-
- # More Learn
	- Explore the following links for valuable resources, communities, and tools to enhance your skills : -
	-
	- [Learn Basic Js](https://github.com/GitbookIO/javascript)
	- [Js Course & Projects ](https://github.com/jonasschmedtmann/complete-javascript-course)
	- [New Modern Web Dev Book ](https://github.com/dexteryy/spellbook-of-modern-webdev)
	- [Super Secrets of Js](https://github.com/getify/You-Dont-Know-JS/)
	- [JavaScript Algorithms and Data Structures](https://github.com/trekhleb/javascript-algorithms?ref=hackernoon.com)
	- [30 Day 30 Projects challenge](https://github.com/wesbos/JavaScript30)
	- [Js Experiments](https://github.com/MartinChavez/Javascript)
	- [Prepare Advance Js](https://github.com/lydiahallie/javascript-questions)
	- [Learn Write Clean Coding ](https://github.com/ryanmcdermott/clean-code-javascript)
	- [collection for Js Resource](https://github.com/sorrycc/awesome-javascript)
	- [Algorithm for js](https://github.com/felipernb/algorithms.js)
	-
	-
	-
	-
	-