---
seoTitle: GDScript Reference – Complete In-Depth GDScript Language Guide
description: "Complete GDScript language reference for Godot 4 — variables, types, functions, OOP, signals, coroutines, lambdas, annotations, pattern matching, and advanced scripting patterns."
keywords: "GDScript, GDScript tutorial, GDScript reference, Godot scripting, GDScript OOP, GDScript signals, GDScript coroutines, GDScript lambdas, GDScript annotations, Godot 4 scripting, gdscript guide, gdscript cheatsheet, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: GDScript
treeTitle: Game Development - Engines - Godot GDScript
---

- # History
- **How**: GDScript was created specifically for the Godot Engine, first appearing around **2010** during Godot's internal development at OKAM Studio.
- **Who**: Designed by **Juan Linietsky** and the Godot core team.
- **Why**: To provide a tightly integrated, Python-inspired scripting language that compiles fast, has zero external dependencies, and maps directly to Godot's node/scene architecture — unlike Lua or Python which would require heavy bridging.
-
- # Introduction
  collapsed:: true
	- GDScript is a **dynamically-typed, optionally statically-typed** scripting language built into Godot. It compiles to bytecode at runtime, supports full OOP, signals, coroutines, lambdas, and first-class integration with every Godot API.
	- In Godot 4, GDScript received a major overhaul: typed arrays, lambdas, improved type inference, `await`, and much better performance.
	-
	- ## Advantages
	  collapsed:: true
		- Zero setup — built into Godot, no external interpreter needed.
		- Python-like syntax — readable, minimal boilerplate.
		- Deep engine integration — signals, nodes, resources are first-class.
		- Optional static typing for performance and safety.
		- Hot-reload scripts without restarting the game.
	-
	- ## Disadvantages
	  collapsed:: true
		- Not a general-purpose language — only runs inside Godot.
		- Slower than C++ or C# for CPU-heavy logic.
		- Smaller ecosystem than Python (no pip packages).
		- Dynamic typing by default can hide bugs if you skip type hints.
-
- # Basics
	- ## Hello World & Script Structure
		- ```gdscript
		  extends Node  # every script extends a Godot class
		  
		  func _ready() -> void:
		      print("Hello, World!")
		  ```
		- `extends` — declares which Godot class this script inherits.
		- `_ready()` — called once when the node enters the scene tree.
		- `print()` — outputs to the Godot Output panel.
	-
	- ## Comments
		- ```gdscript
		  # Single line comment
		  
		  ## Doc comment — shown in editor tooltip for exported vars/functions
		  ## @param amount  The damage value
		  ## @return        Remaining health
		  func take_damage(amount: int) -> int:
		      health -= amount
		      return health
		  ```
	-
	- ## Variables & Constants
		- ```gdscript
		  # Dynamic typing (inferred)
		  var health = 100
		  var name = "Player"
		  var speed = 3.14
		  var is_alive = true
		  
		  # Static typing (recommended — better performance + editor autocomplete)
		  var health: int = 100
		  var name: String = "Player"
		  var speed: float = 3.14
		  var is_alive: bool = true
		  
		  # Type inference with :=
		  var score := 0          # inferred as int
		  var label := $Label     # inferred as Label node type
		  
		  # Constants (compile-time, cannot be changed)
		  const MAX_HEALTH: int = 200
		  const GRAVITY: float = 980.0
		  const GAME_TITLE := "My Game"
		  ```
	-
	- ## Data Types Table
		- ```
		  Type        Description                         Example
		  null        No value                            null
		  bool        true / false                        var x: bool = true
		  int         64-bit integer                      var x: int = 42
		  float       64-bit double precision             var x: float = 3.14
		  String      UTF-32 text                         var x: String = "hi"
		  StringName  Hashed string (fast comparison)     var x: StringName = &"idle"
		  NodePath    Path to a node                      var x: NodePath = ^"Player/Sprite"
		  Vector2     2D vector (x, y)                    var x: Vector2 = Vector2(1, 0)
		  Vector2i    2D integer vector                   var x: Vector2i = Vector2i(3, 4)
		  Vector3     3D vector (x, y, z)                 var x: Vector3 = Vector3.UP
		  Vector3i    3D integer vector                   var x: Vector3i = Vector3i(1,2,3)
		  Vector4     4D vector                           var x: Vector4 = Vector4(1,2,3,4)
		  Color       RGBA color (0.0–1.0)                var x: Color = Color.RED
		  Rect2       2D rectangle (position + size)      var x: Rect2 = Rect2(0,0,100,50)
		  Rect2i      Integer rectangle                   var x: Rect2i = Rect2i(0,0,10,5)
		  Transform2D 2D transform matrix                 var x: Transform2D
		  Transform3D 3D transform matrix                 var x: Transform3D
		  Basis       3x3 rotation/scale matrix           var x: Basis
		  Quaternion  Rotation quaternion                 var x: Quaternion
		  Plane       3D plane (normal + distance)        var x: Plane
		  AABB        Axis-aligned bounding box           var x: AABB
		  Array       Dynamic typed array                 var x: Array = [1, "a", true]
		  Array[T]    Typed array (Godot 4)               var x: Array[int] = [1, 2, 3]
		  Dictionary  Key-value map                       var x: Dictionary = {"a": 1}
		  Callable    Reference to a function             var x: Callable = func(): pass
		  Signal      Signal reference                    var x: Signal
		  PackedArray Packed typed arrays (fast)          PackedInt32Array, PackedFloat32Array...
		  Object      Base of all Godot objects           var x: Object
		  ```
	-
	- ## Type Casting
		- ```gdscript
		  # as — safe cast, returns null if it fails
		  var node = get_node("Player") as CharacterBody2D
		  if node:
		      node.velocity = Vector2.ZERO
		  
		  # int(), float(), str(), bool() — explicit conversion
		  var n: int = int(3.99)        # 3
		  var f: float = float(5)       # 5.0
		  var s: String = str(42)       # "42"
		  var b: bool = bool(0)         # false
		  
		  # is — type check
		  if node is RigidBody2D:
		      print("it's a rigidbody")
		  ```
	-
	- ## Operators
	  collapsed:: true
		- ```gdscript
		  # Arithmetic
		  +  -  *  /  %        # add, sub, mul, div, modulo
		  **                   # power (2 ** 8 = 256)
		  
		  # Integer division
		  var result = 7 / 2   # 3 (int division when both are int)
		  var result = 7.0 / 2 # 3.5 (float division)
		  
		  # Relational
		  ==  !=  <  >  <=  >=
		  
		  # Logical
		  and  or  not   # (also: && || ! work too)
		  
		  # Bitwise
		  &   |   ^   ~   <<   >>
		  
		  # Assignment
		  =  +=  -=  *=  /=  %=  **=  &=  |=  ^=  <<=  >>=
		  
		  # Ternary (inline if)
		  var label = "Adult" if age >= 18 else "Minor"
		  
		  # in — membership test
		  if "sword" in inventory:
		      print("has sword")
		  
		  if 3 in [1, 2, 3, 4]:
		      print("found")
		  ```
	-
	- ## String Operations
	  collapsed:: true
		- ```gdscript
		  var s: String = "Hello, World!"
		  
		  # Basic
		  print(s.length())           # 13
		  print(s.to_upper())         # HELLO, WORLD!
		  print(s.to_lower())         # hello, world!
		  print(s.strip_edges())      # trim whitespace
		  print(s.reverse())          # !dlroW ,olleH
		  
		  # Substring & search
		  print(s.substr(7, 5))       # World
		  print(s.find("World"))      # 7  (-1 if not found)
		  print(s.contains("Hello"))  # true
		  print(s.begins_with("He"))  # true
		  print(s.ends_with("!"))     # true
		  
		  # Replace & split
		  print(s.replace("World", "Godot"))  # Hello, Godot!
		  var parts = "a,b,c".split(",")       # ["a", "b", "c"]
		  var joined = ",".join(["a","b","c"]) # "a,b,c"
		  
		  # Format strings
		  var msg = "HP: %d / %d" % [health, max_health]
		  var msg2 = "Pos: (%.2f, %.2f)" % [pos.x, pos.y]
		  
		  # String interpolation (Godot 4.3+)
		  # Not yet native — use % or str() for now
		  
		  # Convert
		  var n = int("42")           # 42
		  var f = float("3.14")       # 3.14
		  var b = "true".to_lower() == "true"
		  
		  # Multiline string
		  var text = """
		  Line one
		  Line two
		  Line three
		  """
		  ```
- # Control Flow
  collapsed:: true
	- ## if / elif / else
	  collapsed:: true
		- ```gdscript
		  var score = 85
		  
		  if score >= 90:
		      print("A")
		  elif score >= 80:
		      print("B")
		  elif score >= 70:
		      print("C")
		  else:
		      print("F")
		  # Output: B
		  
		  # Inline ternary
		  var grade = "Pass" if score >= 50 else "Fail"
		  ```
	-
	- ## match (Pattern Matching)
	  collapsed:: true
		- ```gdscript
		  # match is GDScript's switch — but more powerful
		  var state = "run"
		  
		  match state:
		      "idle":
		          play_animation("idle")
		      "run", "walk":          # multiple values
		          play_animation("run")
		      "jump":
		          play_animation("jump")
		      _:                      # default (wildcard)
		          play_animation("idle")
		  
		  # Match with type check
		  match typeof(value):
		      TYPE_INT:    print("integer")
		      TYPE_STRING: print("string")
		      TYPE_ARRAY:  print("array")
		  
		  # Match with binding (capture matched value)
		  match point:
		      Vector2(0, 0):
		          print("origin")
		      Vector2(var x, 0):
		          print("on x-axis at ", x)
		      Vector2(var x, var y):
		          print("at ", x, ", ", y)
		  
		  # Match with guard condition (when)
		  match health:
		      var h when h > 75: print("Healthy")
		      var h when h > 25: print("Hurt")
		      _:                 print("Critical")
		  ```
	-
	- ## for Loops
	  collapsed:: true
		- ```gdscript
		  # Range loop
		  for i in range(5):
		      print(i)   # 0 1 2 3 4
		  
		  for i in range(2, 10, 2):
		      print(i)   # 2 4 6 8
		  
		  for i in range(10, 0, -1):
		      print(i)   # 10 9 8 ... 1
		  
		  # Iterate array
		  var items = ["sword", "shield", "potion"]
		  for item in items:
		      print(item)
		  
		  # Iterate dictionary
		  var stats = {"hp": 100, "mp": 50, "atk": 30}
		  for key in stats:
		      print(key, ": ", stats[key])
		  
		  # Iterate with index (no enumerate, use range)
		  for i in range(items.size()):
		      print(i, ": ", items[i])
		  
		  # Nested loop with break/continue
		  for i in range(5):
		      if i == 2:
		          continue   # skip 2
		      if i == 4:
		          break      # stop at 4
		      print(i)       # 0 1 3
		  ```
	-
	- ## while Loop
	  collapsed:: true
		- ```gdscript
		  var i = 0
		  while i < 5:
		      print(i)
		      i += 1
		  
		  # Infinite loop with break
		  while true:
		      if condition:
		          break
		  ```
-
- # Functions
  collapsed:: true
	- ## Declaration & Calling
	  collapsed:: true
		- ```gdscript
		  # Basic function
		  func greet(name: String) -> String:
		      return "Hello, " + name
		  
		  # Void function (no return value)
		  func reset() -> void:
		      health = 100
		      position = Vector2.ZERO
		  
		  # Default arguments
		  func spawn(x: float = 0.0, y: float = 0.0, scene: String = "Player") -> void:
		      position = Vector2(x, y)
		  
		  # Calling
		  print(greet("Godot"))   # Hello, Godot
		  spawn()                 # uses defaults
		  spawn(100.0, 200.0)     # override x and y
		  ```
	-
	- ## Return Multiple Values
	  collapsed:: true
		- ```gdscript
		  # GDScript doesn't have tuples — use Array or Dictionary
		  func get_stats() -> Array:
		      return [health, mana, stamina]
		  
		  var stats = get_stats()
		  print(stats[0])  # health
		  
		  # Or use Dictionary for named returns
		  func get_player_info() -> Dictionary:
		      return {"name": player_name, "level": level, "hp": health}
		  
		  var info = get_player_info()
		  print(info["name"])
		  ```
	-
	- ## Variadic-style with Array
	  collapsed:: true
		- ```gdscript
		  # GDScript has no *args — use Array parameter
		  func sum(values: Array[int]) -> int:
		      var total := 0
		      for v in values:
		          total += v
		      return total
		  
		  print(sum([1, 2, 3, 4, 5]))  # 15
		  ```
	-
	- ## Lambdas (Anonymous Functions)
	  collapsed:: true
		- ```gdscript
		  # Lambda syntax (Godot 4)
		  var add = func(a: int, b: int) -> int: return a + b
		  print(add.call(3, 4))   # 7
		  
		  # Multiline lambda
		  var process = func(x: int) -> int:
		      var result = x * 2
		      return result + 1
		  
		  print(process.call(5))  # 11
		  
		  # Lambda as Callable — used with signals, timers, etc.
		  button.pressed.connect(func(): print("clicked"))
		  
		  # Capture outer variables (closures)
		  var multiplier = 3
		  var scale_fn = func(x: int) -> int: return x * multiplier
		  print(scale_fn.call(5))  # 15
		  
		  # Sort with lambda
		  var nums = [3, 1, 4, 1, 5, 9]
		  nums.sort_custom(func(a, b): return a > b)  # descending
		  print(nums)  # [9, 5, 4, 3, 1, 1]
		  ```
	-
	- ## Callable
	  collapsed:: true
		- ```gdscript
		  # Callable wraps any function reference
		  var fn: Callable = greet          # method reference
		  print(fn.call("World"))           # Hello, World
		  
		  # Callable.bind() — pre-bind arguments
		  var greet_alice = greet.bind("Alice")
		  greet_alice.call()                # Hello, Alice
		  
		  # Callable.bindv() — bind array of args
		  var fn2 = add.bindv([10, 20])
		  fn2.call()                        # 30
		  
		  # is_valid() — check if callable is valid
		  if fn.is_valid():
		      fn.call("test")
		  
		  # call_deferred() — call on next frame
		  fn.call_deferred("deferred")
		  ```
	-
	- ## Coroutines & await
	  collapsed:: true
		- ```gdscript
		  # await pauses execution until a signal fires or coroutine completes
		  
		  # Wait for signal
		  func _ready() -> void:
		      await $AnimationPlayer.animation_finished
		      print("animation done")
		  
		  # Wait for timer
		  func delayed_spawn() -> void:
		      await get_tree().create_timer(2.0).timeout
		      spawn_enemy()
		  
		  # Wait for next frame
		  await get_tree().process_frame
		  
		  # Wait for physics frame
		  await get_tree().physics_frame
		  
		  # Await a coroutine (another func that uses await)
		  func fade_out() -> void:
		      var tween = create_tween()
		      tween.tween_property(self, "modulate:a", 0.0, 1.0)
		      await tween.finished
		  
		  func die() -> void:
		      await fade_out()
		      queue_free()
		  
		  # Return value from coroutine
		  func load_data() -> Dictionary:
		      await get_tree().create_timer(0.5).timeout
		      return {"loaded": true}
		  
		  func _ready() -> void:
		      var data = await load_data()
		      print(data["loaded"])  # true
		  ```
-
- # Arrays
  collapsed:: true
	- ## Array Basics
	  collapsed:: true
		- ```gdscript
		  # Untyped array
		  var arr = [1, "hello", true, Vector2(1, 0)]
		  
		  # Typed array (Godot 4 — recommended)
		  var nums: Array[int] = [10, 20, 30, 40, 50]
		  var names: Array[String] = ["Alice", "Bob", "Charlie"]
		  
		  # Access
		  print(nums[0])       # 10
		  print(nums[-1])      # 50 (last element)
		  
		  # Size
		  print(nums.size())   # 5
		  print(nums.is_empty()) # false
		  ```
	-
	- ## Array Methods
	  collapsed:: true
		- ```gdscript
		  var arr: Array[int] = [3, 1, 4, 1, 5, 9, 2, 6]
		  
		  # Add / Remove
		  arr.append(7)              # add to end
		  arr.push_back(8)           # same as append
		  arr.push_front(0)          # add to front
		  arr.insert(2, 99)          # insert at index 2
		  arr.pop_back()             # remove & return last
		  arr.pop_front()            # remove & return first
		  arr.remove_at(3)           # remove at index
		  arr.erase(1)               # remove first occurrence of value
		  arr.clear()                # remove all
		  
		  # Search
		  print(arr.find(5))         # index of 5 (-1 if not found)
		  print(arr.has(9))          # true
		  print(arr.count(1))        # count occurrences of 1
		  
		  # Sort
		  arr.sort()                 # ascending in-place
		  arr.sort_custom(func(a, b): return a > b)  # descending
		  arr.reverse()              # reverse in-place
		  arr.shuffle()              # random order
		  
		  # Slice & copy
		  var slice = arr.slice(1, 4)   # elements [1..3]
		  var copy = arr.duplicate()    # shallow copy
		  var deep = arr.duplicate(true) # deep copy
		  
		  # Functional
		  var doubled = arr.map(func(x): return x * 2)
		  var evens = arr.filter(func(x): return x % 2 == 0)
		  var total = arr.reduce(func(acc, x): return acc + x, 0)
		  var any_big = arr.any(func(x): return x > 8)
		  var all_pos = arr.all(func(x): return x > 0)
		  ```
	-
	- ## Packed Arrays (Performance)
	  collapsed:: true
		- ```gdscript
		  # Packed arrays store data contiguously — much faster for large data
		  var bytes: PackedByteArray = PackedByteArray([0, 128, 255])
		  var ints: PackedInt32Array = PackedInt32Array([1, 2, 3])
		  var floats: PackedFloat32Array = PackedFloat32Array([1.0, 2.0, 3.0])
		  var strings: PackedStringArray = PackedStringArray(["a", "b", "c"])
		  var vec2s: PackedVector2Array = PackedVector2Array([Vector2(0,0), Vector2(1,1)])
		  var vec3s: PackedVector3Array = PackedVector3Array([Vector3.ZERO, Vector3.UP])
		  var colors: PackedColorArray = PackedColorArray([Color.RED, Color.BLUE])
		  
		  # Same API as Array: append, size, [], etc.
		  bytes.append(64)
		  print(bytes.size())
		  ```
-
- # Dictionaries
  collapsed:: true
	- ## Dictionary Basics
	  collapsed:: true
		- ```gdscript
		  # Create
		  var stats: Dictionary = {
		      "hp": 100,
		      "mp": 50,
		      "atk": 30,
		      "def": 20
		  }
		  
		  # Access
		  print(stats["hp"])          # 100
		  print(stats.get("mp"))      # 50
		  print(stats.get("spd", 0))  # 0 (default if key missing)
		  
		  # Modify
		  stats["hp"] = 80
		  stats["spd"] = 15           # add new key
		  stats.erase("def")          # remove key
		  
		  # Check
		  print(stats.has("atk"))     # true
		  print(stats.is_empty())     # false
		  print(stats.size())         # 4
		  
		  # Iterate
		  for key in stats:
		      print(key, " = ", stats[key])
		  
		  for key in stats.keys():
		      print(key)
		  
		  for value in stats.values():
		      print(value)
		  
		  # Merge
		  var extra = {"luck": 5, "spd": 20}
		  stats.merge(extra)           # adds keys, skips existing
		  stats.merge(extra, true)     # adds keys, overwrites existing
		  
		  # Copy
		  var copy = stats.duplicate()
		  var deep = stats.duplicate(true)
		  ```
-
- # OOP — Classes & Objects
  collapsed:: true
	- ## Script as Class
	  collapsed:: true
		- ```gdscript
		  # player.gd
		  extends CharacterBody2D
		  
		  class_name Player  # registers globally — usable from any script
		  
		  # Member variables
		  var health: int = 100
		  var max_health: int = 100
		  var speed: float = 200.0
		  
		  # Called when node enters scene
		  func _ready() -> void:
		      print("Player ready!")
		  
		  func take_damage(amount: int) -> void:
		      health = max(0, health - amount)
		      if health == 0:
		          die()
		  
		  func heal(amount: int) -> void:
		      health = min(max_health, health + amount)
		  
		  func die() -> void:
		      queue_free()
		  ```
	-
	- ## Constructor (_init)
	  collapsed:: true
		- ```gdscript
		  class_name Item
		  extends Resource
		  
		  var item_name: String
		  var damage: int
		  var rarity: String
		  
		  func _init(n: String, dmg: int, r: String = "common") -> void:
		      item_name = n
		      damage = dmg
		      rarity = r
		  
		  # Create instances
		  var sword = Item.new("Iron Sword", 25)
		  var bow = Item.new("Elven Bow", 40, "rare")
		  print(sword.item_name)  # Iron Sword
		  ```
	-
	- ## Inner Classes
	  collapsed:: true
		- ```gdscript
		  class_name Inventory
		  extends Node
		  
		  class Slot:
		      var item_name: String
		      var quantity: int
		  
		      func _init(name: String, qty: int) -> void:
		          item_name = name
		          quantity = qty
		  
		      func to_string() -> String:
		          return "%s x%d" % [item_name, quantity]
		  
		  var slots: Array[Slot] = []
		  
		  func add(name: String, qty: int) -> void:
		      slots.append(Slot.new(name, qty))
		  
		  func print_all() -> void:
		      for slot in slots:
		          print(slot.to_string())
		  ```
	-
	- ## Inheritance & super
	  collapsed:: true
		- ```gdscript
		  # Base class — enemy.gd
		  class_name Enemy
		  extends CharacterBody2D
		  
		  var health: int = 50
		  var speed: float = 100.0
		  
		  func _ready() -> void:
		      print("Enemy spawned")
		  
		  func take_damage(amount: int) -> void:
		      health -= amount
		      if health <= 0:
		          die()
		  
		  func die() -> void:
		      queue_free()
		  
		  # Derived class — boss.gd
		  class_name Boss
		  extends Enemy
		  
		  var phase: int = 1
		  var shield: int = 50
		  
		  func _ready() -> void:
		      super._ready()           # call parent _ready
		      health = 500
		      speed = 60.0
		      print("Boss spawned")
		  
		  func take_damage(amount: int) -> void:
		      if shield > 0:
		          shield -= amount
		          return
		      super.take_damage(amount) # call parent take_damage
		      if health < 250 and phase == 1:
		          phase = 2
		          speed = 120.0
		  ```
	-
	- ## Static Methods & Variables
	  collapsed:: true
		- ```gdscript
		  class_name MathUtils
		  extends Object
		  
		  # Static variable — shared across all instances
		  static var instance_count: int = 0
		  
		  func _init() -> void:
		      MathUtils.instance_count += 1
		  
		  # Static method — called on class, not instance
		  static func clamp_angle(angle: float) -> float:
		      return fmod(angle, TAU)
		  
		  static func lerp_color(a: Color, b: Color, t: float) -> Color:
		      return a.lerp(b, t)
		  
		  # Call without instance
		  var angle = MathUtils.clamp_angle(7.5)
		  print(MathUtils.instance_count)
		  ```
	-
	- ## _to_string
	  collapsed:: true
		- ```gdscript
		  class_name Vector2Custom
		  
		  var x: float
		  var y: float
		  
		  func _init(px: float, py: float) -> void:
		      x = px
		      y = py
		  
		  func _to_string() -> String:
		      return "Vector2Custom(%.2f, %.2f)" % [x, y]
		  
		  var v = Vector2Custom.new(1.5, 2.7)
		  print(v)  # Vector2Custom(1.50, 2.70)
		  ```
- # Signals
  collapsed:: true
	- ## Define & Emit
	  collapsed:: true
		- ```gdscript
		  extends Node
		  
		  # Define signals
		  signal health_changed(new_health: int, max_health: int)
		  signal player_died
		  signal item_collected(item_name: String, value: int)
		  
		  var health: int = 100
		  var max_health: int = 100
		  
		  func take_damage(amount: int) -> void:
		      health = max(0, health - amount)
		      health_changed.emit(health, max_health)  # emit with args
		      if health == 0:
		          player_died.emit()
		  
		  func collect(item: String, val: int) -> void:
		      item_collected.emit(item, val)
		  ```
	-
	- ## Connect & Disconnect
	  collapsed:: true
		- ```gdscript
		  # Connect in code
		  func _ready() -> void:
		      health_changed.connect(_on_health_changed)
		      player_died.connect(_on_player_died)
		  
		      # Connect with lambda
		      item_collected.connect(func(name, val):
		          print("Collected: ", name, " worth ", val)
		      )
		  
		      # Connect one-shot (auto-disconnects after first emit)
		      player_died.connect(_on_player_died, CONNECT_ONE_SHOT)
		  
		      # Connect deferred (fires on next frame, safe for scene changes)
		      player_died.connect(_on_player_died, CONNECT_DEFERRED)
		  
		  func _on_health_changed(new_hp: int, max_hp: int) -> void:
		      $HealthBar.value = float(new_hp) / max_hp * 100
		  
		  func _on_player_died() -> void:
		      get_tree().reload_current_scene()
		  
		  # Disconnect
		  health_changed.disconnect(_on_health_changed)
		  
		  # Check if connected
		  if health_changed.is_connected(_on_health_changed):
		      health_changed.disconnect(_on_health_changed)
		  ```
	-
	- ## Signal as Variable & Await
	  collapsed:: true
		- ```gdscript
		  # Signals are first-class — store and pass them
		  func wait_for_signal(sig: Signal) -> void:
		      await sig
		      print("signal fired!")
		  
		  # Await a signal inline
		  func _ready() -> void:
		      await player_died
		      print("player is dead")
		  
		  # Await with timeout pattern
		  func wait_or_timeout(sig: Signal, timeout: float) -> bool:
		      var timer = get_tree().create_timer(timeout)
		      var result = await Engine.get_main_loop().create_signal_awaiter([sig, timer.timeout])
		      return result == sig
		  ```
	-
	- ## Connect in Editor
		- In the editor: select a node → **Node panel** (right side) → **Signals tab** → double-click a signal → choose target node and method.
		- Editor connections are stored in the `.tscn` file and auto-connected at runtime.
-
- # Annotations
  collapsed:: true
	- ## @export
	  collapsed:: true
		- ```gdscript
		  extends Node
		  
		  # Basic exports — visible and editable in Inspector
		  @export var speed: float = 200.0
		  @export var health: int = 100
		  @export var player_name: String = "Hero"
		  @export var is_active: bool = true
		  
		  # Export with range slider
		  @export_range(0.0, 100.0) var volume: float = 50.0
		  @export_range(1, 10, 1) var level: int = 1
		  @export_range(0.0, 1.0, 0.01, "or_greater") var opacity: float = 1.0
		  
		  # Export enum (dropdown in Inspector)
		  @export_enum("Idle", "Run", "Attack", "Die") var state: int = 0
		  
		  # Export flags (bitmask checkboxes)
		  @export_flags("Fire", "Water", "Earth", "Air") var elements: int = 0
		  
		  # Export file path
		  @export_file("*.png") var icon_path: String = ""
		  @export_dir var save_dir: String = ""
		  
		  # Export node reference
		  @export var target: Node
		  @export var spawn_point: Node2D
		  
		  # Export resource types
		  @export var texture: Texture2D
		  @export var audio: AudioStream
		  @export var scene: PackedScene
		  
		  # Export color (with/without alpha)
		  @export var tint: Color = Color.WHITE
		  @export_color_no_alpha var bg_color: Color = Color.BLACK
		  
		  # Export typed array
		  @export var waypoints: Array[Vector2] = []
		  @export var enemy_scenes: Array[PackedScene] = []
		  
		  # Export group (organizes Inspector)
		  @export_group("Combat Stats")
		  @export var attack: int = 10
		  @export var defense: int = 5
		  @export_group("")  # end group
		  
		  # Export subgroup
		  @export_subgroup("Speed Settings")
		  @export var walk_speed: float = 100.0
		  @export var run_speed: float = 200.0
		  ```
	-
	- ## @onready
	  collapsed:: true
		- ```gdscript
		  extends Node
		  
		  # @onready — assigns value when _ready() is called
		  # Equivalent to: var label; func _ready(): label = $Label
		  
		  @onready var label: Label = $Label
		  @onready var sprite: Sprite2D = $Sprite2D
		  @onready var anim: AnimationPlayer = $AnimationPlayer
		  @onready var timer: Timer = $Timer
		  
		  # With type inference
		  @onready var health_bar := $UI/HealthBar
		  @onready var player := $Player as CharacterBody2D
		  
		  # Safe to use in _ready and all later callbacks
		  func _ready() -> void:
		      label.text = "Ready!"
		      anim.play("idle")
		  ```
	-
	- ## @tool
	  collapsed:: true
		- ```gdscript
		  @tool  # script runs in the editor, not just at runtime
		  extends Node2D
		  
		  @export var radius: float = 50.0:
		      set(value):
		          radius = value
		          queue_redraw()  # redraw when changed in editor
		  
		  func _draw() -> void:
		      draw_circle(Vector2.ZERO, radius, Color(1, 0, 0, 0.3))
		  
		  # Use case: custom editor gizmos, procedural generation previews,
		  # level design helpers, auto-configuration scripts
		  ```
	-
	- ## @static_unload
	  collapsed:: true
		- ```gdscript
		  # Prevents the script's static data from persisting between scene changes
		  @static_unload
		  
		  class_name LevelData
		  extends Node
		  
		  static var cached_map: Dictionary = {}
		  ```
	-
	- ## @warning_ignore
	  collapsed:: true
		- ```gdscript
		  # Suppress specific GDScript warnings
		  @warning_ignore("return_value_discarded")
		  func fire() -> void:
		      shoot_bullet()  # return value intentionally ignored
		  
		  @warning_ignore("unused_variable")
		  var debug_counter: int = 0
		  ```
-
- # Properties (Getters & Setters)
  collapsed:: true
	- ## get / set
	  collapsed:: true
		- ```gdscript
		  extends Node
		  
		  var _health: int = 100  # backing variable (convention: _ prefix)
		  
		  var health: int:
		      get:
		          return _health
		      set(value):
		          _health = clamp(value, 0, max_health)
		          health_changed.emit(_health)
		  
		  var max_health: int = 100
		  signal health_changed(new_hp: int)
		  
		  # Usage — looks like a normal variable
		  health = 150   # clamped to 100 automatically
		  health -= 30   # triggers setter → emits signal
		  print(health)  # calls getter → 70
		  
		  # Read-only property
		  var is_dead: bool:
		      get: return _health <= 0
		  
		  # Computed property
		  var health_percent: float:
		      get: return float(_health) / max_health
		  ```
-
- # Enums
  collapsed:: true
	- ## Basic Enum
	  collapsed:: true
		- ```gdscript
		  # Anonymous enum (global constants in this script)
		  enum { IDLE, RUN, JUMP, ATTACK, DIE }
		  
		  var state = IDLE
		  
		  # Named enum (accessed as Type.VALUE)
		  enum State { IDLE, RUN, JUMP, ATTACK, DIE }
		  enum Direction { NORTH = 0, EAST = 90, SOUTH = 180, WEST = 270 }
		  
		  var current_state: State = State.IDLE
		  var facing: Direction = Direction.NORTH
		  
		  # Use in match
		  match current_state:
		      State.IDLE:   play_animation("idle")
		      State.RUN:    play_animation("run")
		      State.JUMP:   play_animation("jump")
		      _:            play_animation("idle")
		  
		  # Enum as dictionary
		  print(State.keys())    # ["IDLE", "RUN", "JUMP", "ATTACK", "DIE"]
		  print(State.values())  # [0, 1, 2, 3, 4]
		  print(State.find_key(2))  # "JUMP"
		  
		  # Export enum to Inspector
		  @export var player_state: State = State.IDLE
		  ```
-
- # Built-in Math & Utility Functions
  collapsed:: true
	- ## Math Functions
	  collapsed:: true
		- ```gdscript
		  # Basic
		  abs(-5)              # 5
		  sign(-3.0)           # -1.0
		  pow(2, 8)            # 256.0
		  sqrt(16.0)           # 4.0
		  floor(3.7)           # 3.0
		  ceil(3.2)            # 4.0
		  round(3.5)           # 4.0
		  
		  # Clamp & range
		  clamp(15, 0, 10)     # 10
		  clamp(value, min_val, max_val)
		  
		  # Interpolation
		  lerp(0.0, 100.0, 0.5)          # 50.0
		  lerp_angle(0.0, PI, 0.5)       # PI/2
		  inverse_lerp(0.0, 100.0, 25.0) # 0.25
		  remap(25.0, 0.0, 100.0, 0.0, 1.0)  # 0.25
		  
		  # Smooth step
		  smoothstep(0.0, 1.0, 0.5)  # 0.5 (smooth S-curve)
		  
		  # Move toward (no overshoot)
		  move_toward(current, target, step)
		  
		  # Trigonometry
		  sin(PI / 2)    # 1.0
		  cos(0.0)       # 1.0
		  tan(PI / 4)    # ~1.0
		  asin(1.0)      # PI/2
		  acos(1.0)      # 0.0
		  atan2(1.0, 1.0) # PI/4
		  deg_to_rad(180.0)  # PI
		  rad_to_deg(PI)     # 180.0
		  
		  # Min / Max
		  min(3, 7)      # 3
		  max(3, 7)      # 7
		  mini(3, 7)     # 3 (integer version)
		  maxf(3.0, 7.0) # 7.0 (float version)
		  
		  # Modulo (always positive result)
		  fmod(7.5, 3.0)   # 1.5
		  posmod(7, 3)     # 1
		  fposmod(-1.0, 3.0) # 2.0 (positive modulo)
		  
		  # Constants
		  PI      # 3.14159...
		  TAU     # 6.28318... (2 * PI)
		  INF     # infinity
		  NAN     # not a number
		  ```
	-
	- ## Random Functions
	  collapsed:: true
		- ```gdscript
		  # Seed (for reproducible results)
		  seed(12345)
		  randomize()  # seed from time (call once in _ready)
		  
		  # Random float [0.0, 1.0)
		  var r = randf()
		  
		  # Random float in range
		  var r = randf_range(0.5, 2.0)
		  
		  # Random int in range [from, to] inclusive
		  var r = randi_range(1, 6)   # dice roll
		  
		  # Random int (full range)
		  var r = randi()
		  
		  # RandomNumberGenerator (independent seed)
		  var rng = RandomNumberGenerator.new()
		  rng.seed = 42
		  print(rng.randf_range(0.0, 1.0))
		  print(rng.randi_range(1, 100))
		  ```
	-
	- ## Type Checking Utilities
	  collapsed:: true
		- ```gdscript
		  typeof(42)          # TYPE_INT
		  typeof("hello")     # TYPE_STRING
		  typeof([1,2,3])     # TYPE_ARRAY
		  typeof(null)        # TYPE_NIL
		  
		  is_instance_valid(node)   # true if node exists and not freed
		  is_nan(value)             # true if NaN
		  is_inf(value)             # true if infinite
		  is_zero_approx(0.0001)    # false
		  is_equal_approx(a, b)     # float equality with epsilon
		  ```
-
- # Node Utilities
  collapsed:: true
	- ## Node References
	  collapsed:: true
		- ```gdscript
		  # $ shorthand — get child node by name
		  $Sprite2D
		  $UI/HealthBar          # nested path
		  $"My Node"             # name with spaces
		  
		  # get_node — explicit
		  get_node("Sprite2D")
		  get_node("UI/HealthBar")
		  get_node(^"Sprite2D")  # NodePath literal
		  
		  # get_node_or_null — safe (returns null if not found)
		  var node = get_node_or_null("MaybeNode")
		  if node:
		      node.do_something()
		  
		  # find_child — search recursively by name
		  var btn = find_child("StartButton", true, false)
		  
		  # get_parent / get_children
		  var parent = get_parent()
		  var children = get_children()
		  
		  # Traverse tree
		  for child in get_children():
		      if child is Sprite2D:
		          child.visible = false
		  ```
	-
	- ## Node Lifecycle
	  collapsed:: true
		- ```gdscript
		  # Add / remove nodes at runtime
		  var bullet = bullet_scene.instantiate()
		  add_child(bullet)                    # add as child
		  add_child(bullet, true)              # add with readable name
		  get_parent().add_child(bullet)       # add as sibling
		  get_tree().root.add_child(bullet)    # add to scene root
		  
		  # Remove
		  node.queue_free()    # safe removal (end of frame)
		  node.free()          # immediate removal (use carefully)
		  remove_child(node)   # detach without freeing
		  
		  # Reparent
		  node.reparent(new_parent)
		  
		  # Duplicate
		  var clone = node.duplicate()
		  add_child(clone)
		  ```
	-
	- ## Groups
	  collapsed:: true
		- ```gdscript
		  # Add to group (editor: Node → Groups tab, or code)
		  add_to_group("enemies")
		  add_to_group("collectibles")
		  
		  # Check
		  is_in_group("enemies")
		  
		  # Remove
		  remove_from_group("enemies")
		  
		  # Call method on all in group
		  get_tree().call_group("enemies", "freeze")
		  get_tree().call_group_flags(SceneTree.GROUP_CALL_DEFERRED, "enemies", "die")
		  
		  # Get all nodes in group
		  var enemies: Array[Node] = get_tree().get_nodes_in_group("enemies")
		  for enemy in enemies:
		      enemy.take_damage(10)
		  ```
-
- # Advanced Patterns
  collapsed:: true
	- ## Autoload Singleton Pattern
	  collapsed:: true
		- ```gdscript
		  # game_manager.gd — registered as Autoload in Project Settings
		  extends Node
		  
		  signal score_changed(new_score: int)
		  signal game_over
		  
		  var score: int = 0
		  var lives: int = 3
		  var high_score: int = 0
		  
		  func add_score(points: int) -> void:
		      score += points
		      if score > high_score:
		          high_score = score
		      score_changed.emit(score)
		  
		  func lose_life() -> void:
		      lives -= 1
		      if lives <= 0:
		          game_over.emit()
		  
		  func reset() -> void:
		      score = 0
		      lives = 3
		  
		  # Access from anywhere:
		  # GameManager.add_score(100)
		  # GameManager.score_changed.connect(...)
		  ```
	-
	- ## State Machine Pattern
	  collapsed:: true
		- ```gdscript
		  extends CharacterBody2D
		  
		  enum State { IDLE, RUN, JUMP, ATTACK, HURT, DEAD }
		  
		  var state: State = State.IDLE
		  
		  func _physics_process(delta: float) -> void:
		      match state:
		          State.IDLE:   _state_idle(delta)
		          State.RUN:    _state_run(delta)
		          State.JUMP:   _state_jump(delta)
		          State.ATTACK: _state_attack(delta)
		          State.HURT:   _state_hurt(delta)
		          State.DEAD:   _state_dead(delta)
		  
		  func _change_state(new_state: State) -> void:
		      if state == new_state:
		          return
		      _exit_state(state)
		      state = new_state
		      _enter_state(state)
		  
		  func _enter_state(s: State) -> void:
		      match s:
		          State.IDLE:   $AnimationPlayer.play("idle")
		          State.RUN:    $AnimationPlayer.play("run")
		          State.JUMP:   $AnimationPlayer.play("jump")
		          State.ATTACK: $AnimationPlayer.play("attack")
		  
		  func _exit_state(_s: State) -> void:
		      pass  # cleanup if needed
		  
		  func _state_idle(_delta: float) -> void:
		      if Input.get_axis("move_left", "move_right") != 0:
		          _change_state(State.RUN)
		      if Input.is_action_just_pressed("jump"):
		          _change_state(State.JUMP)
		  
		  func _state_run(delta: float) -> void:
		      var dir = Input.get_axis("move_left", "move_right")
		      velocity.x = dir * 200.0
		      if dir == 0:
		          _change_state(State.IDLE)
		      move_and_slide()
		  
		  func _state_jump(delta: float) -> void:
		      if not is_on_floor():
		          velocity.y += 980.0 * delta
		      else:
		          _change_state(State.IDLE)
		      move_and_slide()
		  
		  func _state_attack(_delta: float) -> void:
		      pass  # handled by animation signal
		  
		  func _state_hurt(_delta: float) -> void:
		      pass
		  
		  func _state_dead(_delta: float) -> void:
		      pass
		  ```
	-
	- ## Observer Pattern via Signals
	  collapsed:: true
		- ```gdscript
		  # event_bus.gd — Autoload singleton as global event bus
		  extends Node
		  
		  signal enemy_killed(enemy_type: String, position: Vector2)
		  signal item_picked_up(item_id: int, player_id: int)
		  signal level_completed(level: int, time: float)
		  
		  # Any script can emit:
		  # EventBus.enemy_killed.emit("goblin", global_position)
		  
		  # Any script can listen:
		  # EventBus.enemy_killed.connect(_on_enemy_killed)
		  ```
	-
	- ## Resource as Data Object
	  collapsed:: true
		- ```gdscript
		  # item_data.gd
		  class_name ItemData
		  extends Resource
		  
		  @export var item_name: String = ""
		  @export var description: String = ""
		  @export var damage: int = 0
		  @export var defense: int = 0
		  @export var value: int = 0
		  @export var icon: Texture2D
		  @export_enum("Weapon", "Armor", "Consumable", "Quest") var item_type: int = 0
		  
		  func get_tooltip() -> String:
		      return "%s\n%s\nValue: %d gold" % [item_name, description, value]
		  
		  # Create in editor: right-click FileSystem → New Resource → ItemData
		  # Or in code:
		  # var sword = ItemData.new()
		  # sword.item_name = "Iron Sword"
		  # ResourceSaver.save(sword, "res://data/items/iron_sword.tres")
		  ```
	-
	- ## Object Pooling
	  collapsed:: true
		- ```gdscript
		  # object_pool.gd — reuse objects instead of instantiate/free
		  class_name ObjectPool
		  extends Node
		  
		  @export var scene: PackedScene
		  @export var pool_size: int = 20
		  
		  var _pool: Array[Node] = []
		  
		  func _ready() -> void:
		      for i in pool_size:
		          var obj = scene.instantiate()
		          obj.visible = false
		          obj.process_mode = Node.PROCESS_MODE_DISABLED
		          add_child(obj)
		          _pool.append(obj)
		  
		  func get_object() -> Node:
		      for obj in _pool:
		          if not obj.visible:
		              obj.visible = true
		              obj.process_mode = Node.PROCESS_MODE_INHERIT
		              return obj
		      # Pool exhausted — optionally grow
		      var obj = scene.instantiate()
		      add_child(obj)
		      _pool.append(obj)
		      return obj
		  
		  func return_object(obj: Node) -> void:
		      obj.visible = false
		      obj.process_mode = Node.PROCESS_MODE_DISABLED
		  ```
-
- # More Learn
	- Explore the following links for valuable resources, communities, and tools to enhance your skills : -
		- [GDScript Reference (Official)](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html)
		- [GDScript Style Guide](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_styleguide.html)
		- [Godot API Docs](https://docs.godotengine.org/en/stable/classes/index.html)
		- [GDScript — Advanced Topics](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/index.html)