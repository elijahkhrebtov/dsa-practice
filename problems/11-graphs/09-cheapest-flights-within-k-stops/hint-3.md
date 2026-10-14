# Hint 3

- `cost` = array of `Infinity`, `cost[src] = 0`.
- Repeat `k + 1` times:
  - `next` = a **copy** of `cost`.
  - For every flight `[a, b, p]`: if `cost[a] + p < next[b]`, set `next[b] = cost[a] + p`. Read from `cost` (last round), write into `next`.
  - `cost = next`.
- Return `cost[dst]`, or `-1` if it is still `Infinity`.

The copy is the whole trick: if you update `cost` in place, a flight processed early in a round can be chained with another flight later in the *same* round, sneaking in extra flights beyond the limit.
