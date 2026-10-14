# Hint 3

Write a helper `expand(l, r)` that, while `l >= 0`, `r < n` and `s[l] === s[r]`, does `l--, r++`, and finally reports the palindrome it found: it spans `l + 1 .. r - 1`, so its length is `r - l - 1`.

For every `i`, call `expand(i, i)` (odd) and `expand(i, i + 1)` (even). Keep only the **start index and length** of the best one — don't build substrings inside the loop — and call `s.slice` once at the end.

(The DP alternative: `isPal[i][j] = s[i] === s[j] && (j - i < 2 || isPal[i+1][j-1])`, filled by increasing length — also O(n²) time but O(n²) memory.)
