# Hint 2

Keep two indices `lo` and `hi` that bound the part of the array still in play (start with the whole array, both ends **inclusive**). While `lo <= hi`:

- look at `mid = Math.floor((lo + hi) / 2)`,
- if it's the target you're done; if it's too small the answer can only be right of `mid`, so move `lo` past it; if it's too big, move `hi` before it.

When the range becomes empty (`lo > hi`) the target isn't there. Moving to `mid + 1` / `mid - 1` (not to `mid`) is what guarantees the loop always terminates.
