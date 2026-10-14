# Hint 2

This is **backtracking**: write `dfs(r, c, i)` = "can `word[i..]` be spelled starting at (r, c)?"

- Fail immediately if (r, c) is off the board or doesn't hold `word[i]`.
- Succeed if `i` is the last index.
- Otherwise mark the cell as used (e.g. temporarily overwrite it with `'#'`), try the 4 neighbours with `i + 1`, then **restore the cell before returning** — on success *and* on failure. That restore is what keeps the board unchanged and lets other paths reuse the cell later.
