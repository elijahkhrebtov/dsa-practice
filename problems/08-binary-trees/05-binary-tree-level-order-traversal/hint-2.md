# Hint 2

Breadth-first search with a **queue**: dequeue a node, enqueue its left child then its right child. Because children are always added behind everything already waiting, nodes come out level by level, left to right.

The remaining question is where one level ends. Think about what the queue contains at the exact moment you have finished one level and haven't started the next.
