# Hint 3

Trie version, step by step:

1. `sorted = [...products].sort()` (default string sort is lexicographic for lowercase letters).
2. For each word in `sorted`, walk or create its path. At **each** node along the way, if `node.suggestions.length < 3`, push the word.
3. Walk `searchWord` from the root. For each character, move to the child. While the path exists, record a copy of `node.suggestions`. Once a child is missing, every remaining prefix gets `[]`, so stop walking.

The answer has exactly `searchWord.length` entries, empty ones included.
