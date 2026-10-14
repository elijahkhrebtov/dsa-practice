# Hint 1

Picture yourself standing on one node in the middle of the list. To reverse it, that node's `next` has to point at the node **before** it, not the one after it.

But a singly linked node has no idea what came before it, and the moment you overwrite `next` you lose your way to the rest of the list. What do you need to remember at each step so neither of those becomes a problem?
