# Hint 2

Write a **marker for every missing child** (for example `#`), and put a **separator** between tokens so that `-12` and `1`, `2` can't be confused.

A **level-order (BFS)** traversal that also emits the markers is a good choice: the reader can rebuild the tree level by level, replaying the same queue the writer used. (A pre-order DFS with markers works just as well.) Either way, n nodes produce n + 1 markers, so the string grows linearly.
