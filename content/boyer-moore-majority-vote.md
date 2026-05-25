---
date: 2026-03-24T17:12:17+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Boyer-Moore Majority Vote Algorithm – Linear Time Solution
description: "Boyer-Moore majority vote finds the majority element in O(n) time and O(1) space. Learn the candidate selection phase, verification phase, and practical."
keywords: "Boyer-Moore majority vote, majority element, linear time, O(n), O(1) space, voting algorithm, array algorithm, time complexity, space complexity, streaming algorithm"
---

- # Explanation
	- The Boyer-Moore Majority Vote Algorithm is used to find the **majority element** (the element that appears more than n/2 times) in an array.
-
- # Steps
	- Initialize a `candidate` and a `count`.
	-
	- Traverse the array. If the `count` is 0, set the `candidate` to the current element.
	-
	- If the current element is the same as the `candidate`, increment `count`; otherwise, decrement `count`.
	-
	- After the traversal, the `candidate` is the majority element.
-
- # Time Complexity
	- **O(n)**, where `n` is the number of elements in the array.
-
- ```python
  def boyer_moore(arr):
      candidate = None
      count = 0
      for num in arr:
          if count == 0:
              candidate = num
          count += (1 if num == candidate else -1)
      return candidate
  
  # Example usage
  arr = [3, 3, 4, 2, 4, 4, 2, 4, 4]
  print("Majority element:", boyer_moore(arr))
  ```