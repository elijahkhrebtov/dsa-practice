# Hint 2

Put a **dummy node** in front of the head and keep a pointer `groupPrev`: the node just before the current group (the dummy at first). The first group's new head then needs no special case, and the answer is `dummy.next`.

For each group:

- From `groupPrev`, walk `k` steps to find the group's last node `kth`. If you hit `null` first, you're done.
- Remember `groupNext = kth.next`, the first node after the group.
- After reversing, the group's old first node becomes its last node. That old first node is the `groupPrev` for the next group.
