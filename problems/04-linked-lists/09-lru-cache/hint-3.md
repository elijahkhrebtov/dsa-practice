# Hint 3

Use two **sentinel** nodes, `head` and `tail`, that are always present (`head.next` is the LRU entry, `tail.prev` is the MRU entry). Then you never have to special-case an empty list or the ends.

Write two tiny helpers and build everything from them:

- `remove(node)`: `node.prev.next = node.next; node.next.prev = node.prev`
- `addToBack(node)`: insert between `tail.prev` and `tail`

`get(key)`: if the map lacks the key, return -1. Otherwise `remove` the node, `addToBack` it and return its value.
`put(key, value)`: if the key exists, update the value, `remove` and `addToBack`. Otherwise, if the map is at capacity, evict `head.next` (remove it from the list **and** delete its key from the map). Then create a node, add it to the back and to the map.
