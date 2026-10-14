# Hint 1

Think about the best subarray that **ends exactly at index `i`**. It either is just `[nums[i]]` on its own, or it extends the best subarray ending at `i - 1`.

When is it *not* worth extending what came before?
