# Hint 2

Still use binary search, but decide the direction differently.

If `nums[lo] <= nums[mid]`, the left half `[lo..mid]` is sorted; otherwise the right half `[mid..hi]` is. For the **sorted** half you can answer "is `target` inside?" with a simple range check on its two endpoints. If it is, search there — if not, it must be in the other half (or nowhere).
