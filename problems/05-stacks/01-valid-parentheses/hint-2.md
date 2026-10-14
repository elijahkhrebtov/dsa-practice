# Hint 2

Scan left to right with a stack of the opening brackets that haven't been closed yet.

- Opening bracket → push it.
- Closing bracket → the stack must be non-empty **and** its top must be the matching opener; pop it. Otherwise the string is invalid right away.

At the end, the string is valid only if the stack is empty (leftover openers were never closed). A small map from each closer to its opener keeps the comparison tidy.
