# Notes
	- ## Arrow Functions
		- Valid - invalid Code Write
			- ```js
			   // exactly one parameter
			  
			  // valid
			  (userName) => { ... }
			  
			  
			  If your function takes more than one parameter, you also must not omit parentheses - userName, userAge => { ... } would be invalid ((userName, userAge) => { ... } is correct)!
			    
			  //  Omitting function body curly braces
			  // If your arrow function contains no other logic but a return statement, you may omit the curly braces and the return keyword.
			  
			  Instead of
			  
			  number => { 
			    return number * 3;
			  }
			  you could write
			  
			  number => number * 3;
			  The following code would be invalid:
			  
			  number => return number * 3; // invalid because return keyword must also be omitted!
			  number => if (number === 2) { return 5 }; // invalid because if statements can't be returned
			  
			  // Special case: Just returning an object
			  If you go for the shorter alternative explained in 2) and you're trying to return a JavaScript object, you may end up with the following, invalid code:
			  
			  number => { age: number }; // trying to return an object
			  This code would be invalid because JavaScript treats the curly braces as function body wrappers (not as code that creates a JS object).
			  To "tell" JavaScript that an object should be created (and returned) instead, the code would need to be adjusted like this:
			  
			  number => ({ age: number }); // wrapping the object in extra parentheses
			  By wrapping the object and its curly braces with an extra pair of parentheses, JavaScript understands that the curly braces are not there to define a function body but instead to create an object. Hence that object then gets returned.
			  ```
- # more learn
	- Explore the following links for valuable resources, communities, and tools to enhance your skills:
	-
	- ## Github & Webs
		- [React Roadmap](https://github.com/GomaGoma676/react-roadmap-2024)
		- [compilation of React Patterns, techniques, tips and tricks](https://github.com/vasanthk/react-bits)
		- [React Atomic Design](https://github.com/danilowoz/react-atomic-design)
		- [React patterns](https://github.com/reactpatterns/reactpatterns)
		- [React TypeScript Cheatsheet](https://github.com/typescript-cheatsheets/react)
		- [Beautiful React Hooks can Help For Faster Development](https://github.com/antonioru/beautiful-react-hooks?tab=readme-ov-file)
		- [Learn How make Primer Degine](https://github.com/primer/react)
		- [Building dynamic UIs with modern JavaScript (Frontend)](https://github.com/HackYourFuture/React)
		- [React Docs](https://github.com/reactjs/react.dev)
		- [React boilerplate](https://github.com/react-boilerplate/react-boilerplate)
		-
		-
		-
		-
		-
		-
	-