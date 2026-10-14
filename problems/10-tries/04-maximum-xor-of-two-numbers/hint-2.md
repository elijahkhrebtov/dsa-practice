# Hint 2

Store every number in a **binary trie**: write it as 31 bits, most significant first (bit 30 down to bit 0), and insert that bit string. Each node has at most two children, `0` and `1`.

To find the best partner for `x`, walk down from the root. At each bit, prefer the child holding the **opposite** of `x`'s bit, because that puts a 1 into the result at this position. Take the same-bit child only when the opposite one doesn't exist.
