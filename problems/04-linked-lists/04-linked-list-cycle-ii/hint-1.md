# Hint 1

With a `Set` of visited nodes this is easy: the first node you see a second time is the cycle start. Make that work first.

For O(1) memory, start from the Linked List Cycle solution: `slow` and `fast` meet somewhere inside the loop. That meeting node is generally not the start of the cycle, so you need one more step. Try drawing a list with a tail of 2 nodes and a loop of 4, and see where they meet.
