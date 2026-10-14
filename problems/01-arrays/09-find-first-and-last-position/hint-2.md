# Hint 2

Run **two** binary searches. In the first, when `nums[mid] === target`, record `mid` as a candidate and keep looking **left** (`hi = mid - 1`), because an earlier occurrence may exist. The last candidate you record is the first occurrence.

The second search is the mirror image: on a match, record and keep looking **right**. Each search is O(log n), however long the run is.
