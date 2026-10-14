# Hint 3

For each `right`:

1. Push `right` into both deques, first popping smaller values off the back of the max-deque and larger values off the back of the min-deque.
2. While `nums[maxFront] - nums[minFront] > limit`, move `left` forward by one. If a deque's front index is now `< left`, drop it from the front.
3. Record `right - left + 1`.

Use head indices for the fronts instead of `shift()`. Each index enters and leaves each deque at most once, so the total work is O(n).
