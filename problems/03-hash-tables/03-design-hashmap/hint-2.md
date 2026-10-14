# Hint 2

Use **separate chaining**: an array of buckets, where each bucket is a small list of `[key, value]` entries. A hash function such as `key % capacity` picks the bucket. `put`, `get` and `remove` only ever scan that one bucket.

In `put`, look for the key in its bucket first and overwrite the value if it's there. Only append when the key is new, or you'll end up with stale duplicates.
