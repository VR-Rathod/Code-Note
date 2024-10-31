# History & Intro
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
		- ### Variables
			- int, float, string, bullion ,  array , Null , resource , object
			- $ - Use for Decrele variable
			- $name  = "Bro"; - String
			- $num = 1
			- $float = 2.5
			- $bulians = true/False
			- $null = null - null not variable it's value but not any value
			-
			- $totel = $float * $num ;
			- echo "Hello {$name} <br> "; - This {} use for use Variable also html tag allows php like <br>
			- echo"Your pizaa is \${$float} " ; - use \ for use $ sign
			-
			- #### IMP
			- $_GET =    Data Is appended To the URL , Not SECURE , char Limit , Bookmark Is possible w/ value , Better for search page - Technically it array
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
		- ### Opraters
			- Arithmetic operators
				- $x = 1
				- $y = 2
				-
				- $z = $x + $y;  ans = 3
				- $z = $x - $y; ...
				- $z = $x * $y; ...
				- $z = $x / $y; ...
				- $z = $x ** $y; - varg ans = 1
				- $z = $x % $y - Give remaining values 10/ 2 = 0 no remain || 10/3 = 1 Remain
				-
			- Increment - Decrement Operators
				- $count = 0 ;
				-
				- $counter++ ;
				  id:: 66f09539-f4b0-418b-b4fd-b57a49706f40
				- $counter--;
				- $counter+=2 ; ans=0 , 2,4,....
				-
				- #### perenthisis
					- () > ** > * > / > % > + > -
					-
			- Logical op
				- && - True if both condition is Ture
				- || - True if at least One codition os ture
				- ! - Ture if flase and Flase if Ture
				- if - else statement
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
				- Loops -
					- For loop
					- ```php
					  <?php
					  
					      for ($i=0; $i < 5; $i++) { 
					          echo"Hello"
					      }
					  ?>
					  ```
					- While loop
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
						      $running = true
						  
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
					- Do while loop
					- Foreach loop
					- Array
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
			-
			- Maths Operations
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
				      //Srure
				      $total = sqrt($x);
				      // max funtion give maximum value
				      $total = max($x ,$y, $z);
				      // min funtion give minimun
				      $total = min($x, $y, $z);
				      // pi
				      $total = pi();
				      // rendom num
				      $total= rand(1, 100)
				      // 
				  
				  
				  
				      echo $total;
				  
				  
				  ?>
				  
				  // get Show in URL name and Possword so Use Post
				  ```
			- ### Funtions
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
			- ### String Methods
				- ```php
				  <?php 
				      
				      $name = "JamBUra";
				  
				      // lower string
				      $name = strtolower($name);
				      // upper case
				      $name = strtoupper($name);
				      //trim - Remove white space
				      $name = trim($name);
				      //pad sting whit certain amount careters
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
				      // exploding all car and canvert in array
				      $name = explode(" " , $name);
				      // change array to string
				      $name = implode(" " , $name);
				  
				      echo $name
				     
				  ?>
				  ```
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
				- include() - copies the content of a file (php/html/text) and inclued in PHP File.
				  collapsed:: true
					- use for Code resubility like header , Fotter
				- cookie() - Informstion about a user stored in a user's Web-browser.
				  collapsed:: true
					- ```php
					  <?php 
					      setcookie("fav_food", "Pizza", time() + (86400 * 2), "/"); //THis is one day *2 Now its 2 days "/" is file path
					      setcookie("fav_food", "Pizza", time() - 0, "/"); //THis is one day *2 Now its 2 days "/" is file path
					  ?>
					  ```
				- ### session
				  collapsed:: true
					- SGB used to store information on a user to be used across multiple pages.
					- A user is assigned a session-id
					- ex- login credentials
					- This is useful for pass data in global
				- ### Server
				  collapsed:: true
					- SGB That contains headers, paths, and script locations
					- THE entries in this array are created by the wev server.
					- $_SERVER - use this
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
			- MySQLi Extension
			  logseq.order-list-type:: number
			- PDO (PHP Data Objects )
			  logseq.order-list-type:: number
			- logseq.order-list-type:: number
- # Libs & Framework
-
- # More learn
	- [PHP Doc](https://www.php.net/docs.php)
	- [Beautiful Doc](https://devdocs.io/php/)
	- [Which PHP lib/framework are trending Now?](https://github.com/EvanLi/Github-Ranking/blob/master/Top100/ActionScript.md)
	-
	-