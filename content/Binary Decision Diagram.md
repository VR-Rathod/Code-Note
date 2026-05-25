---
seoTitle: Binary Decision Diagram (BDD) Complete Guide – Shannon Expansion and ROBDD Algorithms
description: "A comprehensive guide on Binary Decision Diagrams. Learn Shannon expansion, Variable Ordering, BDD reduction rules, and Python/C++ implementations."
keywords: "binary decision diagram, BDD, ROBDD, shannon expansion, variable ordering, Boolean logic, logic synthesis, formal verification, C++, Python, VR-Rathod, Code-Note, code note vr, vr book"
---

> [!info] What is a Binary Decision Diagram?
> A **Binary Decision Diagram (BDD)** is a directed acyclic graph (DAG) representation of a Boolean function.
> - **Ordered BDD (OBDD)**: Variables appear in the same order along all paths from the root to the leaf terminal nodes.
> - **Reduced Ordered BDD (ROBDD)**: An OBDD that has been simplified using reduction rules, making it a canonical (unique) representation of the Boolean function for a fixed variable ordering.

- # Explanation
  - Truth tables grow exponentially ($2^N$), and algebraic equations are hard to compare for equivalence. BDDs represent Boolean functions compactly and offer canonical representation. If two Boolean functions are logically equivalent, their ROBDD graphs are identical. This makes them highly useful in formal verification, logic synthesis, and VLSI circuit design.
  -
  - ## Real-World Analogy
    - **Logic Gates & Decision Trees**: Imagine a customer support automated phone system. Instead of asking you 100 unrelated questions, the system asks questions in a fixed sequence based on your choices. Duplicate branches (e.g., if choosing option A or B leads to the exact same department) are merged into one. Redundant questions (where choosing A or B leads to the same follow-up step) are skipped entirely.
-
- # How It Works
  collapsed:: true
  - ## Core Mechanics
    - A BDD is based on the **Shannon Expansion (or decomposition)** of a Boolean function $f$:
      $$f = (\neg x \wedge f_{x=0}) \vee (x \wedge f_{x=1})$$
      where:
      - $x$ is the decision variable.
      - $f_{x=0}$ is the negative cofactor (low branch, representing $x = \text{False}$).
      - $f_{x=1}$ is the positive cofactor (high branch, representing $x = \text{True}$).
    -
    - ### 1. Terminal Nodes
      - The leaf nodes represent the final outcomes of the Boolean function: `0` (False) and `1` (True).
    -
    - ### 2. BDD Reduction Rules
      - An OBDD is reduced to an ROBDD by recursively applying two rules:
        - **Merge Duplicate Terminals**: Ensure only one terminal node `0` and one terminal node `1` exist.
        - **Merge Isomorphic Nodes (Node Sharing)**: If two nodes $N_1$ and $N_2$ branch on the same variable, and have identical left and right child pointers, merge them into a single node.
        - **Eliminate Redundant Nodes**: If a node's left child and right child point to the same node (meaning the decision on variable $x$ does not affect the output), remove the node and link its parent directly to the child.
    -
    - ### 3. Unique Table & Canonical Checks
      - An ROBDD manager maintains a **Unique Table** (hash map) to cache and retrieve nodes using the key: `(variable_id, low_pointer, high_pointer)`. Before creating a node, we check the unique table. If the node exists, we return it; if the `low` and `high` pointers are equal, we skip creating it entirely.
  -
  - ## Visual Walkthrough
    - ### ROBDD for Boolean Function: $f = x_1 \wedge x_2$
      - ```
               x1 (Root)
              /  \ (dashed = False/low, solid = True/high)
             /    \
            0      x2
                  /  \
                 0    1
        ```
      - **Trace assignments**:
        - $x_1 = \text{False}, x_2 = \text{True}$: Starting at `x1`, take the dashed branch to `0`. Output is `0` (False).
        - $x_1 = \text{True}, x_2 = \text{True}$: Starting at `x1`, take the solid branch to `x2`. At `x2`, take the solid branch to `1`. Output is `1` (True).
-
- # Time & Space Complexity
  collapsed:: true
  - | Operation | Time Complexity | Space Complexity |
    |---|---|---|
    | **Evaluation (SAT check)** | $O(N)$ | $O(1)$ |
    | **Equivalence Check $(f \equiv g)$** | $O(1)$ (Pointer comparison) | $O(1)$ |
    | **Synthesis (Apply algorithm)** | $O(\|f\| \cdot \|g\|)$ | $O(\|f\| \cdot \|g\|)$ |
    | **Worst-case Size (Nodes)** | $O(2^N)$ | $O(2^N)$ |
    - *Note: $N$ is the number of variables, and $\|f\|$ represents the number of nodes in the BDD graph $f$. ROBDD size is highly sensitive to the variable ordering selected.*
-
- # Implementation
  collapsed:: true
  - :::code-tabs
    
    ```python
    class BDDNode:
        def __init__(self, var_id, low=None, high=None, val=None):
            self.var_id = var_id  # Variable index (e.g. 0 for x0, 1 for x1). Terminal nodes use float('inf') or -1
            self.low = low        # Pointer for False/low branch
            self.high = high      # Pointer for True/high branch
            self.val = val        # Value for terminal nodes (True/False/None)

        def is_terminal(self):
            return self.val is not None


    class ROBDDManager:
        def __init__(self):
            # Canonical terminals
            self.terminal_false = BDDNode(var_id=float('inf'), val=False)
            self.terminal_true = BDDNode(var_id=float('inf'), val=True)
            
            # Unique table: (var_id, low, high) -> BDDNode
            self.unique_table = {}

        def get_node(self, var_id, low, high):
            """Retrieves or creates a reduced canonical BDD node."""
            # Elimination rule: if branches lead to same node, redundant
            if low is high:
                return low

            # Check unique table for node sharing
            key = (var_id, low, high)
            if key in self.unique_table:
                return self.unique_table[key]

            # Create and cache new node
            node = BDDNode(var_id, low, high)
            self.unique_table[key] = node
            return node

        def evaluate(self, node, assignments):
            """Evaluates the BDD node given a dictionary of boolean assignments."""
            if node.is_terminal():
                return node.val
            
            # Determine path based on variable assignment
            var_val = assignments[node.var_id]
            if var_val:
                return self.evaluate(node.high, assignments)
            return self.evaluate(node.low, assignments)


    # Example Usage
    if __name__ == "__main__":
        manager = ROBDDManager()
        
        # Build ROBDD representing "x0 AND x1"
        # Variables: x0 (id=0), x1 (id=1)
        # We build bottom-up (x1 level first)
        
        # At x1 level:
        # If x0 is True, we check x1. If x1 is True -> True, else -> False
        x1_node = manager.get_node(1, manager.terminal_false, manager.terminal_true)
        
        # At x0 level:
        # If x0 is True, check x1_node. If x0 is False -> False
        root = manager.get_node(0, manager.terminal_false, x1_node)
        
        # Evaluate assignments
        print("x0=True, x1=True: ", manager.evaluate(root, {0: True, 1: True}))     # True
        print("x0=True, x1=False:", manager.evaluate(root, {0: True, 1: False}))    # False
        print("x0=False, x1=True:", manager.evaluate(root, {0: False, 1: True}))    # False
    ```

    ```cpp
    #include <iostream>
    #include <unordered_map>
    #include <tuple>
    #include <memory>
    #include <limits>

    struct BDDNode {
        int varId;
        BDDNode* low;
        BDDNode* high;
        int val; // -1 for internal node, 0 for False, 1 for True

        BDDNode(int var, BDDNode* l, BDDNode* h) 
            : varId(var), low(l), high(h), val(-1) {}

        BDDNode(int v) 
            : varId(std::numeric_limits<int>::max()), low(nullptr), right(nullptr), val(v) {}

        bool isTerminal() const { return val != -1; }
    };

    // Hash function wrapper to allow tuples as keys in unordered_map
    struct HashTuple {
        size_t operator()(const std::tuple<int, BDDNode*, BDDNode*>& key) const {
            return std::get<0>(key) ^ 
                   (reinterpret_cast<size_t>(std::get<1>(key)) << 1) ^ 
                   (reinterpret_cast<size_t>(std::get<2>(key)) << 2);
        }
    };

    class ROBDDManager {
    private:
        std::unordered_map<std::tuple<int, BDDNode*, BDDNode*>, BDDNode*, HashTuple> uniqueTable;

    public:
        BDDNode* terminalFalse;
        BDDNode* terminalTrue;

        ROBDDManager() {
            terminalFalse = new BDDNode(0);
            terminalTrue = new BDDNode(1);
        }

        ~ROBDDManager() {
            for (auto pair : uniqueTable) {
                delete pair.second;
            }
            delete terminalFalse;
            delete terminalTrue;
        }

        BDDNode* getNode(int varId, BDDNode* low, BDDNode* high) {
            // Elimination Rule
            if (low == high) {
                return low;
            }

            // Node Sharing check
            auto key = std::make_tuple(varId, low, high);
            if (uniqueTable.find(key) != uniqueTable.end()) {
                return uniqueTable[key];
            }

            BDDNode* node = new BDDNode(varId, low, high);
            uniqueTable[key] = node;
            return node;
        }

        bool evaluate(BDDNode* node, const std::unordered_map<int, bool>& assignments) {
            if (node->isTerminal()) {
                return node->val == 1;
            }
            
            bool varVal = assignments.at(node->varId);
            if (varVal) {
                return evaluate(node->high, assignments);
            }
            return evaluate(node->low, assignments);
        }
    };

    int main() {
        ROBDDManager manager;

        // Build BDD representing "x0 AND x1"
        // At x1 level:
        BDDNode* x1Node = manager.getNode(1, manager.terminalFalse, manager.terminalTrue);
        // At x0 level:
        BDDNode* root = manager.getNode(0, manager.terminalFalse, x1Node);

        std::cout << std::boolalpha;
        std::unordered_map<int, bool> assignments1 = {{0, true}, {1, true}};
        std::cout << "x0=True, x1=True: " << manager.evaluate(root, assignments1) << "\n"; // true

        std::unordered_map<int, bool> assignments2 = {{0, true}, {1, false}};
        std::cout << "x0=True, x1=False: " << manager.evaluate(root, assignments2) << "\n"; // false

        return 0;
    }
    ```

    :::
-
- # When to Use
  collapsed:: true
  - ## ✅ Use ROBDDs When:
    - You are verifying circuit designs or checking equivalence between high-level logic specifications and gate-level implementations.
    - You need to perform infinite-state model checking or solve symbolic Model Checking tasks.
    - You are implementing SAT solvers or constraint satisfiability systems where multiple Boolean operations must be logically aggregated.
  - ## ❌ Do NOT Use ROBDDs When:
    - The number of Boolean variables is very large and you cannot identify a good ordering heuristic. A poor ordering causes the graph size to explode exponentially ($O(2^N)$ nodes).
    - You only need single-shot Boolean evaluation (use standard Boolean expression evaluation or simple AST tree parsing).
-
- # Variations & Related Concepts
  collapsed:: true
  - **Zero-Suppressed BDD (ZBDD)**: A variation where nodes are eliminated if their high branch points to 0. Extremely efficient for representing sparse sets or combination covers.
  - **Multi-Valued Decision Diagram (MDD)**: Extends BDDs by allowing decision variables to have more than two possible values (multi-way branching).
-
- # Key Takeaways
  - BDDs model Boolean logic functions as directed acyclic graphs.
  - Applying ordering (OBDD) and reduction rules (ROBDD) ensures canonical representations for constant-time equivalence checks.
  - The Unique Table enforces global node-sharing, preventing duplicates.
  - Variable ordering choice is critical, dictating whether memory footprint is polynomial or exponential.