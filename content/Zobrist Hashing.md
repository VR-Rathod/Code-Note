---
seoTitle: Zobrist Hashing Complete Guide – Incremental State Hashing for Board Game AI
description: "A comprehensive guide on Zobrist Hashing. Learn how bitwise XOR of pre-generated random numbers enables O(1) incremental state updates in chess engines."
keywords: "zobrist hashing, transposition table, incremental hash, chess engine, board game AI, XOR hashing, game state tracking, C++, Python, VR-Rathod, Code-Note, code note vr, vr book"
---

> [!info] What is Zobrist Hashing?
> **Zobrist Hashing** is a technique used in computer game playing programs (like Chess, Checkers, or Go) to hash a board state into a single integer.
> - **Incremental Updates**: Instead of hashing the entire board from scratch after each move ($O(N)$), it updates the hash in **$O(1)$ time** using a bitwise **XOR** operation.
> - **Transposition Tables**: It serves as the primary hashing mechanism to cache evaluated positions in search algorithms.

- # Explanation
  - During game tree search (e.g. Minimax with Alpha-Beta pruning), the engine frequently encounters the same board state via different sequences of moves (known as transpositions). To avoid duplicate work, the engine caches evaluations in a **Transposition Table** (a large hash map). Zobrist Hashing makes this transposition lookup extremely fast because the hash values can be maintained incrementally.
  -
  - ## Real-World Analogy
    - **Toggle Switches**: Imagine a board with 64 light bulbs, each with a toggle switch. Instead of inspecting all 64 bulbs to record the current pattern, you start with a master counter. Every time a bulb is toggled on or off, you XOR its unique identifier to your master counter. Since flipping a switch twice returns it to its original state, XORing the identifier twice automatically removes its contribution.
-
- # How It Works
  collapsed:: true
  - ## Core Mechanics
    - Let's illustrate Zobrist Hashing using a **Tic-Tac-Toe** board (3x3 grid, 9 squares):
    -
    - ### 1. Pre-generated Random Table
      - Before the game starts, we initialize a 2D array of random 64-bit integers:
        `ZobristTable[BoardSize][PieceTypes]`
        - For Tic-Tac-Toe: `ZobristTable[9][2]` (9 board slots, 2 piece types: `Player X` and `Player O`).
    -
    - ### 2. The XOR Property
      - Bitwise XOR ($\oplus$) has two crucial properties:
        - $A \oplus B \oplus B = A$ (A value XORed twice cancels itself out).
        - $A \oplus 0 = A$.
    -
    - ### 3. Incremental Update Logic
      - Start with an empty board hash: `board_hash = 0`.
      - **Place Piece**: When player `X` plays on square `4`:
        `board_hash = board_hash ^ ZobristTable[4][PieceX]`
      - **Undo Move / Remove Piece**: If we backtrack the move at square `4`:
        `board_hash = board_hash ^ ZobristTable[4][PieceX]`
        *(This automatically restores the previous hash value without reading any other squares!)*
  -
  - ## Visual Walkthrough
    - ### Hashing a Tic-Tac-Toe Game
      - 1. Empty board: `Hash = 0x0000000000000000`.
      - 2. Player `X` places on cell `0` (where `ZobristTable[0][X] = 0x1A2B3C4D...`):
        `Hash = Hash ^ ZobristTable[0][X]` $\implies$ `0x1A2B3C4D...`
      - 3. Player `O` places on cell `4` (where `ZobristTable[4][O] = 0x9F8E7D6C...`):
        `Hash = Hash ^ ZobristTable[4][O]` $\implies$ `0x85A54121...`
      - 4. Undo Player `O`'s move on cell `4`:
        `Hash = Hash ^ ZobristTable[4][O]` $\implies$ `0x1A2B3C4D...` (restored step 2 hash in $O(1)$ time).
-
- # Time & Space Complexity
  collapsed:: true
  - | Operation | Hashing from Scratch | Zobrist Hashing (Incremental) |
    |---|---|---|
    | **Compute initial hash** | $O(\text{BoardSize})$ | $O(\text{BoardSize})$ |
    | **Update hash (on move)** | $O(\text{BoardSize})$ | $O(1)$ |
    | **Undo hash (on backtrack)** | $O(\text{BoardSize})$ | $O(1)$ |
    | **Space Complexity** | $O(1)$ auxiliary | $O(\text{BoardSize} \times \text{PieceTypes})$ |
-
- # Implementation
  collapsed:: true
  - :::code-tabs
    
    ```python
    import random

    class ZobristTicTacToe:
        # Constants for pieces
        EMPTY = 0
        PIECE_X = 1
        PIECE_O = 2

        def __init__(self):
            # Board: 9 cells (3x3)
            self.board = [self.EMPTY] * 9
            self.current_hash = 0
            
            # Pre-generate 64-bit random values: table[cell_index][piece_type]
            # piece_type index: 0 for X, 1 for O
            self.zobrist_table = [
                [random.getrandbits(64) for _ in range(2)] 
                for _ in range(9)
            ]

        def get_hash(self):
            return self.current_hash

        def make_move(self, cell, piece):
            """Plays a move at cell, updating the hash in O(1) time."""
            if self.board[cell] != self.EMPTY:
                raise ValueError("Cell is already occupied")

            self.board[cell] = piece
            piece_idx = 0 if piece == self.PIECE_X else 1
            
            # XOR the new piece state into the hash
            self.current_hash ^= self.zobrist_table[cell][piece_idx]

        def undo_move(self, cell, piece):
            """Reverts a move at cell, updating the hash in O(1) time."""
            if self.board[cell] != piece:
                raise ValueError("No matching piece to undo at this cell")

            self.board[cell] = self.EMPTY
            piece_idx = 0 if piece == self.PIECE_X else 1
            
            # XORing the same value again cancels it out, restoring the prior hash
            self.current_hash ^= self.zobrist_table[cell][piece_idx]

    # Example Usage
    if __name__ == "__main__":
        game = ZobristTicTacToe()
        print(f"Empty Board Hash: {game.get_hash():016X}")
        
        # X plays cell 4 (center)
        game.make_move(4, ZobristTicTacToe.PIECE_X)
        hash_after_x = game.get_hash()
        print(f"Hash after X on 4: {hash_after_x:016X}")
        
        # O plays cell 0 (top-left)
        game.make_move(0, ZobristTicTacToe.PIECE_O)
        print(f"Hash after O on 0: {game.get_hash():016X}")
        
        # Undo O plays cell 0
        game.undo_move(0, ZobristTicTacToe.PIECE_O)
        print(f"Hash after undo O: {game.get_hash():016X} (Matches hash_after_x? {game.get_hash() == hash_after_x})")
    ```

    ```c++
    #include <iostream>
    #include <vector>
    #include <random>
    #include <iomanip>
    #include <stdexcept>

    class ZobristTicTacToe {
    public:
        static const int EMPTY = 0;
        static const int PIECE_X = 1;
        static const int PIECE_O = 2;

    private:
        std::vector<int> board;
        unsigned long long currentHash;
        // Table size: 9 cells, 2 pieces
        unsigned long long zobristTable[9][2];

    public:
        ZobristTicTacToe() : board(9, EMPTY), currentHash(0) {
            // Seed random engine
            std::mt19937_64 rng(1337); // Fixed seed for reproducibility
            std::uniform_int_distribution<unsigned long long> dist;

            // Populate table with random 64-bit integers
            for (int i = 0; i < 9; ++i) {
                zobristTable[i][0] = dist(rng); // Value for X
                zobristTable[i][1] = dist(rng); // Value for O
            }
        }

        unsigned long long getHash() const {
            return currentHash;
        }

        void makeMove(int cell, int piece) {
            if (board[cell] != EMPTY) {
                throw std::runtime_error("Cell is already occupied");
            }
            board[cell] = piece;
            int pieceIdx = (piece == PIECE_X) ? 0 : 1;
            
            // XOR piece state in O(1)
            currentHash ^= zobristTable[cell][pieceIdx];
        }

        void undoMove(int cell, int piece) {
            if (board[cell] != piece) {
                throw std::runtime_error("No matching piece to undo at this cell");
            }
            board[cell] = EMPTY;
            int pieceIdx = (piece == PIECE_X) ? 0 : 1;

            // XOR again to cancel out
            currentHash ^= zobristTable[cell][pieceIdx];
        }
    };

    int main() {
        ZobristTicTacToe game;
        std::cout << std::hex << std::uppercase << std::setfill('0');
        std::cout << "Empty Board Hash: " << std::setw(16) << game.getHash() << "\n";

        game.makeMove(4, ZobristTicTacToe::PIECE_X);
        unsigned long long hashAfterX = game.getHash();
        std::cout << "Hash after X on 4: " << std::setw(16) << hashAfterX << "\n";

        game.makeMove(0, ZobristTicTacToe::PIECE_O);
        std::cout << "Hash after O on 0: " << std::setw(16) << game.getHash() << "\n";

        game.undoMove(0, ZobristTicTacToe::PIECE_O);
        std::cout << "Hash after undo O: " << std::setw(16) << game.getHash() 
                  << " (Matches? " << (game.getHash() == hashAfterX ? "Yes" : "No") << ")\n";

        return 0;
    }
    ```

    :::
-
- # When to Use
  collapsed:: true
  - ## ✅ Use Zobrist Hashing When:
    - You are implementing game engines for two-player board games (Chess, Othello, Go, Checkers) using search algorithms like Alpha-Beta pruning, MCTS, or Principal Variation Search.
    - You need to cache state evaluations in a Transposition Table or check for draw rules like "Threefold Repetition" in Chess.
  - ## ❌ Do NOT Use Zobrist Hashing When:
    - You are hashing static files, payloads, or security credentials (it is not a cryptographically secure hash function).
    - The state spaces do not involve incremental changes (e.g. hashing completely independent pieces of text).
-
- # Variations & Related Concepts
  collapsed:: true
  - **Incremental Castling & En Passant Hashing**: In Chess, auxiliary state features (castling rights, side to move, en passant square) are assigned their own random Zobrist bitstrings and are XORed in/out of the hash when these states change.
  - **Zobrist Keys Collision Risk**: Since 64-bit integers are used, the risk of two different board states yielding the same hash (a collision or "hash clash") is extremely low (approx. 1 in $1.8 \times 10^{19}$), making it negligible in practice.
-
- # Key Takeaways
  collapsed:: true
  - Zobrist Hashing utilizes pre-generated random 64-bit matrices mapping cell-piece positions.
  - Updates and undo operations run in $O(1)$ time by leveraging bitwise XOR properties.
  - XORing the same piece placement twice removes it, restoring the previous hash.
  - Transposition tables in Game AI depend heavily on Zobrist keys to check duplicate paths.
-
- # More Learn
  collapsed:: true
  - ## GitHub & Webs
    - [Wikipedia -> Zobrist hashing](https://en.wikipedia.org/wiki/Zobrist_hashing)