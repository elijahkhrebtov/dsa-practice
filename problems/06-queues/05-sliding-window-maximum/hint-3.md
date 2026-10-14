# Hint 3

For each index `i`:

1. While the value at the back of the deque is `<=` `nums[i]`, pop the back. It can never be a maximum again.
2. Push `i` at the back.
3. If the front index is `<= i - k`, it has left the window, so drop it from the front. (One check is enough, since only one index expires per step.)
4. Once `i >= k - 1`, the value at the front index is the maximum of window `i - k + 1 … i`. Append it.

Implement the front with a head index rather than `shift()`. Every index is pushed once and popped at most once, so the total is O(n).
