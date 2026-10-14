# Hint 3

Make an array of `n + 1` lists, where list `f` holds every value that occurs exactly `f` times. Fill it from your count map.

Then walk the lists from index `n` down to `1`, appending values to the result, and stop as soon as you have `k` of them. Mind the size: a value can occur `n` times, so index `n` must exist.
