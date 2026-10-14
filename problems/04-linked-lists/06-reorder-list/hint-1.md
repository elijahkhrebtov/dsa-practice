# Hint 1

Write the result as two lists side by side. For `1 → 2 → 3 → 4 → 5 → 6` the result is `1 → 6 → 2 → 5 → 3 → 4`: the first half `1, 2, 3` going forwards, interleaved with the second half `6, 5, 4` going **backwards**.

A singly linked list only goes forwards, so walking from the tail towards the middle is the expensive part. What if the second half pointed the other way?
