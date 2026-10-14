# Hint 3

You don't need preorder ranges either. Preorder lists a root, then its **whole** left subtree, then its whole right subtree. So if you always build the left subtree completely before the right one, the next unused preorder value is the root of the subtree you're about to build.

Keep one counter `next` into `preorder`. `build(lo, hi)`: return `null` if `lo > hi`; otherwise take `preorder[next++]` as the root, look up its inorder index `mid` in the map, then set `left = build(lo, mid - 1)` and `right = build(mid + 1, hi)`, in that order.
