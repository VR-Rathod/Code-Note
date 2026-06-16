---
seoTitle: Pygame Python Library - 2D Game Development Reference Guide
description: "Pygame enables 2D game development in Python. Covers display, sprites, events, sound, collision detection, surfaces, and game loop architecture."
keywords: "Pygame, Python game development, 2D games, sprites, collision detection, sound, events, game loop, surfaces, Python library, game programming, SDL"
---

- # 📘 **Overview**
	- **What is it?**: Pygame is a cross-platform set of Python modules designed for writing video games. It includes computer graphics and sound libraries designed to be used with the Python programming language, acting as a high-level wrapper over SDL (Simple DirectMedia Layer).
	- **Key Features**:
		- **Simple Game Loop**: Standard paradigm handling events, game states, and rendering.
		- **2D Graphics**: Fast loading and drawing of images (Surfaces) and handling coordinate spaces (Rects).
		- **Collision Handling**: Easy bounding box and circle-based collision checks.
		- **Input handling**: Built-in support for keyboard, mouse, and game controllers.
	- **Installation**:
		- ```bash
		  pip install pygame
		  ```
- # 🧾 **Core Concepts**
	- **Game Loop**: The continuous cycle that runs while the game is open. It handles:
		- 1. Input events (polling keyboard/mouse).
		- 2. Game logic updates (updating positions, checking collisions).
		- 3. Rendering (clearing screen, drawing sprites, flipping display).
	- **Surfaces**: Objects representing images. The main window is a Surface, and characters/backgrounds are drawn onto it.
	- **Rect**: A rectangle object used to store and manipulate rectangular areas (coordinates, widths, heights) - crucial for movement and collision detection.
- # 💻 **Common Code Patterns & Cheat Sheet**
	- **Basic Game Window & Loop**:
		- ```python
		  import pygame
		  import sys
		  
		  # Initialize all Pygame modules
		  pygame.init()
		  
		  # Setup screen
		  screen = pygame.display.set_mode((800, 600))
		  pygame.display.set_caption("My Pygame Game")
		  
		  # Clock to limit FPS
		  clock = pygame.time.Clock()
		  
		  # Game Loop
		  running = True
		  while running:
		      # 1. Event Polling
		      for event in pygame.event.get():
		          if event.type == pygame.QUIT:
		              running = False
		              
		      # 2. Logic Updates
		      # (update sprite positions, check collisions, etc.)
		      
		      # 3. Drawing
		      screen.fill((0, 0, 0))  # Clear screen with black background
		      
		      # Redraw display
		      pygame.display.flip()
		      
		      # Cap framerate to 60 FPS
		      clock.tick(60)
		      
		  pygame.quit()
		  sys.exit()
		  ```
	- **Handling Keyboard Input & Movement**:
		- ```python
		  # Inside the game loop:
		  keys = pygame.key.get_pressed()
		  
		  # Move player rectangle
		  player_rect = pygame.Rect(100, 100, 50, 50)
		  speed = 5
		  
		  if keys[pygame.K_LEFT]:
		      player_rect.x -= speed
		  if keys[pygame.K_RIGHT]:
		      player_rect.x += speed
		  if keys[pygame.K_UP]:
		      player_rect.y -= speed
		  if keys[pygame.K_DOWN]:
		      player_rect.y += speed
		  ```
	- **Drawing Shapes & Checking Collisions**:
		- ```python
		  # Draw red player rectangle
		  pygame.draw.rect(screen, (255, 0, 0), player_rect)
		  
		  # Create enemy rectangle
		  enemy_rect = pygame.Rect(300, 300, 50, 50)
		  pygame.draw.rect(screen, (0, 0, 255), enemy_rect)
		  
		  # Check AABB (Axis-Aligned Bounding Box) collision
		  if player_rect.colliderect(enemy_rect):
		      print("Collision detected!")
		  ```
- # 💡 **Best Practices & Tips**
	- **Framerate Independence**: Use Delta Time (`dt = clock.tick(60) / 1000.0`) to scale movements, ensuring they run at the same speed on different CPU speeds.
	- **Asset Preloading**: Load all images and sound files once outside the game loop. Loading files inside the game loop causes significant performance drop.
	- **Coordinate Space**: Always use Pygame `Rect` objects to manage positions. They provide useful attributes like `.center`, `.top`, `.bottom`, `.left`, `.right` for easy alignment.
- # 🔗 **Navigation & Internal Links**
	- **Parent**: [[Python]]
	- **Related Notes**: [[Game Development]] | [[Simple DirectMedia Layer]] | [[Simple and Fast Multimedia Library]]