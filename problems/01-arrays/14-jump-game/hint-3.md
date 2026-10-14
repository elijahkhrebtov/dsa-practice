# Hint 3

Walk `i` from 0 to the end with `farthest = 0`:

- If `i > farthest`, index `i` can't be reached — and neither can anything after it. Return `false`.
- Otherwise set `farthest = max(farthest, i + nums[i])`; if it's already `>= n - 1`, you can return `true` early.

(Equivalent backwards view: keep a `goal`, initially `n - 1`. Scanning from right to left, whenever `i + nums[i] >= goal`, move `goal` to `i`. The answer is `goal === 0`.)
