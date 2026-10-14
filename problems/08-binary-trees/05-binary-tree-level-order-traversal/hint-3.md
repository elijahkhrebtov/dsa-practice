# Hint 3

At the start of each round the queue holds **exactly one whole level**. So:

1. If the root is null, return `[]`. Otherwise start with the queue `[root]` and a head index of 0.
2. While the queue still has unprocessed nodes, remember where the current level ends (`levelEnd = queue.length`), then process the nodes from `head` up to `levelEnd`: record each value in a new `level` array and push its non-null children onto the end of the queue.
3. When `head` reaches `levelEnd`, push `level` onto the result and start the next round.

Advancing a head index (instead of calling `shift()`) keeps each dequeue O(1). An equivalent option: keep a `current` array, build a `next` array of children, then swap them.
