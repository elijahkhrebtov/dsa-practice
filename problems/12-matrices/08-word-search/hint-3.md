# Hint 3

Putting it together:

1. Loop over every cell; return `true` as soon as any `dfs(r, c, 0)` succeeds.
2. In `dfs`: bounds check → letter check (a `'#'` never matches, so the current path is never revisited) → last-letter check → mark → `found = dfs(down) || dfs(up) || dfs(right) || dfs(left)` → unmark → `return found`.

Optional speed-ups for the worst case (a board full of `A`s and a word like `AAAA…B`): first count the letters on the board and give up if `word` needs more of some letter than the board has; and if the word's last letter is rarer on the board than its first, search for the reversed word instead.
