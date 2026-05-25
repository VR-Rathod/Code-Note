---
seoTitle: Cuckoo Hashing Complete Guide – O(1) Worst-Case Lookup Hash Table
description: "A comprehensive guide on Cuckoo Hashing. Covers the two-table collision scheme, displacement chains, cycle detection, rehashing, and complete Python/C++ code."
keywords: "cuckoo hashing, hash table, collision resolution, worst-case O(1) lookup, eviction cycle, rehashing, open addressing, associative memory, C++, Python, VR-Rathod, Code-Note, code note vr, vr book"
---

> [!info] What is Cuckoo Hashing?
> **Cuckoo Hashing** is an open-addressing collision resolution scheme for hash tables that guarantees **$O(1)$ worst-case lookup and deletion time**.
> It is named after the cuckoo bird, which kicks out eggs of other birds from their nests to place its own. Similarly, when a collision occurs, Cuckoo Hashing evicts the resident element and forces it to locate an alternate position in another table.

- # Explanation
  - In standard chaining or linear probing hash tables, hash collisions can degrade lookups to $O(N)$ in the worst case. Cuckoo Hashing guarantees that any key is located in one of exactly two places. This makes lookups and deletions deterministic $O(1)$ operations, making it popular in hardware lookups, high-frequency routers, and caching layers.
  -
  - ## Real-World Analogy
    - **Shared Apartments**: Imagine a housing policy where every student has exactly two pre-assigned apartments they are allowed to live in. If student A moves into their first choice, and it's empty, they stay. If it's occupied by student B, student A kicks student B out. Student B must now move to their second choice apartment. If that apartment is occupied by student C, student B kicks student C out, who must then move to their other choice. This chain continues until everyone finds a home or a cycle forms (where students keep kicking each other out in loops), forcing the landlord to build larger apartments (rehashing).
-
- # How It Works
  collapsed:: true
  - ## Core Mechanics
    - A standard Cuckoo Hashing setup uses:
      1. Two separate hash tables: `Table 1` and `Table 2` of size $M$.
      2. Two different hash functions: $h_1(key)$ and $h_2(key)$.
    -
    - ### 1. Lookup
      - To find key $K$: check if `Table 1` at index $h_1(K)$ contains $K$, or if `Table 2` at index $h_2(K)$ contains $K$.
      - If not found in either, the key is not in the hash table.
      - **Complexity**: $O(1)$ guaranteed (at most 2 comparisons).
    -
    - ### 2. Insertion & Displacement Loop
      - 1. Try to insert key $K$ at `Table 1[h1(K)]`. If empty, insert $K$ and return.
      - 2. If occupied by some key $K_{\text{old}}$, insert $K$ at `Table 1[h1(K)]` anyway, evicting $K_{\text{old}}$.
      - 3. Try to insert the evicted key $K_{\text{old}}$ into `Table 2[h2(K_old)]`. If empty, insert it and return.
      - 4. If occupied, evict the resident key and repeat the process, alternating between tables.
    -
    - ### 3. Cycle Detection and Rehashing
      - If the eviction process enters a loop, it will repeat infinitely.
      - **Prevention**: We set a threshold `max_loop_count` (usually $2 \cdot M$ or a constant limit). If the number of evictions exceeds this threshold, we stop, double the size of the tables, choose new hash functions (by changing hash seeds), and rehash all elements.
  -
  - ## Visual Walkthrough
    - ### Insert key "X" (hashes: $h_1(X)=2, h_2(X)=5$)
      - 1. Check `Table 1[2]`. It is occupied by "A".
      - 2. Place "X" in `Table 1[2]`. "A" is now evicted.
      - 3. Check `Table 2[h2(A)]` (say $h_2(A)=5$).
      - 4. `Table 2[5]` is occupied by "B". Place "A" in `Table 2[5]`. "B" is now evicted.
      - 5. Check `Table 1[h1(B)]` (say $h_1(B)=7$).
      - 6. `Table 1[7]` is empty. Place "B" in `Table 1[7]`. Insertion complete!
-
- # Time & Space Complexity
  collapsed:: true
  - | Operation | Average-Case Complexity | Worst-Case Complexity |
    |---|---|---|
    | **Lookup** | $O(1)$ | $O(1)$ (Guaranteed) |
    | **Deletion** | $O(1)$ | $O(1)$ (Guaranteed) |
    | **Insertion** | $O(1)$ | $O(N)$ (When rehashing is triggered) |
    | **Space Complexity** | $O(N)$ | $O(N)$ |
  - *Note: To ensure O(1) average insertion times, the load factor of the cuckoo hash table must typically be kept below 50% ($r < 0.5$).*
-
- # Implementation
  collapsed:: true
  - :::code-tabs
    
    ```python
    class CuckooHash:
        def __init__(self, initial_capacity=8):
            self.capacity = initial_capacity
            self.table1 = [None] * self.capacity
            self.table2 = [None] * self.capacity
            self.num_elements = 0
            self.max_kicks = 50  # Eviction threshold to detect cycles
            
            # Simple seeds for hashing
            self.seed1 = 17
            self.seed2 = 31

        def _hash1(self, key):
            return (hash(key) ^ self.seed1) % self.capacity

        def _hash2(self, key):
            return (hash(key) ^ self.seed2) % self.capacity

        def lookup(self, key):
            """Checks if a key exists in the table in O(1) worst-case time."""
            h1 = self._hash1(key)
            if self.table1[h1] == key:
                return True
            h2 = self._hash2(key)
            if self.table2[h2] == key:
                return True
            return False

        def delete(self, key):
            """Deletes a key from the table in O(1) worst-case time."""
            h1 = self._hash1(key)
            if self.table1[h1] == key:
                self.table1[h1] = None
                self.num_elements -= 1
                return True
            h2 = self._hash2(key)
            if self.table2[h2] == key:
                self.table2[h2] = None
                self.num_elements -= 1
                return True
            return False

        def insert(self, key):
            """Inserts a key into the table, handling evictions and rehashing."""
            if self.lookup(key):
                return False  # Already exists

            current_key = key
            for kick in range(self.max_kicks):
                # Try placing in Table 1
                h1 = self._hash1(current_key)
                if self.table1[h1] is None:
                    self.table1[h1] = current_key
                    self.num_elements += 1
                    return True
                
                # Evict Table 1 resident
                current_key, self.table1[h1] = self.table1[h1], current_key

                # Try placing evicted key in Table 2
                h2 = self._hash2(current_key)
                if self.table2[h2] is None:
                    self.table2[h2] = current_key
                    self.num_elements += 1
                    return True
                
                # Evict Table 2 resident
                current_key, self.table2[h2] = self.table2[h2], current_key

            # Eviction limit hit! Cycle detected. Rehash.
            self._rehash()
            return self.insert(current_key)

        def _rehash(self):
            """Doubles the capacity and re-inserts all existing elements."""
            old_table1 = self.table1
            old_table2 = self.table2

            self.capacity *= 2
            self.table1 = [None] * self.capacity
            self.table2 = [None] * self.capacity
            self.num_elements = 0
            
            # Change seeds to select new hash functions
            self.seed1 += 7
            self.seed2 += 13

            # Reinsert all old keys
            for key in old_table1:
                if key is not None:
                    self.insert(key)
            for key in old_table2:
                if key is not None:
                    self.insert(key)

    # Example Usage
    if __name__ == "__main__":
        cuckoo = CuckooHash(4)
        cuckoo.insert("apple")
        cuckoo.insert("banana")
        cuckoo.insert("cherry")
        
        print("Lookup apple:", cuckoo.lookup("apple"))    # True
        print("Lookup orange:", cuckoo.lookup("orange"))  # False
        
        cuckoo.delete("apple")
        print("Lookup apple after delete:", cuckoo.lookup("apple"))  # False
    ```

    ```c++
    #include <iostream>
    #include <vector>
    #include <string>
    #include <functional>

    class CuckooHash {
    private:
        int capacity;
        std::vector<std::string> table1;
        std::vector<std::string> table2;
        int maxKicks;
        int numElements;
        size_t seed1;
        size_t seed2;

        size_t hash1(const std::string& key) const {
            std::hash<std::string> hasher;
            return (hasher(key) ^ seed1) % capacity;
        }

        size_t hash2(const std::string& key) const {
            std::hash<std::string> hasher;
            return (hasher(key) ^ seed2) % capacity;
        }

        void rehash() {
            std::vector<std::string> oldTable1 = table1;
            std::vector<std::string> oldTable2 = table2;

            capacity *= 2;
            table1.assign(capacity, "");
            table2.assign(capacity, "");
            numElements = 0;

            // Shift seeds to define new hash mappings
            seed1 += 7;
            seed2 += 13;

            for (const auto& key : oldTable1) {
                if (!key.empty()) insert(key);
            }
            for (const auto& key : oldTable2) {
                if (!key.empty()) insert(key);
            }
        }

    public:
        CuckooHash(int initialCapacity = 8) 
            : capacity(initialCapacity), maxKicks(50), numElements(0), seed1(17), seed2(31) {
            table1.assign(capacity, "");
            table2.assign(capacity, "");
        }

        bool lookup(const std::string& key) const {
            size_t h1 = hash1(key);
            if (table1[h1] == key) return true;
            size_t h2 = hash2(key);
            if (table2[h2] == key) return true;
            return false;
        }

        bool remove(const std::string& key) {
            size_t h1 = hash1(key);
            if (table1[h1] == key) {
                table1[h1] = "";
                numElements--;
                return true;
            }
            size_t h2 = hash2(key);
            if (table2[h2] == key) {
                table2[h2] = "";
                numElements--;
                return true;
            }
            return false;
        }

        bool insert(const std::string& key) {
            if (lookup(key)) return false; // Already present

            std::string currentKey = key;
            for (int kick = 0; kick < maxKicks; ++kick) {
                // Try placing in Table 1
                size_t h1 = hash1(currentKey);
                if (table1[h1].empty()) {
                    table1[h1] = currentKey;
                    numElements++;
                    return true;
                }

                // Evict Table 1 resident
                std::swap(currentKey, table1[h1]);

                // Try placing evicted key in Table 2
                size_t h2 = hash2(currentKey);
                if (table2[h2].empty()) {
                    table2[h2] = currentKey;
                    numElements++;
                    return true;
                }

                // Evict Table 2 resident
                std::swap(currentKey, table2[h2]);
            }

            // Exceeded max kicks, rehash and retry
            rehash();
            return insert(currentKey);
        }
    };

    int main() {
        CuckooHash cuckoo(4);
        cuckoo.insert("apple");
        cuckoo.insert("banana");
        cuckoo.insert("cherry");

        std::cout << std::boolalpha;
        std::cout << "Lookup apple: " << cuckoo.lookup("apple") << "\n";    // true
        std::cout << "Lookup orange: " << cuckoo.lookup("orange") << "\n";  // false

        cuckoo.remove("apple");
        std::cout << "Lookup apple after delete: " << cuckoo.lookup("apple") << "\n"; // false

        return 0;
    }
    ```

    :::
-
- # When to Use
  collapsed:: true
  - ## ✅ Use Cuckoo Hashing When:
    - Worst-case $O(1)$ lookups and deletions are required by your system SLA.
    - Implementing high-throughput networking lookups (e.g. IP routing tables, flow classifiers).
    - Designing hardware-based hash tables where querying multiple slots concurrently is efficient.
  - ## ❌ Do NOT Use Cuckoo Hashing When:
    - The load factor is expected to exceed 50% (leads to high eviction loop probability and thrashing).
    - Cache locality for insertion is critical (eviction chains require random lookups across multiple tables).
    - Space usage is constrained and you cannot afford the empty slots required to keep load factors low.
-
- # Variations & Related Concepts
  collapsed:: true
  - **d-way Cuckoo Hashing**: Uses $d$ hash functions (and potentially $d$ tables) instead of 2. This drastically increases the threshold load factor (e.g., up to 90% for $d=3$).
  - **Blocked Cuckoo Hashing**: Storing multiple elements per hash bucket (e.g. a bucket capacity of 4). This also improves load factor and cache efficiency.
-
- # Key Takeaways
  collapsed:: true
  - Cuckoo Hashing maps each key to exactly two slots, guaranteeing $O(1)$ worst-case lookup.
  - Collisions trigger eviction chains that displace elements to alternate slots.
  - Eviction loops are resolved by rehashing (doubling capacity and choosing new hash keys).
  - Keeps load factor below 50% to maintain constant-time average insertions.
-
- # More Learn
  collapsed:: true
  - ## GitHub & Webs
    - [Wikipedia -> Cuckoo hashing](https://en.wikipedia.org/wiki/Cuckoo_hashing)
    - [GeeksforGeeks -> Cuckoo Hashing](https://www.geeksforgeeks.org/cuckoo-hashing/)