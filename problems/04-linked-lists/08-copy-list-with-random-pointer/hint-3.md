# Hint 3

For the O(1)-space follow-up, let the list itself act as the map. Insert each copy **right after** its original: `A → A' → B → B' → …`. Then the copy of any node X is simply `X.next`.

1. Weave: for each original X, insert `X' = new node(X.val)` between X and X.next.
2. Randoms: for each original X, set `X.next.random = X.random ? X.random.next : null`.
3. Unweave: split the list back into the originals and the copies, restoring every original `next`.
