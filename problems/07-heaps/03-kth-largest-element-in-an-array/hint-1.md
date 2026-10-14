# Hint 1

Sorting puts *every* element in its final place, but you only care about one position: index `n - k` of the ascending order.

Two ways to do less work: keep track of only the top k candidates as you scan, or find a way to throw away a big chunk of the array that definitely doesn't contain the answer.
