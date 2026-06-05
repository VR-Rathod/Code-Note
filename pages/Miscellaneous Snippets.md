---
seoTitle: Miscellaneous Python Snippets
description: "A collection of quick python snippets for basic algorithms like factorial, frequency counting, leap year, and subarray sums."
keywords: "python snippets, array algorithms, basic algorithms, leap year, frequency count, factorial, VR-Rathod, Code-Note, code note vr, vr book"
treeTitle: DSA - Advanced Tips - Miscellaneous Snippets
---

- # Miscellaneous Python Snippets
	- Here are a few quick code snippets for basic, commonly needed operations in [[Python]] .
	- ## 1. Sum of Unique Elements
		- ```python
		  arr = [1, 1, 1, 2, 3, 6, 6, 2]
		  print(sum(set(arr)))
		  ```
	- ## 2. Factorial
		- ```python
		  def fact(v):
		      if v == 0 or v == 1:
		          return 1
		      return v * fact(v - 1)
		  
		  v = int(input("Enter number: "))
		  print(fact(v))
		  ```
	- ## 3. Frequency Count
		- ```python
		  from collections import Counter
		  
		  arr = [1, 2, 2, 3, 6, 5, 4, 6]
		  fre = Counter(arr)
		  
		  for key, value in fre.items():
		      print(f"{key} -> {value}")
		  ```
	- ## 4. Leap Year Check
		- ```python
		  def isleap(year):
		      return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
		      
		  year = int(input("Enter Year: "))
		  if isleap(year):
		      print(f"{year} is leap")
		  else:
		      print(f"{year} is not leap")
		  ```
	- ## 5. Min and Max in Array
		- ```python
		  arr = [1, 5, 4, 9, 3]
		  largest = small = arr[0]
		  
		  for num in arr:
		      if num > largest:
		          largest = num
		      if num < small:
		          small = num
		  
		  print("largest: ", largest, "smallest: ", small)
		  ```
	- ## 6. Arithmetic Progression (A.P) Sum
		- ```python
		  # sum = (n/2) * (2a + (n-1) * d)
		  n = 10
		  a = 2
		  d = 3
		  ap_sum = (n / 2) * (2 * a + (n - 1) * d)
		  print(ap_sum)
		  ```
	- ## 7. Target Sum Subarray
		- ```python
		  def find_subarrays_with_target_sum(arr, target):
		      n = len(arr)
		      result = []
		      
		      # Check all possible subarrays
		      for i in range(n):
		          current_sum = 0
		          for j in range(i, n):
		              current_sum += arr[j]
		              if current_sum == target:
		                  result.append(arr[i:j+1])
		                  
		      return result
		  
		  arr = [3, 4, -7, 1, 3, 3, 1, -4]
		  target = 7
		  subarrays = find_subarrays_with_target_sum(arr, target)
		  
		  for subarray in subarrays:
		      print(subarray)
		  ```