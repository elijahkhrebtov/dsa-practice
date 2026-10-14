# Hint 2

Store the words in a trie. Search with a recursive DFS `match(node, i)`, meaning "can the rest of the pattern, starting at index `i`, be matched below `node`?"

- When `i` reaches the end of the pattern, the answer is `node.isEnd`.
- When `pattern[i]` is a letter, follow that single child, or return false if it's missing.
- When `pattern[i]` is `.`, try **every** child, and return true as soon as one of them succeeds.
