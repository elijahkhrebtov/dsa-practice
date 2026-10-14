# Hint 2

Following `i → nums[i]` from index 0 traces a path in a "linked list" stored inside the array. Since two different indices point to the duplicate value, the path must eventually loop — and the duplicate is exactly the node where the loop **begins** (two arrows enter it).

Finding the start of a cycle with O(1) memory is Floyd's tortoise-and-hare algorithm (the same one used for Linked List Cycle II).

(Alternative: binary search on the **value** `m` — count how many entries are `<= m`. If that count exceeds `m`, the duplicate is `<= m`. That's O(n log n).)
