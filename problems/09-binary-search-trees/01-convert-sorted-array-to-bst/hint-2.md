# Hint 2

Use the **middle** element as the root. Everything to its left in the array is a smaller sorted array, which becomes the left subtree. Everything to its right becomes the right subtree. Build each side the same way, recursively.

Pass index bounds `(lo, hi)` rather than slicing the array, so no copies are made. The base case is an empty range (`lo > hi`), which gives `null`. Both halves differ in size by at most one at every level, which is why every node ends up balanced.
