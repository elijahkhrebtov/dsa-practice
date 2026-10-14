# Hint 2

Store a **complete binary tree** level by level in a plain array. The node at index `i` has its children at `2i + 1` and `2i + 2`, and its parent at `(i - 1) >> 1`. The tree has height about `log₂ n`.

- `push`: put the new value in the only spot that keeps the tree complete (the end), then fix the order along the path **up** to the root.
- `pop`: the minimum is at index 0. Fill the hole with the element that is cheapest to remove (the last one), then fix the order along a path **down** from the root.
