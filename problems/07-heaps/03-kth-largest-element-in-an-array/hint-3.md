# Hint 3

Make quickselect robust:

- Pick the pivot at a **random** index in the current range, so sorted input can't hurt you.
- Partition **three ways** in a single pass with pointers `lt`, `i`, `gt`: smaller values swap to the front (`lt++`, `i++`), bigger values swap to the back (`gt--`, don't advance `i`), and equal values just advance `i`.
- When the pass ends, `[lt, gt]` holds the copies of the pivot. If `n - k` is inside that range, return the pivot. Otherwise narrow `lo`/`hi` to the side that contains it and loop.
