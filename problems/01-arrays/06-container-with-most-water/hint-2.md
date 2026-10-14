# Hint 2

Use **two pointers**, `left = 0` and `right = n - 1`. At each step, record the current area, then move the pointer at the **shorter** line one step inward (if they're equal, moving either is fine). Stop when they meet.

Why is it safe to discard the shorter line? Every container that still uses it, paired with any line between the pointers, is narrower *and* still capped by that short line, so none of them can beat what you just recorded.
