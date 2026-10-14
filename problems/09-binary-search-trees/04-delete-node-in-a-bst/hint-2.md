# Hint 2

The two-children case: some value has to take the deleted node's place and keep everything on the left smaller and everything on the right larger. Two values work: the **largest value in the left subtree** (in-order predecessor) and the **smallest value in the right subtree** (in-order successor).

The successor is the leftmost node of the right subtree, so it has **no left child**. That makes removing it from its old spot easy, since it falls into one of the simpler cases.
