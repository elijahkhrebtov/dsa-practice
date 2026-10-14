# Hint 2

Walk both lists together, building the result behind a **dummy node** with a `tail` pointer. At each step take `x = l1 ? l1.val : 0` and `y = l2 ? l2.val : 0`, so a list that ended counts as zeros.

Keep looping while **either** list still has nodes **or** the carry is non-zero. That last condition is what produces the extra leading `1` in `99 + 1 = 100`.
