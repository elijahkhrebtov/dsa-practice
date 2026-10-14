# Hint 3

Write a recursive `build(current, open, close)`:

- if `current.length === 2 * n`, record `current` and return;
- if `open < n`, recurse with `current + '('`, `open + 1`, `close`;
- if `close < open`, recurse with `current + ')'`, `open`, `close + 1`.

Start with `build('', 0, 0)`. The count of results you get is the n-th Catalan number: 1, 2, 5, 14, 42, …
