---
seoTitle: Matplotlib Python Library - Data Visualization Reference Guide
description: "Matplotlib creates static, animated, and interactive visualizations in Python. Covers pyplot, axes, subplots, plot types, customization, and saving figures."
keywords: "Matplotlib, Python visualization, pyplot, subplots, plot types, data visualization, charts, graphs, figure customization, Python library, scientific plotting"
---

- # 📘 **Overview**
	- **What is it?**: Matplotlib is a comprehensive library for creating static, animated, and interactive visualizations in Python. It is the core graphics engine behind many other plotting libraries (such as Seaborn and Pandas plotting).
	- **Key Features**:
		- **Highly Customizable**: Total control over fonts, axes, line styles, colors, and layout configurations.
		- **Two Interfaces**: State-based interface (via `pyplot` - good for quick plots) and Object-Oriented interface (recommended for clean, robust layouts).
		- **Export Options**: Export figures to multiple high-quality formats (PNG, PDF, SVG, etc.).
	- **Installation**:
		- ```bash
		  pip install matplotlib
		  ```
- # 🧾 **Core Concepts**
	- **Figure**: The overall window or page that contains all plot elements (axes, title, legend, etc.). Think of it as a canvas.
	- **Axes**: A coordinate area within a Figure where data is plotted. A single Figure can contain multiple Axes (subplots).
	- **Axis**: The actual helper lines and ticks marking scale values (e.g. X-axis, Y-axis).
- # 💻 **Common Code Patterns & Cheat Sheet**
	- **Basic Line Plot (Object-Oriented Style)**:
		- ```python
		  import matplotlib.pyplot as plt
		  import numpy as np
		  
		  # Generate data
		  x = np.linspace(0, 10, 100)
		  y = np.sin(x)
		  
		  # Create Figure and Axes
		  fig, ax = plt.subplots(figsize=(8, 4))
		  
		  # Plot data
		  ax.plot(x, y, label="Sine Wave", color="purple", linewidth=2, linestyle="-")
		  
		  # Customize labels & grid
		  ax.set_title("Simple Sine Plot", fontsize=14)
		  ax.set_xlabel("X-Axis")
		  ax.set_ylabel("Y-Axis")
		  ax.legend(loc="upper right")
		  ax.grid(True, linestyle="--", alpha=0.6)
		  
		  # Render / Show
		  plt.tight_layout()
		  plt.show()
		  ```
	- **Creating Subplots (Multi-plot Layouts)**:
		- ```python
		  # Create 1 row with 2 columns of plots
		  fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
		  
		  # Left plot: Scatter
		  ax1.scatter(np.random.rand(50), np.random.rand(50), color="blue", alpha=0.5)
		  ax1.set_title("Scatter Plot")
		  
		  # Right plot: Histogram
		  ax2.hist(np.random.randn(1000), bins=30, color="orange", edgecolor="black")
		  ax2.set_title("Histogram")
		  
		  plt.tight_layout()
		  plt.show()
		  ```
	- **Saving Plots**:
		- ```python
		  fig, ax = plt.subplots()
		  ax.plot([1, 2, 3], [4, 5, 6])
		  
		  # Save as PNG with transparent background and high resolution
		  fig.savefig("my_plot.png", dpi=300, bbox_inches="tight", transparent=True)
		  ```
- # 💡 **Best Practices & Tips**
	- **Object-Oriented API**: Always prefer using `fig, ax = plt.subplots()` rather than calling `plt.plot()` directly. The OO API keeps your code cleaner when working with subplots or complex layouts.
	- **Tight Layout**: Always call `plt.tight_layout()` before saving or showing a plot to prevent axes labels and titles from overlapping.
	- **Closing Figures**: If you are generating many plots in a loop (e.g., in a background job or web server), always call `plt.close(fig)` or `plt.close('all')` to prevent memory leaks.
- # 🔗 **Navigation & Internal Links**
	- **Parent**: [[Python]]
	- **Related Notes**: [[Data Science]] | [[Machine Learning]] | [[NumPy]] | [[Pandas]] | [[Seaborn]] | [[Plotly]]