---
seoTitle: Two Pointers Technique – Linear Array Search In-Depth Guide
description: "Complete guide to the Two Pointers Technique for arrays and strings. Covers opposite-direction and same-direction patterns, sorted array pair sum, three sum, palindrome, container with most water, trapping rain water, and implementations in Python, C++, Java, JavaScript, and C#."
keywords: "two pointers, two pointer technique, opposite pointers, pair sum, three sum, palindrome, container most water, trapping rain water, O(N), array, VR-Rathod, Code-Note, code note vr"
displayTitle: Two Pointers Technique
---

> [!info] What is the Two Pointers Technique?
> The **Two Pointers Technique** uses two index variables that traverse a data structure (usually a sorted array or string) from different positions. By moving the pointers based on conditions, it eliminates the need for a nested loop — reducing O(N²) solutions to **O(N)**.

- # Explanation
  collapsed:: true
	- ## Two Patterns
	  collapsed:: true
		- ### Pattern 1 — Opposite Direction (Converging)
		  ```
		  left = 0                right = N−1
		    │                          │
		    └──────────────────────────┘
		               converge
		  
		  Move left  →  if condition is "too small"
		  Move right ←  if condition is "too large"
		  Stop when left >= right
		  ```
		- Use for: **pair sum**, **palindrome check**, **container with most water**, **trapping rain water**
		-
		- ### Pattern 2 — Same Direction (Fast/Slow or Window)
		  ```
		  slow = 0
		  fast = 0  →  →  →
		  
		  fast explores, slow records valid positions
		  ```
		- Use for: **remove duplicates in-place**, **move zeroes**, **partition arrays**
	-
	- ## Why Does It Work?
	  collapsed:: true
		- For **sorted arrays**: if `arr[left] + arr[right] < target`, increasing `left` is the only way to get a bigger sum (since the array is sorted). Similarly decreasing `right` makes it smaller. Each pointer only moves **inward** — so total moves ≤ N.
		- Key requirement: the array must be **sorted** (or the condition must guarantee monotonicity).
	-
	- ## Complexity
	  collapsed:: true
		- | | Value |
		  |---|---|
		  | **Time** | O(N) after sorting; O(N log N) if sorting required |
		  | **Space** | O(1) — in-place pointer movement |

- # Implementation
  collapsed:: true
	- > [!note] Four classic problems: Pair Sum, Three Sum, Palindrome, Container With Most Water, and Trapping Rain Water.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  
	  # ══════════════════════════════════════════════════════
	  # 1. Two Sum II (sorted array) — find pair summing to target
	  # ══════════════════════════════════════════════════════
	  def two_sum_sorted(nums: list[int], target: int) -> tuple[int, int]:
	      left, right = 0, len(nums) - 1
	      while left < right:
	          s = nums[left] + nums[right]
	          if s == target:   return left, right
	          elif s < target:  left  += 1   # Sum too small → move left right
	          else:             right -= 1   # Sum too large → move right left
	      return -1, -1
	  
	  print(two_sum_sorted([1, 2, 3, 4, 6], 6))   # (1, 3) → nums[1]+nums[3]=2+4=6
	  
	  # ══════════════════════════════════════════════════════
	  # 2. Three Sum — find all unique triplets summing to 0
	  # ══════════════════════════════════════════════════════
	  def three_sum(nums: list[int]) -> list[list[int]]:
	      nums.sort()
	      result = []
	      for i in range(len(nums) - 2):
	          if i > 0 and nums[i] == nums[i-1]: continue   # Skip duplicates
	          left, right = i + 1, len(nums) - 1
	          while left < right:
	              s = nums[i] + nums[left] + nums[right]
	              if s == 0:
	                  result.append([nums[i], nums[left], nums[right]])
	                  while left < right and nums[left]  == nums[left+1]:  left  += 1
	                  while left < right and nums[right] == nums[right-1]: right -= 1
	                  left += 1;  right -= 1
	              elif s < 0: left  += 1
	              else:       right -= 1
	      return result
	  
	  print(three_sum([-1, 0, 1, 2, -1, -4]))   # [[-1,-1,2],[-1,0,1]]
	  
	  # ══════════════════════════════════════════════════════
	  # 3. Palindrome Check
	  # ══════════════════════════════════════════════════════
	  def is_palindrome(s: str) -> bool:
	      left, right = 0, len(s) - 1
	      while left < right:
	          if s[left] != s[right]: return False
	          left += 1;  right -= 1
	      return True
	  
	  print(is_palindrome("racecar"))   # True
	  print(is_palindrome("hello"))     # False
	  
	  # ══════════════════════════════════════════════════════
	  # 4. Container With Most Water (LeetCode 11)
	  # ══════════════════════════════════════════════════════
	  def max_water(height: list[int]) -> int:
	      left, right = 0, len(height) - 1
	      max_area = 0
	      while left < right:
	          area = min(height[left], height[right]) * (right - left)
	          max_area = max(max_area, area)
	          # Move the shorter side inward — keeping the taller side maximises width potential
	          if height[left] < height[right]: left  += 1
	          else:                            right -= 1
	      return max_area
	  
	  print(max_water([1, 8, 6, 2, 5, 4, 8, 3, 7]))   # 49
	  
	  # ══════════════════════════════════════════════════════
	  # 5. Trapping Rain Water (LeetCode 42)
	  # ══════════════════════════════════════════════════════
	  def trap(height: list[int]) -> int:
	      left, right = 0, len(height) - 1
	      left_max = right_max = water = 0
	      while left < right:
	          if height[left] < height[right]:
	              left_max = max(left_max, height[left])
	              water += left_max - height[left]
	              left += 1
	          else:
	              right_max = max(right_max, height[right])
	              water += right_max - height[right]
	              right -= 1
	      return water
	  
	  print(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]))   # 6
	  
	  # ══════════════════════════════════════════════════════
	  # 6. Remove Duplicates In-Place (same-direction pointers)
	  # ══════════════════════════════════════════════════════
	  def remove_duplicates(nums: list[int]) -> int:
	      if not nums: return 0
	      slow = 0
	      for fast in range(1, len(nums)):
	          if nums[fast] != nums[slow]:
	              slow += 1
	              nums[slow] = nums[fast]
	      return slow + 1   # New length
	  
	  arr = [1, 1, 2, 2, 3, 4, 4, 5]
	  length = remove_duplicates(arr)
	  print(arr[:length])   # [1, 2, 3, 4, 5]
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <vector>
	  #include <algorithm>
	  
	  // 1. Two Sum (sorted)
	  std::pair<int,int> twoSum(std::vector<int>& nums, int target) {
	      int left = 0, right = (int)nums.size() - 1;
	      while (left < right) {
	          int s = nums[left] + nums[right];
	          if      (s == target) return {left, right};
	          else if (s < target)  ++left;
	          else                  --right;
	      }
	      return {-1, -1};
	  }
	  
	  // 2. Three Sum
	  std::vector<std::vector<int>> threeSum(std::vector<int> nums) {
	      std::sort(nums.begin(), nums.end());
	      std::vector<std::vector<int>> res;
	      for (int i = 0; i < (int)nums.size() - 2; ++i) {
	          if (i > 0 && nums[i] == nums[i-1]) continue;
	          int l = i+1, r = (int)nums.size()-1;
	          while (l < r) {
	              int s = nums[i]+nums[l]+nums[r];
	              if      (s == 0) { res.push_back({nums[i],nums[l],nums[r]}); ++l; --r; }
	              else if (s < 0) ++l;
	              else            --r;
	          }
	      }
	      return res;
	  }
	  
	  // 3. Container With Most Water
	  int maxWater(std::vector<int>& h) {
	      int l = 0, r = (int)h.size()-1, best = 0;
	      while (l < r) {
	          best = std::max(best, std::min(h[l],h[r]) * (r-l));
	          (h[l] < h[r]) ? ++l : --r;
	      }
	      return best;
	  }
	  
	  // 4. Trapping Rain Water
	  int trap(std::vector<int>& h) {
	      int l=0, r=(int)h.size()-1, lmax=0, rmax=0, water=0;
	      while (l < r) {
	          if (h[l] < h[r]) { lmax = std::max(lmax, h[l]); water += lmax-h[l]; ++l; }
	          else             { rmax = std::max(rmax, h[r]); water += rmax-h[r]; --r; }
	      }
	      return water;
	  }
	  
	  int main() {
	      std::vector<int> arr = {1,2,3,4,6};
	      auto [a,b] = twoSum(arr, 6);
	      std::cout << "Two Sum: " << a << ", " << b << "\n"; // 1, 3
	  
	      std::vector<int> h1 = {1,8,6,2,5,4,8,3,7};
	      std::cout << "Max Water: " << maxWater(h1) << "\n"; // 49
	  
	      std::vector<int> h2 = {0,1,0,2,1,0,1,3,2,1,2,1};
	      std::cout << "Trapped: " << trap(h2) << "\n";       // 6
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  class TwoPointers {
	  
	      // 1. Two Sum sorted
	      static int[] twoSum(int[] nums, int target) {
	          int l = 0, r = nums.length - 1;
	          while (l < r) {
	              int s = nums[l] + nums[r];
	              if      (s == target) return new int[]{l, r};
	              else if (s < target)  l++;
	              else                  r--;
	          }
	          return new int[]{-1,-1};
	      }
	  
	      // 2. Container With Most Water
	      static int maxWater(int[] h) {
	          int l = 0, r = h.length-1, best = 0;
	          while (l < r) {
	              best = Math.max(best, Math.min(h[l],h[r]) * (r-l));
	              if (h[l] < h[r]) l++; else r--;
	          }
	          return best;
	      }
	  
	      // 3. Trapping Rain Water
	      static int trap(int[] h) {
	          int l=0, r=h.length-1, lmax=0, rmax=0, water=0;
	          while (l < r) {
	              if (h[l] < h[r]) { lmax=Math.max(lmax,h[l]); water+=lmax-h[l]; l++; }
	              else             { rmax=Math.max(rmax,h[r]); water+=rmax-h[r]; r--; }
	          }
	          return water;
	      }
	  
	      // 4. Remove Duplicates In-Place
	      static int removeDups(int[] nums) {
	          int slow = 0;
	          for (int fast = 1; fast < nums.length; fast++)
	              if (nums[fast] != nums[slow]) nums[++slow] = nums[fast];
	          return slow + 1;
	      }
	  
	      public static void main(String[] args) {
	          System.out.println(Arrays.toString(twoSum(new int[]{1,2,3,4,6}, 6))); // [1, 3]
	          System.out.println(maxWater(new int[]{1,8,6,2,5,4,8,3,7}));          // 49
	          System.out.println(trap(new int[]{0,1,0,2,1,0,1,3,2,1,2,1}));        // 6
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  
	  // 1. Two Sum (sorted)
	  function twoSum(nums, target) {
	      let [l, r] = [0, nums.length - 1];
	      while (l < r) {
	          const s = nums[l] + nums[r];
	          if      (s === target) return [l, r];
	          else if (s < target)   l++;
	          else                   r--;
	      }
	      return null;
	  }
	  console.log(twoSum([1, 2, 3, 4, 6], 6));   // [1, 3]
	  
	  // 2. Three Sum
	  function threeSum(nums) {
	      nums.sort((a, b) => a - b);
	      const res = [];
	      for (let i = 0; i < nums.length - 2; i++) {
	          if (i > 0 && nums[i] === nums[i-1]) continue;
	          let [l, r] = [i + 1, nums.length - 1];
	          while (l < r) {
	              const s = nums[i] + nums[l] + nums[r];
	              if      (s === 0) { res.push([nums[i], nums[l], nums[r]]); l++; r--; }
	              else if (s < 0)   l++;
	              else               r--;
	          }
	      }
	      return res;
	  }
	  console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1,-1,2],[-1,0,1]]
	  
	  // 3. Trapping Rain Water
	  function trap(h) {
	      let [l, r, lmax, rmax, water] = [0, h.length-1, 0, 0, 0];
	      while (l < r) {
	          if (h[l] < h[r]) { lmax = Math.max(lmax, h[l]); water += lmax - h[l]; l++; }
	          else             { rmax = Math.max(rmax, h[r]); water += rmax - h[r]; r--; }
	      }
	      return water;
	  }
	  console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1]));  // 6
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  
	  class TwoPointers {
	      static int[] TwoSum(int[] nums, int target) {
	          int l = 0, r = nums.Length - 1;
	          while (l < r) {
	              int s = nums[l] + nums[r];
	              if      (s == target) return new[]{l, r};
	              else if (s < target)  l++;
	              else                  r--;
	          }
	          return Array.Empty<int>();
	      }
	  
	      static int MaxWater(int[] h) {
	          int l = 0, r = h.Length-1, best = 0;
	          while (l < r) {
	              best = Math.Max(best, Math.Min(h[l],h[r]) * (r-l));
	              if (h[l] < h[r]) l++; else r--;
	          }
	          return best;
	      }
	  
	      static int Trap(int[] h) {
	          int l=0, r=h.Length-1, lmax=0, rmax=0, water=0;
	          while (l < r) {
	              if (h[l] < h[r]) { lmax=Math.Max(lmax,h[l]); water+=lmax-h[l]; l++; }
	              else             { rmax=Math.Max(rmax,h[r]); water+=rmax-h[r]; r--; }
	          }
	          return water;
	      }
	  
	      static void Main() {
	          Console.WriteLine(string.Join(",", TwoSum(new[]{1,2,3,4,6}, 6)));     // 1,3
	          Console.WriteLine(MaxWater(new[]{1,8,6,2,5,4,8,3,7}));               // 49
	          Console.WriteLine(Trap(new[]{0,1,0,2,1,0,1,3,2,1,2,1}));             // 6
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- **Two patterns:** Opposite-direction (converging) for pair problems; Same-direction (fast/slow) for partition/removal problems.
	- Works in O(N) because each pointer moves **at most N times total** — no nested loops.
	- Requires **sorted array** for opposite-direction approach (or inherent monotonicity).
	- **Trapping Rain Water** is the canonical hard problem — two pointers track left/right max water levels simultaneously.
	- Related: [[Sliding Window Technique]], [[Kadane's Algorithm]], [[Prefix Sum Array]]

- # More Learn
  collapsed:: true
	- ## LeetCode Problems
		- [LeetCode 167 – Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)
		- [LeetCode 15 – 3Sum](https://leetcode.com/problems/3sum/)
		- [LeetCode 11 – Container With Most Water](https://leetcode.com/problems/container-with-most-water/)
		- [LeetCode 42 – Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)
