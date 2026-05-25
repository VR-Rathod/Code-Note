---
date: 2024-11-01T16:21:17-07:00
lastmod: 2026-04-15T11:14:23+05:30

seoTitle: Godot Engine Notes – Complete Game Dev Reference
description: "Complete Godot 4 reference — scenes, nodes, physics, animation, shaders, networking, UI, audio, and 3D development. GDScript language reference is in the dedicated GDScript note."
keywords: "Godot engine, Godot 4, game development, Godot nodes, Godot physics, Godot animation, Godot shaders, open source game engine, 2D game development, 3D game development, godot notes, godot guide, godot cheatsheet, godot reference, GDScript, VR-Rathod, Code-Note, code note vr, vr book"
---

- # History
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
		- Everything in Godot is a **Node**. A **Scene** is a tree of nodes saved as a file.
		- Scenes can be **instanced** inside other scenes — this is the primary composition pattern.
		- ```
		  Node (root)
		  ├── Sprite2D
		  ├── CollisionShape2D
		  └── AudioStreamPlayer
		  ```
	-
	- ## Scene & Resource File Formats
	  collapsed:: true
		- ```
		  .tscn   Text Scene   — human-readable, version-control friendly (default for scenes)
		  .scn    Binary Scene — compiled binary, faster to load, used in exported builds
		  .tres   Text Resource — human-readable resource (materials, custom data, etc.)
		  .res    Binary Resource — compiled binary version of .tres
		  .escn   Exported Scene — identical to .tscn but marks the file as externally exported
		                           (e.g. from Blender); auto-compiled to .scn on import
		  ```
		- When you **export** your game, Godot automatically converts `.tscn` → `.scn` and `.tres` → `.res` for performance.
		- Use `.tscn` / `.tres` during development (readable diffs in git), and let the exporter handle the rest.
		- ```gdscript
		  # Loading works the same regardless of format:
		  var scene = preload("res://scenes/Player.tscn")   # text scene
		  var scene = preload("res://scenes/Player.scn")    # binary scene (exported)
		  var data  = preload("res://data/item.tres")       # text resource
		  var data  = preload("res://data/item.res")        # binary resource
		  ```
	-
	- ## Common Node Types
	  collapsed:: true
		- ```
		  Node2D/3D          		Base for all 2D/3D nodes (has position, rotation, scale)
		  Sprite2D/3D				Displays a texture in 2D/3D
		  AnimatedSprite2D/3D  	Sprite with frame animation
		  CollisionShape2D/3D		Defines collision area shape
		  Area2D/3D          		Detects overlaps (no physics response)
		  CharacterBody2D/3D  	Kinematic body for player/enemies
		  RigidBody2D/3D     		Physics-simulated body
		  StaticBody2D/3D    		Immovable physics body (walls, floors)
		  Camera2D/3D        		2D/3D camera with follow/zoom
		  Label           		UI text
		  Button          		UI button
		  CanvasLayer     		UI layer (always on top of game world)
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
- # GDScript
  collapsed:: true
	- GDScript is Godot's built-in scripting language — Python-like syntax, tightly integrated with the engine, supports static typing, signals, coroutines, lambdas, and full OOP.
	- For the complete in-depth GDScript language reference (variables, types, OOP, signals, annotations, coroutines, patterns, and more), see the dedicated [[GDScript]] note.
	- Quick reference:
		- ```gdscript
		  extends CharacterBody2D  # inherit a Godot class
		  class_name Player        # register as global class
		  
		  @export var speed: float = 200.0   # editable in Inspector
		  @onready var anim := $AnimationPlayer  # assigned at _ready
		  
		  signal health_changed(new_hp: int)
		  
		  var health: int = 100:
		      set(v):
		          health = clamp(v, 0, 100)
		          health_changed.emit(health)
		  
		  func _physics_process(delta: float) -> void:
		      var dir = Input.get_axis("move_left", "move_right")
		      velocity.x = dir * speed
		      move_and_slide()
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
- # Networking & Multiplayer
  collapsed:: true
	- ## High-Level Multiplayer API
	  collapsed:: true
		- ```gdscript
		  # Server setup (ENet — UDP-based, low latency)
		  var peer = ENetMultiplayerPeer.new()
		  peer.create_server(PORT, MAX_CLIENTS)   # PORT e.g. 9999
		  multiplayer.multiplayer_peer = peer
		  
		  # Client setup
		  var peer = ENetMultiplayerPeer.new()
		  peer.create_client("127.0.0.1", PORT)
		  multiplayer.multiplayer_peer = peer
		  
		  # Signals
		  multiplayer.peer_connected.connect(_on_peer_connected)
		  multiplayer.peer_disconnected.connect(_on_peer_disconnected)
		  multiplayer.connected_to_server.connect(_on_connected)
		  multiplayer.connection_failed.connect(_on_failed)
		  
		  func _on_peer_connected(id: int) -> void:
		      print("Peer joined: ", id)
		  ```
	-
	- ## RPC — Remote Procedure Calls
	  collapsed:: true
		- ```gdscript
		  # Annotate functions with @rpc to call them on remote peers
		  
		  @rpc("any_peer")                    # any peer can call this
		  func take_damage(amount: int) -> void:
		      health -= amount
		  
		  @rpc("authority", "call_local")     # only server calls, runs locally too
		  func sync_position(pos: Vector2) -> void:
		      position = pos
		  
		  @rpc("any_peer", "reliable")        # guaranteed delivery (like TCP)
		  func chat_message(msg: String) -> void:
		      print(msg)
		  
		  # Call on specific peer
		  take_damage.rpc_id(peer_id, 25)
		  
		  # Call on all peers
		  sync_position.rpc(global_position)
		  ```
	-
	- ## MultiplayerSpawner & MultiplayerSynchronizer
	  collapsed:: true
		- ```gdscript
		  # MultiplayerSpawner — auto-spawns nodes on all clients
		  # Add MultiplayerSpawner node, set spawn_path and auto_spawn_list in editor
		  
		  # MultiplayerSynchronizer — syncs properties automatically
		  # Add MultiplayerSynchronizer node, configure replication in editor
		  # Or in code:
		  var sync = $MultiplayerSynchronizer
		  sync.root_path = NodePath("..")
		  # Then add properties to replicate via editor or:
		  # ReplicationConfig resource → add properties like "position", "health"
		  ```
	-
	- ## WebSocket (for Web exports)
	  collapsed:: true
		- ```gdscript
		  # Server
		  var ws_server = WebSocketMultiplayerPeer.new()
		  ws_server.create_server(PORT)
		  multiplayer.multiplayer_peer = ws_server
		  
		  # Client (works in browser)
		  var ws_client = WebSocketMultiplayerPeer.new()
		  ws_client.create_client("ws://localhost:9999")
		  multiplayer.multiplayer_peer = ws_client
		  ```
-
- # Debugging & Profiling
  collapsed:: true
	- ## Print & Assertions
	  collapsed:: true
		- ```gdscript
		  print("value: ", health)           # basic print
		  print_rich("[color=red]Error![/color]")  # colored output
		  push_warning("Low health!")        # shows in debugger as warning
		  push_error("Critical failure!")    # shows as error, doesn't stop execution
		  assert(health > 0, "Health must be positive")  # crashes in debug builds
		  
		  # Print only in debug builds
		  if OS.is_debug_build():
		      print("Debug info: ", position)
		  ```
	-
	- ## Debugger Panel
	  collapsed:: true
		- ```
		  Bottom panel → Debugger tab:
		    Errors     — runtime errors and warnings
		    Stack Trace — call stack when paused/crashed
		    Inspector  — live node property inspection while running
		    Profiler   — CPU time per function (enable before running)
		    Visual Profiler — GPU frame time breakdown
		    Network    — RPC and sync traffic monitor
		    Monitors   — FPS, memory, physics objects, draw calls
		  ```
	-
	- ## Breakpoints
	  collapsed:: true
		- ```
		  Click the line number gutter in the script editor to set a breakpoint.
		  Run the game → execution pauses at the breakpoint.
		  Use Step Over (F10), Step Into (F11), Continue (F12) to navigate.
		  Inspect local variables in the Debugger → Stack Locals panel.
		  ```
	-
	- ## Performance Tips
	  collapsed:: true
		- ```gdscript
		  # Use _physics_process for physics, _process for visuals only
		  # Cache node references with @onready instead of $Node in loops
		  @onready var player = $Player   # cached once
		  
		  # Avoid get_node() in hot loops
		  # Use object pooling for bullets/particles instead of queue_free + instantiate
		  
		  # Check draw calls: Debug → Visible Collision Shapes / Navigation
		  # Use VisibleOnScreenNotifier2D/3D to disable off-screen processing
		  
		  # Profile with:
		  var time = Time.get_ticks_usec()
		  # ... code ...
		  print("Took: ", Time.get_ticks_usec() - time, " µs")
		  ```
-
- # Exporting Your Game
  collapsed:: true
	- ## Export Setup
	  collapsed:: true
		- ```
		  1. Editor → Export → Add preset (Windows, Linux, macOS, Android, iOS, Web)
		  2. Download export templates: Editor → Manage Export Templates
		  3. Configure per-platform settings (icon, name, permissions)
		  4. Click Export Project → choose output folder
		  ```
	-
	- ## Export Presets
	  collapsed:: true
		- ```
		  Windows Desktop  → .exe + .pck  (or embedded single .exe)
		  Linux/X11        → ELF binary + .pck
		  macOS            → .app bundle
		  Android          → .apk or .aab (needs Android SDK + JDK)
		  iOS              → Xcode project (needs macOS + Xcode)
		  Web (HTML5)      → .html + .js + .wasm + .pck
		  ```
	-
	- ## PCK Files
	  collapsed:: true
		- ```gdscript
		  # .pck = packed resource file containing all game assets
		  # Can be distributed separately from the executable
		  # Useful for DLC or updates
		  
		  # Load external .pck at runtime:
		  ProjectSettings.load_resource_pack("res://dlc_pack.pck")
		  ```
	-
	- ## Android Export
	  collapsed:: true
		- ```
		  Requirements:
		    - Android SDK (API 28+)
		    - JDK 17+
		    - Godot Android export templates
		  
		  Editor → Export → Android:
		    - Set package name (e.g. com.yourname.yourgame)
		    - Set keystore for release builds
		    - Enable permissions (INTERNET, VIBRATE, etc.)
		    - Min SDK: 21 (Android 5.0)
		  ```
-
- # C# in Godot 4
  collapsed:: true
	- ## Setup
	  collapsed:: true
		- ```
		  Use the Godot .NET version (not the standard build).
		  Download: godotengine.org → .NET version
		  Requires: .NET SDK 6.0 or later
		  IDE: VS Code (with C# extension) or JetBrains Rider
		  ```
	-
	- ## C# Script Basics
	  collapsed:: true
		- ```csharp
		  using Godot;
		  
		  public partial class Player : CharacterBody2D
		  {
		      [Export] public float Speed = 200.0f;
		      [Export] public int Health = 100;
		  
		      public override void _Ready()
		      {
		          GD.Print("Player ready!");
		      }
		  
		      public override void _PhysicsProcess(double delta)
		      {
		          var velocity = Velocity;
		  
		          var direction = Input.GetAxis("move_left", "move_right");
		          velocity.X = direction * Speed;
		  
		          Velocity = velocity;
		          MoveAndSlide();
		      }
		  
		      public void TakeDamage(int amount)
		      {
		          Health -= amount;
		          if (Health <= 0) QueueFree();
		      }
		  }
		  ```
	-
	- ## Signals in C#
	  collapsed:: true
		- ```csharp
		  // Define signal
		  [Signal] public delegate void HealthChangedEventHandler(int newHealth);
		  
		  // Emit
		  EmitSignal(SignalName.HealthChanged, Health);
		  
		  // Connect
		  someNode.HealthChanged += OnHealthChanged;
		  
		  private void OnHealthChanged(int newHealth)
		  {
		      GD.Print("Health: ", newHealth);
		  }
		  ```
	-
	- ## GDScript vs C# — When to Use
	  collapsed:: true
		- ```
		  GDScript:
		    + Faster iteration, no compile step
		    + Tightly integrated with Godot API
		    + Best for game logic, UI, scripting
		    - Slower than C# for heavy computation
		  
		  C#:
		    + Faster execution (JIT compiled)
		    + Strong typing, better IDE support
		    + Familiar for Unity developers
		    - Requires .NET build, slower hot-reload
		    - Some Godot 4 features lag behind GDScript support
		  ```
-
- # GDExtension (C++ / Rust / Other Languages)
  collapsed:: true
	- ## What is GDExtension
	  collapsed:: true
		- ```
		  GDExtension lets you write native code (C++, Rust, Swift, etc.)
		  that integrates with Godot as if it were built-in.
		  Use it for: performance-critical systems, existing C++ libraries,
		  custom physics, or platform-specific features.
		  
		  Replaces GDNative from Godot 3.
		  Uses godot-cpp bindings (official C++ library).
		  ```
	-
	- ## Minimal C++ GDExtension
	  collapsed:: true
		- ```cpp
		  // my_node.h
		  #include <godot_cpp/classes/node.hpp>
		  using namespace godot;
		  
		  class MyNode : public Node {
		      GDCLASS(MyNode, Node)
		  
		  static void _bind_methods();
		  public:
		      void hello();
		  };
		  
		  // my_node.cpp
		  #include "my_node.h"
		  #include <godot_cpp/core/class_db.hpp>
		  
		  void MyNode::_bind_methods() {
		      ClassDB::bind_method(D_METHOD("hello"), &MyNode::hello);
		  }
		  
		  void MyNode::hello() {
		      UtilityFunctions::print("Hello from C++!");
		  }
		  ```
		- Build with SCons, output a `.gdextension` file pointing to your `.dll`/`.so`.
-
- # Useful Patterns & Tips
  collapsed:: true
	- ## State Machine Pattern
	  collapsed:: true
		- ```gdscript
		  enum State { IDLE, RUN, JUMP, ATTACK }
		  var current_state: State = State.IDLE
		  
		  func _physics_process(delta: float) -> void:
		      match current_state:
		          State.IDLE:   _state_idle(delta)
		          State.RUN:    _state_run(delta)
		          State.JUMP:   _state_jump(delta)
		          State.ATTACK: _state_attack(delta)
		  
		  func _state_idle(_delta: float) -> void:
		      if Input.get_axis("move_left", "move_right") != 0:
		          current_state = State.RUN
		      if Input.is_action_just_pressed("jump"):
		          current_state = State.JUMP
		  ```
	-
	- ## Object Pooling
	  collapsed:: true
		- ```gdscript
		  # Reuse nodes instead of instantiate/queue_free every frame
		  var pool: Array[Node] = []
		  
		  func get_from_pool() -> Node:
		      for node in pool:
		          if not node.visible:
		              node.visible = true
		              return node
		      var new_node = bullet_scene.instantiate()
		      add_child(new_node)
		      pool.append(new_node)
		      return new_node
		  
		  func return_to_pool(node: Node) -> void:
		      node.visible = false
		  ```
	-
	- ## Event Bus (Decoupled Signals)
	  collapsed:: true
		- ```gdscript
		  # EventBus.gd — autoload singleton
		  extends Node
		  
		  signal enemy_died(enemy_id: int)
		  signal score_updated(new_score: int)
		  signal level_completed
		  
		  # Any script can emit:
		  EventBus.enemy_died.emit(id)
		  
		  # Any script can listen:
		  EventBus.enemy_died.connect(_on_enemy_died)
		  ```
	-
	- ## @tool Scripts (Editor Scripts)
	  collapsed:: true
		- ```gdscript
		  @tool
		  extends Node2D
		  
		  @export var tile_count: int = 10 : set = _set_tile_count
		  
		  func _set_tile_count(value: int) -> void:
		      tile_count = value
		      _rebuild()  # runs in editor when you change the value
		  
		  func _rebuild() -> void:
		      # Generate tiles procedurally in the editor
		      for child in get_children():
		          child.queue_free()
		      for i in tile_count:
		          var tile = preload("res://scenes/Tile.tscn").instantiate()
		          tile.position.x = i * 64
		          add_child(tile)
		  ```
	-
	- ## Coroutines with await
	  collapsed:: true
		- ```gdscript
		  # await pauses execution until a signal fires or a time passes
		  
		  func show_message(text: String) -> void:
		      $Label.text = text
		      $Label.visible = true
		      await get_tree().create_timer(2.0).timeout
		      $Label.visible = false
		  
		  # await animation finish
		  $AnimationPlayer.play("attack")
		  await $AnimationPlayer.animation_finished
		  $AnimationPlayer.play("idle")
		  
		  # await signal
		  await player_died
		  get_tree().reload_current_scene()
		  ```
	-
	- ## Navigation & Pathfinding
	  collapsed:: true
		- ```gdscript
		  # 2D: NavigationRegion2D + NavigationAgent2D
		  extends CharacterBody2D
		  
		  @onready var nav_agent = $NavigationAgent2D
		  
		  func move_to(target_pos: Vector2) -> void:
		      nav_agent.target_position = target_pos
		  
		  func _physics_process(delta: float) -> void:
		      if nav_agent.is_navigation_finished():
		          return
		      var next = nav_agent.get_next_path_position()
		      var dir = (next - global_position).normalized()
		      velocity = dir * speed
		      move_and_slide()
		  
		  # 3D: NavigationRegion3D + NavigationAgent3D (same pattern)
		  ```
-
- # More Learn
	- Explore the following links for valuable resources, communities, and tools to enhance your skills : -
		-
		- [Godot Docs](https://docs.godotengine.org/en/stable/) - For Latest Docs and Features
		- [[Game Systems]] — Implement inventory, save/load, quests & procedural generation in Godot
		- [[Advanced Graphics]] — Vulkan-based low-level rendering via Godot's RenderingDevice