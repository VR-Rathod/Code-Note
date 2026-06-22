---
seoTitle: LSM Trees vs B+ Trees (Database Storage Internals) – System Design
description: "A comprehensive guide on database storage engines. Learn the structural and operational differences between write-optimized LSM Trees and read-optimized B+ Trees."
keywords: "lsm tree, b+ tree, database internals, storage engine, sstable, memtable, write-ahead log, write amplification, compaction, read amplification, system design"
displayTitle: System Design - LSM & B+ Trees
title: System Design LSM and Bplus Trees
treeTitle: System Design - Databases - LSM & B+ Trees
---

> [!info] The Core Storage Engine Trade-off
> Databases are designed around how they organize data on disk.
> - **B+ Trees** prioritize **read speed** by updating data **in-place** (requiring random I/O).
> - **LSM Trees** prioritize **write throughput** by appending updates **out-of-place** in memory first, then flushing to sequential disk files (requiring sequential I/O).

- # B+ Trees (Read-Optimized)
  collapsed:: true
	- B+ Trees are the default indexing structure for traditional relational databases (like PostgreSQL, MySQL InnoDB, SQLite).
	-
	- ## Structure
		- A B+ Tree is an N-ary self-balancing search tree.
		- **Internal Nodes**: Only store routing keys and child pointers. They have a high branching factor (fan-out), meaning a tree can hold millions of keys in just 3 or 4 levels of depth.
		- **Leaf Nodes**: Store the actual data rows (or pointers to them) and are linked sequentially in a doubly linked list to make range queries $O(1)$ once the starting leaf is located.
	-
	- ## Write Path (In-Place Update)
		- 1. Traverses from the root to locate the target leaf node.
		- 2. Modifies the value directly inside that node (or inserts a new key).
		- 3. **Node Split**: If the leaf node exceeds its page capacity, it splits into two, and propagates the new split key up to parent nodes (potentially triggering recursive splits up to the root).
		- 4. **Random I/O**: Because records are scattered across different leaf blocks on disk, writing results in random disk writes.
-
- # LSM Trees (Write-Optimized)
  collapsed:: true
	- Log-Structured Merge (LSM) Trees are the default engine for high-throughput NoSQL databases (like Cassandra, RocksDB, LevelDB, InfluxDB).
	-
	- ## Write Path (Out-of-Place Append)
		- Writing to an LSM tree bypasses random disk updates completely:
		-
		- 1. **Write-Ahead Log (WAL)**: The write is appended to a disk-based log for durability (crash recovery). This is a fast, sequential write.
		- 2. **MemTable**: The write is added to an in-memory sorted structure (typically implemented as a **SkipList** or Red-Black Tree).
		- 3. Once the MemTable reaches its size limit (e.g., 64MB), it becomes read-only, and a background thread flushes its sorted contents to disk as an immutable **SSTable** (Sorted String Table).
	-
	- ## Read Path
		- 1. Search the active in-memory **MemTable**.
		- 2. If not found, check the active flushing immutable MemTables.
		- 3. If still not found, search the disk-based **SSTables**. To avoid searching every SSTable (which would be extremely slow), LSM trees use:
			- **Bloom Filters**: An in-memory filter that tells us instantly if a key is *definitely not* present in a given SSTable.
			- **Sparse Indexes**: An in-memory catalog of keys at regular byte offsets in the SSTable to locate ranges on disk.
	-
	- ## Compaction (Garbage Collection)
		- Since SSTables are immutable, updating a key simply writes a new entry with a later timestamp. Deleting writes a special marker called a **Tombstone**.
		- Background threads perform **Compaction** to merge multiple SSTables, keep only the latest version of duplicate keys, discard tombstones, and keep the total number of files low.
		-
		- - **Size-Tiered Compaction**: Merges SSTables of similar sizes. Best for writes, but has high space overhead.
		- - **Leveled Compaction**: Divides disk space into levels (L1, L2, L3...). Keys are partition-aligned, guaranteeing no overlapping keys within a level. Best for read latency and space efficiency.
-
- # Comparison & Trade-offs
  collapsed:: true
	- ## The Amplification Factor
		- In distributed databases, three core metrics are analyzed:
		- 1. **Write Amplification**: The ratio of bytes written to disk relative to bytes written by the user. (High in B+ Trees due to page-rewrites; High in LSM due to repetitive compaction).
		- 2. **Read Amplification**: The number of disk reads required to answer a single query. (High in LSM Trees since keys may span multiple SSTables; Low in B+ Trees).
		- 3. **Space Amplification**: The ratio of disk space used relative to the actual user data size. (High in LSM due to obsolete duplicates and tombstones awaiting compaction).
	-
	- ## Performance Summary
		- | Feature | B+ Trees | LSM Trees |
		  |---------|----------|-----------|
		  | **Primary Focus** | Fast Reads, Point Queries, Range Scans | Massive Write Throughput |
		  | **Write I/O Type** | Random I/O | Sequential I/O |
		  | **Read Complexity** | $O(\log_B N)$ (Usually 3-4 disk hits max) | $O(\text{SSTables} \cdot \log N)$ (Mitigated by Bloom Filters) |
		  | **Storage Fragmentation**| Higher (due to page splits and empty slots) | Lower (sequentially written pages) |
-
- # Implementation: Sparse Index Lookup
  collapsed:: true
	- :::code-tabs
	  
	  ```python
	  import bisect
	  from typing import List, Tuple, Optional
	  
	  class MockSSTable:
	      """
	      Simulation of an SSTable sparse index lookup.
	      Since SSTables on disk are sorted, we store a sparse index in memory
	      containing (key, byte_offset) to avoid indexing every single record.
	      """
	      def __init__(self, data: List[Tuple[str, str]], sparse_step: int = 3):
	          # Simulated file contents: sorted list of key-value pairs
	          self.file_data = sorted(data, key=lambda x: x[0])
	          
	          # Sparse Index: holds every Nth key and its index position
	          self.sparse_index_keys: List[str] = []
	          self.sparse_index_offsets: List[int] = []
	          
	          for i in range(0, len(self.file_data), sparse_step):
	              self.sparse_index_keys.append(self.file_data[i][0])
	              self.sparse_index_offsets.append(i)
	  
	      def get(self, key: str) -> Optional[str]:
	          if not self.sparse_index_keys:
	              return None
	              
	          # Use binary search (bisect) on sparse index keys
	          idx = bisect.bisect_right(self.sparse_index_keys, key) - 1
	          if idx < 0:
	              idx = 0
	              
	          # Scan from the offset returned by sparse index until we find the key
	          start_offset = self.sparse_index_offsets[idx]
	          end_offset = len(self.file_data)
	          if idx + 1 < len(self.sparse_index_keys):
	              end_offset = self.sparse_index_offsets[idx + 1] + 1
	              
	          # Scanning a very small range (simulates disk block scan)
	          for i in range(start_offset, end_offset):
	              current_key, current_val = self.file_data[i]
	              if current_key == key:
	                  return current_val
	              if current_key > key:
	                  break # Since data is sorted, key does not exist
	                  
	          return None
	  
	  # Example Usage
	  if __name__ == "__main__":
	      data_set = [
	          ("apple", "fruit1"), ("apricot", "fruit2"), ("banana", "fruit3"),
	          ("cherry", "fruit4"), ("dates", "fruit5"), ("elderberry", "fruit6"),
	          ("figs", "fruit7"), ("grapes", "fruit8")
	      ]
	      
	      sstable = MockSSTable(data_set, sparse_step=3)
	      print("Sparse Index Keys:", sstable.sparse_index_keys) # ['apple', 'cherry', 'figs']
	      
	      print("Lookup 'banana':", sstable.get("banana")) # fruit3
	      print("Lookup 'citrus':", sstable.get("citrus")) # None
	  ```
	  
	  ```javascript
	  // Binary search implementation for sorting range lookups
	  function binarySearchRange(keys, targetKey) {
	      let low = 0;
	      let high = keys.length - 1;
	      let resIdx = -1;
	      
	      while (low <= high) {
	          const mid = Math.floor((low + high) / 2);
	          if (keys[mid] <= targetKey) {
	              resIdx = mid; // Possible lower bound block
	              low = mid + 1;
	          } else {
	              high = mid - 1;
	          }
	      }
	      return resIdx;
	  }
	  ```
	  
	  :::
-
- # More Learn
  collapsed:: true
	- [Designing Data-Intensive Applications – Martin Kleppmann](https://dataintensive.net/) — Chapter 3 provides an excellent breakdown of SSTables, LSMs, and B-Trees.
	- [LSM Tree Architecture (Cassandra Docs)](https://cassandra.apache.org/doc/latest/cassandra/architecture/storage_engine.html) — Concrete implementation details.