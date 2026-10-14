# Hint 2

**Exponentiation by squaring** (divide & conquer): `x^n = (x^(n/2))^2` when n is even, and `x · (x^((n−1)/2))^2` when n is odd. Each step halves the exponent, so you need only O(log n) multiplications.

Deal with a negative `n` first: `x^n = (1/x)^(−n)`.
