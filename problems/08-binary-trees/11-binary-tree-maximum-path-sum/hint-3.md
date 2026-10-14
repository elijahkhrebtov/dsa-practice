# Hint 3

Start the answer at `-Infinity`, not 0, because an all-negative tree has a negative answer. `gain(null)` is 0. For a node:

1. `left = max(0, gain(node.left))` and `right = max(0, gain(node.right))`.
2. Update the answer with `node.val + left + right`.
3. Return `node.val + max(left, right)`.

Call `gain(root)` once and return the recorded answer.
