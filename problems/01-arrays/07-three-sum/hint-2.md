# Hint 2

Sort the array. For each index `i`, run **two pointers** on the part to its right: `lo = i + 1`, `hi = n - 1`.

- Sum too small → move `lo` right (to a bigger number).
- Sum too big → move `hi` left (to a smaller number).
- Sum is zero → record the triplet and move both pointers.

That's O(n) per `i`, so O(n²) in total. Once `nums[i] > 0` you can stop: everything to its right is positive too.
