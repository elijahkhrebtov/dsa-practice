# Hint 1

Greedy (always take the biggest square that fits) fails: 12 → 9 + 1 + 1 + 1 uses four squares, but 4 + 4 + 4 uses three.

Think about the **first** square you use instead. If you subtract some square `s ≤ n`, what's left is a smaller instance of the same problem. How is the answer for `n` related to the answers for the numbers `n − s`?
