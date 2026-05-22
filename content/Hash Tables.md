---
seoTitle: Hash Tables Data Structure - Premium DSA Guide
description: "Master Hash Tables (Hash Maps, Dictionaries). Understand hash functions, O(1) lookups, collision resolution techniques like Chaining and Linear Probing, and multi-language implementations."
keywords: "Hash Table, Hash Map, Dictionary, DSA, Data Structures, Hashing, Collision Handling, Chaining, Linear Probing"
---

> [!info] What is a Hash Table?
> A **Hash Table** (often called a Hash Map or Dictionary) is a data structure that implements an associative array abstract data type, a structure that can map **keys to values**. It uses a **hash function** to compute an index into an array of buckets or slots, from which the desired value can be found in $O(1)$ time.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine a giant **Library** with millions of books.
		- If you want to find a book by its title ("Harry Potter"), searching every shelf sequentially would take forever ($O(N)$).
		- Instead, you go to the Librarian (the **Hash Function**). You tell the Librarian the title. The Librarian runs a mental calculation and says: *"Harry Potter belongs on Floor 3, Aisle 12, Shelf B."* (the **Index**).
		- You walk directly to that exact spot and grab the book instantly ($O(1)$).
	-
	- ## The Magic of Hashing
	  collapsed:: true
		- Arrays give you $O(1)$ access *only if* you know the integer index (`arr[5]`).
		- A Hash Table gives you $O(1)$ access using *any data type* (like a String `map["Harry Potter"]`).
		- It achieves this by running the String through a **Hash Function**, which scrambles the letters and converts them into a massive integer. It then uses the modulo operator `%` based on the array size to fit that integer into the bounds of a backing array.
		-
		- ```mermaid
		  flowchart LR
		      Key["Key: 'John'"] --> HF[Hash Function]
		      HF -->|Produces Hash: 389274| Mod[Modulo Array Size]
		      Mod -->|Index: 2| Arr[Array Bucket #2]
		  ```
	-
	- ## Dealing with Collisions
	  collapsed:: true
		- A Hash Function maps an infinite number of possible strings into a finite number of array slots. Therefore, **collisions are guaranteed** (two different keys producing the exact same index).
		- There are two main ways to resolve collisions:
		-
		- ### 1. Separate Chaining
		  Instead of storing the value directly in the array slot, each array slot holds a **Linked List**. If a collision occurs, the new key-value pair is simply appended to the linked list at that index.
		- ### 2. Open Addressing (Linear Probing)
		  If a collision occurs (the slot is already full), the algorithm simply looks at the *very next* adjacent array slot. If that's full, it looks at the next one, until it finds an empty slot to place the data.

- # Time & Space Complexity
  collapsed:: true
	- > [!important] The $O(1)$ Illusion
	  > Hash Tables are widely considered to have $O(1)$ time complexity for all operations. However, this is only the *average* case. In the *worst* case (if every single key collides and gets dumped into the exact same Linked List), the time complexity degrades to $O(N)$.
	-
	- | Operation | Best / Average Case | Worst Case |
	  |-----------|---------------------|------------|
	  | **Search / Get** | $O(1)$ | $O(N)$ |
	  | **Insert / Put** | $O(1)$ | $O(N)$ |
	  | **Delete / Remove** | $O(1)$ | $O(N)$ |
	  | **Space Complexity**| $O(N)$ | $O(N)$ |

- # Implementation
  collapsed:: true
	- > [!note] Building a Hash Table with Chaining
	  > Below is an implementation of a Hash Table from scratch, resolving collisions using the **Separate Chaining** (Linked List) technique.
	-
	- :::code-tabs
	  
	  ```python
	  class Node:
	      def __init__(self, key, value):
	          self.key = key
	          self.value = value
	          self.next = None
	  
	  class HashTable:
	      def __init__(self, capacity=10):
	          self.capacity = capacity
	          self.buckets = [None] * capacity
	          
	      def _hash(self, key):
	          return hash(key) % self.capacity
	          
	      def put(self, key, value):
	          index = self._hash(key)
	          node = self.buckets[index]
	          
	          if node is None:
	              self.buckets[index] = Node(key, value)
	              return
	              
	          prev = None
	          while node:
	              if node.key == key: # Update existing key
	                  node.value = value
	                  return
	              prev = node
	              node = node.next
	          prev.next = Node(key, value)
	          
	      def get(self, key):
	          index = self._hash(key)
	          node = self.buckets[index]
	          while node:
	              if node.key == key:
	                  return node.value
	              node = node.next
	          raise KeyError("Key not found")
	  
	  # Usage
	  ht = HashTable()
	  ht.put("apple", 100)
	  ht.put("banana", 200)
	  print(ht.get("apple")) # Output: 100
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <string>
	  #include <vector>
	  
	  struct HashNode {
	      std::string key;
	      int value;
	      HashNode* next;
	      HashNode(std::string k, int v) : key(k), value(v), next(nullptr) {}
	  };
	  
	  class HashTable {
	      std::vector<HashNode*> buckets;
	      int capacity;
	  
	      int hashFunction(std::string key) {
	          int hash = 0;
	          for (char c : key) {
	              hash = (hash * 31 + c) % capacity;
	          }
	          return hash;
	      }
	  
	  public:
	      HashTable(int cap = 10) {
	          capacity = cap;
	          buckets.assign(capacity, nullptr);
	      }
	  
	      void put(std::string key, int value) {
	          int index = hashFunction(key);
	          HashNode* node = buckets[index];
	          
	          if (node == nullptr) {
	              buckets[index] = new HashNode(key, value);
	              return;
	          }
	          
	          HashNode* prev = nullptr;
	          while (node != nullptr) {
	              if (node->key == key) {
	                  node->value = value;
	                  return;
	              }
	              prev = node;
	              node = node->next;
	          }
	          prev->next = new HashNode(key, value);
	      }
	  
	      int get(std::string key) {
	          int index = hashFunction(key);
	          HashNode* node = buckets[index];
	          while (node != nullptr) {
	              if (node->key == key) return node->value;
	              node = node->next;
	          }
	          throw std::runtime_error("Key not found");
	      }
	  };
	  
	  int main() {
	      HashTable ht;
	      ht.put("apple", 100);
	      std::cout << ht.get("apple") << std::endl;
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class HashNode {
	      constructor(key, value) {
	          this.key = key;
	          this.value = value;
	          this.next = null;
	      }
	  }
	  
	  class HashTable {
	      constructor(capacity = 10) {
	          this.capacity = capacity;
	          this.buckets = new Array(capacity).fill(null);
	      }
	  
	      _hash(key) {
	          let hash = 0;
	          for (let i = 0; i < key.length; i++) {
	              hash = (hash * 31 + key.charCodeAt(i)) % this.capacity;
	          }
	          return hash;
	      }
	  
	      put(key, value) {
	          const index = this._hash(key);
	          let node = this.buckets[index];
	          
	          if (!node) {
	              this.buckets[index] = new HashNode(key, value);
	              return;
	          }
	          
	          let prev = null;
	          while (node) {
	              if (node.key === key) {
	                  node.value = value;
	                  return;
	              }
	              prev = node;
	              node = node.next;
	          }
	          prev.next = new HashNode(key, value);
	      }
	  
	      get(key) {
	          const index = this._hash(key);
	          let node = this.buckets[index];
	          while (node) {
	              if (node.key === key) return node.value;
	              node = node.next;
	          }
	          throw new Error("Key not found");
	      }
	  }
	  
	  // Usage
	  const ht = new HashTable();
	  ht.put("apple", 100);
	  console.log(ht.get("apple")); // Output: 100
	  ```
	  
	  ```java
	  class HashNode {
	      String key;
	      int value;
	      HashNode next;
	      HashNode(String k, int v) { key = k; value = v; }
	  }
	  
	  public class HashTable {
	      private HashNode[] buckets;
	      private int capacity;
	  
	      public HashTable() {
	          this(10);
	      }
	  
	      public HashTable(int capacity) {
	          this.capacity = capacity;
	          buckets = new HashNode[capacity];
	      }
	  
	      private int hash(String key) {
	          return Math.abs(key.hashCode() % capacity);
	      }
	  
	      public void put(String key, int value) {
	          int index = hash(key);
	          HashNode node = buckets[index];
	          
	          if (node == null) {
	              buckets[index] = new HashNode(key, value);
	              return;
	          }
	          
	          HashNode prev = null;
	          while (node != null) {
	              if (node.key.equals(key)) {
	                  node.value = value;
	                  return;
	              }
	              prev = node;
	              node = node.next;
	          }
	          prev.next = new HashNode(key, value);
	      }
	  
	      public int get(String key) {
	          int index = hash(key);
	          HashNode node = buckets[index];
	          while (node != null) {
	              if (node.key.equals(key)) return node.value;
	              node = node.next;
	          }
	          throw new RuntimeException("Key not found");
	      }
	  
	      public static void main(String[] args) {
	          HashTable ht = new HashTable();
	          ht.put("apple", 100);
	          System.out.println(ht.get("apple")); // Output: 100
	      }
	  }
	  ```
	  
	  ```c
	  #include <stdio.h>
	  #include <stdlib.h>
	  #include <string.h>
	  
	  struct HashNode {
	      char* key;
	      int value;
	      struct HashNode* next;
	  };
	  
	  struct HashTable {
	      struct HashNode** buckets;
	      int capacity;
	  };
	  
	  struct HashTable* createHashTable(int capacity) {
	      struct HashTable* ht = (struct HashTable*)malloc(sizeof(struct HashTable));
	      ht->capacity = capacity;
	      ht->buckets = (struct HashNode**)calloc(capacity, sizeof(struct HashNode*));
	      return ht;
	  }
	  
	  int hashFunction(struct HashTable* ht, const char* key) {
	      int hash = 0;
	      for (int i = 0; key[i] != '\0'; i++) {
	          hash = (hash * 31 + key[i]) % ht->capacity;
	      }
	      return hash;
	  }
	  
	  void put(struct HashTable* ht, const char* key, int value) {
	      int index = hashFunction(ht, key);
	      struct HashNode* node = ht->buckets[index];
	      
	      if (node == NULL) {
	          struct HashNode* newNode = (struct HashNode*)malloc(sizeof(struct HashNode));
	          newNode->key = strdup(key);
	          newNode->value = value;
	          newNode->next = NULL;
	          ht->buckets[index] = newNode;
	          return;
	      }
	      
	      struct HashNode* prev = NULL;
	      while (node != NULL) {
	          if (strcmp(node->key, key) == 0) {
	              node->value = value;
	              return;
	          }
	          prev = node;
	          node = node->next;
	      }
	      struct HashNode* newNode = (struct HashNode*)malloc(sizeof(struct HashNode));
	      newNode->key = strdup(key);
	      newNode->value = value;
	      newNode->next = NULL;
	      prev->next = newNode;
	  }
	  
	  int get(struct HashTable* ht, const char* key) {
	      int index = hashFunction(ht, key);
	      struct HashNode* node = ht->buckets[index];
	      while (node != NULL) {
	          if (strcmp(node->key, key) == 0) return node->value;
	          node = node->next;
	      }
	      printf("Key not found\n");
	      exit(EXIT_FAILURE);
	  }
	  
	  int main() {
	      struct HashTable* ht = createHashTable(10);
	      put(ht, "apple", 100);
	      printf("%d\n", get(ht, "apple"));
	      return 0;
	  }
	  ```
	  :::
-
- # Advanced Usage
	- Hash Tables are the most frequently used data structure in competitive programming and system design due to their speed.
	- **[[Two Pointers Technique]] & Sum Problems**: Used to store compliments in Two-Sum problems.
	- **Caching (LRU Cache)**: Hash Tables combined with Doubly Linked Lists create ultra-fast cache evictions.
	- **[[Zobrist Hashing]] & String Matching**: Algorithms like [[Rabin-Karp Algorithm]] use hashing for lightning-fast pattern matching.
