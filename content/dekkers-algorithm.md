---
seoTitle: Dekker's Algorithm – Mutual Exclusion in Concurrent Systems
description: "Dekker's algorithm is the first known correct solution to the mutual exclusion problem. Learn turn variable, flag arrays, busy waiting, and concurrency."
keywords: "Dekker algorithm, mutual exclusion, concurrency, critical section, busy waiting, flag variable, turn variable, time complexity, concurrent programming, synchronization"
---

# Explanation
	- **Dekker’s Algorithm** is a mutual exclusion algorithm used to ensure that only one process accesses the critical section at a time. It is one of the first algorithms to solve the mutual exclusion problem in concurrent programming.
-
- # Steps
	- **Two processes**: `P0` and `P1` share two flags and a turn variable.
	-
	- **Process 0**: Sets its flag to `True`, then waits for process 1's flag to be `False` and for the turn variable to allow it.
	-
	- **Process 1**: Does the same for process 0.
	-
	- **Both processes**: Wait for each other in a loop until both flags and the turn condition are met.
-
- # Time Complexity
	- **Time complexity**: O(1) for entering and exiting the critical section.
-
- ```python
  import threading
  import time
  
  # Shared variables
  flag = [False, False]  # Flags for each process (0 and 1)
  turn = 0  # Shared turn variable
  
  # Critical section that both processes will try to enter
  def critical_section(process_id):
      print(f"Process {process_id} is in the critical section.")
      time.sleep(1)  # Simulate some work being done in the critical section
      print(f"Process {process_id} is leaving the critical section.")
  
  # Dekker's Algorithm implementation
  def dekker_algorithm(process_id):
      global flag, turn
      other_id = 1 - process_id  # The other process's ID
  
      for _ in range(5):  # Let's run the process 5 times for demonstration
          flag[process_id] = True  # Declare intent to enter critical section
          while flag[other_id]:
              if turn != process_id:
                  flag[process_id] = False  # Release flag if it's not your turn
                  while turn != process_id:
                      pass  # Wait until it's your turn
                  flag[process_id] = True  # Reacquire flag
  
          # Critical section (only one process can be here at a time)
          critical_section(process_id)
  
          # Exiting the critical section
          turn = other_id  # Give the turn to the other process
          flag[process_id] = False  # Release the flag
  
  # Create two threads to simulate the two processes
  def process_0():
      dekker_algorithm(0)
  
  def process_1():
      dekker_algorithm(1)
  
  # Running the two processes in separate threads
  if __name__ == "__main__":
      thread_0 = threading.Thread(target=process_0)
      thread_1 = threading.Thread(target=process_1)
  
      thread_0.start()
      thread_1.start()
  
      thread_0.join()
      thread_1.join()
  
  
  
  # Dekker’s Algorithm is typically implemented using two shared flags
  # and a turn variable to ensure mutual exclusion.
  # In practice, it's rarely used today due to better alternatives (e.g., mutexes).
  
  ```