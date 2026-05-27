---
seoTitle: Floyd's Cycle Detection Algorithm – Tortoise and Hare | In-Depth Guide
description: "Complete guide to Floyd's Cycle Detection Algorithm (Tortoise and Hare). Covers cycle detection, finding cycle start, cycle length, linked list and array problems, and implementations in Python, C++, Java, JavaScript, and C#."
keywords: "Floyd cycle detection, tortoise and hare, linked list cycle, slow fast pointer, cycle start, duplicate number, functional graph, O(N) O(1), VR-Rathod, Code-Note, code note vr"
displayTitle: Floyd Cycle Detection Algorithm
---

> [!info] What is Floyd's Cycle Detection Algorithm?
> **Floyd's Cycle Detection Algorithm** (Tortoise and Hare) uses **two pointers moving at different speeds** to detect a cycle in a sequence in **O(N) time and O(1) space** — no hash set needed. It can also find the **cycle start** and **cycle length** using elegant pointer math.

- # Explanation
  collapsed:: true
	- ## Real-World Analogy
	  collapsed:: true
		- Imagine two runners on a circular track 🏃:
		  - The **tortoise** runs at 1 step/second.
		  - The **hare** runs at 2 steps/second.
		  - If there's a loop, the hare will eventually **lap** the tortoise and they'll meet inside the cycle.
		  - If there's no loop, the hare reaches the end.
	-
	- ## Phase 1 — Detect the Cycle
	  collapsed:: true
		- ```
		  slow = head → moves 1 step at a time
		  fast = head → moves 2 steps at a time
		  
		  Loop until slow == fast (meeting point inside cycle)
		  or fast reaches null (no cycle)
		  ```
		- **Why do they always meet inside the cycle?**
		  - Once both pointers enter the cycle, the fast pointer gains 1 step per iteration relative to the slow pointer. Since the cycle has finite length L, they meet after at most L iterations.
	-
	- ## Phase 2 — Find the Cycle Start
	  collapsed:: true
		- After meeting, reset **one pointer to `head`**, keep the other at the **meeting point**. Move **both at speed 1**. Where they meet again = **cycle start**.
		- **Mathematical proof:**
		  ```
		  Let:  F = distance from head to cycle start
		        a = distance from cycle start to meeting point (inside cycle)
		        L = cycle length
		  
		  When slow and fast meet:
		    slow traveled: F + a
		    fast traveled: F + a + n*L  (fast lapped n times)
		  
		  Since fast = 2 × slow:
		    2(F + a) = F + a + n*L
		    F + a    = n*L
		    F        = n*L − a
		  
		  → Starting from head and meeting point, both travel F steps to reach cycle start ✓
		  ```
	-
	- ## Phase 3 — Find the Cycle Length (optional)
	  collapsed:: true
		- After finding the cycle start, move **one pointer** around until it returns to the start. Count steps = cycle length.
	-
	- ## Complexity
	  collapsed:: true
		- | | Value |
		  |---|---|
		  | **Time** | O(N) — at most 2 passes |
		  | **Space** | O(1) — only 2 pointers |

- # Implementation
  collapsed:: true
	- > [!note] Three use cases: linked list cycle detection, finding cycle start, and finding a duplicate number in an array (array treated as a linked list).
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  from __future__ import annotations
	  from dataclasses import dataclass
	  from typing import Optional
	  
	  @dataclass
	  class ListNode:
	      val: int
	      next: Optional["ListNode"] = None
	  
	  
	  class FloydCycleDetection:
	      # ── Phase 1: Detect cycle ──────────────────────────────────────
	      @staticmethod
	      def has_cycle(head: Optional[ListNode]) -> bool:
	          slow = fast = head
	          while fast and fast.next:
	              slow = slow.next
	              fast = fast.next.next
	              if slow is fast:
	                  return True
	          return False
	  
	      # ── Phase 2: Find cycle start ──────────────────────────────────
	      @staticmethod
	      def find_cycle_start(head: Optional[ListNode]) -> Optional[ListNode]:
	          slow = fast = head
	          # Phase 1: detect
	          while fast and fast.next:
	              slow = slow.next
	              fast = fast.next.next
	              if slow is fast:
	                  break
	          else:
	              return None   # No cycle
	  
	          # Phase 2: find start — reset one pointer to head
	          slow = head
	          while slow is not fast:
	              slow = slow.next
	              fast = fast.next
	          return slow      # Both meet at cycle start
	  
	      # ── Phase 3: Find cycle length ─────────────────────────────────
	      @staticmethod
	      def cycle_length(head: Optional[ListNode]) -> int:
	          start = FloydCycleDetection.find_cycle_start(head)
	          if not start: return 0
	          count = 1
	          node = start.next
	          while node is not start:
	              node = node.next
	              count += 1
	          return count
	  
	  
	  # ── LeetCode 287: Find Duplicate Number ───────────────────────────────
	  # Array nums has n+1 numbers, all in [1, n] → must have duplicate.
	  # Treat arr as a linked list: index i → node i, arr[i] → next pointer.
	  def find_duplicate(nums: list[int]) -> int:
	      slow = fast = nums[0]
	      # Phase 1: detect
	      while True:
	          slow = nums[slow]
	          fast = nums[nums[fast]]
	          if slow == fast:
	              break
	      # Phase 2: find entry = duplicate number
	      slow = nums[0]
	      while slow != fast:
	          slow = nums[slow]
	          fast = nums[fast]
	      return slow
	  
	  
	  # ── Demo ───────────────────────────────────────────────────────────
	  # Build: 1 → 2 → 3 → 4 → 5 → (back to 3)
	  nodes = [ListNode(i) for i in range(1, 6)]
	  for i in range(4): nodes[i].next = nodes[i+1]
	  nodes[4].next = nodes[2]   # Cycle: 5 → 3
	  
	  detector = FloydCycleDetection()
	  print("Has cycle:", detector.has_cycle(nodes[0]))             # True
	  start = detector.find_cycle_start(nodes[0])
	  print("Cycle starts at node:", start.val)                     # 3
	  print("Cycle length:", detector.cycle_length(nodes[0]))       # 3
	  
	  print("Duplicate:", find_duplicate([1, 3, 4, 2, 2]))          # 2
	  print("Duplicate:", find_duplicate([3, 1, 3, 4, 2]))          # 3
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <vector>
	  
	  struct ListNode {
	      int val;
	      ListNode* next;
	      ListNode(int v) : val(v), next(nullptr) {}
	  };
	  
	  class Floyd {
	  public:
	      // Phase 1: Does cycle exist?
	      static bool hasCycle(ListNode* head) {
	          ListNode *slow = head, *fast = head;
	          while (fast && fast->next) {
	              slow = slow->next;
	              fast = fast->next->next;
	              if (slow == fast) return true;
	          }
	          return false;
	      }
	  
	      // Phase 1 + 2: Find cycle start node
	      static ListNode* findCycleStart(ListNode* head) {
	          ListNode *slow = head, *fast = head;
	          while (fast && fast->next) {
	              slow = slow->next;
	              fast = fast->next->next;
	              if (slow == fast) {
	                  slow = head;           // Reset to head
	                  while (slow != fast) {
	                      slow = slow->next;
	                      fast = fast->next;
	                  }
	                  return slow;
	              }
	          }
	          return nullptr;
	      }
	  
	      // Find duplicate in array (LeetCode 287)
	      static int findDuplicate(const std::vector<int>& nums) {
	          int slow = nums[0], fast = nums[0];
	          do {
	              slow = nums[slow];
	              fast = nums[nums[fast]];
	          } while (slow != fast);
	          slow = nums[0];
	          while (slow != fast) {
	              slow = nums[slow];
	              fast = nums[fast];
	          }
	          return slow;
	      }
	  };
	  
	  int main() {
	      // Build: 1->2->3->4->5->back to 3
	      ListNode* nodes[5];
	      for (int i = 0; i < 5; ++i) nodes[i] = new ListNode(i + 1);
	      for (int i = 0; i < 4; ++i) nodes[i]->next = nodes[i+1];
	      nodes[4]->next = nodes[2];   // cycle 5→3
	  
	      std::cout << "Has cycle: " << Floyd::hasCycle(nodes[0]) << "\n";    // 1
	      auto* start = Floyd::findCycleStart(nodes[0]);
	      std::cout << "Cycle starts at: " << start->val << "\n";              // 3
	  
	      std::cout << "Duplicate: " << Floyd::findDuplicate({1,3,4,2,2}) << "\n"; // 2
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  class ListNode {
	      int val; ListNode next;
	      ListNode(int val) { this.val = val; }
	  }
	  
	  class Floyd {
	      // Phase 1: Detect cycle
	      static boolean hasCycle(ListNode head) {
	          ListNode slow = head, fast = head;
	          while (fast != null && fast.next != null) {
	              slow = slow.next;
	              fast = fast.next.next;
	              if (slow == fast) return true;
	          }
	          return false;
	      }
	  
	      // Phase 1 + 2: Find cycle start
	      static ListNode findCycleStart(ListNode head) {
	          ListNode slow = head, fast = head;
	          while (fast != null && fast.next != null) {
	              slow = slow.next;
	              fast = fast.next.next;
	              if (slow == fast) {
	                  slow = head;
	                  while (slow != fast) {
	                      slow = slow.next;
	                      fast = fast.next;
	                  }
	                  return slow;
	              }
	          }
	          return null;
	      }
	  
	      // Find duplicate (LeetCode 287)
	      static int findDuplicate(int[] nums) {
	          int slow = nums[0], fast = nums[0];
	          do {
	              slow = nums[slow];
	              fast = nums[nums[fast]];
	          } while (slow != fast);
	          slow = nums[0];
	          while (slow != fast) {
	              slow = nums[slow];
	              fast = nums[fast];
	          }
	          return slow;
	      }
	  
	      public static void main(String[] args) {
	          // Build: 1->2->3->4->5->3 (cycle at node 3)
	          ListNode[] nodes = new ListNode[5];
	          for (int i = 0; i < 5; i++) nodes[i] = new ListNode(i + 1);
	          for (int i = 0; i < 4; i++) nodes[i].next = nodes[i + 1];
	          nodes[4].next = nodes[2];
	  
	          System.out.println("Has cycle: " + hasCycle(nodes[0]));       // true
	          ListNode s = findCycleStart(nodes[0]);
	          System.out.println("Cycle start: " + s.val);                  // 3
	          System.out.println("Duplicate: " + findDuplicate(new int[]{1,3,4,2,2})); // 2
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  class ListNode {
	      constructor(val) { this.val = val; this.next = null; }
	  }
	  
	  const Floyd = {
	      hasCycle(head) {
	          let slow = head, fast = head;
	          while (fast && fast.next) {
	              slow = slow.next;
	              fast = fast.next.next;
	              if (slow === fast) return true;
	          }
	          return false;
	      },
	  
	      findCycleStart(head) {
	          let slow = head, fast = head;
	          while (fast && fast.next) {
	              slow = slow.next;
	              fast = fast.next.next;
	              if (slow === fast) {
	                  slow = head;
	                  while (slow !== fast) {
	                      slow = slow.next;
	                      fast = fast.next;
	                  }
	                  return slow;
	              }
	          }
	          return null;
	      },
	  
	      findDuplicate(nums) {
	          let slow = nums[0], fast = nums[0];
	          do {
	              slow = nums[slow];
	              fast = nums[nums[fast]];
	          } while (slow !== fast);
	          slow = nums[0];
	          while (slow !== fast) {
	              slow = nums[slow];
	              fast = nums[fast];
	          }
	          return slow;
	      }
	  };
	  
	  // Build: 1→2→3→4→5→back to index 2 (node val=3)
	  const nodes = Array.from({length: 5}, (_, i) => new ListNode(i + 1));
	  nodes.forEach((n, i) => { if (i < 4) n.next = nodes[i + 1]; });
	  nodes[4].next = nodes[2];
	  
	  console.log("Has cycle:", Floyd.hasCycle(nodes[0]));              // true
	  console.log("Cycle start:", Floyd.findCycleStart(nodes[0]).val);  // 3
	  console.log("Duplicate:", Floyd.findDuplicate([1, 3, 4, 2, 2]));  // 2
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  
	  class ListNode { public int val; public ListNode? next; public ListNode(int v) { val = v; } }
	  
	  static class Floyd {
	      public static bool HasCycle(ListNode? head) {
	          var slow = head; var fast = head;
	          while (fast?.next != null) {
	              slow = slow!.next;
	              fast = fast.next.next;
	              if (slow == fast) return true;
	          }
	          return false;
	      }
	  
	      public static ListNode? FindCycleStart(ListNode? head) {
	          var slow = head; var fast = head;
	          while (fast?.next != null) {
	              slow = slow!.next;
	              fast = fast.next.next;
	              if (slow == fast) {
	                  slow = head;
	                  while (slow != fast) { slow = slow!.next; fast = fast!.next; }
	                  return slow;
	              }
	          }
	          return null;
	      }
	  
	      public static int FindDuplicate(int[] nums) {
	          int slow = nums[0], fast = nums[0];
	          do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow != fast);
	          slow = nums[0];
	          while (slow != fast) { slow = nums[slow]; fast = nums[fast]; }
	          return slow;
	      }
	  
	      static void Main() {
	          var nodes = new ListNode[5];
	          for (int i = 0; i < 5; i++) nodes[i] = new ListNode(i + 1);
	          for (int i = 0; i < 4; i++) nodes[i].next = nodes[i + 1];
	          nodes[4].next = nodes[2];
	  
	          Console.WriteLine($"Has cycle: {HasCycle(nodes[0])}");
	          Console.WriteLine($"Cycle start: {FindCycleStart(nodes[0])!.val}");
	          Console.WriteLine($"Duplicate: {FindDuplicate(new[]{1,3,4,2,2})}");
	      }
	  }
	  ```
	  
	  :::

- # Key Takeaways
  collapsed:: true
	- **Phase 1:** Slow (×1) and fast (×2) pointers — they meet inside the cycle if one exists.
	- **Phase 2:** Reset one pointer to `head`, move both at speed 1 — they meet at the cycle start. (Proven by `F = n*L − a`)
	- **No extra memory** — O(1) space vs O(N) for a HashSet approach.
	- **Array as linked list trick:** `nums[i]` = next pointer → detects duplicate numbers (LeetCode 287).
	- Related: [[Two Pointers Technique]], [[Kadane's Algorithm]]

- # More Learn
  collapsed:: true
	- ## LeetCode Problems
		- [LeetCode 141 – Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)
		- [LeetCode 142 – Linked List Cycle II (find start)](https://leetcode.com/problems/linked-list-cycle-ii/)
		- [LeetCode 287 – Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/)
