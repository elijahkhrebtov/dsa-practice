# Hint 2

Think in rounds. Let `cost[v]` be the cheapest price to reach `v` using **at most `r` flights**. From the round-`r` table you can build the round-`r + 1` table by trying every flight once: `cost[from] + price` is a candidate for `to`.

That is **Bellman-Ford**, stopped after exactly `k + 1` rounds (one per allowed flight) instead of the usual `n - 1`.
