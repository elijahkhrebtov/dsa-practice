# Hint 2

**Expand around the center.** A palindrome is symmetric around its center, and if `s[l..r]` is a palindrome then `s[l-1..r+1]` is one exactly when `s[l-1] === s[r+1]`.

There are `2n - 1` centers: each character (odd lengths) and each gap between two neighbours (even lengths). From each center, grow outwards while the characters on both sides match. Each expansion is O(n), so the whole thing is O(n²) with O(1) extra space.
