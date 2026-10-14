# Hint 2

**Heap:** a min-heap that never holds more than k elements ends up holding exactly the k largest, and its root is the answer. That's O(n log k).

**Quickselect:** partition around a pivot as in quicksort. Afterwards the pivot is at its final sorted position. Compare that position with `n - k` and continue in only one side. That's O(n) on average, *if* the pivot is good.
