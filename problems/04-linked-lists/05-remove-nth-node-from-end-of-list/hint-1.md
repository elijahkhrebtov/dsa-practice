# Hint 1

To unlink a node you need a reference to the node **before** it, because that's the `next` you have to change. So the real target is the (n+1)-th node from the end.

When the head itself is removed there is no node before it. What could you put in front of the head so that every node, the head included, has a predecessor?
