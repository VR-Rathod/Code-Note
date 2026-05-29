---
seoTitle: Shell Scripting Reference – Bash Syntax and Command Line Guide
description: "Comprehensive Bash and POSIX shell scripting reference covering variables, loops, conditionals, functions, arrays, expansions, redirects, and scripting patterns."
keywords: "shell scripting, bash, shell, bash script, posix shell, command line, scripting guide, syntax reference, cheat sheet, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Shell Script
---

- # History
	- **How**:
		- **Shell scripting** originated in the 1970s with the **Bourne Shell** (`sh`), developed by **Stephen Bourne** at Bell Labs for Unix.
		- Over time, modern shells emerged to add interactive features and programming enhancements. The most prominent is the **Bourne-Again Shell** (`bash`), written by **Brian Fox** in 1989 as a free software replacement for `sh` under the GNU project.
		- Today, POSIX standard shell scripting (`sh`) provides baseline compatibility across Unix-like systems, while `bash` remains the default shell script environment for most Linux distributions and developers.
	-
	- **Who**:
		- **Stephen Bourne** (Bourne Shell), **Brian Fox** (Bash), and the open-source GNU community.
	-
	- **Why**:
		- Developed to automate system administration tasks, coordinate execution of separate compiler/system utilities, and provide an expressive command execution language.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **High System Integration** — Direct access to filesystem utilities, command-line arguments, system environments, and other compiled executables.
		- **Fast Automation** — Perfect for quick scripting tasks, file manipulation, build automation, and server deployments.
		- **Interactive Portability** — POSIX compliant scripts run on virtually any Unix-like OS (Linux, macOS, BSD) without needing runtime engine compilation.
		- **Flexible Piping** — Effortlessly redirects stream inputs/outputs between utilities using pipe operations.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Performance Overhead** — High overhead as shell processes spawn external subprocess commands for simple operations (e.g. executing `grep` or `sed`).
		- **Syntax Quirks** — Extreme sensitivity to whitespace, confusing syntax rules (such as brackets vs double brackets), and tricky quote escaping rules.
		- **Weak Data Structuring** — Poor support for complex data types. Missing objects, structs, or nested arrays (hashes/arrays are flat).
		- **Fragile Error Handling** — Scripts continue executing after commands fail by default, requiring explicit options (`set -e`) to prevent disastrous cascade failures.
	-
	- ## Remember Points
	  collapsed:: true
		- **Whitespace Matters** — `x=1` works; `x = 1` fails. `[ $x -eq 1 ]` works; `[$x-eq1]` fails.
		- **Quote Your Variables** — Always use double quotes around variables (e.g., `"$var"`) to prevent word splitting and glob expansions.
		- **Check Exit Codes** — Every command returns `0` for success and `1-255` for errors/failures.
-
- # Basics
	- ## Hello World & Entry Point
		- ```bash
		  #!/bin/bash
		  
		  # This is a comment
		  print_message="Hello, World!"
		  echo "$print_message"
		  ```
		- The first line `#!/bin/bash` is the **Shebang**, indicating the path of the interpreter to run this file. Use `#!/bin/sh` for POSIX-only compatibility.
		- Execution permissions must be set using command line: `chmod +x script.sh`. Run the script with `./script.sh`.
	-
	- ## Variables and Scopes
		- ```bash
		  # 1. Global Variables (Default)
		  global_var="I am global"
		  
		  # 2. Local Variables (Restricted to function body)
		  my_function() {
		    local local_var="I am local"
		    echo "$local_var"
		  }
		  
		  # 3. Environment Variables (Exported to child processes)
		  export API_KEY="secure_token_123"
		  
		  # 4. Read-Only Constants
		  readonly PI=3.14159
		  # PI=3.14 // Fails with error: PI: readonly variable
		  ```
	-
	- ## Quoting Rules
	  collapsed:: true
		- ```bash
		  name="VR"
		  
		  # Double Quotes (Weak Quoting) - Evaluates variables and escape characters
		  echo "Hello $name\n" # Output: Hello VR (followed by newline)
		  
		  # Single Quotes (Strong Quoting) - Prints literal string contents without evaluation
		  echo 'Hello $name\n' # Output: Hello $name\n
		  ```
-
- # Control Flow
	- ## Conditional checking (`if` / `elif` / `else`)
	  collapsed:: true
		- ```bash
		  # Bracket types:
		  # [ ... ]   - POSIX single bracket test.
		  # [[ ... ]] - Bash-extended double brackets. Supports logical operators (&&, ||) and regex.
		  
		  score=85
		  
		  if [[ $score -ge 90 ]]; then
		    echo "Grade A"
		  elif [[ $score -ge 80 ]]; then
		    echo "Grade B"
		  else
		    echo "Grade F"
		  fi
		  ```
	-
	- ## Numeric vs. String Comparisons
	  collapsed:: true
		- ```
		  Operation         Numeric Operator      String Operator
		  Equality          -eq                   ==  or  =
		  Inequality        -ne                   !=
		  Greater Than      -gt                   \>
		  Less Than         -lt                   \<
		  Greater or Equal  -ge                   -z (if empty)
		  Less or Equal     -le                   -n (if not empty)
		  ```
	-
	- ## Case Expressions
	  collapsed:: true
		- ```bash
		  command="stop"
		  case "$command" in
		    "start")
		      echo "Starting system..."
		      ;;
		    "stop" | "halt")
		      echo "Shutting down..."
		      ;;
		    *)
		      echo "Unknown instruction"
		      ;;
		  esac
		  ```
	-
	- ## Loops
	  collapsed:: true
		- ```bash
		  # 1. Standard For Loop (with range expansion)
		  for i in {1..5}; do
		    echo "Count: $i"
		  done
		  
		  # 2. C-Style For Loop
		  for ((i=0; i<3; i++)); do
		    echo "Index: $i"
		  done
		  
		  # 3. While Loop
		  count=0
		  while [[ $count -lt 3 ]]; do
		    echo "While count: $count"
		    ((count++))
		  done
		  
		  # 4. Loop Control (break & continue)
		  for n in {1..10}; do
		    if [[ $n -eq 3 ]]; then
		      continue # Skip 3
		    fi
		    if [[ $n -eq 7 ]]; then
		      break # Stop at 7
		    fi
		    echo "$n"
		  done
		  ```
	-
	- ## Statement Modifiers / Boolean Shortcuts
	  collapsed:: true
		- ```bash
		  # && runs second command only if first succeeds (exit code 0)
		  # || runs second command only if first fails (exit code non-zero)
		  
		  [[ -f "config.txt" ]] && echo "Config file exists"
		  [[ -d "logs" ]] || mkdir "logs"
		  ```
-
- # Functions
	- ## Declaration & Arguments
	  collapsed:: true
		- ```bash
		  # Functions read parameters from index variables ($1, $2, etc.)
		  calculate_sum() {
		    local num1=$1
		    local num2=$2
		    local sum=$((num1 + num2))
		    echo "$sum" # Return value by printing to stdout
		  }
		  
		  # Invoke function (do not use parentheses when calling)
		  result=$(calculate_sum 5 10)
		  echo "Result: $result" # 15
		  ```
	-
	- ## Exit Codes & Returns
	  collapsed:: true
		- ```bash
		  # The 'return' keyword sets the exit status (0-255), not returning values
		  check_file() {
		    if [[ -f "$1" ]]; then
		      return 0 # Success
		    else
		      return 1 # Error
		    fi
		  }
		  
		  check_file "data.txt"
		  if [[ $? -eq 0 ]]; then
		    echo "File found"
		  fi
		  ```
-
- # Special Variables
	- ## Command Line Arguments
		- ```
		  Variable      Description
		  $0            Name of the script being executed
		  $1, $2, ...   First, second, etc. command line arguments
		  $#            Number of arguments passed to script
		  $@            Array representation of all arguments (safe for spacing with "$@")
		  $*            Single string representation of all arguments
		  $?            Exit status of the last executed command (0 = success)
		  $$            Process ID (PID) of the current shell running script
		  $!            Process ID (PID) of the last background command run
		  ```
-
- # Arrays (Bash 4+)
	- ## Indexed Arrays
	  collapsed:: true
		- ```bash
		  # Declare array
		  my_array=("apple" "banana" "cherry")
		  
		  # Add elements
		  my_array+=("date")
		  
		  # Access elements (Requires curly brackets)
		  echo "${my_array[0]}" # apple
		  
		  # Size of array
		  echo "${#my_array[@]}" # 4
		  
		  # List all indices
		  echo "${!my_array[@]}" # 0 1 2 3
		  
		  # Loop through array elements
		  for item in "${my_array[@]}"; do
		    echo "Fruit: $item"
		  done
		  ```
	-
	- ## Associative Arrays (Key-Value)
	  collapsed:: true
		- ```bash
		  # Declare associative array explicitly
		  declare -A user_ages
		  
		  user_ages["Alice"]=28
		  user_ages["Bob"]=34
		  
		  echo "${user_ages["Alice"]}" # 28
		  ```
-
- # Parameter Expansion
	- ## String Manipulations
	  collapsed:: true
		- ```bash
		  filename="report_2026.pdf"
		  
		  # Default Values
		  # Use default value if variable is empty or unset
		  echo "${user:-guest}" 
		  
		  # Substring Extraction: ${var:offset:length}
		  echo "${filename:0:6}" # report
		  
		  # String Length: ${#var}
		  echo "${#filename}" # 15
		  
		  # Pattern Substitution: ${var/pattern/replacement}
		  echo "${filename/2026/2027}" # report_2027.pdf
		  
		  # Stripping Prefixes/Suffixes
		  # % strips shortest matching suffix
		  # %% strips longest matching suffix
		  # # strips shortest matching prefix
		  # ## strips longest matching prefix
		  echo "${filename%.pdf}" # report_2026
		  path="/var/log/nginx/access.log"
		  echo "${path##*/}" # access.log (extracts file name)
		  echo "${path%/*}" # /var/log/nginx (extracts folder path)
		  ```
-
- # Standard Streams & Redirection
	- ## Redirection Operations
	  collapsed:: true
		- ```bash
		  # standard descriptors: stdin (0), stdout (1), stderr (2)
		  
		  # 1. Redirect stdout to file (overwrite)
		  echo "data" > output.txt
		  
		  # 2. Redirect stdout to file (append)
		  echo "more data" >> output.txt
		  
		  # 3. Redirect stderr to file
		  ls invalid_file 2> error.log
		  
		  # 4. Redirect stdout and stderr to same file
		  command > combined.log 2>&1
		  # Modern shorthand: command &> combined.log
		  
		  # 5. Piping (stdout of command 1 becomes stdin of command 2)
		  cat users.txt | grep "active" | cut -d',' -f1
		  ```
	-
	- ## Here Documents & Here Strings
	  collapsed:: true
		- ```bash
		  # Here Document (passing multi-line string block to command input)
		  cat <<EOF > index.html
		  <html>
		    <body><h1>My Server</h1></body>
		  </html>
		  EOF
		  
		  # Here String (passing single string variable to command input)
		  grep "pattern" <<< "$search_source_string"
		  ```
-
- # Arithmetic Operations
	- ## Evaluation Methods
	  collapsed:: true
		- ```bash
		  # 1. Double Parentheses (integers only)
		  x=10
		  y=5
		  sum=$((x + y))
		  ((x += 5)) # inline increment (no $ needed)
		  
		  # 2. Floating-Point Arithmetic (requires piping to 'bc')
		  float_result=$(echo "scale=2; 5 / 2" | bc) # 2.50
		  ```
-
- # File Test Operators
	- ## Checking Filesystem States
	  collapsed:: true
		- ```bash
		  file="data.json"
		  
		  [[ -e "$file" ]] && echo "File/Folder exists"
		  [[ -f "$file" ]] && echo "Is a regular file"
		  [[ -d "$file" ]] && echo "Is a directory"
		  [[ -s "$file" ]] && echo "Is non-empty (size > 0)"
		  [[ -r "$file" ]] && echo "File is readable"
		  [[ -w "$file" ]] && echo "File is writable"
		  [[ -x "$file" ]] && echo "File is executable"
		  ```
-
- # Error Handling & Debugging
	- ## Compiler/Interpreter Set Options
	  collapsed:: true
		- Placing these options at the top of scripts improves crash resiliency and debugging:
		- ```bash
		  set -e          # Exit script immediately if any command fails (non-zero status)
		  set -u          # Exit script immediately if an undeclared variable is accessed
		  set -o pipefail # Prevents errors in pipelines from being masked (returns status of last failing step)
		  set -x          # Print commands before execution (tracing execution flow in terminal)
		  
		  # Shorthand for robust scripting:
		  # set -euo pipefail
		  ```
-
- # Useful Command Line Utilities
	- [[awk]] - Pattern scanning and processing language for structured data fields.
	-
	- [[sed]] - Stream editor for filtering and transforming text stream.
	-
	- [[grep]] - Matches input strings against regular expression patterns.
	-
	- [[xargs]] - Build and execute command lines from standard input.
	-
	- [[find]] - Search for files in a directory hierarchy.
-
- # More Learn
	- Explore valuable resources for Shell Scripting:
		-
		- [Bash Academy](https://www.bash.academy/)
		- [ShellCheck (Static analysis tool)](https://www.shellcheck.net/)
		- [Advanced Bash-Scripting Guide (TLDP)](https://tldp.org/LDP/abs/html/)
		- [Bash Roadmap](https://github.com/mikesprague/bash-roadmap)
