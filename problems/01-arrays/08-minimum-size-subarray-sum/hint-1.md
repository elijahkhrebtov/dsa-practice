# Hint 1

All numbers are **positive**. So stretching a subarray to the right always makes its sum bigger, and dropping elements from its left always makes it smaller.

Suppose the window `nums[left..right]` already reaches the target. Will any window that starts at `left` and ends further right ever be the shortest?
