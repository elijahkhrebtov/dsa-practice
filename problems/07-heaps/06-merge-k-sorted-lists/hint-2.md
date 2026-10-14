# Hint 2

The next output node is always the smallest of the k current heads. Keep those heads in a **min-heap** ordered by `node.val`. That turns "find the smallest candidate" into O(log k).

(Another route to the same complexity: merge the lists **in pairs**, round after round, like the merge step of merge sort.)
