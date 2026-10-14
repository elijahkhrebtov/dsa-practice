# Hint 2

Use the **sieve of Eratosthenes**. Keep one flag per number below `n` ("still possibly prime"). Walk upward, and every time you meet a number that is still flagged, it's prime: cross out all of its multiples. Whatever stays flagged at the end is prime.

A `Uint8Array(n)` makes a compact, fast flag array.
