# Hint 2

This is **divide & conquer**: the root splits `inorder` into a left part and a right part, and each part is itself the inorder traversal of a subtree. Recurse on index ranges `[lo, hi]` of `inorder` rather than slicing new arrays.

The step that makes or breaks performance is "where is this root in `inorder`?". Values are distinct, so build a **`Map` from value → inorder index** once, up front.
