# Hint 1

Suppose `s[i..j]` has no repeats and `s[j + 1]` is a character already inside it. Every substring that starts at `i` (or anywhere up to that earlier copy) and reaches `j + 1` is now invalid.

So when you extend to the right and hit a duplicate, do you really need to start over from scratch — or can you just move the left edge forward?
