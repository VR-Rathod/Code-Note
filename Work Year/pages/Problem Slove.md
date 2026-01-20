# Array
	- ## 1 [Missing number](https://leetcode.com/problems/missing-number/)
		- ### 2 why to make it
			- n(n+1) / 2 method -
			  logseq.order-list-type:: number
				- ```C++
				  class Solution {
				  // public:
				  //     int missingNumber(vector<int>& nums) {
				  //         int n = nums.size();
				  
				  //         int totalSum = (n)*(n+1)/2;
				  //         int arrSum = 0;
				  
				  //         for(int i=0; i<n; i++){
				  //             arrSum += nums[i];
				  //         }
				  
				  //         return totalSum - arrSum;
				  //     }
				  // };
				  ```
			- Using XOR Binary method -
			  logseq.order-list-type:: number
				- ```c++
				  class Solution {
				  public:
				      int missingNumber(vector<int>& nums) {
				          int result = nums.size(); // Length
				          for(int i = 0 ; i < nums.size(); i++) {
				              result ^= i ^ nums[i]; // XOR operation
				          }
				          return result;
				      }
				  };
				  ```
				-
		- ## 2 [Plus One](https://leetcode.com/problems/plus-one/description/)
			- ```C++
			  
			  class Solution {
			  public:
			      vector<int> plusOne(vector<int>& digits) {
			          int n = digits.size();  // <-- declare n
			  
			          for (int i = n - 1; i >= 0; i--) {
			              if (digits[i] < 9) {
			                  digits[i]++;       // increment and done
			                  return digits;
			              }
			              digits[i] = 0;         // carry over to the next digit
			          }
			  
			          // If all digits were 9, create a new array [1,0,0,...,0]
			          vector<int> result(n + 1, 0);
			          result[0] = 1;
			          return result;
			      }
			  };
			  ```
			-
		- ## 3 [Missing Number](https://leetcode.com/problems/missing-number/)
			- ```C++
			  class Solution {
			  public:
			      int missingNumber(vector<int>& nums) {
			          int result = nums.size();
			          for(int i = 0 ; i < nums.size(); i++) {
			              result ^= i ^ nums[i];
			          }
			          return result;
			      }
			  };
			  ```
			-
		- ## 4 [Majority Element](https://leetcode.com/problems/majority-element/)
			- ```C++
			  class Solution {
			  public:
			      int majorityElement(vector<int>& nums) {
			          int count = 0;
			          int cendidate = 0;
			  
			          for (int num : nums) {
			              if (count == 0) {
			                  cendidate = num;
			              }
			              count += (num == cendidate) ? 1 : -1;
			          }
			          return cendidate;
			      }
			  };
			  
			  ```
			-
		- ## 5. [Rotate Array](https://leetcode.com/problems/rotate-array/description/)
			- ```C++
			  // Best Case
			  class Solution {
			  public:
			      void rotate(vector<int>& nums, int k) {
			          int n = nums.size();
			          if (n <= 1)
			              return;
			  
			          k %= n; // Normalize k
			          if (k == 0)
			              return; // No rotation needed
			  
			          reverse(nums.begin(), nums.end());
			          reverse(nums.begin(), nums.begin() + k);
			          reverse(nums.begin() + k, nums.end());
			      }
			  };
			  
			  
			  // More Readable case STL Built-in Rotation
			  class Solution {
			  public:
			      void rotate(vector<int>& nums, int k) {
			          int n = nums.size();
			          if (n == 0) return;
			  
			          k %= n;
			          rotate(nums.begin(), nums.end() - k, nums.end());
			      }
			  };
			  
			  // Cyclic Replacement (Advanced Algorithm)
			  class Solution {
			  public:
			      void rotate(vector<int>& nums, int k) {
			          int n = nums.size();
			          k %= n;
			          int count = 0;
			  
			          for (int start = 0; count < n; start++) {
			              int current = start;
			              int prev = nums[start];
			  
			              do {
			                  int next = (current + k) % n;
			                  swap(nums[next], prev);
			                  current = next;
			                  count++;
			              } while (start != current);
			          }
			      }
			  };
			  ```
			-
			- ## 6 [Search Insert Position](https://leetcode.com/problems/search-insert-position/)
				- ```c++
				  // Binary search
				  class Solution {
				  public:
				      int searchInsert(vector<int>& nums, int target) {
				    		int start = 0; int max = nums.size() -1;
				        
				        while(start <= max) {
				          int mid = start + (max - start) / 2;
				          
				          if(nums[mid] == target){
				            return mid;
				          }
				          
				          else if(nums[mid] < target){
				            start = mid + 1;
				          }
				          
				          else {
				            max = mid - 1;
				          }
				        }
				        return start;
				      }
				  };
				  ```
			-
			- ## 7 [Remove Element](https://leetcode.com/problems/remove-element/)
				- ```C++
				  class Solution {
				  public:
				      int removeElement(vector<int>& nums, int val) {
				          int k = 0;
				        	for(int x : nums){ // for(int i; i < nums.size() - 1 ; i++ ) are same
				            if(x != val){
				              nums[k++] = x;
				            }
				          }
				        return k;
				      }
				  };
				  ```
			-
- # Tree
	-