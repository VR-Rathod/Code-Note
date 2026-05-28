---
seoTitle: R Programming Reference – Data Science, Statistics, and Visualization Guide
description: "Comprehensive R reference covering vectors, lists, data frames, factors, vectorization, the apply loop family, Tidyverse (dplyr, ggplot2), and high-performance data.table structures."
keywords: "R programming, R data science, tidyverse, dplyr, ggplot2, data.table, vectorization, apply, data frames, statistics"
displayTitle: R
---

- # History
	- **How**:
		- Developed by **Ross Ihaka** and **Robert Gentleman** in the early 1990s at the University of Auckland, New Zealand.
		- Originally named **R** based on the first letters of both creators' names, and as a play on the commercial **S** programming language developed at Bell Labs.
		- Released to the public under the GNU GPL license in 1995 as an open-source project.
		- Solidified its status as the standard environment for scientific data analysis, statistical modeling, bioinformatics, and academic research.
		- Evolved through milestones: R 1.0.0 (release in 2000), R 3.0.0 (support for large datasets), R 4.0.0 (improved memory usage and stringsAsFactors defaults changed to false), to native pipeline operators (`|>`) in R 4.1.0+.
	-
	- **Who**:
		- Created by **Ross Ihaka** and **Robert Gentleman**.
		- Developed and maintained by the **R Development Core Team** and supported by the **R Foundation**.
	-
	- **Why**:
		- Built to provide a free, flexible, and robust statistical computing environment, bypassing expensive, closed-source alternatives like SAS or SPSS.
		- Emphasizes native data handling, vectorization, and statistical visualization.
-
- # Introduction
	- ## Core Pillars
	  collapsed:: true
		- **Vectorized Operations** — Mathematical operations are natively designed to apply across arrays/vectors in parallel without explicit loop commands.
		- **Integrated Graphics Engine** — Built-in visual rendering engines (base R plotting, grid graphics) supporting complex, publication-ready statistical plots.
		- **Heterogeneous Data Structures** — Built-in native support for statistical data tables (`Data Frame`), aligning different types (strings, floats, dates) into clean row/column matrixes.
		- **Extensive Statistical Library** — Exposes native algorithms for hypothesis tests, linear regression, ANOVA, clustering, and distributions out of the box.
	-
	- ## Advantages
	  collapsed:: true
		- **Best-in-class Visualization** — Libraries like **ggplot2** allow plotting complex multi-variable diagrams using the "Grammar of Graphics".
		- **CRAN Repository** — Over 18,000 packages covering every mathematical branch, biostatistics, econometrics, and machine learning.
		- **Functional Paradigms** — High support for functional programming, treating functions as first-class citizens.
		- **Reproducible Science** — Integrates with **R Markdown** and **knitr** to weave code, equations, and results into publications.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Execution Speed** — As a dynamically typed interpreted language, loops can be extremely slow if not vectorized.
		- **High Memory Overhead** — R stores all data frames inside the active RAM, creating memory limitations on large-scale datasets unless using out-of-core tools.
		- **Inconsistent Syntax API** — Functions in base R can have varying naming patterns (e.g. camelCase vs dot.notation vs underscores) due to legacy package additions.
		- **Steep Learning Curve** — Requires a change in thinking for programmers coming from procedural languages (like Java/C#) due to its heavy focus on vectorization and functional structures.
-
- # Basics & Variables Assignment
  collapsed:: true
	- ## Syntax & Hello World
		- ```R
		  print("Hello, World!")
		  ```
	-
	- ## Variable Assignments
		- R uses arrow assignment operators (`<-`) by convention. While `=` is valid, it is typically restricted to passing function arguments.
		- ```R
		  # Local Assignment
		  x <- 42
		  name <- "Data"
		  
		  # Global Assignment (bypasses current lexical environment, writing directly to global environment)
		  y <<- 100
		  ```
	-
	- ## Homogeneous Data Structures
		- Homogeneous structures can only hold data of a single data type (e.g. all numeric or all character).
		- ```R
		  # 1. Vector: 1D homogeneous array (fundamental building block)
		  numeric_vector <- c(1, 2.5, 3)          # c() stands for combine
		  char_vector <- c("A", "B", "C")
		  logical_vector <- c(TRUE, FALSE, TRUE)
		  
		  # 2. Matrix: 2D homogeneous array
		  mat <- matrix(1:6, nrow = 2, ncol = 3)  # matrix values: 1 3 5 / 2 4 6
		  
		  # 3. Array: n-Dimensional homogeneous array
		  arr <- array(1:12, dim = c(2, 3, 2))    # 2 rows, 3 columns, 2 layers
		  ```
	-
	- ## Heterogeneous Data Structures
		- Heterogeneous structures can hold different data types across their dimensions.
		- ```R
		  # 1. List: 1D collection of nested values of any type
		  my_list <- list(name = "Bob", scores = c(90, 85), active = TRUE)
		  
		  # 2. Data Frame: 2D tabular structure (columns are lists, rows must be equal length)
		  df <- data.frame(
		      id = c(1, 2, 3),
		      name = c("Alice", "Bob", "Charlie"),
		      gpa = c(3.8, 3.5, 3.9),
		      stringsAsFactors = FALSE -- standard default since R 4.0
		  )
		  
		  # Accessing columns
		  gpas <- df$gpa       # returns vector: 3.8, 3.5, 3.9
		  bob_name <- df[2, 2] # access row 2, col 2
		  ```
	-
	- ## Factors (Categorical Variables)
		- Factors represent categorical variables, mapping characters to underlying integer vectors with metadata tags called "levels".
		- ```R
		  sizes <- factor(c("M", "S", "L", "M", "S"), levels = c("S", "M", "L"), ordered = TRUE)
		  print(sizes)
		  # [1] M S L M S
		  # Levels: S < M < L
		  ```
-
- # Operators, Vectorization & Recycling Rules
  collapsed:: true
	- ## Subsetting Operators
		- ```R
		  list_data <- list(a = 1:3, b = "hello")
		  
		  # Single brackets [ ]: Returns same container type (returns a list)
		  list_data[1]  # $a [1] 1 2 3
		  
		  # Double brackets [[ ]] or $: Accesses the content directly (returns vector)
		  list_data[[1]] # [1] 1 2 3
		  list_data$b    # "hello"
		  ```
	-
	- ## Vectorization (No Explicit Loops)
		- Operators and functions are applied element-by-element across vector scopes without writing `for` loops.
		- ```R
		  x <- c(1, 2, 3)
		  y <- c(10, 20, 30)
		  
		  print(x + y)  # [1] 11 22 33 (Elements added in parallel)
		  print(x * 2)  # [1]  2  4  6 (Scalar multiplication)
		  ```
	-
	- ## Vector Recycling Rules
		- If performing operations on vectors of mismatched lengths, R repeats (recycles) the shorter vector until it matches the length of the longer vector. If the longer length is not a multiple of the shorter length, a warning is raised.
		- ```R
		  a <- c(1, 2, 3, 4)
		  b <- c(10, 20)
		  
		  # b is recycled to match length of a: c(10, 20, 10, 20)
		  print(a + b) # [1] 11 22 13 24
		  ```
-
- # Control Flow
  collapsed:: true
	- ## if-else & Vectorized ifelse
		- Standard `if` statements check only a single boolean value.
		- ```R
		  x <- 10
		  if (x > 5) {
		      print("Large")
		  } else {
		      print("Small")
		  }
		  
		  # Vectorized ifelse(): Process entire vectors elements simultaneously
		  numbers <- c(3, 8, 2, 10)
		  labels <- ifelse(numbers > 5, "Above", "Below")
		  print(labels) # [1] "Below" "Above" "Below" "Above"
		  ```
	-
	- ## Loops
		- ```R
		  # For loop (Iterates over vector sequences)
		  for (item in c("A", "B", "C")) {
		      print(item)
		  }
		  
		  # While loop
		  count <- 1
		  while (count <= 3) {
		      count <- count + 1
		  }
		  
		  # Repeat loop (executes until break)
		  x <- 0
		  repeat {
		      x <- x + 1
		      if (x >= 5) break
		  }
		  ```
-
- # Functions & Functional Programming
  collapsed:: true
	- ## Definitions & Lazy Evaluation
		- Arguments in R are evaluated lazily; they are only processed when first referenced in the function execution path.
		- ```R
		  custom_log <- function(value, message = "Log default") {
		      print(message)
		      return(value)
		  }
		  
		  # If we pass an error expression to 'message' but it is never evaluated, no error is thrown!
		  lazy_test <- function(a, b) {
		      print(a) # Only 'a' is evaluated. 'b' remains unprocessed.
		  }
		  lazy_test(5, stop("This is ignored")) # Prints 5, does not crash!
		  ```
	-
	- ## The apply Loops Family
		- The apply family bypasses slow procedural for loops.
		- **`apply()`**: Iterates over dimensions (1 = rows, 2 = columns) of a matrix/array.
		- **`lapply()`**: Iterates over lists/vectors, returning a list.
		- **`sapply()`**: Iterates over lists/vectors, simplifying returns to a vector if possible.
		- **`vapply()`**: Iterates, requiring explicit declaration of return formats (highly recommended for safety).
		- ```R
		  # apply on matrix columns
		  mat <- matrix(1:6, nrow = 2)
		  col_sums <- apply(mat, 2, sum) # [1] 3 7 11
		  
		  # lapply vs sapply
		  nums <- c(1, 2, 3)
		  squared_list <- lapply(nums, function(x) x^2) # returns list
		  squared_vec <- sapply(nums, function(x) x^2)  # returns vector: c(1, 4, 9)
		  
		  # vapply (Safe type enforcement)
		  char_lengths <- vapply(c("A", "BB", "CCC"), nchar, FUN.VALUE = integer(1)) # [1] 1 2 3
		  ```
-
- # The Tidyverse Ecosystem
  collapsed:: true
	- ## Data Manipulation (dplyr) & Piping
		- `dplyr` provides a grammar of data manipulation. Pipelines link steps using the pipe operator `%>%` (magrittr) or `|>` (native R pipe).
		- ```R
		  library(dplyr)
		  
		  # Process database data frame
		  processed_df <- df %>%
		      filter(gpa > 3.0) %>%                # Keep rows
		      select(id, name, gpa) %>%            # Keep columns
		      mutate(gpa_percentage = gpa / 4.0) %>% # Add new column calculations
		      arrange(desc(gpa))                   # Sort values
		  ```
	-
	- ## Data Visualization (ggplot2)
		- Maps data aesthetics (`aes()`) to visual representations (`geoms`).
		- ```R
		  library(ggplot2)
		  
		  # Generate scatter plot
		  ggplot(data = df, aes(x = id, y = gpa, color = name)) +
		      geom_point(size = 3) +
		      geom_line() +
		      labs(title = "GPA Tracking Plot", x = "Student ID", y = "GPA Value") +
		      theme_minimal()
		  ```
-
- # Environments & Scopes
  collapsed:: true
	- ## Lexical Environments
		- R is lexically scoped. When evaluating variables, R checks the current environment, parent environments, and package namespaces in a specific search path array.
		- ```R
		  # Print active namespaces search path
		  search() 
		  
		  # Inspect active environment variables
		  ls() 
		  ```
-
- # Memory Management & Performance
  collapsed:: true
	- ## RAM & Copy-on-Write Behavior
		- R loads all active variable values directly into memory. Modifying a subset of a large data frame copies the entire data frame in memory (Copy-on-Write), which can cause massive memory spikes.
	-
	- ## Loop Optimization (Pre-allocation)
		- Modifying vectors inside loops dynamically forces R to copy the vector continuously in memory. Pre-allocating vector sizes prevents this overhead.
		- ```R
		  # DANGEROUSLY SLOW (re-allocates memory every loop iteration)
		  x <- c()
		  for(i in 1:100000) { x[i] <- i }
		  
		  # SECURE & FAST (Pre-allocated)
		  x <- integer(100000)
		  for(i in 1:100000) { x[i] <- i }
		  ```
	-
	- ## High Performance with data.table
		- The **`data.table`** package bypasses standard memory overheads, providing in-place updates without memory copies (`:=` operator) and optimized indexing.
		- ```R
		  library(data.table)
		  
		  # Convert data frame to data.table
		  dt <- as.data.table(df)
		  
		  # Update column in-place without memory copy
		  dt[, gpa := gpa + 0.1] 
		  
		  # Optimized query syntax: dt[rows, select/update, group_by]
		  result <- dt[gpa > 3.5, .(avg_gpa = mean(gpa)), by = name]
		  ```
-
- # Comparison: R vs Python
  collapsed:: true
	- ## Direct Comparison Table
		- ```
		  Feature                  R                                       Python
		  Primary Focus            Statistical computing, data analysis    General-purpose programming, ML pipeline
		  Common IDE               RStudio                                 Jupyter Notebook, VS Code, PyCharm
		  Syntax style             Functional, vectorized arrays           Procedural, Object-oriented
		  Tabular Data             Built-in Data Frame                     Pandas DataFrame library (external)
		  Piping Operator          Native (|>) or magrittr (%>%)           No native pipes (uses method chaining)
		  Packages Repository      CRAN (strict compliance checks)         PyPI (easy upload, variable checks)
		  Graphics philosophy      Grammar of Graphics (ggplot2)           Imperative plotting (matplotlib, seaborn)
		  Memory handling          Loads data into active RAM              Loads data into active RAM
		  ```
-
- # Libs & Framework
	- ## Core Data Science & Tidyverse:
		- [[tidyverse]] - Comprehensive collection of data science libraries (includes ggplot2, dplyr, tidyr, readr, purrr, tibble).
		- [[ggplot2]] - High-quality data visualization engine based on the grammar of graphics.
		- [[dplyr]] - Grammar of data manipulation, providing intuitive table actions.
	-
	- ## High Performance:
		- [[data.table]] - Extremely fast data manipulation package for massive tables, updating variables in-place.
		- [[Rcpp]] - Allows seamless integration of C++ functions inside R scripts for massive computation boosts.
	-
	- ## Web Apps & Reporting:
		- [[Shiny]] - Framework for building interactive web applications directly using R script layouts.
		- [[R Markdown]] - Unified document compiler supporting text, LaTeX equations, and embedded R code blocks.
-
- # More Learn
	- Explore the following links for valuable resources, communities, and tools to enhance your skills : -
		- [R Project Official Website](https://www.r-project.org/)
		- [Comprehensive R Archive Network (CRAN)](https://cran.r-project.org/)
		- [Tidyverse Home Page](https://www.tidyverse.org/)
		- [R for Data Science Book (Free)](https://r4ds.had.co.nz/)