# Hint 2

Use **cyclic sort**: try to put every value `v` with `1 <= v <= n` into its "home" slot, index `v - 1`.

After that, the first index `i` where `nums[i] !== i + 1` tells you that `i + 1` is missing. If every slot holds its own value, the answer is `n + 1`.
