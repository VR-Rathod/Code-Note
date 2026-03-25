---
seoTitle: Palindrome Algorithms – Detection, Counting, and Longest Substring
description: "Explore palindrome detection, counting palindromic substrings, and finding the longest palindrome. Covers dynamic programming, Manacher's algorithm, and."
keywords: "palindrome, palindrome detection, longest palindromic substring, dynamic programming, two pointers, Manacher algorithm, time complexity, space complexity, string algorithm"
---

- ```python
  # sum
  arr= [1,1,1,2,3,6,6,2]
  print(sum(set(arr)))
  
  
  # palidrome
  v = input()
  print(v == v[::-1])
  
  # reverse
  v = input()
  print(v[::-1])
  
  # factorail
  v = int(input())
  
  def feact(v):
    if v == 0 or v == 1:
      return 1
    return v * feact(v - 1)
  
  print(feact(v))
  
  # frequency coutn
  
  from collections import Counter
  arr = [1,2,2,3,6,5,4,6]
  
  fre = Counter(arr)
  
  for key, value in fre.items():
    print{f"{key} -> {value}"}
    
  # leap yer or not
  def isleap(year):
    return year % 4 == 0 (year % 100 != 0 or year % 400 == 0)
    
  year = int(input("Enter Your Year"))
  
  if isleap(year):
    print(f"{year} is leap")
  else:
    print(F"{year is not leap}")
  
    # min max in array
    
  arr = [1,5,4,9,3]
  
  largest = small = arr[0]
  
  for num in arr:
    if num > large:
      large = num
    if num < small:
      small = num
  
  print("lager: " largest , "smallest: ", small)
  
  # A.P Series
  
  sum = (n/2) * (2a (n-1) * d)
  print(sum)
  
  # even or odd
  
  num = int(input("Enter number: "))
  
  if num % 2 == 0:
    print("even")
  else:
    print("odd")
    
  # incre-decri arr
  def inc_dec(arr):
    arr.sort()
    return arr[:len(arr)//2 + 1] + arr[len(arr)//2 +1:][::-1]
  
  arr = [8,7,9,1,6,5]
  prient(inc_dec(arr))
  
  
  # taget sum
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
  
  # Given array and target sum
  arr = [3, 4, -7, 1, 3, 3, 1, -4]
  target = 7
  subarrays = find_subarrays_with_target_sum(arr, target)
  
  # Display the result
  for subarray in subarrays:
      print(subarray)
  
  ```