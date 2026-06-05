---
seoTitle: Trie (Prefix Tree) – Autocomplete & Prefix Retrieval Guide
description: "Master Trie (Prefix Tree) data structure in DSA. Learn how to implement prefix retrieval, search, insert, and build an autocomplete engine."
keywords: "Trie, Prefix Tree, Autocomplete, String Search, Spell Checker, Data Structures, DSA, Trie Implementation, Trie Python, Trie C++, Trie (Prefix Tree)"
displayTitle: Trie (Prefix Tree)
treeTitle: DSA - Trees - Trie (Prefix Tree)
---

> [!info] What is a Trie?
> A **Trie** (derived from re**trie**val, pronounced "try") or **Prefix Tree** is a specialized tree-based search data structure used to store and retrieve keys (usually strings) in a dataset. 
> Unlike a standard binary tree, no node in the Trie stores the key associated with that node. Instead, its position in the tree defines the key it is associated with. The root is associated with the empty string, and every child node represents a character.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of **Autocomplete** on your phone's keyboard or a search engine search bar.
		- As you type "c" -> "ca" -> "cat", you are walking down the edges of a Trie node-by-node.
		- If you stop at "ca", the Trie can instantly look at the subtree under "ca" and return all possible words branching off it ("cat", "car", "cab", "captain"), forming the autocomplete results list.
	-
	- ## Why use a Trie over a Hash Map?
	  collapsed:: true
		- While [[Hash Tables]] have $O(1)$ average lookup time, they have several downsides compared to Tries for strings:
			- **No Prefix Matching**: Hash maps cannot efficiently find all keys starting with a specific prefix (takes $O(N \cdot L)$ scan).
			- **Hash Collisions**: Degrades hash table search to $O(N)$ in the worst case.
			- **Memory Sharing**: Tries share common prefixes among multiple words, which can save substantial space when storing large dictionaries with repetitive beginnings (like "preheating", "prehistoric", "preheat").
	-
	- ## Visual Structure of a Trie
	  collapsed:: true
		- Storing the words: `"cat"`, `"car"`, `"cab"`, `"do"`, `"dog"`
		-
		- ```
		              [ Root ]
		             /        \
		           'c'        'd'
		          /            \
		        'a'            'o'* (end)
		       / | \            \
		     't'*'r'*'b'*       'g'* (end)
		     
		     * denotes isEndOfWord = True
		     Notice how 'ca' is shared!
		     ```
		-
		- ```mermaid
		  graph TD
		      Root((Root)) --> C((c))
		      Root --> D((d))
		      C --> CA((a))
		      CA --> CAT((t))
		      CA --> CAR((r))
		      CA --> CAB((b))
		      D --> DO((o))
		      DO --> DOG((g))
		      
		      classDef wordEnd fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
		      class CAT,CAR,CAB,DO,DOG wordEnd;
		      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		  ```
- # Core Operations
  collapsed:: true
	- ## 1. Insertion
	  collapsed:: true
		- Start at the root. For each character in the word, check if a child node corresponding to that character exists. If not, create a new node. Move to that child node and repeat. At the final character, set `isEndOfWord = true`.
		- **Time Complexity: $O(L)$** where $L$ is the length of the word.
	-
	- ## 2. Search (Exact Word)
	  collapsed:: true
		- Start at the root. Walk down the tree following characters of the word. If any character path is missing, return `false`. If you successfully follow all characters, return the value of `isEndOfWord`.
		- **Time Complexity: $O(L)$**
	-
	- ## 3. StartsWith (Prefix Search)
	  collapsed:: true
		- Walk down the tree following the characters of the prefix. If you can follow all characters of the prefix without hitting a dead end, return `true` (regardless of `isEndOfWord`).
		- **Time Complexity: $O(L)$**
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > Trie lookup time is independent of the number of keys stored in the database! It depends only on the length of the key.
	  > For comparative analysis of lookup scales, see [[Complexity Analysis]].
	-
	- | Operation | Time Complexity | Space Complexity |
	  |-----------|-----------------|------------------|
	  | **Insert** | $O(L)$ | $O(L \cdot A)$ (Worst case if no prefix shared) |
	  | **Search** | $O(L)$ | $O(1)$ |
	  | **StartsWith**| $O(L)$ | $O(1)$ |
	  | **Trie Space**| — | $O(N \cdot L \cdot A)$ where $A$ is alphabet size (e.g. 26) |
- # Implementation
  collapsed:: true
	- > [!note] Trie Implementation with Autocomplete Support
	  > Below is a premium Trie implementation containing standard insertions, lookups, and a recursive method to fetch all autocomplete suggestions for a given prefix.
	-
	- :::code-tabs
	  
	  ```python
	  class TrieNode:
	      def __init__(self):
	          self.children = {} # Maps char -> TrieNode
	          self.is_end = False
	  
	  class Trie:
	      def __init__(self):
	          self.root = TrieNode()
	  
	      def insert(self, word: str):
	          node = self.root
	          for char in word:
	              if char not in node.children:
	                  node.children[char] = TrieNode()
	              node = node.children[char]
	          node.is_end = True
	  
	      def search(self, word: str) -> bool:
	          node = self.root
	          for char in word:
	              if char not in node.children:
	                  return False
	              node = node.children[char]
	          return node.is_end
	  
	      def starts_with(self, prefix: str) -> bool:
	          node = self.root
	          for char in prefix:
	              if char not in node.children:
	                  return False
	              node = node.children[char]
	          return True
	  
	      def get_words_with_prefix(self, prefix: str) -> list:
	          node = self.root
	          for char in prefix:
	              if char not in node.children:
	                  return []
	              node = node.children[char]
	          
	          results = []
	          self._dfs_collect(node, prefix, results)
	          return results
	  
	      def _dfs_collect(self, node, path, results):
	          if node.is_end:
	              results.append(path)
	          for char, child_node in node.children.items():
	              self._dfs_collect(child_node, path + char, results)
	  
	  # Example Usage
	  trie = Trie()
	  for word in ["cat", "car", "cab", "dog", "dodge"]:
	      trie.insert(word)
	  print("Search 'cat':", trie.search("cat"))         # True
	  print("Starts with 'ca':", trie.starts_with("ca"))  # True
	  print("Suggestions for 'ca':", trie.get_words_with_prefix("ca")) # ['cat', 'car', 'cab']
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <unordered_map>
	  #include <vector>
	  #include <string>
	  
	  class TrieNode {
	  public:
	      std::unordered_map<char, TrieNode*> children;
	      bool isEnd = false;
	  };
	  
	  class Trie {
	  private:
	      TrieNode* root;
	  
	      void dfsCollect(TrieNode* node, std::string path, std::vector<std::string>& results) {
	          if (node->isEnd) {
	              results.push_back(path);
	          }
	          for (auto const& [ch, childNode] : node->children) {
	              dfsCollect(childNode, path + ch, results);
	          }
	      }
	  
	  public:
	      Trie() { root = new TrieNode(); }
	  
	      void insert(std::string word) {
	          TrieNode* node = root;
	          for (char ch : word) {
	              if (node->children.find(ch) == node->children.end()) {
	                  node->children[ch] = new TrieNode();
	              }
	              node = node->children[ch];
	          }
	          node->isEnd = true;
	      }
	  
	      bool search(std::string word) {
	          TrieNode* node = root;
	          for (char ch : word) {
	              if (node->children.find(ch) == node->children.end()) return false;
	              node = node->children[ch];
	          }
	          return node->isEnd;
	      }
	  
	      bool startsWith(std::string prefix) {
	          TrieNode* node = root;
	          for (char ch : prefix) {
	              if (node->children.find(ch) == node->children.end()) return false;
	              node = node->children[ch];
	          }
	          return true;
	      }
	  
	      std::vector<std::string> getWordsWithPrefix(std::string prefix) {
	          TrieNode* node = root;
	          std::vector<std::string> results;
	          for (char ch : prefix) {
	              if (node->children.find(ch) == node->children.end()) return results;
	              node = node->children[ch];
	          }
	          dfsCollect(node, prefix, results);
	          return results;
	      }
	  };
	  
	  int main() {
	      Trie trie;
	      trie.insert("cat");
	      trie.insert("car");
	      std::vector<std::string> suggestions = trie.getWordsWithPrefix("ca");
	      for (const auto& word : suggestions) {
	          std::cout << word << "\n"; // cat, car
	      }
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class TrieNode {
	      constructor() {
	          this.children = {};
	          this.isEnd = false;
	      }
	  }
	  
	  class Trie {
	      constructor() {
	          this.root = new TrieNode();
	      }
	  
	      insert(word) {
	          let node = this.root;
	          for (const char of word) {
	              if (!node.children[char]) {
	                  node.children[char] = new TrieNode();
	              }
	              node = node.children[char];
	          }
	          node.isEnd = true;
	      }
	  
	      search(word) {
	          let node = this.root;
	          for (const char of word) {
	              if (!node.children[char]) return false;
	              node = node.children[char];
	          }
	          return node.isEnd;
	      }
	  
	      startsWith(prefix) {
	          let node = this.root;
	          for (const char of prefix) {
	              if (!node.children[char]) return false;
	              node = node.children[char];
	          }
	          return true;
	      }
	  }
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  class TrieNode {
	      Map<Character, TrieNode> children = new HashMap<>();
	      boolean isEnd = false;
	  }
	  
	  public class Trie {
	      private final TrieNode root;
	  
	      public Trie() { root = new TrieNode(); }
	  
	      public void insert(String word) {
	          TrieNode node = root;
	          for (char ch : word.toCharArray()) {
	              node.children.putIfAbsent(ch, new TrieNode());
	              node = node.children.get(ch);
	          }
	          node.isEnd = true;
	      }
	  
	      public boolean search(String word) {
	          TrieNode node = root;
	          for (char ch : word.toCharArray()) {
	              if (!node.children.containsKey(ch)) return false;
	              node = node.children.get(ch);
	          }
	          return node.isEnd;
	      }
	  }
	  ```
	  
	  :::
- # How It Works
  collapsed:: true
	- ## The Core Idea
	  collapsed:: true
		- Each character of a key maps to a **child node**. The root represents the empty string. A key is stored by following (or creating) one node per character, marking the final node with `isEnd = true`.
		-
		- ```mermaid
		  flowchart TD
		      A["Start — insert('cat')"] --> B["node = root"]
		      B --> C["char='c': not in root → create TrieNode\nnode = root.children['c']"]
		      C --> D["char='a': not in node → create TrieNode\nnode = node.children['a']"]
		      D --> E["char='t': not in node → create TrieNode\nnode = node.children['t']"]
		      E --> F["End of word → node.is_end = True"]
		      F --> G["✅ 'cat' inserted"]
		      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		  ```
	-
	- ## Step-by-Step Trace (Inserting "cat", "car", "do")
	  collapsed:: true
		- ```
		  Start: root = TrieNode(children={}, is_end=False)
		  
		  Insert "cat":
		    root → 'c'(new) → 'a'(new) → 't'(new, is_end=True)
		    root.children = {'c': node_c}
		    node_ca.children = {'t': node_cat}
		  
		  Insert "car":
		    root → 'c'(exists) → 'a'(exists) → 'r'(new, is_end=True)
		    node_ca.children = {'t': node_cat, 'r': node_car}   ← 'ca' shared!
		  
		  Insert "do":
		    root → 'd'(new) → 'o'(new, is_end=True)
		    root.children = {'c': node_c, 'd': node_d}
		  
		  Final Trie:
		    root
		    ├── 'c' → 'a'
		    │         ├── 't' [END]
		    │         └── 'r' [END]
		    └── 'd' → 'o' [END]
		  
		  Search "cat":
		    root→'c'✓→'a'✓→'t'✓, is_end=True  →  Found ✅
		  
		  Search "ca":
		    root→'c'✓→'a'✓, is_end=False  →  Not a word ❌
		  
		  StartsWith "ca":
		    root→'c'✓→'a'✓  →  Prefix exists ✅
		  ```
- # Alternative Variant (Compressed Trie / Radix Tree)
  collapsed:: true
	- > [!tip] Compressed Trie — Reducing Node Count
	  > A **Compressed Trie** (Radix Tree / Patricia Tree) merges chains of single-child nodes into one edge labeled with a multi-character string. This reduces node count from $O(N \cdot L)$ to $O(N)$ where $N$ is the number of inserted words — a significant memory saving for long, non-overlapping keys.
	-
	- :::code-tabs
	  
	  ```python
	  class CompressedTrieNode:
	      def __init__(self):
	          # Maps edge_label (str) -> CompressedTrieNode
	          self.children: dict[str, "CompressedTrieNode"] = {}
	          self.is_end = False
	  
	  class CompressedTrie:
	      def __init__(self):
	          self.root = CompressedTrieNode()
	  
	      def insert(self, word: str):
	          node = self.root
	          i = 0
	          while i < len(word):
	              matched = False
	              for label in list(node.children.keys()):
	                  j = 0
	                  while j < len(label) and i + j < len(word) and label[j] == word[i + j]:
	                      j += 1
	                  if j == 0:
	                      continue
	                  if j == len(label):       # Fully matched edge — descend
	                      node = node.children[label]
	                      i += j
	                  else:                      # Partial match — split edge
	                      old_child = node.children.pop(label)
	                      mid = CompressedTrieNode()
	                      node.children[label[:j]] = mid
	                      mid.children[label[j:]] = old_child
	                      if i + j < len(word):
	                          leaf = CompressedTrieNode()
	                          leaf.is_end = True
	                          mid.children[word[i + j:]] = leaf
	                      else:
	                          mid.is_end = True
	                      return
	                  matched = True
	                  break
	              if not matched:
	                  leaf = CompressedTrieNode()
	                  leaf.is_end = True
	                  node.children[word[i:]] = leaf
	                  return
	          node.is_end = True
	  
	  # Example
	  ct = CompressedTrie()
	  for word in ["cat", "car", "cab"]:
	      ct.insert(word)
	  # Internally: root → 'ca' edge → {'t'[END], 'r'[END], 'b'[END]}
	  # Only 4 nodes vs 7 in a standard Trie
	  print("Compressed Trie built for: cat, car, cab")
	  ```
	  
	  :::
- # When to Use a Trie
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Are your keys\nstrings or sequences?"}
	      Q -- No --> R1["Use Hash Table\nor BST"]
	      Q -- Yes --> S1{"Do you need prefix\nqueries or autocomplete?"}
	      S1 -- No --> S2{"Exact lookups only?"}
	      S2 -- Yes --> R2["Use Hash Table\n(simpler, O(L) average)"]
	      S2 -- No --> R3["✅ Use Trie\n(prefix + exact, O(L) guaranteed)"]
	      S1 -- Yes --> R3
	      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
	  ```
	-
	- ## ✅ Use a Trie When
		- You need **prefix-based queries** — autocomplete, spell-checker, IP routing.
		- Keys are **strings with shared prefixes** — common prefix nodes are shared, saving memory.
		- You need **guaranteed $O(L)$ worst-case** lookup (no hash collisions).
		- Implementing a **dictionary** where you enumerate all keys with a given prefix.
	-
	- ## ❌ Avoid a Trie When
		- Keys are **not strings** or have a very large alphabet ($A \gg 26$), causing memory explosion per node.
		- You only need **exact lookups** with no prefix requirements — a Hash Table is simpler and typically faster.
		- **Memory is constrained** — each Trie node stores up to $A$ pointers; use a HashMap-backed node to trade speed for memory.
- # Key Takeaways
  collapsed:: true
	- **Position Defines Key** — No node stores its own key; the path from root to that node *is* the key.
	- **Shared Prefixes** — Words with common prefixes (e.g., "cat", "car") share nodes up to the divergence point, saving space.
	- **$O(L)$ Operations** — Insert, search, and startsWith are all $O(L)$ where $L$ is the key length, regardless of how many keys are stored.
	- **Autocomplete by DFS** — Once a prefix is located, a depth-first traversal of the subtree yields all matching words.
	- **Alphabet-Bounded Branching** — Each node has at most $A$ children (alphabet size). For Unicode, use a HashMap instead of a fixed-size array.
	- **Compressed Variants** — Radix Trees / Patricia Trees compress single-child chains into labeled edges, reducing node count from $O(N \cdot L)$ to $O(N)$.
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks → Trie (Insert and Search)](https://www.geeksforgeeks.org/trie-insert-and-search/)
		- [Visualgo → Suffix Tree Visualization](https://visualgo.net/en/suffixtree)
		- [LeetCode → Implement Trie – Problem 208](https://leetcode.com/problems/implement-trie-prefix-tree/)
		- [TheAlgorithms – Trie (Python)](https://github.com/TheAlgorithms/Python/blob/master/data_structures/trie.py)