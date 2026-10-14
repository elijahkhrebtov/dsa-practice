# Hint 2

Arrange the blocks as a binary tree: the leaves are the elements, and each internal node stores the sum of its two children. This is a **segment tree**. (A **Fenwick tree** is a compact cousin that answers prefix sums.)

- An update changes one leaf and then only the nodes on its path to the root — O(log n) of them.
- A range is covered by O(log n) nodes whose segments lie fully inside it.

You can store the whole tree in one array of size `2n`: leaves at `n … 2n-1`, node `i` has children `2i` and `2i+1`.
