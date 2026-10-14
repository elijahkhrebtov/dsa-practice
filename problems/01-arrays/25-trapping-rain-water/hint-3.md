# Hint 3

**Two pointers**: `left = 0`, `right = n - 1`, plus running maxima `leftMax` and `rightMax`.

At each step, move the pointer on the side with the **lower** bar. Suppose `height[left] <= height[right]`: some bar on the right is at least as tall as anything we've seen on the left, so column `left`'s level is decided by `leftMax` alone. Update `leftMax`, add `leftMax - height[left]`, move `left` inward. Mirror it for the right side. Stop when the pointers meet.
