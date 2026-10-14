# Hint 1

The simplest correct approach is to build a cleaned-up, lowercased copy and compare it with its reverse. That's O(n) time — but it also allocates O(n) extra memory.

Can you get the same answer by looking at the **original** string from both ends at once, without building anything?
