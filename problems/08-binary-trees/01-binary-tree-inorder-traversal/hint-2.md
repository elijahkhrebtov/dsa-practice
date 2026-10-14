# Hint 2

Replace the call stack with an array used as a stack, and a `current` pointer that starts at the root.

Repeat while `current` is not null or the stack is not empty:
1. Slide left as far as possible from `current`, pushing every node you pass — these are the nodes waiting for their left subtree to finish.
2. Pop one node: its left subtree is done, so record it.
3. Move `current` to its right child and go back to step 1 (an empty right child just means the next pop happens immediately).
