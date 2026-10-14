# Hint 2

Use a **sliding window** with a running `sum`. Move `right` forward one element at a time and add it in. Then, **while** `sum >= target`, record the window length and shrink the window from the left: subtract `nums[left]` and move `left` forward.

Each index enters the window once and leaves it at most once, so this is O(n) even though there's a loop inside a loop. Use something like `Infinity` as "not found yet" and turn it into `0` at the end.
