# Hint 1

Why isn't a plain traversal enough? `[1, 2]` (2 is a left child) and `[1, null, 2]` (2 is a right child) have the same pre-order, the same level-order list of values, and so on.

What extra information would make the sequence unambiguous, so a reader always knows where one subtree ends and the next begins?
