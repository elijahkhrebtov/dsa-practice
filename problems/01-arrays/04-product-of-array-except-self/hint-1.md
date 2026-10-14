# Hint 1

Split "everything except `nums[i]`" into two parts: everything to the **left** of `i`, and everything to the **right** of `i`.

`answer[i] = (product of nums[0..i-1]) × (product of nums[i+1..n-1])`. Can you get all the left parts in one sweep, and all the right parts in another?
