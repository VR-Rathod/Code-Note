---
seoTitle: NumPy Python Library - Array Operations and Scientific Computing
description: "NumPy is the foundation of scientific Python. Covers ndarray, broadcasting, indexing, linear algebra, random number generation, and performance optimization."
keywords: "NumPy, Python arrays, ndarray, broadcasting, linear algebra, scientific computing, random numbers, indexing, slicing, Python library, numerical computing"
---

- # 📘 **Overview**
	- **What is it?**: NumPy (Numerical Python) is the foundational package for scientific computing in Python. It provides support for large, multi-dimensional arrays and matrices, along with a collection of high-level mathematical functions to operate on these arrays.
	- **Key Features**:
		- **ndarray**: A fast and space-efficient multidimensional array providing vectorized arithmetic operations.
		- **Broadcasting**: A powerful mechanism that allows operations on arrays of different shapes.
		- **Vectorization**: Elimination of explicit Python loops in numerical operations, leading to C-level execution speeds.
	- **Installation**:
		- ```bash
		  pip install numpy
		  ```
- # 🧾 **Core Concepts**
	- **ndarray**: An N-dimensional array object where all elements must be of the same data type (`dtype`).
	- **Vectorization**: Running element-wise calculations directly in C, which avoids the overhead of standard Python loops.
	- **Broadcasting**: Rules specifying how operations work on arrays of different shapes (e.g., adding a scalar to an array, or multiplying a 2D array by a 1D array).
	- **Slicing and Views**: Sub-arrays created by slicing are "views" of the original data. Modifying a view modifies the original array (no copy is made unless explicitly requested with `.copy()`).
- # 💻 **Common Code Patterns & Cheat Sheet**
	- **Array Creation & Properties**:
		- ```python
		  import numpy as np
		  
		  # Creation from list
		  arr = np.array([1, 2, 3, 4])
		  
		  # Help helper functions
		  zeros = np.zeros((2, 3))            # 2x3 matrix of zeros
		  ones = np.ones((3, 3), dtype=int)   # 3x3 matrix of ones
		  steps = np.arange(0, 10, 2)         # [0 2 4 6 8]
		  linspace = np.linspace(0, 1, 5)     # [0. 0.25 0.5 0.75 1.]
		  identity = np.eye(3)                # 3x3 Identity matrix
		  ```
	- **Indexing, Slicing & Boolean Masking**:
		- ```python
		  grid = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
		  
		  # Slice: first two rows, last two columns
		  sub_grid = grid[:2, 1:]
		  
		  # Boolean Masking (extremely fast filtering)
		  mask = grid > 5
		  filtered_vals = grid[mask]          # [6 7 8 9]
		  ```
	- **Vectorized Operations & Broadcasting**:
		- ```python
		  a = np.array([1, 2, 3])
		  b = np.array([[10], [20], [30]])
		  
		  # Broadcasting: adds (3,) to (3,1) resulting in a (3,3) matrix
		  result = a + b
		  # [[11 12 13],
		  #  [21 22 23],
		  #  [31 32 33]]
		  ```
- # 💡 **Best Practices & Tips**
	- **Avoid Explicit Loops**: Never loop over NumPy arrays using Python `for` loops if a vectorized alternative exists.
	- **View vs Copy**: Be careful when slicing: `slice = arr[1:3]` does not copy memory. Use `slice = arr[1:3].copy()` if you want a new independent array.
	- **Dtype Management**: Choose specific dtypes (like `np.int8`, `np.float32`) to save memory when working with large datasets.
- # 🔗 **Navigation & Internal Links**
	- **Parent**: [[Python]]
	- **Related Notes**: [[Data Science]] | [[Machine Learning]] | [[Pandas]] | [[Matplotlib]] | [[SciPy]]