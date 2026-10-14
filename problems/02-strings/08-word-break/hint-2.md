# Hint 2

There are only `n + 1` places a word can start or end, so there are only `n + 1` distinct questions: "can the prefix of length `i` be segmented?" That's **dynamic programming** over prefix lengths.

Put the dictionary in a `Set` so checking "is this substring a word?" is O(1) on average.
