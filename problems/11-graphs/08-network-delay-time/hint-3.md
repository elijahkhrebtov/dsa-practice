# Hint 3

- `dist[k] = 0`, every other `dist` = `Infinity`; push `[0, k]` into a heap ordered by distance.
- Pop `[d, u]`. If `d > dist[u]`, this is an outdated entry (u was already reached faster) — skip it.
- Otherwise, for each edge `u → v` with weight `w`: if `d + w < dist[v]`, set `dist[v] = d + w` and push `[dist[v], v]`.
- When the heap is empty, the answer is `max(dist[1..n])`, or `-1` if any of them is still `Infinity`.

Instead of updating entries inside the heap, you push duplicates and ignore the stale ones ("lazy deletion").
