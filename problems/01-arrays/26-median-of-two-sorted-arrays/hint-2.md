# Hint 2

**Binary search** on `i` — the number of elements the left half takes from the **shorter** array (so `0 <= i <= m`). Then `j = half - i` elements come from the other array, where `half = floor((m + n + 1) / 2)`.

A split is valid when the largest left element of each array is `<=` the smallest right element of the other one:
`nums1[i-1] <= nums2[j]` and `nums2[j-1] <= nums1[i]`.

If the first condition fails, `i` is too big; if the second fails, `i` is too small. That's what lets you halve the range each step.
