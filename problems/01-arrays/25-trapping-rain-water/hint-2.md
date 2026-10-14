# Hint 2

Water above column `i` = `min(maxLeft[i], maxRight[i]) - height[i]`.

Recomputing those maxima for every column is O(n²). Instead, precompute them: a **prefix maximum** array from the left and a suffix maximum array from the right. That's O(n) time and O(n) space.

Can you get rid of the two arrays? Only the **smaller** of the two maxima matters for each column.
