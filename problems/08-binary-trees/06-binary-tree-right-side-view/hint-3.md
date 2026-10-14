# Hint 3

1. If the root is null, return `[]`. Otherwise start with the queue `[root]` and a head index of 0.
2. Each round: save `levelEnd = queue.length`. Dequeue nodes while `head < levelEnd`, pushing each node's non-null children (left first, then right) onto the queue.
3. The node dequeued when `head` becomes `levelEnd` is the rightmost of the level — push its value onto the answer (equivalently, after the round, the visible node is `queue[levelEnd - 1]`).
4. Stop when the head catches up with the end of the queue.
