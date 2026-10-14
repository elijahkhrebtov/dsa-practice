# Hint 3

Implementation details:

- Store the full word on its end node (`node.word = word`). When you reach it, push it to the result and set `node.word = null`, so it's reported only once.
- Mark the current cell visited by temporarily overwriting it (for example with `'#'`, which never matches a trie child). Recurse into the 4 neighbours inside the grid, then **restore** the letter.
- Optional speed-up: after returning from a child, if that trie node has no children and no word left, delete it from its parent. Branches whose words are all found then get skipped.
- Recursion depth is at most the longest word length (10), so recursion is safe here.
