# Hint 1

The answer is always in the range `1 … n + 1`. So any value `<= 0` or `> n` can never be the answer, and can never stop a smaller value from being the answer — you can ignore them.

If you had a spare boolean array of size `n`, how would you solve it in O(n)? Now: could `nums` itself play the role of that array?
