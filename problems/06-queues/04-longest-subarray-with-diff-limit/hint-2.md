# Hint 2

Keep **two monotonic deques** of indices: one with values decreasing from front to back (its front is the window maximum) and one with values increasing (its front is the window minimum).

When a new element arrives, pop from the back of each deque every element that can never again be the max (or the min) while the new element is in the window.
