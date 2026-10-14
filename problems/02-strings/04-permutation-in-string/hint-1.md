# Hint 1

Two strings are permutations of each other exactly when every letter appears the same number of times in both. Order doesn't matter at all — only the **letter counts** do.

So you're looking for a window of `s2`, of length `s1.length`, with the same 26 counts as `s1`. How do those counts change when the window moves one step to the right?
