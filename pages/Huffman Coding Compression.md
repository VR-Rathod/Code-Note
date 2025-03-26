# Explanation
	- **Huffman Coding** is a **lossless data compression** algorithm that assigns variable-length codes to input characters based on their frequencies.
	-
	- The idea is to give shorter codes to characters that appear more frequently and longer codes to less frequent characters. This results in compressed data representation.
	-
	- It is widely used in file compression formats like **ZIP** and **JPEG**.
-
- # Steps
	- **Build a frequency table** of characters in the input.
	-
	- **Build a priority queue (min-heap)** using the frequency of each character.
	-
	- **Build a Huffman Tree**: Combine the two nodes with the lowest frequency until there is only one node left. This node is the root of the Huffman tree.
	-
	- **Generate Huffman codes**: Traverse the tree to assign binary codes to each character.
	-
	- **Encode the input data** using the generated Huffman codes.
	-
	- **Decode the data** by traversing the Huffman tree.
-
- # Time Complexity
	- **Building the frequency table**: O(n), where n is the number of characters.
	-
	- **Building the heap**: O(n log n), where n is the number of unique characters.
	-
	- **Encoding**: O(n), where n is the length of the input.
-
- ```python
  import heapq
  from collections import defaultdict
  
  # Step 1: Build frequency table
  def build_frequency_table(data):
      freq = defaultdict(int)
      for char in data:
          freq[char] += 1
      return freq
  
  # Step 2: Build the Huffman Tree
  def build_huffman_tree(freq):
      heap = [[weight, [char, ""]] for char, weight in freq.items()]
      heapq.heapify(heap)
      
      while len(heap) > 1:
          lo = heapq.heappop(heap)
          hi = heapq.heappop(heap)
          
          for pair in lo[1:]:
              pair[1] = '0' + pair[1]
          for pair in hi[1:]:
              pair[1] = '1' + pair[1]
          
          heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])
      
      return sorted(heap[0][1:], key=lambda p: (len(p[-1]), p))
  
  # Step 3: Encode data using the Huffman Tree
  def encode(data, huffman_tree):
      huff_dict = {item[0]: item[1] for item in huffman_tree}
      return ''.join(huff_dict[char] for char in data)
  
  # Example Usage
  data = "this is an example for huffman encoding"
  freq_table = build_frequency_table(data)
  huffman_tree = build_huffman_tree(freq_table)
  encoded_data = encode(data, huffman_tree)
  
  print(f"Encoded Data: {encoded_data}")
  ```