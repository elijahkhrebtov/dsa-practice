# Hint 3

1. Register every letter of every word as a node with in-degree 0 (so letters that are never compared still show up).
2. For each adjacent pair `(a, b)`: find the first index where they differ. If found, add the edge `a[i] → b[i]` — but only if it's new (use a `Set` per letter), and only then increase the in-degree of `b[i]`. If there is no difference and `a` is longer than `b`, return `""` immediately.
3. Kahn: put every letter with in-degree 0 in a queue. Repeatedly take one, append it to the result, and decrement its successors' in-degrees, enqueuing those that reach 0.
4. If the result contains every letter, return it; otherwise there was a cycle — return `""`.
