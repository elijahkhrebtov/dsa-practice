# Hint 3

To make each step O(1), keep a single number `matches` = how many of the 26 letters currently have **equal** counts in the window and in `s1`.

When a count changes, check whether that letter was matching before the change and whether it matches after, and adjust `matches` by -1, 0 or +1. The answer is `true` as soon as `matches === 26`.

(An equivalent trick: keep one array `need = counts(s1) - counts(window)` plus the number of non-zero entries.)
