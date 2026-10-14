# Hint 3

Start the map with `{0 → 1}`, the empty prefix before index 0, so subarrays that begin at index 0 get counted. Then, for each element:

1. add it to the running sum,
2. add `map[sum - k]` (or 0) to the answer,
3. only **then** increment `map[sum]`.

Doing step 3 before step 2 would let a prefix pair up with itself (the empty subarray) when `k = 0`.
