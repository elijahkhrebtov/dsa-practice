# Hint 3

Keep a running `maxCount` = the highest letter count seen in any window so far, and update it only when a count goes **up** (when extending to the right). Don't bother lowering it when you shrink.

Why is that safe? The answer can only improve when a window has a *higher* `maxCount` than any before it. A stale, too-large `maxCount` can only keep the window from shrinking — it then slides along at its current size, never growing past the best valid size seen so far. So you only need an `if` (shrink by one), not a `while`, and the final answer is the window size at the end (or the maximum seen).
