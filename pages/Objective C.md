---
seoTitle: Objective-C Programming Reference – iOS and macOS Development Guide
description: "Comprehensive Objective-C reference covering messaging, classes, properties, memory management (ARC/MRC), protocols, categories, blocks, Grand Central Dispatch (GCD), and Cocoa design patterns."
keywords: "Objective-C, ObjC, Cocoa, Cocoa Touch, ARC, memory management, messaging, blocks, iOS development, macOS development, dynamic runtime, categories, protocols, syntax reference, cheat sheet, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Objective-C
---

- # History
	- **How**:
		- **Objective-C** was developed by **Brad Cox** and **Tom Love** in the early **1980s** at their company, Productivity Products International (PPI). Their goal was to add Smalltalk-style messaging and object-oriented programming structures to the C programming language.
		- In **1988**, **NeXT** (founded by Steve Jobs) licensed Objective-C and developed the NeXTSTEP environment, which laid the foundation for the standard Cocoa libraries (`Foundation` and `AppKit`).
		- When Apple acquired NeXT in **1996**, Objective-C became the primary programming language for OS X (now macOS) and later the iOS SDK for iPhones and iPads.
		- In **2014**, Apple introduced **Swift** as a modern successor, though Objective-C remains highly active in legacy codebases, systems programming, and interoperability.
	-
	- **Who**:
		- **Brad Cox** and **Tom Love** (creators), licensed and popularized by **NeXT** and **Apple**.
	-
	- **Why**:
		- Developed to bridge the raw execution efficiency of C with the dynamic design, clean modularity, and messaging capabilities of Smalltalk.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Full C/C++ Interoperability** — Objective-C is a strict superset of C. C and C++ code (via Objective-C++) can be compiled directly within ObjC files.
		- **Dynamic Runtime Messaging** — Message binding occurs at runtime rather than compile-time, enabling powerful reflection, method swizzling, and dynamic proxy behaviors.
		- **Nil Messaging Safety** — Sending messages to `nil` is safe and returns `nil` (or 0) without throwing exceptions, preventing a vast category of null pointer crashes.
		- **Proven Stability** — Backed by decades of production use on macOS and iOS, with highly optimized Cocoa libraries.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Verbose and Quirky Syntax** — The nested square bracket messaging syntax (`[[receiver alloc] init]`) and long method names can be hard to read for beginners.
		- **Lack of Modern Safety Features** — No built-in null-safety/optionals (added later as compiler annotations like `_Nullable`), namespaces, or strict value-type structures.
		- **Manual Pointer Overhead** — Everything is an object pointer (`NSObject *`), exposing developers to potential memory issues (retain cycles, weak dereferences).
	-
	- ## Remember Points
	  collapsed:: true
		- **Everything is a Pointer** — Objective-C object variables are always pointers (e.g., `NSString *name`, not `NSString name`).
		- **Square Brackets for Actions** — Operations on objects are done by sending messages inside square brackets: `[receiver message]`.
		- **Dynamic Binding** — The runtime evaluates the actual method implementation of a selector when the message is dispatched.
-
- # Basics
	- ## Hello World & Entry Point
		- ```objectivec
		  #import <Foundation/Foundation.h>
		  
		  int main(int argc, const char * argv[]) {
		      @autoreleasepool {
		          // NSLog prints output with date/time stamps and trailing newline
		          NSLog(@"Hello, World!");
		      }
		      return 0;
		  }
		  ```
		- `#import` automatically prevents duplicate headers (no need for C-style `#ifndef` guards).
		- `@autoreleasepool` establishes a block for tracking temporary objects released via autorelease pools.
		- `@""` declares an immutable constant `NSString` object literal.
	-
	- ## Comment Syntax
		- ```objectivec
		  // This is a single-line comment.
		  
		  /* This is a
		     multi-line comment block. */
		  ```
	-
	- ## Variables and String Literals
		- ```objectivec
		  // C Primitives (stored on stack)
		  int counter = 42;
		  double price = 19.99;
		  BOOL isActive = YES; // YES (1) or NO (0)
		  
		  // Objective-C Objects (stored on heap, always declared as pointers)
		  NSString *str = @"VR Rathod";
		  NSNumber *num = @100; -- Object literal wrapping an int
		  NSArray *array = @[@"red", @"green", @"blue"]; -- Array literal
		  NSDictionary *dict = @{@"key": @"value"}; -- Dictionary literal
		  ```
-
- # Messaging Paradigm
	- ## Dynamic Message Passing
	  collapsed:: true
		- In Objective-C, you do not call functions on objects; you **send messages** to them. The runtime decides which method implementation is executed.
		- ```objectivec
		  // C++ or Java style: receiver.doSomething(arg1, arg2);
		  // Objective-C style:
		  [receiver doSomethingWithArg1:val1 andArg2:val2];
		  
		  // Nested Messaging
		  // Allocates memory on heap, then initializes the object state
		  NSString *newString = [[NSString alloc] initWithFormat:@"Count: %d", 5];
		  ```
-
- # Classes: Interface vs. Implementation
	- ## The Interface (.h file)
	  collapsed:: true
		- Defines public fields, properties, and method declarations:
		- ```objectivec
		  // Person.h
		  #import <Foundation/Foundation.h>
		  
		  @interface Person : NSObject
		  
		  // Public Properties
		  @property (nonatomic, copy) NSString *name;
		  @property (nonatomic, assign) NSInteger age;
		  
		  // Method Declarations
		  - (instancetype)initWithName:(NSString *)name age:(NSInteger)age;
		  - (void)displayInfo;
		  
		  @end
		  ```
	-
	- ## The Implementation (.m file)
	  collapsed:: true
		- Implements the methods declared in the interface:
		- ```objectivec
		  // Person.m
		  #import "Person.h"
		  
		  @implementation Person
		  
		  // Custom Constructor
		  - (instancetype)initWithName:(NSString *)name age:(NSInteger)age {
		      self = [super init]; // Initialize parent class
		      if (self) {
		          _name = [name copy]; // Backing instance variable access
		          _age = age;
		      }
		      return self;
		  }
		  
		  - (void)displayInfo {
		      NSLog(@"Name: %@, Age: %ld", self.name, (long)self.age);
		  }
		  
		  @end
		  ```
-
- # Properties & Attributes
	- ## Property Attributes
	  collapsed:: true
		- Property attributes dictate thread safety, memory ownership, and accessibility characteristics:
		- ```objectivec
		  // 1. Thread Safety (atomic vs nonatomic)
		  // atomic (Default) - Safely locks getters/setters (slower execution)
		  // nonatomic        - Not thread-safe, but executes much faster (highly recommended for UI elements)
		  @property (nonatomic) int count;
		  
		  // 2. Memory Ownership (strong, weak, assign, copy)
		  // strong (ARC default) - Increases retain reference count, keeping object alive
		  // weak                 - Does not increase reference count. Set to nil if target is garbage collected (prevents dangling pointers)
		  // assign               - Simple value copy (used for C primitives)
		  // copy                 - Duplicates the object (highly recommended for immutable classes like NSString, NSArray)
		  @property (nonatomic, strong) MyModel *model;
		  @property (nonatomic, weak) id delegate;
		  @property (nonatomic, copy) NSString *title;
		  
		  // 3. Read/Write Permissions (readwrite vs readonly)
		  @property (nonatomic, readonly) NSString *identifier;
		  ```
-
- # Methods: Instance vs. Class
	- ## Declarations and Scope
	  collapsed:: true
		- ```objectivec
		  // Instance Methods (-)
		  // Must be executed on a constructed instance of the class
		  - (void)calculateTotals;
		  
		  // Class Methods (+)
		  // Executed directly on the class interface namespace (factory/helper methods)
		  + (instancetype)personWithName:(NSString *)name;
		  
		  // Usage:
		  // Person *p = [Person personWithName:@"Alice"]; -- Class method
		  // [p calculateTotals];                          -- Instance method
		  ```
-
- # Memory Management
	- ## Manual Reference Counting (MRC)
	  collapsed:: true
		- ```objectivec
		  // In classic Objective-C, developers manually balanced reference counts:
		  // retain     - Increments reference count (+1)
		  // release    - Decrements reference count (-1), deallocates if count reaches 0
		  // autorelease - Schedules decrement release to happen later (at end of pool)
		  
		  Person *p = [[Person alloc] init]; // Ref count = 1
		  [p retain];                        // Ref count = 2
		  [p release];                       // Ref count = 1
		  [p release];                       // Ref count = 0 (Deallocated)
		  ```
	-
	- ## Automatic Reference Counting (ARC)
	  collapsed:: true
		- ```objectivec
		  // Modern ObjC uses ARC: the compiler automatically inserts retain/release calls at compile-time
		  // Developers do not call [p release] manually.
		  
		  // Retain Cycles (Strong Reference Cycles)
		  // Two objects retaining strong references to each other will leak memory:
		  // Object A (strong) -> Object B
		  // Object B (strong) -> Object A
		  
		  // Fix: Declare parent references as strong, and child/delegates as weak:
		  @property (nonatomic, weak) ParentClass *parent;
		  ```
-
- # Categories & Extensions
	- ## Categories
	  collapsed:: true
		- Categories allow adding new methods to existing classes without subclassing them:
		- ```objectivec
		  // NSString+Crypto.h
		  #import <Foundation/Foundation.h>
		  
		  @interface NSString (Crypto)
		  - (NSString *)sha256Hash;
		  @end
		  
		  // Usage:
		  // NSString *h = [@"secret" sha256Hash];
		  ```
	-
	- ## Class Extensions (Anonymous Categories)
	  collapsed:: true
		- ```objectivec
		  // Declared at the top of .m files. Enables private properties/methods
		  @interface Person ()
		  @property (nonatomic, strong) NSString *privateToken; -- Private property
		  - (void)executeSecretRoutine; -- Private method
		  @end
		  ```
-
- # Protocols (Interfaces)
	- ## Declaring & Implementing Protocols
	  collapsed:: true
		- Protocols define interface blueprints that classes can implement:
		- ```objectivec
		  // Custom Protocol
		  @protocol DownloadDelegate <NSObject>
		  @required
		  - (void)downloadDidFinish:(NSString *)filePath;
		  
		  @optional
		  - (void)downloadDidFailWithError:(NSError *)error;
		  @end
		  
		  // Implementing class declaration:
		  @interface Downloader : NSObject
		  @property (nonatomic, weak) id<DownloadDelegate> delegate; -- Protocol delegate
		  @end
		  ```
-
- # Blocks (Closures)
	- ## Declarations and execution
	  collapsed:: true
		- ```objectivec
		  // Declaring a block variable:
		  // return_type (^block_name)(parameter_types)
		  
		  int (^multiplier)(int, int) = ^(int a, int b) {
		      return a * b;
		  };
		  
		  NSLog(@"Result: %d", multiplier(3, 4)); // 12
		  
		  // block typedef for parameters:
		  typedef void (^CompletionHandler)(BOOL success);
		  
		  // Block memory capture (use __block to allow modifications inside block)
		  __block int counter = 0;
		  void (^increment)(void) = ^{
		      counter++; // Allowed due to __block
		  };
		  ```
-
- # Error Handling
	- ## Cocoa Error Pattern (NSError)
	  collapsed:: true
		- Objective-C reserves exceptions for critical crashes. Business errors pass an `NSError` pointer by reference:
		- ```objectivec
		  - (BOOL)saveData:(NSData *)data error:(NSError **)error {
		      if (/* failed */) {
		          if (error) {
		              // Initialize the pointer target
		              *error = [NSError errorWithDomain:@"com.app.error"
		                                           code:500
		                                       userInfo:@{NSLocalizedDescriptionKey: @"Save failed"}];
		          }
		          return NO;
		        }
		        return YES;
		  }
		  
		  // Usage:
		  NSError *saveError = nil;
		  BOOL success = [self saveData:my_data error:&saveError];
		  if (!success) {
		      NSLog(@"Error: %@", saveError.localizedDescription);
		  }
		  ```
-
- # Key-Value Coding (KVC) & Key-Value Observing (KVO)
	- ## Key-Value Coding
	  collapsed:: true
		- ```objectivec
		  // KVC allows accessing properties dynamically by using string key paths
		  Person *p = [[Person alloc] init];
		  [p setValue:@"Alice" forKey:@"name"]; -- Sets name = "Alice"
		  NSString *n = [p valueForKey:@"name"]; -- Gets n = "Alice"
		  ```
	-
	- ## Key-Value Observing
	  collapsed:: true
		- ```objectivec
		  // KVO enables objects to observe property updates of other instances
		  [p addObserver:self
		      forKeyPath:@"age"
		         options:NSKeyValueObservingOptionNew
		         context:nil];
		  
		  // Observer Callback:
		  - (void)observeValueForKeyPath:(NSString *)keyPath
		                        ofObject:(id)object
		                          change:(NSDictionary<NSKeyValueChangeKey,id> *)change
		                         context:(void *)context {
		      if ([keyPath isEqualToString:@"age"]) {
		          NSLog(@"Age updated to: %@", change[NSKeyValueChangeNewKey]);
		      }
		  }
		  ```
-
- # Grand Central Dispatch (GCD)
	- ## Async and Sync Queues
	  collapsed:: true
		- ```objectivec
		  // 1. Run tasks in background concurrent queue
		  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
		      // Heavy background execution logic
		      
		      // 2. Return to Main Queue to update user interface safely
		      dispatch_async(dispatch_get_main_queue(), ^{
		          self.statusLabel.text = @"Execution Complete";
		      });
		  });
		  
		  // 3. Thread-Safe Singleton instantiation using dispatch_once
		  + (instancetype)sharedInstance {
		      static MyManager *shared = nil;
		      static dispatch_once_t onceToken;
		      dispatch_once(&onceToken, ^{
		          shared = [[MyManager alloc] init];
		      });
		      return shared;
		  }
		  ```
-
- # Runtime & Reflection
	- ## Selectors and Class Checking
	  collapsed:: true
		- ```objectivec
		  // Selector (SEL) - represents the name of a method at runtime
		  SEL action = @selector(displayInfo);
		  
		  Person *p = [[Person alloc] init];
		  
		  // Dynamic verification
		  if ([p respondsToSelector:action]) {
		      [p performSelector:action]; // Invokes displayInfo dynamically
		  }
		  
		  // Protocol conformation check
		  if ([p conformsToProtocol:@protocol(DownloadDelegate)]) {
		      NSLog(@"Conforms");
		  }
		  ```
-
- # Useful Classes Reference
	- ## Foundation Classes
		- ```
		  Class           Description
		  NSObject        Base class of virtually all Objective-C class hierarchies
		  NSString        Immutable unicode character strings (using literal @"")
		  NSMutableString Mutable string variable (supports appendString)
		  NSArray         Immutable array of object references
		  NSMutableArray  Mutable collection array (supports addObject, removeObject)
		  NSDictionary    Immutable associative key-value map
		  NSMutableDict   Mutable map collection (supports setObject:forKey:)
		  NSNumber        Object wrapper for primitive numeric values (int, float, etc.)
		  NSDate          Handles time points, durations, and calculations
		  NSError         Encapsulates detailed application/system failure states
		  ```
-
- # More Learn
	- Explore valuable resources for Objective-C:
		-
		- [Apple Developer Documentation](https://developer.apple.com/documentation/)
		- [Objective-C Programming (Big Nerd Ranch)](https://bignerdranch.com/books/objective-c-programming/)
		- [Objc.io (Advanced architecture articles)](https://www.objc.io/)
		- [Ry’s Objective-C Tutorial](https://github.com/salmer/Rys-Objective-C-Tutorial)
