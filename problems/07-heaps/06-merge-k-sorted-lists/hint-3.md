# Hint 3

1. Push every non-null head into a min-heap with the comparator `(a, b) => a.val - b.val`.
2. Start a dummy node with a `tail` pointer.
3. Loop while the heap isn't empty. Pop the smallest node, attach it after `tail`, and move `tail` forward. If the popped node has a `next`, push that `next`, because it's now its list's candidate.
4. Return `dummy.next`. It is `null` automatically if nothing was ever pushed.
