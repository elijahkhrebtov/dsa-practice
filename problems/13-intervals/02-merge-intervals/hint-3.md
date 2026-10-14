# Hint 3

When extending, set the end to `max(groupEnd, next[1])`, **not** just `next[1]`. An interval can sit entirely inside the group (`[1, 10]` then `[2, 3]`), and the end must not shrink.

When you start a new group, push a **new** array `[start, end]` rather than the input's own inner array. Otherwise extending it later would modify the caller's data.
