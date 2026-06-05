---
seoTitle: Pandas Python Library - DataFrame Operations Reference Guide
description: "Pandas provides powerful data manipulation with DataFrames. Covers indexing, groupby, merge, pivot tables, time series, missing data handling, and I/O."
keywords: "Pandas, Python DataFrame, groupby, merge, pivot table, time series, missing data, indexing, data manipulation, Python library, data analysis, CSV reading"
---

- # 📘 **Overview**
	- **What is it?**: Pandas is a fast, powerful, flexible, and easy-to-use open-source data analysis and manipulation tool built on top of the Python programming language.
	- **Key Features**:
		- **DataFrame**: A two-dimensional tabular data structure with labeled axes (rows and columns).
		- **Series**: A one-dimensional labeled array capable of holding any data type.
		- **Alignment**: Auto-alignment of data in operations based on row/column indices.
		- **File Support**: Out-of-the-box reading and writing support for CSV, Excel, SQL databases, JSON, Parquet, and more.
	- **Installation**:
		- ```bash
		  pip install pandas
		  ```
- # 🧾 **Core Concepts**
	- **Series**: The basic 1D building block of Pandas.
	- **DataFrame**: The 2D table representing data, composed of multiple Series (columns) sharing the same Index.
	- **Indexing (`loc` vs `iloc`)**:
		- `loc`: Label-based selection (e.g. `df.loc[0, 'column_name']`).
		- `iloc`: Integer/Position-based selection (e.g. `df.iloc[0, 1]`).
	- **Missing Data**: Pandas uses `NaN` (Not a Number) to represent missing values and provides native functions like `isnull()`, `dropna()`, and `fillna()`.
- # 💻 **Common Code Patterns & Cheat Sheet**
	- **DataFrame Creation & Loading**:
		- ```python
		  import pandas as pd
		  
		  # Load from CSV
		  df = pd.read_csv("data.csv")
		  
		  # Create from dictionary
		  data = {"Name": ["Alice", "Bob"], "Age": [25, 30]}
		  df = pd.DataFrame(data)
		  ```
	- **Selection & Filtering**:
		- ```python
		  # Select single column
		  ages = df["Age"]
		  
		  # Filter rows based on conditions
		  adults = df[df["Age"] >= 18]
		  
		  # Select specific rows and columns using loc
		  subset = df.loc[df["Age"] > 20, ["Name"]]
		  ```
	- **Grouping & Aggregation**:
		- ```python
		  # Calculate mean age by city
		  grouped = df.groupby("City")["Age"].mean()
		  
		  # Perform multiple aggregations
		  summary = df.groupby("City").agg({"Age": ["mean", "min", "max"]})
		  ```
	- **Data Merging & Joining**:
		- ```python
		  # Merge two DataFrames on a common column
		  df1 = pd.DataFrame({"ID": [1, 2], "Val": ["A", "B"]})
		  df2 = pd.DataFrame({"ID": [2, 3], "Score": [88, 95]})
		  merged = pd.merge(df1, df2, on="ID", how="inner")
		  ```
- # 💡 **Best Practices & Tips**
	- **Avoid `.iterrows()`**: Never iterate over rows using `.iterrows()` for numerical calculations. Instead, use vectorized operations or `.apply()` (and prefer `.apply()` only when vectorization is not possible).
	- **SettingWithCopyWarning**: When modifying a slice, always make an explicit copy: `df_slice = df[df['Age'] > 20].copy()`.
	- **Categorical Columns**: Convert text columns with low cardinality to `category` dtype using `df['Col'] = df['Col'].astype('category')` to save substantial memory.
- # 🔗 **Navigation & Internal Links**
	- **Parent**: [[Python]]
	- **Related Notes**: [[Data Science]] | [[Machine Learning]] | [[NumPy]] | [[Matplotlib]]