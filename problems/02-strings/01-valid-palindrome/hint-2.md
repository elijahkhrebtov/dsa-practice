# Hint 2

Use **two pointers**: `left` starts at index 0, `right` at the last index.

- While `left` points at a non-alphanumeric character, move it right. Same for `right`, moving left. (Don't let them cross while skipping.)
- Now both point at alphanumerics: compare them case-insensitively. A mismatch means `false`; otherwise move both inward.
- When the pointers meet or cross, every pair matched — return `true`.

Checking "is alphanumeric" with `charCodeAt` and the ranges `'0'..'9'`, `'A'..'Z'`, `'a'..'z'` is faster than a regex per character.
