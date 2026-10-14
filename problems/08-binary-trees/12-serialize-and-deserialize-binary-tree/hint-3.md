# Hint 3

**serialize:** BFS from the root. When you dequeue a real node, output its value and enqueue both children, even the `null` ones. When you dequeue a `null`, output `#`. Join the tokens with `,`. Return some fixed string, like `""`, for an empty tree.

**deserialize:** split on `,`. Create the root from the first token and put it in a queue. While the queue isn't empty, take a node and read the **next two tokens**: they're its left and right child. For each one that isn't `#`, create the node, attach it and enqueue it.

Use a head index rather than `shift()` to dequeue, and compare against `#` explicitly. A falsy check would treat the value `0` as missing.
