# Hint 1

Finding the node is plain BST search: compare with `key` and go left or right. Deleting it is the interesting part, and it depends on how many children the node has. Think through each case separately:

- **no children**: what replaces it?
- **one child**: what replaces it?
- **two children**: you can't just move one child up, because where would the other subtree go?
