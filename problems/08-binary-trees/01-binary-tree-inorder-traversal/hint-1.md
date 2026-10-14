# Hint 1

Recursively, in-order is three steps: traverse the left subtree, record the node, traverse the right subtree. Get that working first.

For the follow-up, think about what the call stack is remembering for you: when you go down into a left subtree, which nodes are "waiting" to be recorded once you come back up — and in what order will you come back to them?
