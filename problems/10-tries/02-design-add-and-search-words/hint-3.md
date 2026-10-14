# Hint 3

Details that matter:

- **Return early**: the moment one branch under a dot returns true, stop and return true. Don't explore the remaining siblings.
- **End of pattern** checks `isEnd`, not just "the node exists". Otherwise `'ba'` would match a stored `'bad'`.
- The recursion depth is at most the pattern length (≤ 25), so recursion is safe. If you like, keep an iterative fast path for patterns without dots.
