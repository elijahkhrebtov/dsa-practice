# Hint 1

If the total is odd, the answer is immediately `false`. Otherwise both groups must sum to exactly `target = total / 2`.

So the question becomes simpler: is there **some subset** of `nums` that adds up to `target`? (The leftover elements automatically form the other group.)
