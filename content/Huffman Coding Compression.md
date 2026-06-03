---
seoTitle: Huffman Coding Compression – Greedy Tree Building & Encoding Guide
description: "Master Huffman Coding for lossless data compression. Covers frequency table, min-heap tree construction, prefix-free code assignment, encoding and decoding, with full implementations in Python, C++, JavaScript, and Java."
keywords: "Huffman coding, lossless compression, prefix-free code, greedy algorithm, min-heap, entropy, frequency table, binary tree, encoding, decoding, ZIP, JPEG, Python, C++, Java, JavaScript"
displayTitle: Huffman Coding Compression
---

> [!info] What is Huffman Coding?
> **Huffman Coding** is a [[Greedy Algorithm Concepts|greedy]] lossless data compression algorithm that assigns **variable-length binary codes** to characters based on their frequency — more frequent characters get **shorter codes**, less frequent ones get **longer codes**.
> The result is a **prefix-free code**: no code is a prefix of another, enabling unambiguous decoding.
> Building the Huffman tree runs in **$O(N \log N)$** using a [[Heap (Data Structure)|min-heap]]. It achieves the **optimal** average code length for a given symbol probability distribution.

- # Explanation
  collapsed:: true
	- ## Core Idea
	  collapsed:: true
		- Given the string `"ABAACABAD"`, character frequencies are: `A=5, B=2, C=1, D=1`.
		- Standard ASCII encoding uses 8 bits/character → 9 chars × 8 = **72 bits**.
		- Huffman assigns: `A=0, B=10, C=110, D=111` → `5×1 + 2×2 + 1×3 + 1×3 = 16 bits` — a **78% reduction**.
	-
	- ## Prefix-Free Property
	  collapsed:: true
		- A code is **prefix-free** if no codeword is a prefix of another.
		- This guarantees **unambiguous decoding** — simply traverse the Huffman tree: go left for `0`, right for `1`, output the character at leaf nodes.
		- **Example**: If `A=0` and `B=01`, then `01` is ambiguous (is it `A+?` or `B`?). Huffman avoids this entirely.
	-
	- ## Huffman vs Fixed-Length Encoding
	  collapsed:: true
		- | Property | Fixed-Length (ASCII) | Huffman Coding |
		  |----------|----------------------|----------------|
		  | Code Length | Always 8 bits/char | Variable (1–N bits) |
		  | Decodable? | Yes (trivially) | Yes (prefix-free tree) |
		  | Optimal? | No | Yes (minimum expected length) |
		  | Use case | General text | Compression (ZIP, JPEG, MP3 headers) |
	-
	- ## Optimality Guarantee
	  collapsed:: true
		- Huffman coding produces the **shortest possible average code length** for a given symbol distribution (proven by Shannon's source coding theorem).
		- Average length $L = \sum p_i \times l_i$, where $p_i$ is probability and $l_i$ is code length.
		- This approaches the **entropy** $H = -\sum p_i \log_2 p_i$ bits/symbol — the theoretical minimum.
- # How It Works
  collapsed:: true
	- ## The Core Idea (4 Steps)
	  collapsed:: true
		- 1. **Count frequencies** of all characters.
		- 2. **Insert all characters** into a min-heap keyed by frequency.
		- 3. **Build the tree**: repeatedly extract the two lowest-frequency nodes, merge them into a new internal node (sum of frequencies), re-insert into heap. Repeat until one node remains (the root).
		- 4. **Assign codes**: traverse the tree — left edge = `'0'`, right edge = `'1'`. Each leaf's path = its code.
		-
		- ```mermaid
		  flowchart TD
		      A["Count character frequencies"] --> B["Insert all chars into min-heap"]
		      B --> C{"heap size > 1?"}
		      C -- Yes --> D["Extract two lowest-frequency nodes: L, R"]
		      D --> E["Create internal node:\nfreq = L.freq + R.freq\nleft=L, right=R"]
		      E --> F["Push internal node back into heap"]
		      F --> C
		      C -- No --> G["Root = remaining heap element"]
		      G --> H["DFS the tree:\nleft → '0', right → '1'\nleaf → assign code"]
		      H --> I["✅ Huffman codes ready\nEncode / Decode data"]
		  
		      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
		  ```
	-
	- ## Step-by-Step Trace (Input: "ABAACABAD")
	  collapsed:: true
		- ```
		  Frequencies: A=5, B=2, C=1, D=1
		  
		  Initial min-heap: [(1,C), (1,D), (2,B), (5,A)]
		  
		  Step 1: Extract C(1), D(1) → merge → CD(2)
		    Heap: [(2,B), (2,CD), (5,A)]
		  
		  Step 2: Extract B(2), CD(2) → merge → BCD(4)
		    Heap: [(4,BCD), (5,A)]
		  
		  Step 3: Extract BCD(4), A(5) → merge → root(9)
		    Heap: [(9,root)]
		  
		  Huffman Tree:
		        root(9)
		       /       \
		     A(5)     BCD(4)
		     [0]      [1]
		             /     \
		           B(2)    CD(2)
		           [10]    [11]
		                  /    \
		                C(1)  D(1)
		                [110] [111]
		  
		  Codes:  A=0, B=10, C=110, D=111
		  
		  Encoding "ABAACABAD":
		  A B  A A C   A B  A D
		  0 10 0 0 110 0 10 0 111
		  → "010001100100111"  (15 bits vs 72 bits fixed)
		  
		  Space saving: (72-15)/72 ≈ 79% compression ✅
		  ```
- # Complexity Analysis
  collapsed:: true
	- | Step | Time Complexity | Space Complexity | Notes |
	  |------|-----------------|------------------|-------|
	  | **Frequency Count** | **O(N)** | **O(K)** | N = input length, K = unique chars |
	  | **Heap Build** | **O(K)** | **O(K)** | heapify on K elements |
	  | **Tree Build** | **O(K log K)** | **O(K)** | K-1 merge operations, each O(log K) |
	  | **Code Assignment (DFS)** | **O(K)** | **O(K)** | One DFS pass |
	  | **Encoding** | **O(N)** | **O(N)** | Lookup + output |
	  | **Total** | **O(N + K log K)** | **O(N + K)** | K ≤ N, so often written O(N log N) |
	-
	- ## Decoding Complexity
	  collapsed:: true
		- Decoding a bit string of length $B$: $O(B \times \text{avg\_code\_length})$ — but with optimized trie traversal it's $O(B)$.
- # Implementation
  collapsed:: true
	- > [!note] Huffman Coding — Full Encode + Decode
	  > The implementation below includes tree construction, code table generation, encoding, and decoding with byte-level storage.
		- Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs
	  
	  ```python
	  import heapq
	  from collections import Counter
	  from dataclasses import dataclass, field
	  from typing import Optional
	  
	  @dataclass(order=True)
	  class HuffNode:
	      freq: int
	      char: Optional[str] = field(default=None, compare=False)
	      left: Optional["HuffNode"] = field(default=None, compare=False)
	      right: Optional["HuffNode"] = field(default=None, compare=False)
	  
	  def build_huffman_tree(text: str) -> HuffNode:
	      freq = Counter(text)
	      heap = [HuffNode(f, c) for c, f in freq.items()]
	      heapq.heapify(heap)
	  
	      while len(heap) > 1:
	          lo = heapq.heappop(heap)
	          hi = heapq.heappop(heap)
	          merged = HuffNode(lo.freq + hi.freq, left=lo, right=hi)
	          heapq.heappush(heap, merged)
	  
	      return heap[0]
	  
	  def generate_codes(node: HuffNode, prefix: str = "", codes: dict = None) -> dict:
	      if codes is None:
	          codes = {}
	      if node.char is not None:          # Leaf node
	          codes[node.char] = prefix or "0"  # single-char edge case
	      else:
	          if node.left:  generate_codes(node.left,  prefix + "0", codes)
	          if node.right: generate_codes(node.right, prefix + "1", codes)
	      return codes
	  
	  def huffman_encode(text: str) -> tuple[str, HuffNode]:
	      root = build_huffman_tree(text)
	      codes = generate_codes(root)
	      encoded = "".join(codes[c] for c in text)
	      return encoded, root
	  
	  def huffman_decode(encoded: str, root: HuffNode) -> str:
	      result = []
	      node = root
	      for bit in encoded:
	          node = node.left if bit == "0" else node.right
	          if node.char is not None:      # Reached a leaf
	              result.append(node.char)
	              node = root
	      return "".join(result)
	  
	  # Example
	  text = "ABAACABAD"
	  encoded, root = huffman_encode(text)
	  decoded = huffman_decode(encoded, root)
	  
	  codes = generate_codes(root)
	  print("Codes:", codes)
	  print(f"Original : {len(text)*8} bits")
	  print(f"Encoded  : {len(encoded)} bits")
	  print(f"Compression: {(1 - len(encoded)/(len(text)*8))*100:.1f}%")
	  print(f"Decoded  : {decoded}")          # ABAACABAD
	  assert decoded == text, "Decode error!"
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <queue>
	  #include <unordered_map>
	  #include <string>
	  #include <memory>
	  
	  struct HuffNode {
	      char ch;
	      int freq;
	      std::shared_ptr<HuffNode> left, right;
	      HuffNode(char c, int f) : ch(c), freq(f) {}
	      HuffNode(int f, std::shared_ptr<HuffNode> l, std::shared_ptr<HuffNode> r)
	          : ch('\0'), freq(f), left(l), right(r) {}
	  };
	  
	  struct Compare {
	      bool operator()(const std::shared_ptr<HuffNode>& a, const std::shared_ptr<HuffNode>& b) {
	          return a->freq > b->freq;
	      }
	  };
	  
	  void generateCodes(const std::shared_ptr<HuffNode>& node, const std::string& prefix,
	                     std::unordered_map<char, std::string>& codes) {
	      if (!node->left && !node->right) { codes[node->ch] = prefix.empty() ? "0" : prefix; return; }
	      if (node->left)  generateCodes(node->left,  prefix + "0", codes);
	      if (node->right) generateCodes(node->right, prefix + "1", codes);
	  }
	  
	  int main() {
	      std::string text = "ABAACABAD";
	      std::unordered_map<char, int> freq;
	      for (char c : text) freq[c]++;
	  
	      std::priority_queue<std::shared_ptr<HuffNode>,
	          std::vector<std::shared_ptr<HuffNode>>, Compare> pq;
	      for (auto& [c, f] : freq)
	          pq.push(std::make_shared<HuffNode>(c, f));
	  
	      while (pq.size() > 1) {
	          auto lo = pq.top(); pq.pop();
	          auto hi = pq.top(); pq.pop();
	          pq.push(std::make_shared<HuffNode>(lo->freq + hi->freq, lo, hi));
	      }
	  
	      std::unordered_map<char, std::string> codes;
	      generateCodes(pq.top(), "", codes);
	  
	      std::string encoded;
	      for (char c : text) encoded += codes[c];
	  
	      std::cout << "Encoded bits: " << encoded.size() << "\n"; // ~15
	      for (auto& [c, code] : codes)
	          std::cout << c << ": " << code << "\n";
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  class HuffNode {
	      constructor(char, freq, left = null, right = null) {
	          this.char = char;
	          this.freq = freq;
	          this.left = left;
	          this.right = right;
	      }
	  }
	  
	  // Simple min-heap for HuffNode
	  class MinHeap {
	      constructor() { this.heap = []; }
	      push(node) {
	          this.heap.push(node);
	          this.heap.sort((a, b) => a.freq - b.freq);
	      }
	      pop() { return this.heap.shift(); }
	      size() { return this.heap.length; }
	  }
	  
	  function buildHuffmanTree(text) {
	      const freq = {};
	      for (const ch of text) freq[ch] = (freq[ch] || 0) + 1;
	  
	      const heap = new MinHeap();
	      for (const [ch, f] of Object.entries(freq)) heap.push(new HuffNode(ch, f));
	  
	      while (heap.size() > 1) {
	          const lo = heap.pop(), hi = heap.pop();
	          heap.push(new HuffNode(null, lo.freq + hi.freq, lo, hi));
	      }
	      return heap.pop();
	  }
	  
	  function generateCodes(node, prefix = "", codes = {}) {
	      if (node.char !== null) { codes[node.char] = prefix || "0"; return codes; }
	      if (node.left)  generateCodes(node.left,  prefix + "0", codes);
	      if (node.right) generateCodes(node.right, prefix + "1", codes);
	      return codes;
	  }
	  
	  function huffmanEncode(text) {
	      const root = buildHuffmanTree(text);
	      const codes = generateCodes(root);
	      const encoded = text.split("").map(c => codes[c]).join("");
	      return { encoded, root, codes };
	  }
	  
	  function huffmanDecode(encoded, root) {
	      let node = root, result = "";
	      for (const bit of encoded) {
	          node = bit === "0" ? node.left : node.right;
	          if (node.char !== null) { result += node.char; node = root; }
	      }
	      return result;
	  }
	  
	  const text = "ABAACABAD";
	  const { encoded, root, codes } = huffmanEncode(text);
	  console.log("Codes:", codes);
	  console.log(`Compressed: ${encoded.length} bits vs ${text.length * 8} bits`);
	  console.log("Decoded:", huffmanDecode(encoded, root)); // ABAACABAD
	  ```
	  
	  ```java
	  import java.util.*;
	  
	  public class HuffmanCoding {
	      static class Node implements Comparable<Node> {
	          char ch; int freq;
	          Node left, right;
	          Node(char c, int f) { ch = c; freq = f; }
	          Node(int f, Node l, Node r) { freq = f; left = l; right = r; }
	          public int compareTo(Node o) { return this.freq - o.freq; }
	      }
	  
	      static void generateCodes(Node node, String prefix, Map<Character, String> codes) {
	          if (node.left == null && node.right == null) {
	              codes.put(node.ch, prefix.isEmpty() ? "0" : prefix); return;
	          }
	          if (node.left  != null) generateCodes(node.left,  prefix + "0", codes);
	          if (node.right != null) generateCodes(node.right, prefix + "1", codes);
	      }
	  
	      public static void main(String[] args) {
	          String text = "ABAACABAD";
	          Map<Character, Integer> freq = new HashMap<>();
	          for (char c : text.toCharArray()) freq.merge(c, 1, Integer::sum);
	  
	          PriorityQueue<Node> pq = new PriorityQueue<>();
	          for (var e : freq.entrySet()) pq.offer(new Node(e.getKey(), e.getValue()));
	  
	          while (pq.size() > 1) {
	              Node lo = pq.poll(), hi = pq.poll();
	              pq.offer(new Node(lo.freq + hi.freq, lo, hi));
	          }
	  
	          Map<Character, String> codes = new HashMap<>();
	          generateCodes(pq.poll(), "", codes);
	  
	          StringBuilder encoded = new StringBuilder();
	          for (char c : text.toCharArray()) encoded.append(codes.get(c));
	  
	          System.out.println("Codes: " + codes);
	          System.out.println("Encoded bits: " + encoded.length()); // ~15
	      }
	  }
	  ```
	  
	  :::
- # Alternative Variant (Adaptive Huffman Coding)
  collapsed:: true
	- > [!tip] Adaptive (Dynamic) Huffman Coding
	  > Standard Huffman requires knowing all character frequencies in advance (two-pass: read data twice). **Adaptive Huffman** (Vitter algorithm) updates the tree **on-the-fly** as each symbol is encoded/decoded — enabling single-pass streaming compression.
	- | Property | Static Huffman | Adaptive Huffman |
	  |----------|----------------|-----------------|
	  | Passes needed | 2 (count + encode) | 1 (streaming) |
	  | Tree sent? | Must transmit with data | Reconstructed during decode |
	  | Update overhead | None | O(log K) per symbol |
	  | Use case | File compression | Stream compression, real-time |
- # When to Use Huffman Coding
  collapsed:: true
	- ```mermaid
	  flowchart TD
	      Q{"Do you need lossless\ncompression of data\nwith known symbol frequencies?"}
	      Q -- No --> R1["Use lossy compression\n(JPEG DCT, MP3 psychoacoustics)"]
	      Q -- Yes --> S1{"Is the data a\nstream (real-time)?"}
	      S1 -- Yes --> R2["✅ Adaptive Huffman\n(Vitter algorithm, single-pass)"]
	      S1 -- No --> S2{"Is symbol distribution\nhighly skewed?"}
	      S2 -- Yes --> R3["✅ Static Huffman\n(maximum compression gain)"]
	      S2 -- No --> R4["Consider Arithmetic Coding\n(approaches entropy more closely)"]
	  
	      classDef default fill:#1f2937,stroke:#3b82f6,stroke-width:2px,color:#fff;
	  ```
	-
	- ## ✅ Use Huffman Coding When
		- You need **optimal prefix-free codes** for a known symbol distribution.
		- **Lossless file compression** — ZIP, GZIP, DEFLATE, PNG all use Huffman internally.
		- **JPEG/MP3** — quantized DCT coefficients and Huffman-coded for the bitstream layer.
		- Implementing a **priority queue / greedy tree-building** problem for an interview.
	-
	- ## ❌ Avoid Huffman When
		- Symbols have **nearly uniform frequency** — Huffman overhead exceeds benefit.
		- You need **higher compression ratios** — use Arithmetic Coding or LZ77/LZ78 (used in ZIP).
		- The alphabet is very large (e.g., Unicode) — the code table transmission overhead may dominate.
- # Key Takeaways
  collapsed:: true
	- **Greedy Optimality** — Huffman coding is provably optimal: it minimizes the expected code length $\sum p_i l_i$ for any symbol distribution (Shannon's source coding theorem).
	- **Prefix-Free Guarantee** — All codes are leaf-to-root paths in the Huffman tree, ensuring no code is a prefix of another → unambiguous decoding.
	- **Min-Heap Is the Engine** — The [[Heap (Data Structure)|min-heap]] makes extracting the two lowest-frequency nodes $O(\log K)$, giving overall $O(K \log K)$ tree construction.
	- **Two-Pass Algorithm** — First pass counts frequencies; second pass encodes. Adaptive Huffman eliminates the first pass for streaming.
	- **Real-World Use** — DEFLATE (ZIP, GZIP, PNG, HTTP/2) = LZ77 dictionary compression + Huffman coding. JPEG = DCT quantization + Huffman coding.
	- **Entropy Lower Bound** — Average Huffman code length is within 1 bit of the entropy $H = -\sum p_i \log_2 p_i$ — the theoretical minimum.
- # More Learn
  collapsed:: true
	- ## GitHub & Webs
		- [GeeksforGeeks → Huffman Coding](https://www.geeksforgeeks.org/huffman-coding-greedy-algo-3/)
		- [Visualgo → Huffman Tree Visualization](https://visualgo.net/en/huffman)
		- [LeetCode → Encode/Decode Strings (Problem 271)](https://leetcode.com/problems/encode-and-decode-strings/)
		- [TheAlgorithms – Huffman (Python)](https://github.com/TheAlgorithms/Python/blob/master/compression/huffman.py)
		- [Wikipedia → Huffman Coding](https://en.wikipedia.org/wiki/Huffman_coding)