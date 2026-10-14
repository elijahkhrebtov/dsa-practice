# Hint 2

An **in-order** traversal (left subtree, node, right subtree) of a BST visits values in ascending order. Count the nodes as you visit them, and the k-th node you visit is the answer.

To make it fast, **stop** the moment the count reaches k, instead of finishing the traversal and building an array of all n values. Before it visits its first node, the walk only goes down the left spine (h steps), so the total work is O(h + k).
