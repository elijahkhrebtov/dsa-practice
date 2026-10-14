# Hint 3

One pass of the loop:

1. Walk the top row from `left` to `right`, then `top++`.
2. Walk the right column from `top` to `bottom`, then `right--`.
3. **Only if `top <= bottom` still holds**: walk the bottom row from `right` back to `left`, then `bottom--`.
4. **Only if `left <= right` still holds**: walk the left column from `bottom` back up to `top`, then `left++`.

Steps 3 and 4 need those checks because when only one row (or one column) is left, steps 1–2 already visited it. Walking back along it would add duplicates. Try a 3 × 4 matrix and a 4 × 1 matrix by hand.
