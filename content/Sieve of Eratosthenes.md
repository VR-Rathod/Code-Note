---
seoTitle: Sieve of Eratosthenes – Prime Generation In-Depth Guide
description: "Complete guide to the Sieve of Eratosthenes. Covers O(N log log N) marking algorithm, segmented sieve for large N, linear sieve, and implementations in Python, C++, Java, JavaScript, and C#."
keywords: "Sieve of Eratosthenes, prime numbers, prime generation, O(N log log N), segmented sieve, linear sieve, number theory, competitive programming, VR-Rathod, Code-Note, code note vr"
displayTitle: Sieve of Eratosthenes
treeTitle: DSA - Math & Geometry - Sieve of Eratosthenes
---

> [!info] What is the Sieve of Eratosthenes?
> The **Sieve of Eratosthenes** generates all prime numbers up to N in **O(N log log N)** time by iteratively marking multiples of each prime as composite. It is one of the oldest and most efficient prime-generation algorithms, dating back to ~240 BC.

- # Explanation
  collapsed:: true
	- ## The Algorithm
	  collapsed:: true
		- ```
		  1. Create a boolean array is_prime[0..N], all set to True.
		  2. Set is_prime[0] = is_prime[1] = False.
		  3. For each p from 2 to √N:
		       If is_prime[p]:
		           Mark p², p²+p, p²+2p, ... as False
		           (Start at p² because smaller multiples already marked by smaller primes)
		  4. All remaining True positions are primes.
		  ```
	-
	- ## Why start marking at p²?
	  collapsed:: true
		- For prime p, all multiples `2p, 3p, ..., (p-1)p` were already marked by earlier primes 2, 3, ..., p-1. The **first unmarked multiple** is always `p²`.
		- This is why the outer loop only needs to go up to **√N**.
	-
	- ## Visual Example (N=30)
	  collapsed:: true
		- ```
		  Start: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
		  
		  p=2: mark 4,6,8,10,12,...,30
		  p=3: mark 9,15,21,27
		  p=5: mark 25
		  (√30 ≈ 5.5, stop here)
		  
		  Primes: [2,3,5,7,11,13,17,19,23,29]
		  ```
	-
	- ## Complexity
	  collapsed:: true
		- | | Value |
		  |---|---|
		  | **Time** | O(N log log N) |
		  | **Space** | O(N) boolean array → O(N/8) with bitset |
		  | **Outer loop** | Only up to √N |
- # Implementation
  collapsed:: true
	- > [!note] Standard sieve, segmented sieve (cache-friendly for large N), and using the sieve for prime factorisation.
	  > Languages: [[Python]] · [[Cpp]] · [[Java]] · [[Java Script]] · [[CSharp]]
	-
	- :::code-tabs
	  
	  ```python
	  # ─── Python ──────────────────────────────────────────────────────────
	  import math
	  
	  # ══════════════════════════════════════════════════════
	  # 1. Standard Sieve of Eratosthenes
	  # ══════════════════════════════════════════════════════
	  def sieve(n: int) -> list[int]:
	      """Returns list of all primes ≤ n."""
	      is_prime = bytearray([1]) * (n + 1)   # bytearray is faster than list[bool]
	      is_prime[0] = is_prime[1] = 0
	      for p in range(2, int(n**0.5) + 1):
	          if is_prime[p]:
	              is_prime[p*p::p] = bytearray(len(is_prime[p*p::p]))  # Mark multiples
	      return [i for i, v in enumerate(is_prime) if v]
	  
	  primes = sieve(50)
	  print(primes)  # [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47]
	  
	  # ══════════════════════════════════════════════════════
	  # 2. Smallest Prime Factor Sieve (for fast factorisation)
	  # ══════════════════════════════════════════════════════
	  def spf_sieve(n: int) -> list[int]:
	      """spf[i] = smallest prime factor of i."""
	      spf = list(range(n + 1))          # Initially spf[i] = i
	      for p in range(2, int(n**0.5) + 1):
	          if spf[p] == p:               # p is prime
	              for mult in range(p*p, n+1, p):
	                  if spf[mult] == mult: # Not yet assigned
	                      spf[mult] = p
	      return spf
	  
	  def factorize(n: int, spf: list[int]) -> list[int]:
	      """O(log N) factorisation using SPF sieve."""
	      factors = []
	      while n > 1:
	          factors.append(spf[n])
	          n //= spf[n]
	      return factors
	  
	  spf = spf_sieve(100)
	  print(factorize(84, spf))    # [2, 2, 3, 7]
	  print(factorize(360, spf))   # [2, 2, 2, 3, 3, 5]
	  
	  # ══════════════════════════════════════════════════════
	  # 3. Segmented Sieve (for large N, cache-friendly)
	  # ══════════════════════════════════════════════════════
	  def segmented_sieve(low: int, high: int) -> list[int]:
	      """Returns primes in [low, high]."""
	      limit = int(high**0.5)
	      base_primes = sieve(limit)
	  
	      is_prime = bytearray([1]) * (high - low + 1)
	      if low == 1: is_prime[0] = 0   # 1 is not prime
	  
	      for p in base_primes:
	          # First multiple of p in [low, high]
	          start = max(p*p, low + (p - low % p) % p)
	          for mult in range(start, high + 1, p):
	              is_prime[mult - low] = 0
	  
	      return [low + i for i, v in enumerate(is_prime) if v]
	  
	  print(segmented_sieve(10, 50))
	  # [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
	  
	  # Count primes ≤ N
	  print(f"π(100) = {len(sieve(100))}")   # 25
	  ```
	  
	  ```c++
	  // ─── C++ ─────────────────────────────────────────────────────────────
	  #include <iostream>
	  #include <vector>
	  #include <cmath>
	  #include <bitset>
	  
	  // 1. Standard Sieve
	  std::vector<int> sieve(int n) {
	      std::vector<bool> is_prime(n+1, true);
	      is_prime[0]=is_prime[1]=false;
	      for (int p=2; (long long)p*p<=n; ++p)
	          if (is_prime[p])
	              for (int mult=p*p; mult<=n; mult+=p)
	                  is_prime[mult]=false;
	      std::vector<int> primes;
	      for (int i=2;i<=n;++i) if(is_prime[i]) primes.push_back(i);
	      return primes;
	  }
	  
	  // 2. Smallest Prime Factor Sieve
	  std::vector<int> spfSieve(int n) {
	      std::vector<int> spf(n+1);
	      for (int i=0;i<=n;++i) spf[i]=i;
	      for (int p=2;(long long)p*p<=n;++p)
	          if (spf[p]==p)
	              for (int m=p*p;m<=n;m+=p)
	                  if (spf[m]==m) spf[m]=p;
	      return spf;
	  }
	  
	  std::vector<int> factorize(int n, const std::vector<int>& spf) {
	      std::vector<int> factors;
	      while (n>1) { factors.push_back(spf[n]); n/=spf[n]; }
	      return factors;
	  }
	  
	  int main() {
	      auto primes = sieve(50);
	      for (int p:primes) std::cout<<p<<" ";
	      std::cout<<"\n";
	  
	      auto spf = spfSieve(100);
	      auto f = factorize(360, spf);
	      for (int x:f) std::cout<<x<<" ";  // 2 2 2 3 3 5
	      std::cout<<"\n";
	  }
	  ```
	  
	  ```java
	  // ─── Java ─────────────────────────────────────────────────────────────
	  import java.util.*;
	  
	  class SieveEratosthenes {
	      static List<Integer> sieve(int n) {
	          boolean[] isComposite = new boolean[n+1];
	          List<Integer> primes = new ArrayList<>();
	          for (int p=2;p<=n;p++) {
	              if (!isComposite[p]) {
	                  primes.add(p);
	                  for (long m=(long)p*p; m<=n; m+=p)
	                      isComposite[(int)m]=true;
	              }
	          }
	          return primes;
	      }
	  
	      static int[] spfSieve(int n) {
	          int[] spf = new int[n+1];
	          for (int i=0;i<=n;i++) spf[i]=i;
	          for (int p=2;(long)p*p<=n;p++)
	              if (spf[p]==p)
	                  for (int m=p*p;m<=n;m+=p)
	                      if (spf[m]==m) spf[m]=p;
	          return spf;
	      }
	  
	      public static void main(String[] args) {
	          System.out.println(sieve(50));
	          int[] spf=spfSieve(100);
	          List<Integer> factors=new ArrayList<>();
	          int n=360;
	          while(n>1){factors.add(spf[n]);n/=spf[n];}
	          System.out.println(factors); // [2, 2, 2, 3, 3, 5]
	      }
	  }
	  ```
	  
	  ```javascript
	  // ─── JavaScript ───────────────────────────────────────────────────────
	  function sieve(n) {
	      const isPrime = new Uint8Array(n+1).fill(1);
	      isPrime[0]=isPrime[1]=0;
	      for (let p=2; p*p<=n; p++)
	          if (isPrime[p])
	              for (let m=p*p; m<=n; m+=p) isPrime[m]=0;
	      return [...isPrime.entries()].filter(([,v])=>v).map(([i])=>i);
	  }
	  
	  console.log(sieve(50));
	  // [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47]
	  console.log(`π(100) = ${sieve(100).length}`); // 25
	  ```
	  
	  ```csharp
	  // ─── C# ──────────────────────────────────────────────────────────────
	  using System;
	  using System.Collections.Generic;
	  
	  class SieveEratosthenes {
	      static List<int> Sieve(int n) {
	          var composite = new bool[n+1];
	          var primes = new List<int>();
	          for (int p=2;p<=n;p++) {
	              if (!composite[p]) {
	                  primes.Add(p);
	                  for (long m=(long)p*p;m<=n;m+=p) composite[(int)m]=true;
	              }
	          }
	          return primes;
	      }
	  
	      static void Main() {
	          var primes = Sieve(50);
	          Console.WriteLine(string.Join(", ", primes));
	          Console.WriteLine($"π(100) = {Sieve(100).Count}"); // 25
	      }
	  }
	  ```
	  
	  :::
- # Key Takeaways
  collapsed:: true
	- Start marking at `p²` — all smaller multiples already marked by earlier primes.
	- Outer loop only runs to `√N` → massive savings over O(N²) trial division.
	- **SPF Sieve** precomputes smallest prime factors → O(log N) factorisation of any number ≤ N.
	- **Segmented Sieve** works in O(√N) memory for very large ranges — cache-friendly.
	- Related: [[Fast Exponentiation]], [[Euclid Algorithm]]
- # More Learn
  collapsed:: true
	- ## LeetCode / Resources
		- [LeetCode 204 – Count Primes](https://leetcode.com/problems/count-primes/)
		- [Wikipedia – Sieve of Eratosthenes](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes)
		- [CP-Algorithms – Sieve](https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html)