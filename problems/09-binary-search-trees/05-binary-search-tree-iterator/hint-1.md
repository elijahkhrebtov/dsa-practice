# Hint 1

The values come out in in-order sequence. You could write that traversal recursively in three lines, but a recursive traversal can't be **paused** between two values and resumed later.

What does the call stack of a recursive in-order traversal hold at the moment it's about to "visit" a node? Could you keep that information yourself?
