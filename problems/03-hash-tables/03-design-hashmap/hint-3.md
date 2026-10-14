# Hint 3

Keep the buckets short by tracking `size`. When `size / capacity` passes a **load factor** such as 0.75, allocate a bucket array twice as large and **re-insert every entry**. Each entry's bucket depends on the capacity, so you can't just copy the old buckets over.

Doubling makes resizes rare, so `put` stays O(1) amortized. For extra robustness, scramble the key's bits before reducing it to an index (e.g. multiply by a large odd constant), so that keys like 0, 1024, 2048, … don't all land in the same bucket.
