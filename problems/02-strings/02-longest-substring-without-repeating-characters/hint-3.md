# Hint 3

Store, for every character, the **last index** where you saw it. When you reach `s[right]` and its last index is `>= left`, jump `left` straight to `lastIndex + 1` instead of stepping one at a time.

Watch the `>= left` check: a character seen *before* the window started (e.g. the first `a` in `"abba"` when you reach the last `a`) must not drag `left` backwards. Then update `lastIndex[s[right]] = right` and `best = max(best, right - left + 1)`.
