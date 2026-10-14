# Hint 1

Break it into pieces you already know how to do:

1. Check whether there are at least `k` nodes left. If not, stop, because the leftover stays as is.
2. Reverse exactly those `k` nodes (Reverse Linked List, but stop after `k` nodes).
3. Reconnect the reversed group to what comes **before** it and what comes **after** it.

Which nodes do you need references to, before and after reversing, to do step 3?
