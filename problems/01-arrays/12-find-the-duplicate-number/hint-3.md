# Hint 3

Floyd's algorithm in two phases:

1. **Meet inside the cycle.** Start `slow` and `fast` at index 0. Repeat `slow = nums[slow]`, `fast = nums[nums[fast]]` until they are equal.
2. **Find the entrance.** Put one pointer back at index 0 and leave the other at the meeting point. Move both one step at a time (`p = nums[p]`); the value where they meet is the duplicate.

Phase 2 works because the distance from the start to the cycle entrance equals the distance from the meeting point to the entrance (modulo the cycle length). Index 0 is a safe start: no value is 0, so nothing points back to it and it is never inside the cycle.
