---
seoTitle: Intel TBB – Threading Building Blocks C++ Parallel Programming
description: "Intel TBB (Threading Building Blocks) reference for C++ parallel programming. Covers parallel_for, parallel_reduce, task groups, concurrent containers, and flow graphs."
keywords: "Intel TBB, Threading Building Blocks, C++ parallel programming, parallel_for, parallel_reduce, task groups, concurrent containers, oneTBB, multi-core, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: TBB (Threading Building Blocks)
---

- # History
  collapsed:: true
	- **Who**: Developed by Intel. Now open-source as oneTBB under the oneAPI umbrella.
	- **Why**: To provide high-level parallel programming abstractions for C++ that automatically scale to available CPU cores — without manual thread management.
	- **When**: First released in 2006. Open-sourced in 2016. Rebranded as oneTBB in 2020.
- # Introduction
  collapsed:: true
	- ## What is TBB?
		- A C++ template library for task-based parallelism that abstracts thread management.
		- Automatically distributes work across available CPU cores using a work-stealing scheduler.
		- GitHub: [oneapi-src/oneTBB](https://github.com/oneapi-src/oneTBB)
	-
	- ## Advantages
	  collapsed:: true
		- High-level API — no manual thread creation or synchronization for most use cases.
		- Work-stealing scheduler maximizes CPU utilization.
		- Concurrent containers (queue, hash map, vector) for thread-safe data structures.
		- Composable — parallel algorithms can be nested.
		- Scales automatically to available cores.
	-
	- ## Disadvantages
	  collapsed:: true
		- Overhead for very small tasks (use only when work is substantial).
		- Learning curve for flow graphs and advanced features.
		- Requires linking against TBB library.
- # Installation & Setup
  collapsed:: true
	- ## apt (Ubuntu)
		- ```bash
		  sudo apt install libtbb-dev
		  ```
	-
	- ## vcpkg
		- ```bash
		  vcpkg install tbb
		  ```
	-
	- ## CMake
		- ```cmake
		  find_package(TBB REQUIRED)
		  target_link_libraries(MyApp TBB::tbb)
		  ```
	-
	- ## Include
		- ```cpp
		  #include <tbb/tbb.h>
		  // or specific headers:
		  #include <tbb/parallel_for.h>
		  #include <tbb/parallel_reduce.h>
		  #include <tbb/concurrent_queue.h>
		  ```
- # Core Concepts
  collapsed:: true
	- ## parallel_for — Parallel Loop
	  collapsed:: true
		- ```cpp
		  #include <tbb/parallel_for.h>
		  #include <tbb/blocked_range.h>
		  #include <vector>
		  
		  std::vector<double> data(1000000, 1.0);
		  
		  // Parallel loop over range [0, data.size())
		  tbb::parallel_for(
		      tbb::blocked_range<size_t>(0, data.size()),
		      [&](const tbb::blocked_range<size_t>& r) {
		          for (size_t i = r.begin(); i < r.end(); ++i) {
		              data[i] = data[i] * 2.0 + 1.0; // heavy computation
		          }
		      }
		  );
		  
		  // Simple index-based parallel_for (TBB 2020+)
		  tbb::parallel_for(size_t(0), data.size(), [&](size_t i) {
		      data[i] *= 2.0;
		  });
		  ```
	-
	- ## parallel_reduce — Parallel Reduction
	  collapsed:: true
		- ```cpp
		  #include <tbb/parallel_reduce.h>
		  #include <tbb/blocked_range.h>
		  
		  std::vector<double> v(1000000);
		  // fill v...
		  
		  // Sum all elements in parallel
		  double total = tbb::parallel_reduce(
		      tbb::blocked_range<size_t>(0, v.size()),
		      0.0,  // identity value
		      [&](const tbb::blocked_range<size_t>& r, double init) {
		          for (size_t i = r.begin(); i < r.end(); ++i)
		              init += v[i];
		          return init;
		      },
		      std::plus<double>()  // combine partial results
		  );
		  
		  std::cout << "Sum: " << total;
		  ```
	-
	- ## parallel_invoke — Run Tasks Concurrently
	  collapsed:: true
		- ```cpp
		  #include <tbb/parallel_invoke.h>
		  
		  void taskA() { /* heavy work */ }
		  void taskB() { /* heavy work */ }
		  void taskC() { /* heavy work */ }
		  
		  // Run all three concurrently
		  tbb::parallel_invoke(taskA, taskB, taskC);
		  // All three complete before continuing
		  ```
	-
	- ## parallel_sort
	  collapsed:: true
		- ```cpp
		  #include <tbb/parallel_sort.h>
		  #include <vector>
		  
		  std::vector<int> v = {5, 3, 1, 4, 2, 8, 7, 6};
		  
		  tbb::parallel_sort(v.begin(), v.end());
		  // v = {1, 2, 3, 4, 5, 6, 7, 8}
		  
		  // Custom comparator
		  tbb::parallel_sort(v.begin(), v.end(), std::greater<int>());
		  // v = {8, 7, 6, 5, 4, 3, 2, 1}
		  ```
- # Concurrent Containers
  collapsed:: true
	- ## concurrent_queue
	  collapsed:: true
		- ```cpp
		  #include <tbb/concurrent_queue.h>
		  
		  tbb::concurrent_queue<int> queue;
		  
		  // Producer (thread-safe push)
		  queue.push(42);
		  queue.push(100);
		  
		  // Consumer (thread-safe pop)
		  int val;
		  if (queue.try_pop(val)) {
		      std::cout << "Got: " << val;
		  }
		  
		  std::cout << "Size: " << queue.unsafe_size();
		  ```
	-
	- ## concurrent_hash_map
	  collapsed:: true
		- ```cpp
		  #include <tbb/concurrent_hash_map.h>
		  
		  tbb::concurrent_hash_map<std::string, int> map;
		  
		  // Insert
		  {
		      tbb::concurrent_hash_map<std::string, int>::accessor acc;
		      map.insert(acc, "key");
		      acc->second = 42;
		  }
		  
		  // Read
		  {
		      tbb::concurrent_hash_map<std::string, int>::const_accessor acc;
		      if (map.find(acc, "key")) {
		          std::cout << acc->second; // 42
		      }
		  }
		  ```
	-
	- ## concurrent_vector
	  collapsed:: true
		- ```cpp
		  #include <tbb/concurrent_vector.h>
		  
		  tbb::concurrent_vector<int> cv;
		  
		  // Thread-safe push_back
		  tbb::parallel_for(0, 1000, [&](int i) {
		      cv.push_back(i);
		  });
		  
		  std::cout << "Size: " << cv.size(); // 1000
		  ```
- # Task Groups
  collapsed:: true
	- ```cpp
	  #include <tbb/task_group.h>
	  
	  tbb::task_group tg;
	  
	  tg.run([] { std::cout << "Task 1\n"; });
	  tg.run([] { std::cout << "Task 2\n"; });
	  tg.run([] { std::cout << "Task 3\n"; });
	  
	  tg.wait(); // wait for all tasks to complete
	  ```
- # More Learn
	- [oneTBB GitHub](https://github.com/oneapi-src/oneTBB)
	- [TBB Developer Guide](https://www.intel.com/content/www/us/en/docs/onetbb/developer-guide-api-reference/2021-6/overview.html)
	- [TBB Tutorial](https://www.threadingbuildingblocks.org/tutorial-intel-tbb-flow-graph)