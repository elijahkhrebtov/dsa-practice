# Hint 3

Algorithm:

1. Insert all numbers into the binary trie. For `b` from 30 down to 0, `bit = (x >> b) & 1`. Each node can be a two-slot array `[child0, child1]`.
2. For each `x`, walk the trie with `result = 0`. At bit `b`, if the child `1 - bit` exists, go there and set `result |= 1 << b`. Otherwise go to child `bit`.
3. The answer is the largest `result` seen.

Each insert and each query is exactly 31 steps, so the total is O(31 · n). Pairing `x` with itself just gives 0, so you can insert everything first and then query, or interleave the two.
