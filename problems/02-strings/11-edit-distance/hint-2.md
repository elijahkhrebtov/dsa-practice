# Hint 2

Each subproblem is "edit distance between the first `i` letters of `word1` and the first `j` letters of `word2`". That gives a 2D **dynamic programming** table of size `(m+1) × (n+1)`.

Get the edges right first. Turning `i` letters into the empty string costs `i` deletions, and building `j` letters from the empty string costs `j` insertions.
