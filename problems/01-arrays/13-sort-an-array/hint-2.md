# Hint 2

**Merge sort** (divide & conquer) is O(n log n) on *every* input, which makes it the safest choice here: split the array in two halves, sort each half recursively, then **merge** the two sorted halves in linear time with two pointers.

Quicksort is also O(n log n) on average, but the tests include already-sorted, reverse-sorted and all-equal inputs. A fixed pivot (first/last element) or a partition that sends all equal keys to one side turns it into O(n²) with 100,000-deep recursion. If you go that way, use a random pivot **and** a three-way partition (`< pivot`, `= pivot`, `> pivot`).
