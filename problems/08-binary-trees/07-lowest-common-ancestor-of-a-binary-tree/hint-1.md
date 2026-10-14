# Hint 1

Look at a candidate node `x`. There are only three situations:

- `p` and `q` are in **different** subtrees of `x` (one left, one right) → `x` is the answer.
- `x` **is** `p` or `q`, and the other one is somewhere below it → `x` is the answer.
- Both are on the **same** side → the answer is deeper on that side.

So what does each node need to learn from its two children to decide which case it's in?
