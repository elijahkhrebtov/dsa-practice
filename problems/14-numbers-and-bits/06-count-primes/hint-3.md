# Hint 3

Two refinements make the sieve fast:

- For a prime `p`, start crossing out at `p * p`. Every smaller multiple `k · p` with `k < p` was already crossed out when you processed the smaller factor `k`.
- So you only need to sieve with `p` while `p * p < n`. Every number still flagged after that is prime.

Count the survivors from 2 to n − 1 (and handle `n < 3` up front).
