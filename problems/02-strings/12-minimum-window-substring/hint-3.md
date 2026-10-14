# Hint 3

Start with `need[c]` = how many times `c` appears in `t`, and `missing = t.length`.

- **Add** `s[right]`: if `need[c] > 0`, this copy fills a gap, so do `missing--`. Then `need[c]--` in either case. A negative value means a surplus copy.
- **While `missing === 0`**: the window `[left, right]` is valid. Compare its length with the best so far. Then remove `s[left]`: `need[c]++`, and if that makes `need[c] > 0`, do `missing++`. Then `left++`.

Store the best window as a start index and a length, and slice once at the end. Return `""` if no window was ever valid.
