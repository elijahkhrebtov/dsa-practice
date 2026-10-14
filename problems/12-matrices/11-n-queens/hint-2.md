# Hint 2

Use **backtracking**: `place(row)` tries every column in that row, skips attacked squares, places a queen, recurses into `row + 1`, then removes the queen and tries the next column. Reaching `row === n` means you've found a full solution.

To test "is (r, c) attacked?" in O(1), notice that every square on one `\` diagonal has the same `r - c`, and every square on one `/` diagonal has the same `r + c`. Which three things do you need to keep track of?
