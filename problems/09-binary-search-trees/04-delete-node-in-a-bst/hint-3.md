# Hint 3

A clean recursive shape: `deleteNode(node, key)` returns the new root of that subtree.

- `node` is null → return null (key not found).
- `key < node.val` → `node.left = deleteNode(node.left, key)`, return `node`. Mirror this for `key > node.val`.
- Found it:
  - no left child → return `node.right`; no right child → return `node.left` (this covers leaves too).
  - two children → find the successor `s` (go right once, then left as far as possible). Copy `s.val` into `node`, then `node.right = deleteNode(node.right, s.val)`. Return `node`.

Assigning the result back to `node.left` / `node.right` at each level is what relinks the tree. That includes the case where the root itself changes.
