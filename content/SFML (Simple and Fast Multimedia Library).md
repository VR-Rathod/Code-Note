---
date: 2026-04-08T11:19:07+05:30
lastmod: 2026-05-18T10:12:55+05:30

seoTitle: SFML – Simple and Fast Multimedia Library C++ Reference
description: "SFML (Simple and Fast Multimedia Library) reference for C++ game development. Covers window, graphics, audio, networking, and system modules with examples."
keywords: "SFML, Simple and Fast Multimedia Library, C++ game development, SFML graphics, SFML audio, SFML networking, sprites, textures, game loop, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: SFML (Simple and Fast Multimedia Library)
---

- # History
  collapsed:: true
	- **Who**: Created by Laurent Gomila.
	- **Why**: To provide a modern, object-oriented C++ alternative to SDL — with a cleaner API, built-in networking, and native C++ design (classes, RAII, no manual cleanup).
	- **When**: First released in 2007. SFML 2.x is the stable version. SFML 3.0 released in 2024 with C++17 and improved API.
- # Introduction
  collapsed:: true
	- ## What is SFML?
		- A cross-platform C++ multimedia library organized into 5 modules: System, Window, Graphics, Audio, Network.
		- Designed for 2D game development with a clean, object-oriented API.
		- Website: [sfml-dev.org](https://www.sfml-dev.org/)
	-
	- ## Advantages
	  collapsed:: true
		- Clean C++ OOP API — no manual resource management (RAII).
		- Built-in networking module (TCP/UDP sockets).
		- Easy sprite, texture, font, and sound management.
		- Cross-platform: Windows, Linux, macOS, iOS, Android.
		- Great for learning game development.
	-
	- ## Disadvantages
	  collapsed:: true
		- 2D only (no built-in 3D — use OpenGL alongside).
		- Smaller community than SDL.
		- SFML 3 has breaking changes from SFML 2.
- # Installation & Setup
  collapsed:: true
	- ## Linux (apt)
		- ```bash
		  sudo apt install libsfml-dev
		  ```
	-
	- ## macOS (Homebrew)
		- ```bash
		  brew install sfml
		  ```
	-
	- ## Windows (vcpkg)
		- ```bash
		  vcpkg install sfml
		  ```
	-
	- ## CMake
		- ```cmake
		  find_package(SFML 2.6 COMPONENTS graphics audio network REQUIRED)
		  target_link_libraries(MyGame sfml-graphics sfml-audio sfml-network)
		  ```
- # Core Concepts
  collapsed:: true
	- ## Window & Game Loop
	  collapsed:: true
		- ```cpp
		  #include <SFML/Graphics.hpp>
		  
		  int main() {
		      sf::RenderWindow window(
		          sf::VideoMode(800, 600),
		          "My SFML Game",
		          sf::Style::Default
		      );
		      window.setFramerateLimit(60);
		  
		      while (window.isOpen()) {
		          sf::Event event;
		          while (window.pollEvent(event)) {
		              if (event.type == sf::Event::Closed)
		                  window.close();
		              if (event.type == sf::Event::KeyPressed)
		                  if (event.key.code == sf::Keyboard::Escape)
		                      window.close();
		          }
		  
		          window.clear(sf::Color::Black);
		          // draw here
		          window.display();
		      }
		      return 0;
		  }
		  ```
	-
	- ## Shapes
	  collapsed:: true
		- ```cpp
		  // Circle
		  sf::CircleShape circle(50.f);  // radius 50
		  circle.setFillColor(sf::Color::Green);
		  circle.setOutlineColor(sf::Color::White);
		  circle.setOutlineThickness(2.f);
		  circle.setPosition(100.f, 100.f);
		  
		  // Rectangle
		  sf::RectangleShape rect(sf::Vector2f(200.f, 100.f));
		  rect.setFillColor(sf::Color(100, 150, 250));
		  rect.setPosition(300.f, 200.f);
		  
		  // Convex polygon
		  sf::ConvexShape triangle;
		  triangle.setPointCount(3);
		  triangle.setPoint(0, sf::Vector2f(0, 0));
		  triangle.setPoint(1, sf::Vector2f(100, 0));
		  triangle.setPoint(2, sf::Vector2f(50, 100));
		  triangle.setFillColor(sf::Color::Red);
		  
		  window.draw(circle);
		  window.draw(rect);
		  window.draw(triangle);
		  ```
- # Sprites & Textures
  collapsed:: true
	- ```cpp
	  sf::Texture texture;
	  if (!texture.loadFromFile("player.png")) {
	      return -1; // file not found
	  }
	  
	  sf::Sprite sprite(texture);
	  sprite.setPosition(200.f, 150.f);
	  sprite.setScale(2.f, 2.f);       // 2x size
	  sprite.setRotation(45.f);         // degrees
	  sprite.setColor(sf::Color(255, 255, 255, 128)); // 50% transparent
	  
	  // Sprite sheet — use texture rect
	  sprite.setTextureRect(sf::IntRect(0, 0, 64, 64)); // x, y, w, h
	  
	  window.draw(sprite);
	  ```
- # Input Handling
  collapsed:: true
	- ## Keyboard
	  collapsed:: true
		- ```cpp
		  // Event-based (one-shot)
		  if (event.type == sf::Event::KeyPressed) {
		      if (event.key.code == sf::Keyboard::Space)
		          player.jump();
		  }
		  
		  // Real-time (continuous)
		  if (sf::Keyboard::isKeyPressed(sf::Keyboard::Left))
		      player.x -= speed * dt;
		  if (sf::Keyboard::isKeyPressed(sf::Keyboard::Right))
		      player.x += speed * dt;
		  ```
	-
	- ## Mouse
	  collapsed:: true
		- ```cpp
		  // Mouse position
		  sf::Vector2i mousePos = sf::Mouse::getPosition(window);
		  
		  // Event-based click
		  if (event.type == sf::Event::MouseButtonPressed) {
		      if (event.mouseButton.button == sf::Mouse::Left) {
		          int x = event.mouseButton.x;
		          int y = event.mouseButton.y;
		      }
		  }
		  ```
- # Text & Fonts
  collapsed:: true
	- ```cpp
	  sf::Font font;
	  font.loadFromFile("arial.ttf");
	  
	  sf::Text text;
	  text.setFont(font);
	  text.setString("Score: 100");
	  text.setCharacterSize(24);
	  text.setFillColor(sf::Color::White);
	  text.setStyle(sf::Text::Bold | sf::Text::Underlined);
	  text.setPosition(10.f, 10.f);
	  
	  window.draw(text);
	  ```
- # Audio
  collapsed:: true
	- ```cpp
	  #include <SFML/Audio.hpp>
	  
	  // Sound effect (short, loaded into memory)
	  sf::SoundBuffer buffer;
	  buffer.loadFromFile("jump.wav");
	  sf::Sound sound(buffer);
	  sound.play();
	  sound.setVolume(80.f); // 0-100
	  
	  // Music (streamed from disk — for long tracks)
	  sf::Music music;
	  music.openFromFile("background.ogg");
	  music.setLoop(true);
	  music.play();
	  music.setVolume(50.f);
	  ```
- # Networking
  collapsed:: true
	- ```cpp
	  #include <SFML/Network.hpp>
	  
	  // TCP Client
	  sf::TcpSocket socket;
	  sf::Socket::Status status = socket.connect("localhost", 5000);
	  if (status == sf::Socket::Done) {
	      std::string msg = "Hello Server";
	      socket.send(msg.c_str(), msg.size());
	  }
	  
	  // TCP Server
	  sf::TcpListener listener;
	  listener.listen(5000);
	  sf::TcpSocket client;
	  listener.accept(client);
	  
	  char buffer[1024];
	  std::size_t received;
	  client.receive(buffer, sizeof(buffer), received);
	  ```
- # Delta Time
  collapsed:: true
	- ```cpp
	  sf::Clock clock;
	  
	  while (window.isOpen()) {
	      float dt = clock.restart().asSeconds();
	  
	      // Move at 200 pixels/second
	      player.move(200.f * dt, 0.f);
	  }
	  ```
- # More Learn
	- [SFML Official Docs](https://www.sfml-dev.org/documentation/)
	- [SFML Tutorials](https://www.sfml-dev.org/tutorials/)
	- [SFML GitHub](https://github.com/SFML/SFML)
	- [SFML Game Dev Book](https://www.sfml-dev.org/learn.php)