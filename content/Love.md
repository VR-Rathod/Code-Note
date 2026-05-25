---
date: 2026-05-21T13:09:49+05:30
lastmod: 2026-05-21T13:09:49+05:30

seoTitle: LÖVE 2D Game Framework Reference – Lua Game Development Guide
description: "Comprehensive in-depth reference for LÖVE (Love2D) framework in Lua — lifecycle, graphics, audio, physics (Box2D), input, filesystem, math, shaders, and community libraries."
keywords: "love2d, LÖVE, lua, game development, 2D game engine, love2d tutorial, love2d reference, love2d physics, love2d graphics, love2d audio, love2d shaders, VR-Rathod, Code-Note, code note vr"
displayTitle: LÖVE
title: Love
---

- # History
- **How**: Created as an open-source 2D game framework in Lua. First released in **2008** by Henk Boom and Anders Ruud.
- **Who**: Developed and maintained by the LÖVE Development Team (Anders Ruud, Bart van Strien, and community).
- **Why**: To offer a lightweight, high-performance, and minimal-overhead 2D framework for rapid prototyping and full game development in Lua without the bloat of visual editors.
-
- # Introduction
  collapsed:: true
	- **LÖVE** (commonly known as **Love2D**) is an open-source framework for making 2D games in the Lua programming language. It is highly portable, lightweight, and leverages powerful libraries like SDL2, OpenGL/OpenGL ES, OpenAL, and Box2D underneath to handle windowing, graphics, audio, and physics.
	-
	- ## Advantages
	  collapsed:: true
		- **Blazing Fast**: Extremely fast startup times and low memory/CPU footprint.
		- **Lua Integration**: Scripted in Lua, enabling rapid prototyping, dynamic coding, and minimal boilerplate.
		- **Full Control**: No forced IDE or editor — use any text editor and build your engine architecture how you see fit.
		- **Cross-Platform**: Compile once and run on Windows, macOS, Linux, Android, iOS, and the Web (via tools like LÖVe.js).
		- **Powerful APIs**: Tightly integrated Box2D physics, OpenAL sound, SDL2 window management, and GLSL shading out of the box.
	-
	- ## Disadvantages
	  collapsed:: true
		- **No GUI Editor**: Completely code-driven. You must write or import code for UI, animation timelines, and level design.
		- **Barebones Architecture**: Does not provide high-level abstractions like \"entities\" or \"scenes\". You must design your own game loop architecture or import libraries.
		- **Lua Limitations**: Dynamic typing and lack of default OOP (requires metatables or libraries like `classic` or `hump`).
-
- # Project Setup & Running
  collapsed:: true
	- ## Basic Directory Structure
	  collapsed:: true
		- Every LÖVE project requires at least a `main.lua` file.
		- ```
		  my-game/
		  ├── main.lua          -- Core entry point, contains callbacks
		  ├── conf.lua          -- Optional config for window, modules, etc.
		  ├── assets/           -- Textures, audio, fonts
		  └── src/              -- Source code modules
		  ```
	-
	- ## Config File (conf.lua)
	  collapsed:: true
		- Used to configure the game window, modules, and package parameters before the engine loads.
		- ```lua
		  function love.conf(t)
		      t.identity = "my_game_save_dir" -- Folder name for save data in user directory
		      t.version = "11.5"              -- Compatible LÖVE version
		      t.console = true                 -- Enable terminal console for print debugging (Windows)
		  
		      t.window.title = "LÖVE 2D Game"  -- Window title
		      t.window.icon = "assets/icon.png" -- Path to window icon
		      t.window.width = 800             -- Screen width
		      t.window.height = 600            -- Screen height
		      t.window.resizable = true        -- Let user resize window
		      t.window.vsync = 1               -- 1 = vertical sync enabled, 0 = disabled
		      t.window.msaa = 4                -- Multisample anti-aliasing (0 to 16)
		      
		      t.modules.physics = true         -- Enable Box2D physics module
		      t.modules.joystick = true        -- Enable gamepad/joystick support
		  end
		  ```
	-
	- ## Running the Game
	  collapsed:: true
		- **Command Line**: Run the folder directly.
		  ```bash
		  love .
		  ```
		- **Distribution (.love)**: Zip all files in the root folder (do not zip the folder itself, zip the contents) and rename the extension from `.zip` to `.love`.
-
- # Core Callbacks (Lifecycle)
  collapsed:: true
	- ## Lifecycle Methods
	  collapsed:: true
		- LÖVE is fully event-driven and calls specific functions in `main.lua` at critical lifecycle phases.
		- ```lua
		  -- Called ONCE when the game starts. Use for loading assets, instantiating objects, and initialization.
		  function love.load()
		      player_img = love.graphics.newImage("assets/player.png")
		      player_x = 100
		      player_y = 100
		      player_speed = 300
		  end
		  
		  -- Called every frame. Used to update game state (positions, physics, logic).
		  -- @param dt Delta Time (seconds since the last frame)
		  function love.update(dt)
		      -- Example keyboard polling (FPS independent movement)
		      if love.keyboard.isDown("d") then
		          player_x = player_x + player_speed * dt
		      elseif love.keyboard.isDown("a") then
		          player_x = player_x - player_speed * dt
		      end
		  end
		  
		  -- Called every frame. Used exclusively to render graphics to the screen.
		  function love.draw()
		      love.graphics.draw(player_img, player_x, player_y)
		  end
		  ```
	-
	- ## Input Event Callbacks
	  collapsed:: true
		- Event callbacks are triggered instantly when physical inputs are triggered by the operating system, unlike polling inside `love.update`.
		- ```lua
		  -- Triggered when a key is pressed down
		  -- @param key The character representation (e.g., "space", "escape", "w")
		  -- @param scancode The layout-independent keyboard code
		  -- @param isrepeat Boolean indicating if the key is repeating due to being held down
		  function love.keypressed(key, scancode, isrepeat)
		      if key == "escape" then
		          love.event.quit() -- Quit game
		      end
		      if key == "space" and not isrepeat then
		          player:jump()
		      end
		  end
		  
		  -- Triggered when a key is released
		  function love.keyreleased(key, scancode)
		      print("Key released: " .. key)
		  end
		  
		  -- Triggered when a mouse button is pressed
		  -- @param button Mouse button index (1 = Left, 2 = Right, 3 = Middle)
		  -- @param presses Number of consecutive clicks (e.g. 2 for double click)
		  function love.mousepressed(x, y, button, istouch, presses)
		      if button == 1 then
		          player:shoot(x, y)
		      end
		  end
		  
		  -- Triggered when the mouse wheel is rotated
		  -- @param y Fractional scroll amount (-1 to 1) along the vertical axis
		  function love.wheelmoved(x, y)
		      if y > 0 then
		          camera:zoomIn()
		      elseif y < 0 then
		          camera:zoomOut()
		      end
		  end
		  ```
	-
	- ## System Event Callbacks
	  collapsed:: true
		- ```lua
		  -- Called when the window gains or loses focus
		  function love.focus(f)
		      if not f then
		          print("Game Paused - Lost Focus")
		          -- Pause music, display pause screen
		      end
		  end
		  
		  -- Called when the game window is resized (if resizable = true)
		  function love.resize(w, h)
		      print(("Window resized to %dx%d"):format(w, h))
		  end
		  
		  -- Called just before the game closes
		  -- @return If true is returned, the shutdown process is aborted!
		  function love.quit()
		      print("Saving player progress...")
		      save_game_data()
		      return false -- Return false to allow closing, true to prevent it
		  end
		  ```
-
- # Graphics & Rendering
  collapsed:: true
	- ## Basic Colors & Math
	  collapsed:: true
		- **Color Format**: Colors in LÖVE use normalized RGBA float format (`0.0` to `1.0`) instead of `0-255`.
		- ```lua
		  function love.draw()
		      -- Set active color to green (Red=0, Green=1, Blue=0, Alpha=1)
		      love.graphics.setColor(0, 1, 0, 1)
		      love.graphics.rectangle("fill", 50, 50, 200, 100) -- fill rectangle
		  
		      -- Draw red outline circle
		      love.graphics.setColor(1, 0, 0, 0.5) -- semi-transparent red
		      love.graphics.circle("line", 400, 300, 50)
		      
		      -- Reset color to default (White) so subsequent drawings aren't tinted
		      love.graphics.setColor(1, 1, 1, 1)
		  end
		  ```
	-
	- ## Drawings Shapes API
	  collapsed:: true
		- ```lua
		  -- Draw modes: "fill" (solid shape) or "line" (outline wireframe)
		  love.graphics.rectangle(mode, x, y, width, height, rx, ry, segments) -- Draw rect (rx, ry for rounded corners)
		  love.graphics.circle(mode, x, y, radius, segments)                  -- Draw circle
		  love.graphics.line(x1, y1, x2, y2, x3, y3, ...)                      -- Connect dots with lines
		  love.graphics.polygon(mode, vertices)                                -- Draw polygon (vertices = flat table of coords)
		  love.graphics.ellipse(mode, x, y, radiusx, radiusy, segments)         -- Draw ellipse
		  love.graphics.arc(mode, arctype, x, y, radius, angle1, angle2)        -- Draw pie/slice shape
		  ```
	-
	- ## Images & Quads (Spritesheet Cutting)
	  collapsed:: true
		- Loading large assets is computationally expensive. Load them inside `love.load` once, and render them in `love.draw`.
		- ```lua
		  local player_sprite
		  local sheet_image
		  local sprite_quad
		  
		  function love.load()
		      -- Load full image
		      player_sprite = love.graphics.newImage("assets/player.png")
		      
		      -- Load spritesheet
		      sheet_image = love.graphics.newImage("assets/spritesheet.png")
		      
		      -- Slice Spritesheet: newQuad(x, y, quad_width, quad_height, sheet_width, sheet_height)
		      sprite_quad = love.graphics.newQuad(32, 0, 32, 32, sheet_image:getDimensions())
		  end
		  
		  function love.draw()
		      -- Drawing a normal Image: draw(image, x, y, rotation, scale_x, scale_y, offset_x, offset_y)
		      love.graphics.draw(player_sprite, 100, 100, 0, 2, 2) -- Scaled 2x
		      
		      -- Drawing a Quad: draw(sheet, quad, x, y, rotation, scale_x, scale_y, offset_x, offset_y)
		      -- Offset parameters act as origin points (anchor) for scaling/rotation
		      love.graphics.draw(sheet_image, sprite_quad, 200, 200, 0, 1, 1, 16, 16) -- Centered rotation origin
		  end
		  ```
	-
	- ## Fonts & Text Rendering
	  collapsed:: true
		- ```lua
		  local default_font
		  local large_font
		  
		  function love.load()
		      -- Default System Font
		      default_font = love.graphics.newFont(12)
		      
		      -- Custom TrueType Font (.ttf or .otf)
		      large_font = love.graphics.newFont("assets/Outfit-Bold.ttf", 32)
		  end
		  
		  function love.draw()
		      -- Set active font
		      love.graphics.setFont(large_font)
		      love.graphics.setColor(1, 1, 0, 1) -- Yellow
		      
		      -- Basic Print: print(text, x, y, rotation, scale_x, scale_y, offset_x, offset_y)
		      love.graphics.print("GAME OVER", 300, 100)
		      
		      -- Advanced Wrapped Text: printf(text, x, y, limit_width, align, rotation, scale_x, scale_y)
		      love.graphics.setFont(default_font)
		      love.graphics.setColor(1, 1, 1, 1)
		      love.graphics.printf("This is a long description text that will wrap automatically when reaching the limit width.", 200, 200, 400, "center")
		  end
		  ```
	-
	- ## Coordinate Transformations (Camera / Matrices)
	  collapsed:: true
		- LÖVE provides push/pop functions to manipulate the active drawing coordinate matrix, enabling custom viewport manipulation, translations, rotations, and cameras.
		- ```lua
		  function love.draw()
		      love.graphics.push() -- Save current transformation state
		      
		      -- Transform coordinate space to simulate camera
		      love.graphics.translate(-camera_x, -camera_y) -- Pan
		      love.graphics.scale(camera_zoom)              -- Zoom
		      love.graphics.rotate(camera_rotation)         -- Rotate camera view
		      
		      -- Draw world objects in transformed coordinate space
		      love.graphics.rectangle("fill", player_x, player_y, 32, 32)
		      
		      love.graphics.pop() -- Restore base transformation state
		      
		      -- Draw static HUD / UI elements (not affected by camera translation)
		      love.graphics.print("Score: " .. score, 10, 10)
		  end
		  ```
	-
	- ## Canvases (Render Targets)
	  collapsed:: true
		- A Canvas (or Framebuffer) is an offscreen texture that can be rendered to instead of rendering directly to the screen. Useful for screen scaling, post-processing, and shader pipelines.
		- ```lua
		  local canvas
		  
		  function love.load()
		      -- Create canvas matching native virtual game resolution (320x180 retro)
		      canvas = love.graphics.newCanvas(320, 180)
		      canvas:setFilter("nearest", "nearest") -- Pixel art scaling filter
		  end
		  
		  function love.draw()
		      -- Redirect draw calls to canvas
		      love.graphics.setCanvas(canvas)
		      love.graphics.clear(0, 0, 0, 1) -- Clear canvas black
		      
		      -- Draw pixel art game elements
		      love.graphics.setColor(1, 1, 1, 1)
		      love.graphics.rectangle("fill", 20, 20, 50, 50)
		      
		      -- Reset canvas redirection back to main monitor frame buffer
		      love.graphics.setCanvas()
		  
		      -- Render canvas to screen, stretching it to fit the full window size
		      local window_w, window_h = love.graphics.getDimensions()
		      local scale_x = window_w / 320
		      local scale_y = window_h / 180
		      
		      love.graphics.draw(canvas, 0, 0, 0, scale_x, scale_y)
		  end
		  ```
-
- # Input Management
  collapsed:: true
	- ## Keyboard Polling
	  collapsed:: true
		- ```lua
		  function love.update(dt)
		      -- Check if specific key is currently held down
		      if love.keyboard.isDown("right", "d") then
		          player_x = player_x + speed * dt
		      end
		      if love.keyboard.isDown("left", "a") then
		          player_x = player_x - speed * dt
		      end
		  end
		  ```
	-
	- ## Mouse Polling & Cursor
	  collapsed:: true
		- ```lua
		  function love.update(dt)
		      -- Get current mouse coordinates
		      local mx, my = love.mouse.getPosition()
		      
		      -- Poll button states (1=Left, 2=Right, 3=Middle)
		      if love.mouse.isDown(1) then
		          spray_particles(mx, my)
		      end
		  end
		  
		  function love.load()
		      -- Hide OS mouse cursor
		      love.mouse.setVisible(false)
		      
		      -- Load custom hardware system cursor
		      custom_cursor = love.mouse.newCursor("assets/crosshair.png", 8, 8)
		      love.mouse.setCursor(custom_cursor)
		  end
		  ```
	-
	- ## Gamepad / Joystick Controller Support
	  collapsed:: true
		- Tightly integrated with the SDL Game Controller API for standardized mappings across Xbox, PlayStation, and Nintendo switch pads.
		- ```lua
		  local joysticks = {}
		  local active_controller = nil
		  
		  function love.load()
		      -- Scan for connected joysticks/gamepads
		      joysticks = love.joystick.getJoysticks()
		      if #joysticks > 0 then
		          active_controller = joysticks[1]
		      end
		  end
		  
		  -- Gamepad event callbacks
		  function love.gamepadpressed(joystick, button)
		      if button == "a" then
		          player:jump()
		      end
		  end
		  
		  function love.update(dt)
		      if active_controller and active_controller:isGamepad() then
		          -- Read analog sticks (range -1.0 to 1.0)
		          local left_x = active_controller:getGamepadAxis("leftx")
		          local left_y = active_controller:getGamepadAxis("lefty")
		          
		          -- Deadzone handling
		          if math.abs(left_x) > 0.15 then
		              player_x = player_x + left_x * speed * dt
		          end
		      end
		  end
		  ```
-
- # Audio & Sound Effects
  collapsed:: true
	- ## Source Types: Static vs Stream
	  collapsed:: true
		- **Static**: Audio data is loaded fully into RAM. Perfect for short, recurring sound effects (SFX) like jumps, laser shots, and impacts to prevent disk read overhead.
		- **Stream**: Audio data is loaded in small chunks from disk dynamically. Essential for long music tracks or background ambiance (BGM) to save system memory.
		- ```lua
		  local jump_sound
		  local background_music
		  
		  function love.load()
		      -- Load SFX fully in RAM
		      jump_sound = love.audio.newSource("assets/sfx_jump.wav", "static")
		      
		      -- Load BGM dynamically from file
		      background_music = love.audio.newSource("assets/bgm_forest.ogg", "stream")
		  end
		  
		  function play_jump()
		      -- Pitch variation (adds richness to SFX)
		      jump_sound:setPitch(love.math.random(0.9, 1.1))
		      jump_sound:play()
		  end
		  
		  function start_ambiance()
		      background_music:setLooping(true) -- Loop track
		      background_music:setVolume(0.5)   -- 50% volume
		      background_music:play()
		  end
		  ```
	-
	- ## Sound Playback Operations
	  collapsed:: true
		- ```lua
		  source:play()          -- Play source
		  source:pause()         -- Pause source
		  source:stop()          -- Stop playback (resets to beginning)
		  source:setVolume(val)  -- Set volume (0.0 to 1.0)
		  source:setPitch(val)   -- Set pitch scaling (0.5 to 2.0)
		  source:setLooping(b)   -- Set looping state (true / false)
		  source:isPlaying()     -- Return true if currently playing
		  source:tell()          -- Get current playback position (seconds)
		  source:seek(sec)       -- Skip to position in seconds
		  ```
-
- # Physics System (Box2D Integration)
  collapsed:: true
	- ## Rigidbodies, Shapes, and Fixtures
	  collapsed:: true
		- LÖVE wraps the high-performance **Box2D** C++ physics engine internally.
		- ```lua
		  local world
		  local player_body
		  local player_shape
		  local player_fixture
		  local ground_body
		  local ground_shape
		  local ground_fixture
		  
		  function love.load()
		      -- 1. Create a physics world with Gravity (x, y) and sleep option
		      -- Gravity points downward along y-axis at 9.81 m/s^2 (multiplied by pixel scaling)
		      love.physics.setMeter(64) -- scale factor: 64 pixels equals 1 meter
		      world = love.physics.newWorld(0, 9.81 * 64, true)
		      
		      -- 2. Create the Static Ground
		      ground_body = love.physics.newBody(world, 400, 500, "static") -- Body types: "static", "dynamic", "kinematic"
		      ground_shape = love.physics.newRectangleShape(800, 50)         -- dimensions: width, height
		      ground_fixture = love.physics.newFixture(ground_body, ground_shape)
		      
		      -- 3. Create the Dynamic Player
		      player_body = love.physics.newBody(world, 400, 100, "dynamic")
		      player_body:setMass(1)
		      player_shape = love.physics.newCircleShape(20)                 -- circle with radius 20 pixels
		      player_fixture = love.physics.newFixture(player_body, player_shape, 1.0) -- body, shape, density
		      player_fixture:setRestitution(0.4)                             -- Bounce factor (0 = none, 1 = maximum bounce)
		      player_fixture:setFriction(0.2)                                -- Slide friction coefficient
		  end
		  
		  function love.update(dt)
		      -- Step the physics world (update positions based on forces)
		      world:update(dt)
		  end
		  
		  function love.draw()
		      -- Draw Ground
		      love.graphics.setColor(0.5, 0.5, 0.5, 1)
		      love.graphics.polygon("fill", ground_body:getWorldPoints(ground_shape:getPoints()))
		      
		      -- Draw Player
		      love.graphics.setColor(0, 1, 0.5, 1)
		      -- Circle positions are updated by the Box2D simulation engine automatically
		      love.graphics.circle("fill", player_body:getX(), player_body:getY(), player_shape:getRadius())
		  end
		  ```
	-
	- ## Physics Operations
	  collapsed:: true
		- ```lua
		  -- Apply Force (smooth continuous acceleration)
		  body:applyForce(fx, fy)
		  
		  -- Apply Impulse (instantaneous jump velocity)
		  body:applyLinearImpulse(ix, iy)
		  
		  -- Direct Velocity manipulation
		  body:setLinearVelocity(vx, vy)
		  local vx, vy = body:getLinearVelocity()
		  
		  -- Rotation & Torque
		  body:setFixedRotation(true) -- Prevent objects tipping over
		  body:applyTorque(torque)
		  ```
	-
	- ## Collision Callbacks
	  collapsed:: true
		- Triggered automatically by the physics solver when fixtures begin and end overlapping.
		- ```lua
		  local function beginContact(fixture_a, fixture_b, contact)
		      local body_a = fixture_a:getBody()
		      local body_b = fixture_b:getBody()
		      
		      print("Collision detected between body: " .. tostring(body_a) .. " and " .. tostring(body_b))
		  end
		  
		  local function endContact(fixture_a, fixture_b, contact)
		      -- Cleanup overlap states
		  end
		  
		  function love.load()
		      -- Set event handlers inside the world solver
		      world:setCallbacks(beginContact, endContact, nil, nil)
		  end
		  ```
-
- # Filesystem & Persistence
  collapsed:: true
	- ## Safe Save Directory
	  collapsed:: true
		- For security, LÖVE sandboxes the filesystem. You cannot write files randomly to system paths.
		- **Read access** is permitted inside the project folder (`res://`).
		- **Write access** is restricted purely inside a dedicated system app data folder (`user://`).
		- Folder path: `C:\Users\Username\AppData\Roaming\LOVE\identity_name` (Windows) or `~/Library/Application Support/LOVE/identity_name` (macOS).
	-
	- ## Reading & Writing Files
	  collapsed:: true
		- ```lua
		  -- Write file to user save directory
		  function save_game_score(score)
		      local data = tostring(score)
		      local success, message = love.filesystem.write("score.txt", data)
		      if success then
		          print("Game saved successfully")
		      else
		          print("Write failed: " .. message)
		      end
		  end
		  
		  -- Read file
		  function load_game_score()
		      if love.filesystem.getInfo("score.txt") then
		          local contents, size = love.filesystem.read("score.txt")
		          return tonumber(contents)
		      end
		      return 0 -- Default score
		  end
		  ```
-
- # Shaders (GLSL)
  collapsed:: true
	- ## Vertex and Pixel Shaders in LÖVE
	  collapsed:: true
		- LÖVE uses custom dialect matching OpenGL ES 2.0 / 3.0 shading languages (GLSL).
		- **Pixel shader** entry point: `effect(vec4 color, Image texture, vec2 texture_coords, vec2 screen_coords)`.
		- **Vertex shader** entry point: `position(mat4 transform_projection, vec4 vertex_position)`.
		- ```lua
		  local shader
		  local time = 0
		  
		  function love.load()
		      -- Simple CRT Scanline/Grayscale Pixel Shader
		      shader = love.graphics.newShader[[
		          extern number time; -- uniform passed from Lua
		          
		          vec4 effect(vec4 color, Image texture, vec2 texture_coords, vec2 screen_coords) {
		              vec4 tex_color = Texel(texture, texture_coords);
		              
		              -- Make grayscale
		              float gray = dot(tex_color.rgb, vec3(0.299, 0.587, 0.114));
		              vec3 gray_color = vec3(gray);
		              
		              -- Scanline overlay effect
		              float scanline = sin(screen_coords.y * 2.0 + time * 10.0) * 0.1 + 0.9;
		              
		              return vec4(gray_color * scanline, tex_color.a) * color;
		          }
		      ]]
		  end
		  
		  function love.update(dt)
		      time = time + dt
		      -- Send variables to GPU
		      shader:send("time", time)
		  end
		  
		  function love.draw()
		      -- Set active GPU shader
		      love.graphics.setShader(shader)
		      
		      -- Draw images/textures containing shader logic
		      love.graphics.draw(background_img, 0, 0)
		      
		      -- Deactivate shader to resume normal unshaded rendering
		      love.graphics.setShader()
		  end
		  ```
-
- # Popular Community Libraries
  collapsed:: true
	- LÖVE does not provide structural abstractions. The community utilizes standard modules to bootstrap structural architecture.
	-
	- ## Structural & Game Management
	  collapsed:: true
		- **hump.gamestate**: State stack manager for loading/swapping screens (Menu, Intro, Game, Pause).
		- **classic**: Elegant, minimal Object Oriented class helper inside Lua.
		- **hump.vector**: Lightweight 2D vector mathematics library.
	-
	- ## Camera & Visuals
	  collapsed:: true
		- **gamera**: 2D camera library with boundaries, zoom, rotation, and screen shaking.
		- **anim8**: Animation state machine helper designed for spritesheets using Quads.
	-
	- ## UI & Collision
	  collapsed:: true
		- **Slab / SUIT**: Immediate mode Graphical User Interface (IMGUI) libraries for game UI development.
		- **bump.lua**: Lightweight, non-physics axis-aligned bounding box (AABB) collision library (ideal for platformers without complex Box2D integration).
		- **Simple-Tiled-Implementation (STI)**: Custom loader and parser for Tiled Map Editor JSON maps in LÖVE.