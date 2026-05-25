---
seoTitle: Binary System – In-Depth Guide to Logic, Architecture, Graphics & Cybersecurity
description: "An exhaustive, textbook-level guide to the Binary system. Explore bitwise logic, hardware ALUs, IEEE 754, Two's Complement, and advanced applications in Computer Graphics and Cybersecurity."
keywords: "binary system, bitwise logic, IEEE 754 floating point, morton codes, z-order curve, color packing, xor cipher, bit-flipping attack, subnet masking, VR-Rathod, Code-Note, code note vr, vr book, ALU, logic gates, endianness"
---

> [!info] What is the Binary System?
> The **Binary System (Base-2)** is the absolute fundamental language of all modern computing systems. 
> At a microscopic level, computer processors are composed of billions of transistors—tiny electrical switches. Because these switches can only reliably detect and maintain two distinct voltage states (High/Voltage Present and Low/Voltage Absent), computers use a mathematical system that only has two digits: **1 (High/On)** and **0 (Low/Off)**. Every single piece of data—from a simple text file to a complex 3D video game rendering engine, network packet, or cryptographic hash—is ultimately encoded, processed, stored, and transmitted as a sequence of these 1s and 0s.

- # Chapter 1: The Mathematics of Base-2
  - The mathematics of binary is based on positional notation, exactly like our everyday Decimal (Base-10) system, but constrained to powers of 2 instead of powers of 10.
  
  - ## 1. Positional Notation
    - In Decimal (Base-10), each position represents a power of 10 ($10^0, 10^1, 10^2...$).
    - In Binary (Base-2), each position represents a power of 2 ($2^0, 2^1, 2^2...$).
    - For example, the binary number `1101` is evaluated from right to left:
      - `1` $\times 2^0$ = 1
      - `0` $\times 2^1$ = 0
      - `1` $\times 2^2$ = 4
      - `1` $\times 2^3$ = 8
      - Total = $1 + 0 + 4 + 8 = 13$ (Decimal).

  - ## 2. Number Systems Conversions
    - To seamlessly transition between the hardware level and human-readable code, we must frequently convert numbers across Binary, Decimal, and Hexadecimal formats.
    
    - ### Decimal to Binary Conversion
      - Algorithm: Repeatedly divide the decimal number by 2. The remainders (read bottom-to-top or last-to-first) form the binary number.
      - **Example: Convert 25 to Binary**
        - $25 \div 2 = 12$ Remainder **1**
        - $12 \div 2 = 6$ Remainder **0**
        - $6 \div 2 = 3$ Remainder **0**
        - $3 \div 2 = 1$ Remainder **1**
        - $1 \div 2 = 0$ Remainder **1**
        - Result (reading remainders upwards): **11001**
        
    - ### Binary to Hexadecimal (Base-16)
      - Binary is too verbose for humans to read easily (e.g., `1111111100000000` is hard to parse visually). Hexadecimal (Base-16) groups binary digits into chunks of 4 (called a "nibble").
      - $2^4 = 16$, which perfectly maps exactly 4 bits to 1 Hex character (`0-9`, `A-F`).
      - Example: `11010110` -> Split into `1101` and `0110` -> `D` and `6` -> `0xD6`.

  - ## 3. Endianness (Memory Storage)
    - How does a computer store a multi-byte binary number (like a 32-bit integer) in memory? Memory is addressed byte-by-byte (8 bits at a time).
    - If we have the 32-bit hex number `0x12345678`:
      - **Big-Endian**: Stores the most significant byte (`12`) at the lowest memory address. (Used in network protocols like TCP/IP).
        - Mem[0]: `12`, Mem[1]: `34`, Mem[2]: `56`, Mem[3]: `78`
      - **Little-Endian**: Stores the least significant byte (`78`) at the lowest memory address. (Used natively by x86 Intel/AMD processors).
        - Mem[0]: `78`, Mem[1]: `56`, Mem[2]: `34`, Mem[3]: `12`
    - Understanding endianness is critical when parsing network packets or reading cross-platform binary files.

  - ## 4. Code Implementation: Base Converters
    collapsed:: true
    - :::code-tabs
      
      ```python
      def decimal_to_binary(n):
          """Converts a positive integer to binary string using pure math."""
          if n == 0: return "0"
          bits = []
          while n > 0:
              bits.append(str(n % 2))
              n = n // 2
          return "".join(reversed(bits))

      def detect_endianness():
          """Detects system endianness in Python."""
          import sys
          return sys.byteorder

      print(f"25 in Binary: {decimal_to_binary(25)}")
      print(f"System Endianness: {detect_endianness()}")
      ```
      
      ```c++
      #include <iostream>
      #include <string>
      #include <algorithm>

      // Manual Decimal to Binary Converter
      std::string decimalToBinary(int n) {
          if (n == 0) return "0";
          std::string result = "";
          while (n > 0) {
              result += (n % 2 == 0 ? "0" : "1");
              n /= 2;
          }
          std::reverse(result.begin(), result.end());
          return result;
      }

      // Hack to detect endianness using a union
      bool isLittleEndian() {
          union {
              uint32_t i;
              char c[4];
          } bint = {0x01020304};
          return bint.c[0] == 4; 
      }

      int main() {
          std::cout << "25 in Binary: " << decimalToBinary(25) << "\n";
          std::cout << "Is Little Endian? " << (isLittleEndian() ? "Yes" : "No") << "\n";
          return 0;
      }
      ```
      :::

- # Chapter 2: Hardware Level - ALUs and Logic Gates
  - How do physical transistors actually do math? The CPU's Arithmetic Logic Unit (ALU) utilizes Logic Gates built from transistors.

  - ## 1. Logic Gates Overview
    - **AND Gate**: Outputs `1` only if both inputs A and B are `1`. (Series circuit).
    - **OR Gate**: Outputs `1` if either input A or B is `1`. (Parallel circuit).
    - **XOR Gate (Exclusive OR)**: Outputs `1` if inputs A and B are different. Critical for binary addition without carry.
    - **NOT Gate (Inverter)**: Outputs `1` if input is `0`, and vice versa.

  - ## 2. Binary Addition Hardware (Half & Full Adders)
    - **The Half Adder**:
      - Adds two single bits (A and B).
      - Sum = $A \oplus B$ (A XOR B).
      - Carry = $A \cdot B$ (A AND B).
      - Limitation: It cannot accept a "Carry-In" from a previous operation, so it can only add the very first column of a binary sequence.
    - **The Full Adder**:
      - Takes three inputs: A, B, and a Carry-In ($C_{in}$).
      - Sum = $(A \oplus B) \oplus C_{in}$
      - Carry-Out = $(A \cdot B) + (C_{in} \cdot (A \oplus B))$
      - By chaining 32 full adders together (a **Ripple Carry Adder**), a CPU can add two 32-bit integers.

  - ## 3. Code Implementation: Simulating an ALU
    collapsed:: true
    - :::code-tabs
      
      ```python
      # Simulating hardware adders purely with logic gates

      def half_adder(a, b):
          """Returns (Sum, Carry)"""
          sum_bit = a ^ b      # XOR
          carry_bit = a & b    # AND
          return sum_bit, carry_bit

      def full_adder(a, b, carry_in):
          """Returns (Sum, Carry_Out)"""
          sum1, carry1 = half_adder(a, b)
          final_sum, carry2 = half_adder(sum1, carry_in)
          final_carry = carry1 | carry2 # OR
          return final_sum, final_carry

      def ripple_carry_adder(bin_a, bin_b):
          """Adds two 8-bit binary strings using 8 chained full adders."""
          bin_a = bin_a.zfill(8)
          bin_b = bin_b.zfill(8)
          
          carry = 0
          result = []
          
          # Iterate from least significant bit (right) to most (left)
          for i in range(7, -1, -1):
              bit_a = int(bin_a[i])
              bit_b = int(bin_b[i])
              
              sum_bit, carry = full_adder(bit_a, bit_b, carry)
              result.append(str(sum_bit))
              
          if carry:
              result.append(str(carry)) # Overflow
              
          return "".join(reversed(result))

      # Example: 13 (00001101) + 10 (00001010) = 23 (00010111)
      print(f"13 + 10 via Ripple Carry: {ripple_carry_adder('1101', '1010')}")
      ```
      :::

- # Chapter 3: Number Representation Deep Dive
  - Computers must define strict rules to represent negative integers and floating-point fractions within a fixed chunk of memory (e.g., 32 bits).

  - ## 1. Signed Integers and Two's Complement
    - Unsigned integers use all bits for magnitude (e.g., an 8-bit uint represents $0$ to $255$). Signed integers must represent negatives.
    - **Sign-Magnitude (The old way)**: Use the leftmost bit as a sign (0=Positive, 1=Negative).
      - Flaw: Has two representations of zero (`00000000` = +0, `10000000` = -0), wasting logic.
      - Flaw: Hardware adders must implement entirely different logic for subtraction.
    - **Two's Complement (The modern standard)**:
      - To make a number negative: Invert all bits (One's Complement), then add 1.
      - Proof with 8 bits (`5` and `-5`):
        - `5` = `00000101`
        - Invert: `11111010`
        - Add 1: `11111011` = `-5`
      - **The Magic of Two's Complement**: When the hardware ALU adds `5` + `-5` (`00000101` + `11111011`), it performs standard binary addition. The result is `1 00000000`. The 9th bit (the `1`) overflows past the 8-bit limit and is discarded by the CPU, leaving exactly `00000000`. The CPU doesn't even need to know it is doing subtraction!

  - ## 2. IEEE 754 Floating-Point Representation
    - The IEEE 754 standard is how computers represent real numbers (fractions) like `3.14159`. A standard 32-bit `float` is chopped into three components:
      1. **Sign bit** (1 bit): Bit 31. `0` for positive, `1` for negative.
      2. **Exponent** (8 bits): Bits 23-30. Determines the multiplier ($2^E$). It uses a "bias" of 127. So an exponent of `0` is stored as `127` (`01111111`).
      3. **Mantissa / Fraction** (23 bits): Bits 0-22. The significant digits of the number. The leading `1` is always assumed and never stored (called the "hidden bit"), providing effectively 24 bits of precision.
    - **Formula**: $Value = (-1)^{Sign} \times (1.Mantissa) \times 2^{Exponent - 127}$
    - **Special Values in IEEE 754**:
      - *Zero*: Exponent all 0s, Mantissa all 0s.
      - *Infinity*: Exponent all 1s, Mantissa all 0s.
      - *NaN (Not a Number)*: Exponent all 1s, Mantissa non-zero. (e.g., $0/0$ or $\sqrt{-1}$).
      - *Subnormal Numbers*: Exponent all 0s, Mantissa non-zero. Used to represent extremely tiny numbers close to zero without suddenly underflowing to absolute zero.

  - ## 3. Fixed-Point Arithmetic (Game Engine Optimization)
    - Floating-point math is technically *non-deterministic* across different CPU architectures. A calculation like `0.1 + 0.2` might result in `0.30000000000000004` on one machine and slightly differently on an older one.
    - In multiplayer simulation games (like Age of Empires or fighting games), deterministic math is critical to prevent desynchronization between players.
    - **Fixed-Point** solves this by using integers. A standard 32-bit integer is split (e.g., Q16.16 format): 16 bits for the whole number, 16 bits for the fraction.
    - `Value = Integer / 65536.0`. 
    - Math is performed using standard integer ALU operations, which are 100% deterministic on every CPU on earth.

  - ## 4. Code Implementation: IEEE 754 Inspector
    collapsed:: true
    - :::code-tabs
      
      ```c++
      #include <iostream>
      #include <bitset>
      #include <cstring>

      void printIEEE754(float number) {
          // Reinterpret the float bits as an unsigned 32-bit integer
          uint32_t bits;
          std::memcpy(&bits, &number, sizeof(float));

          // Extract components using bit masks and shifts
          uint32_t sign = (bits >> 31) & 1;
          uint32_t exponent = (bits >> 23) & 0xFF;
          uint32_t mantissa = bits & 0x7FFFFF;

          std::cout << "Float: " << number << "\n";
          std::cout << "Raw Binary: " << std::bitset<32>(bits) << "\n";
          std::cout << "Sign: " << sign << "\n";
          std::cout << "Exponent (Biased): " << exponent 
                    << " (Actual: " << (int)exponent - 127 << ")\n";
          std::cout << "Mantissa: " << std::bitset<23>(mantissa) << "\n\n";
      }

      int main() {
          printIEEE754(-3.14f);
          printIEEE754(0.0f);
          return 0;
      }
      ```
      :::

- # Chapter 4: Advanced Bitwise Operations & Hacks
  - To write $O(1)$ optimal code in C++ or Python, developers rely on "Bit Twiddling Hacks." These hacks replace heavy math operations (modulo, multiplication) with single-cycle CPU instructions.

  - ## 1. Swapping Variables without Temp
    - Using XOR (`^`), you can swap two integers entirely in place without allocating a third `temp` variable.
    - $A = A \oplus B$, then $B = A \oplus B$ (which equals the original $A$), then $A = A \oplus B$ (which equals the original $B$).
    - `a ^= b; b ^= a; a ^= b;`

  - ## 2. Is Even or Odd?
    - The lowest bit of a binary number determines if it is odd (`1`) or even (`0`). Checking the last bit is much faster than computing modulo `% 2` on some older architectures.
    - `bool isOdd = (n & 1) == 1;`

  - ## 3. Is Power of 2?
    - Powers of 2 (`2, 4, 8, 16`) have exactly one `1` bit in binary (`0010, 0100, 1000, 00010000`).
    - Subtracting 1 from a power of 2 flips all bits from the lowest `1` downwards (e.g., $16 - 1 = 15 \implies 10000 \to 01111$).
    - Therefore, `n & (n - 1)` will perfectly clear the only set bit, resulting in `0`.
    - `bool isPower2 = (n > 0) && (n & (n - 1)) == 0;`

  - ## 4. Brian Kernighan’s Popcount Algorithm
    - "Popcount" means counting the number of set bits (`1`s) in an integer.
    - Instead of looping 32 times to check every bit, Kernighan's algorithm drops the lowest set bit repeatedly using `n = n & (n - 1)`.
    - It only loops exactly $K$ times, where $K$ is the number of `1`s.
    - Note: Modern CPUs have hardware instructions for this (e.g., `__builtin_popcount` in GCC uses the `POPCNT` assembly instruction, which takes 1 cycle).

  - ## 5. Isolating the Rightmost 1-Bit
    - Using Two's Complement math, `-n` is exactly `~n + 1`. This mathematical transformation flips everything *above* the rightmost `1` bit, but keeps the rightmost `1` bit intact.
    - `int lowestBit = n & (-n);`

- # Chapter 5: Binary in Data Structures
  - Binary math is not just for numbers; it is heavily used to optimize Data Structures in competitive programming and large-scale systems.

  - ## 1. Bitmasks (Subset Generation)
    - If you have a set of $N$ items (e.g., `A, B, C`), you can represent every possible subset using an integer from $0$ to $2^N - 1$.
    - `011` (Decimal 3) means Item 0 is true, Item 1 is true, Item 2 is false. Subset = `{A, B}`.
    - Using a `for` loop from `0` to `(1 << N) - 1`, you can instantly generate and iterate over all $2^N$ combinations.
    
  - ## 2. Fenwick Tree (Binary Indexed Tree)
    - The Fenwick Tree computes prefix sums in $O(\log N)$ time.
    - It navigates its internal array by constantly adding or subtracting the *isolated rightmost bit*.
    - To move to the next node to update: `index += index & (-index)`
    - To move to the parent node to query: `index -= index & (-index)`

  - ## 3. Bloom Filters
    - A Bloom Filter is a highly space-efficient probabilistic data structure. Instead of storing massive string keys, it hashes the string $K$ times and sets $K$ specific bits to `1` in a massive binary array.
    - To check if a key exists, it hashes the key again and checks if all $K$ bits are `1`. If even one bit is `0`, the key *definitely* does not exist. (If all are `1`, it *probably* exists). Used by databases (Cassandra) to avoid expensive disk lookups.

- # Chapter 6: Binary in Computer Graphics (Advanced)
  - 3D rendering engines (Unreal, Unity) manipulate binary intensely to maintain 60-144 FPS rendering speeds.

  - ## 1. Advanced Color Packing
    - To save GPU VRAM, engines pack colors into standard integer formats.
    - **RGBA8888**: 32 bits total. 8 bits per channel. Over 16 million colors.
    - **RGB565**: 16 bits total. 5 bits for Red, 6 bits for Green (human eyes are most sensitive to green), 5 bits for Blue. This halves memory usage for mobile game textures.
    - **Alpha Blending Math**: To blend a foreground pixel and a background pixel based on an alpha value $\alpha$ (0 to 255):
      - $Output = \frac{(Foreground \times \alpha) + (Background \times (255 - \alpha))}{255}$
      - Division by 255 is slow. Graphics programmers approximate division by 255 using a right shift by 8 (`>> 8`, which divides by 256), a massive $O(1)$ shortcut.

  - ## 2. Morton Codes (Z-Order Curve)
    - Memory is 1-Dimensional (a long list of addresses). A 2D texture is stored sequentially row-by-row. If the GPU renders a vertical line, it jumps across huge gaps in memory address space, causing cache misses and tanking performance.
    - **Morton Codes** solve this by interleaving the bits of the $X$ and $Y$ coordinates.
    - If $X = 3$ (`011`) and $Y = 5$ (`101`):
      - Interleaved: `100111` (Decimal 39).
    - This maps the 2D grid into a fractal "Z" shape in 1D memory. Pixels that are physically close to each other in 2D space are now guaranteed to be close to each other in 1D RAM, ensuring near 100% cache hit rates.

  - ## 3. Bitboards in Game AI
    - Chess engines (like Stockfish) do not use 2D arrays (e.g., `Board[8][8]`) to represent the game.
    - A chessboard has exactly 64 squares. A 64-bit integer (`uint64_t`) has exactly 64 bits.
    - The engine uses one `uint64_t` where bit `1` means a white pawn is present, and `0` means empty.
    - To move all pawns forward 1 step, the engine simply applies a bitwise shift: `Pawns = Pawns << 8`. An operation that would take 64 loop iterations in an array takes **1 CPU cycle** using bitboards!

- # Chapter 7: Binary in Cybersecurity & Cryptography
  - Security protocols rely entirely on manipulating binary bits to scramble data irreversibly without the correct key.

  - ## 1. The XOR Cipher & One-Time Pad
    - The absolute foundation of modern symmetric encryption is the XOR operator ($\oplus$).
    - Properties of XOR:
      - $A \oplus 0 = A$
      - $A \oplus A = 0$
      - $(A \oplus B) \oplus B = A$
    - If you have a secret message ($P$) and a completely random key ($K$), the ciphertext is $C = P \oplus K$.
    - The receiver calculates $C \oplus K$, which equals $(P \oplus K) \oplus K = P$.
    - If the key is as long as the message and truly random, this is called a **One-Time Pad**, which mathematician Claude Shannon proved is theoretically unbreakable.

  - ## 2. Finite Fields in AES Encryption
    - The Advanced Encryption Standard (AES) does not just XOR bits. It shifts and mixes them using "Galois Field" ($GF(2^8)$) arithmetic.
    - Bytes are treated as polynomials. For example, `1011` is treated as $x^3 + x + 1$.
    - By multiplying these polynomials modulo an irreducible polynomial (like a prime number for bits), AES scrambles data so thoroughly that discovering the pattern without the key would take billions of years.

  - ## 3. Bit-Flipping Attacks
    - In older cryptographic modes like AES-CBC (Cipher Block Chaining), the ciphertext of the previous block is XORed directly into the plaintext of the next block.
    - If an attacker intercepts the network packet and *flips* a specific bit in the ciphertext, that bit-flip carries directly into the decrypted plaintext.
    - Example:
      - Intercepted Plaintext (Guessed): `{"role":"user"}`
      - Attacker flips bits corresponding to the letters `user` to instead become `root`.
      - When the server decrypts the packet, the application reads `{"role":"root"}` and grants the hacker admin access, all without the hacker ever breaking the encryption key.

  - ## 4. Subnet Masking (Networking)
    - Networks divide the internet using IP Addresses and Subnet Masks.
    - IP Address: `192.168.1.50` (`11000000.10101000.00000001.00110010`)
    - Subnet Mask (`/24`): `255.255.255.0` (`11111111.11111111.11111111.00000000`)
    - The Router applies a Bitwise AND (`&`) to extract the Network ID: `192.168.1.0`. Any traffic destined outside this Network ID is pushed to the wider internet.

  - ## 5. File Signatures (Magic Numbers)
    - How does an antivirus know a file is a virus if the hacker renamed `virus.exe` to `cute_cat.jpg`?
    - The OS ignores the file extension. Instead, it reads the first 2 to 4 bytes of the raw binary file, known as the "Magic Number".
    - Windows Executables (PE): Start with `0x4D 0x5A` (ASCII `MZ`).
    - Linux Executables (ELF): Start with `0x7F 0x45 0x4C 0x46` (ASCII `\x7FELF`).
    - JPEGs: Start with `0xFF 0xD8 0xFF`.
    - If the Magic Number does not match the file extension, security systems flag it instantly.

- # Chapter 8: Data Compression & Encoding
  - Hard drives and network bandwidth are finite. Binary encoding compresses text and media to minimize storage space.

  - ## 1. Base64 Encoding
    - When transmitting binary data (like images) over text-only protocols (like JSON/Email), raw binary bytes (`00000000` to `11111111`) contain non-printable characters that crash the text parser.
    - Base64 fixes this by taking exactly 3 binary bytes (24 bits total).
    - It splits those 24 bits into four chunks of 6 bits.
    - A 6-bit chunk has values from $0$ to $63$. These 64 values are mapped to safe, printable characters (`A-Z`, `a-z`, `0-9`, `+`, `/`).
    - This allows images to be safely embedded into HTML, expanding file size by exactly 33%.

  - ## 2. UTF-8 Unicode Encoding
    - Standard ASCII uses 7 bits (0-127) for English characters. How do we support Chinese, Arabic, and Emojis?
    - UTF-8 uses variable-length binary encoding:
      - Standard English (like 'A'): 1 Byte (`0xxxxxxx`)
      - European chars: 2 Bytes (`110xxxxx 10xxxxxx`)
      - Asian chars: 3 Bytes (`1110xxxx 10xxxxxx 10xxxxxx`)
      - Emojis (like 🚀): 4 Bytes (`11110xxx 10xxxxxx 10xxxxxx 10xxxxxx`)
    - The leading `1`s dictate exactly how many bytes belong to the character, preventing the parser from reading garbage.

  - ## 3. Huffman Coding
    - Standard text assigns exactly 8 bits to every character. E.g., 'E' takes 8 bits, 'Z' takes 8 bits.
    - But 'E' is used 100x more often than 'Z' in English!
    - Huffman Coding analyzes the text and builds a prefix-free binary tree.
    - It assigns a very short binary sequence (like `10`) to 'E', and a very long sequence (like `1111010`) to 'Z'.
    - This mathematical optimization forms the basis of `.zip`, `.mp3`, and `.jpeg` compression.

- # Key Takeaways
  collapsed:: true
  - The entire foundation of computing rests on the ALU performing primitive bitwise operations on Two's Complement and IEEE 754 formatted binary blocks.
  - Advanced bit twiddling removes loops and conditionals, resulting in $O(1)$ calculations crucial for games and competitive programming.
  - Everything from 3D graphics (Morton codes, bitmasks) to internet security (XOR encryption, Bit-flipping) boils down to organizing and shifting `1`s and `0`s mathematically.

- # More Learn
  collapsed:: true
  - ## GitHub & Webs
    - [Wikipedia -> Binary number](https://en.wikipedia.org/wiki/Binary_number)
    - [Wikipedia -> Two's complement](https://en.wikipedia.org/wiki/Two%27s_complement)
    - [Wikipedia -> Floating-point arithmetic](https://en.wikipedia.org/wiki/Floating-point_arithmetic)
    - [Stanford -> Bit Twiddling Hacks](https://graphics.stanford.edu/~seander/bithacks.html)
