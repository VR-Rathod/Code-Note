---
seoTitle: Binary Decision Diagram (BDD) – Boolean Function Representation
description: "Binary Decision Diagrams represent Boolean functions as directed acyclic graphs. Covers ROBDD, variable ordering, apply algorithm, and applications in formal."
keywords: "binary decision diagram, BDD, ROBDD, Boolean function, formal verification, DAG, variable ordering, apply algorithm, time complexity, space complexity, logic synthesis"
---

- # Explanation
	- A **Binary Decision Diagram (BDD)** is a data structure used to represent boolean functions. It uses a directed acyclic graph where each node represents a decision based on a variable, and the edges represent the outcomes of that decision.
-
- # Steps
	- **Construct the decision diagram**: Represent the boolean function in terms of binary decisions.
		- The diagram is built such that each node represents a binary decision based on a variable.
		-
		- The edges represent the outcome of that decision (true or false).
	-
	- **Minimize the diagram**: After constructing the initial BDD, apply techniques (like reduction rules) to minimize the number of nodes and edges. This step makes the BDD more efficient for function evaluation.
	-
	- **Evaluate the boolean function**: Once the BDD is constructed, evaluate the function by traversing the tree-like structure and applying the decisions.
-
- # Time Complexity
	- O(n) for evaluating the boolean function, but complexity can vary depending on the size and structure of the diagram.
	-
	- **Construction**: O(n) where `n` is the number of variables, assuming the boolean function is represented as a decision tree.
	-
	- **Evaluation**: O(n) for evaluating the function, where `n` is the number of variables in the BDD (traversing each node once).
-
- ```python
  class BDDNode:
      def __init__(self, variable=None, high=None, low=None, value=None):
          self.variable = variable  # Variable name
          self.high = high  # Pointer to high branch (True)
          self.low = low  # Pointer to low branch (False)
          self.value = value  # Value for terminal nodes (True/False)
  
  class BDD:
      def __init__(self):
          self.nodes = {}  # Dictionary to store nodes for caching
          self.var_count = 0  # Variable counter to name the variables
  
      def add_node(self, variable, high, low):
          """Create a new node for the BDD."""
          if (variable, high, low) in self.nodes:
              return self.nodes[(variable, high, low)]  # Return cached node
          node = BDDNode(variable, high, low)
          self.nodes[(variable, high, low)] = node
          return node
  
      def create_bdd(self, expression):
          """Create a BDD for a given boolean expression."""
          if not expression:
              return None
          if expression == "True":
              return BDDNode(value=True)
          if expression == "False":
              return BDDNode(value=False)
  
          # Handle variable (e.g., "x1" or "x2")
          var = expression[0]
          high = self.create_bdd(expression[1:])
          low = self.create_bdd(expression[1:])
          
          return self.add_node(var, high, low)
  
      def evaluate(self, node, assignments):
          """Evaluate the BDD with the given variable assignments."""
          if node is None:
              return False
  
          if node.value is not None:  # Terminal node (True or False)
              return node.value
  
          # Traverse according to the variable's value in assignments
          var_value = assignments.get(node.variable)
          if var_value:  # If True, move to the 'high' branch
              return self.evaluate(node.high, assignments)
          else:  # If False, move to the 'low' branch
              return self.evaluate(node.low, assignments)
  
  # Example usage
  bdd = BDD()
  
  # Constructing a simple BDD for the expression "x1 AND x2"
  # This represents the boolean function x1 AND x2
  bdd_root = bdd.create_bdd("x1x2")
  
  # Define variable assignments for testing
  assignments = {"x1": True, "x2": True}
  
  # Evaluate the BDD with the assignments
  result = bdd.evaluate(bdd_root, assignments)
  print(f"Result of BDD evaluation: {result}")  # Expected output: True
  ```