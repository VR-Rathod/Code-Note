---
seoTitle: ActionScript Programming Reference – Flash and AIR Developer Guide
description: "Comprehensive ActionScript 3.0 reference covering classes, event handling, display list, graphics, XML (E4X), and runtime scripting for Adobe Flash and AIR."
keywords: "ActionScript, AS3, Flash, Adobe AIR, event handling, display list, E4X, graphics, animation, script reference, cheat sheet, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: ActionScript
---

- # History
	- **How**:
		- **ActionScript** originated as a simple scripting language for Macromedia Flash (supporting basic play/stop actions). It evolved into a full-fledged Object-Oriented language based on the **ECMAScript** standard.
		- Key milestones:
			- **ActionScript 1.0 / 2.0**: Prototypes and basic class declarations.
			- **ActionScript 3.0 (AS3)**: Released in **2006** with Flash Player 9. AS3 was a major ground-up rewrite, introducing a high-performance virtual machine (**AVM2**), strict compiler typing, XML support (E4X), and a structured Event Dispatcher model.
		- Adobe acquired Macromedia in 2005. Following Flash Player's deprecation in 2020, ActionScript continues to live on through the open-source **Apache Flex** project and **HARMAN's Adobe AIR** runtime for building mobile and desktop apps.
	-
	- **Who**:
		- Developed by **Macromedia** (later **Adobe**), now maintained by **Apache** and **HARMAN**.
	-
	- **Why**:
		- Created to control vector animations, handle complex user interactions, process XML data feeds, and render real-time vector graphics on web browsers and standalone desktop/mobile applications.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Robust Event-Driven Model** — Unified EventDispatcher handles touch inputs, rendering loops, and network requests cleanly.
		- **Advanced Vector Graphics Rendering** — High-performance vector drawing APIs (lines, shapes, gradients) built natively into the runtime.
		- **E4X XML Parsing Integration** — Native XML handling makes parsing, filtering, and query operations on XML feeds exceptionally simple (treating XML like regular objects).
		- **AIR Runtime Cross-Platform** — Build native desktop (macOS, Windows) and mobile (iOS, Android) applications using a single codebase.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Deprecated Ecosystem** — Flash Player browser plugin is no longer supported, making web distribution impossible without third-party runtimes like Ruffle.
		- **Single-Threaded Execution** — Heavy computation freezes the user interface unless broken up using asynchronous timers or worker threads.
		- **Slow Performance for 3D** — Native Vector graphics render on CPU; advanced 3D requires using Stage3D APIs, which add code complexity.
	-
	- ## Remember Points
	  collapsed:: true
		- **AVM2 Engine** — AS3 runs on AVM2, which compiles code down to bytecode.
		- **The Display List** — Visual objects are only rendered on screen if they are explicitly added to the display hierarchy using `addChild()`.
		- **Packages and Filenames** — Class names must exactly match their file names, and they must be placed in matching directory package folders.
-
- # Basics
	- ## Hello World & trace Output
		- ```actionscript
		  package {
		      import flash.display.Sprite;
		      
		      public class HelloWorld extends Sprite {
		          public function HelloWorld() {
		              // trace sends text output to the debugging console
		              trace("Hello, World!");
		          }
		      }
		  }
		  ```
		- `package` defines the namespace namespace folder containing this class.
		- `extends Sprite` inherits visual display characteristics.
		- The function `public function HelloWorld()` is the constructor (executed upon instantiation).
	-
	- ## Variables and Primitive Data Types
		- ```actionscript
		  // Variables and Constants
		  var username:String = "VR Rathod";
		  const PI:Number = 3.14159;
		  
		  // Primitive Types:
		  var count:int = -10; -- Signed integer (32-bit)
		  var index:uint = 42; -- Unsigned integer (32-bit, recommended for colors/indices)
		  var ratio:Number = 0.75; -- Double-precision floating-point (default numeric type)
		  var isReady:Boolean = true;
		  
		  // Collections:
		  var list:Array = [1, "two", 3.0]; -- Heterogeneous untyped array
		  var vec:Vector.<int> = new Vector.<int>(); -- Strongly-typed dense array (much faster than Array)
		  vec.push(10, 20, 30);
		  ```
-
- # Object-Oriented Programming
	- ## Class Structure & Access Modifiers
	  collapsed:: true
		- ```actionscript
		  // File: com/app/User.as
		  package com.app {
		      public class User {
		          // Public properties (accessible everywhere)
		          public var username:String;
		          
		          // Protected properties (accessible in class and subclasses)
		          protected var score:int;
		          
		          // Private properties (accessible only inside this class)
		          private var _password:String;
		          
		          // Constructor
		          public function User(name:String, initialScore:int) {
		              this.username = name;
		              this.score = initialScore;
		          }
		          
		          // Getter and Setter
		          public function get password():String {
		              return _password;
		          }
		          
		          public function set password(value:String):void {
		              if (value.length >= 6) {
		                  _password = value;
		              }
		          }
		      }
		  }
		  ```
	-
	- ## Inheritance & Interfaces
	  collapsed:: true
		- ```actionscript
		  // Inherit class behavior using 'extends'
		  public class AdminUser extends User {
		      public function AdminUser(name:String) {
		          super(name, 1000); // Call parent constructor
		      }
		      
		      // Override methods explicitly using the 'override' keyword
		      override public function set password(value:String):void {
		          super.password = value + "_admin"; // call parent setter
		      }
		  }
		  ```
-
- # Event Handling
	- ## Event Dispatcher Model
	  collapsed:: true
		- ```actionscript
		  import flash.events.MouseEvent;
		  import flash.events.Event;
		  
		  // 1. Add event listener (syntax: target.addEventListener(type, listener_function))
		  myButton.addEventListener(MouseEvent.CLICK, onButtonClicked);
		  
		  // 2. Event Listener Callback
		  private function onButtonClicked(event:MouseEvent):void {
		      trace("Button clicked at x: " + event.localX);
		      
		      // Remove event listener to prevent memory leaks when no longer needed
		      myButton.removeEventListener(MouseEvent.CLICK, onButtonClicked);
		  }
		  ```
	-
	- ## Custom Events
	  collapsed:: true
		- ```actionscript
		  // Custom event declaration
		  import flash.events.Event;
		  
		  public class GameEvent extends Event {
		      public static const LEVEL_UP:String = "levelUp";
		      public var newLevel:int;
		      
		      public function GameEvent(type:String, level:int, bubbles:Boolean = false, cancelable:Boolean = false) {
		          super(type, bubbles, cancelable);
		          this.newLevel = level;
		      }
		      
		      // Overriding clone is required for custom events to work in bubble dispatching
		      override public function clone():Event {
		          return new GameEvent(type, newLevel, bubbles, cancelable);
		      }
		  }
		  
		  // Dispatching event:
		  // dispatchEvent(new GameEvent(GameEvent.LEVEL_UP, 5));
		  ```
-
- # Display List & Graphics
	- ## Display Objects Hierarchy
	  collapsed:: true
		- ```actionscript
		  import flash.display.Sprite;
		  import flash.text.TextField;
		  
		  var container:Sprite = new Sprite();
		  addChild(container); // Adds container to stage Display List
		  
		  var label:TextField = new TextField();
		  label.text = "Visual Element";
		  container.addChild(label); // Nested inside container
		  
		  // Access properties
		  container.x = 100;
		  container.y = 50;
		  container.alpha = 0.5; // transparency
		  ```
	-
	- ## Vector Graphics Drawing API
	  collapsed:: true
		- ```actionscript
		  import flash.display.Shape;
		  
		  var box:Shape = new Shape();
		  addChild(box);
		  
		  // Clear and draw vector shape
		  box.graphics.clear();
		  box.graphics.lineStyle(2, 0xFF0000); // 2px red outline
		  box.graphics.beginFill(0x0000FF);    // Blue fill
		  box.graphics.drawRect(0, 0, 100, 100); // draw 100x100 square
		  box.graphics.endFill();
		  ```
-
- # E4X (ECMAScript for XML)
	- ## XML Parsing and Navigation
	  collapsed:: true
		- ActionScript parses XML natively without using DOM nodes lookup.
		- ```actionscript
		  var menuXML:XML = 
		      <menu>
		          <item category="drink">
		              <name>Coffee</name>
		              <price>2.50</price>
		          </item>
		          <item category="food">
		              <name>Sandwich</name>
		              <price>5.99</price>
		          </item>
		      </menu>;
		      
		  // Accessing nodes using dot notation
		  trace(menuXML.item[0].name); // Coffee
		  
		  // Reading attributes using '@' character
		  trace(menuXML.item[1].@category); // food
		  
		  // Filtering nodes dynamically (XPath equivalent in E4X)
		  var cheapItems:XMLList = menuXML.item.(price < 3.00);
		  trace(cheapItems.name); // Coffee
		  ```
-
- # Memory Management
	- ## Weak References to prevent Leaks
	  collapsed:: true
		- Strong event listeners keep visual objects alive in memory, causing leaks:
		- ```actionscript
		  // Use 5th argument of addEventListener to establish a weak reference:
		  // addEventListener(type, listener, useCapture, priority, useWeakReference)
		  
		  stage.addEventListener(Event.ENTER_FRAME, onLoop, false, 0, true); // true = weak reference
		  // When this object is removed from display, GC can clean it up automatically
		  ```
-
- # Build Tools & Project Execution
	- ## Compilers
		- **mxmlc**: Adobe standard compiler for building `.swf` files.
		- **adt**: AIR Developer Tool for packaging apps for desktop/mobile (.exe, .dmg, .apk, .ipa).
		- ```bash
		  # Compile ActionScript file to SWF
		  mxmlc src/Main.as -o bin/Main.swf -compiler.source-path=src
		  
		  # Run AIR desktop debugging application
		  adl src/Main-app.xml
		  ```
-
- # More Learn
	- Explore valuable resources for ActionScript:
		-
		- [Adobe ActionScript 3.0 Reference](https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/)
		- [HARMAN Adobe AIR (Official Developer SDK Portal)](https://airsdk.harman.com/)
		- [OpenFL (Modern Haxe-based alternative to Flash)](https://www.openfl.org/)
		- [Starling Framework (GPU-accelerated 2D graphics)](http://gamua.com/starling/)
