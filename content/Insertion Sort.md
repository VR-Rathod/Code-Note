# Explanation
	- **Insertion Sort** is a simple sorting algorithm that builds the final sorted array one item at a time. It works by gradually taking each element from the unsorted portion and inserting it into its correct position within the sorted portion of the array.
-
- # Steps:
	- The first element is considered already sorted.
	-
	- The next element is taken and inserted into the correct position in the sorted portion of the list.
	-
	- This process is repeated for each element until the entire list is sorted.
-
- # Time Complexity:
	- Best Case (Already Sorted): **O(n)**
	- Average and Worst Case (Unsorted List): O(n^2)**
-
- ```python
  def insertion_sort(arr):
      # Traverse through 1 to len(arr)
      for i in range(1, len(arr)):
          key = arr[i]
          j = i - 1
          # Move elements of arr[0..i-1] that are greater than key
          while j >= 0 and key < arr[j]:
              arr[j + 1] = arr[j]
              j -= 1
          arr[j + 1] = key
  
  # Example usage
  arr = [12, 11, 13, 5, 6]
  insertion_sort(arr)
  print("Sorted array is:", arr)
  ```