---
seoTitle: Aho Corasick Algorithm – Efficient Multi-Pattern String Matching
description: "Comprehensive guide to the Aho Corasick Algorithm. Explains trie-based multi-pattern matching, failure links, dictionary links, and full implementations in 5 languages."
keywords: "Aho-Corasick, multi-pattern search, trie, failure link, dictionary link, string matching, algorithm, C++, Python, Java, JavaScript, C, VR-Rathod, Code-Note, Vaibhav Rathod"
---

> [!info] What is the Aho Corasick Algorithm?
> The **Aho Corasick Algorithm** is a powerful string-searching algorithm that locates all occurrences of a finite set of keywords (patterns) within an input text in **O(N + M + Z)** time, where $N$ is the length of the text, $M$ is the sum of the lengths of all patterns, and $Z$ is the total number of matches.
> It constructs a finite state machine (similar to a Trie with suffix/failure links) to process the text in a single pass, making it the standard choice for multi-pattern search engines, virus signature scanners, and dictionary matching.

- # Explanation
  collapsed:: true
	- **Aho-Corasick** constructs a matching automaton from the set of patterns to scan the input text in a single linear sweep.
	- Instead of matching each pattern separately (which would take $O(K \cdot N)$ using KMP or similar), it matches all patterns simultaneously.
	-
	- ## Real-World Analogy
	  collapsed:: true
		- Think of a **dictionary lookup / spam filter**: you have a blacklist of 1,000 bad words, and you want to scan an email. Instead of reading the email 1,000 times, you read it once and check each letter against your tree of words. If a word starts to match and then fails, you don't start reading from scratch; you jump to the next best match using failure links.
	-
	- ## Why Aho-Corasick?
	  collapsed:: true
		- [[Knuth Morris Pratt Algorithm (KMP)]] searches for **one** pattern in a text.
		- [[Rabin-Karp Algorithm]] uses rolling hashes to search for multiple patterns, but can suffer from hash collisions and worst-case $O(N \cdot K)$ performance.
		- **Aho-Corasick** provides guaranteed $O(N + M + Z)$ linear time regardless of pattern overlaps or text content.
-
- # How It Works
  collapsed:: true
	- ## The Core Steps
	  collapsed:: true
		- 1. **Trie Construction**: Insert all keywords into a Trie.
		- 2. **Failure Links Construction**: Using Breadth-First Search (BFS), connect each node to the node representing the longest proper suffix of the prefix at the current node.
		- 3. **Dictionary Links Construction**: Connect each node to the closest node reachable via failure links that represents an actual pattern ending (to avoid scanning empty nodes during matching).
		- 4. **Text Scanning**: Feed the text character-by-character into the automaton, following failure/dictionary links to yield matches.
	-
	- ## State Machine / Failure Transition Flowchart
	  collapsed:: true
		- ```mermaid
		  flowchart TD
		      Start["1. Build Trie of Patterns"] --> BFS["2. BFS Traversal to link Failures"]
		      BFS --> SuffixLink{"Does parent's fail node\nhave child with char?"}
		      SuffixLink -- Yes --> Link["Set child's fail to that child"]
		      SuffixLink -- No --> FollowFail["Follow fail links until root"]
		      FollowFail --> Link
		      Link --> DictLink["Set dict_link to closest ending word on fail path"]
		      DictLink --> Scan["3. Scan Text in O(N)"]
		      Scan --> Output["4. Record Matches via Dictionary Links"]
		  ```
	-
	- ## Step-by-Step Algorithm
	  collapsed:: true
		- ```
		  BUILD_AUTOMATON(patterns):
		    1. Create root of Trie.
		    2. FOR each pattern in patterns:
		         Insert pattern into Trie, marking the end node with its pattern index.
		    3. Queue Q ← empty queue
		    4. FOR each child of root:
		         child.fail ← root
		         child.dict_link ← NIL
		         Q.enqueue(child)
		    5. WHILE Q is not empty:
		         curr ← Q.dequeue()
		         FOR each character c representing transition to child:
		           fail_node ← curr.fail
		           WHILE fail_node is not NIL and fail_node has no child c:
		             fail_node ← fail_node.fail
		           child.fail ← fail_node.child(c) IF fail_node exists ELSE root
		           
		           # Dictionary link setup
		           IF child.fail is a word ending:
		             child.dict_link ← child.fail
		           ELSE:
		             child.dict_link ← child.fail.dict_link
		           Q.enqueue(child)
		  ```
	-
	- ## Live Walkthrough — Searching `{"he", "she", "his", "hers"}` in `"ushers"`
	  collapsed:: true
		- Here is how the state transitions change as we read the characters of `"ushers"`:
		- ```
		  Text:   u   s   h   e   r   s
		  Index:  0   1   2   3   4   5
		  
		  ┌────────────────────────────────────────────────────────────────────────┐
		  │ Char │ Current Node  │ Transition Node │ Matched Patterns / Notes      │
		  ├──────┼───────────────┼─────────────────┼───────────────────────────────┤
		  │  u   │ root          │ root            │ No transition for 'u'.        │
		  │  s   │ root          │ "s"             │ Matches "s"                   │
		  │  h   │ "s"           │ "sh"            │ Matches "sh"                  │
		  │  e   │ "sh"          │ "she"           │ Matches "she" ✅ (Index 1)    │
		  │      │               │                 │ Follow fail link:             │
		  │      │               │                 │ "she" -> "he" ✅ (Index 2)    │
		  │  r   │ "she" (at "he")│ "her"          │ Transitions from "he" to "her"│
		  │  s   │ "her"         │ "hers"          │ Matches "hers" ✅ (Index 2)   │
		  └────────────────────────────────────────────────────────────────────────┘
		  ```
-
- # Time & Space Complexity
  collapsed:: true
	- > [!important] Complexity Summary
	  > - **Automaton Construction**: **O(M)** time and **O(M * Σ)** space (where $M$ is the sum of pattern lengths, and $\Sigma$ is alphabet size).
	  > - **Matching Phase**: **O(N + Z)** time and **O(1)** extra space (where $N$ is text length, and $Z$ is total occurrences of matches).
	-
	- ## Complexity Table
	  collapsed:: true
		- | Phase | Time Complexity | Space Complexity | Why |
		  |---|---|---|---|
		  | **Trie Construction** | $O(M)$ | $O(M \cdot \Sigma)$ | Inserting all patterns of total length $M$ into the Trie. |
		  | **Failure Link Construction** | $O(M)$ | $O(M)$ | BFS traversal visiting every node once. |
		  | **Search Phase** | $O(N + Z)$ | $O(1)$ auxiliary | Scan text of length $N$ in a single pass; $Z$ matches traversed. |
-
- # Base Implementation
  collapsed:: true
	- > [!note] Standard Aho-Corasick Multi-Pattern Search.
	  > Output lists are merged during BFS construction for simplicity and immediate matching.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]] · [[C]]
	-
	- :::code-tabs
	  
	  ```python
	  from collections import deque
	  
	  class AhoCorasickBase:
	      class TrieNode:
	          def __init__(self):
	              self.children = {}
	              self.fail = None
	              self.output = [] # Indices of patterns ending at or matching this state
	  
	      def __init__(self, patterns):
	          self.root = self.TrieNode()
	          self.patterns = patterns
	          self._build_trie()
	          self._build_fail_links()
	  
	      def _build_trie(self):
	          for idx, pattern in enumerate(self.patterns):
	              curr = self.root
	              for char in pattern:
	                  if char not in curr.children:
	                      curr.children[char] = self.TrieNode()
	                  curr = curr.children[char]
	              curr.output.append(idx)
	  
	      def _build_fail_links(self):
	          queue = deque()
	          # Initial step: root's immediate children fail to root
	          for char, child in self.root.children.items():
	              child.fail = self.root
	              queue.append(child)
	              
	          while queue:
	              curr = queue.popleft()
	              for char, child in curr.children.items():
	                  fail_node = curr.fail
	                  while fail_node is not None and char not in fail_node.children:
	                      fail_node = fail_node.fail
	                  child.fail = fail_node.children[char] if fail_node else self.root
	                  # Merge output lists of the failure node
	                  child.output.extend(child.fail.output)
	                  queue.append(child)
	  
	      def search(self, text):
	          results = {idx: [] for idx in range(len(self.patterns))}
	          curr = self.root
	          for i, char in enumerate(text):
	              while curr is not None and char not in curr.children:
	                  curr = curr.fail
	              curr = curr.children[char] if curr else self.root
	              # Record matches
	              for pattern_idx in curr.output:
	                  start_idx = i - len(self.patterns[pattern_idx]) + 1
	                  results[pattern_idx].append(start_idx)
	          return results
	  
	  # Example Usage
	  if __name__ == "__main__":
	      patterns = ["he", "she", "his", "hers"]
	      ac = AhoCorasickBase(patterns)
	      matches = ac.search("ushers")
	      print(matches) # Output: {0: [2], 1: [1], 2: [], 3: [2]}
	  ```
	  
	  ```cpp
	  #include <iostream>
	  #include <vector>
	  #include <string>
	  #include <unordered_map>
	  #include <queue>
	  
	  class AhoCorasickBase {
	  private:
	      struct TrieNode {
	          std::unordered_map<char, TrieNode*> children;
	          TrieNode* fail = nullptr;
	          std::vector<int> output;
	  
	          ~TrieNode() {
	              for (auto& pair : children) {
	                  delete pair.second;
	              }
	          }
	      };
	  
	      TrieNode* root;
	      std::vector<std::string> patterns;
	  
	      void buildTrie() {
	          for (int i = 0; i < patterns.size(); ++i) {
	              TrieNode* curr = root;
	              for (char c : patterns[i]) {
	                  if (curr->children.find(c) == curr->children.end()) {
	                      curr->children[c] = new TrieNode();
	                  }
	                  curr = curr->children[c];
	              }
	              curr->output.push_back(i);
	          }
	      }
	  
	      void buildFailLinks() {
	          std::queue<TrieNode*> q;
	          for (auto& pair : root->children) {
	              pair.second->fail = root;
	              q.push(pair.second);
	          }
	  
	          while (!q.empty()) {
	              TrieNode* curr = q.front();
	              q.pop();
	  
	              for (auto& pair : curr->children) {
	                  char c = pair.first;
	                  TrieNode* child = pair.second;
	  
	                  TrieNode* failNode = curr->fail;
	                  while (failNode != nullptr && failNode->children.find(c) == failNode->children.end()) {
	                      failNode = failNode->fail;
	                  }
	                  child->fail = failNode ? failNode->children[c] : root;
	                  child->output.insert(child->output.end(), child->fail->output.begin(), child->fail->output.end());
	                  q.push(child);
	              }
	          }
	      }
	  
	  public:
	      AhoCorasickBase(const std::vector<std::string>& patterns) : patterns(patterns) {
	          root = new TrieNode();
	          buildTrie();
	          buildFailLinks();
	      }
	  
	      ~AhoCorasickBase() {
	          delete root;
	      }
	  
	      std::vector<std::vector<int>> search(const std::string& text) {
	          std::vector<std::vector<int>> results(patterns.size());
	          TrieNode* curr = root;
	  
	          for (int i = 0; i < text.length(); ++i) {
	              char c = text[i];
	              while (curr != nullptr && curr->children.find(c) == curr->children.end()) {
	                  curr = curr->fail;
	              }
	              curr = curr ? curr->children[c] : root;
	  
	              for (int idx : curr->output) {
	                  results[idx].push_back(i - patterns[idx].length() + 1);
	              }
	          }
	          return results;
	      }
	  };
	  
	  int main() {
	      std::vector<std::string> patterns = {"he", "she", "his", "hers"};
	      AhoCorasickBase ac(patterns);
	      auto res = ac.search("ushers");
	      for (int i = 0; i < patterns.size(); ++i) {
	          std::cout << patterns[i] << " matched at indices: ";
	          for (int idx : res[i]) std::cout << idx << " ";
	          std::cout << "\n";
	      }
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class AhoCorasickBase {
	      constructor(patterns) {
	          this.patterns = patterns;
	          this.root = this.createNode();
	          this.buildTrie();
	          this.buildFailLinks();
	      }
	  
	      createNode() {
	          return {
	              children: new Map(),
	              fail: null,
	              output: []
	          };
	      }
	  
	      buildTrie() {
	          for (let i = 0; i < this.patterns.length; i++) {
	              const pattern = this.patterns[i];
	              let curr = this.root;
	              for (const char of pattern) {
	                  if (!curr.children.has(char)) {
	                      curr.children.set(char, this.createNode());
	                  }
	                  curr = curr.children.get(char);
	              }
	              curr.output.push(i);
	          }
	      }
	  
	      buildFailLinks() {
	          const queue = [];
	          for (const [char, child] of this.root.children) {
	              child.fail = this.root;
	              queue.push(child);
	          }
	  
	          while (queue.length > 0) {
	              const curr = queue.shift();
	              for (const [char, child] of curr.children) {
	                  let failNode = curr.fail;
	                  while (failNode !== null && !failNode.children.has(char)) {
	                      failNode = failNode.fail;
	                  }
	                  child.fail = failNode ? failNode.children.get(char) : this.root;
	                  child.output.push(...child.fail.output);
	                  queue.push(child);
	              }
	          }
	      }
	  
	      search(text) {
	          const results = Array.from({ length: this.patterns.length }, () => []);
	          let curr = this.root;
	  
	          for (let i = 0; i < text.length; i++) {
	              const char = text[i];
	              while (curr !== null && !curr.children.has(char)) {
	                  curr = curr.fail;
	              }
	              curr = curr ? curr.children.get(char) : this.root;
	  
	              for (const idx of curr.output) {
	                  results[idx].push(i - this.patterns[idx].length + 1);
	              }
	          }
	          return results;
	      }
	  }
	  
	  // Example Usage
	  const ac = new AhoCorasickBase(["he", "she", "his", "hers"]);
	  console.log(ac.search("ushers")); // Output: [ [ 2 ], [ 1 ], [], [ 2 ] ]
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class AhoCorasickBase {
	      private static class TrieNode {
	          Map<Character, TrieNode> children = new HashMap<>();
	          TrieNode fail = null;
	          List<Integer> output = new ArrayList<>();
	      }
	  
	      private final TrieNode root;
	      private final String[] patterns;
	  
	      public AhoCorasickBase(String[] patterns) {
	          this.root = new TrieNode();
	          this.patterns = patterns;
	          buildTrie();
	          buildFailLinks();
	      }
	  
	      private void buildTrie() {
	          for (int i = 0; i < patterns.length; i++) {
	              TrieNode curr = root;
	              for (char c : patterns[i].toCharArray()) {
	                  curr.children.putIfAbsent(c, new TrieNode());
	                  curr = curr.children.get(c);
	              }
	              curr.output.add(i);
	          }
	      }
	  
	      private void buildFailLinks() {
	          Queue<TrieNode> queue = new LinkedList<>();
	          for (TrieNode child : root.children.values()) {
	              child.fail = root;
	              queue.add(child);
	          }
	  
	          while (!queue.isEmpty()) {
	              TrieNode curr = queue.poll();
	              for (Map.Entry<Character, TrieNode> entry : curr.children.entrySet()) {
	                  char c = entry.getKey();
	                  TrieNode child = entry.getValue();
	  
	                  TrieNode failNode = curr.fail;
	                  while (failNode != null && !failNode.children.containsKey(c)) {
	                      failNode = failNode.fail;
	                  }
	                  child.fail = failNode != null ? failNode.children.get(c) : root;
	                  child.output.addAll(child.fail.output);
	                  queue.add(child);
	              }
	          }
	      }
	  
	      public List<List<Integer>> search(String text) {
	          List<List<Integer>> results = new ArrayList<>();
	          for (int i = 0; i < patterns.length; i++) {
	              results.add(new ArrayList<>());
	          }
	  
	          TrieNode curr = root;
	          for (int i = 0; i < text.length(); i++) {
	              char c = text.charAt(i);
	              while (curr != null && !curr.children.containsKey(c)) {
	                  curr = curr.fail;
	              }
	              curr = curr != null ? curr.children.get(c) : root;
	  
	              for (int idx : curr.output) {
	                  results.get(idx).add(i - patterns[idx].length() + 1);
	              }
	          }
	          return results;
	      }
	  
	      public static void main(String[] args) {
	          String[] patterns = {"he", "she", "his", "hers"};
	          AhoCorasickBase ac = new AhoCorasickBase(patterns);
	          System.out.println(ac.search("ushers")); // Output: [[2], [1], [], [2]]
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  #include <string.h>
	  
	  #define ALPHABET_SIZE 26
	  
	  typedef struct TrieNode {
	      struct TrieNode* children[ALPHABET_SIZE];
	      struct TrieNode* fail;
	      int* output;
	      int output_size;
	      int output_capacity;
	  } TrieNode;
	  
	  TrieNode* createNode() {
	      TrieNode* node = (TrieNode*)malloc(sizeof(TrieNode));
	      for (int i = 0; i < ALPHABET_SIZE; i++) node->children[i] = NULL;
	      node->fail = NULL;
	      node->output = NULL;
	      node->output_size = 0;
	      node->output_capacity = 0;
	      return node;
	  }
	  
	  void addOutput(TrieNode* node, int val) {
	      if (node->output_size >= node->output_capacity) {
	          node->output_capacity = node->output_capacity == 0 ? 4 : node->output_capacity * 2;
	          node->output = (int*)realloc(node->output, node->output_capacity * sizeof(int));
	      }
	      node->output[node->output_size++] = val;
	  }
	  
	  void mergeOutput(TrieNode* dest, TrieNode* src) {
	      for (int i = 0; i < src->output_size; i++) {
	          addOutput(dest, src->output[i]);
	      }
	  }
	  
	  void insert(TrieNode* root, const char* pattern, int idx) {
	      TrieNode* curr = root;
	      for (int i = 0; pattern[i] != '\0'; i++) {
	          int char_idx = pattern[i] - 'a';
	          if (curr->children[char_idx] == NULL) {
	              curr->children[char_idx] = createNode();
	          }
	          curr = curr->children[char_idx];
	      }
	      addOutput(curr, idx);
	  }
	  
	  typedef struct QueueNode {
	      TrieNode* data;
	      struct QueueNode* next;
	  } QueueNode;
	  
	  typedef struct {
	      QueueNode *front, *rear;
	  } Queue;
	  
	  void enqueue(Queue* q, TrieNode* node) {
	      QueueNode* temp = (QueueNode*)malloc(sizeof(QueueNode));
	      temp->data = node;
	      temp->next = NULL;
	      if (q->rear == NULL) {
	          q->front = q->rear = temp;
	          return;
	      }
	      q->rear->next = temp;
	      q->rear = temp;
	  }
	  
	  TrieNode* dequeue(Queue* q) {
	      if (q->front == NULL) return NULL;
	      QueueNode* temp = q->front;
	      TrieNode* data = temp->data;
	      q->front = q->front->next;
	      if (q->front == NULL) q->rear = NULL;
	      free(temp);
	      return data;
	  }
	  
	  void buildFailLinks(TrieNode* root) {
	      Queue q = {NULL, NULL};
	      for (int i = 0; i < ALPHABET_SIZE; i++) {
	          if (root->children[i] != NULL) {
	              root->children[i]->fail = root;
	              enqueue(&q, root->children[i]);
	          }
	      }
	  
	      while (q.front != NULL) {
	          TrieNode* curr = dequeue(&q);
	          for (int i = 0; i < ALPHABET_SIZE; i++) {
	              if (curr->children[i] != NULL) {
	                  TrieNode* child = curr->children[i];
	                  TrieNode* failNode = curr->fail;
	                  while (failNode != NULL && failNode->children[i] == NULL) {
	                      failNode = failNode->fail;
	                  }
	                  child->fail = failNode != NULL ? failNode->children[i] : root;
	                  mergeOutput(child, child->fail);
	                  enqueue(&q, child);
	              }
	          }
	      }
	  }
	  
	  void search(TrieNode* root, const char* text, const char** patterns, int k) {
	      TrieNode* curr = root;
	      int text_len = strlen(text);
	      for (int i = 0; i < text_len; i++) {
	          int idx = text[i] - 'a';
	          while (curr != NULL && curr->children[idx] == NULL) {
	              curr = curr->fail;
	          }
	          curr = curr ? curr->children[idx] : root;
	  
	          for (int j = 0; j < curr->output_size; j++) {
	              int pat_idx = curr->output[j];
	              printf("Pattern '%s' found at index %d\n", patterns[pat_idx], i - (int)strlen(patterns[pat_idx]) + 1);
	          }
	      }
	  }
	  
	  void freeTrie(TrieNode* node) {
	      if (!node) return;
	      for (int i = 0; i < ALPHABET_SIZE; i++) {
	          freeTrie(node->children[i]);
	      }
	      if (node->output) free(node->output);
	      free(node);
	  }
	  
	  int main() {
	      TrieNode* root = createNode();
	      const char* patterns[] = {"he", "she", "his", "hers"};
	      int k = 4;
	      for (int i = 0; i < k; i++) insert(root, patterns[i], i);
	      buildFailLinks(root);
	      search(root, "ushers", patterns, k);
	      freeTrie(root);
	      return 0;
	  }
	  ```
	  
	  :::
-
- # Alternative Variant (Dictionary Links & Suffix Scanning Optimization)
  collapsed:: true
	- > [!tip] Optimizing Space Complexity via Dictionary Links
	  > Standard Aho-Corasick replicates indices inside output nodes during BFS queue traversal. This causes $O(M^2)$ worst-case output array size.
	  > By keeping a single parent-matching pointer (`dict_link`), nodes avoid output duplication and only traverse active matches, reducing space to strict **O(M * Σ)**.
	-
	- :::code-tabs
	  
	  ```python
	  from collections import deque
	  
	  class AhoCorasickVariant:
	      class TrieNode:
	          def __init__(self):
	              self.children = {}
	              self.fail = None
	              self.dict_link = None  # Pointer to the next node in the suffix path that matches a word
	              self.pattern_idx = -1  # Index of pattern ending here, -1 otherwise
	  
	      def __init__(self, patterns):
	          self.root = self.TrieNode()
	          self.patterns = patterns
	          self._build_trie()
	          self._build_fail_and_dict_links()
	  
	      def _build_trie(self):
	          for idx, pattern in enumerate(self.patterns):
	              curr = self.root
	              for char in pattern:
	                  if char not in curr.children:
	                      curr.children[char] = self.TrieNode()
	                  curr = curr.children[char]
	              curr.pattern_idx = idx
	  
	      def _build_fail_and_dict_links(self):
	          queue = deque()
	          for char, child in self.root.children.items():
	              child.fail = self.root
	              child.dict_link = None
	              queue.append(child)
	              
	          while queue:
	              curr = queue.popleft()
	              for char, child in curr.children.items():
	                  fail_node = curr.fail
	                  while fail_node is not None and char not in fail_node.children:
	                      fail_node = fail_node.fail
	                  child.fail = fail_node.children[char] if fail_node else self.root
	                  
	                  # Dictionary Link logic: link to the closest matching suffix node
	                  if child.fail.pattern_idx != -1:
	                      child.dict_link = child.fail
	                  else:
	                      child.dict_link = child.fail.dict_link
	                  queue.append(child)
	  
	      def search(self, text):
	          results = {idx: [] for idx in range(len(self.patterns))}
	          curr = self.root
	          for i, char in enumerate(text):
	              while curr is not None and char not in curr.children:
	                  curr = curr.fail
	              curr = curr.children[char] if curr else self.root
	              
	              # Trace only active dictionary matches
	              temp = curr
	              while temp is not None:
	                  if temp.pattern_idx != -1:
	                      start_idx = i - len(self.patterns[temp.pattern_idx]) + 1
	                      results[temp.pattern_idx].append(start_idx)
	                  temp = temp.dict_link
	          return results
	  
	  # Example Usage
	  if __name__ == "__main__":
	      patterns = ["he", "she", "his", "hers"]
	      ac = AhoCorasickVariant(patterns)
	      print(ac.search("ushers")) # Output: {0: [2], 1: [1], 2: [], 3: [2]}
	  ```
	  
	  ```cpp
	  #include <iostream>
	  #include <vector>
	  #include <string>
	  #include <unordered_map>
	  #include <queue>
	  
	  class AhoCorasickVariant {
	  private:
	      struct TrieNode {
	          std::unordered_map<char, TrieNode*> children;
	          TrieNode* fail = nullptr;
	          TrieNode* dict_link = nullptr;
	          int pattern_idx = -1;
	  
	          ~TrieNode() {
	              for (auto& pair : children) delete pair.second;
	          }
	      };
	  
	      TrieNode* root;
	      std::vector<std::string> patterns;
	  
	      void buildTrie() {
	          for (int i = 0; i < patterns.size(); ++i) {
	              TrieNode* curr = root;
	              for (char c : patterns[i]) {
	                  if (curr->children.find(c) == curr->children.end()) {
	                      curr->children[c] = new TrieNode();
	                  }
	                  curr = curr->children[c];
	              }
	              curr->pattern_idx = i;
	          }
	      }
	  
	      void buildLinks() {
	          std::queue<TrieNode*> q;
	          for (auto& pair : root->children) {
	              pair.second->fail = root;
	              q.push(pair.second);
	          }
	  
	          while (!q.empty()) {
	              TrieNode* curr = q.front();
	              q.pop();
	  
	              for (auto& pair : curr->children) {
	                  char c = pair.first;
	                  TrieNode* child = pair.second;
	                  TrieNode* failNode = curr->fail;
	  
	                  while (failNode != nullptr && failNode->children.find(c) == failNode->children.end()) {
	                      failNode = failNode->fail;
	                  }
	                  child->fail = failNode ? failNode->children[c] : root;
	  
	                  if (child->fail->pattern_idx != -1) {
	                      child->dict_link = child->fail;
	                  } else {
	                      child->dict_link = child->fail->dict_link;
	                  }
	                  q.push(child);
	              }
	          }
	      }
	  
	  public:
	      AhoCorasickVariant(const std::vector<std::string>& patterns) : patterns(patterns) {
	          root = new TrieNode();
	          buildTrie();
	          buildLinks();
	      }
	  
	      ~AhoCorasickVariant() {
	          delete root;
	      }
	  
	      std::vector<std::vector<int>> search(const std::string& text) {
	          std::vector<std::vector<int>> results(patterns.size());
	          TrieNode* curr = root;
	  
	          for (int i = 0; i < text.length(); ++i) {
	              char c = text[i];
	              while (curr != nullptr && curr->children.find(c) == curr->children.end()) {
	                  curr = curr->fail;
	              }
	              curr = curr ? curr->children[c] : root;
	  
	              TrieNode* temp = curr;
	              while (temp != nullptr) {
	                  if (temp->pattern_idx != -1) {
	                      results[temp->pattern_idx].push_back(i - patterns[temp->pattern_idx].length() + 1);
	                  }
	                  temp = temp->dict_link;
	              }
	          }
	          return results;
	      }
	  };
	  
	  int main() {
	      std::vector<std::string> patterns = {"he", "she", "his", "hers"};
	      AhoCorasickVariant ac(patterns);
	      auto res = ac.search("ushers");
	      for (int i = 0; i < patterns.size(); ++i) {
	          std::cout << patterns[i] << " matched at indices: ";
	          for (int idx : res[i]) std::cout << idx << " ";
	          std::cout << "\n";
	      }
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class AhoCorasickVariant {
	      constructor(patterns) {
	          this.patterns = patterns;
	          this.root = this.createNode();
	          this.buildTrie();
	          this.buildFailAndDictLinks();
	      }
	  
	      createNode() {
	          return {
	              children: new Map(),
	              fail: null,
	              dict_link: null,
	              pattern_idx: -1
	          };
	      }
	  
	      buildTrie() {
	          for (let i = 0; i < this.patterns.length; i++) {
	              const pattern = this.patterns[i];
	              let curr = this.root;
	              for (const char of pattern) {
	                  if (!curr.children.has(char)) {
	                      curr.children.set(char, this.createNode());
	                  }
	                  curr = curr.children.get(char);
	              }
	              curr.pattern_idx = i;
	          }
	      }
	  
	      buildFailAndDictLinks() {
	          const queue = [];
	          for (const [char, child] of this.root.children) {
	              child.fail = this.root;
	              queue.push(child);
	          }
	  
	          while (queue.length > 0) {
	              const curr = queue.shift();
	              for (const [char, child] of curr.children) {
	                  let failNode = curr.fail;
	                  while (failNode !== null && !failNode.children.has(char)) {
	                      failNode = failNode.fail;
	                  }
	                  child.fail = failNode ? failNode.children.get(char) : this.root;
	  
	                  if (child.fail.pattern_idx !== -1) {
	                      child.dict_link = child.fail;
	                  } else {
	                      child.dict_link = child.fail.dict_link;
	                  }
	                  queue.push(child);
	              }
	          }
	      }
	  
	      search(text) {
	          const results = Array.from({ length: this.patterns.length }, () => []);
	          let curr = this.root;
	  
	          for (let i = 0; i < text.length; i++) {
	              const char = text[i];
	              while (curr !== null && !curr.children.has(char)) {
	                  curr = curr.fail;
	              }
	              curr = curr ? curr.children.get(char) : this.root;
	  
	              let temp = curr;
	              while (temp !== null) {
	                  if (temp.pattern_idx !== -1) {
	                      results[temp.pattern_idx].push(i - this.patterns[temp.pattern_idx].length + 1);
	                  }
	                  temp = temp.dict_link;
	              }
	          }
	          return results;
	      }
	  }
	  
	  // Example Usage
	  const ac = new AhoCorasickVariant(["he", "she", "his", "hers"]);
	  console.log(ac.search("ushers")); // Output: [ [ 2 ], [ 1 ], [], [ 2 ] ]
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class AhoCorasickVariant {
	      private static class TrieNode {
	          Map<Character, TrieNode> children = new HashMap<>();
	          TrieNode fail = null;
	          TrieNode dict_link = null;
	          int pattern_idx = -1;
	      }
	  
	      private final TrieNode root;
	      private final String[] patterns;
	  
	      public AhoCorasickVariant(String[] patterns) {
	          this.root = new TrieNode();
	          this.patterns = patterns;
	          buildTrie();
	          buildLinks();
	      }
	  
	      private void buildTrie() {
	          for (int i = 0; i < patterns.length; i++) {
	              TrieNode curr = root;
	              for (char c : patterns[i].toCharArray()) {
	                  curr.children.putIfAbsent(c, new TrieNode());
	                  curr = curr.children.get(c);
	              }
	              curr.pattern_idx = i;
	          }
	      }
	  
	      private void buildLinks() {
	          Queue<TrieNode> queue = new LinkedList<>();
	          for (TrieNode child : root.children.values()) {
	              child.fail = root;
	              queue.add(child);
	          }
	  
	          while (!queue.isEmpty()) {
	              TrieNode curr = queue.poll();
	              for (Map.Entry<Character, TrieNode> entry : curr.children.entrySet()) {
	                  char c = entry.getKey();
	                  TrieNode child = entry.getValue();
	  
	                  TrieNode failNode = curr.fail;
	                  while (failNode != null && !failNode.children.containsKey(c)) {
	                      failNode = failNode.fail;
	                  }
	                  child.fail = failNode != null ? failNode.children.get(c) : root;
	  
	                  if (child.fail.pattern_idx != -1) {
	                      child.dict_link = child.fail;
	                  } else {
	                      child.dict_link = child.fail.dict_link;
	                  }
	                  queue.add(child);
	              }
	          }
	      }
	  
	      public List<List<Integer>> search(String text) {
	          List<List<Integer>> results = new ArrayList<>();
	          for (int i = 0; i < patterns.length; i++) {
	              results.add(new ArrayList<>());
	          }
	  
	          TrieNode curr = root;
	          for (int i = 0; i < text.length(); i++) {
	              char c = text.charAt(i);
	              while (curr != null && !curr.children.containsKey(c)) {
	                  curr = curr.fail;
	              }
	              curr = curr != null ? curr.children.get(c) : root;
	  
	              TrieNode temp = curr;
	              while (temp != null) {
	                  if (temp.pattern_idx != -1) {
	                      results.get(temp.pattern_idx).add(i - patterns[temp.pattern_idx].length() + 1);
	                  }
	                  temp = temp.dict_link;
	              }
	          }
	          return results;
	      }
	  
	      public static void main(String[] args) {
	          String[] patterns = {"he", "she", "his", "hers"};
	          AhoCorasickVariant ac = new AhoCorasickVariant(patterns);
	          System.out.println(ac.search("ushers")); // Output: [[2], [1], [], [2]]
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  #include <string.h>
	  
	  #define ALPHABET_SIZE 26
	  
	  typedef struct TrieNode {
	      struct TrieNode* children[ALPHABET_SIZE];
	      struct TrieNode* fail;
	      struct TrieNode* dict_link;
	      int pattern_idx;
	  } TrieNode;
	  
	  TrieNode* createNode() {
	      TrieNode* node = (TrieNode*)malloc(sizeof(TrieNode));
	      for (int i = 0; i < ALPHABET_SIZE; i++) node->children[i] = NULL;
	      node->fail = NULL;
	      node->dict_link = NULL;
	      node->pattern_idx = -1;
	      return node;
	  }
	  
	  void insert(TrieNode* root, const char* pattern, int idx) {
	      TrieNode* curr = root;
	      for (int i = 0; pattern[i] != '\0'; i++) {
	          int char_idx = pattern[i] - 'a';
	          if (curr->children[char_idx] == NULL) {
	              curr->children[char_idx] = createNode();
	          }
	          curr = curr->children[char_idx];
	      }
	      curr->pattern_idx = idx;
	  }
	  
	  typedef struct QueueNode {
	      TrieNode* data;
	      struct QueueNode* next;
	  } QueueNode;
	  
	  typedef struct {
	      QueueNode *front, *rear;
	  } Queue;
	  
	  void enqueue(Queue* q, TrieNode* node) {
	      QueueNode* temp = (QueueNode*)malloc(sizeof(QueueNode));
	      temp->data = node;
	      temp->next = NULL;
	      if (q->rear == NULL) {
	          q->front = q->rear = temp;
	          return;
	      }
	      q->rear->next = temp;
	      q->rear = temp;
	  }
	  
	  TrieNode* dequeue(Queue* q) {
	      if (q->front == NULL) return NULL;
	      QueueNode* temp = q->front;
	      TrieNode* data = temp->data;
	      q->front = q->front->next;
	      if (q->front == NULL) q->rear = NULL;
	      free(temp);
	      return data;
	  }
	  
	  void buildFailAndDictLinks(TrieNode* root) {
	      Queue q = {NULL, NULL};
	      for (int i = 0; i < ALPHABET_SIZE; i++) {
	          if (root->children[i] != NULL) {
	              root->children[i]->fail = root;
	              root->children[i]->dict_link = NULL;
	              enqueue(&q, root->children[i]);
	          }
	      }
	  
	      while (q.front != NULL) {
	          TrieNode* curr = dequeue(&q);
	          for (int i = 0; i < ALPHABET_SIZE; i++) {
	              if (curr->children[i] != NULL) {
	                  TrieNode* child = curr->children[i];
	                  TrieNode* failNode = curr->fail;
	                  while (failNode != NULL && failNode->children[i] == NULL) {
	                      failNode = failNode->fail;
	                  }
	                  child->fail = failNode != NULL ? failNode->children[i] : root;
	  
	                  if (child->fail->pattern_idx != -1) {
	                      child->dict_link = child->fail;
	                  } else {
	                      child->dict_link = child->fail->dict_link;
	                  }
	                  enqueue(&q, child);
	              }
	          }
	      }
	  }
	  
	  void search(TrieNode* root, const char* text, const char** patterns) {
	      TrieNode* curr = root;
	      int text_len = strlen(text);
	      for (int i = 0; i < text_len; i++) {
	          int idx = text[i] - 'a';
	          while (curr != NULL && curr->children[idx] == NULL) {
	              curr = curr->fail;
	          }
	          curr = curr ? curr->children[idx] : root;
	  
	          TrieNode* temp = curr;
	          while (temp != NULL) {
	              if (temp->pattern_idx != -1) {
	                  printf("Pattern '%s' found at index %d\n", patterns[temp->pattern_idx], i - (int)strlen(patterns[temp->pattern_idx]) + 1);
	              }
	              temp = temp->dict_link;
	          }
	      }
	  }
	  
	  void freeTrie(TrieNode* node) {
	      if (!node) return;
	      for (int i = 0; i < ALPHABET_SIZE; i++) {
	          freeTrie(node->children[i]);
	      }
	      free(node);
	  }
	  
	  int main() {
	      TrieNode* root = createNode();
	      const char* patterns[] = {"he", "she", "his", "hers"};
	      int k = 4;
	      for (int i = 0; i < k; i++) insert(root, patterns[i], i);
	      buildFailAndDictLinks(root);
	      search(root, "ushers", patterns);
	      freeTrie(root);
	      return 0;
	  }
	  ```
	  
	  :::
-
- # When to Use Aho-Corasick
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"What is the target requirement?"}
	      Q -- "Match single pattern" --> R1["❌ Use KMP / Boyer-Moore\nAho-Corasick is overkill for single patterns"]
	      Q -- "Match multiple patterns in a stream" --> R2["✅ Use Aho-Corasick\nScans stream in O(N) time with constant states"]
	      Q -- "Substrings are updated frequently" --> R3["❌ Use Suffix Automaton / Suffix Trees\nTrie reconstruction is too slow for mutable sets"]
	  ```
	-
	- ## ✅ Use Aho-Corasick When
		- You have a **fixed dictionary** of keys to match against text (e.g. bioinformatics scanning genomes for multiple target genes).
		- Building spam filters, virus scan engines, and network packets checking for intrusion/malware signatures.
		- The alphabet size is small or mid-size, keeping the memory allocation reasonable.
	-
	- ## ❌ Avoid Aho-Corasick When
		- You only have a single pattern to search (use [[Knuth Morris Pratt Algorithm (KMP)]] or [[Linear Search]]/Boyer-Moore).
		- Patterns are dynamic and change continuously (use Suffix Trees or Suffix Automata to allow dynamic adjustments).
-
- # Key Takeaways
  collapsed:: true
	- **Multi-Pattern matching** — solves the exact matching of multiple patterns in linear time.
	- **Automaton engine** — runs as a state machine where each node is a prefix state.
	- **Failure links** — represents the longest proper suffix of the current prefix state.
	- **Dictionary links** — short-circuits the suffix path to jump directly to matching patterns, saving traversal time.
	- **bzip2 and virus scanners** — represents the mathematical backend for classic multi-pattern identification systems.
-
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks -> Aho Corasick Algorithm](https://www.geeksforgeeks.org/aho-corasick-algorithm-pattern-searching/)
		- [Wikipedia -> Aho Corasick Algorithm](https://en.wikipedia.org/wiki/Aho%E2%80%93Corasick_algorithm)