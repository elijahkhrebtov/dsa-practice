# Hint 2

`ways(n) = ways(n - 1) + ways(n - 2)`, with `ways(1) = 1` and `ways(2) = 2`. That's the Fibonacci recurrence.

Calling it recursively as written recomputes the same values over and over (`ways(43)` is computed twice, `ways(42)` three times, …), which is exponential. Compute the values **bottom-up** from the small ones instead, and notice that each step only needs the previous two, so two variables are enough.
