# Hint 2

Use **prefix sums**. Let `S` be the running sum from the root down to the current node. A path that ends at the current node and starts lower down sums to `S - P`, where `P` is the running sum just above where it starts.

So the number of good paths ending here is the number of running sums `P = S - targetSum` seen on the way down. A `Map` from running sum → count answers that in O(1).
