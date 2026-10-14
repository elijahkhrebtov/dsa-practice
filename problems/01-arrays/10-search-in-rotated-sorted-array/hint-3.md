# Hint 3

Loop while `lo <= hi`:

1. `mid = (lo + hi) >> 1`; if `nums[mid] === target`, you're done.
2. If `nums[lo] <= nums[mid]` (left half sorted): when `nums[lo] <= target < nums[mid]`, set `hi = mid - 1`; otherwise `lo = mid + 1`.
3. Else (right half sorted): when `nums[mid] < target <= nums[hi]`, set `lo = mid + 1`; otherwise `hi = mid - 1`.

Return -1 when the range becomes empty. Mind the `<=` in step 2: when `lo === mid` the "left half" is a single element and must count as sorted.
