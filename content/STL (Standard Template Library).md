---
seoTitle: STL – C++ Standard Template Library Complete Reference
description: "Comprehensive STL reference covering containers (vector, map, set, deque, list), iterators, algorithms, function objects, and C++11/17/20 additions."
keywords: "STL, Standard Template Library, C++ containers, vector, map, set, unordered_map, deque, list, iterators, algorithms, C++ STL reference, modern C++, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: STL (Standard Template Library)
---

- # Introduction
  collapsed:: true
	- The STL is the backbone of every C++ program. It provides three core components:
		- **Containers** — data structures (vector, map, set, deque, list, etc.)
		- **Iterators** — uniform way to traverse any container
		- **Algorithms** — sort, search, transform, and more — work on any container via iterators
	- All STL components live in the `std` namespace and are included via `#include <header>`.

- # Sequence Containers
  collapsed:: true
	- ## std::vector — Dynamic Array
	  collapsed:: true
		- ```cpp
		  #include <vector>
		  
		  std::vector<int> v = {1, 2, 3, 4, 5};
		  
		  v.push_back(6);          // add to end
		  v.pop_back();            // remove from end
		  v.insert(v.begin(), 0);  // insert at position
		  v.erase(v.begin() + 2);  // erase at position
		  v.clear();               // remove all
		  
		  std::cout << v.size();     // number of elements
		  std::cout << v.capacity(); // allocated memory
		  std::cout << v[0];         // access (no bounds check)
		  std::cout << v.at(0);      // access (throws if out of range)
		  std::cout << v.front();    // first element
		  std::cout << v.back();     // last element
		  
		  v.reserve(100);  // pre-allocate memory (avoids reallocations)
		  v.resize(10);    // resize (fills with 0 if growing)
		  v.shrink_to_fit(); // release unused capacity
		  
		  // Iterate
		  for (const auto& x : v) std::cout << x << " ";
		  ```
	-
	- ## std::deque — Double-Ended Queue
	  collapsed:: true
		- ```cpp
		  #include <deque>
		  
		  std::deque<int> dq = {2, 3, 4};
		  
		  dq.push_front(1);  // add to front — O(1)
		  dq.push_back(5);   // add to back  — O(1)
		  dq.pop_front();    // remove front
		  dq.pop_back();     // remove back
		  
		  std::cout << dq[0];     // random access — O(1)
		  std::cout << dq.size(); // 3
		  // Use when you need fast insert/remove at both ends
		  ```
	-
	- ## std::list — Doubly Linked List
	  collapsed:: true
		- ```cpp
		  #include <list>
		  
		  std::list<int> lst = {1, 2, 3, 4, 5};
		  
		  lst.push_front(0);
		  lst.push_back(6);
		  lst.pop_front();
		  lst.pop_back();
		  
		  // Insert at iterator position — O(1)
		  auto it = lst.begin();
		  std::advance(it, 2);
		  lst.insert(it, 99);
		  
		  lst.remove(99);    // remove all elements equal to 99
		  lst.sort();        // sort in-place
		  lst.reverse();     // reverse in-place
		  lst.unique();      // remove consecutive duplicates
		  
		  // No random access — must iterate
		  ```
	-
	- ## std::array — Fixed-Size Array (C++11)
	  collapsed:: true
		- ```cpp
		  #include <array>
		  
		  std::array<int, 5> arr = {1, 2, 3, 4, 5};
		  
		  std::cout << arr[0];        // 1
		  std::cout << arr.size();    // 5 (compile-time constant)
		  std::cout << arr.front();   // 1
		  std::cout << arr.back();    // 5
		  arr.fill(0);                // set all to 0
		  
		  // Prefer over C arrays — same performance, bounds-safe with .at()
		  ```
	-
	- ## std::forward_list — Singly Linked List (C++11)
	  collapsed:: true
		- ```cpp
		  #include <forward_list>
		  
		  std::forward_list<int> fl = {1, 2, 3};
		  fl.push_front(0);
		  fl.pop_front();
		  fl.insert_after(fl.begin(), 99); // insert after iterator
		  fl.remove(99);
		  fl.sort();
		  // Minimal memory overhead — no size() method
		  ```

- # Associative Containers
  collapsed:: true
	- ## std::map — Sorted Key-Value (BST)
	  collapsed:: true
		- ```cpp
		  #include <map>
		  
		  std::map<std::string, int> scores;
		  scores["Alice"] = 95;
		  scores["Bob"]   = 87;
		  scores.insert({"Charlie", 92});
		  scores.emplace("Dave", 78);
		  
		  std::cout << scores["Alice"];       // 95
		  std::cout << scores.at("Bob");      // 87 (throws if missing)
		  std::cout << scores.size();         // 4
		  std::cout << scores.count("Alice"); // 1 (0 if not found)
		  
		  scores.erase("Bob");
		  
		  // Iterate (sorted by key)
		  for (const auto& [key, val] : scores) {
		      std::cout << key << ": " << val << "\n";
		  }
		  
		  // Find
		  auto it = scores.find("Alice");
		  if (it != scores.end()) {
		      std::cout << it->second; // 95
		  }
		  ```
	-
	- ## std::unordered_map — Hash Map (C++11)
	  collapsed:: true
		- ```cpp
		  #include <unordered_map>
		  
		  std::unordered_map<std::string, int> umap;
		  umap["x"] = 10;
		  umap["y"] = 20;
		  umap.insert({"z", 30});
		  
		  std::cout << umap["x"];          // 10
		  std::cout << umap.count("y");    // 1
		  
		  umap.erase("x");
		  
		  // Average O(1) lookup vs O(log n) for std::map
		  // No guaranteed order
		  
		  // Reserve buckets to avoid rehashing
		  umap.reserve(1000);
		  ```
	-
	- ## std::set — Sorted Unique Elements
	  collapsed:: true
		- ```cpp
		  #include <set>
		  
		  std::set<int> s = {5, 3, 1, 4, 2, 3}; // duplicates removed
		  // s = {1, 2, 3, 4, 5}
		  
		  s.insert(6);
		  s.erase(3);
		  
		  std::cout << s.count(4);  // 1 (exists) or 0 (not found)
		  std::cout << s.size();    // 5
		  
		  auto it = s.find(4);
		  if (it != s.end()) std::cout << *it; // 4
		  
		  // lower_bound / upper_bound
		  auto lb = s.lower_bound(3); // first element >= 3
		  auto ub = s.upper_bound(3); // first element > 3
		  ```
	-
	- ## std::unordered_set — Hash Set (C++11)
	  collapsed:: true
		- ```cpp
		  #include <unordered_set>
		  
		  std::unordered_set<int> us = {1, 2, 3, 4, 5};
		  us.insert(6);
		  us.erase(3);
		  
		  std::cout << us.count(4); // 1 or 0
		  // O(1) average lookup, no order
		  ```
	-
	- ## std::multimap & std::multiset
	  collapsed:: true
		- ```cpp
		  #include <map>
		  #include <set>
		  
		  // multimap — allows duplicate keys
		  std::multimap<std::string, int> mm;
		  mm.insert({"a", 1});
		  mm.insert({"a", 2}); // duplicate key allowed
		  mm.insert({"b", 3});
		  std::cout << mm.count("a"); // 2
		  
		  // multiset — allows duplicate values
		  std::multiset<int> ms = {1, 2, 2, 3, 3, 3};
		  std::cout << ms.count(3); // 3
		  ```

- # Container Adaptors
  collapsed:: true
	- ## std::stack — LIFO
	  collapsed:: true
		- ```cpp
		  #include <stack>
		  
		  std::stack<int> st;
		  st.push(1);
		  st.push(2);
		  st.push(3);
		  
		  std::cout << st.top();  // 3 (peek)
		  st.pop();               // remove top
		  std::cout << st.top();  // 2
		  std::cout << st.size(); // 2
		  std::cout << st.empty(); // false
		  ```
	-
	- ## std::queue — FIFO
	  collapsed:: true
		- ```cpp
		  #include <queue>
		  
		  std::queue<int> q;
		  q.push(1);
		  q.push(2);
		  q.push(3);
		  
		  std::cout << q.front(); // 1 (oldest)
		  std::cout << q.back();  // 3 (newest)
		  q.pop();                // remove front
		  std::cout << q.front(); // 2
		  ```
	-
	- ## std::priority_queue — Max-Heap by Default
	  collapsed:: true
		- ```cpp
		  #include <queue>
		  
		  // Max-heap (largest element on top)
		  std::priority_queue<int> pq;
		  pq.push(3);
		  pq.push(1);
		  pq.push(4);
		  pq.push(2);
		  
		  std::cout << pq.top(); // 4
		  pq.pop();
		  std::cout << pq.top(); // 3
		  
		  // Min-heap
		  std::priority_queue<int, std::vector<int>, std::greater<int>> minpq;
		  minpq.push(3); minpq.push(1); minpq.push(4);
		  std::cout << minpq.top(); // 1
		  
		  // Custom comparator
		  auto cmp = [](int a, int b) { return a > b; }; // min-heap
		  std::priority_queue<int, std::vector<int>, decltype(cmp)> cpq(cmp);
		  ```

- # Iterators
  collapsed:: true
	- ## Iterator Types
	  collapsed:: true
		- ```
		  Type                  Supports
		  Input iterator        Read, single-pass forward
		  Output iterator       Write, single-pass forward
		  Forward iterator      Read/write, multi-pass forward
		  Bidirectional         Forward + backward (list, map, set)
		  Random access         All + arithmetic (vector, deque, array)
		  ```
	-
	- ## Iterator Usage
	  collapsed:: true
		- ```cpp
		  std::vector<int> v = {1, 2, 3, 4, 5};
		  
		  // begin/end
		  for (auto it = v.begin(); it != v.end(); ++it) {
		      std::cout << *it << " ";
		  }
		  
		  // Reverse iterators
		  for (auto it = v.rbegin(); it != v.rend(); ++it) {
		      std::cout << *it << " "; // 5 4 3 2 1
		  }
		  
		  // const iterators (read-only)
		  for (auto it = v.cbegin(); it != v.cend(); ++it) {
		      std::cout << *it;
		  }
		  
		  // Iterator arithmetic (random access only)
		  auto it = v.begin();
		  it += 2;              // advance by 2
		  std::cout << *it;     // 3
		  std::cout << *(it - 1); // 2
		  std::cout << v.end() - v.begin(); // 5 (size)
		  ```
	-
	- ## std::advance & std::distance
	  collapsed:: true
		- ```cpp
		  #include <iterator>
		  
		  std::list<int> lst = {10, 20, 30, 40, 50};
		  auto it = lst.begin();
		  
		  std::advance(it, 3);          // move forward 3 steps
		  std::cout << *it;             // 40
		  
		  auto dist = std::distance(lst.begin(), it); // 3
		  ```

- # Algorithms
  collapsed:: true
	- ## Sorting
	  collapsed:: true
		- ```cpp
		  #include <algorithm>
		  #include <vector>
		  
		  std::vector<int> v = {5, 3, 1, 4, 2};
		  
		  std::sort(v.begin(), v.end());                    // ascending
		  std::sort(v.begin(), v.end(), std::greater<int>()); // descending
		  std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });
		  
		  std::stable_sort(v.begin(), v.end()); // preserves relative order of equals
		  std::partial_sort(v.begin(), v.begin() + 3, v.end()); // sort first 3
		  
		  // Check if sorted
		  bool sorted = std::is_sorted(v.begin(), v.end());
		  ```
	-
	- ## Searching
	  collapsed:: true
		- ```cpp
		  std::vector<int> v = {1, 2, 3, 4, 5};
		  
		  // Linear search
		  auto it = std::find(v.begin(), v.end(), 3);
		  if (it != v.end()) std::cout << "Found at index " << (it - v.begin());
		  
		  // Find with predicate
		  auto it2 = std::find_if(v.begin(), v.end(), [](int x) { return x > 3; });
		  
		  // Binary search (requires sorted range)
		  bool found = std::binary_search(v.begin(), v.end(), 3); // true
		  
		  // lower_bound / upper_bound (sorted range)
		  auto lb = std::lower_bound(v.begin(), v.end(), 3); // first >= 3
		  auto ub = std::upper_bound(v.begin(), v.end(), 3); // first > 3
		  
		  // Count occurrences
		  int cnt = std::count(v.begin(), v.end(), 3);
		  int cnt2 = std::count_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; });
		  ```
	-
	- ## Transforming
	  collapsed:: true
		- ```cpp
		  std::vector<int> v = {1, 2, 3, 4, 5};
		  std::vector<int> out(v.size());
		  
		  // Transform each element
		  std::transform(v.begin(), v.end(), out.begin(),
		      [](int x) { return x * x; });
		  // out = {1, 4, 9, 16, 25}
		  
		  // Fill
		  std::fill(v.begin(), v.end(), 0);       // all zeros
		  std::fill_n(v.begin(), 3, 99);           // first 3 = 99
		  std::iota(v.begin(), v.end(), 1);        // 1, 2, 3, 4, 5
		  
		  // Replace
		  std::replace(v.begin(), v.end(), 3, 99); // replace 3 with 99
		  std::replace_if(v.begin(), v.end(), [](int x) { return x < 3; }, 0);
		  
		  // Reverse
		  std::reverse(v.begin(), v.end());
		  
		  // Rotate
		  std::rotate(v.begin(), v.begin() + 2, v.end()); // rotate left by 2
		  ```
	-
	- ## Removing & Filtering
	  collapsed:: true
		- ```cpp
		  std::vector<int> v = {1, 2, 3, 2, 4, 2, 5};
		  
		  // remove + erase idiom (erase-remove)
		  v.erase(std::remove(v.begin(), v.end(), 2), v.end());
		  // v = {1, 3, 4, 5}
		  
		  // remove_if
		  v.erase(
		      std::remove_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; }),
		      v.end()
		  );
		  
		  // unique — remove consecutive duplicates (sort first)
		  std::sort(v.begin(), v.end());
		  v.erase(std::unique(v.begin(), v.end()), v.end());
		  ```
	-
	- ## Numeric Algorithms
	  collapsed:: true
		- ```cpp
		  #include <numeric>
		  
		  std::vector<int> v = {1, 2, 3, 4, 5};
		  
		  int sum = std::accumulate(v.begin(), v.end(), 0);       // 15
		  int product = std::accumulate(v.begin(), v.end(), 1,
		      std::multiplies<int>());                             // 120
		  
		  // Prefix sums
		  std::vector<int> prefix(v.size());
		  std::partial_sum(v.begin(), v.end(), prefix.begin());
		  // prefix = {1, 3, 6, 10, 15}
		  
		  // Inner product (dot product)
		  std::vector<int> w = {1, 2, 3, 4, 5};
		  int dot = std::inner_product(v.begin(), v.end(), w.begin(), 0);
		  // 1*1 + 2*2 + 3*3 + 4*4 + 5*5 = 55
		  
		  // Min/Max
		  auto [mn, mx] = std::minmax_element(v.begin(), v.end());
		  std::cout << *mn << " " << *mx; // 1 5
		  ```
	-
	- ## Set Operations (on sorted ranges)
	  collapsed:: true
		- ```cpp
		  std::vector<int> a = {1, 2, 3, 4, 5};
		  std::vector<int> b = {3, 4, 5, 6, 7};
		  std::vector<int> result;
		  
		  std::set_union(a.begin(), a.end(), b.begin(), b.end(),
		      std::back_inserter(result));
		  // result = {1, 2, 3, 4, 5, 6, 7}
		  
		  result.clear();
		  std::set_intersection(a.begin(), a.end(), b.begin(), b.end(),
		      std::back_inserter(result));
		  // result = {3, 4, 5}
		  
		  result.clear();
		  std::set_difference(a.begin(), a.end(), b.begin(), b.end(),
		      std::back_inserter(result));
		  // result = {1, 2}
		  ```

- # Utility Types
  collapsed:: true
	- ## std::pair & std::tuple
	  collapsed:: true
		- ```cpp
		  #include <utility>
		  #include <tuple>
		  
		  // pair
		  std::pair<std::string, int> p = {"Alice", 30};
		  std::cout << p.first << " " << p.second; // Alice 30
		  auto p2 = std::make_pair("Bob", 25);
		  
		  // tuple
		  std::tuple<int, std::string, double> t = {1, "hello", 3.14};
		  std::cout << std::get<0>(t); // 1
		  std::cout << std::get<1>(t); // hello
		  
		  // Structured bindings (C++17)
		  auto [id, name, score] = t;
		  std::cout << id << " " << name; // 1 hello
		  ```
	-
	- ## std::optional (C++17)
	  collapsed:: true
		- ```cpp
		  #include <optional>
		  
		  std::optional<int> findIndex(const std::vector<int>& v, int target) {
		      for (int i = 0; i < v.size(); i++)
		          if (v[i] == target) return i;
		      return std::nullopt; // not found
		  }
		  
		  auto idx = findIndex({1, 2, 3}, 2);
		  if (idx) std::cout << "Found at: " << *idx; // 1
		  
		  std::cout << idx.value_or(-1); // -1 if not found
		  ```
	-
	- ## std::variant (C++17)
	  collapsed:: true
		- ```cpp
		  #include <variant>
		  
		  std::variant<int, double, std::string> v;
		  v = 42;
		  v = "hello";
		  v = 3.14;
		  
		  std::cout << std::get<double>(v); // 3.14
		  std::cout << std::holds_alternative<double>(v); // true
		  
		  // Visit pattern
		  std::visit([](auto&& val) {
		      std::cout << val;
		  }, v);
		  ```
	-
	- ## std::span (C++20) — Non-Owning View
	  collapsed:: true
		- ```cpp
		  #include <span>
		  
		  void process(std::span<int> data) {
		      for (int x : data) std::cout << x << " ";
		  }
		  
		  std::vector<int> v = {1, 2, 3, 4, 5};
		  process(v);              // works with vector
		  
		  int arr[] = {6, 7, 8};
		  process(arr);            // works with C array
		  
		  process(std::span(v).subspan(1, 3)); // {2, 3, 4}
		  ```

- # Container Complexity Summary
  collapsed:: true
	- ```
	  Container         Access    Insert(end)  Insert(mid)  Search
	  vector            O(1)      O(1) amort.  O(n)         O(n)
	  deque             O(1)      O(1)         O(n)         O(n)
	  list              O(n)      O(1)         O(1)*        O(n)
	  array             O(1)      N/A          N/A          O(n)
	  map               O(log n)  O(log n)     O(log n)     O(log n)
	  unordered_map     O(1) avg  O(1) avg     O(1) avg     O(1) avg
	  set               N/A       O(log n)     O(log n)     O(log n)
	  unordered_set     N/A       O(1) avg     O(1) avg     O(1) avg
	  stack/queue       O(1)      O(1)         N/A          N/A
	  priority_queue    O(1) top  O(log n)     N/A          N/A
	  
	  * list insert is O(1) given an iterator to the position
	  ```

- # More Learn
	- [cppreference — Containers](https://en.cppreference.com/w/cpp/container)
	- [cppreference — Algorithms](https://en.cppreference.com/w/cpp/algorithm)
	- [cppreference — Iterators](https://en.cppreference.com/w/cpp/iterator)
	- [STL Cheat Sheet (hackingcpp)](https://hackingcpp.com/cpp/cheat_sheets.html)
	- [TheAlgorithms C++](https://github.com/TheAlgorithms/C-Plus-Plus)
