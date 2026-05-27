---
seoTitle: Boyer-Moore Majority Vote Algorithm – Find Majority Element in O(N) O(1)
description: "Complete guide to the Boyer-Moore Majority Vote Algorithm. Covers majority element (>N/2), extended N/3 variant, two-pass confirmation, and implementations in Python, C++, Java, JavaScript, and C#."
keywords: "Boyer-Moore majority vote, majority element, voting algorithm, O(N) O(1), candidate tracking, N/3 variant, array, VR-Rathod, Code-Note, code note vr"
displayTitle: Boyer More Majority Vote
---

> [!info] What is the Boyer-Moore Majority Vote Algorithm?
> The **Boyer-Moore Majority Vote Algorithm** finds the **majority element** (appearing more than ⌊N/2⌋ times) in an array using **O(N) time and O(1) space** — no sorting, no hash map. It works by cancelling pairs of different elements, so the majority element always survives.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine an election 🗳️ where voters shout their candidate. The rule is:
		  - Every time two different candidates "clash", one vote from each is cancelled.
		  - At the end, whoever is left standing is the **majority candidate**.
		  - This works only if a true majority (> N/2 votes) exists — otherwise the survivor needs a second verification pass.
	-
	- ## The Algorithm (2 passes)
	  collapsed:: true
		- **Pass 1 — Find the Candidate:**
		  ```
		  candidate = None
		  count      = 0
		  
		  for each num:
		      if count == 0:
		          candidate = num     ← start a new candidate
		      if num == candidate:
		          count++             ← reinforce
		      else:
		          count--             ← cancel one pair
		  ```
		- **Pass 2 — Verify:**
		  ```
		  count occurrences of candidate in original array
		  if occurrences > N/2 → return candidate
		  else                 → no majority exists
		  ```
		- **Why it works:** The majority element appears > N/2 times. Every time it gets cancelled, a different element also disappears. Since majority > all others combined, the majority always has a positive net count.
	-
	- ## Edge Cases
	  collapsed:: true
		- | Case | Behaviour |
		  |---|---|
		  | No majority exists | Pass 1 gives a survivor, Pass 2 confirms it's false → return None |
		  | All elements same | Returns that element |
		  | Single element | Returns that element |
		  | Two different halves | No majority — e.g. `[1,1,2,2]` |
	-
	- ## Complexity
	  collapsed:: true
		- | | Value |
		  |---|---|
		  | **Time** | O(N) — two passes at most |
		  | **Space** | O(1) — two variables: candidate + count |

- # Implementation
  collapsed:: true
	- > [!note] Standard majority (>N/2) + extended variant for elements appearing >N/3 times (returns up to 2 candidates).
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  from typing import Optional
	  
	  # ══════════════════════════════════════════════════════
	  # Standard: Majority Element appearing > N/2 times
	  # ══════════════════════════════════════════════════════
	  def majority_element(nums: list[int]) -> Optional[int]:
	      """Returns majority element if it exists, else None."""
	      # Pass 1: Find candidate
	      candidate, count = None, 0
	      for num in nums:
	          if count == 0:
	              candidate = num
	          count += 1 if num == candidate else -1
	  
	      # Pass 2: Verify
	      if nums.count(candidate) > len(nums) // 2:
	          return candidate
	      return None   # No majority
	  
	  print(majority_element([3, 2, 3]))           # 3
	  print(majority_element([2, 2, 1, 1, 2]))     # 2
	  print(majority_element([1, 2, 3]))            # None (no majority)
	  
	  # ══════════════════════════════════════════════════════
	  # Extended: Elements appearing > N/3 times (at most 2 candidates)
	  # ══════════════════════════════════════════════════════
	  def majority_n3(nums: list[int]) -> list[int]:
	      """Returns all elements appearing > N/3 times (0, 1, or 2 elements)."""
	      cand1, cand2, cnt1, cnt2 = None, None, 0, 0
	  
	      # Pass 1: Find up to 2 candidates
	      for num in nums:
	          if num == cand1:        cnt1 += 1
	          elif num == cand2:      cnt2 += 1
	          elif cnt1 == 0:         cand1, cnt1 = num, 1
	          elif cnt2 == 0:         cand2, cnt2 = num, 1
	          else:                   cnt1 -= 1; cnt2 -= 1
	  
	      # Pass 2: Verify both candidates
	      threshold = len(nums) // 3
	      return [c for c in [cand1, cand2]
	              if c is not None and nums.count(c) > threshold]
	  
	  print(majority_n3([3, 2, 3]))          # [3]
	  print(majority_n3([1, 1, 1, 3, 3, 2, 2, 2]))  # [1, 2]
	  print(majority_n3([1, 2, 3, 4]))       # []
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <vector>
	  #include <optional>
	  #include <algorithm>
	  
	  // Standard: > N/2
	  std::optional<int> majorityElement(const std::vector<int>& nums) {
	      int candidate = 0, count = 0;
	      for (int n : nums) {
	          if (count == 0) candidate = n;
	          count += (n == candidate) ? 1 : -1;
	      }
	      // Verify
	      int freq = std::count(nums.begin(), nums.end(), candidate);
	      return (freq > (int)nums.size() / 2) ? std::optional<int>{candidate} : std::nullopt;
	  }
	  
	  // Extended: > N/3 (up to 2 elements)
	  std::vector<int> majorityN3(const std::vector<int>& nums) {
	      int c1=0, c2=0, cnt1=0, cnt2=0;
	      for (int n : nums) {
	          if (n==c1)       cnt1++;
	          else if (n==c2)  cnt2++;
	          else if (!cnt1)  { c1=n; cnt1=1; }
	          else if (!cnt2)  { c2=n; cnt2=1; }
	          else             { cnt1--; cnt2--; }
	      }
	      std::vector<int> res;
	      int th = nums.size() / 3;
	      for (int c : {c1, c2})
	          if (std::count(nums.begin(),nums.end(),c) > th) res.push_back(c);
	      return res;
	  }
	  
	  int main() {
	      auto r1 = majorityElement({3,2,3});
	      std::cout << "Majority: " << (r1 ? std::to_string(*r1) : "none") << "\n"; // 3
	  
	      auto r2 = majorityN3({1,1,1,3,3,2,2,2});
	      for (int x : r2) std::cout << x << " ";  std::cout << "\n";  // 1 2
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  class BoyerMoore {
	      // Standard: > N/2
	      static Integer majorityElement(int[] nums) {
	          int candidate = 0, count = 0;
	          for (int n : nums) {
	              if (count == 0) candidate = n;
	              count += (n == candidate) ? 1 : -1;
	          }
	          long freq = 0;
	          for (int n : nums) if (n == candidate) freq++;
	          return (freq > nums.length / 2) ? candidate : null;
	      }
	  
	      // Extended: > N/3
	      static List<Integer> majorityN3(int[] nums) {
	          int c1=0, c2=0, cnt1=0, cnt2=0;
	          for (int n : nums) {
	              if (n==c1)       cnt1++;
	              else if (n==c2)  cnt2++;
	              else if (cnt1==0){ c1=n; cnt1=1; }
	              else if (cnt2==0){ c2=n; cnt2=1; }
	              else             { cnt1--; cnt2--; }
	          }
	          List<Integer> res = new ArrayList<>();
	          int th = nums.length / 3;
	          for (int c : new int[]{c1,c2}) {
	              long f = 0; for (int n:nums) if(n==c) f++;
	              if (f > th) res.add(c);
	          }
	          return res;
	      }
	  
	      public static void main(String[] args) {
	          System.out.println(majorityElement(new int[]{3,2,3}));          // 3
	          System.out.println(majorityElement(new int[]{1,2,3}));          // null
	          System.out.println(majorityN3(new int[]{1,1,1,3,3,2,2,2}));    // [1, 2]
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  
	  // Standard: > N/2
	  function majorityElement(nums) {
	      let candidate = null, count = 0;
	      for (const n of nums) {
	          if (count === 0) candidate = n;
	          count += (n === candidate) ? 1 : -1;
	      }
	      const freq = nums.filter(n => n === candidate).length;
	      return freq > Math.floor(nums.length / 2) ? candidate : null;
	  }
	  
	  console.log(majorityElement([3, 2, 3]));    // 3
	  console.log(majorityElement([1, 2, 3]));    // null
	  
	  // Extended: > N/3
	  function majorityN3(nums) {
	      let [c1, c2, cnt1, cnt2] = [null, null, 0, 0];
	      for (const n of nums) {
	          if (n === c1)       cnt1++;
	          else if (n === c2)  cnt2++;
	          else if (cnt1 === 0){ c1 = n; cnt1 = 1; }
	          else if (cnt2 === 0){ c2 = n; cnt2 = 1; }
	          else               { cnt1--; cnt2--; }
	      }
	      const th = Math.floor(nums.length / 3);
	      return [c1, c2].filter(c => c !== null && nums.filter(n => n === c).length > th);
	  }
	  
	  console.log(majorityN3([1,1,1,3,3,2,2,2]));  // [1, 2]
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  using System.Linq;
	  
	  class BoyerMoore {
	      static int? MajorityElement(int[] nums) {
	          int candidate = 0, count = 0;
	          foreach (var n in nums) {
	              if (count == 0) candidate = n;
	              count += (n == candidate) ? 1 : -1;
	          }
	          return nums.Count(n => n == candidate) > nums.Length / 2 ? candidate : null;
	      }
	  
	      static List<int> MajorityN3(int[] nums) {
	          int c1=0, c2=0, cnt1=0, cnt2=0;
	          foreach (var n in nums) {
	              if (n==c1)       cnt1++;
	              else if (n==c2)  cnt2++;
	              else if (cnt1==0){ c1=n; cnt1=1; }
	              else if (cnt2==0){ c2=n; cnt2=1; }
	              else             { cnt1--; cnt2--; }
	          }
	          int th = nums.Length / 3;
	          var res = new List<int>();
	          foreach (var c in new[]{c1,c2})
	              if (nums.Count(n => n==c) > th) res.Add(c);
	          return res;
	      }
	  
	      static void Main() {
	          Console.WriteLine(MajorityElement(new[]{3,2,3}));              // 3
	          Console.WriteLine(MajorityElement(new[]{1,2,3}));              // null
	          Console.WriteLine(string.Join(",", MajorityN3(new[]{1,1,1,3,3,2,2,2}))); // 1,2
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- Two passes: **Pass 1** finds the candidate (cancel pairs of different elements). **Pass 2** verifies it appears > N/2 times.
	- **O(1) space** — only 2 variables (candidate + count) vs O(N) for a hash map.
	- Pass 2 is mandatory — without it, `[1, 2, 3]` would wrongly return 3.
	- **N/3 variant** maintains 2 candidates and 2 counts for elements appearing > N/3 times (at most 2 such elements can exist).
	- Related: [[Quick Select Algorithm]], [[Kadane's Algorithm]]

- # More Learn
  collapsed:: true
	- ## LeetCode Problems
		- [LeetCode 169 – Majority Element](https://leetcode.com/problems/majority-element/)
		- [LeetCode 229 – Majority Element II (N/3 variant)](https://leetcode.com/problems/majority-element-ii/)