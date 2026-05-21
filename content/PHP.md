---
seoTitle: PHP Programming Language – Syntax Reference and Web Dev Guide
description: "PHP reference covering arrays, OOP, PDO, Composer, namespaces, PHP 8 features, Laravel basics, and server-side web development patterns."
keywords: "PHP programming, PHP reference, arrays, OOP, PDO, Composer, namespaces, PHP 8, Laravel, server-side, web development, syntax cheat sheet"
---

- # History & Intro
	- This is server side Scripting-launguage
	- use Build dynamic web pages
	- Run on Server
	- Use for - Speed, Simplicity , Flexibility
	- PHP first name - Personal Home Page Then > PHP Hypertext Preprocessor
- # Notes
	- Php contains html , css,js. php
	- For comment use "//" or " /**/ "
	-
	- ## Import tags
	  collapsed:: true
		- "<?" - Start Php  ?> - and PHP
		- echo - Returns multiple string
		- Print - return single String and return value
		-
	- ## Variables
	  collapsed:: true
		- ```php
		   int, float, string, bullion ,  array , Null , resource , object
		   $ - Use for Decrele variable
		   $name  = "Bro"; - String
		   $num = 1
		   $float = 2.5
		   $bulians = true/False
		   $null = null - null not variable it's value but not any value
		  
		   $totel = $float * $num ;
		   echo "Hello {$name} <br> "; - This {} use for use Variable also html tag allows php like0 <br>
		   echo"Your pizaa is ${$float} " ; - use \ for use $ sign
		  ```
		-
		- ## IMP
		  collapsed:: true
			- $_GET =    Data Is appended To the URL , Not SECURE , char Limit , Bookmark Is possible w/ value , Better for search page - Technically it array
			-
			- $_POST =  Data is packaged inside the body of the HTTP request , MORE SECURE , No data limit , Cannot bookmark , GET request are not cached , Better 
			  collapsed:: true
			                     for submitting credentials
				- ```Html
				  <!DOCTYPE html>
				  <html lang="en">
				  <head>
				      <meta charset="UTF-8">
				      <meta name="viewport" content="width=device-width, initial-scale=1.0">
				      <title>PHP Learn</title>
				  </head>
				  <body>
				      <form action="index.php" method="get">
				          <label>Username:</label>
				          <input type="text" name="username"> <br>
				          <label>password:</label>
				          <input type="password" name="password"><br>
				          <input type="submit" value="Log in">
				      </form>    
				  </body>
				  </html>
				  <?php
				      echo $_GET["username"] . "<br>"; //or use can also use This
				      echo "{$_GET["password"]} "<br>";
				  ?>
				  
				  // get Show in URL name and Possword so Use Post
				  
				  <!DOCTYPE html>
				  <html lang="en">
				  <head>
				      <meta charset="UTF-8">
				      <meta name="viewport" content="width=device-width, initial-scale=1.0">
				      <title>PHP Learn</title>
				  </head>
				  <body>
				      <form action="index.php" method="post">
				          <label>Username:</label>
				          <input type="text" name="username"> <br>
				          <label>password:</label>
				          <input type="password" name="password"><br>
				          <input type="submit" value="Log in">
				      </form>    
				  </body>
				  </html>
				  <?php
				      echo $_POST["username"] . "<br>"; //or use can also use This
				      echo "{$_POST["password"]} "<br>";
				  ?>
				  
				  // get Show in URL name and Possword so Use Post
				  ```
		-
		- You can catch data for more conveniat use
		  collapsed:: true
			- ```php
			  - $item = Pizza;
			  - $Price = 2.99$ ;
			  - $quantity = $_POST["quantity"];
			  -
			  - $total = $quantity * $price;
			  -
			  - echo"You Have ordered {$quantity} x {$item}/s ";
			  - echo"Your Total Is: ${$total}";
			  ```
		-
	- ## Opraters
	  collapsed:: true
		- Arithmetic operators
		  collapsed:: true
			- collapsed:: true
			  ```PHP
			  // Arithmetic
			  $sum        = 1 + 1; // 2
			  $difference = 2 - 1; // 1
			  $product    = 2 * 2; // 4
			  $quotient   = 2 / 1; // 2
			  
			  // Shorthand arithmetic
			  $num = 0;
			  $num += 1;       // Increment $num by 1
			  echo $num++;     // Prints 1 (increments after evaluation)
			  echo ++$num;     // Prints 3 (increments before evaluation)
			  $num /= $float;  // Divide and assign the quotient to $num
			  ```
				-
				- ## perenthisis
				  collapsed:: true
					- () > ** > * > / > % > + > -
					-
	- ## Logical op
	  collapsed:: true
		- ```PHP
		  and	And
		  or	Or
		  xor	Exclusive or
		  !	Not
		  &&	And
		  ||	Or
		  ------------------------------------------------------------------------------
		    
		  && - True if both condition is Ture
		  || - True if at least One codition os ture
		  !  - Ture if flase and Flase if Ture
		  ```
		-
	- ## if - else statement
	  collapsed:: true
		- ```php
		  <?php
		      $age = 10
		      if ($age >= 18){
		          echo"You are adult";
		      }
		      elseif($age >= 12 & <18){
		          echo"YOu are Not Ready For That";
		      }
		      else{
		          echo"Where Is your perent?";
		      }
		  ?>
		  ```
		-
		- Switch - Statement
		  collapsed:: true
			- ```php
			  <?php
			      $grade = "A";
			  
			      switch ($grade) {
			          case 'A':
			              echo"You Did great";
			              break;
			          
			          case 'B':
			              echo"You Did normal";
			              break;
			          
			          case 'C':
			              echo"You Did not good";
			              break;
			          
			          case 'D':
			              echo"You Did Weak";
			              break;
			          
			          default:
			              echo"This is unexpecated";
			              break;
			          
			      }
			  ?>
			  ```
			-
	- ## Loops
		- For loop
			- ```php
			  <?php
			  
			      for ($i=0; $i < 5; $i++) { 
			          echo"Hello";
			      }
			  ?>
			  ```
		-
		- While loop
		  collapsed:: true
			- ```php
			  <!DOCTYPE html>
			  <html lang="en">
			  <head>
			      <meta charset="UTF-8">
			      <meta name="viewport" content="width=device-width, initial-scale=1.0">
			      <title>Stop Watch</title>
			  </head>
			  <body>
			      <form action="index.php" method="post">
			          <input type="button" name="stop" value="stop">
			      </form>
			  </body>
			  </html>
			  
			  <?php
			      //Stop Watch
			      $second = 0 ;
			      $running = true;
			  
			      if (isset($_POST["stop"])) {
			          $running = false;
			      }
			      else{
			          
			              while ($running) {
			                  // wait 1 sec
			                  $second++
			                  echo $second. "<br>";
			              }
			      }
			  ?>
			  ```
		-
		- Do while loop
			- ```PHP
			  $i = 1;
			  # => 12345
			  do {
			      echo $i++;
			  } while ($i <= 5);
			  ```
		-
		- Foreach loop
		  collapsed:: true
			- ```PHP
			  $a = ['foo' => 1, 'bar' => 2];
			  # => 12
			  foreach ($a as $k) {
			      echo $k;
			  }
			  ```
			-
	- ## Array
	  collapsed:: true
		- ```php
		  <?php
		      $Arry = array("apple", "Orange", "Coconut"); 
		  
		      //we cant rerectly call array
		      echo $Arry[0];
		  	
		  	//cahnge value
		  	$Array[0] = "pineaple"
		        
		       //push
		        $Array_push($Array, "pineapple")
		        //pop list array
		        array_pop($Array)
		        
		        //reverce array
		        $newarray = array_reverse($Array)
		        
		        //associative array - THis is key Value pair
		        $capitals = array("USA"=> "washington DC",
		                          "JAPAN"=>"Kyoto", 
		                          "INDIA"=>"New Delhi", 
		                          "South korea"=>"Seoul");
		  
		  	  echo $capitals["USA"] // Give value
		        
		          //Print all Key Vkue Pairs
		          foreach($capitals as $key => $value){
		            echo"{$key} = {$value} <br>";
		          }
		  		
		  		//update value
		  		$capitals["USA"] = "Las Vegas";
		  		array_pop($capitals); //remvoe last element
		          array_shift($capitals); //remvoe first element
		  		array_keys($capitals) //return all keys
		  
		  	// also YOu can do This to call all list in array 
		  	foreach($Arry as $Arry){
		        echo $Arry . "<br>";
		      }
		  ?>
		  ```
		-
	- ## Math Operations
	  collapsed:: true
		- ```php
		  <!DOCTYPE html>
		  <html lang="en">
		  <head>
		      <meta charset="UTF-8">
		      <meta name="viewport" content="width=device-width, initial-scale=1.0">
		      <title>PHP Learn</title>
		  </head>
		  <body>
		      <form action="index.php" method="post">
		          <label>x:</label>
		          <input type="text" name="x"> <br>
		          <input type="submit" value="total">
		      </form>
		  </body>
		  </html>
		  <?php
		      $x = $_POST["x"];
		      $y = $_POST["y"];
		      $z = $_POST["z"];
		      $total = null;
		      
		      //absulute vlue Function -4 => 4 , -100.3 => 100.3
		      $total = abs($x);
		  
		      //round vlue Function - 4.0,3.0,2.. convert purank
		      $total = round($x);
		      $total = round($x , 2); // sec peramiter in number after "."
		  
		      //floor vlue Function - 4.0,3.0,2.., 4.99=>3, 5.78=>5 convert purank
		      $total = floor($x);
		  
		      //ceil vlue Function - 4.0,3.0,2.., 4.99=>4, 5.78=>6 convert purank
		      $total = ceil($x);
		  
		      //Power cal
		      $total = pow($x, $y);
		  
		      //Squre
		      $total = sqrt($x);
		  
		      // max funtion give maximum value
		      $total = max($x ,$y, $z);
		  
		      // min funtion give minimun
		      $total = min($x, $y, $z);
		  
		      // pi
		      $total = pi();
		  
		      // rendom num
		      $total= rand(1, 100)
		        
		      echo $total;
		  
		  
		  ?>
		  
		  // get Show in URL name and Possword so Use Post
		  ```
	- ## Funtions
	  collapsed:: true
		- This use for make code block Run particular time
		- We don't need Re-write code just call it
		- ```php
		  <?php 
		      function demo($argument){
		          echo"Happy birthday Dear {$argument}";
		      }
		  
		      demo("data")
		  ?>
		  ```
		-
	- ## String Methods
	  collapsed:: true
		- ```php
		  <?php 
		      
		      $name = "JamBUra";
		  
		      // lower string
		      $name = strtolower($name);
		  
		      // upper case
		      $name = strtoupper($name);
		  
		      //trim - Remove white space
		      $name = trim($name);
		  
		      //pad string whit certain amount careters
		      $name = trim($name , 10 , "0");
		  
		      // repace one car to another
		      $name = str_replace("-", "/", $name);
		  
		      //str reverse
		      $name = strrev($name);
		  
		      //suffale string
		      $name = str_shuffle($name);
		  
		      //string compare
		      $name = strcmp($name , "Code"); // same string retun 1 else 0/-1
		  
		      //string length
		      $name = strlen($name);
		  
		      //string postion of car
		      $name = strpos($name, " ");
		  
		      // substring cretion new string
		      $name = substr($name, 0 , 3);
		  
		      // exploding all char and canvert in array
		      $name = explode(" " , $name);
		  
		      // change array to string
		      $name = implode(" " , $name);
		  
		      echo $name
		  ?>
		  ```
		-
		- ### Privent atteck -  Filter methods
		  collapsed:: true
			- ```php
			  <?php 
			      //asume Maked HTML form
			      //privent Atteck script
			      if (isset($_POST["login"])) {
			          $name = filter_input(INPUT_POST, "name", FILTER_SANITIZE_SPECIAL_CHARS);
			          echo "Hello {$name}";
			       // There are lots of methods for email, number
			      }
			  ?>
			  ```
			-
			- include() - copies the content of a file (php/html/text) and inclued in PHP File.
			  collapsed:: true
				- use for Code resubility like header , Fotter
			-
			- cookie() - Informstion about a user stored in a user's Web-browser.
			  collapsed:: true
				- ```php
				  <?php 
				      setcookie("fav_food", "Pizza", time() + (86400 * 2), "/"); //THis is one day *2 Now its 2 days "/" is file path
				      setcookie("fav_food", "Pizza", time() - 0, "/"); //THis is one day *2 Now its 2 days "/" is file path
				  ?>
				  ```
			-
		- ## session
		  collapsed:: true
			- SGB used to store information on a user to be used across multiple pages.
			- A user is assigned a session-id
			- ex- login credentials
			- This is useful for pass data in global
			-
		- ## Server
		  collapsed:: true
			- SGB That contains headers, paths, and script locations
			- THE entries in this array are created by the wev server.
			- $_SERVER - use this
			-
		- ### hashing
		  collapsed:: true
			- this is method to pass sensitive data in
			- this useful for atteck
			- trafring sesitive data into letters, numbers and/or symbols via a methematical process.
			- ```php
			  <?php 
			      $password = "Get_this passeord123";
			  
			      $hashdata =  password_hash($password, PASSWORD_DEFAULT);
			      
			  ?>
			  ```
		-
		-
		- ## connet to mySQL
		  collapsed:: true
			- There are 2 Type to connet
			  collapsed:: true
				- MySQLi Extension
				  logseq.order-list-type:: number
				- PDO (PHP Data Objects )
				  logseq.order-list-type:: number
				- logseq.order-list-type:: number
-
- # Libs & Framework
	- [[Laravel]]: A modern, MVC-based PHP framework with built-in tools for routing, authentication, ORM, and task scheduling. Highly favored for its elegant syntax and developer-friendly ecosystem.
	-
	- [[Symfony]]: A robust and flexible PHP framework for large-scale enterprise applications. It's known for its reusable components, stability, and widespread use in the PHP community.
	-
	- [[CodeIgniter]]: A lightweight, fast, and simple PHP framework for building dynamic web applications. Ideal for beginners or when you need to get projects up and running quickly.
	-
	- [[Yii]]: A high-performance, component-based PHP framework that is perfect for developing large-scale applications. It comes with built-in features like caching, authentication, and security.
	-
	- [[Zend Framework (Laminas)]]: A professional PHP framework that offers a set of reusable components and libraries. It's ideal for enterprise-grade applications and services.
	-
	- [[Composer]]: The PHP dependency manager that makes it easy to manage libraries and packages. It's essential for managing project dependencies in modern PHP development.
	-
	- [[PHPMailer]]: A library for sending emails from PHP, with support for attachments, HTML messages, SMTP authentication, and more.
	-
	- [[Guzzle]]: A powerful HTTP client for PHP, ideal for making HTTP requests to APIs or web services. It supports synchronous and asynchronous requests.
	-
	- [[Monolog]]: A comprehensive logging library for PHP, allowing you to log messages to various handlers (files, databases, email, etc.) in a standardized format.
	-
	- [[Carbon]]: A popular PHP date and time library that extends PHP's native DateTime class with a wide range of useful methods for date manipulation and formatting.
	-
	- [[Twig]]:A flexible, fast, and secure templating engine for PHP, designed to separate the logic of your application from the presentation layer.
	-
	- [[Intervention Image]]: A simple and easy-to-use image handling and manipulation library for PHP, with support for resizing, cropping, filters, and more.
	-
	- [[Doctrine ORM]]: A powerful and flexible Object-Relational Mapping (ORM) library for PHP, used to map database entities to PHP objects, easing database interaction.
	-
	- [[PHPUnit]]: A testing framework for PHP that helps developers write unit tests and perform test-driven development (TDD). It supports assertions, mocking, and code coverage analysis.
	-
	- [[Slim]]: A lightweight micro-framework for PHP that is perfect for building small and simple RESTful APIs or web applications. It focuses on simplicity and performance.
	-
	- [[Lumen]]: A micro-framework by the creators of Laravel, designed for building fast and lightweight APIs. It uses the same core components as Laravel but with less overhead.
	-
	- [[Firebase PHP SDK]] : A library to integrate Firebase services (such as Firestore, Authentication, and Push Notifications) with your PHP applications.
	-
	- [[JWT (Firebase JWT)]]: A simple PHP library for working with JSON Web Tokens (JWT), often used for authentication and secure data transmission in APIs.
	-
	- [[PHPStan]]: A static analysis tool for PHP that helps find bugs in your code without running it. It checks for type safety, dead code, and potential issues in your codebase.
	-
	- [[Xdebug]]: A PHP extension for debugging and profiling. It allows you to step through your code, inspect variables, and trace execution flow to make development easier.
	-
	- [[Ratchet]]: A PHP WebSocket library for real-time, bi-directional communication between the server and client. It supports websockets and provides a framework for building chat systems or live data feeds.
	-
	- [[Flysystem]]: A filesystem abstraction library for PHP, enabling you to work with different storage systems (local, Amazon S3, FTP, etc.) using a unified API.
	-
	- [[Faker]]: A library for generating fake data in PHP, useful for testing, seeding databases, or populating forms with realistic data.
	-
- # More learn
	- Explore the following links for valuable resources, communities, and tools to enhance your skills :-
	-
	- ## Github & Webs
		- [PHP Doc](https://www.php.net/docs.php)
		- [Beautiful Doc](https://devdocs.io/php/)
		- [PHP Roadmap](https://github.com/thecodeholic/php-developer-roadmap)
		- [Design Patterns For PHP](https://github.com/DesignPatternsPHP/DesignPatternsPHP)
		- [Which PHP lib/framework are trending Now?](https://github.com/EvanLi/Github-Ranking/blob/master/Top100/ActionScript.md)