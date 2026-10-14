# Hint 3

The O(n log n) algorithm ("patience sorting"): keep an array `tails`, where `tails[L - 1]` is the smallest tail of any increasing subsequence of length `L` seen so far. It is always strictly increasing.

For each `x` in `nums`:
- binary-search the first index `k` with `tails[k] >= x` (a lower bound);
- if `k === tails.length`, `x` extends the longest subsequence — push it;
- otherwise set `tails[k] = x` (same length, smaller tail).

The answer is `tails.length`. Using `>=` (not `>`) in the search is what makes equal values *replace* rather than extend — that's the "strictly" in strictly increasing. Note that `tails` itself is not necessarily a real subsequence; only its length is meaningful.
