# Hint 2

Put all the words into a **trie**, then run **one** DFS from each cell that walks the board and the trie together:

- Being at trie node `t` means "the path so far spells the prefix of `t`".
- Stepping onto a cell with letter `ch` is allowed only if `t` has a child `ch`. Otherwise no remaining word continues this way, so return immediately.
- Whenever the current trie node marks the end of a word, you've found that word.
