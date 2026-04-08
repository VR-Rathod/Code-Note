---
seoTitle: spdlog – Fast C++ Logging Library Complete Reference
description: "spdlog is a fast, header-only C++ logging library. Covers loggers, sinks, formatters, async logging, rotating files, and custom patterns."
keywords: "spdlog, C++ logging, fast logging, header-only, sinks, async logging, rotating file, C++ logger, log levels, fmt, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: spdlog
---

- # History
  collapsed:: true
	- **Who**: Created by Gabi Melman (gabime on GitHub).
	- **Why**: To provide a very fast, zero-overhead logging library for C++ that is easy to use and supports multiple output targets (sinks).
	- **When**: First released around 2014. Now one of the most popular C++ logging libraries.

- # Introduction
  collapsed:: true
	- ## What is spdlog?
		- A fast, header-only (or compiled) C++ logging library.
		- Built on top of the `{fmt}` formatting library.
		- GitHub: [gabime/spdlog](https://github.com/gabime/spdlog)
	-
	- ## Advantages
	  collapsed:: true
		- Extremely fast — benchmarks show millions of log calls per second.
		- Header-only option — easy to integrate.
		- Multiple sinks: console, file, rotating file, daily file, syslog.
		- Async logging support.
		- Thread-safe by default.
		- Uses `{fmt}` syntax for formatting.
	-
	- ## Disadvantages
	  collapsed:: true
		- Depends on `{fmt}` library (bundled, but adds compile time).
		- Compiled mode requires build system setup.

- # Installation & Setup
  collapsed:: true
	- ## vcpkg
		- ```bash
		  vcpkg install spdlog
		  ```
	-
	- ## apt (Ubuntu)
		- ```bash
		  sudo apt install libspdlog-dev
		  ```
	-
	- ## CMake (FetchContent)
		- ```cmake
		  include(FetchContent)
		  FetchContent_Declare(spdlog
		      GIT_REPOSITORY https://github.com/gabime/spdlog.git
		      GIT_TAG v1.13.0
		  )
		  FetchContent_MakeAvailable(spdlog)
		  target_link_libraries(MyApp spdlog::spdlog)
		  ```
	-
	- ## Header-only include
		- ```cpp
		  #include <spdlog/spdlog.h>
		  ```

- # Core Concepts
  collapsed:: true
	- ## Basic Logging
	  collapsed:: true
		- ```cpp
		  #include <spdlog/spdlog.h>
		  
		  int main() {
		      spdlog::info("Hello, {}!", "world");
		      spdlog::warn("Warning: value is {}", 42);
		      spdlog::error("Error code: {}", -1);
		      spdlog::critical("Critical failure!");
		      spdlog::debug("Debug: x={}, y={}", 1.5, 2.5);
		      spdlog::trace("Trace level message");
		  }
		  // Output: [2024-01-01 12:00:00.000] [info] Hello, world!
		  ```
	-
	- ## Log Levels
	  collapsed:: true
		- ```cpp
		  // Levels (lowest to highest):
		  // trace < debug < info < warn < error < critical < off
		  
		  spdlog::set_level(spdlog::level::debug); // show debug and above
		  spdlog::set_level(spdlog::level::warn);  // show warn and above only
		  
		  spdlog::debug("This shows if level <= debug");
		  spdlog::info("This shows if level <= info");
		  ```
	-
	- ## Named Loggers
	  collapsed:: true
		- ```cpp
		  #include <spdlog/spdlog.h>
		  
		  auto logger = spdlog::stdout_color_mt("my_logger");
		  logger->info("Message from named logger");
		  logger->set_level(spdlog::level::debug);
		  
		  // Retrieve logger by name anywhere in code
		  auto same = spdlog::get("my_logger");
		  same->warn("Retrieved logger");
		  ```

- # Sinks — Output Targets
  collapsed:: true
	- ## Console Sink (colored)
	  collapsed:: true
		- ```cpp
		  #include <spdlog/sinks/stdout_color_sinks.h>
		  
		  auto console = spdlog::stdout_color_mt("console");
		  console->info("Colored console output");
		  
		  // stderr
		  auto err_logger = spdlog::stderr_color_mt("stderr");
		  err_logger->error("Error to stderr");
		  ```
	-
	- ## File Sink
	  collapsed:: true
		- ```cpp
		  #include <spdlog/sinks/basic_file_sink.h>
		  
		  auto file_logger = spdlog::basic_logger_mt("file_logger", "logs/app.log");
		  file_logger->info("Logged to file");
		  
		  // Truncate on open
		  auto trunc = spdlog::basic_logger_mt("trunc", "logs/app.log", true);
		  ```
	-
	- ## Rotating File Sink
	  collapsed:: true
		- ```cpp
		  #include <spdlog/sinks/rotating_file_sink.h>
		  
		  // Max 5MB per file, keep 3 files
		  auto rotating = spdlog::rotating_logger_mt(
		      "rotating", "logs/app.log",
		      1024 * 1024 * 5,  // 5MB
		      3                  // 3 files
		  );
		  rotating->info("This rotates when file hits 5MB");
		  ```
	-
	- ## Daily File Sink
	  collapsed:: true
		- ```cpp
		  #include <spdlog/sinks/daily_file_sink.h>
		  
		  // New file every day at 02:30
		  auto daily = spdlog::daily_logger_mt("daily", "logs/daily.log", 2, 30);
		  daily->info("Daily log entry");
		  ```
	-
	- ## Multi-Sink Logger
	  collapsed:: true
		- ```cpp
		  #include <spdlog/sinks/stdout_color_sinks.h>
		  #include <spdlog/sinks/rotating_file_sink.h>
		  #include <spdlog/logger.h>
		  
		  auto console_sink = std::make_shared<spdlog::sinks::stdout_color_sink_mt>();
		  auto file_sink = std::make_shared<spdlog::sinks::rotating_file_sink_mt>(
		      "logs/multi.log", 1024*1024, 5);
		  
		  spdlog::logger logger("multi", {console_sink, file_sink});
		  logger.info("Goes to both console and file");
		  ```

- # Async Logging
  collapsed:: true
	- ```cpp
	  #include <spdlog/async.h>
	  #include <spdlog/sinks/basic_file_sink.h>
	  
	  // Initialize async thread pool: queue size, thread count
	  spdlog::init_thread_pool(8192, 1);
	  
	  auto async_logger = spdlog::basic_logger_async_mt(
	      "async_logger", "logs/async.log");
	  
	  async_logger->info("Non-blocking async log");
	  
	  // Flush before exit
	  spdlog::shutdown();
	  ```

- # Custom Patterns
  collapsed:: true
	- ```cpp
	  // Pattern flags:
	  // %Y-%m-%d  date
	  // %H:%M:%S  time
	  // %e        milliseconds
	  // %l        log level
	  // %n        logger name
	  // %v        message
	  // %t        thread id
	  // %s        source file
	  // %#        source line
	  
	  spdlog::set_pattern("[%Y-%m-%d %H:%M:%S.%e] [%n] [%l] [thread %t] %v");
	  spdlog::info("Custom pattern message");
	  // [2024-01-01 12:00:00.123] [root] [info] [thread 1234] Custom pattern message
	  ```

- # Flush Policy
  collapsed:: true
	- ```cpp
	  // Flush on every error or above
	  spdlog::flush_on(spdlog::level::err);
	  
	  // Periodic flush every 3 seconds
	  spdlog::flush_every(std::chrono::seconds(3));
	  
	  // Manual flush
	  spdlog::get("my_logger")->flush();
	  ```

- # More Learn
	- [spdlog GitHub](https://github.com/gabime/spdlog)
	- [spdlog Wiki](https://github.com/gabime/spdlog/wiki)
	- [fmt library](https://github.com/fmtlib/fmt)
