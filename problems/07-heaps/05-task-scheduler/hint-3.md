# Hint 3

**Simulation:** each round, pop up to `n + 1` counts, decrement each one, and push back those still above 0. The round costs `n + 1` units, except the very last round, which costs only the number of tasks it actually ran.

**Formula:** let `maxCount` be the highest frequency and `tied` the number of labels with that frequency. Picture `maxCount - 1` blocks of `n + 1` slots, each starting with the most frequent label, followed by one final block containing the tied labels. Everything else fills the gaps. If there are more tasks than slots, there's no idle time at all, so the answer is the larger of `tasks.length` and that skeleton's length.
