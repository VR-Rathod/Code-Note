# Explanation
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