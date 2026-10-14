# Hint 2

Use a **doubly linked list** ordered from least recently used (front) to most recently used (back). Each node stores `key`, `value`, `prev` and `next`. With `prev` pointers, a node can unlink itself in O(1) without searching for its predecessor.

Then make the `Map` go from **key → node**, not key → value. `get` finds the node through the map, moves it to the back and returns its value.

Why does each node need to store its own `key`? Think about what you must delete from the map when you evict the front node.
