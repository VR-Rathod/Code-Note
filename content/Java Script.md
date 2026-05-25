---
date: 2026-03-31T12:26:35+05:30
lastmod: 2026-03-31T12:26:35+05:30

seoTitle: JavaScript Reference – ES6+ Syntax, DOM, and Async Patterns
description: "JavaScript reference covering ES6+ features, promises, async/await, closures, prototypes, DOM manipulation, event handling, and modern JS patterns."
keywords: "JavaScript, JavaScript reference, ES6, promises, async await, closures, prototypes, DOM, event handling, modern JavaScript, Node.js, syntax cheat sheet"
displayTitle: Java Script
---

- # History
  collapsed:: true
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
	- ## Advantages :
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
	- `console.log("msg")` - Print that msg
	- `console.warn('hello %s', 'Cheekbone')` - The `%s` is a placeholder for a string, allowing you to format the message with additional variables.
	- console.error(new Error('Oops!')) - console.error(new Error('Oops!'));
	- In Html use <script {You can Give link path or =>} > write Here </script> this tag for write js
	-
	- ## variables Types
		- **Primitive Types**:
			-
			- **String**: Represents text (e.g., `"Hello, world!"`).
			-
			- **Number**: Represents numeric values (e.g., `42`, `3.14`).
			-
			- **BigInt**: Represents integers of arbitrary precision (e.g., `12345678901245678901234567890n`).
			-
			- **Boolean**: Represents a logical entity that can be either `true` or `false`.
			-
			- **Undefined**: A variable that has been declared but has not been assigned a value(e.g., `let a;`).
			-
			- **Null**: Represents the intentional absence of any value (e.g., `let b = null;`).
			-
			- **Symbol**: A unique and immutable primitive value often used as object property keys.
		-
		- **Object Types**:
			-
			- **Object**: A collection of key-value pairs (e.g., `{ name: "Alice", age: 25 }`).
			-
			- **Array**: A special type of object for storing ordered lists (e.g., `[1, 2, 3]`).
			-
			- **Function**: A callable object that can be defined with the `function` keyword (e.g., `function add(a, b) { return a + b; }`).
			-
			- **Date**: A built-in object for working with dates and times (e.g., `new Date()`).
			-
			- **RegExp**: Regular expressions for pattern matching in strings (e.g., `/abc/`).
		-
	-
	- ## Scope Types
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
		- ## Extra Explain
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
		- ## Mutable chart
			- ```js
			  			add	remove	start	end
			  push		✔					✔
			  pop			 	✔				✔
			  unshift		✔			✔	
			  shift		 	✔		✔
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
		- ## More Methods
			- [Array's methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/)
	-
	- ## JavaScript Loops
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
	- ## JavaScript Iterators
		- ## Functions Assigned to Variables
			- ```js
			  let plusFive = (number) => {
			    return number + 5;  
			  };
			  // f is assigned the value of plusFive
			  let f = plusFive;
			  
			  plusFive(3); // 8
			  // Since f has a function value, it can be invoked. 
			  f(9); // 14
			  ```
		-
		- ## Callback Functions
			- ```js
			  const isEven = (n) => {
			    return n % 2 == 0;
			  }
			  
			  let printMsg = (evenFunc, num) => {
			    const isNumEven = evenFunc(num);
			    console.log(`${num} is an even number: ${isNumEven}.`)
			  }
			  
			  // Pass in isEven as the callback function
			  printMsg(isEven, 4); 
			  // => The number 4 is an even number: True.
			  ```
		-
		- ## Array Method .reduce()
			- ```js
			  const numbers = [1, 2, 3, 4];
			  
			  const sum = numbers.reduce((accumulator, curVal) => {  
			    return accumulator + curVal;
			  });
			  
			  console.log(sum); // 10
			  ```
		-
		- ## Array Method .map()
			- ```js
			  const members = ["Taylor", "Donald", "Don", "Natasha", "Bobby"];
			  
			  const announcements = members.map((member) => {
			    return member + " joined the contest.";
			  });
			  
			  console.log(announcements);
			  ```
		-
		- ## Array Method .forEach()
			- ```js
			  const numbers = [28, 77, 45, 99, 27];
			  
			  numbers.forEach(number => {  
			    console.log(number);
			  }); 
			  ```
		-
		- ## Array Method .filter()
			- ```js
			  const randomNumbers = [4, 11, 42, 14, 39];
			  const filteredArray = randomNumbers.filter(n => {  
			    return n > 5;
			  });
			  ```
		-
	-
	- ## JavaScript Objects
		- ## Accessing Properties
			- ```js
			  const apple = { 
			    color: 'Green',
			    price: { bulk: '$3/kg', smallQty: '$4/kg' }
			  };
			  console.log(apple.color); // => Green
			  console.log(apple.price.bulk); // => $3/kg
			  ```
		-
		- ## Naming Properties
			- ```js
			  // Example of invalid key names
			  const trainSchedule = {
			    // Invalid because of the space between words.
			    platform num: 10, 
			    // Expressions cannot be keys.
			    40 - 10 + 2: 30,
			    // A + sign is invalid unless it is enclosed in quotations.
			    +compartment: 'C'
			  }
			  ```
		-
		- ## Non-existent properties
			- ```js
			  const classElection = {
			    date: 'January 12'
			  };
			  
			  console.log(classElection.place); // undefined
			  ```
		-
		- ## Mutable
			- ```js
			  const student = {
			    name: 'Sheldon',
			    score: 100,
			    grade: 'A',
			  }
			  
			  console.log(student)
			  // { name: 'Sheldon', score: 100, grade: 'A' }
			  
			  delete student.score
			  student.grade = 'F'
			  console.log(student)
			  // { name: 'Sheldon', grade: 'F' }
			  
			  student = {}
			  // TypeError: Assignment to constant variable.
			  ```
		- ## Assignment shorthand syntax
			- ```js
			  const person = {
			    name: 'Tom',
			    age: '22',
			  };
			  const {name, age} = person;
			  console.log(name); // 'Tom'
			  console.log(age);  // '22'
			  ```
		-
		- ## Delete operator
			- ```js
			  const person = {
			    firstName: "Matilda",
			    age: 27,
			    hobby: "knitting",
			    goal: "learning JavaScript"
			  };
			  
			  delete person.hobby; // or delete person[hobby];
			  
			  console.log(person);
			  /*
			  {
			    firstName: "Matilda"
			    age: 27
			    goal: "learning JavaScript"
			  }
			  */
			  ```
		-
		- ## Objects as arguments
			- ```js
			  const origNum = 8;
			  const origObj = {color: 'blue'};
			  
			  const changeItUp = (num, obj) => {
			    num = 7;
			    obj.color = 'red';
			  };
			  
			  changeItUp(origNum, origObj);
			  
			  // Will output 8 since integers are passed by value.
			  console.log(origNum);
			  
			  // Will output 'red' since objects are passed 
			  // by reference and are therefore mutable.
			  console.log(origObj.color);
			  ```
		-
		- ## Shorthand object creation
			- ```js
			  const activity = 'Surfing';
			  const beach = { activity };
			  console.log(beach); // { activity: 'Surfing' }
			  ```
		-
		- ## this Keyword
			- ```js
			  const cat = {
			    name: 'Pipey',
			    age: 8,
			    whatName() {
			      return this.name  
			    }
			  };
			  console.log(cat.whatName()); // => Pipey
			  ```
		-
		- ## Factory functions
			- ```js
			  // A factory function that accepts 'name', 
			  // 'age', and 'breed' parameters to return 
			  // a customized dog object. 
			  const dogFactory = (name, age, breed) => {
			    return {
			      name: name,
			      age: age,
			      breed: breed,
			      bark() {
			        console.log('Woof!');  
			      }
			    };
			  };
			  ```
		-
		- ## Methods
			- ```js
			  const engine = {
			    // method shorthand, with one argument
			    start(adverb) {
			      console.log(`The engine starts up ${adverb}...`);
			    },  
			    // anonymous arrow function expression with no arguments
			    sputter: () => {
			      console.log('The engine sputters...');
			    },
			  };
			  
			  engine.start('noisily');
			  engine.sputter();
			  ```
		-
		- ## Getters and setters
			- ```js
			  const myCat = {
			    _name: 'Dottie',
			    get name() {
			      return this._name;  
			    },
			    set name(newName) {
			      this._name = newName;  
			    }
			  };
			  
			  // Reference invokes the getter
			  console.log(myCat.name);
			  
			  // Assignment invokes the setter
			  myCat.name = 'Yankee';
			  ```
	-
	- ## JavaScript Classes
		- ## Static Methods
			- ```js
			  class Dog {
			    constructor(name) {
			      this._name = name;  
			    }
			    
			    introduce() { 
			      console.log('This is ' + this._name + ' !');  
			    }
			    
			    // A static method
			    static bark() {
			      console.log('Woof!');  
			    }
			  }
			  
			  const myDog = new Dog('Buster');
			  myDog.introduce();
			  
			  // Calling the static method
			  Dog.bark();
			  ```
		-
		- ## Class
			- ```js
			  class Song {
			    constructor() {
			      this.title;
			      this.author;
			    }
			    
			    play() {
			      console.log('Song playing!');
			    }
			  }
			  
			  const mySong = new Song();
			  mySong.play();
			  ```
		-
		- ## Class Constructor
			- ```js
			  class Song {
			    constructor(title, artist) {
			      this.title = title;
			      this.artist = artist;
			    }
			  }
			  
			  const mySong = new Song('Bohemian Rhapsody', 'Queen');
			  console.log(mySong.title);
			  ```
		-
		- ## Class Methods
			- ```js
			  class Song {
			    play() {
			      console.log('Playing!');
			    }
			    
			    stop() {
			      console.log('Stopping!');
			    }
			  }
			  ```
		-
		- ## extends
			- ```js
			  // Parent class
			  class Media {
			    constructor(info) {
			      this.publishDate = info.publishDate;
			      this.name = info.name;
			    }
			  }
			  
			  // Child class
			  class Song extends Media {
			    constructor(songData) {
			      super(songData);
			      this.artist = songData.artist;
			    }
			  }
			  
			  const mySong = new Song({ 
			    artist: 'Queen', 
			    name: 'Bohemian Rhapsody', 
			    publishDate: 1975
			  });
			  ```
	-
	- ## JavaScript Modules
		- ## Export
			- ```js
			  // myMath.js
			  
			  // Default export
			  export default function add(x,y){
			      return x + y
			  }
			  
			  // Normal export
			  export function subtract(x,y){
			      return x - y
			  }
			  
			  // Multiple exports
			  function multiply(x,y){
			      return x * y
			  }
			  function duplicate(x){
			      return x * 2
			  }
			  export {
			      multiply,
			      duplicate
			  }
			  ```
		-
		- ## Import
			- ```js
			  // main.js
			  import add, { subtract, multiply, duplicate } from './myMath.js';
			  
			  console.log(add(6, 2)); // 8 
			  console.log(subtract(6, 2)) // 4
			  console.log(multiply(6, 2)); // 12
			  console.log(duplicate(5)) // 10
			  
			  // index.html
			  <script type="module" src="main.js"></script>
			  ```
		-
		- ## Export Module
			- ```js
			  // myMath.js
			  
			  function add(x,y){
			      return x + y
			  }
			  function subtract(x,y){
			      return x - y
			  }
			  function multiply(x,y){
			      return x * y
			  }
			  function duplicate(x){
			      return x * 2
			  }
			  
			  // Multiple exports in node.js
			  module.exports = {
			      add,
			      subtract,
			      multiply,
			      duplicate
			  }
			  ```
		-
		- ## Require Module
			- ```js
			  // main.js
			  const myMath = require('./myMath.js')
			  
			  console.log(myMath.add(6, 2)); // 8 
			  console.log(myMath.subtract(6, 2)) // 4
			  console.log(myMath.multiply(6, 2)); // 12
			  console.log(myMath.duplicate(5)) // 10
			  ```
		-
		- ## JavaScript Promises
			- ## Promise states
				- ```js
				  const promise = new Promise((resolve, reject) => {
				    const res = true;
				    // An asynchronous operation.
				    if (res) {
				      resolve('Resolved!');
				    }
				    else {
				      reject(Error('Error'));
				    }
				  });
				  
				  promise.then((res) => console.log(res), (err) => console.error(err));
				  ```
			-
			- ## Executor function
				- ```js
				  const executorFn = (resolve, reject) => {
				    resolve('Resolved!');
				  };
				  
				  const promise = new Promise(executorFn);
				  ```
			-
			- ## setTimeout()
				- ```js
				  const loginAlert = () =>{
				    console.log('Login');
				  };
				  
				  setTimeout(loginAlert, 6000);
				  ```
			-
			- ## .then() method
				- ```js
				  const promise = new Promise((resolve, reject) => {    
				    setTimeout(() => {
				      resolve('Result');
				    }, 200);
				  });
				  
				  promise.then((res) => {
				    console.log(res);
				  }, (err) => {
				    console.error(err);
				  });
				  ```
			-
			- ## .catch() method
				- ```js
				  const promise = new Promise((resolve, reject) => {  
				    setTimeout(() => {
				      reject(Error('Promise Rejected Unconditionally.'));
				    }, 1000);
				  });
				  
				  promise.then((res) => {
				    console.log(value);
				  });
				  
				  promise.catch((err) => {
				    console.error(err);
				  });
				  ```
			-
			- ## Promise.all()
				- ```js
				  const promise1 = new Promise((resolve, reject) => {
				    setTimeout(() => {
				      resolve(3);
				    }, 300);
				  });
				  const promise2 = new Promise((resolve, reject) => {
				    setTimeout(() => {
				      resolve(2);
				    }, 200);
				  });
				  
				  Promise.all([promise1, promise2]).then((res) => {
				    console.log(res[0]);
				    console.log(res[1]);
				  });
				  ```
			-
			- ## Avoiding nested Promise and .then()
				- ```js
				  const promise = new Promise((resolve, reject) => {  
				    setTimeout(() => {
				      resolve('*');
				    }, 1000);
				  });
				  
				  const twoStars = (star) => {  
				    return (star + star);
				  };
				  
				  const oneDot = (star) => {  
				    return (star + '.');
				  };
				  
				  const print = (val) => {
				    console.log(val);
				  };
				  
				  // Chaining them all together
				  promise.then(twoStars).then(oneDot).then(print);
				  ```
			-
			- ## Creating
				- ```js
				  const executorFn = (resolve, reject) => {
				    console.log('The executor function of the promise!');
				  };
				  
				  const promise = new Promise(executorFn);
				  ```
			-
			- ## Chaining multiple .then()
				- ```js
				  const promise = new Promise(resolve => setTimeout(() => resolve('dAlan'), 100));
				  
				  promise.then(res => {
				    return res === 'Alan' ? Promise.resolve('Hey Alan!') : Promise.reject('Who are you?')
				  }).then((res) => {
				    console.log(res)
				  }, (err) => {
				    console.error(err)
				  });
				  ```
			-
			- ## Fake http Request with Promise
				- ```js
				  const mock = (success, timeout = 1000) => {
				    return new Promise((resolve, reject) => {
				      setTimeout(() => {
				        if(success) {
				          resolve({status: 200, data:{}});
				        } else {
				          reject({message: 'Error'});
				        }
				      }, timeout);
				    });
				  }
				  const someEvent = async () => {
				    try {
				      await mock(true, 1000);
				    } catch (e) {
				      console.log(e.message);
				    }
				  }
				  ```
	-
	- ## JavaScript Async-Await
		- ## Asynchronous
			- ```js
			  function helloWorld() {
			    return new Promise(resolve => {
			      setTimeout(() => {
			        resolve('Hello World!');
			      }, 2000);
			    });
			  }
			  
			  const msg = async function() { //Async Function Expression
			    const msg = await helloWorld();
			    console.log('Message:', msg);
			  }
			  
			  const msg1 = async () => { //Async Arrow Function
			    const msg = await helloWorld();
			    console.log('Message:', msg);
			  }
			  
			  msg(); // Message: Hello World! <-- after 2 seconds
			  msg1(); // Message: Hello World! <-- after 2 seconds
			  ```
		-
		- ## Resolving Promises
			- ```js
			  let pro1 = Promise.resolve(5);
			  let pro2 = 44;
			  let pro3 = new Promise(function(resolve, reject) {
			    setTimeout(resolve, 100, 'foo');
			  });
			  
			  Promise.all([pro1, pro2, pro3]).then(function(values) {
			    console.log(values);
			  });
			  // expected => Array [5, 44, "foo"]
			  ```
		-
		- ## Async Await Promises
			- ```js
			  function helloWorld() {
			    return new Promise(resolve => {
			      setTimeout(() => {
			        resolve('Hello World!');
			      }, 2000);
			    });
			  }
			  
			  async function msg() {
			    const msg = await helloWorld();
			    console.log('Message:', msg);
			  }
			  
			  msg(); // Message: Hello World! <-- after 2 seconds
			  ```
		-
		- ## Error Handling
			- ```js
			  let json = '{ "age": 30 }'; // incomplete data
			  
			  try {
			    let user = JSON.parse(json); // <-- no errors
			    console.log( user.name ); // no name!
			  } catch (e) {
			    console.error( "Invalid JSON data!" );
			  }
			  ```
		-
		- ## Aysnc await operator
			- ```js
			  function helloWorld() {
			    return new Promise(resolve => {
			      setTimeout(() => {
			        resolve('Hello World!');
			      }, 2000);
			    });
			  }
			  
			  async function msg() {
			    const msg = await helloWorld();
			    console.log('Message:', msg);
			  }
			  
			  msg(); // Message: Hello World! <-- after 2 seconds
			  ```
		-
	-
	- ## JavaScript Requests
	  collapsed:: true
		- ## JSON
			- ```js
			  const jsonObj = {
			    "name": "Rick",
			    "id": "11A",
			    "level": 4  
			  };
			  ```
		-
		- ## XMLHttpRequest
			- ```js
			  const xhr = new XMLHttpRequest();
			  xhr.open('GET', 'mysite.com/getjson');
			  ```
		-
		- ## GET
			- ```js
			  const req = new XMLHttpRequest();
			  req.responseType = 'json';
			  req.open('GET', '/getdata?id=65');
			  req.onload = () => {
			    console.log(xhr.response);
			  };
			  
			  req.send();
			  ```
		-
		- ## POST
			- ```js
			  const data = {
			    fish: 'Salmon',
			    weight: '1.5 KG',
			    units: 5
			  };
			  const xhr = new XMLHttpRequest();
			  xhr.open('POST', '/inventory/add');
			  xhr.responseType = 'json';
			  xhr.send(JSON.stringify(data));
			  
			  xhr.onload = () => {
			    console.log(xhr.response);
			  };
			  ```
		-
		- ## fetch api
			- ```js
			  fetch(url, {
			      method: 'POST',
			      headers: {
			        'Content-type': 'application/json',
			        'apikey': apiKey
			      },
			      body: data
			    }).then(response => {
			      if (response.ok) {
			        return response.json();
			      }
			      throw new Error('Request failed!');
			    }, networkError => {
			      console.log(networkError.message)
			    })
			  }
			  ```
		-
		- ## JSON Formatted
			- ```js
			  fetch('url-that-returns-JSON')
			  .then(response => response.json())
			  .then(jsonResponse => {
			    console.log(jsonResponse);
			  });
			  ```
		-
		- ## promise url parameter fetch api
			- ```js
			  fetch('url')
			  .then(
			    response  => {
			      console.log(response);
			    },
			   rejection => {
			      console.error(rejection.message);
			  );
			  ```
		-
		- ## Fetch API Function
			- ```js
			  fetch('https://api-xxx.com/endpoint', {
			    method: 'POST',
			   body: JSON.stringify({id: "200"})
			  }).then(response => {
			    if(response.ok){
			  	  return response.json();  
			    }
			  	throw new Error('Request failed!');
			  }, networkError => {
			    console.log(networkError.message);
			  }).then(jsonResponse => {
			    console.log(jsonResponse);
			  })
			  ```
		-
		- ## async await syntax
			- ```js
			  
			  const getSuggestions = async () => {
			    const wordQuery = inputField.value;
			    const endpoint = `${url}${queryParams}${wordQuery}`;
			    try{
			  const response = await fetch(endpoint, {cache: 'no-cache'});
			      if(response.ok){
			        const jsonResponse = await response.json()
			      }
			    }
			    catch(error){
			      console.log(error)
			    }
			  }
			  ```
-
- # Library & Frameworks
	- [[ React js ]] - This is Use Full  for Front-end single page web application
	-
	- [[Node Js]] - JavaScript runtime built on Chrome's V8 engine for building fast and scalable server-side applications.
	-
	- [[jQuery]]    - Simplifies DOM manipulation.
	-
	- [[Lodash]]   - Utility library for JavaScript.
	-
	- [[Angular]]  - Platform for building mobile and desktop web applications.
	-
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