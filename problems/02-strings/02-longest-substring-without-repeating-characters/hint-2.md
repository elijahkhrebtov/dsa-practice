# Hint 2

Use a **sliding window** `[left, right]` that always holds distinct characters. Grow it one character at a time on the right; when the new character is already in the window, shrink from the left until it isn't. Record the window size after every step.

To know instantly whether (and where) a character is in the window, keep a hash map — or, since the alphabet is small, an array indexed by char code.
