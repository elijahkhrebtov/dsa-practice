# Hint 2

Allocate one array of length `k` in the constructor and never resize it. Besides the array, keep just two numbers: `head` (index of the front element) and `count` (how many elements are stored).

Every other position can be derived from those two using `% k`. Empty means `count === 0` and full means `count === k`, so the head/tail ambiguity disappears.
