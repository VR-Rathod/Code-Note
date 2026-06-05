---
seoTitle: Suffix Tree Explained – Ukkonen's O(n) Construction & Applications
description: "A comprehensive guide to Suffix Trees and Ukkonen's linear-time construction algorithm. Covers substring queries, pattern matching, and implementations in Python and C++."
keywords: "suffix tree, Ukkonen's algorithm, suffix link, pattern matching, string indexing, bio-informatics, O(n) construction, data structures, algorithms, VR-Rathod, Code-Note, code note vr, vr book"
treeTitle: DSA - Trees - Suffix Tree
---

> [!info] What is a Suffix Tree?
> A **Suffix Tree** is a compressed trie containing all suffixes of a given text. It is a powerful data structure that solves complex string-processing problems (like pattern matching, substring search, and longest common substrings) in linear time.
> **Key Feature:** Can be constructed in **O(n)** time and space using **Ukkonen's Algorithm**, where $n$ is the length of the text.

- # Explanation
	- A **Suffix Tree** represents all suffixes of a string $S$ of length $n$. By storing these suffixes in a compressed trie, we can search for any pattern of length $m$ in $O(m)$ time, which is completely independent of the text size $n$.
	- To ensure no suffix is a prefix of another, we append a unique terminal character (typically `$`) to the end of the string.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a Suffix Tree as the **index at the back of a massive book**.
		- Instead of reading the entire book page by page (linear search) every time you want to find a word, you look up the word in the index. The index instantly points you to the exact page number.
		- A Suffix Tree does this for every possible substring in a text, serving as a structured master index.
	-
	- ## Why Suffix Trees?
	  collapsed:: true
		- [[Trie (Prefix Tree)]] stores a set of keys, but checking all suffixes of a text would require $O(n^2)$ space and time.
		- Suffix Trees compress single-child nodes into single edges, saving memory and keeping the total number of nodes bounded by $O(n)$.
		- Once built, queries like **substring search**, **pattern matching count**, and **longest repeated substring** are resolved in optimal time.
-
- # How It Works
  collapsed:: true
	- ## Structural Concepts
	  collapsed:: true
		- **Compressed Trie**: Consecutive nodes with only one child are merged, representing their characters as edge labels (indices `[start, end]`).
		- **Suffix Link**: A link from an internal node representing path $x\alpha$ (where $x$ is a character and $\alpha$ is a string) to another node representing $\alpha$. These links allow fast navigation between suffixes during construction.
		- **Active Point**: During Ukkonen's algorithm, the active point keeps track of where we are currently inserting. It is a tuple: `(active_node, active_edge_char, active_length)`.
	-
	- ## Ukkonen's Construction Rules
	  collapsed:: true
		- **Rule 1 (Extension Rule 1)**: If the path from root ends at a leaf, append the new character to the leaf edge. With the global `leaf_end` pointer, this is done in $O(1)$ time automatically.
		- **Rule 2 (Extension Rule 2)**: If no path matching the character exists, create a new leaf. If we are in the middle of an edge, split the edge, create an internal node, and branch out the new leaf.
		- **Rule 3 (Extension Rule 3)**: If the character already exists along the path, do nothing (increment `active_length` and stop current phase).
	-
	- ## Visual Walkthrough (String: `banana$`)
	  collapsed:: true
		- All suffixes of `banana$`:
			- `banana$`
			- `anana$`
			- `nana$`
			- `ana$`
			- `na$`
			- `a$`
			- `$`
		- ```
		                         (root)
		                 /     /   \    \       \
		               $      a     banana$  na    na$
		                     / \             / \
		                   nana$ $         nana$ $
		                   /   \
		                 na$    $
		  ```
-
- # Time & Space Complexity
  collapsed:: true
	- | Operation | Time Complexity (Average/Worst) | Space Complexity |
	  |-----------|---------------------------------|------------------|
	  | **Ukkonen's Construction** | $O(n)$ | $O(n)$ |
	  | **Pattern Search** | $O(m)$ (where $m$ is pattern length) | $O(1)$ auxiliary |
	  | **Longest Common Substring** | $O(n_1 + n_2)$ | $O(n_1 + n_2)$ |
-
- # Implementation
  collapsed:: true
	- > [!note] Suffix Tree Implementation
	  > The following implementations demonstrate Ukkonen's Algorithm for constructing a Suffix Tree in linear $O(n)$ time. It includes suffix links, edge-splitting, and a pattern search method.
	-
	- :::code-tabs
	  
	  ```python
	  class SuffixTreeNode:
	      def __init__(self, start=-1, end=None):
	          # Map character to child SuffixTreeNode
	          self.children = {}
	          # Start index of the edge label in the main text
	          self.start = start
	          # End index of the edge label, shared reference for leaf nodes
	          self.end = end if end is not None else [-1]
	          # Link to another internal node for fast suffix traversal
	          self.suffix_link = None
	          # If a leaf, stores the index of the suffix starting at this path
	          self.suffix_index = -1
	  
	      def edge_length(self, curr_pos):
	          """Return the length of the edge representation."""
	          return self.end[0] - self.start + 1
	  
	  class SuffixTree:
	      def __init__(self, text):
	          self.text = text
	          self.root = SuffixTreeNode()
	          self.active_node = self.root
	          self.active_edge = -1
	          self.active_length = 0
	          self.remaining_suffix_count = 0
	          self.leaf_end = [-1]  # Shared end pointer for all leaves
	          self.size = len(text)
	          self.build()
	          self.set_suffix_indices(self.root, 0)
	  
	      def walk_down(self, curr_node):
	          """Perform edge traversal during extension steps (active point shift)."""
	          el = curr_node.edge_length(self.leaf_end[0])
	          if self.active_length >= el:
	              self.active_edge += el
	              self.active_length -= el
	              self.active_node = curr_node
	              return True
	          return False
	  
	      def build(self):
	          """Build suffix tree using Ukkonen's Algorithm."""
	          for i in range(self.size):
	              self.extend(i)
	  
	      def extend(self, pos):
	          """Extend the suffix tree with the character at text[pos]."""
	          self.leaf_end[0] = pos
	          self.remaining_suffix_count += 1
	          last_created_internal_node = None
	  
	          while self.remaining_suffix_count > 0:
	              if self.active_length == 0:
	                  self.active_edge = pos
	  
	              char = self.text[self.active_edge]
	              if char not in self.active_node.children:
	                  # Rule 2: Create a new leaf node
	                  self.active_node.children[char] = SuffixTreeNode(pos, self.leaf_end)
	                  if last_created_internal_node is not None:
	                      last_created_internal_node.suffix_link = self.active_node
	                      last_created_internal_node = None
	              else:
	                  next_node = self.active_node.children[char]
	                  if self.walk_down(next_node):
	                      # Move down the tree if active_length is longer than the edge length
	                      continue
	  
	                  # Rule 3: Character already exists on the edge
	                  if self.text[next_node.start + self.active_length] == self.text[pos]:
	                      if last_created_internal_node is not None and self.active_node != self.root:
	                          last_created_internal_node.suffix_link = self.active_node
	                          last_created_internal_node = None
	                      self.active_length += 1
	                      break  # Stop current phase extensions
	  
	                  # Rule 2: Split the edge to insert an internal node
	                  split_end = [next_node.start + self.active_length - 1]
	                  split_node = SuffixTreeNode(next_node.start, split_end)
	                  self.active_node.children[char] = split_node
	  
	                  # Branch out the new leaf node
	                  split_node.children[self.text[pos]] = SuffixTreeNode(pos, self.leaf_end)
	                  next_node.start += self.active_length
	                  split_node.children[self.text[next_node.start]] = next_node
	  
	                  if last_created_internal_node is not None:
	                      last_created_internal_node.suffix_link = split_node
	                  last_created_internal_node = split_node
	  
	              self.remaining_suffix_count -= 1
	              if self.active_node == self.root and self.active_length > 0:
	                  self.active_length -= 1
	                  self.active_edge = pos - self.remaining_suffix_count + 1
	              elif self.active_node != self.root:
	                  self.active_node = self.active_node.suffix_link if self.active_node.suffix_link else self.root
	  
	      def set_suffix_indices(self, node, path_len):
	          """Determine starting index of suffix at leaf nodes."""
	          if not node:
	              return
	          is_leaf = True
	          for child in node.children.values():
	              is_leaf = False
	              self.set_suffix_indices(child, path_len + child.edge_length(self.leaf_end[0]))
	          if is_leaf:
	              node.suffix_index = self.size - path_len
	  
	      def search(self, pattern):
	          """Check if a pattern exists in the text in O(len(pattern)) time."""
	          curr = self.root
	          i = 0
	          while i < len(pattern):
	              char = pattern[i]
	              if char not in curr.children:
	                  return False
	              child = curr.children[char]
	              edge_len = child.edge_length(self.leaf_end[0])
	              j = 0
	              while j < edge_len and i < len(pattern):
	                  if self.text[child.start + j] != pattern[i]:
	                      return False
	                  i += 1
	                  j += 1
	              curr = child
	          return True
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <unordered_map>
	  #include <string>
	  #include <vector>
	  
	  struct SuffixTreeNode {
	      // Child map
	      std::unordered_map<char, SuffixTreeNode*> children;
	      // Start and end indices in the string
	      int start;
	      int* end;
	      // Suffix link pointer
	      SuffixTreeNode* suffix_link;
	      // Suffix index (for leaf nodes)
	      int suffix_index;
	  
	      SuffixTreeNode(int start, int* end) {
	          this->start = start;
	          this->end = end;
	          this->suffix_link = nullptr;
	          this->suffix_index = -1;
	      }
	  
	      int edge_length(int leaf_end_val) {
	          return *end - start + 1;
	      }
	  };
	  
	  class SuffixTree {
	  private:
	      std::string text;
	      SuffixTreeNode* root;
	      SuffixTreeNode* active_node;
	      int active_edge;
	      int active_length;
	      int remaining_suffix_count;
	      int* leaf_end;
	      int size;
	  
	      bool walk_down(SuffixTreeNode* curr_node) {
	          int el = curr_node->edge_length(*leaf_end);
	          if (active_length >= el) {
	              active_edge += el;
	              active_length -= el;
	              active_node = curr_node;
	              return true;
	          }
	          return false;
	      }
	  
	      void extend(int pos) {
	          *leaf_end = pos;
	          remaining_suffix_count++;
	          SuffixTreeNode* last_created_internal_node = nullptr;
	  
	          while (remaining_suffix_count > 0) {
	              if (active_length == 0) {
	                  active_edge = pos;
	              }
	  
	              char ch = text[active_edge];
	              if (active_node->children.find(ch) == active_node->children.end()) {
	                  // Rule 2: Create new leaf
	                  active_node->children[ch] = new SuffixTreeNode(pos, leaf_end);
	                  if (last_created_internal_node != nullptr) {
	                      last_created_internal_node->suffix_link = active_node;
	                      last_created_internal_node = nullptr;
	                  }
	              } else {
	                  SuffixTreeNode* next_node = active_node->children[ch];
	                  if (walk_down(next_node)) {
	                      continue;
	                  }
	  
	                  // Rule 3: Character match found on edge
	                  if (text[next_node->start + active_length] == text[pos]) {
	                      if (last_created_internal_node != nullptr && active_node != root) {
	                          last_created_internal_node->suffix_link = active_node;
	                          last_created_internal_node = nullptr;
	                      }
	                      active_length++;
	                      break;
	                  }
	  
	                  // Rule 2: Split the edge
	                  int* split_end = new int(next_node->start + active_length - 1);
	                  SuffixTreeNode* split_node = new SuffixTreeNode(next_node->start, split_end);
	                  active_node->children[ch] = split_node;
	  
	                  split_node->children[text[pos]] = new SuffixTreeNode(pos, leaf_end);
	                  next_node->start += active_length;
	                  split_node->children[text[next_node->start]] = next_node;
	  
	                  if (last_created_internal_node != nullptr) {
	                      last_created_internal_node->suffix_link = split_node;
	                  }
	                  last_created_internal_node = split_node;
	              }
	  
	              remaining_suffix_count--;
	              if (active_node == root && active_length > 0) {
	                  active_length--;
	                  active_edge = pos - remaining_suffix_count + 1;
	              } else if (active_node != root) {
	                  active_node = active_node->suffix_link ? active_node->suffix_link : root;
	              }
	          }
	      }
	  
	      void set_suffix_indices(SuffixTreeNode* node, int path_len) {
	          if (!node) return;
	          bool is_leaf = true;
	          for (auto& pair : node->children) {
	              is_leaf = false;
	              set_suffix_indices(pair.second, path_len + pair.second->edge_length(*leaf_end));
	          }
	          if (is_leaf) {
	              node->suffix_index = size - path_len;
	          }
	      }
	  
	      void free_tree_resources(SuffixTreeNode* node) {
	          if (!node) return;
	          for (auto& pair : node->children) {
	              free_tree_resources(pair.second);
	          }
	          // Delete non-leaf node endpoints dynamically allocated during splitting
	          if (node->end != leaf_end) {
	              delete node->end;
	          }
	          delete node;
	      }
	  
	  public:
	      SuffixTree(std::string text) {
	          this->text = text;
	          this->size = text.length();
	          this->leaf_end = new int(-1);
	          this->root = new SuffixTreeNode(-1, new int(-1));
	          this->active_node = root;
	          this->active_edge = -1;
	          this->active_length = 0;
	          this->remaining_suffix_count = 0;
	  
	          for (int i = 0; i < size; ++i) {
	              extend(i);
	          }
	          set_suffix_indices(root, 0);
	      }
	  
	      ~SuffixTree() {
	          free_tree_resources(root);
	          delete leaf_end;
	      }
	  
	      bool search(std::string pattern) {
	          SuffixTreeNode* curr = root;
	          int i = 0;
	          while (i < pattern.length()) {
	              char ch = pattern[i];
	              if (curr->children.find(ch) == curr->children.end()) {
	                  return false;
	              }
	              SuffixTreeNode* child = curr->children[ch];
	              int el = child->edge_length(*leaf_end);
	              int j = 0;
	              while (j < el && i < pattern.length()) {
	                  if (text[child->start + j] != pattern[i]) {
	                      return false;
	                  }
	                  i++;
	                  j++;
	              }
	              curr = child;
	          }
	          return true;
	      }
	  };
	  ```
	  
	  :::
-
- # When to Use
  collapsed:: true
	- ## Use Suffix Trees When:
	  collapsed:: true
		- ✅ You need to perform multiple **substring search** queries on a large, static document.
		- ✅ You need to find the **Longest Common Substring** or **Longest Repeated Substring** in linear time.
		- ✅ You are working on **bioinformatics** (genome mapping, DNA sequence alignment).
		- ✅ You want to find all occurrences of a pattern in a text.
	- ## Avoid When:
	  collapsed:: true
		- ❌ The text changes frequently (suffix trees are static and expensive to update dynamically).
		- ❌ Memory is extremely constrained — the constant factors in suffix tree space overhead can be large. A [[FM index]] or a Suffix Array is more memory-efficient.
-
- # Variations & Related Concepts
  collapsed:: true
	- **Suffix Array**: A sorted array of all suffixes of a string. Often preferred in practice over suffix trees due to much smaller space footprints ($O(n)$ space with a very small constant factor).
	- **Trie (Prefix Tree)**: The general data structure representing prefixes; a suffix tree is a compressed trie of all suffixes.
	- **[[FM index]]**: Compressed suffix-array representation based on the Burrows-Wheeler Transform.
-
- # Key Takeaways
  collapsed:: true
	- A Suffix Tree is a compressed trie containing all suffixes of a string.
	- Appending a special terminal character like `$` guarantees that no suffix is a prefix of another, making all suffix paths end at leaves.
	- Ukkonen's Algorithm constructs the Suffix Tree in optimal $O(n)$ time and space by building it online.
	- Suffix links, active point tracking, and a global `leaf_end` pointer are the key mechanisms behind the linear complexity of Ukkonen's algorithm.
	- Substring search and pattern matching can be executed in $O(m)$ time, where $m$ is the pattern length.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [Wikipedia -> Suffix tree](https://en.wikipedia.org/wiki/Suffix_tree)
		- [GeeksforGeeks -> Ukkonen's Suffix Tree Construction](https://www.geeksforgeeks.org/ukkonens-suffix-tree-construction-part-1/)