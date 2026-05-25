---
date: 2026-03-24T17:12:17+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Floyd's Cycle Detection – Tortoise and Hare Algorithm Guide
description: "Floyd's cycle detection finds cycles in sequences using two pointers at different speeds. Covers cycle start detection, cycle length, O(n) time, O(1) space."
keywords: "Floyd cycle detection, tortoise and hare, two pointers, linked list cycle, cycle detection, O(n) time, O(1) space, time complexity, space complexity, algorithm"
---

- # Explanation
	- Floyd’s Cycle Detection Algorithm, also known as **Tortoise and Hare**, is used to detect if there is a cycle in a linked list. It uses two pointers moving at different speeds.
-
- **Steps**:
	- Initialize two pointers, `slow` and `fast`, both starting at the head of the list.
	-
	- Move `slow` one step and `fast` two steps in each iteration.
	-
	- If there is a cycle, `slow` and `fast` will eventually meet.
	-
	- If `fast` or `fast.next` becomes `None`, there is no cycle.
-
- # Time Complexity
	- **O(n)**, where `n` is the number of nodes in the linked list.
-
- ```python
  class ListNode:
      def __init__(self, value=0, next=None):
          self.value = value
          self.next = next
  
  def has_cycle(head):
      slow = fast = head
      while fast and fast.next:
          slow = slow.next
          fast = fast.next.next
          if slow == fast:
              return True
      return False
  
  # Example usage
  head = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
  print("Has Cycle:", has_cycle(head))
  ```