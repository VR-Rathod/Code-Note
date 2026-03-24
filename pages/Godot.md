# History
- **How**: Developed by **Juan Linietsky** and **Ariel Manzur**, first released publicly in **2014** as open-source.
- **Who**: Maintained by the Godot Engine community and the Godot Foundation.
- **Why**: To provide a fully free, open-source game engine with no royalties, no vendor lock-in, and a clean scene-based architecture.
-
- # Introduction
  collapsed:: true
	- Godot is a feature-rich, cross-platform game engine for 2D and 3D games. It uses a unique **scene/node system**, supports **GDScript** (Python-like), **C#**, and **C++** (via GDExtension), and exports to Windows, Linux, macOS, Android, iOS, and Web.
	-
	- ## Advantages
	  collapsed:: true
		- Fully open-source and free — no royalties, no subscription.
		- Lightweight editor (~100MB), fast iteration.
		- Unified 2D and 3D workflows in one engine.
		- GDScript is beginner-friendly and tightly integrated.
		- Active community, frequent releases (Godot 4.x is a major leap).
	-
	- ## Disadvantages
	  collapsed:: true
		- Smaller ecosystem than Unity/Unreal (fewer ready-made assets).
		- C# support in Godot 4 is still maturing (.NET 6+).
		- 3D rendering less mature than Unreal Engine for AAA-level visuals.
-
- # Editor & Project Setup
  collapsed:: true
	- ## Editor Layout
	  collapsed:: true
		- **Scene Panel** (left) — tree of all nodes in the current scene.
		- **Viewport** (center) — visual editor for 2D/3D.
		- **Inspector** (right) — properties of the selected node.
		- **FileSystem** (bottom-left) — project files.
		- **Output / Debugger** (bottom) — logs, errors, profiler.
	-
	- ## Key Shortcuts
	  collapsed:: true
		- ```
		  F5          Run project
		  F6          Run current scene
		  Ctrl+S      Save scene
		  Ctrl+N      New scene
		  Ctrl+Z      Undo
		  Q / W / E   Select / Move / Rotate tool (3D)
		  ```
	-
	- ## Project Structure
	  collapsed:: true
		- ```
		  res://              Root of project (all assets here)
		  res://scenes/       Scene files (.tscn)
		  res://scripts/      GDScript files (.gd)
		  res://assets/       Textures, audio, models
		  res://addons/       Plugins and extensions
		  project.godot       Project config file
		  ```
-
- # Scene & Node System
  collapsed:: true
	- ## Core Concept
	  collapsed:: true
		- Everything in Godot is a **Node**. A **Scene** is a tree of nodes saved as a `.tscn` file.
		- Scenes can be **instanced** inside other scenes — this is the primary composition pattern.
		- ```
		  Node (root)
		  ├── Sprite2D
		  ├── CollisionShape2D
		  └── AudioStreamPlayer
		  ```
	-
	- ## Common Node Types
	  collapsed:: true
		- ```
		  Node2D          Base for all 2D nodes (has position, rotation, scale)
		  Sprite2D        Displays a texture in 2D
		  AnimatedSprite2D  Sprite with frame animation
		  CollisionShape2D  Defines collision area shape
		  Area2D          Detects overlaps (no physics response)
		  CharacterBody2D  Kinematic body for player/enemies
		  RigidBody2D     Physics-simulated body
		  StaticBody2D    Immovable physics body (walls, floors)
		  Camera2D        2D camera with follow/zoom
		  Label           UI text
		  Button          UI button
		  CanvasLayer     UI layer (always on top of game world)
		  ```
	-
	- ## 3D Node Types
	  collapsed:: true
		- ```
		  Node3D          Base for all 3D nodes
		  MeshInstance3D  Renders a 3D mesh
		  CollisionShape3D  3D collision shape
		  CharacterBody3D  3D kinematic body
		  RigidBody3D     3D physics body
		  Camera3D        3D camera
		  DirectionalLight3D  Sun-like light
		  OmniLight3D     Point light (all directions)
		  SpotLight3D     Cone-shaped spotlight
		  WorldEnvironment  Sky, ambient light, fog, tone mapping
		  ```
	-
	- ## Instancing Scenes
	  collapsed:: true
		- ```gdscript
		  # In editor: drag .tscn into scene tree
		  # In code:
		  var bullet_scene = preload("res://scenes/Bullet.tscn")
		  
		  func shoot():
		      var bullet = bullet_scene.instantiate()
		      bullet.position = $Muzzle.global_position
		      get_parent().add_child(bullet)
		  ```
-
- # GDScript — Basics
  collapsed:: true
	- ## Variables & Types
	  collapsed:: true
		- ```gdscript
		  # Dynamic typing (default)
		  var health = 100
		  var name = "Player"
		  var speed = 3.14
		  var is_alive = true
		  
		  # Static typing (recommended for performance + safety)
		  var health: int = 100
		  var name: String = "Player"
		  var speed: float = 3.14
		  var is_alive: bool = true
		  
		  # Constants
		  const MAX_HEALTH: int = 200
		  const GRAVITY: float = 9.8
		  
		  # Typed arrays
		  var items: Array[String] = ["sword", "shield"]
		  var scores: Array[int] = [10, 20, 30]
		  ```
	-
	- ## Functions
	  collapsed:: true
		- ```gdscript
		  func greet(name: String) -> String:
		      return "Hello, " + name
		  
		  func add(a: int, b: int) -> int:
		      return a + b
		  
		  # Default arguments
		  func spawn(x: float = 0.0, y: float = 0.0) -> void:
		      position = Vector2(x, y)
		  
		  # Calling
		  print(greet("Godot"))   # Hello, Godot
		  print(add(3, 4))        # 7
		  ```
	-
	- ## Control Flow
	  collapsed:: true
		- ```gdscript
		  # if / elif / else
		  if health > 50:
		      print("Healthy")
		  elif health > 0:
		      print("Hurt")
		  else:
		      print("Dead")
		  
		  # match (like switch)
		  match state:
		      "idle":   play_animation("idle")
		      "run":    play_animation("run")
		      "jump":   play_animation("jump")
		      _:        play_animation("idle")  # default
		  
		  # for loop
		  for i in range(5):
		      print(i)   # 0 1 2 3 4
		  
		  for item in items:
		      print(item)
		  
		  # while loop
		  while health > 0:
		      health -= 10
		  ```
	-
	- ## Built-in Types
	  collapsed:: true
		- ```gdscript
		  # Vector2 / Vector3
		  var pos = Vector2(100, 200)
		  var dir = Vector3(0, 1, 0)
		  pos += Vector2(10, 0)
		  print(pos.length())          # magnitude
		  print(pos.normalized())      # unit vector
		  print(Vector2.UP)            # (0, -1)
		  
		  # Color
		  var red = Color(1, 0, 0, 1)  # RGBA 0-1
		  var blue = Color.BLUE
		  
		  # Rect2
		  var rect = Rect2(Vector2(0,0), Vector2(100, 50))
		  print(rect.has_point(Vector2(50, 25)))  # true
		  
		  # Transform2D / Transform3D
		  var t = Transform2D()
		  t = t.translated(Vector2(10, 0))
		  ```
-
- # GDScript — OOP & Classes
  collapsed:: true
	- ## Classes & extends
	  collapsed:: true
		- ```gdscript
		  # Every script implicitly extends a Node type
		  extends CharacterBody2D
		  
		  class_name Player  # registers as a global class
		  
		  var health: int = 100
		  var speed: float = 200.0
		  
		  func _ready() -> void:
		      print("Player ready!")
		  
		  func take_damage(amount: int) -> void:
		      health -= amount
		      if health <= 0:
		          die()
		  
		  func die() -> void:
		      queue_free()  # removes node from scene
		  ```
	-
	- ## Inner Classes
	  collapsed:: true
		- ```gdscript
		  class_name Inventory
		  
		  class Item:
		      var name: String
		      var value: int
		  
		      func _init(n: String, v: int) -> void:
		          name = n
		          value = v
		  
		  var items: Array[Item] = []
		  
		  func add_item(n: String, v: int) -> void:
		      items.append(Item.new(n, v))
		  ```
	-
	- ## Inheritance
	  collapsed:: true
		- ```gdscript
		  # Base class
		  class_name Enemy
		  extends CharacterBody2D
		  
		  var health: int = 50
		  
		  func take_damage(amount: int) -> void:
		      health -= amount
		  
		  # Derived class
		  class_name Boss
		  extends Enemy
		  
		  var phase: int = 1
		  
		  func take_damage(amount: int) -> void:
		      super.take_damage(amount / 2)  # call parent method
		      if health < 25:
		          phase = 2
		  ```
	-
	- ## Signals (Observer Pattern)
	  collapsed:: true
		- ```gdscript
		  # Define signal
		  signal health_changed(new_health: int)
		  signal player_died
		  
		  # Emit signal
		  func take_damage(amount: int) -> void:
		      health -= amount
		      health_changed.emit(health)
		      if health <= 0:
		          player_died.emit()
		  
		  # Connect in code
		  func _ready() -> void:
		      health_changed.connect(_on_health_changed)
		      player_died.connect(_on_player_died)
		  
		  func _on_health_changed(new_health: int) -> void:
		      $HealthBar.value = new_health
		  
		  func _on_player_died() -> void:
		      get_tree().reload_current_scene()
		  
		  # Connect in editor: Node panel → Signals tab → connect to method
		  ```
-
- # Core Lifecycle Methods
  collapsed:: true
	- ## Built-in Callbacks
	  collapsed:: true
		- ```gdscript
		  extends Node
		  
		  func _init() -> void:
		      # Called when object is created (before added to scene)
		      pass
		  
		  func _ready() -> void:
		      # Called once when node enters the scene tree
		      # All children are ready at this point
		      pass
		  
		  func _process(delta: float) -> void:
		      # Called every frame (tied to FPS)
		      # delta = time since last frame in seconds
		      position.x += speed * delta
		  
		  func _physics_process(delta: float) -> void:
		      # Called every physics tick (default 60/s, fixed timestep)
		      # Use for movement, physics, collision
		      move_and_slide()
		  
		  func _input(event: InputEvent) -> void:
		      # Called for every input event
		      if event is InputEventKey:
		          print(event.keycode)
		  
		  func _unhandled_input(event: InputEvent) -> void:
		      # Called if no other node consumed the input
		      pass
		  
		  func _notification(what: int) -> void:
		      # Low-level lifecycle notifications
		      if what == NOTIFICATION_WM_CLOSE_REQUEST:
		          get_tree().quit()
		  
		  func _exit_tree() -> void:
		      # Called when node is removed from scene tree
		      pass
		  ```
	-
	- ## delta Time Pattern
	  collapsed:: true
		- ```gdscript
		  # Always multiply movement by delta for frame-rate independence
		  func _process(delta: float) -> void:
		      position += velocity * delta
		      # Without delta: moves 200px per frame (FPS-dependent)
		      # With delta:    moves 200px per second (FPS-independent)
		  ```
-
- # Input System
  collapsed:: true
	- ## Input Actions (Project Settings → Input Map)
	  collapsed:: true
		- ```gdscript
		  # Check action state
		  func _process(delta: float) -> void:
		      if Input.is_action_pressed("move_right"):
		          velocity.x = speed
		      elif Input.is_action_pressed("move_left"):
		          velocity.x = -speed
		      else:
		          velocity.x = 0
		  
		      if Input.is_action_just_pressed("jump"):
		          jump()
		  
		      if Input.is_action_just_released("attack"):
		          end_attack()
		  
		  # Get axis (returns -1, 0, or 1)
		  var h = Input.get_axis("move_left", "move_right")
		  var v = Input.get_axis("move_up", "move_down")
		  var dir = Vector2(h, v).normalized()
		  ```
	-
	- ## Mouse Input
	  collapsed:: true
		- ```gdscript
		  func _input(event: InputEvent) -> void:
		      if event is InputEventMouseButton:
		          if event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		              print("Left click at: ", event.position)
		  
		      if event is InputEventMouseMotion:
		          print("Mouse moved: ", event.relative)
		  
		  # Get mouse position
		  var mouse_pos = get_global_mouse_position()
		  ```
	-
	- ## Gamepad Input
	  collapsed:: true
		- ```gdscript
		  # Axis (joystick)
		  var h = Input.get_joy_axis(0, JOY_AXIS_LEFT_X)
		  var v = Input.get_joy_axis(0, JOY_AXIS_LEFT_Y)
		  
		  # Button
		  if Input.is_joy_button_pressed(0, JOY_BUTTON_A):
		      jump()
		  ```
-
- # 2D Game Development
  collapsed:: true
	- ## CharacterBody2D — Player Movement
	  collapsed:: true
		- ```gdscript
		  extends CharacterBody2D
		  
		  const SPEED = 200.0
		  const JUMP_VELOCITY = -400.0
		  const GRAVITY = 980.0
		  
		  func _physics_process(delta: float) -> void:
		      # Apply gravity
		      if not is_on_floor():
		          velocity.y += GRAVITY * delta
		  
		      # Horizontal movement
		      var direction = Input.get_axis("move_left", "move_right")
		      velocity.x = direction * SPEED
		  
		      # Jump
		      if Input.is_action_just_pressed("jump") and is_on_floor():
		          velocity.y = JUMP_VELOCITY
		  
		      move_and_slide()  # handles collision automatically
		  ```
	-
	- ## Area2D — Overlap Detection
	  collapsed:: true
		- ```gdscript
		  extends Area2D
		  
		  func _ready() -> void:
		      body_entered.connect(_on_body_entered)
		      area_entered.connect(_on_area_entered)
		  
		  func _on_body_entered(body: Node2D) -> void:
		      if body.is_in_group("player"):
		          body.take_damage(10)
		          queue_free()
		  
		  func _on_area_entered(area: Area2D) -> void:
		      print("Area overlap: ", area.name)
		  ```
	-
	- ## Sprite2D & AnimatedSprite2D
	  collapsed:: true
		- ```gdscript
		  # Sprite2D — single texture
		  $Sprite2D.texture = preload("res://assets/player.png")
		  $Sprite2D.flip_h = true   # mirror horizontally
		  
		  # AnimatedSprite2D — frame-based animation
		  # Set up SpriteFrames resource in editor, then:
		  $AnimatedSprite2D.play("run")
		  $AnimatedSprite2D.stop()
		  $AnimatedSprite2D.animation = "idle"
		  $AnimatedSprite2D.frame = 0
		  
		  # Connect animation_finished signal
		  $AnimatedSprite2D.animation_finished.connect(_on_anim_done)
		  ```
	-
	- ## TileMap — Level Design
	  collapsed:: true
		- ```gdscript
		  # TileMap node with TileSet resource
		  # In editor: paint tiles, set collision layers
		  
		  # In code: read/write tiles
		  var tilemap = $TileMap
		  var cell = tilemap.get_cell_source_id(0, Vector2i(5, 3))
		  tilemap.set_cell(0, Vector2i(5, 3), 1, Vector2i(0, 0))
		  
		  # Convert world position to tile coords
		  var tile_pos = tilemap.local_to_map(player.position)
		  ```
-
- # 3D Game Development
  collapsed:: true
	- ## CharacterBody3D — 3D Player Movement
	  collapsed:: true
		- ```gdscript
		  extends CharacterBody3D
		  
		  const SPEED = 5.0
		  const JUMP_VELOCITY = 4.5
		  var gravity = ProjectSettings.get_setting("physics/3d/default_gravity")
		  
		  func _physics_process(delta: float) -> void:
		      if not is_on_floor():
		          velocity.y -= gravity * delta
		  
		      if Input.is_action_just_pressed("jump") and is_on_floor():
		          velocity.y = JUMP_VELOCITY
		  
		      var input_dir = Input.get_vector("move_left", "move_right", "move_forward", "move_back")
		      var direction = (transform.basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()
		  
		      if direction:
		          velocity.x = direction.x * SPEED
		          velocity.z = direction.z * SPEED
		      else:
		          velocity.x = move_toward(velocity.x, 0, SPEED)
		          velocity.z = move_toward(velocity.z, 0, SPEED)
		  
		      move_and_slide()
		  ```
	-
	- ## Camera3D — First Person Look
	  collapsed:: true
		- ```gdscript
		  extends Node3D
		  
		  @export var sensitivity: float = 0.003
		  @onready var camera = $Camera3D
		  
		  func _ready() -> void:
		      Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)
		  
		  func _unhandled_input(event: InputEvent) -> void:
		      if event is InputEventMouseMotion:
		          rotate_y(-event.relative.x * sensitivity)
		          camera.rotate_x(-event.relative.y * sensitivity)
		          camera.rotation.x = clamp(camera.rotation.x, -PI/2, PI/2)
		  ```
	-
	- ## MeshInstance3D & Materials
	  collapsed:: true
		- ```gdscript
		  # Assign mesh in editor or code
		  var mesh_instance = $MeshInstance3D
		  
		  # Create material in code
		  var mat = StandardMaterial3D.new()
		  mat.albedo_color = Color.RED
		  mat.metallic = 0.5
		  mat.roughness = 0.3
		  mesh_instance.material_override = mat
		  
		  # Load texture
		  mat.albedo_texture = preload("res://assets/texture.png")
		  ```
	-
	- ## Raycasting 3D
	  collapsed:: true
		- ```gdscript
		  func shoot_ray() -> void:
		      var space_state = get_world_3d().direct_space_state
		      var cam = $Camera3D
		      var from = cam.global_position
		      var to = from + (-cam.global_transform.basis.z * 100.0)
		  
		      var query = PhysicsRayQueryParameters3D.create(from, to)
		      query.exclude = [self]
		      var result = space_state.intersect_ray(query)
		  
		      if result:
		          print("Hit: ", result.collider.name)
		          print("Point: ", result.position)
		          print("Normal: ", result.normal)
		  ```
-
- # Physics System
  collapsed:: true
	- ## Collision Layers & Masks
	  collapsed:: true
		- ```
		  Layer:  What this object IS (what layer it occupies)
		  Mask:   What this object DETECTS (what layers it scans)
		  
		  Example:
		    Player  → Layer 1, Mask 2 (detects enemies)
		    Enemy   → Layer 2, Mask 1 (detects player)
		    Bullet  → Layer 3, Mask 2 (detects enemies only)
		  ```
		- ```gdscript
		  # Set in editor (Physics → Layers) or in code:
		  collision_layer = 1   # bit 1
		  collision_mask  = 2   # bit 2
		  
		  # Check group membership
		  if body.is_in_group("enemy"):
		      body.take_damage(10)
		  ```
	-
	- ## RigidBody2D / RigidBody3D
	  collapsed:: true
		- ```gdscript
		  extends RigidBody2D
		  
		  func _ready() -> void:
		      # Apply impulse (instant force)
		      apply_impulse(Vector2(0, -500))
		  
		      # Apply continuous force
		      apply_force(Vector2(100, 0))
		  
		      # Set linear velocity directly
		      linear_velocity = Vector2(200, 0)
		  
		      # Connect body_entered signal
		      body_entered.connect(_on_collision)
		  
		  func _on_collision(body: Node) -> void:
		      print("Collided with: ", body.name)
		  ```
	-
	- ## Groups
	  collapsed:: true
		- ```gdscript
		  # Add to group in editor (Node → Groups) or code:
		  add_to_group("enemies")
		  add_to_group("collectibles")
		  
		  # Check
		  if is_in_group("enemies"):
		      take_damage(10)
		  
		  # Call method on all in group
		  get_tree().call_group("enemies", "freeze")
		  
		  # Get all nodes in group
		  var enemies = get_tree().get_nodes_in_group("enemies")
		  ```
-
- # Animation System
  collapsed:: true
	- ## AnimationPlayer
	  collapsed:: true
		- ```gdscript
		  @onready var anim = $AnimationPlayer
		  
		  # Play animation
		  anim.play("walk")
		  anim.play_backwards("walk")
		  anim.stop()
		  anim.pause()
		  
		  # Blend / transition
		  anim.play("run", -1, 1.0, false)  # (name, blend_time, speed, from_end)
		  
		  # Check state
		  print(anim.current_animation)
		  print(anim.is_playing())
		  
		  # Connect signals
		  anim.animation_finished.connect(_on_anim_finished)
		  
		  func _on_anim_finished(anim_name: StringName) -> void:
		      if anim_name == "attack":
		          anim.play("idle")
		  ```
	-
	- ## AnimationTree (State Machine)
	  collapsed:: true
		- ```gdscript
		  @onready var anim_tree = $AnimationTree
		  @onready var state_machine = anim_tree.get("parameters/playback")
		  
		  func _ready() -> void:
		      anim_tree.active = true
		  
		  func _physics_process(delta: float) -> void:
		      # Set blend parameters
		      anim_tree.set("parameters/blend_position", velocity.normalized())
		  
		      # Travel to state
		      if is_on_floor():
		          state_machine.travel("idle")
		      else:
		          state_machine.travel("jump")
		  ```
	-
	- ## Tween — Procedural Animation
	  collapsed:: true
		- ```gdscript
		  # Animate any property smoothly
		  func animate_in() -> void:
		      var tween = create_tween()
		      tween.tween_property(self, "position", Vector2(200, 100), 0.5)
		      tween.tween_property(self, "modulate:a", 1.0, 0.3)
		  
		  # Chain tweens
		  var tween = create_tween().set_loops()
		  tween.tween_property($Sprite, "scale", Vector2(1.2, 1.2), 0.5)
		  tween.tween_property($Sprite, "scale", Vector2(1.0, 1.0), 0.5)
		  
		  # Easing
		  tween.set_ease(Tween.EASE_IN_OUT)
		  tween.set_trans(Tween.TRANS_BOUNCE)
		  ```
-
- # UI System (Control Nodes)
  collapsed:: true
	- ## Common UI Nodes
	  collapsed:: true
		- ```
		  Control         Base UI node
		  Label           Display text
		  Button          Clickable button
		  TextEdit        Multi-line text input
		  LineEdit        Single-line text input
		  ProgressBar     Health/loading bar
		  Slider          Value slider
		  CheckBox        Toggle checkbox
		  OptionButton    Dropdown menu
		  Panel           Background panel
		  VBoxContainer   Vertical layout
		  HBoxContainer   Horizontal layout
		  GridContainer   Grid layout
		  ScrollContainer Scrollable area
		  ```
	-
	- ## UI Scripting
	  collapsed:: true
		- ```gdscript
		  extends CanvasLayer
		  
		  @onready var health_bar = $HealthBar
		  @onready var score_label = $ScoreLabel
		  @onready var menu_button = $MenuButton
		  
		  func _ready() -> void:
		      menu_button.pressed.connect(_on_menu_pressed)
		  
		  func update_health(value: int) -> void:
		      health_bar.value = value
		  
		  func update_score(score: int) -> void:
		      score_label.text = "Score: " + str(score)
		  
		  func _on_menu_pressed() -> void:
		      get_tree().change_scene_to_file("res://scenes/MainMenu.tscn")
		  ```
	-
	- ## Anchors & Layout
	  collapsed:: true
		- ```
		  Anchor presets (Inspector → Layout):
		    Top Left / Top Right / Bottom Left / Bottom Right
		    Center / Full Rect (stretches to fill parent)
		  
		  # In code:
		  $Label.anchor_left = 0.0
		  $Label.anchor_right = 1.0   # stretch full width
		  $Label.offset_left = 10
		  $Label.offset_right = -10
		  ```
-
- # Audio System
  collapsed:: true
	- ## AudioStreamPlayer
	  collapsed:: true
		- ```gdscript
		  # AudioStreamPlayer     — non-positional (music, UI sounds)
		  # AudioStreamPlayer2D   — positional 2D audio
		  # AudioStreamPlayer3D   — positional 3D audio
		  
		  @onready var music = $AudioStreamPlayer
		  @onready var sfx = $SFX
		  
		  func _ready() -> void:
		      music.stream = preload("res://audio/theme.ogg")
		      music.play()
		  
		  func play_jump_sound() -> void:
		      sfx.stream = preload("res://audio/jump.wav")
		      sfx.play()
		  
		  # Volume (in dB)
		  music.volume_db = -10.0
		  
		  # Pitch
		  sfx.pitch_scale = randf_range(0.9, 1.1)  # random pitch variation
		  
		  # Stop
		  music.stop()
		  print(music.playing)  # false
		  ```
	-
	- ## Audio Buses
	  collapsed:: true
		- ```
		  Audio buses (Project → Audio):
		    Master → Music → SFX → Ambient
		  
		  # Assign bus in code:
		  $AudioStreamPlayer.bus = "Music"
		  
		  # Control bus volume:
		  AudioServer.set_bus_volume_db(AudioServer.get_bus_index("Music"), -5.0)
		  AudioServer.set_bus_mute(AudioServer.get_bus_index("SFX"), true)
		  ```
-
- # Resource System & Data Management
  collapsed:: true
	- ## Resources
	  collapsed:: true
		- ```gdscript
		  # Resources are data containers saved as .tres or .res files
		  # Examples: Texture2D, AudioStream, Material, TileSet, Font
		  
		  # Load resource
		  var texture = load("res://assets/player.png")
		  var texture = preload("res://assets/player.png")  # compile-time load
		  
		  # Custom Resource
		  class_name ItemData
		  extends Resource
		  
		  @export var item_name: String = ""
		  @export var damage: int = 0
		  @export var icon: Texture2D
		  
		  # Use it:
		  var sword = ItemData.new()
		  sword.item_name = "Iron Sword"
		  sword.damage = 25
		  ResourceSaver.save(sword, "res://data/iron_sword.tres")
		  
		  # Load back:
		  var loaded = load("res://data/iron_sword.tres") as ItemData
		  ```
	-
	- ## @export — Inspector Variables
	  collapsed:: true
		- ```gdscript
		  extends Node
		  
		  @export var speed: float = 200.0
		  @export var health: int = 100
		  @export var sprite: Texture2D
		  @export var enemy_scene: PackedScene
		  @export_range(0, 100) var volume: float = 50.0
		  @export_enum("Idle", "Run", "Attack") var state: int = 0
		  @export_color_no_alpha var tint: Color = Color.WHITE
		  ```
	-
	- ## Saving & Loading Game Data
	  collapsed:: true
		- ```gdscript
		  # Save with ConfigFile (simple key-value)
		  func save_game() -> void:
		      var config = ConfigFile.new()
		      config.set_value("player", "health", health)
		      config.set_value("player", "position", position)
		      config.save("user://save.cfg")
		  
		  func load_game() -> void:
		      var config = ConfigFile.new()
		      if config.load("user://save.cfg") == OK:
		          health = config.get_value("player", "health", 100)
		          position = config.get_value("player", "position", Vector2.ZERO)
		  
		  # Save with JSON
		  func save_json() -> void:
		      var data = {"health": health, "score": score}
		      var file = FileAccess.open("user://save.json", FileAccess.WRITE)
		      file.store_string(JSON.stringify(data))
		  
		  func load_json() -> void:
		      var file = FileAccess.open("user://save.json", FileAccess.READ)
		      if file:
		          var data = JSON.parse_string(file.get_as_text())
		          health = data["health"]
		  ```
-
- # Scene Management
  collapsed:: true
	- ## Changing Scenes
	  collapsed:: true
		- ```gdscript
		  # Change scene (unloads current, loads new)
		  get_tree().change_scene_to_file("res://scenes/Level2.tscn")
		  
		  # Change scene from PackedScene
		  var next_level = preload("res://scenes/Level2.tscn")
		  get_tree().change_scene_to_packed(next_level)
		  
		  # Reload current scene
		  get_tree().reload_current_scene()
		  
		  # Quit game
		  get_tree().quit()
		  ```
	-
	- ## Autoloads (Singletons)
	  collapsed:: true
		- ```
		  Project Settings → Autoload → add script/scene
		  Name: GameManager, Path: res://scripts/GameManager.gd
		  ```
		- ```gdscript
		  # GameManager.gd (autoload singleton)
		  extends Node
		  
		  var score: int = 0
		  var lives: int = 3
		  
		  signal score_changed(new_score: int)
		  
		  func add_score(points: int) -> void:
		      score += points
		      score_changed.emit(score)
		  
		  # Access from any script:
		  GameManager.add_score(100)
		  print(GameManager.score)
		  ```
	-
	- ## SceneTree & Pausing
	  collapsed:: true
		- ```gdscript
		  # Pause the game
		  get_tree().paused = true
		  
		  # Node process mode (Inspector → Process Mode):
		  # Inherit / Pausable / When Paused / Always / Disabled
		  
		  # In code:
		  process_mode = Node.PROCESS_MODE_ALWAYS  # runs even when paused (UI)
		  process_mode = Node.PROCESS_MODE_PAUSABLE # stops when paused (game objects)
		  ```
-
- # Shaders & Visual Effects
  collapsed:: true
	- ## Shader Basics (Godot Shading Language)
	  collapsed:: true
		- ```glsl
		  // Spatial shader (3D)
		  shader_type spatial;
		  
		  uniform vec4 albedo_color : source_color = vec4(1.0);
		  uniform sampler2D texture_albedo : source_color;
		  
		  void fragment() {
		      ALBEDO = texture(texture_albedo, UV).rgb * albedo_color.rgb;
		      ROUGHNESS = 0.5;
		      METALLIC = 0.0;
		  }
		  
		  // Canvas item shader (2D)
		  shader_type canvas_item;
		  
		  void fragment() {
		      vec4 col = texture(TEXTURE, UV);
		      COLOR = col * vec4(1.0, 0.5, 0.5, 1.0);  // red tint
		  }
		  ```
	-
	- ## Shader Parameters from GDScript
	  collapsed:: true
		- ```gdscript
		  var mat = $MeshInstance3D.material_override as ShaderMaterial
		  mat.set_shader_parameter("albedo_color", Color.RED)
		  mat.set_shader_parameter("speed", 2.0)
		  ```
	-
	- ## GPUParticles2D / GPUParticles3D
	  collapsed:: true
		- ```gdscript
		  @onready var particles = $GPUParticles2D
		  
		  # Trigger burst
		  func explode() -> void:
		      particles.emitting = true
		      particles.one_shot = true
		      particles.restart()
		  
		  # Continuous
		  particles.emitting = true
		  particles.amount = 100
		  particles.lifetime = 1.5
		  ```
	-
	- ## Environment & Post-Processing
	  collapsed:: true
		- ```gdscript
		  # WorldEnvironment node → Environment resource
		  # Settings: Sky, Ambient Light, Fog, Glow, SSAO, SSR, Tone Mapping
		  
		  var env = $WorldEnvironment.environment
		  env.fog_enabled = true
		  env.fog_density = 0.01
		  env.glow_enabled = true
		  env.tonemap_mode = Environment.TONE_MAPPER_FILMIC
		  ```
-
- # More Learn
	- Explore the following links for valuable resources, communities, and tools to enhance your skills : -
		-
		- [Godot Docs](https://docs.godotengine.org/en/stable/) - For Latest Docs and Features