---
seoTitle: Trie (Prefix Tree) – Autocomplete & Prefix Retrieval Guide
description: "Master Trie (Prefix Tree) data structure in DSA. Learn how to implement prefix retrieval, search, insert, and build an autocomplete engine."
keywords: "Trie, Prefix Tree, Autocomplete, String Search, Spell Checker, Data Structures, DSA, Trie Implementation, Trie Python, Trie C++"
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
