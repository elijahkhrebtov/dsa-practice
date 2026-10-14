# Hint 2

Walk the array once, keeping a `Map` from **value → index** of everything you've already passed.

At index `j`, check the map for `target - nums[j]` **before** adding `nums[j]` itself — that ordering is what stops you from pairing an element with itself, and it guarantees the index you find is smaller than `j`.
