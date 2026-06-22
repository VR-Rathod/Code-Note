---
seoTitle: SDL2 – Simple DirectMedia Layer C++ Game Dev Reference
description: "SDL2 (Simple DirectMedia Layer) reference for C++ game development. Covers window creation, rendering, input, audio, textures, events, and SDL_image/SDL_mixer."
keywords: "SDL2, Simple DirectMedia Layer, C++ game development, SDL rendering, SDL input, SDL audio, SDL textures, SDL events, game loop, cross-platform, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: SDL2 (Simple DirectMedia Layer)
---

- # History
  collapsed:: true
	- **Who**: Created by Sam Lantinga while working at Loki Software.
	- **Why**: To provide a cross-platform abstraction layer for graphics, audio, and input — enabling games to run on Windows, Linux, macOS, and consoles from a single codebase.
	- **When**: SDL 1.0 released in 1998. SDL2 (major rewrite) released in 2013. SDL3 released in 2024.
- # Introduction
  collapsed:: true
	- ## What is SDL2?
		- A cross-platform multimedia library providing low-level access to audio, keyboard, mouse, joystick, and graphics hardware via OpenGL/Direct3D.
		- Used by thousands of games and emulators. Powers many indie games on Steam.
		- Website: [libsdl.org](https://www.libsdl.org/)
	-
	- ## Advantages
	  collapsed:: true
		- Cross-platform: Windows, Linux, macOS, iOS, Android, consoles.
		- Simple, C-based API — easy to use from C++.
		- Hardware-accelerated 2D rendering.
		- Excellent ecosystem: SDL_image, SDL_mixer, SDL_ttf, SDL_net.
		- Widely used — large community and documentation.
	-
	- ## Disadvantages
	  collapsed:: true
		- 2D only in core SDL (need OpenGL/Vulkan for 3D).
		- C API — not object-oriented (wrap it yourself or use SDL2pp).
		- SDL3 is a breaking change from SDL2.
- # Installation & Setup
  collapsed:: true
	- ## Linux (apt)
		- ```bash
		  sudo apt install libsdl2-dev libsdl2-image-dev libsdl2-mixer-dev libsdl2-ttf-dev
		  ```
	-
	- ## macOS (Homebrew)
		- ```bash
		  brew install sdl2 sdl2_image sdl2_mixer sdl2_ttf
		  ```
	-
	- ## Windows (vcpkg)
		- ```bash
		  vcpkg install sdl2 sdl2-image sdl2-mixer sdl2-ttf
		  ```
	-
	- ## CMake
		- ```cmake
		  find_package(SDL2 REQUIRED)
		  target_link_libraries(MyGame SDL2::SDL2 SDL2::SDL2main)
		  ```
- # Core Concepts
  collapsed:: true
	- ## Initialization & Window
	  collapsed:: true
		- ```c++
		  #include <SDL2/SDL.h>
		  
		  int main(int argc, char* argv[]) {
		      // Initialize SDL subsystems
		      if (SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO) < 0) {
		          SDL_Log("Init failed: %s", SDL_GetError());
		          return 1;
		      }
		  
		      // Create window
		      SDL_Window* window = SDL_CreateWindow(
		          "My Game",           // title
		          SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
		          800, 600,            // width, height
		          SDL_WINDOW_SHOWN     // flags
		      );
		  
		      if (!window) {
		          SDL_Log("Window failed: %s", SDL_GetError());
		          SDL_Quit();
		          return 1;
		      }
		  
		      // ... game loop ...
		  
		      SDL_DestroyWindow(window);
		      SDL_Quit();
		      return 0;
		  }
		  ```
	-
	- ## Renderer & Drawing
	  collapsed:: true
		- ```c++
		  // Create hardware-accelerated renderer
		  SDL_Renderer* renderer = SDL_CreateRenderer(
		      window, -1,
		      SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC
		  );
		  
		  // Game loop
		  bool running = true;
		  SDL_Event event;
		  
		  while (running) {
		      // Handle events
		      while (SDL_PollEvent(&event)) {
		          if (event.type == SDL_QUIT) running = false;
		      }
		  
		      // Clear screen (black)
		      SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
		      SDL_RenderClear(renderer);
		  
		      // Draw a red rectangle
		      SDL_SetRenderDrawColor(renderer, 255, 0, 0, 255);
		      SDL_Rect rect = {100, 100, 200, 150};
		      SDL_RenderFillRect(renderer, &rect);
		  
		      // Draw a blue line
		      SDL_SetRenderDrawColor(renderer, 0, 0, 255, 255);
		      SDL_RenderDrawLine(renderer, 0, 0, 800, 600);
		  
		      // Present frame
		      SDL_RenderPresent(renderer);
		  }
		  
		  SDL_DestroyRenderer(renderer);
		  ```
- # Input Handling
  collapsed:: true
	- ## Keyboard
	  collapsed:: true
		- ```c++
		  SDL_Event event;
		  while (SDL_PollEvent(&event)) {
		      if (event.type == SDL_KEYDOWN) {
		          switch (event.key.keysym.sym) {
		              case SDLK_ESCAPE: running = false; break;
		              case SDLK_LEFT:   player.x -= 5; break;
		              case SDLK_RIGHT:  player.x += 5; break;
		              case SDLK_UP:     player.y -= 5; break;
		              case SDLK_DOWN:   player.y += 5; break;
		          }
		      }
		  }
		  
		  // Continuous key state (for smooth movement)
		  const Uint8* keys = SDL_GetKeyboardState(nullptr);
		  if (keys[SDL_SCANCODE_LEFT])  player.x -= speed;
		  if (keys[SDL_SCANCODE_RIGHT]) player.x += speed;
		  ```
	-
	- ## Mouse
	  collapsed:: true
		- ```c++
		  SDL_Event event;
		  while (SDL_PollEvent(&event)) {
		      if (event.type == SDL_MOUSEBUTTONDOWN) {
		          if (event.button.button == SDL_BUTTON_LEFT) {
		              int x = event.button.x;
		              int y = event.button.y;
		              SDL_Log("Clicked at %d, %d", x, y);
		          }
		      }
		      if (event.type == SDL_MOUSEMOTION) {
		          int mx = event.motion.x;
		          int my = event.motion.y;
		      }
		  }
		  ```
- # Textures & Images (SDL_image)
  collapsed:: true
	- ```c++
	  #include <SDL2/SDL_image.h>
	  
	  // Initialize SDL_image
	  IMG_Init(IMG_INIT_PNG | IMG_INIT_JPG);
	  
	  // Load image as texture
	  SDL_Surface* surface = IMG_Load("player.png");
	  SDL_Texture* texture = SDL_CreateTextureFromSurface(renderer, surface);
	  SDL_FreeSurface(surface);
	  
	  // Draw texture
	  SDL_Rect src = {0, 0, 64, 64};   // source rect (sprite sheet)
	  SDL_Rect dst = {100, 100, 64, 64}; // destination on screen
	  SDL_RenderCopy(renderer, texture, &src, &dst);
	  
	  // Rotate & flip
	  SDL_RenderCopyEx(renderer, texture, &src, &dst,
	      45.0,              // rotation angle (degrees)
	      nullptr,           // rotation center (nullptr = center)
	      SDL_FLIP_NONE      // SDL_FLIP_HORIZONTAL, SDL_FLIP_VERTICAL
	  );
	  
	  SDL_DestroyTexture(texture);
	  IMG_Quit();
	  ```
- # Audio (SDL_mixer)
  collapsed:: true
	- ```c++
	  #include <SDL2/SDL_mixer.h>
	  
	  // Initialize mixer
	  Mix_OpenAudio(44100, MIX_DEFAULT_FORMAT, 2, 2048);
	  
	  // Load and play music (loops)
	  Mix_Music* music = Mix_LoadMUS("background.ogg");
	  Mix_PlayMusic(music, -1); // -1 = loop forever
	  
	  // Load and play sound effect
	  Mix_Chunk* sfx = Mix_LoadWAV("jump.wav");
	  Mix_PlayChannel(-1, sfx, 0); // -1 = first free channel
	  
	  // Volume (0-128)
	  Mix_VolumeMusic(64);
	  
	  // Cleanup
	  Mix_FreeChunk(sfx);
	  Mix_FreeMusic(music);
	  Mix_CloseAudio();
	  ```
- # Delta Time & Frame Rate
  collapsed:: true
	- ```c++
	  Uint32 lastTime = SDL_GetTicks();
	  
	  while (running) {
	      Uint32 currentTime = SDL_GetTicks();
	      float deltaTime = (currentTime - lastTime) / 1000.0f; // seconds
	      lastTime = currentTime;
	  
	      // Move at 200 pixels/second regardless of frame rate
	      player.x += 200.0f * deltaTime;
	  
	      // Cap to ~60 FPS
	      SDL_Delay(16);
	  }
	  ```
- # More Learn
	- [SDL2 Official Docs](https://wiki.libsdl.org/SDL2/FrontPage)
	- [Lazy Foo SDL2 Tutorials](https://lazyfoo.net/tutorials/SDL/)
	- [SDL2 Game Dev (YouTube)](https://www.youtube.com/results?search_query=SDL2+game+development)
	- [SDL2 GitHub](https://github.com/libsdl-org/SDL)