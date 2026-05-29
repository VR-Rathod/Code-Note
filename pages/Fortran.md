---
seoTitle: Fortran Programming Reference – Scientific Computing Guide
description: "Comprehensive Fortran reference covering modern syntax (Fortran 90/95/2003/2008), modules, arrays, allocatable structures, subroutines, functions, and high-performance numeric computation."
keywords: "Fortran, scientific computing, numerical analysis, array programming, subroutines, modules, MPI, coarrays, syntax reference, cheat sheet, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Fortran
---

- # History
	- **How**:
		- **Fortran** (Formula Translation) was created by a team at **IBM** led by **John Backus** in **1957**. It was the first commercial high-level programming language, designed to automate the translation of mathematical formulas into CPU machine instructions.
		- Evolved through major standards:
			- **Fortran IV / 66**: Standardized fixed-format coding.
			- **Fortran 77**: Introduced block `IF` structures, character string handling, and improved loops.
			- **Fortran 90**: A massive modernization adding free-format source code, modules, array operations, and dynamic memory allocation, making obsolete old fixed-column constraints.
			- **Fortran 95 / 2003 / 2008 / 2018**: Added Object-Oriented Programming, C interoperability, and **Coarrays** (native parallel computing model).
		- Today, Fortran remains the primary language for high-performance computing (HPC) fields like weather forecasting, computational physics, and molecular dynamics.
	-
	- **Who**:
		- **John Backus** (creator) and the IBM design team.
	-
	- **Why**:
		- Developed to bypass the tedious manual assembly programming of IBM 704 systems, allowing scientists to write math-like equations that compile into highly optimized executables.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Peak Array & Mathematical Performance** — Compiler optimizations for array indexing and math functions are exceptionally fast, outperforming C++ in raw numeric processing.
		- **Native Array Programming** — Operations can be performed directly on whole arrays or slices (e.g., `A = B + C`) without writing nested loops.
		- **Coarrays for Parallelism** — Standardized Partitioned Global Address Space (PGAS) model built into the language for native parallel computing across HPC clusters.
		- **Mature Scientific Ecosystem** — Relies on robust, battle-tested numerical libraries like BLAS, LAPACK, and FFTW.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Poor General-Purpose Scripting** — Limited and clunky facilities for string parsing, systems networking, and graphical user interfaces.
		- **Legacy Codebases** — Many active scientific codes are still written in legacy fixed-format Fortran 77, which is difficult to read and maintain.
		- **Weak Ecosystem Outside Math** — Few packages for modern web API integration or web application development.
	-
	- ## Remember Points
	  collapsed:: true
		- **Use implicit none** — Always declare `implicit none` at the top of program units to turn off legacy default variable typing (where variables starting with I-N were implicitly integers, others reals).
		- **1-based Array Indexing** — Arrays are index-1 base by default (`1` to `N`).
		- **Case-Insensitive** — `PROGRAM`, `program`, and `ProGram` are treated exactly the same.
-
- # Basics
	- ## Hello World & Entry Point
		- ```fortran
		  program hello
		    implicit none ! Turns off legacy implicit typing rules
		    
		    print *, "Hello, World!"
		  end program hello
		  ```
		- `program name` declares the entry unit name.
		- `implicit none` forces explicit variable declarations.
		- `print *,` prints the output list to console (asterisk signifies default format).
	-
	- ## Variables and Data Types
		- ```fortran
		  program variables
		    implicit none
		    
		    ! Primitive Declarations
		    integer :: age = 25
		    real :: temperature = 98.6
		    double precision :: pi = 3.141592653589793d0 -- Double format suffix
		    complex :: coord = (2.0, 4.5) -- Complex number representation (2.0 + 4.5i)
		    logical :: is_active = .true. -- .true. or .false.
		    character(len=20) :: name = "VR Rathod"
		    
		    ! Constants
		    real, parameter :: tax_rate = 0.18
		  end program variables
		  ```
-
- # Control Flow
	- ## Conditional Expressions
	  collapsed:: true
		- ```fortran
		  if (score >= 90) then
		    print *, "Grade A"
		  else if (score >= 80) then
		    print *, "Grade B"
		  else
		    print *, "Grade F"
		  end if
		  
		  ! Select Case (Switch equivalent)
		  select case (month)
		    case (1, 2, 12)
		      print *, "Winter"
		    case (3:5) -- Range checks
		      print *, "Spring"
		    case default
		      print *, "Other"
		  end select
		  ```
	-
	- ## Loops
	  collapsed:: true
		- ```fortran
		  ! 1. Standard Counted Do Loop
		  do i = 1, 5
		    print *, "Iteration: ", i
		  end do
		  
		  ! 2. Do While Loop
		  do while (counter < 3)
		    print *, counter
		    counter = counter + 1
		  end do
		  
		  ! 3. Loop controls: cycle (continue) and exit (break)
		  do i = 1, 10
		    if (i == 3) cycle -- Skip iteration
		    if (i == 7) exit  -- Exit loop
		    print *, i
		  end do
		  
		  ! 4. Concurrent Loop (Parallel execution hint)
		  do concurrent (i = 1:size_arr)
		    arr(i) = arr(i) * 2.0
		  end do
		  ```
-
- # Functions & Subroutines
	- ## Subroutines (Pass by reference)
	  collapsed:: true
		- Subroutines perform tasks but do not return values directly. Arguments are passed by reference:
		- ```fortran
		  subroutine calculate_sum(a, b, result)
		    implicit none
		    real, intent(in)  :: a -- Argument cannot be modified
		    real, intent(in)  :: b
		    real, intent(out) :: result -- Return output variable
		    
		    result = a + b
		  end subroutine calculate_sum
		  
		  ! Invoking subroutine:
		  ! call calculate_sum(5.0, 10.0, res)
		  ```
	-
	- ## Functions
	  collapsed:: true
		- Functions compute and return a single value:
		- ```fortran
		  real function square(val)
		    implicit none
		    real, intent(in) :: val
		    
		    square = val * val -- Assign result to function name
		  end function square
		  
		  ! pure functions: guaranteed to have no side effects (highly optimized)
		  pure real function add_pure(x, y)
		    real, intent(in) :: x, y
		    add_pure = x + y
		  end function add_pure
		  ```
-
- # Arrays & Slicing
	- ## 1D/2D Array Operations
	  collapsed:: true
		- ```fortran
		  ! Fixed size arrays
		  real :: matrix(3, 3) -- 2D 3x3 array (Column-major order in memory!)
		  
		  ! Allocatable (Dynamic) Arrays
		  real, allocatable :: d_arr(:)
		  allocate(d_arr(100)) -- allocate memory size
		  
		  if (allocated(d_arr)) then
		    deallocate(d_arr) -- free memory
		  end if
		  
		  ! Array-valued operations (no loops required!)
		  d_arr = 0.0 -- sets all elements to 0
		  
		  ! Array Slicing (Triplet notation: start:end:stride)
		  matrix(1, :) = 1.0       -- sets entire first row to 1.0
		  d_arr(1:10:2) = 5.0     -- sets elements 1,3,5,7,9 to 5.0
		  ```
-
- # Derived Types (Structs)
	- ## Declaring Custom Types
	  collapsed:: true
		- ```fortran
		  type :: Point
		    real :: x
		    real :: y
		  end type Point
		  
		  ! Instantiate and access fields (uses % operator)
		  type(Point) :: p1
		  p1%x = 10.0
		  p1%y = 20.0
		  
		  ! Nested derived values
		  p1 = Point(5.0, 6.0)
		  ```
-
- # Modules
	- ## Modular Encapsulation
	  collapsed:: true
		- Modules group related subroutines, functions, and types:
		- ```fortran
		  ! math_mod.f90
		  module math_mod
		    implicit none
		    private -- default variables private
		    public :: pi, double_val -- explicit public exports
		    
		    real, parameter :: pi = 3.14159265
		    
		  contains
		    real function double_val(x)
		      real, intent(in) :: x
		      double_val = x * 2.0
		    end function double_val
		  end module math_mod
		  ```
		- Usage:
		- ```fortran
		  program test
		    use math_mod, only : pi, double_val -- import specific members
		    implicit none
		    
		    print *, double_val(pi)
		  end program test
		  ```
-
- # Coarrays (Native Parallelism)
	- ## Parallel PGAS execution
	  collapsed:: true
		- Coarrays treat parallel instances (images) as distinct nodes. Square brackets `[ ]` reference data on other images.
		- ```fortran
		  program parallel_sum
		    implicit none
		    integer :: value[*] -- Coarray variable (available on all images)
		    integer :: img, num_imgs
		    
		    img = this_image() -- Get ID of current execution image
		    num_imgs = num_images() -- Get total number of active images
		    
		    value = img * 10
		    
		    sync all -- Barrier synchronization point
		    
		    if (img == 1) then
		      ! Read value from image 2 and print
		      print *, "Image 2 value is: ", value[2]
		    end if
		  end program parallel_sum
		  ```
-
- # Compilation & Package Managers
	- ## Compiler Tools
		- **gfortran**: Part of the GNU Compiler Collection (standard open-source compiler).
		- **fpm**: Modern Fortran Package Manager (automates build dependencies, similar to Cargo).
		- ```bash
		  # Compile program using gfortran
		  gfortran -O3 main.f90 -o app
		  
		  # Run program
		  ./app
		  
		  # Build project using fpm
		  fpm build
		  fpm run
		  ```
-
- # More Learn
	- Explore valuable resources for Fortran:
		-
		- [Fortran-lang.org (Modern tutorials)](https://fortran-lang.org/)
		- [Fortran Package Manager (fpm)](https://fpm.fortran-lang.org/)
		- [Fortran Wiki](http://fortranwiki.org/)
		- [Learn Modern Fortran (GitHub)](https://github.com/fortran-lang/fortran-forum)
