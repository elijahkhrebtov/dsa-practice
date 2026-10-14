# Hint 3

- **Sift up** (`push`): while the value is smaller than its parent, swap them and move to the parent's index.
- **Sift down** (`pop`): pop the last element off the array. If anything is left, put it at index 0. Then, while it has a child smaller than itself, swap it with the **smaller** of its two children. Check that the right child exists before comparing with it.
- **Heapify** (constructor): copy the input. Then, for `i` from `(n >> 1) - 1` down to `0`, sift down index `i`. Each sift-down only ever starts on top of two subtrees that are already valid heaps, and the total work adds up to O(n).
- `peek` is `heap[0]` and `size` is `heap.length`. Both are already `undefined`/`0` for an empty array.
