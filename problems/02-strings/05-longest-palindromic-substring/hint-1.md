# Hint 1

Checking all O(n²) substrings and testing each one in O(n) is O(n³). Try flipping the point of view: instead of asking "is this substring a palindrome?", ask "if a palindrome is **centered here**, how far does it reach?"

How many possible centers does a string of length `n` have? (Careful: `"abba"` has no middle character.)
