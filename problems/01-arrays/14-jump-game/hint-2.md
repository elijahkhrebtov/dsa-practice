# Hint 2

The reachable indices always form a contiguous prefix `[0, farthest]`. So keep just one number, `farthest`, and update it greedily as you scan left to right: from any index you can stand on, you could extend the frontier to `i + nums[i]`.

When does the scan prove the answer is `false`?
