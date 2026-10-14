# Hint 3

Prim with a distance array, no heap needed:

- `best[i]` = cheapest known cost to attach point `i` to the tree so far (start: `Infinity` for all, `0` for point 0). Also keep `inTree[i]`.
- Repeat `n` times: scan for the point **not** in the tree with the smallest `best`; add it to the tree and add `best[it]` to the total. Then, for every point still outside, lower its `best` to its distance from the newly added point if that's smaller.

Each round is O(n), so the whole thing is O(n²) — the same order as merely listing all the edges.
