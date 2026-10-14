# Hint 2

Each node needs two things:

- **children**: a `Map` from character to child node, or an array of 26 slots indexed by `charCode - 97`;
- **isEnd**: a boolean meaning "an inserted word ends exactly here".

`insert` walks the word from the root, creating missing children, then sets `isEnd` on the last node. `search` and `startsWith` walk the same way and fail as soon as a child is missing. At the end, `startsWith` succeeds just because the node exists, while `search` also needs `isEnd`. Put the shared walking code in one helper.
