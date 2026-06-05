---
seoTitle: Dekker's Algorithm – Mutual Exclusion, Memory Barriers & Concurrency Guide
description: "An exhaustive master-level guide to Dekker's Algorithm. Covers Critical Section criteria, why naive synchronization attempts fail, Peterson's algorithm comparison, CPU memory reordering fences, MESI cache coherency, and multi-language implementations."
keywords: "Dekkers algorithm, mutual exclusion, concurrency, critical section, busy waiting, Peterson's algorithm, memory barrier, volatile, multi-threading, synchronization, cache coherency, MESI"
treeTitle: DSA - Math & Geometry - Dekkers Algorithm
---

> [!info] What is Dekker's Algorithm?
> **Dekker's Algorithm** is the first correct software-only solution to the **Mutual Exclusion (Mutex)** problem in concurrent programming.
> Designed by Dutch mathematician **Theodorus Dekker** (via Edsger Dijkstra in 1965), it enables two processes to share a single resource without conflict, using only shared flags and a turn variable.
> This guide explores the algorithm's structure, the theoretical principles of concurrency, and why it can fail on modern hardware without memory barriers.

- # The Critical Section Problem
  collapsed:: true
	- In concurrent computing, threads or processes share memory. When multiple threads read and write to the same memory location, the result depends on the order of execution. This is a **race condition**.
	- The code block that accesses shared mutable state is the **Critical Section (CS)**.
	-
	- ## The Three Requirements of a Correct CS Solution
		- A valid solution to the Critical Section problem must satisfy three strict properties:
		-
		- ### 1. Mutual Exclusion
			- If process $P_i$ is executing in its critical section, then no other processes can be executing in their critical sections.
			-
		- ### 2. Progress
			- If no process is executing in its critical section and some processes wish to enter their critical sections, then only those processes that are not executing in their remainder sections can participate in deciding which process will enter its critical section next.
			- This selection cannot be postponed indefinitely.
			-
		- ### 3. Bounded Waiting
			- There must be a limit on the number of times that other processes are allowed to enter their critical sections after a process has made a request to enter its critical section and before that request is granted (prevents **starvation**).
			-
- # Naive Synchronization Failures
  collapsed:: true
	- To appreciate Dekker's algorithm, we must look at why simpler, naive synchronization attempts fail to satisfy these three requirements:
	-
	- ## Attempt 1: Strict Alternation (Violates Progress)
	  collapsed:: true
		- We use a single shared variable `turn`:
		- ```c++
		  // Thread 0
		  while (turn != 0); // Busy wait
		  // Critical Section
		  turn = 1;
		  ```
		- **Failure**: If $P_0$ exits the CS and sets `turn = 1`, and then has no more interest in entering the CS again, $P_1$ can enter. However, when $P_1$ exits, it sets `turn = 0`.
		- Now, $P_1$ wants to enter again, but it cannot because `turn == 0` and $P_0$ is in its remainder section. The active thread $P_1$ is blocked by the inactive thread $P_0$. This violates **Progress**.
		-
	- ## Attempt 2: Flag Status Arrays (Violates Mutual Exclusion)
	  collapsed:: true
		- We use a boolean flag array `flag[2]`:
		- ```c++
		  // Thread 0
		  while (flag[1]); // Wait for Thread 1 to finish
		  flag[0] = true;  // Claim interest
		  // Critical Section
		  flag[0] = false;
		  ```
		- **Failure**: Suppose `flag[0]` and `flag[1]` are both `false`.
		- $P_0$ checks `flag[1]`, sees it is `false`, and proceeds.
		- Before $P_0$ can set `flag[0] = true`, a context switch occurs.
		- $P_1$ checks `flag[0]`, sees it is `false`, and enters the CS.
		- Both processes end up in the CS simultaneously. This violates **Mutual Exclusion**.
		-
	- ## Attempt 3: Setting Flags First (Violates Bounded Waiting / Deadlock)
	  collapsed:: true
		- To fix Attempt 2, we declare intent first:
		- ```c++
		  // Thread 0
		  flag[0] = true;
		  while (flag[1]); // Wait
		  // Critical Section
		  flag[0] = false;
		  ```
		- **Failure**: If both $P_0$ and $P_1$ set their flags to `true` at the same time, both will enter their `while` loops and wait for the other to drop their flag. Neither will yield. This is a **Deadlock**, violating **Bounded Waiting**.
		-
- # Dekker's Algorithm Logic
  collapsed:: true
	- Dekker's algorithm resolves the deadlock of Attempt 3 by using a `turn` variable to force one thread to yield its flag if both express interest:
	-
	- ## Entry Protocol for Thread $i$ ($j = 1-i$):
		- 1. Set `flag[i] = true` to declare intent.
		- 2. While the other thread is interested (`flag[j] == true`):
			- Check if it is the other thread's turn (`turn == j`).
			- If so, **temporarily lower our flag** (`flag[i] = false`) to let the other thread proceed and avoid deadlock.
			- Busy-wait in a sub-loop until `turn == i`.
			- Once the turn shifts back, **re-assert our flag** (`flag[i] = true`) and re-check.
		- 3. Enter the Critical Section.
		- 4. Exit Protocol: Pass the turn to the other thread (`turn = j`) and retract intent (`flag[i] = false`).
	-
- # Comparison: Dekker's vs Peterson's
  collapsed:: true
	- **Peterson's Algorithm** (1981) simplifies the logic by not requiring the temporary lowering of flags. It uses the idea of "politeness" where a thread sets its flag but immediately gives the turn to the other thread:
	-
	- :::code-tabs
	  ```c++
	  // Dekker's Entry Protocol (Thread i, other j)
	  flag[i] = true;
	  while (flag[j]) {
	      if (turn != i) {
	          flag[i] = false;
	          while (turn != i);
	          flag[i] = true;
	      }
	  }
	  ```
	  ```c++
	  // Peterson's Entry Protocol (Thread i, other j)
	  flag[i] = true;
	  turn = j;
	  while (flag[j] && turn == j);
	  ```
	  :::
	-
	- Peterson's algorithm is much simpler to analyze and has a smaller instruction footprint, but both solve the 2-thread mutual exclusion problem.
	-
- # Modern CPU Memory Ordering & Cache Coherency
  collapsed:: true
	- Modern computers are much more complex than the sequential execution models of the 1960s. Applying Dekker's algorithm directly in C++ or Java without concurrency guards can lead to catastrophic failures.
	-
	- ## 1. Memory Reordering
		- CPUs do not execute instructions strictly in order. They reorder instructions to keep execution pipelines full (out-of-order execution).
		- In Dekker's entry protocol:
		  ```c++
		  flag[0] = true;  // Write
		  while (flag[1]); // Read
		  ```
		- Because the write to `flag[0]` and the read of `flag[1]` access different memory addresses, a modern CPU sees no dependency between them. It may reorder them (a **Store-Load reordering**), executing the read before the write.
		- If both CPUs perform this reordering:
			- $CPU_0$ reads `flag[1]` as `false`.
			- $CPU_1$ reads `flag[0]` as `false`.
			- Both threads enter the Critical Section.
			- **Mutual exclusion is violated**.
		-
	- ## 2. Memory Barriers (Fences)
		- To prevent this reordering, we must insert a **Memory Barrier** (or fence) between the write and the read. A barrier forces the CPU to complete all pending writes before executing subsequent reads.
		- In C++, we use `std::atomic` with `std::memory_order_seq_cst` (sequential consistency), which automatically emits fence instructions (e.g., `MFENCE` on x86).
		-
	- ## 3. Cache Coherency (MESI Protocol)
		- Multi-core CPUs store variables in local L1/L2 caches. When $CPU_0$ writes to `flag[0]`, the change is initially in its local cache.
		- Under the **MESI cache coherency protocol**:
			- The cache line containing `flag[0]` in $CPU_1$'s L1 cache must be transitioned to the **Invalid (I)** state.
			- When $CPU_1$ reads `flag[0]`, it misses its cache and fetches the updated value from $CPU_0$ or main memory.
		- Volatile keywords in Java and memory barriers in C++ enforce this cache invalidation and flushing, ensuring **memory visibility** across threads.
		-
- # Implementation
  collapsed:: true
	- > [!note] The implementations below spin up two separate threads to simulate concurrent execution.
	  > Languages: [[Python]] · [[Cpp]] · [[Java Script]] · [[Java]]
	-
	- :::code-tabs
	  
	  ```python
	  import threading
	  import time
	  
	  # Shared state variables
	  flag = [False, False]
	  turn = 0
	  
	  def critical_section(thread_id):
	      print(f"[Thread {thread_id}] entered critical section.")
	      time.sleep(0.1)  # Simulate work
	      print(f"[Thread {thread_id}] leaving critical section.")
	  
	  def run_thread(thread_id):
	      global turn, flag
	      other_id = 1 - thread_id
	      
	      for _ in range(3):
	          # Entry Protocol
	          flag[thread_id] = True
	          while flag[other_id]:
	              if turn != thread_id:
	                  flag[thread_id] = False
	                  while turn != thread_id:
	                      pass  # Busy-wait
	                  flag[thread_id] = True
	          
	          # Critical Section
	          critical_section(thread_id)
	          
	          # Exit Protocol
	          turn = other_id
	          flag[thread_id] = False
	          
	          time.sleep(0.05)  # Simulate remainder section
	  
	  if __name__ == "__main__":
	      t0 = threading.Thread(target=run_thread, args=(0,))
	      t1 = threading.Thread(target=run_thread, args=(1,))
	      t0.start()
	      t1.start()
	      t0.join()
	      t1.join()
	  ```
	  
	  ```c++
	  #include <iostream>
	  #include <thread>
	  #include <atomic>
	  #include <chrono>
	  
	  // Using std::atomic to prevent CPU memory reordering
	  std::atomic<bool> flag[2] = {false, false};
	  std::atomic<int> turn(0);
	  
	  void critical_section(int thread_id) {
	      std::cout << "[Thread " << thread_id << "] entered critical section.\n";
	      std::this_thread::sleep_for(std::chrono::milliseconds(100));
	      std::cout << "[Thread " << thread_id << "] leaving critical section.\n";
	  }
	  
	  void run_thread(int thread_id) {
	      int other_id = 1 - thread_id;
	      for (int i = 0; i < 3; ++i) {
	          // Entry Protocol (std::memory_order_seq_cst forces sequential consistency fences)
	          flag[thread_id].store(true, std::memory_order_seq_cst);
	          while (flag[other_id].load(std::memory_order_seq_cst)) {
	              if (turn.load(std::memory_order_seq_cst) != thread_id) {
	                  flag[thread_id].store(false, std::memory_order_seq_cst);
	                  while (turn.load(std::memory_order_seq_cst) != thread_id) {
	                      // Busy-wait
	                  }
	                  flag[thread_id].store(true, std::memory_order_seq_cst);
	              }
	          }
	  
	          // Critical Section
	          critical_section(thread_id);
	  
	          // Exit Protocol
	          turn.store(other_id, std::memory_order_seq_cst);
	          flag[thread_id].store(false, std::memory_order_seq_cst);
	  
	          std::this_thread::sleep_for(std::chrono::milliseconds(50));
	      }
	  }
	  
	  int main() {
	      std::thread t0(run_thread, 0);
	      std::thread t1(run_thread, 1);
	      t0.join();
	      t1.join();
	      return 0;
	  }
	  ```
	  
	  ```javascript
	  // In JavaScript, single-threaded execution makes busy-waiting freeze the browser.
	  // We simulate concurrency using asynchronous tasks (Web Workers or async intervals).
	  const flag = [false, false];
	  let turn = 0;
	  
	  function sleep(ms) {
	      return new Promise(resolve => setTimeout(resolve, ms));
	  }
	  
	  async function runThread(threadId) {
	      const otherId = 1 - threadId;
	      for (let i = 0; i < 3; i++) {
	          // Entry Protocol
	          flag[threadId] = true;
	          while (flag[otherId]) {
	              if (turn !== threadId) {
	                  flag[threadId] = false;
	                  while (turn !== threadId) {
	                      await sleep(1); // Non-blocking check
	                  }
	                  flag[threadId] = true;
	              }
	              await sleep(1);
	          }
	  
	          // Critical Section
	          console.log(`[Thread ${threadId}] entered critical section.`);
	          await sleep(100);
	          console.log(`[Thread ${threadId}] leaving critical section.`);
	  
	          // Exit Protocol
	          turn = otherId;
	          flag[threadId] = false;
	  
	          await sleep(50);
	      }
	  }
	  
	  runThread(0);
	  runThread(1);
	  ```
	  
	  ```java
	  public class DekkersLock {
	      // Volatile flags & turn to guarantee memory visibility across threads
	      private static volatile boolean[] flag = new boolean[2];
	      private static volatile int turn = 0;
	  
	      static class DekkerThread extends Thread {
	          private final int threadId;
	          private final int otherId;
	  
	          DekkerThread(int id) {
	              this.threadId = id;
	              this.otherId = 1 - id;
	          }
	  
	          private void criticalSection() {
	              System.out.println("[Thread " + threadId + "] entered critical section.");
	              try { Thread.sleep(100); } catch (InterruptedException e) {}
	              System.out.println("[Thread " + threadId + "] leaving critical section.");
	          }
	  
	          @Override
	          public void run() {
	              for (int i = 0; i < 3; i++) {
	                  // Entry Protocol
	                  flag[threadId] = true;
	                  while (flag[otherId]) {
	                      if (turn != threadId) {
	                          flag[threadId] = false;
	                          while (turn != threadId) {
	                              // Busy-wait / spin
	                              Thread.onSpinWait(); // Optimization hint for modern JVMs
	                          }
	                          flag[threadId] = true;
	                      }
	                  }
	  
	                  // Critical Section
	                  criticalSection();
	  
	                  // Exit Protocol
	                  turn = otherId;
	                  flag[threadId] = false;
	  
	                  try { Thread.sleep(50); } catch (InterruptedException e) {}
	              }
	          }
	      }
	  
	      public static void main(String[] args) {
	          Thread t0 = new DekkerThread(0);
	          Thread t1 = new DekkerThread(1);
	          t0.start();
	          t1.start();
	      }
	  }
	  ```
	  
	  :::
	-
- # Key Takeaways
  collapsed:: true
	- **Three CS Criteria** — Any valid synchronization solution must satisfy Mutual Exclusion, Progress, and Bounded Waiting.
	- **Deadlock Avoidance** — Dekker's avoids deadlocks by having the thread without turn priority temporarily lower its interest flag.
	- **Fences are Mandatory** — Due to modern Store-Load reorderings, memory fences (like `std::memory_order_seq_cst` in C++ or `volatile` in Java) are required to execute Dekker's correctly.
	-
- # More Learn
	- ## GitHub & Webs
		- [Wikipedia – Dekker's Algorithm](https://en.wikipedia.org/wiki/Dekker%27s_algorithm)
		- [GeeksforGeeks – Dekker's Algorithm](https://www.geeksforgeeks.org/dekkers-algorithm-in-process-synchronization/)
	- ## Related Pages
		- [[Ackermann Function]] – Deep recursion limits
		- [[Euclidean Algorithm for GCD]] – Extended GCD and modular inverse
		- [[DSA Algo & System Design]] – Full DSA index