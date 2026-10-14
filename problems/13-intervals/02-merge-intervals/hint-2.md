# Hint 2

Sort a **copy** by start (`[...intervals].sort((a, b) => a[0] - b[0])`). Then walk through it, keeping the output's **last** interval as the "current group".

- If the next interval starts at or before the group's end (`<=`, because touching counts), it belongs to the group, so extend the group's end.
- Otherwise the group is finished, and the next interval starts a new one.
