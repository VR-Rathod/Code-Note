---
date: 2026-04-08T11:19:07+05:30
lastmod: 2026-05-18T10:12:55+05:30

seoTitle: Eigen – C++ Linear Algebra Library Complete Reference
description: "Eigen is a C++ template library for linear algebra. Covers matrices, vectors, decompositions, solvers, geometry transforms, and use in ML and scientific computing."
keywords: "Eigen, C++ linear algebra, matrix library, vector math, LU decomposition, SVD, Eigen3, scientific computing, machine learning, template library, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Eigen
---

- # History
  collapsed:: true
	- **Who**: Developed by Benoît Jacob and Gaël Guennebaud, with contributions from the open-source community.
	- **Why**: To provide a high-performance, expression-template-based linear algebra library for C++ that rivals BLAS/LAPACK in performance while being easy to use.
	- **When**: First released in 2006. Eigen 3 (current major version) released in 2010.
- # Introduction
  collapsed:: true
	- ## What is Eigen?
		- A header-only C++ template library for linear algebra: matrices, vectors, numerical solvers, and related algorithms.
		- Used in robotics (ROS), computer vision (OpenCV), machine learning (TensorFlow internals), and scientific computing.
		- Website: [eigen.tuxfamily.org](https://eigen.tuxfamily.org/)
	-
	- ## Advantages
	  collapsed:: true
		- Header-only — just include and use.
		- Extremely fast — uses SIMD vectorization and expression templates (lazy evaluation).
		- Clean, intuitive API similar to MATLAB notation.
		- Supports fixed-size and dynamic-size matrices.
		- Rich decompositions: LU, QR, SVD, Cholesky, Eigenvalue.
	-
	- ## Disadvantages
	  collapsed:: true
		- Template-heavy — can produce long compiler error messages.
		- Fixed-size matrices must have sizes known at compile time.
		- Large headers can slow compilation.
- # Installation & Setup
  collapsed:: true
	- ## apt (Ubuntu)
		- ```bash
		  sudo apt install libeigen3-dev
		  ```
	-
	- ## vcpkg
		- ```bash
		  vcpkg install eigen3
		  ```
	-
	- ## CMake
		- ```cmake
		  find_package(Eigen3 REQUIRED)
		  target_link_libraries(MyApp Eigen3::Eigen)
		  ```
	-
	- ## Include
		- ```cpp
		  #include <Eigen/Dense>   // matrices, vectors, decompositions
		  #include <Eigen/Sparse>  // sparse matrices
		  using namespace Eigen;
		  ```
- # Core Concepts
  collapsed:: true
	- ## Matrix & Vector Types
	  collapsed:: true
		- ```cpp
		  #include <Eigen/Dense>
		  using namespace Eigen;
		  
		  // Fixed-size (compile-time dimensions — fastest)
		  Matrix3f  m3f;   // 3x3 float matrix
		  Matrix4d  m4d;   // 4x4 double matrix
		  Vector3f  v3f;   // 3D float column vector
		  Vector4d  v4d;   // 4D double column vector
		  RowVector3f rv;  // 3D float row vector
		  
		  // Dynamic-size (runtime dimensions)
		  MatrixXd  md(4, 4);  // dynamic double matrix
		  VectorXd  vd(10);    // dynamic double vector
		  MatrixXf  mf(3, 5);  // 3x5 float matrix
		  
		  // Common aliases
		  // Matrix<Scalar, Rows, Cols>
		  Matrix<double, 3, 3> m;  // same as Matrix3d
		  Matrix<float, Dynamic, Dynamic> dm(5, 5);
		  ```
	-
	- ## Initialization
	  collapsed:: true
		- ```cpp
		  Matrix3d m;
		  m << 1, 2, 3,
		       4, 5, 6,
		       7, 8, 9;
		  
		  // Special matrices
		  Matrix3d zeros = Matrix3d::Zero();
		  Matrix3d ones  = Matrix3d::Ones();
		  Matrix3d eye   = Matrix3d::Identity();
		  Matrix3d rand  = Matrix3d::Random();  // values in [-1, 1]
		  
		  Vector3d v;
		  v << 1.0, 2.0, 3.0;
		  
		  // Fill
		  MatrixXd m2 = MatrixXd::Constant(3, 3, 5.0); // all 5.0
		  ```
	-
	- ## Basic Operations
	  collapsed:: true
		- ```cpp
		  Matrix3d a = Matrix3d::Random();
		  Matrix3d b = Matrix3d::Random();
		  
		  Matrix3d sum  = a + b;
		  Matrix3d diff = a - b;
		  Matrix3d prod = a * b;       // matrix multiplication
		  Matrix3d scaled = a * 2.0;
		  
		  // Element-wise operations
		  Matrix3d ew_prod = a.cwiseProduct(b);  // element-wise multiply
		  Matrix3d ew_div  = a.cwiseQuotient(b); // element-wise divide
		  Matrix3d ew_abs  = a.cwiseAbs();
		  
		  // Transpose & inverse
		  Matrix3d t = a.transpose();
		  Matrix3d inv = a.inverse();
		  
		  // Determinant & trace
		  double det   = a.determinant();
		  double trace = a.trace();
		  ```
	-
	- ## Vector Operations
	  collapsed:: true
		- ```cpp
		  Vector3d u(1, 0, 0);
		  Vector3d v(0, 1, 0);
		  
		  double dot   = u.dot(v);          // 0.0
		  Vector3d cross = u.cross(v);      // (0, 0, 1)
		  double norm  = u.norm();          // 1.0
		  Vector3d unit = u.normalized();   // unit vector
		  
		  // Squared norm (faster — avoids sqrt)
		  double norm2 = u.squaredNorm();
		  ```
- # Accessing Elements
  collapsed:: true
	- ```cpp
	  MatrixXd m(3, 3);
	  m << 1, 2, 3,
	       4, 5, 6,
	       7, 8, 9;
	  
	  double val = m(1, 2);    // row 1, col 2 → 6
	  m(0, 0) = 99;
	  
	  // Block access
	  MatrixXd top_left = m.block(0, 0, 2, 2);  // 2x2 top-left block
	  VectorXd col1 = m.col(1);                  // column 1
	  VectorXd row0 = m.row(0);                  // row 0
	  
	  // Head/tail for vectors
	  VectorXd v(6);
	  v << 1, 2, 3, 4, 5, 6;
	  VectorXd first3 = v.head(3);  // [1, 2, 3]
	  VectorXd last2  = v.tail(2);  // [5, 6]
	  VectorXd mid    = v.segment(1, 3); // [2, 3, 4]
	  ```
- # Decompositions & Solvers
  collapsed:: true
	- ## Solving Linear Systems (Ax = b)
	  collapsed:: true
		- ```cpp
		  MatrixXd A(3, 3);
		  A << 2, 1, -1,
		       -3, -1, 2,
		       -2, 1, 2;
		  
		  VectorXd b(3);
		  b << 8, -11, -3;
		  
		  // LU decomposition (general matrices)
		  VectorXd x = A.lu().solve(b);
		  std::cout << x.transpose(); // solution vector
		  
		  // Verify: A*x ≈ b
		  std::cout << (A * x - b).norm(); // should be ~0
		  ```
	-
	- ## Common Decompositions
	  collapsed:: true
		- ```cpp
		  MatrixXd A = MatrixXd::Random(4, 4);
		  
		  // LU (PartialPivLU — fast, general)
		  PartialPivLU<MatrixXd> lu(A);
		  
		  // QR (HouseholderQR — stable)
		  HouseholderQR<MatrixXd> qr(A);
		  MatrixXd Q = qr.householderQ();
		  
		  // SVD (JacobiSVD — accurate, slower)
		  JacobiSVD<MatrixXd> svd(A, ComputeThinU | ComputeThinV);
		  VectorXd singular_values = svd.singularValues();
		  
		  // Eigenvalue decomposition (symmetric)
		  SelfAdjointEigenSolver<MatrixXd> eig(A.transpose() * A);
		  VectorXd eigenvalues = eig.eigenvalues();
		  MatrixXd eigenvectors = eig.eigenvectors();
		  
		  // Cholesky (symmetric positive definite)
		  LLT<MatrixXd> llt(A.transpose() * A);
		  VectorXd x = llt.solve(b);
		  ```
- # Geometry (Eigen/Geometry)
  collapsed:: true
	- ```cpp
	  #include <Eigen/Geometry>
	  
	  // 3D rotation
	  AngleAxisd rot(M_PI / 4, Vector3d::UnitZ()); // 45° around Z
	  Matrix3d R = rot.toRotationMatrix();
	  
	  // Quaternion
	  Quaterniond q = Quaterniond(rot);
	  q.normalize();
	  Vector3d v(1, 0, 0);
	  Vector3d rotated = q * v;
	  
	  // Translation + Rotation (Isometry3d = rigid transform)
	  Isometry3d T = Isometry3d::Identity();
	  T.rotate(rot);
	  T.translate(Vector3d(1, 2, 3));
	  
	  Vector3d p(0, 0, 0);
	  Vector3d transformed = T * p;
	  ```
- # More Learn
	- [Eigen Official Docs](https://eigen.tuxfamily.org/dox/)
	- [Eigen Quick Reference](https://eigen.tuxfamily.org/dox/group__QuickRefPage.html)
	- [Eigen and OpenCV](https://docs.opencv.org/master/d7/d9f/tutorial_linux_install.html)