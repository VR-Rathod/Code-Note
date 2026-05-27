---
seoTitle: Sliding Window Technique – Fixed & Variable Window In-Depth Guide
description: "Complete guide to the Sliding Window Technique. Covers fixed-size and variable-size windows, frequency maps, monotonic deques, and solutions to max sum subarray, longest substring without repeating characters, minimum window substring, and more in 5 languages."
keywords: "sliding window, fixed window, variable window, longest substring, minimum window substring, frequency map, deque, O(N), array string, VR-Rathod, Code-Note, code note vr"
displayTitle: Sliding Window Technique
---

> [!info] What is the Sliding Window Technique?
> The **Sliding Window Technique** maintains a **dynamic range (window)** over an array or string and moves it efficiently instead of recomputing from scratch. It replaces O(N²) nested loops with a single O(N) pass by **adding the element entering the window** and **removing the element leaving** in O(1).

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Think of looking through a **train window** 🚂:
		  - As the train moves, one new tree enters your view from the front and one leaves from the back.
		  - You don't re-scan the entire landscape — you just update what enters/exits.
		  - Fixed window = same-sized frame. Variable window = you can zoom in/out based on conditions.
	-
	- ## Two Window Types
	  collapsed:: true
		- ### Fixed-Size Window (size = K)
		  ```
		  Initial window: [0 .. K-1]
		  
		  arr: [a, b, c, d, e, f]
	                ┌───────────┐
	  step 1:      [a, b, c]    sum = a+b+c
	                    ┌───────────┐
	  step 2:         [b, c, d]   sum += d, sum -= a
	                       ┌───────────┐
	  step 3:            [c, d, e]   sum += e, sum -= b
	  ```
		- ### Variable-Size Window (shrink when constraint violated)
		  ```
		  left = 0
		  for right in 0..N-1:
	          add arr[right] to window
	          while window violates constraint:
	              remove arr[left] from window
	              left++
	          update answer with (right - left + 1)
	  ```
	-
	- ## Complexity
	  collapsed:: true
		- | | Fixed Window | Variable Window |
		  |---|---|---|
		  | **Time** | O(N) | O(N) — each element enters and leaves at most once |
		  | **Space** | O(1) | O(K) for frequency map |

- # Implementation
  collapsed:: true
	- > [!note] Four problems from easy to hard: Max Sum (fixed), Longest No-Repeat Substring (variable), Longest with K Distinct, Minimum Window Substring.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  from collections import defaultdict
	  
	  # ══════════════════════════════════════════════════════
	  # 1. Fixed Window — Max Sum of K Elements
	  # ══════════════════════════════════════════════════════
	  def max_sum_k(arr: list[int], k: int) -> int:
	      window_sum = sum(arr[:k])          # Initial window
	      max_sum    = window_sum
	      for i in range(k, len(arr)):
	          window_sum += arr[i] - arr[i - k]   # Slide: add new, remove old
	          max_sum = max(max_sum, window_sum)
	      return max_sum
	  
	  print(max_sum_k([1, 4, 2, 9, 7, 3, 8, 5], 3))  # 24 (9+7+8)
	  
	  # ══════════════════════════════════════════════════════
	  # 2. Variable Window — Longest Substring Without Repeating Characters
	  # ══════════════════════════════════════════════════════
	  def length_of_longest_substring(s: str) -> int:
	      char_index: dict[str, int] = {}   # char → last seen index
	      left = max_len = 0
	      for right, ch in enumerate(s):
	          if ch in char_index and char_index[ch] >= left:
	              left = char_index[ch] + 1   # Jump past the duplicate
	          char_index[ch] = right
	          max_len = max(max_len, right - left + 1)
	      return max_len
	  
	  print(length_of_longest_substring("abcabcbb"))   # 3 ("abc")
	  print(length_of_longest_substring("pwwkew"))     # 3 ("wke")
	  
	  # ══════════════════════════════════════════════════════
	  # 3. Variable Window — Longest Substring with At Most K Distinct Characters
	  # ══════════════════════════════════════════════════════
	  def longest_k_distinct(s: str, k: int) -> int:
	      freq: dict[str, int] = defaultdict(int)
	      left = max_len = 0
	      for right, ch in enumerate(s):
	          freq[ch] += 1
	          while len(freq) > k:               # Too many distinct chars → shrink
	              left_ch = s[left]
	              freq[left_ch] -= 1
	              if freq[left_ch] == 0: del freq[left_ch]
	              left += 1
	          max_len = max(max_len, right - left + 1)
	      return max_len
	  
	  print(longest_k_distinct("araaci", 2))   # 4 ("araa")
	  
	  # ══════════════════════════════════════════════════════
	  # 4. Variable Window — Minimum Window Substring (LeetCode 76)
	  # Contains all characters of pattern t
	  # ══════════════════════════════════════════════════════
	  def min_window(s: str, t: str) -> str:
	      if not t or len(s) < len(t): return ""
	  
	      need = defaultdict(int)
	      for ch in t: need[ch] += 1
	      missing = len(t)                       # Total chars still needed
	  
	      left = start = 0
	      min_len = float("inf")
	  
	      for right, ch in enumerate(s):
	          if need[ch] > 0: missing -= 1      # One more required char found
	          need[ch] -= 1
	  
	          while missing == 0:                 # Valid window — try to shrink
	              if right - left + 1 < min_len:
	                  min_len = right - left + 1
	                  start   = left
	              need[s[left]] += 1
	              if need[s[left]] > 0: missing += 1
	              left += 1
	  
	      return s[start:start + min_len] if min_len != float("inf") else ""
	  
	  print(min_window("ADOBECODEBANC", "ABC"))  # "BANC"
	  print(min_window("aa", "aa"))              # "aa"
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <string>
	  #include <unordered_map>
	  #include <vector>
	  #include <climits>
	  
	  // 1. Max Sum K
	  int maxSumK(const std::vector<int>& a, int k) {
	      int sum = 0;
	      for (int i = 0; i < k; ++i) sum += a[i];
	      int best = sum;
	      for (int i = k; i < (int)a.size(); ++i) {
	          sum += a[i] - a[i-k];
	          best = std::max(best, sum);
	      }
	      return best;
	  }
	  
	  // 2. Longest No-Repeat Substring
	  int lengthLongestSubstring(const std::string& s) {
	      std::unordered_map<char, int> idx;
	      int left = 0, best = 0;
	      for (int r = 0; r < (int)s.size(); ++r) {
	          if (idx.count(s[r]) && idx[s[r]] >= left)
	              left = idx[s[r]] + 1;
	          idx[s[r]] = r;
	          best = std::max(best, r - left + 1);
	      }
	      return best;
	  }
	  
	  // 3. Minimum Window Substring
	  std::string minWindow(const std::string& s, const std::string& t) {
	      std::unordered_map<char,int> need;
	      for (char c : t) need[c]++;
	      int missing = t.size(), left = 0, start = 0, minLen = INT_MAX;
	      for (int r = 0; r < (int)s.size(); ++r) {
	          if (need[s[r]]-- > 0) --missing;
	          while (!missing) {
	              if (r - left + 1 < minLen) { minLen = r-left+1; start = left; }
	              if (++need[s[left++]] > 0) ++missing;
	          }
	      }
	      return minLen == INT_MAX ? "" : s.substr(start, minLen);
	  }
	  
	  int main() {
	      std::vector<int> a = {1,4,2,9,7,3,8,5};
	      std::cout << "Max sum K=3: " << maxSumK(a, 3) << "\n";           // 24
	      std::cout << "No-repeat:   " << lengthLongestSubstring("abcabcbb") << "\n"; // 3
	      std::cout << "Min window:  " << minWindow("ADOBECODEBANC","ABC") << "\n";   // BANC
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  class SlidingWindow {
	  
	      // 1. Max Sum K
	      static int maxSumK(int[] a, int k) {
	          int sum = 0;
	          for (int i = 0; i < k; i++) sum += a[i];
	          int best = sum;
	          for (int i = k; i < a.length; i++) { sum += a[i]-a[i-k]; best=Math.max(best,sum); }
	          return best;
	      }
	  
	      // 2. Longest No-Repeat Substring
	      static int longestNoRepeat(String s) {
	          int[] idx = new int[128];
	          Arrays.fill(idx, -1);
	          int left = 0, best = 0;
	          for (int r = 0; r < s.length(); r++) {
	              if (idx[s.charAt(r)] >= left) left = idx[s.charAt(r)] + 1;
	              idx[s.charAt(r)] = r;
	              best = Math.max(best, r - left + 1);
	          }
	          return best;
	      }
	  
	      // 3. Minimum Window Substring
	      static String minWindow(String s, String t) {
	          int[] need = new int[128];
	          for (char c : t.toCharArray()) need[c]++;
	          int missing = t.length(), left = 0, start = 0, min = Integer.MAX_VALUE;
	          for (int r = 0; r < s.length(); r++) {
	              if (need[s.charAt(r)]-- > 0) missing--;
	              while (missing == 0) {
	                  if (r-left+1 < min) { min=r-left+1; start=left; }
	                  if (++need[s.charAt(left++)] > 0) missing++;
	              }
	          }
	          return min==Integer.MAX_VALUE ? "" : s.substring(start, start+min);
	      }
	  
	      public static void main(String[] args) {
	          System.out.println(maxSumK(new int[]{1,4,2,9,7,3,8,5}, 3)); // 24
	          System.out.println(longestNoRepeat("abcabcbb"));              // 3
	          System.out.println(minWindow("ADOBECODEBANC", "ABC"));       // BANC
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  
	  // 1. Max Sum K (fixed window)
	  function maxSumK(arr, k) {
	      let sum = arr.slice(0, k).reduce((a, b) => a + b, 0);
	      let best = sum;
	      for (let i = k; i < arr.length; i++) { sum += arr[i] - arr[i-k]; best = Math.max(best, sum); }
	      return best;
	  }
	  console.log(maxSumK([1,4,2,9,7,3,8,5], 3));  // 24
	  
	  // 2. Longest No-Repeat Substring (variable window)
	  function longestNoRepeat(s) {
	      const map = new Map();
	      let left = 0, best = 0;
	      for (let r = 0; r < s.length; r++) {
	          if (map.has(s[r]) && map.get(s[r]) >= left) left = map.get(s[r]) + 1;
	          map.set(s[r], r);
	          best = Math.max(best, r - left + 1);
	      }
	      return best;
	  }
	  console.log(longestNoRepeat("abcabcbb"));  // 3
	  
	  // 3. Minimum Window Substring (variable window)
	  function minWindow(s, t) {
	      const need = new Map();
	      for (const c of t) need.set(c, (need.get(c) || 0) + 1);
	      let missing = t.length, left = 0, start = 0, minLen = Infinity;
	      for (let r = 0; r < s.length; r++) {
	          const c = s[r];
	          if ((need.get(c) || 0) > 0) missing--;
	          need.set(c, (need.get(c) || 0) - 1);
	          while (missing === 0) {
	              if (r - left + 1 < minLen) { minLen = r - left + 1; start = left; }
	              const lc = s[left++];
	              need.set(lc, (need.get(lc) || 0) + 1);
	              if (need.get(lc) > 0) missing++;
	          }
	      }
	      return minLen === Infinity ? "" : s.slice(start, start + minLen);
	  }
	  console.log(minWindow("ADOBECODEBANC", "ABC"));  // BANC
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  
	  class SlidingWindow {
	      static int MaxSumK(int[] a, int k) {
	          int sum = 0;
	          for (int i = 0; i < k; i++) sum += a[i];
	          int best = sum;
	          for (int i = k; i < a.Length; i++) { sum += a[i]-a[i-k]; best = Math.Max(best, sum); }
	          return best;
	      }
	  
	      static int LongestNoRepeat(string s) {
	          var idx = new Dictionary<char, int>();
	          int left = 0, best = 0;
	          for (int r = 0; r < s.Length; r++) {
	              if (idx.TryGetValue(s[r], out int prev) && prev >= left) left = prev + 1;
	              idx[s[r]] = r;
	              best = Math.Max(best, r - left + 1);
	          }
	          return best;
	      }
	  
	      static string MinWindow(string s, string t) {
	          var need = new Dictionary<char, int>();
	          foreach (var c in t) { need.TryGetValue(c, out int v); need[c] = v + 1; }
	          int missing = t.Length, left = 0, start = 0, min = int.MaxValue;
	          for (int r = 0; r < s.Length; r++) {
	              need.TryGetValue(s[r], out int cnt); if (cnt > 0) missing--;
	              need[s[r]] = cnt - 1;
	              while (missing == 0) {
	                  if (r-left+1 < min) { min=r-left+1; start=left; }
	                  need.TryGetValue(s[left], out int lc); need[s[left]] = lc+1;
	                  if (lc+1 > 0) missing++; left++;
	              }
	          }
	          return min == int.MaxValue ? "" : s.Substring(start, min);
	      }
	  
	      static void Main() {
	          Console.WriteLine(MaxSumK(new[]{1,4,2,9,7,3,8,5}, 3)); // 24
	          Console.WriteLine(LongestNoRepeat("abcabcbb"));          // 3
	          Console.WriteLine(MinWindow("ADOBECODEBANC", "ABC"));    // BANC
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- **Fixed window:** precompute initial sum; slide by `+arr[right] -arr[left]` each step.
	- **Variable window:** expand right always; shrink left until constraint is satisfied. Each element enters and leaves once → O(N).
	- Use a **frequency map** (dict/HashMap) for character/element tracking in variable windows.
	- **Minimum Window Substring** is the canonical hard problem — uses `missing` counter to avoid iterating the full map.
	- Related: [[Two Pointers Technique]], [[Kadane's Algorithm]], [[Prefix Sum Array]]

- # More Learn
  collapsed:: true
	- ## LeetCode Problems
		- [LeetCode 643 – Max Average Subarray I (Fixed)](https://leetcode.com/problems/maximum-average-subarray-i/)
		- [LeetCode 3 – Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)
		- [LeetCode 340 – Longest Substring with At Most K Distinct Characters](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/)
		- [LeetCode 76 – Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/)
